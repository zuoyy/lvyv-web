export const LUXURY_HOST = 'luxury.lvyv.com'
export const MAIN_SITE_ORIGIN = 'https://www.lvyv.com'
export const FEATURED_ROUTES_PATH = '/luxury/featured-routes'

const activityDetailPattern = /^\/activity\/[A-Za-z0-9_-]+\/?$/

export function activityPath(code: string): string {
  return `/activity/${encodeURIComponent(code)}`
}

export function activityRedirect(hostname: string, pathname: string, suffix: string): string | undefined {
  if (hostname.toLowerCase() !== LUXURY_HOST) return
  if (pathname === '/activity' || pathname === '/activity/') return `${MAIN_SITE_ORIGIN}${FEATURED_ROUTES_PATH}${suffix}`
  if (activityDetailPattern.test(pathname)) return `${MAIN_SITE_ORIGIN}${pathname.replace(/\/$/, '')}${suffix}`
}

// SSR 与客户端导航共用入口规则，旧域名只处理已发布链接的跳转。
export function luxuryPageError(hostname: string, pathname: string, development = false): 404 | 410 | undefined {
  if (/^\/luxury\/activity(?:\/|$)/.test(pathname)) return 410

  const host = hostname.toLowerCase()
  const mainSite = host === 'www.lvyv.com'
    || (development && ['localhost', '127.0.0.1', '[::1]'].includes(host))
  if (/^\/(?:featured-routes|luxury\/featured-routes)(?:\/|$)/.test(pathname)) {
    if (host === LUXURY_HOST || !/^\/luxury\/featured-routes\/?$/.test(pathname)) return 404
    return mainSite ? undefined : 410
  }
  if (/^\/activity(?:\/|$)/.test(pathname)) {
    if (host === LUXURY_HOST) return activityRedirect(host, pathname, '') ? undefined : 404
    if (pathname === '/activity' || pathname === '/activity/') return 410
    if (!activityDetailPattern.test(pathname)) return 404
    return mainSite ? undefined : 410
  }
  if (host === LUXURY_HOST && pathname !== '/') return 404
}
