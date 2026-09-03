# Paso 8 — Tareas de Implementación

**Fecha**: 31/08/2026
**Estado**: ✅ En construcción — Hito 1 completado
**Regla**: Cada tarea es implementable Y comprobable de forma aislada, en menos de 1 hora.

---

## HITO 1 — Setup del proyecto ✅

**Qué ves cuando este hito termina**: Abres el navegador, escribes `localhost:3000`, y ves una pantalla con "TuneHop". El proyecto existe y funciona.

| # | Tarea | Archivos | Cómo compruebo | Depende de |
|---|---|---|---|---|
| ✅ T01 | Crear proyecto Next.js con TypeScript y Tailwind | `package.json`, `next.config.ts`, `tsconfig.json` | Abro `localhost:3000` y veo la pantalla de bienvenida | Ninguna |
| ✅ T02 | Configurar estructura de carpetas | `src/app/`, `src/components/`, `src/lib/`, `src/types/`, `src/api/` | Veo todas las carpetas en el explorador | T01 |
| ✅ T03 | Crear `.env.example` con variables de entorno | `.env.example` | El archivo lista: `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `DEEZER_APP_ID`, `DEEZER_APP_SECRET` | T01 |
| ✅ T04 | Verificar `.env.local` en `.gitignore` | `.gitignore` | `git status` no muestra `.env.local` | T01 |

---

## HITO 2 — Landing y consentimiento ✅

**Qué ves cuando este hito termina**: La landing se ve profesional con el botón "Connect Spotify", el aviso de privacidad, y el checkbox de consentimiento que activa el botón.

| # | Tarea | Archivos | Cómo compruebo | Depende de |
|---|---|---|---|---|
| ✅ T05 | Crear componente `Button.tsx` reutilizable | `src/components/Button.tsx` | Veo un botón azul que puedo pulsar | T02 |
| ✅ T06 | Crear componente `Checkbox.tsx` reutilizable | `src/components/Checkbox.tsx` | Veo una casilla que puedo marcar/desmarcar | T02 |
| ✅ T07 | Crear la Landing (Pantalla 1) | `src/app/page.tsx` | Veo: título "TuneHop", subtítulo, botón "Connect Spotify", texto de privacidad, enlace a Política de Privacidad | T02, T05 |
| ✅ T08 | Crear Política de Privacidad como página estática | `src/app/politica-privacidad/page.tsx` | Al pulsar el enlace, se abre la página con: datos tratados, finalidad, base legal, derechos, plazo, responsable | T07 |
| ✅ T09 | Crear Pantalla 2 (Consentimiento) | `src/app/consentimiento/page.tsx` | Veo: checkbox con texto legal, aviso sobre títulos, botón desactivado | T02, T06 |
| ✅ T10 | Verificar que el botón solo se activa con checkbox marcado | `src/app/consentimiento/page.tsx` | Sin marcar: botón gris. Con checkbox: botón azul | T09 |

---

## HITO 3 — OAuth con Spotify ✅

**Qué ves cuando este hito termina**: Pulso "Connect Spotify", voy a Spotify, acepto, y vuelvo con mis playlists cargadas.

| # | Tarea | Archivos | Cómo compruebo | Depende de |
|---|---|---|---|---|
| ✅ T11 | Registrar app en Spotify Developer Dashboard | Spotify Dashboard (web externa) | Tengo `SPOTIFY_CLIENT_ID` y `SPOTIFY_CLIENT_SECRET` en `.env.local` | T03 |
| ✅ T12 | Crear API Route `/api/spotify/auth` | `src/app/api/spotify/auth/route.ts` | Al llamar a la ruta, redirige a Spotify | T02 |
| ✅ T13 | Crear API Route `/api/spotify/callback` | `src/app/api/spotify/callback/route.ts` | Tras aceptar en Spotify, vuelve a TuneHop con token en cookie | T12 |
| ✅ T14 | Crear función `getSpotifyPlaylists()` | `src/lib/spotify.ts` | La función devuelve un array con nombre + nº de canciones | T13 |
| ✅ T15 | Crear API Route `/api/playlists` | `src/app/api/playlists/route.ts` | Abro la ruta y veo un JSON con mis playlists | T14 |
| ✅ T16 | Conectar botón "Conectar" al flujo OAuth completo | `consentimiento/page.tsx` | Pulso botón nativo `<a>` → checkbox → Spotify → acepto → vuelvo con playlists | T07, T09, T12 |

> **Nota de implementación**: T15 se implementó como `/api/playlists` (no `/api/spotify/playlists`) porque las rutas de Spotify se organizaron bajo `src/app/api/spotify/` y la de lectura de playlists quedó separada.

---

## HITO 4 — Selección de playlists ✅

**Qué ves cuando este hito termina**: Veo mis playlists de Spotify con nombre, nº de canciones y checkbox. Puedo seleccionar y pulsar "Continuar".

| # | Tarea | Archivos | Cómo compruebo | Depende de |
|---|---|---|---|---|
| ✅ T17 | Crear componente `PlaylistCard.tsx` | `src/components/PlaylistCard.tsx` | Veo tarjeta con nombre, nº canciones y checkbox | T02, T06 |
| ✅ T18 | Crear componente `SelectAllButton.tsx` | `src/components/SelectAllButton.tsx` | Botón "Seleccionar todo" marca todas; "Quitar selección" desmarca todas | T02, T05 |
| ✅ T19 | Crear Pantalla 3 (Selección) | `src/app/playlists/page.tsx` | Veo: título, botón seleccionar todo, lista de tarjetas, contador, botón "Continuar" | T15, T17, T18 |
| ✅ T20 | Verificar que "Continuar" solo se activa con ≥1 seleccionada | `src/app/playlists/page.tsx` | Sin seleccionar: gris. Con 1+: azul. Guarda selección en `sessionStorage` y navega a `/destino` | T19 |

> **Nota de implementación**: T17 y T18 se implementaron inline en `playlists/page.tsx` (no como componentes separados) porque la complejidad no justificaba archivos adicionales.

---

## HITO 5 — OAuth con TIDAL (destino)

> **Nota de 2026-09-03**: el destino pasó de Deezer a TIDAL. Deezer cerró el registro de
> apps nuevas (2024). Este hito y los siguientes de escritura usan **TIDAL** (API v2).

**Qué ves cuando este hito termina**: Pulso "Connect TIDAL", voy a TIDAL, acepto, y vuelvo con la conexión establecida.

| # | Tarea | Archivos | Cómo compruebo | Depende de |
|---|---|---|---|---|
| ✅ T21 | Registrar app en TIDAL Developer Portal | TIDAL Portal (web externa) | Tengo `TIDAL_CLIENT_ID` y `TIDAL_CLIENT_SECRET` en `.env.local` | T03 |
| ✅ T22 | Crear API Route `/api/tidal/auth` | `src/app/api/tidal/auth/route.ts` | Al llamar a la ruta, redirige a `login.tidal.com/authorize` | T02 |
| ✅ T23 | Crear API Route `/api/tidal/callback` | `src/app/api/tidal/callback/route.ts` | Tras aceptar en TIDAL, se guarda el token en cookie `tidal_user_tokens` | T22 |
| ✅ T24 | Crear Pantalla 4 (Destino) | `src/app/destino/page.tsx` | Veo: "Elige plataforma destino", botón "Connect TIDAL", "No se borra nada de Spotify" | T02 |
| ✅ T25 | Conectar botón "Connect TIDAL" al flujo OAuth | `destino/page.tsx` | Pulso → TIDAL → acepto → vuelvo (usa `<a>` nativo vía `external`) | T20, T24 |
| ✅ | Probar de punta a punta | Todo | Conecto TIDAL, migro 1 playlist pequeña de 2-3 tracks y aparece en TIDAL real (VERIFICADO 2026-09-03) | T19, T25 |

---

## HITO 6 — Migración core ✅

> **Nota de 2026-09-03**: la migración se construyó contra TIDAL v2 (API pública JSON:API),
> no contra Deezer. La arquitectura real difiere de la planificada: la lógica de migración
> vive en `migrando/page.tsx` + `tidal.ts` (no en archivos separados `isrc.ts`/`migration.ts`).

**Qué ves cuando este hito termina**: Selecciono 1 playlist, pulso "Migrar", veo la barra de progreso, y la playlist aparece en TIDAL.

| # | Tarea | Archivos | Cómo compruebo | Depende de |
|---|---|---|---|---|
| ✅ T26 | Crear tipos TypeScript | interfaces en `src/lib/tidal.ts` | `TidalMatch`, `TidalTrackNode` con campos string (v2) | T02 |
| ✅ T27 | Crear función `searchTrackByISRC()` | `src/lib/tidal.ts` | Le paso un ISRC, usa token de usuario, busca por `filter[isrc]` en TIDAL v2 | T23 |
| ✅ T28 | Crear función `searchTracksByISRC()` | `src/lib/tidal.ts` | Le paso N ISRCs, busca en lotes de 20 con `filter[isrc]` múltiple | T27 |
| ✅ T29 | Crear función `migratePlaylist()` | `src/app/migrando/page.tsx` (inline) | Le paso playlist + tokens → busca tracks → crea playlist → añade → devuelve resultado | T27 |
| ✅ T30 | Crear API Route `/api/tidal/create-playlist` | `src/app/api/tidal/create-playlist/route.ts` | POST con `{title, description, trackIds}` → crea playlist + añade tracks en batches | T26 |
| ✅ T31 | Crear componente `ProgressBar.tsx` | `src/app/migrando/page.tsx` (inline) | Veo barra con stages: fetching → matching → creating → adding → done | T02 |
| ✅ T32 | Crear Pantalla 5 (Progreso) | `src/app/migrando/page.tsx` | Veo: "Migrando...", stages, contador, link "Ver en TIDAL" al terminar | T30, T31 |
| ✅ T33 | Crear componente `ErrorMessage.tsx` | `src/app/error/page.tsx` | Veo error con mensaje concreto de TIDAL/Spotify | T02 |
| ✅ T34 | **PROBAR 1 playlist completa** | Todo | Selecciono 1 playlist → conecto TIDAL → migro → aparece en TIDAL real (VERIFICADO 2026-09-03) | T19, T25, T30, T32 |

---

## HITO 7 — Resultado y errores ✅

> **Estado**: completado el 2026-09-03 (commit `7cc5894`).

**Qué ves cuando este hito termina**: Después de migrar veo un resumen claro, y si algo falla veo el error concreto.

| # | Tarea | Archivos | Cómo compruebo | Depende de |
|---|---|---|---|---|
| ✅ T35 | Crear Pantalla 6 (Resultado) | `src/app/migrando/page.tsx` | Veo: resumen, ✅/⚠️, no encontradas, "Ver detalle", "Migrar más", "Eliminar datos", "Abrir TIDAL" | T02, T33 |
| ✅ T36 | Crear pantalla de detalle de no encontradas | `src/app/migrando/page.tsx` (expandible inline) | Al pulsar "Ver detalle": lista con título + artista + ISRC | T35 |
| ✅ T37 | Manejar token caducado de Spotify | `src/app/migrando/page.tsx` | Si caduca: "Sesión de Spotify caducada. Reconéctate." + botón reintentar | T14, T32 |
| ✅ T38 | Manejar token caducado de TIDAL | `src/app/migrando/page.tsx` | Si caduca: "Sesión de TIDAL caducada. Reconéctate." + botón reintentar | T23, T32 |
| ✅ T39 | Manejar rate limit (backoff exponencial) | `src/app/migrando/page.tsx` | Ante 429: respeta `Retry-After`, backoff 2^n hasta 8s, 3 reintentos máx | T29 |
| ✅ T40 | Manejar playlist duplicada en TIDAL | `src/lib/tidal.ts` | 409 = ya estaban → trátalo como éxito (ya implementado) | T29, T32 |

> **Nota de 2026-09-03**: la Pantalla 6 se integró en `migrando/page.tsx` (no como `/resultado` separado)
> porque el flujo ya vive en esa pantalla y separarlo requeriría pasar datos por URL o sessionStorage
> de forma innecesaria.

---

## HITO 8 — Tandas de 50 ✅

> **Nota de 2026-09-03**: completado en `96724b0`. Se separó la API en `create-playlist`
> (solo crea) y `add-tracks` (añade por tandas), para que el cliente pueda mostrar progreso.

**Qué ves cuando este hito termina**: Selecciono una playlist grande, la app migra en tandas de 20 tracks mostrando "Tanda 1 de N".

| # | Tarea | Archivos | Cómo compruebo | Depende de |
|---|---|---|---|---|
| ✅ T41 | Implementar lógica de tandas de 20 tracks | `src/lib/tidal.ts` + `src/app/migrando/page.tsx` | 60 tracks → se dividen en 3 tandas de 20 con pausa 300ms | T29 |
| ✅ T42 | Mostrar número de tanda en progreso | `src/app/migrando/page.tsx` | Veo "Añadiendo tracks... Tanda 1 de 3" durante la adición | T41, T32 |
| ✅ T43 | Pausa de 300ms entre tandas | `src/app/migrando/page.tsx` | Pausa visible entre tandas | T41 |

---

## HITO 9 — Legal y privacidad

> **Estado**: verificado en 2026-09-03. El botón "Eliminar datos y cerrar" se implementó en HITO 7.
> El checkbox obligatorio y la política de privacidad ya existían. La verificación F12 (no datos en
> storage tras cerrar) y HTTPS se confirman al hacer deploy.

**Qué ves cuando este hito termina**: Checkbox obligatorio, Política completa, botón de borrado, datos solo en sesión.

| # | Tarea | Archivos | Cómo compruebo | Depende de |
|---|---|---|---|---|
| ✅ T44 | Verificar checkbox obligatorio antes de conectar | `consentimiento/page.tsx` | Sin checkbox no puedo avanzar (ya implementado con `disabled={!aceptado}`) | T10 |
| ✅ T45 | Verificar Política de Privacidad completa | `politica-privacidad/page.tsx` | Incluye: datos, finalidad, base legal, derechos, plazo, responsable | T08 |
| ✅ T46 | Crear botón "Eliminar mis datos y cerrar" | `migrando/page.tsx` (estado done) | Al pulsar: limpia cookies + sessionStorage, vuelve a landing | T35 |
| ⏳ T47 | Verificar que no se guardan datos tras cerrar sesión | `lib/spotify-auth.ts`, `lib/tidal-auth.ts` | F12 → Application → Storage: sin tokens ni datos (verificar en deploy) | T46 |
| ⏳ T48 | Verificar HTTPS en todo | `next.config.ts`, Vercel | URL empieza por `https://`, sin advertencias (verificar en deploy) | T01 |

