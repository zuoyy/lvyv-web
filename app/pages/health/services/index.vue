<template>
  <main class="health-experience health-catalog">
    <section class="catalog-hero"><h1>HEALTH CHECKUPS</h1><p>Choose a checkup based on how much time you have and how comprehensive you<br class="desktop-break"> want the assessment to be.</p></section>
    <div class="catalog-shell catalog-layout">
      <aside class="filters"><h2>Filters</h2><fieldset v-for="group in filterGroups" :key="group.key"><legend>{{ group.label }}</legend><label v-for="option in group.options" :key="option.value"><input type="checkbox" :checked="filters[group.key] === option.value" @change="toggleFilter(group.key, option.value)"><span>{{ option.label }}</span></label></fieldset></aside>
      <section class="catalog-results" aria-label="Care services">
        <div class="tier-tabs" role="tablist" aria-label="Checkup category"><button v-for="tier in tiers" :key="tier.code" type="button" role="tab" :aria-selected="filters.tier === tier.code" :class="{active: filters.tier === tier.code}" @click="filters.tier = tier.code">{{ tier.label }}</button></div>
        <div v-if="loading" class="health-state" role="status">Loading care services...</div><div v-else-if="error" class="health-state health-error" role="alert">{{ error }} <button type="button" @click="load">Try again</button></div><div v-else-if="!services.length" class="health-state">No services match these filters.</div>
        <div v-else class="service-list"><article v-for="service in services" :key="service.serviceCode" class="service-card">
          <img v-if="service.imageUrl && !failedImages.has(service.serviceCode)" :src="service.imageUrl" :alt="service.title" class="service-image" @error="failedImages.add(service.serviceCode)">
          <div v-else class="service-image image-unavailable" role="img" :aria-label="service.title" />
          <div class="service-content"><div class="service-heading"><h2>{{ service.title }}</h2><NuxtLink :to="'/health/services/'+service.serviceCode">View details<img src="/images/health/design/arrow-right.svg" alt=""></NuxtLink></div>
            <p class="service-meta">{{ service.cityName }} · {{ service.durationLabel }} · {{ service.supportLanguages }} support</p><p class="service-summary">{{ service.summary }}</p>
            <div class="service-price"><del v-if="service.originalPrice != null && Number(service.originalPrice) > Number(service.startingPrice)">{{ formatPrice(service.originalPrice) }}</del><p>From <strong>{{ formatPrice(service.startingPrice) }}</strong></p><small>USD</small><small class="tax-note">excl. tax</small></div>
          </div>
        </article></div>
      </section>
    </div>
  </main>
