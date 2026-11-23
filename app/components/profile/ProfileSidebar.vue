<template>
  <aside class="profile-sidebar" :class="{ 'sidebar-open': show }" aria-label="Account navigation">
    <div class="sidebar-topbar">
      <span>Account</span>
      <button class="icon-button sidebar-close" type="button" aria-label="Close account navigation" @click="emit('close')">
        <font-awesome-icon :icon="['fas', 'xmark']" />
      </button>
    </div>

    <div class="member-summary">
      <div class="member-avatar" aria-hidden="true">
        <img v-if="avatar" :src="avatar" alt="">
        <img v-else src="/images/profile/default-avatar.webp" alt="">
      </div>
      <div class="member-copy">
        <strong>{{ displayName || 'Alex lee' }}</strong>
        <span>{{ bioText }}</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li :class="{ active: activeTab === 'personal-info' }">
          <button class="nav-link" type="button" @click="handleTabChange('personal-info')">
            <span class="nav-icon icon-profile" aria-hidden="true" />
            <span>Profile</span>
          </button>
        </li>
        <li :class="{ active: activeTab === 'wishes' }">
          <NuxtLink to="/wish/my" class="nav-link" @click="emit('close')">
            <span class="nav-icon icon-wishes" aria-hidden="true" />
            <span>My Wishes</span>
          </NuxtLink>
        </li>
        <li :class="{ active: activeTab === 'trips' }">
          <NuxtLink to="/trips" class="nav-link" @click="emit('close')">
            <span class="nav-icon icon-trips" aria-hidden="true" />
            <span>My Trips</span>
          </NuxtLink>
        </li>
        <li :class="{ active: activeTab === 'orders' }">
          <NuxtLink to="/orders" class="nav-link" @click="emit('close')">
            <span class="nav-icon icon-orders" aria-hidden="true" />
            <span>My Orders</span>
          </NuxtLink>
        </li>
        <li :class="{ active: activeTab === 'badges' }">
          <NuxtLink to="/badges" class="nav-link" @click="emit('close')">
            <span class="nav-icon icon-badges" aria-hidden="true" />
            <span>My Badges</span>
          </NuxtLink>
        </li>
        <li :class="{ active: activeTab === 'referrals' }">
          <NuxtLink to="/referrals" class="nav-link" @click="emit('close')">
            <span class="nav-icon icon-profile" aria-hidden="true" /><span>Invite friends</span>
          </NuxtLink>
        </li>
        <li :class="{ active: activeTab === 'points' }">
          <NuxtLink to="/points" class="nav-link" @click="emit('close')">
            <span class="nav-icon icon-points" aria-hidden="true" />
            <span>Points &amp; Rewards</span>
          </NuxtLink>
        </li>
      </ul>

      <div class="nav-divider" role="separator" />

      <ul class="nav-list">
        <li :class="{ active: activeTab === 'account-security' }">
          <button class="nav-link" type="button" @click="handleTabChange('account-security')">
            <span class="nav-icon icon-security" aria-hidden="true" />
            <span>Account Security</span>
          </button>
        </li>
        <li :class="{ active: activeTab === 'settings' }">
          <button class="nav-link" type="button" @click="handleTabChange('settings')">
            <span class="nav-icon icon-settings" aria-hidden="true" />
            <span>Settings</span>
          </button>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  activeTab: string
  show?: boolean
  displayName?: string
  email?: string
  avatar?: string
}>(), {
  show: false,
  displayName: '',
  email: '',
  avatar: '',
})

const emit = defineEmits<{
  'update:activeTab': [value: string]
  close: []
}>()

const bioText = computed(() => {
  return props.email || 'Customer Operations'
})

const handleTabChange = (tab: string) => {
  emit('update:activeTab', tab)
  emit('close')
}
</script>

<style scoped>
.profile-sidebar {
  position: sticky;
  top: 108px;
  width: 280px;
  min-height: 672px;
  flex: 0 0 280px;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
  color: #1c2925;
  box-sizing: border-box;
}

.sidebar-topbar {
  display: none;
}

.member-summary {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 20px 20px;
  border-bottom: 1px solid #dadfe6;
}

.member-avatar {
  width: 56px;
  height: 56px;
  flex: 0 0 56px;
  border-radius: 50%;
  overflow: hidden;
  background: #f0f3f1;
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.member-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.member-copy strong {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: #333333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.member-copy span {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.01em;
  color: rgba(51, 51, 51, 0.6);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-nav {
  padding: 24px 0;
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-list li {
  position: relative;
  height: 36px;
}

.nav-link {
  width: 100%;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 20px;
  border: 0;
  border-left: 3px solid transparent;
  background: transparent;
  color: #000000;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  box-sizing: border-box;
  transition: background-color 150ms ease, color 150ms ease;
}

.nav-link:hover {
  background: #f5f7f6;
  color: #2a573f;
}

.nav-list li.active .nav-link {
  background: #e8efea;
  border-left-color: #2a573f;
  color: #2a573f;
  font-weight: 700;
}

.nav-icon {
  width: 16px;
  height: 16px;
  flex: 0 0 16px;
  background-color: currentColor;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}

.icon-profile {
  mask-image: url('/images/profile/icon-profile.svg');
  -webkit-mask-image: url('/images/profile/icon-profile.svg');
}

.icon-wishes {
  mask-image: url('/images/profile/icon-wishes.svg');
  -webkit-mask-image: url('/images/profile/icon-wishes.svg');
}

.icon-trips {
  mask-image: url('/images/profile/icon-trips.svg');
  -webkit-mask-image: url('/images/profile/icon-trips.svg');
}

.icon-orders {
  mask-image: url('/images/profile/icon-orders.svg');
  -webkit-mask-image: url('/images/profile/icon-orders.svg');
}

.icon-badges {
  mask-image: url('/images/profile/icon-badges.svg');
  -webkit-mask-image: url('/images/profile/icon-badges.svg');
}

.icon-points {
  mask-image: url('/images/profile/icon-points.svg');
  -webkit-mask-image: url('/images/profile/icon-points.svg');
}

.icon-security {
  mask-image: url('/images/profile/icon-security.svg');
  -webkit-mask-image: url('/images/profile/icon-security.svg');
}

.icon-settings {
  mask-image: url('/images/profile/icon-settings.svg');
  -webkit-mask-image: url('/images/profile/icon-settings.svg');
}

.nav-divider {
  height: 1px;
  margin: 16px 20px;
  background: #dadfe6;
}

.icon-button {
  width: 40px;
  height: 40px;
  display: inline-grid;
  place-items: center;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

@media (max-width: 820px) {
  .profile-sidebar {
    position: fixed;
    z-index: 1100;
    inset: 0 auto 0 0;
    top: 0;
    width: min(320px, 88vw);
    height: 100dvh;
    padding: 0 0 28px;
    overflow-y: auto;
    background: #ffffff;
    box-shadow: 18px 0 48px rgba(22, 43, 36, 0.15);
    transform: translateX(-105%);
    transition: transform 220ms ease;
  }

  .profile-sidebar.sidebar-open {
    transform: translateX(0);
  }

  .sidebar-topbar {
    min-height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    border-bottom: 1px solid #dadfe6;
    font-size: 15px;
    font-weight: 700;
  }

  .member-summary {
    padding: 20px 20px 16px;
  }
}
</style>
