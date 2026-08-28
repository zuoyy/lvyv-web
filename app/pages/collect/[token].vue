<template>
  <main class="collection-page">
    <section class="collection-card">
      <header><span class="brand-mark">北京旅遇国际</span><p>安全收款</p></header>
      <div v-if="loading" class="state"><span class="spinner" />正在读取收款信息…</div>
      <div v-else-if="errorMessage" class="state error"><strong>链接不可用</strong><p>{{ errorMessage }}</p></div>
      <template v-else-if="collection">
        <section class="summary">
          <p class="label">收款事由</p><h1>{{ collection.purpose }}</h1>
          <p class="amount"><small>¥</small>{{ money(collection.amount) }}</p>
          <div v-if="collection.status === 'PENDING_PAYMENT'" class="deadline-badge">
            <span class="countdown-icon">⏱</span>
            <span>剩余支付时间：<strong>{{ countdownText }}</strong></span>
          </div>
          <p v-else class="deadline">有效期至 {{ dateTime(collection.validUntil) }}</p>
        </section>

        <section v-if="collection.status === 'PAID'" class="result success">
          <span class="result-icon">✓</span><h2>支付成功</h2>
          <p>感谢您的付款，请勿重复支付。</p><code v-if="collection.paymentReference">参考号 {{ collection.paymentReference }}</code>
        </section>
        <section v-else-if="collection.status !== 'PENDING_PAYMENT'" class="result unavailable">
          <span class="result-icon">!</span><h2>{{ statusText }}</h2><p>当前收款单已无法继续付款，请联系收款方。</p>
        </section>
        <template v-else>
          <p v-if="wechatBrowser && alipayChannel" class="wechat-tip">微信内无法直接打开支付宝，请点击右上角使用系统浏览器。银行转账信息仍可查看。</p>
          <section v-if="alipayChannel" class="method">
            <div><span class="method-icon alipay">支</span><div><h2>支付宝</h2><p>跳转至支付宝官方页面完成付款</p></div></div>
            <button :disabled="submitting || wechatBrowser" @click="payWithAlipay">{{ submitting ? '正在跳转…' : '使用支付宝付款' }}</button>
          </section>
          <section v-if="bankChannel" class="method bank">
            <div><span class="method-icon">银</span><div><h2>银行转账</h2><p>转账后由收款方人工确认</p></div></div>
            <dl>
              <div v-for="row in bankRows" :key="row.key"><dt>{{ row.label }}</dt><dd>{{ row.value }}<button type="button" @click="copy(row.value)">复制</button></dd></div>
            </dl>
            <p class="bank-warning">请按页面金额一次性转账，并在附言中填写指定备注。</p>
          </section>
          <p v-if="!collection.channels.length" class="no-method">暂未配置可用付款方式，请联系收款方。</p>
        </template>
      </template>
      <footer>本页面由北京旅遇国际旅游有限公司提供安全支付服务 · 付款前请仔细核对收款事由及金额</footer>
    </section>
    <div v-if="toast" class="toast">{{ toast }}</div>
  </main>
</template>

<script setup lang="ts">
type CollectionStatus = 'PENDING_PAYMENT' | 'PAID' | 'EXPIRED' | 'CANCELLED'
interface Channel { channel: 'ALIPAY' | 'BANK_TRANSFER'; name: string; instructions: Record<string, string> }
interface CollectionView { purpose: string; currency: 'CNY'; amount: string | number; status: CollectionStatus; validUntil: string; paidTime?: string; paymentChannel?: string; paymentReference?: string; channels: Channel[] }
interface PaymentView { paymentNo: string; status: string; redirectUrl?: string }
interface ApiResult<T> { code: number; msg?: string; data: T }

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
const submitting = ref(false)
const errorMessage = ref('')
const toast = ref('')
const wechatBrowser = ref(false)
const now = ref(Date.now())
let pollTimer: ReturnType<typeof setTimeout> | undefined
let countdownTimer: ReturnType<typeof setInterval> | undefined
let pollCount = 0

const alipayChannel = computed(() => collection.value?.channels.find(item => item.channel === 'ALIPAY'))
const bankChannel = computed(() => collection.value?.channels.find(item => item.channel === 'BANK_TRANSFER'))
const bankRows = computed(() => {
  const values = bankChannel.value?.instructions || {}
  const rows: Array<[string, string]> = [
    ['bankName', '银行名称'], ['accountName', '账户名称'], ['accountNumber', '银行账号'],
    ['branchName', '开户行'], ['transferNote', '转账备注'],
  ]
  return rows.map(([key, label]) => ({ key, label, value: values[key] })).filter(item => item.value)
})
const statusText = computed(() => collection.value?.status === 'EXPIRED' ? '收款单已过期' : '收款单已作废')
const money = (value: string | number) => Number(value).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const dateTime = (value: string) => {
  const utcValue = /(Z|[+-]\d{2}:?\d{2})$/i.test(value) ? value : `${value}Z`
  return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(utcValue))
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

watch(remainingSeconds, (val) => {
  if (val <= 0 && collection.value && collection.value.status === 'PENDING_PAYMENT') {
    collection.value.status = 'EXPIRED'
  }
})

