// Uso: node scripts/tipografia.mjs <url> <out.png> "<familia display>" "<familia cuerpo>" [stretch]
// Muestra el hero con otra tipografía (Google Fonts) sin instalar nada: para escoger viendo.
import { chromium } from 'playwright-core'
const [url, out, display, body, stretch = 'normal'] = process.argv.slice(2)
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'es-VE' })).newPage()
await page.goto(url, { waitUntil: 'networkidle' })
const fam = (f) => f.replace(/ /g, '+')
await page.addStyleTag({ content: `@import url('https://fonts.googleapis.com/css2?family=${fam(display)}:wght@400..800&family=${fam(body)}:wght@300..700&display=swap');
:root{--font-display:'${display}',sans-serif !important}
body,button,input{font-family:'${body}',sans-serif !important}
h1,h2,h3,.h-xl,.h-lg,.h-md,.stage-name h3,.tagline{font-family:'${display}',sans-serif !important;font-stretch:${stretch} !important}
.hero-scroll{display:none}` })
await page.waitForTimeout(4500)
await page.mouse.move(1000, 400)
await page.waitForTimeout(500)
await page.screenshot({ path: out })
await page.evaluate(() => window.scrollTo(0, document.querySelector('#productos').getBoundingClientRect().top + window.scrollY + 900 * 1.0))
await page.waitForTimeout(1500)
await page.screenshot({ path: out.replace('.png', '-productos.png') })
await browser.close()
console.log('ok', out)
