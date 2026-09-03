export interface Entitlement {
  id: number
  orderItemId: number
  memberId: number
  entitlementType: 'STANDARD_ITINERARY' | 'CUSTOM_ITINERARY'
  standardItineraryVersionId?: number
  customItineraryVersionId?: number
  adultCount: number
  childCount: number
  startDate?: string
  endDate?: string
  status: string
  grantedTime: string
}

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

export interface StandardItineraryView {
  product: { id: number; itineraryCode: string; currentVersionId?: number }
  version: { id: number; versionNo: number; status: string; publishedTime?: string }
  content: ContentView
}

export interface CatalogProductView {
  product: { id: number; productCode: string; name: string; summary?: string; cityCode: string; travelType?: string; guaranteedDeparture?: boolean; shoppingPolicy?: string; adultAgeLabel?: string; childAgeLabel?: string; minimumAdvanceDays?: number; priceNote?: string; standardItineraryVersionId: number; status: string }
  themes: string[]
  serviceLanguages: string[]
  price?: { currency: string; tiers: Array<{ minTravelerCount: number; maxTravelerCount?: number | null; adultListPrice: string | number; adultSalePrice: string | number; childListPrice: string | number; childSalePrice: string | number }> }
  pricing: { adultListUnitPrice: string | number; adultSaleUnitPrice: string | number; childListUnitPrice: string | number; childSaleUnitPrice: string | number; promotionCampaign?: { endTime: string; name: string; campaignNo?: string } }
  itinerary: {
    standardItineraryId: number
    itineraryCode: string
    standardItineraryStatus: string
    currentPublishedVersionId?: number
    versionId: number
    versionNo: number
    contentId: number
    versionStatus: string
    title: string
    cityCode: string
    imageUrls: string[]
    dateText?: string
    designerMessage?: string
    summary?: string
    deliveryNote?: string
    days: Array<{ id: number; dayNo: number; title: string; summary?: string; sort: number; items: Array<Record<string, unknown> & { tagGroups?: ItineraryTagGroupView[] }> }>
  }
}

// The encounter detail page and checkout request the same catalog payload in
// the normal booking flow. Reuse it briefly so navigation does not fetch and
// parse the large itinerary response twice.
const catalogProductCache = new Map<string, { value: CatalogProductView; expiresAt: number }>()
const catalogProductRequests = new Map<string, Promise<CatalogProductView>>()
const CATALOG_CACHE_TTL_MS = 2 * 60 * 1000

export interface CatalogProductListView {
  id: number
  productCode: string
  name: string
  summary?: string
  travelType?: string
  themes: string[]
  serviceLanguages: string[]
  guaranteedDeparture: boolean
  shoppingPolicy?: string
  priceNote?: string
  standardItineraryVersionId: number
  itineraryCode: string
  itineraryVersionId: number
  itineraryTitle: string
  cityCode: string
  imageUrls: string[]
  dateText?: string
  dayCount: number
  currency: string
  lowestAdultListPrice: string | number
  lowestAdultSalePrice: string | number
  pricingMode?: string
  tiers?: Array<{ minTravelerCount: number; maxTravelerCount?: number | null; adultSalePrice: string | number; childSalePrice: string | number }>
  promoted: boolean
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

export interface OrderSnapshot {
  title: string
  productCode?: string
  productVersionNo?: number
  adultCount?: number
  childCount?: number
  currency: string
  adultListUnitPrice: string | number
  adultUnitPrice: string | number
  childListUnitPrice: string | number
  childUnitPrice: string | number
  promotionCampaignNo?: string
  promotionCampaignName?: string
  couponNo?: string
  couponDiscountAmount?: string | number
  contentSummary?: string
}

export interface OrderView {
  order: { id: number; orderNo: string; status: string; currency: string; sourceType: string; subtotal: string | number; promotionDiscountAmount: string | number; couponDiscountAmount: string | number; discountAmount: string | number; pointsAmount: string | number; pointsPerUsdSnapshot?: number; pointsTransactionNo?: string; pointsRefundTransactionNo?: string; taxAmount: string | number; manualAdjustmentAmount: string | number; totalAmount: string | number; createTime?: string }
  items: Array<{ item: { id: number; itemType: string; adultCount: number; childCount: number; adultListUnitPrice: string | number; adultUnitPrice: string | number; childListUnitPrice: string | number; childUnitPrice: string | number; promotionDiscountAmount?: string | number; taxAmount?: string | number; startDate?: string; endDate?: string; customItineraryId?: number; customItineraryVersionId?: number; itineraryInstanceId?: number }; snapshot?: OrderSnapshot; itineraryNo?: string }>
  entitlements: Entitlement[]
  coupon?: { couponNo: string; discountType: string; discountValue: string | number; discountAmount: string | number; status: string }
  activeOnlinePayment: boolean
  originalPayableAmount: string | number
}

export type PaymentChannel = 'CREDIT_CARD' | 'WECHAT_PAY' | 'ALIPAY'
export type PaymentStatus = 'CREATED' | 'PENDING' | 'UNKNOWN' | 'SUCCEEDED' | 'FAILED' | 'EXPIRED' | 'REVIEW_REQUIRED'
export interface PaymentChannelView { channel: PaymentChannel; name: string; enabled: boolean }
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
  session?: { sdkUrl: string; sandbox: boolean; fields: Record<string, string>; threeDsUrl?: string | null }
}

