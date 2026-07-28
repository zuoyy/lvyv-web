<template>
  <div class="about-page">
    <!-- ① Hero 区（50vh） -->
    <section class="about-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="about-hero-title">Don't travel. Encounter.</h1>
        <p class="about-hero-subtitle">This is the belief behind LVYV.</p>
      </div>
    </section>

    <!-- ② 品牌故事 -->
    <section class="about-story">
      <div class="story-container">
        <span class="section-label">OUR STORY</span>
        <h2 class="section-heading">Why LVYV?</h2>
        <div class="story-body">
          <p>
            We believe travel is not about ticking off landmarks. It's about the people you meet along the way.
          </p>
          <p>
            The old man walking his bird on the city wall. The street vendor who's been making the same noodle dish for 40 years. The student who invites you to her family's hotpot dinner.
          </p>
          <p>
            These encounters can't be packaged. They can only be discovered.
          </p>
          <p>
            That's why we built LVYV — a platform that doesn't sell tours, but creates encounters.
          </p>
          <p class="highlight-p">
            You tell us your dream. A real human handcrafts it. You go, and meet someone.
          </p>
        </div>
        <div class="story-signature">
          <span class="signature-text">LVYV Team</span>
        </div>
      </div>
    </section>

    <!-- ③ 品牌宣言 -->
    <section class="about-manifesto">
      <div class="manifesto-container">
        <span class="section-label">OUR MANIFESTO</span>
        <div class="manifesto-content">
          <p class="manifesto-group">
            Stop ticking off landmarks.<br />
            Stop rushing through cities.<br />
            Stop being a tourist.
          </p>
          <p class="manifesto-group">
            Go. Walk the city walls at sunrise.<br />
            Sit down with a stranger. Learn their dialect.<br />
            Eat something you can't pronounce.<br />
            Get lost. Find a story.
          </p>
          <p class="manifesto-group emphasis">
            Don't travel through China.<br />
            Encounter it.
          </p>
        </div>
        <div class="manifesto-footer">
          <p class="manifesto-cta">"Go, meet someone."</p>
        </div>
      </div>
    </section>

    <!-- ④ 团队介绍 -->
    <section class="about-team">
      <div class="team-container">
        <span class="section-label">OUR TEAM</span>
        <h2 class="section-heading">The people behind your encounters.</h2>

        <!-- 团队成员列表（支持展示及拓展） -->
        <div v-if="teamMembers && teamMembers.length > 0" class="team-grid">
          <div v-for="member in teamMembers" :key="member.name" class="team-card">
            <div class="avatar-wrapper">
              <img :src="member.avatar" :alt="member.name" class="avatar-img" />
            </div>
            <h3 class="member-name">{{ member.name }}</h3>
            <p class="member-role">{{ member.role }}</p>
            <p class="member-bio">{{ member.bio }}</p>
          </div>
        </div>

        <!-- 暂无照片时的空状态卡片 -->
        <div v-else class="team-empty">
          <div class="empty-illustration">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#105446" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15 9C15 10.6569 13.6569 12 12 12C10.3431 12 9 10.6569 9 9C9 7.34315 10.3431 6 12 6C13.6569 6 15 7.34315 15 9Z" stroke="#105446" stroke-width="1.5"/>
              <path d="M6 19C6.83777 16.6192 9.2154 15 12 15C14.7846 15 17.1622 16.6192 18 19" stroke="#105446" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <p class="empty-text">We're a small team with a big dream. Photos coming soon.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
}

const aboutTitle = "About Us — Don't travel. Encounter | LVYV"
const aboutDescription = "Don't travel. Encounter. This is the belief behind LVYV — a platform that doesn't sell tours, but creates encounters."

useLvyvSeo({
  title: aboutTitle,
  description: aboutDescription,
  path: '/about',
  jsonLd: [
    webPageJsonLd(aboutTitle, aboutDescription, '/about'),
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' }
    ])
  ]
})

// 团队成员列表数据 (初始为空以触发规范中要求的“照片筹备中”空状态，或可配置真实数据)
const teamMembers = ref<TeamMember[]>([]);
</script>

