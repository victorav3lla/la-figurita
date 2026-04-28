export const BATCHES = [
  {
    id: 'batch1',
    number: 1,
    label: 'Batch 1',
    deadline: '12 de mayo',
    delivery: '22 de mayo',
    price: 45000,
    discount: true,
    discountPercent: 10,
    spots: 50,
    spotsLeft: 50,    // actualiza esto manualmente cuando lleguen pedidos
    active: true
  },
  {
    id: 'batch2',
    number: 2,
    label: 'Batch 2',
    deadline: '22 de mayo',
    delivery: '5 de junio',
    price: 50000,
    discount: false,
    discountPercent: 0,
    spots: 50,
    spotsLeft: 50,
    active: true
  },
  {
    id: 'batch3',
    number: 3,
    label: 'Batch 3',
    deadline: '5 de junio',
    delivery: '19 de junio',
    price: 50000,
    discount: false,
    discountPercent: 0,
    spots: 50,
    spotsLeft: 50,
    active: true
  }
]

export function getBatch(id) {
  return BATCHES.find(b => b.id === id)
}

export function activeBatches() {
  return BATCHES.filter(b => b.active && b.spotsLeft > 0)
}
