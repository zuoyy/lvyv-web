<template>
  <AccountPageShell active-page="catalog" kicker="Lvyv products" title="Standard journeys" description="Choose a ready-made itinerary and keep its purchased version in your trips." :ready="ready">
    <div v-if="loading" class="catalog-state">Loading journeys...</div>
    <div v-else-if="error" class="catalog-state error">{{ error }} <button type="button" @click="load">Try again</button></div>
    <div v-else-if="!products.length" class="catalog-state">No featured journeys are available right now.</div>
    <div v-else class="catalog-grid">
      <article v-for="product in products" :key="product.productCode" class="catalog-item">
        <div class="catalog-image">
          <img v-if="product.coverImageUrl" :src="product.coverImageUrl" :alt="product.title">
          <span v-else>{{ product.cityCode }}</span>
        </div>
        <div class="catalog-copy">
          <p class="eyebrow">{{ product.productCode }} · V{{ product.versionNo }}</p>
          <h2>{{ product.title }}</h2>
          <p>{{ product.summary || 'A considered day-by-day journey prepared by the Lvyv design team.' }}</p>
          <div class="catalog-footer">
            <div class="catalog-price"><strong>{{ product.currency }} {{ product.salePrice }}</strong><del v-if="Number(product.listPrice) > Number(product.salePrice)">{{ product.currency }} {{ product.listPrice }}</del><small v-if="product.discountPercent">-{{ product.discountPercent }}% · {{ product.promotionName }}</small><small v-if="product.promotionEndTime">Ends {{ formatDate(product.promotionEndTime) }}</small></div>
            <button type="button" :disabled="buying === product.productCode" @click="buy(product.productCode)">{{ buying === product.productCode ? 'Opening checkout...' : 'Buy journey' }}</button>
          </div>
        </div>
      </article>
    </div>
  </AccountPageShell>
</template>

<script setup lang="ts">
import AccountPageShell from '~/components/profile/AccountPageShell.vue'

useNoIndex()

const { ready, initializeAccount } = useAccountPage('/catalog')
const commerce = useTourCommerce()
const products = ref<Array<{ productCode: string; versionNo: number; title: string; cityCode: string; coverImageUrl?: string; summary?: string; currency: string; listPrice: string | number; salePrice: string | number; promotionName?: string; promotionEndTime?: string; discountPercent?: number }>>([])
const loading = ref(false)
const buying = ref<string | null>(null)
const error = ref('')

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    const catalog = await commerce.listCatalogProducts()
    products.value = catalog.map(item => {
      const view = item.itinerary
      const pricing = item.pricing
      const listPrice = Number(pricing?.listUnitPrice ?? item.price?.listPrice ?? 0)
      const salePrice = Number(pricing?.saleUnitPrice ?? item.price?.salePrice ?? 0)
      return { productCode: item.product.productCode, versionNo: view.versionNo, title: view.title,
        cityCode: view.cityCode, coverImageUrl: item.product.coverImageUrl || view.coverImageUrl, summary: item.product.summary || view.summary,
        currency: item.price?.currency || 'USD', listPrice, salePrice,
        promotionName: pricing?.promotionCampaign?.name, promotionEndTime: pricing?.promotionCampaign?.endTime,
        discountPercent: listPrice > salePrice ? Math.round((1 - salePrice / listPrice) * 100) : undefined }
    })
  } catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'Could not load the catalogue.'
  } finally {
    loading.value = false
  }
}

const buy = async (productCode: string) => {
  buying.value = productCode
  try {
    await navigateTo(`/checkout?product=${encodeURIComponent(productCode)}`)
  } catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'Could not create the order.'
  } finally {
    buying.value = null
  }
}
const formatDate = (value?: string) => value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : ''

onMounted(async () => {
  if (await initializeAccount()) await load()
})
</script>

<style scoped>
.catalog-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.catalog-item { overflow: hidden; border: 1px solid #dfe5e1; background: #fff; }
.catalog-image { aspect-ratio: 16 / 8; display: grid; place-items: center; background: #dfe9e3; color: #426458; font: 600 24px/1 'Playfair Display', Georgia, serif; text-transform: capitalize; }
.catalog-image img { width: 100%; height: 100%; object-fit: cover; }
.catalog-copy { padding: 21px; }
.eyebrow { margin: 0 0 8px; color: #84918a; font-size: 9px; font-weight: 800; text-transform: uppercase; }
.catalog-copy h2 { margin: 0; color: #173f34; font: 600 23px/1.2 'Playfair Display', Georgia, serif; }
.catalog-copy p:not(.eyebrow) { min-height: 42px; margin: 10px 0 18px; color: #6e7c75; font-size: 12px; line-height: 1.55; }
.catalog-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-top: 15px; border-top: 1px solid #edf1ee; }
.catalog-footer strong { color: #174d40; font-size: 15px; }
.catalog-price { display: flex; align-items: baseline; flex-wrap: wrap; gap: 7px; }
.catalog-price del { color: #8b9891; font-size: 11px; }
.catalog-price small { flex-basis: 100%; color: #bb6a31; font-size: 10px; }
.catalog-footer button, .catalog-state button { min-height: 40px; padding: 0 14px; border: 0; background: #174d40; color: #fff; font-weight: 700; cursor: pointer; }
.catalog-footer button:disabled { opacity: .6; cursor: wait; }
.catalog-state { min-height: 260px; display: grid; place-items: center; gap: 10px; border: 1px solid #dfe5e1; color: #75827c; text-align: center; }
.catalog-state.error { display: flex; flex-direction: column; }
@media (max-width: 700px) { .catalog-grid { grid-template-columns: 1fr; } }
</style>
