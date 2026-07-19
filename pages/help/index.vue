<template>
  <main class="help-center">
    <div class="help-shell">
      <div class="help-toolbar">
        <div class="help-breadcrumb">
          <span>帮助中心</span>
          <span class="breadcrumb-separator">/</span>
          <span>{{ activeArticle.category }}</span>
        </div>

        <label class="help-search">
          <font-awesome-icon :icon="['fas', 'magnifying-glass']" aria-hidden="true" />
          <span class="sr-only">搜索帮助文档</span>
          <input v-model="searchQuery" type="search" placeholder="搜索帮助文档" @focus="mobileNavOpen = false">
          <kbd>⌘ K</kbd>
        </label>

        <button class="mobile-nav-toggle" type="button" aria-label="打开文档导航" @click="mobileNavOpen = true">
          <font-awesome-icon :icon="['fas', 'bars']" aria-hidden="true" />
        </button>
      </div>

      <div class="help-layout">
        <div v-if="mobileNavOpen" class="help-nav-backdrop" aria-hidden="true" @click="mobileNavOpen = false"></div>

        <aside class="help-sidebar" :class="{ 'is-open': mobileNavOpen }">
          <div class="sidebar-heading">
            <div class="sidebar-title">
              <font-awesome-icon :icon="['fas', 'book-open']" aria-hidden="true" />
              <span>帮助中心</span>
            </div>
            <button class="mobile-nav-close" type="button" aria-label="关闭文档导航" @click="mobileNavOpen = false">
              <font-awesome-icon :icon="['fas', 'xmark']" aria-hidden="true" />
            </button>
          </div>

          <p class="sidebar-caption">找到开始旅遇所需的答案</p>

          <nav class="doc-navigation" aria-label="文档分类">
            <section v-for="category in filteredCategories" :key="category.id" class="doc-category">
              <button class="category-toggle" type="button" @click="toggleCategory(category.id)">
                <span>{{ category.name }}</span>
                <font-awesome-icon :icon="['fas', 'chevron-right']" :class="{ 'is-expanded': expandedCategories.has(category.id) }" aria-hidden="true" />
              </button>

              <div v-if="expandedCategories.has(category.id)" class="category-articles">
                <button
                  v-for="article in category.articles"
                  :key="article.id"
                  type="button"
                  class="article-link"
                  :class="{ active: article.id === activeArticleId }"
                  @click="selectArticle(category.id, article.id)"
                >
                  {{ article.title }}
                </button>
              </div>
            </section>

            <p v-if="filteredCategories.length === 0" class="empty-search">没有找到相关文档</p>
          </nav>

          <div class="sidebar-support">
            <span class="support-label">还需要帮助？</span>
            <a href="mailto:hello@lvyv.com" class="support-link">联系 Lvyv 支持 <font-awesome-icon :icon="['fas', 'arrow-up-right-from-square']" aria-hidden="true" /></a>
          </div>
        </aside>

        <article class="help-article">
          <header class="article-header">
            <div class="article-eyebrow">{{ activeArticle.category }} <span>/</span> 文档</div>
            <h1>{{ activeArticle.title }}</h1>
            <p class="article-summary">{{ activeArticle.summary }}</p>
            <div class="article-meta">
              <span>最后更新：{{ activeArticle.updatedAt }}</span>
              <span class="meta-dot"></span>
              <span>阅读时间约 {{ activeArticle.readTime }} 分钟</span>
            </div>
          </header>

          <div class="article-body">
            <section v-for="section in activeArticle.sections" :id="section.id" :key="section.id" class="article-section">
              <h2>{{ section.title }}</h2>
              <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
              <ul v-if="section.items" class="article-list">
                <li v-for="item in section.items" :key="item.title">
                  <strong>{{ item.title }}</strong>
                  <span>{{ item.description }}</span>
                </li>
              </ul>
              <div v-if="section.callout" class="article-callout" :class="`callout-${section.callout.type || 'info'}`">
                <strong>{{ section.callout.title }}</strong>
                <p>{{ section.callout.content }}</p>
              </div>
            </section>
          </div>

          <footer class="article-footer">
            <span>这篇文档对你有帮助吗？</span>
            <div class="article-feedback">
              <button type="button" aria-label="有帮助">有帮助</button>
              <button type="button" aria-label="需要改进">需要改进</button>
            </div>
          </footer>
        </article>

        <aside class="help-toc" aria-label="当前文章目录">
          <p class="toc-title">本页导航</p>
          <nav>
            <a v-for="section in activeArticle.sections" :key="section.id" :href="`#${section.id}`">{{ section.title }}</a>
          </nav>
        </aside>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

