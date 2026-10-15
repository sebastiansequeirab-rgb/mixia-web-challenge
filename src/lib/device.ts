/** Capacidades del dispositivo, evaluadas una vez. Deciden cuánto 3D cargamos. */

const hasWindow = typeof window !== 'undefined'

export const isTouch = hasWindow && window.matchMedia('(pointer: coarse)').matches

export const prefersReducedMotion = hasWindow && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Móvil o tablet: menos partículas, sin vidrio con refracción. */
export const lowPower = isTouch || (hasWindow && window.innerWidth < 820)

export const dpr: [number, number] = lowPower ? [1, 1.5] : [1, 2]
