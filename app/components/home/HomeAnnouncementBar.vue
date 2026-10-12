<template>
  <div v-if="announcement && announcementVisible" class="home-announcement" role="status">
    <div class="home-announcement__inner">
      <img v-if="announcement.iconUrl" :src="announcement.iconUrl" alt="" class="home-announcement__icon">
      <div class="home-announcement__copy">
        <strong>{{ announcement.title }}</strong>
        <span v-if="announcement.description">{{ announcement.description }}</span>
      </div>
      <button v-if="announcement.actionText && announcement.actionUrl" type="button" class="home-announcement__action" @click="open">{{ announcement.actionText }} <span aria-hidden="true">→</span></button>
      <button type="button" class="home-announcement__close" aria-label="Close announcement" @click="close">×</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { HomeAnnouncement } from '~/composables/useHomePromotions'
import { onMounted, ref, watch } from 'vue'
const props = defineProps<{ announcement?: HomeAnnouncement }>()
const { go, sendEvent, announcementDismissed } = useHomePromotions()
const announcementVisible = ref(true)
const dismissedKey = (value: HomeAnnouncement) => `lvyv:home-announcement-dismissed:${value.id}:${value.version}`
const isDismissed = (value?: HomeAnnouncement) => {
  if (!import.meta.client || !value) return false
  try { return window.localStorage.getItem(dismissedKey(value)) === '1' } catch { return false }
}
const syncVisibility = (value?: HomeAnnouncement) => {
  announcementVisible.value = Boolean(value) && !isDismissed(value)
  announcementDismissed.value = Boolean(value) && !announcementVisible.value
}
const close = () => {
  if (!props.announcement) return
  try { window.localStorage.setItem(dismissedKey(props.announcement), '1') } catch { /* 存储不可用时仍关闭当前页面公告 */ }
  announcementVisible.value = false
  announcementDismissed.value = true
}
const open = async () => { if (props.announcement) { await sendEvent('ANNOUNCEMENT', props.announcement, 'CLICK'); await go(props.announcement.actionUrl) } }
watch(() => props.announcement, syncVisibility, { immediate: true })
onMounted(() => syncVisibility(props.announcement))
</script>
<style scoped>
.home-announcement{height:60px;background:#f9f4f0;color:#161c2d;display:flex;align-items:center}.home-announcement__inner{width:100%;max-width:1440px;height:100%;margin:auto;padding:0 80px;display:flex;align-items:center;gap:20px;min-width:0}.home-announcement__icon{width:24px;height:24px;object-fit:contain;flex:0 0 24px}.home-announcement__copy{display:flex;align-items:center;gap:20px;min-width:0;flex:0 1 auto}.home-announcement__copy strong{width:max-content;max-width:347px;min-width:0;flex:0 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:Inter,sans-serif;font-size:16px;font-weight:500;line-height:32px;letter-spacing:-.2px}.home-announcement__copy span{width:max-content;max-width:263px;min-width:0;flex:0 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:Inter,sans-serif;font-size:14px;font-weight:400;line-height:28px;letter-spacing:-.2px;opacity:.7}.home-announcement__action{display:inline-flex;align-items:center;gap:14px;margin-left:0;border:0;background:none;color:#105446;font-family:Inter,sans-serif;font-size:14px;font-weight:600;line-height:28px;letter-spacing:-.2px;white-space:nowrap;cursor:pointer;padding:0}.home-announcement__action span{font-size:22px;font-weight:400;line-height:24px}.home-announcement__close{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;margin-left:auto;border:0;background:transparent;color:#161c2d;font-size:24px;font-weight:400;line-height:24px;cursor:pointer;padding:0;opacity:.7}.home-announcement__close:hover,.home-announcement__close:focus-visible{opacity:1}@media(max-width:991px){.home-announcement__inner{padding:0 20px;gap:14px}.home-announcement__copy{gap:14px;flex:1}.home-announcement__copy span{display:none}.home-announcement__action{gap:8px}}@media(max-width:700px){.home-announcement{height:60px;min-height:60px;overflow:hidden}.home-announcement__inner{padding:0 20px;align-items:center}.home-announcement__copy strong{width:auto;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:24px}}
</style>
