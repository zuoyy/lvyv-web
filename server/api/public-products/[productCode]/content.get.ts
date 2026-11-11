import type { PublicProductContent } from '~~/shared/types/publicProducts'
export default defineEventHandler(event => {
  const code = getRouterParam(event, 'productCode') || ''
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(code)) throw createError({ statusCode: 404 })
  setHeader(event, 'Cache-Control', 'no-store')
  return publicProductData<PublicProductContent>(event, code, `${encodeURIComponent(code)}/content`)
})
