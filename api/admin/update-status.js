import { sql } from '../db.js'

export default async function handler(req, res) {
  if (req.headers['x-admin-token'] !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'No autorizado' })
  }

  if (req.method !== 'POST') return res.status(405).end()

  const { order_id, status } = req.body

  const validStatuses = [
    'pending', 'paid_pending_review', 'confirmed',
    'production', 'shipped', 'delivered', 'cancelled'
  ]

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Estado inválido' })
  }

  try {
    await sql`
      UPDATE orders SET status = ${status} WHERE order_id = ${order_id}
    `
    return res.status(200).json({ success: true })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error al actualizar estado' })
  }
}
