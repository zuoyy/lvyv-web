<template>
  <main class="encounters-page">
    <section class="encounters-hero" aria-labelledby="encounters-title">
      <img
        class="encounters-hero__image"
        src="/images/encounters/hero.webp"
        alt="A panorama of Xi'an, Chengdu and Beijing"
      >
      <div class="encounters-hero__shade" />
      <div class="encounters-hero__copy">
        <h1 id="encounters-title">Find Your Encounter</h1>
        <p>Handcrafted journeys ready for you to step into</p>
      </div>
    </section>

    <nav class="encounter-filters" aria-label="Filter encounters by city">
      <button
        v-for="filter in filters"
        :key="filter.value"
        type="button"
        :class="{ active: activeCity === filter.value }"
        :aria-pressed="activeCity === filter.value"
        @click="activeCity = filter.value"
      >
        {{ filter.label }}
      </button>
    </nav>

    <section class="encounter-catalog" aria-label="Available encounters">
      <div v-if="loading" class="catalog-state" role="status">
        <span class="loading-mark" />
        <span>Loading encounters...</span>
      </div>

      <div v-else-if="error" class="catalog-state catalog-state--error" role="alert">
        <p>{{ error }}</p>
        <button type="button" @click="load">Try again</button>
      </div>

      <div v-else-if="!filteredProducts.length" class="catalog-state">
        No encounters are available for this city yet.
      </div>

      <div v-else class="encounter-grid">
        <article v-for="(product, index) in filteredProducts" :key="product.productCode" class="encounter-card">
          <div class="encounter-card__visual">
            <img
              :src="product.coverImageUrl || fallbackImage(product.cityCode, index)"
              :alt="product.title"
              loading="lazy"
              @error="useFallbackImage($event, product.cityCode, index)"
            >
            <span class="encounter-card__duration">{{ product.duration }}</span>
          </div>

          <div class="encounter-card__body">
            <div class="encounter-card__heading">
              <h2>{{ product.title }}</h2>
              <p>{{ encounterSubtitle(product.cityCode) }}</p>
            </div>

            <div class="encounter-card__footer">
              <p class="encounter-card__price">
                <span>From</span>
                <strong>{{ formatPrice(product.salePrice, product.currency) }}</strong>
              </p>
              <button type="button" @click="explore(product.productCode)">
                <span>Explore This Encounter</span>
                <span aria-hidden="true">&#8594;</span>
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
interface EncounterProduct {
  productCode: string
  title: string
  cityCode: string
  coverImageUrl?: string
  duration: string
  currency: string
  salePrice: number
}

const title = 'Encounters | Lvyv'
const description = 'Find handcrafted China encounters in Xi\'an, Chengdu and Beijing, ready for you to step into.'

useLvyvSeo({
  title,
  description,
  path: '/encounters',
  jsonLd: [
    webPageJsonLd(title, description, '/encounters'),
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Encounters', path: '/encounters' }
    ])
  ]
})

const commerce = useTourCommerce()
const products = ref<EncounterProduct[]>([])
const activeCity = ref('all')
const loading = ref(true)
const error = ref('')

const filters = [
  { label: 'All', value: 'all' },
  { label: "Xi'an", value: 'xian' },
  { label: 'Chengdu', value: 'chengdu' },
  { label: 'Beijing', value: 'beijing' },
]

const normalizeCity = (value: string) => value.toLowerCase().replace(/[^a-z]/g, '')

const filteredProducts = computed(() => activeCity.value === 'all'
  ? products.value
  : products.value.filter(product => normalizeCity(product.cityCode) === activeCity.value))

const cityLabel = (cityCode: string) => ({
  xian: "Xi'an",
  chengdu: 'Chengdu',
  beijing: 'Beijing',
}[normalizeCity(cityCode)] || cityCode)

const encounterSubtitle = (cityCode: string) => {
  const label = cityLabel(cityCode)
  return `${normalizeCity(cityCode) === 'xian' ? 'An' : 'A'} ${label} Encounter`
}

const fallbackImage = (cityCode: string, index: number) => {
  const city = normalizeCity(cityCode)
  if (city === 'xian') return '/images/encounters/xian.webp'
  if (city === 'chengdu') return '/images/encounters/chengdu.webp'
  if (city === 'beijing') return '/images/encounters/beijing.webp'
  return ['/images/encounters/xian.webp', '/images/encounters/beijing.webp', '/images/encounters/chengdu.webp'][index % 3]
    || '/images/encounters/xian.webp'
}

const useFallbackImage = (event: Event, cityCode: string, index: number) => {
  const image = event.currentTarget as HTMLImageElement
  const fallback = fallbackImage(cityCode, index)
  if (!image.src.endsWith(fallback)) image.src = fallback
}

const durationLabel = (dateText: string | undefined, days: number) => {
  if (dateText?.trim()) return dateText.trim()
  if (!days) return 'Handcrafted Journey'
  return `${days} ${days === 1 ? 'Day' : 'Days'} ${Math.max(0, days - 1)} ${days === 2 ? 'Night' : 'Nights'}`
}

const formatPrice = (value: number, currency: string) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: currency || 'USD',
  maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
}).format(value)

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    const catalog = await commerce.listCatalogProducts()
    products.value = catalog.map((item) => {
      const listPrice = Number(item.pricing?.listUnitPrice ?? item.price?.listPrice ?? 0)
      const salePrice = Number(item.pricing?.saleUnitPrice ?? item.price?.salePrice ?? listPrice)
      return {
        productCode: item.product.productCode,
        title: item.product.name,
        cityCode: item.itinerary.cityCode,
        coverImageUrl: item.product.coverImageUrl || item.itinerary.coverImageUrl,
        duration: durationLabel(item.itinerary.dateText, item.itinerary.days.length),
        currency: item.price?.currency || 'USD',
        salePrice,
      }
    })
  } catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'Could not load encounters.'
  } finally {
    loading.value = false
  }
}

