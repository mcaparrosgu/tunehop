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

## HITO 3 — OAuth con Spotify

**Qué ves cuando este hito termina**: Pulso "Connect Spotify", voy a Spotify, acepto, y vuelvo con mis playlists cargadas.

| # | Tarea | Archivos | Cómo compruebo | Depende de |
|---|---|---|---|---|
| T11 | Registrar app en Spotify Developer Dashboard | Spotify Dashboard (web externa) | Tengo `SPOTIFY_CLIENT_ID` y `SPOTIFY_CLIENT_SECRET` en `.env.local` | T03 |
| ✅ T12 | Crear API Route `/api/spotify/auth` | `src/app/api/spotify/auth/route.ts` | Al llamar a la ruta, redirige a Spotify | T02 |
| ✅ T13 | Crear API Route `/api/spotify/callback` | `src/app/api/spotify/callback/route.ts` | Tras aceptar en Spotify, la consola muestra el `access_token` | T12 |
| ✅ T14 | Crear función `getSpotifyPlaylists()` | `src/lib/spotify.ts` | La función devuelve un array con nombre + nº de canciones | T13 |
| T15 | Crear API Route `/api/spotify/playlists` | `src/app/api/spotify/playlists/route.ts` | Abro la ruta y veo un JSON con mis playlists | T14 |
| ✅ T16 | Conectar botón "Conectar" al flujo OAuth completo | `page.tsx`, `consentimiento/page.tsx` | Pulso botón → checkbox → Spotify → acepto → vuelvo con playlists | T07, T09, T12 |

---

## HITO 4 — Selección de playlists

**Qué ves cuando este hito termina**: Veo mis playlists de Spotify con nombre, nº de canciones y checkbox. Puedo seleccionar y pulsar "Continuar".

| # | Tarea | Archivos | Cómo compruebo | Depende de |
|---|---|---|---|---|
| T17 | Crear componente `PlaylistCard.tsx` | `src/components/PlaylistCard.tsx` | Veo tarjeta con nombre, nº canciones y checkbox | T02, T06 |
| T18 | Crear componente `SelectAllButton.tsx` | `src/components/SelectAllButton.tsx` | Botón "Seleccionar todo" marca todas; "Quitar selección" desmarca todas | T02, T05 |
| T19 | Crear Pantalla 3 (Selección) | `src/app/playlists/page.tsx` | Veo: título, botón seleccionar todo, lista de tarjetas, contador, botón "Continuar" | T15, T17, T18 |
| T20 | Verificar que "Continuar" solo se activa con ≥1 seleccionada | `src/app/playlists/page.tsx` | Sin seleccionar: gris. Con 1+: azul | T19 |

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

## HITO 6 — Migración core

**Qué ves cuando este hito termina**: Selecciono 1 playlist, pulso "Migrar", veo la barra de progreso, y la playlist aparece en Deezer.

| # | Tarea | Archivos | Cómo compruebo | Depende de |
|---|---|---|---|---|
| T26 | Crear tipos TypeScript | `src/types/playlist.ts`, `track.ts`, `migration.ts` | Los archivos existen con las interfaces correctas | T02 |
| T27 | Crear función `searchByISRC()` | `src/lib/isrc.ts` | Le paso un ISRC y devuelve el track de Deezer (o null) | T23, T26 |
| T28 | Crear función `searchByNameFallback()` | `src/lib/isrc.ts` | Le paso título+artista y devuelve lista de resultados | T27 |
| T29 | Crear función `migratePlaylist()` | `src/lib/migration.ts` | Le paso playlist + tokens → devuelve objeto Migration | T27, T28 |
| T30 | Crear API Route `/api/migrate` | `src/app/api/migrate/route.ts` | Le paso datos → ejecuta migración → veo resultado | T29 |
| T31 | Crear componente `ProgressBar.tsx` | `src/components/ProgressBar.tsx` | Veo barra que se llena con texto "1/3: Playlist - 12/24" | T02 |
| T32 | Crear Pantalla 5 (Progreso) | `src/app/migrar/page.tsx` | Veo: "Migrando...", barra, nombre, contador, "Cancelar" | T31, T30 |
| T33 | Crear componente `ErrorMessage.tsx` | `src/components/ErrorMessage.tsx` | Veo error con texto concreto: "Error API Deezer: rate limit" | T02 |
| T34 | **PROBAR 1 playlist completa** | Todo | Selecciono 1 playlist → conecto Deezer → migro → aparece en Deezer real | T19, T25, T30, T32 |

