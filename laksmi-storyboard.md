# LAKSMI Abogados — Storyboard del sitio (MVP estético, scrollytelling)

> Documento de diseño para implementar con Claude Code.
> Datos, textos y paleta: ver `laksmi-abogados-datos.md` (misma carpeta). **No inventar contenido**; lo que falte va como `[PENDIENTE]`.
> Assets originales: `~/Desktop/abogadosFake/laksmiabogados.com/assets/`.

---

## 0. Concepto

### Idea central: "El yantra tiene cuatro puertas"

El símbolo de la marca es un yantra: un cuadrado con **cuatro puertas**, una en cada lado, que rodea un centro protegido. La firma tiene **cuatro áreas**. Esa coincidencia es el hilo narrativo de todo el sitio:

- El **centro del yantra es el cliente**, la persona que la firma protege ("Estamos de su lado").
- Cada **puerta es un área**: por ella se entra a la solución.
- A lo largo del scroll, el yantra **se dibuja, gira y se abre**: se dibuja en el hero, gira una puerta por cada área y se cierra completo en el contacto.

Así el símbolo deja de ser decoración y la estructura de la marca explica la estructura del negocio.

### Dirección visual: "brutal y profesional"

| Principio | Aplicación |
|---|---|
| Tipografía como arquitectura | Títulos en **Red Hat Display 900**, MAYÚSCULAS, tamaños extremos (hasta `18vw`), interlineado `.82`, tracking `-0.03em`. La segunda línea va en peso 300 itálica: contraste fuerte de pesos. |
| Oscuridad con temperatura | Fondo `--ink #0A0E15`, texto `#D9D9D9`, acentos **solo** en Sand `#F1D198`. El azul `#244266` se reserva para botones y estados activos. |
| Grilla visible | Líneas finas `--line` de 12 columnas que asoman en algunas secciones; numeración grande `01–04` en Sand. Da una sensación editorial y de rigor, como un expediente. |
| Negativo generoso | Mucho vacío alrededor de cada título. Nada de tarjetas amontonadas. |
| Movimiento con peso | Easings largos (`expo.out`, `power3.out`), nada de rebotes. Todo se mueve como algo pesado y seguro. |
| Textura | Grano sutil (overlay SVG con `opacity .06`) y viñeta. Nada de glassmorphism ni gradientes de colores. |

**Evitar:** balanzas, martillos de juez, fotos de stock de apretones de manos, íconos genéricos y colores fuera de la paleta.

---

## 1. Arquitectura técnica

| Decisión | Elección | Por qué |
|---|---|---|
| Framework | **Astro + TypeScript** | Sitio de contenido estático: se genera HTML puro, con SEO excelente y casi cero JS por defecto. No hay backend, auth ni datos dinámicos que justifiquen un SPA. |
| Interactividad | Scripts de Astro (vanilla TS) por componente | No hace falta React para esto. Si más adelante se quiere un formulario complejo, se añade una isla React solo ahí. |
| Estilos | CSS con custom properties (tokens de `laksmi-abogados-datos.md` §2.3) + CSS por componente | Control fino sobre la tipografía extrema. Tailwind es válido si se prefiere, con los tokens en `theme.extend`. |
| Animación | **GSAP + ScrollTrigger** | Pin, scrub y timelines coordinados. Plugin **DrawSVG** para trazar el yantra (GSAP es gratuito, incluidos los plugins). |
| Scroll suave | **Lenis** | Mejora el scrub del hero y de las áreas. Se sincroniza con ScrollTrigger y se **desactiva** con `prefers-reduced-motion` y en táctil. |
| Formulario | Sin backend: arma el mensaje y abre `wa.me` | Suficiente para el MVP. FormSubmit u otro servicio queda para la fase 2. |
| Deploy | Estático (Netlify, Vercel o Cloudflare Pages) | Gratis y rápido. |

> Alternativa: si prefieres Angular por familiaridad, funciona, pero sería un SPA que carga más JS y complica el SEO sin aportar nada a una landing. Astro es la opción correcta aquí.

### Estructura de carpetas

