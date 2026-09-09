<template>
  <AccountPageShell
    active-page="orders"
    title="My orders"
    description="Review payment status, pricing breakdown and itinerary details for every purchase."
    :ready="ready"
  >
    <!-- 顶部状态筛选栏，带数量统计，与后台订单数严格对齐 -->
    <div class="order-toolbar">
      <div class="filter-tabs" role="group" aria-label="Order status">
        <button
          v-for="filter in filters"
          :key="filter.value"
          type="button"
          :class="{ active: activeFilter === filter.value }"
          @click="activeFilter = filter.value"
        >
          {{ filter.label }} ({{ filterCount(filter.value) }})
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="content-state" role="status">
      <span class="state-spinner" />
      Loading your orders...
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="content-state error-state">
      <font-awesome-icon :icon="['fas', 'circle-exclamation']" />
      <strong>We could not load your orders.</strong>
      <span>{{ error }}</span>
      <button type="button" @click="load">Try again</button>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!filteredOrders.length" class="content-state empty-state">
      <div class="empty-symbol">
        <font-awesome-icon :icon="['fas', 'receipt']" />
      </div>
      <strong>{{ orders.length ? 'No orders match this filter' : 'No orders yet' }}</strong>
      <span>{{ orders.length ? 'Choose another filter view to see your orders.' : 'When you book an itinerary or custom trip, your confirmed orders will appear here.' }}</span>
      <NuxtLink v-if="!orders.length" to="/encounters">Browse encounters</NuxtLink>
    </div>

    <!-- 订单卡片列表：严格只展示正式订单，每条记录对应 1 张卡片 -->
    <div v-else class="order-list">
      <article v-for="order in filteredOrders" :key="order.order.id" class="order-card">
        <!-- 1. 顶部元数据：单号、下单时间、失效时间、状态 -->
        <div class="order-card__header">
          <div class="order-card__meta">
            <span class="order-card__no">{{ order.order.orderNo }}</span>
            <span class="order-card__divider" aria-hidden="true" />
            <span class="order-card__time">Placed: {{ formatOrderDate(order.order.createTime) }}</span>
          </div>

          <div class="order-card__status-group">
            <span
              v-if="order.order.status === 'PENDING_PAYMENT' && order.order.expireTime"
              class="order-card__expire"
            >
              Pay before: {{ formatOrderDate(order.order.expireTime) }}
            </span>
            <span class="order-card__status" :class="orderStatusClass(order.order.status)">
              {{ orderStatusLabel(order.order.status) }}
            </span>
          </div>
        </div>

        <div class="order-card__sep" aria-hidden="true" />

        <!-- 2. 主体信息：商品缩略图 + 标题 + 出行参数 -->
        <div class="order-card__main">
          <div class="order-media">
            <img
              :src="getOrderCover(order)"
              :alt="getOrderTitle(order)"
              loading="lazy"
            >
          </div>

          <div class="order-card__content">
            <div class="order-card__header-row">
              <div class="order-card__title-box">
                <div class="order-card__badges">
                  <span v-if="itineraryNo(order)" class="order-badge itinerary-badge">Itinerary #{{ itineraryNo(order) }}</span>
                  <span v-else-if="order.items[0]?.snapshot?.productCode" class="order-badge product-badge">Code: {{ order.items[0].snapshot.productCode }}</span>
                  <span class="order-badge type-badge">{{ formatSourceType(order.order.sourceType) }}</span>
                  <span v-if="order.items.length > 1" class="order-badge count-badge">{{ order.items.length }} items</span>
                </div>
                <h2 class="order-card__title">
                  {{ getOrderTitle(order) }}
                </h2>
              </div>

              <div v-if="order.items[0]?.item.adultUnitPrice" class="order-card__unit-price">
                <span class="unit-price-val">{{ order.items[0]?.snapshot?.currency || order.order.currency }} {{ order.items[0].item.adultUnitPrice }}</span>
                <span class="unit-price-label">/ adult</span>
              </div>
            </div>

            <p class="order-card__summary">
              {{ getOrderSummary(order) }}
            </p>

            <div class="order-card__specs">
              <div v-if="order.items[0]?.item.startDate" class="spec-pill">
                <span class="order-spec-icon icon-calendar" aria-hidden="true" />
                <span>Travel Dates: {{ order.items[0].item.startDate }}{{ order.items[0].item.endDate ? ` ~ ${order.items[0].item.endDate}` : '' }}</span>
              </div>
              <div class="spec-pill">
                <span class="order-spec-icon icon-users" aria-hidden="true" />
                <span>Travelers: {{ getTravelerSummary(order) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. 费用结算明细条 -->
        <div class="order-card__settlement">
          <div class="settlement-breakdown">
            <div class="settlement-item">
              <span class="settlement-label">Subtotal:</span>
              <span class="settlement-value">{{ formatMoney(order.order.subtotal, order.order.currency) }}</span>
            </div>
            <div v-if="getDiscounts(order) > 0" class="settlement-item discount">
              <span class="settlement-label">Discounts:</span>
              <span class="settlement-value">- {{ formatMoney(getDiscounts(order), order.order.currency) }}</span>
            </div>
            <div v-if="Number(order.order.manualAdjustmentAmount) !== 0" class="settlement-item">
              <span class="settlement-label">Adjustment:</span>
              <span class="settlement-value">{{ formatSignedMoney(order.order.manualAdjustmentAmount, order.order.currency) }}</span>
            </div>
          </div>

          <div class="settlement-total">
            <span class="total-label">{{ order.order.status === 'PENDING_PAYMENT' ? 'Payable Amount:' : 'Total Amount:' }}</span>
            <strong class="total-amount">{{ order.order.currency }} {{ order.order.totalAmount }}</strong>
          </div>
        </div>

        <!-- 4. 底部操作栏 -->
        <div class="order-card__actions">
          <div class="actions-left">
            <span v-if="order.activeOnlinePayment" class="payment-processing-badge">
              <span class="state-spinner-sm" /> Payment processing
            </span>
          </div>

          <div class="actions-right">
            <button
              v-if="order.order.status === 'PENDING_PAYMENT'"
              type="button"
              class="btn-order-secondary"
              :disabled="order.activeOnlinePayment || cancellingOrderNo === order.order.orderNo"
              @click="cancel(order.order.orderNo)"
            >
              {{ cancellingOrderNo === order.order.orderNo ? 'Cancelling...' : 'Cancel Order' }}
            </button>

            <NuxtLink
              v-if="itineraryNo(order)"
              :to="`/trips?itineraryNo=${encodeURIComponent(itineraryNo(order)!)}`"
              class="btn-order-secondary"
            >
              View Itinerary
            </NuxtLink>

            <NuxtLink
              v-if="order.order.status === 'PENDING_PAYMENT'"
              :to="`/orders/${encodeURIComponent(order.order.orderNo)}/pay`"
              class="btn-order-pay"
            >
              {{ order.activeOnlinePayment ? 'Resume Payment' : 'Pay Now' }}
            </NuxtLink>

            <button
              type="button"
              :class="order.order.status === 'PENDING_PAYMENT' ? 'btn-order-secondary' : 'btn-order-view'"
              @click="openOrder(order.order.orderNo)"
            >
              Order Details
            </button>
          </div>
        </div>
      </article>
    </div>

    <AccountPagination :page="currentPage" :size="10" :total="total" :loading="loading" @change="changePage" />

    <!-- 订单详情与交易快照弹窗 -->
    <Teleport to="body">
      <div v-if="selectedOrderNo" class="modal-backdrop" @click.self="closeOrder">
        <section class="order-modal" role="dialog" aria-modal="true" aria-labelledby="order-detail-title">
          <header class="modal-header">
            <div>
              <p class="modal-order-no">Order #{{ selectedOrderNo }}</p>
              <h2 id="order-detail-title">Order Snapshot & Breakdown</h2>
            </div>
            <button type="button" class="modal-close" aria-label="Close" @click="closeOrder">×</button>
          </header>

          <div v-if="detailLoading" class="content-state" role="status">Loading order details...</div>
          <div v-else-if="detailError" class="content-state error-state"><span>{{ detailError }}</span><button type="button" @click="openOrder(selectedOrderNo)">Try again</button></div>
          <template v-else-if="selectedOrder">
          <dl class="order-summary">
            <div>
              <dt>Order status</dt>
              <dd>{{ orderStatusLabel(selectedOrder.order.status) }}</dd>
            </div>
            <div>
              <dt>Subtotal</dt>
              <dd>{{ formatMoney(selectedOrder.order.subtotal, selectedOrder.order.currency) }}</dd>
            </div>
            <div>
              <dt>Promotion discount</dt>
              <dd>- {{ formatMoney(selectedOrder.order.promotionDiscountAmount, selectedOrder.order.currency) }}</dd>
            </div>
            <div>
              <dt>Coupon discount</dt>
              <dd>- {{ formatMoney(selectedOrder.order.couponDiscountAmount, selectedOrder.order.currency) }}</dd>
            </div>
            <div>
              <dt>Points applied</dt>
              <dd>- {{ formatMoney(selectedOrder.order.pointsAmount, selectedOrder.order.currency) }}</dd>
            </div>
            <div>
              <dt>Original payable</dt>
              <dd>{{ formatMoney(selectedOrder.originalPayableAmount, selectedOrder.order.currency) }}</dd>
            </div>
            <div v-if="Number(selectedOrder.order.manualAdjustmentAmount) !== 0">
              <dt>Manual adjustment</dt>
              <dd>{{ formatSignedMoney(selectedOrder.order.manualAdjustmentAmount, selectedOrder.order.currency) }}</dd>
            </div>
            <div>
              <dt>Final payable</dt>
              <dd>{{ formatMoney(selectedOrder.order.totalAmount, selectedOrder.order.currency) }}</dd>
            </div>
            <div>
              <dt>Order placed</dt>
              <dd>{{ formatDate(selectedOrder.order.createTime) }}</dd>
            </div>
          </dl>

          <div class="order-lines">
            <article v-for="line in selectedOrder.items" :key="line.item.id" class="line-item">
              <div class="line-content">
                <span class="line-badge">{{ line.itineraryNo ? `Itinerary #${line.itineraryNo}` : (line.snapshot?.productCode || line.item.itemType) }}</span>
                <h3 class="line-title">{{ line.snapshot?.title || 'Lvyv journey service' }}</h3>
                <p class="line-summary">{{ line.snapshot?.contentSummary }}</p>
              </div>
              <div class="line-meta">
                <strong>{{ line.snapshot?.currency || selectedOrder.order.currency }} {{ line.item.adultUnitPrice }}</strong>
                <span>{{ line.item.adultCount }} adults · {{ line.item.childCount }} children</span>
              </div>
            </article>
          </div>

          <footer class="modal-footer">
            <NuxtLink
              v-if="itineraryNo(selectedOrder)"
              :to="`/trips?itineraryNo=${encodeURIComponent(itineraryNo(selectedOrder)!)}`"
              class="btn-modal-secondary"
            >
              View Itinerary
            </NuxtLink>
            <NuxtLink
              v-if="selectedOrder.order.status === 'PENDING_PAYMENT'"
              :to="`/orders/${encodeURIComponent(selectedOrder.order.orderNo)}/pay`"
              class="btn-modal-primary"
            >
              {{ selectedOrder.activeOnlinePayment ? 'Resume Payment' : 'Pay Now' }}
            </NuxtLink>
            <button
              v-if="selectedOrder.order.status === 'PENDING_PAYMENT'"
              type="button"
              class="btn-modal-secondary"
              :disabled="selectedOrder.activeOnlinePayment || cancellingOrderNo === selectedOrder.order.orderNo"
              @click="cancel(selectedOrder.order.orderNo)"
            >
              Cancel Order
            </button>
            <button type="button" class="btn-modal-secondary" @click="closeOrder">
              Close
            </button>
          </footer>
          </template>
        </section>
      </div>
    </Teleport>
  </AccountPageShell>
</template>

<script setup lang="ts">
import AccountPageShell from '~/components/profile/AccountPageShell.vue'
import AccountPagination from '~/components/profile/AccountPagination.vue'
import type { OrderSummary } from '~/composables/useTourCommerce'
import type { OrderView } from '~/composables/useTourCommerce'

useNoIndex()
const { auth, ready, initializeAccount } = useAccountPage('/orders')
const commerce = useTourCommerce()
const route = useRoute()

const orders = ref<OrderSummary[]>([])
const selectedOrder = ref<OrderView | null>(null)
const loading = ref(false)
const error = ref('')
const cancellingOrderNo = ref<string | null>(null)

const filters = [
  { label: 'All orders', value: 'ALL' },
  { label: 'Waiting for payment', value: 'PENDING_PAYMENT' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled / Other', value: 'OTHER' },
]
const currentPage = ref(1)
const total = ref(0)
const statusCounts = ref<Record<string, number>>({})
let listRequest = 0
let detailRequest = 0
const selectedOrderNo = ref('')
const detailLoading = ref(false)
const detailError = ref('')
const activeFilter = ref('ALL')

const filterCount = (filterValue: string) => statusCounts.value[filterValue] || 0
const filteredOrders = computed(() => orders.value)

const formatDate = (value?: string) => value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value)) : ''

const formatOrderDate = (dateStr?: string) => {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  } catch {
    return dateStr
  }
}

