<template>
  <main class="encounters-page">
    <section class="encounters-hero" aria-labelledby="encounters-title">
      <img
        class="encounters-hero__image"
        src="/images/encounters/hero.webp"
        alt="A panoramic view of China"
      >
      <div class="encounters-hero__shade" />
      <div class="encounters-hero__copy">
        <h1 id="encounters-title">Find Your Encounter</h1>
        <p>Handcrafted journeys ready for you to step into</p>
      </div>
    </section>

    <section class="catalog-shell" aria-label="Available encounters">
      <div class="catalog-layout">
        <aside class="filter-panel" aria-label="Filter encounters">
          <h2>Filters</h2>

          <div class="filter-group">
            <div class="filter-group__heading">
              <h3>Price</h3>
              <span class="chevron" aria-hidden="true" />
            </div>
            <div class="price-range">
              <div class="price-range__track" />
              <input
                v-model.number="priceMin"
                type="range"
                :min="priceFloor"
                :max="priceCeiling"
                :step="10"
                aria-label="Minimum price"
                @input="clampPrice('min')"
              >
              <input
                v-model.number="priceMax"
                type="range"
                :min="priceFloor"
                :max="priceCeiling"
                :step="10"
                aria-label="Maximum price"
                @input="clampPrice('max')"
              >
            </div>
            <div class="price-range__labels">
              <span>${{ priceMin }}</span>
              <span>${{ priceMax }}</span>
            </div>
          </div>

          <div class="filter-group">
            <div class="filter-group__heading">
              <h3>Duration</h3>
              <span class="chevron" aria-hidden="true" />
            </div>
            <div class="duration-options">
              <button
                v-for="option in durationOptions"
                :key="option.value"
                type="button"
                :class="{ active: activeDuration === option.value }"
                :aria-pressed="activeDuration === option.value"
                @click="activeDuration = option.value"
              >
                {{ option.label }}
              </button>
            </div>
          </div>

          <div class="filter-group filter-group--themes">
            <div class="filter-group__heading">
              <h3>Theme</h3>
              <span class="chevron" aria-hidden="true" />
            </div>
            <div class="theme-options">
              <label v-for="theme in themeOptions" :key="theme.value">
                <input
                  type="checkbox"
                  :checked="selectedThemes.has(theme.value)"
                  @change="toggleTheme(theme.value)"
                >
                <span class="theme-check" aria-hidden="true">✓</span>
                <span>{{ theme.label }}</span>
              </label>
            </div>
          </div>
        </aside>

        <div class="catalog-results">
          <nav class="city-tabs" aria-label="Filter encounters by city">
            <button
              v-for="filter in cityFilters"
              :key="filter.value"
              type="button"
              :class="{ active: activeCity === filter.value }"
              :aria-pressed="activeCity === filter.value"
              @click="activeCity = filter.value"
            >
              {{ filter.label }}
            </button>
          </nav>

          <div class="results-toolbar">
            <p>
              Showing <strong>{{ visibleProducts.length }}</strong> of
              <span>{{ filteredProducts.length }} places</span>
            </p>
            <label class="sort-control">
              <span>Sort by</span>
              <select v-model="sortBy" aria-label="Sort encounters">
                <option value="recommended">Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <span class="sort-control__chevron" aria-hidden="true" />
            </label>
          </div>

          <div v-if="loading && !products.length" class="catalog-state" role="status">
            <span class="loading-mark" />
            <span>Loading encounters...</span>
          </div>

          <div v-else-if="!visibleProducts.length" class="catalog-state">
            No encounters match these filters yet.
          </div>

          <div v-else class="encounter-list">
            <article
              v-for="product in visibleProducts"
              :key="product.productCode"
              class="encounter-card"
              role="link"
              tabindex="0"
              @click="explore(product.productCode)"
              @keydown.enter="explore(product.productCode)"
            >
              <div class="encounter-card__visual">
                <img
                  :src="product.imageUrls[0]"
                  :alt="product.title"
                  loading="lazy"
                >
              </div>

              <div class="encounter-card__body">
                <h2>{{ cardTitle(product) }}</h2>
                <p v-if="product.features.length" class="encounter-card__features">{{ product.features.join('  |  ') }}</p>

                <div class="encounter-card__summary">
                  <div class="encounter-card__details">
                    <p class="encounter-card__location">
                      <font-awesome-icon :icon="['fas', 'location-dot']" class="location-pin" aria-hidden="true" />
                      {{ encounterSubtitle(product) }}
                    </p>
                    <p class="encounter-card__reviews">
                      <strong>Very Good</strong>
                      <span>{{ product.reviewCount }} reviews</span>
                    </p>
                  </div>
                  <div class="encounter-card__price">
                    <del v-if="product.listPrice > product.salePrice">{{ formatPrice(product.listPrice, product.currency) }}</del>
                    <p>
                      <strong>{{ formatPrice(product.salePrice, product.currency) }}</strong><span>/person</span>
                    </p>
                    <small v-if="product.priceNote" class="encounter-card__tax-note">{{ product.priceNote }}</small>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <button v-if="hasMore" class="show-more" type="button" @click="showMore">
            Show more results
          </button>
          <p v-if="loadWarning" class="load-warning" role="alert">Live encounter data is currently unavailable. Please try again.</p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
