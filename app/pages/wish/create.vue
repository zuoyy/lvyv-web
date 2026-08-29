<template>
  <main class="wish-builder" aria-labelledby="wish-builder-title">
    <h1 id="wish-builder-title" class="sr-only">Create your travel wish</h1>

    <section class="wish-builder__shell" :class="{ 'wish-builder__shell--complete': submitted }">
      <aside class="wish-progress" aria-label="Wish progress">
        <ol class="wish-progress__list">
          <li v-for="(item, index) in steps" :key="item.label" class="wish-progress__item">
            <button
              type="button"
              class="wish-progress__button"
              :class="{
                'is-active': currentStep === index,
                'is-complete': submitted || (currentStep > index && isStepValid(index)),
                'is-available': isStepAvailable(index),
              }"
              :disabled="!isStepAvailable(index)"
              :aria-label="item.label"
              :aria-current="currentStep === index ? 'step' : undefined"
              @click="goToStep(index)"
            >
              <span class="wish-progress__marker" aria-hidden="true">
                <font-awesome-icon v-if="submitted || (currentStep > index && isStepValid(index))" :icon="['fas', 'check']" />
                <span v-else>{{ index + 1 }}</span>
              </span>
              <span class="wish-progress__label">{{ item.label }}</span>
              <font-awesome-icon v-if="currentStep === index" class="wish-progress__arrow" :icon="['fas', 'arrow-right']" aria-hidden="true" />
            </button>
          </li>
        </ol>
        <p class="wish-progress__mobile-label">{{ steps[currentStep]?.label }}</p>
      </aside>

      <div class="wish-conversation">
        <Transition name="wish-step" mode="out-in">
          <div v-if="submitted" key="success" class="wish-success" aria-live="polite">
            <img src="/images/wish/create/wish-success.webp" alt="A panda writing a Lvyv travel wish" width="720" height="480">
            <h2>Your wish is taking shape...</h2>
            <p>A travel designer is handcrafting your itinerary.<br>We'll send it to your inbox within 24 hours.</p>
            <span>You can also check your wish status anytime in My Wishes.</span>
            <div class="wish-success__actions">
              <button type="button" class="wish-button wish-button--outline" @click="shareJourney">Share Journey</button>
              <NuxtLink to="/wish/my" class="wish-button wish-button--primary">View My Wishes</NuxtLink>
            </div>
            <p v-if="shareMessage" class="wish-success__share" role="status">{{ shareMessage }}</p>
          </div>

          <div v-else :key="currentStep" class="wish-stage">
            <div v-if="currentStep < 5" class="wish-chat">
              <span class="wish-chat__avatar" aria-hidden="true">
                <img src="/images/wish/wish-avatar.svg" alt="" width="44" height="44">
              </span>
              <p>{{ steps[currentStep]?.prompt }}</p>
            </div>

            <div v-if="configLoading" class="wish-config-state" role="status">
              <span class="wish-config-spinner" />
              <strong>Loading wish options...</strong>
            </div>

            <div v-else-if="configError" class="wish-config-state wish-config-state--error" role="alert">
              <font-awesome-icon :icon="['fas', 'circle-exclamation']" />
              <strong>We could not load wish options.</strong>
              <span>{{ configError }}</span>
              <button type="button" @click="reloadWishConfig">Try again</button>
            </div>

            <div v-else-if="currentStep === 0" class="wish-city-stage">
              <div class="wish-city-grid" aria-label="Choose a destination">
                <button
                  v-for="city in cityCards"
                  :key="city.code"
                  type="button"
                  class="wish-city-card"
                  :class="{ 'is-selected': form.cityCode === city.code }"
                  :aria-pressed="form.cityCode === city.code"
                  :aria-label="`${city.englishName} ${city.chineseName}`"
                  @click="selectCity(city.code)"
                >
                  <img :src="city.imageUrl" alt="" width="840" height="560">
                  <span class="wish-city-card__shade" aria-hidden="true" />
                  <span class="wish-city-card__name">{{ city.englishName }}</span>
                  <span class="wish-city-card__zh">{{ city.chineseName }}</span>
                  <span class="wish-city-card__status" aria-hidden="true">
                    <font-awesome-icon v-if="form.cityCode === city.code" :icon="['fas', 'check']" />
                  </span>
                </button>
              </div>
            </div>

            <div v-else-if="currentStep === 1" class="wish-calendar-card">
              <div class="wish-calendar-card__summary">
                <span>{{ travelDateLabel }}</span>
                <span v-if="hasCompleteTravelDates" class="wish-duration">
                  <button type="button" aria-label="Reduce trip length" @click="changeTripDays(-1)">-</button>
                  <strong>{{ form.tripDays }}</strong> days
                  <button type="button" aria-label="Increase trip length" @click="changeTripDays(1)">+</button>
                </span>
              </div>
              <div class="wish-calendar-card__month">
                <button type="button" aria-label="Previous month" @click="moveCalendar(-1)"><font-awesome-icon :icon="['fas', 'chevron-left']" /></button>
                <strong>{{ calendarTitle }}</strong>
                <button type="button" aria-label="Next month" @click="moveCalendar(1)"><font-awesome-icon :icon="['fas', 'chevron-right']" /></button>
              </div>
              <div class="wish-calendar" role="grid" aria-label="Travel dates">
                <span v-for="dayName in weekDays" :key="dayName" class="wish-calendar__weekday" role="columnheader">{{ dayName }}</span>
                <button
                  v-for="day in calendarDays"
                  :key="day.key"
                  type="button"
                  class="wish-calendar__day"
                  :class="{
                    'is-outside': !day.inMonth,
                    'is-disabled': day.disabled,
                    'is-range': day.inRange,
                    'is-edge': day.isStart || day.isEnd,
                    'is-start': day.isStart,
                    'is-end': day.isEnd,
                  }"
                  :disabled="day.disabled"
                  :aria-label="day.label"
                  :aria-pressed="day.isStart || day.isEnd"
                  @click="selectCalendarDay(day.key)"
                ><span>{{ day.day }}</span></button>
              </div>
              <button type="button" class="wish-calendar-card__reset" @click="resetDates">Clear dates</button>
            </div>

            <div v-else-if="currentStep === 2" class="wish-interest-stage">
              <div v-if="selectedInterestOptions.length" class="wish-selected-tags" aria-label="Selected interests">
                <button v-for="interest in selectedInterestOptions" :key="interest.code" type="button" @click="toggleInterest(interest.code)">
                  {{ interest.label }} <span aria-hidden="true">x</span>
                </button>
              </div>
              <div class="wish-interest-grid">
                <button
                  v-for="interest in interestOptions"
                  :key="interest.code"
                  type="button"
                  class="wish-interest"
                  :class="{ 'is-selected': form.interestCodes.includes(interest.code) }"
                :aria-pressed="form.interestCodes.includes(interest.code)"
                @click="toggleInterest(interest.code)"
              >
                  <span class="wish-interest__icon" aria-hidden="true">
                    <img v-if="interestIconAsset(interest.icon)" :src="interestIconAsset(interest.icon)" alt="">
                    <font-awesome-icon v-else :icon="['fas', interest.icon]" />
                  </span>
                  <span>{{ interest.label }}</span>
                  <span v-if="form.interestCodes.includes(interest.code)" class="wish-interest__check" aria-hidden="true"><img src="/images/wish/icons/interest-design/check.svg" alt=""></span>
                </button>
              </div>
            </div>

            <div v-else-if="currentStep === 3" class="wish-budget-grid" aria-label="Choose a budget style">
              <button
                v-for="budget in budgetOptions"
                :key="budget.code"
                type="button"
                class="wish-budget"
                :class="{ 'is-selected': form.budgetLevel === budget.code }"
                :aria-pressed="form.budgetLevel === budget.code"
                @click="form.budgetLevel = budget.code"
              >
                <span class="wish-budget__icon" aria-hidden="true">
                  <img v-if="wishIconAsset(budget.icon)" :src="wishIconAsset(budget.icon)" alt="">
                  <font-awesome-icon v-else :icon="['fas', budget.icon]" />
                </span>
                <span>{{ budget.label }}</span>
                <strong>{{ budget.price }}</strong>
                <small v-for="feature in budget.features" :key="feature">{{ feature }}</small>
                <span v-if="form.budgetLevel === budget.code" class="wish-choice-check" aria-hidden="true"><font-awesome-icon :icon="['fas', 'check']" /></span>
              </button>
            </div>

            <div v-else-if="currentStep === 4" class="wish-story-stage">
              <label class="wish-textarea">
                <span class="sr-only">Your travel story</span>
                <textarea v-model="form.story" maxlength="500" rows="4" placeholder="Tell us the moment you hope this journey will create..." @input="selectedStoryCode = ''" />
                <small>{{ form.story.length }}/500</small>
              </label>
              <div class="wish-journeys" aria-label="Journey inspiration">
                <button
                  v-for="journey in journeyOptions"
                  :key="journey.code"
                  type="button"
                  class="wish-journey"
                  :class="{ 'is-selected': selectedStoryCode === journey.code }"
                  @click="selectStory(journey.code)"
                >
                  <img :src="journey.image" :alt="journey.alt" width="520" height="347">
                  <strong>{{ journey.title }}</strong>
                  <small>{{ journey.subtitle }}</small>
                </button>
              </div>
            </div>

            <div v-else-if="currentStep === 5" class="wish-needs-stage">
              <label class="wish-textarea wish-textarea--needs">
                <span class="sr-only">Special needs</span>
                <textarea v-model="form.specialRequirement" maxlength="500" rows="5" placeholder="Accessibility, dietary needs, pacing preferences, a special celebration..." />
                <small>{{ form.specialRequirement.length }}/500</small>
              </label>
              <button v-if="form.specialRequirement" type="button" class="wish-clear-needs" @click="form.specialRequirement = ''">Clear and continue with none</button>
            </div>

            <div v-else class="wish-review-stage">
              <article class="wish-review">
                <h2>Your Wish</h2>
                <dl>
                  <div><dt>City</dt><dd>{{ selectedCityLabel }}</dd></div>
                  <div><dt>Duration</dt><dd>{{ form.tripDays }} Days</dd></div>
                  <div><dt>Travel Date</dt><dd>{{ reviewTravelDate }}</dd></div>
                  <div><dt>Interests</dt><dd class="wish-review__tags"><span v-for="interest in selectedInterestOptions" :key="interest.code">{{ interest.label }}</span></dd></div>
                  <div><dt>Budget</dt><dd>{{ selectedBudget?.label }}</dd></div>
                  <div><dt>Your Story</dt><dd class="wish-review__story">{{ form.story }}</dd></div>
                  <div><dt>Special Needs</dt><dd>{{ form.specialRequirement || 'None' }}</dd></div>
                </dl>
              </article>
              <p v-if="submitError" class="wish-submit-error" role="alert">{{ submitError }}</p>
              <div class="wish-review__actions">
                <button type="button" class="wish-button wish-button--outline" @click="goToStep(0)">Modify</button>
                <button type="button" class="wish-button wish-button--primary" :disabled="submitting" @click="submitWish">
                  {{ submitting ? 'Submitting...' : 'Confirm & Submit' }}
                </button>
              </div>
            </div>

          </div>
        </Transition>

        <div v-if="!submitted && currentStep < 6" class="wish-stage__actions">
          <button v-if="currentStep > 0" type="button" class="wish-back-button" aria-label="Previous step" @click="previousStep">
            <font-awesome-icon :icon="['fas', 'arrow-left']" />
          </button>
          <button type="button" class="wish-next-button" :disabled="!canContinue" @click="nextStep">
            <span>{{ currentStep === 5 ? 'Review Wish' : 'Next Step' }}</span>
            <span class="wish-next-button__icon" aria-hidden="true"><font-awesome-icon :icon="['fas', 'chevron-right']" /></span>
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
interface WishDraft {
  cityCode: string
  tripDays: number
  startDate: string
  endDate: string
  interestCodes: string[]
  budgetLevel: string
  story: string
  specialRequirement: string
}

