# Handoff: Mixia Web Challenge

## Cierre (2026-10-15, noche): verificación final y video

- Laptops 1366×768 y 1536×864 revisadas en producción (`scripts/laptop.mjs`): sin desbordes.
  Arreglo: en pantallas de menos de 880 px de alto la sección fijada de productos se compacta
  para caber bajo la nav (media query al final del bloque de productos en `global.css`).
- iPhone 17 en el simulador de Xcode con Safari: hero, servicios y contacto correctos, 3D carga,
  flujo de contacto funciona. (`xcrun simctl boot "iPhone 17"`, `xcrun simctl openurl booted <url>`,
  `xcrun simctl io booted screenshot x.png`.)
- Entrada del isotipo suavizada: nube cercana y tenue que se condensa en 2,8 s, aristas al final.
- Video `docs/video/mixia-web-presentacion.mp4` (1920×1080, ~3 min 10 s, sin audio): intro →
  escritorio (hero con clic, cifras, sección fijada, mosaico con hover, clientes, flujo de contacto
  completo) → teléfono enmarcado → cierre con la URL. Grabado con `scripts/video.mjs` contra
  producción y montado con ffmpeg (tarjetas renderizadas con la tipografía del sitio en Chrome).

## Ronda 5 aplicada (2026-10-15, mismo día; "AI free"; en producción)

Sebastián pidió revisar la página entera y quitar los rastros de diseño hecho por IA. Lista
de rastros (subagente researcher; fuentes impeccable.style/slop, 925studios.co, adriankrebs.ch):
texto con degradado en títulos y números, eyebrow/etiquetas en mayúsculas con tracking, chips,
glassmorphism con blur, tarjetas con borde de color en un lado, blobs morados con halo, tríptico
de tarjetas con icono, "01/02/03", Inter/Space Grotesk, copy genérico.

Qué cambió:
- **Hero**: una palabra por línea (se arregló la "a" suelta), "con inteligencia." en peso 300, sin
  eyebrow ni chips (los tres datos van en una línea de texto), botón de acento + enlace con flecha.
  **El isotipo se arma desde el caos al cargar** (uniform `uAssemble`, estado en
  `src/three/heroState.ts`) y **un clic manda una onda por la red** (`uPulse`). Hallazgo: R3F copia
  el objeto `uniforms` al aplicarlo, así que mutar nuestro objeto no llegaba al material; ahora
  `Brain` y `ParticleM` sincronizan los valores en `material.uniforms` cada frame (esto también
  arregló la repulsión del puntero, que no funcionaba).
- **Títulos**: la palabra clave va en peso 300 en vez de degradado. Eyebrows en minúscula, sin
  tracking. Cifras en blanco sólido. Mosaico sin barra de color. Contacto sin blur.
- Bug corregido: el contador de cifras tomaba los `<b>` de los glifos (`.stat > b`).

Comprobado sobre el build: Lighthouse 97/100/100/100, comportamiento en verde, capturas v4
regeneradas, OG regenerado. Producción sirve el último commit.

## Ronda 4 aplicada (2026-10-15, día de la presentación; contra HEAD de `main`, en producción)

Feedback de Sebastián con capturas sobre la ronda 3; spec `docs/specs/0002-ronda-4-sazon.md`
aprobado en el chat y construido el mismo día. Decisiones: tipografía A (Unbounded + Hanken
Grotesk), contacto por WhatsApp/correo prellenado sin servicio externo, servicios como mosaico.

Qué cambió, por commit:
- **Tipografía**: Unbounded (títulos) + Hanken Grotesk (cuerpo), `src/main.tsx`. Títulos más
  chicos porque Unbounded es ancha. Las líneas animadas del hero ya no recortan descendentes.
- **Hero**: la M es media M (solo la mitad derecha, `buildM` en `src/three/ParticleM.tsx`) con
  el borde plano pegado a la cara de corte del cerebro (`LogoMark.tsx`). Título por letras con
  color de degradado por letra (el clip de fondo no sobrevive a las transformaciones), aurora de
  fondo, parallax con el cursor, botones de vuelta. Sin "Deslice" ni correo inline.
- **Cifras**: banda con línea de pulso SVG, glifo animado por cifra, contador de conexiones/s que
  late ±25 tras contar. Sin hueco antes de productos.
- **Productos**: copy nuevo, CTA por producto con su color (`.btn-accent`) que manda a contacto con
  el interés marcado (evento `mixia:interest`), texto que entra en cascada (`--k`) y beneficios
  que se iluminan con el scroll (`--local`, `--f`).
- **Servicios**: mosaico de 10 tarjetas (`TILES` en `Services.tsx`, retícula de 6 columnas),
  color por área, arte CSS propio por tarjeta, inclinación y foco con el cursor.
- **Contacto**: flujo de 3 pasos (interés → nombre y correo → enviar) que abre WhatsApp VE o el
  correo con el mensaje escrito. Las tres tarjetas directas quedan abajo alineadas. Se fueron
  "Por dónde empezar" y la cita de cliente (no había cita real).
- **Títulos**: `src/sections/SectionHead.tsx`, palabra por palabra con la palabra clave en
  degradado (marcada con `*asteriscos*` en el diccionario).
- **Clientes**: "Grupo Higea". Logos de Damasco, Higea, R4 y SANUTEM: la búsqueda (subagente,
  15-oct) no encontró ningún archivo público; siguen como wordmark hasta que Sebastián mande archivos.

