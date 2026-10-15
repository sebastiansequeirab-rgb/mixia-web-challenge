/* Desplazamiento común a puntos y aristas: respiración lenta + repulsión del puntero. */
const displace = /* glsl */ `
  uniform float uTime;
  uniform vec3 uPointer;
  uniform float uPointerStrength;

  vec3 displace(vec3 p, float r, out float influence) {
    float breath = sin(uTime * 0.7 + r * 6.2831) * 0.014;
    p += normalize(p + 1e-4) * breath;
    vec3 d = p - uPointer;
    float dist = length(d);
    influence = smoothstep(0.62, 0.0, dist) * uPointerStrength;
    p += normalize(d + 1e-4) * influence * 0.22;
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
    vAlpha = 0.35 + 0.4 * aRand + influence * 1.2;
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
  varying float vT;
  varying float vPhase;
  varying vec3 vColor;
  varying float vInfluence;

  void main() {
    // Un pulso de luz viaja por cada arista a su propio ritmo.
    float pulse = fract(uTime * 0.22 + vPhase * 3.0);
    float d = abs(vT - pulse);
    float p = smoothstep(0.2, 0.0, d) * step(0.72, fract(vPhase * 7.0 + 0.1) + 0.5);
    float a = uLineAlpha * (0.22 + p * 1.0 + vInfluence * 0.8);
    gl_FragColor = vec4(vColor * (0.7 + p * 0.8), a);
  }
`
