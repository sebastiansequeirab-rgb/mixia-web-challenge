import type { RefObject } from 'react'
import { View } from '@react-three/drei'
import { VentiaCard } from './VentiaCard'
import { LockPhone } from './LockPhone'
import { SmartMedPulse } from './SmartMedPulse'

export type ProductKind = 'ventia' | 'lock' | 'smartmed'

const scenes = {
  ventia: VentiaCard,
  lock: LockPhone,
  smartmed: SmartMedPulse,
}

/** Viewport de cada producto. Un solo módulo lazy para las tres escenas. */
export default function ProductView({ kind, progress }: { kind: ProductKind; progress: RefObject<number> }) {
  const Scene = scenes[kind]
  return (
    <View style={{ width: '100%', height: '100%' }}>
      <Scene progress={progress} />
    </View>
  )
}
