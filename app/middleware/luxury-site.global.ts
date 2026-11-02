import { FEATURED_ROUTES_PATH, LUXURY_HOST, MAIN_SITE_ORIGIN, luxuryPageError } from '~~/shared/utils/luxurySite'

export default defineNuxtRouteMiddleware((to) => {
  const hostname = useRequestURL().hostname
  if (hostname === LUXURY_HOST && (to.path === '/activity' || to.path === '/activity/')) {
    return navigateTo(`${MAIN_SITE_ORIGIN}${FEATURED_ROUTES_PATH}${to.fullPath.slice(to.path.length)}`, {
      external: true,
      redirectCode: 301
    })
  }
  const statusCode = luxuryPageError(hostname, to.path, import.meta.dev)
  if (statusCode) {
    throw createError({ statusCode, statusMessage: statusCode === 410 ? 'Gone' : 'Not Found' })
  }
  if (hostname === LUXURY_HOST && to.path === '/') {
    return navigateTo('https://www.lvyv.com/', { external: true, redirectCode: 302 })
  }
})
