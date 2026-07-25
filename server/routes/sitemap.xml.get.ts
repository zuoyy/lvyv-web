export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const base = String(config.contentApiBase || 'http://127.0.0.1:8088/web-api').replace(/\/$/, '')
  const locales = [{ api: 'en-US', path: 'en' }, { api: 'zh-CN', path: 'zh' }]
  const urls: string[] = []
  for (const locale of locales) {
    try {
      const result = await $fetch<{ code: number; data: Array<{ contentKey: string; updatedAt?: string }> }>(`${base}/content/docs/${locale.api}/manifest`)
      if (result.code !== 200) continue
      urls.push(`<url><loc>${escapeXml(`/${locale.path}/faq/`)}</loc></url>`)
      for (const item of result.data || []) urls.push(`<url><loc>${escapeXml(`/${locale.path}/faq/${item.contentKey}`)}</loc>${item.updatedAt ? `<lastmod>${new Date(item.updatedAt).toISOString()}</lastmod>` : ''}</url>`)
    } catch { /* content API outage should not break the rest of the site */ }
  }
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`
})

function escapeXml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
