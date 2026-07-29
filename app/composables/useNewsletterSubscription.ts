interface NewsletterApiResult<T> {
  code: number
  msg?: string
  data: T
}

export type NewsletterRequestStatus = 'CONFIRMATION_SENT' | 'ALREADY_SUBSCRIBED'
export type NewsletterConfirmStatus = 'SUBSCRIBED' | 'ALREADY_SUBSCRIBED'

export const useNewsletterSubscription = () => {
  const config = useRuntimeConfig()

  const request = async <T>(path: string, body: Record<string, unknown>) => {
    try {
      const response = await $fetch<NewsletterApiResult<T>>(path, {
        baseURL: config.public.apiBase as string,
        method: 'POST',
        body
      })
      if (response.code !== 200) throw new Error(response.msg || 'Request failed')
      return response.data
    } catch (error: any) {
      const message = error?.data?.msg || error?.response?._data?.msg || error?.message
      throw new Error(message || 'Unable to update your newsletter subscription')
    }
  }

  return {
    subscribe: (email: string) => request<{ status: NewsletterRequestStatus }>('/mail/newsletter/subscribe', {
      email,
      locale: import.meta.client ? navigator.language : 'en-US',
      timezone: detectMemberTimeZone()
    }),
    confirm: (token: string) => request<{ status: NewsletterConfirmStatus }>('/mail/newsletter/confirm', { token })
  }
}
