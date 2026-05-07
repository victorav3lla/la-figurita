import { sql } from '../db.js'

export default async function handler(req, res) {
  if (req.headers['x-admin-token'] !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'No autorizado' })
  }
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const {
      order_id, name, email, whatsapp, city, address,
      batch_id, quantity, photos_link, notes
    } = req.body

    if (!order_id) return res.status(400).json({ error: 'order_id requerido' })

    await sql`
      UPDATE orders SET
        name        = ${name},
        email       = ${email || ''},
        whatsapp    = ${whatsapp},
        city        = ${city},
        address     = ${address},
        batch_id    = ${batch_id},
        quantity    = ${parseInt(quantity) || 1},
        photos_link = ${photos_link || null},
        notes       = ${notes || null}
      WHERE order_id = ${order_id}
    `

    const updated = await sql`SELECT * FROM orders WHERE order_id = ${order_id}`
    return res.status(200).json({ success: true, order: updated[0] })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message })
  }
}
