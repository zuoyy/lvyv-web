import { getRouterParam, proxyRequest, sendRedirect } from 'h3'

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'linkCode')
  if (!code || !/^[A-Za-z0-9_-]{6,32}$/.test(code)) {
    return sendRedirect(event, '/', 302)
  }
  const config = useRuntimeConfig()
  const base = String(config.contentApiBase || 'http://127.0.0.1:8088/web-api').replace(/\/$/, '')
  try {
    return await proxyRequest(event, `${base}/r/${encodeURIComponent(code)}`)
  } catch {
    // 本地或后端暂时不可用时不向访客暴露 Nitro 的 Bad Gateway 堆栈。
    return sendRedirect(event, '/', 302)
  }
})
