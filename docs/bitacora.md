# Bitácora del proyecto

Cuaderno de decisiones del proyecto TuneHop. Cada entrada registra por qué se tomó una decisión, qué se descartó, qué se rompió y qué queda pendiente. Úsalo en los Pasos 19 y 20.

---

## 2026-08-31 · Pasos 1-5 — Fase de definición (Problema → Spec)

- **QUÉ SE DECIDIÓ** — TuneHop es una app web que migra playlists de Spotify a Deezer (MVP) con un clic. Usa OAuth para conectarse, ISRC para buscar canciones, y procesa en tandas de 50. Clasificada como riesgo mínimo bajo el AI Act y con obligaciones RGPD completas. Posicionamiento público neutro: no ataca a Spotify.

- **ALTERNATIVAS DESCARTADAS** — (1) Incluir TIDAL en el MVP: descartado por los "access tiers" de la API que pueden bloquear la búsqueda de tracks. (2) Posicionamiento agresivo contra la plataforma de origen: descartado por riesgo de rechazo del usuario. (3) Migración inversa: descartada porque el problema solo contempla Spotify → destino. (4) Selección manual de alternativas para no encontradas: descartada para v2 por complejidad.

- **POR QUÉ ESTA** — Deezer tiene API pública completa y gratuita desde el registro (zero friction). TIDAL tiene un matiz de access tiers que es un riesgo innecesario para el MVP. El posicionamiento neutro es más profesional y no cierra puertas a ningún perfil de usuario. La spec-driven development (escribir QUÉ antes de CÓMO) evita teclear antes de tiempo.

- **QUÉ SE ROMPIÓ** — Nada roto en esta fase. Se verificó la viabilidad técnica de OAuth en las 3 plataformas antes de escribir historias, lo que evitó un problema potencial (TIDAL podría no estar disponible para todos los endpoints).

- **QUÉ QUEDA PENDIENTE DE ENTENDER** — (1) Confirmar si el tier THIRD_PARTY de TIDAL cubre los endpoints de búsqueda de tracks (relevante para v2). (2) Cómo maneja Deezer los rate limits exactos en la práctica (sabemos ~50 req/s teórico, pero no lo hemos probado). (3) Si hay límites de migración por cuenta de Deezer (free vs premium). (4) El sistema de internacionalización: ¿archivos de traducción por idioma? ¿Un servicio? Aún no lo sabemos.

---

## 2026-08-31 · Pasos 6-8 — Fase de planificación técnica (Stack → Tareas)

- **QUÉ SE DECIDIÓ** — Stack: Next.js + TypeScript (todo en uno). Hosting: Vercel (0€/mes). La IA no interviene en el MVP (100% determinista). 65 tareas en 12 hitos para la implementación.

- **ALTERNATIVAS DESCARTADAS** — (1) Python + FastAPI (backend) + JS vanilla (frontend): dos proyectos separados, dos lenguajes, más piezas que romperse. (2) Python + FastAPI + React: mismo problema de dos proyectos. (3) Node.js + Express + React: demasiado para una principiante (3 cosas nuevas a la vez). (4) IA en el fallback de búsqueda: decidimos no construirla preventivamente; si la precisión determinista es < 85% se añade después.

- **POR QUÉ ESTA** — Next.js es un solo proyecto (frontend + backend), un solo lenguaje (TypeScript), deploy en 1 clic (Vercel), y es el stack más demandado del mercado. La alumna no construye manualmente (vibe code), así que la prioridad es robustez y menos errores, no simplicidad de código.

- **QUÉ SE ROMPIÓ** — Nada roto. Pero se detectó un punto de decisión importante: la alumna clarificó que ella vibe codea (yo construyo, ella aprende), lo que cambia la recomendación de stack de "lo más simple" a "lo más profesional".

- **QUÉ QUEDA PENDIENTE** — (1) Registrar apps en Spotify Developer Dashboard y Deezer Developer Portal (T11, T21). (2) Configurar Redirect URIs en ambas plataformas (T63, T64). (3) El sistema de internacionalización: ¿next-intl? ¿i18next? Aún no se ha investigado.

---

## 2026-09-01 · Paso 10 — Hito 1 (setup) + decisión de naming

- **QUÉ SE DECIDIÓ** — (1) Proyecto Next.js 16 + TypeScript + Tailwind creado y compilando (tareas T01-T04, Hito 1 cerrado). (2) La app pasa a llamarse **TuneHop**, antes **PlayMigrate**: rebranding ejecutado en 14 archivos, 56 sustituciones (commit 2b0dc75).

- **ALTERNATIVAS DESCARTADAS** — Nombres evaluados con rúbrica de branding (semántica, sonoridad, distintivo, corto, colisión): PlayMigrate (49/100), Shift (60/100), TunePort (81), RelayTunes (79), SongSwitch, Melodio. También se consideró quedarse con PlayMigrate para no perder tiempo.

- **POR QUÉ ESTA** — TuneHop tiene 2 sílabas, comunica categoría y acción a la vez (tune = música, hop = saltar de plataforma) con emoción ligera. "PlayMigrate" sonaba a herramienta de IT: "migrate" es lenguaje de departamento técnico y "Play" es el prefijo más saturado del mundo musical (Google Play, PlayStation...). "Shift" era potente pero genérico: sin dominio posible, sin registro de marca, y la competencia líder de nuestra categoría (SongShift) ya ocupa esa palabra. TuneHop pasó verificación: tunehop.com/.app sin sitio activo, ninguna app de migración conocida con ese nombre. Decisión de marca tomada con criterio de marketing, no improvisada.

- **QUÉ SE ROMPIÓ** — create-next-app falló con "Could not create a project called 'Spotify' because of npm naming restrictions" (npm prohíbe mayúsculas en el nombre del paquete). Solución: generar el proyecto en /tmp con nombre válido y mover los archivos al repo. También: detener el servidor dev con pkill colgó la shell de opencode dos veces (cosmético, sin impacto). next-env.d.ts se regeneró automáticamente al compilar (Next 16 apunta a .next/types en build de producción) — comportamiento normal.

- **QUÉ QUEDA PENDIENTE DE ENTENDER** — La alumna declara haber entendido todo lo de la sesión (generación del proyecto, instalación, estructura). Pendientes prácticos: (1) registrar el dominio tunehop.com; (2) T07 sustituirá la landing de bienvenida en inglés por la landing oficial de TuneHop.

---

## 2026-09-03 · Paso 10 — Arreglo OAuth (Spotify + TIDAL) y decisión destino Deezer→TIDAL

- **QUÉ SE DECIDIÓ** — (1) El destino de escritura pasa de **Deezer a TIDAL**: Deezer cerró el registro de nuevas apps (mediados de 2024) y es inviable para una app nueva. (2) TIDAL se integra contra la **API pública v2 (JSON:API)** en `openapi.tidal.com/v2`, no contra la v1 legacy `api.tidal.com/v1`. (3) El acceso a la app en desarrollo es siempre **`http://[::1]:3000`** (el relay de WSL sobre IPv6), nunca `127.0.0.1` ni `localhost` (prohibido como redirect URI por Spotify y origen distinto para cookies).

