/* Desplazamiento común a puntos y aristas: respiración lenta + repulsión del puntero. */
const displace = /* glsl */ `
  uniform float uTime;
  uniform vec3 uPointer;
  uniform float uPointerStrength;
  uniform float uAssemble;
  uniform float uPulse;

  float vAssembleOut;

  vec3 displace(vec3 p, float r, out float influence) {
    // Al cargar, cada partícula llega desde una nube cercana y tenue, con su propio retraso (r).
    float a = smoothstep(r * 0.5, r * 0.5 + 0.5, uAssemble);
    a = 1.0 - pow(1.0 - a, 3.0);
    vec3 far = p * 1.25 + vec3(sin(r * 41.0), cos(r * 29.0), sin(r * 17.0)) * 0.35;
    p = mix(far, p, a);
    vAssembleOut = a;
    float breath = sin(uTime * 0.7 + r * 6.2831) * 0.014;
    p += normalize(p + 1e-4) * breath;
    vec3 d = p - uPointer;
    float dist = length(d);
    influence = smoothstep(0.62, 0.0, dist) * uPointerStrength;
    p += normalize(d + 1e-4) * influence * 0.22;
    // Onda del clic: un anillo que sale del puntero y recorre la red, apagándose.
    float radius = uPulse * 2.4;
    float ring = smoothstep(0.3, 0.0, abs(dist - radius)) * exp(-uPulse * 1.4) * step(0.0, uPulse);
    p += normalize(d + 1e-4) * ring * 0.16;
    influence += ring * 1.4;
    return p;
  }

  vec3 gradientColor(float x) {
    vec3 cyan = vec3(0.37, 0.90, 0.94);
    vec3 peri = vec3(0.55, 0.55, 0.96);
    vec3 violet = vec3(0.75, 0.52, 0.94);
    float t = clamp((x + 1.0) / 1.15, 0.0, 1.0);
    return t < 0.5 ? mix(cyan, peri, t * 2.0) : mix(peri, violet, (t - 0.5) * 2.0);
  }
`

export const pointsVertex = /* glsl */ `
  ${displace}
  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uColorShift;
  attribute float aRand;
  attribute float aSize;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float influence;
    vec3 p = displace(position, aRand, influence);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uSize * uPixelRatio * (1.0 / -mv.z);
    vColor = gradientColor(position.x + uColorShift) + influence * 0.6;
    vAlpha = (0.35 + 0.4 * aRand + influence * 1.2) * mix(0.08, 1.0, vAssembleOut);
  }
`

export const pointsFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float soft = smoothstep(0.5, 0.18, d);
    float core = smoothstep(0.22, 0.0, d);
    float a = (soft * 0.4 + core * 0.9) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor * (0.7 + core * 0.6), a);
  }
`

export const linesVertex = /* glsl */ `
  ${displace}
  attribute float aT;
  attribute float aPhase;
  attribute float aRand;
  varying float vT;
  varying float vPhase;
  varying vec3 vColor;
  varying float vInfluence;

  void main() {
    float influence;
    vec3 p = displace(position, aRand, influence);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    vT = aT;
    vPhase = aPhase;
    vInfluence = influence;
    vColor = gradientColor(position.x);
  }
`

export const linesFragment = /* glsl */ `
  uniform float uTime;
  uniform float uLineAlpha;
  uniform float uAssemble;
  varying float vT;
  varying float vPhase;
  varying vec3 vColor;
  varying float vInfluence;

  void main() {
    // Un pulso de luz viaja por cada arista a su propio ritmo.
    float pulse = fract(uTime * 0.22 + vPhase * 3.0);
    float d = abs(vT - pulse);
    float p = smoothstep(0.2, 0.0, d) * step(0.72, fract(vPhase * 7.0 + 0.1) + 0.5);
    float a = uLineAlpha * smoothstep(0.82, 1.0, uAssemble) * (0.22 + p * 1.0 + vInfluence * 0.8);
    gl_FragColor = vec4(vColor * (0.7 + p * 0.8), a);
  }
`
