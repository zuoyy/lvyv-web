// In-flight state belongs to a Nuxt app and is never shared between SSR users.
const accountRequests = new WeakMap<object, Map<string, Promise<unknown>>>()
const memberRequests = new WeakMap<object, { token: string; promise: Promise<MemberProfile | null> }>()

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
  firstName?: string
  lastName?: string
  country?: string
  stateProvince?: string
  locale: string
  timezone: string
  timezoneMode: number
  passportCountryCode?: string
  gender?: number
  birthday?: string
  nickname?: string
  avatarObjectKey?: string
  avatarUrl?: string
  bio?: string
}

export const useMemberAuth = () => {
  const config = useRuntimeConfig()
  const app = useNuxtApp()
  let pending = accountRequests.get(app)
  if (!pending) { pending = new Map(); accountRequests.set(app, pending) }
  const requests = pending
  const token = useCookie<string | null>('token', { sameSite: 'lax', secure: import.meta.env.PROD })
  const member = useState<MemberProfile | null>('member-profile', () => null)
  const profileError = useState('member-profile-error', () => '')

  const executeRequest = async <T>(path: string, body: Record<string, unknown> | undefined,
    method: 'GET' | 'POST' | 'PUT', authenticated: boolean, timeout?: number) => {
    const requestToken = token.value
    try {
      const response = await $fetch<ApiResult<T>>(path, {
        baseURL: (import.meta.server && !authenticated ? config.contentApiBase : config.public.apiBase) as string,
        method,
        body: method === 'GET' ? undefined : body,
        headers: {
          'X-Time-Zone': member.value?.timezone || detectMemberTimeZone(),
          'Accept-Language': member.value?.locale || 'en-US',
          ...(authenticated && token.value ? { Authorization: `Bearer ${token.value}` } : {}),
        },
        timeout: timeout || (method === 'GET' ? 15000 : 30000),
        retry: 0,
      })
      if (authenticated && token.value !== requestToken) throw new ApiRequestError(499, 'Account session changed.')
      if (response.code !== 200) throw new ApiRequestError(response.code, response.msg || 'Request failed')
      return response.data
    } catch (error: any) {
      if (authenticated && requestToken === token.value && (error?.code === 401 || error?.status === 401 || error?.statusCode === 401 || error?.data?.code === 401)) clearSession()
      if (error instanceof ApiRequestError) throw error
      const message = error?.data?.msg || error?.response?._data?.msg || error?.message
      const code = Number(error?.data?.code || error?.response?._data?.code || error?.statusCode || error?.status || 500)
      throw new ApiRequestError(code, message || 'Request failed')
    }
  }

  const request = <T>(path: string, body?: Record<string, unknown>, method: 'GET' | 'POST' | 'PUT' = 'POST'): Promise<T> => {
    if (method !== 'GET') return executeRequest<T>(path, body, method, true)
    const key = `${token.value}:${member.value?.locale}:${member.value?.timezone}:${path}`
    const existing = requests.get(key)
    if (existing) return existing as Promise<T>
    const result = executeRequest<T>(path, body, method, true).finally(() => {
      if (requests.get(key) === result) requests.delete(key)
    })
    requests.set(key, result)
    return result
  }

  const publicRequest = <T>(path: string, method: 'GET' = 'GET', timeout?: number) =>
    executeRequest<T>(path, undefined, method, false, timeout)

  const loadMember = (): Promise<MemberProfile | null> => {
    const session = token.value
    if (!session) { member.value = null; return Promise.resolve(null) }
    const existing = memberRequests.get(app)
    if (existing?.token === session) return existing.promise
    profileError.value = ''
    const promise = request<MemberProfile>('/auth/info').then((loaded) => {
      if (token.value !== session || memberRequests.get(app)?.promise !== promise) return member.value
      member.value = loaded
      if (import.meta.client && loaded.timezoneMode === 0) {
        const detected = detectMemberTimeZone()
        if (detected !== loaded.timezone) {
          void request<void>('/auth/timezone', { timezone: detected, timezoneMode: 0 }, 'PUT').then(() => {
            if (token.value === session && member.value === loaded) loaded.timezone = detected
          }).catch(() => { /* A timezone sync failure must not block the account. */ })
        }
      }
      return loaded
    }).catch((caught) => {
      if (token.value === session) profileError.value = caught instanceof Error ? caught.message : 'Could not load your account.'
      throw caught
    }).finally(() => {
      if (memberRequests.get(app)?.promise === promise) memberRequests.delete(app)
    })
    memberRequests.set(app, { token: session, promise })
    return promise
  }

  const clearSession = () => {
    token.value = null
    member.value = null
    requests.clear()
    profileError.value = ''
    memberRequests.delete(app)
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

  const googleLogin = (redirect = '/wish') => {
    const safeRedirect = redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/wish'
    window.location.assign(`${config.public.apiBase}/auth/google?redirect=${encodeURIComponent(safeRedirect)}`)
  }

  return {
    request,
    publicRequest,
    token,
    member,
    profileError,
    login,
    googleLogin,
    googleExchange: (ticket: string) => request<LoginResult>('/auth/google/exchange', { ticket }),
    loadMember,
    clearSession,
    register: (data: { email: string; password: string; verificationCode: string; avatarObjectKey: string; timezone?: string }) => request<number>('/auth/register', data),
    sendRegistrationCode: (email: string) => request<void>('/auth/registration-code', { email }),
    verifyEmailCode: (email: string, code: string) => request<void>('/auth/verify-email-code', { email, code }),
    resendVerificationCode: (email: string) => request<void>('/auth/resend-verification-code', { email }),
    forgotPassword: (email: string) => request<void>('/auth/forgot-password', { email }),
    resetPassword: (value: string, password: string) => request<void>('/auth/reset-password', { token: value, password }),
    updateProfile: async (data: { email: string; mobile?: string; nickname?: string; locale: string; timezone: string; timezoneMode: number; passportCountryCode: string; avatarObjectKey?: string; bio?: string; gender?: number; birthday?: string | null }) => {
      memberRequests.delete(app)
      const previousEmail = member.value?.email
      const updated = await request<MemberProfile>('/auth/profile', data, 'PUT')
      requests.clear()
      if (previousEmail && previousEmail.toLowerCase() !== updated.email.toLowerCase()) {
        clearSession()
        await navigateTo('/login/?redirect=/profile')
      } else member.value = updated
      return updated
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
