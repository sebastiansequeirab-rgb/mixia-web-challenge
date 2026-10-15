import type { RefObject } from 'react'
import { PerspectiveCamera } from '@react-three/drei'
import { Brain } from './Brain'
import { ParticleM } from './ParticleM'
import { Studio } from './Studio'

export function BrainScene({ scroll }: { scroll: RefObject<number> }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0.3, 0, 5.8]} fov={38} />
      <Studio intensity={0.8} />
      <Brain scroll={scroll} />
      <ParticleM scroll={scroll} />
    </>
  )
}
