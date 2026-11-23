import { LUXURY_HOST, MAIN_SITE_ORIGIN, activityRedirect, luxuryPageError } from '~~/shared/utils/luxurySite'

export default defineNuxtRouteMiddleware((to) => {
  const hostname = useRequestURL().hostname
  const redirect = activityRedirect(hostname, to.path, to.fullPath.slice(to.path.length))
  if (redirect) return navigateTo(redirect, { external: true, redirectCode: 301 })
  const statusCode = luxuryPageError(hostname, to.path, import.meta.dev)
  if (statusCode) {
    throw createError({ statusCode, statusMessage: statusCode === 410 ? 'Gone' : 'Not Found' })
  }
  if (hostname === LUXURY_HOST && to.path === '/') {
    return navigateTo(`${MAIN_SITE_ORIGIN}/`, { external: true, redirectCode: 302 })
  }
})
