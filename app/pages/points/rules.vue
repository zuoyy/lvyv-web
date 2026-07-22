<template>
  <div class="points-container">
    <button class="mobile-menu-btn" @click="showSidebar = true">
      <font-awesome-icon :icon="['fas', 'bars']" />
    </button>
    
    <div class="sidebar-overlay" v-if="showSidebar" @click="showSidebar = false"></div>
    
    <ProfileSidebar 
      v-model:activeTab="activeTab" 
      :show="showSidebar"
      @close="showSidebar = false"
    />
    
    <main class="points-content">
      <div class="content-wrapper">
        <div class="page-header">
          <h1 class="page-title">Points Rules</h1>
          <p class="page-desc">Learn how to earn and spend your loyalty points</p>
        </div>
        
        <div class="rules-section">
          <div class="rules-card">
            <div class="rules-card-header">
              <font-awesome-icon :icon="['fas', 'gift']" class="rules-icon" />
              <h2 class="rules-card-title">How to Earn Points</h2>
            </div>
            
            <div class="rules-table-wrapper">
              <table class="rules-table">
                <thead>
                  <tr>
                    <th class="col-action">Action</th>
                    <th class="col-points">Points</th>
                    <th class="col-limit">Limit</th>
                    <th class="col-description">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(rule, index) in earnRules" :key="index" class="rule-row">
                    <td class="col-action">
                      <div class="action-cell">
                        <font-awesome-icon :icon="rule.icon" class="action-icon" />
                        <span class="action-text">{{ rule.action }}</span>
                      </div>
                    </td>
                    <td class="col-points">
                      <span class="points-value">+{{ rule.points }}</span>
                    </td>
                    <td class="col-limit">
                      <span class="limit-value">{{ rule.limit }}</span>
                    </td>
                    <td class="col-description">
                      <span class="description-text">{{ rule.description }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="rules-card rules-card-spending">
            <div class="rules-card-header spending-header">
              <font-awesome-icon :icon="['fas', 'shopping-cart']" class="rules-icon" />
              <h2 class="rules-card-title">How to Spend Points</h2>
            </div>
            
            <div class="rules-table-wrapper">
              <table class="rules-table">
                <thead>
                  <tr>
                    <th class="col-action">Spending Method</th>
                    <th class="col-points">Points Required</th>
                    <th class="col-description">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(rule, index) in spendRules" :key="index" class="rule-row">
                    <td class="col-action">
                      <div class="action-cell">
                        <font-awesome-icon :icon="rule.icon" class="action-icon" />
                        <span class="action-text">{{ rule.method }}</span>
                      </div>
                    </td>
                    <td class="col-points">
                      <span class="points-value spending-value">{{ rule.points }}</span>
                    </td>
                    <td class="col-description">
                      <span class="description-text">{{ rule.description }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="rules-card rules-card-exchange">
            <div class="rules-card-header exchange-header">
              <font-awesome-icon :icon="['fas', 'exchange-alt']" class="rules-icon" />
              <h2 class="rules-card-title">Exchange Rate Mechanism</h2>
            </div>
            
            <div class="exchange-content">
              <div class="exchange-section">
                <h3 class="exchange-subtitle">Anchor Currency</h3>
                <p class="exchange-text">United States Dollar (USD)</p>
              </div>
              
              <div class="exchange-section">
                <h3 class="exchange-subtitle">Fixed Rate</h3>
                <p class="exchange-text">100 points = $1.00 USD</p>
              </div>
              
              <div class="exchange-section">
                <h3 class="exchange-subtitle">Multi-Currency Display</h3>
                <p class="exchange-text">On the points detail page, the equivalent value is displayed based on the user's passport issuing country:</p>
                <ul class="currency-list">
                  <li class="currency-item">
                    <font-awesome-icon :icon="['fas', 'check']" class="currency-check" />
                    <span class="currency-text">US users: 100 points = $1.00</span>
                  </li>
                  <li class="currency-item">
                    <font-awesome-icon :icon="['fas', 'check']" class="currency-check" />
                    <span class="currency-text">European users: 100 points ≈ €0.93 (real-time rate)</span>
                  </li>
                  <li class="currency-item">
                    <font-awesome-icon :icon="['fas', 'check']" class="currency-check" />
                    <span class="currency-text">UK users: 100 points ≈ £0.79 (real-time rate)</span>
                  </li>
                </ul>
              </div>
              
              <div class="exchange-section">
                <h3 class="exchange-subtitle">Exchange Rate Source</h3>
                <p class="exchange-text">OceanPay exchange rate API, updated daily at UTC 00:00</p>
              </div>
              
              <div class="exchange-section">
                <h3 class="exchange-subtitle">Deduction Calculation</h3>
                <p class="exchange-text">When using points for deduction, the USD-equivalent amount is converted to the user's payment currency based on the real-time exchange rate at the time of payment.</p>
              </div>
            </div>
          </div>
          
          <div class="rules-card rules-card-level">
            <div class="rules-card-header level-header">
              <font-awesome-icon :icon="['fas', 'trophy']" class="rules-icon" />
              <h2 class="rules-card-title">Membership Level System</h2>
            </div>
            
            <div class="level-content">
              <div class="level-card" v-for="(level, index) in levels" :key="index">
                <div class="level-header-row">
                  <div class="level-badge-wrapper">
                    <font-awesome-icon :icon="level.icon" class="level-icon" />
                    <span class="level-name">{{ level.name }}</span>
                  </div>
                  <div class="level-rank">{{ index + 1 }}</div>
                </div>
                <div class="level-threshold">
                  <span class="threshold-label">Points Threshold:</span>
                  <span class="threshold-value">{{ level.threshold }}</span>
                </div>
                <div class="level-benefits">
                  <span class="benefits-label">Benefits:</span>
                  <ul class="benefits-list">
                    <li v-for="(benefit, idx) in level.benefits" :key="idx" class="benefit-item">
                      <font-awesome-icon :icon="['fas', 'star']" class="benefit-star" />
                      <span class="benefit-text">{{ benefit }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProfileSidebar from '~/components/profile/ProfileSidebar.vue'

const activeTab = ref('points')
const showSidebar = ref(false)

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

const earnRules: EarnRule[] = [
  {
    action: 'Daily Login',
    points: 5,
    limit: 'Once per day',
    description: 'Resets at UTC 00:00',
    icon: ['fas', 'sign-in-alt']
  },
  {
    action: 'Complete Registration',
    points: 50,
    limit: 'One-time',
    description: 'Automatically awarded after registration',
    icon: ['fas', 'user-plus']
  },
  {
    action: 'Submit a Wish',
    points: 20,
    limit: 'Each time',
    description: 'Awarded after successful wish submission',
    icon: ['fas', 'heart']
  },
  {
    action: 'Complete Payment',
    points: 100,
    limit: 'Per order',
    description: 'Awarded after successful payment',
    icon: ['fas', 'credit-card']
  },
  {
    action: 'Complete Trip',
    points: 200,
    limit: 'Per order',
    description: 'Automatically awarded 1 day after trip end date',
    icon: ['fas', 'plane']
  },
  {
    action: 'Publish Travel Note',
    points: 30,
    limit: 'Up to 3 times per day',
    description: 'Awarded after successful publication',
    icon: ['fas', 'book-open']
  },
  {
    action: 'Travel Note Featured',
    points: 100,
    limit: 'Unlimited',
    description: 'Awarded after admin marks as featured',
    icon: ['fas', 'star']
  },
  {
    action: 'Post Comment',
    points: 5,
    limit: 'Up to 10 times per day',
    description: 'Awarded after successful comment submission',
    icon: ['fas', 'comment']
  },
  {
    action: 'Answer Question',
    points: 10,
    limit: 'Up to 5 times per day',
    description: 'Awarded after successful answer submission',
    icon: ['fas', 'help-circle']
  },
  {
    action: 'Answer Accepted',
    points: 50,
    limit: 'Unlimited',
    description: 'Awarded after asker accepts the answer',
    icon: ['fas', 'check-circle']
  },
  {
    action: 'Complete Task',
    points: '20~100',
    limit: 'Based on difficulty',
    description: 'Awarded after task verification',
    icon: ['fas', 'clipboard-list']
  },
  {
    action: 'Invite Friend to Register',
    points: 50,
    limit: 'Per successful invite',
    description: 'Awarded after friend completes registration',
    icon: ['fas', 'share-alt']
  },
  {
    action: 'Friend\'s First Wish',
    points: 100,
    limit: 'Per successful invite',
    description: 'Awarded after friend submits their first wish',
    icon: ['fas', 'users']
  }
]

const spendRules: SpendRule[] = [
  {
    method: 'Order Amount Deduction',
    points: '100 points = $1.00 USD',
    description: 'Maximum 20% of order amount can be deducted per order',
    icon: ['fas', 'minus-circle']
  },
  {
    method: 'Redeem Exclusive Badges',
    points: '500-2000 points',
    description: 'Special event badges, cannot be obtained through tasks',
    icon: ['fas', 'award']
  },
  {
    method: 'Redeem Free Modification',
    points: '200 points/time',
    description: 'After exceeding 1 free modification, points can be used for redemption',
    icon: ['fas', 'edit']
  }
]

const levels: Level[] = [
  {
    name: 'Explorer',
    threshold: '0 - 999 points',
    benefits: ['Basic benefits'],
    icon: ['fas', 'compass']
  },
  {
    name: 'Discoverer',
    threshold: '1,000 - 4,999 points',
    benefits: ['Points deduction rate improved to 105 points = $1'],
    icon: ['fas', 'gem']
  },
  {
    name: 'Storyteller',
    threshold: '5,000 - 9,999 points',
    benefits: ['+1 free modification', 'Priority access to new features'],
    icon: ['fas', 'book']
  },
  {
    name: 'Legend',
    threshold: '10,000+ points',
    benefits: ['Points deduction rate improved to 110 points = $1', 'Exclusive customer service channel'],
    icon: ['fas', 'crown']
  }
]
</script>

<style scoped>
.points-container {
  min-height: 100vh;
  background: #f5f7f3;
  display: block;
}

.mobile-menu-btn {
  display: none;
  position: fixed;
  top: calc(80px + 16px);
  left: 16px;
  z-index: 1000;
  width: 44px;
  height: 44px;
  border: none;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  color: #105446;
  font-size: 20px;
  align-items: center;
  justify-content: center;
}

.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 950;
}

.points-content {
  margin-left: 200px;
  padding: 80px 48px;
  background: #ffffff;
  min-height: 100vh;
}

.content-wrapper {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  margin: 0;
  font-family: 'Poppins', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
}

.page-desc {
  margin: 8px 0 0;
  font-family: 'Roboto', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 15px;
  color: #666666;
}

.rules-section {
  margin-top: 16px;
}

.rules-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e5e5e5;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.rules-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 32px;
  background: linear-gradient(135deg, #105446 0%, #1C846F 100%);
}

.rules-icon {
  font-size: 24px;
  color: #CFF380;
}

.rules-card-title {
  margin: 0;
  font-family: 'Poppins', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
}

.rules-table-wrapper {
  overflow-x: auto;
}

.rules-table {
  width: 100%;
  border-collapse: collapse;
}

.rules-table thead {
  background: #f8faf6;
}

.rules-table th {
  padding: 16px 20px;
  text-align: left;
  font-family: 'Roboto', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #666666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.rules-table th.col-action {
  width: 20%;
}

.rules-table th.col-points {
  width: 12%;
}

.rules-table th.col-limit {
  width: 18%;
}

.rules-table th.col-description {
  width: 50%;
}

.rules-table tbody tr {
  border-bottom: 1px solid #f2f2f2;
  transition: background 0.2s;
}

.rules-table tbody tr:hover {
  background: #fafdf7;
}

.rules-table tbody tr:last-child {
  border-bottom: none;
}

.rules-table td {
  padding: 16px 20px;
}

.action-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-icon {
  font-size: 18px;
  color: #105446;
}

.action-text {
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: #1a1a1a;
}

.points-value {
  font-family: 'Didot', 'Playfair Display', Georgia, serif;
  font-size: 18px;
  font-weight: 700;
  color: #105446;
}

.limit-value {
  font-family: 'Roboto', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  color: #666666;
}

.description-text {
  font-family: 'Roboto', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  color: #808080;
  line-height: 1.5;
}

.rules-card-spending {
  margin-top: 24px;
}

.spending-header {
  background: linear-gradient(135deg, #d32f2f 0%, #e57373 100%);
}

.spending-value {
  color: #d32f2f;
}

.rules-card-exchange {
  margin-top: 24px;
}

.exchange-header {
  background: linear-gradient(135deg, #1565C0 0%, #42A5F5 100%);
}

.exchange-content {
  padding: 24px 32px;
}

.exchange-section {
  margin-bottom: 24px;
}

.exchange-section:last-child {
  margin-bottom: 0;
}

.exchange-subtitle {
  margin: 0 0 8px;
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
}

.exchange-text {
  margin: 0;
  font-family: 'Roboto', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  color: #666666;
  line-height: 1.5;
}

.currency-list {
  margin: 12px 0 0 20px;
  padding: 0;
}

.currency-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}

.currency-item:last-child {
  margin-bottom: 0;
}

.currency-check {
  font-size: 12px;
  color: #105446;
  flex-shrink: 0;
  margin-top: 2px;
}

.currency-text {
  font-family: 'Roboto', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  color: #666666;
}

.rules-card-level {
  margin-top: 24px;
}

.level-header {
  background: linear-gradient(135deg, #FF8F00 0%, #FFB300 100%);
}

.level-content {
  padding: 24px 32px;
}

.level-card {
  background: #fafdf7;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid #e8f5e9;
}

.level-card:last-child {
  margin-bottom: 0;
}

.level-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.level-badge-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.level-icon {
  font-size: 24px;
  color: #105446;
}

.level-name {
  font-family: 'Poppins', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.level-rank {
  font-family: 'Didot', 'Playfair Display', Georgia, serif;
  font-size: 32px;
  font-weight: 700;
  color: #CFF380;
  opacity: 0.5;
}

.level-threshold {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.threshold-label {
  font-family: 'Roboto', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #666666;
}

.threshold-value {
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #105446;
}

.level-benefits {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.benefits-label {
  font-family: 'Roboto', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #666666;
}

.benefits-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.benefit-item:last-child {
  margin-bottom: 0;
}

.benefit-star {
  font-size: 12px;
  color: #FFB300;
}

.benefit-text {
  font-family: 'Roboto', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  color: #666666;
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
  }
  
  .sidebar-overlay {
    display: block;
  }
  
  .points-content {
    margin-left: 0;
    padding: 24px;
    padding-top: 80px;
  }
  
  .rules-card-header {
    padding: 20px 24px;
  }
  
  .rules-card-title {
    font-size: 18px;
  }
  
  .rules-table th,
  .rules-table td {
    padding: 12px 16px;
    font-size: 13px;
  }
  
  .action-text {
    font-size: 14px;
  }
  
  .points-value {
    font-size: 16px;
  }
  
  .description-text {
    font-size: 13px;
  }
}
</style>