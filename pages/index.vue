<template>
  <div>
    <!-- Hero Section -->
    <section class="hero-section" id="hero">
      <div class="hero-overlay"></div>
      <div class="hero-bg" :class="{ 'active': activeBg === 0 }" style="background-image: url('/images/home/hero-bg.png');"></div>
      <div class="hero-bg" :class="{ 'active': activeBg === 1 }" style="background-image: url('/images/home/hero-bg-2.png');"></div>
      <div class="hero-content">
        <h1 class="sr-only">Meet China, Not Just Visit It.</h1>
        <div class="hero-title-art" aria-hidden="true">
          <img src="/images/home/hero-title-line-1.svg" alt="">
          <img src="/images/home/hero-title-line-2.svg" alt="">
        </div>
        <p class="hero-subtitle">
          The First Friend in China. Discover real people, hidden stories,<br>and unforgettable journeys through authentic encounters.
        </p>

        <div class="hero-cta-group">
          <a href="#why-lvyv" class="btn btn-lime">Start Your Journey <img src="/images/common/arrow-right.svg" alt="Arrow" class="hero-btn-arrow"></a>
          <a href="#how-it-works" class="btn btn-outline-white">Watch Stories <img src="/images/common/arrow-right-contained.svg" alt="Arrow Contained" class="hero-btn-arrow-contained"></a>
        </div>
      </div>

      <!-- Carousel Indicators / Dots -->
      <div class="hero-carousel-dots">
        <span class="dot" :class="{ 'active': activeBg === 0 }" @click="setBg(0)"></span>
        <span class="dot" :class="{ 'active': activeBg === 1 }" @click="setBg(1)"></span>
      </div>
    </section>

    <!-- Stats Bar -->
    <section class="stats-section">
      <div class="container stats-grid">
        <div class="stat-card">
          <h3 class="stat-number">300 <span class="plus">+</span></h3>
          <p class="stat-title">CURATED EXPERIENCES</p>
          <p class="stat-desc">Authentic local experiences across China.</p>
        </div>
        <div class="stat-card">
          <h3 class="stat-number">100 <span class="plus">+</span></h3>
          <p class="stat-title">TRUSTED LOCAL PARTNERS</p>
          <p class="stat-desc">Creators, cafés, workshops and cultural communities.</p>
        </div>
        <div class="stat-card">
          <h3 class="stat-number">4.9 <img src="/images/common/star-filled.svg" alt="Star" class="stat-star-icon"></h3>
          <p class="stat-title">GUEST SATISFACTION</p>
          <p class="stat-desc">Personalized journeys with exceptional service.</p>
        </div>
      </div>
    </section>

    <!-- Why Lvyv Section -->
    <section class="why-lvyv-section" id="why-lvyv">
      <div class="container">
        <div class="why-header">
          <h2><span class="section-title-primary">Why Lvyv</span><span class="section-title-secondary"> ｜ Travel changes when people meet.</span></h2>
          <p class="subtitle-text">LVYV connects travelers with locals and fellow explorers through real stories, shared missions, and genuine encounters. It’s not just a trip, it’s a connection that stays with you.</p>
        </div>

        <div class="cards-grid">
          <!-- Video Card 1 -->
          <div class="video-card">
            <div class="card-img-wrapper" style="background-image: url('/images/home/meet-people.png');">
              <span class="video-badge">Meet</span>
              <div class="play-btn-circle">
                <i class="fa-solid fa-play"></i>
              </div>
              <div class="card-info">
                <h3>Meet People</h3>
                <p>Connect with locals and fellow travelers through authentic experiences.</p>
                <div class="info-footer">
                  <span class="learn-more">
                    <img src="/images/common/arrow-up-right.svg" class="icon-arrow-link" alt="Arrow">
                    Learn more
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Video Card 2 -->
          <div class="video-card">
            <div class="card-img-wrapper" style="background-image: url('/images/home/meet-stories.png');">
              <span class="video-badge">Meet</span>
              <div class="play-btn-circle">
                <i class="fa-solid fa-play"></i>
              </div>
              <div class="card-info">
                <h3>Meet Stories</h3>
                <p>Discover hidden places, local traditions and stories beyond guidebooks.</p>
                <div class="info-footer">
                  <span class="learn-more">
                    <img src="/images/common/arrow-up-right.svg" class="icon-arrow-link" alt="Arrow">
                    Learn more
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Video Card 3 -->
          <div class="video-card">
            <div class="card-img-wrapper" style="background-image: url('/images/home/meet-yourself.png');">
              <span class="video-badge">Meet</span>
              <div class="play-btn-circle">
                <i class="fa-solid fa-play"></i>
              </div>
              <div class="card-info">
                <h3>Meet Yourself</h3>
                <p>Every encounter changes the way you see the world—and yourself.</p>
                <div class="info-footer">
                  <span class="learn-more">
                    <img src="/images/common/arrow-up-right.svg" class="icon-arrow-link" alt="Arrow">
                    Learn more
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works-section" id="how-it-works">
      <div class="container">
        <div class="section-title-wrap">
          <h2><span class="section-title-primary">How it works</span><span class="section-title-secondary"> ｜ Simple steps to unforgettable journeys.</span></h2>
          <p class="subtitle-text">LVYV connects you with local people, authentic experiences, and meaningful stories that stay with you long after you leave.</p>
        </div>

        <div class="steps-container">
          <!-- Figma 原版完整连线 SVG（含灰色圆底 + 渐变波浪线一体） -->
          <img src="/images/home/how-connector-full.svg" alt="" class="steps-connector-art" aria-hidden="true">

          <div class="steps-grid">
            <!-- Step 1 -->
            <div class="step-node">
              <div class="step-badge-number">01</div>
              <img src="/images/home/how-icon-city.svg" alt="" class="step-icon">
              <h4>Choose a City</h4>
              <p>Start where your curiosity leads.</p>
              <div class="step-photo" style="background-image: url('/images/home/step1.png');"></div>
            </div>
            <!-- Step 2 -->
            <div class="step-node">
              <div class="step-badge-number">02</div>
              <img src="/images/home/how-icon-mission.svg" alt="" class="step-icon">
              <h4>Get Your Mission</h4>
              <p>Complete curated local challenges designed just for you.</p>
              <div class="step-photo" style="background-image: url('/images/home/step2.png');"></div>
            </div>
            <!-- Step 3 -->
            <div class="step-node">
              <div class="step-badge-number">03</div>
              <img src="/images/home/how-icon-meet.svg" alt="" class="step-icon">
              <h4>Meet Someone</h4>
              <p>Connect with locals and fellow travelers through shared experiences.</p>
              <div class="step-photo" style="background-image: url('/images/home/step3.png');"></div>
            </div>
            <!-- Step 4 -->
            <div class="step-node">
              <div class="step-badge-number">04</div>
              <img src="/images/home/how-icon-story.svg" alt="" class="step-icon">
              <h4>Unlock Stories</h4>
              <p>Explore places and moments that guidebooks never tell you.</p>
              <div class="step-photo" style="background-image: url('/images/home/step4.png');"></div>
            </div>
            <!-- Step 5 -->
            <div class="step-node">
              <div class="step-badge-number">05</div>
              <img src="/images/home/how-icon-camera.svg" alt="" class="step-icon">
              <h4>Stay Connected</h4>
              <p>Collect memories, friendships, and stories you'll carry home.</p>
              <div class="step-photo" style="background-image: url('/images/home/step5.png');"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Explore China Section -->
    <section class="explore-china-section">
      <div class="container">
        <div class="explore-header">
          <div class="title-left">
            <h2 class="section-title-primary">Explore China</h2>
            <div class="heading-line"></div>
            <p class="subtitle-text">Choose a city, start a new story.</p>
          </div>
          <div class="carousel-controls">
            <button class="carousel-btn btn-prev" aria-label="Previous Slide" @click="prevSlide"><i class="fa-solid fa-chevron-left"></i></button>
            <button class="carousel-btn btn-next" aria-label="Next Slide" @click="nextSlide"><i class="fa-solid fa-chevron-right"></i></button>
          </div>
        </div>

        <div class="carousel-wrapper">
          <div class="carousel-track" ref="carouselTrack" :style="{ transform: `translateX(-${carouselOffset}px)`, transition: 'transform 0.5s ease' }">
            <!-- Slide 1 -->
            <div class="carousel-slide">
              <div class="explore-card" style="background-image: url('/images/home/explore-xian.png');">
                <div class="card-gradient"></div>
                <div class="explore-info">
                  <h3>Meet History</h3>
                  <span class="location"><img src="/images/common/location.svg" class="icon-location" alt="Location"> Xi'an</span>
                </div>
              </div>
            </div>
            <!-- Slide 2 -->
            <div class="carousel-slide">
              <div class="explore-card" style="background-image: url('/images/home/explore-chengdu.png');">
                <div class="card-gradient"></div>
                <div class="explore-info">
                  <h3>Meet Lifestyle</h3>
                  <span class="location"><img src="/images/common/location.svg" class="icon-location" alt="Location"> Chengdu</span>
                </div>
              </div>
            </div>
            <!-- Slide 3 -->
            <div class="carousel-slide">
              <div class="explore-card" style="background-image: url('/images/home/explore-beijing.png');">
                <div class="card-gradient"></div>
                <div class="explore-info">
                  <h3>Meet Tradition</h3>
                  <span class="location"><img src="/images/common/location.svg" class="icon-location" alt="Location"> Beijing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Wish Pool Section -->
    <section class="wish-pool-section" id="wish-pool">
      <div class="wish-header text-center">
        <img src="/images/home/wish-icon-globe.svg" alt="Globe Icon" class="wish-globe-icon">
        <img src="/images/home/wish-icon-corner.svg" alt="Star Icon" class="wish-corner-icon">
        <h2 class="wish-title">Wish Pool</h2>
        <p class="wish-subtitle">What do you wish to experience in China?</p>
      </div>

      <!-- Gamified floating bubble cloud layout with dual scrolling marquee tracks -->
      <div class="wish-cloud" id="wishCloud">
        <!-- Row 1: Scrolling Left -->
        <div class="wish-row row-left">
          <div class="wish-row-track" id="trackRow1">
            <div class="track-group primary">
              <div v-for="(wish, idx) in row1Wishes" :key="'r1-p-' + idx" :class="['wish-bubble', getStyleClass(wish.style)]">
                <p class="bubble-text">"{{ wish.text }}"</p>
                <span class="bubble-passenger">{{ wish.passenger }}</span>
              </div>
            </div>
            <div class="track-group clone">
              <div v-for="(wish, idx) in row1Wishes" :key="'r1-c-' + idx" :class="['wish-bubble', getStyleClass(wish.style)]">
                <p class="bubble-text">"{{ wish.text }}"</p>
                <span class="bubble-passenger">{{ wish.passenger }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Row 2: Scrolling Right -->
        <div class="wish-row row-right">
          <div class="wish-row-track" id="trackRow2">
            <div class="track-group primary">
              <div v-for="(wish, idx) in row2Wishes" :key="'r2-p-' + idx" :class="['wish-bubble', getStyleClass(wish.style)]">
                <p class="bubble-text">"{{ wish.text }}"</p>
                <span class="bubble-passenger">{{ wish.passenger }}</span>
              </div>
            </div>
            <div class="track-group clone">
              <div v-for="(wish, idx) in row2Wishes" :key="'r2-c-' + idx" :class="['wish-bubble', getStyleClass(wish.style)]">
                <p class="bubble-text">"{{ wish.text }}"</p>
                <span class="bubble-passenger">{{ wish.passenger }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="wish-action-trigger text-center">
        <button class="btn btn-make-wish" id="makeWishBtn">
          <span>Make a Wish</span>
          <img src="/images/home/cursor-wish.svg" alt="Cursor Icon" class="wish-btn-cursor">
        </button>
      </div>

    </section>

    <!-- About Friends & Creators Section -->
    <section class="about-us-section" id="about-us">
      <div class="container about-grid">
        <div class="friends-intro-left">
          <h2 class="friends-title">We're Your<br><span>First Friends in China.</span></h2>
        </div>

        <div class="buddy-features-right">
          <div class="feature-quote-item">
            <span class="quote-author">Alex</span>
            <span class="quote-text">"Every great journey begins with one conversation."</span>
          </div>
          <div class="feature-quote-item">
            <span class="quote-author">Summer</span>
            <span class="quote-text">"I'll help you discover a China beyond the guidebooks."</span>
          </div>
          <div class="feature-quote-item">
            <span class="quote-author">City Buddy · Xi'an</span>
            <span class="quote-text">"Ask me where locals go after sunset."</span>
          </div>
          <div class="feature-quote-item">
            <span class="quote-author">Creator · Chengdu</span>
            <span class="quote-text">"The best stories aren't found on maps."</span>
          </div>
        </div>
      </div>

      <!-- Built by explorers subsection -->
      <div class="container explorers-block">
        <div class="explorers-grid">
          <div class="explorers-visual-left">
            <div class="double-pill-outer">
              <div class="double-pill-middle">
                <div class="double-pill-inner">
                  <div class="pill-frame-image" style="background-image: url('/images/home/explorers-wall.png');"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="explorers-content-right">
            <h3>Built by explorers.</h3>
            <p>
              We created LVYV because we believe the best memories don't come from checking off landmarks. They come from conversations, shared meals, unexpected friendships, and moments that can't be planned.<br><br>
              Our mission is simple:<br>
              <strong>Help every traveler meet the real China - and someone they'll never forget.</strong>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Signup & Slogan Section -->
    <section class="newsletter-section">
      <div class="container newsletter-grid">
        <div class="newsletter-signup">
          <h3>Start your journey<br>with LVYV</h3>
          <p>Subscribe for travel inspiration,<br>updates, and special offers.</p>
          <div class="signup-capsule">
            <form class="signup-form-inline" id="newsletterForm" @submit.prevent="handleSubscribe">
              <input type="email" v-model="newsletterEmail" placeholder="Enter your email" required class="input-email-capsule">
              <button type="submit" class="btn-subscribe-capsule">Subscribe</button>
            </form>
          </div>
        </div>

        <div class="slogan-visual">
          <img src="/images/common/footer-slogan.svg" alt="Go, meet someone." class="slogan-text">
          <div class="social-links">
            <a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook"></i></a>
            <a href="#" aria-label="Pinterest"><i class="fa-brands fa-pinterest"></i></a>
            <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="#" aria-label="Twitter"><i class="fa-brands fa-twitter"></i></a>
          </div>
        </div>
      </div>
    </section>


  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// ==========================================
// SEO Optimization Meta Info
// ==========================================
useSeoMeta({
  title: 'Lvyv 旅遇 - Meet China, Not Just Visit It',
  description: 'The First Friend in China. Discover real people, hidden stories, and unforgettable journeys through authentic encounters.',
  ogTitle: 'Lvyv 旅遇 - Meet China, Not Just Visit It',
  ogDescription: 'The First Friend in China. Discover real people, hidden stories, and unforgettable journeys through authentic encounters.',
  ogImage: '/images/common/logo.png',
  twitterCard: 'summary_large_image'
})

// ==========================================
// 1. Explore China Carousel Slider
// ==========================================
const carouselTrack = ref(null)
const carouselOffset = ref(0)
let currentSlideIndex = 0

const getSlideWidth = () => {
  if (!carouselTrack.value) return 0
  const slides = carouselTrack.value.querySelectorAll('.carousel-slide')
  if (slides.length === 0) return 0
  
  // Calculate gap
  const gap = parseFloat(window.getComputedStyle(carouselTrack.value).columnGap) || 0
  return slides[0].getBoundingClientRect().width + gap
}

const getMaxIndex = () => {
  if (!carouselTrack.value) return 0
  const slides = carouselTrack.value.querySelectorAll('.carousel-slide')
  const containerWidth = carouselTrack.value.parentElement.getBoundingClientRect().width
  const slideWidth = getSlideWidth()
  if (slideWidth === 0) return 0

  const itemsInView = Math.floor(containerWidth / slideWidth)
  if (itemsInView >= slides.length) return 0
  return slides.length - (itemsInView || 1)
}

const nextSlide = () => {
  const maxIndex = getMaxIndex()
  if (currentSlideIndex < maxIndex) {
    currentSlideIndex++
  } else {
    currentSlideIndex = 0 // loop
  }
  carouselOffset.value = currentSlideIndex * getSlideWidth()
}

const prevSlide = () => {
  const maxIndex = getMaxIndex()
  if (currentSlideIndex > 0) {
    currentSlideIndex--
  } else {
    currentSlideIndex = maxIndex // loop to end
  }
  carouselOffset.value = currentSlideIndex * getSlideWidth()
}

const handleResize = () => {
  currentSlideIndex = 0
  carouselOffset.value = 0
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// ==========================================
// 2. Wish Pool Bubble Cloud Data & Methods
// ==========================================
const row1Wishes = ref([
  { text: "I wish to celebrate Mid-Autumn Festival with locals.", passenger: "Mia · Canada", style: "forest" },
  { text: "I wish someone could show me their favorite café.", passenger: "Lucas · France", style: "outline" },
  { text: "I wish to learn traditional Chinese calligraphy.", passenger: "Sophie · Germany", style: "lime" }
])

const row2Wishes = ref([
  { text: "I wish to learn Chinese calligraphy from a master.", passenger: "Emma · UK", style: "outline" },
  { text: "I wish to learn Tai Chi in a local park at sunrise.", passenger: "Mark · USA", style: "forest" },
  { text: "I wish to cook authentic Sichuan dishes in Chengdu.", passenger: "Alex · Canada", style: "lime" }
])

const getStyleClass = (style) => {
  if (style === 'lime') return 'style-lime'
  if (style === 'forest') return 'style-forest'
  return 'style-outline'
}



// ==========================================
// 4. Newsletter Signup Action
// ==========================================
const newsletterEmail = ref('')
const handleSubscribe = () => {
  if (!newsletterEmail.value) return
  alert(`Thank you for subscribing, ${newsletterEmail.value}!`)
  newsletterEmail.value = ''
}

// ==========================================
// 5. Hero Background Carousel Action
// ==========================================
const activeBg = ref(0)
let bgTimer = null

const startBgTimer = () => {
  if (bgTimer) clearInterval(bgTimer)
  bgTimer = setInterval(() => {
    activeBg.value = activeBg.value === 0 ? 1 : 0
  }, 6000)
}

const setBg = (index) => {
  activeBg.value = index
  startBgTimer() // Reset and restart 6s timer on click
}

onMounted(() => {
  startBgTimer()
})

onUnmounted(() => {
  if (bgTimer) clearInterval(bgTimer)
})
</script>
