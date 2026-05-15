import { put } from '@vercel/blob'
import { sql } from '../db.js'

export const config = { api: { bodyParser: { sizeLimit: '5mb' } } }

export default async function handler(req, res) {
  if (req.headers['x-admin-token'] !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'No autorizado' })
  }
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const { order_id, filename, contentType, data } = req.body

    // Subir a Vercel Blob
    const buffer = Buffer.from(data, 'base64')
    const blob   = await put(`proofs/${order_id}/${filename}`, buffer, {
      access: 'public',
      contentType
    })

    // Guardar URL en la DB
    await sql`
      UPDATE orders
      SET proof_url = ${blob.url}, has_proof = true
      WHERE order_id = ${order_id}
    `

    const updated = await sql`SELECT * FROM orders WHERE order_id = ${order_id}`
    return res.status(200).json({ success: true, proof_url: blob.url, order: updated[0] })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error al subir el comprobante' })
  }
}
