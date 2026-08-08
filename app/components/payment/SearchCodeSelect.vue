<template>
  <div ref="root" class="code-select" :class="{ disabled }">
    <input type="hidden" :value="modelValue">
    <div class="code-input-wrap">
      <input
        :id="inputId"
        v-model="query"
        type="text"
        role="combobox"
        autocomplete="off"
        autocapitalize="off"
        autocorrect="off"
        spellcheck="false"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required && !modelValue"
        :aria-expanded="open"
        :aria-controls="`${inputId}-listbox`"
        @click="toggleList"
        @input="open = true"
        @keydown="handleKeydown"
      >
      <span class="code-chevron" aria-hidden="true" />
    </div>
    <div v-if="open && !disabled" :id="`${inputId}-listbox`" class="code-menu" role="listbox">
      <button
        v-for="(option, index) in matchingOptions"
        :id="`${inputId}-${option.code}`"
        :key="option.code"
        type="button"
        role="option"
        :aria-selected="option.code === modelValue"
        :class="{ active: activeIndex === index, selected: option.code === modelValue }"
        @click="selectOption(option)"
        @mouseenter="activeIndex = index"
      >
        <span>{{ option.name }}</span><span>{{ option.code }}</span>
      </button>
      <p v-if="!matchingOptions.length" class="code-empty">No matching codes</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SearchCodeOption { code: string; name: string }

const props = withDefaults(defineProps<{
  modelValue: string
  options: SearchCodeOption[]
  inputId: string
  placeholder: string
  disabled?: boolean
  required?: boolean
}>(), { disabled: false, required: false })

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const root = ref<HTMLElement>()
const open = ref(false)
const query = ref('')
const activeIndex = ref(-1)

const selectedOption = computed(() => props.options.find((option) => option.code === props.modelValue))
const normalizedQuery = computed(() => query.value.trim().toLocaleLowerCase('en'))
const matchingOptions = computed(() => {
  if (!normalizedQuery.value) return props.options
  return props.options.filter((option) => option.name.toLocaleLowerCase('en').includes(normalizedQuery.value)
    || option.code.toLocaleLowerCase('en').includes(normalizedQuery.value))
})
const activeOption = computed(() => matchingOptions.value[activeIndex.value])

const syncQuery = () => { query.value = selectedOption.value ? `${selectedOption.value.name} (${selectedOption.value.code})` : '' }
watch(() => props.modelValue, syncQuery, { immediate: true })
watch(matchingOptions, () => { activeIndex.value = matchingOptions.value.length ? 0 : -1 })

const openList = () => {
  if (props.disabled) return
  open.value = true
  activeIndex.value = Math.max(matchingOptions.value.findIndex((option) => option.code === props.modelValue), 0)
}
const toggleList = () => { open.value ? closeList() : openList() }
const selectOption = (option: SearchCodeOption) => {
  emit('update:modelValue', option.code)
  query.value = `${option.name} (${option.code})`
  open.value = false
}
const closeList = () => { open.value = false; syncQuery() }
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown') {
    event.preventDefault(); if (!open.value) openList(); else activeIndex.value = Math.min(activeIndex.value + 1, matchingOptions.value.length - 1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault(); activeIndex.value = Math.max(activeIndex.value - 1, 0)
  } else if (event.key === 'Enter' && open.value && activeOption.value) {
    event.preventDefault(); selectOption(activeOption.value)
  } else if (event.key === 'Escape') closeList()
}
const handleDocumentClick = (event: MouseEvent) => { if (root.value && !root.value.contains(event.target as Node)) closeList() }
onMounted(() => document.addEventListener('click', handleDocumentClick))
onBeforeUnmount(() => document.removeEventListener('click', handleDocumentClick))
</script>

<style scoped>
.code-select { position: relative; }
.code-input-wrap { position: relative; }
.code-input-wrap input { padding-right: 34px !important; }
.code-chevron { position: absolute; top: 50%; right: 13px; width: 7px; height: 7px; border-right: 1px solid #718078; border-bottom: 1px solid #718078; transform: translateY(-65%) rotate(45deg); pointer-events: none; }
.code-menu { position: absolute; z-index: 20; top: calc(100% + 4px); right: 0; left: 0; max-height: 260px; overflow-y: auto; padding: 5px; border: 1px solid #ccd7d0; background: #fff; box-shadow: 0 8px 22px rgba(29, 51, 42, .12); }
.code-menu button { display: flex; width: 100%; justify-content: space-between; gap: 12px; padding: 9px 10px; border: 0; background: #fff; color: #31463c; text-align: left; cursor: pointer; }
.code-menu button:hover, .code-menu button.active { background: #edf3ee; }
.code-menu button span:last-child { color: #718078; font-weight: 700; }
.code-menu button.selected { color: #174d40; font-weight: 700; }
.code-empty { margin: 0; padding: 11px 10px; color: #87938d; font-size: 12px; }
</style>
