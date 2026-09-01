<template>
  <AccountPageShell active-page="orders" kicker="Checkout" title="Confirm your journey" description="Review the server-calculated price before creating your order." :ready="true" :show-navigation="false">
    <div v-if="loading" class="checkout-state">Loading checkout...</div>
    <div v-else-if="error" class="checkout-state error">{{ error }} <button type="button" @click="load">Try again</button></div>
    <section v-else class="checkout-layout">
      <div class="checkout-panel">
        <label>Adults<input v-model.number="adultCount" type="number" min="1" step="1" @change="refreshQuote"></label>
        <label>Children<input v-model.number="childCount" type="number" min="0" step="1" @change="refreshQuote"></label>
        <label>Departure date<input v-model="startDate" type="date" :min="earliestStartDate" required @change="refreshQuote"></label>
        <label v-if="isLoggedIn">Coupon
          <select v-model="selectedCouponId" @change="refreshQuote">
            <option :value="undefined">No coupon</option>
            <option v-for="coupon in coupons" :key="coupon.coupon.id" :value="coupon.coupon.id">{{ coupon.template.name }} · {{ couponLabel(coupon) }}</option>
          </select>
        </label>
        <label v-if="isLoggedIn">Points to use ({{ pointsPerUsd }} points = 1 USD)<input v-model.number="requestedPoints" type="number" min="0" :step="pointsPerUsd" @input="refreshQuote"></label>
        <button v-if="isLoggedIn" type="button" class="use-all" @click="useAllPoints">Use all available points ({{ availablePoints }})</button>
        <div v-if="isLoggedIn" class="redeem-row"><input v-model="redeemCode" placeholder="Redeem code"><button type="button" @click="redeem">Redeem</button></div>
        <p v-if="isLoggedIn && redeemMessage" class="feedback">{{ redeemMessage }}</p>
      </div>
      <aside v-if="quote" class="checkout-summary">
        <div v-if="quote.adultSaleUnitPrice != null"><span>Adults {{ quote.adultCount }} × {{ quote.adultSaleUnitPrice }} USD</span><strong>USD {{ quote.adultSubtotal }}</strong></div>
        <div v-if="quote.childCount > 0 && quote.childSaleUnitPrice != null"><span>Children {{ quote.childCount }} × {{ quote.childSaleUnitPrice }} USD</span><strong>USD {{ quote.childSubtotal }}</strong></div>
        <div><span>Original subtotal</span><strong>USD {{ quote.listSubtotal }}</strong></div>
        <div><span>Promotion</span><strong>- USD {{ quote.promotionDiscountAmount }}</strong></div>
        <div><span>Coupon</span><strong>- USD {{ quote.couponDiscountAmount }}</strong></div>
        <div v-if="Number(quote.pointsAmount) > 0"><span>Points</span><strong>- USD {{ quote.pointsAmount }}</strong></div>
        <div class="total"><span>Payable</span><strong>USD {{ quote.totalAmount }}</strong></div>
        <button type="button" :disabled="submitting" @click="submit">{{ submitting ? 'Creating order...' : 'Create order' }}</button>
      </aside>
    </section>
  </AccountPageShell>
</template>

<script setup lang="ts">
import AccountPageShell from '~/components/profile/AccountPageShell.vue'
import type { MemberCouponView, OrderPricingQuote } from '~/composables/useTourCommerce'

