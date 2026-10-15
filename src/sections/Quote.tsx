import { useRef } from 'react'
import { useT } from '../i18n'
import { useReveal } from '../lib/useReveal'

/**
 * Cita grande de cliente sobre fondo claro: el respiro entre Clientes y Contacto.
 * Hasta que llegue la cita real (ver i18n `quote`), solo se muestra en desarrollo.
 */
export const QUOTE_READY = import.meta.env.DEV

export function Quote() {
  const { t, lang } = useT()
  const root = useRef<HTMLElement>(null)
  useReveal(root, [lang])
  if (!QUOTE_READY) return null
  return (
    <section ref={root} className="quote" aria-label={t.quote.author}>
      <div className="wrap">
        <blockquote>
          <p className="quote-text reveal">{t.quote.text}</p>
          <footer className="quote-by reveal">
            <strong>{t.quote.author}</strong>
            <span>{t.quote.role}</span>
          </footer>
        </blockquote>
      </div>
    </section>
  )
}
