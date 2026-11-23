<script setup lang="ts">
const code = String(useRoute().params.productCode)
const { data } = await useAsyncData('landing-redirect:' + code, () => useCommerce().product(code))
const migratedPaths: Record<string, string> = {
  chengdu_2: '/chengdu-pandas-and-tea',
  xian_2: '/xian-terracotta-and-tang',
}
const destination = data.value?.product.landingPath ?? (Object.hasOwn(migratedPaths, code) ? migratedPaths[code] : undefined)
if (!destination || destination.startsWith('/encounters/')) throw createError({ statusCode: 404, statusMessage: 'Product not found' })
await navigateTo(destination, { redirectCode: 301, replace: true })
</script>
<template><div /></template>
