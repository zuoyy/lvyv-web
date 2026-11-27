<template>
  <main class="encounter-experience-detail">
    <section class="hero" id="hero">
      <div class="hero-img" style="background-image:url('/images/encounters/wellness/dumplings/hutong-class.webp');"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-crumb">
          <a href="/encounters">Encounters</a>
          <span class="sep">/</span>
          <a href="/encounters#beijing">Beijing</a>
          <span class="sep">/</span>
          <span>{{ productName }}</span>
        </div>
        <div class="hero-eyebrow">Food Encounter · Beijing Hutong</div>
        <h1>Two Hours With<br />Your <span class="italic">Chinese Grandma</span></h1>
        <p class="hero-hook">"My Chinese grandma for 3 hours. I made 40 dumplings."</p>
        <div class="hero-meta">
          <div class="hero-meta-item">⏱ <b>2h</b> total</div>
          <div class="hero-meta-item">👵 <b>Hutong grandmother</b></div>
          <div class="hero-meta-item">🥟 <b>6 folding techniques</b></div>
          <div class="hero-meta-item">🍽 <b>Eat what you make</b></div>
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
        <div v-if="savingsPercent > 0" class="note">Save {{ savingsPercent }}% vs cooking school</div>
        <div class="compare-mini">$120 at a cooking school</div>
      </div>
    </section>

    <div class="strip">
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/dumplings/hutong-class.webp');"><div class="strip-label">Hutong Kitchen · 胡同厨房</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/dumplings/dumpling-flour.webp');"><div class="strip-label">Flour &amp; Dough · 和面</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/dumplings/steam-basket.webp');"><div class="strip-label">Steamed &amp; Served · 上桌</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/dumplings/dumpling-plate.webp');"><div class="strip-label">Eat What You Make · 现包现吃</div></div>
    </div>

    <div class="section" style="padding-top:48px;padding-bottom:0;">
      <div class="hook-block">
        <div class="quote">"<span class="accent">My Chinese grandma for 3 hours.</span> I made <span class="accent">40 dumplings.</span>"</div>
        <div class="attribution">— <span class="name">Marcus D.</span>, Sydney · Dumpling Master Class, Beijing · Oct 2025</div>
      </div>
    </div>

    <section class="section" id="therapy">
      <div class="section-head center">
        <div class="eyebrow">What Happens</div>
        <h2 class="section-title">Dough, folds, <span class="italic">dinner</span>.</h2>
        <p class="section-sub">Two hours in a Beijing hutong kitchen — make jiaozi from scratch with a grandmother who's been folding them for decades. Six techniques, three fillings, and your own lunch.</p>
      </div>
      <div class="card-grid">
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/dumplings/family-wrapping.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">01 · The Table</div>
            <h3>Grandma's Kitchen</h3>
            <div class="svc-cn">当地人自己家的厨房 · Local Home Kitchen</div>
            <p>No restaurant kitchen — a real family table in a Beijing hutong. Grandma shows you how the dough is mixed, rested and rolled, then hands you a wrapper of your own.</p>
            <p class="svc-hook">"She treated us like family by the second hour."</p>
            <span class="svc-tag">Hutong home · small group</span>
          </div>
        </div>
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/dumplings/folding-hands.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">02 · The Craft</div>
            <h3>Six Folding Techniques</h3>
            <div class="svc-cn">六种包法 · Liù Zhǒng Bāo Fǎ</div>
            <p>From the simple crescent to the pleased "golden purse". Six folds taught one by one, with three fillings — pork and chive, shrimp and egg, and seasonal vegetables.</p>
            <p class="svc-hook">"By dumpling twenty I stopped looking at my hands."</p>
            <span class="svc-tag">6 folds · 3 fillings</span>
          </div>
        </div>
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/dumplings/steamed-bite.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">03 · The Feast</div>
            <h3>Eat What You Make</h3>
            <div class="svc-cn">现包现吃 · Xiàn Bāo Xiàn Chī</div>
            <p>Your dumplings go straight into the pot, then onto the table with black vinegar, chilli oil and garlic. Forty dumplings later, you'll understand why this is dinner and an activity in one.</p>
            <p class="svc-hook">"I made 40 and ate every single one."</p>
            <span class="svc-tag">Boiled on site · dipping sauces</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section alt">
      <div class="section alt-inner" id="timeline">
        <div class="section-head">
          <div class="eyebrow">Your Visit</div>
          <h2 class="section-title">Two hours, <span class="italic">start to finish</span></h2>
        </div>
        <div class="tl-wrap">
          <div class="tl-aside">
            <h3>Everything in one kitchen</h3>
            <p>A small-group class in a real Beijing home. No experience needed — grandma starts from zero and stays with you the whole way.</p>
            <div class="tl-note"><b>Good to know:</b> Come hungry — you're eating what you make. Wear something you don't mind getting a little flour on. Tell us about allergies when booking; we can adjust one filling.</div>
          </div>
          <div class="timeline">
            <div class="tl-item">
              <div class="tl-time">14:00 · Arrival</div>
              <div class="tl-title">Meet grandma in the hutong</div>
              <div class="tl-desc">Your English-speaking host meets you at the lane entrance and walks you to the family kitchen. Tea and aprons waiting. <span class="cn">胡同口集合 · 英语接待 · 围裙茶水</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">14:15 · Dough & Fillings</div>
              <div class="tl-title">Make the wrappers from scratch</div>
              <div class="tl-desc">Mix and rest the dough, roll wrappers by hand, and prepare three fillings: pork and chive, shrimp and egg, seasonal vegetables. <span class="cn">和面 · 擀皮 · 三种馅料</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">14:40 · Six Folds</div>
              <div class="tl-title">Learn six folding techniques</div>
              <div class="tl-desc">Grandma demonstrates each fold slowly, then guides your hands — from the simple crescent to the pleated "golden purse". <span class="cn">六种包法 · 手把手教学</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">15:30 · Boil & Eat</div>
              <div class="tl-title">Your dumplings, your dinner</div>
              <div class="tl-desc">Everything you made goes into the pot. Sit down with black vinegar, chilli oil and garlic — and a translated recipe card to take home. <span class="cn">下锅煮熟 · 蘸料 · 英文食谱卡</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section alt" id="compare">
      <div class="section alt-inner">
        <div class="section-head center">
          <div class="eyebrow">Price Comparison</div>
          <h2 class="section-title">Same class. <span class="italic">A fraction of the price.</span></h2>
          <p class="section-sub">Typical Western cooking-school pricing for a two-hour, grandmother-led dumpling workshop.</p>
        </div>
        <div class="cmp-wrap">
          <div class="cmp-head">
            <h3>Dumpling Master Class Pricing</h3>
            <span v-if="savingsPercent > 0" class="badge">Save {{ savingsPercent }}%</span>
          </div>
          <div class="cmp-labels"><span>Experience</span><span>Typical cooking school</span><span>LVYV Beijing</span></div>
          <div class="cmp-body">
            <div class="cmp-row">
              <div class="label">Grandmother-Led Class<span>Hands-on · 2 hours</span></div>
              <div class="away">$60</div>
              <div class="here">$10</div>
            </div>
            <div class="cmp-row">
              <div class="label">Dough, 3 Fillings &amp; Ingredients<span>Everything made from scratch</span></div>
              <div class="away">$35</div>
              <div class="here">$6</div>
            </div>
            <div class="cmp-row">
              <div class="label">Six Folding Techniques &amp; Recipe Card<span>Yours to keep</span></div>
              <div class="away">$25</div>
              <div class="here">$5</div>
            </div>
            <div class="cmp-row total">
              <div class="label">Total Class<span>Everything above · 2 hours</span></div>
              <div class="away">$120</div>
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
            <li><b>2-hour hands-on class</b> with a Beijing hutong grandmother</li>
            <li><b>Dough made from scratch</b> — mixing, resting and rolling</li>
            <li><b>Three fillings</b>: pork &amp; chive, shrimp &amp; egg, seasonal vegetables</li>
            <li><b>Six folding techniques</b>, taught one by one</li>
            <li><b>Everything you make</b>, boiled and eaten on site</li>
            <li><b>English-speaking host</b> and translated recipe card</li>
            <li><b>Apron, tea and dipping sauces</b> provided</li>
          </ul>
        </div>
        <div class="inc-card no">
          <div class="inc-title"><span class="badge">✗</span> Not Included</div>
          <ul class="inc-list">
            <li>Extra dumplings to take away / frozen packs (from $8)</li>
            <li>Private one-to-one class (from $70)</li>
            <li>Soft drinks and alcohol beyond the tea provided</li>
            <li>Hotel pickup and drop-off (available from $20)</li>
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
      description="2h · Beijing hutong · Grandmother-led · English host · Eat what you make"
      bundle-label="Dumpling Class"
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
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 0" @click="toggleFaq(0)"><span class="n">01</span> Do I need any cooking experience? <span class="toggle">+</span></button>
                <div class="faq-a">None. Grandma starts from zero and <b>stays beside you through every fold</b>. Most guests have never made dumplings before — that's exactly why they come.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 1 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 1" @click="toggleFaq(1)"><span class="n">02</span> Do I really get to eat them? <span class="toggle">+</span></button>
                <div class="faq-a">Yes — <b>everything you make is boiled and served</b> right there. With three fillings and six folds, most people make around 40 dumplings and eat every one.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 2 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 2" @click="toggleFaq(2)"><span class="n">03</span> Are there vegetarian options? <span class="toggle">+</span></button>
                <div class="faq-a">Yes. One of the three fillings is <b>seasonal vegetables</b>, and we can adjust it for allergies if you tell us when booking. The class is naturally pork-and-shrimp optional.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 3 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 3" @click="toggleFaq(3)"><span class="n">04</span> Can children join? <span class="toggle">+</span></button>
                <div class="faq-a">Absolutely — <b>ages 8 and up</b> with an adult. Smaller hands often pick up the folds fastest. Let us know the ages in advance so we can prepare aprons.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 4 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 4" @click="toggleFaq(4)"><span class="n">05</span> Can I take dumplings home? <span class="toggle">+</span></button>
                <div class="faq-a">Yes. Ask your host for a <b>takeaway portion from $8</b> — we'll pack what you've made (or a frozen pack) for the trip back to your hotel.</div>
              </div>
            </div>
          </div>
        </section>

        <section class="cta-band" id="book">
          <div class="cta-inner">
            <div class="eyebrow">Ready?</div>
            <h2>Forty dumplings. <span class="italic">One hutong.</span></h2>
            <p>{{ basePriceText }} · 2h dumpling class · Beijing hutong kitchen · Grandmother-led · 6 folds · 3 fillings · Eat what you make</p>
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

const product = encounterProducts.find(item => item.code === 'ENC-BJ-DUMPLING-MASTER-CLASS')!
const { productName, sku, status, refresh } = await useEncounterProduct(product, {
  title: "Dumpling Master Class in Beijing — $21 vs $120 Cooking School | LVYV Encounters",
  description: "Make jiaozi from scratch with a Beijing hutong grandmother. Six folding techniques, three fillings, and eat what you make. $21 — 82% less than a cooking school.",
})
const booking = useTemplateRef('booking')

const activeFaq = ref<number | null>(0)
function toggleFaq(index: number) {
  activeFaq.value = activeFaq.value === index ? null : index
}

const originalPrice = 21
const basePrice = computed(() => sku.value?.price ?? originalPrice)
const basePriceText = computed(() => encounterPrice(basePrice.value))
const savingsPercent = computed(() => basePrice.value === originalPrice
  ? 82
  : Math.round((1 - basePrice.value / 120) * 100))
</script>

<style src="~/assets/css/encounter-experience.css"></style>
