import { useEffect, useState } from 'react'
import { useT } from '../i18n'

const MIN_MS = 1400
const MAX_MS = 6000
const GL_READY_EVENT = 'mixia:gl-ready'

/**
 * Pantalla de carga. Se cierra cuando el canvas 3D ya montó (evento) y pasó un mínimo de
 * tiempo, o a los 6 s pase lo que pase.
 */
export function Loader({ onDone }: { onDone: () => void }) {
  const { t } = useT()
  const [done, setDone] = useState(false)
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const start = performance.now()
    let glReady = false
    let finished = false

    const finish = () => {
      if (finished) return
      finished = true
      setPct(100)
      setDone(true)
      onDone()
    }
    const tryFinish = () => {
      const elapsed = performance.now() - start
      if (glReady && elapsed >= MIN_MS) finish()
      else if (glReady) setTimeout(finish, MIN_MS - elapsed)
    }
    const onReady = () => {
      glReady = true
      tryFinish()
    }
    window.addEventListener(GL_READY_EVENT, onReady)
    const cap = setTimeout(finish, MAX_MS)
    // Barra: avanza con el tiempo hasta 90 % y salta a 100 al terminar.
    const tick = setInterval(() => {
      const elapsed = performance.now() - start
      setPct((p) => (finished ? 100 : Math.max(p, Math.min(90, (elapsed / MIN_MS) * 90))))
    }, 60)
    return () => {
      window.removeEventListener(GL_READY_EVENT, onReady)
      clearTimeout(cap)
      clearInterval(tick)
    }
  }, [onDone])

  return (
    <div className={`loader${done ? ' done' : ''}`} role="status" aria-live="polite">
      <div className="loader-inner">
        <img src="/brand/mixia-mark.png" alt="" width={72} height={67} />
        <div className="loader-bar" aria-hidden="true">
          <i style={{ transform: `scaleX(${pct / 100})` }} />
        </div>
        <span className="loader-label">{t.loader.label}</span>
      </div>
    </div>
  )
}
