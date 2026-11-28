export const LUXURY_HOST = 'luxury.lvyv.com'
export const MAIN_SITE_ORIGIN = 'https://www.lvyv.com'
export const ACTIVITY_ORIGIN = MAIN_SITE_ORIGIN
export const FEATURED_ROUTES_PATH = '/luxury/featured-routes'

const activityDetailPattern = /^\/activity\/[A-Za-z0-9_-]+\/?$/

export function activityPath(code: string): string {
  return `/activity/${encodeURIComponent(code)}`
}

export function activityLink(code: string): string {
  return import.meta.dev ? activityPath(code) : ACTIVITY_ORIGIN + activityPath(code)
}

export function luxuryPageError(hostname: string, pathname: string, development = false): 404 | 410 | undefined {
  if (/^\/luxury\/activity(?:\/|$)/.test(pathname)) return 410

  const host = hostname.toLowerCase()
  const local = development && ['localhost', '127.0.0.1', '[::1]'].includes(host)
  if (/^\/(?:featured-routes|luxury\/featured-routes)(?:\/|$)/.test(pathname)) {
    if (host === LUXURY_HOST || !/^\/luxury\/featured-routes\/?$/.test(pathname)) return 404
    return host === 'www.lvyv.com' || local ? undefined : 410
  }
  if (/^\/activity(?:\/|$)/.test(pathname)) {
    if (!activityDetailPattern.test(pathname)) return 404
    return host === 'lvyv.com' || host === 'www.lvyv.com' || local ? undefined : 404
  }
  if (host === LUXURY_HOST && pathname !== '/') return 404
}
