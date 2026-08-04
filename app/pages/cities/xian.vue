<template>
  <main class="city-xian">
    <section class="city-xian__hero" aria-labelledby="xian-title">
      <img class="city-xian__hero-image" src="/images/cities/xian/hero.webp" alt="Friends at Xi'an's ancient city gate">
      <div class="city-xian__hero-shade" />
      <div class="city-xian__hero-copy">
        <h1 id="xian-title">Xi'an</h1>
        <p>Ancient Echoes</p>
        <NuxtLink to="/wish" class="city-xian__hero-button">
          <span>Start Your Wish in Xi'an</span>
          <span class="city-xian__arrow" aria-hidden="true">&#8594;</span>
        </NuxtLink>
      </div>
    </section>

    <section class="city-xian__encounters" aria-labelledby="encounters-title">
      <div class="city-xian__shell">
        <header class="city-xian__section-heading">
          <h2 id="encounters-title">WHAT YOU'LL ENCOUNTER</h2>
          <p>This is not sightseeing. This is encountering</p>
        </header>
        <div class="city-xian__encounter-grid">
          <article v-for="item in encounters" :key="item.title" class="city-xian__encounter-card">
            <div class="city-xian__encounter-image">
              <img :src="item.image" :alt="item.title">
            </div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="city-xian__missions" aria-labelledby="missions-title">
      <div class="city-xian__shell">
        <header class="city-xian__missions-heading">
          <div>
            <h2 id="missions-title">CITY MISSIONS</h2>
            <p>Turn the city into your playground</p>
          </div>
          <NuxtLink to="/wish" class="city-xian__missions-link">
            <span>Explore All Missions</span>
            <span class="city-xian__missions-link-icon" aria-hidden="true">&#8250;</span>
          </NuxtLink>
        </header>
        <div class="city-xian__mission-grid">
          <article v-for="mission in missions" :key="mission.title" class="city-xian__mission-card">
            <div class="city-xian__mission-copy">
              <img class="city-xian__mission-icon" :src="mission.icon" alt="" aria-hidden="true">
              <h3>{{ mission.title }}</h3>
              <p>{{ mission.description }}</p>
              <NuxtLink to="/wish" class="city-xian__mission-more">
                <span>SEE MORE</span>
                <span aria-hidden="true">&#8594;</span>
              </NuxtLink>
            </div>
            <div class="city-xian__mission-art">
              <img :src="mission.image" :alt="mission.title">
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="city-xian__cta" aria-labelledby="cta-title">
      <picture>
        <source type="image/webp" srcset="/images/cities/xian/skyline.webp">
        <img class="city-xian__skyline" src="/images/cities/xian/skyline.png" alt="" aria-hidden="true">
      </picture>
      <div class="city-xian__cta-word" aria-hidden="true">XI'AN</div>
      <div class="city-xian__cta-content">
        <h2 id="cta-title">Ready for your<br>Xi'an encounter?</h2>
        <NuxtLink to="/wish" class="city-xian__cta-button">
          <img src="/images/home-v2/magic-wand.svg" alt="" aria-hidden="true">
          <span>Start Your Wish</span>
        </NuxtLink>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
const encounters = [
  { title: 'Cycle on Ancient Walls', description: 'Ride where empires once stood, at sunset.', image: '/images/cities/xian/cycle.webp' },
  { title: 'Midnight Food Quest', description: 'Follow the sizzling sounds into the Muslim Quarter.', image: '/images/cities/xian/food.webp' },
  { title: 'Midnight Food Quest', description: "Hear the roar of China's oldest opera in a hidden theater.", image: '/images/cities/xian/opera.webp' }
]

const missions = [
  { title: 'Start selling', description: 'Are you a restaurant owner looking to grow your business? Reach new customers when you join our network.', image: '/images/cities/xian/mission-sell.webp', icon: '/images/cities/xian/icons/mission-sell.svg' },
  { title: 'Deliver happiness', description: 'Join our elite league of delivery riders delivering happiness to customers and earn to achieve your dreams while at it.', image: '/images/cities/xian/mission-deliver.webp', icon: '/images/cities/xian/icons/mission-deliver.svg' },
  { title: 'Behind the scenes', description: 'If you are passionate about helping us achieve our goal to deliver meals seamlessly, come join the team.', image: '/images/cities/xian/mission-scenes.webp', icon: '/images/cities/xian/icons/mission-scenes.svg' }
]