export interface MemberCouponView {
  coupon: { id: number; couponNo: string; status: string; validFrom: string; validTo: string }
  template: { name: string; discountType: string; discountValue: string | number; maxDiscountAmount?: string | number; minimumOrderAmount: string | number; currency: string }
}

export interface OrderPricingQuote {
  productId: number
  adultCount: number
  childCount: number
  travelerCount: number
  currency: string
  adultListUnitPrice: string | number
  adultSaleUnitPrice: string | number
  childListUnitPrice: string | number
  childSaleUnitPrice: string | number
  adultSubtotal: string | number
  childSubtotal: string | number
  listSubtotal: string | number
  promotionDiscountAmount: string | number
  saleSubtotal: string | number
  couponDiscountAmount: string | number
  discountAmount: string | number
  pointsAmount: string | number
  taxAmount: string | number
  totalAmount: string | number
  redemption?: PointsRedemptionQuote
}
export interface PointsRedemptionConfig { id: number; pointsPerUsd: number; version: number; updateTime?: string }
export interface PointsEarnRule { ruleCode: 'PAYMENT_SUCCESS' | 'ITINERARY_COMPLETED'; points: number }
export interface PointsRedemptionQuote { availablePoints: number; requestedPoints: number; usablePoints: number; pointsAmount: string | number; payableBeforePoints: string | number; payableAfterPoints: string | number; pointsPerUsd: number; configVersion: number }

export interface CustomOfferView {
  id: number
  offerNo: string
  memberId: number
  customItineraryId: number
  customItineraryVersionId?: number
  serviceCode: string
  status: 'SENT' | 'ACCEPTED' | 'REVISION_REQUESTED' | 'EXPIRED' | 'CANCELLED' | string
  currency: string
  tiers: Array<{ id?: number; minTravelerCount: number; maxTravelerCount?: number | null; adultListPrice: string | number; adultSalePrice: string | number; childListPrice: string | number; childSalePrice: string | number }>
  validUntil?: string
  offerSnapshotJson?: string
  acceptedOrderId?: number
  createTime?: string
}

export interface CustomOfferQuote {
  selectedTier: CustomOfferView['tiers'][number]
  adultCount: number
  childCount: number
  travelerCount: number
  currency: string
  adultListUnitPrice: string | number
  adultSaleUnitPrice: string | number
  childListUnitPrice: string | number
  childSaleUnitPrice: string | number
  adultSubtotal: string | number
  childSubtotal: string | number
  listSubtotal: string | number
  discountAmount: string | number
  totalAmount: string | number
  redemption?: PointsRedemptionQuote
}

export interface TourConfirmationView {
  customItineraryId: number
  itineraryNo: string
  sourceType: 'WISH' | 'MANUAL'
  customItineraryVersionId: number
  versionNo: number
  wishId?: number
  wishNo?: string
  memberId: number
  wishStatus?: string
  customItineraryStatus: string
  versionStatus: string
  content?: { content?: ContentView['content']; days?: ContentView['days']; items?: ContentView['items'] }
  startDate?: string
  endDate?: string
  adultCount?: number
  childCount?: number
  travelerCount?: number
}

export interface CustomOfferConfirmationView { offer: CustomOfferView; itinerary: TourConfirmationView; canConfirm: boolean; canRequestRevision: boolean }

