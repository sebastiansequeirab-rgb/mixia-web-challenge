// Uso: node scripts/escenario.mjs <url> <outprefix>  → capturas de la sección fijada de productos en 8 puntos del scroll
import { chromium } from 'playwright-core'
const [url, out] = process.argv.slice(2)
const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'],
})
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage()
const errors = []
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${m.type()}] ${m.text()}`)
})
page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`))
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(4000)
const top = await page.evaluate(
  () => document.querySelector('.products-stage').getBoundingClientRect().top + window.scrollY,
)
const steps = [0, 0.12, 0.33, 0.45, 0.58, 0.66, 0.8, 0.98]
for (const f of steps) {
  await page.evaluate((y) => window.scrollTo(0, y), top + f * 900 * 3.2)
  await page.waitForTimeout(1400)
  await page.screenshot({ path: `${out}-${String(f).replace('.', '')}.png` })
}
console.log('top', top)
console.log(errors.length ? errors.join('\n') : 'no console errors')
await browser.close()
