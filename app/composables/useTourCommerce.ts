export interface Entitlement {
  id: number
  orderItemId: number
  memberId: number
  entitlementType: 'STANDARD_PRODUCT' | 'CUSTOM_ITINERARY'
  standardProductVersionId?: number
  customItineraryVersionId?: number
  quantity: number
  status: string
  grantedTime: string
  standardProduct?: EntitledStandardProduct
}

export interface EntitledStandardProduct {
  productId: number
  productCode: string
  currentVersionId?: number
  versionId: number
  versionNo: number
  versionStatus: string
  title: string
  cityCode: string
  coverImageUrl?: string
  dateText?: string
  designerMessage?: string
  summary?: string
  deliveryNote?: string
  days: Array<{
    id: number
    dayNo: number
    title: string
    summary?: string
    sort: number
    items: Array<{
      id: number
      projectType: string
      title: string
      subtitle?: string
      address?: string
    }>
  }>
}

export interface ContentView {
  content: {
    id: number
    title: string
    cityCode: string
    coverImageUrl?: string
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
    subtitle?: string
    description?: string
    tip?: string
    tags?: string[]
    address?: string
    sort: number
  }>
}

export interface StandardProductView {
  product: { id: number; productCode: string; currentVersionId?: number }
  version: { id: number; versionNo: number; status: string; publishedTime?: string }
  content: ContentView
}

export interface CustomItineraryView {
  itinerary: { id: number; wishId: number; memberId: number; status: string; deliveredTime?: string }
  version?: { id: number; versionNo: number; status: string; deliveredTime?: string }
  content?: ContentView
  wishNo?: string
  wishStatus?: string
  wishStatusLabel?: string
  customItineraryStatusLabel?: string
}

export interface OrderSnapshot {
  title: string
  skuCode?: string
  productCode?: string
  productVersionNo?: number
  currency: string
  unitPrice: string | number
  listUnitPrice?: string | number
  saleUnitPrice?: string | number
  promotionCampaignNo?: string
  promotionCampaignName?: string
  couponNo?: string
  couponDiscountAmount?: string | number
  contentSummary?: string
}

export interface OrderView {
  order: { id: number; orderNo: string; status: string; currency: string; subtotal: string | number; promotionDiscountAmount: string | number; couponDiscountAmount: string | number; discountAmount: string | number; totalAmount: string | number; createTime?: string }
  items: Array<{ item: { id: number; itemType: string; fulfillmentStatus: string; quantity: number; listUnitPrice?: string | number; unitPrice: string | number; promotionDiscountAmount?: string | number; wishId?: number; customItineraryId?: number }; snapshot?: OrderSnapshot }>
  entitlements: Entitlement[]
  coupon?: { couponNo: string; discountType: string; discountValue: string | number; discountAmount: string | number; status: string }
}

export interface SkuView {
  sku: { id: number; skuCode: string; skuType: string; standardProductVersionId?: number; status: string }
  price?: { currency: string; listPrice: string | number; salePrice: string | number }
  pricing?: { listUnitPrice: string | number; saleUnitPrice: string | number; promotionItem?: { salePrice: string | number; listPrice?: string | number }; promotionCampaign?: { endTime: string; name: string; campaignNo?: string } }
}

export interface MemberCouponView {
  coupon: { id: number; couponNo: string; status: string; validFrom: string; validTo: string }
  template: { name: string; discountType: string; discountValue: string | number; maxDiscountAmount?: string | number; minimumOrderAmount: string | number; currency: string }
}

export interface OrderPricingQuote {
  skuId: number
  quantity: number
  currency: string
  listUnitPrice: string | number
  saleUnitPrice: string | number
  listSubtotal: string | number
  promotionDiscountAmount: string | number
  saleSubtotal: string | number
  couponDiscountAmount: string | number
  discountAmount: string | number
  pointsAmount: string | number
  taxAmount: string | number
  totalAmount: string | number
}

export interface CustomOfferView {
  id: number
  offerNo: string
  wishId: number
  customItineraryId: number
  skuId: number
  status: 'SENT' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED' | string
  currency: string
  subtotal: string | number
  discountAmount: string | number
  taxAmount: string | number
  totalAmount: string | number
  validUntil?: string
  offerSnapshotJson?: string
  acceptedOrderId?: number
  createTime?: string
}

export const useTourCommerce = () => {
  const auth = useMemberAuth()

  return {
    listEntitlements: () => auth.request<Entitlement[]>('/commerce/entitlements', undefined, 'GET'),
    listCustomItineraries: () => auth.request<CustomItineraryView[]>('/tour/my-itineraries', undefined, 'GET'),
    getStandardVersion: (versionId: number) => auth.request<StandardProductView>(`/tour/catalog/standard-products/${versionId}`, undefined, 'GET'),
    listStandardCatalog: () => auth.request<SkuView[]>('/commerce/catalog/standard-products', undefined, 'GET'),
    listCoupons: () => auth.request<MemberCouponView[]>('/commerce/coupons?status=AVAILABLE', undefined, 'GET'),
    redeemCoupon: (redeemCode: string) => auth.request<MemberCouponView>('/commerce/coupons/redeem', { redeemCode }),
    previewStandardOrder: (skuId: number, quantity = 1, memberCouponId?: number) => auth.request<OrderPricingQuote>('/commerce/orders/standard/preview', { skuId, quantity, currency: 'USD', memberCouponId }),
    createStandardOrder: (skuId: number, quantity = 1, memberCouponId?: number) => auth.request<OrderView>('/commerce/orders/standard', { skuId, quantity, currency: 'USD', memberCouponId }),
    listOrders: () => auth.request<OrderView[]>('/commerce/orders', undefined, 'GET'),
    listCustomOffers: () => auth.request<CustomOfferView[]>('/commerce/custom-offers', undefined, 'GET'),
    getOrder: (orderNo: string) => auth.request<OrderView>(`/commerce/orders/${encodeURIComponent(orderNo)}`, undefined, 'GET'),
    getOffer: (offerNo: string) => auth.request<CustomOfferView>(`/commerce/custom-offers/${encodeURIComponent(offerNo)}`, undefined, 'GET'),
    acceptOffer: (offerNo: string) => auth.request<OrderView>(`/commerce/custom-offers/${encodeURIComponent(offerNo)}/accept`),
    cancelOrder: (orderNo: string) => auth.request<OrderView>(`/commerce/orders/${encodeURIComponent(orderNo)}/cancel`),
    confirmOrderCompletion: (orderNo: string) => auth.request<OrderView>(`/commerce/orders/${encodeURIComponent(orderNo)}/confirm-completion`),
  }
}
