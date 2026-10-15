// Uso: node scripts/pantalla.mjs <url> <out.png> [selector] [mobile]  → una captura con el selector arriba
import { chromium } from 'playwright-core'
const [url, out, selector, mode] = process.argv.slice(2)
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
page.on('pageerror', (e) => errors.push(e.message))
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(3500)
if (selector && selector !== '-') {
  await page.evaluate(
    (sel) => window.scrollTo(0, document.querySelector(sel).getBoundingClientRect().top + window.scrollY - 72),
    selector,
  )
  await page.waitForTimeout(1500)
}
await page.screenshot({ path: out })
console.log(errors.length ? errors.join('\n') : 'ok')
await browser.close()
