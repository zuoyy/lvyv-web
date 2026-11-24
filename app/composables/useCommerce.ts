export interface Specification { key: string; label: string; value: string }
export interface CatalogProduct {
  productCode: string; name: string; summary: string; coverUrl: string
  category: string
  landingPath: string; lowestPrice: number; currency: string
}
export interface CatalogSku { skuCode: string; name: string; price: number; specifications: Specification[] }
export interface CatalogDetail { product: CatalogProduct; skus: CatalogSku[] }
export interface StoreOrder {
  id: number; orderNo: string; status: 'PENDING_PAYMENT' | 'PAID' | 'CANCELLED' | 'REFUNDED'
  productName: string; productCode: string; skuName: string; skuCode: string
  currency: string; quantity: number; totalAmount: number; specifications: Specification[]
  email?: string; contactMasked?: string; note?: string; deliveryNote?: string
  deliveredTime?: string; expireTime: string; createTime: string; refundReason?: string
}
export interface CheckoutQuote { unitPrice: number; discountAmount: number; couponDiscountAmount: number; totalAmount: number }
export interface CheckoutCoupon {
  coupon: { id: number }
  template: { name: string; discountType: 'FIXED' | 'PERCENT'; discountValue: number; eligibilityType: string }
  eligibilityStatus: string
}
export const isChinaSimFirstOrderSku = (product: string, sku: string) => product === 'CHINA-SIM' && sku === 'SIM-02'
export const maxOrderQuantity = 10
export const checkoutPath = (product: string, sku: string, quantity = 1) =>
  '/checkout?' + new URLSearchParams({ product, sku, quantity: String(quantity) })
export const usd = (price: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)

export const useCommerce = () => {
  const auth = useMemberAuth()
  return {
    products: () => auth.publicRequest<CatalogProduct[]>('/commerce/catalog/products', 'GET', 8000),
    product: (code: string) => auth.publicRequest<CatalogDetail>(`/commerce/catalog/products/${encodeURIComponent(code)}`, 'GET', 8000),
    quote: (productCode: string, skuCode: string, quantity: number, memberCouponId?: number) =>
      auth.request<CheckoutQuote>('/commerce/orders/quote', { productCode, skuCode, quantity, memberCouponId }),
    listCoupons: () => auth.request<CheckoutCoupon[]>('/commerce/coupons?status=AVAILABLE', undefined, 'GET'),
    redeemCoupon: (redeemCode: string) => auth.request<CheckoutCoupon>('/commerce/coupons/redeem', { redeemCode }),
    create: (request: Record<string, unknown>) => auth.request<{ orderNo?: string; currentAmount?: number }>('/commerce/orders', request),
    orders: (page: number, filter: string) => auth.request<{ list: StoreOrder[]; total: number }>(
      `/commerce/orders/page?page=${page}&filter=${encodeURIComponent(filter)}`, undefined, 'GET'),
    order: (orderNo: string) => auth.request<StoreOrder>(`/commerce/orders/${encodeURIComponent(orderNo)}`, undefined, 'GET'),
    cancel: (orderNo: string) => auth.request<StoreOrder>(`/commerce/orders/${encodeURIComponent(orderNo)}/cancel`, {}),
  }
}
