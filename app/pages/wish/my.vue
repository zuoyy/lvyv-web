<template>
  <AccountPageShell
    active-page="wishes"
    kicker="Travel ideas"
    title="My wishes"
    description="Follow every idea from the first spark to a journey designed around you."
    :ready="ready"
  >
    <template #actions>
      <button class="primary-action" type="button" @click="showCreateDialog = true">
        <font-awesome-icon :icon="['fas', 'plus']" /> New wish
      </button>
    </template>

    <div class="wish-toolbar">
      <div>
        <strong>{{ total }} {{ total === 1 ? 'wish' : 'wishes' }}</strong>
        <span>Newest first</span>
      </div>
      <label>
        <span>Status</span>
        <select v-model="statusFilter" @change="changeFilter">
          <option value="">All statuses</option>
          <option v-for="option in statusOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
      </label>
    </div>

    <div v-if="loading" class="content-state" role="status"><span class="state-spinner" />Loading wishes...</div>
    <div v-else-if="loadError" class="content-state error-state">
      <font-awesome-icon :icon="['fas', 'circle-exclamation']" />
      <strong>We could not load your wishes.</strong>
      <span>{{ loadError }}</span>
      <button type="button" @click="fetchWishes">Try again</button>
    </div>
    <div v-else-if="!wishes.length" class="content-state empty-state">
      <div class="empty-symbol"><font-awesome-icon :icon="['fas', 'heart']" /></div>
      <strong>{{ statusFilter ? 'No wishes match this status' : 'Your first wish starts here' }}</strong>
      <span>{{ statusFilter ? 'Choose another status to see more.' : 'Tell us what you hope to experience and we will shape it into a journey.' }}</span>
      <button v-if="!statusFilter" class="primary-action" type="button" @click="showCreateDialog = true">Create a wish</button>
    </div>

    <div v-else class="wish-list">
      <article v-for="wish in wishes" :key="wish.id" class="wish-item">
        <div class="wish-main">
          <div class="wish-topline">
            <span class="wish-number">{{ wish.wishNo }}</span>
            <span class="status-badge" :class="statusClass(wish.status)">{{ wish.statusLabel }}</span>
          </div>
          <h2>{{ wish.cityLabel || cityFallback(wish.cityCode) }}</h2>
          <p class="wish-story">{{ wish.story }}</p>
          <div v-if="wish.interests?.length" class="interest-list">
            <span v-for="interest in wish.interests" :key="interest.code">{{ interest.label }}</span>
          </div>
        </div>
        <div class="wish-meta">
          <div><font-awesome-icon :icon="['fas', 'calendar-days']" /><span>{{ wish.startDate ? formatDate(wish.startDate) : 'Flexible dates' }}</span></div>
          <div><font-awesome-icon :icon="['fas', 'route']" /><span>{{ wish.tripDays }} {{ wish.tripDays === 1 ? 'day' : 'days' }}</span></div>
          <div><font-awesome-icon :icon="['fas', 'gift']" /><span>{{ wish.budgetLevelLabel }}</span></div>
        </div>
        <div class="wish-footer">
          <span>Created {{ formatDate(wish.createTime) }}</span>
          <NuxtLink v-if="wish.hasItinerary" :to="wish.itineraryNo ? `/trips?itineraryNo=${encodeURIComponent(wish.itineraryNo)}` : '/trips'">{{ wishActionLabel(wish.status) }} <font-awesome-icon :icon="['fas', 'arrow-right']" /></NuxtLink>
          <span v-else class="design-note">{{ wish.designerNickname ? `With ${wish.designerNickname}` : 'Waiting for a travel designer' }}</span>
        </div>
      </article>
    </div>

    <div v-if="totalPages > 1 && !loading" class="pagination" aria-label="Wish pages">
      <button type="button" :disabled="page <= 1" aria-label="Previous page" @click="goPage(page - 1)"><font-awesome-icon :icon="['fas', 'chevron-left']" /></button>
      <span>Page {{ page }} of {{ totalPages }}</span>
      <button type="button" :disabled="page >= totalPages" aria-label="Next page" @click="goPage(page + 1)"><font-awesome-icon :icon="['fas', 'chevron-right']" /></button>
    </div>

    <Teleport to="body">
      <div v-if="showCreateDialog" class="modal-backdrop" @click.self="closeCreateDialog">
        <section class="wish-modal" role="dialog" aria-modal="true" aria-labelledby="new-wish-title">
          <header><div><p>New journey</p><h2 id="new-wish-title">Make a wish</h2></div><button type="button" aria-label="Close" @click="closeCreateDialog">×</button></header>
          <form @submit.prevent="submitWish">
            <div class="form-grid">
              <label class="field"><span>Destination</span><select v-model="wishForm.cityCode" required><option value="xian">Xi'an</option><option value="chengdu">Chengdu</option><option value="surprise">Surprise me</option></select></label>
              <label class="field"><span>Trip length</span><input v-model.number="wishForm.tripDays" type="number" min="1" max="30" required></label>
              <label class="field"><span>Start date <em>Optional</em></span><input v-model="wishForm.startDate" type="date" :min="today"></label>
              <label class="field"><span>Budget</span><select v-model="wishForm.budgetLevel" required><option value="backpacker">Budget</option><option value="comfort">Comfort</option><option value="premium">Premium</option></select></label>
            </div>
            <fieldset class="interest-field"><legend>What are you drawn to?</legend><label v-for="interest in interestOptions" :key="interest.value"><input v-model="wishForm.interestCodes" type="checkbox" :value="interest.value"><span>{{ interest.label }}</span></label></fieldset>
            <label class="field"><span>Your wish</span><textarea v-model="wishForm.story" rows="5" maxlength="1000" required placeholder="I wish to..."></textarea><small>{{ wishForm.story.length }}/1000</small></label>
            <label class="field"><span>Anything else? <em>Optional</em></span><textarea v-model="wishForm.specialRequirement" rows="3" maxlength="500" placeholder="Accessibility, dietary or pacing preferences"></textarea></label>
            <p v-if="submitError" class="submit-error" role="alert">{{ submitError }}</p>
            <div class="modal-actions"><button type="button" class="secondary-button" @click="closeCreateDialog">Cancel</button><button type="submit" class="primary-action" :disabled="submitting">{{ submitting ? 'Submitting' : 'Submit wish' }}</button></div>
          </form>
        </section>
      </div>
    </Teleport>
  </AccountPageShell>
