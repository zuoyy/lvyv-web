<template>
  <div class="payment-page-shell">
    <div class="payment-green-banner" aria-hidden="true" />
    <CheckoutHeader />
    <div class="payment-body-backdrop" aria-hidden="true" />
    <div class="payment-page">
      <div v-if="loading" class="payment-state">Loading payment details...</div>
      <div v-else-if="error" class="payment-state error">
        <p>{{ error }}</p>
        <button type="button" @click="load">Try again</button>
      </div>
      <div v-else-if="orderUnavailable" class="payment-state">
        <p>{{ orderUnavailable }}</p>
        <NuxtLink to="/orders">Back to orders</NuxtLink>
      </div>
      <section v-else-if="order" class="payment-layout">
        <!-- 左侧区域：Contact info, Traveler details, Payment (Credit Card) -->
        <main class="payment-main">
          <!-- 面包屑 -->
          <nav class="checkout-breadcrumbs" aria-label="Checkout navigation">
            <span class="step-inactive">Cart</span>
            <span class="step-sep">&rarr;</span>
            <span class="step-active">Checkout</span>
          </nav>

          <!-- Contact info 卡片 -->
          <section class="checkout-info-card">
            <h2 class="section-title">Contact info</h2>
            <div class="info-field-box">
              <span class="field-label">Email address</span>
              <span class="field-value">{{ contactEmail || 'Contact information from order' }}</span>
            </div>
          </section>

          <!-- Traveler / Delivery 卡片 -->
          <section class="checkout-info-card">
            <h2 class="section-title">Traveler information</h2>
            <div class="info-grid">
              <div class="info-field-box">
                <span class="field-label">Traveler(s)</span>
                <span class="field-value">{{ travelerCountText }}</span>
              </div>
              <div v-if="tripDateText" class="info-field-box">
                <span class="field-label">Departure</span>
                <span class="field-value">{{ tripDateText }}</span>
              </div>
            </div>
          </section>

          <!-- Payment (Payment Element) 卡片 -->
          <section class="payment-element-card">
            <div class="element-card-header">
              <h2 class="section-title">Payment</h2>
              <span class="payment-element-badge">Payment Element</span>
            </div>

            <div class="credit-card-panel">
              <div class="credit-card-heading">
                <div class="credit-card-selector">
                  <span class="radio-dot" aria-hidden="true" />
                  <strong>Credit card</strong>
                </div>
                <div class="card-brands" aria-label="Accepted card brands">
                  <img v-for="brand in cardBrands" :key="brand.name" :src="brand.src" :alt="brand.name">
                </div>
              </div>

              <!-- 官方嵌入式信用卡输入框容器（常驻） -->
              <div id="oceanpayment-element" class="oceanpayment-element" />

              <p v-if="sdkMessage && selected === 'CREDIT_CARD'" class="sdk-message error">{{ sdkMessage }}</p>
            </div>
          </section>
        </main>

        <!-- 右侧区域：Price details / Summary + 快捷支付按钮 + Place order -->
        <aside class="payment-summary">
          <h2 class="summary-product-title">{{ order.items[0]?.snapshot?.title || 'Lvyv journey' }}</h2>
          <div class="summary-divider" />
          <h3 class="summary-subtitle">Price details</h3>
          <dl class="summary-price-dl">
            <div>
              <dt>Prepay online</dt>
              <dd>{{ order.order.currency }} {{ formatMoney(order.originalPayableAmount ?? order.order.subtotal) }}</dd>
            </div>
          </dl>
          <p v-if="order.order.firstOrderBenefitName" class="benefit-tag">
            {{ Number(order.order.firstOrderDiscountAmount || 0) > 0 ? 'Automatic first-order offer' : 'First-order coupon' }}:
            {{ order.order.firstOrderBenefitName }} (included in total)
          </p>
          <p v-if="paymentDeadline" class="deadline-text">
            Please secure your booking within <strong>{{ paymentDeadline }}</strong>
          </p>
          <div class="summary-divider" />
          <div class="total-row">
            <strong>Total</strong>
            <strong class="total-amount">{{ order.order.currency }} {{ formatMoney(order.order.totalAmount) }}</strong>
          </div>

          <!-- 总价下方的快捷支付按钮与常规提交（参考设计图） -->
          <div class="checkout-actions-block">
            <!-- Apple Pay 按钮容器（总价正下方） -->
            <div v-show="hasApplePay" class="wallet-btn-container">
              <div id="oceanpayment-applepayelement" class="wallet-element-slot" />
            </div>

            <!-- Google Pay 按钮容器（总价正下方） -->
            <div v-show="hasGooglePay" class="wallet-btn-container">
              <div id="oceanpayment-googlepayelement" class="wallet-element-slot" />
            </div>

            <!-- 绿色 Place order 信用卡支付按钮 -->
            <button
              type="button"
              class="place-order-button"
              :disabled="submitting || preparing || !sdkReady || paymentExpired"
              @click="submitOrder"
            >
              {{ paymentExpired ? 'Payment expired' : submitting ? 'Processing...' : 'Place order' }}
            </button>

            <!-- 辅助重载/状态 -->
            <button
              v-if="paymentExpired && !locked"
              type="button"
              class="reload-button"
              :disabled="preparing"
              @click="selectChannel(selected)"
            >
              Reload payment form
            </button>

            <p v-if="locked" class="locked-status-text" role="status">
              {{ walletArmed ? `Please complete your payment in the ${channelName} window.` : 'We are confirming your payment status. Please keep this page open.' }}
            </p>

            <p v-if="sdkMessage && selected !== 'CREDIT_CARD'" class="sdk-message wallet-message">{{ sdkMessage }}</p>
          </div>
        </aside>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import CheckoutHeader from '~/components/checkout/CheckoutHeader.vue'
