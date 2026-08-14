<template>
  <main class="my-wishes" aria-labelledby="my-wishes-title">
    <div class="my-wishes__backdrop" aria-hidden="true">
      <img src="/images/wish/my-wishes-bg.webp" alt="">
    </div>

    <section class="my-wishes__content">
      <h1 id="my-wishes-title" class="my-wishes__title">My Wishes</h1>

      <div v-if="loading" class="wish-carousel" aria-live="polite" aria-busy="true">
        <div class="wish-carousel__track wish-carousel__track--loading">
          <article v-for="item in 4" :key="item" class="wish-card wish-card--skeleton">
            <span class="wish-card__skeleton-image" />
            <span class="wish-card__skeleton-line wish-card__skeleton-line--title" />
            <span class="wish-card__skeleton-line" />
            <span class="wish-card__skeleton-line wish-card__skeleton-line--short" />
          </article>
        </div>
        <span class="sr-only">Loading wishes...</span>
      </div>

      <div v-else-if="loadError" class="wish-state wish-state--error" role="alert">
        <span class="wish-state__icon" aria-hidden="true"><font-awesome-icon :icon="['fas', 'circle-exclamation']" /></span>
        <h2>We couldn’t load your wishes</h2>
        <p>{{ loadError }}</p>
        <button type="button" @click="fetchWishes">Try again</button>
      </div>

      <div v-else-if="!wishes.length" class="wish-state wish-state--empty">
        <span class="wish-state__icon" aria-hidden="true"><font-awesome-icon :icon="['fas', 'heart']" /></span>
        <h2>Your first wish starts here</h2>
        <p>Tell us about the China journey you’re dreaming of.</p>
      </div>

      <div v-else class="wish-carousel">
        <button
          class="wish-carousel__arrow wish-carousel__arrow--previous"
          type="button"
          aria-label="Previous wishes"
          :disabled="!canScrollPrevious"
          @click="scrollWishes(-1)"
        >
          <font-awesome-icon :icon="['fas', 'chevron-left']" />
        </button>

        <div
          ref="wishTrack"
          class="wish-carousel__track"
          tabindex="0"
          aria-label="Your wishes"
          @scroll.passive="updateScrollState"
        >
          <article
            v-for="(wish, index) in wishes"
            :key="wish.id"
            class="wish-card"
            :class="{ 'wish-card--actionable': wish.hasItinerary }"
            :tabindex="wish.hasItinerary ? 0 : undefined"
            :role="wish.hasItinerary ? 'link' : undefined"
            :aria-label="wish.hasItinerary ? `View itinerary for ${wish.cityLabel || wish.cityCode}` : undefined"
            @click="openWish(wish)"
            @keydown.enter="openWish(wish)"
          >
            <div class="wish-card__image-wrap">
              <img
                class="wish-card__image"
                :src="imageForWish(wish)"
                :alt="`${wish.cityLabel || wish.cityCode} travel wish`"
                :loading="index < 4 ? 'eager' : 'lazy'"
              >
            </div>

            <div class="wish-card__body">
              <div class="wish-card__heading">
                <h2>{{ cityName(wish) }}</h2>
                <span class="wish-card__age">{{ relativeTime(wish.createTime) }}</span>
                <font-awesome-icon class="wish-card__open" :icon="['fas', 'arrow-up-right']" aria-hidden="true" />
              </div>

              <div class="wish-card__footer">
                <div class="wish-card__status">
                  <span class="wish-card__status-dot" :class="statusClass(wish.status)" aria-hidden="true" />
                  <span>{{ statusLabel(wish) }}</span>
                </div>
                <span class="wish-card__submitted">Submitted At: {{ formatSubmittedAt(wish.createTime) }}</span>
              </div>
            </div>
          </article>
        </div>

        <button
          class="wish-carousel__arrow wish-carousel__arrow--next"
          type="button"
          aria-label="Next wishes"
          :disabled="!canScrollNext"
          @click="scrollWishes(1)"
        >
          <font-awesome-icon :icon="['fas', 'chevron-right']" />
        </button>
      </div>

      <NuxtLink to="/wish/create" class="my-wishes__new">
        <span aria-hidden="true">+</span>
        <span>New wish</span>
      </NuxtLink>
    </section>
  </main>
