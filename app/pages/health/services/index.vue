<template>
  <main class="health-experience health-catalog">
    <section class="catalog-hero">
      <h1>HEALTH CHECKUPS</h1>
      <p>
        Choose a checkup based on how much time you have and how comprehensive you<br class="desktop-break"> want the assessment to be.
      </p>
    </section>

    <div class="catalog-shell">
      <div v-if="loading && (!services || !services.length)" class="health-state" role="status">
        Loading care services...
      </div>
      <div v-else-if="error && (!services || !services.length)" class="health-state health-error" role="alert">
        {{ error?.message || 'Unable to load care services.' }}
        <button type="button" class="retry-btn" @click="() => refresh()">Try again</button>
      </div>
      <div v-else-if="!services || !services.length" class="health-state">
        No services available.
      </div>
      <div v-else class="services-grid" aria-label="Health checkup services">
        <article
          v-for="(service, index) in services"
          :key="service.serviceCode"
          class="service-card"
        >
          <NuxtLink
            :to="'/health/services/' + service.serviceCode"
            class="service-image-link"
            tabindex="-1"
            aria-hidden="true"
          >
            <img
              :src="getServiceImage(service, index)"
              :alt="service.title"
              class="service-image"
              loading="lazy"
              @error="failedImages.add(service.serviceCode)"
            >
          </NuxtLink>

          <div class="service-content">
            <h2 class="service-title">
              <NuxtLink :to="'/health/services/' + service.serviceCode">
                {{ service.title }}
              </NuxtLink>
            </h2>

            <p class="service-meta">
              {{ formatMeta(service) }}
            </p>

            <div class="service-footer">
              <div class="service-price">
                <span class="price-from">From</span>
                <strong class="price-amount">{{ formatPrice(service.startingPrice) }}</strong>
              </div>

              <NuxtLink
                :to="'/health/services/' + service.serviceCode"
                class="service-details-link"
              >
                <span>View details</span>
                <span class="link-arrow" aria-hidden="true">→</span>
              </NuxtLink>
            </div>
          </div>
        </article>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { HealthServiceSummary } from '~/composables/useHealthCare'

const health = useHealthCare()
const failedImages = reactive(new Set<string>())

// 使用 useAsyncData 进行服务端/首屏数据直出，刷新时直接渲染真实数据，彻底删除默认数据避免闪烁
const { data: services, status, error, refresh } = await useAsyncData<HealthServiceSummary[]>(
  'health-services',
  () => health.listServices(),
  { default: () => [] }
)

const loading = computed(() => status.value === 'pending')

const formatPrice = (value: number) => '$' + Number(value).toLocaleString('en-US', { maximumFractionDigits: 2 })

const formatMeta = (service: HealthServiceSummary) => {
  const parts: string[] = []
  if (service.cityName) parts.push(service.cityName)
  if (service.durationLabel) parts.push(service.durationLabel)
  if (service.supportLanguages) {
    const lang = service.supportLanguages.includes('English') ? 'English support' : service.supportLanguages
    parts.push(lang)
  }
  return parts.join(' . ')
}

const getServiceImage = (service: HealthServiceSummary, index: number) => {
  if (service.imageUrl && !failedImages.has(service.serviceCode)) {
    return service.imageUrl
  }
  return `/images/health/services/service-${(index % 6) + 1}.webp`
}

useLvyvSeo({
  title: 'Health Checkups | LVYV Care',
  description: 'Explore planned health checkups in China with English-speaking coordination.',
  path: '/health/services'
})
</script>

<style scoped>
.health-catalog {
  background: #ffffff;
  padding-top: 109px;
  padding-bottom: 160px;
  min-height: 100vh;
  box-sizing: border-box;
}

/* Banner remains unchanged */
.catalog-hero {
  height: 260px;
  padding: 82px 24px 32px;
  background: linear-gradient(rgba(0, 0, 0, 0.33), rgba(0, 0, 0, 0.33)),
    url('/images/health/design/checkups-hero.webp') center 85.5%/100% 557%;
  text-align: center;
  color: #ffffff;
  box-sizing: border-box;
}

.catalog-hero h1 {
  font: 600 48px/67.2px Inter, sans-serif;
  margin: 0 0 12px;
  letter-spacing: -0.01em;
}

.catalog-hero p {
  font-size: 20px;
  line-height: 24px;
  margin: 0;
  color: #ffffff;
}

