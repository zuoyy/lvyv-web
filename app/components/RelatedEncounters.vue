<template>
  <ul v-if="products?.length"><li v-for="product in products.slice(0, 4)" :key="product.productCode"><NuxtLink :to="product.landingPath">{{ product.name }}</NuxtLink></li></ul>
</template>
<script setup lang="ts">
const { data: products } = useAsyncData('store-catalog', useCommerce().products, { server: false })
</script>
