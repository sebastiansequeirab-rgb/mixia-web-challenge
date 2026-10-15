import { useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { Brain } from './Brain'
import { ParticleM } from './ParticleM'
import { prefersReducedMotion } from '../lib/device'
import { heroState } from './heroState'

const SWING = (Math.PI * 2) / 16 // un vaivén completo cada 16 s

/**
 * El isotipo de Mixia como un solo objeto: hemisferio de partículas a la izquierda y la M
 * naciendo de la cara de corte, igual que en public/brand/mixia-mark.png. Este grupo hace todo
 * el movimiento (giro en vaivén de ±17° con cabeceo, parallax con el puntero, scroll); los hijos son
 * estáticos. No da la vuelta completa: la M quedaría escondida detrás del hemisferio.
 */
export function LogoMark({ scroll }: { scroll: RefObject<number> }) {
  const group = useRef<THREE.Group>(null!)
  const { pointer, viewport } = useThree()
  const smooth = useRef({ x: 0, y: 0 })
  const fit = Math.min(1, viewport.width / 2.7) * 1.12

  useFrame((state, delta) => {
    const g = group.current
    const t = state.clock.elapsedTime
    // Armado: arranca cuando el loader suelta la página y dura ~2,4 s (inmediato con reduced motion).
    if (heroState.pulseRequested) {
      heroState.pulseRequested = false
      heroState.pulseAt = t
    }
    if (prefersReducedMotion) heroState.assemble = 1
    else if (heroState.ready) {
      if (!heroState.readyAt) heroState.readyAt = t
      heroState.assemble = Math.min(1, (t - heroState.readyAt) / 2.4)
    }
    const inside = Math.abs(pointer.x) <= 1 && Math.abs(pointer.y) <= 1
    const k = Math.min(1, delta * 3)
    smooth.current.x += ((inside ? pointer.x : 0) - smooth.current.x) * k
    smooth.current.y += ((inside ? pointer.y : 0) - smooth.current.y) * k

    const s = scroll.current ?? 0
    const spin = prefersReducedMotion ? 0 : Math.sin(t * SWING) * 0.3
    g.rotation.y = spin + smooth.current.x * 0.35 + s * 1.4
    const nod = prefersReducedMotion ? 0 : Math.sin(t * SWING * 0.63) * 0.08
    g.rotation.x = 0.08 + nod - smooth.current.y * 0.18
    g.scale.setScalar(fit * (1 - s * 0.35))
    g.position.y = s * 0.8
  })

  return (
    <group ref={group}>
      <group position={[-0.3, 0, 0]}>
        <Brain scroll={scroll} />
      </group>
      {/* La M nace en la cara de corte (x = -0.3): el borde plano del molde queda pegado al cerebro. */}
      <group position={[-0.3, -0.12, 0.05]} scale={[0.82, 0.78, 0.78]}>
        <ParticleM />
      </group>
    </group>
  )
}
