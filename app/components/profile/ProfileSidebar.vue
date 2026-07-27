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
        <span v-else>{{ initials }}</span>
      </div>
      <div class="member-copy">
        <strong>{{ displayName || 'Lvyv traveller' }}</strong>
        <span>{{ email }}</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <p class="nav-group-label">Profile</p>
      <ul class="nav-list">
        <li :class="{ active: activeTab === 'personal-info' }">
          <button class="nav-link" type="button" @click="handleTabChange('personal-info')">
            <font-awesome-icon :icon="['fas', 'user']" class="nav-icon" />
            <span>Personal Info</span>
          </button>
        </li>
        <li :class="{ active: activeTab === 'wishes' }">
          <NuxtLink to="/wish" class="nav-link" @click="emit('close')">
            <font-awesome-icon :icon="['fas', 'heart']" class="nav-icon" />
            <span>My Wishes</span>
          </NuxtLink>
        </li>
        <li :class="{ active: activeTab === 'trips' }">
          <NuxtLink to="/trips" class="nav-link" @click="emit('close')">
            <font-awesome-icon :icon="['fas', 'location-dot']" class="nav-icon" />
            <span>My Trips</span>
          </NuxtLink>
        </li>
        <li :class="{ active: activeTab === 'badges' }">
          <NuxtLink to="/badges" class="nav-link" @click="emit('close')">
            <font-awesome-icon :icon="['fas', 'medal']" class="nav-icon" />
            <span>My Badges</span>
          </NuxtLink>
        </li>
        <li :class="{ active: activeTab === 'points' }">
          <NuxtLink to="/points" class="nav-link" @click="emit('close')">
            <font-awesome-icon :icon="['fas', 'gift']" class="nav-icon" />
            <span>Points &amp; Rewards</span>
          </NuxtLink>
        </li>
      </ul>

      <p class="nav-group-label account-label">Account</p>
      <ul class="nav-list">
        <li :class="{ active: activeTab === 'account-security' }">
          <button class="nav-link" type="button" @click="handleTabChange('account-security')">
            <font-awesome-icon :icon="['fas', 'lock']" class="nav-icon" />
            <span>Account Security</span>
          </button>
        </li>
        <li :class="{ active: activeTab === 'settings' }">
          <button class="nav-link" type="button" @click="handleTabChange('settings')">
            <font-awesome-icon :icon="['fas', 'gear']" class="nav-icon" />
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

const initials = computed(() => {
  const source = props.displayName.trim() || props.email.trim() || 'L'
  return source.slice(0, 1).toUpperCase()
})

const handleTabChange = (tab: string) => {
  emit('update:activeTab', tab)
  emit('close')
}
</script>

<style scoped>
.profile-sidebar {
  position: sticky;
  top: 104px;
  width: 220px;
  height: fit-content;
  flex: 0 0 220px;
  color: #1c2925;
}

.sidebar-topbar {
  display: none;
}

.member-summary {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 8px 24px;
  border-bottom: 1px solid #dfe5e1;
}

.member-avatar {
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 50%;
  background: #174d40;
  color: #fff;
  font: 700 17px/1 'Inter', sans-serif;
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.member-copy strong,
.member-copy span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.member-copy strong {
  font-size: 14px;
  font-weight: 700;
}

.member-copy span {
  color: #718079;
  font-size: 12px;
}

.sidebar-nav {
  padding-top: 22px;
}

.nav-group-label {
  margin: 0 0 8px 12px;
  color: #8b9691;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.account-label {
  margin-top: 24px;
}

.nav-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-list li {
  position: relative;
  margin: 2px 0;
}

.nav-list li.active::before {
  position: absolute;
  inset: 8px auto 8px 0;
  width: 3px;
  background: #174d40;
  content: '';
}

.nav-link {
  width: 100%;
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: 0;
  background: transparent;
  color: #52605b;
  font: 500 14px/1.3 'Inter', sans-serif;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
}

.nav-link:hover {
  background: #edf1ee;
  color: #174d40;
}

.active .nav-link {
  background: #e7efe9;
  color: #174d40;
  font-weight: 700;
}

.nav-icon {
  width: 18px;
  color: currentColor;
  text-align: center;
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
    padding: 0 20px 28px;
    overflow-y: auto;
    background: #f7f8f6;
    box-shadow: 18px 0 48px rgba(22, 43, 36, 0.15);
    transform: translateX(-105%);
    transition: transform 220ms ease;
  }

  .profile-sidebar.sidebar-open {
    transform: translateX(0);
  }

  .sidebar-topbar {
    min-height: 76px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 15px;
    font-weight: 700;
  }

  .member-summary {
    padding-top: 8px;
  }
}
</style>
