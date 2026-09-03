# Encargo: arreglar el tramo TIDAL (escritura) de TuneHop

> Para el modelo que trabaje esto en opencode. Complemento de `ARREGLO-OAUTH.md`.
> El tramo **Spotify (lectura)** ya funciona end-to-end y está commiteado. Este documento
> es solo sobre el tramo **TIDAL (escritura)**, que **nunca se ha probado completo** y
> además está escrito contra la API equivocada.

---

## 0. Estado al escribir esto

- Dev server: **arriba en `http://[::1]:3000`** (Node v24). Compruébalo con
  `curl -s -o /dev/null -w '%{http_code}\n' http://[::1]:3000/` antes de arrancar otro.
  Si necesitas reiniciar, lee `ARREGLO-OAUTH.md` §"Paso 0" (no hagas `pkill -f "next dev"`,
  cuelga tu propia shell; usa `lsof -ti tcp:3000 | xargs -r kill`).
- Flujo Spotify: **OK** ("funciona!"). Consentimiento → `<a>` nativo → `/api/spotify/auth`
  → OAuth → callback → `/playlists`. No lo toques.
- Flujo TIDAL: `destino` → `/api/tidal/auth` → OAuth → `/migrando` → busca ISRC → crea
  playlist → añade tracks → "Ver en TIDAL". **Sin validar. Probablemente roto en varios
  puntos** (ver §2).

---

## 1. Problema central: el código TIDAL apunta a la API PRIVADA/LEGACY, no a la pública

`src/lib/tidal.ts` y `src/lib/tidal-auth.ts` llaman a **`https://api.tidal.com/v1`**
(la API interna del cliente de TIDAL, no soportada para terceros) con formas de v1:

| Código actual (v1 legacy, INCORRECTO)                         | Debe ser (API pública v2)                                   |
|---|---|
| Base `https://api.tidal.com/v1`                                | `https://openapi.tidal.com/v2`                              |
| `GET /user` → `data.userId` (number)                           | `GET /users/me` → `data.id` (string)                        |
| `GET /search/tracks?query=isrc:{isrc}`                         | `GET /tracks?filter[isrc]={isrc}&countryCode=US` (JSON:API) |
| `POST /users/{id}/playlists` body `{title,description}`        | `POST /playlists?countryCode=US` body JSON:API (ver §3)     |
| `POST /playlists/{uuid}/tracks` body `{trackIds:number[]}`     | `POST /playlists/{id}/relationships/items` body JSON:API    |
| Playlist identificada por `uuid`                               | Identificada por `id` (string)                              |
| Scopes `playlist.create playlist.modify user.read`             | `user.read playlists.read playlists.write collection.read collection.write` |
| Sin `Content-Type` JSON:API                                    | Escrituras con `Content-Type: application/vnd.api+json`     |
| Sin `countryCode`                                              | **Casi todos** los endpoints exigen `?countryCode=XX`       |
| `duration` en segundos (number)                               | `duration` en ISO-8601 (`"PT3M20S"`)                        |
| track `id` numérico                                            | track `id` **string** en toda la v2                         |

