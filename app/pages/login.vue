<template>
  <main class="auth-page">
    <section class="auth-shell">
      <p class="auth-kicker">Member access</p>
      <h1>Log in to Lvyv</h1>
      <p class="auth-intro">Return to your wishes, itineraries and travel conversations.</p>
      <p v-if="message" class="auth-message" :class="{ error }">{{ message }}</p>
      <form class="auth-form" @submit.prevent="submit">
        <div class="auth-field">
          <label for="account">Account</label>
          <input id="account" v-model.trim="account" type="email" autocomplete="username" required placeholder="you@example.com">
        </div>
        <div class="auth-field">
          <label for="password">Password</label>
          <input id="password" v-model="password" type="password" autocomplete="current-password" required minlength="6" placeholder="Your password">
        </div>
        <button class="auth-submit" :disabled="loading">{{ loading ? 'Logging in...' : 'Log in' }}</button>
      </form>
      <div class="auth-links">
        <NuxtLink to="/register">Create an account</NuxtLink>
        <NuxtLink to="/auth/forgot-password">Forgot password?</NuxtLink>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
const route = useRoute()
const account = ref(typeof route.query.account === 'string' ? route.query.account : '')
const password = ref('')
const loading = ref(false)
const message = ref('')
const error = ref(false)
const auth = useMemberAuth()
const submit = async () => {
  loading.value = true
  message.value = ''
  error.value = false
  try {
    await auth.login(account.value, password.value)
    const requestedRedirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/wish'
    const redirect = requestedRedirect.startsWith('/') && !requestedRedirect.startsWith('//') ? requestedRedirect : '/wish'
    await navigateTo(redirect)
  } catch (caught) {
    if (caught instanceof ApiRequestError && caught.code === 1_003_000_006) {
      await navigateTo(`/register?verify=${encodeURIComponent(account.value)}`)
      return
    }
    error.value = true
    message.value = caught instanceof Error ? caught.message : 'Unable to log in'
  } finally {
    loading.value = false
  }
}
</script>
