<template>
  <main class="encounter-experience-detail">
    <section class="hero" id="hero">
      <div class="hero-img" style="background-image:url('/images/encounters/wellness/xian-experiences/tang-tea/diancha-whisked.webp');"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-crumb">
          <a href="/encounters">Encounters</a>
          <span class="sep">/</span>
          <a href="/encounters#xian">Xi'an</a>
          <span class="sep">/</span>
          <span>{{ productName }}</span>
        </div>
        <div class="hero-eyebrow">Culture · In Apothecary</div>
        <h1>The Original <span class="italic">Matcha</span>.</h1>
        <p class="hero-hook">"Japan learned matcha from here. This is the original."</p>
        <div class="hero-meta">
          <div class="hero-meta-item">⏱ <b>1.5h</b> ritual</div>
          <div class="hero-meta-item">🍵 <b>Ground</b> &amp; whisked</div>
          <div class="hero-meta-item">🧂 <b>Salted</b>, Tang-style</div>
          <div class="hero-meta-item">🗣 <b>English</b>-speaking</div>
        </div>
        <div class="hero-btns">
          <a href="#book" class="btn-book">Book This Encounter →</a>
          <a href="#compare" class="btn-ghost">See What's Included</a>
        </div>
      </div>
      <div class="hero-price-card">
        <div class="from">1.5-hour ritual</div>
        <div class="num">{{ basePriceText }}</div>
        <div class="per">/ person</div>
        <div v-if="savingsPercent > 0" class="note">Save {{ savingsPercent }}% · all-inclusive</div>
        <div class="compare-mini">$75 tea house</div>
      </div>
    </section>

    <div class="strip">
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/xian-experiences/tang-tea/tang-teatable.webp');"><div class="strip-label">Tang Tea Table · 唐式茶席</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/xian-experiences/tang-tea/tang-brazier.webp');"><div class="strip-label">Charcoal Brazier · 风炉</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/xian-experiences/tang-tea/tasting-salon.webp');"><div class="strip-label">Tea Tasting · 品茗雅集</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/xian-experiences/tang-tea/tasting-cup.webp');"><div class="strip-label">Celadon Cup · 青瓷茶盏</div></div>
    </div>

    <div class="section" style="padding-top:48px;padding-bottom:0;">
      <div class="hook-block">
        <div class="quote">"<span class="accent">Japan learned matcha from here.</span> <span class="accent">This is the original.</span>"</div>
        <div class="attribution">— <span class="name">A LVYV guest</span>, Xi'an · Tang Dynasty Tea Ritual</div>
      </div>
    </div>

    <section class="section" id="therapy">
      <div class="section-head center">
        <div class="eyebrow">What Happens</div>
        <h2 class="section-title">Ground, whisked, <span class="italic">and salted</span>.</h2>
        <p class="section-sub">This is tea as the Tang court drank it 1,300 years ago — a compressed cake, toasted over coals, ground to powder, whisked with hot water and a pinch of salt. It reached Japan centuries later and became matcha. Here you taste the source.</p>
      </div>
      <div class="card-grid">
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/xian-experiences/tang-tea/diancha-whisked.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">01 · The Whisk</div>
            <h3>Foam You Can Paint On</h3>
            <div class="svc-cn">点茶 · Diǎn Chá</div>
            <p>Tea powder goes into a wide bowl, hot water is added, and a bamboo whisk turns it into a thick green foam. You will learn the wrist motion that raises a fine, lasting froth — then try painting a simple pattern on top, the Tang way.</p>
            <p class="svc-hook">"Japan learned matcha from here. This is the original."</p>
            <span class="svc-tag">Bamboo whisk · foam art</span>
          </div>
        </div>
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/xian-experiences/tang-tea/diancha-roast.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">02 · The Cake</div>
            <h3>Toast, Grind, Sift</h3>
            <div class="svc-cn">炙茶碾茶 · Zhì Chá Niǎn Chá</div>
            <p>Before there were loose leaves, tea came as a compressed cake. You hold it over a small charcoal brazier until it smells nutty, then grind it in a stone mill and sift the powder fine. Lu Yu, the Tang "Sage of Tea", wrote down the method — we follow it.</p>
            <p class="svc-hook">"A ritual older than Japan's matcha by 400 years."</p>
            <span class="svc-tag">Charcoal roast · stone ground</span>
          </div>
        </div>
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/xian-experiences/tang-tea/tang-master.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">03 · The Court</div>
            <h3>A Salted Cup, 1,300 Years Old</h3>
            <div class="svc-cn">唐煎茶 · Táng Jiān Chá</div>
            <p>Your teacher, dressed in Tang robes, boils the water over a brazier and adds the tea — and a pinch of salt, just as the court did. You taste it beside a row of celadon cups, with the steam rising and the room quiet.</p>
            <p class="svc-hook">"It tastes like the Tang dynasty sounds."</p>
            <span class="svc-tag">Tang robes · salted brew · celadon cups</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section alt">
      <div class="section alt-inner" id="timeline">
        <div class="section-head">
          <div class="eyebrow">Your Session</div>
          <h2 class="section-title">Ninety minutes, <span class="italic">one thousand years back</span></h2>
        </div>
        <div class="tl-wrap">
          <div class="tl-aside">
            <h3>From Lu Yu's book to your bowl</h3>
            <p>In the 8th century, Lu Yu wrote the <i>Classic of Tea</i> — the first book ever devoted to the leaf. The Tang court drank tea as a whisked, salted preparation, and that method travelled east to become Japanese matcha. You will taste the original version, made by hand.</p>
            <div class="tl-note"><b>Good to know:</b> Your teacher wears Tang robes and speaks English. Everything is made from scratch in front of you. Come with an appetite for ceremony — you will sit low at a traditional bamboo table.</div>
          </div>
          <div class="timeline">
            <div class="tl-item">
              <div class="tl-time">00:00 · Meet the Tea Cake</div>
              <div class="tl-title">A compressed cake, and a 1,300-year story</div>
              <div class="tl-desc">Your teacher introduces the tools, the tea cake and Lu Yu's <i>Classic of Tea</i> — then explains how this whisked tea reached Japan 400 years before matcha took shape. <span class="cn">茶饼 · 陆羽茶经 · 英语讲解</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">00:20 · Toast &amp; Grind</div>
              <div class="tl-title">Over coals, then into the stone mill</div>
              <div class="tl-desc">You toast the cake over a small brazier until it releases its aroma, grind it to powder and sift it fine. The smell at this stage is worth the whole class. <span class="cn">炙茶 · 石磨碾茶 · 过筛</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">00:45 · Whisk &amp; Paint</div>
              <div class="tl-title">A bamboo whisk and a bowl of foam</div>
              <div class="tl-desc">Hot water goes into the bowl, powder follows, and the whisk turns it into a thick green froth. You try the motion yourself, then paint a simple leaf or flower on the foam. <span class="cn">点茶 · 茶筅击拂 · 茶百戏</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">01:15 · Taste &amp; Talk</div>
              <div class="tl-title">Salted tea in a celadon cup</div>
              <div class="tl-desc">The Tang way: a pinch of salt in the brew, drunk from a pale green cup. Sit, sip and ask everything you ever wanted to know about Chinese tea. <span class="cn">唐式加盐 · 青瓷茶盏 · 品茗问答</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section alt" id="compare">
      <div class="section alt-inner">
        <div class="section-head center">
          <div class="eyebrow">What It Costs</div>
          <h2 class="section-title">The original. <span class="italic">A third of the price</span>.</h2>
          <p class="section-sub">A comparable Tang-style tea ceremony in a Western tea house costs around $75. Here it is {{ basePriceText }} — every ingredient, the master class and the tea you drink all included.</p>
        </div>
        <div class="cmp-wrap">
          <div class="cmp-head">
            <h3>Tang Dynasty Tea Ritual — Price Breakdown</h3>
            <span v-if="savingsPercent > 0" class="badge">Save {{ savingsPercent }}%</span>
          </div>
          <div class="cmp-labels"><span>Experience</span><span>Back Home</span><span>LVYV Xi'an</span></div>
          <div class="cmp-body">
            <div class="cmp-row">
              <div class="label">1.5-Hour Tang Tea Ritual<span>Small group, Tang-robed English-speaking teacher</span></div>
              <div class="away">$75</div>
              <div class="here">{{ basePriceText }}</div>
            </div>
            <div class="cmp-row">
              <div class="label">Compressed Tea Cake &amp; Grinding<span>Roasted and stone-ground in front of you</span></div>
              <div class="away">+$18</div>
              <div class="here">included</div>
            </div>
            <div class="cmp-row">
              <div class="label">Celadon Cups &amp; Tea Tasting<span>The full court-style service</span></div>
              <div class="away">+$10</div>
              <div class="here">included</div>
            </div>
            <div class="cmp-row total">
              <div class="label">Ritual Price You Pay<span>Everything above · 1.5 hours</span></div>
              <div class="away">$75</div>
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
            <li><b>90-minute hands-on ritual</b>, Tang-robed English-speaking teacher</li>
            <li><b>Compressed tea cake</b>, toasted and stone-ground by you</li>
            <li><b>Bamboo whisk and foam art</b> — you paint your own bowl</li>
            <li><b>Tang-style salted tea</b> in celadon cups</li>
            <li><b>The story of Lu Yu</b> and how matcha travelled to Japan</li>
            <li><b>Traditional bamboo tea table</b> seating</li>
            <li><b>All tea, tools and water</b> for the session</li>
          </ul>
        </div>
        <div class="inc-card no">
          <div class="inc-title"><span class="badge">✗</span> Not Included</div>
          <ul class="inc-list">
            <li>Take-home tea cake or whisk (available to buy separately)</li>
            <li>Full tea tasting flight beyond the ritual</li>
            <li>Hotel pickup and drop-off (available from $20)</li>
            <li>Other tea ceremonies or cooking classes</li>
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
      description="1.5h · ground &amp; whisked · pinch of salt · foam art · Tang-robed teacher · In Apothecary"
      bundle-label="Tang Dynasty Tea Ritual"
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
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 0" @click="toggleFaq(0)"><span class="n">01</span> How is this different from Japanese matcha? <span class="toggle">+</span></button>
                <div class="faq-a">This is the earlier version. Tang China whisked powdered tea with hot water <b>and a pinch of salt</b> 1,300 years ago; the method travelled to Japan and became matcha some 400 years later. Same family of tea, older recipe, and a different ritual around it.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 1 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 1" @click="toggleFaq(1)"><span class="n">02</span> Who was Lu Yu? <span class="toggle">+</span></button>
                <div class="faq-a">Lu Yu was the Tang dynasty "Sage of Tea" who wrote the <b>Classic of Tea</b> — the first book in the world devoted entirely to tea. Your teacher explains his method as you work, so the class is part history lesson, part hands-on tasting.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 2 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 2" @click="toggleFaq(2)"><span class="n">03</span> Do I need tea experience? <span class="toggle">+</span></button>
                <div class="faq-a">None. The teacher guides your hand with the whisk and the stone mill. The foam art looks harder than it is — most people get a simple leaf or flower on their second try, and a lopsided one still tastes the same.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 3 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 3" @click="toggleFaq(3)"><span class="n">04</span> Does it contain caffeine? <span class="toggle">+</span></button>
                <div class="faq-a">Yes — it is real tea, so there is caffeine, though the small ceremonial servings are modest. If you are sensitive to caffeine or visiting late at night, <b>tell your teacher</b> and they can adjust the strength.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 4 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 4" @click="toggleFaq(4)"><span class="n">05</span> Can I take anything home? <span class="toggle">+</span></button>
                <div class="faq-a">The class includes all the tea you drink during the session. <b>Tea cakes, whisks and celadon cups are available to buy</b> at the venue if you want to continue at home — just ask your teacher after the ritual.</div>
              </div>
            </div>
          </div>
        </section>

        <section class="cta-band" id="book">
          <div class="cta-inner">
            <div class="eyebrow">Ready?</div>
            <h2>Drink the <span class="italic">original</span>.</h2>
            <p>{{ basePriceText }} · 1.5h · ground &amp; whisked Tang-style tea · pinch of salt · foam art · Tang-robed English-speaking teacher · In Apothecary, Xi'an</p>
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

const product = encounterProducts.find(item => item.code === 'ENC-XA-TANG-DYNASTY-TEA-RITUAL')!
const { productName, sku, status, refresh } = await useEncounterProduct(product, {
  title: "Tang Dynasty Tea Ritual in Xi'an — $21 Whisked Tea Ceremony | LVYV Encounters",
  description: "Experience tea the way Xi'an's Tang court did 1,300 years ago — ground, whisked and salted. A ritual older than Japan's matcha by 400 years. 1.5 hours, $21 — normally $75. Japan learned matcha from here. This is the original.",
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
  ? 72
  : Math.round((1 - basePrice.value / 75) * 100))
</script>

<style src="~/assets/css/encounter-experience.css"></style>
