<template>
  <main class="health-experience appointment-page"><div class="health-shell">
    <header class="health-page-heading"><h1>Request an Appointment</h1><p class="health-page-subtitle">{{ service?.title || 'Health Checkup' }}<template v-if="service"> · {{ service.cityName }}</template></p></header>
    <nav class="steps" aria-label="Appointment progress"><span v-for="(label,index) in steps" :key="label" :class="{active:step===index+1,complete:step>index+1}" :aria-current="step===index+1?'step':undefined"><b>{{ index+1 }}</b>{{ label }}</span></nav>
    <p v-if="loading" class="health-state" role="status">Loading your service...</p>
    <div v-else-if="service" class="health-columns appointment-grid"><section class="health-panel">
      <h2>{{ step===2?'Traveler & contact':stepsTitles[step-1] }}</h2>
      <form v-if="step<4" @submit.prevent="next">
        <div v-if="step===1" class="health-form">
          <div class="health-form-row"><label>Preferred date<input v-model="form.preferredDate" required type="date" :min="today"></label><label>Preferred time window<select v-model="form.preferredTimeWindow"><option>Morning</option><option>Afternoon</option><option>Flexible</option></select></label></div>
          <p class="health-notice">All appointment times are local to China (Asia/Shanghai). Payment is requested only after the Provider confirms your appointment.</p>
        </div>
        <div v-if="step===2" class="health-form">
          <label>Full name<input v-model="form.travelerName" required maxlength="128" autocomplete="name"></label>
          <label>Email<input v-model="form.travelerEmail" required type="email" maxlength="128" autocomplete="email"></label>
          <label>Mobile / WhatsApp<input v-model="form.travelerMobile" type="tel" maxlength="64" autocomplete="tel"></label>
          <div class="health-form-row"><label>Preferred date<input v-model="form.preferredDate" required type="date" :min="today"></label><label>Preferred time window<select v-model="form.preferredTimeWindow"><option>Morning</option><option>Afternoon</option><option>Flexible</option></select></label></div>
          <div class="health-form-row"><label>Nationality<input v-model="form.nationality" maxlength="64" autocomplete="country-name" placeholder="Select"></label><label>Preferred language<select v-model="form.preferredLanguage"><option>English</option><option>Chinese</option></select></label></div>
          <label>Anything we should know?<textarea v-model="form.note" maxlength="1000" rows="3" placeholder="Optional. Please do not upload medical records here. A coordinator may request information later if needed."></textarea></label>
          <p class="health-notice privacy"><strong>Privacy note</strong> We only collect information needed to coordinate this appointment. Please do not share medical records.</p>
        </div>
        <dl v-if="step===3" class="review">
          <div><dt>Service</dt><dd>{{ service.title }}</dd></div><div><dt>Preferred date</dt><dd>{{ form.preferredDate }} · {{ form.preferredTimeWindow }}</dd></div><div><dt>Traveler</dt><dd>{{ form.travelerName }}</dd></div><div><dt>Email</dt><dd>{{ form.travelerEmail }}</dd></div><div v-if="form.travelerMobile"><dt>Mobile / WhatsApp</dt><dd>{{ form.travelerMobile }}</dd></div><div><dt>Language support</dt><dd>{{ form.preferredLanguage }}</dd></div><div v-if="form.note"><dt>Coordination note</dt><dd>{{ form.note }}</dd></div><div><dt>Payment</dt><dd>Nothing due now. Your Provider and final price will be confirmed before payment.</dd></div>
        </dl>
        <p v-if="error" class="health-error" role="alert">{{ error }}</p>
        <div class="actions"><button v-if="step>1" type="button" class="secondary" :disabled="submitting" @click="step--">Back</button><button type="submit" :disabled="submitting">{{ submitting?'Submitting request...':step===3?(auth.token.value?'Submit appointment request':'Sign in & submit request'):'Continue' }}</button></div>
      </form>
      <div v-else class="confirmation"><p>The Care Team will contact the Provider and confirm availability. No payment has been taken.</p><p>Appointment reference: <strong>{{ appointmentNo }}</strong></p><p>Provider confirming</p><NuxtLink :to="'/health/appointments/'+appointmentNo">View request</NuxtLink><NuxtLink to="/care">My Care</NuxtLink></div>
    </section>
    <aside class="health-rail summary"><h2>Appointment summary</h2><div><span>Service</span><strong>{{ service.title }}</strong></div><div><span>City</span><strong>{{ service.cityName }}</strong></div><div><span>Estimated duration</span><strong>{{ service.durationLabel }}</strong></div><div><span>Starting price</span><strong>US${{ Number(service.startingPrice).toFixed(2) }}</strong></div><div><span>Booking mode</span><strong class="booking-mode">Provider confirmation required</strong></div></aside></div>
    <div v-else class="health-state"><p class="health-error" role="alert">{{ error || 'Choose a service to request an appointment.' }}</p><NuxtLink to="/health/services">Explore health services</NuxtLink></div>
  </div></main>
