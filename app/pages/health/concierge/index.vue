<template>
  <main class="health-experience concierge">
    <section class="concierge-hero"><h1>HEALTH CONCIERGE</h1><p>Can't find what you need? Tell us the type of care you're looking for and<br class="desktop-break"> where you'll be in China.</p><strong>For planned, non-emergency care only.</strong></section>
    <div class="health-shell"><div class="health-columns">
      <section class="health-panel"><h2>Tell us what you need</h2><form ref="conciergeForm" class="health-form" novalidate @submit.prevent="submit">
        <label>What are you looking for?<select v-model="form.requestType"><option value="checkup">Health checkup</option><option value="dental">Dental care</option><option value="eye">Eye &amp; vision care</option><option value="specialist">Specialist</option><option value="other">Other</option></select></label>
        <label>City<select v-model="form.cityCode" required :disabled="optionsLoading"><option v-for="city in cities" :key="city.code" :value="city.code">{{ city.label }}</option></select></label>
        <p v-if="optionsError" role="alert">{{ optionsError }} <button type="button" @click="loadOptions">Try again</button></p>
        <div class="health-form-row"><fieldset class="date-range"><legend>Preferred date</legend><div><input v-model="form.dateFrom" type="date" aria-label="Preferred date from"><input v-model="form.dateTo" type="date" :min="form.dateFrom" aria-label="Preferred date to"></div></fieldset><label>Preferred language<select v-model="form.preferredLanguage"><option>English</option><option>Chinese</option></select></label></div>
        <label>Contact email<input v-model="form.contactEmail" type="email" required maxlength="128" placeholder="name@example.com" autocomplete="email"></label>
        <label>Short note<textarea v-model="form.note" maxlength="1000" rows="3" placeholder="Optional. Please do not upload medical records here. A coordinator may request information later if needed."></textarea></label>
        <p v-if="message" class="message" role="status">{{ message }}</p><button type="submit" class="health-button" :disabled="sendDisabled">{{ submitted ? 'Request received' : submitting ? 'Sending...' : 'Send request' }}</button>
      </form></section>
      <aside class="concierge-rail"><section class="health-rail next-steps"><h2>What happens next</h2><ol><li>Care Team Reviews Request</li><li>We Identify Suitable Providers</li><li>You Receive Options &amp; Pricing</li><li>You Choose Before Anything Is Booked</li></ol></section><section class="health-rail privacy"><h3>Privacy by default</h3><p>We only collect information needed to coordinate your request. Please do not share a full medical history or medical records here.</p></section></aside>
    </div></div>
  </main>
</template>
<script setup lang="ts">
import type { HealthDictionaryOption } from '~/composables/useHealthCare'
const requestTypes = ['checkup', 'dental', 'eye', 'specialist', 'other'] as const
type ConciergeRequestType = typeof requestTypes[number]
interface ConciergeForm {
  requestType: ConciergeRequestType
  cityCode: string
  dateFrom: string
  dateTo: string
  preferredLanguage: string
  contactEmail: string
  contactMobile: string
  note: string
}

