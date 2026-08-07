<template>
  <AccountPageShell active-page="orders" kicker="Secure checkout" title="Pay for your journey" description="Choose a payment method and continue to Oceanpayment's secure hosted checkout." :ready="ready">
    <div v-if="loading" class="payment-state">Loading payment details...</div>
    <div v-else-if="error" class="payment-state error">{{ error }}</div>
    <form v-else-if="order" class="payment-layout" @submit.prevent="submit">
      <section class="payment-main">
        <header><p>{{ order.order.orderNo }}</p><h2>Payment method</h2></header>
        <div v-if="channels.length" class="channel-grid">
          <label v-for="item in channels" :key="item.channel" :class="{ selected: channel === item.channel }">
            <input v-model="channel" type="radio" name="channel" :value="item.channel">
            <font-awesome-icon :icon="['fas', item.channel === 'CREDIT_CARD' ? 'credit-card' : 'wallet']" />
            <span>{{ item.name }}</span>
          </label>
        </div>
        <p v-else class="channel-empty">Online payment is temporarily unavailable.</p>
        <h2>Billing details</h2>
        <div class="billing-grid">
          <label><span>First name</span><input v-model.trim="billing.firstName" autocomplete="given-name" required maxlength="64"></label>
          <label><span>Last name</span><input v-model.trim="billing.lastName" autocomplete="family-name" required maxlength="64"></label>
          <label><span>Email</span><input v-model.trim="billing.email" type="email" autocomplete="email" required maxlength="128"></label>
          <label><span>Phone</span><input v-model.trim="billing.phone" autocomplete="tel" required maxlength="32"></label>
          <label><span>Country code</span><input v-model.trim="billing.country" autocomplete="country" required minlength="2" maxlength="2" placeholder="US"></label>
          <label><span>State / province</span><input v-model.trim="billing.state" autocomplete="address-level1" maxlength="64"></label>
          <label><span>City</span><input v-model.trim="billing.city" autocomplete="address-level2" required maxlength="64"></label>
          <label><span>Postal code</span><input v-model.trim="billing.zip" autocomplete="postal-code" required maxlength="20"></label>
          <label class="wide"><span>Address</span><input v-model.trim="billing.address" autocomplete="street-address" required maxlength="200"></label>
        </div>
      </section>
      <aside class="payment-summary">
        <p>Amount due</p><strong>{{ order.order.currency }} {{ order.order.totalAmount }}</strong>
        <dl><div><dt>Journey</dt><dd>{{ order.items[0]?.snapshot?.title || 'Lvyv journey' }}</dd></div><div><dt>Travelers</dt><dd>{{ order.items[0]?.item.quantity || 1 }}</dd></div></dl>
        <button :disabled="submitting || !channel || !channels.length">{{ submitting ? 'Connecting securely...' : 'Continue to secure payment' }}</button>
        <small>Card and wallet details are entered only on Oceanpayment. Lvyv never receives your card number or security code.</small>
      </aside>
    </form>
  </AccountPageShell>
</template>

<script setup lang="ts">
import AccountPageShell from '~/components/profile/AccountPageShell.vue'
import type { BillingDetails, OrderView, PaymentChannel } from '~/composables/useTourCommerce'
useNoIndex()
const route = useRoute()
const { ready, initializeAccount } = useAccountPage(`/orders/${String(route.params.orderNo)}/pay`)
const commerce = useTourCommerce()
const auth = useMemberAuth()
const order = ref<OrderView>()
const channels = ref<Array<{ channel: PaymentChannel; name: string; enabled: boolean }>>([])
const channel = ref<PaymentChannel>()
const loading = ref(true)
const submitting = ref(false)
const error = ref('')
const billing = reactive<BillingDetails>({ firstName: '', lastName: '', email: '', phone: '', country: '', state: '', city: '', address: '', zip: '' })

