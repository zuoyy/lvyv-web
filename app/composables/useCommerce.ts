export interface Specification { key: string; label: string; value: string }
export interface CatalogProduct {
  productCode: string; name: string; summary: string; coverUrl: string
  category: string
  landingPath: string; lowestPrice: number; currency: string
}
export interface CatalogExperienceAddOn {
  productCode: string; name: string; summary: string | null; coverUrl: string
  skuCode?: string; skuName?: string
  price: number; addOnPrice: number
}
export interface CatalogSku { skuCode: string; name: string; price: number; specifications: Specification[] }
export interface CatalogDetail { product: CatalogProduct; skus: CatalogSku[] }
export interface BundlePackage { productCode: string; skuCode: string; examinations?: string[] }
export interface BundleCart { primary: BundlePackage; addOns: BundlePackage[]; quantity: number; memberCouponId?: number }
export interface BundleLine extends BundlePackage {
  productName: string; skuName: string; unitPrice: number; quantity: number; addOn: boolean; specifications: Specification[]
}
export interface BundleQuote {
  lines: BundleLine[]; subtotal: number; bundleDiscountAmount: number; couponDiscountAmount: number; totalAmount: number; priceKey: string
}
export interface CreateBundleOrder {
  cart: BundleCart; priceKey: string; checkoutRequestId: string; requestedTravelDate: string; contact: Record<string, string>; note?: string
}
export interface StoreOrder {
  id: number; orderNo: string; status: 'PENDING_PAYMENT' | 'PAID' | 'CANCELLED' | 'REFUNDED'
  productName: string; productCode: string; skuName: string; skuCode: string
  currency: string; quantity: number; totalAmount: number; specifications: Specification[]
  email?: string; contactMasked?: string; note?: string; deliveryNote?: string
  requestedTravelDate?: string | null; confirmedTravelDate?: string | null
  deliveredTime?: string; expireTime: string; createTime: string; refundReason?: string
  items?: BundleLine[]
}
export interface CheckoutQuote { unitPrice: number; discountAmount: number; couponDiscountAmount: number; totalAmount: number }
export interface CheckoutCoupon {
  coupon: { id: number }
  template: { name: string; discountType: 'FIXED' | 'PERCENT'; discountValue: number; eligibilityType: string }
  eligibilityStatus: string
}
export const isChinaSimFirstOrderSku = (product: string, sku: string) => product === 'CHINA-SIM' && sku === 'SIM-02'
export const maxOrderQuantity = 10
export const isEncounterCode = (code: string) => /^ENC-(?:BJ|XA)-/i.test(code)
export const validOrderQuantity = (code: string, quantity: number) =>
  Number.isInteger(quantity) && quantity >= 1 && quantity <= (isEncounterCode(code) ? 2_147_483_647 : maxOrderQuantity)
export const checkoutPath = (product: string, sku: string, quantity = 1) =>
  '/checkout?' + new URLSearchParams({ product, sku, quantity: String(quantity) })
export function bundleCheckoutPath(primary: BundlePackage, addOns: BundlePackage[]) {
  const query = new URLSearchParams({ product: primary.productCode, sku: primary.skuCode })
  for (const item of addOns) query.append('addOn', item.productCode + ':' + item.skuCode)
  return '/checkout?' + query
}
export const usd = (price: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)

export interface CreateStoreOrder {
  productCode: string
  skuCode: string
  quantity: number
  confirmedAmount: number
  contact: Record<string, string>
  note?: string
  requestedTravelDate?: string
  checkoutRequestId: string
  memberCouponId?: number
  confirmedCouponDiscountAmount?: number
}

export const useCommerce = () => {
  const auth = useMemberAuth()
  return {
    products: () => auth.publicRequest<CatalogProduct[]>('/commerce/catalog/products', 'GET', 8000),
    experienceAddOns: (cityCode: string, excludeProductCode: string) => {
      const query = new URLSearchParams({ cityCode, excludeProductCode })
      return auth.publicRequest<CatalogExperienceAddOn[]>(`/commerce/catalog/products/add-ons?${query}`, 'GET', 8000)
    },
    product: (code: string) => auth.publicRequest<CatalogDetail>(`/commerce/catalog/products/${encodeURIComponent(code)}`, 'GET', 8000),
    quote: (productCode: string, skuCode: string, quantity: number, memberCouponId?: number) =>
      auth.request<CheckoutQuote>('/commerce/orders/quote', { productCode, skuCode, quantity, memberCouponId }),
    listCoupons: () => auth.request<CheckoutCoupon[]>('/commerce/coupons?status=AVAILABLE', undefined, 'GET'),
    redeemCoupon: (redeemCode: string) => auth.request<CheckoutCoupon>('/commerce/coupons/redeem', { redeemCode }),
    create: (request: CreateStoreOrder) => auth.request<{ orderNo?: string; currentAmount?: number }>('/commerce/orders', { ...request }),
    quoteBundle: (cart: BundleCart) => auth.request<BundleQuote>('/commerce/orders/bundle/quote', { ...cart }),
    createBundle: (request: CreateBundleOrder) =>
      auth.request<{ orderNo?: string; currentAmount?: number }>('/commerce/orders/bundle', { ...request }),
    orders: (page: number, filter: string) => auth.request<{ list: StoreOrder[]; total: number }>(
      `/commerce/orders/page?page=${page}&filter=${encodeURIComponent(filter)}`, undefined, 'GET'),
    order: (orderNo: string) => auth.request<StoreOrder>(`/commerce/orders/${encodeURIComponent(orderNo)}`, undefined, 'GET'),
    cancel: (orderNo: string) => auth.request<StoreOrder>(`/commerce/orders/${encodeURIComponent(orderNo)}/cancel`, {}),
  }
}
