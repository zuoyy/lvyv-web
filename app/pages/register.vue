<template>
  <main class="auth-page">
    <div class="auth-layout auth-layout-authentication">
      <section class="auth-shell auth-shell-register-inline">
        <div class="auth-form-wrap">
          <h1 class="auth-title">Get Started Now</h1>

          <p v-if="message" class="auth-message" :class="{ error }" role="alert">{{ message }}</p>

          <!-- Register form -->
          <form class="auth-fields" @submit.prevent="submit" novalidate>
            <div class="auth-input-group">
              <p class="auth-input-label">E-mail</p>
              <div class="auth-input-wrap auth-input-wrap-email" :class="{ 'auth-input-wrap-error': emailError, 'auth-input-sent': codeSent }">
                <input id="reg-email" v-model.trim="form.email" type="email" autocomplete="email" required placeholder="example@gmail.com" :disabled="codeSent" @input="resetCodeState">
              </div>
              <p v-if="emailError" class="auth-input-error">{{ emailError }}</p>
            </div>

            <div class="auth-input-group">
              <p class="auth-input-label">Code</p>
              <div class="auth-code-row">
                <div class="auth-input-wrap auth-code-input" :class="{ 'auth-input-wrap-error': codeError, 'auth-code-input-active': codeSent }">
                  <input
                    id="reg-verification-code"
                    v-model="verificationCode"
                    type="text"
                    inputmode="numeric"
                    autocomplete="one-time-code"
                    maxlength="6"
                    pattern="[0-9]{6}"
                    placeholder="Enter your Email-code"
                    @input="verificationCode = verificationCode.replace(/\D/g, '').slice(0, 6)"
                  >
                </div>
                <button
                  v-if="resendCooldown > 0"
                  class="code-send-button-green code-countdown"
                  type="button"
                >
                  {{ formatCountdown(resendCooldown) }}
                </button>
                <button
                  v-else
                  class="code-send-button-green"
                  type="button"
                  :disabled="loading"
                  @click="requestCode"
                >
                  Get code
                </button>
              </div>
              <p v-if="codeSent && !codeError" class="auth-field-hint">The code expires in 10 minutes.</p>
              <p v-if="codeError" class="auth-input-error">{{ codeError }}</p>
            </div>

            <div class="auth-input-group">
              <p class="auth-input-label">Password</p>
              <div class="auth-input-wrap auth-input-wrap-password" :class="{ 'auth-input-wrap-error': passwordError }">
                <input id="reg-password" v-model="form.password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" required minlength="8" maxlength="32" placeholder="Enter your Password" @input="handlePasswordInput" @blur="validatePassword">
                <button type="button" class="password-toggle" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Hide password' : 'Show password'">
                  <font-awesome-icon :icon="['fas', showPassword ? 'eye-slash' : 'eye']" />
                </button>
              </div>
              <p v-if="passwordError" class="auth-input-error">{{ passwordError }}</p>
            </div>

            <button class="auth-submit auth-submit-register" :disabled="loading || !codeSent || verificationCode.length !== 6">
              {{ loading ? 'Creating account...' : 'Sign in' }}
            </button>
          </form>

          <!-- Google sign up + OR divider -->
          <div class="auth-section auth-section-bottom">
            <div class="auth-divider-or" style="height:50px;margin-top:0">
              <span class="auth-divider-line"></span>
              <span class="auth-divider-text">OR</span>
              <span class="auth-divider-line"></span>
            </div>

            <button class="auth-google-btn" type="button" :disabled="loading" @click="handleGoogleLogin">
              <img src="/images/auth/google-icon.svg" alt="Google" class="google-icon">
              <span>{{ loading ? 'Redirecting...' : 'Continue with Google' }}</span>
            </button>
          </div>
        </div>

        <div class="auth-signup-offer">
          <p class="auth-signup-text">Already have an account?</p>
          <NuxtLink to="/login" class="auth-signup-link">Login</NuxtLink>
        </div>
      </section>

      <!-- Hero carousel -->
      <AuthHeroCarousel :images="heroImages" />
    </div>
  </main>
</template>

<script setup lang="ts">
interface CarouselImage {
  url: string
  alt?: string
}

