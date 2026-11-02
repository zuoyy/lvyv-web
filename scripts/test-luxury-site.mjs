import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { createServer, request as httpRequest } from 'node:http'
import { setTimeout as delay } from 'node:timers/promises'
import test from 'node:test'
import { luxuryPageError } from '../shared/utils/luxurySite.ts'

test('活动入口策略覆盖生产域名、本地开发和停用入口', () => {
  assert.equal(luxuryPageError('luxury.lvyv.com', '/featured-routes'), undefined)
  assert.equal(luxuryPageError('luxury.lvyv.com', '/featured-routes/'), undefined)
  assert.equal(luxuryPageError('www.lvyv.com', '/featured-routes'), 410)
  assert.equal(luxuryPageError('localhost', '/featured-routes'), 410)
  assert.equal(luxuryPageError('localhost', '/featured-routes', true), undefined)
  assert.equal(luxuryPageError('luxury.lvyv.com', '/featured-routes/extra'), 404)
  assert.equal(luxuryPageError('luxury.lvyv.com', '/activity'), undefined)
  assert.equal(luxuryPageError('www.lvyv.com', '/activity'), 410)
  assert.equal(luxuryPageError('luxury.lvyv.com', '/activity/act_123'), undefined)
  assert.equal(luxuryPageError('www.lvyv.com', '/activity/act_123'), 410)
  assert.equal(luxuryPageError('localhost', '/activity/act_123'), 410)
  assert.equal(luxuryPageError('localhost', '/activity/act_123', true), undefined)
  assert.equal(luxuryPageError('www.lvyv.com', '/activity/act_123', true), 410)
  assert.equal(luxuryPageError('luxury.lvyv.com', '/luxury/activity/act_123'), 410)
  assert.equal(luxuryPageError('luxury.lvyv.com', '/activity/act_123/extra'), 404)
  assert.equal(luxuryPageError('luxury.lvyv.com', '/login'), 404)
  assert.equal(luxuryPageError('www.lvyv.com', '/encounters'), undefined)
})

