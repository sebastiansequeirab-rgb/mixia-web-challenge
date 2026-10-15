import { useEffect, useRef } from 'react'
import { useT } from '../i18n'
import { gsap } from '../lib/scroll'
import { prefersReducedMotion } from '../lib/device'

function format(n: number, lang: string) {
  return new Intl.NumberFormat(lang === 'es' ? 'es-VE' : 'en-US').format(Math.round(n))
}

export function Stats() {
  const { t, lang } = useT()
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!root.current) return
    const nums = root.current.querySelectorAll<HTMLElement>('.stat b')
    if (prefersReducedMotion) return
    const tweens = Array.from(nums).map((el) => {
      const target = Number(el.dataset.value)
      const suffix = el.dataset.suffix ?? ''
      const obj = { v: 0 }
      return gsap.to(obj, {
        v: target,
        duration: 1.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        onUpdate: () => {
          el.textContent = format(obj.v, lang) + suffix
        },
      })
    })
    return () => tweens.forEach((tw) => tw.kill())
  }, [lang])

  return (
    <section ref={root} className="stats" aria-label={t.stats.label}>
      <div className="wrap">
        <ul className="stats-line">
          {t.stats.items.map((s) => (
            <li className="stat" key={s.label}>
              <b data-value={s.value} data-suffix={s.suffix}>
                {prefersReducedMotion ? format(s.value, lang) + s.suffix : '0'}
              </b>
              <span>{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