```
src/
├── data/
│   ├── site.ts          # identidad, contacto, horarios, redes, SEO
│   ├── areas.ts         # 4 áreas + servicios
│   ├── paquetes.ts      # paquetes de seguridad social
│   ├── equipo.ts        # abogados y bios
│   └── testimonios.ts
├── components/
│   ├── Preloader.astro
│   ├── Nav.astro
│   ├── Yantra.astro     # SVG inline reutilizable (props: variant, draw, rotate)
│   ├── Hero.astro
│   ├── Cifras.astro
│   ├── Areas/
│   │   ├── Areas.astro
│   │   ├── AreaStep.astro
│   │   └── AreasMobile.astro   # acordeón
│   ├── SeguridadSocial.astro
│   ├── Equipo/
│   │   ├── Equipo.astro
│   │   └── PerfilPanel.astro
│   ├── Testimonios.astro
│   ├── Contacto/
│   │   ├── Contacto.astro
│   │   └── ConsultaForm.astro
│   └── Footer.astro
├── animations/
│   ├── setup.ts         # registerPlugin, Lenis, gsap.matchMedia, reduced motion
│   ├── reveal.ts        # fadeUpOnEnter, splitChars, staggerIn
│   └── constants.ts     # distancias de scroll, duraciones, easings
├── styles/
│   ├── tokens.css
│   ├── typography.css
│   └── global.css
└── pages/
    ├── index.astro
    └── politica-de-datos.astro   # [PENDIENTE] texto legal
```

### Constantes de animación (`animations/constants.ts`)

```ts
export const EASE = { enter: 'expo.out', exit: 'power2.in', scrub: 'none' };
export const DUR  = { fast: 0.5, base: 0.9, slow: 1.4 };
export const SCROLL = {
  heroDesktop: '+=180%',   // distancia del pin del hero
  heroMobile:  '+=90%',
  areasPerStep: 100,       // vh de scroll por cada área (desktop)
};
export const BP = { mobile: '(max-width: 767px)', desktop: '(min-width: 768px)' };
```

---

## 2. Asset clave: el yantra en SVG

Todo el concepto depende de tener el yantra como **SVG vectorial con capas separadas**. Hoy solo existe `yantra.png`.

- **Ideal:** pedirle al cliente el vector original (AI, SVG o PDF del manual de marca) **[PENDIENTE]**.
- **Mientras tanto:** redibujarlo en SVG, porque es geometría simple. Las capas y sus IDs:
  - `#yantra-frame`: el cuadrado exterior con las 4 puertas. Cada puerta es un grupo propio: `#gate-n`, `#gate-e`, `#gate-s`, `#gate-w`.
  - `#yantra-circles`: los círculos concéntricos.
  - `#yantra-petals`: los pétalos.
  - `#yantra-triangles`: los triángulos entrelazados.
  - `#yantra-bindu`: el centro, un punto o hexágono.
- Solo trazos (`stroke`), sin relleno, para poder animarlo con DrawSVG. Color `currentColor`, para cambiarlo con CSS.

Otros assets:

| Uso | Archivo | Estado |
|---|---|---|
| Hero | `bogota_0000.jpg` (1280×720) | Existe, pero es baja resolución para pantalla completa. Pedir el video original o una versión 2560px **[PENDIENTE]**. |
| Equipo | `poster-socios-v4.jpg` + las 4 fotos de `assets/team/` | Existen. Exportar a WebP/AVIF. |
| Logo | `logo-claro.png` | Existe. Falta el SVG **[PENDIENTE]**. |

---

## 3. Storyboard por sección

Mapa del recorrido:

```
PRELOADER (≤1.2s)
   │
[1] HERO ─────────── PIN + scrub ──── el yantra se dibuja, Bogotá se acerca
   │
[2] CIFRAS ───────── libre + timed ── respiro, confianza rápida
   │
[3] ÁREAS ────────── PIN + 4 pasos ── el yantra gira: una puerta = un área
   │
[4] SEGURIDAD SOCIAL  libre + reveal ─ producto insignia, elegir paquete
   │
[5] EQUIPO ───────── libre + reveal ── rostros; perfiles desplegables
   │
[6] TESTIMONIOS ──── timed ────────── voces de clientes
   │
[7] CONTACTO ─────── estático ─────── el yantra se cierra; formulario único
   │
[8] FOOTER
```

