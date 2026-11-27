<template>
  <main class="encounter-experience-detail">
    <section class="hero" id="hero">
      <div class="hero-img" style="background-image:url('/images/encounters/wellness/taichi/taichi-group.webp');"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-crumb">
          <a href="/encounters">Encounters</a>
          <span class="sep">/</span>
          <a href="/encounters#beijing">Beijing</a>
          <span class="sep">/</span>
          <span>{{ productName }}</span>
        </div>
        <div class="hero-eyebrow">Culture Encounter · Temple of Heaven</div>
        <h1>Move Like Water<br />At <span class="italic">Sunrise</span></h1>
        <p class="hero-hook">"60-year-olds moving like water. I was the stiffest person in the park."</p>
        <div class="hero-meta">
          <div class="hero-meta-item">⏱ <b>1.5h</b> at sunrise</div>
          <div class="hero-meta-item">🧘 <b>20-year master</b></div>
          <div class="hero-meta-item">🌀 <b>The 8-form</b></div>
          <div class="hero-meta-item">🍵 <b>Tea &amp; chat</b> after</div>
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
        <div v-if="savingsPercent > 0" class="note">Save {{ savingsPercent }}% vs studio class</div>
        <div class="compare-mini">$90 at a studio</div>
      </div>
    </section>

    <div class="strip">
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/taichi/taichi-group.webp');"><div class="strip-label">Sunrise Practice · 晨练</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/taichi/taichi-group2.webp');"><div class="strip-label">The 8-Form · 八式</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/taichi/master-white.webp');"><div class="strip-label">20-Year Master · 老师傅</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/taichi/master-red.webp');"><div class="strip-label">Tai Chi Sword · 太极剑</div></div>
    </div>

    <div class="section" style="padding-top:48px;padding-bottom:0;">
      <div class="hook-block">
        <div class="quote">"<span class="accent">60-year-olds moving like water.</span> I was the <span class="accent">stiffest person in the park.</span>"</div>
        <div class="attribution">— <span class="name">Daniel R.</span>, Toronto · Tai Chi at Temple of Heaven · Oct 2025</div>
      </div>
    </div>

    <section class="section" id="therapy">
      <div class="section-head center">
        <div class="eyebrow">What Happens</div>
        <h2 class="section-title">The park, the form, <span class="italic">the tea</span>.</h2>
        <p class="section-sub">Ninety minutes at sunrise with a master who's taught Tai Chi in Beijing for 20 years. Learn the 8-form, move with the regulars, then stay for tea and conversation.</p>
      </div>
      <div class="card-grid">
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/taichi/master-white.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">01 · The Master</div>
            <h3>Learn From a 20-Year Master</h3>
            <div class="svc-cn">天坛太极老师傅 · Tiān Tán Tài Jí</div>
            <p>This isn't a studio class with mirrors. You practise on the temple grounds with a teacher who has spent two decades there — patient, precise, and used to complete beginners.</p>
            <p class="svc-hook">"He corrected my shoulder without ever touching me."</p>
            <span class="svc-tag">20 years teaching · all levels</span>
          </div>
        </div>
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/taichi/taichi-group2.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">02 · The Form</div>
            <h3>The 8-Form at Sunrise</h3>
            <div class="svc-cn">太极八式 · Tài Jí Bā Shì</div>
            <p>Eight movements, repeated until they feel less like a routine and more like breathing. The master breaks each one down slowly, then runs the whole form with the group.</p>
            <p class="svc-hook">"By the third round I stopped counting and just followed."</p>
            <span class="svc-tag">8 forms · beginner friendly</span>
          </div>
        </div>
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/taichi/taichi-group.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">03 · The Morning</div>
            <h3>Tea &amp; Conversation After</h3>
            <div class="svc-cn">练后品茶 · Liàn Hòu Pǐn Chá</div>
            <p>When the form ends, stay a while. Tea is brewed on site and the master sits down for questions — about the movements, the park, or why the 60-year-olds move like water.</p>
            <p class="svc-hook">"The tea and the conversation were half the morning."</p>
            <span class="svc-tag">Tea included · no rush</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section alt">
      <div class="section alt-inner" id="timeline">
        <div class="section-head">
          <div class="eyebrow">Your Morning</div>
          <h2 class="section-title">1.5 hours, <span class="italic">from first light</span></h2>
        </div>
        <div class="tl-wrap">
          <div class="tl-aside">
            <h3>Before the park gets busy</h3>
            <p>A small-group sunrise session on the Temple of Heaven grounds. No experience needed — the master starts from zero and you move at your own pace.</p>
            <div class="tl-note"><b>Good to know:</b> Dress in loose layers and flat shoes. Sunrise means an early start — exact meeting time is sent the day before. Tea and water are provided; bring a bottle if you like.</div>
          </div>
          <div class="timeline">
            <div class="tl-item">
              <div class="tl-time">Sunrise · Meeting</div>
              <div class="tl-title">Meet at the Temple of Heaven gate</div>
              <div class="tl-desc">Your English-speaking host meets you at the park entrance. The city is still quiet; the regulars are already warming up. <span class="cn">天坛公园门口集合 · 英语接待</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">+15 min · Warm-Up</div>
              <div class="tl-title">Breath, stance and the first movements</div>
              <div class="tl-desc">The master starts with posture and breathing, then the opening movements of the 8-form — slowly, with corrections as you go. <span class="cn">站桩 · 呼吸 · 起势</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">+40 min · The 8-Form</div>
              <div class="tl-title">Move through the full form together</div>
              <div class="tl-desc">Repeat the eight movements with the group as the park fills around you. By the last round, the sequence starts to feel like breathing. <span class="cn">太极八式 · 集体练习 · 晨光</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">+75 min · Tea &amp; Chat</div>
              <div class="tl-title">Sit down with the master</div>
              <div class="tl-desc">Tea is brewed on site. Ask about the form, the park, or the 60-year-olds who move like water — there's no rush to leave. <span class="cn">品茶 · 与老师傅交流 · 自由提问</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section alt" id="compare">
      <div class="section alt-inner">
        <div class="section-head center">
          <div class="eyebrow">Price Comparison</div>
          <h2 class="section-title">Same movements. <span class="italic">A different setting.</span></h2>
          <p class="section-sub">Typical Western studio pricing for a 90-minute small-group Tai Chi class.</p>
        </div>
        <div class="cmp-wrap">
          <div class="cmp-head">
            <h3>Tai Chi at Temple of Heaven Pricing</h3>
            <span v-if="savingsPercent > 0" class="badge">Save {{ savingsPercent }}%</span>
          </div>
          <div class="cmp-labels"><span>Experience</span><span>Typical studio class</span><span>LVYV Beijing</span></div>
          <div class="cmp-body">
            <div class="cmp-row">
              <div class="label">Small-Group Tai Chi Class<span>90 min · all levels</span></div>
              <div class="away">$55</div>
              <div class="here">$10</div>
            </div>
            <div class="cmp-row">
              <div class="label">20-Year Master Instruction<span>Personal corrections throughout</span></div>
              <div class="away">$25</div>
              <div class="here">$5</div>
            </div>
            <div class="cmp-row">
              <div class="label">Temple of Heaven Setting &amp; Tea<span>Park entry and tea included</span></div>
              <div class="away">$10</div>
              <div class="here">$2</div>
            </div>
            <div class="cmp-row total">
              <div class="label">Total Morning<span>Everything above · 1.5 hours at sunrise</span></div>
              <div class="away">$90</div>
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
            <li><b>90-minute sunrise session</b> at the Temple of Heaven</li>
            <li><b>20-year Tai Chi master</b> leading the group</li>
            <li><b>The 8-form</b>, taught step by step and repeated together</li>
            <li><b>Personal corrections</b> from the master throughout</li>
            <li><b>English-speaking LVYV host</b> for translation</li>
            <li><b>Tea and conversation</b> with the master afterwards</li>
            <li><b>Temple of Heaven park entry</b> pre-arranged</li>
          </ul>
        </div>
        <div class="inc-card no">
          <div class="inc-title"><span class="badge">✗</span> Not Included</div>
          <ul class="inc-list">
            <li>Private one-to-one session (from $50)</li>
            <li>Tai Chi sword or fan workshop (from $12)</li>
            <li>Breakfast after the session</li>
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
      description="1.5h · sunrise · Temple of Heaven · 20-year master · Tea after"
      bundle-label="Tai Chi"
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
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 0" @click="toggleFaq(0)"><span class="n">01</span> Do I need Tai Chi experience? <span class="toggle">+</span></button>
                <div class="faq-a">None. The master starts from zero and <b>breaks the 8-form down movement by movement</b>. Most guests have never practised before — that's exactly why they come.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 1 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 1" @click="toggleFaq(1)"><span class="n">02</span> How early is sunrise? <span class="toggle">+</span></button>
                <div class="faq-a">It depends on the season. We send the <b>exact meeting time the day before</b> — usually between 5:30 and 7:00. The early hour is the point: the park is quiet and the light is beautiful.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 2 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 2" @click="toggleFaq(2)"><span class="n">03</span> Is it really at the Temple of Heaven? <span class="toggle">+</span></button>
                <div class="faq-a">Yes — we practise <b>on the temple grounds</b>, alongside local regulars. It's an open park session, not a private studio. Park entry is included in the price.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 3 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 3" @click="toggleFaq(3)"><span class="n">04</span> What should I wear? <span class="toggle">+</span></button>
                <div class="faq-a"><b>Loose, comfortable layers and flat shoes</b>. Morning temperatures can be cooler than the day, so bring a light layer you can take off once you're moving.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 4 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 4" @click="toggleFaq(4)"><span class="n">05</span> Can I continue with a private lesson? <span class="toggle">+</span></button>
                <div class="faq-a">Yes. <b>Private one-to-one sessions start at $50</b>, and a Tai Chi sword or fan workshop can be added from $12. Ask the master or your host on the morning.</div>
              </div>
            </div>
          </div>
        </section>

        <section class="cta-band" id="book">
          <div class="cta-inner">
            <div class="eyebrow">Ready?</div>
            <h2>Before the city <span class="italic">wakes up.</span></h2>
            <p>{{ basePriceText }} · 1.5h sunrise Tai Chi · Temple of Heaven · 20-year master · 8-form · Tea and chat after</p>
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

const product = encounterProducts.find(item => item.code === 'ENC-BJ-TEMPLE-OF-HEAVEN-TAI-CHI')!
const { productName, sku, status, refresh } = await useEncounterProduct(product, {
  title: "Tai Chi at Temple of Heaven, Beijing — $17 vs $90 Studio Class | LVYV Encounters",
  description: "Sunrise Tai Chi session with a 20-year master at the Temple of Heaven. Learn the 8-form, then stay for tea and conversation. $17 — 80% less than a studio class.",
})
const booking = useTemplateRef('booking')

const activeFaq = ref<number | null>(0)
function toggleFaq(index: number) {
  activeFaq.value = activeFaq.value === index ? null : index
}

const originalPrice = 17
const basePrice = computed(() => sku.value?.price ?? originalPrice)
const basePriceText = computed(() => encounterPrice(basePrice.value))
const savingsPercent = computed(() => basePrice.value === originalPrice
  ? 80
  : Math.round((1 - basePrice.value / 90) * 100))
</script>

<style src="~/assets/css/encounter-experience.css"></style>
