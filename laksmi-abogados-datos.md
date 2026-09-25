# LAKSMI Abogados — Base de datos de la empresa para el nuevo sitio web

> Fuente: sitio anterior `laksmiabogados.com` (copia local en `~/Desktop/abogadosFake/laksmiabogados.com`, versión `20260729`).
> Todo el contenido de este archivo sale de ese sitio. Lo marcado como **[PENDIENTE]** no existe en el sitio anterior y hay que pedírselo al cliente; no hay que inventarlo.
> Objetivo inmediato: **MVP estético** (landing one-page, sin backend).

---

## 1. Identidad

| Campo | Valor |
|---|---|
| Nombre comercial | LAKSMI ABOGADOS (se escribe "LAKSMI" en mayúsculas, "Abogados" en minúscula en el logo) |
| Tipo | Firma de abogados |
| Ciudad | Bogotá D.C., Colombia |
| Dominio | https://laksmiabogados.com |
| Idioma / locale | Español · `es_CO` |
| Lema principal | **"Estamos de su lado"** |
| Descripción de marca | "Su aliado y su apoyo en todo momento y territorio." |
| Frase laboral | "Protegemos al trabajador y blindamos a la empresa." |
| Gancho comercial | **Primera consulta gratis** · "Le contactamos el mismo día." |
| Símbolo | Yantra (diagrama geométrico hindú); el nombre alude a Lakshmi, diosa de la prosperidad |
| Manual de marca | "Manual de Marca 2024" (citado en el CSS; el PDF original **[PENDIENTE]**) |
| Sitio anterior hecho por | Bolldr ("Powered by Bolldr. ⚡") |

### SEO del sitio anterior (reutilizable)

- **Title:** `LAKSMI ABOGADOS — Derecho Laboral, Civil-Familia, Seguridad Social y Penal · Bogotá`
- **Meta description:** `LAKSMI ABOGADOS — firma de abogados en Bogotá: derecho laboral y empresarial, civil y familia, seguridad social (EPS, ARL, AFP, CCF) y derecho penal. Primera consulta gratis.`
- **OG title:** `LAKSMI ABOGADOS — Abogados en Bogotá · Primera consulta gratis`
- **theme-color:** `#0A0E15`
- ⚠️ La OG description anterior mencionaba "internacional", un área que **no ofrecen**. No la copies.

---

## 2. Paleta de colores

### 2.1 Paleta oficial (Manual de Marca 2024)

Estos son los colores **originales de la marca**, tal como los cita el CSS:

| Nombre oficial | HEX | RGB | Uso en el sitio anterior |
|---|---|---|---|
| Blue | `#244266` | 36, 66, 102 | Botones, acentos principales |
| Dark Blue | `#273848` | 39, 56, 72 | Superficies, fondos de sección |
| White Grey | `#D9D9D9` | 217, 217, 217 | Texto principal sobre fondo oscuro, logo claro |
| Dark Grey | `#3A3A3A` | 58, 58, 58 | Apoyo, texto sobre fondo claro |
| Sand | `#F1D198` | 241, 209, 152 | Acentos secundarios, eyebrows, detalles "premium" |

### 2.2 Colores derivados que usaba el sitio anterior (no son del manual)

| Token | HEX | Uso |
|---|---|---|
| `--ink` | `#0A0E15` | Fondo base casi negro, con matiz azul |
| `--ink-2` | `#0E1420` | Fondo alterno |
| `--ink-3` | `#16202E` | Tarjetas / superficies elevadas |
| `--royal-glow` | `#5B7CA8` | Tinte claro del Blue (hover, brillos) |
| `--cream-dim` | `#9AA2AC` | Texto secundario / atenuado |
| `--line` | `rgba(217,217,217,.14)` | Bordes y divisores |
| canvas | `#08090C` | Fondo del canvas de la portada |
| overlays | `rgba(10,14,21,.32 … .95)` | Degradados sobre imágenes y videos |

### 2.3 Tokens listos para usar

