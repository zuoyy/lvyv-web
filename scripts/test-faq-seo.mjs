import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { createServer } from 'node:http'
import { setTimeout as delay } from 'node:timers/promises'
import test from 'node:test'

test('FAQ 初始 HTML 包含本地化语言、非空描述和固定时区日期，发现文件返回真实内容', { timeout: 60_000 }, async () => {
  const api = createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json')
    const chinese = req.url.includes('zh-CN')
    const title = chinese ? '中国旅行指南' : 'China travel guide'
    const body = chinese ? '准备好支付和交通应用，开始中国旅行。' : 'Prepare payment and transport apps before your trip to China.'
    const key = req.url.split('/').at(-1)
    const manifest = ['body', 'summary', 'seo', 'title'].map(contentKey => ({
      contentKey, categoryKey: 'travel', navigationNodeId: 1, title, indexable: true
    }))
    const data = key === 'manifest' ? manifest
      : key === 'landing-page' ? { title, introHtml: `<p>${body}</p>`, seoDescription: '  ', indexable: true, availableLocales: ['en-US', 'zh-CN'] }
      : req.url.includes('/navigation?') ? [{ id: 1, label: 'Travel', visible: true }]
      : { contentKey: key, title, renderedHtml: key === 'title' ? '' : `<p>${body}</p>`,
          summary: key === 'summary' ? 'Article summary' : '  ',
          seo: { title, description: key === 'seo' ? 'Editorial SEO description' : '  ' },
          breadcrumbs: [], availableLocales: ['en-US', 'zh-CN'], toc: [],
          updatedAt: '2026-11-11T00:30:00Z', indexable: true }
    res.end(JSON.stringify({ code: 200, data }))
  })
  api.listen(0, '127.0.0.1')
  await once(api, 'listening')
  const reservation = createServer()
  reservation.listen(0, '127.0.0.1')
  await once(reservation, 'listening')
  const port = reservation.address().port
  await new Promise(resolve => reservation.close(resolve))
  const runtime = spawn(process.execPath, ['.output/server/index.mjs'], {
    cwd: new URL('..', import.meta.url),
    env: { ...process.env, TZ: 'America/Los_Angeles', NODE_ENV: 'production',
      NITRO_HOST: '127.0.0.1', NITRO_PORT: String(port),
      NUXT_CONTENT_API_BASE: `http://127.0.0.1:${api.address().port}/web-api` },
    stdio: ['ignore', 'pipe', 'pipe']
  })
  let output = ''
  runtime.stdout.on('data', chunk => { output += chunk })
  runtime.stderr.on('data', chunk => { output += chunk })
  const origin = `http://127.0.0.1:${port}`
  try {
    let ready = false
    for (let attempt = 0; attempt < 100; attempt++) {
      try { if ((await fetch(`${origin}/check`)).ok) { ready = true; break } } catch { /* 等待本地 SSR 启动。 */ }
      await delay(100)
    }
    assert.ok(ready, output)
    for (const locale of ['en', 'zh']) {
      for (const key of ['body', 'summary', 'seo', 'title']) {
        const response = await fetch(`${origin}/${locale}/faq/travel/${key}`)
        assert.equal(response.status, 200)
        const html = await response.text()
        // 验证最终 HTML 而非仅检查 Nuxt 配置，防止样式已内联却仍保留阻塞请求。
        assert.doesNotMatch(html, /<link\b[^>]*rel="stylesheet"[^>]*>/)
        const styles = [...html.matchAll(/<style\b[^>]*>(.*?)<\/style>/gs)].map(match => match[1]).join('\n')
        assert.match(styles, /box-sizing:border-box/)
        assert.match(styles, /\.nav-links/)
        assert.match(styles, /\.dropdown-menu/)
        assert.match(styles, /\.help-center/)
        assert.match(styles, /\.faq-markdown/)
        assert.doesNotMatch(styles, /\.hero-cta-group|\.wish-bubble|\.explore-card/)
        assert.match(html, /rel="preload"[^>]+as="font"[^>]+inter-latin-700-normal/)
        assert.match(html, new RegExp(`<html[^>]*lang="${locale === 'zh' ? 'zh-CN' : 'en-US'}"`))
        const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1]
        const expected = key === 'seo' ? 'Editorial SEO description' : key === 'summary' ? 'Article summary'
          : key === 'title' ? locale === 'zh' ? '中国旅行指南' : 'China travel guide'
          : locale === 'zh' ? '准备好支付和交通应用，开始中国旅行。' : 'Prepare payment and transport apps before your trip to China.'
        assert.equal(description, expected)
        assert.ok(html.includes(locale === 'zh' ? '2026年11月11日' : 'November 11, 2026'))
        const jsonLd = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/s)?.[1]
        assert.ok(JSON.parse(jsonLd).some(item => item['@type'] === 'Article' && item.description === expected))
      }
      const landing = await (await fetch(`${origin}/${locale}/faq/`)).text()
      assert.match(landing, /<meta name="description" content="[^\s"][^"]+"/)
      assert.match(landing, new RegExp(`<html[^>]*lang="${locale === 'zh' ? 'zh-CN' : 'en-US'}"`))
    }
    assert.equal((await fetch(`${origin}/en/faq/travel/missing-category/extra`)).status, 404)
    const llms = await fetch(`${origin}/llms.txt`)
    assert.match(llms.headers.get('content-type'), /text\/plain/)
    const markdown = await llms.text()
    assert.match(markdown, /^# Lvyv\n/)
    assert.match(markdown, /\[[^\]]+\]\(https:\/\/www\.lvyv\.com\//)
    for (const path of ['/.well-known/ard.json', '/.well-known/ai-catalog.json', '/ai-catalog.json']) {
      const response = await fetch(`${origin}${path}`)
      assert.equal(response.status, 200)
      assert.match(response.headers.get('content-type'), /application\/json/)
      const manifest = await response.json()
      assert.equal(manifest.entries.length, 2)
      for (const entry of manifest.entries) {
        assert.match(entry.identifier, /^urn:air:www\.lvyv\.com:help:/)
        assert.equal(entry.type, 'text/html')
        assert.equal(new URL(entry.url).hostname, 'www.lvyv.com')
        assert.ok(entry.displayName && entry.representativeQueries.length >= 2)
      }
    }
  } finally {
    if (runtime.exitCode === null) { runtime.kill('SIGTERM'); await once(runtime, 'exit') }
    api.closeAllConnections()
    await new Promise(resolve => api.close(resolve))
  }
})