---

### Preloader

```
Propósito: dar un primer contacto con la marca mientras cargan las fuentes y la imagen del hero.
Composición: fondo --ink; yantra centrado (200px) en Sand; debajo, "BIENVENIDOS" en Manrope 500, tracking .4em, 11px.
Scroll: bloqueado mientras está visible.
Timeline:
  0.0s  el yantra se traza (DrawSVG 0→100%, 0.9s, power2.inOut; primero las puertas y luego el centro)
  0.9s  "BIENVENIDOS" hace fade-in
  1.0s  (o cuando cargan las fuentes y el hero, lo que tarde más; máximo 2.5s)
        el yantra escala 1→0.4 y viaja a su posición en el hero (FLIP)
        mientras el fondo del preloader se desvanece
Scrub/timed: timed.
Transición: el yantra del preloader SE CONVIERTE en el del hero (continuidad).
Móvil: igual, con el yantra a 120px.
Reduced motion: sin preloader; el hero aparece con un fade de 0.3s.
Regla: si el usuario ya visitó el sitio en esta sesión (sessionStorage), se omite.
```

### Nav (global)

```
Composición: barra fija arriba; a la izquierda el logo claro (altura 28px); al centro los enlaces
  Áreas · Seguridad Social · Equipo · Contacto; a la derecha el botón píldora "Consulta gratis"
  (fondo --brand-blue, texto blanco, borde 1px Sand al hover).
Comportamiento:
  - Transparente sobre el hero; tras 80px de scroll gana fondo rgba(10,14,21,.8) + backdrop-blur(8px) + borde inferior --line.
  - Se oculta al bajar y reaparece al subir (yPercent -100 / 0).
  - El enlace de la sección activa se subraya en Sand (ScrollTrigger por sección).
  - El CTA lleva a #contacto.
Móvil: logo + botón hamburguesa → menú a pantalla completa con los enlaces en Red Hat Display 900 de 12vw
  y reveal escalonado; debajo, el botón de WhatsApp.
Accesibilidad: <nav> con aria-label, skip-link "Saltar al contenido", foco visible (outline 2px Sand).
```

---

### [1] Hero — "Estamos de su lado"

```
Propósito: presentar la marca, el lugar y la promesa en un solo golpe.
  El usuario entiende quién es la firma, dónde está y qué le ofrece.

Composición (desktop):
  - Fondo: foto aérea de Bogotá (bogota_0000.jpg) a pantalla completa, con overlay
    gradiente de --ink (arriba 40%, abajo 95%).
  - Centro: el yantra en Sand, 38vh, opacidad .9.
  - Encima, a la izquierda: eyebrow "BOGOTÁ · COLOMBIA" (Manrope 500, 12px, tracking .3em, Sand).
  - Título gigante en dos líneas:
        LAKSMI        ← Red Hat Display 900, 18vw, #D9D9D9
        Abogados      ← Red Hat Display 300 itálica, 9vw, Sand
  - Abajo a la izquierda: "Estamos de su lado." (Manrope 400, 20px).
  - Abajo a la derecha: indicador "Desplázate" con una línea vertical que se llena.
  - Esquina inferior: chip "Primera consulta gratis" con punto Sand pulsante.

Scroll: sección de 100vh, PIN durante +180% (desktop) / +90% (móvil).
Elemento fijo: toda la escena.

Timeline:
  Entrada (al terminar el preloader, timed, 1.2s):
    - las letras de "LAKSMI" suben de yPercent 110 a 0 (stagger .04, expo.out)
    - "Abogados" hace un clip-path reveal de izquierda a derecha
    - eyebrow, lema y chip con fade-up escalonado
  Principal (scrub, sobre el pin):
    0%   estado inicial
    0–60%   la foto de Bogotá escala 1.0 → 1.25 (sensación de descenso sobre la ciudad)
            el overlay se oscurece (.4 → .75)
    20–70%  el yantra rota 0° → 45° y escala 1 → 1.6; las puertas se separan del centro 8px
    40–80%  el título se separa: "LAKSMI" sube (yPercent -40) y "Abogados" baja (+40), ambos pierden opacidad
    60–100% aparece una frase en el centro, palabra por palabra, en Red Hat Display 700, 5vw:
            "Usted no está solo frente a la ley."   [PENDIENTE: validar la copy con el cliente]
            (alternativa con copy existente: "Estamos de su lado.")
  Salida:
    90–100% el yantra se reduce a 60px y se desplaza hacia arriba a la izquierda
            (queda como marcador de progreso fijo; ver "Yantra de progreso")

Transición a Cifras: la frase final se desvanece mientras la sección de cifras sube por debajo;
  su borde superior es una línea Sand que se dibuja de izquierda a derecha.

Móvil:
  - Título 22vw / 11vw; yantra 28vh.
  - Pin más corto (+90%); sin separación de las puertas; la foto escala solo hasta 1.12.
  - Usar 100svh para que la barra del navegador no mueva la escena.
Reduced motion: sin pin ni scrub; todo el contenido visible desde el inicio (incluida la frase);
  solo un fade inicial.
SEO/a11y: el <h1> real es "LAKSMI Abogados — Abogados en Bogotá". Los spans por letra llevan
  aria-hidden y el h1 tiene aria-label. La frase animada existe en el DOM como texto normal.
```

