import './style.css'
import { hero } from './sections/hero.js'
import { howItWorks } from './sections/how-it-works.js'
import { insideAlbum } from './sections/inside-album.js'
import { faq } from './sections/faq.js'
import { footer } from './sections/footer.js'
import { orderForm } from './form/form.js'
import { setupForm } from './form/submit.js'

const app = document.querySelector('#app')

app.innerHTML = `
  ${hero()}
  ${howItWorks()}
  ${insideAlbum()}
  ${faq()}
  ${orderForm()}
  ${footer()}
`

setupForm()
