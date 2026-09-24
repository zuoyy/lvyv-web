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
  '\nObject.assign(exports, { load, submit, selectChannel, selected, session, locked, paymentExpired, orderUnavailable, now, error, callback, sdkMessage, sdkReady, resetting, submitting, resetEmbeddedSession, startWalletProcessing, cancelWalletProcessing, walletProcessingChannel, walletOverlayVisible, walletActivationConfirmed, hasApplePay, hasGooglePay });', {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText

function setup({ status = 'PENDING_PAYMENT', expired = false, existing = null, attemptExpired = false, abortStatus = 'FAILED', abortThrows = false, autoReady = true, renewalThrows = false } = {}) {
  const exports = {}, calls = [], redirects = []
  const href = 'https://www.lvyv.com/orders/ORD_TEST/pay'
  const deadline = new Date(Date.now() + (expired ? -60_000 : 60_000)).toISOString()
  const preview = channel => ({ paymentNo: 'PAY_TEST', status: 'CREATED', channel,
    expireTime: attemptExpired ? new Date(Date.now() - 1000).toISOString() : deadline,
    session: { sdkUrl: `https://test-secure.oceanpayment.com/pages/js/${channel === 'CREDIT_CARD' ? 'oceanpayment.js' : 'oceanpayment-googlepay.js'}`,
      sandbox: true, fields: {}, initConfig: { backUrl: href } } })
  const sdk = {
    init: (...args) => { calls.push(['init', ...args]); if (autoReady) queueMicrotask(() => exports.callback('CREDIT_CARD', { code: 1, msg: '' })) },
    checkout: () => calls.push(['checkout']),
  }
  const window = { location: { href }, matchMedia: () => ({ matches: false }) }
  for (const adapter of Object.values(embedded.embeddedAdapters)) window[adapter.global] = sdk
  runInNewContext(compiled, {
    exports, ref, computed, nextTick, Error, URL,
    document: { getElementById: () => ({}) },
    require: name => name.endsWith('oceanpaymentEmbedded') ? embedded : name.endsWith('paymentMessages') ? messages : {},
    definePageMeta: () => {}, useHead: () => {}, useRoute: () => ({ params: { orderNo: 'ORD_TEST' } }),
    useMemberAuth: () => ({}),
    useTourCommerce: () => ({
      getPaymentOptions: async () => ({ channels: [] }),
      getOrder: async () => ({ order: { status, orderNo: 'ORD_TEST', expireTime: deadline }, items: [] }),
      listPaymentChannels: async () => ['CREDIT_CARD', 'GOOGLE_PAY'].map(channel => ({ channel, enabled: true })),
      currentOrderPayment: async () => existing?.session ? { ...preview(existing.channel), ...existing } : existing,
      abortEmbeddedSession: async () => { calls.push(['abort']); if (abortThrows) throw new Error('Offline'); return { status: abortStatus, failureCode: abortStatus === 'FAILED' ? 'CHECKOUT_NOT_SUBMITTED' : 'NETWORK_OR_RESPONSE_ERROR' } },
      createPayment: async (_order, channel) => { calls.push(['create', channel]); if (renewalThrows && calls.filter(([name]) => name === 'create').length > 1) throw new Error('Offline'); return preview(channel) },
      issueEmbeddedSession: async () => { calls.push(['issue']); return { ...preview('CREDIT_CARD'), session: { fields: { backUrl: href, signValue: 'test' } } } },
    }),
    window, navigator: { userAgent: 'Test desktop' },
    navigateTo: async path => redirects.push(path),
    setInterval: () => 1, clearInterval: () => {}, setTimeout: () => 1, clearTimeout: () => {},
    onMounted: () => {}, onBeforeUnmount: () => {},
  })
  return { ...exports, calls, redirects, open: async () => {
    await exports.load()
    // load 并行挂载支付表单；等待初始化 Promise 完成。
    for (let i = 0; i < 20; i++) await Promise.resolve()
  } }
}

test('关闭页面后返回可恢复付款表单，点击付款前不发放签名参数', async () => {
  const page = setup({ existing: { paymentNo: 'PAY_TEST', channel: 'CREDIT_CARD', status: 'CREATED', session: {} } })
  await page.open()
  assert.equal(page.error.value, '')
  assert.ok(page.session.value)
  assert.equal(page.locked.value, false)
  assert.deepEqual(page.calls.map(([name]) => name), ['create', 'init'])
  assert.equal(page.calls.find(([name]) => name === 'init')[4].showCardName, false)
  await page.submit()
  assert.equal(page.calls.filter(([name]) => name === 'issue').length, 1)
  assert.equal(page.calls.filter(([name]) => name === 'checkout').length, 1)
})

test('订单到期或已关闭时不创建支付，也不提交签名请求', async () => {
  for (const scenario of [{ expired: true }, { status: 'CANCELLED' }]) {
    const page = setup(scenario)
    await page.open()
    await page.selectChannel('CREDIT_CARD')
    await page.submit()
    assert.ok(page.orderUnavailable.value)
    assert.deepEqual(page.calls, [])
  }
})

test('表单打开期间到期，立即阻止继续提交', async () => {
  const page = setup()
  await page.open()
  page.now.value = Date.now() + 120_000
  await page.submit()
  assert.ok(page.orderUnavailable.value)
  assert.equal(page.calls.some(([name]) => name === 'issue'), false)
})

test('订单仍有效而占位过期时，可以重新加载付款表单', async () => {
  const page = setup({ attemptExpired: true })
  await page.open()
  assert.equal(page.paymentExpired.value, true)
  assert.equal(page.orderUnavailable.value, '')
  await page.submit()
  assert.equal(page.calls.some(([name]) => name === 'issue'), false)
  await page.selectChannel('CREDIT_CARD')
  assert.equal(page.calls.filter(([name]) => name === 'create').length, 2)
})

test('返回未提交的钱包占位时，默认显示信用卡表单', async () => {
  const page = setup({ existing: { paymentNo: 'PAY_TEST', channel: 'GOOGLE_PAY', status: 'CREATED', session: {} } })
  await page.open()
  assert.equal(page.selected.value, 'CREDIT_CARD')
  assert.deepEqual(page.calls[0], ['create', 'CREDIT_CARD'])
})

test('已提交或待审核的原支付不自动创建第二笔支付', async () => {
  for (const status of ['PENDING', 'UNKNOWN', 'REVIEW_REQUIRED']) {
    const page = setup({ expired: true, existing: { paymentNo: 'PAY_TEST', channel: 'CREDIT_CARD', status } })
    await page.open()
    await page.selectChannel('CREDIT_CARD')
    assert.equal(page.locked.value, true)
    assert.deepEqual(page.calls, [])
    if (status === 'REVIEW_REQUIRED') assert.deepEqual(page.redirects, ['/payment/result?paymentNo=PAY_TEST'])
  }
})


test('空卡输入框失焦只提示错误，不释放支付、不重载表单', async () => {
  const page = setup()
  await page.open()
  const callsBefore = page.calls.length
  for (let i = 0; i < 3; i++) await page.callback('CREDIT_CARD', { code: -1, msg: 'Your card number is empty.' })
  assert.equal(page.sdkMessage.value, 'Your card number is empty.')
  assert.equal(page.calls.length, callsBefore)
  assert.equal(page.locked.value, false)
  assert.equal(page.submitting.value, false)
  assert.equal(page.sdkReady.value, true)
})

test('iframe 真正就绪前不能签发支付参数，布局消息不表示完成付款', async () => {
  const page = setup({ autoReady: false })
  await page.open()
  await page.submit()
  assert.equal(page.calls.some(([name]) => name === 'issue'), false)
  await page.callback('CREDIT_CARD', { code: 1, msg: '' })
  assert.equal(page.sdkReady.value, true)
  assert.equal(page.locked.value, false)
  assert.equal(page.calls.some(([name]) => name === 'issue'), false)
})

test('提交后空字段校验失败保留 iframe，重试时只创建一次新占位', async () => {
  const page = setup()
  await page.open()
  await page.submit()
  assert.equal(page.locked.value, true)
  await page.callback('CREDIT_CARD', { code: -1, msg: 'Your card number is empty.' })
  assert.equal(page.locked.value, false)
  assert.equal(page.submitting.value, false)
  assert.equal(page.sdkMessage.value, 'Your card number is empty.')
  assert.equal(page.calls.filter(([name]) => name === 'abort').length, 1)
  assert.equal(page.calls.filter(([name]) => name === 'init').length, 1)
  assert.equal(page.calls.filter(([name]) => name === 'create').length, 1)
  await page.callback('CREDIT_CARD', { code: -1, msg: 'Your card number is empty.' })
  assert.equal(page.calls.filter(([name]) => name === 'abort').length, 1)
  await page.submit()
  assert.equal(page.calls.filter(([name]) => name === 'create').length, 2)
  assert.equal(page.calls.filter(([name]) => name === 'init').length, 1)
  assert.equal(page.calls.filter(([name]) => name === 'issue').length, 2)
})

test('释放被拒绝或网络失败时保持锁定，禁止新的签名请求和重建表单', async () => {
  for (const scenario of [{ abortStatus: 'UNKNOWN' }, { abortThrows: true }]) {
    const page = setup(scenario)
    await page.open()
    await page.submit()
    await page.callback('CREDIT_CARD', { code: -1, msg: 'Invalid card' })
    await page.submit()
    assert.equal(page.locked.value, true)
    assert.equal(page.calls.filter(([name]) => name === 'issue').length, 1)
    assert.equal(page.calls.filter(([name]) => name === 'init').length, 1)
  }
})

test('主动恢复被后端拒绝时不清除原支付锁定状态', async () => {
  const page = setup({ abortStatus: 'UNKNOWN', existing: { paymentNo: 'PAY_TEST', channel: 'CREDIT_CARD', status: 'UNKNOWN' } })
  await page.open()
  await page.resetEmbeddedSession()
  assert.equal(page.locked.value, true)
  assert.equal(page.calls.filter(([name]) => name === 'create').length, 0)
})


test('校验失败后的新占位请求出错时允许重试，不清空卡片输入', async () => {
  const page = setup({ renewalThrows: true })
  await page.open()
  await page.submit()
  await page.callback('CREDIT_CARD', { code: -1, msg: 'Invalid card' })
  await page.submit()
  assert.equal(page.locked.value, false)
  assert.equal(page.submitting.value, false)
  assert.equal(page.sdkMessage.value, 'Unable to prepare payment. Please try again.')
  assert.equal(page.calls.filter(([name]) => name === 'init').length, 1)
  assert.equal(page.calls.filter(([name]) => name === 'issue').length, 1)
})


test('钱包焦点触发立即展示反馈，同时阻止信用卡重复提交', async () => {
  for (const channel of ['APPLE_PAY', 'GOOGLE_PAY']) {
    const page = setup()
    await page.open()
    page.hasApplePay.value = true
    page.hasGooglePay.value = true
    page.startWalletProcessing(channel)
    assert.equal(page.walletProcessingChannel.value, channel)
    assert.equal(page.walletOverlayVisible.value, true)
    assert.equal(page.walletActivationConfirmed.value, false)
    await page.submit()
    assert.equal(page.calls.some(([name]) => name === 'issue'), false)
    page.cancelWalletProcessing()
    assert.equal(page.walletOverlayVisible.value, false)
    assert.equal(page.walletProcessingChannel.value, null)
  }
})

test('钱包 SDK 激活回调补充焦点反馈，取消或错误回调结束加载', async () => {
  for (const channel of ['APPLE_PAY', 'GOOGLE_PAY']) {
    const page = setup()
    await page.open()
    await page.callback(channel, { code: 2, msg: '' })
    assert.equal(page.walletOverlayVisible.value, true)
    assert.equal(page.walletActivationConfirmed.value, true)
    await page.callback(channel, { code: 3, msg: '' })
    assert.equal(page.walletOverlayVisible.value, false)
    await page.callback(channel, { code: 2, msg: '' })
    await page.callback(channel, { code: -1, msg: 'Wallet unavailable' })
    assert.equal(page.walletOverlayVisible.value, false)
    assert.equal(page.walletProcessingChannel.value, null)
  }
})
