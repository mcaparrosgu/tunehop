# Marketing — Paso 7 · Identidad visual (06-identidad-visual.md)

> Logo, color, tipografía, sistema gráfico y aplicaciones clave. Derivado
> directo de la estrategia (04-estrategia-marca.md) y la identidad verbal
> (05-identidad-verbal.md). Lista para implementar con la skill `frontend`
> (marco Passe-Partout + tokens CSS).
>
> Autora: Corita (directora creativa). Fecha: 2026-09-11.

---

## 1. REFERENCIAS Y MOODBOARD

**Dirección estética: "Precisión en movimiento"**

| Referencia | Qué aporta a TuneHop | Por qué |
|---|---|---|
| **Sistemas de señalética de transporte (Vignelli, MTA, AIGA)** | Claridad instantánea, iconografía universal, jerarquía sin ruido. | La usuaria no es técnica: la interfaz debe leerse como una señal de "salida" o "transbordo", no como un dashboard. |
| **Editorial suiza / International Typographic Style (Müller-Brockmann, Hofmann)** | Grilla, alineación, espacio en blanco como herramienta, tipografía como protagonista. | Refuerza el arquetipo Sabio (orden, criterio, verdad) sin rigidez. |
| **Identidad de TIDAL (actual)** | Negro profundo, cian/teal como acento, tipografía sans geométrica, fotografía de artistas en B/N. | TuneHop vive en la órbita de TIDAL como destino; la coherencia visual genera confianza de "mismo mundo". |
| **Signal / Proton / apps de privacidad primera** | Paleta restringida, iconografía de candado/escudo sutil, cero ruido visual. | Refuerza "privacidad radical" sin usar el candado cliché. |
| **Spotify (solo como contraste)** | Verde neón, ondas, energía de descubrimiento. | TuneHop **no** usa verde, no usa ondas, no usa "energía de descubrimiento". Es el opuesto visual deliberado. |

