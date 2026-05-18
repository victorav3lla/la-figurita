import { sql } from '../db.js'

export default async function handler(req, res) {
  if (req.headers['x-admin-token'] !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'No autorizado' })
  }
  if (req.method !== 'POST') return res.status(405).end()

  const { order_id, status, photos_link, notes } = req.body

  try {
    if (status !== undefined) {
      const validStatuses = [
        'pending', 'paid_pending_review', 'confirmed',
        'production', 'shipped', 'delivered', 'cancelled'
      ]
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Estado inválido' })
      }
      await sql`UPDATE orders SET status = ${status}, status_changed_at = NOW() WHERE order_id = ${order_id}`
    }

    if (photos_link !== undefined) {
      await sql`UPDATE orders SET photos_link = ${photos_link} WHERE order_id = ${order_id}`
    }

    if (notes !== undefined) {
      await sql`UPDATE orders SET notes = ${notes} WHERE order_id = ${order_id}`
    }

    // Devolver el pedido actualizado
    const updated = await sql`SELECT * FROM orders WHERE order_id = ${order_id}`
    return res.status(200).json({ success: true, order: updated[0] })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error al actualizar' })
  }
}
