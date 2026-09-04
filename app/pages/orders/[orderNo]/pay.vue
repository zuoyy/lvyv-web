<template>
  <div class="payment-page-shell">
    <div class="payment-green-banner" aria-hidden="true" />
    <CheckoutHeader />
    <div class="payment-body-backdrop" aria-hidden="true" />
    <div class="payment-page">
      <div v-if="loading" class="payment-state">Loading payment details...</div>
      <div v-else-if="error" class="payment-state error"><p>{{ error }}</p><button type="button" @click="load">Try again</button></div>
      <section v-else-if="order" class="payment-layout">
        <main class="payment-main">
          <section class="payment-card">
            <div class="payment-card-heading"><h1>Select a Payment Method</h1><p v-if="paymentDeadline">Please secure your booking within <strong>{{ paymentDeadline }}</strong></p></div>
            <div class="payment-method-panel">
              <div class="payment-method-heading"><h2>Credit card</h2><div class="card-brands" aria-label="Accepted cards"><img v-for="brand in cardBrands" :key="brand.name" :src="brand.src" :alt="brand.name"></div></div>
              <div id="oceanpayment-element" class="oceanpayment-element" />
              <p v-if="sdkMessage" class="sdk-message">{{ sdkMessage }}</p>
            </div>
          </section>
          <section class="payment-action-card"><button class="pay-button" type="button" :disabled="submitting || !session || paymentExpired" @click="submit">{{ paymentExpired ? 'Payment expired' : submitting ? 'Processing...' : 'Pay now' }}</button></section>
        </main>
        <aside class="payment-summary">
          <h2>{{ order.items[0]?.snapshot?.title || 'Lvyv journey' }}</h2><div class="summary-divider" /><h3>Price details</h3>
          <dl><div><dt>Prepay online</dt><dd>{{ order.order.currency }} {{ formatMoney(order.originalPayableAmount ?? order.order.subtotal) }}</dd></div></dl>
          <div class="summary-divider" /><div class="total"><strong>Total</strong><strong>{{ order.order.currency }} {{ formatMoney(order.order.totalAmount) }}</strong></div>
        </aside>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import CheckoutHeader from '~/components/checkout/CheckoutHeader.vue'
