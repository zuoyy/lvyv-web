<template>
  <div class="transaction-section">
    <div class="section-header">
      <h2 class="section-title">Transaction History</h2>
      <a href="/points/rules" class="rules-link">How to earn & spend points</a>
    </div>
    
    <div class="filter-tabs">
      <button 
        v-for="tab in filterTabs" 
        :key="tab.value"
        :class="['filter-tab', { active: activeFilter === tab.value }]"
        @click="$emit('filter-change', tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>
    
    <div class="transaction-list" v-if="transactions.length > 0">
      <div 
        v-for="transaction in transactions" 
        :key="transaction.transactionNo"
        class="transaction-item"
      >
        <div class="transaction-info">
          <div class="transaction-desc">{{ transaction.remark || 'Points transaction' }}</div>
          <div class="transaction-time">{{ formatTime(transaction.occurredTime) }}</div>
        </div>
        <div 
          :class="['transaction-change', { 'change-positive': transaction.availableDelta > 0, 'change-negative': transaction.availableDelta < 0 }]"
        >
          {{ transaction.availableDelta > 0 ? '+' : '' }}{{ transaction.availableDelta }}
        </div>
      </div>
    </div>
    
    <div class="empty-transactions" v-else-if="!loading">
      <font-awesome-icon :icon="['fas', 'receipt']" class="empty-icon" />
      <p>No transaction records</p>
    </div>
    
    <div class="loading-transactions" v-else>
      <font-awesome-icon :icon="['fas', 'circle-notch']" class="loading-icon" spin />
    </div>
    
    <div class="pagination" v-if="total > size && !loading">
      <button 
        class="pagination-btn prev-btn" 
        :disabled="currentPage <= 1"
        @click="$emit('prev-page')"
      >
        <font-awesome-icon :icon="['fas', 'chevron-left']" />
      </button>
      <span class="pagination-info">{{ currentPage }} / {{ totalPages }}</span>
      <button 
        class="pagination-btn next-btn" 
        :disabled="currentPage >= totalPages"
        @click="$emit('next-page')"
      >
        <font-awesome-icon :icon="['fas', 'chevron-right']" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Transaction, FilterType } from './types'

const props = defineProps<{
  transactions: Transaction[]
  loading: boolean
  currentPage: number
  size: number
  total: number
  activeFilter: FilterType
}>()

defineEmits<{
  'filter-change': [value: FilterType]
  'prev-page': []
  'next-page': []
}>()

const filterTabs = [
  { label: 'All', value: 0 as FilterType },
  { label: 'Earn', value: 1 as FilterType },
  { label: 'Spend', value: 2 as FilterType }
]

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(props.total / props.size))
})

const formatTime = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.transaction-section {
  margin-top: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  margin: 0;
  font-family: 'Poppins', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
}

.rules-link {
  font-family: 'Roboto', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  color: #105446;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.rules-link:hover {
  color: #1C846F;
  text-decoration: underline;
}

.filter-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  padding: 8px;
  background: #f5f7f3;
  border-radius: 8px;
}

.filter-tab {
  padding: 10px 24px;
  border: none;
  background: transparent;
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #666666;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tab:hover {
  color: #105446;
  background: rgba(16, 84, 70, 0.05);
}

.filter-tab.active {
  background: #ffffff;
  color: #105446;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.transaction-list {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e5e5;
  overflow: hidden;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f2f2f2;
  transition: background 0.2s;
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-item:hover {
  background: #fafdf7;
}

.transaction-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.transaction-desc {
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: #1a1a1a;
}

.transaction-time {
  font-family: 'Roboto', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 13px;
  color: #808080;
}

.transaction-change {
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 16px;
  font-weight: 600;
}

.change-positive {
  color: #105446;
}

.change-negative {
  color: #d32f2f;
}

.empty-transactions {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e5e5;
  color: #808080;
}

.empty-icon {
  font-size: 48px;
  color: #dcdcdc;
  margin-bottom: 16px;
}

.empty-transactions p {
  font-family: 'Roboto', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 15px;
  margin: 0;
}

.loading-transactions {
  display: flex;
  justify-content: center;
  padding: 40px;
}

.loading-transactions .loading-icon {
  font-size: 24px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 32px;
}

.pagination-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #e5e5e5;
  background: #ffffff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666666;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #105446;
  color: #105446;
  background: #fafdf7;
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-info {
  font-family: 'Roboto', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  color: #666666;
  min-width: 60px;
  text-align: center;
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .filter-tab {
    padding: 8px 16px;
    font-size: 13px;
  }
  
  .transaction-item {
    padding: 16px 20px;
  }
  
  .transaction-desc {
    font-size: 14px;
  }
  
  .transaction-change {
    font-size: 15px;
  }
}
</style>