<template>
  <div class="app-layout" :class="{ 'app-layout--wish': isWishExperience, 'app-layout--encounters': isEncountersExperience, 'app-layout--home-with-announcement': isHomePage && !!homePromotions.announcement.value && !homePromotions.announcementDismissed.value }">
    <HomeAnnouncementBar v-if="isHomePage" :announcement="homePromotions.announcement.value" />
    <!-- Header / Navigation -->
    <header class="navbar" :class="{ 'scrolled': isScrolled }">
      <div class="nav-container">
        <NuxtLink :prefetch="!isFaqPage" :to="sitePath('/')" class="brand">
          <span class="brand-logo wish-brand-logo" aria-label="Lvyv Logo">
            <img src="/images/wish/logo-main.svg" alt="" loading="eager" decoding="sync">
            <img src="/images/wish/logo-accent.svg" alt="" loading="eager" decoding="sync">
          </span>
          <img src="/images/common/logo-header.svg" alt="Lvyv Logo" class="brand-logo brand-logo--default">
        </NuxtLink>

        <nav class="nav-links">
          <NuxtLink :prefetch="!isFaqPage" :to="sitePath('/#hero')" :class="{ active: currentPath === '/' && activeSection === 'hero' }">Home</NuxtLink>
          <NuxtLink :prefetch="!isFaqPage" :to="sitePath('/wish')" :class="{ active: currentPath.startsWith('/wish') }">Wish</NuxtLink>
          <NuxtLink :prefetch="!isFaqPage" :to="sitePath('/encounters')" :class="{ active: currentPath.startsWith('/encounters') || currentPath.startsWith('/cities') }">Encounters</NuxtLink>
          <NuxtLink :prefetch="!isFaqPage" :to="sitePath('/about')" :class="{ active: currentPath === '/about' }">About</NuxtLink>
          <NuxtLink :prefetch="!isFaqPage" :to="sitePath('/en/faq/')" :class="{ active: currentPath.includes('/faq') }">FAQ</NuxtLink>
        </nav>

        <div class="nav-actions">
          <NuxtLink :to="chinaSimCampaignUrl" external class="nav-china-sim">
            <span class="nav-china-sim__icon" aria-hidden="true">
              <img class="nav-china-sim__card" src="/images/common/china-sim-card.svg" alt="">
              <img class="nav-china-sim__chip" src="/images/common/china-sim-chip.svg" alt="">
            </span>
            <span>Get Your SIM</span>
            <img class="nav-china-sim__hot" src="/images/common/china-sim-hot.svg" alt="" width="34" height="20">
          </NuxtLink>
          <div v-if="memberToken" ref="accountMenu" class="member-account">
            <button class="member-trigger" type="button" :aria-expanded="accountOpen" aria-haspopup="menu" @click="accountOpen = !accountOpen">
              <img v-if="member?.avatarUrl && !avatarFailed" :src="member.avatarUrl" alt="" class="member-avatar" @error="avatarFailed = true">
              <span v-else class="member-avatar member-avatar-default"><font-awesome-icon :icon="['fas', 'user']" aria-hidden="true" /></span>
              <span class="member-name">{{ memberDisplayName }}</span>
              <span class="member-chevron" aria-hidden="true" />
            </button>
            <Transition name="dropdown-fade">
              <div v-if="accountOpen" class="member-menu" role="menu">
                <NuxtLink :prefetch="!isFaqPage" :to="sitePath('/profile')" role="menuitem" @click="accountOpen = false">My Profile</NuxtLink>
                <button type="button" role="menuitem" @click="logout">Log out</button>
              </div>
            </Transition>
          </div>
          <a v-else :href="sitePath('/login/')" class="nav-login">
            <span>Login</span>
          </a>
          <NuxtLink :prefetch="!isFaqPage" :to="startWishPath" class="nav-start-planning">Start Your Wish</NuxtLink>

          <!-- Mobile Nav Toggle Button -->
          <button
            class="mobile-nav-toggle"
            type="button"
            :class="{ 'open': mobileMenuOpen }"
            :aria-expanded="mobileMenuOpen"
            aria-label="Toggle Navigation"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </button>
        </div>
      </div>
    </header>

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
          <NuxtLink :prefetch="!isFaqPage" :to="sitePath('/')" class="brand" @click="mobileMenuOpen = false">
            <img src="/images/common/logo-header.svg" alt="Lvyv Logo" class="brand-logo">
          </NuxtLink>
          <button class="mobile-drawer-close" type="button" aria-label="Close menu" @click="mobileMenuOpen = false">
            <AuthGlobeIcon :icon="faTimes" aria-hidden="true" />
          </button>
        </div>

        <div class="mobile-drawer-body">
          <nav class="mobile-nav-links">
            <NuxtLink :prefetch="!isFaqPage" :to="sitePath('/#hero')" class="mobile-nav-item" :class="{ active: currentPath === '/' && activeSection === 'hero' }" @click="handleNavClick('/#hero')">Home</NuxtLink>
            <NuxtLink :prefetch="!isFaqPage" :to="sitePath('/wish')" class="mobile-nav-item" :class="{ active: currentPath === '/wish' }" @click="handleNavClick('/wish')">Wish</NuxtLink>

            <NuxtLink :prefetch="!isFaqPage" :to="sitePath('/encounters')" class="mobile-nav-item" :class="{ active: currentPath.startsWith('/encounters') || currentPath.startsWith('/cities') }" @click="handleNavClick('/encounters')">Encounters</NuxtLink>

            <NuxtLink :prefetch="!isFaqPage" :to="sitePath('/about')" class="mobile-nav-item" :class="{ active: currentPath === '/about' }" @click="handleNavClick('/about')">About</NuxtLink>
            <NuxtLink :prefetch="!isFaqPage" :to="sitePath('/en/faq/')" class="mobile-nav-item" :class="{ active: currentPath.includes('/faq') }" @click="handleNavClick('/en/faq/')">FAQ</NuxtLink>
          </nav>
        </div>

        <div class="mobile-drawer-footer">
          <!-- Member Auth Status in Drawer -->
          <div v-if="memberToken" class="mobile-drawer-user">
            <div class="mobile-user-info">
              <img v-if="member?.avatarUrl && !avatarFailed" :src="member.avatarUrl" alt="" class="member-avatar" @error="avatarFailed = true">
              <span v-else class="member-avatar member-avatar-default"><font-awesome-icon :icon="['fas', 'user']" aria-hidden="true" /></span>
              <span class="mobile-user-name">{{ memberDisplayName }}</span>
            </div>
            <div class="mobile-user-actions">
              <NuxtLink :prefetch="!isFaqPage" :to="sitePath('/profile')" class="mobile-user-link" @click="mobileMenuOpen = false">My Profile</NuxtLink>
              <button type="button" class="mobile-logout-btn" @click="logout">Log out</button>
            </div>
          </div>
          <div v-else class="mobile-drawer-auth">
            <a :href="sitePath('/login/')" class="mobile-drawer-login-btn" @click="mobileMenuOpen = false">
              <AuthGlobeIcon :icon="faUser" aria-hidden="true" />
              <span>Login / Sign Up</span>
            </a>
          </div>

          <NuxtLink :prefetch="!isFaqPage" :to="startWishPath" class="mobile-start-planning-btn" @click="mobileMenuOpen = false">
            Start Your Wish
          </NuxtLink>
        </div>
      </div>
    </Transition>

    <!-- Main Content Page Slot -->
    <slot />

    <HomePromotionPopup v-if="isHomePage" :popup="homePromotions.popup.value" :open="homePromotions.popupOpen.value" @close="homePromotions.closePopup" />

    <!-- Footer -->
    <footer v-if="!hidesFooter && currentPath !== '/encounters'" class="footer">
      <div class="container footer-grid">
        <div class="footer-brand-info">
          <img src="/images/common/logo-footer.svg" alt="Lvyv Logo" class="footer-logo">
          <p class="brand-subtext">The First Friends in China.</p>
          <p class="copyright">© 2026&nbsp; Beijing LVYV International Travel Co., Ltd.</p>
          <p class="copyright footer-records">
            <a
              href="https://zzlz.gsxt.gov.cn/businessCheck/verifKey.do?showType=p&amp;serial=91110101MAKF4XU185-SAIC_SHOW_10000091110101MAKF4XU1851784705248157&amp;signData=MEUCIQCAptI+6G+AsKo4TFSprcYjTn9cnGu+S+tBBIork1PibQIgD+GcoDzK3VA3WAIx3gz+ERcY6rtfCmm2AllRnoM44BM="
              target="_blank"
              rel="noopener"
              referrerpolicy="origin"
              class="footer-record-link footer-license-link"
              aria-label="电子营业执照"
            >
              <img
                :src="businessLicenseIconUrl"
                alt="电子营业执照"
                style="width: 16px; height: 16px; min-width: 16px; display: inline-block; vertical-align: middle;"
              >
            </a>
            <a
              href="https://beian.mps.gov.cn/#/query/webSearch?code=11011302008211"
              rel="noreferrer"
              target="_blank"
              class="footer-record-link footer-police-record"
            >
              <img
                src="/images/common/gongan.png"
                alt="公安备案图标"
                style="width: 16px; height: 16px; min-width: 16px; display: inline-block; vertical-align: middle;"
              >
              <span>京公网安备11011302008211号</span>
            </a>
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" class="footer-record-link">京ICP备2026042546号-1</a>
          </p>
        </div>

        <div class="footer-links-column">
          <h2>Explore</h2>
          <ul>
            <li><NuxtLink :prefetch="!isFaqPage" to="#">All Cities</NuxtLink></li>
            <li><NuxtLink :prefetch="!isFaqPage" to="#">Top Experiences</NuxtLink></li>
            <li><NuxtLink :prefetch="!isFaqPage" to="#">Luxury Collection</NuxtLink></li>
          </ul>
        </div>

        <div class="footer-links-column">
          <h2>Community</h2>
          <ul>
            <li><NuxtLink :prefetch="!isFaqPage" to="/encounters">Encounters</NuxtLink></li>
            <li><NuxtLink :prefetch="!isFaqPage" to="/#wish-pool">Wish Pool</NuxtLink></li>
            <li><NuxtLink :prefetch="!isFaqPage" to="#">Mission</NuxtLink></li>
          </ul>
        </div>

        <div class="footer-links-column">
          <h2>Company</h2>
          <ul>
            <li><NuxtLink :prefetch="!isFaqPage" to="#">About Us</NuxtLink></li>
            <li><NuxtLink :prefetch="!isFaqPage" to="#">Careers</NuxtLink></li>
            <li><NuxtLink :prefetch="!isFaqPage" to="#">Contact</NuxtLink></li>
          </ul>
        </div>

        <div class="footer-links-column">
          <h2>Support</h2>
          <ul>
            <li><NuxtLink :prefetch="!isFaqPage" to="/en/faq/">FAQ</NuxtLink></li>
            <li><NuxtLink :prefetch="!isFaqPage" to="/terms">Terms &amp; Conditions</NuxtLink></li>
            <li><NuxtLink :prefetch="!isFaqPage" to="/intellectual-property-rights">Intellectual Property Rights</NuxtLink></li>
          </ul>
        </div>
      </div>

      <div class="container payment-methods" aria-label="Accepted payment methods">
        <ul class="payment-logo-list">
          <li><img src="/images/payment/visa.png" alt="Visa" width="320" height="200"></li>
          <li><img src="/images/payment/mastercard.png" alt="Mastercard" width="320" height="200"></li>
          <li><img src="/images/payment/maestro.png" alt="Maestro" width="320" height="200"></li>
          <li><img src="/images/payment/discover.png" alt="Discover" width="288" height="200"></li>
          <li><img src="/images/payment/diners-club.png" alt="Diners Club" width="276" height="200"></li>
        </ul>
      </div>


    </footer>
  </div>
