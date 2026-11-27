<template>
  <main class="health-checkup">
    <header class="hero">
        <div class="wrap"><small style="color:#d0ded2">ENCOUNTERS / BEIJING / {{ productName === product.title ? 'HEALTH SCREENING' : productName }}</small><br><span
                class="pill">SIGNATURE HEALTH ENCOUNTER · BEIJING</span>
            <h1>Know Your Health.<br><em id="hero-head">{{ overnight ? 'An in-depth health experience.' : 'A clearer picture of your health.' }}</em></h1>
            <p>A comprehensive health checkup in China. Modern medicine, personalized care, and a clearer picture of
                your health — all in one visit.</p>
            <div class="meta"><span id="hero-duration">{{ overnight ? 'One-night hospital stay included' : 'Appointment duration to be confirmed' }}</span><span>✚ Modern
                    hospital</span><span>English-speaking support</span><span>Comprehensive health report</span></div>
            <button type="button" @click="openBooking">Book This Encounter →</button> <a class="btn outline" href="#pricing">See Price
                Comparison</a>
            <div class="encounter-experience-detail health-price">
                <div class="hero-price-card">
                    <div class="from" id="hero-label">SELECTED PACKAGE · FROM</div>
                    <div class="num" id="hero-price">{{ selectedPrice }}</div>
                    <div class="per">/ person</div>
                    <div class="note" id="hero-package">{{ selectedPackage.name }}</div>
                    <small>Reference price · final quote required</small>
                </div>
            </div>
        </div>
    </header>
    <div class="strip">
        <div class="photo"><img
                src="/images/encounters/wellness/health-checkup/laboratory-strip.webp"
                alt="Laboratory Tests" decoding="async"><span>Laboratory Tests</span></div>
        <div class="photo"><img
                src="/images/encounters/wellness/health-checkup/imaging-strip.webp"
                alt="Medical Imaging" decoding="async"><span>Medical Imaging</span></div>
        <div class="photo"><img
                src="/images/encounters/wellness/health-checkup/physical-exam.webp"
                alt="Physical Examination" decoding="async"><span>Physical Examination</span></div>
        <div class="photo"><img
                src="/images/encounters/wellness/health-checkup/health-report.webp"
                alt="Health Report" decoding="async"><span>Health Report</span></div>
    </div>
    <div class="quote">“A little time for your health.<br>A lot more peace of mind for your journey.”<small>THE LVYV
            HEALTH PHILOSOPHY</small></div>
    <section class="wrap" id="experience">
        <div class="center">
            <div class="eyebrow">— WHAT HAPPENS —</div>
            <h2>Three steps. <em>A clearer picture.</em></h2>
            <p class="intro">From laboratory tests to medical imaging and a professional health report. Understand more
                about your body in one organized visit.</p>
        </div>
        <div class="grid">
            <article class="tile">
                <div class="photo"><img
                        src="/images/encounters/wellness/health-checkup/laboratory-tests.webp"
                        alt="Laboratory Tests" loading="lazy" decoding="async"></div>
                <div class="body">
                    <div class="eyebrow">01 · DISCOVERY</div>
                    <h3>Laboratory Tests</h3>
                    <p>Explore important health indicators through blood tests, urine tests, and metabolic screening.
                    </p>
                    <p class="note">Understand what you can't always feel.</p><span class="tag">Blood · Urine ·
                        Metabolism</span>
                </div>
            </article>
            <article class="tile">
                <div class="photo"><img
                        src="/images/encounters/wellness/health-checkup/medical-imaging.webp"
                        alt="Medical Imaging" loading="lazy" decoding="async"></div>
                <div class="body">
                    <div class="eyebrow">02 · EXAMINATION</div>
                    <h3>Imaging &amp; Physical Exam</h3>
                    <p>Get a closer look at your health through physical examinations and selected diagnostic imaging.
                    </p>
                    <p class="note">See beyond the surface.</p><span class="tag">Ultrasound · ECG · Physical Exam</span>
                </div>
            </article>
            <article class="tile">
                <div class="photo"><img
                        src="/images/encounters/wellness/health-checkup/health-report.webp"
                        alt="Health Report" loading="lazy" decoding="async"></div>
                <div class="body">
                    <div class="eyebrow">03 · UNDERSTANDING</div>
                    <h3>Health Report &amp; Review</h3>
                    <p>Receive your examination results and professional guidance on findings and recommended next
                        steps.</p>
                    <p class="note">Turn information into understanding.</p><span class="tag">Results · Review ·
                        Guidance</span>
                </div>
            </article>
        </div>
    </section>
    <section class="wrap" id="packages">
        <div class="center">
            <div class="eyebrow">— CHOOSE YOUR CHECKUP —</div>
            <h2>Four packages. <em>One personal choice.</em></h2>
            <p class="intro">Choose the screening level that fits your needs. Select one package to personalize your
                experience.</p>
        </div>
        <div id="package-options" class="package-grid" role="radiogroup" aria-label="Health screening package">
            <label v-for="(tier, index) in packages" :key="tier.code" class="package-card" :style="{ '--tier': tier.color }">
                <input v-model="active" type="radio" name="package" :value="index">
                <span class="eyebrow">{{ tier.level }}</span>
                <h3>{{ tier.name }}</h3>
                <span class="amount">{{ priceFor(tier) }}</span>
                <p>{{ tier.description }}</p>
                <span class="tag package-state">{{ active === index ? 'Selected' : 'Select package' }}</span>
            </label>
        </div>
        <div class="package-summary" aria-live="polite"><span class="tag">YOUR SELECTED PACKAGE</span>
            <h3 id="package-name">{{ selectedPackage.name }}</h3>
            <p id="package-description">{{ selectedPackage.description }}</p><strong id="package-range">{{ selectedPrice }}</strong>
            <p><small>The price includes the health checkup package and LVYV’s appointment booking service fee. If you have any questions, please contact LVYV Customer Support for clarification before booking.</small></p>
        </div>
        <div class="package-detail" id="package-detail">
            <div class="detail-head">
                <div>
                    <div class="eyebrow">— INSIDE YOUR CHECKUP —</div>
                    <h3 id="detail-title">{{ selectedPackage.name }} — Full examination list</h3>
                </div><button type="button" class="outline" id="compare-toggle" :aria-expanded="compareOpen" aria-controls="compare-panel"
                    @click="compareOpen = !compareOpen">{{ compareOpen ? "Hide comparison" : "Compare all 4 packages" }}</button>
            </div>
            <p class="muted">English screening overview based on the partner's package sheets. Individual tests and
                male/female eligibility must be confirmed against the original hospital checklist before booking.</p>
            <p id="platinum-note" class="note">{{ active === 2 ? 'Sections 10–13 were not visible in the supplied checklist.' : '' }}</p>
            <div v-if="requiredChoices.length" id="custom-options" ref="customOptions">
                <p v-if="choiceError" class="note" role="alert">Complete the required examination choices before booking.</p>
                <fieldset v-for="group in requiredChoices" :key="group.key">
                    <legend>{{ group.label }} · {{ picks[group.key].length }}/{{ group.limit }} selected</legend>
                    <label v-for="option in group.options" :key="option" class="choice">
                        <input v-if="group.limit === 1" type="radio" :name="group.key"
                            :checked="picks[group.key].includes(option)" @change="picks[group.key] = [option]">
                        <input v-else v-model="picks[group.key]" type="checkbox" :value="option"
                            :disabled="picks[group.key].length >= group.limit && !picks[group.key].includes(option)">
                        {{ option }}
                    </label>
                </fieldset>
            </div>
            <div :key="selectedPackage.code" id="detail-items">
                <details v-for="({ heading, rows }, index) in selectedGroups" :key="heading" :open="index === 0">
                    <summary>{{ heading }} · {{ rows.length }} items</summary>
                    <table class="exam-table">
                        <tbody>
                            <tr v-for="([name, code]) in rows" :key="name">
                                <td>{{ name }}</td><td>{{ examStatus(code.charAt(active), active) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </details>
            </div>
            <div id="compare-panel" v-if="compareOpen">
                <div class="tablebox" style="overflow-x:auto">
                    <table id="compare-table">
                        <thead>
                            <tr><th scope="col">Examination</th><th v-for="tier in packages" :key="tier.code" scope="col">{{ tier.name }}</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>USD price</td><td v-for="tier in packages" :key="tier.code">{{ priceFor(tier) }}</td></tr>
                            <template v-for="[heading, rows] in healthCheckupGroups" :key="heading">
                                <tr class="total"><td colspan="5">{{ heading }}</td></tr>
                                <tr v-for="[name, codes] in rows" :key="name">
                                    <td>{{ name }}</td>
                                    <td v-for="(tier, index) in packages" :key="tier.code">{{ examStatus(codes.charAt(index), index) }}</td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div><small>Not listed means absent from the supplied checklist; pending confirmation means source
                    information is missing. Screening suitability is subject to clinical assessment. Exact age 40 breast
                    imaging must be confirmed.</small>
            </div>
        </div>
    </section>
    <section class="alt" id="timeline">
        <div class="wrap">
            <div class="eyebrow" id="timeline-label">{{ overnight ? '— YOUR HEALTH STAY —' : '— YOUR VISIT —' }}</div>
            <h2 id="timeline-title">{{ overnight ? 'A comprehensive checkup and overnight stay.' : 'A visit that changes how you think about health.' }}</h2>
            <div class="timeline">
                <aside>
                    <h3>A coordinated health experience.</h3>
                    <p class="muted">One hospital. One organized schedule. More time to enjoy the rest of your trip.
                        Advanced packages may require longer visits.</p>
                    <p class="note">Good to know: Some tests require fasting. We'll send you preparation instructions
                        before your appointment.</p>
                </aside>
                <div>
                    <div class="step"><span class="tag">08:00 · ARRIVAL</span>
                        <h3>Meet your guide at the hospital</h3>
                        <p>Your LVYV guide welcomes you, assists with registration, and helps you navigate your health
                            screening appointment.</p>
                    </div>
                    <div class="step"><span class="tag">08:30 · LABORATORY TESTS</span>
                        <h3>Start with the essentials</h3>
                        <p>Complete fasting blood tests, urine tests, and other laboratory examinations included in your
                            selected package.</p>
                    </div>
                    <div class="step"><span class="tag">09:00 · HEALTH EXAMINATIONS</span>
                        <h3>A closer look at your body</h3>
                        <p>Continue with physical examinations, ultrasound, ECG, and other scheduled screening
                            procedures.</p>
                    </div>
                    <div class="step"><span class="tag">11:30 · COMPLETION &amp; NEXT STEPS</span>
                        <h3 id="timeline-last">{{ overnight ? 'Overnight stay and follow-up arrangements' : 'Completion and next steps' }}</h3>
                        <p id="timeline-last-copy">{{ overnight ? 'Your package includes a one-night inpatient stay and sedated gastroscopy and colonoscopy, subject to hospital assessment and preparation.' : 'Complete scheduled examinations and coordinate report delivery.' }}</p>
                    </div>
                </div>
            </div><small>Illustrative schedule; actual timing depends on the hospital and selected package.</small>
        </div>
    </section>
    <section class="alt" id="pricing">
        <div class="wrap">
            <div class="center">
                <div class="eyebrow">— PRICE COMPARISON —</div>
                <h2>Comprehensive care. <em>A different price tag.</em></h2>
                <p class="intro">Review the selected package price before you book. US comparison prices are pending
                    verification.</p>
            </div>
            <div class="tablebox">
                <div class="tabletitle"><strong>Comprehensive Health Checkup Pricing</strong><span class="tag"
                        id="pricing-package">{{ selectedPackage.name }}</span></div>
                <table>
                    <thead>
                        <tr>
                            <th>EXAMINATION</th>
                            <th>TYPICAL US PRICE</th>
                            <th>LVYV BEIJING</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Laboratory Tests<small>Blood, urine &amp; metabolic screening</small></td>
                            <td class="us">Pending verification</td>
                            <td>See package*</td>
                        </tr>
                        <tr>
                            <td>Medical Imaging<small>Selected ultrasound &amp; imaging</small></td>
                            <td class="us">Pending verification</td>
                            <td>See package*</td>
                        </tr>
                        <tr>
                            <td>Physical Examination<small>Physical &amp; cardiovascular assessment</small></td>
                            <td class="us">Pending verification</td>
                            <td>See package*</td>
                        </tr>
                        <tr>
                            <td>Health Report &amp; Review<small>Results &amp; medical guidance</small></td>
                            <td class="us">Pending verification</td>
                            <td>See package*</td>
                        </tr>
                        <tr class="total">
                            <td>Total Health Checkup<small>Selected comprehensive package</small></td>
                            <td class="us">Pending verification</td>
                            <td id="table-price">{{ selectedPrice }}</td>
                        </tr>
                    </tbody>
                </table>
            </div><small>*Included examinations vary by package. International prices are for comparable self-pay
                services and may vary by provider and location. Confirm package availability before booking.</small>
        </div>
    </section>
    <section class="wrap">
        <div class="eyebrow">— WHAT'S INCLUDED —</div>
        <h2>No hidden fees. <em>No surprises.</em></h2>
        <div class="two">
            <div class="included">
                <h3>✓ <span id="included-package">{{ selectedPackage.name }}</span></h3>
                <ul>
                    <li>All examinations confirmed in your selected package</li>
                    <li>Laboratory tests and scheduled medical imaging</li>
                    <li>Hospital appointment and registration assistance</li>
                    <li>English-speaking LVYV guide, subject to confirmed service scope</li>
                    <li>Health report delivery assistance</li>
                    <li>Medical review as specified in your package</li>
                    <li>Post-visit coordination and support</li>
                </ul>
            </div>
            <div class="excluded">
                <h3>× Not Included</h3>
                <ul>
                    <li>Flights and visa-related expenses</li>
                    <li>Hotel accommodation</li>
                    <li>Additional examinations outside your package</li>
                    <li>Medication and medical treatment</li>
                    <li>Additional specialist consultations</li>
                    <li>Personal travel and medical insurance</li>
                </ul>
            </div>
        </div>
    </section>
    <div class="encounter-experience-detail health-add-ons">
    <EncounterExperienceAddOns
      :product-code="product.code"
      :base-sku-code="selectedSku?.skuCode"
      :prepare-bundle="prepareBundle"
      :base-title="selectedPackage.name"
      :base-price="selectedSku?.price ?? null"
      :reference-price="selectedPackage.price"
      description="Beijing · Appointment duration varies · English-speaking support"
      :bundle-label="selectedPackage.name"
      wellness
      @book="openBooking"
    >
      <template #default>
        <div class="health-checkup-content">
        <section class="alt" id="faq">
            <div class="wrap">
                <div class="center">
                    <div class="eyebrow">— QUESTIONS —</div>
                    <h2>What everyone <em>asks.</em></h2>
                </div>
                <div class="faq">
                    <details open>
                        <summary>01　Do I need to fast before my health checkup?</summary>
                        <p>Some examinations, particularly certain blood tests and abdominal ultrasound examinations, may
                            require fasting. LVYV will provide specific preparation instructions before your appointment.
                            Please follow the hospital's guidance.</p>
                    </details>
                    <details>
                        <summary>02　Do I need to speak Chinese?</summary>
                        <p>No. Your LVYV guide can assist with hospital registration, navigation, and communication during
                            your visit. We will confirm language support arrangements before your appointment.</p>
                    </details>
                    <details>
                        <summary>03　Is this a real hospital?</summary>
                        <p>Yes. Your health screening will be carried out at a licensed partner medical institution by
                            qualified healthcare professionals. LVYV coordinates your visit rather than providing medical
                            services directly.</p>
                    </details>
                    <details>
                        <summary>04　Can I use my health report back home?</summary>
                        <p>You can share your health report with your doctor at home. Report language, translation
                            arrangements, and delivery time depend on your selected package. Your doctor may recommend
                            further assessment or repeat testing.</p>
                    </details>
                    <details>
                        <summary>05　Can I customize my health checkup?</summary>
                        <p>Yes. You can choose from available health screening packages and request additional examinations.
                            Medical suitability and any additional fees will be confirmed before proceeding.</p>
                    </details>
                </div>
            </div>
        </section>
        <section class="cta">
            <div class="wrap">
                <div class="eyebrow">— YOUR HEALTH —</div>
                <h2>A healthier perspective. <em style="color:#a1c98a">Book it.</em></h2>
                <p><span id="cta-price">{{ selectedPrice }}</span> · Comprehensive health checkup · English-speaking guide · Health
                    report support.</p>
                <button type="button" @click="openBooking">Book This Encounter →</button> <a class="btn outline"
                    href="/encounters">← Back to All Encounters</a>
            </div>
        </section>
        </div>
      </template>
    </EncounterExperienceAddOns>
    </div>
  </main>
  <EncounterBookingDialog ref="booking" :product="product" :product-name="productName" :sku="selectedSku" :status="status" :order-note="orderNote" show-package @retry="refresh()" />
</template>

<script setup lang="ts">
import { encounterProducts, healthCheckupProductCode } from '~~/shared/utils/encounterProducts'
import { healthCheckupGroups } from '~/utils/beijingHealthCheckup'

const packageContent = [
  { code: 'DEFAULT', name: 'Preferential Package', level: '01 · ESSENTIAL', color: '#5383a9', price: 414,
    description: 'An entry-level comprehensive checkup for travelers seeking a general health overview.' },
  { code: 'GOLDEN', name: 'Golden Package', level: '02 · ENHANCED', color: '#bd9a3e', price: 969,
    description: 'A higher-tier screening option for travelers seeking a more extensive health assessment.' },
  { code: 'PLATINUM', name: 'Platinum Package', level: '03 · ADVANCED', color: '#348d9d', price: 2476,
    description: 'An advanced screening tier for those who prefer a more extensive examination plan.' },
  { code: 'LUXURY', name: 'Luxury Package', level: '04 · PREMIUM', color: '#a77d63', price: 4000,
    description: 'The highest-tier partner package, for travelers who prefer the most extensive available screening option.' },
] as const
const product = encounterProducts.find(item => item.code === healthCheckupProductCode)!
const { productName, skus, status, refresh } = await useEncounterProduct(product, {
  title: 'Health Checkup in China – Beijing Health Screening | LVYV',
  description: 'Book a comprehensive health checkup in Beijing, China, with English-speaking support, transparent pricing, organized hospital appointments and health report assistance.',
}, packageContent.map(tier => tier.code))
const skuByCode = computed(() => new Map(skus.value.map(sku => [sku.skuCode, sku])))
const packages = computed(() => packageContent.map(tier => ({
  ...tier,
  name: skuByCode.value.get(tier.code)?.name || tier.name,
})))
const active = ref(0)
const selectedPackage = computed(() => packages.value[active.value] ?? packageContent[0])
const selectedSku = computed(() => skuByCode.value.get(selectedPackage.value.code))
const priceFor = (tier: typeof packages.value[number]) => encounterPrice(
  skuByCode.value.get(tier.code)?.price ?? tier.price,
)
const selectedPrice = computed(() => priceFor(selectedPackage.value))
const overnight = computed(() => selectedPackage.value.code === 'LUXURY')
const compareOpen = ref(false)
function examStatus(code: string, index: number) {
  const statuses: Record<string, string> = {
    Y: 'Included', '-': 'Not listed', '?': 'Pending confirmation',
    M: 'Included', F: 'Not applicable', L: 'Not applicable', H: 'Not applicable',
    A: 'Choose 1 of 2', B: 'Choose 1 of 2', C: index === 2 ? 'Choose 2 of 5' : 'Choose 4 of 5',
  }
  return statuses[code] ?? 'Pending confirmation'
}
const selectedGroups = computed(() => healthCheckupGroups.map(([heading, rows]) => ({
  heading,
  rows: rows.filter(([, codes]) => {
    const status = examStatus(codes.charAt(active.value), active.value)
    return status !== 'Not listed' && status !== 'Not applicable'
  }),
})).filter(group => group.rows.length))

const functional = { key: 'functional', label: 'Functional health assessment', limit: 1,
  options: ['Gut function assessment', 'Immune function testing'] } as const
const aging = { key: 'aging', label: 'Aging & nutritional assessment', limit: 1,
  options: ['Telomere length and aging test', 'B vitamin analysis'] } as const
const imaging = { key: 'imaging', label: 'Advanced imaging',
  options: ['Brain MRA', 'Brain MRI', 'Coronary CTA', 'Cervical spine MRI', 'Lumbar spine MRI'] } as const
const requiredChoices = computed(() => {
  if (selectedPackage.value.code === 'PLATINUM') return [functional, aging, { ...imaging, limit: 2 }]
  if (overnight.value) return [aging, { ...imaging, limit: 4 }]
  return []
})
const picks = reactive({ functional: [] as string[], aging: [] as string[], imaging: [] as string[] })
const showChoiceError = ref(false)
const choicesComplete = computed(() => requiredChoices.value.every(group => picks[group.key].length === group.limit))
const choiceError = computed(() => showChoiceError.value && !choicesComplete.value)
const orderNote = computed(() => {
  const choices = requiredChoices.value.flatMap(group => picks[group.key])
  return choices.length ? 'Selected examinations: ' + choices.join(', ') : ''
})
watch(active, () => {
  picks.functional = []
  picks.aging = []
  picks.imaging = []
  showChoiceError.value = false
})
const booking = useTemplateRef('booking')
const customOptions = useTemplateRef('customOptions')
function validateExamChoices() {
  if (selectedSku.value && !choicesComplete.value) {
    showChoiceError.value = true
    customOptions.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    customOptions.value?.querySelector('input')?.focus({ preventScroll: true })
    return false
  }
  return true
}
function prepareBundle() {
  if (!selectedSku.value || !validateExamChoices()) return false
  rememberHealthCheckupNote(selectedSku.value.skuCode, orderNote.value)
  return true
}
function openBooking() {
  if (!validateExamChoices()) return
  booking.value?.open()
}
</script>

<style src="~/assets/css/encounter-experience.css"></style>
<style scoped src="~/assets/css/beijing-health-checkup.css"></style>
