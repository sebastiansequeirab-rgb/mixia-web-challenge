import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useT } from '../i18n'
import { useReveal } from '../lib/useReveal'
import { useSectionProgress } from '../lib/useSectionProgress'
import { isTouch, prefersReducedMotion } from '../lib/device'

const ContactView = lazy(() => import('../three/ContactView'))

const EMAIL = 'miguelgarcia@mixia.org'
const WA_VE = '584242625097'
const WA_MX = '523318224606'

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M4 12 12 4M6 4h6v6" />
  </svg>
)

function useLocalTimes(lang: string) {
  const [times, setTimes] = useState({ ve: '', mx: '' })
  useEffect(() => {
    const fmt = (tz: string) =>
      new Intl.DateTimeFormat(lang === 'es' ? 'es-VE' : 'en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZone: tz,
      }).format(new Date())
    const tick = () => setTimes({ ve: fmt('America/Caracas'), mx: fmt('America/Mexico_City') })
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [lang])
  return times
}

/** Botón que se inclina hacia el cursor (solo con puntero fino y sin reduced motion). */
function Magnetic({ children, href, external }: { children: React.ReactNode; href: string; external?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isTouch || prefersReducedMotion || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width
    const dy = (e.clientY - (r.top + r.height / 2)) / r.height
    ref.current.style.transform = `translate(${dx * 14}px, ${dy * 10}px) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg)`
    ref.current.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
    ref.current.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
  }
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = ''
  }
  return (
    <a
      ref={ref}
      className="contact-card reveal"
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  )
}

export function Contact() {
  const { t, lang } = useT()
  const root = useRef<HTMLElement>(null)
  const progress = useSectionProgress(root)
  const times = useLocalTimes(lang)
  useReveal(root, [lang])

  return (
    <section id="contacto" ref={root} className="contact">
      <div className="contact-bg" aria-hidden="true">
        <Suspense fallback={null}>
          <ContactView progress={progress} />
        </Suspense>
      </div>
      <div className="wrap contact-inner">
        <div className="contact-copy">
          <p className="eyebrow reveal">{t.contact.eyebrow}</p>
          <h2 className="h-lg reveal">{t.contact.heading}</h2>
          <p className="lead reveal">{t.contact.sub}</p>
        </div>
        <div className="contact-actions">
          <Magnetic href={`mailto:${EMAIL}`}>
            <span className="contact-card-label">{t.contact.email}</span>
            <span className="contact-card-value">{EMAIL}</span>
            <span className="contact-card-meta">{t.contact.sameDay}</span>
            <Arrow />
          </Magnetic>
          <Magnetic href={`https://wa.me/${WA_VE}`} external>
            <span className="contact-card-label">{t.contact.whatsapp}</span>
            <span className="contact-card-value">+58 424 262 5097</span>
            <span className="contact-card-meta">
              {t.contact.localTime} {t.contact.caracas} · <time>{times.ve}</time>
            </span>
            <Arrow />
          </Magnetic>
          <Magnetic href={`https://wa.me/${WA_MX}`} external>
            <span className="contact-card-label">{t.contact.mexico}</span>
            <span className="contact-card-value">+52 331 822 4606</span>
            <span className="contact-card-meta">
              {t.contact.localTime} {t.contact.mexicoCity} · <time>{times.mx}</time>
            </span>
            <Arrow />
          </Magnetic>
        </div>
      </div>
    </section>
  )
}
