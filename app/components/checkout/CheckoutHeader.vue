<template>
  <header class="checkout-navbar">
    <div class="nav-container">
      <NuxtLink to="/" class="brand">
        <span class="brand-logo wish-brand-logo" aria-label="Lvyv Logo">
          <img src="/images/wish/logo-main.svg" alt="" loading="eager" decoding="sync">
          <img src="/images/wish/logo-accent.svg" alt="" loading="eager" decoding="sync">
        </span>
        <img src="/images/common/logo-header.svg" alt="Lvyv Logo" class="brand-logo brand-logo--default">
      </NuxtLink>

      <div class="nav-actions">
        <!-- Language Selector -->
        <div class="lang-selector">
          <FontAwesomeIcon :icon="faGlobe" class="lang-icon" aria-hidden="true" />
          <span class="lang-text">EN</span>
        </div>

        <!-- Member Account Status -->
        <div v-if="memberToken" ref="accountMenu" class="member-account">
          <button class="member-trigger" type="button" :aria-expanded="accountOpen" aria-haspopup="menu" @click="accountOpen = !accountOpen">
            <img v-if="member?.avatarUrl && !avatarFailed" :src="member.avatarUrl" alt="" class="member-avatar" @error="avatarFailed = true">
            <span v-else class="member-avatar member-avatar-default"><FontAwesomeIcon :icon="faUser" aria-hidden="true" /></span>
            <span class="member-name">{{ memberDisplayName }}</span>
            <span class="member-chevron" aria-hidden="true" />
          </button>
          <Transition name="dropdown-fade">
            <div v-if="accountOpen" class="member-menu" role="menu">
              <NuxtLink to="/profile" role="menuitem" @click="accountOpen = false">My Profile</NuxtLink>
              <button type="button" role="menuitem" @click="logout">Log out</button>
            </div>
          </Transition>
        </div>
        <a v-else href="/login/" class="nav-login">
          <span>Login</span>
        </a>

        <!-- Start Your Wish Button -->
        <NuxtLink :to="startWishPath" class="nav-start-planning">
          Start Your Wish
        </NuxtLink>

        <!-- Mobile Nav Toggle Button -->
        <button
          class="mobile-nav-toggle"
          type="button"
          :class="{ 'open': mobileMenuOpen }"
          :aria-expanded="mobileMenuOpen"
          aria-label="Toggle Navigation"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <span class="hamburger-line" />
          <span class="hamburger-line" />
          <span class="hamburger-line" />
        </button>
      </div>
    </div>

    <!-- Mobile Drawer Backdrop Overlay -->
    <Transition name="fade">
      <div
        v-if="mobileMenuOpen"
        class="mobile-menu-backdrop"
        @click="mobileMenuOpen = false"
        @touchmove.prevent
      />
    </Transition>

    <!-- Mobile Navigation Drawer -->
    <Transition name="slide-drawer">
      <div v-if="mobileMenuOpen" class="mobile-menu-drawer">
        <div class="mobile-drawer-header">
          <NuxtLink to="/" class="brand" @click="mobileMenuOpen = false">
            <img src="/images/common/logo-header.svg" alt="Lvyv Logo" class="brand-logo">
          </NuxtLink>
          <button class="mobile-drawer-close" type="button" aria-label="Close menu" @click="mobileMenuOpen = false">
            <FontAwesomeIcon :icon="faTimes" aria-hidden="true" />
          </button>
        </div>

        <div class="mobile-drawer-body">
          <nav class="mobile-nav-links">
            <NuxtLink to="/#hero" class="mobile-nav-item" @click="mobileMenuOpen = false">Home</NuxtLink>
            <NuxtLink to="/wish" class="mobile-nav-item" @click="mobileMenuOpen = false">Wish</NuxtLink>
            <NuxtLink to="/encounters" class="mobile-nav-item" @click="mobileMenuOpen = false">Encounters</NuxtLink>
            <NuxtLink to="/about" class="mobile-nav-item" @click="mobileMenuOpen = false">About</NuxtLink>
            <NuxtLink to="/en/faq/" class="mobile-nav-item" @click="mobileMenuOpen = false">FAQ</NuxtLink>
          </nav>
        </div>

        <div class="mobile-drawer-footer">
          <div v-if="memberToken" class="mobile-drawer-user">
            <div class="mobile-user-info">
              <img v-if="member?.avatarUrl && !avatarFailed" :src="member.avatarUrl" alt="" class="member-avatar" @error="avatarFailed = true">
              <span v-else class="member-avatar member-avatar-default"><FontAwesomeIcon :icon="faUser" aria-hidden="true" /></span>
              <span class="mobile-user-name">{{ memberDisplayName }}</span>
            </div>
            <div class="mobile-user-actions">
              <NuxtLink to="/profile" class="mobile-user-link" @click="mobileMenuOpen = false">My Profile</NuxtLink>
              <button type="button" class="mobile-logout-btn" @click="logout">Log out</button>
            </div>
          </div>
          <div v-else class="mobile-drawer-auth">
            <a href="/login/" class="mobile-drawer-login-btn" @click="mobileMenuOpen = false">
              <FontAwesomeIcon :icon="faUser" aria-hidden="true" />
              <span>Login / Sign Up</span>
            </a>
          </div>

          <NuxtLink :to="startWishPath" class="mobile-start-planning-btn" @click="mobileMenuOpen = false">
            Start Your Wish
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGlobe, faUser, faTimes } from '@fortawesome/free-solid-svg-icons'

