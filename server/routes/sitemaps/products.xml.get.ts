import { encounterProductPath, encounterProducts } from '../../../shared/utils/encounterProducts'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const response = await $fetch<{ code: number; data: { landingPath: string }[] }>(config.contentApiBase + '/commerce/catalog/products')
  if (![0, 200].includes(response.code)) throw createError({ statusCode: 502, statusMessage: 'Product catalog unavailable' })
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'no-cache')
  const drafts = new Set(encounterProducts.filter(product => !product.ready).map(encounterProductPath))
  const urls = response.data.filter(product => !drafts.has(product.landingPath)).map(product => '<url><loc>https://www.lvyv.com' + product.landingPath + '</loc></url>')
  return '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + urls.join('') + '</urlset>'
})
