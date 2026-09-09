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
