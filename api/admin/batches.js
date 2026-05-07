import { sql } from '../db.js'

export default async function handler(req, res) {
  if (req.headers['x-admin-token'] !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'No autorizado' })
  }

  if (req.method === 'GET') {
    const batches = await sql`SELECT * FROM batches ORDER BY sort_order ASC`
    return res.status(200).json({ batches })
  }

  if (req.method === 'POST') {
    const { id, spots_left, active, price } = req.body
    await sql`
      UPDATE batches
      SET
        spots_left = ${parseInt(spots_left)},
        active     = ${active},
        price      = ${parseInt(price)}
      WHERE id = ${id}
    `
    const updated = await sql`SELECT * FROM batches WHERE id = ${id}`
    return res.status(200).json({ success: true, batch: updated[0] })
  }

  return res.status(405).end()
}
