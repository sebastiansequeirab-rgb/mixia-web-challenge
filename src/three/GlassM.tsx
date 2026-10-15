import { useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { prefersReducedMotion } from '../lib/device'
import { Glass } from './Studio'

/** La "M" del logo, extruida con bisel y en vidrio. */
function buildM() {
  const w = 0.3 // ancho del trazo
  const k = 0.52 // altura donde el trazo interior encuentra la barra
  const tip = -0.05 // punta inferior exterior de la V
  const inner = tip + 0.5 // punta interior de la V
  const s = new THREE.Shape()
  s.moveTo(0, -1)
  s.lineTo(0, 1)
  s.lineTo(w, 1)
  s.lineTo(0.55, tip)
  s.lineTo(1.1 - w, 1)
  s.lineTo(1.1, 1)
  s.lineTo(1.1, -1)
  s.lineTo(1.1 - w, -1)
  s.lineTo(1.1 - w, 1 - k)
  s.lineTo(0.55, inner)
  s.lineTo(w, 1 - k)
  s.lineTo(w, -1)
  s.closePath()
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 0.3,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 4,
    curveSegments: 4,
  })
  geo.center()
  return geo
}

export function GlassM({ scroll }: { scroll: RefObject<number> }) {
  const geo = useMemo(buildM, [])
  const mesh = useRef<THREE.Mesh>(null!)
  const group = useRef<THREE.Group>(null!)

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const g = group.current
    const px = state.pointer.x
    const inside = Math.abs(px) <= 1 && Math.abs(state.pointer.y) <= 1
    const ry = (prefersReducedMotion ? 0 : Math.sin(t * 0.3) * 0.35) + (inside ? px * 0.35 : 0)
    g.rotation.y += (ry - g.rotation.y) * Math.min(1, delta * 2)
    const s = scroll.current ?? 0
    g.position.y = 0.05 + s * 1.2
    g.scale.setScalar((1 - s * 0.4) * 0.72)
  })

  return (
    <group ref={group} position={[1.55, 0.05, 0]}>
      <Float speed={prefersReducedMotion ? 0 : 1.2} rotationIntensity={0.25} floatIntensity={0.6}>
        <mesh ref={mesh} geometry={geo}>
          <Glass color="#7d82f0" tint="#5a5fd6" transmission={0.55} />
        </mesh>
      </Float>
    </group>
  )
}
