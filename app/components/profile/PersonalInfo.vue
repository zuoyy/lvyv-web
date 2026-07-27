<template>
  <section class="personal-info">
    <header class="section-header">
      <div>
        <p class="section-kicker">Profile</p>
        <h2>Personal information</h2>
        <p class="section-desc">The details that help us shape a better trip for you.</p>
      </div>
      <span class="section-status"><font-awesome-icon :icon="['fas', 'check']" /> Private</span>
    </header>

    <form class="info-form" @submit.prevent="handleSubmit">
      <div class="avatar-row">
        <AvatarUploader v-model="localAvatar" />
        <div class="avatar-copy">
          <strong>Set your avatar</strong>
          <p>Tap the avatar to update your profile photo.</p>
          <span>Your avatar helps people recognise your account.</span>
        </div>
      </div>

      <div class="form-grid">
        <label class="field">
          <span class="field-label">Nickname</span>
          <input v-model="formData.nickname" class="text-input" type="text" maxlength="50" placeholder="What should we call you?">
          <span class="field-meta">{{ formData.nickname.length }}/50</span>
        </label>

        <label class="field">
          <span class="field-label">Email</span>
          <input :value="email" class="text-input" type="email" readonly aria-describedby="email-note">
          <span id="email-note" class="field-hint">Your verified sign-in email.</span>
        </label>

        <label class="field">
          <span class="field-label">Country of passport <em>Required</em></span>
          <CountrySelect v-model="formData.passportCountryCode" :invalid="countryInvalid" />
          <span v-if="countryError" class="field-error">{{ countryError }}</span>
        </label>

        <label class="field">
          <span class="field-label">Phone number <em>Optional</em></span>
          <input v-model="formData.mobile" class="text-input" type="tel" inputmode="tel" placeholder="+1 202 555 0123">
          <span class="field-hint">Only used for travel and emergency contact.</span>
        </label>

        <label class="field">
          <span class="field-label">Gender <em>Optional</em></span>
          <select v-model.number="formData.gender" class="text-input">
            <option :value="0">Prefer not to say</option>
            <option :value="1">Male</option>
            <option :value="2">Female</option>
          </select>
          <span class="field-hint">Used only to personalize your account experience.</span>
        </label>

        <label class="field">
          <span class="field-label">Birthday <em>Optional</em></span>
          <input v-model="formData.birthday" class="text-input" type="date" :max="today">
          <span class="field-hint">Choose a date if you want us to remember it.</span>
        </label>
      </div>

      <label class="field">
        <span class="field-label">Bio <em>Optional</em></span>
        <textarea v-model="formData.bio" class="text-input text-area" maxlength="200" rows="4" placeholder="Tell local friends a little about you." />
        <span class="field-meta">{{ formData.bio.length }}/200</span>
      </label>

      <div class="preference-block">
        <TravelPreferences v-model="formData.preferences" />
      </div>

      <section class="timezone-block" aria-labelledby="timezone-title">
        <div class="timezone-heading">
          <div>
            <h3 id="timezone-title">Trip reminder time zone</h3>
            <p>{{ formData.timezoneMode === 1 ? 'Using a fixed time zone.' : 'Off. We use your device time zone automatically.' }}</p>
          </div>
          <label class="toggle-control">
            <input v-model="formData.timezoneMode" type="checkbox" :true-value="1" :false-value="0">
            <span class="toggle-track"><span /></span>
            <span class="sr-only">Use a fixed time zone</span>
          </label>
        </div>
        <label v-if="formData.timezoneMode === 1" class="field timezone-select-field">
          <span class="field-label">Choose a time zone</span>
          <select v-model="formData.timezone" class="text-input">
            <option value="">Select a time zone</option>
            <option v-for="tz in timezoneOptions" :key="tz.value" :value="tz.value">{{ tz.label }}</option>
          </select>
        </label>
      </section>

      <div v-if="statusMessage" class="form-notice" :class="{ error: statusError }" role="status">
        <font-awesome-icon :icon="['fas', statusError ? 'circle-exclamation' : 'check']" />
        <span>{{ statusMessage }}</span>
      </div>

      <div class="form-actions">
        <button class="button button-quiet" type="button" :disabled="saving" @click="handleCancel">Discard</button>
        <button class="button button-primary" type="submit" :disabled="saving">
          <span v-if="saving" class="button-spinner" />
          {{ saving ? 'Saving changes' : 'Save changes' }}
        </button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import AvatarUploader from './AvatarUploader.vue'
