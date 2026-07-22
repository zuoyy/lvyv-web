interface ApiResult<T> { code: number; msg?: string; data: T }
interface LoginResult { accessToken: string; tokenType: string }

export class ApiRequestError extends Error {
  constructor(public readonly code: number, message: string) {
    super(message)
    this.name = 'ApiRequestError'
  }
}

export interface MemberProfile {
  id: number
  email: string
  emailVerified: number
  mobile?: string
  locale: string
  timezone: string
  timezoneMode: number
  passportCountryCode?: string
  nickname?: string
  avatar?: string
  bio?: string
}

export const useMemberAuth = () => {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('token', { sameSite: 'lax', secure: import.meta.env.PROD })
  const member = useState<MemberProfile | null>('member-profile', () => null)

  const request = async <T>(path: string, body?: Record<string, unknown>, method: 'GET' | 'POST' | 'PUT' = 'POST') => {
    try {
      const response = await $fetch<ApiResult<T>>(path, {
        baseURL: config.public.apiBase as string,
        method,
        body: method === 'GET' ? undefined : body,
        headers: {
          'X-Time-Zone': detectMemberTimeZone(),
          ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
        },
      })
      if (response.code !== 200) throw new ApiRequestError(response.code, response.msg || 'Request failed')
      return response.data
    } catch (error: any) {
      if (error instanceof ApiRequestError) throw error
      const message = error?.data?.msg || error?.response?._data?.msg || error?.message
      const code = Number(error?.data?.code || error?.response?._data?.code || 500)
      throw new ApiRequestError(code, message || 'Request failed')
    }
  }

  const loadMember = async () => {
    if (!token.value) {
      member.value = null
      return null
    }
    const loaded = await request<MemberProfile>('/auth/info')
    if (import.meta.client && loaded.timezoneMode === 0) {
      const detected = detectMemberTimeZone()
      if (detected !== loaded.timezone) {
        await request<void>('/auth/timezone', { timezone: detected, timezoneMode: 0 }, 'PUT')
        loaded.timezone = detected
      }
    }
    member.value = loaded
    return member.value
  }

  const clearSession = () => {
    token.value = null
    member.value = null
  }

  const login = async (account: string, password: string) => {
    const result = await request<LoginResult>('/auth/login', { account, password })
    token.value = result.accessToken
    try {
      await loadMember()
    } catch (error) {
      clearSession()
      throw error
    }
    return result
  }

  const googleLogin = () => {
    window.location.href = `${config.public.apiBase}/auth/google`
  }

  return {
    token,
    member,
    login,
    googleLogin,
    loadMember,
    clearSession,
    register: (data: { email: string; password: string; passportCountryCode: string; nickname?: string; mobile?: string; timezone?: string }) => request<number>('/auth/register', data),
    verifyEmailCode: (email: string, code: string) => request<void>('/auth/verify-email-code', { email, code }),
    resendVerificationCode: (email: string) => request<void>('/auth/resend-verification-code', { email }),
    forgotPassword: (email: string) => request<void>('/auth/forgot-password', { email }),
    resetPassword: (value: string, password: string) => request<void>('/auth/reset-password', { token: value, password }),
    updateProfile: async (data: { email: string; mobile?: string; nickname?: string; locale: string; timezone: string; timezoneMode: number; passportCountryCode: string; bio?: string }) => {
      await request<void>('/auth/profile', data, 'PUT')
      return loadMember()
    },
    updateTimezone: (timezone: string, timezoneMode = 0) => request<void>('/auth/timezone', { timezone, timezoneMode }, 'PUT'),
    getPreferences: () => request<{ emailMasked: string; emailVerified: number; subscriptions: { key: string; subscribed: boolean }[] }>('/mail/preferences', undefined, 'GET'),
    updatePreferences: (values: Record<string, boolean>) => request<void>('/mail/preferences', values, 'PUT'),
    getPublicPreferences: (value: string) => request<{ emailMasked: string; emailVerified: number; subscriptions: { key: string; subscribed: boolean }[] }>(`/mail/preferences/${value}`, undefined, 'GET'),
    updatePublicPreferences: (value: string, values: Record<string, boolean>) => request<void>(`/mail/preferences/${value}`, values, 'PUT'),
    unsubscribe: (value: string, subscriptionKey = 'MARKETING') => request<void>('/mail/unsubscribe', { token: value, subscriptionKey }),
    logout: async () => {
      try { await request<void>('/auth/logout') } finally { clearSession() }
    },
  }
}
