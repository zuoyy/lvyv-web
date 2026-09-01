<template>
  <main class="city-chongqing">
    <!-- Hero Section -->
    <section class="city-chongqing__hero" aria-labelledby="chongqing-hero-title">
      <img
        class="city-chongqing__hero-image"
        src="/images/cities/chongqing/hero.webp"
        alt="Chongqing majestic mountain city landscape"
      >
      <div class="city-chongqing__hero-shade" aria-hidden="true" />
      <div class="city-chongqing__hero-copy">
        <h1 id="chongqing-hero-title">CHONGQING</h1>
        <p>Meet the Mountain City</p>
        <NuxtLink to="/wish/create?city=chongqing&step=1" class="city-chongqing__hero-button">
          <span>Start Your Wish in Chongqing</span>
          <span class="city-chongqing__arrow" aria-hidden="true">&#8594;</span>
        </NuxtLink>
      </div>
    </section>

    <!-- Encounters Section -->
    <section class="city-chongqing__encounters" aria-labelledby="encounters-title">
      <div class="city-chongqing__shell">
        <header class="city-chongqing__section-heading">
          <h2 id="encounters-title">CHONGQING IS BUILT ON LAYERS</h2>
          <p class="city-chongqing__section-subheading">
            Mountains rise above rivers. Buildings disappear into hills.<br>
            Trains pass through apartments.<br>
            And every turn seems to reveal another story.<br>
            Chongqing isn't a city you simply visit. It's a city you get lost in.
          </p>
        </header>

        <div class="city-chongqing__encounter-grid">
          <article
            v-for="item in encounters"
            :key="item.id"
            class="city-chongqing__encounter-card"
          >
            <div class="city-chongqing__encounter-image-wrapper">
              <img
                :src="item.image"
                :alt="item.imageAlt"
                :style="{ objectPosition: item.objectPosition || 'center center' }"
                loading="lazy"
              >
            </div>
            <div class="city-chongqing__encounter-header">
              <span class="city-chongqing__encounter-tag">{{ item.tag }}</span>
              <h3 class="city-chongqing__encounter-title">{{ item.title }}</h3>
            </div>
            <p class="city-chongqing__encounter-desc">
              {{ item.description }}
            </p>
            <div v-if="item.extraList" class="city-chongqing__flavor-tags">
              <span v-for="tag in item.extraList" :key="tag" class="city-chongqing__flavor-item">{{ tag }}</span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Bottom CTA Section -->
    <section class="city-chongqing__cta" aria-labelledby="cta-title">
      <img
        class="city-chongqing__skyline"
        src="/images/cities/chongqing/cta-skyline.webp"
        alt=""
        aria-hidden="true"
        loading="lazy"
      >
      <div class="city-chongqing__cta-word" aria-hidden="true">CHONGQING</div>
      <div class="city-chongqing__cta-content">
        <h2 id="cta-title">Ready for your<br>Chongqing encounter?</h2>
        <NuxtLink to="/wish/create?city=chongqing&step=1" class="city-chongqing__cta-button">
          <img src="/images/home/magic-wand.svg" alt="" aria-hidden="true">
          <span>Start Your Wish</span>
        </NuxtLink>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  alias: ['/cities/chongqin']
})

interface ChongqingEncounter {
  id: string
  tag: string
  title: string
  description: string
  extraList?: string[]
  image: string
  imageAlt: string
  objectPosition?: string
}

const encounters: ChongqingEncounter[] = [
  {
    id: '8d-city',
    tag: 'Meet the City',
    title: 'Get Lost in 8D Chongqing',
    description: 'Forget the map. Walk through stairways, bridges, hidden alleys and streets that seem to exist on different levels. Take the famous train. Walk through an old neighborhood. Stand above the Yangtze River.',
    image: '/images/cities/chongqing/encounter-8d-city.webp',
    imageAlt: '8D Chongqing architectural layers and city train',
    objectPosition: 'center 45%'
  },
  {
    id: 'neon-story',
    tag: 'Meet the Story',
    title: 'Beneath the Neon',
    description: 'Old bomb shelters. Historic streets. Riverside neighborhoods. Stories from a city that survived war, fire and enormous change. Look beyond the lights. There\'s another Chongqing underneath.',
    image: '/images/cities/chongqing/encounter-neon-story.webp',
    imageAlt: 'Historic alleys beneath Chongqing neon lights',
    objectPosition: 'center 35%'
  },
  {
    id: 'teahouse',
    tag: 'Meet Someone',
    title: 'Tea, Chat & Chongqing',
    description: 'Sit down at a local teahouse. No performance. No scripted tour. Just tea, conversation and a chance to meet the people who live here. Maybe you\'ll learn about Chongqing. Maybe you\'ll just laugh together.',
    image: '/images/cities/chongqing/encounter-teahouse.webp',
    imageAlt: 'Local Chongqing tea and warm conversation',
    objectPosition: 'center 45%'
  },
  {
    id: 'hotpot',
    tag: 'Meet the Flavor',
    title: 'Hotpot, the Chongqing Way',
    description: 'Choose your spice. Pick your ingredients. Learn how locals eat it. And discover why Chongqing people take their hotpot seriously. How brave are you?',
    extraList: ['🌶️ Mild', '🌶️🌶️ Curious', '🌶️🌶️🌶️ Chongqing Level'],
    image: '/images/cities/chongqing/encounter-hotpot.webp',
    imageAlt: 'Authentic spicy Chongqing hotpot',
    objectPosition: 'center center'
  },
  {
    id: 'nature',
    tag: 'Meet the Nature',
    title: 'Beyond the City',
    description: 'When the neon disappears, another Chongqing appears. Mountains. Rivers. Mist. Ancient towns. Take a boat. Walk through the hills. Slow down. A different side of Chongqing, away from the crowds.',
    image: '/images/cities/chongqing/encounter-nature.webp',
    imageAlt: 'Chongqing misty mountains and river gorges',
    objectPosition: 'center 45%'
  },
  {
    id: 'luck',
    tag: 'Meet Your Luck',
    title: 'A Little Chongqing Luck',
    description: 'Before you leave, there\'s one last surprise. A small red envelope. Inside: A wish. A message. Or perhaps a little 好运. You won\'t know until you open it. Every journey deserves a little luck.',
    image: '/images/cities/chongqing/encounter-luck.webp',
    imageAlt: 'Chongqing night scenery and red envelope fortune',
    objectPosition: 'center 40%'
  }
]

