import { animatedBg } from '../components/animated-bg.js'

export function hero() {
  return `
    <section class="relative overflow-hidden">
      ${animatedBg()}
      <div class="bg-cream-overlay"></div>

      <div class="hero-content px-6 pt-8 pb-20 md:pt-10 md:pb-28">
        <div class="max-w-7xl mx-auto">

          <!-- Nav -->
          <nav class="flex items-center justify-between mb-12 md:mb-16">
            <a href="#" class="font-display font-black text-xl tracking-tight text-ink">
              La Figurita
            </a>
            <div class="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="#ediciones" class="hover:text-tomato transition">Ediciones</a>
              <a href="#como-funciona" class="hover:text-tomato transition">Cómo funciona</a>
              <a href="#faq" class="hover:text-tomato transition">FAQ</a>
              <a href="#pedir" class="bg-ink text-cream px-5 py-2 rounded-full hover:bg-tomato transition">
                Pedir
              </a>
            </div>
          </nav>

          <!-- Layout 2 columnas -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            <!-- Columna izquierda: texto -->
            <div>
              <div class="inline-flex items-center gap-2 mb-6 bg-cream/80 backdrop-blur-sm px-4 py-2 rounded-full border border-ink/10">
                <span class="w-2 h-2 bg-tomato rounded-full animate-pulse"></span>
                <p class="text-xs uppercase tracking-[0.2em] font-semibold text-ink-soft">
                  Álbumes coleccionables personalizados
                </p>
              </div>

              <h1 class="font-display font-black text-ink leading-[0.92] tracking-tight mb-6">
                <span class="block text-5xl md:text-7xl lg:text-8xl">Tus fotos,</span>
                <span class="block text-5xl md:text-7xl lg:text-8xl">tu propio</span>
                <span class="block text-5xl md:text-7xl lg:text-8xl text-tomato">álbum.</span>
              </h1>

              <p class="text-lg text-ink max-w-lg mb-8 leading-relaxed">
                Convertimos las fotos que más quieres en un álbum de láminas
                personalizado. <span class="font-semibold">16 páginas, 40 figuritas únicas.</span>
              </p>

              <div class="flex flex-wrap gap-3 mb-10">
                <a href="#pedir" class="font-display font-bold bg-ink text-cream px-7 py-3.5 rounded-full hover:bg-tomato transition inline-flex items-center gap-2">
                  Pedir el mío
                  <span aria-hidden="true">→</span>
                </a>
                <a href="#ediciones" class="font-display font-bold border-2 border-ink text-ink bg-cream/70 backdrop-blur-sm px-7 py-3.5 rounded-full hover:bg-sun transition">
                  Ver ediciones
                </a>
              </div>

              <!-- Stats compactos -->
              <div class="grid grid-cols-4 gap-4 max-w-md">
                <div>
                  <p class="font-display font-black text-3xl text-ink leading-none">16</p>
                  <p class="text-[10px] uppercase tracking-wider text-ink-soft mt-1.5">Páginas</p>
                </div>
                <div>
                  <p class="font-display font-black text-3xl text-ink leading-none">40</p>
                  <p class="text-[10px] uppercase tracking-wider text-ink-soft mt-1.5">Láminas</p>
                </div>
                <div>
                  <p class="font-display font-black text-3xl text-ink leading-none">3</p>
                  <p class="text-[10px] uppercase tracking-wider text-ink-soft mt-1.5">Ediciones</p>
                </div>
                <div>
                  <p class="font-display font-black text-3xl text-ink leading-none">∞</p>
                  <p class="text-[10px] uppercase tracking-wider text-ink-soft mt-1.5">Recuerdos</p>
                </div>
              </div>
            </div>

            <!-- Columna derecha: álbum -->
            <div class="relative flex items-center justify-center">
              <div class="album-stage">
                <div class="album-shadow"></div>
                <div class="album">
                  <img
                    src="/images/album-papa.png?v=1"
                    alt="Álbum personalizado La Figurita - Edición Papá"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                  />
                  <div class="album-fallback" style="display: none;">
                    <span class="font-display font-black">LA FIGURITA</span>
                    <span class="album-fallback-sub">Tu álbum aquí</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  `
}
