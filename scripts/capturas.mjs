// Uso: node shot.mjs <url> <outprefix> [mobile]
import { chromium } from "playwright-core"

const [url, out, mode] = process.argv.slice(2)
const mobile = mode === 'mobile'
const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'],
})
const ctx = await browser.newContext({
  viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
  deviceScaleFactor: mobile ? 2 : 1,
  isMobile: mobile,
  hasTouch: mobile,
})
const page = await ctx.newPage()
const errors = []
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${m.type()}] ${m.text()}`)
})
page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`))
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(4500)
await page.mouse.move(1000, 400)
await page.waitForTimeout(600)
await page.screenshot({ path: `${out}-1-hero.png` })

const total = await page.evaluate(() => document.body.scrollHeight)
const vh = mobile ? 844 : 900
let n = 2
for (let y = vh; y < total; y += vh) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y)
  await page.waitForTimeout(900)
  await page.screenshot({ path: `${out}-${n}.png` })
  n++
  if (n > 9) break
}
console.log('height', total, 'shots', n - 1)
console.log(errors.length ? errors.join('\n') : 'no console errors')
await browser.close()
