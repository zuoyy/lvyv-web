<template>
  <div v-if="summary" class="member-badge-strip" aria-label="Your level and worn badges">
    <NuxtLink to="/badges" class="current-level">Current level · {{ summary.account.levelCode }}</NuxtLink>
    <img v-if="summary.currentLevelBadge?.iconUrl" :src="summary.currentLevelBadge.iconUrl" :alt="summary.account.levelCode" width="32" height="32">
    <NuxtLink v-for="item in summary.worn" :key="item.definition.id" to="/badges" :title="api.name(item.definition)">
      <img v-if="item.definition.iconUrl" :src="item.definition.iconUrl" :alt="api.name(item.definition)" width="32" height="32">
    </NuxtLink>
  </div>
</template>
<script setup lang="ts">
import type { BadgeSummary } from '~/composables/useBadges'
const api = useBadges()
const summary = ref<BadgeSummary | null>(null)
let active = true
onMounted(async () => {
  if (!api.auth.token.value) return
  try { const value = await api.summary(); if (active) summary.value = value } catch { /* Collection errors are shown on the badges page. */ }
})
watch(api.auth.token, () => { summary.value = null })
onBeforeUnmount(() => { active = false })
</script>
<style scoped>
.member-badge-strip { display: flex; align-items: center; gap: 12px; padding: 12px 0; color: #173f34; font-size: 12px; flex-wrap: wrap; }
.member-badge-strip img { object-fit: contain; }.current-level { text-decoration: none; color: inherit; }
</style>
