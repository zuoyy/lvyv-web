import { LUXURY_HOST, luxuryPageError } from '../../shared/utils/luxurySite'

export default defineEventHandler((event) => {
  const { hostname, pathname } = getRequestURL(event)
  // Nuxt 内部渲染错误页时保留原始状态，避免将旧入口的 410 覆盖为 404。
  if (pathname === '/__nuxt_error') return
  // 静态资源和同源 API 不属于页面路由；资源缺失由各自处理器返回 404。
  if (/^\/(?:_nuxt\/|images\/|fonts\/|videos\/|web-api\/|favicon\.ico$|robots\.txt$)/.test(pathname)) return

  const statusCode = luxuryPageError(hostname, pathname, import.meta.dev)
  if (statusCode) {
    setHeader(event, 'Cache-Control', 'no-store, max-age=0')
    throw createError({ statusCode, statusMessage: statusCode === 410 ? 'Gone' : 'Not Found' })
  }
  if (hostname === LUXURY_HOST && pathname === '/') {
    return sendRedirect(event, 'https://www.lvyv.com/', 302)
  }
})
