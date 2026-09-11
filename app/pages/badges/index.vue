<template>
  <AccountPageShell
    active-page="badges"
    title="My badges"
    description="Milestones, memories and a little pride in every journey."
    :ready="ready"
  >
    <!-- Top Error Notice -->
    <div v-if="error" role="alert" class="notice-card error-notice">
      <font-awesome-icon :icon="['fas', 'circle-exclamation']" class="notice-icon" />
      <div class="notice-text">
        <strong>Unable to load your collection</strong>
        <span>{{ error }}</span>
      </div>
      <button type="button" class="btn-retry" @click="load">
        <font-awesome-icon :icon="['fas', 'rotate-right']" />
        <span>Try again</span>
      </button>
    </div>

    <div v-if="actionError && !selected" role="alert" class="notice-card error-notice">
      <font-awesome-icon :icon="['fas', 'circle-exclamation']" class="notice-icon" />
      <div class="notice-text">
        <span>{{ actionError }}</span>
      </div>
    </div>

    <!-- Summary Overview Banner -->
    <section v-if="summary" class="badge-overview" aria-label="Badge summary">
      <div class="tier-card">
        <span class="tier-label">Current tier</span>
        <div class="tier-info">
          <div class="tier-icon-wrap">
            <img
              v-if="resolveBadgeMediaUrl(summary.currentLevelBadge?.iconUrl, summary.currentLevelBadge?.iconKey)"
              :src="resolveBadgeMediaUrl(summary.currentLevelBadge?.iconUrl, summary.currentLevelBadge?.iconKey) || ''"
              :alt="summary.account.levelName || summary.account.levelCode"
              class="tier-icon"
            >
            <font-awesome-icon v-else :icon="['fas', 'medal']" class="tier-fallback-icon" />
          </div>
          <div class="tier-meta">
            <strong>{{ summary.account.levelName || summary.account.levelCode }}</strong>
            <span class="tier-code">{{ summary.account.levelCode }}</span>
          </div>
        </div>
        <div class="tier-points-pill">
          <font-awesome-icon :icon="['fas', 'sparkles']" />
          <span>{{ summary.account.levelPoints.toLocaleString() }} level points</span>
        </div>
      </div>

      <div class="stats-card">
        <div class="stat-cell">
          <span class="stat-label">Badges earned</span>
          <strong class="stat-value">{{ summary.earned }}</strong>
          <span class="stat-sub">In your collection</span>
        </div>
        <div class="stat-cell">
          <span class="stat-label">Available to earn</span>
          <strong class="stat-value">{{ summary.available }}</strong>
          <span class="stat-sub">Upcoming milestones</span>
        </div>
        <div class="stat-cell">
          <span class="stat-label">Points to spend</span>
          <strong class="stat-value">{{ summary.account.availablePoints.toLocaleString() }}</strong>
          <span class="stat-sub">Ready for redemption</span>
        </div>
      </div>
    </section>

    <!-- Showcase Section (3 Slots) -->
    <section v-if="summary" class="showcase-section" aria-label="Your showcase">
      <div class="section-header">
        <div>
          <h2>Your Showcase</h2>
          <p>Highlight up to three badges on your traveler profile. Historical level badges represent milestones.</p>
        </div>
        <span class="showcase-badge-count">{{ summary.worn.length }} / 3 featured</span>
      </div>

      <div class="showcase-grid">
        <div
          v-for="(badge, index) in summary.worn"
          :key="badge.definition.id"
          class="showcase-slot occupied"
        >
          <div class="slot-art">
            <img
              v-if="resolveBadgeMediaUrl(badge.definition.iconUrl, badge.definition.iconKey)"
              :src="resolveBadgeMediaUrl(badge.definition.iconUrl, badge.definition.iconKey) || ''"
              :alt="api.name(badge.definition)"
              class="slot-img"
            >
            <font-awesome-icon v-else :icon="['fas', 'award']" class="slot-fallback" />
          </div>
          <div class="slot-info">
            <span class="slot-title">{{ api.name(badge.definition) }}</span>
            <span class="slot-pos">Slot {{ index + 1 }}</span>
          </div>
          <div class="slot-actions">
            <button
              type="button"
              class="slot-arrow-btn"
              :disabled="busy || index === 0"
              :aria-label="'Move ' + api.name(badge.definition) + ' left'"
              @click="move(index, -1)"
            >
              <font-awesome-icon :icon="['fas', 'arrow-left']" />
            </button>
            <button
              type="button"
              class="slot-arrow-btn"
              :disabled="busy || index === summary.worn.length - 1"
              :aria-label="'Move ' + api.name(badge.definition) + ' right'"
              @click="move(index, 1)"
            >
              <font-awesome-icon :icon="['fas', 'arrow-right']" />
            </button>
            <button
              type="button"
              class="slot-remove-btn"
              :disabled="busy"
              @click="toggleWear(badge)"
            >
              Remove
            </button>
          </div>
        </div>

        <!-- Empty Slot Placeholders -->
        <div
          v-for="emptyIndex in Math.max(0, 3 - (summary.worn.length || 0))"
          :key="'empty-' + emptyIndex"
          class="showcase-slot empty"
        >
          <div class="slot-empty-ring">
            <font-awesome-icon :icon="['fas', 'shield']" />
          </div>
          <div class="slot-empty-copy">
            <strong>Slot {{ (summary.worn.length || 0) + emptyIndex }} · Empty</strong>
            <span>Select any earned badge below to showcase here</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Filters & Controls Bar -->
    <div class="collection-controls">
      <div class="filter-group">
        <div class="select-wrapper">
          <label for="filter-category" class="filter-label">Collection</label>
          <select id="filter-category" v-model="category" class="filter-select" @change="changeFilter">
            <option value="">All Collections</option>
            <option value="NORMAL">Journey Achievements</option>
            <option value="LEVEL">Membership Milestones</option>
            <option value="EVENT">Special Events</option>
          </select>
        </div>

        <div class="select-wrapper">
          <label for="filter-state" class="filter-label">Status</label>
          <select id="filter-state" v-model="state" class="filter-select" @change="changeFilter">
            <option value="">All Statuses</option>
            <option value="earned">Earned</option>
            <option value="unearned">Not Yet Earned</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        class="btn-refresh"
        :disabled="loading"
        aria-label="Refresh badge collection"
        @click="load"
      >
        <font-awesome-icon :icon="['fas', 'rotate-right']" :class="{ 'spin-icon': loading }" />
        <span>Refresh</span>
      </button>
    </div>

    <!-- Collection Loading State -->
    <div v-if="loading" class="collection-state-card" role="status">
      <span class="state-spinner" />
      <strong>Loading your collection…</strong>
      <span>Retrieving achievements and milestone progress.</span>
    </div>

    <!-- Empty Collection State -->
    <div v-else-if="!items.length && !error" class="collection-state-card">
      <div class="empty-icon-box">
        <font-awesome-icon :icon="['fas', 'medal']" />
      </div>
      <strong>No badges found</strong>
      <p>No badges match your selected filters. New achievements will appear as they become available.</p>
      <button v-if="category || state" type="button" class="btn-clear-filters" @click="clearFilters">
        Reset filters
      </button>
    </div>

    <!-- Badges Grid -->
    <div v-else class="badge-grid" :aria-busy="loading">
      <article
        v-for="item in items"
        :key="item.definition.id"
        class="badge-card"
        :class="{ locked: item.holdingStatus !== 'EARNED' }"
        role="button"
        tabindex="0"
        @click="open(item)"
        @keydown.enter="open(item)"
      >
        <div class="card-art-col">
          <div class="badge-avatar-wrap">
            <img
              v-if="icon(item)"
              :src="icon(item) || ''"
              :alt="api.name(item.definition)"
              class="badge-avatar-img"
              loading="lazy"
            >
            <font-awesome-icon v-else :icon="['fas', 'medal']" class="badge-avatar-fallback" />

            <!-- Lock overlay if unearned -->
            <span v-if="item.holdingStatus !== 'EARNED'" class="lock-pip" title="Not yet earned">
              <font-awesome-icon :icon="['fas', 'lock']" />
            </span>
          </div>
        </div>

        <div class="card-body-col">
          <div class="card-top-row">
            <span class="category-pill">{{ categoryLabel(item.definition.category) }}</span>
            <span v-if="item.holdingStatus === 'EARNED' && !item.readTime" class="new-pill">NEW</span>
            <span class="status-tag" :class="statusBadge(item).type">
              <font-awesome-icon v-if="statusBadge(item).type === 'worn'" :icon="['fas', 'gem']" />
              <font-awesome-icon v-else-if="statusBadge(item).type === 'earned' || statusBadge(item).type === 'current'" :icon="['fas', 'check']" />
              <span>{{ statusBadge(item).text }}</span>
            </span>
          </div>

          <h3 class="badge-title">{{ api.name(item.definition) }}</h3>
          <p class="badge-description">{{ api.description(item.definition) }}</p>

          <!-- Automatic Acquisition Progress -->
          <div v-if="item.holdingStatus !== 'EARNED' && item.definition.acquisition === 'AUTO'" class="progress-block">
            <div class="progress-bar-track">
              <span
                class="progress-bar-fill"
                :style="{ width: `${Math.min(100, Math.round((item.progress / (item.definition.target || 1)) * 100))}%` }"
              />
            </div>
            <div class="progress-caption">
              <span>{{ requirement(item.definition) }}</span>
              <strong>{{ Math.min(item.progress, item.definition.target) }} / {{ item.definition.target }}</strong>
            </div>
          </div>

          <!-- Event Duration -->
          <div v-else-if="item.definition.category === 'EVENT'" class="meta-row">
            <font-awesome-icon :icon="['fas', 'calendar']" />
            <span>{{ eventStatus(item.definition) }} · Ends {{ formatDate(item.definition.endTime) }}</span>
          </div>

          <!-- Points Exchange info -->
          <div v-else-if="item.definition.acquisition === 'REDEEM' && item.holdingStatus !== 'EARNED'" class="meta-row points-meta">
            <font-awesome-icon :icon="['fas', 'coins']" />
            <span>{{ item.definition.price?.toLocaleString() }} points · {{ item.definition.stock == null ? 'Unlimited' : Math.max(0, item.definition.stock - item.definition.issued) + ' remaining' }}</span>
          </div>

          <!-- Static Requirement if manual/unearned -->
          <div v-else-if="item.holdingStatus !== 'EARNED'" class="meta-row requirement-meta">
            <font-awesome-icon :icon="['fas', 'circle-info']" />
            <span>{{ requirement(item.definition) }}</span>
          </div>
        </div>
      </article>
    </div>

    <!-- Pagination -->
    <AccountPagination :page="page" :size="20" :total="total" :loading="loading" @change="changePage" />

    <!-- Badge Detail Modal -->
    <div v-if="selected" class="modal-backdrop" @click.self="closeModal">
      <div class="badge-detail-modal" role="dialog" aria-modal="true" :aria-label="api.name(selected.definition)">
        <button
          type="button"
          class="modal-close-btn"
          aria-label="Close modal"
          @click="closeModal"
        >
          <font-awesome-icon :icon="['fas', 'xmark']" />
        </button>

        <div class="modal-badge-hero">
          <div class="hero-art-glow">
            <img
              v-if="icon(selected)"
              :src="icon(selected) || ''"
              :alt="api.name(selected.definition)"
              class="hero-icon-img"
            >
            <font-awesome-icon v-else :icon="['fas', 'medal']" class="hero-fallback-icon" />
          </div>
          <span class="modal-category-pill">{{ categoryLabel(selected.definition.category) }}</span>
          <h2 class="modal-title">{{ api.name(selected.definition) }}</h2>
          <p class="modal-desc">{{ api.description(selected.definition) }}</p>
        </div>

        <div class="modal-details-card">
          <div class="detail-row">
            <span class="detail-label">Unlock criteria</span>
            <strong class="detail-value">{{ requirement(selected.definition) }}</strong>
          </div>

          <div v-if="selected.definition.category === 'EVENT'" class="detail-row">
            <span class="detail-label">Event window</span>
            <span class="detail-value">{{ selected.definition.activityName }} · {{ eventStatus(selected.definition) }}<br>{{ formatDate(selected.definition.startTime) }} — {{ formatDate(selected.definition.endTime) }}</span>
          </div>

          <div v-if="selected.occurredTime || selected.earnedTime" class="detail-row">
            <span class="detail-label">Awarded on</span>
            <span class="detail-value">{{ formatDate(selected.occurredTime || selected.earnedTime) }} · {{ selected.source || 'Lvyv Journey' }}</span>
          </div>

          <div v-if="selected.holdingStatus !== 'EARNED' && selected.definition.acquisition === 'AUTO'" class="detail-row">
            <span class="detail-label">Your progress</span>
            <div class="modal-progress-wrap">
              <div class="progress-bar-track">
                <span
                  class="progress-bar-fill"
                  :style="{ width: `${Math.min(100, Math.round((selected.progress / (selected.definition.target || 1)) * 100))}%` }"
                />
              </div>
              <span class="modal-progress-num">{{ Math.min(selected.progress, selected.definition.target) }} / {{ selected.definition.target }}</span>
            </div>
          </div>
        </div>

        <!-- Action Error Alert -->
        <div v-if="actionError" role="alert" class="modal-error-notice">
          <font-awesome-icon :icon="['fas', 'circle-exclamation']" />
          <span>{{ actionError }}</span>
        </div>

        <!-- Modal Actions -->
        <div class="modal-actions-footer">
          <!-- Worn/Showcase Toggle -->
          <template v-if="selected.holdingStatus === 'EARNED'">
            <button
              type="button"
              class="btn-primary-action"
              :class="{ 'btn-secondary-action': isWorn(selected) }"
              :disabled="busy || (!isWorn(selected) && (summary?.worn.length || 0) >= 3)"
              @click="toggleWear(selected)"
            >
              <font-awesome-icon :icon="isWorn(selected) ? ['fas', 'xmark'] : ['fas', 'gem']" />
              <span>{{ isWorn(selected) ? 'Remove from Showcase' : 'Feature in Showcase' }}</span>
            </button>
            <p v-if="!isWorn(selected) && (summary?.worn.length || 0) >= 3" class="showcase-limit-hint">
              You already have 3 badges featured. Remove one before adding this.
            </p>
          </template>

          <!-- Points Redemption -->
          <template v-else-if="selected.definition.acquisition === 'REDEEM'">
            <p class="redeem-note">
              Exchange {{ selected.definition.price?.toLocaleString() }} points for this permanent collectible. Your lifetime tier points remain unchanged.
            </p>
            <button
              type="button"
              class="btn-primary-action"
              :disabled="busy || !canRedeem(selected)"
              @click="redeem"
            >
              <font-awesome-icon :icon="['fas', 'coins']" />
              <span>{{ busy ? 'Processing…' : `Confirm · ${selected.definition.price?.toLocaleString()} points` }}</span>
            </button>
            <p v-if="summary && summary.account.availablePoints < (selected.definition.price || 0)" class="points-insufficient-hint">
              You need {{ ((selected.definition.price || 0) - summary.account.availablePoints).toLocaleString() }} more points to redeem this badge.
            </p>
          </template>

          <button type="button" class="btn-cancel" @click="closeModal">
            Close
          </button>
        </div>
      </div>
    </div>
  </AccountPageShell>
