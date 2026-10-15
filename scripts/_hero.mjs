// node hero.mjs <url> <outprefix> [selector] [mobile] : captura un elemento en 3 momentos
import { chromium } from "playwright-core"
const [url, out, sel = '.hero', mode] = process.argv.slice(2)
const mobile = mode === 'mobile'
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const ctx = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 }, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile })
const page = await ctx.newPage()
const errors = []
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${m.type()}] ${m.text()}`) })
page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`))
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(3500)
await page.locator(sel).first().scrollIntoViewIfNeeded()
await page.waitForTimeout(200)
for (let i = 0; i < 5; i++) {
  if (!mobile) await page.mouse.move(700 + i * 150, 450)
  await page.screenshot({ path: `${out}-${i + 1}.png` })
  await page.waitForTimeout(Number(process.env.STEP ?? 1300))
}
console.log(errors.length ? errors.join('\n') : 'no console errors')
await browser.close()
