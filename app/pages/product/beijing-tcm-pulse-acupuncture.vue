<template>
  <main class="encounter-experience-detail">
    <section class="hero" id="hero">
      <div class="hero-img" style="background-image:url('/images/encounters/wellness/detail/pulse-diagnosis.webp');"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-crumb">
          <a href="/encounters">Encounters</a>
          <span class="sep">/</span>
          <a href="/encounters#beijing">Beijing</a>
          <span class="sep">/</span>
          <span>{{ productName }}</span>
        </div>
        <div class="hero-eyebrow">Signature TCM Encounter · Beijing</div>
        <h1>The Doctor Who<br />Reads Your <span class="italic">Wrist</span></h1>
        <p class="hero-hook">"50 seconds of silence. Three fingers on my wrist. Then she described symptoms I hadn't told anyone."</p>
        <div class="hero-meta">
          <div class="hero-meta-item">⏱ <b>2 hours</b> total</div>
          <div class="hero-meta-item">🏥 <b>Renowned TCM hospital</b></div>
          <div class="hero-meta-item">🗣 <b>English</b> throughout</div>
          <div class="hero-meta-item">📄 <b>Same-day</b> report</div>
        </div>
        <div class="hero-btns">
          <a href="#book" class="btn-book">Book This Encounter →</a>
          <a href="#compare" class="btn-ghost">See Price Comparison</a>
        </div>
      </div>
      <div class="hero-price-card">
        <div class="from">from</div>
        <div class="num">{{ basePriceText }}</div>
        <div class="per">/ person</div>
        <div v-if="savingsPercent > 0" class="note">Save {{ savingsPercent }}% vs US pricing</div>
        <div class="compare-mini">$470 in the US</div>
      </div>
    </section>

    <div class="strip">
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/detail/pulse-diagnosis.webp');"><div class="strip-label">Pulse Diagnosis · 把脉</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/detail/acupuncture.webp');"><div class="strip-label">Acupuncture · 针灸</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/detail/cupping.webp');"><div class="strip-label">Cupping · 拔罐</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/detail/tcm-moxibustion.webp');"><div class="strip-label">Moxibustion · 艾灸</div></div>
    </div>

    <div class="section" style="padding-top:48px;padding-bottom:0;">
      <div class="hook-block">
        <div class="quote">"A doctor read my pulse for <span class="accent">50 seconds</span> and knew more about me than my GP of <span class="accent">10 years</span>."</div>
        <div class="attribution">— <span class="name">Sarah K.</span>, London · TCM Encounter, Beijing · Oct 2025</div>
      </div>
    </div>

    <section class="section" id="therapy">
      <div class="section-head center">
        <div class="eyebrow">What Happens</div>
        <h2 class="section-title">Three therapies. <span class="italic">One session.</span></h2>
        <p class="section-sub">A complete TCM encounter in 2 hours — pulse diagnosis, acupuncture, and cupping. You walk out with an English report and a different understanding of medicine.</p>
      </div>
      <div class="card-grid">
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/detail/pulse-diagnosis.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">01 · Diagnosis</div>
            <h3>Pulse Diagnosis</h3>
            <div class="svc-cn">把脉 · Bà Mài</div>
            <p>Three fingers on your wrist. 12 pulse positions, each mapped to an organ system. In 50 seconds, she reads your constitution and imbalances.</p>
            <p class="svc-hook">"She described my sleep problems before I said a word."</p>
            <span class="svc-tag">12 positions · 50 sec</span>
          </div>
        </div>
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/detail/acupuncture.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">02 · Treatment</div>
            <h3>Acupuncture</h3>
            <div class="svc-cn">针灸 · Zhēn Jiǔ</div>
            <p>10-15 hair-thin needles along meridians from your diagnosis. A dull ache, then warmth, then deep rest. 20 minutes. The doctor stays throughout.</p>
            <p class="svc-hook">"My shoulder unlocked for the first time in years."</p>
            <span class="svc-tag">10-15 needles · 20 min</span>
          </div>
        </div>
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/detail/cupping.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">03 · Recovery</div>
            <h3>Cupping & Moxibustion</h3>
            <div class="svc-cn">拔罐 + 艾灸 · Bá Guàn + Ài Jiǔ</div>
            <p>Fire cups on your back to release tension and draw out toxins. Then moxibustion to warm meridians. Marks fade in a week — relief lasts longer.</p>
            <p class="svc-hook">"The marks last a week. The relief lasts months."</p>
            <span class="svc-tag">15 min · marks fade in 7 days</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section alt">
      <div class="section alt-inner" id="timeline">
        <div class="section-head">
          <div class="eyebrow">Your Afternoon</div>
          <h2 class="section-title">2 hours that change how you think about <span class="italic">medicine</span></h2>
        </div>
        <div class="tl-wrap">
          <div class="tl-aside">
            <h3>Everything in one visit</h3>
            <p>From arrival to English report on your phone — under 2 hours. No waiting rooms, no referrals.</p>
            <div class="tl-note"><b>Good to know:</b> Wear loose clothing. Don't eat a heavy meal before. Cupping marks are normal. You can fly the same day.</div>
          </div>
          <div class="timeline">
            <div class="tl-item">
              <div class="tl-time">14:00 · Arrival</div>
              <div class="tl-title">Meet your guide at the hospital</div>
              <div class="tl-desc">Bilingual LVYV guide at the International Department entrance. Pre-registered — no queue. <span class="cn">国际部入口集合 · 预先登记</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">14:15 · Consultation</div>
              <div class="tl-title">50-second pulse diagnosis</div>
              <div class="tl-desc">Three fingers on your wrist. 12 positions, each mapped to an organ. She explains what she found — in English. <span class="cn">把脉 · 12个脉搏位置 · 对应脏腑</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">14:30 · Treatment</div>
              <div class="tl-title">Acupuncture + cupping</div>
              <div class="tl-desc">10-15 personalized acupuncture points, 20 min rest. Then fire cupping — 6-8 cups for 10 min. <span class="cn">针灸 · 10-15穴位 · 留针20分钟 · 拔罐</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">15:30 · Report & Aftercare</div>
              <div class="tl-title">English report + 7-day support</div>
              <div class="tl-desc">Written English report on your phone — diagnosis, treatment, recommendations. Herbal tea in the recovery lounge. 7-day WhatsApp aftercare. <span class="cn">英文报告 · 7天随访支持</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section alt" id="compare">
      <div class="section alt-inner">
        <div class="section-head center">
          <div class="eyebrow">Price Comparison</div>
          <h2 class="section-title">Same treatment. <span class="italic">Different planet.</span></h2>
          <p class="section-sub">Verified 2025 pricing for a full TCM session.</p>
        </div>
        <div class="cmp-wrap">
          <div class="cmp-head">
            <h3>TCM Session Pricing</h3>
            <span v-if="savingsPercent > 0" class="badge">Save {{ savingsPercent }}%</span>
          </div>
          <div class="cmp-labels"><span>Treatment</span><span>Typical US price</span><span>LVYV Beijing</span></div>
          <div class="cmp-body">
            <div class="cmp-row">
              <div class="label">Pulse Diagnosis<span>50-sec · 12 positions</span></div>
              <div class="away">$120</div>
              <div class="here">$17</div>
            </div>
            <div class="cmp-row">
              <div class="label">Acupuncture<span>10-15 needles · 20 min</span></div>
              <div class="away">$250</div>
              <div class="here">$45</div>
            </div>
            <div class="cmp-row">
              <div class="label">Cupping + Moxibustion<span>Fire cups · mugwort</span></div>
              <div class="away">$100</div>
              <div class="here">$28</div>
            </div>
            <div class="cmp-row total">
              <div class="label">Total Session<span>Everything above · 2 hours</span></div>
              <div class="away">$470</div>
              <div class="here">{{ basePriceText }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <div class="eyebrow">What's Included</div>
        <h2 class="section-title">No hidden fees. No <span class="italic">surprises</span>.</h2>
      </div>
      <div class="inc-grid">
        <div class="inc-card yes">
          <div class="inc-title"><span class="badge">✓</span> Included in {{ basePriceText }}</div>
          <ul class="inc-list">
            <li><b>Pulse diagnosis</b> by licensed TCM doctor</li>
            <li><b>Acupuncture</b> — personalized point selection</li>
            <li><b>Cupping + moxibustion</b> therapy</li>
            <li><b>English-speaking guide</b> throughout</li>
            <li><b>English diagnosis report</b> same day</li>
            <li><b>7-day aftercare</b> via WhatsApp</li>
            <li><b>Hospital registration</b> pre-arranged</li>
          </ul>
        </div>
        <div class="inc-card no">
          <div class="inc-title"><span class="badge">✗</span> Not Included</div>
          <ul class="inc-list">
            <li>Flights and visas (240-hour transit visa-free available)</li>
            <li>Hotel accommodation (partner hotels nearby)</li>
            <li>Herbal prescriptions to take home (from $17)</li>
            <li>Additional therapies beyond the 3 included</li>
            <li>Personal travel insurance</li>
          </ul>
        </div>
      </div>
    </section>

    <EncounterExperienceAddOns
      :product-code="product.code"
      :base-sku-code="sku?.skuCode"
      :base-price="basePrice"
      :base-title="productName"
      description="2h · Beijing · Renowned TCM hospital · English guide"
      bundle-label="TCM"
      example-product-code="ENC-BJ-DENTAL-CLEANING"
      @book="booking?.open()"
    >
      <template #default="{ book }">
        <section class="section alt" id="faq">
          <div class="section alt-inner">
            <div class="section-head center">
              <div class="eyebrow">Questions</div>
              <h2 class="section-title">What everyone <span class="italic">asks</span></h2>
            </div>
            <div class="faq-list">
              <div class="faq-item" :class="{ open: activeFaq === 0 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 0" @click="toggleFaq(0)"><span class="n">01</span> Does it hurt? <span class="toggle">+</span></button>
                <div class="faq-a">Needles are <b>0.2mm</b> — thinner than a human hair. Most feel a brief dull ache, then warmth. Cupping marks are painless and fade in 7 days. <b>90% of first-timers say it hurt less than expected.</b></div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 1 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 1" @click="toggleFaq(1)"><span class="n">02</span> Do I need to speak Chinese? <span class="toggle">+</span></button>
                <div class="faq-a">No. Your <b>LVYV guide</b> translates everything. The final report is in English.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 2 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 2" @click="toggleFaq(2)"><span class="n">03</span> Is this a real hospital? <span class="toggle">+</span></button>
                <div class="faq-a">We partner with one of <b>Beijing's most renowned TCM hospitals</b>. The doctors are licensed practitioners with years of clinical experience and a dedicated international department.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 3 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 3" @click="toggleFaq(3)"><span class="n">04</span> Can I use the report back home? <span class="toggle">+</span></button>
                <div class="faq-a">Yes. The English report includes <b>diagnosis, treatment, and recommendations</b>. Many clients share it with their GP as a preventative care roadmap.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 4 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 4" @click="toggleFaq(4)"><span class="n">05</span> Can I skip acupuncture? <span class="toggle">+</span></button>
                <div class="faq-a">Absolutely. Pulse diagnosis + cupping only ($59), or pulse diagnosis only ($25). Full English report included either way.</div>
              </div>
            </div>
          </div>
        </section>

        <section class="cta-band" id="book">
          <div class="cta-inner">
            <div class="eyebrow">Ready?</div>
            <h2>50 seconds. Three fingers. <span class="italic">Book it.</span></h2>
            <p>{{ basePriceText }} · 2-hour TCM encounter · Renowned TCM hospital · English guide · Same-day report · 7-day aftercare</p>
            <div class="cta-btns">
              <button class="btn-book" type="button" @click="book">Book This Encounter →</button>
              <a href="/encounters" class="btn-ghost">← Back to All Encounters</a>
            </div>
          </div>
        </section>
      </template>
    </EncounterExperienceAddOns>
  </main>
  <EncounterBookingDialog ref="booking" :product="product" :product-name="productName" :sku="sku" :status="status" @retry="refresh()" />
</template>

<script setup lang="ts">
import { encounterProducts } from '~~/shared/utils/encounterProducts'

const product = encounterProducts.find(item => item.code === 'ENC-BJ-TCM-PULSE-ACUPUNCTURE')!
const { productName, sku, status, refresh } = await useEncounterProduct(product, {
  title: "The Doctor Who Reads Your Wrist · LVYV — TCM Encounter",
  description: "50 seconds of silence. Three fingers on your wrist. Pulse diagnosis, acupuncture, and cupping at a renowned TCM hospital in Beijing. From $89.",
})
const booking = useTemplateRef('booking')

const activeFaq = ref<number | null>(0)
function toggleFaq(index: number) {
  activeFaq.value = activeFaq.value === index ? null : index
}

const originalPrice = 89
const basePrice = computed(() => sku.value?.price ?? originalPrice)
const basePriceText = computed(() => encounterPrice(basePrice.value))
const savingsPercent = computed(() => basePrice.value === originalPrice
  ? 81
  : Math.round((1 - basePrice.value / 470) * 100))
</script>

<style src="~/assets/css/encounter-experience.css"></style>
