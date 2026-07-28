<template>
  <main class="profile-page">
    <div v-if="loading" class="profile-loading" role="status">
      <span class="loading-mark" />
      <span>Loading your account...</span>
    </div>

    <template v-else>
      <header class="profile-heading">
        <div>
          <p class="profile-eyebrow">My account</p>
          <h1>Profile &amp; preferences</h1>
          <p>Keep your travel details, security and communication choices up to date.</p>
        </div>
        <button class="mobile-menu-button" type="button" @click="showSidebar = true">
          <font-awesome-icon :icon="['fas', 'bars']" />
          <span>Account menu</span>
        </button>
      </header>

      <div v-if="needsPassportCompletion" class="profile-completion-banner" role="status">
        <font-awesome-icon :icon="['fas', 'circle-exclamation']" />
        <div>
          <strong>One detail left</strong>
          <span>Add your passport country before you start planning.</span>
        </div>
      </div>

      <div class="profile-layout">
        <div v-if="showSidebar" class="sidebar-overlay" @click="showSidebar = false" />
        <ProfileSidebar
          v-model:active-tab="activeTab"
          :show="showSidebar"
          :display-name="displayName"
          :email="form.email"
          :avatar="avatar"
          @close="showSidebar = false"
        />

        <section class="profile-workspace" :aria-label="activeSectionLabel">
          <PersonalInfo
            v-if="activeTab === 'personal-info'"
            :email="form.email"
            :nickname="form.nickname"
            :mobile="form.mobile"
            :passport-country-code="form.passportCountryCode"
            :bio="form.bio"
            :gender="form.gender"
            :birthday="form.birthday"
            :preferences="preferences"
            :avatar="avatar"
            :timezone="form.timezone"
            :timezone-mode="form.timezoneMode"
            :on-save="saveProfile"
          />
          <AccountSecurity v-else-if="activeTab === 'account-security'" />
          <Settings v-else-if="activeTab === 'settings'" />
        </section>
      </div>
    </template>
  </main>
</template>

<script setup lang="ts">
import ProfileSidebar from '~/components/profile/ProfileSidebar.vue'
import PersonalInfo from '~/components/profile/PersonalInfo.vue'
import AccountSecurity from '~/components/profile/AccountSecurity.vue'
import Settings from '~/components/profile/Settings.vue'

useNoIndex()

type ProfileSection = 'personal-info' | 'account-security' | 'settings'

interface ProfileDraft {
  nickname: string
  mobile: string
  passportCountryCode: string
  bio: string
  preferences: string[]
  avatar: string
  timezone: string
  timezoneMode: number
  gender: number
  birthday: string
}

const auth = useMemberAuth()
const route = useRoute()
const router = useRouter()
const validSections: ProfileSection[] = ['personal-info', 'account-security', 'settings']
const requestedSection = typeof route.query.section === 'string' ? route.query.section : ''
const activeTab = ref<ProfileSection>(validSections.includes(requestedSection as ProfileSection)
  ? requestedSection as ProfileSection
  : 'personal-info')
const avatar = ref('')
const preferences = ref<string[]>([])
const showSidebar = ref(false)
const loading = ref(true)
const needsPassportCompletion = ref(route.query.complete === 'passport')

const form = reactive({
  email: '',
  nickname: '',
  mobile: '',
  passportCountryCode: '',
  bio: '',
  locale: 'en-US',
  timezone: '',
  timezoneMode: 0,
  gender: 0,
  birthday: '',
})

const displayName = computed(() => form.nickname.trim() || form.email.split('@')[0] || '')
const activeSectionLabel = computed(() => ({
  'personal-info': 'Personal information',
  'account-security': 'Account security',
  settings: 'Settings',
})[activeTab.value])

watch(activeTab, (section) => {
  router.replace({ query: { ...route.query, section, complete: undefined } })
})

onMounted(async () => {
  if (!auth.token.value) {
    await navigateTo('/login/?redirect=/profile')
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
    form.locale = member.locale || 'en-US'
    form.timezone = member.timezone || ''
    form.timezoneMode = member.timezoneMode || 0
    form.gender = member.gender || 0
    form.birthday = member.birthday || ''
    avatar.value = member.avatar || ''
    needsPassportCompletion.value = !form.passportCountryCode && route.query.complete === 'passport'
  } catch {
    auth.clearSession()
    await navigateTo('/login/?redirect=/profile')
    return
  } finally {
    loading.value = false
  }
})

