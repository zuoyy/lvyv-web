<template>
  <main class="city-chengdu">
    <section class="city-chengdu__hero" aria-labelledby="chengdu-title">
      <picture>
        <img class="city-chengdu__hero-image" src="/images/cities/chengdu/hero.webp" alt="A giant panda in a bamboo forest">
      </picture>
      <div class="city-chengdu__hero-shade" />
      <div class="city-chengdu__hero-copy">
        <h1 id="chengdu-title">Cheng'du</h1>
        <p>要得</p>
        <NuxtLink to="/wish" class="city-chengdu__hero-button">
          <span>Start Your Wish in Cheng'du</span>
          <span class="city-chengdu__arrow" aria-hidden="true">&#8594;</span>
        </NuxtLink>
      </div>
    </section>

    <section class="city-chengdu__encounters" aria-labelledby="encounters-title">
      <div class="city-chengdu__shell">
        <header class="city-chengdu__section-heading">
          <h2 id="encounters-title">WHAT YOU'LL ENCOUNTER</h2>
          <p>This is not sightseeing. This is encountering</p>
        </header>
        <div class="city-chengdu__encounter-grid">
          <article v-for="item in encounters" :key="item.title" class="city-chengdu__encounter-card">
            <div class="city-chengdu__encounter-image">
              <img :src="item.image" :alt="item.title">
            </div>
            <h3>{{ item.title }}</h3>
            <p v-html="item.description" />
          </article>
        </div>
      </div>
    </section>

    <section class="city-chengdu__cta" aria-labelledby="cta-title">
      <img class="city-chengdu__skyline" src="/images/cities/chengdu/skyline.webp" alt="" aria-hidden="true">
      <div class="city-chengdu__cta-word" aria-hidden="true">CHENG'DU</div>
      <div class="city-chengdu__cta-content">
        <h2 id="cta-title">Ready for your<br>Cheng'du encounter?</h2>
        <NuxtLink to="/wish" class="city-chengdu__cta-button">
          <img src="/images/home/magic-wand.svg" alt="" aria-hidden="true">
          <span>Start Your Wish</span>
        </NuxtLink>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
const encounters = [
  {
    title: 'Intimate contact with giant pandas',
    description: 'Personally experiencing the adorable innocence of giant pandas',
    image: '/images/cities/chengdu/panda.webp'
  },
  {
    title: 'Chengdu Hotpot',
    description: 'Let your taste buds experience it <span class="chengdu-script">“ 麻” “ 辣” “ 鲜” “ 香”</span>',
    image: '/images/cities/chengdu/hotpot.webp'
  },
  {
    title: 'Chengdu Face Changing',
    description: 'The ever-changing faces of Chengdu and the elegant charm of Shu style',
    image: '/images/cities/chengdu/opera.webp'
  }
]

const missions = [
  { title: 'Heard that there are people singing a song together in the park. Join them and sing a song.', avatars: 1, left: '-20%', top: '8%', width: '53%' },
  { title: 'Heard that there are people singing a song together in the park. Join them and sing a song.', avatars: 1, left: '66%', top: '8%', width: '54%' },
  { title: 'There are two cats on Huimin Street. Find them and take a photo together', avatars: 3, left: '59%', top: '27%', width: '49%' },
  { title: 'Maru Dang Face Mask is very interesting, go and experience it', avatars: 2, left: '6%', top: '46%', width: '41%' },
  { title: 'Maru Dang Face Mask is very interesting, go and experience it', avatars: 2, left: '76%', top: '46%', width: '41%' },
  { title: "A friend traveling in Chengdu has encountered difficulties and needs help", avatars: 2, left: '27%', top: '66%', width: '45%' },
  { title: 'Lan Kwai Fong Bar has a hidden mission, go and see if there are any surprises', avatars: 3, left: '20%', top: '84%', width: '52%' }
]

const title = "Cheng'du | Lvyv"
const description = "Explore Cheng'du with Lvyv and discover local encounters beyond ordinary sightseeing."

useLvyvSeo({
  title,
  description,
  path: '/cities/chengdu',
  jsonLd: [
    webPageJsonLd(title, description, '/cities/chengdu'),
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: "Cheng'du", path: '/cities/chengdu' }
    ])
  ]
})
</script>

