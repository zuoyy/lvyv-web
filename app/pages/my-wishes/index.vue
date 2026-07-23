<template>
  <div class="my-wishes-container">
    <button class="mobile-menu-btn" @click="showSidebar = true">
      <font-awesome-icon :icon="['fas', 'bars']" />
    </button>
    
    <div class="sidebar-overlay" v-if="showSidebar" @click="showSidebar = false"></div>
    
    <ProfileSidebar 
      v-model:activeTab="activeTab" 
      :show="showSidebar"
      @close="showSidebar = false"
    />
    
    <main class="wishes-content">
      <div class="content-wrapper">
        <div class="page-header">
          <h1 class="page-title">My Wishes</h1>
          <p class="page-desc">Track your travel wishlist and design progress</p>
        </div>
        
        <div class="wishes-layout">
          <aside class="filter-sidebar">
            <nav class="filter-nav">
              <ul class="filter-list">
                <li 
                  class="filter-item" 
                  :class="{ active: activeStatus === null }"
                  @click="handleStatusChange(null)"
                >
                  <span>All</span>
                </li>
                <li 
                  class="filter-item" 
                  :class="{ active: activeStatus === 1 }"
                  @click="handleStatusChange(1)"
                >
                  <span>Designing</span>
                </li>
                <li 
                  class="filter-item" 
                  :class="{ active: activeStatus === 2 }"
                  @click="handleStatusChange(2)"
                >
                  <span>Delivered</span>
                </li>
                <li 
                  class="filter-item" 
                  :class="{ active: activeStatus === 3 }"
                  @click="handleStatusChange(3)"
                >
                  <span>Revision</span>
                </li>
              </ul>
            </nav>
          </aside>
          
          <div class="wishes-list">
            <div class="loading-state" v-if="loading">
              <font-awesome-icon :icon="['fas', 'circle-notch']" class="loading-icon" spin />
              <p>Loading your wishes...</p>
            </div>
            
            <div class="empty-state" v-else-if="wishes.length === 0">
              <div class="empty-illustration">
                <font-awesome-icon :icon="['fas', 'heart']" class="empty-icon" />
              </div>
              <p class="empty-title">No wishes yet</p>
              <p class="empty-desc">Start your first encounter!</p>
            </div>
            
            <div class="cards-container" v-else>
              <div 
                v-for="wish in wishes" 
                :key="wish.id"
                class="wish-card clickable"
                @click="handleCardClick(wish)"
              >
                <div class="card-thumbnail">
                  <img 
                    :src="getCityImage(wish.cityCode)" 
                    :alt="wish.cityLabel"
                    class="city-image"
                  />
                </div>
                <div class="card-content">
                  <div class="card-header">
                    <h3 class="city-name">{{ wish.cityLabel }}</h3>
                    <span class="trip-days">{{ wish.tripDays }} days</span>
                  </div>
                  <p class="submit-time">{{ formatDate(wish.createTime) }}</p>
                  <div class="status-tag" :class="getStatusClass(wish.status)">
                    <span class="status-dot"></span>
                    <span class="status-text">{{ wish.statusLabel }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="pagination" v-if="total > size">
              <button 
                class="pagination-btn" 
                :disabled="currentPage <= 1"
                @click="handlePrevPage"
              >
                <font-awesome-icon :icon="['fas', 'chevron-left']" />
              </button>
              <span class="pagination-info">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
              <button 
                class="pagination-btn" 
                :disabled="currentPage >= totalPages"
                @click="handleNextPage"
              >
                <font-awesome-icon :icon="['fas', 'chevron-right']" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ProfileSidebar from '~/components/profile/ProfileSidebar.vue'

const auth = useMemberAuth()
const activeTab = ref('my-wishes')
const showSidebar = ref(false)

const activeStatus = ref<number | null>(null)
const wishes = ref<WishItem[]>([])
const loading = ref(false)
const currentPage = ref(1)
const size = ref(10)
const total = ref(0)

interface Interest {
  code: string
  messageKey: string
  label: string
}

interface WishItem {
  id: number
  wishNo: string
  memberId: number
  memberNickname: string
  cityCode: string
  cityMessageKey: string
  cityLabel: string
  tripDays: number
  startDate: string
  interestCodes: string[]
  interests: Interest[]
  budgetLevel: string
  budgetLevelMessageKey: string
  budgetLevelLabel: string
  story: string
  specialRequirement: string
  imageFileIds: string[]
  status: number
  statusMessageKey: string
  statusLabel: string
  designerUserId: number
  designerNickname: string
  claimedTime: string
  deliveredTime: string
  lastRevisionTime: string
  createTime: string
  hasItinerary: boolean
}

interface WishPageResponse {
  list: WishItem[]
  total: number
  page: number
  size: number
}

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / size.value)))

const getCityImage = (cityCode: string): string => {
  const cityImages: Record<string, string> = {
    'beijing': '/images/home/explore-beijing.png',
    'chengdu': '/images/home/explore-chengdu.png',
    'xian': '/images/home/explore-xian.png',
  }
  return cityImages[cityCode.toLowerCase()] || '/images/home/explore-beijing.png'
}