import type { OrderView, PaymentChannel, PaymentView } from '~/composables/useTourCommerce'
definePageMeta({ layout: false }); useNoIndex(); useHead({ htmlAttrs: { style: 'background-color: #203d33;' }, bodyAttrs: { style: 'background-color: #203d33; margin: 0; padding: 0;' } })
const route = useRoute(); const commerce = useTourCommerce(); const auth = useMemberAuth()
const order = ref<OrderView>(); const session = ref<PaymentView['session']>(); const paymentNo = ref(''); const paymentExpireAt = ref<number | null>(null); const now = ref(Date.now()); const loading = ref(true); const submitting = ref(false); const error = ref(''); const sdkMessage = ref(''); let timer: ReturnType<typeof setInterval> | undefined; let deadlineTimer: ReturnType<typeof setInterval> | undefined
const cardBrands = [{ name: 'Visa', src: '/images/payment/visa.png' }, { name: 'Mastercard', src: '/images/payment/mastercard.png' }, { name: 'JCB', src: '/images/payment/jcb.png' }, { name: 'American Express', src: '/images/payment/american-express.png' }, { name: 'Maestro', src: '/images/payment/maestro.png' }, { name: 'Diners Club', src: '/images/payment/diners-club.png' }, { name: 'Discover', src: '/images/payment/discover.png' }]
const paymentDeadline = computed(() => {
  if (!paymentExpireAt.value) return ''
  const remaining = Math.max(0, paymentExpireAt.value - now.value)
  const hours = Math.floor(remaining / 3600000)
  const minutes = Math.floor((remaining % 3600000) / 60000)
  const seconds = Math.floor((remaining % 60000) / 1000)
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})
const paymentExpired = computed(() => paymentExpireAt.value !== null && paymentExpireAt.value <= now.value)
const formatMoney = (value: unknown) => Number.isFinite(Number(value)) ? Number(value).toFixed(2) : '0.00'
const clientType = () => /MicroMessenger/i.test(navigator.userAgent) ? 'WECHAT_BROWSER' as const : (window.matchMedia('(max-width: 760px)').matches ? 'MOBILE_WEB' as const : 'DESKTOP_WEB' as const)
type OceanpaymentSdk = { init?: (...args: unknown[]) => unknown; checkout?: (fields: Record<string, string>) => unknown }
let sdkPromise: Promise<OceanpaymentSdk> | undefined
const getSdk = (): OceanpaymentSdk | undefined => {
  const value = (window as Window & { Oceanpayment?: OceanpaymentSdk }).Oceanpayment
  return value && typeof value === 'object' ? value : undefined
}
const loadScript = (url: string): Promise<OceanpaymentSdk> => {
  return new Promise<OceanpaymentSdk>((resolve, reject) => {
    const script = document.createElement('script')
    let settled = false
    let poller: number | undefined
    let deadline: number
    const finish = () => {
      if (settled) return
      const sdk = getSdk()
      if (typeof sdk?.init !== 'function' || typeof sdk.checkout !== 'function') return
      settled = true
      if (poller) window.clearInterval(poller)
      window.clearTimeout(deadline)
      resolve(sdk)
    }
    deadline = window.setTimeout(() => {
      if (settled) return
      settled = true
      if (poller) window.clearInterval(poller)
      reject(new Error('Payment form is temporarily unavailable.'))
    }, 6000)
    script.src = url
    script.async = true
    script.onload = () => { finish(); if (!settled) poller = window.setInterval(finish, 50) }
    script.onerror = () => {
      if (settled) return
      settled = true
      window.clearTimeout(deadline)
      reject(new Error('Unable to load payment form.'))
    }
    document.head.appendChild(script)
  })
}

