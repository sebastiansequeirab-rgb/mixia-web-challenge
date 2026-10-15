import { useT } from '../i18n'

export function Footer() {
  const { t } = useT()
  return (
    <footer className="footer">
      <div className="wrap">
        <div>
          <strong style={{ color: 'var(--text)' }}>{t.footer.legal}</strong> · {t.footer.tagline}
        </div>
        <div className="footer-links">
          <a href="https://mixia.org" target="_blank" rel="noopener noreferrer">
            mixia.org
          </a>
          <a href="https://ventiave.com" target="_blank" rel="noopener noreferrer">
            ventiave.com
          </a>
        </div>
        <div>
          © {new Date().getFullYear()} {t.footer.rights} {t.footer.built}
        </div>
      </div>
    </footer>
  )
}
