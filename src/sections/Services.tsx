import { useRef } from 'react'
import { useT } from '../i18n'
import { useReveal } from '../lib/useReveal'

/* Iconos de línea, uno por servicio, en el mismo orden que el diccionario. */
const icons = [
  // BNPL
  <path d="M3 8h18M3 8v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8M3 8l2-3h14l2 3M7 14h4" />,
  // agentes IA
  <path d="M4 6h16v9H9l-5 4V6zM8 10h.01M12 10h.01M16 10h.01" />,
  // pagos
  <path d="M12 3v18M7 7.5A3.5 3.5 0 0 1 10.5 4h3A3.5 3.5 0 0 1 17 7.5c0 2-1.5 3-3.5 3.5h-3C8.5 11.5 7 12.5 7 14.5A3.5 3.5 0 0 0 10.5 18h3a3.5 3.5 0 0 0 3.5-3.5" />,
  // ciberseguridad
  <path d="M12 3 4 6v6c0 4.5 3.4 7.8 8 9 4.6-1.2 8-4.5 8-9V6l-8-3zM9 12l2 2 4-4" />,
  // IA
  <path d="M9 3h6l1 3h3v6l-2 1v4h-4l-1 3h-4l-1-3H5v-4l-2-1V6h3l1-3zM12 9v6M9 12h6" />,
  // realidad aumentada
  <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4l-3-3-3 3H5a2 2 0 0 1-2-2V8zM8 11h2M14 11h2" />,
  // apps
  <path d="M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM10 18h4" />,
  // web
  <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />,
  // nube AWS
  <path d="M7 18a4 4 0 0 1-.6-7.95A6 6 0 0 1 18 9a4.5 4.5 0 0 1 .5 9H7z" />,
  // salud y legal
  <path d="M4 20h16M6 20V9l6-5 6 5v11M10 20v-5h4v5M12 10v4M10 12h4" />,
]

export function Services() {
  const { t, lang } = useT()
  const root = useRef<HTMLElement>(null)
  useReveal(root, [lang])

  const onMove = (e: React.MouseEvent<HTMLLIElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <section id="servicios" ref={root} className="section services">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow reveal">{t.services.eyebrow}</p>
          <h2 className="h-lg reveal">{t.services.heading}</h2>
          <p className="lead reveal">{t.services.sub}</p>
        </div>
        <ul className="services-grid">
          {t.services.items.map((s, i) => (
            <li className="service reveal" key={s.title} onMouseMove={onMove}>
              <div className="service-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {icons[i]}
                </svg>
              </div>
              <div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
