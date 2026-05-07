import { sql } from '../db.js'

export default async function handler(req, res) {
  if (req.headers['x-admin-token'] !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'No autorizado' })
  }
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const { order_id, ...fields } = req.body
    if (!order_id) return res.status(400).json({ error: 'order_id requerido' })

    const allowed = [
      'name', 'email', 'whatsapp', 'city', 'address',
      'photos_link', 'notes', 'status', 'batch_id',
      'shipping_zone', 'quantity'
    ]

    for (const [key, value] of Object.entries(fields)) {
      if (!allowed.includes(key)) continue
      await sql`
        UPDATE orders SET ${sql(key)} = ${value} WHERE order_id = ${order_id}
      `
    }

    const updated = await sql`SELECT * FROM orders WHERE order_id = ${order_id}`
    return res.status(200).json({ success: true, order: updated[0] })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error al actualizar' })
  }
}
