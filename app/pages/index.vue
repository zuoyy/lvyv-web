<template>
  <main class="home-v2">
    <section id="hero" class="hero-v2" aria-labelledby="home-title">
      <div
        v-for="slide in requestedHeroSlides"
        :key="slide.id"
        class="hero-v2__slide"
        :class="{ 'is-active': activeBg === slide.index }"
      >
        <picture>
          <source media="(max-width: 767px)" type="image/webp" :srcset="slide.mobileWebpSrcset">
          <source media="(min-width: 1920px)" type="image/webp" :srcset="slide.wideWebpSrcset" sizes="100vw">
          <source type="image/webp" :srcset="slide.webpSrcset" sizes="100vw">
          <img
            :ref="element => setHeroImageRef(element, slide.index)"
            :src="slide.fallback"
            :alt="slide.alt"
            :width="slide.width"
            :height="slide.height"
            decoding="async"
            loading="eager"
            :fetchpriority="slide.index === 0 ? 'high' : 'low'"
            @load="handleHeroLoad(slide.index, $event)"
            @error="handleHeroError(slide.index)"
          >
        </picture>
      </div>
      <div class="hero-v2__content">
        <h1 id="home-title" class="sr-only">Go, meet someone.</h1>
        <img
          class="hero-v2__title"
          src="/images/home/banner-text.svg"
          alt="Go, meet someone."
          width="723"
          height="171"
        >
        <p>"Your handcrafted China encounter starts here"</p>

        <div class="hero-v2__actions">
          <NuxtLink to="/wish" class="home-button home-button--primary">
            <span>Start Your Journey</span>
            <img src="/images/common/arrow-right.svg" alt="" aria-hidden="true">
          </NuxtLink>
          <NuxtLink to="/encounters" class="home-button home-button--outline">
            <span>Watch Stories</span>
            <img src="/images/common/arrow-right-contained.svg" alt="" aria-hidden="true">
          </NuxtLink>
        </div>
      </div>

      <div class="hero-v2__dots" aria-label="Banner slides">
        <button
          v-for="slide in homeHeroSlides"
          :key="slide.id"
          type="button"
          :class="{ 'is-active': activeBg === slide.index }"
          :aria-label="`Show banner ${slide.index + 1}`"
          :aria-current="activeBg === slide.index ? 'true' : undefined"
          @click="setBg(slide.index)"
        />
      </div>
    </section>

    <section class="audience-section" aria-labelledby="audience-title">
      <div class="home-shell">
        <header class="audience-section__header">
          <p class="home-eyebrow">For the curious</p>
          <h2 id="audience-title">Who is this for?</h2>
          <p class="audience-section__intro">
            For young explorers (18-36) who don't want packaged tours.<br>
            You don't want to tick off landmarks.<br>
            You want real encounters with people, stories, and a China you won't find on Google.
          </p>
        </header>

        <div class="audience-grid">
          <article v-for="item in audienceCards" :key="item.title" class="audience-card">
            <img :src="item.image" :alt="item.alt" width="410" height="420" loading="lazy" decoding="async">
            <div class="audience-card__shade" />
            <div class="audience-card__content">
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section id="how-it-works" class="journey-section" aria-labelledby="journey-title">
      <div class="home-shell journey-section__layout">
        <div class="journey-heading">
          <h2 id="journey-title">
            <span>How it</span>
            <strong>works</strong>
          </h2>
          <p><b>3</b> steps to your encounter</p>
        </div>

        <img
          class="journey-section__art"
          src="/images/home/bumps-up-figma.png"
          alt=""
          width="500"
          height="680"
          loading="lazy"
          aria-hidden="true"
        >

        <div class="journey-steps">
          <NuxtLink v-for="step in journeySteps" :key="step.title" :to="step.to" class="journey-step">
            <div class="journey-step__title">
              <h3>{{ step.title }}</h3>
              <img src="/images/home/journey-arrow.svg" alt="" aria-hidden="true">
            </div>
            <p>{{ step.description }}</p>
          </NuxtLink>
        </div>
      </div>

      <NuxtLink to="/wish" class="home-button home-button--primary journey-section__button">
        <svg viewBox="0 0 30 30" fill="none" aria-hidden="true" focusable="false">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M27.0886 2.04903C26.9267 2.117 26.8345 2.2653 26.6236 2.79704L26.4553 3.22108L25.9235 3.22184C25.4439 3.22249 25.3792 3.23585 25.2643 3.35813C25.0289 3.60874 25.1677 4.09055 25.5046 4.19257C25.5763 4.2143 25.7565 4.28344 25.9051 4.34626L26.1753 4.4604L26.2077 4.88936C26.2582 5.55768 26.462 5.83354 26.8503 5.7593C27.0626 5.71876 27.1572 5.59835 27.3496 5.12409C27.5064 4.73755 27.5237 4.71768 27.6882 4.73608C27.7835 4.74669 28.0051 4.73755 28.1807 4.71575C28.4343 4.68423 28.5395 4.63635 28.6934 4.48249C28.805 4.37087 28.8869 4.22936 28.8869 4.14809C28.8869 3.92807 28.5579 3.65913 28.1252 3.52548C27.9019 3.45651 27.7514 3.3787 27.7614 3.33733C27.7708 3.29854 27.794 3.06464 27.8131 2.81749C27.8451 2.40188 27.8373 2.35624 27.7081 2.20934C27.5545 2.03456 27.2875 1.96542 27.0886 2.04903ZM19.5113 2.29969C19.2004 2.51128 19.089 2.70458 19.0839 3.04073C19.0763 3.54352 19.4052 3.87159 19.9271 3.8819C20.3339 3.88993 20.5893 3.75704 20.7418 3.45803C20.8943 3.15926 20.8896 2.89735 20.7268 2.61341C20.4803 2.18362 19.9014 2.03421 19.5113 2.29969ZM14.3468 3.48739C14.2614 3.5338 14.1346 3.68919 14.0652 3.83268C13.9566 4.05686 13.9477 4.12647 14.0019 4.32762C14.0912 4.65921 14.3514 4.86317 14.6853 4.86317C15.3094 4.86317 15.6714 4.38335 15.4489 3.85091C15.2843 3.45698 14.7358 3.2761 14.3468 3.48739ZM22.5295 5.09508C22.465 5.12186 22.0102 5.51257 21.5186 5.96321C21.0271 6.41391 20.5481 6.81452 20.4542 6.85343C20.2997 6.91735 20.2367 6.9013 19.7951 6.68549C19.5266 6.55424 19.0036 6.27551 18.633 6.0661C17.8865 5.64428 17.6244 5.58792 17.4264 5.80659C17.2158 6.03938 17.2896 6.32573 17.8765 7.55344L18.419 8.68823L18.289 8.93327C18.1682 9.16102 17.9035 9.50872 17.5289 9.93153C17.4433 10.0282 17.1952 10.3221 16.9777 10.5847C16.6325 11.0013 16.5822 11.0923 16.5822 11.3003C16.5822 11.7257 16.8723 11.7547 18.4487 11.4875C19.1868 11.3623 19.4919 11.3319 19.562 11.3762C19.615 11.4098 19.9089 11.8331 20.215 12.3169C20.9544 13.4854 21.1011 13.6522 21.3895 13.6522C21.6927 13.6522 21.8187 13.4789 21.9079 12.939C21.9468 12.7037 22.0588 12.1737 22.1568 11.7612C22.3022 11.1498 22.3606 10.9945 22.4728 10.921C22.6253 10.821 22.9398 10.7384 24.0166 10.5152C24.7987 10.3532 24.993 10.2569 25.0512 10.0024C25.105 9.76764 24.9686 9.59579 24.5076 9.31706C23.6325 8.78796 23.0307 8.40235 22.9151 8.29647C22.7374 8.13382 22.7553 7.81366 23.0336 6.16964C23.1732 5.3451 23.1735 5.35542 23.0009 5.1828C22.8521 5.03397 22.7308 5.01141 22.5295 5.09508ZM26.9826 7.40632C26.7607 7.50423 26.6313 7.6493 26.5128 7.9329C26.4059 8.18866 26.4363 8.42509 26.6137 8.71712C26.7652 8.96649 26.9971 9.08198 27.3459 9.08169C27.7082 9.08139 27.9665 8.9243 28.1294 8.60503C28.5102 7.85854 27.7525 7.06647 26.9826 7.40632ZM12.2504 7.8368C12.1284 7.93612 11.898 8.65577 11.8957 8.94481C11.8948 9.06176 11.8557 9.07442 11.382 9.11098C10.4539 9.18264 10.2619 9.29116 10.3388 9.70091C10.3811 9.92608 10.5907 10.1002 10.8986 10.1657C11.1786 10.2253 11.4044 10.3473 11.4488 10.463C11.469 10.5159 11.4194 10.7691 11.3384 11.0254C11.1782 11.5325 11.1896 11.7281 11.3871 11.8665C11.6652 12.0613 12.1289 11.8975 12.5348 11.4612C12.613 11.3772 12.697 11.3085 12.7217 11.3085C12.7463 11.3085 12.8888 11.4143 13.0383 11.5437C13.3505 11.8139 13.5965 11.953 13.7623 11.953C13.9277 11.953 14.2385 11.6725 14.2385 11.5232C14.2385 11.4536 14.1554 11.1474 14.054 10.8428C13.9525 10.5382 13.8931 10.2809 13.9221 10.2711C13.9511 10.2614 14.1857 10.115 14.4436 9.946C14.8672 9.66809 14.9139 9.61887 14.9296 9.43348C14.9621 9.04694 14.8678 8.99661 14.0696 8.97452L13.3637 8.95501L13.2021 8.45889C13.1132 8.18602 12.9927 7.91133 12.9341 7.84852C12.7978 7.70227 12.4236 7.69589 12.2504 7.8368ZM17.2561 12.357C17.1594 12.4178 14.9458 14.6062 12.337 17.2201C9.23668 20.3265 7.55363 21.9725 7.47763 21.9725C7.41371 21.9725 7.21267 22.0143 7.03091 22.0653C6.70806 22.1559 6.64572 22.213 4.32834 24.5409C2.79459 26.0816 1.91685 27.0066 1.84472 27.1581C1.66994 27.5253 1.69004 28.029 1.8933 28.3752C2.13119 28.7804 2.45638 28.9718 2.90058 28.9681C3.10584 28.9663 3.3282 28.9253 3.4349 28.8697C3.72769 28.7169 8.25259 24.1642 8.41478 23.8592C8.52916 23.6441 8.55494 23.5085 8.55529 23.121L8.5557 22.6464L12.8769 18.3104C18.2152 12.9539 18.1057 13.0687 18.1057 12.8279C18.1057 12.6891 18.0515 12.5896 17.8964 12.4433C17.6585 12.2189 17.5078 12.1986 17.2561 12.357ZM9.61068 12.9519C9.48711 12.9801 9.31964 13.0918 9.18588 13.2352C8.98806 13.4472 8.96504 13.5042 8.96527 13.7818C8.96562 14.3243 9.32363 14.7063 9.83222 14.7067C10.2775 14.7071 10.6037 14.4464 10.726 13.9923C10.8882 13.3897 10.2602 12.8038 9.61068 12.9519ZM24.6036 13.6095C24.3159 13.8016 24.1879 14.0823 24.2158 14.4598C24.2346 14.7148 24.2732 14.8049 24.4345 14.9714C24.7865 15.3345 25.1834 15.3742 25.6139 15.0893C26.1078 14.7625 26.0639 13.8832 25.538 13.5693C25.3037 13.4294 24.8435 13.4491 24.6036 13.6095ZM20.01 16.1691C19.5389 16.2788 19.3088 16.5716 19.3088 17.0613C19.3088 17.6097 19.65 17.9589 20.1857 17.9589C20.6571 17.9589 21.0134 17.6487 21.0757 17.1843C21.1627 16.5359 20.6267 16.0253 20.01 16.1691Z"
            fill="white"
          />
        </svg>
        <span>Start Your Wish</span>
      </NuxtLink>
    </section>

    <section
      id="curated-encounters"
      class="curated-section"
      :class="{ 'is-in-view': isEncountersInView }"
      aria-labelledby="curated-title"
    >
      <div class="curated-section__stage">
        <header class="curated-section__header">
          <h2 id="curated-title">Curated Encounters</h2>
          <p>Don't know where to start? Pick an encounter.</p>
        </header>

        <div class="encounter-deck">
          <NuxtLink
            to="/wish?city=beijing"
            class="encounter-card encounter-card--beijing"
            aria-label="Explore BEIJING"
          >
            <picture>
              <source type="image/webp" srcset="/images/home/encounter-beijing-582.webp">
              <img
                src="/images/home/encounter-beijing-582.png"
                alt="BEIJING 北京"
                width="278"
                height="389"
                loading="lazy"
                decoding="async"
              >
            </picture>
          </NuxtLink>

          <NuxtLink
            to="/cities/chengdu"
            class="encounter-card encounter-card--chengdu"
            aria-label="Explore CHENGDU"
          >
            <picture>
              <source type="image/webp" srcset="/images/home/encounter-chengdu-582.webp">
              <img
                src="/images/home/encounter-chengdu-582.png"
                alt="CHENGDU 成都"
                width="278"
                height="389"
                loading="lazy"
                decoding="async"
              >
            </picture>
          </NuxtLink>

          <NuxtLink
            to="/cities/xian"
            class="encounter-card encounter-card--xian"
            aria-label="Explore XI'AN"
          >
            <picture>
              <source type="image/webp" srcset="/images/home/encounter-xian-582.webp">
              <img
                src="/images/home/encounter-xian-582.png"
                alt="XI'AN 西安"
                width="278"
                height="389"
                loading="lazy"
                decoding="async"
              >
            </picture>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section id="wish-pool" class="home-wish-section" aria-labelledby="wish-pool-title">
      <div class="home-wish-section__stage">
        <header class="home-wish-section__header">
          <h2 id="wish-pool-title" class="sr-only">Wish Pool</h2>
          <div class="home-wish-section__ellipse" aria-hidden="true" />
          <p class="home-wish-section__title" aria-hidden="true">Wish Pool</p>
          <p class="home-wish-section__subtitle" aria-hidden="true">What do you wish to experience in China?</p>
          <img class="home-wish-section__spark" src="/images/home/wish-icon-corner.svg" alt="" width="35" height="39" aria-hidden="true">
          <img class="home-wish-section__globe" src="/images/home/wish-icon-globe.svg" alt="" width="53" height="53" aria-hidden="true">
        </header>

        <div class="home-wish-cloud" aria-label="Wishes shared by travelers">
          <div v-for="(row, rowIndex) in wishRows" :key="rowIndex" class="home-wish-row" :class="`home-wish-row--${rowIndex === 0 ? 'left' : 'right'}`">
            <div class="home-wish-row__track">
              <div v-for="copy in 2" :key="copy" class="home-wish-row__group" :aria-hidden="copy === 2 ? 'true' : undefined">
                <article v-for="wish in row" :key="`${copy}-${wish.id}`" class="home-wish-bubble" :class="`home-wish-bubble--${wish.style}`">
                  <p>{{ wish.text }}</p>
                  <span>{{ wish.passenger }}</span>
                </article>
              </div>
            </div>
          </div>
        </div>

        <NuxtLink to="/wish" class="home-wish-action">
          <span>Make a Wish</span>
          <img src="/images/home/cursor-wish.svg" alt="" width="32" height="32" aria-hidden="true">
        </NuxtLink>
      </div>
    </section>

    <section class="stories-section" aria-labelledby="stories-title">
      <div class="home-shell">
        <header class="stories-section__header">
          <h2 id="stories-title">Encounter Stories</h2>
          <p>Real stories from real encounters</p>
        </header>

        <div class="story-grid">
          <button
            v-for="story in stories"
            :key="story.title"
            type="button"
            class="story-card"
            :aria-label="`Play ${story.title}`"
            @click="openStoryVideo(story, $event)"
          >
            <img :src="story.image" :alt="story.alt" width="400" height="480" loading="lazy" decoding="async">
            <div class="story-card__shade" />
            <span class="story-card__play" aria-hidden="true">
              <font-awesome-icon :icon="['fas', 'play']" />
            </span>
            <div class="story-card__content">
              <h3>{{ story.title }}</h3>
              <p>{{ story.description }}</p>
              <span class="story-card__link">
                <img src="/images/common/arrow-up-right.svg" alt="" aria-hidden="true">
                Learn more
              </span>
            </div>
          </button>
        </div>

        <div class="stories-section__more">
          <NuxtLink to="/encounters" class="see-more-button">
            <span>See more</span>
            <span class="see-more-button__icon" aria-hidden="true">
              <font-awesome-icon :icon="['fas', 'chevron-right']" />
            </span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section id="start-journey" class="newsletter-section">
      <div class="container newsletter-grid">
        <div class="newsletter-signup">
          <h3>Start your journey<br>with LVYV</h3>
          <p>Subscribe for travel inspiration,<br>updates, and special offers.</p>
          <div class="signup-capsule">
            <form id="newsletterForm" class="signup-form-inline" @submit.prevent="handleSubscribe">
              <input
                v-model="newsletterEmail"
                type="email"
                placeholder="Enter your email"
                autocomplete="email"
                maxlength="254"
                required
                class="input-email-capsule"
                :aria-describedby="newsletterMessage ? 'newsletter-feedback' : undefined"
                :aria-invalid="newsletterState === 'error'"
                @input="resetNewsletterFeedback"
              >
              <button
                type="submit"
                class="btn-subscribe-capsule"
                :disabled="newsletterSubmitting || newsletterResolved"
              >
                {{ newsletterButtonLabel }}
              </button>
            </form>
          </div>
          <div
            v-if="newsletterMessage"
            id="newsletter-feedback"
            class="newsletter-feedback"
            :class="{ error: newsletterState === 'error' }"
            role="status"
          >
            <font-awesome-icon :icon="['fas', newsletterState === 'error' ? 'circle-exclamation' : 'circle-check']" aria-hidden="true" />
            <span>{{ newsletterMessage }}</span>
          </div>
        </div>

        <div class="slogan-visual">
          <img src="/images/common/footer-slogan.svg" alt="Go, meet someone." class="slogan-text">
          <div class="social-links">
            <a href="https://www.facebook.com/share/1GL3GD5YAS" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><font-awesome-icon :icon="['fab', 'facebook']" aria-hidden="true" /></a>
            <a href="https://pin.it/3S1tpsiOy" target="_blank" rel="noopener noreferrer" aria-label="Pinterest"><font-awesome-icon :icon="['fab', 'pinterest']" aria-hidden="true" /></a>
            <a href="https://www.instagram.com/lvyvofficial" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><font-awesome-icon :icon="['fab', 'instagram']" aria-hidden="true" /></a>
            <a href="https://x.com/lvyvofficial" target="_blank" rel="noopener noreferrer" aria-label="X"><font-awesome-icon :icon="['fab', 'twitter']" aria-hidden="true" /></a>
            <a href="https://www.tiktok.com/@lvyvofficial" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><font-awesome-icon :icon="['fab', 'tiktok']" aria-hidden="true" /></a>
            <a href="https://www.reddit.com/user/LvyvOfficial/" target="_blank" rel="noopener noreferrer" aria-label="Reddit"><font-awesome-icon :icon="['fab', 'reddit']" aria-hidden="true" /></a>
          </div>
        </div>
      </div>
    </section>
  </main>

  <Teleport to="body">
    <Transition name="story-video">
      <div
        v-if="activeStory"
        class="story-video-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="story-video-title"
        @click.self="closeStoryVideo"
      >
        <div class="story-video-modal__dialog">
          <h2 id="story-video-title" class="sr-only">{{ activeStory.title }}</h2>
          <button
            ref="storyCloseButton"
            type="button"
            class="story-video-modal__close"
            aria-label="Close video"
            @click="closeStoryVideo"
          >
            <font-awesome-icon :icon="['fas', 'xmark']" aria-hidden="true" />
          </button>
          <video
            ref="storyVideo"
            class="story-video-modal__video"
            :src="activeStory.video"
            controls
            autoplay
            playsinline
            preload="auto"
            :poster="activeStory.image"
          >
            Your browser does not support HTML video.
          </video>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