const { token: memberToken, member, loadMember, clearSession, logout: logoutMember } = useMemberAuth()

const accountOpen = ref(false)
const accountMenu = ref<HTMLElement | null>(null)
const avatarFailed = ref(false)
const mobileMenuOpen = ref(false)

const startWishPath = computed(() => memberToken.value
  ? '/wish/create'
  : `/login/?redirect=${encodeURIComponent('/wish/create')}`)

const tokenDisplayName = computed(() => {
  if (!memberToken.value) return ''
  try {
    const encodedPayload = memberToken.value.split('.')[1]
    if (!encodedPayload) return ''
    const base64 = encodedPayload.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(encodedPayload.length / 4) * 4, '=')
    const bytes = Uint8Array.from(atob(base64), character => character.charCodeAt(0))
    const payload = JSON.parse(new TextDecoder().decode(bytes))
    const nickname = typeof payload.nickname === 'string' ? payload.nickname.trim() : ''
    if (nickname) return nickname
    return typeof payload.sub === 'string' ? payload.sub.split('@')[0] : ''
  } catch {
    return ''
  }
})

const memberDisplayName = computed(() => member.value?.nickname?.trim()
  || member.value?.email?.split('@')[0]
  || tokenDisplayName.value)

const logout = async () => {
  accountOpen.value = false
  mobileMenuOpen.value = false
  await logoutMember()
  await navigateTo('/')
}

const handleDocumentClick = (event: MouseEvent) => {
  if (accountMenu.value && !accountMenu.value.contains(event.target as Node)) {
    accountOpen.value = false
  }
}

watch(() => member.value?.avatarUrl, () => {
  avatarFailed.value = false
})

watch(memberToken, async (value) => {
  if (!value) {
    accountOpen.value = false
    return
  }
  if (!member.value) {
    try {
      await loadMember()
    } catch {
      clearSession()
    }
  }
})

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
  if (memberToken.value && !member.value) {
    loadMember().catch(clearSession)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>

<style scoped>
.checkout-navbar {
  position: relative !important;
  top: auto !important;
  left: auto !important;
  width: 100% !important;
  height: 80px !important;
  background-color: #203d33 !important;
  background: #203d33 !important;
  border: 0 !important;
  border-bottom: 0 !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  z-index: 10 !important;
}

.checkout-navbar .nav-container {
  width: 90%;
  max-width: 1440px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wish-brand-logo {
  position: relative;
  display: block !important;
  width: 120px;
  height: 41px;
  flex: 0 0 120px;
  line-height: 0;
}

.brand-logo--default {
  display: none !important;
}

.wish-brand-logo img {
  position: absolute;
  display: block;
  max-width: none;
}

.wish-brand-logo img:first-child {
  inset: 0 auto auto 0;
  width: 94.747px;
  height: 40.996px;
}

.wish-brand-logo img:last-child {
  top: 11.25px;
  left: 96.65px;
  width: 23.357px;
  height: 10.83px;
}

.lang-selector,
.nav-login,
.member-trigger {
  color: #ffffff !important;
}

.lang-selector:hover,
.nav-login:hover {
  color: rgba(255, 255, 255, 0.85) !important;
}

.mobile-nav-toggle .hamburger-line {
  background-color: #ffffff !important;
}

@media (max-width: 991px) {
  .wish-brand-logo {
    width: 106px;
    height: 37px;
    flex-basis: 106px;
  }

  .wish-brand-logo img:first-child {
    width: 83.7px;
    height: 36.24px;
  }

  .wish-brand-logo img:last-child {
    top: 9.94px;
    left: 85.38px;
    width: 20.63px;
    height: 9.56px;
  }
}
</style>
