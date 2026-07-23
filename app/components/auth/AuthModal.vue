<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="auth-modal-overlay" @click.self="handleClose">
        <div class="auth-modal-container">
          <button class="auth-modal-close" type="button" @click="handleClose" aria-label="Close">
            <font-awesome-icon :icon="['fas', 'xmark']" />
          </button>

          <div class="auth-modal-tabs">
            <button
              type="button"
              class="auth-modal-tab"
              :class="{ active: activeTab === 'login' }"
              @click="activeTab = 'login'; resetForm()"
            >
              Log in
            </button>
            <button
              type="button"
              class="auth-modal-tab"
              :class="{ active: activeTab === 'register' }"
              @click="activeTab = 'register'; resetForm()"
            >
              Sign up
            </button>
          </div>

          <div class="auth-modal-content">
            <div v-if="activeTab === 'login'" class="auth-modal-form">
              <h2 class="auth-modal-title">Welcome back!</h2>

              <p v-if="loginMessage" class="auth-message" :class="{ error: loginError }" role="alert">
                {{ loginMessage }}
              </p>

              <button class="auth-google-btn" type="button" :disabled="loginLoading" @click="handleGoogleLogin">
                <img src="/images/auth/google-icon.svg" alt="Google" class="google-icon">
                <span>{{ loginLoading ? 'Redirecting...' : 'Log in with Google' }}</span>
              </button>

              <div class="auth-divider-or">
                <span class="auth-divider-line"></span>
                <span class="auth-divider-text">OR</span>
                <span class="auth-divider-line"></span>
              </div>

              <form class="auth-form" @submit.prevent="handleLoginSubmit" novalidate>
                <div class="auth-input-group">
                  <p class="auth-input-label">E-mail</p>
                  <div class="auth-input-wrap auth-input-wrap-email">
                    <input
                      v-model.trim="loginEmail"
                      type="email"
                      autocomplete="email"
                      required
                      placeholder="example@gmail.com"
                    >
                  </div>
                </div>

                <div class="auth-input-group">
                  <p class="auth-input-label">Password</p>
                  <div class="auth-input-wrap auth-input-wrap-password">
                    <input
                      v-model="loginPassword"
                      :type="showLoginPassword ? 'text' : 'password'"
                      autocomplete="current-password"
                      required
                      placeholder="Enter your Password"
                    >
                    <button
                      type="button"
                      class="password-toggle"
                      @click="showLoginPassword = !showLoginPassword"
                      aria-label="Toggle password visibility"
                    >
                      <font-awesome-icon :icon="['fas', showLoginPassword ? 'eye-slash' : 'eye']" />
                    </button>
                  </div>
                </div>

                <div class="auth-row">
                  <label class="auth-remember">
                    <input type="checkbox" v-model="rememberMe" class="auth-checkbox">
                    <span class="auth-remember-text">Remember me</span>
                  </label>
                  <NuxtLink to="/auth/forgot-password" class="auth-forgot-link" @click="handleClose">
                    Forgot Password?
                  </NuxtLink>
                </div>

                <button class="auth-submit" type="submit" :disabled="loginLoading">
                  {{ loginLoading ? 'Logging in...' : 'Log in' }}
                </button>
              </form>

              <div class="auth-signup-offer">
                <p class="auth-signup-text">Don't have an account?</p>
                <button type="button" class="auth-signup-link" @click="activeTab = 'register'; resetForm()">
                  Sign up
                </button>
              </div>
            </div>

            <div v-else class="auth-modal-form">
              <h2 class="auth-modal-title">Get Started Now</h2>

              <p v-if="registerMessage" class="auth-message" :class="{ error: registerError }" role="alert">
                {{ registerMessage }}
              </p>

              <form class="auth-fields" @submit.prevent="handleRegisterSubmit" novalidate>
                <div class="auth-input-group">
                  <p class="auth-input-label">E-mail</p>
                  <div class="auth-input-wrap auth-input-wrap-email" :class="{ 'auth-input-wrap-error': emailError, 'auth-input-sent': codeSent }">
                    <input
                      v-model.trim="registerEmail"
                      type="email"
                      autocomplete="email"
                      required
                      placeholder="example@gmail.com"
                      :disabled="codeSent"
                      @input="resetCodeState"
                    >
                  </div>
                  <p v-if="emailError" class="auth-input-error">{{ emailError }}</p>
                </div>

                <div class="auth-input-group">
                  <p class="auth-input-label">Code</p>
                  <div class="auth-code-row">
                    <div class="auth-input-wrap auth-code-input" :class="{ 'auth-input-wrap-error': codeError, 'auth-code-input-active': codeSent }">
                      <input
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
                      :disabled="registerLoading"
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
                    <input
                      v-model="registerPassword"
                      :type="showRegisterPassword ? 'text' : 'password'"
                      autocomplete="new-password"
                      required
                      minlength="8"
                      maxlength="32"
                      placeholder="Enter your Password"
                      @input="handlePasswordInput"
                      @blur="validatePassword"
                    >
                    <button
                      type="button"
                      class="password-toggle"
                      @click="showRegisterPassword = !showRegisterPassword"
                      :aria-label="showRegisterPassword ? 'Hide password' : 'Show password'"
                    >
                      <font-awesome-icon :icon="['fas', showRegisterPassword ? 'eye-slash' : 'eye']" />
                    </button>
                  </div>
                  <p v-if="passwordError" class="auth-input-error">{{ passwordError }}</p>
                </div>

                <button class="auth-submit auth-submit-register" type="submit" :disabled="registerLoading || !codeSent || verificationCode.length !== 6">
                  {{ registerLoading ? 'Creating account...' : 'Sign in' }}
                </button>
              </form>

              <div class="auth-section auth-section-bottom">
                <div class="auth-divider-or" style="height:50px;margin-top:0">
                  <span class="auth-divider-line"></span>
                  <span class="auth-divider-text">OR</span>
                  <span class="auth-divider-line"></span>
                </div>

                <button class="auth-google-btn" type="button" :disabled="registerLoading" @click="handleGoogleRegister">
                  <img src="/images/auth/google-icon.svg" alt="Google" class="google-icon">
                  <span>{{ registerLoading ? 'Redirecting...' : 'Continue with Google' }}</span>
                </button>
              </div>

              <div class="auth-signup-offer">
                <p class="auth-signup-text">Already have an account?</p>
                <button type="button" class="auth-signup-link" @click="activeTab = 'login'; resetForm()">
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  initialTab?: 'login' | 'register'
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const activeTab = ref<'login' | 'register'>(props.initialTab || 'login')