const request = async <T>(path: string, method: 'GET' | 'POST' = 'GET', body?: Record<string, unknown>) => {
  const response = await $fetch<ApiResult<T>>(path, { baseURL: config.public.apiBase as string, method, body,
    headers: { 'Cache-Control': 'no-store' } })
  if (response.code !== 200) throw new Error(response.msg || '请求失败')
  return response.data
}
const load = async () => {
  try {
    collection.value = await request<CollectionView>(`/commerce/public-collections/${encodeURIComponent(token.value)}`)
    errorMessage.value = ''
  } catch (error: any) {
    errorMessage.value = error?.data?.msg || error?.message || '收款链接不存在或已失效'
  } finally { loading.value = false }
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
const pollPayment = async (paymentNo: string) => {
  try {
    const payment = await request<PaymentView>(`/commerce/public-collections/${encodeURIComponent(token.value)}/payments/${encodeURIComponent(paymentNo)}`)
    if (payment.status === 'SUCCEEDED') { await load(); return }
    if (!['CREATED', 'PENDING', 'UNKNOWN'].includes(payment.status) || pollCount++ >= 40) return
    pollTimer = setTimeout(() => pollPayment(paymentNo), 3000)
  } catch { if (pollCount++ < 40) pollTimer = setTimeout(() => pollPayment(paymentNo), 3000) }
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
  await load()
  const paymentNo = typeof route.query.paymentNo === 'string' ? route.query.paymentNo : ''
  if (paymentNo) pollPayment(paymentNo)
})
onBeforeUnmount(() => {
  if (pollTimer) clearTimeout(pollTimer)
  if (countdownTimer) clearInterval(countdownTimer)
})
</script>

<style scoped>
:global(body){margin:0;background:#f3f6f4;color:#183d33;font-family:Inter,"PingFang SC","Microsoft YaHei",sans-serif}.collection-page{min-height:100dvh;display:grid;place-items:start center;padding:clamp(12px,3vh,28px) 20px 32px;box-sizing:border-box;background:#f3f6f4}.collection-card{width:min(520px,100%);padding:0;background:#fff;border:1px solid #dce5e0;border-radius:8px;box-shadow:0 20px 60px rgba(23,63,52,.1);overflow:hidden}.collection-card>header{display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid #edf1ef}.brand-mark{font:700 19px/1.2 "Playfair Display","Songti SC",serif;color:#105446;letter-spacing:.02em}.collection-card>header p{margin:0;color:#7b8a83;font-size:12px;letter-spacing:.12em}.summary{text-align:center;padding:32px 24px 26px}.label{margin:0 0 8px;color:#819088;font-size:12px}.summary h1{margin:0 auto;max-width:420px;font-size:20px;line-height:1.5;font-weight:600}.amount{margin:22px 0 8px;color:#103f34;font-size:50px;font-weight:750;letter-spacing:0}.amount small{font-size:24px;margin-right:4px}.deadline{margin:0;color:#7b8882;font-size:13px}.deadline-badge{display:inline-flex;align-items:center;gap:6px;margin:8px auto 0;padding:6px 14px;background:#fef3c7;color:#92400e;border:1px solid #fde68a;border-radius:20px;font-size:13px}.deadline-badge strong{font-variant-numeric:tabular-nums;font-weight:700;color:#78350f}.countdown-icon{font-size:13px}.method{margin:0 20px 16px;padding:20px;border:1px solid #dfe8e3;border-radius:8px}.method>div:first-child{display:flex;align-items:center;gap:13px}.method h2{margin:0 0 3px;font-size:17px}.method p{margin:0;color:#77857e;font-size:13px;line-height:1.5}.method-icon{width:40px;height:40px;display:grid;place-items:center;border-radius:8px;background:#edf3ef;color:#174d40;font-weight:800}.method-icon.alipay{background:#e8f3ff;color:#1677ff}.method>button{width:100%;height:46px;margin-top:18px;border:0;border-radius:8px;background:#1677ff;color:#fff;font-size:15px;font-weight:700;cursor:pointer}.method>button:disabled{background:#aeb8b3;cursor:not-allowed}.bank dl{margin:18px 0 0}.bank dl div{padding:11px 0;border-top:1px solid #edf1ef}.bank dt{color:#7b8882;font-size:12px}.bank dd{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:5px 0 0;font-size:14px;font-weight:650;word-break:break-all}.bank dd button{border:0;background:transparent;color:#176a58;cursor:pointer;white-space:nowrap}.bank-warning,.wechat-tip,.no-method{margin:0 20px 16px;padding:12px 14px;border-radius:8px;background:#fff8e8;color:#836020;font-size:12px;line-height:1.6}.bank .bank-warning{margin:16px 0 0}.state,.result{padding:64px 28px;text-align:center}.state.error strong,.result h2{display:block;margin:12px 0 8px;font-size:22px}.state p,.result p{color:#75847c}.spinner{display:inline-block;width:24px;height:24px;border:3px solid #dbe4df;border-top-color:#175143;border-radius:50%;animation:spin .8s linear infinite}.result-icon{width:52px;height:52px;display:grid;place-items:center;margin:auto;border-radius:50%;font-size:25px;font-weight:800}.success .result-icon{background:#e3f3e9;color:#18734d}.unavailable .result-icon{background:#f5eee5;color:#9b672e}.result code{display:inline-block;margin-top:12px;padding:8px 10px;background:#f2f5f3;border-radius:7px;color:#43564d}.collection-card>footer{padding:18px 22px;text-align:center;color:#9aa59f;font-size:11px;border-top:1px solid #edf1ef}.toast{position:fixed;left:50%;bottom:34px;transform:translateX(-50%);padding:10px 18px;border-radius:8px;background:#173f34;color:#fff;font-size:13px}@keyframes spin{to{transform:rotate(360deg)}}@media(max-width:560px){.collection-page{padding:0;align-items:stretch}.collection-card{min-height:100dvh;border:0;border-radius:0}.amount{font-size:44px}}
</style>
