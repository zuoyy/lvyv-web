import type { H3Event } from 'h3'

interface ApiResult<T> {
  code: number
  data: T
}

interface FaqManifestItem {
  contentKey: string
  updatedAt?: string
}

const ORIGIN = 'https://www.lvyv.com'
const FAQ_LOCALES = [
  { api: 'en-US', path: 'en' },
  { api: 'zh-CN', path: 'zh' }
]

export async function buildFaqSitemap(event: H3Event, localeApi: string, localePath: string) {
  const config = useRuntimeConfig(event)
  const base = String(config.contentApiBase || 'http://127.0.0.1:8088/web-api').replace(/\/$/, '')
  const manifests = await loadFaqManifests(base)
  const current = manifests[localeApi] || []

  const publishedLocaleEntries = FAQ_LOCALES.filter(locale => (manifests[locale.api] || []).length > 0)
  const urls = [
    ...(current.length
      ? [sitemapUrl(`${ORIGIN}/${localePath}/faq/`, undefined, publishedLocaleEntries.map(locale => ({
          hreflang: locale.api,
          href: `${ORIGIN}/${locale.path}/faq/`
        })), `${ORIGIN}/faq/`)]
      : []),
    ...current.map(item => {
      const alternates = FAQ_LOCALES
        .filter(locale => manifests[locale.api]?.some(candidate => candidate.contentKey === item.contentKey))
        .map(locale => ({
          hreflang: locale.api,
          href: `${ORIGIN}/${locale.path}/faq/${item.contentKey}`
        }))
      return sitemapUrl(`${ORIGIN}/${localePath}/faq/${item.contentKey}`, item.updatedAt, alternates)
    })
  ]

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=300, stale-while-revalidate=3600')
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.join('')}</urlset>`
}

async function loadFaqManifests(base: string) {
  const entries = await Promise.all(FAQ_LOCALES.map(async (locale) => {
    try {
      const result = await $fetch<ApiResult<FaqManifestItem[]>>(`${base}/content/docs/${encodeURIComponent(locale.api)}/manifest`)
      return [locale.api, result.code === 200 ? result.data || [] : []] as const
    } catch {
      return [locale.api, []] as const
    }
  }))
  return Object.fromEntries(entries) as Record<string, FaqManifestItem[]>
}

function sitemapUrl(
  loc: string,
  lastmod?: string,
  alternates: Array<{ hreflang: string; href: string }> = [],
  xDefault?: string
) {
  const lastmodTag = lastmod ? `<lastmod>${escapeXml(new Date(lastmod).toISOString())}</lastmod>` : ''
  const alternateTags = [
    ...alternates.map(item => `<xhtml:link rel="alternate" hreflang="${escapeXml(item.hreflang)}" href="${escapeXml(item.href)}" />`),
    ...(xDefault ? [`<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(xDefault)}" />`] : [])
  ]
  return `<url><loc>${escapeXml(loc)}</loc>${lastmodTag}${alternateTags.join('')}</url>`
}

function escapeXml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}