</template>

<script setup lang="ts">
import AccountPageShell from '~/components/profile/AccountPageShell.vue'
import AccountPagination from '~/components/profile/AccountPagination.vue'
import type { BadgeDefinition, BadgeSummary, MemberBadge } from '~/composables/useBadges'
import { ApiRequestError } from '~/composables/useMemberAuth'

useNoIndex()
useHead({ title: 'My Badges - Lvyv Travel' })

const { auth, ready, initializeAccount } = useAccountPage('/badges')
const api = useBadges()

const summary = ref<BadgeSummary | null>(null)
const items = ref<MemberBadge[]>([])
const category = ref('')
const state = ref('')
const page = ref(1)
const total = ref(0)
const loading = ref(true)
const error = ref('')
const busy = ref(false)
const actionError = ref('')
const selected = ref<MemberBadge | null>(null)
const requestKeys = new Map<string, string>()

let generation = 0
let active = true

const load = async () => {
  const current = ++generation
  loading.value = true
  error.value = ''
  try {
    const [s, p] = await Promise.all([
      api.summary(),
      api.page(page.value, category.value, state.value)
    ])
    if (!active || current !== generation) return
    summary.value = s
    items.value = p.list
    total.value = p.total
  } catch (e) {
    if (current === generation) {
      error.value = e instanceof Error ? e.message : 'Unable to load badges.'
    }
  } finally {
    if (current === generation) {
      loading.value = false
    }
  }
}

