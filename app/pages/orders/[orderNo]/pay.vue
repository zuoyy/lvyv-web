<template>
  <div class="payment-page-shell">
    <div class="payment-green-banner" aria-hidden="true" />
    <CheckoutHeader />
    <div class="payment-body-backdrop" aria-hidden="true" />
    <div class="payment-page">
      <div v-if="loading" class="payment-state">Loading payment details...</div>
      <div v-else-if="error" class="payment-state error"><p>{{ error }}</p><button type="button" @click="load">Try again</button></div>
      <div v-else-if="orderUnavailable" class="payment-state"><p>{{ orderUnavailable }}</p><NuxtLink to="/orders">Back to orders</NuxtLink></div>
      <section v-else-if="order" class="payment-layout">
        <main class="payment-main">
          <section class="payment-card">
            <div class="payment-card-heading"><h1>Select a Payment Method</h1><p v-if="paymentDeadline">Please secure your booking within <strong>{{ paymentDeadline }}</strong></p></div>
            <div class="payment-tabs" role="tablist" aria-label="Payment methods">
              <button v-for="item in channels" :key="item.channel" type="button" role="tab"
                :aria-selected="selected===item.channel" :disabled="locked || preparing"
                :class="{active:selected===item.channel}" @click="selectChannel(item.channel)">{{ item.name }}</button>
            </div>
            <div class="payment-method-panel">
              <div class="payment-method-heading"><h2>{{ channelName }}</h2><div v-if="selected==='CREDIT_CARD'" class="card-brands" aria-label="Accepted cards"><img v-for="brand in cardBrands" :key="brand.name" :src="brand.src" :alt="brand.name"></div></div>
              <div :class="{ 'wallet-preview': selected!=='CREDIT_CARD' && !walletArmed }">
                <div :id="embeddedAdapters[selected].container" :key="selected" class="oceanpayment-element" :inert="selected!=='CREDIT_CARD' && !walletArmed" />
              </div>
              <p v-if="preparing" role="status">Checking payment availability...</p>
              <p v-if="sdkMessage" class="sdk-message">{{ sdkMessage }}</p>
            </div>
          </section>
          <section class="payment-action-card">
            <button v-if="!walletArmed && session" class="pay-button" type="button" :disabled="submitting || preparing || !sdkReady || paymentExpired" @click="submit">{{ paymentExpired ? 'Payment expired' : submitting ? 'Processing...' : selected==='CREDIT_CARD' ? 'Pay now' : `Continue with ${channelName}` }}</button>
            <button v-if="paymentExpired && !locked" type="button" :disabled="preparing" @click="selectChannel(selected)">Reload payment form</button>
            <p v-if="locked" role="status">{{ walletArmed ? `Use the ${channelName} button above to complete your payment.` : 'We are confirming your payment status. Please keep this page open.' }}</p>
            <NuxtLink v-if="paymentNo" :to="`/payment/result?paymentNo=${encodeURIComponent(paymentNo)}`">View payment status</NuxtLink>
          </section>
        </main>
        <aside class="payment-summary">
          <h2>{{ order.items[0]?.snapshot?.title || 'Lvyv journey' }}</h2><div class="summary-divider" /><h3>Price details</h3>
          <dl><div><dt>Prepay online</dt><dd>{{ order.order.currency }} {{ formatMoney(order.originalPayableAmount ?? order.order.subtotal) }}</dd></div></dl>
          <p v-if="order.order.firstOrderBenefitName" class="sdk-message">
            {{ Number(order.order.firstOrderDiscountAmount || 0) > 0 ? 'Automatic first-order offer' : 'First-order coupon' }}:
            {{ order.order.firstOrderBenefitName }} (included in total)
          </p>
          <p v-if="order.order.expireTime" class="sdk-message">Pay before {{ new Date(order.order.expireTime).toLocaleString('en-US', { timeZone: 'UTC', timeZoneName: 'short' }) }}</p>
          <div class="summary-divider" /><div class="total"><strong>Total</strong><strong>{{ order.order.currency }} {{ formatMoney(order.order.totalAmount) }}</strong></div>
        </aside>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import CheckoutHeader from '~/components/checkout/CheckoutHeader.vue'
