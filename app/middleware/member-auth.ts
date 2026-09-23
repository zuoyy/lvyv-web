export default defineNuxtRouteMiddleware((to) => {
  const auth = useMemberAuth()
  if (auth.token.value) return

  return navigateTo({ path: '/login/', query: { redirect: to.fullPath } }, { replace: true })
})
