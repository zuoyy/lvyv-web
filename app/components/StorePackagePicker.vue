<template>
  <section class="packages" aria-labelledby="packages-title">
    <h2 id="packages-title">Choose a package</h2>
    <p v-if="status === 'pending'" role="status">Loading packages…</p>
    <p v-else-if="!detail?.skus.length">This trip is currently unavailable.</p>
    <div v-else class="package-list">
      <article v-for="sku in detail.skus" :key="sku.skuCode">
        <h3>{{ sku.name }}</h3>
        <dl v-if="sku.specifications.length">
          <div v-for="spec in sku.specifications" :key="spec.key"><dt>{{ spec.label }}</dt><dd>{{ spec.value }}</dd></div>
        </dl>
        <NuxtLink :to="checkoutPath(productCode, sku.skuCode)">Book for {{ usd(sku.price) }} USD</NuxtLink>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
const { productCode } = defineProps<{ productCode: string }>()
const commerce = useCommerce()
const { data: detail, status } = useAsyncData(
  'landing-packages:' + productCode,
  () => commerce.product(productCode),
  { server: false },
)
</script>

<style scoped>
.packages { margin: 32px 0; }
.package-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr)); gap: 16px; }
article { border: 1px solid #cbd6ce; border-radius: 8px; padding: 20px; }
h3 { margin: 0 0 12px; }
dl div { display: flex; gap: 12px; justify-content: space-between; }
dd { margin: 0; }
a { display: inline-block; background: #244c3b; color: white; padding: 10px 16px; border-radius: 6px; text-decoration: none; }
</style>