const title = "Xi'an | Lvyv"
const description = "Explore Xi'an with Lvyv and discover local encounters beyond ordinary sightseeing."

useLvyvSeo({
  title,
  description,
  path: '/cities/xian',
  jsonLd: [
    webPageJsonLd(title, description, '/cities/xian'),
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: "Xi'an", path: '/cities/xian' }
    ])
  ]
})
</script>

<style>
.city-xian {
  --xian-ink: #203d33;
  --xian-forest: #105446;
  --xian-lime: #c0f177;
  --xian-cream: #fdfff3;
  color: var(--xian-ink);
  background: #fff;
  overflow: hidden;
  padding-top: 80px;
}

.city-xian__shell { width: min(1280px, calc(100% - 160px)); margin: 0 auto; }
.city-xian__hero { position: relative; height: 600px; overflow: hidden; }
.city-xian__hero-image { position: absolute; top: -182px; left: 0; width: 100%; height: 962px; object-fit: cover; object-position: center; }
.city-xian__hero-shade { position: absolute; inset: 0; background: rgba(0, 0, 0, .2); }
.city-xian__hero-copy { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; padding-top: 160px; text-align: center; }
.city-xian__hero-copy h1 { margin: 0; color: var(--xian-lime); font: 700 64px/1 'Philosopher', Georgia, serif; }
.city-xian__hero-copy p { margin: 7px 0 121px; color: #fff; font: 56px/1.2 'Didot', 'Playfair Display', Georgia, serif; }
.city-xian__hero-button, .city-xian__cta-button { display: inline-flex; align-items: center; justify-content: center; gap: 20px; border-radius: 10px; background: var(--xian-forest); color: var(--xian-lime); transition: transform .2s ease, background .2s ease; }
.city-xian__hero-button { width: 260px; height: 60px; font: 16px/1 'Inter', sans-serif; }
.city-xian__hero-button:hover, .city-xian__cta-button:hover { background: #0b4035; transform: translateY(-2px); }
.city-xian__arrow { font-size: 24px; line-height: 1; }

.city-xian__encounters { min-height: 749px; padding: 105px 0 80px; background: var(--xian-cream); }
.city-xian__section-heading h2, .city-xian__missions-heading h2 { margin: 0; font: 700 48px/1.1 'Didot', 'Playfair Display', Georgia, serif; letter-spacing: 0; }
.city-xian__section-heading p, .city-xian__missions-heading p { margin: -1px 0 0; font: 400 28px/40px 'Didot', 'Playfair Display', Georgia, serif; }
.city-xian__encounter-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; margin-top: 29px; }
.city-xian__encounter-card { min-width: 0; }
.city-xian__encounter-image { height: 268px; overflow: hidden; border-radius: 0 48px 0 0; }
.city-xian__encounter-image img { display: block; width: 100%; height: 100%; object-fit: cover; }
.city-xian__encounter-card:nth-child(1) img { object-position: center 52%; }
.city-xian__encounter-card:nth-child(2) img { object-position: center 45%; }
.city-xian__encounter-card:nth-child(3) img { object-position: center 51%; }
.city-xian__encounter-card h3 { margin: 17px 0 4px; font: 20px/1.3 'Inter', sans-serif; color: #000; }
.city-xian__encounter-card > p { margin: 0; color: #000; font: 16px/1.6 'Inter', sans-serif; }

.city-xian__missions { min-height: 800px; padding: 80px 0; background: #fff; }
.city-xian__missions-heading { display: flex; align-items: center; justify-content: space-between; height: 120px; }
.city-xian__missions-heading h2 { font-weight: 700; }
.city-xian__missions-link { display: inline-flex; align-items: center; gap: 10px; height: 40px; padding: 8px 8px 8px 16px; border-radius: 30px; background: var(--xian-ink); color: #fff; font: 500 14px/1 'Epilogue', 'Inter', sans-serif; }
.city-xian__missions-link-icon { display: grid; place-items: center; width: 24px; height: 24px; border-radius: 50%; background: #fff; color: var(--xian-ink); font-size: 23px; line-height: 18px; }
.city-xian__mission-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 36px; margin-top: 40px; }
.city-xian__mission-card { height: 484px; overflow: hidden; border: 4px solid #000; border-radius: 16px; background: #fff; }
.city-xian__mission-copy { position: relative; height: 290px; padding: 24px; color: #000; }
.city-xian__mission-icon { display: block; width: 40px; height: 40px; object-fit: contain; object-position: left center; }
.city-xian__mission-card:first-child .city-xian__mission-icon { width: 24px; height: 24px; }
.city-xian__mission-copy h3 { margin: 24px 0 15px; font: 800 27px/1.05 'Plus Jakarta Sans', 'Inter', sans-serif; letter-spacing: -1px; }
.city-xian__mission-copy p { margin: 0; max-width: 347px; font: 16px/1.5 'Plus Jakarta Sans', 'Inter', sans-serif; }
.city-xian__mission-more { position: absolute; left: 24px; bottom: 41px; display: inline-flex; align-items: center; gap: 7px; color: #000; font: 800 14px/20px 'Plus Jakarta Sans', 'Inter', sans-serif; letter-spacing: 3px; }
.city-xian__mission-art { height: 190px; background: #f3f4f6; }
.city-xian__mission-art img { display: block; width: 100%; height: 100%; object-fit: cover; }

.city-xian__cta { position: relative; height: 506px; overflow: hidden; background: #eef3ef; }
.city-xian__skyline { position: absolute; left: 0; top: -50px; width: 100%; height: 576px; object-fit: cover; opacity: .6; }
.city-xian__cta-word { position: absolute; top: 134px; right: 10%; color: #fff; opacity: .4; font: 180px/1 'Philosopher', Georgia, serif; }
.city-xian__cta-content { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; padding-top: 105px; text-align: center; }
.city-xian__cta-content h2 { margin: 0; color: var(--xian-ink); font: 64px/1.05 'Didot', 'Playfair Display', Georgia, serif; }
.city-xian__cta-button { width: 240px; height: 60px; margin-top: 51px; font: 600 16px/1 'Inter', sans-serif; }
.city-xian__cta-button img { width: 30px; height: 30px; }

@media (max-width: 991px) {
  .city-xian__shell { width: min(100% - 40px, 680px); }
  .city-xian__hero { height: 560px; }
  .city-xian__hero-image { top: 0; height: 100%; }
  .city-xian__hero-copy { padding-top: 145px; }
  .city-xian__hero-copy h1 { font-size: 52px; }
  .city-xian__hero-copy p { font-size: 44px; margin-bottom: 55px; }
  .city-xian__encounters { padding: 72px 0; }
  .city-xian__encounter-grid, .city-xian__mission-grid { grid-template-columns: 1fr; }
  .city-xian__encounter-grid { gap: 45px; }
  .city-xian__encounter-image { height: min(62vw, 300px); }
  .city-xian__missions { padding: 70px 0; }
  .city-xian__missions-heading { height: auto; align-items: flex-start; gap: 24px; }
  .city-xian__missions-link { flex-shrink: 0; }
  .city-xian__mission-grid { max-width: 430px; margin: 40px auto 0; }
  .city-xian__cta { height: 420px; }
  .city-xian__cta-content { padding-top: 88px; }
  .city-xian__cta-content h2 { font-size: 48px; }
  .city-xian__cta-word { right: 2%; font-size: 100px; top: 160px; }
}

@media (max-width: 600px) {
  .city-xian__hero { height: 500px; }
  .city-xian__hero-image { object-position: 58% center; }
  .city-xian__hero-copy { padding-top: 125px; }
  .city-xian__hero-copy h1 { font-size: 46px; }
  .city-xian__hero-copy p { font-size: 37px; margin-bottom: 50px; }
  .city-xian__hero-button { width: min(260px, calc(100% - 40px)); }
  .city-xian__section-heading h2, .city-xian__missions-heading h2 { font-size: 34px; }
  .city-xian__section-heading p, .city-xian__missions-heading p { font-size: 22px; }
  .city-xian__missions-heading { flex-direction: column; }
  .city-xian__missions-link { align-self: flex-start; }
  .city-xian__mission-card { height: 465px; }
  .city-xian__mission-copy { height: 278px; }
  .city-xian__cta-content h2 { font-size: 40px; }
}
</style>