</template>

<script setup>
import { ref, watch, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { FontAwesomeIcon as AuthGlobeIcon } from '@fortawesome/vue-fontawesome'
import { faTimes, faUser } from '@fortawesome/free-solid-svg-icons'
import businessLicenseIconUrl from '~/assets/generated/common/yyzz-48.png'
import { chinaSimCampaignUrl } from '~/composables/useHomePromotions'
import { MAIN_SITE_ORIGIN } from '~~/shared/utils/luxurySite'

const route = useRoute()
const currentPath = computed(() => {
  const path = route.path || '/'
  return path.length > 1 ? path.replace(/\/+$/, '') : path
})
const isHomePage = computed(() => currentPath.value === '/')
const isActivityPage = computed(() => currentPath.value.startsWith('/activity/'))
/** @param {string} path */
const sitePath = (path) => !import.meta.dev && isActivityPage.value ? MAIN_SITE_ORIGIN + path : path
// 阅读文档时不预取导航和页脚指向的整站资源，避免与正文首屏竞争带宽。
const isFaqPage = computed(() => /^\/(?:en\/|zh\/)?faq(?:\/|$)/.test(currentPath.value))
const homePromotions = useHomePromotions()
const isWishExperience = computed(() => currentPath.value === '/wish' || currentPath.value === '/wish/my')
const isEncountersExperience = computed(() => currentPath.value === '/encounters' || currentPath.value.startsWith('/encounters/'))
const hidesFooter = computed(() => isActivityPage.value || isWishExperience.value || currentPath.value === '/wish/create')
const activeSection = ref('hero')
// Keep the first client render identical to SSR; sync scroll state after mount.
const isScrolled = ref(false)
const { token: memberToken, member, loadMember, clearSession, logout: logoutMember } = useMemberAuth()
const startWishPath = computed(() => sitePath(memberToken.value
  ? '/wish/create'
  : `/login/?redirect=${encodeURIComponent('/wish/create')}`))
const accountOpen = ref(false)
const accountMenu = ref(null)
const avatarFailed = ref(false)

const mobileMenuOpen = ref(false)

const handleNavClick = async (toPath) => {
  mobileMenuOpen.value = false
  if (import.meta.client) {
    document.documentElement.classList.remove('scroll-locked')
    document.body.classList.remove('scroll-locked')

    if (toPath && toPath.includes('#')) {
      const parts = toPath.split('#')
      const targetPath = parts[0] || '/'
      const targetId = parts[1]

      if (currentPath.value === targetPath || (targetPath === '/' && currentPath.value === '/')) {
        await nextTick()
        setTimeout(() => {
          const el = document.getElementById(targetId)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' })
          }
        }, 60)
      }
    }
  }
}

