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
import { faqArticlePath } from '~/composables/useContent'

const route = useRoute()
const rawLocale = String(route.params.locale).toLowerCase()
const locale = rawLocale === 'zh' ? 'zh-CN' : rawLocale === 'en' ? 'en-US' : null
if (!locale) throw createError({ statusCode: 404, statusMessage: 'Locale not found' })

const localePath = rawLocale
const category = String(route.params.category)
const contentKey = String(route.params.contentKey)
const localePaths: Record<string, string> = { 'en-US': 'en', 'zh-CN': 'zh' }
const { getDocument, getManifest, getNavigation } = useContentApi()
const [{ data: document }, { data: manifest }, { data: navigation }] = await Promise.all([
  useAsyncData(`doc-${locale}-${contentKey}`, () => getDocument(locale, contentKey)),
  useAsyncData(`docs-manifest-${locale}`, () => getManifest(locale)),
  useAsyncData(`docs-nav-${locale}`, () => getNavigation(locale))
])
const entry = manifest.value?.find(item => item.contentKey === contentKey)
if (!document.value || !entry || entry.categoryKey !== category) {
  throw createError({ statusCode: 404, statusMessage: 'Document not found' })
}

const doc = document.value
const path = faqArticlePath(localePath, entry)
const title = doc.seo?.title?.trim() || doc.title || 'Lvyv'
const description = [doc.seo?.description, doc.summary, doc.renderedHtml, title]
  .map(value => stripHtml(value || '').replace(/&nbsp;|&#160;/gi, ' ').trim())
  .find(Boolean)!.slice(0, 160)
const breadcrumbItems = [
  { name: locale === 'zh-CN' ? '首页' : 'Home', path: '/' },
  { name: locale === 'zh-CN' ? '帮助中心' : 'Help Center', path: `/${localePath}/faq/` },
  ...(doc.breadcrumbs || []).map(name => ({ name, path: `/${localePath}/faq/` })),
  { name: doc.title, path }
]
const authorJsonLd = doc.author ? {
  '@type': doc.author.type === 'PERSON' ? 'Person' : 'Organization',
  name: doc.author.name,
  ...(doc.author.profileUrl ? { url: doc.author.profileUrl } : {})
} : undefined
const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  '@id': `${absoluteUrl(path)}#article`,
  headline: doc.title,
  description,
  url: absoluteUrl(path),
  datePublished: doc.datePublished,
  dateModified: doc.dateModified,
  inLanguage: locale,
  ...(authorJsonLd ? { author: authorJsonLd } : {}),
  ...(doc.coverImageUrl ? { image: [doc.coverImageUrl] } : {}),
  publisher: { '@id': absoluteUrl('/#organization') },
  mainEntityOfPage: { '@id': `${absoluteUrl(path)}#webpage` }
}

useLvyvSeo({
  lang: locale,
  title,
  description,
  path,
  image: doc.coverImageUrl,
  canonicalUrl: doc.canonicalUrl,
  noindex: doc.indexable === false,
  noindexFollow: true,
  type: 'article',
  alternates: (doc.availableLocales || [])
    .filter(item => localePaths[item])
    .map(item => ({ hreflang: item, path: faqArticlePath(localePaths[item]!, entry) })),
  jsonLd: [
    webPageJsonLd(title, description, path),
    breadcrumbJsonLd(breadcrumbItems),
    articleJsonLd
  ]
})
</script>
