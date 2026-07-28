<template>
  <AccountPageShell
    active-page="trips"
    kicker="Journeys"
    title="My trips"
    description="Find every itinerary prepared for you, including the latest version and daily plan."
    :ready="ready"
  >
    <div class="trip-toolbar">
      <div class="filter-tabs" role="group" aria-label="Trip status">
        <button v-for="filter in filters" :key="filter.value" type="button" :class="{ active: activeFilter === filter.value }" @click="activeFilter = filter.value">{{ filter.label }}</button>
      </div>
      <span>{{ filteredTrips.length }} {{ filteredTrips.length === 1 ? 'trip' : 'trips' }}</span>
    </div>

    <div v-if="loading" class="content-state" role="status"><span class="state-spinner" />Building your trip list...</div>
    <div v-else-if="loadError" class="content-state error-state">
      <font-awesome-icon :icon="['fas', 'circle-exclamation']" />
      <strong>We could not load your trips.</strong><span>{{ loadError }}</span>
      <button type="button" @click="fetchTrips">Try again</button>
    </div>
    <div v-else-if="!filteredTrips.length" class="content-state empty-state">
      <div class="empty-symbol"><font-awesome-icon :icon="['fas', 'route']" /></div>
      <strong>{{ trips.length ? 'No trips match this filter' : 'No itineraries yet' }}</strong>
      <span>{{ trips.length ? 'Choose another view to see your trips.' : 'When a travel designer delivers your first itinerary, it will appear here.' }}</span>
      <NuxtLink v-if="!trips.length" to="/wish">View my wishes</NuxtLink>
    </div>

    <div v-else class="trip-grid">
      <article v-for="trip in filteredTrips" :key="trip.id" class="trip-card">
        <div class="trip-media">
          <img v-if="trip.coverImageUrl" :src="trip.coverImageUrl" :alt="trip.cityLabel || trip.title">
          <div v-else class="trip-placeholder"><font-awesome-icon :icon="['fas', 'compass']" /><span>{{ trip.cityLabel || 'China' }}</span></div>
          <span class="trip-status" :class="tripStatusClass(trip.wishStatus)">{{ trip.wishStatusLabel }}</span>
        </div>
        <div class="trip-body">
          <p class="trip-version">Version {{ trip.versionNo }} · {{ trip.itineraryTypeLabel || 'Custom itinerary' }}</p>
          <h2>{{ trip.title || `${trip.cityLabel} journey` }}</h2>
          <p class="trip-summary">{{ trip.summary || 'Your day-by-day Lvyv itinerary.' }}</p>
          <div class="trip-facts">
            <span><font-awesome-icon :icon="['fas', 'location-dot']" />{{ trip.cityLabel || 'China' }}</span>
            <span><font-awesome-icon :icon="['fas', 'calendar-days']" />{{ trip.dateText || `${trip.days.length} day plan` }}</span>
          </div>
        </div>
        <div class="trip-footer">
          <span>{{ trip.designerMessage ? 'Designed for you' : `Wish ${trip.wishNo}` }}</span>
          <button type="button" @click="selectedTrip = trip">View plan <font-awesome-icon :icon="['fas', 'arrow-right']" /></button>
        </div>
      </article>
    </div>

    <Teleport to="body">
      <div v-if="selectedTrip" class="modal-backdrop" @click.self="selectedTrip = null">
        <section class="trip-modal" role="dialog" aria-modal="true" aria-labelledby="trip-plan-title">
          <header>
            <div><p>{{ selectedTrip.cityLabel }} · Version {{ selectedTrip.versionNo }}</p><h2 id="trip-plan-title">{{ selectedTrip.title }}</h2></div>
            <button type="button" aria-label="Close" @click="selectedTrip = null">×</button>
          </header>
          <p v-if="selectedTrip.summary" class="modal-summary">{{ selectedTrip.summary }}</p>
          <div v-if="selectedTrip.days.length" class="day-list">
            <section v-for="day in selectedTrip.days" :key="day.id" class="day-section">
              <div class="day-number">Day {{ day.dayNo }}</div>
              <div class="day-content">
                <h3>{{ day.title }}</h3><p v-if="day.summary">{{ day.summary }}</p>
                <ol v-if="day.items?.length">
                  <li v-for="item in day.items" :key="item.id">
                    <span>{{ item.projectTypeLabel || 'Experience' }}</span>
                    <strong>{{ item.title }}</strong>
                    <p v-if="item.subtitle || item.address">{{ item.subtitle || item.address }}</p>
                  </li>
                </ol>
              </div>
            </section>
          </div>
          <div v-else class="no-days">The detailed day plan is being prepared.</div>
          <footer><button type="button" @click="selectedTrip = null">Close</button></footer>
        </section>
      </div>
    </Teleport>
  </AccountPageShell>
