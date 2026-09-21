<template>
  <div v-if="promotion" class="first-order-offer" role="note">
    <strong>First order: {{ promotion.discountPercent }}% off, up to US${{ promotion.maxDiscountAmount }}</strong>
    <span>First {{ promotion.totalQuota }} qualifying orders · Pay before {{ deadline }}</span>
    <span v-if="promotion.status === 'EXHAUSTED'">All offers have been used.</span>
    <span v-else-if="promotion.status === 'QUOTA_RESERVED'">All places are temporarily reserved. Check again later.</span>
    <span v-else>Sign in at checkout to confirm eligibility. Cannot be combined with coupons; the better offer applies.</span>
  </div>
</template>
<script setup lang="ts">
import type { FirstOrderPromotion } from '~/composables/useTourCommerce'
const props = defineProps<{ promotion?: FirstOrderPromotion | null }>()
const deadline = computed(() => props.promotion ? new Date(props.promotion.endTime).toLocaleString('en-US', { timeZone: 'UTC', timeZoneName: 'short' }) : '')
</script>
<style scoped>
.first-order-offer { display: grid; gap: 5px; margin: 12px 0; padding: 12px 14px; border: 1px solid #bfd5c8; border-radius: 8px; color: #174d40; background: #f1f7f3; font-size: 13px; line-height: 1.5; }
.first-order-offer strong { font-size: 14px; }
</style>
