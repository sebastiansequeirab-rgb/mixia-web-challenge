// Uso: node scripts/inspiracion.mjs <url> <outprefix>  → 14 capturas por tramos de 800 px + títulos y tecnología de la página
import { chromium } from "playwright-core"
const [url, out] = process.argv.slice(2)
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36' })
const page = await ctx.newPage()
await page.goto(url, { waitUntil: 'load', timeout: 60000 })
await page.waitForTimeout(5000)
const total = await page.evaluate(() => document.body.scrollHeight)
console.log('height', total)
const heads = await page.evaluate(() => [...document.querySelectorAll('h1,h2,h3')].slice(0, 60).map(h => h.tagName + ' ' + h.textContent.trim().replace(/\s+/g, ' ').slice(0, 90)))
console.log(heads.join('\n'))
const tech = await page.evaluate(() => ({ canvas: document.querySelectorAll('canvas').length, video: document.querySelectorAll('video').length, lottie: document.querySelectorAll('[class*=lottie], lottie-player, dotlottie-player').length, svgAnim: document.querySelectorAll('svg animate, svg animateTransform').length, scripts: [...document.scripts].map(s => s.src).filter(Boolean).map(s => s.split('/').pop()).slice(0, 40) }))
console.log(JSON.stringify(tech))
let n = 1
for (let y = 0; y < total && n <= 14; y += 800) {
  await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y)
  await page.waitForTimeout(1500)
  await page.screenshot({ path: `${out}-${String(n).padStart(2, '0')}.png` })
  n++
}
await browser.close()
