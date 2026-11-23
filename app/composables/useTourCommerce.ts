export interface ContentView {
  content: {
    id: number
    title: string
    cityCode: string
    imageUrls: string[] | string
    dateText?: string
    designerMessage?: string
    summary?: string
    deliveryNote?: string
  }
  days: Array<{ id: number; dayNo: number; title: string; summary?: string; sort: number }>
  items: Array<{
    id: number
    dayId: number
    dayNo: number
    projectType: string
    title: string
    description?: string
    tip?: string
    tagGroups?: string | ItineraryTagGroupSnapshot[]
    address?: string
    startTime?: string
    endTime?: string
    timeText?: string
    projectImageUrls?: string[] | string
    sort: number
  }>
}

export interface ItineraryTagGroupSnapshot {
  groupCode: string
  groupLabels: Record<string, string>
  groupSort: number
  showOnItinerary: boolean
  tags: Array<{ sourceTagId?: number; code: string; labels: Record<string, string>; sort: number }>
}

export interface ItineraryTagGroupView {
  code: string
  label: string
  sort: number
  tags: Array<{ sourceTagId?: number; code: string; label: string; sort: number }>
}

export interface ItineraryInstance {
  id: number
  itineraryNo: string
  itineraryType: 'STANDARD_PURCHASE' | 'CUSTOM_SERVICE'
  sourceType: 'STANDARD_PRODUCT' | 'WISH' | 'MANUAL'
  sourceBusinessNo?: string
  memberId: number
  memberNickname?: string
  customItineraryId?: number
  wishId?: number
  wishNo?: string
  orderId?: number
  orderNo?: string
  entitlementId?: number
  standardItineraryVersionId?: number
  customItineraryVersionId?: number
  title: string
  cityCode?: string
  cityLabel?: string
  imageUrls?: string[]
  adultCount?: number
  childCount?: number
  travelerCount?: number
  startDate?: string
  endDate?: string
  designerNickname?: string
  versionNo?: number
  status: 'PLANNING' | 'WAITING_CONFIRMATION' | 'REVISION_REQUIRED' | 'REVISING' | 'WAITING_PAYMENT' | 'UPCOMING' | 'IN_PROGRESS' | 'FINISHED' | 'CLOSED' | 'CANCELLED'
  statusName: string
  createTime?: string
  deliveredTime?: string
  content?: ContentView
}

export interface AccountPage<T> { list: T[]; total: number; page: number; size: number }
export type ItinerarySummary = Omit<ItineraryInstance, 'content'> & { summary?: string; dateText?: string; dayCount: number }

export type PaymentChannel = 'GOOGLE_PAY' | 'APPLE_PAY' | 'CREDIT_CARD' | 'WECHAT_PAY' | 'ALIPAY'
export type PaymentStatus = 'CREATED' | 'PENDING' | 'UNKNOWN' | 'SUCCEEDED' | 'FAILED' | 'EXPIRED' | 'REVIEW_REQUIRED'
export interface PaymentChannelView { channel: PaymentChannel; name: string; enabled: boolean }
export interface PaymentChannelOptionView {
  channel: PaymentChannel
  name: string
  enabled: boolean
  sdkUrl: string
  sandbox: boolean
  initConfig: Record<string, unknown>
}
export interface PaymentOptionsView {
  activePayment?: PaymentView | null
  channels: PaymentChannelOptionView[]
}
export interface BillingDetails {
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
  state: string
  city?: string
  address?: string
  zip?: string
}
export interface PaymentView {
  orderNo?: string
  paymentNo: string
  provider: string
  channel: string
  methods?: string
  currency: string
  amount: string | number
  status: PaymentStatus
  providerPaymentId?: string
  redirectUrl?: string
  billingMasked?: string
  failureCode?: string
  failureMessage?: string
  paidTime?: string
  expireTime?: string
  createTime?: string
  updateTime?: string
  session?: { sdkUrl: string; sdkType: 'CREDIT_CARD' | 'GOOGLE_PAY' | 'APPLE_PAY'; sandbox: boolean; fields: Record<string, string>; initConfig: Record<string, unknown>; threeDsUrl?: string | null }
}

export const useTourCommerce = () => {
  const auth = useMemberAuth()
  return {
    getItinerary: (itineraryNo: string) => auth.request<ItineraryInstance>(`/tour/itineraries/${encodeURIComponent(itineraryNo)}`, undefined, 'GET'),
    pageItineraries: (page = 1, filter = 'all') => auth.request<AccountPage<ItinerarySummary>>(`/tour/itineraries/page?page=${page}&size=10&filter=${encodeURIComponent(filter)}`, undefined, 'GET'),
    listPaymentChannels: (clientType = 'DESKTOP_WEB') => auth.request<PaymentChannelView[]>(`/commerce/payments/channels?clientType=${encodeURIComponent(clientType)}`, undefined, 'GET'),
    createPayment: (orderNo: string, channel: PaymentChannel, clientType: 'DESKTOP_WEB' | 'MOBILE_WEB' | 'WECHAT_BROWSER') =>
      auth.request<PaymentView>(`/commerce/orders/${encodeURIComponent(orderNo)}/payments`, { channel, clientType }),
    currentOrderPayment: (orderNo: string) => auth.request<PaymentView | null>(`/commerce/orders/${encodeURIComponent(orderNo)}/payments/current`, undefined, 'GET'),
    getPaymentOptions: (orderNo: string, clientType = 'DESKTOP_WEB') =>
      auth.request<PaymentOptionsView>(`/commerce/orders/${encodeURIComponent(orderNo)}/payments/options?clientType=${encodeURIComponent(clientType)}`, undefined, 'GET'),
    issueEmbeddedSession: (paymentNo: string) => auth.request<PaymentView>(`/commerce/payments/${encodeURIComponent(paymentNo)}/embedded-session`, {}),
    abortEmbeddedSession: (paymentNo: string) => auth.request<PaymentView>(`/commerce/payments/${encodeURIComponent(paymentNo)}/embedded-session/abort`, {}),
    getPayment: (paymentNo: string) => auth.request<PaymentView>(`/commerce/payments/${encodeURIComponent(paymentNo)}`, undefined, 'GET'),
  }
}
