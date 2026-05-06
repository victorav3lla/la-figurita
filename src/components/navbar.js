export function navbar() {
  const links = [
    { href: '#como-funciona', label: 'Cómo funciona' },
    { href: '#el-album',      label: 'El álbum'      },
    { href: '#batches',       label: 'Fechas'         },
    { href: '#faq',           label: 'FAQ'            },
  ]

  return `
    <header class="site-nav" id="site-nav">
      <div class="site-nav-inner">

        <!-- Logo -->
        <a href="#" class="site-nav-logo">La Figurita</a>

        <!-- Links desktop -->
        <nav class="site-nav-links" aria-label="Navegación principal">
          ${links.map(l => `
            <a href="${l.href}" class="site-nav-link" data-nav-link>${l.label}</a>
          `).join('')}
          <a href="#pedir" class="site-nav-cta">Pedir →</a>
        </nav>

        <!-- Hamburger móvil -->
        <button class="site-nav-burger" id="nav-burger" aria-label="Abrir menú">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <!-- Menú móvil -->
      <div class="site-nav-mobile" id="nav-mobile" hidden>
        ${links.map(l => `
          <a href="${l.href}" class="site-nav-mobile-link" data-nav-link>${l.label}</a>
        `).join('')}
        <a href="#pedir" class="site-nav-mobile-cta">Pedir el mío →</a>
      </div>
    </header>
  `
}

export function setupNavbar() {
  const nav    = document.getElementById('site-nav')
  const burger = document.getElementById('nav-burger')
  const mobile = document.getElementById('nav-mobile')
  const links  = document.querySelectorAll('[data-nav-link]')

  if (!nav) return

  // Sombra al hacer scroll
  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 20)
  }, { passive: true })

  // Hamburger
  burger?.addEventListener('click', () => {
    const isOpen = !mobile.hidden
    mobile.hidden = isOpen
    burger.classList.toggle('is-open', !isOpen)
    burger.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú')
  })

  // Cerrar menú móvil al hacer clic en un link
  document.querySelectorAll('.site-nav-mobile-link, .site-nav-mobile-cta').forEach(link => {
    link.addEventListener('click', () => {
      mobile.hidden = true
      burger.classList.remove('is-open')
    })
  })

  // Resaltar sección activa al scrollear
  const sections = ['como-funciona', 'el-album', 'batches', 'faq', 'pedir']
    .map(id => document.getElementById(id))
    .filter(Boolean)

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id
        links.forEach(link => {
          const href = link.getAttribute('href')
          link.classList.toggle('is-active', href === `#${id}`)
        })
      }
    })
  }, { rootMargin: '-40% 0px -55% 0px' })

  sections.forEach(s => observer.observe(s))
}
