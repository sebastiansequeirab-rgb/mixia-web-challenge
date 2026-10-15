// Uso: node scripts/laptop.mjs <url> <outprefix> <ancho> <alto>  → recorre la página en ese viewport, una captura por pantalla
import { chromium } from 'playwright-core'
const [url, out, w, h] = process.argv.slice(2)
const W = Number(w), H = Number(h)
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const page = await (await browser.newContext({ viewport: { width: W, height: H }, locale: 'es-VE' })).newPage()
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(6000)
await page.mouse.move(W * 0.75, H * 0.5)
await page.waitForTimeout(500)
await page.screenshot({ path: `${out}-1.png` })
const total = await page.evaluate(() => document.body.scrollHeight)
let n = 2
for (let y = H; y < total && n <= 14; y += H * 0.9) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y)
  await page.waitForTimeout(1000)
  await page.screenshot({ path: `${out}-${n}.png` })
  n++
}
console.log(W + 'x' + H, 'alto', total, 'capturas', n - 1, 'scrollWidth', await page.evaluate(() => document.documentElement.scrollWidth), errors.length ? errors.join(' | ') : 'sin errores')
await browser.close()