import { cardPaymentFailureMessage } from '~/utils/paymentMessages'
import { embeddedAdapters, embeddedEvent, trustedSdkUrl, type EmbeddedChannel } from '~/utils/oceanpaymentEmbedded'
import type { OrderView, PaymentView, PaymentChannelView, PaymentChannel } from '~/composables/useTourCommerce'

definePageMeta({ middleware: 'member-auth', layout: false })
useHead({ title: 'Secure payment | Lvyv', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })
const commerce = useTourCommerce()
const auth = useMemberAuth()
const route = useRoute()
const order = ref<OrderView>()
const channels = ref<PaymentChannelView[]>([])
const selected = ref<EmbeddedChannel>('CREDIT_CARD')
const session = ref<PaymentView['session']>()
const paymentNo = ref('')
const loading = ref(true)
const preparing = ref(false)
const submitting = ref(false)
const locked = ref(false)
const walletArmed = ref(false)
const sdkReady = ref(false)
const error = ref('')
const sdkMessage = ref('')
const now = ref(Date.now())
const paymentExpireAt = ref<number | null>(null)
const signedFields = ref<Record<string, string>>()
const channelName = computed(() => ({ CREDIT_CARD: 'Credit card', GOOGLE_PAY: 'Google Pay', APPLE_PAY: 'Apple Pay' }[selected.value]))
const cardBrands = [{ name: 'Visa', src: '/images/payment/visa.png' }, { name: 'Mastercard', src: '/images/payment/mastercard.png' }, { name: 'Maestro', src: '/images/payment/maestro.png' }, { name: 'Discover', src: '/images/payment/discover.png' }, { name: 'Diners Club', src: '/images/payment/diners-club.png' }]
const paymentExpired = computed(() => paymentExpireAt.value !== null && paymentExpireAt.value <= now.value)
const orderExpiresAt = computed(() => {
  const current = order.value?.order
  if (current?.expireTime) return Date.parse(current.expireTime)
  return current?.createTime ? Date.parse(current.createTime) + 24 * 60 * 60 * 1000 : NaN
})
const orderUnavailable = computed(() => {
  const current = order.value?.order
  if (!current) return ''
  if (current.status === 'CANCELLED') return 'This order is closed. Please create a new booking to continue.'
  if (current.status !== 'PENDING_PAYMENT') return 'This order is no longer awaiting payment.'
  if (!locked.value && orderExpiresAt.value <= now.value) return 'The payment deadline has passed. This order can no longer be paid.'
  return ''
})
const paymentDeadline = computed(() => {
  if (!paymentExpireAt.value) return ''
  const seconds = Math.max(0, Math.floor((paymentExpireAt.value - now.value) / 1000))
  return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60].map(n => String(n).padStart(2, '0')).join(':')
})
const formatMoney = (value: unknown) => Number.isFinite(Number(value)) ? Number(value).toFixed(2) : '0.00'
const clientType = () => /MicroMessenger/i.test(navigator.userAgent) ? 'WECHAT_BROWSER' as const : window.matchMedia('(max-width: 760px)').matches ? 'MOBILE_WEB' as const : 'DESKTOP_WEB' as const
const isEmbedded = (channel: string): channel is EmbeddedChannel => channel in embeddedAdapters

type EmbeddedSdk = { init: (...args: unknown[]) => unknown; checkout: (fields: Record<string, string>) => unknown }
const sdkPromises = new Map<EmbeddedChannel, Promise<EmbeddedSdk>>()
const getSdk = (channel: EmbeddedChannel) => (window as unknown as Record<string, EmbeddedSdk>)[embeddedAdapters[channel].global]
let disposed = false
let generation = 0
let pollTimer: ReturnType<typeof setInterval> | undefined
let deadlineTimer: ReturnType<typeof setInterval> | undefined
let readyTimer: ReturnType<typeof setTimeout> | undefined
let polling = false

