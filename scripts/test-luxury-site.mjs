import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { createServer, request as httpRequest } from 'node:http'
import { setTimeout as delay } from 'node:timers/promises'
import test from 'node:test'
import { luxuryPageError } from '../shared/utils/luxurySite.ts'
import { encounterProductPath, encounterProducts } from '../shared/utils/encounterProducts.ts'

test('活动入口策略覆盖生产域名、本地开发和停用入口', () => {
  assert.equal(luxuryPageError('www.lvyv.com', '/luxury/featured-routes'), undefined)
  assert.equal(luxuryPageError('www.lvyv.com', '/luxury/featured-routes/'), undefined)
  assert.equal(luxuryPageError('luxury.lvyv.com', '/luxury/featured-routes'), 404)
  assert.equal(luxuryPageError('localhost', '/luxury/featured-routes'), 410)
  assert.equal(luxuryPageError('localhost', '/luxury/featured-routes', true), undefined)
  assert.equal(luxuryPageError('www.lvyv.com', '/featured-routes'), 404)
  assert.equal(luxuryPageError('luxury.lvyv.com', '/featured-routes'), 404)
  assert.equal(luxuryPageError('www.lvyv.com', '/luxury/featured-routes/extra'), 404)
  assert.equal(luxuryPageError('luxury.lvyv.com', '/activity'), 404)
  assert.equal(luxuryPageError('www.lvyv.com', '/activity'), 404)
  assert.equal(luxuryPageError('luxury.lvyv.com', '/activity/act_123'), 404)
  assert.equal(luxuryPageError('www.lvyv.com', '/activity/act_123'), undefined)
  assert.equal(luxuryPageError('lvyv.com', '/activity/act_123'), undefined)
  assert.equal(luxuryPageError('localhost', '/activity/act_123'), 404)
  assert.equal(luxuryPageError('localhost', '/activity/act_123', true), undefined)
  assert.equal(luxuryPageError('www.lvyv.com', '/activity/act_123', true), undefined)
  assert.equal(luxuryPageError('luxury.lvyv.com', '/luxury/activity/act_123'), 410)
  assert.equal(luxuryPageError('luxury.lvyv.com', '/activity/act_123/extra'), 404)
  assert.equal(luxuryPageError('luxury.lvyv.com', '/login'), 404)
  assert.equal(luxuryPageError('www.lvyv.com', '/encounters'), undefined)
})

