<template>
  <main class="route-original" ref="page">
    <!-- HERO (Screen 1) -->
    <section class="hero" id="top">
      <div class="hero-media"></div>
      <div class="hero-overlay"></div>
      <div class="hero-badges">
        <span class="badge-editor">Tier-3 Hospital · 1-Day</span>
        <span class="badge-days">1D</span>
      </div>
      <div class="hero-content">
        <div class="hero-eyebrow"><span class="text">Beijing · Tier-3 Hospital TCM</span></div>
        <h1>The Doctor Who Reads Your <span class="italic">Wrist</span></h1>
        <p class="hero-tagline">Full TCM immersion in one day. A licensed doctor reads your pulse for 50 seconds, then guides you through acupuncture, cupping, and a personalized treatment — with an English report before you leave.</p>
        <p class="hero-quote">"A doctor read my pulse for 50 seconds and knew more about me than my GP of 10 years."</p>
        <div class="hero-tags">
          <span class="hero-tag">50-sec Pulse Reading</span>
          <span class="hero-tag">Acupuncture</span>
          <span class="hero-tag">Cupping</span>
          <span class="hero-tag">English Report</span>
        </div>
        <div class="hero-foot">
          <div class="hero-price">
            <span class="from">from</span>{{ ' ' }}
            <span class="num">{{ price }}</span>{{ ' ' }}
            <span class="unit">/ person · 1 day</span>
          </div>
          <div class="hero-cta-group">
            <a href="#book" class="btn-primary">Book This Day →</a>
            <a href="#treatments" class="btn-ghost">See the 4 Steps</a>
          </div>
        </div>
      </div>
      <div class="scroll-hint">Scroll to explore</div>
    </section>

    <!-- STORY (Screen 2) -->
    <section class="story-section" id="story">
      <div class="story-inner">
        <div class="story-grid">
          <figure class="story-collage">
            <div class="c1"><img src="/images/encounters/wellness/detail/user-pulse.webp" alt="A TCM doctor reading a patient's radial pulse" loading="lazy"></div>
            <div class="c2"><img src="/images/encounters/wellness/detail/user-moxa-smoke.webp" alt="Moxibustion smoke rising over dried herbs" loading="lazy"></div>
            <div class="c2"><img src="/images/encounters/wellness/detail/user-moxa-back.webp" alt="A moxibustion stick applied along the back" loading="lazy"></div>
          </figure>
          <div class="story-text">
            <span class="story-badge">Why a Tier-3 Hospital</span>
            <h2>Three fingers. Fifty seconds. <span class="italic">A whole day of answers.</span></h2>
            <p>In traditional Chinese medicine, the pulse tells a story that words often can't. A skilled doctor places three fingers on your wrist — each reading a different depth, a different organ system. In fifty seconds of silence, they can identify patterns you've been living with for years.</p>
            <p>This immersion takes you inside a <strong>Tier-3 (三级甲等) TCM hospital in Beijing</strong> — China's highest hospital accreditation, and the same tier as the city's top general hospitals. Not a tourist clinic. Your doctor reads your pulse and tongue, explains what they find through your companion, then designs a treatment built around <strong>your body, not a menu</strong>.</p>
            <p>Acupuncture and cupping follow, and everything is written down for you in English before you leave. <strong>No guesswork, no mystery herbs, no language barrier</strong> — just one of the oldest medical systems on earth, explained properly, in a hospital you can trust.</p>
            <div class="story-stats">
              <div class="ss-item"><div class="ss-num">50 sec</div><div class="ss-lbl">Pulse reading</div></div>
              <div class="ss-item"><div class="ss-num">3</div><div class="ss-lbl">Core treatments</div></div>
              <div class="ss-item"><div class="ss-num">100%</div><div class="ss-lbl">English-speaking</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TREATMENTS (Screen 3) -->
    <section class="section" id="treatments">
      <div class="section-header">
        <div class="eyebrow">What's included</div>
        <h2 class="section-title">Four steps, one <span class="italic">full reading</span></h2>
        <p class="section-sub">A complete TCM day at a Tier-3 hospital — diagnosis, needling, suction, and a written record. Every step is performed by a licensed physician and explained in English as it happens.</p>
      </div>
      <div class="treat-grid">
        <div class="treat-card reveal">
          <div class="tc-media">
            <img src="/images/encounters/wellness/detail/user-pulse.webp" alt="Three fingers reading a patient's radial pulse" loading="lazy">
            <div class="tc-num">01</div>
            <div class="tc-dur">50 sec</div>
          </div>
          <div class="tc-body">
            <div class="tc-kicker">Step One · Read</div>
            <h3>50-Second Pulse Reading</h3>
            <div class="tc-cn">切脉 · Qiè Mài</div>
            <p>Three fingers on your wrist, each at a different depth, reading the rhythm and quality of your qi. Your doctor also checks your tongue and asks about sleep, digestion, stress and energy.</p>
            <ul class="tc-facts">
              <li><b>What it feels like:</b> three fingertips, completely painless.</li>
              <li><b>Why 50 seconds?</b> long enough to sense patterns beneath the surface.</li>
            </ul>
          </div>
        </div>
        <div class="treat-card reveal">
          <div class="tc-media">
            <img src="/images/encounters/wellness/detail/user-acupuncture.webp" alt="Fine sterile acupuncture needles placed along meridians" loading="lazy">
            <div class="tc-num">02</div>
            <div class="tc-dur">30 min</div>
          </div>
          <div class="tc-body">
            <div class="tc-kicker">Step Two · Rebalance</div>
            <h3>Acupuncture</h3>
            <div class="tc-cn">针灸 · Zhēn Jiǔ</div>
            <p>Hair-thin, single-use sterile needles placed at the points your diagnosis calls for — usually along the legs, back, neck or arms. Most guests relax deeply, and many fall asleep.</p>
            <ul class="tc-facts">
              <li><b>Does it hurt?</b> a brief prickle at placement, then usually nothing.</li>
              <li><b>Good for:</b> pain, poor sleep, stress, digestion, jet lag.</li>
            </ul>
          </div>
        </div>
        <div class="treat-card reveal">
          <div class="tc-media">
            <img src="/images/encounters/wellness/detail/user-cupping.webp" alt="Bamboo cupping cups applied along the back" loading="lazy">
            <div class="tc-num">03</div>
            <div class="tc-dur">20 min</div>
          </div>
          <div class="tc-body">
            <div class="tc-kicker">Step Three · Draw</div>
            <h3>Cupping</h3>
            <div class="tc-cn">拔罐 · Bá Guàn</div>
            <p>A flame goes inside a glass cup, the cup seals onto your skin, and the cooling air draws tension toward the surface. Usually applied along the back and shoulders after acupuncture.</p>
            <ul class="tc-facts">
              <li><b>The marks:</b> round circles, painless, fade in 3–7 days. You can skip this step.</li>
              <li><b>Good for:</b> tight shoulders, stiff back, "stuck" rather than tired.</li>
            </ul>
          </div>
        </div>
        <div class="treat-card reveal">
          <div class="tc-media">
            <img src="/images/encounters/wellness/detail/prescription-report.webp" alt="A written TCM report and prepared herbal medicine on a counter" loading="lazy">
            <div class="tc-num">04</div>
            <div class="tc-dur">10 min</div>
          </div>
          <div class="tc-body">
            <div class="tc-kicker">Step Four · Record</div>
            <h3>English Report</h3>
            <div class="tc-cn">报告 · Bàogào</div>
            <p>Before you leave, your doctor writes up what was found and treated — your pattern, the points used, any herbs suggested, and simple lifestyle notes — all in plain English.</p>
            <ul class="tc-facts">
              <li><b>Take it with you:</b> a printed summary you can show any doctor back home.</li>
              <li><b>No guesswork:</b> you'll understand exactly what happened to your body.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- SCHEDULE + SAFETY (Screen 4) -->
    <section class="combo-section" id="schedule">
      <div class="combo-inner">
        <div class="combo-grid">
          <div class="combo-left">
            <div class="eyebrow">Full-day schedule</div>
            <h2>Your immersion, <span class="italic">hour by hour</span></h2>
            <p class="combo-sub">A real Tier-3 hospital appointment, translated and paced for a traveller. Your LVYV companion stays with you from check-in to your English report.</p>
            <div class="sched-list">
              <div class="sched-item"><div class="sched-time">09:00</div><div><div class="sched-title">Meet at the Tier-3 Hospital</div><div class="sched-desc">Your LVYV companion greets you at the entrance and handles registration and paperwork. Tea on arrival.</div></div></div>
              <div class="sched-item"><div class="sched-time">09:30</div><div><div class="sched-title">Pulse &amp; Tongue Reading · 50 sec</div><div class="sched-desc">The doctor reads your pulse at three depths, checks your tongue, and asks about sleep, digestion and energy.</div></div></div>
              <div class="sched-item"><div class="sched-time">10:00</div><div><div class="sched-title">Diagnosis &amp; Treatment Plan</div><div class="sched-desc">Your doctor explains what they found and designs an acupuncture and cupping plan around your symptoms.</div></div></div>
              <div class="sched-item"><div class="sched-time">10:30</div><div><div class="sched-title">Acupuncture · 30 min</div><div class="sched-desc">Fine sterile needles in a private room. Most guests relax deeply or nap.</div></div></div>
              <div class="sched-item"><div class="sched-time">11:30</div><div><div class="sched-title">Cupping · 20 min</div><div class="sched-desc">Heated glass cups along the back and shoulders to draw out deep tension.</div></div></div>
              <div class="sched-item"><div class="sched-time">12:15</div><div><div class="sched-title">Tea &amp; English Report</div><div class="sched-desc">Go through your written report, understand what was treated, get simple advice. Free by early afternoon.</div></div></div>
            </div>
          </div>
          <div class="combo-right">
            <div class="eyebrow">Safety &amp; standards</div>
            <h2>A Tier-3 hospital, <span class="italic">not a spa</span></h2>
            <p class="combo-sub">The part that matters most for international travellers. Here is exactly who treats you, and under what standards.</p>
            <ul class="safety-list">
              <li><b>Tier-3 accredited.</b> A 三级甲等 (Grade III Class A) hospital — China's highest hospital grading, with the specialist staff and clinical standards to match.</li>
              <li><b>Licensed physicians only.</b> Certified TCM doctors (执业医师) on the hospital's own roster — you can request to see their licence.</li>
              <li><b>Single-use &amp; sterilised.</b> Acupuncture needles are sterile and opened in front of you. All cups and equipment disinfected between guests.</li>
              <li><b>You control the treatment.</b> Cupping can be skipped, needles adjusted or stopped at any time — just tell your companion.</li>
              <li><b>English throughout.</b> Your bilingual companion translates every step, and the final report is written in English.</li>
            </ul>
            <div class="safety-voices">
              <div class="voice-mini">
                <div class="stars">★★★★★</div>
                <p>"She read my pulse for 50 seconds and named problems I'd never mentioned. The acupuncture and cupping afterwards made it feel like a real treatment, not a tourist show."</p>
                <div class="who"><b>Helen W.</b> · Sydney, Australia</div>
              </div>
              <div class="voice-mini">
                <div class="stars">★★★★★</div>
                <p>"The English report was the best part — I could finally understand what was going on with my body. A real Tier-3 hospital, real doctors, zero confusion."</p>
                <div class="who"><b>Peter L.</b> · Berlin, Germany</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PRICE + FAQ + CTA (Screen 5) -->
    <section id="book" ref="closing" class="closing-section">
      <div class="closing-inner">
        <div class="closing-left">
          <div class="eyebrow">Pricing</div>
          <h2>A full day of TCM, finally explained.</h2>
          <p>{{ price }} covers the consultation, 50-second pulse and tongue reading, acupuncture, cupping, your English report, and your LVYV companion for the day. No hidden hospital fees.</p>
          <div class="price-main">
            <span class="from">from</span>{{ ' ' }}
            <span class="num">{{ price }}</span>{{ ' ' }}
            <span class="unit">/ person · 1 day</span>
          </div>
          <ul class="price-list">
            <li>Full consultation &amp; 50-second pulse reading</li>
            <li>Tongue diagnosis &amp; health questions</li>
            <li>Personalized acupuncture session</li>
            <li>Fire cupping treatment</li>
            <li>Written English diagnosis &amp; treatment report</li>
            <li>English-speaking LVYV companion</li>
          </ul>
          <div class="price-compare">
            <div class="price-compare-item"><div class="label">TCM consult in the US</div><div class="val">$150–300</div></div>
            <div class="price-compare-item"><div class="label">Acupuncture in the US</div><div class="val">$120–250</div></div>
            <div class="price-compare-item win"><div class="label">With LVYV in Beijing</div><div class="val">{{ price }}</div></div>
          </div>
          <div class="closing-cta">
            <button type="button" class="btn-primary" @click="booking?.open()">Book This Day →</button>
            <a href="/wish/create" class="btn-ghost">💬 Contact Us</a>
          </div>
        </div>
        <div class="faq-list-c" id="faq">
          <div class="eyebrow">FAQ</div>
          <h2>Common questions</h2>
          <details class="faq-item-c" open>
            <summary>Is this really a Tier-3 hospital?</summary>
            <p>Yes — a 三级甲等 (Grade III Class A) TCM hospital in Beijing, China's highest hospital accreditation, the same tier as the city's top general hospitals. All treating doctors are certified physicians on the hospital's own roster. Not a tourist clinic or spa.</p>
          </details>
          <details class="faq-item-c">
            <summary>What does "Tier-3 hospital" actually mean?</summary>
            <p>China grades hospitals from Tier-1 to Tier-3, with Tier-3 being the highest — and "Grade III Class A" (三级甲等) the top sub-level. It reflects specialist staff, clinical standards and equipment. It's the same grading as Beijing's major general hospitals.</p>
          </details>
          <details class="faq-item-c">
            <summary>Does acupuncture hurt? What about cupping?</summary>
            <p>Most guests feel only a brief prickle as needles are placed, then deep relaxation. Cupping is painless suction, though it leaves round marks for 3–7 days. Either step can be adjusted or skipped.</p>
          </details>
          <details class="faq-item-c">
            <summary>Can the doctor really tell that much from my pulse?</summary>
            <p>In TCM, the pulse is read at three depths and positions, and combined with your tongue and a short health interview. Many guests are surprised by how accurate it feels — see the quote above for a typical reaction.</p>
          </details>
          <details class="faq-item-c">
            <summary>Do I need to speak Chinese?</summary>
            <p>No. Your bilingual LVYV companion translates the entire consultation and every treatment step, and your written report is in English.</p>
          </details>
          <details class="faq-item-c">
            <summary>What should I wear?</summary>
            <p>Loose, comfortable clothing that can be rolled up to expose your arms and legs. The treatment room is private and disposable covers are provided.</p>
          </details>
          <details class="faq-item-c">
            <summary>Can I combine this with other Beijing experiences?</summary>
            <p>Yes. You're free by early afternoon, so it pairs easily with the Great Wall, the Forbidden City, the Temple of Heaven, or a hutong walk.</p>
          </details>
        </div>
      </div>
    </section>

    <!-- FLOATING BOOKING BAR -->
    <div id="bookBar" ref="bookingBar" class="book-bar hidden" inert>
      <div class="book-bar-inner">
        <div class="bb-info">
          <div class="bb-icon">🌿</div>
          <div class="bb-text">
            <div class="bb-title">The Doctor Who Reads Your Wrist · Beijing</div>
            <div class="bb-meta">Tier-3 Hospital TCM · Pulse · Acupuncture · Cupping</div>
          </div>
        </div>
        <div class="bb-price">
          <span class="bb-from">from</span>{{ ' ' }}
          <span class="bb-num">{{ price }}</span>{{ ' ' }}
          <span class="bb-unit">/ person</span>
        </div>
        <div class="bb-actions">
          <a href="/wish/create" class="bb-wa">💬 Contact</a>
          <button type="button" class="bb-btn" @click="booking?.open()">Book Now →</button>
        </div>
      </div>
    </div>

    <EncounterBookingDialog ref="booking" :product="product" :sku="sku" :status="status" @retry="refresh()" />
  </main>
