export function isChineseActivityLanguage(language?: string | null): boolean {
  return !language || language === 'zh-CN'
}

export function activityPageLabels(language?: string | null) {
  return isChineseActivityLanguage(language) ? {
    serviceTag: '专属服务', serviceTitle: '专属高奢旅行顾问',
    serviceSubtitle: '长按识别下方二维码，开启一对一私享定制规划',
    contactLabel: '微信号：', copy: '复制', qrAlt: (name: string) => `${name}的联系二维码`, email: '邮箱',
    copiedContact: '微信号已复制到剪贴板', copyContactManually: '请长按微信号进行复制',
    recommendTag: '精选推荐', recommendTitle: '更多精选行程',
    recommendSubtitle: '探索更多专属高奢私享活动与秘境旅程', swipeHint: '左右滑动浏览',
    recommendBadge: '特邀私享', recommendPage: (page: number) => `切换到第${page}组推荐`,
    unavailableTitle: '活动已下线或不存在', unavailableDescription: '该运营活动已结束或链接无效，您可以返回官网探索更多精彩高奢旅程。',
    errorTitle: '活动暂时无法加载', errorDescription: '服务暂时不可用，请稍后刷新重试。', home: '前往官网首页',
    metaTitle: 'Lvyv 高奢旅行', metaDescription: 'Lvyv 专属高奢定制旅行',
  } : {
    serviceTag: 'EXCLUSIVE SERVICE', serviceTitle: 'Your Luxury Travel Advisor',
    serviceSubtitle: 'Scan the QR code below for one-to-one travel planning.',
    contactLabel: 'WhatsApp:', copy: 'Copy', qrAlt: (name: string) => `${name}'s contact QR code`, email: 'Email',
    copiedContact: 'WhatsApp contact copied', copyContactManually: 'Press and hold the WhatsApp contact to copy it',
    recommendTag: 'EXCLUSIVE RECOMMENDATION', recommendTitle: 'More Curated Journeys',
    recommendSubtitle: 'Discover more exclusive experiences and extraordinary destinations.', swipeHint: 'Swipe to explore',
    recommendBadge: 'Exclusive', recommendPage: (page: number) => `Go to recommendation group ${page}`,
    unavailableTitle: 'Activity unavailable', unavailableDescription: 'This activity has ended or the link is invalid. Visit our website to explore more luxury journeys.',
    errorTitle: 'Unable to load this activity', errorDescription: 'The service is temporarily unavailable. Please refresh and try again.', home: 'Visit our website',
    metaTitle: 'Lvyv Luxury Travel', metaDescription: 'Bespoke luxury journeys by Lvyv',
  }
}
