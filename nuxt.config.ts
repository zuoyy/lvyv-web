// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-07-18',
  devtools: { enabled: true },

  // 运行时配置，可以通过环境变量（如 NUXT_PUBLIC_API_BASE）覆盖
  runtimeConfig: {
    contentApiBase: 'http://127.0.0.1:8088/web-api',
    previewSecret: '',
    public: {
      apiBase: '/web-api'
    }
  },

  // 本地开发时直连 lvyv-server；生产静态站点仍由 Nginx 代理 /web-api。
  nitro: {
    routeRules: {
      '/faq/**': { swr: 60 },
      '/en/faq/**': { swr: 60 },
      '/zh/faq/**': { swr: 60 }
    },
    devProxy: {
      '/web-api': {
        // Nitro 会移除匹配到的代理前缀，因此目标地址需要显式补回 /web-api。
        target: 'http://localhost:8088/web-api',
        changeOrigin: true
      }
    },
    prerender: {
      // 积分页中的未来功能入口尚未实现，不参与静态路由爬取。
      ignore: ['/badges', '/trips']
    }
  },

  // 全局 CSS 引入
  css: [
    '~/assets/css/fonts.css',
    '~/assets/css/faq-markdown.css',
    '~/assets/css/style.css',
    '~/assets/css/design-overrides.css'
  ],

  app: {
    head: {
      title: 'Lvyv 旅遇 - Meet China, Not Just Visit It',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'description', content: 'The First Friend in China. Discover real people, hidden stories, and unforgettable journeys through authentic encounters.' }
      ],
      link: [
        // 版本参数用于绕过浏览器对 favicon 的长期缓存
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico?v=2' }
      ],
      script: [
        {
          key: 'navbar-scroll-bootstrap',
          tagPosition: 'bodyClose',
          innerHTML: "(()=>{const nav=document.querySelector('.navbar');if(!nav)return;const sync=()=>nav.classList.toggle('scrolled',window.scrollY>20);sync();window.addEventListener('scroll',sync,{passive:true});window.__lvyvNavbarScrollCleanup=()=>window.removeEventListener('scroll',sync)})()"
        }
      ]
    }
  }
})
