<template>
  <div class="travel-preferences">
    <div>
      <h3>Travel preferences</h3>
      <p>Select the interests you would enjoy sharing with a local friend.</p>
    </div>

    <div class="preferences-tags" aria-label="Travel interests">
      <button
        v-for="tag in availableTags"
        :key="tag"
        class="preference-tag"
        :class="{ selected: modelValue.includes(tag) }"
        type="button"
        :aria-pressed="modelValue.includes(tag)"
        @click="toggleTag(tag)"
      >
        <span v-if="modelValue.includes(tag)" aria-hidden="true">✓</span>{{ tag }}
      </button>
    </div>

    <div v-if="showCustomInput" class="custom-tag-input">
      <input v-model="customTag" class="text-input" type="text" maxlength="40" placeholder="Add an interest" @keyup.enter="addCustomTag">
      <button class="add-button" type="button" :disabled="!customTag.trim()" @click="addCustomTag">Add</button>
    </div>
    <button class="add-preference-button" type="button" @click="toggleCustomInput">
      <span aria-hidden="true">{{ showCustomInput ? '−' : '+' }}</span>
      {{ showCustomInput ? 'Close' : 'Add another interest' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ modelValue: string[] }>()
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

const availableTags = [
  'Cultural exploration', 'Food & drink', 'Adventure', 'Nature', 'Historical sites',
  'Shopping', 'Nightlife', 'Family friendly', 'Wellness', 'Art & design',
  'Photography', 'Local experiences', 'Hiking', 'Museums', 'Festivals',
]
const customTag = ref('')
const showCustomInput = ref(false)

const toggleTag = (tag: string) => {
  const current = [...props.modelValue]
  const index = current.indexOf(tag)
  if (index >= 0) current.splice(index, 1)
  else current.push(tag)
  emit('update:modelValue', current)
}

const toggleCustomInput = () => {
  showCustomInput.value = !showCustomInput.value
  if (!showCustomInput.value) customTag.value = ''
}

const addCustomTag = () => {
  const tag = customTag.value.trim()
  if (!tag || props.modelValue.includes(tag)) return
  emit('update:modelValue', [...props.modelValue, tag])
  customTag.value = ''
  showCustomInput.value = false
}
</script>

<style scoped>
.travel-preferences { display: flex; flex-direction: column; gap: 14px; }
.travel-preferences h3 { margin: 0; color: #26372f; font-size: 14px; }
.travel-preferences p { margin: 5px 0 0; color: #7c8983; font-size: 12px; line-height: 1.5; }
.preferences-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.preference-tag { min-height: 32px; padding: 0 11px; border: 1px solid #d3ddd6; border-radius: 20px; background: #fff; color: #53615a; font: 500 12px/1 'Inter', sans-serif; cursor: pointer; transition: border-color .18s, background .18s, color .18s; }
.preference-tag:hover { border-color: #174d40; color: #174d40; }
.preference-tag.selected { border-color: #174d40; background: #174d40; color: #fff; }
.preference-tag.selected span { margin-right: 5px; color: #c8e98b; }
.custom-tag-input { display: flex; gap: 8px; max-width: 410px; }
.text-input { min-height: 40px; flex: 1; box-sizing: border-box; padding: 9px 11px; border: 1px solid #ccd6d0; border-radius: 2px; outline: none; color: #22352c; font: 400 13px/1.4 'Inter', sans-serif; }
.text-input:focus { border-color: #174d40; box-shadow: 0 0 0 3px rgba(23, 77, 64, .12); }
.add-button { min-width: 58px; border: 0; border-radius: 2px; background: #174d40; color: #fff; font: 700 12px/1 'Inter', sans-serif; cursor: pointer; }
.add-button:disabled { opacity: .5; cursor: not-allowed; }
.add-preference-button { align-self: flex-start; padding: 0; border: 0; background: transparent; color: #174d40; font: 700 12px/1.4 'Inter', sans-serif; cursor: pointer; }
.add-preference-button span { display: inline-block; width: 18px; margin-right: 3px; font-size: 17px; vertical-align: -1px; }
</style>