const clientType = () => {
  if (/MicroMessenger/i.test(navigator.userAgent)) return 'WECHAT_BROWSER' as const
  return window.matchMedia('(max-width: 760px)').matches ? 'MOBILE_WEB' as const : 'DESKTOP_WEB' as const
}
const submit = async () => {
  if (!order.value || !channel.value) return
  submitting.value = true; error.value = ''
  try {
    const payment = await commerce.createPayment(order.value.order.orderNo, channel.value, clientType(), { ...billing, country: billing.country.toUpperCase() })
    if (payment.redirectUrl && (payment.status === 'PENDING' || payment.status === 'CREATED')) window.location.assign(payment.redirectUrl)
    else await navigateTo(`/payment/result?paymentNo=${encodeURIComponent(payment.paymentNo)}`)
  } catch (caught) { error.value = caught instanceof Error ? caught.message : 'Unable to start payment.' }
  finally { submitting.value = false }
}
onMounted(async () => {
  if (!await initializeAccount()) return
  try {
    const [loadedOrder, loadedChannels] = await Promise.all([commerce.getOrder(String(route.params.orderNo)), commerce.listPaymentChannels()])
    if (loadedOrder.order.status === 'COMPLETED') { await navigateTo('/trips'); return }
    order.value = loadedOrder; channels.value = loadedChannels.filter(item => item.enabled); channel.value = channels.value[0]?.channel
    billing.email = auth.member.value?.email || ''
    const names = (auth.member.value?.nickname || '').trim().split(/\s+/)
    billing.firstName = names[0] || ''; billing.lastName = names.slice(1).join(' ')
  } catch (caught) { error.value = caught instanceof Error ? caught.message : 'Unable to load payment details.' }
  finally { loading.value = false }
})
</script>

<style scoped>
.payment-state { min-height: 320px; display: grid; place-items: center; border: 1px solid #dfe5e1; color: #6f7e77; }.payment-state.error { color: #a83b32; }
.payment-layout { display: grid; grid-template-columns: minmax(0,1fr) 300px; gap: 28px; align-items: start; }.payment-main { min-width: 0; }.payment-main header p { margin: 0 0 5px; color: #7d8a83; font-size: 10px; font-weight: 800; }.payment-main h2 { margin: 0 0 16px; color: #173f34; font: 600 22px/1.2 'Playfair Display',Georgia,serif; }.payment-main > h2 { margin-top: 30px; }
.channel-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 10px; }.channel-grid label { min-height: 76px; display: flex; align-items: center; gap: 10px; padding: 16px; border: 1px solid #d7e0da; cursor: pointer; }.channel-grid label.selected { border-color: #174d40; box-shadow: inset 0 0 0 1px #174d40; }.channel-grid input { accent-color: #174d40; }.channel-empty { padding: 18px; background: #f5f7f5; color: #68766f; }
.billing-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 14px; }.billing-grid label { display: grid; gap: 7px; color: #485950; font-size: 11px; font-weight: 700; }.billing-grid label.wide { grid-column: 1/-1; }.billing-grid input { width: 100%; min-height: 44px; padding: 0 12px; border: 1px solid #ccd7d0; background: #fff; color: #243a31; box-sizing: border-box; }.billing-grid input:focus { outline: 2px solid rgba(23,77,64,.16); border-color: #174d40; }
.payment-summary { position: sticky; top: 90px; padding: 24px; border: 1px solid #d8e1dc; background: #f7faf8; }.payment-summary > p { margin: 0; color: #718078; font-size: 10px; font-weight: 800; text-transform: uppercase; }.payment-summary > strong { display: block; margin: 7px 0 20px; color: #174d40; font-size: 26px; }.payment-summary dl { margin: 0 0 20px; }.payment-summary dl div { padding: 11px 0; border-top: 1px solid #dce4df; }.payment-summary dt { color: #7a8881; font-size: 10px; }.payment-summary dd { margin: 4px 0 0; color: #31463c; font-size: 12px; font-weight: 700; }.payment-summary button { width: 100%; min-height: 46px; border: 0; background: #174d40; color: #fff; font-weight: 800; cursor: pointer; }.payment-summary button:disabled { opacity: .55; cursor: not-allowed; }.payment-summary small { display: block; margin-top: 13px; color: #718078; font-size: 9px; line-height: 1.5; }
@media(max-width:780px){.payment-layout{grid-template-columns:1fr}.payment-summary{position:static}.channel-grid{grid-template-columns:1fr}.billing-grid{grid-template-columns:1fr}.billing-grid label.wide{grid-column:auto}}
</style>
