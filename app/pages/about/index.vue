<template>
  <main class="about-page">
    <section class="about-hero" aria-labelledby="about-hero-title">
      <div class="about-hero__shade" />
      <div class="about-hero__content">
        <h1 id="about-hero-title">We don't sell tours.<br>We create encounters.</h1>
        <p>A letter, from us, on what we believe.</p>
      </div>
      <span class="about-hero__scroll" aria-hidden="true"><i /></span>
    </section>

    <section class="letter-section">
      <div class="letter">
        <p class="letter__eyebrow">
          <span>A letter from LVYV</span>
          <span class="letter__preview">
            <button class="letter__preview-trigger" type="button" aria-label="Preview the original handwritten LVYV letter">
              <img src="/images/about/about-letter-preview-icon.svg" alt="" width="24" height="24" aria-hidden="true">
            </button>
            <span class="letter__preview-card" role="tooltip">
              <img
                src="/images/about/about-letter-handwritten.webp"
                alt="The original handwritten letter from LVYV"
                width="960"
                height="1200"
                loading="lazy"
              >
            </span>
          </span>
        </p>

        <div class="letter__copy">
          <p>We are LVYV. And this is what we believe.</p>
          <p>The best travel moments don't come with a ticket. They come when you least expect them.</p>
          <p>Sitting on a 600-year-old city wall at sunset. A stranger sits down next to you with a kite. You don't share a language — not really. But you sit there together for an hour, watching the sky shift from gold to dark. When the city lights flicker on, he nudges you and says something you barely understand, but you know exactly what he means.</p>
          <p>Beautiful, right?</p>
          <p>You'll never learn his name. You'll never see him again. But that hour will stay with you longer than any temple, any museum, any perfectly framed photograph.</p>
          <p>Because travel isn't about places. It's about people. It's about the encounters that happen when you stop trying to see everything and just let yourself be there, open, waiting for someone to show up.</p>
          <p>This is what the travel industry forgot.</p>
          <p>Somewhere along the way, travel became a product. Packaged. Optimized. AI-generated. Travelers turned into cargo, shuttled from landmark to landmark. The human part — the best part — was stripped away.</p>
          <p>We started LVYV to bring it back.</p>
          <p>We don't sell tours. We don't use AI. Every journey we design is handcrafted by a real person who knows this country intimately — the noodle shop that's been open since 1982, the teahouse hidden behind an unmarked door, the park where kite-flyers gather at golden hour.</p>
          <p>We are a China company, through and through. Every designer, every support person behind your journey lives here, works here, and loves here. When you travel with us, you're connecting directly with people who call this country home.</p>
          <p>We believe travel should be an encounter — with a culture, with a place, and most importantly, with someone. We believe you shouldn't just see China. You should meet it.</p>
          <p>Go, meet someone.</p>
        </div>

        <div class="letter__signature">
          <img src="/images/about/about-signature.png" alt="LVYV" width="183" height="55">
          <strong>The LVYV Team</strong>
        </div>
      </div>
    </section>

    <section class="beliefs-section" aria-labelledby="beliefs-title">
      <div class="section-shell">
        <h2 id="beliefs-title" class="section-title">What we believe</h2>
        <div class="belief-grid">
          <article v-for="belief in beliefs" :key="belief.title" class="belief-card">
            <span class="belief-card__emoji" aria-hidden="true">{{ belief.emoji }}</span>
            <h3>{{ belief.title }}</h3>
            <p>{{ belief.copy }}</p>
            <img :src="belief.image" :alt="belief.alt" width="350" height="350" loading="lazy">
          </article>
        </div>
      </div>
    </section>

    <section class="promise-section" aria-labelledby="promise-title">
      <div class="promise-shell">
        <h2 id="promise-title" class="section-title">Our promise to you</h2>
        <ol class="promise-list">
          <li v-for="(promise, index) in promises" :key="promise.title" class="promise-item">
            <span class="promise-item__number">{{ index + 1 }}</span>
            <div class="promise-item__heading">
              <img :src="promise.image" alt="" loading="lazy" aria-hidden="true">
              <h3>{{ promise.title }}</h3>
            </div>
            <p>{{ promise.copy }}</p>
          </li>
        </ol>
      </div>
    </section>

    <section class="future-section" aria-labelledby="future-title">
      <div class="future-shell">
        <h2 id="future-title" class="section-title">Where we're going</h2>
        <div class="future-copy">
          <p>We started with Xi'an and Chengdu — two cities that capture the soul of China in different flavors. But this is just the beginning.</p>
          <p>Over the coming years, we'll expand to 20+ cities across China. From the misty water towns of Jiangnan to the snowy highlands of Tibet. From neon-lit Shanghai to the silent deserts of the Silk Road.</p>
          <p>We're building Travel Match — so solo wanderers can find each other on the road. We're designing deeper City Missions that turn every neighborhood into a living game map. We're growing a network of Local Hosts — students, artists, chefs, storytellers — who will open their worlds to you.</p>
          <p>Our dream is simple: when a young person anywhere in the world thinks, “I want to experience the real China” — the first word that comes to mind is LVYV.</p>
          <p>We're on our way. And we'd love for you to be part of it.</p>
        </div>
        <NuxtLink to="/wish" class="future-cta">Start Your Encounter</NuxtLink>
      </div>
    </section>

  </main>