#### Yantra de progreso (global)

```
Después del hero, un yantra de 44px queda fijo abajo a la derecha (desktop).
- Sus 4 puertas se iluminan en Sand a medida que el usuario pasa por las 4 áreas.
- Al hacer clic abre WhatsApp (tooltip: "Consulta gratis por WhatsApp").
- En móvil se reemplaza por un botón flotante de WhatsApp con los colores de la marca (ícono Sand sobre --ink-3, no el verde de WhatsApp).
Propósito: el hilo narrativo sigue visible y además funciona como CTA persistente.
```

---

### [2] Cifras — la confianza en números

```
Propósito: respiro después del hero; confianza en 3 segundos.
Composición:
  - Fondo --ink. Grilla de 4 columnas separadas por líneas verticales --line, que se dibujan de arriba hacia abajo.
  - Cada celda: número gigante (Red Hat Display 900, 9vw, #D9D9D9) + etiqueta (Manrope 500, 13px, --text-dim, mayúsculas).
      04        GRATIS        +15         +100
      Áreas     Primera       Años de     Casos
      del       consulta      experiencia atendidos
      derecho
  - "GRATIS" va en Sand (es el mensaje comercial).
Scroll: altura natural (~60vh). SIN pin (rompe el ritmo después del hero).
Timeline (timed, once, al entrar al 75% del viewport):
  - las líneas verticales se dibujan (scaleY 0→1, .8s, stagger .1)
  - los números cuentan de 0 al valor (1.4s, power2.out); "GRATIS" entra letra por letra
  - las etiquetas hacen fade-up
Transición: fondo continuo --ink, sin corte. El eyebrow de la siguiente sección ya asoma.
Móvil: grilla 2×2; números de 16vw.
Reduced motion: los valores finales se muestran sin contar.
⚠️ Confirmar con el cliente "+15" y "+100" antes de publicar [PENDIENTE].
```

---

### [3] Áreas — "Cuatro puertas"

La sección central del sitio.

