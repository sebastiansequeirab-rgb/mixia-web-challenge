// Uso: node scripts/cuadros.mjs <url> <carpeta> [mobile]
// Graba cuadro a cuadro con reloj controlado (30 fps exactos): el 3D sale fluido, sin tirones.
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'
const [url, dir, mode] = process.argv.slice(2)
const mobile = mode === 'mobile'
const W = mobile ? 390 : 1440, H = mobile ? 844 : 900
const FPS = 30, STEP = 1000 / FPS
mkdirSync(dir, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile, locale: 'es-VE' })
const page = await ctx.newPage()
await page.clock.install({ time: new Date('2026-10-15T20:00:00') })
await page.goto(url, { waitUntil: 'networkidle' })
let frame = 0
const shot = async () => { await page.screenshot({ path: `${dir}/f${String(frame++).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 92 }) }
const run = async (seconds, perFrame) => {
  const frames = Math.round(seconds * FPS)
  for (let i = 0; i < frames; i++) { if (perFrame) await perFrame(i / Math.max(1, frames - 1)); await page.clock.runFor(STEP); await shot() }
}
const ease = (t) => 1 - Math.pow(1 - t, 3)
const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
let y = 0
const glide = async (to, seconds) => { const from = y; await run(seconds, async (t) => { y = from + (to - from) * easeIO(t); await page.evaluate((v) => window.scrollTo(0, v), y) }) }
const hold = (s) => run(s)
const top = async (sel, off = 0) => page.evaluate(([s, o]) => document.querySelector(s).getBoundingClientRect().top + window.scrollY + o, [sel, off])
// Carga: dejar correr el loader + armado del isotipo (sin grabar los primeros 1,2 s de loader)
await page.clock.runFor(1200)
await run(3.2) // armado del isotipo
if (!mobile) {
  // Cursor sobre la red, clic, onda
  await run(2.4, async (t) => { await page.mouse.move(980 + Math.sin(t * 6.3) * 200, 430 + Math.cos(t * 5) * 150) })
  await page.mouse.down(); await page.mouse.up()
  await run(1.6, async (t) => { await page.mouse.move(980 + Math.sin(2 + t * 3) * 120, 430 + Math.cos(2 + t * 3) * 90) })
  await page.mouse.move(1200, 200)
  await glide(await top('.stats', -90), 1.4); await hold(1.6)
  const stageTop = await top('.products-stage'); const span = H * 3.2
  await glide(stageTop, 1.2); await hold(0.8)
  await glide(stageTop + span * 0.15, 1.6); await hold(1.2)
  await glide(stageTop + span * 0.45, 1.8); await hold(0.6)
  await glide(stageTop + span * 0.72, 2.0); await hold(1.6)
  await glide(stageTop + span * 0.92, 1.8); await hold(1.4)
  await glide(await top('.mosaic', -100), 1.6); await hold(0.5)
  for (const n of [4, 5, 8]) { const b = await (await page.$(`.tile:nth-child(${n})`)).boundingBox(); if (!b) continue; const sx = 1200, sy = 300; await run(0.5, async (t) => { await page.mouse.move(sx + (b.x + b.width * 0.55 - sx) * ease(t), sy + (b.y + b.height * 0.55 - sy) * ease(t)) }); await hold(1.0) }
  await glide(await top('#clientes', -60), 1.4); await hold(1.6)
  await glide(await top('#contacto', -40), 1.4); await hold(0.6)
  await page.click('.flow-interest.lock'); await hold(2.0)
} else {
  await hold(0.8)
  await glide(await top('.product:nth-of-type(1)', -70), 1.6); await hold(1.4)
  await glide(await top('.product:nth-of-type(2)', -70), 1.6); await hold(1.6)
  await glide(await top('.mosaic', -90), 1.6); await hold(0.4)
  await glide(await top('.tile:nth-child(5)', -90), 1.4); await hold(1.2)
  await glide(await top('#contacto', -40), 1.6); await hold(0.6)
  await page.click('.flow-interest.lock'); await hold(1.6)
}
console.log('frames', frame, 'segundos', (frame / FPS).toFixed(1))
await browser.close()
