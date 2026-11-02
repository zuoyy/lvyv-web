import { LUXURY_HOST } from '../../shared/utils/luxurySite'

export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=300, stale-while-revalidate=3600')
  if (getRequestURL(event).hostname === LUXURY_HOST) {
    return [
      'User-agent: *',
      'Disallow: /',
      'Allow: /activity/',
      'Allow: /_nuxt/',
      'Allow: /images/',
      'Allow: /fonts/',
      'Allow: /videos/',
      ''
    ].join('\n')
  }
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /login',
    'Disallow: /login/',
    'Disallow: /register',
    'Disallow: /register/',
    'Disallow: /auth/',
    'Disallow: /profile',
    'Disallow: /profile/',
    'Disallow: /email/',
    'Disallow: /admin/',
    'Disallow: /preview',
    'Disallow: /preview/',
    'Disallow: /web-api/',
    '',
    'Sitemap: https://www.lvyv.com/sitemap.xml',
    ''
  ].join('\n')
})