const cities = ref<HealthDictionaryOption[]>([]), optionsLoading = ref(true), optionsError = ref('')
const health = useHealthCare(); const route = useRoute(); const auth = useMemberAuth(); const submitting = ref(false); const submitted = ref(false); const message = ref('')
const conciergeForm = ref<HTMLFormElement | null>(null)
const isRequestType = (value: unknown): value is ConciergeRequestType => typeof value === 'string' && (requestTypes as readonly string[]).includes(value)
const form = reactive<ConciergeForm>({ requestType: isRequestType(route.query.type) ? route.query.type : 'checkup', cityCode: '', dateFrom: '', dateTo: '', preferredLanguage: 'English', contactEmail: '', contactMobile: '', note: '' })
const draftKey = 'lvyv_health_concierge_draft_v1'
let draftStorageActive = false
const saveDraft = () => {
  if (!import.meta.client || !draftStorageActive) return
  try { sessionStorage.setItem(draftKey, JSON.stringify(form)) } catch { /* Storage may be disabled by the browser. */ }
}
const restoreDraft = () => {
  if (!import.meta.client) return
  try {
    const stored = sessionStorage.getItem(draftKey)
    if (!stored) return
    const draft = JSON.parse(stored) as Partial<ConciergeForm> | null
    if (!draft || typeof draft !== 'object') return
    if (isRequestType(draft.requestType)) form.requestType = draft.requestType
    if (typeof draft.cityCode === 'string') form.cityCode = draft.cityCode
    if (typeof draft.dateFrom === 'string') form.dateFrom = draft.dateFrom
    if (typeof draft.dateTo === 'string') form.dateTo = draft.dateTo
    if (draft.preferredLanguage === 'English' || draft.preferredLanguage === 'Chinese') form.preferredLanguage = draft.preferredLanguage
    if (typeof draft.contactEmail === 'string') form.contactEmail = draft.contactEmail
    if (typeof draft.contactMobile === 'string') form.contactMobile = draft.contactMobile
    if (typeof draft.note === 'string') form.note = draft.note
    draftStorageActive = true
  } catch {
    try { sessionStorage.removeItem(draftKey) } catch { /* Ignore unavailable storage. */ }
  }
}
const clearDraft = () => {
  draftStorageActive = false
  if (!import.meta.client) return
  try { sessionStorage.removeItem(draftKey) } catch { /* Ignore unavailable storage. */ }
}
watch(form, saveDraft, { deep: true })
const sendDisabled = computed(() => submitting.value || submitted.value || (Boolean(auth.token.value) && (optionsLoading.value || !form.cityCode || !!optionsError.value)))
const loadOptions = async () => { optionsLoading.value = true; optionsError.value = ''; try { cities.value = (await health.getOptions()).cities; form.cityCode = cities.value.some(city => city.code === form.cityCode) ? form.cityCode : cities.value[0]?.code || ''; if (!cities.value.length) optionsError.value = 'No cities are currently available.' } catch { optionsError.value = 'Unable to load cities.' } finally { optionsLoading.value = false } }
onMounted(() => { restoreDraft(); void loadOptions() })
let idempotencyKey = ''
const submit = async () => {
  if (submitting.value || submitted.value) return
  if (!auth.token.value) {
    draftStorageActive = true
    saveDraft()
    await navigateTo({ path: '/login/', query: { redirect: route.fullPath } }, { replace: true })
    return
  }
  if (!conciergeForm.value?.reportValidity()) return
  if (form.dateFrom && form.dateTo && form.dateTo < form.dateFrom) { message.value = 'The end date must not be before the start date.'; return }
  draftStorageActive = true
  saveDraft()
  submitting.value = true; message.value = ''
  idempotencyKey ||= crypto.randomUUID()
  try {
    await health.createConciergeRequest({ ...form, idempotencyKey, dateFrom: form.dateFrom || null, dateTo: form.dateTo || null })
    clearDraft(); submitted.value = true; message.value = 'Your request has been received. The Care Team will contact you by email.'; form.note = ''
  } catch (e) { message.value = e instanceof Error ? e.message : 'Unable to send your request.' } finally { submitting.value = false }
}
useNoIndex()
useLvyvSeo({ title: 'Health Concierge | LVYV Care', description: 'Get help arranging planned healthcare in China.', path: '/health/concierge' })
</script>

<style scoped>
.date-range{border:0;padding:0;margin:0;min-width:0}.date-range legend{font:700 16px/1.65 Inter,sans-serif;color:#111729;margin-bottom:8px;padding:0}.date-range>div{display:grid;grid-template-columns:1fr 1fr;gap:8px}.date-range input{padding-left:10px;padding-right:8px;font-size:14px}
.concierge-hero{height:260px;padding:50px 24px 36px;text-align:center;color:#2a573f;background:linear-gradient(#f2f3f2bb,#f2f3f2bb),url('/images/health/design/concierge-hero.webp') 51.6% 30%/154.11% auto}.concierge-hero h1{font:600 48px/67.2px Inter,sans-serif;margin:0 0 12px}.concierge-hero p{font:400 20px/24px Inter,sans-serif;margin:0 0 12px}.concierge-hero strong{font:600 20px/28px Inter,sans-serif;color:#698e4e}.health-shell{padding-top:40px;min-height:680px}.health-panel h2{font:600 20px/26px Inter,sans-serif;color:#112211;margin:0 0 40px}.concierge-rail{display:grid;gap:20px}.next-steps{background:#f2fbd9}.next-steps h2{font:700 20px/28px Inter,sans-serif;color:#2a573f;margin:0 0 26px}.next-steps ol{list-style:none;display:grid;gap:16px;padding:0;margin:0}.next-steps li{position:relative;padding-left:26px;font:400 16px/24px Inter,sans-serif;color:#242424}.next-steps li:before{content:'';width:18px;height:18px;background:#b7ef73;border-radius:50%;position:absolute;left:0;top:3px}.privacy h3{font:500 16px/24px Inter,sans-serif;color:#105446;margin:0 0 12px}.privacy p{font:400 14px/20px Inter,sans-serif;color:#808080;margin:0}.message{font-size:14px;line-height:1.6;color:#105446}.health-form .health-button{border-radius:4px;background:#203d33;color:#fff;width:100%;font-size:14px;font-weight:600}
@media(max-width:850px){.concierge-hero{height:auto;min-height:260px;padding:50px 20px 36px}.concierge-hero h1{font-size:36px;line-height:46px}.concierge-hero p,.concierge-hero strong{font-size:16px;line-height:24px}.desktop-break{display:none}.next-steps li{font-size:16px}.health-shell{padding-top:28px}}
@media(max-width:390px){.concierge-hero h1{font-size:30px}}
</style>
