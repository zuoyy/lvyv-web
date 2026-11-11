// Date-only travel calculations use UTC arithmetic on a China calendar date, independent of the browser zone.
export function chinaToday(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(now)
}
export const addTravelDays = (date: string, days: number) => {
  const value = new Date(`${date}T12:00:00Z`)
  value.setUTCDate(value.getUTCDate() + days)
  return value.toISOString().slice(0, 10)
}
export const earliestTravelDate = (days: number, now = new Date()) => addTravelDays(chinaToday(now), Math.max(1, days))
