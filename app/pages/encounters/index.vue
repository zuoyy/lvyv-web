<template>
  <main class="encounters-page">
    <section class="encounters-hero" aria-labelledby="encounters-title">
      <img class="encounters-hero__image" src="/images/encounters/hero-design.webp" alt="Misty mountain peaks in China">
      <div class="encounters-hero__copy">
        <h1 id="encounters-title">Find Your Encounter</h1>
        <p>Handcrafted journeys ready for you to step into</p>
      </div>
    </section>

    <section class="routes-section featured-section" aria-labelledby="featured-title">
      <div class="section-heading">
        <h2 id="featured-title">Featured Routes</h2>
        <NuxtLink class="section-link" :to="activityListUrl" external>See All</NuxtLink>
      </div>

      <div v-if="featuredLoading" class="section-state" role="status">Loading featured routes...</div>
      <div v-else-if="featuredError" class="section-state section-state--error" role="alert">
        Featured routes are temporarily unavailable.
      </div>
      <div v-else-if="!featuredActivities.length" class="section-state">No featured routes are available right now.</div>
      <div v-else class="featured-grid">
        <NuxtLink
          v-for="activity in featuredActivities"
          :key="activity.activityCode"
          class="featured-card"
          :to="activityUrl(activity.activityCode)"
          external
        >
          <div class="featured-card__image-wrap">
            <img
              class="featured-card__backdrop"
              :src="activityImage(activity)"
              alt=""
              aria-hidden="true"
              loading="lazy"
              @error="useFallbackImage"
            >
            <img
              class="featured-card__image"
              :src="activityImage(activity)"
              :alt="activity.city || activity.title"
              loading="lazy"
              @error="useFallbackImage"
            >
            <div class="featured-card__overlay">
              <h3>{{ featuredCityLabel(activity.city) }}</h3>
              <p>{{ activity.shareTitle || activity.title }}</p>
              <span class="featured-card__action">Book</span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>

    <section class="routes-section popular-section" aria-labelledby="popular-title">
      <div class="section-heading">
        <h2 id="popular-title">Popular Routes</h2>
      </div>

      <div v-if="productsLoading && !products.length" class="section-state" role="status">Loading popular routes...</div>
      <div v-else-if="productsError && !products.length" class="section-state section-state--error" role="alert">
        Popular routes are temporarily unavailable. <button type="button" @click="retryProducts">Try again</button>
      </div>
      <div v-else-if="!products.length" class="section-state">No routes are available right now.</div>
      <div v-else class="popular-grid">
        <NuxtLink
          v-for="product in visibleProducts"
          :key="product.productCode"
          class="popular-card"
          :to="`/encounters/${encodeURIComponent(product.productCode)}`"
        >
          <div class="popular-card__image-wrap">
            <img
              :src="product.imageUrls[0] || fallbackImage"
              :alt="product.title"
              loading="lazy"
              @error="useFallbackImage"
            >
            <span class="popular-card__duration">{{ product.duration }}</span>
          </div>
          <div class="popular-card__body">
            <h3>{{ product.title }}</h3>
            <p class="popular-card__city">An {{ cityLabel(product.cityCode) }} Encounter</p>
            <div class="popular-card__footer">
              <del v-if="product.lowestAdultListPrice > product.lowestAdultSalePrice" class="popular-card__list-price">
                {{ formatPrice(product.lowestAdultListPrice, product.currency) }}
              </del>
              <p><span>From</span> <strong>{{ formatPrice(product.lowestAdultSalePrice, product.currency) }}</strong></p>
              <span class="popular-card__explore">Explore This Encounter <span aria-hidden="true">→</span></span>
            </div>
          </div>
        </NuxtLink>
      </div>
      <p v-if="productsError && products.length" class="load-warning" role="alert">Some route data may be out of date.</p>
    </section>
  </main>
</template>

<script setup lang="ts">
import type { CatalogProductListView } from '~/composables/useTourCommerce'
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

const title = 'Encounters | Lvyv'
const description = 'Find currently available handcrafted journeys across China.'
const fallbackImage = '/images/common/logo.png'
const activityListUrl = import.meta.dev ? FEATURED_ROUTES_PATH : `${MAIN_SITE_ORIGIN}${FEATURED_ROUTES_PATH}`
useLvyvSeo({
  title,
  description,
  path: '/encounters',
  jsonLd: [webPageJsonLd(title, description, '/encounters')]
})

