<template>
  <main class="newsletter-confirm-page">
    <section class="newsletter-confirm-panel" aria-live="polite">
      <NuxtLink to="/" class="newsletter-confirm-logo" aria-label="Lvyv home">
        <img src="/images/common/logo-header.svg" alt="Lvyv">
      </NuxtLink>

      <span class="newsletter-confirm-icon" :class="{ error: !loading && !success }" aria-hidden="true">
        <font-awesome-icon :icon="['fas', loading ? 'envelope' : success ? 'circle-check' : 'circle-exclamation']" />
      </span>
      <p class="newsletter-confirm-kicker">Email subscription</p>
      <h1>{{ title }}</h1>
      <p class="newsletter-confirm-message">{{ message }}</p>

      <div v-if="!loading" class="newsletter-confirm-actions">
        <NuxtLink v-if="success" to="/wish" class="newsletter-confirm-primary">Start planning</NuxtLink>
        <NuxtLink to="/" class="newsletter-confirm-secondary">Return home</NuxtLink>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useNoIndex()

const route = useRoute()
const newsletter = useNewsletterSubscription()
const loading = ref(true)
const success = ref(false)
const title = ref('Confirming your subscription...')
const message = ref('Please wait while we confirm your email preferences.')

onMounted(async () => {
  const token = typeof route.query.token === 'string' ? route.query.token : ''
  if (!token) {
    loading.value = false
    title.value = 'Confirmation link incomplete'
    message.value = 'This link does not include a subscription token. Return to the homepage and request a new email.'
    return
  }

  try {
    const result = await newsletter.confirm(token)
    success.value = true
    title.value = result.status === 'ALREADY_SUBSCRIBED' ? 'You are already subscribed' : 'Subscription confirmed'
    message.value = 'Travel inspiration, hidden stories and selected LVYV updates can now reach your inbox.'
  } catch (error) {
    title.value = 'Unable to confirm subscription'
    message.value = error instanceof Error ? error.message : 'This confirmation link is invalid or expired.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.newsletter-confirm-page {
  display: grid;
  min-height: 100svh;
  place-items: center;
  padding: 32px 20px;
  background: #f4f6f2;
  color: #203d33;
}

.newsletter-confirm-panel {
  width: min(100%, 520px);
  padding: 44px;
  border: 1px solid #dfe5df;
  border-radius: 8px;
  background: #fff;
  text-align: center;
}

.newsletter-confirm-logo img {
  width: 112px;
  height: auto;
}

.newsletter-confirm-icon {
  display: grid;
  width: 52px;
  height: 52px;
  place-items: center;
  margin: 36px auto 22px;
  border-radius: 50%;
  background: #e8f3e5;
  color: #105446;
  font-size: 24px;
}

.newsletter-confirm-icon.error {
  background: #f9eaea;
  color: #9d3030;
}

.newsletter-confirm-kicker {
  margin: 0;
  color: #5c7068;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
}

h1 {
  margin: 12px 0 0;
  font-family: var(--font-heading);
  font-size: 32px;
  line-height: 1.2;
}

.newsletter-confirm-message {
  margin: 18px auto 0;
  color: #5c6964;
  font-size: 15px;
  line-height: 1.7;
}

.newsletter-confirm-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 30px;
}

.newsletter-confirm-actions a {
  display: inline-flex;
  min-height: 46px;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  border: 1px solid #105446;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 700;
}

.newsletter-confirm-primary {
  background: #105446;
  color: #cff380;
}

.newsletter-confirm-secondary {
  color: #105446;
}

@media (max-width: 560px) {
  .newsletter-confirm-panel { padding: 34px 22px; }
  .newsletter-confirm-actions { flex-direction: column; }
  h1 { font-size: 28px; }
}
</style>
