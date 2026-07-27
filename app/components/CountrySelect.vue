<template>
  <select
    v-model="selectedCode"
    class="country-select"
    :class="{ invalid }"
    :disabled="disabled"
    :aria-invalid="invalid || undefined"
  >
    <option value="">{{ placeholder }}</option>
    <optgroup v-if="frequentOptions.length" label="Frequently selected">
      <option v-for="country in frequentOptions" :key="country.code" :value="country.code">
        {{ country.name }} ({{ country.code }})
      </option>
    </optgroup>
    <optgroup label="All countries">
      <option v-for="country in otherOptions" :key="country.code" :value="country.code">
        {{ country.name }} ({{ country.code }})
      </option>
    </optgroup>
  </select>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { frequentPassportCountryOptions, passportCountryOptions } from '~/utils/countries'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  disabled?: boolean
  size?: 'large' | 'default' | 'small'
  clearable?: boolean
  invalid?: boolean
}>(), {
  placeholder: 'Select country',
  disabled: false,
  size: 'default',
  clearable: false,
  invalid: false,
})

const emit = defineEmits<{ 'update:modelValue': [value: string]; change: [value: string] }>()
const selectedCode = computed({
  get: () => props.modelValue,
  set: (value: string) => {
    emit('update:modelValue', value)
    emit('change', value)
  },
})
const frequentOptions = frequentPassportCountryOptions
const frequentCodes = new Set(frequentPassportCountryOptions.map(country => country.code))
const otherOptions = computed(() => passportCountryOptions.filter(country => !frequentCodes.has(country.code)))
</script>

<style scoped>
.country-select { width: 100%; min-height: 46px; box-sizing: border-box; padding: 0 12px; border: 1px solid #ccd6d0; border-radius: 2px; outline: none; background: #fff; color: #22352c; font: 400 14px/1.4 'Inter', sans-serif; cursor: pointer; }
.country-select:hover { border-color: #8ca59a; }
.country-select:focus { border-color: #174d40; box-shadow: 0 0 0 3px rgba(23, 77, 64, .12); }
.country-select.invalid { border-color: #b0473d; }
.country-select:disabled { background: #f2f5f2; cursor: not-allowed; }
</style>
