export function howItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Eliges tu álbum',
      description: 'El regalo perfecto para papá.',
      color: 'tomato',
      icon: heartIcon()
    },
    {
      number: '02',
      title: 'Nos envías tus fotos',
      description: '48 fotos para las láminas (32 verticales y 16 horizontales) por link de Drive o WeTransfer.',
      color: 'cobalt',
      icon: cameraIcon()
    },
    {
      number: '03',
      title: 'Recibes tu álbum',
      description: 'Lo armamos, imprimimos y te lo enviamos a casa. Listo para regalar y para que escriban en él.',
      color: 'grass',
      icon: giftIcon()
    }
  ]

  return `
    <section id="como-funciona" class="relative py-20 md:py-28 px-6 bg-paper">
      <div class="max-w-7xl mx-auto">

        <!-- Encabezado -->
        <div class="max-w-2xl mb-16 md:mb-20">
          <p class="text-xs uppercase tracking-[0.2em] font-semibold text-ink-soft mb-4">
            Cómo funciona
          </p>
          <h2 class="font-display font-black text-ink leading-[0.95] tracking-tight text-5xl md:text-7xl">
            Tres pasos.
            <span class="block text-tomato">Cero complicaciones.</span>
          </h2>
        </div>

        <!-- Pasos -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          ${steps.map(step => `
            <div class="step-card group">
              <div class="step-icon bg-${step.color}">
                ${step.icon}
              </div>
              <div class="flex items-baseline gap-3 mt-6 mb-3">
                <span class="font-display font-black text-5xl text-${step.color} leading-none">
                  ${step.number}
                </span>
                <span class="h-px flex-1 bg-ink/15"></span>
              </div>
              <h3 class="font-display font-black text-2xl md:text-3xl text-ink leading-tight mb-3">
                ${step.title}
              </h3>
              <p class="text-ink-soft leading-relaxed">
                ${step.description}
              </p>
            </div>
          `).join('')}
        </div>

        <!-- CTA al final -->
        <div class="mt-16 md:mt-20 flex flex-col md:flex-row items-start md:items-center gap-6">
          <p class="font-display text-xl md:text-2xl text-ink leading-tight max-w-md">
            ¿Listo para empezar?
          </p>
          <a href="#pedir" class="font-display font-bold bg-ink text-cream px-8 py-4 rounded-full hover:bg-tomato transition inline-flex items-center gap-2">
            Pedir el mío
            <span aria-hidden="true">→</span>
          </a>
        </div>

      </div>
    </section>
  `
}

/* Íconos SVG inline */

function heartIcon() {
  return `
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 27s-9-5.5-11.5-12C2.5 9.5 6 5 10 5c2.5 0 4.5 1.5 6 4 1.5-2.5 3.5-4 6-4 4 0 7.5 4.5 5.5 10C25 21.5 16 27 16 27z"
            fill="white" stroke="white" stroke-width="2" stroke-linejoin="round"/>
    </svg>
  `
}

function cameraIcon() {
  return `
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="9" width="26" height="18" rx="2"
            fill="grey" stroke="black" stroke-width="2" stroke-linejoin="round"/>
      <path d="M11 9l2-3h6l2 3"
            stroke="black" stroke-width="2" stroke-linejoin="round" fill="white"/>
      <circle cx="16" cy="18" r="5"
            fill="none" stroke="rgba(0,0,0,0.25)" stroke-width="2"/>
    </svg>
  `
}

function giftIcon() {
  return `
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="13" width="24" height="15" rx="1"
            fill="white" stroke="white" stroke-width="2" stroke-linejoin="round"/>
      <rect x="2" y="9" width="28" height="5" rx="1"
            fill="white" stroke="white" stroke-width="2" stroke-linejoin="round"/>
      <line x1="16" y1="9" x2="16" y2="28" stroke="currentColor" stroke-width="2"/>
      <path d="M16 9c-2-3-6-3-6 0s4 0 6 0zm0 0c2-3 6-3 6 0s-4 0-6 0z"
            fill="white" stroke="white" stroke-width="2" stroke-linejoin="round"/>
    </svg>
  `
}
