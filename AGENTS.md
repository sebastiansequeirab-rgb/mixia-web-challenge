# AGENTS.md

Sitio de una página para el Mixia Web Challenge. Lee `README.md` para el qué; aquí va el cómo.

## Comandos

- `npm run dev` levanta Vite en 5173. `npm run build` corre `tsc -b` y luego Vite; si tsc falla, no hay build.
- Formato: `npx prettier --write "src/**/*.{ts,tsx,css}" --print-width 120 --no-semi --single-quote`.
- Video de presentación: `node scripts/cuadros.mjs <url> <carpeta> [mobile]` graba cuadro a cuadro con
  reloj controlado (30 fps exactos, el 3D sale fluido; `scripts/video.mjs` graba en vivo y da tirones).
  Música propia con `python3 scripts/musica.py <wav> <segundos>` (numpy). Montaje en `docs/HANDOFF.md`.
  El mp4 final vive en `docs/video/` y no se versiona (pesa ~28 MB).
- Deploy: `vercel --prod --yes` desde la raíz. El alias público es https://mixia-web-challenge.vercel.app.

## Reglas del código

- **Un solo canvas.** `src/three/Scene.tsx` monta el único `<Canvas>`; cada escena va dentro de un
  `<View>` de drei anclado a su div. No abrir más canvases.
- **No usar `MeshTransmissionMaterial` de drei dentro de un `View`**: renderiza negro (el buffer de
  transmisión ignora la viewport del View). Para vidrio, usar `Glass` de `src/three/Studio.tsx`.
- **Un solo motor de scroll.** Lenis alimenta a GSAP ScrollTrigger (`src/lib/scroll.ts`). No usar
  `ScrollControls` de drei ni `scroll-behavior: smooth`.
- Las escenas leen el scroll por `RefObject<number>` (`useSectionProgress`), nunca por estado de React.
- Shaders propios (`Brain`, `ParticleM`): R3F copia el objeto `uniforms` al aplicarlo; mutar el
  objeto de `useMemo` no llega al material. Sincronizar en `material.uniforms[k].value` cada frame.
- Nada de texto con degradado, etiquetas en mayúsculas con tracking, chips, blur de vidrio ni
  barras de color en un lado: son rastros de diseño por IA (ronda 5). Énfasis = peso 300 o color sólido.
- `src/lib/device.ts` decide `lowPower` y `prefersReducedMotion`; toda escena nueva debe respetarlos.
- Productos en escritorio es una sección fijada (`ScrollTrigger.pin`) con un solo `View`
  (`src/three/ProductStage.tsx`); la matemática de tramos vive en `src/lib/stage.ts` sin importar
  Three, porque el DOM también la usa y meter Three en el chunk principal cuesta 80 kB. Móvil
  (<860 px) y reduced motion usan los tres bloques apilados. `node scripts/escenario.mjs <url> <prefijo>`
  captura la sección fijada en 8 puntos del scroll.
- React queda fijado en 19.3.x: React Three Fiber 9.8 exige `react >=19 <19.4`.
- Textos: todo pasa por `src/i18n/es.ts` y `en.ts`. Nada de strings sueltos en los componentes.
- Copy en "usted", beneficio primero. Nunca escribir "anti-robo" para Mixia Lock. Nunca publicar
  las cifras marcadas sin fuente pública ($2M en un fin de semana).

## Contenido

- Marcas en `public/brand/`. Las pantallas de Mixia Lock se dibujan en canvas 2D
  (`src/three/lockScreens.ts`, textos en i18n bajo `products.lock.screens`); no usar capturas
  de clientes (LifePhone, Damasco).
- Logos de clientes en `public/clientes/` con su fuente en `FUENTES.md`; se pintan en blanco con
  `mask-image`, así que sirven en cualquier color. El que no tiene archivo va como wordmark.
- Tipografía: Unbounded Variable para títulos y Hanken Grotesk Variable para cuerpo (ronda 4;
  Archivo le pareció "AI generated" a Sebastián). Unbounded es ancha: títulos cortos y tamaños
  moderados. Sin eyebrows con raya ni cifras en cajas (feedback de Sebastián, ronda 2).
- Títulos de sección pasan por `SectionHead`/`Heading` (`src/sections/SectionHead.tsx`); la palabra
  clave en degradado se marca con `*asteriscos*` en el diccionario.
- Contacto no usa servicio externo: el flujo termina en WhatsApp/`mailto:` prellenado. Los CTA de
  productos preseleccionan el interés con el evento `mixia:interest`.
- La imagen OG (`public/og.png`) es una captura del hero; regenerarla si cambia el hero.
