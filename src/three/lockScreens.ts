import * as THREE from 'three'
import type { Dictionary } from '../i18n/es'

export type LockScreens = Dictionary['products']['lock']['screens']
export type ScreenKind = 'register' | 'unlocked' | 'locked'
export const SCREEN_ORDER: ScreenKind[] = ['register', 'unlocked', 'locked']

const W = 560
const H = 1275
const FONT = "'Archivo Variable', system-ui, sans-serif"
const INK = '#0b1020'
const INK2 = '#121a30'
const TEXT = '#eef1f7'
const MUTED = '#8c93aa'
const PERI = '#8b8cf5'
const GREEN = '#4ade80'
const AMBER = '#f2a552'

let markImage: HTMLImageElement | null = null
let markLoading: Promise<HTMLImageElement> | null = null
function loadMark() {
  if (markImage) return Promise.resolve(markImage)
  if (!markLoading) {
    markLoading = new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        markImage = img
        resolve(img)
      }
      img.onerror = () => resolve(img)
      img.src = '/brand/mixia-mark.png'
    })
  }
  return markLoading
}

function roundRect(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath()
  c.roundRect(x, y, w, h, r)
}

function font(c: CanvasRenderingContext2D, size: number, weight = 500, wdth = 100) {
  c.font = `${weight} ${size}px ${FONT}`
  c.fontStretch = wdth >= 112 ? 'expanded' : wdth <= 90 ? 'condensed' : 'normal'
}

/** Barra de estado + cabecera de marca comunes a las tres pantallas. */
function chrome(c: CanvasRenderingContext2D, s: LockScreens, accent: string) {
  c.fillStyle = INK
  c.fillRect(0, 0, W, H)
  // Resplandor de fondo según el estado.
  const g = c.createRadialGradient(W / 2, 260, 20, W / 2, 260, 520)
  g.addColorStop(0, accent + '33')
  g.addColorStop(1, 'transparent')
  c.fillStyle = g
  c.fillRect(0, 0, W, H)
  // Barra de estado.
  font(c, 26, 600)
  c.fillStyle = TEXT
  c.textAlign = 'left'
  c.fillText('9:41', 44, 66)
  c.textAlign = 'right'
  c.fillStyle = MUTED
  c.fillText('●●● ▲ ▮', W - 44, 66)
  // Marca.
  if (markImage) c.drawImage(markImage, 44, 110, 58, 54)
  font(c, 30, 700, 118)
  c.textAlign = 'left'
  c.fillStyle = TEXT
  c.fillText(s.brand, 118, 140)
  font(c, 22, 500)
  c.fillStyle = MUTED
  c.fillText(s.store, 118, 170)
  // Botón de inicio.
  roundRect(c, W / 2 - 70, H - 36, 140, 8, 4)
  c.fillStyle = '#2a3150'
  c.fill()
}

function field(c: CanvasRenderingContext2D, y: number, label: string, value: string, accent = PERI) {
  font(c, 22, 500)
  c.fillStyle = MUTED
  c.textAlign = 'left'
  c.fillText(label.toUpperCase(), 48, y)
  roundRect(c, 44, y + 16, W - 88, 92, 18)
  c.fillStyle = INK2
  c.fill()
  c.strokeStyle = accent + '66'
  c.lineWidth = 2
  c.stroke()
  font(c, 32, 600)
  c.fillStyle = TEXT
  c.fillText(value, 72, y + 74)
}

function button(c: CanvasRenderingContext2D, y: number, label: string, fill: string, color = INK) {
  roundRect(c, 44, y, W - 88, 104, 22)
  c.fillStyle = fill
  c.fill()
  font(c, 30, 700)
  c.fillStyle = color
  c.textAlign = 'center'
  c.fillText(label, W / 2, y + 66)
}

function title(c: CanvasRenderingContext2D, y: number, text: string, status: string, accent: string) {
  font(c, 54, 760, 118)
  c.fillStyle = TEXT
  c.textAlign = 'left'
  c.fillText(text, 44, y)
  roundRect(c, 44, y + 28, 16, 16, 8)
  c.fillStyle = accent
  c.fill()
  font(c, 26, 600)
  c.fillStyle = accent
  c.fillText(status, 72, y + 44)
}

