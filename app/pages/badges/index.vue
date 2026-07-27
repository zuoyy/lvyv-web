<template>
  <AccountPageShell
    active-page="badges"
    kicker="Milestones"
    title="My badges"
    description="Collect small reminders of the places, people and stories that shaped your travels."
    :ready="ready"
  >
    <div class="badge-summary">
      <div><strong>{{ earnedBadges }}</strong><span>Earned</span></div>
      <div><strong>{{ badges.length }}</strong><span>Available</span></div>
      <div class="summary-copy"><font-awesome-icon :icon="['fas', 'medal']" /><span>Your badge collection grows as your Lvyv journey unfolds.</span></div>
    </div>

    <div class="badge-heading"><div><h2>Badge collection</h2><p>Every badge is a story worth keeping.</p></div><span>{{ earnedBadges }} / {{ badges.length }}</span></div>
    <div class="badge-grid">
      <article v-for="badge in badges" :key="badge.id" class="badge-item" :class="{ locked: !badge.earned }">
        <div class="badge-art" :class="badge.tone"><font-awesome-icon :icon="badge.icon" /><span v-if="!badge.earned" class="lock-mark"><font-awesome-icon :icon="['fas', 'lock']" /></span></div>
        <div class="badge-copy"><div class="badge-name-row"><h3>{{ badge.name }}</h3><span v-if="badge.earned">Earned</span></div><p>{{ badge.description }}</p><small>{{ badge.earned ? badge.earnedText : badge.requirement }}</small></div>
      </article>
    </div>

    <div class="badges-note"><font-awesome-icon :icon="['fas', 'circle-exclamation']" /><span>Badge achievements will become available as journey missions are introduced.</span></div>
  </AccountPageShell>
</template>

<script setup lang="ts">
import AccountPageShell from '~/components/profile/AccountPageShell.vue'

interface Badge { id: string; name: string; description: string; requirement: string; earned: boolean; earnedText?: string; tone: string; icon: string[] }
const { ready, initializeAccount } = useAccountPage('/badges')
const badges: Badge[] = [
  { id: 'first-wish', name: 'First Spark', description: 'Turned a travel idea into your first wish.', requirement: 'Submit your first wish', earned: false, tone: 'lime', icon: ['fas', 'heart'] },
  { id: 'city-story', name: 'City Listener', description: 'Made room for the stories hidden in a city.', requirement: 'Complete a delivered journey', earned: false, tone: 'forest', icon: ['fas', 'landmark'] },
  { id: 'food-friend', name: 'Table for Two', description: 'Found connection over a local meal.', requirement: 'Explore a local food experience', earned: false, tone: 'warm', icon: ['fas', 'utensils'] },
  { id: 'slow-traveller', name: 'Slow Traveller', description: 'Chose a day with nowhere else to be.', requirement: 'Complete a three-day journey', earned: false, tone: 'blue', icon: ['fas', 'mountain'] },
  { id: 'story-keeper', name: 'Story Keeper', description: 'Shared a moment worth remembering.', requirement: 'Publish your first travel note', earned: false, tone: 'gold', icon: ['fas', 'book-open'] },
  { id: 'returning-friend', name: 'Returning Friend', description: 'Came back to discover another side of China.', requirement: 'Complete a second journey', earned: false, tone: 'purple', icon: ['fas', 'route'] },
]
const earnedBadges = computed(() => badges.filter(badge => badge.earned).length)
onMounted(() => initializeAccount())
</script>

<style scoped>
.badge-summary { display: grid; grid-template-columns: 100px 100px 1fr; align-items: center; gap: 18px; margin-bottom: 35px; padding: 22px 24px; border: 1px solid #dfe5e1; background: #fff; }
.badge-summary > div:not(.summary-copy) { display: flex; flex-direction: column; gap: 5px; padding-right: 18px; border-right: 1px solid #e3e9e4; }.badge-summary strong { color: #173f34; font: 600 28px/1 'Playfair Display', Georgia, serif; }.badge-summary > div span { color: #78867f; font-size: 10px; text-transform: uppercase; }
.summary-copy { display: flex; align-items: center; gap: 12px; padding-left: 8px; color: #5c6d64; font-size: 12px; line-height: 1.5; }.summary-copy svg { color: #8fae3d; font-size: 22px; }
.badge-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 18px; }.badge-heading h2 { margin: 0; color: #173f34; font: 600 25px/1.2 'Playfair Display', Georgia, serif; }.badge-heading p { margin: 7px 0 0; color: #7c8983; font-size: 12px; }.badge-heading > span { color: #6e7d75; font-size: 11px; font-weight: 700; }
.badge-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }.badge-item { min-width: 0; display: flex; align-items: center; gap: 16px; padding: 18px; border: 1px solid #dfe5e1; background: #fff; }.badge-item.locked { background: #fafbf9; }.badge-art { position: relative; width: 70px; height: 70px; flex: 0 0 70px; display: grid; place-items: center; border-radius: 50%; color: #fff; font-size: 25px; }.badge-art.lime { background: #8baa3e; }.badge-art.forest { background: #2e6656; }.badge-art.warm { background: #b57948; }.badge-art.blue { background: #63899a; }.badge-art.gold { background: #ba9650; }.badge-art.purple { background: #726b89; }.badge-item.locked .badge-art { filter: grayscale(.5); opacity: .65; }.lock-mark { position: absolute; right: -2px; bottom: -2px; width: 23px; height: 23px; display: grid; place-items: center; border: 2px solid #fff; border-radius: 50%; background: #64736c; color: #fff; font-size: 9px; }
.badge-copy { min-width: 0; }.badge-name-row { display: flex; align-items: center; gap: 8px; }.badge-name-row h3 { margin: 0; overflow: hidden; color: #31443a; font-size: 14px; text-overflow: ellipsis; white-space: nowrap; }.badge-name-row span { flex: 0 0 auto; color: #577e32; font-size: 9px; font-weight: 800; text-transform: uppercase; }.badge-copy p { display: -webkit-box; margin: 7px 0; overflow: hidden; color: #748179; font-size: 11px; line-height: 1.45; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }.badge-copy small { color: #9aa49e; font-size: 10px; }
.badges-note { display: flex; align-items: center; gap: 9px; margin-top: 25px; padding: 12px 14px; background: #f8fbe9; color: #64734f; font-size: 11px; }.badges-note svg { color: #819a3c; }
@media (max-width: 650px) { .badge-summary { grid-template-columns: 1fr 1fr; gap: 14px; }.summary-copy { grid-column: 1 / -1; padding: 14px 0 0; border-top: 1px solid #e3e9e4; }.badge-grid { grid-template-columns: 1fr; }.badge-item { padding: 15px; } }
</style>