watch(() => route.path, () => {
  mobileMenuOpen.value = false
})

const loadHomePromotions = () => {
  if (isHomePage.value) homePromotions.load().then(() => homePromotions.showPopupIfNeeded())
}

watch(isHomePage, (value) => {
  if (value) loadHomePromotions()
  else homePromotions.closePopup()
})

watch(mobileMenuOpen, (isOpen) => {
  if (import.meta.client) {
    if (isOpen) {
      document.documentElement.classList.add('scroll-locked')
      document.body.classList.add('scroll-locked')
    } else {
      document.documentElement.classList.remove('scroll-locked')
      document.body.classList.remove('scroll-locked')
    }
  }
})

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
const logout = async () => { accountOpen.value = false; await logoutMember(); await navigateTo('/') }

watch(() => member.value?.avatarUrl, () => { avatarFailed.value = false })
watch(memberToken, async (value) => {
  if (!value) { accountOpen.value = false; return }
  if (!member.value) {
    try { await loadMember() } catch { /* The request layer clears only expired sessions. */ }
  }
})

const handleScroll = () => { isScrolled.value = window.scrollY > 20 }

const handleDocumentClick = (event) => {
  if (accountMenu.value && !accountMenu.value.contains(event.target)) accountOpen.value = false
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('click', handleDocumentClick)
  if (memberToken.value && !member.value) loadMember().catch(() => {})
  loadHomePromotions()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleDocumentClick)
  if (import.meta.client) {
    document.documentElement.classList.remove('scroll-locked')
    document.body.classList.remove('scroll-locked')
  }
})
</script>

