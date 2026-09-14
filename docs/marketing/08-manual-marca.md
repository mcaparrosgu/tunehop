# Marketing — Paso 9 · Manual de marca (08-manual-marca.md)

> Brand book navegable que consolida identidad verbal + visual + estado legal.
> Fuente única de verdad para cualquier pieza de comunicación de TuneHop.
> **Este documento cierra la Fase A (Cimientos de marca).**
>
> Autora: Corita (directora creativa). Fecha: 2026-09-11.
> Estado: **Cerrado para uso interno; pendiente visto bueno legal profesional (Paso 8).**

---

## 1. RESUMEN EJECUTIVO

**TuneHop** es la herramienta de migración de playlists que te da la libertad de llevar tu música a donde pagan mejor a los artistas — en minutos, sin fricción técnica, sin ceder tu privacidad.

**Posicionamiento**: Para la Switcher Ética (persona no técnica con playlists valiosas y motivación por el pago justo), TuneHop es la herramienta de migración que te deja irte a la plataforma que paga mejor a los artistas en minutos, sin tocar tu Spotify y sin guardar nada de ti, porque usa códigos universales ISRC, procesa todo en tu sesión y borra todo al cerrar.

**Personalidad**: Libre · Honesta · Con criterio · Ligera
**Arquetipos**: Explorador (primario, libertad de movimiento) + Sabio (secundario, verdad y criterio)
**Tagline**: **Tu música, donde pagan mejor. En minutos.**

---

## 2. IDENTIDAD VERBAL (resumen)

### Tono de voz — 4 ejes

| Eje | Posición | Ejemplo real |
|---|---|---|
| Cercano ↔ Formal | Cercano, sin confianzudo | *"Conecta tu Spotify y elige qué playlists quieres llevar a TIDAL. Tardas menos de lo que dura un café."* |
| Serio ↔ Lúdico | Serio en la promesa, ligero en la forma | *"Tu música se muda. Tú te quedas tranquila."* |
| Experto ↔ Accesible | Experto invisible | *"Buscamos cada canción por su código único (ISRC). Si no está, probamos por nombre y artista en 5 países. Tú solo eliges."* |
| Neutro ↔ Apasionado | Convencida, no evangelizadora | *"TIDAL paga ~3x más por stream que Spotify. El dato está ahí. La decisión, tú."* |

### Mensajes clave — 3 niveles

**Nivel 1 — Promesa central**
> Tu música se muda a donde pagan mejor a los artistas. En minutos. Sin que pierdas nada. Sin que guardemos nada.

**Nivel 2 — Pilares**
1. Simple para ti, rigurosa por dentro (3 clics, ISRC, fallback multi-país, revisión manual).
2. Privacidad radical (solo lectura / solo escritura, tokens en sesión, borrado real RGPD Art. 17).
3. Destino con criterio (TIDAL paga ~3-7x más por stream, dato público).
4. Dirección única, sin líos (Spotify → TIDAL, punto).

**Nivel 3 — Pruebas de confianza**
- Sin email, sin tarjeta, sin suscripción, sin cuenta.
- Código abierto en GitHub (cuando sea público), auditable.
- Hecha por una persona real (mcaparrosgu), con formación en Comunicación + Creatividad publicitaria.

### Tagline
**Tu música, donde pagan mejor. En minutos.**

### Vocabulario prohibido (líneas rojas)
| No uses | Usa en su lugar |
|---|---|
| "Transferir / Transfer" | "Mudar / Llevar / Migrar" |
| "Sincronizar / Sync" | "Migrar / Copiar" |
| "Gestionar / Biblioteca / Colección" | "Playlists" |
| "Gratis / Free" | "Sin coste / Sin tarjeta / Sin suscripción" |
| "Seguro / Seguridad" | "Privacidad radical / Solo lectura / Borrado real" |
| "Fácil / Simple / En un clic" | "3 clics / En minutos / Tú solo eliges" |
| "Mejor / La mejor / Nº1" | "~3-7x más por stream / Datos públicos / Tú decides" |
| "Huir / Escapar / Dejar atrás" | "Irte / Mudar / Elegir tu destino" |
| "Plataforma destino / Servicio de destino" | "TIDAL" |

