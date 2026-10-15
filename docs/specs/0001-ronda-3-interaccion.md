# Spec 0001 · Ronda 3: interacción inmersiva (borrador para aprobar)

Estado: **construido y en producción** (2026-10-15, evidencia en `docs/HANDOFF.md`, sección
"Ronda 3 aplicada"). Aprobado por Sebastián el 2026-10-15 (tarde) con tres ajustes: la vista explotada de
Lock va dentro de la sección fijada (no como bloque aparte), no hay capítulos al pie (la nav ya
marca sección activa y progreso) y la transición 3D es cross-fade con escala, giro y partículas,
no morfología real. Gerais de gerais.com.ve confirmado como cliente. Falta la cita del bloque 5.
Escrito el 2026-10-15 a las 12:25 por Claude tras explorar mercury.com y ghost.ai (detalle en
`docs/inspiracion/ronda-3.md`).

## Por qué

Sebastián: la página "está muy genérica y aburrida" aun después de la ronda 2. Las dos webs de
referencia no ganan por color ni por tipografía: ganan porque **el scroll cuenta una historia y
el producto se transforma delante de uno**. Hoy Mixia tiene secciones buenas pero apiladas; cada
una empieza de cero.

## Qué se va a hacer (en este orden, cada bloque con commit)

1. **Productos en una sección fijada** (patrón Mercury). Una pantalla clavada con ScrollTrigger
   `pin`: a la izquierda la lista Ventia · Mixia Lock · SmartMed, a la derecha un solo `View` donde
   objeto 3D cambia con transición: el saliente se encoge y gira mientras entra el siguiente, con
   una ráfaga de partículas en el cruce (cross-fade, plan B del borrador, elegido por costo y
   riesgo). El texto de cada producto entra y sale con el tramo. Móvil y reduced motion: sin pin,
   tres bloques como hoy.
2. **Mixia Lock en vista explotada, dentro del tramo de Lock** (patrón Ghost). Al avanzar el
   scroll el teléfono se separa en capas (pantalla, cuerpo, candado) y aparecen tres etiquetas
   con línea: "Se bloquea sin conexión", "Código de un solo uso", "Instalación por QR". Plano
   técnico tenue de fondo. Se construye junto con el bloque 1.
3. ~~Capítulos pegados al pie~~ Descartado: competiría con el subrayado y la línea de progreso
   de la nav.
4. **Hero**: chips técnicos bajo el título (14 años · 6 países · 3 productos en producción) y
   campo de correo inline con botón "Hablemos" que abre `mailto:` con el correo prellenado.
5. **Cita grande** entre Clientes y Contacto, sección de fondo claro suave (tinta invertida, no
   crema) con una frase aprobada por Sebastián. **Construida con texto de muestra; se muestra
   solo en desarrollo hasta tener la cita real.**
6. **Servicios por pestañas** (Finanzas y pagos · Inteligencia artificial · Plataforma y nube)
   encima del explorador actual; cada pestaña filtra las filas.
7. **Cierre de contacto con dos tarjetas**: "Para su retail" (Ventia + Lock) y "Para su centro
   médico" (SmartMed), cada una con su CTA, encima de las tarjetas de contacto actuales.

## Qué NO se hace

- No cambiar paleta, tipografía (Archivo) ni el hero fusionado: quedaron aprobados en la ronda 2.
- No más de una sección fijada. No videos pesados: todo es 3D propio o CSS.
- No tocar cifras ni clientes. Nunca "anti-robo". Nada de crema, cursivas de acento, etiquetas
  monospace ni "01/02/03" (ver `~/.claude/CLAUDE.md`, sección Frontend).

## Cómo sabremos que quedó

- Capturas v3 en `docs/capturas/v3/` (mismos scripts) comparadas con v2.
- La sección fijada funciona con Lenis sin saltos en escritorio; en móvil no hay pin y nada se
  desborda (`scripts/comportamiento.mjs` en verde, móvil 390/390).
- Lighthouse del build ≥ 95 / 100 / 100 / 100 (hoy 97 / 100 / 100 / 100).
- Reduced motion: la sección de productos se ve completa sin pin ni transiciones.
- ES y EN a la par para todo texto nuevo.

## Riesgos conocidos

- `ScrollTrigger.pin` con Lenis: usar `pinType: 'transform'` solo si hay saltos; probar primero
  con el default. El canvas único con `View` sigue funcionando con pin porque el `View` se ancla
  al div pineado.
- Transición tarjeta → teléfono → anillo: si queda pesada, el plan B es cross-fade entre las tres
  escenas actuales dentro del mismo `View` (mucho más barato y ya probado en LockPhone).
