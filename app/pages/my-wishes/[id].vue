<template>
  <div class="wish-detail-container">
    <button class="mobile-menu-btn" @click="showSidebar = true">
      <font-awesome-icon :icon="['fas', 'bars']" />
    </button>
    
    <div class="sidebar-overlay" v-if="showSidebar" @click="showSidebar = false"></div>
    
    <ProfileSidebar 
      v-model:activeTab="activeTab" 
      :show="showSidebar"
      @close="showSidebar = false"
    />
    
    <main class="wish-detail-content">
      <div class="content-wrapper">
        <div class="page-header">
          <button class="back-btn" @click="goBack">
            <font-awesome-icon :icon="['fas', 'chevron-left']" />
            <span>Back to My Wishes</span>
          </button>
        </div>
        
        <div class="loading-state" v-if="loading">
          <font-awesome-icon :icon="['fas', 'circle-notch']" class="loading-icon" spin />
          <p>Loading wish details...</p>
        </div>
        
        <template v-else-if="wishData">
          <div class="wish-hero">
            <div class="wish-hero-image">
              <img :src="getCityImage(wishData.wish.cityCode)" :alt="wishData.wish.cityLabel" />
            </div>
            <div class="wish-hero-info">
              <div class="wish-status-tag" :class="getStatusClass(wishData.wish.status)">
                <span class="status-dot"></span>
                <span class="status-text">{{ wishData.wish.statusLabel }}</span>
              </div>
              <h1 class="wish-city">{{ wishData.wish.cityLabel }}</h1>
              <p class="wish-days">{{ wishData.wish.tripDays }} days trip</p>
              <p class="wish-submit-time">Submitted on {{ formatDate(wishData.wish.createTime) }}</p>
              <div class="wish-action" v-if="wishData.wish.status === 2 && wishData.wish.hasItinerary && wishData.currentItinerary">
                <button class="view-itinerary-btn" @click="viewItinerary">
                  View Itinerary
                  <font-awesome-icon :icon="['fas', 'arrow-up-right-from-square']" />
                </button>
              </div>
            </div>
          </div>
          
          <div class="detail-sections">
            <div class="detail-card" v-if="wishData.wish.interests && wishData.wish.interests.length > 0">
              <h3 class="card-title">Interests</h3>
              <div class="interest-tags">
                <span 
                  v-for="interest in wishData.wish.interests" 
                  :key="interest.code"
                  class="interest-tag"
                >
                  {{ interest.label }}
                </span>
              </div>
            </div>
            
            <div class="detail-card" v-if="wishData.wish.budgetLevelLabel">
              <h3 class="card-title">Budget Level</h3>
              <p class="budget-label">{{ wishData.wish.budgetLevelLabel }}</p>
            </div>
            
            <div class="detail-card" v-if="wishData.wish.story">
              <h3 class="card-title">Your Story</h3>
              <p class="story-text">{{ wishData.wish.story }}</p>
            </div>
            
            <div class="detail-card" v-if="wishData.wish.specialRequirement">
              <h3 class="card-title">Special Requirements</h3>
              <p class="story-text">{{ wishData.wish.specialRequirement }}</p>
            </div>
            
            <div class="detail-card" v-if="wishData.currentItinerary">
              <h3 class="card-title">Current Itinerary</h3>
              <div class="itinerary-info">
                <p class="itinerary-title">{{ wishData.currentItinerary.title }}</p>
                <p class="itinerary-meta">
                  Version {{ wishData.currentItinerary.versionNo }}
                  <span class="dot-separator">·</span>
                  {{ wishData.currentItinerary.statusLabel }}
                </p>
              </div>
            </div>
            
            <div class="detail-card" v-if="wishData.revisions && wishData.revisions.length > 0">
              <h3 class="card-title">Revision History</h3>
              <div class="revision-list">
                <div 
                  v-for="revision in wishData.revisions" 
                  :key="revision.id"
                  class="revision-item"
                >
                  <div class="revision-header">
                    <span class="revision-status" :class="getRevisionStatusClass(revision.status)">
                      {{ revision.statusLabel }}
                    </span>
                    <span class="revision-date">{{ formatDate(revision.createTime) }}</span>
                  </div>
                  <div class="revision-content" v-if="revision.requestContent">
                    <p class="revision-label">Request</p>
                    <p class="revision-text">{{ revision.requestContent }}</p>
                  </div>
                  <div class="revision-content" v-if="revision.replyContent">
                    <p class="revision-label">Reply</p>
                    <p class="revision-text">{{ revision.replyContent }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProfileSidebar from '~/components/profile/ProfileSidebar.vue'

const auth = useMemberAuth()
const route = useRoute()
const activeTab = ref('my-wishes')
const showSidebar = ref(false)
const loading = ref(false)

interface Interest {
  code: string
  messageKey: string
  label: string
}

interface Wish {
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

interface CurrentItinerary {
  id: number
  itineraryType: string
  productCode: string
  productVersionNo: number
  currentVersion: boolean
  wishId: number
  versionNo: number
  wishItineraryStatus: number
  wishItineraryStatusMessageKey: string
  wishItineraryStatusLabel: string
  status: number
  statusMessageKey: string
  statusLabel: string
  title: string
}

interface Revision {
  id: number
  wishId: number
  fromItineraryId: number
  toItineraryId: number
  requestContent: string
  replyContent: string
  status: number
  statusMessageKey: string
  statusLabel: string
  createTime: string
  repliedTime: string
}

interface WishDetailResponse {
  wish: Wish
  currentItinerary: CurrentItinerary | null
  revisions: Revision[]
}

const wishData = ref<WishDetailResponse | null>(null)

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

const getRevisionStatusClass = (status: number): string => {
  switch (status) {
    case 1: return 'revision-pending'
    case 2: return 'revision-completed'
    case 3: return 'revision-rejected'
    default: return 'revision-default'
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

const goBack = () => {
  navigateTo('/my-wishes')
}

const viewItinerary = () => {
  if (wishData.value?.currentItinerary) {
    navigateTo(`/trip/${wishData.value.currentItinerary.id}`)
  }
}

const fetchWishDetail = async () => {
  if (!auth.token.value) return
  
  const wishId = route.params.id
  if (!wishId) return
  
  loading.value = true
  
  try {
    const config = useRuntimeConfig()
    const token = useCookie<string | null>('token')
    
    const response = await $fetch<{ code: number; msg?: string; data: WishDetailResponse }>(
      `/tour/wishes/${wishId}`,
      {
        baseURL: config.public.apiBase as string,
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      }
    )
    
    if (response.code === 200) {
      wishData.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch wish detail:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (!auth.token.value) {
    await navigateTo('/login?redirect=/my-wishes')
    return
  }
  
  await fetchWishDetail()
})
</script>

<style scoped>
.wish-detail-container {
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

.wish-detail-content {
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
  margin-bottom: 24px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: #105446;
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s;
}

.back-btn:hover {
  background: #e9f3ee;
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

.wish-hero {
  display: flex;
  gap: 32px;
  margin-bottom: 32px;
  padding: 32px;
  background: linear-gradient(135deg, #f8faf5 0%, #eef5ea 100%);
  border-radius: 16px;
}

.wish-hero-image {
  flex-shrink: 0;
  width: 200px;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
}

.wish-hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wish-hero-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.wish-status-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  padding: 6px 14px;
  border-radius: 20px;
  margin-bottom: 16px;
}

.wish-status-tag .status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.wish-status-tag .status-text {
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 12px;
  font-weight: 600;
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

.wish-city {
  margin: 0 0 8px;
  font-family: 'Didot', 'Playfair Display', Georgia, serif;
  font-size: 36px;
  font-weight: 700;
  color: #1a1a1a;
}

.wish-days {
  margin: 0 0 8px;
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #105446;
}

.wish-submit-time {
  margin: 0 0 20px;
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  color: #999999;
}

.view-itinerary-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  background: #105446;
  color: #ffffff;
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s;
  align-self: flex-start;
}

.view-itinerary-btn:hover {
  background: #0d4238;
}

.detail-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-card {
  padding: 24px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
}

.card-title {
  margin: 0 0 16px;
  font-family: 'Poppins', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.interest-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.interest-tag {
  padding: 6px 14px;
  background: #e9f3ee;
  color: #105446;
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 13px;
  font-weight: 500;
  border-radius: 20px;
}

.budget-label {
  margin: 0;
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 15px;
  color: #333333;
}

.story-text {
  margin: 0;
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  line-height: 1.7;
  color: #444444;
}

.itinerary-info {
  padding: 16px;
  background: #f9faf7;
  border-radius: 8px;
}

.itinerary-title {
  margin: 0 0 8px;
  font-family: 'Poppins', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
}

.itinerary-meta {
  margin: 0;
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 13px;
  color: #666666;
}

.dot-separator {
  margin: 0 8px;
  color: #cccccc;
}

.revision-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.revision-item {
  padding: 16px;
  background: #fafbf8;
  border-radius: 8px;
  border-left: 3px solid #105446;
}

.revision-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.revision-status {
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 12px;
}

.revision-pending {
  background: #fff3e0;
  color: #e65100;
}

.revision-completed {
  background: #e8f5e9;
  color: #2e7d32;
}

.revision-rejected {
  background: #ffebee;
  color: #c62828;
}

.revision-default {
  background: #f5f5f5;
  color: #616161;
}

.revision-date {
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 12px;
  color: #999999;
}

.revision-content {
  margin-top: 10px;
}

.revision-label {
  margin: 0 0 4px;
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #888888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.revision-text {
  margin: 0;
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #444444;
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
  }
  
  .sidebar-overlay {
    display: block;
  }
  
  .wish-detail-content {
    margin-left: 0;
    padding: 24px;
    padding-top: 80px;
  }
  
  .wish-hero {
    flex-direction: column;
    padding: 24px;
    gap: 20px;
  }
  
  .wish-hero-image {
    width: 100%;
    height: 180px;
  }
  
  .wish-city {
    font-size: 28px;
  }
}
</style>