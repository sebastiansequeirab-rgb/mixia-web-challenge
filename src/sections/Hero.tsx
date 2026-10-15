import { lazy, Suspense, useEffect, useRef } from 'react'
import { useT } from '../i18n'
import { gsap, scrollTo, ScrollTrigger } from '../lib/scroll'
import { isTouch, prefersReducedMotion } from '../lib/device'
import { heroState } from '../three/heroState'

const HeroView = lazy(() => import('../three/HeroView'))

/** Una palabra del título en su propia línea, partida en letras para la entrada. */
function Word({ text, light }: { text: string; light?: boolean }) {
  return (
    <span className={`line${light ? ' light' : ''}`} aria-hidden="true">
      {Array.from(text).map((ch, i) => (
        <span className="ch" key={i}>
          {ch}
        </span>
      ))}
    </span>
  )
}

export function Hero({ ready }: { ready: boolean }) {
  const { t, lang } = useT()
  const root = useRef<HTMLElement>(null)
  const scroll = useRef(0)

  // Entrada: letras del título una a una, luego texto y botones. Antes de "ready" todo queda
  // oculto (el loader tapa la pantalla). El isotipo se arma a la vez (heroState.ready).
  useEffect(() => {
    if (!root.current) return
    heroState.ready = ready
    const chars = root.current.querySelectorAll<HTMLElement>('.h-xl .ch')
    const rest = root.current.querySelectorAll<HTMLElement>('.hero-fade')
    if (prefersReducedMotion) {
      gsap.set([chars, rest], { clearProps: 'all' })
      return
    }
    if (!ready) {
      gsap.set(chars, { yPercent: 120, rotateX: -60, opacity: 0 })
      gsap.set(rest, { opacity: 0, y: 18 })
      return
    }
    const tl = gsap.timeline()
    tl.fromTo(
      chars,
      { yPercent: 120, rotateX: -60, opacity: 0 },
      { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.1, ease: 'power4.out', stagger: 0.03 },
      0.4,
    )
    tl.fromTo(rest, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12 }, 1.1)
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

  // Parallax suave del texto y la aurora con el cursor (solo puntero fino).
  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (isTouch || prefersReducedMotion) return
    const el = e.currentTarget
    const x = e.clientX / window.innerWidth - 0.5
    const y = e.clientY / window.innerHeight - 0.5
    el.style.setProperty('--px', x.toFixed(3))
    el.style.setProperty('--py', y.toFixed(3))
  }

  const [first, ...rest] = t.hero.title.split(' ')

  return (
    <section id="inicio" ref={root} className="hero" aria-label={t.hero.title} onMouseMove={onMove}>
      <div className="hero-aurora" aria-hidden="true">
        <i />
        <i />
      </div>
      <div className="wrap">
        <div className="hero-copy">
          <h1 className="h-xl" aria-label={t.hero.title}>
            <Word text={first} />
            {rest.map((w) => (
              <Word key={w} text={w} light />
            ))}
          </h1>
          <p className="lead hero-fade">{t.hero.sub}</p>
          <p className="hero-facts hero-fade">{t.hero.chips.join('  ·  ')}</p>
          <div className="hero-actions hero-fade">
            <a
              className="btn btn-accent"
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
              className="link-arrow"
              href="#contacto"
              onClick={(e) => {
                e.preventDefault()
                scrollTo('#contacto')
              }}
            >
              {t.hero.cta2}
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </a>
          </div>
        </div>
        <div
          className="hero-visual"
          onPointerDown={() => {
            heroState.pulseRequested = true
          }}
        >
          <Suspense fallback={null}>
            <HeroView scroll={scroll} />
          </Suspense>
          <p className="hero-hint hero-fade">{isTouch ? t.hero.hintTouch : t.hero.hint}</p>
        </div>
      </div>
    </section>
  )
}