import { cardPaymentFailureMessage } from '~/utils/paymentMessages'
import { embeddedAdapters, embeddedEvent, trustedSdkUrl, type EmbeddedChannel } from '~/utils/oceanpaymentEmbedded'
import type { OrderView, PaymentView, PaymentChannelView, PaymentChannel, PaymentOptionsView } from '~/composables/useTourCommerce'

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

// 快捷钱包按钮可见性控制
const hasApplePay = ref(false)
const hasGooglePay = ref(false)

const channelName = computed(() => ({ CREDIT_CARD: 'Credit card', GOOGLE_PAY: 'Google Pay', APPLE_PAY: 'Apple Pay' }[selected.value]))
const cardBrands = [
  { name: 'Visa', src: '/images/payment/visa.png' },
  { name: 'Mastercard', src: '/images/payment/mastercard.png' },
  { name: 'Maestro', src: '/images/payment/maestro.png' },
  { name: 'Discover', src: '/images/payment/discover.png' },
  { name: 'Diners Club', src: '/images/payment/diners-club.png' }
]

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

const contactEmail = computed(() => {
  return auth.member.value?.email || ''
})
const travelerCountText = computed(() => {
  const item = order.value?.items?.[0]?.item
  if (!item) return '1 Traveler'
  const adult = item.adultCount || 1
  const child = item.childCount || 0
  const parts: string[] = [`${adult} Adult${adult > 1 ? 's' : ''}`]
  if (child > 0) parts.push(`${child} Child${child > 1 ? 'ren' : ''}`)
  return parts.join(', ')
})
const tripDateText = computed(() => {
  const item = order.value?.items?.[0]?.item
  if (item?.startDate && item?.endDate) return `${item.startDate} ~ ${item.endDate}`
  return item?.startDate || ''
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
  if (disposed) return
  const event = embeddedEvent(parsePayload(data))
  if (event.kind === 'ready') {
    if (channel === 'CREDIT_CARD') {
      sdkReady.value = true
      preparing.value = false
      if (readyTimer) clearTimeout(readyTimer)
    }
    // 官方钱包 SDK 回调 code == 2 代表用户点击唤起钱包支付
    if (channel === 'GOOGLE_PAY' || channel === 'APPLE_PAY') {
      selected.value = channel
      await selectChannel(channel)
      await submit()
    }
    return
  }
  if (event.kind === 'cancelled') {
    sdkMessage.value = 'Payment window closed. You can reopen the same payment using the wallet button.'
    submitting.value = false
    locked.value = false
    return
  }
  if (event.kind === 'validation') {
    sdkMessage.value = channel === 'CREDIT_CARD' ? cardPaymentFailureMessage(event.code, event.message) || event.message : event.message
    submitting.value = false
    locked.value = false
    return
  }
  if (event.kind !== 'result' || event.fields.order_number !== paymentNo.value) return
  locked.value = true
  submitting.value = true
  try {
    const result = await auth.request<PaymentView>('/commerce/payments/oceanpayment/embedded-result', event.fields)
    if (result.session?.threeDsUrl) {
      window.location.assign(result.session.threeDsUrl)
    } else {
      walletArmed.value = false
      session.value = undefined
      sdkMessage.value = 'Confirming your payment status...'
    }
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
    } catch {
      // 仅重试状态查询，失败时不重复创建
    } finally {
      polling = false
    }
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
    if (payment.status === 'SUCCEEDED') {
      await navigateTo(`/payment/result?paymentNo=${encodeURIComponent(payment.paymentNo)}`)
      return
    }
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

function submitOrder() {
  if (selected.value !== 'CREDIT_CARD') {
    selectChannel('CREDIT_CARD').then(() => submit())
  } else {
    submit()
  }
}

// 预渲染快捷支付按钮（若启用了对应渠道，且设备支持 ApplePaySession）
async function preloadWallets(availableChannels: PaymentChannelView[]) {
  const supportsApplePay = typeof window !== 'undefined' && window.isSecureContext && 'ApplePaySession' in window
  const googleChannel = availableChannels.find(c => c.channel === 'GOOGLE_PAY' && c.enabled)
  const appleChannel = availableChannels.find(c => c.channel === 'APPLE_PAY' && c.enabled)

  if (googleChannel) {
    hasGooglePay.value = true
  }
  if (appleChannel && supportsApplePay) {
    hasApplePay.value = true
  }

  // 若后端 options 接口可用，可提前初始化钱包按钮
  if (typeof commerce.getPaymentOptions === 'function' && order.value) {
    try {
      const opts: PaymentOptionsView = await commerce.getPaymentOptions(order.value.order.orderNo, clientType())
      for (const item of opts.channels || []) {
        if (item.channel === 'GOOGLE_PAY') {
          hasGooglePay.value = true
          loadSdk('GOOGLE_PAY', item.sdkUrl, item.sandbox).then(sdk => {
            sdk.init(item.sandbox ? true : '', item.initConfig)
          }).catch(() => { hasGooglePay.value = false })
        } else if (item.channel === 'APPLE_PAY' && supportsApplePay) {
          hasApplePay.value = true
          loadSdk('APPLE_PAY', item.sdkUrl, item.sandbox).then(sdk => {
            sdk.init(item.sandbox ? true : '', item.initConfig)
          }).catch(() => { hasApplePay.value = false })
        }
      }
    } catch {
      // 预加载仅为体验优化，不阻塞主流程
    }
  }
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const [loadedOrder, available, existing] = await Promise.all([
      commerce.getOrder(String(route.params.orderNo)),
      commerce.listPaymentChannels(clientType()),
      commerce.currentOrderPayment(String(route.params.orderNo))
    ])
    order.value = loadedOrder
    now.value = Date.now()
    if (loadedOrder.order.status === 'COMPLETED') {
      await navigateTo('/trips')
      return
    }
    if (loadedOrder.order.status !== 'PENDING_PAYMENT') return

    channels.value = available.filter(item => item.enabled && isEmbedded(item.channel) && (item.channel !== 'APPLE_PAY' || (typeof window !== 'undefined' && window.isSecureContext && 'ApplePaySession' in window)))

    if (existing && existing.status !== 'FAILED' && !existing.session) {
      paymentNo.value = existing.paymentNo
      if (isEmbedded(existing.channel)) selected.value = existing.channel
      locked.value = true
      loading.value = false
      if (['SUCCEEDED', 'EXPIRED', 'REVIEW_REQUIRED'].includes(existing.status)) {
        await navigateTo(`/payment/result?paymentNo=${encodeURIComponent(existing.paymentNo)}`)
        return
      }
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
    void preloadWallets(available)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Unable to load payment details.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
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
    ;(window as unknown as Record<string, unknown>)[adapter.callback] = () => {}
  }
})
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
  padding: 24px 0 70px;
}

