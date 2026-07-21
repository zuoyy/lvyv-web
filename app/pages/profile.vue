<template>
  <main class="auth-page">
    <section class="auth-shell auth-shell-register">
      <p class="auth-kicker">Member profile</p>
      <h1>My Profile</h1>
      <p class="auth-intro">Keep your details current for future travel planning.</p>
      <p v-if="message" class="auth-message" :class="{ error }" role="alert">{{ message }}</p>

      <form v-if="ready" class="auth-form" @submit.prevent="save">
        <div class="auth-field">
          <label for="profile-email">Email</label>
          <input id="profile-email" v-model="form.email" type="email" autocomplete="email" readonly>
          <small>Your verified login email cannot be changed here.</small>
        </div>
        <div class="auth-field">
          <label for="profile-name">Name</label>
          <input id="profile-name" v-model.trim="form.nickname" autocomplete="name" maxlength="50">
        </div>
        <div class="auth-field">
          <label for="profile-passport-country">Country of Passport</label>
          <AuthCountrySelect v-model="form.passportCountryCode" :invalid="countryInvalid" />
        </div>
        <div class="auth-field">
          <label for="profile-mobile">Mobile <span>(optional)</span></label>
          <input id="profile-mobile" v-model.trim="form.mobile" type="tel" inputmode="tel" autocomplete="tel" pattern="\+?[1-9][0-9]{6,14}">
        </div>
        <button class="auth-submit" :disabled="saving">{{ saving ? 'Saving...' : 'Save profile' }}</button>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
const auth = useMemberAuth()
const ready = ref(false)
const saving = ref(false)
const message = ref('')
const error = ref(false)
const countryInvalid = ref(false)
const form = reactive({
  email: '',
  nickname: '',
  mobile: '',
  passportCountryCode: '',
  locale: 'en-US',
  timezone: 'UTC',
})

const fillForm = (member: NonNullable<typeof auth.member.value>) => {
  form.email = member.email
  form.nickname = member.nickname || ''
  form.mobile = member.mobile || ''
  form.passportCountryCode = member.passportCountryCode || ''
  form.locale = member.locale || 'en-US'
  form.timezone = member.timezone || 'UTC'
}

onMounted(async () => {
  if (!auth.token.value) {
    await navigateTo('/login?redirect=/profile')
    return
  }
  try {
    const member = auth.member.value || await auth.loadMember()
    if (!member) throw new Error('Unable to load your profile')
    fillForm(member)
    ready.value = true
  } catch {
    auth.clearSession()
    await navigateTo('/login?redirect=/profile')
  }
})

watch(() => form.passportCountryCode, (value) => { if (value) countryInvalid.value = false })

const save = async () => {
  if (!form.passportCountryCode) {
    countryInvalid.value = true
    error.value = true
    message.value = 'Choose the country that issued your passport.'
    return
  }
  saving.value = true
  error.value = false
  message.value = ''
  try {
    await auth.updateProfile({ ...form, mobile: form.mobile || undefined, nickname: form.nickname || undefined })
    message.value = 'Your profile has been updated.'
  } catch (caught) {
    error.value = true
    message.value = caught instanceof Error ? caught.message : 'Unable to update your profile.'
  } finally {
    saving.value = false
  }
}
</script>