```
Propósito: explicar qué resuelve la firma. Cada área es una puerta del yantra.

Composición (desktop), sección de 100vh fijada, dividida en dos:
  IZQUIERDA (5 columnas): el yantra grande (60vh) en Sand con opacidad .9.
     La puerta activa brilla (stroke-width mayor + glow suave con drop-shadow de Sand al 30%).
     El centro del yantra muestra el número del área (01–04) en Red Hat Display 900.
  DERECHA (7 columnas): el contenido del área activa:
     - eyebrow "PUERTA 01 / 04" (Manrope, Sand, tracking .3em)
     - nombre: "LABORAL Y" (900) / "Empresarial" (300 itálica, Sand), 6vw
     - resumen (Manrope 400, 20px, máximo 44ch)
     - servicios en 2 columnas si hay grupos (p. ej. Laboral | Empresarial), lista con guiones finos,
       Manrope 15px; cada ítem con una línea --line debajo
     - botón "Consultar esta área →" (píldora con borde Sand), que lleva a #contacto con el área preseleccionada
  - Arriba a la izquierda, fijo durante toda la sección: "CUATRO ÁREAS" (título de sección, pequeño)
  - Barra de progreso vertical a la derecha: 4 segmentos, el activo en Sand.

Scroll: PIN de 4 × 100vh (+400%).
  Los datos vienen de data/areas.ts (se renderiza un AreaStep por área, apilados en posición absoluta).

Timeline (scrub 0.8), cada tramo del 25%:
  Por cada área i (0..3):
    inicio del tramo  el yantra ROTA hasta que la puerta i queda a la derecha, mirando al contenido
                      (0°, -90°, -180°, -270°; ease power2.inOut)
                      la puerta i se ilumina y la anterior se apaga
                      el número del centro cambia (flip vertical)
    +5%               el contenido anterior sale (y -60, autoAlpha 0)
    +8%               entra el contenido nuevo: el nombre con clip-path de abajo hacia arriba,
                      después el resumen y los servicios en stagger (y 40 → 0)
    resto del tramo   se mantiene (tiempo de lectura; no hay movimiento)
  Usar autoAlpha (no solo opacity) para que las capas ocultas no bloqueen clics.

Área 03 (Seguridad Social): su paso muestra solo resumen + 4 siglas grandes (EPS · ARL · AFP · CCF)
  y el botón "Ver paquetes →", que baja a la sección [4]. No se repite el detalle.

Salida (al terminar el pin): el yantra hace zoom out y se desvanece mientras las 4 puertas quedan
  brevemente encendidas a la vez: "cuatro puertas, un mismo lado".

Transición: la sección [4] entra con un fondo --brand-dark-blue que sube como una cortina (clip-path inset).

Móvil (≤767px): SIN PIN. Se reemplaza por AreasMobile:
  - un yantra pequeño (80px) como encabezado
  - 4 bloques en acordeón: número + nombre visibles; al tocar se expanden el resumen y los servicios
    (altura animada con GSAP, 0.5s). El primero abierto por defecto.
  - cada bloque con su botón "Consultar esta área".
  Motivo: fijar 4 pasos con listas largas en un celular es lento y se lee mal.
Reduced motion: las 4 áreas como bloques normales, uno debajo de otro, con el yantra estático
  en la posición correspondiente junto a cada una.
A11y: el contenido de las 4 áreas está en el DOM como <article> con <h3>. Los servicios en <ul>.
  Sin lector de pantalla que dependa de la animación.
Anclas: #laboral, #civil, #seguridad-social, #penal → hacen scroll hasta el tramo correcto del pin
  (calcular con ScrollTrigger start + progress i/4).
```

---

### [4] Seguridad Social — el servicio insignia

```
Propósito: convertir. Es el único servicio con "producto" (paquetes) y el más recurrente.
Composición:
  - Fondo --brand-dark-blue (#273848) con el yantra gigante recortado en la esquina (opacidad .05).
  - Encabezado a la izquierda: "SEGURIDAD" / "Social" (misma tipografía que las áreas) +
    lead: "Afiliaciones y aportes a seguridad social para independientes y empresas.
    Elija su paquete y le cotizamos hoy mismo."
  - 4 tarjetas de paquete en fila (desktop), que funcionan como radio buttons:
      ┌───────────────────┐
      │ 01                │  ← número Sand
      │ EPS + ARL         │  ← Red Hat 800; el "+" en Sand
      │ Salud y riesgos   │
      │ laborales         │
      │ ─────────────     │
      │ ◯ Elegir          │
      └───────────────────┘
    Seleccionada: borde Sand 1px, fondo --ink-3, el círculo se llena y la tarjeta sube 6px.
    La 4.ª ("Cobertura completa") lleva la etiqueta "Más completo" en Sand.
  - Debajo, un glosario en línea: EPS salud · ARL riesgos laborales · AFP pensión · CCF caja de compensación.
  - Botón "Cotizar mi paquete →": lleva a #contacto con el área "Seguridad Social" y el paquete ya elegidos.
    (Sin formulario propio: un solo formulario en todo el sitio.)
  - Precios: [PENDIENTE]. Si el cliente los da, van en cada tarjeta ("desde $X").
Scroll: altura natural. Sin pin.
Timeline (timed, once):
  - la cortina de fondo sube (clip-path inset(100% 0 0 0) → inset(0))
  - el título entra con un reveal de líneas
  - las tarjetas entran en stagger (y 60 → 0, .1s), cada una con una línea Sand que recorre su borde superior
Interacción: hover con la tarjeta elevada 4px; foco visible; teclado con flechas (radiogroup nativo).
Móvil: tarjetas en carrusel horizontal con scroll-snap (CSS nativo, sin JS), con el 85% de la
  tarjeta visible para que se note que hay más.
Reduced motion: sin cortina ni stagger; aparición directa.
```

