<template>
  <main class="wish-landing" aria-labelledby="wish-title">
    <div class="wish-landing__backdrop" aria-hidden="true">
      <img src="/images/wish/wish-hero.webp" alt="">
    </div>

    <div class="wish-landing__content">
      <h1 id="wish-title" class="wish-landing__title">
        <span>Make</span>
        <span><small>a</small> <em>Wish.</em></span>
      </h1>

      <p class="wish-landing__intro">
        <span>Tell us your dream China trip.</span>
        <span>A real human will handcraft it for you</span>
      </p>

      <div class="wish-landing__countdown" role="timer" aria-label="Time remaining">
        <span class="wish-landing__countdown-value">{{ countdownParts.hours }}</span>
        <span class="wish-landing__countdown-separator" aria-hidden="true">:</span>
        <span class="wish-landing__countdown-value">{{ countdownParts.minutes }}</span>
        <span class="wish-landing__countdown-separator" aria-hidden="true">:</span>
        <span class="wish-landing__countdown-value">{{ countdownParts.seconds }}</span>
      </div>

      <NuxtLink to="/wish/my?create=1" class="wish-landing__cta">
        <span>Start Your Wish</span>
        <img src="/images/wish/arrow-right.svg" alt="" aria-hidden="true">
      </NuxtLink>

      <p class="wish-landing__existing">
        <span>Already have a wish?</span>
        <NuxtLink to="/wish/my">View My Wishes<span aria-hidden="true">→</span></NuxtLink>
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
const countdownSeconds = ref(23 * 60 * 60 + 59 * 60 + 59)
let countdownTimer: ReturnType<typeof setInterval> | undefined

const countdownParts = computed(() => {
  const hours = Math.floor(countdownSeconds.value / 3600)
  const minutes = Math.floor((countdownSeconds.value % 3600) / 60)
  const seconds = countdownSeconds.value % 60
  return {
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  }
})

onMounted(() => {
  countdownTimer = setInterval(() => {
    if (countdownSeconds.value > 0) countdownSeconds.value -= 1
  }, 1000)
})

onBeforeUnmount(() => {
  if (countdownTimer) clearInterval(countdownTimer)
})

useLvyvSeo({
  title: 'Make a Wish - Lvyv Travel',
  description: 'Tell us your dream China trip and a real human will handcraft it for you.',
  path: '/wish',
  image: '/images/wish/wish-hero.webp',
})

useHead({
  link: [
    {
      rel: 'preload',
      as: 'image',
      type: 'image/webp',
      href: '/images/wish/wish-hero.webp',
      fetchpriority: 'high',
    },
    {
      rel: 'preload',
      as: 'image',
      type: 'image/svg+xml',
      href: '/images/wish/logo-main.svg',
      fetchpriority: 'high',
    },
    {
      rel: 'preload',
      as: 'image',
      type: 'image/svg+xml',
      href: '/images/wish/logo-accent.svg',
      fetchpriority: 'high',
    },
  ],
})
</script>

<style scoped>
.wish-landing {
  position: relative;
  height: 100svh;
  min-height: 620px;
  overflow: hidden;
  isolation: isolate;
  background: #111e42;
}

.wish-landing__backdrop,
.wish-landing__backdrop img {
  position: absolute;
  inset: 0;
}

.wish-landing__backdrop {
  z-index: -1;
  overflow: hidden;
}

.wish-landing__backdrop img {
  top: -8.23%;
  left: -5.21%;
  width: 105.75%;
  height: auto;
  min-height: 130.15%;
  max-width: none;
  object-fit: cover;
}

.wish-landing__backdrop::after {
  position: absolute;
  inset: 0;
  background: rgba(9, 19, 43, .08);
  content: '';
}

.wish-landing__content {
  position: absolute;
  inset: 0;
  color: #fff;
  text-align: center;
}

.wish-landing__title {
  position: absolute;
  top: 134px;
  left: 50%;
  width: 620px;
  margin: 0;
  transform: translateX(-50%);
  font-family: 'Didot', 'Playfair Display', Georgia, serif;
  font-size: 128px;
  font-weight: 400;
  line-height: .67;
  letter-spacing: 0;
}

