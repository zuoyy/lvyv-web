export default defineNuxtPlugin(() => {
  const route = useRoute()
  const attribution = useMarketingAttribution()
  const capture = () => attribution.capture(route.query as Record<string, unknown>)
  onNuxtReady(capture)
  watch(() => route.fullPath, capture)
})