<style scoped>
.app-layout--home-with-announcement .navbar {
  top: 60px;
}

.app-layout--home-with-announcement .navbar.scrolled {
  top: 0;
}

.nav-china-sim {
  position: relative;
  top: 6px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  min-width: 112px;
  height: 32px;
  padding: 0 10px;
  border: 1px solid #698e4e;
  border-radius: 20px;
  color: #698e4e;
  font: 400 12px/24px Roboto, sans-serif;
  text-decoration: none;
  white-space: nowrap;
}

.nav-china-sim__icon {
  position: relative;
  width: 16px;
  height: 16px;
  flex: 0 0 16px;
}

.nav-china-sim__card,
.nav-china-sim__chip {
  position: absolute;
  display: block;
}

.nav-china-sim__card {
  inset: 8.33% 16.67%;
  width: 66.67%;
  height: 83.33%;
}

.nav-china-sim__chip {
  inset: 41.67% 29.17% 20.83%;
  width: 41.67%;
  height: 37.5%;
}

.nav-china-sim__hot {
  position: absolute;
  bottom: calc(100% + 4px);
  left: 50%;
  width: 34px;
  height: 20px;
  transform: translateX(-50%);
  pointer-events: none;
}

.nav-china-sim:hover,
.nav-china-sim:focus-visible {
  background: rgba(105, 142, 78, 0.12);
}