interface EncounterProduct {
  productCode: string
  title: string
  cityCode: string
  destinationName?: string
  imageUrls: string[]
  duration: string
  days: number
  currency: string
  listPrice: number
  salePrice: number
  themes: string[]
  features: string[]
  reviewCount: number
  priceNote?: string
}

const title = 'Encounters | Lvyv'
const description = 'Find currently available handcrafted journeys across China.'

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
const activeDuration = ref('all')
const selectedThemes = ref(new Set(['all']))
const sortBy = ref('recommended')
const visibleCount = ref(5)
const priceFloor = ref(0)
const priceCeiling = ref(0)
const priceMin = ref(0)
const priceMax = ref(0)

const cityFilters = [
  { label: 'All', value: 'all' },
  { label: "Xi'an", value: 'xian' },
  { label: 'Chengdu', value: 'chengdu' },
  { label: 'Beijing', value: 'beijing' }
]

const durationOptions = [
  { label: 'All', value: 'all' },
  { label: 'Weekend (3-4days)', value: 'weekend' },
  { label: 'Deep (7-8days)', value: 'deep' }
]

const themeOptions = computed(() => [
  { label: 'All', value: 'all' },
  ...[...new Set(products.value.flatMap(product => product.themes))]
    .filter(Boolean)
    .map(value => ({ label: value, value }))
])

const normalizeCity = (value: string) => value.toLowerCase().replace(/[^a-z]/g, '')

const filteredProducts = computed(() => {
  const themes = [...selectedThemes.value].filter(theme => theme !== 'all')
  const filtered = products.value.filter((product) => {
    const matchesCity = activeCity.value === 'all' || normalizeCity(product.cityCode) === activeCity.value
    const matchesPrice = product.salePrice >= priceMin.value && product.salePrice <= priceMax.value
    const matchesDuration = activeDuration.value === 'all'
      || (activeDuration.value === 'weekend' && product.days >= 3 && product.days <= 4)
      || (activeDuration.value === 'deep' && product.days >= 7 && product.days <= 8)
    const matchesTheme = !themes.length || themes.some(theme => product.themes.includes(theme))
    return matchesCity && matchesPrice && matchesDuration && matchesTheme
  })

  if (sortBy.value === 'price-asc') return [...filtered].sort((a, b) => a.salePrice - b.salePrice)
  if (sortBy.value === 'price-desc') return [...filtered].sort((a, b) => b.salePrice - a.salePrice)
  return filtered
})

const visibleProducts = computed(() => filteredProducts.value.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < filteredProducts.value.length)

watch([activeCity, activeDuration, priceMin, priceMax, sortBy, selectedThemes], () => {
  visibleCount.value = 5
})

const cityLabel = (cityCode: string) => ({
  xian: "Xi'an",
  chengdu: 'Chengdu',
  beijing: 'Beijing'
}[normalizeCity(cityCode)] || cityCode)

const encounterSubtitle = (product: EncounterProduct) => {
  const label = product.destinationName || cityLabel(product.cityCode)
  return `${normalizeCity(product.cityCode) === 'xian' ? 'An' : 'A'} ${label} Encounter`
}

const durationLabel = (dateText: string | undefined, days: number) => {
  if (dateText?.trim()) return dateText.trim()
  if (!days) return 'Handcrafted Journey'
  return `${days}D${Math.max(0, days - 1)}N`
}

const cardTitle = (product: EncounterProduct) => product.title.startsWith(product.duration)
  ? product.title
  : `${product.duration} · ${product.title}`

const formatPrice = (value: number, currency: string) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: currency || 'USD',
  maximumFractionDigits: 0
}).format(value)

