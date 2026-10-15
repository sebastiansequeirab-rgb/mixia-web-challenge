import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js'

/**
 * Genera un hemisferio cerebral en puntos (como el logo de Mixia: medio cerebro a la
 * izquierda) y las aristas entre nodos vecinos que forman la red neuronal.
 */
export type BrainData = {
  positions: Float32Array
  normals: Float32Array
  rand: Float32Array
  size: Float32Array
  linePositions: Float32Array
  lineT: Float32Array
  linePhase: Float32Array
  lineRand: Float32Array
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function buildBrain(count: number, nodeCount: number, seed = 7): BrainData {
  const rnd = mulberry32(seed)
  const noise = new ImprovedNoise()

  const positions = new Float32Array(count * 3)
  const normals = new Float32Array(count * 3)
  const rand = new Float32Array(count)
  const size = new Float32Array(count)

  // Forma: elipsoide (ligeramente más alto que ancho, más profundo que alto) cortado en x <= 0.
  const sx = 0.9
  const sy = 0.98
  const sz = 1.22

  let i = 0
  while (i < count) {
    // Dirección uniforme en la esfera.
    const u = rnd() * 2 - 1
    const phi = rnd() * Math.PI * 2
    const r = Math.sqrt(1 - u * u)
    let nx = r * Math.cos(phi)
    const ny = u
    const nz = r * Math.sin(phi)
    // Hemisferio izquierdo. Dejamos un poco de la cara interna (corte) con menos densidad.
    if (nx > 0.0) {
      if (rnd() > 0.08) continue
      nx = 0.0
    }
    const interior = rnd() < 0.14
    // Surcos: dos octavas de ruido sobre la superficie.
    // Surcos: el ruido fino se pliega (abs) para formar crestas y valles como circunvoluciones.
    const n1 = noise.noise(nx * 2.2 + 10, ny * 2.2, nz * 2.2)
    const n2 = Math.abs(noise.noise(nx * 6.5, ny * 6.5 + 3, nz * 6.5))
    const bump = 1 + n1 * 0.07 + (n2 - 0.35) * 0.12
    const radius = interior ? bump * (0.45 + rnd() * 0.5) : bump

    positions[i * 3] = nx * radius * sx
    positions[i * 3 + 1] = ny * radius * sy
    positions[i * 3 + 2] = nz * radius * sz
    normals[i * 3] = nx
    normals[i * 3 + 1] = ny
    normals[i * 3 + 2] = nz
    rand[i] = rnd()
    // Las crestas brillan más que los valles: así se leen los pliegues.
    const ridge = interior ? 0.5 : 0.6 + n2 * 1.1
    size[i] = (interior ? 0.5 + rnd() * 0.5 : 0.7 + rnd() * 1.0) * ridge
    i++
  }

  // Nodos: un subconjunto de puntos de superficie, conectados a sus vecinos cercanos.
  const nodes: number[] = []
  for (let k = 0; k < count && nodes.length < nodeCount; k += Math.max(1, Math.floor(count / nodeCount))) {
    nodes.push(k)
  }
  const maxDist = 0.26
  const maxLinks = 3
  const segs: number[] = []
  const segT: number[] = []
  const segPhase: number[] = []
  const segRand: number[] = []
  for (let a = 0; a < nodes.length; a++) {
    const ia = nodes[a]
    const ax = positions[ia * 3]
    const ay = positions[ia * 3 + 1]
    const az = positions[ia * 3 + 2]
    const near: { d: number; ib: number }[] = []
    for (let b = a + 1; b < nodes.length; b++) {
      const ib = nodes[b]
      const dx = positions[ib * 3] - ax
      const dy = positions[ib * 3 + 1] - ay
      const dz = positions[ib * 3 + 2] - az
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
      if (d < maxDist) near.push({ d, ib })
    }
    near.sort((p, q) => p.d - q.d)
    for (let n = 0; n < Math.min(maxLinks, near.length); n++) {
      const ib = near[n].ib
      const phase = rnd()
      segs.push(ax, ay, az, positions[ib * 3], positions[ib * 3 + 1], positions[ib * 3 + 2])
      segT.push(0, 1)
      segPhase.push(phase, phase)
      segRand.push(rand[ia], rand[ib])
    }
  }

  return {
    positions,
    normals,
    rand,
    size,
    linePositions: new Float32Array(segs),
    lineT: new Float32Array(segT),
    linePhase: new Float32Array(segPhase),
    lineRand: new Float32Array(segRand),
  }
}
