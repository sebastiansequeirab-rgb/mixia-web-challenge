# AGENTS.md

Sitio de una página para el Mixia Web Challenge. Lee `README.md` para el qué; aquí va el cómo.

## Comandos

- `npm run dev` levanta Vite en 5173. `npm run build` corre `tsc -b` y luego Vite; si tsc falla, no hay build.
- Formato: `npx prettier --write "src/**/*.{ts,tsx,css}" --print-width 120 --no-semi --single-quote`.
- Deploy: `vercel --prod --yes` desde la raíz. El alias público es https://mixia-web-challenge.vercel.app.

## Reglas del código

- **Un solo canvas.** `src/three/Scene.tsx` monta el único `<Canvas>`; cada escena va dentro de un
  `<View>` de drei anclado a su div. No abrir más canvases.
- **No usar `MeshTransmissionMaterial` de drei dentro de un `View`**: renderiza negro (el buffer de
  transmisión ignora la viewport del View). Para vidrio, usar `Glass` de `src/three/Studio.tsx`.
- **Un solo motor de scroll.** Lenis alimenta a GSAP ScrollTrigger (`src/lib/scroll.ts`). No usar
  `ScrollControls` de drei ni `scroll-behavior: smooth`.
- Las escenas leen el scroll por `RefObject<number>` (`useSectionProgress`), nunca por estado de React.
- `src/lib/device.ts` decide `lowPower` y `prefersReducedMotion`; toda escena nueva debe respetarlos.
- React queda fijado en 19.3.x: React Three Fiber 9.8 exige `react >=19 <19.4`.
- Textos: todo pasa por `src/i18n/es.ts` y `en.ts`. Nada de strings sueltos en los componentes.
- Copy en "usted", beneficio primero. Nunca escribir "anti-robo" para Mixia Lock. Nunca publicar
  las cifras marcadas sin fuente pública ($2M en un fin de semana).

## Contenido

- Marcas en `public/brand/`. La captura de pantalla de bloqueo (`public/textures/lock-screen.png`)
  es la versión white label (LifePhone); no usar capturas con marca Damasco.
- La imagen OG (`public/og.png`) es una captura del hero; regenerarla si cambia el hero.