function wrap(c: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number) {
  const words = text.split(' ')
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (c.measureText(test).width > maxW && line) {
      c.fillText(line, x, y)
      line = w
      y += lh
    } else line = test
  }
  if (line) c.fillText(line, x, y)
}

function drawRegister(c: CanvasRenderingContext2D, s: LockScreens) {
  chrome(c, s, PERI)
  title(c, 300, s.register.title, s.store, PERI)
  field(c, 420, s.register.idLabel, s.register.idValue)
  field(c, 570, s.register.imeiLabel, s.register.imeiValue)
  field(c, 720, s.register.planLabel, s.register.planValue)
  button(c, 900, s.register.button, '#eef1f7')
}

function drawUnlocked(c: CanvasRenderingContext2D, s: LockScreens) {
  chrome(c, s, GREEN)
  // Check grande.
  c.beginPath()
  c.arc(W / 2, 400, 110, 0, Math.PI * 2)
  c.fillStyle = GREEN + '22'
  c.fill()
  c.strokeStyle = GREEN
  c.lineWidth = 10
  c.lineCap = 'round'
  c.lineJoin = 'round'
  c.beginPath()
  c.moveTo(W / 2 - 50, 400)
  c.lineTo(W / 2 - 12, 440)
  c.lineTo(W / 2 + 56, 356)
  c.stroke()
  title(c, 620, s.unlocked.title, s.unlocked.status, GREEN)
  font(c, 26, 500)
  c.fillStyle = MUTED
  c.textAlign = 'left'
  c.fillText(s.unlocked.hint, 44, 720)
  // Progreso de cuotas.
  font(c, 22, 500)
  c.fillText(s.unlocked.progressLabel.toUpperCase(), 48, 820)
  roundRect(c, 44, 840, W - 88, 14, 7)
  c.fillStyle = INK2
  c.fill()
  roundRect(c, 44, 840, (W - 88) / 3, 14, 7)
  c.fillStyle = GREEN
  c.fill()
  field(c, 920, s.unlocked.nextLabel, s.unlocked.nextValue, GREEN)
}

function drawLocked(c: CanvasRenderingContext2D, s: LockScreens) {
  chrome(c, s, AMBER)
  // Candado.
  c.beginPath()
  c.arc(W / 2, 400, 110, 0, Math.PI * 2)
  c.fillStyle = AMBER + '22'
  c.fill()
  c.strokeStyle = AMBER
  c.lineWidth = 12
  c.lineCap = 'round'
  c.beginPath()
  c.arc(W / 2, 378, 36, Math.PI, 0)
  c.stroke()
  roundRect(c, W / 2 - 56, 380, 112, 84, 16)
  c.fillStyle = AMBER
  c.fill()
  c.beginPath()
  c.arc(W / 2, 418, 10, 0, Math.PI * 2)
  c.fillStyle = INK
  c.fill()
  title(c, 620, s.locked.title, s.locked.status, AMBER)
  font(c, 26, 500)
  c.fillStyle = MUTED
  c.textAlign = 'left'
  wrap(c, s.locked.hint, 44, 720, W - 88, 36)
  field(c, 830, s.locked.codeLabel, s.locked.codeValue, AMBER)
  button(c, 990, s.locked.button, AMBER)
  font(c, 26, 600)
  c.fillStyle = MUTED
  c.textAlign = 'center'
  c.fillText(s.locked.paid, W / 2, 1150)
}

const drawers: Record<ScreenKind, (c: CanvasRenderingContext2D, s: LockScreens) => void> = {
  register: drawRegister,
  unlocked: drawUnlocked,
  locked: drawLocked,
}

/** Dibuja las tres pantallas de la app de Mixia Lock en canvas 2D y las devuelve como texturas. */
export function buildLockScreens(s: LockScreens) {
  const textures = {} as Record<ScreenKind, THREE.CanvasTexture>
  const canvases = {} as Record<ScreenKind, HTMLCanvasElement>
  for (const kind of SCREEN_ORDER) {
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    canvases[kind] = canvas
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    textures[kind] = tex
  }
  const paint = () => {
    for (const kind of SCREEN_ORDER) {
      const c = canvases[kind].getContext('2d')!
      drawers[kind](c, s)
      textures[kind].needsUpdate = true
    }
  }
  paint()
  // Repinta cuando lleguen el logo y la fuente.
  loadMark().then(paint)
  document.fonts?.ready.then(paint)
  return textures
}
