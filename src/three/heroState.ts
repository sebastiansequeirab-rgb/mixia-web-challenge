/**
 * Estado compartido del isotipo del hero, leído cada frame por el cerebro y la M (sin React).
 * - `assemble` 0→1: las partículas vienen del caos y se arman en el logo al cargar.
 * - `pulseAt`: momento del último clic; dispara una onda que recorre la red.
 */
export const heroState = {
  ready: false,
  readyAt: 0,
  assemble: 0,
  pulseAt: -100,
  pulseRequested: false,
}
