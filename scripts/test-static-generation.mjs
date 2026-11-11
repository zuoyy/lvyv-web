import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { validateOutput } from './product-publication.mjs'

const code = 'CHONGQING_ENC_002'
const root = await mkdtemp(path.join(tmpdir(), 'lvyv-static-fixture-'))
const snapshot = path.join(root, 'snapshot')
const output = path.join(process.cwd(), '.output/public')
const presentation = {
  seoTitle: 'Chongqing River Stories | Lvyv', seoDescription: 'A two-day Chongqing encounter.',
  indexable: true, answerSummary: 'Meet local storytellers. </script><script>alert(1)</script>',
  highlights: ['Walk the riverside'], suitableFor: ['Curious adults'], unsuitableFor: [],
  included: ['Local guide'], excluded: [], faq: [{ question: 'Where?', answer: 'Chongqing.' }]
}
const content = {
  contentVersion: 4, updatedAt: '2026-11-09T03:00:00Z',
  product: { id: 2, productCode: code, name: 'Chongqing River Stories', summary: 'Explore river neighborhoods.', cityCode: 'chongqing', guaranteedDeparture: true, minimumAdvanceDays: 1 },
  themes: ['Culture'], serviceLanguages: ['English'],
  itinerary: { title: 'River stories', cityCode: 'chongqing', imageUrls: ['/images/common/logo.png'], summary: 'Local neighborhoods', days: [
    { dayNo: 1, title: 'Along the Yangtze', summary: 'Meet the river.', items: [{ title: 'Riverside walk', description: 'Explore the old quay.', projectImageUrls: [], tagGroups: [] }] },
    { dayNo: 2, title: 'Stories above town', summary: 'Hear local stories.', items: [{ title: 'Tea house visit', description: 'A neighborhood tea house.', projectImageUrls: [], tagGroups: [] }] }
  ] }, presentation
}
const privateCode = 'PRIVATE_ENC_001'
const privateContent = { ...content, product: { ...content.product, productCode: privateCode, name: 'Private encounter' }, presentation: { ...presentation, indexable: false } }
const legacyCode = 'LEGACY_ENC_001'
const legacyContent = { ...content, updatedAt: null, product: { ...content.product, productCode: legacyCode, name: 'Legacy encounter' }, presentation: { indexable: true, highlights: [], suitableFor: [], unsuitableFor: [], included: [], excluded: [], faq: [] } }
const manifest = { version: 4, products: [{ productCode: code, name: content.product.name, summary: content.product.summary, cityCode: 'chongqing', cityLabel: 'Chongqing', dayCount: 2, indexable: true, contentVersion: 4, updatedAt: content.updatedAt }] }
manifest.products.push({ ...manifest.products[0], productCode: privateCode, name: privateContent.product.name, indexable: false })
manifest.products.push({ ...manifest.products[0], productCode: legacyCode, name: legacyContent.product.name, updatedAt: null })
try {
  await mkdir(snapshot, { recursive: true })
  await writeFile(path.join(snapshot, 'manifest.json'), JSON.stringify(manifest))
  await writeFile(path.join(snapshot, `${code}.json`), JSON.stringify(content))
  await writeFile(path.join(snapshot, `${privateCode}.json`), JSON.stringify(privateContent))
  await writeFile(path.join(snapshot, `${legacyCode}.json`), JSON.stringify(legacyContent))
  const child = spawn('npm', ['run', 'generate'], {
    env: { ...process.env, LVYV_PRODUCT_SNAPSHOT: snapshot, LVYV_PRODUCT_ROUTES: JSON.stringify([code, privateCode, legacyCode]) },
    stdio: 'inherit'
  })
  const exitCode = await new Promise((resolve, reject) => { child.once('error', reject); child.once('exit', value => resolve(value ?? 1)) })
  if (exitCode !== 0) process.exitCode = exitCode
  else {
    await validateOutput(output, snapshot, manifest)
    const html = await (await import('node:fs/promises')).readFile(path.join(output, `encounters/${code}/index.html`), 'utf8')
    if (!html.includes('fetchpriority="high"')) throw new Error('Primary image missing from initial HTML')
    const legacyHtml = await (await import('node:fs/promises')).readFile(path.join(output, `encounters/${legacyCode}/index.html`), 'utf8')
    if (legacyHtml.includes('Content updated:') || legacyHtml.includes('dateModified')) throw new Error('Unknown legacy date must not be invented')
    if (!html.match(/\\u003c\/script/i) || html.includes('<script>alert(1)</script>')) throw new Error('JSON-LD script escaping failed')
  }
} catch (error) {
  process.stderr.write(`Static fixture failed: ${error.code || error.message}\n`)
  process.exitCode = 1
} finally { await rm(root, { recursive: true, force: true }) }
