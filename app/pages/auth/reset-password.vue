<template>
  <main class="modern-auth-page">
    <section class="modern-auth-panel modern-auth-panel-forgot">
      <div class="modern-auth-content">
        <!-- Complete State -->
        <template v-if="complete">
          <h1>Password Updated!</h1>
          <p class="modern-auth-forgot-desc">
            Your password has been updated. Existing sessions have been signed out.
          </p>

          <NuxtLink to="/login/" class="modern-auth-primary modern-auth-accent-primary" style="margin-top: 28px;">
            LOG IN with your new password
          </NuxtLink>
        </template>

        <!-- Form Input State (Figma Node 346:2329) -->
        <div v-else class="modern-auth-forgot-entry">
          <!-- Title (Node 346:2332) -->
          <h1>Reset your password</h1>

          <!-- Subtitle (Node 346:2367) -->
          <p class="modern-auth-forgot-footer-desc">
            Type in your new password. Reset links are valid for 30 minutes.
          </p>

          <p v-if="message" class="modern-auth-message" :class="{ error }" role="alert">{{ message }}</p>

          <form class="modern-auth-forgot-form" novalidate @submit.prevent="submit">
            <!-- New password Input (Node 346:2375) -->
            <div class="modern-auth-forgot-input-wrap">
              <span class="modern-auth-password" :class="{ invalid: passwordError }">
                <input
                  id="reset-password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  required
                  minlength="8"
                  maxlength="32"
                  placeholder="New password *"
                  @input="handlePasswordInput"
                  @blur="validatePassword"
                >
                <button type="button" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Hide password' : 'Show password'">
                  <font-awesome-icon :icon="['fas', showPassword ? 'eye-slash' : 'eye']" />
                </button>
              </span>
              <small v-if="passwordError">{{ passwordError }}</small>
            </div>

            <!-- Retry new password Input (Node 346:2368) -->
            <div class="modern-auth-forgot-input-wrap">
              <span class="modern-auth-password" :class="{ invalid: confirmError }">
                <input
                  id="reset-confirm"
                  v-model="confirm"
                  :type="showConfirm ? 'text' : 'password'"
                  autocomplete="new-password"
                  required
                  minlength="8"
                  maxlength="32"
                  placeholder="Retry new password *"
                  @input="confirmError = ''"
                  @blur="validateConfirmPassword"
                >
                <button type="button" @click="showConfirm = !showConfirm" :aria-label="showConfirm ? 'Hide password' : 'Show password'">
                  <font-awesome-icon :icon="['fas', showConfirm ? 'eye-slash' : 'eye']" />
                </button>
              </span>
              <small v-if="confirmError">{{ confirmError }}</small>
            </div>

            <!-- Submit Button (Node 346:2382) -->
            <button type="submit" class="modern-auth-next-btn" :disabled="loading || !isFormValid">
              <span>{{ loading ? 'Updating...' : 'Submit' }}</span>
            </button>
          </form>

          <!-- BACK to login Button (Node 346:2340) -->
          <NuxtLink to="/login/" class="modern-auth-forgot-back">
            BACK to login
          </NuxtLink>
        </div>
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
const password = ref('')
const confirm = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)
const loading = ref(false)
const complete = ref(false)
const error = ref(false)
const message = ref('')
const passwordError = ref('')
const confirmError = ref('')
const auth = useMemberAuth()

const isPasswordComplex = (val: string) => {
  return val.length >= 8 && val.length <= 32 && /[a-z]/.test(val) && /[A-Z]/.test(val) && /[0-9]/.test(val)
}

const isFormValid = computed(() => {
  return (
    isPasswordComplex(password.value) &&
    password.value === confirm.value
  )
})

const validatePassword = () => {
  passwordError.value = ''
  if (!password.value) {
    passwordError.value = 'Please fill out this field.'
    return false
  }
  if (password.value.length < 8 || password.value.length > 32) {
    passwordError.value = 'Password must be 8-32 characters long.'
    return false
  }
  if (!/[a-z]/.test(password.value) || !/[A-Z]/.test(password.value) || !/[0-9]/.test(password.value)) {
    passwordError.value = 'Use at least one uppercase letter, lowercase letter, and number.'
    return false
  }
  return true
}

const validateConfirmPassword = () => {
  confirmError.value = ''
  if (!confirm.value) {
    confirmError.value = 'Please fill out this field.'
    return false
  }
  if (password.value !== confirm.value) {
    confirmError.value = 'Passwords do not match.'
    return false
  }
  return true
}

const handlePasswordInput = () => {
  passwordError.value = ''
  if (confirm.value) confirmError.value = ''
}

const submit = async () => {
  const pValid = validatePassword()
  const cValid = validateConfirmPassword()
  if (!pValid || !cValid) return

  const token = typeof route.query.token === 'string' ? route.query.token : ''
  if (!token) {
    error.value = true
    message.value = 'The reset token is missing.'
    return
  }

  loading.value = true
  error.value = false
  message.value = ''

  try {
    await auth.resetPassword(token, password.value)
    complete.value = true
  } catch (caught) {
    error.value = true
    message.value = caught instanceof Error ? caught.message : 'This link is invalid or expired.'
  } finally {
    loading.value = false
  }
}
</script>