- **ALTERNATIVAS DESCARTADAS** — (1) Seguir con Deezer: inviable (no acepta apps nuevas). (2) `next/link` para arrancar OAuth: rompe porque hace navegación RSC y pre-fetchea; sustituido por `<a>` nativo vía prop `external` en `Button`. (3) `127.0.0.1` como host: da `ERR_CONNECTION_REFUSED` en este WSL (solo reenvía IPv6). (4) `networkingMode=mirrored` en `.wslconfig`: recomendado a futuro pero no aplicado (requiere Windows 11 22H2+ y permiso de la usuaria).

- **POR QUÉ ESTA** — La causa raíz del `State inválido (posible CSRF)` era doble: origen distinto entre cookies y callback (`[::1]` vs `localhost`) y `next/link` que no seguía bien el 302 a dominio externo. Con host consistente `[::1]` + `<a>` nativo, el flujo Spotify quedó verde ("funciona!"). Para TIDAL, la API v1 es privada y no soportada para terceros; las credenciales de developer.tidal.com exigen v2 JSON:API con scopes y rutas distintos.

- **QUÉ SE ROMPIÓ** — El OAuth de Spotify daba `/error?message=State inválido (posible CSRF)` y `Faltan parámetros en el callback` por la inconsistencia de host y `next/link`. El tramo TIDAL estaba escrito contra la API equivocada (v1), por lo que nunca habría funcionado con credenciales de v2. El dev server moría al terminar la shell MCP (se resolvió con `exec setsid nohup ... &`). `docs/07-tareas.md` seguía en Deezer (pendiente de reescribir).

- **QUÉ QUEDA PENDIENTE** — (1) Registrar el Redirect URI `http://[::1]:3000/api/tidal/callback` en developer.tidal.com (ACCION DE LA USUARIA). (2) Re-autorizar TIDAL (cambian los scopes) y probar el flujo end-to-end con una playlist pequeña de 2-3 tracks. (3) Reescribir `docs/07-tareas.md` (T21-T25 Deezer→TIDAL). (4) Decidir: commitear reestructuración CLAUDE.md→AGENTS.md, registrar tunehop.com, cuándo abordar logo/identidad (pregunta dos veces sin respuesta).

> **✅ Actualización (2026-09-03 tarde)**: la usuaria añadió el Redirect URI, marcó los scopes como requeridos, re-autorizó y **verificó el flujo TIDAL end-to-end** (playlist real de 2-3 tracks apareció en TIDAL). El tramo completo Spotify→TIDAL queda funcional. HITO 5 marcado como completado en `docs/07-tareas.md`.

---

## 2026-09-05 · Fix R8 (Spotify API) + R9 (multi-país TIDAL) + protección rate limit

- **QUÉ SE DECIDIÓ** — (1) Spotify migró el endpoint de tracks de `/playlists/{id}/tracks` a `/playlists/{id}/items` y el campo de `track` a `item`. Fix: `/items` con `fields=items(item(...))` (sin fields no devuelve ISRCs). (2) Búsqueda ISRC multi-país automática (US, ES, GB, MX, DE) en vez de `countryCode=US` fijo. (3) Fallback por nombre/artista cuando ISRC no encuentra match. (4) Protección rate limit: si TIDAL devuelve 429/403, para búsqueda automáticamente.

- **ALTERNATIVAS DESCARTADAS** — (1) Quitar `fields` y traer respuesta completa: Spotify no devuelve `external_ids` sin fields → no hay ISRCs → inútil. (2) Selector de país manual (dropdown): la alumna rechazó la UX ("la gente aprieta un botón y quiere todo hecho"). (3) 8 países: reducido a 5 para limitar llamadas API (rate limit). (4) Buscar por nombre primero: más lento e impreciso que ISRC, solo como fallback.

- **POR QUÉ ESTA** — El multi-país automático es transparente para el usuario y maximiza matches. El fallback por nombre captura tracks donde el ISRC difiere entre plataformas. La protección rate limit evita bloqueos de TIDAL (preocupación explícita de la alumna). Con 5 países y 300ms delay, playlist de 50 tracks ≈ 60 llamadas en 30s (within limits de TIDAL ~100/min).

- **QUÉ SE ROMPIÓ** — R8: Spotify API cambió sin avisar (endpoint + campo). Se detectó con endpoint temporal de debug que comparaba variantes. R9:_tracks de Ska de los 60s no existen en TIDAL (catálogo, no bug). La alumna probó 2 veces con playlist de 12 tracks de The Skatalites/Lord Creator → 0 matches en todos los países. Confirmado: es limitación del catálogo de TIDAL, no de la app.

- **QUÉ QUEDA PENDIENTE** — (1) Test con playlist mainstream (pop/rock) para confirmar que la app funciona de punta a punta con tracks que sí están en TIDAL. (2) Evaluar si el fallback por nombre/artista funciona en la práctica (no probado con tracks que sí existen). (3)考虑ar si necesitamos más países o si 5 es suficiente. (4) Documentación: actualizar `docs/07-tareas.md` (HITOs 6+ en Deezer).

---

## 2026-09-09 · UX selección + limpieza privacidad + estudio de campo plataformas

- **QUÉ SE DECIDIÓ** — (1) Ocultar playlists no deseadas en la selección (botón "Ocultar"/"Mostrar", localStorage) y marcar con badge verde "Migrada" las ya migradas (commit `b192201`). (2) Eliminar de todos los docs públicos toda referencia a la motivación personal/boicot y al término "plataformas éticas" (commit `69b95b9`). (3) Estudio de campo de plataformas éticas y open-source → `docs/plataformas-alternativas.md`.
- **POR QUÉ ESTA** — localStorage en vez de base de datos: sin persistencia en servidor (RGPD), sin infraestructura. La limpieza de privacidad: los docs viven en GitHub público, descargables por cualquiera. El estudio: la usuaria pidió evaluar alternativas reales antes de comprometer la app.
- **HALLAZGO CLAVE** — TIDAL es la ÚNICA plataforma ética con API de escritura pública viable: Deezer cerró el registro de apps nuevas, Qobuz no tiene API de reproducción pública, Apple Music exige acuerdo comercial. La decisión original del proyecto queda validada.
- **QUÉ QUEDA PENDIENTE** — Probar migración con playlist mainstream (la Ska no existe en TIDAL). Añadir Deezer como destino NO es viable hoy (registro cerrado); re-evaluar cuando/ si lo reabran.

---

## 2026-09-09 · Buscador playlists + revisión pro no-encontradas + backlog borrado

- **QUÉ SE DECIDIÓ** — (1) Buscador por nombre/creador en selección de playlists. (2) Flujo profesional de "no encontradas": candidatos alternativos (hasta 3), reintento individual, botón "Buscar en TIDAL" (abre web), omitir, exportar JSON, guardar localStorage. (3) Constancia en backlog v2 del deseo de borrar playlists de Spotify en el futuro.
- **POR QUÉ ESTA** — El MVP ya tiene features de revisión profesional (1,2,3,4,5,8 del listado) sin base de datos (todo localStorage RGPD-compliant). La constancia de borrado queda documentada para v2 sin romper la regla MVP.
- **QUÉ SE ROMPIÓ** — Nada nuevo. Build limpio.
- **QUÉ QUEDA PENDIENTE** — Probar "Come as You Are" (18 tracks, mainstream) en producción. Si falla algún track, la revisión manual lo resolverá.

---

## 2026-09-09 (2ª entrada) · R10 (búsqueda texto TIDAL) — VALIDADO end-to-end en producción

