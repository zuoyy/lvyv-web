<template>
  <main class="route-original">
    <!-- HERO -->
    <section class="hero" id="hero">
      <div class="hero-img" style="background-image:url('/images/encounters/wellness/museum-figurine-army.webp');"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-crumb">
          <a href="/encounters">Encounters</a>
          <span class="sep">/</span>
          <a href="/encounters#xian">Xi'an</a>
          <span class="sep">/</span>
          <span>The 2,000-Year-Old Pharmacy</span>
        </div>
        <div class="hero-eyebrow">Editor's Pick · 3D2N · Xi'an</div>
        <h1>The 2,000-Year-Old <span class="italic">Pharmacy</span></h1>
        <p class="hero-hook">"I walked into a pharmacy older than my country. Left with a prescription that actually worked. Then pulled my own noodles."</p>
        <div class="hero-tags">
          <span class="hero-tag gold">Herbal Market Walk</span>
          <span class="hero-tag gold">50-sec Pulse Reading</span>
          <span class="hero-tag">Moxibustion</span>
          <span class="hero-tag coral">Tang Tea Ritual</span>
          <span class="hero-tag coral">Biang Biang Noodles</span>
          <span class="hero-tag">Terracotta Warriors</span>
          <span class="hero-tag">3D2N hotel + transfers</span>
        </div>
        <div class="hero-btns">
          <a href="#book" class="btn-primary">Book The Pharmacy →</a>
          <a href="#why" class="btn-ghost">Why Xi'an</a>
        </div>
      </div>
      <div class="hero-price-card">
        <div class="from">from</div>
        <div class="num">{{ price }}</div>
        <div class="per">/ person · 3D2N</div>
        <div class="note">6 encounters · save up to 81%</div>
        <div class="compare-mini">$715 in the US</div>
      </div>
    </section>

    <!-- GALLERY -->
    <div class="gallery">
      <div class="g-item big" style="background-image:url('/images/encounters/wellness/detail/xian-city-wall.webp');">
        <div class="g-label">Xi'an City Wall · 西安城墙</div>
      </div>
      <div class="g-item" style="background-image:url('/images/encounters/wellness/terracotta-warriors.webp');">
        <div class="g-label">Terracotta Warriors · 兵马俑</div>
      </div>
      <div class="g-item" style="background-image:url('/images/encounters/wellness/museum-terracotta.webp');">
        <div class="g-label">Han Dynasty Figure · 汉俑</div>
      </div>
      <div class="g-item" style="background-image:url('/images/encounters/wellness/big-wild-goose-pagoda.webp');">
        <div class="g-label">Big Wild Goose Pagoda · 大雁塔</div>
      </div>
      <div class="g-item" style="background-image:url('/images/encounters/wellness/detail/museum-figurine.webp');">
        <div class="g-label">Museum Figure · 文物</div>
      </div>
    </div>

    <!-- HOOK QUOTE -->
    <div class="section" style="padding-top:64px;padding-bottom:0;">
      <div class="hook-block">
        <div class="quote">"Xi'an is where China wrote its first medical texts, <span class="accent">2,000 years ago</span>. The herbal markets are still open. The moxibustion still burns. And a doctor can still read your pulse in 50 seconds."</div>
        <div class="attribution">— <span class="name">James R.</span>, Melbourne · The 2,000-Year-Old Pharmacy · Sep 2025</div>
      </div>
    </div>

    <!-- SAVINGS -->
    <section class="section" style="padding-top:32px;">
      <div class="savings-banner">
        <div class="savings-item">
          <div class="v">$715</div>
          <div class="l">Same 6 encounters overseas</div>
        </div>
        <div class="savings-item divider">
          <div class="v">$183</div>
          <div class="l">Same 6 encounters in Xi'an</div>
        </div>
        <div class="savings-item divider">
          <div class="v">75%</div>
          <div class="l">Average savings</div>
        </div>
        <div class="savings-item divider">
          <div class="v">2,000 yrs</div>
          <div class="l">Older than your pharmacy</div>
        </div>
      </div>
    </section>

    <!-- WHY XI'AN -->
    <section class="section alt" id="why">
      <div class="section alt-inner">
        <div class="section-head" style="text-align:center;">
          <div class="eyebrow">Why Xi'an</div>
          <h2 class="section-title">Where the world's first <span class="italic">pharmacy</span> still works</h2>
          <p class="section-sub" style="margin-left:auto;margin-right:auto;">Most people fly to Xi'an for the Terracotta Warriors. But the real reason to come is a few streets away — where the herbs are still weighed on old brass scales and compounded by hand.</p>
        </div>
        <div class="pillars">
          <div class="pillar">
            <div class="pillar-img" style="background-image:url('/images/encounters/wellness/museum-figurine-army.webp');"></div>
            <div class="pillar-body">
              <div class="pillar-num">01 · The Origin</div>
              <h3>China's First Medical Texts</h3>
              <div class="pillar-cn">《黄帝内经》 · Written here, 2,000 years ago</div>
              <p>The Huangdi Neijing — the foundational text of Chinese medicine — was compiled in the Qin-Han period. Xi'an was the imperial capital. The pulse-diagnosis system you're about to experience was developed here, and refined by doctors who have been doing it here ever since.</p>
              <p class="pillar-hook">"The hospital had the same charts my grandparents' doctors used."</p>
              <span class="pillar-tag">The birthplace of TCM</span>
            </div>
          </div>
          <div class="pillar">
            <div class="pillar-img" style="background-image:url('/images/encounters/wellness/museum-terracotta.webp');"></div>
            <div class="pillar-body">
              <div class="pillar-num">02 · The Craft</div>
              <h3>Herbs Still Weighed by Hand</h3>
              <div class="pillar-cn">药市 · Yào Shì · The medicine markets</div>
              <p>Xi'an's traditional herbal markets still trade on old scales. Watching a pharmacist compound 12 herbs for one prescription — each weighed to the gram, each for one specific imbalance — is something you cannot see anywhere else on earth.</p>
              <p class="pillar-hook">"It's like Diagon Alley. But it's been real for 2,000 years."</p>
              <span class="pillar-tag">50+ medicinal herbs</span>
            </div>
          </div>
          <div class="pillar">
            <div class="pillar-img" style="background-image:url('/images/encounters/wellness/terracotta-warriors.webp');"></div>
            <div class="pillar-body">
              <div class="pillar-num">03 · The Context</div>
              <h3>8,000 Soldiers Who Never Rot</h3>
              <div class="pillar-cn">兵马俑 · The Terracotta Army</div>
              <p>Xi'an proves that ancient Chinese craftsmanship didn't just build beautiful things — it preserved them. The Terracotta Army was found in 1974 by farmers digging a well. The same soil that preserved the warriors also grew the herbs.</p>
              <p class="pillar-hook">"8,000 clay soldiers. Every single face different. Made 2,000 years ago."</p>
              <span class="pillar-tag">UNESCO World Heritage</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ITINERARY -->
    <section class="section" id="itinerary">
      <div class="section-head" style="text-align:center;margin-bottom:48px;">
        <div class="eyebrow">3 Days · 2 Nights</div>
        <h2 class="section-title" style="margin:0 auto;">Your <span class="italic">itinerary</span></h2>
        <p class="section-sub" style="margin-left:auto;margin-right:auto;">Three wellness encounters and three culture encounters woven into three days of Xi'an. Each encounter takes 2 hours. The rest is herbal markets, warriors, and the best noodles in China.</p>
      </div>
      <div class="itinerary">
        <!-- DAY 1 -->
        <div class="day-block">
          <div class="day-label">
            <span class="day-num">01</span>
            Day One
            <div class="day-date">Arrival · Afternoon</div>
          </div>
          <div class="day-content">
            <h3>Herbal Market & Pulse Reading</h3>
            <p class="day-hook">"It smelled like earth and cinnamon. Then she read my wrist and knew things I hadn't said."</p>
            <ul class="day-schedule">
              <li>
                <span class="time">14:00</span>
                <span class="activity">Airport pickup by LVYV guide. Transfer to hotel in the old city. <b>45-min drive.</b></span>
              </li>
              <li>
                <span class="time">15:30</span>
                <span class="activity"><b>Herbal Medicine Market Walk</b> with an English-speaking herbalist. 50+ medicinal herbs, shown, smelled, explained. Watch a pharmacist compound a prescription. <span class="tag herbal">Encounter 01</span></span>
              </li>
              <li>
                <span class="time">17:30</span>
                <span class="activity"><b>TCM Pulse Diagnosis</b> at a traditional Xi'an medicine hospital. 50-second reading, 12 positions, English report same day. <span class="tag tcm">Encounter 02</span></span>
              </li>
              <li>
                <span class="time">19:30</span>
                <span class="activity"><b>Biangbiang noodles</b> dinner at a local Muslim-quarter restaurant. Your guide explains why Xi'an has 800+ years of noodle culture.</span>
              </li>
              <li>
                <span class="time">21:00</span>
                <span class="activity">Night walk on the City Wall lit up. Rest at hotel.</span>
              </li>
            </ul>
          </div>
        </div>
        <!-- DAY 2 -->
        <div class="day-block">
          <div class="day-label">
            <span class="day-num">02</span>
            Day Two
            <div class="day-date">Full Day · Warriors & Moxibustion</div>
          </div>
          <div class="day-content">
            <h3>Terracotta Warriors & Moxibustion</h3>
            <p class="day-hook">"8,000 clay soldiers, every face different. Then burning mugwort on ginger. Both made me cry a little."</p>
            <ul class="day-schedule">
              <li>
                <span class="time">08:00</span>
                <span class="activity"><b>Terracotta Warriors</b> with English guide. Pit 1 in the morning light, then the Bronze Hall and the chariot display. <b>Skip the group tour — we go early.</b> <span class="tag sight">Bucket list</span></span>
              </li>
              <li>
                <span class="time">13:00</span>
                <span class="activity">Lunch near Lintong. <b>Yáng Fēn Pi</b> — fermented lamb noodles. Xi'an's signature.</span>
              </li>
              <li>
                <span class="time">15:30</span>
                <span class="activity"><b>Moxibustion + Cupping + Tuina</b> session. The Silk Road recovery ritual. <span class="tag tcm">Encounter 03</span></span>
              </li>
              <li>
                <span class="time">17:30</span>
                <span class="activity"><b>Tang Dynasty Tea Ritual</b> — tea the way the Tang court drank it 1,300 years ago: ground, whisked, salted. A ritual older than Japan's matcha by 400 years. <span class="tag culture">Encounter 04</span></span>
              </li>
              <li>
                <span class="time">19:00</span>
                <span class="activity">Free evening. Your guide arranges <b>Big Wild Goose Pagoda</b> at dusk and dinner reservations.</span>
              </li>
            </ul>
          </div>
        </div>
        <!-- DAY 3 -->
        <div class="day-block">
          <div class="day-label">
            <span class="day-num">03</span>
            Day Three
            <div class="day-date">Morning · Departure</div>
          </div>
          <div class="day-content">
            <h3>Noodles, Clay & Departure</h3>
            <p class="day-hook">"Pulled my own belt-wide noodle. Built a mini warrior. Flight home with a prescription that worked."</p>
            <ul class="day-schedule">
              <li>
                <span class="time">08:30</span>
                <span class="activity"><b>City Wall bike ride</b> at sunrise. 14km around the most complete ancient city wall on earth. <span class="tag sight">Sightseeing</span></span>
              </li>
              <li>
                <span class="time">10:30</span>
                <span class="activity"><b>Biang Biang Noodle Master Class</b> — hand-pull, slap, cook. Learn the 58-stroke character for "biang". <span class="tag culture">Encounter 05</span></span>
              </li>
              <li>
                <span class="time">12:30</span>
                <span class="activity"><b>Terracotta Warrior Clay Craft</b> — sculpt your own mini warrior with the same clay and techniques as the 2,200-year-old originals. <span class="tag culture">Encounter 06</span></span>
              </li>
              <li>
                <span class="time">14:30</span>
                <span class="activity"><b>Shaanxi History Museum</b> — the treasure hall. 2,000 years of gold, silver, and jade in one building.</span>
              </li>
              <li>
                <span class="time">16:30</span>
                <span class="activity">Farewell lunch. Pick up your <b>compounded herbal prescription</b> and your <b>mini warrior</b> to take home.</span>
              </li>
              <li>
                <span class="time">18:00</span>
                <span class="activity">Hotel checkout. Transfer to airport. <b>7-day aftercare support</b> activated.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- SOLO BREAKDOWN -->
    <section class="section alt">
      <div class="section alt-inner">
        <div class="section-head">
          <div class="eyebrow">What's Inside</div>
          <h2 class="section-title">Six encounters. <span class="italic">One apothecary journey.</span></h2>
          <p class="section-sub">Each encounter is also available individually — bundled into the Pharmacy, you save $112 and get hotel, transfers, Terracotta Warriors, and the city wall bike included.</p>
        </div>
        <div class="solo-breakdown">
          <a class="solo-item" href="/product/xian-herbal-market-walk">
            <div class="num">Encounter 01</div>
            <h4>Herbal Market Walk</h4>
            <p class="desc">Guided walk through Xi'an's traditional medicine market. 50+ medicinal herbs.</p>
            <p class="hook">"Like Diagon Alley. Real for 2,000 years."</p>
            <div class="price">$25</div>
          </a>
          <a class="solo-item" href="/product/xian-tcm-pulse-acupuncture">
            <div class="num">Encounter 02</div>
            <h4>TCM Pulse + Acupuncture</h4>
            <p class="desc">Full consultation, 50-sec pulse reading, acupuncture at a traditional hospital.</p>
            <p class="hook">"She read my wrist and described hidden symptoms."</p>
            <div class="price">$81</div>
            <div class="compare">$470 in US</div>
          </a>
          <a class="solo-item" href="/product/xian-direct-moxibustion">
            <div class="num">Encounter 03</div>
            <h4>Moxibustion + Cupping</h4>
            <p class="desc">Fire cupping and Xi'an-style ginger moxibustion for chronic pain and cold.</p>
            <p class="hook">"Burning mugwort on ginger. Works."</p>
            <div class="price">$28</div>
            <div class="compare">$95 in US</div>
          </a>
          <a class="solo-item" href="/product/xian-tang-dynasty-tea-ritual">
            <div class="num">Encounter 04</div>
            <h4>Tang Dynasty Tea Ritual</h4>
            <p class="desc">Tea the way the Tang court drank it 1,300 years ago. Ground, whisked, salted.</p>
            <p class="hook">"Japan learned matcha from here. This is the original."</p>
            <div class="price">$21</div>
            <div class="compare">$75 in London</div>
          </a>
          <a class="solo-item" href="/product/xian-biang-biang-noodles">
            <div class="num">Encounter 05</div>
            <h4>Biang Biang Noodles</h4>
            <p class="desc">Hand-pull, slap, cook. Learn the 58-stroke character for "biang".</p>
            <p class="hook">"58 strokes for one character. 1 slap for the best noodle."</p>
            <div class="price">$17</div>
            <div class="compare">$110 cooking class</div>
          </a>
          <a class="solo-item" href="/product/xian-terracotta-clay-craft">
            <div class="num">Encounter 06</div>
            <h4>Terracotta Clay Craft</h4>
            <p class="desc">Sculpt your own mini warrior with 2,200-year-old techniques.</p>
            <p class="hook">"They built 8,000. I built 1. Still proud."</p>
            <div class="price">$39</div>
            <div class="compare">$60 pottery studio</div>
          </a>
        </div>
      </div>
    </section>

    <!-- PRICE COMPARE -->
    <section class="section">
      <div class="section-head" style="text-align:center;">
        <div class="eyebrow">Total Cost Comparison</div>
        <h2 class="section-title">Same treatment. <span class="italic">Different planet.</span></h2>
      </div>
      <div class="compare-wrap">
        <div class="compare-head">
          <h3>TCM Session Pricing · Xi'an vs. the US</h3>
          <span class="badge">Save 81%</span>
        </div>
        <div class="compare-body">
          <div class="compare-row">
            <div class="label">Pulse Diagnosis<span>50-sec reading · 12 positions</span></div>
            <div class="away">$120</div>
            <div class="here">$17</div>
          </div>
          <div class="compare-row">
            <div class="label">Acupuncture<span>Personalized points · 20 min</span></div>
            <div class="away">$250</div>
            <div class="here">$39</div>
          </div>
          <div class="compare-row">
            <div class="label">Moxibustion + Cupping<span>Ginger moxa · fire cups</span></div>
            <div class="away">$100</div>
            <div class="here">$28</div>
          </div>
          <div class="compare-row total">
            <div class="label">Total TCM Session<span>Everything above · 2 hours</span></div>
            <div class="away">$470</div>
            <div class="here">$81</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CULTURE COMPARE -->
    <section class="section alt">
      <div class="section alt-inner">
        <div class="section-head" style="text-align:center;">
          <div class="eyebrow">Culture Encounters Pricing</div>
          <h2 class="section-title">The same craft. <span class="italic">A third of the price.</span></h2>
          <p class="section-sub" style="margin-left:auto;margin-right:auto;">Our Xi'an culture encounters are run by working masters in the old city — not by tour operators reselling a group bus ticket.</p>
        </div>
        <div class="compare-wrap">
          <div class="compare-head">
            <h3>Culture Encounters · Xi'an vs. Equivalent Overseas</h3>
            <span class="badge">Save 76%</span>
          </div>
          <div class="compare-body">
            <div class="compare-row">
              <div class="label">Tang Dynasty Tea Ritual<span>1,300-year-old method · London tea house</span></div>
              <div class="away">$75</div>
              <div class="here">$21</div>
            </div>
            <div class="compare-row">
              <div class="label">Biang Biang Noodle Master Class<span>Hand-pulled · London cooking school</span></div>
              <div class="away">$110</div>
              <div class="here">$17</div>
            </div>
            <div class="compare-row">
              <div class="label">Terracotta Warrior Clay Craft<span>Original clay & technique · pottery studio</span></div>
              <div class="away">$60</div>
              <div class="here">$39</div>
            </div>
            <div class="compare-row">
              <div class="label">Herbal Medicine Market Walk<span>50+ herbs with a working herbalist</span></div>
              <div class="away">N/A</div>
              <div class="here">$25</div>
            </div>
            <div class="compare-row total">
              <div class="label">Total 4 Culture Encounters<span>Plus the $81 TCM session above</span></div>
              <div class="away">$245</div>
              <div class="here">$102</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- INCLUDED -->
    <section class="section alt" id="included">
      <div class="section alt-inner">
        <div class="section-head">
          <div class="eyebrow">What's Included</div>
          <h2 class="section-title">{{ price }} covers <span class="italic">everything</span> but your flight</h2>
        </div>
        <div class="inc-grid">
          <div class="inc-card yes">
            <div class="inc-title"><span class="badge">✓</span> Included in {{ price }}</div>
            <ul class="inc-list">
              <li><b>Herbal medicine market walk</b> with English-speaking herbalist</li>
              <li><b>TCM pulse diagnosis + acupuncture</b> at traditional hospital</li>
              <li><b>Moxibustion + cupping + tuina</b> session</li>
              <li><b>Tang Dynasty tea ritual</b> — the 1,300-year-old original</li>
              <li><b>Biang Biang noodle master class</b> — hand-pull, slap, cook</li>
              <li><b>Terracotta warrior clay craft</b> — sculpt your own mini soldier</li>
              <li><b>English diagnosis report</b> + take-home prescription</li>
              <li><b>2 nights hotel</b> in Xi'an's old city</li>
              <li><b>All transfers</b> — airport, hotel, sites</li>
              <li><b>Terracotta Warriors</b> early-entry ticket + guide</li>
              <li><b>City wall bike ride</b> at sunrise</li>
              <li><b>Shaanxi History Museum</b> guide + ticket</li>
              <li><b>Bilingual LVYV guide</b> throughout 3 days</li>
              <li><b>7-day aftercare</b> via WhatsApp</li>
            </ul>
          </div>
          <div class="inc-card no">
            <div class="inc-title"><span class="badge">✗</span> Not Included</div>
            <ul class="inc-list">
              <li>International flights (we advise on best routes)</li>
              <li>Visa fees (240-hour transit visa-free for 54 countries)</li>
              <li>Additional therapies beyond the included set</li>
              <li>Prescription herbs beyond the take-home sachet (from $17)</li>
              <li>Lunches and Day 3 dinner</li>
              <li>Personal travel insurance</li>
              <li>Tips and personal expenses</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- TRUST -->
    <section class="section">
      <div class="trust-grid">
        <div class="trust-card">
          <div class="trust-ico">🏥</div>
          <h4>Licensed Hospital</h4>
          <p>Traditional Xi'an medicine hospital with international patient services. Real doctors, real reports.</p>
        </div>
        <div class="trust-card">
          <div class="trust-ico">🗣</div>
          <h4>English Throughout</h4>
          <p>Bilingual guide who understands both herbal terminology and your questions.</p>
        </div>
        <div class="trust-card">
          <div class="trust-ico">📄</div>
          <h4>Same-Day Report</h4>
          <p>Written English diagnosis on your phone before you leave the hospital.</p>
        </div>
        <div class="trust-card">
          <div class="trust-ico">👩‍🏫</div>
          <h4>Working Masters</h4>
          <p>A Tang-era tea practitioner. A third-generation noodle maker. A clay artist from the Terracotta pits.</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-band" id="book">
      <div class="cta-inner">
        <div class="eyebrow">Ready?</div>
        <h2>A pharmacy older than your country is <span class="italic">still open</span>.</h2>
        <p>3 days. 6 encounters. {{ price }}. Herbal market, pulse diagnosis, moxibustion, Tang tea ritual, Biang Biang noodles, terracotta clay craft, Terracotta Warriors, city wall. The same six experiences overseas cost $715. Here they're $183 — and the hotel, transfers and guide are included.</p>
        <div class="cta-btns">
          <button class="btn-primary" type="button" @click="booking?.open()">Book The 2,000-Year-Old Pharmacy →</button>
          <a href="/encounters" class="btn-ghost">← Back to All Encounters</a>
        </div>
      </div>
    </section>

    <!-- BOOK BAR -->
    <div class="book-bar">
      <div class="book-bar-left">
        <div class="t">The 2,000-Year-Old Pharmacy · 3D2N Xi'an</div>
        <div class="s">Herbal Market + TCM + Moxibustion + Tang Tea + Noodles + Clay Craft + Terracotta</div>
      </div>
      <div class="book-bar-right">
        <div class="book-bar-price">
          <span class="from">from</span>
          <span class="num">{{ price }}</span>
        </div>
        <button class="book-bar-cta" type="button" @click="booking?.open()">Book Now →</button>
      </div>
    </div>

    <EncounterBookingDialog ref="booking" :product="product" :sku="sku" :status="status" @retry="refresh()" />
  </main>