```css
:root{
  /* Manual de Marca 2024 */
  --brand-blue:      #244266;
  --brand-dark-blue: #273848;
  --brand-white-grey:#D9D9D9;
  --brand-dark-grey: #3A3A3A;
  --brand-sand:      #F1D198;

  /* Derivados (sitio anterior) */
  --ink:       #0A0E15;
  --ink-2:     #0E1420;
  --ink-3:     #16202E;
  --blue-glow: #5B7CA8;
  --text-dim:  #9AA2AC;
  --line:      rgba(217,217,217,.14);
}
```

```js
// tailwind.config.js → theme.extend.colors
laksmi: {
  blue: '#244266',
  'dark-blue': '#273848',
  'white-grey': '#D9D9D9',
  'dark-grey': '#3A3A3A',
  sand: '#F1D198',
  ink: '#0A0E15',
  'ink-2': '#0E1420',
  'ink-3': '#16202E',
  glow: '#5B7CA8',
  dim: '#9AA2AC',
}
```

### 2.4 Notas de contraste

- `#D9D9D9` sobre `#0A0E15` tiene muy buen contraste; es la combinación base del sitio anterior (modo oscuro).
- `#F1D198` (Sand) sobre fondos oscuros funciona para títulos y acentos. Sobre blanco **no** tiene contraste suficiente para texto.
- `#244266` sirve como fondo de botón con texto blanco. Sobre `#0A0E15` es muy oscuro para texto; ahí usa `#5B7CA8`.

---

## 3. Tipografía (Manual de Marca)

| Rol | Fuente | Pesos disponibles en el sitio anterior |
|---|---|---|
| Títulos / display | **Red Hat Display** | 300–900, con itálica |
| Cuerpo | **Manrope** | 200–800 |

```html
<link href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:ital,wght@0,300..900;1,300..900&family=Manrope:wght@200..800&display=swap" rel="stylesheet">
```

Estilo del sitio anterior: títulos en MAYÚSCULAS, muy grandes (hasta `clamp(3.6rem,15.5vw,15rem)`), interlineado apretado (`.82–.92`), segunda línea en itálica. Botones tipo píldora (`border-radius:100px`); tarjetas con radio de 14–16 px.

---

## 4. Recursos gráficos existentes

Rutas relativas a `~/Desktop/abogadosFake/laksmiabogados.com/`.

| Archivo | Tamaño | Qué es |
|---|---|---|
| `assets/brand/logo-claro.png` | 1600×430 | Logo horizontal claro (yantra + LAKSMI + Abogados) para fondos oscuros |
| `assets/brand/yantra.png` | 1127×1132 | Símbolo solo; se usaba como preloader y marca de agua |
| `assets/brand/favicon.png` | — | Favicon |
| `assets/brand/apple-touch-icon.png` | — | Ícono iOS |
| `assets/brand/poster-socios-v4.jpg` | 1280×720 | Los dos socios de traje frente al yantra iluminado (foto de portada del video) |
| `assets/frames/bogota_0000.jpg` | 1280×720 | Vista aérea de Bogotá de noche (primer cuadro de la animación) |
| `assets/team/alexander.jpg` | — | Foto de Alexander Rivera Díaz |
| `assets/team/sebastian.jpg` | — | Foto de Sebastián Rivera Osorio |
| `assets/team/sarita.jpg` | — | Foto de Sarita Giraldo |
| `assets/team/sofia.jpg` | — | Foto de Sofía Cardona |

**Faltan en la copia local** (hay que pedirlos si se quieren reutilizar):

- el logo en versión oscura (para fondos claros);
- `og-image.jpg`;
- los videos `socios-v4.mp4` y `bogota.mp4`;
- los cuadros 0001–0192 de la animación aérea;
- el PDF del manual de marca.

---

## 5. Datos de contacto

