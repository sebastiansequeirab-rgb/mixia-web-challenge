import { useEffect, useRef, type RefObject } from 'react'
import { ScrollTrigger } from './scroll'

/**
 * Progreso 0→1 de un elemento mientras cruza la ventana (entra por abajo, sale por arriba).
 * Se lee desde `useFrame` sin re-renders.
 */
export function useSectionProgress(target: RefObject<HTMLElement | null>) {
  const progress = useRef(0)
  useEffect(() => {
    if (!target.current) return
    const st = ScrollTrigger.create({
      trigger: target.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        progress.current = self.progress
      },
    })
    return () => st.kill()
  }, [target])
  return progress
}
