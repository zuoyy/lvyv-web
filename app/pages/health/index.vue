<template>
  <main class="health-page">
    <!-- Hero Section -->
    <section class="health-hero" aria-labelledby="health-hero-title">
      <div class="health-container health-hero__container">
        <div class="health-hero__content">
          <h1 id="health-hero-title" class="health-hero__title">
            Healthcarein <span class="health-hero__title-in">in</span><br>
            China,made easier
          </h1>
          <p class="health-hero__subtitle">
            Health checkups, dental care, eye care and more — with clear information, selected providers and English-speaking coordination.
          </p>
          <div class="health-hero__actions">
            <a href="#explore-care" class="health-btn health-btn--primary">
              Explore Health Services
            </a>
            <button type="button" class="health-btn health-btn--outline" @click="openConsultModal()">
              Talk to a Care Coordinator
            </button>
          </div>
        </div>

        <div class="health-hero__visual">
          <div class="health-hero__image-wrapper">
            <img
              src="/images/health/hero.webp"
              alt="Professional doctor providing healthcare consultation in China"
              class="health-hero__image"
              loading="eager"
            >
          </div>

          <!-- Floating Badge: Hours of meetings (Top Right) -->
          <div class="health-badge health-badge--top-right">
            <span class="health-badge__metric">10K+</span>
            <span class="health-badge__label">hours of patient<br>meetings</span>
          </div>

          <!-- Floating Badge: Patients trusted us (Bottom Left) -->
          <div class="health-badge health-badge--bottom-left">
            <div class="health-badge__row">
              <div class="health-badge__avatars" aria-hidden="true">
                <img src="/images/health/avatar-1.webp" alt="" class="health-avatar">
                <img src="/images/health/avatar-2.webp" alt="" class="health-avatar">
                <img src="/images/health/avatar-3.webp" alt="" class="health-avatar">
                <img src="/images/health/avatar-4.webp" alt="" class="health-avatar">
              </div>
              <span class="health-badge__metric">2,650+</span>
            </div>
            <span class="health-badge__label">patients have trusted us</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Explore Care Section -->
    <section id="explore-care" class="explore-care" aria-labelledby="explore-care-title">
      <div class="health-container">
        <h2 id="explore-care-title" class="health-section-title">
          Explore Care
        </h2>

        <div class="explore-care__grid">
          <!-- Card 1: Health Checkups -->
          <article class="care-card" @click="openConsultModal('Health Checkups')">
            <div class="care-card__header">
              <div class="care-card__icon-wrap">
                <img src="/images/health/checkups.webp" alt="" class="care-card__icon" aria-hidden="true">
              </div>
              <div class="care-card__text">
                <h3 class="care-card__title">Health Checkups</h3>
                <p class="care-card__desc">Understand your health in one visit.</p>
              </div>
            </div>
            <div class="care-card__corner-action" aria-label="Learn more about Health Checkups">
              <span class="care-card__arrow-btn">
                <img src="/images/health/arrow-right.svg" alt="" aria-hidden="true">
              </span>
            </div>
          </article>

          <!-- Card 2: Dental Care -->
          <article class="care-card" @click="openConsultModal('Dental Care')">
            <div class="care-card__header">
              <div class="care-card__icon-wrap">
                <img src="/images/health/dental.webp" alt="" class="care-card__icon" aria-hidden="true">
              </div>
              <div class="care-card__text">
                <h3 class="care-card__title">Dental Care</h3>
                <p class="care-card__desc">Routine and professional dental care.</p>
              </div>
            </div>
            <div class="care-card__corner-action" aria-label="Learn more about Dental Care">
              <span class="care-card__arrow-btn">
                <img src="/images/health/arrow-right.svg" alt="" aria-hidden="true">
              </span>
            </div>
          </article>

          <!-- Card 3: Eye & Vision Care -->
          <article class="care-card" @click="openConsultModal('Eye & Vision Care')">
            <div class="care-card__header">
              <div class="care-card__icon-wrap">
                <img src="/images/health/eye.webp" alt="" class="care-card__icon" aria-hidden="true">
              </div>
              <div class="care-card__text">
                <h3 class="care-card__title">Eye &amp; Vision Care</h3>
                <p class="care-card__desc">Eye exams and vision health.</p>
              </div>
            </div>
            <div class="care-card__corner-action" aria-label="Learn more about Eye & Vision Care">
              <span class="care-card__arrow-btn">
                <img src="/images/health/arrow-right.svg" alt="" aria-hidden="true">
              </span>
            </div>
          </article>

          <!-- Card 4: Health Concierge -->
          <article class="care-card" @click="openConsultModal('Health Concierge')">
            <div class="care-card__header">
              <div class="care-card__icon-wrap">
                <img src="/images/health/concierge.webp" alt="" class="care-card__icon" aria-hidden="true">
              </div>
              <div class="care-card__text">
                <h3 class="care-card__title">Health Concierge</h3>
                <p class="care-card__desc">Tell us what you need.</p>
              </div>
            </div>
            <div class="care-card__corner-action" aria-label="Learn more about Health Concierge">
              <span class="care-card__arrow-btn">
                <img src="/images/health/arrow-right.svg" alt="" aria-hidden="true">
              </span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Why LVYV Care Section -->
    <section class="why-care" aria-labelledby="why-care-title">
      <div class="health-container">
        <h2 id="why-care-title" class="health-section-title health-section-title--why">
          Why LVYV Care
        </h2>

        <div class="why-care__grid">
          <!-- Card 1 -->
          <article class="why-card">
            <div class="why-card__media">
              <img src="/images/health/why-1.webp" alt="Clear pricing and details before booking" class="why-card__img" loading="lazy">
            </div>
            <div class="why-card__body">
              <h3 class="why-card__title">Clear before you book</h3>
              <p class="why-card__desc">
                Know what is included, the expected time and pricing before confirmation.
              </p>
            </div>
          </article>

          <!-- Card 2 -->
          <article class="why-card">
            <div class="why-card__media">
              <img src="/images/health/why-2.webp" alt="Selected healthcare providers" class="why-card__img" loading="lazy">
            </div>
            <div class="why-card__body">
              <h3 class="why-card__title">Selected providers</h3>
              <p class="why-card__desc">
                Provider information is shown clearly before confirmation.
              </p>
            </div>
          </article>

          <!-- Card 3 -->
          <article class="why-card">
            <div class="why-card__media">
              <img src="/images/health/why-3.webp" alt="One care journey platform" class="why-card__img" loading="lazy">
            </div>
            <div class="why-card__body">
              <h3 class="why-card__title">One care journey</h3>
              <p class="why-card__desc">
                Booking, reminders and appointment status live in My Care.
              </p>
            </div>
          </article>

          <!-- Card 4 -->
          <article class="why-card">
            <div class="why-card__media">
              <img src="/images/health/why-4.webp" alt="English speaking healthcare coordination" class="why-card__img" loading="lazy">
            </div>
            <div class="why-card__body">
              <h3 class="why-card__title">English support</h3>
              <p class="why-card__desc">
                A single point of contact for booking and coordination.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Disclaimer / Banner Section -->
    <section class="care-disclaimer" aria-label="Healthcare Disclaimer">
      <div class="health-container care-disclaimer__container">
        <div class="care-disclaimer__brand">
          <img src="/images/health/care-logo.svg" alt="" class="care-disclaimer__logo" aria-hidden="true">
          <span class="care-disclaimer__name">LVYV Care</span>
        </div>
        <p class="care-disclaimer__text">
          Medical services are provided by independent licensed healthcare providers. LVYV coordinates bookings, communication and travel-related support.
        </p>
      </div>
    </section>

    <!-- Consultation Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="consultModalOpen" class="consult-modal-backdrop" @click="consultModalOpen = false">
          <div class="consult-modal" role="dialog" aria-modal="true" aria-labelledby="consult-modal-title" @click.stop>
            <button type="button" class="consult-modal__close" aria-label="Close dialog" @click="consultModalOpen = false">
              &times;
            </button>

            <div v-if="!submitted">
              <div class="consult-modal__header">
                <div class="consult-modal__pill">
                  <img src="/images/health/care-logo.svg" alt="" width="20" height="20" aria-hidden="true">
                  <span>LVYV Care Consultation</span>
                </div>
                <h3 id="consult-modal-title" class="consult-modal__title">
                  Talk to a Care Coordinator
                </h3>
                <p class="consult-modal__subtitle">
                  Tell us your healthcare needs in China. Our English-speaking team will contact you within 24 hours.
                </p>
              </div>

              <form class="consult-form" @submit.prevent="submitConsultation">
                <div class="form-group">
                  <label for="consult-name">Full Name *</label>
                  <input
                    id="consult-name"
                    v-model="form.name"
                    type="text"
                    required
                    placeholder="e.g. Alex Johnson"
                    class="form-input"
                  >
                </div>

                <div class="form-group">
                  <label for="consult-email">Email Address *</label>
                  <input
                    id="consult-email"
                    v-model="form.email"
                    type="email"
                    required
                    placeholder="alex@example.com"
                    class="form-input"
                  >
                </div>

                <div class="form-group">
                  <label for="consult-service">Service of Interest</label>
                  <select id="consult-service" v-model="form.service" class="form-select">
                    <option value="Health Checkups">Health Checkups</option>
                    <option value="Dental Care">Dental Care</option>
                    <option value="Eye & Vision Care">Eye &amp; Vision Care</option>
                    <option value="Health Concierge">Health Concierge</option>
                    <option value="General Consultation">General Consultation</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="consult-message">Your Requirements or Questions</label>
                  <textarea
                    id="consult-message"
                    v-model="form.message"
                    rows="3"
                    placeholder="City you are visiting, preferred dates, specific medical questions..."
                    class="form-textarea"
                  />
                </div>

                <button type="submit" class="consult-submit-btn" :disabled="submitting">
                  {{ submitting ? 'Submitting...' : 'Submit Request' }}
                </button>

                <div class="consult-direct">
                  <span>Or contact directly:</span>
                  <a href="mailto:care@lvyv.com" class="consult-direct-link">care@lvyv.com</a>
                </div>
              </form>
            </div>

            <div v-else class="consult-success">
              <div class="consult-success__icon" aria-hidden="true">&#10003;</div>
              <h3 class="consult-success__title">Thank you, {{ form.name }}!</h3>
              <p class="consult-success__text">
                Your request regarding <strong>{{ form.service }}</strong> has been received. Our Care Coordinator will reach out to <strong>{{ form.email }}</strong> shortly.
              </p>
              <button type="button" class="consult-submit-btn" @click="consultModalOpen = false">
                Done
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const title = 'Healthcare in China, Made Easier | LVYV Care'
const description = 'Health checkups, dental care, eye care and more in China — with clear information, selected providers and English-speaking coordination.'

