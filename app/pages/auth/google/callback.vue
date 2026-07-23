<template>
  <main class="auth-page">
    <section class="auth-shell auth-shell-centered google-callback-shell">
      <p class="auth-kicker">Google sign in</p>
      <h1>{{ title }}</h1>
      <p class="auth-intro">{{ message }}</p>
      <NuxtLink v-if="failed" class="auth-submit" to="/login">Back to login</NuxtLink>
    </section>
  </main>
</template>

<script setup lang="ts">
const route = useRoute()
const auth = useMemberAuth()
const title = ref('Completing sign in...')
const message = ref('Please wait while we finish connecting your Google account.')
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
    title.value = 'Signed in'
    message.value = 'Your Google account is now connected.'
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
.google-callback-shell {
  min-height: 360px;
}
</style>
