import { validateField, validateForm } from './validators.js';
import {
  calculateTotal,
  formatCOP,
  SHIPPING_OPTIONS,
} from '../data/pricing.js';
import { getBatch } from '../data/batches.js';

// Genera número de pedido: LF-DDMMYY-XXXX
function generateOrderId() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `LF-${day}${month}${year}-${random}`;
}

export function setupForm() {
  const form = document.getElementById('order-form');
  if (!form) return;

  setupValidation(form);
  setupPriceSummary(form);
  setupPaymentButtons(form);
  setupCopyButtons();
  setupFileUpload();
  setupConfirmPayment(form);
}

function setupValidation(form) {
  form.querySelectorAll('input, textarea, select').forEach((field) => {
    field.addEventListener('blur', () =>
      showFieldError(field, validateField(field))
    );
    field.addEventListener('input', () => {
      if (field.classList.contains('has-error')) {
        showFieldError(field, validateField(field));
      }
    });
  });
}

function setupPriceSummary(form) {
  const quantityInput = form.querySelector('#quantity');
  const zoneSelect = form.querySelector('#shipping_zone');
  const buttons = [
    document.getElementById('btn-pay-now'),
    document.getElementById('btn-whatsapp'),
  ];

  function getSelectedBatch() {
    const checked = form.querySelector('input[name="batch_id"]:checked');
    return checked ? getBatch(checked.value) : null;
  }

  function update() {
    const quantity = parseInt(quantityInput?.value, 10) || 0;
    const zone = zoneSelect?.value;
    const batch = getSelectedBatch();
    const ready = quantity > 0 && zone !== '' && batch;

    const empty = document.getElementById('price-summary-empty');
    const summary = document.getElementById('price-summary');

    if (!ready) {
      summary?.classList.remove('is-ready');
      if (empty) empty.hidden = false;
      buttons.forEach((b) => {
        if (b) b.disabled = true;
      });
      return;
    }

    const totals = calculateTotal({
      quantity,
      shippingZone: zone,
      batchId: batch.id,
    });

    document.getElementById('summary-quantity').textContent = `(${quantity})`;
    document.getElementById('summary-subtotal').textContent = formatCOP(
      totals.subtotal
    );
    document.getElementById('summary-shipping').textContent = formatCOP(
      totals.shipping
    );

    const zoneLabel = SHIPPING_OPTIONS.find((o) => o.id === zone)?.label || '';
    document.getElementById('summary-zone').textContent = `(${zoneLabel})`;
    document.getElementById('summary-total').textContent = formatCOP(
      totals.total
    );

    summary?.classList.add('is-ready');
    if (empty) empty.hidden = true;
    buttons.forEach((b) => {
      if (b) b.disabled = false;
    });

    // Guardar totals para usar en el paso 2
    form.dataset.totals = JSON.stringify(totals);
    form.dataset.batchId = batch.id;
    form.dataset.zone = zone;
    form.dataset.quantity = quantity;
  }

  quantityInput?.addEventListener('input', update);
  zoneSelect?.addEventListener('change', update);
  form.querySelectorAll('input[name="batch_id"]').forEach((r) => {
    r.addEventListener('change', update);
  });
  update();
}

function setupPaymentButtons(form) {
  const btnPayNow = document.getElementById('btn-pay-now');
  const btnWhatsapp = document.getElementById('btn-whatsapp');

  btnPayNow?.addEventListener('click', () => {
    // Validar el formulario primero
    const { errors, firstErrorField, valid } = validateForm(form);
    if (!valid) {
      Object.entries(errors).forEach(([name, message]) => {
        const field = form.querySelector(`[name="${name}"]`);
        if (field) showFieldError(field, message);
      });
      firstErrorField?.focus();
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Guardar datos del form en dataset para usar en paso 2
    saveFormData(form);

    // Generar número de pedido
    const orderId = generateOrderId();
    form.dataset.orderId = orderId;

    // Mostrar totales en paso 2
    const totals = JSON.parse(form.dataset.totals || '{}');
    const paymentTotal = document.getElementById('payment-total');
    const paymentOrderId = document.getElementById('payment-order-id');
    if (paymentTotal) paymentTotal.textContent = formatCOP(totals.total);
    if (paymentOrderId)
      paymentOrderId.textContent = `Número de pedido: ${orderId}`;

    // Mostrar paso 2
    form.hidden = true;
    document.getElementById('payment-step').hidden = false;
    document
      .getElementById('payment-step')
      .scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  btnWhatsapp?.addEventListener('click', async () => {
    const { errors, firstErrorField, valid } = validateForm(form);
    if (!valid) {
      Object.entries(errors).forEach(([name, message]) => {
        const field = form.querySelector(`[name="${name}"]`);
        if (field) showFieldError(field, message);
      });
      firstErrorField?.focus();
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    btnWhatsapp.disabled = true;
    btnWhatsapp.querySelector('.payment-option-title').textContent =
      'Enviando...';

    try {
      const orderId = generateOrderId();
      form.dataset.orderId = orderId;
      const data = collectFormData(form, 'whatsapp', orderId);

      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Error del servidor');

      showSuccess('whatsapp', orderId, data);
    } catch (err) {
      btnWhatsapp.disabled = false;
      btnWhatsapp.querySelector('.payment-option-title').textContent =
        'Cerrar por WhatsApp';
      alert(
        'Hubo un problema. Intenta de nuevo o escríbenos directamente por WhatsApp.'
      );
    }
  });

  // Botón volver
  document.getElementById('btn-back')?.addEventListener('click', () => {
    document.getElementById('payment-step').hidden = true;
    form.hidden = false;
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function setupCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.copy;
      navigator.clipboard.writeText(text).then(() => {
        const original = btn.textContent;
        btn.textContent = '¡Copiado!';
        btn.style.background = 'var(--color-grass)';
        btn.style.color = 'white';
        setTimeout(() => {
          btn.textContent = original;
          btn.style.background = '';
          btn.style.color = '';
        }, 2000);
      });
    });
  });
}

function setupFileUpload() {
  const fileInput = document.getElementById('payment_proof');
  const confirmBtn = document.getElementById('btn-confirm-payment');
  const proofLabel = document.getElementById('proof-label');
  const filename = document.getElementById('proof-filename');
  const sub = document.getElementById('proof-sub');

  fileInput?.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];

      // Validar tamaño y tipo
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      const proofError = document.getElementById('proof-error');

      if (file.size > 4 * 1024 * 1024) {
        if (proofError) proofError.textContent = 'El archivo supera 4MB.';
        if (confirmBtn) confirmBtn.disabled = true;
        return;
      }
      if (!validTypes.includes(file.type)) {
        if (proofError) proofError.textContent = 'Solo JPG, PNG o PDF.';
        if (confirmBtn) confirmBtn.disabled = true;
        return;
      }

      if (proofError) proofError.textContent = '';
      if (filename) filename.textContent = file.name;
      if (sub)
        sub.textContent = `${Math.round(file.size / 1024)} KB · clic para cambiar`;
      if (proofLabel) proofLabel.style.borderColor = 'var(--color-grass)';
      if (confirmBtn) confirmBtn.disabled = false;
    }
  });
}