interface CalendarDay {
  key: string
  day: number
  inMonth: boolean
  disabled: boolean
  inRange: boolean
  isStart: boolean
  isEnd: boolean
  label: string
}

const DRAFT_KEY = 'lvyv_wish_builder_draft_v1'
const auth = useMemberAuth()
const { loading: configLoading, error: configError, load: loadWishConfig } = useWishConfig()
const route = useRoute()

const steps = [
  { label: 'Choose City', prompt: 'Choose where to meet, you can choose multiple options' },
  { label: 'Travel Dates', prompt: 'How long are you planning to wander?' },
  { label: 'Interests', prompt: '"What kind of encounters are you dreaming of? Pick as many as you like."' },
  { label: 'Budget', prompt: "What's your budget style? (Not including international flights)" },
  { label: 'Your Story', prompt: '"Anything we should know to make your encounter perfect?"' },
  { label: 'Special Needs', prompt: 'Anything else we should know to make your encounter perfect?' },
  { label: 'Confirm', prompt: '' },
]

const interestOptions = ref<Array<{ code: string; label: string; icon: string; defaultSelected: boolean }>>([
  { code: 'history', label: 'History', icon: 'interest-design/history', defaultSelected: false },
  { code: 'local_life', label: 'Local Life', icon: 'interest-design/local-life', defaultSelected: false },
  { code: 'solo_friendly', label: 'Solo-friendly', icon: 'interest-design/solo-friendly', defaultSelected: false },
  { code: 'couple_friendly', label: 'Couple-friendly', icon: 'interest-design/couple-friendly', defaultSelected: false },
  { code: 'family_friendly', label: 'Family-friendly', icon: 'interest-design/family-friendly', defaultSelected: false },
  { code: 'senior_friendly', label: 'Senior-friendly', icon: 'interest-design/senior-friendly', defaultSelected: false },
  { code: 'culture', label: 'Culture', icon: 'interest-design/culture', defaultSelected: false },
  { code: 'art', label: 'Art', icon: 'interest-design/art', defaultSelected: false },
  { code: 'nature', label: 'Nature', icon: 'interest-design/nature', defaultSelected: false },
  { code: 'indoor', label: 'Indoor', icon: 'interest-design/indoor', defaultSelected: false },
  { code: 'nightlife', label: 'Nightlife', icon: 'interest-design/nightlife', defaultSelected: false },
  { code: 'outdoor', label: 'Outdoor', icon: 'interest-design/outdoor', defaultSelected: false },
  { code: 'food', label: 'Food', icon: 'interest-design/food', defaultSelected: false },
  { code: 'adventure', label: 'Adventure', icon: 'interest-design/adventure', defaultSelected: false },
])
const budgetOptions = ref<Array<{ code: string; label: string; price: string; icon: string; features: string[]; defaultSelected: boolean }>>([])
const journeyOptions = ref<Array<{ code: string; title: string; subtitle: string; image: string; alt: string; story: string; defaultSelected: boolean }>>([])
const selectedStoryCode = ref('')
const cityCards = ref<Array<{
  code: string
  englishName: string
  chineseName: string
  imageUrl: string
  defaultSelected: boolean
}>>([])

