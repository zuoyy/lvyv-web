export interface WishCityOption {
  code: string
  englishName: string
  chineseName: string
  imageUrl: string
  defaultSelected: boolean
}

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

export interface WishConfig {
  cities: WishCityOption[]
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
  const cache = useState<WishConfig | null>('wish-config-cache', () => null)
  const loading = ref(false)
  const error = ref('')

  const load = async (force = false) => {
    if (!force && cache.value) return cache.value
    loading.value = true
    error.value = ''
    try {
      const response = await $fetch<ApiResult<WishConfig>>('/tour/wish-configs', {
        baseURL: runtimeConfig.public.apiBase as string,
        headers: { lang: 'en-US', 'Accept-Language': 'en-US' },
      })
      if (response.code !== 200 || !response.data) throw new Error(response.msg || 'Wish options are unavailable.')
      cache.value = response.data
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
