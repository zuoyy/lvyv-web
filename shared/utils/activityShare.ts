import { LUXURY_ORIGIN } from './luxurySite.ts'
import { isChineseActivityLanguage } from './activityLocale.ts'

export interface ActivityShareData {
  url: string
  title: string
  description?: string
  imageUrl?: string
  language?: string | null
}

export type ActivitySharePlatform = 'wechat' | 'weibo' | 'qq' | 'whatsapp' | 'telegram' | 'facebook' | 'x' | 'linkedin' | 'reddit' | 'copy'

export function activityShareUrl(url: string): string {
  const pathname = new URL(url, LUXURY_ORIGIN).pathname.replace(/\/+$/, '')
  if (!/^\/activity\/[A-Za-z0-9_-]+$/.test(pathname)) throw new Error('Invalid activity URL')
  return `${LUXURY_ORIGIN}${pathname}`
}

export function activityShareLabels(language?: string | null) {
  return isChineseActivityLanguage(language) ? {
    share: '分享', journey: '分享此行程', title: '分享行程', close: '关闭', copy: '复制链接', link: '活动链接',
    copied: '链接已复制', manualCopy: '请长按链接或使用 Ctrl/Cmd+C 复制', system: '系统分享',
    shareFailed: '暂时无法分享，请复制链接', back: '返回分享平台', qr: '活动链接二维码',
    qrHint: '使用微信扫一扫打开，再分享给好友或朋友圈', wechatHint: '点击微信右上角菜单，分享给好友或朋友圈',
    loading: '正在生成二维码…', qrFailed: '二维码生成失败，请复制链接', retry: '重试',
    wechat: '微信', weibo: '微博',
  } : {
    share: 'Share', journey: 'Share this journey', title: 'Share this journey', close: 'Close', copy: 'Copy link', link: 'Activity link',
    copied: 'Link copied', manualCopy: 'Touch and hold the link or press Ctrl/Cmd+C to copy', system: 'Share via…',
    shareFailed: 'Unable to share. Please copy the link.', back: 'Back to sharing options', qr: 'Activity link QR code',
    qrHint: 'Scan with WeChat, then share with friends or Moments', wechatHint: 'Use the top-right WeChat menu to share with friends or Moments',
    loading: 'Generating QR code…', qrFailed: 'Unable to generate QR code. Please copy the link.', retry: 'Retry',
    wechat: 'WeChat', weibo: 'Weibo',
  }
}

export function activitySharePlatforms(language?: string | null): ActivitySharePlatform[] {
  const domestic: ActivitySharePlatform[] = ['wechat', 'weibo', 'qq']
  const overseas: ActivitySharePlatform[] = ['whatsapp', 'telegram', 'facebook', 'x', 'linkedin', 'reddit']
  return [...(isChineseActivityLanguage(language) ? [...domestic, ...overseas] : [...overseas, ...domestic]), 'copy']
}

export function activityPlatformUrl(platform: ActivitySharePlatform, data: ActivityShareData): string | null {
  const url = activityShareUrl(data.url)
  const title = data.title
  const endpoints: Partial<Record<ActivitySharePlatform, [string, Record<string, string>]>> = {
    weibo: ['https://service.weibo.com/share/share.php', { url, title, ...(data.imageUrl ? { pic: data.imageUrl } : {}) }],
    qq: ['https://connect.qq.com/widget/shareqq/index.html', { url, title, summary: data.description || '', pics: data.imageUrl || '' }],
    whatsapp: ['https://api.whatsapp.com/send', { text: `${title}\n${url}` }],
    telegram: ['https://t.me/share/url', { url, text: title }],
    facebook: ['https://www.facebook.com/sharer/sharer.php', { u: url }],
    x: ['https://x.com/intent/tweet', { url, text: title }],
    linkedin: ['https://www.linkedin.com/sharing/share-offsite/', { url }],
    reddit: ['https://www.reddit.com/submit', { url, title }],
  }
  const entry = endpoints[platform]
  return entry ? `${entry[0]}?${new URLSearchParams(entry[1])}` : null
}

export async function copyActivityLink(url: string, clipboard?: { writeText: (value: string) => Promise<void> }): Promise<boolean> {
  try {
    if (!clipboard) return false
    await clipboard.writeText(activityShareUrl(url))
    return true
  } catch { return false }
}

export async function shareActivityLink(
  data: ActivityShareData,
  share: (data: { title: string; url: string }) => Promise<void>,
): Promise<'shared' | 'cancelled' | 'failed'> {
  try {
    await share({ title: data.title, url: activityShareUrl(data.url) })
    return 'shared'
  } catch (error) {
    return typeof error === 'object' && error !== null && 'name' in error && error.name === 'AbortError' ? 'cancelled' : 'failed'
  }
}
