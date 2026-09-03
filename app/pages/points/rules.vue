<template>
  <AccountPageShell
    active-page="points"
    kicker="Loyalty"
    title="Points rules"
    description="A clear view of how points are earned, spent and tied to membership levels."
    :ready="ready"
  >
    <template #actions>
      <NuxtLink class="back-link" to="/points">
        <font-awesome-icon :icon="['fas', 'arrow-left']" />
        Back to points
      </NuxtLink>
    </template>

    <div v-if="loadingAccount" class="content-state" role="status">
      <span class="state-spinner" />
      Loading rules...
    </div>
    <div v-else-if="accountError" class="content-state error-state">
      <font-awesome-icon :icon="['fas', 'circle-exclamation']" />
      <strong>We could not load your account.</strong>
      <span>{{ accountError }}</span>
      <button type="button" @click="reloadAccount">Try again</button>
    </div>

    <section v-else class="rules-page">
      <div class="rules-summary">
        <article v-for="item in summaryItems" :key="item.label" class="summary-card">
          <font-awesome-icon :icon="item.icon" class="summary-icon" />
          <div>
            <p>{{ item.label }}</p>
            <strong>{{ item.value }}</strong>
          </div>
        </article>
      </div>

      <section class="rules-block">
        <header class="block-header">
          <div>
            <p>Earn</p>
            <h2>How points are earned</h2>
          </div>
          <span>Activities update after verification</span>
        </header>

        <div class="rule-grid">
          <article v-for="rule in earnRules" :key="rule.action" class="rule-card">
            <div class="rule-card-top">
              <span class="rule-icon-wrap"><font-awesome-icon :icon="rule.icon" /></span>
              <div>
                <h3>{{ rule.action }}</h3>
                <p>{{ rule.description }}</p>
              </div>
            </div>
            <dl class="rule-meta">
              <div>
                <dt>Points</dt>
                <dd>{{ rule.points }}</dd>
              </div>
              <div>
                <dt>Limit</dt>
                <dd>{{ rule.limit }}</dd>
              </div>
            </dl>
          </article>
        </div>
      </section>

      <section class="rules-block">
        <header class="block-header">
          <div>
            <p>Spend</p>
            <h2>How points are spent</h2>
          </div>
          <span>Redemptions follow the account balance</span>
        </header>

        <div class="spend-list">
          <article v-for="rule in spendRules" :key="rule.method" class="spend-card">
            <div class="rule-card-top">
              <span class="rule-icon-wrap muted"><font-awesome-icon :icon="rule.icon" /></span>
              <div>
                <h3>{{ rule.method }}</h3>
                <p>{{ rule.description }}</p>
              </div>
            </div>
            <strong class="spend-points">{{ rule.points }}</strong>
          </article>
        </div>
      </section>

      <section class="rules-columns">
        <article class="rules-block rules-panel">
          <header class="block-header">
            <div>
              <p>Conversion</p>
              <h2>Exchange rate</h2>
            </div>
          </header>

          <div class="info-list">
            <div v-for="item in exchangeItems" :key="item.label" class="info-row">
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
            </div>
          </div>

          <p class="panel-note">
            Conversion values are shown in USD first, then adapted to the user's payment currency at checkout.
          </p>
        </article>

        <article class="rules-block rules-panel">
          <header class="block-header">
            <div>
              <p>Levels</p>
              <h2>Membership tiers</h2>
            </div>
            <span>Progress is based on accumulated level points</span>
          </header>

          <div class="level-list">
            <div v-for="(level, index) in levels" :key="level.name" class="level-item">
              <div class="level-head">
                <div class="level-name-wrap">
                  <span class="level-index">{{ index + 1 }}</span>
                  <div>
                    <strong>{{ level.name }}</strong>
                    <p>{{ level.threshold }}</p>
                  </div>
                </div>
                <font-awesome-icon :icon="level.icon" class="level-icon" />
              </div>

              <ul class="benefit-list">
                <li v-for="benefit in level.benefits" :key="benefit">
                  <font-awesome-icon :icon="['fas', 'check']" />
                  <span>{{ benefit }}</span>
                </li>
              </ul>
            </div>
          </div>
        </article>
      </section>
    </section>
  </AccountPageShell>