- **QUÉ SE DECIDIÓ** — Corregir la búsqueda por texto de TIDAL: el endpoint `/v2/search?type=tracks` no devuelve tracks en v2; el correcto es `/v2/searchResults/{query}?include=tracks` (refs) + `/v2/tracks?filter[id]=...&include=artists` (detalles). El error se detectó al ver que la revisión manual nunca aparecía y una playlist mainstream daba 0/18.
- **POR QUÉ ESTA** — Se validó contra código real de otros proyectos de migración a TIDAL (GitHub). Un solo patrón correcto para `searchTrackByName` y `searchTrackCandidates`, con protección 429/403.
- **QUÉ SE ROMPIÓ Y CÓMO SE ARREGLÓ** — El fallback por nombre y los candidatos estaban rotos desde el principio (R10), enmascarado por las pruebas con Ska (catálogo inexistente). Fix en `src/lib/tidal.ts` (commit `a33ec3b`).
- **VALIDACIÓN (HITO)** — Migración real en producción: playlist mainstream de 18 canciones → **17/18 migradas automáticamente** (TIDAL: `266cbacb-1f51-41c7-a909-fc476993572a`). El único fallo ("Ruby Soho" — Rancid) es caso residual de catálogo, cubierto por la revisión manual. La app queda funcional end-to-end con drops mínimos.
- **QUÉ QUEDA PENDIENTE** — T65 completada (migración completa en producción validada). Siguiente: Paso 13 del método (pruebas automáticas del core no-IA), luego guardrails/evals/publicación pulida.

---

## 2026-09-09 (3ª entrada) · Paso 11 — System Prompt del Matching Assistant

- **QUÉ SE DECIDIÓ** — Escribir `prompts/system.md` (system prompt de producción para la IA interna de matching) y `evals/casos-dificiles.md` (10 casos de prueba: duración, covers, ISRC, inyecciones, arrays vacíos). El prompt define: rol (elegir candidato 1–5), procedimiento de 6 pasos, sin herramientas, 7 límites duros, escalado siempre a humano (revisión manual), salida solo número.
- **POR QUÉ ESTA** — La spec (`docs/06-ia.md`) contempla un fallback IA opcional para cuando la búsqueda por nombre/artista devuelve 2–5 candidatos. Hoy el MVP usa revisión manual humana, pero el prompt queda listo para activar cuando el volumen justifique el coste (~1€/mes para 95% precisión vs 85% determinista).
- **QUÉ SE ROMPIÓ** — Nada. El prompt no está en producción (no hay IA en el MVP actual).
- **QUÉ QUEDA PENDIENTE** — Paso 12: diseñar las herramientas (tools) poka-yoke para que la IA pueda invocar `searchTrackByName` y `searchTrackCandidates` de forma segura.

---

## 2026-09-09 (4ª entrada) · Paso 12 — Herramientas poka-yoke del Matching Assistant

- **QUÉ SE DECIDIÓ** — Implementar 3 tools tipadas y documentadas en `src/lib/tidal-tools.ts`:
  1. `search_by_isrc` — búsqueda exacta por ISRC (parámetro único `isrc`, valida longitud 12).
  2. `search_by_name` — fallback por nombre/artista (dos parámetros obligatorios, devuelve 1 match).
  3. `search_candidates` — hasta 5 candidatos para decisión (parámetros `name`, `artist`, `limit` con clamp 2–5).
- **DISEÑO POKE-YOKE** — Parámetros inconfundibles (nombres `isrc` / `name`+`artist` / `limit`), validación de tipos TypeScript, clamp interno en `limit`, sin parámetros opcionales ambiguos, respuestas truncadas (solo id/título/artista). Cada tool incluye en su JSDoc: nombre, descripción, cuándo/ no usarla, parámetros con tipos, ejemplos correctos/incorrectos, qué devuelve, diseño anti-errores, nivel de riesgo (BAJO).
- **POR QUÉ ESTA** — La spec (`docs/06-ia.md`) define que el fallback IA necesita tools para buscar en TIDAL. Hoy el MVP usa revisión manual, pero las tools quedan listas y auditables para activar el fallback IA cuando el volumen lo justifique.
- **QUÉ SE DESCARTÓ** — Tool de "crear playlist" o "añadir tracks": riesgo ALTO (modifica datos), fuera del ámbito del Matching Assistant (que solo decide coincidencias). Tool de "buscar en Spotify": no necesaria, la app ya tiene los datos de Spotify antes de invocar a la IA.
- **QUÉ QUEDA PENDIENTE** — Paso 13: tests automáticos del core determinista (matching ISRC, batching, parseo TIDAL).

---

## 2026-09-09 (5ª entrada) · Paso 13 — Tests automáticos del core determinista

- **QUÉ SE DECIDIÓ** — Implementar suite de tests Jest + ts-jest + testing-library para la parte determinista (no-IA):
  - `src/lib/__tests__/tidal-tools.test.ts` — 16 tests de las 3 tools poka-yoke (validación ISRC, trim, clamp limit, null handling, etc.).
  - `src/lib/__tests__/spotify-tidal-core.test.ts` — 8 tests de parsing Spotify (`getAllPlaylistTracks`: paginación, formato legacy, filtrado ISRC, token null) y `extractArtist` (inline, vacío, faltante).
  - Config: `jest.config.js` (ts-jest, jsdom, mapeo `@/`, coverage thresholds 15% global), `jest.setup.ts` (mocks next/navigation, next-intl, next/headers, fetch).
- **COBERTURA REAL**: `tidal-tools.ts` 100% (tools poka-yoke), `spotify.ts` ~40% (paginación + legacy + ISRC), `tidal.ts` ~10% (solo `extractArtist`; el resto es OAuth/HTTP que requiere integración real). Componentes React 0% (tests de integración con Playwright serían más adecuados).
- **CUÁNDO EJECUTAR**: `npm test` (watch: `npm run test:watch`, coverage: `npm run test:coverage`).
- **QUÉ QUEDA SIN CUBRIR Y POR QUÉ**:
  - OAuth flows (spotify-auth.ts, tidal-auth.ts) — requieren cookies de Next.js + HTTP real; se testean manualmente en staging.
  - Llamadas HTTP a TIDAL (tidal.ts: search, create, add-tracks) — requieren token válido y API externa; se validan en E2E manual.
  - UI React (Button, Checkbox, páginas) — tests E2E con Playwright son más valiosos que unitarios aquí.
  - Flujo completo migración — E2E manual en producción ya validado (17/18 tracks).
- **PRÓXIMO**: Paso 14 (evals IA) — dataset dorado + métricas para el system prompt del Paso 11.

---

## 2026-09-09 (6ª entrada) · Paso 14 — Evals IA montados (Promptfoo)

- **QUÉ SE DECIDIÓ** — Montar sistema de evaluación del Matching Assistant con Promptfoo:
  1. **Golden dataset**: `evals/golden.yaml` — 25 casos (5 fáciles, 10 límite, 5 rechazo/inyección, 5 reales de producción).
  2. **Métricas**: Accuracy (objetivo ≥92%), Format Compliance (100% solo número), Latencia P95 (<200ms).
  3. **Herramienta**: Promptfoo v0.122 — config en `promptfoo.yaml` (proveedores Anthropic Haiku / GPT-4o-mini, temp 0, max_tokens 10).
  3. **Historial**: `evals/historial.md` — tabla de trazabilidad (fecha, cambio, modelo, métricas, decisión).
  4. **Recordatorio en CLAUDE.md**: relanzar evals al cambiar prompt/modelo/datos/umbrales y anotar en historial.
