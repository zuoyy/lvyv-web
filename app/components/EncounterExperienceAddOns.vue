<template>
  <section class="section alt" id="addons">
    <div class="section alt-inner">
      <div class="up-head-row">
        <div class="section-head">
          <div class="eyebrow">Pairs Well With</div>
          <h2 class="section-title">Build your <span class="italic">{{ wellness ? 'Wellness Journey.' : 'Ritual' }}</span></h2>
          <p v-if="wellness" class="section-sub">Make more of your time in China. Personalize your visit with optional health and wellness experiences, all coordinated by LVYV.</p>
          <p v-else class="section-sub">Exclusive add-on prices, available on this page only. Pick up to 2 experiences to book together.</p>
          <div class="up-counter" aria-live="polite"><b>{{ selected.length }}</b> / {{ maxAddOns }} add-ons selected</div>
        </div>
        <div v-if="cards.length" class="up-nav">
          <button type="button" aria-label="Previous add-ons" :disabled="atStart" @click="slide(-1)">←</button>
          <button type="button" aria-label="Next add-ons" :disabled="atEnd" @click="slide(1)">→</button>
        </div>
      </div>
      <p v-if="addOnsStatus === 'pending' || addOnsStatus === 'idle'" class="up-notice" role="status">Loading add-ons…</p>
      <p v-else-if="addOnsStatus === 'error'" class="up-notice" role="alert">
        We couldn’t load the add-ons.
        <button class="up-add" type="button" @click="refreshAddOns()">Try again</button>
      </p>
      <p v-else-if="!cards.length" class="up-notice">There are no add-ons available in {{ cityName }} right now.</p>
      <template v-else>
        <div class="up-notice">
          <span class="tag">Add-on only</span>
          <span>
            These prices exist only in this booking flow<span v-if="exampleAddOn"> — e.g. {{ exampleAddOn.name }} is normally {{ encounterPrice(exampleAddOn.price) }}, <b>{{ encounterPrice(exampleAddOn.addOnPrice) }} here</b></span>.
            <template v-if="maxSavings > 0 && cards.length >= 2"> Add two and save up to {{ encounterPrice(maxSavings / 100) }}.</template>
          </span>
        </div>
        <div ref="addOnGrid" class="up-grid" :class="{ dragging }" tabindex="0" role="region" :aria-label="cityName + ' experience add-ons'"
             @scroll.passive="updateCarousel" @pointerdown="startDrag" @click.capture="suppressDragClick"
             @keydown.left.prevent="slide(-1)" @keydown.right.prevent="slide(1)" @dragstart.prevent>
          <div v-for="card in cards" :key="card.key" class="up-card"
               :class="{ added: isSelected(card.key), locked: isLocked(card.key) }">
            <div class="up-img">
              <img v-if="card.image" :src="card.image" alt="" loading="lazy">
              <div v-if="card.savings > 0" class="up-ribbon">SAVE {{ encounterPrice(card.savings / 100) }}</div>
            </div>
            <div class="up-body">
              <div class="up-cat">{{ card.label }}</div>
              <h4>{{ card.name }}</h4>
              <p>{{ card.summary }}</p>
              <div class="up-pricebox">
                <div class="up-price-top">
                  <span class="up-price-now">{{ encounterPrice(card.addOnPrice) }}</span>
                  <span class="up-price-was">{{ encounterPrice(card.price) }}</span>
                  <span v-if="card.savings > 0" class="up-save">save {{ encounterPrice(card.savings / 100) }}</span>
                </div>
                <div class="up-price-note">ADD-ON PRICE · THIS PAGE ONLY</div>
              </div>
              <div class="up-foot">
                <span class="up-exclusive">Exclusive add-on</span>
                <button class="up-add" type="button" :disabled="!isSelected(card.key) && (basePrice == null || isLocked(card.key))"
                        :aria-pressed="isSelected(card.key)" @click="toggleAddOn(card.key)">
                  <span class="add-label">{{ isLocked(card.key) ? 'Max 2' : '+ Add' }}</span>
                  <span class="added-label">✓ Added</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="up-dots" aria-hidden="true">
          <i v-for="dot in dotCount" :key="dot" :class="{ active: activeDot === dot - 1 }"></i>
        </div>
      </template>
    </div>
  </section>

  <aside v-if="selected.length && basePrice != null" class="bundle-float" :class="{ show: cartOpen }" :inert="!cartOpen" :style="{ '--experience-book-bar': bookBarHeight + 'px' }" :aria-label="cartTitle">
    <div class="bf-head">
      <div class="bf-title">{{ cartTitle }} <span v-if="bundleComplete" class="badge-3">3-Item Set</span></div>
      <button class="bf-close" type="button" :aria-label="'Close ' + cartTitle" @click="cartOpen = false">×</button>
    </div>
    <ul class="bf-list">
      <li><div class="check">✓</div><span class="item-name">{{ baseTitle }} (Base)</span><span class="item-price">{{ basePriceText }}</span></li>
      <li v-for="card in selected" :key="card.key">
        <div class="check">✓</div>
        <span class="item-name">{{ card.name }}</span>
        <span class="item-price">{{ encounterPrice(card.addOnPrice) }}<s>{{ encounterPrice(card.price) }}</s></span>
      </li>
    </ul>
    <div class="bf-total">
      <span class="bf-total-label">{{ bundleDiscount ? 'Bundle total' : 'Subtotal' }}</span>
      <span>
        <span class="bf-total-price">{{ cartPrice }}</span>
        <span v-if="bundleDiscount && bundleAmount < subtotal" class="bf-save">save {{ encounterPrice((subtotal - bundleAmount) / 100) }}</span>
      </span>
    </div>
    <div v-if="addOnSavings > 0" class="bf-saved">You save {{ encounterPrice(addOnSavings / 100) }} with add-on prices</div>
    <button class="bf-cta" type="button" :disabled="!baseSkuCode || checkingOut" @click="checkoutBundle">Book This Bundle →</button>
    <p v-if="checkoutError" class="bf-upsell-hint" role="alert">{{ checkoutError }}</p>
  </aside>

  <slot :book="book" />

  <div ref="bookBar" class="book-bar">
    <div class="book-bar-left">
      <div class="t">{{ baseTitle }}</div>
      <div class="s">{{ bookBarDescription }}</div>
    </div>
    <div class="book-bar-right">
      <div class="book-bar-price">
        <span class="from">{{ selected.length && basePrice != null ? 'per person' : 'from' }}</span>
        <span class="num">{{ selected.length && basePrice != null ? cartPrice : basePriceText }}</span>
      </div>
      <button class="book-bar-cta" type="button" @click="book">{{ selected.length && basePrice != null ? 'View Bundle →' : 'Book Now →' }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { encounterImage, encounterProducts } from '~~/shared/utils/encounterProducts'

const props = withDefaults(defineProps<{
  productCode: string
  cityCode?: 'beijing' | 'xian'
  baseSkuCode?: string
  baseTitle: string
  basePrice: number | null
  referencePrice?: number
  description: string
  bundleLabel: string
  exampleProductCode?: string
  wellness?: boolean
  prepareBundle?: () => boolean
}>(), {
  cityCode: 'beijing',
})
const emit = defineEmits<{ book: [] }>()
const commerce = useCommerce()
const cityName = props.cityCode === 'xian' ? "Xi'an" : 'Beijing'
const addOnRequest = await useAsyncData('experience-add-ons:' + props.productCode,
  () => commerce.experienceAddOns(props.cityCode, props.productCode), { default: () => [] })
const { data: addOns, status: addOnsStatus, refresh: refreshAddOns } = addOnRequest
const cardCopy: Record<string, { label: string; summary: string; image?: string }> = {
  'ENC-BJ-DENTAL-CLEANING': {
    label: 'Light Medical',
    summary: 'Professional cleaning, X-ray, consultation. English-speaking staff.',
    image: 'dental/cleaning',
  },
  'ENC-BJ-TCM-PULSE-ACUPUNCTURE': {
    label: 'Signature TCM',
    summary: 'Pulse diagnosis, acupuncture and cupping at a renowned TCM hospital. English guide.',
    image: 'detail/pulse-diagnosis',
  },
  'ENC-BJ-EYE-EXAM-CUSTOM-GLASSES': {
    label: 'Light Medical',
    summary: 'Full optometry exam. 3 pairs made before dinner. Same-day pickup.',
    image: 'detail/eye-exam',
  },
}
const toCents = (price: number) => Math.round(price * 100)
const cards = computed(() => addOns.value.map(item => {
  const copy = cardCopy[item.productCode]
  const catalogImage = encounterProducts.find(entry => entry.code === item.productCode)?.image
  const image = copy?.image || catalogImage
  return {
    ...item,
    key: `${item.productCode}:${item.skuCode ?? 'DEFAULT'}`,
    name: item.skuName && item.skuName !== item.name ? `${item.name} · ${item.skuName}` : item.name,
    image: item.coverUrl || encounterImage(image || 'temple-of-heaven'),
    label: copy?.label || 'Single Experience',
    summary: item.summary || copy?.summary || '',
    savings: toCents(item.price) - toCents(item.addOnPrice),
  }
}))
const exampleAddOn = computed(() => {
  const code = props.exampleProductCode ?? (props.cityCode === 'xian' ? 'ENC-XA-TCM-PULSE-ACUPUNCTURE' : 'ENC-BJ-TCM-PULSE-ACUPUNCTURE')
  return cards.value.find(card => card.productCode === code && card.savings > 0)
})
const maxSavings = computed(() => cards.value.map(card => card.savings)
  .filter(savings => savings > 0).sort((a, b) => b - a).slice(0, 2).reduce((total, savings) => total + savings, 0))

const maxAddOns = 2
const selectedKeys = ref<string[]>([])
const cartOpen = ref(false)
const checkingOut = ref(false)
const checkoutError = ref('')
const selected = computed(() => selectedKeys.value.flatMap(key => {
  const card = cards.value.find(item => item.key === key)
  return card ? [card] : []
}))
const bundleComplete = computed(() => selected.value.length === maxAddOns)
const bundleDiscount = computed(() => bundleComplete.value && !props.wellness)
const cartTitle = computed(() => props.wellness ? 'Your Wellness Journey' : 'Your Ritual')
const basePriceText = computed(() => {
  const price = props.basePrice ?? props.referencePrice
  return price == null ? '—' : encounterPrice(price)
})
const subtotal = computed(() => selected.value.reduce((total, card) => total + toCents(card.addOnPrice), toCents(props.basePrice ?? 0)))
// The prototype rounds the 10% bundle discount to a whole dollar.
const bundleAmount = computed(() => Math.min(subtotal.value, Math.max(3, Math.round(subtotal.value * 9 / 1000) * 100)))
const cartPrice = computed(() => encounterPrice((bundleDiscount.value ? bundleAmount.value : subtotal.value) / 100))
const addOnSavings = computed(() => selected.value.reduce((total, card) => total + card.savings, 0))
const bookBarDescription = computed(() => {
  if (selected.value.length === 2 && props.basePrice != null) return props.bundleLabel + ' + 2 add-ons'
  if (selected.value.length === 1 && props.basePrice != null) return props.bundleLabel + ' + 1 add-on'
  return props.description
})
const isSelected = (key: string) => selectedKeys.value.includes(key)
const isLocked = (key: string) => !isSelected(key) && bundleComplete.value

watch(cards, (available) => {
  if (addOnsStatus.value !== 'success') return
  selectedKeys.value = selectedKeys.value.filter(key => available.some(card => card.key === key))
  if (!selectedKeys.value.length) cartOpen.value = false
})
function toggleAddOn(key: string) {
  if (isLocked(key)) return
  selectedKeys.value = isSelected(key) ? selectedKeys.value.filter(item => item !== key) : [...selectedKeys.value, key]
  rememberExperienceAddOns(props.productCode, selectedKeys.value)
  cartOpen.value = selectedKeys.value.length > 0
  checkoutError.value = ''
}
async function checkoutBundle() {
  if (!props.baseSkuCode || !selected.value.length || checkingOut.value) return
  if (props.prepareBundle && !props.prepareBundle()) {
    cartOpen.value = false
    return
  }
  checkingOut.value = true
  checkoutError.value = ''
  try {
    await navigateTo(bundleCheckoutPath({ productCode: props.productCode, skuCode: props.baseSkuCode },
      selected.value.map(card => ({ productCode: card.productCode, skuCode: card.skuCode ?? 'DEFAULT' }))))
  } catch {
    checkoutError.value = 'Could not open checkout. Try again.'
  } finally {
    checkingOut.value = false
  }
}
function book() {
  if (selected.value.length && props.basePrice != null) {
    cartOpen.value = true
  } else {
    emit('book')
  }
}

const addOnGrid = useTemplateRef('addOnGrid')
const bookBar = useTemplateRef('bookBar')
const bookBarHeight = ref(80)
const dotCount = ref(1)
const activeDot = ref(0)
const atStart = ref(true)
const atEnd = ref(true)
function updateCarousel() {
  const grid = addOnGrid.value
  if (!grid || !grid.clientWidth) return
  const scrollRange = grid.scrollWidth - grid.clientWidth
  dotCount.value = Math.max(1, Math.ceil(grid.scrollWidth / grid.clientWidth))
  activeDot.value = scrollRange > 0 ? Math.round(grid.scrollLeft / scrollRange * (dotCount.value - 1)) : 0
  atStart.value = grid.scrollLeft <= 2
  atEnd.value = grid.scrollLeft >= scrollRange - 2
}
function slide(direction: number) {
  const grid = addOnGrid.value
  const card = grid?.querySelector<HTMLElement>('.up-card')
  if (!grid || !card) return
  const gap = Number.parseFloat(getComputedStyle(grid).columnGap) || 0
  grid.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: 'smooth' })
}