const title = "Chongqing · Meet the Mountain City | Lvyv Handcrafted Encounters"
const description = "Discover Chongqing with Lvyv. Explore the surreal 8D mountain city, authentic spicy hotpot culture, historic shelters, misty river gorges, and handcrafted encounters."

useLvyvSeo({
  title,
  description,
  path: '/cities/chongqing',
  jsonLd: [
    webPageJsonLd(title, description, '/cities/chongqing'),
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Cities', path: '/cities' },
      { name: 'Chongqing', path: '/cities/chongqing' }
    ])
  ]
})
</script>

<style scoped>
.city-chongqing {
  --cq-ink: #203d33;
  --cq-forest: #105446;
  --cq-lime: #c0f177;
  --cq-lime-accent: #cff380;
  --cq-cream: #fdfff3;
  --cq-cta-bg: #eef3ef;
  color: var(--cq-ink);
  background: #fff;
  overflow: hidden;
  padding-top: 80px;
}

.city-chongqing__shell {
  width: min(1280px, calc(100% - 160px));
  margin: 0 auto;
}

/* ==========================================================================
   Hero Section
   ========================================================================== */
.city-chongqing__hero {
  position: relative;
  height: 580px;
  overflow: hidden;
}

.city-chongqing__hero-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
}

.city-chongqing__hero-shade {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
}

.city-chongqing__hero-copy {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 150px;
  text-align: center;
}

.city-chongqing__hero-copy h1 {
  margin: 0;
  color: var(--cq-lime-accent);
  font-family: 'Philosopher', Georgia, serif;
  font-size: 64px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: 1px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
}

.city-chongqing__hero-copy p {
  margin: 8px 0 0;
  color: #fff;
  font-family: 'Didot', 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.2;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.45);
}

.city-chongqing__hero-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  width: 300px;
  height: 60px;
  margin-top: 86px;
  border-radius: 10px;
  background: var(--cq-forest);
  color: var(--cq-lime);
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  box-shadow: 0 4px 20px rgba(16, 84, 70, 0.35);
  transition: transform 0.25s ease, background-color 0.25s ease, box-shadow 0.25s ease;
}

.city-chongqing__hero-button:hover {
  background: #0b4035;
  color: #d6fba0;
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(16, 84, 70, 0.5);
}

.city-chongqing__arrow {
  font-size: 20px;
  line-height: 1;
  transition: transform 0.25s ease;
}

.city-chongqing__hero-button:hover .city-chongqing__arrow {
  transform: translateX(4px);
}

/* ==========================================================================
   Encounters Section
   ========================================================================== */
.city-chongqing__encounters {
  padding: 100px 0 110px;
  background: var(--cq-cream);
}

.city-chongqing__section-heading {
  text-align: center;
}

.city-chongqing__section-heading h2 {
  margin: 0;
  color: var(--cq-ink);
  font-family: 'Didot', 'Playfair Display', Georgia, serif;
  font-size: 48px;
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.city-chongqing__section-subheading {
  max-width: 1080px;
  margin: 20px auto 56px;
  color: var(--cq-ink);
  font-family: 'Philosopher', Georgia, serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 1.6;
}

.city-chongqing__encounter-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 32px;
  row-gap: 48px;
}

.city-chongqing__encounter-card {
  display: flex;
  flex-direction: column;
}

.city-chongqing__encounter-image-wrapper {
  height: 268px;
  overflow: hidden;
  border-radius: 0 48px 0 0;
  background: #e2e7dc;
}

