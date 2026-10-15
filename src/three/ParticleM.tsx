import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'
import { pointsFragment, pointsVertex } from './brainShaders'
import { lowPower, prefersReducedMotion } from '../lib/device'
import { heroState } from './heroState'

/**
 * Media M, como en el logo: solo la mitad derecha. El borde izquierdo (x = 0) es plano y se pega a
 * la cara de corte del cerebro; el brazo diagonal sube desde ahí hasta el fuste de la derecha,
 * que remata en una esquina redondeada. Sirve de molde para las partículas.
 */
function buildM() {
  const w = 0.32 // ancho del fuste
  const right = 1.0 // borde derecho
  const stem = right - w
  const r = 0.16 // radio de la esquina superior derecha
  const s = new THREE.Shape()
  s.moveTo(0, 0.2) // borde plano contra el cerebro (arriba)
  s.lineTo(stem, 1) // arista superior del brazo diagonal
  s.lineTo(right - r, 1)
  s.quadraticCurveTo(right, 1, right, 1 - r) // esquina redondeada
  s.lineTo(right, -1)
  s.lineTo(stem, -1)
  s.lineTo(stem, 0.42) // interior del fuste hasta donde nace el brazo
  s.lineTo(0, -0.38) // arista inferior del brazo diagonal, de vuelta al cerebro
  s.closePath()
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 0.42,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 3,
    curveSegments: 6,
  })
  // No se centra: el borde izquierdo queda en x = 0 para pegarlo a la cara de corte del cerebro.
  geo.translate(0, 0, -0.21)
  return geo
}

const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
const hit = new THREE.Vector3()
const local = new THREE.Vector3()

export function ParticleM() {
  const group = useRef<THREE.Group>(null!)
  const { camera, raycaster, pointer } = useThree()
  const mat = useRef<THREE.ShaderMaterial>(null)
  const solidRef = useRef<THREE.MeshBasicMaterial>(null)

  const { solid, points } = useMemo(() => {
    const solid = buildM()
    const sampler = new MeshSurfaceSampler(new THREE.Mesh(solid)).build()
    const count = lowPower ? 1800 : 4200
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
      uAssemble: { value: 0 },
      uPulse: { value: -1 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uSize: { value: lowPower ? 12 : 14 },
      uColorShift: { value: 0.35 },
    }),
    [],
  )

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    uniforms.uTime.value = prefersReducedMotion ? 0 : t
    uniforms.uAssemble.value = heroState.assemble
    uniforms.uPulse.value = heroState.pulseAt < 0 ? -1 : t - heroState.pulseAt
    const g = group.current
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
    const m = mat.current
    if (m) for (const k in uniforms) m.uniforms[k].value = uniforms[k as keyof typeof uniforms].value
    // El molde sólido aparece con las partículas.
    const solidMat = solidRef.current
    if (solidMat) solidMat.opacity = 0.14 * heroState.assemble
  })

  return (
    <group ref={group}>
      <mesh geometry={solid}>
        <meshBasicMaterial ref={solidRef} color="#6e5fd6" transparent opacity={0} depthWrite={false} />
      </mesh>
      <points geometry={points} frustumCulled={false}>
        <shaderMaterial
          ref={mat}
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