function loadSdk(channel: EmbeddedChannel, url: string, sandbox: boolean): Promise<EmbeddedSdk> {
  if (!trustedSdkUrl(channel, url, sandbox)) return Promise.reject(new Error('Payment SDK configuration is invalid.'))
  const runtime = window as unknown as { __lvyvPaymentEnvironments?: Partial<Record<EmbeddedChannel, boolean>> }
  const environments = runtime.__lvyvPaymentEnvironments ||= {}
  if (environments[channel] !== undefined && environments[channel] !== sandbox) {
    // Official SDK keeps a sticky sandbox host. Reload before initializing a different environment.
    window.location.reload()
    return Promise.reject(new Error('Reloading payment configuration...'))
  }
  environments[channel] = sandbox
  const existing = getSdk(channel)
  if (typeof existing?.init === 'function' && typeof existing.checkout === 'function') return Promise.resolve(existing)
  const pending = sdkPromises.get(channel)
  if (pending) return pending
  const promise = new Promise<EmbeddedSdk>((resolve, reject) => {
    const script = document.createElement('script')
    const timeout = setTimeout(() => reject(new Error('Payment form is temporarily unavailable. You can choose another method.')), 15000)
    script.src = url
    script.async = true
    script.onload = () => {
      clearTimeout(timeout)
      const sdk = getSdk(channel)
      if (typeof sdk?.init === 'function' && typeof sdk.checkout === 'function') resolve(sdk)
      else reject(new Error('Payment form is unavailable.'))
    }
    script.onerror = () => { clearTimeout(timeout); reject(new Error('Unable to load this payment method.')) }
    document.head.appendChild(script)
  }).catch(e => { sdkPromises.delete(channel); throw e })
  sdkPromises.set(channel, promise)
  return promise
}

function parsePayload(data: unknown): Record<string, string> {
  if (typeof data === 'string') {
    if (data.trim().startsWith('<')) {
      const doc = new DOMParser().parseFromString(data, 'text/xml')
      if (doc.querySelector('parsererror')) return {}
      return Object.fromEntries(Array.from(doc.documentElement.children).map(node => [node.tagName, node.textContent || '']))
    }
    try { return parsePayload(JSON.parse(data)) } catch { return {} }
  }
  if (!data || typeof data !== 'object') return {}
  return Object.fromEntries(Object.entries(data).filter(([, value]) => typeof value === 'string' || typeof value === 'number').map(([key, value]) => [key, String(value)]))
}

async function callback(channel: EmbeddedChannel, data: unknown) {
  if (disposed || channel !== selected.value) return
  const event = embeddedEvent(parsePayload(data))
  if (event.kind === 'ready') {
    sdkReady.value = true
    preparing.value = false
    if (readyTimer) clearTimeout(readyTimer)
    return
  }
  if (event.kind === 'cancelled') {
    sdkMessage.value = 'Payment window closed. You can reopen the same payment using the wallet button.'
    submitting.value = false
    return
  }
  if (event.kind === 'validation') {
    sdkMessage.value = selected.value === 'CREDIT_CARD' ? cardPaymentFailureMessage(event.code, event.message) || event.message : event.message
    submitting.value = false
    return
  }
  if (event.kind !== 'result' || event.fields.order_number !== paymentNo.value) return
  locked.value = true
  submitting.value = true
  try {
    // Only the backend may validate a 3DS URL; browser-supplied results never prove success.
    const result = await auth.request<PaymentView>('/commerce/payments/oceanpayment/embedded-result', event.fields)
    if (result.session?.threeDsUrl) window.location.assign(result.session.threeDsUrl)
    else { walletArmed.value = false; session.value = undefined; sdkMessage.value = 'Confirming your payment status...' }
  } catch {
    walletArmed.value = false
    session.value = undefined
    sdkMessage.value = 'Confirming your payment status. Please do not start another payment.'
  }
  startPolling()
}