const wishIconAssets: Record<string, string> = {
  'wish-food': '/images/wish/icons/interest-food.svg',
  'wish-local': '/images/wish/icons/interest-local.svg',
  'wish-history': '/images/wish/icons/interest-history.svg',
  'wish-art': '/images/wish/icons/interest-art.svg',
  'wish-backpacker': '/images/wish/icons/budget-backpacker.svg',
  'wish-comfort': '/images/wish/icons/budget-comfort.svg',
  'wish-premium': '/images/wish/icons/budget-premium.svg',
}
const wishIconAsset = (icon: string) => wishIconAssets[icon] || ''
const interestIconAsset = (icon: string) => icon.startsWith('interest-design/')
  ? `/images/wish/icons/${icon}.svg`
  : wishIconAsset(icon)

const formatDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
const parseDateKey = (value: string) => {
  const [year = 1970, month = 1, day = 1] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}
const addDays = (date: Date, count: number) => {
  const next = new Date(date)
  next.setDate(next.getDate() + count)
  return next
}

const initialDraft = (): WishDraft => ({
  cityCode: '',
  tripDays: 0,
  startDate: '',
  endDate: '',
  interestCodes: [],
  budgetLevel: '',
  story: '',
  specialRequirement: '',
})

const form = reactive<WishDraft>(initialDraft())

const stepCookie = useCookie<number>('lvyv_wish_step', { default: () => 0, maxAge: 86400 * 7 })
const furthestCookie = useCookie<number>('lvyv_wish_furthest', { default: () => 0, maxAge: 86400 * 7 })

const queryStep = route.query.step ? Math.max(0, Math.min(6, Number(route.query.step) - 1)) : undefined
const initialStep = queryStep !== undefined ? queryStep : Math.max(0, Math.min(6, Number(stepCookie.value) || 0))
const initialFurthest = Math.max(initialStep, Math.min(6, Number(furthestCookie.value) || 0))

const currentStep = ref(initialStep)
const furthestStep = ref(initialFurthest)
const submitted = ref(false)
const submitting = ref(false)
const submitError = ref('')
const shareMessage = ref('')
const today = new Date()
const calendarMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1))
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const resetDates = () => {
  form.startDate = ''
  form.endDate = ''
  form.tripDays = 0
  furthestStep.value = Math.min(furthestStep.value, 1)
  if (currentStep.value > 1) currentStep.value = 1
}