const loadSdk = async (src?: string): Promise<OceanpaymentSdk> => {
  const existing = getSdk()
  if (typeof existing?.init === 'function' && typeof existing.checkout === 'function') return existing
  if (sdkPromise) return sdkPromise

  const localSdkUrl = '/vendor/oceanpayment/oceanpayment.js'
  const remoteSdkUrl = (src && /^https?:\/\//i.test(src)) ? src : null

  sdkPromise = (async () => {
    try {
      return await loadScript(localSdkUrl)
    } catch {
      if (remoteSdkUrl) {
        return await loadScript(remoteSdkUrl)
      }
      throw new Error('Unable to load payment form.')
    }
  })().catch((caught) => {
    sdkPromise = undefined
    throw caught
  })
  return sdkPromise
}

const mount = async () => {
  if (!session.value) return
  await nextTick()
  for (let i = 0; i < 20; i++) {
    if (document.getElementById('oceanpayment-element')) break
    await new Promise(resolve => setTimeout(resolve, 50))
  }
  const container = document.getElementById('oceanpayment-element')
  if (!container) throw new Error('Payment element container not found.')
  const sdk = await loadSdk(session.value.sdkUrl)
  const init = sdk?.init
  if (typeof init !== 'function') throw new Error('Payment form is temporarily unavailable.')
  init.call(sdk, session.value.sandbox, '', '')
}
const poll = () => { if (!paymentNo.value || timer) return; timer = setInterval(async () => { try { const payment = await commerce.getPayment(paymentNo.value); if (['SUCCEEDED', 'FAILED', 'EXPIRED', 'REVIEW_REQUIRED'].includes(payment.status)) { if (timer) clearInterval(timer); await navigateTo(`/payment/result?paymentNo=${encodeURIComponent(payment.paymentNo)}`) } } catch {} }, 2500) }
const submit = () => {
  if (!session.value || submitting.value || paymentExpired.value) return
  const sdk = getSdk()
  if (typeof sdk?.checkout !== 'function') { sdkMessage.value = 'Payment form is temporarily unavailable. Please try again.'; return }
  submitting.value = true
  sdkMessage.value = ''
  try {
    const fields = { ...session.value.fields }
    if (!fields.key) {
      fields.key = '84bc7a609809d871c3a4d90965326239fdb5a849d012685ed6b90d01ac46fcf17392e290146787f1d555a529d7cab76b3d856d91a93c3954d5cd346d182daeb8589b74711af7353815dead9fcdd3db9274a28b0292239aeaa0995f9f221b743f4b15fe4cf43ac939d5bdab9d6739434d6764b07ed26f30127b97f8f1a111fe2b'
    }
    if (!fields.backUrl && paymentNo.value) {
      fields.backUrl = `${window.location.origin}/web-api/commerce/payments/oceanpayment/return?paymentNo=${encodeURIComponent(paymentNo.value)}`
    }
    sdk.checkout(fields)
  } catch {
    sdkMessage.value = 'Unable to submit payment. Please try again.'
    submitting.value = false
  }
}
const load = async () => {
  loading.value = true
  error.value = ''
  try {
    const [loadedOrder, channels] = await Promise.all([
      commerce.getOrder(String(route.params.orderNo)),
      commerce.listPaymentChannels()
    ])
    if (loadedOrder.order.status === 'COMPLETED') {
      await navigateTo(auth.token.value ? '/trips' : '/encounters')
      return
    }
    if (!channels.some(item => item.enabled && item.channel === 'CREDIT_CARD')) {
      throw new Error('Credit card payment is temporarily unavailable.')
    }
    order.value = loadedOrder
    const payment = await commerce.createPayment(loadedOrder.order.orderNo, 'CREDIT_CARD' as PaymentChannel, clientType())
    paymentNo.value = payment.paymentNo
    const deadlines = [loadedOrder.order.expireTime, payment.expireTime]
      .map(value => value ? Date.parse(value) : NaN)
      .filter(Number.isFinite)
    paymentExpireAt.value = deadlines.length > 0 ? Math.min(...deadlines) : null
    if (payment.status === 'SUCCEEDED') {
      await navigateTo(`/payment/result?paymentNo=${encodeURIComponent(payment.paymentNo)}`)
      return
    }
    session.value = payment.session
    loading.value = false
    await mount()
    poll()
  } catch (caught) {
    loading.value = false
    error.value = caught instanceof Error ? caught.message : 'Unable to load payment details.'
  }
}
onMounted(() => {
  deadlineTimer = setInterval(() => { now.value = Date.now() }, 1000)
  ;(window as any).oceanpaymentCallBack = async (data: any) => {
    if (typeof data === 'object' && data?.msg) {
      sdkMessage.value = data.msg
      submitting.value = false
      return
    }
    let payload: Record<string, string> = {}
    if (typeof data === 'string') {
      const trimmed = data.trim()
      if (trimmed.startsWith('<')) {
        try {
          const parser = new DOMParser()
          const doc = parser.parseFromString(trimmed, 'text/xml')
          const root = doc.documentElement
          for (let i = 0; i < root.children.length; i++) {
            const el = root.children[i]
            if (el) payload[el.tagName] = el.textContent || ''
          }
        } catch {}
      } else {
        try { payload = JSON.parse(trimmed) } catch {}
      }
    } else if (typeof data === 'object' && data) {
      payload = { ...data }
    }

    if (payload.pay_url) {
      window.location.assign(payload.pay_url)
      return
    }

    try {
      const result = await auth.request<PaymentView>('/commerce/payments/oceanpayment/embedded-result', payload)
      if (result.session?.threeDsUrl) {
        window.location.assign(result.session.threeDsUrl)
      } else {
        submitting.value = false
        poll()
      }
    } catch {
      submitting.value = false
      poll()
    }
  }
  void load()
})
onBeforeUnmount(() => { if (timer) clearInterval(timer); if (deadlineTimer) clearInterval(deadlineTimer); delete (window as any).oceanpaymentCallBack })
</script>

<style scoped>
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
