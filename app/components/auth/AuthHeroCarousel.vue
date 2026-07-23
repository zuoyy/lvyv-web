<template>
  <section class="auth-hero">
    <div class="carousel-container">
      <div class="carousel-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div v-for="(image, index) in images" :key="index" class="carousel-slide">
          <img
            :src="image.url"
            :alt="image.alt || 'Beautiful landscape'"
            class="auth-hero-image"
            loading="eager"
            decoding="sync"
            @error="onImageError(index)"
          >
        </div>
      </div>

      <!-- Logo overlay -->
      <div class="carousel-logo-overlay">
        <img src="/images/auth/carousel-logo.svg" alt="Lvyv" class="carousel-logo">
      </div>

      <!-- Skip button -->
      <button
        v-if="images.length > 1"
        class="carousel-skip-btn"
        @click="nextSlide"
        aria-label="Skip to next slide"
      >
        <img src="/images/auth/carousel-skip.svg" alt="Skip" class="carousel-skip-icon">
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

interface CarouselImage {
  url: string
  alt?: string
}

interface Props {
  images?: CarouselImage[]
  autoplay?: boolean
  interval?: number
}

const props = withDefaults(defineProps<Props>(), {
  images: () => [
    { url: '/images/auth/hero-signin.png', alt: 'Beautiful landscape' }
  ],
  autoplay: true,
  interval: 5000
})

const currentIndex = ref(0)
const isPlaying = ref(props.autoplay)
let autoplayTimer: ReturnType<typeof setInterval> | null = null

const startAutoplay = () => {
  if (autoplayTimer) clearInterval(autoplayTimer)
  if (props.images.length <= 1) return
  autoplayTimer = setInterval(() => {
    nextSlide()
  }, props.interval)
}

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

const nextSlide = () => {
  if (props.images.length <= 1) return
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

const onImageError = (index: number) => {
  console.error('Carousel image failed to load:', props.images[index]?.url)
}

watch(() => props.images, () => {
  currentIndex.value = 0
  if (isPlaying.value) {
    startAutoplay()
  }
}, { deep: true })

onMounted(() => {
  if (isPlaying.value && props.images.length > 1) {
    startAutoplay()
  }
})

onBeforeUnmount(() => {
  stopAutoplay()
})
</script>

<style scoped>
.carousel-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.6s ease-in-out;
}

.carousel-slide {
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  position: relative;
}

.carousel-slide img {
  width: 100%;
  height: 100%;
  object-fit: fill;
}

/* Logo overlay: 298×102px centered */
.carousel-logo-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  pointer-events: none;
}

.carousel-logo {
  width: 298px;
  height: 102px;
  object-fit: contain;
}

/* Skip button: 106×31px at bottom center */
.carousel-skip-btn {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  transition: opacity 0.2s;
}

.carousel-skip-btn:hover {
  opacity: 0.85;
}

.carousel-skip-icon {
  width: 106px;
  height: 31px;
  display: block;
}

@media (max-width: 900px) {
  .carousel-logo {
    width: 200px;
    height: 68px;
  }

  .carousel-skip-btn {
    bottom: 20px;
  }

  .carousel-skip-icon {
    width: 80px;
    height: 23px;
  }
}

@media (max-width: 600px) {
  .carousel-logo {
    width: 160px;
    height: 55px;
  }

  .carousel-skip-btn {
    bottom: 16px;
  }

  .carousel-skip-icon {
    width: 70px;
    height: 20px;
  }
}
</style>

<style>
/* Global: force auth layout dimensions on desktop (901px+) to prevent CSS conflicts */
@media (min-width: 901px) {
  .auth-layout-authentication {
    width: 100% !important;
  }

  .auth-shell {
    width: 529px !important;
    min-width: 529px !important;
    flex: 0 0 529px !important;
  }

  .auth-hero {
    width: 766px !important;
    min-width: 766px !important;
    flex: 0 0 766px !important;
    height: 750px !important;
    margin-left: 50px !important;
  }
  .carousel-slide{
    min-width: 766px !important;
  }
}
</style>