const saveDraft = () => {
  if (!import.meta.client) return
  stepCookie.value = currentStep.value
  furthestCookie.value = furthestStep.value
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify({
    form: { ...form },
    storyTemplateCode: selectedStoryCode.value,
    step: currentStep.value,
    furthest: furthestStep.value,
  }))
}
const restoreDraft = () => {
  if (!import.meta.client) return
  try {
    const saved = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || '')
    if (!saved?.form) return
    Object.assign(form, initialDraft(), saved.form)
    selectedStoryCode.value = typeof saved.storyTemplateCode === 'string' ? saved.storyTemplateCode : ''
    const savedStep = Math.min(6, Math.max(0, Number(saved.step) || 0))
    const savedFurthest = Math.min(6, Math.max(savedStep, Number(saved.furthest) || 0))
    currentStep.value = savedStep
    furthestStep.value = savedFurthest
    stepCookie.value = savedStep
    furthestCookie.value = savedFurthest
    if (form.startDate && form.endDate) {
      const date = parseDateKey(form.startDate)
      const calculatedDays = Math.round((parseDateKey(form.endDate).getTime() - date.getTime()) / 86_400_000) + 1
      if (calculatedDays >= 1) {
        form.tripDays = calculatedDays
        calendarMonth.value = new Date(date.getFullYear(), date.getMonth(), 1)
      }
      else {
        resetDates()
      }
    }
    else {
      resetDates()
    }
    if (!Boolean(form.startDate && form.endDate) && currentStep.value > 1) {
      currentStep.value = 1
      furthestStep.value = 1
      stepCookie.value = 1
      furthestCookie.value = 1
    }
  } catch {
    sessionStorage.removeItem(DRAFT_KEY)
  }
}

if (import.meta.client) {
  restoreDraft()
}

const selectedCityLabel = computed(() => {
  return cityCards.value.find(city => city.code === form.cityCode)?.englishName
    || form.cityCode
})
const selectedInterestOptions = computed(() => interestOptions.value.filter(option => form.interestCodes.includes(option.code)))
const selectedBudget = computed(() => budgetOptions.value.find(option => option.code === form.budgetLevel))
const hasCompleteTravelDates = computed(() => Boolean(form.startDate && form.endDate))

const calendarTitle = computed(() => new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(calendarMonth.value))
const calendarDays = computed<CalendarDay[]>(() => {
  const first = new Date(calendarMonth.value.getFullYear(), calendarMonth.value.getMonth(), 1)
  const gridStart = addDays(first, -first.getDay())
  const earliest = formatDateKey(addDays(new Date(), 1))
  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(gridStart, index)
    const key = formatDateKey(date)
    return {
      key,
      day: date.getDate(),
      inMonth: date.getMonth() === calendarMonth.value.getMonth(),
      disabled: key < earliest,
      inRange: Boolean(form.startDate && form.endDate && key >= form.startDate && key <= form.endDate),
      isStart: key === form.startDate,
      isEnd: key === form.endDate,
      label: new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(date),
    }
  })
})

const travelDateLabel = computed(() => {
  if (!form.startDate) return 'Select travel dates'
  const start = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(parseDateKey(form.startDate))
  const end = form.endDate
    ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(parseDateKey(form.endDate))
    : 'Choose an end date'
  return `${start}  →  ${end}`
})
const reviewTravelDate = computed(() => {
  if (!form.startDate || !form.endDate) return 'Not Decided Yet'
  const formatter = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' })
  return `${formatter.format(parseDateKey(form.startDate))} - ${formatter.format(parseDateKey(form.endDate))}`
})

const isStepValid = (stepIndex: number): boolean => {
  if (stepIndex === 0) return Boolean(form.cityCode)
  if (stepIndex === 1) return hasCompleteTravelDates.value && form.tripDays >= 1
  if (stepIndex === 2) return form.interestCodes.length > 0
  if (stepIndex === 3) return Boolean(form.budgetLevel)
  if (stepIndex === 4) return form.story.trim().length > 0
  if (stepIndex === 5) return true
  return true
}

const isStepAvailable = (targetIndex: number): boolean => {
  if (submitted.value) return false
  if (targetIndex === currentStep.value) return true
  if (targetIndex === 0) return true
  // 无论是向前回退还是向后跳转，目标步骤之前的所有步骤（0 到 targetIndex - 1）都必须满足有效性
  for (let i = 0; i < targetIndex; i++) {
    if (!isStepValid(i)) return false
  }
  // 向后跳转不能超过曾到达过的最大步骤
  if (targetIndex > currentStep.value && targetIndex > furthestStep.value) {
    return false
  }
  return true
}

const canContinue = computed(() => {
  if (configLoading.value || configError.value) return false
  return isStepValid(currentStep.value)
})

