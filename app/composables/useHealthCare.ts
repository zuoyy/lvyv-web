import { useMemberAuth } from '~/composables/useMemberAuth'

export interface HealthServiceSummary {
  serviceCode: string
  category: string
  tier: string
  title: string
  summary?: string
  cityCode: string
  cityName: string
  durationLabel: string
  supportLanguages: string
  startingPrice: number
  originalPrice?: number | null
  imageObjectKey?: string
  imageUrl?: string
  currency: string
  bookingMode: string
  status?: string
  sortOrder?: number
}

export interface HealthDictionaryOption { code: string; label: string; sort: number; status: number }
export interface HealthOptions { cities: HealthDictionaryOption[]; tiers: HealthDictionaryOption[] }

export interface HealthServiceDetail {
  service: HealthServiceSummary
  inclusions: { phase: string; title: string; description?: string }[]
  providers: { facilityType: string; cityName: string; address?: string; supportedLanguages: string; providerName?: string }[]
}

export interface HealthAppointment {
  appointmentNo: string
  serviceCode?: string
  serviceTitle?: string
  cityName?: string
  durationLabel?: string
  status: string
  preferredDate: string
  preferredTimeWindow: string
  confirmedStartUtc?: string
  confirmedEndUtc?: string
  destinationTimezone: string
  providerName?: string
  travelerName: string
  travelerEmail: string
  travelerMobile?: string
  preferredLanguage: string
  serviceAmount: number
  coordinatorFee: number
  totalAmount: number
  currency: string
  cancellationPolicy?: string
  commerceOrderNo?: string
  visitInformation?: HealthServiceDetail['inclusions']
}

export const useHealthCare = () => {
  const auth = useMemberAuth()
  return {
    getOptions: () => auth.publicRequest<HealthOptions>('/health/options'),
    listServices: (params: Record<string, string> = {}) => {
      const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value)).toString()
      return auth.publicRequest<HealthServiceSummary[]>(`/health/services${query ? `?${query}` : ''}`)
    },
    getService: (code: string) => auth.publicRequest<HealthServiceDetail>(`/health/services/${encodeURIComponent(code)}`),
    createAppointment: (body: Record<string, unknown>) => auth.request<HealthAppointment>('/health/appointments', body),
    previewAppointment: (body: Record<string, unknown>) => auth.request('/health/appointments/preview', body),
    getAppointment: (appointmentNo: string) => auth.request<HealthAppointment>(`/health/appointments/${encodeURIComponent(appointmentNo)}`, undefined, 'GET'),
    confirmReview: (appointmentNo: string) => auth.request<HealthAppointment>(`/health/appointments/${encodeURIComponent(appointmentNo)}/review/confirm`),
    listAppointments: (tab: string, page = 1) => auth.request<HealthAppointment[]>(`/health/appointments/page?tab=${encodeURIComponent(tab)}&page=${page}&size=20`, undefined, 'GET'),
    cancelAppointment: (appointmentNo: string) => auth.request<HealthAppointment>(`/health/appointments/${encodeURIComponent(appointmentNo)}/cancel`),
    rescheduleAppointment: (appointmentNo: string) => auth.request<HealthAppointment>(`/health/appointments/${encodeURIComponent(appointmentNo)}/reschedule`),
    createConciergeRequest: (body: Record<string, unknown>) => auth.token.value
      ? auth.request<void>('/health/concierge-requests', body)
      : auth.publicAction<void>('/health/concierge-requests', body),
  }
}
