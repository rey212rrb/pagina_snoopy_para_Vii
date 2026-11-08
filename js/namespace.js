/**
 * Espacio de nombres compartido por todos los scripts de la página.
 *
 * Se usan scripts clásicos y no módulos ES porque los módulos no cargan
 * al abrir index.html con doble clic (protocolo file://).
 */
window.Navidad = {
  prefersReducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches
};
