<template>
  <div class="account-security">
    <div class="section-header">
      <h2 class="section-title">Account Security</h2>
      <p class="section-desc">Manage your account security settings</p>
    </div>
    
    <div class="security-content">
      <el-card class="security-card">
        <template #header>
          <div class="card-title">Change Password</div>
        </template>
        
        <el-form :model="passwordForm" label-position="top" class="security-form">
          <el-form-item label="Current Password">
            <el-input
              v-model="passwordForm.currentPassword"
              :type="showCurrentPassword ? 'text' : 'password'"
              placeholder="Enter current password"
              class="form-input"
              show-password
            />
          </el-form-item>
          
          <el-form-item label="New Password">
            <el-input
              v-model="passwordForm.newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              placeholder="Enter new password"
              class="form-input"
              show-password
            />
            <small class="form-hint">8-32 characters, uppercase + lowercase + number</small>
          </el-form-item>
          
          <el-form-item label="Confirm New Password">
            <el-input
              v-model="passwordForm.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirm new password"
              class="form-input"
              show-password
            />
          </el-form-item>
          
          <el-form-item :error="passwordError" class="error-item">
            <span v-if="passwordError" class="form-error">{{ passwordError }}</span>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" :loading="saving" @click="changePassword">
              {{ saving ? 'Changing...' : 'Change Password' }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
      
      <el-card class="security-card">
        <template #header>
          <div class="card-title">Emergency Contact</div>
        </template>
        
        <div class="card-content">
          <div v-if="emergencyContact" class="contact-info">
            <div class="contact-item">
              <div class="contact-label">Name</div>
              <div class="contact-value">{{ emergencyContact.name }}</div>
            </div>
            <div class="contact-item">
              <div class="contact-label">Phone Number</div>
              <div class="contact-value">{{ emergencyContact.phone }}</div>
            </div>
            <div class="contact-item">
              <div class="contact-label">Relationship</div>
              <div class="contact-value">{{ emergencyContact.relationship }}</div>
            </div>
          </div>
          <div v-else class="contact-empty">
            <div class="empty-text">No emergency contact added</div>
            <div class="empty-desc">Add someone we can contact in case of emergency</div>
          </div>
          <el-button type="primary" @click="openContactDialog">
            {{ emergencyContact ? 'Edit Contact' : 'Add Contact' }}
          </el-button>
        </div>
      </el-card>
      
      <el-card class="security-card danger-card">
        <template #header>
          <div class="card-title danger-title">Danger Zone</div>
        </template>
        
        <div class="card-content">
          <div class="danger-info">
            <div class="danger-label">Delete Account</div>
            <div class="danger-desc">This action cannot be undone. All your data will be permanently deleted.</div>
          </div>
          <el-button type="danger" @click="showDeleteConfirm = true">
            Delete Account
          </el-button>
        </div>
      </el-card>
    </div>
    
    <el-dialog
      v-model="showContactDialog"
      title="Emergency Contact"
      class="contact-dialog"
      :close-on-click-modal="false"
    >
      <el-form :model="contactForm" label-position="top" class="contact-form">
        <el-form-item label="Name">
          <el-input
            v-model="contactForm.name"
            placeholder="Enter contact name"
            class="form-input"
          />
        </el-form-item>
        
        <el-form-item label="Phone Number">
          <el-input
            v-model="contactForm.phone"
            placeholder="+1 202 555 0123"
            class="form-input"
          />
        </el-form-item>
        
        <el-form-item label="Relationship">
          <el-select
            v-model="contactForm.relationship"
            placeholder="Select relationship"
            class="form-input"
          >
            <el-option label="Parent" value="parent" />
            <el-option label="Sibling" value="sibling" />
            <el-option label="Spouse" value="spouse" />
            <el-option label="Friend" value="friend" />
            <el-option label="Other" value="other" />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button type="default" @click="closeContactDialog">Cancel</el-button>
        <el-button type="primary" :loading="contactSaving" @click="saveContact">
          {{ contactSaving ? 'Saving...' : 'Save' }}
        </el-button>
      </template>
    </el-dialog>
    
    <el-dialog
      v-model="showDeleteConfirm"
      title="Confirm Account Deletion"
      :close-on-click-modal="false"
    >
      <div class="delete-confirm">
        <div class="delete-icon">
          <el-icon size="48"><Warning /></el-icon>
        </div>
        <p class="delete-warning">Are you sure you want to delete your account?</p>
        <p class="delete-desc">This action is irreversible. All your data including trips, wishes, badges, and profile information will be permanently deleted.</p>
        <el-input
          v-model="deleteConfirmText"
          placeholder="Type 'DELETE' to confirm"
          class="confirm-input"
        />
      </div>
      <template #footer>
        <el-button @click="showDeleteConfirm = false">Cancel</el-button>
        <el-button
          type="danger"
          :disabled="deleteConfirmText !== 'DELETE'"
          @click="deleteAccount"
        >
          Delete Account
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Warning } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const saving = ref(false)
const passwordError = ref('')

