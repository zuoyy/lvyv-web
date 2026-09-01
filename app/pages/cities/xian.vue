<template>
  <main class="city-xian">
    <!-- Hero Section -->
    <section class="city-xian__hero" aria-labelledby="xian-hero-title">
      <img
        class="city-xian__hero-image"
        src="/images/cities/xian/hero.webp"
        alt="Friends enjoying the ancient view of Xi'an"
      >
      <div class="city-xian__hero-shade" aria-hidden="true" />
      <div class="city-xian__hero-copy">
        <h1 id="xian-hero-title">Xi'an</h1>
        <p>Ancient Echoes</p>
        <NuxtLink to="/wish/create?city=xian&step=1" class="city-xian__hero-button">
          <span>Start Your Wish in Xi'an</span>
          <span class="city-xian__arrow" aria-hidden="true">&#8594;</span>
        </NuxtLink>
      </div>
    </section>

    <!-- Encounters Section -->
    <section class="city-xian__encounters" aria-labelledby="encounters-title">
      <div class="city-xian__shell">
        <header class="city-xian__section-heading">
          <h2 id="encounters-title">WHAT YOU'LL ENCOUNTER</h2>
          <p class="city-xian__section-subheading">
            Xi’an is where ancient China begins.<br>
            Walk along walls built centuries ago. Meet the stories behind the warriors.<br>
            Step into the world of Tang Chang’an. And, somewhere along the way, meet the people who call Xi’an home.<br>
            This is not a tour of Xi’an. It is your story in Xi’an.
          </p>
        </header>

        <div class="city-xian__encounter-grid">
          <article
            v-for="item in encounters"
            :key="item.id"
            class="city-xian__encounter-card"
          >
            <div class="city-xian__encounter-image-wrapper">
              <img
                :src="item.image"
                :alt="item.imageAlt"
                :style="{ objectPosition: item.objectPosition || 'center center' }"
                loading="lazy"
              >
            </div>
            <div class="city-xian__encounter-header">
              <span class="city-xian__encounter-tag">{{ item.tag }}</span>
              <h3 class="city-xian__encounter-title">{{ item.title }}</h3>
            </div>
            <p class="city-xian__encounter-desc">{{ item.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Bottom CTA Section -->
    <section class="city-xian__cta" aria-labelledby="cta-title">
      <img
        class="city-xian__skyline"
        src="/images/cities/xian/cta-skyline.webp"
        alt=""
        aria-hidden="true"
        loading="lazy"
      >
      <div class="city-xian__cta-word" aria-hidden="true">XI'AN</div>
      <div class="city-xian__cta-content">
        <h2 id="cta-title">Ready for your<br>Xi'an encounter?</h2>
        <NuxtLink to="/wish/create?city=xian&step=1" class="city-xian__cta-button">
          <img src="/images/home/magic-wand.svg" alt="" aria-hidden="true">
          <span>Start Your Wish</span>
        </NuxtLink>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
interface XianEncounter {
  id: string
  tag: string
  title: string
  description: string
  image: string
  imageAlt: string
  objectPosition?: string
}

const encounters: XianEncounter[] = [
  {
    id: 'city-wall',
    tag: 'Meet the City',
    title: 'Ride Through 1,400 Years',
    description: 'Instead of looking at Xi’an from behind a window, get on a bicycle and ride across its ancient walls. Feel the city open beneath you. A city once built for emperors. Now, yours to explore.',
    image: '/images/cities/xian/encounter-city-wall.webp',
    imageAlt: "Cycling along the ancient Xi'an city wall at sunset",
    objectPosition: 'center 50%'
  },
  {
    id: 'warriors',
    tag: 'Meet the Story',
    title: "The Emperor's Secret",
    description: 'Thousands of warriors. One emperor. One mystery. Look closer. Why are no two faces exactly alike? Why were they buried here? History becomes different when you have a question to answer.',
    image: '/images/cities/xian/encounter-warriors.webp',
    imageAlt: 'Terracotta Warriors in Xi’an pit',
    objectPosition: 'center 40%'
  },
  {
    id: 'tang-changan',
    tag: 'Meet Someone',
    title: 'Become Someone in Tang Chang’an',
    description: "For one evening, you don't just visit Tang China. You become part of it. Dress the part. Walk the streets. Meet the people. For a moment, history is no longer behind glass.",
    image: '/images/cities/xian/encounter-tang-changan.webp',
    imageAlt: 'Experience the Tang Chang’an immersive world',
    objectPosition: 'center 45%'
  },
  {
    id: 'breakfast',
    tag: 'Meet the Real Xi’an',
    title: 'Breakfast Like a Local',
    description: 'Forget the hotel buffet. Follow us into the morning streets of Xi’an. Choose something you\'ve never tried. Ask what it is. Take a bite. The best way to understand a city is sometimes to eat what its people eat.',
    image: '/images/cities/xian/encounter-breakfast.webp',
    imageAlt: 'Traditional Xi’an breakfast and food street',
    objectPosition: 'center 35%'
  },
  {
    id: 'craftsman',
    tag: 'Meet the Maker',
    title: 'A Story Made by Hand',
    description: 'Meet a local craftsman. Watch their hands. Learn the story. Try it yourself. And take home something you didn\'t buy—something you made.',
    image: '/images/cities/xian/encounter-craftsman.webp',
    imageAlt: 'Local artisan shadow puppet crafting',
    objectPosition: 'center 30%'
  },
  {
    id: 'luck',
    tag: 'Meet Your Luck',
    title: 'One Last Surprise',
    description: 'Before you leave Xi’an, there is one last thing waiting for you. A small envelope. Inside is a wish, a message, or perhaps a little piece of luck. Some journeys end with a goodbye. Ours ends with a wish. What will yours say?',
    image: '/images/cities/xian/encounter-luck.webp',
    imageAlt: 'Xi’an grand Tang night city illumination',
    objectPosition: 'center 50%'
  }
]

const title = "Xi'an · Ancient Echoes | Lvyv Handcrafted Encounters"
const description = "Explore Xi'an with Lvyv. Ride along 1,400-year-old walls, uncover the secrets of the Terracotta Army, step into Tang Chang'an, and craft your handcrafted China encounter."

useLvyvSeo({
  title,
  description,
  path: '/cities/xian',
  jsonLd: [
    webPageJsonLd(title, description, '/cities/xian'),
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Cities', path: '/cities' },
      { name: "Xi'an", path: '/cities/xian' }
    ])
  ]
})
</script>

