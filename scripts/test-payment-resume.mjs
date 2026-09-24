import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { runInNewContext } from 'node:vm'
import { ref, computed, nextTick } from 'vue'
import ts from 'typescript'
import * as embedded from '../app/utils/oceanpaymentEmbedded.ts'
import * as messages from '../app/utils/paymentMessages.ts'
import * as walletInteraction from '../app/utils/walletInteraction.ts'

const source = readFileSync(new URL('../app/pages/orders/[orderNo]/pay.vue', import.meta.url), 'utf8')
  .match(/<script setup lang="ts">([\s\S]*?)<\/script>/)[1]
const compiled = ts.transpileModule(source +
  '\nObject.assign(exports, { load, submit, selectChannel, selected, session, locked, paymentExpired, orderUnavailable, now, error, callback, sdkMessage, sdkReady, preparing, resetting, submitting, resetEmbeddedSession, startWalletProcessing, cancelWalletProcessing, walletProcessingChannel, walletOverlayVisible, walletActivationConfirmed, hasApplePay, hasGooglePay, initWallets });', {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText

function setup({ status = 'PENDING_PAYMENT', expired = false, existing = null, attemptExpired = false, abortStatus = 'FAILED', abortThrows = false, autoReady = true, renewalThrows = false, checkoutError = null, api = {}, coldSdk = false, applePaySupported = true, timers = { setTimeout: () => 1, clearTimeout: () => {} } } = {}) {
  const exports = {}, calls = [], redirects = []
  const queries = [], scripts = [], initializedChannels = []
  const mounted = [], unmounted = []
  const href = 'https://www.lvyv.com/orders/ORD_TEST/pay'
  const deadline = new Date(Date.now() + (expired ? -60_000 : 60_000)).toISOString()
  const preview = channel => ({ paymentNo: 'PAY_TEST', status: 'CREATED', channel,
    expireTime: attemptExpired ? new Date(Date.now() - 1000).toISOString() : deadline,
    session: { sdkUrl: `https://test-secure.oceanpayment.com/pages/js/${embedded.embeddedAdapters[channel].script}`,
      sdkType: channel, sandbox: true, fields: {}, initConfig: { backUrl: href } } })
  const sdkFor = channel => ({
    init: (...args) => { structuredClone(args); calls.push(['init', ...args]); initializedChannels.push(channel); if (autoReady && channel === 'CREDIT_CARD') queueMicrotask(() => exports.callback('CREDIT_CARD', { code: 1, msg: '' })) },
    checkout: fields => { structuredClone(fields); if (checkoutError) throw checkoutError; calls.push(['checkout']) },
  })
  const frame = { contentWindow: {} }
  const document = Object.assign(new EventTarget(), { getElementById: id => id === 'oceanpayment-iframe-card' ? frame : {}, activeElement: null,
    createElement: () => ({}), head: { appendChild: script => scripts.push(script) } })
  const window = Object.assign(new EventTarget(), { document, history: { replaceState: () => {} }, location: { href, origin: 'https://www.lvyv.com' }, isSecureContext: true, ApplePaySession: {}, matchMedia: () => ({ matches: false }) })
  if (!applePaySupported) delete window.ApplePaySession
  if (!coldSdk) for (const [channel, adapter] of Object.entries(embedded.embeddedAdapters)) window[adapter.global] = sdkFor(channel)
  const current = existing?.session ? { ...preview(existing.channel), ...existing, session: { ...preview(existing.channel).session, ...existing.session } } : existing
  runInNewContext(compiled, {
    exports, ref, computed, nextTick, Error, URL,
    document,
    require: name => name.endsWith('oceanpaymentEmbedded') ? embedded : name.endsWith('paymentMessages') ? messages : name.endsWith('walletInteraction') ? walletInteraction : {},
    definePageMeta: () => {}, useHead: () => {}, useRoute: () => ({ params: { orderNo: 'ORD_TEST' } }),
    useMemberAuth: () => ({}),
    useTourCommerce: () => ({
      getPaymentOptions: async () => { queries.push('options'); return api.getPaymentOptions ? api.getPaymentOptions() : { activePayment: current, channels: [{ channel: 'CREDIT_CARD', enabled: true, ...preview('CREDIT_CARD').session }] } },
      getOrder: async () => { queries.push('order'); return api.getOrder ? api.getOrder() : { order: { status, orderNo: 'ORD_TEST', expireTime: deadline }, items: [] } },
      listPaymentChannels: async () => { queries.push('channels'); return api.listPaymentChannels ? api.listPaymentChannels() : ['CREDIT_CARD', 'GOOGLE_PAY'].map(channel => ({ channel, enabled: true })) },
      currentOrderPayment: async () => { queries.push('current'); return api.currentOrderPayment ? api.currentOrderPayment() : current },
      abortEmbeddedSession: async () => { calls.push(['abort']); if (abortThrows) throw new Error('Offline'); return { status: abortStatus, failureCode: abortStatus === 'FAILED' ? 'CHECKOUT_NOT_SUBMITTED' : 'NETWORK_OR_RESPONSE_ERROR' } },
      createPayment: async (_order, channel) => { calls.push(['create', channel]); if (renewalThrows && calls.filter(([name]) => name === 'create').length > 1) throw new Error('Offline'); return api.createPayment ? api.createPayment(channel) : preview(channel) },
      issueEmbeddedSession: async () => { calls.push(['issue']); return { ...preview('CREDIT_CARD'), session: { fields: { backUrl: href, signValue: 'test' } } } },
    }),
    window, navigator: { userAgent: 'Test desktop' },
    navigateTo: async path => redirects.push(path),
    setInterval: () => 1, clearInterval: () => {}, ...timers,
    onMounted: fn => mounted.push(fn), onBeforeUnmount: fn => unmounted.push(fn),
  })
  return { ...exports, calls, redirects, queries, scripts, initializedChannels,
    completeSdk: channel => {
      const adapter = embedded.embeddedAdapters[channel]
      const script = scripts.findLast(script => script.src.split('?')[0].endsWith('/' + adapter.script))
      assert.ok(script, channel + ' script requested')
      window[adapter.global] = sdkFor(channel)
      script.onload()
    },
    mount: async () => { mounted.forEach(fn => fn()); for (let i = 0; i < 30; i++) await Promise.resolve() },
    unmount: () => unmounted.forEach(fn => fn()),
    frameMessage: (data, origin = 'https://test-secure.oceanpayment.com', sender = frame.contentWindow) => {
      const event = new Event('message')
      Object.assign(event, { data, origin, source: sender })
      window.dispatchEvent(event)
    },
    open: async () => {
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
  assert.deepEqual(page.calls.map(([name]) => name), ['init'])
  assert.equal(page.calls.find(([name]) => name === 'init')[4].showCardName, false)
  await page.submit()
  assert.equal(page.calls.filter(([name]) => name === 'issue').length, 1)
  assert.equal(page.calls.filter(([name]) => name === 'checkout').length, 1)
})

const settle = async () => { for (let i = 0; i < 30; i++) await Promise.resolve() }
const deferred = () => {
  let resolve, reject
  const promise = new Promise((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}
const allOptions = () => ({ channels: Object.entries(embedded.embeddedAdapters).map(([channel, adapter]) => ({
  channel, enabled: true, sandbox: true,
  sdkUrl: 'https://test-secure.oceanpayment.com/pages/js/' + adapter.script, initConfig: {},
})) })

test('三个 SDK 与订单和支付查询重叠下载，查询结束前不初始化或发起支付', async () => {
  const order = deferred(), current = deferred(), options = deferred()
  const page = setup({ coldSdk: true, api: {
    getOrder: () => order.promise, currentOrderPayment: () => current.promise, getPaymentOptions: () => options.promise,
  } })
  const loading = page.load()
  await settle()
  assert.deepEqual([...page.queries].sort(), ['current', 'options', 'order'])
  assert.equal(page.scripts.length, 0)
  options.resolve(allOptions())
  await settle()
  assert.equal(page.scripts.length, 3)
  for (const channel of Object.keys(embedded.embeddedAdapters)) page.completeSdk(channel)
  await settle()
  assert.deepEqual(page.calls, [])
  order.resolve({ order: { status: 'PENDING_PAYMENT', orderNo: 'ORD_TEST', expireTime: new Date(Date.now() + 60000).toISOString() }, items: [] })
  current.resolve(null)
  await loading
  await settle()
  assert.deepEqual([...page.initializedChannels].sort(), ['APPLE_PAY', 'CREDIT_CARD', 'GOOGLE_PAY'])
  assert.equal(page.scripts.length, 3)
  assert.equal(page.calls.filter(([name]) => name === 'create').length, 1)
  assert.equal(page.calls.some(([name]) => name === 'issue'), false)
  assert.equal(page.queries.includes('channels'), false)
})

test('一个钱包 SDK 下载缓慢不会阻塞信用卡和另一个钱包', async () => {
  const page = setup({ coldSdk: true, api: { getPaymentOptions: async () => allOptions() } })
  await page.open()
  page.completeSdk('CREDIT_CARD')
  page.completeSdk('GOOGLE_PAY')
  await settle()
  assert.deepEqual([...page.initializedChannels].sort(), ['CREDIT_CARD', 'GOOGLE_PAY'])
  assert.equal(page.sdkReady.value, true)
  page.completeSdk('APPLE_PAY')
  await settle()
  assert.equal(page.initializedChannels.filter(channel => channel === 'APPLE_PAY').length, 1)
  assert.equal(page.scripts.length, 3)
})

test('不支持 Apple Pay 的设备不下载或初始化 Apple Pay SDK', async () => {
  const page = setup({ coldSdk: true, applePaySupported: false, api: { getPaymentOptions: async () => allOptions() } })
  await page.open()
  assert.equal(page.scripts.length, 2)
  page.completeSdk('CREDIT_CARD')
  page.completeSdk('GOOGLE_PAY')
  await settle()
  assert.deepEqual([...page.initializedChannels].sort(), ['CREDIT_CARD', 'GOOGLE_PAY'])
  assert.equal(page.hasApplePay.value, false)
})

test('提前下载失败不打断订单查询，正式初始化可重新下载并恢复', async () => {
  const current = deferred()
  const page = setup({ coldSdk: true, api: { currentOrderPayment: () => current.promise } })
  const loading = page.load()
  await settle()
  assert.equal(page.scripts.length, 1)
  page.scripts[0].onerror()
  await settle()
  assert.deepEqual(page.calls, [])
  current.resolve(null)
  await loading
  await settle()
  assert.equal(page.scripts.length, 2)
  page.completeSdk('CREDIT_CARD')
  await settle()
  assert.equal(page.sdkReady.value, true)
  assert.equal(page.calls.filter(([name]) => name === 'create').length, 1)
})

test('信用卡 SDK 先于创建响应失败时，不产生未处理拒绝或签发付款参数', async () => {
  const creating = deferred()
  const page = setup({ coldSdk: true, api: { createPayment: () => creating.promise } })
  await page.open()
  page.scripts[0].onerror()
  // 跨过事件循环，以便测试运行器捕获潜在 unhandledRejection。
  await new Promise(resolve => setImmediate(resolve))
  creating.resolve({ paymentNo: 'PAY_TEST', channel: 'CREDIT_CARD', status: 'CREATED',
    expireTime: new Date(Date.now() + 60000).toISOString(), session: { sandbox: true, fields: {} } })
  await settle()
  assert.equal(page.sdkMessage.value, 'Unable to load this payment method.')
  assert.equal(page.preparing.value, false)
  assert.equal(page.sdkReady.value, false)
  assert.equal(page.calls.some(([name]) => name === 'issue'), false)
})

test('选项失败时保留旧渠道查询兜底，选项为空时不绕过订单渠道限制', async () => {
  const fallback = setup({ api: { getPaymentOptions: async () => { throw new Error('Offline') } } })
  await fallback.open()
  assert.equal(fallback.queries.filter(name => name === 'channels').length, 1)
  assert.equal(fallback.sdkReady.value, true)
  const unavailable = setup({ api: { getPaymentOptions: async () => ({ channels: [] }) } })
  await unavailable.open()
  assert.equal(unavailable.queries.includes('channels'), false)
  assert.equal(unavailable.error.value, 'Payment is temporarily unavailable.')
  assert.deepEqual(unavailable.calls, [])
})

test('支付核验结果晚于 SDK 下载时仍锁定，页面关闭后不初始化组件', async () => {
  for (const unmount of [false, true]) {
    const current = deferred()
    const page = setup({ coldSdk: true, api: { getPaymentOptions: async () => allOptions(), currentOrderPayment: () => current.promise } })
    const loading = page.load()
    await settle()
    for (const channel of Object.keys(embedded.embeddedAdapters)) page.completeSdk(channel)
    if (unmount) page.unmount()
    current.resolve({ paymentNo: 'PAY_TEST', status: 'UNKNOWN', channel: 'CREDIT_CARD' })
    await loading
    await settle()
    assert.deepEqual(page.calls, [])
    assert.deepEqual(page.initializedChannels, [])
    if (!unmount) assert.equal(page.locked.value, true)
  }
})

test('过期、带签名或支付商流水的会话不走快捷复用', async () => {
  for (const scenario of [
    { attemptExpired: true },
    { existing: { paymentNo: 'PAY_TEST', status: 'CREATED', channel: 'CREDIT_CARD', session: { fields: { signValue: 'test' } } } },
    { existing: { paymentNo: 'PAY_TEST', status: 'CREATED', channel: 'CREDIT_CARD', providerPaymentId: 'test', session: {} } },
  ]) {
    const page = setup({ existing: { paymentNo: 'PAY_TEST', status: 'CREATED', channel: 'CREDIT_CARD', session: {} }, ...scenario })
    await page.open()
    assert.equal(page.calls.filter(([name]) => name === 'create').length, 1)
    assert.equal(page.calls.some(([name]) => name === 'issue'), false)
  }
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

test('信用卡加载超时仍禁止提交，迟到的就绪通知清除超时提示且不重建表单', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  for (const code of [1, 2]) {
    const page = setup({ autoReady: false, timers: { setTimeout, clearTimeout } })
    await page.open()
    t.mock.timers.tick(15000)
    assert.match(page.sdkMessage.value, /secure card form could not load/)
    assert.equal(page.sdkReady.value, false)
    assert.equal(page.preparing.value, false)
    await page.submit()
    assert.equal(page.calls.some(([name]) => name === 'issue'), false)
    const callsBefore = page.calls.length
    await page.callback('CREDIT_CARD', { code, msg: '' })
    assert.equal(page.sdkMessage.value, '')
    assert.equal(page.sdkReady.value, true)
    assert.equal(page.preparing.value, false)
    assert.equal(page.locked.value, false)
    assert.equal(page.calls.length, callsBefore)
  }
})

test('信用卡及时就绪后不再产生加载超时提示', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const page = setup({ autoReady: false, timers: { setTimeout, clearTimeout } })
  await page.open()
  t.mock.timers.tick(14999)
  await page.callback('CREDIT_CARD', { code: 1, msg: '' })
  t.mock.timers.tick(15000)
  assert.equal(page.sdkMessage.value, '')
  assert.equal(page.sdkReady.value, true)
  assert.equal(page.preparing.value, false)
})

test('旧 SDK 不回传 code=1 时，页面仍接收当前卡 iframe 的真实格式并解除加载超时', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  for (const code of [1, '1']) {
    const page = setup({ autoReady: false, timers: { setTimeout, clearTimeout } })
    await page.mount()
    t.mock.timers.tick(15000)
    assert.match(page.sdkMessage.value, /secure card form could not load/)
    const callsBefore = page.calls.length
    // 来自支付商 checkpage 的布局通知；SDK 不调用商户 callback，直接走浏览器消息链路。
    const ready = { code, msg: '', height: 131, method: 'Credit Card' }
    page.frameMessage(ready)
    assert.equal(page.sdkReady.value, true)
    assert.equal(page.preparing.value, false)
    assert.equal(page.sdkMessage.value, '')
    assert.equal(page.locked.value, false)
    assert.equal(page.calls.length, callsBefore)
    await page.submit()
    assert.equal(page.calls.filter(([name]) => name === 'issue').length, 1)
    assert.equal(page.calls.filter(([name]) => name === 'checkout').length, 1)
    page.unmount()
  }
})

test('直接就绪监听拒绝错误来源、其他 iframe、校验错误及卸载后的通知', async () => {
  const page = setup({ autoReady: false })
  await page.mount()
  const ready = { code: 1, msg: '', height: 131, method: 'Credit Card' }
  page.frameMessage(ready, 'https://evil.invalid')
  page.frameMessage(ready, 'https://secure.oceanpayment.com')
  page.frameMessage(ready, 'https://test-secure.oceanpayment.com', {})
  for (const payload of [null, '{', JSON.stringify(ready), { ...ready, method: 'ApplePay' }, { ...ready, code: -1 }, { ...ready, msg: 'Your card number is empty.' }]) {
    page.frameMessage(payload)
  }
  assert.equal(page.sdkReady.value, false)
  assert.equal(page.calls.some(([name]) => name === 'issue'), false)
  page.unmount()
  page.frameMessage(ready)
  assert.equal(page.sdkReady.value, false)
})

test('重复就绪通知不清除卡片校验错误或支付核验提示，也不解除支付锁定', async () => {
  const page = setup({ abortStatus: 'UNKNOWN' })
  await page.open()
  await page.callback('CREDIT_CARD', { code: -1, msg: 'Your card number is empty.' })
  for (const code of [1, 2]) {
    await page.callback('CREDIT_CARD', { code, msg: '' })
    assert.equal(page.sdkMessage.value, 'Your card number is empty.')
  }
  await page.submit()
  await page.callback('CREDIT_CARD', { code: -1, msg: 'Your card number is empty.' })
  const message = page.sdkMessage.value
  assert.match(message, /Confirming your payment status/)
  for (const code of [1, 2]) {
    await page.callback('CREDIT_CARD', { code, msg: '' })
    assert.equal(page.sdkMessage.value, message)
    assert.equal(page.locked.value, true)
  }
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


test('钱包初始化的嵌套响应式配置能够通过 postMessage 结构化克隆', async () => {
  const page = setup()
  await page.open()
  const options = ref(['APPLE_PAY', 'GOOGLE_PAY'].map(channel => ({
    channel, sandbox: true,
    sdkUrl: `https://test-secure.oceanpayment.com/pages/js/oceanpayment-${channel === 'APPLE_PAY' ? 'applepay' : 'googlepay'}.js`,
    initConfig: { transactionInfo: { orderCurrency: 'USD', orderAmount: '1.00' }, buttonStyle: { buttonRadius: 8 } },
  })))
  const before = page.calls.filter(([name]) => name === 'init').length
  page.initWallets(options.value, options.value.map(({channel}) => ({channel, enabled: true})))
  for (let i = 0; i < 20; i++) await Promise.resolve()
  assert.equal(page.calls.filter(([name]) => name === 'init').length, before + 2)
  assert.equal(page.hasApplePay.value, true)
  assert.equal(page.hasGooglePay.value, true)
})

test('本地 DataCloneError 尚未送达 iframe，释放占位后保留可编辑表单', async () => {
  const page = setup({checkoutError: new DOMException('Not cloneable', 'DataCloneError')})
  await page.open()
  await page.submit()
  assert.equal(page.calls.filter(([name]) => name === 'abort').length, 1)
  assert.equal(page.calls.filter(([name]) => name === 'checkout').length, 0)
  assert.equal(page.locked.value, false)
  assert.equal(page.submitting.value, false)
  assert.ok(page.session.value)
  assert.match(page.sdkMessage.value, /could not receive/)
})

test('其他 SDK 异常不能被假定为未提交，不自动释放未知支付', async () => {
  const page = setup({checkoutError: new Error('SDK error')})
  await page.open()
  await page.submit()
  assert.equal(page.calls.filter(([name]) => name === 'abort').length, 0)
  assert.equal(page.locked.value, true)
  assert.match(page.sdkMessage.value, /Confirming/)
})
