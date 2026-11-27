<template>
  <main class="encounter-experience-detail">
    <section class="hero" id="hero">
      <div class="hero-img" style="background-image:url('/images/encounters/wellness/dental/consultation.webp');"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-crumb">
          <a href="/encounters">Encounters</a>
          <span class="sep">/</span>
          <a href="/encounters#beijing">Beijing</a>
          <span class="sep">/</span>
          <span>{{ productName }}</span>
        </div>
        <div class="hero-eyebrow">Signature Dental Visit · Beijing</div>
        <h1>Top-Tier Dental Care,<br />Without the <span class="italic">London Price</span></h1>
        <p class="hero-hook">"$200 in London. {{ basePriceText }} in Beijing. Same standard of cleaning."</p>
        <div class="hero-meta">
          <div class="hero-meta-item">⏱ <b>45 min</b> total</div>
          <div class="hero-meta-item">🏥 <b>Top-tier dental clinic</b></div>
          <div class="hero-meta-item">🗣 <b>English</b> throughout</div>
          <div class="hero-meta-item">📄 <b>X-ray + report</b> same day</div>
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
        <div v-if="londonSavings > 0" class="note">Save {{ londonSavings }}% vs London pricing</div>
        <div class="compare-mini">$200 in London</div>
      </div>
    </section>

    <div class="strip">
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/dental/cleaning.webp');"><div class="strip-label">Professional Cleaning · 专业清洁</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/dental/teeth-model.webp');"><div class="strip-label">Digital X-ray · 数字化X光</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/dental/consultation.webp');"><div class="strip-label">English Consultation · 英语咨询</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/dental/clinic.webp');"><div class="strip-label">Same-day Report · 当天报告</div></div>
    </div>

    <div class="section" style="padding-top:48px;padding-bottom:0;">
      <div class="hook-block">
        <div class="quote">"Same cleaning, same standard — <span class="accent">$200 at home</span>, <span class="accent">$53 here</span>."</div>
        <div class="attribution">— <span class="name">James W.</span>, London · Dental Cleaning + Checkup, Beijing · Oct 2025</div>
      </div>
    </div>

    <section class="section" id="therapy">
      <div class="section-head center">
        <div class="eyebrow">What Happens</div>
        <h2 class="section-title">Three steps. <span class="italic">One visit.</span></h2>
        <p class="section-sub">A complete dental visit in 45 minutes — professional cleaning, digital X-ray, and a clear consultation in English. You leave with your X-ray and a written report on your phone.</p>
      </div>
      <div class="card-grid">
            <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/dental/cleaning.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">01 · Cleaning</div>
            <h3>Professional Cleaning</h3>
            <div class="svc-cn">洁牙 · Jié Yá</div>
            <p>Ultrasonic scaling removes plaque and tartar, followed by polishing. About 20 minutes — comfortable, thorough, and noticeably smoother afterwards.</p>
            <p class="svc-hook">"My teeth felt cleaner than after any visit back home."</p>
            <span class="svc-tag">20 min · scaling + polishing</span>
          </div>
        </div>
            <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/dental/teeth-model.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">02 · Imaging</div>
            <h3>Digital X-ray</h3>
            <div class="svc-cn">全景X光 · Pàn piàn</div>
            <p>A panoramic X-ray taken on site, ready in minutes. The dentist walks you through every detail in English — no guesswork.</p>
            <p class="svc-hook">"They showed me the X-ray and explained every shadow."</p>
            <span class="svc-tag">Panoramic · same-day results</span>
          </div>
        </div>
            <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/dental/consultation.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">03 · Consultation</div>
            <h3>English Consultation</h3>
            <div class="svc-cn">口腔咨询 · Zī xún</div>
            <p>A clear, unhurried explanation of your results and a simple home-care plan. No pressure, no upselling — just answers.</p>
            <p class="svc-hook">"No upsell — just a straight answer."</p>
            <span class="svc-tag">15 min · no upsell</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section alt">
      <div class="section alt-inner" id="timeline">
        <div class="section-head">
          <div class="eyebrow">Your Visit</div>
          <h2 class="section-title">45 minutes, <span class="italic">start to finish</span></h2>
        </div>
        <div class="tl-wrap">
          <div class="tl-aside">
            <h3>Everything in one visit</h3>
            <p>From check-in to X-ray and report on your phone — under 45 minutes. Pre-booked, no waiting.</p>
            <div class="tl-note"><b>Good to know:</b> Eat normally before your visit. Brushing first is helpful. The X-ray is low-dose and safe. You can fly the same day.</div>
          </div>
          <div class="timeline">
            <div class="tl-item">
              <div class="tl-time">10:00 · Arrival</div>
              <div class="tl-title">Meet your LVYV guide at the clinic</div>
              <div class="tl-desc">English-speaking coordinator at the entrance. Pre-registered — no queue. <span class="cn">诊所入口集合 · 预先登记</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">10:05 · X-ray</div>
              <div class="tl-title">Panoramic digital X-ray</div>
              <div class="tl-desc">Images ready in minutes. The dentist explains what you're seeing — in English. <span class="cn">全景数字化X光 · 几分钟出片 · 英语讲解</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">10:20 · Cleaning</div>
              <div class="tl-title">Ultrasonic scaling + polishing</div>
              <div class="tl-desc">20 minutes, gentle and thorough. Plaque and tartar removed, then polished smooth. <span class="cn">超声波洁牙 + 抛光 · 约20分钟</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">10:40 · Consultation & Report</div>
              <div class="tl-title">English report + X-ray copy</div>
              <div class="tl-desc">Written findings, home-care tips, and a digital copy of your X-ray sent straight to your phone. <span class="cn">英文报告 · 护理建议 · X光片电子版</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section alt" id="compare">
      <div class="section alt-inner">
        <div class="section-head center">
          <div class="eyebrow">Price Comparison</div>
          <h2 class="section-title">Same clean. <span class="italic">Different city.</span></h2>
          <p class="section-sub">Verified 2025 pricing for a complete dental cleaning and checkup.</p>
        </div>
        <div class="cmp-wrap">
          <div class="cmp-head">
            <h3>Dental Cleaning + Checkup Pricing</h3>
            <span v-if="londonSavings > 0" class="badge">Save {{ londonSavings }}%</span>
          </div>
          <div class="cmp-labels"><span>Treatment</span><span>Typical London price</span><span>LVYV Beijing</span></div>
          <div class="cmp-body">
            <div class="cmp-row">
              <div class="label">Professional Cleaning<span>Scaling + polishing · 20 min</span></div>
              <div class="away">$100</div>
              <div class="here">$28</div>
            </div>
            <div class="cmp-row">
              <div class="label">Digital X-ray<span>Panoramic · same-day results</span></div>
              <div class="away">$60</div>
              <div class="here">$15</div>
            </div>
            <div class="cmp-row">
              <div class="label">Consultation<span>English · no upsell</span></div>
              <div class="away">$40</div>
              <div class="here">$10</div>
            </div>
            <div class="cmp-row total">
              <div class="label">Total Session<span>Everything above · 45 min</span></div>
              <div class="away">$200</div>
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
            <li><b>Professional cleaning</b> by licensed dentist</li>
            <li><b>Panoramic digital X-ray</b></li>
            <li><b>English-speaking dentist & coordinator</b></li>
            <li><b>Written report + X-ray copy</b> on your phone</li>
            <li><b>Pre-booked appointment</b> — no queue</li>
            <li><b>7-day aftercare</b> via WhatsApp</li>
            <li><b>Clinic registration</b> pre-arranged</li>
          </ul>
        </div>
        <div class="inc-card no">
          <div class="inc-title"><span class="badge">✗</span> Not Included</div>
          <ul class="inc-list">
            <li>Flights and visas (240-hour transit visa-free available)</li>
            <li>Hotel accommodation (partner hotels nearby)</li>
            <li>Fillings, crowns or other restorative work</li>
            <li>Prescription medication</li>
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
      description="45 min · Beijing · Top-tier dental clinic · English-speaking staff"
      bundle-label="Dental"
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
                <div class="faq-a">Scaling can cause brief sensitivity; <b>polishing is painless</b>. Most visitors say it was gentler than expected. <b>Your dentist checks in throughout.</b></div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 1 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 1" @click="toggleFaq(1)"><span class="n">02</span> Do I need to speak Chinese? <span class="toggle">+</span></button>
                <div class="faq-a">No. Your <b>English-speaking dentist and LVYV coordinator</b> explain everything, and your report is in English.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 2 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 2" @click="toggleFaq(2)"><span class="n">03</span> Is this a real top-tier clinic? <span class="toggle">+</span></button>
                <div class="faq-a">Yes. We partner with one of <b>Beijing's top dental clinics</b>. The dentists are licensed practitioners with an international department.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 3 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 3" @click="toggleFaq(3)"><span class="n">04</span> Can I use the X-ray and report back home? <span class="toggle">+</span></button>
                <div class="faq-a">Yes. You get a <b>digital English copy</b> on your phone to share with your own dentist.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 4 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 4" @click="toggleFaq(4)"><span class="n">05</span> Can I skip the X-ray? <span class="toggle">+</span></button>
                <div class="faq-a">Absolutely — <b>cleaning and consultation only is $38</b>. The X-ray is low-dose and recommended for a full picture.</div>
              </div>
            </div>
          </div>
        </section>

        <section class="cta-band" id="book">
          <div class="cta-inner">
            <div class="eyebrow">Ready?</div>
            <h2>A cleaner smile. <span class="italic">A far smaller bill.</span></h2>
            <p>{{ basePriceText }} · 45-min dental visit · Top-tier Beijing clinic · English-speaking staff · Same-day X-ray &amp; report</p>
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

const product = encounterProducts.find(item => item.code === 'ENC-BJ-DENTAL-CLEANING')!
const { productName, sku, status, refresh } = await useEncounterProduct(product, {
  title: 'Dental Cleaning + Checkup in Beijing — $53 vs $200 in London | LVYV Encounters',
  description: 'Professional cleaning, digital X-ray and consultation at a top-tier Beijing dental clinic. English-speaking staff. $53, 74% less than London. Same standard of care.',
  hero: 'dental/consultation',
})
const booking = useTemplateRef('booking')

const activeFaq = ref<number | null>(0)
function toggleFaq(index: number) {
  activeFaq.value = activeFaq.value === index ? null : index
}

const basePrice = computed(() => sku.value?.price ?? 53)
const basePriceText = computed(() => encounterPrice(basePrice.value))
const londonSavings = computed(() => Math.ceil((1 - basePrice.value / 200) * 100))
</script>

<style src="~/assets/css/encounter-experience.css"></style>
