import { Resend } from 'resend';
import { getBatch } from '../src/data/batches.js';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      name,
      email,
      whatsapp,
      city,
      address,
      shipping_zone,
      quantity,
      photos_link,
      notes,
      payment_method,
      batch_id,
      totals,
    } = req.body;

    const batch = getBatch(batch_id);
    const zoneLabel = shipping_zone === 'bogota' ? 'Bogotá' : 'Resto del país';
    const methodLabel =
      payment_method === 'pay_now' ? 'Pagar ahora' : 'Cerrar por WhatsApp';

    const formatCOP = (n) =>
      new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
      }).format(n);

    // --- Correo para ti ---
    await resend.emails.send({
      from: 'La Figurita <hola@lafigurita.com>',
      to: [process.env.NOTIFY_EMAIL],
      subject: `📦 Nuevo pedido — ${name} · ${batch?.label ?? batch_id}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">

          <!-- Header de marca -->
          <div style="background:#0F0F0F;border-radius:12px;padding:28px 32px;margin-bottom:24px;">
            <div style="display:inline-block;background:#E63946;border-radius:6px;padding:4px 10px;margin-bottom:12px;">
              <span style="color:white;font-size:11px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;">Nuevo pedido</span>
            </div>
            <div style="font-size:32px;font-weight:900;color:#FBF7EE;letter-spacing:-0.02em;line-height:1;">
              La Figurita
            </div>
            <div style="font-size:13px;color:rgba(251,247,238,0.5);margin-top:6px;">
              Álbumes coleccionables personalizados
            </div>
          </div>

          <h3>Datos del cliente</h3>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;width:140px;">Nombre</td><td style="padding:8px;border-bottom:1px solid #eee;">${name}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;">${email}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">WhatsApp</td><td style="padding:8px;border-bottom:1px solid #eee;">${whatsapp}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">Ciudad</td><td style="padding:8px;border-bottom:1px solid #eee;">${city}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">Dirección</td><td style="padding:8px;border-bottom:1px solid #eee;">${address}</td></tr>
          </table>

          <h3>Pedido</h3>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;width:140px;">Batch</td>
                <td style="padding:8px;border-bottom:1px solid #eee;">
                  <strong>${
                    batch?.label ?? batch_id
                  }</strong> · Límite fotos: ${batch?.deadline} · Entrega: ${
                    batch?.delivery
                  }
                </td>
            </tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">Cantidad</td><td style="padding:8px;border-bottom:1px solid #eee;">${quantity} álbum(es)</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">Zona</td><td style="padding:8px;border-bottom:1px solid #eee;">${zoneLabel}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">Método</td><td style="padding:8px;border-bottom:1px solid #eee;">${methodLabel}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">Fotos</td>
                <td style="padding:8px;border-bottom:1px solid #eee;">
                  <a href="${photos_link}">${photos_link}</a>
                </td>
            </tr>
            ${
              notes
                ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">Notas</td><td style="padding:8px;border-bottom:1px solid #eee;">${notes}</td></tr>`
                : ''
            }
          </table>

          <h3>Total</h3>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;width:140px;">Subtotal</td><td style="padding:8px;border-bottom:1px solid #eee;">${formatCOP(
              totals.subtotal
            )}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">Envío</td><td style="padding:8px;border-bottom:1px solid #eee;">${formatCOP(
              totals.shipping
            )}</td></tr>
            ${
              totals.discount > 0
                ? `
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;color:#16A34A;">Descuento</td>
                <td style="padding:8px;border-bottom:1px solid #eee;color:#16A34A;">−${formatCOP(
                  totals.discount
                )}</td>
            </tr>`
                : ''
            }
            <tr style="background:#f9f9f9;">
              <td style="padding:12px 8px;font-weight:800;font-size:18px;">TOTAL</td>
              <td style="padding:12px 8px;font-weight:800;font-size:18px;">${formatCOP(
                totals.total
              )}</td>
            </tr>
          </table>

          <p style="margin-top:24px;padding:16px;background:#FBF7EE;border-radius:8px;font-size:13px;color:#6B5F54;">
            Pedido recibido el ${new Date().toLocaleString('es-CO', {
              timeZone: 'America/Bogota',
            })}
          </p>
        </div>
      `,
    });

    // --- Correo para el cliente ---
    const clientMessage =
      payment_method === 'pay_now'
        ? 'En breve te enviamos los datos de pago por este correo y por WhatsApp. Una vez confirmado el pago, iniciamos producción.'
        : 'Te escribiremos por WhatsApp en menos de 24 horas para confirmar los detalles y coordinar el pago.';

    await resend.emails.send({
      from: 'La Figurita <hola@lafigurita.com>',
      to: [email],
      subject: `¡Recibimos tu pedido! — La Figurita · ${batch?.label ?? ''}`,
      html: `
  <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">

    <!-- Header de marca -->
    <div style="background:#0F0F0F;border-radius:12px;padding:28px 32px;margin-bottom:24px;">
      <div style="font-size:32px;font-weight:900;color:#FBF7EE;letter-spacing:-0.02em;line-height:1;">
        La Figurita
      </div>
      <div style="font-size:13px;color:rgba(251,247,238,0.5);margin-top:6px;">
        Álbumes coleccionables personalizados
      </div>
      <div style="margin-top:20px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.1);">
        <span style="font-size:22px;font-weight:900;color:#FACC15;">
          ¡Gracias, ${name.split(' ')[0]}!
        </span>
      </div>
    </div>

          <p style="font-size:16px;line-height:1.6;">
            Recibimos tu pedido del <strong>Álbum La Figurita — Edición DAD</strong>.
          </p>

          <p style="font-size:16px;line-height:1.6;">${clientMessage}</p>

          <div style="background:#FBF7EE;border-radius:8px;padding:20px;margin:24px 0;">
            <h3 style="margin-top:0;">Resumen de tu pedido</h3>
            <p><strong>Batch:</strong> ${batch?.label ?? batch_id}</p>
            <p><strong>Límite envío de fotos:</strong> ${batch?.deadline}</p>
            <p><strong>Entrega estimada:</strong> ${batch?.delivery}</p>
            <p><strong>Cantidad:</strong> ${quantity} álbum(es)</p>
            <p><strong>Zona de envío:</strong> ${zoneLabel}</p>
            ${
              totals.discount > 0
                ? `<p><strong>Descuento aplicado:</strong> −${formatCOP(
                    totals.discount
                  )}</p>`
                : ''
            }
            <p style="font-size:20px;font-weight:800;margin-top:12px;border-top:2px solid #0F0F0F;padding-top:12px;">
              Total: ${formatCOP(totals.total)}
            </p>
          </div>

          <p style="font-size:14px;color:#6B5F54;">
            ¿Tienes dudas? Escríbenos al ${
              process.env.WHATSAPP_NUMBER || 'nuestro WhatsApp'
            }.
          </p>

          <p style="font-size:13px;color:#6B5F54;border-top:1px solid #eee;padding-top:16px;margin-top:24px;">
            La Figurita · Álbumes coleccionables personalizados · Bogotá, Colombia
          </p>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Error al procesar el pedido.' });
  }
}