useLvyvSeo({
  title,
  description,
  path: '/health',
  image: '/images/health/hero.webp',
  jsonLd: [
    webPageJsonLd(title, description, '/health'),
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Health', path: '/health' }
    ])
  ]
})

const consultModalOpen = ref(false)
const submitting = ref(false)
const submitted = ref(false)

const form = reactive({
  name: '',
  email: '',
  service: 'Health Checkups',
  message: ''
})

const openConsultModal = (serviceName?: string) => {
  if (serviceName) {
    form.service = serviceName
  }
  submitted.value = false
  consultModalOpen.value = true
}

const submitConsultation = async () => {
  submitting.value = true
  try {
    // Simulated submission delay
    await new Promise(resolve => setTimeout(resolve, 600))
    submitted.value = true
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.health-page {
  position: relative;
  width: 100%;
  background: #ffffff;
  color: #203d33;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow-x: hidden;
}

.health-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 40px;
}

/* ==========================================================================
   Hero Section
   ========================================================================== */
.health-hero {
  padding: 120px 0 80px;
  background: #ffffff;
}

.health-hero__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 48px;
}

.health-hero__content {
  flex: 1;
  max-width: 620px;
}

.health-hero__title {
  margin: 0;
  color: #105446;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: clamp(40px, 4.8vw, 72px);
  font-weight: 500;
  line-height: 1.25;
  letter-spacing: -0.03em;
}

