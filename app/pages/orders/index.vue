<template>
  <AccountPageShell active-page="orders" kicker="Commerce" title="My orders" description="Review payment status and the exact itinerary snapshot for every purchase." :ready="ready">
    <section v-if="offers.length" class="offers-section" aria-labelledby="offers-title">
      <header class="offers-heading">
        <div>
          <p class="section-eyebrow">From your travel designer</p>
          <h2 id="offers-title">Itinerary offers</h2>
        </div>
        <span>{{ offers.length }} {{ offers.length === 1 ? 'offer' : 'offers' }}</span>
      </header>
      <article v-for="offer in offers" :key="offer.id" class="offer-row">
        <div class="offer-copy">
          <p>{{ offer.offerNo }}</p>
          <h3>Custom itinerary service</h3>
          <span>{{ offerStatusLabel(offer) }}<template v-if="offer.validUntil"> · Valid until {{ formatDate(offer.validUntil) }}</template></span>
        </div>
        <strong>{{ offer.currency }} {{ offer.unitTotalAmount }} / person</strong>
        <button type="button" :aria-label="offer.status === 'SENT' ? 'Review offer' : 'View offer'" @click="openOffer(offer.offerNo)">
          {{ offer.status === 'SENT' ? 'Review offer' : 'View offer' }}
          <font-awesome-icon :icon="['fas', 'arrow-right']" />
        </button>
      </article>
    </section>

    <div v-if="loading" class="orders-state">Loading orders...</div>
    <div v-else-if="error" class="orders-state error">{{ error }} <button type="button" @click="load">Try again</button></div>
    <div v-else-if="!orders.length" class="orders-state">No orders yet. <NuxtLink to="/catalog">Browse journeys</NuxtLink></div>
    <div v-else class="order-list">
      <article v-for="order in orders" :key="order.order.id" class="order-row">
        <div>
          <p class="order-number">{{ order.order.orderNo }}</p>
          <h2>{{ order.items[0]?.snapshot?.title || 'Lvyv journey service' }}</h2>
          <span>{{ formatDate(order.order.createTime) }} · {{ orderStatusLabel(order.order.status) }}</span>
        </div>
        <strong>{{ order.order.currency }} {{ order.order.totalAmount }}</strong>
        <button type="button" aria-label="View order details" @click="openOrder(order.order.orderNo)"><font-awesome-icon :icon="['fas', 'arrow-right']" /></button>
      </article>
    </div>

    <Teleport to="body">
      <div v-if="selectedOrder" class="modal-backdrop" @click.self="selectedOrder = null">
        <section class="order-modal" role="dialog" aria-modal="true" aria-labelledby="order-detail-title">
          <header><div><p>{{ selectedOrder.order.orderNo }}</p><h2 id="order-detail-title">Order details</h2></div><button type="button" aria-label="Close" @click="selectedOrder = null">×</button></header>
          <dl class="order-summary"><div><dt>Order status</dt><dd>{{ orderStatusLabel(selectedOrder.order.status) }}</dd></div><div><dt>Original</dt><dd>{{ selectedOrder.order.currency }} {{ selectedOrder.order.subtotal }}</dd></div><div><dt>Promotion</dt><dd>- {{ selectedOrder.order.currency }} {{ selectedOrder.order.promotionDiscountAmount }}</dd></div><div><dt>Coupon</dt><dd>- {{ selectedOrder.order.currency }} {{ selectedOrder.order.couponDiscountAmount }}</dd></div><div><dt>Total</dt><dd>{{ selectedOrder.order.currency }} {{ selectedOrder.order.totalAmount }}</dd></div><div><dt>Placed</dt><dd>{{ formatDate(selectedOrder.order.createTime) }}</dd></div></dl>
          <div class="order-lines">
            <article v-for="line in selectedOrder.items" :key="line.item.id">
              <div><span>{{ line.itineraryNo || line.snapshot?.productCode || line.item.itemType }}</span><h3>{{ line.snapshot?.title || 'Lvyv journey service' }}</h3><p>{{ line.snapshot?.contentSummary }}</p></div>
              <div class="line-meta"><strong>{{ line.snapshot?.currency || selectedOrder.order.currency }} {{ line.snapshot?.unitPrice || selectedOrder.order.totalAmount }}</strong><span>{{ line.item.quantity }} ×</span></div>
            </article>
          </div>
          <footer><NuxtLink v-if="itineraryNo(selectedOrder)" :to="`/trips?itineraryNo=${encodeURIComponent(itineraryNo(selectedOrder)!)}`">View itinerary</NuxtLink><NuxtLink v-if="selectedOrder.order.status === 'PENDING_PAYMENT'" :to="`/orders/${encodeURIComponent(selectedOrder.order.orderNo)}/pay`">{{ selectedOrder.activeOnlinePayment ? 'Resume payment' : 'Pay now' }}</NuxtLink><button v-if="selectedOrder.order.status === 'PENDING_PAYMENT'" type="button" :disabled="selectedOrder.activeOnlinePayment" @click="cancel(selectedOrder.order.orderNo)">Cancel order</button><button type="button" @click="selectedOrder = null">Close</button></footer>
        </section>
      </div>
    </Teleport>
  </AccountPageShell>