const config = useRuntimeConfig()
const apiBase = String(import.meta.server ? config.contentApiBase : config.public.apiBase || '/web-api').replace(/\/$/, '')
const commerce = useTourCommerce()
const tourCities = useTourCities()

const [{ data: featuredResponse, error: featuredRequestError, status: featuredStatus }, {
  data: catalogData, error: catalogError, status: catalogStatus, refresh: refreshProducts
}] = await Promise.all([
  useFetch<ApiResult<PageResult<ActivityCard>>>(`${apiBase}/luxury/activity/published?featured=true`, {
    key: 'encounters-featured-activities',
    timeout: 10_000,
    retry: 0,
    getCachedData: (key, nuxtApp) => nuxtApp.isHydrating ? nuxtApp.payload.data[key] : undefined
  }),
  useAsyncData<CatalogProductListView[]>(
    'encounters-catalog-products',
    () => commerce.listCatalogProducts(),
    {
      default: () => [],
      lazy: true,
      getCachedData: (key, nuxtApp) => nuxtApp.isHydrating ? nuxtApp.payload.data[key] : undefined
    }
  )
])

const featuredActivities = computed(() => {
  const response = featuredResponse.value
  if (!response || (response.code !== 0 && response.code !== 200)) return []
  return response.data?.list || []
})
const featuredLoading = computed(() => featuredStatus.value === 'idle' || featuredStatus.value === 'pending')
const featuredError = computed(() => Boolean(featuredRequestError.value)
  || Boolean(featuredResponse.value && featuredResponse.value.code !== 0 && featuredResponse.value.code !== 200))

const products = computed(() => (catalogData.value || []).map((item) => {
  const listPrice = Number(item.lowestAdultListPrice ?? 0)
  const salePrice = Number(item.lowestAdultSalePrice ?? listPrice)
  return {
    productCode: item.productCode,
    title: item.name,
    cityCode: item.cityCode,
    imageUrls: item.imageUrls || [],
    duration: durationLabel(item.dateText, item.dayCount),
    currency: item.currency || 'USD',
    lowestAdultSalePrice: salePrice,
    lowestAdultListPrice: listPrice
  }
}).filter(item => item.productCode && item.title))
const visibleProducts = computed(() => products.value)
const productsLoading = computed(() => catalogStatus.value === 'idle' || catalogStatus.value === 'pending')
const productsError = computed(() => Boolean(catalogError.value))

