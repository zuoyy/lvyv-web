<template>
  <main class="journey-page">
    <div class="journey-container">
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <NuxtLink to="/encounters">{{ cityLabel }}</NuxtLink>
        <span aria-hidden="true">›</span>
        <span>{{ journeyTitle }}</span>
      </nav>

      <div v-if="loading" class="journey-loading" role="status" aria-live="polite">
        <span />
        Loading encounter details...
      </div>

      <div v-else-if="loadError" class="journey-loading journey-error" role="alert">
        {{ loadError }}
      </div>

      <section v-else class="journey-shell" aria-labelledby="journey-title">
        <div class="journey-content">
          <header class="journey-heading">
            <h1 id="journey-title">{{ journeyTitle }}</h1>
            <p v-if="productFeatures.length">
              <template v-for="(feature, index) in productFeatures" :key="feature">
                <span v-if="index" />{{ feature }}
              </template>
            </p>
          </header>

          <section :class="['gallery', `gallery--${Math.min(galleryImages.length, 3)}`]" aria-label="Encounter photos">
            <button class="gallery__main" type="button" @click="openPhoto(galleryImages[0]!)">
              <img :src="galleryImages[0]" :alt="detail.title">
            </button>
            <button v-if="galleryImages[1]" type="button" @click="openPhoto(galleryImages[1])">
              <img :src="galleryImages[1]" :alt="`${cityLabel} encounter photo 2`">
            </button>
            <button v-if="galleryImages[2]" type="button" @click="openPhoto(galleryImages[2])">
              <img :src="galleryImages[2]" :alt="`${cityLabel} encounter photo 3`">
              <span class="gallery__count"><i aria-hidden="true" />All photos ({{ galleryImages.length }})</span>
            </button>
          </section>

          <section class="itinerary" aria-labelledby="itinerary-title">
            <div class="itinerary__title-row">
              <h2 id="itinerary-title">{{ detail.days.length }}-day itinerary</h2>
            </div>

            <div class="itinerary__actions">
              <button class="download-button" type="button" @click="downloadItinerary">
                <span aria-hidden="true">⇩</span>
                Download itinerary PDF
              </button>
              <button class="expand-button" type="button" @click="toggleAllDays">
                {{ allDaysOpen ? 'Collapse all' : 'Expand all' }}
                <i :class="{ open: allDaysOpen }" aria-hidden="true" />
              </button>
            </div>

            <div class="day-list">
              <article v-for="day in detail.days" :key="day.dayNo" class="day-item">
                <button
                  class="day-item__heading"
                  type="button"
                  :aria-expanded="openDays.has(day.dayNo)"
                  @click="toggleDay(day.dayNo)"
                >
                  <strong>Day {{ day.dayNo }}</strong>
                  <span>{{ day.title }}<template v-if="day.summary"> · {{ day.summary }}</template></span>
                  <i :class="{ open: openDays.has(day.dayNo) }" aria-hidden="true" />
                </button>

                <div v-if="openDays.has(day.dayNo)" class="day-item__content">
                  <div v-for="(item, itemIndex) in day.items" :key="`${day.dayNo}-${itemIndex}-${item.title}`" class="schedule-item">
                    <div class="schedule-item__line">
                      <span :class="['schedule-icon', `schedule-icon--${iconType(item.projectType)}`]" aria-hidden="true">
                        <font-awesome-icon :icon="['fas', iconName(item.projectType)]" />
                      </span>
                      <div>
                        <p><strong v-if="itemTime(item)">{{ itemTime(item) }}</strong>{{ item.title }}</p>
                        <small v-if="item.description || item.address">{{ item.description || item.address }}</small>
                      </div>
                    </div>

                    <div v-if="item.projectImageUrls.length" class="activity-cards">
                      <button
                        v-for="(image, imageIndex) in item.projectImageUrls"
                        :key="image"
                        class="activity-card"
                        type="button"
                        :aria-label="`Preview ${item.title} photo ${imageIndex + 1}`"
                        @click="openPhoto(image)"
                      >
                        <img :src="image" :alt="`${item.title} photo ${imageIndex + 1}`">
                        <span>{{ item.title }}</span>
                      </button>
                    </div>
                  </div>

                  <p v-if="!day.items.length" class="empty-day">More local experiences are being arranged for this day.</p>
                </div>
              </article>
            </div>
          </section>
        </div>

        <aside class="booking-panel" aria-label="Choose departure date and travelers">
          <div class="date-range">
            <time :datetime="departureDate">{{ shortDate(departureDate) }}</time>
            <span aria-hidden="true">⟶</span>
            <time :datetime="endDate">{{ shortDate(endDate) }}</time>
          </div>

          <div class="calendar">
            <div class="calendar__heading">
              <button type="button" aria-label="Previous month" @click="changeMonth(-1)">‹</button>
              <strong>{{ monthLabel }}</strong>
              <button type="button" aria-label="Next month" @click="changeMonth(1)">›</button>
            </div>
            <div class="calendar__weekdays" aria-hidden="true">
              <span v-for="weekday in weekdays" :key="weekday">{{ weekday }}</span>
            </div>
            <div class="calendar__days">
              <span v-for="blank in calendarLeadingBlanks" :key="`blank-${blank}`" />
              <button
                v-for="day in calendarDayCount"
                :key="day"
                type="button"
                :class="calendarDayClass(day)"
                :disabled="isPastCalendarDay(day)"
                :aria-label="calendarAriaLabel(day)"
                @click="selectCalendarDay(day)"
              >
                {{ day }}
              </button>
            </div>
          </div>

          <div class="traveler-row">
            <div>
              <strong>Adults</strong>
              <span>{{ detail.adultAgeLabel }}</span>
            </div>
            <div class="stepper">
              <button type="button" :disabled="adults <= 1" aria-label="Remove adult" @click="adults--">−</button>
              <strong>{{ adults }}</strong>
              <button type="button" aria-label="Add adult" @click="adults++">+</button>
            </div>
          </div>

          <div class="traveler-row">
            <div>
              <strong>Children</strong>
              <span>{{ detail.childAgeLabel }}</span>
            </div>
            <div class="stepper">
              <button type="button" :disabled="children <= 0" aria-label="Remove child" @click="children--">−</button>
              <strong>{{ children }}</strong>
              <button type="button" aria-label="Add child" @click="children++">+</button>
            </div>
          </div>

          <div class="booking-total">
            <p>Total <strong>{{ formatPrice(detail.salePrice * (adults + children)) }}</strong></p>
            <span v-if="detail.priceNote">{{ detail.priceNote }}</span>
          </div>

          <button class="next-button" type="button" @click="bookNow">Next</button>
        </aside>
      </section>
    </div>

    <Teleport to="body">
      <div v-if="activePhoto" class="photo-modal" role="dialog" aria-modal="true" aria-label="Encounter photo preview" @click.self="closePhoto">
        <button class="photo-modal__close" type="button" aria-label="Close photo preview" @click="closePhoto">×</button>
        <button v-if="previewImages.length > 1" class="photo-modal__nav photo-modal__nav--previous" type="button" aria-label="Previous photo" @click.stop="previousPhoto">‹</button>
        <img :src="activePhoto" :alt="`${detail.title} photo ${activePhotoIndex + 1}`">
        <button v-if="previewImages.length > 1" class="photo-modal__nav photo-modal__nav--next" type="button" aria-label="Next photo" @click.stop="nextPhoto">›</button>
        <p class="photo-modal__counter">{{ activePhotoIndex + 1 }} / {{ previewImages.length }}</p>
      </div>
    </Teleport>
  </main>
