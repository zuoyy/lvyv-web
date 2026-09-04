<template>
  <div class="checkout-page-shell">
    <div class="checkout-green-banner" aria-hidden="true" />
    <CheckoutHeader />
    <div class="checkout-body-backdrop" aria-hidden="true" />

    <div class="checkout-page">
      <div v-if="loading" class="checkout-state">
        <div class="checkout-spinner" />
        <span>Loading checkout...</span>
      </div>
      <div v-else-if="error" class="checkout-state error">
        <p>{{ error }}</p>
        <button type="button" @click="load">Try again</button>
      </div>
      <section v-else class="checkout-layout">
      <div class="checkout-main">
        <!-- Card 1: Journey summary & Contact info -->
        <article class="checkout-card journey-card">
          <div class="journey-title-row">
            <h1>{{ catalog?.product.name || 'Xi’an Encounter 4D3N: Where Ancient Meets Modern' }}</h1>
          </div>

          <div class="journey-meta">
            <span class="meta-item meta-location">
              <font-awesome-icon :icon="faLocationDot" class="meta-icon" aria-hidden="true" />
              <span>{{ displayCityName }}</span>
            </span>
            <span class="meta-item meta-date">
              <font-awesome-icon :icon="faCalendarDays" class="meta-icon" aria-hidden="true" />
              <span>{{ dateRangeText }}</span>
            </span>
            <span class="meta-item meta-travelers">
              <font-awesome-icon :icon="faUsers" class="meta-icon" aria-hidden="true" />
              <span>{{ adultCount + childCount }} travelers</span>
            </span>
            <button type="button" class="change-button" @click="handleBackToEncounter">
              <span>Change</span>
              <font-awesome-icon :icon="faPenToSquare" class="change-icon" aria-hidden="true" />
            </button>
          </div>

          <div class="card-divider" />

          <div class="contact-section">
            <h2>Contact info</h2>
            <p class="helper">In Order To Help Us Avoid Any Delays In Contacting You, Please Ensure Your Contact Info Is Filled Out Correctly</p>

            <div class="contact-fields">
              <div class="field-row">
                <label class="form-field">
                  <span class="field-label">First name</span>
                  <input v-model.trim="contact.firstName" autocomplete="given-name" required maxlength="64" placeholder="Your first name" class="field-input">
                </label>
                <label class="form-field">
                  <span class="field-label">Last name</span>
                  <input v-model.trim="contact.lastName" autocomplete="family-name" required maxlength="64" placeholder="Your last name" class="field-input">
                </label>
              </div>

              <label class="form-field full-width">
                <span class="field-label">Email</span>
                <input v-model.trim="contact.email" type="email" autocomplete="email" required maxlength="128" placeholder="you@example.com" class="field-input">
              </label>

              <label class="form-field full-width">
                <span class="field-label">Phone number</span>
                <input v-model.trim="contact.phone" autocomplete="tel" required maxlength="32" placeholder="Your phone number" class="field-input">
              </label>

              <div class="field-row">
                <label class="form-field">
                  <span class="field-label">Country</span>
                  <SearchCodeSelect
                    v-model="contact.country"
                    input-id="checkout-country"
                    placeholder="Search country"
                    :options="countryOptions"
                    required
                    @update:model-value="contact.state = ''"
                  />
                </label>
                <label class="form-field">
                  <span class="field-label">State / province</span>
                  <SearchCodeSelect
                    v-model="contact.state"
                    input-id="checkout-state"
                    placeholder="Search state or province"
                    :options="stateOptions"
                    :disabled="!contact.country"
                    required
                  />
                </label>
              </div>

            </div>
          </div>
        </article>

        <!-- Card 2: Coupons, Points, Terms & Payment -->
        <article class="checkout-card terms-card">
          <div class="coupon-section">
            <label class="form-field full-width">
              <span class="field-label">Coupon</span>
              <div class="select-wrapper">
                <select v-model="selectedCouponId" class="field-select" @change="refreshQuote">
                  <option :value="undefined">No coupon</option>
                  <option v-for="coupon in coupons" :key="coupon.coupon.id" :value="coupon.coupon.id">
                    {{ coupon.template.name }} · {{ couponLabel(coupon) }}
                  </option>
                </select>
                <span class="select-chevron" aria-hidden="true" />
              </div>
            </label>

            <div v-if="isLoggedIn" class="redeem-row">
              <input v-model="redeemCode" placeholder="Have a coupon code?" class="field-input redeem-input">
              <button type="button" class="redeem-button" @click="redeem">Apply</button>
            </div>
            <p v-if="redeemMessage" class="feedback">{{ redeemMessage }}</p>
          </div>

          <div class="points-section">
            <h2>Lvyv Points</h2>
            <div class="points-info-row">
              <span class="points-badge">Save</span>
              <span class="points-text">Use {{ requestedPoints || 0 }} Lvyv Points ({{ pointsPerUsd }} points = 1 USD) on this order.</span>
            </div>
            <div class="points-info-divider" />
            <div class="points-info-row">
              <span class="points-badge">Earn</span>
              <span class="points-text">{{ itineraryCompletedPointsText }} Lvyv Coins After Your Trip</span>
            </div>

            <div v-if="isLoggedIn" class="points-controls">
              <input
                v-model.number="requestedPoints"
                type="number"
                min="0"
                :step="1"
                class="field-input points-input"
                placeholder="Points to use"
                @input="scheduleQuoteRefresh"
              >
              <button type="button" class="use-all-button" @click="useAllPoints">
                Use all available points ({{ availablePoints }})
              </button>
            </div>
          </div>

          <div class="card-divider" />

          <!-- Agreement checkbox -->
          <label class="agreement-label">
            <input v-model="agreed" type="checkbox" required class="agreement-native-checkbox">
            <span class="agreement-circle" aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="none" class="check-icon">
                <path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <span class="agreement-content">
              <span class="agreement-terms">
                I have read and agree to Lvyv's <a href="/terms" target="_blank">Terms of Use</a>, <a href="/terms" target="_blank">Privacy Statement</a>, <a href="/terms" target="_blank">Booking Notices</a>, <a href="/terms" target="_blank">Terms and Conditions</a>, and <a href="/terms" target="_blank">Travel Declaration for Seniors/Pregnant Women</a>.
              </span>
              <span class="agreement-note">
                We securely save your traveler and contact details to make future bookings easier. You can review, update, or delete them at any time.
              </span>
              <span class="agreement-note">
                Your booking will be confirmed once payment is complete.
              </span>
            </span>
          </label>

          <button class="pay-button" type="button" :disabled="!canSubmit" @click="submit">
            {{ submitting ? 'Creating order...' : 'Pay' }}
          </button>
        </article>
      </div>

      <!-- Right Column: Price details -->
      <aside v-if="quote" class="checkout-summary">
        <h2>Price details</h2>

        <div class="summary-line base-row">
          <span class="summary-label">Base tour fee</span>
          <strong class="summary-value">US${{ formatPrice(quote.listSubtotal) }}</strong>
        </div>

        <div class="summary-line">
          <span class="summary-label">Adults</span>
          <span class="summary-formula">US$ {{ formatPrice(quote.adultSaleUnitPrice) }}×{{ quote.adultCount }}</span>
        </div>

        <div v-if="quote.childCount > 0" class="summary-line">
          <span class="summary-label">Children</span>
          <span class="summary-formula">US$ {{ formatPrice(quote.childSaleUnitPrice) }}×{{ quote.childCount }}</span>
        </div>

        <div v-if="Number(quote.promotionDiscountAmount) > 0" class="summary-line discount-line">
          <span class="summary-label">Promotion</span>
          <strong class="summary-value discount-val">- US${{ formatPrice(quote.promotionDiscountAmount) }}</strong>
        </div>

        <div v-if="Number(quote.couponDiscountAmount) > 0" class="summary-line discount-line">
          <span class="summary-label">Coupon</span>
          <strong class="summary-value discount-val">- US${{ formatPrice(quote.couponDiscountAmount) }}</strong>
        </div>

        <div v-if="Number(quote.pointsAmount) > 0" class="summary-line discount-line">
          <span class="summary-label">Lvyv Points</span>
          <strong class="summary-value discount-val">- US${{ formatPrice(quote.pointsAmount) }}</strong>
        </div>

        <div class="summary-dashed-divider" />

        <div class="summary-line total-line">
          <span class="total-label">Total</span>
          <strong class="total-value">US${{ formatPrice(quote.totalAmount) }}</strong>
        </div>

        <div class="earn-points-banner">
          <font-awesome-icon :icon="faCoins" class="earn-icon" aria-hidden="true" />
          <p class="earn-text">
            Earn <strong class="earn-highlight">{{ paymentSuccessPointsText }} Points</strong> After Successful Order Placement.
          </p>
        </div>
      </aside>
      <aside v-else-if="quoteLoading" class="checkout-summary checkout-summary-loading" aria-label="Loading price details">
        <h2>Price details</h2>
        <div class="summary-skeleton summary-skeleton-wide" />
        <div class="summary-skeleton" />
        <div class="summary-skeleton" />
        <div class="summary-skeleton summary-skeleton-total" />
      </aside>
      <aside v-else-if="quoteError" class="checkout-summary checkout-summary-error">
        <h2>Price details</h2>
        <p>{{ quoteError }}</p>
        <button type="button" @click="refreshQuote">Try again</button>
      </aside>
    </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import CheckoutHeader from '~/components/checkout/CheckoutHeader.vue'
