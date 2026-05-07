import { sql } from './db.js'

export default async function handler(req, res) {
  try {
    const batches = await sql`
      SELECT * FROM batches
      WHERE active = TRUE
      ORDER BY sort_order ASC
    `
    return res.status(200).json({ batches })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error al obtener batches' })
  }
}
