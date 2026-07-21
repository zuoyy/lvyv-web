<template>
  <div class="app-layout">
    <!-- Header / Navigation -->
    <header class="navbar" :class="{ 'scrolled': isScrolled }">
      <div class="nav-container">
        <NuxtLink to="/" class="brand">
          <img src="/images/common/logo-header.svg" alt="Lvyv Logo" class="brand-logo">
        </NuxtLink>

        <nav class="nav-links">
          <NuxtLink to="/#hero" :class="{ active: $route && $route.path === '/' && activeSection === 'hero' }">Home</NuxtLink>
          <NuxtLink to="/wish" :class="{ active: $route && $route.path === '/wish' }">Wish</NuxtLink>
          <div class="nav-item-dropdown">
            <a href="javascript:void(0)" @click.prevent :class="{ active: $route && $route.path.startsWith('/cities') }">Cities</a>
            <div class="dropdown-menu">
              <NuxtLink to="/cities/xian" class="dropdown-item" :class="{ active: $route && $route.path === '/cities/xian' }">
                <span class="city-en">Xi'an</span>
                <span class="city-zh">西安</span>
              </NuxtLink>
              <NuxtLink to="/cities/chengdu" class="dropdown-item" :class="{ active: $route && $route.path === '/cities/chengdu' }">
                <span class="city-en">Chengdu</span>
                <span class="city-zh">成都</span>
              </NuxtLink>
            </div>
          </div>
          <NuxtLink to="/stories" :class="{ active: $route && $route.path === '/stories' }">Stories</NuxtLink>
          <NuxtLink to="/about" :class="{ active: $route && $route.path === '/about' }">About</NuxtLink>
          <NuxtLink to="/faq" :class="{ active: $route && $route.path === '/faq' }">FAQ</NuxtLink>
        </nav>

        <div class="nav-actions">
          <!-- Language Selector -->
          <div class="lang-selector">
            <font-awesome-icon :icon="['fas', 'globe']" class="lang-icon" aria-hidden="true" />
            <span class="lang-text">EN</span>
          </div>
          <NuxtLink to="/login" class="nav-login">Login</NuxtLink>
          <NuxtLink to="/#wish-pool" class="btn-planning">Start Planning</NuxtLink>
        </div>
      </div>
    </header>

    <!-- Main Content Page Slot -->
    <slot />

    <!-- Footer -->
    <footer class="footer">
      <div class="container footer-grid">
        <div class="footer-brand-info">
          <img src="/images/common/logo-footer.svg" alt="Lvyv Logo" class="footer-logo">
          <p class="brand-subtext">The First Friends in China.</p>
          <p class="copyright">© 2026&nbsp; Lvyv International Travel &amp; Culture Co., Ltd.</p>
          <p class="copyright">
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none; transition: opacity 0.2s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.7">京ICP备2026042546号-1</a>
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
            <li><NuxtLink to="#">Stories</NuxtLink></li>
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
            <li><NuxtLink to="/faq">FAQ</NuxtLink></li>
            <li><NuxtLink to="#">Safety</NuxtLink></li>
            <li><NuxtLink to="#">Privacy Policy</NuxtLink></li>
          </ul>
        </div>
      </div>


    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const activeSection = ref('hero')
const isScrolled = ref(false)

const handleScroll = () => {
  if (window.scrollY > 20) {
    isScrolled.value = true
  } else {
    isScrolled.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
