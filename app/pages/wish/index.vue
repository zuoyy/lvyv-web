<template>
  <div class="wish-page">
    <div v-if="!memberToken" class="wish-guest">
      <div class="blank-page-container">
        <div class="content-box">
          <h1 class="guest-title">Make a Wish.</h1>
          <p class="guest-subtitle">Tell us your dream China trip. A real human will handcraft it for you.</p>
          <button class="wish-start-btn-guest" @click="showAuthModal = true">
            Start Your Wish
          </button>
          <p class="guest-hint">
            Already have a wish?
            <NuxtLink to="/login?redirect=/my-wishes" class="guest-link">View My Wishes</NuxtLink>
          </p>
        </div>
      </div>
    </div>

    <div v-else class="wish-logged-in">
      <div class="wish-list-container">
        <div v-if="loading" class="wish-loading">
          <font-awesome-icon :icon="['fas', 'circle-notch']" class="loading-icon" spin />
          <p>Loading...</p>
        </div>

        <div v-else-if="wishes.length > 0" class="wish-list-section">
          <div class="wish-list-header">
            <h1 class="wish-list-title">My Wishes</h1>
            <p class="wish-list-desc">Track your travel wishlist and design progress</p>
          </div>

          <div class="wish-cards">
            <div
              v-for="wish in wishes"
              :key="wish.id"
              class="wish-card"
              :class="getStatusClass(wish.status)"
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
                <div class="status-tag" :class="getStatusTagClass(wish.status)">
                  <span class="status-dot"></span>
                  <span class="status-text">{{ wish.statusLabel }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="wish-empty">
          <div class="wish-empty-container">
            <h1 class="wish-empty-title">Make a Wish.</h1>
            <p class="wish-empty-subtitle">
              Tell us your dream China trip. A real human will handcraft it for you.
            </p>
            <button class="wish-start-btn" @click="handleStartWish">
              Start Your Wish
            </button>
            <p class="wish-empty-hint">
              Already have a wish?
              <NuxtLink to="/my-wishes" class="wish-empty-link">View My Wishes</NuxtLink>
            </p>
          </div>
        </div>
      </div>

      <button
        v-if="wishes.length > 0 && !loading"
        class="new-wish-fab"
        @click="handleStartWish"
      >
        <font-awesome-icon :icon="['fas', 'plus']" class="fab-icon" />
        <span class="fab-text">New Wish</span>
      </button>
    </div>

    <AuthModal
      v-model="showAuthModal"
      initial-tab="login"
      @success="handleAuthSuccess"
    />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { token: memberToken } = useMemberAuth()

const showAuthModal = ref(false)
const loading = ref(false)
const wishes = ref<WishItem[]>([])

interface WishItem {
  id: number
  wishNo: string
  cityCode: string
  cityLabel: string
  tripDays: number
  status: number
  statusLabel: string
  createTime: string
  hasItinerary: boolean
}

interface WishPageResponse {
  list: WishItem[]
  total: number
  page: number
  size: number
}

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

const getStatusTagClass = (status: number): string => {
  switch (status) {
    case 1: return 'tag-designing'
    case 2: return 'tag-delivered'
    case 3: return 'tag-revision'
    default: return 'tag-default'
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
  if (!memberToken.value) return

  loading.value = true
  try {
    const config = useRuntimeConfig()
    const token = useCookie<string | null>('token')

    const response = await $fetch<{ code: number; msg?: string; data: WishPageResponse }>(
      '/tour/wishes/page',
      {
        baseURL: config.public.apiBase as string,
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        params: {
          page: 1,
          size: 10
        }
      }
    )

    if (response.code === 200) {
      wishes.value = response.data.list
    }
  } catch (error) {
    console.error('Failed to fetch wishes:', error)
  } finally {
    loading.value = false
  }
}

const handleCardClick = (wish: WishItem) => {
  if (wish.status === 2 && wish.hasItinerary) {
    navigateTo(`/my-wishes/${wish.id}`)
  } else {
    navigateTo(`/my-wishes/${wish.id}`)
  }
}

const handleStartWish = () => {
  console.log('Start wish flow')
}

const handleAuthSuccess = () => {
  showAuthModal.value = false
}

onMounted(() => {
  if (route.query.showLogin === '1' && !memberToken.value) {
    showAuthModal.value = true
  }
  if (memberToken.value) {
    fetchWishes()
  }
})

watch(() => route.query.showLogin, (val) => {
  if (val === '1' && !memberToken.value) {
    showAuthModal.value = true
  }
})

watch(memberToken, (val) => {
  if (val && showAuthModal.value) {
    showAuthModal.value = false
  }
  if (val) {
    fetchWishes()
  }
})
</script>

<style scoped>
.wish-page {
  min-height: 100vh;
  background-color: #fcfdfa;
}

/* Guest state */
.wish-guest {
  min-height: 100vh;
}

.blank-page-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 100px 20px 80px 20px;
  background-color: #fcfdfa;
}

.content-box {
  background: #ffffff;
  border: 1px solid #e1e3db;
  border-radius: 16px;
  padding: 60px 40px;
  width: 100%;
  max-width: 600px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(21, 75, 63, 0.05);
}

.guest-title {
  font-family: 'Didot', 'Playfair Display', Georgia, serif;
  font-weight: 700;
  font-size: 36px;
  line-height: 44px;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.guest-subtitle {
  font-family: 'Inter', 'Source Han Sans SC', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #666666;
  margin-bottom: 32px;
}

.wish-start-btn-guest {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 48px;
  border: none;
  border-radius: 24px;
  background: #C0F177;
  color: #203d33;
  font-family: 'Inter', 'Source Han Sans SC', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
  animation: breathe 3s ease-in-out infinite;
}

.wish-start-btn-guest:hover {
  background: #b8e65c;
  box-shadow: 0 4px 16px rgba(192, 241, 119, 0.4);
}

.wish-start-btn-guest:active {
  transform: scale(0.98);
}

.guest-hint {
  margin-top: 24px;
  font-family: 'Inter', 'Source Han Sans SC', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  color: #666666;
}

.guest-link {
  color: #105446;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.guest-link:hover {
  color: #0d4238;
  text-decoration: underline;
}

/* Logged-in state */
.wish-logged-in {
  min-height: 100vh;
  position: relative;
}

.wish-list-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 100px 24px 120px;
}

.wish-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #808080;
  gap: 16px;
}