```json
{
  "whatsapp": "+57 314 3903809",
  "whatsapp_link": "https://wa.me/573143903809",
  "email": "laksmiabogados@gmail.com",
  "direccion": "Cra 15 #124-17, Edificio Jorge Barón TV, Torre B, Oficina 306",
  "referencia": "Frente a Unicentro",
  "ciudad": "Bogotá D.C., Colombia",
  "horarios": {
    "lunes_a_viernes": "9:00 am – 6:00 pm",
    "sabados": "9:00 am – 4:00 pm",
    "nota": "Jornada continua"
  },
  "redes": {
    "facebook": "https://www.facebook.com/profile.php?id=61560334198836",
    "instagram": "https://www.instagram.com/laksmiabogadosbog",
    "tiktok": "https://www.tiktok.com/@laksmiabogados"
  }
}
```

Coordenadas de Google Maps: **[PENDIENTE]**.

---

## 6. Cifras (autodeclaradas por la firma)

| Cifra | Etiqueta |
|---|---|
| 4 | Áreas del derecho |
| GRATIS | Primera consulta |
| +15 | Años de experiencia |
| +100 | Casos atendidos |

⚠️ No hay respaldo de estas cifras. La marca es de 2024, así que los "+15 años" probablemente son la trayectoria de los socios. Conviene confirmarlo con el cliente antes de publicarlas.

---

## 7. Áreas de práctica y servicios

```json
[
  {
    "id": "laboral",
    "numero": "01",
    "nombre": "Laboral y Empresarial",
    "resumen": "Protegemos al trabajador y blindamos a la empresa: asesorías, litigios, contratos, liquidaciones y formalización.",
    "grupos": [
      {
        "titulo": "Laboral",
        "servicios": [
          "Asesorías jurídicas en derecho laboral",
          "Acompañamiento jurídico en procesos litigiosos",
          "Redacción de contratos",
          "Debido proceso para contratar y desvincular empleados",
          "Despido sin justa causa",
          "Acoso laboral y vulneración de derechos",
          "Liquidación de prestaciones sociales",
          "Constitución de reglamento interno de trabajo"
        ]
      },
      {
        "titulo": "Empresarial",
        "servicios": [
          "Constitución y formalización de empresas",
          "Acompañamiento jurídico en procesos litigiosos",
          "Registro de marca ante la Superintendencia de Industria y Comercio",
          "Blindaje legal para empresas"
        ]
      }
    ],
    "cta": "Ver servicios"
  },
  {
    "id": "civil",
    "numero": "02",
    "nombre": "Civil y Familia",
    "resumen": "Patrimonio, sucesiones, divorcios, custodia y procesos civiles. Acompañamiento humano y firme en lo que más importa.",
    "grupos": [
      {
        "titulo": "Familia",
        "servicios": [
          "Organización del patrimonio",
          "Sucesiones y testamentos",
          "Divorcios",
          "Liquidación de sociedades conyugales y patrimoniales",
          "Demanda de alimentos",
          "Custodia y patria potestad"
        ]
      },
      {
        "titulo": "Civil",
        "servicios": [
          "Procesos de pertenencia · prescripción adquisitiva de dominio",
          "Responsabilidad civil contractual y extracontractual",
          "Procesos ejecutivos (títulos valores)"
        ]
      }
    ],
    "cta": "Ver servicios"
  },
  {
    "id": "seguridad-social",
    "numero": "03",
    "nombre": "Seguridad Social",
    "destacada": true,
    "resumen": "Afiliaciones y aportes sin trámites eternos: EPS, ARL, AFP y CCF en paquetes claros para usted y sus empleados.",
    "lead": "Afiliaciones y aportes a seguridad social para independientes y empresas. Elija su paquete y le cotizamos hoy mismo.",
    "paquetes": [
      { "id": "eps-arl",          "nombre": "EPS + ARL",             "descripcion": "Salud y riesgos laborales" },
      { "id": "eps-arl-afp",      "nombre": "EPS + ARL + AFP",       "descripcion": "Salud, riesgos y pensión" },
      { "id": "eps-arl-ccf",      "nombre": "EPS + ARL + CCF",       "descripcion": "Salud, riesgos y caja de compensación" },
      { "id": "eps-arl-afp-ccf",  "nombre": "EPS + ARL + AFP + CCF", "descripcion": "Cobertura completa" }
    ],
    "glosario": {
      "EPS": "Salud",
      "ARL": "Riesgos laborales",
      "AFP": "Pensión",
      "CCF": "Caja de compensación familiar"
    },
    "precios": "[PENDIENTE]",
    "cta": "Cotizar paquetes"
  },
  {
    "id": "penal",
    "numero": "04",
    "nombre": "Derecho Penal",
    "resumen": "Defensa técnica en procesos penales, denuncias, querellas, audiencias y apelaciones. Su defensa, con total confidencialidad.",
    "grupos": [
      {
        "titulo": "Defensa y representación",
        "servicios": [
          "Defensa en procesos penales",
          "Asistencia en audiencias",
          "Denuncias y querellas",
          "Recursos y apelaciones"
        ]
      },
      {
        "titulo": "Casos que atendemos",
        "servicios": [
          "Delitos sexuales",
          "Violencia intrafamiliar",
          "Estafa, fraude y abuso de confianza",
          "Lesiones personales"
        ]
      }
    ],
    "cta": "Ver servicios"
  }
]
```

