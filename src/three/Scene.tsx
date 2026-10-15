import type { RefObject } from 'react'
import { Canvas } from '@react-three/fiber'
import { View } from '@react-three/drei'
import { dpr } from '../lib/device'

/**
 * Un solo canvas fijo para toda la página. Cada sección dibuja su escena en un
 * `View` anclado a un div, así compartimos un único contexto WebGL.
 */
export function GL({ eventSource }: { eventSource: RefObject<HTMLElement> }) {
  return (
    <div className="gl" aria-hidden="true">
      <Canvas
        eventSource={eventSource}
        eventPrefix="client"
        dpr={dpr}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <View.Port />
      </Canvas>
    </div>
  )
}
