<template>
  <NuxtLayout :name="isSimCheckout ? false : 'default'">
    <div :class="{ 'sim-checkout-shell': isSimCheckout }">
      <CheckoutHeader v-if="isSimCheckout" />

      <main :class="isSimCheckout ? 'sim-checkout' : 'store-checkout'">
        <h1 v-if="!isSimCheckout || !selection || !quantity">Checkout</h1>
        <p v-if="status === 'idle' || status === 'pending'" class="checkout-state" role="status">Loading your package…</p>
        <div v-else-if="status === 'error' || (selection && quantity && !checkout?.quote)" class="checkout-state">
          <p role="alert">{{ priceError?.message || 'We couldn’t load the current checkout price.' }}</p>
          <NuxtLink v-if="isEncounter" :to="encounter?.slug ? '/product/' + encounter.slug : '/encounters'">Back to encounter</NuxtLink>
          <button type="button" @click="refresh()">Try again</button>
        </div>
        <form v-else-if="selection && detail && quantity" class="checkout-form" @submit.prevent="submit">
          <section class="checkout-contact">
            <div v-if="isEncounter" class="checkout-travel-date">
              <label>
                {{ encounter?.kind === 'route' ? 'Preferred departure date' : 'Preferred experience date' }}
                <input v-model="requestedTravelDate" type="date" :min="minimumTravelDate" required>
              </label>
              <p>{{ quantity }} {{ quantity === 1 ? 'traveler' : 'travelers' }} · Our team will confirm your date after payment.</p>
            </div>
            <header class="package-header">
              <NuxtLink v-if="!isSimCheckout" :to="detail.product.landingPath">Back to {{ detail.product.name }}</NuxtLink>
              <h1 v-if="isSimCheckout">{{ selection.name }}</h1>
              <h2 v-else>{{ selection.name }}</h2>
              <div class="package-meta">
                <dl>
                  <div v-for="spec in selection.specifications" :key="spec.key">
                    <dt>{{ spec.label }}</dt>
                    <dd>{{ spec.value }}</dd>
                  </div>
                </dl>
                <NuxtLink v-if="isSimCheckout" :to="detail.product.landingPath" class="change-package">
                  Change <span class="sr-only">package</span>
                  <FontAwesomeIcon :icon="faPenToSquare" aria-hidden="true" />
                </NuxtLink>
              </div>
            </header>

            <h2>Contact and billing</h2>
            <div class="billing-grid">
              <label>First name <input v-model.trim="contact.firstName" autocomplete="given-name" required maxlength="80"></label>
              <label>Last name <input v-model.trim="contact.lastName" autocomplete="family-name" required maxlength="80"></label>
              <label class="contact-line">Email <input v-model.trim="contact.email" type="email" autocomplete="email" required maxlength="254"></label>
              <label class="contact-line">Phone <input v-model.trim="contact.phone" type="tel" autocomplete="tel" required maxlength="40"></label>
              <div v-if="isSimCheckout" class="location-field">
                <label for="checkout-country">Country</label>
                <SearchCodeSelect
                  v-model="contact.country"
                  input-id="checkout-country"
                  placeholder="Search country"
                  :options="countryOptions"
                  required
                />
              </div>
              <label v-else>
                Country
                <select v-model="contact.country" autocomplete="country" required>
                  <option value="">Select country</option>
                  <option v-for="country in countries" :key="country[1]" :value="country[1]">{{ country[0] }}</option>
                </select>
              </label>
              <div v-if="isSimCheckout" class="location-field">
                <label for="checkout-state">State or province</label>
                <SearchCodeSelect
                  v-if="stateOptions.length || !contact.country"
                  v-model="contact.state"
                  input-id="checkout-state"
                  placeholder="Search state or province"
                  :options="stateOptions"
                  :disabled="!contact.country"
                  required
                />
                <input
                  v-else
                  id="checkout-state"
                  v-model.trim="contact.state"
                  placeholder="Enter state or province code"
                  autocomplete="address-level1"
                  maxlength="6"
                  pattern="[A-Za-z0-9]{1,6}"
                  required
                >
              </div>
              <label v-else>
                State or province
                <select v-if="regions.length" v-model="contact.state" autocomplete="address-level1" required>
                  <option value="">Select state or province</option>
                  <option v-for="region in regions" :key="region[1]" :value="region[1]">{{ region[0] }}</option>
                </select>
                <input v-else v-model.trim="contact.state" required maxlength="6" pattern="[A-Za-z0-9]{1,6}" autocomplete="address-level1">
              </label>
              <template v-if="!isSimCheckout">
                <label>City <input v-model.trim="billingAddress.city" maxlength="100" autocomplete="address-level2"></label>
                <label>Postal code <input v-model.trim="billingAddress.zip" maxlength="20" autocomplete="postal-code"></label>
                <label class="wide">Billing address <input v-model.trim="billingAddress.address" maxlength="200" autocomplete="street-address"></label>
                <label class="wide">Order note (optional) <textarea v-model.trim="note" maxlength="1000" rows="3" /></label>
              </template>
            </div>
          </section>

          <aside class="checkout-summary" aria-labelledby="price-details-heading" :aria-busy="pricing">
            <h2 id="price-details-heading">Price details</h2>
            <div class="summary-line">
              <span>{{ selection.name }}</span>
              <strong>{{ usd(quote?.unitPrice ?? selection.price) }} × {{ quantity }}</strong>
            </div>
            <div v-if="quote && quote.discountAmount > 0" class="summary-line discount-line">
              <span>First-order discount</span>
              <strong>−{{ usd(quote.discountAmount) }}</strong>
            </div>
            <div v-if="quote && quote.couponDiscountAmount > 0" class="summary-line discount-line">
              <span>Coupon</span>
              <strong>−{{ usd(quote.couponDiscountAmount) }}</strong>
            </div>
            <div class="summary-line total-line">
              <span>Total</span>
              <strong aria-live="polite">{{ quote ? `${usd(quote.totalAmount)} USD` : '—' }}</strong>
            </div>
          </aside>

          <section class="checkout-terms">
            <div class="coupon-section">
              <label class="coupon-label" for="checkout-coupon">Coupon</label>
              <div class="select-wrapper">
                <select
                  id="checkout-coupon"
                  v-model="selectedCouponId"
                  :disabled="walletStatus === 'pending' || submitting || redeeming"
                  @change="couponChanged"
                >
                  <option :value="undefined">No coupon</option>
                  <option v-for="item in wallet" :key="item.coupon.id" :value="item.coupon.id" :disabled="!canSelectCoupon(item)">
                    {{ couponLabel(item) }}
                  </option>
                </select>
                <span class="select-chevron" aria-hidden="true" />
              </div>
              <p v-if="walletStatus === 'pending'" class="coupon-feedback" role="status">Loading coupons…</p>
              <div v-else-if="walletStatus === 'error'" class="coupon-feedback">
                <span role="alert">We couldn’t load your coupons.</span>
                <button type="button" class="coupon-retry" :disabled="redeeming" @click="loadWallet()">Try again</button>
              </div>
              <p v-else-if="!wallet.length" class="coupon-feedback">You have no available coupons.</p>
              <div class="redeem-row">
                <input
                  v-model.trim="redeemCode"
                  aria-label="Coupon code"
                  placeholder="Have a coupon code?"
                  autocomplete="off"
                  maxlength="64"
                  :disabled="submitting || redeeming || walletStatus === 'pending'"
                  @keydown.enter.prevent="redeem()"
                >
                <button type="button" :disabled="!redeemCode || submitting || redeeming || walletStatus === 'pending'" @click="redeem()">
                  {{ redeeming ? 'Applying…' : 'Apply' }}
                </button>
              </div>
              <p v-if="redeemMessage" class="coupon-feedback" :class="{ 'checkout-error': redeemFailed }" :role="redeemFailed ? 'alert' : 'status'">
                {{ redeemMessage }}
              </p>
              <p v-if="pricing" class="coupon-feedback" role="status">Updating total…</p>
              <div v-else-if="couponError" class="coupon-feedback checkout-error">
                <span role="alert">{{ couponError }}</span>
                <button v-if="selectedCouponId" type="button" class="coupon-retry" @click="updateCouponQuote()">Try again</button>
              </div>
              <p v-else-if="selectedCouponId && quote && Number(quote.couponDiscountAmount) === 0" class="coupon-feedback" role="status">
                {{ Number(quote.discountAmount) > 0 ? 'The automatic offer saves at least as much. Your selected coupon will be kept.' : 'Your coupon has been kept because it cannot reduce this total.' }}
              </p>
              <p v-else-if="selectedCouponId && isFirstOrderSku && hasFirstOrderOffer" class="coupon-feedback" role="status">
                Your selected coupon gives a better discount.
              </p>
            </div>
            <label v-if="isSimCheckout" class="agreement-label">
              <input v-model="agreed" type="checkbox" required class="agreement-native-checkbox">
              <span class="agreement-circle" aria-hidden="true">
                <FontAwesomeIcon :icon="faCheck" />
              </span>
              <span class="agreement-content">
                <span class="agreement-terms">
                  I have read and agree to Lvyv's <NuxtLink to="/terms" target="_blank">Terms of Use</NuxtLink>, <NuxtLink to="/terms" target="_blank">Privacy Statement</NuxtLink>, <NuxtLink to="/terms" target="_blank">Booking Notices</NuxtLink>, <NuxtLink to="/terms" target="_blank">Terms and Conditions</NuxtLink>, and <NuxtLink to="/terms" target="_blank">Travel Declaration for Seniors/Pregnant Women</NuxtLink>.
                </span>
                <span class="agreement-note">
                  We securely save your traveler and contact details to make future bookings easier. You can review, update, or delete them at any time.
                </span>
                <span class="agreement-note">
                  Your booking will be confirmed once payment is complete.
                </span>
              </span>
            </label>
            <label v-else class="consent">
              <input v-model="agreed" type="checkbox" required>
              <span>I agree to the <NuxtLink to="/terms">terms and conditions</NuxtLink>.</span>
            </label>
            <p v-if="message" class="checkout-error" role="alert">{{ message }}</p>
            <button type="submit" :disabled="submitting || redeeming || pricing || !quote">{{ submitting ? 'Creating order…' : 'Continue to payment' }}</button>
          </section>
        </form>
        <div v-else-if="selection && detail" class="checkout-state">
          <p role="alert">{{ isEncounter ? 'Enter a valid whole number of travelers.' : `Choose a quantity between 1 and ${maxOrderQuantity}.` }}</p>
          <NuxtLink :to="detail.product.landingPath">Back to {{ detail.product.name }}</NuxtLink>
        </div>
        <div v-else class="checkout-state">
          <p role="alert">This package is unavailable.</p>
          <NuxtLink v-if="isSimCheckout" to="/product/china-sim">Back to China SIM</NuxtLink>
          <NuxtLink v-else to="/encounters">Browse products</NuxtLink>
        </div>
      </main>
    </div>
  </NuxtLayout>