import homeWishPool from '~/data/home-wish-pool.json'

type HomeHeroSlide = {
  id: string
  index: number
  fallback: string
  width: number
  height: number
  mobileWebpSrcset: string
  webpSrcset: string
  wideWebpSrcset: string
  alt: string
}

const homeHeroSlides: HomeHeroSlide[] = [
  {
    id: 'xian-city-wall',
    index: 0,
    fallback: '/images/home/banner-1-1440.webp',
    width: 2880,
    height: 1560,
    mobileWebpSrcset: '/images/home/banner-1-768.webp 768w',
    webpSrcset: '/images/home/banner-1-768.webp 768w, /images/home/banner-1-1440.webp 1440w, /images/home/banner-1-2880.webp 2880w',
    wideWebpSrcset: '/images/home/banner-1-2880.webp 2880w',
    alt: "Xi'an city wall surrounded by water at sunset"
  },
  {
    id: 'xian-pagoda',
    index: 1,
    fallback: '/images/home/banner-2-1440.webp',
    width: 2880,
    height: 1560,
    mobileWebpSrcset: '/images/home/banner-2-768.webp 768w',
    webpSrcset: '/images/home/banner-2-768.webp 768w, /images/home/banner-2-1440.webp 1440w, /images/home/banner-2-2880.webp 2880w',
    wideWebpSrcset: '/images/home/banner-2-2880.webp 2880w',
    alt: "Xi'an pagoda beside a star-lit modern facade at dusk"
  },
  {
    id: 'xian-city-gate',
    index: 2,
    fallback: '/images/home/banner-3-1440.webp',
    width: 2880,
    height: 1560,
    mobileWebpSrcset: '/images/home/banner-3-768.webp 768w',
    webpSrcset: '/images/home/banner-3-768.webp 768w, /images/home/banner-3-1440.webp 1440w, /images/home/banner-3-2880.webp 2880w',
    wideWebpSrcset: '/images/home/banner-3-2880.webp 2880w',
    alt: "Xi'an city gate illuminated beneath an evening sky"
  },
  {
    id: 'traditional-opera',
    index: 3,
    fallback: '/images/home/banner-4-1440.webp',
    width: 2880,
    height: 1560,
    mobileWebpSrcset: '/images/home/banner-4-768.webp 768w',
    webpSrcset: '/images/home/banner-4-768.webp 768w, /images/home/banner-4-1440.webp 1440w, /images/home/banner-4-2880.webp 2880w',
    wideWebpSrcset: '/images/home/banner-4-2880.webp 2880w',
    alt: 'Traditional Chinese opera performers beneath a dramatic ring of light'
  }
]