.health-hero__title-in {
  color: #698e4e;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-style: italic;
  font-weight: 500;
}

.health-hero__subtitle {
  margin: 28px 0 0;
  color: #64748b;
  font-size: 19px;
  line-height: 1.7;
  letter-spacing: -0.01em;
  max-width: 540px;
}

.health-hero__actions {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 44px;
  flex-wrap: wrap;
}

.health-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 36px;
  border-radius: 999px;
  font-size: 17px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
}

.health-btn--primary {
  background-color: #105446;
  color: #cff380;
  border: 1px solid #105446;
  box-shadow: 0 8px 24px rgba(16, 84, 70, 0.15);
}

.health-btn--primary:hover {
  background-color: #0c4338;
  color: #cff380;
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(16, 84, 70, 0.22);
}

.health-btn--outline {
  background-color: transparent;
  color: #105446;
  border: 1.5px solid #105446;
}

.health-btn--outline:hover {
  background-color: rgba(16, 84, 70, 0.05);
  transform: translateY(-2px);
}

/* Hero Visual & Badges */
.health-hero__visual {
  position: relative;
  flex: 0 0 540px;
  width: 540px;
  height: 520px;
}

.health-hero__image-wrapper {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 480px;
  height: 460px;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 20px 48px rgba(21, 75, 63, 0.12);
}