const dragging = ref(false)
let drag: { id: number; x: number; scroll: number } | undefined
let dragMoved = false
let lastDragEnd = 0
function startDrag(event: PointerEvent) {
  if (event.pointerType !== 'mouse' || event.button !== 0 || !addOnGrid.value || (atStart.value && atEnd.value)) return
  drag = { id: event.pointerId, x: event.clientX, scroll: addOnGrid.value.scrollLeft }
  dragMoved = false
  lastDragEnd = 0
}
function moveDrag(event: PointerEvent) {
  if (!drag || event.pointerId !== drag.id || !addOnGrid.value) return
  const dx = event.clientX - drag.x
  if (!dragMoved && Math.abs(dx) <= 4) return
  dragMoved = true
  if (!dragging.value) {
    dragging.value = true
    // Disable scroll snapping before applying the first manual offset.
    addOnGrid.value.classList.add('dragging')
  }
  addOnGrid.value.scrollLeft = drag.scroll - dx
}
function stopDrag(event: PointerEvent) {
  if (!drag || event.pointerId !== drag.id) return
  drag = undefined
  dragging.value = false
  if (dragMoved) lastDragEnd = performance.now()
}
function suppressDragClick(event: MouseEvent) {
  if (event.detail === 0 || !lastDragEnd || performance.now() - lastDragEnd > 120) return
  event.preventDefault()
  event.stopPropagation()
}

onMounted(() => {
  const saved = rememberExperienceAddOns(props.productCode)
  if (addOnsStatus.value === 'success') {
    selectedKeys.value = saved.filter(key => cards.value.some(card => card.key === key))
  } else {
    selectedKeys.value = saved
  }
  cartOpen.value = selectedKeys.value.length > 0
  const resize = new ResizeObserver(() => {
    updateCarousel()
    if (bookBar.value) bookBarHeight.value = bookBar.value.offsetHeight
  })
  if (bookBar.value) resize.observe(bookBar.value)
  const stopWatch = watch(addOnGrid, (grid, oldGrid) => {
    if (oldGrid) resize.unobserve(oldGrid)
    if (grid) resize.observe(grid)
    updateCarousel()
  }, { immediate: true, flush: 'post' })
  window.addEventListener('pointermove', moveDrag, { passive: true })
  window.addEventListener('pointerup', stopDrag)
  window.addEventListener('pointercancel', stopDrag)
  onBeforeUnmount(() => {
    stopWatch()
    resize.disconnect()
    window.removeEventListener('pointermove', moveDrag)
    window.removeEventListener('pointerup', stopDrag)
    window.removeEventListener('pointercancel', stopDrag)
  })
})
</script>
