<template>
  <section class="points-overview" aria-label="Points balance">
    <div class="balance-block">
      <p>Available points</p>
      <strong>{{ points.availablePoints.toLocaleString() }}</strong>
      <span>About ${{ equivalentAmount.toFixed(2) }} USD in travel value</span>
    </div>
    <div class="level-block">
      <div class="level-heading"><span><font-awesome-icon :icon="['fas', 'medal']" />{{ levelName }}</span><small>{{ progressLabel }}</small></div>
      <div class="progress-track" role="progressbar" :aria-valuenow="progressPercentage" aria-valuemin="0" aria-valuemax="100"><span :style="{ width: `${progressPercentage}%` }" /></div>
      <div class="points-stats">
        <div><strong>{{ points.totalEarnedPoints.toLocaleString() }}</strong><span>Earned</span></div>
        <div><strong>{{ points.totalSpentPoints.toLocaleString() }}</strong><span>Spent</span></div>
        <div><strong>{{ points.frozenPoints.toLocaleString() }}</strong><span>Frozen</span></div>
        <div><strong>{{ points.totalExpiredPoints.toLocaleString() }}</strong><span>Expired</span></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { PointsAccount } from './types'
const props = defineProps<{ points: PointsAccount }>()
const equivalentAmount = computed(() => props.points.availablePoints * 0.001)
const levelName = computed(() => [props.points.levelCode, props.points.levelName].filter(Boolean).join(' ') || 'Explorer')
const progressPercentage = computed(() => props.points.nextLevelPoints > 0 ? Math.min(100, Math.round((props.points.levelPoints / props.points.nextLevelPoints) * 100)) : 100)
const progressLabel = computed(() => props.points.nextLevelPoints > 0 ? `${props.points.levelPoints.toLocaleString()} / ${props.points.nextLevelPoints.toLocaleString()} to next level` : 'Highest level reached')
</script>

<style scoped>
.points-overview { display: grid; grid-template-columns: minmax(230px, .8fr) minmax(0, 1.5fr); min-height: 230px; border: 1px solid #d7e0da; background: #fff; box-shadow: 0 14px 34px rgba(25,55,45,.06); }
.balance-block { display: flex; flex-direction: column; justify-content: center; padding: 34px; background: #174d40; color: #fff; }.balance-block p { margin: 0 0 10px; color: #c9d8d2; font-size: 10px; font-weight: 800; text-transform: uppercase; }.balance-block strong { font: 600 54px/1 'Playfair Display', Georgia, serif; }.balance-block > span { margin-top: 10px; color: #cbd9d4; font-size: 11px; }
.level-block { display: flex; flex-direction: column; justify-content: center; padding: 30px; }.level-heading { display: flex; align-items: center; justify-content: space-between; gap: 20px; }.level-heading > span { display: flex; align-items: center; gap: 8px; color: #304239; font-size: 13px; font-weight: 800; }.level-heading svg { color: #8da936; }.level-heading small { color: #87938c; font-size: 10px; }
.progress-track { height: 7px; margin-top: 13px; overflow: hidden; background: #e5eae6; }.progress-track span { display: block; height: 100%; background: #9fbe4d; transition: width .4s ease; }
.points-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-top: 31px; }.points-stats div { display: flex; flex-direction: column; gap: 5px; }.points-stats strong { color: #2f4138; font: 600 20px/1 'Playfair Display', Georgia, serif; }.points-stats span { color: #89958f; font-size: 9px; font-weight: 700; text-transform: uppercase; }
@media (max-width: 700px) { .points-overview { grid-template-columns: 1fr; }.balance-block { padding: 28px; }.balance-block strong { font-size: 46px; }.level-block { padding: 25px 22px; }.level-heading { align-items: flex-start; flex-direction: column; gap: 6px; }.points-stats { grid-template-columns: repeat(2, 1fr); gap: 20px; } }
</style>
