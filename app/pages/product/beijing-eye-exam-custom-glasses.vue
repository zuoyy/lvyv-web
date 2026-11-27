<template>
  <main class="encounter-experience-detail">
    <section class="hero" id="hero">
      <div class="hero-img" style="background-image:url('/images/encounters/wellness/detail/eye-exam.webp');"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-crumb">
          <a href="/encounters">Encounters</a>
          <span class="sep">/</span>
          <a href="/encounters#beijing">Beijing</a>
          <span class="sep">/</span>
          <span>{{ productName }}</span>
        </div>
        <div class="hero-eyebrow">Light Medical Encounter · Beijing</div>
        <h1>Three Pairs For Less<br />Than One <span class="italic">Back Home</span></h1>
        <p class="hero-hook">"Full optometry, lens fitting, and glasses ready same-day by afternoon."</p>
        <div class="hero-meta">
          <div class="hero-meta-item">⏱ <b>Half day</b> total</div>
          <div class="hero-meta-item">🏥 <b>Optical center</b></div>
          <div class="hero-meta-item">🗣 <b>English</b> throughout</div>
          <div class="hero-meta-item">👓 <b>Same-day pickup</b></div>
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
        <div class="compare-mini">$300+ in the US</div>
      </div>
    </section>

    <div class="strip">
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/detail/eye-exam.webp');"><div class="strip-label">Full Eye Exam · 全面验光</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/detail/custom-glasses.webp');"><div class="strip-label">Frame Selection · 镜框挑选</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/detail/same-day-pickup.webp');"><div class="strip-label">Lens Fitting · 镜片装配</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/detail/custom-glasses.webp');"><div class="strip-label">Extra Pairs · 加配多副</div></div>
    </div>

    <div class="section" style="padding-top:48px;padding-bottom:0;">
      <div class="hook-block">
        <div class="quote">"<span class="accent">Bought 3 pairs</span> for less than <span class="accent">1 at home</span> — and had them before dinner."</div>
        <div class="attribution">— <span class="name">Emily T.</span>, London · Eye Exam + Custom Glasses, Beijing · Oct 2025</div>
      </div>
    </div>

    <section class="section" id="therapy">
      <div class="section-head center">
        <div class="eyebrow">What Happens</div>
        <h2 class="section-title">Three steps. <span class="italic">One afternoon.</span></h2>
        <p class="section-sub">A complete eye visit in half a day — full optometry, frame and lens selection, and same-day pickup. You leave seeing clearly with an English prescription in your pocket.</p>
      </div>
      <div class="card-grid">
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/detail/eye-exam.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">01 · Exam</div>
            <h3>Full Optometry Exam</h3>
            <div class="svc-cn">全面验光 · Yàn Guāng</div>
            <p>Refraction, eye-pressure check and retinal screening. The optometrist explains every number in English and recommends the right lenses for your routine.</p>
            <p class="svc-hook">"She caught a change my GP had missed."</p>
            <span class="svc-tag">20 min · English prescription</span>
          </div>
        </div>
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/detail/custom-glasses.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">02 · Selection</div>
            <h3>Frame &amp; Lens Selection</h3>
            <div class="svc-cn">镜框选配 · Jìng Kuàng</div>
            <p>Hundreds of frames — understated or bold. Anti-glare, blue-light and progressive lenses cost a fraction of what you'd pay back home.</p>
            <p class="svc-hook">"Three pairs for the price of one at home."</p>
            <span class="svc-tag">200+ frames · extra pairs from $9</span>
          </div>
        </div>
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/detail/same-day-pickup.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">03 · Pickup</div>
            <h3>Same-Day Glasses</h3>
            <div class="svc-cn">当天取镜 · Qǔ Jìng</div>
            <p>Lenses are cut and fitted on site. Collect your glasses by afternoon — no second trip, no shipping home, no waiting weeks.</p>
            <p class="svc-hook">"Ready before I'd finished my coffee."</p>
            <span class="svc-tag">Ready in 3–4 hours</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section alt">
      <div class="section alt-inner" id="timeline">
        <div class="section-head">
          <div class="eyebrow">Your Visit</div>
          <h2 class="section-title">Half a day, <span class="italic">start to finish</span></h2>
        </div>
        <div class="tl-wrap">
          <div class="tl-aside">
            <h3>Everything in one visit</h3>
            <p>From the eye test to collecting your glasses — about half a day, pre-booked with no waiting around.</p>
            <div class="tl-note"><b>Good to know:</b> Bring your current glasses or prescription if you have them. Contact-lens wearers should take a short break before the exam. Your new prescription and receipt are emailed to you in English.</div>
          </div>
          <div class="timeline">
            <div class="tl-item">
              <div class="tl-time">10:00 · Arrival</div>
              <div class="tl-title">Meet your LVYV guide at the optical center</div>
              <div class="tl-desc">English-speaking coordinator at the entrance. Appointment pre-booked — no queue. <span class="cn">眼镜中心入口集合 · 预先预约</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">10:15 · Exam</div>
              <div class="tl-title">Full optometry, in English</div>
              <div class="tl-desc">Refraction, eye pressure and retinal screening. The optometrist explains your prescription as they go. <span class="cn">验光 · 眼压 · 眼底检查 · 英语讲解</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">10:45 · Frames & Lenses</div>
              <div class="tl-title">Choose your frame and lens package</div>
              <div class="tl-desc">Try 200+ frames. Anti-glare, blue-light and progressives available — extra pairs from just $9. <span class="cn">镜框挑选 · 镜片配置 · 加配每副$9起</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">14:30 · Pickup</div>
              <div class="tl-title">Glasses ready + English prescription</div>
              <div class="tl-desc">Collect your fitted glasses in the afternoon, with a digital English prescription and receipt sent to your phone. <span class="cn">当天取镜 · 英文处方与收据电子版</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section alt" id="compare">
      <div class="section alt-inner">
        <div class="section-head center">
          <div class="eyebrow">Price Comparison</div>
          <h2 class="section-title">Same prescription. <span class="italic">Different planet.</span></h2>
          <p class="section-sub">Typical US pricing for an eye exam plus one pair of prescription glasses.</p>
        </div>
        <div class="cmp-wrap">
          <div class="cmp-head">
            <h3>Eye Exam + Glasses Pricing</h3>
            <span v-if="savingsPercent > 0" class="badge">Save {{ savingsPercent }}%</span>
          </div>
          <div class="cmp-labels"><span>Treatment</span><span>Typical US price</span><span>LVYV Beijing</span></div>
          <div class="cmp-body">
            <div class="cmp-row">
              <div class="label">Full Optometry Exam<span>Refraction · pressure · retinal</span></div>
              <div class="away">$150</div>
              <div class="here">$16</div>
            </div>
            <div class="cmp-row">
              <div class="label">Frame + Prescription Lenses<span>200+ frames · anti-glare options</span></div>
              <div class="away">$120</div>
              <div class="here">$10</div>
            </div>
            <div class="cmp-row">
              <div class="label">Lens Fitting &amp; Adjustments<span>Cut, fitted and checked on site</span></div>
              <div class="away">$30+</div>
              <div class="here">$2</div>
            </div>
            <div class="cmp-row total">
              <div class="label">Total Visit<span>Exam + 1 pair of glasses · half day</span></div>
              <div class="away">$300+</div>
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
            <li><b>Full optometry exam</b> by a licensed optometrist</li>
            <li><b>Eye-pressure and retinal screening</b></li>
            <li><b>1 pair of prescription lenses</b> + frame from the core collection</li>
            <li><b>On-site lens cutting, fitting and adjustments</b></li>
            <li><b>English prescription &amp; written report</b> on your phone</li>
            <li><b>English-speaking LVYV guide</b> throughout</li>
            <li><b>Same-day pickup</b> by afternoon</li>
          </ul>
        </div>
        <div class="inc-card no">
          <div class="inc-title"><span class="badge">✗</span> Not Included</div>
          <ul class="inc-list">
            <li>Premium / designer frames (upgrade from $12)</li>
            <li>Progressive, bifocal or specialty coatings (from $9)</li>
            <li>Extra pairs (from $9 each — 3 pairs for less than 1 at home)</li>
            <li>Contact-lens fitting or eye medication</li>
            <li>Flights, hotels and personal travel insurance</li>
          </ul>
        </div>
      </div>
    </section>

    <EncounterExperienceAddOns
      :product-code="product.code"
      :base-sku-code="sku?.skuCode"
      :base-price="basePrice"
      :base-title="productName"
      description="Half day · Beijing · Optical center · English optometrist · Same-day pickup"
      bundle-label="Eye Exam"
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
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 0" @click="toggleFaq(0)"><span class="n">01</span> Is the eye exam uncomfortable? <span class="toggle">+</span></button>
                <div class="faq-a">Not at all. The tests are <b>non-contact</b> apart from a brief puff of air for eye pressure. The optometrist explains each step in English before they do it.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 1 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 1" @click="toggleFaq(1)"><span class="n">02</span> Can I really get glasses the same day? <span class="toggle">+</span></button>
                <div class="faq-a">Yes for single-vision lenses — cut and fitted on site, usually <b>ready in 3–4 hours</b>. Premium progressives may take a little longer; we'll tell you at the exam.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 2 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 2" @click="toggleFaq(2)"><span class="n">03</span> Are the frames good quality? <span class="toggle">+</span></button>
                <div class="faq-a">There are <b>200+ frames</b> to choose from, including acetate and titanium styles. The {{ basePriceText }} price includes a frame from the core collection; designer frames start at $12 extra.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 3 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 3" @click="toggleFaq(3)"><span class="n">04</span> Will my prescription work back home? <span class="toggle">+</span></button>
                <div class="faq-a">Yes. You receive a <b>digital English prescription</b> and a written report on your phone — formatted to share with your own optician.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 4 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 4" @click="toggleFaq(4)"><span class="n">05</span> How many pairs are included? <span class="toggle">+</span></button>
                <div class="faq-a">One pair is included. <b>Extra pairs start at $9</b> — which is why visitors often buy three pairs for less than one costs at home.</div>
              </div>
            </div>
          </div>
        </section>

        <section class="cta-band" id="book">
          <div class="cta-inner">
            <div class="eyebrow">Ready?</div>
            <h2>See clearly. <span class="italic">Pay a fraction.</span></h2>
            <p>{{ basePriceText }} · half-day eye exam + glasses · Beijing optical center · English optometrist · Same-day pickup</p>
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

const product = encounterProducts.find(item => item.code === 'ENC-BJ-EYE-EXAM-CUSTOM-GLASSES')!
const { productName, sku, status, refresh } = await useEncounterProduct(product, {
  title: "Eye Exam + Custom Glasses in Beijing — $28 vs $300+ in the US | LVYV Encounters",
  description: "Full optometry exam, lens fitting and frame selection at a Beijing optical center. Glasses ready the same afternoon. $28 — 90% less than US pricing.",
})
const booking = useTemplateRef('booking')

const activeFaq = ref<number | null>(0)
function toggleFaq(index: number) {
  activeFaq.value = activeFaq.value === index ? null : index
}

const originalPrice = 28
const basePrice = computed(() => sku.value?.price ?? originalPrice)
const basePriceText = computed(() => encounterPrice(basePrice.value))
const savingsPercent = computed(() => basePrice.value === originalPrice
  ? 90
  : Math.round((1 - basePrice.value / 300) * 100))
</script>

<style src="~/assets/css/encounter-experience.css"></style>