</template>

<script setup lang="ts">
interface DetailItem {
  title: string
  description?: string
  address?: string
  projectType?: string
  startTime?: string
  endTime?: string
  timeText?: string
  projectImageUrls: string[]
}

interface DetailDay {
  dayNo: number
  title: string
  summary?: string
  items: DetailItem[]
}

interface EncounterDetail {
  productCode: string
  title: string
  cityCode: string
  destinationName?: string
  imageUrls: string[]
  summary: string
  currency: string
  listPrice: number
  salePrice: number
  dateText: string
  serviceLanguages: string[]
  travelType?: string
  guaranteedDeparture: boolean
  shoppingPolicy?: string
  adultAgeLabel: string
  childAgeLabel: string
  minimumAdvanceDays: number
  priceNote?: string
  days: DetailDay[]
}

const route = useRoute()
const commerce = useTourCommerce()
const productCode = computed(() => String(route.params.productCode || ''))

const detail = ref<EncounterDetail>({
  productCode: productCode.value,
  title: '',
  cityCode: '',
  imageUrls: [],
  summary: '',
  currency: 'USD',
  listPrice: 0,
  salePrice: 0,
  dateText: '',
  serviceLanguages: [],
  guaranteedDeparture: false,
  adultAgeLabel: 'Adults',
  childAgeLabel: 'Children',
  minimumAdvanceDays: 1,
  days: []
})

