const ORIGIN = 'https://www.lvyv.com'

const STATIC_URLS = [
  { path: '/', priority: '1.0' },
  { path: '/about', priority: '0.8' },
  { path: '/stories', priority: '0.7' },
  { path: '/cities/xian', priority: '0.7' },
  { path: '/cities/chengdu', priority: '0.7' }
]

export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=300, stale-while-revalidate=3600')
  const urls = STATIC_URLS.map(item => [
    '<url>',
    `<loc>${escapeXml(`${ORIGIN}${item.path}`)}</loc>`,
    '<changefreq>weekly</changefreq>',
    `<priority>${item.priority}</priority>`,
    '</url>'
  ].join(''))
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`
})

function escapeXml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}