test('实际 SSR 构建：活动、错误状态、域名隔离及分享信息', { timeout: 60_000 }, async (t) => {
  const api = createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json')
    if (req.url.startsWith('/web-api/luxury/activity/published?')) {
      const page = Number(new URL(req.url, 'http://localhost').searchParams.get('page') || 1)
      res.end(JSON.stringify({ code: 200, data: { list: [{
        activityCode: page === 1 ? 'featured-list-item' : 'second-page-item', title: 'Private list activity', shareTitle: 'Private list activity',
        shareDesc: 'List fixture', shareImageUrl: '/images/common/logo.png',
        archiveImageUrl: '/images/common/logo.png', city: 'Shanghai',
      }], total: 25, page, size: 12 } }))
      return
    }
    const code = req.url.split('/').at(-1)
    if (code === 'offline' || code === 'missing') {
      res.end(JSON.stringify({ code: code === 'offline' ? 1013002002 : 1013002001, data: null }))
    } else if (code === 'failure') {
      res.statusCode = 503
      res.end(JSON.stringify({ code: 503, data: null }))
    } else {
      res.end(JSON.stringify({ code: 200, data: {
        activityCode: code,
        shareTitle: `Luxury ${code}`,
        shareDesc: 'Luxury activity fixture',
        shareImageUrl: '/images/common/logo.png',
        contentHtml: `<p>Activity body ${code}</p>`,
        staffList: [],
        recommendList: [{ activityCode: 'second', title: 'Second activity', shareTitle: 'Second activity', shareImageUrl: '' }],
      } }))
    }
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
    env: { ...process.env, NODE_ENV: 'production', NITRO_HOST: '127.0.0.1', NITRO_PORT: String(port),
      NUXT_CONTENT_API_BASE: `http://127.0.0.1:${api.address().port}/web-api` },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  let output = ''
  runtime.stdout.on('data', chunk => { output += chunk })
  runtime.stderr.on('data', chunk => { output += chunk })
  // Node fetch 会忽略自定义 Host，使用 HTTP 客户端模拟 Nginx 真实回源头。
  const request = (path, host = 'luxury.lvyv.com') => new Promise((resolve, reject) => {
    const req = httpRequest({ hostname: '127.0.0.1', port, path, headers: { Host: host }, timeout: 15_000 }, res => {
      const chunks = []
      res.on('data', chunk => chunks.push(chunk))
      res.on('error', reject)
      res.on('end', () => resolve(new Response(Buffer.concat(chunks), { status: res.statusCode, headers: res.headers })))
    })
    req.on('error', reject)
    req.on('timeout', () => req.destroy(new Error('Local SSR request timed out')))
    req.end()
  })
  try {
    let ready = false
    for (let i = 0; i < 100; i++) {
      if (runtime.exitCode !== null) throw new Error(`SSR exited: ${output}`)
      try {
        const health = await request('/check', 'localhost')
        if (health.ok) { ready = true; break }
      } catch { /* 等待本地测试服务启动。 */ }
      await delay(100)
    }
    assert.ok(ready, `SSR did not start: ${output}`)

    await t.test('正文和分享元信息在初始 HTML 中，推荐链接使用新路径', async () => {
      const response = await request('/activity/published?utm_source=test')
      assert.equal(response.status, 200)
      assert.match(response.headers.get('cache-control'), /no-store/)
      const html = await response.text()
      assert.match(html, /Activity body published/)
      assert.match(html, /href="\/activity\/second"/)
      assert.match(html, /rel="canonical" href="https:\/\/luxury\.lvyv\.com\/activity\/published"/)
      assert.match(html, /property="og:url" content="https:\/\/luxury\.lvyv\.com\/activity\/published"/)
      assert.match(html, /property="og:image" content="https:\/\/luxury\.lvyv\.com\/images\/common\/logo.png"/)
      const css = html.match(/href="(\/_nuxt\/[^"?]+\.css)"/)
      assert.ok(css, 'SSR HTML should reference its CSS assets')
      assert.equal((await request(css[1])).status, 200)
      assert.equal((await request('/activity/second')).status, 200)
    })

    await t.test('精选活动列表路由仅在高奢站点开放并渲染卡片', async () => {
      const response = await request('/featured-routes')
      assert.equal(response.status, 200)
      assert.match(response.headers.get('cache-control'), /no-store/)
      const html = await response.text()
      assert.match(html, /Featured Routes/)
      assert.doesNotMatch(html, /Featured Activities|All Activities/)
      assert.match(html, /Private list activity/)
      assert.match(html, /\/activity\/featured-list-item/)
      assert.match(html, /rel="canonical" href="https:\/\/luxury\.lvyv\.com\/featured-routes"/)
      assert.match(html, /aria-current="page"/)
      assert.equal((await request('/featured-routes', 'www.lvyv.com')).status, 410)
    })

    await t.test('新版列表保留分页及旧地址查询参数', async () => {
      const redirect = await request('/activity?page=2')
      assert.equal(redirect.status, 301)
      assert.equal(redirect.headers.get('location'), '/featured-routes?page=2')
      const response = await request('/featured-routes?page=2')
      assert.equal(response.status, 200)
      const html = await response.text()
      assert.match(html, /\/activity\/second-page-item/)
      assert.doesNotMatch(html, /\/activity\/featured-list-item/)
      assert.match(html, /rel="canonical" href="https:\/\/luxury\.lvyv\.com\/featured-routes\?page=2"/)
      assert.equal((await request('/activity', 'www.lvyv.com')).status, 410)
    })

    await t.test('官网 See All 使用 Featured Routes 地址', async () => {
      const response = await request('/encounters', 'www.lvyv.com')
      assert.equal(response.status, 200)
      assert.match(await response.text(), /href="https:\/\/luxury\.lvyv\.com\/featured-routes"/)
    })

    for (const code of ['missing', 'offline']) {
      await t.test(`${code} 返回 404 和不可用空态`, async () => {
        const response = await request(`/activity/${code}`)
        assert.equal(response.status, 404)
        const html = await response.text()
        assert.match(html, /活动已下线或不存在/)
        assert.match(html, /noindex, nofollow/)
      })
    }
    await t.test('上游故障返回 503，不伪装成活动下线', async () => {
      const response = await request('/activity/failure')
      assert.equal(response.status, 503)
      assert.match(await response.text(), /活动暂时无法加载/)
    })
    await t.test('旧地址永久移除，不重定向', async () => {
      for (const host of ['www.lvyv.com', 'lvyv.com', 'luxury.lvyv.com']) {
        const response = await request('/luxury/activity/published', host)
        assert.equal(response.status, 410, host)
        assert.equal(response.headers.get('location'), null)
      }
      for (const host of ['www.lvyv.com', 'lvyv.com', 'localhost']) {
        assert.equal((await request('/activity/published', host)).status, 410, host)
      }
    })
    await t.test('高奢站点不展示主站业务页面或多层伪活动路径', async () => {
      for (const path of ['/login', '/encounters', '/activity/published/extra', '/featured-routes/extra']) {
        assert.equal((await request(path)).status, 404, path)
      }
      const root = await request('/')
      assert.equal(root.status, 302)
      assert.equal(root.headers.get('location'), 'https://www.lvyv.com/')
    })
    await t.test('robots 按域名返回，主站和高奢站点不串缓存', async () => {
      for (const host of ['www.lvyv.com', 'luxury.lvyv.com', 'www.lvyv.com', 'luxury.lvyv.com']) {
        const robots = await (await request('/robots.txt', host)).text()
        if (host === 'luxury.lvyv.com') {
          assert.match(robots, /Allow: \/activity\//)
          assert.match(robots, /Allow: \/activity\$/)
          assert.match(robots, /Allow: \/featured-routes\$/)
          assert.doesNotMatch(robots, /Sitemap:/)
        } else {
          assert.match(robots, /Sitemap: https:\/\/www\.lvyv\.com\/sitemap.xml/)
        }
      }
    })
  } finally {
    if (runtime.exitCode === null) {
      runtime.kill('SIGTERM')
      await once(runtime, 'exit')
    }
    api.closeAllConnections()
    await new Promise(resolve => api.close(resolve))
  }
})
