import { useRef, type ReactNode } from 'react'
import { View } from '@react-three/drei'
import { useT } from '../i18n'
import { useReveal } from '../lib/useReveal'
import { useSectionProgress } from '../lib/useSectionProgress'
import { VentiaCard } from '../three/VentiaCard'
import { LockPhone } from '../three/LockPhone'
import { SmartMedPulse } from '../three/SmartMedPulse'

type Product = {
  tag: string
  title: string
  tagline: string
  desc: string
  features: string[]
  proof: string
  link?: string
  linkLabel?: string
}

function ProductBlock({
  data,
  accent,
  glow,
  logo,
  flip,
  children,
}: {
  data: Product
  accent: string
  glow: string
  logo?: { src: string; className?: string; width: number; height: number }
  flip?: boolean
  children: (progress: React.RefObject<number>) => ReactNode
}) {
  const { t } = useT()
  const block = useRef<HTMLElement>(null)
  const progress = useSectionProgress(block)
  return (
    <article
      ref={block}
      className={`product${flip ? ' flip' : ''}`}
      style={{ ['--accent' as string]: accent, ['--glow' as string]: glow }}
    >
      <div className="product-copy">
        <span className="tag reveal">{data.tag}</span>
        {logo ? (
          <img
            className={`product-logo reveal ${logo.className ?? ''}`}
            src={logo.src}
            alt={data.title}
            width={logo.width}
            height={logo.height}
          />
        ) : (
          <h3 className="reveal">{data.title}</h3>
        )}
        <p className="tagline reveal">{data.tagline}</p>
        <p className="desc reveal">{data.desc}</p>
        <ul className="features">
          {data.features.map((f) => (
            <li className="reveal" key={f}>
              {f}
            </li>
          ))}
        </ul>
        <p className="proof reveal">
          {data.proof}
          {data.link && (
            <a href={data.link} target="_blank" rel="noopener noreferrer">
              {t.products.visit} {data.linkLabel}
              <svg
                viewBox="0 0 16 16"
                width="12"
                height="12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d="M4 12 12 4M6 4h6v6" />
              </svg>
            </a>
          )}
        </p>
      </div>
      <div className="product-visual">
        <View style={{ width: '100%', height: '100%' }}>{children(progress)}</View>
      </div>
    </article>
  )
}

export function Products() {
  const { t, lang } = useT()
  const root = useRef<HTMLElement>(null)
  useReveal(root, [lang])

  return (
    <section id="productos" ref={root} className="section products">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow reveal">{t.products.eyebrow}</p>
          <h2 className="h-lg reveal">{t.products.heading}</h2>
          <p className="lead reveal">{t.products.sub}</p>
        </div>

        <ProductBlock
          data={t.products.ventia}
          accent="#f2a552"
          glow="rgba(242,165,82,0.22)"
          logo={{ src: '/brand/ventia-mark.png', className: 'ventia', width: 960, height: 291 }}
        >
          {(p) => <VentiaCard progress={p} />}
        </ProductBlock>

        <ProductBlock data={t.products.lock} accent="#8b8cf5" glow="rgba(139,140,245,0.25)" flip>
          {(p) => <LockPhone progress={p} />}
        </ProductBlock>

        <ProductBlock
          data={t.products.smartmed}
          accent="#5ee6f0"
          glow="rgba(94,230,240,0.2)"
          logo={{ src: '/brand/smartmed-mark.png', width: 675, height: 110 }}
        >
          {(p) => <SmartMedPulse progress={p} />}
        </ProductBlock>
      </div>
    </section>
  )
}
