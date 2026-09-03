<template>
  <section class="transaction-section">
    <header><div><h2>Point activity</h2><p>Every point earned, used or adjusted.</p></div><NuxtLink to="/points/rules">Points guide <font-awesome-icon :icon="['fas', 'arrow-right']" /></NuxtLink></header>
    <div class="filter-tabs" role="group" aria-label="Point activity type">
      <button v-for="tab in filterTabs" :key="tab.value" type="button" :class="{ active: activeFilter === tab.value }" @click="$emit('filter-change', tab.value)">{{ tab.label }}</button>
    </div>
    <div v-if="loading" class="transaction-state" role="status"><span class="state-spinner" />Loading activity...</div>
    <div v-else-if="transactions.length" class="transaction-list">
      <article v-for="transaction in transactions" :key="transaction.transactionNo" class="transaction-row">
        <div class="transaction-mark" :class="transaction.availableDelta >= 0 ? 'positive' : 'negative'">{{ transaction.availableDelta >= 0 ? '+' : '−' }}</div>
        <div class="transaction-copy"><strong>{{ transactionDescription(transaction) }}</strong><span>{{ formatMemberDateTime(transaction.occurredTime) }} · {{ transaction.transactionNo }}</span></div>
        <div class="transaction-value" :class="transaction.availableDelta >= 0 ? 'positive' : 'negative'">{{ transaction.availableDelta > 0 ? '+' : '' }}{{ transaction.availableDelta.toLocaleString() }}<span>pts</span></div>
      </article>
    </div>
    <div v-else class="transaction-state empty"><font-awesome-icon :icon="['fas', 'gift']" /><strong>No point activity yet</strong><span>Your first point transaction will appear here.</span></div>
    <div v-if="total > size && !loading" class="pagination"><button type="button" :disabled="currentPage <= 1" aria-label="Previous page" @click="$emit('prev-page')"><font-awesome-icon :icon="['fas', 'chevron-left']" /></button><span>{{ currentPage }} / {{ totalPages }}</span><button type="button" :disabled="currentPage >= totalPages" aria-label="Next page" @click="$emit('next-page')"><font-awesome-icon :icon="['fas', 'chevron-right']" /></button></div>
  </section>
</template>

<script setup lang="ts">
import type { Transaction, FilterType } from './types'
const props = defineProps<{ transactions: Transaction[]; loading: boolean; currentPage: number; size: number; total: number; activeFilter: FilterType; locale: string }>()
defineEmits<{ 'filter-change': [value: FilterType]; 'prev-page': []; 'next-page': [] }>()
const filterTabs = [{ label: 'All', value: 0 as FilterType }, { label: 'Earned', value: 1 as FilterType }, { label: 'Used', value: 2 as FilterType }]
const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.size)))
const transactionTitle = (transaction: Transaction) => transaction.changeType === 1 ? 'Points earned' : transaction.changeType === 2 ? 'Points used' : 'Points adjustment'
const rewardDescriptions: Record<string, { 'en-US': string; 'zh-CN': string }> = {
  DAILY_LOGIN: { 'en-US': 'Points reward: Daily login', 'zh-CN': '积分奖励：每日登录' },
  REGISTER_SUCCESS: { 'en-US': 'Points reward: Registration completed', 'zh-CN': '积分奖励：完成注册' },
  WISH_SUBMITTED: { 'en-US': 'Points reward: Wish submitted', 'zh-CN': '积分奖励：提交愿望' },
  PAYMENT_SUCCESS: { 'en-US': 'Points reward: Payment completed', 'zh-CN': '积分奖励：完成支付' },
  ITINERARY_COMPLETED: { 'en-US': 'Points reward: Trip completed', 'zh-CN': '积分奖励：完成行程' },
}
const transactionDescription = (transaction: Transaction) => {
  const localizedReward = rewardDescriptions[transaction.ruleCode]
  if (localizedReward) return props.locale === 'zh-CN' ? localizedReward['zh-CN'] : localizedReward['en-US']
  return transaction.remark || transactionTitle(transaction)
}
</script>

<style scoped>
.transaction-section { margin-top: 34px; }.transaction-section > header { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 18px; }.transaction-section h2 { margin: 0; color: #173f34; font: 600 25px/1.2 'Playfair Display', Georgia, serif; }.transaction-section header p { margin: 6px 0 0; color: #7c8983; font-size: 11px; }.transaction-section header a { color: #174d40; font-size: 11px; font-weight: 800; text-decoration: none; }.transaction-section header a svg { margin-left: 4px; }
.filter-tabs { display: inline-flex; gap: 3px; margin-bottom: 14px; padding: 4px; background: #e9eeea; }.filter-tabs button { min-height: 32px; padding: 0 14px; border: 0; background: transparent; color: #697770; font: 600 10px/1 'Inter', sans-serif; cursor: pointer; }.filter-tabs button.active { background: #fff; color: #174d40; box-shadow: 0 1px 4px rgba(30,54,46,.1); }
.transaction-list { border: 1px solid #dfe5e1; background: #fff; }.transaction-row { min-height: 72px; display: grid; grid-template-columns: 34px minmax(0,1fr) auto; align-items: center; gap: 14px; padding: 0 18px; border-bottom: 1px solid #edf1ee; }.transaction-row:last-child { border-bottom: 0; }.transaction-mark { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 50%; font-size: 15px; font-weight: 800; }.transaction-mark.positive { background: #edf5ed; color: #477044; }.transaction-mark.negative { background: #fff1ef; color: #a33e35; }.transaction-copy { min-width: 0; display: flex; flex-direction: column; gap: 5px; }.transaction-copy strong { overflow: hidden; color: #35463d; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }.transaction-copy span { color: #919c96; font-size: 9px; }.transaction-value { display: flex; align-items: baseline; gap: 4px; font-size: 14px; font-weight: 800; }.transaction-value span { font-size: 8px; text-transform: uppercase; }.transaction-value.positive { color: #3e6c42; }.transaction-value.negative { color: #a33e35; }
.transaction-state { min-height: 220px; display: flex; align-items: center; justify-content: center; gap: 9px; border: 1px solid #dfe5e1; background: #fff; color: #78867f; font-size: 12px; }.transaction-state.empty { flex-direction: column; }.transaction-state.empty > svg { margin-bottom: 5px; color: #9aac9f; font-size: 23px; }.transaction-state.empty strong { color: #35463d; font-size: 14px; }.transaction-state.empty span { color: #89958f; }.state-spinner { width: 16px; height: 16px; border: 2px solid #ccd5d0; border-top-color: #174d40; border-radius: 50%; animation: spin .7s linear infinite; }
.pagination { display: flex; align-items: center; justify-content: center; gap: 13px; margin-top: 18px; color: #6e7b75; font-size: 10px; }.pagination button { width: 34px; height: 34px; border: 1px solid #ccd6d0; background: #fff; color: #174d40; cursor: pointer; }.pagination button:disabled { opacity: .4; cursor: not-allowed; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width: 560px) { .transaction-section > header { align-items: flex-start; flex-direction: column; }.transaction-row { padding-inline: 12px; }.transaction-copy span { max-width: 190px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } }
</style>