const formatMoney = (value: string | number, currency: string) => new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(Number(value || 0))

const formatSignedMoney = (value: string | number, currency: string) => {
  const amount = Number(value || 0)
  const formatted = formatMoney(Math.abs(amount), currency)
  return amount > 0 ? `+${formatted}` : amount < 0 ? `-${formatted}` : formatted
}

const formatSourceType = (sourceType?: string) => {
  if (sourceType === 'STANDARD_PRODUCT' || sourceType === 'STANDARD_ITINERARY') return 'Featured Journey'
  if (sourceType === 'CUSTOM_SERVICE') return 'Custom Service'
  if (sourceType === 'WISH') return 'Wish Customization'
  return 'Trip Booking'
}

const getOrderTitle = (order: OrderSummary | OrderView) => {
  return order.items[0]?.snapshot?.title
    || (order.order.sourceType === 'CUSTOM_SERVICE' ? 'Custom itinerary service' : 'Lvyv journey service')
}

const getOrderSummary = (order: OrderSummary | OrderView) => {
  return order.items[0]?.snapshot?.contentSummary
    || 'Service details, verified itinerary arrangements and payment records for your journey.'
}

const getOrderCover = (order: OrderSummary | OrderView) => {
  const lineCover = order.items.find(line => line.coverUrl)?.coverUrl
  if (lineCover) return lineCover
  return '/images/profile/trip-sample-cover.webp'
}

