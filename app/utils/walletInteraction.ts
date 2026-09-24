type WalletChannel = 'APPLE_PAY' | 'GOOGLE_PAY'

/** 跨域 iframe 不冒泡点击事件，仅观察焦点归属，不访问钱包文档或支付数据。 */
export function observeWalletInteraction(
  host: Window,
  onEnter: (channel: WalletChannel) => void,
  onLeave: () => void,
): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined
  let disposed = false
  const inspectFocus = () => {
    if (disposed) return
    const active = host.document.activeElement
    const frames = [
      ['oceanpayment-iframe-applepay', 'APPLE_PAY'],
      ['oceanpayment-iframe-googlepay', 'GOOGLE_PAY'],
    ] as const
    const match = frames.find(([id]) => active !== null && active === host.document.getElementById(id))
    if (match) onEnter(match[1])
    else onLeave()
  }
  const scheduleInspection = () => {
    if (timer) clearTimeout(timer)
    // 各浏览器更新 activeElement 的时机不同，下一任务再确认焦点实际进入哪个 iframe。
    timer = setTimeout(inspectFocus, 0)
  }
  host.addEventListener('blur', scheduleInspection)
  host.addEventListener('focus', scheduleInspection)
  host.document.addEventListener('focusin', scheduleInspection)
  return () => {
    disposed = true
    if (timer) clearTimeout(timer)
    host.removeEventListener('blur', scheduleInspection)
    host.removeEventListener('focus', scheduleInspection)
    host.document.removeEventListener('focusin', scheduleInspection)
  }
}
