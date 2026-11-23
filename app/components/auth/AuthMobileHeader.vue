<template>
  <header class="modern-auth-mobile-header">
    <NuxtLink :to="backTo || '/'" :aria-label="backTo ? 'Back to product' : 'Back to home'">
      <img src="/images/common/logo-header.svg" alt="Lvyv">
    </NuxtLink>
  </header>
</template>

<script setup lang="ts">
defineProps<{ backTo?: string }>()
</script>
