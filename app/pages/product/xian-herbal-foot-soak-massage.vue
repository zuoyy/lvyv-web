<template>
  <main class="encounter-experience-detail">
    <section class="hero" id="hero">
      <div class="hero-img" style="background-image:url('/images/encounters/wellness/xian-experiences/foot-soak/foot-soak-herbs.webp');"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-crumb">
          <a href="/encounters">Encounters</a>
          <span class="sep">/</span>
          <a href="/encounters#xian">Xi'an</a>
          <span class="sep">/</span>
          <span>{{ productName }}</span>
        </div>
        <div class="hero-eyebrow">Herbal · Foot Ritual</div>
        <h1>Soak. Press. <span class="italic">Repeat</span>.</h1>
        <p class="hero-hook">"Silk Road traders did this 1,000 years ago. Still works."</p>
        <div class="hero-meta">
          <div class="hero-meta-item">⏱ <b>1.5h</b> session</div>
          <div class="hero-meta-item">🌿 <b>10</b> medicinal herbs</div>
          <div class="hero-meta-item">🦶 <b>Reflexology</b> massage</div>
          <div class="hero-meta-item">🗣 <b>English</b>-speaking</div>
        </div>
        <div class="hero-btns">
          <a href="#book" class="btn-book">Book This Encounter →</a>
          <a href="#compare" class="btn-ghost">See What's Included</a>
        </div>
      </div>
      <div class="hero-price-card">
        <div class="from">90-minute session</div>
        <div class="num">{{ basePriceText }}</div>
        <div class="per">/ person</div>
        <div v-if="savingsPercent > 0" class="note">Save {{ savingsPercent }}% · all-inclusive</div>
        <div class="compare-mini">$80 US</div>
      </div>
    </section>

    <div class="strip">
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/xian-experiences/foot-soak/herbal-counter.webp');"><div class="strip-label">The Herb Counter · 药材台</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/xian-experiences/foot-soak/foot-soak-herbs.webp');"><div class="strip-label">Ten-Herb Soak · 十味足浴</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/xian-experiences/foot-soak/tuina-massage.webp');"><div class="strip-label">Reflexology · 足底按摩</div></div>
      <div class="strip-item" style="background-image:url('/images/encounters/wellness/xian-experiences/foot-soak/shoulder-massage.webp');"><div class="strip-label">Body Massage · 推拿放松</div></div>
    </div>

    <div class="section" style="padding-top:48px;padding-bottom:0;">
      <div class="hook-block">
        <div class="quote">"<span class="accent">Silk Road traders did this 1,000 years ago.</span> <span class="accent">Still works.</span>"</div>
        <div class="attribution">— <span class="name">A LVYV guest</span>, Xi'an · Herbal Foot Soak + Massage</div>
      </div>
    </div>

    <section class="section" id="therapy">
      <div class="section-head center">
        <div class="eyebrow">What Happens</div>
        <h2 class="section-title">Feet first. <span class="italic">Then everything else</span>.</h2>
        <p class="section-sub">Ten medicinal herbs steeped in hot water, then a slow reflexology massage of the feet and lower legs. This is the remedy Silk Road travelers used to walk farther, sleep better and shake off the damp — updated for tired modern feet.</p>
      </div>
      <div class="card-grid">
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/xian-experiences/foot-soak/foot-soak-herbs.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">01 · The Soak</div>
            <h3>Ten Herbs in a Wooden Tub</h3>
            <div class="svc-cn">十味草本足浴 · Shí Wèi Cǎo Běn Zú Yù</div>
            <p>You choose from ten medicinal herbs laid out on the counter — angelica, astragalus, ginger, mugwort, goji and more. They steep in a wooden tub of hot water until the whole room smells like an old apothecary.</p>
            <p class="svc-hook">"Silk Road traders did this 1,000 years ago. Still works."</p>
            <span class="svc-tag">10 herbs · your own blend</span>
          </div>
        </div>
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/xian-experiences/foot-soak/tuina-massage.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">02 · The Massage</div>
            <h3>Reflexology, Point by Point</h3>
            <div class="svc-cn">足底反射按摩 · Zú Dǐ Fǎn Shè Àn Mó</div>
            <p>After the soak, your practitioner works the soles, arches and lower legs — pressing the reflex points linked to the stomach, liver, kidneys and head. Firm where it needs to be, gentle where it doesn't.</p>
            <p class="svc-hook">"My feet felt ten years younger by the time we stood up."</p>
            <span class="svc-tag">Feet + lower legs · 40 minutes</span>
          </div>
        </div>
        <div class="svc-card">
          <div class="svc-img" style="background-image:url('/images/encounters/wellness/xian-experiences/foot-soak/ginger-steam.webp');"></div>
          <div class="svc-body">
            <div class="svc-num">03 · The Ritual</div>
            <h3>Dampness Out, Lightness In</h3>
            <div class="svc-cn">草本姜蒸 · Cǎo Běn Jiāng Zhēng</div>
            <p>A warm herbal steam finishes the session — especially good after a long day of walking or a damp northern winter. You leave with dry, soft feet, a clear head and a cup of herbal tea still in hand.</p>
            <p class="svc-hook">"I came in with cold feet and left in socks, not boots."</p>
            <span class="svc-tag">For cold, dampness &amp; long walking days</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section alt">
      <div class="section alt-inner" id="timeline">
        <div class="section-head">
          <div class="eyebrow">Your Session</div>
          <h2 class="section-title">Ninety minutes, <span class="italic">start to finish</span></h2>
        </div>
        <div class="tl-wrap">
          <div class="tl-aside">
            <h3>The traveler's fix, still worth doing</h3>
            <p>Caravans crossing the Silk Road soaked their feet in whatever herbs grew nearby, then massaged the soreness away before the next stretch of desert. We use the same idea: hot water, real herbs, and a practitioner who knows where to press.</p>
            <div class="tl-note"><b>Good to know:</b> Arrive with clean feet — we'll provide linens and a private foot tub. Wear loose trousers you can roll up. Tell us about any foot injury, skin condition or pregnancy before starting.</div>
          </div>
          <div class="timeline">
            <div class="tl-item">
              <div class="tl-time">00:00 · Welcome &amp; Herb Choice</div>
              <div class="tl-title">Pick your ten herbs</div>
              <div class="tl-desc">A short consultation on sleep, cold feet, digestion and energy. Your practitioner helps you choose from ten medicinal herbs on the counter and explains what each one does. <span class="cn">问诊 · 选十味草药 · 英语讲解</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">00:15 · The Hot Soak</div>
              <div class="tl-title">Feet in, shoulders down</div>
              <div class="tl-desc">Your feet go into a private wooden tub of hot herb water. Twenty minutes of nothing much — the steam, the smell, and the long walk finally catching up with you. <span class="cn">木桶足浴 · 草本热汤 · 放空</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">00:40 · Reflexology Massage</div>
              <div class="tl-title">Pressing the right places</div>
              <div class="tl-desc">Feet out, dried, then worked point by point — soles, arches, toes and lower legs. Pressure is adjusted to you throughout; the stomach, liver and kidney points get the most attention. <span class="cn">足底按摩 · 穴位按压 · 小腿放松</span></div>
            </div>
            <div class="tl-item">
              <div class="tl-time">01:20 · Steam &amp; Tea</div>
              <div class="tl-title">Warm steam, then a quiet cup</div>
              <div class="tl-desc">A short herbal steam to draw out dampness, followed by tea and a few practical notes on keeping your feet warm. <span class="cn">草本姜蒸 · 草本茶 · 保暖建议</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section alt" id="compare">
      <div class="section alt-inner">
        <div class="section-head center">
          <div class="eyebrow">What It Costs</div>
          <h2 class="section-title">Same ritual. <span class="italic">A fifth of the price</span>.</h2>
          <p class="section-sub">A comparable 90-minute foot soak and reflexology session abroad runs around $80. Here it is {{ basePriceText }} — herbs, massage and steam all included.</p>
        </div>
        <div class="cmp-wrap">
          <div class="cmp-head">
            <h3>Herbal Foot Soak + Massage — Price Breakdown</h3>
            <span v-if="savingsPercent > 0" class="badge">Save {{ savingsPercent }}%</span>
          </div>
          <div class="cmp-labels"><span>Experience</span><span>Back Home</span><span>LVYV Xi'an</span></div>
          <div class="cmp-body">
            <div class="cmp-row">
              <div class="label">90-Min Foot Soak + Reflexology<span>Private tub, English-speaking practitioner</span></div>
              <div class="away">$80</div>
              <div class="here">{{ basePriceText }}</div>
            </div>
            <div class="cmp-row">
              <div class="label">10 Medicinal Herbs<span>Chosen by you, usually charged per herb abroad</span></div>
              <div class="away">+$18</div>
              <div class="here">included</div>
            </div>
            <div class="cmp-row">
              <div class="label">Herbal Steam &amp; Tea<span>The finishing 20 minutes</span></div>
              <div class="away">+$12</div>
              <div class="here">included</div>
            </div>
            <div class="cmp-row total">
              <div class="label">Session Price You Pay<span>Everything above · 1.5 hours</span></div>
              <div class="away">$80</div>
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
            <li><b>90-minute session</b>, one to one</li>
            <li><b>Foot soak in 10 medicinal herbs</b>, your own blend</li>
            <li><b>40-minute reflexology massage</b> of feet and lower legs</li>
            <li><b>Herbal steam</b> to finish</li>
            <li><b>English-speaking practitioner</b> throughout</li>
            <li><b>Private foot tub</b> and fresh linens</li>
            <li><b>Herbal tea</b> and a quiet rest afterwards</li>
          </ul>
        </div>
        <div class="inc-card no">
          <div class="inc-title"><span class="badge">✗</span> Not Included</div>
          <ul class="inc-list">
            <li>Full body massage (available as an add-on)</li>
            <li>Acupuncture, cupping or moxibustion</li>
            <li>Herbal medicine prescription (available from $15)</li>
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
      description="1.5h · 10 medicinal herbs · reflexology massage · herbal steam · English-speaking"
      bundle-label="Herbal Foot Soak + Massage"
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
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 0" @click="toggleFaq(0)"><span class="n">01</span> Which ten herbs can I choose from? <span class="toggle">+</span></button>
                <div class="faq-a">The counter usually has <b>angelica, astragalus, ginger, mugwort, goji, rose, safflower, cinnamon twig, dry ginger and cnidium</b>. Availability shifts with the season — your practitioner will explain each one and help you build a blend for sleep, cold feet, digestion or sore muscles.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 1 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 1" @click="toggleFaq(1)"><span class="n">02</span> What is reflexology, exactly? <span class="toggle">+</span></button>
                <div class="faq-a">It is a massage of specific points on the soles and lower legs that tradition links to the stomach, liver, kidneys and head. It is <b>not a medical diagnosis</b> — just a very good way to release tension after a long day of walking.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 2 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 2" @click="toggleFaq(2)"><span class="n">03</span> Is it good for dampness or cold feet? <span class="toggle">+</span></button>
                <div class="faq-a">That is exactly what the soak and the finishing steam are for — <b>warming the feet and encouraging a light sweat</b>. Many guests book after a long flight, a damp winter, or days of walking on Silk Road sites.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 3 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 3" @click="toggleFaq(3)"><span class="n">04</span> How hot is the water? Can I adjust it? <span class="toggle">+</span></button>
                <div class="faq-a">Warm, never scalding — around 40–42°C. Your practitioner checks with you before you put your feet in and <b>can add cooler water at any time</b>. If you have reduced sensation in your feet, tell us first.</div>
              </div>
              <div class="faq-item" :class="{ open: activeFaq === 4 }">
                <button class="faq-q" type="button" :aria-expanded="activeFaq === 4" @click="toggleFaq(4)"><span class="n">05</span> Can I do this if I'm pregnant or have skin issues? <span class="toggle">+</span></button>
                <div class="faq-a">Please tell us before booking if you are <b>pregnant, have a foot injury, open skin, eczema, diabetes or poor circulation</b>. We can adjust the herbs and temperature, or suggest a different experience if it is not suitable.</div>
              </div>
            </div>
          </div>
        </section>

        <section class="cta-band" id="book">
          <div class="cta-inner">
            <div class="eyebrow">Ready?</div>
            <h2>Take the weight <span class="italic">off your feet</span>.</h2>
            <p>{{ basePriceText }} · 1.5h · 10 medicinal herbs · reflexology massage · herbal steam · ancient Silk Road remedy · English-speaking practitioner</p>
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

const product = encounterProducts.find(item => item.code === 'ENC-XA-HERBAL-FOOT-SOAK-MASSAGE')!
const { productName, sku, status, refresh } = await useEncounterProduct(product, {
  title: "Herbal Foot Soak + Massage in Xi'an — $17 90-Min Ritual | LVYV Encounters",
  description: "Foot soak in 10 medicinal herbs followed by reflexology massage — an ancient Silk Road traveler's remedy. 90 minutes, $17 — normally $80 US. Silk Road traders did this 1,000 years ago. Still works.",
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
  ? 78
  : Math.round((1 - basePrice.value / 80) * 100))
</script>

<style src="~/assets/css/encounter-experience.css"></style>