import TravelPreferences from './TravelPreferences.vue'
import CountrySelect from '../CountrySelect.vue'

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

const props = defineProps<{
  email: string
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
  onSave: (draft: ProfileDraft) => Promise<void>
}>()

const localAvatar = ref(props.avatar)
const formData = reactive({
  nickname: props.nickname,
  mobile: props.mobile,
  passportCountryCode: props.passportCountryCode,
  bio: props.bio,
  preferences: [...props.preferences],
  timezone: props.timezone || detectMemberTimeZone(),
  timezoneMode: props.timezoneMode === 1 ? 1 : 0,
  gender: props.gender || 0,
  birthday: props.birthday || '',
})

const getLocalDateValue = (date = new Date()) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return localDate.toISOString().slice(0, 10)
}

const today = getLocalDateValue()

const timezoneOptions = [
  { value: 'America/New_York', label: 'UTC-05:00 · New York' },
  { value: 'America/Los_Angeles', label: 'UTC-08:00 · Los Angeles' },
  { value: 'Europe/London', label: 'UTC+00:00 · London' },
  { value: 'Europe/Paris', label: 'UTC+01:00 · Paris' },
  { value: 'Asia/Shanghai', label: 'UTC+08:00 · Shanghai' },
  { value: 'Asia/Tokyo', label: 'UTC+09:00 · Tokyo' },
  { value: 'Asia/Singapore', label: 'UTC+08:00 · Singapore' },
  { value: 'Australia/Sydney', label: 'UTC+10:00 · Sydney' },
]

const saving = ref(false)
const countryInvalid = ref(false)
const countryError = ref('')
const statusMessage = ref('')
const statusError = ref(false)

const syncFromProps = () => {
  formData.nickname = props.nickname
  formData.mobile = props.mobile
  formData.passportCountryCode = props.passportCountryCode
  formData.bio = props.bio
  formData.preferences = [...props.preferences]
  formData.timezone = props.timezone || detectMemberTimeZone()
  formData.timezoneMode = props.timezoneMode === 1 ? 1 : 0
  formData.gender = props.gender || 0
  formData.birthday = props.birthday || ''
  localAvatar.value = props.avatar
}

watch(() => props.avatar, (value) => { localAvatar.value = value })
watch(() => formData.timezoneMode, (mode) => {
  if (mode === 0 || !formData.timezone) formData.timezone = detectMemberTimeZone()
})

const handleSubmit = async () => {
  countryInvalid.value = !formData.passportCountryCode
  countryError.value = countryInvalid.value ? 'Choose the country that issued your passport.' : ''
  statusMessage.value = ''
  statusError.value = false
  if (countryInvalid.value) return

  saving.value = true
  try {
    await props.onSave({
      nickname: formData.nickname.trim(),
      mobile: formData.mobile.trim(),
      passportCountryCode: formData.passportCountryCode,
      bio: formData.bio.trim(),
      preferences: [...formData.preferences],
      avatar: localAvatar.value,
      timezone: formData.timezoneMode === 1 ? formData.timezone : detectMemberTimeZone(),
      timezoneMode: Number(formData.timezoneMode),
      gender: Number(formData.gender) || 0,
      birthday: formData.birthday || '',
    })
    statusMessage.value = 'Your profile has been updated.'
  } catch (caught) {
    statusError.value = true
    statusMessage.value = caught instanceof Error ? caught.message : 'Unable to update your profile.'
  } finally {
    saving.value = false
  }
}

const handleCancel = () => {
  syncFromProps()
  countryInvalid.value = false
  countryError.value = ''
  statusMessage.value = ''
}
</script>

