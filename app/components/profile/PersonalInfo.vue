<template>
  <div class="personal-info">
    <div class="info-header">
      <h2 class="section-title">Personal Info</h2>
      <p class="section-desc">Update your personal information</p>
    </div>
    
    <div class="info-content">
      <div class="info-avatar">
        <AvatarUploader v-model="localAvatar" />
      </div>
      
      <el-form :model="formData" label-position="top" class="info-form" @submit.prevent="handleSubmit">
        <el-form-item label="Nickname">
          <el-input
            v-model="formData.nickname"
            placeholder="Enter your nickname"
            maxlength="50"
            show-word-limit
            class="form-input"
          />
        </el-form-item>
        
        <el-form-item label="Email">
          <el-input
            :value="email"
            placeholder="Your email"
            disabled
            class="form-input form-input-readonly"
          />
          <small class="form-hint">Your verified login email cannot be changed here.</small>
        </el-form-item>
        
        <el-form-item label="Country of Passport" :error="countryError">
          <CountrySelect v-model="formData.passportCountryCode" placeholder="Select country" />
        </el-form-item>
        
        <el-form-item label="Phone Number">
          <el-input
            v-model="formData.mobile"
            placeholder="+1 202 555 0123"
            class="form-input"
          />
          <small class="form-hint">Used for emergency contact (optional)</small>
        </el-form-item>
        
        <el-form-item label="Bio">
          <el-input
            v-model="formData.bio"
            type="textarea"
            :rows="4"
            placeholder="Tell us about yourself (max 200 characters)"
            maxlength="200"
            show-word-limit
            class="form-textarea"
          />
        </el-form-item>
        
        <el-form-item label="Timezone">
          <div class="timezone-item">
            <div class="timezone-info">
              <div class="timezone-label">{{ formData.timezoneMode === 1 ? 'Manual' : 'Auto-detect' }}</div>
              <div class="timezone-desc">{{ formData.timezoneMode === 1 ? 'Manually set your timezone' : 'Automatically detected based on your location' }}</div>
            </div>
            <el-switch
              v-model="formData.timezoneMode"
              :active-value="1"
              :inactive-value="0"
              active-color="#105446"
              inactive-color="#e5e5e5"
            />
          </div>
          <div v-if="formData.timezoneMode === 1" class="timezone-select-wrapper">
            <el-select
              v-model="formData.timezone"
              placeholder="Select timezone"
              class="form-select timezone-select"
              filterable
              clearable
            >
              <el-option
                v-for="tz in timezoneOptions"
                :key="tz.value"
                :label="tz.label"
                :value="tz.value"
              />
            </el-select>
          </div>
        </el-form-item>
        
        <el-form-item>
          <TravelPreferences v-model="formData.preferences" />
        </el-form-item>
        
        <el-form-item class="form-actions">
          <el-button type="default" @click="handleCancel">Cancel</el-button>
          <el-button type="primary" :loading="saving" @click="handleSubmit">
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import AvatarUploader from './AvatarUploader.vue'
import TravelPreferences from './TravelPreferences.vue'
import CountrySelect from '../CountrySelect.vue'

const props = defineProps<{
  email: string
  nickname: string
  mobile: string
  passportCountryCode: string
  bio: string
  preferences: string[]
  avatar: string
  timezone: string
  timezoneMode: number
}>()

const emit = defineEmits<{
  'update:nickname': [value: string]
  'update:mobile': [value: string]
  'update:passportCountryCode': [value: string]
  'update:bio': [value: string]
  'update:preferences': [value: string[]]
  'update:avatar': [value: string]
  'update:timezone': [value: string]
  'update:timezoneMode': [value: number]
  save: []
}>()

const localAvatar = ref(props.avatar)

const formData = reactive({
  nickname: props.nickname,
  mobile: props.mobile,
  passportCountryCode: props.passportCountryCode,
  bio: props.bio,
  preferences: [...props.preferences],
  timezone: props.timezone,
  timezoneMode: props.timezoneMode
})

