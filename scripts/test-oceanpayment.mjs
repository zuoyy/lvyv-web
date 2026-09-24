import { test } from 'node:test'
import assert from 'node:assert/strict'
import { embeddedEvent, trustedSdkUrl } from '../app/utils/oceanpaymentEmbedded.ts'

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