.health-hero__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.health-badge {
  position: absolute;
  background: #ffffff;
  border: 1px solid #ecf4fd;
  border-radius: 20px;
  box-shadow: 0 16px 36px rgba(21, 75, 63, 0.08), 0 4px 12px rgba(0, 0, 0, 0.03);
  z-index: 2;
  backdrop-filter: blur(8px);
}

.health-badge--top-right {
  top: 0;
  right: 0;
  padding: 16px 22px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.health-badge--top-right .health-badge__metric {
  font-size: 42px;
  font-weight: 700;
  color: #105446;
  line-height: 1;
}

.health-badge--top-right .health-badge__label {
  font-size: 14px;
  color: #64748b;
  line-height: 1.35;
  text-transform: capitalize;
}

.health-badge--bottom-left {
  bottom: 0;
  left: 0;
  padding: 18px 22px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.health-badge__row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.health-badge__avatars {
  display: flex;
  align-items: center;
}

.health-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  object-fit: cover;
  margin-left: -12px;
}

.health-avatar:first-child {
  margin-left: 0;
}

.health-badge--bottom-left .health-badge__metric {
  font-size: 34px;
  font-weight: 700;
  color: #105446;
  line-height: 1;
}

.health-badge--bottom-left .health-badge__label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

/* ==========================================================================
   Explore Care Section
   ========================================================================== */
.explore-care {
  background-color: #e8f0eb;
  padding: 96px 0 110px;
}

.health-section-title {
  margin: 0 0 48px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: clamp(34px, 3.6vw, 46px);
  font-weight: 600;
  color: #105446;
  letter-spacing: -0.02em;
}

.explore-care__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
}

.care-card {
  position: relative;
  background: #ffffff;
  border-radius: 18px;
  padding: 36px 36px 36px 40px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 16px rgba(21, 75, 63, 0.04);
}

.care-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 40px rgba(21, 75, 63, 0.09);
}

.care-card__header {
  display: flex;
  align-items: flex-start;
  gap: 28px;
  padding-right: 60px;
}

.care-card__icon-wrap {
  width: 52px;
  height: 52px;
  flex: 0 0 52px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.care-card__icon {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.care-card__title {
  margin: 0 0 10px;
  font-size: 28px;
  font-weight: 600;
  color: #091e29;
  letter-spacing: -0.01em;
}

.care-card__desc {
  margin: 0;
  font-size: 17px;
  line-height: 1.5;
  color: #475569;
}

.care-card__corner-action {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 76px;
  height: 54px;
  background: #cff380;
  border-top-left-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
}

.care-card:hover .care-card__corner-action {
  background: #c2ea6e;
}

.care-card__arrow-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s ease;
}

.care-card:hover .care-card__arrow-btn {
  transform: translateX(4px);
}

.care-card__arrow-btn img {
  width: 20px;
  height: 20px;
}

/* ==========================================================================
   Why LVYV Care Section
   ========================================================================== */
.why-care {
  background: #ffffff;
  padding: 100px 0 120px;
}

.health-section-title--why {
  color: #2a573f;
  margin-bottom: 56px;
}

.why-care__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;
}

.why-card {
  display: flex;
  flex-direction: column;
}

.why-card__media {
  width: 100%;
  height: 240px;
  border-radius: 16px;
  overflow: hidden;
  background: #f1f5f9;
}

.why-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.why-card:hover .why-card__img {
  transform: scale(1.04);
}

.why-card__body {
  padding-top: 24px;
}

.why-card__title {
  margin: 0 0 12px;
  font-size: 22px;
  font-weight: 600;
  color: #091e29;
  letter-spacing: -0.01em;
}

.why-card__desc {
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
  color: #475569;
}

/* ==========================================================================
   Care Disclaimer Section
   ========================================================================== */
.care-disclaimer {
  background-color: #152723;
  padding: 60px 0;
  color: #ffffff;
}