</template>

<script setup lang="ts">
const beliefs = [
  {
    emoji: '👋',
    title: 'Humans, not algorithms',
    copy: 'Every itinerary is handcrafted by a real person who knows China intimately. No AI. No templates. Just human care.',
    image: '/images/about/belief-human.webp',
    alt: 'Human written, no AI content'
  },
  {
    emoji: '🤝',
    title: 'Encounters, not sights',
    copy: "We don't care how many landmarks you tick off. We care who you meet along the way. Travel is about people.",
    image: '/images/about/belief-friends.webp',
    alt: 'Travel friends, new connections'
  },
  {
    emoji: '🌏',
    title: 'Real China, real stories',
    copy: 'We are a China-based team. We live here, we eat here, we get lost here. We share the China we know and love.',
    image: '/images/about/belief-china.webp',
    alt: 'Based in China, local team'
  }
]

const promises = [
  {
    image: '/images/about/promise-human-designed.webp',
    title: '100% Human-designed',
    copy: 'Your itinerary is handmade by a real designer, not generated by AI or filled with templates.'
  },
  {
    image: '/images/about/promise-concierge.webp',
    title: 'Private concierge experience',
    copy: 'From making a wish to departure, you have a dedicated designer to accompany you throughout the entire process. Like a personal butler, but understands China better.'
  },
  {
    image: '/images/about/promise-deep.webp',
    title: 'Deep, not shallow',
    copy: "We won't take you to clock in. We'll take you to the old tea house at the foot of the city wall, the smoking roadside stall in the early morning, and the alley that even locals almost forgot about."
  },
  {
    image: '/images/about/promise-china-team.webp',
    title: '100% China-based team',
    copy: 'We are a team rooted in China. Designers, customer service, operations — everyone is in China and truly understands China.'
  },
  {
    image: '/images/about/promise-human-support.webp',
    title: '24/7 real human support',
    copy: 'Emergency? Find real people anytime. Not chatbots, they are flesh and blood people.'
  }
]

const aboutTitle = "About LVYV — We create encounters"
const aboutDescription = 'LVYV creates human-designed encounters that help travelers meet the real China through its people, culture, and stories.'

useLvyvSeo({
  title: aboutTitle,
  description: aboutDescription,
  path: '/about',
  jsonLd: [
    webPageJsonLd(aboutTitle, aboutDescription, '/about'),
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' }
    ])
  ]
})
</script>