</template>

<script setup lang="ts">
import AccountPageShell from '~/components/profile/AccountPageShell.vue'

useNoIndex()

interface SummaryItem {
  label: string
  value: string
  icon: string[]
}

interface EarnRule {
  action: string
  points: string | number
  limit: string
  description: string
  icon: string[]
}

interface SpendRule {
  method: string
  points: string
  description: string
  icon: string[]
}

interface Level {
  name: string
  threshold: string
  benefits: string[]
  icon: string[]
}

const { ready, accountError, initializeAccount } = useAccountPage('/points/rules')
const loadingAccount = ref(false)

const summaryItems: SummaryItem[] = [
  { label: 'Anchor currency', value: 'USD', icon: ['fas', 'globe'] },
  { label: 'Fixed rate', value: '100 points = $1.00', icon: ['fas', 'scale-balanced'] },
  { label: 'Redemption', value: 'Up to 20% per order', icon: ['fas', 'ticket-simple'] },
]

const earnRules: EarnRule[] = [
  { action: 'Daily login', points: 5, limit: 'Once per day', description: 'Resets at UTC 00:00.', icon: ['fas', 'arrow-right-to-bracket'] },
  { action: 'Complete registration', points: 50, limit: 'One time', description: 'Awarded after signup is confirmed.', icon: ['fas', 'user-plus'] },
  { action: 'Submit a wish', points: 20, limit: 'Each submission', description: 'Awarded after the wish is created successfully.', icon: ['fas', 'heart'] },
  { action: 'Complete payment', points: 100, limit: 'Per order', description: 'Awarded after payment succeeds.', icon: ['fas', 'credit-card'] },
  { action: 'Complete trip', points: 200, limit: 'Per order', description: 'Awarded one day after the trip ends.', icon: ['fas', 'plane'] },
]

const spendRules: SpendRule[] = [
  { method: 'Order amount deduction', points: '100 points = $1.00 USD', description: 'Use points to offset part of an order.', icon: ['fas', 'circle-minus'] },
  { method: 'Redeem exclusive badges', points: '500-2000 points', description: 'Special event rewards with limited availability.', icon: ['fas', 'award'] },
  { method: 'Redeem free modification', points: '200 points / time', description: 'Use points after the free modification quota is used.', icon: ['fas', 'pen-to-square'] },
]

const exchangeItems = [
  { label: 'Base value', value: '100 points = $1.00 USD' },
  { label: 'Reference source', value: 'OceanPay exchange rate API' },
  { label: 'Update cycle', value: 'Daily at UTC 00:00' },
  { label: 'Checkout rule', value: 'Converted using the live payment currency rate' },
]

const levels: Level[] = [
  { name: 'Explorer', threshold: '0 - 999 points', benefits: ['Basic benefits'], icon: ['fas', 'compass'] },
  { name: 'Discoverer', threshold: '1,000 - 4,999 points', benefits: ['Points deduction rate improves to 105 points = $1'], icon: ['fas', 'gem'] },
  { name: 'Storyteller', threshold: '5,000 - 9,999 points', benefits: ['+1 free modification', 'Priority access to new features'], icon: ['fas', 'book'] },
  { name: 'Legend', threshold: '10,000+ points', benefits: ['Points deduction rate improves to 110 points = $1', 'Exclusive customer service channel'], icon: ['fas', 'crown'] },
]

const reloadAccount = async () => {
  loadingAccount.value = true
  try {
    await initializeAccount()
  } finally {
    loadingAccount.value = false
  }
}

onMounted(async () => {
  await reloadAccount()
})
</script>

<style scoped>
.back-link {
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 14px;
  border: 1px solid #cad3ce;
  background: #fff;
  color: #174d40;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
}

.rules-page {
  display: grid;
  gap: 18px;
}

.rules-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.summary-card,
.rule-card,
.spend-card,
.rules-panel {
  border: 1px solid #dfe5e1;
  background: #fff;
}

