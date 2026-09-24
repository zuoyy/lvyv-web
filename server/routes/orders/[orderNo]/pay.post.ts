// Embedded 3DS posts back to the exact payment URL. Discard browser result data:
// a 303 GET restores the member session and the page polls the original payment.
export default defineEventHandler((event) => {
  const orderNo = getRouterParam(event, 'orderNo') || ''
  if (!/^ORD_[A-Za-z0-9_-]+$/.test(orderNo)) throw createError({ statusCode: 400 })
  setHeader(event, 'Cache-Control', 'no-store, max-age=0')
  setHeader(event, 'X-Robots-Tag', 'noindex, nofollow, noarchive')
  return sendRedirect(event, `/orders/${encodeURIComponent(orderNo)}/pay`, 303)
})
