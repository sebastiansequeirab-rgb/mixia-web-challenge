// Uso: node og.mjs <url> <out.png>  → captura 1200x630 del hero en español
import { chromium } from "playwright-core"

const [url, out] = process.argv.slice(2)
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2, locale: 'es-VE' })
const page = await ctx.newPage()
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(5000)
await page.mouse.move(900, 300)
await page.waitForTimeout(800)
await page.addStyleTag({ content: '.hero-scroll,.hero-hint{display:none !important}' })
await page.screenshot({ path: out })
await browser.close()
console.log('ok', out)
