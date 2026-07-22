<template>
  <div class="travel-preferences">
    <div class="preferences-label">Travel Preferences</div>
    <div class="preferences-hint">Select your interests (optional)</div>
    
    <div class="preferences-tags">
      <el-tag
        v-for="tag in availableTags"
        :key="tag"
        :type="modelValue.includes(tag) ? 'success' : 'info'"
        :closable="modelValue.includes(tag)"
        :disable-transitions="false"
        class="preference-tag"
        @click="toggleTag(tag)"
        @close.prevent="toggleTag(tag)"
      >
        {{ tag }}
      </el-tag>
    </div>
    
    <div v-if="showCustomInput" class="custom-tag-input">
      <el-input
        v-model="customTag"
        placeholder="Add custom tag"
        @keyup.enter="addCustomTag"
        class="custom-input"
        size="default"
      />
      <el-button type="primary" @click="addCustomTag" :disabled="!customTag.trim()">
        <el-icon><Plus /></el-icon>
      </el-button>
    </div>
    
    <el-button type="text" @click="toggleCustomInput" class="add-preference-btn">
      <el-icon><Plus /></el-icon>
      <span>Add Preference</span>
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'

const props = defineProps<{
  modelValue: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const availableTags = [
  'Cultural Exploration',
  'Food & Drink',
  'Adventure',
  'Nature',
  'Historical Sites',
  'Shopping',
  'Nightlife',
  'Family Friendly',
  'Wellness',
  'Art & Design',
  'Photography',
  'Local Experiences',
  'Hiking',
  'Museums',
  'Festivals',
]

const customTag = ref('')
const showCustomInput = ref(false)

const toggleTag = (tag: string) => {
  const current = [...props.modelValue]
  const index = current.indexOf(tag)
  if (index > -1) {
    current.splice(index, 1)
  } else {
    current.push(tag)
  }
  emit('update:modelValue', current)
}

const toggleCustomInput = () => {
  showCustomInput.value = !showCustomInput.value
  if (!showCustomInput.value) {
    customTag.value = ''
  }
}

const addCustomTag = () => {
  const tag = customTag.value.trim()
  if (tag && !props.modelValue.includes(tag) && !availableTags.includes(tag)) {
    emit('update:modelValue', [...props.modelValue, tag])
    customTag.value = ''
    showCustomInput.value = false
  }
}
</script>

<style scoped>
.travel-preferences {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preferences-label {
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
}

.preferences-hint {
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 12px;
  color: #808080;
}

.preferences-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.preference-tag {
  cursor: pointer;
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 13px;
}

.preference-tag :deep(.el-tag--info) {
  background: #ffffff;
  border-color: #e5e5e5;
  color: #333333;
}

.preference-tag :deep(.el-tag--success) {
  background: #105446;
  border-color: #105446;
  color: #ffffff;
}

.preference-tag:hover :deep(.el-tag--info) {
  border-color: #105446;
  color: #105446;
}

.custom-tag-input {
  display: flex;
  gap: 8px;
}

.custom-input {
  flex: 1;
}

.add-preference-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 0;
  border: none;
  background: transparent;
  color: #105446;
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 13px;
  cursor: pointer;
  transition: color 0.2s;
  justify-content: flex-start;
}

.add-preference-btn:hover {
  color: #0d4238;
}
</style>
