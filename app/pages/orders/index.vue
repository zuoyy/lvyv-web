<template>
  <AccountPageShell active-page="orders" title="My orders" :ready="ready">
    <label class="filter">Status <select v-model="filter"><option value="ALL">All</option><option value="PENDING_PAYMENT">Awaiting payment</option><option value="PAID">Paid</option><option value="CANCELLED">Cancelled</option><option value="REFUNDED">Refunded</option></select></label>
    <p v-if="loading" role="status">Loading orders…</p>
    <p v-else-if="error" role="alert">{{ error }} <button type="button" @click="load">Retry</button></p>
    <p v-else-if="!rows.length">No orders found.</p>
    <article v-for="row in rows" :key="row.orderNo" class="order-row">
      <div><h2>{{ row.productName }}</h2><p>{{ row.skuName }} × {{ row.quantity }} · {{ usd(row.totalAmount) }}</p><small>{{ row.orderNo }}</small></div>
      <div><p>{{ statusLabel(row) }}</p><button type="button" @click="open(row.orderNo)">View order</button> <NuxtLink v-if="payable(row)" :to="payPath(row)">Pay</NuxtLink></div>
    </article>
    <AccountPagination :page="page" :size="10" :total="total" :loading="loading" @change="page = $event" />
    <dialog ref="dialog" @close="close">
      <div class="detail">
        <button type="button" @click="dialog?.close()">Close</button>
        <p v-if="detailLoading" role="status">Loading order…</p>
        <p v-if="detailError" role="alert">{{ detailError }}</p>
        <template v-if="selected">
          <h2>{{ selected.productName }}</h2><p>{{ selected.skuName }} × {{ selected.quantity }} · {{ usd(selected.totalAmount) }}</p>
          <p>{{ selected.orderNo }} · {{ statusLabel(selected) }}</p>
          <ul><li v-for="spec in selected.specifications" :key="spec.key">{{ spec.label }}: {{ spec.value }}</li></ul>
          <p v-if="selected.deliveryNote" class="note">{{ selected.deliveryNote }}</p>
          <p v-if="selected.refundReason">{{ selected.refundReason }}</p>
          <NuxtLink v-if="payable(selected)" :to="payPath(selected)">Continue to payment</NuxtLink>
          <button v-if="selected.status === 'PENDING_PAYMENT'" type="button" :disabled="cancelling" @click="cancel">Cancel order</button>
        </template>
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
const detailLoading = ref(false)
const detailError = ref('')
const cancelling = ref(false)
let listRequest = 0
let detailRequest = 0
const payable = (row: StoreOrder) => row.status === 'PENDING_PAYMENT' && Date.parse(row.expireTime) > Date.now()
const payPath = (row: StoreOrder) => `/orders/${encodeURIComponent(row.orderNo)}/pay`
const statusLabel = (row: StoreOrder) => ({ PENDING_PAYMENT: 'Awaiting payment', PAID: row.deliveredTime ? 'Delivered' : 'Paid · Awaiting delivery', CANCELLED: 'Cancelled', REFUNDED: 'Refunded' }[row.status])
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
dialog { border: 1px solid #b1c2b6; border-radius: 8px; width: min(540px,calc(100% - 32px)); }
dialog::backdrop { background: #142d23a0; }
.detail { padding: 20px; overflow-wrap: anywhere; }
.detail button { margin: 8px; }
.note { white-space: pre-wrap; }
</style>
