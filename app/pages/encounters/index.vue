<template>
  <main class="encounters-page">
    <section id="hero" class="hero" aria-label="Featured encounters"
      @mouseenter="stopSlider" @mouseleave="resumeAfterHover"
      @focusin="stopSlider" @focusout="resumeAfterFocus"
    >
      <div class="hero-slide" :class="{ active: activeSlide === 0 }" :inert="activeSlide !== 0">
        <img class="hero-slide-img" src="/images/encounters/wellness/great-wall.webp" alt="" fetchpriority="high">
        <div class="hero-slide-overlay"></div>
        <div class="hero-content">
          <div class="hero-eyebrow"><span class="dot"></span><span class="text">Bestseller · 3D2N in Beijing</span></div>
          <h1><template v-if="nameFor('beijing-china-ritual') === 'The China Ritual'">The China <span class="italic">Ritual</span></template><template v-else>{{ nameFor('beijing-china-ritual') }}</template></h1>
          <p class="hero-tagline">Dental cleaning, custom glasses, TCM pulse diagnosis, and dawn Tai Chi with a master —
            four encounters in one trip. The savings pay for your flight.</p>
          <div class="hero-tags">
            <span class="hero-tag coral">Dental $53</span>
            <span class="hero-tag gold">Glasses $28</span>
            <span class="hero-tag">TCM $90</span>
            <span class="hero-tag">Tai Chi $17</span>
            <span class="hero-tag">Half-day each</span>
          </div>
          <div class="hero-btns">
            <NuxtLink :to="pathFor('beijing-china-ritual')" class="btn-primary">Explore This Encounter →</NuxtLink>
            <a href="#beijing" class="btn-ghost">See All Beijing</a>
          </div>
        </div>
      </div>
      <div class="hero-slide" :class="{ active: activeSlide === 1 }" :inert="activeSlide !== 1">
        <img class="hero-slide-img" src="/images/encounters/wellness/museum-figurine-army.webp" alt="">
        <div class="hero-slide-overlay"></div>
        <div class="hero-content">
          <div class="hero-eyebrow"><span class="dot"></span><span class="text">Editor's Pick · 3D2N in Xi'an</span></div>
          <h1><template v-if="nameFor('xian-ancient-pharmacy') === 'The 2,000-Year-Old Pharmacy'">The 2,000-Year-Old <span class="italic">Pharmacy</span></template><template v-else>{{ nameFor('xian-ancient-pharmacy') }}</template></h1>
          <p class="hero-tagline">Walk into a herbal market older than your country. A doctor reads your pulse for 50
            seconds and knows more than your GP of 10 years. Then learn to pull your own noodles. Plus the Terracotta
            Warriors.</p>
          <div class="hero-tags">
            <span class="hero-tag gold">Herbal Market</span>
            <span class="hero-tag">50-sec Pulse Reading</span>
            <span class="hero-tag">Tang Tea Ritual</span>
            <span class="hero-tag coral">Terracotta Warriors</span>
          </div>
          <div class="hero-btns">
            <NuxtLink :to="pathFor('xian-ancient-pharmacy')" class="btn-primary">Explore This Encounter →</NuxtLink>
            <a href="#beijing" class="btn-ghost">See All Encounters</a>
          </div>
        </div>
      </div>
      <div class="hero-counter"><span class="current">{{ activeSlide === 0 ? '01' : '02' }}</span> / 02</div>
      <div class="hero-dots">
        <button type="button" class="hero-dot" :aria-label="'Show ' + nameFor('beijing-china-ritual')" :class="{ active: activeSlide === 0 }" :aria-pressed="activeSlide === 0" @click="activeSlide = 0"></button>
        <button type="button" class="hero-dot" :aria-label="'Show ' + nameFor('xian-ancient-pharmacy')" :class="{ active: activeSlide === 1 }" :aria-pressed="activeSlide === 1" @click="activeSlide = 1"></button>
      </div>
      <div class="scroll-hint">Scroll to explore</div>
    </section>

    <section class="data-bar">
      <div class="data-bar-inner">
        <div class="data-item">
          <div class="num">8,204<span class="data-unit">万</span></div>
          <div class="label">Foreign visitors to China in 2025</div>
          <div class="source">+26.4% YoY · National Immigration Admin</div>
        </div>
        <div class="data-item">
          <div class="num">128<span class="data-unit">万</span></div>
          <div class="label">International patients treated in 2025</div>
          <div class="source">+73.6% in 3 years · Nat'l Health Commission</div>
        </div>
        <div class="data-item">
          <div class="num">3,008<span class="data-unit">万</span></div>
          <div class="label">Visa-free entries in 2025</div>
          <div class="source">240-hour transit visa-free · 54 countries</div>
        </div>
        <div class="data-item">
          <div class="num">81%</div>
          <div class="label">Average savings vs Western pricing</div>
          <div class="source">Verified 2025 pricing across 6 categories</div>
        </div>
      </div>
    </section>

    <section class="diff-strip">
      <div class="diff-inner">
        <div class="diff-header">
          <div class="eyebrow">Why LVYV Is Different</div>
          <h2>Not medical tourism. Not just <span class="italic">sightseeing</span>.</h2>
          <p>We sit in the gap between hospitals (which treat you) and tour operators (which show you around). We embed
            2-hour encounters into your travel days — half of them heal you, half of them teach you. English guides,
            licensed clinics, real outcomes.</p>
        </div>
        <div class="diff-grid">
          <div class="diff-card trad">
            <div class="diff-card-label trad">Traditional Inbound Tourism</div>
            <h3>See the sights, eat the food, go home</h3>
            <p>Forbidden City → Great Wall → Peking Duck → souvenir shop. You leave with photos and memories, but nothing
              changed about your health or wellbeing — and you watched the culture through glass.</p>
          </div>
          <div class="diff-card lvyv">
            <div class="diff-card-label lvyv">LVYV Encounters</div>
            <h3>Travel that leaves you healthier — and less of a tourist</h3>
            <p>Same Great Wall and Peking Duck — but you also get a dental cleaning that costs 1/4 of London, a TCM doctor
              who reads your pulse in 50 seconds, 3 pairs of custom glasses made before dinner, and a dawn Tai Chi session
              with a 20-year master at the Temple of Heaven. You leave with photos, memories, <strong>a health baseline
                you can actually afford</strong>, and hands that know how to fold a dumpling.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="trust-band">
      <div class="trust-inner">
        <div class="trust-item">
          <div class="ico">🏥</div>
          <h4>Tier-3 Hospitals</h4>
          <p>International departments of China's top-ranked hospitals. Not back-street clinics.</p>
        </div>
        <div class="trust-item">
          <div class="ico">🗣</div>
          <h4>English Throughout</h4>
          <p>Bilingual guide accompanies you. Doctors and masters trained for international guests.</p>
        </div>
        <div class="trust-item">
          <div class="ico">👩‍🏫</div>
          <h4>Real Masters, Not Tourists</h4>
          <p>A 20-year Tai Chi master. A 40-year calligrapher. A grandmother who folds 40 dumplings an hour.</p>
        </div>
        <div class="trust-item">
          <div class="ico">📄</div>
          <h4>Same-Day Reports</h4>
          <p>Written diagnosis in English on your phone before you leave. Share with your doctor at home.</p>
        </div>
      </div>
    </section>

    <div v-if="catalogStatus === 'error'" class="catalog-error">
      <p role="alert">Current prices are temporarily unavailable.</p>
      <button type="button" @click="refreshCatalog()">Try again</button>
    </div>

    <section class="city-section" id="beijing">
      <div class="city-inner">
        <div class="city-header">
          <div class="city-header-left">
            <div class="eyebrow">Beijing · The Doctor Who Reads Your Wrist</div>
            <h2>The city where a checkup <span class="italic">costs less</span> than dinner</h2>
          </div>
          <div class="city-header-right">In London, a dental cleaning is $200. In Beijing, it's $53. Add glasses, a TCM
            session, or a dawn Tai Chi class with a master, and your savings pay for the flight. This is why TikTok calls
            it #来华三件套.</div>
        </div>

        <div class="route-grid">
          <NuxtLink id="beijing-ritual" class="route-card featured" :to="pathFor('beijing-china-ritual')">
            <img class="route-card-img" src="/images/encounters/wellness/great-wall.webp" alt="" loading="lazy">
            <div class="route-card-overlay"></div>
            <span class="route-card-badge signature">Signature</span>
            <span class="route-card-days">3D2N</span>
            <div class="route-card-content">
              <h3><template v-if="nameFor('beijing-china-ritual') === 'The China Ritual'">The China <span class="italic">Ritual</span></template><template v-else>{{ nameFor('beijing-china-ritual') }}</template></h3>
              <p class="desc">"I flew to China for a dentist, glasses, and a doctor — it cost less than my rent." Dental +
                eye exam + TCM pulse, all in one day. Plus Great Wall sunrise and dawn Tai Chi with a master. The savings
                pay for your flight.</p>
              <div class="route-card-tags">
                <span class="rc-tag">Dental $53</span>
                <span class="rc-tag">Glasses $28</span>
                <span class="rc-tag">TCM $90</span>
                <span class="rc-tag">Tai Chi $17</span>
                <span class="rc-tag">Great Wall sunrise</span>
              </div>
              <div class="route-card-footer">
                <div class="route-card-price"><template v-if="isAvailable('beijing-china-ritual')">from </template><span class="num">{{ priceFor('beijing-china-ritual') }}</span><template v-if="isAvailable('beijing-china-ritual')"> /person</template></div>
                <span class="route-card-cta">Explore →</span>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink class="route-card" :to="pathFor('beijing-wrist-tcm-day')">
            <img class="route-card-img" src="/images/encounters/wellness/detail/ritual-tcm-clinic.webp" alt="" loading="lazy">
            <div class="route-card-overlay"></div>
            <span class="route-card-badge new">New</span>
            <span class="route-card-days">1D</span>
            <div class="route-card-content">
              <h3><template v-if="nameFor('beijing-wrist-tcm-day') === 'The Doctor Who Reads Your Wrist'">The Doctor Who Reads Your <span class="italic">Wrist</span></template><template v-else>{{ nameFor('beijing-wrist-tcm-day') }}</template></h3>
              <p class="desc">"A doctor read my pulse for 50 seconds and knew more about me than my GP of 10 years." Full
                TCM immersion at a Tier-3 hospital. Pulse diagnosis, acupuncture, cupping. English report same-day.</p>
              <div class="route-card-tags">
                <span class="rc-tag">50-sec Pulse Reading</span>
                <span class="rc-tag">Acupuncture</span>
                <span class="rc-tag">English Report</span>
              </div>
              <div class="route-card-footer">
                <div class="route-card-price"><template v-if="isAvailable('beijing-wrist-tcm-day')">from </template><span class="num">{{ priceFor('beijing-wrist-tcm-day') }}</span></div>
                <span class="route-card-cta">Explore →</span>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink class="route-card" :to="pathFor('beijing-new-face-same-day')">
            <img class="route-card-img" src="/images/encounters/wellness/temple-of-heaven.webp" alt="" loading="lazy">
            <div class="route-card-overlay"></div>
            <span class="route-card-badge editors">Editor's Pick</span>
            <span class="route-card-days">1D</span>
            <div class="route-card-content">
              <h3><template v-if="nameFor('beijing-new-face-same-day') === 'New Face, Same Day'">New Face, <span class="italic">Same Day</span></template><template v-else>{{ nameFor('beijing-new-face-same-day') }}</template></h3>
              <p class="desc">"Got my teeth cleaned, eyes checked, and 3 pairs of glasses — in one afternoon." Dental
                cleaning + eye exam + custom glasses made before dinner. The $47 transformation.</p>
              <div class="route-card-tags">
                <span class="rc-tag">Dental Cleaning</span>
                <span class="rc-tag">3 Pairs Glasses</span>
                <span class="rc-tag">Same-Day Pickup</span>
              </div>
              <div class="route-card-footer">
                <div class="route-card-price"><template v-if="isAvailable('beijing-new-face-same-day')">from </template><span class="num">{{ priceFor('beijing-new-face-same-day') }}</span></div>
                <span class="route-card-cta">Explore →</span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <div class="solo-header">
          <span class="dot"></span>
          <h4>Solo Encounters in Beijing</h4>
          <span class="count">· Book individually or combine into a ritual</span>
        </div>
        <div class="upgrade-bar">
          <span class="upgrade-bar-icon">💡</span>
          <span class="upgrade-bar-text">Mix and match — pick any 3 medical + culture encounters and upgrade to
            <strong>{{ nameFor('beijing-china-ritual') }} 3D2N</strong>. Add 2 culture encounters (tea, Tai Chi, calligraphy, dumplings) and
            the package drops <strong>$84</strong> + 3D2N hotel, Great Wall sunrise & transfers included.</span>
          <NuxtLink :to="pathFor('beijing-china-ritual')" class="upgrade-bar-btn">Start Building →</NuxtLink>
        </div>
        <div class="cat-filter" aria-label="Beijing encounter categories" role="group">
          <button
            v-for="category in beijingCategories"
            :key="category.value"
            type="button"
            class="cat-btn"
            :class="{ active: beijingCategory === category.value }"
            :aria-pressed="beijingCategory === category.value"
            @click="beijingCategory = category.value"
          >{{ category.label }}</button>
        </div>
        <div class="solo-grid">
          <NuxtLink v-show="beijingCategory === 'all' || beijingCategory === 'medical'" class="solo-card" :to="pathFor('beijing-dental-cleaning')">
            <span class="solo-card-combo ritual">In Ritual</span>
            <div class="solo-card-cat medical">Light Medical</div>
            <h5>{{ nameFor('beijing-dental-cleaning') }}</h5>
            <p class="desc">Professional cleaning, X-ray, and consultation at a top Beijing dental clinic.
              English-speaking staff.</p>
            <p class="solo-card-hook">"$200 in London. $53 in Beijing. Same clean."</p>
            <div class="solo-card-compare"><span class="abroad">$200</span> UK → <span class="here">$53</span> <span
              class="save-tag">Save 73%</span></div>
            <div class="solo-card-footer">
              <div><span class="solo-card-price">{{ priceFor('beijing-dental-cleaning') }}</span> <span class="solo-card-time">· 2h</span></div>
              <span class="solo-card-book">Book</span>
            </div>
          </NuxtLink>
          <NuxtLink v-show="beijingCategory === 'all' || beijingCategory === 'medical'" class="solo-card" :to="pathFor('beijing-eye-exam-custom-glasses')">
            <span class="solo-card-combo ritual">In Ritual</span>
            <div class="solo-card-cat medical">Light Medical</div>
            <h5>{{ nameFor('beijing-eye-exam-custom-glasses') }}</h5>
            <p class="desc">Full optometry exam, lens fitting, frame selection. Glasses ready same-day by afternoon.</p>
            <p class="solo-card-hook">"Bought 3 pairs for less than 1 at home"</p>
            <div class="solo-card-compare"><span class="abroad">$300+</span> US → <span class="here">$28</span> <span
              class="save-tag">Save 90%</span></div>
            <div class="solo-card-footer">
              <div><span class="solo-card-price">{{ priceFor('beijing-eye-exam-custom-glasses') }}</span> <span class="solo-card-time">· Half day</span></div>
              <span class="solo-card-book">Book</span>
            </div>
          </NuxtLink>
          <NuxtLink v-show="beijingCategory === 'all' || beijingCategory === 'tcm'" class="solo-card" :to="pathFor('beijing-tcm-pulse-acupuncture')">
            <span class="solo-card-combo ritual">In Ritual</span>
            <div class="solo-card-cat tcm">TCM</div>
            <h5>{{ nameFor('beijing-tcm-pulse-acupuncture') }}</h5>
            <p class="desc">Pulse diagnosis, acupuncture, cupping & moxibustion at a Tier-3 hospital. English translator
              throughout.</p>
            <p class="solo-card-hook">"50 seconds of silence. Then she knew everything."</p>
            <div class="solo-card-compare"><span class="abroad">$470</span> US → <span class="here">$90</span> <span
              class="save-tag">Save 81%</span></div>
            <div class="solo-card-footer">
              <div><span class="solo-card-price">{{ priceFor('beijing-tcm-pulse-acupuncture') }}</span> <span class="solo-card-time">· 2h</span></div>
              <span class="solo-card-book">Book</span>
            </div>
          </NuxtLink>
          <NuxtLink v-show="beijingCategory === 'all' || beijingCategory === 'medical'" class="solo-card" :to="pathFor('beijing-basic-health-checkup')">
            <div class="solo-card-cat medical">Light Medical</div>
            <h5>{{ nameFor('beijing-basic-health-checkup') }}</h5>
            <p class="desc">Blood panel, liver/kidney function, blood sugar, ECG, ultrasound. Tier-3 hospital
              international dept.</p>
            <p class="solo-card-hook">Four packages, from general screening to an overnight checkup.</p>
            <div class="solo-card-footer">
              <div><span class="solo-card-price">{{ isAvailable('beijing-basic-health-checkup') ? 'From ' : '' }}{{ priceFor('beijing-basic-health-checkup') }}</span></div>
              <span class="solo-card-book">Book</span>
            </div>
          </NuxtLink>
          <NuxtLink v-show="beijingCategory === 'all' || beijingCategory === 'culture'" class="solo-card" :to="pathFor('beijing-gongfu-tea-ceremony')">
            <span class="solo-card-combo ritual">In Ritual</span>
            <div class="solo-card-cat culture">Culture</div>
            <h5>{{ nameFor('beijing-gongfu-tea-ceremony') }}</h5>
            <p class="desc">Learn the 12-step Gongfu tea ritual from a master. Brew 5 single-origin teas. Take home a tea
              pet.</p>
            <p class="solo-card-hook">"12 steps for one cup. I'll never look at a teabag the same way."</p>
            <div class="solo-card-compare"><span class="abroad">$85</span> London tea house → <span
              class="here">$25</span> <span class="save-tag">Save 69%</span></div>
            <div class="solo-card-footer">
              <div><span class="solo-card-price">{{ priceFor('beijing-gongfu-tea-ceremony') }}</span> <span class="solo-card-time">· 1.5h</span></div>
              <span class="solo-card-book">Book</span>
            </div>
          </NuxtLink>
          <NuxtLink v-show="beijingCategory === 'all' || beijingCategory === 'food'" class="solo-card" :to="pathFor('beijing-dumpling-master-class')">
            <div class="solo-card-cat food">Food</div>
            <h5>{{ nameFor('beijing-dumpling-master-class') }}</h5>
            <p class="desc">Make jiaozi from scratch with a Beijing hutong grandmother. 6 folding techniques, 3 fillings,
              eat what you make.</p>
            <p class="solo-card-hook">"My Chinese grandma for 3 hours. I made 40 dumplings."</p>
            <div class="solo-card-compare"><span class="abroad">$120</span> cooking school → <span class="here">$21</span>{{ ' ' }}
              <span class="save-tag">Save 82%</span>
              </div>
            <div class="solo-card-footer">
              <div><span class="solo-card-price">{{ priceFor('beijing-dumpling-master-class') }}</span> <span class="solo-card-time">· 2h</span></div>
              <span class="solo-card-book">Book</span>
            </div>
          </NuxtLink>
          <NuxtLink v-show="beijingCategory === 'all' || beijingCategory === 'culture'" class="solo-card" :to="pathFor('beijing-temple-of-heaven-tai-chi')">
            <span class="solo-card-combo ritual">In Ritual</span>
            <div class="solo-card-cat culture">Culture</div>
            <h5>{{ nameFor('beijing-temple-of-heaven-tai-chi') }}</h5>
            <p class="desc">Sunrise Tai Chi session with a 20-year master at the Temple of Heaven. Learn the 8-form. Tea
              and chat after.</p>
            <p class="solo-card-hook">"60-year-olds moving like water. I was the stiffest person in the park."</p>
            <div class="solo-card-compare"><span class="abroad">$90</span> studio class → <span class="here">$17</span>{{ ' ' }}
              <span class="save-tag">Save 80%</span>
              </div>
            <div class="solo-card-footer">
              <div><span class="solo-card-price">{{ priceFor('beijing-temple-of-heaven-tai-chi') }}</span> <span class="solo-card-time">· 1.5h · sunrise</span></div>
              <span class="solo-card-book">Book</span>
            </div>
          </NuxtLink>
          <NuxtLink v-show="beijingCategory === 'all' || beijingCategory === 'craft'" class="solo-card" :to="pathFor('beijing-calligraphy-ink-brush')">
            <div class="solo-card-cat craft">Craft</div>
            <h5>{{ nameFor('beijing-calligraphy-ink-brush') }}</h5>
            <p class="desc">Learn brush techniques from a master calligrapher. Write your name in seal script. Take home
              your work mounted.</p>
            <p class="solo-card-hook">"My handwriting looked like a 5-year-old's. The master said that's the point."</p>
            <div class="solo-card-compare"><span class="abroad">$70</span> art class → <span class="here">$22</span> <span
              class="save-tag">Save 68%</span></div>
            <div class="solo-card-footer">
              <div><span class="solo-card-price">{{ priceFor('beijing-calligraphy-ink-brush') }}</span> <span class="solo-card-time">· 2h</span></div>
              <span class="solo-card-book">Book</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="city-section alt-bg" id="xian">
      <div class="city-inner">
        <div class="city-header">
          <div class="city-header-left">
            <div class="eyebrow">Xi'an · The 2,000-Year-Old Pharmacy</div>
            <h2>Where the world's first <span class="italic">pharmacy</span> still works</h2>
          </div>
          <div class="city-header-right">Xi'an is where China compiled its first medical texts 2,000 years ago. The herbal
            markets are still open. The moxibustion still burns. And a doctor can read your pulse for 50 seconds and tell
            you things your GP never could — before you learn to pull your own belt-wide noodles.</div>
        </div>

        <div class="route-grid">
          <NuxtLink class="route-card featured" :to="pathFor('xian-ancient-pharmacy')">
            <img class="route-card-img" src="/images/encounters/wellness/terracotta-warriors.webp" alt="" loading="lazy">
            <div class="route-card-overlay"></div>
            <span class="route-card-badge signature">Signature</span>
            <span class="route-card-days">3D2N</span>
            <div class="route-card-content">
              <h3><template v-if="nameFor('xian-ancient-pharmacy') === 'The 2,000-Year-Old Pharmacy'">The 2,000-Year-Old <span class="italic">Pharmacy</span></template><template v-else>{{ nameFor('xian-ancient-pharmacy') }}</template></h3>
              <p class="desc">"I walked into a pharmacy older than my country. Left with a prescription that worked."
                Herbal market, moxibustion, a Tang-dynasty tea ritual, and a pulse reading from a TCM doctor. Plus
                Terracotta Warriors and city wall sunset.</p>
              <div class="route-card-tags">
                <span class="rc-tag">Herbal Market</span>
                <span class="rc-tag">Moxibustion</span>
                <span class="rc-tag">Pulse Reading</span>
                <span class="rc-tag">Tang Tea $21</span>
                <span class="rc-tag">Terracotta</span>
              </div>
              <div class="route-card-footer">
                <div class="route-card-price"><template v-if="isAvailable('xian-ancient-pharmacy')">from </template><span class="num">{{ priceFor('xian-ancient-pharmacy') }}</span><template v-if="isAvailable('xian-ancient-pharmacy')"> /person</template></div>
                <span class="route-card-cta">Explore →</span>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink class="route-card" :to="pathFor('xian-wrist-pharmacy-day')">
            <img class="route-card-img" src="/images/encounters/wellness/museum-terracotta.webp" alt="" loading="lazy">
            <div class="route-card-overlay"></div>
            <span class="route-card-badge new">New</span>
            <span class="route-card-days">1D</span>
            <div class="route-card-content">
              <h3><template v-if="nameFor('xian-wrist-pharmacy-day') === 'The Doctor Who Reads Your Wrist'">The Doctor Who Reads Your <span class="italic">Wrist</span></template><template v-else>{{ nameFor('xian-wrist-pharmacy-day') }}</template></h3>
              <p class="desc">"50 seconds of silence. Three fingers on my wrist. Then she described symptoms I hadn't told
                anyone." Visit a traditional pharmacy, watch herbs compounded, get your own prescription.</p>
              <div class="route-card-tags">
                <span class="rc-tag">50-sec Pulse</span>
                <span class="rc-tag">Herbal Compounding</span>
                <span class="rc-tag">Take Home Rx</span>
              </div>
              <div class="route-card-footer">
                <div class="route-card-price"><template v-if="isAvailable('xian-wrist-pharmacy-day')">from </template><span class="num">{{ priceFor('xian-wrist-pharmacy-day') }}</span></div>
                <span class="route-card-cta">Explore →</span>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink class="route-card" :to="pathFor('xian-silk-road-fix')">
            <img class="route-card-img" src="/images/encounters/wellness/big-wild-goose-pagoda.webp" alt="" loading="lazy">
            <div class="route-card-overlay"></div>
            <span class="route-card-badge editors">Editor's Pick</span>
            <span class="route-card-days">1D</span>
            <div class="route-card-content">
              <h3><template v-if="nameFor('xian-silk-road-fix') === 'The Silk Road Fix'">The Silk Road <span class="italic">Fix</span></template><template v-else>{{ nameFor('xian-silk-road-fix') }}</template></h3>
              <p class="desc">"Walked 30km in 3 days. One TCM session fixed everything." Acupuncture, cupping, tuina, and
                herbal bath — the exact recovery routine Silk Road traders used 1,000 years ago.</p>
              <div class="route-card-tags">
                <span class="rc-tag">Acupuncture</span>
                <span class="rc-tag">Fire Cupping</span>
                <span class="rc-tag">Tuina</span>
                <span class="rc-tag">Herbal Bath</span>
              </div>
              <div class="route-card-footer">
                <div class="route-card-price"><template v-if="isAvailable('xian-silk-road-fix')">from </template><span class="num">{{ priceFor('xian-silk-road-fix') }}</span></div>
                <span class="route-card-cta">Explore →</span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <div class="solo-header">
          <span class="dot"></span>
          <h4>Solo Encounters in Xi'an</h4>
          <span class="count">· Book individually or combine into an apothecary journey</span>
          <span class="solo-tip">$17 — $81 per experience</span>
        </div>
        <div class="upgrade-bar">
          <span class="upgrade-bar-icon">💡</span>
          <span class="upgrade-bar-text">Mix and match — pick any 3 TCM + culture encounters and upgrade to
            <strong>{{ nameFor('xian-ancient-pharmacy') }} 3D2N</strong>. Pair 2 culture encounters (Tang tea, Biang Biang noodles, clay craft,
            Hanfu) and save <strong>$56</strong> + free hotel, Terracotta tour & city wall bike.</span>
          <NuxtLink :to="pathFor('xian-ancient-pharmacy')" class="upgrade-bar-btn">Start Building →</NuxtLink>
        </div>
        <div class="cat-filter" aria-label="Xi'an encounter categories" role="group">
          <button
            v-for="category in xianCategories"
            :key="category.value"
            type="button"
            class="cat-btn"
            :class="{ active: xianCategory === category.value }"
            :aria-pressed="xianCategory === category.value"
            @click="xianCategory = category.value"
          >{{ category.label }}</button>
        </div>
        <div class="solo-grid">
          <NuxtLink v-show="xianCategory === 'all' || xianCategory === 'tcm'" class="solo-card" :to="pathFor('xian-tcm-pulse-acupuncture')">
            <span class="solo-card-combo apothecary">In Apothecary</span>
            <div class="solo-card-cat tcm">TCM</div>
            <h5>{{ nameFor('xian-tcm-pulse-acupuncture') }}</h5>
            <p class="desc">Full TCM consultation, pulse diagnosis, and acupuncture at a traditional Xi'an medicine
              hospital.</p>
            <p class="solo-card-hook">"She read my wrist and described symptoms I hid from everyone"</p>
            <div class="solo-card-compare"><span class="abroad">$470</span> US → <span class="here">$81</span> <span
              class="save-tag">Save 81%</span></div>
            <div class="solo-card-footer">
              <div><span class="solo-card-price">{{ priceFor('xian-tcm-pulse-acupuncture') }}</span> <span class="solo-card-time">· 2h</span></div>
              <span class="solo-card-book">Book</span>
            </div>
          </NuxtLink>
          <NuxtLink v-show="xianCategory === 'all' || xianCategory === 'herbal'" class="solo-card" :to="pathFor('xian-herbal-market-walk')">
            <span class="solo-card-combo apothecary">In Apothecary</span>
            <div class="solo-card-cat herbal">Herbal</div>
            <h5>{{ nameFor('xian-herbal-market-walk') }}</h5>
            <p class="desc">Guided walk through Xi'an's traditional medicine market. See, smell, and learn about 50+
              medicinal herbs.</p>
            <p class="solo-card-hook">"It's like Diagon Alley. But it's been real for 2,000 years."</p>
            <div class="solo-card-compare"><span class="abroad">N/A</span> → <span class="here">$25</span></div>
            <div class="solo-card-footer">
              <div><span class="solo-card-price">{{ priceFor('xian-herbal-market-walk') }}</span> <span class="solo-card-time">· 2h</span></div>
              <span class="solo-card-book">Book</span>
            </div>
          </NuxtLink>
          <NuxtLink v-show="xianCategory === 'all' || xianCategory === 'tcm'" class="solo-card" :to="pathFor('xian-direct-moxibustion')">
            <div class="solo-card-cat tcm">TCM</div>
            <h5>{{ nameFor('xian-direct-moxibustion') }}</h5>
            <p class="desc">Traditional Xi'an-style moxibustion with ginger slices. For chronic pain and cold conditions.
            </p>
            <p class="solo-card-hook">"Burning mugwort on ginger. Sounds crazy. Works."</p>
            <div class="solo-card-compare"><span class="abroad">$95</span> US → <span class="here">$28</span> <span
              class="save-tag">Save 68%</span></div>
            <div class="solo-card-footer">
              <div><span class="solo-card-price">{{ priceFor('xian-direct-moxibustion') }}</span> <span class="solo-card-time">· 1h</span></div>
              <span class="solo-card-book">Book</span>
            </div>
          </NuxtLink>
          <NuxtLink v-show="xianCategory === 'all' || xianCategory === 'herbal'" class="solo-card" :to="pathFor('xian-herbal-foot-soak-massage')">
            <div class="solo-card-cat herbal">Herbal</div>
            <h5>{{ nameFor('xian-herbal-foot-soak-massage') }}</h5>
            <p class="desc">Foot soak in 10 medicinal herbs, followed by reflexology massage. Ancient Silk Road traveler's
              remedy.</p>
            <p class="solo-card-hook">"Silk Road traders did this 1,000 years ago. Still works."</p>
            <div class="solo-card-compare"><span class="abroad">$80</span> US → <span class="here">$17</span> <span
              class="save-tag">Save 78%</span></div>
            <div class="solo-card-footer">
              <div><span class="solo-card-price">{{ priceFor('xian-herbal-foot-soak-massage') }}</span> <span class="solo-card-time">· 1.5h</span></div>
              <span class="solo-card-book">Book</span>
            </div>
          </NuxtLink>
          <NuxtLink v-show="xianCategory === 'all' || xianCategory === 'food'" class="solo-card" :to="pathFor('xian-biang-biang-noodles')">
            <span class="solo-card-combo apothecary">In Apothecary</span>
            <div class="solo-card-cat food">Food</div>
            <h5>{{ nameFor('xian-biang-biang-noodles') }}</h5>
            <p class="desc">Learn the art of Xi'an's famous belt-wide noodles. Hand-pull, slap, and cook. Eat with chili
              oil. The character for "biang" has 58 strokes.</p>
            <p class="solo-card-hook">"58 strokes for one character. 1 slap for the best noodle I've ever had."</p>
            <div class="solo-card-compare"><span class="abroad">$110</span> cooking class → <span class="here">$17</span>{{ ' ' }}
              <span class="save-tag">Save 84%</span>
              </div>
            <div class="solo-card-footer">
              <div><span class="solo-card-price">{{ priceFor('xian-biang-biang-noodles') }}</span> <span class="solo-card-time">· 1.5h</span></div>
              <span class="solo-card-book">Book</span>
            </div>
          </NuxtLink>
          <NuxtLink v-show="xianCategory === 'all' || xianCategory === 'culture'" class="solo-card" :to="pathFor('xian-tang-dynasty-tea-ritual')">
            <span class="solo-card-combo apothecary">In Apothecary</span>
            <div class="solo-card-cat culture">Culture</div>
            <h5>{{ nameFor('xian-tang-dynasty-tea-ritual') }}</h5>
            <p class="desc">Experience tea the way Xi'an's Tang court did 1,300 years ago — ground, whisked, salted. A
              ritual older than Japan's matcha by 400 years.</p>
            <p class="solo-card-hook">"Japan learned matcha from here. This is the original."</p>
            <div class="solo-card-compare"><span class="abroad">$75</span> tea house → <span class="here">$21</span> <span
              class="save-tag">Save 72%</span></div>
            <div class="solo-card-footer">
              <div><span class="solo-card-price">{{ priceFor('xian-tang-dynasty-tea-ritual') }}</span> <span class="solo-card-time">· 1.5h</span></div>
              <span class="solo-card-book">Book</span>
            </div>
          </NuxtLink>
          <NuxtLink v-show="xianCategory === 'all' || xianCategory === 'craft'" class="solo-card" :to="pathFor('xian-terracotta-clay-craft')">
            <div class="solo-card-cat craft">Craft</div>
            <h5>{{ nameFor('xian-terracotta-clay-craft') }}</h5>
            <p class="desc">Sculpt your own mini warrior using the same clay and techniques as the original artisans 2,200
              years ago. Take it home.</p>
            <p class="solo-card-hook">"Built an army of 8,000. I built 1. Still proud."</p>
            <div class="solo-card-compare"><span class="abroad">$60</span> pottery studio → <span class="here">$39</span>
              </div>
            <div class="solo-card-footer">
              <div><span class="solo-card-price">{{ priceFor('xian-terracotta-clay-craft') }}</span> <span class="solo-card-time">· 2h</span></div>
              <span class="solo-card-book">Book</span>
            </div>
          </NuxtLink>
          <NuxtLink v-show="xianCategory === 'all' || xianCategory === 'culture'" class="solo-card" :to="pathFor('xian-hanfu-city-wall-walk')">
            <div class="solo-card-cat culture">Culture</div>
            <h5>{{ nameFor('xian-hanfu-city-wall-walk') }}</h5>
            <p class="desc">Wear traditional Hanfu, walk Xi'an's 600-year-old Ming city wall at sunset. Includes
              professional photoshoot with 5 edited shots.</p>
            <p class="solo-card-hook">"Walked a 600-year-old wall in a 2,000-year-old outfit. Felt like time travel."</p>
            <div class="solo-card-compare"><span class="abroad">$150</span> photo studio → <span class="here">$45</span>{{ ' ' }}
              <span class="save-tag">Save 70%</span>
              </div>
            <div class="solo-card-footer">
              <div><span class="solo-card-price">{{ priceFor('xian-hanfu-city-wall-walk') }}</span> <span class="solo-card-time">· 2h · sunset</span></div>
              <span class="solo-card-book">Book</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="wish-cta" id="wish">
      <div class="wish-cta-inner">
        <div class="eyebrow">Can't find your encounter?</div>
        <h2>Make a <span class="italic">Wish</span></h2>
        <p>Tell us what you need — a specific treatment, a city we don't cover yet, or a custom wellness journey. We'll
          design your encounter by hand within 24 hours.</p>
        <div class="wish-steps">
          <div class="wish-step">
            <div class="wish-step-num">1</div>
            <div class="wish-step-label">Tell us what you need</div>
          </div>
          <div class="wish-step-arrow">→</div>
          <div class="wish-step">
            <div class="wish-step-num">2</div>
            <div class="wish-step-label">We design in 24 hours</div>
          </div>
          <div class="wish-step-arrow">→</div>
          <div class="wish-step">
            <div class="wish-step-num">3</div>
            <div class="wish-step-label">You arrive & heal</div>
          </div>
        </div>
        <NuxtLink to="/wish/create" class="btn-primary wish-button">Make a Wish →</NuxtLink>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { encounterProductPath, encounterProducts } from '~~/shared/utils/encounterProducts'