const explore = async (productCode: string) => {
  await navigateTo(`/checkout?product=${encodeURIComponent(productCode)}`)
}

onMounted(load)
</script>

<style scoped>
.encounters-page {
  min-height: 100vh;
  padding-top: 80px;
  overflow: hidden;
  background: #fff;
  color: #203d33;
}

.encounters-hero {
  position: relative;
  height: 468px;
  overflow: hidden;
}

.encounters-hero__image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center;
}

.encounters-hero__shade {
  position: absolute;
  inset: 0;
  background: rgba(8, 28, 23, .16);
}

.encounters-hero__copy {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 18px 20px 0;
  text-align: center;
}

.encounters-hero h1 {
  margin: 0;
  color: #fff;
  font: 400 56px/1.1 'Playfair Display', Georgia, serif;
}

.encounters-hero p {
  margin: 23px 0 0;
  color: #cff380;
  font: 400 24px/1.3 'Playfair Display', Georgia, serif;
}

.encounter-filters {
  height: 67px;
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 44px;
  background: #f5f5f7;
}

.encounter-filters button {
  position: relative;
  min-width: 76px;
  padding: 0 8px;
  border: 0;
  background: transparent;
  color: #171717;
  font: 400 20px/1 'Inter', sans-serif;
  cursor: pointer;
}

.encounter-filters button::after {
  position: absolute;
  right: 0;
  bottom: 21px;
  left: 0;
  height: 1px;
  background: #698e4e;
  content: '';
  opacity: 0;
  transform: scaleX(.4);
  transition: opacity 160ms ease, transform 160ms ease;
}

.encounter-filters button:hover,
.encounter-filters button.active {
  color: #698e4e;
  font-weight: 600;
}

.encounter-filters button.active::after {
  opacity: 1;
  transform: scaleX(1);
}

.encounter-catalog {
  min-height: 988px;
  padding: 20px 20px 108px;
}

.encounter-grid,
.catalog-state {
  width: min(968px, 100%);
  margin: 0 auto;
}

.encounter-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 40px;
}

.encounter-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid #111;
  border-radius: 12px;
  background: #fff;
}

.encounter-card__visual {
  position: relative;
  aspect-ratio: 296 / 300;
  overflow: hidden;
  background: #dce6dd;
}

.encounter-card__visual img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform 350ms ease;
}

.encounter-card:hover .encounter-card__visual img {
  transform: scale(1.025);
}

.encounter-card__duration {
  position: absolute;
  top: 16px;
  left: 16px;
  min-height: 22px;
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border: 1px solid #698e4e;
  border-radius: 26px;
  background: #edf9e1;
  color: #2a573f;
  font: 400 12px/1.2 'Inter', sans-serif;
  text-transform: capitalize;
}

.encounter-card__body {
  height: 109px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 18px 10px 17px;
}

.encounter-card__heading h2 {
  margin: 0;
  overflow: hidden;
  color: #203d33;
  font: 500 16px/1.25 'Inter', sans-serif;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.encounter-card__heading p {
  margin: 1px 0 0;
  color: #979797;
  font: 400 12px/1.2 'Inter', sans-serif;
}

.encounter-card__footer {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.encounter-card__price {
  flex: 0 0 auto;
  margin: 0;
  color: #203d33;
  white-space: nowrap;
}

.encounter-card__price span {
  margin-right: 4px;
  font: 300 14px/1 'Inter', sans-serif;
}

.encounter-card__price strong {
  font: 600 16px/1 'Montserrat', 'Inter', sans-serif;
}

.encounter-card__footer button {
  min-width: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #698e4e;
  font: 400 14px/1 'Inter', sans-serif;
  white-space: nowrap;
  cursor: pointer;
}

.encounter-card__footer button:hover {
  color: #2a573f;
}

.catalog-state {
  min-height: 410px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #6d7a74;
  font: 400 15px/1.5 'Inter', sans-serif;
  text-align: center;
}

.catalog-state--error {
  flex-direction: column;
}

.catalog-state p {
  margin: 0;
}

.catalog-state button {
  min-height: 40px;
  padding: 0 18px;
  border: 0;
  border-radius: 6px;
  background: #105446;
  color: #fff;
  cursor: pointer;
}

.loading-mark {
  width: 18px;
  height: 18px;
  border: 2px solid #d3dbd6;
  border-top-color: #105446;
  border-radius: 50%;
  animation: spin 700ms linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 991px) {
  .encounters-page { padding-top: 72px; }
  .encounters-hero { height: 430px; }
  .encounters-hero h1 { font-size: 48px; }
  .encounters-hero p { font-size: 21px; }
  .encounter-grid { width: min(632px, 100%); grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 680px) {
  .encounters-hero { height: 400px; }
  .encounters-hero__image { object-position: 52% center; }
  .encounters-hero h1 { font-size: 40px; }
  .encounters-hero p { max-width: 330px; margin-top: 16px; font-size: 18px; }
  .encounter-filters { height: 62px; gap: 2px; justify-content: space-evenly; }
  .encounter-filters button { min-width: 0; font-size: 15px; }
  .encounter-filters button::after { bottom: 17px; }
  .encounter-catalog { padding: 20px 16px 72px; }
  .encounter-grid { grid-template-columns: 1fr; gap: 24px; }
  .encounter-card { width: min(360px, 100%); margin: 0 auto; }
  .encounter-card__body { height: 112px; }
}

@media (prefers-reduced-motion: reduce) {
  .encounter-card__visual img { transition: none; }
  .encounter-card:hover .encounter-card__visual img { transform: none; }
}
</style>
