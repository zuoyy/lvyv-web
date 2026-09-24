type WalletChannel = 'APPLE_PAY' | 'GOOGLE_PAY'

/** 跨域 iframe 不冒泡点击事件，仅观察焦点归属，不访问钱包文档或支付数据。 */
export function observeWalletInteraction(
  host: Window,
  onEnter: (channel: WalletChannel) => void,
  onLeave: () => void,
): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined
  let focusCheck: ReturnType<typeof setTimeout> | undefined
  let disposed = false
  let entered: WalletChannel | undefined
  const frames = [
    ['oceanpayment-iframe-applepay', 'APPLE_PAY'],
    ['oceanpayment-iframe-googlepay', 'GOOGLE_PAY'],
  ] as const
  const channelFor = (element: EventTarget | null) => frames.find(([id]) =>
    element !== null && element === host.document.getElementById(id))?.[1]
  const inspectFocus = () => {
    if (disposed) return
    const channel = channelFor(host.document.activeElement)
    if (channel && channel !== entered) {
      entered = channel
      onEnter(channel)
    }
    if (!channel) entered = undefined
    // 原生钱包弹窗可能令 activeElement 暂时变成 body；窗口焦点变化不等于用户取消。
  }
  const scheduleInspection = () => {
    if (timer) clearTimeout(timer)
    // 各浏览器更新 activeElement 的时机不同，下一任务再确认焦点实际进入哪个 iframe。
    timer = setTimeout(inspectFocus, 0)
  }
  const onWindowBlur = () => {
    // 原生授权窗可能在同一点击任务中再次转移焦点，先保留当前能观察到的 iframe 归属。
    inspectFocus()
    scheduleInspection()
    if (focusCheck) clearTimeout(focusCheck)
    // Safari 等宿主可能在下一任务后才把焦点转入 iframe，再进行一次有界检查。
    focusCheck = setTimeout(inspectFocus, 100)
  }
  const onPageInteraction = (event: Event) => {
    if (disposed) return
    const target = event.target
    if (channelFor(target)) {
      scheduleInspection()
      return
    }
    // 仅页面内的实际点击/键盘焦点移动能收起尚未确认的提示，body 的焦点回落不算。
    if (!target || target === host.document || (event.type === 'focusin'
      && (target === host.document.body || target === host.document.documentElement))) return
    entered = undefined
    onLeave()
  }
  host.addEventListener('blur', onWindowBlur)
  host.addEventListener('focus', scheduleInspection)
  host.document.addEventListener('focusin', onPageInteraction)
  host.document.addEventListener('pointerdown', onPageInteraction, true)
  return () => {
    disposed = true
    if (timer) clearTimeout(timer)
    if (focusCheck) clearTimeout(focusCheck)
    host.removeEventListener('blur', onWindowBlur)
    host.removeEventListener('focus', scheduleInspection)
    host.document.removeEventListener('focusin', onPageInteraction)
    host.document.removeEventListener('pointerdown', onPageInteraction, true)
  }
}
