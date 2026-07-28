<template>
  <main class="help-center">
    <div class="help-shell">
      <div class="help-toolbar">
        <div class="help-breadcrumb">
          <span>{{ copy.helpCenter }}</span>
          <span class="breadcrumb-separator">/</span>
          <span>{{ currentCategoryLabel }}</span>
        </div>

        <label class="help-search">
          <FontAwesomeIcon :icon="faMagnifyingGlass" aria-hidden="true" />
          <span class="sr-only">{{ copy.searchLabel }}</span>
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="search"
            :placeholder="copy.searchPlaceholder"
            @focus="mobileNavOpen = false"
          >
          <kbd>⌘ K</kbd>
        </label>

        <button class="mobile-nav-toggle" type="button" :aria-label="copy.openNavigation" @click="mobileNavOpen = true">
          <FontAwesomeIcon :icon="faBars" aria-hidden="true" />
        </button>
      </div>

      <div class="help-layout">
        <div v-if="mobileNavOpen" class="help-nav-backdrop" aria-hidden="true" @click="mobileNavOpen = false" />

        <aside class="help-sidebar" :class="{ 'is-open': mobileNavOpen }">
          <div class="sidebar-heading">
            <div class="sidebar-title">
              <FontAwesomeIcon :icon="faBookOpen" aria-hidden="true" />
              <span>{{ copy.helpCenter }}</span>
            </div>
            <button class="mobile-nav-close" type="button" :aria-label="copy.closeNavigation" @click="mobileNavOpen = false">
              <FontAwesomeIcon :icon="faXmark" aria-hidden="true" />
            </button>
          </div>

          <p class="sidebar-caption">{{ copy.caption }}</p>

          <nav class="doc-navigation" :aria-label="copy.documentCategories">
            <details
              v-for="category in filteredCategories"
              :key="category.id"
              class="doc-category"
              :open="expandedCategories.has(category.id)"
              @toggle="syncCategoryExpansion(category.id, $event)"
            >
              <summary class="category-toggle">
                <span>{{ category.name }}</span>
                <FontAwesomeIcon
                  :icon="faChevronRight"
                  :class="{ 'is-expanded': expandedCategories.has(category.id) }"
                  aria-hidden="true"
                />
              </summary>

              <div class="category-articles">
                <NuxtLink
                  v-for="article in category.articles"
                  :key="article.contentKey"
                  :to="`/${localePath}/faq/${article.contentKey}`"
                  class="article-link"
                  :class="{ active: article.contentKey === document.contentKey }"
                  @click="mobileNavOpen = false"
                >
                  {{ article.title }}
                </NuxtLink>
              </div>
            </details>

            <p v-if="searching" class="empty-search">{{ copy.searching }}</p>
            <p v-else-if="searchQuery.trim() && filteredCategories.length === 0" class="empty-search">
              {{ searchFailed ? copy.searchFailed : copy.noResults }}
            </p>
          </nav>

          <div class="sidebar-support">
            <span class="support-label">{{ copy.needHelp }}</span>
            <a href="mailto:hello@lvyv.com" class="support-link">
              {{ copy.contactSupport }}
              <FontAwesomeIcon :icon="faArrowUpRightFromSquare" aria-hidden="true" />
            </a>
          </div>
        </aside>

        <article class="help-article">
          <header class="article-header">
            <div class="article-eyebrow">{{ currentCategoryLabel }} <span>/</span> {{ copy.documentation }}</div>
            <h1>{{ document.title }}</h1>
            <p v-if="document.summary" class="article-summary">{{ document.summary }}</p>
            <div class="article-meta">
              <span>{{ copy.updated }}{{ formatDate(document.updatedAt) }}</span>
              <span class="meta-dot" />
              <span>{{ copy.readTime(readTime) }}</span>
            </div>
          </header>

          <div class="article-body faq-markdown" v-html="document.renderedHtml" />

          <footer class="article-footer">
            <span>{{ copy.wasHelpful }}</span>
            <div class="article-feedback">
              <button type="button">{{ copy.helpful }}</button>
              <button type="button">{{ copy.needsImprovement }}</button>
            </div>
          </footer>
        </article>

        <aside v-if="toc.length" class="help-toc" :aria-label="copy.pageNavigation">
          <p class="toc-title">{{ copy.onThisPage }}</p>
          <nav>
            <a
              v-for="item in toc"
              :key="item.id"
              :href="`#${item.id}`"
              :class="{ 'toc-child': item.level > 2 }"
            >{{ item.title }}</a>
          </nav>
        </aside>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { ContentManifestItem, ContentSearchItem, ContentTranslation, NavigationItem } from '~/composables/useContent'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faArrowUpRightFromSquare,
  faBars,
  faBookOpen,
  faChevronRight,
  faMagnifyingGlass,
  faXmark
} from '@fortawesome/free-solid-svg-icons'

