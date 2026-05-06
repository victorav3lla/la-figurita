export function insideAlbum() {
  const features = [
    {
      number: '01',
      label: 'Portada',
      title: 'Edición\nDía del padre.',
      description: 'Diseño coleccionable estilo Panini, edición especial para papá. Portada única, impresa en alta calidad.',
      color: 'tomato',
      visual: coverVisual()
    },
    {
      number: '02',
      label: 'Láminas',
      title: '40 fotos.\n40 momentos.',
      description: '32 láminas verticales y 8 horizontales distribuidas en 16 páginas. Tú nos envías las fotos, nosotros armamos el álbum.',
      color: 'cobalt',
      visual: stickersVisual()
    },
    {
      number: '03',
      label: 'Preguntas y Trivias',
      title: 'Escrito\na mano.',
      description: 'El álbum incluye una sección de preguntas sobre recuerdos futboleros y una trivia del fútbol — para que papá la responda con su puño y letra.',
      color: 'grass',
      visual: questionsVisual()
    },
  ]

  return `
    <section id="el-album" class="relative py-20 md:py-28 px-6 bg-cream">
      <div class="max-w-7xl mx-auto">

        <!-- Encabezado -->
        <div class="max-w-2xl mb-16 md:mb-20">
          <p class="text-xs uppercase tracking-[0.2em] font-semibold text-ink-soft mb-4">
            El álbum por dentro
          </p>
          <h2 class="font-display font-black text-ink leading-[0.95] tracking-tight text-5xl md:text-7xl">
            No es un libro<br/>de fotos.
            <span class="block text-tomato">Es un coleccionable.</span>
          </h2>
        </div>

        <!-- Features -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          ${features.map(f => `
            <article class="feature-card">
              <div class="feature-visual bg-${f.color}">
                ${f.visual}
              </div>
              <div class="feature-body">
                <div class="flex items-center gap-3 mb-4">
                  <span class="font-display font-black text-sm bg-ink text-cream px-2.5 py-1 rounded-full tracking-wider">
                    ${f.number}
                  </span>
                  <span class="text-xs uppercase tracking-[0.2em] font-semibold text-ink-soft">
                    ${f.label}
                  </span>
                </div>
                <h3 class="font-display font-black text-3xl md:text-4xl text-ink leading-[0.95] mb-4 whitespace-pre-line">
                  ${f.title}
                </h3>
                <p class="text-ink-soft leading-relaxed">
                  ${f.description}
                </p>
              </div>
            </article>
          `).join('')}
        </div>

        <!-- Specs strip -->
        <div class="mt-16 md:mt-20 specs-strip">
          ${[
      { label: 'Páginas',      value: '16'    },
      { label: 'Láminas',      value: '40'    },
      { label: 'Verticales',   value: '32'    },
      { label: 'Horizontales', value: '8'     },
      { label: 'Encuadernación', value: 'Blanda' }
    ].map(s => `
            <div class="spec-item">
              <p class="font-display font-black text-4xl md:text-5xl text-ink leading-none">${s.value}</p>
              <p class="text-xs uppercase tracking-wider text-ink-soft mt-2">${s.label}</p>
            </div>
          `).join('')}
        </div>

      </div>
    </section>
  `
}

/* Visuales SVG ilustrativos */

function coverVisual() {
  return `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <!-- Mini álbum -->
      <rect x="55" y="35" width="100" height="130" rx="4"
            fill="#FBF7EE" stroke="#0F0F0F" stroke-width="3"/>
      <text x="105" y="105" font-family="Montserrat, sans-serif" font-weight="900"
            font-size="48" fill="#0F0F0F" text-anchor="middle">DAD</text>
      <text x="105" y="135" font-family="Montserrat, sans-serif" font-weight="700"
            font-size="11" fill="#0F0F0F" text-anchor="middle">2026 EDITION</text>
      <!-- Estrella decorativa -->
      <circle cx="155" cy="55" r="14" fill="#FACC15" stroke="#0F0F0F" stroke-width="2"/>
      <text x="155" y="60" font-family="Montserrat, sans-serif" font-weight="900"
            font-size="14" fill="#0F0F0F" text-anchor="middle">★</text>
    </svg>
  `
}

