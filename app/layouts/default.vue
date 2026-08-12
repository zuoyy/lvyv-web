<template>
  <div class="app-layout" :class="{ 'app-layout--wish': isWishLanding }">
    <!-- Header / Navigation -->
    <header class="navbar" :class="{ 'scrolled': isScrolled }">
      <div class="nav-container">
        <NuxtLink to="/" class="brand">
          <span class="brand-logo wish-brand-logo" aria-label="Lvyv Logo">
            <img src="/images/wish/logo-main.svg" alt="" loading="eager" decoding="sync">
            <img src="/images/wish/logo-accent.svg" alt="" loading="eager" decoding="sync">
          </span>
          <img src="/images/common/logo-header.svg" alt="Lvyv Logo" class="brand-logo brand-logo--default">
        </NuxtLink>

        <nav class="nav-links">
          <NuxtLink to="/#hero" :class="{ active: currentPath === '/' && activeSection === 'hero' }">Home</NuxtLink>
          <NuxtLink to="/wish" :class="{ active: currentPath === '/wish' }">Wish</NuxtLink>
          <NuxtLink to="/encounters" :class="{ active: currentPath === '/encounters' }">Encounters</NuxtLink>
          <div class="nav-item-dropdown">
            <a href="javascript:void(0)" @click.prevent :class="{ active: currentPath.startsWith('/cities') }">Cities</a>
            <div class="dropdown-menu">
              <NuxtLink to="/cities/xian" class="dropdown-item" :class="{ active: currentPath === '/cities/xian' }">
                <span class="city-en">Xi'an</span>
                <span class="city-zh">西安</span>
              </NuxtLink>
              <NuxtLink to="/cities/chengdu" class="dropdown-item" :class="{ active: currentPath === '/cities/chengdu' }">
                <span class="city-en">Chengdu</span>
                <span class="city-zh">成都</span>
              </NuxtLink>
            </div>
          </div>
          <NuxtLink to="/about" :class="{ active: currentPath === '/about' }">About</NuxtLink>
          <NuxtLink to="/en/faq/" :class="{ active: currentPath.includes('/faq') }">FAQ</NuxtLink>
        </nav>

        <div class="nav-actions">
          <!-- Language Selector -->
          <div class="lang-selector">
            <AuthGlobeIcon :icon="faGlobe" class="lang-icon" aria-hidden="true" />
            <span class="lang-text">EN</span>
          </div>
          <div v-if="memberToken" ref="accountMenu" class="member-account">
            <button class="member-trigger" type="button" :aria-expanded="accountOpen" aria-haspopup="menu" @click="accountOpen = !accountOpen">
              <img v-if="member?.avatar && !avatarFailed" :src="member.avatar" alt="" class="member-avatar" @error="avatarFailed = true">
              <span v-else class="member-avatar member-avatar-default"><font-awesome-icon :icon="['fas', 'user']" aria-hidden="true" /></span>
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
          <NuxtLink :to="startWishPath" class="nav-start-planning">Start Your Wish</NuxtLink>

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
          <NuxtLink to="/" class="brand" @click="mobileMenuOpen = false">
            <img src="/images/common/logo-header.svg" alt="Lvyv Logo" class="brand-logo">
          </NuxtLink>
          <button class="mobile-drawer-close" type="button" aria-label="Close menu" @click="mobileMenuOpen = false">
            <AuthGlobeIcon :icon="faTimes" aria-hidden="true" />
          </button>
        </div>

        <div class="mobile-drawer-body">
          <nav class="mobile-nav-links">
            <NuxtLink to="/#hero" class="mobile-nav-item" :class="{ active: currentPath === '/' && activeSection === 'hero' }" @click="handleNavClick('/#hero')">Home</NuxtLink>
            <NuxtLink to="/wish" class="mobile-nav-item" :class="{ active: currentPath === '/wish' }" @click="handleNavClick('/wish')">Wish</NuxtLink>
            <NuxtLink to="/encounters" class="mobile-nav-item" :class="{ active: currentPath === '/encounters' }" @click="handleNavClick('/encounters')">Encounters</NuxtLink>

            <!-- Submenu: Cities -->
            <div class="mobile-nav-item-accordion">
              <button class="mobile-accordion-trigger" type="button" @click="mobileCitiesOpen = !mobileCitiesOpen">
                <span>Cities</span>
                <AuthGlobeIcon :icon="faChevronDown" class="accordion-chevron" :class="{ 'rotated': mobileCitiesOpen }" aria-hidden="true" />
              </button>
              <Transition name="accordion">
                <div v-if="mobileCitiesOpen" class="mobile-accordion-content">
                  <NuxtLink to="/cities/xian" class="mobile-subnav-item" :class="{ active: currentPath === '/cities/xian' }" @click="handleNavClick('/cities/xian')">
                    <span class="city-en">Xi'an</span>
                    <span class="city-zh">西安</span>
                  </NuxtLink>
                  <NuxtLink to="/cities/chengdu" class="mobile-subnav-item" :class="{ active: currentPath === '/cities/chengdu' }" @click="handleNavClick('/cities/chengdu')">
                    <span class="city-en">Chengdu</span>
                    <span class="city-zh">成都</span>
                  </NuxtLink>
                </div>
              </Transition>
            </div>

            <NuxtLink to="/about" class="mobile-nav-item" :class="{ active: currentPath === '/about' }" @click="handleNavClick('/about')">About</NuxtLink>
            <NuxtLink to="/en/faq/" class="mobile-nav-item" :class="{ active: currentPath.includes('/faq') }" @click="handleNavClick('/en/faq/')">FAQ</NuxtLink>
          </nav>
        </div>

        <div class="mobile-drawer-footer">
          <!-- Member Auth Status in Drawer -->
          <div v-if="memberToken" class="mobile-drawer-user">
            <div class="mobile-user-info">
              <img v-if="member?.avatar && !avatarFailed" :src="member.avatar" alt="" class="member-avatar" @error="avatarFailed = true">
              <span v-else class="member-avatar member-avatar-default"><font-awesome-icon :icon="['fas', 'user']" aria-hidden="true" /></span>
              <span class="mobile-user-name">{{ memberDisplayName }}</span>
            </div>
            <div class="mobile-user-actions">
              <NuxtLink to="/profile" class="mobile-user-link" @click="mobileMenuOpen = false">My Profile</NuxtLink>
              <button type="button" class="mobile-logout-btn" @click="logout">Log out</button>
            </div>
          </div>
          <div v-else class="mobile-drawer-auth">
            <a href="/login/" class="mobile-drawer-login-btn" @click="mobileMenuOpen = false">
              <AuthGlobeIcon :icon="faUser" aria-hidden="true" />
              <span>Login / Sign Up</span>
            </a>
          </div>

          <NuxtLink :to="startWishPath" class="mobile-start-planning-btn" @click="mobileMenuOpen = false">
            Start Your Wish
          </NuxtLink>
        </div>
      </div>
    </Transition>

    <!-- Main Content Page Slot -->
    <slot />

    <!-- Footer -->
    <footer v-if="!hidesFooter" class="footer">
      <div class="container footer-grid">
        <div class="footer-brand-info">
          <img src="/images/common/logo-footer.svg" alt="Lvyv Logo" class="footer-logo">
          <p class="brand-subtext">The First Friends in China.</p>
          <p class="copyright">© 2026&nbsp; Lvyv International Travel &amp; Culture Co., Ltd.</p>
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
          <h4>Explore</h4>
          <ul>
            <li><NuxtLink to="#">All Cities</NuxtLink></li>
            <li><NuxtLink to="#">Top Experiences</NuxtLink></li>
            <li><NuxtLink to="#">Luxury Collection</NuxtLink></li>
          </ul>
        </div>

        <div class="footer-links-column">
          <h4>Community</h4>
          <ul>
            <li><NuxtLink to="/encounters">Encounters</NuxtLink></li>
            <li><NuxtLink to="/#wish-pool">Wish Pool</NuxtLink></li>
            <li><NuxtLink to="#">Mission</NuxtLink></li>
          </ul>
        </div>

        <div class="footer-links-column">
          <h4>Company</h4>
          <ul>
            <li><NuxtLink to="#">About Us</NuxtLink></li>
            <li><NuxtLink to="#">Careers</NuxtLink></li>
            <li><NuxtLink to="#">Contact</NuxtLink></li>
          </ul>
        </div>

        <div class="footer-links-column">
          <h4>Support</h4>
          <ul>
            <li><NuxtLink to="/en/faq/">FAQ</NuxtLink></li>
            <li><NuxtLink to="/terms">Terms &amp; Conditions</NuxtLink></li>
            <li><NuxtLink to="/intellectual-property-rights">Intellectual Property Rights</NuxtLink></li>
          </ul>
        </div>
      </div>

      <div class="container payment-methods" aria-label="Accepted payment methods">
        <ul class="payment-logo-list">
          <li><img src="/images/payment/visa.png" alt="Visa" width="320" height="200"></li>
          <li><img src="/images/payment/mastercard.png" alt="Mastercard" width="320" height="200"></li>
          <li><img src="/images/payment/maestro.png" alt="Maestro" width="320" height="200"></li>
          <li><img src="/images/payment/jcb.png" alt="JCB" width="320" height="200"></li>
          <li><img src="/images/payment/american-express.png" alt="American Express" width="320" height="200"></li>
          <li><img src="/images/payment/diners-club.png" alt="Diners Club" width="276" height="200"></li>
          <li><img src="/images/payment/discover.png" alt="Discover" width="288" height="200"></li>
        </ul>
      </div>


    </footer>
  </div>
