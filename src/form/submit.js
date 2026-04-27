import { validateField, validateForm } from './validators.js'
import { calculateTotal, formatCOP, SHIPPING_OPTIONS } from '../data/pricing.js'

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
  const zoneSelect = form.querySelector('#shipping_zone')
  const buttons = form.querySelectorAll('.payment-option')

  function update() {
    const quantity = parseInt(quantityInput.value, 10) || 0
    const zone = zoneSelect.value
    const ready = quantity > 0 && zone !== ''

    const empty = form.querySelector('#price-summary-empty')
    const summary = form.querySelector('#price-summary')

    if (!ready) {
      summary.classList.remove('is-ready')
      empty.hidden = false
      buttons.forEach(b => b.disabled = true)
      return
    }

    // Calcular dos versiones: con y sin descuento, para mostrar lo que ahorra el "pagar ahora"
    const withDiscount = calculateTotal({ quantity, shippingZone: zone, payNow: true })
    const withoutDiscount = calculateTotal({ quantity, shippingZone: zone, payNow: false })

    // Mostramos el total SIN descuento por defecto, y un sub-texto del precio con descuento
    form.querySelector('#summary-quantity').textContent = `(${quantity})`
    form.querySelector('#summary-subtotal').textContent = formatCOP(withoutDiscount.subtotal)
    form.querySelector('#summary-shipping').textContent = formatCOP(withoutDiscount.shipping)

    const zoneLabel = SHIPPING_OPTIONS.find(o => o.id === zone)?.label || ''
    form.querySelector('#summary-zone').textContent = `(${zoneLabel})`

    form.querySelector('#summary-total').textContent = formatCOP(withoutDiscount.total)
    form.querySelector('#summary-discount-row').hidden = true

    // Mostrar el total con descuento dentro del botón de "Pagar ahora"
    const payNowBtn = form.querySelector('.payment-option-primary')
    let payNowPrice = payNowBtn.querySelector('.payment-option-price')
    if (!payNowPrice) {
      payNowPrice = document.createElement('span')
      payNowPrice.className = 'payment-option-price'
      payNowBtn.querySelector('.payment-option-content').appendChild(payNowPrice)
    }
    payNowPrice.innerHTML = `
      Total: <strong>${formatCOP(withDiscount.total)}</strong>
      <span class="payment-option-strike">${formatCOP(withoutDiscount.total)}</span>
    `

    // Mostrar el total normal en el otro botón
    const waBtn = form.querySelectorAll('.payment-option')[1]
    let waPrice = waBtn.querySelector('.payment-option-price')
    if (!waPrice) {
      waPrice = document.createElement('span')
      waPrice.className = 'payment-option-price'
      waBtn.querySelector('.payment-option-content').appendChild(waPrice)
    }
    waPrice.innerHTML = `Total: <strong>${formatCOP(withoutDiscount.total)}</strong>`

    summary.classList.add('is-ready')
    empty.hidden = true
    buttons.forEach(b => b.disabled = false)
  }

  quantityInput.addEventListener('input', update)
  zoneSelect.addEventListener('change', update)
  update()
}

function setupSubmit(form) {
  let chosenMethod = null

  // Capturar qué botón disparó el submit
  form.querySelectorAll('button[type="submit"]').forEach(btn => {
    btn.addEventListener('click', () => {
      chosenMethod = btn.value
    })
  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    form.querySelectorAll('.form-error').forEach(el => el.textContent = '')
    form.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'))

    const { errors, firstErrorField, valid } = validateForm(form)

    if (!valid) {
      Object.entries(errors).forEach(([name, message]) => {
        const field = form.querySelector(`[name="${name}"]`)
        showFieldError(field, message)
      })
      firstErrorField?.focus()
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    // Loading: deshabilitar ambos botones y poner texto en el clickeado
    const allButtons = form.querySelectorAll('.payment-option')
    allButtons.forEach(b => b.disabled = true)
    const clickedBtn = form.querySelector(`button[value="${chosenMethod}"]`)
    const originalContent = clickedBtn.innerHTML
    clickedBtn.innerHTML = '<span class="payment-option-loading">Enviando...</span>'

    try {
      // SIMULACIÓN — reemplazar por fetch al backend
      await new Promise(resolve => setTimeout(resolve, 1500))

      const data = collectFormData(form, chosenMethod)
      console.log('Pedido a enviar:', data)

      showSuccess(form, chosenMethod)
    } catch (err) {
      allButtons.forEach(b => b.disabled = false)
      clickedBtn.innerHTML = originalContent
      alert('Hubo un problema. Intenta de nuevo o escríbenos por WhatsApp.')
    }
  })
}

function showFieldError(field, message) {
  const errorEl = field.closest('.form-field')?.querySelector('.form-error')
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
  const totals = calculateTotal({ quantity, shippingZone: zone, payNow: paymentMethod === 'pay_now' })
  data.totals = totals

  return data
}

function showSuccess(form, method) {
  const success = form.querySelector('#form-success')
  const text = form.querySelector('#form-success-text')

  if (method === 'pay_now') {
    text.textContent = 'En breve te enviamos los datos de pago por correo y WhatsApp. Una vez confirmado el pago, iniciamos producción.'
  } else {
    text.textContent = 'Te escribimos por WhatsApp en menos de 24 horas para confirmar detalles y coordinar el pago.'
  }

  Array.from(form.children).forEach(child => {
    if (child !== success) child.style.display = 'none'
  })
  success.hidden = false
  success.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
