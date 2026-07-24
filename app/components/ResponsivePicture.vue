<template>
  <picture>
    <source type="image/webp" :srcset="webpSrcset" :sizes="sizes">
    <img
      :src="fallback"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="loading"
      decoding="async"
      :fetchpriority="fetchPriority"
    >
  </picture>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  fallback: string
  webpSrcset: string
  sizes: string
  width: number
  height: number
  alt?: string
  loading?: 'eager' | 'lazy'
  fetchPriority?: 'high' | 'low' | 'auto'
}>(), {
  alt: '',
  loading: 'lazy',
  fetchPriority: 'low',
})
</script>

<style scoped>
picture,
img {
  display: block;
  width: 100%;
  height: 100%;
}

img {
  object-fit: cover;
}
</style>
