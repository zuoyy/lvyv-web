<template>
  <main class="encounter-experience-detail">
    <section class="hero" id="hero">
      <div class="hero-img" style="background-image:url('/images/encounters/wellness/xian-experiences/hanfu-wall/hanfu-red-flow.webp');"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-crumb">
          <a href="/encounters">Encounters</a>
          <span class="sep">/</span>
          <a href="/encounters#xian">Xi'an</a>
          <span class="sep">/</span>
          <span>{{ productName }}</span>
        </div>
        <div class="hero-eyebrow">Culture · Sunset</div>
        <h1>2,000 Years Old.<br /><span class="italic">One Golden Hour</span>.</h1>
        <p class="hero-hook">"Walked a 600-year-old wall in a 2,000-year-old outfit. Felt like time travel."</p>
        <div class="hero-meta">
          <div class="hero-meta-item">⏱ <b>2h</b> at sunset</div>
          <div class="hero-meta-item">👘 <b>Hanfu</b> dress-up</div>
          <div class="hero-meta-item">📷 <b>5 edited</b> photos</div>
          <div class="hero-meta-item">🗣 <b>English</b>-speaking</div>
        </div>
        <div class="hero-btns">
          <a href="#book" class="btn-book">Book This Encounter →</a>
          <a href="#compare" class="btn-ghost">See What's Included</a>
        </div>
      </div>
      <div class="hero-price-card">
        <div class="from">2-hour sunset session</div>
        <div class="num">{{ basePriceText }}</div>
        <div class="per">/ person</div>
        <div v-if="savingsPercent > 0" class="note">Save {{ savingsPercent }}% · 5 edited shots</div>
        <div class="compare-mini">$150 photo studio</div>
      </div>
    </section>

    <div class="strip">
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/xian-experiences/hanfu-wall/hanfu-street.webp');"><div class="strip-label">Hanfu in the Street · 汉服街头</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/xian-experiences/hanfu-wall/hanfu-friends.webp');"><div class="strip-label">Walk the Wall · 城墙漫游</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/xian-experiences/hanfu-wall/city-wall-night.webp');"><div class="strip-label">Ming City Wall · 明城墙</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/xian-experiences/hanfu-wall/hanfu-rain.webp');"><div class="strip-label">The Shoot · 古风写真</div></div>
    </div>

    <div class="section" style="padding-top:48px;padding-bottom:0;">
      <div class="hook-block">
        <div class="quote">"<span class="accent">Walked a 600-year-old wall in a 2,000-year-old outfit.</span> <span class="accent">Felt like time travel.</span>"</div>
        <div class="attribution">— <span class="name">A LVYV guest</span>, Xi'an · Hanfu Dress-Up + City Wall Walk</div>
      </div>
    </div>

    <section class="section" id="therapy">
      <div class="section-head center">
        <div class="eyebrow">What Happens</div>
        <h2 class="section-title">Dress the part. <span class="italic">Walk the wall</span>.</h2>
        <p class="section-sub">Put on traditional Hanfu, step onto Xi'an's 600-year-old Ming city wall at sunset, and let a professional photographer catch the light. Five edited shots are yours to keep — the rest is just walking through 2,000 years of history in costume.</p>
      </div>
      <div class="card-grid">
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/xian-experiences/hanfu-wall/hanfu-street.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">01 · The Outfit</div>
            <h3>Dressed in Hanfu</h3>
            <div class="svc-cn">汉服换装 · Hàn Fú Huàn Zhuāng</div>
            <p>Choose a Hanfu outfit from a full rack of robes, layers and accessories, and get dressed with help from the team. Flowing sleeves, wide skirts, hairpieces and all — you leave looking like you stepped out of a Tang painting.</p>
            <p class="svc-hook">"Walked a 600-year-old wall in a 2,000-year-old outfit."</p>
            <span class="svc-tag">Full Hanfu + hair &amp; accessories</span>
          </div>
        </div>
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/xian-experiences/hanfu-wall/city-wall-night.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">02 · The Wall</div>
            <h3>Six Hundred Years Underfoot</h3>
            <div class="svc-cn">明城墙漫步 · Míng Chéng Qiáng Màn Bù</div>
            <p>The Ming city wall is the oldest and best preserved in China — 600 years of bricks wide enough to walk for hours. You stroll the ramparts as the sun drops over the city, with the towers lighting up below you.</p>
            <p class="svc-hook">"The whole wall turned gold, then the lanterns came on."</p>
            <span class="svc-tag">Sunset timing · 13.7km of wall</span>
          </div>
        </div>
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/xian-experiences/hanfu-wall/hanfu-friends.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">03 · The Photos</div>
            <h3>Five Shots You'll Actually Frame</h3>
            <div class="svc-cn">古风写真 · Gǔ Fēng Xiě Zhēn</div>
            <p>A professional photographer poses you along the wall and the old streets, using the last light of the day. You get <b>5 professionally edited shots</b> to download and keep — no awkward phone selfies, no waiting weeks for an album.</p>
            <p class="svc-hook">"Felt like time travel. The photos look like a film still."</p>
            <span class="svc-tag">Pro photographer · 5 edited shots</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section alt">
      <div class="section alt-inner" id="timeline">
        <div class="section-head">
          <div class="eyebrow">Your Session</div>
          <h2 class="section-title">Two hours, <span class="italic">one golden hour</span></h2>
        </div>
        <div class="tl-wrap">
          <div class="tl-aside">
            <h3>Timed for the light</h3>
            <p>Hanfu is more than a costume — it is the shape of a different century. We time the walk for sunset, when the wall turns gold and the lanterns come on, so the photos look like a scene from old Chang'an rather than a tourist snapshot.</p>
            <div class="tl-note"><b>Good to know:</b> Sessions start before sunset — we will confirm the exact time with you based on the season. Wear flat shoes for the wall, and bring a layer for the breeze. English-speaking help throughout.</div>
          </div>
          <div class="timeline">
            <div class="tl-item">
              <div class="tl-time">00:00 · Pick Your Hanfu</div>
              <div class="tl-title">Robe, layers, hairpiece, done</div>
              <div class="tl-desc">Choose from a full rack of Hanfu in different colours and dynasties. The team helps you dress, styles your hair and checks the details before you step outside. <span class="cn">挑选汉服 · 换装造型 · 配饰齐全</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">00:30 · Walk the Wall</div>
              <div class="tl-title">600 years of Chang'an underfoot</div>
              <div class="tl-desc">You walk onto the Ming city wall as the light softens — the old towers, the city below, the breeze across the ramparts. Your photographer follows, scouting angles as you go. <span class="cn">登明城墙 · 日落漫步 · 古都全景</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">01:00 · The Photoshoot</div>
              <div class="tl-title">Posed, but never stiff</div>
              <div class="tl-desc">Sleeves in the air, a look back over the shoulder, a quiet moment on the steps — your photographer directs you into natural poses and shoots until the light fades. <span class="cn">古风摆拍 · 专业摄影 · 黄金光线</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">01:40 · Five Edited Shots</div>
              <div class="tl-title">Keep the best of the evening</div>
              <div class="tl-desc">Pick your favourites and receive <b>5 professionally edited images</b> to download. Change back into your own clothes, and walk off the wall feeling a few centuries lighter. <span class="cn">精选 5 张精修照 · 即刻可用 · 换装还原</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section alt" id="compare">
      <div class="section alt-inner">
        <div class="section-head center">
          <div class="eyebrow">What It Costs</div>
          <h2 class="section-title">Same photos. <span class="italic">A third of the price</span>.</h2>
          <p class="section-sub">A Hanfu rental plus a sunset photo shoot at a studio abroad runs around $150. Here it is {{ basePriceText }} — outfit, styling, wall walk and 5 edited shots all included.</p>
        </div>
        <div class="cmp-wrap">
          <div class="cmp-head">
            <h3>Hanfu Dress-Up + City Wall Walk — Price Breakdown</h3>
            <span v-if="savingsPercent > 0" class="badge">Save {{ savingsPercent }}%</span>
          </div>
          <div class="cmp-labels"><span>Experience</span><span>Photo Studio</span><span>LVYV Xi'an</span></div>
          <div class="cmp-body">
            <div class="cmp-row">
              <div class="label">2-Hour Sunset Session<span>Hanfu, wall walk and professional shoot</span></div>
              <div class="away">$150</div>
              <div class="here">{{ basePriceText }}</div>
            </div>
            <div class="cmp-row">
              <div class="label">Hanfu Outfit &amp; Hair Styling<span>Robes, layers and accessories, usually rented separately</span></div>
              <div class="away">+$45</div>
              <div class="here">included</div>
            </div>
            <div class="cmp-row">
              <div class="label">5 Professional Edited Shots<span>Downloadable, no extra retouching fee</span></div>
              <div class="away">+$60</div>
              <div class="here">included</div>
            </div>
            <div class="cmp-row total">
              <div class="label">Session Price You Pay<span>Everything above · 2 hours at sunset</span></div>
              <div class="away">$150</div>
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
            <li><b>Full Hanfu outfit</b> — robe, layers, belt and hairpiece</li>
            <li><b>Dressing and hairstyling</b> by the local team</li>
            <li><b>2-hour guided walk</b> on the 600-year-old Ming city wall</li>
            <li><b>Professional photographer</b> throughout the session</li>
            <li><b>5 professionally edited photos</b>, downloadable</li>
            <li><b>English-speaking help</b> for the whole experience</li>
            <li><b>Sunset timing</b> confirmed to the season</li>
          </ul>
        </div>
        <div class="inc-card no">
          <div class="inc-title"><span class="badge">✗</span> Not Included</div>
          <ul class="inc-list">
            <li>City wall entrance ticket (payable at the gate)</li>
            <li>Additional edited photos beyond the 5 included</li>
            <li>Printed albums or framed photos</li>
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
      description="2h · sunset · Hanfu + styling · Ming city wall · photographer · 5 edited shots"
      bundle-label="Hanfu City Wall Walk"
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
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 0" @click="toggleFaq(0)"><span class="n">01</span> Do I need to know how to pose? <span class="toggle">+</span></button>
                <div class="faq-a">Not at all. The photographer poses you step by step — where to look, what to do with your sleeves, how to hold the fabric. Most guests are nervous for the first two minutes and then completely forget the camera is there.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 1 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 1" @click="toggleFaq(1)"><span class="n">02</span> Can men and children join? <span class="toggle">+</span></button>
                <div class="faq-a">Yes. We have Hanfu for men, women and children — the red-robed "imperial guard" and scholar styles are popular with men, and there are smaller sizes for kids. Groups of friends and families are especially welcome. <span class="accent">Tell us your sizes when booking.</span></div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 2 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 2" @click="toggleFaq(2)"><span class="n">03</span> When do I get the 5 edited photos? <span class="toggle">+</span></button>
                <div class="faq-a">You choose your favourites right after the shoot and receive <b>5 professionally edited images</b> to download — usually the same day or the next morning. Extra images can be purchased separately if you want more.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 3 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 3" @click="toggleFaq(3)"><span class="n">04</span> What if it rains or the weather is bad? <span class="toggle">+</span></button>
                <div class="faq-a">Light rain can make for beautiful, moody shots — we have seen it work. In heavy rain we will <b>reschedule to another sunset slot</b> or move the shoot under cover. We will never leave you soaking in a rented robe.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 4 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 4" @click="toggleFaq(4)"><span class="n">05</span> Is the city wall ticket included? <span class="toggle">+</span></button>
                <div class="faq-a">The experience, outfit and photos are included; the <b>city wall entrance ticket is paid at the gate</b> and is inexpensive. Your host will guide you through the entrance and tell you where to buy it.</div>
              </div>
            </div>
          </div>
        </section>

        <section class="cta-band" id="book">
          <div class="cta-inner">
            <div class="eyebrow">Ready?</div>
            <h2>Walk out of <span class="italic">a painting</span>.</h2>
            <p>{{ basePriceText }} · 2h at sunset · full Hanfu + styling · 600-year-old Ming city wall · professional photographer · 5 edited shots</p>
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

const product = encounterProducts.find(item => item.code === 'ENC-XA-HANFU-CITY-WALL-WALK')!
const { productName, sku, status, refresh } = await useEncounterProduct(product, {
  title: "Hanfu Dress-Up + City Wall Walk in Xi'an — $45 Sunset Photoshoot | LVYV Encounters",
  description: "Wear traditional Hanfu and walk Xi'an's 600-year-old Ming city wall at sunset, with a professional photoshoot and 5 edited shots. Two hours, $45 — a $150 photo studio experience. Walked a 600-year-old wall in a 2,000-year-old outfit. Felt like time travel.",
})
const booking = useTemplateRef('booking')

const activeFaq = ref<number | null>(0)
function toggleFaq(index: number) {
  activeFaq.value = activeFaq.value === index ? null : index
}

const originalPrice = 45
const basePrice = computed(() => sku.value?.price ?? originalPrice)
const basePriceText = computed(() => encounterPrice(basePrice.value))
const savingsPercent = computed(() => basePrice.value === originalPrice
  ? 70
  : Math.round((1 - basePrice.value / 150) * 100))
</script>

<style src="~/assets/css/encounter-experience.css"></style>
