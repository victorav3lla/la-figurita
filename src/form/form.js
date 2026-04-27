import { SHIPPING_OPTIONS, PRICING } from '../data/pricing.js'

export function orderForm() {
  return `
    <section id="pedir" class="relative py-20 md:py-28 px-6 bg-cream">
      <div class="max-w-3xl mx-auto">

        <!-- Encabezado -->
        <div class="mb-12 md:mb-14">
          <p class="text-xs uppercase tracking-[0.2em] font-semibold text-ink-soft mb-4">
            Pedir mi álbum
          </p>
          <h2 class="font-display font-black text-ink leading-[0.95] tracking-tight text-5xl md:text-7xl mb-6">
            Pidamos<span class="text-tomato">.</span>
          </h2>
          <p class="text-lg text-ink-soft max-w-xl leading-relaxed">
            Llena los datos, mira el total, y elige cómo prefieres cerrar tu pedido.
          </p>
        </div>

        <!-- Form -->
        <form id="order-form" class="form-container" novalidate>

          <!-- 01: Datos personales -->
          <fieldset class="form-section">
            <legend class="form-legend">
              <span class="form-legend-num">01</span>
              Tus datos
            </legend>

            <div class="form-grid">
              <div class="form-field form-field-full">
                <label for="name">Nombre completo <span class="form-required">*</span></label>
                <input type="text" id="name" name="name" autocomplete="name" required minlength="3" />
                <span class="form-error" data-error-for="name"></span>
              </div>

              <div class="form-field">
                <label for="email">Correo electrónico <span class="form-required">*</span></label>
                <input type="email" id="email" name="email" autocomplete="email" required />
                <span class="form-error" data-error-for="email"></span>
              </div>

              <div class="form-field">
                <label for="whatsapp">WhatsApp <span class="form-required">*</span></label>
                <input type="tel" id="whatsapp" name="whatsapp" autocomplete="tel" required placeholder="+57 300 000 0000" />
                <span class="form-error" data-error-for="whatsapp"></span>
              </div>
            </div>
          </fieldset>

          <!-- 02: Envío -->
          <fieldset class="form-section">
            <legend class="form-legend">
              <span class="form-legend-num">02</span>
              Dirección de envío
            </legend>

            <div class="form-grid">
              <div class="form-field">
                <label for="shipping_zone">Zona <span class="form-required">*</span></label>
                <select id="shipping_zone" name="shipping_zone" required>
                  <option value="">Selecciona...</option>
                  ${SHIPPING_OPTIONS.map(opt => `
                    <option value="${opt.id}">${opt.label}</option>
                  `).join('')}
                </select>
                <span class="form-error" data-error-for="shipping_zone"></span>
              </div>

              <div class="form-field">
                <label for="city">Ciudad <span class="form-required">*</span></label>
                <input type="text" id="city" name="city" autocomplete="address-level2" required />
                <span class="form-error" data-error-for="city"></span>
              </div>

              <div class="form-field form-field-full">
                <label for="address">Dirección completa <span class="form-required">*</span></label>
                <textarea id="address" name="address" rows="2" autocomplete="street-address" required placeholder="Calle, número, apto, barrio, referencias"></textarea>
                <span class="form-error" data-error-for="address"></span>
              </div>
            </div>
          </fieldset>

          <!-- 03: Tu álbum -->
          <fieldset class="form-section">
            <legend class="form-legend">
              <span class="form-legend-num">03</span>
              Tu álbum
            </legend>

            <div class="form-grid">
              <div class="form-field">
                <label for="dedication">Dedicatoria de portada <span class="form-required">*</span></label>
                <input type="text" id="dedication" name="dedication" required maxlength="15" placeholder="DAD, MAMÁ, ABU, TOMÁS..." />
                <span class="form-help">Aparece en grande en la portada. Máx. 15 caracteres.</span>
                <span class="form-error" data-error-for="dedication"></span>
              </div>

              <div class="form-field">
                <label for="quantity">Cantidad <span class="form-required">*</span></label>
                <input type="number" id="quantity" name="quantity" required min="1" max="10" value="1" />
                <span class="form-error" data-error-for="quantity"></span>
              </div>

              <div class="form-field form-field-full">
                <label for="photos_link">Link de las fotos <span class="form-required">*</span></label>
                <input type="url" id="photos_link" name="photos_link" required placeholder="https://drive.google.com/... o https://we.tl/..." />
                <span class="form-help">Sube las 40 fotos a Google Drive o WeTransfer y pega el link aquí. Asegúrate que sea de acceso abierto.</span>
                <span class="form-error" data-error-for="photos_link"></span>
              </div>

              <div class="form-field form-field-full">
                <label for="notes">Notas (opcional)</label>
                <textarea id="notes" name="notes" rows="3" placeholder="¿Algo que debamos saber? Fecha de entrega especial, observaciones..."></textarea>
              </div>
            </div>
          </fieldset>

          <!-- 04: Resumen y opciones de pago -->
          <fieldset class="form-section form-section-summary">
            <legend class="form-legend">
              <span class="form-legend-num">04</span>
              Tu pedido
            </legend>

            <!-- Resumen de precios (se actualiza dinámicamente) -->
            <div id="price-summary" class="price-summary">
              <div class="price-row">
                <span class="price-label">Álbumes <span id="summary-quantity">(1)</span></span>
                <span class="price-value" id="summary-subtotal">—</span>
              </div>
              <div class="price-row">
                <span class="price-label">Envío <span id="summary-zone" class="price-label-sub"></span></span>
                <span class="price-value" id="summary-shipping">—</span>
              </div>
              <div class="price-row price-row-discount" id="summary-discount-row" hidden>
                <span class="price-label">Descuento (${PRICING.discountPercent}%)</span>
                <span class="price-value" id="summary-discount">—</span>
              </div>
              <div class="price-row price-row-total">
                <span class="price-label">Total</span>
                <span class="price-value" id="summary-total">—</span>
              </div>
              <p id="price-summary-empty" class="price-summary-empty">
                Completa cantidad y zona para ver el total.
              </p>
            </div>

            <!-- Opciones de pago -->
            <div class="payment-options">
              <p class="payment-options-title">¿Cómo prefieres cerrar tu pedido?</p>

              <button type="submit" name="payment_method" value="pay_now" class="payment-option payment-option-primary" disabled>
                <div class="payment-option-content">
                  <span class="payment-option-badge">−${PRICING.discountPercent}%</span>
                  <span class="payment-option-title">Pagar ahora</span>
                  <span class="payment-option-desc">Aplicamos el descuento. Te enviamos los datos de pago al confirmar.</span>
                </div>
                <span class="payment-option-arrow">→</span>
              </button>

              <button type="submit" name="payment_method" value="whatsapp" class="payment-option" disabled>
                <div class="payment-option-content">
                  <span class="payment-option-title">Cerrar por WhatsApp</span>
                  <span class="payment-option-desc">Recibimos tu pedido y coordinamos pago y detalles contigo.</span>
                </div>
                <span class="payment-option-arrow">→</span>
              </button>
            </div>

            <p class="payment-options-note">
              Te confirmaremos por WhatsApp en menos de 24 horas.
            </p>
          </fieldset>

          <!-- Mensaje de éxito (oculto) -->
          <div id="form-success" class="form-success" hidden>
            <div class="form-success-icon">✓</div>
            <h3 class="form-success-title">¡Pedido recibido!</h3>
            <p class="form-success-text" id="form-success-text">
              Te llegará un correo de confirmación en breve. Nos comunicamos contigo por WhatsApp.
            </p>
          </div>

        </form>
      </div>
    </section>
  `
}
