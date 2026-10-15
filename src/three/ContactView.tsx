import type { RefObject } from 'react'
import { View } from '@react-three/drei'
import { SignalRing } from './SignalRing'

/** Fondo 3D de la sección de contacto. */
export default function ContactView({ progress }: { progress: RefObject<number> }) {
  return (
    <View style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <SignalRing progress={progress} />
    </View>
  )
}
