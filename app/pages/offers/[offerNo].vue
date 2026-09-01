<template>
  <AccountPageShell active-page="orders" kicker="Custom service" title="Your itinerary and offer" description="Review the prepared itinerary first. Confirming it creates a waiting-for-payment order." :ready="ready">
    <div v-if="loading" class="offer-state">Loading itinerary and offer...</div>
    <div v-else-if="error" class="offer-state error">{{ error }}</div>
    <section v-else-if="confirmation" class="offer-layout">
      <article class="offer-panel">
        <p class="eyebrow">{{ offer.offerNo }}</p>
        <h2>{{ itinerary.content?.content?.title || 'Custom itinerary service' }}</h2>
        <p>{{ itinerary.content?.content?.summary || description }}</p>
        <dl>
          <div><dt>Status</dt><dd>{{ statusLabel }}</dd></div>
          <div><dt>Departure date</dt><dd>{{ formatDate(itinerary.startDate) }}</dd></div>
          <div><dt>End date</dt><dd>{{ formatDate(itinerary.endDate) }}</dd></div>
          <div><dt>Price tiers</dt><dd>{{ tierSummary }}</dd></div>
          <div><dt><label for="offer-adult-count">Adults</label></dt><dd><input id="offer-adult-count" v-model.number="adultCount" class="traveler-input" type="number" min="1" step="1" inputmode="numeric" :disabled="!canConfirm || submitting"></dd></div>
          <div><dt><label for="offer-child-count">Children</label></dt><dd><input id="offer-child-count" v-model.number="childCount" class="traveler-input" type="number" min="0" step="1" inputmode="numeric" :disabled="!canConfirm || submitting"></dd></div>
          <div v-if="travelerValidationMessage || quoteError" class="traveler-error"><dt>Travelers</dt><dd>{{ travelerValidationMessage || quoteError }}</dd></div>
          <div><dt><label for="offer-points">Points</label></dt><dd><input id="offer-points" v-model.number="requestedPoints" class="traveler-input" type="number" min="0" :step="pointsPerUsd"><button type="button" class="points-all" @click="useAllPoints">Use all {{ availablePoints }}</button></dd></div>
          <template v-if="quote">
            <div><dt>Adults</dt><dd>{{ quote.adultCount }} x {{ formatMoney(quote.adultSaleUnitPrice) }} = {{ formatMoney(quote.adultSubtotal) }}</dd></div>
            <div v-if="quote.childCount"><dt>Children</dt><dd>{{ quote.childCount }} x {{ formatMoney(quote.childSaleUnitPrice) }} = {{ formatMoney(quote.childSubtotal) }}</dd></div>
            <div><dt>List subtotal</dt><dd>{{ formatMoney(quote.listSubtotal) }}</dd></div>
            <div v-if="Number(quote.discountAmount) > 0"><dt>Tier discount</dt><dd>-{{ formatMoney(quote.discountAmount) }}</dd></div>
            <div v-if="Number(quote.redemption?.pointsAmount || 0) > 0"><dt>Points ({{ quote.redemption?.usablePoints }})</dt><dd>-{{ formatMoney(quote.redemption?.pointsAmount || 0) }}</dd></div>
            <div class="total-row"><dt>Total to pay</dt><dd>{{ quoteLoading ? 'Updating...' : formatMoney(quote.totalAmount) }}</dd></div>
          </template>
          <div v-if="offer.validUntil"><dt>Valid until</dt><dd>{{ formatDateTime(offer.validUntil) }}</dd></div>
        </dl>
        <button v-if="canConfirm" type="button" :disabled="submitting || quoteLoading || !travelerCountsValid || !quote" @click="confirmOffer">
          {{ submitting ? 'Creating payment order...' : 'Confirm itinerary and continue to payment' }}
        </button>
        <button v-if="canRequestRevision" type="button" class="secondary" @click="revisionOpen = true">Request a revision</button>
        <p v-if="offer.status === 'ACCEPTED'" class="notice">This offer is accepted. Open your order to see the offline payment instructions.</p>
      </article>
      <article class="itinerary-panel">
        <div class="itinerary-heading"><span>Version V{{ itinerary.versionNo }}</span><strong>{{ itinerary.wishNo ? `Wish ${itinerary.wishNo}` : itinerary.itineraryNo }}</strong></div>
        <p v-if="itinerary.content?.content?.designerMessage" class="designer-message">{{ itinerary.content.content.designerMessage }}</p>
        <section v-for="day in (itinerary.content?.days || [])" :key="day.id" class="day">
          <div class="day-label">Day {{ day.dayNo }}</div>
          <div><h3>{{ day.title }}</h3><p v-if="day.summary">{{ day.summary }}</p>
            <ul><li v-for="item in (itinerary.content?.items || []).filter((entry) => entry.dayId === day.id)" :key="item.id"><strong>{{ item.title }}</strong><span>{{ item.address || item.description }}</span><dl v-if="visibleTagGroups(item.tagGroups).length" class="offer-tag-groups"><div v-for="group in visibleTagGroups(item.tagGroups)" :key="group.code"><dt>{{ group.label }}</dt><dd>{{ group.tags.map(tag => tag.label).join(' · ') }}</dd></div></dl></li></ul>
          </div>
        </section>
      </article>
    </section>
    <Teleport to="body">
      <div v-if="revisionOpen" class="modal-backdrop" @click.self="revisionOpen = false">
        <section class="revision-modal" role="dialog" aria-modal="true"><h2>Request a revision</h2><p>Tell your designer what should change. This offer will be cancelled and a new version will be prepared.</p><textarea v-model="revisionContent" rows="6" placeholder="Describe the changes you need" /><footer><button type="button" class="secondary" @click="revisionOpen = false">Cancel</button><button type="button" :disabled="revisionSubmitting || !revisionContent.trim()" @click="requestRevision">{{ revisionSubmitting ? 'Sending...' : 'Send request' }}</button></footer></section>
      </div>
    </Teleport>
  </AccountPageShell>
