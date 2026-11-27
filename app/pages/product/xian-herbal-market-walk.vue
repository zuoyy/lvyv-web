<template>
  <main class="encounter-experience-detail">
    <section class="hero" id="hero">
      <div class="hero-img" style="background-image:url('/images/encounters/wellness/xian-experiences/herbal/apothecary.webp');"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-crumb">
          <a href="/encounters">Encounters</a>
          <span class="sep">/</span>
          <a href="/encounters#xian">Xi'an</a>
          <span class="sep">/</span>
          <span>{{ productName }}</span>
        </div>
        <div class="hero-eyebrow">Herbal Encounter · Xi'an</div>
        <h1>Diagon Alley,<br /><span class="italic">But Real</span></h1>
        <p class="hero-hook">"It's like Diagon Alley. But it's been real for 2,000 years."</p>
        <div class="hero-meta">
          <div class="hero-meta-item">⏱ <b>2h</b> guided walk</div>
          <div class="hero-meta-item">🌿 <b>50+ medicinal herbs</b></div>
          <div class="hero-meta-item">👃 <b>See, smell, touch</b></div>
          <div class="hero-meta-item">🗣 <b>English</b> guide</div>
        </div>
        <div class="hero-btns">
          <a href="#book" class="btn-book">Book This Encounter →</a>
          <a href="#compare" class="btn-ghost">See What's Included</a>
        </div>
      </div>
      <div class="hero-price-card">
        <div class="from">guided walk</div>
        <div class="num">{{ basePriceText }}</div>
        <div class="per">/ person</div>
        <div class="note">In Apothecary · Xi'an</div>
        <div class="compare-mini">N/A abroad — unique to Xi'an</div>
      </div>
    </section>

    <div class="strip">
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/xian-experiences/herbal/apothecary.webp');"><div class="strip-label">The Apothecary · 药铺</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/xian-experiences/herbal/market-stalls.webp');"><div class="strip-label">The Market Stalls · 药材摊</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/xian-experiences/herbal/herb-varieties.webp');"><div class="strip-label">50+ Herbs · 百草</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/xian-experiences/herbal/decoction.webp');"><div class="strip-label">Decoction · 煎药</div></div>
    </div>

    <div class="section" style="padding-top:48px;padding-bottom:0;">
      <div class="hook-block">
        <div class="quote">"<span class="accent">It's like Diagon Alley.</span> But it's been real for <span class="accent">2,000 years.</span>"</div>
        <div class="attribution">— <span class="name">Chloe B.</span>, London · Herbal Medicine Market Walk, Xi'an · Oct 2025</div>
      </div>
    </div>

    <section class="section" id="therapy">
      <div class="section-head center">
        <div class="eyebrow">What Happens</div>
        <h2 class="section-title">Aisles of herbs, <span class="italic">2,000 years deep</span>.</h2>
        <p class="section-sub">Two hours inside Xi'an's traditional medicine market — walking the stalls with an English-speaking guide, learning to recognise, smell and understand more than 50 medicinal herbs, and seeing how they become medicine.</p>
      </div>
      <div class="card-grid">
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/xian-experiences/herbal/market-stalls.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">01 · The Market</div>
            <h3>Walk the Working Stalls</h3>
            <div class="svc-cn">药材市场 · Yào Cái Shì Chǎng</div>
            <p>This is a real market, not a museum display. Sellers weigh roots and seeds on brass scales, buyers bargain in dialect, and the air carries a hundred different scents at once. Your guide translates it all.</p>
            <p class="svc-hook">"People were buying breakfast cures next to cancer remedies. This place is alive."</p>
            <span class="svc-tag">Working market · locals shopping</span>
          </div>
        </div>
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/xian-experiences/herbal/herb-varieties.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">02 · The Herbs</div>
            <h3>50+ Herbs, Up Close</h3>
            <div class="svc-cn">百草辨识 · Bǎi Cǎo</div>
            <p>Ginseng, astragalus, goji, angelica, chrysanthemum — your guide lays out dozens of herbs for you to see, touch, smell and taste. Learn which part is used, what it's for, and how to spot the real thing.</p>
            <p class="svc-hook">"I finally know what's in the tea I've been drinking for years."</p>
            <span class="svc-tag">50+ herbs · see, smell, touch</span>
          </div>
        </div>
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/xian-experiences/herbal/decoction.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">03 · The Remedy</div>
            <h3>From Herb to Decoction</h3>
            <div class="svc-cn">草药煎煮 · Jiān Zhǔ</div>
            <p>Visit an apothecary counter with its wall of wooden drawers, watch herbs being weighed on a traditional scale, and learn how a decoction is prepared. Take home a small herb box and an English identification guide.</p>
            <p class="svc-hook">"I came for a walk and left with a box of herbs I can actually name."</p>
            <span class="svc-tag">Apothecary visit · take-home herb box</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section alt">
      <div class="section alt-inner" id="timeline">
        <div class="section-head">
          <div class="eyebrow">Your Walk</div>
          <h2 class="section-title">Two hours, <span class="italic">stall by stall</span></h2>
        </div>
        <div class="tl-wrap">
          <div class="tl-aside">
            <h3>A market that's still alive</h3>
            <p>A small-group walk through Xi'an's traditional medicine district with an English-speaking guide. No knowledge of Chinese medicine needed — your guide explains everything as you go.</p>
            <div class="tl-note"><b>Good to know:</b> Wear comfortable shoes — you'll be on your feet. Bring a camera; the stalls are photogenic. Smelling and touching herbs is encouraged; tell your guide about any allergies before you taste anything.</div>
          </div>
          <div class="timeline">
            <div class="tl-item">
              <div class="tl-time">10:00 · Meeting</div>
              <div class="tl-title">Meet your guide at the market gate</div>
              <div class="tl-desc">Your English-speaking guide meets you at the entrance of the medicine market. A brief introduction to what you're about to see and smell. <span class="cn">药材市场门口集合 · 英语导游</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">10:15 · The Stalls</div>
              <div class="tl-title">Walk the working aisles</div>
              <div class="tl-desc">We move stall by stall as locals shop around us. Watch herbs being weighed on brass scales and hear how each stall has served the neighbourhood for decades. <span class="cn">药材摊位 · 铜秤称重 · 本地人采购</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">10:50 · The Herbs</div>
              <div class="tl-title">50+ herbs, laid out for you</div>
              <div class="tl-desc">Roots, flowers, seeds and slices — your guide spreads out dozens of herbs to see, touch, smell and taste, explaining what each one is used for. <span class="cn">50多种药材 · 看 · 摸 · 闻 · 尝</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">11:30 · The Apothecary</div>
              <div class="tl-title">Wooden drawers and a take-home box</div>
              <div class="tl-desc">Step behind the counter of a traditional apothecary, see the wall of herb drawers and a decoction being prepared. Leave with a small herb box and an English guide. <span class="cn">药铺柜台 · 百子柜 · 煎药 · 草药礼盒带走</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section alt" id="compare">
      <div class="section alt-inner">
        <div class="section-head center">
          <div class="eyebrow">What It Costs</div>
          <h2 class="section-title">You can't find this <span class="italic">back home</span>.</h2>
          <p class="section-sub">There's no overseas price to compare — a working 2,000-year-old medicine market simply doesn't exist outside China. Here's what your {{ basePriceText }} covers.</p>
        </div>
        <div class="cmp-wrap">
          <div class="cmp-head">
            <h3>Herbal Medicine Market Walk — Value Breakdown</h3>
            <span class="badge">Only in Xi'an</span>
          </div>
          <div class="cmp-labels"><span>Experience</span><span>Available abroad</span><span>LVYV Xi'an</span></div>
          <div class="cmp-body">
            <div class="cmp-row">
              <div class="label">2-Hour Guided Market Walk<span>Small group · English-speaking guide</span></div>
              <div class="away">N/A</div>
              <div class="here">included</div>
            </div>
            <div class="cmp-row">
              <div class="label">50+ Herbs, Up Close<span>See, touch, smell and taste</span></div>
              <div class="away">N/A</div>
              <div class="here">included</div>
            </div>
            <div class="cmp-row">
              <div class="label">Apothecary Visit &amp; Take-Home Herb Box<span>English identification guide</span></div>
              <div class="away">N/A</div>
              <div class="here">included</div>
            </div>
            <div class="cmp-row total">
              <div class="label">Total Walk<span>Everything above · 2 hours</span></div>
              <div class="away">N/A</div>
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
            <li><b>2-hour guided walk</b> through the traditional medicine market</li>
            <li><b>English-speaking guide</b> translating and explaining throughout</li>
            <li><b>50+ medicinal herbs</b> to see, touch, smell and taste</li>
            <li><b>Traditional apothecary visit</b> — wooden drawers and brass scales</li>
            <li><b>Decoction demonstration</b> explaining how herbs become medicine</li>
            <li><b>Take-home herb box</b> and English identification guide</li>
            <li><b>Small group</b> — no crowds, room to ask questions</li>
          </ul>
        </div>
        <div class="inc-card no">
          <div class="inc-title"><span class="badge">✗</span> Not Included</div>
          <ul class="inc-list">
            <li>Herbs or remedies purchased at the market (optional)</li>
            <li>TCM doctor consultation or prescription (available from $15)</li>
            <li>Hotel pickup and drop-off (available from $20)</li>
            <li>Meals and drinks beyond the tasting during the walk</li>
            <li>Flights, hotels and personal travel insurance</li>
          </ul>
        </div>
      </div>
    </section>



    <EncounterExperienceAddOns
      :product-code="product.code"
      city-code="xian"
      :base-sku-code="sku?.skuCode"
      :base-price="sku?.price ?? null"
      :reference-price="originalPrice"
      :base-title="productName"
      description="2h · Xi'an · English guide · 50+ herbs · Apothecary visit · Herb box included"
      bundle-label="Herbal Market Walk"
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
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 0" @click="toggleFaq(0)"><span class="n">01</span> Do I need to know Chinese medicine? <span class="toggle">+</span></button>
                <div class="faq-a">Not at all. Your guide starts from zero — <b>explaining each herb, its name, its use and how to recognise it</b>. Most guests know nothing about Chinese medicine when they arrive; that's exactly why the walk exists.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 1 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 1" @click="toggleFaq(1)"><span class="n">02</span> Is it a real market or a tourist setup? <span class="toggle">+</span></button>
                <div class="faq-a">It's completely real. <b>Locals shop here for their own medicine</b>, sellers weigh herbs on brass scales, and many stalls have been run by the same families for generations. You're a guest in a working market, not a showroom.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 2 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 2" @click="toggleFaq(2)"><span class="n">03</span> Can I buy herbs during the walk? <span class="toggle">+</span></button>
                <div class="faq-a">Yes. Your guide helps you <b>ask questions and negotiate in Chinese</b>, and explains which stalls are known for quality. Purchases are optional and paid directly to the seller — nothing is marked up.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 3 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 3" @click="toggleFaq(3)"><span class="n">04</span> Is it safe to taste the herbs? <span class="toggle">+</span></button>
                <div class="faq-a">The tasting covers <b>common food-grade herbs</b> like goji, chrysanthemum and dates. Tell your guide about any allergies before the walk and you'll simply skip anything you're unsure about. Smelling and touching are always safe.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 4 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 4" @click="toggleFaq(4)"><span class="n">05</span> Is this in Beijing or Xi'an? <span class="toggle">+</span></button>
                <div class="faq-a">This walk is in <b>Xi'an</b>, the ancient capital and the historic heart of Chinese medicine trade. If you're in Beijing, ask us about the TCM hospital encounter and the apothecary add-ons available on the Beijing pages.</div>
              </div>
            </div>
          </div>
        </section>

        <section class="cta-band" id="book">
          <div class="cta-inner">
            <div class="eyebrow">Ready?</div>
            <h2>Follow your nose. <span class="italic">Into history.</span></h2>
            <p>{{ basePriceText }} · 2h guided market walk · Xi'an · 50+ medicinal herbs · English guide · Apothecary visit · Herb box to take home</p>
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

const product = encounterProducts.find(item => item.code === 'ENC-XA-HERBAL-MARKET-WALK')!
const { productName, sku, status, refresh } = await useEncounterProduct(product, {
  title: "Herbal Medicine Market Walk in Xi'an — $25 Guided Walk | LVYV Encounters",
  description: "A guided walk through Xi'an's traditional medicine market. See, smell and learn about 50+ medicinal herbs with an English-speaking guide. $25 for 2 hours — an experience with no overseas equivalent.",
})
const booking = useTemplateRef('booking')

const activeFaq = ref<number | null>(0)
function toggleFaq(index: number) {
  activeFaq.value = activeFaq.value === index ? null : index
}

const originalPrice = 25
const basePrice = computed(() => sku.value?.price ?? originalPrice)
const basePriceText = computed(() => encounterPrice(basePrice.value))
</script>

<style src="~/assets/css/encounter-experience.css"></style>
