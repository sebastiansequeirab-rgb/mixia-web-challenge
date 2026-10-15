import type { RefObject } from 'react'
import { View } from '@react-three/drei'
import { BrainScene } from './BrainScene'

/** Viewport del hero. Vive en el chunk de Three para que la página pinte antes. */
export default function HeroView({ scroll }: { scroll: RefObject<number> }) {
  return (
    <View style={{ width: '100%', height: '100%' }}>
      <BrainScene scroll={scroll} />
    </View>
  )
}
