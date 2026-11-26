<script setup lang="ts">
import { encounterProductPath, encounterProducts } from '~~/shared/utils/encounterProducts'

definePageMeta({ key: route => route.path })

const code = String(useRoute().params.productCode)
const migratedPaths: Record<string, string> = {
  'china-sim': '/product/china-sim',
  chengdu_2: '/chengdu-pandas-and-tea',
  xian_2: '/xian-terracotta-and-tang',
}
const encounter = encounterProducts.find(product => product.code === code.toUpperCase())
const migrated = migratedPaths[code.toLowerCase()]
const commerce = useCommerce()
const { data } = await useAsyncData('landing-redirect:' + code, async () => ({
  path: encounter ? encounterProductPath(encounter) : migrated ?? (await commerce.product(code)).product.landingPath,
}))
const destination = data.value?.path
if (!destination || destination.startsWith('/encounters/')) throw createError({ statusCode: 404, statusMessage: 'Product not found' })
await navigateTo(destination, { redirectCode: 301, replace: true })
</script>
<template><div /></template>
