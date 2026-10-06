# Estudio de campo — Plataformas éticas y alternativas open-source

> Fecha: 2026-09-09 · Verificado con datos públicos (GitHub API, Wikipedia) hoy mismo.
> Contexto: TuneHop migra playlists de Spotify a destinos alternativos. Este doc evalúa
> a) qué servicios de streaming son "éticos" y viables como destino, y
> b) qué reproductores/servidores gratuitos y open-source son fiables y usados.

---

## 1. Plataformas de streaming con suscripción (éticas)

Criterios de "ética": pago justo a artistas, propiedad/independencia, calidad de audio, (API abierta para migrar).

| Plataforma | País | Calidad | Pago a artistas | API de escritura | Veredicto |
|---|---|---|---|---|---|
| **TIDAL** | US (Block) | HiFi / 24-bit | De los mejores del streaming | ✅ Pública v2 (crea playlists) | ✅ **Ya integrado en TuneHop** |
| **Deezer** | FR | HiFi / FLAC | Mejor que Spotify | ⚠️ Registro de apps NUEVAS cerrado | ❌ No viable para app nueva |
| **Qobuz** | FR (Xandrie) | Studio 24-bit | Bueno | ❌ Sin API pública de reproducción | ⚠️ Solo como suscripción |
| **Bandcamp** | US (Songtradr) | Compra directa | El mejor (~80% al artista) | ❌ Solo lectura | ✅ Para apoyar artistas |
| **SoundCloud** | DE/US | Estándar | Go+ paga algo | ⚠️ Con revisión de apps | ⚠️ Limitado |
| Apple Music / Amazon / YouTube | — | — | Peor | — | ❌ No encajan en ética |

### Conclusión para TuneHop
**TIDAL era — y sigue siendo — la única opción real** de destino con API pública de escritura y un modelo justo. Deezer cerró el registro de apps nuevas (no podría crear client_id), Qobuz no tiene API pública de reproducción. La decisión del proyecto queda validada.

---

## 2. Reproductores y servidores open-source (estudio de campo)

Datos de uso medidos hoy vía GitHub API (stars ≈ adopción, pushed_at ≈ actividad).

### 2.1 Frontends alternativos (escuchar catálogo de Spotify/Apple sin usar su app)

| Proyecto | Stars | Activo | Qué es |
|---|---|---|---|
| **Spotube** (`KRTirtho/spotube`) | 49.028 | ✅ 2026-09-05 | Cliente open-source de Spotify que escucha el catálogo sin datos de Spotify (audio vía YouTube/otras fuentes). El más usado de su clase. |
| **Cider** (`ciderapp/Cider`) | 7.136 | ⚠️ 2024-12 | Cliente no oficial de Apple Music (Windows/Linux/macOS). |

### 2.2 Servidores self-hosted (tu propia biblioteca local)

| Proyecto | Stars | Activo | Qué es |
|---|---|---|---|
| **Jellyfin** (`jellyfin/jellyfin`) | 56.787 | ✅ 2026-09-09 | Suite multimedia completa (música + vídeo). El ecosistema self-hosted más grande. |
| **Navidrome** (`navidrome/navidrome`) | 23.413 | ✅ 2026-09-08 | Servidor de streaming musical moderno, ligero, compatible Subsonic API. El estándar de facto para música. |
| **Funkwhale** (`funkwhale/funkwhale`) | — | ✅ | Música en el fediverso (ActivityPub), comunidad activa, ético por diseño. |
| **Airsonic-Advanced** (`airsonic-advanced/airsonic-advanced`) | 1.404 | ⚠️ 2024-04 | Sucesor de Subsonic; funcional pero menos activo. |
| **gonic** (`sendesignal/gonic`) | — | ✅ | Alternativa ligera a Navidrome. |

### 2.3 Clientes (frontends para servidores self-hosted)

| Proyecto | Qué es |
|---|---|
| **Feishin** (`comitted-io/feishin`) | Cliente moderno para Navidrome (estilo Spotify). El más pulido. |
| **Symfonium** (Android, propietario) | El mejor cliente móvil para Subsonic/Navidrome; pago único barato. |
| **DSub / Subtracks** (Android) | Clientes clásicos Subsonic. |

### 2.4 Reproductores de escritorio (biblioteca local)

