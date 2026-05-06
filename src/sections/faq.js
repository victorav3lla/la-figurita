import { faqs } from '../data/faq.js'

export function faq() {
  return `
    <section id="faq" class="relative py-20 md:py-28 px-6 bg-paper">
      <div class="max-w-4xl mx-auto">

        <!-- Encabezado -->
        <div class="mb-12 md:mb-16">
          <p class="text-xs uppercase tracking-[0.2em] font-semibold text-ink-soft mb-4">
            Preguntas frecuentes
          </p>
          <h2 class="font-display font-black text-ink leading-[0.95] tracking-tight text-5xl md:text-7xl">
            ¿Tienes dudas?
            <span class="block text-tomato">Aquí van.</span>
          </h2>
        </div>

        <!-- Lista de FAQs -->
        <div class="faq-list">
          ${faqs.map((item, i) => `
            <details class="faq-item" ${i === 0 ? 'open' : ''}>
              <summary class="faq-question">
                <span class="faq-question-text">${item.q}</span>
                <span class="faq-icon" aria-hidden="true">+</span>
              </summary>
              <div class="faq-answer">
                <p>${item.a}</p>
              </div>
            </details>
          `).join('')}
        </div>

        <!-- CTA al final -->
        <div class="mt-12 md:mt-16 faq-help">
          <p class="font-display font-bold text-xl md:text-2xl text-ink mb-3">
            ¿Tu pregunta no está aquí?
          </p>
          <p class="text-ink-soft mb-5">
            Escríbenos por WhatsApp y te respondemos rápido.
          </p>
          <a href="https://wa.me/573144329060" target="_blank" rel="noopener" class="font-display font-bold bg-grass text-cream px-6 py-3 rounded-full hover:bg-ink transition inline-flex items-center gap-2">
            Escribir por WhatsApp
            <span aria-hidden="true">→</span>
          </a>
        </div>

      </div>
    </section>
  `
}
