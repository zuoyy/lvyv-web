<template>
  <AccountPageShell
    active-page="points"
    kicker="Loyalty"
    title="Points & rewards"
    description="See your balance, membership progress and every point movement in one place."
    :ready="ready"
  >
    <div v-if="loadingAccount" class="content-state" role="status"><span class="state-spinner" />Loading your points...</div>
    <div v-else-if="accountError" class="content-state error-state"><font-awesome-icon :icon="['fas', 'circle-exclamation']" /><strong>We could not load your points.</strong><span>{{ accountError }}</span><button type="button" @click="fetchAccount">Try again</button></div>
    <template v-else-if="pointsData">
      <PointsCard :points="pointsData" />
      <TransactionList :transactions="transactions" :loading="loadingTransactions" :current-page="currentPage" :size="size" :total="total" :active-filter="activeFilter" @filter-change="handleFilterChange" @prev-page="handlePrevPage" @next-page="handleNextPage" />
    </template>
  </AccountPageShell>
</template>

<script setup lang="ts">
import AccountPageShell from '~/components/profile/AccountPageShell.vue'
import PointsCard from '~/components/points/PointsCard.vue'
import TransactionList from '~/components/points/TransactionList.vue'
import type { PointsAccount, Transaction, TransactionPageResponse, FilterType } from '~/components/points/types'

useNoIndex()

interface ApiResult<T> { code: number; msg?: string; data: T }
const { auth, ready, initializeAccount } = useAccountPage('/points')
const config = useRuntimeConfig()
const pointsData = ref<PointsAccount | null>(null)
const loadingAccount = ref(false)
const accountError = ref('')
const activeFilter = ref<FilterType>(0)
const transactions = ref<Transaction[]>([])
const loadingTransactions = ref(false)
const currentPage = ref(1)
const size = ref(20)
const total = ref(0)
const headers = computed(() => ({ Authorization: `Bearer ${auth.token.value}`, 'X-Time-Zone': auth.member.value?.timezone || detectMemberTimeZone() }))

const fetchTransactions = async () => {
  loadingTransactions.value = true
  try {
    const response = await $fetch<ApiResult<TransactionPageResponse>>('/points/transactions/page', { baseURL: config.public.apiBase as string, headers: headers.value, params: { page: currentPage.value, size: size.value, ...(activeFilter.value ? { changeType: activeFilter.value } : {}) } })
    if (response.code !== 200) throw new Error(response.msg || 'Request failed')
    transactions.value = response.data.list
    total.value = response.data.total
    currentPage.value = response.data.page
    size.value = response.data.size
  } catch {
    transactions.value = []
    total.value = 0
  } finally { loadingTransactions.value = false }
}
const fetchAccount = async () => {
  loadingAccount.value = true
  accountError.value = ''
  try {
    const response = await $fetch<ApiResult<PointsAccount>>('/points/account', { baseURL: config.public.apiBase as string, headers: headers.value })
    if (response.code !== 200) throw new Error(response.msg || 'Request failed')
    pointsData.value = response.data
    await fetchTransactions()
  } catch (caught) {
    accountError.value = caught instanceof Error ? caught.message : 'Request failed.'
  } finally { loadingAccount.value = false }
}
const handleFilterChange = (value: FilterType) => { activeFilter.value = value; currentPage.value = 1; fetchTransactions() }
const handlePrevPage = () => { if (currentPage.value > 1) { currentPage.value--; fetchTransactions() } }
const handleNextPage = () => { if (currentPage.value < Math.ceil(total.value / size.value)) { currentPage.value++; fetchTransactions() } }
onMounted(async () => {
  if (!await initializeAccount()) return
  await fetchAccount()
})
</script>

<style scoped>
.content-state { min-height: 340px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 9px; border: 1px solid #dfe5e1; background: #fff; color: #75827c; font-size: 13px; text-align: center; }.content-state strong { color: #2e4137; font-size: 16px; }.content-state button { margin-top: 7px; padding: 9px 13px; border: 1px solid #174d40; background: #174d40; color: #fff; font-weight: 700; cursor: pointer; }.error-state > svg { color: #a33e35; font-size: 24px; }.state-spinner { width: 18px; height: 18px; border: 2px solid #ccd5d0; border-top-color: #174d40; border-radius: 50%; animation: spin .7s linear infinite; }@keyframes spin { to { transform: rotate(360deg); } }
</style>
