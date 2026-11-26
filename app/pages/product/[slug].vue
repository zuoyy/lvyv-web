<template>
  <main class="encounter-detail">
    <header class="detail-hero">
      <img :src="encounterImage(content?.hero ?? product.image)" alt="" fetchpriority="high">
      <div class="hero-inner">
        <nav aria-label="Breadcrumb">
          <NuxtLink to="/encounters">Encounters</NuxtLink>
          <span aria-hidden="true">/</span>
          <NuxtLink :to="'/encounters#' + (product.city === 'Beijing' ? 'beijing' : 'xian')">{{ product.city }}</NuxtLink>
        </nav>
        <p class="eyebrow">{{ product.city }} · {{ product.duration }}</p>
        <h1>{{ content?.heading || product.title }}</h1>
        <p v-if="content" class="intro">{{ content.description }}</p>
        <a v-if="sku" class="hero-book" href="#book">Book this {{ product.kind === 'route' ? 'route' : 'experience' }} · {{ usd(sku.price) }} / person</a>
      </div>
    </header>

    <div class="detail-body">
      <template v-if="content">
        <div v-if="content.gallery.length" class="gallery">
          <figure v-for="photo in content.gallery" :key="photo.image + photo.caption">
            <img :src="encounterImage(photo.image)" alt="" loading="lazy">
            <figcaption>{{ photo.caption }}</figcaption>
          </figure>
        </div>

        <section v-if="product.kind === 'experience' && content.highlights.length" class="detail-section">
          <h2>What you’ll experience</h2>
          <div class="highlights">
            <article v-for="highlight in content.highlights" :key="highlight.title">
              <img v-if="highlight.image" :src="encounterImage(highlight.image)" alt="" loading="lazy">
              <div><h3>{{ highlight.title }}</h3><p>{{ highlight.description }}</p></div>
            </article>
          </div>
        </section>

        <section v-if="content.days.some(day => day.steps.length)" class="detail-section">
          <h2>{{ product.kind === 'route' ? 'Your itinerary' : 'Your visit' }}</h2>
          <article v-for="(day, index) in content.days" :key="day.title" class="day">
            <h3><span v-if="content.days.length > 1">Day {{ index + 1 }} · </span>{{ day.title }}</h3>
            <ol>
              <li v-for="step in day.steps" :key="step.time + step.description">
                <span class="step-time">{{ step.time }}</span>
                <div><strong v-if="step.title">{{ step.title }}</strong><p>{{ step.description }}</p></div>
              </li>
            </ol>
          </article>
        </section>

        <section v-if="product.kind === 'route' && content.highlights.length" class="detail-section">
          <h2>Route highlights</h2>
          <div class="highlights">
            <article v-for="highlight in content.highlights" :key="highlight.title">
              <img v-if="highlight.image" :src="encounterImage(highlight.image)" alt="" loading="lazy">
              <div><h3>{{ highlight.title }}</h3><p>{{ highlight.description }}</p></div>
            </article>
          </div>
        </section>

        <div v-if="content.included.length || content.excluded.length" class="inclusions detail-section">
          <section v-if="content.included.length">
            <h2>What’s included</h2>
            <ul><li v-for="item in content.included" :key="item">{{ item }}</li></ul>
          </section>
          <section v-if="content.excluded.length">
            <h2>Additional costs</h2>
            <ul><li v-for="item in content.excluded" :key="item">{{ item }}</li></ul>
          </section>
        </div>

        <section v-if="content.faq.length" class="detail-section">
          <h2>Common questions</h2>
          <details v-for="item in content.faq" :key="item.question">
            <summary>{{ item.question }}</summary>
            <p>{{ item.answer }}</p>
          </details>
        </section>
      </template>

      <EncounterBooking :key="product.code" :product="product" :sku="sku" :status="status" @retry="refresh()" />
      <p v-if="product.kind === 'experience'" class="related">
        <NuxtLink :to="relatedRoute">Explore the full {{ product.city }} route →</NuxtLink>
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { encounterImage, encounterProducts } from '~~/shared/utils/encounterProducts'
import { encounterContent } from '~/data/encounterContent'

definePageMeta({ key: route => route.path })

const slug = String(useRoute().params.slug)
const product = encounterProducts.find(item => item.slug === slug)
if (!product) throw createError({ statusCode: 404, statusMessage: 'Product not found' })
const content = encounterContent[slug]
const { sku, status, refresh } = await useEncounterProduct(product, {
  title: product.title + ' · ' + product.city + ' | LVYV',
  description: content?.description || product.title + ' in ' + product.city + '. ' + product.duration + '.',
  hero: content?.hero,
})
const relatedRoute = product.city === 'Beijing' ? '/product/beijing-china-ritual' : '/product/xian-ancient-pharmacy'
</script>

<style scoped src="~/assets/css/encounter-detail.css"></style>
