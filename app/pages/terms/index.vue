<template>
  <main class="legal-page">
    <section class="legal-page__heading">
      <p>Legal</p>
      <h1>Terms &amp; Conditions</h1>
    </section>
    <section class="legal-page__document" aria-label="Terms and conditions document">
      <object
        class="legal-page__embed"
        data="https://www.9-bill.com/index/text"
        type="text/html"
        title="Terms and Conditions"
      >
        <p>
          Your browser cannot display this document.
          <a href="https://www.9-bill.com/index/text" target="_blank" rel="noopener noreferrer">Open the Terms &amp; Conditions</a>.
        </p>
      </object>
    </section>
  </main>
</template>

<script setup lang="ts">
const title = 'Terms & Conditions | Lvyv'
const description = 'Terms and Conditions for Lvyv services.'

useLvyvSeo({
  title,
  description,
  path: '/terms',
  noindex: true,
  jsonLd: webPageJsonLd(title, description, '/terms')
})
</script>

<style scoped>
.legal-page {
  min-height: calc(100dvh - 72px);
  padding: 116px max(24px, calc((100vw - 1120px) / 2)) 72px;
  background: #f5f8f5;
}

.legal-page__heading {
  margin: 0 auto 24px;
  max-width: 1120px;
}

.legal-page__heading p {
  margin: 0 0 8px;
  color: #6c8175;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.legal-page__heading h1 {
  margin: 0;
  color: #173f34;
  font: 600 40px/1.18 'Playfair Display', Georgia, serif;
}

.legal-page__document {
  min-height: 720px;
  margin: 0 auto;
  max-width: 1120px;
  overflow: hidden;
  border: 1px solid #d9e2db;
  background: #fff;
}

.legal-page__embed {
  display: block;
  width: 100%;
  min-height: 720px;
  border: 0;
}

@media (max-width: 767px) {
  .legal-page {
    min-height: calc(100dvh - 72px);
    padding: 96px 16px 40px;
  }

  .legal-page__heading h1 {
    font-size: 32px;
  }

  .legal-page__document,
  .legal-page__embed {
    min-height: 680px;
  }
}
</style>
