<template>
  <div class="activity-page-shell">
    <!-- 微信分享抓取兜底隐藏图 -->
    <div v-if="activity?.shareImageUrl" class="wx-hidden-share">
      <img :src="activity.shareImageUrl" alt="share-preview" />
    </div>

    <!-- 正常活动内容展示 -->
    <main v-if="activity && !error" class="activity-main-container">
      <!-- 顶部：活动富文本内容 -->
      <section class="activity-top-section">
        <article class="activity-rich-content" v-html="renderedContent" />
      </section>

      <!-- 中部：当前活动选中的多个客服及其二维码 -->
      <section v-if="activity.staffList && activity.staffList.length > 0" class="activity-mid-section">
        <div class="staff-header">
          <div class="staff-header-tag">EXCLUSIVE SERVICE</div>
          <h2 class="staff-header-title">专属高奢旅行顾问</h2>
          <p class="staff-header-subtitle">长按识别下方二维码，开启一对一私享定制规划</p>
        </div>

        <div class="staff-cards-wrapper" :class="{ 'single-staff': activity.staffList.length === 1 }">
          <div
            v-for="staff in activity.staffList"
            :key="staff.id"
            class="staff-card"
          >
            <div class="staff-info">
              <h3 class="staff-name">{{ staff.name }}</h3>
              <div v-if="staff.wechatId" class="staff-wechat-row">
                <span class="wechat-label">微信号：</span>
                <span class="wechat-val">{{ staff.wechatId }}</span>
                <button type="button" class="copy-wechat-btn" @click="copyWechat(staff.wechatId)">
                  复制
                </button>
              </div>
            </div>

            <!-- 二维码大图 -->
            <div class="staff-qrcode-container">
              <img
                :src="staff.qrcodeUrl"
                :alt="staff.name + '二维码'"
                class="staff-qrcode-img"
              />
              <div class="qrcode-scan-hint">微信长按二维码添加</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 推荐板块：客服下方，类似 9 宫格展示，多了可以左右滑动；系统随机推荐，没有不展示 -->
      <section v-if="activity.recommendList && activity.recommendList.length > 0" class="activity-recommend-section">
        <div class="recommend-header">
          <div class="recommend-header-left">
            <span class="recommend-tag">EXCLUSIVE RECOMMENDATION</span>
            <h2 class="recommend-title">更多精选行程</h2>
            <p class="recommend-subtitle">探索更多专属高奢私享活动与秘境旅程</p>
          </div>
          <div v-if="recommendPages.length > 1" class="recommend-header-nav">
            <span class="swipe-hint">左右滑动浏览</span>
          </div>
        </div>

        <!-- 类似九宫格容器：多了可横向滑动切换 -->
        <div class="recommend-carousel-wrapper">
          <div ref="sliderRef" class="recommend-slider" @scroll="handleSliderScroll">
            <div
              v-for="(page, pageIdx) in recommendPages"
              :key="pageIdx"
              class="recommend-grid-page"
            >
              <NuxtLink
                v-for="item in page"
                :key="item.activityCode"
                :to="`/luxury/activity/${encodeURIComponent(item.activityCode)}`"
                class="recommend-card"
              >
                <div class="recommend-card-image-box">
                  <img
                    :src="item.shareImageUrl || '/images/common/logo.png'"
                    :alt="item.shareTitle || item.title"
                    class="recommend-card-img"
                    loading="lazy"
                  />
                  <span class="recommend-card-badge">特邀私享</span>
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
              :aria-label="`切换到第${idx + 1}组推荐`"
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
        <h2 class="empty-title">活动已下线或不存在</h2>
        <p class="empty-desc">该运营活动已结束或链接无效，您可以返回官网探索更多精彩高奢旅程。</p>
        <NuxtLink to="/" class="empty-back-home">
          前往官网首页
        </NuxtLink>
      </div>
    </div>

    <!-- 底部：官网左下角现有版权与备案信息 -->
    <BrandCopyrightFooter />

    <!-- 微信号复制成功 Toast -->
    <transition name="fade">
      <div v-if="toastMessage" class="activity-toast">
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import BrandCopyrightFooter from '~/components/common/BrandCopyrightFooter.vue';