const homeTitle = 'Lvyv Travel - Go, Meet Someone'
const homeDescription = 'Handcrafted China encounters for curious explorers who want real people, hidden stories, and journeys beyond packaged tours.'

useLvyvSeo({
  title: homeTitle,
  description: homeDescription,
  path: '/',
  image: '/images/home/banner-1-2880.webp',
  jsonLd: [
    organizationJsonLd(),
    websiteJsonLd(),
    webPageJsonLd(homeTitle, homeDescription, '/')
  ]
})

useHead({
  link: [{
    rel: 'preload',
    as: 'image',
    type: 'image/webp',
    href: '/images/home/banner-1-1440.webp',
    imagesrcset: '/images/home/banner-1-768.webp 768w, /images/home/banner-1-1440.webp 1440w, /images/home/banner-1-2880.webp 2880w',
    imagesizes: '100vw',
    fetchpriority: 'high'
  }]
})

const audienceCards = [
  {
    title: 'No Packaged Tours',
    description: "You're not a tourist. You're an explorer.",
    image: '/images/home/audience-no-tours.webp',
    alt: 'Travelers setting out on a cycling trip in Xi\'an'
  },
  {
    title: 'Real Encounters',
    description: 'Meet locals, hear their stories, eat where they eat.',
    image: '/images/home/audience-encounters.webp',
    alt: 'Local and international friends meeting in Xi\'an'
  },
  {
    title: 'Beyond Google',
    description: 'Handcrafted trips by people who know the hidden corners.',
    image: '/images/home/audience-beyond-google.webp',
    alt: 'Travelers discovering the Terracotta Warriors'
  }
] as const