function startPolling() {
  if (pollTimer || !paymentNo.value) return
  pollTimer = setInterval(async () => {
    if (polling || disposed) return
    polling = true
    const current = paymentNo.value
    try {
      const payment = await commerce.getPayment(current)
      if (disposed || current !== paymentNo.value) return
      if (['SUCCEEDED', 'FAILED', 'EXPIRED', 'REVIEW_REQUIRED'].includes(payment.status)) {
        clearInterval(pollTimer)
        pollTimer = undefined
        await navigateTo(`/payment/result?paymentNo=${encodeURIComponent(current)}`)
      }
    } catch { /* Retry status only; never create a second payment after network failure. */ }
    finally { polling = false }
  }, 2500)
}

async function selectChannel(channel: PaymentChannel) {
  if (!isEmbedded(channel) || locked.value || preparing.value || !order.value || orderUnavailable.value) return
  const currentGeneration = ++generation
  preparing.value = true
  sdkReady.value = false
  walletArmed.value = false
  signedFields.value = undefined
  session.value = undefined
  selected.value = channel
  sdkMessage.value = ''
  if (readyTimer) clearTimeout(readyTimer)
  try {
    const payment = await commerce.createPayment(order.value.order.orderNo, channel, clientType())
    if (disposed || generation !== currentGeneration) return
    paymentNo.value = payment.paymentNo
    const deadlines = [orderExpiresAt.value, payment.expireTime ? Date.parse(payment.expireTime) : NaN].filter(Number.isFinite)
    paymentExpireAt.value = deadlines.length ? Math.min(...deadlines) : null
    if (isEmbedded(payment.channel)) selected.value = payment.channel
    if (payment.status === 'SUCCEEDED') { await navigateTo(`/payment/result?paymentNo=${encodeURIComponent(payment.paymentNo)}`); return }
    if (!payment.session) {
      locked.value = true
      preparing.value = false
      sdkMessage.value = 'An existing payment is being confirmed. We will keep checking it.'
      startPolling()
      return
    }
    session.value = payment.session
    if (payment.session.initConfig.backUrl !== window.location.href) {
      throw new Error('Payment page configuration does not match this address. Please contact support.')
    }
    await nextTick()
    const sdk = await loadSdk(selected.value, payment.session.sdkUrl, payment.session.sandbox)
    if (disposed || generation !== currentGeneration) return
    const sandbox = payment.session.sandbox ? true : ''
    if (selected.value === 'CREDIT_CARD') {
      sdk.init(sandbox, '', 'en_US', { showCardName: true })
      sdkReady.value = true
      preparing.value = false
    } else {
      readyTimer = setTimeout(() => {
        if (disposed || sdkReady.value) return
        preparing.value = false
        sdkMessage.value = 'This wallet is unavailable on this device. Please choose credit card.'
      }, 15000)
      sdk.init(sandbox, payment.session.initConfig)
    }
  } catch (e) {
    preparing.value = false
    sdkMessage.value = e instanceof Error ? e.message : 'Unable to initialize this payment method.'
  }
}

