<template>
  <AccountPageShell
    active-page="points"
    title="Points & rewards"
    description="See your balance, membership progress and every point movement in one place."
    :ready="ready"
  >
    <div v-if="loadingAccount" class="content-state" role="status"><span class="state-spinner" />Loading your points...</div>
    <div v-else-if="accountError" class="content-state error-state"><font-awesome-icon :icon="['fas', 'circle-exclamation']" /><strong>We could not load your points.</strong><span>{{ accountError }}</span><button type="button" @click="fetchAccount">Try again</button></div>
    <template v-else-if="pointsData">
      <PointsCard :points="pointsData" />
      <TransactionList :transactions="transactions" :loading="loadingTransactions" :current-page="currentPage" :size="size" :total="total" :active-filter="activeFilter" :locale="memberLocale" @filter-change="handleFilterChange" @prev-page="handlePrevPage" @next-page="handleNextPage" />
    </template>
  <div v-if="transactionsError" class="content-state error-state"><span>{{ transactionsError }}</span><button type="button" @click="fetchTransactions">Retry transactions</button></div>
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
const transactionsError = ref('')
let accountRequest = 0
let transactionsRequest = 0
const activeFilter = ref<FilterType>(0)
const transactions = ref<Transaction[]>([])
const loadingTransactions = ref(false)
const currentPage = ref(1)
const size = ref(20)
const total = ref(0)
const memberLocale = computed(() => auth.member.value?.locale || 'en-US')
const headers = computed(() => ({ Authorization: `Bearer ${auth.token.value}`, 'Accept-Language': memberLocale.value, 'X-Time-Zone': auth.member.value?.timezone || detectMemberTimeZone() }))

const fetchTransactions = async () => {
  const request = ++transactionsRequest
  transactionsError.value = ''
  loadingTransactions.value = true
  try {
    const params = new URLSearchParams({ page: String(currentPage.value), size: String(size.value), ...(activeFilter.value ? { changeType: String(activeFilter.value) } : {}) })
    const data = await auth.request<TransactionPageResponse>(`/points/transactions/page?${params}`, undefined, 'GET')
    if (request !== transactionsRequest) return
    transactions.value = data.list
    total.value = data.total
    currentPage.value = data.page
    size.value = data.size
  } catch (caught) {
    if (request === transactionsRequest) transactionsError.value = caught instanceof Error ? caught.message : 'Could not load transactions.'
  } finally { if (request === transactionsRequest) loadingTransactions.value = false }
}
const fetchAccount = async () => {
  const request = ++accountRequest
  loadingAccount.value = true
  accountError.value = ''
  try {
    const result = await auth.request<PointsAccount>('/points/account', undefined, 'GET')
    if (request === accountRequest) pointsData.value = result
  } catch (caught) {
    if (request === accountRequest) accountError.value = caught instanceof Error ? caught.message : 'Request failed.'
  } finally { if (request === accountRequest) loadingAccount.value = false }
}
const handleFilterChange = (value: FilterType) => { activeFilter.value = value; currentPage.value = 1; fetchTransactions() }
const handlePrevPage = () => { if (currentPage.value > 1) { currentPage.value--; fetchTransactions() } }
const handleNextPage = () => { if (currentPage.value < Math.ceil(total.value / size.value)) { currentPage.value++; fetchTransactions() } }
onMounted(async () => {
  if (!auth.token.value) { await initializeAccount(); return }
  await Promise.all([initializeAccount(), fetchAccount(), fetchTransactions()])
})
onBeforeUnmount(() => { ++accountRequest; ++transactionsRequest })
watch(auth.token, () => { ++accountRequest; ++transactionsRequest; pointsData.value = null; transactions.value = [] })
</script>

<style scoped>
.content-state { min-height: 340px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 9px; border: 1px solid #dfe5e1; background: #fff; color: #75827c; font-size: 13px; text-align: center; }.content-state strong { color: #2e4137; font-size: 16px; }.content-state button { margin-top: 7px; padding: 9px 13px; border: 1px solid #174d40; background: #174d40; color: #fff; font-weight: 700; cursor: pointer; }.error-state > svg { color: #a33e35; font-size: 24px; }.state-spinner { width: 18px; height: 18px; border: 2px solid #ccd5d0; border-top-color: #174d40; border-radius: 50%; animation: spin .7s linear infinite; }@keyframes spin { to { transform: rotate(360deg); } }
</style>
