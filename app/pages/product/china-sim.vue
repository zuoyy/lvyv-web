<template>
  <main ref="page" class="sim-page">
    <!-- ===== HERO ===== -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-glow"></div>
      <div class="hero-inner">
        <div>
          <div class="hero-badge"><span class="dot"></span>Officially Licensed · Order Online</div>
          <h1>Your first connection<br>in <span class="italic">China.</span></h1>
          <p class="hero-sub">A physical SIM card foreigners can actually get in China. We meet you at the airport or your hotel, install the card, and activate it with your passport — in about three minutes. <template v-if="startingPrice">Plans from {{ startingPrice }}, free installation.</template><template v-else>Free installation.</template></p>
          <div class="hero-points">
            <div class="hero-point"><span class="tick">✓</span>Real 11-digit Unicom number</div>
            <div class="hero-point"><span class="tick">✓</span>4G / 5G native network</div>
            <div class="hero-point"><span class="tick">✓</span>No artificial speed restrictions</div>
            <div class="hero-point"><span class="tick">✓</span><span>{{ startingPrice ? 'From ' + startingPrice + ' — free installation' : 'Free installation' }}</span></div>
            <div class="hero-point"><span class="tick">✓</span>NFC passport verification</div>
            <div class="hero-point"><span class="tick">✓</span>Compatible with unlocked phones</div>
          </div>
          <div class="hero-btns">
            <button class="btn-primary" type="button" @click="scrollTo('plans')">See Plans & Pricing →</button>
            <button class="btn-ghost" type="button" @click="scrollTo('get')">Order Now</button>
          </div>
          <div class="hero-note">Passport required · No appointment · No Chinese needed</div>
        </div>
        <div class="hero-visual">
          <div class="sim-card">
            <div class="sim-chip"></div>
            <div class="sim-body">
              <div class="sim-brand">China<span>Fun</span></div>
              <div class="sim-series">Travel SIM</div>
              <div class="sim-net"><span class="dot"></span>China Unicom · 5G</div>
            </div>
            <div class="sim-5g">5G</div>
          </div>
          <div class="float-chip fc-1">
            <div class="ic">🛬</div>
            <div class="tx"><b>Ready on arrival</b><span>Airport & city desks</span></div>
          </div>
          <div class="float-chip fc-2">
            <div class="ic">⚡</div>
            <div class="tx"><b>3 minutes</b><span>Passport → activated</span></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== PROBLEM ===== -->
    <section class="section">
      <div class="section-head rv">
        <div class="eyebrow">The First 24 Hours</div>
        <h2 class="section-title">No number, <span class="italic">no way around it.</span></h2>
        <p class="section-lead">In China, a mobile number is the entry ticket to almost everything. Without one, the trip stops working the moment you clear customs.</p>
      </div>
      <div class="pain-grid">
        <div class="pain-card rv">
          <div class="pain-x">✕</div>
          <h4>Lands, and goes dark</h4>
          <p>Wheels down, airplane mode off, no signal. Google Maps won't load, DiDi won't register, the group chat goes quiet. The first kilometre out of the terminal is already a struggle.</p>
        </div>
        <div class="pain-card rv">
          <div class="pain-x">✕</div>
          <h4>Roaming is a trap</h4>
          <p>International roaming runs up to $1.39 per MB. One map reload, one photo upload, and the bill climbs past $1,422 for a single gigabyte. So you switch roaming off — and now you have no network at all.</p>
        </div>
        <div class="pain-card rv">
          <div class="pain-x">✕</div>
          <h4>The counter says no</h4>
          <p>Most service desks weren't set up for a foreign passport. Some refuse outright. The rest mean queues, forms, appointments, and half a day of your holiday lost to a process that should take minutes.</p>
        </div>
      </div>
      <div class="pain-note rv">
        <strong>The rule is simple:</strong> in China, no number means no ride-hailing, no food delivery, no shared bikes, no WeChat, no Alipay. This card isn't an upgrade to your trip — it's the thing that makes the trip possible.
      </div>
    </section>

    <!-- ===== COST COMPARE ===== -->
    <section class="section alt">
      <div class="section-inner">
        <div class="section-head rv">
          <div class="eyebrow">The Maths</div>
          <h2 class="section-title">Same network. <span class="italic">Different maths.</span></h2>
          <p class="section-lead">Your home operator's roaming charges and this card run on the same network. The only thing that changes is the bill.</p>
        </div>
        <div class="cost-wrap">
          <div class="cost-card bad rv">
            <div class="cost-label">Home SIM abroad</div>
            <div class="cost-badge">Typical roaming</div>
            <div class="cost-price">$1.39<span class="cost-usd">per MB</span></div>
            <div class="cost-unit">That's the roaming rate, billed the moment you land</div>
            <ul class="cost-list">
              <li><span class="m">✕</span><span>Billed the moment you land, whether you use it or not</span></li>
              <li><span class="m">✕</span><span>Often blocked or throttled on local networks</span></li>
              <li><span class="m">✕</span><span>Roaming calls cost $0.83–$1.39 per minute</span></li>
              <li><span class="m">✕</span><span>One careless photo upload can cost a full trip's budget</span></li>
            </ul>
            <div class="cost-math">
              <strong>What that actually means:</strong> 1 GB = 1,024 MB = <b>$1,422</b>. Half a GB of map loading already wipes out most of a day's budget.
            </div>
          </div>
          <div class="cost-card good rv">
            <div class="cost-label">ChinaFun SIM</div>
            <div class="cost-badge">Native network</div>
            <div class="cost-price">{{ pricePerGb || 'Prepaid' }}<span v-if="pricePerGb" class="cost-usd">per GB</span></div>
            <div class="cost-unit">Included data at the prepaid plan price</div>
            <ul class="cost-list">
              <li><span class="g">✓</span><span>Full 4G / 5G data, same speed as any local user</span></li>
              <li><span class="g">✓</span><span>Real local number — no roaming rules, no throttling</span></li>
              <li><span class="g">✓</span><span>{{ startingPrice ? 'Whole plan from ' + startingPrice + ' — no surprise bills' : 'Prepaid plans — no surprise bills' }}</span></li>
              <li><span class="g">✓</span><span>Nothing filtered that locals can reach</span></li>
            </ul>
            <div v-if="popularPlan && pricePerGb" class="cost-math good">
              <strong>Concretely:</strong> our most popular plan includes {{ popularPlan.data }} for <b>{{ displayPrice(popularPlan.price) }}</b> — about <b>{{ pricePerGb }} per GB</b>. Roaming would be <b>$1,422</b> for the same single gigabyte.
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== PLANS ===== -->
    <section class="section alt" id="plans">
      <div class="section-inner">
        <div class="section-head rv">
          <div class="eyebrow">Official Pricing</div>
          <h2 class="section-title">Find a plan <span class="italic">for your trip.</span></h2>
          <p class="section-lead">Every plan is prepaid, includes free in-person installation and activation, and auto-cancels at the end of its validity period. No contracts, no deposit, no roaming surprises. Pay in USD, get a Chinese number.</p>
        </div>

        <div class="plan-toggle rv">
          <button v-for="tab in filters" :key="tab.key" type="button" class="plan-chip" :class="{ on: filter === tab.key }" :aria-pressed="filter === tab.key" @click="filter = tab.key">{{ tab.label }}</button>
        </div>

        <p v-if="loadingPlans" class="plan-message" role="status">Loading plans…</p>
        <p v-else-if="!visiblePlans.length" class="plan-message">No plans are currently available.</p>
        <div v-else class="plan-grid rv">
          <article v-for="plan in visiblePlans" :key="plan.skuCode" class="plan-card" :class="{ featured: plan.featured }">
            <div v-if="plan.tag" class="plan-flag">{{ plan.tag }}</div>
            <div class="plan-head">
              <div class="plan-name">{{ plan.name }}</div>
              <div class="plan-price"><span class="cur">$</span>{{ priceNumber.format(plan.price) }}<span v-if="plan.validity" class="per">/ {{ plan.validity }}</span></div>
              <div v-if="plan.firstOrderPrice !== null" class="plan-promo-flag">New users −$3</div>
              <div v-if="plan.description" class="plan-for">{{ plan.description }}</div>
            </div>
            <div class="plan-spec">
              <div v-if="plan.data" class="row"><span class="ic">▦</span><span><b>{{ plan.data }}</b> <span class="lab">high-speed data</span></span></div>
              <div v-if="plan.voice" class="row"><span class="ic">☎</span><span><b>{{ plan.voice }}</b> <span class="lab">voice calls</span></span></div>
              <div v-if="plan.validity" class="row"><span class="ic">◷</span><span><b>{{ plan.validity }}</b> <span class="lab">validity</span></span></div>
              <div v-for="spec in plan.additionalSpecs" :key="spec.key" class="row">
                <span class="ic" aria-hidden="true">✦</span><span><b>{{ spec.value }}</b> <span class="lab">{{ spec.label }}</span></span>
              </div>
              <div class="row"><span class="ic">✦</span><span><b>Auto-expiry</b> <span class="lab">no renewal, no deposit</span></span></div>
            </div>
            <div v-if="plan.firstOrderPrice !== null" class="plan-promo-box">
              <span class="promo-badge">First order</span>
              <span class="promo-text">Sign up as a new user and take <b>$3 off</b> — pay <b>{{ displayPrice(plan.firstOrderPrice) }}</b> for this plan.</span>
            </div>
            <div class="plan-foot"><NuxtLink class="plan-btn" :to="checkoutPath(productCode, plan.skuCode)">Choose {{ plan.shortName }} — {{ displayPrice(plan.price) }}</NuxtLink></div>
          </article>
        </div>

        <div class="plan-note rv">
          <strong>Beyond your plan:</strong> &nbsp;Data <span class="k">$0.14 / 600MB / day</span> · Voice <span class="k">$0.02 / minute</span> · SMS <span class="k">$0.01 / message</span> · Plans expire automatically and the number is closed on the expiry date. <strong>Free installation and activation — no setup fee</strong>.
        </div>
      </div>
    </section>

    <!-- ===== STEPS ===== -->
    <section class="section">
      <div class="section-head rv">
        <div class="eyebrow">Activation</div>
        <h2 class="section-title">Four steps. <span class="italic">Three minutes.</span></h2>
        <p class="section-lead">Everything happens on your phone. No queue, no appointment, no Chinese required.</p>
      </div>
      <div class="steps rv">
        <div class="step">
          <div class="step-card">
            <h4>Scan to start</h4>
            <p>Scan the QR code on the back of your SIM card with your phone camera, tap "Start Activation", and select the plan that fits your stay.</p>
          </div>
          <div class="step-num">1</div>
          <div class="step-empty"></div>
        </div>
        <div class="step flip">
          <div class="step-empty"></div>
          <div class="step-num">2</div>
          <div class="step-card">
            <h4>Verify your document</h4>
            <p>Photograph the photo page and signature page of your passport, plus one shot of the passport held together with the SIM card. The system checks your details automatically.</p>
          </div>
        </div>
        <div class="step">
          <div class="step-card">
            <h4>Tap your passport</h4>
            <p>Hold the back of your phone against your passport. NFC reads the chip inside, and a quick face check confirms you are who the passport says you are.</p>
          </div>
          <div class="step-num">3</div>
          <div class="step-empty"></div>
        </div>
        <div class="step flip">
          <div class="step-empty"></div>
          <div class="step-num">4</div>
          <div class="step-card">
            <h4>Sign and go</h4>
            <p>Sign in the box, and your card is live. Slot it into your phone and the signal is full — navigation, payment, ride-hailing, translation, everything, right now.</p>
          </div>
        </div>
      </div>
      <div class="step-tips rv">
        <strong>Before you start:</strong> you'll need an Android phone with NFC enabled and your passport. If the first NFC read takes longer than five minutes, a short re-verification step may be required. Once activated, everything works immediately.
      </div>
    </section>

    <!-- ===== TRUST / SECURITY ===== -->
    <section class="section alt">
      <div class="section-inner">
        <div class="section-head rv">
          <div class="eyebrow">Trust & Safety</div>
          <h2 class="section-title">The boring stuff, <span class="italic">done properly.</span></h2>
          <p class="section-lead">Your passport, your number and your data are handled to a regulatory standard, not a marketing promise.</p>
        </div>
        <div class="trust-grid">
          <div class="trust-card rv">
            <div class="trust-head">
              <div class="trust-ic">🔐</div>
              <div>
                <h4>Identity & Data</h4>
                <div class="sub">How we verify you</div>
              </div>
            </div>
            <ul class="trust-list">
              <li>Document verification follows <b>ICAO 9303</b> international standards for machine-readable passports</li>
              <li>Supported across <b>160+ countries</b> of electronic passports, verified chip by chip</li>
              <li>Real-name registration is completed <b>at activation</b>, in line with Chinese telecom regulation</li>
              <li>Your details are used for activation and regulatory filing only — not sold, not shared</li>
              <li>Photos taken during verification are processed and then discarded according to retention rules</li>
            </ul>
          </div>
          <div class="trust-card rv">
            <div class="trust-head">
              <div class="trust-ic">📶</div>
              <div>
                <h4>Network & Service</h4>
                <div class="sub">What you're actually getting</div>
              </div>
            </div>
            <ul class="trust-list">
              <li><b>China Unicom</b> — one of China's three national carriers, on the mainland 4G / 5G network</li>
              <li><b>No throttling</b> — your data runs on the same network and same speeds as domestic users</li>
              <li><b>Auto-expiry</b> — plans close themselves on the validity date, so there's no surprise renewal</li>
              <li><b>Transparent overage</b> — $0.14 / 600MB / day, $0.02 / minute, $0.01 / SMS, printed plainly</li>
            </ul>
          </div>
        </div>
        <div class="license-strip rv">
          <div class="txt">
            <h4>A licensed carrier, not a corner shop</h4>
            <p>Foreign-SIM issuance in China falls under mobile resale (MVNO) regulation. Every card we hand out sits under a formal MIIT commercial licence with full real-name registration — which is precisely why it works on every network and gets accepted everywhere a local number does.</p>
          </div>
          <div class="license-seal">
            <div class="seal-ic">✓</div>
            <div class="seal-text">
              <div class="st1">Officially Licensed</div>
              <div class="st2">MIIT-approved MVNO · Full real-name registration</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== FAQ ===== -->
    <section class="section">
      <div class="section-inner">
        <div class="section-head rv">
          <div class="eyebrow">Common Questions</div>
          <h2 class="section-title">Good to <span class="italic">know.</span></h2>
        </div>
        <div class="faq-list rv">
          <div class="faq-item" :class="{ open: openFaq === 0 }">
            <button type="button" class="faq-q" :aria-expanded="openFaq === 0" @click="openFaq = openFaq === 0 ? null : 0">Is this SIM card cheaper than international roaming?<span class="ico">+</span></button>
            <div class="faq-a"><div class="inner">In most cases, yes. Our prepaid plans offer a more predictable way to stay connected in China, helping you avoid potentially high international roaming charges. Installation and activation are included at no extra cost.</div></div>
          </div>
          <div class="faq-item" :class="{ open: openFaq === 1 }">
            <button type="button" class="faq-q" :aria-expanded="openFaq === 1" @click="openFaq = openFaq === 1 ? null : 1">Where can I collect my SIM card?<span class="ico">+</span></button>
            <div class="faq-a"><div class="inner">We offer in-person SIM delivery at selected airport arrival halls and hotel locations. Our team will meet you, help install your SIM card, and guide you through the activation process.</div></div>
          </div>
          <div class="faq-item" :class="{ open: openFaq === 2 }">
            <button type="button" class="faq-q" :aria-expanded="openFaq === 2" @click="openFaq = openFaq === 2 ? null : 2">Will this SIM card work with my phone?<span class="ico">+</span></button>
            <div class="faq-a"><div class="inner">Our physical SIM cards are compatible with most unlocked smartphones that support the required network bands and have a physical SIM slot. Both nano-SIM and standard SIM adapters are included.<br><br>Please note that passport verification requires an NFC-enabled Android device. If you don't have one, please contact our team before ordering to check available alternatives.</div></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CTA / ORDER ===== -->
    <section class="cta-band" id="get">
      <div class="cta-inner">
        <div>
          <h2>Land connected.<br><span class="italic">Everything else</span><br>gets easier.</h2>
          <p class="lead">Pick your plan and order. We'll meet you at the airport or your hotel — card in hand, activated on the spot in three minutes.</p>
          <ul class="cta-perks">
            <li>Meet at airport or hotel — face to face, no mailing</li>
            <li>We install and activate it for you, passport verified</li>
            <li>No roaming fees, no throttling, no surprises</li>
          </ul>
        </div>
        <div class="form-card">
          <form @submit.prevent="continueToCheckout">
            <h3>Get Your China SIM</h3>
            <div class="fs">Pick a plan. Installation and activation are free.</div>
            <div class="f-row">
              <label for="fPlan">Plan</label>
              <select id="fPlan" v-model="selectedSku" :disabled="!plans.length">
                <option v-if="!plans.length" value="">{{ loadingPlans ? 'Loading plans…' : 'No plans available' }}</option>
                <option v-for="plan in plans" :key="plan.skuCode" :value="plan.skuCode">{{ plan.name }} — {{ displayPrice(plan.price) }}{{ plan.validity ? ' / ' + plan.validity : '' }}{{ plan.tag ? ' · ' + plan.tag : '' }}</option>
              </select>
            </div>
            <div class="f-row">
              <label for="fQty">Quantity</label>
              <div class="qty-wrap">
                <button type="button" class="qty-btn" aria-label="Decrease quantity" :disabled="quantity <= 1" @click="quantity--">−</button>
                <input id="fQty" type="number" :value="quantity" min="1" :max="maxOrderQuantity" readonly>
                <button type="button" class="qty-btn" aria-label="Increase quantity" :disabled="quantity >= maxOrderQuantity" @click="quantity++">+</button>
              </div>
            </div>
            <div class="order-summary" aria-live="polite">
              <div class="sum-row"><span>Plan</span><span>{{ selectedPlan ? selectedPlan.name + ' — ' + displayPrice(selectedPlan.price) : '—' }}</span></div>
              <div class="sum-row"><span>Quantity</span><span>{{ quantity }}</span></div>
              <div class="sum-row"><span>Installation</span><span>Free</span></div>
              <div v-if="selectedPlan && selectedPlan.firstOrderPrice !== null" class="sum-row"><span>First order</span><span>$3 off at checkout if eligible</span></div>
              <div class="sum-row total"><span>{{ selectedPlan && selectedPlan.firstOrderPrice !== null ? 'Subtotal' : 'Total' }}</span><span>{{ selectedPlan ? displayPrice(selectedPlan.price * quantity) : '—' }}</span></div>
            </div>
            <button type="submit" class="f-submit" :disabled="!selectedPlan">Order Now →</button>
            <div class="f-privacy">🔒 Free installation & activation. We meet you at airport or hotel for in-person activation.</div>
          </form>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import type { CatalogSku } from '~/composables/useCommerce'