useSeoMeta({
  title: '帮助中心 - Lvyv 旅遇',
  description: '了解如何使用 Lvyv，开始一段真实、有温度的中国旅遇。'
})

const categories = [
  {
    id: 'getting-started',
    name: '开始使用',
    articles: [
      {
        id: 'welcome',
        title: '认识 Lvyv',
        summary: '从真实的人和故事开始，了解 Lvyv 如何帮你遇见不一样的中国。',
        updatedAt: '2026 年 7 月 19 日',
        readTime: 3,
        sections: [
          {
            id: 'what-is-lvyv',
            title: 'Lvyv 是什么？',
            paragraphs: [
              'Lvyv 旅遇连接正在探索中国的旅人、熟悉当地生活的朋友，以及愿意分享故事的创作者。我们相信，真正难忘的旅程往往从一次真诚的对话开始。',
              '你可以在这里发现真实的人、隐藏的故事和属于自己的体验路线，而不只是快速打卡景点。'
            ]
          },
          {
            id: 'how-it-works',
            title: '旅遇如何开始？',
            paragraphs: ['选择一个让你感到好奇的城市，浏览当地体验，然后告诉我们你想遇见什么。我们会根据你的兴趣，帮你找到合适的本地朋友和故事。'],
            items: [
              { title: '探索城市', description: '从西安、成都、北京等城市开始，发现不同的生活节奏。' },
              { title: '表达愿望', description: '写下你想体验的事情，让当地朋友更了解你。' },
              { title: '遇见朋友', description: '在安全、清晰的体验流程中，和真实的人见面。' }
            ]
          },
          {
            id: 'first-step',
            title: '现在就开始',
            paragraphs: ['浏览首页的体验卡片，或直接进入许愿池，写下你的第一条旅遇愿望。你不需要准备一份完美的行程，保持好奇就够了。'],
            callout: { type: 'success', title: '小提示', content: '越具体的愿望，越容易遇见真正适合你的当地朋友。' }
          }
        ]
      },
      {
        id: 'make-a-wish',
        title: '如何创建旅遇愿望',
        summary: '把你对中国的好奇写下来，让合适的当地朋友找到你。',
        updatedAt: '2026 年 7 月 19 日',
        readTime: 4,
        sections: [
          { id: 'wish-content', title: '写下你真正想体验的事', paragraphs: ['可以是一顿饭、一个街区、一次手作体验，也可以是你想了解的一段地方故事。愿望不需要正式，像给未来的朋友写一条消息一样自然。'] },
          { id: 'wish-details', title: '补充城市和时间', paragraphs: ['选择计划到访的城市和大致时间范围，帮助我们匹配更合适的体验。暂时没有确定时间也没关系，可以先收藏愿望。'] },
          { id: 'wish-publish', title: '发布并等待回应', paragraphs: ['确认愿望后发布，合适的本地朋友会根据内容与你联系。请保持通知畅通，并在见面前完成必要的沟通。'] }
        ]
      },
      {
        id: 'book-experience',
        title: '预订一次体验',
        summary: '从发现体验到确认见面，了解一次 Lvyv 旅遇的完整流程。',
        updatedAt: '2026 年 7 月 19 日',
        readTime: 5,
        sections: [
          { id: 'choose-experience', title: '选择体验', paragraphs: ['打开体验详情，查看活动内容、预计时长、地点和参与人数。请先确认体验是否符合你的节奏和兴趣。'] },
          { id: 'confirm-details', title: '确认详情', paragraphs: ['提交预订前，请检查日期、人数、联系人和特殊需求。部分体验需要提前和当地朋友确认可用时间。'] },
          { id: 'meet-safely', title: '安全见面', paragraphs: ['首次见面建议选择公开场所，并把行程告知同行朋友。遇到任何让你不舒服的情况，都可以随时联系 Lvyv 支持。'] }
        ]
      }
    ]
  },
  {
    id: 'experiences',
    name: '旅遇体验',
    articles: [
      {
        id: 'find-local-friends',
        title: '找到合适的当地朋友',
        summary: '用兴趣、城市和故事筛选更适合你的旅遇对象。',
        updatedAt: '2026 年 7 月 19 日',
        readTime: 3,
        sections: [
          { id: 'match-by-interest', title: '按兴趣匹配', paragraphs: ['从美食、手作、城市漫步和文化故事等方向开始，兴趣越接近，聊天和见面通常越自然。'] },
          { id: 'read-profile', title: '阅读个人介绍', paragraphs: ['查看对方所在城市、可分享的主题和其他旅人的反馈，提前了解彼此的期待。'] },
          { id: 'send-message', title: '先聊聊再决定', paragraphs: ['你可以在确认体验前先沟通细节。请直接说明你的语言能力、饮食偏好和时间安排。'] }
        ]
      },
      {
        id: 'city-guides',
        title: '城市与体验指南',
        summary: '了解不同城市的体验节奏，找到适合自己的出发方式。',
        updatedAt: '2026 年 7 月 19 日',
        readTime: 4,
        sections: [
          { id: 'chengdu', title: '成都：把时间放慢', paragraphs: ['适合从街区、美食、茶馆和创意社区开始，给自己留一点没有安排的时间。'] },
          { id: 'xian', title: '西安：从故事出发', paragraphs: ['历史、手艺和夜晚的城市生活交织在一起，适合喜欢深入了解地方文化的旅人。'] },
          { id: 'beijing', title: '北京：城市里的日常', paragraphs: ['从胡同、社区和当代生活切入，你会看到一座城市不止有地标，也有许多细小而真实的日常。'] }
        ]
      }
    ]
  },
  {
    id: 'account-safety',
    name: '账户与安全',
    articles: [
      {
        id: 'account-profile',
        title: '管理你的账户资料',
        summary: '设置个人资料，让旅遇朋友更容易了解你的偏好。',
        updatedAt: '2026 年 7 月 19 日',
        readTime: 3,
        sections: [
          { id: 'profile-basics', title: '资料中应该写什么？', paragraphs: ['建议填写常用称呼、语言、兴趣和旅行节奏。避免公开身份证件、住址和其他敏感信息。'] },
          { id: 'notification-settings', title: '保持通知畅通', paragraphs: ['旅遇确认和重要消息会通过账户通知发送。你可以在设置中管理接收方式。'] },
          { id: 'delete-account', title: '删除账户', paragraphs: ['如果你不再使用 Lvyv，可以联系支持团队申请删除账户及相关资料。'] }
        ]
      },
      {
        id: 'safety-guidelines',
        title: '旅遇安全指南',
        summary: '一份简单、清晰的见面和沟通安全建议。',
        updatedAt: '2026 年 7 月 19 日',
        readTime: 4,
        sections: [
          { id: 'public-place', title: '选择公开场所', paragraphs: ['第一次见面请优先选择交通方便、有人流的公共场所，并让信任的人知道你的安排。'] },
          { id: 'protect-privacy', title: '保护个人隐私', paragraphs: ['不要在聊天中分享密码、验证码、银行卡信息或精确住址。Lvyv 不会要求你提供这些信息。'], callout: { type: 'warning', title: '请注意', content: '如果有人要求你转账或索取敏感信息，请立即停止沟通并联系支持团队。' } },
          { id: 'report-issue', title: '遇到问题怎么办？', paragraphs: ['通过页面底部的支持邮箱联系我们，并提供体验名称、时间和必要的沟通记录。'] }
        ]
      }
    ]
  },
  {
    id: 'orders-payment',
    name: '订单与支付',
    articles: [
      {
        id: 'order-status',
        title: '查看订单状态',
        summary: '了解预订提交、确认和完成之间的状态变化。',
        updatedAt: '2026 年 7 月 19 日',
        readTime: 3,
        sections: [
          { id: 'pending', title: '等待确认', paragraphs: ['提交预订后，订单会进入等待确认状态。当地朋友需要确认时间和体验细节。'] },
          { id: 'confirmed', title: '已确认', paragraphs: ['订单确认后，你会看到见面时间、地点和联系人信息。请提前查看并及时沟通变化。'] },
          { id: 'completed', title: '体验完成', paragraphs: ['体验结束后，你可以留下反馈，帮助更多旅人找到可靠的当地朋友。'] }
        ]
      },
      {
        id: 'refund-policy',
        title: '支付与退款说明',
        summary: '了解支付确认、取消和退款处理的基本规则。',
        updatedAt: '2026 年 7 月 19 日',
        readTime: 4,
        sections: [
          { id: 'payment-confirm', title: '支付确认', paragraphs: ['只有在订单详情中明确显示支付成功后，预订才算完成。请保留支付凭证。'] },
          { id: 'cancel-order', title: '取消订单', paragraphs: ['不同体验可能有不同的取消时间限制。请以订单详情页显示的取消政策为准。'] },
          { id: 'refund-time', title: '退款到账时间', paragraphs: ['退款审核通过后，到账时间取决于你的支付渠道。若超过预计时间仍未收到，请联系支持团队。'] }
        ]
      }
    ]
  },
  {
    id: 'faq',
    name: '常见问题',
    articles: [
      {
        id: 'language-support',
        title: '不会中文也可以参加吗？',
        summary: '语言不是开始一次真实旅遇的障碍。',
        updatedAt: '2026 年 7 月 19 日',
        readTime: 2,
        sections: [
          { id: 'language-match', title: '匹配语言能力', paragraphs: ['创建愿望或预订体验时，填写你能使用的语言。我们会尽量匹配可以顺畅沟通的当地朋友。'] },
          { id: 'translation-tools', title: '使用翻译工具', paragraphs: ['见面前可以使用翻译工具确认集合地点和时间。真诚的表达比完美的语法更重要。'] }
        ]
      },
      {
        id: 'contact-support',
        title: '如何联系 Lvyv 支持？',
        summary: '如果帮助中心没有解决你的问题，可以直接联系团队。',
        updatedAt: '2026 年 7 月 19 日',
        readTime: 2,
        sections: [
          { id: 'support-channel', title: '支持渠道', paragraphs: ['发送邮件至 hello@lvyv.com，并在邮件中附上账户邮箱、订单编号和问题描述。'] },
          { id: 'response-time', title: '回复时间', paragraphs: ['我们通常会在 1 个工作日内回复。遇到安全相关问题时，请在标题中标注“紧急安全问题”。'] }
        ]
      }
    ]
  }
]

