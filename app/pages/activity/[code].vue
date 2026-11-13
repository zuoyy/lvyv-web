<template>
  <div class="activity-page-shell" :lang="pageLanguage">
    <!-- 微信分享抓取兜底隐藏图 -->
    <div v-if="activity?.shareImageUrl" class="wx-hidden-share">
      <img :src="activity.shareImageUrl" alt="share-preview" />
    </div>

    <!-- 正常活动内容展示 -->
    <main v-if="activity && !error" class="activity-main-container">
      <div class="activity-share-dock">
        <button class="activity-share-trigger" type="button" aria-haspopup="dialog" :aria-expanded="sharePanel?.isOpen || false" aria-controls="activity-share-panel" @click="openShare">
          <FontAwesomeIcon :icon="faShareNodes" aria-hidden="true" /> {{ shareLabels.share }}
        </button>
      </div>
      <!-- 顶部：活动富文本内容 -->
      <section class="activity-top-section">
        <article class="activity-rich-content" v-html="renderedContent" />
      </section>

      <!-- 中部：当前活动选中的多个客服及其二维码 -->
      <section v-if="activity.staffList && activity.staffList.length > 0" class="activity-mid-section">
        <div class="staff-header">
          <div class="staff-header-tag">{{ labels.serviceTag }}</div>
          <h2 class="staff-header-title">{{ labels.serviceTitle }}</h2>
          <p class="staff-header-subtitle">{{ labels.serviceSubtitle }}</p>
        </div>

        <div class="staff-cards-wrapper" :class="{ 'single-staff': activity.staffList.length === 1 }">
          <div
            v-for="staff in activity.staffList"
            :key="staff.id"
            class="staff-card"
          >
            <div class="staff-info">
              <h3 class="staff-name">{{ staff.name }}</h3>
              <div v-if="staffContact(staff)" class="staff-wechat-row">
                <span class="wechat-label">{{ labels.contactLabel }}</span>
                <span class="wechat-val">{{ staffContact(staff) }}</span>
                <button type="button" class="copy-wechat-btn" @click="copyContact(staffContact(staff))">
                  {{ labels.copy }}
                </button>
              </div>
            </div>

            <!-- 二维码大图 -->
            <div class="staff-qrcode-container">
              <img
                :src="staff.qrcodeUrl"
                :alt="labels.qrAlt(staff.name)"
                class="staff-qrcode-img"
              />
            </div>
            <a v-if="staff.email?.trim()" class="staff-email" :href="`mailto:${encodeURIComponent(staff.email.trim())}`" :aria-label="`${labels.email}: ${staff.email.trim()}`">
              <FontAwesomeIcon :icon="faEnvelope" aria-hidden="true" />
              <span>{{ staff.email.trim() }}</span>
            </a>
          </div>
        </div>
      </section>

      <!-- 推荐板块：客服下方，类似 9 宫格展示，多了可以左右滑动；系统随机推荐，没有不展示 -->
      <section v-if="activity.recommendList && activity.recommendList.length > 0" class="activity-recommend-section">
        <div class="recommend-header">
          <div class="recommend-header-left">
            <span class="recommend-tag">{{ labels.recommendTag }}</span>
            <h2 class="recommend-title">{{ labels.recommendTitle }}</h2>
            <p class="recommend-subtitle">{{ labels.recommendSubtitle }}</p>
          </div>
          <div v-if="recommendPages.length > 1" class="recommend-header-nav">
            <span class="swipe-hint">{{ labels.swipeHint }}</span>
          </div>
        </div>

        <!-- 类似九宫格容器：多了可横向滑动切换 -->
        <div class="recommend-carousel-wrapper">
          <div ref="sliderRef" class="recommend-slider" @scroll="handleSliderScroll">
            <div
              v-for="(page, pageIdx) in recommendPages"
              :key="pageIdx"
              class="recommend-grid-page"
              :class="{ 'recommend-grid-page--incomplete': page.length < 3 }"
            >
              <NuxtLink
                v-for="item in page"
                :key="item.activityCode"
                :to="`/activity/${encodeURIComponent(item.activityCode)}`"
                class="recommend-card"
              >
                <div class="recommend-card-image-box">
                  <img
                    :src="item.shareImageUrl || '/images/common/logo.png'"
                    :alt="item.shareTitle || item.title"
                    class="recommend-card-img"
                    loading="lazy"
                  />
                  <span class="recommend-card-badge">{{ labels.recommendBadge }}</span>
                </div>
                <div class="recommend-card-info">
                  <h3 class="recommend-card-title">{{ item.shareTitle || item.title }}</h3>
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- 分页指示点（当超过 9 个有多页时展示） -->
          <div v-if="recommendPages.length > 1" class="recommend-indicators">
            <button
              v-for="(_, idx) in recommendPages"
              :key="idx"
              type="button"
              class="indicator-dot"
              :class="{ active: currentGridPage === idx }"
              :aria-label="labels.recommendPage(idx + 1)"
              @click="scrollToPage(idx)"
            />
          </div>
        </div>
      </section>
    </main>

    <!-- 错误或已下线空状态 -->
    <div v-else class="activity-empty-state">
      <div class="empty-state-box">
        <div class="empty-icon-circle">
          <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2 class="empty-title">{{ unavailable ? labels.unavailableTitle : labels.errorTitle }}</h2>
        <p class="empty-desc">{{ unavailable ? labels.unavailableDescription : labels.errorDescription }}</p>
        <NuxtLink to="https://www.lvyv.com/" external class="empty-back-home">
          {{ labels.home }}
        </NuxtLink>
      </div>
    </div>

    <!-- 底部：官网左下角现有版权与备案信息 -->
    <BrandCopyrightFooter />

    <ActivitySharePanel
      v-if="activity && !error"
      ref="sharePanel"
      :url="canonicalUrl"
      :title="activity.shareTitle"
      :description="activity.shareDesc"
      :image-url="shareImageUrl"
      :language="pageLanguage"
    />

    <!-- 联系方式复制反馈 -->
    <transition name="fade">
      <div v-if="toastMessage" class="activity-toast">
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faEnvelope, faShareNodes } from '@fortawesome/free-solid-svg-icons';
import ActivitySharePanel from '~/components/activity/ActivitySharePanel.vue';
import { activityShareLabels } from '~~/shared/utils/activityShare';
import { activityPageLabels, isChineseActivityLanguage } from '~~/shared/utils/activityLocale';
import BrandCopyrightFooter from '~/components/common/BrandCopyrightFooter.vue';
import { LUXURY_ORIGIN } from '~~/shared/utils/luxurySite';

