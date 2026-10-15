import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useT } from '../i18n'
import { gsap, scrollTo, ScrollTrigger } from '../lib/scroll'
import { prefersReducedMotion } from '../lib/device'
import { useReveal } from '../lib/useReveal'
import { useSectionProgress } from '../lib/useSectionProgress'
import type { ProductKind } from '../three/ProductView'
import type { LockScreens } from '../three/lockScreens'
import { STAGE_COUNT, stageExplode, stageLocal } from '../lib/stage'

const ProductView = lazy(() => import('../three/ProductView'))
const ProductStage = lazy(() => import('../three/ProductStage'))

type Product = {
  tag: string
  title: string
  tagline: string
  desc: string
  cta: string
  features: string[]
  proof: string
  link?: string
  linkLabel?: string
  screens?: LockScreens
}

type Logo = { src: string; className?: string; width: number; height: number }

type Entry = { kind: ProductKind; data: Product; accent: string; glow: string; logo?: Logo }

const ACCENTS: Record<ProductKind, { accent: string; glow: string; logo?: Logo }> = {
  ventia: {
    accent: '#f2a552',
    glow: 'rgba(242,165,82,0.22)',
    logo: { src: '/brand/ventia-mark.png', className: 'ventia', width: 960, height: 291 },
  },
  lock: { accent: '#8b8cf5', glow: 'rgba(139,140,245,0.25)' },
  smartmed: {
    accent: '#5ee6f0',
    glow: 'rgba(94,230,240,0.2)',
    logo: { src: '/brand/smartmed-mark.png', width: 675, height: 110 },
  },
}

/** Cuántas alturas de ventana dura la sección fijada (además de la pantalla que se queda quieta). */
const STAGE_SCROLL = 3.2

function Name({ data, logo }: { data: Product; logo?: Logo }) {
  return logo ? (
    <img
      className={`product-logo ${logo.className ?? ''}`}
      src={logo.src}
      alt={data.title}
      width={logo.width}
      height={logo.height}
    />
  ) : (
    <h3>{data.title}</h3>
  )
}

/** Lleva al visitante a contacto con el interés ya marcado (lo escucha el formulario). */
export function goToContact(interest: string) {
  window.dispatchEvent(new CustomEvent('mixia:interest', { detail: interest }))
  scrollTo('#contacto')
}

