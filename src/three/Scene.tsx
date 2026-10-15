import { useEffect, type RefObject } from 'react'
import { Canvas } from '@react-three/fiber'
import { View } from '@react-three/drei'
import { dpr } from '../lib/device'

export const GL_READY_EVENT = 'mixia:gl-ready'

function Ready() {
  useEffect(() => {
    window.dispatchEvent(new Event(GL_READY_EVENT))
  }, [])
  return null
}

/**
 * Un solo canvas fijo para toda la página. Cada sección dibuja su escena en un
 * `View` anclado a un div, así compartimos un único contexto WebGL.
 */
export default function GL({ eventSource }: { eventSource: RefObject<HTMLElement> }) {
  return (
    <div className="gl" aria-hidden="true">
      <Canvas
        eventSource={eventSource}
        eventPrefix="client"
        dpr={dpr}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Ready />
        <View.Port />
      </Canvas>
    </div>
  )
}
