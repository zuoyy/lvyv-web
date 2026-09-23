export function cardPaymentFailureMessage(code?: string | number, message?: string): string | undefined {
  const isNotAccepted = [code, message].some(value => /^30001(?:\s*[:：]|\s|$)/.test(String(value ?? '').trim()))
  if (isNotAccepted) {
    return 'This card or payment method is not accepted. We currently support Visa, Mastercard, Maestro, Discover and Diners Club. Please try another supported card or contact us for help.'
  }
  return message
}