<style scoped>
.personal-info { max-width: 820px; }
.section-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; padding-bottom: 28px; border-bottom: 1px solid #e1e7e2; }
.section-kicker { margin: 0 0 8px; color: #6a7971; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
.section-header h2 { margin: 0; color: #173f34; font: 600 30px/1.15 'Playfair Display', Georgia, serif; }
.section-desc { margin: 9px 0 0; color: #718079; font-size: 14px; line-height: 1.5; }
.section-status { display: inline-flex; align-items: center; gap: 6px; padding: 7px 10px; background: #edf5ed; color: #386347; font-size: 11px; font-weight: 700; white-space: nowrap; }
.info-form { display: flex; flex-direction: column; gap: 28px; padding-top: 30px; }
.avatar-row { display: flex; align-items: center; gap: 20px; padding-bottom: 26px; border-bottom: 1px solid #e9eeea; }
.avatar-copy { display: flex; flex-direction: column; gap: 5px; }
.avatar-copy strong { color: #24352e; font-size: 14px; }
.avatar-copy p { max-width: 360px; margin: 0; color: #6d7a74; font-size: 13px; line-height: 1.5; }
.avatar-copy span { color: #9aa59f; font-size: 11px; }
.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px 20px; }
.field { position: relative; display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.field-label { display: flex; align-items: baseline; gap: 7px; color: #26372f; font-size: 12px; font-weight: 700; }
.field-label em { color: #84928b; font-size: 11px; font-style: normal; font-weight: 500; }
.text-input { width: 100%; min-height: 46px; box-sizing: border-box; padding: 12px 13px; border: 1px solid #ccd6d0; border-radius: 2px; outline: none; background: #fff; color: #22352c; font: 400 14px/1.4 'Inter', sans-serif; transition: border-color .18s, box-shadow .18s; }
.text-input:hover { border-color: #8ca59a; }
.text-input:focus { border-color: #174d40; box-shadow: 0 0 0 3px rgba(23, 77, 64, .12); }
.text-input[readonly] { background: #f2f5f2; color: #6e7d76; cursor: not-allowed; }
select.text-input { appearance: auto; }
.text-area { min-height: 120px; resize: vertical; }
.field-hint, .field-meta { color: #8a9690; font-size: 11px; line-height: 1.35; }
.field-meta { position: absolute; right: 0; bottom: -18px; }
.field-error { color: #b0473d; font-size: 11px; }
.preference-block { padding: 25px 0 0; border-top: 1px solid #e9eeea; }
.timezone-block { padding: 24px 0 0; border-top: 1px solid #e9eeea; }
.timezone-heading { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.timezone-heading h3 { margin: 0; color: #26372f; font-size: 14px; }
.timezone-heading p { margin: 5px 0 0; color: #7c8983; font-size: 12px; }
.timezone-select-field { max-width: 380px; margin-top: 20px; }
.toggle-control { position: relative; display: inline-flex; align-items: center; flex: 0 0 auto; cursor: pointer; }
.toggle-control input { position: absolute; opacity: 0; width: 1px; height: 1px; }
.toggle-track { width: 42px; height: 24px; display: flex; align-items: center; padding: 3px; box-sizing: border-box; border-radius: 30px; background: #c8d1cb; transition: background .18s; }
.toggle-track span { width: 18px; height: 18px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0, 0, 0, .2); transition: transform .18s; }
.toggle-control input:checked + .toggle-track { background: #174d40; }
.toggle-control input:checked + .toggle-track span { transform: translateX(18px); }
.toggle-control input:focus-visible + .toggle-track { outline: 3px solid rgba(23, 77, 64, .2); outline-offset: 2px; }
.form-notice { display: flex; align-items: center; gap: 8px; padding: 12px 14px; background: #edf5ed; color: #386347; font-size: 13px; }
.form-notice.error { background: #fff1ef; color: #a33e35; }
.form-actions { display: flex; align-items: center; justify-content: flex-end; gap: 10px; padding-top: 5px; }
.button { min-height: 44px; display: inline-flex; align-items: center; justify-content: center; gap: 9px; padding: 0 18px; border: 1px solid transparent; border-radius: 2px; font: 700 13px/1 'Inter', sans-serif; cursor: pointer; transition: background .18s, color .18s, border-color .18s; }
.button:disabled { opacity: .58; cursor: wait; }
.button-primary { background: #174d40; color: #fff; }
.button-primary:hover:not(:disabled) { background: #0e392e; }
.button-quiet { border-color: #ccd6d0; background: #fff; color: #52605b; }
.button-quiet:hover:not(:disabled) { border-color: #174d40; color: #174d40; }
.button-spinner { width: 13px; height: 13px; border: 2px solid rgba(255,255,255,.4); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width: 640px) { .section-header { display: block; } .section-status { margin-top: 16px; } .form-grid { grid-template-columns: 1fr; } .avatar-row { align-items: flex-start; } .avatar-copy { padding-top: 7px; } .form-actions { flex-direction: column-reverse; align-items: stretch; } .button { width: 100%; } }
</style>
