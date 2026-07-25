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
const origin = useRequestURL().origin
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

useSeoMeta({
  title: () => document.value?.seo?.title || document.value?.title || 'Lvyv',
  description: () => document.value?.seo?.description || document.value?.summary || '',
  ogTitle: () => document.value?.seo?.title || document.value?.title || 'Lvyv',
  ogDescription: () => document.value?.seo?.description || document.value?.summary || ''
})
useHead(() => ({
  link: [
    { rel: 'canonical' as const, href: `${origin}/${localePath}/faq/${contentKey}` },
    { rel: 'alternate' as const, hreflang: 'x-default', href: `${origin}/faq/` },
    ...(document.value?.availableLocales || [])
      .filter(item => localePaths[item])
      .map(item => ({
        rel: 'alternate' as const,
        hreflang: item,
        href: `${origin}/${localePaths[item]}/faq/${contentKey}`
      }))
  ],
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify(document.value?.contentType === 'FAQ' ? {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [{
        '@type': 'Question',
        name: document.value?.title,
        acceptedAnswer: { '@type': 'Answer', text: document.value?.renderedHtml }
      }]
    } : {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: document.value?.title,
      description: document.value?.summary,
      dateModified: document.value?.updatedAt
    })
  }]
}))
</script>