function stickersVisual() {
  return `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <!-- Lámina 1 (atrás izquierda) -->
      <g transform="translate(35 50) rotate(-8)">
        <rect width="60" height="80" rx="4" fill="#FBF7EE" stroke="#0F0F0F" stroke-width="2.5"/>
        <rect x="6" y="6" width="48" height="48" rx="2" fill="#E63946" opacity="0.4"/>
        <line x1="10" y1="62" x2="50" y2="62" stroke="#0F0F0F" stroke-width="1.5"/>
        <line x1="10" y1="68" x2="40" y2="68" stroke="#0F0F0F" stroke-width="1.5"/>
      </g>
      <!-- Lámina 2 (centro adelante) -->
      <g transform="translate(75 65) rotate(4)">
        <rect width="60" height="80" rx="4" fill="#FBF7EE" stroke="#0F0F0F" stroke-width="2.5"/>
        <rect x="6" y="6" width="48" height="48" rx="2" fill="#FACC15" opacity="0.5"/>
        <line x1="10" y1="62" x2="50" y2="62" stroke="#0F0F0F" stroke-width="1.5"/>
        <line x1="10" y1="68" x2="40" y2="68" stroke="#0F0F0F" stroke-width="1.5"/>
      </g>
      <!-- Lámina 3 (atrás derecha) -->
      <g transform="translate(115 45) rotate(10)">
        <rect width="60" height="80" rx="4" fill="#FBF7EE" stroke="#0F0F0F" stroke-width="2.5"/>
        <rect x="6" y="6" width="48" height="48" rx="2" fill="#16A34A" opacity="0.4"/>
        <line x1="10" y1="62" x2="50" y2="62" stroke="#0F0F0F" stroke-width="1.5"/>
        <line x1="10" y1="68" x2="40" y2="68" stroke="#0F0F0F" stroke-width="1.5"/>
      </g>
    </svg>
  `
}

function questionsVisual() {
  return `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <!-- Página con preguntas -->
      <rect x="40" y="35" width="120" height="135" rx="4"
            fill="#FBF7EE" stroke="#0F0F0F" stroke-width="3"/>
      <!-- Pregunta 1 -->
      <text x="55" y="65" font-family="Montserrat, sans-serif" font-weight="700"
            font-size="10" fill="#0F0F0F">¿Tu primer recuerdo?</text>
      <line x1="55" y1="80" x2="145" y2="80" stroke="#0F0F0F" stroke-width="1" opacity="0.3"/>
      <!-- Letra escrita simulada -->
      <path d="M 58 78 Q 62 73, 68 76 Q 74 79, 80 75 Q 86 71, 92 76"
            fill="none" stroke="#2563EB" stroke-width="1.8" stroke-linecap="round"/>
      <!-- Pregunta 2 -->
      <text x="55" y="105" font-family="Montserrat, sans-serif" font-weight="700"
            font-size="10" fill="#0F0F0F">¿Tu mejor consejo?</text>
      <line x1="55" y1="120" x2="145" y2="120" stroke="#0F0F0F" stroke-width="1" opacity="0.3"/>
      <path d="M 58 118 Q 64 114, 70 117 Q 78 121, 86 115 Q 94 110, 102 116 Q 110 121, 118 116"
            fill="none" stroke="#2563EB" stroke-width="1.8" stroke-linecap="round"/>
      <!-- Pregunta 3 -->
      <text x="55" y="145" font-family="Montserrat, sans-serif" font-weight="700"
            font-size="10" fill="#0F0F0F">¿Lo que más amas?</text>
      <line x1="55" y1="160" x2="145" y2="160" stroke="#0F0F0F" stroke-width="1" opacity="0.3"/>
    </svg>
  `
}