definePageMeta({
  layout: 'default',
  // 推荐活动使用相同路由组件，编码变化时重新初始化请求和轮播状态。
  key: route => String(route.params.code),
});

interface PublicStaff {
  id: number;
  name: string;
  qrcodeUrl: string;
  avatarUrl?: string;
  wechatId?: string;
  whatsapp?: string | null;
  email?: string | null;
}

interface RecommendActivity {
  activityCode: string;
  title: string;
  shareTitle: string;
  shareImageUrl: string;
}

interface ActivityPublicData {
  activityCode: string;
  language?: string | null;
  shareTitle: string;
  shareDesc?: string;
  shareImageUrl: string;
  contentHtml: string;
  staffList: PublicStaff[];
  recommendList?: RecommendActivity[];
}

const route = useRoute();
const config = useRuntimeConfig();
const activityCode = String(route.params.code || '');

const apiBase = String(
  import.meta.server ? config.contentApiBase : config.public.apiBase || '/web-api'
).replace(/\/$/, '');

const { data: apiResponse, error } = await useFetch<{ code: number; data: ActivityPublicData; msg?: string }>(
  () => `${apiBase}/luxury/activity/${encodeURIComponent(activityCode)}`,
  {
    key: `luxury-activity-${activityCode}`,
    timeout: 10_000,
    retry: 0,
    getCachedData: (key, nuxtApp) => nuxtApp.isHydrating ? nuxtApp.payload.data[key] : undefined,
  }
);

const activity = computed(() => {
  if (error.value || !apiResponse.value || (apiResponse.value.code !== 200 && apiResponse.value.code !== 0)) {
    return null;
  }
  return apiResponse.value.data;
});