const commerce = useCommerce()
const { data: catalog, status: catalogStatus, refresh: refreshCatalog } = useAsyncData(
  'encounters-catalog',
  commerce.products,
  { server: false },
)
const bySlug = new Map(encounterProducts.map(product => [product.slug, product]))
const catalogByCode = computed(() => new Map((catalog.value ?? []).map(product => [product.productCode, product])))
function pathFor(slug: string) {
  return encounterProductPath(bySlug.get(slug)!)
}
function listingFor(slug: string) {
  const product = bySlug.get(slug)
  return product?.ready ? catalogByCode.value.get(product.code) : undefined
}
const isAvailable = (slug: string) => listingFor(slug)?.lowestPrice != null
const nameFor = (slug: string) => listingFor(slug)?.name || bySlug.get(slug)?.title
function priceFor(slug: string) {
  if (!bySlug.get(slug)?.ready) return 'Currently unavailable'
  const price = listingFor(slug)?.lowestPrice
  if (price != null) return encounterPrice(price)
  if (catalogStatus.value === 'idle' || catalogStatus.value === 'pending') return 'Checking price…'
  return catalogStatus.value === 'error' ? 'Price unavailable' : 'Currently unavailable'
}

const title = 'Encounters · LVYV — Travel That Heals'
const description = 'Lightweight medical travel in China. Dental, TCM, health checkups — plus tea ceremonies, Tai Chi, calligraphy and cooking classes — embedded into your trip. English-speaking guides, licensed hospitals, same-day reports.'
useLvyvSeo({
  title,
  description,
  path: '/encounters',
  image: '/images/encounters/wellness/great-wall.webp',
  imageAlt: 'The Great Wall of China',
  jsonLd: [webPageJsonLd(title, description, '/encounters')]
})

