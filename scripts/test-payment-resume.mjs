import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { runInNewContext } from 'node:vm'
import { ref, computed, nextTick } from 'vue'
import ts from 'typescript'
import * as embedded from '../app/utils/oceanpaymentEmbedded.ts'
import * as messages from '../app/utils/paymentMessages.ts'

const source = readFileSync(new URL('../app/pages/orders/[orderNo]/pay.vue', import.meta.url), 'utf8')
  .match(/<script setup lang="ts">([\s\S]*?)<\/script>/)[1]
const compiled = ts.transpileModule(source +
  '\nObject.assign(exports, { load, submit, selectChannel, selected, session, locked, paymentExpired, orderUnavailable, now, error });', {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText

function setup({ status = 'PENDING_PAYMENT', expired = false, existing = null, attemptExpired = false } = {}) {
  const exports = {}, calls = [], redirects = []
  const href = 'https://www.lvyv.com/orders/ORD_TEST/pay'
  const deadline = new Date(Date.now() + (expired ? -60_000 : 60_000)).toISOString()
  const preview = channel => ({ paymentNo: 'PAY_TEST', status: 'CREATED', channel,
    expireTime: attemptExpired ? new Date(Date.now() - 1000).toISOString() : deadline,
    session: { sdkUrl: `https://test-secure.oceanpayment.com/pages/js/${channel === 'CREDIT_CARD' ? 'oceanpayment.js' : 'oceanpayment-googlepay.js'}`,
      sandbox: true, fields: {}, initConfig: { backUrl: href } } })
  const sdk = { init: () => calls.push(['init']), checkout: () => calls.push(['checkout']) }
  const window = { location: { href }, matchMedia: () => ({ matches: false }) }
  for (const adapter of Object.values(embedded.embeddedAdapters)) window[adapter.global] = sdk
  runInNewContext(compiled, {
    exports, ref, computed, nextTick, Error,
    require: name => name.endsWith('oceanpaymentEmbedded') ? embedded : name.endsWith('paymentMessages') ? messages : {},
    definePageMeta: () => {}, useHead: () => {}, useRoute: () => ({ params: { orderNo: 'ORD_TEST' } }),
    useMemberAuth: () => ({}),
    useTourCommerce: () => ({
      getOrder: async () => ({ order: { status, orderNo: 'ORD_TEST', expireTime: deadline }, items: [] }),
      listPaymentChannels: async () => ['CREDIT_CARD', 'GOOGLE_PAY'].map(channel => ({ channel, enabled: true })),
      currentOrderPayment: async () => existing?.session ? { ...preview(existing.channel), ...existing } : existing,
      createPayment: async (_order, channel) => { calls.push(['create', channel]); return preview(channel) },
      issueEmbeddedSession: async () => { calls.push(['issue']); return { ...preview('CREDIT_CARD'), session: { fields: { backUrl: href, signValue: 'test' } } } },
    }),
    window, navigator: { userAgent: 'Test desktop' },
    navigateTo: async path => redirects.push(path),
    setInterval: () => 1, clearInterval: () => {}, setTimeout: () => 1, clearTimeout: () => {},
    onMounted: () => {}, onBeforeUnmount: () => {},
  })
  return { ...exports, calls, redirects }
}

test('关闭页面后返回可恢复付款表单，点击付款前不发放签名参数', async () => {
  const page = setup({ existing: { paymentNo: 'PAY_TEST', channel: 'CREDIT_CARD', status: 'CREATED', session: {} } })
  await page.load()
  assert.equal(page.error.value, '')
  assert.ok(page.session.value)
  assert.equal(page.locked.value, false)
  assert.deepEqual(page.calls, [['create', 'CREDIT_CARD'], ['init']])
  await page.submit()
  assert.equal(page.calls.filter(([name]) => name === 'issue').length, 1)
  assert.equal(page.calls.filter(([name]) => name === 'checkout').length, 1)
})

test('订单到期或已关闭时不创建支付，也不提交签名请求', async () => {
  for (const scenario of [{ expired: true }, { status: 'CANCELLED' }]) {
    const page = setup(scenario)
    await page.load()
    await page.selectChannel('CREDIT_CARD')
    await page.submit()
    assert.ok(page.orderUnavailable.value)
    assert.deepEqual(page.calls, [])
  }
})

test('表单打开期间到期，立即阻止继续提交', async () => {
  const page = setup()
  await page.load()
  page.now.value = Date.now() + 120_000
  await page.submit()
  assert.ok(page.orderUnavailable.value)
  assert.equal(page.calls.some(([name]) => name === 'issue'), false)
})

test('订单仍有效而占位过期时，可以重新加载付款表单', async () => {
  const page = setup({ attemptExpired: true })
  await page.load()
  assert.equal(page.paymentExpired.value, true)
  assert.equal(page.orderUnavailable.value, '')
  await page.submit()
  assert.equal(page.calls.some(([name]) => name === 'issue'), false)
  await page.selectChannel('CREDIT_CARD')
  assert.equal(page.calls.filter(([name]) => name === 'create').length, 2)
})

test('返回未提交的钱包付款时，保持原支付渠道', async () => {
  const page = setup({ existing: { paymentNo: 'PAY_TEST', channel: 'GOOGLE_PAY', status: 'CREATED', session: {} } })
  await page.load()
  assert.equal(page.selected.value, 'GOOGLE_PAY')
  assert.deepEqual(page.calls[0], ['create', 'GOOGLE_PAY'])
})

test('已提交或待审核的原支付不自动创建第二笔支付', async () => {
  for (const status of ['PENDING', 'UNKNOWN', 'REVIEW_REQUIRED']) {
    const page = setup({ expired: true, existing: { paymentNo: 'PAY_TEST', channel: 'CREDIT_CARD', status } })
    await page.load()
    await page.selectChannel('CREDIT_CARD')
    assert.equal(page.locked.value, true)
    assert.deepEqual(page.calls, [])
    if (status === 'REVIEW_REQUIRED') assert.deepEqual(page.redirects, ['/payment/result?paymentNo=PAY_TEST'])
  }
})
