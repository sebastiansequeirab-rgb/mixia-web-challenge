import { lazy, Suspense, useEffect, useRef } from 'react'
import { useT } from '../i18n'
import { gsap, scrollTo, ScrollTrigger } from '../lib/scroll'
import { isTouch, prefersReducedMotion } from '../lib/device'

const HeroView = lazy(() => import('../three/HeroView'))

const GRAD = ['#5ee6f0', '#8b8cf5', '#c084f0']

/** Color del degradado de marca en la posición 0→1 (por letra: el clip de fondo no sobrevive a las transformaciones). */
function gradAt(u: number) {
  const seg = u < 0.5 ? 0 : 1
  const k = (u - seg * 0.5) * 2
  const a = GRAD[seg]
  const b = GRAD[seg + 1]
  const ch = (i: number) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - k) + parseInt(b.slice(i, i + 2), 16) * k)
  return `rgb(${ch(1)}, ${ch(3)}, ${ch(5)})`
}

/** Una línea del título partida en letras (la frase entera queda en el aria-label del h1). */
function Letters({ text, grad }: { text: string; grad?: boolean }) {
  const chars = Array.from(text)
  return (
    <span className="line" aria-hidden="true">
      {chars.map((ch, i) => (
        <span className="ch" key={i} style={grad ? { color: gradAt(i / Math.max(1, chars.length - 1)) } : undefined}>
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  )
}

export function Hero({ ready }: { ready: boolean }) {
  const { t, lang } = useT()
  const root = useRef<HTMLElement>(null)
  const scroll = useRef(0)

  // Entrada: letras del título una a una, luego eyebrow, chips, texto y botones. Antes de "ready"
  // todo queda oculto (el loader tapa la pantalla).
  useEffect(() => {
    if (!root.current) return
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
      { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.1, ease: 'power4.out', stagger: 0.028 },
      0.1,
    )
    tl.fromTo(rest, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.1 }, 0.55)
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

  const [first, ...restWords] = t.hero.title.split(' ')
  const second = restWords.join(' ')

  return (
    <section id="inicio" ref={root} className="hero" aria-label={t.hero.title} onMouseMove={onMove}>
      <div className="hero-aurora" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="wrap">
        <div className="hero-copy">
          <p className="eyebrow hero-fade">{t.hero.eyebrow}</p>
          <h1 className="h-xl" aria-label={t.hero.title}>
            <Letters text={first} />
            <Letters text={second} grad />
          </h1>
          <ul className="hero-chips hero-fade" aria-label={t.stats.label}>
            {t.hero.chips.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
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
        <div className="hero-visual">
          <Suspense fallback={null}>
            <HeroView scroll={scroll} />
          </Suspense>
          <p className="hero-hint hero-fade">{isTouch ? t.hero.hintTouch : t.hero.hint}</p>
        </div>
      </div>
    </section>
  )
}