const journeySteps = [
  {
    title: 'Make a Wish',
    description: 'Tell us your dream. Where, how long, what vibe',
    to: '/wish'
  },
  {
    title: 'We Design',
    description: 'A real human handcrafts your trip in 24 hours',
    to: '/about'
  },
  {
    title: 'Go & Encounter',
    description: 'Explore with city missions. Meet someone along the way',
    to: '/cities/xian'
  }
] as const

type HomeWish = {
  id: string
  text: string
  passenger: string
  style: 'grass' | 'forest' | 'outline' | 'teal'
}

const wishRows = homeWishPool.rows as HomeWish[][]

type HomeStory = {
  title: string
  description: string
  image: string
  alt: string
  video: string
}

const stories: HomeStory[] = [
  {
    title: 'Meet Regret',
    description: 'Some love stories are remembered because they never had a happy ending.',
    image: '/images/home/story-meet-regret.webp',
    alt: 'Traditional Chinese opera performers on a blue-lit stage',
    video: '/videos/home/meet-regret-1080.mp4'
  },
  {
    title: 'Meet a Wish',
    description: 'Local children, one bell, and a shared wish.',
    image: '/images/home/story-meet-a-wish.webp',
    alt: 'An ancient pagoda rising above green trees',
    video: '/videos/home/meet-a-wish-1080.mp4'
  },
  {
    title: 'Meet Curiosity',
    description: 'A small moment of wonder, found in the everyday.',
    image: '/images/home/story-meet-curiosity.webp',
    alt: 'Travelers sharing a curious moment in a local restaurant',
    video: '/videos/home/meet-curiosity-1080.mp4'
  }
]

const activeStory = ref<HomeStory | null>(null)
const storyVideo = ref<HTMLVideoElement | null>(null)
const storyCloseButton = ref<HTMLButtonElement | null>(null)
let storyTriggerElement: HTMLElement | null = null
let previousBodyOverflow = ''

const openStoryVideo = async (story: HomeStory, event: Event) => {
  storyTriggerElement = event.currentTarget as HTMLElement
  previousBodyOverflow = document.body.style.overflow
  activeStory.value = story
  document.body.style.overflow = 'hidden'
  await nextTick()
  const video = storyVideo.value
  if (video) {
    video.currentTime = 0
    video.muted = false
    try {
      await video.play()
    } catch {
      video.muted = true
      await video.play().catch(() => undefined)
    }
  }
  storyCloseButton.value?.focus()
}

const closeStoryVideo = async () => {
  if (!activeStory.value) return
  storyVideo.value?.pause()
  activeStory.value = null
  document.body.style.overflow = previousBodyOverflow
  await nextTick()
  storyTriggerElement?.focus()
  storyTriggerElement = null
}

const handleStoryKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && activeStory.value) closeStoryVideo()
}

const newsletterEmail = ref('')
const newsletterState = ref<'idle' | 'submitting' | 'confirmation_sent' | 'already_subscribed' | 'error'>('idle')
const newsletter = useNewsletterSubscription()
const newsletterSubmitting = computed(() => newsletterState.value === 'submitting')
const newsletterResolved = computed(() => ['confirmation_sent', 'already_subscribed'].includes(newsletterState.value))
const newsletterButtonLabel = computed(() => {
  if (newsletterState.value === 'submitting') return 'Sending...'
  if (newsletterState.value === 'confirmation_sent') return 'Email sent'
  if (newsletterState.value === 'already_subscribed') return 'Subscribed'
  return 'Subscribe'
})
const newsletterMessage = computed(() => {
  if (newsletterState.value === 'confirmation_sent') return 'If confirmation is needed, check your inbox within 24 hours.'
  if (newsletterState.value === 'already_subscribed') return 'This email is already subscribed.'
  if (newsletterState.value === 'error') return 'We could not start your subscription. Please try again.'
  return ''
})

const resetNewsletterFeedback = () => {
  if (newsletterState.value !== 'submitting') newsletterState.value = 'idle'
}

const handleSubscribe = async () => {
  if (!newsletterEmail.value.trim() || newsletterSubmitting.value) return
  newsletterState.value = 'submitting'
  try {
    const result = await newsletter.subscribe(newsletterEmail.value.trim())
    newsletterState.value = result.status === 'ALREADY_SUBSCRIBED' ? 'already_subscribed' : 'confirmation_sent'
  } catch {
    newsletterState.value = 'error'
  }
}

const activeBg = ref(0)
const requestedHeroIndices = reactive(new Set<number>([0]))
const loadedHeroIndices = reactive(new Set<number>())
const failedHeroIndices = reactive(new Set<number>())
const requestedHeroSlides = computed(() => homeHeroSlides.filter(slide => requestedHeroIndices.has(slide.index)))
const heroImageElements: Array<HTMLImageElement | null> = []
let pendingActiveBg: number | null = null
let bgTimer: ReturnType<typeof setInterval> | null = null
let heroIdleHandle: number | null = null

const setHeroImageRef = (element: unknown, index: number) => {
  heroImageElements[index] = element as HTMLImageElement | null
}

const requestHero = (index: number, idle = false) => {
  if (requestedHeroIndices.has(index) || failedHeroIndices.has(index)) return

  const request = () => {
    heroIdleHandle = null
    requestedHeroIndices.add(index)
  }

  if (!idle) {
    request()
  } else if ('requestIdleCallback' in window) {
    heroIdleHandle = window.requestIdleCallback(request, { timeout: 1500 })
  } else {
    heroIdleHandle = setTimeout(request, 300) as unknown as number
  }
}

const requestNextHero = (index: number) => {
  const next = homeHeroSlides.find(slide => slide.index > index && !requestedHeroIndices.has(slide.index) && !failedHeroIndices.has(slide.index))
  if (next) requestHero(next.index, true)
}

const handleHeroLoad = async (index: number, event?: Event) => {
  if (loadedHeroIndices.has(index)) return
  const image = event?.currentTarget as HTMLImageElement | null || heroImageElements[index]
  if (image?.decode) await image.decode().catch(() => {})
  loadedHeroIndices.add(index)

  if (pendingActiveBg === index) {
    activeBg.value = index
    pendingActiveBg = null
    startBgTimer()
  }

  if (index === 0) startBgTimer()
  requestNextHero(index)
}

const handleHeroError = (index: number) => {
  failedHeroIndices.add(index)
  requestedHeroIndices.delete(index)
  if (pendingActiveBg === index) pendingActiveBg = null
  requestNextHero(index)
}

