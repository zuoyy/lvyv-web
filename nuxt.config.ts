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
        // Preconnect 外部字体源
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        // 载入谷歌字体
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Khula:wght@700;800&family=Inter:wght@300;400;500;600;700;800&family=Inter+Tight:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Noto+Sans+SC:wght@300;400;500;700;900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Caveat:wght@400;500;600;700&family=Rubik:wght@400;500;600;700&display=swap' },
        // FontAwesome 图标
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' }
      ]
    }
  }
})

