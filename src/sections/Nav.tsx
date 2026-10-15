import { useEffect, useState } from 'react'
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
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    setOpen(false)
    scrollTo(`#${id}`)
  }

  return (
    <>
      <header className={`nav${scrolled || open ? ' scrolled' : ''}`}>
        <div className="wrap">
          <a className="brand" href="#inicio" onClick={(e) => go(e, 'inicio')} aria-label="Mixia, inicio">
            <img src="/brand/mixia-mark.png" alt="" width={34} height={32} />
            <span>Mixia</span>
          </a>
          <nav className="nav-links" aria-label="Secciones">
            {links.map((l) => (
              <a key={l.id} href={`#${l.id}`} onClick={(e) => go(e, l.id)}>
                {t.nav[l.key]}
              </a>
            ))}
          </nav>
          <div className="nav-right">
            <button className="lang" onClick={toggle} aria-label={t.nav.toggle}>
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
      </header>
      {open && (
        <div className="mobile-menu">
          {links.map((l) => (
            <a key={l.id} href={`#${l.id}`} onClick={(e) => go(e, l.id)}>
              {t.nav[l.key]}
            </a>
          ))}
        </div>
      )}
    </>
  )
}