const emergencyContact = ref<{ name: string; phone: string; relationship: string } | null>(null)
const showContactDialog = ref(false)
const contactSaving = ref(false)

const showDeleteConfirm = ref(false)
const deleteConfirmText = ref('')

const contactForm = reactive({
  name: '',
  phone: '',
  relationship: ''
})

const changePassword = async () => {
  passwordError.value = ''
  
  if (!passwordForm.currentPassword) {
    passwordError.value = 'Please enter your current password.'
    return
  }
  
  if (!passwordForm.newPassword) {
    passwordError.value = 'Please enter a new password.'
    return
  }
  
  if (passwordForm.newPassword.length < 8 || passwordForm.newPassword.length > 32) {
    passwordError.value = 'Password must be 8-32 characters long.'
    return
  }
  
  if (!/[a-z]/.test(passwordForm.newPassword)) {
    passwordError.value = 'Password must contain at least one lowercase letter.'
    return
  }
  
  if (!/[A-Z]/.test(passwordForm.newPassword)) {
    passwordError.value = 'Password must contain at least one uppercase letter.'
    return
  }
  
  if (!/[0-9]/.test(passwordForm.newPassword)) {
    passwordError.value = 'Password must contain at least one number.'
    return
  }
  
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = 'Passwords do not match.'
    return
  }
  
  saving.value = true
  
  try {
    ElMessage.success('Password changed successfully.')
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (caught) {
    ElMessage.error(caught instanceof Error ? caught.message : 'Unable to change password.')
  } finally {
    saving.value = false
  }
}

const openContactDialog = () => {
  if (emergencyContact.value) {
    contactForm.name = emergencyContact.value.name
    contactForm.phone = emergencyContact.value.phone
    contactForm.relationship = emergencyContact.value.relationship
  } else {
    contactForm.name = ''
    contactForm.phone = ''
    contactForm.relationship = ''
  }
  showContactDialog.value = true
}

const closeContactDialog = () => {
  showContactDialog.value = false
}

const saveContact = () => {
  if (!contactForm.name) {
    ElMessage.error('Please enter contact name.')
    return
  }
  if (!contactForm.phone) {
    ElMessage.error('Please enter phone number.')
    return
  }
  if (!contactForm.relationship) {
    ElMessage.error('Please select relationship.')
    return
  }
  
  contactSaving.value = true
  
  setTimeout(() => {
    emergencyContact.value = {
      name: contactForm.name,
      phone: contactForm.phone,
      relationship: contactForm.relationship
    }
    showContactDialog.value = false
    contactSaving.value = false
    ElMessage.success('Emergency contact saved successfully.')
  }, 500)
}

const deleteAccount = () => {
  showDeleteConfirm.value = false
  deleteConfirmText.value = ''
  ElMessage.success('Account deletion is not available in demo mode.')
}
</script>

<style scoped>
.account-security {
  max-width: 600px;
}

.section-header {
  margin-bottom: 32px;
}

