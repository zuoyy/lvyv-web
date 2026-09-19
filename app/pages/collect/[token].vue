<template>
  <main class="collection-page">
    <section class="collection-card">
      <header><span class="brand-mark">北京旅遇国际</span><p>安全收款</p></header>
      <div v-if="loading" class="state"><span class="spinner" />正在读取收款信息…</div>
      <div v-else-if="errorMessage" class="state error">
        <strong>暂时无法读取收款信息</strong><p>{{ errorMessage }}</p>
        <button type="button" class="copy-btn" :disabled="refreshing" @click="load">重新加载</button>
      </div>
      <template v-else-if="collection">
        <section class="summary">
          <p class="label">付款事由</p><h1>{{ collection.purpose }}</h1>
          <p class="amount"><small>¥</small>{{ money(collection.amount) }}</p>
          <div v-if="collection.status === 'PENDING_PAYMENT'" class="deadline-badge">
            <span class="countdown-icon">⏱</span>
            <span>剩余支付时间：<strong>{{ countdownText }}</strong></span>
          </div>
          <p v-else-if="collection.status === 'PAID' && collection.paidTime" class="deadline">付款时间 {{ dateTime(collection.paidTime) }}</p>
          <p v-else-if="collection.status === 'EXPIRED'" class="deadline">已于 {{ dateTime(collection.validUntil) }} 过期</p>
          <div v-if="['PENDING_PAYMENT', 'EXPIRED'].includes(collection.status)" class="payment-status" aria-live="polite">
            <p>{{ refreshError || '付款后将自动更新结果，请勿重复付款。' }}</p>
            <button type="button" class="copy-btn" :disabled="refreshing" @click="load">{{ refreshing ? '正在查询…' : '刷新支付结果' }}</button>
          </div>
        </section>

        <section v-if="collection.status === 'PAID'" class="result success">
          <span class="result-icon">✓</span><h2>支付成功</h2>
          <p>感谢您的付款，请勿重复支付。</p><code v-if="collection.paymentReference">参考号 {{ collection.paymentReference }}</code>
        </section>
        <section v-else-if="collection.status !== 'PENDING_PAYMENT'" class="result unavailable">
          <span class="result-icon">!</span><h2>{{ statusText }}</h2><p>当前付款单已无法继续付款，请联系收款方。</p>
        </section>
        <template v-else>
          <!-- 仅在有启用的支付路由时展示 -->
          <template v-if="availableMethods.length > 0">
            <div class="payment-method-header">
              <span class="section-title">选择付款方式</span>
              <span v-if="bankChannel" class="recommend-badge">推荐使用银行转账</span>
            </div>

            <!-- 当启用的方式多于1种时，展示切换选项卡；若仅启用1种，自动默认显示并隐藏多余切换按钮 -->
            <div
              v-if="availableMethods.length > 1"
              class="method-tabs"
              :style="{ gridTemplateColumns: `repeat(${availableMethods.length}, minmax(0, 1fr))` }"
              role="tablist"
              aria-label="付款方式"
            >
              <button
                v-for="item in availableMethods"
                :key="item.channel"
                type="button"
                class="method-tab"
                :class="[`tab-${item.iconClass}`, { active: selectedMethod === item.channel }]"
                role="tab"
                :aria-selected="selectedMethod === item.channel"
                @click="selectedMethod = item.channel"
              >
                <span v-if="item.badge" :class="item.badgeClass">{{ item.badge }}</span>
                <span class="method-icon" :class="item.iconClass">{{ item.icon }}</span>
                <span class="tab-title">{{ item.name }}</span>
                <span class="tab-sub">{{ item.subTitle }}</span>
              </button>
            </div>

            <!-- 各支付方式对应的内容面板 -->
            <!-- 1. 银行转账面板（若启用则默认优先展示） -->
            <div v-if="bankChannel && selectedMethod === 'BANK_TRANSFER'" class="method-panel">
              <section class="method bank">
                <div class="panel-head">
                  <span class="method-icon bank">银</span>
                  <div>
                    <h2>银行对公 / 个人账户转账</h2>
                    <p>通过手机银行、网上银行或银行柜台汇款，转账后由财务核实确认入账。</p>
                  </div>
                </div>
                <dl>
                  <div v-for="row in bankRows" :key="row.key">
                    <dt>{{ row.label }}</dt>
                    <dd>
                      <span class="bank-val">{{ row.value }}</span>
                      <button type="button" class="copy-btn" @click="copy(row.value)">复制</button>
                    </dd>
                  </div>
                </dl>
                <div class="bank-warning">
                  <strong>转账须知：</strong>
                  <p>1. 请按页面金额 <strong>¥{{ money(collection.amount) }}</strong> 一次性足额转账。</p>
                  <p>2. 转账时请务必在附言 / 摘要 / 备注中填写指定的<strong>转账备注</strong>，以便系统及财务快速核对。</p>
                  <p>3. 转账完成后请妥善保管回执截图，收款方将在核实后为您确认入账。</p>
                </div>
              </section>
            </div>

            <!-- 2. 支付宝面板（仅在启用支付宝路由时展示） -->
            <div v-if="alipayChannel && selectedMethod === 'ALIPAY'" class="method-panel">
              <p v-if="wechatBrowser" class="wechat-tip">
                <strong>微信访问提示：</strong>微信内无法直接跳转支付宝，请点击右上角「···」并在系统浏览器中打开；或切换上方「银行转账」进行转账。
              </p>
              <section class="method alipay">
                <div class="panel-head">
                  <span class="method-icon alipay">支</span>
                  <div>
                    <h2>支付宝安全支付</h2>
                    <p>支持支付宝余额、绑定的储蓄卡/信用卡、余额宝等方式付款。</p>
                  </div>
                </div>
                <div class="alipay-box">
                  <div class="alipay-info-row">
                    <span>付款金额</span>
                    <span class="alipay-price">¥{{ money(collection.amount) }}</span>
                  </div>
                  <button
                    type="button"
                    class="alipay-pay-btn"
                    :disabled="submitting || wechatBrowser || remainingSeconds <= 0"
                    @click="payWithAlipay"
                  >
                    {{ submitting ? '正在前往支付宝…' : (wechatBrowser ? '请在系统浏览器中打开' : '使用支付宝付款') }}
                  </button>
                  <p class="alipay-note">点击按钮将自动跳转至支付宝官方收银台完成付款</p>
                </div>
              </section>
            </div>

            <!-- 3. 微信支付面板（仅在后台启用微信支付路由时展示） -->
            <div v-if="wechatChannel && selectedMethod === 'WECHAT'" class="method-panel">
              <section class="method wechat">
                <div class="panel-head">
                  <span class="method-icon wechat">微</span>
                  <div>
                    <h2>微信安全支付</h2>
                    <p>支持微信零钱、绑定的储蓄卡/信用卡等快捷付款。</p>
                  </div>
                </div>
                <div class="alipay-box">
                  <div class="alipay-info-row">
                    <span>付款金额</span>
                    <span class="alipay-price">¥{{ money(collection.amount) }}</span>
                  </div>
                  <button
                    type="button"
                    class="wechat-pay-btn"
                    :disabled="submitting || remainingSeconds <= 0"
                    @click="payWithWechat"
                  >
                    {{ submitting ? '正在发起微信支付…' : '使用微信支付付款' }}
                  </button>
                  <p class="alipay-note">点击将调起微信收银台安全完成付款</p>
                </div>
              </section>
            </div>
          </template>

          <p v-else class="no-method">暂未配置可用付款方式，请联系收款方。</p>
        </template>
      </template>
      <footer>本页面由北京旅遇国际旅游有限公司提供安全支付服务 · 付款前请仔细核对付款事由及金额</footer>
    </section>
    <div v-if="toast" class="toast">{{ toast }}</div>
  </main>