const getNextLoadedHero = () => {
  for (let offset = 1; offset <= homeHeroSlides.length; offset += 1) {
    const index = (activeBg.value + offset) % homeHeroSlides.length
    if (loadedHeroIndices.has(index)) return index
  }
  return activeBg.value
}

const startBgTimer = () => {
  if (bgTimer) clearInterval(bgTimer)
  bgTimer = setInterval(() => {
    activeBg.value = getNextLoadedHero()
  }, 6000)
}

const setBg = (index: number) => {
  if (index === 0 || loadedHeroIndices.has(index)) {
    activeBg.value = index
    startBgTimer()
    return
  }
  pendingActiveBg = index
  requestHero(index)
}

const isEncountersInView = ref(false)
let encountersObserver: IntersectionObserver | null = null

onMounted(async () => {
  window.addEventListener('keydown', handleStoryKeydown)
  await nextTick()
  const firstImage = heroImageElements[0]
  if (firstImage?.complete && firstImage.naturalWidth > 0) handleHeroLoad(0)

  const encountersSection = document.getElementById('curated-encounters')
  if (encountersSection && 'IntersectionObserver' in window) {
    encountersObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isEncountersInView.value = true
          encountersObserver?.disconnect()
        }
      })
    }, { threshold: 0.15 })
    encountersObserver.observe(encountersSection)
  } else {
    isEncountersInView.value = true
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleStoryKeydown)
  document.body.style.overflow = previousBodyOverflow
  if (bgTimer) clearInterval(bgTimer)
  if (heroIdleHandle !== null) {
    if ('cancelIdleCallback' in window) window.cancelIdleCallback(heroIdleHandle)
    else clearTimeout(heroIdleHandle)
  }
  if (encountersObserver) encountersObserver.disconnect()
})
</script>

<style scoped>
.home-v2 {
  --home-forest: #105446;
  --home-ink: #203d33;
  --home-lime: #cff380;
  --home-dark: #343935;
  background: #fff;
  color: var(--home-ink);
  overflow-x: clip;
}

.btn-subscribe-capsule:disabled {
  cursor: default;
  opacity: .72;
}

.newsletter-feedback {
  position: absolute;
  top: 166px;
  left: 316px;
  display: flex;
  width: 410px;
  align-items: center;
  gap: 8px;
  color: #cff380;
  font-size: 13px;
  line-height: 1.4;
}

.newsletter-feedback.error {
  color: #ffb7b7;
}

.newsletter-feedback svg {
  flex: 0 0 auto;
}

.home-shell {
  width: min(1280px, calc(100% - 48px));
  margin: 0 auto;
}

.home-eyebrow {
  color: var(--home-lime);
  font-family: var(--font-heading);
  font-size: 24px;
  line-height: 1.2;
  text-transform: uppercase;
}

.hero-v2 {
  position: relative;
  width: 100%;
  height: 100vh;
  height: 100svh;
  min-height: 600px;
  padding: 0 !important;
  overflow: hidden;
  background: #1e2e28;
}

.hero-v2__slide,
.hero-v2__slide picture,
.hero-v2__slide img {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
}

.hero-v2__slide {
  opacity: 0;
  transition: opacity 1.2s ease;
}

.hero-v2__slide.is-active {
  opacity: 1;
}

.hero-v2__slide img {
  object-fit: cover;
  object-position: center top;
}

.hero-v2__content {
  position: relative;
  z-index: 1;
  display: flex;
  height: 100%;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: calc(268px + max(0px, (100svh - 780px) / 2));
  text-align: center;
}

.hero-v2__title {
  width: min(723px, 50.208vw);
  height: auto;
}

.hero-v2__content > p {
  width: min(726px, calc(100vw - 40px));
  height: 41px;
  margin-top: 0;
  color: #fff;
  font-family: var(--font-body);
  font-size: clamp(20px, 1.806vw, 26px);
  font-weight: 400;
  line-height: 20.8px;
}

.hero-v2__actions {
  display: flex;
  gap: clamp(16px, 1.389vw, 20px);
  margin-top: clamp(16px, 1.389vw, 20px);
}

.home-button {
  display: inline-flex;
  min-height: 60px;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 0 24px;
  border: 2px solid transparent;
  border-radius: 10px;
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  transition: transform .2s ease, background-color .2s ease, color .2s ease;
}

.home-button span {
  white-space: nowrap;
}

.home-button:hover {
  transform: translateY(-2px);
}

.home-button img,
.home-button svg {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.home-button--primary {
  background: var(--home-forest, #105446);
  color: #c0f177;
}

.home-button--outline {
  border-color: #fff;
  color: #fff;
}

.hero-v2__actions .home-button--primary {
  width: 220px;
  min-width: 220px;
  padding: 0;
}

.hero-v2__actions .home-button--outline {
  width: 170px;
  min-width: 170px;
  padding: 0;
}

.hero-v2__dots {
  position: absolute;
  z-index: 1;
  bottom: 20px;
  left: 50%;
  display: flex;
  gap: 8px;
  transform: translateX(-50%);
}

.hero-v2__dots button {
  width: 12px;
  height: 12px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, .45);
  cursor: pointer;
  transition: width .2s ease, background-color .2s ease;
}

.hero-v2__dots button.is-active {
  width: 20px;
  border-radius: 12px;
  background: #fff;
}

.audience-section {
  background: var(--home-dark);
  padding: 128px 0 46px !important;
  color: #fff;
}

.audience-section__header {
  max-width: 800px;
  margin: 0 auto 54px;
  text-align: center;
}

.audience-section__header h2 {
  margin-top: 18px;
  color: #fff;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.15;
}

.audience-section__intro {
  margin-top: 22px;
  color: rgba(233, 237, 229, .78);
  font-size: 16px;
  line-height: 26px;
}

.audience-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 25px;
}

.audience-card {
  position: relative;
  min-width: 0;
  aspect-ratio: 410 / 420;
  overflow: hidden;
  border-radius: 8px;
  background: #1f2521;
}

.audience-card > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .55s ease;
}

.audience-card:nth-child(1) > img {
  object-position: center 68%;
}

.audience-card:nth-child(2) > img {
  object-position: center;
}

.audience-card:nth-child(3) > img {
  object-position: center;
}

.audience-card:hover > img {
  transform: scale(1.035);
}

.audience-card__shade {
  position: absolute;
  inset: 40% 0 0;
  background: linear-gradient(180deg, transparent, rgba(0, 0, 0, .9));
}

.audience-card__content {
  position: absolute;
  right: 30px;
  bottom: 26px;
  left: 30px;
}

.audience-card__content h3 {
  color: #fff;
  font-size: 24px;
  line-height: 1.2;
}

.audience-card__content p {
  margin-top: 7px;
  color: #ccc;
  font-size: 14px;
  line-height: 1.45;
}

.journey-section {
  position: relative;
  min-height: 760px;
  padding: 125px 0 90px !important;
  background: #fff;
}

.journey-section__layout {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(320px, .75fr);
  gap: 110px;
  align-items: center;
}

.journey-heading {
  position: relative;
  z-index: 1;
  padding-left: 6px;
}

.journey-heading h2 {
  display: flex;
  align-items: center;
  color: var(--home-ink);
  font-family: var(--font-body);
  font-size: clamp(72px, 7.05vw, 102px);
  font-weight: 700;
  line-height: .92;
  text-transform: uppercase;
  white-space: nowrap;
}

.journey-heading h2 strong {
  display: inline-block;
  margin-left: 12px;
  padding: 12px 8px 8px;
  background: var(--home-lime);
  color: #191617;
  font-size: .4em;
  font-weight: 700;
  line-height: 1;
  transform: rotate(-5deg);
}

.journey-heading > p {
  margin-top: 22px;
  font-size: 48px;
  line-height: 1.12;
}

.journey-heading > p b {
  margin-right: 10px;
  font-size: 64px;
}

