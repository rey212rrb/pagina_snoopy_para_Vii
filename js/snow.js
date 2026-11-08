/**
 * Nieve: un solo canvas con un sprite pre-renderizado y un bucle que se
 * detiene cuando no hay nada que dibujar o la pestaña está oculta.
 */
(() => {
  'use strict';

  const { prefersReducedMotion } = window.Navidad;

  const FADE_SECONDS = .8;
  const MAX_FRAME_SECONDS = .05;   // Evita saltos de los copos tras una pausa
  const AREA_PER_FLAKE = 15000;
  const MIN_FLAKES = 36;
  const MAX_FLAKES = 130;
  const RESIZE_DEBOUNCE_MS = 150;

  let canvas, ctx, sprite, buttons;
  let width = 0;
  let height = 0;
  let flakes = [];
  let active = false;    // Estado pedido por el botón
  let opacity = 0;       // Opacidad global: se desvanece al apagar y al encender
  let frame = 0;
  let lastTime = 0;

  function createSprite() {
    const size = 32;
    const image = document.createElement('canvas');
    image.width = image.height = size;
    const c = image.getContext('2d');
    const gradient = c.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(.45, 'rgba(255,255,255,.75)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = gradient;
    c.fillRect(0, 0, size, size);
    return image;
  }

  function targetCount() {
    return Math.max(MIN_FLAKES, Math.min(MAX_FLAKES, Math.round(width * height / AREA_PER_FLAKE)));
  }

  function createFlake(y) {
    const depth = Math.random();   // 0 = lejos, 1 = cerca
    return {
      x: Math.random() * width,
      y,
      size: 2.5 + depth * 6.5,
      speed: 22 + depth * 58,
      alpha: .3 + depth * .55,
      sway: 8 + Math.random() * 22,
      swaySpeed: .3 + Math.random() * .7,
      phase: Math.random() * Math.PI * 2
    };
  }

  /** Completa la cantidad de copos, repartidos por toda la pantalla. */
  function fillFlakes() {
    const target = targetCount();
    while (flakes.length < target) flakes.push(createFlake(Math.random() * height));
    flakes.length = target;
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (active) fillFlakes();
  }

  function draw(time) {
    const elapsed = (time - lastTime) / 1000;
    const dt = Math.min(elapsed, MAX_FRAME_SECONDS);
    lastTime = time;
    ctx.clearRect(0, 0, width, height);

    // El desvanecimiento usa tiempo real: dura lo mismo aunque el equipo vaya lento.
    const step = elapsed / FADE_SECONDS;
    opacity = active ? Math.min(1, opacity + step) : Math.max(0, opacity - step);

    // Ya desvanecida: libera los copos y detiene el bucle.
    if (!active && opacity === 0) {
      flakes = [];
      frame = 0;
      return;
    }

    for (const flake of flakes) {
      flake.y += flake.speed * dt;
      flake.phase += flake.swaySpeed * dt;
      if (flake.y > height + flake.size) Object.assign(flake, createFlake(-flake.size));

      ctx.globalAlpha = flake.alpha * opacity;
      ctx.drawImage(sprite, flake.x + Math.sin(flake.phase) * flake.sway, flake.y, flake.size, flake.size);
    }

    frame = requestAnimationFrame(draw);
  }

  function run() {
    if (frame || document.hidden || !flakes.length) return;
    lastTime = performance.now();
    frame = requestAnimationFrame(draw);
  }

  function pause() {
    cancelAnimationFrame(frame);
    frame = 0;
  }

  function set(on) {
    active = on;
    if (on) {
      fillFlakes();
      run();
    }
    buttons.forEach((button) => {
      button.querySelector('[data-label]').textContent = on ? 'Detener la nieve' : 'Hacer nevar';
    });
  }

  function init() {
    canvas = document.getElementById('snow');
    ctx = canvas.getContext('2d');
    buttons = document.querySelectorAll('[data-toggle="snow"]');
    sprite = createSprite();
    resize();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, RESIZE_DEBOUNCE_MS);
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) pause(); else run();
    });
    buttons.forEach((button) => button.addEventListener('click', () => set(!active)));

    // Quien prefiere menos movimiento empieza sin nieve y puede activarla.
    set(!prefersReducedMotion);
  }

  window.Navidad.Snow = { init };
})();
