import assert from 'node:assert/strict'
import test from 'node:test'
import { observeWalletInteraction } from '../app/utils/walletInteraction.ts'

function setup(t) {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const frames = Object.fromEntries(['applepay', 'googlepay', 'card'].map(name => [`oceanpayment-iframe-${name}`, {}]))
  const host = new EventTarget()
  host.document = Object.assign(new EventTarget(), { activeElement: null, body: {}, documentElement: {}, getElementById: id => frames[id] || null })
  const entered = []
  let left = 0
  const stop = observeWalletInteraction(host, channel => entered.push(channel), () => left++)
  const pageEvent = (type, target) => {
    const event = new Event(type)
    Object.defineProperty(event, 'target', { value: target })
    host.document.dispatchEvent(event)
  }
  return { host, frames, entered, stop, pageEvent, left: () => left }
}

test('跨域钱包获得焦点后立即展示对应反馈，无需父页面收到点击事件', t => {
  const state = setup(t)
  for (const [name, channel] of [['applepay', 'APPLE_PAY'], ['googlepay', 'GOOGLE_PAY']]) {
    // blur 发出时 activeElement 尚未更新，模拟浏览器的更新顺序。
    state.host.dispatchEvent(new Event('blur'))
    state.host.document.activeElement = state.frames[`oceanpayment-iframe-${name}`]
    t.mock.timers.tick(0)
    assert.equal(state.entered.at(-1), channel)
  }
  state.stop()
})

test('信用卡 iframe、切出浏览器和返回页面不会被当作钱包点击', t => {
  const state = setup(t)
  state.host.document.activeElement = state.frames['oceanpayment-iframe-card']
  state.host.dispatchEvent(new Event('blur'))
  t.mock.timers.tick(0)
  state.host.document.activeElement = null
  state.host.dispatchEvent(new Event('focus'))
  t.mock.timers.tick(0)
  assert.deepEqual(state.entered, [])
  assert.equal(state.left(), 0)
  state.stop()
})

test('返回普通页面元素时清除仅由焦点触发的连接提示', t => {
  const state = setup(t)
  state.host.document.activeElement = state.frames['oceanpayment-iframe-applepay']
  state.host.dispatchEvent(new Event('blur'))
  t.mock.timers.tick(0)
  state.host.document.activeElement = {}
  state.pageEvent('focusin', state.host.document.activeElement)
  t.mock.timers.tick(0)
  assert.deepEqual(state.entered, ['APPLE_PAY'])
  assert.equal(state.left(), 1)
  state.stop()
})

test('离开支付页时取消待执行检查并移除监听，避免残留遮罩', t => {
  const state = setup(t)
  state.host.dispatchEvent(new Event('blur'))
  state.stop()
  state.host.document.activeElement = state.frames['oceanpayment-iframe-googlepay']
  t.mock.timers.tick(100)
  state.host.dispatchEvent(new Event('blur'))
  state.pageEvent('focusin', state.host.document.activeElement)
  state.pageEvent('pointerdown', state.host.document.body)
  t.mock.timers.tick(100)
  assert.deepEqual(state.entered, [])
  assert.equal(state.left(), 0)
})

test('钱包焦点在同一任务内回落时仍保留点击开始的反馈', t => {
  const state = setup(t)
  state.host.document.activeElement = state.frames['oceanpayment-iframe-applepay']
  state.host.dispatchEvent(new Event('blur'))
  state.host.document.activeElement = state.host.document.body
  t.mock.timers.tick(100)
  assert.deepEqual(state.entered, ['APPLE_PAY'])
  assert.equal(state.left(), 0)
  state.stop()
})

test('Apple Pay 原生窗口引起的 body 焦点回落不收起加载，授权回调前仍保留提示', t => {
  const state = setup(t)
  state.host.document.activeElement = state.frames['oceanpayment-iframe-applepay']
  state.host.dispatchEvent(new Event('blur'))
  t.mock.timers.tick(0)
  assert.deepEqual(state.entered, ['APPLE_PAY'])
  state.host.document.activeElement = state.host.document.body
  state.host.dispatchEvent(new Event('focus'))
  state.pageEvent('focusin', state.host.document.body)
  t.mock.timers.tick(100)
  assert.equal(state.left(), 0)
  state.stop()
})

test('浏览器延迟更新 iframe 焦点仍能捕获且仅启动一次加载', t => {
  const state = setup(t)
  state.host.document.activeElement = state.host.document.body
  state.host.dispatchEvent(new Event('blur'))
  t.mock.timers.tick(0)
  assert.deepEqual(state.entered, [])
  t.mock.timers.tick(50)
  state.host.document.activeElement = state.frames['oceanpayment-iframe-applepay']
  t.mock.timers.tick(50)
  assert.deepEqual(state.entered, ['APPLE_PAY'])
  state.host.dispatchEvent(new Event('focus'))
  t.mock.timers.tick(0)
  assert.deepEqual(state.entered, ['APPLE_PAY'])
  state.stop()
})

test('真实页面点击可收起提示，同一钱包取消后再次点击可以重新启动加载', t => {
  const state = setup(t)
  state.host.document.activeElement = state.frames['oceanpayment-iframe-applepay']
  state.host.dispatchEvent(new Event('blur'))
  t.mock.timers.tick(0)
  state.host.document.activeElement = state.host.document.body
  state.host.dispatchEvent(new Event('focus'))
  t.mock.timers.tick(0)
  state.pageEvent('pointerdown', state.host.document.body)
  assert.equal(state.left(), 1)
  state.host.dispatchEvent(new Event('blur'))
  state.host.document.activeElement = state.frames['oceanpayment-iframe-applepay']
  t.mock.timers.tick(0)
  assert.deepEqual(state.entered, ['APPLE_PAY', 'APPLE_PAY'])
  state.stop()
})