</template>

<script setup lang="ts">
import { encounterProducts } from '~~/shared/utils/encounterProducts'

const product = encounterProducts.find(item => item.slug === 'xian-ancient-pharmacy')!
const booking = useTemplateRef('booking')
const { sku, status, refresh } = await useEncounterProduct(product, {
  title: "The 2,000-Year-Old Pharmacy · 3D2N Xi'an · LVYV Encounters",
  description: "Walk into a herbal market older than your country. A doctor reads your pulse for 50 seconds and knows more than your GP of 10 years. Then pull your own noodles and sculpt a terracotta warrior.",
  hero: 'museum-figurine-army',
})
const price = computed(() => sku.value ? encounterPrice(sku.value.price) : '—')
</script>

<style scoped>
/* Keep the prototype typography and spacing independent of the global site styles. */
.route-original { font-size: 16px; }
section { padding: 0; scroll-margin-top: 0; }
h1, h2, h3, h4, h5, h6 { font-family: inherit; }
h2 { font-size: 1.5em; font-weight: bold; line-height: inherit; color: inherit; }
button { font-family: Arial, sans-serif; }

*{margin:0;padding:0;box-sizing:border-box;}
.route-original{
  --green:#1E3A2F;--green-deep:#162C24;--green-soft:#2C4A3C;--green-mist:#4A6B5C;
  --lime:#7FB069;--lime-lt:#C9E4C0;--lime-dim:#5F8C4C;--lime-pale:#EAF3E5;
  --cream:#F7F5F0;--paper:#FCFBF7;--ink:#1E2B25;
  --muted:#6B7A72;--muted-lt:#9AABA3;--line:#E8E4DC;--line-lt:#F0EEE7;
  --white:#fff;--coral:#D8542F;--terra:#B85C3A;--sky:#7BA8B5;
  --gold:#C9A961;
}
.route-original{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,sans-serif;background:var(--paper);color:var(--ink);line-height:1.75;-webkit-font-smoothing:antialiased;overflow-x:clip;}
a{font-family:inherit;text-decoration:none;color:inherit;}
::selection{background:var(--lime);color:var(--green-deep);}