<style scoped>
.about-page {
  --about-green: #0f5948;
  --about-ink: #111714;
  --about-muted: #f7f7f5;
  width: 100%;
  padding-top: 80px;
  overflow: hidden;
  background: #fff;
  color: var(--about-ink);
  font-family: var(--font-body, 'Inter', sans-serif);
}

.about-hero {
  position: relative;
  display: grid;
  min-height: 605px;
  place-items: center;
  background: url('/images/about/about-hero.webp') center 44% / cover no-repeat;
  color: #fff;
  text-align: center;
}

.about-hero__shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(29, 29, 29, .34), rgba(29, 29, 29, .34));
}

.about-hero__content {
  position: relative;
  z-index: 1;
  padding: 36px 24px 72px;
}

.about-hero h1 {
  max-width: 900px;
  margin: 0;
  color: #fff;
  font: 500 clamp(46px, 4.45vw, 64px)/1.08 var(--font-heading, Georgia, serif);
  letter-spacing: -.025em;
  text-shadow: 0 2px 16px rgba(0, 0, 0, .16);
}

.about-hero p {
  margin: 21px 0 0;
  color: rgba(255, 255, 255, .94);
  font-size: 18px;
  line-height: 1.5;
}

.about-hero__scroll {
  position: absolute;
  z-index: 1;
  bottom: 36px;
  left: 50%;
  width: 23px;
  height: 36px;
  border: 1.5px solid rgba(255, 255, 255, .9);
  border-radius: 14px;
  transform: translateX(-50%);
}

.about-hero__scroll i {
  position: absolute;
  top: 7px;
  left: 50%;
  width: 3px;
  height: 7px;
  border-radius: 4px;
  background: #fff;
  transform: translateX(-50%);
}

.letter-section {
  padding: 101px 24px 120px;
  background: #fff;
}

.letter {
  width: min(791px, 100%);
  margin: 0 auto;
}

.letter__eyebrow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin: 0 0 43px;
  color: var(--about-green);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .16em;
  text-transform: uppercase;
}

.letter__preview {
  position: relative;
  display: inline-flex;
  margin-left: 2px;
  letter-spacing: normal;
  text-transform: none;
}

.letter__preview-trigger {
  display: grid;
  width: 24px;
  height: 24px;
  padding: 0;
  place-items: center;
  border: 0;
  background: transparent;
  color: var(--about-green);
  cursor: pointer;
}

.letter__preview-trigger:focus-visible {
  outline: 2px solid var(--about-green);
  outline-offset: 3px;
}

.letter__preview-trigger > img {
  display: block;
  width: 24px;
  height: 24px;
}

.letter__preview-card {
  position: fixed;
  z-index: 1400;
  top: 50%;
  left: 50%;
  display: block;
  width: min(720px, calc((100vh - 64px) * .8), calc(100vw - 48px));
  padding: 8px;
  border: 1px solid rgba(25, 31, 28, .22);
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 18px 45px rgba(16, 25, 21, .24);
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, -50%) scale(.975);
  transform-origin: center;
  transition: opacity .18s ease, transform .18s ease, visibility .18s;
  visibility: hidden;
}

.letter__preview-card img {
  display: block;
  width: 100%;
  height: auto;
}

.letter__preview:hover .letter__preview-card,
.letter__preview:focus-within .letter__preview-card {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
  visibility: visible;
}

.letter__copy {
  color: #1e211f;
  text-align: center;
}

.letter__copy p {
  margin: 0 0 20.75px;
  font-size: 16px;
  line-height: 1.5;
}

.letter__copy p:last-child {
  margin-top: 39px;
}

.letter__signature {
  display: flex;
  width: max-content;
  margin: 67px 0 0 auto;
  flex-direction: column;
  color: #30332f;
  font-size: 11px;
  line-height: 1.5;
}

.letter__signature strong {
  font-size: 12px;
}

.letter__signature img {
  display: block;
  width: 92px;
  height: auto;
  margin: 0 0 7px auto;
}

