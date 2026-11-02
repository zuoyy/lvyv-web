<script setup lang="ts">
const route = useRoute()
await navigateTo({ path: '/luxury/featured-routes', query: route.query }, { redirectCode: 301, replace: true })
</script>

<template>
  <div />
</template>
