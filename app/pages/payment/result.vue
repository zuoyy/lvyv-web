<template>
  <main class="result-page"><section class="result-panel">
    <div v-if="loading" class="result-icon pending"><font-awesome-icon :icon="['fas','spinner']" spin /></div>
    <div v-else-if="payment?.status === 'SUCCEEDED'" class="result-icon success"><font-awesome-icon :icon="['fas','check']" /></div>
    <div v-else-if="terminalFailure" class="result-icon failed"><font-awesome-icon :icon="['fas','xmark']" /></div>
    <div v-else class="result-icon pending"><font-awesome-icon :icon="['fas','clock']" /></div>
    <p class="eyebrow">Payment result</p><h1>{{ title }}</h1><p>{{ message }}</p>
    <dl v-if="payment"><div><dt>Payment</dt><dd>{{ payment.paymentNo }}</dd></div><div><dt>Amount</dt><dd>{{ payment.currency }} {{ payment.amount }}</dd></div><div><dt>Status</dt><dd>{{ payment.status }}</dd></div></dl>
    <div class="actions"><NuxtLink :to="returnPath">{{ actionLabel }}</NuxtLink></div>
  </section></main>
</template>
<script setup lang="ts">
import type { PaymentView } from '~/composables/useTourCommerce'
useNoIndex()
const route = useRoute(); const commerce = useTourCommerce(); const auth = useMemberAuth()
const payment = ref<PaymentView>(); const loading = ref(true); let timer: ReturnType<typeof setTimeout> | undefined; let attempts = 0
const terminalFailure = computed(() => ['FAILED','EXPIRED','REVIEW_REQUIRED'].includes(payment.value?.status || ''))
const retryableFailure = computed(() => ['FAILED','EXPIRED'].includes(payment.value?.status || ''))
const isLoggedIn = computed(() => Boolean(auth.token.value))
const returnPath = computed(() => isLoggedIn.value ? (payment.value?.status === 'SUCCEEDED' ? '/trips' : '/orders') : '/encounters')
const actionLabel = computed(() => {
  if (!isLoggedIn.value) return retryableFailure.value ? 'Choose another encounter' : 'Back to encounters'
  if (payment.value?.status === 'SUCCEEDED') return 'View my journeys'
  return retryableFailure.value ? 'Try another payment method' : 'View order status'
})
const title = computed(() => loading.value ? 'Checking your payment' : payment.value?.status === 'SUCCEEDED' ? 'Payment confirmed' : terminalFailure.value ? 'Payment was not completed' : 'Payment is still processing')
const message = computed(() => payment.value?.status === 'SUCCEEDED' ? 'Your order is complete and your journey is ready.' : payment.value?.status === 'REVIEW_REQUIRED' ? 'This payment needs manual review. Do not submit another payment while our team verifies it.' : terminalFailure.value ? (payment.value?.failureMessage || 'No charge has been confirmed. You can try another payment method.') : 'We have not marked this payment successful yet. This page will keep checking the verified payment status.')
const load = async () => { const no = typeof route.query.paymentNo === 'string' ? route.query.paymentNo : ''; if (!no) { loading.value=false; return } try { payment.value = await commerce.getPayment(no) } finally { loading.value=false } if (payment.value && ['CREATED','PENDING','UNKNOWN'].includes(payment.value.status) && attempts++ < 40) timer=setTimeout(load,3000) }
onMounted(load); onBeforeUnmount(()=>{ if(timer) clearTimeout(timer) })
</script>
<style scoped>
.result-page{min-height:calc(100dvh - 70px);display:grid;place-items:center;padding:32px 20px;background:#f4f7f4}.result-panel{width:min(560px,100%);padding:42px;border:1px solid #d8e2dc;background:#fff;text-align:center}.result-icon{width:54px;height:54px;display:grid;place-items:center;margin:0 auto 20px;border-radius:50%;font-size:21px}.result-icon.success{background:#e5f3e8;color:#17603f}.result-icon.pending{background:#eef1ed;color:#5f7067}.result-icon.failed{background:#f8e9e7;color:#a63a31}.eyebrow{margin:0 0 8px;color:#819087;font-size:9px;font-weight:800;text-transform:uppercase}.result-panel h1{margin:0;color:#173f34;font:600 31px/1.2 'Playfair Display',Georgia,serif}.result-panel>p:not(.eyebrow){color:#68776f;line-height:1.6}.result-panel dl{margin:25px 0;text-align:left}.result-panel dl div{display:flex;justify-content:space-between;gap:18px;padding:11px 0;border-top:1px solid #e1e7e3}.result-panel dt{color:#849087}.result-panel dd{margin:0;color:#31453b;font-weight:700;word-break:break-all}.actions a{min-height:44px;display:inline-flex;align-items:center;padding:0 20px;background:#174d40;color:#fff;text-decoration:none;font-weight:800}
</style>
