<template>
  <div v-if="announcement && announcementVisible" ref="barRef" class="home-announcement" :class="{ 'home-announcement--china-sim': isChinaSim }" role="status">
    <div class="home-announcement__inner">
      <img v-if="announcement.iconUrl" :src="announcement.iconUrl" alt="" class="home-announcement__icon">
      <div class="home-announcement__copy">
        <strong>{{ announcement.title }}</strong>
        <span v-if="announcement.description">{{ announcement.description }}</span>
      </div>
      <button v-if="announcement.actionText && announcement.actionUrl" type="button" class="home-announcement__action" @click="open">
        {{ announcement.actionText }}
        <img v-if="isChinaSim" src="/images/home/china-sim-announcement-arrow.svg" alt="" width="20" height="20">
        <span v-else aria-hidden="true">→</span>
      </button>
      <button type="button" class="home-announcement__close" aria-label="Close announcement" @click="close">×</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { chinaSimCampaignUrl, chinaSimPath, type HomeAnnouncement } from '~/composables/useHomePromotions'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
const props = defineProps<{ announcement?: HomeAnnouncement }>()
const { go, sendEvent, announcementDismissed } = useHomePromotions()
const isChinaSim = computed(() => props.announcement?.actionUrl === chinaSimPath || props.announcement?.actionUrl === chinaSimCampaignUrl)
const announcementVisible = ref(true)
const barRef = ref<HTMLElement | null>(null)
let resizeObserver: ResizeObserver | null = null
const dismissedKey = (value: HomeAnnouncement) => `lvyv:home-announcement-dismissed:${value.id}:${value.version}`
const isDismissed = (value?: HomeAnnouncement) => {
  if (!import.meta.client || !value) return false
  try { return window.localStorage.getItem(dismissedKey(value)) === '1' } catch { return false }
}
const syncAnnouncementHeight = () => {
  if (!import.meta.client) return
  const height = announcementVisible.value && barRef.value ? Math.ceil(barRef.value.getBoundingClientRect().height) : 0
  if (height > 0) {
    document.documentElement.style.setProperty('--home-announcement-height', `${height}px`)
  } else {
    document.documentElement.style.removeProperty('--home-announcement-height')
  }
}
const syncVisibility = (value?: HomeAnnouncement) => {
  announcementVisible.value = Boolean(value) && !isDismissed(value)
  announcementDismissed.value = Boolean(value) && !announcementVisible.value
  void nextTick(syncAnnouncementHeight)
}
const close = () => {
  if (!props.announcement) return
  try { window.localStorage.setItem(dismissedKey(props.announcement), '1') } catch { /* 存储不可用时仍关闭当前页面公告 */ }
  announcementVisible.value = false
  announcementDismissed.value = true
  syncAnnouncementHeight()
}
const open = async () => { if (props.announcement) { await sendEvent('ANNOUNCEMENT', props.announcement, 'CLICK'); await go(props.announcement.actionUrl) } }
watch(() => props.announcement, syncVisibility, { immediate: true })
watch(barRef, (el) => {
  if (!import.meta.client) return
  resizeObserver?.disconnect()
  if (el && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(syncAnnouncementHeight)
    resizeObserver.observe(el)
  }
  syncAnnouncementHeight()
})
onMounted(() => syncVisibility(props.announcement))
onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
  if (import.meta.client) {
    document.documentElement.style.removeProperty('--home-announcement-height')
  }
})
</script>
<style scoped>
.home-announcement {
  min-height: 44px;
  padding: 8px 0;
  background: #f9f4f0;
  color: #161c2d;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.home-announcement__inner {
  width: 100%;
  max-width: 1440px;
  margin: auto;
  padding: 0 clamp(20px, 3vw, 48px);
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.home-announcement__icon {
  width: 22px;
  height: 22px;
  object-fit: contain;
  flex: 0 0 22px;
}

.home-announcement__copy {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  column-gap: 16px;
  row-gap: 2px;
  flex: 0 1 auto;
  min-width: 0;
}

.home-announcement__copy strong,
.home-announcement__copy span {
  min-width: 0;
  max-width: 100%;
  white-space: normal;
  overflow-wrap: break-word;
  word-break: break-word;
  font-family: Inter, sans-serif;
}

.home-announcement__copy strong {
  font-size: 15px;
  font-weight: 500;
  line-height: 22px;
}

.home-announcement__copy span {
  font-size: 14px;
  line-height: 20px;
  opacity: .7;
}

.home-announcement__action {
  display: inline-flex;
  align-items: center;
  flex: none;
  gap: 10px;
  border: 0;
  background: none;
  color: #105446;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 22px;
  white-space: nowrap;
  cursor: pointer;
  padding: 0;
}

.home-announcement__action span {
  font-size: 20px;
  font-weight: 400;
  line-height: 22px;
}

.home-announcement__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 24px;
  height: 24px;
  margin-left: auto;
  border: 0;
  background: transparent;
  color: #161c2d;
  font-size: 22px;
  font-weight: 400;
  line-height: 22px;
  cursor: pointer;
  padding: 0;
  opacity: .7;
}

.home-announcement__close:hover,
.home-announcement__close:focus-visible {
  opacity: 1;
}

@media (max-width: 991px) {
  .home-announcement__inner {
    gap: 12px;
  }

  .home-announcement__copy {
    column-gap: 12px;
  }

  .home-announcement__action {
    gap: 6px;
    margin-inline-start: 4px;
  }
}

@media (max-width: 700px) {
  .home-announcement__inner {
    padding: 0 16px;
  }

  .home-announcement__copy {
    flex: 1 1 auto;
  }
}

.home-announcement--china-sim .home-announcement__icon {
  width: 28px;
  height: 28px;
  flex-basis: 28px;
}

.home-announcement--china-sim .home-announcement__action {
  gap: 4px;
  text-decoration: none;
}

.home-announcement--china-sim .home-announcement__action:hover,
.home-announcement--china-sim .home-announcement__action:focus-visible {
  text-decoration: underline;
}

@media (min-width: 992px) {
  .home-announcement__inner {
    padding-inline-start: 96px;
  }

  .home-announcement__action {
    margin-inline-start: 10px;
  }

  .home-announcement--china-sim .home-announcement__action {
    margin-inline-start: 24px;
  }
}
</style>
