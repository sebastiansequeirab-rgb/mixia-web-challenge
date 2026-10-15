import { Environment, Lightformer } from '@react-three/drei'
import { lowPower } from '../lib/device'

/** Iluminación de estudio sin descargar HDR: unos paneles de luz en un entorno propio. */
export function Studio({ intensity = 1 }: { intensity?: number }) {
  return (
    <>
      <ambientLight intensity={0.35 * intensity} />
      <directionalLight position={[3, 4, 5]} intensity={1.2 * intensity} color="#ffffff" />
      <directionalLight position={[-4, -2, 2]} intensity={0.6 * intensity} color="#8b8cf5" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 2]} scale={[6, 2, 1]} color="#ffffff" />
        <Lightformer
          form="rect"
          intensity={2.5}
          position={[-5, 1, 1]}
          rotation-y={Math.PI / 2}
          scale={[4, 3, 1]}
          color="#5ee6f0"
        />
        <Lightformer
          form="rect"
          intensity={2.5}
          position={[5, -1, 1]}
          rotation-y={-Math.PI / 2}
          scale={[4, 3, 1]}
          color="#c084f0"
        />
        <Lightformer form="ring" intensity={1.5} position={[0, -3, -3]} scale={3} color="#8b8cf5" />
      </Environment>
    </>
  )
}

/**
 * Vidrio iridiscente con el material físico nativo de Three. Sobre fondo oscuro, la
 * refracción aporta poco: lo que luce son los reflejos del entorno y la iridiscencia.
 */
export function Glass({
  color = '#c9d2ff',
  tint = '#8b8cf5',
  transmission = 1,
}: {
  color?: string
  tint?: string
  transmission?: number
}) {
  return (
    <meshPhysicalMaterial
      color={color}
      transmission={lowPower ? 0 : transmission}
      thickness={1.2}
      ior={1.45}
      roughness={0.1}
      metalness={lowPower ? 0.3 : 0.15}
      clearcoat={1}
      clearcoatRoughness={0.08}
      iridescence={0.9}
      iridescenceIOR={1.3}
      iridescenceThicknessRange={[120, 700]}
      envMapIntensity={2.2}
      attenuationColor={tint}
      attenuationDistance={1.5}
      specularIntensity={1}
    />
  )
}