// 业务下线与接口故障分开返回，避免将临时故障标记为永久不存在。
const unavailable = computed(() => {
  const errorData = error.value?.data as { code?: number } | undefined;
  return [1013002001, 1013002002].includes(apiResponse.value?.code ?? errorData?.code ?? 0)
    || error.value?.statusCode === 404;
});
if (import.meta.server && !activity.value) {
  const event = useRequestEvent();
  if (event) setResponseStatus(event, unavailable.value ? 404 : 503);
}
const canonicalUrl = `${LUXURY_ORIGIN}/activity/${encodeURIComponent(activityCode)}`;
const shareImageUrl = computed(() => new URL(activity.value?.shareImageUrl || '/images/common/logo.png', LUXURY_ORIGIN).href);

const pageLanguage = computed(() => isChineseActivityLanguage(activity.value?.language) ? 'zh-CN' : 'en');
const labels = computed(() => activityPageLabels(pageLanguage.value));
const staffContact = (staff: PublicStaff) => (pageLanguage.value === 'zh-CN' ? staff.wechatId : staff.whatsapp)?.trim() || '';
const shareLabels = computed(() => activityShareLabels(pageLanguage.value));
const sharePanel = ref<InstanceType<typeof ActivitySharePanel> | null>(null);
const openShare = (event: MouseEvent) => sharePanel.value?.open(event);

// 九宫格推荐分页：每页最多 9 个，超出 9 个自动横向分页滑动
const PAGE_SIZE = 9;
const sliderRef = ref<HTMLElement | null>(null);
const currentGridPage = ref(0);

const recommendPages = computed(() => {
  const list = activity.value?.recommendList || [];
  if (!list.length) return [];
  const pages: RecommendActivity[][] = [];
  for (let i = 0; i < list.length; i += PAGE_SIZE) {
    pages.push(list.slice(i, i + PAGE_SIZE));
  }
  return pages;
});

const handleSliderScroll = () => {
  if (!sliderRef.value) return;
  const { scrollLeft, clientWidth } = sliderRef.value;
  if (clientWidth > 0) {
    currentGridPage.value = Math.round(scrollLeft / clientWidth);
  }
};

const scrollToPage = (idx: number) => {
  if (!sliderRef.value) return;
  sliderRef.value.scrollTo({
    left: idx * sliderRef.value.clientWidth,
    behavior: 'smooth',
  });
};

// 设置微信分享与页面元信息
useSeoMeta({
  title: () => activity.value?.shareTitle || labels.value.metaTitle,
  description: () => activity.value?.shareDesc || labels.value.metaDescription,
  ogTitle: () => activity.value?.shareTitle || labels.value.metaTitle,
  ogDescription: () => activity.value?.shareDesc || labels.value.metaDescription,
  ogImage: () => shareImageUrl.value,
  ogUrl: canonicalUrl,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  robots: () => activity.value ? 'index, follow' : 'noindex, nofollow',
  twitterTitle: () => activity.value?.shareTitle || labels.value.metaTitle,
  twitterDescription: () => activity.value?.shareDesc || '',
  twitterImage: () => shareImageUrl.value,
});

useHead({
  htmlAttrs: { lang: pageLanguage },
  link: [{ rel: 'canonical', href: canonicalUrl }],
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
  ],
});

// 富文本渲染：支持原生 HTML 标签与基础 Markdown 混排解析，并优化移动端长图渲染
const renderedContent = computed(() => {
  const raw = activity.value?.contentHtml || '';
  if (!raw) return '';

  let html = raw;

  // 1. 将 Markdown 图片语法统一转换为带 lazy 属性的高性能 img 标签
  html = html.replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2" loading="lazy" decoding="async" />');
  // 2. 将 Markdown 标题与样式语法转换
  html = html
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // 3. 如果原本不含块级 HTML 标签，补充段落换行处理
  if (!/<(p|div|h[1-6]|ul|ol|table|blockquote)/i.test(raw)) {
    html = html
      .replace(/\n\n+/gim, '</p><p>')
      .replace(/\n/gim, '<br />');
    return `<p>${html}</p>`;
  }

  return html;
});