const loading = ref(true)
const loadError = ref('')
const activePhoto = ref('')
const adults = ref(1)
const children = ref(0)
const openDays = ref(new Set<number>())
const openDaysBeforePrint = ref<Set<number> | null>(null)
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const calculateEarliestDate = (minimumAdvanceDays = 1) => {
  const date = new Date()
  date.setHours(12, 0, 0, 0)
  date.setDate(date.getDate() + Math.max(1, minimumAdvanceDays))
  return date.toISOString().slice(0, 10)
}
const earliestDate = ref(calculateEarliestDate())
const departureDate = ref(earliestDate.value)
const initialMonth = new Date(`${earliestDate.value}T12:00:00`)
const calendarYear = ref(initialMonth.getFullYear())
const calendarMonth = ref(initialMonth.getMonth())

const normalizeCity = (city: string) => city.toLowerCase().replace(/[^a-z]/g, '')
const cityLabel = computed(() => detail.value.destinationName || ({ xian: "Xi'an", chengdu: 'Chengdu', beijing: 'Beijing' }[normalizeCity(detail.value.cityCode)] || detail.value.cityCode))
const duration = computed(() => detail.value.dateText.trim() || `${detail.value.days.length}D${Math.max(0, detail.value.days.length - 1)}N`)
const journeyTitle = computed(() => [duration.value, detail.value.travelType, detail.value.title].filter(Boolean).join(' · '))
const allDaysOpen = computed(() => detail.value.days.length > 0 && detail.value.days.every(day => openDays.value.has(day.dayNo)))
const productFeatures = computed(() => [
  ...detail.value.serviceLanguages,
  detail.value.guaranteedDeparture ? 'Guaranteed Departure' : '',
  detail.value.shoppingPolicy
].filter((value): value is string => Boolean(value?.trim())))

const endDate = computed(() => {
  const date = new Date(`${departureDate.value}T12:00:00`)
  date.setDate(date.getDate() + Math.max(0, detail.value.days.length - 1))
  return date.toISOString().slice(0, 10)
})

const monthLabel = computed(() => new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(calendarYear.value, calendarMonth.value, 1)))
const calendarLeadingBlanks = computed(() => new Date(calendarYear.value, calendarMonth.value, 1).getDay())
const calendarDayCount = computed(() => new Date(calendarYear.value, calendarMonth.value + 1, 0).getDate())
const galleryImages = computed(() => detail.value.imageUrls.filter((image, index, all) => Boolean(image) && all.indexOf(image) === index))
const previewImages = computed(() => [...new Set([
  ...galleryImages.value,
  ...detail.value.days.flatMap(day => day.items.flatMap(item => item.projectImageUrls))
])])

const title = computed(() => `${detail.value.title} | Lvyv`)
useSeoMeta({
  title,
  description: computed(() => detail.value.summary || `Explore ${cityLabel.value} with a handcrafted Lvyv encounter.`),
  ogTitle: title,
  ogImage: computed(() => detail.value.imageUrls[0] ? absoluteUrl(detail.value.imageUrls[0]) : undefined)
})
useHead(() => ({ link: [{ rel: 'canonical', href: absoluteUrl(`/encounters/${encodeURIComponent(productCode.value)}`) }] }))

const formatPrice = (value: number) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: detail.value.currency || 'USD',
  maximumFractionDigits: 0
}).format(value)

