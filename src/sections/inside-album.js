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
      title: '48 fotos.\n48 momentos.',
      description: 'Imprimimos 48 láminas con tus fotos — 40 van en el álbum y 8 son tuyas para pegar donde quieras o guardar de recuerdo.',
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
      <rect x="50" y="30" width="110" height="140" rx="4"
            fill="#FBF7EE" stroke="#0F0F0F" stroke-width="3"/>
      <text x="105" y="105" font-family="Montserrat, sans-serif" font-weight="900"
            font-size="36" fill="#0F0F0F" text-anchor="middle">DAD</text>
      <text x="105" y="128" font-family="Montserrat, sans-serif" font-weight="700"
            font-size="9" fill="#0F0F0F" text-anchor="middle">2026 EDITION</text>
      <circle cx="148" cy="52" r="14" fill="#FACC15" stroke="#0F0F0F" stroke-width="2"/>
      <text x="148" y="57" font-family="Montserrat, sans-serif" font-weight="900"
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
      <rect x="35" y="25" width="130" height="155" rx="4"
            fill="#FBF7EE" stroke="#0F0F0F" stroke-width="3"/>

      <!-- Pregunta 1 -->
      <text x="50" y="58" font-family="Inter, sans-serif" font-weight="700"
            font-size="8.5" fill="#0F0F0F">¿Tu primer</text>
      <text x="50" y="69" font-family="Inter, sans-serif" font-weight="700"
            font-size="8.5" fill="#0F0F0F">recuerdo?</text>
      <line x1="50" y1="78" x2="150" y2="78" stroke="#0F0F0F" stroke-width="0.8" opacity="0.25"/>
      <path d="M 53 76 Q 58 71, 64 74 Q 70 77, 76 72 Q 82 68, 88 73"
            fill="none" stroke="#2563EB" stroke-width="1.6" stroke-linecap="round"/>

      <!-- Pregunta 2 -->
      <text x="50" y="100" font-family="Inter, sans-serif" font-weight="700"
            font-size="8.5" fill="#0F0F0F">¿Tu mejor</text>
      <text x="50" y="111" font-family="Inter, sans-serif" font-weight="700"
            font-size="8.5" fill="#0F0F0F">consejo?</text>
      <line x1="50" y1="120" x2="150" y2="120" stroke="#0F0F0F" stroke-width="0.8" opacity="0.25"/>
      <path d="M 53 118 Q 60 113, 67 116 Q 75 119, 83 114 Q 91 109, 99 114 Q 107 119, 115 114"
            fill="none" stroke="#2563EB" stroke-width="1.6" stroke-linecap="round"/>

      <!-- Pregunta 3 -->
      <text x="50" y="142" font-family="Inter, sans-serif" font-weight="700"
            font-size="8.5" fill="#0F0F0F">¿Lo que más</text>
      <text x="50" y="153" font-family="Inter, sans-serif" font-weight="700"
            font-size="8.5" fill="#0F0F0F">amas?</text>
      <line x1="50" y1="162" x2="150" y2="162" stroke="#0F0F0F" stroke-width="0.8" opacity="0.25"/>
    </svg>
  `
}