const goToStep = (index: number) => {
  if (!isStepAvailable(index)) return
  currentStep.value = index
  submitError.value = ''
}
const nextStep = () => {
  if (!canContinue.value || currentStep.value >= steps.length - 1) return
  currentStep.value += 1
  furthestStep.value = Math.max(furthestStep.value, currentStep.value)
}
const previousStep = () => {
  if (currentStep.value > 0) currentStep.value -= 1
}
const toggleInterest = (code: string) => {
  const index = form.interestCodes.indexOf(code)
  if (index >= 0) form.interestCodes.splice(index, 1)
  else form.interestCodes.push(code)
}
const selectStory = (code: string) => {
  const template = journeyOptions.value.find(option => option.code === code)
  if (!template) return
  selectedStoryCode.value = code
  form.story = template.story
}
const applyWishConfig = async (preserveDraft: boolean, force = false) => {
  const draftStoryCode = selectedStoryCode.value
  const config = await loadWishConfig(force)
  cityCards.value = config.cities
  // Interest tags are product-owned values, independent of the editable wish config.
  form.interestCodes = preserveDraft && form.interestCodes.length
    ? form.interestCodes.filter(code => interestOptions.value.some(option => option.code === code))
    : []
  budgetOptions.value = config.budgets.map(option => ({ ...option, price: option.priceText }))
  journeyOptions.value = config.storyTemplates.map(option => ({
    code: option.code,
    title: option.title,
    subtitle: option.subtitle,
    image: option.imageUrl,
    alt: option.title,
    story: option.story,
    defaultSelected: option.defaultSelected,
  }))
  const currentCityIsValid = cityCards.value.some(option => option.code === form.cityCode)
  if (!preserveDraft || !currentCityIsValid) {
    form.cityCode = cityCards.value.find(option => option.defaultSelected)?.code || cityCards.value[0]?.code || ''
  }
  const validBudget = budgetOptions.value.some(option => option.code === form.budgetLevel)
  if (!preserveDraft || !validBudget) {
    form.budgetLevel = budgetOptions.value.find(option => option.defaultSelected)?.code || budgetOptions.value[0]?.code || ''
  }
  const defaultStory = journeyOptions.value.find(option => option.defaultSelected) || journeyOptions.value[0]
  const draftStory = journeyOptions.value.find(option => option.code === draftStoryCode)
  if (preserveDraft && draftStory) {
    selectedStoryCode.value = draftStory.code
    form.story = draftStory.story
  }
  else if (!preserveDraft || !form.story.trim() || Boolean(draftStoryCode)) {
    selectedStoryCode.value = defaultStory?.code || ''
    form.story = defaultStory?.story || ''
  }
  else {
    selectedStoryCode.value = journeyOptions.value.find(option => option.story === form.story)?.code || ''
  }
}
const selectCity = async (cityCode: string) => {
  const city = cityCards.value.find(item => item.code === cityCode)
  if (!city) return
  form.cityCode = cityCode
}
const reloadWishConfig = async () => {
  try {
    await applyWishConfig(true, true)
  }
  catch {
    // The composable exposes the actionable error state.
  }
}
const moveCalendar = (offset: number) => {
  calendarMonth.value = new Date(calendarMonth.value.getFullYear(), calendarMonth.value.getMonth() + offset, 1)
}
const selectCalendarDay = (key: string) => {
  if (!form.startDate || form.endDate || key <= form.startDate) {
    form.startDate = key
    form.endDate = ''
    form.tripDays = 0
    furthestStep.value = Math.min(furthestStep.value, 1)
    return
  }
  form.endDate = key
  form.tripDays = Math.max(1, Math.round((parseDateKey(key).getTime() - parseDateKey(form.startDate).getTime()) / 86_400_000) + 1)
}
const changeTripDays = (amount: number) => {
  if (!hasCompleteTravelDates.value) return
  form.tripDays = Math.min(30, Math.max(1, form.tripDays + amount))
  form.endDate = formatDateKey(addDays(parseDateKey(form.startDate), form.tripDays - 1))
}
const submitWish = async () => {
  submitError.value = ''
  if (!hasCompleteTravelDates.value || form.tripDays < 1) {
    currentStep.value = 1
    furthestStep.value = 1
    return
  }
  saveDraft()
  if (!auth.token.value) {
    await navigateTo(`/login/?redirect=${encodeURIComponent('/wish/create?resume=1')}`)
    return
  }

  submitting.value = true
  try {
    await auth.request<number>('/tour/wishes', {
      cityCode: form.cityCode,
      tripDays: form.tripDays,
      startDate: form.startDate || null,
      endDate: form.endDate || null,
      interestCodes: [...form.interestCodes],
      budgetLevel: form.budgetLevel,
      story: form.story.trim(),
      specialRequirement: form.specialRequirement.trim(),
      imageObjectKeys: [],
    })
    submitted.value = true
    sessionStorage.removeItem(DRAFT_KEY)
    stepCookie.value = 0
    furthestCookie.value = 0
  } catch (caught) {
    submitError.value = caught instanceof Error ? caught.message : 'Unable to submit your wish. Please try again.'
    await reloadWishConfig()
  } finally {
    submitting.value = false
  }
}

const shareJourney = async () => {
  const shareData = { title: 'My Lvyv Wish', text: 'My China journey is taking shape with Lvyv.', url: window.location.origin + '/wish' }
  try {
    if (navigator.share) await navigator.share(shareData)
    else {
      await navigator.clipboard.writeText(shareData.url)
      shareMessage.value = 'Wish link copied.'
    }
  } catch (caught) {
    if (caught instanceof Error && caught.name !== 'AbortError') shareMessage.value = 'Unable to share right now.'
  }
}

watch(form, saveDraft, { deep: true })
watch(selectedStoryCode, saveDraft)
watch([currentStep, furthestStep], saveDraft)

onMounted(async () => {
  await applyWishConfig(true).catch(() => undefined)
  if (route.query.resume === '1' && currentStep.value < 6) {
    if (hasCompleteTravelDates.value) {
      currentStep.value = 6
      furthestStep.value = 6
    }
    else {
      currentStep.value = 1
      furthestStep.value = 1
    }
  }
})

useNoIndex()
useLvyvSeo({
  title: 'Create Your Wish - Lvyv Travel',
  description: 'Tell us about the China journey you are dreaming of and let a real travel designer shape it for you.',
  path: '/wish/create',
})
</script>

<style scoped>
.wish-builder {
  min-height: 100svh;
  padding: 100px 5.55% 40px;
  background: #fff;
  color: #203d33;
  font-family: 'Inter', sans-serif;
}

.wish-builder__shell {
  width: min(1280px, 100%);
  min-height: 640px;
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  margin: 0 auto;
  padding: 0;
  overflow: hidden;
  border-radius: 8px;
  background: #eaf0ec;
}

.wish-progress {
  position: relative;
  min-width: 0;
  padding: 54px 20px 54px 48px;
  background: #285c43;
  color: #fff;
}

.wish-progress__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.wish-progress__item {
  position: relative;
  min-height: 71px;
}

.wish-progress__item:not(:last-child)::after {
  position: absolute;
  z-index: 0;
  top: 32px;
  left: 15px;
  width: 1px;
  height: 39px;
  background: rgba(255, 255, 255, .55);
  content: '';
}

.wish-progress__button {
  position: relative;
  z-index: 1;
  width: 100%;
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr) 18px;
  align-items: center;
  gap: 18px;
  padding: 0;
  border: 0;
  background: transparent;
  color: rgba(255, 255, 255, .9);
  font: 400 16px/1.3 'Inter', sans-serif;
  text-align: left;
}

