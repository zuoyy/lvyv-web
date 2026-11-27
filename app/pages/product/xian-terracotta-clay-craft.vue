<template>
  <main class="encounter-experience-detail">
    <section class="hero" id="hero">
      <div class="hero-img" style="background-image:url('/images/encounters/wellness/xian-experiences/terracotta-craft/warrior-pit.webp');"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-crumb">
          <a href="/encounters">Encounters</a>
          <span class="sep">/</span>
          <a href="/encounters#xian">Xi'an</a>
          <span class="sep">/</span>
          <span>{{ productName }}</span>
        </div>
        <div class="hero-eyebrow">Craft · Hands-On</div>
        <h1>Build <span class="italic">Your Own</span><br />8,000th Warrior.</h1>
        <p class="hero-hook">"Built an army of 8,000. I built 1. Still proud."</p>
        <div class="hero-meta">
          <div class="hero-meta-item">⏱ <b>2h</b> workshop</div>
          <div class="hero-meta-item">🏺 <b>Same clay</b> &amp; techniques</div>
          <div class="hero-meta-item">🎨 <b>Paint</b> &amp; take it home</div>
          <div class="hero-meta-item">🗣 <b>English</b>-speaking</div>
        </div>
        <div class="hero-btns">
          <a href="#book" class="btn-book">Book This Encounter →</a>
          <a href="#compare" class="btn-ghost">See What's Included</a>
        </div>
      </div>
      <div class="hero-price-card">
        <div class="from">2-hour workshop</div>
        <div class="num">{{ basePriceText }}</div>
        <div class="per">/ person</div>
        <div class="note">Take home your warrior</div>
        <div class="compare-mini">$60 pottery studio</div>
      </div>
    </section>

    <div class="strip">
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/xian-experiences/terracotta-craft/warrior-pit.webp');"><div class="strip-label">The Original Army · 兵马俑</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/xian-experiences/terracotta-craft/warrior-face.webp');"><div class="strip-label">2,200-Year-Old Clay · 陶胎</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/xian-experiences/terracotta-craft/workshop-family.webp');"><div class="strip-label">Hands-On Workshop · 手作课堂</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/xian-experiences/terracotta-craft/finished-warrior.webp');"><div class="strip-label">Your Warrior · 成品带走</div></div>
    </div>

    <div class="section" style="padding-top:48px;padding-bottom:0;">
      <div class="hook-block">
        <div class="quote">"<span class="accent">Built an army of 8,000.</span> <span class="accent">I built 1. Still proud.</span>"</div>
        <div class="attribution">— <span class="name">A LVYV guest</span>, Xi'an · Terracotta Warrior Clay Craft</div>
      </div>
    </div>

    <section class="section" id="therapy">
      <div class="section-head center">
        <div class="eyebrow">What Happens</div>
        <h2 class="section-title">The same clay. <span class="italic">Your own two hands</span>.</h2>
        <p class="section-sub">Sculpt a mini terracotta warrior using the same clay and techniques as the artisans who made the original army 2,200 years ago. Press it into a mould, shape the details, paint the armour — then take your warrior home.</p>
      </div>
      <div class="card-grid">
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/xian-experiences/terracotta-craft/clay-mold.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">01 · The Clay</div>
            <h3>Press It Into the Mould</h3>
            <div class="svc-cn">陶土制坯 · Táo Tǔ Zhì Pī</div>
            <p>Start with a lump of local clay — the same material the Qin artisans used. Press it into a traditional warrior mould by hand, press out the air, and release your own miniature soldier, armour and all.</p>
            <p class="svc-hook">"Built an army of 8,000. I built 1. Still proud."</p>
            <span class="svc-tag">Real clay · traditional mould</span>
          </div>
        </div>
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/xian-experiences/terracotta-craft/workshop-family.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">02 · The Details</div>
            <h3>Shape the Face, Build the Body</h3>
            <div class="svc-cn">塑形修坯 · Sù Xíng Xiū Pī</div>
            <p>This is where it becomes yours. Carve the expression, smooth the armour plates, adjust the stance. Your instructor — a local craft teacher — works alongside you, and helps kids and first-timers get the details right.</p>
            <p class="svc-hook">"Two hours went by like ten minutes."</p>
            <span class="svc-tag">Great for kids · all ages welcome</span>
          </div>
        </div>
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/xian-experiences/terracotta-craft/finished-warrior.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">03 · Take It Home</div>
            <h3>Paint It. Keep It.</h3>
            <div class="svc-cn">彩绘上色 · Cǎi Huì Shàng Sè</div>
            <p>Once dry, paint the armour and face in the colours of the original army. Your mini warrior is yours to take home — a small, slightly imperfect, completely yours piece of Xi'an that fits in your bag.</p>
            <p class="svc-hook">"My warrior has a crooked helmet. I love him more for it."</p>
            <span class="svc-tag">Paint &amp; keep · take-home piece</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section alt">
      <div class="section alt-inner" id="timeline">
        <div class="section-head">
          <div class="eyebrow">Your Session</div>
          <h2 class="section-title">Two hours, <span class="italic">one small army</span></h2>
        </div>
        <div class="tl-wrap">
          <div class="tl-aside">
            <h3>2,200 years of technique, in your hands</h3>
            <p>The Terracotta Army was built for China's first emperor — thousands of soldiers, each with a different face, buried to guard him for eternity. In this workshop you learn the same hand-building methods on a small scale, with a local craft instructor guiding every step.</p>
            <div class="tl-note"><b>Good to know:</b> Aprons and all materials are provided — just wear something you don't mind getting muddy. It is a relaxed, family-friendly class; kids as young as five can join with help. Your piece needs a little drying time before painting, which we fill with stories of the pit.</div>
          </div>
          <div class="timeline">
            <div class="tl-item">
              <div class="tl-time">00:00 · Meet the Army</div>
              <div class="tl-title">Who were the 8,000 warriors?</div>
              <div class="tl-desc">Your instructor introduces the clay, the tools and the story of the Terracotta Army — why each soldier had a different face, and how they were made 2,200 years ago. <span class="cn">兵马俑的故事 · 陶土与工具 · 英语讲解</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">00:20 · Press the Mould</div>
              <div class="tl-title">Your warrior takes shape</div>
              <div class="tl-desc">You press real clay into a traditional mould, work out the air bubbles and release a miniature warrior. The instructor checks your piece and shows you how to strengthen the base. <span class="cn">陶土入模 · 压实排气 · 脱坯</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">00:50 · Shape &amp; Detail</div>
              <div class="tl-title">Give him a face</div>
              <div class="tl-desc">Carve the eyes, the moustache, the armour plates and the topknot. No two warriors in the class turn out the same — that is exactly the point, and it is how the original army was made. <span class="cn">塑五官 · 刻铠甲 · 修坯</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">01:30 · Paint &amp; Pack</div>
              <div class="tl-title">Colour him in, then wrap him up</div>
              <div class="tl-desc">Paint the armour and face with the colours of the original figures. We wrap your warrior for the journey home and send you off with a photo of the pit to compare him to. <span class="cn">彩绘上色 · 打包带走 · 合影留念</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section alt" id="compare">
      <div class="section alt-inner">
        <div class="section-head center">
          <div class="eyebrow">What It Costs</div>
          <h2 class="section-title">A pottery studio price. <span class="italic">Made in Xi'an</span>.</h2>
          <p class="section-sub">A comparable hand-building pottery session abroad runs around $60. Here it is {{ basePriceText }} — clay, mould, painting and your take-home warrior all included.</p>
        </div>
        <div class="cmp-wrap">
          <div class="cmp-head">
            <h3>Terracotta Warrior Clay Craft — Price Breakdown</h3>
            <span class="badge">Take It Home</span>
          </div>
          <div class="cmp-labels"><span>Experience</span><span>Pottery Studio</span><span>LVYV Xi'an</span></div>
          <div class="cmp-body">
            <div class="cmp-row">
              <div class="label">2-Hour Hand-Building Workshop<span>Small group, local craft instructor</span></div>
              <div class="away">$60</div>
              <div class="here">{{ basePriceText }}</div>
            </div>
            <div class="cmp-row">
              <div class="label">Clay, Mould &amp; Tools<span>All materials, usually charged separately</span></div>
              <div class="away">+$15</div>
              <div class="here">included</div>
            </div>
            <div class="cmp-row">
              <div class="label">Painting &amp; Take-Home Piece<span>Your own mini warrior</span></div>
              <div class="away">+$12</div>
              <div class="here">included</div>
            </div>
            <div class="cmp-row total">
              <div class="label">Workshop Price You Pay<span>Everything above · 2 hours</span></div>
              <div class="away">$60</div>
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
            <li><b>2-hour hands-on workshop</b> with a local craft instructor</li>
            <li><b>Real terracotta clay</b>, traditional mould and sculpting tools</li>
            <li><b>Step-by-shape guidance</b> — from lump to finished warrior</li>
            <li><b>Paints and brushes</b> for your own colour scheme</li>
            <li><b>Your mini warrior</b>, wrapped and ready to take home</li>
            <li><b>English-speaking help</b> throughout</li>
            <li><b>Apron and materials</b> — nothing to bring but yourself</li>
          </ul>
        </div>
        <div class="inc-card no">
          <div class="inc-title"><span class="badge">✗</span> Not Included</div>
          <ul class="inc-list">
            <li>Terracotta Army museum entrance ticket</li>
            <li>Kiln firing or glazing (pieces are air-dried)</li>
            <li>Extra warriors beyond the one you make</li>
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
      description="2h · real terracotta clay · traditional mould · paint &amp; take home · English-speaking"
      bundle-label="Terracotta Clay Craft"
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
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 0" @click="toggleFaq(0)"><span class="n">01</span> Can kids join this workshop? <span class="toggle">+</span></button>
                <div class="faq-a">Yes — it is one of the most family-friendly things to do in Xi'an. Children from around <b>five years old</b> can join with a parent's help; the instructor is used to small hands and messy aprons. Everyone makes their own warrior to keep.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 1 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 1" @click="toggleFaq(1)"><span class="n">02</span> Is this the same clay as the original warriors? <span class="toggle">+</span></button>
                <div class="faq-a">It is the <b>same type of local terracotta clay and the same hand-building techniques</b> the Qin artisans used 2,200 years ago, adapted for a two-hour class. You press, shape and detail by hand — no pottery wheel, just as they did.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 2 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 2" @click="toggleFaq(2)"><span class="n">03</span> Do I need to visit the museum first? <span class="toggle">+</span></button>
                <div class="faq-a">No — the workshop stands on its own, and your instructor tells the full story of the army. Many guests do the pit in the morning and the workshop in the afternoon so they can compare their warrior with the originals. <b>Museum entry is not included.</b></div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 3 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 3" @click="toggleFaq(3)"><span class="n">04</span> Can I take my warrior on the plane? <span class="toggle">+</span></button>
                <div class="faq-a">Yes. Your piece is <b>air-dried rather than kiln-fired</b>, and we wrap it securely for travel. It is small enough for a carry-on — just treat it gently, as unfired clay can chip if dropped.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 4 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 4" @click="toggleFaq(4)"><span class="n">05</span> Do I need any pottery experience? <span class="toggle">+</span></button>
                <div class="faq-a">None at all. The mould does most of the shaping; your job is to press, smooth, carve and paint. The instructor helps at every stage, and a crooked helmet is part of the charm — no two warriors in the class ever look the same.</div>
              </div>
            </div>
          </div>
        </section>

        <section class="cta-band" id="book">
          <div class="cta-inner">
            <div class="eyebrow">Ready?</div>
            <h2>Your own piece <span class="italic">of Xi'an</span>.</h2>
            <p>{{ basePriceText }} · 2h · real terracotta clay · traditional mould · shape &amp; paint your mini warrior · take it home · English-speaking instructor</p>
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

const product = encounterProducts.find(item => item.code === 'ENC-XA-TERRACOTTA-CLAY-CRAFT')!
const { productName, sku, status, refresh } = await useEncounterProduct(product, {
  title: "Terracotta Warrior Clay Craft in Xi'an — $39 Mini Warrior Workshop | LVYV Encounters",
  description: "Sculpt your own mini terracotta warrior using the same clay and techniques as the original artisans 2,200 years ago, and take it home. Two hours, $39 — a $60 pottery studio experience. Built an army of 8,000. I built 1. Still proud.",
})
const booking = useTemplateRef('booking')

const activeFaq = ref<number | null>(0)
function toggleFaq(index: number) {
  activeFaq.value = activeFaq.value === index ? null : index
}

const originalPrice = 39
const basePrice = computed(() => sku.value?.price ?? originalPrice)
const basePriceText = computed(() => encounterPrice(basePrice.value))
</script>

<style src="~/assets/css/encounter-experience.css"></style>