const changePage = (value: number) => {
  page.value = value
  void load()
}

const changeFilter = () => changePage(1)

const clearFilters = () => {
  category.value = ''
  state.value = ''
  changePage(1)
}

const formatDate = (value?: string | null) => {
  if (!value) return ''
  try {
    return new Date(value).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return value
  }
}

const resolveBadgeMediaUrl = (url?: string | null, assetKey?: string | null) => {
  if (assetKey?.startsWith('asset://')) {
    return '/' + assetKey.substring('asset://'.length)
  }
  if (url) {
    const match = url.match(/https?:\/\/[^/]+(\/images\/.+)$/)
    if (match && match[1]) {
      return match[1]
    }
    return url
  }
  return ''
}

const icon = (b: MemberBadge) => resolveBadgeMediaUrl(b.definition.iconUrl, b.definition.iconKey)

const categoryLabel = (cat: string) => {
  switch (cat) {
    case 'NORMAL': return 'Achievement'
    case 'LEVEL': return 'Tier Milestone'
    case 'EVENT': return 'Special Event'
    default: return cat
  }
}

const eventStatus = (b: BadgeDefinition) => {
  const now = Date.now()
  const start = Date.parse(b.startTime || '')
  const end = Date.parse(b.endTime || '')
  if (start && now < start) return 'Upcoming'
  if (end && now >= end) return 'Ended'
  return 'Active'
}

