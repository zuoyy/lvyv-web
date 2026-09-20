<template>
  <AccountPageShell active-page="referrals" title="Invite friends" description="Share the joy of discovering China together." :ready="ready">
    <template #actions><button class="secondary" :disabled="loading" @click="refresh">Refresh</button></template>
    <p v-if="error" class="notice error" role="alert">{{ error }} <button @click="refresh">Try again</button></p>
    <p v-if="loading && !summary" class="notice" role="status">Loading your invitations...</p>
    <template v-if="summary">
      <div class="stats">
        <article><span>Friends joined</span><strong>{{ summary.invitedCount }}</strong></article>
        <article><span>Points received</span><strong>{{ summary.rewards.grantedPoints }}</strong></article>
        <article><span>Rewards remaining today</span><strong>{{ summary.enabled && summary.eligible ? summary.rewards.remainingToday : 0 }}</strong></article>
      </div>
      <section class="share-card">
        <h2>A new friend. A new adventure.</h2>
        <p v-if="!summary.eligible" class="notice">Your account must be active and your email verified before you can invite friends.</p>
        <p v-else-if="!summary.enabled" class="notice">Invitations are temporarily paused. Your previous invitations and rewards are safe.</p>
        <template v-else>
          <p v-if="summary.rewards.rewardEnabled">Earn {{ summary.rewards.pointsPerInvite }} points when a new friend completes registration.</p>
          <p v-else class="notice">You can invite friends, but new invitations are not earning points at the moment.</p>
          <p v-if="codeError" role="alert" class="notice error">{{ codeError }} <button @click="loadCode">Try again</button></p>
          <p v-else-if="!code" role="status">Preparing your invitation...</p>
          <p v-else-if="code.status !== 1" class="notice">Your invitation code is currently paused. Please contact support.</p>
          <div v-else class="share-fields">
            <label for="invite-code">Your invitation code</label>
            <div class="copy-field"><input id="invite-code" :value="code.code" readonly><button @click="copy(code.code)">Copy code</button></div>
            <label for="invite-link">Your invitation link</label>
            <div class="copy-field"><input id="invite-link" :value="code.link" readonly><button @click="copy(code.link)">Copy link</button></div>
            <p v-if="copyMessage" role="status">{{ copyMessage }}</p>
          </div>
        </template>
        <ul class="rules">
          <li>Rewards apply to new friends who sign up and verify their email.</li>
          <li>Earn rewards for up to {{ summary.rewards.dailyLimit }} friends per day. Resets at 00:00 UTC.</li>
        </ul>
      </section>
      <section class="history-card">
        <h2>Your invitations</h2>
        <p v-if="rowsLoading" role="status">Loading invitations...</p>
        <p v-if="rowsError" class="notice error" role="alert">{{ rowsError }} <button @click="loadRows(page)">Try again</button></p>
        <p v-else-if="!rowsLoading && !rows.length" class="empty">Your next adventure starts with a friend. Share your link to get started.</p>
        <div v-if="rows.length" class="table-wrap"><table>
          <thead><tr><th>Friend</th><th>Joined</th><th>Points</th><th>Reward</th></tr></thead>
          <tbody><tr v-for="row in rows" :key="row.id"><td>{{ row.friend }}</td><td>{{ formatTime(row.boundTime) }}</td><td>{{ row.status === 3 ? 0 : row.points }}</td><td><span :class="['status', `status-${row.status}`]">{{ statusLabel(row) }}</span></td></tr></tbody>
        </table></div>
        <AccountPagination :page="page" :size="20" :total="total" :loading="rowsLoading" @change="loadRows" />
      </section>
    </template>
  </AccountPageShell>
