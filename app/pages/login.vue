<template>
  <main class="auth-page">
    <div class="auth-layout auth-layout-authentication">
      <section class="auth-shell auth-shell-login">
        <div class="auth-form-wrap">
          <h1 class="auth-title">Great to meet you!</h1>

          <p v-if="message" class="auth-message" :class="{ error }">{{ message }}</p>

          <form @submit.prevent="submit" novalidate>
            <div class="auth-fields">
              <!-- Email -->
              <div class="auth-input-group">
                <p class="auth-input-label">Login</p>
                <div class="auth-input-wrap">
                  <input
                    id="email"
                    v-model.trim="email"
                    type="email"
                    autocomplete="email"
                    required
                    placeholder="Enter you Email"
                  >
                </div>
              </div>

              <!-- Password -->
              <div class="auth-input-group">
                <p class="auth-input-label">Password</p>
                <div class="auth-input-wrap auth-input-wrap-password">
                  <input
                    id="password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    autocomplete="current-password"
                    required
                    placeholder="Enter password"
                  >
                  <button type="button" class="password-toggle" @click="showPassword = !showPassword" aria-label="Toggle password visibility">
                    <font-awesome-icon :icon="['fas', showPassword ? 'eye-slash' : 'eye']" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Remember me + Forgot password -->
            <div class="auth-row">
              <div class="auth-remember" @click="rememberMe = !rememberMe">
                <div class="toggle-switch" :class="{ active: rememberMe }">
                  <div class="toggle-knob"></div>
                </div>
                <p class="auth-remember-text">Remember me</p>
              </div>
              <NuxtLink to="/auth/forgot-password" class="auth-forgot-link">Forgot password?</NuxtLink>
            </div>

            <!-- Sign in button -->
            <button class="auth-submit" :disabled="loading">
              {{ loading ? 'Logging in...' : 'Sign in' }}
            </button>
          </form>

          <!-- Divider -->
          <div class="auth-divider"></div>

          <!-- Google sign in -->
          <button class="auth-google-btn" type="button" :disabled="loading" @click="handleGoogleLogin">
            <img src="/images/auth/google-icon.svg" alt="Google" class="google-icon">
            <span>{{ loading ? 'Redirecting...' : 'Or sign in with Google' }}</span>
          </button>
        </div>

        <!-- Sign up offer -->
        <div class="auth-signup-offer">
          <p class="auth-signup-text">Dont have an account?</p>
          <NuxtLink to="/register" class="auth-signup-link">Sign up now</NuxtLink>
        </div>
      </section>

      <!-- Hero image -->
      <section class="auth-hero auth-hero-stretch">
        <img :src="heroImageSrc" alt="Beautiful landscape" class="auth-hero-image" @error="onHeroError">
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
const heroImageSrc = '/images/auth/hero-signin.png'
const onHeroError = () => {
  console.error('Hero image failed to load:', heroImageSrc)
}

const route = useRoute()
const email = ref(typeof route.query.account === 'string'
  ? route.query.account
  : typeof route.query.email === 'string' ? route.query.email : '')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)
const message = ref('')
const error = ref(false)
const auth = useMemberAuth()

const handleGoogleLogin = async () => {
  loading.value = true
  const requestedRedirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/wish'
  auth.googleLogin(requestedRedirect)
}

const STORAGE_KEY = 'lvyv_remember_me'

const loadRememberedInfo = () => {
  if (import.meta.client) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        if (data.remember && data.email) {
          email.value = data.email
          rememberMe.value = true
        }
      }
    } catch {
      console.warn('Failed to load remembered info')
    }
  }
}

const saveRememberedInfo = () => {
  if (import.meta.client) {
    try {
      if (rememberMe.value && email.value) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          remember: true,
          email: email.value
        }))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      console.warn('Failed to save remembered info')
    }
  }
}

watch(rememberMe, () => {
  if (!rememberMe.value) {
    saveRememberedInfo()
  }
})

onMounted(() => {
  loadRememberedInfo()
})

const submit = async () => {
  loading.value = true
  message.value = ''
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

  if (!password.value) {
    error.value = true
    message.value = 'Please fill out this field.'
    loading.value = false
    return
  }

  try {
    await auth.login(email.value, password.value)
    saveRememberedInfo()
    const requestedRedirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/wish'
    const redirect = requestedRedirect.startsWith('/') && !requestedRedirect.startsWith('//') ? requestedRedirect : '/wish'
    await navigateTo(redirect)
  } catch (caught) {
    if (caught instanceof ApiRequestError && caught.code === 1_003_000_006) {
      await navigateTo(`/register?verify=${encodeURIComponent(email.value)}`)
      return
    }
    error.value = true
    message.value = caught instanceof Error ? caught.message : 'Unable to log in'
  } finally {
    loading.value = false
  }
}
</script>
