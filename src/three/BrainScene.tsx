import type { RefObject } from 'react'
import { PerspectiveCamera } from '@react-three/drei'
import { Brain } from './Brain'
import { GlassM } from './GlassM'
import { Studio } from './Studio'

export function BrainScene({ scroll }: { scroll: RefObject<number> }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0.25, 0, 4.9]} fov={38} />
      <Studio intensity={0.8} />
      <Brain scroll={scroll} />
      <GlassM scroll={scroll} />
    </>
  )
}