const getStatusClass = (status: number): string => {
  switch (status) {
    case 1: return 'status-designing'
    case 2: return 'status-delivered'
    case 3: return 'status-revision'
    default: return 'status-default'
  }
}

const formatDate = (dateStr: string): string => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const fetchWishes = async () => {
  if (!auth.token.value) return
  
  loading.value = true
  
  try {
    const config = useRuntimeConfig()
    const token = useCookie<string | null>('token')
    
    const params: Record<string, any> = {
      page: currentPage.value,
      size: size.value
    }
    
    if (activeStatus.value !== null) {
      params.status = activeStatus.value
    }
    
    const response = await $fetch<{ code: number; msg?: string; data: WishPageResponse }>(
      '/tour/wishes/page',
      {
        baseURL: config.public.apiBase as string,
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        params
      }
    )
    
    if (response.code === 200) {
      wishes.value = response.data.list
      total.value = response.data.total
      currentPage.value = response.data.page
      size.value = response.data.size
    }
  } catch (error) {
    console.error('Failed to fetch wishes:', error)
  } finally {
    loading.value = false
  }
}

const handleStatusChange = (status: number | null) => {
  activeStatus.value = status
  currentPage.value = 1
  fetchWishes()
}

const handleCardClick = (wish: WishItem) => {
  navigateTo(`/my-wishes/${wish.id}`)
}

const handlePrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchWishes()
  }
}

const handleNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchWishes()
  }
}

onMounted(async () => {
  if (!auth.token.value) {
    await navigateTo('/login?redirect=/my-wishes')
    return
  }
  
  await fetchWishes()
})
</script>

<style scoped>
.my-wishes-container {
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

.wishes-content {
  margin-left: 200px;
  padding: 80px 48px;
  background: #ffffff;
  min-height: 100vh;
}

.content-wrapper {
  max-width: 1000px;
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

.wishes-layout {
  display: flex;
  gap: 32px;
}

.filter-sidebar {
  width: 200px;
  flex-shrink: 0;
}

.filter-nav {
  position: sticky;
  top: 100px;
}

.filter-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.filter-item {
  margin-bottom: 8px;
}

.filter-item span {
  display: block;
  padding: 12px 16px;
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  color: #666666;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
}

.filter-item:hover span {
  color: #105446;
  background: #f2f2f2;
}

.filter-item.active span {
  color: #105446;
  font-weight: 600;
  border-bottom-color: #105446;
  background: #e9f3ee;
}

.wishes-list {
  flex: 1;
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

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #808080;
}

.empty-illustration {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #f2f5f3;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.empty-icon {
  font-size: 48px;
  color: #105446;
  opacity: 0.5;
}

.empty-title {
  font-family: 'Poppins', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.empty-desc {
  font-family: 'Roboto', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 15px;
  color: #666666;
  margin: 0;
}

.cards-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.wish-card {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  transition: all 0.2s;
}

.wish-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.wish-card.clickable {
  cursor: pointer;
}

.wish-card.clickable:hover {
  border-color: #105446;
}

.card-thumbnail {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
}

.city-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.city-name {
  margin: 0;
  font-family: 'Didot', 'Playfair Display', Georgia, serif;
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
}

.trip-days {
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #105446;
}

.submit-time {
  margin: 8px 0 0;
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  color: #999999;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  padding: 6px 12px;
  border-radius: 20px;
}

.status-tag .status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-tag .status-text {
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 12px;
  font-weight: 500;
}

.status-designing {
  background: #fff3e0;
}

.status-designing .status-dot {
  background: #ff9800;
}

.status-designing .status-text {
  color: #e65100;
}

.status-delivered {
  background: #e8f5e9;
}

.status-delivered .status-dot {
  background: #4caf50;
}

.status-delivered .status-text {
  color: #2e7d32;
}

.status-revision {
  background: #fff8e1;
}

.status-revision .status-dot {
  background: #ffc107;
}

.status-revision .status-text {
  color: #f57c00;
}

.status-default {
  background: #f5f5f5;
}

.status-default .status-dot {
  background: #9e9e9e;
}

.status-default .status-text {
  color: #616161;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e5e5;
}

.pagination-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #e5e5e5;
  background: #ffffff;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666666;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #105446;
  color: #105446;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  color: #666666;
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
  }
  
  .sidebar-overlay {
    display: block;
  }
  
  .wishes-content {
    margin-left: 0;
    padding: 24px;
    padding-top: 80px;
  }
  
  .wishes-layout {
    flex-direction: column;
    gap: 24px;
  }
  
  .filter-sidebar {
    width: 100%;
  }
  
  .filter-nav {
    position: static;
  }
  
  .filter-list {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 8px;
  }
  
  .filter-item {
    flex-shrink: 0;
  }
  
  .filter-item span {
    white-space: nowrap;
    padding: 10px 20px;
  }
  
  .wish-card {
    flex-direction: column;
  }
  
  .card-thumbnail {
    width: 100%;
    height: 160px;
  }
  
  .card-header {
    flex-wrap: wrap;
  }
}
</style>