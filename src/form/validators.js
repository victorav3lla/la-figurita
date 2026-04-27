export function validateField(field) {
  const value = field.value.trim()
  const name = field.name

  if (field.required && !value) {
    return 'Este campo es obligatorio.'
  }

  switch (name) {
    case 'name':
      if (value.length < 3) return 'Mínimo 3 caracteres.'
      break
    case 'email':
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Correo no válido.'
      break
    case 'whatsapp':
      if (!/^[+\d\s()-]{7,20}$/.test(value)) return 'Número no válido.'
      break
    case 'photos_link':
      if (!/^https?:\/\/.+/.test(value)) return 'Debe ser un link válido (https://...).'
      break
    case 'dedication':
      if (value.length > 15) return 'Máximo 15 caracteres.'
      break
    case 'quantity':
      const n = parseInt(value, 10)
      if (isNaN(n) || n < 1 || n > 10) return 'Entre 1 y 10.'
      break
    case 'shipping_zone':
      if (!value) return 'Selecciona una zona.'
      break
  }

  return null
}

export function validateForm(form) {
  const fields = form.querySelectorAll('input, textarea, select')
  const errors = {}
  let firstErrorField = null

  fields.forEach(field => {
    if (!field.name) return
    const error = validateField(field)
    if (error) {
      errors[field.name] = error
      if (!firstErrorField) firstErrorField = field
    }
  })

  return { errors, firstErrorField, valid: Object.keys(errors).length === 0 }
}
