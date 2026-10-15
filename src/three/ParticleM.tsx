import { useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'
import { pointsFragment, pointsVertex } from './brainShaders'
import { lowPower, prefersReducedMotion } from '../lib/device'

/** La "M" del logo como sólido extruido con bisel; sirve de molde para las partículas. */
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
    bevelSegments: 3,
    curveSegments: 3,
  })
  geo.center()
  return geo
}

const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
const hit = new THREE.Vector3()
const local = new THREE.Vector3()

export function ParticleM({ scroll }: { scroll: RefObject<number> }) {
  const group = useRef<THREE.Group>(null!)
  const { camera, raycaster, pointer } = useThree()

  const { solid, points } = useMemo(() => {
    const solid = buildM()
    const sampler = new MeshSurfaceSampler(new THREE.Mesh(solid)).build()
    const count = lowPower ? 1400 : 3200
    const positions = new Float32Array(count * 3)
    const rand = new Float32Array(count)
    const size = new Float32Array(count)
    const p = new THREE.Vector3()
    for (let i = 0; i < count; i++) {
      sampler.sample(p)
      positions[i * 3] = p.x
      positions[i * 3 + 1] = p.y
      positions[i * 3 + 2] = p.z
      rand[i] = Math.random()
      size[i] = 0.6 + Math.random() * 0.9
    }
    const points = new THREE.BufferGeometry()
    points.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    points.setAttribute('aRand', new THREE.BufferAttribute(rand, 1))
    points.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
    return { solid, points }
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector3(10, 10, 10) },
      uPointerStrength: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uSize: { value: lowPower ? 10 : 11 },
      uColorShift: { value: 0.75 },
    }),
    [],
  )

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    uniforms.uTime.value = prefersReducedMotion ? 0 : t
    const g = group.current
    const px = pointer.x
    const py = pointer.y
    const inside = Math.abs(px) <= 1 && Math.abs(py) <= 1
    const ry = (prefersReducedMotion ? 0 : Math.sin(t * 0.3) * 0.2) + (inside ? px * 0.3 : 0)
    g.rotation.y += (ry - g.rotation.y) * Math.min(1, delta * 2)

    raycaster.setFromCamera(pointer, camera)
    let strength = 0
    if (inside && raycaster.ray.intersectPlane(plane, hit)) {
      local.copy(hit)
      g.worldToLocal(local)
      uniforms.uPointer.value.lerp(local, Math.min(1, delta * 8))
      strength = 1
    }
    uniforms.uPointerStrength.value += (strength - uniforms.uPointerStrength.value) * Math.min(1, delta * 4)

    const s = scroll.current ?? 0
    g.position.y = 0.05 + s * 1.2
    g.scale.setScalar((1 - s * 0.4) * 0.64)
  })

  return (
    <group ref={group} position={[1.5, 0.05, 0]}>
      <mesh geometry={solid}>
        <meshBasicMaterial color="#6e5fd6" transparent opacity={0.1} depthWrite={false} />
      </mesh>
      <points geometry={points} frustumCulled={false}>
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
  )
}
