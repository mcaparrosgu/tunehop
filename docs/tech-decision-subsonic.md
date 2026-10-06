# Decisión técnica — Destino self-hosted vía Subsonic API (v2)

**Fecha**: 06/10/2026
**Estado**: 📋 Propuesta para v2 — **no implementado**. Endpoints verificados contra la documentación oficial (OpenSubsonic) el mismo día.
**Decisión**: TuneHop podrá crear la playlist migrada en **servidores de música autoalojados** (Navidrome, Airsonic, gonic, Ampache, Jellyfin…) mediante **una única integración** con la **API Subsonic / OpenSubsonic**. Es el mayor alcance posible entre apps libres con el mínimo mantenimiento.

---

## 1. Por qué esta puerta

Contexto: `docs/plataformas-alternativas.md` §5. En los *servicios de streaming* no existe API común de escritura (solo TIDAL; por eso Qobuz/Deezer quedan descartados). En cambio, la API **Subsonic** es un estándar de facto que hablan decenas de servidores y clientes autoalojados. Integrarla **una vez** da acceso a toda la familia.

| | Servicios de streaming | Self-hosted (Subsonic) |
|---|---|---|
| Apps alcanzables | 1-2 (TIDAL; Apple pagando) | **Decenas** |
| Integraciones necesarias | Una por app | **Una** |
| Coste | — | 0 € |
| Encaje con la ética del proyecto | Parcial | ✅ Total (open source, sin persistir datos) |

---

## 2. Qué es (recordatorio)

- **Servidor Subsonic-compatible**: programa que sirve **tu biblioteca de archivos** de música a clientes. El estándar moderno es **Navidrome** (el más usado), pero también Airsonic-Advanced, gonic y Ampache.
- **API Subsonic / OpenSubsonic**: el "idioma" (conjunto de endpoints REST) con el que un cliente pide datos y crea playlists. Una sola integración → todos los servidores y clientes de la familia.
- **OpenSubsonic**: extensión comunitaria que añade campos y mejoras (p. ej. `isrc` en las canciones y POST con formulario). *Comprobar soporte, no todos los servidores lo implementan.*

---

## 3. Autenticación

Todos los métodos comparten parámetros comunes: `v` (versión, p. ej. `1.16.1`), `c` (nombre del cliente, p. ej. `TuneHop`), `f=json`.

Mecanismos, por orden de preferencia para TuneHop:

| Método | Parámetros | Ventaja | Inconveniente |
|---|---|---|---|
| **API Key (OpenSubsonic)** | `apiKey=…` | El usuario genera una clave en su servidor; **no manejamos su contraseña** | Requiere servidor con extensión OpenSubsonic |
| **Token + salt** | `u=…&t=md5(password+salt)&s=salt` | Compatible con servidores antiguos | Hay que manejar la contraseña en memoria para calcular el hash |
| Password en claro | `u=…&p=…` | — | ❌ Evitar (solo testing según la doc) |

**Decisión propuesta**: usar **API Key** como vía principal (más segura y alineada con "no persistir contraseñas") y **Token+salt** como respaldo para servidores sin OpenSubsonic. **Nunca** guardar la clave/contraseña en disco ni en logs: igual que el token de TIDAL, vive en sesión y se descarta al cerrar (`AGENTS.md`).

**CORS**: el navegador **no** puede llamar directamente al servidor del usuario (CORS + contenido mixto HTTP/HTTPS). Todo pasa por **rutas propias en el servidor** (`/api/subsonic/*`), igual que hoy con TIDAL. Esto además mantiene las credenciales fuera del cliente.

---

## 4. Endpoints necesarios

Ruta base: `{serverUrl}/rest/{método}`. Verificado en `opensubsonic.netlify.app`.

| # | Endpoint | Para qué | Parámetros clave |
|---|---|---|---|
| 1 | `ping` | Probar que la URL y las credenciales funcionan (pantalla "Conectar") | — |
| 2 | `getPlaylists` | Listar playlists existentes → detectar "ya migrada" / evitar duplicados | `username` (opcional) |
| 3 | `search3` | Buscar canciones en la biblioteca del usuario | `query`, `songCount`, `songOffset` |
| 4 | `createPlaylist` | Crear la playlist nueva (o actualizar si se pasa `playlistId`) | `name` (crear), `songId` (repetible) |
| 5 | `updatePlaylist` | Añadir canciones en tandas a una playlist ya creada | `playlistId`, `songIdToAdd` (repetible) |

Opcionales de conveniencia:
- `getMusicFolders` — elegir carpeta musical si hay varias.
- `startScan` — pedir al servidor que reindexe en `search3` (mejora de UI futura).

**Respuesta**: siempre `subsonic-response`. Éxito: `status: "ok"`. Error: `status: "failed"` con `error.code` (p. ej. `40` usuario/contraseña incorrectos, `44` API key inválida, `50` sin permiso). Tratar `44` como "clave incorrecta" con mensaje claro.

