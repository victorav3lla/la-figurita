export const PRICING = {
  albumUnit: 50000,           // Precio unitario del álbum
  shipping: {
    bogota: 12000,
    resto: 18000
  },
  discountPercent: 10         // Descuento por pagar ahora (en %)
}

export const SHIPPING_OPTIONS = [
  { id: 'bogota', label: 'Bogotá',         cost: PRICING.shipping.bogota },
  { id: 'resto',  label: 'Resto del país', cost: PRICING.shipping.resto  }
]

// Helpers — el resto del sitio usa estas funciones, no los números directos.

export function formatCOP(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(amount)
}

export function calculateTotal({ quantity, shippingZone, payNow }) {
  const subtotal = PRICING.albumUnit * quantity
  const shipping = PRICING.shipping[shippingZone] ?? 0
  const baseTotal = subtotal + shipping
  const discount = payNow ? Math.round(baseTotal * (PRICING.discountPercent / 100)) : 0
  const total = baseTotal - discount

  return { subtotal, shipping, discount, total }
}