.wish-progress__button.is-available { cursor: pointer; }
.wish-progress__button:disabled { cursor: default; }
.wish-progress__button.is-active { color: #cff380; }

.wish-progress__marker {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border: 1px solid #a1aebe;
  border-radius: 50%;
  background: #fff;
  color: #242e39;
  font-size: 13px;
  font-weight: 500;
  overflow: hidden;
}

.wish-progress__marker svg,
.wish-progress__marker :deep(svg) {
  width: 14px;
  height: 14px;
  max-width: 14px;
  max-height: 14px;
  display: block;
}

.wish-progress__button.is-active .wish-progress__marker {
  border-color: #cff380;
  background: #cff380;
}

.wish-progress__button.is-complete .wish-progress__marker {
  border-color: #fff;
  color: #285c43;
}

.wish-progress__arrow,
.wish-progress__button :deep(.wish-progress__arrow) {
  width: 12px;
  height: 12px;
  max-width: 12px;
  max-height: 12px;
  font-size: 12px;
  display: block;
}
.wish-progress__mobile-label { display: none; }

.wish-conversation {
  position: relative;
  height: 640px;
  min-width: 0;
  min-height: 640px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 44px 80px 76px 140px;
  background: #eaf0ec;
}

.wish-stage {
  min-height: 0;
  flex: 1;
  overflow-y: auto;
  scrollbar-gutter: stable;
}

.wish-chat {
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.wish-chat__avatar {
  width: 44px;
  height: 44px;
  display: flex;
  flex: 0 0 44px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #698e4e;
  overflow: visible;
}

.wish-chat__avatar img {
  width: 44px;
  height: 44px;
  display: block;
  border-radius: 50%;
}

.wish-chat p {
  width: fit-content;
  max-width: min(520px, 100%);
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  margin: 0;
  padding: 10px 16px;
  border: 1px solid #fff;
  border-radius: 8px;
  background: rgba(255, 255, 255, .5);
  color: #160211;
  font: 400 14px/1.4 'Manrope', 'Inter', sans-serif;
  white-space: normal;
  box-sizing: border-box;
}

.wish-city-stage { min-width: 0; }

.wish-city-grid {
  display: grid;
  grid-template-columns: repeat(3, 210px);
  gap: 30px 40px;
  margin-top: 40px;
}

.wish-city-card {
  position: relative;
  height: 126px;
  overflow: hidden;
  padding: 0;
  border: 0;
  border-radius: 20px;
  background: #073724;
  color: #fff;
  cursor: pointer;
  text-align: left;
  transition: transform .2s ease, box-shadow .2s ease;
}

.wish-city-card:hover { transform: translateY(-3px); }
.wish-city-card.is-selected { outline: 2px solid #142b22; outline-offset: -2px; box-shadow: 0 10px 24px rgba(32, 61, 51, .13); }
.wish-city-card > img { width: 100%; height: 100%; display: block; object-fit: cover; }
.wish-city-card__shade { position: absolute; inset: 0; background: rgba(3, 53, 40, .57); mix-blend-mode: multiply; }
.wish-city-card__name, .wish-city-card__zh { position: absolute; left: 14px; z-index: 1; }
.wish-city-card__name { top: 12px; color: rgba(255, 255, 255, .5); font: 600 24px/1 'Khula', sans-serif; text-transform: uppercase; }
.wish-city-card__zh { top: 42px; font-size: 16px; font-weight: 300; }
.wish-city-card__zh { color: rgba(255, 255, 255, .5); }
.wish-city-card.is-selected .wish-city-card__shade { background: rgba(3, 53, 40, .35); }
.wish-city-card.is-selected .wish-city-card__name,
.wish-city-card.is-selected .wish-city-card__zh { color: #fff; }

.wish-city-card__status,
.wish-choice-check {
  position: absolute;
  z-index: 2;
  top: 8px;
  right: 8px;
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #cff380;
  color: #285c43;
  font-size: 11px;
}

.wish-city-card__status {
  border: 1px solid rgba(255, 255, 255, .72);
  background: transparent;
}

.wish-city-card.is-selected .wish-city-card__status {
  border-color: #cff380;
  background: #cff380;
}

.wish-calendar-card {
  width: 360px;
  overflow: hidden;
  border-radius: 20px;
  background: #fff;
  color: #252525;
}

.wish-calendar-card__summary {
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 0 20px;
  border-bottom: 1px solid #e8e8e8;
  font-size: 14px;
}

.wish-duration { display: inline-flex; align-items: center; gap: 5px; color: #777; white-space: nowrap; }
.wish-duration strong { color: #2a573f; font-size: 20px; }
.wish-duration button { width: 22px; height: 22px; border: 1px solid #d5ddd8; border-radius: 50%; background: #fff; color: #2a573f; cursor: pointer; }
.wish-calendar-card__month { display: grid; grid-template-columns: 32px 1fr 32px; align-items: center; padding: 15px 15px 8px; }
.wish-calendar-card__month strong { text-align: center; font-size: 14px; }
.wish-calendar-card__month button { width: 32px; height: 32px; border: 0; border-radius: 50%; background: transparent; color: #2a573f; cursor: pointer; }
.wish-calendar-card__month button:hover { background: #edf9e1; }

.wish-calendar { display: grid; grid-template-columns: repeat(7, 1fr); padding: 0 16px 9px; }
.wish-calendar__weekday { height: 32px; display: grid; place-items: center; color: #8d8d8d; font-size: 10px; }
.wish-calendar__day { position: relative; height: 38px; border: 0; background: transparent; color: #333; font-size: 12px; cursor: pointer; isolation: isolate; }
.wish-calendar__day span { position: relative; z-index: 2; }
.wish-calendar__day:hover:not(:disabled) { background: #edf9e1; }
.wish-calendar__day.is-outside.is-disabled { color: #aeb4b0; }
.wish-calendar__day.is-disabled { color: #d1d4d2; cursor: not-allowed; }
.wish-calendar__day.is-range::before { position: absolute; z-index: 0; inset: 0; background: #d8f5c3; content: ''; }
.wish-calendar__day.is-start::before { left: 50%; }
.wish-calendar__day.is-end::before { right: 50%; }
.wish-calendar__day.is-edge { color: #fff; }
.wish-calendar__day.is-edge::after { position: absolute; z-index: 1; top: 50%; left: 50%; width: 40px; height: 40px; border-radius: 50%; background: #285c43; content: ''; transform: translate(-50%, -50%); }
.wish-calendar-card__reset { margin: 0 16px 15px; padding: 8px 13px; border: 1px solid #bfc9c3; border-radius: 20px; background: #fff; color: #3e4d45; font-size: 11px; cursor: pointer; }

.wish-interest-stage { max-width: 720px; }
.wish-selected-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
.wish-selected-tags button { min-height: 40px; padding: 0 15px; border: 1px solid #698e4e; border-radius: 26px; background: #edf9e1; color: #2a573f; font-size: 13px; cursor: pointer; }
.wish-selected-tags span { margin-left: 8px; }
.wish-interest-grid { display: flex; flex-wrap: wrap; gap: 10px; }
.wish-interest { position: relative; min-width: 123px; min-height: 44px; height: 44px; display: flex; align-items: center; gap: 10px; padding: 0 30px 0 14px; border: 1px solid #698e4e; border-radius: 10px; background: #f9f9f9; color: #2a573f; font: 400 14px/1 'Outfit', 'Inter', sans-serif; cursor: pointer; }
.wish-interest:hover, .wish-interest.is-selected { background: #fff; }
.wish-interest__icon { width: 24px; height: 24px; display: grid; flex: 0 0 24px; place-items: center; }
.wish-interest__icon img, .wish-interest__icon svg { max-width: 24px; max-height: 24px; }
.wish-interest__check { position: absolute; top: 7px; right: 7px; width: 16px; height: 16px; display: grid; place-items: center; }
.wish-interest__check img { width: 16px; height: 16px; display: block; }

.wish-budget-grid { display: grid; grid-template-columns: repeat(3, minmax(160px, 210px)); gap: 20px; }
.wish-budget { position: relative; min-height: 300px; display: flex; flex-direction: column; align-items: center; padding: 31px 24px 24px; border: 1px solid transparent; border-radius: 20px; background: #fff; color: #4d5853; cursor: pointer; text-align: center; transition: transform .2s ease, border-color .2s ease; }
.wish-budget:hover { transform: translateY(-3px); }
.wish-budget.is-selected { border-color: #698e4e; }
.wish-budget__icon { width: 66px; height: 52px; display: grid; place-items: center; margin-bottom: 25px; color: #285c43; }
.wish-budget__icon img { max-width: 66px; max-height: 52px; }
.wish-budget__icon svg { max-width: 46px; max-height: 42px; font-size: 37px; }
.wish-budget > span:not(.wish-choice-check):not(.wish-budget__icon) { font-size: 13px; text-transform: uppercase; }
.wish-budget > strong { margin: 26px 0 10px; color: #2a573f; font-size: 18px; text-transform: uppercase; }
.wish-budget > small { width: 100%; margin-top: 4px; color: #6f7773; font-size: 10px; text-align: left; text-transform: uppercase; }
.wish-budget > small::before { margin-right: 8px; content: '•'; }

.wish-story-stage, .wish-needs-stage { max-width: 850px; }
.wish-textarea { position: relative; display: block; }
.wish-textarea textarea { width: 100%; min-height: 130px; display: block; resize: vertical; padding: 20px 24px 34px; border: 1px solid #fff; border-radius: 8px; outline: none; background: rgba(255, 255, 255, .6); color: #222; font: 400 14px/1.55 'Inter', sans-serif; }
.wish-textarea textarea:focus { border-color: #698e4e; box-shadow: 0 0 0 3px rgba(105, 142, 78, .12); }
.wish-textarea small { position: absolute; right: 16px; bottom: 10px; color: #8b8b8b; font-size: 11px; }
.wish-journeys { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; margin-top: 62px; }
.wish-journey { min-width: 0; overflow: hidden; padding: 8px 8px 14px; border: 1px solid transparent; border-radius: 16px; background: #fff; color: #1f2d27; cursor: pointer; text-align: left; transition: transform .2s ease, border-color .2s ease; }
.wish-journey:hover { transform: translateY(-3px); }
.wish-journey.is-selected { border-color: #698e4e; }
.wish-journey img { width: 100%; height: 128px; display: block; border-radius: 10px; object-fit: cover; }
.wish-journey strong { display: block; margin-top: 10px; overflow: hidden; font-size: 9px; text-overflow: ellipsis; white-space: nowrap; }
.wish-journey small { display: block; margin: 7px 0 0 20px; color: #969696; font-size: 9px; }
.wish-textarea--needs textarea { min-height: 165px; }
.wish-clear-needs { margin-top: 12px; padding: 0; border: 0; background: transparent; color: #2a573f; font-size: 12px; text-decoration: underline; cursor: pointer; }

.wish-review-stage { display: flex; flex-direction: column; align-items: center; padding-top: 15px; }
.wish-review { width: min(420px, 100%); padding: 25px 40px 24px; border: 1px solid #698e4e; border-radius: 20px; background: #fff; }
.wish-review h2 { margin: 0 0 21px; color: #203d33; font: 700 20px/1.1 'Playfair Display', Georgia, serif; text-align: center; text-transform: uppercase; }
.wish-review dl { display: grid; gap: 11px; margin: 0; }
.wish-review dl > div { display: grid; grid-template-columns: 105px minmax(0, 1fr); gap: 14px; }
.wish-review dt { color: rgba(0, 0, 0, .58); font-size: 12px; }
.wish-review dd { margin: 0; color: #121212; font-size: 12px; line-height: 1.35; }
.wish-review__tags { display: flex; flex-wrap: wrap; gap: 5px; }
.wish-review__tags span { padding: 3px 10px; border: 1px solid #698e4e; border-radius: 20px; background: #edf9e1; color: #2a573f; font-size: 10px; }
.wish-review__story { display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 4; }
.wish-review__actions, .wish-success__actions { display: flex; justify-content: center; gap: 18px; margin-top: 30px; }
.wish-submit-error { width: min(420px, 100%); margin: 14px 0 0; padding: 10px 13px; border-radius: 6px; background: #fff0ee; color: #9f3d34; font-size: 12px; }
.wish-config-state { min-height: 260px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; color: #5f6e67; font-size: 13px; text-align: center; }
.wish-config-state strong { color: #203d33; font-size: 15px; }
.wish-config-state button { min-height: 36px; padding: 0 16px; border: 1px solid #2a573f; border-radius: 20px; background: transparent; color: #203d33; cursor: pointer; }
.wish-config-state--error > svg { color: #a33e35; font-size: 22px; }
.wish-config-spinner { width: 22px; height: 22px; border: 2px solid #b9c6bf; border-top-color: #2a573f; border-radius: 50%; animation: wish-config-spin .7s linear infinite; }
@keyframes wish-config-spin { to { transform: rotate(360deg); } }

.wish-button { min-height: 40px; display: inline-flex; align-items: center; justify-content: center; padding: 0 23px; border: 1px solid #2a573f; border-radius: 30px; font: 500 13px/1 'Inter', sans-serif; cursor: pointer; text-decoration: none; }
.wish-button--primary { background: #2a573f; color: #fff; }
.wish-button--outline { background: transparent; color: #203d33; }
.wish-button:disabled { opacity: .6; cursor: wait; }

.wish-stage__actions { position: absolute; right: 32px; bottom: 29px; display: flex; align-items: center; gap: 10px; }
.wish-back-button { width: 40px; height: 40px; border: 1px solid #2a573f; border-radius: 50%; background: transparent; color: #2a573f; cursor: pointer; }
.wish-next-button { min-height: 40px; display: inline-flex; align-items: center; gap: 10px; padding: 0 7px 0 17px; border: 0; border-radius: 30px; background: #203d33; color: #fff; font-size: 13px; cursor: pointer; }
.wish-next-button:disabled { opacity: .45; cursor: not-allowed; }
.wish-next-button__icon { width: 24px; height: 24px; display: grid; place-items: center; border-radius: 50%; background: #fff; color: #203d33; font-size: 11px; }

.wish-success { min-height: 520px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.wish-success > img { width: 274px; height: 183px; object-fit: contain; }
.wish-success h2 { margin: 20px 0 13px; color: #203d33; font: 700 24px/1.2 'Playfair Display', Georgia, serif; text-transform: uppercase; }
.wish-success > p { margin: 0; color: #151515; font-size: 14px; line-height: 1.7; text-transform: capitalize; }
.wish-success > span { margin-top: 27px; color: rgba(0, 0, 0, .58); font-size: 12px; }
.wish-success .wish-success__share { margin-top: 12px; color: #2a573f; font-size: 12px; }

.wish-step-enter-active, .wish-step-leave-active { transition: opacity .18s ease, transform .18s ease; }
.wish-step-enter-from { opacity: 0; transform: translateX(10px); }
.wish-step-leave-to { opacity: 0; transform: translateX(-8px); }

@media (max-width: 1180px) {
  .wish-builder { padding-inline: 28px; }
  .wish-builder__shell { grid-template-columns: 260px minmax(0, 1fr); }
  .wish-progress { padding-inline: 32px 24px; }
  .wish-conversation { padding-inline: 52px; }
  .wish-city-grid { grid-template-columns: repeat(3, minmax(140px, 210px)); gap: 24px; }
  .wish-budget-grid { grid-template-columns: repeat(3, minmax(150px, 1fr)); }
  .wish-journeys { overflow-x: auto; grid-template-columns: repeat(5, 130px); padding-bottom: 8px; }
}

@media (max-width: 820px) {
  .wish-builder { padding: 88px 12px 20px; }
  .wish-builder__shell { min-height: calc(100svh - 108px); grid-template-columns: 1fr; grid-template-rows: auto minmax(0, 1fr); }
  .wish-progress { padding: 17px 18px 15px; }
  .wish-progress__list { position: relative; display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; }
  .wish-progress__list::before { position: absolute; top: 15px; right: 5%; left: 5%; height: 1px; background: rgba(255,255,255,.45); content: ''; }
  .wish-progress__item { min-height: 32px; }
  .wish-progress__item::after { display: none; }
  .wish-progress__button { display: flex; justify-content: center; }
  .wish-progress__marker { width: 30px; height: 30px; flex: 0 0 30px; }
  .wish-progress__label, .wish-progress__arrow { display: none; }
  .wish-progress__mobile-label { display: block; margin: 10px 0 0; color: #cff380; font-size: 13px; text-align: center; }
  .wish-conversation { height: 650px; min-height: 650px; padding: 28px 22px 74px; }
  .wish-chat { margin-left: 0; }
  .wish-city-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
  .wish-city-card { height: 126px; border-radius: 14px; }
  .wish-city-card__name { font-size: 17px; }
  .wish-city-card__zh { top: 36px; font-size: 13px; }
  .wish-budget-grid { gap: 10px; }
  .wish-budget { min-height: 270px; padding-inline: 15px; }
  .wish-journeys { margin-top: 35px; }
}

@media (max-width: 560px) {
  .wish-builder { padding-inline: 0; padding-bottom: 0; }
  .wish-builder__shell { min-height: calc(100svh - 88px); border-radius: 0; }
  .wish-conversation { height: 670px; min-height: 670px; padding-inline: 16px; }
  .wish-chat { margin-bottom: 24px; }
  .wish-chat p { font-size: 13px; max-width: 100%; }
  .wish-city-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .wish-city-card { height: 120px; }
  .wish-calendar-card { width: 100%; }
  .wish-calendar-card__summary { padding-inline: 14px; font-size: 12px; }
  .wish-calendar { padding-inline: 8px; }
  .wish-interest { min-width: 0; width: 100%; }
  .wish-budget-grid { grid-template-columns: 1fr; }
  .wish-budget { min-height: 155px; display: grid; grid-template-columns: 52px 1fr; align-content: center; justify-items: start; padding: 20px 24px; text-align: left; }
  .wish-budget__icon { width: 52px; height: 42px; grid-row: 1 / 6; margin: 0; }
  .wish-budget__icon img { max-width: 52px; max-height: 42px; }
  .wish-budget__icon svg { max-width: 38px; max-height: 32px; font-size: 30px; }
  .wish-budget > strong { margin: 8px 0 4px; }
  .wish-budget > small { text-align: left; }
  .wish-textarea textarea { min-height: 160px; padding-inline: 16px; }
  .wish-journeys { grid-template-columns: repeat(5, 145px); margin-right: -16px; }
  .wish-review { padding-inline: 20px; }
  .wish-review dl > div { grid-template-columns: 85px minmax(0, 1fr); }
  .wish-review__actions, .wish-success__actions { gap: 8px; }
  .wish-button { padding-inline: 17px; font-size: 12px; }
  .wish-stage__actions { right: 16px; bottom: 20px; }
  .wish-success { min-height: 570px; }
  .wish-success > img { width: 230px; height: auto; }
  .wish-success h2 { font-size: 20px; }
  .wish-success > p { font-size: 12px; }
}
</style>