---

## HITO 10 — Responsive y accesibilidad

**Qué ves cuando este hito termina**: La app se ve bien en móvil y es navegable con teclado.

| # | Tarea | Archivos | Cómo compruebo | Depende de |
|---|---|---|---|---|
| T49 | Landing responsive | `page.tsx`, `globals.css` | Cambio tamaño de ventana: botón y texto se adaptan | T07 |
| T50 | Selección responsive | `playlists/page.tsx` | Móvil: tarjetas apiladas. Escritorio: cuadrícula | T19 |
| T51 | Progreso responsive | `migrar/page.tsx` | Barra ocupa todo el ancho en móvil | T32 |
| T52 | Navegación por teclado (Tab+Enter) | Todos los `page.tsx` | Navego toda la app sin ratón, foco visible | T07-T35 |
| T53 | Texto alternativo en iconos | Todos componentes | Iconos tienen `alt`/`aria-label` | T05-T06 |
| T54 | Verificar contraste WCAG 2.1 AA (4.5:1) | `globals.css` | WebAIM Contrast Checker aprueba todos los textos | T01 |

---

## HITO 11 — Internacionalización

**Qué ves cuando este hito termina**: La app se muestra en español y puedo cambiar a euskera, catalán, inglés, etc.

| # | Tarea | Archivos | Cómo compruebo | Depende de |
|---|---|---|---|---|
| T55 | Configurar i18n en Next.js | `next.config.ts`, `src/i18n/` | La app detecta idioma del navegador | T01 |
| T56 | Crear traducciones al español | `src/i18n/es.json` | Todos los textos en español | T55 |
| T57 | Crear traducciones para 24 idiomas oficiales UE | `src/i18n/{lang}.json` | Al cambiar idioma, textos cambian | T56 |
| T58 | Crear traducciones para lenguas regionales | `src/i18n/{lang}.json` | Euskera, catalán, gallego se muestran correctamente | T56 |
| T59 | Añadir selector de idioma | `LanguageSelector.tsx` | Menú desplegable con todos los idiomas, cambio inmediato | T55, T56 |

