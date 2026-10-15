import { useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { useFrame, useLoader } from '@react-three/fiber'
import { Float, PerspectiveCamera, RoundedBox } from '@react-three/drei'
import { Studio } from './Studio'
import { prefersReducedMotion } from '../lib/device'

/**
 * Teléfono con la pantalla de bloqueo real (marca LifePhone, white label) y un candado que
 * se abre cuando el visitante pasa la mitad de la sección.
 */
export function LockPhone({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null!)
  const shackle = useRef<THREE.Group>(null!)
  const ring = useRef<THREE.Mesh>(null!)
  const screen = useLoader(THREE.TextureLoader, '/textures/lock-screen.png')
  screen.colorSpace = THREE.SRGBColorSpace
  screen.anisotropy = 4

  useFrame((state, delta) => {
    const g = group.current
    const p = progress.current ?? 0
    const px = state.pointer.x
    const py = state.pointer.y
    const inside = Math.abs(px) <= 1 && Math.abs(py) <= 1
    const ry = -0.55 + p * 1.1 + (inside ? px * 0.35 : 0)
    const rx = inside ? -py * 0.2 : 0
    g.rotation.y += (ry - g.rotation.y) * Math.min(1, delta * 3)
    g.rotation.x += (rx - g.rotation.x) * Math.min(1, delta * 3)

    // Candado: cerrado hasta la mitad, se abre después.
    const open = p > 0.5 ? 1 : 0
    const s = shackle.current
    s.position.y += (0.22 * open - s.position.y) * Math.min(1, delta * 4)
    s.rotation.y += (0.9 * open - s.rotation.y) * Math.min(1, delta * 4)
    const r = ring.current
    const pulse = prefersReducedMotion ? 1 : 1 + Math.sin(state.clock.elapsedTime * 2) * 0.06
    r.scale.setScalar(pulse)
    ;(r.material as THREE.MeshBasicMaterial).opacity = open ? 0.25 : 0.55
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
            <mesh position={[0, 0, 0.081]}>
              <planeGeometry args={[1.3, 2.96]} />
              <meshBasicMaterial map={screen} toneMapped={false} />
            </mesh>
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
