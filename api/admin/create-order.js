import { sql } from '../db.js'

export default async function handler(req, res) {
  if (req.headers['x-admin-token'] !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'No autorizado' })
  }

  if (req.method !== 'POST') return res.status(405).end()

  try {
    const {
      order_id, name, email, whatsapp, city, address,
      batch_id, shipping_zone, quantity, photos_link, notes,
      subtotal, shipping, total, status
    } = req.body

    await sql`
      INSERT INTO orders (
        order_id, channel, status,
        name, email, whatsapp, city, address,
        batch_id, shipping_zone, quantity, photos_link, notes,
        subtotal, shipping, total, payment_method
      ) VALUES (
        ${order_id}, 'whatsapp', ${status || 'pending'},
        ${name}, ${email || ''}, ${whatsapp}, ${city}, ${address},
        ${batch_id}, ${shipping_zone}, ${parseInt(quantity)},
        ${photos_link || null}, ${notes || null},
        ${parseInt(subtotal)}, ${parseInt(shipping)}, ${parseInt(total)}, 'whatsapp'
      )
    `
    return res.status(200).json({ success: true, order_id })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error al crear pedido' })
  }
}
