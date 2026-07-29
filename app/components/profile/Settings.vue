<template>
  <section class="settings">
    <header class="section-header">
      <p class="section-kicker">Preferences</p>
      <h2>Settings</h2>
      <p class="section-desc">Choose how Lvyv communicates with you and how your trips appear to others.</p>
    </header>

    <div v-if="loading" class="settings-loading" role="status"><span /> Loading settings...</div>
    <form v-else class="settings-form" @submit.prevent="saveSettings">
      <section class="settings-section">
        <div class="settings-heading">
          <div><h3>Language</h3><p>Language used across your Lvyv account.</p></div>
          <font-awesome-icon :icon="['fas', 'globe']" />
        </div>
        <label class="language-field">
          <span>Preferred language</span>
          <select v-model="selectedLanguage" class="select-control">
            <option value="en-US">English</option>
            <option value="zh-CN" disabled>中文 · Coming soon</option>
          </select>
        </label>
      </section>

      <section class="settings-section">
        <div class="settings-heading">
          <div><h3>Email notifications</h3><p>Important security and booking messages are always sent.</p></div>
          <font-awesome-icon :icon="['fas', 'envelope']" />
        </div>
        <div class="settings-list">
          <label v-for="item in notificationOptions" :key="item.key" class="setting-row">
            <span class="setting-copy"><strong>{{ item.title }}</strong><span>{{ item.description }}</span></span>
            <span class="toggle-control"><input v-model="emailNotifications[item.key]" type="checkbox"><span class="toggle-track"><span /></span></span>
          </label>
        </div>
      </section>

      <section class="settings-section">
        <div class="settings-heading">
          <div><h3>Privacy</h3><p>Control how your travel activity appears to the community.</p></div>
          <font-awesome-icon :icon="['fas', 'shield-halved']" />
        </div>
        <div class="settings-list">
          <label class="setting-row">
            <span class="setting-copy"><strong>Trip visibility</strong><span>Allow other travellers to view and clone your public trips.</span></span>
            <span class="toggle-control"><input v-model="tripVisibility" type="checkbox"><span class="toggle-track"><span /></span></span>
          </label>
          <div class="setting-row disabled-row">
            <span class="setting-copy"><strong>Show in group travel</strong><span>Display your profile in group travel matching.</span></span>
            <span class="coming-soon">Coming soon</span>
          </div>
        </div>
      </section>

      <div v-if="message" class="settings-notice" :class="{ error }" role="status">
        <font-awesome-icon :icon="['fas', error ? 'circle-exclamation' : 'check']" />{{ message }}
      </div>

      <div class="settings-actions">
        <button class="button button-secondary" type="button" :disabled="saving" @click="resetSettings">Reset</button>
        <button class="button button-primary" type="submit" :disabled="saving">{{ saving ? 'Saving settings' : 'Save settings' }}</button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

type NotificationKey = 'POINTS' | 'MARKETING'

const auth = useMemberAuth()
const selectedLanguage = ref('en-US')
const emailNotifications = reactive<Record<NotificationKey, boolean>>({ POINTS: true, MARKETING: false })
const tripVisibility = ref(true)
const loading = ref(true)
const saving = ref(false)
const message = ref('')
const error = ref(false)
const originalSettings = reactive({ selectedLanguage: 'en-US', notifications: { ...emailNotifications }, tripVisibility: true })

const notificationOptions: { key: NotificationKey; title: string; description: string }[] = [
  { key: 'POINTS', title: 'Points & rewards', description: 'Point balance changes and new reward levels.' },
  { key: 'MARKETING', title: 'Newsletter', description: 'Selected stories, travel ideas and Lvyv news.' },
]

onMounted(async () => {
  selectedLanguage.value = auth.member.value?.locale || 'en-US'
  try {
    const data = await auth.getPreferences()
    data.subscriptions.forEach((item) => {
      if (item.key in emailNotifications) emailNotifications[item.key as NotificationKey] = item.subscribed
    })
  } catch (caught) {
    error.value = true
    message.value = caught instanceof Error ? caught.message : 'Unable to load notification settings.'
  } finally {
    originalSettings.selectedLanguage = selectedLanguage.value
    originalSettings.notifications = { ...emailNotifications }
    originalSettings.tripVisibility = tripVisibility.value
    loading.value = false
  }
})

const saveSettings = async () => {
  saving.value = true
  message.value = ''
  error.value = false
  try {
    await auth.updatePreferences({ ...emailNotifications })
    originalSettings.selectedLanguage = selectedLanguage.value
    originalSettings.notifications = { ...emailNotifications }
    originalSettings.tripVisibility = tripVisibility.value
    message.value = 'Your settings have been saved.'
  } catch (caught) {
    error.value = true
    message.value = caught instanceof Error ? caught.message : 'Unable to save settings.'
  } finally {
    saving.value = false
  }
}