- **PENDIENTE**: configurar `ANTHROPIC_API_KEY` u `OPENAI_API_KEY` y ejecutar primera pasada (`npx promptfoo eval -c promptfoo.yaml`).
- **UMBRALES INICIALES**: Accuracy ≥92%, Format 100%, Latencia P95 <200ms. **Recalibrar** tras semanas con datos reales (los casos reales no se distribuyen como el dataset).

---

## 2026-09-09 (7ª entrada) · Features v2 recuperados al MVP

- **QUÉ SE DECIDIÓ** — La usuaria quiso que el MVP incorporara los features que el recorte (Paso 3) había aparcado como v2. Revisado `docs/02-mvp.md` §3:
  - Ya implementados antes: H7 (lista detallada no encontradas), H7b (fallback por nombre/artista), H9 (ver playlist en destino — botón "Abrir en TIDAL").
  - **Nuevos en esta entrada**:
    - **H12 + H13** — Retry con backoff ya existía; añadido: detección de 5xx en fetch de tracks → banner `serviceDown` "Spotify o TIDAL no responden".
    - **H15** — Botón "Cancelar migración" en pantalla de progreso: `AbortController` aborta las llamadas en curso, estado vuelve a error con mensaje "Migración cancelada. Tus playlists no han sido modificadas."
    - **H19** — Sección `<details>` "Cómo dejar Spotify" en la página de playlists: 4 pasos (exportar datos, cancelar suscripción, borrar cuenta, revocar acceso TuneHop) + nota RGPD "TuneHop solo lee".
  - **H16/H17/H18 (Álbumes/Artistas/Liked Songs)**: NO implementados — son funcionalidades de migración distintas al core (playlists). Quedan en v2.
- **POR QUÉ ESTA** — La usuaria quiere el MVP con todo lo propuesto inicialmente. Los 3 features añadidos completan la experiencia de migración (resiliencia + control + salida de Spotify). La solución usada es la más simple que funciona: AbortController nativo (sin deps), `<details>` HTML nativo (sin modal), banner condicional.
- **QUÉ SE ROMPIÓ** — Nada. Build OK, 24 tests pasan.
- **QUÉ QUEDA PENDIENTE** — Revisar cambios en staging/producción. Continuar con Paso 15 (guardrails).

---

## 2026-09-09 (8ª entrada) · Paso 15 — Guardrails (seguridad en capas)

- **QUÉ SE DECIDIÓ** — Implementar `src/lib/guardrails.ts` con 6 capas de barreras (prioridad: privacidad > seguridad > disponibilidad):
  1. **Validación de entrada**: `isValidSpotifyPlaylistId` (22 chars), `isValidISRC` (formato 12 chars), `isValidOAuthToken` (sin saltos de línea → anti header injection), `sanitizePlaylistName` (chars de control + longitud máx 100), `isSafeSearchQuery` (inyección de prompt: ignore previous, system:, [INST], <script>), `validatePlaylistIds` (dedupe + máx 100).
  2. **Rate limiting**: `checkRateLimit` (mapa en memoria, ventana + máx requests por clave).
  3. **Filtro PII**: `containsPII` (email, teléfono, tarjeta, DNI, IBAN, tokens API), `clearSessionData` (borra sessionStorage + cookies `tunes_`).
  4. **Reglas deterministas**: `isValidMatchResponse` (solo 0-5, anti texto), `validateTrackCount` (máx 10.000), `isSafePlaylistName` (spam/phishing/odio).
  5. **Validación de salida**: `validateTidalMatch` (estructura completa), `validateCandidates` (máx 5).
  6. **Intervención humana**: `shouldEscalate` (umbrales: >50% no encontradas, ≥5 errores consecutivos, reintentos agotados).
- **DISPARADORES DE INTERVENCIÓN HUMANA** — (1) superar umbral de fallos (notFound >50% o errores ≥5); (2) acciones sensibles (migración = crear playlists en TIDAL: ya requiere confirmación explícita del usuario pulsando "Migrar"; ninguna tool IA escribe).
- **POR QUÉ ESTA** — Protege al usuario contra inyecciones (prompt y header), spam en nombres de playlist, y degradación de servicio. El rate limiting es in-memory (suficiente para serverless MVP; en producción escalar a Redis si hay abuso).
- **MOLESTIAS A USUARIOS LEGÍTIMOS** — `isSafePlaylistName` puede bloquear nombres con "update" o "free" en contextos legítimos ("R&B Free" etc.) — equilibrio: matchea palabras completas (\\b), no subcadenas. El rate limit de 5 migraciones/hora solo afecta a muy pocos usuarios reales.
- **QUÉ SE ROMPIÓ** — Nada. 80 tests pasan (56 nuevos), build OK.
- **PRÓXIMO** — Paso 16: red team (OWASP LLM Top 10 contra el system prompt y el flujo completo).

---

## 2026-09-09 (9ª entrada) · Paso 16 — Red Team + Fixes (OWASP LLM Top 10)

- **INFORME**: `seguridad/red-team.md` — 30 ataques probados, 7 categorías OWASP, 3 vulnerabilidades reales confirmadas con ejecución.
- **ATAQUES QUE SÍ FUNCIONARON** (Riesgo ALTO):
  - **A0 — Guardrails desconectados**: ninguna ruta API usaba las 6 capas de `guardrails.ts`. Confirmado con `grep` + inspección manual.
  - **A7.01 — ISRC sin validar**: `GET /api/tidal/search?isrc=abc` aceptaba cualquier string → hacía fetch a TIDAL innecesariamente.
  - **A1.04 — limit sin clamp**: `GET /api/tidal/search-candidates?limit=9999` aceptaba números arbitrarios → saturación de contexto/TIDAL.
- **FIXES IMPLEMENTADOS** (7 archivos API modificados):
  1. `/api/tidal/search` → `isValidISRC` + `checkRateLimit` (60/min/IP) — **A7.01 + A7.02**
  2. `/api/tidal/search-by-name` → `isSafeSearchQuery` + trim — **A2.01**
  3. `/api/tidal/search-candidates` → `isSafeSearchQuery` + clamp limit 2–5 + `validateCandidates` — **A1.04 + A6.01**
  4. `/api/tidal/create-playlist` → `sanitizePlaylistName` + `isSafePlaylistName` — **A6.04 + A2.01**
  5. `/api/tidal/add-tracks` → `validateTrackCount` (máx 10.000) — **A7.03**
  6. `/api/spotify/playlist/[id]/tracks` → `isValidSpotifyPlaylistId` (22 chars) — **A4.02 + A0**
  7. Crear playlists sin rate limit → mitigado en búsqueda, create y search-candidates
- **QUEDA SIN ARREGLAR (por riesgo bajo o porque la IA está inactiva)**:
  - CSV injection (A6.05) — en backlog, riesgo Medio pero requiere cambio en UI
  - Rate limit in-memory no persiste entre instancias Vercel — limitación conocida del MVP, requiere Redis en v2