import type { MemberProfile } from '~/composables/useMemberAuth'
import type { MemberCouponView, OrderPricingQuote, PointsEarnRule } from '~/composables/useTourCommerce'
import type { BillingDetails, CatalogProductView } from '~/composables/useTourCommerce'
import SearchCodeSelect from '~/components/payment/SearchCodeSelect.vue'
import { allCountries } from 'country-region-data'
import { passportCountryOptions } from '~/utils/countries'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCalendarDays, faLocationDot, faPenToSquare, faUsers, faCoins } from '@fortawesome/free-solid-svg-icons'

definePageMeta({
  layout: false
})

useNoIndex()
useHead({
  htmlAttrs: { style: 'background-color: #203d33;' },
  bodyAttrs: { style: 'background-color: #203d33; margin: 0; padding: 0;' }
})
const route = useRoute()
const commerce = useTourCommerce()
const auth = useMemberAuth()
const isLoggedIn = computed(() => Boolean(auth.token.value))
const productCode = computed(() => String(route.query.product || ''))

const dateAfter = (days: number) => {
  const date = new Date()
  date.setHours(12, 0, 0, 0)
  date.setDate(date.getDate() + days)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const earliestStartDate = ref(dateAfter(1))
const adultCount = ref(Math.max(1, Number(route.query.adultCount || 1)))
const childCount = ref(Math.max(0, Number(route.query.childCount || 0)))
const requestedDate = typeof route.query.date === 'string' ? route.query.date : ''
const startDate = ref(requestedDate >= earliestStartDate.value ? requestedDate : earliestStartDate.value)
const selectedCouponId = ref<number | undefined>(undefined)
const requestedPoints = ref(0)
const availablePoints = ref(0)
const pointsPerUsd = ref(100)
const pointsEarnRules = ref<PointsEarnRule[]>([])
const coupons = ref<MemberCouponView[]>([])
const quote = ref<OrderPricingQuote | null>(null)
const quoteError = ref('')
const catalog = ref<CatalogProductView | null>(null)
const agreed = ref(false)

const contact = reactive<BillingDetails>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  country: '',
  state: ''
})

