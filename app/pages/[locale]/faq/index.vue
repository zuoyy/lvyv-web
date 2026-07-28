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
const { getDocument, getManifest, getNavigation } = useContentApi()
const [{ data: manifest }, { data: navigation }] = await Promise.all([
  useAsyncData(`docs-manifest-${locale}`, () => getManifest(locale)),
  useAsyncData(`docs-nav-${locale}`, () => getNavigation(locale))
])
const defaultItem = manifest.value?.find(item => item.contentKey === 'welcome') || manifest.value?.[0]
if (!defaultItem) throw createError({ statusCode: 404, statusMessage: 'No published documents' })
const { data: document } = await useAsyncData(`doc-${locale}-${defaultItem.contentKey}`, () => getDocument(locale, defaultItem.contentKey))
if (!document.value) throw createError({ statusCode: 404, statusMessage: 'Document not found' })

const title = locale === 'zh-CN' ? '帮助中心 - Lvyv 旅遇' : 'Help Center - Lvyv'
const description = locale === 'zh-CN'
  ? '了解如何使用 Lvyv，开始一段真实、有温度的中国旅遇。'
  : 'Find answers about using Lvyv and start a meaningful journey through China.'
const path = `/${localePath}/faq/`

useLvyvSeo({
  title,
  description,
  path,
  alternates: [
    { hreflang: 'x-default', path: '/faq/' },
    { hreflang: 'en-US', path: '/en/faq/' },
    { hreflang: 'zh-CN', path: '/zh/faq/' }
  ],
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${absoluteUrl(path)}#collection`,
      name: title,
      description,
      url: absoluteUrl(path),
      isPartOf: { '@id': absoluteUrl('/#website') }
    },
    breadcrumbJsonLd([
      { name: locale === 'zh-CN' ? '首页' : 'Home', path: '/' },
      { name: locale === 'zh-CN' ? '帮助中心' : 'Help Center', path }
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: (manifest.value || []).map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: absoluteUrl(`/${localePath}/faq/${item.contentKey}`),
        name: item.title
      }))
    }
  ]
})
</script>
