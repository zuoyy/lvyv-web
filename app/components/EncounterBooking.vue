<template>
  <section id="book" class="booking" aria-labelledby="booking-title">
    <h2 id="booking-title">Book {{ productName || product.title }}</h2>
    <p v-if="status === 'idle' || status === 'pending'" role="status">Checking availability…</p>
    <div v-else-if="status === 'error'">
      <p role="alert">We couldn’t load the current price.</p>
      <button type="button" @click="emit('retry')">Try again</button>
    </div>
    <p v-else-if="!sku">This encounter is currently unavailable.</p>
    <form v-else @submit.prevent="checkout">
      <p v-if="showPackage || sku.name !== (productName || product.title)">{{ sku.name }}</p>
      <p class="price"><strong>{{ usd(sku.price) }}</strong> / person</p>
      <p v-if="orderNote">{{ orderNote }}</p>
      <div class="booking-fields">
        <label>{{ product.kind === 'route' ? 'Preferred departure date' : 'Preferred experience date' }}
          <input v-model="date" type="date" :min="minimumDate" required>
        </label>
        <label>Travelers
          <input v-model="quantity" type="number" min="1" step="1" required>
        </label>
      </div>
      <p>Our team will confirm your date after payment. All dates are local to China.</p>
      <p v-if="error" role="alert">{{ error }}</p>
      <button type="submit">Continue to checkout →</button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { healthCheckupProductCode } from '~~/shared/utils/encounterProducts'
import type { EncounterProduct } from '~~/shared/utils/encounterProducts'
import type { CatalogSku } from '~/composables/useCommerce'

const props = defineProps<{
  product: EncounterProduct
  productName?: string
  sku?: CatalogSku
  status: 'idle' | 'pending' | 'success' | 'error'
  orderNote?: string
  showPackage?: boolean
}>()
const emit = defineEmits<{ retry: [] }>()
const date = ref('')
const quantity = ref<number | string>(1)
const minimumDate = ref(todayInChina())
const error = ref('')

onMounted(() => {
  minimumDate.value = todayInChina()
  watch(() => props.sku?.skuCode, (skuCode) => {
    const saved = skuCode ? rememberTravelDate(props.product.code, skuCode) : ''
    date.value = isTravelDate(saved) ? saved : ''
  }, { immediate: true })
})

async function checkout() {
  if (!props.sku) return
  if (!isTravelDate(date.value)) {
    error.value = 'Choose today or a future date in China.'
    return
  }
  const amount = Number(quantity.value)
  if (!validOrderQuantity(props.product.code, amount)) {
    error.value = 'Enter a valid whole number of travelers.'
    return
  }
  error.value = ''
  rememberTravelDate(props.product.code, props.sku.skuCode, date.value)
  if (props.product.code === healthCheckupProductCode) {
    rememberHealthCheckupNote(props.sku.skuCode, props.orderNote ?? '')
  }
  await navigateTo(checkoutPath(props.product.code, props.sku.skuCode, amount))
}
</script>

<style scoped>
.booking {
  max-width: 720px;
  margin: 0 auto;
  padding: clamp(24px, 5vw, 48px);
  border: 1px solid #dce7db;
  border-radius: 24px;
  background: #f2f7ee;
}
.booking h2 { margin: 0 0 12px; }
.booking p { margin: 0 0 16px; }
.booking .price strong { font-size: 29px; }
.booking-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px; }
.booking label { display: grid; gap: 6px; font-weight: 600; }
.booking input {
  min-width: 0;
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #aabeae;
  border-radius: 8px;
  color: inherit;
  background: #fff;
  font: inherit;
}
.booking button {
  border: 0;
  border-radius: 100px;
  padding: 12px 22px;
  color: #fff;
  background: #1e3a2f;
  font-weight: 600;
  cursor: pointer;
}
@media (max-width: 500px) {
  .booking-fields { grid-template-columns: 1fr; }
}
</style>