/* HERO */
.hero{position:relative;height:92vh;min-height:620px;overflow:hidden;background:var(--green-deep);}
.hero-img{position:absolute;inset:0;background-size:cover;background-position:center 40%;}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(90deg,rgba(22,44,36,.93) 0%,rgba(22,44,36,.70) 48%,rgba(22,44,36,.20) 100%);}
.hero-content{position:absolute;top:50%;left:0;right:0;transform:translateY(-50%);z-index:3;padding:0 48px;max-width:1200px;margin:0 auto;}
.hero-crumb{display:flex;align-items:center;gap:10px;margin-bottom:22px;font-size:12px;color:rgba(247,245,240,.5);}
.hero-crumb a{color:rgba(247,245,240,.5);transition:color .2s;}
.hero-crumb a:hover{color:var(--lime-lt);}
.hero-crumb .sep{opacity:.4;}
.hero-eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:var(--green-deep);background:var(--lime);padding:7px 16px;border-radius:100px;font-weight:700;margin-bottom:20px;}
.hero h1{font-size:52px;font-weight:600;color:var(--white);line-height:1.06;letter-spacing:-.025em;margin-bottom:14px;max-width:720px;}
.hero h1 .italic{font-style:italic;font-weight:400;color:var(--lime-lt);}
.hero-hook{font-size:19px;color:rgba(247,245,240,.72);line-height:1.6;margin-bottom:24px;max-width:540px;font-weight:300;font-style:italic;}
.hero-tags{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:28px;}
.hero-tag{font-size:11px;padding:6px 14px;border-radius:100px;background:rgba(247,245,240,.1);color:var(--cream);border:1px solid rgba(201,228,192,.20);letter-spacing:.04em;}
.hero-tag.coral{background:rgba(216,84,47,.22);border-color:rgba(216,84,47,.4);color:#F0A48A;}
.hero-tag.gold{background:rgba(127,176,105,.20);border-color:rgba(201,228,192,.42);color:var(--lime-lt);}
.hero-btns{display:flex;gap:14px;flex-wrap:wrap;}
.btn-primary{background:var(--lime);color:var(--green-deep);padding:14px 32px;border-radius:100px;font-size:14px;font-weight:600;letter-spacing:.04em;transition:all .25s;display:inline-flex;align-items:center;gap:8px;cursor:pointer;border:none;}
.btn-primary:hover{background:var(--lime-lt);transform:translateY(-2px);}
.btn-ghost{border:1px solid rgba(201,228,192,.30);color:var(--cream);padding:14px 32px;border-radius:100px;font-size:14px;font-weight:400;letter-spacing:.04em;transition:all .25s;display:inline-flex;align-items:center;gap:8px;cursor:pointer;background:transparent;}
.btn-ghost:hover{border-color:var(--lime);background:rgba(127,176,105,.10);}

.hero-price-card{position:absolute;bottom:96px;right:48px;z-index:3;background:rgba(255,255,255,.95);backdrop-filter:blur(10px);border-radius:14px;padding:22px 28px;min-width:240px;box-shadow:0 12px 40px rgba(0,0,0,.18);}
.hero-price-card .from{font-size:11px;color:var(--muted);letter-spacing:.06em;}
.hero-price-card .num{font-size:34px;font-weight:700;color:var(--green);line-height:1.1;}
.hero-price-card .per{font-size:12px;color:var(--muted);margin-left:4px;}
.hero-price-card .note{font-size:11px;color:var(--lime-dim);font-weight:700;margin-top:6px;}
.hero-price-card .compare-mini{font-size:11px;color:var(--coral);margin-top:6px;text-decoration:line-through;}

/* GALLERY */
.gallery{display:grid;grid-template-columns:2fr 1fr 1fr;grid-template-rows:190px 190px;gap:2px;background:var(--line);}
.g-item{background-size:cover;background-position:center;position:relative;overflow:hidden;}
.g-item.big{grid-row:span 2;}
.g-item::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,rgba(22,44,36,.78));opacity:0;transition:opacity .35s;}
.g-item:hover::after{opacity:1;}
.g-label{position:absolute;bottom:14px;left:16px;z-index:2;color:#fff;font-size:12px;font-weight:600;letter-spacing:.03em;opacity:0;transform:translateY(8px);transition:all .35s;}
.g-item:hover .g-label{opacity:1;transform:translateY(0);}

/* SECTION */
.section{padding:76px 48px;max-width:1200px;margin:0 auto;}
.section.alt{background:var(--cream);max-width:none;}
.section.alt-inner{max-width:1200px;margin:0 auto;padding:76px 48px;}
.eyebrow{font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:var(--lime-dim);font-weight:700;margin-bottom:14px;}
.section-title{font-size:38px;font-weight:600;color:var(--green);letter-spacing:-.018em;line-height:1.15;}
.section-title .italic{font-style:italic;font-weight:400;color:var(--green-mist);}
.section-sub{font-size:16px;color:var(--muted);margin-top:16px;max-width:580px;line-height:1.7;}

/* HOOK BLOCK */
.hook-block{max-width:780px;margin:0 auto 48px;text-align:center;padding:0 24px;}
.hook-block .quote{font-size:26px;font-weight:400;color:var(--green);line-height:1.4;font-style:italic;letter-spacing:-.01em;}
.hook-block .quote .accent{color:var(--coral);font-weight:600;}
.hook-block .attribution{font-size:13px;color:var(--muted);margin-top:14px;}
.hook-block .attribution .name{color:var(--green);font-weight:600;}

/* SAVINGS */
.savings-banner{background:var(--green-deep);border-radius:18px;padding:36px 48px;display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:32px;align-items:center;}
.savings-item{text-align:center;}
.savings-item .v{font-size:28px;font-weight:700;color:var(--lime-lt);letter-spacing:-.02em;}
.savings-item .v .small{font-size:14px;}
.savings-item .l{font-size:11px;color:rgba(247,245,240,.5);margin-top:6px;letter-spacing:.04em;}
.savings-item.divider{border-left:1px solid rgba(127,176,105,.15);}

/* WHY XI'AN — 3 PILLARS */
.pillars{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;}
.pillar{background:var(--white);border:1px solid var(--line);border-radius:16px;overflow:hidden;transition:all .3s;}
.pillar:hover{transform:translateY(-5px);box-shadow:0 16px 40px rgba(30,58,47,.1);border-color:var(--lime);}
.pillar-img{height:230px;background-size:cover;background-position:center;}
.pillar-body{padding:24px 26px 28px;}
.pillar-num{font-size:11px;letter-spacing:.24em;color:var(--lime-dim);font-weight:700;margin-bottom:10px;}
.pillar-body h3{font-size:20px;font-weight:600;color:var(--green);margin-bottom:6px;line-height:1.25;}
.pillar-cn{font-size:12px;color:var(--muted-lt);letter-spacing:.14em;margin-bottom:12px;}
.pillar-body p{font-size:13.5px;color:var(--muted);line-height:1.7;margin-bottom:14px;}
.pillar-hook{font-size:12px;color:var(--coral);font-style:italic;font-weight:500;margin-bottom:14px;}
.pillar-tag{display:inline-block;font-size:11px;padding:4px 11px;border-radius:100px;background:var(--lime-pale);color:var(--lime-dim);font-weight:600;}

/* ITINERARY */
.itinerary{display:flex;flex-direction:column;}
.day-block{display:grid;grid-template-columns:200px 1fr;gap:48px;padding:40px 0;border-bottom:1px solid var(--line);}
.day-block:last-child{border-bottom:none;}
.day-label{font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--lime-dim);font-weight:700;}
.day-label .day-num{font-size:36px;color:var(--green);font-weight:700;letter-spacing:-.02em;display:block;margin-bottom:4px;}
.day-label .day-date{color:var(--muted-lt);font-size:11px;}
.day-content h3{font-size:22px;font-weight:600;color:var(--green);margin-bottom:12px;}
.day-content .day-hook{font-size:14px;color:var(--coral);font-style:italic;margin-bottom:16px;}
.day-schedule{list-style:none;}
.day-schedule li{display:grid;grid-template-columns:80px 1fr;gap:16px;padding:12px 0;border-bottom:1px dashed var(--line-lt);font-size:14px;}
.day-schedule li:last-child{border-bottom:none;}
.day-schedule .time{color:var(--lime-dim);font-weight:700;font-size:13px;letter-spacing:.04em;}
.day-schedule .activity{color:var(--muted);}
.day-schedule .activity b{color:var(--ink);font-weight:600;}
.day-schedule .activity .tag{display:inline-block;font-size:10px;padding:2px 8px;border-radius:4px;margin-left:8px;font-weight:600;}
.day-schedule .activity .tag.tcm{background:rgba(127,176,105,.12);color:var(--lime-dim);}
.day-schedule .activity .tag.herbal{background:rgba(216,84,47,.11);color:var(--coral);}
.day-schedule .activity .tag.sight{background:rgba(123,168,181,.12);color:var(--sky);}