</template>

<script setup lang="ts">
import AccountPageShell from '~/components/profile/AccountPageShell.vue'
import type { CustomOfferView, OrderView } from '~/composables/useTourCommerce'

useNoIndex()
const { ready, initializeAccount } = useAccountPage('/orders')
const commerce = useTourCommerce()
const route = useRoute()
const orders = ref<OrderView[]>([])
const offers = ref<CustomOfferView[]>([])
const selectedOrder = ref<OrderView | null>(null)
const loading = ref(false)
const error = ref('')

const formatDate = (value?: string) => value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value)) : ''
const load = async () => {
  loading.value = true
  error.value = ''
  try {
    const [loadedOrders, loadedOffers] = await Promise.all([commerce.listOrders(), commerce.listCustomOffers()])
    orders.value = loadedOrders
    offers.value = loadedOffers
    const orderNo = typeof route.query.order === 'string' ? route.query.order : ''
    if (orderNo) await openOrder(orderNo)
  } catch (caught) { error.value = caught instanceof Error ? caught.message : 'Could not load orders.' } finally { loading.value = false }
}
const openOrder = async (orderNo: string) => { selectedOrder.value = await commerce.getOrder(orderNo) }
const openOffer = (offerNo: string) => navigateTo(`/offers/${encodeURIComponent(offerNo)}`)
const offerStatusLabel = (offer: CustomOfferView) => {
  if (offer.status === 'SENT' && offer.validUntil && new Date(offer.validUntil).getTime() <= Date.now()) return 'Expired'
  return ({ SENT: 'Awaiting your response', ACCEPTED: 'Accepted', REVISION_REQUESTED: 'Revision requested', EXPIRED: 'Expired', CANCELLED: 'Cancelled' } as Record<string, string>)[offer.status] || offer.status
}
const orderStatusLabel = (status: string) => ({ PENDING_PAYMENT: 'Waiting for payment', CANCELLED: 'Cancelled', COMPLETED: 'Completed', REFUNDED: 'Refunded' } as Record<string, string>)[status] || status
const itineraryNo = (order: OrderView) => order.items.find(line => line.itineraryNo)?.itineraryNo
const cancel = async (orderNo: string) => { try { selectedOrder.value = await commerce.cancelOrder(orderNo); orders.value = await commerce.listOrders() } catch (caught) { error.value = caught instanceof Error ? caught.message : 'Could not cancel the order.' } }
onMounted(async () => { if (await initializeAccount()) await load() })
</script>