function Copy({ data, kind, reveal }: { data: Product; kind: ProductKind; reveal?: boolean }) {
  const { t } = useT()
  const r = reveal ? 'reveal' : undefined
  let k = 0
  const step = () => ({ ['--k' as string]: k++ })
  return (
    <>
      <p className={`tagline ${r ?? ''}`} style={step()}>
        {data.tagline}
      </p>
      <p className={`desc ${r ?? ''}`} style={step()}>
        {data.desc}
      </p>
      <ul className="features">
        {data.features.map((f, i) => (
          <li className={r} key={f} style={{ ...step(), ['--f' as string]: i }}>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <p className={`proof ${r ?? ''}`} style={step()}>
        {data.proof}
      </p>
      <div className={`product-actions ${r ?? ''}`} style={step()}>
        <a
          className="btn btn-accent"
          href="#contacto"
          onClick={(e) => {
            e.preventDefault()
            goToContact(kind)
          }}
        >
          {data.cta}
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </a>
        {data.link && (
          <a className="btn btn-ghost" href={data.link} target="_blank" rel="noopener noreferrer">
            {t.products.visit} {data.linkLabel}
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M4 12 12 4M6 4h6v6" />
            </svg>
          </a>
        )}
      </div>
    </>
  )
}

/** Móvil y reduced motion: tres bloques apilados, cada uno con su propia escena. */
function ProductBlock({ entry, flip }: { entry: Entry; flip?: boolean }) {
  const block = useRef<HTMLElement>(null)
  const progress = useSectionProgress(block)
  return (
    <article
      ref={block}
      className={`product${flip ? ' flip' : ''}`}
      style={{ ['--accent' as string]: entry.accent, ['--glow' as string]: entry.glow }}
    >
      <div className="product-copy">
        <span className="tag reveal">{entry.data.tag}</span>
        <div className="reveal">
          <Name data={entry.data} logo={entry.logo} />
        </div>
        <Copy data={entry.data} kind={entry.kind} reveal />
      </div>
      <div className="product-visual">
        <Suspense fallback={null}>
          <ProductView kind={entry.kind} progress={progress} screens={entry.data.screens} />
        </Suspense>
      </div>
    </article>
  )
}

/**
 * Escritorio: una pantalla fijada. La lista de productos a la izquierda se abre tramo a tramo
 * y el escenario 3D de la derecha cambia de objeto. En el tramo de Mixia Lock el teléfono se
 * abre en capas y aparecen las etiquetas técnicas.
 */
function ProductStageSection({ entries }: { entries: Entry[] }) {
  const { t } = useT()
  const stage = useRef<HTMLDivElement>(null!)
  const progress = useRef(0)
  const trigger = useRef<ScrollTrigger | null>(null)

  useEffect(() => {
    const el = stage.current
    let active = -1
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: () => `+=${window.innerHeight * STAGE_SCROLL}`,
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress
        progress.current = p
        const i = Math.min(STAGE_COUNT - 1, Math.floor(p * STAGE_COUNT))
        if (i !== active) {
          active = i
          el.dataset.active = String(i)
        }
        el.style.setProperty('--explode', stageExplode(p).toFixed(3))
        el.style.setProperty('--local', stageLocal(i, p).toFixed(3))
      },
    })
    trigger.current = st
    el.dataset.active = '0'
    return () => {
      st.kill()
      trigger.current = null
    }
  }, [])

  // Salta al centro del tramo de un producto.
  const jump = (i: number) => {
    const st = trigger.current
    if (!st) return
    const y = st.start + ((i + 0.5) / STAGE_COUNT) * (st.end - st.start)
    scrollTo(Math.round(y))
  }

  const lock = entries.find((e) => e.kind === 'lock')

  return (
    <div className="products-stage" ref={stage}>
      <div className="wrap stage-grid">
        <ol className="stage-list">
          {entries.map((entry, i) => (
            <li
              key={entry.kind}
              className="stage-item"
              style={{ ['--accent' as string]: entry.accent, ['--glow' as string]: entry.glow }}
            >
              <button type="button" className="stage-name" onClick={() => jump(i)}>
                <Name data={entry.data} logo={entry.logo} />
                <span className="tag">{entry.data.tag}</span>
              </button>
              <div className="stage-body">
                <div className="stage-body-inner">
                  <Copy data={entry.data} kind={entry.kind} />
                </div>
              </div>
            </li>
          ))}
        </ol>
        <div className="stage-visual">
          <div className="stage-blueprint" aria-hidden="true" />
          <Suspense fallback={null}>
            {lock?.data.screens && <ProductStage progress={progress} screens={lock.data.screens} />}
          </Suspense>
          <ul className="stage-labels" aria-hidden="true">
            {t.products.lock.exploded.map((l, i) => (
              <li key={l.part} className="stage-label" style={{ ['--i' as string]: i }}>
                <i />
                <span>
                  <small>{l.part}</small>
                  {l.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="stage-rail" aria-hidden="true">
        {entries.map((entry) => (
          <i key={entry.kind} />
        ))}
      </div>
    </div>
  )
}

function useStacked() {
  const query = () => prefersReducedMotion || window.innerWidth < 860
  const [stacked, setStacked] = useState(query)
  useEffect(() => {
    let raf = 0
    const onResize = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setStacked(query()))
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
    }
  }, [])
  return stacked
}

export function Products() {
  const { t, lang } = useT()
  const root = useRef<HTMLElement>(null)
  const stacked = useStacked()
  useReveal(root, [lang, stacked])

  useEffect(() => {
    // Al cambiar de apilado a fijado (o al revés) cambia la altura: recalcular los triggers.
    gsap.delayedCall(0.05, () => ScrollTrigger.refresh())
  }, [stacked])

  const entries: Entry[] = [
    { kind: 'ventia', data: t.products.ventia, ...ACCENTS.ventia },
    { kind: 'lock', data: t.products.lock, ...ACCENTS.lock },
    { kind: 'smartmed', data: t.products.smartmed, ...ACCENTS.smartmed },
  ]

  return (
    <section id="productos" ref={root} className={`section products${stacked ? '' : ' is-staged'}`}>
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow reveal">{t.products.eyebrow}</p>
          <h2 className="h-lg reveal">{t.products.heading}</h2>
          <p className="lead reveal">{t.products.sub}</p>
        </div>
        {stacked && entries.map((entry, i) => <ProductBlock key={entry.kind} entry={entry} flip={i === 1} />)}
      </div>
      {!stacked && <ProductStageSection entries={entries} />}
    </section>
  )
}
