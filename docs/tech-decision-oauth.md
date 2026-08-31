# Decisión Técnica — Viabilidad OAuth (Spotify, Deezer, TIDAL)

**Fecha**: 31/08/2026
**Estado**: ✅ VERIFICADO — Las tres plataformas permiten OAuth 2.0 para migración de playlists.
**Decisión**: Proceder con el stack propuesto. El OAuth es viable en las tres.

---

## 1. SPOTIFY — ✅ VIABLE

- **Flujo**: OAuth 2.0 Authorization Code + PKCE (estándar moderno, recomendado por Spotify)
- **Authorize URL**: `https://accounts.spotify.com/authorize`
- **Token URL**: `https://accounts.spotify.com/api/token`
- **Scopes necesarios**:
  - Lectura de playlists: `playlist-read-private`, `playlist-read-collaborative`
  - Crear/modificar: `playlist-modify-public`, `playlist-modify-private`
  - Datos de usuario: `user-read-private`, `user-read-email`
- **Registro de app**: Público y gratuito en Spotify Developer Dashboard
- **Refresh tokens**: ✅ Soportados
- **Nota**: Con PKCE no hace falta client secret en el frontend, pero al ser una app de migración con backend, generaremos el token en el backend por seguridad.

---

## 2. DEEZER — ✅ VIABLE

- **Flujo**: OAuth 2.0 Authorization Code
- **API REST**: `https://api.deezer.com`
- **Operaciones confirmadas en la doc oficial**:
  - Crear playlist: `create_playlist(name)`
  - Añadir tracks: `Playlist.add_tracks(tracks)`
  - Buscar track: `search(...)` con filtros avisados (artista, álbum, track)
  - Obtener playlists del usuario: `get_playlists()`
- **Registro de app**: Público en https://developers.deezer.com (gratuito)
- **Refresh tokens**: Soportados
- **Nota**: Deezer tiene "terms of use" del Simple API que hay que aceptar al registrarse.

---

## 3. TIDAL — ✅ VIABLE (con matiz de access tier)

- **Flujo**: OAuth 2.0 Authorization Code + PKCE
- **Authorize URL**: `https://login.tidal.com/authorize`
- **Token URL**: `https://auth.tidal.com/v1/oauth2/token`
- **Scopes necesarios** (confirmados): `playlists.read`, `playlists.write`
- **Modelo de access tiers** (lo vimos en la spec oficial):
  - `THIRD_PARTY` — tier básico, público para desarrolladores externos
  - `THIRD_PARTY_PROD` — producción
  - `PARTNER` — partnership (acceso más amplio)
  - `INTERNAL` — solo Tidal
- **Requiere**: Registrarse en el Tidal Developer Portal para obtener Client ID
- **Evidencia real**: Proyectos como `beets` y `strawberry` ya usan este flujo OAuth (`auth.tidal.com/v1/oauth2/token`)
- **Nota IMPORTANTE**: El tier `THIRD_PARTY` da acceso a playlists básicas, pero algunos endpoints de catálogo pueden requerir tier superior. Tendremos que verificar qué endpoints de búsqueda de tracks están en THIRD_PARTY al implementar.

---

## Conclusión

Las tres plataformas soportan **OAuth 2.0** y permiten **leer y crear playlists**, que es exactamente lo que necesitamos para la migración. La decisión técnica está asegurada:

- **Origen**: Spotify (API de lectura)
- **Destino**: Deezer y TIDAL (API de escritura/creación)
- **Mecánica**: OAuth en las tres → leer playlists de Spotify → buscar cada track por ISRC en el destino → crear playlists → añadir tracks

**Riesgo técnico principal a vigilar**: El access tier de TIDAL para los endpoints de búsqueda de tracks. Lo validaremos en la fase de implementación (Paso 10).
