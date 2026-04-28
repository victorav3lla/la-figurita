import { validateField, validateForm } from './validators.js'
import { calculateTotal, formatCOP, SHIPPING_OPTIONS } from '../data/pricing.js'
import { getBatch } from '../data/batches.js'

export function setupForm() {
  const form = document.getElementById('order-form')
  if (!form) return

  setupValidation(form)
  setupPriceSummary(form)
  setupSubmit(form)
}

function setupValidation(form) {
  form.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('blur', () => {
      showFieldError(field, validateField(field))
    })
    field.addEventListener('input', () => {
      if (field.classList.contains('has-error')) {
        showFieldError(field, validateField(field))
      }
    })
  })
}

function setupPriceSummary(form) {
  const quantityInput = form.querySelector('#quantity')
  const zoneSelect    = form.querySelector('#shipping_zone')
  const buttons       = form.querySelectorAll('.payment-option')

  function getSelectedBatch() {
    const checked = form.querySelector('input[name="batch_id"]:checked')
    return checked ? getBatch(checked.value) : null
  }

  function update() {
    const quantity = parseInt(quantityInput.value, 10) || 0
    const zone     = zoneSelect.value
    const batch    = getSelectedBatch()
    const ready    = quantity > 0 && zone !== '' && batch

    const empty   = form.querySelector('#price-summary-empty')
    const summary = form.querySelector('#price-summary')

    if (!ready) {
      summary.classList.remove('is-ready')
      empty.hidden = false
      buttons.forEach(b => b.disabled = true)
      return
    }

    const totals = calculateTotal({ quantity, shippingZone: zone, batchId: batch.id })

    form.querySelector('#summary-quantity').textContent = `(${quantity})`
    form.querySelector('#summary-subtotal').textContent = formatCOP(totals.subtotal)
    form.querySelector('#summary-shipping').textContent = formatCOP(totals.shipping)

    const zoneLabel = SHIPPING_OPTIONS.find(o => o.id === zone)?.label || ''
    form.querySelector('#summary-zone').textContent = `(${zoneLabel})`

    const discountRow = form.querySelector('#summary-discount-row')
    if (totals.discount > 0) {
      discountRow.hidden = false
      form.querySelector('#summary-discount').textContent = `−${formatCOP(totals.discount)}`
    } else {
      discountRow.hidden = true
    }

    form.querySelector('#summary-total').textContent = formatCOP(totals.total)

    // Actualizar precio en botón de pagar ahora
    const payNowBtn = form.querySelector('.payment-option-primary')
    let priceTag = payNowBtn.querySelector('.payment-option-price')
    if (!priceTag) {
      priceTag = document.createElement('span')
      priceTag.className = 'payment-option-price'
      payNowBtn.querySelector('.payment-option-content').appendChild(priceTag)
    }
    priceTag.innerHTML = `Total: <strong>${formatCOP(totals.total)}</strong>`

    summary.classList.add('is-ready')
    empty.hidden = true
    buttons.forEach(b => b.disabled = false)
  }

  quantityInput.addEventListener('input', update)
  zoneSelect.addEventListener('change', update)
  form.querySelectorAll('input[name="batch_id"]').forEach(r => {
    r.addEventListener('change', update)
  })

  update()
}

function setupSubmit(form) {
  let chosenMethod = null

  form.querySelectorAll('button[type="submit"]').forEach(btn => {
    btn.addEventListener('click', () => { chosenMethod = btn.value })
  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    form.querySelectorAll('.form-error').forEach(el => el.textContent = '')
    form.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'))

    const { errors, firstErrorField, valid } = validateForm(form)

    if (!valid) {
      Object.entries(errors).forEach(([name, message]) => {
        const field = form.querySelector(`[name="${name}"]`)
        if (field) showFieldError(field, message)
      })
      firstErrorField?.focus()
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    const allButtons = form.querySelectorAll('.payment-option')
    allButtons.forEach(b => b.disabled = true)
    const clickedBtn = form.querySelector(`button[value="${chosenMethod}"]`)
    clickedBtn.innerHTML = '<span class="payment-option-loading">Enviando...</span>'

    try {
      const data = collectFormData(form, chosenMethod)

      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) throw new Error('Error del servidor')

      showSuccess(form, chosenMethod)
    } catch (err) {
      allButtons.forEach(b => b.disabled = false)
      clickedBtn.innerHTML = chosenMethod === 'pay_now'
        ? '<div class="payment-option-content"><span class="payment-option-title">Pagar ahora</span></div><span class="payment-option-arrow">→</span>'
        : '<div class="payment-option-content"><span class="payment-option-title">Cerrar por WhatsApp</span></div><span class="payment-option-arrow">→</span>'
      alert('Hubo un problema. Intenta de nuevo o escríbenos por WhatsApp.')
    }
  })
}

function showFieldError(field, message) {
  const errorEl = field.closest('.form-field, fieldset')?.querySelector(`.form-error[data-error-for="${field.name}"]`)
    || field.closest('.form-field')?.querySelector('.form-error')
  if (!errorEl) return

  if (message) {
    errorEl.textContent = message
    field.classList.add('has-error')
  } else {
    errorEl.textContent = ''
    field.classList.remove('has-error')
  }
}

function collectFormData(form, paymentMethod) {
  const data = { payment_method: paymentMethod }
  new FormData(form).forEach((value, key) => {
    if (key !== 'payment_method') data[key] = value
  })

  const quantity = parseInt(data.quantity, 10) || 0
  const zone = data.shipping_zone
  const batchId = data.batch_id
  data.totals = calculateTotal({ quantity, shippingZone: zone, batchId })

  return data
}

function showSuccess(form, method) {
  const success = form.querySelector('#form-success')
  const text = form.querySelector('#form-success-text')

  text.textContent = method === 'pay_now'
    ? 'En breve te enviamos los datos de pago por correo y WhatsApp. Una vez confirmado el pago, iniciamos producción.'
    : 'Te escribimos por WhatsApp en menos de 24 horas para confirmar detalles y coordinar el pago.'

  Array.from(form.children).forEach(child => {
    if (child !== success) child.style.display = 'none'
  })
  success.hidden = false
  success.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