</template>

<script setup lang="ts">
type CollectionStatus = 'PENDING_PAYMENT' | 'PAID' | 'EXPIRED' | 'CANCELLED'
type PaymentMethodType = 'BANK_TRANSFER' | 'ALIPAY' | 'WECHAT'

interface Channel { channel: string; name: string; instructions: Record<string, string> }
interface CollectionView { purpose: string; currency: 'CNY'; amount: string | number; status: CollectionStatus; validUntil: string; paidTime?: string; paymentChannel?: string; paymentReference?: string; channels: Channel[] }
interface PaymentView { paymentNo: string; status: string; redirectUrl?: string }
interface ApiResult<T> { code: number; msg?: string; data: T }

interface AvailableMethodTab {
  channel: PaymentMethodType
  name: string
  subTitle: string
  badge?: string
  badgeClass?: string
  icon: string
  iconClass: string
}

definePageMeta({ layout: false })
useHead({ title: '北京旅遇国际安全收款', meta: [
  { name: 'robots', content: 'noindex,nofollow,noarchive' },
  { name: 'referrer', content: 'no-referrer' },
] })
const route = useRoute()
const config = useRuntimeConfig()
const token = computed(() => String(route.params.token || ''))
const collection = ref<CollectionView>()
const loading = ref(true)
const refreshing = ref(false)
const refreshError = ref('')
const submitting = ref(false)
const errorMessage = ref('')
const toast = ref('')
const wechatBrowser = ref(false)
const now = ref(Date.now())
const selectedMethod = ref<PaymentMethodType>('BANK_TRANSFER')
let pollTimer: ReturnType<typeof setTimeout> | undefined
let countdownTimer: ReturnType<typeof setInterval> | undefined
let disposed = false
let pageActive = true