</template>

<script setup lang="ts">
import AccountPageShell from '~/components/profile/AccountPageShell.vue'

useNoIndex()

interface ApiResult<T> { code: number; msg?: string; data: T }
interface PageResult<T> { list: T[]; total: number; page: number; size: number }
interface WishSummary { id: number; wishNo: string; status: number; statusLabel: string; hasItinerary: boolean }
interface ItinerarySimple { id: number; versionNo: number }
interface WishDetail { wish: WishSummary; currentItinerary?: ItinerarySimple }
interface TripItemDetail { id: number; projectTypeLabel?: string; title: string; subtitle?: string; address?: string }
interface TripDay { id: number; dayNo: number; title: string; summary?: string; items: TripItemDetail[] }
interface Trip {
  id: number; wishId: number; wishNo: string; wishStatus: number; wishStatusLabel: string; versionNo: number
  itineraryTypeLabel?: string; title: string; cityLabel: string; coverImageUrl?: string; dateText?: string
  summary?: string; designerMessage?: string; days: TripDay[]
}

const { auth, ready, initializeAccount } = useAccountPage('/trips')
const config = useRuntimeConfig()
const route = useRoute()
const trips = ref<Trip[]>([])
const loading = ref(false)
const loadError = ref('')
const selectedTrip = ref<Trip | null>(null)
const activeFilter = ref<'all' | 'ready' | 'revision' | 'closed'>('all')
const filters = [{ value: 'all' as const, label: 'All' }, { value: 'ready' as const, label: 'Ready' }, { value: 'revision' as const, label: 'In revision' }, { value: 'closed' as const, label: 'Past' }]
const filteredTrips = computed(() => trips.value.filter((trip) => {
  if (activeFilter.value === 'ready') return trip.wishStatus === 30
  if (activeFilter.value === 'revision') return [40, 50].includes(trip.wishStatus)
  if (activeFilter.value === 'closed') return [80, 90].includes(trip.wishStatus)
  return true
}))
const headers = computed(() => ({ Authorization: `Bearer ${auth.token.value}`, 'Accept-Language': auth.member.value?.locale || 'en-US', 'X-Time-Zone': auth.member.value?.timezone || detectMemberTimeZone() }))