</template>

<script setup lang="ts">
import { encounterProducts } from '~~/shared/utils/encounterProducts'

const product = encounterProducts.find(item => item.slug === 'beijing-wrist-tcm-day')!
const booking = useTemplateRef('booking')
useEncounterDayScroll()
const { sku, status, refresh } = await useEncounterProduct(product, {
  title: "The Doctor Who Reads Your Wrist · Tier-3 Hospital TCM in Beijing · LVYV Encounters",
  description: "A full-day TCM immersion at a Tier-3 hospital in Beijing. A licensed doctor reads your pulse for 50 seconds, then guides you through acupuncture, cupping, and a personalized treatment — with an English report before you leave.",
  hero: 'detail/hero-cupping-banner',
})
const price = computed(() => sku.value ? encounterPrice(sku.value.price) : '—')
</script>

<style scoped>
/* Keep the prototype typography and spacing independent of the global site styles. */
.route-original { font-size: 16px; }
section { padding: 0; scroll-margin-top: 0; }
h1, h2, h3, h4, h5, h6 { font-family: inherit; }
h2 { font-size: 1.5em; font-weight: bold; line-height: inherit; color: inherit; }
button { line-height: inherit; }

*{margin:0;padding:0;box-sizing:border-box;}
.route-original{
  --green:#1E3A2F;--green-deep:#162C24;--green-soft:#2C4A3C;--green-mist:#4A6B5C;
  --lime:#7FB069;--lime-lt:#C9E4C0;--lime-dim:#5F8C4C;--lime-pale:#EAF3E5;
  --cream:#F7F5F0;--paper:#FCFBF7;--ink:#1E2B25;
  --muted:#6B7A72;--muted-lt:#9AABA3;--line:#E8E4DC;--line-lt:#F0EEE7;
  --white:#fff;--coral:#D8542F;--terra:#B85C3A;--sky:#7BA8B5;
  --gold:#C9A961;
  --shadow-sm:0 2px 12px rgba(30,58,47,.06);
  --shadow-md:0 12px 32px rgba(30,58,47,.10);
  --shadow-lg:0 24px 60px rgba(22,44,36,.18);
}
.route-original{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,"PingFang SC","Microsoft YaHei",sans-serif;background:var(--paper);color:var(--ink);line-height:1.7;-webkit-font-smoothing:antialiased;overflow-x:clip;}
a{font-family:inherit;text-decoration:none;color:inherit;}
img{max-width:100%;display:block;}
::selection{background:var(--lime);color:var(--green-deep);}

