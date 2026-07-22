<template>
  <div class="points-card">
    <div class="points-card-bg"></div>
    <div class="points-card-content">
      <div class="points-balance-section">
        <div class="points-label">Available Points</div>
        <div class="points-amount">{{ points.availablePoints.toLocaleString() }}</div>
        <div class="points-equivalent">≈ ${{ equivalentAmount.toFixed(2) }} USD</div>
      </div>
      
      <div class="points-divider"></div>
      
      <div class="points-level-section">
        <div class="level-info">
          <div class="level-badge">
            <font-awesome-icon :icon="['fas', 'medal']" class="badge-icon" />
            <span class="level-name">{{ points.levelCode + ' ' +points.levelName || 'Explorer' }}</span>
          </div>
          <div class="level-progress-text">
            {{ points.levelPoints.toLocaleString() }} / {{ points.nextLevelPoints.toLocaleString() }} points to next level
          </div>
        </div>
        <div class="level-progress-bar">
          <div 
            class="level-progress-fill" 
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
      </div>
      
      <div class="points-stats-row">
        <div class="stat-item">
          <div class="stat-value">{{ points.totalEarnedPoints.toLocaleString() }}</div>
          <div class="stat-label">Total Earned</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ points.totalSpentPoints.toLocaleString() }}</div>
          <div class="stat-label">Total Spent</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ points.frozenPoints.toLocaleString() }}</div>
          <div class="stat-label">Frozen</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ points.totalExpiredPoints.toLocaleString() }}</div>
          <div class="stat-label">Expired</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PointsAccount } from './types'

const props = defineProps<{
  points: PointsAccount
}>()

const equivalentAmount = computed(() => {
  return props.points.availablePoints * 0.001
})

const progressPercentage = computed(() => {
  if (props.points.nextLevelPoints === 0) return 0
  return Math.min(100, (props.points.levelPoints / props.points.nextLevelPoints) * 100)
})
</script>

<style scoped>
.points-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(16, 84, 70, 0.15);
}

.points-card-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #105446 0%, #1C846F 100%);
}

.points-card-content {
  position: relative;
  z-index: 1;
  padding: 40px;
  color: #ffffff;
}

.points-balance-section {
  text-align: center;
  margin-bottom: 32px;
}

.points-label {
  font-family: 'Roboto', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  font-weight: 500;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.points-amount {
  font-family: 'Didot', 'Playfair Display', Georgia, serif;
  font-size: 64px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -2px;
  margin-bottom: 8px;
}

.points-equivalent {
  font-family: 'Roboto', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 18px;
  font-weight: 500;
  opacity: 0.9;
}

.points-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  margin: 0 20px 32px;
}

.points-level-section {
  margin-bottom: 32px;
}

.level-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.level-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.15);
  padding: 8px 16px;
  border-radius: 20px;
}

.badge-icon {
  font-size: 16px;
  color: #CFF380;
}

.level-name {
  font-family: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  font-weight: 600;
}

.level-progress-text {
  font-family: 'Roboto', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 13px;
  opacity: 0.8;
}

.level-progress-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.level-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #CFF380, #A8E6CF);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.points-stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-family: 'Didot', 'Playfair Display', Georgia, serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 4px;
}

.stat-label {
  font-family: 'Roboto', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 12px;
  font-weight: 500;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (max-width: 768px) {
  .points-card-content {
    padding: 28px 20px;
  }
  
  .points-amount {
    font-size: 48px;
  }
  
  .points-equivalent {
    font-size: 16px;
  }
  
  .level-info {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
  
  .points-stats-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .stat-value {
    font-size: 24px;
  }
}
</style>