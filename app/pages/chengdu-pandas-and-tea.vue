<template>
  <main class="trip-landing">
    <header class="hero" style="--trip-photo: url('/images/cities/chengdu/panda.webp')">
      <div>
        <h1>Chengdu · Pandas, Tea & Sichuan Nights</h1>
        <p>2 days · 1 night · Private, English-guided trip</p>
        <a href="#packages-title">See packages</a>
      </div>
    </header>
    <div class="trip-copy">
      <h2>Itinerary</h2>
      <ol>
        <li><strong>Old Chengdu and a Sichuan evening</strong><p>Start with a private arrival transfer, then visit Kuanzhai Alleys and a tea house. Finish with hotpot and Sichuan opera.</p></li>
        <li><strong>Panda Base and departure</strong><p>Visit the Panda Base in the morning and leave Chengdu by private transfer.</p></li>
      </ol>
      <StorePackagePicker product-code="chengdu_2" />
      <h2>Frequently asked questions</h2>
      <details><summary>What is included?</summary><p>Private transfers, an English-speaking guide, listed admissions, tea and the hosted hotpot dinner. Accommodation and flights are booked separately.</p></details>
      <details><summary>When will I receive my meeting details?</summary><p>Our team will share pickup and meeting details in My orders.</p></details>
    </div>
  </main>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Chengdu Pandas, Tea & Sichuan Nights | LVYV', description: 'A private two-day Chengdu trip with an early Panda Base visit, tea, hotpot and Sichuan opera.' })
</script>

<style scoped src="~/assets/css/trip-landing.css"></style>
