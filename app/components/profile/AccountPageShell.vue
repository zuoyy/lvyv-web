<template>
  <main class="account-page">
    <div v-if="!ready" class="account-loading" role="status">
      <span class="loading-mark" />
      <span>Loading your account...</span>
    </div>

    <template v-else>
      <div class="account-layout" :class="{ 'without-navigation': !showNavigation }">
        <div v-if="showNavigation && showSidebar" class="sidebar-overlay" @click="showSidebar = false" />
        <ProfileSidebar
          v-if="showNavigation"
          :active-tab="activePage"
          :show="showSidebar"
          :display-name="displayName"
          :email="auth.member.value?.email || ''"
          :avatar="auth.member.value?.avatarUrl || ''"
          @update:active-tab="openProfileSection"
          @close="showSidebar = false"
        />
        <section class="account-workspace">
          <header class="account-heading">
            <div class="heading-text">
              <h1>{{ title }}</h1>
              <p v-if="description" class="account-description">{{ description }}</p>
            </div>
            <div class="heading-actions">
              <slot name="actions" />
              <button v-if="showNavigation" class="mobile-menu-button" type="button" @click="showSidebar = true">
                <font-awesome-icon :icon="['fas', 'bars']" />
                <span>Account menu</span>
              </button>
            </div>
          </header>

          <div v-if="auth.profileError.value" role="alert" class="account-profile-error">
            <span>{{ auth.profileError.value }}</span>
            <button type="button" @click="retryProfile">Retry account</button>
          </div>
          <slot />
        </section>
      </div>
    </template>
  </main>
</template>

<script setup lang="ts">
import ProfileSidebar from './ProfileSidebar.vue'

const props = withDefaults(defineProps<{
  activePage: string
  title: string
  description?: string
  ready: boolean
  showNavigation?: boolean
}>(), {
  description: '',
  showNavigation: true,
})

const { showNavigation } = toRefs(props)

const auth = useMemberAuth()
const showSidebar = ref(false)
const retryProfile = () => auth.loadMember().catch(() => {})
const displayName = computed(() => auth.member.value?.nickname?.trim()
  || auth.member.value?.email?.split('@')[0]
  || 'Alex lee')

const openProfileSection = (section: string) => {
  if (section === props.activePage) return
  if (['personal-info', 'account-security', 'settings'].includes(section)) {
    navigateTo(`/profile?section=${section}`)
  }
}
</script>

<style scoped>
.account-page {
  min-height: 100vh;
  padding: 108px 20px 80px;
  background: #f5f6f3;
  color: #1c2925;
  box-sizing: border-box;
}

.account-layout {
  width: 100%;
  max-width: 1240px;
  margin-inline: auto;
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.account-layout.without-navigation {
  display: block;
}

.account-workspace {
  min-width: 0;
  flex: 1;
  max-width: 940px;
}

.account-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}

.heading-text {
  min-width: 0;
  flex: 1;
}

.account-heading h1 {
  margin: 0;
  color: #203d33;
  font-family: Didot, 'Playfair Display', Georgia, serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 26px;
}

.account-description {
  margin: 8px 0 0;
  color: #203d33;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 25px;
}

.heading-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 0 0 auto;
}

.mobile-menu-button {
  min-height: 40px;
  display: none;
  align-items: center;
  gap: 9px;
  padding: 0 14px;
  border: 1px solid #cad3ce;
  border-radius: 4px;
  background: #fff;
  color: #174d40;
  font: 700 13px/1 'Inter', sans-serif;
  cursor: pointer;
}

.account-loading {
  min-height: 55vh;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #65746e;
  font-size: 14px;
}

.loading-mark {
  width: 18px;
  height: 18px;
  border: 2px solid #ccd5d0;
  border-top-color: #174d40;
  border-radius: 50%;
  animation: spin 700ms linear infinite;
}

.sidebar-overlay {
  display: none;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 980px) {
  .account-layout {
    gap: 16px;
  }
}

@media (max-width: 820px) {
  .account-page {
    padding: 96px 16px 60px;
  }
  .mobile-menu-button {
    display: flex;
  }
  .account-layout {
    display: block;
  }
  .sidebar-overlay {
    position: fixed;
    z-index: 1090;
    inset: 0;
    display: block;
    background: rgba(10, 25, 20, .46);
  }
}

@media (max-width: 600px) {
  .account-page {
    padding-inline: 12px;
  }
  .account-heading {
    flex-direction: column;
    align-items: stretch;
  }
  .heading-actions {
    width: 100%;
    margin-top: 14px;
  }
  .mobile-menu-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