.section-shell {
  width: min(1248px, calc(100% - 48px));
  margin: 0 auto;
}

.section-title {
  margin: 0;
  color: var(--about-green);
  font: 500 clamp(40px, 3.35vw, 50px)/1.1 var(--font-heading, Georgia, serif);
  letter-spacing: -.025em;
  text-align: center;
}

.beliefs-section {
  padding: 102px 0 112px;
  background: var(--about-muted);
}

.belief-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  margin-top: 72px;
}

.belief-card {
  display: flex;
  min-height: 455px;
  padding: 43px 43px 24px;
  flex-direction: column;
  border: 1px solid #28332f;
  border-radius: 13px;
  background: #fff;
  box-shadow: 0 4px 2px rgba(15, 24, 20, .15);
}

.belief-card__emoji {
  display: block;
  margin-bottom: 20px;
  font-size: 24px;
  line-height: 1;
}

.belief-card h3 {
  margin: 0 0 14px;
  color: #050505;
  font-size: 25px;
  font-weight: 750;
  letter-spacing: -.04em;
  line-height: 1.18;
}

.belief-card p {
  margin: 0;
  color: #1d211f;
  font-size: 16px;
  line-height: 1.5;
}

.belief-card img {
  display: block;
  width: 178px;
  height: 178px;
  margin: auto auto 0;
  object-fit: cover;
}

.promise-section {
  padding: 108px 24px 135px;
  background: #fff;
}

.promise-shell {
  width: min(1280px, 100%);
  margin: 0 auto;
}

.promise-list {
  display: grid;
  width: min(730px, 100%);
  gap: 26px;
  margin: 33px auto 0;
  padding: 0;
  list-style: none;
}

.promise-item {
  display: grid;
  min-height: 105px;
  grid-template-columns: 70px 320px 300px;
  align-items: center;
  gap: 20px;
}

.promise-item__heading {
  display: flex;
  min-height: 105px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  transform: translateX(-28px);
}

.promise-item__number {
  color: #f1f2ef;
  font: 500 44px/1 var(--font-heading, Georgia, serif);
  text-align: center;
  user-select: none;
}

.promise-item__heading img {
  display: block;
  width: 80px;
  height: 48px;
  margin-bottom: 3px;
  object-fit: contain;
}

.promise-item:nth-child(3) .promise-item__heading img {
  width: 64px;
  height: 64px;
}

.promise-item:nth-child(4) .promise-item__heading img {
  width: 68px;
  height: 58px;
}

.promise-item:nth-child(5) .promise-item__heading img {
  width: 52px;
  height: 50px;
}

.promise-item h3 {
  margin: 0;
  color: #0c1813;
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 18px;
  font-weight: 700;
  line-height: 1.25;
}

.promise-item > p {
  margin: 0;
  color: #2f3431;
  font-size: 14px;
  line-height: 20px;
}

.future-section {
  padding: 106px 24px 104px;
  background: var(--about-muted);
}

.future-shell {
  width: min(720px, 100%);
  margin: 0 auto;
  text-align: center;
}

.future-copy {
  margin-top: 50px;
}

.future-copy p {
  margin: 0 0 25px;
  color: #292e2b;
  font-size: 14px;
  line-height: 1.75;
}

.future-copy p:last-child {
  margin-bottom: 0;
}

.future-cta {
  display: inline-flex;
  width: 240px;
  height: 60px;
  margin-top: 43px;
  padding: 0;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 10px;
  background: #105446;
  color: #c0f177;
  font: 600 16px/1 'Inter', sans-serif;
  letter-spacing: 0;
  text-decoration: none;
  transition: transform .2s ease, background .2s ease;
}

.future-cta:hover {
  background: #0b473a;
  transform: translateY(-2px);
}

.careers-section {
  padding: 103px 48px 112px;
  background: #fff;
}