.loading-icon {
  font-size: 32px;
  color: #105446;
}

.wish-loading p {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  color: #666666;
  margin: 0;
}

/* Wish list section */
.wish-list-section {
  width: 100%;
}

.wish-list-header {
  margin-bottom: 32px;
}

.wish-list-title {
  font-family: 'Didot', 'Playfair Display', Georgia, serif;
  font-weight: 700;
  font-size: 36px;
  line-height: 44px;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.wish-list-desc {
  font-family: 'Inter', 'Source Han Sans SC', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 16px;
  color: #666666;
  margin: 0;
}

/* Wish cards */
.wish-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.wish-card {
  display: flex;
  gap: 20px;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.wish-card:hover {
  border-color: #105446;
  box-shadow: 0 4px 16px rgba(16, 84, 70, 0.1);
  transform: translateY(-2px);
}

.card-thumbnail {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  border-radius: 12px;
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
  min-width: 0;
}

.card-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.city-name {
  margin: 0;
  font-family: 'Didot', 'Playfair Display', Georgia, serif;
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.3;
}

.trip-days {
  flex-shrink: 0;
  font-family: 'Inter', 'Source Han Sans SC', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #105446;
}

.submit-time {
  margin: 8px 0 0;
  font-family: 'Inter', 'Source Han Sans SC', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #999999;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  padding: 6px 12px;
  border-radius: 20px;
  margin-top: 8px;
}

.status-tag .status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-tag .status-text {
  font-family: 'Inter', 'Source Han Sans SC', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 12px;
  font-weight: 500;
}

/* Designing - Yellow */
.tag-designing {
  background: #fff8e1;
}

.tag-designing .status-dot {
  background: #ffc107;
}

.tag-designing .status-text {
  color: #f57c00;
}

/* Delivered - Green */
.tag-delivered {
  background: #e8f5e9;
}

.tag-delivered .status-dot {
  background: #4caf50;
}

.tag-delivered .status-text {
  color: #2e7d32;
}

/* Revision - Blue */
.tag-revision {
  background: #e3f2fd;
}

.tag-revision .status-dot {
  background: #2196f3;
}

.tag-revision .status-text {
  color: #1565c0;
}

/* Default - Gray */
.tag-default {
  background: #f5f5f5;
}

.tag-default .status-dot {
  background: #9e9e9e;
}

.tag-default .status-text {
  color: #616161;
}

/* Empty state */
.wish-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.wish-empty-container {
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.wish-empty-title {
  font-family: 'Didot', 'Playfair Display', Georgia, serif;
  font-weight: 700;
  font-size: 36px;
  line-height: 44px;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.wish-empty-subtitle {
  font-family: 'Inter', 'Source Han Sans SC', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #666666;
  margin-bottom: 40px;
}

.wish-start-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 18px 56px;
  border: none;
  border-radius: 24px;
  background: #C0F177;
  color: #203d33;
  font-family: 'Inter', 'Source Han Sans SC', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
  animation: breathe 3s ease-in-out infinite;
}

.wish-start-btn:hover {
  background: #b8e65c;
  box-shadow: 0 6px 20px rgba(192, 241, 119, 0.5);
}

.wish-start-btn:active {
  transform: scale(0.98);
}

.wish-empty-hint {
  margin-top: 24px;
  font-family: 'Inter', 'Source Han Sans SC', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  color: #666666;
}

.wish-empty-link {
  color: #105446;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.wish-empty-link:hover {
  color: #0d4238;
  text-decoration: underline;
}

/* Floating action button */
.new-wish-fab {
  position: fixed;
  bottom: 32px;
  right: 32px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  border: none;
  border-radius: 28px;
  background: #C0F177;
  color: #203d33;
  font-family: 'Inter', 'Source Han Sans SC', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(192, 241, 119, 0.4);
  transition: all 0.2s ease;
  z-index: 100;
}

.new-wish-fab:hover {
  background: #b8e65c;
  box-shadow: 0 6px 24px rgba(192, 241, 119, 0.5);
  transform: translateY(-2px);
}

.new-wish-fab:active {
  transform: scale(0.98);
}

.fab-icon {
  font-size: 14px;
}

.fab-text {
  white-space: nowrap;
}

/* Breathing animation */
@keyframes breathe {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(192, 241, 119, 0.4);
  }
  50% {
    box-shadow: 0 0 0 12px rgba(192, 241, 119, 0);
  }
}

@media (max-width: 768px) {
  .wish-list-title,
  .wish-empty-title,
  .guest-title {
    font-size: 28px;
    line-height: 36px;
  }

  .wish-list-desc,
  .wish-empty-subtitle,
  .guest-subtitle {
    font-size: 15px;
    line-height: 22px;
  }

  .wish-start-btn {
    padding: 16px 40px;
    font-size: 16px;
  }

  .content-box {
    padding: 40px 24px;
  }

  .wish-list-container {
    padding: 80px 16px 100px;
  }

  .wish-card {
    gap: 16px;
    padding: 12px;
  }

  .card-thumbnail {
    width: 100px;
    height: 100px;
  }

  .city-name {
    font-size: 18px;
  }

  .new-wish-fab {
    bottom: 24px;
    right: 24px;
    padding: 12px 20px;
    font-size: 14px;
  }
}
</style>
