import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useT } from '../i18n'
import { scrollTo } from '../lib/scroll'

const links = [
  { id: 'productos', key: 'products' },
  { id: 'servicios', key: 'services' },
  { id: 'clientes', key: 'clients' },
  { id: 'contacto', key: 'contact' },
] as const

export function Nav() {
  const { t, lang, toggle } = useT()
  const header = useRef<HTMLElement>(null)
  const linksRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string | null>(null)

  // Fondo al bajar + línea de progreso de lectura (variable CSS, sin re-render por frame).
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)
      const max = document.documentElement.scrollHeight - window.innerHeight
      header.current?.style.setProperty('--p', String(max > 0 ? Math.min(1, window.scrollY / max) : 0))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Sección visible: la que cruza la franja del 35 % al 55 % de la ventana.
  useEffect(() => {
    const sections = ['inicio', ...links.map((l) => l.id)]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el)
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-35% 0px -55% 0px' },
    )
    sections.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // La barra se desliza bajo el link activo.
  useLayoutEffect(() => {
    const nav = linksRef.current
    if (!nav) return
    const el = nav.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`)
    if (!el) {
      nav.style.setProperty('--o', '0')
      return
    }
    nav.style.setProperty('--x', `${el.offsetLeft}px`)
    nav.style.setProperty('--w', `${el.offsetWidth}px`)
    nav.style.setProperty('--o', '1')
  }, [active, lang])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    setOpen(false)
    scrollTo(`#${id}`)
  }

  const items = (cls?: string) =>
    links.map((l) => (
      <a
        key={l.id}
        href={`#${l.id}`}
        className={`${cls ?? ''}${active === l.id ? ' active' : ''}`.trim() || undefined}
        onClick={(e) => go(e, l.id)}
      >
        {t.nav[l.key]}
      </a>
    ))

  return (
    <>
      <header ref={header} className={`nav${scrolled || open ? ' scrolled' : ''}`}>
        <div className="wrap">
          <a className="brand" href="#inicio" onClick={(e) => go(e, 'inicio')} aria-label={t.nav.home}>
            <img src="/brand/mixia-mark.png" alt="" width={40} height={37} />
            <span>Mixia</span>
          </a>
          <nav ref={linksRef} className="nav-links" aria-label={t.nav.sections}>
            {items()}
          </nav>
          <div className="nav-right">
            <button className="lang" onClick={toggle} aria-label={`ES / EN. ${t.nav.toggle}`}>
              {lang === 'es' ? <b>ES</b> : 'ES'}
              <span>/</span>
              {lang === 'en' ? <b>EN</b> : 'EN'}
            </button>
            <a className="btn btn-primary" href="#contacto" onClick={(e) => go(e, 'contacto')}>
              {t.nav.cta}
            </a>
            <button className="burger" onClick={() => setOpen((o) => !o)} aria-label={t.nav.menu} aria-expanded={open}>
              <i />
            </button>
          </div>
        </div>
        <span className="nav-progress" aria-hidden="true" />
      </header>
      {open && (
        <div className="mobile-menu">
          <nav aria-label={t.nav.sections}>{items()}</nav>
          <div className="mobile-menu-foot">
            <a className="btn btn-primary" href="#contacto" onClick={(e) => go(e, 'contacto')}>
              {t.nav.cta}
            </a>
          </div>
        </div>
      )}
    </>
  )
}
