<template>
  <main class="modern-auth-page">
    <AuthMobileHeader />
    <section class="modern-auth-panel modern-auth-panel-login">
      <div class="modern-auth-content">
        <h1>Welcome back!</h1>

        <p v-if="message" class="modern-auth-message" :class="{ error }" role="alert">{{ message }}</p>

        <p v-if="!ready" class="modern-auth-message" role="status">Loading sign-in. If this message remains, refresh the page and make sure JavaScript is enabled.</p>

        <button class="modern-auth-google" type="button" :disabled="!ready || loading" @click="handleGoogleLogin">
          <img src="/images/auth/google-icon.svg" alt="">
          <span>{{ loading ? 'Redirecting...' : 'Log in with Google' }}</span>
        </button>

        <div class="modern-auth-divider"><span>OR</span></div>

        <form class="modern-auth-form" method="post" action="/login/" @submit.prevent="submit">
          <label class="modern-auth-field" for="email">
            <span>E-mail</span>
            <input
              id="email"
              ref="emailInput"
              v-model.trim="email"
              type="email"
              autocomplete="username"
              required
              placeholder="example@gmail.com"
            >
          </label>

          <label class="modern-auth-field" for="password">
            <span>Password</span>
            <span class="modern-auth-password">
              <input
                id="password"
                ref="passwordInput"
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
            <NuxtLink to="/auth/forgot-password/">Forgot Password?</NuxtLink>
          </div>

          <button class="modern-auth-primary" type="submit" :disabled="!ready || loading">
            {{ loading ? 'Logging in...' : 'Log in' }}
          </button>
        </form>

        <p class="modern-auth-footer-link">
          Don't have an account? <NuxtLink to="/register/">Sign up</NuxtLink>
        </p>
      </div>
    </section>

    <AuthVisualPanel />
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})
useNoIndex()

const route = useRoute()
const email = ref(typeof route.query.account === 'string'
  ? route.query.account
  : typeof route.query.email === 'string' ? route.query.email : '')
const password = ref('')
const emailInput = ref<HTMLInputElement | null>(null)
const passwordInput = ref<HTMLInputElement | null>(null)
const ready = ref(false)
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)
const message = ref('')
const error = ref(false)
const auth = useMemberAuth()

const handleGoogleLogin = async () => {
  loading.value = true
  const requestedRedirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
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
  ready.value = true
})

const submit = async () => {
  if (!ready.value || loading.value) return

  // 自动填充可能不触发 input 事件，读取实际输入值；不设置 name，防止原生提交序列化凭证。
  email.value = (emailInput.value?.value ?? '').trim()
  password.value = passwordInput.value?.value ?? ''
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
    const requestedRedirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    const redirect = requestedRedirect.startsWith('/') && !requestedRedirect.startsWith('//') ? requestedRedirect : '/'
    // 登录后重新加载目标页，让根路径 Cookie 在支付页/支付结果页的 SSR 请求中立即可见。
    if (import.meta.client) {
      window.location.replace(redirect)
      return
    }
    await navigateTo(redirect, { replace: true })
  } catch (caught) {
    if (caught instanceof ApiRequestError && caught.code === 1_003_000_006) {
      await navigateTo(`/register/?verify=${encodeURIComponent(email.value)}`)
      return
    }
    error.value = true
    message.value = caught instanceof Error ? caught.message : 'Unable to log in'
  } finally {
    loading.value = false
  }
}
</script>
