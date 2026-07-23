<template>
  <main class="auth-page">
    <div class="auth-layout auth-layout-authentication">
      <section class="auth-shell auth-shell-forgot">
        <div class="auth-form-wrap">
          <h1 class="auth-title">Forgot your password?</h1>

          <p class="auth-forgot-desc">
            Enter the email address associated with your account and we'll send
            you a link to reset your password.
          </p>

          <p v-if="message" class="auth-message" :class="{ error }" role="alert">{{ message }}</p>

          <form class="auth-fields" @submit.prevent="submit" novalidate>
            <!-- Email -->
            <div class="auth-input-group">
              <div class="auth-input-wrap">
                <input id="forgot-email" v-model.trim="email" type="email" autocomplete="email" required placeholder="Enter your Email">
              </div>
            </div>

            <!-- Submit button -->
            <button class="auth-submit auth-submit-forgot" :disabled="loading">
              {{ loading ? 'Sending...' : 'Send password reset instructions' }}
            </button>
          </form>

          <!-- Divider -->
          <div class="auth-divider"></div>
        </div>

        <div class="auth-signup-offer">
          <NuxtLink to="/login" class="auth-signup-link" style="color: #8f8f8f;">Back to login</NuxtLink>
        </div>
      </section>

      <!-- Hero carousel -->
      <AuthHeroCarousel :images="heroImages" />
    </div>
  </main>
</template>

<script setup lang="ts">
interface CarouselImage {
  url: string
  alt?: string
}

const heroImages: CarouselImage[] = [
  {
    url: '/images/auth/hero-signin.jpg',
    mobile: '/images/auth/hero-signin-mobile.jpg',
    desktop: '/images/auth/hero-signin.jpg',
    alt: 'Beautiful landscape'
  }
]

useHead({
  link: [
    { rel: 'preload', as: 'image', href: '/images/auth/hero-signin-mobile.jpg', media: '(max-width: 900px)' },
    { rel: 'preload', as: 'image', href: '/images/auth/hero-signin.jpg', media: '(min-width: 901px)' }
  ]
})

const email = ref('')
const loading = ref(false)
const message = ref('')
const error = ref(false)
const auth = useMemberAuth()

const submit = async () => {
  loading.value = true
  error.value = false

  if (!email.value) {
    error.value = true
    message.value = 'Please fill out this field.'
    loading.value = false
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    error.value = true
    message.value = 'Please enter a valid email address.'
    loading.value = false
    return
  }

  try {
    await auth.forgotPassword(email.value)
    message.value = 'If a verified account exists, a password reset link has been sent.'
  } catch (e) {
    error.value = true
    message.value = e instanceof Error ? e.message : 'Unable to submit request'
  } finally {
    loading.value = false
  }
}
</script>
