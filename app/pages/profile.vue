<template>
  <div class="profile-container">
    <button class="mobile-menu-btn" @click="showSidebar = true">
      <font-awesome-icon :icon="['fas', 'bars']" />
    </button>
    
    <div class="sidebar-overlay" v-if="showSidebar" @click="showSidebar = false"></div>
    
    <ProfileSidebar 
      v-model:activeTab="activeTab" 
      :show="showSidebar"
      @close="showSidebar = false"
    />
    
    <main class="profile-content">
      <div class="content-wrapper">
        <PersonalInfo
          v-if="activeTab === 'personal-info'"
          :email="form.email"
          :nickname="form.nickname"
          :mobile="form.mobile"
          :passportCountryCode="form.passportCountryCode"
          :bio="form.bio || ''"
          :preferences="preferences"
          :avatar="avatar"
          :timezone="form.timezone"
          :timezoneMode="form.timezoneMode"
          @update:nickname="form.nickname = $event"
          @update:mobile="form.mobile = $event"
          @update:passportCountryCode="form.passportCountryCode = $event"
          @update:bio="form.bio = $event"
          @update:preferences="preferences = $event"
          @update:avatar="avatar = $event"
          @update:timezone="form.timezone = $event"
          @update:timezoneMode="form.timezoneMode = $event"
          @save="save"
        />
        
        <AccountSecurity v-else-if="activeTab === 'account-security'" />
        
        <Settings v-else-if="activeTab === 'settings'" />
        
        <div v-else class="empty-state">
          <p class="empty-title">Welcome to Your Profile</p>
          <p class="empty-desc">Select a section from the sidebar to get started.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import ProfileSidebar from '~/components/profile/ProfileSidebar.vue'
import PersonalInfo from '~/components/profile/PersonalInfo.vue'
import AccountSecurity from '~/components/profile/AccountSecurity.vue'
import Settings from '~/components/profile/Settings.vue'

const auth = useMemberAuth()
const activeTab = ref('personal-info')
const avatar = ref('')
const preferences = ref<string[]>([])
const showSidebar = ref(false)

const form = reactive({
  email: '',
  nickname: '',
  mobile: '',
  passportCountryCode: '',
  bio: '',
  locale: 'en-US',
  timezone: '',
  timezoneMode: 0,
})

onMounted(async () => {
  if (!auth.token.value) {
    await navigateTo('/login?redirect=/profile')
    return
  }
  try {
    const member = auth.member.value || await auth.loadMember()
    if (!member) throw new Error('Unable to load your profile')
    form.email = member.email
    form.nickname = member.nickname || ''
    form.mobile = member.mobile || ''
    form.passportCountryCode = member.passportCountryCode || ''
    form.bio = member.bio || ''
    form.locale = member.locale
    form.timezone = member.timezone
    form.timezoneMode = member.timezoneMode
    avatar.value = member.avatar || ''
  } catch {
    auth.clearSession()
    await navigateTo('/login?redirect=/profile')
  }
})

const save = async () => {
  await auth.updateProfile({
    ...form,
    mobile: form.mobile || undefined,
    nickname: form.nickname || undefined,
    bio: form.bio || undefined,
  })
}
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: #F8F8F8;
  display: block;
}

.mobile-menu-btn {
  display: none;
  position: fixed;
  top: calc(80px + 16px);
  left: 16px;
  z-index: 1000;
  width: 44px;
  height: 44px;
  border: none;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  color: #105446;
  font-size: 20px;
  align-items: center;
  justify-content: center;
}

.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 950;
}

.profile-content {
  margin-left: 200px;
  padding: 80px 48px;
  background: #ffffff;
  min-height: 100vh;
}

.content-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #808080;
}

.empty-title {
  font-family: 'Poppins', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.empty-desc {
  font-family: 'Roboto', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 15px;
  color: #666666;
  margin: 0;
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
  }
  
  .sidebar-overlay {
    display: block;
  }
  
  .profile-content {
    margin-left: 0;
    padding: 24px;
    padding-top: 80px;
  }
}

@media (min-width: 769px) {
  .profile-container .profile-sidebar {
    display: flex;
  }
}
</style>
