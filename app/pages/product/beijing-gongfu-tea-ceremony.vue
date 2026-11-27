<template>
  <main class="encounter-experience-detail">
    <section class="hero" id="hero">
      <div class="hero-img" style="background-image:url('/images/encounters/wellness/tea/tea-room.webp');"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-crumb">
          <a href="/encounters">Encounters</a>
          <span class="sep">/</span>
          <a href="/encounters#beijing">Beijing</a>
          <span class="sep">/</span>
          <span>{{ productName }}</span>
        </div>
        <div class="hero-eyebrow">Culture Encounter · Beijing</div>
        <h1>Twelve Steps.<br />One <span class="italic">Perfect Cup</span></h1>
        <p class="hero-hook">"12 steps for one cup. I'll never look at a teabag the same way."</p>
        <div class="hero-meta">
          <div class="hero-meta-item">⏱ <b>1.5h</b> total</div>
          <div class="hero-meta-item">🍵 <b>Tea master</b> led</div>
          <div class="hero-meta-item">🌿 <b>5 single-origin teas</b></div>
          <div class="hero-meta-item">🎁 <b>Tea pet</b> to take home</div>
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
        <div v-if="savingsPercent > 0" class="note">Save {{ savingsPercent }}% vs London tea house</div>
        <div class="compare-mini">$85 in London</div>
      </div>
    </section>

    <div class="strip">
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/tea/tea-room.webp');"><div class="strip-label">The Tea Room · 茶席</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/tea/tea-leaves.webp');"><div class="strip-label">Leaf &amp; Aroma · 观茶</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/tea/leaf-prep.webp');"><div class="strip-label">Leaf Preparation · 投茶</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/tea/tea-cups.webp');"><div class="strip-label">The Tasting · 品茗</div></div>
    </div>

    <div class="section" style="padding-top:48px;padding-bottom:0;">
      <div class="hook-block">
        <div class="quote">"<span class="accent">12 steps for one cup.</span> I'll never look at a <span class="accent">teabag</span> the same way."</div>
        <div class="attribution">— <span class="name">Sophie L.</span>, London · Gongfu Tea Ceremony Workshop, Beijing · Oct 2025</div>
      </div>
    </div>

    <section class="section" id="therapy">
      <div class="section-head center">
        <div class="eyebrow">What Happens</div>
        <h2 class="section-title">Three parts. <span class="italic">One quiet hour.</span></h2>
        <p class="section-sub">A 90-minute immersion in the Gongfu tea ritual — guided brewing, five single-origin teas, and a small piece of the practice to take home.</p>
      </div>
      <div class="card-grid">
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/tea/tea-pour.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">01 · The Ritual</div>
            <h3>The 12-Step Gongfu Ritual</h3>
            <div class="svc-cn">功夫茶十二道 · Gōng Fū Chá</div>
            <p>A tea master guides every movement — warming the vessel, awakening the leaves, the high pour, the gentle pour. By the fifth brew, your hands know what to do.</p>
            <p class="svc-hook">"I didn't realise how much a cup of tea could hold."</p>
            <span class="svc-tag">12 steps · hands-on</span>
          </div>
        </div>
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/tea/tea-leaves.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">02 · The Teas</div>
            <h3>Five Single-Origin Teas</h3>
            <div class="svc-cn">五款原产地茶 · Wǔ Kuǎn Chá</div>
            <p>Green, oolong, black, puer and a seasonal rare leaf — chosen for contrast. The same leaves are infused again and again, each cup tasting completely different.</p>
            <p class="svc-hook">"The same leaf tasted like four different teas."</p>
            <span class="svc-tag">5 teas · multiple infusions</span>
          </div>
        </div>
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/tea/tea-cups.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">03 · Take Home</div>
            <h3>Tea Pet &amp; Brew Guide</h3>
            <div class="svc-cn">茶宠与茶谱 · Chá Chǒng</div>
            <p>Leave with a clay tea pet, a simple English brew guide, and a small tin of the tea you liked most. Your teabag days are over.</p>
            <p class="svc-hook">"I've already recreated it at home."</p>
            <span class="svc-tag">Tea pet + guide included</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section alt">
      <div class="section alt-inner" id="timeline">
        <div class="section-head">
          <div class="eyebrow">Your Visit</div>
          <h2 class="section-title">90 minutes, <span class="italic">start to finish</span></h2>
        </div>
        <div class="tl-wrap">
          <div class="tl-aside">
            <h3>Everything in one sitting</h3>
            <p>A small-group tea room session, led in English with a master. No experience needed — just a willingness to slow down.</p>
            <div class="tl-note"><b>Good to know:</b> Wear comfortable clothes and arrive with an empty stomach if you can. Phones stay on silent. Tea is served throughout; please tell us about any allergies when booking.</div>
          </div>
          <div class="timeline">
            <div class="tl-item">
              <div class="tl-time">14:00 · Arrival</div>
              <div class="tl-title">Enter the tea room</div>
              <div class="tl-desc">Your English-speaking host welcomes you with a seat at the tea table and a first cup to settle in. <span class="cn">茶席入座 · 英语接待 · 迎宾茶</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">14:10 · The Setting</div>
              <div class="tl-title">Warm the vessels, meet the water</div>
              <div class="tl-desc">Learn why the pot is warmed, how water temperature changes a leaf, and what to look for before the first infusion. <span class="cn">温器 · 水温 · 观茶</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">14:25 · The Twelve Steps</div>
              <div class="tl-title">Guided brewing, five teas</div>
              <div class="tl-desc">You do the pouring yourself under the master's guidance — five single-origin teas, each brewed multiple times. <span class="cn">十二道茶艺 · 五款茶 · 亲手冲泡</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">15:15 · Tasting & Takeaway</div>
              <div class="tl-title">Tea pet, guide and your favourite tin</div>
              <div class="tl-desc">Compare the cups side by side, choose your favourite tea to take home, and leave with a clay tea pet and English brew guide. <span class="cn">品茗对比 · 茶宠 · 英文茶谱 · 带走茶叶</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section alt" id="compare">
      <div class="section alt-inner">
        <div class="section-head center">
          <div class="eyebrow">Price Comparison</div>
          <h2 class="section-title">Same ritual. <span class="italic">Very different bill.</span></h2>
          <p class="section-sub">Typical London tea-house pricing for a master-led Gongfu workshop with takeaways.</p>
        </div>
        <div class="cmp-wrap">
          <div class="cmp-head">
            <h3>Gongfu Tea Workshop Pricing</h3>
            <span v-if="savingsPercent > 0" class="badge">Save {{ savingsPercent }}%</span>
          </div>
          <div class="cmp-labels"><span>Experience</span><span>London tea house</span><span>LVYV Beijing</span></div>
          <div class="cmp-body">
            <div class="cmp-row">
              <div class="label">Master-Led 12-Step Ritual<span>Hands-on · 90 min</span></div>
              <div class="away">$45</div>
              <div class="here">$12</div>
            </div>
            <div class="cmp-row">
              <div class="label">Five Single-Origin Teas<span>Multiple infusions each</span></div>
              <div class="away">$25</div>
              <div class="here">$7</div>
            </div>
            <div class="cmp-row">
              <div class="label">Tea Pet, Brew Guide &amp; Tea Tin<span>Yours to take home</span></div>
              <div class="away">$15</div>
              <div class="here">$6</div>
            </div>
            <div class="cmp-row total">
              <div class="label">Total Workshop<span>Everything above · 1.5 hours</span></div>
              <div class="away">$85</div>
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
            <li><b>90-minute small-group workshop</b> with a tea master</li>
            <li><b>Hands-on 12-step Gongfu brewing ritual</b></li>
            <li><b>Tasting of five single-origin teas</b>, multiple infusions each</li>
            <li><b>A clay tea pet</b> to take home</li>
            <li><b>English brew guide</b> and a small tin of your favourite tea</li>
            <li><b>English-speaking LVYV host</b> throughout</li>
            <li><b>Tea room session</b> pre-booked — no waiting</li>
          </ul>
        </div>
        <div class="inc-card no">
          <div class="inc-title"><span class="badge">✗</span> Not Included</div>
          <ul class="inc-list">
            <li>Private one-to-one master session (from $60)</li>
            <li>Aged pu'er or premium rare tea upgrades (from $15)</li>
            <li>Traditional tea ceremony costume &amp; photo shoot</li>
            <li>Meals and drinks outside the workshop</li>
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
      description="1.5h · Beijing · Tea room · English host · Tea pet included"
      bundle-label="Tea Workshop"
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
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 0" @click="toggleFaq(0)"><span class="n">01</span> Do I need any tea experience? <span class="toggle">+</span></button>
                <div class="faq-a">None at all. The master starts from zero and <b>guides your hands through every movement</b>. Most guests have never brewed Gongfu tea before — that's the point.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 1 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 1" @click="toggleFaq(1)"><span class="n">02</span> Is it just sitting and drinking tea? <span class="toggle">+</span></button>
                <div class="faq-a">No — it's <b>hands-on</b>. You warm the pot, measure the leaves, pour and serve yourself. The master corrects your technique as you go, so you can reproduce it at home.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 2 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 2" @click="toggleFaq(2)"><span class="n">03</span> What exactly do I take home? <span class="toggle">+</span></button>
                <div class="faq-a">A <b>clay tea pet</b>, an English brew guide, and a small tin of whichever of the five teas you liked most — enough for several sessions at home.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 3 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 3" @click="toggleFaq(3)"><span class="n">04</span> Can I book a private session? <span class="toggle">+</span></button>
                <div class="faq-a">Yes. <b>Private one-to-one sessions start at $60</b> and can be tailored around a particular tea or a deeper practice. Ask your LVYV host when booking.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 4 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 4" @click="toggleFaq(4)"><span class="n">05</span> How is this different from a tea house tasting? <span class="toggle">+</span></button>
                <div class="faq-a">A tea house serves you; here <b>you brew</b>. You learn the 12 steps, taste the same leaf across multiple infusions, and leave with the tools to keep practising.</div>
              </div>
            </div>
          </div>
        </section>

        <section class="cta-band" id="book">
          <div class="cta-inner">
            <div class="eyebrow">Ready?</div>
            <h2>A cup worth <span class="italic">slowing down for.</span></h2>
            <p>{{ basePriceText }} · 1.5h Gongfu tea workshop · Beijing tea room · Tea master · 5 teas · Tea pet to take home</p>
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

const product = encounterProducts.find(item => item.code === 'ENC-BJ-GONGFU-TEA-CEREMONY')!
const { productName, sku, status, refresh } = await useEncounterProduct(product, {
  title: "Gongfu Tea Ceremony Workshop in Beijing — $25 vs $85 in London | LVYV Encounters",
  description: "Learn the 12-step Gongfu tea ritual from a master in Beijing. Brew five single-origin teas and take home a tea pet. $25 — 69% less than a London tea house.",
})
const booking = useTemplateRef('booking')

const activeFaq = ref<number | null>(0)
function toggleFaq(index: number) {
  activeFaq.value = activeFaq.value === index ? null : index
}

const originalPrice = 25
const basePrice = computed(() => sku.value?.price ?? originalPrice)
const basePriceText = computed(() => encounterPrice(basePrice.value))
const savingsPercent = computed(() => basePrice.value === originalPrice
  ? 69
  : Math.round((1 - basePrice.value / 85) * 100))
</script>

<style src="~/assets/css/encounter-experience.css"></style>
