import type { H3Event } from 'h3'

interface ApiResult<T> {
  code: number
  data: T
}

interface FaqManifestItem {
  contentKey: string
  categoryKey: string
  lastmod?: string
  indexable?: boolean
  canonicalUrl?: string
}

interface FaqLanding {
  indexable?: boolean
  availableLocales?: string[]
}

const ORIGIN = 'https://www.lvyv.com'
const FAQ_LOCALES = [
  { api: 'en-US', path: 'en' },
  { api: 'zh-CN', path: 'zh' }
]

export async function buildFaqSitemap(event: H3Event, localeApi: string, localePath: string) {
  const config = useRuntimeConfig(event)
  const base = String(config.contentApiBase || 'http://127.0.0.1:8088/web-api').replace(/\/$/, '')
  const [manifests, landings] = await Promise.all([loadFaqManifests(base), loadFaqLandings(base)])
  const current = (manifests[localeApi] || []).filter(item => isIndexableUrl(item, localePath))

  const publishedLocaleEntries = FAQ_LOCALES.filter(locale => landings[locale.api]?.indexable)
  const urls = [
    ...(landings[localeApi]?.indexable
      ? [sitemapUrl(`${ORIGIN}/${localePath}/faq/`, undefined, publishedLocaleEntries.map(locale => ({
          hreflang: locale.api,
          href: `${ORIGIN}/${locale.path}/faq/`
        })), `${ORIGIN}/faq/`)]
      : []),
    ...current.map(item => {
      const alternates = FAQ_LOCALES
        .filter(locale => manifests[locale.api]?.some(candidate => candidate.contentKey === item.contentKey && isIndexableUrl(candidate, locale.path)))
        .map(locale => ({
          hreflang: locale.api,
          href: articleUrl(locale.path, item)
        }))
      return sitemapUrl(articleUrl(localePath, item), item.lastmod, alternates)
    })
  ]

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=300, stale-while-revalidate=3600')
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.join('')}</urlset>`
}

function isIndexableUrl(item: FaqManifestItem, localePath: string) {
  if (!item.categoryKey) return false
  const expected = articleUrl(localePath, item)
  return item.indexable !== false && (!item.canonicalUrl || item.canonicalUrl === expected)
}

function articleUrl(localePath: string, item: FaqManifestItem) {
  return `${ORIGIN}/${localePath}/faq/${encodeURIComponent(item.categoryKey)}/${encodeURIComponent(item.contentKey)}`
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

async function loadFaqLandings(base: string) {
  const entries = await Promise.all(FAQ_LOCALES.map(async (locale) => {
    try {
      const result = await $fetch<ApiResult<FaqLanding>>(`${base}/content/docs/${encodeURIComponent(locale.api)}/landing-page`)
      return [locale.api, result.code === 200 ? result.data : null] as const
    } catch {
      return [locale.api, null] as const
    }
  }))
  return Object.fromEntries(entries) as Record<string, FaqLanding | null>
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