.summary-card {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
}

.summary-icon {
  flex: 0 0 auto;
  font-size: 18px;
  color: #174d40;
}

.summary-card p,
.block-header p,
.rule-card-top p,
.spend-card p,
.level-head p,
.panel-note {
  margin: 0;
  color: #6c7872;
  font-size: 12px;
  line-height: 1.5;
}

.summary-card strong {
  display: block;
  margin-top: 4px;
  color: #163e34;
  font-size: 15px;
  line-height: 1.25;
}

.rules-block {
  padding: 22px;
  border: 1px solid #dfe5e1;
  background: #fff;
}

.block-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.block-header h2 {
  margin: 2px 0 0;
  color: #163e34;
  font-size: 22px;
  line-height: 1.2;
}

.block-header span {
  color: #7c8882;
  font-size: 12px;
  white-space: nowrap;
}

.rule-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.rule-card,
.spend-card {
  min-width: 0;
  padding: 18px;
}

.rule-card-top {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.rule-card-top h3,
.spend-card h3 {
  margin: 0;
  color: #173f34;
  font-size: 16px;
  line-height: 1.25;
}

.rule-card-top p {
  margin-top: 5px;
}

.rule-icon-wrap {
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #eaf2ed;
  color: #174d40;
}

.rule-icon-wrap.muted {
  background: #eef1ef;
  color: #4a5b54;
}

.rule-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin: 16px 0 0;
}

.rule-meta div {
  min-width: 0;
  padding-top: 12px;
  border-top: 1px solid #edf1ee;
}

.rule-meta dt {
  color: #7a8680;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.rule-meta dd {
  margin: 4px 0 0;
  color: #1d2d28;
  font-size: 14px;
  font-weight: 700;
}

.spend-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.spend-card {
  display: grid;
  gap: 18px;
}

.spend-points {
  color: #174d40;
  font-size: 20px;
  line-height: 1.15;
}

.rules-columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.rules-panel {
  display: grid;
  gap: 16px;
}

.info-list {
  display: grid;
  gap: 10px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 14px;
  border: 1px solid #edf1ee;
  background: #f8faf8;
}

.info-row span {
  color: #6c7872;
  font-size: 12px;
}

.info-row strong {
  color: #173f34;
  font-size: 13px;
  text-align: right;
}

.panel-note {
  padding-top: 2px;
}

.level-list {
  display: grid;
  gap: 12px;
}

.level-item {
  padding: 16px;
  border: 1px solid #edf1ee;
  background: #fafdf9;
}

.level-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.level-name-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.level-index {
  width: 28px;
  height: 28px;
  flex: 0 0 28px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #174d40;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}

.level-name-wrap strong {
  display: block;
  color: #173f34;
  font-size: 15px;
}

.level-icon {
  color: #b68816;
  font-size: 18px;
}

.benefit-list {
  display: grid;
  gap: 8px;
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
}

.benefit-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #5d6b65;
  font-size: 13px;
  line-height: 1.5;
}

.benefit-list svg {
  margin-top: 3px;
  color: #174d40;
}

.content-state {
  min-height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid #dfe5e1;
  background: #fff;
  color: #75827c;
  font-size: 13px;
  text-align: center;
}

.content-state strong {
  color: #2e4137;
  font-size: 16px;
}

.content-state button {
  margin-top: 4px;
  padding: 10px 14px;
  border: 1px solid #174d40;
  background: #174d40;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}

.error-state > svg {
  color: #a33e35;
  font-size: 24px;
}

.state-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid #ccd5d0;
  border-top-color: #174d40;
  border-radius: 50%;
  animation: spin .7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1024px) {
  .rules-summary,
  .rules-columns {
    grid-template-columns: 1fr;
  }

  .spend-list,
  .rule-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .rules-block {
    padding: 18px;
  }

  .block-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .block-header span {
    white-space: normal;
  }

  .rule-card,
  .spend-card,
  .level-item {
    padding: 16px;
  }

  .rule-meta {
    grid-template-columns: 1fr;
  }

  .info-row {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