const mapCatalog = (catalog: import('~/composables/useTourCommerce').CatalogProductView): EncounterDetail => {
  const listPrice = Number(catalog.pricing?.listUnitPrice ?? catalog.price?.listPrice ?? 0)
  const salePrice = Number(catalog.pricing?.saleUnitPrice ?? catalog.price?.salePrice ?? listPrice)
  const mappedDays = catalog.itinerary.days.map(day => ({
    dayNo: day.dayNo,
    title: day.title || `Day ${day.dayNo}`,
    summary: day.summary,
    items: day.items.map(item => ({
      title: String(item.title || 'Local encounter'),
      description: typeof item.description === 'string' ? item.description : undefined,
      address: typeof item.address === 'string' ? item.address : undefined,
      projectType: typeof item.projectType === 'string' ? item.projectType : undefined,
      startTime: typeof item.startTime === 'string' ? item.startTime : undefined,
      endTime: typeof item.endTime === 'string' ? item.endTime : undefined,
      timeText: typeof item.timeText === 'string' ? item.timeText : undefined,
      projectImageUrls: Array.isArray(item.projectImageUrls) ? item.projectImageUrls : []
    }))
  }))

  return {
    productCode: catalog.product.productCode,
    title: catalog.product.name || catalog.itinerary.title,
    cityCode: catalog.itinerary.cityCode,
    destinationName: catalog.product.destinationName,
    imageUrls: catalog.itinerary.imageUrls || [],
    summary: catalog.product.summary || catalog.itinerary.summary || '',
    currency: catalog.price?.currency || 'USD',
    listPrice,
    salePrice,
    dateText: catalog.itinerary.dateText || '',
    serviceLanguages: catalog.serviceLanguages || [],
    travelType: catalog.product.travelType,
    guaranteedDeparture: Boolean(catalog.product.guaranteedDeparture),
    shoppingPolicy: catalog.product.shoppingPolicy,
    adultAgeLabel: catalog.product.adultAgeLabel || 'Adults',
    childAgeLabel: catalog.product.childAgeLabel || 'Children',
    minimumAdvanceDays: Math.max(1, Number(catalog.product.minimumAdvanceDays || 1)),
    priceNote: catalog.product.priceNote,
    days: mappedDays
  }
}

const load = async () => {
  loading.value = true
  loadError.value = ''
  try {
    detail.value = mapCatalog(await commerce.getCatalogProduct(productCode.value))
    if (!detail.value.imageUrls.length) throw new Error('This encounter does not have a published image gallery.')
    earliestDate.value = calculateEarliestDate(detail.value.minimumAdvanceDays)
    departureDate.value = earliestDate.value
    const firstAvailableMonth = new Date(`${earliestDate.value}T12:00:00`)
    calendarYear.value = firstAvailableMonth.getFullYear()
    calendarMonth.value = firstAvailableMonth.getMonth()
  } catch (caught) {
    loadError.value = caught instanceof Error ? caught.message : 'Could not load this encounter.'
  } finally {
    const initiallyOpen = detail.value.days[0]
    openDays.value = new Set(initiallyOpen ? [initiallyOpen.dayNo] : [])
    loading.value = false
  }
}

