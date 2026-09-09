# BUGS y roturas — TuneHop

> Documento vivo de roturas, causas raíz y decisiones técnicas. Cuando se rompe algo,
> se añade una entrada aquí con el diagnóstico y la solución, para no repetir errores
> y para que otro agente (p. ej. Opus5) pueda dar instrucciones precisas.
> Ultima actualización: 2026-09-09 (R10 validado en producción).

---

## 1. Estado general del flujo

```
Landing → Consentimiento (checkbox) → /api/spotify/auth (nativo <a>)
 → Spotify OAuth → callback → /playlists (LEE, funcional ✅)
 → /destino → Connect TIDAL → /api/tidal/auth (nativo <a>) → TIDAL OAuth
 → /migrando → busca ISRC multi-país → fallback nombre/artista → crea playlist → resultado
```

- **Spotify (leer): FUNCIONAL end-to-end** ✅ (confirmado por la usuaria).
- **TIDAL (escribir): FUNCIONAL end-to-end** ✅ (confirmado por la usuaria: migró playlist real de 5 tracks; el 2026-09-09 migró 17/18 tracks de una playlist mainstream en producción: https://tidal.com/playlist/266cbacb-1f51-41c7-a909-fc476993572a).
- **Búsqueda ISRC: multi-país automático** ✅ (US, ES, GB, MX, DE) + fallback por nombre/artista (arreglado en R10, validado en producción).
- **Rate limit: protegido** ✅ (429/403 para búsqueda automáticamente).

---

## 2. Roturas abiertas

### R1 — TIDAL apuntaba a la API privada v1 (RESUELTO 2026-09-03)
- **Causa raíz**: `src/lib/tidal.ts` y `src/lib/tidal-auth.ts` llamaban a `https://api.tidal.com/v1` (API privada/legacy del cliente), pero las credenciales de developer.tidal.com son para la API pública v2 (`https://openapi.tidal.com/v2`, JSON:API). Contratos, rutas, bodies, scopes y tipos completamente distintos.
- **Reescrito a v2 (commit `f77a458`)**:
  - Autorización: `auth.tidal.com/v1/oauth2/authorize` → `login.tidal.com/authorize`.
  - Scopes: `playlist.create playlist.modify user.read` → `user.read playlists.read playlists.write collection.read collection.write`.
  - Base: `api.tidal.com/v1` → `openapi.tidal.com/v2`.
  - Usuario: `GET /user` (userId nº) → `GET /users/me` (`data.id` string).
  - Buscar ISRC: `search/tracks?query=isrc:X` → `GET /tracks?filter[isrc]=X&countryCode=US` (lotes con `filter[isrc]` repetido).
  - Crear playlist: `POST /users/{id}/playlists {title}` → `POST /playlists?countryCode=US` JSON:API (`data.attributes.name/description`).
  - Añadir tracks: `POST /playlists/{uuid}/tracks {trackIds:[nº]}` → `POST /playlists/{id}/relationships/items` body `{data:[{id,type:"tracks"}]}` con `Content-Type: application/vnd.api+json`; `409` = ya estaban ⇒ éxito.
  - IDs de track y playlist pasan de `number` a `string`.
  - Búsqueda por ISRC usa token de **usuario** (no client_credentials).
  - `countryCode` configurable vía env `TIDAL_COUNTRY_CODE` (default `US`).
- **Rutas ajustadas**: `create-playlist/route.ts` (uuid→id, ya no usa `getCurrentUserId`), `migrando/page.tsx` (lee `createData.id`, enlace `https://tidal.com/playlist/{id}`).
- **Estado (2026-09-03 tarde)**: VERIFICADO end-to-end. La usuaria añadió el Redirect URI `http://[::1]:3000/api/tidal/callback` en developer.tidal.com, marcó los scopes como requeridos (incl. `playlists.write` y `collection.write`), re-autorizó, y migró una playlist real de 2-3 tracks que apareció correctamente en TIDAL.

### R2 — Inconsistencia de host Windows/WSL (causa raíz recurrente)
- **Síntoma original**: `ERR_CONNECTION_REFUSED` en `127.0.0.1:3000`; `localhost` de Windows resuelve a `::1` y el relay de WSL **solo reenvía IPv6**, no IPv4 `127.0.0.1`.
- **Workaround (no definitivo)**: usar `http://[::1]:3000` como host único.
- **Riesgo latente**: cualquier cosa que asuma `127.0.0.1`/`localhost` vuelve a fallar. Siempre navegar por `http://[::1]:3000`.
- **Solución definitiva (pendiente)**: `networkingMode=mirrored` en `.wslconfig` (Windows 11 22H2+). No aplicado por falta de confirmación de versión/aplicación.
- **Ojo**: Spotify prohíbe `localhost` como redirect URI; acepta `127.0.0.1` y `[::1]`. TIDAL sin verificar.

### R3 — Inconsistencia de origen para cookies PKCE (mitad del bug resuelto)
- **Causa raíz (daba `State inválido (posible CSRF)`)**: `localhost` y `[::1]` son orígenes distintos para el navegador; la cookie de `state`/`verifier` puesta en un origen no se envía al callback en otro.
- **Estado tras arreglo**: con todo en `[::1]` y navegación nativa, funciona. **Riesgo**: navegar por otra URL (p. ej. `localhost:3000`) lo reaparece.

### R4 — Checkbox que no habilitaba el botón (resuelto, documentar ya no)
- **Causa**: `Checkbox.tsx` emitía el `change` como evento nativo; el consumidor usaba `setAceptado(event.target.checked)` y el estado no se propagaba. Además `Button` con `next/link` no navega bien a OAuth externo.
- **Arreglo**: `Checkbox` emite `onChange(checked: boolean)` + `onChange={setAceptado}`; `Button` tiene `external?: boolean` que renderiza `<a>` nativo.

### R5 — next-intl no cargaba traducciones (RESUELTO 2026-09-03, en producción)
- **Síntoma**: en producción las claves se mostraban en crudo (`home.title`, `home.subtitle`...).
- **Causa (doble)**: (1) `messages/es.json` usaba claves planas con puntos (`"home.title": "..."`), pero next-intl usa **estructura anidada** donde el `.` indica niveles (`{home: {title: ...}}`); lanzaba `INVALID_KEY: Namespace keys cannot contain the character "."`. (2) La home `page.tsx` era Server Component pero usaba `useTranslations()` (hook de cliente) en vez de `getTranslations()` de `next-intl/server`.
- **Arreglo** (commit `84f4b10`): reescribir `messages/es.json` como objeto anidado; las claves `.aria`/`.error.spotify` pasaron a camelCase (`connectAria`, `connect`...); home usa `getTranslations()` (async server). Las páginas interactivas (`consentimiento`, `playlists`, `destino`, `migrando`) sí usan `useTranslations()` correctamente por tener `"use client"`.
- **Tip**: claves = nombres de ruta sin puntos, y recordar `getTranslations()` para server components, `useTranslations()` para client.

### R6 — Playlists en producción con 0 canciones (RESUELTO 2026-09-03, en producción)
- **Síntoma**: en `https://tunehop.vercel.app/es/playlists` todas las playlists salían con "0 canciones", aunque en Spotify tienen cientos.
- **Causa**: Spotify devolvía el campo `items.total` en `/me/playlists` (en vez del histórico `tracks.total`); el código leía solo `pl.tracks?.total ?? 0` → siempre 0. El token era válido (diagnóstico: status 200), el problema era el nombre del campo.
- **Arreglo** (commit `42c14b7`): `totalTracks: pl.tracks?.total ?? pl.items?.total ?? 0`. Soporta ambos esquemas.
- **Cómo se encontró**: endpoint temporal `/api/debug/spotify` (eliminado tras el fix) que devolvía la respuesta cruda de Spotify + header `spotify-scope`. Útil para el futuro: ante un síntoma raro en producción, exponer la respuesta cruda de la API externa en vez de teorizar.
- **Tip**: las APIs externas cambian de esquema sin avisar; al mapear campos de una API, usa fallbacks (`??`) para campos con nombre histórico.

### R7 — Error NO_PLAYLISTS tras refactor i18n (RESUELTO 2026-09-03, en producción)
- **Síntoma**: tras seleccionar playlists y conectar TIDAL, la migración fallaba con "NO_PLAYLISTS".
- **Causa**: en el refactor de i18n (HITO 11, commit `cc6a6e2`), el botón "Continuar" pasó de ser `<Button onClick={...}>` (que guarda `sessionStorage` y navega con `window.location.href`) a `<Button href="/destino" onClick={...}>`. El componente `Button` con `href` renderiza `<Link>` y **descarta `onClick`** (`props` solo se propagan al `<button>` cuando no hay href) → el `sessionStorage.setItem("selectedPlaylists", ...)` nunca se ejecutaba → `/migrando` leía `[]` → `NO_PLAYLISTS`.
- **Arreglo** (commit `5f9d081`): restaurar el patrón original: `<Button onClick={() => { sessionStorage.setItem(...); window.location.href = "/destino"; }}>` sin `href`.
- **Lección**: `Button` con `href` ≠ `Button` con `onClick`. Nunca combinar ambos esperando que corra el handler; si necesitas ambas cosas, usa `onClick` + `window.location.href` (o refactor de Button para soportar ambos).

### R8 — Spotify migró el endpoint de tracks de playlist (RESUELTO 2026-09-05, en producción)
- **Síntoma**: al migrar, error `NO_MATCHES` para todas las canciones; diagnóstico mostraba `spotifyTracksStatus: 403` al leer los tracks de una playlist propia.
- **Causa**: la API de Spotify migró el endpoint `GET /playlists/{id}/tracks` → `GET /playlists/{id}/items` (el href de `tracks`/`items` en la respuesta de `/me/playlists` ya apuntaba a `/items`, pista del bug R6). Además el objeto de item cambió: el track ya no está en `item.track` sino en `item.item`. El endpoint viejo responde `403 Forbidden`. Además, el parámetro `fields=items(track(...))` en el nuevo endpoint devuelve items vacíos.
- **Arreglo** (commits `0745bb4`, `327c881`, `1d2b244`): en `src/lib/spotify.ts`, cambiar `getPlaylistTracks` y `getAllPlaylistTracks` a `/items` con `fields=items(item(...))` (formato nuevo) y mapear `entry.item ?? entry.track` (soporta esquema nuevo y viejo). Sin `fields`, Spotify no devuelve `external_ids` (ISRC) en la respuesta por defecto.
- **Cómo se detectó**: endpoint temporal de debug que comparaba 4 variantes (tracks/items × con/sin fields). `/tracks` daba 403, `/items` daba 200 pero con `fields=items(track(...))` devolvía items vacíos (campo `track` ya no existe). Solo `fields=items(item(...))` funcionó.
- **Tip**: cuando una API externa devuelve campos con un nombre distinto al esperado (R6: `items` vs `tracks`; R8: `item` vs `track`), el href de la respuesta suele contener el endpoint real asociado. Verificarlo antes de asumir. Sin `fields`, la API de Spotify no devuelve ISRCs.

### R9 — TIDAL no encontraba tracks por countryCode fijo (RESUELTO 2026-09-05)
- **Síntoma**: `NO_MATCHES` para playlists reales;_tracks con ISRC válido no encontraban match en TIDAL.
- **Causa**: `countryCode=US` hardcoded. Tracks de otros países/regiones no aparecían en el catálogo US.
- **Arreglo** (commit `59bfd6b`): búsqueda ISRC multi-país automática (US, ES, GB, MX, DE) con detección de rate limit (429/403 para). Delay 100ms entre países, 300ms entre tracks.
- **Fallback adicional** (commit `c1b3fc0`): `/api/tidal/search-by-name` busca por nombre/artista cuando ISRC no funciona. Se ejecuta automáticamente después de la búsqueda ISRC para tracks no encontrados.
- **Rate limit protegido**: si TIDAL devuelve 429 o 403, la búsqueda se detiene automáticamente. Con 5 países y 300ms delay, playlist de 50 tracks ≈ 60 llamadas en 30s (within limits).

---

## 3. Roturas cerradas/resueltas (no repetir)

- **C1** El proceso `npm run dev` moría al terminar la shell MCP.
  - Solución: `exec setsid nohup npm run dev ... &` en subshell; el proceso persiste.
  - Nota: `pkill -f "next dev"` cuelga la shell (el patrón coincide con el propio comando) → usar `lsof -ti tcp:3000 | xargs kill`.
- **C2** `npm run dev` arrancaba en 3001 cuando el 3000 estaba ocupado.
  - Solución: limpiar puertos antes de arrancar.
- **C3** Node del sistema (v18) no arranca Next 16 (exige >=20.9).
  - Solución: `nvm use 24` antes de `npm run dev`.
- **C4** Next bloqueaba HMR y `/_next/*` en `[::1]` ("Blocked cross-origin request").
  - Solución: `allowedDevOrigins: ["[::1]", "::1", "localhost", "127.0.0.1"]` en `next.config.ts`.
- **C5** Eliminados `console.log("CALLBACK cookies/state/verifier")` de `src/app/api/spotify/callback/route.ts` (filtraban state y verifier PKCE a logs).

### R10 — La búsqueda por texto de TIDAL usaba el endpoint incorrecto (RESUELTO Y VALIDADO 2026-09-09)
- **Síntoma**: el fallback por nombre y los candidatos de la revisión manual nunca devolvían resultados. La revisión manual nunca aparecía y las playlists mainstream migraban 0 tracks aunque existieran en TIDAL.
- **Causa raíz**: `searchTrackByName` y `searchTrackCandidates` llamaban a `GET /v2/search?query=...&type=tracks` (endpoint que ya no devuelve tracks en la API v2) y parseaban `data.data[]` como tracks directos. TIDAL v2 usa `GET /v2/searchResults/{query}?include=tracks`, que devuelve solo referencias (IDs) en `data.data.relationships.tracks.data`; los detalles (título, artistas) se obtienen con `GET /v2/tracks?filter[id]=...&include=artists`.
- **Cómo se detectó**: la usuaria reportó "0/18 migradas, ninguna solución de revisión visible". Se buscaron proyectos reales que migran a TIDAL (GitHub) y se comparó su patrón de búsqueda: `searchResults` + detalles por IDs (repo `jjdenhertog/spotify-to-plex`).
- **Arreglo** (commit `a33ec3b`): nuevos helpers `searchText()` y `getTracksByIds()` en `src/lib/tidal.ts`; limpieza de caracteres prohibidos en la query; parseo correcto.
- **Validación**: la misma playlist mainstream pasó de 0/18 a 17/18 migradas (1 residual por catálogo: "Ruby Soho — Rancid", cubierto por la revisión manual).**

---

## 4. Preguntas de contrato de API pendientes de validar (lista de verificación para TIDAL)

- [ ] Body de `POST /playlists/{uuid}/tracks`: ¿`{ trackIds: number[] }`?
- [ ] Sintaxis de búsqueda ISRC: `query=isrc:X`?
- [ ] Campo para user id: `user.userId`?
- [ ] Scopes correctos para crear/modificar playlists.
- [ ] Redirect URI TIDAL acepta `[::1]` (no `localhost`)?
- [ ] Manejo de token caducado/refresh.

---

## 5. Decisión de destino: Deezer → TIDAL

- **Deezer**: cerró el registro de nuevas apps desde mediados de 2024 ("We're not accepting new application creation at this time"). Inviable como destino para app nueva.
- **Decisión**: TuneHop escribe en **TIDAL** (registro abierto, credenciales en `.env.local`).
- **Pendiente**: actualizar `docs/07-tareas.md` (T21-T25 ya pasados a TIDAL; HITO 6+ siguen mencionando Deezer).

---

## 6. Datos de entorno para reproducir

```
- WSL/Ubuntu, proyecto en /home/dev/proyectos/Spotify
- Node v24.19.0 (nvm) / npm 11.17.0 (obligatorio para Next 16)
- Next 16.3.4, Turbopack
- Puerto 3000. Host de acceso desde Windows: http://[::1]:3000
- Dev server en background (persiste entre sesiones MCP)
- .env.local: SPOTIFY_CLIENT_ID/SECRET, TIDAL_CLIENT_ID/SECRET,
  NEXT_PUBLIC_APP_URL=http://[::1]:3000
```

---

## 7. Deuda técnica y pendientes (priorizados · actualizado 2026-09-09)

> **Decisión de seguimiento**: continuar el proceso de los 20 pasos (Paso 10, siguiente hito).
> Esta deuda se ataca dentro del proceso, no al margen. Prioridad P1 = antes de publicar, P2 = cuando toque, P3 = opcional.

### P1 — Antes de publicar (validación y bloqueantes visibles)
- **Test con playlist mainstream (18 tracks: "Come as You Are")**: validar que la multi-país + fallback + revisión manual funciona end-to-end en producción (https://tunehop.vercel.app). La usuaria solo ha probado con tracks de Ska de los 60s (no existen en TIDAL).
- **Revisar si sobran scopes** `playlists.read` y `collection.read` en la petición de OAuth (TuneHop no lee playlists de TIDAL del usuario ni su colección; solo crea y añade). Menos scope = menor superficie.

### P2 — Documentación (coherencia, no funcionalidad)
- **`docs/07-tareas.md`**: HITO 6+ siguen en Deezer (`searchByISRC`, `migratePlaylist`, HITOs posteriores). Reescribirlos a TIDAL y marcar lo completado.
- **Borrar `ARREGLO-OAUTH.md` y `ARREGLO-TIDAL.md`** (transitorios). TIDAL ya está verde.
- **Decidir reestructuración `CLAUDE.md` → `AGENTS.md`** (sin commitear).

### P3 — Opcional / decisiones de la usuaria
- **Logo/identidad visual**: pregunta de la usuaria dos veces sin respuesta. Conviene responderla pronto (visible para quien pruebe la app).
- **Registrar dominio `tunehop.com`** (decisión de branding, no bloqueante).
- **Aplicar `networkingMode=mirrored`** en `.wslconfig` (Windows 11 22H2+ y aprobación) para depender de `127.0.0.1` y no de `[::1]`.

---

## 8. Funcionalidades implementadas en el MVP (resumen 2026-09-09)

| Área | Implementado |
|---|---|
| **OAuth Spotify** | PKCE, cookies httpOnly, CSRF, refresh token |
| **OAuth TIDAL v2** | Authorization Code, cookies httpOnly, scopes `user.read playlists.read playlists.write collection.read collection.write` |
| **Búsqueda ISRC** | Multi-país (US, ES, GB, MX, DE) con rate-limit protection (429/403) |
| **Fallback nombre/artista** | Búsqueda automática tras ISRC fallido |
| **Revisión manual pro** | Candidatos (hasta 3), reintento individual, "Buscar en TIDAL", omitir, exportar JSON, copiar lista, guardar localStorage |
| **Batching tracks** | Tandas de 20 para añadir a playlist TIDAL |
| **Selección playlists** | Checkbox, select all, buscador por nombre/creador, ocultar, badge "Migrada" |
| **i18n** | Español (next-intl) |
| **Accesibilidad** | WCAG AA, focus-visible, aria-labels, skip-to-content |
| **Legal** | Consentimiento, privacidad, borrado de datos (cookies + sessionStorage) |
| **Deploy** | Vercel producción (https://tunehop.vercel.app) |
