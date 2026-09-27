# Estado del proyecto TuneHop — 2026-09-27

## Dónde estamos

**MVP completo + Puerta 4 implementada.**

La app pública funciona sin la API de Spotify: el usuario exporta su playlist a CSV (Exportify), la sube, conecta TIDAL y migra.

## Lo que funciona (probado)

| Puerta | Flujo | Estado |
|---|---|---|
| 1. Beta cerrada | Home → Spotify → /playlists → /destino → /migrando | ✅ Funciona (5 usuarios) |
| 4. Archivo | Home → /archivo → sube CSV → /destino → /migrando | ✅ Funciona |

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
| 1 | Probar Puerta 4 con CSV real de Exportify **en el navegador** (parser y contratos TIDAL ya validados) | `/es/archivo` en Vercel |
| 2 | Paso 19: case study (`docs/case-study.md`) | Skill `paso-19-case-study` |
| 3 | Paso 20: memoria didáctica (`docs/memoria.md`) | Skill `paso-20-memoria` |
| 4 | Puerta 5: playlist pública vía Client Credentials | `src/app/[locale]/publica/` |
| 5 | Puerta 2: login propio + guía `/setup` | `src/app/[locale]/setup/` |
| 6 | JSON oficial "Descargar tus datos" de Spotify | Parser en `csv-parser.ts` |

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