export const useTourCommerce = () => {
  const auth = useMemberAuth()

  const getCatalogProduct = (productCode: string) => {
    const key = productCode.trim()
    const cached = catalogProductCache.get(key)
    if (cached && cached.expiresAt > Date.now()) return Promise.resolve(cached.value)

    const pending = catalogProductRequests.get(key)
    if (pending) return pending

    const request = auth.publicRequest<CatalogProductView>(`/commerce/catalog/products/${encodeURIComponent(key)}`, 'GET', 8000)
      .then((value) => {
        catalogProductCache.set(key, { value, expiresAt: Date.now() + CATALOG_CACHE_TTL_MS })
        return value
      })
      .finally(() => {
        catalogProductRequests.delete(key)
      })
    catalogProductRequests.set(key, request)
    return request
  }

  return {
    listItineraries: () => auth.request<ItineraryInstance[]>('/tour/itineraries', undefined, 'GET'),
    getItinerary: (itineraryNo: string) => auth.request<ItineraryInstance>(`/tour/itineraries/${encodeURIComponent(itineraryNo)}`, undefined, 'GET'),
    listCatalogProducts: (cityCode?: string) => auth.publicRequest<CatalogProductListView[]>(`/commerce/catalog/products${cityCode ? `?cityCode=${encodeURIComponent(cityCode)}` : ''}`, 'GET', 8000),
    getCatalogProduct,
    listCoupons: () => auth.request<MemberCouponView[]>('/commerce/coupons?status=AVAILABLE', undefined, 'GET'),
    redeemCoupon: (redeemCode: string) => auth.request<MemberCouponView>('/commerce/coupons/redeem', { redeemCode }),
    getPointsAccount: () => auth.request<{ availablePoints: number }>('/points/account', undefined, 'GET'),
    getPointsRedemptionConfig: () => auth.request<PointsRedemptionConfig>('/points/redemption-config', undefined, 'GET'),
    getPointsEarnRules: () => auth.publicRequest<PointsEarnRule[]>('/points/earn-rules', 'GET', 8000),
    previewStandardOrder: (productCode: string, adultCount: number, childCount: number, startDate: string, memberCouponId?: number, requestedPoints = 0) => auth.request<OrderPricingQuote>('/commerce/orders/standard/preview', { productCode, adultCount, childCount, currency: 'USD', startDate, memberCouponId, requestedPoints }),
    createStandardOrder: (productCode: string, adultCount: number, childCount: number, startDate: string, memberCouponId?: number, requestedPoints = 0, contact?: BillingDetails) => auth.request<OrderView>('/commerce/orders/standard', { productCode, adultCount, childCount, currency: 'USD', startDate, memberCouponId, requestedPoints, contact }),
    listOrders: () => auth.request<OrderView[]>('/commerce/orders', undefined, 'GET'),
    listCustomOffers: () => auth.request<CustomOfferView[]>('/commerce/custom-offers', undefined, 'GET'),
    getOrder: (orderNo: string) => auth.request<OrderView>(`/commerce/orders/${encodeURIComponent(orderNo)}`, undefined, 'GET'),
    getOffer: (offerNo: string) => auth.request<CustomOfferConfirmationView>(`/commerce/custom-offers/${encodeURIComponent(offerNo)}`, undefined, 'GET'),
    previewOffer: (offerNo: string, adultCount: number, childCount: number, requestedPoints = 0) => auth.request<CustomOfferQuote>(`/commerce/custom-offers/${encodeURIComponent(offerNo)}/quote?adultCount=${adultCount}&childCount=${childCount}&requestedPoints=${requestedPoints}`, undefined, 'GET'),
    confirmOffer: (offerNo: string, adultCount: number, childCount: number, requestedPoints = 0) => auth.request<OrderView>(`/commerce/custom-offers/${encodeURIComponent(offerNo)}/confirm`, { adultCount, childCount, requestedPoints }),
    requestRevision: (offerNo: string, requestContent: string) => auth.request(`/commerce/custom-offers/${encodeURIComponent(offerNo)}/request-revision`, { requestContent }),
    cancelOrder: (orderNo: string) => auth.request<OrderView>(`/commerce/orders/${encodeURIComponent(orderNo)}/cancel`),
    listPaymentChannels: () => auth.request<PaymentChannelView[]>('/commerce/payments/channels', undefined, 'GET'),
    createPayment: (orderNo: string, channel: PaymentChannel, clientType: 'DESKTOP_WEB' | 'MOBILE_WEB' | 'WECHAT_BROWSER', billing?: BillingDetails) =>
      auth.request<PaymentView>(`/commerce/orders/${encodeURIComponent(orderNo)}/payments`, { channel, clientType, billing }),
    getPayment: (paymentNo: string) => auth.request<PaymentView>(`/commerce/payments/${encodeURIComponent(paymentNo)}`, undefined, 'GET'),
  }
}
