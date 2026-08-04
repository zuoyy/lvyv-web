<template>
  <AccountPageShell active-page="orders" kicker="Custom service" title="Your itinerary offer" description="Review the quoted service and accept it to create an order." :ready="ready">
    <div v-if="loading" class="offer-state">Loading offer...</div>
    <div v-else-if="error" class="offer-state error">{{ error }}</div>
    <section v-else-if="offer" class="offer-panel">
      <p class="eyebrow">{{ offer.offerNo }}</p>
      <h2>Custom itinerary service</h2>
      <p>{{ offerDescription }}</p>
      <dl>
        <div><dt>Status</dt><dd>{{ statusLabel }}</dd></div>
        <div><dt>Service subtotal</dt><dd>{{ formatMoney(offer.subtotal) }}</dd></div>
        <div v-if="Number(offer.discountAmount) > 0"><dt>Discount</dt><dd>- {{ formatMoney(offer.discountAmount) }}</dd></div>
        <div v-if="Number(offer.taxAmount) > 0"><dt>Tax</dt><dd>{{ formatMoney(offer.taxAmount) }}</dd></div>
        <div class="total-row"><dt>Total</dt><dd>{{ formatMoney(offer.totalAmount) }}</dd></div>
        <div v-if="offer.validUntil"><dt>Valid until</dt><dd>{{ formatDateTime(offer.validUntil) }}</dd></div>
      </dl>
      <button type="button" :disabled="accepting || !canAccept" @click="accept">{{ actionLabel }}</button>
    </section>
  </AccountPageShell>
</template>

<script setup lang="ts">
import AccountPageShell from '~/components/profile/AccountPageShell.vue'
import type { CustomOfferView } from '~/composables/useTourCommerce'

useNoIndex()
const route = useRoute()
const { ready, initializeAccount } = useAccountPage('/orders')
const commerce = useTourCommerce()
const offer = ref<CustomOfferView | null>(null)
const loading = ref(false)
const accepting = ref(false)
const error = ref('')

interface OfferSnapshot { description?: string }

const snapshot = computed<OfferSnapshot>(() => {
  if (!offer.value?.offerSnapshotJson) return {}
  try {
    return JSON.parse(offer.value.offerSnapshotJson) as OfferSnapshot
  } catch {
    return {}
  }
})
const offerDescription = computed(() => snapshot.value.description?.trim()
  || 'A travel designer prepared this custom itinerary service offer for your wish.')
const expired = computed(() => !!offer.value?.validUntil
  && new Date(offer.value.validUntil).getTime() <= Date.now())
const canAccept = computed(() => offer.value?.status === 'SENT' && !expired.value)
const statusLabel = computed(() => {
  if (offer.value?.status === 'SENT' && expired.value) return 'Expired'
  return ({ SENT: 'Awaiting your response', ACCEPTED: 'Accepted', EXPIRED: 'Expired', CANCELLED: 'Cancelled' } as Record<string, string>)[offer.value?.status || '']
    || offer.value?.status
    || ''
})
const actionLabel = computed(() => {
  if (accepting.value) return 'Creating order...'
  if (offer.value?.status === 'ACCEPTED') return 'Offer accepted'
  if (expired.value || offer.value?.status === 'EXPIRED') return 'Offer expired'
  if (offer.value?.status === 'CANCELLED') return 'Offer cancelled'
  return 'Accept offer'
})
const formatMoney = (amount: string | number) => `${offer.value?.currency || ''} ${Number(amount).toFixed(2)}`
const formatDateTime = (value: string) => new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
}).format(new Date(value))

const load = async () => {
  loading.value = true
  error.value = ''
  try { offer.value = await commerce.getOffer(String(route.params.offerNo)) } catch (caught) { error.value = caught instanceof Error ? caught.message : 'Could not load this offer.' } finally { loading.value = false }
}
const accept = async () => {
  accepting.value = true
  try { const order = await commerce.acceptOffer(String(route.params.offerNo)); await navigateTo(`/orders?order=${encodeURIComponent(order.order.orderNo)}`) } catch (caught) { error.value = caught instanceof Error ? caught.message : 'Could not accept this offer.' } finally { accepting.value = false }
}
onMounted(async () => { if (await initializeAccount()) await load() })
</script>

<style scoped>
.offer-panel { max-width: 640px; padding: 28px; border: 1px solid #dfe5e1; background: #fff; }
.eyebrow { margin: 0 0 8px; color: #84918a; font-size: 9px; font-weight: 800; text-transform: uppercase; }
.offer-panel h2 { margin: 0; color: #173f34; font: 600 28px/1.2 'Playfair Display', Georgia, serif; }
.offer-panel > p:not(.eyebrow) { color: #6e7c75; font-size: 13px; line-height: 1.6; }
dl { display: grid; gap: 10px; margin: 22px 0; padding-top: 18px; border-top: 1px solid #edf1ee; }
dl div { display: flex; justify-content: space-between; gap: 18px; }
dt { color: #84918a; font-size: 11px; } dd { margin: 0; color: #35473e; font-weight: 700; }
.total-row { margin-top: 3px; padding-top: 12px; border-top: 1px solid #edf1ee; }
.total-row dd { color: #174d40; font-size: 16px; }
.offer-panel button { min-height: 44px; padding: 0 18px; border: 0; background: #174d40; color: #fff; font-weight: 700; cursor: pointer; }
.offer-panel button:disabled { opacity: .55; cursor: not-allowed; }
.offer-state { min-height: 260px; display: grid; place-items: center; border: 1px solid #dfe5e1; color: #75827c; }
.offer-state.error { color: #a33e35; }
</style>