.app-layout--wish .navbar,
.app-layout--wish .navbar.scrolled {
  background: transparent !important;
  border-bottom: 0 !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

.wish-brand-logo {
  position: relative;
  display: none;
  width: 120px;
  height: 41px;
  flex: 0 0 120px;
  line-height: 0;
}

.app-layout--wish .wish-brand-logo {
  display: block;
}

.app-layout--wish .brand-logo--default {
  display: none;
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

.app-layout--wish .nav-links > a,
.app-layout--wish .nav-login,
.app-layout--wish .member-trigger {
  color: #fff;
}

.app-layout--wish .nav-links > a:hover,
.app-layout--wish .nav-links > a.active {
  color: #fff;
}

.app-layout--wish .nav-login-icon {
  display: none;
}

.app-layout--wish .mobile-nav-toggle .hamburger-line {
  background-color: #fff;
}

@media (min-width: 769px) and (max-width: 1199px) {
  .nav-container {
    width: calc(100% - 40px);
  }

  .nav-links {
    gap: clamp(12px, 2vw, 24px);
    margin-inline: 20px auto;
  }

  .nav-actions {
    gap: 12px;
  }

  .nav-start-planning {
    padding-inline: 14px;
    white-space: nowrap;
  }
}

@media (max-width: 991px) {
  .app-layout--home-with-announcement .navbar {
    top: 60px;
  }

  .app-layout--home-with-announcement .navbar.scrolled {
    top: 0;
  }

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

  .nav-china-sim {
    top: 2px;
  }

  .nav-china-sim__hot {
    bottom: calc(100% - 2px);
    width: 27.2px;
    height: 16px;
  }
}

@media (max-width: 768px) {
  .nav-china-sim {
    min-width: 0;
  }
}

@media (max-width: 360px) {
  .nav-container {
    width: calc(100% - 24px);
  }

  .nav-actions {
    gap: 8px;
  }

  .nav-china-sim,
  .nav-login {
    padding-inline: 8px;
  }
}

</style>