const props = defineProps<{
  locale: 'en-US' | 'zh-CN'
  localePath: string
  document: ContentTranslation
  navigation: NavigationItem[]
  manifest: ContentManifestItem[]
}>()

const copy = computed(() => props.locale === 'zh-CN' ? {
  helpCenter: '帮助中心',
  searchLabel: '搜索帮助文档',
  searchPlaceholder: '搜索帮助文档',
  openNavigation: '打开文档导航',
  closeNavigation: '关闭文档导航',
  caption: '找到开始旅遇所需的答案',
  documentCategories: '文档分类',
  documentation: '文档',
  updated: '最后更新：',
  readTime: (minutes: number) => `阅读时间约 ${minutes} 分钟`,
  searching: '正在搜索…',
  noResults: '没有找到相关文档',
  searchFailed: '搜索暂时不可用，请稍后重试',
  needHelp: '还需要帮助？',
  contactSupport: '联系 Lvyv 支持',
  wasHelpful: '这篇文档对你有帮助吗？',
  helpful: '有帮助',
  needsImprovement: '需要改进',
  pageNavigation: '当前文章目录',
  onThisPage: '本页导航',
  uncategorized: '其他文档'
} : {
  helpCenter: 'Help Center',
  searchLabel: 'Search help articles',
  searchPlaceholder: 'Search help articles',
  openNavigation: 'Open document navigation',
  closeNavigation: 'Close document navigation',
  caption: 'Find the answers you need to get started',
  documentCategories: 'Document categories',
  documentation: 'Documentation',
  updated: 'Last updated: ',
  readTime: (minutes: number) => `${minutes} min read`,
  searching: 'Searching…',
  noResults: 'No matching documents',
  searchFailed: 'Search is temporarily unavailable. Please try again later.',
  needHelp: 'Still need help?',
  contactSupport: 'Contact Lvyv Support',
  wasHelpful: 'Was this article helpful?',
  helpful: 'Helpful',
  needsImprovement: 'Needs improvement',
  pageNavigation: 'Current article contents',
  onThisPage: 'On this page',
  uncategorized: 'Other documents'
})

const { search } = useContentApi()
const searchInput = ref<HTMLInputElement>()
const searchQuery = ref('')
const searchResults = ref<ContentSearchItem[]>([])
const searching = ref(false)
const searchFailed = ref(false)
const mobileNavOpen = ref(false)
const currentManifestItem = computed(() => props.manifest.find(item => item.contentKey === props.document.contentKey))
const currentCategoryId = computed(() => currentManifestItem.value?.navigationNodeId)
const expandedCategories = ref(new Set<number>())
const toc = computed(() => normalizeToc(props.document.toc))

const categories = computed(() => {
  const mapped = props.navigation.map(category => ({
    id: category.id,
    name: category.label,
    articles: props.manifest.filter(article => article.navigationNodeId === category.id)
  }))
  const categorizedIds = new Set(props.navigation.map(item => item.id))
  const uncategorized = props.manifest.filter(article => !article.navigationNodeId || !categorizedIds.has(article.navigationNodeId))
  if (uncategorized.length) mapped.push({ id: 0, name: copy.value.uncategorized, articles: uncategorized })
  return mapped.filter(category => category.articles.length > 0)
})

const filteredCategories = computed(() => {
  if (!searchQuery.value.trim()) return categories.value
  const matchedKeys = new Set(searchResults.value.map(item => item.contentKey))
  return categories.value
    .map(category => ({ ...category, articles: category.articles.filter(article => matchedKeys.has(article.contentKey)) }))
    .filter(category => category.articles.length > 0)
})

const currentCategoryLabel = computed(() => {
  const category = categories.value.find(item => item.id === currentCategoryId.value)
  return category?.name || props.document.breadcrumbs?.at(-1) || copy.value.uncategorized
})

const readTime = computed(() => {
  const text = `${props.document.title} ${props.document.summary || ''} ${props.document.renderedHtml.replace(/<[^>]*>/g, ' ')}`
  const units = props.locale === 'zh-CN' ? text.replace(/\s/g, '').length / 400 : text.trim().split(/\s+/).length / 200
  return Math.max(1, Math.ceil(units))
})