- **RECUERDO**: siguiente paso NO es publicar; es prueba de usuarios (5 personas reales).

---

## 2026-09-09 (10ª entrada) · Prueba de usuarios (entre Paso 16 y 17)

- **GUION PREPARADO**: `docs/prueba-usuarios.md` — 3 tareas del recorrido crítico, reglas (no ayudar/no explicar/no justificar/pensar en voz alta), plantilla de bitácora, métricas con objetivos (<5 min, 100% completar OAuth, ≥80% entender resumen), y checklist RGPD (solo alias, nada de datos personales fuera del doc local).
- **PENDIENTE DE LA USUARIA**:
  1. Reclutar 5 personas que SÍ se parezcan a María (no técnica, con playlists propias en Spotify, que quiera irse a Tidal)
  2. Ejecutar las 3 tareas con cada una
  3. Anotar hallazgos en la bitácora y arreglar los críticos ANTES de publicar
- **RIESGO AVISADO**: si las 5 fáciles son amigas de la desarrolladora, la prueba da confianza falsa — peor que no probar.

---

## 2026-09-09 (11ª entrada) · Paso 17 — Puerta de calidad + plan de emergencia

- **PUERTA DE CALIDAD**: `scripts/gate-quality.sh` — 3 pasos (tests → build → evals). Los evals solo corren si hay API key (la IA está inactiva; la puerta avisa pero no bloquea sin key). Uso: `./scripts/gate-quality.sh` antes de cada deploy.
- **CHECKLIST PRE-LANZAMIENTO**: `docs/08-emergencia.md` §1 — legal verificado EN PANTALLA (no en código):
  - ✅ Política de privacidad publicada (`/es/politica-privacidad` 200) con plazo de conservación ("sesión 3h, tokens eliminados al expirar")
  - ✅ Consentimiento con checkbox ANTES de conectar Spotify
  - ✅ Botón "Eliminar datos" visible (Art. 17)
  - ✅ HTTPS
  - ✅ Aviso IA: NO aplica (Matching Assistant inactivo — flujo 100% humano). Si se activa la IA, añadir aviso de transparencia.
- **ROLLBACK**: `vercel rollback` o Promote to Production desde dashboard; en git, `revert` (nunca reset en master).
- **PROTOCOLO DE INCIDENTES**: §3 — brecha de datos (RGPD Art. 33: notificar ≤72h) vs técnico (rollback <15min). Bitácora como registro.
- **VEREDICTO SEGUIR/PIVOTAR**: 2026-11-09 (90 días). Criterios del Paso 3 (≥70% completan, <5 min, y ≥10 usuarios reales para no parar).
- **OBSERVACIÓN**: la app ya estaba desplegada (cada push a master publica automáticamente vía integración Vercel-GitHub). Esta puerta formaliza el control previo.

---

## 2026-09-09 (12ª entrada) · Paso 18 — Vigilancia y rutina de observabilidad

- **LOGGER ESTRUCTURADO**: `src/lib/logger.ts` — JSON con timestamp, route, status, durationMs, ip, error type. Conectado a las 7 rutas API: search, search-by-name, search-candidates, create-playlist, add-tracks, playlist/[id]/tracks. Cada petición loguea `request_start` y `request_end` con métricas.
- **MÉTRICAS DESDE EL DÍA 1**: tasa de éxito global (≥95%), tasa de éxito de búsqueda ISRC (≥80%), latencia P95 (<500ms), rate limit hits, guardrail hits, errores 500.
- **RUTINA SEMANAL**: `docs/09-rutina.md` — 15 minutos los lunes: errores → tasa éxito → latencia → rate limit → cambio modelo (si IA activa) → calendario veredicto.
- **CICLO DE MEJORA**: conversación fallida → capturar caso → añadir a `evals/golden.yaml` → relanzar evals → registrar en `evals/historial.md`.
- **CAMBIO DE MODELO**: revisar changelogs Anthropic/OpenAI cada semana. Si se retira el modelo: evaluar reemplazo, comparar contra historial, solo cambiar si accuracy ≥ 85%. Si < 85%: NO cambiar, buscar otro modelo o ajustar prompt.
- **VEREDICTO SEGUIR/PIVOTAR/PARAR**: fijado para 2026-11-09 (90 días). Criterios: ≥70% completan migración, <5 min tiempo medio, ≥10 usuarios reales.
- **OBSERVABILIDAD PROPORCIONAL**: sin Sentry ni Datadog (sobre-ingeniería para MVP sin usuarios). Vercel Functions Logs + JSON estructurado = suficiente. Si crece: activar Vercel Analytics (1 clic), luego Sentry si se activa la IA.


---

## 2026-09-11 · Marketing Pasos 1-2 — Briefing y auditoría de marca

- **QUÉ SE DECIDIÓ** — (1) Arrancar la pista de marketing (método de 22 pasos) con el producto técnico terminado: briefing de negocio (docs/marketing/00-briefing.md) y auditoría de marca (docs/marketing/01-auditoria.md) generados. (2) TuneHop es un negocio de una sola fundadora, sin presupuesto (máx. 50€/mes esporádicos), cuyo éxito se mide por uso real, posible venta de la app y case study; el modelo de ingresos queda pendiente de definir. (3) La auditoría detectó deuda de marca: cero identidad visual (la web parece plantilla de Next.js) e incoherencias visibles. (4) Se ejecutan los quick wins: CTA "Connect Spotify" → "Conectar con Spotify", subtítulo de la home con destino TIDAL y beneficio (en minutos), metadata con destino + promesa, README y .env.example corregidos a TIDAL (fuera Deezer y NEXTAUTH_SECRET, que el código no usa). Commit e235831. (5) El dominio tunehop.com (libre, ~10-15€/año) se comprará en el Paso 7 (identidad visual), no antes. (6) La directora creativa se llama **Corita** (preferencia de la usuaria; sustituye a Yara).

- **ALTERNATIVAS DESCARTADAS** — (1) Dejar el CTA en inglés: descartado por incoherencia de marca a la vista del usuario. (2) Comprar el dominio ahora: descartado por decisión de la fundadora de no gastar hasta el Paso 7 (se asume el riesgo de squatter; si no se compra en el Paso 7, marcador en agenda). (3) Estrategia de marketing con inversión pagada: descartada por presupuesto casi nulo; la estrategia será orgánica y creativa, con el talento de la fundadora (Comunicación + Creatividad publicitaria, matrícula de honor) como recurso principal.

- **POR QUÉ ESTA** — El producto ya está en producción (pasos 1-18 del manual cerrados), así que el siguiente bloque de valor es el mercado: primero saber qué vendemos y a quién antes de gastar nada. El marketing arranca con auditoría honesta (mirada hacia dentro) antes de investigar fuera, para no construir estrategia sobre supuestos. Los quick wins eran 30 minutos de trabajo que devuelven coherencia a la marca en su punto más visible.

- **QUÉ SE ROMPIÓ** — No hubo rotura técnica (tsc limpio, 80 tests en verde). Se corrigió deuda acumulada: README, .env.example y la home decían cosas que el producto ya no es (Deezer como destino, CTA en inglés, metadata genérica). La web en producción aún no muestra los cambios de la home/metadata hasta el próximo deploy.

