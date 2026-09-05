# BUGS y roturas — TuneHop

> Documento vivo de roturas, causas raíz y decisiones técnicas. Cuando se rompe algo,
> se añade una entrada aquí con el diagnóstico y la solución, para no repetir errores
> y para que otro agente (p. ej. Opus5) pueda dar instrucciones precisas.
> Ultima actualización: 2026-09-03.

---

## 1. Estado general del flujo

```
Landing → Consentimiento (checkbox) → /api/spotify/auth (nativo <a>)
 → Spotify OAuth → callback → /playlists (LEE, funcional ✅)
 → /destino → Connect TIDAL → /api/tidal/auth (nativo <a>) → TIDAL OAuth
 → /migrando → busca ISRC → crea playlist → resultado
```

- **Spotify (leer): FUNCIONAL end-to-end** ✅ (confirmado por la usuaria).
- **TIDAL (escribir): FUNCIONAL end-to-end** ✅ (confirmado por la usuaria: migrate una playlist real de 2-3 tracks y apareció en TIDAL).

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

## 7. Deuda técnica y pendientes (priorizados · actualizado 2026-09-03)

> **Decisión de seguimiento**: continuar el proceso de los 20 pasos (Paso 10, siguiente hito).
> Esta deuda se ataca dentro del proceso, no al margen. Prioridad P1 = antes de publicar, P2 = cuando toque, P3 = opcional.

### P1 — Antes de publicar (validación y bloqueantes visibles)
- **Test con playlist grande (50+ tracks)**: validar batching de ISRC y manejo de 429 de TIDAL. El `migrando/page.tsx` hace matching track-a-track (`fetch /api/tidal/search` por track); mejorable para usar `searchTrackByISRC`/`searchTracksByISRC` en **lotes** (`filter[isrc]` repetido, ~20/lote). Riesgo real de rate limit en playlists grandes.
- **Revisar si sobrán scopes** `playlists.read` y `collection.read` en la petición de OAuth (TuneHop no lee playlists de TIDAL del usuario ni su colección; solo crea y añade). Menos scope = menor superficie.

### P2 — Documentación (coherencia, no funcionalidad)
- **`docs/07-tareas.md`**: HITO 6+ siguen en Deezer (`searchByISRC`, `migratePlaylist`, HITOs posteriores). Reescribirlos a TIDAL y marcar lo completado.
- **Borrar `ARREGLO-OAUTH.md` y `ARREGLO-TIDAL.md`** (transitorios). TIDAL ya está verde.
- **Decidir reestructuración `CLAUDE.md` → `AGENTS.md`** (sin commitear).

### P3 — Opcional / decisiones de la usuaria
- **Logo/identidad visual**: pregunta de la usuaria dos veces sin respuesta. Conviene responderla pronto (visible para quien pruebe la app).
- **Registrar dominio `tunehop.com`** (decisión de branding, no bloqueante).
- **Aplicar `networkingMode=mirrored`** en `.wslconfig` (Windows 11 22H2+ y aprobación) para depender de `127.0.0.1` y no de `[::1]`.
