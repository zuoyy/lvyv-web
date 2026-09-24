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
          <!-- Booking & Contact details 卡片（合并 Contact info 与 Traveler information） -->
          <section class="checkout-info-card">
            <h2 class="section-title">Booking & Contact details</h2>
            <div class="info-grid" :class="{ 'has-departure': Boolean(tripDateText) }">
              <div class="info-field-box">
                <span class="field-label">Email address</span>
                <span class="field-value">{{ contactEmail || 'Contact information from order' }}</span>
              </div>
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
              <span class="payment-element-badge">Credit card</span>
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
              <div class="oceanpayment-element-wrapper">
                <div v-if="preparing && selected === 'CREDIT_CARD'" class="element-loading-state">
                  <span class="loading-spinner" aria-hidden="true" />
                  <span>Loading secure payment form...</span>
                </div>
                <div id="oceanpayment-element" class="oceanpayment-element" />
              </div>

              <p v-if="sdkMessage && selected === 'CREDIT_CARD'" class="sdk-message error">{{ sdkMessage }}</p>
            </div>
          </section>
        </main>

        <!-- 右侧区域：Price details / Summary + 快捷支付按钮 + Place order -->
        <aside class="payment-summary">
          <div class="summary-details">
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
          </div>

          <!-- 总价下方的快捷支付按钮与常规提交（参考设计图） -->
          <div class="checkout-actions-block">
            <!-- Apple Pay 按钮容器（总价正下方） -->
            <div
              v-show="hasApplePay"
              class="wallet-btn-container"
              :class="{ 'is-loading': applePayLoading, 'is-processing': walletProcessingChannel === 'APPLE_PAY', 'is-blocked': walletProcessingChannel === 'GOOGLE_PAY' || submitting || locked }"
              :aria-busy="walletProcessingChannel === 'APPLE_PAY'"
            >
              <div v-if="applePayLoading" class="wallet-skeleton" aria-hidden="true" />
              <div id="oceanpayment-applepayelement" class="wallet-element-slot" />
              <div v-if="walletProcessingChannel === 'APPLE_PAY'" class="wallet-btn-loading-overlay">
                <span class="loading-spinner-white" />
              </div>
            </div>

            <!-- Google Pay 按钮容器（总价正下方） -->
            <div
              v-show="hasGooglePay"
              class="wallet-btn-container"
              :class="{ 'is-loading': googlePayLoading, 'is-processing': walletProcessingChannel === 'GOOGLE_PAY', 'is-blocked': walletProcessingChannel === 'APPLE_PAY' || submitting || locked }"
              :aria-busy="walletProcessingChannel === 'GOOGLE_PAY'"
            >
              <div v-if="googlePayLoading" class="wallet-skeleton" aria-hidden="true" />
              <div id="oceanpayment-googlepayelement" class="wallet-element-slot" />
              <div v-if="walletProcessingChannel === 'GOOGLE_PAY'" class="wallet-btn-loading-overlay">
                <span class="loading-spinner-white" />
              </div>
            </div>

            <div v-if="hasApplePay || hasGooglePay" class="wallet-divider">
              <span>or pay with card</span>
            </div>

            <!-- 绿色 Place order 信用卡支付按钮 -->
            <button
              type="button"
              class="place-order-button"
              :disabled="Boolean(walletProcessingChannel) || submitting || preparing || resetting || locked || !sdkReady || paymentExpired"
              @click="submitOrder"
            >
              {{ paymentExpired ? 'Payment expired' : submitting ? 'Processing...' : 'Place order' }}
            </button>
            <p class="card-validation-hint">Card details are checked when you place your order.</p>

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
            <button
              v-if="canResetEmbeddedSession"
              type="button"
              class="reload-button"
              :disabled="resetting"
              @click="resetEmbeddedSession"
            >
              {{ resetting ? 'Resetting payment...' : 'Re-enter card details' }}
            </button>

            <p v-if="sdkMessage && selected !== 'CREDIT_CARD'" class="sdk-message wallet-message">{{ sdkMessage }}</p>
          </div>
        </aside>
      </section>
    </div>
  </div>

    <!-- 快捷支付处理中全屏加载遮罩 -->
    <Teleport to="body">
      <Transition name="fade-overlay">
        <div v-if="walletOverlayVisible" class="wallet-processing-overlay" role="status" aria-live="polite">
          <div class="wallet-processing-modal">
            <div class="processing-spinner-box">
              <span class="processing-spinner" />
            </div>
            <div class="processing-title">
              {{ walletProcessingChannel === 'APPLE_PAY' ? 'Connecting to Apple Pay...' : walletProcessingChannel === 'GOOGLE_PAY' ? 'Connecting to Google Pay...' : 'Processing payment...' }}
            </div>
            <p class="processing-desc">
              Please complete authorization in the payment window.
            </p>
            <button
              v-if="walletActivationConfirmed"
              type="button"
              class="processing-cancel-btn"
              @click="cancelWalletProcessing"
            >
              Hide
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import CheckoutHeader from '~/components/checkout/CheckoutHeader.vue'
import { cardPaymentFailureMessage } from '~/utils/paymentMessages'
import { embeddedAdapters, embeddedEvent, trustedSdkUrl, paymentSdkData, observeCardFormReady, type EmbeddedChannel } from '~/utils/oceanpaymentEmbedded'
import { observeWalletInteraction } from '~/utils/walletInteraction'
import type { OrderView, PaymentView, PaymentChannelView, PaymentChannel, PaymentOptionsView } from '~/composables/useTourCommerce'