---

## HITO 7 — Resultado y errores

**Qué ves cuando este hito termina**: Después de migrar veo un resumen claro, y si algo falla veo el error concreto.

| # | Tarea | Archivos | Cómo compruebo | Depende de |
|---|---|---|---|---|
| T35 | Crear Pantalla 6 (Resultado) | `src/app/resultado/page.tsx` | Veo: resumen, ✅/⚠️ por playlist, no encontradas, "Ver detalle", "Migrar más", "Eliminar datos", "Abrir Deezer" | T02, T33 |
| T36 | Crear pantalla de detalle de no encontradas | `src/app/resultado/detalle/page.tsx` | Al pulsar "Ver detalle": lista con título + artista + razón | T35 |
| T37 | Manejar token caducado de Spotify | `src/lib/spotify.ts` | Si caduca: "Sesión caducada. Reconéctate." + botón | T14, T32 |
| T38 | Manejar token caducado de Deezer | `src/lib/deezer.ts` | Si caduca: "Sesión caducada. Reconéctate." + botón | T23, T32 |
| T39 | Manejar rate limit (pausa + reintentos) | `src/lib/migration.ts` | Espera 1s, reintenta. Tras 3 fallos: error concreto | T29 |
| T40 | Manejar playlist duplicada en Deezer | `src/lib/deezer.ts`, `migrar/page.tsx` | Si ya existe: "¿Añadir a la existente, crear nueva, o cancelar?" | T29, T32 |

---

## HITO 8 — Tandas de 50

**Qué ves cuando este hito termina**: Selecciono 60 playlists, la app migra en 2 tandas mostrando progreso.

| # | Tarea | Archivos | Cómo compruebo | Depende de |
|---|---|---|---|---|
| T41 | Implementar lógica de tandas de 50 | `src/lib/migration.ts` | 60 playlists → se dividen en 50 + 10 | T29 |
| T42 | Mostrar número de tanda en progreso | `src/app/migrar/page.tsx` | Veo "Tanda 1 de 2" y luego "Tanda 2 de 2" | T41, T32 |
| T43 | Pausa de 1 segundo entre tandas | `src/lib/migration.ts` | Pausa visible entre tandas | T41 |

---

## HITO 9 — Legal y privacidad

**Qué ves cuando este hito termina**: Checkbox obligatorio, Política completa, botón de borrado, datos solo en sesión.

| # | Tarea | Archivos | Cómo compruebo | Depende de |
|---|---|---|---|---|
| T44 | Verificar checkbox obligatorio antes de conectar | `consentimiento/page.tsx` | Sin checkbox no puedo avanzar | T10 |
| T45 | Verificar Política de Privacidad completa | `politica-privacidad/page.tsx` | Incluye: datos, finalidad, base legal, derechos, plazo, responsable. Accesible desde landing | T08 |
| T46 | Crear botón "Eliminar mis datos y cerrar" | `resultado/page.tsx` | Al pulsar: tokens eliminados, vuelvo a landing | T35 |
| T47 | Verificar que no se guardan datos tras cerrar sesión | `lib/spotify.ts`, `lib/deezer.ts` | F12 → Application → Storage: sin tokens ni datos | T46 |
| T48 | Verificar HTTPS en todo | `next.config.ts`, Vercel | URL empieza por `https://`, sin advertencias | T01 |

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
| T64 | Configurar Redirect URIs en Deezer Portal | Deezer Portal | Redirect apunta a `https://tu-app.vercel.app/api/deezer/callback` | T62 |
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
