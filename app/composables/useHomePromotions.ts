import { nextTick } from 'vue'

export interface HomeAnnouncement {
  id: number
  version: number
  title?: string
  description?: string
  iconUrl?: string
  actionText?: string
  actionUrl?: string
}

export interface HomePopup {
  id: number
  version: number
  title?: string
  description?: string
  imageUrl?: string
  imageAlt?: string
  buttonText?: string
  buttonUrl?: string
}

export interface HomePromotions { announcement?: HomeAnnouncement; popup?: HomePopup }

const isSafeUrl = (value?: string) => {
  if (!value) return false
  if (value.startsWith('/') && !value.startsWith('//')) return true
  try { return new URL(value).protocol === 'https:' } catch { return false }
}

export function useHomePromotions() {
  const data = useState<HomePromotions | null>('home-promotions', () => null)
  const loaded = useState('home-promotions-loaded', () => false)
  const popup = useState<HomePopup | null>('home-promotion-popup', () => null)
  const popupOpen = useState('home-promotion-popup-open', () => false)
  const announcementDismissed = useState('home-announcement-dismissed', () => false)
  const activeLocale = useState('home-promotions-locale', () => 'en-US')
  const config = useRuntimeConfig()
  const load = async (locale = 'en-US') => {
    activeLocale.value = locale
    if (loaded.value) return data.value
    try {
      const response = await $fetch<{ code: number; data: HomePromotions }>(`${config.public.apiBase}/marketing/home/active`, { query: { locale } })
      if (response.code === 200) data.value = response.data || {}
    } catch { /* 运营接口不可用时保持首页可用 */ }
    loaded.value = true
    return data.value
  }
  const storageKey = (value: HomePopup) => `lvyv:home-popup-seen:${activeLocale.value}:${value.id}:${value.version}`
  const hasSeen = (value: HomePopup) => {
    if (!import.meta.client) return true
    try { return window.localStorage.getItem(storageKey(value)) === '1' } catch {
      try { return window.sessionStorage.getItem(storageKey(value)) === '1' } catch { return false }
    }
  }
  const markSeen = (value: HomePopup) => {
    if (!import.meta.client) return
    try { window.localStorage.setItem(storageKey(value), '1') } catch { try { window.sessionStorage.setItem(storageKey(value), '1') } catch {} }
  }
  const sendEvent = async (placement: 'ANNOUNCEMENT' | 'POPUP', value: HomeAnnouncement | HomePopup, eventType: 'IMPRESSION' | 'CLICK') => {
    try { await $fetch(`${config.public.apiBase}/marketing/home/events`, { method: 'POST', body: { placement, promotionId: value.id, version: value.version, eventType } }) } catch { /* 统计失败静默降级 */ }
  }
  const showPopupIfNeeded = async () => { const value = data.value?.popup; if (value && !hasSeen(value)) { popup.value = value; popupOpen.value = true; await nextTick(); markSeen(value); void sendEvent('POPUP', value, 'IMPRESSION') } }
  const closePopup = () => { popupOpen.value = false }
  const go = async (url?: string) => { if (!url || !isSafeUrl(url)) return; if (url.startsWith('/')) await navigateTo(url); else window.open(url, '_blank', 'noopener,noreferrer') }
  return { data, popup, popupOpen, announcementDismissed, load, showPopupIfNeeded, closePopup, go, sendEvent, isSafeUrl }
}
