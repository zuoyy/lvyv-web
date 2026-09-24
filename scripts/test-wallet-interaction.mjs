import assert from 'node:assert/strict'
import test from 'node:test'
import { observeWalletInteraction } from '../app/utils/walletInteraction.ts'

function setup(t) {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const frames = Object.fromEntries(['applepay', 'googlepay', 'card'].map(name => [`oceanpayment-iframe-${name}`, {}]))
  const host = new EventTarget()
  host.document = Object.assign(new EventTarget(), { activeElement: null, getElementById: id => frames[id] || null })
  const entered = []
  let left = 0
  const stop = observeWalletInteraction(host, channel => entered.push(channel), () => left++)
  return { host, frames, entered, stop, left: () => left }
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
  assert.equal(state.left(), 2)
  state.stop()
})

test('返回普通页面元素时清除仅由焦点触发的连接提示', t => {
  const state = setup(t)
  state.host.document.activeElement = state.frames['oceanpayment-iframe-applepay']
  state.host.dispatchEvent(new Event('blur'))
  t.mock.timers.tick(0)
  state.host.document.activeElement = {}
  state.host.document.dispatchEvent(new Event('focusin'))
  t.mock.timers.tick(0)
  assert.deepEqual(state.entered, ['APPLE_PAY'])
  assert.equal(state.left(), 1)
  state.stop()
})

test('离开支付页时取消待执行检查并移除监听，避免残留遮罩', t => {
  const state = setup(t)
  state.host.document.activeElement = state.frames['oceanpayment-iframe-googlepay']
  state.host.dispatchEvent(new Event('blur'))
  state.stop()
  t.mock.timers.tick(0)
  state.host.dispatchEvent(new Event('blur'))
  state.host.document.dispatchEvent(new Event('focusin'))
  t.mock.timers.tick(0)
  assert.deepEqual(state.entered, [])
})
