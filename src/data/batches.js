export let BATCHES = []

const BATCHES_FALLBACK = [
  {
    id: 'batch1',
    label: 'Batch 1 · Precio lanzamiento',
    deadline: '12 de mayo',
    delivery: '22 de mayo',
    price: 99900,
    currency: 'COP',
    country: 'CO',
    discount: true,
    discountLabel: 'Lanzamiento',
    spots: 50,
    spotsLeft: 46,
    active: true
  },
  {
    id: 'batch2',
    label: 'Batch 2',
    deadline: '22 de mayo',
    delivery: '5 de junio',
    price: 129900,
    currency: 'COP',
    country: 'CO',
    discount: false,
    spots: 50,
    spotsLeft: 50,
    active: true
  },
  {
    id: 'batch3',
    label: 'Batch 3',
    deadline: '5 de junio',
    delivery: '19 de junio',
    price: 129900,
    currency: 'COP',
    country: 'CO',
    discount: false,
    spots: 50,
    spotsLeft: 50,
    active: true
  },
  {
    id: 'batch-chile-launch',
    label: 'Batch Chile · Precio lanzamiento',
    deadline: '20 de mayo',
    delivery: '13 de junio',
    price: 25000,
    currency: 'CLP',
    country: 'CL',
    discount: true,
    discountLabel: 'Lanzamiento',
    spots: 20,
    spotsLeft: 19,
    active: true
  },
  {
    id: 'batch-chile',
    label: 'Batch Chile',
    deadline: '5 de junio',
    delivery: '13 de junio',
    price: 30000,
    currency: 'CLP',
    country: 'CL',
    discount: false,
    spots: 20,
    spotsLeft: 20,
    active: true
  }
]

export function getBatch(id) {
  return BATCHES.find(b => b.id === id)
}

export function activeBatches() {
  return BATCHES.filter(b => b.active && b.spotsLeft > 0)
}

export async function loadBatches() {
  try {
    const res  = await fetch('/api/batches')
    const data = await res.json()
    BATCHES = data.batches.map(b => ({
      id:            b.id,
      label:         b.label,
      deadline:      b.deadline,
      delivery:      b.delivery,
      price:         b.price,
      currency:      b.currency,
      country:       b.country,
      discount:      b.discount,
      discountLabel: b.discount_label,
      spots:         b.spots,
      spotsLeft:     b.spots_left,
      active:        b.active
    }))
    return BATCHES
  } catch {
    BATCHES = BATCHES_FALLBACK
    return BATCHES
  }
}
