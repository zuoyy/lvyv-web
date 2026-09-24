export type EmbeddedChannel = 'CREDIT_CARD' | 'GOOGLE_PAY' | 'APPLE_PAY'
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