---

## 3. IDENTIDAD VISUAL (resumen con valores exactos)

### Logo — Concepto: "El salto preciso"

**Wordmark**: `TuneHop` (Space Grotesk Bold, tracking +10) + glifo a la derecha (gap 1x altura de x).
**Glifo**: Nace de la pierna derecha de la **'h' de "hop"** → se alarga, curva y aterriza en un punto preciso. Trazo monolineal 2.5px, esquina redondeada, punto de aterrizaje (círculo 2.5px).
**Variantes**:
- Principal horizontal: wordmark + glifo
- Compacta / Avatar: solo glifo (circular 1:1)
- Monocromáticas: Negro sobre blanco / Blanco sobre negro / Teal sobre negro / Negro sobre teal
- Favicon: glifo 32x32, 16x16, 48x48 (SVG + PNG)

### Paleta de color — Mínima, semántica, WCAG AA

| Rol | Hex | Uso exclusivo |
|---|---|---|
| Negro profundo | `#0A0A0A` | Fondo dark, texto light, wordmark |
| Blanco puro | `#FAFAFA` | Fondo light, texto dark, espacio |
| **Teal eléctrico (Acento)** | `#00E5A0` | **SOLO**: CTA primario (texto NEGRO), focus ring, glifo favicon, indicador éxito |
| Teal hover/pressed | `#00B886` | Hover/active CTA, focus visible |
| Rojo funcional (Error) | `#FF453A` | Errores destructivos, botón "Eliminar datos" |
| Ámbar funcional (Advertencia) | `#FFCC00` | Revisión manual, atención requerida |
| Gris 100 (Bordes light) | `#E5E5E5` | Divisores, inputs light |
| Gris 900 (Bordes dark) | `#2A2A2A` | Divisores, inputs dark |

**Regla de oro del Teal**: **NUNCA** para texto, **NUNCA** para fondos grandes, **NUNCA** en gradientes. Solo: fondo CTA primario (con texto negro), anillo focus, glifo decorativo, éxito.

### Tipografía

| Familia | Uso | Por qué |
|---|---|---|
| **Space Grotesk** (variable, wght 300-700, Google Fonts, SIL OFL) | Primaria: UI, hero, body, wordmark | Geométrica humanista, x-height generosa, técnica pero cálida, gratuita, auto-hospedable |
| **JetBrains Mono** (variable, wght 400-700, SIL OFL) | Secundaria: ISRC, JSON, logs, código | Monoespaciada legible, refuerza "precisión técnica" solo donde toca |

**Escala fluida (clamp)**:
- Display: `clamp(2.5rem, 5vw + 1rem, 4rem)` — Hero
- H1: `clamp(1.75rem, 3vw + 1rem, 2.5rem)` — Secciones
- H2: `clamp(1.375rem, 2vw + 0.75rem, 1.75rem)` — Subtítulos
- Body: `clamp(1rem, 0.5vw + 0.875rem, 1.125rem)` — Texto principal
- SM: `0.875rem` — Labels, ayuda
- XS: `0.75rem` — Legal, ISRC
- Mono: `0.8125rem` (JetBrains Mono) — Código, ISRC, JSON

### Sistema gráfico