La API pública v2 es **JSON:API** (https://jsonapi.org/format/): recursos con
`{ id, type, attributes, relationships }`, respuestas con `data` / `included` / `links`.

### Referencia usada para verificar los contratos

Contratos sacados de un migrador Spotify→TIDAL real en producción (revísalo si dudas):
- `github.com/darshangoswami/syncify` → `apps/web/lib/providers/tidal-write.ts`,
  `tidal-catalog.ts`, `tidal-adapter.ts`, `lib/env.ts`.
- Referencia oficial (SPA, no se puede `curl`, ábrela en navegador):
  `https://tidal-music.github.io/tidal-api-reference/` y
  `https://developer.tidal.com/documentation/api-sdk/api-sdk-quick-start`.
- **Verifica scopes y redirect URIs permitidos en el propio panel de developer.tidal.com
  para esta app** antes de dar nada por bueno.

---

## 2. Roturas concretas del tramo TIDAL (prioridad alta → baja)

### T-1. `src/lib/tidal-auth.ts` — endpoints y scopes de OAuth mal
- `TIDAL_AUTH_URL = "https://auth.tidal.com/v1/oauth2/authorize"` → el flujo v2 usa
  **`https://login.tidal.com/authorize`**. (El token endpoint
  `https://auth.tidal.com/v1/oauth2/token` sí es correcto.) **Verifícalo en el panel.**
- `USER_SCOPES = "playlist.create playlist.modify user.read"` → esos scopes no existen en
  v2. Usa **`user.read playlists.read playlists.write collection.read collection.write`**.
- `TIDAL_API = "https://api.tidal.com/v1"` en `tidalFetch()` → `https://openapi.tidal.com/v2`.
- Si cambias scopes, la usuaria tiene que **re-autorizar** (el consent anterior no vale);
  borra la cookie `tidal_user_tokens` para forzarlo.

### T-2. `src/lib/tidal.ts` — todas las funciones usan rutas/bodies v1
Reescríbelas contra v2 (formas exactas en §3):
- `getCurrentUserId()` — `GET /users/me`, id string.
- `searchTrackByISRC()` / `searchTracksByISRC()` — `GET /tracks?filter[isrc]=...` (se
  pueden pasar **varios `filter[isrc]` en una sola petición**, ~20 por lote → mucho menos
  429 que el bucle actual de 1-por-1 con `setTimeout(200)`).
- `createPlaylist()` — `POST /playlists?countryCode=XX`, body JSON:API, devuelve `data.id`.
- `addTracksToPlaylist()` — `POST /playlists/{id}/relationships/items`, body
  `{ data: [{ id, type: "tracks" }, ...] }`, `Content-Type: application/vnd.api+json`.
- Tipos: cambia `number` → `string` para `id` de track y de playlist en todas las
  interfaces (`TidalTrack.id`, firmas `trackIds: number[]`, `userId: number`, etc.).
- `duration` de v2 es ISO-8601; si se muestra en UI, parséalo (`PT(\d+)M(\d+)S`).

### T-3. `src/lib/tidal.ts` — token equivocado para catálogo
`searchTrackByISRC()` usa `getAppToken()` (client_credentials). En v2, muchos endpoints de
catálogo exigen token **de usuario** + `countryCode`. **Recomendación: usa el token de
usuario (`getValidUserAccessToken()`) para TODAS las llamadas de la migración** y deja
`client_credentials` solo si confirmas contra la referencia que un endpoint concreto lo
acepta. Simplifica y evita sorpresas.

### T-4. `src/app/api/tidal/create-playlist/route.ts` y `.../search/route.ts`
Consumen las funciones de `tidal.ts`; una vez reescrito `tidal.ts`, ajusta:
- `create-playlist/route.ts`: ya no hay `uuid`, es `id`. El campo de respuesta `uuid` que
  devuelve al cliente → renómbralo o deja `id`. `getCurrentUserId` ya no hace falta para
  crear (en v2 `POST /playlists` cuelga del usuario autenticado por el token), pero
  déjalo si lo quieres para el enlace final.
- `search/route.ts`: `result.tidalId` pasará a ser string.

### T-5. `src/app/migrando/page.tsx` — "Ver en TIDAL"
El resultado usa `result.tidalUrl`. Con v2 el enlace público es
`https://tidal.com/playlist/{id}` (verifícalo abriendo uno). Ajusta donde se construye
esa URL (búscala en `create-playlist/route.ts` o en `migrando/page.tsx`).

### T-6. Redirect URI de TIDAL + host `[::1]` (riesgo de entorno)
Igual que Spotify: en el panel de TIDAL el Redirect URI registrado tiene que ser
**exactamente** `http://[::1]:3000/api/tidal/callback` y `NEXT_PUBLIC_APP_URL` +
navegador tienen que usar ese mismo host. **TIDAL puede rechazar `[::1]` o `127.0.0.1`
como loopback** (no está verificado). Si lo rechaza:
- opción A: registrar `http://localhost:3000/...` **solo si TIDAL lo permite** (Spotify no,
  TIDAL quizá sí) y navegar por `localhost` — pero entonces Spotify y TIDAL usarían hosts
  distintos y las cookies de una y otra no colisionan (cookies por nombre distinto), así
  que *técnicamente* vale, aunque es frágil de explicar.
- opción B (definitiva): `networkingMode=mirrored` en `C:\Users\<user>\.wslconfig` +
  `wsl --shutdown`, y usar `127.0.0.1` en todo (Spotify y TIDAL). **Requiere Windows 11
  22H2+ y permiso de la usuaria.** No lo apliques sin preguntar.

### T-7. Rate limits de TIDAL (riesgo conocido)
La usuaria ya fue rate-limiteada por volumen antes. Mantén/mejora el throttling:
- Búsqueda ISRC por **lotes** (`filter[isrc]` múltiple) en vez de 1-por-1.
- Ante `429`, respeta `Retry-After` con backoff exponencial (ver `tidalFetchWithRetry` en
  el repo de referencia: `throttleMs`, `maxRetries`, `retryBaseMs`).
- Añadir items en lotes de **20**, con pausa entre lotes.

---

## 3. Contratos v2 exactos (verificados contra el migrador de referencia)

Base: `const TIDAL_API_V2 = "https://openapi.tidal.com/v2"`. `countryCode` p. ej. `"US"`
(hazlo configurable vía env `TIDAL_COUNTRY_CODE`, default `US`).

### Usuario actual
```
GET {base}/users/me
Authorization: Bearer {userToken}
→ 200 { data: { id: "12345", type: "users", attributes: {...} } }     // id es STRING
```

### Track(s) por ISRC (lote)
```
GET {base}/tracks?filter[isrc]=USABC1234567&filter[isrc]=GBXYZ...&countryCode=US
Authorization: Bearer {userToken}
→ 200 {
    data: [
      { id: "77654321", type: "tracks",
        attributes: { title: "...", isrc: "USABC1234567", duration: "PT3M20S", ... },
        relationships: { artists: { data: [{ id, type:"artists" }] } } }
    ],
    included: [ ...artistas si pides include=artists... ]
  }
```
Mapea `isrc (upper) -> { id, title }`. Sin match ⇒ opcional fallback a búsqueda por texto:
```
GET {base}/searchResults/{encodeURIComponent(query)}/relationships/tracks?countryCode=US&include=tracks
```
(lee `included[]`; formato irregular, mira `toSourceTrack`/`normalizeTrackNode` del repo ref).

### Crear playlist
```
POST {base}/playlists?countryCode=US
Authorization: Bearer {userToken}
Content-Type: application/vnd.api+json
{
  "data": {
    "type": "playlists",
    "attributes": { "name": "<nombre>", "description": "Migrado desde Spotify con TuneHop" }
  }
}
→ 201 { data: { id: "<playlistId>", type: "playlists", attributes: {...} } }
```
Enlace público: `https://tidal.com/playlist/<playlistId>` (verificar).

### Añadir tracks a la playlist (lotes de ~20)
```
POST {base}/playlists/{playlistId}/relationships/items
Authorization: Bearer {userToken}
Content-Type: application/vnd.api+json
{ "data": [ { "id": "77654321", "type": "tracks" }, { "id": "...", "type": "tracks" } ] }
→ 2xx (cuerpo vacío o JSON:API); 409 = ya estaban → trátalo como éxito
```

### (Opcional) Playlists del usuario
```
GET {base}/playlists?filter[owners.id]={userId}&countryCode=US[&page[cursor]=...]
→ data[] con { id, attributes: { name } }, links.meta.nextCursor para paginar
```

---

## 4. Procedimiento de prueba end-to-end (hazlo TÚ, no lo dejes "a ojo")

1. Con el dev server en `http://[::1]:3000`, abre `http://[::1]:3000/destino`.
2. "Connect TIDAL" → debe ir a `login.tidal.com` (o el authorize que confirmes) → autoriza.
3. Vuelve sin pasar por `/error`. Revisa el log: token de usuario guardado en cookie
   `tidal_user_tokens`.
4. Ve a `/playlists`, elige **una playlist pequeña (2-3 tracks)**, lanza la migración.
5. En `/migrando` verifica las fases: `fetching → matching → creating → adding → done`.
6. Comprueba en el log de cada llamada TIDAL el **status real** y, si falla, el body
   (`console.error("... failed:", res.status, await res.text())` ya está puesto en varias).
7. Abre el enlace "Ver en TIDAL" y confirma que la playlist existe con los tracks.
8. Solo cuando eso pase, prueba una playlist grande (50+) para validar el batching y 429.

Errores esperables y qué miran:
- `401` en llamadas TIDAL → scope o token; re-autoriza tras corregir `USER_SCOPES`.
- `400/422` en `POST /playlists` o `/relationships/items` → body no es JSON:API o falta
  `Content-Type: application/vnd.api+json` o `countryCode`.
- `404` en `/users/me` o `/tracks` → sigues pegando a `api.tidal.com/v1`.
- `429` → backoff; baja `batchSize` y sube pausas.

---

## 5. Higiene (no bloqueante, pero anótalo)

- `docs/07-tareas.md`: **T21-T25 siguen escritas para Deezer**. El destino real es TIDAL
  (Deezer cerró el registro de apps en 2024). Reescribe esas filas y marca bien las
  completadas. No inventes checks nuevos; usa los criterios del §4.
- `.env.local`: confirma que existen `TIDAL_CLIENT_ID`, `TIDAL_CLIENT_SECRET`,
  `NEXT_PUBLIC_APP_URL=http://[::1]:3000`. Añade si hace falta `TIDAL_COUNTRY_CODE=US`.
- `next-env.d.ts` sale como modificado: lo regenera Next 16, **no lo commitees a mano**
  (déjalo o revierte, da igual).
- `ARREGLO-OAUTH.md` y **este `ARREGLO-TIDAL.md`** son transitorios: **no commitear**.
  Bórralos cuando el tramo TIDAL esté verde.
- Decisión de la usuaria pendiente (no la tomes tú): commitear o no la reestructuración
  `CLAUDE.md` → `AGENTS.md`; registrar `tunehop.com`; cuándo abordar logo/identidad
  visual (lo preguntó dos veces sin respuesta).

---

## 6. Qué NO tocar / ya resuelto (no reabrir)

- Tramo **Spotify**: funciona. No toques `spotify-auth.ts`, `spotify.ts`, el callback ni
  `consentimiento/page.tsx`.
- `Button.tsx` ya tiene la prop `external` que renderiza `<a>` nativo; `consentimiento` y
  `destino` ya la usan para las rutas OAuth. Correcto, no lo cambies.
- `Checkbox.tsx` ya emite `onChange(checked: boolean)`. Correcto.
- `next.config.ts` → `allowedDevOrigins` para `[::1]`: correcto, no lo quites.
- `Response.redirect(url, 302)` en route handlers **sí** propaga `Set-Cookie` en Next 16
  (verificado). No migres a `NextResponse` "por si acaso".
- Node: **siempre `nvm use 24`** antes de `npm run dev` (el Node 18 del sistema no arranca
  Next 16).
- El dev server persiste entre sesiones MCP; si `next dev` arranca en `:3001` es que hay
  otro vivo o un `.next/dev/lock` obsoleto (ver `ARREGLO-OAUTH.md`).