/* BUTTONS */
.btn-primary{background:var(--lime);color:var(--green-deep);padding:14px 32px;border-radius:100px;font-size:14px;font-weight:600;letter-spacing:.04em;transition:all .25s;display:inline-flex;align-items:center;gap:8px;cursor:pointer;border:none;font-family:inherit;}
.btn-primary:hover{background:var(--lime-lt);transform:translateY(-2px);box-shadow:0 10px 24px rgba(127,176,105,.28);}
.btn-ghost{border:1px solid rgba(201,228,192,.30);color:var(--cream);padding:14px 32px;border-radius:100px;font-size:14px;font-weight:400;letter-spacing:.04em;transition:all .25s;display:inline-flex;align-items:center;gap:8px;cursor:pointer;background:transparent;font-family:inherit;}
.btn-ghost:hover{border-color:var(--lime);background:rgba(127,176,105,.10);}

/* HERO */
.hero{position:relative;min-height:88vh;overflow:hidden;background:linear-gradient(135deg,var(--green-deep) 0%,var(--green) 100%);display:flex;align-items:flex-end;}
.hero-media{position:absolute;inset:0;background:url('/images/encounters/wellness/detail/hero-cupping-banner.webp') center/cover no-repeat;transform:scale(1.06);animation:heroZoom 22s ease-in-out infinite alternate;}
@keyframes heroZoom{from{transform:scale(1.06);}to{transform:scale(1.14);}}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(22,44,36,.28) 0%,rgba(22,44,36,.52) 42%,rgba(22,44,36,.94) 100%);}
.hero-content{position:relative;z-index:3;width:100%;max-width:1200px;margin:0 auto;padding:120px 48px 70px;}
.hero-badges{position:absolute;top:84px;left:48px;right:48px;max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;z-index:4;}
.badge-editor{display:inline-flex;align-items:center;gap:6px;font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#fff;font-weight:700;padding:8px 18px;border-radius:10px;background:var(--green-soft);box-shadow:0 4px 16px rgba(22,44,36,.35);}
.badge-days{font-size:13px;font-weight:700;color:var(--cream);background:rgba(22,44,36,.55);padding:8px 16px;border-radius:10px;backdrop-filter:blur(6px);border:1px solid rgba(247,245,240,.15);}
.hero-eyebrow{display:flex;align-items:center;gap:10px;margin-bottom:18px;}
.hero-eyebrow .text{font-size:11px;letter-spacing:.32em;text-transform:uppercase;color:var(--lime-lt);font-weight:500;}
.hero h1{font-size:56px;font-weight:600;color:var(--white);line-height:1.05;letter-spacing:-.03em;margin-bottom:16px;max-width:760px;}
.hero h1 .italic{font-style:italic;font-weight:400;color:var(--lime-lt);}
.hero-tagline{font-size:17px;color:rgba(247,245,240,.78);line-height:1.7;margin-bottom:20px;max-width:560px;font-weight:300;}
.hero-quote{font-size:14px;color:rgba(247,245,240,.55);line-height:1.6;margin-bottom:24px;max-width:500px;padding-left:16px;border-left:2px solid var(--lime);font-style:italic;}
.hero-tags{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:28px;}
.hero-tag{font-size:12px;padding:7px 14px;border-radius:100px;background:rgba(247,245,240,.1);color:var(--cream);border:1px solid rgba(201,228,192,.22);backdrop-filter:blur(4px);letter-spacing:.04em;}
.hero-foot{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap;}
.hero-price .from{font-size:13px;color:rgba(247,245,240,.6);}
.hero-price .num{font-size:40px;font-weight:700;color:var(--lime-lt);letter-spacing:-.02em;}
.hero-price .unit{font-size:13px;color:rgba(247,245,240,.5);margin-left:4px;}
.hero-cta-group{display:flex;gap:14px;flex-wrap:wrap;}
.scroll-hint{position:absolute;bottom:22px;left:50%;transform:translateX(-50%);z-index:5;font-size:10px;color:rgba(247,245,240,.35);letter-spacing:.24em;text-transform:uppercase;animation:bounce 2s ease-in-out infinite;}
@keyframes bounce{0%,100%{transform:translateX(-50%) translateY(0);}50%{transform:translateX(-50%) translateY(8px);}}

/* SECTION */
.section{padding:68px 48px;max-width:1200px;margin:0 auto;}
.section-header{text-align:center;margin-bottom:40px;}
.eyebrow{font-size:11px;letter-spacing:.32em;text-transform:uppercase;color:var(--lime-dim);font-weight:600;margin-bottom:12px;}
.section-title{font-size:36px;font-weight:600;color:var(--green);letter-spacing:-.018em;line-height:1.15;}
.section-title .italic{font-style:italic;font-weight:400;color:var(--green-mist);}
.section-sub{font-size:15px;color:var(--muted);margin-top:14px;max-width:580px;margin-left:auto;margin-right:auto;line-height:1.7;}

/* STORY (compact) */
.story-section{background:var(--cream);position:relative;overflow:hidden;}
.story-inner{max-width:1200px;margin:0 auto;padding:68px 48px;}
.story-grid{display:grid;grid-template-columns:1fr 1.1fr;gap:48px;align-items:center;}
.story-collage{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.story-collage .c1{grid-column:span 2;border-radius:16px;overflow:hidden;aspect-ratio:16/8;box-shadow:var(--shadow-md);}
.story-collage .c2{border-radius:14px;overflow:hidden;aspect-ratio:4/3;box-shadow:var(--shadow-sm);}
.story-collage img{width:100%;height:100%;object-fit:cover;transition:transform .7s ease;}
.story-collage .c1:hover img,.story-collage .c2:hover img{transform:scale(1.05);}
.story-badge{display:inline-block;background:var(--green);color:var(--lime-lt);font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;padding:7px 14px;border-radius:8px;margin-bottom:16px;}
.story-text h2{font-size:30px;font-weight:600;color:var(--green);letter-spacing:-.018em;line-height:1.2;margin-bottom:14px;}
.story-text h2 .italic{font-style:italic;font-weight:400;color:var(--green-mist);}
.story-text p{font-size:14.5px;color:var(--muted);line-height:1.8;margin-bottom:14px;}
.story-text p strong{color:var(--green-soft);font-weight:600;}
.story-stats{display:flex;gap:24px;margin-top:20px;padding-top:20px;border-top:1px solid var(--line);}
.ss-item .ss-num{font-size:24px;font-weight:700;color:var(--lime-dim);line-height:1;}
.ss-item .ss-lbl{font-size:11px;color:var(--muted);margin-top:4px;letter-spacing:.06em;}

/* TREATMENTS (2x2 grid, compact) */
.treat-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;}
.treat-card{background:var(--white);border:1px solid var(--line);border-radius:18px;overflow:hidden;box-shadow:var(--shadow-sm);transition:all .3s;display:flex;flex-direction:column;}
.treat-card:hover{box-shadow:var(--shadow-md);border-color:var(--lime-lt);transform:translateY(-3px);}
.tc-media{position:relative;aspect-ratio:16/9;overflow:hidden;background:var(--green-soft);}
.tc-media img{width:100%;height:100%;object-fit:cover;transition:transform .7s ease;}
.treat-card:hover .tc-media img{transform:scale(1.06);}
.tc-num{position:absolute;top:16px;left:16px;z-index:2;width:36px;height:36px;border-radius:50%;background:rgba(22,44,36,.75);backdrop-filter:blur(6px);color:var(--lime-lt);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;border:1px solid rgba(201,228,192,.28);}
.tc-dur{position:absolute;bottom:14px;left:16px;z-index:2;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#fff;background:rgba(22,44,36,.66);backdrop-filter:blur(6px);padding:6px 12px;border-radius:100px;}
.tc-body{padding:24px 26px;flex:1;display:flex;flex-direction:column;}
.tc-kicker{font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:var(--lime-dim);font-weight:700;margin-bottom:6px;}
.tc-body h3{font-size:22px;font-weight:600;color:var(--green);letter-spacing:-.015em;margin-bottom:2px;line-height:1.2;}
.tc-cn{font-size:13px;color:var(--gold);margin-bottom:12px;letter-spacing:.06em;}
.tc-body>p{font-size:14px;color:var(--muted);line-height:1.75;margin-bottom:14px;}
.tc-facts{list-style:none;margin-bottom:0;margin-top:auto;}
.tc-facts li{font-size:13px;color:var(--green-soft);padding:7px 0 7px 22px;position:relative;line-height:1.55;border-top:1px dashed var(--line-lt);}
.tc-facts li:first-child{border-top:none;}
.tc-facts li::before{content:"";position:absolute;left:0;top:14px;width:8px;height:8px;border-radius:50%;background:var(--lime-pale);border:2px solid var(--lime);}
.tc-facts li b{color:var(--green);font-weight:600;}

/* SCHEDULE + SAFETY (split) */
.combo-section{background:var(--cream);}
.combo-inner{max-width:1200px;margin:0 auto;padding:68px 48px;}
.combo-grid{display:grid;grid-template-columns:1.2fr 1fr;gap:48px;align-items:start;}
.combo-left h2,.combo-right h2{font-size:28px;font-weight:600;color:var(--green);letter-spacing:-.015em;line-height:1.2;margin-bottom:6px;}
.combo-left h2 .italic,.combo-right h2 .italic{font-style:italic;font-weight:400;color:var(--green-mist);}
.combo-sub{font-size:14px;color:var(--muted);margin-bottom:24px;line-height:1.7;}
.sched-list{display:flex;flex-direction:column;gap:0;}
.sched-item{display:grid;grid-template-columns:64px 1fr;gap:16px;padding:14px 0;border-top:1px solid var(--line);align-items:baseline;}
.sched-item:first-child{border-top:none;}
.sched-time{font-size:13px;font-weight:700;color:var(--lime-dim);letter-spacing:.04em;}
.sched-title{font-size:15px;font-weight:600;color:var(--green);margin-bottom:2px;}
.sched-desc{font-size:13px;color:var(--muted);line-height:1.6;}
.safety-list{list-style:none;}
.safety-list li{font-size:14px;color:var(--muted);padding:14px 0 14px 28px;position:relative;line-height:1.7;border-top:1px solid var(--line);}
.safety-list li:first-child{border-top:none;}
.safety-list li::before{content:"✓";position:absolute;left:0;top:14px;color:var(--lime);font-weight:700;font-size:15px;}
.safety-list li b{color:var(--green);font-weight:600;}
.safety-voices{margin-top:24px;display:flex;flex-direction:column;gap:14px;}
.voice-mini{background:var(--white);border:1px solid var(--line);border-radius:14px;padding:18px 20px;box-shadow:var(--shadow-sm);}
.voice-mini .stars{font-size:12px;color:var(--gold);letter-spacing:2px;margin-bottom:8px;}
.voice-mini p{font-size:13.5px;color:var(--green-soft);line-height:1.7;font-style:italic;margin-bottom:10px;}
.voice-mini .who{font-size:12px;color:var(--muted-lt);}
.voice-mini .who b{color:var(--green);font-weight:600;}

/* PRICE + FAQ + CTA */
.closing-section{background:var(--green-deep);position:relative;overflow:hidden;padding:68px 48px;}
.closing-section::before{content:"";position:absolute;inset:0;opacity:.04;background-image:repeating-linear-gradient(45deg,transparent,transparent 60px,var(--lime-lt) 60px,var(--lime-lt) 61px);}
.closing-inner{position:relative;z-index:2;max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:start;}
.closing-left .eyebrow{color:var(--lime);}
.closing-left h2{font-size:32px;font-weight:600;color:var(--white);line-height:1.15;margin-bottom:12px;letter-spacing:-.018em;}
.closing-left>p{color:rgba(247,245,240,.6);font-size:14.5px;line-height:1.75;margin-bottom:24px;}
.price-main{display:flex;align-items:baseline;gap:8px;margin-bottom:20px;}
.price-main .from{font-size:14px;color:rgba(247,245,240,.55);}
.price-main .num{font-size:52px;font-weight:700;color:var(--lime-lt);letter-spacing:-.02em;line-height:1;}
.price-main .unit{font-size:14px;color:rgba(247,245,240,.5);}
.price-list{list-style:none;margin-bottom:24px;}
.price-list li{font-size:13px;color:rgba(247,245,240,.7);padding:6px 0;display:flex;align-items:center;gap:10px;}
.price-list li::before{content:"✓";color:var(--lime);font-weight:700;}
.price-compare{display:flex;gap:28px;flex-wrap:wrap;padding-top:18px;border-top:1px solid rgba(247,245,240,.12);margin-bottom:28px;}
.price-compare-item .label{font-size:11px;color:rgba(247,245,240,.45);letter-spacing:.08em;}
.price-compare-item .val{font-size:16px;font-weight:600;color:var(--white);margin-top:2px;}
.price-compare-item.win .val{color:var(--lime-lt);}
.price-compare-item.win .label{color:var(--lime);font-weight:600;}
.faq-list-c{display:flex;flex-direction:column;gap:0;}
.faq-list-c .eyebrow{color:var(--lime);}
.faq-list-c h2{font-size:28px;font-weight:600;color:var(--white);line-height:1.2;margin-bottom:20px;letter-spacing:-.015em;}
.faq-item-c{border-bottom:1px solid rgba(247,245,240,.1);padding:14px 0;}
.faq-item-c summary{font-size:14px;font-weight:600;color:var(--cream);cursor:pointer;list-style:none;display:flex;align-items:center;gap:10px;}
.faq-item-c summary::-webkit-details-marker{display:none;}
.faq-item-c summary::before{content:"+";color:var(--lime);font-size:16px;font-weight:400;flex-shrink:0;}
.faq-item-c[open] summary::before{content:"−";}
.faq-item-c p{font-size:13px;color:rgba(247,245,240,.55);margin-top:10px;padding-left:26px;line-height:1.7;}
.closing-cta{margin-top:28px;display:flex;gap:14px;flex-wrap:wrap;}

/* FLOATING BOOKING BAR */
.book-bar{position:fixed;bottom:0;left:0;right:0;z-index:90;background:rgba(252,251,248,.96);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-top:1px solid var(--line);box-shadow:0 -8px 30px rgba(22,44,36,.08);transition:transform .35s cubic-bezier(.2,.7,.3,1),opacity .3s;}
.book-bar.hidden{transform:translateY(100%);opacity:0;pointer-events:none;}
.book-bar-inner{max-width:1200px;margin:0 auto;padding:12px 48px;display:flex;align-items:center;justify-content:space-between;gap:20px;}
.bb-info{display:flex;align-items:center;gap:16px;}
.bb-info .bb-icon{width:40px;height:40px;border-radius:12px;background:var(--lime-pale);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
.bb-text{display:flex;flex-direction:column;}
.bb-text .bb-title{font-size:14px;font-weight:600;color:var(--green);line-height:1.3;}
.bb-text .bb-meta{font-size:12px;color:var(--muted);line-height:1.4;}
.bb-price{display:flex;align-items:baseline;gap:4px;}
.bb-price .bb-from{font-size:11px;color:var(--muted);}
.bb-price .bb-num{font-size:24px;font-weight:700;color:var(--green);letter-spacing:-.02em;}
.bb-price .bb-unit{font-size:11px;color:var(--muted-lt);}
.bb-actions{display:flex;align-items:center;gap:12px;}
.bb-wa{font-size:13px;color:var(--muted);font-weight:500;transition:color .2s;display:flex;align-items:center;gap:6px;}
.bb-wa:hover{color:var(--green);}
.bb-btn{background:var(--lime);color:var(--green-deep);padding:12px 28px;border-radius:100px;font-size:14px;font-weight:600;letter-spacing:.04em;transition:all .25s;display:inline-flex;align-items:center;gap:8px;cursor:pointer;border:none;font-family:inherit;white-space:nowrap;}
.bb-btn:hover{background:var(--lime-lt);transform:translateY(-1px);box-shadow:0 8px 20px rgba(127,176,105,.3);}

/* REVEAL */
.reveal{opacity:0;transform:translateY(24px);transition:opacity .6s cubic-bezier(.2,.7,.3,1),transform .6s cubic-bezier(.2,.7,.3,1);}
.reveal.in{opacity:1;transform:none;}
@media(prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;transition:none;}.hero-media{animation:none;}}

/* RESPONSIVE */
@media(max-width:1024px){
  .story-grid{grid-template-columns:1fr;gap:36px;}
  .combo-grid{grid-template-columns:1fr;gap:36px;}
  .closing-inner{grid-template-columns:1fr;gap:36px;}
  .treat-grid{grid-template-columns:1fr;}
}
@media(max-width:900px){


  .hero{min-height:88vh;}
  .hero-content{padding:110px 24px 60px;}
  .hero-badges{left:24px;right:24px;top:76px;}
  .hero h1{font-size:32px;}
  .hero-tagline{font-size:15px;}
  .hero-price .num{font-size:30px;}
  .section{padding:56px 24px;}
  .story-inner,.combo-inner,.closing-section{padding:56px 24px;}
  .section-title{font-size:26px;}
  .story-text h2,.combo-left h2,.combo-right h2{font-size:24px;}
  .closing-left h2{font-size:26px;}
  .book-bar-inner{padding:9px 16px;gap:10px;}
  .bb-info .bb-icon{display:none;}
  .bb-text .bb-meta{display:none;}
  .bb-text .bb-title{font-size:12px;line-height:1.25;max-width:96px;}
  .bb-wa{display:none;}
  .bb-btn{padding:11px 18px;font-size:12.5px;}
  .bb-price .bb-num{font-size:19px;}
  .bb-price .bb-from,.bb-price .bb-unit{display:none;}
}
@media(max-width:480px){
  .hero h1{font-size:28px;}
  .hero-cta-group{width:100%;}
  .hero-cta-group .btn-primary,.hero-cta-group .btn-ghost{width:100%;justify-content:center;}
  .price-compare{gap:18px;}
  .price-main .num{font-size:42px;}
  .bb-text .bb-title{font-size:11.5px;max-width:88px;}
}
</style>