- **Iconografía**: Monolineal 2px, esquinas 2px, óptico 20x20/24x24, `currentColor` (Teal solo éxito/activo). Base: Lucide/Phosphor MIT + custom (`hop-arrow`, `isrc-tag`, `session-lock`).
- **Fotografía**: Documental técnico (cables, mesas de mezclas, vinilos, manos en controles, pantallas de código). Tratamiento: B/N alto contraste + overlay Teal 10% (solo hero). **Prohibido**: lifestyle, gente feliz con auriculares, ondas abstractas, degradados neón.
- **Motion**: 150ms (micro), 200ms (transiciones), 300ms (modales). Easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` (ease-out-expo = "hop"). Respeta `prefers-reduced-motion`.
- **Grilla**: Base 4px (4, 8, 12, 16, 24, 32, 48, 64). Radios: 4px (sm), 8px (md), 12px (lg), 9999px (full).

### Aplicaciones clave (prioridad)

1. **Web app** (tunehop.vercel.app) — Hero, consentimiento, selección playlists, revisión manual, resultados.
2. **Favicon / App icon / Avatar social** — Glifo solo, Teal sobre Negro / Negro sobre Blanco.
3. **OG image / Redes / Compartir migración** — 1200x630: Negro, wordmark blanco, tagline Teal, glifo sutil 5% opacity.

---

## 4. ESTADO LEGAL (resumen Paso 8)

| Activo | Estado | Acción requerida |
|---|---|---|
| **Nombre "TuneHop"** | Sin colisiones idénticas visibles (EUIPO, OEPM, USPTO, web, stores). Distintividad media-alta (sugerente). | 🔴 **Informe viabilidad + registro abogado** (clases 9, 35, 38, 41, 42; UE + ES + US). |
| **Logo (wordmark + glifo)** | Registrable (denominativa + figurativa + mixta). Glifo geométrico simple — requiere distintividad por uso. | 🔴 **Registro mixta + wordmark abogado**. Cesión derechos autor si diseño externo. |
| **Claims centrales** | 6 claims regulados de riesgo identificados (pago artistas comparativo, superlativo "mejor", privacidad/borrado real, "sin email/tarjeta", "código abierto", rendimiento). | 🔴 **Base de pruebas + revisión abogado competencia/RGPD** antes de campaña. |
| **Dominios** | tunehop.com / .app / .es libres (parking). | 🟡 **Comprar YA** (~35 €/año). |
| **Handles sociales** | @tunehop por verificar en X, IG, Bluesky, LinkedIn, TikTok, GH. | 🟡 **Reservar YA** (coste 0). |

> **Este manual NO sustituye revisión legal profesional.** Cualquier uso público de claims regulados o inversión en branding requiere informe de abogado cualificado.

---

## 5. USOS CORRECTOS E INCORRECTOS

### Logo

| ✅ CORRECTO | ❌ INCORRECTO |
|---|---|
| Wordmark + glifo horizontal, espacio 1x altura de x | Glifo separado del wordmark en uso principal |
| Glifo solo en favicon, avatar, app icon (1:1) | Glifo solo en hero o header web (usa wordmark) |
| Negro sobre fondo blanco / Blanco sobre fondo negro | Logo en color sobre fondo de color (salvo Teal/negro) |
| Teal sobre Negro (favicon) / Negro sobre Blanco | Teal sobre Blanco (contraste 1.9:1 — falla WCAG) |
| Espacio de respeto = altura de la 'T' perimetral | Elementos tocando el logo (texto, bordes, otros logos) |
| Tamaño mínimo: 24px altura wordmark / 16px glifo | Escalar por debajo del mínimo legible |

### Color

| ✅ CORRECTO | ❌ INCORRECTO |
|---|---|
| CTA primario: fondo Teal `#00E5A0` + texto Negro `#0A0A0A` | Texto en Teal sobre Blanco (contraste 1.9:1 — falla AA) |
| Focus ring: Teal `#00E5A0` 2px + offset 2px | Focus ring en azul genérico / verde Spotify / gris |
| Fondo Negro `#0A0A0A` + texto Blanco `#FAFAFA` (dark) | Fondos grises intermedios / "temas" decorativos |
| Blanco `#FAFAFA` + texto Negro `#0A0A0A` (light) | Degradados, glassmorphism, sombras decorativas |
| Rojo `#FF453A` solo para error destructivo | Rojo para acentos decorativos / botones primarios |

### Tipografía