definePageMeta({ middleware: 'member-auth', layout: false })
const cardSdkPath = '/vendor/oceanpayment/oceanpayment.js?v=20260924-blur'
useHead({
  title: 'Secure payment | Lvyv',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
  link: [
    { rel: 'preload', as: 'script', href: cardSdkPath },
    { rel: 'preconnect', href: 'https://secure.oceanpayment.com' },
    { rel: 'preconnect', href: 'https://test-secure.oceanpayment.com' },
    { rel: 'preconnect', href: 'https://pay.google.com' },
    { rel: 'dns-prefetch', href: 'https://secure.oceanpayment.com' },
    { rel: 'dns-prefetch', href: 'https://test-secure.oceanpayment.com' },
    { rel: 'dns-prefetch', href: 'https://pay.google.com' },
    { rel: 'dns-prefetch', href: 'https://apis.google.com' }
  ]
})
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
const resetting = ref(false)
const locked = ref(false)
const walletArmed = ref(false)
const sdkReady = ref(false)
const error = ref('')
const sdkMessage = ref('')
const cardFormLoadTimeoutMessage = 'The secure card form could not load. Please reload the page to try again.'
const now = ref(Date.now())
const paymentExpireAt = ref<number | null>(null)
const signedFields = ref<Record<string, string>>()
const providerPaymentId = ref('')
const canResetEmbeddedSession = computed(() => selected.value === 'CREDIT_CARD'
  && !walletArmed.value && Boolean(paymentNo.value) && !providerPaymentId.value && locked.value)

// 快捷钱包按钮可见性与加载状态控制
const supportsApplePay = computed(() => typeof window !== 'undefined' && window.isSecureContext && 'ApplePaySession' in window)
const hasApplePay = ref(false)
const hasGooglePay = ref(false)
const applePayLoading = ref(false)
const googlePayLoading = ref(false)

// 快捷钱包按钮点击交互与页面级加载浮层状态
const walletProcessingChannel = ref<'APPLE_PAY' | 'GOOGLE_PAY' | null>(null)
const walletOverlayVisible = ref(false)
const walletActivationConfirmed = ref(false)
let stopWalletInteraction: (() => void) | undefined
let stopCardFormReady: (() => void) | undefined
let walletTimeoutTimer: ReturnType<typeof setTimeout> | undefined

function startWalletProcessing(channel: 'APPLE_PAY' | 'GOOGLE_PAY', confirmed = false) {
  if (walletProcessingChannel.value && walletProcessingChannel.value !== channel) return
  if (submitting.value || resetting.value || locked.value || paymentExpired.value || orderUnavailable.value) return
  if (!(channel === 'APPLE_PAY' ? hasApplePay.value : hasGooglePay.value)) return
  walletProcessingChannel.value = channel
  walletActivationConfirmed.value ||= confirmed
  walletOverlayVisible.value = true

  // 45 秒兜底超时自动重置
  if (walletTimeoutTimer) clearTimeout(walletTimeoutTimer)
  walletTimeoutTimer = setTimeout(() => {
    cancelWalletProcessing()
  }, 45000)
}

