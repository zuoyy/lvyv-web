import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, realpath, symlink, mkdir, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { atomicSwitch, snapshot, validateAssets, validCode, publishOnce, PublicationError } from './product-publication.mjs'

test('snapshot requests stay within four concurrent detail reads and reject version drift', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'lvyv-product-test-'))
  let active = 0, maximum = 0, version = 7
  const products = Array.from({ length: 9 }, (_, index) => ({ productCode: `PRODUCT_${index}`, name: `Product ${index}`, cityCode: 'CQ', dayCount: 1 }))
  const content = code => ({ contentVersion: version, product: { productCode: code }, updatedAt: '2026-11-10T00:00:00Z', presentation: { indexable: true }, itinerary: { imageUrls: [], days: [] } })
  const originalFetch = globalThis.fetch
  globalThis.fetch = async url => {
    const pathname = new URL(url).pathname
    let data
    if (pathname.endsWith('/manifest')) data = { version, products }
    else {
      active++; maximum = Math.max(active, maximum)
      await new Promise(resolve => setTimeout(resolve, 10)); active--
      data = content(decodeURIComponent(pathname.split('/')[5]))
    }
    return new Response(JSON.stringify({ code: 200, data }), { status: 200, headers: { 'content-type': 'application/json' } })
  }
  try {
    const base = 'http://fixture.invalid/web-api'
    const manifest = await snapshot(base, root, version)
    assert.equal(maximum, 4)
    assert.equal(manifest.products.length, 9)
    assert.equal(JSON.parse(await readFile(path.join(root, 'PRODUCT_0.json'), 'utf8')).product.productCode, 'PRODUCT_0')
    version++
    await assert.rejects(snapshot(base, root, 7), error => error.code === 'STALE_CONTENT')
  } finally { globalThis.fetch = originalFetch; await rm(root, { recursive: true, force: true }) }
})

test('assets reject signed URLs and unapproved origins', () => {
  const content = { shareImageUrl: 'https://assets.example.com/image.jpg?X-Amz-Signature=secret', itinerary: { imageUrls: [], days: [] } }
  assert.throws(() => validateAssets(content, ['https://assets.example.com']), error => error.code === 'INVALID_ASSET')
  content.shareImageUrl = 'https://other.example.com/image.jpg'
  assert.throws(() => validateAssets(content, ['https://assets.example.com']), error => error.code === 'INVALID_ASSET')
  content.shareImageUrl = '/images/product.jpg'
  assert.doesNotThrow(() => validateAssets(content))
})

test('release symlink switches atomically and product codes are constrained', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'lvyv-release-test-'))
  try {
    const releases = path.join(root, 'releases'), link = path.join(root, 'current')
    await mkdir(releases)
    await mkdir(path.join(releases, 'one')); await mkdir(path.join(releases, 'two'))
    await symlink(path.join(releases, 'one'), link)
    await atomicSwitch(link, path.join(releases, 'two'))
    assert.equal(await realpath(link), await realpath(path.join(releases, 'two')))
    assert.equal(validCode('CHONGQING_ENC_002'), true)
    assert.equal(validCode('../private'), false)
  } finally { await rm(root, { recursive: true, force: true }) }
})

// Exercise real release files and receipts while replacing only network and the expensive build.
async function publicationFixture(run) {
  const root = await realpath(await mkdtemp(path.join(os.tmpdir(), 'lvyv-publish-test-')))
  const originalFetch = globalThis.fetch
  const env = { LVYV_PUBLICATION_API_BASE: 'http://fixture.invalid/web-api', LVYV_PUBLICATION_KEY: 'x'.repeat(32),
    LVYV_STATIC_LINK: path.join(root, 'current'), LVYV_RELEASES_DIR: path.join(root, 'releases'),
    LVYV_PUBLICATION_STATE: path.join(root, 'state'), LVYV_PRODUCT_SOURCE: path.join(root, 'source') }
  const calls = [], claim = { version: 7, leaseToken: 'test-lease' }
  const previous = path.join(env.LVYV_RELEASES_DIR, 'previous')
  await mkdir(previous, { recursive: true }); await mkdir(env.LVYV_PUBLICATION_STATE); await mkdir(env.LVYV_PRODUCT_SOURCE)
  await symlink(previous, env.LVYV_STATIC_LINK)
  await writeFile(path.join(env.LVYV_PUBLICATION_STATE, 'source.json'), JSON.stringify({ source: env.LVYV_PRODUCT_SOURCE }))
  const response = (data, code = 200) => new Response(JSON.stringify({ code, data }), { status: 200 })
  const context = { root, env, claim, previous, calls, response }
  try { await run(context) }
  finally { globalThis.fetch = originalFetch; await rm(root, { recursive: true, force: true }) }
}

test('lost successful receipt is retried before claiming another task', async () => publicationFixture(async ({ env, claim, calls, response }) => {
  const release = path.join(env.LVYV_RELEASES_DIR, 'interrupted')
  await mkdir(release); const previous = await realpath(env.LVYV_STATIC_LINK)
  await atomicSwitch(env.LVYV_STATIC_LINK, release)
  await writeFile(path.join(env.LVYV_PUBLICATION_STATE, 'receipt.json'), JSON.stringify({ claim, release, previous }))
  globalThis.fetch = async url => { const action = new URL(url).pathname.split('/').at(-1); calls.push(action); return response(action === 'claim' ? null : true) }
  await publishOnce(env)
  assert.deepEqual(calls, ['complete', 'claim'])
  assert.equal(await realpath(env.LVYV_STATIC_LINK), release)
  await assert.rejects(readFile(path.join(env.LVYV_PUBLICATION_STATE, 'receipt.json')), { code: 'ENOENT' })
}))