// 检查各支付路由是否在后端返回的 channels 中启用
const bankChannel = computed(() => collection.value?.channels?.find(item => item.channel === 'BANK_TRANSFER'))
const alipayChannel = computed(() => collection.value?.channels?.find(item => item.channel === 'ALIPAY'))
const wechatChannel = computed(() => collection.value?.channels?.find(item => ['WECHAT', 'WECHAT_PAY', 'WXPAY'].includes(item.channel)))

// 仅展示后端已启用的支付路由，且严格按优先级排序：银行转账第一，支付宝第二，微信支付第三
const availableMethods = computed<AvailableMethodTab[]>(() => {
  const list: AvailableMethodTab[] = []
  if (!collection.value?.channels) return list

  // 1. 银行转账（优先级最高）
  if (bankChannel.value) {
    list.push({
      channel: 'BANK_TRANSFER',
      name: '银行转账',
      subTitle: '大额/对公优先',
      badge: '优先推荐',
      badgeClass: 'tab-badge-hot',
      icon: '银',
      iconClass: 'bank',
    })
  }

  // 2. 支付宝
  if (alipayChannel.value) {
    list.push({
      channel: 'ALIPAY',
      name: '支付宝',
      subTitle: '即时到账',
      icon: '支',
      iconClass: 'alipay',
    })
  }

  // 3. 微信支付（仅当后端启用了微信支付路由时才展示）
  if (wechatChannel.value) {
    list.push({
      channel: 'WECHAT',
      name: '微信支付',
      subTitle: '快捷支付',
      icon: '微',
      iconClass: 'wechat',
    })
  }

  return list
})

// 当可用路由变化时，确保默认选中高优先级路由（优先银行转账）
watch(availableMethods, (methods) => {
  if (!methods.length) return
  if (!methods.some(m => m.channel === selectedMethod.value)) {
    const first = methods[0]
    if (first) {
      selectedMethod.value = first.channel
    }
  }
}, { immediate: true })