// 复制当前活动语言对应的联系方式，不使用其他渠道的号码兜底。
const toastMessage = ref('');
let toastTimer: any = null;

const copyContact = async (contact: string) => {
  try {
    await navigator.clipboard.writeText(contact);
    showToast(labels.value.copiedContact);
  } catch {
    showToast(labels.value.copyContactManually);
  }
};

const showToast = (msg: string) => {
  toastMessage.value = msg;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastMessage.value = '';
  }, 2200);
};
</script>

<style scoped>
.activity-page-shell {
  min-height: 100vh;
  padding-top: 104px;
  box-sizing: border-box;
  background-color: #f7f9f8;
  color: #1a2a24;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: flex;
  flex-direction: column;
}

.activity-share-dock {
  position: fixed;
  top: 104px;
  left: calc(50% + 290px);
  z-index: 900;
}

.activity-share-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 32px;
  padding: 4px 13px;
  border: 1px solid #cbdcd3;
  border-radius: 18px;
  background: #f1f6f3;
  color: #105446;
  font: 500 13px/1.4 Inter, sans-serif;
  cursor: pointer;
}

.activity-share-trigger:hover { background: #e4eee8; }
.activity-share-trigger:focus-visible { outline: 2px solid #105446; outline-offset: 3px; }

.wx-hidden-share {
  position: absolute;
  top: -9999px;
  left: -9999px;
  width: 0;
  height: 0;
  overflow: hidden;
}

.activity-main-container {
  flex: 1;
  max-width: 540px;
  width: 100%;
  margin: 0 auto;
  padding: 0 0 48px;
  box-sizing: border-box;
}

/* 顶部富文本展示区：纯净自然展示，不放在卡片中 */
.activity-top-section {
  background: transparent;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
  margin-bottom: 24px;
  width: 100%;
}

.activity-rich-content {
  font-size: 16px;
  line-height: 1.85;
  color: #2c3e35;
  word-break: break-word;
}

.activity-rich-content :deep(h1) {
  font-size: 1.65rem;
  font-weight: 700;
  color: #123026;
  margin: 20px 0 16px;
  padding: 0 16px;
}

.activity-rich-content :deep(h2) {
  font-size: 1.4rem;
  font-weight: 600;
  color: #123026;
  margin: 24px 16px 14px;
  border-left: 4px solid #1a5643;
  padding-left: 10px;
}

.activity-rich-content :deep(h3) {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a382e;
  margin: 18px 0 12px;
  padding: 0 16px;
}

.activity-rich-content :deep(p) {
  margin: 0;
  color: #364d42;
}

.activity-rich-content :deep(p:not(:has(img))) {
  padding: 0 16px;
  margin-bottom: 14px;
}

.activity-rich-content :deep(p:has(img)) {
  margin: 0 !important;
  padding: 0 !important;
  line-height: 0;
}

/* 图片专属样式：专为手机页面设计，满宽全屏贴边，不包裹在卡片中 */
.activity-rich-content :deep(img) {
  width: 100% !important;
  max-width: 100% !important;
  height: auto !important;
  border-radius: 0 !important;
  margin: 0 auto !important;
  display: block;
  box-shadow: none !important;
  object-fit: contain;
  /* 允许微信/Safari长按图片唤起保存或识别二维码菜单 */
  -webkit-touch-callout: default !important;
  user-select: auto;
}

.activity-rich-content :deep(ul),
.activity-rich-content :deep(ol) {
  padding-left: 36px;
  padding-right: 16px;
  margin-bottom: 16px;
}

.activity-rich-content :deep(li) {
  margin-bottom: 6px;
}

.activity-rich-content :deep(blockquote) {
  margin: 20px 16px;
  padding: 14px 18px;
  background: #f1f7f4;
  border-left: 4px solid #3d8870;
  border-radius: 0 8px 8px 0;
  color: #275243;
  font-style: italic;
}

/* 中部客服区域 */
.activity-mid-section {
  background: #ffffff;
  border-radius: 16px;
  padding: 32px 20px;
  box-shadow: 0 4px 20px rgba(18, 48, 38, 0.05);
  margin: 0 16px 32px;
}

.staff-header {
  text-align: center;
  margin-bottom: 28px;
}

.staff-header-tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #1a5643;
  background: rgba(26, 86, 67, 0.08);
  padding: 4px 10px;
  border-radius: 20px;
  margin-bottom: 8px;
}

.staff-header-title {
  font-size: 1.45rem;
  font-weight: 700;
  color: #123026;
  margin: 0 0 8px;
}

.staff-header-subtitle {
  font-size: 0.92rem;
  color: #647a70;
  margin: 0;
}

.staff-cards-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.staff-cards-wrapper.single-staff {
  grid-template-columns: 1fr;
  max-width: 280px;
  margin: 0 auto;
}

.staff-card {
  background: #fbfdfc;
  border: 1px solid #e3ede8;
  border-radius: 12px;
  padding: 16px 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.staff-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(26, 86, 67, 0.08);
}

.staff-info {
  margin-bottom: 12px;
  width: 100%;
}

.staff-name {
  font-size: 0.98rem;
  font-weight: 600;
  color: #123026;
  margin: 0 0 4px;
  line-height: 1.35;
  word-break: break-word;
}

.staff-wechat-row {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  font-size: 0.76rem;
  color: #556c62;
  gap: 4px;
}

.wechat-label {
  color: #7b9187;
}

.wechat-val {
  font-weight: 500;
  color: #1a5643;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.copy-wechat-btn {
  background: #edf5f1;
  color: #1a5643;
  border: none;
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.copy-wechat-btn:hover {
  background: #dbeef3;
}

.staff-qrcode-container {
  background: #ffffff;
  padding: 8px;
  border-radius: 10px;
  border: 1px solid #e1eee7;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 140px;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.staff-qrcode-img {
  width: 100%;
  max-width: 120px;
  aspect-ratio: 1 / 1;
  height: auto;
  object-fit: contain;
  display: block;
  border-radius: 4px;
}

.staff-email {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  max-width: 100%;
  margin-top: 10px;
  color: #1a5643;
  font-size: 12px;
  overflow-wrap: anywhere;
  text-decoration: none;
}

.staff-email svg { flex-shrink: 0; width: 1em; height: 1em; }
.staff-email span { min-width: 0; }

/* 推荐板块样式 */
.activity-recommend-section {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px 20px 20px;
  box-shadow: 0 4px 20px rgba(18, 48, 38, 0.05);
  margin-top: 24px;
}

.recommend-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 16px;
}

.recommend-tag {
  display: inline-block;
  font-size: 10px;
  letter-spacing: 1.5px;
  color: #bfa054;
  font-weight: 700;
  margin-bottom: 4px;
}

.recommend-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #123026;
  margin: 0 0 4px;
}