test('expired interrupted receipt rolls back before new work and network failure retains receipt', async () => publicationFixture(async ({ env, claim, previous, response }) => {
  const release = path.join(env.LVYV_RELEASES_DIR, 'expired')
  await mkdir(release); await atomicSwitch(env.LVYV_STATIC_LINK, release)
  const receipt = path.join(env.LVYV_PUBLICATION_STATE, 'receipt.json')
  await writeFile(receipt, JSON.stringify({ claim, release, previous }))
  globalThis.fetch = async () => { throw new Error('network unavailable') }
  await assert.rejects(publishOnce(env))
  assert.ok(await readFile(receipt)); assert.equal(await realpath(env.LVYV_STATIC_LINK), release)
  globalThis.fetch = async url => response(new URL(url).pathname.endsWith('/complete') ? null : null, new URL(url).pathname.endsWith('/complete') ? 409 : 200)
  await publishOnce(env)
  assert.equal(await realpath(env.LVYV_STATIC_LINK), previous)
  await assert.rejects(readFile(receipt), { code: 'ENOENT' })
}))

test('build failure preserves current release and reports only a classified failure', async () => publicationFixture(async ({ env, claim, previous, calls, response }) => {
  globalThis.fetch = async (url, options) => {
    const action = new URL(url).pathname.split('/').at(-1); calls.push({ action, body: options.body && JSON.parse(options.body) })
    return response(action === 'claim' ? claim : action === 'manifest' ? { version: 7, products: [] } : true)
  }
  await publishOnce(env, { generate: async () => { throw new PublicationError('BUILD_FAILED') } })
  assert.equal(await realpath(env.LVYV_STATIC_LINK), previous)
  assert.deepEqual(calls.at(-1), { action: 'fail', body: { claim, errorCode: 'BUILD_FAILED' } })
}))

test('successful build switches once and lost acknowledgement is reconciled on restart', async () => publicationFixture(async ({ env, claim, previous, calls, response }) => {
  let loseAcknowledgement = true
  globalThis.fetch = async (url, options) => {
    const action = new URL(url).pathname.split('/').at(-1); calls.push(action)
    if (action === 'complete' && loseAcknowledgement) throw new Error('reply lost')
    return response(action === 'claim' ? claim : action === 'manifest' ? { version: 7, products: [] } : true)
  }
  const generate = async source => {
    const output = path.join(source, '.output/public')
    await mkdir(path.join(output, 'sitemaps'), { recursive: true }); await mkdir(path.join(output, 'encounters'))
    await writeFile(path.join(output, 'sitemaps/products.xml'), '<urlset/>')
    await writeFile(path.join(output, 'encounters/index.html'), '<h1>Encounters</h1>')
  }
  await publishOnce(env, { generate })
  const active = await realpath(env.LVYV_STATIC_LINK)
  assert.notEqual(active, previous); assert.ok(await readFile(path.join(env.LVYV_PUBLICATION_STATE, 'receipt.json')))
  assert.equal(calls.includes('fail'), false)
  loseAcknowledgement = false
  await publishOnce({ ...env, LVYV_RECOVER_ONLY: '1' })
  assert.equal(await realpath(env.LVYV_STATIC_LINK), active)
  await assert.rejects(readFile(path.join(env.LVYV_PUBLICATION_STATE, 'receipt.json')), { code: 'ENOENT' })
}))

test('new content during build is discarded before the release switch', async () => publicationFixture(async ({ env, claim, previous, calls, response }) => {
  globalThis.fetch = async (url, options) => {
    const action = new URL(url).pathname.split('/').at(-1); calls.push({ action, body: options.body && JSON.parse(options.body) })
    return response(action === 'claim' ? claim : action === 'manifest' ? { version: 7, products: [] } : action !== 'heartbeat')
  }
  await publishOnce(env, { generate: async source => {
    const output = path.join(source, '.output/public')
    await mkdir(path.join(output, 'sitemaps'), { recursive: true }); await mkdir(path.join(output, 'encounters'))
    await writeFile(path.join(output, 'sitemaps/products.xml'), '<urlset/>'); await writeFile(path.join(output, 'encounters/index.html'), '<h1>Encounters</h1>')
  } })
  assert.equal(await realpath(env.LVYV_STATIC_LINK), previous)
  assert.equal(calls.some(call => call.action === 'complete'), false)
  assert.equal(calls.at(-1).body.errorCode, 'STALE_CONTENT')
}))

test('China departure date rolls over independently of browser timezone and across calendar boundaries', async () => {
  const { chinaToday, earliestTravelDate, addTravelDays } = await import('../shared/utils/chinaDate.ts')
  assert.equal(chinaToday(new Date('2026-11-10T15:59:59Z')), '2026-11-10')
  assert.equal(chinaToday(new Date('2026-11-10T16:00:00Z')), '2026-11-11')
  assert.equal(earliestTravelDate(3, new Date('2026-12-30T16:00:00Z')), '2027-01-03')
  assert.equal(addTravelDays('2028-02-28', 1), '2028-02-29')
})
