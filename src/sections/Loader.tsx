import { useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'
import { useT } from '../i18n'

const MIN_MS = 1400

export function Loader({ onDone }: { onDone: () => void }) {
  const { t } = useT()
  const { progress } = useProgress()
  const [done, setDone] = useState(false)
  const [start] = useState(() => performance.now())

  useEffect(() => {
    if (progress < 100 || done) return
    const wait = Math.max(0, MIN_MS - (performance.now() - start))
    const id = setTimeout(() => {
      setDone(true)
      onDone()
    }, wait)
    return () => clearTimeout(id)
  }, [progress, done, start, onDone])

  // Si no hay nada que cargar, useProgress se queda en 0: forzamos el cierre.
  useEffect(() => {
    const id = setTimeout(() => {
      if (!done) {
        setDone(true)
        onDone()
      }
    }, 3500)
    return () => clearTimeout(id)
  }, [done, onDone])

  const shown = Math.max(progress, Math.min(100, ((performance.now() - start) / MIN_MS) * 100))

  return (
    <div className={`loader${done ? ' done' : ''}`} role="status" aria-live="polite">
      <div className="loader-inner">
        <img src="/brand/mixia-mark.png" alt="" width={72} height={67} />
        <div className="loader-bar" aria-hidden="true">
          <i style={{ transform: `scaleX(${shown / 100})` }} />
        </div>
        <span className="loader-label">{t.loader.label}</span>
      </div>
    </div>
  )
}
