import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { createServer, request as httpRequest } from 'node:http'
import { setTimeout as delay } from 'node:timers/promises'
import test from 'node:test'
import { luxuryPageError } from '../shared/utils/luxurySite.ts'

test('活动入口策略覆盖生产域名、本地开发和停用入口', () => {
  assert.equal(luxuryPageError('www.lvyv.com', '/luxury/featured-routes'), undefined)
  assert.equal(luxuryPageError('www.lvyv.com', '/luxury/featured-routes/'), undefined)
  assert.equal(luxuryPageError('luxury.lvyv.com', '/luxury/featured-routes'), 404)
  assert.equal(luxuryPageError('localhost', '/luxury/featured-routes'), 410)
  assert.equal(luxuryPageError('localhost', '/luxury/featured-routes', true), undefined)
  assert.equal(luxuryPageError('www.lvyv.com', '/featured-routes'), 404)
  assert.equal(luxuryPageError('luxury.lvyv.com', '/featured-routes'), 404)
  assert.equal(luxuryPageError('www.lvyv.com', '/luxury/featured-routes/extra'), 404)
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
    if (req.url.startsWith('/web-api/commerce/catalog/products') || req.url.startsWith('/web-api/tour/cities/options')) {
      res.end(JSON.stringify({ code: 200, data: [] }))
      return
    }
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
        language: code === 'english' ? 'en-US' : code === 'japanese' ? 'ja-JP' : code === 'legacy' ? undefined : 'zh-CN',
        shareTitle: `Luxury ${code}`,
        shareDesc: 'Luxury activity fixture',
        shareImageUrl: '/images/common/logo.png',
        contentHtml: `<p>Activity body ${code}</p>`,
        staffList: [
          { id: 1, name: 'Travel Advisor', wechatId: 'lvyv-advisor', whatsapp: '+1 202 555 0123', email: 'advisor@example.com', qrcodeUrl: '/images/common/logo.png' },
          { id: 2, name: 'Second Advisor', wechatId: 'wechat-only', qrcodeUrl: '/images/common/logo.png' },
        ],
        recommendList: Array.from({ length: 10 }, (_, index) => ({ activityCode: index === 0 ? 'second' : `second-${index}`, title: 'Second activity', shareTitle: 'Second activity', shareImageUrl: '' })),
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
      assert.match(html, /<header[^>]*class="navbar/)
      for (const path of ['/#hero', '/wish', '/encounters', '/cities/xian', '/cities/chengdu', '/cities/chongqing', '/health', '/about', '/en/faq/', '/login/', '/login/?redirect=%2Fwish%2Fcreate']) {
        assert.ok(html.includes(`href="https://www.lvyv.com${path}"`), `Main-site navigation: ${path}`)
      }
      assert.match(html, /aria-label="Toggle Navigation"/)
      assert.doesNotMatch(html, /<footer[^>]*class="footer"/)
      assert.match(html, /href="\/activity\/second"/)
      assert.match(html, /rel="canonical" href="https:\/\/luxury\.lvyv\.com\/activity\/published"/)
      assert.match(html, /property="og:url" content="https:\/\/luxury\.lvyv\.com\/activity\/published"/)
      assert.match(html, /property="og:image" content="https:\/\/luxury\.lvyv\.com\/images\/common\/logo.png"/)
      const css = html.match(/href="(\/_nuxt\/[^"?]+\.css)"/)
      if (css) assert.equal((await request(css[1])).status, 200)
      else assert.match(html, /<style[^>]*>[\s\S]*?\.activity-page-shell/)
      assert.equal((await request('/activity/second')).status, 200)
    })

    await t.test('分享入口按活动语言渲染且不带推广参数', async () => {
      for (const [code, label] of [['published', '分享'], ['english', 'Share'], ['japanese', 'Share'], ['legacy', '分享']]) {
        const response = await request(`/activity/${code}?utm_source=share-test`)
        const html = await response.text()
        assert.equal(response.status, 200)
        assert.equal((html.match(/class="activity-share-trigger"/g) || []).length, 1)
        assert.match(html, /class="activity-share-dock"/)
        assert.doesNotMatch(html, /class="activity-share-bottom"/)
        assert.match(html, new RegExp(`class="activity-share-trigger"[^>]*>[\\s\\S]*?${label}\\s*</button>`))
        assert.match(html, /property="og:type" content="website"/)
        assert.match(html, /name="twitter:card" content="summary_large_image"/)
        assert.ok(html.includes(`rel="canonical" href="https://luxury.lvyv.com/activity/${code}"`))
      }
    })

    await t.test('客服和推荐从首次 SSR 按活动语言统一显示', async () => {
      for (const [code, chinese] of [['published', true], ['english', false], ['japanese', false], ['legacy', true]]) {
        const html = await (await request(`/activity/${code}`)).text()
        assert.match(html, new RegExp(`<html[^>]*lang="${chinese ? 'zh-CN' : 'en'}"`))
        for (const text of chinese
          ? ['专属高奢旅行顾问', '微信号：', '更多精选行程', '左右滑动浏览', '特邀私享']
          : ['Your Luxury Travel Advisor', 'WhatsApp:', '+1 202 555 0123', 'More Curated Journeys', 'Swipe to explore', 'Exclusive']) assert.ok(html.includes(text), `${code}: ${text}`)
        assert.equal((html.match(/class="staff-email"/g) || []).length, 1)
        assert.match(html, /href="mailto:advisor%40example.com"/)
        assert.match(html, /class="staff-qrcode-container"[\s\S]*?class="staff-email"/)
        const staffMarkup = html.match(/<section[^>]*class="activity-mid-section"[\s\S]*?<\/section>/)?.[0]
        assert.ok(staffMarkup)
        assert.equal((staffMarkup.match(/class="copy-wechat-btn"/g) || []).length, chinese ? 2 : 1)
        if (chinese) assert.doesNotMatch(staffMarkup, /WhatsApp:|\+1 202 555 0123/)
        else assert.doesNotMatch(staffMarkup, /WeChat ID:|lvyv-advisor|wechat-only/)
        assert.doesNotMatch(html, /qrcode-scan-hint|Scan or press and hold in WeChat to connect|微信长按二维码添加/)
        assert.match(html, new RegExp(`aria-label="${chinese ? '切换到第2组推荐' : 'Go to recommendation group 2'}"`))
        assert.match(html, new RegExp(`class="copy-wechat-btn"[^>]*>\\s*${chinese ? '复制' : 'Copy'}\\s*</button>`))
        if (!chinese) assert.doesNotMatch(html, /专属高奢旅行顾问|更多精选行程|微信长按二维码添加|特邀私享/)
      }
    })

    await t.test('精选活动列表在主站开放，卡片详情指向高奢站点', async () => {
      const response = await request('/luxury/featured-routes', 'www.lvyv.com')
      assert.equal(response.status, 200)
      assert.match(response.headers.get('cache-control'), /no-store/)
      const html = await response.text()
      assert.match(html, /Featured Routes/)
      assert.doesNotMatch(html, /Featured Activities|All Activities/)
      assert.match(html, /Private list activity/)
      assert.match(html, /href="https:\/\/luxury\.lvyv\.com\/activity\/featured-list-item"/)
      const activityLink = html.match(/<a\b[^>]*href="https:\/\/luxury\.lvyv\.com\/activity\/featured-list-item"[^>]*>/)?.[0]
      assert.ok(activityLink)
      assert.doesNotMatch(activityLink, /target="_blank"/)
      assert.match(html, /rel="canonical" href="https:\/\/www\.lvyv\.com\/luxury\/featured-routes"/)
      assert.match(html, /aria-current="page"/)
      assert.equal((await request('/luxury/featured-routes', 'luxury.lvyv.com')).status, 404)
      assert.equal((await request('/featured-routes', 'www.lvyv.com')).status, 404)
    })

    await t.test('精选列表分页和旧活动列表入口保留查询参数', async () => {
      const redirect = await request('/activity?page=2')
      assert.equal(redirect.status, 301)
      assert.equal(redirect.headers.get('location'), 'https://www.lvyv.com/luxury/featured-routes?page=2')
      const response = await request('/luxury/featured-routes?page=2', 'www.lvyv.com')
      assert.equal(response.status, 200)
      const html = await response.text()
      assert.match(html, /https:\/\/luxury\.lvyv\.com\/activity\/second-page-item/)
      assert.doesNotMatch(html, /https:\/\/luxury\.lvyv\.com\/activity\/featured-list-item/)
      assert.match(html, /rel="canonical" href="https:\/\/www\.lvyv\.com\/luxury\/featured-routes\?page=2"/)
      assert.equal((await request('/activity', 'www.lvyv.com')).status, 410)
    })

    await t.test('官网 See All 使用 Featured Routes 地址', async () => {
      const response = await request('/encounters', 'www.lvyv.com')
      assert.equal(response.status, 200)
      const html = await response.text()
      assert.match(html, /href="https:\/\/www\.lvyv\.com\/luxury\/featured-routes"/)
      const activityLink = html.match(/<a\b[^>]*href="https:\/\/luxury\.lvyv\.com\/activity\/featured-list-item"[^>]*>/)?.[0]
      assert.ok(activityLink)
      assert.doesNotMatch(activityLink, /target="_blank"/)
    })

    await t.test('官网首屏提前加载标题和卡片使用的字体', async () => {
      const response = await request('/encounters', 'www.lvyv.com')
      assert.equal(response.status, 200)
      const html = await response.text()
      const fontPreloads = [...html.matchAll(/<link\b[^>]*>/g)]
        .map(match => match[0])
        .filter(link => /rel="preload"/.test(link) && /as="font"/.test(link))
      const fontPaths = fontPreloads.map(link => {
        assert.match(link, /crossorigin="anonymous"/)
        return link.match(/href="([^"]+)"/)[1]
      })
      assert.ok(fontPaths.includes('/fonts/philosopher-bold.ttf'))
      for (const name of ['playfair-display-latin-400', 'inter-latin-400', 'inter-latin-500', 'inter-latin-600']) {
        assert.ok(fontPaths.some(path => path.includes(`${name}-normal.`) && path.endsWith('.woff2')), name)
      }
      const fonts = await Promise.all(fontPaths.map(path => request(path, 'www.lvyv.com')))
      fonts.forEach((font, index) => assert.equal(font.status, 200, fontPaths[index]))
    })

    for (const code of ['missing', 'offline']) {
      await t.test(`${code} 返回 404 和不可用空态`, async () => {
        const response = await request(`/activity/${code}`)
        assert.equal(response.status, 404)
        const html = await response.text()
        assert.match(html, /活动已下线或不存在/)
        assert.match(html, /noindex, nofollow/)
        assert.doesNotMatch(html, /class="activity-share-trigger"/)
      })
    }
    await t.test('上游故障返回 503，不伪装成活动下线', async () => {
      const response = await request('/activity/failure')
      assert.equal(response.status, 503)
      const html = await response.text()
      assert.match(html, /活动暂时无法加载/)
      assert.doesNotMatch(html, /class="activity-share-trigger"/)
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
      for (const path of ['/login', '/encounters', '/activity/published/extra', '/luxury/featured-routes', '/featured-routes/extra']) {
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
          assert.doesNotMatch(robots, /featured-routes/)
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