</template>

<script setup lang="ts">
import AccountPageShell from '~/components/profile/AccountPageShell.vue'
import type { CustomOfferConfirmationView, CustomOfferQuote, CustomOfferView, TourConfirmationView } from '~/composables/useTourCommerce'

useNoIndex()
const route = useRoute()
const { ready, initializeAccount } = useAccountPage('/orders')
const commerce = useTourCommerce()
const confirmation = ref<CustomOfferConfirmationView | null>(null)
const loading = ref(false)
const submitting = ref(false)
const revisionSubmitting = ref(false)
const revisionOpen = ref(false)
const revisionContent = ref('')
const adultCount = ref(1)
const childCount = ref(0)
const quote = ref<CustomOfferQuote | null>(null)
const quoteLoading = ref(false)
const quoteError = ref('')
const requestedPoints = ref(0); const availablePoints = ref(0); const pointsPerUsd = ref(100)
let quoteRequest = 0
const maxTravelerCount = 2_147_483_647
const error = ref('')
const offer = computed(() => confirmation.value?.offer as CustomOfferView)
const itinerary = computed(() => confirmation.value?.itinerary as TourConfirmationView)
const visibleTagGroups = (value: string | import('~/composables/useTourCommerce').ItineraryTagGroupSnapshot[] | undefined) => {
  let groups: import('~/composables/useTourCommerce').ItineraryTagGroupSnapshot[] = []
  if (Array.isArray(value)) groups = value
  else if (typeof value === 'string' && value.trim()) {
    try { const parsed = JSON.parse(value); if (Array.isArray(parsed)) groups = parsed } catch { groups = [] }
  }
  return groups.filter(group => group.showOnItinerary).sort((a, b) => a.groupSort - b.groupSort).map(group => ({
    code: group.groupCode, label: group.groupLabels?.['en-US'] || group.groupCode,
    tags: [...(group.tags || [])].sort((a, b) => a.sort - b.sort).map(tag => ({ code: tag.code, label: tag.labels?.['en-US'] || tag.code }))
  }))
}
const description = computed(() => { try { return offer.value?.offerSnapshotJson ? (JSON.parse(offer.value.offerSnapshotJson).description || '') : '' } catch { return '' } })
const expired = computed(() => !!offer.value?.validUntil && new Date(offer.value.validUntil).getTime() <= Date.now())
const canConfirm = computed(() => !!confirmation.value?.canConfirm && !expired.value)
const canRequestRevision = computed(() => !!confirmation.value?.canRequestRevision && !expired.value)
const travelerCountsValid = computed(() => Number.isInteger(adultCount.value) && adultCount.value >= 1
  && Number.isInteger(childCount.value) && childCount.value >= 0
  && adultCount.value <= maxTravelerCount - childCount.value)
