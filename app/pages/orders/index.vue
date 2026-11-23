<template>
  <AccountPageShell active-page="orders" title="My orders" :ready="ready">
    <label class="filter">Status <select v-model="filter"><option value="ALL">All</option><option value="PENDING_PAYMENT">Awaiting payment</option><option value="PAID">Paid</option><option value="CANCELLED">Cancelled</option><option value="REFUNDED">Refunded</option></select></label>
    <p v-if="loading" role="status">Loading orders…</p>
    <p v-else-if="error" role="alert">{{ error }} <button type="button" @click="load">Retry</button></p>
    <p v-else-if="!rows.length">No orders found.</p>
    <article v-for="row in rows" :key="row.orderNo" class="order-row">
      <div><h2>{{ row.productName }}</h2><p>{{ row.skuName }} × {{ row.quantity }} · {{ orderAmount(row) }}</p><small>{{ row.orderNo }}</small></div>
      <div><p>{{ statusLabel(row) }}</p><button type="button" @click="open(row.orderNo)">View order</button> <NuxtLink v-if="payable(row)" :to="payPath(row)">Pay</NuxtLink></div>
    </article>
    <AccountPagination :page="page" :size="10" :total="total" :loading="loading" @change="page = $event" />
    <dialog ref="dialog" class="order-modal" aria-labelledby="order-detail-title" @close="close" @click.self="dialog?.close()">
      <div class="detail">
        <header class="modal-header">
          <div>
            <p v-if="detailOrderNo" class="modal-order-no">Order #{{ detailOrderNo }}</p>
            <h2 id="order-detail-title">Order details</h2>
          </div>
          <button type="button" class="modal-close" aria-label="Close" autofocus @click="dialog?.close()">×</button>
        </header>
        <p v-if="detailLoading" class="detail-state" role="status">Loading order…</p>
        <p v-if="detailError" class="detail-state error-state" role="alert">{{ detailError }}</p>
        <template v-if="selected">
          <dl class="order-summary">
            <div><dt>Order status</dt><dd>{{ statusLabel(selected) }}</dd></div>
            <div><dt>Total</dt><dd>{{ orderAmount(selected) }}</dd></div>
          </dl>
          <div class="order-item">
            <div>
              <h3>{{ selected.productName }}</h3>
              <p class="item-package">{{ selected.skuName }}</p>
              <dl v-if="selected.specifications.length" class="item-specs">
                <div v-for="spec in selected.specifications" :key="spec.key">
                  <dt>{{ spec.label }}</dt><dd>{{ spec.value }}</dd>
                </div>
              </dl>
            </div>
            <p class="item-quantity" aria-label="Quantity">× {{ selected.quantity }}</p>
          </div>
          <p v-if="selected.deliveryNote" class="order-note">{{ selected.deliveryNote }}</p>
          <p v-if="selected.refundReason" class="order-note">{{ selected.refundReason }}</p>
        </template>
        <footer class="modal-footer">
          <NuxtLink v-if="selected && payable(selected)" :to="payPath(selected)" class="modal-button primary">Continue to payment</NuxtLink>
          <button v-if="selected?.status === 'PENDING_PAYMENT'" type="button" class="modal-button" :disabled="cancelling" @click="cancel">Cancel order</button>
          <button type="button" class="modal-button" @click="dialog?.close()">Close</button>
        </footer>
      </div>
    </dialog>
  </AccountPageShell>
