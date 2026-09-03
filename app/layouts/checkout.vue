<template>
  <div class="checkout-layout-shell">
    <header class="checkout-header">
      <NuxtLink to="/" class="checkout-brand" aria-label="Lvyv Home">
        <span class="brand-logo wish-brand-logo">
          <img src="/images/wish/logo-main.svg" alt="Lvyv" class="logo-main" loading="eager">
          <img src="/images/wish/logo-accent.svg" alt="旅遇" class="logo-accent" loading="eager">
        </span>
      </NuxtLink>

      <div class="checkout-header-actions">
        <div class="language-indicator">
          <font-awesome-icon :icon="faGlobe" class="lang-icon" aria-hidden="true" />
          <span>EN</span>
        </div>

        <NuxtLink v-if="!isLoggedIn" to="/login" class="login-link">
          Login
        </NuxtLink>
        <NuxtLink v-else to="/profile" class="login-link member-link">
          {{ memberName }}
        </NuxtLink>

        <NuxtLink to="/wish" class="wish-button">
          Start Your Wish
        </NuxtLink>
      </div>
    </header>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'

const auth = useMemberAuth()
const isLoggedIn = computed(() => Boolean(auth.token.value))
const memberName = computed(() => auth.member.value?.nickname || auth.member.value?.email?.split('@')[0] || 'My Account')
</script>

<style scoped>
.checkout-layout-shell {
  position: relative;
  min-height: 100vh;
  background-color: #f5f6f4;
  background-image: linear-gradient(to bottom, #1a382b 0, #1a382b 260px, #f5f6f4 260px, #f5f6f4 100%);
  color: #1a2b23;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.checkout-header {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 48px;
}

.checkout-brand {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.wish-brand-logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.logo-main {
  height: 32px;
  width: auto;
  display: block;
}

.logo-accent {
  height: 20px;
  width: auto;
  display: block;
}

.checkout-header-actions {
  display: flex;
  align-items: center;
  gap: 28px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
}

.language-indicator {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #ffffff;
  cursor: default;
}

.lang-icon {
  width: 14px;
  height: 14px;
  font-size: 14px;
}

.login-link {
  color: #ffffff;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.login-link:hover {
  opacity: 0.85;
}

.member-link {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wish-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 20px;
  border-radius: 20px;
  background-color: #144a39;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.2s ease, transform 0.1s ease;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.wish-button:hover {
  background-color: #185a45;
}

@media (max-width: 960px) {
  .checkout-header {
    padding: 0 24px;
  }
}

@media (max-width: 640px) {
  .checkout-header {
    height: 64px;
    padding: 0 16px;
  }

  .checkout-header-actions {
    gap: 16px;
    font-size: 13px;
  }

  .logo-main {
    height: 26px;
  }

  .logo-accent {
    height: 16px;
  }

  .wish-button {
    height: 36px;
    padding: 0 14px;
    font-size: 13px;
  }
}
</style>
