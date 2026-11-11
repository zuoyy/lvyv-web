export interface FirstOrderPromotion { id: number; name: string; discountPercent: number; maxDiscountAmount: number; totalQuota: number; availableQuota: number; endTime: string; status: string; allProducts: boolean; catalogProductIds: number[] }
export interface ProductPresentation {
  seoTitle?: string; seoDescription?: string; shareImageObjectKey?: string; shareImageAlt?: string
  indexable: boolean; answerSummary?: string; highlights: string[]; suitableFor: string[]; unsuitableFor: string[]
  included: string[]; excluded: string[]; meetingPoint?: string; endingPoint?: string; transport?: string
  accessibility?: string; cancellationPolicy?: string; faq: Array<{ question: string; answer: string }>
  lastReviewedDate?: string
}
export interface ProductEntry {
  productCode: string; name: string; summary?: string; cityCode: string; cityLabel: string
  dayCount: number; indexable: boolean; contentVersion: number; updatedAt: string | null
}
export interface ProductManifest { version: number; products: ProductEntry[] }
export interface PublicProductContent {
  contentVersion: number; updatedAt: string | null; product: { id: number; productCode: string; name: string; summary?: string; cityCode: string; travelType?: string; guaranteedDeparture: boolean; shoppingPolicy?: string; adultAgeLabel?: string; childAgeLabel?: string; minimumAdvanceDays: number; priceNote?: string }; themes: string[]
  serviceLanguages: string[]; itinerary: { title: string; cityCode: string; imageUrls: string[]; dateText?: string; designerMessage?: string; summary?: string; days: Array<{ dayNo: number; title: string; summary?: string; items: Array<{ title: string; description?: string; address?: string; projectType?: string; startTime?: string; endTime?: string; timeText?: string; projectImageUrls: string[]; tagGroups: Array<{ code: string; label: string; tags: Array<{ code: string; label: string }> }> }> }> }; presentation: ProductPresentation
  shareImageUrl?: string
}
export interface BookingTier {
  minTravelerCount: number; maxTravelerCount?: number | null; adultListPrice: number; adultSalePrice: number
  childListPrice: number; childSalePrice: number
}
export interface BookingSummary {
  available: boolean; currency: string; minimumAdvanceDays: number; tiers: BookingTier[]
  selectedTier?: BookingTier | null; promotionEndsAt?: string; firstOrderPromotion?: FirstOrderPromotion | null
}