const countryOptions = passportCountryOptions
const stateOptions = computed(() => {
  const country = allCountries.find((entry) => entry[1] === contact.country)
  return country
    ? country[2].map(([name, code]) => ({ name, code })).sort((a, b) => a.name.localeCompare(b.name, 'en'))
    : []
})

const hasCompleteContactDetails = computed(() => {
  const email = contact.email.trim()
  return Boolean(
    contact.firstName.trim()
    && contact.lastName.trim()
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    && contact.phone.trim()
    && contact.country.trim()
    && contact.state.trim()
  )
})

const redeemCode = ref('')
const redeemMessage = ref('')
const loading = ref(true)
const quoteLoading = ref(false)
const submitting = ref(false)
const error = ref('')
let quoteRefreshTimer: ReturnType<typeof setTimeout> | undefined
let quoteRequestId = 0

const canSubmit = computed(() => Boolean(
  agreed.value
  && hasCompleteContactDetails.value
  && !submitting.value
  && !loading.value
  && catalog.value
  && quote.value
  && !quoteLoading.value
))

const displayCityName = computed(() => {
  const code = (catalog.value?.product.cityCode || '').toLowerCase()
  if (code === 'xian') return "Xi'an"
  if (code === 'chengdu') return 'Chengdu'
  if (code === 'chongqing') return 'Chongqing'
  return catalog.value?.product.cityCode || "Xi'an"
})