---

### [5] Equipo — "Quiénes están de su lado"

```
Propósito: poner rostros a la promesa. Cercanía y autoridad.
Composición (desktop):
  - Fondo --ink.
  - Bloque superior a ancho completo: poster-socios-v4.jpg (los dos socios frente al yantra iluminado)
    con overlay y el título encima:
        "EL" / "Equipo"
    y el subtítulo: "Socios y abogados".
  - Debajo, una grilla de 4 columnas con las fotos en blanco y negro (filter grayscale(1));
    al hover pasan a color y aparece una línea Sand abajo.
      Nombre (Red Hat 700, 22px)
      Cargo (Manrope, Sand, 13px, mayúsculas)
      "Ver perfil +" (solo los socios, que tienen bio)
  - Al abrir un perfil se despliega un panel a ancho completo debajo de la grilla: nombre, cargo,
    chips (Abogado · Especialista · Profesor Universitario) y los párrafos de la bio en 2 columnas.
Scroll: sin pin. La imagen de los socios lleva un parallax suave (yPercent -10 → 10, scrub),
  la única parallax del sitio.
Timeline (timed, once):
  - el título entra con un reveal de líneas
  - las fotos entran en stagger con clip-path de abajo hacia arriba (inset(100% 0 0 0) → 0)
Panel de perfil: altura animada de 0 al contenido (0.6s, expo.out), luego ScrollTrigger.refresh().
  Botón "Cerrar ✕". Se cierra también con Esc.
Móvil: la imagen de los socios va arriba sin parallax; grilla 2×2; el perfil se abre como hoja
  (bottom sheet) a pantalla completa con scroll interno.
Reduced motion: fotos a color, sin parallax ni clip-path.
Pendiente: bios de Sarita y Sofía [PENDIENTE]. Mientras tanto sus tarjetas no llevan "Ver perfil".
A11y: las tarjetas expandibles son <button> con aria-expanded y aria-controls apuntando al panel.
```

---

### [6] Testimonios — "Lo que dicen"

```
Propósito: prueba social justo antes de la acción.
Composición:
  - Fondo --ink-2. Una sola cita a la vez, gigante y centrada:
      “                      ← comilla de 20vw, Sand, opacidad .15, detrás del texto
      Excelente servicio de los abogados de Laksmi, me ayudaron a solucionar
      un problema legal que tenía hace años, los recomiendo.
                              ← Red Hat Display 300 itálica, 3.2vw, #D9D9D9
      — CLARA PAOLA CRUZ      ← Manrope 600, 13px, Sand, tracking .2em
  - Abajo: 4 indicadores (líneas de 40px) que se llenan con el tiempo de cada cita (barra de progreso).
  - Flechas ← → a los lados.
Scroll: altura natural (~80vh). SIN pin (ya hubo dos pins; aquí el ritmo es del tiempo, no del scroll).
Timeline (timed):
  - rota cada 6s; transición: las palabras de la cita saliente se desvanecen (stagger .01) y las de la
    entrante suben (y 20 → 0)
  - pausa al hover, al enfocar y cuando la sección no está visible
Móvil: cita a 6vw; swipe para cambiar; los indicadores se mantienen.
Reduced motion: sin rotación automática; se cambia solo con los controles.
A11y: región con aria-roledescription="carrusel", botón de pausa visible y aria-live="polite" en la cita.
⚠️ Confirmar que las reseñas son reales y que los autores autorizan su uso; idealmente enlazar
  a la fuente (Google o Facebook) [PENDIENTE].
```

---

### [7] Contacto — "Agende su consulta gratis"