const timezoneOptions = [
  { value: 'America/New_York', label: 'UTC-05:00 New York' },
  { value: 'America/Los_Angeles', label: 'UTC-08:00 Los Angeles' },
  { value: 'America/Chicago', label: 'UTC-06:00 Chicago' },
  { value: 'America/Toronto', label: 'UTC-05:00 Toronto' },
  { value: 'Europe/London', label: 'UTC+00:00 London' },
  { value: 'Europe/Paris', label: 'UTC+01:00 Paris' },
  { value: 'Europe/Berlin', label: 'UTC+01:00 Berlin' },
  { value: 'Europe/Moscow', label: 'UTC+03:00 Moscow' },
  { value: 'Asia/Tokyo', label: 'UTC+09:00 Tokyo' },
  { value: 'Asia/Shanghai', label: 'UTC+08:00 Shanghai' },
  { value: 'Asia/Hong_Kong', label: 'UTC+08:00 Hong Kong' },
  { value: 'Asia/Singapore', label: 'UTC+08:00 Singapore' },
  { value: 'Asia/Dubai', label: 'UTC+04:00 Dubai' },
  { value: 'Australia/Sydney', label: 'UTC+10:00 Sydney' },
  { value: 'Australia/Melbourne', label: 'UTC+10:00 Melbourne' },
  { value: 'Oceania/Auckland', label: 'UTC+12:00 Auckland' },
  { value: 'America/Sao_Paulo', label: 'UTC-03:00 Sao Paulo' },
  { value: 'Africa/Cairo', label: 'UTC+02:00 Cairo' },
  { value: 'Africa/Johannesburg', label: 'UTC+02:00 Johannesburg' },
  { value: 'Asia/Seoul', label: 'UTC+09:00 Seoul' },
  { value: 'Asia/Taipei', label: 'UTC+08:00 Taipei' },
  { value: 'Asia/Bangkok', label: 'UTC+07:00 Bangkok' },
  { value: 'Asia/Jakarta', label: 'UTC+07:00 Jakarta' },
  { value: 'Asia/Mumbai', label: 'UTC+05:30 Mumbai' },
  { value: 'America/Mexico_City', label: 'UTC-06:00 Mexico City' },
]

watch(() => props.avatar, (value) => {
  localAvatar.value = value
})

watch(() => props.nickname, (value) => {
  if (!formData.nickname) {
    formData.nickname = value
  }
})

watch(() => props.mobile, (value) => {
  if (!formData.mobile) {
    formData.mobile = value
  }
})

watch(() => props.passportCountryCode, (value) => {
  if (!formData.passportCountryCode) {
    formData.passportCountryCode = value
  }
})

watch(() => props.bio, (value) => {
  if (!formData.bio) {
    formData.bio = value
  }
})

watch(() => props.preferences, (value) => {
  if (formData.preferences.length === 0 && value.length > 0) {
    formData.preferences = [...value]
  }
})

watch(() => props.timezone, (value) => {
  formData.timezone = value
})

watch(() => props.timezoneMode, (value) => {
  formData.timezoneMode = value
})

const saving = ref(false)
const countryInvalid = ref(false)
const countryError = ref('')

const handleSubmit = async () => {
  countryInvalid.value = false
  countryError.value = ''
  
  if (!formData.passportCountryCode) {
    countryInvalid.value = true
    countryError.value = 'Choose the country that issued your passport.'
    return
  }
  
  saving.value = true
  
  try {
    emit('update:nickname', formData.nickname)
    emit('update:mobile', formData.mobile)
    emit('update:passportCountryCode', formData.passportCountryCode)
    emit('update:bio', formData.bio)
    emit('update:preferences', formData.preferences)
    emit('update:avatar', localAvatar.value)
    emit('update:timezone', formData.timezone)
    emit('update:timezoneMode', formData.timezoneMode)
    emit('save')
    ElMessage.success('Your profile has been updated.')
  } catch (caught) {
    ElMessage.error(caught instanceof Error ? caught.message : 'Unable to update your profile.')
  } finally {
    saving.value = false
  }
}

const handleCancel = () => {
  localAvatar.value = props.avatar
  formData.nickname = props.nickname
  formData.mobile = props.mobile
  formData.passportCountryCode = props.passportCountryCode
  formData.bio = props.bio
  formData.preferences = [...props.preferences]
  formData.timezone = props.timezone
  formData.timezoneMode = props.timezoneMode
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})
</script>

<style scoped>
.personal-info {
  max-width: 600px;
}

.info-header {
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

.info-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.info-avatar {
  display: flex;
  justify-content: center;
  padding: 20px 0;
  border-bottom: 1px solid #e5e5e5;
}

.info-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-form :deep(.el-form-item__label) {
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
    padding: 12px 16px;
  }
}

.form-input-readonly {
  :deep(.el-input__wrapper) {
    background: #e9e9e9;
  }
  
  :deep(.el-input__inner) {
    color: #808080;
  }
}

.form-textarea {
  :deep(.el-textarea__inner) {
    background: #f2f2f2;
    border-radius: 6px;
    border-color: #e5e5e5;
    font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
    font-size: 15px;
    color: #1D1D1D;
    padding: 12px 16px;
  }
  
  :deep(.el-textarea__inner:hover) {
    border-color: #105446;
  }
  
  :deep(.el-textarea__inner:focus) {
    border-color: #C0F177;
    box-shadow: none;
  }
}

.form-hint {
  font-size: 12px;
  color: #808080;
  margin: 4px 0 0 5px;
  display: block;
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 16px;
  padding: 0;
  
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

.info-message {
  margin-top: 16px;
}

.timezone-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.timezone-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.timezone-label {
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #1D1D1D;
}

.timezone-desc {
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 13px;
  color: #808080;
}

.timezone-select-wrapper {
  margin-top: 16px;
}

.timezone-select {
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
</style>