definePageMeta({
  layout: false,
});

interface PublicStaff {
  id: number;
  name: string;
  qrcodeUrl: string;
  avatarUrl?: string;
  wechatId?: string;
}

interface RecommendActivity {
  activityCode: string;
  title: string;
  shareTitle: string;
  shareImageUrl: string;
}

interface ActivityPublicData {
  activityCode: string;
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
  }
);

const activity = computed(() => {
  if (error.value || !apiResponse.value || (apiResponse.value.code !== 200 && apiResponse.value.code !== 0)) {
    return null;
  }
  return apiResponse.value.data;
});

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
  title: () => activity.value?.shareTitle || 'Lvyv 高奢旅行',
  description: () => activity.value?.shareDesc || 'Lvyv 专属高奢定制旅行',
  ogTitle: () => activity.value?.shareTitle || 'Lvyv 高奢旅行',
  ogDescription: () => activity.value?.shareDesc || 'Lvyv 专属高奢定制旅行',
  ogImage: () => activity.value?.shareImageUrl || '/images/common/logo.png',
  twitterTitle: () => activity.value?.shareTitle || 'Lvyv 高奢旅行',
  twitterDescription: () => activity.value?.shareDesc || '',
  twitterImage: () => activity.value?.shareImageUrl || '',
});

useHead({
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

// 复制微信号 Toast
const toastMessage = ref('');
let toastTimer: any = null;

const copyWechat = async (wechatId: string) => {
  try {
    await navigator.clipboard.writeText(wechatId);
    showToast(`微信号【${wechatId}】已复制到剪贴板`);
  } catch {
    showToast(`请长按微信号进行复制`);
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
  background-color: #f7f9f8;
  color: #1a2a24;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: flex;
  flex-direction: column;
}

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
  max-width: 860px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 16px 48px;
  box-sizing: border-box;
}

/* 顶部富文本样式 */
.activity-top-section {
  background: #ffffff;
  border-radius: 16px;
  padding: 28px 24px;
  box-shadow: 0 4px 20px rgba(18, 48, 38, 0.05);
  margin-bottom: 32px;
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
}

.activity-rich-content :deep(h2) {
  font-size: 1.4rem;
  font-weight: 600;
  color: #123026;
  margin: 24px 0 14px;
  border-left: 4px solid #1a5643;
  padding-left: 10px;
}

.activity-rich-content :deep(h3) {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a382e;
  margin: 18px 0 12px;
}

.activity-rich-content :deep(p) {
  margin: 0 0 16px;
  color: #364d42;
}

.activity-rich-content :deep(img) {
  width: 100% !important;
  max-width: 100% !important;
  height: auto !important;
  border-radius: 12px;
  margin: 16px auto;
  display: block;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  object-fit: contain;
  /* 允许微信/Safari长按图片唤起保存或识别二维码菜单 */
  -webkit-touch-callout: default !important;
  user-select: auto;
}

.activity-rich-content :deep(ul),
.activity-rich-content :deep(ol) {
  padding-left: 24px;
  margin-bottom: 16px;
}

.activity-rich-content :deep(li) {
  margin-bottom: 6px;
}

.activity-rich-content :deep(blockquote) {
  margin: 20px 0;
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
  margin-bottom: 32px;
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

.qrcode-scan-hint {
  font-size: 11px;
  color: #7b9187;
  margin-top: 6px;
  white-space: nowrap;
}

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
  box-sizing: border-box;
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
  flex: 1;
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

@media (max-width: 640px) {
  .activity-main-container {
    padding: 12px 10px 32px;
  }
  .activity-top-section {
    padding: 14px 10px;
    border-radius: 12px;
  }
  .activity-rich-content :deep(img) {
    margin: 8px auto;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
  .activity-mid-section {
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
    padding: 18px 10px 14px;
    border-radius: 12px;
    margin-top: 18px;
  }
  .recommend-title {
    font-size: 1.15rem;
  }
  .recommend-grid-page {
    gap: 8px 6px;
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