.wish-landing__title > span {
  display: block;
  white-space: nowrap;
}

.wish-landing__title > span + span {
  margin-top: 20px;
  margin-left: -8px;
}

.wish-landing__title small,
.wish-landing__title em {
  font: inherit;
}

.wish-landing__title small {
  font-size: .72em;
}

.wish-landing__title em {
  color: #cff380;
  font-style: normal;
}

.wish-landing__intro {
  position: absolute;
  top: 397px;
  left: 50%;
  display: flex;
  flex-direction: column;
  width: 726px;
  margin: 0;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, .7);
  font-family: 'Inter', sans-serif;
  font-size: 26px;
  font-weight: 400;
  line-height: 36px;
}

.wish-landing__countdown {
  position: absolute;
  top: 497px;
  left: calc(50% - 111px);
  display: flex;
  width: 260px;
  height: 72px;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 10px;
  border-top: .5px solid #8b8b8b;
  border-bottom: .5px solid #8b8b8b;
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 24px;
  text-align: center;
}

.wish-landing__countdown-value,
.wish-landing__countdown-separator {
  display: flex;
  height: 24px;
  align-items: center;
  justify-content: center;
}

.wish-landing__countdown-value {
  width: 37px;
}

.wish-landing__countdown-value:first-child {
  width: 38px;
}

.wish-landing__countdown-separator {
  width: 8px;
}

.wish-landing__cta {
  position: absolute;
  top: 599px;
  left: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 400px;
  height: 60px;
  border-radius: 10px;
  background: #cff380;
  color: #203d33;
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 500;
  text-decoration: none;
  transform: translateX(-50%);
  transition: background-color .2s ease, transform .2s ease;
}

.wish-landing__cta:hover {
  background: #dcff93;
  transform: translate(-50%, -2px);
}

.wish-landing__cta img {
  width: 18px;
  height: 16px;
}

.wish-landing__existing {
  position: absolute;
  top: 675px;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: 726px;
  margin: 0;
  transform: translateX(-50%);
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  line-height: 36px;
}

.wish-landing__existing a {
  color: #cff380;
  text-decoration: none;
}

.wish-landing__existing a span {
  margin-left: 2px;
}

@media (max-height: 720px) and (min-width: 768px) {
  .wish-landing__title {
    top: 112px;
    font-size: 106px;
  }

  .wish-landing__intro {
    top: 340px;
    font-size: 22px;
    line-height: 31px;
  }

  .wish-landing__countdown {
    top: 420px;
  }

  .wish-landing__cta {
    top: 505px;
  }

  .wish-landing__existing {
    top: 580px;
  }
}

@media (max-width: 767px) {
  .wish-landing {
    min-height: 620px;
  }

  .wish-landing__backdrop img {
    top: 0;
    left: 50%;
    width: auto;
    height: 100%;
    min-height: 0;
    transform: translateX(-50%);
  }

  .wish-landing__title {
    top: 145px;
    width: calc(100% - 32px);
    font-size: 72px;
    line-height: .72;
  }

  .wish-landing__title > span + span {
    margin-top: 18px;
  }

  .wish-landing__intro {
    top: 340px;
    width: calc(100% - 36px);
    font-size: 19px;
    line-height: 29px;
  }

  .wish-landing__countdown {
    top: 55%;
    left: 50%;
    transform: translateX(-50%);
  }

  .wish-landing__cta {
    top: auto;
    right: 20px;
    bottom: 116px;
    left: 20px;
    width: auto;
    transform: none;
  }

  .wish-landing__cta:hover {
    transform: translateY(-2px);
  }

  .wish-landing__existing {
    top: auto;
    right: 16px;
    bottom: 59px;
    left: 16px;
    width: auto;
    font-size: 14px;
    transform: none;
  }
}

@media (max-width: 380px) {
  .wish-landing__title {
    top: 135px;
    font-size: 62px;
  }

  .wish-landing__intro {
    top: 305px;
    font-size: 17px;
  }

  .wish-landing__countdown {
    top: 56%;
  }
}
</style>