<style>
.city-chengdu {
  --chengdu-ink: #203d33;
  --chengdu-forest: #105446;
  --chengdu-lime: #c0f177;
  --chengdu-cream: #fdfff3;
  color: var(--chengdu-ink);
  background: #fff;
  overflow: hidden;
  padding-top: 80px;
}

.city-chengdu__shell { width: min(1280px, calc(100% - 160px)); margin: 0 auto; }
.city-chengdu__hero { position: relative; height: 600px; overflow: hidden; }
.city-chengdu__hero-image { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 52%; }
.city-chengdu__hero-shade { position: absolute; inset: 0; background: rgba(0, 0, 0, .2); }
.city-chengdu__hero-copy { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; padding-top: 160px; text-align: center; }
.city-chengdu__hero-copy h1 { margin: 0; color: var(--chengdu-lime); font: 700 64px/1 'Philosopher', Georgia, serif; }
.city-chengdu__hero-copy p { margin: 7px 0 121px; color: #fff; font: 56px/1.2 'Didot', 'Playfair Display', Georgia, serif; }
.city-chengdu__hero-button, .city-chengdu__cta-button { display: inline-flex; align-items: center; justify-content: center; gap: 20px; border-radius: 10px; background: var(--chengdu-forest); color: var(--chengdu-lime); transition: transform .2s ease, background .2s ease; }
.city-chengdu__hero-button { width: 296px; height: 60px; font: 16px/1 'Inter', sans-serif; }
.city-chengdu__hero-button:hover, .city-chengdu__cta-button:hover { background: #0b4035; transform: translateY(-2px); }
.city-chengdu__arrow { font-size: 24px; line-height: 1; }

.city-chengdu__encounters { min-height: 749px; padding: 105px 0 80px; background: var(--chengdu-cream); }
.city-chengdu__section-heading h2, .city-chengdu__missions-heading h2 { margin: 0; font: 700 48px/1.1 'Didot', 'Playfair Display', Georgia, serif; letter-spacing: 0; }
.city-chengdu__section-heading p, .city-chengdu__missions-heading p { margin: -1px 0 0; font: 400 28px/40px 'Didot', 'Playfair Display', Georgia, serif; }
.city-chengdu__encounter-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; margin-top: 29px; }
.city-chengdu__encounter-card { min-width: 0; }
.city-chengdu__encounter-image { height: 268px; overflow: hidden; border-radius: 0 48px 0 0; }
.city-chengdu__encounter-image img { display: block; width: 100%; height: 100%; object-fit: cover; }
.city-chengdu__encounter-card:nth-child(1) img { object-position: center 45%; }
.city-chengdu__encounter-card:nth-child(2) img { object-position: center 48%; }
.city-chengdu__encounter-card:nth-child(3) img { object-position: center 47%; }
.city-chengdu__encounter-card h3 { margin: 17px 0 4px; font: 20px/1.3 'Inter', sans-serif; color: #000; }
.city-chengdu__encounter-card > p { margin: 0; color: #000; font: 16px/1.6 'Inter', sans-serif; }
.chengdu-script { font-family: 'Caveat', 'STKaiti', cursive; }

.city-chengdu__missions { min-height: 800px; padding: 80px 0; background: #fff; }
.city-chengdu__missions-heading { display: flex; align-items: center; justify-content: space-between; height: 120px; }
.city-chengdu__missions-heading h2 { font-weight: 700; }
.city-chengdu__missions-link { display: inline-flex; align-items: center; gap: 10px; height: 40px; padding: 8px 8px 8px 16px; border-radius: 30px; background: var(--chengdu-ink); color: #fff; font: 500 14px/1 'Epilogue', 'Inter', sans-serif; }
.city-chengdu__missions-link-icon { display: grid; place-items: center; width: 24px; height: 24px; border-radius: 50%; background: #fff; color: var(--chengdu-ink); font-size: 23px; line-height: 18px; }
.city-chengdu__mission-board { position: relative; height: 484px; overflow: hidden; border: 4px solid #000; border-radius: 16px; background: #fff; }
.city-chengdu__mission-pill { position: absolute; left: var(--mission-left); top: var(--mission-top); display: flex; align-items: center; width: var(--mission-width); min-height: 48px; padding: 0 18px 0 0; border-radius: 41px; background: #fff; box-shadow: 0 4px 4px rgba(0, 0, 0, .09); color: #000; font: 600 14px/1.2 'Inter', sans-serif; transition: transform .2s ease, box-shadow .2s ease; }
.city-chengdu__mission-pill:hover { transform: translateY(-2px); box-shadow: 0 7px 12px rgba(0, 0, 0, .14); }
.city-chengdu__mission-avatars { display: flex; flex: 0 0 auto; align-items: center; margin-right: 10px; }
.city-chengdu__mission-avatars img { width: 48px; height: 48px; padding: 13px; object-fit: contain; }
.city-chengdu__mission-avatars img + img { margin-left: -17px; }

.city-chengdu__cta { position: relative; height: 506px; overflow: hidden; background: #eef3ef; }
.city-chengdu__skyline { position: absolute; left: 0; top: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 70%; opacity: .36; }
.city-chengdu__cta-word { position: absolute;  left: 50%; transform: translateX(-50%); color: #fff; opacity: .4; font: 180px/1 'Philosopher', Georgia, serif; white-space: nowrap; }
.city-chengdu__cta-content { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; padding-top: 117px; text-align: center; }
.city-chengdu__cta-content h2 { margin: 0; color: var(--chengdu-ink); font: 64px/1.05 'Didot', 'Playfair Display', Georgia, serif; }
.city-chengdu__cta-button { width: 240px; height: 60px; margin-top: 52px; font: 600 16px/1 'Inter', sans-serif; }
.city-chengdu__cta-button img { width: 30px; height: 30px; }

@media (max-width: 991px) {
  .city-chengdu__shell { width: min(100% - 40px, 680px); }
  .city-chengdu__hero { height: 560px; }
  .city-chengdu__hero-copy { padding-top: 145px; }
  .city-chengdu__hero-copy h1 { font-size: 52px; }
  .city-chengdu__hero-copy p { font-size: 44px; margin-bottom: 55px; }
  .city-chengdu__encounters { padding: 72px 0; }
  .city-chengdu__encounter-grid { grid-template-columns: 1fr; gap: 45px; }
  .city-chengdu__encounter-image { height: min(62vw, 300px); }
  .city-chengdu__missions { padding: 70px 0; }
  .city-chengdu__missions-heading { height: auto; align-items: flex-start; gap: 24px; }
  .city-chengdu__missions-link { flex-shrink: 0; }
  .city-chengdu__mission-board { display: grid; grid-template-columns: 1fr; gap: 12px; height: auto; min-height: 0; padding: 16px; overflow: visible; }
  .city-chengdu__mission-pill { position: static; width: 100%; min-height: 48px; }
  .city-chengdu__cta { height: 420px; }
  .city-chengdu__cta-content { padding-top: 88px; }
  .city-chengdu__cta-content h2 { font-size: 48px; }
  .city-chengdu__cta-word { top: 25px; font-size: 100px; }
}

@media (max-width: 640px) {
  .city-chengdu { padding-top: 68px; }
  .city-chengdu__hero { height: 500px; }
  .city-chengdu__hero-image { object-position: 58% center; }
  .city-chengdu__hero-copy { padding-top: 125px; }
  .city-chengdu__hero-copy h1 { font-size: 46px; }
  .city-chengdu__hero-copy p { font-size: 37px; margin-bottom: 50px; }
  .city-chengdu__hero-button { width: min(296px, calc(100% - 40px)); }
  .city-chengdu__section-heading h2, .city-chengdu__missions-heading h2 { font-size: 34px; }
  .city-chengdu__section-heading p, .city-chengdu__missions-heading p { font-size: 22px; line-height: 32px; }
  .city-chengdu__missions-heading { flex-direction: column; }
  .city-chengdu__missions-link { align-self: flex-start; }
  .city-chengdu__mission-pill { font-size: 13px; }
  .city-chengdu__cta-content h2 { font-size: 40px; }
  .city-chengdu__cta-word { left: 50%; font-size: 72px; }
}
</style>