const formatDate = (value?: string) => value
  ? new Date(value).toLocaleDateString(props.locale === 'zh-CN' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  : ''

const syncCategoryExpansion = (categoryId: number, event: Event) => {
  const details = event.currentTarget as HTMLDetailsElement
  const next = new Set(expandedCategories.value)
  if (details.open) next.add(categoryId)
  else next.delete(categoryId)
  expandedCategories.value = next
}

let searchTimer: ReturnType<typeof setTimeout> | undefined
watch(searchQuery, (value) => {
  if (searchTimer) clearTimeout(searchTimer)
  searchFailed.value = false
  if (!value.trim()) {
    searchResults.value = []
    searching.value = false
    expandedCategories.value = new Set(currentCategoryId.value === undefined ? [] : [currentCategoryId.value])
    return
  }
  searching.value = true
  searchTimer = setTimeout(async () => {
    try {
      searchResults.value = await search(props.locale, value.trim())
      expandedCategories.value = new Set(categories.value.map(category => category.id))
    } catch {
      searchResults.value = []
      searchFailed.value = true
    } finally {
      searching.value = false
    }
  }, 250)
})

watch(currentCategoryId, (value) => {
  if (!searchQuery.value.trim()) expandedCategories.value = new Set(value === undefined ? [] : [value])
}, { immediate: true })

const handleShortcut = (event: KeyboardEvent) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    searchInput.value?.focus()
  }
}

onMounted(() => window.addEventListener('keydown', handleShortcut))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleShortcut)
  if (searchTimer) clearTimeout(searchTimer)
})
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