test('实际 SSR 构建：活动、错误状态、域名隔离及分享信息', { timeout: 60_000 }, async (t) => {
  const pilots = new Map([
    ['ENC-BJ-CHINA-RITUAL', 532],
    ['ENC-BJ-TCM-PULSE-ACUPUNCTURE', 90],
  ])
  const activeEntries = encounterProducts.filter(product => pilots.has(product.code)).map(product => ({
    productCode: product.code, name: product.title, landingPath: encounterProductPath(product),
    lowestPrice: pilots.get(product.code), currency: 'USD',
  }))
  const catalogPath = '/web-api/commerce/catalog/products'
  let catalogOffline = false
  const api = createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json')
    if (req.url === catalogPath) {
      res.end(JSON.stringify({ code: 200, data: activeEntries }))
      return
    }
    if (req.url.startsWith(catalogPath + '/')) {
      const code = req.url.split('/').at(-1)
      const product = activeEntries.find(item => item.productCode === code)
      const data = product && {
        product, skus: [{ skuCode: 'DEFAULT', name: product.name, price: product.lowestPrice, specifications: [] }],
      }
      const result = catalogOffline ? { code: 503 } : data ? { code: 200, data } : { code: 1005000000 }
      res.end(JSON.stringify(result))
      return
    }
    if (req.url.startsWith('/web-api/tour/cities/options')) {
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
        contentHtml: `<p>Activity body ${code}</p>${code === 'published' ? '<img src="/images/common/logo.png" alt="Activity fixture" onerror="blocked-handler"><script>blocked-script</script><a href="javascript:blocked-link">Unsafe link</a>' : ''}`,
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
  const request = (path, host = 'lvyv.com') => new Promise((resolve, reject) => {
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
      const body = html.match(/<article\b[^>]*class="activity-rich-content"[^>]*>([\s\S]*?)<\/article>/)?.[1]
      assert.match(body, /alt="Activity fixture"/)
      assert.doesNotMatch(body, /blocked-handler|blocked-script|javascript:/)
      assert.match(html, /<header[^>]*class="navbar/)
      assert.doesNotMatch(html, /href="(?:https:\/\/www\.lvyv\.com)?\/health(?:\/|")/)
      for (const path of ['/#hero', '/wish', '/encounters', '/about', '/en/faq/', '/login/', '/login/?redirect=%2Fwish%2Fcreate']) {
        assert.ok(html.includes(`href="https://www.lvyv.com${path}"`), `Main-site navigation: ${path}`)
      }
      assert.match(html, /aria-label="Toggle Navigation"/)
      assert.doesNotMatch(html, /<footer[^>]*class="footer"/)
      assert.match(html, /href="\/activity\/second"/)
      assert.match(html, /rel="canonical" href="https:\/\/www\.lvyv\.com\/activity\/published"/)
      assert.match(html, /property="og:url" content="https:\/\/www\.lvyv\.com\/activity\/published"/)
      assert.match(html, /property="og:image" content="https:\/\/www\.lvyv\.com\/images\/common\/logo.png"/)
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
        assert.ok(html.includes(`rel="canonical" href="https://www.lvyv.com/activity/${code}"`))
      }
    })

    await t.test('客服和推荐从首次 SSR 按活动语言统一显示', async () => {
      for (const [code, chinese] of [['published', true], ['english', false], ['japanese', false], ['legacy', true]]) {
        const html = await (await request(`/activity/${code}`)).text()
        assert.match(html, new RegExp(`<html[^>]*lang="${chinese ? 'zh-CN' : 'en'}"`))
        for (const text of chinese
          ? ['微信号：', '更多精选行程', '左右滑动浏览', '特邀私享']
          : ['WhatsApp:', '+1 202 555 0123', 'More Curated Journeys', 'Swipe to explore', 'Exclusive']) assert.ok(html.includes(text), `${code}: ${text}`)
        assert.equal((html.match(/class="staff-email"/g) || []).length, 1)
        assert.match(html, /href="mailto:advisor%40example.com"/)
        assert.match(html, /class="staff-qrcode-container"[\s\S]*?class="staff-email"/)
        const staffMarkup = html.match(/<section[^>]*class="activity-mid-section"[\s\S]*?<\/section>/)?.[0]
        assert.ok(staffMarkup)
        assert.doesNotMatch(staffMarkup, /专属服务|专属高奢旅行顾问|长按识别下方二维码|EXCLUSIVE SERVICE|Your Luxury Travel Advisor|Scan the QR code below/)
        assert.equal((staffMarkup.match(/class="copy-wechat-btn"/g) || []).length, chinese ? 2 : 1)
        if (chinese) assert.doesNotMatch(staffMarkup, /WhatsApp:|\+1 202 555 0123/)
        else assert.doesNotMatch(staffMarkup, /WeChat ID:|lvyv-advisor|wechat-only/)
        assert.doesNotMatch(html, /qrcode-scan-hint|Scan or press and hold in WeChat to connect|微信长按二维码添加/)
        assert.match(html, new RegExp(`aria-label="${chinese ? '切换到第2组推荐' : 'Go to recommendation group 2'}"`))
        assert.match(html, new RegExp(`class="copy-wechat-btn"[^>]*>\\s*${chinese ? '复制' : 'Copy'}\\s*</button>`))
        if (!chinese) assert.doesNotMatch(html, /更多精选行程|微信长按二维码添加|特邀私享/)
      }
    })

    await t.test('精选活动列表的卡片链接指向主站详情', async () => {
      const response = await request('/luxury/featured-routes', 'www.lvyv.com')
      assert.equal(response.status, 200)
      assert.match(response.headers.get('cache-control'), /no-store/)
      const html = await response.text()
      assert.match(html, /Featured Routes/)
      assert.doesNotMatch(html, /Featured Activities|All Activities/)
      assert.match(html, /Private list activity/)
      const activityLink = html.match(/<a\b[^>]*href="https:\/\/www\.lvyv\.com\/activity\/featured-list-item"[^>]*>/)?.[0]
      assert.ok(activityLink)
      assert.doesNotMatch(activityLink, /target="_blank"/)
      assert.match(html, /rel="canonical" href="https:\/\/www\.lvyv\.com\/luxury\/featured-routes"/)
      assert.match(html, /aria-current="page"/)
      assert.equal((await request('/luxury/featured-routes', 'luxury.lvyv.com')).status, 404)
      assert.equal((await request('/featured-routes', 'www.lvyv.com')).status, 404)
    })

    await t.test('精选列表分页保留查询参数', async () => {
      const response = await request('/luxury/featured-routes?page=2', 'www.lvyv.com')
      assert.equal(response.status, 200)
      const html = await response.text()
      assert.match(html, /\/activity\/second-page-item/)
      assert.doesNotMatch(html, /\/activity\/featured-list-item/)
      assert.match(html, /rel="canonical" href="https:\/\/www\.lvyv\.com\/luxury\/featured-routes\?page=2"/)
    })

    await t.test('官网 Encounters 直出静态正文并复用官网导航和页脚', async () => {
      const response = await request('/encounters', 'www.lvyv.com')
      assert.equal(response.status, 200)
      const html = await response.text()
      const main = html.match(/<main\b[^>]*class="encounters-page"[^>]*>([\s\S]*?)<\/main>/)?.[1] || ''
      assert.equal([...main.matchAll(/<section\b/g)].length, 7)
      assert.match(html, /<header\b[^>]*class="navbar"/)
      assert.match(html, /<footer\b[^>]*class="footer"/)
      assert.match(main, /The China <span[^>]*>Ritual<\/span>/)
      assert.match(main, /Solo Encounters in Beijing/)
      assert.match(main, /Solo Encounters in Xi&#39;an/)
      assert.equal([...main.matchAll(/<a\b[^>]*class="solo-card-book"[^>]*>Book<\/a>/g)].length, 16)
      assert.equal([...main.matchAll(/class="solo-card-compare"/g)].length, 16)
      assert.equal([...main.matchAll(/class="solo-tip"[^>]*>\$17 — \$\d+ per experience/g)].length, 2)
      assert.equal([...main.matchAll(/class="upgrade-bar-btn"[^>]*>Start Building →<\/a>/g)].length, 2)
      assert.match(main, /The savings pay for your flight\./)
      assert.doesNotMatch(main, />Details<\/a>/)
      assert.match(main, /href="\/wish\/create"/)
      assert.doesNotMatch(main, /href="#viral"|Loading featured routes|Featured Routes/)

      const payloadPath = html.match(/data-src="(\/encounters\/_payload\.json[^\"]*)"/)?.[1]
      if (payloadPath) {
        const payload = await request(payloadPath, 'www.lvyv.com')
        assert.equal(payload.status, 200, payloadPath)
        assert.match(payload.headers.get('content-type'), /application\/json/)
      }

      const images = [...new Set([...main.matchAll(/<img\b[^>]*src="([^"]+)"/g)].map(match => match[1]))]
      assert.equal(images.length, 7)
      assert.ok(images.every(path => path.startsWith('/images/encounters/') && path.endsWith('.webp')))
      await Promise.all(images.map(async path => {
        const image = await request(path, 'www.lvyv.com')
        assert.equal(image.status, 200, path)
        assert.equal(image.headers.get('content-type'), 'image/webp', path)
      }))
    })

    await t.test('22 个商品直达，只有已上架且有原稿的页面允许预订及索引', async () => {
      const homepage = await (await request('/encounters', 'www.lvyv.com')).text()
      const checkedImages = new Set()
      const routeSections = {
        '/product/beijing-china-ritual': ['savings', 'itinerary', 'included'],
        '/product/beijing-wrist-tcm-day': ['story', 'treatments', 'schedule', 'faq'],
        '/product/beijing-new-face-same-day': ['story', 'treatments', 'schedule', 'faq'],
        '/product/xian-ancient-pharmacy': ['why', 'itinerary', 'included'],
        '/product/xian-wrist-pharmacy-day': ['story', 'treatments', 'schedule', 'faq'],
        '/product/xian-silk-road-fix': ['story', 'treatments', 'schedule', 'faq'],
      }
      for (const product of encounterProducts) {
        const path = encounterProductPath(product)
        assert.ok(homepage.includes(`href="${path}"`), path)
        const response = await request(path, 'www.lvyv.com')
        assert.equal(response.status, 200, path)
        assert.match(response.headers.get('cache-control'), /no-store/)
        const html = await response.text()
        assert.ok(html.includes(`rel="canonical" href="https://www.lvyv.com${path}"`), path)
        if (pilots.has(product.code)) {
          assert.match(html, /<input[^>]*type="date"/)
          assert.match(html, /Continue to checkout/)
          assert.doesNotMatch(html, /name="robots" content="noindex/)
          assert.ok(html.includes(product.kind === 'route' ? 'Preferred departure date' : 'Preferred experience date'))
        } else {
          assert.match(html, /name="robots" content="noindex/)
          assert.match(html, /This encounter is currently unavailable/)
          assert.doesNotMatch(html, /Continue to checkout/)
        }
        if (product.kind === 'route') {
          assert.match(html, /<main\b[^>]*class="route-original"/, path)
          assert.match(html, /<header\b[^>]*class="navbar"/, path)
          assert.match(html, /<footer\b[^>]*class="footer"/, path)
          for (const section of routeSections[path]) assert.ok(html.includes(`id="${section}"`), path)
        }
        const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] || ''
        const photos = [...new Set(
          Array.from(main.replaceAll('&#39;', "'").replaceAll('&quot;', '"').matchAll(/(?:src="|url\(['"]?)(\/images\/encounters\/[^'")\s]+)/g), match => match[1]),
        )]
        assert.ok(photos.length > 0, path)
        for (const photo of photos) {
          assert.ok(photo.endsWith('.webp'), photo)
          if (checkedImages.has(photo)) continue
          checkedImages.add(photo)
          const image = await request(photo, 'www.lvyv.com')
          assert.equal(image.status, 200, photo)
          assert.equal(image.headers.get('content-type'), 'image/webp', photo)
        }
      }
      const sitemap = await (await request('/sitemaps/products.xml', 'www.lvyv.com')).text()
      for (const product of encounterProducts) {
        assert.equal(sitemap.includes(`<loc>https://www.lvyv.com${encounterProductPath(product)}</loc>`), pilots.has(product.code))
      }
      assert.equal((await request('/product/beijing-unknown', 'www.lvyv.com')).status, 404)
    })

    await t.test('价格服务异常时详情可以重试，旧链接保留 301', async () => {
      catalogOffline = true
      try {
        const response = await request('/product/beijing-china-ritual', 'www.lvyv.com')
        assert.equal(response.status, 200)
        const html = await response.text()
        assert.match(html, /name="robots" content="noindex/)
        assert.match(html, /Try again/)
        assert.match(html, /id="itinerary"/)
      } finally {
        catalogOffline = false
      }
      for (const [oldPath, newPath] of [
        ['/china-sim', '/product/china-sim'],
        ['/encounters/chengdu_2', '/chengdu-pandas-and-tea'],
        ['/encounters/xian_2', '/xian-terracotta-and-tang'],
        ['/encounters/enc-bj-china-ritual', '/product/beijing-china-ritual'],
        ['/encounters/ENC-XA-TCM-PULSE-ACUPUNCTURE', '/product/xian-tcm-pulse-acupuncture'],
      ]) {
        const response = await request(oldPath, 'www.lvyv.com')
        assert.equal(response.status, 301, oldPath)
        assert.equal(response.headers.get('location'), newPath, oldPath)
      }
      assert.equal((await request('/product/china-sim', 'www.lvyv.com')).status, 200)
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
    await t.test('SSR 兼容两个官网域名并统一使用 www 分享', async () => {
      for (const host of ['lvyv.com', 'www.lvyv.com']) {
        const response = await request('/activity/published?utm_source=test', host)
        assert.equal(response.status, 200, host)
        assert.equal(response.headers.get('location'), null)
        const html = await response.text()
        assert.match(html, /Activity body published/)
        assert.match(html, /rel="canonical" href="https:\/\/www\.lvyv\.com\/activity\/published"/)
        assert.match(html, /property="og:url" content="https:\/\/www\.lvyv\.com\/activity\/published"/)
      }
    })
    await t.test('旧地址永久移除，不重定向', async () => {
      for (const host of ['www.lvyv.com', 'lvyv.com', 'luxury.lvyv.com']) {
        const response = await request('/luxury/activity/published', host)
        assert.equal(response.status, 410, host)
        assert.equal(response.headers.get('location'), null)
      }
      for (const host of ['luxury.lvyv.com', 'localhost']) {
        for (const path of ['/activity', '/activity/published/?utm_source=test']) {
          const response = await request(path, host)
          assert.equal(response.status, 404, host)
          assert.equal(response.headers.get('location'), null)
        }
      }
      assert.equal((await request('/activity/published/extra')).status, 404)
    })
    await t.test('旧域名不提供主站业务页面', async () => {
      // 预渲染的官网页面由 Nginx 的域名规则隔离，此处只验证 SSR 路由。
      for (const path of ['/login', '/activity/published/extra', '/luxury/featured-routes', '/featured-routes/extra']) {
        assert.equal((await request(path, 'luxury.lvyv.com')).status, 404, path)
      }
      const root = await request('/', 'luxury.lvyv.com')
      assert.equal(root.status, 302)
      assert.equal(root.headers.get('location'), 'https://www.lvyv.com/')
    })
    await t.test('robots 按域名返回，主站和高奢站点不串缓存', async () => {
      for (const host of ['www.lvyv.com', 'luxury.lvyv.com', 'www.lvyv.com', 'luxury.lvyv.com']) {
        const robots = await (await request('/robots.txt', host)).text()
        if (host === 'luxury.lvyv.com') {
          assert.match(robots, /Disallow: \//)
          assert.doesNotMatch(robots, /Allow: \/activity\//)
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