</template>

<script setup lang="ts">
useNoIndex()

interface WishItem {
  id: number
  cityCode: string
  cityLabel: string
  status: string
  statusLabel: string
  createTime: string
  hasItinerary: boolean
  itineraryNo?: string
}

interface PageResult<T> {
  list: T[]
  total: number
  page: number
  size: number
}

interface ApiResult<T> {
  code: number
  msg?: string
  data: T
}

const { auth, initializeAccount } = useAccountPage('/wish/my')
const config = useRuntimeConfig()
const wishes = ref<WishItem[]>([])
const loading = ref(true)
const loadError = ref('')
const wishTrack = ref<HTMLElement | null>(null)
const canScrollPrevious = ref(false)
const canScrollNext = ref(false)

const cityImages: Record<string, string> = {
  BEIJING: '/images/wish/cards/beijing.webp',
  XIAN: '/images/wish/cards/xian.webp',
  CHENGDU: '/images/wish/cards/chengdu.webp',
  XIANBEIJING: '/images/wish/cards/xian-beijing.webp',
}

const fallbackImages = [
  '/images/wish/cards/beijing.webp',
  '/images/wish/cards/xian.webp',
  '/images/wish/cards/chengdu.webp',
  '/images/wish/cards/xian-beijing.webp',
]

const headers = computed(() => ({
  Authorization: `Bearer ${auth.token.value}`,
  'Accept-Language': auth.member.value?.locale || 'en-US',
  'X-Time-Zone': auth.member.value?.timezone || detectMemberTimeZone(),
}))

const fetchWishes = async () => {
  loading.value = true
  loadError.value = ''
  try {
    const response = await $fetch<ApiResult<PageResult<WishItem>>>('/tour/wishes/page', {
      baseURL: config.public.apiBase as string,
      headers: headers.value,
      params: { page: 1, size: 50 },
    })
    if (response.code !== 200) throw new Error(response.msg || 'Request failed')
    wishes.value = response.data.list
    await nextTick()
    updateScrollState()
  }
  catch (caught) {
    loadError.value = caught instanceof Error ? caught.message : 'Please try again in a moment.'
  }
  finally {
    loading.value = false
  }
}

const normalizeCity = (value: string) => value.toUpperCase().replace(/[^A-Z]/g, '')

const cityName = (wish: WishItem) => {
  const code = normalizeCity(wish.cityCode || wish.cityLabel || '')
  const labels: Record<string, string> = {
    BEIJING: 'Beijing',
    XIAN: 'XI’AN',
    CHENGDU: 'CHENGDU',
    XIANBEIJING: 'XI’AN+BEIJING',
  }
  return labels[code] || (wish.cityLabel || wish.cityCode || 'China').toUpperCase()
}

const imageForWish = (wish: WishItem) => {
  const code = normalizeCity(wish.cityCode || wish.cityLabel || '')
  return cityImages[code] || fallbackImages[Math.abs(Number(wish.id)) % fallbackImages.length]
}