const bankRows = computed(() => {
  const values = bankChannel.value?.instructions || {}
  const bankName = (values.bankName || '').trim()
  const branchName = (values.branchName || '').trim()

  let fullBank = ''
  if (bankName && branchName) {
    fullBank = branchName.includes(bankName) ? branchName : `${bankName}${branchName}`
  } else {
    fullBank = bankName || branchName
  }

  const rows: Array<{ key: string, label: string, value: string }> = []
  if (fullBank) {
    rows.push({ key: 'bankBranch', label: '开户银行', value: fullBank })
  }
  if (values.accountName) {
    rows.push({ key: 'accountName', label: '账户名称', value: values.accountName })
  }
  if (values.accountNumber) {
    rows.push({ key: 'accountNumber', label: '银行账号', value: values.accountNumber })
  }
  if (values.transferNote) {
    rows.push({ key: 'transferNote', label: '转账备注', value: values.transferNote })
  }
  return rows
})
const statusText = computed(() => collection.value?.status === 'EXPIRED' ? '收款单已过期' : '收款单已作废')
const money = (value: string | number) => Number(value).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const dateTime = (value: string) => {
  const utcValue = /(Z|[+-]\d{2}:?\d{2})$/i.test(value) ? value : `${value}Z`
  return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(utcValue)).replaceAll('/', '-')
}

const remainingSeconds = computed(() => {
  if (!collection.value?.validUntil) return 0
  const utcValue = /(Z|[+-]\d{2}:?\d{2})$/i.test(collection.value.validUntil) 
    ? collection.value.validUntil 
    : `${collection.value.validUntil}Z`
  const target = new Date(utcValue).getTime()
  return Math.max(0, Math.floor((target - now.value) / 1000))
})

const countdownText = computed(() => {
  if (!collection.value?.validUntil) return ''
  const sec = remainingSeconds.value
  if (sec <= 0) return '已超时'
  const hours = Math.floor(sec / 3600)
  const minutes = Math.floor((sec % 3600) / 60)
  const seconds = sec % 60
  if (hours > 0) {
    return `${hours}小时${String(minutes).padStart(2, '0')}分${String(seconds).padStart(2, '0')}秒`
  }
  return `${minutes}分${String(seconds).padStart(2, '0')}秒`
})

const request = async <T>(path: string, method: 'GET' | 'POST' = 'GET', body?: Record<string, unknown>) => {
  const response = await $fetch<ApiResult<T>>(path, { baseURL: config.public.apiBase as string, method, body,
    headers: { 'Cache-Control': 'no-store' }, timeout: 10000, retry: 0 })
  if (response.code !== 200) throw new Error(response.msg || '请求失败')
  return response.data
}
const stopPolling = () => {
  if (pollTimer) clearTimeout(pollTimer)
  pollTimer = undefined
}
const isPageVisible = () => document.visibilityState !== 'hidden'
const load = async () => {
  if (disposed || !pageActive || !isPageVisible() || refreshing.value) return
  stopPolling()
  refreshing.value = true
  try {
    const latest = await request<CollectionView>(`/commerce/public-collections/${encodeURIComponent(token.value)}`)
    if (disposed) return
    collection.value = latest
    now.value = Date.now()
    errorMessage.value = ''
    refreshError.value = ''
  } catch (error: any) {
    if (disposed) return
    if (!collection.value) errorMessage.value = error?.data?.msg || error?.message || '暂时无法读取收款信息'
    else refreshError.value = '暂时无法获取最新结果，正在重试；如已付款，请勿重复付款。'
  } finally {
    if (!disposed) {
      loading.value = false
      refreshing.value = false
      // 不依赖支付宝返回参数；异步通知可能晚于收款截止时间到达，过期页也继续核对结果。
      if (pageActive && isPageVisible()
        && (!collection.value || ['PENDING_PAYMENT', 'EXPIRED'].includes(collection.value.status))) {
        const delay = errorMessage.value || refreshError.value ? 10000 : collection.value?.status === 'EXPIRED' ? 15000 : 3000
        pollTimer = setTimeout(load, delay)
      }
    }
  }
}
const payWithAlipay = async () => {
  submitting.value = true
  try {
    const payment = await request<PaymentView>(`/commerce/public-collections/${encodeURIComponent(token.value)}/payments`, 'POST', { channel: 'ALIPAY' })
    if (!payment.redirectUrl) throw new Error('支付页面生成失败')
    window.location.assign(payment.redirectUrl)
  } catch (error: any) {
    toast.value = error?.data?.msg || error?.message || '暂时无法发起支付'
    setTimeout(() => { toast.value = '' }, 3000)
  } finally { submitting.value = false }
}
const payWithWechat = async () => {
  submitting.value = true
  try {
    const payment = await request<PaymentView>(`/commerce/public-collections/${encodeURIComponent(token.value)}/payments`, 'POST', { channel: wechatChannel.value?.channel || 'WECHAT_PAY' })
    if (payment.redirectUrl) {
      window.location.assign(payment.redirectUrl)
    } else {
      toast.value = '请按屏幕指引完成微信支付'
      setTimeout(() => { toast.value = '' }, 3000)
    }
  } catch (error: any) {
    toast.value = error?.data?.msg || error?.message || '微信支付发起失败，请使用银行转账'
    setTimeout(() => { toast.value = '' }, 3000)
  } finally { submitting.value = false }
}
const resume = () => {
  pageActive = true
  now.value = Date.now()
  void load()
}
const suspend = () => {
  pageActive = false
  stopPolling()
}
const visibilityChanged = () => {
  if (document.visibilityState === 'hidden') stopPolling()
  else resume()
}
const copy = async (value?: string) => {
  if (!value) return
  await navigator.clipboard.writeText(value)
  toast.value = '已复制'
  setTimeout(() => { toast.value = '' }, 1600)
}
onMounted(async () => {
  wechatBrowser.value = /MicroMessenger/i.test(navigator.userAgent)
  countdownTimer = setInterval(() => {
    now.value = Date.now()
  }, 1000)
  document.addEventListener('visibilitychange', visibilityChanged)
  window.addEventListener('pageshow', resume)
  window.addEventListener('pagehide', suspend)
  window.addEventListener('focus', resume)
  await load()
})
onBeforeUnmount(() => {
  disposed = true
  stopPolling()
  if (countdownTimer) clearInterval(countdownTimer)
  document.removeEventListener('visibilitychange', visibilityChanged)
  window.removeEventListener('pageshow', resume)
  window.removeEventListener('pagehide', suspend)
  window.removeEventListener('focus', resume)
})
</script>