.journey-section__art {
  position: absolute;
  z-index: 0;
  top: 50%;
  left: 51%;
  width: 250px;
  height: 340px;
  object-fit: contain;
  opacity: .45;
  transform: translate(-50%, -50%) rotate(-7deg);
}

.journey-steps {
  position: relative;
  z-index: 1;
}

.journey-step {
  position: relative;
  display: block;
  height: 154px;
  padding: 0;
  box-sizing: border-box;
}

.journey-step__title {
  position: absolute;
  top: 10px;
  left: 0;
  width: 251.6875px;
  height: 39px;
}

.journey-step__title::after {
  position: absolute;
  top: 39px;
  left: 0;
  width: 251.6875px;
  height: 3px;
  background: var(--home-ink);
  content: '';
}

.journey-step__title h3 {
  position: absolute;
  top: 3px;
  left: 0;
  display: flex;
  width: 211.8875px;
  height: 29px;
  align-items: center;
  color: var(--home-ink);
  font-family: var(--font-body);
  font-size: 24px;
  font-weight: 700;
  line-height: 36px;
  letter-spacing: 1px;
}

.journey-step__title img {
  position: absolute;
  top: 6.640625px;
  left: 175.796875px;
  width: 31.980064px;
  height: 20.609375px;
  transition: transform .2s ease;
}

.journey-step:nth-child(3) .journey-step__title img {
  left: 219.796875px;
}

.journey-step:hover .journey-step__title img {
  transform: translateX(5px);
}

.journey-step > p {
  position: absolute;
  top: 53px;
  left: -.203125px;
  display: flex;
  width: 352px;
  max-width: 100%;
  height: 61px;
  align-items: center;
  margin-top: 0;
  color: var(--home-ink);
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 200;
  line-height: 25.2px;
}

.journey-section__button {
  position: absolute;
  bottom: 80px;
  left: 50%;
  min-width: 240px;
  font-weight: 600;
  transform: translateX(-50%);
}

.journey-section__button:hover {
  transform: translate(-50%, -2px);
}

.journey-section__button > img,
.journey-section__button > svg {
  display: block;
  width: 30px;
  height: 30px;
}

.curated-section {
  position: relative;
  width: 100%;
  height: calc(760 * (100vw / 1440));
  min-height: 500px;
  padding: 0 !important;
  overflow: hidden;
  background: #eaefeb;
  display: flex;
  justify-content: center;
}

.curated-section__stage {
  position: relative;
  width: 1440px;
  height: 760px;
  flex-shrink: 0;
  transform-origin: top center;
  transform: scale(calc(100vw / 1440));
}

@media (min-width: 1440px) {
  .curated-section {
    height: 760px;
  }

  .curated-section__stage {
    transform: none;
  }
}

.curated-section__header {
  position: absolute;
  top: 80px;
  left: 80px;
  width: 1280px;
  height: 120px;
  color: #203d33;
  text-align: center;
}

.curated-section__header h2 {
  font-family: Didot, 'Times New Roman', serif;
  font-size: 40px;
  font-weight: 700;
  line-height: 40px;
  margin: 0;
  letter-spacing: -0.01em;
  color: #203d33;
}

.curated-section__header p {
  margin-top: 0;
  font-family: Didot, 'Times New Roman', serif;
  font-size: 36px;
  font-weight: 400;
  line-height: 40px;
  color: #203d33;
}

.encounter-deck {
  position: absolute;
  inset: 0;
  perspective: 1000px;
}

.encounter-card {
  position: absolute;
  display: block;
  width: 278px;
  height: 389px;
  border-radius: 20px;
  text-decoration: none;
  /* 炫酷贝塞尔弹性发牌曲线 */
  transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
  will-change: transform, opacity;
}

.encounter-card img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 20px;
  pointer-events: none;
  filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.12));
  transition: filter 0.4s ease, transform 0.4s ease;
}

/* 初始叠牌状态: 3张牌聚在中央偏下 */
.curated-section:not(.is-in-view) .encounter-card {
  left: 565px !important;
  top: 290px !important;
  transform: rotate(0deg) scale(0.65) translateY(120px) !important;
  opacity: 0 !important;
}

/* 1. BEIJING 卡片原图 (Figma Node #582:3678) */
.encounter-card--beijing {
  z-index: 1;
  top: 280px;
  left: 430px;
  transform: rotate(-12.89deg);
  transform-origin: center center;
}

.curated-section.is-in-view .encounter-card--beijing {
  transition-delay: 0.1s;
}

.encounter-card--beijing:hover {
  z-index: 10;
  transform: rotate(-12.89deg) translateY(-14px) scale(1.04);
}

/* 2. CHENGDU 卡片原图 (Figma Node #582:3685) */
.encounter-card--chengdu {
  z-index: 2;
  top: 280px;
  left: 565px;
  transform: rotate(0deg);
  transform-origin: center center;
}

.curated-section.is-in-view .encounter-card--chengdu {
  transition-delay: 0.25s;
}

.encounter-card--chengdu:hover {
  z-index: 10;
  transform: translateY(-14px) scale(1.04);
}

/* 3. XI'AN 卡片原图 (Figma Node #582:3692) */
.encounter-card--xian {
  z-index: 3;
  top: 292px;
  left: 725px;
  transform: rotate(10.87deg);
  transform-origin: center center;
}

.curated-section.is-in-view .encounter-card--xian {
  transition-delay: 0.4s;
}

.encounter-card--xian:hover {
  z-index: 10;
  transform: rotate(10.87deg) translateY(-14px) scale(1.04);
}

.encounter-card:hover img {
  filter: drop-shadow(0 24px 40px rgba(0, 0, 0, 0.24));
}

.home-wish-section {
  position: relative;
  height: max(905px, 100svh);
  min-height: max(905px, 100svh);
  padding: 0 !important;
  overflow: hidden;
  background: #fdfff3;
}

.home-wish-section__stage {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 905px;
  transform: translateY(-50%);
}

.home-wish-section__header {
  position: absolute;
  top: 36px;
  left: 50%;
  width: 597px;
  height: 255px;
  transform: translateX(-50%);
}

.home-wish-section__ellipse {
  position: absolute;
  top: 48px;
  left: 108px;
  width: 420px;
  height: 132px;
  border: 1px dashed var(--home-ink);
  border-radius: 50%;
  transform: rotate(-18deg);
}

.home-wish-section__title,
.home-wish-section__subtitle {
  position: absolute;
  z-index: 1;
  left: 0;
  width: 597px;
  margin: 0;
  color: var(--home-ink);
  text-align: center;
}

.home-wish-section__title {
  top: 100px;
  font-family: 'Khula', var(--font-body);
  font-size: 60px;
  font-weight: 700;
  line-height: 50px;
  text-transform: uppercase;
}

.home-wish-section__subtitle {
  top: 161px;
  font-family: var(--font-body);
  font-size: 24px;
  font-weight: 500;
  line-height: 44px;
}

.home-wish-section__spark {
  position: absolute;
  z-index: 2;
  top: 43px;
  left: 509px;
  width: 35px;
  height: 39px;
}

.home-wish-section__globe {
  position: absolute;
  top: 38px;
  left: 220px;
  width: 53px;
  height: 53px;
  border-radius: 50%;
  background: #fdfff3;
  box-shadow: 0 0 0 7px #fdfff3;
}

.home-wish-cloud {
  position: absolute;
  top: 327px;
  left: 0;
  display: flex;
  width: 100%;
  height: 348px;
  flex-direction: column;
  gap: 29px;
  overflow: hidden;
}

.home-wish-row {
  width: 100%;
  height: 159px;
  overflow: hidden;
}

.home-wish-row__track,
.home-wish-row__group {
  display: flex;
  width: max-content;
  gap: 24px;
}

.home-wish-row__track {
  will-change: transform;
}

.home-wish-row--left .home-wish-row__track {
  animation: homeWishLeft 96s linear infinite;
}