---

## HITO 12 — Deploy

**Qué ves cuando este hito termina**: Escribes la URL y ves la app funcionando en internet.

| # | Tarea | Archivos | Cómo compruebo | Depende de |
|---|---|---|---|---|
| T60 | Crear repositorio en GitHub + push | GitHub | Código en GitHub | T01-T59 |
| T61 | Conectar repositorio a Vercel | Vercel Dashboard | Vercel detecta Next.js y despliega | T60 |
| T62 | Configurar variables de entorno en Vercel | Vercel Settings | Las 5 variables configuradas | T61 |
| T63 | Configurar Redirect URIs en Spotify Dashboard | Spotify Dashboard | Redirect apunta a `https://tu-app.vercel.app/api/spotify/callback` | T62 |
| T64 | Configurar Redirect URIs en TIDAL Dashboard | TIDAL Dashboard | Redirect apunta a `https://tu-app.vercel.app/api/tidal/callback` | T62 |
| T65 | Probar la migración completa en producción | URL de Vercel | Flujo completo: connect → seleccionar → migrar → resultado | T63, T64 |

---

## RESUMEN DE HITOS

| Hito | Tareas | Qué ves al terminar |
|---|---|---|
| **1** Setup | T01-T04 | Proyecto arranca en localhost |
| **2** Landing | T05-T10 | Primera pantalla interactiva |
| **3** OAuth Spotify | T11-T16 | Me conecto y veo mis playlists |
| **4** Selección | T17-T20 | Selecciono playlists con checkbox |
| **5** OAuth Deezer | T21-T25 | Me conecto con Deezer |
| **6** Migración core | T26-T34 | 1 playlist migra a Deezer |
| **7** Resultado | T35-T40 | Resumen + errores manejados |
| **8** Tandas | T41-T43 | Migran 60 playlists en tandas |
| **9** Legal | T44-T48 | RGPD cumplido |
| **10** Responsive | T49-T54 | Funciona en móvil + accesible |
| **11** i18n | T55-T59 | Multilingüe (24 + regional) |
| **12** Deploy | T60-T65 | App en internet |

**Total: 65 tareas, 12 hitos.**

---

*Documento generado en el Paso 8 del método de 20 pasos.*
*Recuerda invocar /bitácora para registrar las decisiones de la fase de planificación.*
*Siguiente paso: Paso 9 — Preparar el terreno (git, carpetas, primer commit).*
