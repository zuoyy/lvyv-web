<template>
  <main class="modern-auth-page google-callback-page">
    <section class="modern-auth-panel google-callback-panel">
      <div
        class="google-callback-content"
        :class="{ 'is-failed': failed }"
        role="status"
        aria-live="polite"
        :aria-busy="!failed"
      >
        <div class="google-callback-mark" aria-hidden="true">
          <span v-if="!failed" class="google-callback-spinner" />
          <span class="google-callback-icon">
            <img v-if="!failed" src="/images/auth/google-icon.svg" alt="">
            <font-awesome-icon v-else :icon="['fas', 'xmark']" />
          </span>
        </div>

        <p class="google-callback-kicker">Secure Google sign-in</p>
        <h1>{{ title }}</h1>
        <p class="google-callback-message">
          {{ message || 'We are securely connecting your Google account to Lvyv.' }}
        </p>

        <div v-if="!failed" class="google-callback-progress" aria-hidden="true">
          <span />
        </div>

        <NuxtLink v-if="failed" class="google-callback-action" to="/login/">
          Back to login
        </NuxtLink>

        <p v-else class="google-callback-note">
          Your Google password stays with Google.
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
  background: #ffffff;
}

.google-callback-panel {
  background: #fbfcfa;
}

.google-callback-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(420px, 100%);
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  text-align: center;
}

.google-callback-mark {
  position: relative;
  display: grid;
  place-items: center;
  width: 88px;
  height: 88px;
  margin-bottom: 30px;
}

.google-callback-spinner {
  position: absolute;
  inset: 0;
  border: 2px solid #dfe7e1;
  border-top-color: #105446;
  border-right-color: #cff380;
  border-radius: 50%;
  animation: google-callback-spin 1.15s linear infinite;
}

.google-callback-icon {
  display: grid;
  place-items: center;
  width: 66px;
  height: 66px;
  border: 1px solid #e1e6e2;
  border-radius: 50%;
  box-shadow: 0 8px 24px rgba(32, 61, 51, 0.08);
  background: #ffffff;
}

.google-callback-icon img {
  width: 28px;
  height: 28px;
}

.google-callback-icon svg {
  width: 22px;
  height: 22px;
  color: #a63838;
}

.google-callback-kicker {
  margin: 0 0 12px;
  color: #698e4e;
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
  letter-spacing: 0;
  text-transform: uppercase;
}

.google-callback-content h1 {
  margin: 0;
  color: #203d33;
  font-family: 'Poppins', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 32px;
  font-weight: 500;
  line-height: 44px;
  letter-spacing: 0;
}

.google-callback-message {
  max-width: 360px;
  margin: 14px 0 0;
  color: #67728a;
  font-size: 15px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0;
}

.google-callback-progress {
  width: min(280px, 80%);
  height: 4px;
  margin-top: 32px;
  overflow: hidden;
  border-radius: 2px;
  background: #e6ebe7;
}

.google-callback-progress span {
  display: block;
  width: 42%;
  height: 100%;
  border-radius: inherit;
  background: #105446;
  animation: google-callback-progress 1.55s ease-in-out infinite;
}

.google-callback-note {
  margin: 18px 0 0;
  color: #8a938d;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0;
}

.google-callback-content.is-failed .google-callback-mark {
  margin-bottom: 28px;
}

.google-callback-content.is-failed .google-callback-icon {
  border-color: #ead6d6;
  background: #fff8f8;
  box-shadow: none;
}

.google-callback-content.is-failed .google-callback-kicker {
  color: #a63838;
}

.google-callback-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: min(280px, 100%);
  height: 52px;
  margin-top: 30px;
  border-radius: 8px;
  background: #105446;
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  line-height: 20px;
  text-decoration: none;
  transition: background-color 0.15s ease;
}

.google-callback-action:hover {
  background: #0c453a;
}

.google-callback-action:focus-visible {
  outline: 3px solid rgba(16, 84, 70, 0.2);
  outline-offset: 3px;
}

@keyframes google-callback-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes google-callback-progress {
  from {
    transform: translateX(-110%);
  }

  to {
    transform: translateX(340%);
  }
}

@media (max-width: 900px) {
  .google-callback-panel {
    padding: 48px 24px;
  }
}

@media (max-width: 520px) {
  .google-callback-panel {
    padding: 40px 24px;
  }

  .google-callback-mark {
    width: 80px;
    height: 80px;
    margin-bottom: 26px;
  }

  .google-callback-icon {
    width: 60px;
    height: 60px;
  }

  .google-callback-content h1 {
    font-size: 27px;
    line-height: 38px;
  }

  .google-callback-message {
    max-width: 320px;
    font-size: 14px;
    line-height: 22px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .google-callback-spinner {
    animation-duration: 2.4s;
  }

  .google-callback-progress span {
    width: 64%;
    animation: none;
  }
}
</style>
