import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useT } from '../i18n'
import { useReveal } from '../lib/useReveal'
import { useSectionProgress } from '../lib/useSectionProgress'
import { isTouch, prefersReducedMotion } from '../lib/device'
import { EMAIL, WA_MX, WA_VE } from '../lib/contact'

const ContactView = lazy(() => import('../three/ContactView'))

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

/** Tarjeta que se inclina hacia el cursor (solo con puntero fino y sin reduced motion). */
function Magnetic({ children, href, external }: { children: React.ReactNode; href: string; external?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isTouch || prefersReducedMotion || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width
    const dy = (e.clientY - (r.top + r.height / 2)) / r.height
    ref.current.style.transform = `translate(${dx * 10}px, ${dy * 8}px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg)`
    ref.current.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
    ref.current.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
  }
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = ''
  }
  return (
    <a
      ref={ref}
      className="contact-card"
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  )
}

/**
 * Flujo de contacto en tres pasos (interés → datos → enviar) que termina abriendo WhatsApp o el
 * correo con el mensaje ya escrito. Los CTA de productos llegan con el interés marcado.
 */
function Flow() {
  const { t } = useT()
  const f = t.contact.flow
  const [step, setStep] = useState(0)
  const [interest, setInterest] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onInterest = (e: Event) => {
      const id = (e as CustomEvent<string>).detail
      if (f.interests.some((i) => i.id === id)) {
        setInterest(id)
        setStep(1)
      }
    }
    window.addEventListener('mixia:interest', onInterest)
    return () => window.removeEventListener('mixia:interest', onInterest)
  }, [f.interests])

  useEffect(() => {
    if (step === 1) nameRef.current?.focus({ preventScroll: true })
  }, [step])

  const chosen = f.interests.find((i) => i.id === interest)
  const message = f.message
    .replace('{name}', name.trim())
    .replace('{interest}', chosen ? `${chosen.label} (${chosen.hint})` : '')
    .replace('{email}', email.trim())
  const valid = name.trim().length > 1 && /.+@.+\..+/.test(email)
  const wa = `https://wa.me/${WA_VE}?text=${encodeURIComponent(message)}`
  const mail = `mailto:${EMAIL}?subject=${encodeURIComponent(chosen?.label ?? 'Mixia')}&body=${encodeURIComponent(message)}`

  return (
    <div className="flow" data-step={step}>
      <ol className="flow-steps" aria-label={f.steps.join(' · ')}>
        {f.steps.map((label, i) => (
          <li key={label} className={i === step ? 'is-current' : i < step ? 'is-done' : undefined}>
            <i />
            <span>{label}</span>
          </li>
        ))}
      </ol>
      <div className="flow-track">
        <div className="flow-panel" aria-hidden={step !== 0}>
          <p className="flow-ask">{f.ask}</p>
          <div className="flow-interests" role="radiogroup" aria-label={f.ask}>
            {f.interests.map((it) => (
              <button
                key={it.id}
                type="button"
                role="radio"
                aria-checked={interest === it.id}
                className={`flow-interest ${it.id}${interest === it.id ? ' is-on' : ''}`}
                tabIndex={step === 0 ? 0 : -1}
                onClick={() => {
                  setInterest(it.id)
                  setStep(1)
                }}
              >
                <strong>{it.label}</strong>
                <small>{it.hint}</small>
              </button>
            ))}
          </div>
        </div>
        <form
          className="flow-panel"
          aria-hidden={step !== 1}
          onSubmit={(e) => {
            e.preventDefault()
            if (valid) setStep(2)
          }}
        >
          <label>
            <span>{f.name}</span>
            <input
              ref={nameRef}
              type="text"
              value={name}
              placeholder={f.namePh}
              autoComplete="name"
              required
              tabIndex={step === 1 ? 0 : -1}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            <span>{f.email}</span>
            <input
              type="email"
              value={email}
              placeholder={f.emailPh}
              autoComplete="email"
              required
              tabIndex={step === 1 ? 0 : -1}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <div className="flow-nav">
            <button type="button" className="btn btn-ghost" tabIndex={step === 1 ? 0 : -1} onClick={() => setStep(0)}>
              {f.back}
            </button>
            <button type="submit" className="btn btn-primary" disabled={!valid} tabIndex={step === 1 ? 0 : -1}>
              {f.next}
            </button>
          </div>
        </form>
        <div className="flow-panel" aria-hidden={step !== 2}>
          <p className="flow-ask">{f.summary}</p>
          <blockquote className="flow-message">{message}</blockquote>
          <div className="flow-nav">
            <button type="button" className="btn btn-ghost" tabIndex={step === 2 ? 0 : -1} onClick={() => setStep(1)}>
              {f.back}
            </button>
            <a
              className="btn btn-wa"
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={step === 2 ? 0 : -1}
            >
              {f.sendWa}
              <Arrow />
            </a>
            <a className="btn btn-ghost" href={mail} tabIndex={step === 2 ? 0 : -1}>
              {f.sendMail}
            </a>
          </div>
        </div>
      </div>
    </div>
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
      <div className="wrap contact-grid">
        <div className="contact-copy">
          <p className="eyebrow reveal">{t.contact.eyebrow}</p>
          <h2 className="h-lg reveal">{t.contact.heading}</h2>
          <p className="lead reveal">{t.contact.sub}</p>
        </div>
        <div className="contact-flow reveal">
          <Flow />
        </div>
        <div className="contact-direct">
          <p className="contact-direct-label reveal">{t.contact.flow.direct}</p>
          <div className="contact-actions">
            <div className="reveal">
              <Magnetic href={`mailto:${EMAIL}`}>
                <span className="contact-card-label">{t.contact.email}</span>
                <span className="contact-card-value">{EMAIL}</span>
                <span className="contact-card-meta">{t.contact.sameDay}</span>
                <Arrow />
              </Magnetic>
            </div>
            <div className="reveal">
              <Magnetic href={`https://wa.me/${WA_VE}`} external>
                <span className="contact-card-label">{t.contact.whatsapp}</span>
                <span className="contact-card-value">+58 424 262 5097</span>
                <span className="contact-card-meta">
                  {t.contact.localTime} {t.contact.caracas} · <time>{times.ve}</time>
                </span>
                <Arrow />
              </Magnetic>
            </div>
            <div className="reveal">
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
        </div>
      </div>
    </section>
  )
}
