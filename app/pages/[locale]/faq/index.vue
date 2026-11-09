<template>
  <FaqDocumentShell
    v-if="landing"
    :locale="locale"
    :locale-path="localePath"
    :landing="landing"
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
const { getLanding, getManifest, getNavigation } = useContentApi()
const [{ data: landing }, { data: manifest }, { data: navigation }] = await Promise.all([
  useAsyncData(`faq-landing-${locale}`, () => getLanding(locale)),
  useAsyncData(`docs-manifest-${locale}`, () => getManifest(locale)),
  useAsyncData(`docs-nav-${locale}`, () => getNavigation(locale))
])
if (!landing.value) throw createError({ statusCode: 404, statusMessage: 'FAQ landing page not configured' })
const title = landing.value.seoTitle || landing.value.title
const description = landing.value.seoDescription || stripHtml(landing.value.introHtml) || landing.value.title
const path = `/${localePath}/faq/`
const localePaths: Record<string, string> = { 'en-US': 'en', 'zh-CN': 'zh' }
const availableLocales = landing.value.availableLocales || []

useLvyvSeo({
  title,
  description,
  path,
  noindex: !landing.value.indexable,
  noindexFollow: true,
  alternates: [
    ...(availableLocales.length ? [{ hreflang: 'x-default', path: '/faq/' }] : []),
    ...availableLocales.filter(item => localePaths[item]).map(item => ({
      hreflang: item,
      path: `/${localePaths[item]}/faq/`
    }))
  ],
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${absoluteUrl(path)}#collection`,
      name: landing.value.title,
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
      itemListElement: (manifest.value || []).filter(item => item.indexable !== false && item.categoryKey && (!item.canonicalUrl || item.canonicalUrl === absoluteUrl(faqArticlePath(localePath, item)))).map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: absoluteUrl(faqArticlePath(localePath, item)),
        name: item.title
      }))
    }
  ]
})
</script>
