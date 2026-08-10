interface TourCityOption {
  code: string
  label: string
  sort: number
}

interface ApiResult<T> {
  code: number
  msg?: string
  data: T
}

export const useTourCities = () => {
  const config = useRuntimeConfig()
  const cities = useState<TourCityOption[]>('tour-city-options', () => [])
  const loading = useState<boolean>('tour-city-options-loading', () => false)
  const error = useState<string>('tour-city-options-error', () => '')

  const load = async (force = false) => {
    if (loading.value || (!force && cities.value.length)) return
    loading.value = true
    error.value = ''
    try {
      const response = await $fetch<ApiResult<TourCityOption[]>>('/tour/wish-configs/options', {
        baseURL: config.public.apiBase as string,
      })
      if (response.code !== 200) throw new Error(response.msg || 'Unable to load destinations')
      cities.value = response.data || []
    } catch (caught) {
      error.value = caught instanceof Error ? caught.message : 'Unable to load destinations'
      throw caught
    } finally {
      loading.value = false
    }
  }

  return { cities, loading, error, load }
}
