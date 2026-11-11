const snapshotDir = import.meta.env.LVYV_PRODUCT_SNAPSHOT
const productCodes: string[] = JSON.parse(import.meta.env.LVYV_PRODUCT_ROUTES || '[]')
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-07-18',
  devtools: { enabled: true },
  features: {
    // SSR 首屏同时需要全局基础样式、导航和正文，避免等待多条样式请求后才能绘制。
    inlineStyles: true
  },
  hooks: {
    'build:manifest': (manifest) => {
      // Nuxt 4.5 对没有 src 的共享组件 chunk 未移除 CSS 依赖；FAQ 的两个样式块
      // 已由 SSRStylesPlugin 内联，保留该依赖会让 HTML 再次阻塞加载同一份 CSS。
      for (const chunk of Object.values(manifest)) {
        if (chunk.name === 'FaqDocumentShell') chunk.css = []
      }
    }
  },

  // 运行时配置，可以通过环境变量（如 NUXT_PUBLIC_API_BASE）覆盖
  runtimeConfig: {
    contentApiBase: import.meta.env.NUXT_CONTENT_API_BASE || 'http://127.0.0.1:8088/web-api',
    previewSecret: '',
    productSnapshot: Boolean(snapshotDir),
    public: {
      apiBase: '/web-api'
    }
  },

  // 本地开发时直连 lvyv-server；生产静态站点仍由 Nginx 代理 /web-api。
  nitro: {
    ...(snapshotDir ? { serverAssets: [{ baseName: 'product-content', dir: snapshotDir }] } : {}),
    routeRules: {
      '/ai-catalog.json': { redirect: '/.well-known/ard.json' },
      '/.well-known/ai-catalog.json': { redirect: '/.well-known/ard.json' },
      '/.well-known/apple-developer-merchantid-domain-association': { headers: { 'content-type': 'text/plain', 'x-content-type-options': 'nosniff' } },
      '/login': { prerender: false, headers: { 'cache-control': 'no-store, max-age=0', 'referrer-policy': 'no-referrer', 'x-robots-tag': 'noindex, nofollow, noarchive' } },
      '/login/**': { prerender: false, headers: { 'cache-control': 'no-store, max-age=0', 'referrer-policy': 'no-referrer', 'x-robots-tag': 'noindex, nofollow, noarchive' } },
      '/referrals': { prerender: false, headers: { 'cache-control': 'no-store, max-age=0', 'x-robots-tag': 'noindex, nofollow, noarchive' } },
      '/referrals/**': { prerender: false, headers: { 'cache-control': 'no-store, max-age=0', 'x-robots-tag': 'noindex, nofollow, noarchive' } },
      '/register': { prerender: false, headers: { 'cache-control': 'no-store, max-age=0', 'x-robots-tag': 'noindex, nofollow, noarchive' } },
      '/register/**': { prerender: false, headers: { 'cache-control': 'no-store, max-age=0', 'x-robots-tag': 'noindex, nofollow, noarchive' } },
      '/auth/**': { prerender: false, headers: { 'cache-control': 'no-store, max-age=0', 'x-robots-tag': 'noindex, nofollow, noarchive' } },

      '/luxury/featured-routes': { prerender: false, headers: { 'cache-control': 'no-store, max-age=0' } },
      '/luxury/featured-routes/**': { prerender: false, headers: { 'cache-control': 'no-store, max-age=0' } },
      '/activity': { prerender: false, headers: { 'cache-control': 'no-store, max-age=0' } },
      '/activity/': { prerender: false, headers: { 'cache-control': 'no-store, max-age=0' } },
      '/activity/**': { prerender: false, headers: { 'cache-control': 'no-store, max-age=0' } },
      '/badges': { prerender: false, headers: { 'cache-control': 'no-store, max-age=0', 'x-robots-tag': 'noindex, nofollow, noarchive' } },
      '/badges/**': { prerender: false, headers: { 'cache-control': 'no-store, max-age=0', 'x-robots-tag': 'noindex, nofollow, noarchive' } },
      '/r/**': { headers: { 'cache-control': 'no-store, max-age=0', 'x-robots-tag': 'noindex, nofollow, noarchive' } },
      '/collect/**': { headers: { 'cache-control': 'no-store, max-age=0', 'x-robots-tag': 'noindex, nofollow, noarchive' } },
      '/encounters': { headers: { 'cache-control': 'no-store, max-age=0' } },
      '/encounters/**': { headers: { 'cache-control': 'no-cache, max-age=0, s-maxage=30' } },
      '/checkout': { prerender: false, headers: { 'cache-control': 'no-store, max-age=0', 'x-robots-tag': 'noindex, nofollow, noarchive' } },
      '/payment/**': { prerender: false, headers: { 'cache-control': 'no-store, max-age=0', 'x-robots-tag': 'noindex, nofollow, noarchive' } },
      '/orders/**/pay': { headers: { 'cache-control': 'no-store, max-age=0', 'x-robots-tag': 'noindex, nofollow, noarchive' } },
      '/care': { prerender: false, headers: { 'cache-control': 'no-store, max-age=0', 'x-robots-tag': 'noindex, nofollow, noarchive' } },
      '/care/**': { prerender: false, headers: { 'cache-control': 'no-store, max-age=0', 'x-robots-tag': 'noindex, nofollow, noarchive' } },
      '/health/concierge': { prerender: false, headers: { 'cache-control': 'no-store, max-age=0', 'x-robots-tag': 'noindex, nofollow, noarchive' } },
      '/health/appointments/**': { prerender: false, headers: { 'cache-control': 'no-store, max-age=0', 'x-robots-tag': 'noindex, nofollow, noarchive' } },
      // 医疗服务依赖实时后台数据，静态发布时不能把构建期空列表写入页面 payload。
      '/health/services': { prerender: false },
      '/health/services/**': { prerender: false },
      '/faq/**': { swr: 60 },
      '/en/faq/**': { swr: 60 },
      '/zh/faq/**': { swr: 60 },
      '/sitemap.xml': { swr: 300 },
      '/sitemaps/products.xml': { swr: false, cache: false, headers: { 'cache-control': 'no-cache, max-age=0, s-maxage=30' } },
      '/sitemaps/**': { swr: 300 }
      // robots.txt 按域名生成，仅使用 HTTP 缓存，避免 Nitro 按路径复用主站内容。
    },
    devProxy: {
      '/web-api': {
        // Nitro 会移除匹配到的代理前缀，因此目标地址需要显式补回 /web-api。
        target: import.meta.env.NUXT_CONTENT_API_BASE || 'http://localhost:8088/web-api',
        changeOrigin: true
      }
    },
    prerender: {
      // Compliance documents must be directly reachable through the static Nginx site.
      failOnError: true,
      concurrency: 4,
      routes: [
        '/encounters', '/sitemaps/products.xml',
        ...productCodes.map(code => `/encounters/${encodeURIComponent(code)}`),
        '/terms',
        '/intellectual-property-rights'
      ],
      // 会员私有页面及动态内容不参与静态路由爬取。
      ignore: [
        '/login', '/login/**',
        '/referrals', '/referrals/**', '/register', '/register/**', '/auth/**',
        '/badges',
        '/trips',
        '/care', '/care/**', '/health/concierge', '/health/appointments/**',
        '/faq',
        '/faq/',
        '/faq/**',
        '/en/faq',
        '/en/faq/',
        '/en/faq/**',
        '/zh/faq',
        '/zh/faq/',
        '/zh/faq/**',
        '/luxury/featured-routes',
        '/luxury/featured-routes/**',
        '/activity',
        '/activity/**',
        '/luxury/activity',
        '/luxury/activity/**'
      ]
    }
  },

  // 全局 CSS 引入
  css: [
    '~/assets/css/fonts.css',
    '~/assets/css/style.css',
    '~/assets/css/design-overrides.css',
    '~/assets/css/health.css'
  ],

  app: {
    head: {
      htmlAttrs: { lang: 'en-US' },
      title: 'Lvyv 旅遇 - Meet China, Not Just Visit It',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'description', content: 'The First Friend in China. Discover real people, hidden stories, and unforgettable journeys through authentic encounters.' }
      ],
      link: [
        // 版本参数用于绕过浏览器对 favicon 的长期缓存
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico?v=2' }
      ]
    }
  }
})
