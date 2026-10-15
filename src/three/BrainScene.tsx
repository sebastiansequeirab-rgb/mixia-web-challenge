import type { RefObject } from 'react'
import { PerspectiveCamera } from '@react-three/drei'
import { LogoMark } from './LogoMark'

export function BrainScene({ scroll }: { scroll: RefObject<number> }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5.8]} fov={38} />
      <LogoMark scroll={scroll} />
    </>
  )
}
