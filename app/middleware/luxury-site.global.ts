import { LUXURY_HOST, luxuryPageError } from '~~/shared/utils/luxurySite'

export default defineNuxtRouteMiddleware((to) => {
  const hostname = useRequestURL().hostname
  const statusCode = luxuryPageError(hostname, to.path, import.meta.dev)
  if (statusCode) {
    throw createError({ statusCode, statusMessage: statusCode === 410 ? 'Gone' : 'Not Found' })
  }
  if (hostname === LUXURY_HOST && to.path === '/') {
    return navigateTo('https://www.lvyv.com/', { external: true, redirectCode: 302 })
  }
})