.city-chongqing__encounter-image-wrapper img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.city-chongqing__encounter-card:hover .city-chongqing__encounter-image-wrapper img {
  transform: scale(1.05);
}

.city-chongqing__encounter-header {
  margin-top: 20px;
}

.city-chongqing__encounter-tag {
  display: block;
  color: var(--cq-ink);
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 20px;
  font-weight: 600;
  line-height: 1.3;
}

.city-chongqing__encounter-title {
  margin: 2px 0 0;
  color: var(--cq-ink);
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 20px;
  font-weight: 400;
  line-height: 1.3;
}

.city-chongqing__encounter-desc {
  margin: 14px 0 0;
  color: #000;
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 15px;
  line-height: 1.6;
  opacity: 0.9;
}

.city-chongqing__flavor-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 10px;
}

.city-chongqing__flavor-item {
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 14px;
  font-weight: 500;
  color: var(--cq-forest);
  background: rgba(16, 84, 70, 0.08);
  padding: 3px 10px;
  border-radius: 6px;
}

/* ==========================================================================
   Bottom CTA Section
   ========================================================================== */
.city-chongqing__cta {
  position: relative;
  height: 506px;
  overflow: hidden;
  background: var(--cq-cta-bg);
}

.city-chongqing__skyline {
  position: absolute;
  top: -50px;
  left: 0;
  width: 100%;
  height: 576px;
  object-fit: cover;
  opacity: 0.6;
  pointer-events: none;
}

.city-chongqing__cta-word {
  position: absolute;
  right: 4%;
  bottom: 25px;
  color: #fff;
  font-family: 'Philosopher', Georgia, serif;
  font-size: 160px;
  font-weight: 700;
  line-height: 1;
  opacity: 0.4;
  pointer-events: none;
  user-select: none;
}

.city-chongqing__cta-content {
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

.city-chongqing__cta-content h2 {
  margin: 0;
  color: var(--cq-ink);
  font-family: 'Didot', 'Playfair Display', Georgia, serif;
  font-size: 64px;
  font-weight: 400;
  line-height: 1.1;
}

.city-chongqing__cta-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  width: 240px;
  height: 60px;
  margin-top: 40px;
  border-radius: 10px;
  background: var(--cq-forest);
  color: var(--cq-lime);
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 4px 20px rgba(16, 84, 70, 0.3);
  transition: transform 0.25s ease, background-color 0.25s ease, box-shadow 0.25s ease;
}

.city-chongqing__cta-button:hover {
  background: #0b4035;
  color: #d6fba0;
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(16, 84, 70, 0.45);
}

.city-chongqing__cta-button img {
  width: 28px;
  height: 28px;
}

/* ==========================================================================
   Responsive Breakpoints
   ========================================================================== */
@media (max-width: 1024px) {
  .city-chongqing__shell {
    width: min(100% - 64px, 860px);
  }

  .city-chongqing__encounter-grid {
    grid-template-columns: repeat(2, 1fr);
    column-gap: 24px;
    row-gap: 40px;
  }

  .city-chongqing__cta-word {
    font-size: 110px;
    right: 2%;
  }

  .city-chongqing__cta-content h2 {
    font-size: 52px;
  }
}

@media (max-width: 767px) {
  .city-chongqing {
    padding-top: var(--mobile-navbar-height, 60px);
  }

  .city-chongqing__shell {
    width: min(100% - 32px, 520px);
  }

  .city-chongqing__hero {
    height: 480px;
  }

  .city-chongqing__hero-image {
    top: 0;
    height: 100%;
    object-fit: cover;
  }

  .city-chongqing__hero-copy {
    padding-top: 110px;
  }

  .city-chongqing__hero-copy h1 {
    font-size: 44px;
  }

  .city-chongqing__hero-copy p {
    font-size: 36px;
    margin: 8px 0 0;
  }

  .city-chongqing__hero-button {
    width: 260px;
    height: 52px;
    margin-top: 48px;
    font-size: 14px;
  }

  .city-chongqing__encounters {
    padding: 64px 0 72px;
  }

  .city-chongqing__section-heading h2 {
    font-size: 34px;
  }

  .city-chongqing__section-subheading {
    font-size: 16px;
    line-height: 1.5;
    margin: 16px auto 36px;
  }

  .city-chongqing__encounter-grid {
    grid-template-columns: 1fr;
    row-gap: 36px;
  }

  .city-chongqing__encounter-image-wrapper {
    height: 220px;
  }

  .city-chongqing__encounter-tag,
  .city-chongqing__encounter-title {
    font-size: 18px;
  }

  .city-chongqing__encounter-desc {
    font-size: 14px;
  }

  .city-chongqing__cta {
    height: 420px;
  }

  .city-chongqing__cta-word {
    font-size: 72px;
    right: 2%;
    bottom: 20px;
  }

  .city-chongqing__cta-content h2 {
    font-size: 38px;
  }

  .city-chongqing__cta-button {
    width: 210px;
    height: 52px;
    margin-top: 30px;
    font-size: 15px;
  }
}
</style>