.recommend-subtitle {
  font-size: 0.82rem;
  color: #647a70;
  margin: 0;
}

.swipe-hint {
  font-size: 11px;
  color: #8fa59c;
  background: #f4f7f5;
  padding: 4px 10px;
  border-radius: 12px;
  white-space: nowrap;
}

.recommend-carousel-wrapper {
  position: relative;
  width: 100%;
}

.recommend-slider {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.recommend-slider::-webkit-scrollbar {
  display: none;
}

.recommend-grid-page {
  flex: 0 0 100%;
  width: 100%;
  scroll-snap-align: start;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px 10px;
  align-items: start;
  box-sizing: border-box;
}

/* 末页不足一行时保持卡片宽度，并将卡片整体居中，避免贴在左侧造成布局断裂。 */
.recommend-grid-page--incomplete {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
}

.recommend-grid-page--incomplete .recommend-card {
  flex: 0 0 calc((100% - 20px) / 3);
}

.recommend-card {
  display: flex;
  flex-direction: column;
  background: #fbfcfb;
  border: 1px solid #edf1ee;
  border-radius: 10px;
  overflow: hidden;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}

.recommend-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(18, 48, 38, 0.08);
}

.recommend-card:active {
  transform: scale(0.98);
}

.recommend-card-image-box {
  position: relative;
  width: 100%;
  padding-top: 75%; /* 4:3 比例 */
  background: #eef2ef;
  overflow: hidden;
}

