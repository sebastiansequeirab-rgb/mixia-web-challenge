import { useEffect, type RefObject } from 'react'
import { gsap, ScrollTrigger } from './scroll'
import { prefersReducedMotion } from './device'

/** Anima los `.reveal` dentro de `root` cuando entran en pantalla, una sola vez. */
export function useReveal(root: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useEffect(() => {
    if (!root.current || prefersReducedMotion) return
    const items = root.current.querySelectorAll<HTMLElement>('.reveal')
    const triggers: ScrollTrigger[] = []
    items.forEach((el, i) => {
      const tween = gsap.fromTo(
        el,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: 'power3.out',
          delay: (i % 4) * 0.08,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        },
      )
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
    })
    return () => triggers.forEach((t) => t.kill())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
