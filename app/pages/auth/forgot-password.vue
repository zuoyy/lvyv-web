<template>
  <main class="modern-auth-page">
    <section class="modern-auth-panel modern-auth-panel-forgot">
      <div class="modern-auth-content">
        <!-- Sent State (Figma Node 346:2286) -->
        <template v-if="emailSent">
          <h1>Recovery Email Sent!</h1>
          <p class="modern-auth-forgot-desc">
            Please check your email for next steps to reset your password.
          </p>

          <div class="modern-auth-forgot-actions">
            <a href="mailto:support@lvyv.com" class="modern-auth-secondary-btn">
              contact Support
            </a>

            <NuxtLink to="/login" class="modern-auth-primary modern-auth-accent-primary">
              BACK to login
            </NuxtLink>
          </div>
        </template>

        <!-- Form Input State (Figma Nodes 346:2235, 346:2278, 346:2280) -->
        <div v-else class="modern-auth-forgot-entry">
          <h1>Reset your password</h1>

          <p class="modern-auth-forgot-footer-desc">
            Type in your registered email address to reset password
          </p>

          <p v-if="message" class="modern-auth-message" :class="{ error }" role="alert">{{ message }}</p>

          <form class="modern-auth-forgot-form" novalidate @submit.prevent="submit">
            <div class="modern-auth-forgot-input-wrap">
              <input
                id="forgot-email"
                v-model.trim="email"
                type="email"
                autocomplete="email"
                aria-label="Email Address"
                required
                placeholder="Email Address *"
                :class="{ invalid: emailError }"
                @input="emailError = ''"
              >
              <small v-if="emailError">{{ emailError }}</small>
            </div>

            <!-- Next Button (Node 346:2280) -->
            <button type="submit" class="modern-auth-next-btn" :disabled="loading || !isEmailValid">
              <span>{{ loading ? 'Sending...' : 'Next' }}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
              </svg>
            </button>
          </form>

          <NuxtLink to="/login" class="modern-auth-forgot-back">
            BACK to login
          </NuxtLink>
        </div>
      </div>
    </section>

    <AuthVisualPanel />
  </main>
</template>

<script setup lang="ts">
const email = ref('')
const emailSent = ref(false)
const loading = ref(false)
const message = ref('')
const error = ref(false)
const emailError = ref('')
const auth = useMemberAuth()

const isEmailValid = computed(() => {
  return email.value.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())
})

const submit = async () => {
  emailError.value = ''
  message.value = ''
  error.value = false

  if (!email.value) {
    emailError.value = 'Please fill out this field.'
    return
  }

  if (!isEmailValid.value) {
    emailError.value = 'Please enter a valid email address.'
    return
  }

  loading.value = true

  try {
    await auth.forgotPassword(email.value)
    emailSent.value = true
  } catch (caught) {
    error.value = true
    message.value = caught instanceof Error ? caught.message : 'Unable to submit request'
  } finally {
    loading.value = false
  }
}
</script>
