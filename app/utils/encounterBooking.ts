const shanghaiDate = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' })

export const todayInChina = () => shanghaiDate.format(new Date())

export function isTravelDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value < todayInChina()) return false
  const date = new Date(value + 'T00:00:00Z')
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
}

// The same browser tab keeps the date through sign-in without putting it in the URL.
export function rememberTravelDate(product: string, sku: string, date?: string) {
  try {
    const key = 'encounter-travel-date:' + product.toUpperCase() + ':' + sku.toUpperCase()
    if (date !== undefined) {
      if (date) sessionStorage.setItem(key, date)
      else sessionStorage.removeItem(key)
    }
    return sessionStorage.getItem(key) || ''
  } catch {
    return ''
  }
}

// Keep the selected exam options in the same tab through the sign-in redirect.
export function rememberHealthCheckupNote(sku: string, note?: string) {
  try {
    const key = 'health-checkup-exams:' + sku.toUpperCase()
    if (note !== undefined) {
      if (note) sessionStorage.setItem(key, note)
      else sessionStorage.removeItem(key)
    }
    return sessionStorage.getItem(key) || ''
  } catch {
    return ''
  }
}

// Keep the cart available when the traveler returns from sign-in or checkout to adjust it.
export function rememberExperienceAddOns(product: string, keys?: string[]): string[] {
  try {
    const key = 'encounter-add-ons:' + product.toUpperCase()
    if (keys !== undefined) {
      if (keys.length) sessionStorage.setItem(key, JSON.stringify(keys))
      else sessionStorage.removeItem(key)
    }
    const value: unknown = JSON.parse(sessionStorage.getItem(key) || '[]')
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string').slice(0, 2) : []
  } catch {
    return []
  }
}

// Match the route price typography while retaining cents when the catalog price has them.
export const encounterPrice = (price: number) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
}).format(price)