useNoIndex()
const route = useRoute()
const commerce = useTourCommerce()
const auth = useMemberAuth()
const isLoggedIn = computed(() => Boolean(auth.token.value))
const productCode = computed(() => String(route.query.product || ''))
const dateAfter = (days: number) => {
  const date = new Date()
  date.setHours(12, 0, 0, 0)
  date.setDate(date.getDate() + days)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
const earliestStartDate = ref(dateAfter(1))
const adultCount = ref(Math.max(1, Number(route.query.adultCount || 1)))
const childCount = ref(Math.max(0, Number(route.query.childCount || 0)))
const requestedDate = typeof route.query.date === 'string' ? route.query.date : ''
const startDate = ref(requestedDate >= earliestStartDate.value ? requestedDate : earliestStartDate.value)
const selectedCouponId = ref<number | undefined>(undefined)
const requestedPoints = ref(0); const availablePoints = ref(0); const pointsPerUsd = ref(100)
const coupons = ref<MemberCouponView[]>([])
const quote = ref<OrderPricingQuote | null>(null)
const redeemCode = ref('')
const redeemMessage = ref('')
const loading = ref(false)
const submitting = ref(false)
const error = ref('')

const couponLabel = (coupon: MemberCouponView) => coupon.template.discountType === 'PERCENT'
  ? `${coupon.template.discountValue}% off` : `USD ${coupon.template.discountValue} off`
const refreshQuote = async () => {
  if (!productCode.value) { error.value = 'A product is required.'; return }
  if (!startDate.value) { error.value = 'A departure date is required.'; quote.value = null; return }
  try {
    quote.value = await commerce.previewStandardOrder(productCode.value, Math.max(1, adultCount.value), Math.max(0, childCount.value), startDate.value, selectedCouponId.value, isLoggedIn.value ? requestedPoints.value : 0)
    error.value = ''
  } catch (caught) { error.value = caught instanceof Error ? caught.message : 'Could not calculate the price.' }
}
const load = async () => {
  loading.value = true
  try {
    if (!productCode.value) throw new Error('A product is required.')
    const [catalog, availableCoupons] = await Promise.all([
      commerce.getCatalogProduct(productCode.value),
      isLoggedIn.value ? commerce.listCoupons() : Promise.resolve([]),
    ])
    if (isLoggedIn.value) { const [account, config] = await Promise.all([commerce.getPointsAccount(), commerce.getPointsRedemptionConfig()]); availablePoints.value = account.availablePoints; pointsPerUsd.value = config.pointsPerUsd }
    earliestStartDate.value = dateAfter(Math.max(1, Number(catalog.product.minimumAdvanceDays || 1)))
    if (!requestedDate || requestedDate < earliestStartDate.value) startDate.value = earliestStartDate.value
    coupons.value = availableCoupons
    await refreshQuote()
  } catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'Could not load checkout.'
  } finally { loading.value = false }
}
const redeem = async () => {
  if (!redeemCode.value.trim()) return
  try {
    const result = await commerce.redeemCoupon(redeemCode.value.trim())
    coupons.value = [result, ...coupons.value.filter(item => item.coupon.id !== result.coupon.id)]
    selectedCouponId.value = result.coupon.id
    redeemCode.value = ''
    redeemMessage.value = 'Coupon added to your wallet.'
    await refreshQuote()
  } catch (caught) { redeemMessage.value = caught instanceof Error ? caught.message : 'Could not redeem that code.' }
}
const submit = async () => {
  if (!startDate.value) { error.value = 'A departure date is required.'; return }
  submitting.value = true
  try {
    const order = await commerce.createStandardOrder(productCode.value, Math.max(1, adultCount.value), Math.max(0, childCount.value), startDate.value, selectedCouponId.value, isLoggedIn.value ? requestedPoints.value : 0)
    await navigateTo(order.order.status === 'COMPLETED'
      ? (isLoggedIn.value ? '/trips' : '/encounters')
      : `/orders/${encodeURIComponent(order.order.orderNo)}/pay`)
  } catch (caught) { error.value = caught instanceof Error ? caught.message : 'Could not create the order.' } finally { submitting.value = false }
}
const useAllPoints = () => { requestedPoints.value = availablePoints.value; void refreshQuote() }
onMounted(load)
</script>

<style scoped>
.checkout-layout { display: grid; grid-template-columns: 1fr 320px; gap: 18px; align-items: start; }
.checkout-panel, .checkout-summary { padding: 22px; border: 1px solid #dfe5e1; background: #fff; }
.checkout-panel { display: grid; gap: 18px; }
label { display: grid; gap: 7px; color: #53625b; font-size: 11px; font-weight: 800; text-transform: uppercase; }
input, select { min-height: 42px; padding: 0 11px; border: 1px solid #ccd7d0; background: #fff; color: #263b32; font: inherit; text-transform: none; }
.redeem-row { display: flex; gap: 8px; }.redeem-row input { flex: 1; }.redeem-row button, .checkout-summary button, .checkout-state button { min-height: 42px; padding: 0 15px; border: 0; background: #174d40; color: #fff; font-weight: 700; cursor: pointer; }
.use-all { min-height: 38px; border: 1px solid #174d40; background: #fff; color: #174d40; font-weight: 700; cursor: pointer; }
.feedback { margin: 0; color: #38705f; font-size: 12px; }.checkout-summary { display: grid; gap: 14px; }.checkout-summary div { display: flex; justify-content: space-between; gap: 12px; color: #748078; font-size: 12px; }.checkout-summary strong { color: #29453a; }.checkout-summary .total { padding-top: 14px; border-top: 1px solid #e3e9e4; color: #173f34; font-size: 14px; }.checkout-summary .total strong { color: #174d40; font-size: 20px; }.checkout-summary button { width: 100%; }.checkout-summary button:disabled { opacity: .6; cursor: wait; }
.checkout-state { min-height: 260px; display: grid; place-items: center; gap: 10px; border: 1px solid #dfe5e1; color: #75827c; text-align: center; }.checkout-state.error { display: flex; flex-direction: column; }
@media (max-width: 700px) { .checkout-layout { grid-template-columns: 1fr; } }
</style>
