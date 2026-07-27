<template>
  <section class="account-security">
    <header class="section-header">
      <p class="section-kicker">Account</p>
      <h2>Account security</h2>
      <p class="section-desc">Protect your account and decide who we can contact when you are travelling.</p>
    </header>

    <div class="security-content">
      <section class="security-section">
        <div class="section-title-row">
          <div>
            <h3>Change password</h3>
            <p>Use a unique password you do not use on another site.</p>
          </div>
          <font-awesome-icon :icon="['fas', 'key']" class="section-icon" />
        </div>
        <form class="security-form" @submit.prevent="changePassword">
          <label class="field">
            <span>Current password</span>
            <div class="password-field">
              <input v-model="passwordForm.currentPassword" :type="showCurrentPassword ? 'text' : 'password'" class="text-input" autocomplete="current-password" placeholder="Enter current password">
              <button type="button" class="field-action" :aria-label="showCurrentPassword ? 'Hide current password' : 'Show current password'" @click="showCurrentPassword = !showCurrentPassword"><font-awesome-icon :icon="['fas', showCurrentPassword ? 'eye-slash' : 'eye']" /></button>
            </div>
          </label>
          <label class="field">
            <span>New password</span>
            <div class="password-field">
              <input v-model="passwordForm.newPassword" :type="showNewPassword ? 'text' : 'password'" class="text-input" autocomplete="new-password" placeholder="Create a new password">
              <button type="button" class="field-action" :aria-label="showNewPassword ? 'Hide new password' : 'Show new password'" @click="showNewPassword = !showNewPassword"><font-awesome-icon :icon="['fas', showNewPassword ? 'eye-slash' : 'eye']" /></button>
            </div>
            <small>8–32 characters with upper, lower and number.</small>
          </label>
          <label class="field">
            <span>Confirm new password</span>
            <div class="password-field">
              <input v-model="passwordForm.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" class="text-input" autocomplete="new-password" placeholder="Repeat the new password">
              <button type="button" class="field-action" :aria-label="showConfirmPassword ? 'Hide confirmation' : 'Show confirmation'" @click="showConfirmPassword = !showConfirmPassword"><font-awesome-icon :icon="['fas', showConfirmPassword ? 'eye-slash' : 'eye']" /></button>
            </div>
          </label>
          <p v-if="passwordError" class="inline-error" role="alert">{{ passwordError }}</p>
          <button class="button button-primary" type="submit" :disabled="saving">{{ saving ? 'Changing password' : 'Change password' }}</button>
        </form>
      </section>

      <section class="security-section">
        <div class="section-title-row">
          <div>
            <h3>Emergency contact</h3>
            <p>Someone we can reach if your plans change unexpectedly.</p>
          </div>
          <font-awesome-icon :icon="['fas', 'phone']" class="section-icon" />
        </div>
        <div v-if="emergencyContact" class="contact-summary">
          <div><span>Name</span><strong>{{ emergencyContact.name }}</strong></div>
          <div><span>Phone</span><strong>{{ emergencyContact.phone }}</strong></div>
          <div><span>Relationship</span><strong>{{ relationshipLabel(emergencyContact.relationship) }}</strong></div>
        </div>
        <div v-else class="empty-contact"><strong>No emergency contact yet</strong><span>Add someone you trust before your next trip.</span></div>
        <button class="button button-secondary" type="button" @click="openContactDialog">{{ emergencyContact ? 'Edit contact' : 'Add contact' }}</button>
      </section>

      <section class="security-section danger-zone">
        <div class="section-title-row">
          <div>
            <h3>Close account</h3>
            <p>Account deletion permanently removes your profile and travel data.</p>
          </div>
          <font-awesome-icon :icon="['fas', 'trash-can']" class="section-icon" />
        </div>
        <button class="button button-danger" type="button" @click="showDeleteConfirm = true">Delete account</button>
      </section>
    </div>

    <div v-if="notice" class="security-notice" :class="{ error: noticeError }" role="status">
      <font-awesome-icon :icon="['fas', noticeError ? 'circle-exclamation' : 'check']" />{{ notice }}
    </div>

    <Teleport to="body">
      <div v-if="showContactDialog" class="modal-backdrop" @click.self="closeContactDialog">
        <section class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="contact-title">
          <div class="modal-heading"><div><p class="section-kicker">Safety</p><h3 id="contact-title">Emergency contact</h3></div><button class="modal-close" type="button" aria-label="Close" @click="closeContactDialog">×</button></div>
          <form class="contact-form" @submit.prevent="saveContact">
            <label class="field"><span>Name</span><input v-model="contactForm.name" class="text-input" type="text" placeholder="Contact name"></label>
            <label class="field"><span>Phone number</span><input v-model="contactForm.phone" class="text-input" type="tel" placeholder="+1 202 555 0123"></label>
            <label class="field"><span>Relationship</span><select v-model="contactForm.relationship" class="text-input"><option value="">Select relationship</option><option value="parent">Parent</option><option value="sibling">Sibling</option><option value="spouse">Spouse</option><option value="friend">Friend</option><option value="other">Other</option></select></label>
            <p v-if="contactError" class="inline-error" role="alert">{{ contactError }}</p>
            <div class="modal-actions"><button class="button button-secondary" type="button" @click="closeContactDialog">Cancel</button><button class="button button-primary" type="submit" :disabled="contactSaving">{{ contactSaving ? 'Saving' : 'Save contact' }}</button></div>
          </form>
        </section>
      </div>

      <div v-if="showDeleteConfirm" class="modal-backdrop" @click.self="closeDeleteDialog">
        <section class="modal-panel delete-panel" role="dialog" aria-modal="true" aria-labelledby="delete-title">
          <div class="delete-icon"><font-awesome-icon :icon="['fas', 'triangle-exclamation']" /></div>
          <h3 id="delete-title">Delete your account?</h3>
          <p>This cannot be undone. Your profile, wishes and travel history will be permanently deleted.</p>
          <label class="field"><span>Type DELETE to confirm</span><input v-model="deleteConfirmText" class="text-input" type="text" autocomplete="off"></label>
          <div class="modal-actions"><button class="button button-secondary" type="button" @click="closeDeleteDialog">Keep account</button><button class="button button-danger" type="button" :disabled="deleteConfirmText !== 'DELETE'" @click="deleteAccount">Delete account</button></div>
        </section>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const passwordForm = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' })
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const saving = ref(false)
const passwordError = ref('')
const notice = ref('')
const noticeError = ref(false)
const emergencyContact = ref<{ name: string; phone: string; relationship: string } | null>(null)
const showContactDialog = ref(false)
const contactSaving = ref(false)
const contactError = ref('')
const contactForm = reactive({ name: '', phone: '', relationship: '' })
const showDeleteConfirm = ref(false)
const deleteConfirmText = ref('')