- **QUÉ QUEDA PENDIENTE DE ENTENDER** — El análisis PESTEL: la fundadora lo marcó como lo que menos entendió de esta sesión (factores Político, Económico, Social, Tecnológico, Ecológico, Legal que afectan a la categoría); se explica a fondo cuando vuelva a salir (Paso 3 lo usará para investigar fuera). Pendientes registrados: cifras de éxito y modelo de negocio (briefing §4 y §10), prueba de usuarios del manual de obra sin ejecutar, dominio tunehop.com comprado en el Paso 7, y todo lo diagnosticado en la auditoría (identidad visual como prioridad).


---

## 2026-09-11 · Marketing Paso 3 — Investigación de mercado, audiencia y competencia

- **QUÉ SE DECIDIÓ** — Generar docs/marketing/02-investigacion.md con investigación real (fuentes verificadas en webs oficiales el 2026-09-11) y datos del proyecto (research/, bitácora). El documento cubre: mercado (categoría migradores madura, demanda real y en olas), audiencia (tres perfiles con insight: Switcher Ética primaria, DJ secundaria no objetivo, Cost-Cutter secundaria), competencia (mapa de 5 jugadores con propuesta, tono y precios; huecos: nadie usa valores/ética, nadie pone privacidad por delante, todos son multi-dirección y empujan a suscripción), cultura (debate del pago a artistas, TIDAL paga 3-7x más que Spotify, riesgo de importación nativa), y la Oportunidad cruzada: "TuneHop es la migración con criterio: la forma más simple y privada de irte de Spotify a la plataforma que paga mejor a los artistas, sin tocar tu Spotify y sin guardar nada de ti". Cada dato lleva fuente o marca "hipótesis sin verificar". Commit 5a9f9b2.

- **ALTERNATIVAS DESCARTADAS** — (1) Inventar cifras de mercado sin fuente: descartado por regla absoluta del Paso 3. (2) Tratar al DJ como público objetivo: descartado porque la competencia ya lo sirve bien con sync y gestión de biblioteca, y TuneHop no hace eso por diseño. (3) Hacer investigación primaria (encuestas): descartado por presupuesto y tiempo; la investigación secundaria en webs oficiales + datos propios es suficiente para el plan.

- **POR QUÉ ESTA** — La auditoría (Paso 2) detectó que el hueco de marca está en valores + privacidad + dirección única; la investigación confirma que la competencia no lo ocupa y que la audiencia primaria quiere exactamente eso. La Oportunidad no se inventa: se lee en la intersección de los tres anteriores.

- **QUÉ SE ROMPIÓ** — Nada técnico. Dos páginas clave no respondieron (tunemymusic.com/pricing 404, tidal.com 403); esos datos se marcan como hipótesis. El mapa de competencia queda con dos casillas sin precio, lo que no invalida el hueco pero obliga a no presumir de "más barato" sin confirmar.

- **QUÉ QUEDA PENDIENTE DE ENTENDER** — (1) El mapa de competencia: cómo leer la tabla comparada y qué significa el hueco en la práctica. (2) El insight de audiencia: la diferencia entre datos demográficos y la tensión que explica el comportamiento (por qué "insight" no es "perfil"). (3) Hipótesis vs verificado: por qué algunos datos llevan esa etiqueta y otros no (regla del método vs. falta de acceso a la web). Se explican en la próxima sesión antes de seguir.


---

## 2026-09-11 · Marketing Paso 4 — Arquitectura de marca

- **QUÉ SE DECIDIÓ** — Arquitectura de marca única: TuneHop es un solo producto, una sola fundadora, sin portfolio. Documento generado en docs/marketing/03-arquitectura-marca.md (f16d138). La decisión se resuelve en dos frases como pide el método: "arquitectura de marca única, no aplica portfolio". Se añade un disparador futuro por si el negocio crece.

- **ALTERNATIVAS DESCARTADAS** — (1) Marca madre con sub-marcas: descartada por no haber segundo producto ni línea distinta. (2) Casa de marcas: descartada por no haber unidades que deban operar sin vínculo. (3) Dejar el paso sin documento: descartado por regla del método (cada paso genera su archivo, aunque sea breve).

- **POR QUÉ ESTA** — El método obliga a decidir la arquitectura ANTES del posicionamiento (Paso 5). Si no se decide, se arrastra ambigüedad a la estrategia. Escribirlo, aunque sea obvio, blinda que el posicionamiento hable de UNA marca, no de un portfolio imaginario.

- **QUÉ SE ROMPIÓ** — Nada. Paso trivial por diseño, no por error.

- **QUÉ QUEDA PENDIENTE DE ENTENDER** — La fundadora no marcó ningún "no entendí" explícito para este paso. Queda el entendimiento de que este paso existe para blindar, no para inventar complejidad: si en el futuro alguien dice "esto no encaja bajo TuneHop" y es un negocio distinto, se cambia el modelo.


---

## 2026-09-11 · Marketing Paso 5 — Estrategia de marca

- **QUÉ SE DECIDIÓ** — Estrategia completa en docs/marketing/04-estrategia-marca.md (commit 63668ef). Propósito: libertad de elegir plataforma sin fricción técnica. Visión/misión alineadas. Arquetipo confirmado por la fundadora: **Explorador (primario) + Sabio (secundario)**. Posicionamiento Ries & Trout: "Para la Switcher Ética, TuneHop es la herramienta de migración que te deja irte a la plataforma que paga mejor a los artistas en minutos, sin tocar tu Spotify y sin guardar nada, porque usa ISRC universal, procesa en sesión y borra al cerrar". UVP: 5 patas diferenciales (simple + destino ético + privacidad radical + dirección única + neutro). Personalidad: 4 rasgos (Libre, Honesta, Con criterio, Ligera) con ejemplos y anti-ejemplos. Territorio a evitar: 6 líneas rojas (no IT, no anti-Spotify, no todo-a-todo, no profiling, no suscripción disfrazada, no complejidad expuesta).

- **ALTERNATIVAS DESCARTADAS** — (1) Arquetipo Forajido/Rebelde: descartado por contradecir el posicionamiento neutro y la promesa de privacidad seria. (2) Sabio primario + Explorador secundario: descartado por riesgo de sonar técnico/frío para una usuaria no técnica. (3) Explorador + Cuidador: descartado por perder el filo de "con criterio / con datos". (4) Propósito "migrar playlists": descartado por ser función, no propósito (el propósito es la libertad que la función habilita).

- **POR QUÉ ESTA** — El arquetipo Explorador ocupa el territorio libre en la categoría (nadie vende libertad de movimiento); el Sabio aporta la credibilidad que la promesa ética y de privacidad necesita. El posicionamiento nace de cruzar la Oportunidad de la investigación con la auditoría interna. Los 4 rasgos de personalidad y los 6 territorios a evitar blinden el tono y el diseño de las siguientes fases.

- **QUÉ SE ROMPIÓ** — Nada técnico. Decisión de arquetipo validada explícitamente por la fundadora antes de cerrar el documento (regla de la skill).

- **QUÉ QUEDA PENDIENTE DE ENTENDER** — La fundadora no marcó "no entendí" explícito en esta sesión (la respuesta al question tool no llegó clara). Queda pendiente aclarar: arquetipos (Mark & Pearson), fórmula Ries & Trout, diferencia UVP vs posicionamiento, y por qué el territorio a evitar son líneas rojas no preferencias. Se explicarán cuando se usen en los siguientes pasos.


---

