export default defineNuxtRouteMiddleware((to) => {
  const auth = useMemberAuth()
  if (auth.token.value) return

  return navigateTo(`/login/?redirect=${encodeURIComponent(to.fullPath)}`)
})
