<template>
  <main class="modern-auth-page">
    <AuthMobileHeader />
    <section class="modern-auth-panel modern-auth-panel-register">
      <div class="modern-auth-content">
        <h1>Get Started Now</h1>

        <p v-if="message" class="modern-auth-message" :class="{ error }" role="alert">{{ message }}</p>

        <form class="modern-auth-form" novalidate @submit.prevent="submit">
          <label class="modern-auth-field" for="reg-email">
            <span>E-mail</span>
            <input id="reg-email" v-model.trim="form.email" type="email" autocomplete="email" required placeholder="example@gmail.com" :class="{ invalid: emailError }" @input="resetCodeState">
            <small v-if="emailError">{{ emailError }}</small>
          </label>

          <label class="modern-auth-field" for="reg-verification-code">
            <span>Code</span>
            <span class="modern-auth-code">
              <input
                id="reg-verification-code"
                v-model="verificationCode"
                type="text"
                inputmode="numeric"
                autocomplete="one-time-code"
                maxlength="6"
                pattern="[0-9]{6}"
                placeholder="Enter your Email-code"
                :disabled="!codeSent"
                :class="{ invalid: codeError }"
                @input="verificationCode = verificationCode.replace(/\D/g, '').slice(0, 6)"
              >
              <button type="button" :disabled="loading || resendCooldown > 0 || !isEmailValid" @click="requestCode">
                {{ resendCooldown > 0 ? `00:${String(resendCooldown).padStart(2, '0')}` : codeSent ? 'Resend' : 'Get code' }}
              </button>
            </span>
            <small v-if="codeError">{{ codeError }}</small>
          </label>

          <label class="modern-auth-field" for="reg-password">
            <span>Password</span>
            <span class="modern-auth-password" :class="{ invalid: passwordError }">
              <input id="reg-password" v-model="form.password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" required minlength="8" maxlength="32" placeholder="Enter your Password" @input="handlePasswordInput" @blur="validatePassword">
              <button type="button" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Hide password' : 'Show password'">
                <font-awesome-icon :icon="['fas', showPassword ? 'eye-slash' : 'eye']" />
              </button>
            </span>
            <small v-if="passwordError">{{ passwordError }}</small>
          </label>

          <label class="modern-auth-field" for="reg-confirm-password">
            <span>Confirm password</span>
            <span class="modern-auth-password" :class="{ invalid: confirmError }">
              <input id="reg-confirm-password" v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" autocomplete="new-password" required minlength="8" maxlength="32" placeholder="Enter your Password again" @input="confirmError = ''" @blur="validateConfirmPassword">
              <button type="button" @click="showConfirmPassword = !showConfirmPassword" :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'">
                <font-awesome-icon :icon="['fas', showConfirmPassword ? 'eye-slash' : 'eye']" />
              </button>
            </span>
            <small v-if="confirmError">{{ confirmError }}</small>
          </label>

          <label class="modern-auth-field" for="reg-invitation">
            <span>Invitation code <span>(optional)</span></span>
            <span class="modern-auth-password" :class="{ invalid: inviteError }">
              <input id="reg-invitation" v-model.trim="inviteCode" maxlength="32" autocomplete="off" placeholder="Enter an invitation code" :disabled="inviteLoading || loading" @input="inviteError = ''; inviteEdited = true">
              <button v-if="inviteCode || inviteError" type="button" aria-label="Clear invitation code" title="Clear invitation code" :disabled="inviteLoading || loading" @click="removeInvitation">
                <span aria-hidden="true">×</span>
              </button>
            </span>
            <small v-if="inviteError" role="alert">{{ inviteError }}</small>
            <small v-else-if="inviteCode" class="invitation-hint">Your invitation will be linked when you create your account.</small>
          </label>

          <button class="modern-auth-primary" :disabled="loading || inviteLoading || !isRegisterFormValid">
            {{ loading ? 'Signing up...' : 'Sign up' }}
          </button>
        </form>

        <p class="modern-auth-footer-link">
          Already have an account? <NuxtLink to="/login/">Log in</NuxtLink>
        </p>

        <div class="modern-auth-divider"><span>OR</span></div>

        <button class="modern-auth-google" type="button" :disabled="loading || inviteLoading" @click="handleGoogleLogin">
          <img src="/images/auth/google-icon.svg" alt="">
          <span>{{ loading ? 'Redirecting...' : 'Continue with Google' }}</span>
        </button>
      </div>
    </section>

    <AuthVisualPanel />
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})
useNoIndex()

