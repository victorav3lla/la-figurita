import { SHIPPING_OPTIONS, formatCOP } from '../data/pricing.js'
import { activeBatches } from '../data/batches.js'

const PAYMENT_INFO = {
  nequi: {
    name: 'Nequi',
    number: '321 499 7957',
    holder: 'Victor Avella'
  },
  bancolombia: {
    name: 'Bancolombia Ahorros',
    account: '691-577765-76',
    holder: 'Victor Avella',
    cc: '1.019.081.891'
  }
}

export function orderForm() {
  const batches = activeBatches()

  return `
    <section id="pedir" class="relative py-20 md:py-28 px-6 bg-cream">
      <div class="max-w-3xl mx-auto">

        <div class="mb-12 md:mb-14">
          <p class="text-xs uppercase tracking-[0.2em] font-semibold text-ink-soft mb-4">
            Pedir mi álbum
          </p>
          <h2 class="font-display font-black text-ink leading-[0.95] tracking-tight text-5xl md:text-7xl mb-6">
            Pidamos<span class="text-tomato">.</span>
          </h2>
          <p class="text-lg text-ink-soft max-w-xl leading-relaxed">
            Llena los datos, elige tu batch y mira el total antes de cerrar.
          </p>
        </div>

        <!-- PASO 1: Formulario -->
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

          <!-- 02: Batch -->
          <fieldset class="form-section">
            <legend class="form-legend">
              <span class="form-legend-num">02</span>
              Fecha de producción
            </legend>
            <div class="batch-selector">
              ${batches.map((batch, i) => `
                <label class="batch-option ${batch.discount ? 'batch-option-featured' : ''}">
                  <input type="radio" name="batch_id" value="${batch.id}" ${i === 0 ? 'checked' : ''} required />
                  <div class="batch-option-content">
                    <div class="batch-option-top">
                      <span class="batch-option-label">${batch.label}</span>
                      ${batch.discount ? `<span class="batch-option-badge">★ Lanzamiento</span>` : ''}
                    </div>
                    <p class="batch-option-price">${formatCOP(batch.price)} <span>por álbum</span></p>
                    <div class="batch-option-dates">
                      <span>📷 Fotos: <strong>${batch.deadline}</strong></span>
                      <span>📦 Entrega: <strong>${batch.delivery}</strong></span>
                    </div>
                    <p class="batch-option-spots">${batch.spotsLeft} cupos disponibles</p>
                  </div>
                  <span class="batch-option-check">✓</span>
                </label>
              `).join('')}
            </div>
            <span class="form-error" data-error-for="batch_id"></span>
          </fieldset>

          <!-- 03: Envío -->
          <fieldset class="form-section">
            <legend class="form-legend">
              <span class="form-legend-num">03</span>
              Dirección de envío
            </legend>
            <div class="form-grid">
              <div class="form-field">
                <label for="shipping_zone">Zona <span class="form-required">*</span></label>
                <select id="shipping_zone" name="shipping_zone" required>
                  <option value="">Selecciona...</option>
                  ${SHIPPING_OPTIONS.map(opt => `
                    <option value="${opt.id}">${opt.label} — ${formatCOP(opt.cost)}</option>
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
                <textarea id="address" name="address" rows="2" autocomplete="street-address" required
                          placeholder="Calle, número, apto, barrio, referencias"></textarea>
                <span class="form-error" data-error-for="address"></span>
              </div>
            </div>
          </fieldset>

          <!-- 04: Fotos -->
          <fieldset class="form-section">
            <legend class="form-legend">
              <span class="form-legend-num">04</span>
              Tus fotos
            </legend>
            <div class="form-grid">
              <div class="form-field">
                <label for="quantity">Cantidad de álbumes <span class="form-required">*</span></label>
                <input type="number" id="quantity" name="quantity" required min="1" max="10" value="1" />
                <span class="form-error" data-error-for="quantity"></span>
              </div>
              <div class="form-field form-field-full">
                <label for="photos_link">Link de las fotos <span class="form-required">*</span></label>
                <input type="url" id="photos_link" name="photos_link" required
                       placeholder="https://drive.google.com/... o https://we.tl/..." />
                <span class="form-help">Sube 48 fotos a Google Drive o WeTransfer. 40 van en el álbum y 8 son extras para que elijas. Acceso abierto.</span>
                <span class="form-error" data-error-for="photos_link"></span>
              </div>
              <div class="form-field form-field-full">
                <label for="notes">Notas (opcional)</label>
                <textarea id="notes" name="notes" rows="3"
                          placeholder="¿Algo que debamos saber? Fecha especial, observaciones..."></textarea>
              </div>
            </div>
          </fieldset>

          <!-- 05: Resumen y botones -->
          <fieldset class="form-section form-section-summary">
            <legend class="form-legend">
              <span class="form-legend-num">05</span>
              Tu pedido
            </legend>

            <div id="price-summary" class="price-summary">
              <div class="price-row">
                <span class="price-label">Álbumes <span id="summary-quantity">(1)</span></span>
                <span class="price-value" id="summary-subtotal">—</span>
              </div>
              <div class="price-row">
                <span class="price-label">Envío <span id="summary-zone" class="price-label-sub"></span></span>
                <span class="price-value" id="summary-shipping">—</span>
              </div>
              <div class="price-row price-row-total">
                <span class="price-label">Total</span>
                <span class="price-value" id="summary-total">—</span>
              </div>
              <p id="price-summary-empty" class="price-summary-empty">
                Completa cantidad y zona para ver el total.
              </p>
            </div>

            <div class="payment-options">
              <p class="payment-options-title">¿Cómo prefieres cerrar tu pedido?</p>

              <button type="button" id="btn-pay-now"
                      class="payment-option payment-option-primary" disabled>
                <div class="payment-option-content">
                  <span class="payment-option-title">Pagar ahora</span>
                  <span class="payment-option-desc">Te mostramos los datos de pago y subes el comprobante.</span>
                </div>
                <span class="payment-option-arrow">→</span>
              </button>

              <button type="button" id="btn-whatsapp"
                      class="payment-option" disabled>
                <div class="payment-option-content">
                  <span class="payment-option-title">Cerrar por WhatsApp</span>
                  <span class="payment-option-desc">Registramos tu pedido y te abrimos WhatsApp para coordinar.</span>
                </div>
                <span class="payment-option-arrow">→</span>
              </button>
            </div>

            <p class="payment-options-note">
              Te confirmamos por WhatsApp en menos de 24 horas.
            </p>
          </fieldset>

        </form>

        <!-- PASO 2: Datos de pago (oculto hasta que elijan "Pagar ahora") -->
        <div id="payment-step" hidden>
          <div class="form-container">

            <div class="form-section">
              <div class="flex items-center gap-3 mb-6">
                <button id="btn-back" class="w-8 h-8 rounded-full border-2 border-ink flex items-center justify-center hover:bg-ink hover:text-cream transition text-sm font-bold">
                  ←
                </button>
                <h3 class="font-display font-black text-2xl">Datos de pago</h3>
              </div>

              <!-- Total a pagar -->
              <div class="price-summary mb-6">
                <div class="price-row price-row-total">
                  <span class="price-label">Total a pagar</span>
                  <span class="price-value" id="payment-total">—</span>
                </div>
                <p class="text-xs text-ink-soft mt-2" id="payment-order-id"></p>
              </div>

              <!-- Opciones de pago -->
              <div class="payment-methods">

                <!-- Nequi -->
                <div class="payment-method-card">
                  <div class="payment-method-header">
                    <span class="payment-method-icon">💜</span>
                    <span class="payment-method-name">Nequi</span>
                  </div>
                  <div class="payment-method-detail">
                    <p><strong>${PAYMENT_INFO.nequi.number}</strong></p>
                    <p class="text-ink-soft text-sm">${PAYMENT_INFO.nequi.holder}</p>
                  </div>
                  <button class="copy-btn" data-copy="${PAYMENT_INFO.nequi.number}">
                    Copiar número
                  </button>
                </div>

                <!-- Bancolombia -->
                <div class="payment-method-card">
                  <div class="payment-method-header">
                    <span class="payment-method-icon">🏦</span>
                    <span class="payment-method-name">Bancolombia</span>
                  </div>
                  <div class="payment-method-detail">
                    <p><strong>${PAYMENT_INFO.bancolombia.account}</strong></p>
                    <p class="text-ink-soft text-sm">Ahorros · ${PAYMENT_INFO.bancolombia.holder}</p>
                    <p class="text-ink-soft text-sm">CC ${PAYMENT_INFO.bancolombia.cc}</p>
                  </div>
                  <button class="copy-btn" data-copy="${PAYMENT_INFO.bancolombia.account}">
                    Copiar cuenta
                  </button>
                </div>

              </div>
            </div>

            <!-- Upload comprobante -->
            <div class="form-section">
              <h3 class="font-display font-black text-xl mb-4">Sube tu comprobante</h3>
              <p class="text-ink-soft text-sm mb-6 leading-relaxed">
                Una vez realices la transferencia, sube aquí la captura o PDF del comprobante.
              </p>

              <div class="form-field">
                <label for="payment_proof">Comprobante de pago <span class="form-required">*</span></label>
                <div class="proof-upload-wrapper">
                  <input type="file" id="payment_proof" name="payment_proof"
                         accept="image/jpeg,image/png,application/pdf" />
                  <label for="payment_proof" class="proof-upload-label" id="proof-label">
                    <span class="proof-upload-icon">↑</span>
                    <span>
                      <strong id="proof-filename">Selecciona el comprobante</strong>
                      <span class="proof-upload-sub" id="proof-sub">JPG, PNG o PDF · máx 4MB</span>
                    </span>
                  </label>
                </div>
                <span class="form-error" id="proof-error"></span>
              </div>

              <button id="btn-confirm-payment" class="form-submit mt-6" disabled>
                <span id="confirm-text">Confirmar pedido</span>
                <span>→</span>
              </button>
            </div>

          </div>
        </div>

        <!-- Éxito -->
        <div id="form-success" class="form-success" hidden>
          <div class="form-success-icon">✓</div>
          <h3 class="form-success-title">¡Pedido registrado!</h3>
          <p class="form-success-text" id="form-success-text"></p>
          <p class="form-success-order" id="form-success-order"></p>
        </div>

      </div>
    </section>
  `
}
