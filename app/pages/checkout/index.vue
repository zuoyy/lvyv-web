<template>
  <AccountPageShell active-page="catalog" kicker="Checkout" title="Confirm your journey" description="Review the server-calculated price and apply one available coupon before creating your order." :ready="ready">
    <div v-if="loading" class="checkout-state">Loading checkout...</div>
    <div v-else-if="error" class="checkout-state error">{{ error }} <button type="button" @click="load">Try again</button></div>
    <section v-else class="checkout-layout">
      <div class="checkout-panel">
        <label>Quantity<input v-model.number="quantity" type="number" min="1" step="1" @change="refreshQuote"></label>
        <label>Coupon
          <select v-model="selectedCouponId" @change="refreshQuote">
            <option :value="undefined">No coupon</option>
            <option v-for="coupon in coupons" :key="coupon.coupon.id" :value="coupon.coupon.id">{{ coupon.template.name }} · {{ couponLabel(coupon) }}</option>
          </select>
        </label>
        <div class="redeem-row"><input v-model="redeemCode" placeholder="Redeem code"><button type="button" @click="redeem">Redeem</button></div>
        <p v-if="redeemMessage" class="feedback">{{ redeemMessage }}</p>
      </div>
      <aside v-if="quote" class="checkout-summary">
        <div><span>Original subtotal</span><strong>USD {{ quote.listSubtotal }}</strong></div>
        <div><span>Promotion</span><strong>- USD {{ quote.promotionDiscountAmount }}</strong></div>
        <div><span>Coupon</span><strong>- USD {{ quote.couponDiscountAmount }}</strong></div>
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
const { ready, initializeAccount } = useAccountPage('/checkout')
const skuId = computed(() => Number(route.query.sku || 0))
const quantity = ref(1)
const selectedCouponId = ref<number | undefined>(undefined)
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
  if (!skuId.value) { error.value = 'A product SKU is required.'; return }
  try {
    quote.value = await commerce.previewStandardOrder(skuId.value, Math.max(1, quantity.value), selectedCouponId.value)
    error.value = ''
  } catch (caught) { error.value = caught instanceof Error ? caught.message : 'Could not calculate the price.' }
}
const load = async () => {
  loading.value = true
  try { coupons.value = await commerce.listCoupons(); await refreshQuote() } finally { loading.value = false }
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
  submitting.value = true
  try {
    const order = await commerce.createStandardOrder(skuId.value, Math.max(1, quantity.value), selectedCouponId.value)
    await navigateTo(`/orders?order=${encodeURIComponent(order.order.orderNo)}`)
  } catch (caught) { error.value = caught instanceof Error ? caught.message : 'Could not create the order.' } finally { submitting.value = false }
}
onMounted(async () => { if (await initializeAccount()) await load() })
</script>

<style scoped>
.checkout-layout { display: grid; grid-template-columns: 1fr 320px; gap: 18px; align-items: start; }
.checkout-panel, .checkout-summary { padding: 22px; border: 1px solid #dfe5e1; background: #fff; }
.checkout-panel { display: grid; gap: 18px; }
label { display: grid; gap: 7px; color: #53625b; font-size: 11px; font-weight: 800; text-transform: uppercase; }
input, select { min-height: 42px; padding: 0 11px; border: 1px solid #ccd7d0; background: #fff; color: #263b32; font: inherit; text-transform: none; }
.redeem-row { display: flex; gap: 8px; }.redeem-row input { flex: 1; }.redeem-row button, .checkout-summary button, .checkout-state button { min-height: 42px; padding: 0 15px; border: 0; background: #174d40; color: #fff; font-weight: 700; cursor: pointer; }
.feedback { margin: 0; color: #38705f; font-size: 12px; }.checkout-summary { display: grid; gap: 14px; }.checkout-summary div { display: flex; justify-content: space-between; gap: 12px; color: #748078; font-size: 12px; }.checkout-summary strong { color: #29453a; }.checkout-summary .total { padding-top: 14px; border-top: 1px solid #e3e9e4; color: #173f34; font-size: 14px; }.checkout-summary .total strong { color: #174d40; font-size: 20px; }.checkout-summary button { width: 100%; }.checkout-summary button:disabled { opacity: .6; cursor: wait; }
.checkout-state { min-height: 260px; display: grid; place-items: center; gap: 10px; border: 1px solid #dfe5e1; color: #75827c; text-align: center; }.checkout-state.error { display: flex; flex-direction: column; }
@media (max-width: 700px) { .checkout-layout { grid-template-columns: 1fr; } }
</style>
