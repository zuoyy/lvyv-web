import { defineEventHandler, getRequestURL, sendRedirect, setResponseHeaders } from 'h3'

export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  if (!/^\/login\/?$/.test(url.pathname)) return

  setResponseHeaders(event, {
    'cache-control': 'no-store, max-age=0',
    'referrer-policy': 'no-referrer',
    'x-robots-tag': 'noindex, nofollow, noarchive',
  })

  // 旧页面的原生 GET 提交可能残留凭证；在生成 HTML 和客户端状态前移除。
  if (url.searchParams.has('password')) {
    url.searchParams.delete('password')
    url.searchParams.delete('email')
    url.searchParams.delete('account')
    return sendRedirect(event, url.pathname + url.search, 303)
  }
})