function cancelWalletProcessing() {
  const channel = walletProcessingChannel.value
  walletProcessingChannel.value = null
  walletOverlayVisible.value = false
  walletActivationConfirmed.value = false
  // 钱包取消后 iframe 可能仍持有焦点；释放它以便再次点击也能立即触发连接提示。
  if (channel && typeof document !== 'undefined') {
    const id = channel === 'APPLE_PAY' ? 'oceanpayment-iframe-applepay' : 'oceanpayment-iframe-googlepay'
    const frame = document.getElementById(id)
    if (frame && document.activeElement === frame) frame.blur()
  }
  if (walletTimeoutTimer) {
    clearTimeout(walletTimeoutTimer)
    walletTimeoutTimer = undefined
  }
}

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
let cardCheckoutPending = false
let cardAttemptNeedsRenewal = false

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
    // 使用本地桥接脚本接收卡表单的就绪与校验事件；输入框仍由支付商跨域托管。
    script.src = channel === 'CREDIT_CARD' ? cardSdkPath : url
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

function markCardFormReady() {
  sdkReady.value = true
  preparing.value = false
  if (readyTimer) clearTimeout(readyTimer)
  readyTimer = undefined
  // 慢网络下就绪通知可能晚于超时；只清除加载提示，保留校验错误和支付核验信息。
  if (sdkMessage.value === cardFormLoadTimeoutMessage) sdkMessage.value = ''
}

async function callback(channel: EmbeddedChannel, data: unknown) {
  if (disposed) return
  const fields = parsePayload(data)
  // code=1 只表示 iframe 已布局，不能作为全部卡片字段校验通过的依据。
  if (channel === 'CREDIT_CARD' && fields.code === '1' && !fields.msg) {
    markCardFormReady()
    return
  }
  const event = embeddedEvent(fields)
  if (event.kind === 'ready') {
    if (channel === 'CREDIT_CARD') {
      markCardFormReady()
    } else {
      if (channel === 'GOOGLE_PAY') hasGooglePay.value = true
      if (channel === 'APPLE_PAY') hasApplePay.value = true
      // code=2 在钱包授权数据准备好后才发送；点击时的加载提示必须独立于此回调。
      startWalletProcessing(channel, true)
    }
    return
  }
  if (event.kind === 'cancelled') {
    sdkMessage.value = ''
    submitting.value = false
    locked.value = false
    cancelWalletProcessing()
    return
  }
  if (event.kind === 'validation') {
    sdkMessage.value = channel === 'CREDIT_CARD' ? cardPaymentFailureMessage(event.code, event.message) || event.message : event.message
    if (channel === 'CREDIT_CARD') {
      // 普通失焦校验只展示提示，不重建 iframe，也不改动任何支付流水。
      if (cardCheckoutPending) {
        cardCheckoutPending = false
        await recoverAfterCardValidationFailure()
      }
      return
    }
    submitting.value = false
    locked.value = false
    cancelWalletProcessing()
    return
  }
  if (event.kind !== 'result' || event.fields.order_number !== paymentNo.value) return
  cancelWalletProcessing()
  cardCheckoutPending = false
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
      if (disposed || current !== paymentNo.value || resetting.value || cardAttemptNeedsRenewal) return
      providerPaymentId.value = payment.providerPaymentId || ''
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

async function recoverAfterCardValidationFailure() {
  const failedPaymentNo = paymentNo.value
  if (!failedPaymentNo || resetting.value) return
  resetting.value = true
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = undefined
  }
  try {
    const payment = await commerce.abortEmbeddedSession(failedPaymentNo)
    if (disposed || paymentNo.value !== failedPaymentNo) return
    providerPaymentId.value = payment.providerPaymentId || ''
    if (payment.status !== 'FAILED' || payment.failureCode !== 'CHECKOUT_NOT_SUBMITTED') {
      sdkMessage.value = 'Confirming your payment status. Please do not start another payment.'
      startPolling()
      return
    }
    // 下次明确点击付款才申请新占位，保留 iframe 中的输入与当前校验提示。
    cardAttemptNeedsRenewal = true
    signedFields.value = undefined
    submitting.value = false
    locked.value = false
  } catch {
    sdkMessage.value = 'Confirming your payment status. Please do not start another payment.'
    startPolling()
  } finally {
    resetting.value = false
  }
}

