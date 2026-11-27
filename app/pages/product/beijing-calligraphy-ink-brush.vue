<template>
  <main class="encounter-experience-detail">
    <section class="hero" id="hero">
      <div class="hero-img" style="background-image:url('/images/encounters/wellness/calligraphy/calligraphy-table.webp');"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-crumb">
          <a href="/encounters">Encounters</a>
          <span class="sep">/</span>
          <a href="/encounters#beijing">Beijing</a>
          <span class="sep">/</span>
          <span>{{ productName }}</span>
        </div>
        <div class="hero-eyebrow">Craft Encounter · Beijing</div>
        <h1>Your Name In<br /><span class="italic">Seal Script</span></h1>
        <p class="hero-hook">"My handwriting looked like a 5-year-old's. The master said that's the point."</p>
        <div class="hero-meta">
          <div class="hero-meta-item">⏱ <b>2h</b> total</div>
          <div class="hero-meta-item">🖌 <b>Master calligrapher</b></div>
          <div class="hero-meta-item">🪨 <b>Carve your own seal</b></div>
          <div class="hero-meta-item">🖼 <b>Mounted work</b> to take home</div>
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
        <div v-if="savingsPercent > 0" class="note">Save {{ savingsPercent }}% vs art class</div>
        <div class="compare-mini">$70 at an art class</div>
      </div>
    </section>

    <div class="strip">
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/calligraphy/calligraphy-table.webp');"><div class="strip-label">Brush &amp; Ink · 笔墨</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/calligraphy/seal-stones.webp');"><div class="strip-label">The Seal Stones · 印石</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/calligraphy/carving-hands.webp');"><div class="strip-label">Carving · 篆刻</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/calligraphy/seal-stamps.webp');"><div class="strip-label">Finished Seals · 印章</div></div>
    </div>

    <div class="section" style="padding-top:48px;padding-bottom:0;">
      <div class="hook-block">
        <div class="quote">"<span class="accent">My handwriting looked like a 5-year-old's.</span> The master said <span class="accent">that's the point.</span>"</div>
        <div class="attribution">— <span class="name">Olivia M.</span>, Melbourne · Calligraphy &amp; Seal Carving Workshop, Beijing · Oct 2025</div>
      </div>
    </div>

    <section class="section" id="therapy">
      <div class="section-head center">
        <div class="eyebrow">What Happens</div>
        <h2 class="section-title">Brush, stone, <span class="italic">your name</span>.</h2>
        <p class="section-sub">Two hours at the master's table — learn the brush strokes, write your name in seal script, then carve it into a stone seal of your own. Everything is yours to take home, mounted and ready.</p>
      </div>
      <div class="card-grid">
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/calligraphy/calligraphy-table.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">01 · The Brush</div>
            <h3>Brush &amp; Ink With a Master</h3>
            <div class="svc-cn">毛笔书法 · Shū Fǎ</div>
            <p>A master calligrapher teaches you how to hold the brush, load the ink and move through the basic strokes. You copy from a model book, then write your name yourself — slowly, badly, and then better.</p>
            <p class="svc-hook">"He said my crooked lines were more interesting than his perfect ones."</p>
            <span class="svc-tag">Master-led · all materials included</span>
          </div>
        </div>
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/calligraphy/seal-stones.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">02 · The Script</div>
            <h3>Write Your Name in Seal Script</h3>
            <div class="svc-cn">篆书 · Zhuàn Shū</div>
            <p>Seal script is the oldest form of Chinese writing — each character drawn like a small picture. The master translates your name into its seal-script form, and you lay it out on rice paper before carving.</p>
            <p class="svc-hook">"I've never seen my name look like that. I love it."</p>
            <span class="svc-tag">Your name · 3,000-year-old script</span>
          </div>
        </div>
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/calligraphy/carving-hands.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">03 · The Seal</div>
            <h3>Carve &amp; Take Home</h3>
            <div class="svc-cn">篆刻 · Zhuàn Kè</div>
            <p>Choose a soft stone, fix it in the holder and cut your characters with a traditional knife. Ink it, press it onto red seal paste, and stamp it beside your calligraphy. We mount the sheet so it's ready to frame.</p>
            <p class="svc-hook">"It's crooked, it's mine, and it's on my wall at home."</p>
            <span class="svc-tag">Carve a real seal · mounted to take home</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section alt">
      <div class="section alt-inner" id="timeline">
        <div class="section-head">
          <div class="eyebrow">Your Afternoon</div>
          <h2 class="section-title">Two hours at <span class="italic">the table</span></h2>
        </div>
        <div class="tl-wrap">
          <div class="tl-aside">
            <h3>Everything in one workshop</h3>
            <p>A small-group session at the master's table in a traditional Beijing studio. No experience needed — the master starts from zero and guides your hand throughout.</p>
            <div class="tl-note"><b>Good to know:</b> Wear something you don't mind getting a little ink on. Aprons, brushes, paper, stone and seal paste are all provided. Tell us how you'd like your name written when you book.</div>
          </div>
          <div class="timeline">
            <div class="tl-item">
              <div class="tl-time">14:00 · Arrival</div>
              <div class="tl-title">Tea at the studio</div>
              <div class="tl-desc">Your English-speaking host welcomes you with tea. Brushes, ink stones and a model book are laid out on the table. <span class="cn">工作室入座 · 英语接待 · 清茶</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">14:15 · Brush &amp; Ink</div>
              <div class="tl-title">Learn the strokes from the master</div>
              <div class="tl-desc">Posture, grip, ink load and the basic strokes. The master demonstrates slowly, then corrects your hand as you practise on rice paper. <span class="cn">执笔 · 运笔 · 基本笔画 · 手把手教学</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">14:50 · Seal Script</div>
              <div class="tl-title">Write your name, 3,000 years old</div>
              <div class="tl-desc">The master writes your name in seal script. You copy it, choose a layout, and transfer it to the stone before cutting. <span class="cn">篆书 · 名字翻译 · 印面布局</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">15:30 · Carve &amp; Stamp</div>
              <div class="tl-title">Your seal, your signature</div>
              <div class="tl-desc">Cut the characters into the stone, ink the surface and stamp it in red beside your calligraphy. We mount the sheet to take home. <span class="cn">刻印 · 钤印 · 作品装裱带走</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section alt" id="compare">
      <div class="section alt-inner">
        <div class="section-head center">
          <div class="eyebrow">Price Comparison</div>
          <h2 class="section-title">Same craft. <span class="italic">A different city.</span></h2>
          <p class="section-sub">Typical Western art-class pricing for a two-hour, master-led calligraphy and seal-carving workshop.</p>
        </div>
        <div class="cmp-wrap">
          <div class="cmp-head">
            <h3>Calligraphy &amp; Seal Carving Pricing</h3>
            <span v-if="savingsPercent > 0" class="badge">Save {{ savingsPercent }}%</span>
          </div>
          <div class="cmp-labels"><span>Experience</span><span>Typical art class</span><span>LVYV Beijing</span></div>
          <div class="cmp-body">
            <div class="cmp-row">
              <div class="label">Master-Led Brush &amp; Ink Session<span>2 hours · small group · all levels</span></div>
              <div class="away">$40</div>
              <div class="here">$12</div>
            </div>
            <div class="cmp-row">
              <div class="label">Seal Script &amp; Stone Seal Carving<span>Your name · stone and knife included</span></div>
              <div class="away">$20</div>
              <div class="here">$7</div>
            </div>
            <div class="cmp-row">
              <div class="label">Mounting &amp; Take-Home Work<span>Ready to frame · English guide</span></div>
              <div class="away">$10</div>
              <div class="here">$3</div>
            </div>
            <div class="cmp-row total">
              <div class="label">Total Workshop<span>Everything above · 2 hours</span></div>
              <div class="away">$70</div>
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
            <li><b>2-hour workshop</b> with a master calligrapher</li>
            <li><b>Brush &amp; ink techniques</b>, taught from zero with personal corrections</li>
            <li><b>Your name in seal script</b>, laid out on rice paper</li>
            <li><b>Your own stone seal</b> — stone, knife and red seal paste included</li>
            <li><b>Your work mounted</b>, ready to frame and take home</li>
            <li><b>English-speaking LVYV host</b> and seal-script translation</li>
            <li><b>Tea, apron and all materials</b> provided</li>
          </ul>
        </div>
        <div class="inc-card no">
          <div class="inc-title"><span class="badge">✗</span> Not Included</div>
          <ul class="inc-list">
            <li>Private one-to-one session (from $60)</li>
            <li>Premium seal stones — jade, agate or ivory-style (from $15)</li>
            <li>Chinese frame for your mounted work (from $12)</li>
            <li>Hotel pickup and drop-off (available from $20)</li>
            <li>Flights, hotels and personal travel insurance</li>
          </ul>
        </div>
      </div>
    </section>

    <EncounterExperienceAddOns
      :product-code="product.code"
      :base-sku-code="sku?.skuCode"
      :base-price="sku?.price ?? null"
      :reference-price="originalPrice"
      :base-title="productName"
      description="2h · Beijing studio · Master calligrapher · Carve a seal · Mounted work included"
      bundle-label="Calligraphy Workshop"
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
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 0" @click="toggleFaq(0)"><span class="n">01</span> Do I need calligraphy experience? <span class="toggle">+</span></button>
                <div class="faq-a">None at all. The master starts from zero — <b>how to hold the brush, load the ink and make each stroke</b>. Most guests have never written Chinese calligraphy before; that's exactly why they come.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 1 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 1" @click="toggleFaq(1)"><span class="n">02</span> Will my name really fit in seal script? <span class="toggle">+</span></button>
                <div class="faq-a">Yes. The master translates the sounds of your name into <b>Chinese characters chosen for their meaning</b>, then writes them in the ancient seal script. Every guest leaves with a name that is uniquely theirs.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 2 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 2" @click="toggleFaq(2)"><span class="n">03</span> Do I get to keep the seal I carve? <span class="toggle">+</span></button>
                <div class="faq-a">Absolutely. The <b>stone seal is yours</b>, along with the mounted calligraphy stamped with your own red impression. We package both so they travel home safely.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 3 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 3" @click="toggleFaq(3)"><span class="n">04</span> Is carving difficult or dangerous? <span class="toggle">+</span></button>
                <div class="faq-a">The stone is soft and the knife is held in a fixed holder — <b>you push, never stab</b>. The master guides your hand, and gloves are provided. It's slower than it looks, but completely safe.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 4 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 4" @click="toggleFaq(4)"><span class="n">05</span> Can I book a private session? <span class="toggle">+</span></button>
                <div class="faq-a">Yes. <b>Private one-to-one sessions start at $60</b>, and premium seal stones or a Chinese frame for your work can be added from $15. Ask your host when booking.</div>
              </div>
            </div>
          </div>
        </section>

        <section class="cta-band" id="book">
          <div class="cta-inner">
            <div class="eyebrow">Ready?</div>
            <h2>Leave your mark. <span class="italic">In stone.</span></h2>
            <p>{{ basePriceText }} · 2h calligraphy &amp; seal carving · Beijing studio · Master calligrapher · Your name in seal script · Mounted work to take home</p>
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

const product = encounterProducts.find(item => item.code === 'ENC-BJ-CALLIGRAPHY-INK-BRUSH')!
const { productName, sku, status, refresh } = await useEncounterProduct(product, {
  title: "Calligraphy & Seal Carving Workshop in Beijing — $22 vs $70 Art Class | LVYV Encounters",
  description: "Learn brush techniques from a master calligrapher, write your name in seal script and carve your own stone seal. Take home mounted work. $22 — 68% less than a Western art class.",
})
const booking = useTemplateRef('booking')

const activeFaq = ref<number | null>(0)
function toggleFaq(index: number) {
  activeFaq.value = activeFaq.value === index ? null : index
}

const originalPrice = 22
const basePrice = computed(() => sku.value?.price ?? originalPrice)
const basePriceText = computed(() => encounterPrice(basePrice.value))
const savingsPercent = computed(() => basePrice.value === originalPrice
  ? 68
  : Math.round((1 - basePrice.value / 70) * 100))
</script>

<style src="~/assets/css/encounter-experience.css"></style>