const getTravelerSummary = (order: OrderSummary | OrderView) => {
  const firstItem = order.items[0]?.item
  if (!firstItem) return 'Travel party'
  const adults = firstItem.adultCount || 0
  const children = firstItem.childCount || 0
  const parts: string[] = []
  if (adults > 0) parts.push(`${adults} ${adults === 1 ? 'adult' : 'adults'}`)
  if (children > 0) parts.push(`${children} ${children === 1 ? 'child' : 'children'}`)
  return parts.length ? parts.join(', ') : 'Travel party'
}

const getDiscounts = (order: OrderSummary | OrderView) => {
  const promo = Number(order.order.promotionDiscountAmount || 0)
  const coupon = Number(order.order.couponDiscountAmount || 0)
  const points = Number(order.order.pointsAmount || 0)
  return promo + coupon + points
}

const load = async () => {
  const request = ++listRequest
  loading.value = true
  error.value = ''
  try {
    const result = await commerce.pageOrders(currentPage.value, activeFilter.value)
    if (request !== listRequest) return
    orders.value = result.list
    total.value = result.total
    statusCounts.value = result.statusCounts
    if (!result.list.length && currentPage.value > 1 && result.total <= (currentPage.value - 1) * 10) {
      currentPage.value = Math.max(1, Math.ceil(result.total / 10))
      await load()
    }
  } catch (caught) {
    if (request === listRequest) error.value = caught instanceof Error ? caught.message : 'Could not load orders.'
  } finally { if (request === listRequest) loading.value = false }
}
const changePage = (page: number) => { currentPage.value = page; void load() }
watch(activeFilter, () => { currentPage.value = 1; void load() })
const closeOrder = () => { ++detailRequest; selectedOrderNo.value = ''; selectedOrder.value = null }
const openOrder = async (orderNo: string) => {
  const request = ++detailRequest
  selectedOrderNo.value = orderNo
  selectedOrder.value = null
  detailLoading.value = true
  detailError.value = ''
  try {
    const result = await commerce.getOrder(orderNo)
    if (request === detailRequest) selectedOrder.value = result
  } catch (caught) {
    if (request === detailRequest) detailError.value = caught instanceof Error ? caught.message : 'Could not load order details.'
  } finally { if (request === detailRequest) detailLoading.value = false }
}