const route = useRoute()
const auth = useMemberAuth()
const referralApi = useReferrals()
const inviteCode = ref('')
const inviteError = ref('')
const inviteLoading = ref(true)
const inviteEdited = ref(false)
const removeInvitation = async () => {
  inviteLoading.value = true
  try {
    await referralApi.clear()
    inviteCode.value = ''; inviteError.value = ''; inviteEdited.value = true
    const { invite, error: referralError, ...query } = route.query
    await navigateTo({ path: route.path, query }, { replace: true })
  } catch { inviteError.value = 'Could not remove the invitation. Please try again.' }
  finally { inviteLoading.value = false }
}
const validateInvitation = async () => {
  if (!inviteCode.value) return !inviteError.value
  try { inviteCode.value = (await referralApi.validate(inviteCode.value)).inviteCode; inviteError.value = ''; return true }
  catch (e) { inviteError.value = e instanceof Error ? e.message : 'Please check your invitation code or remove it to continue.'; return false }
}
onMounted(async () => {
  try {
    const value = typeof route.query.invite === 'string' ? route.query.invite : ''
    const context = value ? await referralApi.capture(value) : await referralApi.context()
    if (!inviteEdited.value) inviteCode.value = context.inviteCode || ''
  } catch (e) {
    inviteCode.value = typeof route.query.invite === 'string' ? route.query.invite : ''
    inviteError.value = e instanceof Error ? e.message : 'Could not load the invitation. You may remove it to continue.'
  } finally { inviteLoading.value = false }
  if (route.query.error === 'invite_invalid') inviteError.value = 'This invitation is no longer available. Change or remove the code, then try Google again.'
})
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

const isEmailValid = computed(() => {
  return form.email.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
})

const isRegisterFormValid = computed(() => {
  return (
    form.email.trim().length > 0 &&
    codeSent.value &&
    verificationCode.value.length === 6 &&
    form.password.length >= 8 &&
    form.confirmPassword.length >= 8 &&
    form.password === form.confirmPassword
  )
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
  const confirmValid = validateConfirmPassword()
  return passwordValid && confirmValid
}

const requestCode = async () => {
  if (!validateEmail()) return
  loading.value = true
  error.value = false
  message.value = ''
  codeError.value = ''
  try {
    await auth.sendRegistrationCode(form.email)
    codeSent.value = true
    verificationCode.value = ''
    message.value = 'A verification code is on its way to your email.'
    startResendCooldown()
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
    if (!(await validateInvitation())) return
    form.timezone = detectMemberTimeZone()
    await auth.register({
      email: form.email,
      password: form.password,
      avatarObjectKey: randomRegistrationAvatar(),
      timezone: form.timezone,
      verificationCode: verificationCode.value,
      inviteCode: inviteCode.value || undefined,
    })
    await navigateTo(`/login/?account=${encodeURIComponent(form.email)}`)
  } catch (caught) {
    error.value = true
    message.value = caught instanceof Error ? caught.message : 'Unable to create account.'
  } finally {
    loading.value = false
  }
}

const handleGoogleLogin = async () => {
  loading.value = true
  if (!(await validateInvitation())) { loading.value = false; return }
  auth.googleLogin('/wish', inviteCode.value)
}

onBeforeUnmount(() => { if (cooldownTimer) clearInterval(cooldownTimer) })
</script>

<style scoped>
.modern-auth-field .invitation-hint {
  color: #67728a;
}
</style>