const requirement = (b: BadgeDefinition) => {
  if (b.acquisition === 'MANUAL') return 'Awarded exclusively by the Lvyv curation team'
  if (b.acquisition === 'REDEEM') return `Redeemable with ${b.price?.toLocaleString() || 0} reward points`
  switch (b.ruleType) {
    case 'REGISTER': return 'Complete account registration'
    case 'WISH_COUNT': return `Submit ${b.target} travel wish${b.target > 1 ? 'es' : ''}`
    case 'TRIP_COUNT': return `Complete ${b.target} travel journey${b.target > 1 ? 's' : ''}`
    case 'TRIP_DAYS': return `Complete a journey spanning at least ${b.target} days`
    case 'CITY_COUNT': return `Explore and finish journeys across ${b.target} distinct cities`
    case 'LEVEL': return `Reach membership tier ${b.levelCode || ''}`
    default: return 'Complete the journey achievement'
  }
}

const isWorn = (b: MemberBadge) =>
  !!summary.value?.worn.some(w => w.definition.id === b.definition.id)

const statusBadge = (b: MemberBadge) => {
  if (b.holdingStatus === 'REVOKED') return { text: 'Revoked', type: 'revoked' }
  if (b.holdingStatus === 'EARNED') {
    if (isWorn(b)) return { text: 'In showcase', type: 'worn' }
    if (b.definition.category === 'LEVEL') {
      return b.definition.levelCode === summary.value?.account.levelCode
        ? { text: 'Current level', type: 'current' }
        : { text: 'Earned', type: 'earned' }
    }
    return { text: 'Earned', type: 'earned' }
  }
  if (b.definition.status !== 'PUBLISHED') return { text: 'Unavailable', type: 'locked' }
  if (b.definition.acquisition === 'REDEEM') return { text: 'Redeemable', type: 'redeem' }
  return { text: 'In progress', type: 'locked' }
}

