<template>
  <aside class="modern-auth-visual" aria-label="Lvyv travel inspiration">
    <picture class="modern-auth-visual-bg" aria-hidden="true">
      <source type="image/webp" :srcset="heroAuthAuroraWebp">
      <img src="/images/auth/hero-auth-aurora.jpg" alt="" width="1080" height="1440">
    </picture>
    <span class="modern-auth-visual-ellipse" aria-hidden="true">
      <img src="/images/auth/hero-auth-ellipse.svg" alt="">
    </span>
    <NuxtLink to="/" class="modern-auth-visual-logo" aria-label="Back to home">
      <img src="/images/common/logo-footer.svg" alt="Lvyv">
    </NuxtLink>
    <img src="/images/auth/hero-auth-pagination.svg" alt="" class="modern-auth-visual-pagination" aria-hidden="true">
  </aside>
</template>

<script setup lang="ts">
import heroAuthAuroraWebp from '~/assets/generated/auth/hero-auth-aurora-1080.webp'
</script>
