type JsonLdValue = Record<string, unknown> | Array<Record<string, unknown>>

interface SeoAlternate {
  hreflang: string
  path: string
}

interface LvyvSeoOptions {
  title: string
  description: string
  path: string
  image?: string
  type?: 'website' | 'article'
  alternates?: SeoAlternate[]
  jsonLd?: JsonLdValue
  noindex?: boolean
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

export const useLvyvSeo = (options: LvyvSeoOptions) => {
  const url = absoluteUrl(options.path)
  const image = absoluteUrl(options.image || '/images/common/logo.png')
  const robots = options.noindex ? 'noindex, nofollow' : 'index, follow'

  useSeoMeta({
    title: options.title,
    description: options.description,
    ogTitle: options.title,
    ogDescription: options.description,
    ogSiteName: LVYV_SITE_NAME,
    ogType: options.type || 'website',
    ogUrl: url,
    ogImage: image,
    twitterCard: 'summary_large_image',
    twitterTitle: options.title,
    twitterDescription: options.description,
    twitterImage: image,
    robots
  })

  useHead(() => ({
    link: [
      { rel: 'canonical', href: url },
      ...(options.alternates || []).map(item => ({
        rel: 'alternate' as const,
        hreflang: item.hreflang,
        href: absoluteUrl(item.path)
      }))
    ],
    script: options.jsonLd
      ? [{
          key: `jsonld-${options.path}`,
          type: 'application/ld+json',
          innerHTML: JSON.stringify(options.jsonLd)
        }]
      : []
  }))
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
