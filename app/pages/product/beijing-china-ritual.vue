<template>
  <main class="route-original">
    <!-- HERO -->
    <section class="hero" id="hero">
      <div class="hero-img" style="background-image:url('/images/encounters/wellness/great-wall.webp');"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-crumb">
          <a href="/encounters">Encounters</a>
          <span class="sep">/</span>
          <a href="/encounters#beijing">Beijing</a>
          <span class="sep">/</span>
          <span>The China Ritual</span>
        </div>
        <div class="hero-eyebrow">Signature Encounter · 3D2N · Beijing</div>
        <h1>The China <span class="italic">Ritual</span></h1>
        <p class="hero-hook">"I flew to China for a dentist, glasses, a doctor, and a tea master. It cost less than my monthly rent."</p>
        <div class="hero-tags">
          <span class="hero-tag coral">Dental $53</span>
          <span class="hero-tag gold">Glasses $28</span>
          <span class="hero-tag">TCM $90</span>
          <span class="hero-tag">Tea $25</span>
          <span class="hero-tag coral">Tai Chi $17</span>
          <span class="hero-tag">3D2N hotel + transfers</span>
        </div>
        <div class="hero-btns">
          <a href="#book" class="btn-primary">Book The Ritual →</a>
          <a href="#savings" class="btn-ghost">See How Much You Save</a>
        </div>
      </div>
      <div class="hero-price-card">
        <div class="from">from</div>
        <div class="num">{{ price }}</div>
        <div class="per">/ person · 3D2N</div>
        <div class="note">Save 83% vs London pricing</div>
        <div class="compare-mini">Same in London: $1,245</div>
      </div>
    </section>

    <!-- GALLERY -->
    <div class="gallery">
      <div class="g-item big" style="background-image:url('/images/encounters/wellness/great-wall.webp');">
        <div class="g-label">Great Wall at Mutianyu · 慕田峪长城</div>
      </div>
      <div class="g-item" style="background-image:url('/images/encounters/wellness/temple-of-heaven.webp');">
        <div class="g-label">Temple of Heaven · 天坛</div>
      </div>
      <div class="g-item" style="background-image:url('/images/encounters/wellness/detail/ritual-tcm-clinic.webp');">
        <div class="g-label">TCM Consultation · 中医门诊</div>
      </div>
      <div class="g-item" style="background-image:url('/images/encounters/wellness/detail/ritual-dental-clinic.webp');">
        <div class="g-label">Dental & Eye Clinic · 口腔与眼科</div>
      </div>
      <div class="g-item" style="background-image:url('/images/encounters/wellness/detail/ritual-cupping.webp');">
        <div class="g-label">Cupping Therapy · 拔罐</div>
      </div>
    </div>

    <!-- HOOK QUOTE -->
    <div class="section" style="padding-top:64px;padding-bottom:0;">
      <div class="hook-block">
        <div class="quote">"I flew to China for a <span class="accent">dentist</span>, <span class="accent">glasses</span>, and a <span class="accent">doctor</span>. It cost less than my monthly rent. The savings literally paid for my flight."</div>
        <div class="attribution">— <span class="name">@sarahtravels</span> · TikTok · The China Ritual · Oct 2025 · 2.3M views</div>
      </div>
    </div>

    <!-- SAVINGS BANNER -->
    <section class="section" id="savings" style="padding-top:32px;">
      <div class="savings-banner">
        <div class="savings-item">
          <div class="v">$1,245<span class="small"> </span></div>
          <div class="l">Same 5 encounters in London</div>
        </div>
        <div class="savings-item divider">
          <div class="v">$213</div>
          <div class="l">Same 5 encounters in Beijing</div>
        </div>
        <div class="savings-item divider">
          <div class="v">83%</div>
          <div class="l">Average savings</div>
        </div>
        <div class="savings-item divider">
          <div class="v">$1,034</div>
          <div class="l">Money saved = flight paid for</div>
        </div>
      </div>
    </section>

    <!-- ITINERARY -->
    <section class="section alt" id="itinerary">
      <div class="section alt-inner">
        <div class="section-head" style="text-align:center;margin-bottom:48px;">
          <div class="eyebrow">3 Days · 2 Nights</div>
          <h2 class="section-title" style="margin:0 auto;">Your <span class="italic">itinerary</span></h2>
          <p class="section-sub" style="margin-left:auto;margin-right:auto;">Three wellness encounters and two culture encounters woven into three days of Beijing. Each encounter takes 2 hours. The rest is Great Wall, food, and city. You come home healthier than you left — and less of a tourist.</p>
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
              <h3>Dental & Glasses Day</h3>
              <p class="day-hook">"$200 cleaning in London. $53 in Beijing. Then 3 pairs of glasses before dinner."</p>
              <ul class="day-schedule">
                <li>
                  <span class="time">14:00</span>
                  <span class="activity">Airport pickup by LVYV guide. Transfer to hotel near the medical district. <b>30-min drive.</b></span>
                </li>
                <li>
                  <span class="time">15:00</span>
                  <span class="activity"><b>Dental Cleaning + Checkup</b> at top Beijing dental clinic. X-ray, cleaning, consultation. English-speaking staff. <span class="tag medical">Encounter 01</span></span>
                </li>
                <li>
                  <span class="time">16:30</span>
                  <span class="activity"><b>Eye Exam + Glasses Order</b> at optical center. Full optometry exam, frame selection. Glasses ready same evening. <span class="tag medical">Encounter 02</span></span>
                </li>
                <li>
                  <span class="time">18:00</span>
                  <span class="activity">Pick up glasses. Dinner at a local restaurant — <b>Peking Duck</b>, because you're in Beijing.</span>
                </li>
                <li>
                  <span class="time">20:00</span>
                  <span class="activity">Evening walk around the hutongs. Rest at hotel.</span>
                </li>
              </ul>
            </div>
          </div>
          <!-- DAY 2 -->
          <div class="day-block">
            <div class="day-label">
              <span class="day-num">02</span>
              Day Two
              <div class="day-date">Full Day · TCM + Great Wall</div>
            </div>
            <div class="day-content">
              <h3>TCM, Tai Chi & Great Wall Sunrise</h3>
              <p class="day-hook">"50 seconds of silence. Then she knew everything. Then I learned to move like the 60-year-olds in the park."</p>
              <ul class="day-schedule">
                <li>
                  <span class="time">05:00</span>
                  <span class="activity">Early departure for <b>Great Wall (Mutianyu section)</b>. Sunrise hike — beat the crowds. <span class="tag sight">Bucket list</span></span>
                </li>
                <li>
                  <span class="time">08:30</span>
                  <span class="activity">Breakfast near the city. Brunch and rest.</span>
                </li>
                <li>
                  <span class="time">14:00</span>
                  <span class="activity"><b>TCM Encounter</b> at Tier-3 hospital International Department. Pulse diagnosis, acupuncture, cupping. English guide throughout. <span class="tag tcm">Encounter 03</span></span>
                </li>
                <li>
                  <span class="time">16:00</span>
                  <span class="activity">English diagnosis report on your phone. Herbal tea in recovery lounge.</span>
                </li>
                <li>
                  <span class="time">17:30</span>
                  <span class="activity"><b>Gongfu Tea Ceremony</b> with a tea master. 12-step ritual, 5 single-origin teas, take home a tea pet. <span class="tag culture">Encounter 04</span></span>
                </li>
                <li>
                  <span class="time">19:30</span>
                  <span class="activity">Free evening. Your guide recommends dinner spots and arranges reservations.</span>
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
              <h3>Tai Chi, City & Departure</h3>
              <p class="day-hook">"Forbidden City in the morning. Tai Chi at dawn with a 20-year master. Flight home in the afternoon."</p>
              <ul class="day-schedule">
                <li>
                  <span class="time">06:00</span>
                  <span class="activity"><b>Sunrise Tai Chi</b> at the Temple of Heaven with a 20-year master. Learn the 8-form. Tea and chat after. <span class="tag culture">Encounter 05</span></span>
                </li>
                <li>
                  <span class="time">09:00</span>
                  <span class="activity">Guided visit to <b>Forbidden City</b> and Tiananmen Square. 2-hour highlights tour. <span class="tag sight">Sightseeing</span></span>
                </li>
                <li>
                  <span class="time">12:00</span>
                  <span class="activity">Farewell lunch. Last-minute shopping (tea, souvenirs, maybe herbal prescriptions).</span>
                </li>
                <li>
                  <span class="time">14:00</span>
                  <span class="activity">Hotel checkout. Transfer to airport. <b>7-day aftercare support</b> activated — WhatsApp anytime.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SOLO BREAKDOWN -->
    <section class="section">
      <div class="section-head">
        <div class="eyebrow">What's Inside</div>
        <h2 class="section-title">Five encounters. <span class="italic">One ritual.</span></h2>
        <p class="section-sub">Each encounter is also available individually — but bundled into the Ritual, you save $126 and get hotel, transfers, Great Wall sunrise and Forbidden City included.</p>
      </div>
      <div class="solo-breakdown">
        <a class="solo-item" href="/product/beijing-dental-cleaning">
          <div class="num">Encounter 01</div>
          <h4>Dental Cleaning</h4>
          <p class="desc">Professional cleaning, X-ray, consultation at a top Beijing dental clinic.</p>
          <p class="hook">"$200 in London. $53 in Beijing."</p>
          <div class="price">$53</div>
          <div class="compare">$200 in UK</div>
        </a>
        <a class="solo-item" href="/product/beijing-eye-exam-custom-glasses">
          <div class="num">Encounter 02</div>
          <h4>Eye Exam + Glasses</h4>
          <p class="desc">Full optometry exam. Custom glasses ready same day by afternoon.</p>
          <p class="hook">"Bought 3 pairs for less than 1 at home."</p>
          <div class="price">$28</div>
          <div class="compare">$300+ in US</div>
        </a>
        <a class="solo-item" href="/product/beijing-tcm-pulse-acupuncture">
          <div class="num">Encounter 03</div>
          <h4>TCM Pulse + Acupuncture</h4>
          <p class="desc">Pulse diagnosis, acupuncture, cupping at a Tier-3 hospital.</p>
          <p class="hook">"50 seconds of silence. Then she knew everything."</p>
          <div class="price">$90</div>
          <div class="compare">$470 in US</div>
        </a>
        <a class="solo-item" href="/product/beijing-gongfu-tea-ceremony">
          <div class="num">Encounter 04</div>
          <h4>Gongfu Tea Ceremony</h4>
          <p class="desc">12-step tea ritual with a master. 5 single-origin teas. Take home a tea pet.</p>
          <p class="hook">"12 steps for one cup. I'll never look at a teabag the same way."</p>
          <div class="price">$25</div>
          <div class="compare">$85 in London</div>
        </a>
        <a class="solo-item" href="/product/beijing-temple-of-heaven-tai-chi">
          <div class="num">Encounter 05</div>
          <h4>Sunrise Tai Chi</h4>
          <p class="desc">Dawn session at Temple of Heaven with a 20-year master. Learn the 8-form.</p>
          <p class="hook">"60-year-olds moving like water. I was the stiffest one there."</p>
          <div class="price">$17</div>
          <div class="compare">$90 studio class</div>
        </a>
      </div>
    </section>

    <!-- PRICE COMPARISON -->
    <section class="section alt">
      <div class="section alt-inner">
        <div class="section-head" style="text-align:center;">
          <div class="eyebrow">Total Cost Comparison</div>
          <h2 class="section-title">The savings <span class="italic">pay for your flight</span></h2>
        </div>
        <div class="compare-wrap">
          <div class="compare-head">
            <h3>The China Ritual vs. Same Services in London</h3>
            <span class="badge">Save 83%</span>
          </div>
          <div class="compare-body">
            <div class="compare-row">
              <div class="label">Dental Cleaning + Checkup<span>London private clinic</span></div>
              <div class="away">$200</div>
              <div class="here">$53</div>
            </div>
            <div class="compare-row">
              <div class="label">Eye Exam + 1 Pair Glasses<span>London optician</span></div>
              <div class="away">$400</div>
              <div class="here">$28</div>
            </div>
            <div class="compare-row">
              <div class="label">TCM Pulse + Acupuncture + Cupping<span>US TCM clinic</span></div>
              <div class="away">$470</div>
              <div class="here">$90</div>
            </div>
            <div class="compare-row">
              <div class="label">Gongfu Tea Ceremony Workshop<span>London tea house</span></div>
              <div class="away">$85</div>
              <div class="here">$25</div>
            </div>
            <div class="compare-row">
              <div class="label">Sunrise Tai Chi at Temple of Heaven<span>London studio class</span></div>
              <div class="away">$90</div>
              <div class="here">$17</div>
            </div>
            <div class="compare-row total">
              <div class="label">Total for 5 Encounters<span>Excluding flights, hotel, sightseeing</span></div>
              <div class="away">$1,245</div>
              <div class="here">$213</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- INCLUDED -->
    <section class="section" id="included">
      <div class="section-head">
        <div class="eyebrow">What's Included</div>
        <h2 class="section-title">{{ price }} covers <span class="italic">everything</span> but your flight</h2>
      </div>
      <div class="inc-grid">
        <div class="inc-card yes">
          <div class="inc-title"><span class="badge">✓</span> Included in {{ price }}</div>
          <ul class="inc-list">
            <li><b>Dental cleaning + checkup</b> at top Beijing clinic</li>
            <li><b>Eye exam + custom glasses</b> (same-day pickup)</li>
            <li><b>TCM encounter</b> — pulse, acupuncture, cupping at Tier-3 hospital</li>
            <li><b>English diagnosis report</b> from TCM session</li>
            <li><b>Gongfu tea ceremony</b> with a tea master + take-home tea pet</li>
            <li><b>Sunrise Tai Chi</b> at Temple of Heaven with a 20-year master</li>
            <li><b>2 nights hotel</b> near medical district (4-star)</li>
            <li><b>All transfers</b> — airport, hospital, sightseeing</li>
            <li><b>Great Wall sunrise</b> at Mutianyu (tickets + guide)</li>
            <li><b>Forbidden City tour</b> with English guide</li>
            <li><b>Peking Duck dinner</b> on Day 1</li>
            <li><b>Bilingual LVYV guide</b> throughout 3 days</li>
            <li><b>7-day aftercare</b> via WhatsApp</li>
          </ul>
        </div>
        <div class="inc-card no">
          <div class="inc-title"><span class="badge">✗</span> Not Included</div>
          <ul class="inc-list">
            <li>International flights (we advise on best routes)</li>
            <li>Visa fees (240-hour transit visa-free for 54 countries)</li>
            <li>Additional glasses beyond the first pair ($8/pair)</li>
            <li>Herbal prescriptions to take home (from $17)</li>
            <li>Lunches (Day 2-3) and Day 3 dinner</li>
            <li>Personal travel insurance</li>
            <li>Tips and personal expenses</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- TRUST -->
    <section class="section alt">
      <div class="section alt-inner">
        <div class="trust-grid">
          <div class="trust-card">
            <div class="trust-ico">🏥</div>
            <h4>Tier-3 Hospitals</h4>
            <p>International departments of China's top-ranked hospitals. Not back-street clinics.</p>
          </div>
          <div class="trust-card">
            <div class="trust-ico">🗣</div>
            <h4>English Throughout</h4>
            <p>Bilingual guide with you all 3 days. Doctors trained for international patients.</p>
          </div>
          <div class="trust-card">
            <div class="trust-ico">📄</div>
            <h4>Same-Day Reports</h4>
            <p>Written diagnosis in English on your phone before you leave the hospital.</p>
          </div>
          <div class="trust-card">
            <div class="trust-ico">👩‍🏫</div>
            <h4>Real Masters, Not Tourists</h4>
            <p>A 20-year Tai Chi master. A tea master with 30 years of ceremony. A grandmother who folds 40 dumplings an hour.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-band" id="book">
      <div class="cta-inner">
        <div class="eyebrow">Ready?</div>
        <h2>The savings pay for your <span class="italic">flight</span>.</h2>
        <p>3 days. 5 encounters. {{ price }}. Dental, glasses, TCM, tea ceremony, Tai Chi, Great Wall sunrise, hotel, transfers, guide. The same five services in London cost $1,245. Your flight costs less than the difference.</p>
        <div class="cta-btns">
          <button class="btn-primary" type="button" @click="booking?.open()">Book The China Ritual →</button>
          <a href="/encounters" class="btn-ghost">← Back to All Encounters</a>
        </div>
      </div>
    </section>

    <!-- BOOK BAR -->
    <div class="book-bar">
      <div class="book-bar-left">
        <div class="t">The China Ritual · 3D2N Beijing</div>
        <div class="s">Dental + Glasses + TCM + Tea + Tai Chi + Great Wall + Hotel + Transfers</div>
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