const orderStatusLabel = (status: string) => ({
  PENDING_PAYMENT: 'Waiting for payment',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
  REFUNDED: 'Refunded',
} as Record<string, string>)[status] || status

const orderStatusClass = (status: string) => {
  if (status === 'PENDING_PAYMENT') return 'pending'
  if (status === 'COMPLETED') return 'completed'
  if (['CANCELLED', 'REFUNDED'].includes(status)) return 'cancelled'
  return 'default'
}

const itineraryNo = (order: OrderSummary | OrderView) => order.items.find(line => line.itineraryNo)?.itineraryNo

const cancel = async (orderNo: string) => {
  if (!confirm('Are you sure you want to cancel this order?')) return
  cancellingOrderNo.value = orderNo
  try {
    const result = await commerce.cancelOrder(orderNo)
    if (selectedOrderNo.value === orderNo) { ++detailRequest; selectedOrder.value = result; detailLoading.value = false }
    await load()
  } catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'Could not cancel the order.'
  } finally {
    cancellingOrderNo.value = null
  }
}

onMounted(async () => {
  if (!auth.token.value) { await initializeAccount(); return }
  const orderNo = typeof route.query.order === 'string' ? route.query.order : ''
  await Promise.all([initializeAccount(), load(), ...(orderNo ? [openOrder(orderNo)] : [])])
})
onBeforeUnmount(() => { ++listRequest; closeOrder() })
watch(auth.token, () => { ++listRequest; orders.value = []; closeOrder() })
</script>

