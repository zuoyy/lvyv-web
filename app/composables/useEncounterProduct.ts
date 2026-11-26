import type { EncounterProduct } from '~~/shared/utils/encounterProducts'
import { encounterImage, encounterProductPath } from '~~/shared/utils/encounterProducts'

export async function useEncounterProduct(product: EncounterProduct, seo: { title: string; description: string; hero?: string }) {
  const commerce = useCommerce()
  const request = useAsyncData('encounter-product:' + product.code, async () => {
    if (!product.ready) return { catalog: null }
    try {
      return { catalog: await commerce.product(product.code) }
    } catch (error) {
      if (error instanceof ApiRequestError && error.code === 1005000000) return { catalog: null }
      throw error
    }
  })
  const sku = computed(() => request.data.value?.catalog?.skus.find(item => item.skuCode === 'DEFAULT'))
  useLvyvSeo(() => ({
    title: seo.title,
    description: seo.description,
    image: encounterImage(seo.hero ?? product.image),
    path: encounterProductPath(product),
    noindex: !sku.value,
  }))
  const { status, refresh } = await request
  return { sku, status, refresh }
}