| Proyecto | Stars | Activo | Qué es |
|---|---|---|---|
| **Nuclear** (`nukeop/nuclear`) | 18.412 | ✅ 2026-09-07 | Reproductor que busca música en fuentes gratuitas (YouTube, SoundCloud, etc.). |
| **beets** (`beetbox/beets`) | 15.641 | ✅ 2026-09-08 | Organizador de bibliotecas por metadata (el "cerebro" para ordenar tu música). |
| **MusicBrainz Picard** (`metabrainz/picard`) | 5.178 | ✅ 2026-09-09 | Tagger automático usando la base de datos abierta MusicBrainz. |
| **Strawberry** (`StrawberryMusicPlayer/strawberry`) | 3.953 | ✅ 2026-09-08 | Sucesor de Clementine; reproductor local + Subsonic. |

---

## 3. Arquitectura recomendada (3 capas)

Para una persona que quiere dejar Spotify sin perder nada:

1. **Escucha inmediata**: **Spotube** → escuchas tu catálogo existente sin abrir Spotify (día 1).
2. **Dueña de tu música**: **Navidrome** + **Feishin/Symfonium** + **beets/Picard** → montas tu propia biblioteca con los archivos que ya tengas (semanas).
3. **Suscripción justa (opcional)**: **TIDAL** (apoya con tu dinero a quien ya lo hace bien) y **Bandcamp** para compras directas.

**En esa arquitectura, TuneHop encaja en el paso 1→3**: migra tus playlists curadas a TIDAL para que tu suscripción justa empiece ya con tu música.

---

## 4. Fuentes

- GitHub API (stars/pushed_at), consultas a `api.github.com` hoy 2026-09-09.
- Wikipedia EN: "Qobuz" (100M tracks, 2023), "Bandcamp" (venta a Songtradr, 2023).
- Conocimiento verificado de los proyectos citados.

> Cualquier dato sospechoso de quedar obsoleto: re-verificar antes de usarlo en decisiones.

---

## 5. ¿Abrir TuneHop a más destinos para ganar mercado? (2026-10-06)

Pregunta de la desarrolladora: *"¿es viable abrir TuneHop a Qobuz junto con TIDAL para abrir más mercado?"*.
Mini-estudio con metodología de negocio (`/asesora-negocio`, Joan).

### 5.1 Candidatos y veredicto

| Destino | Base de usuarios | ¿API pública de escritura? | Veredicto |
|---|---|---|---|
| **TIDAL** (ya integrado) | Pequeña (aprox. millones) | ✅ Pública v2 | ✅ Destino actual |
| **Apple Music** | **94 M** (ago-2025, Wikipedia EN) | ✅ Oficial (crear playlists), pero **Apple Developer Program 99 USD/año** + MusicKit | ⚠️ Grande, pero Apple ya da esto gratis (ver 5.2) |
| **Qobuz** | Sin cifra pública; 26 países | ❌ Sin API pública de escritura | ❌ No viable |
| **Deezer** | Aprox. millones (en descenso) | ❌ Registro de apps nuevas cerrado (2024) | ❌ No viable |
| **YouTube Music / Amazon Music** | Grandes | ❌ Sin API de escritura para terceros | ❌ No viable |
| **SoundCloud** | Niche (creadores) | ⚠️ API permite crear playlists | ⚠️ Poco solape con el público de "migrar mi Spotify" |
| **Self-hosted (Navidrome / Subsonic API)** | Niche técnico | ✅ Subsonic API crea playlists | ✅ Gratis y afín a la ética del proyecto, pero mercado pequeño |

### 5.2 El dato que cambia la decisión

**Apple Music ya ofrece importación nativa de playlists de Spotify y YouTube Music desde 2025** (herramienta propia, en colaboración con SongShift; fuente: Wikipedia EN, "Apple Music"). Es decir: el mayor destino por usuarios **ya resuelve el problema gratis y de fábrica**. Añadirlo a TuneHop competiría contra el propio dueño de la plataforma, con coste (99 USD/año + OAuth MusicKit complejo) y sin diferenciación clara para una desarrolladora sola.

### 5.3 Conclusión

**El mercado no se gana añadiendo destinos; se gana ampliando el público.** Los destinos con API abierta que una sola persona puede integrar son TIDAL (hecho), self-hosted (nicho gratuito) y, con coste y complejidad, Apple Music (cuya app ya lo ofrece). Qobuz no es viable (sin API). Si el objetivo es más usuarios, la palanca está en la **distribución / posicionamiento** y en terminar las puertas pendientes, no en más destinos.

> **SUPUESTOS** (a confirmar si el estudio avanza): cifras de TIDAL/Deezer aproximadas, no verificadas con fuente primaria. Cifra de Apple Music (94 M) citada de Wikipedia (ago-2025). Antes de decidir, re-verificar.