</template>
<script setup lang="ts">
import AccountPageShell from '~/components/profile/AccountPageShell.vue'
import AccountPagination from '~/components/profile/AccountPagination.vue'
import type { ReferralCode, ReferralSummary, ReferralRow } from '~/composables/useReferrals'
useNoIndex()
const { auth, ready, initializeAccount } = useAccountPage('/referrals')
const api = useReferrals()
const summary = ref<ReferralSummary | null>(null)
const code = ref<ReferralCode | null>(null)
const rows = ref<ReferralRow[]>([])
const loading = ref(false), rowsLoading = ref(false)
const error = ref(''), rowsError = ref(''), codeError = ref(''), copyMessage = ref('')
const page = ref(1), total = ref(0)
let generation = 0, rowsGeneration = 0
const formatTime = (value: string) => formatMemberDateTime(value, auth.member.value?.timezone)
const statusLabel = (row: ReferralRow) => row.status === 2 ? 'Received' : row.status === 4 ? 'Delayed · retry pending' : row.status === 3 ? (row.reason === 'DAILY_LIMIT' ? 'Daily limit reached' : 'Rewards paused') : 'Processing'
const loadCode = async () => {
  const current = generation; codeError.value = ''
  try { const value = await api.code(); if (current === generation) code.value = value }
  catch (e) { if (current === generation) codeError.value = e instanceof Error ? e.message : 'Could not load your invitation.' }
}
const loadRows = async (next = 1) => {
  const current = ++rowsGeneration; rowsLoading.value = true; rowsError.value = ''
  try { const result = await api.page(next); if (current !== rowsGeneration) return; rows.value = result.list; total.value = result.total; page.value = result.page }
  catch (e) { if (current === rowsGeneration) rowsError.value = e instanceof Error ? e.message : 'Could not load invitations.' }
  finally { if (current === rowsGeneration) rowsLoading.value = false }
}
const refresh = async () => {
  const current = ++generation; loading.value = true; error.value = ''
  try {
    const [value] = await Promise.all([api.summary(), loadRows(page.value)])
    if (current !== generation) return
    summary.value = value
    if (value.enabled && value.eligible) await loadCode()
  } catch (e) { if (current === generation) error.value = e instanceof Error ? e.message : 'Could not load invitations.' }
  finally { if (current === generation) loading.value = false }
}
const copy = async (value: string) => {
  try { await navigator.clipboard.writeText(value); copyMessage.value = 'Copied! Ready to share with a friend.' }
  catch { copyMessage.value = 'Copy was unavailable. Select the text above and copy it manually.' }
}
onMounted(async () => { if (await initializeAccount()) await refresh() })
watch(auth.token, () => { ++generation; ++rowsGeneration; summary.value = null; code.value = null; rows.value = [] })
onBeforeUnmount(() => { ++generation; ++rowsGeneration })
</script>
<style scoped>
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px}.stats article,.share-card,.history-card{background:#fff;border:1px solid #dfe5e1;padding:24px}.stats span{color:#64756c;font-size:13px}.stats strong{display:block;margin-top:10px;font-size:32px;color:#174d40}.share-card{background:linear-gradient(120deg,#eff5e7,#fff);margin-bottom:20px}.share-card h2,.history-card h2{font-size:22px;margin:0 0 14px;color:#174d40}.share-card p,.rules{font-size:14px;line-height:1.7;color:#52605b}.share-fields{max-width:680px;margin:24px 0}.share-fields label{display:block;font-size:12px;font-weight:700;margin:16px 0 8px}.copy-field{display:flex;gap:8px}.copy-field input{min-width:0;flex:1;padding:12px;border:1px solid #cdd8d0;border-radius:4px;background:#fff;color:#174d40;font:inherit}.copy-field button,button.secondary{padding:10px 16px;border:1px solid #174d40;border-radius:4px;background:#174d40;color:white;cursor:pointer;white-space:nowrap}.rules{padding-left:20px;margin-bottom:0}.notice{padding:16px;background:#f1f4ed;color:#52605b}.error{color:#a33e35;background:#fff1ed}.empty{padding:30px 0;color:#64756c;line-height:1.7}.table-wrap{overflow:auto}table{width:100%;border-collapse:collapse;text-align:left;font-size:13px}th,td{padding:16px 10px;border-bottom:1px solid #e6ebe7}th{color:#64756c;font-weight:500}.status{font-size:12px;color:#64756c}.status-2{color:#174d40}.status-4{color:#a33e35}button:disabled{opacity:.5;cursor:default}@media(max-width:640px){.stats{grid-template-columns:1fr;gap:8px}.stats article{display:flex;align-items:center;justify-content:space-between;padding:16px}.stats strong{margin:0;font-size:26px}.share-card,.history-card{padding:18px}.copy-field{flex-wrap:wrap}.copy-field input{width:100%;flex-basis:100%}th,td{min-width:95px}}
</style>
