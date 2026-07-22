<template>
  <div class="avatar-uploader">
    <el-upload
      class="avatar-upload"
      :action="''"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
    >
      <div class="avatar-preview">
        <img v-if="modelValue" :src="modelValue" alt="Avatar" class="avatar-img">
        <div v-else class="avatar-placeholder">
          <el-icon size="48"><User /></el-icon>
        </div>
        <div class="avatar-overlay">
          <el-icon size="24"><Camera /></el-icon>
        </div>
      </div>
    </el-upload>
    <p class="avatar-hint">Click to upload or change avatar (max 2MB)</p>
  </div>
</template>

<script setup lang="ts">
import { User, Camera } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('Please upload an image file')
    return false
  }
  const isLt2M = file.size < 2 * 1024 * 1024
  if (!isLt2M) {
    ElMessage.error('File size exceeds 2MB')
    return false
  }
  return true
}

const handleSuccess = (response: any, file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    emit('update:modelValue', result)
  }
  reader.readAsDataURL(file)
}
</script>

<style scoped>
.avatar-uploader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.avatar-upload {
  width: 120px;
  height: 120px;
}

.avatar-preview {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid #e5e5e5;
  transition: border-color 0.2s, transform 0.2s;
}

.avatar-preview:hover {
  border-color: #105446;
  transform: scale(1.02);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #808080;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.avatar-preview:hover .avatar-overlay {
  background: rgba(0, 0, 0, 0.4);
}

.avatar-overlay :deep(.el-icon) {
  color: #ffffff;
  opacity: 0;
  transition: opacity 0.2s;
}

.avatar-preview:hover .avatar-overlay :deep(.el-icon) {
  opacity: 1;
}

.avatar-hint {
  margin: 0;
  font-size: 12px;
  color: #808080;
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}
</style>
