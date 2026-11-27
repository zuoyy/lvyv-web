<template>
  <main class="encounter-experience-detail">
    <section class="hero" id="hero">
      <div class="hero-img" style="background-image:url('/images/encounters/wellness/xian-experiences/moxibustion/moxa-closeup.webp');"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-crumb">
          <a href="/encounters">Encounters</a>
          <span class="sep">/</span>
          <a href="/encounters#xian">Xi'an</a>
          <span class="sep">/</span>
          <span>{{ productName }}</span>
        </div>
        <div class="hero-eyebrow">TCM · Moxibustion</div>
        <h1>Burning Mugwort.<br /><span class="italic">On Ginger.</span></h1>
        <p class="hero-hook">"Burning mugwort on ginger. Sounds crazy. Works."</p>
        <div class="hero-meta">
          <div class="hero-meta-item">⏱ <b>1h</b> session</div>
          <div class="hero-meta-item">🌿 <b>Aged mugwort</b> + fresh ginger</div>
          <div class="hero-meta-item">❄️ For <b>chronic pain &amp; cold</b></div>
          <div class="hero-meta-item">🗣 <b>English</b>-speaking</div>
        </div>
        <div class="hero-btns">
          <a href="#book" class="btn-book">Book This Encounter →</a>
          <a href="#compare" class="btn-ghost">See What's Included</a>
        </div>
      </div>
      <div class="hero-price-card">
        <div class="from">1-hour session</div>
        <div class="num">{{ basePriceText }}</div>
        <div class="per">/ person</div>
        <div v-if="savingsPercent > 0" class="note">Save {{ savingsPercent }}% · all-inclusive</div>
        <div class="compare-mini">$95 US</div>
      </div>
    </section>

    <div class="strip">
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/xian-experiences/moxibustion/dried-mugwort.webp');"><div class="strip-label">Aged Mugwort · 艾绒</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/xian-experiences/moxibustion/moxa-cup.webp');"><div class="strip-label">Handheld Moxa · 艾罐</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/xian-experiences/moxibustion/moxa-on-skin.webp');"><div class="strip-label">On Skin · 直接灸</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/xian-experiences/moxibustion/moxa-box-lamp.webp');"><div class="strip-label">Warmth + Lamp · 温灸</div></div>
    </div>

    <div class="section" style="padding-top:48px;padding-bottom:0;">
      <div class="hook-block">
        <div class="quote">"<span class="accent">Burning mugwort on ginger.</span> Sounds crazy. <span class="accent">Works.</span>"</div>
        <div class="attribution">— <span class="name">A LVYV guest</span>, Xi'an · Direct Moxibustion</div>
      </div>
    </div>

    <section class="section" id="therapy">
      <div class="section-head center">
        <div class="eyebrow">What Happens</div>
        <h2 class="section-title">Fire, ginger, <span class="italic">and relief</span>.</h2>
        <p class="section-sub">Traditional Xi'an-style direct moxibustion: aged mugwort burned on a fresh slice of ginger, placed on the areas that ache or feel cold. One quiet hour, an English-speaking practitioner, and heat that goes deeper than you expect.</p>
      </div>
      <div class="card-grid">
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/xian-experiences/moxibustion/dried-mugwort.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">01 · The Herb</div>
            <h3>Aged Mugwort, Sorted by Hand</h3>
            <div class="svc-cn">陈年艾绒 · Chén Nián Ài Róng</div>
            <p>Only the soft, aged mugwort fibre is used — the leaves are dried, stored and rubbed down until they burn slowly and evenly. You can smell the difference the moment the session starts.</p>
            <p class="svc-hook">"It smells like warm earth and old paper — not like a smoke shop."</p>
            <span class="svc-tag">Aged mugwort · slow, even burn</span>
          </div>
        </div>
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/xian-experiences/moxibustion/moxa-on-skin.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">02 · The Method</div>
            <h3>Ginger Slice, Direct Heat</h3>
            <div class="svc-cn">隔姜灸 · Gé Jiāng Jiǔ</div>
            <p>A fresh slice of ginger goes on the skin, and a small cone of mugwort is lit on top. The ginger protects the skin while carrying the warmth down. Your practitioner checks the heat with you constantly.</p>
            <p class="svc-hook">"Burning mugwort on ginger. Sounds crazy. Works."</p>
            <span class="svc-tag">Xi'an-style · heat on demand</span>
          </div>
        </div>
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/xian-experiences/moxibustion/herbal-compress.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">03 · The Finish</div>
            <h3>Warm Compress, Deep Relief</h3>
            <div class="svc-cn">艾草热敷 · Ài Cǎo Rè Fū</div>
            <p>We finish with a warm herbal compress over the treated area and a cup of tea. For chronic pain, cold hands and feet, or that heavy feeling that sits in the lower back, the heat keeps working long after you leave.</p>
            <p class="svc-hook">"My lower back stopped aching before the tea was even finished."</p>
            <span class="svc-tag">For chronic pain &amp; cold conditions</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section alt">
      <div class="section alt-inner" id="timeline">
        <div class="section-head">
          <div class="eyebrow">Your Session</div>
          <h2 class="section-title">One hour, <span class="italic">one slow burn</span></h2>
        </div>
        <div class="tl-wrap">
          <div class="tl-aside">
            <h3>Old technique, carefully done</h3>
            <p>Direct moxibustion comes from a long tradition of warming what is cold and moving what is stuck. Nothing is rushed: your practitioner checks the heat, checks your skin, and checks with you before adding more.</p>
            <div class="tl-note"><b>Good to know:</b> Wear loose clothing — we need access to the area being treated. There is a gentle herbal smell and a little smoke; the room is ventilated. Tell us about skin sensitivities or if you are pregnant before the session.</div>
          </div>
          <div class="timeline">
            <div class="tl-item">
              <div class="tl-time">00:00 · Consultation</div>
              <div class="tl-title">Where does it hurt? Where is it cold?</div>
              <div class="tl-desc">A short conversation about your pain, cold limbs, sleep and energy. Your practitioner explains exactly what will happen and where the heat will go. <span class="cn">问诊 · 哪里酸痛 · 哪里怕冷 · 英语沟通</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">00:10 · Preparation</div>
              <div class="tl-title">Mugwort is lit on fresh ginger</div>
              <div class="tl-desc">A thin slice of ginger is placed on the skin, then a small cone of aged mugwort is lit on top. The first cone is always gentle — we start low and go by how you feel. <span class="cn">鲜姜切片 · 艾炷点燃 · 循序渐进</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">00:20 · Direct Moxibustion</div>
              <div class="tl-title">Heat you can feel, controlled by you</div>
              <div class="tl-desc">Cone after cone, the warmth is carried through the ginger into the area. Too hot? Say so — the practitioner lifts it immediately. Most guests describe it as a deep, spreading warmth. <span class="cn">隔姜直接灸 · 热力渗透 · 随时可调</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">00:50 · Compress &amp; Tea</div>
              <div class="tl-title">Warm compress, then a quiet cup of tea</div>
              <div class="tl-desc">A warm herbal compress settles the area, followed by tea and a few practical notes on staying warm afterwards. You leave slowly — and usually warmer than you arrived. <span class="cn">艾草热敷 · 草本茶 · 避寒提醒</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section alt" id="compare">
      <div class="section alt-inner">
        <div class="section-head center">
          <div class="eyebrow">What It Costs</div>
          <h2 class="section-title">Same heat. <span class="italic">A third of the price</span>.</h2>
          <p class="section-sub">A comparable one-hour moxibustion session in the US costs around $95. Here it is {{ basePriceText }} — practitioner, ginger, mugwort and compress all included.</p>
        </div>
        <div class="cmp-wrap">
          <div class="cmp-head">
            <h3>Direct Moxibustion — Price Breakdown</h3>
            <span v-if="savingsPercent > 0" class="badge">Save {{ savingsPercent }}%</span>
          </div>
          <div class="cmp-labels"><span>Experience</span><span>Back Home</span><span>LVYV Xi'an</span></div>
          <div class="cmp-body">
            <div class="cmp-row">
              <div class="label">1-Hour Direct Moxibustion<span>Xi'an-style, English-speaking practitioner</span></div>
              <div class="away">$95</div>
              <div class="here">{{ basePriceText }}</div>
            </div>
            <div class="cmp-row">
              <div class="label">Fresh Ginger &amp; Aged Mugwort<span>Usually charged separately abroad</span></div>
              <div class="away">+$15</div>
              <div class="here">included</div>
            </div>
            <div class="cmp-row">
              <div class="label">Herbal Compress &amp; Tea<span>The finishing 10 minutes</span></div>
              <div class="away">+$8</div>
              <div class="here">included</div>
            </div>
            <div class="cmp-row total">
              <div class="label">Session Price You Pay<span>Everything above · 1 hour</span></div>
              <div class="away">$95</div>
              <div class="here">{{ basePriceText }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <div class="eyebrow">What's Included</div>
        <h2 class="section-title">One price. <span class="italic">Everything in</span>.</h2>
      </div>
      <div class="inc-grid">
        <div class="inc-card yes">
          <div class="inc-title"><span class="badge">✓</span> Included in {{ basePriceText }}</div>
          <ul class="inc-list">
            <li><b>60-minute direct moxibustion</b> session, one to one</li>
            <li><b>Fresh ginger slices</b> and aged mugwort, prepared on site</li>
            <li><b>English-speaking TCM practitioner</b> throughout</li>
            <li><b>Short consultation</b> on pain, cold and energy</li>
            <li><b>Warm herbal compress</b> over the treated area</li>
            <li><b>Herbal tea</b> and a quiet rest afterwards</li>
            <li><b>Practical aftercare notes</b> to take with you</li>
          </ul>
        </div>
        <div class="inc-card no">
          <div class="inc-title"><span class="badge">✗</span> Not Included</div>
          <ul class="inc-list">
            <li>Herbal medicine prescription (available from $15)</li>
            <li>Acupuncture or cupping (available as add-ons)</li>
            <li>Additional moxibustion sessions</li>
            <li>Hotel pickup and drop-off (available from $20)</li>
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
      description="1h · ginger slices · aged mugwort · chronic pain &amp; cold · English-speaking"
      bundle-label="Direct Moxibustion"
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
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 0" @click="toggleFaq(0)"><span class="n">01</span> What exactly is direct moxibustion? <span class="toggle">+</span></button>
                <div class="faq-a">Mugwort is burned <b>on a slice of ginger placed on the skin</b> — the ginger moderates the heat and carries it inward. It is a traditional way of warming cold areas and easing chronic pain. You feel warmth, not flame on skin.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 1 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 1" @click="toggleFaq(1)"><span class="n">02</span> Will it burn or scar my skin? <span class="toggle">+</span></button>
                <div class="faq-a">No. The ginger sits between the mugwort and your skin, and the practitioner lifts a cone the moment it gets too warm. We start gently and adjust to <b>your</b> comfort — tell us at any point and we stop.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 2 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 2" @click="toggleFaq(2)"><span class="n">03</span> What is it good for? <span class="toggle">+</span></button>
                <div class="faq-a">Guests usually book for <b>chronic pain, cold hands and feet, a heavy lower back, tiredness or poor sleep</b>. It is a complementary wellness experience, not a medical treatment — we will be honest if it is not right for you.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 3 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 3" @click="toggleFaq(3)"><span class="n">04</span> Is there smoke or smell? <span class="toggle">+</span></button>
                <div class="faq-a">There is a gentle herbal smell and a little smoke — part of the experience. The room is ventilated. If you are sensitive to smoke, <b>tell us in advance</b> and we can adapt the session.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 4 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 4" @click="toggleFaq(4)"><span class="n">05</span> Can anyone do it? <span class="toggle">+</span></button>
                <div class="faq-a">Most people can. Please tell us before booking if you are <b>pregnant, have a fever, broken or sensitive skin, or a bleeding condition</b>. Your practitioner will check with you again before starting.</div>
              </div>
            </div>
          </div>
        </section>

        <section class="cta-band" id="book">
          <div class="cta-inner">
            <div class="eyebrow">Ready?</div>
            <h2>Warmth that <span class="italic">stays with you</span>.</h2>
            <p>{{ basePriceText }} · 1h · Xi'an-style direct moxibustion · fresh ginger &amp; aged mugwort · for chronic pain and cold · English-speaking practitioner</p>
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

const product = encounterProducts.find(item => item.code === 'ENC-XA-DIRECT-MOXIBUSTION')!
const { productName, sku, status, refresh } = await useEncounterProduct(product, {
  title: "Direct Moxibustion in Xi'an — $28 Xi'an-Style Moxa Therapy | LVYV Encounters",
  description: "Traditional Xi'an-style direct moxibustion with ginger slices for chronic pain and cold conditions. One hour, $28 — normally $95 US. Burning mugwort on ginger. Sounds crazy. Works.",
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
  ? 68
  : Math.round((1 - basePrice.value / 95) * 100))
</script>

<style src="~/assets/css/encounter-experience.css"></style>
