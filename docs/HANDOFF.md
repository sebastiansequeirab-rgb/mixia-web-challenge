# Handoff: Mixia Web Challenge, ronda 2 (feedback de Sebastián)

Escrito el 2026-10-15 a las 11:20. Fecha límite: **hoy antes de las 6 pm**. Presentación mañana
16-oct, 5 minutos.

## Estado comprobado

- Sitio en vivo: https://mixia-web-challenge.vercel.app (alias de producción, deploy con
  `vercel --prod --yes`). Repo: https://github.com/sebastiansequeirab-rgb/mixia-web-challenge,
  rama `main`, push directo (repo personal de Sebastián, sin CI).
- Lighthouse del build (preset escritorio, 2026-10-15 11:05): rendimiento 97, accesibilidad 100,
  buenas prácticas 100, SEO 100.
- `scripts/comportamiento.mjs` contra producción: toggle ES/EN persiste, anclas con Lenis,
  móvil 390 px sin scroll horizontal, reduced-motion correcto, consola sin errores.
- Capturas de la versión actual (v1) en `docs/capturas/v1/`: escritorio 1440×900 (`escritorio-*`),
  móvil 390×844 (`movil-*`), loader, menú móvil y secciones en español. Compararlas contra el
  feedback de abajo antes de tocar nada.

## Cómo capturar (ya probado en este Mac)

```bash
npm run dev                                   # 5173
node scripts/capturas.mjs http://localhost:5173/ docs/capturas/v2/escritorio          # 8 capturas scrolleando
node scripts/capturas.mjs http://localhost:5173/ docs/capturas/v2/movil mobile
node scripts/og.mjs http://localhost:5173/ public/og.png && sips -z 630 1200 public/og.png
node scripts/comportamiento.mjs https://mixia-web-challenge.vercel.app/
```
Usan `playwright-core` con el Chrome instalado (`channel: 'chrome'`, flag `--use-angle=metal`):
así sí renderiza WebGL en headless. Reglas del código en `AGENTS.md` (un solo canvas, `View`
por sección, nada de `MeshTransmissionMaterial` dentro de `View`, Lenis + ScrollTrigger).

## Feedback de Sebastián (escritorio), en sus palabras y con mi lectura

1. **Hero: fusionar cerebro y M como el logo.** Mitad M, mitad cerebro, un solo objeto 3D
   girando, interacción fluida e inmersiva. Hoy están separados (`src/three/Brain.tsx` y
   `ParticleM.tsx`, ambos partículas con el mismo shader). Lectura: el hemisferio ocupa la mitad
   izquierda y la M nace de su cara de corte, como en `public/brand/mixia-mark.png`; que giren
   juntos como un solo grupo.
2. **Quitar todo lo que "grite AI generated".** Le parecen así: la tipografía (Bricolage
   Grotesque + Instrument Sans), los eyebrows con la rayita a la izquierda, y los bloques de cifras
   separados por líneas (14+ años, 6 países). Lectura: cambiar la familia tipográfica por algo
   con más carácter editorial o técnico, eliminar la raya de los eyebrows, y rediseñar las cifras
   sin grid de cajas (por ejemplo integradas en texto grande, o en una línea viva con contadores).
3. **Ventia: el link a ventiave.com está escondido y sin aire.** Hoy es un enlace pequeño en
   la línea de prueba (`.proof a`). Quiere un CTA visible.
4. **Mixia Lock: no usar la captura de LifePhone.** Quiere un diseño propio de la app de Mixia
   dentro del teléfono 3D, que cambie de pantalla: registrar cédula → equipo desbloqueado →
   equipo bloqueado. Lectura: dibujar las tres pantallas como texturas (canvas 2D o SVG a textura)
   con marca Mixia y rotarlas con el scroll o en bucle.
5. **Servicios ("Lo que hacemos por su negocio"): muy básico.** Quiere algo interactivo, visual
   y llamativo "para sumergirse en lo que ofrecemos". Hoy es un grid 2 columnas con icono.
6. **Clientes: agregar logos.** Hoy es un marquee tipográfico. No hay archivos de logos en el
   repo ni en `~/Presentaciones Mixia`. **Decidido por Sebastián: buscar cada logo en la web**
   (sitio oficial de cada cliente, Wikimedia Commons o Brandfetch), con un subagente
   `researcher`. Clientes: Damasco (mitiendadamasco), Honda Motors, Gerais, AWS, Google,
   Scripps Health, Banco R4, Grupo Higuea, SANUTEM. Guardarlos en `public/clientes/` como SVG
   o PNG, en monocromo blanco para que convivan sobre tinta, y anotar la fuente de cada uno en
   `public/clientes/FUENTES.md`.
7. **Contacto: demasiado básico, "sin alma".** Quiere que asombre a quien vaya a contactar.
8. **El logo de la nav (arriba a la izquierda) no se ve contra el fondo.** El mark tiene
   degradado cian→violeta sobre tinta; a 34 px se pierde. Lectura: versión del mark en blanco o
   con halo, o más grande.
9. **Nav: darle vida.** "Súper fluida, dinámica e interactiva, con visuales inmersivos".
10. **Criterio general:** "es nuestra primera imagen como desarrolladores de software, todo debe
    ser especial y dedicado", "que la interacción sea una locura que te haga querer contratar a
    Mixia". Lo que ya está "quedó arrechísimo también": no romper lo que funciona (rendimiento,
    accesibilidad, ES/EN, móvil).

## Qué no tocar sin preguntar

- Cifras y clientes ya aprobados por Sebastián: todo lo de los decks menos los $2M; sí 5.000
  conexiones/s; Gerais como cliente. Nunca "anti-robo" en Mixia Lock.
- Español "usted", beneficio primero. Inglés en `src/i18n/en.ts` siempre a la par.

## Pendiente después del rediseño

- Guion de 5 minutos para la presentación del 16.
- Regenerar `public/og.png` si cambia el hero.