</template>

<script setup>
import { ref, watch, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { FontAwesomeIcon as AuthGlobeIcon } from '@fortawesome/vue-fontawesome'
import { faGlobe, faTimes, faChevronDown, faUser } from '@fortawesome/free-solid-svg-icons'
import businessLicenseIconUrl from '~/assets/generated/common/yyzz-48.png'

const route = useRoute()
const currentPath = computed(() => {
  const path = route.path || '/'
  return path.length > 1 ? path.replace(/\/+$/, '') : path
})
const isWishLanding = computed(() => currentPath.value === '/wish')
const hidesFooter = computed(() => isWishLanding.value || currentPath.value === '/wish/create')
const activeSection = ref('hero')
// Keep the first client render identical to SSR; sync scroll state after mount.
const isScrolled = ref(false)
const { token: memberToken, member, loadMember, clearSession, logout: logoutMember } = useMemberAuth()
const startWishPath = computed(() => memberToken.value
  ? '/wish/create'
  : `/login/?redirect=${encodeURIComponent('/wish/create')}`)
const accountOpen = ref(false)
const accountMenu = ref(null)
const avatarFailed = ref(false)

const mobileMenuOpen = ref(false)
const mobileCitiesOpen = ref(false)

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

watch(() => member.value?.avatar, () => { avatarFailed.value = false })
watch(memberToken, async (value) => {
  if (!value) { accountOpen.value = false; return }
  if (!member.value) {
    try { await loadMember() } catch { clearSession() }
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
  if (memberToken.value && !member.value) loadMember().catch(clearSession)
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
.app-layout--wish .nav-item-dropdown > a,
.app-layout--wish .lang-selector,
.app-layout--wish .nav-login,
.app-layout--wish .member-trigger {
  color: #fff;
}

.app-layout--wish .nav-links > a:hover,
.app-layout--wish .nav-links > a.active,
.app-layout--wish .nav-item-dropdown > a:hover,
.app-layout--wish .nav-item-dropdown > a.active {
  color: #fff;
}

.app-layout--wish .nav-login-icon {
  display: none;
}

@media (min-width: 992px) {
  .app-layout--wish .nav-links {
    gap: 36px;
  }
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
