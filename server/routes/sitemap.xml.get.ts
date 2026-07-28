export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=300, stale-while-revalidate=3600')
  const origin = 'https://www.lvyv.com'
  const now = new Date().toISOString()
  const sitemaps = [
    '/sitemaps/static.xml',
    '/sitemaps/faq-en.xml',
    '/sitemaps/faq-zh.xml'
  ].map(path => `<sitemap><loc>${escapeXml(`${origin}${path}`)}</loc><lastmod>${now}</lastmod></sitemap>`)
  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemaps.join('')}</sitemapindex>`
})

function escapeXml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}