const fetchTrips = async () => {
  loading.value = true
  loadError.value = ''
  try {
    const wishResponse = await $fetch<ApiResult<PageResult<WishSummary>>>('/tour/wishes/page', { baseURL: config.public.apiBase as string, headers: headers.value, params: { page: 1, size: 100 } })
    if (wishResponse.code !== 200) throw new Error(wishResponse.msg || 'Request failed')
    const itineraryWishes = wishResponse.data.list.filter(wish => wish.hasItinerary)
    const detailResults = await Promise.allSettled(itineraryWishes.map(async (wish) => {
      const wishDetailResponse = await $fetch<ApiResult<WishDetail>>(`/tour/wishes/${wish.id}`, { baseURL: config.public.apiBase as string, headers: headers.value })
      const simple = wishDetailResponse.data.currentItinerary
      if (!simple) return null
      const itineraryResponse = await $fetch<ApiResult<Omit<Trip, 'wishNo' | 'wishStatus' | 'wishStatusLabel'>>>(`/tour/itineraries/${simple.id}`, { baseURL: config.public.apiBase as string, headers: headers.value })
      return { ...itineraryResponse.data, wishNo: wish.wishNo, wishStatus: wish.status, wishStatusLabel: wish.statusLabel } as Trip
    }))
    trips.value = detailResults.flatMap(result => result.status === 'fulfilled' && result.value ? [result.value] : [])
      .sort((left, right) => right.id - left.id)
    const selectedWishId = typeof route.query.wish === 'string' ? Number(route.query.wish) : 0
    if (selectedWishId) selectedTrip.value = trips.value.find(trip => trip.wishId === selectedWishId) || null
  } catch (caught) {
    loadError.value = caught instanceof Error ? caught.message : 'Request failed.'
  } finally {
    loading.value = false
  }
}

const tripStatusClass = (status: number) => status === 30 ? 'ready' : status >= 80 ? 'past' : status >= 40 ? 'revision' : 'working'
onMounted(async () => {
  if (!await initializeAccount()) return
  await fetchTrips()
})
</script>

