# Inspiración para la ronda 3: mercury.com y ghost.ai

Capturado el 2026-10-15 con `scripts/inspiracion.mjs` (Chrome headless, 1440×900, tramos de
800 px). Hojas de contacto: `mercury-1.png`, `mercury-2.png`, `ghost-1.png`, `ghost-2.png`.
Lo que sigue es lo que vale la pena copiar como **mecánica**, no como estética: Mixia ya tiene
su identidad (tinta oscura, degradado cian→violeta, Archivo, partículas).

## Mercury (banca para empresas)

Flujo de la página: hero atmosférico → producto en contexto → sección fijada por producto →
cita grande → "empieza rápido" fijada → grid de tarjetas con mini-videos → cifras → prueba
social → cierre con dos tarjetas. Alterna fondos oscuro / claro / oscuro para marcar capítulos.

Mecánicas que sirven para Mixia:

1. **Sección fijada con lista a la izquierda y producto a la derecha** (hoja 1, fila 2). La
   sección se queda clavada ("pinned") mientras se hace scroll; cada tramo activa un ítem de la
   lista y el producto de la derecha hace zoom al detalle que corresponde (de "Accounts" a la
   lista de cuentas). Una sola pantalla cuenta cuatro cosas sin que el usuario se pierda.
2. **Hero con el producto puesto en un escenario** (escritorio en la montaña, laptop en el
   paisaje). No es una captura flotando: hay profundidad y atmósfera.
3. **Email inline en el hero** ("Enter your email" + botón). Reduce la fricción de contacto.
4. **Tarjetas con mini-video en bucle y botón de pausa** (hoja 1, fila 3 y hoja 2, fila 1). Cada
   capacidad se ve funcionando, no se describe.
5. **Visuales abstractos "de marca"** (líneas que convergen, anillos de luz) para conceptos sin
   interfaz, en lugar de iconos.
6. **Cita grande centrada** de un cliente conocido, sola en pantalla, como respiro.
7. **Cierre con dos tarjetas** ("for business" / "for personal") que segmentan al visitante.

## Ghost (Core, computadora de IA personal)

Flujo: hero con el producto girando y las letras C O R E separadas a lo ancho → galería del
producto → **vista explotada** con etiquetas técnicas → escenas a pantalla completa (nube,
oficina, cocina) con tres "capítulos" pegados abajo → diagrama de compatibilidad → grid de
iconos 3D con pestañas → cierre.

Mecánicas que sirven para Mixia:

1. **Vista explotada con etiquetas** (hoja 1, fila 3): el equipo se abre y cada pieza vuela a su
   sitio con una línea y una etiqueta técnica (CPU · AMD Ryzen, STORAGE · 1 TB). El fondo es un
   plano técnico tenue. Convierte una lista de features en un objeto que se desarma.
2. **Capítulos pegados abajo** (LOCAL INTELLIGENCE · CONTINUOUS CONTEXT · PROACTIVE AGENT):
   tres etiquetas fijas al pie que se iluminan según el tramo en que estás. Orientan sin nav.
3. **Escenas a pantalla completa con "detección"** (hoja 2, filas 1 y 2): foto o video con cajas
   dibujadas sobre objetos ("KEYS", la manzana) y un mensaje de la IA. La interfaz vive dentro de
   la escena, no al lado.
4. **Hero con letras separadas a lo ancho** enmarcando el producto (C · O · R · E) y chips
   técnicos pequeños debajo (NO SUBSCRIPTION · ENTIRELY ON DEVICE). Etiqueta en caja con tipo
   pequeño en mayúsculas: lenguaje de ficha técnica.
5. **Diagrama de compatibilidad** con líneas etiquetadas (WIFI, BLUETOOTH) entre dispositivos.
6. **Grid de iconos 3D con pestañas** (DIGITAL / HOME / HEALTH) que cambia el conjunto.
7. **Galería con contador** (01 / 04) y flechas: ritmo de catálogo de hardware.

## Qué NO copiar

- La paleta clara de Ghost ni las fotos de stock de Mercury: Mixia es oscura y con partículas.
- Las etiquetas en monospace tal cual: van contra el gusto de Sebastián (ver memoria). Usar
  Archivo en mayúsculas pequeñas y caja fina si hace falta "ficha técnica".
- Más de una sección fijada seguida: dos "pinned" largos cansan. Una por página, máximo dos.

## Traducción a Mixia (prioridad)

| # | Idea | Origen | Dónde en Mixia |
|---|---|---|---|
| 1 | Productos como una sola sección fijada: la lista Ventia / Lock / SmartMed a la izquierda y un solo objeto 3D a la derecha que se transforma (tarjeta → teléfono → anillo) con el scroll | Mercury 1 | `Products.tsx`, `ProductView.tsx` |
| 2 | Mixia Lock en vista explotada: el teléfono se abre y salen etiquetas (bloqueo sin conexión, código de un solo uso, QR) | Ghost 1 | `LockPhone.tsx` |
| 3 | Capítulos pegados al pie: SOFTWARE · IA · PAGOS (o Productos · Servicios · Clientes) que se iluminan con el scroll | Ghost 2 | nuevo `Chapters.tsx` |
| 4 | Hero con claims como chips técnicos (14 años · 6 países · 3 productos) y correo inline | Ghost 4 + Mercury 3 | `Hero.tsx` |
| 5 | Una sección clara (o casi) para romper el todo-oscuro: cita de cliente grande y sola | Mercury 6 | nuevo `Quote.tsx` entre Clientes y Contacto |
| 6 | Servicios por pestañas (Finanzas · IA · Plataforma) con el explorador actual dentro | Ghost 6 | `Services.tsx` |
| 7 | Diagrama "cómo se conecta": tienda ↔ Mixia Lock ↔ equipo con líneas etiquetadas | Ghost 5 | dentro de Lock |
| 8 | Cierre con dos tarjetas: "Para su retail" / "Para su centro médico" | Mercury 7 | `Contact.tsx` |
