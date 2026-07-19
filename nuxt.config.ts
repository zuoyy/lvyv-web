// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-07-18',
  devtools: { enabled: true },

  // 运行时配置，可以通过环境变量（如 NUXT_PUBLIC_API_BASE）覆盖
  runtimeConfig: {
    public: {
      apiBase: '/api' // 默认本地代理和 Nginx 代理的前缀
    }
  },

  // 全局 CSS 引入
  css: [
    '~/assets/css/fonts.css',
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
      ]
    }
  }
})
