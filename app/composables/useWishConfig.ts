export interface WishInterestOption {
  code: string
  label: string
  icon: string
  defaultSelected: boolean
}

export interface WishBudgetOption {
  code: string
  label: string
  priceText: string
  icon: string
  features: string[]
  defaultSelected: boolean
}

export interface WishStoryTemplate {
  code: string
  title: string
  subtitle: string
  imageUrl: string
  story: string
  defaultSelected: boolean
}

export interface WishCityConfig {
  cityCode: string
  cityLabel: string
  interests: WishInterestOption[]
  budgets: WishBudgetOption[]
  storyTemplates: WishStoryTemplate[]
}

interface ApiResult<T> {
  code: number
  msg?: string
  data: T
}

export const useWishConfig = () => {
  const runtimeConfig = useRuntimeConfig()
  const cache = useState<Record<string, WishCityConfig>>('wish-city-config-cache', () => ({}))
  const loading = ref(false)
  const error = ref('')

  const load = async (cityCode: string, force = false) => {
    if (!cityCode) throw new Error('Choose a destination first.')
    if (!force && cache.value[cityCode]) return cache.value[cityCode]
    loading.value = true
    error.value = ''
    try {
      const response = await $fetch<ApiResult<WishCityConfig>>(`/tour/wish-configs/${encodeURIComponent(cityCode)}`, {
        baseURL: runtimeConfig.public.apiBase as string,
        headers: { lang: 'en-US', 'Accept-Language': 'en-US' },
      })
      if (response.code !== 200 || !response.data) throw new Error(response.msg || 'This destination is not available for wishes yet.')
      cache.value = { ...cache.value, [cityCode]: response.data }
      return response.data
    }
    catch (caught) {
      error.value = caught instanceof Error ? caught.message : 'Unable to load wish options.'
      throw caught
    }
    finally {
      loading.value = false
    }
  }

  return { cache, loading, error, load }
}