const resetSettings = () => {
  selectedLanguage.value = originalSettings.selectedLanguage
  Object.assign(emailNotifications, originalSettings.notifications)
  tripVisibility.value = originalSettings.tripVisibility
  message.value = ''
  error.value = false
}
</script>

<style scoped>
.settings { max-width: 820px; }
.section-header { padding-bottom: 28px; border-bottom: 1px solid #e1e7e2; }
.section-kicker { margin: 0 0 8px; color: #6a7971; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
.section-header h2 { margin: 0; color: #173f34; font: 600 30px/1.15 'Playfair Display', Georgia, serif; }
.section-desc { margin: 9px 0 0; color: #718079; font-size: 14px; line-height: 1.5; }
.settings-form { display: flex; flex-direction: column; }
.settings-section { padding: 29px 0; border-bottom: 1px solid #e1e7e2; }
.settings-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 22px; }
.settings-heading h3 { margin: 0; color: #26372f; font-size: 16px; }
.settings-heading p { margin: 7px 0 0; color: #7b8982; font-size: 12px; line-height: 1.5; }
.settings-heading > svg { margin-top: 2px; color: #88a194; font-size: 20px; }
.language-field { max-width: 390px; display: flex; flex-direction: column; gap: 8px; color: #35463d; font-size: 12px; font-weight: 700; }
.select-control { min-height: 44px; padding: 0 12px; border: 1px solid #ccd6d0; border-radius: 2px; outline: none; background: #fff; color: #22352c; font: 400 14px/1.4 'Inter', sans-serif; }
.select-control:focus { border-color: #174d40; box-shadow: 0 0 0 3px rgba(23, 77, 64, .12); }
.settings-list { display: flex; flex-direction: column; }
.setting-row { min-height: 67px; display: flex; align-items: center; justify-content: space-between; gap: 24px; border-bottom: 1px solid #eef1ee; cursor: pointer; }
.setting-row:last-child { border-bottom: 0; }
.setting-copy { min-width: 0; display: flex; flex-direction: column; gap: 5px; }
.setting-copy strong { color: #304239; font-size: 13px; }
.setting-copy > span { color: #7b8982; font-size: 12px; line-height: 1.4; }
.toggle-control { position: relative; flex: 0 0 auto; cursor: pointer; }
.toggle-control input { position: absolute; width: 1px; height: 1px; opacity: 0; }
.toggle-track { width: 42px; height: 24px; display: flex; align-items: center; box-sizing: border-box; padding: 3px; border-radius: 30px; background: #c8d1cb; transition: background .18s; }
.toggle-track span { width: 18px; height: 18px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.2); transition: transform .18s; }
.toggle-control input:checked + .toggle-track { background: #174d40; }
.toggle-control input:checked + .toggle-track span { transform: translateX(18px); }
.toggle-control input:focus-visible + .toggle-track { outline: 3px solid rgba(23,77,64,.2); outline-offset: 2px; }
.disabled-row { opacity: .55; cursor: default; }
.coming-soon { flex: 0 0 auto; padding: 6px 8px; background: #edf0ed; color: #68766f; font-size: 10px; font-weight: 700; text-transform: uppercase; }
.settings-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 27px; }
.button { min-height: 43px; padding: 0 17px; border: 1px solid transparent; border-radius: 2px; font: 700 12px/1 'Inter', sans-serif; cursor: pointer; }
.button:disabled { opacity: .58; cursor: wait; }
.button-primary { background: #174d40; color: #fff; }
.button-primary:hover:not(:disabled) { background: #0e392e; }
.button-secondary { border-color: #ccd6d0; background: #fff; color: #52605b; }
.button-secondary:hover:not(:disabled) { border-color: #174d40; color: #174d40; }
.settings-notice { display: flex; align-items: center; gap: 8px; margin-top: 24px; padding: 12px 14px; background: #edf5ed; color: #386347; font-size: 13px; }
.settings-notice.error { background: #fff1ef; color: #a33e35; }
.settings-loading { min-height: 260px; display: flex; align-items: center; justify-content: center; gap: 10px; color: #718079; font-size: 13px; }
.settings-loading > span { width: 16px; height: 16px; border: 2px solid #ccd5d0; border-top-color: #174d40; border-radius: 50%; animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width: 560px) { .setting-row { gap: 14px; padding: 10px 0; } .settings-actions { flex-direction: column-reverse; } .button { width: 100%; } }
</style>