const relativeTime = (value: string) => {
  const elapsed = Date.now() - new Date(value).getTime()
  if (!Number.isFinite(elapsed) || elapsed < 0) return 'Just now'
  const minutes = Math.floor(elapsed / 60_000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} ${days === 1 ? 'day' : 'days'} ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} ${months === 1 ? 'month' : 'months'} ago`
  const years = Math.floor(days / 365)
  return `${years} ${years === 1 ? 'year' : 'years'} ago`
}

const statusLabel = (wish: WishItem) => {
  const labels: Record<string, string> = {
    SUBMITTED: 'Submitted',
    ITINERARY_PLANNING: 'In Design',
    WAITING_CONFIRMATION: 'Ready to Review',
    WAITING_PAYMENT: 'Awaiting Payment',
    REVISION_REQUESTED: 'Revision Requested',
    REVISING: 'In Revision',
    DELIVERED: 'Delivered',
    CLOSED: 'Closed',
    CANCELLED: 'Cancelled',
  }
  return labels[wish.status] || wish.statusLabel || 'Submitted'
}

const statusClass = (status: string) => ({
  'is-delivered': status === 'DELIVERED',
  'is-designing': ['ITINERARY_PLANNING', 'REVISION_REQUESTED', 'REVISING'].includes(status),
  'is-ready': ['WAITING_CONFIRMATION', 'WAITING_PAYMENT'].includes(status),
  'is-muted': ['CLOSED', 'CANCELLED'].includes(status),
})

const formatSubmittedAt = (value: string) => {
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return value.replace('T', ' ').slice(0, 16)
  const twoDigits = (part: number) => String(part).padStart(2, '0')
  return `${date.getFullYear()}-${twoDigits(date.getMonth() + 1)}-${twoDigits(date.getDate())} ${twoDigits(date.getHours())}:${twoDigits(date.getMinutes())}`
}

const openWish = (wish: WishItem) => {
  if (!wish.hasItinerary) return
  const query = wish.itineraryNo ? `?itineraryNo=${encodeURIComponent(wish.itineraryNo)}` : ''
  navigateTo(`/trips${query}`)
}

const updateScrollState = () => {
  const track = wishTrack.value
  if (!track) return
  canScrollPrevious.value = track.scrollLeft > 2
  canScrollNext.value = track.scrollLeft + track.clientWidth < track.scrollWidth - 2
}

const scrollWishes = (direction: -1 | 1) => {
  const track = wishTrack.value
  if (!track) return
  track.scrollBy({ left: direction * track.clientWidth * 0.82, behavior: 'smooth' })
}

onMounted(async () => {
  if (!await initializeAccount()) return
  await fetchWishes()
  window.addEventListener('resize', updateScrollState)
})

onBeforeUnmount(() => window.removeEventListener('resize', updateScrollState))

useHead({
  title: 'My Wishes - Lvyv Travel',
  link: [
    { rel: 'preload', as: 'image', type: 'image/webp', href: '/images/wish/my-wishes-bg.webp', fetchpriority: 'high' },
  ],
})
</script>

<style scoped>
.my-wishes {
  position: relative;
  min-height: 100svh;
  overflow: hidden;
  isolation: isolate;
  background: #111e42;
  color: #fff;
}

.my-wishes__backdrop,
.my-wishes__backdrop img {
  position: absolute;
  inset: 0;
}

.my-wishes__backdrop {
  z-index: -1;
  overflow: hidden;
}

.my-wishes__backdrop img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.my-wishes__content {
  width: min(1180px, calc(100% - 120px));
  margin: 0 auto;
  padding: 156px 0 68px;
  text-align: center;
}

.my-wishes__title {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 17px;
  margin: 0;
  font: 400 58px/1.05 'Playfair Display', Georgia, serif;
  letter-spacing: -.035em;
  text-shadow: 0 2px 18px rgba(4, 15, 41, .2);
}

.my-wishes__title::before,
.my-wishes__title::after {
  width: 26px;
  height: 17px;
  border-top: 1px solid rgba(255, 255, 255, .55);
  border-bottom: 1px solid rgba(255, 255, 255, .28);
  content: '';
  transform: skewY(16deg);
}

.my-wishes__title::after {
  transform: scaleX(-1) skewY(16deg);
}

.wish-carousel {
  position: relative;
  margin-top: 72px;
}

.wish-carousel__track {
  display: grid;
  grid-auto-columns: 280px;
  grid-auto-flow: column;
  gap: 20px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}

.wish-carousel__track::-webkit-scrollbar {
  display: none;
}

.wish-card {
  position: relative;
  height: 250px;
  box-sizing: border-box;
  overflow: hidden;
  border: 0;
  border-radius: 12px;
  background: rgba(255, 255, 255, .2);
  box-shadow: inset 0 0 0 1.5px rgba(190, 167, 255, .24);
  scroll-snap-align: start;
  text-align: left;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease;
}

.wish-card--actionable {
  cursor: pointer;
}

.wish-card--actionable:hover,
.wish-card--actionable:focus-visible {
  box-shadow: inset 0 0 0 1.5px rgba(190, 167, 255, .24), 0 0 0 2px rgba(207, 243, 128, .34);
  outline: none;
  transform: translateY(-4px);
}

.wish-card__image-wrap {
  position: relative;
  height: 160px;
  margin: 10px 10px 0;
  overflow: hidden;
  border-radius: 10px;
}

.wish-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .45s ease;
}

.wish-card--actionable:hover .wish-card__image,
.wish-card--actionable:focus-visible .wish-card__image {
  transform: scale(1.035);
}

.wish-card__body {
  padding: 10px 10px 9px;
}

.wish-card__heading {
  display: flex;
  min-height: 24px;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.wish-card__heading h2 {
  max-width: 65%;
  margin: 0;
  overflow: hidden;
  color: #fff;
  font: 400 20px/1.2 'Inter', sans-serif;
  letter-spacing: -.02em;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wish-card__age {
  overflow: hidden;
  color: rgba(255, 255, 255, .74);
  font: 400 10px/1.2 'Inter', sans-serif;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wish-card__open {
  width: 20px;
  margin-left: auto;
  color: #cff380;
  font-size: 20px;
}

.wish-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 12px;
  white-space: nowrap;
}

.wish-card__status {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, .82);
  font: 400 10px/1.2 'Inter', sans-serif;
}

.wish-card__status-dot {
  width: 7px;
  height: 7px;
  flex: 0 0 7px;
  border-radius: 50%;
  background: #ffd24a;
  box-shadow: 0 0 9px rgba(255, 210, 74, .56);
}

.wish-card__status-dot.is-designing {
  background: #ff6a9e;
  box-shadow: 0 0 9px rgba(255, 106, 158, .55);
}

.wish-card__status-dot.is-ready {
  background: #51b7ff;
  box-shadow: 0 0 9px rgba(81, 183, 255, .55);
}

.wish-card__status-dot.is-delivered {
  background: #cff380;
  box-shadow: 0 0 9px rgba(207, 243, 128, .55);
}

.wish-card__status-dot.is-muted {
  background: #aab0bd;
  box-shadow: none;
}

.wish-card__submitted {
  overflow: hidden;
  color: rgba(255, 255, 255, .45);
  font: 400 8px/1.2 'Inter', sans-serif;
  letter-spacing: .01em;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wish-carousel__arrow {
  position: absolute;
  z-index: 2;
  top: 50%;
  display: grid;
  width: 44px;
  height: 54px;
  place-items: center;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #fff;
  font-size: 24px;
  transform: translateY(-50%);
  cursor: pointer;
  filter: drop-shadow(0 2px 6px rgba(4, 13, 34, .5));
  transition: color .2s ease, opacity .2s ease, transform .2s ease;
}

.wish-carousel__arrow:hover:not(:disabled) {
  color: #cff380;
  transform: translateY(-50%) scale(1.08);
}

.wish-carousel__arrow:disabled {
  opacity: .32;
  cursor: default;
}

.wish-carousel__arrow--previous {
  left: -58px;
}

.wish-carousel__arrow--next {
  right: -58px;
}

.my-wishes__new {
  display: inline-flex;
  width: min(400px, 100%);
  height: 60px;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin-top: 58px;
  border: 1px solid rgba(255, 255, 255, .14);
  border-radius: 10px;
  background: #cff380;
  box-shadow: 0 12px 28px rgba(7, 20, 41, .15), inset 1px 1px 1px rgba(255, 255, 255, .4);
  color: #203d33;
  font: 500 16px/1 'Inter', sans-serif;
  text-decoration: none;
  transition: background-color .2s ease, box-shadow .2s ease, transform .2s ease;
}

.my-wishes__new:hover,
.my-wishes__new:focus-visible {
  background: #ddff93;
  box-shadow: 0 15px 34px rgba(7, 20, 41, .22), 0 0 0 3px rgba(207, 243, 128, .18);
  outline: none;
  transform: translateY(-2px);
}

.wish-state {
  display: flex;
  min-height: 300px;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 31px;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, .22);
  border-radius: 12px;
  background: rgba(14, 28, 62, .28);
  box-shadow: 0 15px 34px rgba(5, 14, 39, .12);
  backdrop-filter: blur(11px);
  -webkit-backdrop-filter: blur(11px);
}

.wish-state__icon {
  display: grid;
  width: 50px;
  height: 50px;
  place-items: center;
  margin-bottom: 13px;
  border: 1px solid rgba(255, 255, 255, .28);
  border-radius: 50%;
  color: #cff380;
  font-size: 19px;
}

.wish-state h2 {
  margin: 0;
  font: 500 23px/1.25 'Playfair Display', Georgia, serif;
}

.wish-state p {
  max-width: 430px;
  margin: 9px 0 0;
  color: rgba(255, 255, 255, .68);
  font: 400 12px/1.6 'Inter', sans-serif;
}

.wish-state button {
  min-width: 132px;
  min-height: 40px;
  margin-top: 19px;
  border: 0;
  border-radius: 7px;
  background: #cff380;
  color: #203d33;
  font: 600 12px/1 'Inter', sans-serif;
  cursor: pointer;
}

.wish-carousel__track--loading {
  overflow: hidden;
}

.wish-card--skeleton {
  padding: 10px;
}

.wish-card__skeleton-image,
.wish-card__skeleton-line {
  display: block;
  border-radius: 5px;
  background: linear-gradient(90deg, rgba(255, 255, 255, .08), rgba(255, 255, 255, .18), rgba(255, 255, 255, .08));
  background-size: 220% 100%;
  animation: shimmer 1.25s ease-in-out infinite;
}

.wish-card__skeleton-image {
  height: 160px;
  margin-bottom: 14px;
  border-radius: 10px;
}

.wish-card__skeleton-line {
  width: 100%;
  height: 8px;
  margin-top: 13px;
}

.wish-card__skeleton-line--title {
  width: 62%;
  height: 13px;
  margin-top: 0;
}

.wish-card__skeleton-line--short {
  width: 46%;
}

@keyframes shimmer {
  to { background-position: -220% 0; }
}

@media (max-width: 1199px) {
  .my-wishes__content {
    width: calc(100% - 112px);
  }

  .wish-carousel__track {
    grid-auto-columns: min(280px, calc((100% - 40px) / 3));
  }
}

@media (max-width: 820px) {
  .my-wishes {
    overflow-y: auto;
  }

  .my-wishes__content {
    width: calc(100% - 64px);
    padding-top: 128px;
  }

  .my-wishes__title {
    font-size: 48px;
  }

  .wish-carousel__track {
    grid-auto-columns: calc((100% - 20px) / 2);
  }

  .wish-carousel__arrow--previous {
    left: -42px;
  }

  .wish-carousel__arrow--next {
    right: -42px;
  }
}

@media (max-width: 560px) {
  .my-wishes__backdrop img {
    object-position: 58% center;
  }

  .my-wishes__content {
    width: calc(100% - 32px);
    padding: 116px 0 42px;
  }

  .my-wishes__title {
    gap: 11px;
    font-size: 42px;
  }

  .my-wishes__title::before,
  .my-wishes__title::after {
    width: 18px;
  }

  .wish-carousel {
    margin-top: 38px;
  }

  .wish-carousel__track {
    grid-auto-columns: 84%;
    gap: 16px;
    margin-inline: -16px;
    padding-inline: 16px;
    scroll-padding-inline: 16px;
  }

  .wish-carousel__arrow {
    display: none;
  }

  .my-wishes__new {
    margin-top: 38px;
  }

  .wish-state {
    min-height: 286px;
    padding-inline: 22px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .wish-carousel__track {
    scroll-behavior: auto;
  }

  .wish-card,
  .wish-card__image,
  .my-wishes__new,
  .wish-carousel__arrow {
    transition: none;
  }

  .wish-card__skeleton-image,
  .wish-card__skeleton-line {
    animation: none;
  }
}
</style>