<style scoped>
:global(body) {
  margin: 0;
  background: #f3f6f4;
  color: #183d33;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
}
.collection-page {
  min-height: 100dvh;
  display: grid;
  place-items: start center;
  padding: clamp(12px, 3vh, 32px) 16px 36px;
  box-sizing: border-box;
  background: #f3f6f4;
}
.collection-card {
  width: min(540px, 100%);
  padding: 0;
  background: #fff;
  border: 1px solid #dce5e0;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(23, 63, 52, .08);
  overflow: hidden;
}
.collection-card > header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid #edf1ef;
}
.brand-mark {
  font: 700 18px/1.2 "Playfair Display", "Songti SC", serif;
  color: #105446;
  letter-spacing: .02em;
}
.collection-card > header p {
  margin: 0;
  color: #7b8a83;
  font-size: 12px;
  letter-spacing: .1em;
}
.summary {
  text-align: center;
  padding: 28px 24px 22px;
}
.label {
  margin: 0 0 6px;
  color: #819088;
  font-size: 12px;
}
.summary h1 {
  margin: 0 auto;
  max-width: 440px;
  font-size: 20px;
  line-height: 1.45;
  font-weight: 600;
  color: #1a332c;
}
.amount {
  margin: 16px 0 6px;
  color: #103f34;
  font-size: 46px;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.amount small {
  font-size: 22px;
  margin-right: 4px;
  font-weight: 600;
}
.deadline {
  margin: 0;
  color: #7b8882;
  font-size: 13px;
}
.payment-status {
  margin-top: 16px;
  color: #7b8882;
  font-size: 12px;
  line-height: 1.6;
}
.payment-status p {
  margin: 0 0 8px;
}
.deadline-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 6px auto 0;
  padding: 5px 14px;
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
  border-radius: 20px;
  font-size: 13px;
}
.deadline-badge strong {
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  color: #78350f;
}
.countdown-icon {
  font-size: 13px;
}

/* 支付方式头部 */
.payment-method-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px 10px;
}
.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #27433c;
}
.recommend-badge {
  font-size: 11px;
  color: #105446;
  background: #eaf4f0;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
}