async function submit() {
  if (!session.value || submitting.value || preparing.value || !sdkReady.value || paymentExpired.value || orderUnavailable.value) return
  submitting.value = true
  locked.value = true
  sdkMessage.value = ''
  try {
    if (!signedFields.value) {
      const payment = await commerce.issueEmbeddedSession(paymentNo.value)
      if (!payment.session || !Object.keys(payment.session.fields).length) {
        session.value = undefined
        startPolling()
        return
      }
      signedFields.value = payment.session.fields
    }
    if (signedFields.value.backUrl !== window.location.href) throw new Error('Payment page address mismatch')
    const sdk = getSdk(selected.value)
    if (!sdk) throw new Error('Payment SDK unavailable')
    sdk.checkout(signedFields.value)
    walletArmed.value = selected.value !== 'CREDIT_CARD'
    startPolling()
  } catch {
    session.value = undefined
    sdkMessage.value = 'Confirming your payment status. Please do not start another payment.'
    startPolling()
  }
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const [loadedOrder, available, existing] = await Promise.all([
      commerce.getOrder(String(route.params.orderNo)), commerce.listPaymentChannels(clientType()),
      commerce.currentOrderPayment(String(route.params.orderNo))
    ])
    order.value = loadedOrder
    now.value = Date.now()
    if (loadedOrder.order.status === 'COMPLETED') { await navigateTo('/trips'); return }
    if (loadedOrder.order.status !== 'PENDING_PAYMENT') return
    channels.value = available.filter(item => item.enabled && isEmbedded(item.channel) && (item.channel !== 'APPLE_PAY' || (window.isSecureContext && 'ApplePaySession' in window)))
    if (existing && existing.status !== 'FAILED' && !existing.session) {
      paymentNo.value = existing.paymentNo
      if (isEmbedded(existing.channel)) selected.value = existing.channel
      locked.value = true
      loading.value = false
      if (['SUCCEEDED', 'EXPIRED', 'REVIEW_REQUIRED'].includes(existing.status)) {
        await navigateTo(`/payment/result?paymentNo=${encodeURIComponent(existing.paymentNo)}`)
        return
      }
      // A 3DS return must not immediately redirect to the same challenge again.
      sdkMessage.value = 'Confirming your existing payment status...'
      startPolling()
      return
    }
    if (orderUnavailable.value) return
    if (!channels.value.length) throw new Error('Payment is temporarily unavailable.')
    loading.value = false
    const initial = channels.value.find(item => item.channel === existing?.channel)
      || channels.value.find(item => item.channel === 'CREDIT_CARD') || channels.value[0]!
    await selectChannel(initial.channel)
  } catch (e) { error.value = e instanceof Error ? e.message : 'Unable to load payment details.' }
  finally { loading.value = false }
}

onMounted(() => {
  // Canonical path must be identical to the backUrl sent to Embedded, including after 3DS POST/303.
  window.history.replaceState(window.history.state, '', `/orders/${encodeURIComponent(String(route.params.orderNo))}/pay`)
  deadlineTimer = setInterval(() => { now.value = Date.now() }, 1000)
  for (const channel of Object.keys(embeddedAdapters) as EmbeddedChannel[]) {
    ;(window as unknown as Record<string, unknown>)[embeddedAdapters[channel].callback] = (data: unknown) => void callback(channel, data)
  }
  void load()
})
onBeforeUnmount(() => {
  disposed = true
  if (pollTimer) clearInterval(pollTimer)
  if (deadlineTimer) clearInterval(deadlineTimer)
  if (readyTimer) clearTimeout(readyTimer)
  for (const adapter of Object.values(embeddedAdapters)) {
    // Official SDK message listeners survive navigation, so retain a harmless callback until remount.
    ;(window as unknown as Record<string, unknown>)[adapter.callback] = () => {}
  }
})
</script>