const saveProfile = async (draft: ProfileDraft) => {
  await auth.updateProfile({
    email: form.email,
    mobile: draft.mobile || undefined,
    nickname: draft.nickname || undefined,
    locale: form.locale,
    timezone: draft.timezone,
    timezoneMode: draft.timezoneMode,
    passportCountryCode: draft.passportCountryCode,
    avatar: draft.avatar || undefined,
    gender: draft.gender,
    birthday: draft.birthday || null,
  })

  form.nickname = draft.nickname
  form.mobile = draft.mobile
  form.passportCountryCode = draft.passportCountryCode
  form.bio = draft.bio
  form.timezone = draft.timezone
  form.timezoneMode = draft.timezoneMode
  form.gender = draft.gender
  form.birthday = draft.birthday
  preferences.value = [...draft.preferences]
  avatar.value = draft.avatar
  needsPassportCompletion.value = false
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding: 124px 32px 96px;
  background: #f4f6f3;
  color: #1c2925;
}

.profile-heading,
.profile-layout,
.profile-completion-banner {
  width: min(1180px, 100%);
  margin-inline: auto;
}

.profile-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 28px;
  margin-bottom: 38px;
}

.profile-eyebrow {
  margin: 0 0 10px;
  color: #65746e;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.profile-heading h1 {
  margin: 0;
  color: #163e34;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(34px, 4vw, 50px);
  font-weight: 600;
  line-height: 1.05;
}

.profile-heading p:last-child {
  max-width: 620px;
  margin: 13px 0 0;
  color: #63716c;
  font-size: 15px;
  line-height: 1.6;
}

.mobile-menu-button {
  min-height: 44px;
  display: none;
  align-items: center;
  gap: 9px;
  padding: 0 15px;
  border: 1px solid #cad3ce;
  background: #fff;
  color: #174d40;
  font: 700 13px/1 'Inter', sans-serif;
  cursor: pointer;
}

.profile-completion-banner {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 28px;
  padding: 16px 18px;
  border-left: 4px solid #bfdc72;
  background: #f8fbe9;
  color: #30472c;
}

.profile-completion-banner > svg {
  color: #5c7b30;
  font-size: 19px;
}

.profile-completion-banner div {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 9px;
  font-size: 13px;
}

.profile-completion-banner strong {
  color: #203a2a;
}

.profile-layout {
  display: flex;
  align-items: flex-start;
  gap: 52px;
}

.profile-workspace {
  min-width: 0;
  flex: 1;
  padding: 38px 42px 44px;
  border: 1px solid #dfe5e1;
  background: #fff;
  box-shadow: 0 14px 38px rgba(28, 56, 47, 0.06);
}

.profile-loading {
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
  .profile-layout {
    gap: 30px;
  }

  .profile-workspace {
    padding: 32px;
  }
}

@media (max-width: 820px) {
  .profile-page {
    padding: 104px 20px 72px;
  }

  .profile-heading {
    align-items: flex-start;
    margin-bottom: 28px;
  }

  .profile-heading h1 {
    font-size: 36px;
  }

  .mobile-menu-button {
    display: flex;
    flex: 0 0 auto;
  }

  .profile-layout {
    display: block;
  }

  .sidebar-overlay {
    position: fixed;
    z-index: 1090;
    inset: 0;
    display: block;
    background: rgba(10, 25, 20, 0.46);
  }

  .profile-workspace {
    padding: 28px 24px 34px;
  }
}

@media (max-width: 560px) {
  .profile-page {
    padding-inline: 14px;
  }

  .profile-heading {
    display: block;
  }

  .profile-heading h1 {
    font-size: 32px;
  }

  .mobile-menu-button {
    width: 100%;
    justify-content: center;
    margin-top: 20px;
  }

  .profile-workspace {
    padding: 24px 18px 30px;
  }
}
</style>