.home-wish-row--right .home-wish-row__track {
  animation: homeWishRight 104s linear infinite;
}

.home-wish-row__track:hover {
  animation-play-state: paused;
}

.home-wish-bubble {
  display: flex;
  width: 490px;
  height: 159px;
  flex: 0 0 490px;
  flex-direction: column;
  justify-content: center;
  padding: 18px 44px;
  border: 1px solid transparent;
  border-radius: 80px;
  font-family: var(--font-cursive);
}

.home-wish-bubble p {
  font-family: inherit;
  font-size: 30px;
  font-weight: 400;
  line-height: 1.18;
}

.home-wish-bubble span {
  align-self: flex-end;
  margin-top: 4px;
  font-family: inherit;
  font-size: 16px;
  line-height: 1.2;
}

.home-wish-bubble--grass {
  background: #698e4e;
  color: #fff;
}

.home-wish-bubble--forest {
  background: #1a4536;
  color: #fff;
}

.home-wish-bubble--outline {
  border-color: rgba(0, 0, 0, .1);
  background: #fff;
  color: var(--home-ink);
}

.home-wish-bubble--teal {
  background: #1c846f;
  color: #fff;
}

.home-wish-action {
  position: absolute;
  top: 755px;
  left: 50%;
  display: flex;
  width: min(500px, calc(100% - 32px));
  height: 100px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 52px;
  background: var(--home-lime);
  color: #080503;
  font-family: var(--font-body);
  font-size: 28px;
  font-weight: 500;
  transform: translateX(-50%);
  transition: background-color .2s ease, transform .2s ease;
}

.home-wish-action:hover {
  background: #c4ed6d;
  transform: translate(-50%, -3px);
}

.home-wish-action img {
  width: 32px;
  height: 32px;
  transition: transform .2s ease;
}

.home-wish-action:hover img {
  transform: translate(4px, -4px);
}

@keyframes homeWishLeft {
  from { transform: translateX(0); }
  to { transform: translateX(calc(-50% - 12px)); }
}

@keyframes homeWishRight {
  from { transform: translateX(calc(-50% - 12px)); }
  to { transform: translateX(0); }
}

.stories-section {
  padding: 128px 0 14px !important;
  background: #ffffff;
}

.stories-section__header {
  text-align: center;
}

.stories-section__header h2 {
  color: var(--home-ink);
  font-size: 40px;
  font-weight: 700;
  line-height: 1.05;
  text-transform: uppercase;
}

.stories-section__header p {
  margin-top: 7px;
  font-family: var(--font-heading);
  font-size: 32px;
  line-height: 1.2;
}

.story-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 40px;
  margin-top: 50px;
}

.story-card {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 5 / 6;
  padding: 0;
  overflow: hidden;
  border: 0;
  border-radius: 20px;
  appearance: none;
  background: #27332e;
  color: #fff;
  cursor: pointer;
  font: inherit;
  text-align: left;
}

.story-card:focus-visible {
  outline: 3px solid var(--home-lime);
  outline-offset: 4px;
}

.story-card > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .55s ease;
}

.story-card:nth-child(1) > img {
  object-position: 42% center;
}

.story-card:nth-child(2) > img {
  object-position: 54% center;
}

.story-card:nth-child(3) > img {
  object-position: center;
}

.story-card:hover > img {
  transform: scale(1.04);
}

.story-card__shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 28%, rgba(0, 0, 0, .82) 100%);
}

.story-card__play {
  position: absolute;
  top: 47%;
  left: 50%;
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, .8);
  border-radius: 50%;
  background: rgba(0, 0, 0, .18);
  color: #fff;
  font-size: 12px;
  transform: translate(-50%, -50%);
}

.story-card__content {
  position: absolute;
  right: 40px;
  bottom: 28px;
  left: 40px;
}

.story-card__content h3 {
  color: #fff;
  font-family: var(--font-body);
  font-size: 28px;
  font-weight: 400;
  line-height: 1.2;
}

.story-card__content > p {
  min-height: 40px;
  margin-top: 9px;
  color: rgba(255, 255, 255, .88);
  font-size: 14px;
  font-weight: 300;
  line-height: 20px;
}

.story-card__link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 18px;
  color: #fff;
  font-size: 14px;
}

.story-card__link img {
  width: 28px;
  height: 28px;
}

.stories-section__more {
  display: flex;
  justify-content: flex-end;
  margin-top: 22px;
}

.story-video-modal {
  position: fixed;
  z-index: 2000;
  inset: 0;
  display: grid;
  padding: 24px;
  place-items: center;
  background: rgba(5, 12, 10, .9);
  backdrop-filter: blur(10px);
}

.story-video-modal__dialog {
  position: relative;
  width: min(1100px, 100%);
  max-height: calc(100svh - 48px);
  overflow: hidden;
  border-radius: 20px;
  background: #000;
  box-shadow: 0 24px 80px rgba(0, 0, 0, .45);
}

.story-video-modal__video {
  display: block;
  width: 100%;
  max-height: calc(100svh - 48px);
  aspect-ratio: 16 / 9;
  background: #000;
  object-fit: contain;
}

.story-video-modal__close {
  position: absolute;
  z-index: 1;
  top: 16px;
  right: 16px;
  display: grid;
  width: 44px;
  height: 44px;
  padding: 0;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, .7);
  border-radius: 50%;
  background: rgba(0, 0, 0, .5);
  color: #fff;
  cursor: pointer;
  font-size: 18px;
}

.story-video-modal__close:focus-visible {
  outline: 3px solid var(--home-lime);
  outline-offset: 3px;
}

.story-video-enter-active,
.story-video-leave-active {
  transition: opacity .2s ease;
}

.story-video-enter-active .story-video-modal__dialog,
.story-video-leave-active .story-video-modal__dialog {
  transition: transform .2s ease;
}

.story-video-enter-from,
.story-video-leave-to {
  opacity: 0;
}

.story-video-enter-from .story-video-modal__dialog,
.story-video-leave-to .story-video-modal__dialog {
  transform: translateY(12px) scale(.98);
}

.see-more-button {
  display: inline-flex;
  height: 40px;
  align-items: center;
  gap: 10px;
  padding: 0 8px 0 16px;
  border-radius: 30px;
  background: var(--home-ink);
  color: #fff;
  font-size: 14px;
  font-weight: 500;
}

.see-more-button__icon {
  display: grid;
  width: 24px;
  height: 24px;
  place-items: center;
  border-radius: 50%;
  background: #fff;
  color: var(--home-ink);
  font-size: 10px;
}