const open = async (item: MemberBadge) => {
  actionError.value = ''
  selected.value = item
  try {
    const fresh = await api.detail(item.definition.id)
    if (!active || selected.value?.definition.id !== item.definition.id) return
    selected.value = fresh
    if (fresh.holdingStatus === 'EARNED' && !fresh.readTime) {
      await api.read(item.definition.id)
      await load()
    }
  } catch (e) {
    actionError.value = e instanceof Error ? e.message : 'Unable to load details.'
  }
}

const closeModal = () => {
  selected.value = null
  actionError.value = ''
}

const action = async (work: () => Promise<unknown>) => {
  if (busy.value) return
  busy.value = true
  actionError.value = ''
  try {
    await work()
    await load()
  } catch (e) {
    actionError.value = e instanceof Error ? e.message : 'Please try again.'
    if (e instanceof ApiRequestError && e.code === 409 && selected.value) {
      try {
        selected.value = await api.detail(selected.value.definition.id)
        await load()
      } catch {
        /* Preserve the original action error. */
      }
    }
  } finally {
    busy.value = false
  }
}

const toggleWear = (b: MemberBadge) => action(async () => {
  const ids = summary.value?.worn.map(w => w.definition.id) || []
  if (isWorn(b)) {
    await api.wear(ids.filter(id => id !== b.definition.id))
  } else {
    if (ids.length >= 3) return
    await api.wear([...ids, b.definition.id])
  }
})

const move = (index: number, direction: number) => action(async () => {
  const ids = summary.value?.worn.map(w => w.definition.id) || []
  const a = ids[index]
  const b = ids[index + direction]
  if (a === undefined || b === undefined) return
  ids[index] = b
  ids[index + direction] = a
  await api.wear(ids)
})

const canRedeem = (b: MemberBadge) =>
  !b.holdingStatus &&
  b.definition.status === 'PUBLISHED' &&
  eventStatus(b.definition) === 'Active' &&
  (b.definition.stock == null || b.definition.issued < b.definition.stock) &&
  (summary.value?.account.availablePoints || 0) >= (b.definition.price || 0)

const redeem = () => action(async () => {
  if (!selected.value) return
  const b = selected.value.definition
  const key = b.id + ':' + b.priceVersion
  if (!requestKeys.has(key)) requestKeys.set(key, crypto.randomUUID())
  await api.redeem(b, requestKeys.get(key)!)
  selected.value = await api.detail(b.id)
})

onMounted(async () => {
  const ok = await initializeAccount()
  if (ok && auth.token.value) {
    await load()
  }
})

watch(auth.token, () => {
  ++generation
  summary.value = null
  items.value = []
  selected.value = null
  requestKeys.clear()
})

onBeforeUnmount(() => {
  active = false
  ++generation
})
</script>

<style scoped>
/* Notice Banners */
.notice-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  margin-bottom: 24px;
  background: #fff;
  border: 1px solid #dfe5e1;
  border-radius: 8px;
  font-size: 13px;
}
.notice-card.error-notice {
  background: #fff6f5;
  border-color: #f0c3bf;
  color: #ad382d;
}
.notice-icon {
  font-size: 18px;
  flex-shrink: 0;
}
.notice-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}
.notice-text strong {
  font-size: 14px;
}
.btn-retry {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid #ad382d;
  background: #ad382d;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity .2s ease;
}
.btn-retry:hover {
  opacity: .9;
}