<style scoped>
.payment-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin: 20px 0; }
.payment-tabs button { padding: 12px 18px; border: 1px solid #d4dcd7; border-radius: 8px; background: white; cursor: pointer; }
.payment-tabs button.active { border-color: #203d33; background: #edf4ef; font-weight: 600; }
.payment-tabs button:disabled { cursor: default; opacity: .6; }
.wallet-preview { pointer-events: none; opacity: .55; }
.payment-action-card a { display: inline-block; margin-top: 16px; color: #203d33; }

.payment-page-shell,
.payment-page-shell * {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  box-sizing: border-box;
}

.payment-page-shell {
  position: relative;
  min-height: 100vh;
  background: #203d33;
  color: #242424;
  overflow-x: clip;
}

.payment-green-banner {
  position: absolute;
  inset: 0 0 auto;
  height: 264px;
  background: #203d33;
  z-index: 1;
}

.payment-body-backdrop {
  position: absolute;
  top: 157px;
  right: 0;
  bottom: 0;
  left: 0;
  background: #f5f6f3;
  border-radius: 20px 20px 0 0;
  z-index: 2;
}

.payment-page {
  position: relative;
  z-index: 5;
  min-height: calc(100vh - 80px);
  padding: 20px 0 70px;
}

.payment-layout {
  display: grid;
  grid-template-columns: minmax(0, 803px) minmax(320px, 441px);
  gap: 16px;
  width: min(1256px, calc(100% - 64px));
  margin: 0 auto;
  align-items: start;
}

.payment-main {
  display: grid;
  gap: 16px;
}

.payment-card,
.payment-action-card,
.payment-summary {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(17, 34, 17, 0.05);
}

.payment-card {
  padding: 28px;
}

.payment-card-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.payment-card-heading h1 {
  margin: 0;
  color: #112211;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 26px;
}

.payment-card-heading p {
  margin: 0;
  color: #242424;
  opacity: 0.8;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  white-space: nowrap;
}

.payment-card-heading p strong {
  font-size: 16px;
  font-weight: 700;
  color: #112211;
}

.payment-method-panel {
  margin-top: 28px;
  padding: 20px 16px;
  border: 1px solid #c6cfc6;
  border-radius: 4px;
}

.payment-method-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.payment-method-heading h2 {
  margin: 0;
  color: #242424;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: 28px;
}

.card-brands {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-brands img {
  width: 38px;
  height: 24px;
  object-fit: contain;
}

.oceanpayment-element {
  margin-top: 16px;
  padding: 24px 40px;
  border: 1px solid #203d33;
  border-radius: 4px;
  background: #f8faf8;
}

.sdk-message {
  margin: 12px 0 0;
  color: #a83b32;
  font-size: 12px;
}

.payment-action-card {
  height: 124px;
  padding: 28px;
}

.pay-button {
  width: 100%;
  height: 54px;
  border: 0;
  border-radius: 4px;
  background: #203d33;
  color: #fff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.pay-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.payment-summary {
  min-height: 369px;
  padding: 28px 33px;
}

.payment-summary h2 {
  margin: 0;
  max-width: 378px;
  color: #242424;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 28.15px;
}

.payment-summary h3 {
  margin: 18px 0 10px;
  color: #242424;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 28.15px;
}

.summary-divider {
  border-top: 1px dashed #c6cfc6;
  margin: 18px 0;
}

.payment-summary dl {
  margin: 0;
}

.payment-summary dl div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 8px 0;
  color: #090909;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24.63px;
}

.payment-summary dt,
.payment-summary dd {
  margin: 0;
}

.payment-summary dd {
  text-align: right;
}

.total {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  color: #242424;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 16px;
  line-height: 24.63px;
}

.total strong:first-child {
  font-weight: 700;
  font-size: 16px;
}

.total strong:last-child {
  color: #203d33;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 22px;
  font-weight: 700;
  line-height: 25.8px;
}

.payment-state {
  position: relative;
  z-index: 1;
  min-height: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #6f7e77;
}

.payment-state.error {
  color: #a83b32;
}

.payment-state p {
  margin: 0;
}

.payment-state button {
  padding: 10px 16px;
  border: 0;
  background: #203d33;
  color: #fff;
  cursor: pointer;
}

@media (max-width: 1000px) {
  .payment-layout {
    grid-template-columns: 1fr;
    width: min(803px, calc(100% - 32px));
  }

  .payment-summary {
    position: static;
  }
}

@media (max-width: 640px) {
  .payment-page {
    padding-top: 10px;
  }

  .payment-card,
  .payment-action-card,
  .payment-summary {
    border-radius: 10px;
  }

  .payment-card {
    padding: 24px 20px;
  }

  .payment-card-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  .payment-card-heading p {
    white-space: normal;
  }

  .payment-method-panel {
    padding: 18px 12px;
  }

  .payment-method-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .card-brands {
    flex-wrap: wrap;
  }

  .oceanpayment-element {
    padding: 20px 16px;
  }

  .payment-action-card {
    height: auto;
    padding: 20px;
  }

  .payment-summary {
    min-height: 0;
    padding: 24px 20px;
  }
}
</style>
