/**
 * Interfaz de la cuenta regresiva: pinta el estado y lo actualiza cada segundo.
 */
(() => {
  'use strict';

  const { getCountdown, prefersReducedMotion } = window.Navidad;

  const LABELS = {
    days: ['Día', 'Días'],
    hours: ['Hora', 'Horas'],
    minutes: ['Minuto', 'Minutos'],
    seconds: ['Segundo', 'Segundos']
  };

  const dateFormat = new Intl.DateTimeFormat('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  /** @param {{onChristmas?: () => void}} options Se llama al entrar al 25 de diciembre. */
  function start({ onChristmas = () => {} } = {}) {
    const section = document.getElementById('countdown-section');
    const title = document.getElementById('countdown-title');
    const dateLine = document.getElementById('countdown-date');
    const units = Object.keys(LABELS).map((name) => ({
      name,
      value: document.getElementById(`cd-${name}`),
      label: document.getElementById(`cd-${name}-label`)
    }));

    let wasChristmas = null;
    let timer;

    function renderHeading(state) {
      if (state.isChristmas !== wasChristmas) {
        wasChristmas = state.isChristmas;
        section.classList.toggle('is-christmas', state.isChristmas);
        title.textContent = state.isChristmas
          ? 'Hoy es Navidad, Viviana.'
          : 'Cada vez falta menos.';
        if (state.isChristmas) onChristmas();
      }

      const lead = state.isChristmas
        ? 'Que hoy tengas todo lo que te hace feliz.'
        : dateFormat.format(state.target);
      if (dateLine.textContent !== lead) dateLine.textContent = lead;
    }

    function renderUnit(unit, number) {
      const text = unit.name === 'days' ? String(number) : String(number).padStart(2, '0');
      if (unit.value.textContent === text) return;

      const isFirstPaint = unit.value.textContent === '–';
      unit.value.textContent = text;
      unit.label.textContent = LABELS[unit.name][number === 1 ? 0 : 1];

      if (!isFirstPaint && !prefersReducedMotion) {
        unit.value.animate(
          [{ opacity: .35, transform: 'translateY(.08em)' }, { opacity: 1, transform: 'none' }],
          { duration: 420, easing: 'cubic-bezier(.22, 1, .36, 1)' }
        );
      }
    }

    // Se recalcula desde el reloj y se alinea a cada segundo, así nunca acumula desfase.
    function tick() {
      clearTimeout(timer);
      const now = new Date();
      const state = getCountdown(now);
      renderHeading(state);
      units.forEach((unit) => renderUnit(unit, state[unit.name]));
      timer = setTimeout(tick, 1000 - now.getMilliseconds() + 8);
    }

    // Al volver a la pestaña, actualiza aunque el temporizador se haya frenado.
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) tick();
    });

    tick();
  }

  window.Navidad.Countdown = { start };
})();
