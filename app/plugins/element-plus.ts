const needsElementPlus = (path: string) => path === '/profile' || path.startsWith('/profile/')

export default defineNuxtPlugin(async (nuxtApp) => {
  let installed = false

  const install = async () => {
    if (installed) return
    const [{ default: ElementPlus }] = await Promise.all([
      import('element-plus'),
      import('element-plus/dist/index.css'),
      import('~/assets/css/element-variables.css'),
    ])
    nuxtApp.vueApp.use(ElementPlus)
    installed = true
  }

  if (needsElementPlus(nuxtApp.$router.currentRoute.value.path)) await install()

  nuxtApp.$router.beforeEach(async (to) => {
    if (needsElementPlus(to.path)) await install()
  })
})
