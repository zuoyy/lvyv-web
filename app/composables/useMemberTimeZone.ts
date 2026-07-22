const FALLBACK_TIME_ZONE = 'UTC'

export const detectMemberTimeZone = () => {
  if (!import.meta.client) return FALLBACK_TIME_ZONE
  return Intl.DateTimeFormat().resolvedOptions().timeZone || FALLBACK_TIME_ZONE
}

export const getMemberTimeZoneOptions = () => {
  const supported = (Intl as unknown as { supportedValuesOf?: (key: string) => string[] }).supportedValuesOf
  const values = supported ? supported('timeZone') : [FALLBACK_TIME_ZONE]
  return [...new Set([detectMemberTimeZone(), FALLBACK_TIME_ZONE, ...values])].map(value => ({ value, label: value }))
}

export const formatMemberDateTime = (value: string | Date | number | null | undefined, timeZone?: string) => {
  if (!value) return '-'
  try {
    return new Intl.DateTimeFormat(undefined, {
      timeZone: timeZone || detectMemberTimeZone(),
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    }).format(new Date(value))
  } catch {
    return String(value)
  }
}