<style scoped>
.city-xian {
  --xian-ink: #203d33;
  --xian-forest: #105446;
  --xian-lime: #c0f177;
  --xian-lime-accent: #cff380;
  --xian-cream: #fdfff3;
  --xian-cta-bg: #eef3ef;
  color: var(--xian-ink);
  background: #fff;
  overflow: hidden;
  padding-top: 80px;
}

.city-xian__shell {
  width: min(1280px, calc(100% - 160px));
  margin: 0 auto;
}

/* ==========================================================================
   Hero Section
   ========================================================================== */
.city-xian__hero {
  position: relative;
  height: 580px;
  overflow: hidden;
}

.city-xian__hero-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
}

.city-xian__hero-shade {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
}

.city-xian__hero-copy {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 150px;
  text-align: center;
}

.city-xian__hero-copy h1 {
  margin: 0;
  color: var(--xian-lime-accent);
  font-family: 'Philosopher', Georgia, serif;
  font-size: 64px;
  font-weight: 700;
  line-height: 1.1;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.city-xian__hero-copy p {
  margin: 8px 0 0;
  color: #fff;
  font-family: 'Didot', 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.2;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
}

.city-xian__hero-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  width: 260px;
  height: 60px;
  margin-top: 86px;
  border-radius: 10px;
  background: var(--xian-forest);
  color: var(--xian-lime);
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  box-shadow: 0 4px 20px rgba(16, 84, 70, 0.3);
  transition: transform 0.25s ease, background-color 0.25s ease, box-shadow 0.25s ease;
}

.city-xian__hero-button:hover {
  background: #0b4035;
  color: #d6fba0;
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(16, 84, 70, 0.45);
}

.city-xian__arrow {
  font-size: 20px;
  line-height: 1;
  transition: transform 0.25s ease;
}

.city-xian__hero-button:hover .city-xian__arrow {
  transform: translateX(4px);
}

/* ==========================================================================
   Encounters Section
   ========================================================================== */
.city-xian__encounters {
  padding: 100px 0 110px;
  background: var(--xian-cream);
}

.city-xian__section-heading {
  text-align: center;
}

.city-xian__section-heading h2 {
  margin: 0;
  color: var(--xian-ink);
  font-family: 'Didot', 'Playfair Display', Georgia, serif;
  font-size: 48px;
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: 0.5px;
}

.city-xian__section-subheading {
  max-width: 1080px;
  margin: 20px auto 56px;
  color: var(--xian-ink);
  font-family: 'Philosopher', Georgia, serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 1.6;
}

.city-xian__encounter-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 32px;
  row-gap: 48px;
}

.city-xian__encounter-card {
  display: flex;
  flex-direction: column;
}

.city-xian__encounter-image-wrapper {
  height: 268px;
  overflow: hidden;
  border-radius: 0 48px 0 0;
  background: #e2e7dc;
}

