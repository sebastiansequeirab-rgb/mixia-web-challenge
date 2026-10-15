# Spec 0002 · Ronda 4: la versión 10/10 (presentación hoy)

Estado: **aprobado en el chat** el 2026-10-15 por Sebastián (feedback con capturas) y en construcción el
mismo día. Decisiones de Sebastián: presentación hoy; tipografía A (Unbounded + Hanken Grotesk);
contacto por WhatsApp/correo prellenado (sin servicio); servicios como mosaico vivo.

## Qué se hace (orden de construcción, commit y deploy por bloque)

1. **Tipografía**: Unbounded para títulos, Hanken Grotesk para cuerpo. Arreglar el recorte de
   descendentes (la "g") en las líneas animadas del hero.
2. **Hero**: la M es media M (solo la mitad derecha, como el logo) pegada a la cara de corte del
   cerebro, un solo objeto conectado. Quitar el indicador "Deslice". Más vida: fondo con aurora
   lenta, título que entra por letras, chips que laten al pasar, 3D que reacciona al cursor en todo
   el hero. El correo inline se va: el contacto vive en la sección de contacto (bloque 6).
3. **Cifras**: sin hueco negro (era padding + margen del título de productos). Números que cuentan
   al entrar, una línea viva de pulsos cruzando detrás, y cada cifra con un detalle animado.
4. **Productos**: el texto de cada tramo entra con el scroll (tagline por palabras, cada
   beneficio aparece y se ilumina uno a uno, prueba al final). CTA por producto con texto
   propio y color del producto ("Proteja sus equipos financiados", etc.) en vez de "Hablemos".
5. **Servicios como mosaico vivo**: cuadrícula de 10 tarjetas de tamaños distintos, color por
   área (finanzas · IA · plataforma), cada una con su animación propia; al pasar el cursor se
   abre con la descripción. Sin lista ni panel. Las pestañas se van.
6. **Contacto**: desaparece "Por dónde empezar". Un solo bloque alineado sobre la galaxia: flujo
   de 3 pasos (¿qué quiere lograr? → nombre y correo → enviar) que termina abriendo WhatsApp de
   Mixia con el mensaje escrito (o correo). Las tarjetas de WhatsApp VE/MX y correo quedan como
   vía directa, alineadas en la misma retícula.
7. **Títulos de sección**: entrada por palabras con barrido de degradado, una frase de contexto
   bajo cada título, y continuidad visual entre secciones.
8. **Clientes**: "Grupo Higea" (no Higuea). Logos reales solo si Sebastián manda los archivos:
   la búsqueda del 15-oct no encontró ninguno público de Damasco, Higea, R4 ni SANUTEM.
9. Se **elimina** la cita de cliente (bloque 5 de la ronda 3): no hay cita real.

## Qué NO se hace

- Nada que requiera cuenta o servicio externo (formularios, correo transaccional).
- No tocar cifras ni clientes aprobados. Nunca "anti-robo". Nada de crema, cursivas de acento,
  monospace ni "01/02/03".

## Cómo sabremos que quedó

- Capturas v4 en `docs/capturas/v4/` contra v3. Lighthouse del build ≥ 95/100/100/100.
- `scripts/comportamiento.mjs` en verde; móvil 390 px sin desbordes; ES/EN a la par.
- Producción sirve el último commit antes de la presentación.
