import { useEffect, useRef } from 'react'
import { View } from '@react-three/drei'
import { useT } from '../i18n'
import { gsap, scrollTo, ScrollTrigger } from '../lib/scroll'
import { isTouch, prefersReducedMotion } from '../lib/device'
import { BrainScene } from '../three/BrainScene'

export function Hero({ ready }: { ready: boolean }) {
  const { t, lang } = useT()
  const root = useRef<HTMLElement>(null)
  const visual = useRef<HTMLDivElement>(null)
  const scroll = useRef(0)

  // Entrada: título línea por línea, luego texto y botones. Antes de "ready" todo queda oculto
  // (el loader tapa la pantalla).
  useEffect(() => {
    if (!root.current) return
    const lines = root.current.querySelectorAll<HTMLElement>('.h-xl .line > span')
    const rest = root.current.querySelectorAll<HTMLElement>('.hero-fade')
    if (prefersReducedMotion) {
      gsap.set([lines, rest], { clearProps: 'all' })
      return
    }
    if (!ready) {
      gsap.set(lines, { yPercent: 110 })
      gsap.set(rest, { opacity: 0, y: 18 })
      return
    }
    const tl = gsap.timeline()
    tl.fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 1.3, ease: 'power4.out', stagger: 0.12 }, 0.1)
    tl.fromTo(rest, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.1 }, 0.6)
    return () => {
      tl.kill()
    }
  }, [ready, lang])

  // Progreso del scroll del hero, lo lee la escena 3D.
  useEffect(() => {
    if (!root.current) return
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        scroll.current = self.progress
      },
    })
    return () => st.kill()
  }, [])

  const titleLines = t.hero.title.split(' ')
  const first = titleLines.slice(0, 1).join(' ')
  const second = titleLines.slice(1).join(' ')

  return (
    <section id="inicio" ref={root} className="hero" aria-label={t.hero.title}>
      <div className="wrap">
        <div className="hero-copy">
          <p className="eyebrow hero-fade">{t.hero.eyebrow}</p>
          <h1 className="h-xl">
            <span className="line">
              <span>{first}</span>
            </span>
            <span className="line">
              <span className="grad-text">{second}</span>
            </span>
          </h1>
          <p className="lead hero-fade">{t.hero.sub}</p>
          <div className="hero-actions hero-fade">
            <a
              className="btn btn-primary"
              href="#productos"
              onClick={(e) => {
                e.preventDefault()
                scrollTo('#productos')
              }}
            >
              {t.hero.cta1}
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M8 3v10M3.5 8.5 8 13l4.5-4.5" />
              </svg>
            </a>
            <a
              className="btn btn-ghost"
              href="#contacto"
              onClick={(e) => {
                e.preventDefault()
                scrollTo('#contacto')
              }}
            >
              {t.hero.cta2}
            </a>
          </div>
        </div>
        <div className="hero-visual" ref={visual}>
          <View className="view" style={{ width: '100%', height: '100%' }}>
            <BrainScene scroll={scroll} />
          </View>
          <p className="hero-hint hero-fade">{isTouch ? t.hero.hintTouch : t.hero.hint}</p>
        </div>
      </div>
      <div className="hero-scroll hero-fade" aria-hidden="true">
        <i />
        {t.hero.scroll}
      </div>
    </section>
  )
}