useLvyvSeo({
  title: 'China SIM Card · LVYV — Your First Connection in China',
  description: 'Order a physical China Unicom SIM card online with free in-person installation and passport verification.',
  path: '/product/china-sim',
})

const productCode = 'CHINA-SIM'
const commerce = useCommerce()
const { data: catalog, status } = useAsyncData('china-sim-plans', () => commerce.product(productCode), { server: false })
const loadingPlans = computed(() => status.value === 'idle' || status.value === 'pending')

// Apply the reference layout to the catalog order before filtering the visible cards.
const planPresentation: { description: string; tag?: string; featured?: boolean }[] = [
  { description: 'Short visits, business trips, and first-time visitors' },
  { description: 'A week of travel, independent exploring', tag: 'Most popular', featured: true },
  { description: 'Visiting family and business travel' },
  { description: 'Digital nomads and heavy usage', tag: 'Best value' },
]

const specification = (sku: CatalogSku, key: string) => sku.specifications.find(item => item.key === key)?.value ?? ''
const priceNumber = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
const displayPrice = (price: number) => '$' + priceNumber.format(price)
const plans = computed(() => (catalog.value?.skus ?? []).map((sku, index) => ({
  ...sku,
  firstOrderPrice: isChinaSimFirstOrderSku(productCode, sku.skuCode) && sku.price > 3 ? sku.price - 3 : null,
  shortName: sku.name.replace(/^ChinaFun /, ''),
  data: specification(sku, 'data'),
  voice: specification(sku, 'voice'),
  validity: specification(sku, 'validity'),
  additionalSpecs: sku.specifications.filter(({ key }) => !['data', 'voice', 'validity'].includes(key)),
  ...planPresentation[index],
})))
const startingPrice = computed(() => catalog.value ? displayPrice(catalog.value.product.lowestPrice) : '')
const popularPlan = computed(() => plans.value.find(plan => plan.featured))
const pricePerGb = computed(() => {
  const plan = popularPlan.value
  const data = plan?.data.trim().match(/^(\d+(?:\.\d+)?)\s*GB$/i)
  const gigabytes = Number(data?.[1])
  return plan && gigabytes > 0 ? usd(plan.price / gigabytes) : ''
})
const filters = [
  { key: 'short', label: 'Short trip · up to 15 days' },
  { key: 'long', label: 'Extended · 16+ days' },
  { key: 'all', label: 'All plans' },
] as const
const filter = ref<(typeof filters)[number]['key']>('all')
const visiblePlans = computed(() => plans.value.filter(plan => {
  if (filter.value === 'all') return true
  const days = Number(plan.validity.trim().match(/^(\d+)\s*days?$/i)?.[1])
  return days > 0 && (filter.value === 'short' ? days <= 15 : days > 15)
}))

