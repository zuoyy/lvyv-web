type TouchPayload = {
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  lvLink?: string
  referrerHost?: string
  clickIdType?: string
}

const sourceAliases: Record<string, string> = { ig: 'instagram', insta: 'instagram', fb: 'facebook', twitter: 'x' }

export const useMarketingAttribution = () => {
  const capture = async (query: Record<string, unknown> = {}) => {
    if (!import.meta.client) return
    const read = (key: string) => typeof query[key] === 'string' ? query[key] as string : ''
    const rawSource = read('utm_source').trim().toLowerCase()
    const payload: TouchPayload = {
      utmSource: sourceAliases[rawSource] || rawSource || undefined,
      utmMedium: read('utm_medium').trim() || undefined,
      utmCampaign: read('utm_campaign').trim() || undefined,
      utmContent: read('utm_content').trim() || undefined,
      lvLink: read('lv_link').trim() || undefined,
      clickIdType: read('fbclid') ? 'FBCLID' : read('gclid') ? 'GCLID' : read('ttclid') ? 'TTCLID' : undefined,
      referrerHost: document.referrer ? (() => {
        try {
          const hostname = new URL(document.referrer).hostname
          // 仅采集外部站点来源，站内路由跳转不应制造新的自然来源触点。
          return hostname && hostname !== window.location.hostname ? hostname : ''
        } catch { return '' }
      })() : undefined,
    }
    if (!payload.utmSource && !payload.lvLink && !payload.clickIdType && !payload.referrerHost) return
    const signature = JSON.stringify(payload)
    const storageKey = 'lvyv-marketing-touch:' + signature
    if (sessionStorage.getItem(storageKey)) return
    try {
      await $fetch('/web-api/marketing/attribution/touch', { method: 'POST', body: payload })
      sessionStorage.setItem(storageKey, '1')
    } catch {
      // 归因不可用不影响页面、注册或支付主流程。
    }
  }
  return { capture }
}
