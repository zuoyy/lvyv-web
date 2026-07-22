<template>
  <!-- Register stage: Figma layout (left form + right hero) -->
  <main v-if="stage === 'register'" class="auth-page">
    <div class="auth-layout">
      <section class="auth-shell">
        <div class="auth-form-wrap">
          <h1 class="auth-title">Join Lvyv</h1>

          <p v-if="message" class="auth-message" :class="{ error }" role="alert">{{ message }}</p>

          <form class="auth-fields" @submit.prevent="submit" novalidate>
            <!-- Email -->
            <div class="auth-input-group">
              <p class="auth-input-label">Enter email <span class="auth-label-required">*</span></p>
              <div class="auth-input-wrap" :class="{ 'auth-input-wrap-error': emailError }">
                <input id="reg-email" v-model.trim="form.email" type="email" autocomplete="email" required placeholder="Enter you Email">
              </div>
              <p v-if="emailError" class="auth-input-error">{{ emailError }}</p>
            </div>

            <!-- Password -->
            <div class="auth-input-group">
              <p class="auth-input-label">Password <span class="auth-label-required">*</span> <span class="auth-label-hint">(min. 8 char)</span></p>
              <div class="auth-input-wrap auth-input-wrap-password" :class="{ 'auth-input-wrap-error': passwordError }">
                <input id="reg-password" v-model="form.password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" required minlength="6" maxlength="100" placeholder="Enter password">
                <button type="button" class="password-toggle" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Hide password' : 'Show password'">
                  <font-awesome-icon :icon="['fas', showPassword ? 'eye-slash' : 'eye']" />
                </button>
              </div>
              <p v-if="passwordError" class="auth-input-error">{{ passwordError }}</p>
            </div>

            <!-- Confirm Password -->
            <div class="auth-input-group">
              <p class="auth-input-label">Confirm password</p>
              <div class="auth-input-wrap auth-input-wrap-password" :class="{ 'auth-input-wrap-error': confirmError }">
                <input id="reg-confirm" v-model="confirm" :type="showConfirm ? 'text' : 'password'" autocomplete="new-password" required minlength="6" maxlength="100" placeholder="Enter password again">
                <button type="button" class="password-toggle" @click="showConfirm = !showConfirm" :aria-label="showConfirm ? 'Hide password' : 'Show password'">
                  <font-awesome-icon :icon="['fas', showConfirm ? 'eye-slash' : 'eye']" />
                </button>
              </div>
              <p v-if="confirmError" class="auth-input-error">{{ confirmError }}</p>
            </div>

            <!-- Country of Passport -->
            <div class="auth-input-group">
              <p class="auth-input-label">Country of Passport</p>
              <AuthCountrySelect v-model="form.passportCountryCode" :invalid="countryInvalid" />
              <p v-if="countryError" class="auth-input-error">{{ countryError }}</p>
            </div>

            <!-- Nickname -->
            <div class="auth-input-group">
              <p class="auth-input-label">Nickname</p>
              <div class="auth-input-wrap">
                <input id="reg-nickname" v-model.trim="form.nickname" autocomplete="name" maxlength="50" placeholder="Enter your username">
              </div>
            </div>

            <!-- Mobile (optional) -->
            <div class="auth-input-group">
              <p class="auth-input-label">Mobile <span class="auth-label-hint">(optional)</span></p>
              <div class="auth-input-wrap">
                <input id="reg-mobile" v-model.trim="form.mobile" type="tel" inputmode="tel" autocomplete="tel" pattern="\+?[1-9][0-9]{6,14}" placeholder="+1 202 555 0123">
              </div>
            </div>

            <!-- Join button -->
            <button class="auth-submit auth-submit-register" :disabled="loading">
              {{ loading ? 'Joining...' : 'Join' }}
            </button>
          </form>
        </div>

        <!-- Already have an account? -->
        <div class="auth-signup-offer">
          <p class="auth-signup-text">Already have an account?</p>
          <NuxtLink to="/login" class="auth-signup-link">Login</NuxtLink>
        </div>

        <button class="auth-recovery-btn" type="button" @click="showVerificationRecovery">
          Registered but not verified?
        </button>
      </section>

      <!-- Hero image -->
      <section class="auth-hero auth-hero-stretch">
        <img src="/images/auth/hero-register.png" alt="Beautiful landscape" class="auth-hero-image">
      </section>
    </div>
  </main>

  <!-- Other stages: centered layout -->
  <main v-else class="auth-page">
    <section class="auth-shell auth-shell-centered">
      <p class="auth-kicker">Join Lvyv</p>
      <h1>{{ pageTitle }}</h1>
      <p class="auth-intro">{{ pageIntro }}</p>

      <p v-if="message" class="auth-message" :class="{ error }" role="alert">{{ message }}</p>

      <form v-if="stage === 'request-code'" class="auth-form" @submit.prevent="requestCode">
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
        <NuxtLink class="auth-submit" :to="`/login?account=${encodeURIComponent(form.email)}`">Go to login</NuxtLink>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
const route = useRoute()
const verificationEmail = typeof route.query.verify === 'string' ? route.query.verify : ''
const form = reactive({ email: verificationEmail, password: '', nickname: '', mobile: '', passportCountryCode: '', timezone: detectMemberTimeZone() })
const confirm = ref('')
const loading = ref(false)
const stage = ref<'register' | 'request-code' | 'verify' | 'complete'>(verificationEmail ? 'request-code' : 'register')
const verificationCode = ref('')
const resendCooldown = ref(0)
const message = ref('')
const error = ref(false)
const countryInvalid = ref(false)
const showPassword = ref(false)
const showConfirm = ref(false)
const emailError = ref('')
const passwordError = ref('')
const confirmError = ref('')
const countryError = ref('')
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
  navigateTo('/auth/forgot-password')
}

const showRegistration = () => {
  error.value = false
  message.value = ''
  stage.value = 'register'
}

const submit = async () => {
  emailError.value = ''
  passwordError.value = ''
  confirmError.value = ''
  countryError.value = ''
  countryInvalid.value = false

  if (!form.email) {
    emailError.value = 'Please fill out this field.'
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    emailError.value = 'Please enter a valid email address.'
    return
  }

  if (!form.password) {
    passwordError.value = 'Please fill out this field.'
    return
  }

  if (!confirm.value) {
    confirmError.value = 'Please fill out this field.'
    return
  }
  if (form.password !== confirm.value) {
    confirmError.value = 'Passwords do not match.'
    return
  }
  if (!form.passportCountryCode) {
    countryInvalid.value = true
    countryError.value = 'Choose the country that issued your passport.'
    return
  }
  
  loading.value = true
  try {
    form.timezone = detectMemberTimeZone()
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