const relationshipLabel = (value: string) => ({ parent: 'Parent', sibling: 'Sibling', spouse: 'Spouse', friend: 'Friend', other: 'Other' }[value] || value)

const changePassword = () => {
  passwordError.value = ''
  if (!passwordForm.currentPassword) return void (passwordError.value = 'Enter your current password.')
  if (!passwordForm.newPassword) return void (passwordError.value = 'Enter a new password.')
  if (passwordForm.newPassword.length < 8 || passwordForm.newPassword.length > 32) return void (passwordError.value = 'Password must be 8–32 characters.')
  if (!/[a-z]/.test(passwordForm.newPassword) || !/[A-Z]/.test(passwordForm.newPassword) || !/[0-9]/.test(passwordForm.newPassword)) return void (passwordError.value = 'Use an upper-case letter, a lower-case letter and a number.')
  if (passwordForm.newPassword !== passwordForm.confirmPassword) return void (passwordError.value = 'The passwords do not match.')
  saving.value = true
  window.setTimeout(() => {
    saving.value = false
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    showNotice('Password changed successfully.')
  }, 450)
}

const showNotice = (message: string, error = false) => {
  notice.value = message
  noticeError.value = error
  window.setTimeout(() => { notice.value = '' }, 4200)
}

const openContactDialog = () => {
  contactError.value = ''
  contactForm.name = emergencyContact.value?.name || ''
  contactForm.phone = emergencyContact.value?.phone || ''
  contactForm.relationship = emergencyContact.value?.relationship || ''
  showContactDialog.value = true
}
const closeContactDialog = () => { showContactDialog.value = false }
const saveContact = () => {
  contactError.value = ''
  if (!contactForm.name.trim()) return void (contactError.value = 'Enter a contact name.')
  if (!contactForm.phone.trim()) return void (contactError.value = 'Enter a phone number.')
  if (!contactForm.relationship) return void (contactError.value = 'Select a relationship.')
  contactSaving.value = true
  window.setTimeout(() => {
    emergencyContact.value = { name: contactForm.name.trim(), phone: contactForm.phone.trim(), relationship: contactForm.relationship }
    contactSaving.value = false
    showContactDialog.value = false
    showNotice('Emergency contact saved.')
  }, 350)
}
const closeDeleteDialog = () => { showDeleteConfirm.value = false; deleteConfirmText.value = '' }
const deleteAccount = () => { closeDeleteDialog(); showNotice('Account deletion is not available in demo mode.', true) }
</script>