const travelerValidationMessage = computed(() => travelerCountsValid.value ? '' : 'Enter whole numbers: at least 1 adult and 0 or more children.')
const tierSummary = computed(() => (offer.value?.tiers || []).map((tier) => `${tier.minTravelerCount}${tier.maxTravelerCount == null ? '+' : `-${tier.maxTravelerCount}`} travelers: adult ${formatMoney(tier.adultSalePrice)}, child ${formatMoney(tier.childSalePrice)}`).join('; '))
const statusLabel = computed(() => ({ SENT: 'Awaiting your confirmation', ACCEPTED: 'Accepted - waiting for payment', REVISION_REQUESTED: 'Revision requested', EXPIRED: 'Expired', CANCELLED: 'Cancelled' } as Record<string, string>)[offer.value?.status || ''] || offer.value?.status || '')
const formatMoney = (amount: string | number) => `${offer.value?.currency || ''} ${Number(amount).toFixed(2)}`
const formatDate = (value?: string) => {
  if (!value) return 'Not set'
  const [yearText, monthText, dayText] = value.split('-')
  if (!yearText || !monthText || !dayText) return value
  const year = Number(yearText)
  const month = Number(monthText)
  const day = Number(dayText)
  if (![year, month, day].every(Number.isInteger)) return value
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(year, month - 1, day))
}
const formatDateTime = (value: string) => new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
const applyTravelerCounts = (value: TourConfirmationView) => {
  const adults = Number(value.adultCount)
  const children = Number(value.childCount)
  if (Number.isInteger(adults) && adults >= 1 && Number.isInteger(children) && children >= 0) {
    adultCount.value = adults
    childCount.value = children
    return
  }
  adultCount.value = 1
  childCount.value = 0
}
const refreshQuote = async () => {
  const request = ++quoteRequest
  quote.value = null
  quoteError.value = ''
  if (!travelerCountsValid.value || !canConfirm.value) return
  quoteLoading.value = true
  try {
    const result = await commerce.previewOffer(String(route.params.offerNo), adultCount.value, childCount.value, requestedPoints.value)
    if (request === quoteRequest) quote.value = result
  } catch (caught) {
    if (request === quoteRequest) quoteError.value = caught instanceof Error ? caught.message : 'This traveler count is not available for the offer.'
  } finally {
    if (request === quoteRequest) quoteLoading.value = false
  }
}
const load = async () => { loading.value = true; error.value = ''; try { const [result, account, config] = await Promise.all([commerce.getOffer(String(route.params.offerNo)), commerce.getPointsAccount(), commerce.getPointsRedemptionConfig()]); confirmation.value = result; availablePoints.value = account.availablePoints; pointsPerUsd.value = config.pointsPerUsd; applyTravelerCounts(result.itinerary); await refreshQuote() } catch (caught) { error.value = caught instanceof Error ? caught.message : 'Could not load this offer.' } finally { loading.value = false } }
const confirmOffer = async () => {
  if (!travelerCountsValid.value || !quote.value) { quoteError.value = travelerValidationMessage.value || 'This traveler count is not available for the offer.'; return }
  submitting.value = true
  error.value = ''
  try {
    const order = await commerce.confirmOffer(String(route.params.offerNo), adultCount.value, childCount.value, requestedPoints.value)
    await navigateTo(order.order.status === 'COMPLETED' ? '/trips' : `/orders/${encodeURIComponent(order.order.orderNo)}/pay`)
  } catch (caught) { quoteError.value = caught instanceof Error ? caught.message : 'Could not confirm this offer.' } finally { submitting.value = false }
}
const requestRevision = async () => { revisionSubmitting.value = true; error.value = ''; try { await commerce.requestRevision(String(route.params.offerNo), revisionContent.value.trim()); revisionOpen.value = false; await load() } catch (caught) { error.value = caught instanceof Error ? caught.message : 'Could not send the revision request.' } finally { revisionSubmitting.value = false } }
const useAllPoints = () => { requestedPoints.value = availablePoints.value; void refreshQuote() }
onMounted(async () => { if (await initializeAccount()) await load() })
watch([adultCount, childCount, requestedPoints], () => {
  // load() performs the initial request after restoring itinerary counts.
  if (!loading.value) void refreshQuote()
})
</script>

