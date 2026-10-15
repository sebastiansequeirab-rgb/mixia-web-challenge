import { useRef } from 'react'
import { useT } from '../i18n'
import { Heading } from './SectionHead'
import { useReveal } from '../lib/useReveal'
import { isTouch, prefersReducedMotion } from '../lib/device'
import { goToContact } from './Products'

type Area = 'fin' | 'ia' | 'plat'

/** Tamaño (columnas × filas en la retícula de 6) y área de cada servicio, en el orden del diccionario. */
const TILES: { c: number; r: number; area: Area }[] = [
  { c: 3, r: 2, area: 'fin' }, // BNPL corporativo
  { c: 3, r: 1, area: 'ia' }, // agentes IA de cobranza
  { c: 3, r: 1, area: 'fin' }, // sistemas financieros y medios de pago
  { c: 2, r: 1, area: 'fin' }, // ciberseguridad y PCI-DSS
  { c: 4, r: 2, area: 'ia' }, // IA a la medida
  { c: 2, r: 1, area: 'ia' }, // realidad aumentada
  { c: 2, r: 1, area: 'plat' }, // apps
  { c: 2, r: 1, area: 'plat' }, // web
  { c: 2, r: 1, area: 'plat' }, // nube AWS
  { c: 2, r: 1, area: 'plat' }, // salud y legal
]

/** Animación propia de cada tarjeta, solo CSS. */
function Art({ i }: { i: number }) {
  switch (i) {
    case 0:
      return (
        <i className="art art-bnpl" aria-hidden="true">
          <b />
          <b />
          <b />
          <b />
        </i>
      )
    case 1:
      return (
        <i className="art art-chat" aria-hidden="true">
          <b />
          <b />
          <b />
        </i>
      )
    case 2:
      return (
        <i className="art art-orbit" aria-hidden="true">
          <b />
          <b />
          <b />
        </i>
      )
    case 3:
      return (
        <i className="art art-shield" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
            <path d="M12 3 4 6v6c0 4.5 3.4 7.8 8 9 4.6-1.2 8-4.5 8-9V6l-8-3z" />
          </svg>
          <b />
        </i>
      )
    case 4:
      return (
        <i className="art art-neural" aria-hidden="true">
          {Array.from({ length: 12 }, (_, k) => (
            <b key={k} style={{ ['--k' as string]: k }} />
          ))}
        </i>
      )
    case 5:
      return (
        <i className="art art-cube" aria-hidden="true">
          <span>
            <b />
            <b />
            <b />
            <b />
            <b />
            <b />
          </span>
        </i>
      )
    case 6:
      return (
        <i className="art art-phone" aria-hidden="true">
          <b />
        </i>
      )
    case 7:
      return (
        <i className="art art-web" aria-hidden="true">
          <b />
          <b />
          <b />
        </i>
      )
    case 8:
      return (
        <i className="art art-cloud" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
            <path d="M7 18a4 4 0 0 1-.6-7.95A6 6 0 0 1 18 9a4.5 4.5 0 0 1 .5 9H7z" />
          </svg>
          <b />
          <b />
          <b />
        </i>
      )
    default:
      return (
        <i className="art art-ecg" aria-hidden="true">
          <svg viewBox="0 0 120 40" preserveAspectRatio="none">
            <path d="M0 20h30l6-12 8 24 6-18 5 6h65" />
          </svg>
        </i>
      )
  }
}

/**
 * Mosaico vivo: los diez servicios a la vista en una retícula de tamaños distintos, color por
 * área, cada tarjeta con su animación. Al pasar el cursor la tarjeta se inclina, se ilumina
 * donde está el puntero y muestra la explicación.
 */
export function Services() {
  const { t, lang } = useT()
  const root = useRef<HTMLElement>(null)
  useReveal(root, [lang])

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (isTouch || prefersReducedMotion) return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty('--mx', `${x * 100}%`)
    el.style.setProperty('--my', `${y * 100}%`)
    el.style.setProperty('--rx', `${(0.5 - y) * 6}deg`)
    el.style.setProperty('--ry', `${(x - 0.5) * 8}deg`)
  }
  const onLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.removeProperty('--rx')
    e.currentTarget.style.removeProperty('--ry')
  }

  return (
    <section id="servicios" ref={root} className="section services">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow reveal">{t.services.eyebrow}</p>
          <Heading text={t.services.heading} />
          <p className="lead reveal">{t.services.sub}</p>
          <ul className="services-legend reveal" aria-hidden="true">
            {t.services.tabs.slice(1).map((tb, i) => (
              <li key={tb.label} className={['fin', 'ia', 'plat'][i]}>
                {tb.label}
              </li>
            ))}
          </ul>
        </div>
        <ul className="mosaic">
          {t.services.items.map((s, i) => {
            const tile = TILES[i]
            return (
              <li
                key={s.title}
                className={`tile ${tile.area}${tile.r > 1 ? ' big' : ''} reveal`}
                style={{ ['--c' as string]: tile.c, ['--r' as string]: tile.r }}
                onMouseMove={onMove}
                onMouseLeave={onLeave}
                tabIndex={0}
              >
                <Art i={i} />
                <div className="tile-body">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <div className="tile-more">
                    <ul>
                      {s.points.map((pt) => (
                        <li key={pt}>{pt}</li>
                      ))}
                    </ul>
                    <a
                      href="#contacto"
                      onClick={(e) => {
                        e.preventDefault()
                        goToContact(tile.area === 'ia' ? 'ia' : 'otro')
                      }}
                    >
                      {t.services.more}
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                        <path d="M3 8h10M9 4l4 4-4 4" />
                      </svg>
                    </a>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