/* Overview Banner */
.badge-overview {
  display: grid;
  grid-template-columns: minmax(260px, .9fr) minmax(0, 1.4fr);
  min-height: 180px;
  border: 1px solid #d7e0da;
  background: #fff;
  box-shadow: 0 14px 34px rgba(25, 55, 45, .06);
  margin-bottom: 32px;
}
.tier-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 30px 34px;
  background: #174d40;
  color: #fff;
}
.tier-label {
  margin: 0 0 14px;
  color: #c9d8d2;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .08em;
}
.tier-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}
.tier-icon-wrap {
  width: 52px;
  height: 52px;
  flex: 0 0 52px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, .12);
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, .2);
}
.tier-icon {
  width: 38px;
  height: 38px;
  object-fit: contain;
}
.tier-fallback-icon {
  font-size: 24px;
  color: #c9e09d;
}
.tier-meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.tier-meta strong {
  font: 600 24px/1.1 'Playfair Display', Georgia, serif;
  color: #fff;
}
.tier-code {
  color: #a8cf92;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .05em;
}
.tier-points-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  padding: 6px 12px;
  background: rgba(255, 255, 255, .1);
  border-radius: 20px;
  color: #e2ede7;
  font-size: 12px;
}
.tier-points-pill svg {
  color: #c9e09d;
}

.stats-card {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  align-items: center;
  padding: 30px;
}
.stat-cell {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0 12px;
  border-right: 1px solid #e5ede8;
}
.stat-cell:last-child {
  border-right: none;
}
.stat-label {
  color: #7b8b83;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .06em;
}
.stat-value {
  color: #173f34;
  font: 600 36px/1 'Playfair Display', Georgia, serif;
}
.stat-sub {
  color: #8c9b93;
  font-size: 11px;
}

/* Showcase Section */
.showcase-section {
  background: #fbfdfc;
  border: 1px solid #dbe4df;
  border-radius: 12px;
  padding: 26px 30px;
  margin-bottom: 36px;
}
.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}
.section-header h2 {
  margin: 0;
  color: #173f34;
  font: 600 22px/1.2 'Playfair Display', Georgia, serif;
}
.section-header p {
  margin: 6px 0 0;
  color: #6f8077;
  font-size: 13px;
}
.showcase-badge-count {
  display: inline-flex;
  align-items: center;
  padding: 5px 12px;
  background: #eaf1ec;
  color: #275245;
  font-size: 12px;
  font-weight: 700;
  border-radius: 16px;
}