/* SOLO BREAKDOWN */
.solo-breakdown{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:32px;}
.solo-item{background:var(--white);border:1px solid var(--line);border-radius:14px;padding:22px 18px;text-align:center;transition:all .25s;}
.solo-item:hover{border-color:var(--lime);transform:translateY(-3px);box-shadow:0 8px 24px rgba(30,58,47,.08);}
.solo-item .num{font-size:10px;letter-spacing:.24em;color:var(--lime-dim);font-weight:700;margin-bottom:8px;}
.solo-item h4{font-size:15px;font-weight:600;color:var(--green);margin-bottom:6px;line-height:1.3;}
.solo-item .desc{font-size:11.5px;color:var(--muted);line-height:1.5;margin-bottom:10px;}
.solo-item .hook{font-size:11px;color:var(--coral);font-style:italic;margin-bottom:12px;}
.solo-item .price{font-size:19px;font-weight:700;color:var(--green);}
.solo-item .compare{font-size:10.5px;color:var(--coral);text-decoration:line-through;margin-top:4px;}

/* PRICE COMPARE */
.compare-wrap{background:var(--white);border:1px solid var(--line);border-radius:18px;overflow:hidden;}
.compare-head{background:var(--green);padding:28px 34px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;}
.compare-head h3{font-size:22px;font-weight:600;color:var(--white);}
.compare-head .badge{background:var(--lime);color:var(--green-deep);font-size:12px;font-weight:700;padding:7px 16px;border-radius:100px;}
.compare-body{padding:34px;}
.compare-row{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:20px;align-items:center;padding:18px 0;border-bottom:1px solid var(--line-lt);}
.compare-row:last-child{border-bottom:none;}
.compare-row .label{font-size:14px;color:var(--green);font-weight:600;}
.compare-row .label span{display:block;font-size:11.5px;color:var(--muted);font-weight:400;margin-top:2px;}
.compare-row .away{font-size:19px;color:var(--coral);font-weight:600;text-align:right;text-decoration:line-through;}
.compare-row .here{font-size:22px;color:var(--green);font-weight:700;text-align:right;}
.compare-row.total{background:var(--lime-pale);margin:0 -34px;padding:22px 34px;}
.compare-row.total .label{font-size:15px;}
.compare-row.total .away{font-size:24px;}
.compare-row.total .here{font-size:28px;color:var(--lime-dim);}