/* 支付方式选项卡切换组件 */
.method-tabs {
  display: grid;
  gap: 8px;
  margin: 0 20px 16px;
}
.method-tab {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 6px;
  background: #fcfdfc;
  border: 1.5px solid #dce5e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all .2s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
}
.method-tab:hover {
  background: #f7faf8;
  border-color: #b8ccbf;
}
.tab-badge-hot {
  position: absolute;
  top: -8px;
  right: -4px;
  font-size: 10px;
  line-height: 1;
  padding: 3px 6px;
  background: #d97706;
  color: #fff;
  border-radius: 8px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(217, 119, 6, 0.2);
}
.method-tab.tab-bank.active {
  border-color: #105446;
  background: #f0f7f4;
  box-shadow: 0 0 0 1px #105446, 0 3px 10px rgba(16, 84, 70, 0.1);
}
.method-tab.tab-alipay.active {
  border-color: #1677ff;
  background: #f2f7ff;
  box-shadow: 0 0 0 1px #1677ff, 0 3px 10px rgba(22, 119, 255, 0.12);
}
.method-tab.tab-wechat.active {
  border-color: #07c160;
  background: #f2faf5;
  box-shadow: 0 0 0 1px #07c160, 0 3px 10px rgba(7, 193, 96, 0.12);
}
.tab-title {
  font-size: 14px;
  font-weight: 700;
  margin-top: 6px;
  color: #1a3932;
}
.method-tab.active .tab-title {
  color: #0d4237;
}
.method-tab.tab-alipay.active .tab-title {
  color: #1677ff;
}
.method-tab.tab-wechat.active .tab-title {
  color: #07c160;
}
.tab-sub {
  font-size: 11px;
  color: #83918b;
  margin-top: 2px;
}

/* 图标样式 */
.method-icon {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  font-weight: 800;
  font-size: 15px;
}
.method-icon.bank {
  background: #eaf3ee;
  color: #105446;
}
.method-tab.tab-bank.active .method-icon.bank {
  background: #105446;
  color: #fff;
}
.method-icon.alipay {
  background: #e8f3ff;
  color: #1677ff;
}
.method-tab.tab-alipay.active .method-icon.alipay {
  background: #1677ff;
  color: #fff;
}
.method-icon.wechat {
  background: #e7f8ef;
  color: #07c160;
}
.method-tab.tab-wechat.active .method-icon.wechat {
  background: #07c160;
  color: #fff;
}

/* 支付面板通用样式 */
.method-panel {
  animation: fadeIn .2s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
.method {
  margin: 0 20px 16px;
  padding: 18px;
  border: 1px solid #dfe8e3;
  border-radius: 10px;
  background: #fff;
}
.panel-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid #edf2ef;
}
.panel-head h2 {
  margin: 0 0 2px;
  font-size: 15px;
  font-weight: 700;
  color: #16362f;
}
.panel-head p {
  margin: 0;
  color: #77857e;
  font-size: 12px;
  line-height: 1.45;
}

/* 银行转账数据列表 */
.bank dl {
  margin: 8px 0 0;
}
.bank dl div {
  padding: 10px 0;
  border-bottom: 1px solid #f2f5f3;
}
.bank dl div:last-child {
  border-bottom: 0;
}
.bank dt {
  color: #7b8882;
  font-size: 12px;
}
.bank dd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 4px 0 0;
  font-size: 14px;
  font-weight: 650;
  word-break: break-all;
  color: #12362e;
}
.bank-val {
  user-select: all;
}
.copy-btn {
  border: 1px solid #c9dbd1;
  background: #f4f8f6;
  color: #105446;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
  padding: 3px 10px;
  cursor: pointer;
  white-space: nowrap;
  transition: all .15s ease;
}
.copy-btn:hover:not(:disabled) {
  background: #105446;
  color: #fff;
  border-color: #105446;
}
.copy-btn:disabled {
  opacity: .6;
  cursor: wait;
}
.bank-warning {
  margin: 14px 0 0;
  padding: 12px 14px;
  border-radius: 6px;
  background: #fff9ed;
  border: 1px solid #fed7aa;
  color: #8c5310;
  font-size: 12px;
  line-height: 1.6;
}
.bank-warning strong {
  display: block;
  margin-bottom: 4px;
  color: #7c2d12;
}
.bank-warning p {
  margin: 2px 0;
}