const activeSlide = ref(0)
let slideInterval: ReturnType<typeof setInterval> | undefined

function stopSlider() {
  clearInterval(slideInterval)
  slideInterval = undefined
}

function startSlider() {
  if (slideInterval !== undefined || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  slideInterval = setInterval(() => {
    activeSlide.value = 1 - activeSlide.value
  }, 6000)
}

function resumeAfterHover(event: MouseEvent) {
  const hero = event.currentTarget as HTMLElement
  if (!hero.contains(document.activeElement)) startSlider()
}

function resumeAfterFocus(event: FocusEvent) {
  const hero = event.currentTarget as HTMLElement
  if (!hero.contains(event.relatedTarget as Node | null) && !hero.matches(':hover')) startSlider()
}

onMounted(startSlider)
onBeforeUnmount(stopSlider)

const allCategory = { value: 'all', label: 'All' }
const sharedCategories = [
  { value: 'culture', label: 'Culture' },
  { value: 'food', label: 'Food' },
  { value: 'craft', label: 'Craft' }
]
const tcmCategory = { value: 'tcm', label: 'TCM' }
const beijingCategories = [allCategory, { value: 'medical', label: 'Light Medical' }, tcmCategory, ...sharedCategories]
const xianCategories = [allCategory, tcmCategory, { value: 'herbal', label: 'Herbal' }, ...sharedCategories]
const beijingCategory = ref('all')
const xianCategory = ref('all')
</script>

<style scoped src="~/assets/css/encounters.css"></style>