<style scoped>
.about-page {
  width: 100%;
  overflow-x: hidden;
  background-color: var(--color-white, #ffffff);
  color: var(--color-dark, #203d33);
}

/* ==========================================
   ① Hero 区 (50vh)
   ========================================== */
.about-hero {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50vh;
  min-height: 420px;
  padding-top: 80px; /* 避开 80px 的顶部固定导航栏 (navbar) */
  background-image: url('/images/home/hero-bg-2.png');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  text-align: center;
  box-sizing: border-box;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(16, 84, 70, 0.78) 0%,
    rgba(16, 84, 70, 0.92) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 800px;
  padding: 20px;
  margin: auto 0;
}

.about-hero-title {
  color: #ffffff !important;
  font-family: var(--font-heading, 'Didot', 'Playfair Display', Georgia, serif) !important;
  font-size: 48px !important;
  font-weight: 700 !important;
  line-height: 1.1 !important;
  letter-spacing: -0.01em !important;
  margin: 0 0 4px 0 !important;
  padding: 0 !important;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.about-hero-subtitle {
  color: rgba(255, 255, 255, 0.9) !important;
  font-family: var(--font-body, 'Inter', sans-serif) !important;
  font-size: 18px !important;
  font-weight: 400 !important;
  line-height: 1.3 !important;
  letter-spacing: 0.02em !important;
  margin: 0 !important;
  padding: 0 !important;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

/* ==========================================
   通用 Section 标签与大标题
   ========================================== */
.section-label {
  display: block;
  color: var(--color-forest, #105446);
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.section-heading {
  color: var(--color-dark, #203d33);
  font-family: var(--font-heading, 'Didot', 'Playfair Display', Georgia, serif);
  font-size: 40px;
  font-weight: 700;
  line-height: 1.25;
  margin-bottom: 36px;
}

/* ==========================================
   ② 品牌故事 (Our Story)
   ========================================== */
.about-story {
  padding: 100px 20px;
  background-color: #ffffff;
}

.story-container {
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
}

.story-body {
  text-align: left;
}

.story-body p {
  color: #555555;
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 16px;
  font-weight: 400;
  line-height: 1.8;
  margin-bottom: 24px;
}

.story-body p.highlight-p {
  color: var(--color-dark, #203d33);
  font-size: 17px;
  font-weight: 500;
}

.story-signature {
  margin-top: 48px;
  text-align: right;
}

.signature-text {
  color: var(--color-forest, #105446);
  font-family: var(--font-cursive, 'Caveat', cursive);
  font-size: 36px;
  font-weight: 600;
}

/* ==========================================
   ③ 品牌宣言 (Our Manifesto)
   ========================================== */
.about-manifesto {
  padding: 80px 20px;
  background-color: #f8f8f8;
}

.manifesto-container {
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
}

.manifesto-content {
  margin-top: 32px;
  text-align: center;
}

.manifesto-group {
  color: var(--color-dark, #203d33);
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 16px;
  font-weight: 400;
  line-height: 2.0;
  margin-bottom: 32px;
}

.manifesto-group.emphasis {
  font-weight: 600;
  font-size: 17px;
}

.manifesto-footer {
  margin-top: 40px;
}

.manifesto-cta {
  color: var(--color-forest, #105446);
  font-family: var(--font-heading, 'Didot', 'Playfair Display', Georgia, serif);
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

/* ==========================================
   ④ 团队介绍 (Our Team)
   ========================================== */
.about-team {
  padding: 80px 20px;
  background-color: #ffffff;
}

.team-container {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 40px;
  margin-top: 48px;
}

.team-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-wrapper {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 16px;
  border: 3px solid var(--color-forest, #105446);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-name {
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 18px;
  font-weight: 600;
  color: var(--color-dark, #203d33);
  margin-bottom: 4px;
}

.member-role {
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 14px;
  color: #777777;
  margin-bottom: 12px;
}

.member-bio {
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 14px;
  color: #555555;
  line-height: 1.5;
}

/* 团队空状态样式 */
.team-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  margin-top: 24px;
  background-color: #fafdf7;
  border: 1px dashed #d0dcd4;
  border-radius: 16px;
}

.empty-illustration {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #eaf3ee;
  margin-bottom: 16px;
}

.empty-text {
  color: #666666;
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 15px;
  font-weight: 400;
}

/* ==========================================
   移动端与响应式适配
   ========================================== */
@media (max-width: 768px) {
  .hero-title {
    font-size: 34px;
  }

  .hero-subtitle {
    font-size: 15px;
  }

  .about-story {
    padding: 60px 20px;
  }

  .section-heading {
    font-size: 30px;
    margin-bottom: 24px;
  }

  .story-body p {
    font-size: 15px;
  }

  .signature-text {
    font-size: 30px;
  }

  .about-manifesto {
    padding: 60px 20px;
  }

  .manifesto-group {
    font-size: 15px;
  }

  .manifesto-cta {
    font-size: 20px;
  }

  .about-team {
    padding: 60px 20px;
  }
}
</style>