<style scoped>
/* 顶部筛选工具条 (4 等分网格，参考 /trips) */
.order-toolbar {
  width: 100%;
  max-width: 940px;
  margin-bottom: 24px;
}

.filter-tabs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  height: 32px;
  background: #ffffff;
  border-radius: 8.3px;
  box-shadow: 0 6px 6px 0 rgba(0, 0, 0, 0.02);
  overflow: hidden;
}

.filter-tabs button {
  height: 32px;
  width: 100%;
  border: none;
  background: transparent;
  color: rgba(0, 0, 0, 0.5);
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: all 180ms ease;
}

.filter-tabs button.active {
  background: #203d33;
  color: #ffffff;
  border-radius: 8.3px;
  box-shadow: 0 6px 6px 0 rgba(0, 0, 0, 0.02);
}

/* 列表容器 */
.order-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 940px;
}

/* 卡片主体 (940px 宽白底，微阴影，圆角 12px，参考 /trips) */
.order-card {
  width: 100%;
  max-width: 940px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 6px 0 rgba(0, 0, 0, 0.03);
  padding: 20px;
  box-sizing: border-box;
  transition: box-shadow 180ms ease, transform 180ms ease;
}

.order-card:hover {
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.05);
}

/* 卡片顶部元数据栏 */
.order-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.order-card__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #242424;
  font-size: 14px;
}

.order-card__no {
  font-family: 'Noto Sans SC', sans-serif;
  font-weight: 400;
  text-transform: uppercase;
}

.order-card__divider {
  width: 1px;
  height: 16px;
  background: rgba(75, 75, 75, 0.2);
}

.order-card__time {
  font-family: 'Noto Sans SC', sans-serif;
  font-weight: 700;
}

.order-card__status-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.order-card__expire {
  font-size: 12px;
  color: #b8621b;
  font-weight: 500;
  background: #fff7ed;
  padding: 2px 8px;
  border-radius: 4px;
}

.order-card__status {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #105446;
  text-align: right;
}

.order-card__status.ready,
.order-card__status.completed {
  color: #105446;
}

.order-card__status.pending {
  color: #b8621b;
  font-weight: 600;
}

.order-card__status.cancelled {
  color: #6e7974;
}

/* 细分割线 */
.order-card__sep {
  height: 1px;
  margin: 16px 0 20px;
  background: #d4d7de;
  opacity: 0.5;
}

/* 主体：媒体缩略图 + 详情 */
.order-card__main {
  display: flex;
  align-items: flex-start;
  gap: 18px;
}

