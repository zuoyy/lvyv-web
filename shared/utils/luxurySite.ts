export const LUXURY_HOST = 'luxury.lvyv.com'
export const LUXURY_ORIGIN = `https://${LUXURY_HOST}`

// SSR 与客户端导航共用入口规则，防止共享构建在主站重新开放活动页面。
export function luxuryPageError(hostname: string, pathname: string, development = false): 404 | 410 | undefined {
  if (/^\/luxury\/activity(?:\/|$)/.test(pathname)) return 410

  const luxuryHost = hostname.toLowerCase() === LUXURY_HOST
  const localDevelopment = development && ['localhost', '127.0.0.1', '[::1]'].includes(hostname)
  if (/^\/activity(?:\/|$)/.test(pathname)) {
    if (!luxuryHost && !localDevelopment) return 410
    if (!/^\/activity\/[A-Za-z0-9_-]+\/?$/.test(pathname)) return 404
    return
  }

  if (luxuryHost && pathname !== '/') return 404
}