watch(() => props.initialTab, (val) => {
  if (val) activeTab.value = val
})

watch(() => props.modelValue, (val) => {
  if (val && props.initialTab) {
    activeTab.value = props.initialTab
  }
  if (val) {
    resetForm()
  }
})

const auth = useMemberAuth()

const loginEmail = ref('')
const loginPassword = ref('')
const showLoginPassword = ref(false)
const loginLoading = ref(false)
const loginMessage = ref('')
const loginError = ref(false)
const rememberMe = ref(false)

const registerEmail = ref('')
const registerPassword = ref('')
const showRegisterPassword = ref(false)
const verificationCode = ref('')
const codeSent = ref(false)
const resendCooldown = ref(0)
const registerLoading = ref(false)
const registerMessage = ref('')
const registerError = ref(false)
const emailError = ref('')
const codeError = ref('')
const passwordError = ref('')

let cooldownTimer: ReturnType<typeof setInterval> | undefined

const STORAGE_KEY = 'lvyv_remember_me'

const loadRememberedInfo = () => {
  if (import.meta.client) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        if (data.remember && data.email) {
          loginEmail.value = data.email
          rememberMe.value = true
        }
      }
    } catch {
      console.warn('Failed to load remembered info')
    }
  }
}

const saveRememberedInfo = () => {
  if (import.meta.client) {
    try {
      if (rememberMe.value && loginEmail.value) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          remember: true,
          email: loginEmail.value
        }))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      console.warn('Failed to save remembered info')
    }
  }
}

const resetForm = () => {
  loginMessage.value = ''
  loginError.value = false
  registerMessage.value = ''
  registerError.value = false
  emailError.value = ''
  codeError.value = ''
  passwordError.value = ''
  codeSent.value = false
  verificationCode.value = ''
  if (cooldownTimer) {
    clearInterval(cooldownTimer)
    cooldownTimer = undefined
  }
  resendCooldown.value = 0
}

const handleClose = () => {
  visible.value = false
}

const handleGoogleLogin = () => {
  loginLoading.value = true
  auth.googleLogin('/wish')
}

const handleGoogleRegister = () => {
  registerLoading.value = true
  auth.googleLogin('/wish')
}

const handleLoginSubmit = async () => {
  loginLoading.value = true
  loginMessage.value = ''
  loginError.value = false

  if (!loginEmail.value) {
    loginError.value = true
    loginMessage.value = 'Please fill out this field.'
    loginLoading.value = false
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(loginEmail.value)) {
    loginError.value = true
    loginMessage.value = 'Please enter a valid email address.'
    loginLoading.value = false
    return
  }

  if (!loginPassword.value) {
    loginError.value = true
    loginMessage.value = 'Please fill out this field.'
    loginLoading.value = false
    return
  }

  try {
    await auth.login(loginEmail.value, loginPassword.value)
    saveRememberedInfo()
    visible.value = false
    emit('success')
  } catch (caught) {
    if (caught instanceof ApiRequestError && caught.code === 1_003_000_006) {
      activeTab.value = 'register'
      registerEmail.value = loginEmail.value
      loginMessage.value = ''
      return
    }
    loginError.value = true
    loginMessage.value = caught instanceof Error ? caught.message : 'Unable to log in'
  } finally {
    loginLoading.value = false
  }
}

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
    registerMessage.value = ''
  }
}