Resúmenes cortos para tarjetas (sección "Áreas de práctica" del sitio anterior):

| # | Área | Texto corto |
|---|---|---|
| 01 | Derecho Laboral y Empresarial | Protegemos al trabajador y blindamos a la empresa. |
| 02 | Derecho Civil y de Familia | Patrimonio, sucesiones, divorcios y procesos civiles. |
| 03 | Seguridad Social | Afiliaciones y aportes: EPS, ARL, AFP y CCF. |
| 04 | Derecho Penal | Defensa técnica en procesos penales, denuncias, querellas y apelaciones. |

---

## 8. Equipo

```json
[
  {
    "id": "alexander",
    "nombre": "Alexander Rivera Díaz",
    "cargo": "Socio Fundador",
    "foto": "assets/team/alexander.jpg",
    "etiquetas": ["Abogado", "Especialista", "Profesor Universitario"],
    "bio": [
      "Soy abogado y especialista, con experiencia en la Rama Judicial, el litigio y la docencia universitaria. Mi trayectoria profesional me ha permitido conocer el Derecho desde diferentes perspectivas: la administración de justicia, la representación de clientes y la formación de nuevos profesionales.",
      "Durante mi paso por la Rama Judicial adquirí una visión práctica del funcionamiento de los procesos judiciales, fortaleciendo mi capacidad de análisis, interpretación y aplicación del ordenamiento jurídico. Posteriormente, como abogado litigante y asesor jurídico, he acompañado a personas y empresas en la prevención, manejo y solución de conflictos, ofreciendo estrategias legales claras y eficaces.",
      "Como profesor universitario, he contribuido a la formación de futuros abogados, promoviendo el estudio del Derecho con un enfoque práctico, ético y orientado a la resolución de problemas reales.",
      "Mi ejercicio profesional se fundamenta en la responsabilidad, la transparencia y el compromiso con cada cliente. Creo que una asesoría jurídica de calidad no solo consiste en conocer la ley, sino en comprender cada caso, brindar un acompañamiento cercano y construir soluciones que protejan los derechos e intereses de quienes depositan su confianza en mi trabajo.",
      "Mi objetivo es ofrecer un servicio jurídico integral, caracterizado por el profesionalismo, la excelencia y una atención personalizada, buscando siempre la mejor alternativa legal para cada situación."
    ]
  },
  {
    "id": "sebastian",
    "nombre": "Sebastián Rivera Osorio",
    "cargo": "Socio Fundador",
    "foto": "assets/team/sebastian.jpg",
    "etiquetas": ["Abogado"],
    "bio": [
      "Soy abogado con experiencia en el ámbito jurídico, donde he fortalecido mis conocimientos y habilidades en el análisis, asesoría y acompañamiento de asuntos legales. Mi formación y trayectoria me han permitido desarrollar una visión práctica del Derecho, orientada a la búsqueda de soluciones eficaces y al acompañamiento responsable de cada cliente.",
      "A lo largo de mi proceso profesional he participado en el estudio de casos, la elaboración de estrategias jurídicas y el apoyo en diferentes actuaciones legales, consolidando una base sólida para el ejercicio de la profesión. Creo firmemente que el Derecho debe ejercerse con ética, compromiso y responsabilidad, ofreciendo siempre un servicio cercano, transparente y de calidad.",
      "Mi objetivo es brindar una asesoría jurídica integral, fundamentada en el estudio permanente, el análisis riguroso y la atención personalizada, buscando proteger los derechos e intereses de quienes depositan su confianza en mi trabajo. Asumo cada caso con dedicación, profesionalismo y el compromiso de ofrecer soluciones jurídicas claras, oportunas y ajustadas a las necesidades de cada cliente."
    ]
  },
  {
    "id": "sarita",
    "nombre": "Sarita Giraldo",
    "cargo": "Abogada Senior",
    "foto": "assets/team/sarita.jpg",
    "etiquetas": [],
    "bio": "[PENDIENTE]"
  },
  {
    "id": "sofia",
    "nombre": "Sofía Cardona",
    "cargo": "Abogada Junior",
    "foto": "assets/team/sofia.jpg",
    "etiquetas": [],
    "bio": "[PENDIENTE]"
  }
]
```

