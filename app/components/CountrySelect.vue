<template>
  <el-select
    v-model="selectedCode"
    :placeholder="placeholder"
    :disabled="disabled"
    :size="size"
    :clearable="clearable"
    class="country-select"
    filterable
    @change="handleChange"
  >
    <el-option
      v-for="country in allCountryOptions"
      :key="country.code"
      :label="`${country.name} (${country.code})`"
      :value="country.code"
    />
  </el-select>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import {
  passportCountryOptions,
  passportCountryName,
  frequentPassportCountryOptions,
} from '~/utils/countries'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  disabled?: boolean
  size?: 'large' | 'default' | 'small'
  clearable?: boolean
}>(), {
  placeholder: 'Select country',
  disabled: false,
  size: 'default',
  clearable: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

const selectedCode = ref(props.modelValue)

const allCountryOptions = computed(() => {
  const frequentCodes = new Set(frequentPassportCountryOptions.map(c => c.code))
  const nonFrequent = passportCountryOptions.filter(country => !frequentCodes.has(country.code))
  return [...frequentPassportCountryOptions, ...nonFrequent]
})

watch(() => props.modelValue, (value) => {
  selectedCode.value = value
})

const handleChange = (value: string) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>