</template>

<script setup lang="ts">
import AccountPageShell from '~/components/profile/AccountPageShell.vue'

useNoIndex()

interface EnumLabel { code: string; messageKey: string; label: string }
interface WishItem {
  id: number; wishNo: string; cityCode: string; cityLabel: string; tripDays: number; startDate?: string
  interests: EnumLabel[]; budgetLevelLabel: string; story: string; status: string; statusLabel: string
  designerNickname?: string; createTime: string; hasItinerary: boolean; itineraryNo?: string
}
interface PageResult<T> { list: T[]; total: number; page: number; size: number }
interface ApiResult<T> { code: number; msg?: string; data: T }

const route = useRoute()
const accountRedirectPath = route.query.create === '1' ? '/wish/my?create=1' : '/wish/my'
const { auth, ready, initializeAccount } = useAccountPage(accountRedirectPath)
const config = useRuntimeConfig()
const wishes = ref<WishItem[]>([])
const loading = ref(false)
const loadError = ref('')
const page = ref(1)
const size = 10
const total = ref(0)
const statusFilter = ref('')
const showCreateDialog = ref(false)
const submitting = ref(false)
const submitError = ref('')

const statusOptions = [
  { value: 'SUBMITTED', label: 'Submitted' }, { value: 'ITINERARY_PLANNING', label: 'Itinerary planning' },
  { value: 'WAITING_CONFIRMATION', label: 'Review itinerary and offer' }, { value: 'WAITING_PAYMENT', label: 'Waiting for payment' },
  { value: 'REVISION_REQUESTED', label: 'Revision requested' }, { value: 'REVISING', label: 'Revision in progress' },
  { value: 'DELIVERED', label: 'Completed' }, { value: 'CLOSED', label: 'Closed' }, { value: 'CANCELLED', label: 'Cancelled' },
]
const interestOptions = [
  { value: 'street_eats', label: 'Street eats' }, { value: 'ancient_stories', label: 'Ancient stories' },
  { value: 'art_craft', label: 'Arts & crafts' }, { value: 'night_vibes', label: 'Night vibes' },
  { value: 'nature_hiking', label: 'Nature hiking' }, { value: 'photo_spots', label: 'Photo spots' },
  { value: 'local_life', label: 'Local life' },
]
const blankWishForm = () => ({ cityCode: 'xian', tripDays: 3, startDate: '', budgetLevel: 'comfort', interestCodes: [] as string[], story: '', specialRequirement: '' })
const wishForm = reactive(blankWishForm())
const today = new Date().toISOString().slice(0, 10)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / size)))

const headers = computed(() => ({
  Authorization: `Bearer ${auth.token.value}`,
  'Accept-Language': auth.member.value?.locale || 'en-US',
  'X-Time-Zone': auth.member.value?.timezone || detectMemberTimeZone(),
}))

const fetchWishes = async () => {
  loading.value = true
  loadError.value = ''
  try {
    const response = await $fetch<ApiResult<PageResult<WishItem>>>('/tour/wishes/page', {
      baseURL: config.public.apiBase as string,
      headers: headers.value,
      params: { page: page.value, size, ...(statusFilter.value ? { status: statusFilter.value } : {}) },
    })
    if (response.code !== 200) throw new Error(response.msg || 'Request failed')
    wishes.value = response.data.list
    total.value = response.data.total
    page.value = response.data.page
  } catch (caught) {
    loadError.value = caught instanceof Error ? caught.message : 'Request failed.'
  } finally {
    loading.value = false
  }
}