.payment-layout {
  display: grid;
  grid-template-columns: minmax(0, 780px) minmax(340px, 440px);
  gap: 24px;
  width: min(1260px, calc(100% - 64px));
  margin: 0 auto;
  align-items: start;
}

.payment-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 面包屑导航 */
.checkout-breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 4px;
}

.step-inactive {
  color: #6b7280;
  font-weight: 500;
}

.step-sep {
  color: #9ca3af;
}

.step-active {
  color: #111827;
  font-weight: 700;
}

/* 左侧通用白色信息卡片 */
.checkout-info-card,
.payment-element-card,
.payment-summary {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(17, 34, 17, 0.04);
}

.checkout-info-card {
  padding: 24px;
}

.section-title {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 700;
  color: #112211;
  line-height: 24px;
}

.info-field-box {
  background: #f8faf8;
  border: 1px solid #e2e8e3;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.field-label {
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.field-value {
  font-size: 14px;
  color: #111827;
  font-weight: 500;
}

/* Payment (Payment Element) 卡片样式 */
.payment-element-card {
  padding: 24px;
  border: 1.5px solid #203d33;
}

.element-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.element-card-header .section-title {
  margin: 0;
}

.payment-element-badge {
  font-size: 13px;
  font-weight: 600;
  color: #15803d;
  background: #ecfdf5;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid #bbf7d0;
}

.credit-card-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.credit-card-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding-bottom: 8px;
  border-bottom: 1px solid #f1f5f2;
}