---

## 5. Emparejamiento de canciones (el punto delicado)

La biblioteca del usuario son **sus archivos**, no un catálogo. Estrategia en dos niveles, reutilizando el motor actual:

1. **Por ISRC (preferente)**: en OpenSubsonic, cada canción (`Child`) puede traer `isrc`. Si el servidor lo soporta **y** los archivos están etiquetados, se puede casar igual que en TIDAL. *Aviso: no es universal; músicas sin etiquetar el ISRC no lo tendrán.*
2. **Por nombre + artista (respaldo, el caso común)**: `search3?query="{título} {artista}"&songCount=N`, y se puntúan candidatos por similitud de título/artista (mismo enfoque que `searchTrackCandidates` de TIDAL). Reutilizar la **pantalla de revisión manual** ya existente (hasta 3 candidatos, reintento, omitir).

> Nota: `search3` **no** devuelve un `searchResult3` vacío necesariamente; hay que paginar con `songOffset` si se quieren más de `songCount` resultados.

---

## 6. Diseño de código (espejo de TIDAL)

Se replica la arquitectura ya probada, sin tocar el motor de Spotify/CSV:

| Pieza nueva | Espejo actual | Contenido |
|---|---|---|
| `src/lib/subsonic.ts` | `src/lib/tidal.ts` | `searchSongByISRC`, `searchSongByName`, `searchSongCandidates`, `createPlaylist`, `addSongsToPlaylist(Batched)`, `pingConnection` |
| `src/lib/subsonic-auth.ts` | `src/lib/tidal-auth.ts` | Guardar/validar la conexión (URL + credencial) en sesión; construir los params comunes |
| `src/app/api/subsonic/{ping,search,search-by-name,search-candidates,create-playlist,add-songs}/route.ts` | `src/app/api/tidal/*` | Endpoints finos que llaman a `subsonic.ts` |
| `src/types` + `TidalMatch`-like | — | Tipo `SubsonicMatch { id, title, artist }` |
| Pantalla de destino | `/destino` actual | Añadir "Mi servidor (Navidrome/Subsonic)" como opción de destino |

**Clave de diseño**: el "motor" de migración (lista → ISRC/fallback → destino → informe) no cambia; Subsonic es **un destino más**, con la misma interfaz que TIDAL. Así se evita duplicar la lógica de progreso, batching, informe y guardrails.

---

## 7. Batching y límites

- `songId` y `songIdToAdd` se repiten **una vez por canción**. En `GET` la URL puede superar el límite del servidor.
- **Solución**: usar el **POST con formulario** (`application/x-www-form-urlencoded`, extensión OpenSubsonic) para las tandas grandes. Si el servidor no lo soporta, mantener `GET` con tandas pequeñas (p. ej. ~100 IDs) y `updatePlaylist`.
- Patrón: `createPlaylist` con la primera tanda → `updatePlaylist` con las siguientes (mismo batching de ~20-100 que ya usa `addTracksToPlaylistBatched`).

---

## 8. Cómo comprobarlo (sin romper nada)

1. **Verificación en solo lectura** (segura): `ping` + `getPlaylists` + `search3` contra un Navidrome de pruebas. No crea nada.
2. **Prueba de escritura controlada**: `createPlaylist` con un nombre reconocible (p. ej. `TuneHop-test`) en el servidor de pruebas, `updatePlaylist`, y borrar la playlist después. **Nunca** en la biblioteca de un usuario real durante el desarrollo.
3. Tests unitarios: mockear `fetch` de `subsonic.ts` (parser de `subsonic-response`, paginación, batching, errores `40/44/50`), al estilo de `src/lib/__tests__/tidal-search.test.ts`.

---

## 9. Riesgos y decisiones abiertas

| Riesgo | Mitigación |
|---|---|
| El servidor no soporta OpenSubsonic (sin `apiKey`, sin `isrc`, sin POST form) | Fallback a Token+salt y a GET por lotes; detectar capacidades con `ping` (`openSubsonic: true`) |
| Biblioteca sin ISRC etiquetado | Fallback nombre/artista + revisión manual (ya existe) |
| Mercado de nicho (público técnico) | Aceptado: es alcance máximo con coste mínimo, complementa a TIDAL, no lo sustituye |
| Diferencia entre variantes Subsonic | Probar contra Navidrome (referencia) y gonic; documentar en `docs/bugs.md` |

---

## 10. Fuentes (verificadas 2026-10-06)

- OpenSubsonic — `search3`, `createPlaylist`, `updatePlaylist`, `getPlaylists`, `Child`, API Reference (auth, `apiKey`, parámetros comunes): https://opensubsonic.netlify.app/docs/
- Adopción de servidores (Navidrome, Airsonic-Advanced, gonic, Jellyfin): `docs/plataformas-alternativas.md` §2.
- Decisión de negocio (no abrir a más servicios de streaming): `docs/plataformas-alternativas.md` §5.
