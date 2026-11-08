/**
 * Punto de entrada: conecta los componentes de la página.
 */
(() => {
  'use strict';

  const { Lights, Snow, Countdown, Reveal, getCountdown } = window.Navidad;

  const { target } = getCountdown(new Date());
  document.getElementById('footer-year').textContent = `Navidad ${target.getFullYear()}`;

  Lights.init();
  Snow.init();
  Reveal.init();
  // El 25 de diciembre las luces se encienden solas.
  Countdown.start({ onChristmas: () => Lights.set(true) });
})();
