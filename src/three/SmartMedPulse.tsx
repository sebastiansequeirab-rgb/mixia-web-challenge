import { useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Float, Line, PerspectiveCamera } from '@react-three/drei'
import type { Line2 } from 'three/examples/jsm/lines/Line2.js'
import { Glass, Studio } from './Studio'
import { prefersReducedMotion } from '../lib/device'

/** Línea de electrocardiograma dentro de un anillo de vidrio, con módulos orbitando. */
function ecgPoints(): THREE.Vector3[] {
  const pts: THREE.Vector3[] = []
  const beat = [0, 0, 0.05, -0.05, 0, 0.55, -0.35, 0.08, 0, 0, 0.12, 0.06, 0, 0]
  const width = 2.4
  const n = 160
  for (let i = 0; i <= n; i++) {
    const x = -width / 2 + (i / n) * width
    const phase = ((i / n) * 2) % 1
    const idx = phase * (beat.length - 1)
    const a = beat[Math.floor(idx)]
    const b = beat[Math.min(beat.length - 1, Math.floor(idx) + 1)]
    const y = THREE.MathUtils.lerp(a, b, idx % 1)
    pts.push(new THREE.Vector3(x, y, 0))
  }
  return pts
}

const modules = ['#5ee6f0', '#8b8cf5', '#c084f0', '#6fb4ff', '#5ee6f0']

export function SmartMedPulse({ progress }: { progress: RefObject<number> }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5.6]} fov={35} />
      <Studio />
      <SmartMedPulseModel progress={progress} />
    </>
  )
}

/** Solo el anillo, sin cámara ni luces. */
export function SmartMedPulseModel({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null!)
  const orbit = useRef<THREE.Group>(null!)
  const line = useRef<Line2>(null!)
  const points = useMemo(ecgPoints, [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const g = group.current
    const p = progress.current ?? 0
    const px = state.pointer.x
    const py = state.pointer.y
    const inside = Math.abs(px) <= 1 && Math.abs(py) <= 1
    const ry = -0.5 + p * 1.0 + (inside ? px * 0.35 : 0)
    const rx = inside ? -py * 0.25 : 0
    g.rotation.y += (ry - g.rotation.y) * Math.min(1, delta * 3)
    g.rotation.x += (rx - g.rotation.x) * Math.min(1, delta * 3)
    if (!prefersReducedMotion) {
      orbit.current.rotation.y = t * 0.35
      orbit.current.rotation.x = Math.sin(t * 0.2) * 0.3
      const mat = line.current?.material as unknown as { dashOffset: number } | undefined
      if (mat) mat.dashOffset = -t * 1.2
    }
  })

  return (
    <>
      <Float speed={prefersReducedMotion ? 0 : 1.2} rotationIntensity={0.15} floatIntensity={0.4}>
        <group ref={group}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.55, 0.09, 32, 96]} />
            <Glass color="#dff8ff" tint="#5ee6f0" />
          </mesh>
          <mesh>
            <torusGeometry args={[1.55, 0.09, 32, 96]} />
            <Glass color="#e6e8ff" tint="#8b8cf5" />
          </mesh>
          <Line
            ref={line}
            points={points}
            color="#5ee6f0"
            lineWidth={2.2}
            dashed
            dashSize={1.6}
            gapSize={0.9}
            dashScale={1}
            toneMapped={false}
          />
          <Line points={points} color="#5ee6f0" lineWidth={1} transparent opacity={0.35} toneMapped={false} />
          <group ref={orbit}>
            {modules.map((c, i) => {
              const a = (i / modules.length) * Math.PI * 2
              return (
                <mesh key={c + i} position={[Math.cos(a) * 2.05, Math.sin(a * 1.7) * 0.4, Math.sin(a) * 2.05]}>
                  <sphereGeometry args={[0.09, 24, 24]} />
                  <meshStandardMaterial color={c} emissive={c} emissiveIntensity={1.4} toneMapped={false} />
                </mesh>
              )
            })}
          </group>
        </group>
      </Float>
    </>
  )
}
