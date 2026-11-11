import type { H3Event } from 'h3'

// Static builds read one verified snapshot; runtime SSR reads fresh anonymous English content.
export async function publicProductData<T>(event: H3Event, key: string, apiPath: string): Promise<T> {
  const config = useRuntimeConfig(event)
  if (config.productSnapshot) {
    const snapshot = await useStorage('assets:product-content').getItem<T>(`${key}.json`)
    if (!snapshot) throw createError({ statusCode: 404, statusMessage: 'Encounter not in publication snapshot' })
    return snapshot
  }
  try {
    const result = await $fetch<{ code: number; data: T }>(`${String(config.contentApiBase).replace(/\/$/, '')}/commerce/catalog/products/${apiPath}`, {
      headers: { 'Accept-Language': 'en-US', 'X-Timezone': 'Asia/Shanghai' }, timeout: 10000, retry: 0
    })
    if (result.code !== 200) throw createError({ statusCode: result.code === 404 ? 404 : 503, statusMessage: 'Encounter unavailable' })
    return result.data
  } catch (error: any) {
    if (error.statusCode === 404 || error.data?.code === 404) throw createError({ statusCode: 404, statusMessage: 'Encounter not found' })
    throw createError({ statusCode: 503, statusMessage: 'Encounter content temporarily unavailable' })
  }
}