Datos que suman credibilidad y que hoy no existen: universidades, especializaciones y número de tarjeta profesional **[PENDIENTE]**.

---

## 9. Testimonios

Así se publicaban en el sitio anterior ("Reseñas reales de clientes"). Antes de reutilizarlos, confirma con el cliente que son reseñas reales y que los autores autorizan que se publiquen. Lo ideal es enlazar a la fuente (Google Business o Facebook).

```json
[
  { "autor": "Clara Paola Cruz",     "texto": "Excelente servicio de los abogados de Laksmi, me ayudaron a solucionar un problema legal que tenía hace años, los recomiendo." },
  { "autor": "Andrés López Murcia",  "texto": "Soy cliente desde hace 3 años de Laksmi y me ha funcionado mucho, especialmente como asesores de mi empresa, donde me asesoran en derecho laboral sobre cómo debo hacer contrataciones." },
  { "autor": "Hanna Galvis",         "texto": "Son muy buenos, siempre que necesito una asesoría en derecho laboral me han servido demasiado." },
  { "autor": "Carlos Cortés",        "texto": "Me gusta que a través de Laksmi me he podido afiliar a Seguridad Social, al igual que he podido afiliar a los empleados de mi negocio." }
]
```

---

## 10. Textos (copy) del sitio anterior

| Ubicación | Texto |
|---|---|
| Preloader | BIENVENIDOS |
| Hero eyebrow | Bogotá · Colombia |
| Hero título | LAKSMI / ABOGADOS |
| Hero scroll cue | Desplázate |
| Nav | Áreas · Seguridad Social · Equipo · Testimonios · Contacto · **Consulta gratis** (CTA) |
| Sección áreas (eyebrow) | Las protagonistas de la firma |
| Sección áreas (título) | CUATRO ÁREAS |
| Eyebrow de cada área | 0X · Área protagonista |
| Formulario (título) | Agende su consulta |
| Formulario (hint) | Primera consulta gratis. Le contactamos el mismo día. |
| Formulario (botón) | Solicitar consulta gratis |
| Formulario seguridad social (botón) | Cotizar mi paquete |
| Formulario (nota) | Su solicitud se envía directo a nuestro WhatsApp. |
| Formulario penal (nota) | Su solicitud se envía directo a nuestro WhatsApp con total confidencialidad. |
| Botón tras enviar | Enviado — abriendo WhatsApp… |
| Grid de áreas (eyebrow / título) | Estamos de su lado / ÁREAS DE PRÁCTICA |
| Equipo (eyebrow / título) | Socios y abogados / EL EQUIPO |
| Testimonios (eyebrow) | Reseñas reales de clientes |
| Cierre (eyebrow) | Estamos de su lado |
| Cierre (título) | AGENDA TU / CONSULTA GRATIS |
| Cierre (lead) | La primera consulta con nuestros abogados no tiene ningún costo. Cuéntenos su caso y le daremos un concepto jurídico serio. |
| Botones de cierre | WhatsApp (+57 314 3903809) · Escríbenos (laksmiabogados@gmail.com) |
| Footer | © {año} LAKSMI ABOGADOS. Todos los derechos reservados. · ESTAMOS DE SU LADO |

