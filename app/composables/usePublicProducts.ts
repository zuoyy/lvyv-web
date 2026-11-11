import type { ProductManifest, PublicProductContent, BookingSummary } from '~~/shared/types/publicProducts'

export const usePublicProducts = () => {
  const manifest = () => $fetch<ProductManifest>('/api/public-products/manifest')
  const content = (code: string) => $fetch<PublicProductContent>(`/api/public-products/${encodeURIComponent(code)}/content`)
  const booking = async (code: string, adultCount: number, childCount: number) => {
    const config = useRuntimeConfig()
    const response = await $fetch<{ code: number; data: BookingSummary }>(`${config.public.apiBase}/commerce/catalog/products/${encodeURIComponent(code)}/booking-summary`, {
      query: { adultCount, childCount }, headers: { 'Accept-Language': 'en-US' }, timeout: 10000, retry: 0
    })
    if (response.code !== 200) throw new Error('Could not refresh booking information.')
    return response.data
  }
  return { manifest, content, booking }
}
