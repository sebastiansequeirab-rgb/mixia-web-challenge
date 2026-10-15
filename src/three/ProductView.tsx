import type { RefObject } from 'react'
import { View } from '@react-three/drei'
import { VentiaCard } from './VentiaCard'
import { LockPhone } from './LockPhone'
import { SmartMedPulse } from './SmartMedPulse'
import type { LockScreens } from './lockScreens'

export type ProductKind = 'ventia' | 'lock' | 'smartmed'

/** Viewport de cada producto. Un solo módulo lazy para las tres escenas. */
export default function ProductView({
  kind,
  progress,
  screens,
}: {
  kind: ProductKind
  progress: RefObject<number>
  screens?: LockScreens
}) {
  return (
    <View style={{ width: '100%', height: '100%' }}>
      {kind === 'ventia' && <VentiaCard progress={progress} />}
      {kind === 'lock' && screens && <LockPhone progress={progress} screens={screens} />}
      {kind === 'smartmed' && <SmartMedPulse progress={progress} />}
    </View>
  )
}
