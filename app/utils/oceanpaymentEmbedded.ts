export type EmbeddedChannel = 'CREDIT_CARD' | 'GOOGLE_PAY' | 'APPLE_PAY'

/** 支付 SDK 通过 postMessage 传参；深拷贝 API 的 JSON 数据，避免 Vue Proxy 触发 DataCloneError。 */
export function paymentSdkData<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}
export const embeddedAdapters = {
  CREDIT_CARD: { global: 'Oceanpayment', callback: 'oceanpaymentCallBack', container: 'oceanpayment-element', script: 'oceanpayment.js' },
  GOOGLE_PAY: { global: 'onePageGooglePay', callback: 'oceanpaymentGooglePayCallBack', container: 'oceanpayment-googlepayelement', script: 'oceanpayment-googlepay.js' },
  APPLE_PAY: { global: 'onePageApplePay', callback: 'oceanpaymentApplePayCallBack', container: 'oceanpayment-applepayelement', script: 'oceanpayment-applepay.js' }
} as const

export type EmbeddedEvent =
  | { kind: 'ready' | 'cancelled' | 'ignore' }
  | { kind: 'validation'; code: string; message: string }
  | { kind: 'result'; fields: Record<string, string> }

// XML is parsed in the browser; this adapter handles the resulting fields identically to JSON.
export function embeddedEvent(fields: Record<string, string>): EmbeddedEvent {
  if (fields.code === '2') return { kind: 'ready' }
  if (fields.code === '3') return { kind: 'cancelled' }
  if (fields.msg) return { kind: 'validation', code: fields.code || '', message: fields.msg }
  if (fields.order_number && (fields.signValue || fields.pay_url)) return { kind: 'result', fields }
  return { kind: 'ignore' }
}

export function trustedSdkUrl(channel: EmbeddedChannel, url: string, sandbox: boolean): boolean {
  const path = `/pages/js/${embeddedAdapters[channel].script}`
  return url === `https://secure.oceanpayment.com${path}`
    || (sandbox && url === `https://test-secure.oceanpayment.com${path}`)
}

/** 旧 SDK 会过滤布局通知；直接监听当前卡片 iframe 的就绪消息，避免表单已显示却一直等待。 */
export function observeCardFormReady(host: Window, sandbox: () => boolean | undefined, onReady: () => void): () => void {
  const listener = (event: MessageEvent) => {
    const environment = sandbox()
    if (environment === undefined) return
    const origin = environment ? 'https://test-secure.oceanpayment.com' : 'https://secure.oceanpayment.com'
    const frame = host.document.getElementById('oceanpayment-iframe-card') as HTMLIFrameElement | null
    // 来源域名与当前 iframe 窗口均匹配才接受，钱包或上一次表单的消息不能改变卡片就绪状态。
    if (!frame?.contentWindow || event.source !== frame.contentWindow || event.origin !== origin) return
    const data: unknown = event.data
    if (!data || typeof data !== 'object') return
    const fields = data as Record<string, unknown>
    if (fields.method !== 'Credit Card' || (fields.code !== 1 && fields.code !== '1')) return
    if (fields.msg != null && (typeof fields.msg !== 'string' || fields.msg.trim() !== '')) return
    onReady()
  }
  host.addEventListener('message', listener)
  return () => host.removeEventListener('message', listener)
}