const product = encounterProducts.find(item => item.slug === 'beijing-china-ritual')!
const booking = useTemplateRef('booking')
const { sku, status, refresh } = await useEncounterProduct(product, {
  title: "The China Ritual · 3D2N Beijing · LVYV Encounters",
  description: "Dental cleaning, custom glasses, TCM pulse diagnosis, Gongfu tea ceremony and sunrise Tai Chi — five encounters in 3 days. Plus Great Wall sunrise. The savings pay for your flight.",
  hero: 'great-wall',
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
.hero{position:relative;height:90vh;min-height:620px;overflow:hidden;background:var(--green-deep);}
.hero-img{position:absolute;inset:0;background-size:cover;background-position:center 45%;}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(90deg,rgba(22,44,36,.94) 0%,rgba(22,44,36,.72) 46%,rgba(22,44,36,.18) 100%);}
.hero-content{position:absolute;top:50%;left:0;right:0;transform:translateY(-50%);z-index:3;padding:0 48px;max-width:1200px;margin:0 auto;}
.hero-crumb{display:flex;align-items:center;gap:10px;margin-bottom:22px;font-size:12px;color:rgba(247,245,240,.5);}
.hero-crumb a{color:rgba(247,245,240,.5);transition:color .2s;}
.hero-crumb a:hover{color:var(--lime-lt);}
.hero-crumb .sep{opacity:.4;}
.hero-eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:var(--green-deep);background:var(--lime);padding:7px 16px;border-radius:100px;font-weight:700;margin-bottom:20px;}
.hero h1{font-size:54px;font-weight:600;color:var(--white);line-height:1.06;letter-spacing:-.025em;margin-bottom:14px;max-width:700px;}
.hero h1 .italic{font-style:italic;font-weight:400;color:var(--lime-lt);}
.hero-hook{font-size:19px;color:rgba(247,245,240,.72);line-height:1.6;margin-bottom:24px;max-width:520px;font-weight:300;font-style:italic;}
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
.hook-block{max-width:760px;margin:0 auto 48px;text-align:center;padding:0 24px;}
.hook-block .quote{font-size:26px;font-weight:400;color:var(--green);line-height:1.4;font-style:italic;letter-spacing:-.01em;}
.hook-block .quote .accent{color:var(--coral);font-weight:600;}
.hook-block .attribution{font-size:13px;color:var(--muted);margin-top:14px;}
.hook-block .attribution .name{color:var(--green);font-weight:600;}