</template>
<script setup lang="ts">
import { allCountries } from 'country-region-data'
import { faCheck, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import CheckoutHeader from '~/components/checkout/CheckoutHeader.vue'
import SearchCodeSelect from '~/components/payment/SearchCodeSelect.vue'
import type { CheckoutCoupon, CheckoutQuote } from '~/composables/useCommerce'
import { ApiRequestError } from '~/composables/useMemberAuth'

import { encounterProducts } from '~~/shared/utils/encounterProducts'

definePageMeta({ middleware: 'member-auth', layout: false })
useSeoMeta({ title: 'Checkout', robots: 'noindex, nofollow' })
const route = useRoute()
const commerce = useCommerce()
const auth = useMemberAuth()
const productCode = computed(() => typeof route.query.product === 'string' ? route.query.product : '')
const isEncounter = computed(() => isEncounterCode(productCode.value))
const encounter = computed(() => encounterProducts.find(item => item.code === productCode.value.toUpperCase()))
const isSimCheckout = computed(() => productCode.value.toUpperCase() === 'CHINA-SIM')
const skuCode = computed(() => typeof route.query.sku === 'string' ? route.query.sku : '')
const quantity = computed(() => {
  const value = route.query.quantity
  if (value === undefined) return 1
  const count = typeof value === 'string' && /^[1-9]\d*$/.test(value) ? Number(value) : 0
  return validOrderQuantity(productCode.value, count) ? count : 0
})
const checkoutKey = computed(() => ['checkout', productCode.value, skuCode.value, quantity.value].join(':'))
const requestedTravelDate = ref('')
const minimumTravelDate = ref(todayInChina())
onMounted(() => {
  minimumTravelDate.value = todayInChina()
  watch([productCode, skuCode], ([product, sku]) => {
    const saved = isEncounterCode(product) ? rememberTravelDate(product, sku) : ''
    requestedTravelDate.value = isTravelDate(saved) ? saved : ''
  }, { immediate: true })
  watch(requestedTravelDate, (date) => {
    if (isEncounter.value && (date === '' || isTravelDate(date))) {
      rememberTravelDate(productCode.value, skuCode.value, date)
    }
  })
})
const { data: checkout, status, error: priceError, refresh } = useAsyncData(
  checkoutKey,
  async () => {
    if (isEncounter.value && !encounter.value?.ready) return { detail: null, quote: null }
    const [detail, quote] = await Promise.all([
      commerce.product(productCode.value),
      quantity.value && skuCode.value
        ? commerce.quote(productCode.value, skuCode.value, quantity.value).catch((error) => {
          if (error instanceof ApiRequestError && error.code === 1005000001) return null
          throw error
        }) : null,
    ])
    return { detail, quote }
  }, { server: false },
)
const detail = computed(() => checkout.value?.detail)
const selection = computed(() => detail.value?.skus.find(sku => sku.skuCode === skuCode.value))
const { data: wallet, status: walletStatus, refresh: loadWallet } = useAsyncData(
  'checkout-coupons', commerce.listCoupons, { server: false, default: () => [] },
)
const selectedCouponId = ref<number>()
const couponQuote = ref<CheckoutQuote>()
const couponError = ref('')
const pricing = ref(false)
const redeemCode = ref('')
const redeeming = ref(false)
const redeemMessage = ref('')
const redeemFailed = ref(false)
const quote = computed(() => selectedCouponId.value ? couponQuote.value : checkout.value?.quote)
const isFirstOrderSku = computed(() => isChinaSimFirstOrderSku(productCode.value, skuCode.value))
const hasFirstOrderOffer = computed(() => Number(checkout.value?.quote?.discountAmount) > 0)
const canSelectCoupon = (item: CheckoutCoupon) =>
  item.eligibilityStatus === 'ELIGIBLE' && item.template.eligibilityType !== 'FIRST_ORDER'
const couponLabel = (item: CheckoutCoupon) => {
  const { template } = item
  const discount = template.discountType === 'PERCENT' ? `${template.discountValue}% off` : `${usd(template.discountValue)} off`
  const firstOrder = template.eligibilityType === 'FIRST_ORDER' ? 'First order · ' : ''
  return `${firstOrder}${template.name} · ${discount}${canSelectCoupon(item) ? '' : ' (not currently eligible)'}`
}
const isCouponUnavailable = (error: unknown) => error instanceof ApiRequestError
  && [1005000013, 1005000014, 1005000015, 1005000016, 1005000019, 1005000053].includes(error.code)
let quoteRequest = 0
async function updateCouponQuote() {
  const request = ++quoteRequest
  const couponId = selectedCouponId.value
  couponQuote.value = undefined
  couponError.value = ''
  pricing.value = Boolean(couponId)
  if (!couponId) return
  try {
    const result = await commerce.quote(productCode.value, skuCode.value, quantity.value, couponId)
    if (request === quoteRequest) couponQuote.value = result
  } catch (error) {
    if (request !== quoteRequest) return
    couponError.value = error instanceof Error ? error.message : 'Could not update your coupon total.'
    if (isCouponUnavailable(error)) selectedCouponId.value = undefined
  } finally {
    if (request === quoteRequest) pricing.value = false
  }
}

function couponChanged() {
  message.value = ''
  void updateCouponQuote()
}

async function redeem() {
  if (!redeemCode.value || submitting.value || redeeming.value || walletStatus.value === 'pending') return
  redeeming.value = true
  redeemFailed.value = false
  redeemMessage.value = ''
  const key = checkoutKey.value
  try {
    const result = await commerce.redeemCoupon(redeemCode.value)
    wallet.value = [result, ...wallet.value.filter(item => item.coupon.id !== result.coupon.id)]
    redeemCode.value = ''
    redeemMessage.value = 'Coupon added to your wallet.'
    if (key === checkoutKey.value && canSelectCoupon(result)) {
      message.value = ''
      selectedCouponId.value = result.coupon.id
      await updateCouponQuote()
    }
  } catch (error) {
    redeemFailed.value = true
    redeemMessage.value = error instanceof Error ? error.message : 'Could not redeem that code.'
  } finally {
    redeeming.value = false
  }
}
watch(checkoutKey, () => {
  selectedCouponId.value = undefined
  void updateCouponQuote()
})
const countries = allCountries
const countryOptions = countries.map(([name, code]) => ({ name, code }))
const contact = reactive({ firstName: '', lastName: '', email: '', phone: '', country: '', state: '' })
const billingAddress = reactive({ city: '', zip: '', address: '' })
const regions = computed(() => countries.find(country => country[1] === contact.country)?.[2] || [])
const stateCodePattern = /^[A-Za-z0-9]{1,6}$/
const shortRegionCode = (code: string, country: string) => {
  const normalized = code.toUpperCase()
  return normalized.startsWith(`${country}-`) ? normalized.slice(country.length + 1) : normalized
}
const stateOptions = computed(() => regions.value
  .map(([name, code]) => ({ name, code: shortRegionCode(code, contact.country) }))
  .filter(({ code }) => stateCodePattern.test(code))
  .sort((a, b) => a.name.localeCompare(b.name, 'en')))
watch(() => contact.country, () => {
  if (isSimCheckout.value || !regions.value.some(([, code]) => code === contact.state)) contact.state = ''
}, { flush: 'sync' })
onMounted(async () => {
  const member = await auth.loadMember().catch(() => null)
  if (!member) return
  const country = member.country || ''
  const region = member.stateProvince || ''
  Object.assign(contact, {
    firstName: member.firstName || '',
    lastName: member.lastName || '',
    email: member.email,
    phone: member.mobile || '',
    country: isSimCheckout.value ? country.toUpperCase() : country,
    state: isSimCheckout.value ? shortRegionCode(region, country.toUpperCase()) : region
  })
})
const note = ref('')
const agreed = ref(false)
const submitting = ref(false)
const message = ref('')
let requestId = ''
let previousPayload = ''
async function submit() {
  if (!selection.value || !quantity.value || !agreed.value || submitting.value || redeeming.value || pricing.value || !quote.value) return
  if (isEncounter.value && !isTravelDate(requestedTravelDate.value)) {
    message.value = 'Choose today or a future date in China.'
    return
  }
  if (isEncounter.value) rememberTravelDate(productCode.value, skuCode.value, requestedTravelDate.value)
  const request = {
    productCode: productCode.value,
    skuCode: skuCode.value,
    quantity: quantity.value,
    confirmedAmount: quote.value.totalAmount,
    ...(isEncounter.value ? { requestedTravelDate: requestedTravelDate.value } : {}),
    ...(selectedCouponId.value ? {
      memberCouponId: selectedCouponId.value,
      confirmedCouponDiscountAmount: quote.value.couponDiscountAmount,
    } : {}),
    contact: isSimCheckout.value ? { ...contact } : { ...contact, ...billingAddress },
    ...(isSimCheckout.value ? {} : { note: note.value })
  }
  const payload = JSON.stringify(request)
  if (payload !== previousPayload) {
    requestId = crypto.randomUUID()
    previousPayload = payload
  }
  submitting.value = true
  message.value = ''
  try {
    const result = await commerce.create({ ...request, checkoutRequestId: requestId })
    if (result.orderNo) {
      if (isEncounter.value) rememberTravelDate(productCode.value, skuCode.value, '')
      await navigateTo(`/orders/${encodeURIComponent(result.orderNo)}/pay`)
    } else if (result.currentAmount != null) {
      agreed.value = false
      await Promise.all([refresh(), updateCouponQuote()])
      message.value = 'The price or discount has changed. Review the new total before continuing.'
    }
  } catch (error) {
    if (selectedCouponId.value && isCouponUnavailable(error)) {
      agreed.value = false
      selectedCouponId.value = undefined
      await Promise.all([refresh(), updateCouponQuote(), loadWallet()])
      couponError.value = error instanceof Error ? error.message : 'This coupon is no longer available.'
      message.value = 'Review the new total before continuing.'
    } else {
      message.value = error instanceof Error ? error.message : 'Could not create your order. Please try again.'
    }
  } finally {
    submitting.value = false
  }
}
</script>
<style scoped>
.checkout-travel-date { margin-bottom: 18px; }
.checkout-travel-date label { display: grid; gap: 6px; font-weight: 600; }
.checkout-travel-date input { width: min(100%, 280px); padding: 8px; font: inherit; }
.checkout-travel-date p { margin-top: 8px; }
.store-checkout { max-width: 760px; margin: 0 auto; padding: 48px 20px; color: #20372d; }
.store-checkout h1 { font-size: 2rem; margin: 0 0 20px; }
.store-checkout h2 { font-size: 1.3rem; margin: 22px 0 12px; }
.store-checkout dl div { display: flex; gap: 12px; }
.store-checkout dd { margin: 0; font-weight: 600; }
.billing-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 14px; }
.billing-grid label { display: grid; gap: 5px; }
.billing-grid .wide { grid-column: 1/-1; }
.billing-grid :is(input,select,textarea) { width: 100%; box-sizing: border-box; border: 1px solid #a7b5ad; border-radius: 6px; padding: 10px; background: white; }
.consent { display: flex; gap: 8px; margin: 20px 0; }
button { border: 0; border-radius: 6px; background: #244c3b; color: white; padding: 12px 20px; }
button:disabled { opacity: .6; }
.store-checkout .checkout-summary { margin: 24px 0; }
.store-checkout .checkout-summary h2 { margin-bottom: 8px; }
.coupon-section { margin-bottom: 26px; }
.coupon-label { display: block; margin-bottom: 8px; font-size: 14px; font-weight: 600; }
.select-wrapper { position: relative; }
.coupon-section :is(select, input) {
  box-sizing: border-box;
  min-width: 0;
  min-height: 48px;
  padding: 10px 16px;
  border: 1px solid #e0e3e1;
  border-radius: 8px;
  background: #fff;
  color: #1a2b23;
  font: inherit;
}
.coupon-section select { width: 100%; padding-right: 40px; appearance: none; cursor: pointer; }
.select-chevron {
  position: absolute;
  top: calc(50% - 6px);
  right: 17px;
  width: 8px;
  height: 8px;
  border-right: 2px solid #667085;
  border-bottom: 2px solid #667085;
  transform: rotate(45deg);
  pointer-events: none;
}
.redeem-row { display: flex; gap: 10px; margin-top: 12px; }
.redeem-row input { flex: 1; }
.redeem-row button { min-height: 48px; padding: 0 16px; border-radius: 8px; background: #1a382b; font-weight: 600; cursor: pointer; }
.redeem-row button:hover:not(:disabled) { background: #234d3b; }
.coupon-feedback { margin: 8px 0 0; color: #52635a; font-size: 13px; line-height: 1.45; }
.coupon-retry { padding: 4px 8px; background: transparent; color: #244c3b; text-decoration: underline; cursor: pointer; }
.checkout-error { color: #b42318; }
.discount-line strong { color: #426638; }
@media (max-width: 540px) { .billing-grid { grid-template-columns: 1fr; } }

.sim-checkout-shell {
  position: relative;
  min-height: 100vh;
  background: #203d33;
  color: #1a2b23;
  font-family: 'Inter', sans-serif;
}

.sim-checkout-shell::before {
  content: '';
  position: absolute;
  inset: 157px 0 0;
  border-radius: 16px 16px 0 0;
  background: #f5f6f3;
}

.sim-checkout {
  position: relative;
  width: min(1264px, calc(100% - 64px));
  margin: 20px auto 0;
  padding-bottom: 90px;
}

.sim-checkout .checkout-form {
  display: grid;
  grid-template-columns: minmax(0, 804px) minmax(320px, 436px);
  gap: 24px;
  align-items: start;
}

.sim-checkout :is(.checkout-contact, .checkout-summary, .checkout-terms, .checkout-state) {
  padding: 32px 36px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.02);
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.02);
}

.sim-checkout h1 {
  margin: 0 0 20px;
  color: #1a2b23;
  font: 700 26px/1.25 'Playfair Display', Georgia, serif;
}

.sim-checkout > h1 { color: #fff; }

.sim-checkout h2 {
  margin: 0 0 24px;
  color: #1a2b23;
  font: 700 20px/1.3 'Inter', sans-serif;
}

.sim-checkout .package-header {
  margin-bottom: 28px;
  padding-bottom: 28px;
  border-bottom: 1px solid #eceeed;
}

.sim-checkout .package-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 24px;
  padding: 12px 18px;
  border-radius: 8px;
  background: #f7f9f7;
  font-size: 14px;
}

.sim-checkout .package-meta dl {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  margin: 0;
}

.sim-checkout .package-meta dl div { display: flex; gap: 6px; }
.sim-checkout .package-meta dt { color: #52635a; }
.sim-checkout .package-meta dd { margin: 0; font-weight: 600; }

.change-package {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  color: #426638;
  font-weight: 600;
}

.change-package svg { width: 13px; }

.sim-checkout .billing-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px 16px;
}

.sim-checkout .billing-grid label { gap: 8px; font-size: 14px; font-weight: 600; }
.sim-checkout .billing-grid .contact-line { grid-column: 1 / -1; }
.location-field { display: grid; gap: 8px; min-width: 0; }

.sim-checkout .billing-grid :is(input, select, textarea) {
  min-height: 48px;
  padding: 10px 16px;
  border: 1px solid #e0e3e1;
  border-radius: 10px;
  color: #1a2b23;
  font: 400 15px 'Inter', sans-serif;
}

.sim-checkout .billing-grid :is(input, select, textarea):focus {
  border-color: #1a382b;
  outline: 2px solid rgba(26, 56, 43, 0.18);
}

.sim-checkout .billing-grid :deep(.code-input-wrap input) {
  min-height: 48px;
  padding: 0 42px 0 16px;
  border-color: #e0e3e1;
  border-radius: 10px;
  font-size: 15px;
}

.sim-checkout .billing-grid :deep(.code-input-wrap input:focus) {
  border-color: #1a382b;
  outline: 2px solid rgba(26, 56, 43, 0.18);
}

.sim-checkout .billing-grid :deep(.code-menu) {
  border-color: #e0e3e1;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.sim-checkout .checkout-summary {
  position: sticky;
  top: 24px;
  grid-column: 2;
  grid-row: 1 / span 2;
  padding: 32px 32px 28px;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  padding: 8px 0;
  font-size: 15px;
}

.summary-line strong { white-space: nowrap; }

.total-line {
  margin-top: 16px;
  padding-top: 18px;
  border-top: 1px dashed #d0d5dd;
  font-weight: 700;
}

.total-line strong { font-size: 22px; }
.sim-checkout .checkout-terms { grid-column: 1; }
.agreement-label {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 28px;
  cursor: pointer;
}

.agreement-native-checkbox {
  position: absolute;
  width: 20px;
  height: 20px;
  margin: 2px 0 0;
  opacity: 0;
  cursor: pointer;
}

.agreement-circle {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  flex: 0 0 20px;
  margin-top: 2px;
  border: 1.8px solid #d0d5dd;
  border-radius: 50%;
  background: #fff;
  color: #fff;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.agreement-circle svg {
  width: 12px;
  height: 12px;
  opacity: 0;
  transform: scale(0.6);
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.agreement-native-checkbox:focus-visible + .agreement-circle { outline: 2px solid #1a382b; outline-offset: 2px; }
.agreement-native-checkbox:checked + .agreement-circle { background: #8cd33c; border-color: #8cd33c; }
.agreement-native-checkbox:checked + .agreement-circle svg { opacity: 1; transform: scale(1); }
.agreement-content { display: grid; gap: 10px; }
.agreement-terms { color: #344054; font-size: 13px; line-height: 1.5; }
.agreement-terms a { color: #2563eb; text-decoration: underline; text-underline-offset: 2px; }
.agreement-note { color: #667085; font-size: 12.5px; line-height: 1.5; }
.sim-checkout .checkout-error { color: #b42318; }

.sim-checkout button[type='submit'] {
  width: 100%;
  min-height: 52px;
  border-radius: 8px;
  background: #1a382b;
  font: 600 16px 'Inter', sans-serif;
  cursor: pointer;
}

.sim-checkout button[type='submit']:hover:not(:disabled) { background: #234d3b; }
.sim-checkout button[type='submit']:disabled { cursor: wait; }
.sim-checkout .checkout-state { margin: 0; }

@media (max-width: 992px) {
  .sim-checkout { width: min(804px, calc(100% - 32px)); }
  .sim-checkout .checkout-form { grid-template-columns: minmax(0, 1fr); }
  .sim-checkout .checkout-summary { position: static; grid-column: 1; grid-row: auto; }
}

@media (max-width: 640px) {
  .sim-checkout-shell::before { top: 120px; border-radius: 12px 12px 0 0; }
  .sim-checkout { margin-top: 10px; padding-bottom: 48px; }
  .sim-checkout :is(.checkout-contact, .checkout-summary, .checkout-terms, .checkout-state) {
    padding: 24px 20px;
    border-radius: 12px;
  }
  .sim-checkout h1 { font-size: 20px; }
  .sim-checkout .billing-grid { grid-template-columns: minmax(0, 1fr); }
}
</style>
