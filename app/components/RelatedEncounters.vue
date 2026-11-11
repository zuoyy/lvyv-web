<template>
  <section v-if="products.length" class="related-encounters" aria-labelledby="related-encounters-title">
    <h2 id="related-encounters-title">Explore encounters in {{ products[0]?.cityLabel }}</h2>
    <ul><li v-for="product in products" :key="product.productCode"><NuxtLink :to="`/encounters/${encodeURIComponent(product.productCode)}`">{{ product.name }}</NuxtLink><p v-if="product.summary">{{ product.summary }}</p></li></ul>
  </section>
</template>
<script setup lang="ts">
const props = defineProps<{ city: string }>()
const { data } = await useAsyncData('public-product-manifest-en-US', () => usePublicProducts().manifest())
const products = computed(() => data.value?.products.filter(product => props.city.split(',').includes(product.cityCode.toLowerCase())) || [])
</script>
<style scoped>.related-encounters { width: min(1200px, calc(100% - 40px)); margin: 48px auto; color: #203d33; }.related-encounters ul { display: grid; grid-template-columns: repeat(auto-fit,minmax(240px,1fr)); gap: 24px; list-style: none; padding: 0; }.related-encounters a { color: inherit; font-size: 20px; }.related-encounters p { line-height: 1.6; }</style>