async function ensureContainer(containerId: string): Promise<HTMLElement | null> {
  if (typeof document === 'undefined') return null
  let el = document.getElementById(containerId)
  if (el) return el
  await nextTick()
  el = document.getElementById(containerId)
  if (el) return el
  for (let i = 0; i < 5; i++) {
    await new Promise(resolve => setTimeout(resolve, 20))
    el = document.getElementById(containerId)
    if (el) return el
  }
  return null
}

async function selectChannel(channel: PaymentChannel, channelOpt?: PaymentOptionsView['channels'][number], reusablePayment?: PaymentView | null) {
  if (!isEmbedded(channel) || locked.value || !order.value || orderUnavailable.value) return
  const currentGeneration = ++generation
  preparing.value = true
  sdkReady.value = false
  cardCheckoutPending = false
  cardAttemptNeedsRenewal = false
  walletArmed.value = false
  signedFields.value = undefined
  session.value = undefined
  selected.value = channel
  sdkMessage.value = ''
  if (readyTimer) clearTimeout(readyTimer)

  try {
    // 若已知该渠道的 SDK 配置，立即并发下载 SDK 脚本，绝不等待接口往返
    const sdkPreload = channelOpt?.sdkUrl
      ? loadSdk(selected.value, channelOpt.sdkUrl, channelOpt.sandbox)
      : null
    // 创建占位仍在等待时，预载可能先失败；先接住拒绝，后续 await 再统一显示错误。
    void sdkPreload?.catch(() => {})

    // current 接口返回的未提交卡会话可直接恢复，签名仍只在用户点击付款时由后端校验并签发。
    const reusableCard = channel === 'CREDIT_CARD' && reusablePayment?.channel === channel
      && reusablePayment.status === 'CREATED' && reusablePayment.session?.sdkType === 'CREDIT_CARD'
      && !reusablePayment.providerPaymentId && !Object.keys(reusablePayment.session.fields).length
      && Boolean(reusablePayment.expireTime && Date.parse(reusablePayment.expireTime) > Date.now())
    const payment = reusableCard ? reusablePayment : await commerce.createPayment(order.value.order.orderNo, channel, clientType())
    if (disposed || generation !== currentGeneration) return
    paymentNo.value = payment.paymentNo
    providerPaymentId.value = payment.providerPaymentId || ''
    const deadlines = [orderExpiresAt.value, payment.expireTime ? Date.parse(payment.expireTime) : NaN].filter(Number.isFinite)
    paymentExpireAt.value = deadlines.length ? Math.min(...deadlines) : null
    if (isEmbedded(payment.channel)) selected.value = payment.channel
    if (payment.status === 'SUCCEEDED') {
      await navigateTo(`/payment/result?paymentNo=${encodeURIComponent(payment.paymentNo)}`)
      return
    }
    if (!payment.session) {
      providerPaymentId.value = payment.providerPaymentId || ''
      locked.value = true
      preparing.value = false
      sdkMessage.value = 'An existing payment is being confirmed. We will keep checking it.'
      startPolling()
      return
    }
    session.value = payment.session

    const containerId = embeddedAdapters[channel].container
    const container = await ensureContainer(containerId)
    if (!container) throw new Error('Payment element container not found.')

    // 复用已发起的预载 Promise 或从 session 加载
    const sdk = sdkPreload ? await sdkPreload : await loadSdk(selected.value, payment.session.sdkUrl, payment.session.sandbox)
    if (disposed || generation !== currentGeneration) return
    const sandbox = payment.session.sandbox ? true : ''
    if (selected.value === 'CREDIT_CARD') {
      sdk.init(sandbox, '', 'en_US', { showCardName: false })
      readyTimer = setTimeout(() => {
        if (disposed || generation !== currentGeneration || sdkReady.value) return
        preparing.value = false
        sdkMessage.value = cardFormLoadTimeoutMessage
      }, 15000)
    } else {
      readyTimer = setTimeout(() => {
        if (disposed || sdkReady.value) return
        preparing.value = false
        sdkMessage.value = 'This wallet is unavailable on this device. Please choose credit card.'
      }, 15000)
      const config = { ...(payment.session.initConfig || {}) } as Record<string, unknown>
      if (selected.value === 'APPLE_PAY') configureApplePayButton(config)
      if (selected.value === 'GOOGLE_PAY' && config.buttonStyle && typeof config.buttonStyle === 'object') {
        config.buttonStyle = {
          ...(config.buttonStyle as Record<string, unknown>),
          buttonSizeMode: 'fill',
          buttonRadius: 8
        }
      }
      sdk.init(sandbox, paymentSdkData(config))
    }
  } catch (e) {
    preparing.value = false
    sdkMessage.value = e instanceof Error ? e.message : 'Unable to initialize this payment method.'
  }
}