.section-title {
  margin: 0;
  font-family: 'Didot', 'Playfair Display', Georgia, serif;
  font-size: 24px;
  font-weight: 700;
  color: #1D1D1D;
}

.section-desc {
  margin: 8px 0 0;
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 15px;
  color: #666666;
}

.security-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.security-card {
  border-radius: 8px;
  border: 1px solid #e5e5e5;
  box-shadow: none;
}

.security-card :deep(.el-card__header) {
  padding: 24px 24px 20px;
  border-bottom: 1px solid #e5e5e5;
}

.security-card :deep(.el-card__body) {
  padding: 24px;
}

.card-title {
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #1D1D1D;
}

.danger-title {
  color: #b83a3a;
}

.security-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.security-form :deep(.el-form-item__label) {
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #1D1D1D;
  padding: 0 0 8px;
}

.form-input {
  :deep(.el-input__wrapper) {
    background: #f2f2f2;
    border-radius: 6px;
    border-color: #e5e5e5;
    box-shadow: none;
  }
  
  :deep(.el-input__wrapper:hover) {
    border-color: #105446;
  }
  
  :deep(.el-input__wrapper.is-focus) {
    border-color: #C0F177;
    box-shadow: none;
  }
  
  :deep(.el-input__inner) {
    font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
    font-size: 15px;
    color: #1D1D1D;
    padding: 12px 40px 12px 16px;
  }
}

.form-hint {
  font-size: 12px;
  color: #808080;
  margin: 4px 0 0;
  display: block;
}

.error-item {
  margin-bottom: 0;
}

.form-error {
  font-size: 12px;
  color: #ff0000;
}

.security-form :deep(.el-button--primary) {
  padding: 12px 32px;
  border: none;
  border-radius: 6px;
  background: #C0F177 !important;
  color: #1D1D1D;
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 15px;
  font-weight: 700;
  
  &:hover:not(:disabled) {
    background: #b5e66e;
  }
  
  &:disabled {
    opacity: 0.6;
  }
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.toggle-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.toggle-label {
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #1D1D1D;
}

.toggle-desc {
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 13px;
  color: #808080;
}

.session-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.session-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.session-device {
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #1D1D1D;
}

.session-details {
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 13px;
  color: #808080;
}

.security-card :deep(.el-button--default) {
  padding: 10px 20px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  background: #ffffff;
  color: #105446;
  font-family: 'Roboto', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  font-weight: 500;
  align-self: flex-start;
  
  &:hover {
    border-color: #105446;
    background: #e9f3ee;
  }
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contact-label {
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #808080;
  text-transform: uppercase;
}

.contact-value {
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 15px;
  color: #1D1D1D;
}

.contact-empty {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.empty-text {
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #808080;
}

.empty-desc {
  font-family: 'Roboto', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 13px;
  color: #b3b3b3;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-form :deep(.el-form-item__label) {
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #1D1D1D;
  padding: 0 0 8px;
}

.danger-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.danger-label {
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #b83a3a;
}

.danger-desc {
  font-family: 'Roboto', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 13px;
  color: #808080;
}

.danger-card :deep(.el-button--danger) {
  padding: 10px 20px;
  border-radius: 6px;
  font-family: 'Roboto', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  font-weight: 500;
  
  &:hover {
    background: #a53030;
  }
}

.delete-confirm {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.delete-icon {
  color: #f56c6c;
}

.delete-warning {
  font-family: 'Didot', 'Playfair Display', Georgia, serif;
  font-size: 18px;
  font-weight: 700;
  color: #1D1D1D;
  margin: 0;
}

.delete-desc {
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  color: #666666;
  margin: 0;
  line-height: 1.6;
}

.confirm-input {
  width: 100%;
  
  :deep(.el-input__wrapper) {
    background: #fef0f0;
    border-radius: 6px;
    border-color: #fbc4c4;
  }
  
  :deep(.el-input__wrapper.is-focus) {
    border-color: #f56c6c;
    box-shadow: none;
  }
}

@media (max-width: 768px) {
  .contact-dialog {
    width: 90% !important;
  }
}
</style>
