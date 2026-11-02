<template>
  <main class="activities-page">
    <section class="activities-hero" aria-labelledby="featured-routes-title">
      <img src="/images/encounters/hero-design.webp" alt="Misty mountain peaks in China" class="activities-hero__image" fetchpriority="high">
      <div class="activities-hero__copy">
        <h1 id="featured-routes-title">Featured Routes</h1>
        <p>Extraordinary places. Thoughtfully crafted journeys.</p>
      </div>
    </section>

    <section class="activities-content" aria-labelledby="activities-heading">
      <NuxtLink class="back-link" :to="encountersUrl" external><span aria-hidden="true">←</span> Back to Encounters</NuxtLink>
      <div class="activities-toolbar">
        <div>
          <h2 id="activities-heading">Explore Our Routes</h2>
          <p>Find a journey that speaks to you.</p>
        </div>
        <p v-if="pageData && !pending && !requestError && !responseError" class="activities-count">{{ resultStart }}–{{ resultEnd }} of {{ pageData.total }} {{ pageData.total === 1 ? 'journey' : 'journeys' }}</p>
      </div>

      <div v-if="pending" class="activities-grid activities-grid--loading" role="status" aria-label="Loading routes">
        <div v-for="item in 3" :key="item" class="activity-skeleton" aria-hidden="true"><div /><span /><span /></div>
      </div>
      <div v-else-if="requestError || responseError" class="activities-state activities-state--error" role="alert">
        <h3>We couldn’t load these routes</h3>
        <p>Please try again in a moment.</p>
        <button type="button" @click="retry">Try again</button>
      </div>
      <div v-else-if="!activities.length" class="activities-state">
        <h3>New journeys are on their way</h3>
        <p>Check back soon to discover our latest routes.</p>
        <NuxtLink :to="encountersUrl" external>Explore Encounters</NuxtLink>
      </div>
      <div v-else class="activities-grid">
        <NuxtLink
          v-for="activity in activities"
          :key="activity.activityCode"
          class="activity-card"
          :to="activityUrl(activity.activityCode)"
          target="_blank"
          rel="noopener noreferrer"
          external
        >
          <div class="activity-card__image-wrap">
            <img
              :src="activity.archiveImageUrl || activity.shareImageUrl || fallbackImage"
              :alt="activity.shareTitle || activity.title"
              loading="lazy"
              @error="useFallbackImage"
            >
          </div>
          <div class="activity-card__body">
            <p class="activity-card__city">{{ cityLabel(activity.city) }}</p>
            <h3>{{ activity.shareTitle || activity.title }}</h3>
            <p class="activity-card__description">{{ activity.shareDesc || 'A private journey, thoughtfully arranged.' }}</p>
            <span class="activity-card__action">Explore This Route <span aria-hidden="true">→</span></span>
          </div>
        </NuxtLink>
      </div>

      <nav v-if="pageData && !requestError && !responseError && totalPages > 1" class="pagination" aria-label="Route pages">
        <button type="button" :disabled="page <= 1 || pending" @click="changePage(page - 1)">Previous</button>
        <div class="pagination__pages">
          <button v-for="pageNumber in pageNumbers" :key="pageNumber" type="button" :class="{ 'is-current': pageNumber === page }" :aria-current="pageNumber === page ? 'page' : undefined" :aria-label="`Page ${pageNumber}`" :disabled="pending" @click="changePage(pageNumber)">{{ pageNumber }}</button>
        </div>
        <span class="pagination__summary">Page {{ page }} of {{ totalPages }}</span>
        <button type="button" :disabled="page >= totalPages || pending" @click="changePage(page + 1)">Next</button>
      </nav>
    </section>
  </main>
</template>

<script setup lang="ts">
import { FEATURED_ROUTES_PATH, LUXURY_ORIGIN, MAIN_SITE_ORIGIN } from '~~/shared/utils/luxurySite'