async function submit() {
  if (!session.value || (selected.value === 'CREDIT_CARD' && walletProcessingChannel.value) || submitting.value || preparing.value || resetting.value || locked.value || !sdkReady.value || paymentExpired.value || orderUnavailable.value) return
  const sdk = getSdk(selected.value)
  if (!sdk) {
    sdkMessage.value = 'The secure payment form is unavailable. Please reload the page to try again.'
    return
  }
  submitting.value = true
  locked.value = true
  sdkMessage.value = ''
  try {
    if (cardAttemptNeedsRenewal) {
      let payment: PaymentView
      try {
        payment = await commerce.createPayment(order.value!.order.orderNo, 'CREDIT_CARD', clientType())
      } catch {
        // 创建的只是未签发参数的占位，重试复用后端唯一活动支付，保留当前卡片输入。
        submitting.value = false
        locked.value = false
        sdkMessage.value = 'Unable to prepare payment. Please try again.'
        return
      }
      if (disposed) return
      paymentNo.value = payment.paymentNo
      providerPaymentId.value = payment.providerPaymentId || ''
      cardAttemptNeedsRenewal = false
      if (!payment.session || payment.status !== 'CREATED') {
        session.value = undefined
        startPolling()
        return
      }
      session.value = payment.session
    }
    if (!signedFields.value) {
      const payment = await commerce.issueEmbeddedSession(paymentNo.value)
      if (disposed) return
      if (!payment.session || !Object.keys(payment.session.fields).length) {
        session.value = undefined
        startPolling()
        return
      }
      signedFields.value = payment.session.fields
    }
    if (signedFields.value.backUrl && typeof window !== 'undefined' && window.location?.href) {
      try {
        const expected = new URL(signedFields.value.backUrl)
        const current = new URL(window.location.href)
        if (!current.hostname.includes('localhost') && current.pathname !== expected.pathname) {
          throw new Error('Payment page address mismatch')
        }
      } catch (err) {
        if (err instanceof Error && err.message === 'Payment page address mismatch') throw err
      }
    }
    cardCheckoutPending = selected.value === 'CREDIT_CARD'
    sdk.checkout(paymentSdkData(signedFields.value))
    walletArmed.value = selected.value !== 'CREDIT_CARD'
    startPolling()
  } catch (caught) {
    cardCheckoutPending = false
    // 结构化克隆失败发生在浏览器发送消息之前，不能把这类本地失败当成渠道结果未知。
    if (selected.value === 'CREDIT_CARD' && caught && typeof caught === 'object'
      && 'name' in caught && caught.name === 'DataCloneError') {
      sdkMessage.value = 'The secure card form could not receive your payment request. Please try again.'
      await recoverAfterCardValidationFailure()
      return
    }
    session.value = undefined
    sdkMessage.value = 'Confirming your payment status. Please do not start another payment.'
    startPolling()
  }
}

async function resetEmbeddedSession() {
  if (!canResetEmbeddedSession.value || resetting.value) return
  resetting.value = true
  try {
    const payment = await commerce.abortEmbeddedSession(paymentNo.value)
    if (payment.status !== 'FAILED' || payment.failureCode !== 'CHECKOUT_NOT_SUBMITTED') {
      providerPaymentId.value = payment.providerPaymentId || ''
      sdkMessage.value = 'This payment is still being verified. Please try again shortly.'
      return
    }
    if (pollTimer) {
      clearInterval(pollTimer)
      pollTimer = undefined
    }
    generation++
    paymentNo.value = ''
    providerPaymentId.value = ''
    session.value = undefined
    signedFields.value = undefined
    submitting.value = false
    locked.value = false
    sdkMessage.value = ''
    await load()
  } catch (caught) {
    sdkMessage.value = caught instanceof Error ? caught.message : 'This payment is still being verified. Please try again shortly.'
  } finally {
    resetting.value = false
  }
}