| ✅ CORRECTO | ❌ INCORRECTO |
|---|---|
| Space Grotesk 400/500/600/700 según jerarquía | Pesos no definidos (Light 300 en body, ExtraBold inexistente) |
| JetBrains Mono solo para ISRC, JSON, código, logs | JetBrains Mono en body, hero, botones, UI general |
| Clamp fluido (respetar breakpoints) | Tamaños fijos en px que no escalan |
| Tracking +10 en wordmark logo | Tracking negativo / condensing artificial |

### Voz

| ✅ CORRECTO | ❌ INCORRECTO |
|---|---|
| "Conecta tu Spotify y elige qué playlists llevar a TIDAL" | "Transfiere tu biblioteca musical a la plataforma de destino" |
| "TIDAL paga ~3x más por stream. El dato está ahí." | "TIDAL es la mejor plataforma para los artistas" (superlativo sin prueba) |
| "Solo lectura en Spotify. Solo escritura en TIDAL." | "Accedemos a tu biblioteca de Spotify de forma segura" (eufemismo) |
| "Tu música se muda. Tú te quedas tranquila." | "Por fin libre de Spotify" (lenguaje de ruptura/Forajido) |
| "Sin email. Sin tarjeta. Sin suscripción. Sin cuenta." | "Gratis para siempre" (claim que caduca si cambia modelo) |

---

## 6. CHECKLIST DE COHERENCIA (revisa antes de publicar cualquier pieza)

**Identidad visual**
- [ ] Logo: variante correcta (wordmark+glifo / solo glifo) + espacio de respeto
- [ ] Paleta: solo Negro, Blanco, Teal (acento), Rojo error, Ámbar warning, Grises bordes
- [ ] Teal: **solo** CTA primario (texto negro), focus ring, glifo, éxito — nunca texto, nunca fondo grande
- [ ] Tipografía: Space Grotesk (UI/hero/body) + JetBrains Mono (solo código/ISRC/JSON)
- [ ] Contraste WCAG AA verificado en todos los pares texto/fondo
- [ ] Iconografía: monolineal 2px, `currentColor`, Teal solo éxito/activo
- [ ] Motion: easing hop (ease-out-expo), respeta `prefers-reduced-motion`

**Identidad verbal**
- [ ] Tono: cercano sin confianzudo / serio en promesa-ligero en forma / experto invisible / convencida no evangelizadora
- [ ] Mensaje N1 visible en hero / primer párrafo / asunto email
- [ ] Cero palabras prohibidas (transfer, sync, gratis, seguro, fácil, mejor, huir, plataforma destino...)
- [ ] Claims regulados: solo si tienen base de pruebas actualizada y revisión legal

**Legal / Técnico**
- [ ] Dominio tunehop.com apuntando a producción
- [ ] Handles @tunehop reservados en redes relevantes
- [ ] Política de privacidad / Términos revisados por abogado
- [ ] Repo público con licencia MIT (si se usa claim "código abierto")
- [ ] Auditoría borrado real RGPD documentada

**Calidad**
- [ ] Test en móvil + desktop + dark/light mode
- [ ] Navegación teclado completa + focus visible
- [ ] Textos en español (i18n), sin anglicismos en UI
- [ ] Sin consola errors / warnings en build

---

## 7. TOKENS DE DISEÑO (fuente única para implementación)

```json
{
  "color": {
    "bg": "#FAFAFA",
    "bgInverse": "#0A0A0A",
    "fg": "#0A0A0A",
    "fgInverse": "#FAFAFA",
    "accent": "#00E5A0",
    "accentHover": "#00B886",
    "accentFg": "#0A0A0A",
    "error": "#FF453A",
    "errorFg": "#FAFAFA",
    "warning": "#FFCC00",
    "warningFg": "#0A0A0A",
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
  "icon": { "style": "monolineal", "stroke": "2px", "corner": "2px", "size": [20,24] }
}
```

---

**Fin del Manual de Marca — Fase A cerrada.**

> Próxima fase (B): **La idea y su validación** → Paso 10 Brief creativo → Paso 11 Gran Idea → Paso 12 Validación de concepto → Paso 13 Aprobación.