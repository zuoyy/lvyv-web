export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useMemberAuth()
  if (auth.token.value) return

  if (import.meta.client && to.name === 'checkout' && from.matched.length && from.path !== to.path && from.name !== 'login') {
    return navigateTo({ path: '/login/', query: { redirect: to.fullPath, returnTo: from.fullPath } })
  }
  return navigateTo({ path: '/login/', query: { redirect: to.fullPath } }, { replace: true })
})