/* SAVINGS BANNER */
.savings-banner{background:var(--green-deep);border-radius:18px;padding:36px 48px;display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:32px;align-items:center;margin-bottom:0;}
.savings-item{text-align:center;}
.savings-item .v{font-size:28px;font-weight:700;color:var(--lime-lt);letter-spacing:-.02em;}
.savings-item .v .small{font-size:14px;}
.savings-item .l{font-size:11px;color:rgba(247,245,240,.5);margin-top:6px;letter-spacing:.04em;}
.savings-item.divider{border-left:1px solid rgba(127,176,105,.15);}

/* ITINERARY */
.itinerary{display:flex;flex-direction:column;gap:0;}
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
.day-schedule .activity .tag.medical{background:rgba(123,168,181,.12);color:var(--sky);}
.day-schedule .activity .tag.tcm{background:rgba(127,176,105,.12);color:var(--lime-dim);}
.day-schedule .activity .tag.sight{background:rgba(216,84,47,.11);color:var(--coral);}

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

/* SOLO BREAKDOWN */
.solo-breakdown{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:32px;}
.solo-item{background:var(--white);border:1px solid var(--line);border-radius:14px;padding:24px;text-align:center;transition:all .25s;}
.solo-item:hover{border-color:var(--lime);transform:translateY(-3px);box-shadow:0 8px 24px rgba(30,58,47,.08);}
.solo-item .num{font-size:11px;letter-spacing:.24em;color:var(--lime-dim);font-weight:700;margin-bottom:8px;}
.solo-item h4{font-size:16px;font-weight:600;color:var(--green);margin-bottom:6px;}
.solo-item .desc{font-size:12px;color:var(--muted);line-height:1.5;margin-bottom:10px;}
.solo-item .hook{font-size:11px;color:var(--coral);font-style:italic;margin-bottom:12px;}
.solo-item .price{font-size:20px;font-weight:700;color:var(--green);}
.solo-item .compare{font-size:11px;color:var(--coral);text-decoration:line-through;margin-top:4px;}

/* TRUST */
.trust-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;}
.trust-card{background:var(--white);border:1px solid var(--line);border-radius:14px;padding:24px 22px;text-align:center;transition:all .28s;}
.trust-card:hover{border-color:var(--lime-lt);transform:translateY(-3px);}
.trust-ico{font-size:26px;margin-bottom:12px;}
.trust-card h4{font-size:14px;font-weight:700;color:var(--green);margin-bottom:7px;}
.trust-card p{font-size:12px;color:var(--muted);line-height:1.6;}

/* CTA BAND */
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
  .savings-banner{grid-template-columns:1fr 1fr;gap:20px;padding:24px;}
  .day-block{grid-template-columns:1fr;gap:16px;}
  .inc-grid{grid-template-columns:1fr;}
  .compare-row{grid-template-columns:1fr 1fr;}
  .compare-row .label{grid-column:1/-1;}
  .solo-breakdown{grid-template-columns:1fr;}
  .trust-grid{grid-template-columns:repeat(2,1fr);}
  .section{padding:48px 24px;}
  .section-title,.cta-inner h2{font-size:26px;}
  .book-bar{padding:14px 20px;flex-direction:column;text-align:center;}
}
</style>