.city-xian__encounter-image-wrapper img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.city-xian__encounter-card:hover .city-xian__encounter-image-wrapper img {
  transform: scale(1.05);
}

.city-xian__encounter-header {
  margin-top: 20px;
}

.city-xian__encounter-tag {
  display: block;
  color: var(--xian-ink);
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 20px;
  font-weight: 600;
  line-height: 1.3;
}

.city-xian__encounter-title {
  margin: 2px 0 0;
  color: var(--xian-ink);
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 20px;
  font-weight: 400;
  line-height: 1.3;
}

.city-xian__encounter-desc {
  margin: 14px 0 0;
  color: #000;
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 15px;
  line-height: 1.6;
  opacity: 0.9;
}

/* ==========================================================================
   Bottom CTA Section
   ========================================================================== */
.city-xian__cta {
  position: relative;
  height: 506px;
  overflow: hidden;
  background: var(--xian-cta-bg);
}

.city-xian__skyline {
  position: absolute;
  top: -50px;
  left: 0;
  width: 100%;
  height: 576px;
  object-fit: cover;
  opacity: 0.6;
  pointer-events: none;
}

.city-xian__cta-word {
  position: absolute;
  right: 6%;
  bottom: 30px;
  color: #fff;
  font-family: 'Philosopher', Georgia, serif;
  font-size: 180px;
  font-weight: 700;
  line-height: 1;
  opacity: 0.4;
  pointer-events: none;
  user-select: none;
}

.city-xian__cta-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 20px;
  text-align: center;
}

.city-xian__cta-content h2 {
  margin: 0;
  color: var(--xian-ink);
  font-family: 'Didot', 'Playfair Display', Georgia, serif;
  font-size: 64px;
  font-weight: 400;
  line-height: 1.1;
}

.city-xian__cta-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  width: 240px;
  height: 60px;
  margin-top: 40px;
  border-radius: 10px;
  background: var(--xian-forest);
  color: var(--xian-lime);
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 4px 20px rgba(16, 84, 70, 0.3);
  transition: transform 0.25s ease, background-color 0.25s ease, box-shadow 0.25s ease;
}

.city-xian__cta-button:hover {
  background: #0b4035;
  color: #d6fba0;
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(16, 84, 70, 0.45);
}

.city-xian__cta-button img {
  width: 28px;
  height: 28px;
}

/* ==========================================================================
   Responsive Breakpoints
   ========================================================================== */
@media (max-width: 1024px) {
  .city-xian__shell {
    width: min(100% - 64px, 860px);
  }

  .city-xian__encounter-grid {
    grid-template-columns: repeat(2, 1fr);
    column-gap: 24px;
    row-gap: 40px;
  }

  .city-xian__cta-word {
    font-size: 130px;
    right: 3%;
  }

  .city-xian__cta-content h2 {
    font-size: 52px;
  }
}

@media (max-width: 767px) {
  .city-xian {
    padding-top: var(--mobile-navbar-height, 60px);
  }

  .city-xian__shell {
    width: min(100% - 32px, 520px);
  }

  .city-xian__hero {
    height: 480px;
  }

  .city-xian__hero-image {
    top: 0;
    height: 100%;
    object-fit: cover;
  }

  .city-xian__hero-copy {
    padding-top: 110px;
  }

  .city-xian__hero-copy h1 {
    font-size: 48px;
  }

  .city-xian__hero-copy p {
    font-size: 38px;
    margin: 8px 0 0;
  }

  .city-xian__hero-button {
    width: 230px;
    height: 52px;
    margin-top: 48px;
    font-size: 15px;
  }

  .city-xian__encounters {
    padding: 64px 0 72px;
  }

  .city-xian__section-heading h2 {
    font-size: 36px;
  }

  .city-xian__section-subheading {
    font-size: 16px;
    line-height: 1.5;
    margin: 16px auto 36px;
  }

  .city-xian__encounter-grid {
    grid-template-columns: 1fr;
    row-gap: 36px;
  }

  .city-xian__encounter-image-wrapper {
    height: 220px;
  }

  .city-xian__encounter-tag,
  .city-xian__encounter-title {
    font-size: 18px;
  }

  .city-xian__encounter-desc {
    font-size: 14px;
  }

  .city-xian__cta {
    height: 420px;
  }

  .city-xian__cta-word {
    font-size: 90px;
    right: 2%;
    bottom: 20px;
  }

  .city-xian__cta-content h2 {
    font-size: 40px;
  }

  .city-xian__cta-button {
    width: 210px;
    height: 52px;
    margin-top: 30px;
    font-size: 15px;
  }
}
</style>
