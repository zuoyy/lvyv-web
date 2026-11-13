<template>
  <Teleport to="body">
    <Transition name="activity-share">
      <div v-if="isOpen" class="activity-share-layer" :class="{ 'is-mobile': mobile }" @click.self="close">
        <section
          id="activity-share-panel"
          ref="panel"
          class="activity-share-panel"
          role="dialog"
          :aria-modal="mobile ? 'true' : undefined"
          aria-labelledby="activity-share-title"
          :style="mobile ? undefined : placement"
          tabindex="-1"
        >
          <header class="share-heading">
            <h2 id="activity-share-title">{{ labels.title }}</h2>
            <button ref="closeButton" type="button" class="share-close" :aria-label="labels.close" @click="close">×</button>
          </header>
          <template v-if="view === 'platforms'">
            <button v-if="mobile && systemShareAvailable" class="share-system" type="button" :disabled="sharing" @click="shareSystem">
              <FontAwesomeIcon :icon="faShareNodes" aria-hidden="true" /> {{ labels.system }}
            </button>
            <div class="share-platforms">
              <template v-for="item in platforms" :key="item.id">
                <a v-if="item.href" class="share-platform" :href="item.href" target="_blank" rel="noopener noreferrer">
                  <span class="share-platform-icon" :style="{ color: item.color }">
                    <svg v-if="item.id === 'x'" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-7.4L5.5 22H2.3l7.9-9L.8 2h6.5l4.5 6.8L18.9 2Zm-1.1 18h1.7L6.4 3.9H4.6L17.8 20Z" /></svg>
                    <FontAwesomeIcon v-else :icon="item.icon" aria-hidden="true" />
                  </span>
                  <span>{{ item.label }}</span>
                </a>
                <button v-else type="button" class="share-platform" @click="item.id === 'copy' ? copyLink() : showWechat()">
                  <span class="share-platform-icon" :style="{ color: item.color }"><FontAwesomeIcon :icon="item.icon" aria-hidden="true" /></span>
                  <span>{{ item.label }}</span>
                </button>
              </template>
            </div>
          </template>
          <div v-else class="share-wechat">
            <button class="share-back" type="button" @click="showPlatforms">← {{ labels.back }}</button>
            <p v-if="inWechat && mobile" class="wechat-instruction">↗ {{ labels.wechatHint }}</p>
            <img v-if="qrImage" :src="qrImage" :alt="labels.qr" width="192" height="192" />
            <p v-else role="status">{{ qrFailed ? labels.qrFailed : labels.loading }}</p>
            <button v-if="qrFailed" type="button" class="share-back" @click="generateQr">{{ labels.retry }}</button>
            <p class="share-hint">{{ labels.qrHint }}</p>
          </div>
          <div class="share-link-row">
            <input ref="linkInput" :value="cleanUrl" readonly :aria-label="labels.link" @click="selectLink" />
            <button type="button" @click="copyLink">{{ labels.copy }}</button>
          </div>
          <p class="share-message" role="status" aria-live="polite">{{ message }}</p>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faWeixin, faWeibo, faQq, faWhatsapp, faTelegram, faFacebookF, faLinkedinIn, faRedditAlien } from '@fortawesome/free-brands-svg-icons'
import { faLink, faShareNodes } from '@fortawesome/free-solid-svg-icons'
import { activityShareLabels, activitySharePlatforms, activityPlatformUrl, activityShareUrl, copyActivityLink, shareActivityLink, type ActivityShareData, type ActivitySharePlatform } from '~~/shared/utils/activityShare'

const props = defineProps<ActivityShareData>()
const labels = computed(() => activityShareLabels(props.language))
const cleanUrl = computed(() => activityShareUrl(props.url))
const isOpen = ref(false)
const mobile = ref(false)
const inWechat = ref(false)
const systemShareAvailable = ref(false)
const sharing = ref(false)
const view = ref<'platforms' | 'wechat'>('platforms')
const message = ref('')
const qrImage = ref('')
const qrFailed = ref(false)
const panel = ref<HTMLElement | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)
const linkInput = ref<HTMLInputElement | null>(null)
const placement = ref<Record<string, string>>({})
let anchor: HTMLElement | null = null
let media: MediaQueryList | undefined
let mounted = false
let restoreBody: (() => void) | undefined
let generation = 0

const platforms = computed(() => {
  const options = {
    wechat: { label: labels.value.wechat, icon: faWeixin, color: '#07a64b' },
    weibo: { label: labels.value.weibo, icon: faWeibo, color: '#d52c2b' },
    qq: { label: 'QQ', icon: faQq, color: '#1687ca' },
    whatsapp: { label: 'WhatsApp', icon: faWhatsapp, color: '#128c42' },
    telegram: { label: 'Telegram', icon: faTelegram, color: '#1684b7' },
    facebook: { label: 'Facebook', icon: faFacebookF, color: '#1877f2' },
    x: { label: 'X', icon: faLink, color: '#16201d' },
    linkedin: { label: 'LinkedIn', icon: faLinkedinIn, color: '#0a66c2' },
    reddit: { label: 'Reddit', icon: faRedditAlien, color: '#e53e00' },
    copy: { label: labels.value.copy, icon: faLink, color: '#105446' },
  }
  return activitySharePlatforms(props.language).map((id: ActivitySharePlatform) => ({ id, ...options[id], href: activityPlatformUrl(id, props) }))
})