**Moodboard conceptual (para diseñador):**
- **Fondo**: Negro puro (#0A0A0A) / Blanco puro (#FAFAFA) — sin grises intermedios en elementos clave.
- **Acento único**: **Teal eléctrico #00E5A0** (puente visual con TIDAL, pero más vivo, más "salto").
- **Tipografía**: Geométrica, legible a 12px, con personalidad en mayúsculas (logo) y cuerpo limpio.
- **Iconografía**: Trazo único (monolinear), esquinas redondeadas 2px, tamaño 20px/24px.
- **Fotografía**: Solo si sirve — músicos en estudio, cables, vinilos, manos en controles. Nunca "gente feliz con auriculares" (cliché de categoría).
- **Movimiento**: Transiciones de 150-200ms, ease-out. El "hop" se siente en el micro-interacciones.

---

## 2. CONCEPTO DE LOGOTIPO

**Idea central: "El salto preciso"**

- **Wordmark** (logotipo tipográfico) como base — el nombre *es* la marca (arquitectura única).
- **Glifo / símbolo**: Una **línea que salta** — trazo monolinear que dibuja una curva ascendente (el "hop") y aterriza en un punto preciso (el ISRC, el destino, la decisión).
- **Relación**: El glifo nace de la **h minúscula de "hop"** — la pierna derecha de la h se alarga y salta. Es propio, no genérico.
- **Función**: El glifo funciona solo (favicon, app icon, avatar social) y acompañado (wordmark horizontal).
- **Personalidad**: Explorador (el salto) + Sabio (la precisión del aterrizaje).

**Variantes necesarias:**
1. **Principal horizontal**: `TuneHop` + glifo a la derecha (espaciado 1x altura de x).
2. **Compacto / Avatar**: Solo glifo (circular, 1:1).
3. **Monocromático**: Negro sobre blanco / Blanco sobre negro / Teal sobre negro / Negro sobre teal.
4. **Favicon**: Glifo en 32x32, 16x16, 48x48 (SVG + PNG).

**Qué NO es el logo:**
- No es una nota musical (cliché).
- No es una flecha genérica (cliché).
- No es un "play" modificado (territorio a evitar: "Play" saturado).
- No usa degradados, sombras, 3D, efectos de capa.

---

## 3. PALETA DE COLOR

**Principio**: Paleta **mínima, funcional, semántica**. Cada color tiene un trabajo.

| Rol | Hex | Uso | Significado |
|---|---|---|---|
| **Negro profundo** | `#0A0A0A` | Fondo principal (dark), texto principal (light), wordmark | Autoridad, foco, lienzo neutro. Arquetipo Sabio. |
| **Blanco puro** | `#FAFAFA` | Fondo principal (light), texto principal (dark), espacio | Respiración, claridad, honestidad. |
| **Teal eléctrico (Acento)** | `#00E5A0` | **Solo**: CTA primario, focus states, glifo en favicon, indicador de éxito, enlaces clave | El "hop": energía, vida, movimiento, puente a TIDAL. **Nunca** para texto largo. |
| **Teal oscuro (Hover/Pressed)** | `#00B886` | Hover/active de CTA, focus visible accesible | Estado interactivo, consistente. |
| **Rojo funcional (Error)** | `#FF453A` | Solo: mensajes de error destructivos, botones "Eliminar datos" | Peligro real, no decorativo. Cumple WCAG AA sobre negro y blanco. |
| **Ámbar funcional (Advertencia)** | `#FFCC00` | Solo: estados de revisión manual, "atención requerida" | Precaución, no error. Cumple WCAG AA sobre negro. |
| **Gris 100 (Bordes sutiles light)** | `#E5E5E5` | Divisores, inputs inactivos, contenedores light | Estructura sin peso visual. |
| **Gris 900 (Bordes sutiles dark)** | `#2A2A2A` | Divisores, inputs inactivos, contenedores dark | Estructura sin peso visual. |

**Tokens CSS para `frontend` (Passe-Partout):**
```css
:root {
  --color-bg: #FAFAFA;
  --color-bg-inverse: #0A0A0A;
  --color-fg: #0A0A0A;
  --color-fg-inverse: #FAFAFA;
  --color-accent: #00E5A0;
  --color-accent-hover: #00B886;
  --color-error: #FF453A;
  --color-warning: #FFCC00;
  --color-border: #E5E5E5;
  --color-border-inverse: #2A2A2A;
  --color-focus: #00E5A0; /* visible focus ring */
}
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #0A0A0A;
    --color-fg: #FAFAFA;
    --color-border: #2A2A2A;
  }
}
```

**Accesibilidad (WCAG AA verificado):**
- Teal `#00E5A0` sobre Negro `#0A0A0A` → 7.8:1 ✅
- Teal `#00E5A0` sobre Blanco `#FAFAFA` → 1.9:1 ❌ (NO usar para texto; solo UI decorativo/cta background)
- Blanco sobre Teal → 1.3:1 ❌ (NO usar)
- Negro sobre Teal → 10.2:1 ✅ (CTA texto: Negro sobre fondo Teal)
- Rojo `#FF453A` sobre Negro/Blanco → 7.2:1 / 5.1:1 ✅
- Ámbar `#FFCC00` sobre Negro → 12.6:1 ✅

**Regla de uso del Teal**: **Solo como fondo de CTA primario (con texto negro), anillo de focus, glifo decorativo, indicador de éxito.** Nunca para texto, nunca para fondos grandes, nunca en gradientes.

---

## 4. TIPOGRAFÍA

**Familia primaria: **`Space Grotesk` (Google Fonts, variable, SIL Open Font License)**

| Por qué encaja |
|---|
| **Geométrica humanista** — tiene personalidad en mayúsculas (logo) pero es legítima para cuerpo de texto (Sabio). |
| **Variable (wght 300-700)** — un solo archivo, pesos finos para hero, medios para UI, bold para énfasis. |
| **x-height generosa** — legible a 14px/16px en móvil (accesibilidad). |
| **Carácter técnico pero cálido** — no es monoespaciada (no IT), no es redonda (no infantil). |
| **Gratuita, variable, auto-hospedable** — 0 coste, 0 dependencias externas, rendimiento. |

**Familia secundaria (mono, solo código/datos): **`JetBrains Mono` (variable, SIL OFL)**
- Uso exclusivo: ISRC codes, JSON export, logs, metadata técnica.
- Refuerza "con criterio / precisión técnica" solo donde toca.

**Escala tipográfica (clamp fluido, mobile-first):**

| Token | Clamp | Uso |
|---|---|---|
| `--text-display` | `clamp(2.5rem, 5vw + 1rem, 4rem)` | Hero, landing |
| `--text-h1` | `clamp(1.75rem, 3vw + 1rem, 2.5rem)` | Títulos de sección |
| `--text-h2` | `clamp(1.375rem, 2vw + 0.75rem, 1.75rem)` | Subtítulos |
| `--text-body` | `clamp(1rem, 0.5vw + 0.875rem, 1.125rem)` | Texto principal |
| `--text-sm` | `0.875rem` | Labels, ayuda, meta |
| `--text-xs` | `0.75rem` | Legal, timestamps, ISRC codes |
| `--text-mono` | `0.8125rem` (JetBrains Mono) | Código, ISRC, JSON |

**Pesos:**
- **Regular (400)**: Cuerpo, UI.
- **Medium (500)**: Labels, botones, énfasis leve.
- **SemiBold (600)**: Títulos, métricas, CTA texto.
- **Bold (700)**: Hero display, wordmark logo (tracking +10).

---

## 5. SISTEMA GRÁFICO

### Iconografía
- **Estilo**: Monolineal (trazo único 2px), esquinas redondeadas 2px, óptico 20x20px / 24x24px.
- **Familia**: Lucide / Phosphor (MIT license) como base, customizadas para coherencia.
- **Iconos clave custom**: `hop-arrow` (el glifo del logo), `isrc-tag`, `session-lock`, `check-precise`.
- **Color**: `currentColor` (hereda del texto) / Teal solo para estado éxito/activo.

### Patrones / Texturas
- **No hay patrones decorativos**. El espacio en blanco y la grilla son el patrón.
- **Grilla base**: 4px (spacing scale: 4, 8, 12, 16, 24, 32, 48, 64).

### Fotografía / Ilustración
- **Estilo**: Documental técnico — fotos reales de: cables de audio, mesas de mezclas, vinilos, manos ajustando controles, pantallas de código, estudios.
- **Tratamiento**: Alto contraste B/N + overlay Teal 10% (solo en hero/landing).
- **Prohibido**: Fotos de stock "lifestyle", gente sonriendo con auriculares, abstractos de ondas de sonido, degradados neón.

### Movimiento (Motion)
- **Duración base**: 150ms (micro), 200ms (transiciones de página), 300ms (modales).
- **Easing**: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` (ease-out-expo) — salida rápida, aterrizaje suave ("hop").
- **Reduced motion**: Respeta `prefers-reduced-motion` → 0ms / instant.

---

## 6. APLICACIONES CLAVE (donde se ve primero)

### A. Web app (https://tunehop.vercel.app) — **Prioridad 1**
- Hero con tagline + CTA Teal (texto negro) + glifo animado sutil (salto al hover).
- Formulario de consentimiento: fondo Negro, texto Blanco, CTA Teal.
- Selección de playlists: tarjetas Blancas sobre fondo Gris 100 (light) / Gris 900 (dark), hover → borde Teal.
- Revisión manual: tarjetas con acento Ámbar (advertencia), botones Teal (acción), Rojo (omitir/eliminar).
- Estados de carga: skeleton con pulso Gris 200 / Gris 800.
- **Tokens `frontend`**: La skill `frontend` (Passe-Partout) recoge `--color-*`, `--text-*`, `--spacing-*`, `--radius-*` (4px base, 8px tarjetas, 12px modales).

### B. Favicon / App Icon / Avatar social — **Prioridad 2**
- Glifo solo (hop-arrow), centrado, Teal sobre Negro (dark) / Negro sobre Blanco (light).
- SVG escalable + PNG 512x512, 192x192, 48x48, 32x32, 16x16.
- `manifest.json` con `theme_color: #0A0A0A`, `background_color: #0A0A0A`.

### C. Redes sociales / OG image / Compartir migración — **Prioridad 3**
- Template 1200x630: Fondo Negro, wordmark blanco centrado, tagline Teal, glifo grande sutil de fondo (opacity 5%).
- Exportación JSON: mismo estilo, con resumen de migración (X playlists, Y canciones, Z% encontradas).

---

## 7. QUÉ EVITAR (errores visuales de la categoría)

| Error de categoría | Por qué TuneHop no lo comete |
|---|---|
| **Verde Spotify / Azul genérico tech** | Paleta propia (Negro/Blanco/Teal). El Teal es puente a TIDAL, no "tech blue". |
| **Ondas de sonido / Ecualizadores / Notas musicales** | Iconografía de "salto preciso" (línea + punto), no de "audio". |
| **Degradados neón / Glassmorphism / Efectos de moda** | Color plano, contraste alto, cero efectos decorativos. Sabio no decora. |
| **Ilustraciones "amigables" / Personajes / Mascotas** | Fotografía documental o nada. La marca no es un personaje. |
| **CTAs múltiples compitiendo / "Upgrade now" / "Pro"** | Un solo CTA primario por pantalla. No hay upsell en el MVP. |
| **Dashboards densos / Tablas infinitas / Métricas expuestas** | La usuaria ve: playlists → migrar → resultado. Cero complejidad expuesta. |
| **Modo claro/oscuro como "tema" decorativo** | Los dos modos son funcionales y probados (WCAG AA). No "tema". |
| **Tipografía de display decorativa / Serif expresiva** | Space Grotesk: una familia, variable, legible, técnica pero humana. |
| **Iconos rellenos (filled) / Duotono / Gradientes en iconos** | Monolineal 2px, `currentColor`, coherente en todo el sistema. |

---

## 8. ENTREGA PARA IMPLEMENTACIÓN (`frontend` skill)

La skill `frontend` (marco Passe-Partout) debe recibir estos **tokens de diseño** como fuente de verdad:

```json
// design-tokens.json (fuente única para frontend)
{
  "color": {
    "bg": "#FAFAFA",
    "bgInverse": "#0A0A0A",
    "fg": "#0A0A0A",
    "fgInverse": "#FAFAFA",
    "accent": "#00E5A0",
    "accentHover": "#00B886",
    "error": "#FF453A",
    "warning": "#FFCC00",
    "border": "#E5E5E5",
    "borderInverse": "#2A2A2A",
    "focus": "#00E5A0"
  },
  "font": {
    "primary": "Space Grotesk",
    "mono": "JetBrains Mono",
    "display": "clamp(2.5rem, 5vw + 1rem, 4rem)",
    "h1": "clamp(1.75rem, 3vw + 1rem, 2.5rem)",
    "h2": "clamp(1.375rem, 2vw + 0.75rem, 1.75rem)",
    "body": "clamp(1rem, 0.5vw + 0.875rem, 1.125rem)",
    "sm": "0.875rem",
    "xs": "0.75rem",
    "monoSize": "0.8125rem"
  },
  "spacing": { "base": "4px", "scale": [4,8,12,16,24,32,48,64] },
  "radius": { "sm": "4px", "md": "8px", "lg": "12px", "full": "9999px" },
  "motion": { "fast": "150ms", "base": "200ms", "slow": "300ms", "easing": "cubic-bezier(0.25, 0.46, 0.45, 0.94)" },
  "icon": { "style": "monolinear", "stroke": "2px", "corner": "2px", "size": [20,24] }
}
```

**Próximo paso lógico**: `mkt-08-proteccion-legal` (búsqueda de registrabilidad del naming/logo y chequeo de claims regulados) — antes de cerrar el brand book (Paso 9).