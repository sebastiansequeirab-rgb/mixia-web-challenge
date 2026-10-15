// Uso: node scripts/video.mjs <url> <carpeta-salida> [mobile]  → graba un recorrido de la página (webm en la carpeta)
import { chromium } from 'playwright-core'
const [url, dir, mode] = process.argv.slice(2)
const mobile = mode === 'mobile'
const W = mobile ? 390 : 1440, H = mobile ? 844 : 900
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const ctx = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: mobile ? 2 : 1,
  isMobile: mobile,
  hasTouch: mobile,
  locale: 'es-VE',
  recordVideo: { dir, size: { width: mobile ? 780 : 1440, height: mobile ? 1688 : 900 } },
})
const page = await ctx.newPage()
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(5500) // loader + armado del isotipo
const wait = (ms) => page.waitForTimeout(ms)
const glide = async (to, ms = 1400) => {
  const from = await page.evaluate(() => window.scrollY)
  const steps = Math.max(10, Math.round(ms / 16))
  for (let i = 1; i <= steps; i++) {
    const t = i / steps, e = 1 - Math.pow(1 - t, 3)
    await page.evaluate((y) => window.scrollTo(0, y), from + (to - from) * e)
    await wait(16)
  }
}
const top = async (sel, off = 0) => page.evaluate(([s, o]) => document.querySelector(s).getBoundingClientRect().top + window.scrollY + o, [sel, off])
if (!mobile) {
  // Hero: cursor sobre la red, clic (onda), vuelta
  for (let i = 0; i <= 40; i++) { await page.mouse.move(900 + Math.sin(i / 6) * 220, 420 + Math.cos(i / 7) * 160); await wait(40) }
  await page.mouse.down(); await page.mouse.up(); await wait(1400)
  await page.mouse.move(1100, 300); await wait(600)
}
await glide(await top('.stats', -90), 1600); await wait(2600)
const stageTop = await top('.products-stage')
await glide(stageTop, 1500); await wait(1200)
const span = H * 3.2
for (const f of [0.14, 0.42, 0.6, 0.72, 0.9]) { await glide(stageTop + span * f, 2200); await wait(1500) }
if (mobile) { for (const sel of ['.product:nth-of-type(2)', '.product:nth-of-type(3)']) { await glide(await top(sel, -80), 1600); await wait(1800) } }
await glide(await top('#servicios', -40), 1600); await wait(800)
await glide(await top('.mosaic', -90), 1200); await wait(600)
if (!mobile) {
  for (const n of [2, 4, 5, 8]) { const b = await (await page.$(`.tile:nth-child(${n})`)).boundingBox(); if (!b) continue; await page.mouse.move(b.x + b.width * 0.55, b.y + b.height * 0.55, { steps: 18 }); await wait(1300) }
} else { await glide(await top('.tile:nth-child(5)', -100), 1800); await wait(1200) }
await glide(await top('#clientes', -60), 1500); await wait(2200)
await glide(await top('#contacto', -40), 1600); await wait(1000)
await page.click('.flow-interest.lock'); await wait(1200)
await page.type('.flow-panel input[type=text]', 'Sebastián', { delay: 70 }); await wait(300)
await page.type('.flow-panel input[type=email]', 'seb@mixia.org', { delay: 60 }); await wait(500)
await page.click('.flow-panel button[type=submit]'); await wait(2200)
await glide(await top('.contact-direct', -120), 1400); await wait(2000)
await ctx.close(); await browser.close()
console.log('ok')