const changeFilter = () => { page.value = 1; fetchWishes() }
const goPage = (value: number) => { page.value = value; fetchWishes(); window.scrollTo({ top: 0, behavior: 'smooth' }) }
const formatDate = (value: string) => new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(value))
const cityFallback = (code: string) => ({ xian: "Xi'an", chengdu: 'Chengdu', surprise: 'Surprise destination' }[code] || code)
const statusClass = (status: string) => status === 'DELIVERED' ? 'success'
  : ['CLOSED', 'CANCELLED'].includes(status) ? 'muted'
    : ['REVISION_REQUESTED', 'REVISING'].includes(status) ? 'warning' : 'active'
const wishActionLabel = (status: string) => status === 'WAITING_CONFIRMATION' ? 'Review itinerary and offer'
  : status === 'WAITING_PAYMENT' ? 'View payment order' : 'View itinerary'
const closeCreateDialog = () => { showCreateDialog.value = false; submitError.value = ''; Object.assign(wishForm, blankWishForm()) }

const submitWish = async () => {
  submitError.value = ''
  submitting.value = true
  try {
    const response = await $fetch<ApiResult<number>>('/tour/wishes', {
      baseURL: config.public.apiBase as string,
      method: 'POST',
      headers: headers.value,
      body: { ...wishForm, startDate: wishForm.startDate || null, imageFileIds: [] },
    })
    if (response.code !== 200) throw new Error(response.msg || 'Unable to submit wish')
    closeCreateDialog()
    statusFilter.value = ''
    page.value = 1
    await fetchWishes()
  } catch (caught) {
    submitError.value = caught instanceof Error ? caught.message : 'Unable to submit wish.'
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  if (!await initializeAccount()) return
  if (route.query.create === '1') showCreateDialog.value = true
  await fetchWishes()
})
</script>

