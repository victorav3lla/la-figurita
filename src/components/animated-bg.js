let ballCounter = 0

export function animatedBg() {
  return `
    <div class="animated-bg" aria-hidden="true">
      <div class="ball ball-1">${soccerBall()}</div>
      <div class="ball ball-2">${soccerBall()}</div>
      <div class="ball ball-3">${soccerBall()}</div>
      <div class="ball ball-4">${soccerBall()}</div>
      <div class="ball ball-5">${soccerBall()}</div>
      <div class="ball ball-6">${soccerBall()}</div>
    </div>
  `
}

function soccerBall() {
  const id = `b${++ballCounter}`
  return `
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="${id}-clip">
          <circle cx="32" cy="32" r="30"/>
        </clipPath>
        <polygon id="${id}-pent"
                 points="32,14 25.34,9.16 27.89,1.34 36.11,1.34 38.66,9.16"
                 fill="#0F0F0F"/>
        <line id="${id}-conn"
              x1="32" y1="23" x2="32" y2="14"
              stroke="#0F0F0F" stroke-width="1.6" stroke-linecap="round"/>
      </defs>

      <!-- Borde del balón -->
      <circle cx="32" cy="32" r="30" fill="white"
              stroke="#0F0F0F" stroke-width="2.5"/>

      <!-- Pentágono central + 5 pentágonos exteriores (clipeados al círculo) -->
      <g clip-path="url(#${id}-clip)">
        <polygon points="32,23 40.56,29.22 37.29,39.28 26.71,39.28 23.44,29.22"
                 fill="#0F0F0F"/>
        <use href="#${id}-pent"/>
        <use href="#${id}-pent" transform="rotate(72 32 32)"/>
        <use href="#${id}-pent" transform="rotate(144 32 32)"/>
        <use href="#${id}-pent" transform="rotate(216 32 32)"/>
        <use href="#${id}-pent" transform="rotate(288 32 32)"/>
      </g>

      <!-- Líneas que conectan central con exteriores -->
      <use href="#${id}-conn"/>
      <use href="#${id}-conn" transform="rotate(72 32 32)"/>
      <use href="#${id}-conn" transform="rotate(144 32 32)"/>
      <use href="#${id}-conn" transform="rotate(216 32 32)"/>
      <use href="#${id}-conn" transform="rotate(288 32 32)"/>
    </svg>
  `
}