const selectedSku = useState('china-sim-selected-sku', () => '')
const quantity = useState('china-sim-quantity', () => 1)
const selectedPlan = computed(() => plans.value.find(plan => plan.skuCode === selectedSku.value))
watch(plans, available => {
  if (!available.length || selectedPlan.value) return
  selectedSku.value = (available.find(plan => plan.featured) ?? available[0])?.skuCode ?? ''
}, { immediate: true })

function continueToCheckout() {
  if (selectedPlan.value) return navigateTo(checkoutPath(productCode, selectedPlan.value.skuCode, quantity.value))
}

const openFaq = ref<number | null>(null)
function scrollTo(section: string) {
  document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })
}

const page = ref<HTMLElement | null>(null)
let revealObserver: IntersectionObserver | undefined
onMounted(() => {
  if (!page.value || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      entry.target.classList.add('rv-anim')
      revealObserver?.unobserve(entry.target)
    }
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' })
  page.value.querySelectorAll('.rv').forEach(element => revealObserver?.observe(element))
})
onBeforeUnmount(() => revealObserver?.disconnect())
</script>

<style scoped>
  .sim-page *{margin:0;padding:0;box-sizing:border-box;}
  .sim-page{
    --green:#1E3A2F;--green-deep:#162C24;--green-soft:#2C4A3C;--green-mist:#4A6B5C;
    --lime:#7FB069;--lime-lt:#C9E4C0;--lime-dim:#5F8C4C;--lime-pale:#EAF3E5;
    --cream:#F7F5F0;--paper:#FCFBF7;--ink:#1E2B25;
    --muted:#6B7A72;--muted-lt:#9AABA3;--line:#E8E4DC;--line-lt:#F0EEE7;
    --white:#fff;--coral:#D8542F;--terra:#B85C3A;--sky:#7BA8B5;
  }
  .sim-page{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,sans-serif;background:var(--paper);color:var(--ink);line-height:1.7;-webkit-font-smoothing:antialiased;overflow-x:hidden;}
  ::selection{background:var(--lime);color:var(--green-deep);}

  /* SHARED */
  .section{padding:80px 48px;max-width:1200px;margin:0 auto;}
  .section.alt{background:var(--cream);max-width:none;}
  .section.alt .section-inner{max-width:1200px;margin:0 auto;}
  .section-head{text-align:center;margin-bottom:48px;}
  .eyebrow{font-size:11px;letter-spacing:.32em;text-transform:uppercase;color:var(--lime-dim);font-weight:600;margin-bottom:14px;}
  .section-title{font-size:40px;font-weight:600;color:var(--green);letter-spacing:-.018em;line-height:1.15;}
  .section-title .italic{font-style:italic;font-weight:400;color:var(--green-mist);}
  .section-lead{font-size:16px;color:var(--muted);margin-top:16px;max-width:560px;margin-left:auto;margin-right:auto;line-height:1.7;}
  .btn-primary{background:var(--lime);color:var(--green-deep);padding:14px 32px;border-radius:100px;font-size:14px;font-weight:600;letter-spacing:.04em;transition:all .25s;display:inline-flex;align-items:center;gap:8px;border:none;cursor:pointer;}
  .btn-primary:hover{background:var(--lime-lt);transform:translateY(-2px);}
  .btn-ghost{border:1px solid rgba(201,228,192,.30);color:var(--cream);padding:14px 32px;border-radius:100px;font-size:14px;font-weight:400;letter-spacing:.04em;transition:all .25s;display:inline-flex;align-items:center;gap:8px;background:transparent;cursor:pointer;}
  .btn-ghost:hover{border-color:var(--lime);background:rgba(127,176,105,.10);}



  /* ===== HERO ===== */
  .hero{position:relative;min-height:92vh;display:flex;align-items:center;overflow:hidden;background:var(--green-deep);padding:120px 48px 80px;}
  .hero-bg{position:absolute;inset:0;background-image:url('/images/products/china-sim/hero-bg.webp');background-size:cover;background-position:center;opacity:.72;}
  .hero-glow{position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 22% 40%,rgba(127,176,105,.18),transparent 62%),linear-gradient(100deg,rgba(22,44,36,.96) 4%,rgba(22,44,36,.88) 34%,rgba(22,44,36,.52) 62%,rgba(22,44,36,.24) 84%,rgba(22,44,36,.34) 100%);}
  .hero-inner{position:relative;z-index:3;max-width:1200px;margin:0 auto;width:100%;display:grid;grid-template-columns:1.05fr .95fr;gap:56px;align-items:center;}
  .hero-badge{display:inline-flex;align-items:center;gap:8px;font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:var(--lime-lt);font-weight:600;margin-bottom:20px;padding:6px 16px;border-radius:100px;background:rgba(127,176,105,.16);border:1px solid rgba(201,228,192,.28);}
  .hero-badge .dot{width:6px;height:6px;border-radius:50%;background:var(--lime);animation:pulse 2s ease-in-out infinite;}
  @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.3;}}
  .hero h1{font-size:56px;font-weight:600;color:var(--white);line-height:1.04;letter-spacing:-.028em;margin-bottom:20px;}
  .hero h1 .italic{font-style:italic;font-weight:400;color:var(--lime-lt);}
  .hero-sub{font-size:18px;color:rgba(247,245,240,.72);line-height:1.62;margin-bottom:26px;max-width:520px;font-weight:300;}
  .hero-points{display:grid;grid-template-columns:repeat(2,1fr);gap:10px 18px;margin-bottom:30px;max-width:560px;}
  .hero-point{display:flex;align-items:center;gap:9px;font-size:13.5px;color:rgba(247,245,240,.86);}
  .hero-point .tick{width:18px;height:18px;border-radius:50%;background:rgba(127,176,105,.22);color:var(--lime-lt);font-size:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-weight:700;}
  .hero-btns{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:24px;}
  .hero-note{font-size:12px;color:rgba(247,245,240,.42);letter-spacing:.02em;}
  .hero-note strong{color:var(--lime-lt);font-weight:600;}

  /* SIM card visual */
  .hero-visual{position:relative;display:flex;align-items:center;justify-content:center;min-height:420px;}
  .sim-card{width:340px;height:214px;border-radius:18px;background:linear-gradient(135deg,#F3EFE6 0%,#E4DDD0 48%,#CFC6B5 100%);position:relative;box-shadow:0 30px 70px rgba(0,0,0,.42),0 2px 0 rgba(255,255,255,.7) inset;transform:rotate(-7deg);overflow:hidden;}
  .sim-card::before{content:"";position:absolute;inset:0;background:linear-gradient(115deg,rgba(255,255,255,.55) 0%,transparent 34%,transparent 66%,rgba(255,255,255,.28) 100%);}
  .sim-chip{position:absolute;left:28px;top:50%;transform:translateY(-50%);width:62px;height:48px;border-radius:8px;background:linear-gradient(145deg,#D9C48F,#B99C58 55%,#CFB77E);box-shadow:inset 0 0 0 1px rgba(0,0,0,.14);}
  .sim-chip::after{content:"";position:absolute;inset:8px 10px;border:1px solid rgba(0,0,0,.18);border-radius:3px;background-image:linear-gradient(90deg,rgba(0,0,0,.16) 1px,transparent 1px),linear-gradient(rgba(0,0,0,.16) 1px,transparent 1px);background-size:12px 12px;}
  .sim-body{position:absolute;left:112px;top:50%;transform:translateY(-50%);right:26px;}
  .sim-brand{font-size:19px;font-weight:700;color:var(--green-deep);letter-spacing:.1em;}
  .sim-brand span{color:var(--lime-dim);font-weight:400;}
  .sim-series{margin-top:5px;font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#8A7B58;font-weight:600;}
  .sim-net{margin-top:16px;display:inline-flex;align-items:center;gap:7px;font-size:11px;color:#6E6349;background:rgba(255,255,255,.55);padding:4px 11px;border-radius:20px;border:1px solid rgba(0,0,0,.07);}
  .sim-net .dot{width:6px;height:6px;border-radius:50%;background:var(--lime-dim);}
  .sim-5g{position:absolute;right:26px;bottom:22px;font-size:22px;font-weight:700;color:rgba(30,58,47,.16);letter-spacing:-.02em;}
  .float-chip{position:absolute;border-radius:14px;background:rgba(252,251,248,.95);backdrop-filter:blur(10px);box-shadow:0 14px 36px rgba(0,0,0,.30);padding:12px 16px;display:flex;align-items:center;gap:11px;z-index:4;}
  .float-chip .ic{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;}
  .float-chip .tx{font-size:11.5px;line-height:1.35;}
  .float-chip .tx b{display:block;font-size:13px;color:var(--green);font-weight:700;}
  .float-chip .tx span{color:var(--muted);}
  .fc-1{top:6%;left:-2%;animation:floaty 5s ease-in-out infinite;}
  .fc-2{bottom:14%;right:-4%;animation:floaty 6.5s ease-in-out infinite .8s;}
  @keyframes floaty{0%,100%{transform:translateY(0);}50%{transform:translateY(-9px);}}
  .fc-1 .ic{background:var(--lime-pale);color:var(--lime-dim);}
  .fc-2 .ic{background:rgba(216,84,47,.10);color:var(--coral);}

  /* ===== PROBLEM / SCENARIO ===== */
  .pain-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-bottom:26px;}
  .pain-card{background:var(--white);border-radius:16px;padding:28px 26px;border:1px solid var(--line-lt);transition:all .3s;}
  .pain-card:hover{transform:translateY(-4px);box-shadow:0 14px 36px rgba(30,58,47,.09);}
  .pain-x{width:26px;height:26px;border-radius:50%;background:rgba(216,84,47,.10);color:var(--coral);font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-bottom:14px;}
  .pain-card h4{font-size:19px;color:var(--green);font-weight:700;margin-bottom:8px;letter-spacing:-.01em;}
  .pain-card p{font-size:13.5px;color:var(--muted);line-height:1.68;}
  .pain-note{background:linear-gradient(90deg,rgba(127,176,105,.11),rgba(127,176,105,.03));border-left:3px solid var(--lime);border-radius:0 12px 12px 0;padding:22px 28px;font-size:15.5px;color:var(--green);line-height:1.75;}
  .pain-note strong{color:var(--lime-dim);font-weight:700;}


  /* ===== COST COMPARE ===== */
  .cost-wrap{display:grid;grid-template-columns:1fr 1fr;gap:22px;align-items:stretch;}
  .cost-card{border-radius:18px;padding:32px 30px;position:relative;overflow:hidden;}
  .cost-card.bad{background:var(--white);border:1px solid var(--line);}
  .cost-card.good{background:var(--green);color:var(--cream);}
  .cost-label{font-size:10.5px;letter-spacing:.24em;text-transform:uppercase;font-weight:700;margin-bottom:16px;}
  .cost-card.bad .cost-label{color:var(--coral);}
  .cost-card.good .cost-label{color:var(--lime-lt);}
  .cost-price{font-size:52px;font-weight:700;letter-spacing:-.03em;line-height:1;margin-bottom:8px;}
  .cost-card.bad .cost-price{color:var(--coral);}
  .cost-card.good .cost-price{color:var(--lime-lt);}
  .cost-unit{font-size:13px;margin-bottom:22px;}
  .cost-card.bad .cost-unit{color:var(--muted);}
  .cost-card.good .cost-unit{color:rgba(247,245,240,.6);}
  .cost-list{list-style:none;display:flex;flex-direction:column;gap:11px;}
  .cost-list li{font-size:13.5px;display:flex;gap:10px;align-items:flex-start;line-height:1.6;}
  .cost-card.bad .cost-list li{color:var(--muted);}
  .cost-card.good .cost-list li{color:rgba(247,245,240,.84);}
  .cost-list .m{color:var(--coral);font-weight:700;flex-shrink:0;}
  .cost-list .g{color:var(--lime);font-weight:700;flex-shrink:0;}
  .cost-card.bad .cost-list .g{color:var(--lime-dim);}
  .cost-badge{position:absolute;top:24px;right:24px;font-size:10px;letter-spacing:.16em;text-transform:uppercase;font-weight:700;padding:5px 12px;border-radius:100px;}
  .cost-card.bad .cost-badge{background:rgba(216,84,47,.10);color:var(--coral);}
  .cost-card.good .cost-badge{background:rgba(127,176,105,.20);color:var(--lime-lt);}
  .cost-usd{font-size:18px;font-weight:500;opacity:.55;margin-left:6px;}
  .cost-math{margin-top:18px;background:rgba(216,84,47,.06);border:1px solid rgba(216,84,47,.16);border-radius:12px;padding:16px 18px;font-size:12.5px;color:var(--muted);line-height:1.65;}
  .cost-math strong{color:var(--coral);font-weight:700;}
  .cost-math b{color:var(--coral);font-weight:700;}
  .cost-math.good{background:rgba(127,176,105,.10);border-color:rgba(127,176,105,.24);}
  .cost-math.good strong{color:var(--lime-lt);}
  .cost-math.good b{color:var(--lime-lt);}


  /* ===== PLANS ===== */
  .plan-toggle{display:flex;gap:8px;justify-content:center;margin-bottom:38px;flex-wrap:wrap;}
  .plan-chip{font-size:12px;font-weight:500;padding:8px 18px;border-radius:100px;background:var(--white);border:1px solid var(--line);color:var(--muted);cursor:pointer;transition:all .25s;user-select:none;}
  .plan-chip:hover{border-color:var(--lime);color:var(--green);}
  .plan-chip.on{background:var(--green);border-color:var(--green);color:var(--cream);font-weight:600;}
  .plan-message{text-align:center;color:var(--muted);}
  .plan-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;}
  .plan-card{background:var(--white);border-radius:18px;border:1px solid var(--line);overflow:hidden;transition:all .3s;display:flex;flex-direction:column;position:relative;}
  .plan-card:hover{transform:translateY(-5px);box-shadow:0 18px 44px rgba(30,58,47,.12);}
  .plan-card.featured{border-color:var(--lime);box-shadow:0 8px 28px rgba(127,176,105,.16);}
  .plan-flag{position:absolute;top:0;right:0;font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;font-weight:700;padding:6px 14px;background:var(--lime);color:var(--green-deep);border-radius:0 14px 0 12px;}
  .plan-promo-flag{display:inline-flex;align-items:center;gap:5px;font-size:9px;letter-spacing:.10em;text-transform:uppercase;font-weight:700;color:var(--coral);background:rgba(216,84,47,.10);border:1px solid rgba(216,84,47,.22);padding:3px 10px;border-radius:100px;margin-top:12px;margin-bottom:-4px;}
  .plan-promo-flag::before{content:"✦";font-size:9px;}
  .plan-promo-box{margin:0 20px 16px;background:linear-gradient(90deg,rgba(216,84,47,.08),rgba(216,84,47,.02));border:1px solid rgba(216,84,47,.18);border-radius:10px;padding:10px 14px;display:flex;gap:9px;align-items:flex-start;}
  .promo-badge{background:var(--coral);color:var(--white);font-size:8px;letter-spacing:.10em;text-transform:uppercase;font-weight:700;padding:3px 8px;border-radius:100px;flex-shrink:0;margin-top:2px;}
  .promo-text{font-size:11.5px;color:var(--muted);line-height:1.5;}
  .promo-text b{color:var(--coral);font-weight:700;}
  .plan-head{padding:26px 22px 20px;border-bottom:1px solid var(--line-lt);}
  .plan-name{font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);font-weight:600;margin-bottom:12px;}
  .plan-price{font-size:38px;font-weight:700;color:var(--green);letter-spacing:-.03em;line-height:1;display:flex;align-items:baseline;gap:3px;}
  .plan-price .cur{font-size:20px;font-weight:600;color:var(--lime-dim);}
  .plan-price .per{font-size:13px;font-weight:400;color:var(--muted-lt);margin-left:3px;letter-spacing:0;}
  .plan-for{margin-top:10px;font-size:12.5px;color:var(--muted);line-height:1.5;}
  .plan-spec{padding:20px 22px;display:flex;flex-direction:column;gap:13px;flex:1;}
  .plan-spec .row{display:flex;align-items:center;gap:10px;font-size:13.5px;color:var(--ink);}
  .plan-spec .row .ic{width:24px;height:24px;border-radius:7px;background:var(--lime-pale);color:var(--lime-dim);font-size:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .plan-spec .row b{font-weight:600;}
  .plan-spec .row .lab{color:var(--muted);font-size:12.5px;}
  .plan-foot{padding:0 22px 24px;}
  .sim-page .plan-btn{display:block;width:100%;text-align:center;padding:12px 8px;border-radius:11px;background:var(--green);color:var(--cream);font-size:12.5px;font-weight:600;letter-spacing:.01em;border:none;cursor:pointer;transition:all .25s;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .sim-page .plan-btn:hover{background:var(--green-deep);}
  .sim-page .plan-card.featured .plan-btn{background:var(--lime);color:var(--green-deep);}
  .sim-page .plan-card.featured .plan-btn:hover{background:var(--lime-lt);}
  .plan-note{margin-top:26px;background:var(--white);border:1px solid var(--line);border-radius:14px;padding:20px 26px;font-size:13px;color:var(--muted);line-height:1.75;}
  .plan-note strong{color:var(--green);font-weight:600;}
  .plan-note .k{color:var(--lime-dim);font-weight:700;}

  /* ===== STEPS ===== */
  .steps{position:relative;max-width:1000px;margin:0 auto;padding:0 0 4px;}
  .steps::before{content:"";position:absolute;left:50%;top:24px;bottom:24px;width:2px;background:linear-gradient(180deg,var(--lime),rgba(127,176,105,.18));transform:translateX(-50%);}
  .step{position:relative;display:grid;grid-template-columns:1fr 76px 1fr;align-items:center;margin-bottom:30px;}
  .step:last-child{margin-bottom:0;}
  .step-card{background:var(--white);border-radius:16px;padding:24px 26px;border:1px solid var(--line-lt);}
  .step-card h4{font-size:18px;color:var(--green);font-weight:700;margin-bottom:8px;}
  .step-card p{font-size:13.5px;color:var(--muted);line-height:1.65;}
  .step-num{width:48px;height:48px;border-radius:50%;background:var(--green);color:var(--lime-lt);font-size:19px;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto;position:relative;z-index:2;box-shadow:0 0 0 6px var(--paper);}
  .step.flip .step-card{order:3;}
  .step.flip .step-num{order:2;}
  .step.flip .step-empty{order:1;}
  .step-empty{height:1px;}
  .step-tips{margin-top:26px;background:linear-gradient(90deg,rgba(127,176,105,.10),rgba(127,176,105,.03));border:1px solid rgba(127,176,105,.22);border-radius:14px;padding:20px 26px;font-size:13.5px;color:var(--green);line-height:1.75;}
  .step-tips strong{color:var(--lime-dim);font-weight:700;}


  /* ===== TRUST / SECURITY ===== */
  .trust-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:22px;}
  .trust-card{background:var(--white);border-radius:18px;padding:30px 30px;border:1px solid var(--line-lt);}
  .trust-head{display:flex;align-items:center;gap:14px;margin-bottom:16px;}
  .trust-ic{width:44px;height:44px;border-radius:12px;background:var(--green);color:var(--lime-lt);font-size:19px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .trust-head h4{font-size:19px;color:var(--green);font-weight:700;letter-spacing:-.01em;}
  .trust-head .sub{font-size:12px;color:var(--muted-lt);letter-spacing:.04em;text-transform:uppercase;font-weight:600;}
  .trust-list{list-style:none;display:flex;flex-direction:column;gap:11px;}
  .trust-list li{font-size:13.5px;color:var(--muted);line-height:1.6;padding-left:24px;position:relative;}
  .trust-list li::before{content:"✓";position:absolute;left:0;top:0;color:var(--lime-dim);font-weight:700;font-size:13px;}
  .trust-list li b{color:var(--green);font-weight:600;}
  .license-strip{margin-top:24px;background:var(--green);border-radius:18px;padding:30px 34px;display:flex;align-items:center;gap:28px;flex-wrap:wrap;justify-content:space-between;}
  .license-strip .txt{max-width:620px;}
  .license-strip .txt h4{font-size:20px;color:var(--white);font-weight:700;margin-bottom:8px;}
  .license-strip .txt p{font-size:13.5px;color:rgba(247,245,240,.62);line-height:1.65;}
  .license-seal{flex-shrink:1;min-width:0;display:flex;align-items:center;gap:14px;padding:14px 22px;border-radius:14px;background:rgba(127,176,105,.14);border:1px solid rgba(201,228,192,.22);}
  .license-seal .seal-ic{width:44px;height:44px;flex-shrink:0;border-radius:50%;background:var(--lime);color:var(--green-deep);font-size:20px;display:flex;align-items:center;justify-content:center;font-weight:700;}
  .license-seal .st1{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--lime-lt);font-weight:700;}
  .license-seal .st2{font-size:11.5px;color:rgba(247,245,240,.55);}
  .license-seal .seal-text{min-width:0;}


  /* ===== FAQ ===== */
  .faq-list{max-width:820px;margin:0 auto;display:flex;flex-direction:column;gap:12px;}
  .faq-item{background:var(--white);border:1px solid var(--line-lt);border-radius:14px;overflow:hidden;transition:border-color .25s;}
  .faq-item.open{border-color:var(--lime);}
  .faq-q{width:100%;text-align:left;padding:20px 24px;font-size:15px;font-weight:600;color:var(--green);background:none;border:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:16px;font-family:inherit;}
  .faq-q .ico{color:var(--lime-dim);font-size:19px;transition:transform .3s;flex-shrink:0;}
  .faq-item.open .faq-q .ico{transform:rotate(45deg);}
  .faq-a{display:grid;grid-template-rows:0fr;overflow:hidden;transition:grid-template-rows .35s ease;}
  .faq-item.open .faq-a{grid-template-rows:1fr;}
  .faq-item.open .faq-a .inner{padding-bottom:20px;}
  .faq-a .inner{overflow:hidden;padding-inline:24px;font-size:13.8px;color:var(--muted);line-height:1.75;}

  /* ===== CTA / FORM ===== */
  .cta-band{background:var(--green);padding:70px 48px;position:relative;overflow:hidden;}
  .cta-band::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 60% 70% at 78% 30%,rgba(127,176,105,.20),transparent 62%);}
  .cta-inner{position:relative;z-index:2;max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:52px;align-items:center;}
  .cta-band h2{font-size:38px;font-weight:600;color:var(--white);line-height:1.12;letter-spacing:-.022em;margin-bottom:16px;}
  .cta-band h2 .italic{font-style:italic;font-weight:400;color:var(--lime-lt);}
  .cta-band .lead{font-size:15.5px;color:rgba(247,245,240,.66);line-height:1.72;margin-bottom:24px;max-width:440px;}
  .cta-perks{display:flex;flex-direction:column;gap:11px;}
  .cta-perks li{list-style:none;font-size:13.5px;color:rgba(247,245,240,.82);display:flex;gap:11px;align-items:flex-start;line-height:1.55;}
  .cta-perks li::before{content:"✓";color:var(--lime);font-weight:700;flex-shrink:0;}
  .form-card{background:var(--paper);border-radius:20px;padding:32px 30px;box-shadow:0 24px 60px rgba(0,0,0,.26);}
  .form-card h3{font-size:20px;color:var(--green);font-weight:700;margin-bottom:5px;}
  .form-card .fs{font-size:12.5px;color:var(--muted);margin-bottom:20px;}
  .f-row{margin-bottom:14px;}
  .f-row label{display:block;font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted-lt);font-weight:600;margin-bottom:6px;}
  .f-row input,.f-row select{width:100%;padding:11px 14px;border-radius:10px;border:1px solid var(--line);background:var(--white);font-size:14px;color:var(--ink);font-family:inherit;transition:border-color .2s;}
  .f-row input:focus,.f-row select:focus{outline:none;border-color:var(--lime);box-shadow:0 0 0 3px rgba(127,176,105,.14);}

  .f-submit{width:100%;padding:14px;border-radius:11px;background:var(--lime);color:var(--green-deep);font-size:14px;font-weight:700;border:none;cursor:pointer;letter-spacing:.03em;transition:all .25s;font-family:inherit;margin-top:16px;}
  .f-submit:disabled{opacity:.55;cursor:default;}
  .f-submit:not(:disabled):hover{background:var(--lime-lt);transform:translateY(-1px);}
  .f-privacy{margin-top:12px;font-size:11.5px;color:var(--muted-lt);line-height:1.55;text-align:center;}
  /* Quantity selector */
  .qty-wrap{display:flex;align-items:center;gap:0;border:1px solid var(--line);border-radius:11px;overflow:hidden;width:fit-content;}
  .qty-btn{width:44px;height:44px;border:none;background:var(--cream);color:var(--green);font-size:18px;font-weight:700;cursor:pointer;transition:background .2s;font-family:inherit;}
  .qty-btn:not(:disabled):hover{background:var(--lime-pale);}
  .qty-btn:disabled{cursor:default;}
  .qty-btn:not(:disabled):active{background:var(--lime);}
  #fQty{width:60px;height:44px;border:none;border-top:1px solid var(--line);border-bottom:1px solid var(--line);text-align:center;font-size:16px;font-weight:600;color:var(--green);background:var(--white);-moz-appearance:textfield;}
  #fQty::-webkit-outer-spin-button,#fQty::-webkit-inner-spin-button{-webkit-appearance:none;margin:0;}
  /* Order summary */
  .order-summary{margin-top:18px;background:var(--cream);border-radius:12px;padding:16px 18px;border:1px solid var(--line-lt);}
  .sum-row{display:flex;justify-content:space-between;align-items:center;padding:6px 0;font-size:13px;color:var(--muted);}
  .sum-row span:first-child{color:var(--muted-lt);font-size:12px;}
  .sum-row span:last-child{font-weight:600;color:var(--ink);}
  .sum-row.total{border-top:1px solid var(--line);margin-top:6px;padding-top:12px;}
  .sum-row.total span:first-child{color:var(--green);font-size:14px;font-weight:700;}
  .sum-row.total span:last-child{color:var(--green);font-size:18px;font-weight:700;}

  /* REVEAL — pure CSS entrance animation, no JS dependency.
     Content is visible by default; the animation only plays a subtle lift. */
  @keyframes rvLift{
    0%{opacity:.001;transform:translateY(20px);}
    100%{opacity:1;transform:none;}
  }
  .rv{opacity:1;}
  .rv.rv-anim{animation:rvLift .75s cubic-bezier(.22,1,.36,1) both;}

  @media(max-width:1024px){
    .hero-inner{grid-template-columns:1fr;gap:44px;}
    .hero h1{font-size:46px;}
    .hero-visual{min-height:340px;}
    .plan-grid{grid-template-columns:repeat(2,1fr);}
    .cta-inner{grid-template-columns:1fr;gap:36px;}
  }
  @media(max-width:768px){
    .section{padding:56px 20px;}
    .hero{padding:100px 20px 60px;}
    .hero h1{font-size:36px;}
    .hero-points{grid-template-columns:1fr;}
    .section-title{font-size:29px;}
    .pain-grid,.trust-grid,.cost-wrap{grid-template-columns:1fr;}
    .plan-grid{grid-template-columns:1fr;}
    .step{grid-template-columns:1fr;gap:14px;text-align:center;}
    .step .step-empty{display:none;}
    .step.flip .step-card{order:2;}
    .step.flip .step-num{order:1;}
    .step-card{text-align:left;}
    .steps::before{display:none;}
    .cta-band{padding:52px 20px;}
    .cta-band h2{font-size:28px;}
    .sim-card{width:270px;height:170px;}
    .license-seal{max-width:100%;flex-wrap:wrap;}
    .cost-card{min-width:0;}
    .plan-card{min-width:0;}
    .plan-head,.plan-spec,.plan-promo-box,.plan-foot{min-width:0;}
  }
  @media(max-width:400px){
    .hero h1{font-size:31px;}
    .plan-price{font-size:34px;}
  }
</style>