.recommend-card-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.recommend-card:hover .recommend-card-img {
  transform: scale(1.05);
}

.recommend-card-badge {
  position: absolute;
  top: 6px;
  left: 6px;
  font-size: 9px;
  color: #ffffff;
  background: rgba(18, 48, 38, 0.75);
  backdrop-filter: blur(4px);
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.recommend-card-info {
  padding: 8px 6px 10px;
  display: flex;
  align-items: center;
  flex: 0 0 auto;
}

.recommend-card-title {
  font-size: 12px;
  line-height: 1.4;
  color: #1a382e;
  font-weight: 500;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
}

/* 分页指示点 */
.recommend-indicators {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 14px;
}

.indicator-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d8e0dc;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.25s ease;
}

.indicator-dot.active {
  width: 16px;
  border-radius: 4px;
  background: #1a5643;
}

/* 空状态 / 下线状态 */
.activity-empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.empty-state-box {
  max-width: 440px;
  text-align: center;
  background: #ffffff;
  border-radius: 16px;
  padding: 40px 24px;
  box-shadow: 0 4px 20px rgba(18, 48, 38, 0.05);
}

.empty-icon-circle {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: #fdf3f2;
  color: #e25442;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.empty-title {
  font-size: 1.35rem;
  font-weight: 600;
  color: #123026;
  margin: 0 0 10px;
}

.empty-desc {
  font-size: 0.95rem;
  color: #647a70;
  line-height: 1.6;
  margin: 0 0 24px;
}

.empty-back-home {
  display: inline-block;
  background: #1a5643;
  color: #ffffff;
  padding: 12px 28px;
  border-radius: 24px;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.2s;
}

.empty-back-home:hover {
  background: #124032;
}

/* Toast 提示 */
.activity-toast {
  position: fixed;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(18, 48, 38, 0.9);
  color: #ffffff;
  padding: 10px 18px;
  border-radius: 20px;
  font-size: 13px;
  z-index: 9999;
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 991px) {
  .activity-page-shell {
    padding-top: calc(var(--mobile-navbar-height, 60px) + 16px);
  }
  .activity-share-dock {
    top: auto;
    left: auto;
    right: calc(16px + env(safe-area-inset-right, 0px));
    bottom: calc(24px + env(safe-area-inset-bottom, 0px));
  }
  .activity-share-trigger {
    min-height: 44px;
    padding: 8px 16px;
    border-color: rgba(178, 201, 188, .65);
    border-radius: 24px;
    background: rgba(241, 246, 243, .72);
    box-shadow: 0 4px 18px rgba(18, 48, 38, .12);
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
  }
  .activity-share-trigger:hover { background: rgba(228, 238, 232, .85); }
}

@media (max-width: 640px) {
  .activity-main-container {
    padding: 0 0 36px;
    max-width: 100%;
  }
  .activity-top-section {
    padding: 0;
    border-radius: 0;
    margin-bottom: 20px;
  }
  .activity-rich-content :deep(img) {
    margin: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }
  .activity-mid-section {
    margin: 0 10px 24px;
    padding: 20px 12px;
    border-radius: 12px;
  }
  .staff-cards-wrapper {
    gap: 8px;
  }
  .staff-card {
    padding: 12px 6px;
  }
  .staff-name {
    font-size: 0.9rem;
  }
  .staff-qrcode-container {
    padding: 6px;
    max-width: 130px;
  }
  .staff-qrcode-img {
    max-width: 110px;
  }
  .activity-recommend-section {
    margin: 18px 10px 0;
    padding: 18px 10px 14px;
    border-radius: 12px;
  }
  .recommend-title {
    font-size: 1.15rem;
  }
  .recommend-grid-page {
    gap: 8px 6px;
  }
  .recommend-grid-page--incomplete {
    gap: 6px;
  }
  .recommend-grid-page--incomplete .recommend-card {
    flex-basis: calc((100% - 12px) / 3);
  }
  .recommend-card-title {
    font-size: 11px;
    line-height: 1.35;
  }
  .recommend-card-info {
    padding: 6px 4px 8px;
  }
}
</style>
