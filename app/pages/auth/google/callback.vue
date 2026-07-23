<template>
  <main class="auth-page google-callback-page">
    <section class="auth-shell auth-shell-centered google-callback-shell">
      <p v-if="failed" class="auth-kicker">Google sign in</p>
      <h1>{{ title }}</h1>
      <p v-if="message" class="auth-intro">{{ message }}</p>
      <NuxtLink v-if="failed" class="auth-submit" to="/login">Back to login</NuxtLink>
    </section>
  </main>
</template>

<script setup lang="ts">
const route = useRoute()
const auth = useMemberAuth()
const title = ref('Signing you in...')
const message = ref('')
const failed = ref(false)

const safeRedirect = (value: unknown) => {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return '/wish'
  return value
}

onMounted(async () => {
  const error = typeof route.query.error === 'string' ? route.query.error : ''
  const ticket = typeof route.query.ticket === 'string' ? route.query.ticket : ''
  if (error || !ticket) {
    title.value = 'Unable to sign in'
    message.value = error === 'access_denied' ? 'Google authorization was cancelled.' : 'Google sign in could not be completed.'
    failed.value = true
    return
  }

  try {
    const result = await auth.googleExchange(ticket)
    auth.token.value = result.accessToken
    const member = await auth.loadMember()
    const redirect = safeRedirect(route.query.redirect)
    if (member && !member.passportCountryCode) {
      await navigateTo('/profile?complete=passport')
    } else {
      await navigateTo(redirect)
    }
  } catch (caught) {
    auth.clearSession()
    title.value = 'Unable to sign in'
    message.value = caught instanceof Error ? caught.message : 'Google sign in could not be completed.'
    failed.value = true
  }
})
</script>

<style scoped>
.google-callback-page {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-height: 100svh;
  padding: 80px 20px 0;
}

.google-callback-page > .google-callback-shell {
  width: min(100%, 460px);
  min-height: 0;
  margin: 0;
  padding: 32px 20px;
  text-align: center;
}

.google-callback-shell {
  min-height: 0;
}
</style>