.careers-card {
  display: grid;
  width: min(1220px, 100%);
  min-height: 327px;
  margin: 0 auto;
  padding: 24px 42px 24px 68px;
  grid-template-columns: minmax(0, 1fr) 446px;
  align-items: center;
  gap: 52px;
  border: 1px solid #7a7f7c;
  border-radius: 180px;
}

.careers-card__copy h2 {
  margin: 0;
  color: var(--about-green);
  font: 500 clamp(34px, 3vw, 46px)/1.08 var(--font-heading, Georgia, serif);
  letter-spacing: -.025em;
}

.careers-card__copy p {
  margin: 25px 0 17px;
  color: #343936;
  font-size: 13px;
  line-height: 1.55;
}

.careers-card__copy a {
  color: var(--about-green);
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
}

.careers-card__copy a span {
  display: inline-block;
  margin-left: 5px;
  font-size: 18px;
  transition: transform .2s ease;
}

.careers-card__copy a:hover span {
  transform: translateX(4px);
}

.careers-card__visual {
  position: relative;
}

.careers-card__visual::before {
  position: absolute;
  inset: -9px 8px 9px -8px;
  border: 1px solid #8d918f;
  border-radius: 999px;
  content: '';
}

.careers-card__visual img {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 446 / 278;
  border: 1px solid #747a77;
  border-radius: 999px;
  object-fit: cover;
}

@media (max-width: 1024px) {
  .about-page {
    padding-top: 72px;
  }

  .about-hero {
    min-height: 540px;
  }

  .belief-grid {
    gap: 16px;
  }

  .belief-card {
    min-height: 430px;
    padding: 34px 28px 20px;
  }

  .belief-card h3 {
    font-size: 21px;
  }

  .careers-card {
    padding-left: 50px;
    grid-template-columns: minmax(0, 1fr) 38%;
    gap: 35px;
  }
}

@media (max-width: 767px) {
  .about-page {
    padding-top: 64px;
  }

  .about-hero {
    min-height: 510px;
    background-position: 54% center;
  }

  .about-hero__content {
    padding-bottom: 52px;
  }

  .about-hero h1 {
    font-size: clamp(38px, 11vw, 52px);
  }

  .about-hero p {
    font-size: 15px;
  }

  .letter-section {
    padding: 75px 22px 85px;
  }

  .letter__copy p {
    margin-bottom: 16px;
    font-size: 12px;
    line-height: 1.74;
  }

  .letter__signature {
    margin-right: 0;
  }

  .beliefs-section,
  .promise-section,
  .future-section {
    padding-top: 76px;
    padding-bottom: 82px;
  }

  .section-shell {
    width: min(100% - 36px, 500px);
  }

  .belief-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-top: 48px;
  }

  .belief-card {
    min-height: 420px;
  }

  .promise-list {
    gap: 36px;
    margin-top: 50px;
  }

  .promise-item {
    min-height: 0;
    grid-template-columns: 42px minmax(0, 1fr);
    gap: 12px 10px;
  }

  .promise-item__heading {
    min-height: 0;
    align-items: flex-start;
    text-align: left;
    transform: none;
  }

  .promise-item__number {
    grid-row: 1 / span 2;
    align-self: start;
    padding-top: 8px;
    font-size: 48px;
  }

  .promise-item > p {
    grid-column: 2;
    max-width: 470px;
    text-align: left;
  }

  .future-copy {
    margin-top: 40px;
  }

  .careers-section {
    padding: 72px 18px 82px;
  }

  .careers-card {
    min-height: 0;
    padding: 44px 28px 36px;
    grid-template-columns: 1fr;
    gap: 40px;
    border-radius: 44px;
    text-align: center;
  }

  .careers-card__copy h2 {
    font-size: 36px;
  }

  .careers-card__copy br {
    display: none;
  }

  .careers-card__visual {
    width: min(100%, 446px);
    margin: 0 auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .future-cta,
  .careers-card__copy a span {
    transition: none;
  }
}
</style>
