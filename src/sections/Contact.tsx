import { useRef } from 'react'
import { useT } from '../i18n'
import { useReveal } from '../lib/useReveal'

const EMAIL = 'miguelgarcia@mixia.org'
const WA_VE = '584242625097'
const WA_MX = '523318224606'

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M4 12 12 4M6 4h6v6" />
  </svg>
)

export function Contact() {
  const { t, lang } = useT()
  const root = useRef<HTMLElement>(null)
  useReveal(root, [lang])

  return (
    <section id="contacto" ref={root} className="contact">
      <div className="wrap contact-inner">
        <div>
          <p className="eyebrow reveal">{t.contact.eyebrow}</p>
          <h2 className="h-lg reveal">{t.contact.heading}</h2>
          <p className="lead reveal" style={{ marginTop: 24 }}>
            {t.contact.sub}
          </p>
        </div>
        <div className="contact-actions">
          <a className="reveal" href={`mailto:${EMAIL}`}>
            <span>
              {t.contact.email}
              <small>{EMAIL}</small>
            </span>
            <Arrow />
          </a>
          <a className="reveal" href={`https://wa.me/${WA_VE}`} target="_blank" rel="noopener noreferrer">
            <span>
              {t.contact.whatsapp}
              <small>+58 424 262 5097</small>
            </span>
            <Arrow />
          </a>
          <a className="reveal" href={`https://wa.me/${WA_MX}`} target="_blank" rel="noopener noreferrer">
            <span>
              {t.contact.mexico}
              <small>+52 331 822 4606</small>
            </span>
            <Arrow />
          </a>
        </div>
      </div>
    </section>
  )
}
