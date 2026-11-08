/**
 * Cálculo de la cuenta regresiva. Sin acceso al DOM.
 */
(() => {
  'use strict';

  /**
   * Calcula el estado de la cuenta regresiva para un instante dado,
   * en la hora local del visitante.
   *  - Del 26 de diciembre en adelante apunta a la Navidad del año siguiente.
   *  - Durante el 25 de diciembre devuelve isChristmas: true.
   *  - Los días se cuentan por calendario, así un cambio de horario no los altera.
   */
  function getCountdown(now) {
    const year = now.getFullYear();
    const isChristmas = now.getMonth() === 11 && now.getDate() === 25;
    const dayAfter = new Date(year, 11, 26);
    const target = new Date(now >= dayAfter ? year + 1 : year, 11, 25);

    if (isChristmas) {
      return { isChristmas, target, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    // Avanza desde `now` tantos días de calendario como quepan antes del objetivo.
    const atSameClock = (n) => new Date(
      now.getFullYear(), now.getMonth(), now.getDate() + n,
      now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds()
    );
    let days = Math.round(
      (Date.UTC(target.getFullYear(), target.getMonth(), target.getDate()) -
       Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())) / 864e5
    );
    if (atSameClock(days) >= target) days -= 1;

    const totalSeconds = Math.ceil((target - atSameClock(days)) / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;

    // Redondear al segundo puede completar un día justo.
    if (hours === 24) { days += 1; hours = 0; minutes = 0; seconds = 0; }

    return { isChristmas, target, days, hours, minutes, seconds };
  }

  window.Navidad.getCountdown = getCountdown;
})();
