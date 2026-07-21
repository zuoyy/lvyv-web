<template>
  <main class="auth-page">
    <section class="auth-shell auth-shell-register">
      <p class="auth-kicker">Join Lvyv</p>
      <h1>{{ pageTitle }}</h1>
      <p class="auth-intro">{{ pageIntro }}</p>

      <p v-if="message" class="auth-message" :class="{ error }" role="alert">{{ message }}</p>

      <form v-if="stage === 'register'" class="auth-form" @submit.prevent="submit">
        <div class="auth-field">
          <label for="email">Email</label>
          <input id="email" v-model.trim="form.email" type="email" autocomplete="email" required placeholder="you@example.com">
        </div>
        <div class="auth-field">
          <label for="nickname">Name <span>(optional)</span></label>
          <input id="nickname" v-model.trim="form.nickname" autocomplete="name" maxlength="50" placeholder="How should we address you?">
        </div>
        <div class="auth-field">
          <label for="passport-country">Country of Passport</label>
          <AuthCountrySelect v-model="form.passportCountryCode" :invalid="countryInvalid" />
          <small>Used to determine visa requirements. Stored as an ISO country code.</small>
        </div>
        <div class="auth-field">
          <label for="mobile">Mobile <span>(optional)</span></label>
          <input id="mobile" v-model.trim="form.mobile" type="tel" inputmode="tel" autocomplete="tel" pattern="\+?[1-9][0-9]{6,14}" placeholder="+1 202 555 0123">
        </div>
        <div class="auth-form-grid">
          <div class="auth-field">
            <label for="password">Password</label>
            <input id="password" v-model="form.password" type="password" autocomplete="new-password" required minlength="6" maxlength="100">
          </div>
          <div class="auth-field">
            <label for="confirm">Confirm password</label>
            <input id="confirm" v-model="confirm" type="password" autocomplete="new-password" required minlength="6" maxlength="100">
          </div>
        </div>
        <button class="auth-submit" :disabled="loading">{{ loading ? 'Creating account...' : 'Create account' }}</button>
      </form>

      <form v-else-if="stage === 'request-code'" class="auth-form" @submit.prevent="requestCode">
        <div class="auth-field">
          <label for="verification-email">Email</label>
          <input id="verification-email" v-model.trim="form.email" type="email" autocomplete="email" required placeholder="you@example.com">
          <small>We will send a new 6-digit code if this account is waiting for verification.</small>
        </div>
        <button class="auth-submit" :disabled="loading">
          {{ loading ? 'Sending code...' : 'Send verification code' }}
        </button>
        <button class="auth-text-button" type="button" :disabled="loading" @click="showRegistration">
          Back to registration
        </button>
      </form>

      <form v-else-if="stage === 'verify'" class="auth-form" @submit.prevent="verifyCode">
        <div class="auth-field">
          <label for="verification-code">Verification code</label>
          <input
            id="verification-code"
            v-model="verificationCode"
            class="verification-code-input"
            type="text"
            inputmode="numeric"
            autocomplete="one-time-code"
            maxlength="6"
            pattern="[0-9]{6}"
            required
            placeholder="000000"
            @input="verificationCode = verificationCode.replace(/\D/g, '').slice(0, 6)"
          >
          <small>We sent a 6-digit code to {{ form.email }}. It expires in 10 minutes.</small>
        </div>
        <button class="auth-submit" :disabled="loading || verificationCode.length !== 6">
          {{ loading ? 'Verifying...' : 'Verify email' }}
        </button>
        <button class="auth-text-button" type="button" :disabled="loading || resendCooldown > 0" @click="resendCode">
          {{ resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code' }}
        </button>
      </form>

      <div v-else class="auth-complete-actions">
        <NuxtLink class="auth-submit" :to="`/login?email=${encodeURIComponent(form.email)}`">Go to login</NuxtLink>
      </div>
      <template v-if="stage === 'register'">
        <p class="auth-switch">Already have an account? <NuxtLink to="/login">Log in</NuxtLink></p>
        <button class="auth-text-button auth-recovery-link" type="button" @click="showVerificationRecovery">
          Registered but not verified?
        </button>
      </template>
    </section>
  </main>
</template>

<script setup lang="ts">
const route = useRoute()
const verificationEmail = typeof route.query.verify === 'string' ? route.query.verify : ''
const form = reactive({ email: verificationEmail, password: '', nickname: '', mobile: '', passportCountryCode: '' })
const confirm = ref('')
const loading = ref(false)
const stage = ref<'register' | 'request-code' | 'verify' | 'complete'>(verificationEmail ? 'request-code' : 'register')
const verificationCode = ref('')
const resendCooldown = ref(0)
const message = ref('')
const error = ref(false)
const countryInvalid = ref(false)
const auth = useMemberAuth()
let cooldownTimer: ReturnType<typeof setInterval> | undefined

const pageTitle = computed(() => stage.value === 'register' ? 'Create your account' : 'Verify your email')
const pageIntro = computed(() => {
  if (stage.value === 'register') return 'Use an email you can access. You must verify it before signing in.'
  if (stage.value === 'request-code') return 'Enter your email to receive a new verification code.'
  if (stage.value === 'verify') return 'Enter the 6-digit code from your email to finish verification.'
  return 'Your email address has been confirmed.'
})

const startResendCooldown = () => {
  resendCooldown.value = 60
  if (cooldownTimer) clearInterval(cooldownTimer)
  cooldownTimer = setInterval(() => {
    resendCooldown.value -= 1
    if (resendCooldown.value <= 0 && cooldownTimer) {
      clearInterval(cooldownTimer)
      cooldownTimer = undefined
    }
  }, 1000)
}

onBeforeUnmount(() => { if (cooldownTimer) clearInterval(cooldownTimer) })

watch(() => form.passportCountryCode, (value) => { if (value) countryInvalid.value = false })

const showVerificationRecovery = () => {
  error.value = false
  message.value = ''
  stage.value = 'request-code'
}

const showRegistration = () => {
  error.value = false
  message.value = ''
  stage.value = 'register'
}

const submit = async () => {
  if (!form.passportCountryCode) {
    error.value = true
    countryInvalid.value = true
    message.value = 'Choose the country that issued your passport.'
    return
  }
  if (form.password !== confirm.value) {
    error.value = true
    message.value = 'Passwords do not match.'
    return
  }
  loading.value = true
  error.value = false
  message.value = ''
  try {
    await auth.register({
      ...form,
      mobile: form.mobile || undefined,
      nickname: form.nickname || undefined,
    })
    stage.value = 'verify'
    message.value = 'Account created. Enter the verification code from your email.'
    startResendCooldown()
  } catch (caught) {
    error.value = true
    message.value = caught instanceof Error ? caught.message : 'Unable to create account'
  } finally {
    loading.value = false
  }
}

const requestCode = async () => {
  loading.value = true
  error.value = false
  message.value = ''
  try {
    await auth.resendVerificationCode(form.email)
    verificationCode.value = ''
    stage.value = 'verify'
    message.value = 'A 6-digit verification code has been sent. It expires in 10 minutes.'
    startResendCooldown()
  } catch (caught) {
    error.value = true
    message.value = caught instanceof Error ? caught.message : 'Unable to send a verification code.'
  } finally {
    loading.value = false
  }
}

const verifyCode = async () => {
  if (!/^\d{6}$/.test(verificationCode.value)) return
  loading.value = true
  error.value = false
  message.value = ''
  try {
    await auth.verifyEmailCode(form.email, verificationCode.value)
    stage.value = 'complete'
    message.value = 'Your email is verified. You can now log in.'
  } catch (caught) {
    error.value = true
    message.value = caught instanceof Error ? caught.message : 'The verification code is invalid or expired.'
  } finally {
    loading.value = false
  }
}

const resendCode = async () => {
  loading.value = true
  error.value = false
  message.value = ''
  try {
    await auth.resendVerificationCode(form.email)
    verificationCode.value = ''
    message.value = 'A new 6-digit code has been sent. It expires in 10 minutes.'
    startResendCooldown()
  } catch (caught) {
    error.value = true
    message.value = caught instanceof Error ? caught.message : 'Unable to send a new code.'
  } finally {
    loading.value = false
  }
}
</script>