/* 缩略图固定规格：84px × 84px */
.order-media {
  width: 84px;
  height: 84px;
  min-width: 84px;
  max-width: 84px;
  min-height: 84px;
  max-height: 84px;
  flex: 0 0 84px;
  border-radius: 6px;
  overflow: hidden;
  background: #f6f4f0;
}

.order-media img {
  width: 100%;
  height: 100%;
  max-width: 84px;
  max-height: 84px;
  object-fit: cover;
  display: block;
}

.order-card__content {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.order-card__header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 4px;
}

.order-card__title-box {
  min-width: 0;
  flex: 1;
}

.order-card__badges {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.order-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 3px;
  line-height: 1.4;
  text-transform: uppercase;
}

.itinerary-badge {
  background: #edf3ee;
  color: #174d40;
}

.product-badge {
  background: #f0f3f5;
  color: #4b5d67;
}

.type-badge {
  background: #faf6ee;
  color: #8a6421;
}

.count-badge {
  background: #eef4f1;
  color: #2a573f;
}

.order-card__title {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #2e473d;
  line-height: 1.3;
}

.order-card__unit-price {
  text-align: right;
  white-space: nowrap;
}

.unit-price-val {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #203d33;
}

.unit-price-label {
  font-size: 12px;
  color: #78877f;
  margin-left: 2px;
}

.order-card__summary {
  margin: 4px 0 10px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: #55665e;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 行项核心参数条 */
.order-card__specs {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.spec-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #4a5c54;
}

.order-spec-icon {
  width: 16px;
  height: 16px;
  flex: 0 0 16px;
  background-color: currentColor;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}

.icon-calendar {
  mask-image: url('/images/profile/icon-calendar.svg');
  -webkit-mask-image: url('/images/profile/icon-calendar.svg');
}

.icon-users {
  mask-image: url('/images/profile/icon-users.svg');
  -webkit-mask-image: url('/images/profile/icon-users.svg');
}

/* 结算明细渐变条 (核心财务字段展示) */
.order-card__settlement {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  height: 42px;
  padding: 0 16px;
  margin-top: 14px;
  border-radius: 4px;
  background: linear-gradient(90deg, rgba(245, 246, 243, 1) 0%, rgba(248, 254, 250, 0) 88%);
}

.settlement-breakdown {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 13px;
}

.settlement-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #4a5c54;
}

.settlement-item.discount {
  color: #1b7a4b;
}

.settlement-label {
  color: #78877f;
}

.settlement-value {
  font-weight: 600;
}

.settlement-total {
  display: flex;
  align-items: center;
  gap: 8px;
}

.total-label {
  font-size: 13px;
  color: #4a5c54;
  font-weight: 500;
}

.total-amount {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #203d33;
}

/* 操作按钮栏 (与 /trips 1:1 对标) */
.order-card__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 14px;
}

.actions-left {
  display: flex;
  align-items: center;
}

.payment-processing-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #b8621b;
  font-weight: 500;
}

.actions-right {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
}

/* 次要操作按钮 (高度 32px，细黑线框) */
.btn-order-secondary {
  height: 32px;
  padding: 0 16px;
  border: 0.65px solid #000000;
  border-radius: 3.25px;
  background: transparent;
  color: #000000;
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: inline-grid;
  place-items: center;
  text-decoration: none;
  transition: opacity 150ms ease;
  box-sizing: border-box;
}

.btn-order-secondary:hover:not(:disabled) {
  opacity: 0.7;
}

.btn-order-secondary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 主要操作按钮 (高度 32px，深绿底白字) */
.btn-order-view,
.btn-order-pay {
  height: 32px;
  padding: 0 18px;
  border: none;
  border-radius: 3.25px;
  background: #203d33;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: inline-grid;
  place-items: center;
  text-decoration: none;
  transition: background-color 150ms ease;
  box-sizing: border-box;
}

.btn-order-view:hover,
.btn-order-pay:hover {
  background: #2a573f;
}

/* 空状态和加载状态 */
.content-state {
  min-height: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border-radius: 12px;
  background: #fff;
  color: #75827c;
  font-size: 13px;
  text-align: center;
  box-shadow: 0 6px 6px 0 rgba(0, 0, 0, 0.02);
}

.content-state strong {
  color: #2e4137;
  font-size: 16px;
}