/* INCLUDED */
.inc-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;}
.inc-card{border-radius:16px;padding:30px;border:1px solid var(--line);}
.inc-card.yes{background:var(--lime-pale);border-color:var(--lime-lt);}
.inc-card.no{background:var(--white);border-color:var(--line);}
.inc-title{display:flex;align-items:center;gap:10px;font-size:16px;font-weight:700;color:var(--green);margin-bottom:18px;}
.inc-title .badge{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;}
.inc-card.yes .badge{background:var(--lime);color:#fff;}
.inc-card.no .badge{background:var(--line);color:var(--muted);}
.inc-list{list-style:none;}
.inc-list li{font-size:13.5px;color:var(--ink);line-height:1.6;padding:8px 0;border-bottom:1px dashed rgba(30,58,47,.08);}
.inc-list li:last-child{border-bottom:none;}
.inc-list li b{color:var(--green);font-weight:600;}

/* TRUST */
.trust-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;}
.trust-card{background:var(--white);border:1px solid var(--line);border-radius:14px;padding:24px 22px;text-align:center;transition:all .28s;}
.trust-card:hover{border-color:var(--lime-lt);transform:translateY(-3px);}
.trust-ico{font-size:26px;margin-bottom:12px;}
.trust-card h4{font-size:14px;font-weight:700;color:var(--green);margin-bottom:7px;}
.trust-card p{font-size:12px;color:var(--muted);line-height:1.6;}