const shortDate = (value: string) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T12:00:00`))
const dateForCalendarDay = (day: number) => new Date(calendarYear.value, calendarMonth.value, day, 12)
const dateKey = (date: Date) => date.toISOString().slice(0, 10)
const isPastCalendarDay = (day: number) => dateKey(dateForCalendarDay(day)) < earliestDate.value
const calendarAriaLabel = (day: number) => new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(dateForCalendarDay(day))
const calendarDayClass = (day: number) => {
  const key = dateKey(dateForCalendarDay(day))
  return {
    'range-start': key === departureDate.value,
    'range-end': key === endDate.value,
    'in-range': key > departureDate.value && key < endDate.value
  }
}

const selectCalendarDay = (day: number) => {
  if (isPastCalendarDay(day)) return
  departureDate.value = dateKey(dateForCalendarDay(day))
}

const changeMonth = (offset: number) => {
  const next = new Date(calendarYear.value, calendarMonth.value + offset, 1)
  calendarYear.value = next.getFullYear()
  calendarMonth.value = next.getMonth()
}

const toggleDay = (dayNo: number) => {
  const next = new Set(openDays.value)
  if (next.has(dayNo)) next.delete(dayNo)
  else next.add(dayNo)
  openDays.value = next
}

const toggleAllDays = () => {
  openDays.value = allDaysOpen.value ? new Set() : new Set(detail.value.days.map(day => day.dayNo))
}

const iconType = (type = '') => {
  const normalized = type.toLowerCase()
  if (/transport|transfer|vehicle|car/.test(normalized)) return 'transport'
  if (/meal|food|breakfast|lunch|dinner/.test(normalized)) return 'meal'
  return 'attraction'
}

const iconName = (type = '') => {
  const kind = iconType(type)
  if (kind === 'transport') return 'car'
  if (kind === 'meal') return 'utensils'
  return 'location-dot'
}

const itemTime = (item: DetailItem) => item.timeText?.trim() || item.startTime?.slice(0, 5) || ''

const activePhotoIndex = computed(() => Math.max(0, previewImages.value.indexOf(activePhoto.value)))
const showPhoto = (index: number) => {
  const count = previewImages.value.length
  if (!count) return
  activePhoto.value = previewImages.value[(index + count) % count] || ''
}
const openPhoto = (image: string) => {
  const index = previewImages.value.indexOf(image)
  showPhoto(index >= 0 ? index : 0)
}
const previousPhoto = () => showPhoto(activePhotoIndex.value - 1)
const nextPhoto = () => showPhoto(activePhotoIndex.value + 1)
const closePhoto = () => { activePhoto.value = '' }
const handlePhotoKeydown = (event: KeyboardEvent) => {
  if (!activePhoto.value) return
  if (event.key === 'ArrowLeft') previousPhoto()
  if (event.key === 'ArrowRight') nextPhoto()
  if (event.key === 'Escape') closePhoto()
}
const restoreDaysAfterPrint = () => {
  if (!openDaysBeforePrint.value) return
  openDays.value = openDaysBeforePrint.value
  openDaysBeforePrint.value = null
}

const downloadItinerary = async () => {
  if (!import.meta.client) return
  openDaysBeforePrint.value = new Set(openDays.value)
  openDays.value = new Set(detail.value.days.map(day => day.dayNo))
  await nextTick()
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
  window.print()
}
const bookNow = async () => navigateTo({
  path: '/checkout',
  query: { product: detail.value.productCode, date: departureDate.value, adultCount: String(adults.value), childCount: String(children.value) }
})

onMounted(() => {
  load()
  window.addEventListener('keydown', handlePhotoKeydown)
  window.addEventListener('afterprint', restoreDaysAfterPrint)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handlePhotoKeydown)
  window.removeEventListener('afterprint', restoreDaysAfterPrint)
})
</script>

<style scoped>
.journey-page {
  min-height: 100vh;
  padding: 80px 0 96px;
  background: #f5f6f5;
  color: #1f332c;
}

.journey-page section { padding: 0; }

.journey-container {
  width: calc(100% - 160px);
  max-width: 1280px;
  margin: 0 auto;
}

.breadcrumbs {
  height: 85px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #52645d;
  font: 400 12px/1.2 'Inter', sans-serif;
}

.breadcrumbs a { color: #52645d; text-decoration: none; }
.breadcrumbs span:last-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.journey-shell {
  display: grid;
  grid-template-columns: minmax(0, 850px) 398px;
  align-items: start;
  gap: 32px;
  background: transparent;
}

.journey-content {
  min-width: 0;
  min-height: 1485px;
  padding: 35px 36px 62px;
  overflow: hidden;
  border-radius: 16px;
  background: #fff;
}

.journey-heading h1 {
  margin: 0;
  color: #1d3029;
  font: 700 20px/1.35 'Inter', sans-serif;
}

.journey-heading p {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 21px 0 0;
  color: #53635d;
  font: 400 11px/1 'Inter', sans-serif;
}

.journey-heading p span { width: 1px; height: 10px; background: #aeb7b3; }

.gallery {
  height: 320px;
  display: grid;
  grid-template-columns: 1.62fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 12px;
  margin-top: 26px;
  overflow: hidden;
  border-radius: 7px;
}

.gallery button {
  position: relative;
  min-width: 0;
  padding: 0;
  overflow: hidden;
  border: 0;
  background: #e4e8e5;
  cursor: pointer;
}

.gallery__main { grid-row: 1 / 3; }
.gallery--1 { display: block; }
.gallery--1 .gallery__main { width: 100%; height: 100%; }
.gallery--2 { grid-template-rows: 1fr; }
.gallery--2 .gallery__main { grid-row: auto; }
.gallery img { width: 100%; height: 100%; display: block; object-fit: cover; transition: transform .25s ease; }
.gallery button:hover img { transform: scale(1.02); }

.gallery__count {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(15, 31, 25, .52);
  color: #fff;
  font: 500 11px/1 'Inter', sans-serif;
}

.gallery__count i {
  position: relative;
  width: 17px;
  height: 12px;
  border: 1px solid #fff;
}

.gallery__count i::after {
  position: absolute;
  right: 3px;
  bottom: 2px;
  left: 3px;
  height: 4px;
  border: 1px solid #fff;
  border-top: 0;
  content: '';
}

.itinerary { margin-top: 41px; }
.itinerary__title-row h2 { margin: 0; color: #1d3029; font: 700 24px/1.2 'Inter', sans-serif; }

.itinerary__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 22px;
}

.download-button,
.expand-button {
  border: 0;
  background: transparent;
  color: #6d7c76;
  font: 400 11px/1 'Inter', sans-serif;
  cursor: pointer;
}

.download-button {
  height: 32px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  border: 1px solid #9aa59f;
  border-radius: 4px;
}

.download-button span { color: #687970; font-size: 14px; }
.expand-button { display: inline-flex; align-items: center; gap: 9px; padding: 8px 3px; }
.expand-button i,
.day-item__heading i { width: 7px; height: 7px; border-right: 1px solid #42564e; border-bottom: 1px solid #42564e; transform: rotate(45deg); transition: transform .2s ease; }
.expand-button i.open,
.day-item__heading i.open { transform: rotate(225deg); }

.day-list { margin-top: 17px; border-top: 1px solid #dce1de; }
.day-item { border-bottom: 1px solid #dce1de; }

.day-item__heading {
  width: 100%;
  min-height: 55px;
  display: grid;
  grid-template-columns: 62px minmax(0, 1fr) 14px;
  align-items: center;
  gap: 12px;
  padding: 10px 4px 10px 0;
  border: 0;
  background: #fff;
  color: #1c3028;
  text-align: left;
  cursor: pointer;
}

.day-item__heading strong { font: 700 12px/1.2 'Inter', sans-serif; }
.day-item__heading > span { font: 500 12px/1.45 'Inter', sans-serif; }
.day-item__content { padding: 7px 17px 24px 70px; }
.schedule-item { position: relative; }
.schedule-item + .schedule-item { margin-top: 27px; }
.schedule-item:not(:last-child)::before {
  position: absolute;
  top: 22px;
  bottom: -29px;
  left: 11.5px;
  width: 1px;
  background: #d6ded9;
  content: '';
}

.schedule-item__line { position: relative; z-index: 1; display: flex; align-items: flex-start; gap: 10px; }
.schedule-item__line p { margin: 0; color: #1d3029; font: 500 11px/1.45 'Inter', sans-serif; }
.schedule-item__line p strong { margin-right: 2px; font-weight: 800; }
.schedule-item__line small { display: block; margin-top: 3px; color: #79857f; font: 400 10px/1.4 'Inter', sans-serif; }

.schedule-icon {
  position: relative;
  width: 24px;
  height: 24px;
  display: grid;
  flex: 0 0 24px;
  place-items: center;
  background: #fff;
  color: #1d3029;
}
.schedule-icon svg { display: block; width: 17px; height: 17px; }
.schedule-icon--transport svg { width: 18px; height: 18px; }
.schedule-icon--meal svg { width: 15px; height: 18px; }
.schedule-icon--attraction svg { position: absolute; top: 2px; left: 7.5px; width: 9px; height: 12px; z-index: 1; }
.schedule-icon--attraction::after {
  position: absolute;
  left: 3px;
  bottom: 3px;
  width: 16px;
  height: 6px;
  border: 1.5px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  content: '';
}

.activity-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin: 16px 0 0 32px;
}

.activity-card { min-width: 0; margin: 0; padding: 0; overflow: hidden; border: 1px solid #e1e5e3; border-radius: 6px; background: #fff; cursor: pointer; }
.activity-cards img { width: 100%; height: 132px; display: block; object-fit: cover; }
.activity-card > span { display: block; overflow: hidden; padding: 9px 8px; color: #42544d; font: 400 10px/1 'Inter', sans-serif; text-align: center; text-overflow: ellipsis; white-space: nowrap; }
.activity-card:hover img { transform: scale(1.025); }
.activity-card img { transition: transform .25s ease; }
.empty-day { margin: 0; color: #728079; font: 400 11px/1.5 'Inter', sans-serif; }

.booking-panel {
  position: sticky;
  top: 80px;
  padding: 35px 32px 30px;
  overflow: hidden;
  border-radius: 16px;
  background: #fff;
}

.date-range {
  height: 54px;
  display: grid;
  grid-template-columns: 1fr 30px 1fr;
  align-items: center;
  padding: 0 9px;
  border-bottom: 1px solid #dfe4e1;
  color: #263a32;
  font: 500 12px/1 'Inter', sans-serif;
}

.date-range span { color: #586a62; text-align: center; }
.date-range time:last-child { text-align: right; }

.calendar { padding: 24px 8px 18px; border-bottom: 1px solid #e0e5e2; }
.calendar__heading { display: grid; grid-template-columns: 30px 1fr 30px; align-items: center; }
.calendar__heading strong { color: #263a32; font: 700 13px/1 'Inter', sans-serif; text-align: center; }
.calendar__heading button { width: 30px; height: 30px; border: 0; background: transparent; color: #41554d; font-size: 19px; cursor: pointer; }
.calendar__weekdays,
.calendar__days { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; }
.calendar__weekdays { margin-top: 18px; color: #87918d; font: 400 9px/1 'Inter', sans-serif; }
.calendar__days { margin-top: 12px; row-gap: 8px; }

.calendar__days button,
.calendar__days > span {
  height: 34px;
  border: 0;
  background: transparent;
  color: #34483f;
  font: 400 10px/1 'Inter', sans-serif;
}

.calendar__days button { cursor: pointer; }
.calendar__days button:disabled { color: #c3cac6; cursor: not-allowed; }
.calendar__days button.in-range { background: #dff0c8; }
.calendar__days button.range-start,
.calendar__days button.range-end { border-radius: 50%; background: #325c4c; color: #fff; font-weight: 700; }
.calendar__days button.range-start + .in-range { box-shadow: -10px 0 0 #dff0c8; }

.traveler-row {
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

.traveler-row + .traveler-row { border-top: 1px solid #edf0ee; }
.traveler-row > div:first-child { display: flex; align-items: baseline; gap: 9px; }
.traveler-row > div:first-child strong { color: #263a32; font: 600 12px/1 'Inter', sans-serif; }
.traveler-row > div:first-child span { color: #84908a; font: 400 10px/1 'Inter', sans-serif; }

.stepper { display: flex; align-items: center; gap: 14px; }
.stepper button { width: 23px; height: 23px; display: grid; place-items: center; padding: 0; border: 1px solid #789076; border-radius: 50%; background: #fff; color: #335849; font: 400 16px/1 'Inter', sans-serif; cursor: pointer; }
.stepper button:disabled { opacity: .35; cursor: not-allowed; }
.stepper strong { min-width: 12px; color: #263a32; font: 600 12px/1 'Inter', sans-serif; text-align: center; }

.booking-total { margin-top: 19px; padding-top: 22px; border-top: 1px solid #e0e5e2; }
.booking-total p { margin: 0; color: #263a32; font: 700 15px/1 'Inter', sans-serif; }
.booking-total strong { margin-left: 4px; font: 800 24px/1 'Inter', sans-serif; }
.booking-total span { display: block; margin-top: 5px; color: #6f7c76; font: 400 9px/1 'Inter', sans-serif; }

.next-button { width: 100%; height: 42px; margin-top: 23px; border: 0; border-radius: 22px; background: #315b4b; color: #fff; font: 600 12px/1 'Inter', sans-serif; cursor: pointer; }
.next-button:hover { background: #244b3d; }

.journey-loading {
  min-height: 640px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;
  background: #fff;
  color: #68766f;
  font: 400 13px/1 'Inter', sans-serif;
}

.journey-loading span { width: 17px; height: 17px; border: 2px solid #dbe2de; border-top-color: #315b4b; border-radius: 50%; animation: spin .8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.photo-modal { position: fixed; inset: 0; z-index: 3000; display: flex; align-items: center; justify-content: center; padding: 64px 96px; background: rgba(7, 20, 15, .9); }
.photo-modal img { max-width: min(1100px, calc(100vw - 210px)); max-height: calc(100vh - 128px); border-radius: 8px; object-fit: contain; }
.photo-modal__close,
.photo-modal__nav { position: fixed; display: grid; place-items: center; padding: 0; border: 1px solid rgba(255,255,255,.55); border-radius: 50%; background: rgba(16, 35, 28, .38); color: #fff; cursor: pointer; }
.photo-modal__close { top: 22px; right: 27px; width: 42px; height: 42px; font-size: 28px; }
.photo-modal__nav { top: 50%; width: 50px; height: 50px; font-size: 38px; transform: translateY(-50%); }
.photo-modal__nav--previous { left: 25px; }
.photo-modal__nav--next { right: 25px; }
.photo-modal__close:hover,
.photo-modal__nav:hover { background: rgba(255,255,255,.16); }
.photo-modal__counter { position: fixed; bottom: 22px; left: 50%; margin: 0; color: #fff; font: 500 13px/1 'Inter', sans-serif; transform: translateX(-50%); }

@media (max-width: 1100px) {
  .journey-container { width: calc(100% - 48px); }
  .journey-shell { grid-template-columns: minmax(0, 1fr) 340px; gap: 24px; }
  .journey-content { padding-right: 28px; padding-left: 28px; }
  .booking-panel { padding-right: 24px; padding-left: 24px; }
}

@media (max-width: 850px) {
  .journey-page { padding-top: 72px; }
  .journey-container { width: calc(100% - 32px); }
  .breadcrumbs { height: 68px; }
  .journey-shell { grid-template-columns: 1fr; gap: 16px; }
  .journey-content { border-right: 0; }
  .booking-panel { position: static; border-top: 1px solid #e1e6e3; }
}

@media (max-width: 560px) {
  .journey-container { width: 100%; }
  .breadcrumbs { padding: 0 16px; }
  .journey-content { min-height: 0; padding: 26px 16px 42px; border-radius: 0; }
  .journey-heading h1 { font-size: 17px; }
  .journey-heading p { flex-wrap: wrap; line-height: 1.5; }
  .gallery { height: auto; display: flex; flex-wrap: wrap; gap: 7px; }
  .gallery__main { height: 200px; flex: 0 0 100%; }
  .gallery button:not(.gallery__main) { height: 100px; flex: 1 1 calc(50% - 4px); }
  .itinerary { margin-top: 32px; }
  .itinerary__title-row h2 { font-size: 21px; }
  .day-item__heading { grid-template-columns: 48px minmax(0, 1fr) 12px; gap: 8px; }
  .day-item__content { padding-left: 48px; }
  .activity-cards { grid-template-columns: 1fr 1fr; margin-left: 0; }
  .activity-card:last-child { display: none; }
  .activity-cards img { height: 116px; }
  .photo-modal { padding: 60px 54px; }
  .photo-modal img { max-width: calc(100vw - 108px); max-height: calc(100vh - 120px); }
  .photo-modal__nav { width: 40px; height: 40px; font-size: 30px; }
  .photo-modal__nav--previous { left: 8px; }
  .photo-modal__nav--next { right: 8px; }
  .booking-panel { padding: 27px 16px 30px; border-radius: 0; }
}

@media print {
  @page { size: A4 portrait; margin: 14mm; }

  :global(.navbar),
  :global(.footer),
  :global(.mobile-menu-backdrop),
  :global(.mobile-menu-drawer),
  .breadcrumbs,
  .journey-heading,
  .gallery,
  .booking-panel,
  .itinerary__actions,
  .photo-modal { display: none !important; }

  .journey-page { min-height: 0; padding: 0; background: #fff; }
  .journey-container { width: 100%; margin: 0; }
  .journey-shell { display: block; min-height: 0; }
  .journey-content { min-height: 0; padding: 0; border: 0; border-radius: 0; }
  .itinerary { margin: 0; }
  .itinerary__title-row { margin-bottom: 8mm; }
  .itinerary__title-row h2 { font-size: 22px; }
  .day-item { break-inside: avoid-page; page-break-inside: avoid; }
  .day-item__heading { cursor: default; }
  .day-item__heading > i { display: none; }
  .activity-card { break-inside: avoid; page-break-inside: avoid; }
  .activity-card:hover img { transform: none; }
}
</style>
