import { useT } from '../i18n'

/**
 * Cabecera de sección: eyebrow, título que entra palabra por palabra y palabra clave en
 * degradado (marcada entre asteriscos en el diccionario), más la frase de contexto.
 */
export function Heading({ text, className = 'h-lg' }: { text: string; className?: string }) {
  const words = text.split(' ')
  let grad = false
  return (
    <h2 className={`${className} heading`} aria-label={text.replace(/\*/g, '')}>
      {words.map((w, i) => {
        if (w.startsWith('*')) grad = true
        const clean = w.replace(/\*/g, '')
        const cls = `w reveal${grad ? ' key' : ''}`
        if (w.endsWith('*')) grad = false
        return (
          <span key={i} aria-hidden="true">
            <span className="w-clip">
              <span className={cls}>{clean}</span>
            </span>{' '}
          </span>
        )
      })}
    </h2>
  )
}

export function SectionHead({
  eyebrow,
  heading,
  sub,
  compact,
}: {
  eyebrow: string
  heading: string
  sub?: string
  compact?: boolean
}) {
  useT()
  return (
    <div className={`section-head${compact ? ' compact' : ''}`}>
      <p className="eyebrow reveal">{eyebrow}</p>
      <Heading text={heading} className={compact ? 'h-md' : 'h-lg'} />
      {sub && <p className="lead reveal">{sub}</p>}
    </div>
  )
}
