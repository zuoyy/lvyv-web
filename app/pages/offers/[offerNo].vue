<template>
  <div />
</template>

<script setup lang="ts">
useNoIndex()
const route = useRoute()
const offerNo = String(route.params.offerNo || '')
if (import.meta.client) {
  void navigateTo(`/trips${offerNo ? `?offerNo=${encodeURIComponent(offerNo)}` : ''}`, { replace: true })
} else {
  await navigateTo(`/trips${offerNo ? `?offerNo=${encodeURIComponent(offerNo)}` : ''}`, { replace: true })
}
</script>
