# Estado del proyecto TuneHop — 2026-09-27

## Dónde estamos

**MVP completo + Puerta 4 implementada.**

La app pública funciona sin la API de Spotify: el usuario exporta su playlist a CSV (Exportify), la sube, conecta TIDAL y migra.

## Lo que funciona (probado)

| Puerta | Flujo | Estado |
|---|---|---|
| 1. Beta cerrada | Home → Spotify → /playlists → /destino → /migrando | ✅ Funciona (5 usuarios) |
| 4. Archivo | Home → /archivo → sube CSV → /destino → /migrando | ✅ **Probada de extremo a extremo en producción** con CSV real de Exportify |

### Garantía de solo lectura en Spotify (verificado en código)

| Prueba | Dónde | Resultado |
|---|---|---|
| Permisos pedidos en el OAuth | `spotify-auth.ts` (`SCOPES`) | `playlist-read-private playlist-read-collaborative` → solo lectura |
| Llamadas a la API de Spotify | `spotify.ts` (`fetchWithAuth`) | `fetch` sin `method` → GET |
| Métodos de escritura a Spotify | `src/lib/spotify.ts` + `src/app/api/spotify/` | **Cero** POST/PUT/DELETE |

> TuneHop no puede modificar playlists de Spotify: no pide permiso para ello y no existe código que lo intente.

### Contratos de TIDAL validados contra la API real (2026-09-27)

| Contrato | Resultado |
|---|---|
| Batching por ISRC (`filter[isrc]` × N) | ✅ 3/3 ISRC válidos devueltos; inexistente ignorado sin error |
| Detalles por lote (`filter[id]=a,b,c` + `include=artists`) | ✅ Devuelve título y artista |
| Búsqueda por texto (`filter[query]`, fallback sin ISRC) | 🔧 **Estaba rota** (ruta + forma de respuesta) → arreglada |
| Parser con formato real completo de Exportify | ✅ Cubierto por test |

> La verificación se hizo **solo lectura** con token `client_credentials`: no se creó ni modificó nada en TIDAL.

## Qué queda pendiente (priorizado)

| Prioridad | Qué | Dónde empezar |
|---|---|---|
| 1 | Paso 19: case study (`docs/case-study.md`) | Skill `paso-19-case-study` |
| 2 | Paso 20: memoria didáctica (`docs/memoria.md`) | Skill `paso-20-memoria` |
| 3 | Puerta 5: playlist pública vía Client Credentials | `src/app/[locale]/publica/` |
| 4 | Puerta 2: login propio + guía `/setup` | `src/app/[locale]/setup/` |
| 5 | JSON oficial "Descargar tus datos" de Spotify | Parser en `csv-parser.ts` |

### Decisión: historial de migraciones (2026-09-27)

**Decidido: NO se implementa historial persistente (opción A).** El usuario ya puede descargar su informe (copiar resumen, CSV o JSON) con las canciones no migradas; ese fichero es suyo y no depende de TuneHop.

Motivo: un historial en servidor exigiría base de datos, cuentas y base jurídica RGPD, y rompería la promesa principal del proyecto (no persistir datos del usuario). Un historial en el navegador (`localStorage`) sería viable pero requeriría reformar `AGENTS.md` y la política de privacidad — se reevaluará si el producto tiene usuarios recurrentes que lo pidan.

> Nota técnica: los botones de informe (copiar/CSV/JSON) solo aparecen en la pantalla final cuando hay al menos una canción no migrada.

## Arquitectura de puertas

```
Motor único: lista → ISRC/fallback → TIDAL
  ├── Puerta 1: login Spotify (beta, 5 usuarios)
  ├── Puerta 2: login Spotify propio (BYO app) — pendiente
  ├── Puerta 4: subir archivo CSV — ✅ implementada
  ├── Puerta 5: enlace playlist pública (Client Credentials) — pendiente
  └── Puerta 6: open source + autoalojado — pendiente
```

## Datos clave

- **Repo**: https://github.com/mcaparrosgu/tunehop (branch `master`)
- **Producción**: https://tunehop.vercel.app
- **Ruta Puerta 4**: https://tunehop.vercel.app/es/archivo
- **CSV de prueba**: `docs/playlist-prueba.csv` (6 canciones, 5 con ISRC)
- **Tests**: 97 passing (13 del parser CSV + 4 de búsqueda TIDAL)
- **Build**: TypeScript limpio, Next.js 16.3.4

## Decisiones recientes (últimos commits)

1. `880919e` — Fix navegación: localStorage + `<a>` nativo para OAuth
2. `e973d04` — Quitar `external` del botón TIDAL (no bastó)
3. `49993de` — CSV de prueba para Puerta 4
4. `32646ff` — Puerta 4 implementada (parser, UI, migrando)
5. `0366c87` — Doc: modelo de puertas (hallazgo cuota Spotify)

## Reglas inmutables del proyecto

- **Solo LEE Spotify, solo ESCRIBE TIDAL.** Nunca modificar Spotify.
- **Nunca** escribir secretos en git.
- **Nunca** guardar datos personales de usuarios.
- Motor único, varias puertas. No cuatro productos.