interface ActivityCard {
  activityCode: string
  title: string
  shareTitle: string
  shareDesc: string
  shareImageUrl: string
  archiveImageUrl: string
  city: string
}

interface PageResult<T> {
  list: T[]
  total: number
  page: number
  size: number
}

interface ApiResult<T> {
  code: number
  data: T
}

const PAGE_SIZE = 12
const fallbackImage = '/images/encounters/hero-design.webp'
const encountersUrl = import.meta.dev ? '/encounters' : 'https://www.lvyv.com/encounters'
const route = useRoute()
const router = useRouter()
const page = computed(() => {
  const value = Number(route.query.page || 1)
  return Number.isInteger(value) && value > 0 ? value : 1
})
const config = useRuntimeConfig()
const apiBase = String(import.meta.server ? config.contentApiBase : config.public.apiBase || '/web-api').replace(/\/$/, '')
const { data: response, error: requestError, status, refresh } = await useFetch<ApiResult<PageResult<ActivityCard>>>(
  () => `${apiBase}/luxury/activity/published?page=${page.value}&size=${PAGE_SIZE}`,
  {
    key: () => `published-activities-${page.value}`,
    timeout: 10_000,
    retry: 0,
    getCachedData: (key, nuxtApp) => nuxtApp.isHydrating ? nuxtApp.payload.data[key] : undefined
  }
)

const pageData = computed(() => {
  const result = response.value
  return result && (result.code === 0 || result.code === 200) ? result.data : null
})
const responseError = computed(() => Boolean(response.value && response.value.code !== 0 && response.value.code !== 200))
const pending = computed(() => status.value === 'idle' || status.value === 'pending')
const activities = computed(() => pageData.value?.list || [])
const totalPages = computed(() => Math.max(1, Math.ceil((pageData.value?.total || 0) / PAGE_SIZE)))
const resultStart = computed(() => activities.value.length ? (page.value - 1) * PAGE_SIZE + 1 : 0)
const resultEnd = computed(() => activities.value.length ? (page.value - 1) * PAGE_SIZE + activities.value.length : 0)
const pageNumbers = computed(() => {
  const start = Math.max(1, Math.min(page.value - 2, totalPages.value - 4))
  return Array.from({ length: Math.min(5, totalPages.value) }, (_, index) => start + index)
})
const retry = () => { void refresh() }

const seoTitle = 'Featured Routes | Lvyv'
const seoDescription = 'Discover published private journeys curated by Lvyv travel specialists.'
const canonicalUrl = computed(() => `${MAIN_SITE_ORIGIN}${FEATURED_ROUTES_PATH}${page.value > 1 ? `?page=${page.value}` : ''}`)
useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogUrl: () => canonicalUrl.value,
  ogImage: `${MAIN_SITE_ORIGIN}${fallbackImage}`,
  twitterCard: 'summary_large_image',
  robots: 'index, follow'
})
useHead(() => ({
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
  script: [{
    key: 'jsonld-featured-routes',
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${canonicalUrl.value}#webpage`,
      name: seoTitle,
      description: seoDescription,
      url: canonicalUrl.value
    })
  }]
}))

