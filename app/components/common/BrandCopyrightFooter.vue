<template>
  <footer class="activity-brand-footer">
    <div class="footer-inner">
      <div class="footer-brand-info">
        <img src="/images/common/logo-footer.svg" alt="Lvyv Logo" class="footer-logo">
        <p class="brand-subtext">Go, Meet someone.</p>
        <p class="copyright">© 2026&nbsp; Lvyv International Travel &amp; Culture Co., Ltd.</p>
        <p class="copyright footer-records">
          <a
            href="https://zzlz.gsxt.gov.cn/businessCheck/verifKey.do?showType=p&amp;serial=91110101MAKF4XU185-SAIC_SHOW_10000091110101MAKF4XU1851784705248157&amp;signData=MEUCIQCAptI+6G+AsKo4TFSprcYjTn9cnGu+S+tBBIork1PibQIgD+GcoDzK3VA3WAIx3gz+ERcY6rtfCmm2AllRnoM44BM="
            target="_blank"
            rel="noopener"
            referrerpolicy="origin"
            class="footer-record-link footer-license-link"
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
            class="footer-record-link footer-police-record"
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
            class="footer-record-link"
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
  background-color: #0b1512;
  color: rgba(255, 255, 255, 0.75);
  padding: 40px 24px 48px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.footer-inner {
  max-width: 860px;
  margin: 0 auto;
}

.footer-brand-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-logo {
  height: 38px;
  width: auto;
  align-self: flex-start;
}

.brand-subtext {
  font-size: 0.9rem;
  opacity: 0.8;
  margin: 0;
  color: #c9d6cf;
}

.copyright {
  font-size: 0.82rem;
  opacity: 0.65;
  margin: 0;
  color: #a8b8b0;
  line-height: 1.5;
}

.footer-records {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 4px;
}

.footer-record-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: inherit;
  text-decoration: none;
  font-size: 0.82rem;
  transition: opacity 0.2s ease;
}

.footer-record-link:hover {
  opacity: 1;
  color: #5bb396;
}
</style>
