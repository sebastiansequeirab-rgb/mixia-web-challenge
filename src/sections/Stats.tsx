import { useEffect, useRef } from 'react'
import { useT } from '../i18n'
import { gsap } from '../lib/scroll'
import { prefersReducedMotion } from '../lib/device'

function format(n: number, lang: string) {
  return new Intl.NumberFormat(lang === 'es' ? 'es-VE' : 'en-US').format(Math.round(n))
}

/** Glifo animado por cifra, en el mismo orden que el diccionario: años, países, equipos, conexiones. */
function Glyph({ i }: { i: number }) {
  if (i === 0) return <i className="stat-glyph ring" />
  if (i === 1)
    return (
      <i className="stat-glyph dots">
        {[0, 1, 2, 3, 4, 5].map((d) => (
          <b key={d} style={{ ['--d' as string]: d }} />
        ))}
      </i>
    )
  if (i === 2)
    return (
      <i className="stat-glyph lock">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <rect x="5" y="10" width="14" height="11" rx="2.5" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          <circle cx="12" cy="15.5" r="1.3" fill="currentColor" stroke="none" />
        </svg>
      </i>
    )
  return (
    <i className="stat-glyph bars">
      {[0, 1, 2, 3, 4].map((d) => (
        <b key={d} style={{ ['--d' as string]: d }} />
      ))}
    </i>
  )
}

/**
 * Banda de cifras: los números cuentan al entrar, una línea de pulsos cruza detrás y la cifra
 * de conexiones por segundo sigue latiendo (±25) como un monitor en vivo.
 */
export function Stats() {
  const { t, lang } = useT()
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!root.current || prefersReducedMotion) return
    const nums = root.current.querySelectorAll<HTMLElement>('.stat b')
    const tweens = Array.from(nums).map((el, i) => {
      const target = Number(el.dataset.value)
      const suffix = el.dataset.suffix ?? ''
      const obj = { v: 0 }
      return gsap.to(obj, {
        v: target,
        duration: 2 + i * 0.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 85%', once: true },
        onUpdate: () => {
          el.textContent = format(obj.v, lang) + suffix
        },
        onComplete: () => {
          // La última cifra (conexiones/s) late como un monitor en vivo.
          if (el.dataset.live !== undefined) {
            const tick = () => {
              el.textContent = format(target + (Math.random() - 0.5) * 50, lang) + suffix
            }
            el.dataset.timer = String(window.setInterval(tick, 900))
          }
        },
      })
    })
    return () => {
      tweens.forEach((tw) => tw.kill())
      nums.forEach((el) => {
        if (el.dataset.timer) window.clearInterval(Number(el.dataset.timer))
      })
    }
  }, [lang])

  return (
    <section ref={root} className="stats" aria-label={t.stats.label}>
      <div className="wrap">
        <div className="stats-band">
          <svg className="stats-pulse" viewBox="0 0 1200 160" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="pulse-grad" x1="0" x2="1">
                <stop offset="0" stopColor="#5ee6f0" stopOpacity="0" />
                <stop offset="0.2" stopColor="#5ee6f0" />
                <stop offset="0.5" stopColor="#8b8cf5" />
                <stop offset="0.8" stopColor="#c084f0" />
                <stop offset="1" stopColor="#c084f0" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              className="pulse-base"
              d="M0 80 H220 l14 -26 l14 52 l14 -40 l14 14 H520 l10 -18 l12 36 l12 -30 l10 12 H860 l14 -30 l14 60 l14 -46 l14 16 H1200"
            />
            <path
              className="pulse-glow"
              d="M0 80 H220 l14 -26 l14 52 l14 -40 l14 14 H520 l10 -18 l12 36 l12 -30 l10 12 H860 l14 -30 l14 60 l14 -46 l14 16 H1200"
            />
          </svg>
          <ul className="stats-line">
            {t.stats.items.map((s, i) => (
              <li className="stat" key={s.label} style={{ ['--i' as string]: i }}>
                <Glyph i={i} />
                <b data-value={s.value} data-suffix={s.suffix} {...(i === 3 ? { 'data-live': '' } : {})}>
                  {prefersReducedMotion ? format(s.value, lang) + s.suffix : '0'}
                </b>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