const cityLabel = (city = '') => {
  const names: Record<string, string> = { beijing: 'Beijing', chengdu: 'Chengdu', chongqing: 'Chongqing', xian: "Xi’an", xi_an: "Xi’an", nanjing: 'Nanjing' }
  const normalized = city.trim().toLowerCase().replace(/[’']/g, '').replace(/[\s-]+/g, '_')
  return names[normalized] || city.trim().replace(/\b\w/g, character => character.toUpperCase()) || 'China'
}

const activityUrl = (code: string) => {
  const path = `/activity/${encodeURIComponent(code)}`
  return import.meta.dev ? path : `${LUXURY_ORIGIN}${path}`
}

const changePage = async (nextPage: number) => {
  if (pending.value || nextPage === page.value || nextPage < 1 || nextPage > totalPages.value) return
  await router.push({ query: { ...route.query, page: nextPage === 1 ? undefined : String(nextPage) } })
  await nextTick()
  const content = document.querySelector('.activities-content')
  if (content) window.scrollTo({ top: content.getBoundingClientRect().top + window.scrollY - 100, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
}
const useFallbackImage = (event: Event) => {
  const image = event.currentTarget as HTMLImageElement
  if (image.src.endsWith(fallbackImage)) {
    image.style.visibility = 'hidden'
    return
  }
  image.src = fallbackImage
}
</script>

<style scoped>
.activities-page { min-height: 100vh; padding-top: 80px; color: #203d33; background: #fff; }
.activities-hero { position: relative; display: grid; min-height: 260px; overflow: hidden; isolation: isolate; place-items: center; padding: 36px 24px; text-align: center; background: #203d33; }
.activities-hero::after { position: absolute; z-index: -1; inset: 0; background: rgb(14 38 30 / 20%); content: ''; }
.activities-hero__image { position: absolute; z-index: -2; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 49%; }
.activities-hero h1 { margin: 0; color: #fff; font: 400 56px/1.2 Didot, 'Bodoni 72', 'Playfair Display', Georgia, serif; }
.activities-hero p { margin: 12px 0 0; color: #cff380; font: 400 19px/1.5 'Inter', sans-serif; }
.activities-content { width: min(1232px, calc(100% - 80px)); margin: 0 auto; padding: 28px 0 88px; }
.back-link { display: inline-flex; align-items: center; gap: 8px; margin-bottom: 32px; color: #5c7065; font: 400 13px/20px 'Inter', sans-serif; text-decoration: none; }
.back-link:hover { color: #105446; text-decoration: underline; text-underline-offset: 4px; }
.activities-toolbar { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 28px; }
.activities-toolbar h2 { margin: 0; color: #203d33; font: 700 28px/34px 'Philosopher', Georgia, serif; }
.activities-toolbar p { margin: 8px 0 0; color: #65786d; font: 400 14px/22px 'Inter', sans-serif; }
.activities-toolbar .activities-count { flex-shrink: 0; margin: 0 0 2px; color: #65786d; font-size: 13px; }
.activities-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); align-items: stretch; gap: 32px 24px; }
.activity-card { display: flex; flex-direction: column; min-width: 0; overflow: hidden; border: 1px solid #dfe6df; border-radius: 12px; color: inherit; background: #fff; text-decoration: none; transition: border-color .2s ease, box-shadow .2s ease; }
.activity-card:hover { border-color: #9aaa92; box-shadow: 0 8px 24px rgb(32 61 51 / 8%); }
.activity-card__image-wrap { position: relative; aspect-ratio: 1.28 / 1; overflow: hidden; background: #e6ece4; }
.activity-card__image-wrap img { width: 100%; height: 100%; display: block; object-fit: cover; transition: transform .35s ease; }
.activity-card:hover img { transform: scale(1.035); }
.activity-card__body { display: flex; flex: 1; flex-direction: column; padding: 22px; }
.activity-card__city { align-self: flex-start; max-width: 100%; margin: 0 0 12px; overflow: hidden; padding: 3px 10px; border: 1px solid #dbe5d0; border-radius: 26px; color: #45643a; background: #f3f8eb; font: 500 12px/18px 'Inter', sans-serif; text-overflow: ellipsis; white-space: nowrap; }
.activity-card__body h3 { min-height: 52px; margin: 0; overflow: hidden; color: #203d33; font: 600 18px/26px 'Inter', sans-serif; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow-wrap: anywhere; }
.activity-card__description { min-height: 44px; margin: 10px 0 22px; overflow: hidden; color: #65786d; font: 400 13px/22px 'Inter', sans-serif; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow-wrap: anywhere; }
.activity-card__action { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 44px; margin-top: auto; padding: 10px 16px; border-radius: 4px; color: #203d33; background: #cff380; font: 500 13px/20px 'Inter', sans-serif; }
.activities-state { display: flex; min-height: 310px; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 32px 20px; border: 1px solid #e2e8df; border-radius: 12px; color: #65786d; background: #f8faf6; text-align: center; }
.activities-state h3 { margin: 0; color: #203d33; font: 700 24px/30px 'Philosopher', Georgia, serif; }
.activities-state p { margin: 0; font: 400 14px/22px 'Inter', sans-serif; }
.activities-state button, .activities-state a { margin-top: 8px; padding: 11px 20px; border: 1px solid #698e4e; border-radius: 4px; color: #203d33; background: #fff; font: 500 13px/20px 'Inter', sans-serif; text-decoration: none; cursor: pointer; }
.activity-skeleton { overflow: hidden; border: 1px solid #e2e8df; border-radius: 12px; padding-bottom: 90px; }
.activity-skeleton div { aspect-ratio: 1.28 / 1; background: #e8ede5; }
.activity-skeleton span { display: block; height: 18px; margin: 24px 22px 0; border-radius: 4px; background: #edf1e9; }
.activity-skeleton span:last-child { width: 60%; margin-top: 12px; }
.pagination { display: flex; align-items: center; justify-content: center; gap: 24px; margin-top: 48px; color: #65786d; font: 400 13px/20px 'Inter', sans-serif; }
.pagination__pages { display: flex; gap: 6px; }
.pagination__summary { display: none; }
.pagination button { display: grid; min-width: 42px; min-height: 44px; place-items: center; padding: 0 14px; border: 1px solid #d6e0d3; border-radius: 6px; color: #203d33; background: #fff; font: 500 13px/20px 'Inter', sans-serif; cursor: pointer; }
.pagination button:hover:not(:disabled) { border-color: #698e4e; background: #f3f8eb; }
.pagination button.is-current { border-color: #105446; color: #fff; background: #105446; }
.pagination button:disabled { opacity: .45; cursor: default; }
.activity-card:focus-visible, .back-link:focus-visible, .pagination button:focus-visible, .activities-state button:focus-visible, .activities-state a:focus-visible { outline: 2px solid #105446; outline-offset: 4px; }
@media (max-width: 991px) {
  .activities-page { padding-top: var(--mobile-navbar-height, 60px); }
  .activities-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .activities-content { width: calc(100% - 48px); }
}
@media (max-width: 600px) {
  .activities-hero { min-height: 220px; padding-inline: 20px; }
  .activities-hero h1 { font-size: 38px; }
  .activities-hero p { max-width: 310px; font-size: 15px; line-height: 24px; }
  .activities-content { width: calc(100% - 32px); padding: 22px 0 56px; }
  .back-link { margin-bottom: 24px; font-size: 12px; }
  .activities-toolbar { flex-wrap: wrap; gap: 12px; margin-bottom: 22px; }
  .activities-toolbar h2 { font-size: 24px; line-height: 30px; }
  .activities-toolbar p { font-size: 13px; }
  .activities-grid { grid-template-columns: minmax(0, 1fr); gap: 22px; }
  .activity-card__image-wrap, .activity-skeleton div { aspect-ratio: 1.4 / 1; }
  .activity-card__body { padding: 18px; }
  .activity-card__body h3 { min-height: 0; font-size: 17px; line-height: 25px; }
  .activity-card__description { min-height: 0; margin-bottom: 18px; }
  .pagination { gap: 14px; margin-top: 32px; }
  .pagination__pages { display: none; }
  .pagination__summary { display: inline; }
  .pagination button { min-height: 44px; padding: 0 12px; font-size: 12px; }
}
@media (prefers-reduced-motion: reduce) {
  .activity-card, .activity-card__image-wrap img { transition: none; }
  .activity-card:hover img { transform: none; }
}
</style>
