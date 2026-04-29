const slides = [
  { src: '/images/album-papa.png',   alt: 'Portada del álbum' },
  { src: '/images/album-page-1.jpg', alt: 'Página interior 1' },
  { src: '/images/album-page-2.jpg', alt: 'Página interior 2' },
  { src: '/images/album-page-3.jpg', alt: 'Página interior 3' },
]

export function albumCarousel() {
  return `
    <div class="album-carousel">
      <div class="album-carousel-track" id="carousel-track">
        ${slides.map((slide, i) => `
          <div class="carousel-slide ${i === 0 ? 'is-active' : ''}" data-index="${i}">
            <div class="album-stage">
              <div class="album-shadow"></div>
              <div class="album">
                <img
                  src="${slide.src}"
                  alt="${slide.alt}"
                  onerror="this.style.display='none'"
                />
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Controles -->
      <div class="carousel-controls">
        <button class="carousel-btn carousel-btn-prev" id="carousel-prev" aria-label="Anterior">
          ←
        </button>
        <div class="carousel-dots" id="carousel-dots">
          ${slides.map((_, i) => `
            <button class="carousel-dot ${i === 0 ? 'is-active' : ''}"
                    data-dot="${i}" aria-label="Ir a slide ${i + 1}">
            </button>
          `).join('')}
        </div>
        <button class="carousel-btn carousel-btn-next" id="carousel-next" aria-label="Siguiente">
          →
        </button>
      </div>
    </div>
  `
}

export function setupCarousel() {
  const track   = document.getElementById('carousel-track')
  const prevBtn = document.getElementById('carousel-prev')
  const nextBtn = document.getElementById('carousel-next')
  const dots    = document.querySelectorAll('.carousel-dot')
  const slides  = document.querySelectorAll('.carousel-slide')

  if (!track) return

  let current = 0
  let isAnimating = false

  function goTo(index, direction = 'next') {
    if (isAnimating || index === current) return
    isAnimating = true

    const currentSlide = slides[current]
    const nextSlide    = slides[index]

    // Preparar el siguiente slide fuera de pantalla
    nextSlide.classList.add(direction === 'next' ? 'enter-right' : 'enter-left')
    nextSlide.classList.add('is-active')

    // Forzar reflow para que la animación arranque
    nextSlide.getBoundingClientRect()

    // Animar salida del actual y entrada del siguiente
    currentSlide.classList.add(direction === 'next' ? 'exit-left' : 'exit-right')
    nextSlide.classList.remove('enter-right', 'enter-left')

    // Actualizar dots
    dots.forEach(d => d.classList.remove('is-active'))
    dots[index].classList.add('is-active')

    setTimeout(() => {
      currentSlide.classList.remove('is-active', 'exit-left', 'exit-right')
      isAnimating = false
      current = index
    }, 500)
  }

  nextBtn.addEventListener('click', () => {
    const next = (current + 1) % slides.length
    goTo(next, 'next')
  })

  prevBtn.addEventListener('click', () => {
    const prev = (current - 1 + slides.length) % slides.length
    goTo(prev, 'prev')
  })

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.dataset.dot)
      goTo(index, index > current ? 'next' : 'prev')
    })
  })

  // Swipe en móvil
  let touchStartX = 0
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX
  }, { passive: true })

  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX
    if (Math.abs(diff) < 50) return
    if (diff > 0) {
      goTo((current + 1) % slides.length, 'next')
    } else {
      goTo((current - 1 + slides.length) % slides.length, 'prev')
    }
  }, { passive: true })

  // Auto-avance cada 4 segundos
  setInterval(() => {
    goTo((current + 1) % slides.length, 'next')
  }, 4000)
}