/* 支付宝/微信面板样式 */
.alipay-box {
  padding: 18px 4px 4px;
  text-align: center;
}
.alipay-info-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 8px 12px 16px;
  font-size: 13px;
  color: #64748b;
  border-bottom: 1px dashed #e2e8f0;
}
.alipay-price {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
}
.alipay-pay-btn {
  width: 100%;
  height: 48px;
  margin-top: 18px;
  border: 0;
  border-radius: 8px;
  background: #1677ff;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(22, 119, 255, 0.25);
  transition: all .2s ease;
}
.alipay-pay-btn:hover:not(:disabled) {
  background: #0958d9;
  transform: translateY(-1px);
}
.alipay-pay-btn:disabled {
  background: #cbd5e1;
  color: #94a3b8;
  cursor: not-allowed;
  box-shadow: none;
}
.wechat-pay-btn {
  width: 100%;
  height: 48px;
  margin-top: 18px;
  border: 0;
  border-radius: 8px;
  background: #07c160;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(7, 193, 96, 0.25);
  transition: all .2s ease;
}
.wechat-pay-btn:hover:not(:disabled) {
  background: #06ad56;
  transform: translateY(-1px);
}
.wechat-pay-btn:disabled {
  background: #cbd5e1;
  color: #94a3b8;
  cursor: not-allowed;
  box-shadow: none;
}
.alipay-note {
  margin: 12px 0 4px;
  font-size: 12px;
  color: #84938d;
}

/* 提示与状态 */
.wechat-tip, .no-method {
  margin: 0 20px 14px;
  padding: 12px 14px;
  border-radius: 8px;
  background: #fff8e8;
  color: #836020;
  font-size: 12px;
  line-height: 1.6;
}
.wechat-tip strong {
  color: #78350f;
}
.state, .result {
  padding: 56px 24px;
  text-align: center;
}
.state.error strong, .result h2 {
  display: block;
  margin: 12px 0 8px;
  font-size: 20px;
}
.state p, .result p {
  color: #75847c;
  margin: 4px 0;
}
.spinner {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 3px solid #dbe4df;
  border-top-color: #175143;
  border-radius: 50%;
  animation: spin .8s linear infinite;
  margin-right: 8px;
  vertical-align: middle;
}
.result-icon {
  width: 50px;
  height: 50px;
  display: grid;
  place-items: center;
  margin: auto;
  border-radius: 50%;
  font-size: 24px;
  font-weight: 800;
}
.success .result-icon {
  background: #e3f3e9;
  color: #18734d;
}
.unavailable .result-icon {
  background: #f5eee5;
  color: #9b672e;
}
.result code {
  display: inline-block;
  margin-top: 12px;
  padding: 6px 12px;
  background: #f2f5f3;
  border-radius: 6px;
  color: #43564d;
  font-size: 13px;
}
.collection-card > footer {
  padding: 16px 20px;
  text-align: center;
  color: #9aa59f;
  font-size: 11px;
  border-top: 1px solid #edf1ef;
}
.toast {
  position: fixed;
  left: 50%;
  bottom: 34px;
  transform: translateX(-50%);
  padding: 10px 20px;
  border-radius: 8px;
  background: #173f34;
  color: #fff;
  font-size: 13px;
  z-index: 100;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
@media (max-width: 560px) {
  .collection-page {
    padding: 0;
    align-items: stretch;
  }
  .collection-card {
    min-height: 100dvh;
    border: 0;
    border-radius: 0;
  }
  .amount {
    font-size: 40px;
  }
  .method-tab {
    padding: 10px 4px;
  }
  .tab-title {
    font-size: 13px;
  }
  .tab-sub {
    font-size: 10px;
  }
}
</style>