<style scoped>
.offers-section { margin-bottom: 30px; }
.offers-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 18px; margin-bottom: 12px; }
.section-eyebrow { margin: 0 0 6px; color: #84918a; font-size: 9px; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; }
.offers-heading h2 { margin: 0; color: #173f34; font: 600 26px/1.2 'Playfair Display', Georgia, serif; }
.offers-heading > span { color: #78877f; font-size: 11px; }
.offer-row { display: flex; align-items: center; gap: 18px; padding: 18px 20px; border: 1px solid #d8e2db; background: #f7fbf7; }
.offer-row + .offer-row { margin-top: 8px; }
.offer-copy { min-width: 0; flex: 1; }
.offer-copy > p { margin: 0 0 5px; color: #84918a; font-size: 9px; font-weight: 800; letter-spacing: .05em; }
.offer-copy h3 { margin: 0 0 6px; color: #294238; font-size: 14px; }
.offer-copy span { color: #607169; font-size: 11px; }
.offer-row > strong { color: #174d40; white-space: nowrap; }
.offer-row > button { min-height: 36px; display: inline-flex; align-items: center; gap: 7px; padding: 0 12px; border: 1px solid #174d40; background: #174d40; color: #fff; font-size: 11px; font-weight: 700; cursor: pointer; white-space: nowrap; }
.order-list { display: grid; gap: 10px; }
.order-row { display: flex; align-items: center; justify-content: space-between; gap: 18px; padding: 20px; border: 1px solid #dfe5e1; background: #fff; }
.order-number { margin: 0 0 5px; color: #84918a; font-size: 9px; font-weight: 800; letter-spacing: .05em; }
.order-row h2 { margin: 0 0 6px; color: #173f34; font: 600 20px/1.2 'Playfair Display', Georgia, serif; }
.order-row span { color: #78877f; font-size: 11px; }
.order-row > strong { margin-left: auto; color: #174d40; white-space: nowrap; }
.order-row > button { width: 34px; height: 34px; border: 0; background: #edf2ee; color: #174d40; cursor: pointer; }
.orders-state { min-height: 240px; display: grid; place-items: center; gap: 10px; border: 1px solid #dfe5e1; color: #75827c; text-align: center; }
.orders-state button, .orders-state a { padding: 9px 13px; border: 1px solid #174d40; background: #174d40; color: #fff; text-decoration: none; cursor: pointer; }
.orders-state.error { display: flex; flex-direction: column; }
.modal-backdrop { position: fixed; z-index: 1500; inset: 0; display: grid; place-items: center; padding: 20px; background: rgba(11,28,22,.58); }
.order-modal { width: min(720px, 100%); max-height: calc(100dvh - 40px); overflow-y: auto; padding: 30px; background: #fff; box-shadow: 0 24px 70px rgba(8,28,20,.3); }
.order-modal header { display: flex; justify-content: space-between; gap: 20px; padding-bottom: 20px; border-bottom: 1px solid #e1e7e2; }
.order-modal header p { margin: 0 0 6px; color: #84918a; font-size: 9px; font-weight: 800; }.order-modal h2 { margin: 0; color: #173f34; font: 600 28px/1.2 'Playfair Display', Georgia, serif; }
.order-modal header button { width: 34px; height: 34px; border: 0; background: #f0f3f0; color: #52605b; font-size: 23px; cursor: pointer; }
.order-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 20px 0; }.order-summary div { padding: 13px; background: #f5f7f5; }.order-summary dt { color: #84918a; font-size: 9px; text-transform: uppercase; }.order-summary dd { margin: 5px 0 0; color: #35473e; font-size: 12px; font-weight: 700; }
.order-lines { display: grid; }.order-lines article { display: flex; justify-content: space-between; gap: 20px; padding: 18px 0; border-bottom: 1px solid #e6ebe7; }.order-lines span { color: #84918a; font-size: 9px; font-weight: 800; text-transform: uppercase; }.order-lines h3 { margin: 5px 0; color: #2a3c33; font-size: 15px; }.order-lines p { margin: 0; color: #75827c; font-size: 11px; }.line-meta { display: flex; align-items: flex-end; flex-direction: column; gap: 5px; white-space: nowrap; }.line-meta strong { color: #174d40; }
.order-modal footer { display: flex; justify-content: flex-end; gap: 8px; padding-top: 22px; }.order-modal footer button, .order-modal footer a { min-height: 42px; display: inline-flex; align-items: center; padding: 0 18px; border: 0; background: #174d40; color: #fff; font-weight: 700; text-decoration: none; cursor: pointer; }
@media (max-width: 620px) { .offers-heading { align-items: flex-start; flex-direction: column; }.offer-row { align-items: flex-start; flex-wrap: wrap; }.offer-row > strong { margin-left: 0; }.offer-row > button { width: 100%; justify-content: center; }.order-row { align-items: flex-start; flex-wrap: wrap; }.order-row > strong { margin-left: 0; }.order-summary { grid-template-columns: 1fr; }.order-lines article { flex-direction: column; }.line-meta { align-items: flex-start; }.order-modal { padding: 23px 18px; } }
</style>
