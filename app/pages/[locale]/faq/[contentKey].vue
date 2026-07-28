<template>
  <FaqDocumentShell
    v-if="document"
    :locale="locale"
    :locale-path="localePath"
    :document="document"
    :navigation="navigation || []"
    :manifest="manifest || []"
  />
</template>

<script setup lang="ts">
const route = useRoute()
const rawLocale = String(route.params.locale).toLowerCase()
const locale = rawLocale === 'zh' ? 'zh-CN' : rawLocale === 'en' ? 'en-US' : null
if (!locale) throw createError({ statusCode: 404, statusMessage: 'Locale not found' })

const localePath = rawLocale
const contentKey = String(route.params.contentKey)
const localePaths: Record<string, string> = { 'en-US': 'en', 'zh-CN': 'zh' }
const { getDocument, getManifest, getNavigation } = useContentApi()
const [{ data: document }, { data: manifest }, { data: navigation }] = await Promise.all([
  useAsyncData(`doc-${locale}-${contentKey}`, () => getDocument(locale, contentKey)),
  useAsyncData(`docs-manifest-${locale}`, () => getManifest(locale)),
  useAsyncData(`docs-nav-${locale}`, () => getNavigation(locale))
])
if (!document.value) throw createError({ statusCode: 404, statusMessage: 'Document not found' })

const doc = document.value
const path = `/${localePath}/faq/${contentKey}`
const title = doc.seo?.title || doc.title || 'Lvyv'
const description = doc.seo?.description || doc.summary || ''
const breadcrumbItems = [
  { name: locale === 'zh-CN' ? '首页' : 'Home', path: '/' },
  { name: locale === 'zh-CN' ? '帮助中心' : 'Help Center', path: `/${localePath}/faq/` },
  ...(doc.breadcrumbs || []).map(name => ({ name, path: `/${localePath}/faq/` })),
  { name: doc.title, path }
]
const articleJsonLd = doc.contentType === 'FAQ'
  ? {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${absoluteUrl(path)}#faqpage`,
      name: doc.title,
      description,
      url: absoluteUrl(path),
      mainEntity: [{
        '@type': 'Question',
        name: doc.title,
        acceptedAnswer: { '@type': 'Answer', text: stripHtml(doc.renderedHtml) }
      }]
    }
  : {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      '@id': `${absoluteUrl(path)}#article`,
      headline: doc.title,
      description,
      url: absoluteUrl(path),
      dateModified: doc.updatedAt,
      author: { '@type': 'Organization', name: 'Lvyv' },
      publisher: { '@id': absoluteUrl('/#organization') },
      mainEntityOfPage: { '@id': `${absoluteUrl(path)}#webpage` }
    }

useLvyvSeo({
  title,
  description,
  path,
  type: 'article',
  alternates: [
    { hreflang: 'x-default', path: '/faq/' },
    ...(doc.availableLocales || [])
      .filter(item => localePaths[item])
      .map(item => ({
        hreflang: item,
        path: `/${localePaths[item]}/faq/${contentKey}`
      }))
  ],
  jsonLd: [
    webPageJsonLd(title, description, path),
    breadcrumbJsonLd(breadcrumbItems),
    articleJsonLd
  ]
})
</script>