<style scoped>
.primary-action { min-height: 44px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 0 17px; border: 1px solid #174d40; border-radius: 2px; background: #174d40; color: #fff; font: 700 12px/1 'Inter', sans-serif; cursor: pointer; }
.primary-action:hover:not(:disabled) { background: #0e392e; }
.primary-action:disabled { opacity: .55; cursor: wait; }
.wish-toolbar { min-height: 62px; display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 18px; padding: 0 4px 16px; border-bottom: 1px solid #dfe5e1; }
.wish-toolbar > div { display: flex; flex-direction: column; gap: 4px; }
.wish-toolbar strong { color: #26372f; font-size: 14px; }
.wish-toolbar > div span { color: #8a9690; font-size: 11px; }
.wish-toolbar label { display: flex; align-items: center; gap: 9px; color: #6b7972; font-size: 11px; font-weight: 700; }
.wish-toolbar select { min-height: 38px; padding: 0 32px 0 10px; border: 1px solid #ccd6d0; background: #fff; color: #2b3d34; font: 500 12px/1 'Inter', sans-serif; }
.wish-list { display: grid; gap: 14px; }
.wish-item { padding: 25px 26px 0; border: 1px solid #dfe5e1; background: #fff; transition: border-color .18s, box-shadow .18s; }
.wish-item:hover { border-color: #a9b9b0; box-shadow: 0 10px 28px rgba(26, 55, 46, .06); }
.wish-topline { display: flex; align-items: center; justify-content: space-between; gap: 14px; }
.wish-number { color: #8a9690; font-size: 11px; font-weight: 700; }
.status-badge { padding: 6px 8px; font-size: 10px; font-weight: 800; text-transform: uppercase; }
.status-badge.active { background: #e8f0ea; color: #2c6245; }
.status-badge.success { background: #edf7dc; color: #4f7026; }
.status-badge.warning { background: #fff4d8; color: #8b631d; }
.status-badge.muted { background: #eef0ee; color: #6e7974; }
.wish-item h2 { margin: 11px 0 8px; color: #173f34; font: 600 24px/1.2 'Playfair Display', Georgia, serif; }
.wish-story { display: -webkit-box; max-width: 700px; margin: 0; overflow: hidden; color: #5f6e67; font-size: 13px; line-height: 1.6; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.interest-list { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 15px; }
.interest-list span { padding: 5px 8px; border: 1px solid #dce3de; border-radius: 20px; color: #5a6962; font-size: 10px; }
.wish-meta { display: flex; flex-wrap: wrap; gap: 18px; margin-top: 19px; padding: 15px 0; border-top: 1px solid #edf1ee; }
.wish-meta div { display: flex; align-items: center; gap: 7px; color: #64736c; font-size: 11px; }
.wish-meta svg { color: #799487; }
.wish-footer { min-height: 52px; display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-inline: -26px; padding: 0 26px; background: #f7f9f6; color: #89958f; font-size: 11px; }
.wish-footer a { color: #174d40; font-weight: 700; text-decoration: none; }
.wish-footer a svg { margin-left: 5px; }
.design-note { color: #75827c; }
.content-state { min-height: 340px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 9px; border: 1px solid #dfe5e1; background: #fff; color: #75827c; font-size: 13px; text-align: center; }
.content-state > strong { color: #2e4137; font-size: 16px; }
.content-state > span:not(.state-spinner) { max-width: 420px; line-height: 1.55; }
.content-state button:not(.primary-action) { margin-top: 7px; padding: 9px 13px; border: 1px solid #ccd6d0; background: #fff; color: #174d40; font-weight: 700; cursor: pointer; }
.error-state > svg { color: #a33e35; font-size: 24px; }
.empty-symbol { width: 58px; height: 58px; display: grid; place-items: center; margin-bottom: 8px; border-radius: 50%; background: #edf3ee; color: #174d40; font-size: 22px; }
.state-spinner { width: 18px; height: 18px; border: 2px solid #ccd5d0; border-top-color: #174d40; border-radius: 50%; animation: spin .7s linear infinite; }
.pagination { display: flex; align-items: center; justify-content: center; gap: 14px; margin-top: 24px; color: #6e7b75; font-size: 12px; }
.pagination button { width: 36px; height: 36px; border: 1px solid #ccd6d0; background: #fff; color: #174d40; cursor: pointer; }
.pagination button:disabled { opacity: .4; cursor: not-allowed; }
.modal-backdrop { position: fixed; z-index: 1500; inset: 0; display: grid; place-items: center; padding: 20px; background: rgba(11, 28, 22, .58); }
.wish-modal { width: min(660px, 100%); max-height: calc(100dvh - 40px); overflow-y: auto; padding: 30px; background: #fff; box-shadow: 0 24px 70px rgba(8, 28, 20, .3); }
.wish-modal header { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 25px; }
.wish-modal header p { margin: 0 0 7px; color: #78877f; font-size: 10px; font-weight: 800; text-transform: uppercase; }
.wish-modal h2 { margin: 0; color: #173f34; font: 600 28px/1.2 'Playfair Display', Georgia, serif; }
.wish-modal header button { width: 34px; height: 34px; border: 0; background: #f0f3f0; color: #52605b; font-size: 23px; cursor: pointer; }
.wish-modal form { display: grid; gap: 19px; }
.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 17px; }
.field { display: flex; flex-direction: column; gap: 7px; }
.field > span, .interest-field legend { color: #35463d; font-size: 11px; font-weight: 800; }
.field em { color: #89958f; font-style: normal; font-weight: 500; }
.field input, .field select, .field textarea { width: 100%; min-height: 44px; box-sizing: border-box; padding: 10px 11px; border: 1px solid #ccd6d0; border-radius: 2px; outline: none; background: #fff; color: #22352c; font: 400 13px/1.45 'Inter', sans-serif; }
.field textarea { resize: vertical; }
.field input:focus, .field select:focus, .field textarea:focus { border-color: #174d40; box-shadow: 0 0 0 3px rgba(23, 77, 64, .12); }
.field small { align-self: flex-end; color: #8b9691; font-size: 10px; }
.interest-field { display: flex; flex-wrap: wrap; gap: 8px; margin: 0; padding: 0; border: 0; }
.interest-field legend { width: 100%; margin-bottom: 2px; }
.interest-field label { position: relative; cursor: pointer; }
.interest-field input { position: absolute; opacity: 0; }
.interest-field span { display: block; padding: 7px 10px; border: 1px solid #d6ded9; border-radius: 20px; color: #627169; font-size: 11px; }
.interest-field input:checked + span { border-color: #174d40; background: #174d40; color: #fff; }
.submit-error { margin: 0; padding: 10px 12px; background: #fff1ef; color: #a33e35; font-size: 12px; }
.modal-actions { display: flex; justify-content: flex-end; gap: 9px; padding-top: 4px; }
.secondary-button { min-height: 44px; padding: 0 17px; border: 1px solid #ccd6d0; background: #fff; color: #52605b; font-weight: 700; cursor: pointer; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width: 620px) { .wish-toolbar { align-items: flex-end; } .wish-toolbar label { align-items: flex-start; flex-direction: column; } .wish-item { padding-inline: 18px; } .wish-footer { margin-inline: -18px; padding-inline: 18px; } .form-grid { grid-template-columns: 1fr; } .wish-modal { padding: 23px 18px; } .modal-actions { flex-direction: column-reverse; } .modal-actions button { width: 100%; } }
</style>