@media (min-width: 1200px) {
  .journey-section {
    width: 100%;
    max-width: 1440px;
    height: max(760px, 100svh);
    min-height: max(760px, 100svh);
    margin: 0 auto;
    padding: 0 !important;
  }

  .journey-section__layout {
    position: absolute;
    top: calc(max(0px, (100svh - 760px) / 2) + 120px);
    left: calc(50% - 468px);
    display: block;
    width: 1008px;
    height: 474.4375px;
    margin: 0;
  }

  .journey-heading {
    position: absolute;
    top: 125px;
    left: 0;
    width: 554.390625px;
    height: 224.4375px;
    padding: 0;
  }

  .journey-heading h2 {
    position: absolute;
    top: 10px;
    left: 0;
    display: block;
    width: 554.390625px;
    height: 204.4375px;
    font-size: inherit;
    line-height: normal;
    white-space: normal;
  }

  .journey-heading h2 > span {
    position: absolute;
    top: -33px;
    left: -106px;
    display: flex;
    width: 392px;
    height: 137px;
    align-items: center;
    font-size: 101.8px;
    line-height: 92.48px;
  }

  .journey-heading h2 strong {
    position: absolute;
    top: .25px;
    left: 286.15625px;
    display: flex;
    width: 172.1px;
    height: 98.05px;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
    font-size: 40.52px;
    line-height: 73.984px;
    transform: rotate(-5deg);
  }

  .journey-heading > p {
    position: absolute;
    top: 114px;
    left: -98px;
    display: flex;
    width: 603px;
    height: 66px;
    align-items: center;
    margin: 0;
    font-size: 48px;
    line-height: 92.48px;
    white-space: nowrap;
  }

  .journey-heading > p b {
    width: 61px;
    margin-right: -9px;
    flex: 0 0 61px;
    font-size: 64px;
    line-height: 92.48px;
  }

  .journey-section__art {
    z-index: 2;
    top: 41.171875px;
    left: 377px;
    width: 273.59375px;
    height: 372.09375px;
    object-fit: cover;
    opacity: 1;
    pointer-events: none;
    transform: none;
  }

  .journey-steps {
    position: absolute;
    top: 0;
    left: 655.203125px;
    width: 352.796875px;
    height: 474.4375px;
  }

  .journey-section__button {
    top: calc(max(0px, (100svh - 760px) / 2) + 620px);
    bottom: auto;
    width: 240px;
    height: 60px;
    min-height: 60px;
    gap: 20px;
    padding: 0;
    border: 0;
    box-sizing: border-box;
  }
}

@media (max-width: 1100px) {
  .journey-section__layout {
    gap: 56px;
  }

  .journey-heading > p {
    font-size: 38px;
  }

  .story-grid {
    gap: 24px;
  }

  .story-card__content {
    right: 24px;
    left: 24px;
  }

}

@media (max-width: 767px) {
  .home-shell {
    width: min(100% - 32px, 560px);
  }

  .hero-v2 {
    height: 100svh;
  }

  .hero-v2__content {
    justify-content: flex-end;
    padding: 0 20px 86px;
  }

  .hero-v2__title {
    width: min(92vw, 520px);
    height: auto;
  }

  .hero-v2__content > p {
    margin-top: 20px;
    font-size: 15px;
  }

  .hero-v2__actions {
    width: min(100%, 360px);
    gap: 12px;
    margin-top: 26px;
  }

  .home-button {
    min-height: 52px;
    gap: 8px;
    padding: 0 14px;
    font-size: 13px;
  }

  .hero-v2__actions .home-button--primary,
  .hero-v2__actions .home-button--outline {
    width: auto;
    min-width: 0;
    flex: 1;
  }

  .home-button img,
  .home-button svg {
    width: 20px;
    height: 20px;
  }

  .hero-v2__dots {
    bottom: 18px;
  }

  .audience-section {
    padding: 112px 0 36px !important;
  }

  .home-eyebrow {
    font-size: 18px;
  }

  .audience-section__header {
    margin-bottom: 34px;
  }

  .audience-section__header h2 {
    margin-top: 12px;
    font-size: 42px;
  }

  .audience-section__intro {
    margin-top: 18px;
    font-size: 14px;
    line-height: 23px;
  }

  .audience-section__intro br {
    display: none;
  }

  .audience-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .audience-card {
    aspect-ratio: 4 / 3;
  }

  .journey-section {
    min-height: 0;
    padding: 74px 0 138px !important;
  }

  .journey-section__layout {
    grid-template-columns: 1fr;
    gap: 70px;
  }

  .journey-heading h2 {
    flex-wrap: wrap;
    font-size: clamp(50px, 15vw, 68px);
    white-space: normal;
  }

  .journey-heading h2 strong {
    margin-left: 8px;
  }

  .journey-heading > p {
    margin-top: 16px;
    font-size: 26px;
  }

  .journey-heading > p b {
    font-size: 42px;
  }

  .journey-section__art {
    top: 250px;
    right: -42px;
    left: auto;
    width: 180px;
    height: 245px;
    transform: rotate(-8deg);
  }

  .journey-section__button {
    bottom: 60px;
  }

  .curated-section {
    height: auto;
    min-height: 620px;
    padding: 68px 0 42px !important;
  }

  .curated-section__stage {
    position: relative;
    top: auto;
    left: auto;
    width: 100%;
    height: 510px;
    transform: none;
  }

  .curated-section__header {
    top: 0;
    right: 16px;
    left: 16px;
    width: auto;
  }

  .curated-section__header h2 {
    font-size: 34px;
    line-height: 38px;
  }

  .curated-section__header p {
    max-width: 420px;
    margin: 4px auto 0;
    font-size: 24px;
    line-height: 29px;
  }

  .encounter-deck {
    inset: auto;
    top: 82px;
    left: 50%;
    width: 1280px;
    height: 760px;
    transform: translateX(-50%) scale(0.62);
    transform-origin: top center;
  }

  .encounter-card {
    border-radius: 20px;
  }

  .home-wish-section {
    height: auto;
    min-height: 760px;
  }

  .home-wish-section__stage {
    position: relative;
    top: auto;
    height: 760px;
    transform: none;
  }

  .home-wish-section__header {
    top: 30px;
    width: min(597px, calc(100% - 24px));
    height: auto;
    aspect-ratio: 597 / 255;
  }

  .home-wish-section__ellipse {
    top: 19%;
    left: 18%;
    width: 70%;
    height: 52%;
  }

  .home-wish-section__title,
  .home-wish-section__subtitle {
    width: 100%;
  }

  .home-wish-section__title {
    top: 39%;
    font-size: clamp(34px, 10vw, 60px);
    line-height: 1;
  }

  .home-wish-section__subtitle {
    top: 63%;
    font-size: clamp(14px, 4vw, 24px);
    line-height: 1.25;
  }

  .home-wish-section__spark {
    top: 17%;
    left: 84%;
    width: 6%;
    height: auto;
  }

  .home-wish-section__globe {
    top: 15%;
    left: 37%;
    width: 9%;
    height: auto;
    aspect-ratio: 1;
  }

  .home-wish-cloud {
    top: 230px;
    height: 290px;
    gap: 18px;
  }

  .home-wish-row,
  .home-wish-bubble {
    height: 136px;
  }

  .home-wish-bubble {
    width: 360px;
    flex-basis: 360px;
    padding: 16px 30px;
    border-radius: 68px;
  }

  .home-wish-bubble p {
    font-size: 24px;
  }

  .home-wish-bubble span {
    font-size: 14px;
  }

  .home-wish-action {
    top: 610px;
    height: 76px;
    font-size: 22px;
  }

  .stories-section {
    padding: 112px 0 8px !important;
  }

  .stories-section__header h2 {
    font-size: 32px;
  }

  .stories-section__header p {
    font-size: 24px;
  }

  .story-grid {
    grid-template-columns: 1fr;
    gap: 18px;
    margin-top: 34px;
  }

  .story-card {
    aspect-ratio: 4 / 5;
  }

  .story-card__content {
    right: 28px;
    bottom: 24px;
    left: 28px;
  }

  .story-video-modal {
    padding: 12px;
  }

  .story-video-modal__dialog,
  .story-video-modal__video {
    max-height: calc(100svh - 24px);
  }

  .story-video-modal__close {
    top: 10px;
    right: 10px;
  }

  .stories-section__more {
    margin-top: 18px;
  }

  .newsletter-feedback {
    position: static;
    width: min(100%, 420px);
    justify-content: center;
    margin-top: 12px;
    padding: 0 8px;
    font-size: 12px;
  }

}

@media (prefers-reduced-motion: reduce) {
  .home-wish-row__track {
    animation-play-state: paused;
  }

  .story-video-enter-active,
  .story-video-leave-active,
  .story-video-enter-active .story-video-modal__dialog,
  .story-video-leave-active .story-video-modal__dialog {
    transition: none;
  }

  .home-v2 *,
  .home-v2 *::before,
  .home-v2 *::after {
    scroll-behavior: auto !important;
    transition-duration: .01ms !important;
  }
}
</style>