.showcase-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.showcase-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px 16px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid #dce4e0;
  box-shadow: 0 4px 12px rgba(23, 63, 52, .03);
  transition: transform .2s ease, box-shadow .2s ease;
}
.showcase-slot.occupied:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(23, 63, 52, .08);
}
.showcase-slot.empty {
  border: 1.5px dashed #cad6cf;
  background: rgba(255, 255, 255, .6);
  justify-content: center;
}
.slot-art {
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #f0f7f3 0%, #e2ece6 100%);
  border: 1px solid #c9d8d0;
  margin-bottom: 12px;
}
.slot-img {
  width: 44px;
  height: 44px;
  object-fit: contain;
}
.slot-fallback {
  font-size: 24px;
  color: #8da936;
}
.slot-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 14px;
  width: 100%;
}
.slot-title {
  color: #173f34;
  font-size: 14px;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.slot-pos {
  color: #86968e;
  font-size: 11px;
}
.slot-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.slot-arrow-btn {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border: 1px solid #d3ded8;
  background: #fff;
  color: #31443a;
  border-radius: 6px;
  cursor: pointer;
  font-size: 11px;
  transition: all .2s ease;
}
.slot-arrow-btn:hover:not(:disabled) {
  background: #174d40;
  color: #fff;
  border-color: #174d40;
}
.slot-arrow-btn:disabled {
  opacity: .35;
  cursor: default;
}
.slot-remove-btn {
  padding: 6px 12px;
  border: 1px solid #e0c8c5;
  background: #fff;
  color: #b3392d;
  font-size: 11px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all .2s ease;
}
.slot-remove-btn:hover:not(:disabled) {
  background: #b3392d;
  color: #fff;
}
.slot-remove-btn:disabled {
  opacity: .4;
  cursor: default;
}

.slot-empty-ring {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #eef4f0;
  color: #889a90;
  font-size: 18px;
  margin-bottom: 10px;
}
.slot-empty-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.slot-empty-copy strong {
  color: #55675f;
  font-size: 13px;
}
.slot-empty-copy span {
  color: #8b9a92;
  font-size: 11px;
  line-height: 1.4;
  max-width: 180px;
}

/* Controls Bar */
.collection-controls {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.filter-group {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
}
.select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.filter-label {
  color: #697a71;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .05em;
}
.filter-select {
  padding: 9px 14px;
  border: 1px solid #ccd8d0;
  border-radius: 6px;
  background: #fff;
  color: #173f34;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  min-width: 170px;
}
.filter-select:focus {
  outline: 2px solid #174d40;
  border-color: #174d40;
}
.btn-refresh {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  border: 1px solid #ccd8d0;
  background: #fff;
  color: #173f34;
  font-size: 13px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all .2s ease;
}
.btn-refresh:hover:not(:disabled) {
  background: #f2f7f4;
  border-color: #b5c7bc;
}
.btn-refresh:disabled {
  opacity: .5;
  cursor: default;
}
.spin-icon {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Empty / Loading States */
.collection-state-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 280px;
  padding: 40px 20px;
  border: 1px solid #dfe5e1;
  background: #fff;
  text-align: center;
  color: #6e7f76;
}
.collection-state-card strong {
  font-size: 17px;
  color: #213a2f;
}
.collection-state-card p,
.collection-state-card span {
  font-size: 13px;
  max-width: 360px;
  line-height: 1.5;
}
.empty-icon-box {
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #f0f6f2;
  color: #8da936;
  font-size: 26px;
  margin-bottom: 4px;
}
.state-spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #dfe7e2;
  border-top-color: #174d40;
  border-radius: 50%;
  animation: spin .7s linear infinite;
  margin-bottom: 6px;
}
.btn-clear-filters {
  margin-top: 6px;
  padding: 8px 16px;
  border: 1px solid #174d40;
  background: #174d40;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
}

/* Badges Grid */
.badge-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}
.badge-card {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 24px;
  border: 1px solid #dce4e0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(23, 63, 52, .03);
  cursor: pointer;
  transition: all .25s ease;
  position: relative;
  outline: none;
}
.badge-card:hover,
.badge-card:focus-visible {
  transform: translateY(-3px);
  border-color: #b8ccbf;
  box-shadow: 0 12px 30px rgba(23, 63, 52, .08);
}
.badge-card.locked {
  background: #fafbf9;
  border-color: #e4ebe6;
}
.badge-card.locked:hover {
  border-color: #cad8cf;
}

.card-art-col {
  flex: 0 0 76px;
}
.badge-avatar-wrap {
  position: relative;
  width: 76px;
  height: 76px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #f0f7f3 0%, #e2ede7 100%);
  border: 1px solid #cad8cf;
}
.locked .badge-avatar-wrap {
  background: #edf1ee;
  border-color: #dce3df;
}
.badge-avatar-img {
  width: 58px;
  height: 58px;
  object-fit: contain;
  transition: filter .25s ease, opacity .25s ease;
}
.locked .badge-avatar-img {
  filter: grayscale(0.85);
  opacity: .5;
}
.badge-avatar-fallback {
  font-size: 34px;
  color: #8da936;
}
.locked .badge-avatar-fallback {
  color: #8fa097;
  opacity: .6;
}
.lock-pip {
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #54655d;
  border: 2px solid #fff;
  color: #fff;
  font-size: 10px;
}

.card-body-col {
  flex: 1;
  min-width: 0;
}
.card-top-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}
.category-pill {
  color: #62746c;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .05em;
}
.new-pill {
  padding: 2px 7px;
  background: #eef8d5;
  color: #496623;
  font-size: 10px;
  font-weight: 800;
  border-radius: 12px;
  letter-spacing: .04em;
}
.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 700;
  border-radius: 12px;
  margin-left: auto;
}
.status-tag.worn {
  background: #e2ede7;
  color: #1a5142;
}
.status-tag.earned,
.status-tag.current {
  background: #eaf3e3;
  color: #426b2b;
}
.status-tag.redeem {
  background: #fdf5e7;
  color: #926615;
}
.status-tag.locked {
  background: #edf2ee;
  color: #72827a;
}
.status-tag.revoked {
  background: #fdeeee;
  color: #a8382c;
}

.badge-title {
  margin: 0 0 6px;
  color: #173f34;
  font: 600 18px/1.25 'Playfair Display', Georgia, serif;
}
.badge-description {
  margin: 0 0 12px;
  color: #64756c;
  font-size: 13px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Progress & Meta */
.progress-block {
  margin-top: 8px;
}
.progress-bar-track {
  height: 6px;
  background: #e5ece7;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 6px;
}
.progress-bar-fill {
  display: block;
  height: 100%;
  background: #8fae3d;
  border-radius: 3px;
  transition: width .4s ease;
}
.progress-caption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 11px;
  color: #728279;
}
.progress-caption strong {
  color: #2a4136;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #75867d;
  margin-top: 6px;
}
.meta-row svg {
  color: #8da936;
}
.meta-row.points-meta {
  color: #7f601b;
}
.meta-row.points-meta svg {
  color: #d19927;
}

