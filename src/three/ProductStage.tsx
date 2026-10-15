import { useMemo, useRef, type ReactNode, type RefObject } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera, View } from '@react-three/drei'
import { Studio } from './Studio'
import { VentiaCardModel } from './VentiaCard'
import { LockPhoneModel } from './LockPhone'
import { SmartMedPulseModel } from './SmartMedPulse'
import { lowPower } from '../lib/device'
import type { LockScreens } from './lockScreens'
import { STAGE_COUNT, STAGE_FADE, stageExplode, stageLocal, stageWeight } from '../lib/stage'

/** Fuerza 0→1 de la ráfaga de partículas: máxima justo en cada cruce. */
function burst(p: number) {
  let b = 0
  for (let i = 1; i < STAGE_COUNT; i++) {
    const d = Math.abs(p - i / STAGE_COUNT) / (STAGE_FADE * 1.6)
    b = Math.max(b, 1 - Math.min(1, d))
  }
  return b * b * (3 - 2 * b)
}

/** Un producto dentro del escenario: aparece desde abajo girando, sale hacia arriba encogiéndose. */
function Slot({
  index,
  progress,
  scale = 1,
  children,
}: {
  index: number
  progress: RefObject<number>
  scale?: number
  children: ReactNode
}) {
  const group = useRef<THREE.Group>(null!)
  useFrame(() => {
    const p = progress.current ?? 0
    const w = stageWeight(index, p)
    const g = group.current
    g.visible = w > 0.004
    if (!g.visible) return
    const center = (index + 0.5) / STAGE_COUNT
    const dir = p < center ? -1 : 1
    const out = 1 - w
    g.scale.setScalar(scale * (0.45 + 0.55 * w))
    g.position.y = dir * out * 2.2
    g.position.z = -out * 1.5
    g.rotation.y = dir * out * 1.4
    g.rotation.z = dir * out * 0.25
  })
  return <group ref={group}>{children}</group>
}

const COLORS = ['#5ee6f0', '#8b8cf5', '#c084f0', '#f2a552']

/** Nube de partículas que estalla en cada cruce y se apaga en los tramos. */
function Burst({ progress }: { progress: RefObject<number> }) {
  const points = useRef<THREE.Points>(null!)
  const n = lowPower ? 220 : 520
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(n * 3)
    const colors = new Float32Array(n * 3)
    const c = new THREE.Color()
    for (let i = 0; i < n; i++) {
      // Esfera con hueco al centro: las partículas rodean al objeto, no lo tapan.
      const r = 1.2 + Math.random() * 1.6
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(ph) * Math.cos(th)
      positions[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th)
      positions[i * 3 + 2] = r * Math.cos(ph)
      c.set(COLORS[i % COLORS.length])
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    return { positions, colors }
  }, [n])

  useFrame((st, delta) => {
    const b = burst(progress.current ?? 0)
    const pts = points.current
    pts.visible = b > 0.01
    if (!pts.visible) return
    const m = pts.material as THREE.PointsMaterial
    m.opacity = b * 0.95
    m.size = 0.03 + b * 0.04
    pts.scale.setScalar(0.7 + b * 0.7)
    pts.rotation.y += delta * 0.35
    pts.rotation.x = Math.sin(st.clock.elapsedTime * 0.3) * 0.3
  })

  return (
    <points ref={points} visible={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        transparent
        opacity={0}
        size={0.04}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  )
}

/**
 * Escenario único de la sección fijada de productos: la tarjeta de Ventia, el teléfono de Mixia
 * Lock y el anillo de SmartMed se turnan según `progress` (0→1 del scroll de toda la sección).
 */
/** Reparte el progreso global en progresos locales y apertura del teléfono, sin re-renders. */
function Driver({
  progress,
  local,
  explode,
}: {
  progress: RefObject<number>
  local: RefObject<number>[]
  explode: RefObject<number>
}) {
  useFrame(() => {
    const p = progress.current ?? 0
    for (let i = 0; i < STAGE_COUNT; i++) local[i].current = stageLocal(i, p)
    explode.current = stageExplode(p)
  })
  return null
}

export default function ProductStage({ progress, screens }: { progress: RefObject<number>; screens: LockScreens }) {
  const local = useRef<RefObject<number>[]>([{ current: 0 }, { current: 0 }, { current: 0 }]).current
  const explode = useRef(0)

  return (
    <View style={{ width: '100%', height: '100%' }}>
      <Driver progress={progress} local={local} explode={explode} />
      <PerspectiveCamera makeDefault position={[0, 0, 5.8]} fov={34} />
      <Studio />
      <Slot index={0} progress={progress} scale={0.96}>
        <VentiaCardModel progress={local[0]} turns={1.3} />
      </Slot>
      <Slot index={1} progress={progress} scale={0.84}>
        <LockPhoneModel progress={local[1]} screens={screens} explode={explode} />
      </Slot>
      <Slot index={2} progress={progress} scale={0.94}>
        <SmartMedPulseModel progress={local[2]} />
      </Slot>
      <Burst progress={progress} />
    </View>
  )
}
