import { useRef } from 'react'
import { useT } from '../i18n'
import { useReveal } from '../lib/useReveal'

/* Logos en public/clientes/ (fuentes en FUENTES.md). Los que no tienen archivo van como wordmark. */
const logos: Record<string, { src: string; ratio: number; h?: number }> = {
  AWS: { src: '/clientes/aws.svg', ratio: 304 / 182 },
  Google: { src: '/clientes/google.svg', ratio: 272 / 92 },
  'Honda Motors': { src: '/clientes/honda.svg', ratio: 2049 / 1984, h: 52 },
  Gerais: { src: '/clientes/gerais.svg', ratio: 331 / 67 },
  'Scripps Health': { src: '/clientes/scripps.png', ratio: 794 / 195 },
}
const H = 38

function Row({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const list = [...items, ...items]
  return (
    <div className={`marquee${reverse ? ' reverse' : ''}`}>
      <div className="marquee-track">
        {list.map((name, i) => {
          const logo = logos[name]
          const hidden = i >= items.length
          return logo ? (
            <span
              key={`${name}-${i}`}
              className="client client-logo"
              role="img"
              aria-label={name}
              aria-hidden={hidden}
              style={{
                ['--logo' as string]: `url(${logo.src})`,
                height: logo.h ?? H,
                width: Math.round((logo.h ?? H) * logo.ratio),
              }}
            />
          ) : (
            <span key={`${name}-${i}`} className="client client-word" aria-hidden={hidden}>
              {name}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export function Clients() {
  const { t, lang } = useT()
  const root = useRef<HTMLElement>(null)
  useReveal(root, [lang])
  const list = t.clients.list
  const second = [...list.slice(5), ...list.slice(0, 5)]

  return (
    <section id="clientes" ref={root} className="clients" aria-label={t.clients.heading}>
      <div className="wrap">
        <p className="eyebrow reveal">{t.clients.eyebrow}</p>
        <h2 className="h-md reveal">{t.clients.heading}</h2>
      </div>
      <div className="marquees reveal">
        <Row items={list} />
        <Row items={second} reverse />
      </div>
    </section>
  )
}