const cityNames: Record<string, string> = {
  beijing: 'Beijing',
  chengdu: 'Chengdu',
  chongqing: 'Chongqing',
  nanjing: 'Nanjing',
  xi_an: "Xi'an",
  xian: "Xi'an"
}
const cityLabel = (cityCode: string) => {
  const code = cityCode.trim().toLowerCase()
  if (cityNames[code]) return cityNames[code]
  const label = tourCities.cities.value.find(city => city.code === cityCode)?.label || cityCode
  return label.includes('/') ? label.split('/').at(-1)?.trim() || cityCode : label
}
const featuredCityLabel = (city = '') => {
  const normalized = city.trim().toLowerCase().replace(/[’']/g, '').replace(/[\s-]+/g, '_')
  return cityNames[normalized] || city.trim().replace(/\b\w/g, character => character.toUpperCase()) || 'China'
}
const durationLabel = (dateText: string | undefined, days: number) => {
  if (dateText?.trim()) return dateText.trim()
  if (!days) return 'Handcrafted Journey'
  return `${days}D${Math.max(0, days - 1)}N`
}
const formatPrice = (value: number, currency: string) => new Intl.NumberFormat('en-US', {
  style: 'currency', currency: currency || 'USD', maximumFractionDigits: 0
}).format(value)
const activityImage = (activity: ActivityCard) => {
  if (activity.archiveImageUrl || activity.shareImageUrl) return activity.archiveImageUrl || activity.shareImageUrl
  const city = activity.city?.trim().toLowerCase() || ''
  if (city.includes('chongqing') || city.includes('重庆')) return '/images/encounters/featured-chongqing.webp'
  if (city.includes('chengdu') || city.includes('成都')) return '/images/encounters/featured-chengdu.webp'
  if (city.includes('beijing') || city.includes('北京')) return '/images/encounters/featured-beijing.webp'
  if (city.includes('xi') || city.includes('西安')) return '/images/encounters/featured-xian.webp'
  return '/images/encounters/hero-design.webp'
}
const activityUrl = (code: string) => {
  const path = `/activity/${encodeURIComponent(code)}`
  return import.meta.dev ? path : `${LUXURY_ORIGIN}${path}`
}
const useFallbackImage = (event: Event) => {
  const image = event.currentTarget as HTMLImageElement
  image.removeAttribute('src')
  image.classList.add('is-missing')
}
const retryProducts = () => { void refreshProducts() }
onMounted(() => { void tourCities.load().catch(() => undefined) })
</script>

<style scoped>
.encounters-page { min-height: 100vh; padding-top: 80px; color: #203d33; background: #fff; }
.encounters-hero { position: relative; height: 260px; overflow: hidden; }
.encounters-hero__image { position: absolute; inset: 0; width: 100%; height: 100%; display: block; object-fit: cover; object-position: center 49%; }
.encounters-hero__copy { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 0 20px; text-align: center; }
.encounters-hero h1 { margin: 0; color: #fff; font: 400 56px/1.2 Didot, 'Bodoni 72', 'Playfair Display', Georgia, serif; }
.encounters-hero p { margin: 2px 0 0; color: #cff380; font: 400 24px/1.25 'Philosopher', Georgia, serif; }
.routes-section { width: min(1232px, calc(100% - 80px)); margin: 0 auto; }
.featured-section { padding: 30px 0 0; }
.popular-section { padding: 60px 0 300px; }
.section-heading { display: flex; min-height: 40px; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 20px; }
.section-heading h2 { margin: 0; color: #203d33; font: 700 24px/26px 'Philosopher', Georgia, serif; }
.section-link { display: inline-flex; min-width: 78px; height: 40px; align-items: center; justify-content: center; gap: 8px; padding: 0 15px; border: 1px solid #698e4e; border-radius: 4px; color: #112211; font: 500 14px/1 'Inter', sans-serif; text-decoration: none; }
.section-link:hover { background: #edf9e1; }
.featured-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
.featured-card { min-width: 0; color: inherit; text-decoration: none; }
.featured-card__image-wrap { position: relative; aspect-ratio: 296 / 420; overflow: hidden; border-radius: 12px; background: #e2e6dd; }
.featured-card__image-wrap > img { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.featured-card__backdrop { object-fit: cover; filter: blur(16px); transform: scale(1.12); }
.featured-card__image { object-fit: contain; object-position: center top; transform-origin: center top; transition: transform .35s ease; }
.featured-card:hover .featured-card__image { transform: scale(1.035); }
.featured-card__image-wrap > img.is-missing { display: none; }
.featured-card__overlay { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end; padding: 24px; color: #fff; background: linear-gradient(180deg, transparent 42%, rgba(7, 20, 16, .54) 100%); }
.featured-card__overlay h3 { margin: 0; overflow: hidden; font: 600 24px/29px 'Inter', sans-serif; text-overflow: ellipsis; white-space: nowrap; }
.featured-card__overlay p { margin: 0 0 16px; overflow: hidden; color: #fff; font: 400 14px/17px 'Inter', sans-serif; text-overflow: ellipsis; white-space: nowrap; }
.featured-card__action { display: flex; width: 100%; height: 48px; align-items: center; justify-content: center; border-radius: 4px; color: #112211; background: #cff380; font: 500 14px/1 'Montserrat', 'Inter', sans-serif; }
.popular-section .section-heading { min-height: 26px; margin-bottom: 30px; }
.popular-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 40px 16px; }
.popular-card { position: relative; min-width: 0; height: 410px; overflow: hidden; border: 1px solid #111; border-radius: 12px; color: inherit; background: #fff; text-decoration: none; }
.popular-card__image-wrap { position: relative; height: 300px; overflow: hidden; background: #e3e8e3; }
.popular-card__image-wrap img { width: 100%; height: 100%; display: block; object-fit: cover; transition: transform .35s ease; }
.popular-card__image-wrap img.is-missing { display: none; }
.popular-card:hover img { transform: scale(1.035); }
.popular-card__duration { position: absolute; top: 16px; left: 16px; max-width: calc(100% - 32px); overflow: hidden; padding: 3px 10px; border: 1px solid #698e4e; border-radius: 26px; color: #2a573f; background: #edf9e1; font: 400 12px/16px 'Inter', sans-serif; text-overflow: ellipsis; white-space: nowrap; }
.popular-card__body { position: relative; height: 110px; padding: 18px 10px 12px; }
.popular-card__city { margin: 1px 0 0; overflow: hidden; color: #979797; font: 400 12px/15px 'Inter', sans-serif; text-overflow: ellipsis; white-space: nowrap; }
.popular-card h3 { overflow: hidden; margin: 0; color: #203d33; font: 500 16px/19px 'Inter', sans-serif; text-overflow: ellipsis; white-space: nowrap; }
.popular-card__footer { position: absolute; right: 10px; bottom: 12px; left: 10px; display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.popular-card__footer p { margin: 0; color: #53675f; font: 300 14px/18px 'Inter', sans-serif; white-space: nowrap; }
.popular-card__footer strong { color: #203d33; font: 600 16px/18px 'Inter', sans-serif; }
.popular-card__list-price { position: absolute; bottom: 17px; left: 51px; color: #ff3d00; font: 400 10px/12px 'Inter', sans-serif; }
.popular-card__explore { flex: 0 0 auto; color: #698e4e; font: 400 14px/18px 'Inter', sans-serif; white-space: nowrap; }
.section-state { min-height: 170px; display: flex; align-items: center; justify-content: center; gap: 8px; color: #748078; font: 400 14px/1.5 'Inter', sans-serif; text-align: center; }
.section-state--error { color: #795b52; }
.section-state button { padding: 0; border: 0; border-bottom: 1px solid currentColor; background: none; color: inherit; font: inherit; cursor: pointer; }
.load-warning { margin: 20px 0 0; color: #795b52; font: 400 12px/1.4 'Inter', sans-serif; text-align: center; }
@media (max-width: 1024px) {
  .routes-section { width: calc(100% - 48px); }
  .featured-grid, .popular-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .featured-grid { gap: 16px; }
  .popular-grid { gap: 32px 16px; }
}
@media (max-width: 620px) {
  .encounters-page { padding-top: 60px; }
  .encounters-hero { height: 220px; }
  .encounters-hero h1 { font-size: 36px; }
  .encounters-hero p { max-width: 340px; margin-top: 8px; font-size: 18px; }
  .routes-section { width: calc(100% - 32px); }
  .featured-section { padding-top: 28px; }
  .popular-section { padding-top: 44px; padding-bottom: 80px; }
  .section-heading { min-height: 38px; margin-bottom: 16px; }
  .section-heading h2 { font-size: 22px; line-height: 26px; }
  .section-link { min-width: 72px; height: 38px; padding: 0 10px; font-size: 13px; }
  .featured-grid, .popular-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px 10px; }
  .featured-card__overlay { padding: 12px; }
  .featured-card__overlay h3 { font-size: 18px; line-height: 22px; }
  .featured-card__overlay p { margin-bottom: 10px; font-size: 11px; line-height: 14px; }
  .featured-card__action { height: 36px; font-size: 12px; }
  .popular-grid { row-gap: 18px; }
  .popular-card { height: auto; aspect-ratio: auto; border-radius: 8px; }
  .popular-card__image-wrap { height: auto; aspect-ratio: 1 / 1; }
  .popular-card__body { height: 116px; padding: 9px 7px 8px; }
  .popular-card h3 { font-size: 12px; line-height: 15px; }
  .popular-card__city { font-size: 10px; line-height: 13px; }
  .popular-card__footer { right: 7px; bottom: 8px; left: 7px; flex-wrap: wrap; gap: 2px; }
  .popular-card__footer p { font-size: 10px; line-height: 13px; }
  .popular-card__footer strong { font-size: 12px; line-height: 13px; }
  .popular-card__list-price { bottom: 11px; left: 37px; font-size: 8px; line-height: 9px; }
  .popular-card__explore { font-size: 9px; line-height: 12px; }
  .popular-card__duration { top: 8px; left: 8px; max-width: calc(100% - 16px); padding: 2px 7px; font-size: 9px; line-height: 13px; }
}
@media (prefers-reduced-motion: reduce) {
  .featured-card__image, .popular-card__image-wrap img { transition: none; }
  .featured-card:hover .featured-card__image, .popular-card:hover img { transform: none; }
}
</style>
