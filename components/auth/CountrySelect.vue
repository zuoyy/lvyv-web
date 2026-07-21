<template>
  <div ref="root" class="country-select">
    <input type="hidden" name="passportCountryCode" :value="modelValue">
    <div class="country-input-wrap">
      <input
        :id="inputId"
        v-model="query"
        type="text"
        role="combobox"
        autocomplete="country-name"
        aria-required="true"
        :aria-expanded="open"
        :aria-controls="`${inputId}-listbox`"
        :aria-activedescendant="activeOption ? `${inputId}-${activeOption.code}` : undefined"
        :aria-invalid="invalid || undefined"
        :placeholder="selectedCountry?.name || 'Search countries'"
        @focus="openList"
        @input="handleInput"
        @keydown="handleKeydown"
      >
      <span class="country-chevron" aria-hidden="true" />
    </div>

    <div v-if="open" :id="`${inputId}-listbox`" class="country-menu" role="listbox">
      <template v-if="frequentOptions.length">
        <p class="country-group-label">Frequently selected</p>
        <button
          v-for="(country, index) in frequentOptions"
          :id="`${inputId}-${country.code}`"
          :key="country.code"
          class="country-option"
          :class="{ active: activeIndex === index, selected: country.code === modelValue }"
          type="button"
          role="option"
          :aria-selected="country.code === modelValue"
          @mousedown.prevent="selectCountry(country)"
          @mouseenter="activeIndex = index"
        >
          <span>{{ country.name }}</span><span>{{ country.code }}</span>
        </button>
      </template>

      <p v-if="otherOptions.length && frequentOptions.length" class="country-group-label">All countries</p>
      <button
        v-for="(country, index) in otherOptions"
        :id="`${inputId}-${country.code}`"
        :key="country.code"
        class="country-option"
        :class="{ active: activeIndex === index + frequentOptions.length, selected: country.code === modelValue }"
        type="button"
        role="option"
        :aria-selected="country.code === modelValue"
        @mousedown.prevent="selectCountry(country)"
        @mouseenter="activeIndex = index + frequentOptions.length"
      >
        <span>{{ country.name }}</span><span>{{ country.code }}</span>
      </button>

      <p v-if="!flatOptions.length" class="country-empty">No countries found</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CountryOption } from '~/utils/countries'
import {
  FREQUENT_PASSPORT_COUNTRY_CODES,
  frequentPassportCountryOptions,
  passportCountryName,
  passportCountryOptions,
} from '~/utils/countries'

const props = withDefaults(defineProps<{
  modelValue: string
  inputId?: string
  invalid?: boolean
}>(), {
  inputId: 'passport-country',
  invalid: false,
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const root = ref<HTMLElement>()
const open = ref(false)
const query = ref(passportCountryName(props.modelValue))
const activeIndex = ref(-1)
const frequentCodes = new Set<string>(FREQUENT_PASSPORT_COUNTRY_CODES)

const selectedCountry = computed(() => passportCountryOptions.find((country) => country.code === props.modelValue))
const normalizedQuery = computed(() => query.value.trim().toLocaleLowerCase('en'))
const matchingOptions = computed(() => {
  if (!normalizedQuery.value) return passportCountryOptions
  return passportCountryOptions.filter((country) => country.name.toLocaleLowerCase('en').includes(normalizedQuery.value)
    || country.code.toLocaleLowerCase('en').includes(normalizedQuery.value))
})
const frequentOptions = computed(() => normalizedQuery.value ? [] : frequentPassportCountryOptions)
const otherOptions = computed(() => matchingOptions.value.filter((country) => normalizedQuery.value || !frequentCodes.has(country.code)))
const flatOptions = computed(() => [...frequentOptions.value, ...otherOptions.value])
const activeOption = computed(() => flatOptions.value[activeIndex.value])

watch(() => props.modelValue, (value) => {
  if (!open.value) query.value = passportCountryName(value)
})
watch(flatOptions, () => { activeIndex.value = flatOptions.value.length ? 0 : -1 })

const openList = () => {
  query.value = ''
  open.value = true
  activeIndex.value = flatOptions.value.findIndex((country) => country.code === props.modelValue)
  if (activeIndex.value < 0) activeIndex.value = flatOptions.value.length ? 0 : -1
}

const handleInput = () => {
  if (props.modelValue) emit('update:modelValue', '')
  open.value = true
}

const selectCountry = (country: CountryOption) => {
  emit('update:modelValue', country.code)
  query.value = country.name
  open.value = false
}

const closeList = () => {
  open.value = false
  query.value = passportCountryName(props.modelValue)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (!open.value) openList()
    else activeIndex.value = Math.min(activeIndex.value + 1, flatOptions.value.length - 1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
  } else if (event.key === 'Enter' && open.value && activeOption.value) {
    event.preventDefault()
    selectCountry(activeOption.value)
  } else if (event.key === 'Escape') {
    closeList()
  }
}

const handleDocumentPointer = (event: PointerEvent) => {
  if (root.value && !root.value.contains(event.target as Node)) closeList()
}

onMounted(() => document.addEventListener('pointerdown', handleDocumentPointer))
onBeforeUnmount(() => document.removeEventListener('pointerdown', handleDocumentPointer))
</script>