const searchQuery = ref('')
const activeArticleId = ref('welcome')
const activeCategoryId = ref('getting-started')
const mobileNavOpen = ref(false)
const expandedCategories = ref(new Set(['getting-started']))

const articleEntries = computed(() => categories.flatMap((category) => category.articles.map((article) => ({ ...article, category: category.name, categoryId: category.id }))))
const activeArticle = computed(() => articleEntries.value.find((article) => article.id === activeArticleId.value) || articleEntries.value[0])

const filteredCategories = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return categories

  return categories
    .map((category) => ({
      ...category,
      articles: category.articles.filter((article) => `${article.title} ${article.summary}`.toLowerCase().includes(query))
    }))
    .filter((category) => category.articles.length > 0)
})

watch(searchQuery, (value) => {
  if (value.trim()) {
    expandedCategories.value = new Set(filteredCategories.value.map((category) => category.id))
  } else {
    expandedCategories.value = new Set([activeCategoryId.value])
  }
})

const toggleCategory = (categoryId) => {
  const next = new Set(expandedCategories.value)
  if (next.has(categoryId)) next.delete(categoryId)
  else next.add(categoryId)
  expandedCategories.value = next
}

const selectArticle = (categoryId, articleId) => {
  activeCategoryId.value = categoryId
  activeArticleId.value = articleId
  expandedCategories.value = new Set([...expandedCategories.value, categoryId])
  mobileNavOpen.value = false
  window?.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.help-center {
  --help-ink: #17231f;
  --help-muted: #68746e;
  --help-border: #e2e8e4;
  --help-soft: #f5f8f6;
  --help-accent: #105446;
  --help-accent-soft: #edf5ef;
  background: #fbfcfb;
  color: var(--help-ink);
  min-height: 100vh;
  padding: 96px 0 100px;
}

.help-shell {
  margin: 0 auto;
  max-width: 1440px;
  padding: 0 40px;
}

.help-toolbar {
  align-items: center;
  border-bottom: 1px solid var(--help-border);
  display: flex;
  gap: 24px;
  justify-content: space-between;
  min-height: 72px;
}

.help-breadcrumb {
  align-items: center;
  color: var(--help-muted);
  display: flex;
  font-size: 14px;
  gap: 10px;
  white-space: nowrap;
}

.help-breadcrumb span:first-child {
  color: var(--help-ink);
  font-weight: 700;
}

.breadcrumb-separator {
  color: #a5b0aa;
}

.help-search {
  align-items: center;
  background: #fff;
  border: 1px solid var(--help-border);
  border-radius: 8px;
  color: #80908a;
  display: flex;
  gap: 10px;
  max-width: 400px;
  padding: 10px 12px;
  width: 100%;
}

.help-search:focus-within {
  border-color: var(--help-accent);
  box-shadow: 0 0 0 3px rgba(16, 84, 70, 0.1);
}

.help-search input {
  background: transparent;
  border: 0;
  color: var(--help-ink);
  flex: 1;
  font: inherit;
  min-width: 0;
  outline: 0;
}

.help-search input::placeholder {
  color: #9aa7a1;
}

.help-search kbd {
  background: var(--help-soft);
  border: 1px solid var(--help-border);
  border-radius: 4px;
  color: #8b9791;
  font-size: 11px;
  padding: 2px 5px;
}

.mobile-nav-toggle,
.mobile-nav-close {
  background: transparent;
  border: 0;
  color: var(--help-ink);
  cursor: pointer;
  display: none;
  font-size: 18px;
}

.help-layout {
  display: grid;
  gap: 52px;
  grid-template-columns: 240px minmax(0, 1fr) 190px;
  padding-top: 36px;
}

.help-sidebar {
  align-self: start;
  position: sticky;
  top: 112px;
}

.sidebar-heading {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.sidebar-title {
  align-items: center;
  color: var(--help-ink);
  display: flex;
  font-size: 16px;
  font-weight: 800;
  gap: 9px;
}

.sidebar-title svg {
  color: var(--help-accent);
}

.sidebar-caption {
  color: var(--help-muted);
  font-size: 12px;
  line-height: 1.6;
  margin: 8px 0 24px;
}

.doc-navigation {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.doc-category {
  border-bottom: 1px solid var(--help-border);
  padding-bottom: 7px;
}

.category-toggle,
.article-link {
  background: transparent;
  border: 0;
  cursor: pointer;
  font: inherit;
  text-align: left;
  width: 100%;
}

.category-toggle {
  align-items: center;
  color: var(--help-ink);
  display: flex;
  font-size: 13px;
  font-weight: 700;
  justify-content: space-between;
  padding: 9px 0;
}

.category-toggle svg {
  color: #93a09a;
  font-size: 11px;
  transition: transform 0.2s ease;
}

.category-toggle svg.is-expanded {
  transform: rotate(90deg);
}

.category-articles {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 0 5px 10px;
}

.article-link {
  border-left: 2px solid transparent;
  color: var(--help-muted);
  font-size: 12px;
  line-height: 1.45;
  padding: 7px 10px;
}

.article-link:hover {
  color: var(--help-accent);
}

.article-link.active {
  background: var(--help-accent-soft);
  border-left-color: var(--help-accent);
  color: var(--help-accent);
  font-weight: 700;
}

.empty-search {
  color: var(--help-muted);
  font-size: 12px;
  line-height: 1.5;
}

.sidebar-support {
  background: var(--help-soft);
  border: 1px solid var(--help-border);
  border-radius: 8px;
  margin-top: 28px;
  padding: 14px;
}

.support-label {
  color: var(--help-muted);
  display: block;
  font-size: 11px;
  margin-bottom: 7px;
}

.support-link {
  align-items: center;
  color: var(--help-accent);
  display: inline-flex;
  font-size: 12px;
  font-weight: 700;
  gap: 6px;
}

.help-article {
  min-width: 0;
  max-width: 760px;
}

.article-header {
  border-bottom: 1px solid var(--help-border);
  padding-bottom: 30px;
}

.article-eyebrow {
  color: var(--help-accent);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  margin-bottom: 14px;
}

.article-eyebrow span {
  color: #aab6b0;
  margin: 0 6px;
}

.article-header h1 {
  color: var(--help-ink);
  font-family: var(--font-body);
  font-size: clamp(30px, 3vw, 44px);
  font-weight: 800;
  letter-spacing: 0;
  line-height: 1.2;
  margin: 0 0 14px;
}

.article-summary {
  color: var(--help-muted);
  font-size: 16px;
  line-height: 1.8;
  margin: 0;
  max-width: 680px;
}

.article-meta {
  align-items: center;
  color: #9aa7a1;
  display: flex;
  font-size: 11px;
  gap: 9px;
  margin-top: 18px;
}

.meta-dot {
  background: #b8c2bd;
  border-radius: 50%;
  height: 3px;
  width: 3px;
}

.article-body {
  padding: 34px 0 10px;
}

.article-section {
  scroll-margin-top: 120px;
}

.article-section + .article-section {
  margin-top: 42px;
}

.article-section h2 {
  color: var(--help-ink);
  font-family: var(--font-body);
  font-size: 22px;
  font-weight: 800;
  line-height: 1.35;
  margin: 0 0 14px;
}

.article-section p {
  color: #4e5c55;
  font-size: 15px;
  line-height: 1.9;
  margin: 0 0 14px;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  list-style: none;
  margin: 20px 0 0;
  padding: 0;
}

.article-list li {
  background: var(--help-soft);
  border-left: 3px solid #a6d7ac;
  display: grid;
  gap: 4px;
  padding: 12px 15px;
}

.article-list strong {
  color: var(--help-ink);
  font-size: 14px;
}

.article-list span {
  color: var(--help-muted);
  font-size: 13px;
  line-height: 1.6;
}

.article-callout {
  border-radius: 8px;
  margin-top: 20px;
  padding: 15px 17px;
}

.article-callout strong {
  display: block;
  font-size: 13px;
  margin-bottom: 5px;
}

.article-callout p {
  font-size: 13px;
  line-height: 1.65;
  margin: 0;
}

.callout-info {
  background: #f2f7ff;
  border: 1px solid #d6e5fa;
  color: #315e91;
}

.callout-success {
  background: #f1f8f1;
  border: 1px solid #d6ead7;
  color: #2e6b3a;
}

.callout-warning {
  background: #fff8e9;
  border: 1px solid #f1e1b8;
  color: #87652a;
}

.article-footer {
  align-items: center;
  border-top: 1px solid var(--help-border);
  color: var(--help-muted);
  display: flex;
  font-size: 12px;
  gap: 14px;
  justify-content: space-between;
  margin-top: 30px;
  padding-top: 22px;
}

.article-feedback {
  display: flex;
  gap: 7px;
}

.article-feedback button {
  background: #fff;
  border: 1px solid var(--help-border);
  border-radius: 5px;
  color: var(--help-muted);
  cursor: pointer;
  font: inherit;
  padding: 6px 10px;
}

.article-feedback button:hover {
  border-color: var(--help-accent);
  color: var(--help-accent);
}

.help-toc {
  align-self: start;
  border-left: 1px solid var(--help-border);
  padding-left: 20px;
  position: sticky;
  top: 112px;
}

.toc-title {
  color: var(--help-ink);
  font-size: 12px;
  font-weight: 800;
  margin: 0 0 13px;
}

.help-toc nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.help-toc a {
  color: var(--help-muted);
  font-size: 11px;
  line-height: 1.45;
}

.help-toc a:hover {
  color: var(--help-accent);
}

.sr-only {
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}

@media (max-width: 1100px) {
  .help-shell {
    padding: 0 24px;
  }

  .help-layout {
    gap: 30px;
    grid-template-columns: 210px minmax(0, 1fr) 160px;
  }
}

@media (max-width: 800px) {
  .help-center {
    padding: 88px 0 60px;
  }

  .help-shell {
    padding: 0 20px;
  }

  .help-toolbar {
    gap: 12px;
  }

  .help-search {
    max-width: none;
  }

  .help-search kbd {
    display: none;
  }

  .mobile-nav-toggle,
  .mobile-nav-close {
    align-items: center;
    display: inline-flex;
    justify-content: center;
  }

  .help-layout {
    display: block;
    padding-top: 24px;
  }

  .help-nav-backdrop {
    background: rgba(15, 30, 25, 0.35);
    inset: 0;
    position: fixed;
    z-index: 1100;
  }

  .help-sidebar {
    background: #fff;
    bottom: 0;
    box-shadow: 10px 0 30px rgba(15, 30, 25, 0.12);
    left: 0;
    max-width: 320px;
    overflow-y: auto;
    padding: 22px 20px;
    position: fixed;
    top: 0;
    transform: translateX(-105%);
    transition: transform 0.25s ease;
    width: 84vw;
    z-index: 1101;
  }

  .help-sidebar.is-open {
    transform: translateX(0);
  }

  .mobile-nav-close {
    color: var(--help-muted);
  }

  .help-article {
    max-width: none;
  }

  .help-toc {
    border-left: 0;
    border-top: 1px solid var(--help-border);
    margin-top: 36px;
    padding: 20px 0 0;
    position: static;
  }

  .help-toc nav {
    display: grid;
    gap: 8px 18px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 480px) {
  .help-breadcrumb {
    font-size: 12px;
  }

  .help-search input {
    font-size: 13px;
  }

  .article-header h1 {
    font-size: 30px;
  }

  .article-summary {
    font-size: 14px;
  }

  .article-meta {
    align-items: flex-start;
    flex-direction: column;
    gap: 5px;
  }

  .meta-dot {
    display: none;
  }

  .article-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
