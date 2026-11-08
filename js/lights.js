/**
 * Luces navideñas: genera los focos sobre cada guirnalda y controla
 * el estado encendido / apagado de toda la página.
 */
(() => {
  'use strict';

  const COLORS = ['#ff5b52', '#ffd27a', '#5fd39a', '#fff1d6'];
  const MAX_DELAY_MS = 1100;
  const DELAY_STEP_MS = 26;

  const TEXT = {
    on:  { button: 'Apagar las luces',   hint: 'Ahora sí: ya es Navidad.' },
    off: { button: 'Encender las luces', hint: 'Snoopy y sus amigos ya están listos. Solo faltan las luces.' }
  };

  // Guirnaldas: id del trazo, id de la capa de focos, separación y escala.
  const GARLANDS = [
    ['hero-garland', 'hero-bulbs', 66, 2.1],
    ['tree-left', 'left-bulbs', 25, .82],
    ['tree-right', 'right-bulbs', 25, .82],
    ['letter-garland', 'letter-bulbs', 26, 1.1]
  ];

  let buttons = [];
  let hint = null;
  let isOn = false;
  let bulbIndex = 0;

  function bulbMarkup(point, scale) {
    const colorIndex = bulbIndex % COLORS.length;
    const delay = Math.min(bulbIndex * DELAY_STEP_MS, MAX_DELAY_MS);
    const twinkle = bulbIndex % 3 === 0 ? ' bulb--twinkle' : '';
    bulbIndex++;

    return `
      <g class="bulb${twinkle}" transform="translate(${point.x.toFixed(1)} ${point.y.toFixed(1)}) scale(${scale})"
         style="--c:${COLORS[colorIndex]};--delay:${delay}ms">
        <circle class="bulb__halo" cy="7" r="21" fill="url(#glow-${colorIndex})"/>
        <rect class="bulb__socket" x="-2.6" y="-1.5" width="5.2" height="5" rx="1"/>
        <ellipse class="bulb__lamp" cy="9" rx="4.6" ry="6.4"/>
      </g>`;
  }

  /** Coloca focos a distancia regular sobre un trazo SVG. */
  function stringBulbs(pathId, layerId, spacing, scale) {
    const path = document.getElementById(pathId);
    const layer = document.getElementById(layerId);
    const length = path.getTotalLength();
    const count = Math.max(2, Math.round(length / spacing));
    let markup = '';

    for (let i = 0; i < count; i++) {
      markup += bulbMarkup(path.getPointAtLength((i + .5) * length / count), scale);
    }
    layer.insertAdjacentHTML('beforeend', markup);
  }

  function set(on) {
    isOn = on;
    const text = on ? TEXT.on : TEXT.off;
    document.documentElement.dataset.lights = on ? 'on' : 'off';
    buttons.forEach((button) => {
      button.querySelector('[data-label]').textContent = text.button;
    });
    hint.textContent = text.hint;
  }

  function init() {
    buttons = document.querySelectorAll('[data-toggle="lights"]');
    hint = document.querySelector('[data-hint]');
    GARLANDS.forEach((garland) => stringBulbs(...garland));
    buttons.forEach((button) => button.addEventListener('click', () => set(!isOn)));
  }

  window.Navidad.Lights = { init, set };
})();