<style scoped>
.account-security { max-width: 820px; }
.section-header { padding-bottom: 28px; border-bottom: 1px solid #e1e7e2; }
.section-kicker { margin: 0 0 8px; color: #6a7971; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
.section-header h2 { margin: 0; color: #173f34; font: 600 30px/1.15 'Playfair Display', Georgia, serif; }
.section-desc, .section-title-row p { margin: 9px 0 0; color: #718079; font-size: 14px; line-height: 1.5; }
.security-content { display: flex; flex-direction: column; gap: 0; padding-top: 4px; }
.security-section { padding: 29px 0; border-bottom: 1px solid #e1e7e2; }
.security-section:last-child { border-bottom: 0; }
.section-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 23px; }
.section-title-row h3 { margin: 0; color: #26372f; font-size: 16px; }
.section-icon { margin-top: 2px; color: #88a194; font-size: 20px; }
.security-form, .contact-form { display: grid; gap: 17px; max-width: 510px; }
.field { display: flex; flex-direction: column; gap: 8px; }
.field > span { color: #35463d; font-size: 12px; font-weight: 700; }
.field small { color: #87938c; font-size: 11px; }
.text-input { width: 100%; min-height: 44px; box-sizing: border-box; padding: 11px 12px; border: 1px solid #ccd6d0; border-radius: 2px; outline: none; background: #fff; color: #22352c; font: 400 14px/1.4 'Inter', sans-serif; }
.text-input:focus { border-color: #174d40; box-shadow: 0 0 0 3px rgba(23, 77, 64, .12); }
.password-field { position: relative; }
.password-field .text-input { padding-right: 44px; }
.field-action { position: absolute; top: 0; right: 0; width: 42px; height: 100%; border: 0; background: transparent; color: #78867f; cursor: pointer; }
.field-action:hover { color: #174d40; }
.inline-error { margin: -3px 0 0; color: #a33e35; font-size: 12px; }
.button { min-height: 42px; display: inline-flex; align-items: center; justify-content: center; padding: 0 16px; border: 1px solid transparent; border-radius: 2px; font: 700 12px/1 'Inter', sans-serif; cursor: pointer; }
.button:disabled { opacity: .55; cursor: not-allowed; }
.button-primary { background: #174d40; color: #fff; }
.button-primary:hover:not(:disabled) { background: #0e392e; }
.button-secondary { border-color: #ccd6d0; background: #fff; color: #52605b; }
.button-secondary:hover { border-color: #174d40; color: #174d40; }
.contact-summary { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; margin-bottom: 20px; }
.contact-summary div { display: flex; flex-direction: column; gap: 5px; padding: 13px; background: #f5f7f4; }
.contact-summary span { color: #8a9690; font-size: 11px; }
.contact-summary strong { overflow: hidden; color: #2e4037; font-size: 13px; text-overflow: ellipsis; white-space: nowrap; }
.empty-contact { display: flex; flex-direction: column; gap: 5px; margin-bottom: 20px; color: #7c8983; font-size: 13px; }
.empty-contact strong { color: #3e5148; }
.danger-zone { padding-bottom: 0; }
.danger-zone .section-icon, .button-danger { color: #a33e35; }
.button-danger { border-color: #e4b9b4; background: #fff; }
.button-danger:hover:not(:disabled) { border-color: #a33e35; background: #fff1ef; }
.security-notice { position: fixed; z-index: 1300; right: 22px; bottom: 22px; display: flex; align-items: center; gap: 9px; padding: 13px 16px; background: #174d40; color: #fff; box-shadow: 0 10px 28px rgba(18, 48, 39, .22); font-size: 13px; }
.security-notice.error { background: #9c3b32; }
.modal-backdrop { position: fixed; z-index: 1400; inset: 0; display: grid; place-items: center; padding: 20px; background: rgba(11, 28, 22, .55); }
.modal-panel { width: min(480px, 100%); max-height: calc(100dvh - 40px); overflow: auto; padding: 28px; background: #fff; box-shadow: 0 20px 60px rgba(10, 28, 21, .25); }
.modal-heading { display: flex; justify-content: space-between; gap: 20px; margin-bottom: 24px; }
.modal-heading h3, .delete-panel h3 { margin: 0; color: #173f34; font: 600 24px/1.2 'Playfair Display', Georgia, serif; }
.modal-close { width: 32px; height: 32px; border: 0; background: #f2f5f2; color: #52605b; font-size: 23px; line-height: 1; cursor: pointer; }
.modal-actions { display: flex; justify-content: flex-end; gap: 9px; margin-top: 6px; }
.delete-panel { text-align: center; }
.delete-panel > p { margin: 10px auto 22px; max-width: 350px; color: #718079; font-size: 13px; line-height: 1.55; }
.delete-panel .field { text-align: left; }
.delete-icon { width: 48px; height: 48px; display: grid; place-items: center; margin: 0 auto 16px; border-radius: 50%; background: #fff1ef; color: #a33e35; }
.delete-panel .modal-actions { margin-top: 22px; }
@media (max-width: 620px) { .contact-summary { grid-template-columns: 1fr; } .security-notice { right: 14px; bottom: 14px; left: 14px; } .modal-panel { padding: 22px; } .modal-actions { flex-direction: column-reverse; } .modal-actions .button { width: 100%; } }
</style>
