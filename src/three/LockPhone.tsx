import { useEffect, useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Float, PerspectiveCamera, RoundedBox } from '@react-three/drei'
import { Studio } from './Studio'
import { prefersReducedMotion } from '../lib/device'
import { buildLockScreens, SCREEN_ORDER, type LockScreens, type ScreenKind } from './lockScreens'

const SCREEN_MS = 3400
const AMBER = new THREE.Color('#f2a552')
const PERI = new THREE.Color('#8b8cf5')

/**
 * Teléfono con la app de Mixia Lock dibujada en canvas (tres pantallas que rotan en bucle:
 * registrar, desbloqueado, bloqueado) y un candado que acompaña el estado.
 */
export function LockPhone({ progress, screens }: { progress: RefObject<number>; screens: LockScreens }) {
  const group = useRef<THREE.Group>(null!)
  const shackle = useRef<THREE.Group>(null!)
  const ring = useRef<THREE.Mesh>(null!)
  const mats = useRef<THREE.MeshBasicMaterial[]>([])
  const textures = useMemo(() => buildLockScreens(screens), [screens])
  useEffect(() => () => Object.values(textures).forEach((t) => t.dispose()), [textures])
  const state = useRef({ index: 1, since: 0 })

  useFrame((st, delta) => {
    const g = group.current
    const p = progress.current ?? 0
    const px = st.pointer.x
    const py = st.pointer.y
    const inside = Math.abs(px) <= 1 && Math.abs(py) <= 1
    const ry = -0.55 + p * 1.1 + (inside ? px * 0.35 : 0)
    const rx = inside ? -py * 0.2 : 0
    g.rotation.y += (ry - g.rotation.y) * Math.min(1, delta * 3)
    g.rotation.x += (rx - g.rotation.x) * Math.min(1, delta * 3)

    // Pantalla activa: rota en bucle; con reduced motion se queda en "desbloqueado".
    const t = st.clock.elapsedTime * 1000
    const sc = state.current
    if (!prefersReducedMotion && p > 0 && p < 1 && t - sc.since > SCREEN_MS) {
      sc.index = (sc.index + 1) % SCREEN_ORDER.length
      sc.since = t
    }
    const kind: ScreenKind = SCREEN_ORDER[sc.index]
    mats.current.forEach((m, i) => {
      const target = i === sc.index ? 1 : 0
      m.opacity += (target - m.opacity) * Math.min(1, delta * 6)
    })

    // Candado: abierto cuando el equipo está desbloqueado, cerrado y ámbar cuando está bloqueado.
    const open = kind === 'unlocked' ? 1 : 0
    const s = shackle.current
    s.position.y += (0.22 * open - s.position.y) * Math.min(1, delta * 4)
    s.rotation.y += (0.9 * open - s.rotation.y) * Math.min(1, delta * 4)
    const r = ring.current
    const pulse = prefersReducedMotion ? 1 : 1 + Math.sin(st.clock.elapsedTime * 2) * 0.06
    r.scale.setScalar(pulse)
    const rm = r.material as THREE.MeshBasicMaterial
    rm.opacity += ((kind === 'locked' ? 0.7 : 0.3) - rm.opacity) * Math.min(1, delta * 4)
    rm.color.lerp(kind === 'locked' ? AMBER : PERI, Math.min(1, delta * 4))
  })

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={32} />
      <Studio />
      <Float speed={prefersReducedMotion ? 0 : 1.3} rotationIntensity={0.15} floatIntensity={0.4}>
        <group ref={group}>
          <group position={[-0.35, 0, 0]}>
            <RoundedBox args={[1.56, 3.2, 0.16]} radius={0.16} smoothness={6}>
              <meshPhysicalMaterial
                color="#0f1527"
                metalness={0.6}
                roughness={0.25}
                clearcoat={1}
                clearcoatRoughness={0.15}
              />
            </RoundedBox>
            {SCREEN_ORDER.map((kind, i) => (
              <mesh key={kind} position={[0, 0, 0.081 + i * 0.0005]}>
                <planeGeometry args={[1.3, 2.96]} />
                <meshBasicMaterial
                  ref={(m) => {
                    if (m) mats.current[i] = m
                  }}
                  map={textures[kind]}
                  transparent
                  opacity={i === 1 ? 1 : 0}
                  toneMapped={false}
                />
              </mesh>
            ))}
            {/* Marco de la pantalla */}
            <mesh position={[0, 0, 0.0805]}>
              <planeGeometry args={[1.44, 3.08]} />
              <meshBasicMaterial color="#05070d" />
            </mesh>
            {/* Botones laterales */}
            <mesh position={[0.79, 0.5, 0]}>
              <boxGeometry args={[0.03, 0.35, 0.06]} />
              <meshStandardMaterial color="#1a2238" metalness={0.8} roughness={0.3} />
            </mesh>
          </group>

          {/* Candado */}
          <group position={[1.05, -0.45, 0.4]} scale={0.55}>
            <mesh ref={ring} position={[0, 0.2, -0.2]}>
              <ringGeometry args={[1.25, 1.32, 64]} />
              <meshBasicMaterial color="#8b8cf5" transparent opacity={0.5} side={THREE.DoubleSide} />
            </mesh>
            <RoundedBox args={[1.3, 1.0, 0.5]} radius={0.16} smoothness={6} position={[0, -0.25, 0]}>
              <meshPhysicalMaterial
                color="#cfd3ff"
                metalness={0.5}
                roughness={0.15}
                clearcoat={1}
                envMapIntensity={1.5}
              />
            </RoundedBox>
            <mesh position={[0, -0.25, 0.26]}>
              <circleGeometry args={[0.12, 24]} />
              <meshBasicMaterial color="#070b16" />
            </mesh>
            <group ref={shackle} position={[0, 0, 0]}>
              <mesh position={[0, 0.25, 0]}>
                <torusGeometry args={[0.42, 0.11, 16, 40, Math.PI]} />
                <meshPhysicalMaterial color="#e3e6ff" metalness={0.9} roughness={0.2} envMapIntensity={1.6} />
              </mesh>
              <mesh position={[-0.42, 0.1, 0]}>
                <cylinderGeometry args={[0.11, 0.11, 0.3, 16]} />
                <meshPhysicalMaterial color="#e3e6ff" metalness={0.9} roughness={0.2} envMapIntensity={1.6} />
              </mesh>
              <mesh position={[0.42, 0.1, 0]}>
                <cylinderGeometry args={[0.11, 0.11, 0.3, 16]} />
                <meshPhysicalMaterial color="#e3e6ff" metalness={0.9} roughness={0.2} envMapIntensity={1.6} />
              </mesh>
            </group>
          </group>
        </group>
      </Float>
    </>
  )
}
