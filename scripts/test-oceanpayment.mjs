import { test } from 'node:test'
import assert from 'node:assert/strict'
import { embeddedEvent, trustedSdkUrl, observeCardFormReady } from '../app/utils/oceanpaymentEmbedded.ts'

test('wallet ready and cancel never become payment results', () => {
  assert.equal(embeddedEvent({ code: '2', msg: 'ready' }).kind, 'ready')
  assert.equal(embeddedEvent({ code: '3', msg: 'cancelled' }).kind, 'cancelled')
})
test('validation messages stay local; 3DS is a result requiring backend verification', () => {
  assert.equal(embeddedEvent({ code: '30001', msg: 'Unsupported card' }).kind, 'validation')
  const result = embeddedEvent({ order_number: 'PAY_TEST', pay_url: 'https://untrusted.invalid/3ds', signValue: 'test' })
  assert.equal(result.kind, 'result')
  assert.equal('redirect' in result, false)
  assert.equal(embeddedEvent({ pay_url: 'https://untrusted.invalid/3ds' }).kind, 'ignore')
})
test('SDK loading is tied to channel and configured environment', () => {
  assert.equal(trustedSdkUrl('GOOGLE_PAY', 'https://secure.oceanpayment.com/pages/js/oceanpayment-googlepay.js', false), true)
  assert.equal(trustedSdkUrl('GOOGLE_PAY', 'https://secure.oceanpayment.com/pages/js/oceanpayment.js', false), false)
  assert.equal(trustedSdkUrl('APPLE_PAY', 'https://test-secure.oceanpayment.com/pages/js/oceanpayment-applepay.js', false), false)
  assert.equal(trustedSdkUrl('APPLE_PAY', 'https://test-secure.oceanpayment.com/pages/js/oceanpayment-applepay.js', true), true)
  assert.equal(trustedSdkUrl('CREDIT_CARD', 'https://evil.invalid/pages/js/oceanpayment.js', true), false)
})

test('卡片就绪监听绑定当前会话环境和 iframe，兼容数字和字符串状态码', () => {
  let sandbox, frame = { contentWindow: {} }, ready = 0
  const host = Object.assign(new EventTarget(), { document: { getElementById: () => frame } })
  const stop = observeCardFormReady(host, () => sandbox, () => ready++)
  const send = (data, origin = 'https://secure.oceanpayment.com', source = frame.contentWindow) => {
    const event = Object.assign(new Event('message'), { data, origin, source })
    host.dispatchEvent(event)
  }
  const layout = { code: 1, msg: '', height: 131, method: 'Credit Card' }
  send(layout)
  assert.equal(ready, 0)
  sandbox = false
  send(layout)
  send({ ...layout, code: '1' })
  assert.equal(ready, 2)
  send(layout, 'https://test-secure.oceanpayment.com')
  send({ ...layout, code: 2 })
  const previousWindow = frame.contentWindow
  frame = { contentWindow: {} }
  send(layout, 'https://secure.oceanpayment.com', previousWindow)
  assert.equal(ready, 2)
  sandbox = true
  send(layout)
  assert.equal(ready, 2)
  send(layout, 'https://test-secure.oceanpayment.com')
  assert.equal(ready, 3)
  stop()
  send(layout, 'https://test-secure.oceanpayment.com')
  assert.equal(ready, 3)
})
