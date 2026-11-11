import type { MaybeRefOrGetter } from 'vue'
import { serializeJsonLd } from '~~/shared/utils/seoJson'
type JsonLdValue = Record<string, unknown> | Array<Record<string, unknown>>

interface SeoAlternate {
  hreflang: string
  path: string
}

interface LvyvSeoOptions {
  lang?: string
  imageAlt?: string
  title: string
  description: string
  path: string
  image?: string
  type?: 'website' | 'article'
  alternates?: SeoAlternate[]
  jsonLd?: JsonLdValue
  noindex?: boolean
  noindexFollow?: boolean
  canonicalUrl?: string
}

export const LVYV_SITE_ORIGIN = 'https://www.lvyv.com'
export const LVYV_SITE_NAME = 'Lvyv'
export const LVYV_DEFAULT_DESCRIPTION = 'The First Friend in China. Discover real people, hidden stories, and unforgettable journeys through authentic encounters.'

export const absoluteUrl = (path = '/') => {
  if (/^https?:\/\//i.test(path)) return path
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${LVYV_SITE_ORIGIN}${normalized}`
}

export const stripHtml = (value = '') => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

export const useLvyvSeo = (source: MaybeRefOrGetter<LvyvSeoOptions>) => {
  useHead(() => {
    const options = toValue(source)
    const canonical = absoluteUrl(options.canonicalUrl || options.path.split('?')[0]!)
    const image = absoluteUrl(options.image || '/images/common/logo.png')
    const robots = options.noindex ? options.noindexFollow ? 'noindex, follow' : 'noindex, nofollow' : 'index, follow'
    return {
      title: options.title,
      htmlAttrs: options.lang ? { lang: options.lang } : {},
      meta: [
        { name: 'description', content: options.description },
        { name: 'robots', content: robots },
        ...Object.entries({ 'og:title': options.title, 'og:description': options.description,
          'og:site_name': LVYV_SITE_NAME, 'og:type': options.type || 'website', 'og:url': canonical,
          'og:image': image, 'og:image:alt': options.imageAlt || options.title }).map(([property, content]) => ({ property, content })),
        ...Object.entries({ 'twitter:card': 'summary_large_image', 'twitter:title': options.title,
          'twitter:description': options.description, 'twitter:image': image, 'twitter:image:alt': options.imageAlt || options.title
        }).map(([name, content]) => ({ name, content }))
      ],
      link: [{ rel: 'canonical', href: canonical }, ...(options.alternates || []).map(item => ({
        rel: 'alternate' as const, type: 'text/html', hreflang: item.hreflang, href: absoluteUrl(item.path)
      }))],
      script: options.jsonLd ? [{ key: 'lvyv-jsonld', type: 'application/ld+json', innerHTML: serializeJsonLd(options.jsonLd) }] : []
    }
  })
}

export const useNoIndex = () => {
  useSeoMeta({ robots: 'noindex, nofollow' })
}

export const organizationJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': absoluteUrl('/#organization'),
  name: 'Lvyv',
  url: absoluteUrl('/'),
  logo: absoluteUrl('/images/common/logo.png'),
  description: LVYV_DEFAULT_DESCRIPTION,
  sameAs: []
})

export const websiteJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': absoluteUrl('/#website'),
  name: 'Lvyv',
  url: absoluteUrl('/'),
  publisher: { '@id': absoluteUrl('/#organization') }
})

export const webPageJsonLd = (name: string, description: string, path: string) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${absoluteUrl(path)}#webpage`,
  name,
  description,
  url: absoluteUrl(path),
  isPartOf: { '@id': absoluteUrl('/#website') },
  publisher: { '@id': absoluteUrl('/#organization') }
})

export const breadcrumbJsonLd = (items: Array<{ name: string; path: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path)
  }))
})