.content-state > span:not(.state-spinner) {
  max-width: 420px;
  line-height: 1.55;
}

.content-state button,
.content-state a {
  margin-top: 7px;
  padding: 10px 14px;
  border: 1px solid #174d40;
  background: #174d40;
  color: #fff;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  border-radius: 4px;
}

.error-state > svg {
  color: #a33e35;
  font-size: 24px;
}

.empty-symbol {
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  margin-bottom: 8px;
  border-radius: 50%;
  background: #edf3ee;
  color: #174d40;
  font-size: 22px;
}

.state-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid #ccd5d0;
  border-top-color: #174d40;
  border-radius: 50%;
  animation: spin 700ms linear infinite;
}

.state-spinner-sm {
  width: 12px;
  height: 12px;
  border: 2px solid #ccd5d0;
  border-top-color: #b8621b;
  border-radius: 50%;
  animation: spin 700ms linear infinite;
  display: inline-block;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 详情弹窗 */
.modal-backdrop {
  position: fixed;
  z-index: 1500;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(11, 28, 22, 0.58);
}

.order-modal {
  width: min(720px, 100%);
  max-height: calc(100dvh - 40px);
  overflow-y: auto;
  padding: 30px;
  background: #ffffff;
  box-shadow: 0 24px 70px rgba(8, 28, 20, 0.3);
  border-radius: 12px;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e1e7e2;
}

.modal-order-no {
  margin: 0 0 6px;
  color: #84918a;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.modal-header h2 {
  margin: 0;
  color: #173f34;
  font: 600 28px/1.2 'Playfair Display', Georgia, serif;
}

.modal-close {
  width: 34px;
  height: 34px;
  border: none;
  background: #f0f3f0;
  color: #52605b;
  font-size: 23px;
  border-radius: 6px;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: background-color 150ms ease;
}

.modal-close:hover {
  background: #e2e8e3;
}

.order-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 20px 0;
}

.order-summary div {
  padding: 13px;
  background: #f5f7f5;
  border-radius: 6px;
}

.order-summary dt {
  color: #84918a;
  font-size: 10px;
  text-transform: uppercase;
  font-weight: 600;
}

.order-summary dd {
  margin: 5px 0 0;
  color: #35473e;
  font-size: 13px;
  font-weight: 700;
}

.order-lines {
  display: grid;
  gap: 12px;
  margin-bottom: 24px;
}

.line-item {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 16px 0;
  border-bottom: 1px solid #e6ebe7;
}

.line-badge {
  color: #84918a;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.line-title {
  margin: 5px 0;
  color: #2a3c33;
  font-size: 15px;
  font-weight: 600;
}

.line-summary {
  margin: 0;
  color: #75827c;
  font-size: 12px;
}

.line-meta {
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  gap: 5px;
  white-space: nowrap;
}

.line-meta strong {
  color: #174d40;
  font-size: 15px;
}

.line-meta span {
  color: #75827c;
  font-size: 12px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 20px;
  border-top: 1px solid #e1e7e2;
}

.btn-modal-secondary {
  height: 32px;
  padding: 0 16px;
  border: 0.65px solid #000000;
  border-radius: 3.25px;
  background: transparent;
  color: #000000;
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: inline-grid;
  place-items: center;
  text-decoration: none;
  transition: opacity 150ms ease;
  box-sizing: border-box;
}

.btn-modal-secondary:hover:not(:disabled) {
  opacity: 0.7;
}

.btn-modal-secondary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-modal-primary {
  height: 32px;
  padding: 0 18px;
  border: none;
  border-radius: 3.25px;
  background: #203d33;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: inline-grid;
  place-items: center;
  text-decoration: none;
  transition: background-color 150ms ease;
  box-sizing: border-box;
}

.btn-modal-primary:hover {
  background: #2a573f;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .order-card__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .order-card__settlement {
    flex-direction: column;
    align-items: flex-start;
    height: auto;
    padding: 12px;
    gap: 10px;
  }

  .settlement-breakdown {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .order-card__actions {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .actions-right {
    width: 100%;
    justify-content: flex-end;
  }

  .order-summary {
    grid-template-columns: 1fr;
  }

  .line-item {
    flex-direction: column;
  }

  .line-meta {
    align-items: flex-start;
  }
}
</style>
