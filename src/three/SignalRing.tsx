import { useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { pointsFragment, pointsVertex } from './brainShaders'
import { lowPower, prefersReducedMotion } from '../lib/device'

const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
const hit = new THREE.Vector3()
const local = new THREE.Vector3()

/** Tres órbitas de partículas (una señal que viaja) con el mismo shader del hero. */
function buildOrbits(count: number) {
  const positions = new Float32Array(count * 3)
  const rand = new Float32Array(count)
  const size = new Float32Array(count)
  const rings = [
    { r: 1.25, tilt: 0.35, thick: 0.04 },
    { r: 1.7, tilt: -0.5, thick: 0.07 },
    { r: 2.2, tilt: 0.15, thick: 0.1 },
  ]
  for (let i = 0; i < count; i++) {
    const ring = rings[i % rings.length]
    const a = Math.random() * Math.PI * 2
    const r = ring.r + (Math.random() - 0.5) * ring.thick * 2
    const x = Math.cos(a) * r
    const z = Math.sin(a) * r
    const y = (Math.random() - 0.5) * ring.thick
    positions[i * 3] = x
    positions[i * 3 + 1] = y * Math.cos(ring.tilt) + z * Math.sin(ring.tilt) * 0.35
    positions[i * 3 + 2] = z * Math.cos(ring.tilt) * 0.35 - y * Math.sin(ring.tilt)
    rand[i] = Math.random()
    size[i] = 0.5 + Math.random() * 1.2
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('aRand', new THREE.BufferAttribute(rand, 1))
  geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
  return geo
}

export function SignalRing({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null!)
  const { camera, raycaster, pointer } = useThree()
  const geo = useMemo(() => buildOrbits(lowPower ? 1800 : 4200), [])
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector3(10, 10, 10) },
      uPointerStrength: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uSize: { value: lowPower ? 16 : 20 },
      uColorShift: { value: 0.2 },
    }),
    [],
  )

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    uniforms.uTime.value = prefersReducedMotion ? 0 : t
    const g = group.current
    const p = progress.current ?? 0
    g.rotation.y = (prefersReducedMotion ? 0 : t * 0.08) + p * 1.2
    g.rotation.x = 0.55 + pointer.y * -0.08
    const inside = Math.abs(pointer.x) <= 1 && Math.abs(pointer.y) <= 1
    raycaster.setFromCamera(pointer, camera)
    let strength = 0
    if (inside && raycaster.ray.intersectPlane(plane, hit)) {
      local.copy(hit)
      g.worldToLocal(local)
      uniforms.uPointer.value.lerp(local, Math.min(1, delta * 8))
      strength = 1
    }
    uniforms.uPointerStrength.value += (strength - uniforms.uPointerStrength.value) * Math.min(1, delta * 4)
  })

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={40} />
      <group ref={group} position={[0.5, -0.2, 0]} scale={1.3}>
        <points geometry={geo} frustumCulled={false}>
          <shaderMaterial
            vertexShader={pointsVertex}
            fragmentShader={pointsFragment}
            uniforms={uniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>
    </>
  )
}