const generatedReviewCount = (productCode: string) => {
  const seed = [...productCode].reduce((hash, character) => ((hash * 31) + character.charCodeAt(0)) >>> 0, 0)
  return 200 + (seed % 301)
}

const clampPrice = (handle: 'min' | 'max') => {
  if (handle === 'min' && priceMin.value > priceMax.value - 10) priceMin.value = priceMax.value - 10
  if (handle === 'max' && priceMax.value < priceMin.value + 10) priceMax.value = priceMin.value + 10
}

const toggleTheme = (theme: string) => {
  const next = new Set(selectedThemes.value)
  if (theme === 'all') {
    next.clear()
    next.add('all')
  } else {
    next.delete('all')
    if (next.has(theme)) next.delete(theme)
    else next.add(theme)
    if (!next.size) next.add('all')
  }
  selectedThemes.value = next
}

const showMore = () => {
  if (hasMore.value) visibleCount.value += 5
}

const applyCatalog = (catalog: import('~/composables/useTourCommerce').CatalogProductListView[]) => {
  products.value = catalog.map((item) => {
        const listPrice = Number(item.listPrice ?? 0)
        const salePrice = Number(item.salePrice ?? listPrice)
        const features = [
          ...(item.serviceLanguages || []),
          item.guaranteedDeparture ? 'Guaranteed Departure' : '',
          item.shoppingPolicy,
          item.travelType
        ].filter((value): value is string => Boolean(value?.trim()))
        return {
          productCode: item.productCode,
          title: item.name,
          cityCode: item.cityCode,
          destinationName: item.destinationName,
          imageUrls: item.imageUrls || [],
          duration: durationLabel(item.dateText, item.dayCount),
          days: item.dayCount,
          currency: item.currency || 'USD',
          listPrice,
          salePrice,
          themes: item.themes || [],
          features,
          reviewCount: generatedReviewCount(item.productCode),
          priceNote: item.priceNote
        }
      }).filter(product => product.imageUrls.length > 0)
  if (products.value.length) {
    const prices = products.value.map(product => product.salePrice)
    priceFloor.value = Math.floor(Math.min(...prices) / 10) * 10
    priceCeiling.value = Math.max(priceFloor.value + 10, Math.ceil(Math.max(...prices) / 10) * 10)
    priceMin.value = priceFloor.value
    priceMax.value = priceCeiling.value
  }
}

const { data: catalogData, status: catalogStatus } = await useAsyncData(
  'encounters-catalog-products',
  () => commerce.listCatalogProducts(),
  { default: () => [] }
)
const loading = computed(() => catalogStatus.value === 'idle' || catalogStatus.value === 'pending')
const loadWarning = computed(() => catalogStatus.value === 'error')
watch(catalogData, value => applyCatalog(value || []), { immediate: true })

const explore = async (productCode: string) => {
  await navigateTo(`/encounters/${encodeURIComponent(productCode)}`)
}

</script>

<style scoped>
.encounters-page {
  min-height: 100vh;
  padding-top: 80px;
  overflow: hidden;
  background: #f4f6f4;
  color: #1d332b;
}

.encounters-hero {
  position: relative;
  height: 400px;
  padding: 0;
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
  background: rgba(8, 28, 23, .13);
}

.encounters-hero__copy {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 9px 20px 0;
  text-align: center;
}

.encounters-hero h1 {
  margin: 0;
  color: #fff;
  font: 400 56px/1.08 'Playfair Display', Georgia, serif;
}

.encounters-hero p {
  margin: 25px 0 0;
  color: #cff380;
  font: 400 24px/1.25 'Playfair Display', Georgia, serif;
}

.catalog-shell {
  min-height: 1647px;
  padding: 40px 0 28px;
  background: #f4f6f4;
}

.catalog-layout {
  width: calc(100% - 208px);
  max-width: 1232px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 342px minmax(0, 838px);
  align-items: start;
  gap: 52px;
}

.filter-panel {
  min-width: 0;
  color: #1f352d;
}

.filter-panel h2 {
  margin: 0 0 22px;
  color: #1d332b;
  font: 700 20px/1.25 'Inter', sans-serif;
}

.filter-group {
  padding: 8px 0 33px;
  border-bottom: 1px solid #d6ddd9;
}

.filter-group + .filter-group {
  padding-top: 29px;
}

.filter-group--themes {
  border-bottom: 0;
}

.filter-group__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
}

.filter-group__heading h3 {
  margin: 0;
  color: #1d332b;
  font: 700 15px/1.2 'Inter', sans-serif;
}

