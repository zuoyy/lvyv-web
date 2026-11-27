import type { EncounterProduct } from '~~/shared/utils/encounterProducts'
import { encounterImage, encounterProductPath } from '~~/shared/utils/encounterProducts'

export async function useEncounterProduct(
  product: EncounterProduct,
  seo: { title: string; description: string; hero?: string },
  skuCodes: readonly string[] = ['DEFAULT'],
) {
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
  const productName = computed(() => request.data.value?.catalog?.product.name || product.title)
  const skus = computed(() => request.data.value?.catalog?.skus.filter(item => skuCodes.includes(item.skuCode)) ?? [])
  const sku = computed(() => skus.value[0])
  useLvyvSeo(() => ({
    title: productName.value === product.title ? seo.title : productName.value + ' · ' + product.city + ' | LVYV',
    description: seo.description,
    image: encounterImage(seo.hero ?? product.image),
    path: encounterProductPath(product),
    noindex: !sku.value,
  }))
  const { status, refresh } = await request
  return { productName, sku, skus, status, refresh }
}
