<template>
  <main class="store-checkout">
    <h1>Checkout</h1>
    <p v-if="status === 'pending'" role="status">Loading your package…</p>
    <template v-else-if="selection && detail && quantity">
      <NuxtLink :to="detail.product.landingPath">Back to {{ detail.product.name }}</NuxtLink>
      <h2>{{ selection.name }}</h2>
      <dl><div v-for="spec in selection.specifications" :key="spec.key"><dt>{{ spec.label }}</dt><dd>{{ spec.value }}</dd></div></dl>
      <p>{{ quantity }} × {{ usd(amount / quantity) }} <strong>· {{ usd(amount) }} USD</strong></p>
      <form @submit.prevent="submit">
        <h2>Contact and billing</h2>
        <div class="billing-grid">
          <label>First name <input v-model.trim="contact.firstName" autocomplete="given-name" required maxlength="80"></label>
          <label>Last name <input v-model.trim="contact.lastName" autocomplete="family-name" required maxlength="80"></label>
          <label>Email <input v-model.trim="contact.email" type="email" autocomplete="email" required maxlength="254"></label>
          <label>Phone <input v-model.trim="contact.phone" type="tel" autocomplete="tel" required maxlength="40"></label>
          <label>Country <select v-model="contact.country" autocomplete="country" required><option value="">Select country</option><option v-for="country in countries" :key="country[1]" :value="country[1]">{{ country[0] }}</option></select></label>
          <label>State or province <select v-if="regions.length" v-model="contact.state" autocomplete="address-level1" required><option value="">Select state or province</option><option v-for="region in regions" :key="region[1]" :value="region[1]">{{ region[0] }}</option></select><input v-else v-model.trim="contact.state" required maxlength="6" pattern="[A-Za-z0-9]{1,6}" autocomplete="address-level1"></label>
          <label>City <input v-model.trim="contact.city" maxlength="100" autocomplete="address-level2"></label>
          <label>Postal code <input v-model.trim="contact.zip" maxlength="20" autocomplete="postal-code"></label>
          <label class="wide">Billing address <input v-model.trim="contact.address" maxlength="200" autocomplete="street-address"></label>
          <label class="wide">Order note (optional) <textarea v-model.trim="note" maxlength="1000" rows="3" /></label>
        </div>
        <label class="consent"><input v-model="agreed" type="checkbox" required> <span>I agree to the <NuxtLink to="/terms">terms and conditions</NuxtLink>.</span></label>
        <p v-if="message" role="alert">{{ message }}</p>
        <button type="submit" :disabled="submitting">{{ submitting ? 'Creating order…' : 'Continue to payment' }}</button>
      </form>
    </template>
    <template v-else-if="selection && detail">
      <p role="alert">Choose a quantity between 1 and {{ maxOrderQuantity }}.</p>
      <NuxtLink :to="detail.product.landingPath">Back to {{ detail.product.name }}</NuxtLink>
    </template>
    <template v-else><p role="alert">This package is unavailable.</p><NuxtLink to="/encounters">Browse products</NuxtLink></template>
  </main>
</template>
<script setup lang="ts">
import { allCountries } from 'country-region-data'

definePageMeta({ middleware: 'member-auth' })
useSeoMeta({ title: 'Checkout', robots: 'noindex, nofollow' })
const route = useRoute()
const commerce = useCommerce()
const auth = useMemberAuth()
const productCode = computed(() => typeof route.query.product === 'string' ? route.query.product : '')
const skuCode = computed(() => typeof route.query.sku === 'string' ? route.query.sku : '')
const quantity = computed(() => {
  const value = route.query.quantity
  if (value === undefined) return 1
  const count = typeof value === 'string' && /^[1-9]\d*$/.test(value) ? Number(value) : 0
  return count <= maxOrderQuantity ? count : 0
})
const { data: detail, status } = useAsyncData(computed(() => 'checkout:' + productCode.value), () => commerce.product(productCode.value), { server: false })
const selection = computed(() => detail.value?.skus.find(sku => sku.skuCode === skuCode.value))
const amount = ref(0)
watch([selection, quantity], ([sku, count]) => {
  amount.value = Math.round((sku?.price ?? 0) * 100) * count / 100
}, { immediate: true })
const countries = allCountries
const contact = reactive({ firstName: '', lastName: '', email: '', phone: '', country: '', state: '', city: '', zip: '', address: '' })
const regions = computed(() => countries.find(country => country[1] === contact.country)?.[2] || [])
watch(() => contact.country, () => { if (!regions.value.some(region => region[1] === contact.state)) contact.state = '' }, { flush: 'sync' })
onMounted(async () => {
  const member = await auth.loadMember().catch(() => null)
  if (member) Object.assign(contact, { firstName: member.firstName || '', lastName: member.lastName || '', email: member.email, phone: member.mobile || '', country: member.country || '', state: member.stateProvince || '' })
})
const note = ref('')
const agreed = ref(false)
const submitting = ref(false)
const message = ref('')
let requestId = ''
let previousPayload = ''
async function submit() {
  if (!selection.value || !quantity.value || !agreed.value || submitting.value) return
  const request = { productCode: productCode.value, skuCode: skuCode.value, quantity: quantity.value, confirmedAmount: amount.value, contact: { ...contact }, note: note.value }
  const payload = JSON.stringify(request)
  if (payload !== previousPayload) {
    requestId = crypto.randomUUID()
    previousPayload = payload
  }
  submitting.value = true
  message.value = ''
  try {
    const result = await commerce.create({ ...request, checkoutRequestId: requestId })
    if (result.orderNo) await navigateTo(`/orders/${encodeURIComponent(result.orderNo)}/pay`)
    else if (result.currentAmount != null) {
      amount.value = Number(result.currentAmount)
      agreed.value = false
      message.value = 'The package price has changed. Review the new total before continuing.'
    }
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'Could not create your order. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>
<style scoped>
.store-checkout { max-width: 760px; margin: 0 auto; padding: 48px 20px; color: #20372d; }
.store-checkout h1 { font-size: 2rem; margin: 0 0 20px; }
.store-checkout h2 { font-size: 1.3rem; margin: 22px 0 12px; }
.store-checkout dl div { display: flex; gap: 12px; }
.store-checkout dd { margin: 0; font-weight: 600; }
.billing-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 14px; }
.billing-grid label { display: grid; gap: 5px; }
.billing-grid .wide { grid-column: 1/-1; }
.billing-grid :is(input,select,textarea) { width: 100%; box-sizing: border-box; border: 1px solid #a7b5ad; border-radius: 6px; padding: 10px; background: white; }
.consent { display: flex; gap: 8px; margin: 20px 0; }
button { border: 0; border-radius: 6px; background: #244c3b; color: white; padding: 12px 20px; }
button:disabled { opacity: .6; }
@media (max-width: 540px) { .billing-grid { grid-template-columns: 1fr; } }
</style>