/* Modal Styling */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1500;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(11, 28, 22, .58);
  backdrop-filter: blur(4px);
}
.badge-detail-modal {
  position: relative;
  width: min(520px, calc(100vw - 36px));
  max-height: calc(100dvh - 50px);
  overflow-y: auto;
  padding: 36px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 24px 70px rgba(8, 28, 20, .3);
  color: #213a2f;
}
.modal-close-btn {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border: 0;
  background: #f0f4f1;
  color: #55675e;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
  transition: background .2s ease, color .2s ease;
}
.modal-close-btn:hover {
  background: #174d40;
  color: #fff;
}

.modal-badge-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 24px;
}
.hero-art-glow {
  width: 104px;
  height: 104px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #f2f8f4 0%, #e1eee6 100%);
  border: 2px solid #cad8cf;
  box-shadow: 0 8px 24px rgba(23, 77, 64, .12);
  margin-bottom: 16px;
}
.hero-icon-img {
  width: 80px;
  height: 80px;
  object-fit: contain;
}
.hero-fallback-icon {
  font-size: 44px;
  color: #8da936;
}
.modal-category-pill {
  padding: 3px 10px;
  background: #eef4f0;
  color: #496356;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .06em;
  border-radius: 12px;
  margin-bottom: 10px;
}
.modal-title {
  margin: 0 0 10px;
  color: #173f34;
  font: 600 26px/1.2 'Playfair Display', Georgia, serif;
}
.modal-desc {
  margin: 0;
  color: #64756c;
  font-size: 14px;
  line-height: 1.6;
  max-width: 420px;
}

.modal-details-card {
  background: #fbfdfc;
  border: 1px solid #dce5e0;
  border-radius: 10px;
  padding: 18px 20px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.detail-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.detail-label {
  color: #7b8d83;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .06em;
}
.detail-value {
  color: #213a2f;
  font-size: 13px;
  line-height: 1.5;
}
.modal-progress-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
}
.modal-progress-wrap .progress-bar-track {
  flex: 1;
  margin-bottom: 0;
}
.modal-progress-num {
  font-size: 12px;
  font-weight: 700;
  color: #173f34;
  white-space: nowrap;
}

.modal-error-notice {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #fff5f5;
  border: 1px solid #f2c7c4;
  color: #b3392d;
  font-size: 13px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.modal-actions-footer {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.btn-primary-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 13px 20px;
  border: 1px solid #174d40;
  background: #174d40;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  transition: all .2s ease;
}
.btn-primary-action:hover:not(:disabled) {
  background: #123e33;
}
.btn-primary-action:disabled {
  opacity: .5;
  cursor: default;
}
.btn-primary-action.btn-secondary-action {
  background: #fff;
  border-color: #d1ded6;
  color: #b3392d;
}
.btn-primary-action.btn-secondary-action:hover:not(:disabled) {
  background: #fff5f5;
  border-color: #f2c7c4;
}

.btn-cancel {
  width: 100%;
  padding: 11px 20px;
  border: 1px solid #dce4e0;
  background: #fff;
  color: #55675f;
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: background .2s ease;
}
.btn-cancel:hover {
  background: #f2f7f4;
}

.redeem-note {
  margin: 0 0 4px;
  font-size: 12px;
  color: #6e7f76;
  text-align: center;
  line-height: 1.5;
}
.showcase-limit-hint,
.points-insufficient-hint {
  margin: 0;
  font-size: 12px;
  color: #b54538;
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .badge-overview {
    grid-template-columns: 1fr;
  }
  .tier-card {
    padding: 24px;
  }
  .stats-card {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 20px 24px;
  }
  .stat-cell {
    border-right: none;
    border-bottom: 1px solid #e5ede8;
    padding: 0 0 14px;
  }
  .stat-cell:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  .showcase-grid {
    grid-template-columns: 1fr;
  }
  .badge-grid {
    grid-template-columns: 1fr;
  }
  .badge-card {
    padding: 18px;
  }
  .collection-controls {
    flex-direction: column;
    align-items: stretch;
  }
  .filter-group {
    flex-direction: column;
    align-items: stretch;
  }
  .filter-select {
    width: 100%;
  }
  .btn-refresh {
    justify-content: center;
  }
  .badge-detail-modal {
    padding: 28px 20px;
  }
}
</style>
