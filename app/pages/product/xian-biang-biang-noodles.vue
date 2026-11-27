<template>
  <main class="encounter-experience-detail">
    <section class="hero" id="hero">
      <div class="hero-img" style="background-image:url('/images/encounters/wellness/xian-experiences/biang-noodles/biang-sign-pull.webp');"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-crumb">
          <a href="/encounters">Encounters</a>
          <span class="sep">/</span>
          <a href="/encounters#xian">Xi'an</a>
          <span class="sep">/</span>
          <span>{{ productName }}</span>
        </div>
        <div class="hero-eyebrow">Food · In Apothecary</div>
        <h1>58 Strokes.<br /><span class="italic">One Slap</span>.</h1>
        <p class="hero-hook">"58 strokes for one character. 1 slap for the best noodle I've ever had."</p>
        <div class="hero-meta">
          <div class="hero-meta-item">⏱ <b>1.5h</b> class</div>
          <div class="hero-meta-item">👐 <b>Hand-pull</b> &amp; slap</div>
          <div class="hero-meta-item">🌶️ <b>Chili oil</b> &amp; toppings</div>
          <div class="hero-meta-item">🗣 <b>English</b>-speaking</div>
        </div>
        <div class="hero-btns">
          <a href="#book" class="btn-book">Book This Encounter →</a>
          <a href="#compare" class="btn-ghost">See What's Included</a>
        </div>
      </div>
      <div class="hero-price-card">
        <div class="from">1.5-hour class</div>
        <div class="num">{{ basePriceText }}</div>
        <div class="per">/ person</div>
        <div v-if="savingsPercent > 0" class="note">Save {{ savingsPercent }}% · all-inclusive</div>
        <div class="compare-mini">$110 class</div>
      </div>
    </section>

    <div class="strip">
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/xian-experiences/biang-noodles/biang-sign-pull.webp');"><div class="strip-label">Belt-Wide Noodles · 裤带面</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/xian-experiences/biang-noodles/master-pull.webp');"><div class="strip-label">The Slap · 摔面</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/xian-experiences/biang-noodles/big-bowl.webp');"><div class="strip-label">Chili Oil Bowl · 油泼辣子</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/xian-experiences/biang-noodles/biang-character.webp');"><div class="strip-label">58 Strokes · Biàng 字</div></div>
    </div>

    <div class="section" style="padding-top:48px;padding-bottom:0;">
      <div class="hook-block">
        <div class="quote">"<span class="accent">58 strokes for one character.</span> <span class="accent">1 slap for the best noodle I've ever had.</span>"</div>
        <div class="attribution">— <span class="name">A LVYV guest</span>, Xi'an · Biang Biang Noodle Master Class</div>
      </div>
    </div>

    <section class="section" id="therapy">
      <div class="section-head center">
        <div class="eyebrow">What Happens</div>
        <h2 class="section-title">Flour, water, <span class="italic">and a very loud slap</span>.</h2>
        <p class="section-sub">Biang biang noodles are Xi'an's belt-wide hand-pulled noodles — as wide as a belt, slapped against the board so you can hear the rhythm. You will pull them, cook them, dress them in chili oil, and eat the bowl you made yourself.</p>
      </div>
      <div class="card-grid">
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/xian-experiences/biang-noodles/master-pull.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">01 · The Pull</div>
            <h3>Hand-Pulled, Belt-Wide</h3>
            <div class="svc-cn">手工扯面 · Shǒu Gōng Chě Miàn</div>
            <p>A master noodle maker shows you how a simple strip of dough becomes a ribbon as wide as your belt. You will stretch, fold and slap it against the board — the sound is half the fun, and the technique is easier than it looks.</p>
            <p class="svc-hook">"One slap for the best noodle I've ever had."</p>
            <span class="svc-tag">Hand-pulled · 3 widths</span>
          </div>
        </div>
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/xian-experiences/biang-noodles/biang-character.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">02 · The Story</div>
            <h3>A Character With 58 Strokes</h3>
            <div class="svc-cn">Biàng 字 · Biàng Zì</div>
            <p>There is no ordinary character for "biang" — the one on the shop sign has 58 strokes, said to be the most complicated in Chinese. Your teacher tells the old story behind it while your dough rests, then shows you how locals say the word.</p>
            <p class="svc-hook">"58 strokes for one character — and one slap for the noodle."</p>
            <span class="svc-tag">The 58-stroke character · its legend</span>
          </div>
        </div>
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/xian-experiences/biang-noodles/big-bowl.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">03 · The Bowl</div>
            <h3>Chili Oil, Garlic, and Six Taels</h3>
            <div class="svc-cn">油泼辣子面 · Yóu Pō Là Zǐ Miàn</div>
            <p>Your noodles go into the pot, then into a big blue-and-white bowl. Hot oil is poured over chili flakes, garlic and green onion — the sizzle is the signal to dig in. Xi'an portions are famously generous: one bowl is a whole meal.</p>
            <p class="svc-hook">"A bowl so big the noodle nearly slapped me in the face."</p>
            <span class="svc-tag">Chili oil · eat what you make</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section alt">
      <div class="section alt-inner" id="timeline">
        <div class="section-head">
          <div class="eyebrow">Your Session</div>
          <h2 class="section-title">Ninety minutes, <span class="italic">one big bowl</span></h2>
        </div>
        <div class="tl-wrap">
          <div class="tl-aside">
            <h3>Listen for the slap</h3>
            <p>In Xi'an, a good noodle shop is a noisy one — the rhythmic slap of dough against the board tells you someone is pulling noodles by hand. In this class you learn that rhythm yourself, from a local master who has been doing it for years.</p>
            <div class="tl-note"><b>Good to know:</b> Come hungry — you will eat what you make, and the portions are large. Wear something comfortable; flour gets everywhere. Tell us about gluten intolerance or allergies before booking.</div>
          </div>
          <div class="timeline">
            <div class="tl-item">
              <div class="tl-time">00:00 · Meet the Dough</div>
              <div class="tl-title">Flour, water, and the 58-stroke story</div>
              <div class="tl-desc">Your teacher introduces the dough, the board and the famous "biang" character — 58 strokes, and a legend that locals love to retell. <span class="cn">和面 · Biàng 字的故事 · 英语讲解</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">00:20 · Pull &amp; Slap</div>
              <div class="tl-title">Stretch it wide, slap it loud</div>
              <div class="tl-desc">You will fold, stretch and slap your own ribbons of dough against the board. The master guides your hands until the strip is as wide as a belt and still holds together in the pot. <span class="cn">扯面 · 摔面 · 宽如裤带</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">00:50 · Boil &amp; Dress</div>
              <div class="tl-title">Hot oil over chili, garlic and onion</div>
              <div class="tl-desc">Your noodles boil while chili flakes, garlic and green onion wait in the bowl. Hot oil goes on top — the sizzle is the sound of dinner being ready. <span class="cn">煮面 · 油泼辣子 · 蒜香葱花</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">01:15 · Eat &amp; Talk</div>
              <div class="tl-title">The bowl you made, all to yourself</div>
              <div class="tl-desc">Sit down with your very own belt-wide noodles and a cup of tea. Compare notes with the others, ask about the noodle shops in town, and take the recipe card home. <span class="cn">吃自己做的面 · 喝茶 · 带走配方卡</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section alt" id="compare">
      <div class="section alt-inner">
        <div class="section-head center">
          <div class="eyebrow">What It Costs</div>
          <h2 class="section-title">Same noodles. <span class="italic">A sixth of the price</span>.</h2>
          <p class="section-sub">A comparable hands-on Chinese cooking class abroad costs around $110. Here it is {{ basePriceText }} — ingredients, instruction and the bowl you eat all included.</p>
        </div>
        <div class="cmp-wrap">
          <div class="cmp-head">
            <h3>Biang Biang Noodle Master Class — Price Breakdown</h3>
            <span v-if="savingsPercent > 0" class="badge">Save {{ savingsPercent }}%</span>
          </div>
          <div class="cmp-labels"><span>Experience</span><span>Back Home</span><span>LVYV Xi'an</span></div>
          <div class="cmp-body">
            <div class="cmp-row">
              <div class="label">1.5-Hour Hands-On Noodle Class<span>Small group, English-speaking master</span></div>
              <div class="away">$110</div>
              <div class="here">{{ basePriceText }}</div>
            </div>
            <div class="cmp-row">
              <div class="label">Flour, Toppings &amp; Chili Oil<span>All ingredients, usually supplied separately</span></div>
              <div class="away">+$20</div>
              <div class="here">included</div>
            </div>
            <div class="cmp-row">
              <div class="label">The Noodles You Make<span>Yes — you eat your own bowl</span></div>
              <div class="away">+$12</div>
              <div class="here">included</div>
            </div>
            <div class="cmp-row total">
              <div class="label">Class Price You Pay<span>Everything above · 1.5 hours</span></div>
              <div class="away">$110</div>
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
            <li><b>90-minute hands-on class</b> with a local noodle master</li>
            <li><b>All ingredients</b> — flour, water, chili oil, garlic and greens</li>
            <li><b>Your own belt-wide noodles</b> to cook and eat</li>
            <li><b>English-speaking teacher</b> and small group</li>
            <li><b>The 58-stroke story</b> and hands-on pulling technique</li>
            <li><b>Tea</b> and a sit-down meal of what you made</li>
            <li><b>Recipe card</b> to take home</li>
          </ul>
        </div>
        <div class="inc-card no">
          <div class="inc-title"><span class="badge">✗</span> Not Included</div>
          <ul class="inc-list">
            <li>Extra dishes or drinks beyond the class meal</li>
            <li>Take-home raw noodles or chili oil jars</li>
            <li>Hotel pickup and drop-off (available from $20)</li>
            <li>Other Xi'an cooking classes</li>
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
      description="1.5h · hand-pulled noodles · chili oil · 58-stroke story · eat what you make · In Apothecary"
      bundle-label="Noodle Class"
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
                <div class="faq-a">None at all. The master breaks the pulling and slapping down into simple steps and works alongside you. Most first-timers get a decent belt-wide ribbon by the second or third try — and the ones that tear still taste excellent.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 1 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 1" @click="toggleFaq(1)"><span class="n">02</span> Why is the "biang" character so complicated? <span class="toggle">+</span></button>
                <div class="faq-a">It has <b>58 strokes</b> and is said to be the most complex character in everyday Chinese. Locals tell a story about a scholar who invented it for the noodle shop he loved. Your teacher tells the full version during the class — it is half the fun.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 2 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 2" @click="toggleFaq(2)"><span class="n">03</span> How much noodles will I actually eat? <span class="toggle">+</span></button>
                <div class="faq-a">One very generous bowl — Xi'an portions are famous for being large, around six taels of dough per person. Come hungry and skip lunch. Anything you cannot finish is yours to take away.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 3 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 3" @click="toggleFaq(3)"><span class="n">04</span> Is it spicy? Can I make it mild? <span class="toggle">+</span></button>
                <div class="faq-a">The classic version uses <b>hot oil poured over chili flakes</b> and garlic. You control how much chili goes in — tell your teacher you want it mild and they will adjust. The chili oil is served on the side if you prefer.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 4 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 4" @click="toggleFaq(4)"><span class="n">05</span> What about gluten or food allergies? <span class="toggle">+</span></button>
                <div class="faq-a">This class is built around wheat flour and chili, so it is <b>not suitable for coeliac disease</b>. Tell us about any allergy when booking and we will confirm the ingredients beforehand or suggest a different encounter.</div>
              </div>
            </div>
          </div>
        </section>

        <section class="cta-band" id="book">
          <div class="cta-inner">
            <div class="eyebrow">Ready?</div>
            <h2>Come hungry. <span class="italic">Leave loud</span>.</h2>
            <p>{{ basePriceText }} · 1.5h · hand-pulled belt-wide noodles · chili oil &amp; toppings · the 58-stroke story · eat what you make · In Apothecary, Xi'an</p>
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

const product = encounterProducts.find(item => item.code === 'ENC-XA-BIANG-BIANG-NOODLES')!
const { productName, sku, status, refresh } = await useEncounterProduct(product, {
  title: "Biang Biang Noodle Master Class in Xi'an — $17 Hand-Pulled Noodles | LVYV Encounters",
  description: "Learn the art of Xi'an's famous belt-wide biang biang noodles — hand-pull, slap and cook, then eat with chili oil. 1.5 hours, $17 — normally $110. 58 strokes for one character, 1 slap for the best noodle you've ever had.",
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
  ? 84
  : Math.round((1 - basePrice.value / 110) * 100))
</script>

<style src="~/assets/css/encounter-experience.css"></style>
