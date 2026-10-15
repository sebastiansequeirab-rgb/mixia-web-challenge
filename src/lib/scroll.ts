import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from './device'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

/** Un solo motor de scroll: Lenis mueve la página y alimenta a ScrollTrigger. */
export function initScroll() {
  if (lenis || prefersReducedMotion) return null
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis?.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function scrollTo(target: string | number) {
  if (lenis) lenis.scrollTo(target, { offset: typeof target === 'number' ? 0 : -72 })
  else if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' })
  else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
}

export { gsap, ScrollTrigger }