function submitOrder() {
  if (walletProcessingChannel.value || submitting.value || preparing.value || resetting.value || locked.value) return
  if (selected.value !== 'CREDIT_CARD') {
    selectChannel('CREDIT_CARD').then(() => submit())
  } else {
    submit()
  }
}

function configureApplePayButton(config: Record<string, unknown>) {
  // cssUrl 在服务商 iframe 内生效；同时传入盒模型参数，避免样式加载前被 44px 容器裁切。
  config.cssUrl = new URL('/vendor/oceanpayment/applepay-button.css', window.location.origin).href
  config.buttonStyle = {
    ...(config.buttonStyle as Record<string, unknown> || {}),
    buttonstyle: 'black',
    type: 'buy',
    buttonHeight: 44,
    buttonRadius: 8,
    buttonPaddingY: 4,
    buttonPaddingX: 20,
    buttonBoxSizing: 'border-box'
  }
}

// 快速初始化快捷支付钱包按钮（Apple Pay、Google Pay），与信用卡表单完全并行执行
function initWallets(optionChannels: PaymentOptionsView['channels'], availableChannels: PaymentChannelView[]) {
  const googleChannel = availableChannels.find(c => c.channel === 'GOOGLE_PAY' && c.enabled)
  const appleChannel = availableChannels.find(c => c.channel === 'APPLE_PAY' && c.enabled)
  const googleOpt = optionChannels.find(c => c.channel === 'GOOGLE_PAY')
  const appleOpt = optionChannels.find(c => c.channel === 'APPLE_PAY')

  if (googleChannel && googleOpt) {
    hasGooglePay.value = true
    googlePayLoading.value = true
    loadSdk('GOOGLE_PAY', googleOpt.sdkUrl, googleOpt.sandbox)
      .then(async (sdk) => {
        if (disposed) return
        const container = await ensureContainer('oceanpayment-googlepayelement')
        if (!container) return
        const config = { ...(googleOpt.initConfig || {}) } as Record<string, unknown>
        config.buttonStyle = {
          ...(config.buttonStyle as Record<string, unknown> || {}),
          buttonSizeMode: 'fill',
          buttonHeight: 44,
          buttonRadius: 8
        }
        sdk.init(googleOpt.sandbox ? true : '', paymentSdkData(config))
      })
      .catch(() => {
        hasGooglePay.value = false
      })
      .finally(() => {
        googlePayLoading.value = false
      })
  } else {
    hasGooglePay.value = false
    googlePayLoading.value = false
  }

  if (appleChannel && appleOpt && supportsApplePay.value) {
    hasApplePay.value = true
    applePayLoading.value = true
    loadSdk('APPLE_PAY', appleOpt.sdkUrl, appleOpt.sandbox)
      .then(async (sdk) => {
        if (disposed) return
        const container = await ensureContainer('oceanpayment-applepayelement')
        if (!container) return
        const config = { ...(appleOpt.initConfig || {}) } as Record<string, unknown>
        configureApplePayButton(config)
        sdk.init(appleOpt.sandbox ? true : '', paymentSdkData(config))
      })
      .catch(() => {
        hasApplePay.value = false
      })
      .finally(() => {
        applePayLoading.value = false
      })
  } else {
    hasApplePay.value = false
    applePayLoading.value = false
  }
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const orderNo = String(route.params.orderNo)
    const optionsRequest = commerce.getPaymentOptions(orderNo, clientType()).catch(() => null)
    // 选项到达即下载 SDK，与订单和原支付核验重叠；核验结束前不挂载 iframe、不创建支付。
    const preparedOptions = optionsRequest.then(options => {
      if (!disposed && options && (!options.activePayment || options.activePayment.session)) {
        for (const option of options.channels) {
          if (option.enabled && isEmbedded(option.channel)
            && (option.channel !== 'APPLE_PAY' || supportsApplePay.value)) {
            void loadSdk(option.channel, option.sdkUrl, option.sandbox).catch(() => {})
          }
        }
      }
      return options
    })
    // 选项已包含按本订单路由筛选的渠道；只有选项接口不可用时才查询旧渠道接口兜底。
    const [loadedOrder, paymentOptions, available, existing] = await Promise.all([
      commerce.getOrder(orderNo),
      preparedOptions,
      optionsRequest.then(options => options?.channels ?? commerce.listPaymentChannels(clientType())),
      commerce.currentOrderPayment(orderNo)
    ])
    if (disposed) return
    order.value = loadedOrder
    now.value = Date.now()
    if (loadedOrder.order.status === 'COMPLETED') {
      await navigateTo('/trips')
      return
    }
    if (loadedOrder.order.status !== 'PENDING_PAYMENT') return

    channels.value = available.filter(item => item.enabled && isEmbedded(item.channel) && (item.channel !== 'APPLE_PAY' || supportsApplePay.value))

    if (existing && existing.status !== 'FAILED' && !existing.session) {
      paymentNo.value = existing.paymentNo
      providerPaymentId.value = existing.providerPaymentId || ''
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

    // 等待 DOM 更新，确保 payment-layout 及各支付挂载容器已存在于 DOM
    await nextTick()

    const optionChannels = paymentOptions?.channels || []
    const ccOption = optionChannels.find(c => c.channel === 'CREDIT_CARD')

    // 左侧固定挂载信用卡表单，右侧并行初始化快捷支付按钮
    void initWallets(optionChannels, available)
    void selectChannel('CREDIT_CARD', ccOption, existing)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Unable to load payment details.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  window.history.replaceState(window.history.state, '', `/orders/${encodeURIComponent(String(route.params.orderNo))}/pay`)
  stopCardFormReady = observeCardFormReady(window,
    () => selected.value === 'CREDIT_CARD' ? session.value?.sandbox : undefined,
    markCardFormReady)
  stopWalletInteraction = observeWalletInteraction(window, channel => startWalletProcessing(channel), () => {
    if (!walletActivationConfirmed.value) cancelWalletProcessing()
  })
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
  stopWalletInteraction?.()
  stopCardFormReady?.()
  if (walletTimeoutTimer) clearTimeout(walletTimeoutTimer)
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

/* 左侧通用白色信息卡片 */
.checkout-info-card,
.payment-element-card,
.payment-summary {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(17, 34, 17, 0.04);
}

.checkout-info-card {
  padding: 18px 24px;
}

.section-title {
  margin: 0 0 14px;
  font-size: 16px;
  font-weight: 700;
  color: #112211;
  line-height: 22px;
}

.info-field-box {
  background: #f8faf8;
  border: 1px solid #e2e8e3;
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.info-grid.has-departure {
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 820px) {
  .info-grid.has-departure {
    grid-template-columns: repeat(2, 1fr);
  }
}

.field-label {
  font-size: 11px;
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
  display: flex;
  flex-direction: column;
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

.oceanpayment-element-wrapper {
  position: relative;
  min-height: 140px;
}

.element-loading-state {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #4b5563;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(2px);
  border: 1px dashed #c6cfc6;
  border-radius: 8px;
  pointer-events: none;
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid #203d33;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.oceanpayment-element {
  min-height: 140px;
  border: 1px solid #d1d9d4;
  border-radius: 8px;
  padding: 12px;
  background: #fff;
}

/* 右侧 Price details / Summary */
.payment-summary {
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
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
  position: relative;
  width: 100%;
  height: 44px;
  min-height: 44px;
  max-height: 44px;
  border-radius: 8px;
  overflow: hidden;
  box-sizing: border-box;
  background: transparent;
  cursor: pointer;
}

.wallet-btn-container.is-processing {
  opacity: 0.9;
}

.wallet-btn-container.is-blocked {
  pointer-events: none;
}

.wallet-btn-loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(1px);
  border-radius: 8px;
  z-index: 2;
  pointer-events: none;
}

.loading-spinner-white {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

.wallet-skeleton {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #181818 0%, #2e2e2e 50%, #181818 100%);
  background-size: 200% 100%;
  animation: skeletonPulse 1.5s ease-in-out infinite;
  border-radius: 8px;
  z-index: 1;
  pointer-events: none;
}

@keyframes skeletonPulse {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.wallet-element-slot {
  width: 100%;
  height: 44px;
  min-height: 44px;
  max-height: 44px;
  box-sizing: border-box;
  overflow: hidden;
}

/* 统一 Apple Pay 与 Google Pay 挂载节点与内部渲染按钮高度为标准的 44px */
:deep(#oceanpayment-applepayelement),
:deep(#oceanpayment-googlepayelement) {
  width: 100% !important;
  height: 44px !important;
  min-height: 44px !important;
  max-height: 44px !important;
  display: block !important;
  box-sizing: border-box !important;
  overflow: hidden !important;
  background: transparent !important;
}

:deep(#oceanpayment-applepayelement > div),
:deep(#oceanpayment-googlepayelement > div),
:deep(#oceanpayment-applepayelement iframe),
:deep(#oceanpayment-googlepayelement iframe) {
  width: 100% !important;
  height: 44px !important;
  min-height: 44px !important;
  max-height: 44px !important;
  border: 0 !important;
  border-radius: 8px !important;
  box-sizing: border-box !important;
  display: block !important;
  background: transparent !important;
}

/* 非 iframe 渲染时也使用相同盒模型；iframe 内样式由 cssUrl 提供。 */
:deep(#oceanpayment-applepayelement apple-pay-button) {
  --apple-pay-button-width: 100% !important;
  --apple-pay-button-height: 44px !important;
  --apple-pay-button-border-radius: 8px !important;
  --apple-pay-button-padding: 4px 20px !important;
  --apple-pay-button-box-sizing: border-box !important;
  width: 100% !important;
  height: 44px !important;
  min-height: 44px !important;
  max-height: 44px !important;
  border-radius: 8px !important;
  display: block !important;
  box-sizing: border-box !important;
}

:deep(#oceanpayment-applepayelement button),
:deep(#oceanpayment-applepayelement .apple-pay-button) {
  width: 100% !important;
  height: 44px !important;
  min-height: 44px !important;
  max-height: 44px !important;
  border-radius: 8px !important;
  box-sizing: border-box !important;
  display: block !important;
}

/* Google Pay 内部 button 及卡片容器统一高度与圆角 */
:deep(#oceanpayment-googlepayelement button),
:deep(#oceanpayment-googlepayelement .gpay-button),
:deep(#oceanpayment-googlepayelement .gpay-card-info-container) {
  width: 100% !important;
  height: 44px !important;
  min-height: 44px !important;
  max-height: 44px !important;
  border-radius: 8px !important;
  box-sizing: border-box !important;
  display: block !important;
}

.wallet-divider {
  display: flex;
  align-items: center;
  margin: 4px 0;
  text-align: center;
  color: #6b7280;
  font-size: 13px;
}

.wallet-divider::before,
.wallet-divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e5e7eb;
}

.wallet-divider span {
  padding: 0 10px;
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

.card-validation-hint {
  margin: 0;
  color: #6b7280;
  font-size: 12px;
  text-align: center;
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

/* 快捷支付/订单提交页面级加载遮罩与弹窗 */
.wallet-processing-overlay {
  /* 焦点在 pointerdown 时进入 iframe，反馈不能截断随后 pointerup/click 的原生用户手势。 */
  pointer-events: none;
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 20, 0.58);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.wallet-processing-modal {
  width: 100%;
  max-width: 360px;
  background: #ffffff;
  border-radius: 16px;
  padding: 32px 24px 24px;
  text-align: center;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.22), 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: modalPopIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalPopIn {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.processing-spinner-box {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #f0f5f2;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
}

.processing-spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #cfe0d8;
  border-top-color: #174d40;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.processing-title {
  color: #1a2e26;
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 8px;
}

.processing-desc {
  color: #64746d;
  font-size: 13.5px;
  line-height: 1.5;
  margin: 0 0 20px;
}

.processing-cancel-btn {
  pointer-events: auto;
  padding: 8px 24px;
  border-radius: 999px;
  border: 1px solid #d5ded9;
  background: #f7faf8;
  color: #43544c;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.processing-cancel-btn:hover {
  background: #edf3f0;
  color: #1a2e26;
  border-color: #bccbc4;
}

.fade-overlay-enter-active,
.fade-overlay-leave-active {
  transition: opacity 0.22s ease;
}

.fade-overlay-enter-from,
.fade-overlay-leave-to {
  opacity: 0;
}
</style>
