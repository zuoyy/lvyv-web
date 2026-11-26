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

// Match the route price typography while retaining cents when the catalog price has them.
export const encounterPrice = (price: number) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
}).format(price)