const heroImages: CarouselImage[] = [
  {
    url: '/images/auth/hero-register.jpg',
    mobile: '/images/auth/hero-register-mobile.jpg',
    desktop: '/images/auth/hero-register.jpg',
    alt: 'Beautiful landscape'
  }
]

useHead({
  link: [
    { rel: 'preload', as: 'image', href: '/images/auth/hero-register-mobile.jpg', media: '(max-width: 900px)' },
    { rel: 'preload', as: 'image', href: '/images/auth/hero-register.jpg', media: '(min-width: 901px)' }
  ]
})

const route = useRoute()
const auth = useMemberAuth()
const form = reactive({
  email: typeof route.query.verify === 'string' ? route.query.verify : '',
  password: '',
  confirmPassword: '',
  timezone: detectMemberTimeZone(),
})
const verificationCode = ref('')
const codeSent = ref(false)
const resendCooldown = ref(0)
const loading = ref(false)
const message = ref('')
const error = ref(false)
const emailError = ref('')
const codeError = ref('')
const passwordError = ref('')
const confirmError = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
let cooldownTimer: ReturnType<typeof setInterval> | undefined

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

const resetCodeState = () => {
  if (codeSent.value) {
    codeSent.value = false
    verificationCode.value = ''
    message.value = ''
  }
}

const validateEmail = () => {
  emailError.value = ''
  if (!form.email) {
    emailError.value = 'Please fill out this field.'
    return false
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    emailError.value = 'Please enter a valid email address.'
    return false
  }
  return true
}

const validatePassword = () => {
  passwordError.value = ''
  if (!form.password) {
    passwordError.value = 'Please fill out this field.'
    return false
  }
  if (form.password.length < 8 || form.password.length > 32) {
    passwordError.value = 'Password must be 8-32 characters long.'
    return false
  }
  if (!/[a-z]/.test(form.password) || !/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password)) {
    passwordError.value = 'Use at least one uppercase letter, lowercase letter, and number.'
    return false
  }
  return true
}

const validateConfirmPassword = () => {
  confirmError.value = ''
  if (!form.confirmPassword) {
    confirmError.value = 'Please fill out this field.'
    return false
  }
  if (form.password !== form.confirmPassword) {
    confirmError.value = 'Passwords do not match.'
    return false
  }
  return true
}

const handlePasswordInput = () => {
  passwordError.value = ''
  if (form.confirmPassword) confirmError.value = ''
}

const validateDetails = () => {
  const passwordValid = validatePassword()
  //const confirmValid = validateConfirmPassword()
  return passwordValid
}

const requestCode = async () => {
  if (loading.value || resendCooldown.value > 0) return
  if (!validateEmail()) return
  loading.value = true
  error.value = false
  message.value = ''
  codeError.value = ''
  try {
    startResendCooldown()
    await auth.sendRegistrationCode(form.email)
    codeSent.value = true
    verificationCode.value = ''
    message.value = 'A verification code is on its way to your email.'
    
  } catch (caught) {
    error.value = true
    message.value = caught instanceof Error ? caught.message : 'Unable to send a verification code.'
  } finally {
    loading.value = false
  }
}

const submit = async () => {
  emailError.value = ''
  codeError.value = ''
  if (!validateEmail() || !validateDetails()) return
  if (!codeSent.value) {
    codeError.value = 'Get a verification code first.'
    return
  }
  if (!/^\d{6}$/.test(verificationCode.value)) {
    codeError.value = 'Enter the 6-digit verification code.'
    return
  }
  loading.value = true
  error.value = false
  message.value = ''
  try {
    form.timezone = detectMemberTimeZone()
    await auth.register({
      email: form.email,
      password: form.password,
      avatar: randomRegistrationAvatar(),
      timezone: form.timezone,
      verificationCode: verificationCode.value,
    })
    await navigateTo(`/login?account=${encodeURIComponent(form.email)}`)
  } catch (caught) {
    error.value = true
    message.value = caught instanceof Error ? caught.message : 'Unable to create account.'
  } finally {
    loading.value = false
  }
}

const handleGoogleLogin = () => {
  loading.value = true
  auth.googleLogin('/wish')
}

const formatCountdown = (seconds: number): string => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

onBeforeUnmount(() => { if (cooldownTimer) clearInterval(cooldownTimer) })
</script>