function setupConfirmPayment(form) {
  const confirmBtn = document.getElementById('btn-confirm-payment');
  const confirmText = document.getElementById('confirm-text');

  confirmBtn?.addEventListener('click', async () => {
    const fileInput = document.getElementById('payment_proof');

    if (!fileInput?.files.length) {
      const proofError = document.getElementById('proof-error');
      if (proofError) proofError.textContent = 'Debes subir el comprobante.';
      return;
    }

    confirmBtn.disabled = true;
    if (confirmText) confirmText.textContent = 'Enviando...';

    try {
      const orderId = form.dataset.orderId;
      const data = collectFormData(form, 'pay_now', orderId);

      // Convertir archivo a base64 para enviarlo en JSON
      const file = fileInput.files[0];
      const base64 = await fileToBase64(file);

      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          proof: {
            name: file.name,
            type: file.type,
            data: base64,
          },
        }),
      });

      if (!response.ok) throw new Error('Error del servidor');

      showSuccess('pay_now', orderId, data);
    } catch (err) {
      confirmBtn.disabled = false;
      if (confirmText) confirmText.textContent = 'Confirmar pedido';
      alert('Hubo un problema enviando el pedido. Intenta de nuevo.');
    }
  });
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function collectFormData(form, method, orderId) {
  const data = { payment_method: method, order_id: orderId };
  new FormData(form).forEach((value, key) => {
    if (key !== 'payment_method') data[key] = value;
  });

  const quantity = parseInt(data.quantity, 10) || 0;
  data.totals = calculateTotal({
    quantity,
    shippingZone: data.shipping_zone,
    batchId: data.batch_id,
  });

  return data;
}

function saveFormData(form) {
  // Guarda los valores actuales en dataset para recuperarlos si vuelven
  form.dataset.savedData = JSON.stringify(collectFormData(form, '', ''));
}

function showSuccess(method, orderId, data) {
  // Ocultar formulario y paso 2
  document.getElementById('order-form').hidden = true;
  document.getElementById('payment-step').hidden = true;

  const success = document.getElementById('form-success');
  const text = document.getElementById('form-success-text');
  const orderEl = document.getElementById('form-success-order');

  if (orderEl) orderEl.textContent = `Número de pedido: ${orderId}`;

  if (method === 'pay_now') {
    if (text)
      text.textContent =
        'Recibimos tu comprobante. En breve confirmamos el pago y ponemos tu álbum en producción. Te escribimos por WhatsApp.';
  } else {
    // WhatsApp: mostrar botón para abrir chat
    const batch = getBatch(data.batch_id);
    const waText = encodeURIComponent(
      `Hola! Soy ${data.name} y acabo de hacer un pedido en lafigurita.com.\n` +
        `Número de pedido: ${orderId}\n` +
        `Batch: ${batch?.label || data.batch_id}\n` +
        `Quiero coordinar el pago.`
    );
    if (text)
      text.innerHTML = `
      Tu pedido está registrado. Haz clic abajo para coordinar el pago:
      <br/><br/>
      <a href="https://wa.me/573144329060?text=${waText}"
         target="_blank" rel="noopener"
         style="display:inline-flex;align-items:center;gap:8px;background:#25D366;color:white;
                font-weight:800;font-size:16px;padding:14px 24px;border-radius:999px;
                text-decoration:none;margin-top:4px;">
        Abrir WhatsApp →
      </a>
    `;
  }

  if (success) {
    success.hidden = false;
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function showFieldError(field, message) {
  const errorEl =
    field.closest('.form-field')?.querySelector('.form-error') ||
    document.querySelector(`.form-error[data-error-for="${field.name}"]`);
  if (!errorEl) return;

  if (message) {
    errorEl.textContent = message;
    field.classList.add('has-error');
  } else {
    errorEl.textContent = '';
    field.classList.remove('has-error');
  }
}
