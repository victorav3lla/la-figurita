import './style.css'
import { loadBatches } from './data/batches.js'
import { navbar, setupNavbar } from './components/navbar.js'
import { hero } from './sections/hero.js'
import { howItWorks } from './sections/how-it-works.js'
import { insideAlbum } from './sections/inside-album.js'
import { batchesSection } from './sections/batches.js'
import { faq } from './sections/faq.js'
import { footer } from './sections/footer.js'
import { orderForm } from './form/form.js'
import { setupForm } from './form/submit.js'
import { setupCarousel } from './components/album-carousel.js'

async function init() {
  await loadBatches()

  const app = document.querySelector('#app')
  app.innerHTML = `
    ${navbar()}
    ${hero()}
    ${howItWorks()}
    ${insideAlbum()}
    ${batchesSection()}
    ${faq()}
    ${orderForm()}
    ${footer()}
  `

  setupNavbar()
  setupForm()
  setupCarousel()
}

init()