.help-shell { margin: 0 auto; max-width: 1440px; padding: 0 40px; }
.help-center :deep(svg) { flex: 0 0 auto; height: 1em; width: 1em; }
.help-toolbar { align-items: center; border-bottom: 1px solid var(--help-border); display: flex; gap: 24px; justify-content: space-between; min-height: 72px; }
.help-breadcrumb { align-items: center; color: var(--help-muted); display: flex; font-size: 14px; gap: 10px; white-space: nowrap; }
.help-breadcrumb span:first-child { color: var(--help-ink); font-weight: 700; }
.breadcrumb-separator { color: #a5b0aa; }
.help-search { align-items: center; background: #fff; border: 1px solid var(--help-border); border-radius: 8px; color: #80908a; display: flex; gap: 10px; max-width: 400px; padding: 10px 12px; width: 100%; }
.help-search:focus-within { border-color: var(--help-accent); box-shadow: 0 0 0 3px rgba(16, 84, 70, 0.1); }
.help-search input { background: transparent; border: 0; color: var(--help-ink); flex: 1; font: inherit; min-width: 0; outline: 0; }
.help-search input::placeholder { color: #9aa7a1; }
.help-search kbd { background: var(--help-soft); border: 1px solid var(--help-border); border-radius: 4px; color: #8b9791; font-size: 11px; padding: 2px 5px; }
.mobile-nav-toggle, .mobile-nav-close { background: transparent; border: 0; color: var(--help-ink); cursor: pointer; display: none; font-size: 18px; }
.help-layout { display: grid; gap: 52px; grid-template-columns: 240px minmax(0, 1fr) 190px; padding-top: 36px; }
.help-sidebar { align-self: start; position: sticky; top: 112px; }
.sidebar-heading { align-items: center; display: flex; justify-content: space-between; }
.sidebar-title { align-items: center; color: var(--help-ink); display: flex; font-size: 16px; font-weight: 800; gap: 9px; }
.sidebar-title svg { color: var(--help-accent); }
.sidebar-caption { color: var(--help-muted); font-size: 12px; line-height: 1.6; margin: 8px 0 24px; }
.doc-navigation { display: flex; flex-direction: column; gap: 7px; }
.doc-category { border-bottom: 1px solid var(--help-border); padding-bottom: 7px; }
.category-toggle, .article-link { background: transparent; border: 0; cursor: pointer; font: inherit; text-align: left; width: 100%; }
.category-toggle { align-items: center; color: var(--help-ink); display: flex; font-size: 13px; font-weight: 700; justify-content: space-between; list-style: none; padding: 9px 0; }
.category-toggle::-webkit-details-marker { display: none; }
.category-toggle svg { color: #93a09a; font-size: 11px; transition: transform 0.2s ease; }
.category-toggle svg.is-expanded { transform: rotate(90deg); }
.category-articles { display: flex; flex-direction: column; gap: 2px; padding: 0 0 5px 10px; }
.article-link { border-left: 2px solid transparent; color: var(--help-muted); font-size: 12px; line-height: 1.45; padding: 7px 10px; text-decoration: none; }
.article-link:hover { color: var(--help-accent); }
.article-link.active { background: var(--help-accent-soft); border-left-color: var(--help-accent); color: var(--help-accent); font-weight: 700; }
.empty-search { color: var(--help-muted); font-size: 12px; line-height: 1.5; }
.sidebar-support { background: var(--help-soft); border: 1px solid var(--help-border); border-radius: 8px; margin-top: 28px; padding: 14px; }
.support-label { color: var(--help-muted); display: block; font-size: 11px; margin-bottom: 7px; }
.support-link { align-items: center; color: var(--help-accent); display: inline-flex; font-size: 12px; font-weight: 700; gap: 6px; text-decoration: none; }
.help-article { min-width: 0; max-width: 760px; }
.article-header { border-bottom: 1px solid var(--help-border); padding-bottom: 30px; }
.article-eyebrow { color: var(--help-accent); font-size: 12px; font-weight: 700; letter-spacing: 0.04em; margin-bottom: 14px; }
.article-eyebrow span { color: #aab6b0; margin: 0 6px; }
.article-header h1 { color: var(--help-ink); font-family: var(--font-body); font-size: clamp(30px, 3vw, 44px); font-weight: 800; letter-spacing: 0; line-height: 1.2; margin: 0 0 14px; }
.article-summary { color: var(--help-muted); font-size: 16px; line-height: 1.8; margin: 0; max-width: 680px; }
.article-meta { align-items: center; color: #9aa7a1; display: flex; font-size: 11px; gap: 9px; margin-top: 18px; }
.meta-dot { background: #b8c2bd; border-radius: 50%; height: 3px; width: 3px; }
.article-body { padding: 34px 0 10px; }
.article-footer { align-items: center; border-top: 1px solid var(--help-border); color: var(--help-muted); display: flex; font-size: 12px; gap: 14px; justify-content: space-between; margin-top: 30px; padding-top: 22px; }
.article-feedback { display: flex; gap: 7px; }
.article-feedback button { background: #fff; border: 1px solid var(--help-border); border-radius: 5px; color: var(--help-muted); cursor: pointer; font: inherit; padding: 6px 10px; }
.article-feedback button:hover { border-color: var(--help-accent); color: var(--help-accent); }
.help-toc { align-self: start; border-left: 1px solid var(--help-border); padding-left: 20px; position: sticky; top: 112px; }
.toc-title { color: var(--help-ink); font-size: 12px; font-weight: 800; margin: 0 0 13px; }
.help-toc nav { display: flex; flex-direction: column; gap: 10px; }
.help-toc a { color: var(--help-muted); font-size: 11px; line-height: 1.45; text-decoration: none; }
.help-toc a:hover { color: var(--help-accent); }
.help-toc a.toc-child { padding-left: 10px; }
.sr-only { border: 0; clip: rect(0, 0, 0, 0); height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; white-space: nowrap; width: 1px; }

@media (max-width: 1100px) {
  .help-shell { padding: 0 24px; }
  .help-layout { gap: 30px; grid-template-columns: 210px minmax(0, 1fr) 160px; }
}

@media (max-width: 800px) {
  .help-center { padding: 88px 0 60px; }
  .help-shell { padding: 0 20px; }
  .help-toolbar { gap: 12px; }
  .help-breadcrumb { flex: 0 1 40%; min-width: 0; overflow: hidden; }
  .help-breadcrumb span:last-child { overflow: hidden; text-overflow: ellipsis; }
  .help-search { flex: 1 1 auto; max-width: none; min-width: 0; width: auto; }
  .help-search kbd { display: none; }
  .mobile-nav-toggle, .mobile-nav-close { align-items: center; display: inline-flex; flex: 0 0 18px; justify-content: center; }
  .help-layout { display: block; padding-top: 24px; }
  .help-nav-backdrop { background: rgba(15, 30, 25, 0.35); inset: 0; position: fixed; z-index: 1100; }
  .help-sidebar { background: #fff; bottom: 0; box-shadow: 10px 0 30px rgba(15, 30, 25, 0.12); left: 0; max-width: 320px; overflow-y: auto; padding: 22px 20px; position: fixed; top: 0; transform: translateX(-105%); transition: transform 0.25s ease; width: 84vw; z-index: 1101; }
  .help-sidebar.is-open { transform: translateX(0); }
  .mobile-nav-close { color: var(--help-muted); }
  .help-article { max-width: none; }
  .help-toc { border-left: 0; border-top: 1px solid var(--help-border); margin-top: 36px; padding: 20px 0 0; position: static; }
  .help-toc nav { display: grid; gap: 8px 18px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 480px) {
  .help-breadcrumb { font-size: 12px; }
  .help-search input { font-size: 13px; }
  .article-header h1 { font-size: 30px; }
  .article-summary { font-size: 14px; }
  .article-meta { align-items: flex-start; flex-direction: column; gap: 5px; }
  .meta-dot { display: none; }
  .article-footer { align-items: flex-start; flex-direction: column; }
}
</style>
