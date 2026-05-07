import { sql } from '../db.js'

export default async function handler(req, res) {
  if (req.headers['x-admin-token'] !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'No autorizado' })
  }

  try {
    const orders = await sql`
      SELECT * FROM orders ORDER BY created_at DESC
    `

    const stats = await sql`
      SELECT
        COUNT(*)                                          AS total_orders,
        COALESCE(SUM(total), 0)                          AS total_revenue,
        COUNT(*) FILTER (WHERE channel = 'web')          AS web_orders,
        COUNT(*) FILTER (WHERE channel = 'whatsapp')     AS wa_orders,
        COUNT(*) FILTER (WHERE status = 'pending')       AS pending,
        COUNT(*) FILTER (WHERE status = 'paid_pending_review') AS paid_pending,
        COUNT(*) FILTER (WHERE status = 'confirmed')     AS confirmed,
        COUNT(*) FILTER (WHERE status = 'production')    AS production,
        COUNT(*) FILTER (WHERE status = 'shipped')       AS shipped,
        COUNT(*) FILTER (WHERE status = 'delivered')     AS delivered
      FROM orders
    `

    return res.status(200).json({ orders, stats: stats[0] })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error al obtener pedidos' })
  }
}
