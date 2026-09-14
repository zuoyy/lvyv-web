<template>
  <footer class="activity-brand-footer">
    <div class="act-footer-inner">
      <div class="act-footer-brand-info">
        <img src="/images/common/logo-footer.svg" alt="Lvyv Logo" class="act-footer-logo">
        <p class="act-brand-subtext">Go, Meet someone.</p>
        <p class="act-copyright">© 2026&nbsp; Lvyv International Travel &amp; Culture Co., Ltd.</p>
        <p class="act-copyright act-footer-records">
          <a
            href="https://zzlz.gsxt.gov.cn/businessCheck/verifKey.do?showType=p&amp;serial=91110101MAKF4XU185-SAIC_SHOW_10000091110101MAKF4XU1851784705248157&amp;signData=MEUCIQCAptI+6G+AsKo4TFSprcYjTn9cnGu+S+tBBIork1PibQIgD+GcoDzK3VA3WAIx3gz+ERcY6rtfCmm2AllRnoM44BM="
            target="_blank"
            rel="noopener"
            referrerpolicy="origin"
            class="act-footer-record-link act-footer-license-link"
            aria-label="电子营业执照"
          >
            <img
              :src="businessLicenseIconUrl"
              alt="电子营业执照"
              style="width: 16px; height: 16px; min-width: 16px; display: inline-block; vertical-align: middle;"
            >
          </a>
          <a
            href="https://beian.mps.gov.cn/#/query/webSearch?code=11011302008211"
            rel="noreferrer"
            target="_blank"
            class="act-footer-record-link act-footer-police-record"
          >
            <img
              src="/images/common/gongan.png"
              alt="公安备案图标"
              style="width: 16px; height: 16px; min-width: 16px; display: inline-block; vertical-align: middle;"
            >
            <span>京公网安备11011302008211号</span>
          </a>
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            class="act-footer-record-link"
          >
            京ICP备2026042546号-1
          </a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import businessLicenseIconUrl from '~/assets/generated/common/yyzz-48.png';
</script>

<style scoped>
.activity-brand-footer {
  position: relative;
  width: 100%;
  background-color: #0b1512;
  color: rgba(255, 255, 255, 0.75);
  padding: 40px 24px 48px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  box-sizing: border-box;
}

.act-footer-inner {
  max-width: 860px;
  margin: 0 auto;
  position: relative;
  width: 100%;
}

.act-footer-brand-info {
  position: static !important;
  top: auto !important;
  left: auto !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 12px !important;
  width: 100% !important;
  max-width: 100% !important;
  padding-top: 0 !important;
}

.act-footer-logo {
  height: 38px;
  width: auto;
  align-self: flex-start;
  display: block;
}

.act-brand-subtext {
  font-size: 0.9rem;
  opacity: 0.8;
  margin: 0;
  color: #c9d6cf;
}

.act-copyright {
  font-size: 0.82rem;
  opacity: 0.65;
  margin: 0;
  color: #a8b8b0;
  line-height: 1.5;
}

.act-footer-records {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 4px;
}

.act-footer-record-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: inherit;
  text-decoration: none;
  font-size: 0.82rem;
  transition: opacity 0.2s ease;
}

.act-footer-record-link:hover {
  opacity: 1;
  color: #5bb396;
}
</style>
