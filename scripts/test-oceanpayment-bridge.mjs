import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { runInNewContext } from 'node:vm'

const source = readFileSync(new URL('../public/vendor/oceanpayment/oceanpayment.js', import.meta.url), 'utf8')
function setup() {
  const callbacks = [], sent = []
  const frame = { contentWindow: { postMessage: (...args) => sent.push(args) } }
  const container = { innerHTML: '' }
  let listener
  const window = { parent: { location: { href: 'https://www.lvyv.com/orders/ORD_TEST/pay' } },
    addEventListener: (_event, handler) => { listener = handler } }
  runInNewContext(source, {
    window,
    document: { getElementById: id => id === 'oceanpayment-element' ? container : frame },
    oceanpaymentCallBack: data => callbacks.push(data),
    DOMParser: class { parseFromString() { return { getElementsByTagName: () => [{ textContent: 'Credit Card' }] } } },
  })
  const send = (data, origin = 'https://secure.oceanpayment.com', sender = frame.contentWindow) => listener({ data, origin, source: sender })
  return { sdk: window.Oceanpayment, frame, container, callbacks, sent, send }
}

test('初始化默认隐藏姓名，iframe 只收到配置，不包含卡数据', () => {
  const bridge = setup()
  bridge.sdk.init('', '', 'en_US', { showCardName: false })
  bridge.frame.onload()
  assert.equal(bridge.sent[0][0].showCardName, false)
  assert.equal(bridge.sent[0][0].methodType, 'init')
  assert.equal(bridge.sent[0][1], 'https://secure.oceanpayment.com')
  assert.match(bridge.container.innerHTML, /loading="eager"/)
  assert.match(bridge.container.innerHTML, /fetchpriority="high"/)
})

test('布局就绪和空卡失焦错误透传，保留原消息且不重建 iframe', () => {
  const bridge = setup()
  bridge.sdk.init('', '', 'en_US')
  const html = bridge.container.innerHTML
  const ready = { code: 1, msg: '', height: 131, method: 'Credit Card' }
  const invalid = { code: -1, msg: 'Your card number is empty.', height: 160, method: 'Credit Card' }
  bridge.send(ready)
  bridge.send(invalid)
  assert.deepEqual(bridge.callbacks, [ready, invalid])
  assert.equal(invalid.height, 160)
  assert.equal(bridge.frame.height, 160)
  assert.equal(bridge.container.innerHTML, html)
})

test('其他窗口、钱包及错误环境消息不能改变信用卡表单状态', () => {
  const bridge = setup()
  bridge.sdk.init('', '', 'en_US')
  const ready = { code: 1, msg: '', method: 'Credit Card' }
  bridge.send(ready, 'https://evil.invalid')
  bridge.send(ready, 'https://test-secure.oceanpayment.com')
  bridge.send(ready, 'https://secure.oceanpayment.com', {})
  bridge.send({ code: 2, method: 'GooglePay' })
  bridge.send(null)
  assert.deepEqual(bridge.callbacks, [])
})

test('支付 XML 结果继续转发给页面及后端验签', () => {
  const bridge = setup()
  const result = '<response><methods>Credit Card</methods><order_number>PAY_TEST</order_number></response>'
  bridge.send(result)
  assert.deepEqual(bridge.callbacks, [result])
})