```
Propósito: la acción. Todo el recorrido termina aquí.
Composición (desktop), 2 columnas sobre --ink:
  IZQUIERDA:
    - el yantra completo (40vh), que se TRAZA COMPLETO una última vez al entrar: la historia se cierra
    - título:  "AGENDE SU" (900) / "Consulta gratis" (300 itálica, Sand), 7vw
    - lead: "La primera consulta con nuestros abogados no tiene ningún costo. Cuéntenos su caso y
      le daremos un concepto jurídico serio."
    - datos en bloques con etiqueta pequeña:
        UBICACIÓN   Cra 15 #124-17, Edificio Jorge Barón TV, Torre B, Of. 306 — frente a Unicentro
        HORARIOS    Lun–Vie 9:00–18:00 · Sáb 9:00–16:00 · Jornada continua
        CONTACTO    +57 314 390 3809 · laksmiabogados@gmail.com
  DERECHA: un solo formulario (ConsultaForm), en una tarjeta --ink-3 con borde --line:
    - Área (select, obligatorio): Laboral y Empresarial · Civil y Familia · Seguridad Social · Derecho Penal
    - Paquete (select; solo visible si el área es Seguridad Social)
    - Nombre, Correo, Celular (obligatorios)
    - Cuéntenos su caso (textarea, opcional)
    - ☐ "Autorizo el tratamiento de mis datos personales según la Política de Tratamiento de Datos" (obligatorio, con enlace)
    - Botón "Solicitar consulta gratis" (fondo --brand-blue, ancho completo; al hover el fondo pasa a Sand y el texto a --ink)
    - Nota: "Su solicitud se envía directo a nuestro WhatsApp con total confidencialidad."
    - Botones secundarios: WhatsApp directo · Escribir correo
Preselección: los botones "Consultar esta área" y "Cotizar mi paquete" pasan el área y el paquete
  por URL (#contacto?area=penal&paquete=eps-arl-afp) o por un evento; el formulario lee esos datos y
  resalta el select con un pulso Sand.
Envío: validación nativa + mensaje armado (plantilla en laksmi-abogados-datos.md §11) → window.open(wa.me).
  Estado del botón: "Abriendo WhatsApp…" durante 2.5s.
Scroll: altura natural. Sin pin.
Timeline (timed, once):
  - el yantra se traza completo (DrawSVG 1.6s)
  - el título entra con un reveal
  - los campos del formulario entran en stagger (.06s)
Móvil: una columna; el formulario primero y los datos después; el yantra pequeño de fondo con opacidad .06.
Reduced motion: el yantra aparece ya dibujado.
Mapa: embed de Google Maps con carga diferida (lazy, solo al hacer clic en "Ver mapa") para no
  cargar el iframe de entrada [PENDIENTE: confirmar la ubicación exacta].
```

---

### [8] Footer

```
Composición:
  - Una franja gigante de ancho completo: "ESTAMOS DE SU LADO" en Red Hat Display 900, 11vw,
    en contorno (-webkit-text-stroke 1px --line, sin relleno). Al entrar, el texto se rellena
    de izquierda a derecha con #D9D9D9 (background-clip:text + scrub corto).
  - 4 columnas: logo + "Su aliado y su apoyo en todo momento y territorio." · Ubicación · Horarios ·
    Contacto + redes (Facebook, Instagram, TikTok).
  - Base: © {año} LAKSMI ABOGADOS · Política de tratamiento de datos · Términos [PENDIENTE].
Móvil: columnas apiladas; la franja se reduce a 14vw.
Reduced motion: la franja se muestra rellena.
```

---

## 4. Ritmo del scroll

| Sección | Pin | Scrub | Timed | Sensación |
|---|---|---|---|---|
| Hero | ✅ | ✅ | entrada | Cinematográfica, inmersiva |
| Cifras | — | — | ✅ | Respiro, golpe rápido |
| Áreas | ✅ | ✅ | — | Lectura guiada, pausada |
| Seguridad Social | — | — | ✅ | Cambio de color, momento de producto |
| Equipo | — | parallax suave | ✅ | Humana, cercana |
| Testimonios | — | — | ✅ (auto) | Calma, voces |
| Contacto | — | — | ✅ | Cierre, claridad |
| Footer | — | corto | — | Firma final |

