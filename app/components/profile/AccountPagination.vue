<template>
  <nav v-if="total > 0" class="account-pagination" aria-label="Pagination">
    <button type="button" :disabled="loading || page <= 1" @click="$emit('change', page - 1)">Previous</button>
    <span>Page {{ page }} of {{ Math.max(1, Math.ceil(total / size)) }} · {{ total }} total</span>
    <button type="button" :disabled="loading || page * size >= total" @click="$emit('change', page + 1)">Next</button>
  </nav>
</template>
<script setup lang="ts">
defineProps<{ page: number; size: number; total: number; loading?: boolean }>()
defineEmits<{ change: [page: number] }>()
</script>
<style scoped>
.account-pagination { display: flex; align-items: center; justify-content: center; gap: 18px; padding: 24px 0; font-size: 13px; color: #52605b; }
button { padding: 9px 15px; border: 1px solid #cad3ce; background: #fff; color: #174d40; cursor: pointer; }
button:disabled { opacity: .45; cursor: default; }
</style>