function positionPanel() {
  if (!isOpen.value || mobile.value || !panel.value || !anchor) return
  const bounds = anchor.getBoundingClientRect()
  const navBottom = document.querySelector('.navbar')?.getBoundingClientRect().bottom || 0
  const minTop = Math.max(8, navBottom + 8)
  const width = Math.min(420, window.innerWidth - 16)
  const naturalHeight = panel.value.scrollHeight + 2
  const roomBelow = Math.max(0, window.innerHeight - bounds.bottom - 16)
  const roomAbove = Math.max(0, bounds.top - minTop - 8)
  const useBelow = naturalHeight <= roomBelow || (naturalHeight > roomAbove && roomBelow >= roomAbove)
  const availableHeight = Math.max(100, useBelow ? roomBelow : roomAbove)
  const height = Math.min(naturalHeight, availableHeight)
  const preferred = useBelow ? bounds.bottom + 8 : bounds.top - height - 8
  placement.value = {
    width: `${width}px`, left: `${Math.max(8, Math.min(bounds.right - width, window.innerWidth - width - 8))}px`,
    top: `${Math.max(minTop, Math.min(preferred, window.innerHeight - height - 8))}px`,
    maxHeight: `${Math.min(availableHeight, window.innerHeight - minTop - 8)}px`,
  }
}

function lockBody() {
  if (!mobile.value || restoreBody) return
  const body = document.body
  const scrollY = window.scrollY
  const previous = { overflow: body.style.overflow, position: body.style.position, top: body.style.top, width: body.style.width }
  const app = document.getElementById('__nuxt')
  const wasInert = app?.hasAttribute('inert') ?? false
  body.style.overflow = 'hidden'
  body.style.position = 'fixed'
  body.style.top = `-${scrollY}px`
  body.style.width = '100%'
  app?.setAttribute('inert', '')
  restoreBody = () => {
    if (!wasInert) app?.removeAttribute('inert')
    Object.assign(body.style, previous)
    window.scrollTo(0, scrollY)
  }
}

function close() {
  if (!isOpen.value) return
  isOpen.value = false
  generation++
  restoreBody?.()
  restoreBody = undefined
  if (anchor?.isConnected) anchor.focus({ preventScroll: true })
}

async function open(event: MouseEvent) {
  if (!(event.currentTarget instanceof HTMLElement)) return
  anchor = event.currentTarget
  mobile.value = window.matchMedia('(max-width: 991px)').matches
  systemShareAvailable.value = typeof navigator.share === 'function'
  inWechat.value = /MicroMessenger/i.test(navigator.userAgent)
  view.value = 'platforms'
  message.value = ''
  isOpen.value = true
  await nextTick()
  if (!isOpen.value) return
  lockBody()
  positionPanel()
  closeButton.value?.focus({ preventScroll: true })
}

function selectLink() { linkInput.value?.focus(); linkInput.value?.select() }

async function copyLink() {
  if (await copyActivityLink(cleanUrl.value, navigator.clipboard)) {
    message.value = labels.value.copied
  } else {
    message.value = labels.value.manualCopy
    await nextTick()
    selectLink()
  }
}

async function shareSystem() {
  if (sharing.value) return
  sharing.value = true
  message.value = ''
  const result = await shareActivityLink(props, data => navigator.share(data))
  if (result === 'failed') message.value = labels.value.shareFailed
  sharing.value = false
}

async function generateQr() {
  const current = ++generation
  const url = cleanUrl.value
  qrImage.value = ''
  qrFailed.value = false
  try {
    const { default: QRCode } = await import('qrcode')
    const image = await QRCode.toDataURL(url, { width: 192, margin: 4, errorCorrectionLevel: 'M' })
    if (current === generation && isOpen.value && url === cleanUrl.value) qrImage.value = image
  } catch { if (current === generation && isOpen.value) qrFailed.value = true }
  await nextTick()
  positionPanel()
}

async function showWechat() {
  view.value = 'wechat'
  message.value = ''
  await nextTick()
  panel.value?.querySelector<HTMLButtonElement>('.share-back')?.focus()
  positionPanel()
  await generateQr()
}
async function showPlatforms() {
  generation++
  view.value = 'platforms'
  await nextTick()
  panel.value?.querySelector<HTMLElement>('.share-platform')?.focus()
  positionPanel()
}

