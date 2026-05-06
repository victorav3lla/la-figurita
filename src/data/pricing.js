import { getBatch } from './batches.js'

export const SHIPPING = {
  bogota: 12000,
  resto:  18000,
  chile:  0  // ajusta al valor que pusiste
}

export const SHIPPING_OPTIONS = [
  { id: 'bogota', label: 'Bogotá',         cost: SHIPPING.bogota, country: 'CO' },
  { id: 'resto',  label: 'Resto del país', cost: SHIPPING.resto,  country: 'CO' },
  { id: 'chile',  label: 'Chile',          cost: SHIPPING.chile,  country: 'CL' }
]

export function shippingForCountry(country) {
  return SHIPPING_OPTIONS.filter(o => o.country === country)
}

export function formatPrice(amount, currency = 'COP') {
  const locale = currency === 'CLP' ? 'es-CL' : 'es-CO'
  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(amount)
  return `${formatted} ${currency}`
}

// Mantén formatCOP para compatibilidad con el resto del código
export function formatCOP(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(amount)
}

export function calculateTotal({ quantity, shippingZone, batchId }) {
  const batch = getBatch(batchId)
  if (!batch) return null

  const subtotal = batch.price * quantity
  const shipping = SHIPPING[shippingZone] ?? 0
  const total    = subtotal + shipping

  return { subtotal, shipping, discount: 0, total, pricePerUnit: batch.price, currency: batch.currency || 'COP' }
}
