import { getBatch } from './batches.js'

export const SHIPPING = {
  bogota: 12000,
  resto: 18000
}

export const SHIPPING_OPTIONS = [
  { id: 'bogota', label: 'Bogotá',         cost: SHIPPING.bogota },
  { id: 'resto',  label: 'Resto del país', cost: SHIPPING.resto  }
]

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
  const baseTotal = subtotal + shipping
  const discount = batch.discount
    ? Math.round(baseTotal * (batch.discountPercent / 100))
    : 0
  const total = baseTotal - discount

  return { subtotal, shipping, discount, total, pricePerUnit: batch.price }
}