.credit-card-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  color: #112211;
}

.radio-dot {
  width: 18px;
  height: 18px;
  border: 5px solid #203d33;
  border-radius: 50%;
  display: inline-block;
}

.card-brands {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-brands img {
  height: 22px;
  object-fit: contain;
}

.oceanpayment-element {
  min-height: 160px;
  border: 1px solid #d1d9d4;
  border-radius: 8px;
  padding: 20px;
  background: #fff;
}

/* 右侧 Price details / Summary */
.payment-summary {
  padding: 28px 24px;
  position: sticky;
  top: 24px;
}

.summary-product-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #112211;
  line-height: 26px;
}

.summary-subtitle {
  margin: 16px 0 12px;
  font-size: 16px;
  font-weight: 700;
  color: #112211;
}

.summary-divider {
  border-top: 1px dashed #d1dcd5;
  margin: 18px 0;
}

.summary-price-dl {
  margin: 0;
}

.summary-price-dl div {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  color: #374151;
  font-size: 15px;
}

.summary-price-dl dd {
  margin: 0;
  font-weight: 600;
}

.benefit-tag {
  margin: 8px 0;
  color: #15803d;
  font-size: 13px;
  font-weight: 500;
}

.deadline-text {
  margin: 10px 0 0;
  font-size: 13px;
  color: #4b5563;
}

.deadline-text strong {
  color: #112211;
}

.total-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
}

.total-row strong:first-child {
  font-size: 18px;
  font-weight: 700;
  color: #112211;
}

.total-amount {
  font-size: 24px;
  font-weight: 700;
  color: #203d33;
}

/* 总价下方的操作按钮群：垂直排列 */
.checkout-actions-block {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.wallet-btn-container {
  width: 100%;
  min-height: 48px;
}

.wallet-element-slot {
  width: 100%;
}

.place-order-button {
  width: 100%;
  height: 48px;
  border: 0;
  border-radius: 8px;
  background: #15803d;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.place-order-button:hover:not(:disabled) {
  background: #166534;
}

.place-order-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.reload-button {
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d9d4;
  border-radius: 8px;
  background: #fff;
  color: #203d33;
  font-weight: 600;
  cursor: pointer;
}

.locked-status-text {
  margin: 4px 0 0;
  font-size: 13px;
  color: #203d33;
  text-align: center;
}

.sdk-message {
  margin: 8px 0 0;
  font-size: 13px;
  color: #4b5563;
}

.sdk-message.error {
  color: #dc2626;
  font-weight: 500;
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

.payment-state button {
  padding: 10px 16px;
  border: 0;
  background: #203d33;
  color: #fff;
  cursor: pointer;
  border-radius: 6px;
}

@media (max-width: 1000px) {
  .payment-layout {
    grid-template-columns: 1fr;
    width: min(780px, calc(100% - 32px));
  }

  .payment-summary {
    position: static;
  }
}

@media (max-width: 640px) {
  .payment-page {
    padding-top: 10px;
  }

  .checkout-info-card,
  .payment-element-card,
  .payment-summary {
    padding: 18px 16px;
    border-radius: 10px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .oceanpayment-element {
    padding: 14px;
  }
}
</style>