<style scoped>
.offer-layout { display: grid; grid-template-columns: minmax(300px, .8fr) minmax(0, 1.2fr); gap: 18px; align-items: start; }.offer-panel, .itinerary-panel { padding: 28px; border: 1px solid #dfe5e1; background: #fff; }.eyebrow { margin: 0 0 8px; color: #84918a; font-size: 9px; font-weight: 800; text-transform: uppercase; }.offer-panel h2 { margin: 0; color: #173f34; font: 600 28px/1.2 'Playfair Display', Georgia, serif; }.offer-panel > p:not(.eyebrow) { color: #6e7c75; font-size: 13px; line-height: 1.6; }dl { display: grid; gap: 10px; margin: 22px 0; padding-top: 18px; border-top: 1px solid #edf1ee; }dl div { display: flex; justify-content: space-between; gap: 18px; }dt { color: #84918a; font-size: 11px; }dd { margin: 0; color: #35473e; font-weight: 700; }.total-row { margin-top: 3px; padding-top: 12px; border-top: 1px solid #edf1ee; }.total-row dd { color: #174d40; font-size: 16px; }.offer-panel button, .revision-modal button { width: 100%; min-height: 44px; margin-top: 8px; padding: 0 18px; border: 0; background: #174d40; color: #fff; font-weight: 700; cursor: pointer; }.offer-panel button.secondary, .revision-modal button.secondary { border: 1px solid #174d40; background: #fff; color: #174d40; }.offer-panel button:disabled, .revision-modal button:disabled { opacity: .55; cursor: not-allowed; }.notice { margin-top: 16px; color: #64736c; font-size: 12px; }.itinerary-heading { display: flex; justify-content: space-between; gap: 12px; padding-bottom: 15px; border-bottom: 1px solid #edf1ee; color: #78877f; font-size: 11px; }.itinerary-heading strong { color: #174d40; }.designer-message { padding: 14px; background: #f5f8f4; color: #56675e; font-size: 12px; line-height: 1.6; }.day { display: grid; grid-template-columns: 68px 1fr; gap: 15px; padding: 20px 0; border-bottom: 1px solid #edf1ee; }.day-label { color: #174d40; font-size: 11px; font-weight: 800; text-transform: uppercase; }.day h3 { margin: 0; color: #2e4137; font-size: 16px; }.day p { margin: 5px 0 0; color: #77857d; font-size: 12px; }.day ul { display: grid; gap: 10px; margin: 14px 0 0; padding: 0; list-style: none; }.day li { display: grid; gap: 2px; padding-left: 14px; border-left: 2px solid #bfdc72; }.day li strong { color: #35473e; font-size: 13px; }.day li span { color: #78857e; font-size: 11px; }.offer-state { min-height: 260px; display: grid; place-items: center; border: 1px solid #dfe5e1; color: #75827c; }.offer-state.error { color: #a33e35; }.modal-backdrop { position: fixed; z-index: 1500; inset: 0; display: grid; place-items: center; padding: 20px; background: rgba(11,28,22,.58); }.revision-modal { width: min(520px,100%); padding: 25px; background: #fff; }.revision-modal h2 { margin: 0; color: #173f34; }.revision-modal p { color: #68766f; font-size: 13px; line-height: 1.5; }.revision-modal textarea { width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cfd9d2; resize: vertical; }.revision-modal footer { display: flex; gap: 8px; justify-content: flex-end; }.revision-modal footer button { width: auto; min-width: 110px; }.revision-modal footer button.secondary { order: -1; }
.offer-tag-groups { gap: 4px; margin: 7px 0 0; padding: 0; border: 0; }.offer-tag-groups div { justify-content: flex-start; gap: 7px; }.offer-tag-groups dt, .offer-tag-groups dd { font-size: 9px; }.offer-tag-groups dt { font-weight: 800; }.offer-tag-groups dd { color: #50645b; }
.traveler-input { width: 72px; min-height: 32px; padding: 0 8px; border: 1px solid #cfd9d2; color: #35473e; }
.traveler-input:disabled { background: #f4f6f4; color: #7c8982; cursor: not-allowed; }
.traveler-error dd { color: #a33e35; font-size: 11px; text-align: right; }
@media (max-width: 800px) { .offer-layout { grid-template-columns: 1fr; }.offer-panel, .itinerary-panel { padding: 20px; } }
</style>
