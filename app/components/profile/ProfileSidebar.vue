<template>
  <aside class="profile-sidebar" :class="{ 'sidebar-open': show }">
    <div class="sidebar-header">
      <div class="sidebar-logo">
        <img src="/images/common/logo-header.svg" alt="Lvyv" class="logo-img">
      </div>
      <button class="sidebar-close" @click="$emit('close')">
        <font-awesome-icon :icon="['fas', 'times']" />
      </button>
    </div>
    
    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li class="nav-item" :class="{ active: activeTab === 'personal-info' }">
          <button @click="handleTabChange('personal-info')" class="nav-link">
            <font-awesome-icon :icon="['fas', 'user']" class="nav-icon" />
            <span>Personal Info</span>
          </button>
        </li>
        <li class="nav-item">
          <NuxtLink to="/wish" class="nav-link" @click="$emit('close')">
            <font-awesome-icon :icon="['fas', 'heart']" class="nav-icon" />
            <span>My Wishes</span>
          </NuxtLink>
        </li>
        <li class="nav-item">
          <NuxtLink to="/trips" class="nav-link" @click="$emit('close')">
            <font-awesome-icon :icon="['fas', 'map-marker-alt']" class="nav-icon" />
            <span>My Trips</span>
          </NuxtLink>
        </li>
        <li class="nav-item">
          <NuxtLink to="/badges" class="nav-link" @click="$emit('close')">
            <font-awesome-icon :icon="['fas', 'medal']" class="nav-icon" />
            <span>My Badges</span>
          </NuxtLink>
        </li>
        <li class="nav-item">
          <NuxtLink to="/points" class="nav-link" @click="$emit('close')">
            <font-awesome-icon :icon="['fas', 'gift']" class="nav-icon" />
            <span>Points & Rewards</span>
          </NuxtLink>
        </li>
        <li class="nav-item" :class="{ active: activeTab === 'account-security' }">
          <button @click="handleTabChange('account-security')" class="nav-link">
            <font-awesome-icon :icon="['fas', 'lock']" class="nav-icon" />
            <span>Account Security</span>
          </button>
        </li>
        <li class="nav-item" :class="{ active: activeTab === 'settings' }">
          <button @click="handleTabChange('settings')" class="nav-link">
            <font-awesome-icon :icon="['fas', 'cog']" class="nav-icon" />
            <span>Settings</span>
          </button>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
const props = defineProps<{
  activeTab: string
  show?: boolean
}>()

const emit = defineEmits<{
  'update:activeTab': [value: string]
  close: []
}>()

const handleTabChange = async (tab: string) => {
  await navigateTo('/profile')
  emit('update:activeTab', tab)
  emit('close')
}
</script>

<style scoped>
.profile-sidebar {
  width: 200px;
  min-height: 100vh;
  background: #ffffff;
  border-right: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  padding-top: 80px;
  z-index: 990;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.profile-sidebar.sidebar-open {
  transform: translateX(0);
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-close {
  display: none;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #666666;
  font-size: 18px;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s;
}

.sidebar-close:hover {
  background: #f2f2f2;
  color: #105446;
}

.sidebar-logo {
  display: flex;
  align-items: center;
}

.logo-img {
  height: 32px;
  width: auto;
}

.sidebar-nav {
  flex: 1;
  padding: 16px 0;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin: 4px 12px;
  border-radius: 8px;
  transition: background 0.2s;
}

.nav-item:hover {
  background: #f2f2f2;
}

.nav-item.active {
  background: #e9f3ee;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  width: 100%;
  border: none;
  background: transparent;
  color: #203d33;
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #105446;
}

.nav-item.active .nav-link {
  color: #105446;
  font-weight: 600;
}

.nav-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

@media (min-width: 769px) {
  .profile-sidebar {
    transform: translateX(0);
  }
  
  .sidebar-close {
    display: none;
  }
}

@media (max-width: 768px) {
  .sidebar-close {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
