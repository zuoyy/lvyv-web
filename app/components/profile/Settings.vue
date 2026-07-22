<template>
  <div class="settings">
    <div class="section-header">
      <h2 class="section-title">Settings</h2>
      <p class="section-desc">Configure your account preferences</p>
    </div>
    
    <div class="settings-content">
      <el-card class="settings-card">
        <template #header>
          <div class="card-title">Language</div>
        </template>
        
        <div class="card-content">
          <div class="language-item">
            <div class="language-info">
              <div class="language-label">Preferred Language</div>
              <div class="language-desc">Select your preferred display language</div>
            </div>
            <el-select v-model="selectedLanguage" placeholder="Select language" class="form-select">
              <el-option label="English" value="en-US" />
              <el-option label="中文 (Available soon)" value="zh-CN" disabled />
            </el-select>
          </div>
        </div>
      </el-card>
      
      <el-card class="settings-card">
        <template #header>
          <div class="card-title">Notification Preferences</div>
        </template>
        
        <div class="card-content">
          <div class="notification-group">
            <div class="notification-group-title">Email Notifications</div>
            
            <div class="notification-item">
              <div class="notification-info">
                <div class="notification-label">Trip Updates</div>
                <div class="notification-desc">Receive notifications when your trips are updated</div>
              </div>
              <el-switch
                v-model="emailNotifications.tripUpdates"
                active-color="#105446"
                inactive-color="#e5e5e5"
              />
            </div>
            
            <div class="notification-item">
              <div class="notification-info">
                <div class="notification-label">Payment Reminders</div>
                <div class="notification-desc">Receive payment due date reminders</div>
              </div>
              <el-switch
                v-model="emailNotifications.paymentReminders"
                active-color="#105446"
                inactive-color="#e5e5e5"
              />
            </div>
            
            <div class="notification-item">
              <div class="notification-info">
                <div class="notification-label">Points Changes</div>
                <div class="notification-desc">Receive notifications when your points balance changes</div>
              </div>
              <el-switch
                v-model="emailNotifications.pointsChanges"
                active-color="#105446"
                inactive-color="#e5e5e5"
              />
            </div>
            
            <div class="notification-item">
              <div class="notification-info">
                <div class="notification-label">Community Interactions</div>
                <div class="notification-desc">Receive notifications for likes, comments, and follows</div>
              </div>
              <el-switch
                v-model="emailNotifications.communityInteractions"
                active-color="#105446"
                inactive-color="#e5e5e5"
              />
            </div>
            
            <div class="notification-item">
              <div class="notification-info">
                <div class="notification-label">Newsletter</div>
                <div class="notification-desc">Receive our weekly newsletter with travel tips and deals</div>
              </div>
              <el-switch
                v-model="emailNotifications.newsletter"
                active-color="#105446"
                inactive-color="#e5e5e5"
              />
            </div>
          </div>
        </div>
      </el-card>
      
      <el-card class="settings-card">
        <template #header>
          <div class="card-title">Privacy</div>
        </template>
        
        <div class="card-content">
          <div class="privacy-item">
            <div class="privacy-info">
              <div class="privacy-label">Trip Visibility</div>
              <div class="privacy-desc">Allow other users to view and clone your trips</div>
            </div>
            <el-switch
              v-model="tripVisibility"
              active-color="#105446"
              inactive-color="#e5e5e5"
            />
          </div>
          
          <div class="privacy-item disabled-item">
            <div class="privacy-info">
              <div class="privacy-label">Show in Group Travel</div>
              <div class="privacy-desc">Display your profile in group travel matching (Coming soon)</div>
            </div>
            <div class="coming-soon-badge">Coming soon</div>
          </div>
        </div>
      </el-card>
      
    </div>
    
    <div class="settings-actions">
      <el-button type="default" @click="resetSettings">Reset to Default</el-button>
      <el-button type="primary" :loading="saving" @click="saveSettings">
        {{ saving ? 'Saving...' : 'Save Settings' }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const selectedLanguage = ref('en-US')
const emailNotifications = reactive({
  tripUpdates: true,
  paymentReminders: true,
  pointsChanges: true,
  communityInteractions: true,
  newsletter: false
})
const tripVisibility = ref(true)
const saving = ref(false)

const originalSettings = reactive({
  selectedLanguage: 'en-US',
  emailNotifications: {
    tripUpdates: true,
    paymentReminders: true,
    pointsChanges: true,
    communityInteractions: true,
    newsletter: false
  },
  tripVisibility: true
})

const saveSettings = async () => {
  saving.value = true
  
  try {
    ElMessage.success('Settings saved successfully.')
  } catch (caught) {
    ElMessage.error(caught instanceof Error ? caught.message : 'Unable to save settings.')
  } finally {
    saving.value = false
  }
}

const resetSettings = () => {
  selectedLanguage.value = originalSettings.selectedLanguage
  emailNotifications.tripUpdates = originalSettings.emailNotifications.tripUpdates
  emailNotifications.paymentReminders = originalSettings.emailNotifications.paymentReminders
  emailNotifications.pointsChanges = originalSettings.emailNotifications.pointsChanges
  emailNotifications.communityInteractions = originalSettings.emailNotifications.communityInteractions
  emailNotifications.newsletter = originalSettings.emailNotifications.newsletter
  tripVisibility.value = originalSettings.tripVisibility
}
</script>

<style scoped>
.settings {
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

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.settings-card {
  border-radius: 8px;
  border: 1px solid #e5e5e5;
  box-shadow: none;
}

.settings-card :deep(.el-card__header) {
  padding: 24px 24px 20px;
  border-bottom: 1px solid #e5e5e5;
}

.settings-card :deep(.el-card__body) {
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

.card-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.language-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.language-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.language-label {
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #1D1D1D;
}

.language-desc {
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 13px;
  color: #808080;
}

.form-select {
  width: 200px;
  
  :deep(.el-select__wrapper) {
    background: #ffffff;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    box-shadow: none;
    height: 48px;
  }
  
  :deep(.el-select__wrapper:hover) {
    border-color: #105446;
  }
  
  :deep(.el-select__wrapper.is-focus) {
    border-color: #C0F177;
    box-shadow: none;
  }
  
  :deep(.el-select__placeholder) {
    font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
    font-size: 16px;
    color: #999999;
  }
  
  :deep(.el-select__text) {
    font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
    font-size: 16px;
    color: #1a1a1a;
  }
}

.notification-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.notification-group-title {
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #808080;
  text-transform: uppercase;
  padding-bottom: 8px;
  border-bottom: 1px solid #f2f2f2;
}

.notification-item,
.privacy-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.notification-info,
.privacy-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.notification-label,
.privacy-label {
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #1D1D1D;
}

.notification-desc,
.privacy-desc {
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 13px;
  color: #808080;
}

.settings-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 24px;
  
  :deep(.el-button--default) {
    padding: 12px 24px;
    border: 1px solid #e5e5e5;
    border-radius: 6px;
    background: #ffffff;
    color: #333333;
    font-family: 'Roboto', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
    font-size: 15px;
    font-weight: 500;
    
    &:hover {
      border-color: #105446;
      color: #105446;
      background: #ffffff;
    }
  }
  
  :deep(.el-button--primary) {
    padding: 12px 32px;
    border: none;
    border-radius: 6px;
    background: #C0F177;
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
}

.privacy-item.disabled-item {
  opacity: 0.5;
  
  .privacy-label,
  .privacy-desc {
    color: #b3b3b3;
  }
}

.coming-soon-badge {
  padding: 4px 12px;
  border-radius: 4px;
  background: #f2f2f2;
  color: #808080;
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 12px;
  font-weight: 500;
}
</style>