/* Grid Container - 增加底部大面积留白，避免外边距折叠并使卡片显著远离页面底部 */
.catalog-shell {
  max-width: 968px;
  margin: 48px auto 0;
  padding: 0 20px 240px;
  box-sizing: border-box;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 296px);
  column-gap: 40px;
  row-gap: 38px;
  justify-content: center;
}

/* Service Card */
.service-card {
  display: flex;
  flex-direction: column;
  width: 296px;
  background: #ffffff;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.service-card:hover {
  transform: translateY(-4px);
}

.service-card:hover .service-content {
  box-shadow: 0 12px 28px rgba(17, 34, 17, 0.08);
  border-color: #112211;
}

.service-image-link {
  display: block;
  width: 100%;
  height: 300px;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
  background: #f6f7fa;
}

.service-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.service-card:hover .service-image {
  transform: scale(1.02);
}

/* Content Box */
.service-content {
  display: flex;
  flex-direction: column;
  padding: 22px 16px 22px 16px;
  border: 1px solid #112211;
  border-top: none;
  border-radius: 0 0 12px 12px;
  background: #ffffff;
  min-height: 115px;
  box-sizing: border-box;
  transition: box-shadow 0.22s ease, border-color 0.22s ease;
}

.service-title {
  margin: 0 0 8px 0;
  font: 700 16px/1.3 Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #112211;
  letter-spacing: -0.01em;
}

.service-title a {
  color: #112211;
  text-decoration: none;
  transition: color 0.15s ease;
}

.service-title a:hover {
  color: #698e4e;
}

.service-meta {
  margin: 0 0 16px 0;
  font: 400 12px/1.4 Inter, sans-serif;
  color: #203d33;
}

.service-footer {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: auto;
}

.service-price {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
}

.price-from {
  font: 400 14px/1.2 Inter, sans-serif;
  color: #2d4940;
}

.price-amount {
  font: 700 17px/1.2 Inter, sans-serif;
  color: #203d33;
}

.service-details-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font: 400 14px/1.2 Inter, sans-serif;
  color: #698e4e;
  text-decoration: none;
  transition: color 0.15s ease;
}

.service-details-link:hover {
  color: #52703c;
}

.service-details-link:hover .link-arrow {
  transform: translateX(2px);
}

.link-arrow {
  display: inline-block;
  font-family: Inter, sans-serif;
  transition: transform 0.15s ease;
}

/* Empty / loading / error states */
.health-state {
  text-align: center;
  padding: 80px 20px;
  color: #677489;
  font: 400 16px/1.6 Inter, sans-serif;
}

.health-error {
  color: #a43d32;
}

.retry-btn {
  margin-left: 12px;
  padding: 6px 14px;
  border: 1px solid #698e4e;
  background: transparent;
  color: #698e4e;
  border-radius: 6px;
  cursor: pointer;
  font: 500 14px Inter, sans-serif;
}

.retry-btn:hover {
  background: #698e4e;
  color: #fff;
}

/* Responsive Breakpoints */
@media (max-width: 1024px) {
  .health-catalog {
    padding-bottom: 120px;
  }
  .catalog-shell {
    max-width: 660px;
    margin: 36px auto 0;
    padding-bottom: 180px;
  }
  .services-grid {
    grid-template-columns: repeat(2, 296px);
    gap: 32px;
  }
}

@media (max-width: 850px) {
  .health-catalog {
    padding-top: 80px;
    padding-bottom: 100px;
  }
  .catalog-hero {
    background-size: cover;
    background-position: center 70%;
  }
  .catalog-hero h1 {
    font-size: 36px;
    line-height: 46px;
  }
  .catalog-hero p {
    font-size: 16px;
    line-height: 24px;
  }
  .desktop-break {
    display: none;
  }
}

@media (max-width: 660px) {
  .catalog-shell {
    max-width: 360px;
    padding: 0 16px 120px;
    margin: 24px auto 0;
  }
  .services-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .service-card {
    width: 100%;
    max-width: none;
  }
  .service-image-link {
    height: 260px;
  }
}

@media (max-width: 500px) {
  .catalog-hero {
    height: 240px;
    padding: 64px 16px 24px;
  }
  .catalog-hero h1 {
    font-size: 28px;
    line-height: 38px;
  }
}
</style>
