import { readFile, writeFile, mkdir, rename, symlink, readlink, rm, realpath, cp, open } from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { pathToFileURL } from 'node:url'

export class PublicationError extends Error { constructor(code) { super(code); this.code = code } }
const check = (condition, code = 'INVALID_OUTPUT') => { if (!condition) throw new PublicationError(code) }
export const validCode = code => typeof code === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(code)
export function validateAssets(content, origins = []) {
  const images = [content.shareImageUrl, ...(content.itinerary?.imageUrls || []), ...(content.itinerary?.days || []).flatMap(day => (day.items || []).flatMap(item => item.projectImageUrls || []))].filter(Boolean)
  for (const image of images) {
    if (image.startsWith('/images/') && !image.includes('..')) continue
    let url; try { url = new URL(image) } catch { throw new PublicationError('INVALID_ASSET') }
    check(url.protocol === 'https:' && !url.username && !url.password, 'INVALID_ASSET')
    check(![...url.searchParams.keys()].some(key => /^(x-amz-|x-goog-|x-oss-|auth_key$|security-token$|awsaccesskeyid$|signature$|expires$|token$|ossaccesskeyid$)/i.test(key)), 'INVALID_ASSET')
    check(!origins.length || origins.includes(url.origin), 'INVALID_ASSET')
  }
}
export async function api(base, endpoint, { secret, body, signal } = {}) {
  const response = await fetch(`${base.replace(/\/$/, '')}/${endpoint}`, {
    method: body === undefined ? 'GET' : 'POST', signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(15000)]) : AbortSignal.timeout(15000),
    headers: { 'Accept-Language': 'en-US', ...(secret ? { 'X-Publication-Key': secret } : {}), ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) })
  })
  check(response.ok, response.status === 409 ? 'STALE_CONTENT' : 'PUBLISH_FAILED')
  const result = await response.json()
  if (result.code !== 200) throw new PublicationError(result.code === 409 ? 'STALE_CONTENT' : 'PUBLISH_FAILED')
  return result.data
}
export async function snapshot(base, directory, expectedVersion, origins = [], signal) {
  const manifest = await api(base, 'commerce/catalog/products/manifest', { signal })
  check(Number.isSafeInteger(manifest.version) && manifest.version === expectedVersion, 'STALE_CONTENT')
  check(Array.isArray(manifest.products) && manifest.products.every(product => validCode(product.productCode)))
  check(new Set(manifest.products.map(p => p.productCode)).size === manifest.products.length)
  await mkdir(directory, { recursive: true })
  let next = 0
  const reads = new AbortController()
  const readSignal = signal ? AbortSignal.any([signal, reads.signal]) : reads.signal
  const results = await Promise.allSettled(Array.from({ length: Math.min(4, manifest.products.length) }, async () => {
    try { while (next < manifest.products.length && !readSignal.aborted) {
      const entry = manifest.products[next++]
      const content = await api(base, `commerce/catalog/products/${encodeURIComponent(entry.productCode)}/content`, { signal: readSignal })
      check(content.contentVersion === expectedVersion && content.product.productCode === entry.productCode, 'STALE_CONTENT')
      check(content.updatedAt == null || !Number.isNaN(Date.parse(content.updatedAt)))
      validateAssets(content, origins)
      // The sitemap uses the exact visible content revision and review timestamp.
      entry.updatedAt = content.updatedAt; entry.indexable = content.presentation.indexable
      await writeFile(path.join(directory, `${entry.productCode}.json`), JSON.stringify(content))
    } } catch (error) { reads.abort(); throw error }
  }))
  const failure = results.find(result => result.status === 'rejected' && result.reason instanceof PublicationError) || results.find(result => result.status === 'rejected')
  if (failure) throw failure.reason
  check(!readSignal.aborted, 'BUILD_FAILED')
  const after = await api(base, 'commerce/catalog/products/manifest', { signal })
  check(after.version === expectedVersion, 'STALE_CONTENT')
  await writeFile(path.join(directory, 'manifest.json'), JSON.stringify(manifest))
  return manifest
}
const escapeHtml = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
export async function validateOutput(directory, snapshotDir, manifest) {
  const sitemap = await readFile(path.join(directory, 'sitemaps/products.xml'), 'utf8')
  for (const product of manifest.products) {
    const code = product.productCode
    const content = JSON.parse(await readFile(path.join(snapshotDir, `${code}.json`), 'utf8'))
    const html = await readFile(path.join(directory, `encounters/${code}/index.html`), 'utf8')
    const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    check((visible.match(/<h1\b/gi) || []).length === 1)
    check(visible.includes(escapeHtml(content.product.name)))
    check(visible.includes('rel="canonical"') && visible.includes(`https://www.lvyv.com/encounters/${code}`))
    const expectedTitle = content.presentation.seoTitle?.trim() || `${content.product.name} | Lvyv`
    check(html.includes(`<title>${escapeHtml(expectedTitle)}</title>`))
    const graphs = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
      .flatMap(match => JSON.parse(match[1]))
    for (const type of ['WebPage', 'BreadcrumbList', 'TouristTrip']) check(graphs.some(node => node['@type'] === type))
    check(!graphs.some(node => node['@type'] === 'Offer'))
    for (const text of [content.presentation.answerSummary, ...['highlights', 'suitableFor', 'unsuitableFor', 'included', 'excluded'].flatMap(key => content.presentation[key] || []),
      ...['meetingPoint', 'endingPoint', 'transport', 'accessibility', 'cancellationPolicy'].map(key => content.presentation[key]),
      ...(content.presentation.faq || []).flatMap(item => [item.question, item.answer])].filter(Boolean)) check(visible.includes(escapeHtml(text)))
    for (const day of content.itinerary.days) {
      check(visible.includes(escapeHtml(day.title)))
      for (const item of day.items) {
        check(visible.includes(escapeHtml(item.title)))
        if (item.description || item.address) check(visible.includes(escapeHtml(item.description || item.address)))
      }
    }
    check(!content.presentation.indexable || sitemap.includes(`/encounters/${code}</loc>`))
    check(content.presentation.indexable || !sitemap.includes(`/encounters/${code}</loc>`))
    check(content.presentation.indexable || visible.includes('noindex, follow'))
    const payload = await readFile(path.join(directory, `encounters/${code}/_payload.json`), 'utf8')
    check(payload.length > 2)
  }
  const listing = await readFile(path.join(directory, 'encounters/index.html'), 'utf8')
  check(listing.includes('<h1'))
  for (const product of manifest.products) check(listing.includes(`/encounters/${product.productCode}`))
  check((sitemap.match(/<loc>/g) || []).length === manifest.products.filter(product => product.indexable).length)
}
export async function durableJson(filename, data) {
  const handle = await open(`${filename}.next`, 'w', 0o600)
  try { await handle.writeFile(data); await handle.sync() } finally { await handle.close() }
  await rename(`${filename}.next`, filename)
  const directory = await open(path.dirname(filename), 'r')
  try { await directory.sync() } finally { await directory.close() }
}
export async function atomicSwitch(link, target) {
  const next = `${link}.next-${process.pid}`
  await symlink(target, next)
  await rename(next, link)
}
const exists = async name => { try { await readFile(name); return true } catch (error) { if (error.code === 'ENOENT') return false; throw error } }
export function runGenerate(cwd, env, signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) { reject(new PublicationError('BUILD_FAILED')); return }
    // No Git operations or dependency installation are allowed in a content task.
    const child = spawn('npm', ['run', 'generate'], { cwd, env, stdio: 'ignore', detached: true })
    let killTimer
    const stop = () => {
      try { process.kill(-child.pid, 'SIGTERM') } catch {}
      killTimer = setTimeout(() => { try { process.kill(-child.pid, 'SIGKILL') } catch {} }, 5000)
      killTimer.unref()
    }
    signal.addEventListener('abort', stop, { once: true })
    child.once('error', () => { signal.removeEventListener('abort', stop); reject(new PublicationError('BUILD_FAILED')) })
    child.once('exit', code => { clearTimeout(killTimer); signal.removeEventListener('abort', stop); code === 0 && !signal.aborted ? resolve() : reject(new PublicationError('BUILD_FAILED')) })
  })
}
export async function publishOnce(env = process.env, { generate = runGenerate } = {}) {
  const { LVYV_PUBLICATION_API_BASE: base, LVYV_PUBLICATION_KEY: secret, LVYV_STATIC_LINK: link, LVYV_RELEASES_DIR: releasePath, LVYV_PUBLICATION_STATE: state } = env
  check(base && secret?.length >= 32 && path.isAbsolute(link || '') && path.isAbsolute(releasePath || '') && path.isAbsolute(state || ''), 'PUBLISH_FAILED')
  await mkdir(releasePath, { recursive: true }); await mkdir(state, { recursive: true })
  const releases = await realpath(releasePath)
  const journalPath = path.join(state, 'receipt.json')
  const worker = (action, body) => api(base, `commerce/product-publication-worker/${action}`, { secret, body })
  // Recover an interrupted switch before claiming anything else. A lost reply is safe to repeat.
  if (await exists(journalPath)) {
    const journal = JSON.parse(await readFile(journalPath, 'utf8'))
    const current = await realpath(link).catch(() => '')
    if (current === journal.release) {
      try { await worker('complete', journal.claim) }
      catch (error) {
        if (error.code !== 'STALE_CONTENT') throw error
        if (journal.previous) await atomicSwitch(link, journal.previous)
        else await rm(link)
      }
    }
    await rm(journalPath)
  }
  if (env.LVYV_RECOVER_ONLY === '1') return
  const source = await realpath(env.LVYV_PRODUCT_SOURCE || process.cwd())
  const sourceJournal = path.join(state, 'source.json')
  const previousSource = await exists(sourceJournal) ? JSON.parse(await readFile(sourceJournal, 'utf8')).source : ''
  if (previousSource !== source) {
    await worker('rebuild', {})
    await durableJson(sourceJournal, JSON.stringify({ source }))
  }
  const claim = await worker('claim', {})
  if (!claim) return
  const started = Date.now(), abort = new AbortController()
  let heartbeatBusy = false, stale = false, switched = false, receiptPending = false, previous = ''
  const pulse = async () => {
    if (heartbeatBusy) return
    heartbeatBusy = true
    try { if (!await worker('heartbeat', claim)) { stale = true; abort.abort() } }
    catch { abort.abort() }
    finally { heartbeatBusy = false }
  }
  const timer = setInterval(() => { void pulse() }, 20000)
  const timeout = setTimeout(() => abort.abort(), 240000)
  const release = path.join(releases, `products-${claim.version}-${Date.now()}`)
  const snapshotDir = path.join(state, `snapshot-${claim.version}`)
  try {
    await rm(snapshotDir, { recursive: true, force: true })
    const manifest = await snapshot(base, snapshotDir, claim.version, (env.LVYV_PUBLIC_ASSET_ORIGINS || '').split(',').filter(Boolean), abort.signal)
    await generate(source, { ...env, LVYV_PRODUCT_SNAPSHOT: snapshotDir }, abort.signal)
    check(!abort.signal.aborted, stale ? 'STALE_CONTENT' : 'BUILD_FAILED')
    const output = path.join(source, '.output/public')
    await validateOutput(output, snapshotDir, manifest)
    check(Date.now() - started < 240000, 'BUILD_FAILED')
    check(await worker('heartbeat', claim), 'STALE_CONTENT')
    await cp(output, release, { recursive: true, errorOnExist: true, force: false })
    check(!abort.signal.aborted && Date.now() - started < 240000, stale ? 'STALE_CONTENT' : 'BUILD_FAILED')
    await writeFile(path.join(release, 'product-release.json'), JSON.stringify({ version: claim.version, builtAt: new Date().toISOString() }))
    previous = await realpath(link).catch(() => '')
    // Durable intent is written before rename so restart can reconcile either side of the switch.
    const receipt = JSON.stringify({ claim, release, previous })
    await durableJson(journalPath, receipt)
    check(await worker('heartbeat', claim), 'STALE_CONTENT')
    await atomicSwitch(link, release); switched = true
    try { await worker('complete', claim) }
    catch (error) { if (error.code !== 'STALE_CONTENT') { receiptPending = true; throw error } throw error }
    await rm(journalPath)
  } catch (error) {
    const code = stale ? 'STALE_CONTENT' : error instanceof PublicationError ? error.code : 'BUILD_FAILED'
    if (!receiptPending) {
      if (switched && await realpath(link).catch(() => '') === release) {
        if (previous) await atomicSwitch(link, previous); else await rm(link)
      }
      await rm(journalPath, { force: true })
      await worker('fail', { claim, errorCode: code }).catch(() => {})
    }
    // Do not print upstream payloads, build output, URLs or credentials.
    process.stderr.write(`Product publication: ${code}\n`)
  } finally { clearInterval(timer); clearTimeout(timeout); await rm(snapshotDir, { recursive: true, force: true }) }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const mode = process.argv[2]
  try {
    if (mode === 'snapshot') {
      const manifest = await api(process.env.LVYV_PUBLICATION_API_BASE, 'commerce/catalog/products/manifest')
      await snapshot(process.env.LVYV_PUBLICATION_API_BASE, process.argv[3], manifest.version, (process.env.LVYV_PUBLIC_ASSET_ORIGINS || '').split(',').filter(Boolean))
    } else if (mode === 'validate') {
      const manifest = JSON.parse(await readFile(path.join(process.argv[3], 'manifest.json'), 'utf8'))
      await validateOutput(process.argv[4], process.argv[3], manifest)
    } else await publishOnce()
  } catch { process.stderr.write('Product publication failed; inspect service configuration.\n'); process.exitCode = 1 }
}