</template>
<script setup lang="ts">
import type { HealthServiceSummary } from '~/composables/useHealthCare'
const route=useRoute(),auth=useMemberAuth(),health=useHealthCare()
const serviceCode=typeof route.query.serviceCode==='string'?route.query.serviceCode:''
const service=ref<HealthServiceSummary>(),loading=ref(true),submitting=ref(false),error=ref(''),appointmentNo=ref('')
const step=useState<number>('health-appointment-step-'+serviceCode,()=>1)
const form=useState('health-appointment-draft-'+serviceCode,()=>({serviceCode,preferredDate:typeof route.query.date==='string'?route.query.date:'',preferredTimeWindow:typeof route.query.time==='string'?route.query.time:'Morning',travelerName:'',travelerEmail:'',travelerMobile:'',nationality:'',preferredLanguage:'English',note:'',idempotencyKey:''}))
const steps=['Time','Traveler','Review','Confirmation'],stepsTitles=['Choose your preferred time','Tell us about your visit','Review your request','Your request is with our Care Team']
const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())
async function next(){
  error.value=''
  if(step.value===1){if(!form.value.preferredDate||form.value.preferredDate<today){error.value='Choose today or a future date in China.';return}step.value=2;return}
  if(step.value===2){step.value=3;return}
  if(submitting.value)return
  if(!auth.token.value){await navigateTo({path:'/login/',query:{redirect:route.fullPath}});return}
  submitting.value=true
  try{const appointment=await health.createAppointment(form.value);appointmentNo.value=appointment.appointmentNo;step.value=4;form.value.note='';form.value.idempotencyKey=''}catch(e){error.value=e instanceof Error?e.message:'Unable to submit your request.'}finally{submitting.value=false}
}
onMounted(async()=>{form.value.idempotencyKey ||= crypto.randomUUID();if(step.value===4)step.value=1;try{if(serviceCode)service.value=(await health.getService(serviceCode)).service}catch(e){error.value=e instanceof Error?e.message:'Unable to load this service.'}finally{loading.value=false}})
useLvyvSeo({title:'Request an Appointment | LVYV Care',description:'Request a planned healthcare appointment with LVYV Care.',path:'/health/appointments/new',noindex:true})
</script>

<style scoped>
.health-page-heading h1{margin:0}.steps{display:flex;align-items:center;max-width:730px;gap:12px;margin:36px 0 40px}.steps>span{display:flex;align-items:center;gap:10px;flex:1;white-space:nowrap;color:#7a7a7a;font-size:16px}.steps>span:not(:last-child):after{content:'';height:2px;background:#aebac4;min-width:20px;flex:1;margin-left:2px}.steps b{display:grid;place-items:center;border:2px solid #7a7a7a;border-radius:50%;width:32px;height:32px;flex-shrink:0;font-size:13px;font-weight:500}.steps .active,.steps .complete{color:#2a573f}.steps .active b,.steps .complete b{color:#fff;border-color:#2a573f;background:#2a573f}.steps .complete:after{background:#2a573f}.appointment-page h2{font:600 20px/26px Inter,sans-serif;color:#112211;margin:0 0 40px}.appointment-grid>.health-panel{min-height:500px}.summary h2{font-size:18px;margin:0 0 34px;color:#242424}.summary>div{display:grid;gap:8px;margin:0 0 28px}.summary>div:last-child{margin-bottom:6px}.summary span{font-size:16px;color:#242424}.summary strong{font-size:20px;line-height:28px;color:#203d33}.summary .booking-mode{color:#698e4e}.privacy{font-size:12px}.privacy strong{color:#2a573f;margin-right:8px}.actions{display:flex;gap:12px;margin-top:40px}.actions button{flex:1;min-height:54px;padding:12px 16px;background:#203d33;color:#fff;font:600 14px/22px Inter,sans-serif;border:0;border-radius:4px;cursor:pointer}.actions button.secondary{flex:0 0 auto;background:#edf1ed;color:#203d33}.actions button:disabled{opacity:.5}.review{margin:0}.review div{display:grid;grid-template-columns:160px 1fr;gap:20px;padding:18px 0;border-bottom:1px solid #e3e8ef;font-size:14px}.review dt{color:#677489}.review dd{margin:0;overflow-wrap:anywhere;white-space:pre-wrap}.confirmation{display:flex;flex-wrap:wrap;gap:20px}.confirmation p{width:100%;overflow-wrap:anywhere;line-height:1.7}.confirmation a{color:#105446}.health-error{margin-top:16px}
@media(max-width:850px){.steps{gap:8px;margin:28px 0}.steps>span{font-size:12px;gap:6px}.steps b{width:26px;height:26px}.steps>span:not(:last-child):after{min-width:8px}.appointment-page h2{margin-bottom:28px}.summary strong{font-size:18px}}
@media(max-width:500px){.steps{gap:4px}.steps>span{gap:4px;font-size:10px}.steps b{width:22px;height:22px;font-size:11px}.steps>span:not(:last-child):after{min-width:4px}.review div{grid-template-columns:1fr;gap:6px}.actions{flex-wrap:wrap}.actions button{min-width:0}.summary span{font-size:14px}}
</style>