Comprobado en local sobre el build (2026-10-15): Lighthouse escritorio 97 / 100 / 100 / 100,
`scripts/comportamiento.mjs` en verde (ES/EN, móvil 390/390, reduced motion, consola limpia).
Capturas v4 en `docs/capturas/v4/`. Producción sirve el último commit (chunk `index-*.js`
comprobado). Scripts nuevos: `scripts/tipografia.mjs` (hero con otra fuente de Google Fonts, para
escoger viendo) y `scripts/pantalla.mjs`.

## Ronda 3 aplicada (2026-10-15 tarde, contra HEAD de `main`, en producción)

Spec `docs/specs/0001-ronda-3-interaccion.md` aprobado por Sebastián con tres ajustes (vista
explotada dentro de la sección fijada, sin capítulos al pie, transición por cross-fade) y
construido completo. Gerais confirmado como cliente.

Qué hay nuevo, por commit:
- **Productos en sección fijada** (`src/sections/Products.tsx`, `src/three/ProductStage.tsx`,
  matemática en `src/lib/stage.ts`): lista a la izquierda que se abre tramo a tramo, un solo
  `View` a la derecha donde tarjeta → teléfono → anillo se cruzan con ráfaga de partículas, y
  el teléfono de Mixia Lock se abre en capas con tres etiquetas y plano técnico tenue. Riel de
  tres marcas a la derecha. Móvil (<860 px) y reduced motion: tres bloques apilados como en v2.
- **Hero**: chips (14 años · 6 países · 3 productos) y correo inline que abre `mailto:` con
  asunto y cuerpo prellenados. "Ver productos" pasó a enlace pequeño bajo el formulario.
- **Servicios**: pestañas Todos · Finanzas y pagos · IA · Plataforma y nube que filtran las
  filas (mapa de índices en i18n `services.tabs`).
- **Contacto**: dos puertas de entrada arriba de las tarjetas ("Para su retail", "Para su centro
  médico"), cada una con `mailto:` y asunto propio.
- **Cita de cliente** (`src/sections/Quote.tsx`, fondo claro, tinta invertida): construida pero
  **solo se muestra en desarrollo** (`QUOTE_READY = import.meta.env.DEV`) porque el texto es de
  muestra. **Pendiente: Sebastián da la cita real (frase, nombre, cargo, empresa)**; va en i18n
  `quote` de es/en y se cambia `QUOTE_READY` a `true`.

Comprobado en local sobre el build (2026-10-15): Lighthouse escritorio 97 / 100 / 100 / 100,
`scripts/comportamiento.mjs` todo en verde (ES/EN persiste, móvil 390/390, reduced motion,
consola sin errores). Capturas v3 en `docs/capturas/v3/` (`escritorio-*`, `movil-*`, y
`escenario-*` con 8 puntos del scroll de la sección fijada, hechas con `scripts/escenario.mjs`).
Producción sirve el bundle del último commit (comprobado por el nombre del chunk `index-*.js`).
`public/og.png` regenerado con el hero nuevo.

Scripts nuevos: `scripts/escenario.mjs` (sección fijada en 8 puntos) y `scripts/pantalla.mjs`
(una captura con un selector arriba, escritorio o móvil).

### Inspiración de la ronda 3 (referencia)

- Qué se copió y por qué: `docs/inspiracion/ronda-3.md` (hojas de contacto `mercury-*.png`,
  `ghost-*.png` ahí mismo; se regeneran con `node scripts/inspiracion.mjs <url> <prefijo>`).

# Ronda 2 (feedback de Sebastián), cerrada

Escrito el 2026-10-15 a las 11:20; ronda 2 aplicada el mismo día a las 12:05. Presentación mañana
16-oct, 5 minutos.

## Ronda 2 aplicada (2026-10-15 12:05, contra HEAD de `main`)

Los 9 puntos de abajo están aplicados. Capturas v2 en `docs/capturas/v2/` (mismo script que v1).
Comprobado en local sobre el build: Lighthouse escritorio 97 / 100 / 100 / 100,
`scripts/comportamiento.mjs` todo en verde, móvil 390 px sin desbordes.
Decisiones tomadas en la ronda:
- Hero: el isotipo gira en vaivén de ±17° con cabeceo, no da la vuelta completa (la M quedaría
  escondida detrás del hemisferio). `src/three/LogoMark.tsx` lleva todo el movimiento.
- Mixia Lock: 3 pantallas en canvas (`src/three/lockScreens.ts`) rotan cada 3,4 s en bucle; el
  candado se abre en "desbloqueado" y se pone ámbar en "bloqueado".
- Tipografía: Archivo Variable, una sola familia (títulos expandidos). Elegida por "corporativo
  y tecnológico".
- Logos: AWS, Google, Honda (Wikimedia Commons), Gerais y Scripps (sitio oficial). Damasco,
  Banco R4, Grupo Higuea y SANUTEM no aparecen en la web: van como wordmark. **Confirmar con
  Sebastián que el Gerais de gerais.com.ve (óptica) es el cliente.**
- Contacto: anillo de partículas de fondo (`src/three/SignalRing.tsx`), tarjetas magnéticas y
  hora local de Caracas y Ciudad de México.
- Nav: logo en blanco con halo (vuelve al degradado en hover), línea de progreso de lectura,
  subrayado que se desliza a la sección activa, menú móvil a pantalla completa.

## Estado comprobado en la ronda 1 (referencia)

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
- Logos de Damasco, Banco R4, Grupo Higuea y SANUTEM si Sebastián consigue los archivos
  (ver `public/clientes/FUENTES.md`).
- `public/og.png` ya regenerado con el hero nuevo.