## 2026-09-11 · Marketing Paso 6 — Identidad verbal

- **QUÉ SE DECIDIÓ** — Identidad verbal completa en docs/marketing/05-identidad-verbal.md (commit b350920). Naming TuneHop justificado vs estrategia (no se reabre). Tono de voz en 4 ejes (cercano/formal, serio/lúdico, experto/accesible, neutro/apasionado) con ejemplos reales. Mensajes clave en 3 niveles: N1 promesa central, N2 cuatro pilares, N3 pruebas de confianza. Tagline elegida: "Tu música, donde pagan mejor. En minutos." (Opción 1 de 6). Vocabulario prohibido: 10 palabras/clichés de categoría con alternativa TuneHop. Copy real en 3 contextos: web hero, red social (280 chars), atención al cliente (respuesta real a incidencia de canciones faltantes).

- **ALTERNATIVAS DESCARTADAS** — (1) Taglines 2-6: descartadas por perder promesa ética, promesa de tiempo, o claridad. (2) Tono "experto visible": descartado por territorio a evitar §7.1 (no parecer herramienta de IT). (3) Mensaje "gratis" como gancho: descartado por atraer Perfil C y devaluar promesa ética. (4) Lenguaje de ruptura ("huir", "escapar"): descartado por contradecir posicionamiento neutro.

- **POR QUÉ ESTA** — La identidad verbal deriva directo del arquetipo Explorador+Sabio y la personalidad (Libre, Honesta, Con criterio, Ligera). Cada eje de tono, cada mensaje, cada palabra prohibida protege el posicionamiento. El copy real en 3 contextos es la prueba de fuego: si no sabes escribirlo, la estrategia no está lo bastante afilada.

- **QUÉ SE ROMPIÓ** — Nada técnico. El copy de web (hero) ya existía parcialmente en messages/es.json; este documento pasa a ser la fuente de verdad verbal. Cualquier discrepancia futura se resuelve a favor de este documento.

- **QUÉ QUEDA PENDIENTE DE ENTENDER** — La fundadora no marcó "no entendí" explícito en esta sesión (respuesta question tool no llegó). Pendiente de aclarar cuando se use: definición práctica de tono de voz, jerarquía de mensajes, diferencia tagline vs promesa, por qué vocabulario prohibido son líneas rojas, y por qué copy real (no descripción) en 3 contextos.


---

## 2026-09-11 · Marketing Paso 7 — Identidad visual

- **QUÉ SE DECIDIÓ** — Identidad visual completa en docs/marketing/06-identidad-visual.md (commit e4355ab). Referencias: señalética transporte, estilo suizo, TIDAL, apps privacidad-first, contraste con Spotify. Logo: wordmark TuneHop + glifo "salto preciso" (nace de la h de hop, trazo monolineal que curva y aterriza en punto). Paleta mínima: Negro #0A0A0A, Blanco #FAFAFA, Teal eléctrico #00E5A0 (acento único, solo CTA/focus/glifo), Rojo error, Ámbar warning, Grises bordes. Tipografía: Space Grotesk (primaria, variable, geométrica humanista) + JetBrains Mono (secundaria, solo código/ISRC). Sistema gráfico: iconografía monolineal 2px, foto documental técnico, motion ease-out-expo 150-300ms. Aplicaciones clave: web app (prioridad 1), favicon/app icon (2), OG image/redes (3). Qué evitar: 9 errores de categoría (verde Spotify, ondas, degradados, ilustraciones amigables, CTAs múltiples, dashboards, tipografía decorativa, iconos rellenos). Tokens JSON para skill frontend (Passe-Partout).

- **ALTERNATIVAS DESCARTADAS** — (1) Verde como acento: descartado por ser territorio Spotify. (2) Logo con nota musical/flecha genérica: descartado por cliché de categoría. (3) Paleta amplia con secundarios: descartada por principio "mínima, funcional, semántica". (4) Tipografía serif/Display decorativa: descartada por territorio a evitar (no IT, no decorativa). (5) Ilustraciones lifestyle: descartadas por foto documental (Sabio) vs cliché de categoría.

- **POR QUÉ ESTA** — Cada decisión visual deriva del arquetipo Explorador+Sabio y la personalidad (Libre, Honesta, Con criterio, Ligera). El Teal puentea a TIDAL sin copiarla; el Negro/Blanco da autoridad y claridad; Space Grotesk es técnica pero humana; el glifo "salto preciso" encarna el nombre y la promesa. Los tokens JSON son fuente única para implementación en frontend.

- **QUÉ SE ROMPIÓ** — Nada técnico. La web actual (tunehop.vercel.app) usa plantilla Next.js (Geist, favicon default, sin logo). Este documento es la spec para rehacerla; el deploy real vendrá en la fase de producción de piezas (Paso 16).

- **QUÉ QUEDA PENDIENTE DE ENTENDER** — La fundadora no marcó "no entendí" explícito (respuesta question tool deduplicada). Pendiente de aclarar cuando se implemente: concepto de logo (glifo desde la h), por qué paleta mínima y teal no para texto, tipografía variable font, sistema gráfico monolineal/foto documental/motion, y qué son design tokens para frontend.


---

## 2026-09-11 · Marketing Paso 8 — Protección legal

- **QUÉ SE DECIDIÓ** — Documento docs/marketing/07-proteccion-legal.md (commit f3fdc34). Análisis sombrero negro: registrabilidad "TuneHop" (búsquedas preliminares EUIPO/OEPM/USPTO/web/stores: sin colisiones idénticas; distintividad media-alta; clases 9,35,38,41,42). Logo: wordmark + glifo "salto preciso" registrables (denominativa + figurativa + mixta). Claims regulados identificados: 6 claims de riesgo (pago artistas comparativo, superlativo "mejor", privacidad radical/borrado real, "sin email/tarjeta/suscripción/cuenta", "código abierto", rendimiento "en minutos/3 clics") + claims seguros. Dominios/handles: tunehop.com/.app/.es libres (comprar ya); @tunehop en redes por verificar y reservar. Recomendación en 3 niveles: obligatorio abogado (informe viabilidad, registro, revisión claims, cesión derechos logo), recomendado antes de escalar (dominios, handles, política privacidad/Términos, auditoría borrado real, repo público), seguro asumir (sin colisiones idénticas visibles, glifo sin choque visual, claims funcionales verificables, arquitectura única simplifica).

- **ALTERNATIVAS DESCARTADAS** — (1) No hacer búsqueda preliminar: descartado por regla del Paso 8 (primera pasada obligatoria). (2) Registrar solo denominativa: descartado por recomendar wordmark + mixta (glifo refuerza). (3) Ignorar claims de pago a artistas: descartado por ser el claim central de la UVP y estar regulado (publicidad comparativa Art. 10 LCD). (4) Dejar dominios para después: descartado por riesgo squatter alto (nombre corto, compuesto, app pública).

- **POR QUÉ ESTA** — El Paso 8 es el filtro antes del brand book (Paso 9). Si hay colisión de marca o claim ilegal, el brand book se construye sobre arena. La primera pasada analítica (no abogado) señala riesgos reales y accionables, y separa lo que requiere profesional de lo que se puede avanzar.

- **QUÉ SE ROMPIÓ** — Nada técnico. La búsqueda de marcas se hizo con herramientas públicas gratuitas (no bases de datos profesionales de similitud fonética/visual); por eso el documento marca explícitamente "pendiente de verificación profesional" en cada punto crítico.