<style scoped>
.trip-toolbar { min-height: 56px; display: flex; align-items: center; justify-content: space-between; gap: 18px; margin-bottom: 18px; padding-bottom: 15px; border-bottom: 1px solid #dfe5e1; }
.filter-tabs { display: flex; gap: 4px; padding: 4px; background: #e9eeea; }
.filter-tabs button { min-height: 34px; padding: 0 13px; border: 0; background: transparent; color: #66746d; font: 600 11px/1 'Inter', sans-serif; cursor: pointer; }
.filter-tabs button.active { background: #fff; color: #174d40; box-shadow: 0 1px 4px rgba(30, 54, 46, .1); }
.trip-toolbar > span { color: #849089; font-size: 11px; }
.trip-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.trip-card { min-width: 0; overflow: hidden; border: 1px solid #dfe5e1; background: #fff; transition: border-color .18s, box-shadow .18s; }
.trip-card:hover { border-color: #a9b9b0; box-shadow: 0 12px 28px rgba(26,55,46,.07); }
.trip-media { position: relative; aspect-ratio: 16 / 8; overflow: hidden; background: #dce7e1; }
.trip-media img { width: 100%; height: 100%; object-fit: cover; }
.trip-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; background: #dfe9e3; color: #426458; }
.trip-placeholder svg { font-size: 24px; }
.trip-placeholder span { font: 600 18px/1 'Playfair Display', Georgia, serif; }
.trip-status { position: absolute; top: 12px; right: 12px; padding: 6px 8px; background: #fff; font-size: 9px; font-weight: 800; text-transform: uppercase; box-shadow: 0 2px 7px rgba(20,45,36,.12); }
.trip-status.ready { color: #4e7126; }.trip-status.revision { color: #8b631d; }.trip-status.past { color: #6e7974; }.trip-status.working { color: #2c6245; }
.trip-body { padding: 21px 21px 18px; }
.trip-version { margin: 0 0 8px; color: #84918a; font-size: 9px; font-weight: 800; text-transform: uppercase; }
.trip-body h2 { margin: 0; color: #173f34; font: 600 23px/1.2 'Playfair Display', Georgia, serif; }
.trip-summary { display: -webkit-box; min-height: 41px; margin: 9px 0 15px; overflow: hidden; color: #6e7c75; font-size: 12px; line-height: 1.55; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.trip-facts { display: flex; flex-wrap: wrap; gap: 13px; padding-top: 14px; border-top: 1px solid #edf1ee; }
.trip-facts span { display: flex; align-items: center; gap: 6px; color: #65736c; font-size: 10px; }
.trip-facts svg { color: #789486; }
.trip-footer { min-height: 48px; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 0 21px; background: #f7f9f6; color: #89958f; font-size: 10px; }
.trip-footer button { padding: 0; border: 0; background: transparent; color: #174d40; font: 700 11px/1 'Inter', sans-serif; cursor: pointer; }
.trip-footer button svg { margin-left: 4px; }
.content-state { min-height: 340px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 9px; border: 1px solid #dfe5e1; background: #fff; color: #75827c; font-size: 13px; text-align: center; }
.content-state strong { color: #2e4137; font-size: 16px; }.content-state > span:not(.state-spinner) { max-width: 420px; line-height: 1.55; }
.content-state button, .content-state a { margin-top: 7px; padding: 10px 14px; border: 1px solid #174d40; background: #174d40; color: #fff; font-weight: 700; text-decoration: none; cursor: pointer; }
.error-state > svg { color: #a33e35; font-size: 24px; }.empty-symbol { width: 58px; height: 58px; display: grid; place-items: center; margin-bottom: 8px; border-radius: 50%; background: #edf3ee; color: #174d40; font-size: 22px; }
.state-spinner { width: 18px; height: 18px; border: 2px solid #ccd5d0; border-top-color: #174d40; border-radius: 50%; animation: spin .7s linear infinite; }
.modal-backdrop { position: fixed; z-index: 1500; inset: 0; display: grid; place-items: center; padding: 20px; background: rgba(11,28,22,.58); }
.trip-modal { width: min(720px, 100%); max-height: calc(100dvh - 40px); overflow-y: auto; padding: 30px; background: #fff; box-shadow: 0 24px 70px rgba(8,28,20,.3); }
.trip-modal header { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; padding-bottom: 20px; border-bottom: 1px solid #e1e7e2; }
.trip-modal header p { margin: 0 0 7px; color: #78877f; font-size: 10px; font-weight: 800; text-transform: uppercase; }
.trip-modal h2 { margin: 0; color: #173f34; font: 600 28px/1.2 'Playfair Display', Georgia, serif; }
.trip-modal header button { width: 34px; height: 34px; border: 0; background: #f0f3f0; color: #52605b; font-size: 23px; cursor: pointer; }
.modal-summary { margin: 20px 0; color: #64736c; font-size: 13px; line-height: 1.6; }
.day-list { display: grid; gap: 0; }.day-section { display: grid; grid-template-columns: 70px 1fr; gap: 18px; padding: 22px 0; border-bottom: 1px solid #e6ebe7; }
.day-number { color: #174d40; font-size: 11px; font-weight: 800; text-transform: uppercase; }.day-content h3 { margin: 0; color: #2a3c33; font-size: 16px; }.day-content > p { margin: 6px 0 0; color: #7a8780; font-size: 12px; }
.day-content ol { display: grid; gap: 13px; margin: 18px 0 0; padding: 0; list-style: none; }.day-content li { position: relative; display: flex; flex-direction: column; gap: 3px; padding-left: 16px; }.day-content li::before { position: absolute; top: 5px; left: 0; width: 6px; height: 6px; border-radius: 50%; background: #bfdc72; content: ''; }
.day-content li span { color: #829088; font-size: 9px; font-weight: 800; text-transform: uppercase; }.day-content li strong { color: #35473e; font-size: 13px; }.day-content li p { margin: 0; color: #7e8b84; font-size: 11px; }
.no-days { padding: 50px 0; color: #7b8881; text-align: center; font-size: 13px; }.trip-modal footer { display: flex; justify-content: flex-end; padding-top: 20px; }.trip-modal footer button { min-height: 42px; padding: 0 18px; border: 1px solid #174d40; background: #174d40; color: #fff; font-weight: 700; cursor: pointer; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width: 700px) { .trip-grid { grid-template-columns: 1fr; } .trip-toolbar { align-items: flex-start; flex-direction: column; } .filter-tabs { width: 100%; overflow-x: auto; } .filter-tabs button { flex: 1 0 auto; } .trip-modal { padding: 23px 18px; } .day-section { grid-template-columns: 1fr; gap: 8px; } }
</style>
