import { useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { buildBrain } from './brainGeometry'
import { linesFragment, linesVertex, pointsFragment, pointsVertex } from './brainShaders'
import { lowPower, prefersReducedMotion } from '../lib/device'

const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
const hit = new THREE.Vector3()
const local = new THREE.Vector3()

export function Brain({ scroll }: { scroll: RefObject<number> }) {
  const group = useRef<THREE.Group>(null!)
  const data = useMemo(() => buildBrain(lowPower ? 2600 : 6500, lowPower ? 700 : 1300), [])
  const { camera, raycaster, pointer } = useThree()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector3(10, 10, 10) },
      uPointerStrength: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uSize: { value: lowPower ? 14 : 16 },
      uLineAlpha: { value: 1 },
      uColorShift: { value: 0 },
    }),
    [],
  )

  const pointsGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(data.positions, 3))
    g.setAttribute('aRand', new THREE.BufferAttribute(data.rand, 1))
    g.setAttribute('aSize', new THREE.BufferAttribute(data.size, 1))
    return g
  }, [data])

  const linesGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(data.linePositions, 3))
    g.setAttribute('aT', new THREE.BufferAttribute(data.lineT, 1))
    g.setAttribute('aPhase', new THREE.BufferAttribute(data.linePhase, 1))
    g.setAttribute('aRand', new THREE.BufferAttribute(data.lineRand, 1))
    return g
  }, [data])

  const target = useRef({ strength: 0 })

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    uniforms.uTime.value = prefersReducedMotion ? 0 : t
    const g = group.current
    const inside = Math.abs(pointer.x) <= 1 && Math.abs(pointer.y) <= 1

    // Puntero proyectado al plano z=0 y llevado al espacio local del grupo (incluye al padre que gira).
    raycaster.setFromCamera(pointer, camera)
    if (inside && raycaster.ray.intersectPlane(plane, hit)) {
      local.copy(hit)
      g.worldToLocal(local)
      uniforms.uPointer.value.lerp(local, Math.min(1, delta * 8))
      target.current.strength = 1
    } else {
      target.current.strength = 0
    }
    uniforms.uPointerStrength.value +=
      (target.current.strength - uniforms.uPointerStrength.value) * Math.min(1, delta * 4)

    // Al hacer scroll las aristas se apagan (el movimiento lo lleva LogoMark).
    uniforms.uLineAlpha.value = 1 - (scroll.current ?? 0) * 0.9
  })

  return (
    <group ref={group}>
      <points geometry={pointsGeo} frustumCulled={false}>
        <shaderMaterial
          vertexShader={pointsVertex}
          fragmentShader={pointsFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments geometry={linesGeo} frustumCulled={false}>
        <shaderMaterial
          vertexShader={linesVertex}
          fragmentShader={linesFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  )
}