.care-disclaimer__container {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.care-disclaimer__brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.care-disclaimer__logo {
  width: 30px;
  height: 30px;
}

.care-disclaimer__name {
  color: #cff380;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.care-disclaimer__text {
  margin: 0;
  max-width: 720px;
  color: rgba(255, 255, 255, 0.82);
  font-size: 14.5px;
  line-height: 1.8;
  letter-spacing: 0.02em;
}

/* ==========================================================================
   Consultation Modal
   ========================================================================== */
.consult-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(10, 25, 20, 0.6);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.consult-modal {
  position: relative;
  background: #ffffff;
  border-radius: 24px;
  padding: 40px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
  max-height: 90vh;
  overflow-y: auto;
}

.consult-modal__close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  font-size: 28px;
  line-height: 1;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s ease;
}

.consult-modal__close:hover {
  color: #105446;
}

.consult-modal__pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #eef6f2;
  color: #105446;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 16px;
}

.consult-modal__title {
  margin: 0 0 10px;
  font-size: 26px;
  font-weight: 700;
  color: #105446;
  letter-spacing: -0.02em;
}

.consult-modal__subtitle {
  margin: 0 0 24px;
  font-size: 15px;
  line-height: 1.5;
  color: #64748b;
}

.consult-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 13.5px;
  font-weight: 600;
  color: #334155;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-family: inherit;
  font-size: 15px;
  color: #1e293b;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: #105446;
  box-shadow: 0 0 0 3px rgba(16, 84, 70, 0.12);
}

.consult-submit-btn {
  margin-top: 8px;
  padding: 14px 24px;
  background: #105446;
  color: #cff380;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.consult-submit-btn:hover:not(:disabled) {
  background: #0c4338;
}

.consult-submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.consult-direct {
  margin-top: 10px;
  text-align: center;
  font-size: 13.5px;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.consult-direct-link {
  color: #105446;
  font-weight: 600;
  text-decoration: none;
}

.consult-direct-link:hover {
  text-decoration: underline;
}

.consult-success {
  text-align: center;
  padding: 30px 10px;
}

.consult-success__icon {
  width: 60px;
  height: 60px;
  background: #eef6f2;
  color: #105446;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin: 0 auto 20px;
}

.consult-success__title {
  margin: 0 0 12px;
  font-size: 24px;
  font-weight: 700;
  color: #105446;
}

.consult-success__text {
  margin: 0 0 28px;
  font-size: 15px;
  line-height: 1.6;
  color: #475569;
}

/* ==========================================================================
   Responsive Adaptations
   ========================================================================== */
@media (max-width: 1100px) {
  .health-hero__container {
    flex-direction: column;
    text-align: left;
    gap: 40px;
  }

  .health-hero__content {
    max-width: 100%;
  }

  .health-hero__visual {
    width: 100%;
    max-width: 500px;
    height: 480px;
    margin: 0 auto;
  }

  .why-care__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }
}

@media (max-width: 768px) {
  .health-container {
    padding: 0 20px;
  }

  .health-hero {
    padding: 100px 0 50px;
  }

  .health-hero__subtitle {
    font-size: 17px;
  }

  .health-hero__actions {
    flex-direction: column;
    align-items: stretch;
  }

  .health-hero__visual {
    width: 100%;
    max-width: 100%;
    height: 380px;
  }

  .health-hero__image-wrapper {
    top: 10px;
    left: 0;
    width: 100%;
    height: 330px;
    border-radius: 20px;
  }

  .health-badge--top-right {
    top: -10px;
    right: 10px;
    padding: 10px 14px;
    gap: 8px;
  }

  .health-badge--top-right .health-badge__metric {
    font-size: 28px;
  }

  .health-badge--top-right .health-badge__label {
    font-size: 11.5px;
  }

  .health-badge--bottom-left {
    bottom: -10px;
    left: 10px;
    padding: 12px 16px;
  }

  .health-avatar {
    width: 28px;
    height: 28px;
    margin-left: -8px;
  }

  .health-badge--bottom-left .health-badge__metric {
    font-size: 24px;
  }

  .health-badge--bottom-left .health-badge__label {
    font-size: 12px;
  }

  .explore-care {
    padding: 60px 0 70px;
  }

  .explore-care__grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .care-card {
    padding: 24px 20px 28px 24px;
  }

  .care-card__title {
    font-size: 22px;
  }

  .why-care {
    padding: 60px 0 80px;
  }

  .why-care__grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .why-card__media {
    height: 210px;
  }

  .consult-modal {
    padding: 28px 20px;
  }
}
</style>