.chevron,
.sort-control__chevron {
  width: 9px;
  height: 9px;
  border-top: 1.5px solid #1d332b;
  border-left: 1.5px solid #1d332b;
  transform: rotate(45deg);
}

.price-range {
  position: relative;
  height: 18px;
}

.price-range__track {
  position: absolute;
  top: 8px;
  right: 6px;
  left: 6px;
  height: 2px;
  background: #203d33;
}

.price-range input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 18px;
  margin: 0;
  appearance: none;
  background: transparent;
  pointer-events: none;
}

.price-range input::-webkit-slider-thumb {
  width: 23px;
  height: 23px;
  appearance: none;
  border: 0;
  border-radius: 50%;
  background: #698e4e;
  cursor: pointer;
  pointer-events: auto;
}

.price-range input::-moz-range-thumb {
  width: 23px;
  height: 23px;
  border: 0;
  border-radius: 50%;
  background: #698e4e;
  cursor: pointer;
  pointer-events: auto;
}

.price-range__labels {
  display: flex;
  justify-content: space-between;
  margin-top: 11px;
  color: #233b32;
  font: 400 12px/1 'Inter', sans-serif;
}

.duration-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.duration-options button {
  height: 34px;
  padding: 0 12px;
  border: 1px solid #7e8984;
  border-radius: 4px;
  background: transparent;
  color: #33453e;
  font: 400 12px/1 'Inter', sans-serif;
  cursor: pointer;
}

.duration-options button.active {
  border-color: #698e4e;
  background: #fff;
  color: #698e4e;
}

.theme-options {
  display: grid;
  gap: 13px;
}

.theme-options label {
  width: max-content;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #33453e;
  font: 400 14px/1 'Inter', sans-serif;
  cursor: pointer;
}

.theme-options input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.theme-check {
  width: 19px;
  height: 19px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #30483e;
  border-radius: 3px;
  color: transparent;
  font: 600 12px/1 'Inter', sans-serif;
}

.theme-options input:checked + .theme-check {
  border-color: #698e4e;
  color: #698e4e;
}

.catalog-results {
  min-width: 0;
}

.city-tabs {
  height: 80px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  padding: 16px 24px;
  overflow: hidden;
  box-sizing: border-box;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 16px rgba(17, 34, 17, .05);
}

.city-tabs button {
  position: relative;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0;
  border: 0;
  background: transparent;
  color: #1d332b;
  font: 700 15px/1 'Inter', sans-serif;
  text-align: left;
  cursor: pointer;
}

.city-tabs button:not(:last-child)::before {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 1px;
  background: #d5e0e5;
  content: '';
}

.city-tabs button::after {
  position: absolute;
  right: 24px;
  bottom: -16px;
  left: 0;
  height: 4px;
  background: #698e4e;
  content: '';
  opacity: 0;
}

.city-tabs button.active::after {
  opacity: 1;
}

.results-toolbar {
  height: 91px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.results-toolbar p {
  margin: 0;
  color: #263a32;
  font: 400 13px/1 'Inter', sans-serif;
}

.results-toolbar p strong {
  font-weight: 500;
}

.results-toolbar p span {
  color: #ff858b;
}

.sort-control {
  position: relative;
  display: flex;
  align-items: center;
  color: #263a32;
  font: 400 13px/1 'Inter', sans-serif;
}

.sort-control select {
  max-width: 145px;
  padding: 0 20px 0 5px;
  border: 0;
  appearance: none;
  background: transparent;
  color: #1d332b;
  font: 700 13px/1 'Inter', sans-serif;
  cursor: pointer;
}

.sort-control__chevron {
  position: absolute;
  top: 1px;
  right: 2px;
  width: 8px;
  height: 8px;
  transform: rotate(225deg);
  pointer-events: none;
}

.encounter-list {
  display: grid;
  gap: 20px;
}

.encounter-card {
  height: 248px;
  display: grid;
  grid-template-columns: 296px minmax(0, 1fr);
  overflow: hidden;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 7px 16px rgba(42, 61, 54, .08);
  cursor: pointer;
}

.encounter-card:focus-visible {
  outline: 2px solid #698e4e;
  outline-offset: 3px;
}

.encounter-card__visual {
  position: relative;
  min-width: 0;
  overflow: hidden;
  background: #dce6dd;
}

.encounter-card__visual > img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center;
  transition: transform 300ms ease;
}

.encounter-card:hover .encounter-card__visual > img {
  transform: scale(1.018);
}

.encounter-card__body {
  min-width: 0;
  padding: 25px 14px 13px 25px;
}

