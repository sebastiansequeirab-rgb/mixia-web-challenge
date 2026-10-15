import { useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { useFrame, useLoader } from '@react-three/fiber'
import { Float, PerspectiveCamera, RoundedBox } from '@react-three/drei'
import { Studio } from './Studio'
import { prefersReducedMotion } from '../lib/device'

/** Tarjeta de crédito en vidrio naranja: el producto Ventia es crédito al consumo. */
export function VentiaCard({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null!)
  const logo = useLoader(THREE.TextureLoader, '/brand/ventia-mark.png')
  logo.colorSpace = THREE.SRGBColorSpace

  useFrame((state, delta) => {
    const g = group.current
    const p = progress.current ?? 0
    const px = state.pointer.x
    const py = state.pointer.y
    const inside = Math.abs(px) <= 1 && Math.abs(py) <= 1
    // Gira con el scroll (media vuelta a lo largo de la sección) y sigue al puntero.
    const ry = -0.9 + p * 1.8 + (inside ? px * 0.4 : 0)
    const rx = -0.15 + (inside ? -py * 0.3 : 0)
    g.rotation.y += (ry - g.rotation.y) * Math.min(1, delta * 3)
    g.rotation.x += (rx - g.rotation.x) * Math.min(1, delta * 3)
  })

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5.2]} fov={35} />
      <Studio />
      <Float speed={prefersReducedMotion ? 0 : 1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <group ref={group}>
          <RoundedBox args={[3.4, 2.15, 0.07]} radius={0.14} smoothness={6}>
            <meshPhysicalMaterial
              color="#151b30"
              metalness={0.75}
              roughness={0.28}
              clearcoat={1}
              clearcoatRoughness={0.12}
              iridescence={0.35}
              iridescenceIOR={1.2}
              envMapIntensity={1.8}
            />
          </RoundedBox>
          {/* Chip */}
          <RoundedBox args={[0.48, 0.38, 0.03]} radius={0.05} position={[-1.15, 0.28, 0.05]}>
            <meshStandardMaterial color="#f7e3c4" metalness={0.9} roughness={0.25} />
          </RoundedBox>
          {/* Logo */}
          <mesh position={[0.7, 0.58, 0.05]}>
            <planeGeometry args={[1.6, 0.485]} />
            <meshBasicMaterial map={logo} transparent toneMapped={false} />
          </mesh>
          {/* Número de tarjeta: cuatro grupos de puntos */}
          {[0, 1, 2, 3].map((gIdx) => (
            <group key={gIdx} position={[-1.35 + gIdx * 0.78, -0.38, 0.05]}>
              {[0, 1, 2, 3].map((d) => (
                <mesh key={d} position={[d * 0.15, 0, 0]}>
                  <circleGeometry args={[0.045, 16]} />
                  <meshBasicMaterial color="#fff5e8" />
                </mesh>
              ))}
            </group>
          ))}
          {/* Banda inferior */}
          <mesh position={[0, -0.82, 0.05]}>
            <planeGeometry args={[3.0, 0.02]} />
            <meshBasicMaterial color="#fff5e8" transparent opacity={0.5} />
          </mesh>
          {/* Reverso */}
          <mesh position={[0, 0.55, -0.05]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[3.4, 0.4]} />
            <meshBasicMaterial color="#1a1206" />
          </mesh>
        </group>
      </Float>
    </>
  )
}
