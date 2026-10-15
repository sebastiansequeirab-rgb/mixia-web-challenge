/** Matemática de la sección fijada de productos. Sin dependencias: la usan el DOM y el 3D. */

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x))
/** Igual a THREE.MathUtils.smoothstep(x, min, max). */
const smooth = (x: number, min: number, max: number) => {
  if (x <= min) return 0
  if (x >= max) return 1
  const t = (x - min) / (max - min)
  return t * t * (3 - 2 * t)
}

/** Cuántos productos reparte el escenario y en qué orden. */
export const STAGE_COUNT = 3
/** Medio ancho (en progreso 0→1) del cruce entre un producto y el siguiente. */
export const STAGE_FADE = 0.055

/** Peso 0→1 del producto `i` para el progreso `p` del escenario completo. */
export function stageWeight(i: number, p: number) {
  const a = i / STAGE_COUNT
  const b = (i + 1) / STAGE_COUNT
  const enter = i === 0 ? 1 : smooth(p, a - STAGE_FADE, a + STAGE_FADE)
  const exit = i === STAGE_COUNT - 1 ? 0 : smooth(p, b - STAGE_FADE, b + STAGE_FADE)
  return enter * (1 - exit)
}

/** Progreso local 0→1 dentro del tramo del producto `i`. */
export function stageLocal(i: number, p: number) {
  return clamp(p * STAGE_COUNT - i, 0, 1)
}

/** 0→1 en la segunda mitad del tramo de Mixia Lock: ahí el teléfono se abre en capas. */
export function stageExplode(p: number) {
  const exit = smooth(p, 2 / STAGE_COUNT - STAGE_FADE, 2 / STAGE_COUNT + STAGE_FADE)
  return smooth(stageLocal(1, p), 0.4, 0.72) * (1 - exit)
}