</template>
<script setup lang="ts">
import type { HealthOptions, HealthServiceSummary } from '~/composables/useHealthCare'
const health = useHealthCare(), services = ref<HealthServiceSummary[]>([]), loading = ref(true), error = ref('')
const dictionary = ref<HealthOptions>({ cities: [], tiers: [] })
const tiers = computed(() => [{ code: 'ALL', label: 'All' }, ...dictionary.value.tiers])
const filters = reactive({ cityCode: '', duration: '', language: '', tier: 'ALL' })
type FilterKey = 'cityCode' | 'duration' | 'language'
const filterGroups = computed<{ key: FilterKey; label: string; options: {label: string; value: string}[] }[]>(() => [
  { key: 'cityCode', label: 'City', options: dictionary.value.cities.map(city => ({ label: city.label, value: city.code })) },
  { key: 'duration', label: 'Duration', options: [{label:'Under 2 hours',value:'UNDER_2_HOURS'}, {label:'2-4 hours',value:'TWO_TO_FOUR_HOURS'}, {label:'Half day',value:'HALF_DAY'}] },
  { key: 'language', label: 'Support language', options: ['English','Chinese'].map(label => ({label,value:label})) }
])
const toggleFilter = (key: FilterKey, value: string) => { filters[key] = filters[key] === value ? '' : value }
const failedImages = reactive(new Set<string>())
const formatPrice = (value: number) => '$'+Number(value).toLocaleString('en-US', { maximumFractionDigits: 2 })
let loadSequence = 0
const load = async () => { const sequence = ++loadSequence; loading.value = true; error.value = ''; try { const [result, options] = await Promise.all([health.listServices(filters), health.getOptions()]); if (sequence === loadSequence) { services.value = result; dictionary.value = options } } catch (e) { if (sequence === loadSequence) error.value = e instanceof Error ? e.message : 'Unable to load care services.' } finally { if (sequence === loadSequence) loading.value = false } }
watch(filters, load, { deep: true }); onMounted(load)
useLvyvSeo({ title: 'Health Checkups | LVYV Care', description: 'Explore planned health checkups in China with English-speaking coordination.', path: '/health/services' })
</script>
<style scoped>
.image-unavailable{background:#f6f7fa}.service-price del{display:block;font-size:14px;line-height:20px;color:#677489}.service-price .tax-note{display:block;font:400 12px/normal Inter,sans-serif;color:#112211;opacity:.75}
.tier-tabs{max-width:784px}
.health-catalog{background:#fff;padding-top:109px}.catalog-hero{height:260px;padding:82px 24px 32px;background:linear-gradient(#0005,#0005),url('/images/health/design/checkups-hero.webp') center 85.5%/100% 557%;text-align:center;color:#fff}.catalog-hero h1{font:600 48px/67.2px Inter,sans-serif;margin:0 0 12px}.catalog-hero p{font-size:20px;line-height:24px;margin:0}.catalog-shell{max-width:1200px;margin:auto}.catalog-layout{display:grid;grid-template-columns:243px minmax(0,836px);justify-content:space-between;gap:60px;padding:60px 0 100px}.filters h2{font:600 20px/24px Inter,sans-serif;padding-bottom:32px;margin:0 0 32px;border-bottom:1px solid #11221126}.filters fieldset{border:0;padding:0;margin:0 0 36px}.filters legend{font-size:16px;font-weight:600;margin-bottom:16px}.filters label{display:flex;align-items:center;gap:8px;font-size:14px;line-height:24px;margin-bottom:8px;cursor:pointer;color:#112211}.filters input{width:20px;height:20px;accent-color:#698e4e;flex-shrink:0}.filters input:checked+span{color:#698e4e}.tier-tabs{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(0,1fr);height:80px;margin-bottom:60px;box-shadow:0 4px 16px #1122110d;border-radius:12px;padding:16px 18px;background:#fff}.tier-tabs button{position:relative;border:0;border-right:1px solid #e3e8ef;background:#fff;font:600 16px/24px Inter,sans-serif;color:#112211;cursor:pointer;padding:8px 12px;text-align:left}.tier-tabs button:last-child{border-right:0}.tier-tabs button.active:after{content:'';position:absolute;height:4px;background:#698e4e;left:0;right:18px;bottom:-16px}.service-list{display:grid;gap:20px}.service-card{display:grid;grid-template-columns:296px minmax(0,1fr);min-height:246px;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px #1122110d;background:#fff}.service-image{width:100%;height:246px;object-fit:cover}.service-content{display:flex;flex-direction:column;min-width:0;padding:24px 14px 14px 24px}.service-heading{display:flex;justify-content:space-between;gap:12px;align-items:start}.service-heading h2{font:600 18px/26px Inter,sans-serif;margin:0;color:#112211}.service-heading a{display:flex;align-items:center;gap:8px;font-size:14px;line-height:26px;color:#2a573f;text-decoration:none;white-space:nowrap}.service-heading a img{width:16px;height:16px}.service-meta{font-size:12px;line-height:18px;margin:10px 0 16px}.service-summary{font-size:12px;line-height:18px;color:#112211;margin:0 0 18px}.service-price{margin-top:auto;min-height:80px;border-radius:8px;background:#f6f7fa;text-align:right;padding:15px 12px 8px}.service-price p{font-size:24px;line-height:30px;margin:0}.service-price small{font-size:12px;color:#677489}
@media(max-width:1250px){.catalog-shell{margin:0 32px}.catalog-layout{gap:40px;grid-template-columns:220px minmax(0,1fr)}.service-card{grid-template-columns:35% minmax(0,1fr)}.service-heading{flex-wrap:wrap}.service-heading a{margin-left:auto}}
@media(max-width:850px){.health-catalog{padding-top:80px}.catalog-layout{grid-template-columns:1fr;gap:28px;padding-top:32px}.filters{display:flex;flex-wrap:wrap;gap:20px}.filters h2{width:100%;padding-bottom:12px;margin-bottom:0}.filters fieldset{flex:1;min-width:135px;margin-bottom:0}.tier-tabs{margin-bottom:28px}.catalog-hero h1{font-size:36px;line-height:46px}.catalog-hero p{font-size:16px;line-height:24px}.desktop-break{display:none}}
@media(max-width:500px){.catalog-shell{margin:0 16px}.catalog-hero{height:260px;padding-top:62px}.catalog-hero h1{font-size:30px}.service-card{grid-template-columns:1fr}.service-image{height:200px}.service-content{padding:20px}.service-heading{gap:10px}.service-heading h2{font-size:18px}.service-price{margin-top:16px}.tier-tabs{padding:12px 6px;height:68px}.tier-tabs button{font-size:11px;padding:6px;text-align:center}.tier-tabs button.active:after{bottom:-12px;right:0}}
@media(max-width:850px){.catalog-hero{background-size:cover;background-position:center 70%}}
</style>
