<template>
  <div class="avatar-picker">
    <button class="avatar-button" type="button" aria-label="Choose a profile avatar" @click="showPicker = true">
      <img v-if="modelValue" :src="modelValue" alt="Your profile avatar" class="avatar-img">
      <span v-else class="avatar-placeholder">{{ initials }}</span>
      <span class="avatar-overlay">
        <font-awesome-icon :icon="['fas', 'pen-to-square']" />
      </span>
    </button>

    <Teleport to="body">
      <div v-if="showPicker" class="avatar-modal-backdrop" @click.self="closePicker">
        <section class="avatar-modal" role="dialog" aria-modal="true" aria-labelledby="avatar-picker-title">
          <header>
            <div>
              <p>Profile</p>
              <h2 id="avatar-picker-title">Set your avatar</h2>
            </div>
            <button class="modal-close" type="button" aria-label="Close avatar picker" @click="closePicker">×</button>
          </header>

          <div class="avatar-grid" aria-label="Available avatars">
            <button
              v-for="avatar in REGISTRATION_AVATAR_URLS"
              :key="avatar"
              class="avatar-option"
              :class="{ selected: avatar === modelValue }"
              type="button"
              :aria-label="avatar === modelValue ? 'Selected avatar' : 'Set this avatar'"
              @click="selectAvatar(avatar)"
            >
              <img :src="avatar" alt="">
              <span v-if="avatar === modelValue" class="selected-mark">
                <font-awesome-icon :icon="['fas', 'check']" />
              </span>
            </button>
          </div>
        </section>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { REGISTRATION_AVATAR_URLS } from '~/utils/avatars'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const showPicker = ref(false)
const initials = computed(() => props.modelValue ? '' : 'L')

const closePicker = () => {
  showPicker.value = false
}

const selectAvatar = (avatar: string) => {
  emit('update:modelValue', avatar)
  closePicker()
}
</script>

<style scoped>
.avatar-picker { display: flex; flex-direction: column; align-items: center; gap: 8px; flex: 0 0 auto; }
.avatar-button { position: relative; width: 108px; height: 108px; padding: 0; overflow: hidden; border: 3px solid #edf2ed; border-radius: 50%; background: #174d40; color: #fff; cursor: pointer; }
.avatar-button:hover { border-color: #bfdc72; }
.avatar-img, .avatar-placeholder { width: 100%; height: 100%; display: grid; place-items: center; object-fit: cover; }
.avatar-placeholder { font: 600 32px/1 'Playfair Display', Georgia, serif; }
.avatar-overlay { position: absolute; inset: 0; display: grid; place-items: center; background: rgba(14, 57, 46, .72); opacity: 0; transition: opacity .18s; }
.avatar-button:hover .avatar-overlay, .avatar-button:focus-visible .avatar-overlay { opacity: 1; }
.avatar-overlay svg { font-size: 20px; }
.avatar-modal-backdrop { position: fixed; z-index: 1500; inset: 0; display: grid; place-items: center; padding: 20px; background: rgba(11, 28, 22, .58); }
.avatar-modal { width: min(520px, 100%); max-height: calc(100dvh - 40px); overflow-y: auto; padding: 28px; background: #fff; box-shadow: 0 24px 70px rgba(8, 28, 20, .3); }
.avatar-modal header { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; margin-bottom: 22px; }
.avatar-modal header p { margin: 0 0 7px; color: #78877f; font-size: 10px; font-weight: 800; text-transform: uppercase; }
.avatar-modal h2 { margin: 0; color: #173f34; font: 600 28px/1.2 'Playfair Display', Georgia, serif; }
.modal-close { width: 34px; height: 34px; border: 0; background: #f0f3f0; color: #52605b; font-size: 23px; cursor: pointer; }
.avatar-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.avatar-option { position: relative; aspect-ratio: 1; min-width: 0; padding: 0; overflow: hidden; border: 2px solid #e2e8e4; border-radius: 50%; background: #f5f8f5; cursor: pointer; transition: border-color .18s, box-shadow .18s, transform .18s; }
.avatar-option:hover { border-color: #93aa9f; transform: translateY(-1px); }
.avatar-option.selected { border-color: #174d40; box-shadow: 0 0 0 3px rgba(23, 77, 64, .14); }
.avatar-option img { width: 100%; height: 100%; display: block; object-fit: cover; }
.selected-mark { position: absolute; right: 4px; bottom: 4px; width: 24px; height: 24px; display: grid; place-items: center; border-radius: 50%; background: #174d40; color: #fff; font-size: 11px; }
@media (max-width: 560px) { .avatar-modal { padding: 24px 18px; } .avatar-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; } }
</style>