/* CTA */
.cta-band{background:var(--green-deep);padding:70px 48px;text-align:center;position:relative;overflow:hidden;}
.cta-band::before{content:"";position:absolute;inset:0;opacity:.04;background-image:repeating-linear-gradient(45deg,transparent,transparent 60px,var(--lime-lt) 60px,var(--lime-lt) 61px);}
.cta-inner{max-width:700px;margin:0 auto;position:relative;z-index:2;}
.cta-inner .eyebrow{color:var(--lime);}
.cta-inner h2{font-size:36px;font-weight:600;color:var(--white);line-height:1.18;margin-bottom:14px;letter-spacing:-.018em;}
.cta-inner h2 .italic{font-style:italic;font-weight:400;color:var(--lime-lt);}
.cta-inner p{font-size:16px;color:rgba(247,245,240,.6);margin-bottom:32px;}
.cta-btns{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;}

/* BOOK BAR */
.book-bar{position:sticky;bottom:0;background:var(--white);border-top:1px solid var(--line);padding:18px 48px;display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap;box-shadow:0 -8px 30px rgba(30,58,47,.06);z-index:50;}
.book-bar-left .t{font-size:16px;font-weight:700;color:var(--green);}
.book-bar-left .s{font-size:12px;color:var(--muted);}
.book-bar-right{display:flex;align-items:center;gap:16px;}
.book-bar-price .from{font-size:11px;color:var(--muted);display:block;}
.book-bar-price .num{font-size:26px;font-weight:700;color:var(--green);line-height:1.1;}
.book-bar-cta{background:var(--lime);color:var(--green-deep);padding:12px 32px;border-radius:100px;font-size:14px;font-weight:700;letter-spacing:.04em;transition:all .2s;cursor:pointer;border:none;}
.book-bar-cta:hover{background:var(--lime-lt);transform:translateY(-1px);}

@media(max-width:900px){



  .hero-content{padding:0 24px;}
  .hero h1{font-size:32px;}
  .hero-price-card{position:static;margin-top:28px;display:inline-block;}
  .gallery{grid-template-columns:1fr 1fr;grid-template-rows:180px 180px 180px;}
  .g-item.big{grid-row:span 2;grid-column:span 2;}
  .pillars{grid-template-columns:1fr;}
  .savings-banner{grid-template-columns:1fr 1fr;gap:20px;padding:24px;}
  .day-block{grid-template-columns:1fr;gap:16px;}
  .inc-grid{grid-template-columns:1fr;}
  .compare-row{grid-template-columns:1fr 1fr;}
  .compare-row .label{grid-column:1/-1;}
  .solo-breakdown{grid-template-columns:1fr 1fr;}
  .trust-grid{grid-template-columns:repeat(2,1fr);}
  .section{padding:48px 24px;}
  .section-title,.cta-inner h2{font-size:26px;}
  .book-bar{padding:14px 20px;flex-direction:column;text-align:center;}
}
</style>