Solo **dos pins** en todo el sitio. Así se evita que el scroll se sienta secuestrado.

---

## 5. Responsive (resumen)

| Elemento | Desktop | Móvil |
|---|---|---|
| Hero | Pin +180%, zoom 1.25, puertas que se separan | Pin +90%, zoom 1.12, sin separar |
| Áreas | Pin de 4 pasos con el yantra girando | **Acordeón**, sin pin |
| Paquetes | 4 tarjetas en fila | Carrusel con scroll-snap |
| Equipo | Grilla 4 + panel desplegable | Grilla 2×2 + bottom sheet |
| Yantra de progreso | Fijo abajo a la derecha | Se reemplaza por el botón de WhatsApp |
| Lenis | Activo | Desactivado (scroll nativo en táctil) |

Implementar con `gsap.matchMedia()` y tres contextos: `desktop`, `mobile` y `reduceMotion`.

---

## 6. Rendimiento

- Hero: una sola imagen WebP/AVIF (≤250 KB, con `srcset` en 1280/1920/2560) en lugar de 193 cuadros. Si el cliente entrega el video, usar un MP4/WebM corto (≤3 MB) con `poster`.
- Fuentes: solo los pesos que se usan (Red Hat Display 300i, 700, 800, 900; Manrope 400, 500, 600) con `font-display: swap` y preload de las dos principales.
- GSAP y ScrollTrigger se cargan con import dinámico después del primer render; el contenido es HTML visible sin JS.
- Fotos del equipo en WebP con `loading="lazy"` y `width`/`height` definidos (sin CLS).
- Animar solo `transform`, `opacity`, `clip-path` y `stroke-dashoffset`.
- `ScrollTrigger.refresh()` después de cargar las fuentes (`document.fonts.ready`) y las imágenes del hero.
- Objetivo: Lighthouse ≥ 90 en performance móvil; LCP < 2.5s.

---

## 7. Accesibilidad

- Todo el contenido existe en el HTML; ninguna información vive solo en una animación o un canvas.
- `prefers-reduced-motion`: sin pins, scrub, parallax ni Lenis; solo fades cortos.
- Jerarquía: un `<h1>` (hero), `<h2>` por sección, `<h3>` por área o miembro.
- Contraste: texto `#D9D9D9` sobre `#0A0E15` ✅. Sand solo para títulos grandes y acentos, nunca para texto pequeño sobre fondo claro.
- Foco visible en todo (outline 2px Sand, offset 3px). Skip-link al inicio.
- Formulario con `<label>` reales, errores anunciados (`aria-describedby`) y casilla de autorización obligatoria.
- Carrusel pausable; el acordeón y los perfiles se manejan con teclado.

---

## 8. Orden de implementación sugerido (para Claude Code)

1. Tokens, tipografía, layout base y los datos en `src/data/*` (desde `laksmi-abogados-datos.md`).
2. Todas las secciones **sin animación**, completas y responsive. El sitio debe funcionar así.
3. El SVG del yantra con sus capas.
4. `animations/setup.ts`: GSAP, ScrollTrigger, Lenis, matchMedia y reduced motion.
5. Animaciones en orden de impacto: Hero → Áreas → Contacto (cierre del yantra) → el resto.
6. Formulario con preselección y envío a WhatsApp.
7. Página de política de datos (texto [PENDIENTE]).
8. Revisión de rendimiento y accesibilidad (Lighthouse, teclado, reduced motion, móvil real).

---

## 9. Pendientes del cliente

- [ ] Yantra y logo en vector (SVG, AI o PDF del manual de marca)
- [ ] Imagen o video del hero en alta resolución
- [ ] Confirmar la frase del hero ("Usted no está solo frente a la ley." u otra)
- [ ] Confirmar las cifras +15 años / +100 casos
- [ ] Bios de Sarita Giraldo y Sofía Cardona
- [ ] Precios de los paquetes de seguridad social (opcional)
- [ ] Autorización de los testimonios y enlace a la fuente
- [ ] Texto de la Política de Tratamiento de Datos (Ley 1581 de 2012)
- [ ] Ubicación exacta para el mapa
- [ ] Correo corporativo (opcional)
