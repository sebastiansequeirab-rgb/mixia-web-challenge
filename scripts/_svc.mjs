import { chromium } from "playwright-core"
const [url, out, mode] = process.argv.slice(2)
const mobile = mode === 'mobile'
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const ctx = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 }, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile })
const page = await ctx.newPage()
const errors = []
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
page.on('pageerror', (e) => errors.push(e.message))
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(3000)
await page.evaluate(() => document.querySelector('.services-explorer').scrollIntoView())
await page.waitForTimeout(1200)
const rows = page.locator('.service-row')
if (mobile) { await rows.nth(2).tap(); } else { await rows.nth(2).hover() }
await page.waitForTimeout(900)
await page.screenshot({ path: `${out}-a.png` })
if (!mobile) { await rows.nth(6).hover(); await page.waitForTimeout(900); await page.screenshot({ path: `${out}-b.png` }) }
console.log(errors.length ? errors.join('\n') : 'no console errors')
await browser.close()
