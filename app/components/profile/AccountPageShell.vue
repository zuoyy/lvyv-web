<template>
  <main class="account-page">
    <div v-if="!ready" class="account-loading" role="status">
      <span class="loading-mark" />
      <span>Loading your account...</span>
    </div>

    <template v-else>
      <header class="account-heading">
        <div>
          <p class="account-eyebrow">{{ kicker }}</p>
          <h1>{{ title }}</h1>
          <p>{{ description }}</p>
        </div>
        <div class="heading-actions">
          <slot name="actions" />
          <button v-if="showNavigation" class="mobile-menu-button" type="button" @click="showSidebar = true">
            <font-awesome-icon :icon="['fas', 'bars']" />
            <span>Account menu</span>
          </button>
        </div>
      </header>

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
  kicker: string
  title: string
  description: string
  ready: boolean
  showNavigation?: boolean
}>(), {
  showNavigation: true,
})

const { showNavigation } = toRefs(props)

const auth = useMemberAuth()
const showSidebar = ref(false)
const displayName = computed(() => auth.member.value?.nickname?.trim()
  || auth.member.value?.email?.split('@')[0]
  || 'Lvyv traveller')

const openProfileSection = (section: string) => {
  if (section === props.activePage) return
  if (['personal-info', 'account-security', 'settings'].includes(section)) {
    navigateTo(`/profile?section=${section}`)
  }
}
</script>

<style scoped>
.account-page { min-height: 100vh; padding: 124px 32px 96px; background: #f4f6f3; color: #1c2925; }
.account-heading, .account-layout { width: min(1180px, 100%); margin-inline: auto; }
.account-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 28px; margin-bottom: 38px; }
.account-eyebrow { margin: 0 0 10px; color: #65746e; font-size: 12px; font-weight: 700; text-transform: uppercase; }
.account-heading h1 { margin: 0; color: #163e34; font-family: 'Playfair Display', Georgia, serif; font-size: clamp(34px, 4vw, 50px); font-weight: 600; line-height: 1.05; }
.account-heading p:last-child { max-width: 620px; margin: 13px 0 0; color: #63716c; font-size: 15px; line-height: 1.6; }
.heading-actions { display: flex; align-items: center; gap: 10px; flex: 0 0 auto; }
.mobile-menu-button { min-height: 44px; display: none; align-items: center; gap: 9px; padding: 0 15px; border: 1px solid #cad3ce; background: #fff; color: #174d40; font: 700 13px/1 'Inter', sans-serif; cursor: pointer; }
.account-layout { display: flex; align-items: flex-start; gap: 52px; }
.account-layout.without-navigation { display: block; }
.account-workspace { min-width: 0; flex: 1; }
.account-loading { min-height: 55vh; display: flex; align-items: center; justify-content: center; gap: 12px; color: #65746e; font-size: 14px; }
.loading-mark { width: 18px; height: 18px; border: 2px solid #ccd5d0; border-top-color: #174d40; border-radius: 50%; animation: spin 700ms linear infinite; }
.sidebar-overlay { display: none; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width: 980px) { .account-layout { gap: 30px; } }
@media (max-width: 820px) {
  .account-page { padding: 104px 20px 72px; }
  .account-heading { align-items: flex-start; margin-bottom: 28px; }
  .account-heading h1 { font-size: 36px; }
  .mobile-menu-button { display: flex; }
  .account-layout { display: block; }
  .sidebar-overlay { position: fixed; z-index: 1090; inset: 0; display: block; background: rgba(10, 25, 20, .46); }
}
@media (max-width: 600px) {
  .account-page { padding-inline: 14px; }
  .account-heading { display: block; }
  .account-heading h1 { font-size: 32px; }
  .heading-actions { width: 100%; margin-top: 20px; }
  .heading-actions :deep(> *) { flex: 1; }
  .mobile-menu-button { justify-content: center; }
}
</style>