⚠️ La copy anterior mezcla "usted" (formularios) con "tú" ("Agenda tu consulta", "Desplázate"). Para el nuevo sitio conviene elegir uno; lo recomendable para una firma de abogados es **usted**.

---

## 11. Formularios (comportamiento del sitio anterior)

**Campos:**

| Campo | Tipo | Obligatorio |
|---|---|---|
| nombre | text | sí |
| correo | email | sí |
| celular | tel | sí |
| mensaje ("Cuéntenos su caso") | textarea | no (no existe en el formulario de seguridad social) |
| paquete | radio | solo en seguridad social |

**Envío:**

1. Se enviaba una copia por correo con FormSubmit (`https://formsubmit.co/ajax/laksmiabogados@gmail.com`), con el asunto `Nueva consulta web — {área}`.
2. Se abría WhatsApp con este mensaje ya redactado:

```
Hola LAKSMI Abogados, quiero agendar mi consulta gratis.
Área: {área}
Paquete: {paquete}        ← solo si aplica
Nombre: {nombre}
Correo: {correo}
Celular: {celular}
Caso: {mensaje}           ← solo si aplica
```

Para el MVP estético basta con el paso 2 (un enlace `wa.me` con el texto codificado), sin backend.

---

## 12. Dirección visual del sitio anterior (referencia)

- Modo oscuro cinematográfico: fondo `#0A0E15`, con overlay de grano y viñeta.
- Hero con una toma aérea de Bogotá al anochecer que avanza con el scroll, sobre un canvas. El video fue generado con IA (Seedance 2.0).
- Tipografía gigante en mayúsculas; las letras del título entran una por una.
- Las 4 áreas aparecen una por una, en modo sticky, sobre un video de los socios.
- Contadores animados en las cifras.
- Yantra como marca de agua con baja opacidad.
- Librerías: GSAP + ScrollTrigger + Lenis (scroll suave).
- Respetaba `prefers-reduced-motion`.

---

## 13. Pendientes y advertencias para el nuevo sitio

1. **Política de tratamiento de datos (Ley 1581 de 2012).** El sitio anterior no tenía. Hay que incluir un enlace a la política y una casilla de autorización en cada formulario, sobre todo porque el área penal recibe datos sensibles. Texto legal **[PENDIENTE]** (debe darlo la firma).
2. **No mencionar derecho "internacional"** (error del sitio anterior).
3. **Confirmar las cifras** (+15 años, +100 casos) y los permisos de los testimonios.
4. **Correo corporativo.** Proponer `contacto@laksmiabogados.com` en lugar de Gmail; se deja Gmail hasta que el cliente confirme.
5. **Pedir al cliente:**
   - logo en versión oscura y archivos vectoriales (SVG);
   - el manual de marca en PDF;
   - los videos originales;
   - las bios de Sarita y Sofía;
   - los precios de los paquetes de seguridad social;
   - la ubicación exacta para el mapa.
6. **Rendimiento:** la animación anterior de 193 imágenes pesaba mucho en móvil. Para el MVP es mejor usar una imagen estática (`bogota_0000.jpg`) o un video corto y comprimido.
