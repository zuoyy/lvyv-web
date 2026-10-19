<template>
  <main class="health-experience care-status"><div class="health-shell">
    <div v-if="loading" class="health-state" role="status">Loading your appointment...</div>
    <div v-else-if="!appointment" class="health-state health-error"><p role="alert">{{ error }}</p><button type="button" @click="load">Try again</button></div>
    <template v-else>
      <header class="health-page-heading"><h1>{{ appointment.status==='PAYMENT_REQUIRED'?'Confirm your care booking':statusLabel }}</h1><p class="health-page-subtitle">{{ appointment.status==='PAYMENT_REQUIRED'?'Your preferred slot has been confirmed by the Provider.':'Review your appointment details and requests.' }}</p></header>
      <div class="health-columns status-grid"><section class="health-panel booking-details"><h2>{{ appointment.serviceTitle }}</h2><p class="subtitle">{{ appointment.cityName }} · {{ appointment.confirmedStartUtc?formatDate(appointment.confirmedStartUtc):appointment.preferredDate+' · '+appointment.preferredTimeWindow }}</p>
        <p v-if="['REQUESTED','PROVIDER_CONFIRMING'].includes(appointment.status)" class="health-notice">Your request is with the Care Team. We will confirm the Provider, time and price before asking you to pay.</p>
        <p v-if="['CANCEL_REQUESTED','RESCHEDULE_REQUESTED'].includes(appointment.status)" class="health-notice">The Care Team is reviewing your {{ appointment.status==='CANCEL_REQUESTED'?'cancellation':'reschedule' }} request. We will contact you with the outcome.</p>
        <dl class="status-details"><div><dt>Provider</dt><dd>{{ appointment.providerName || 'Care Team confirming' }}</dd></div><div><dt>Duration</dt><dd>{{ appointment.durationLabel }}</dd></div><div><dt>Language support</dt><dd>{{ appointment.preferredLanguage }} coordination</dd></div>
          <div v-if="appointment.confirmedStartUtc"><dt>Confirmed time</dt><dd>{{ formatDate(appointment.confirmedStartUtc) }} - {{ formatTime(appointment.confirmedEndUtc) }} (China time)</dd></div>
          <div v-for="(item,index) in appointment.visitInformation?.filter(item=>item.phase!=='POLICY'&&item.phase!=='INCLUDED')" :key="index"><dt>{{ item.phase==='BEFORE'?'Preparation':item.phase==='REPORT'?'Report':item.title }}</dt><dd>{{ item.description }}</dd></div>
          <div v-if="appointment.cancellationPolicy"><dt>Cancellation policy</dt><dd>{{ appointment.cancellationPolicy }}</dd></div>
        </dl>
        <p class="reference">Appointment {{ appointment.appointmentNo }}</p><p v-if="error" class="health-error" role="alert">{{ error }}</p>
        <div class="actions"><button v-if="canRequestChange" type="button" :disabled="working" @click="requestChange('cancel')">Request cancellation</button><button v-if="canRequestChange" type="button" :disabled="working" @click="requestChange('reschedule')">Request reschedule</button><button type="button" :disabled="working" @click="load">Refresh status</button><NuxtLink to="/care">My Care</NuxtLink></div>
      </section>
      <aside class="status-rail"><section class="health-rail price-card"><h2>{{ ['REQUESTED','PROVIDER_CONFIRMING'].includes(appointment.status)?'Estimated price':'Price summary' }}</h2><dl><div><dt>Care service</dt><dd>US${{ Number(appointment.serviceAmount).toFixed(2) }}</dd></div><div><dt>Coordinator fee</dt><dd>US${{ Number(appointment.coordinatorFee).toFixed(2) }}</dd></div><div class="total"><dt>{{ appointment.status==='PAID'?'Paid':'Total Due' }}</dt><dd>US${{ Number(appointment.totalAmount).toFixed(2) }}</dd></div></dl>
        <button v-if="appointment.status==='PAYMENT_REQUIRED'&&appointment.commerceOrderNo" type="button" class="health-button" :disabled="working" @click="pay">Confirm &amp; Pay</button>
        <p class="health-notice">{{ ['REQUESTED','PROVIDER_CONFIRMING'].includes(appointment.status)?'Nothing due now. Payment is requested only after Provider confirmation.':'Payment collection depends on the contracted settlement model with the provider.' }}</p>
      </section><section class="health-rail important"><h3>Important</h3><p>Medical diagnosis and treatment are provided by the healthcare provider. LVYV coordinates booking and related support.</p></section></aside></div>
    </template>
  </div></main>
