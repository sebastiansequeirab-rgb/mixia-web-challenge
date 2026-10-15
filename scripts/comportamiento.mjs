// Pruebas de comportamiento: toggle de idioma, anclas con Lenis, reduced motion, consola limpia
import { chromium } from "playwright-core"

const url = process.argv[2]
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const out = []

{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'es-VE' })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(4000)
  out.push('lang inicial: ' + (await page.evaluate(() => document.documentElement.lang)))
  out.push('h1 ES: ' + (await page.textContent('h1')).trim())
  await page.click('.lang')
  await page.waitForTimeout(800)
  out.push('h1 EN: ' + (await page.textContent('h1')).trim())
  out.push('lang tras toggle: ' + (await page.evaluate(() => document.documentElement.lang)))
  out.push('title: ' + (await page.title()))
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(3500)
  out.push('persistido tras reload: ' + (await page.evaluate(() => document.documentElement.lang)))
  // ancla
  await page.click('.nav-links a[href="#servicios"]')
  await page.waitForTimeout(2500)
  const top = await page.evaluate(() => document.getElementById('servicios').getBoundingClientRect().top)
  out.push('ancla #servicios top tras click: ' + Math.round(top))
  // sin overflow horizontal
  out.push('scrollWidth vs innerWidth: ' + (await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth].join('/'))))
  out.push('errores consola: ' + (errors.length ? errors.join(' | ') : 'ninguno'))
  await ctx.close()
}
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce', locale: 'es-VE' })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(4000)
  out.push('móvil reduced-motion h1 visible: ' + (await page.isVisible('h1')))
  out.push('móvil reduced-motion stat: ' + (await page.textContent('.stat b')))
  out.push('móvil scrollWidth/innerWidth: ' + (await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth].join('/'))))
  const opacity = await page.evaluate(() => getComputedStyle(document.querySelector('.reveal')).opacity)
  out.push('móvil reduced-motion .reveal opacity: ' + opacity)
  out.push('móvil errores: ' + (errors.length ? errors.join(' | ') : 'ninguno'))
  await ctx.close()
}
await browser.close()
console.log(out.join('\n'))
