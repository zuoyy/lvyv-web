import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { api, snapshot, validateOutput } from './product-publication.mjs'
let temporary
try {
  let directory = process.env.LVYV_PRODUCT_SNAPSHOT
  if (!directory) {
    directory = temporary = await mkdtemp(path.join(tmpdir(), 'lvyv-products-'))
    const base = process.env.LVYV_PUBLICATION_API_BASE || process.env.NUXT_CONTENT_API_BASE || 'http://127.0.0.1:8088/web-api'
    const manifest = await api(base, 'commerce/catalog/products/manifest')
    await snapshot(base, directory, manifest.version, (process.env.LVYV_PUBLIC_ASSET_ORIGINS || '').split(',').filter(Boolean))
  }
  const manifest = JSON.parse(await readFile(path.join(directory, 'manifest.json'), 'utf8'))
  const child = spawn(process.execPath, ['node_modules/nuxt/bin/nuxt.mjs', 'generate'], {
    stdio: 'inherit', env: { ...process.env, LVYV_PRODUCT_SNAPSHOT: directory, LVYV_PRODUCT_ROUTES: JSON.stringify(manifest.products.map(p => p.productCode)) }
  })
  process.exitCode = await new Promise((resolve, reject) => { child.once('error', reject); child.once('exit', code => resolve(code ?? 1)) })
  if (process.exitCode === 0) await validateOutput('.output/public', directory, manifest)
} catch { process.stderr.write('Static build could not obtain a consistent public product snapshot.\n'); process.exitCode = 1 }
finally { if (temporary) await rm(temporary, { recursive: true, force: true }) }