.encounter-card__body > h2 {
  min-height: 66px;
  margin: 0;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  color: #1d332b;
  font: 700 18px/1.31 'Inter', sans-serif;
}

.encounter-card__features {
  margin: 17px 0 0;
  overflow: hidden;
  color: #49625a;
  font: 400 11px/1 'Inter', sans-serif;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.encounter-card__summary {
  height: 80px;
  margin-top: 16px;
  padding: 13px 12px 10px 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  border-radius: 8px;
  background: #f5f6fa;
}

.encounter-card__details {
  min-width: 0;
  padding-left: 8px;
}

.encounter-card__location {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 0;
  overflow: hidden;
  color: #66716d;
  font: 400 15px/1.2 'Inter', sans-serif;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.location-pin {
  width: 16px;
  height: 16px;
  flex: 0 0 16px;
  color: #203d33;
}

.encounter-card__reviews {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 13px 0 0;
  color: #293d35;
  font: 400 12px/15px 'Inter', sans-serif;
}

.encounter-card__reviews strong {
  font-weight: 800;
}

.encounter-card__price {
  min-width: 119px;
  margin-top: -2px;
  text-align: right;
  white-space: nowrap;
}

.encounter-card__price del {
  display: block;
  height: 16px;
  color: #ff8b90;
  font: 400 12px/1 'Inter', sans-serif;
}

.encounter-card__price p {
  margin: 0;
  color: #203d33;
}

.encounter-card__price strong {
  font: 800 24px/1 'Inter', sans-serif;
}

.encounter-card__price p span {
  font: 700 12px/1 'Inter', sans-serif;
}

.encounter-card__price small {
  display: block;
  margin-top: 4px;
  color: #67746f;
  font: 400 11px/1 'Inter', sans-serif;
}

.show-more {
  width: 100%;
  height: 48px;
  margin-top: 40px;
  border: 0;
  border-radius: 3px;
  background: #203d33;
  color: #fff;
  font: 700 13px/1 'Inter', sans-serif;
  cursor: pointer;
}

.load-warning {
  margin: 10px 0 -22px;
  color: #738079;
  font: 400 11px/1.3 'Inter', sans-serif;
  text-align: center;
}

.catalog-state {
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #6d7a74;
  font: 400 15px/1.5 'Inter', sans-serif;
  text-align: center;
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

@media (max-width: 1100px) {
  .catalog-layout {
    width: calc(100% - 48px);
    grid-template-columns: 260px minmax(0, 1fr);
    gap: 28px;
  }

  .encounter-card {
    grid-template-columns: 250px minmax(0, 1fr);
  }

  .encounter-card__body {
    padding-left: 20px;
  }
}

@media (max-width: 820px) {
  .encounters-page { padding-top: 72px; }
  .encounters-hero { height: 360px; }
  .encounters-hero h1 { font-size: 45px; }
  .encounters-hero p { font-size: 20px; }
  .catalog-shell { padding-top: 24px; }
  .catalog-layout { width: calc(100% - 32px); display: block; }
  .filter-panel { margin-bottom: 24px; }
  .filter-panel h2 { margin-bottom: 10px; }
  .filter-group { padding-bottom: 20px; }
  .filter-group + .filter-group { padding-top: 20px; }
  .theme-options { grid-template-columns: repeat(3, max-content); gap: 12px 24px; }
  .city-tabs { height: 64px; }
  .results-toolbar { height: 72px; }
}

@media (max-width: 620px) {
  .encounters-hero { height: 310px; }
  .encounters-hero h1 { font-size: 37px; }
  .encounters-hero p { max-width: 330px; margin-top: 16px; font-size: 17px; }
  .theme-options { grid-template-columns: repeat(2, max-content); }
  .city-tabs { gap: 8px; padding: 16px; }
  .city-tabs button { font-size: 12px; }
  .city-tabs button::after { right: 10px; }
  .results-toolbar { align-items: center; }
  .results-toolbar p { font-size: 11px; }
  .sort-control, .sort-control select { font-size: 11px; }
  .encounter-card { height: auto; display: block; }
  .encounter-card__visual { height: 270px; }
  .encounter-card__body { padding: 20px 16px 16px; }
  .encounter-card__body > h2 { min-height: 0; }
  .encounter-card__summary { margin-top: 14px; }
}

@media (prefers-reduced-motion: reduce) {
  .encounter-card__visual > img { transition: none; }
  .encounter-card:hover .encounter-card__visual > img { transform: none; }
}
</style>