</template>
<script setup lang="ts">
import type { StoreOrder } from '~/composables/useCommerce'
const { ready, initializeAccount } = useAccountPage('/orders')
const commerce = useCommerce()
const route = useRoute()
const router = useRouter()
const filter = ref('ALL')
const page = ref(1)
const total = ref(0)
const rows = ref<StoreOrder[]>([])
const loading = ref(false)
const error = ref('')
const dialog = ref<HTMLDialogElement>()
const selected = ref<StoreOrder>()
const detailOrderNo = ref('')
const detailLoading = ref(false)
const detailError = ref('')
const cancelling = ref(false)
let listRequest = 0
let detailRequest = 0
const payable = (row: StoreOrder) => row.status === 'PENDING_PAYMENT' && Date.parse(row.expireTime) > Date.now()
const payPath = (row: StoreOrder) => `/orders/${encodeURIComponent(row.orderNo)}/pay`
const statusLabel = (row: StoreOrder) => ({ PENDING_PAYMENT: 'Awaiting payment', PAID: row.deliveredTime ? 'Completed' : 'Paid · Processing', CANCELLED: 'Cancelled', REFUNDED: 'Refunded' }[row.status])
const orderAmount = (row: StoreOrder) => new Intl.NumberFormat('en-US', { style: 'currency', currency: row.currency }).format(row.totalAmount)
async function load() {
  const request = ++listRequest
  loading.value = true
  error.value = ''
  try {
    const result = await commerce.orders(page.value, filter.value)
    if (request === listRequest) { rows.value = result.list; total.value = result.total }
  } catch {
    if (request === listRequest) error.value = 'Orders could not be loaded.'
  } finally {
    if (request === listRequest) loading.value = false
  }
}
async function open(no: string) {
  const request = ++detailRequest
  detailOrderNo.value = no
  selected.value = undefined
  detailError.value = ''
  detailLoading.value = true
  if (!dialog.value?.open) dialog.value?.showModal()
  try {
    const result = await commerce.order(no)
    if (request === detailRequest) selected.value = result
  } catch {
    if (request === detailRequest) detailError.value = 'Order could not be loaded.'
  } finally {
    if (request === detailRequest) detailLoading.value = false
  }
}
function close() {
  detailRequest++
  if (route.query.order) void router.replace({ query: {} })
}
async function cancel() {
  if (!selected.value || !window.confirm('Cancel this order?')) return
  cancelling.value = true
  try { selected.value = await commerce.cancel(selected.value.orderNo); await load() }
  catch (error) { detailError.value = error instanceof Error ? error.message : 'Could not cancel the order.' }
  finally { cancelling.value = false }
}
watch(filter, () => { page.value = 1 })
watch([page, filter], load)
onMounted(async () => {
  await initializeAccount()
  if (!ready.value) return
  await nextTick()
  if (typeof route.query.order === 'string') void open(route.query.order)
  await load()
})
</script>
<style scoped>
.filter { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
.order-row { display: flex; justify-content: space-between; gap: 18px; border-bottom: 1px solid #d5ded7; padding: 18px 0; }
.order-row h2,.detail h2 { font-size: 1.15rem; margin: 0; }
.order-modal {
  position: fixed;
  inset: 0;
  width: min(720px, calc(100% - 40px));
  max-height: calc(100dvh - 40px);
  margin: auto;
  padding: 0;
  overflow-y: auto;
  border: none;
  border-radius: 12px;
  background: #fff;
  color: #203d33;
  box-shadow: 0 24px 70px rgba(8, 28, 20, 0.3);
}

.order-modal::backdrop { background: rgba(11, 28, 22, 0.58); }
.detail { padding: 30px; overflow-wrap: anywhere; }
.modal-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; padding-bottom: 20px; border-bottom: 1px solid #e1e7e2; }
.modal-order-no { margin-bottom: 6px; color: #65746e; font-size: 12px; font-weight: 600; }
.modal-header h2 { color: #173f34; font: 600 28px/1.2 'Playfair Display', Georgia, serif; }
.modal-close { display: grid; place-items: center; flex: 0 0 34px; height: 34px; border: none; border-radius: 6px; background: #f0f3f0; color: #52605b; font-size: 23px; line-height: 1; cursor: pointer; }
.modal-close:hover { background: #e2e8e3; }
.detail-state { margin: 20px 0; }
.error-state { color: #a63a31; }
.order-summary { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin: 20px 0; }
.order-summary > div { padding: 13px; border-radius: 6px; background: #f5f7f5; }
.order-summary dt { color: #65746e; font-size: 12px; }
.order-summary dd { margin-top: 4px; color: #35473e; font-size: 14px; font-weight: 700; }
.order-item { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin: 20px 0; }
.order-item h3 { color: #2a3c33; font: 600 16px/1.4 'Inter', sans-serif; }
.item-package { margin-top: 2px; color: #65746e; font-size: 14px; }
.item-quantity { flex-shrink: 0; color: #35473e; font-size: 14px; font-weight: 700; }
.item-specs { display: grid; gap: 4px; margin-top: 12px; font-size: 13px; }
.item-specs > div { display: flex; flex-wrap: wrap; gap: 0 8px; }
.item-specs dt { color: #65746e; }
.order-note { margin: 12px 0; white-space: pre-wrap; }
.modal-footer { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 10px; padding-top: 20px; border-top: 1px solid #e1e7e2; }
.modal-button { display: inline-grid; place-items: center; min-height: 40px; padding: 0 16px; border: 1px solid #a9b6ad; border-radius: 4px; background: #fff; color: #203d33; font-size: 13px; text-decoration: none; cursor: pointer; }
.modal-button:hover:not(:disabled) { background: #f0f3f0; }
.modal-button.primary { border-color: #203d33; background: #203d33; color: #fff; }
.modal-button.primary:hover { background: #2a573f; }
.modal-button:disabled { opacity: 0.5; cursor: wait; }

@media (max-width: 600px) {
  .order-modal { width: calc(100% - 24px); max-height: calc(100dvh - 24px); }
  .detail { padding: 20px; }
  .modal-header h2 { font-size: 24px; }
}
</style>
