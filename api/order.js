import { Resend } from 'resend'
import { getBatch } from '../src/data/batches.js'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      order_id, name, email, whatsapp, city, address,
      shipping_zone, quantity, photos_link, notes,
      payment_method, batch_id, totals, proof
    } = req.body

    const batch      = getBatch(batch_id)
    const zoneLabel  = shipping_zone === 'bogota' ? 'Bogotá' : 'Resto del país'
    const methodLabel = payment_method === 'pay_now' ? 'Pagó ahora (comprobante adjunto)' : 'Cierra por WhatsApp'

    const formatCOP = (n) => new Intl.NumberFormat('es-CO', {
      style: 'currency', currency: 'COP', maximumFractionDigits: 0
    }).format(n)

    const emailHeader = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#0F0F0F;border-radius:12px;padding:28px 32px;margin-bottom:24px;">
          <div style="display:inline-block;background:#E63946;border-radius:6px;padding:4px 10px;margin-bottom:12px;">
            <span style="color:white;font-size:11px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;">
              ${payment_method === 'pay_now' ? 'Pedido con comprobante' : 'Nuevo pedido'}
            </span>
          </div>
          <div style="font-size:32px;font-weight:900;color:#FBF7EE;letter-spacing:-0.02em;">La Figurita</div>
          <div style="font-size:13px;color:rgba(251,247,238,0.5);margin-top:4px;">Álbumes coleccionables personalizados</div>
        </div>
    `

    const orderTable = `
      <h3 style="font-size:16px;margin-bottom:8px;">Pedido #${order_id}</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;width:140px;">Nombre</td><td style="padding:8px;border-bottom:1px solid #eee;">${name}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;">${email}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">WhatsApp</td><td style="padding:8px;border-bottom:1px solid #eee;">${whatsapp}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">Ciudad</td><td style="padding:8px;border-bottom:1px solid #eee;">${city}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">Dirección</td><td style="padding:8px;border-bottom:1px solid #eee;">${address}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">Batch</td><td style="padding:8px;border-bottom:1px solid #eee;">${batch?.label} · Fotos: ${batch?.deadline} · Entrega: ${batch?.delivery}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">Cantidad</td><td style="padding:8px;border-bottom:1px solid #eee;">${quantity} álbum(es)</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">Zona</td><td style="padding:8px;border-bottom:1px solid #eee;">${zoneLabel}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">Pago</td><td style="padding:8px;border-bottom:1px solid #eee;">${methodLabel}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">Fotos</td><td style="padding:8px;border-bottom:1px solid #eee;"><a href="${photos_link}">${photos_link}</a></td></tr>
        ${notes ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">Notas</td><td style="padding:8px;border-bottom:1px solid #eee;">${notes}</td></tr>` : ''}
      </table>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;width:140px;">Subtotal</td><td style="padding:8px;border-bottom:1px solid #eee;">${formatCOP(totals.subtotal)}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">Envío</td><td style="padding:8px;border-bottom:1px solid #eee;">${formatCOP(totals.shipping)}</td></tr>
        <tr style="background:#f9f9f9;"><td style="padding:12px 8px;font-weight:800;font-size:18px;">TOTAL</td><td style="padding:12px 8px;font-weight:800;font-size:18px;">${formatCOP(totals.total)}</td></tr>
      </table>
    `

    const emailFooter = `
      <div style="margin-top:40px;padding-top:24px;border-top:2px solid #F7EFE0;text-align:center;">
        <div style="font-size:18px;font-weight:900;color:#0F0F0F;margin-bottom:4px;">La Figurita</div>
        <div style="font-size:12px;color:#6B5F54;margin-bottom:16px;">Álbumes coleccionables personalizados · Bogotá, Colombia</div>
        <div style="margin-bottom:12px;">
          <a href="https://wa.me/573144329060" style="font-size:12px;color:#0F0F0F;font-weight:600;text-decoration:none;margin:0 8px;">WhatsApp</a>
          <span style="color:#D9D9D9;">·</span>
          <a href="https://lafigurita.com" style="font-size:12px;color:#0F0F0F;font-weight:600;text-decoration:none;margin:0 8px;">lafigurita.com</a>
        </div>
        <div style="font-size:11px;color:#6B5F54;">© ${new Date().getFullYear()} La Figurita</div>
      </div>
    `

    // Adjunto del comprobante (solo si pagó ahora)
    const attachments = proof ? [{
      filename: proof.name,
      content: proof.data,
      type: proof.type
    }] : []

    // Correo de notificación para ti
    await resend.emails.send({
      from: 'La Figurita <hola@lafigurita.com>',
      to: [process.env.NOTIFY_EMAIL],
      subject: `${payment_method === 'pay_now' ? '💳' : '📦'} Pedido ${order_id} — ${name}`,
      attachments,
      html: emailHeader + orderTable + emailFooter + '</div>'
    })

    // Correo de confirmación al cliente
    const clientMessage = payment_method === 'pay_now'
      ? `Recibimos tu comprobante de pago. Lo verificamos y ponemos tu álbum en producción. Te escribimos por WhatsApp al ${whatsapp} para confirmarte.`
      : `Registramos tu pedido. Te escribiremos por WhatsApp al ${whatsapp} en menos de 24 horas para coordinar el pago.`

    await resend.emails.send({
      from: 'La Figurita <hola@lafigurita.com>',
      to: [email],
      subject: `¡Pedido registrado! ${order_id} — La Figurita`,
      html: `
        ${emailHeader}
        <p style="font-size:16px;line-height:1.6;margin-bottom:16px;">
          Hola ${name.split(' ')[0]}, recibimos tu pedido del <strong>Álbum La Figurita — Edición DAD</strong>.
        </p>
        <p style="font-size:16px;line-height:1.6;margin-bottom:24px;">${clientMessage}</p>
        <div style="background:#FBF7EE;border-radius:8px;padding:20px;margin-bottom:24px;">
          <p style="font-weight:800;margin-bottom:12px;">Número de pedido: ${order_id}</p>
          <p><strong>Batch:</strong> ${batch?.label}</p>
          <p><strong>Límite envío de fotos:</strong> ${batch?.deadline}</p>
          <p><strong>Entrega estimada:</strong> ${batch?.delivery}</p>
          <p><strong>Cantidad:</strong> ${quantity} álbum(es)</p>
          <p style="font-size:20px;font-weight:800;margin-top:12px;padding-top:12px;border-top:2px solid #0F0F0F;">
            Total: ${formatCOP(totals.total)}
          </p>
        </div>
        ${emailFooter}
      </div>`
    })

    return res.status(200).json({ success: true, order_id })

  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ error: 'Error al procesar el pedido.' })
  }
}
