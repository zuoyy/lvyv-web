<template>
  <NuxtLayout :name="isSimCheckout ? false : 'default'">
    <div :class="{ 'sim-checkout-shell': isSimCheckout }">
      <CheckoutHeader v-if="isSimCheckout" />

      <main :class="isSimCheckout ? 'sim-checkout' : 'store-checkout'">
        <h1 v-if="!isSimCheckout || !selection || !quantity">Checkout</h1>
        <p v-if="status === 'idle' || status === 'pending'" class="checkout-state" role="status">Loading your package…</p>
        <form v-else-if="selection && detail && quantity" class="checkout-form" @submit.prevent="submit">
          <section class="checkout-contact">
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
              <p v-if="!isSimCheckout">{{ quantity }} × {{ usd(amount / quantity) }} <strong>· {{ usd(amount) }} USD</strong></p>
            </header>

            <h2>Contact and billing</h2>
            <div class="billing-grid">
              <label>First name <input v-model.trim="contact.firstName" autocomplete="given-name" required maxlength="80"></label>
              <label>Last name <input v-model.trim="contact.lastName" autocomplete="family-name" required maxlength="80"></label>
              <label class="contact-line">Email <input v-model.trim="contact.email" type="email" autocomplete="email" required maxlength="254"></label>
              <label class="contact-line">Phone <input v-model.trim="contact.phone" type="tel" autocomplete="tel" required maxlength="40"></label>
              <label>
                Country
                <select v-model="contact.country" autocomplete="country" required>
                  <option value="">Select country</option>
                  <option v-for="country in countries" :key="country[1]" :value="country[1]">{{ country[0] }}</option>
                </select>
              </label>
              <label>
                State or province
                <select v-if="regions.length" v-model="contact.state" autocomplete="address-level1" required>
                  <option value="">Select state or province</option>
                  <option v-for="region in regions" :key="region[1]" :value="region[1]">{{ region[0] }}</option>
                </select>
                <input v-else v-model.trim="contact.state" required maxlength="6" pattern="[A-Za-z0-9]{1,6}" autocomplete="address-level1">
              </label>
              <label>City <input v-model.trim="contact.city" maxlength="100" autocomplete="address-level2"></label>
              <label>Postal code <input v-model.trim="contact.zip" maxlength="20" autocomplete="postal-code"></label>
              <label class="wide">Billing address <input v-model.trim="contact.address" maxlength="200" autocomplete="street-address"></label>
              <label class="wide">Order note (optional) <textarea v-model.trim="note" maxlength="1000" rows="3" /></label>
            </div>
          </section>

          <aside v-if="isSimCheckout" class="checkout-summary" aria-labelledby="price-details-heading">
            <h2 id="price-details-heading">Price details</h2>
            <div class="summary-line">
              <span>{{ selection.name }}</span>
              <strong>{{ usd(amount / quantity) }} × {{ quantity }}</strong>
            </div>
            <div class="summary-line total-line">
              <span>Total</span>
              <strong>{{ usd(amount) }} USD</strong>
            </div>
          </aside>

          <section class="checkout-terms">
            <label class="consent">
              <input v-model="agreed" type="checkbox" required>
              <span>I agree to the <NuxtLink to="/terms">terms and conditions</NuxtLink>.</span>
            </label>
            <p v-if="message" class="checkout-error" role="alert">{{ message }}</p>
            <button type="submit" :disabled="submitting">{{ submitting ? 'Creating order…' : 'Continue to payment' }}</button>
          </section>
        </form>
        <div v-else-if="selection && detail" class="checkout-state">
          <p role="alert">Choose a quantity between 1 and {{ maxOrderQuantity }}.</p>
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
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import CheckoutHeader from '~/components/checkout/CheckoutHeader.vue'

definePageMeta({ middleware: 'member-auth', layout: false })
useSeoMeta({ title: 'Checkout', robots: 'noindex, nofollow' })
const route = useRoute()
const commerce = useCommerce()
const auth = useMemberAuth()
const productCode = computed(() => typeof route.query.product === 'string' ? route.query.product : '')
const isSimCheckout = computed(() => productCode.value.toUpperCase() === 'CHINA-SIM')
const skuCode = computed(() => typeof route.query.sku === 'string' ? route.query.sku : '')
const quantity = computed(() => {
  const value = route.query.quantity
  if (value === undefined) return 1
  const count = typeof value === 'string' && /^[1-9]\d*$/.test(value) ? Number(value) : 0
  return count <= maxOrderQuantity ? count : 0
})
const { data: detail, status } = useAsyncData(computed(() => 'checkout:' + productCode.value), () => commerce.product(productCode.value), { server: false })
const selection = computed(() => detail.value?.skus.find(sku => sku.skuCode === skuCode.value))
const amount = ref(0)
watch([selection, quantity], ([sku, count]) => {
  amount.value = Math.round((sku?.price ?? 0) * 100) * count / 100
}, { immediate: true })
const countries = allCountries
const contact = reactive({ firstName: '', lastName: '', email: '', phone: '', country: '', state: '', city: '', zip: '', address: '' })
const regions = computed(() => countries.find(country => country[1] === contact.country)?.[2] || [])
watch(() => contact.country, () => { if (!regions.value.some(region => region[1] === contact.state)) contact.state = '' }, { flush: 'sync' })
onMounted(async () => {
  const member = await auth.loadMember().catch(() => null)
  if (member) Object.assign(contact, { firstName: member.firstName || '', lastName: member.lastName || '', email: member.email, phone: member.mobile || '', country: member.country || '', state: member.stateProvince || '' })
})
const note = ref('')
const agreed = ref(false)
const submitting = ref(false)
const message = ref('')
let requestId = ''
let previousPayload = ''
async function submit() {
  if (!selection.value || !quantity.value || !agreed.value || submitting.value) return
  const request = { productCode: productCode.value, skuCode: skuCode.value, quantity: quantity.value, confirmedAmount: amount.value, contact: { ...contact }, note: note.value }
  const payload = JSON.stringify(request)
  if (payload !== previousPayload) {
    requestId = crypto.randomUUID()
    previousPayload = payload
  }
  submitting.value = true
  message.value = ''
  try {
    const result = await commerce.create({ ...request, checkoutRequestId: requestId })
    if (result.orderNo) await navigateTo(`/orders/${encodeURIComponent(result.orderNo)}/pay`)
    else if (result.currentAmount != null) {
      amount.value = Number(result.currentAmount)
      agreed.value = false
      message.value = 'The package price has changed. Review the new total before continuing.'
    }
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'Could not create your order. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>
<style scoped>
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
.sim-checkout .consent { align-items: flex-start; gap: 12px; margin: 0 0 24px; font-size: 14px; }
.sim-checkout .consent input { width: 18px; height: 18px; margin: 1px 0 0; accent-color: #1a382b; }
.sim-checkout .consent a { color: #2563eb; text-decoration: underline; }
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
