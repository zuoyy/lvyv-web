<template>
  <main class="modern-auth-page">
    <section class="modern-auth-panel modern-auth-panel-login">
      <div class="modern-auth-content">
        <h1>Welcome back!</h1>

        <p v-if="message" class="modern-auth-message" :class="{ error }" role="alert">{{ message }}</p>

        <button class="modern-auth-google" type="button" :disabled="loading" @click="handleGoogleLogin">
          <img src="/images/auth/google-icon.svg" alt="">
          <span>{{ loading ? 'Redirecting...' : 'Log in with Google' }}</span>
        </button>

        <div class="modern-auth-divider"><span>OR</span></div>

        <form class="modern-auth-form" novalidate @submit.prevent="submit">
          <label class="modern-auth-field" for="email">
            <span>E-mail</span>
            <input
              id="email"
              v-model.trim="email"
              type="email"
              autocomplete="email"
              required
              placeholder="example@gmail.com"
            >
          </label>

          <label class="modern-auth-field" for="password">
            <span>Password</span>
            <span class="modern-auth-password">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                placeholder="Enter your Password"
              >
              <button type="button" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Hide password' : 'Show password'">
                <font-awesome-icon :icon="['fas', showPassword ? 'eye-slash' : 'eye']" />
              </button>
            </span>
          </label>

          <div class="modern-auth-options">
            <label class="modern-auth-remember">
              <input v-model="rememberMe" type="checkbox">
              <span>Remember me</span>
            </label>
            <NuxtLink to="/auth/forgot-password">Forgot Password?</NuxtLink>
          </div>

          <button class="modern-auth-primary" :disabled="loading || !isLoginFormValid">
            {{ loading ? 'Logging in...' : 'Log in' }}
          </button>
        </form>

        <p class="modern-auth-footer-link">
          Don't have an account? <NuxtLink to="/register">Sign up</NuxtLink>
        </p>
      </div>
    </section>

    <AuthVisualPanel />
  </main>
</template>

<script setup lang="ts">
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

const isLoginFormValid = computed(() => {
  return email.value.trim().length > 0 && password.value.length > 0
})

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