function onKeydown(event: KeyboardEvent) {
  if (!isOpen.value) return
  if (event.key === 'Escape') { event.preventDefault(); close() }
  if (event.key === 'Tab' && mobile.value && panel.value) {
    const elements = [...panel.value.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],input')]
    const first = elements[0], last = elements.at(-1)
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
  }
}
function onScroll(event: Event) {
  if (isOpen.value && !mobile.value && !(event.target instanceof Node && panel.value?.contains(event.target))) close()
}
function onFocusin(event: FocusEvent) {
  if (isOpen.value && !mobile.value && event.target instanceof Node
      && event.target !== anchor && !panel.value?.contains(event.target)) close()
}
function onResize() {
  if (mobile.value !== media?.matches) close()
  mobile.value = media?.matches ?? false
  positionPanel()
}
watch(() => props.url, close)
watch(() => props.language, close)
watch([message, view], async () => { await nextTick(); positionPanel() })
onMounted(() => {
  mounted = true
  media = window.matchMedia('(max-width: 991px)')
  mobile.value = media.matches
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('focusin', onFocusin)
  window.addEventListener('scroll', onScroll, true)
  window.addEventListener('resize', onResize)
})
onBeforeUnmount(() => {
  close()
  if (!mounted) return
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('focusin', onFocusin)
  window.removeEventListener('scroll', onScroll, true)
  window.removeEventListener('resize', onResize)
})
defineExpose({ open, isOpen })
</script>

<style scoped>
.activity-share-layer { position: fixed; inset: 0; z-index: 1300; }
.activity-share-panel { position: fixed; width: 420px; max-width: calc(100vw - 16px); padding: 20px; box-sizing: border-box; overflow-y: auto; border: 1px solid #dce5e0; border-radius: 16px; background: #fff; box-shadow: 0 12px 44px #17352f26; color: #203d33; font: 400 14px/1.5 Inter, sans-serif; }
.share-heading { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 16px; }
.share-heading h2 { margin: 0; font-size: 18px; font-weight: 600; }
.share-close { border: 0; background: #f3f6f4; border-radius: 50%; width: 32px; height: 32px; font-size: 25px; color: #203d33; cursor: pointer; }
.share-platforms { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 16px 4px; }
.share-platform { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 0; border: 0; background: transparent; color: inherit; font: inherit; font-size: 11px; text-decoration: none; cursor: pointer; }
.share-platform-icon { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; background: #f3f6f4; font-size: 24px; transition: background .15s; }
.share-platform-icon svg { width: 24px; height: 24px; }
.share-platform:hover .share-platform-icon { background: #e4eee8; }
.share-link-row { display: flex; gap: 8px; margin-top: 20px; }
.share-link-row input { min-width: 0; width: 100%; border: 1px solid #d5dfd9; border-radius: 8px; padding: 9px 10px; font: inherit; font-size: 12px; color: #53675f; background: #f8faf9; }
.share-link-row button, .share-system { flex-shrink: 0; border: 1px solid #105446; border-radius: 8px; background: #105446; color: #fff; padding: 8px 12px; font: inherit; cursor: pointer; }
.share-message { min-height: 18px; margin: 8px 0 0; font-size: 12px; color: #53675f; }
.share-wechat { text-align: center; }
.share-wechat img { display: block; margin: 12px auto; max-width: 100%; }
.share-back { display: block; border: 0; padding: 6px 0; color: #105446; background: transparent; font: inherit; cursor: pointer; text-align: left; }
.share-hint { margin: 8px 0; font-size: 13px; color: #53675f; }
.wechat-instruction { padding: 12px; background: #eff6ed; border-radius: 8px; }
.share-system { width: 100%; margin-bottom: 20px; min-height: 44px; }
.share-system:disabled { opacity: .6; cursor: wait; }
.activity-share-panel :is(a, button, input):focus-visible { outline: 2px solid #105446; outline-offset: 3px; }
.is-mobile { background: #142b2470; }
.is-mobile .activity-share-panel { bottom: 0; left: 0; width: 100%; max-width: none; max-height: calc(100dvh - 72px); padding: 20px 20px calc(20px + env(safe-area-inset-bottom)); border-radius: 20px 20px 0 0; overscroll-behavior: contain; }
.is-mobile .share-platforms { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px 8px; }
.is-mobile .share-close { width: 44px; height: 44px; }
.is-mobile .share-link-row button { min-height: 44px; }
.activity-share-enter-active, .activity-share-leave-active { transition: opacity .18s ease; }
.activity-share-enter-active .activity-share-panel, .activity-share-leave-active .activity-share-panel { transition: transform .18s ease; }
.activity-share-enter-from, .activity-share-leave-to { opacity: 0; }
.activity-share-enter-from.is-mobile .activity-share-panel, .activity-share-leave-to.is-mobile .activity-share-panel { transform: translateY(24px); }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none !important; } }
</style>