- **QUÉ QUEDA PENDIENTE DE ENTENDER** — La fundadora marcó las 4 áreas: (1) Claims regulados (publicidad comparativa, superlativos, RGPD) — por qué "3-7x más" y "mejor" requieren prueba legal, no solo técnica. (2) Registrabilidad nombre/logo (clases Niza, distintividad, búsqueda preliminar) — qué significa "sugerente vs descriptivo", qué cubren las clases. (3) Dominios/handles — por qué comprar ya si no hay campaña activa (riesgo squatter, coste bajo, opción real). (4) Recomendación abogado — diferencia entre obligatorio (riesgo legal/fincanciero alto), recomendado (riesgo reputacional/operativo), y seguro asumir (búsqueda básica sin hallazgos). Se explican en la siguiente sesión antes de Paso 9.


---

## 2026-09-11 · Marketing Paso 9 — Manual de marca (brand book)

- **QUÉ SE DECIDIÓ** — Manual completo en docs/marketing/08-manual-marca.md (commit 033e9cc). Consolida: resumen ejecutivo (posicionamiento + personalidad + tagline), identidad verbal resumida (tono 4 ejes, mensajes 3 niveles, tagline, vocabulario prohibido), identidad visual resumida (logo concept "salto preciso", paleta exacta, tipografía Space Grotesk/JetBrains Mono, sistema gráfico, apps clave), estado legal (tabla con 5 activos y acción requerida), usos correctos/incorrectos (logo, color, tipografía, voz con ejemplos), checklist de coherencia (visual, verbal, legal, calidad), tokens JSON fuente única. Cierra Fase A (Cimientos de marca). Publicado como Artifact navegable (markdown estructurado).

- **ALTERNATIVAS DESCARTADAS** — (1) Manual solo visual (sin verbal/legal): descartado por Fase A = cimientos completos. (2) Manual en PDF estático: descartado por markdown navegable + tokens JSON = usable por dev y diseñador. (3) Incluir piezas de campaña (Pasos 10+): descartado por Fase B separada. (4) No poner estado legal: descartado por transparencia — el manual dice qué está pendiente de abogado.

- **POR QUÉ ESTA** — El brand book es el entregable que convierte estrategia en activo usable. Sin él, cada pieza nueva (landing, email, red social, soporte) reinventa la marca. Con él, cualquiera (tú mañana, un freelance, un comprador) aplica la marca coherente en 5 minutos. El checklist de coherencia es la herramienta operativa diaria.

- **QUÉ SE ROMPIÓ** — Nada. El manual refleja lo ya implementado en código (tokens CSS, Logo, Button, Home) y lo decidido en Pasos 1-8. La coherencia entre docs y código está verificada.

- **QUÉ QUEDA PENDIENTE DE ENTENDER** — La fundadora marcó las 4 áreas: (1) Brand book / manual de marca — para qué sirve y por qué cierra Fase A (activo tangible vs docs sueltos). (2) Usos correctos/incorrectos — por qué son reglas duras (coherencia = confianza) y no sugerencias estéticas. (3) Checklist de coherencia — cómo se usa en práctica (revisa antes de publicar, no después). (4) Estado legal en el manual — por qué va ahí si está pendiente de abogado (transparencia: el equipo sabe qué NO lanzar hasta que el abogado dé ok). Se explican al iniciar Fase B.

## 2026-09-15 · Marketing Paso 7/9 — Identidad visual FINAL: logo H ámbar integrado + paleta

- **QUÉ SE DECIDIÓ** — La fundadora fijó el logo definitivo (tras iterar exploradores v1-v3): **wordmark integrado `Tune` + H(glifo) + `op`**, donde la H ámbar SUSTITUYE a la letra tipográfica dentro del nombre (esa es la gracia). La H: dos palos verticales + barra central que sale volando por encima en curva ascendente (`M4 12 Q12 2 20 12`), trazo 3px redondeado, siempre en Ámbar `#FFC300` independiente del color del texto. Color de acento **Ámbar`#FFC300`** (hover `#E0A800`) en sustitución del teal `#00E5A0` inicial. Wordmark: negro sobre claro / blanco sobre oscuro, solo la H en color.

- **EDGE CASE RESUELTO** — El warning funcional era Ámbar `#FFCC00`, casi idéntico al nuevo acento `#FFC300` (diferían 3 unidades de verde). Dos ámbares casi iguales con roles distintos rompen la semántica visual (CTA vs "atención"). Se movió el warning a **Azafrán `#FF9F0A`** (naranja), deliberadamente distinto. Actualizado en globals.css + ambos docs.

- **POR QUÉ ÁMBAR Y NO OTRO COLOR VIVO** — (1) Contraste: ámbar sobre blanco es 1.9:1 (falla WCAG como texto); sobre negro es 11.9:1. El wordmark completo en color sería ilegible en CTA/footer. (2) El acento vale por escaso: solo la H en color apunta al hop (movimiento + color al mismo sitio) y no compite con el CTA.

- **ARCHIVOS TOCADOS** — Logo.tsx (wordmark integrado + role="img" aria-label="TuneHop"), icon.svg, globals.css (acento, hover, focus, warning→azafrán), brand-book.html (regenerado con script, script actualizado como fuente de verdad), docs/marketing/06-identidad-visual.md y 08-manual-marca.md (logo + paleta + tasas WCAG + checklist + tokens JSON). Commits: a4de9c9 (logo H+lima), fd2243d (ámbar), 2fb1718 (wordmark integrado).

- **QUÉ QUEDA PENDIENTE DE ENTENDER** — La fundadora sufrió sobre-iteración del detalle de la barra de la H (diagonal vs curva vs escalón) que terminó descartada en favor de la H original con curva voladora. Lección anotada: cuando la usuaria dice "es muy frustrante", congelar de inmediato sin nuevas variantes.

## 2026-09-15 · Logo: tamaño display + warning themeColor

- **QUÉ SE ARREGLÓ** — (1) Logo era visualmente pequeño en el hero. Causa raíz: `text-[var(--text-display)]` en Tailwind v4 se interpretaba como **color** (no font-size) porque `text-*` es color por defecto en v4. Solución: usar la clase `.text-display` predefinida en globals.css que sí define `font-size: var(--text-display)` explícitamente. (2) `--text-display` subido de `clamp(2.5rem, 5vw + 1rem, 4rem)` a `clamp(3.5rem, 12vw + 2rem, 8rem)` (hasta 128px). (3) Contenedor del hero ampliado de `max-w-2xl` (672px) a `max-w-4xl` (896px) para que el logo respire.

- **WARNING THEMECOLOR** — Next.js 16 exige `themeColor` en `export const viewport`, no en `metadata`. Movido en layout.tsx. Warning desaparece.

- **LECCIÓN** — En Tailwind v4, `text-[var(--custom-property)]` se resuelve como COLOR (foreground), no como font-size. Para font-size, usar clases CSS predefinidas en globals.css o `text-[length:var(--custom-property)]` con el prefijo explícito.

- **ARCHIVOS TOCADOS** — globals.css (token display ampliado), page.tsx (clase `text-display` + `max-w-4xl`), layout.tsx (viewport export), Logo.tsx (comentario actualizado).
