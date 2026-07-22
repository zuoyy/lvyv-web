<template>
  <div class="points-container">
    <button class="mobile-menu-btn" @click="showSidebar = true">
      <font-awesome-icon :icon="['fas', 'bars']" />
    </button>
    
    <div class="sidebar-overlay" v-if="showSidebar" @click="showSidebar = false"></div>
    
    <ProfileSidebar 
      v-model:activeTab="activeTab" 
      :show="showSidebar"
      @close="showSidebar = false"
    />
    
    <main class="points-content">
      <div class="content-wrapper">
        <div class="page-header">
          <h1 class="page-title">Points & Rewards</h1>
          <p class="page-desc">Track your loyalty points and rewards</p>
        </div>
        
        <PointsCard v-if="pointsData" :points="pointsData" />
        
        <div class="loading-state" v-else>
          <font-awesome-icon :icon="['fas', 'circle-notch']" class="loading-icon" spin />
          <p>Loading your points...</p>
        </div>
        
        <TransactionList 
          v-if="pointsData"
          :transactions="transactions"
          :loading="loadingTransactions"
          :currentPage="currentPage"
          :size="size"
          :total="total"
          :activeFilter="activeFilter"
          @filter-change="handleFilterChange"
          @prev-page="handlePrevPage"
          @next-page="handleNextPage"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProfileSidebar from '~/components/profile/ProfileSidebar.vue'
import PointsCard from '~/components/points/PointsCard.vue'
import TransactionList from '~/components/points/TransactionList.vue'
import type { PointsAccount, Transaction, TransactionPageResponse, FilterType } from '~/components/points/types'

const auth = useMemberAuth()
const activeTab = ref('points')
const showSidebar = ref(false)
const pointsData = ref<PointsAccount | null>(null)

const activeFilter = ref<FilterType>(0)
const transactions = ref<Transaction[]>([])
const loadingTransactions = ref(false)
const currentPage = ref(1)
const size = ref(20)
const total = ref(0)

const fetchTransactions = async () => {
  if (!auth.token.value) return
  
  loadingTransactions.value = true
  
  try {
    const config = useRuntimeConfig()
    const token = useCookie<string | null>('token')
    
    const params: Record<string, any> = {
      page: currentPage.value,
      size: size.value
    }
    
    if (activeFilter.value !== 0) {
      params.changeType = activeFilter.value
    }
    
    const response = await $fetch<{ code: number; msg?: string; data: TransactionPageResponse }>(
      '/points/transactions/page',
      {
        baseURL: config.public.apiBase as string,
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        params
      }
    )
    
    if (response.code === 200) {
      transactions.value = response.data.list
      total.value = response.data.total
      currentPage.value = response.data.page
      size.value = response.data.size
    }
  } catch (error) {
    console.error('Failed to fetch transactions:', error)
  } finally {
    loadingTransactions.value = false
  }
}

const handleFilterChange = (value: FilterType) => {
  activeFilter.value = value
  currentPage.value = 1
  fetchTransactions()
}

const handlePrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchTransactions()
  }
}

const handleNextPage = () => {
  const totalPages = Math.max(1, Math.ceil(total.value / size.value))
  if (currentPage.value < totalPages) {
    currentPage.value++
    fetchTransactions()
  }
}

onMounted(async () => {
  if (!auth.token.value) {
    await navigateTo('/login?redirect=/points')
    return
  }
  
  try {
    const config = useRuntimeConfig()
    const token = useCookie<string | null>('token')
    
    const [accountResponse] = await Promise.all([
      $fetch<{ code: number; msg?: string; data: PointsAccount }>(
        '/points/account',
        {
          baseURL: config.public.apiBase as string,
          headers: {
            Authorization: `Bearer ${token.value}`
          }
        }
      ),
      fetchTransactions()
    ])
    
    if (accountResponse.code === 200) {
      pointsData.value = accountResponse.data
    }
  } catch (error) {
    console.error('Failed to fetch points:', error)
  }
})
</script>

<style scoped>
.points-container {
  min-height: 100vh;
  background: #f5f7f3;
  display: block;
}

.mobile-menu-btn {
  display: none;
  position: fixed;
  top: calc(80px + 16px);
  left: 16px;
  z-index: 1000;
  width: 44px;
  height: 44px;
  border: none;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  color: #105446;
  font-size: 20px;
  align-items: center;
  justify-content: center;
}

.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 950;
}

.points-content {
  margin-left: 200px;
  padding: 80px 48px;
  background: #ffffff;
  min-height: 100vh;
}

.content-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  margin: 0;
  font-family: 'Poppins', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
}

.page-desc {
  margin: 8px 0 0;
  font-family: 'Roboto', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 15px;
  color: #666666;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #808080;
}

.loading-icon {
  font-size: 32px;
  color: #105446;
  margin-bottom: 16px;
}

.loading-state p {
  font-family: 'Roboto', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 15px;
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
  }
  
  .sidebar-overlay {
    display: block;
  }
  
  .points-content {
    margin-left: 0;
    padding: 24px;
    padding-top: 80px;
  }
}
</style>