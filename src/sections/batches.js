import { BATCHES } from '../data/batches.js'
import { formatCOP } from '../data/pricing.js'

function batchBadge(batch, isSoldOut) {
  if (isSoldOut) return '<span class="batch-badge-soldout">Agotado</span>'
  if (batch.discount) return '<span class="batch-badge-discount">★ ' + batch.discountLabel + '</span>'
  return ''
}

function batchCard(batch) {
  const isSoldOut    = batch.spotsLeft === 0
  const isFeatured   = batch.discount
  const spotsPercent = Math.round((batch.spotsLeft / batch.spots) * 100)
  const spotsColor   = spotsPercent > 50 ? 'bg-grass' : spotsPercent > 20 ? 'bg-sun' : 'bg-tomato'

  return `
    <div class="batch-card ${isFeatured ? 'batch-card-featured' : ''} ${isSoldOut ? 'batch-card-soldout' : ''}">

      <div class="batch-card-header">
        <div class="flex items-center justify-between mb-4">
          <span class="font-display font-black text-sm uppercase tracking-widest opacity-70">
            ${batch.label}
          </span>
          ${batchBadge(batch, isSoldOut)}
        </div>
        <p class="font-display font-black text-4xl md:text-5xl leading-none mb-1">
          ${formatCOP(batch.price)}
        </p>
        <p class="text-sm opacity-70">${batch.currency || 'COP'} por álbum</p>
      </div>

      <div class="batch-card-body">
        <div class="batch-date-row">
          <div class="batch-date-icon">📷</div>
          <div>
            <p class="batch-date-label">Límite envío de fotos</p>
            <p class="batch-date-value">${batch.deadline}</p>
          </div>
        </div>
        <div class="batch-date-row">
          <div class="batch-date-icon">📦</div>
          <div>
            <p class="batch-date-label">Entrega estimada</p>
            <p class="batch-date-value">${batch.delivery}</p>
          </div>
        </div>

        <div class="batch-spots">
          <div class="flex justify-between items-center mb-2">
            <span class="text-xs font-semibold uppercase tracking-wider opacity-70">
              Cupos disponibles
            </span>
            <span class="font-display font-black text-lg">
              ${batch.spotsLeft}/${batch.spots}
            </span>
          </div>
          <div class="batch-spots-bar">
            <div class="batch-spots-fill ${spotsColor}" style="width:${spotsPercent}%"></div>
          </div>
        </div>
      </div>

      <div class="batch-card-footer">
        ${!isSoldOut
          ? `<a href="#pedir" class="batch-cta ${isFeatured ? 'batch-cta-featured' : ''}">Pedir en este batch →</a>`
          : `<span class="batch-cta-disabled">Sin cupos disponibles</span>`
        }
      </div>

    </div>
  `
}

export function batchesSection() {
  return `
    <section id="batches" class="relative py-20 md:py-28 px-6 bg-ink text-cream">
      <div class="max-w-7xl mx-auto">

        <div class="max-w-2xl mb-12 md:mb-16">
          <p class="text-xs uppercase tracking-[0.2em] font-semibold text-cream/60 mb-4">
            Fechas de producción
          </p>
          <h2 class="font-display font-black leading-[0.95] tracking-tight text-5xl md:text-7xl">
            Elige tu<br/>
            <span class="text-sun">fecha de entrega.</span>
          </h2>
          <p class="mt-6 text-cream/80 text-lg leading-relaxed max-w-xl">
            Trabajamos por lotes para garantizar la mejor calidad. Elige el batch que se ajuste a tu fecha — cupos limitados a 50 álbumes por lote.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          ${BATCHES.map(batch => batchCard(batch)).join('')}
        </div>

        <p class="text-center text-cream/50 text-sm">
          Los cupos se asignan por orden de llegada. Una vez lleno el batch, el pedido pasa al siguiente lote disponible.
        </p>

      </div>
    </section>
  `
}