</template>
<script setup lang="ts">
import type { HealthAppointment } from '~/composables/useHealthCare'
definePageMeta({middleware:'member-auth'})
const route=useRoute(),health=useHealthCare(),appointment=ref<HealthAppointment>(),loading=ref(true),working=ref(false),error=ref('')
const labels:Record<string,string>={REQUESTED:'Request received',PROVIDER_CONFIRMING:'Provider confirming',PAYMENT_REQUIRED:'Your appointment is ready for review',PAID:'Appointment confirmed',COMPLETED:'Completed',CANCEL_REQUESTED:'Cancellation requested',RESCHEDULE_REQUESTED:'Reschedule requested',CANCELLED:'Cancelled',PROVIDER_REJECTED:'Provider unavailable',NO_SHOW:'No-show',EXPIRED:'Expired'}
const statusLabel=computed(()=>labels[appointment.value?.status||'']||'Appointment')
const canRequestChange=computed(()=>['REQUESTED','PROVIDER_CONFIRMING','PAYMENT_REQUIRED','PAID'].includes(appointment.value?.status||''))
const formatDate=(value:string)=>new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Shanghai',year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(value))
const formatTime=(value?:string)=>value?new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Shanghai',hour:'2-digit',minute:'2-digit'}).format(new Date(value)):''
async function load(){error.value='';try{appointment.value=await health.getAppointment(String(route.params.appointmentNo))}catch(e){error.value=e instanceof Error?e.message:'Unable to load this appointment.'}finally{loading.value=false}}
async function pay(){if(working.value)return;working.value=true;error.value='';try{const current=await health.confirmReview(String(route.params.appointmentNo));await navigateTo('/orders/'+encodeURIComponent(current.commerceOrderNo! )+'/pay')}catch(e){error.value=e instanceof Error?e.message:'Unable to open payment.'}finally{working.value=false}}
async function requestChange(action:'cancel'|'reschedule'){if(working.value||!window.confirm(action==='cancel'?'Send a cancellation request to the Care Team? Any refund follows your confirmed policy.':'Send a reschedule request to the Care Team?'))return;working.value=true;error.value='';try{appointment.value=await(action==='cancel'?health.cancelAppointment(String(route.params.appointmentNo)):health.rescheduleAppointment(String(route.params.appointmentNo)))}catch(e){error.value=e instanceof Error?e.message:'Unable to send your request.'}finally{working.value=false}}
onMounted(load)
useLvyvSeo({title:'My Care Appointment | LVYV Care',description:'Review your LVYV Care appointment.',path:'/health/appointments/'+route.params.appointmentNo,noindex:true})
</script>

<style scoped>
.health-page-heading h1{margin:0}.status-grid{margin-top:40px}.booking-details{min-height:646px}.booking-details h2{font:700 24px/26px Philosopher,Georgia,serif;margin:0 0 12px}.subtitle{font-size:14px;line-height:22px;color:#242424;padding-bottom:20px;border-bottom:1px solid #ddd;margin:0 0 28px}.status-details{margin:0}.status-details>div{display:grid;grid-template-columns:170px minmax(0,1fr);gap:20px;margin-bottom:30px;font-size:16px;line-height:24px}.status-details dt{color:#7a7a7a}.status-details dd{color:#111729;font-weight:700;margin:0;white-space:pre-wrap;overflow-wrap:anywhere}.reference{font-size:12px;color:#808080;overflow-wrap:anywhere;margin:32px 0 20px}.status-rail{display:grid;gap:20px}.price-card h2{font:700 18px/26px Inter,sans-serif;margin:0 0 28px;color:#242424}.price-card dl{margin:0}.price-card dl div{display:flex;justify-content:space-between;gap:12px;font-size:16px;line-height:24px;margin-bottom:20px;color:#242424}.price-card dd{margin:0;white-space:nowrap;font-weight:700}.price-card .total{border-top:1px dashed #999;padding-top:28px;margin:28px 0 44px;font-weight:700}.price-card .total dd{font-size:24px;color:#203d33}.price-card .health-button{width:100%}.price-card .health-notice{margin:40px -16px 0}.important h3{font:500 16px/24px Inter,sans-serif;color:#105446;margin:0 0 12px}.important p{color:#808080;font-size:14px;line-height:20px}.actions{display:flex;gap:10px;flex-wrap:wrap;align-items:center}.actions button{border:1px solid #dce3de;border-radius:4px;background:#fff;color:#105446;padding:8px 12px;font-size:12px;cursor:pointer}.actions a{font-size:12px;color:#105446}.actions button:disabled{opacity:.5}.booking-details>.health-notice{margin-bottom:28px}
@media(max-width:1000px){.status-details>div{grid-template-columns:130px minmax(0,1fr);font-size:14px}.price-card dl div{font-size:14px}.price-card .total dd{font-size:20px}}
@media(max-width:850px){.status-grid{margin-top:28px}.booking-details{min-height:0}.status-details>div{grid-template-columns:1fr;gap:6px;margin-bottom:24px}}
</style>
