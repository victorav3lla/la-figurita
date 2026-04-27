export function footer() {
  const year = new Date().getFullYear()

  return `
    <footer class="relative py-16 px-6 bg-ink text-cream">
      <div class="max-w-7xl mx-auto">

        <!-- Top: brand + nav -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

          <!-- Brand -->
          <div class="md:col-span-1">
            <p class="font-display font-black text-3xl mb-4">La Figurita</p>
            <p class="text-cream/70 leading-relaxed max-w-xs">
              Álbumes de láminas personalizados con las fotos que más quieres.
            </p>
          </div>

          <!-- Nav -->
          <div>
            <p class="text-xs uppercase tracking-[0.2em] font-semibold text-cream/60 mb-4">
              Navegar
            </p>
            <ul class="space-y-2">
              <li><a href="#como-funciona" class="hover:text-tomato transition">Cómo funciona</a></li>
              <li><a href="#el-album" class="hover:text-tomato transition">El álbum por dentro</a></li>
              <li><a href="#faq" class="hover:text-tomato transition">Preguntas frecuentes</a></li>
              <li><a href="#pedir" class="hover:text-tomato transition">Pedir</a></li>
            </ul>
          </div>

          <!-- Contacto -->
          <div>
            <p class="text-xs uppercase tracking-[0.2em] font-semibold text-cream/60 mb-4">
              Contacto
            </p>
            <ul class="space-y-2">
              <li>
                <a href="https://wa.me/573019295928" target="_blank" rel="noopener" class="hover:text-tomato transition inline-flex items-center gap-2">
                  WhatsApp
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
              <li>
                <a href="mailto:hola@lafigurita.co" class="hover:text-tomato transition">
                  hola@lafigurita.co
                </a>
              </li>
              <li>
                <a href="https://instagram.com/lafigurita" target="_blank" rel="noopener" class="hover:text-tomato transition inline-flex items-center gap-2">
                  Instagram
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        <!-- Bottom -->
        <div class="pt-8 border-t border-cream/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm text-cream/60">
          <p>© ${year} La Figurita. Hecho con cariño en Bogotá.</p>
          <p>Álbumes coleccionables personalizados.</p>
        </div>

      </div>
    </footer>
  `
}