const durationDays = computed(() => {
  return Math.max(1, catalog.value?.itinerary?.days?.length || 1)
})

const dateRangeText = computed(() => {
  if (!startDate.value) return ''
  const days = durationDays.value
  if (days <= 1) return startDate.value
  const d = new Date(startDate.value + 'T12:00:00')
  d.setDate(d.getDate() + (days - 1))
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${startDate.value}-${year}-${month}-${day}`
})

const formatPrice = (val: unknown) => {
  const num = Number(val)
  return isNaN(num) ? '0.00' : num.toFixed(2)
}

const earnRulePoints = (ruleCode: PointsEarnRule['ruleCode']) => {
  const rule = pointsEarnRules.value.find((item) => item.ruleCode === ruleCode)
  return rule?.points == null ? '...' : Number(rule.points).toLocaleString('en-US')
}

const paymentSuccessPointsText = computed(() => earnRulePoints('PAYMENT_SUCCESS'))
const itineraryCompletedPointsText = computed(() => earnRulePoints('ITINERARY_COMPLETED'))

const couponLabel = (coupon: MemberCouponView) =>
  coupon.template.discountType === 'PERCENT'
    ? `${coupon.template.discountValue}% off`
    : `USD ${coupon.template.discountValue} off`

const handleBackToEncounter = () => {
  if (productCode.value) {
    navigateTo({
      path: `/encounters/${encodeURIComponent(productCode.value)}`,
      query: {
        date: startDate.value,
        adultCount: String(adultCount.value),
        childCount: String(childCount.value)
      }
    })
  } else {
    navigateTo('/encounters')
  }
}

const refreshQuote = async () => {
  const requestId = ++quoteRequestId
  quoteLoading.value = true
  if (!productCode.value) {
    error.value = 'A product is required.'
    quoteLoading.value = false
    return
  }
  if (!startDate.value) {
    error.value = 'A departure date is required.'
    quote.value = null
    quoteLoading.value = false
    return
  }
  try {
    const nextQuote = await commerce.previewStandardOrder(
      productCode.value,
      Math.max(1, adultCount.value),
      Math.max(0, childCount.value),
      startDate.value,
      selectedCouponId.value,
      isLoggedIn.value ? requestedPoints.value : 0
    )
    if (requestId !== quoteRequestId) return
    quote.value = nextQuote
    quoteError.value = ''
  } catch (caught) {
    if (requestId !== quoteRequestId) return
    quoteError.value = caught instanceof Error ? caught.message : 'Could not calculate the price.'
  } finally {
    if (requestId === quoteRequestId) quoteLoading.value = false
  }
}

const scheduleQuoteRefresh = () => {
  if (quoteRefreshTimer) clearTimeout(quoteRefreshTimer)
  quoteRefreshTimer = setTimeout(() => {
    quoteRefreshTimer = undefined
    void refreshQuote()
  }, 250)
}

const applyMemberContact = (member: MemberProfile) => {
  contact.firstName = member.firstName || ''
  contact.lastName = member.lastName || ''
  contact.email = member.email || ''
  contact.phone = member.mobile || ''
  contact.country = (member.country || '').toUpperCase()
  contact.state = (member.stateProvince || '').toUpperCase()
}

const load = async () => {
  // Catalog, quote, benefits, and member profile are independent requests.
  // Keep them concurrent, but hydrate the contact form before exposing it for editing.
  loading.value = true
  error.value = ''
  if (!productCode.value) {
    error.value = 'A product is required.'
    loading.value = false
    return
  }

  quoteLoading.value = true

  void commerce.getCatalogProduct(productCode.value)
    .then((loadedCatalog) => {
      catalog.value = loadedCatalog
      earliestStartDate.value = dateAfter(Math.max(1, Number(loadedCatalog.product.minimumAdvanceDays || 1)))
      const dateWasAdjusted = !requestedDate || requestedDate < earliestStartDate.value
      if (dateWasAdjusted) startDate.value = earliestStartDate.value
      if (dateWasAdjusted) void refreshQuote()
    })
    .catch((caught) => {
      error.value = caught instanceof Error ? caught.message : 'Could not load checkout.'
    })

  // Quote calculation does not need the full itinerary response, so start it
  // alongside the catalog request and keep the summary on its own skeleton.
  void refreshQuote()
  void commerce.getPointsEarnRules()
    .then((rules) => { pointsEarnRules.value = rules })
    .catch(() => { pointsEarnRules.value = [] })
  if (isLoggedIn.value) {
    void commerce.listCoupons()
      .then((availableCoupons) => { coupons.value = availableCoupons })
      .catch(() => undefined)
    void Promise.all([commerce.getPointsAccount(), commerce.getPointsRedemptionConfig()])
      .then(([account, config]) => {
        availablePoints.value = account.availablePoints
        pointsPerUsd.value = config.pointsPerUsd
      })
      .catch(() => undefined)
  }

  if (isLoggedIn.value) {
    try {
      const member = auth.member.value || await auth.loadMember()
      if (member) applyMemberContact(member)
    } catch {
      auth.clearSession()
    }
  }
  loading.value = false
}

const redeem = async () => {
  if (!redeemCode.value.trim()) return
  try {
    const result = await commerce.redeemCoupon(redeemCode.value.trim())
    coupons.value = [result, ...coupons.value.filter(item => item.coupon.id !== result.coupon.id)]
    selectedCouponId.value = result.coupon.id
    redeemCode.value = ''
    redeemMessage.value = 'Coupon added to your wallet.'
    await refreshQuote()
  } catch (caught) {
    redeemMessage.value = caught instanceof Error ? caught.message : 'Could not redeem that code.'
  }
}

const submit = async () => {
  if (!hasCompleteContactDetails.value) {
    error.value = 'Please complete all contact details before continuing.'
    return
  }
  if (!agreed.value) {
    error.value = 'Please accept the terms before continuing.'
    return
  }
  if (!startDate.value) {
    error.value = 'A departure date is required.'
    return
  }
  submitting.value = true
  try {
    const order = await commerce.createStandardOrder(
      productCode.value,
      Math.max(1, adultCount.value),
      Math.max(0, childCount.value),
      startDate.value,
      selectedCouponId.value,
      isLoggedIn.value ? requestedPoints.value : 0,
      { ...contact, country: contact.country.toUpperCase() }
    )
    if (isLoggedIn.value && auth.member.value) {
      Object.assign(auth.member.value, {
        firstName: contact.firstName.trim(),
        lastName: contact.lastName.trim(),
        mobile: contact.phone.trim(),
        country: contact.country.trim().toUpperCase(),
        stateProvince: contact.state.trim().toUpperCase()
      })
    }
    await navigateTo(
      order.order.status === 'COMPLETED'
        ? (isLoggedIn.value ? '/trips' : '/encounters')
        : `/orders/${encodeURIComponent(order.order.orderNo)}/pay`
    )
  } catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'Could not create the order.'
  } finally {
    submitting.value = false
  }
}

const useAllPoints = () => {
  requestedPoints.value = availablePoints.value
  void refreshQuote()
}

onMounted(load)
onBeforeUnmount(() => {
  if (quoteRefreshTimer) clearTimeout(quoteRefreshTimer)
})
</script>

<style scoped>
.checkout-page-shell {
  position: relative;
  min-height: 100vh;
  background-color: #203d33;
  color: #1a2b23;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow-x: clip;
}

.checkout-green-banner {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 264px;
  background-color: #203d33;
  z-index: 1;
}

.checkout-body-backdrop {
  position: absolute;
  top: 157px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f5f6f3;
  border-radius: 16px 16px 0 0;
  z-index: 2;
}

.checkout-page {
  position: relative;
  z-index: 5;
  min-height: calc(100vh - 80px);
  margin-top: 20px;
  padding-bottom: 90px;
  background: transparent;
}

.checkout-layout {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(0, 804px) minmax(320px, 436px);
  gap: 24px;
  width: min(1264px, calc(100% - 64px));
  margin: 0 auto;
  align-items: start;
}

.checkout-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Card base */
.checkout-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.02);
}

.journey-card {
  padding: 32px 36px 36px;
}

.terms-card {
  padding: 32px 36px;
}

/* Title & Meta */
.journey-title-row h1 {
  margin: 0;
  color: #1a2b23;
  font-family: 'Playfair Display', Didot, 'Cinzel', Georgia, serif;
  font-size: 26px;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.01em;
}

.journey-meta {
  display: flex;
  align-items: center;
  gap: 32px;
  min-height: 44px;
  margin-top: 20px;
  padding: 0 18px;
  border-radius: 8px;
  background: #f7f9f7;
  color: #1a2b23;
  font-size: 14px;
  font-weight: 500;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.meta-icon {
  color: #63736a;
  font-size: 14px;
}

.change-button {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 0;
  background: transparent;
  color: #698e4e;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 0;
  transition: opacity 0.2s ease;
}

.change-button:hover {
  opacity: 0.8;
}

.change-icon {
  font-size: 13px;
}

.card-divider {
  height: 1px;
  background: #eceeed;
  margin: 28px 0;
}

/* Contact section */
.contact-section h2,
.points-section h2,
.checkout-summary h2 {
  margin: 0;
  color: #1a2b23;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.3;
}

.helper {
  margin: 8px 0 24px;
  color: #667085;
  font-size: 13.5px;
  line-height: 1.45;
}

.contact-fields {
  display: grid;
  gap: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  color: #1a2b23;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.2;
}

.field-input,
.field-select {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1px solid #e0e3e1;
  border-radius: 10px;
  background: #ffffff;
  color: #1a2b23;
  font-family: inherit;
  font-size: 15px;
  font-weight: 400;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.field-input::placeholder {
  color: #98a2b3;
  font-weight: 400;
}

.field-input:focus,
.field-select:focus {
  border-color: #1a382b;
  outline: none;
  box-shadow: 0 0 0 3px rgba(26, 56, 43, 0.08);
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* SearchCodeSelect overrides */
.contact-fields :deep(.code-input-wrap input) {
  height: 48px;
  padding: 0 42px 0 16px;
  border: 1px solid #e0e3e1;
  border-radius: 10px;
  color: #1a2b23;
  font-family: inherit;
  font-size: 15px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.contact-fields :deep(.code-input-wrap input:focus) {
  border-color: #1a382b;
  box-shadow: 0 0 0 3px rgba(26, 56, 43, 0.08);
}

.contact-fields :deep(.code-chevron) {
  right: 16px;
  border-color: #75827c;
}

.contact-fields :deep(.code-menu) {
  border-color: #e0e3e1;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

/* Coupons */
.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.field-select {
  appearance: none;
  cursor: pointer;
  padding-right: 40px;
}

.select-chevron {
  position: absolute;
  right: 16px;
  width: 8px;
  height: 8px;
  border-right: 2px solid #667085;
  border-bottom: 2px solid #667085;
  transform: rotate(45deg);
  pointer-events: none;
}

.redeem-row {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.redeem-input {
  flex: 1;
}

.redeem-button {
  height: 48px;
  padding: 0 20px;
  border: 0;
  border-radius: 8px;
  background: #1a382b;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.redeem-button:hover {
  background: #234d3b;
}

.feedback {
  margin: 8px 0 0;
  color: #698e4e;
  font-size: 13px;
}

/* Points section */
.points-section {
  margin-top: 32px;
}

.points-section h2 {
  margin-bottom: 18px;
}

.points-info-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 10px 0;
  color: #344054;
  font-size: 14px;
}

.points-badge {
  font-weight: 700;
  color: #1a2b23;
  min-width: 38px;
}

.points-text {
  color: #475467;
  font-size: 14px;
  line-height: 1.5;
}

.points-info-divider {
  height: 1px;
  background: #f0f2f1;
  margin: 4px 0;
}

.points-controls {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  align-items: center;
}

.points-input {
  max-width: 180px;
}

.use-all-button {
  height: 48px;
  padding: 0 16px;
  border: 1px solid #1a382b;
  border-radius: 8px;
  background: #ffffff;
  color: #1a382b;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.use-all-button:hover {
  background: #f4f6f4;
}

/* Agreement */
.agreement-label {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  cursor: pointer;
  user-select: none;
}

.agreement-native-checkbox {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.agreement-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex: 0 0 20px;
  margin-top: 2px;
  border: 1.8px solid #d0d5dd;
  border-radius: 50%;
  background: #ffffff;
  color: #ffffff;
  transition: all 0.2s ease;
}

.check-icon {
  width: 12px;
  height: 12px;
  opacity: 0;
  transform: scale(0.6);
  transition: all 0.15s ease;
}

.agreement-native-checkbox:checked + .agreement-circle {
  background: #8cd33c;
  border-color: #8cd33c;
}

.agreement-native-checkbox:checked + .agreement-circle .check-icon {
  opacity: 1;
  transform: scale(1);
}

.agreement-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.agreement-terms {
  color: #344054;
  font-size: 13px;
  line-height: 1.5;
}

.agreement-terms a {
  color: #2563eb;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.agreement-note {
  color: #667085;
  font-size: 12.5px;
  line-height: 1.5;
}

/* Pay button */
.pay-button {
  width: 100%;
  height: 52px;
  margin-top: 28px;
  border: 0;
  border-radius: 8px;
  background: #1a382b;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.pay-button:hover:not(:disabled) {
  background: #234d3b;
}

.pay-button:disabled {
  opacity: 0.6;
  cursor: wait;
}

/* Right Column: Price details summary */
.checkout-summary {
  position: -webkit-sticky;
  position: sticky;
  top: 24px;
  align-self: start;
  padding: 32px 32px 28px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.02);
}

.checkout-summary h2 {
  margin-bottom: 24px;
}

.summary-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 8px 0;
  color: #1a2b23;
  font-size: 15px;
}

.summary-label {
  color: #1a2b23;
  font-size: 15px;
}

.summary-value {
  color: #1a2b23;
  font-weight: 700;
}

.summary-formula {
  color: #1a2b23;
  font-weight: 500;
}

.base-row {
  padding-bottom: 12px;
}

.discount-line .summary-label {
  color: #475467;
}

.discount-val {
  color: #027a48;
}

.summary-dashed-divider {
  border-top: 1px dashed #d0d5dd;
  margin: 18px 0;
}

.total-line {
  padding: 4px 0 16px;
}

.total-label {
  color: #1a2b23;
  font-size: 16px;
  font-weight: 700;
}

.total-value {
  color: #1a2b23;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.earn-points-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  padding: 14px 16px;
  border-radius: 8px;
  background: #f4f6f4;
}

.earn-icon {
  color: #1a382b;
  font-size: 16px;
  flex: 0 0 16px;
}

.earn-text {
  margin: 0;
  color: #344054;
  font-size: 13.5px;
  line-height: 1.45;
}

.earn-highlight {
  color: #698e4e;
  font-weight: 700;
}

.checkout-summary-loading {
  min-height: 300px;
}

.summary-skeleton {
  width: 72%;
  height: 16px;
  margin: 18px 0;
  border-radius: 4px;
  background: linear-gradient(90deg, #eef2ef 25%, #f8faf8 50%, #eef2ef 75%);
  background-size: 200% 100%;
  animation: checkout-skeleton 1.2s ease-in-out infinite;
}

.summary-skeleton-wide {
  width: 92%;
  height: 24px;
  margin-top: 30px;
}

.summary-skeleton-total {
  width: 48%;
  height: 28px;
  margin-top: 36px;
}

.checkout-summary-error p {
  margin: 24px 0;
  color: #667085;
  font-size: 14px;
  line-height: 1.5;
}

.checkout-summary-error button {
  min-height: 40px;
  padding: 0 16px;
  border: 0;
  border-radius: 6px;
  background: #1a382b;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

@keyframes checkout-skeleton {
  to { background-position: -200% 0; }
}

/* State screens */
.checkout-state {
  position: relative;
  z-index: 1;
  min-height: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #667085;
}

.checkout-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(26, 56, 43, 0.15);
  border-top-color: #1a382b;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.checkout-state.error {
  color: #b42318;
}

.checkout-state button {
  padding: 10px 20px;
  border: 0;
  border-radius: 8px;
  background: #1a382b;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
}

/* Responsive */
@media (max-width: 992px) {
  .checkout-layout {
    grid-template-columns: 1fr;
    width: min(804px, calc(100% - 32px));
  }

  .checkout-summary {
    position: static;
  }
}

@media (max-width: 640px) {
  .checkout-green-banner {
    height: 220px;
  }

  .checkout-body-backdrop {
    top: 120px;
    border-radius: 12px 12px 0 0;
  }

  .checkout-page {
    margin-top: 10px;
    padding-bottom: 48px;
  }

  .journey-card,
  .terms-card,
  .checkout-summary {
    padding: 24px 20px;
    border-radius: 12px;
  }

  .journey-title-row h1 {
    font-size: 20px;
  }

  .journey-meta {
    flex-wrap: wrap;
    gap: 14px;
    padding: 12px 14px;
    min-height: auto;
  }

  .change-button {
    margin-left: 0;
    width: 100%;
    justify-content: flex-end;
  }

  .field-row {
    grid-template-columns: 1fr;
  }

  .points-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .points-input {
    max-width: 100%;
  }
}
</style>
