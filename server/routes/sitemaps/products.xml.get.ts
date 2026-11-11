import type { ProductManifest } from '~~/shared/types/publicProducts'
import { publicProductData } from '../../utils/publicProducts'
const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
export default defineEventHandler(async event => {
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'no-cache, max-age=0, s-maxage=30')
  // Runtime SSR must not announce content that has not passed static publication.
  const manifest = useRuntimeConfig(event).productSnapshot
    ? await publicProductData<ProductManifest>(event, 'manifest', 'manifest') : { products: [] }
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${manifest.products.filter(product => product.indexable).map(product => `<url><loc>https://www.lvyv.com/encounters/${escape(encodeURIComponent(product.productCode))}</loc>${product.updatedAt ? `<lastmod>${escape(product.updatedAt)}</lastmod>` : ''}</url>`).join('')}</urlset>`
})
