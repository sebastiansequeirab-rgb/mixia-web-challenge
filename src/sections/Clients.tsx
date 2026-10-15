import { useRef } from 'react'
import { useT } from '../i18n'
import { useReveal } from '../lib/useReveal'

export function Clients() {
  const { t, lang } = useT()
  const root = useRef<HTMLElement>(null)
  useReveal(root, [lang])
  const list = [...t.clients.list, ...t.clients.list]

  return (
    <section id="clientes" ref={root} className="clients" aria-label={t.clients.heading}>
      <div className="wrap">
        <p className="eyebrow reveal">{t.clients.eyebrow}</p>
        <h2 className="h-md reveal">{t.clients.heading}</h2>
      </div>
      <div className="marquee reveal">
        <div className="marquee-track" aria-hidden="false">
          {list.map((c, i) => (
            <span key={`${c}-${i}`} aria-hidden={i >= t.clients.list.length}>
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
