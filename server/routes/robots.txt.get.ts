export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=300, stale-while-revalidate=3600')
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
