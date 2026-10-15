# Mixia Web Challenge

Sitio de una página para Mixia Soluciones Integrales: quiénes somos, los tres productos en
producción (Ventia, Mixia Lock y SmartMed), servicios, clientes y contacto. Hecho para el
hackathon interno **Mixia Web Challenge** (octubre 2026).

## Qué tiene

- **Three.js obligatorio, usado en serio.** Un solo canvas WebGL fijo detrás de la página; cada
  sección dibuja su escena en una viewport propia (`View` de drei) para no abrir varios contextos.
  - Hero: hemisferio cerebral de 6.500 partículas con red de aristas y pulsos de luz en shader
    GLSL propio, reacciona al puntero y al scroll. Al lado, la "M" del logo extruida en vidrio
    iridiscente.
  - Ventia: tarjeta de crédito 3D que gira con el scroll.
  - Mixia Lock: teléfono con la pantalla de bloqueo real y un candado que se abre al pasar la
    mitad de la sección.
  - SmartMed: anillos de vidrio con línea de electrocardiograma animada y módulos orbitando.
- **Responsive** de 360 px a 4K. En móvil baja partículas, quita refracción y limita el DPR.
- **Accesible**: HTML semántico, foco visible, contraste AA, `prefers-reduced-motion` respetado.
- **Español e inglés** con un toggle, sin librerías de i18n.
- Sin dependencias de red en runtime: fuentes y entorno de luz vienen en el bundle.

## Stack

Vite 8 · React 19 · Three.js 0.186 · React Three Fiber 9 · drei 10 · GSAP 3 (ScrollTrigger) ·
Lenis. Tipografías Bricolage Grotesque e Instrument Sans (OFL) vía Fontsource.

## Correr

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
npm run preview  # sirve dist/
```

## Deploy

Sitio estático. En Vercel no hace falta configuración: `vercel --prod`. En Netlify, publish
dir `dist`. En GitHub Pages hay que fijar `base` en `vite.config.ts` al nombre del repo.

## Estructura

```
src/
  i18n/        diccionarios es/en y el hook useT
  lib/         scroll (Lenis + ScrollTrigger), capacidades del dispositivo, hooks de reveal
  sections/    Loader, Nav, Hero, Stats, Products, Services, Clients, Contact, Footer
  three/       Scene (canvas único), Brain + shaders, GlassM, VentiaCard, LockPhone, SmartMedPulse
  styles/      global.css con los tokens de diseño
public/brand/  marcas de Mixia, Ventia y SmartMed
```