const validateEmail = () => {
  emailError.value = ''
  if (!registerEmail.value) {
    emailError.value = 'Please fill out this field.'
    return false
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerEmail.value)) {
    emailError.value = 'Please enter a valid email address.'
    return false
  }
  return true
}

const validatePassword = () => {
  passwordError.value = ''
  if (!registerPassword.value) {
    passwordError.value = 'Please fill out this field.'
    return false
  }
  if (registerPassword.value.length < 8 || registerPassword.value.length > 32) {
    passwordError.value = 'Password must be 8-32 characters long.'
    return false
  }
  if (!/[a-z]/.test(registerPassword.value) || !/[A-Z]/.test(registerPassword.value) || !/[0-9]/.test(registerPassword.value)) {
    passwordError.value = 'Use at least one uppercase letter, lowercase letter, and number.'
    return false
  }
  return true
}

const handlePasswordInput = () => {
  passwordError.value = ''
}

const requestCode = async () => {
  if (registerLoading.value || resendCooldown.value > 0) return
  if (!validateEmail()) return
  registerLoading.value = true
  registerError.value = false
  registerMessage.value = ''
  codeError.value = ''
  try {
    startResendCooldown()
    await auth.sendRegistrationCode(registerEmail.value)
    codeSent.value = true
    verificationCode.value = ''
    registerMessage.value = 'A verification code is on its way to your email.'
  } catch (caught) {
    registerError.value = true
    registerMessage.value = caught instanceof Error ? caught.message : 'Unable to send a verification code.'
  } finally {
    registerLoading.value = false
  }
}

const handleRegisterSubmit = async () => {
  emailError.value = ''
  codeError.value = ''
  if (!validateEmail() || !validatePassword()) return
  if (!codeSent.value) {
    codeError.value = 'Get a verification code first.'
    return
  }
  if (!/^\d{6}$/.test(verificationCode.value)) {
    codeError.value = 'Enter the 6-digit verification code.'
    return
  }
  registerLoading.value = true
  registerError.value = false
  registerMessage.value = ''
  try {
    const timezone = detectMemberTimeZone()
    await auth.register({
      email: registerEmail.value,
      password: registerPassword.value,
      avatar: randomRegistrationAvatar(),
      timezone,
      verificationCode: verificationCode.value,
    })
    await auth.login(registerEmail.value, registerPassword.value)
    visible.value = false
    emit('success')
  } catch (caught) {
    registerError.value = true
    registerMessage.value = caught instanceof Error ? caught.message : 'Unable to create account.'
  } finally {
    registerLoading.value = false
  }
}

const formatCountdown = (seconds: number): string => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

onMounted(() => {
  loadRememberedInfo()
})

onBeforeUnmount(() => {
  if (cooldownTimer) clearInterval(cooldownTimer)
})
</script>

<style scoped>
.auth-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.auth-modal-container {
  position: relative;
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.auth-modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #67728a;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s, color 0.2s;
  z-index: 10;
}

.auth-modal-close:hover {
  background: #f0f2f5;
  color: #203d33;
}

.auth-modal-tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 40px;
}

.auth-modal-tab {
  flex: 1;
  padding: 20px 0 16px;
  border: none;
  background: transparent;
  font-family: 'Poppins', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #67728a;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}

.auth-modal-tab:hover {
  color: #203d33;
}

.auth-modal-tab.active {
  color: #105446;
}

.auth-modal-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 2px;
  background: #105446;
  border-radius: 1px;
}

.auth-modal-content {
  padding: 32px 40px 40px;
}

.auth-modal-title {
  margin: 0 0 24px;
  font-family: 'Poppins', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 24px;
  font-weight: 500;
  color: #000000;
  line-height: 32px;
}

.auth-modal-form .auth-signup-offer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f2f5;
}

.auth-modal-form .auth-signup-link {
  border: none;
  background: none;
  padding: 0;
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #105446;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.2s;
}

.auth-modal-form .auth-signup-link:hover {
  color: #0d4238;
  text-decoration: underline;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .auth-modal-container,
.modal-fade-leave-active .auth-modal-container {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.modal-fade-enter-from .auth-modal-container,
.modal-fade-leave-to .auth-modal-container {
  opacity: 0;
  transform: scale(0.95);
}

@media (max-width: 600px) {
  .auth-modal-container {
    max-width: 100%;
    max-height: 95vh;
  }

  .auth-modal-tabs {
    padding: 0 24px;
  }

  .auth-modal-content {
    padding: 24px;
  }
}
</style>
