import type { ProductManifest } from '~~/shared/types/publicProducts'
export default defineEventHandler(event => {
  setHeader(event, 'Cache-Control', 'no-store')
  return publicProductData<ProductManifest>(event, 'manifest', 'manifest')
})
