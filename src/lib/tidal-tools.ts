/**
 * TuneHop — Herramientas (tools) para el Matching Assistant IA
 *
 * Diseño poka-yoke: los parámetros son inconfundibles, el tipado obliga
 * a usarlos bien, y la respuesta está truncada para no llenar contexto.
 * Estas herramientas NO modifican datos (solo lectura), riesgo BAJO.
 *
 * IMPORTANTE: La IA actual del MVP es revisión manual humana.
 * Estas tools están listas para cuando se active el fallback IA (Paso 11/12).
 */

import { searchTrackByISRC, searchTrackByName, searchTrackCandidates, type TidalMatch } from "./tidal";

/* ============================================================
   1. SEARCH_BY_ISRC — Búsqueda exacta por código universal
   ============================================================ */
/**
 * NOMBRE: search_by_isrc
 *
 * DESCRIPCIÓN: Busca una canción en TIDAL usando su ISRC (International
 * Standard Recording Code). Es la forma MÁS EXACTA de encontrar una canción:
 * el ISRC identifica una grabación concreta (misma master, misma duración).
 *
 * CUÁNDO USAR: Siempre que tengas el ISRC de la canción original (viene de
 * Spotify en los metadatos de la playlist). Es el primer intento, antes
 * que buscar por nombre.
 *
 * CUÁNDO NO USAR: Si no tienes ISRC (canciones muy antiguas, bootlegs,
 * grabaciones caseras). En ese caso usa `search_by_name`.
 *
 * PARÁMETROS:
 *   - isrc: string (obligatorio) — Código ISRC de 12 caracteres alfanuméricos.
 *     Formato: 2 letras país + 3 alfanuméricos registrante + 2 dígitos año + 5 dígitos designación.
 *     Ej: "USRC17607839", "GBARL1800001".
 *
 * EJEMPLO CORRECTO:
 *   search_by_isrc({ isrc: "USRC17607839" })
 *
 * EJEMPLO INCORRECTO FRECUENTE:
 *   search_by_isrc({ isrc: "Bohemian Rhapsody Queen" })  // ❌ Eso es nombre, no ISRC
 *   search_by_isrc({ isrc: "usrc17607839extra" })        // ❌ Largo inválido
 *
 * QUÉ DEVUELVE:
 *   - Éxito: { tidalId: string, title: string, artist: string }
 *   - No encontrado: null
 *   - Error de red/rate limit: null (la app reintenta con backoff)
 *
 * DISEÑO A PRUEBA DE ERRORES (poka-yoke):
 * - Parámetro único `isrc` (string) — imposible confundir con nombre/artista.
 * - Validación implícita: la API de TIDAL rechaza ISRCs malformados (400/404).
 * - Sin parámetros opcionales que puedan omitirse por error.
 * - Devuelve solo lo necesario (id, título, artista) — sin metadata extra que llene contexto.
 *
 * NIVEL DE RIESGO: BAJO — Solo lectura, no modifica datos, idempotente.
 */
export async function searchByISRCTool(isrc: string): Promise<TidalMatch | null> {
  // Validación ligera de formato (poka-yoke adicional)
  if (!isrc || typeof isrc !== "string" || isrc.length !== 12) {
    return null;
  }
  return searchTrackByISRC(isrc.toUpperCase());
}

/* ============================================================
   2. SEARCH_BY_NAME — Búsqueda por nombre y artista (fallback 1)
   ============================================================ */
/**
 * NOMBRE: search_by_name
 *
 * DESCRIPCIÓN: Busca una canción en TIDAL por nombre y artista cuando
 * no hay ISRC o la búsqueda por ISRC falló. Usa el endpoint de búsqueda
 * de texto de TIDAL (`/searchResults` + detalles por IDs).
 *
 * CUÁNDO USAR:
 *   - La canción no tiene ISRC en los metadatos de Spotify.
 *   - `search_by_isrc` devolvió null (ISRC no coincide entre plataformas).
 *   - Es el segundo intento tras fallar ISRC.
 *
 * CUÁNDO NO USAR:
 *   - Si tienes ISRC válido → usa `search_by_isrc` (más preciso).
 *   - Si esperas múltiples candidatos para que el usuario elija → usa `search_candidates`.
 *
 * PARÁMETROS:
 *   - name: string (obligatorio) — Título de la canción. Ej: "Bohemian Rhapsody"
 *   - artist: string (obligatorio) — Nombre del artista principal. Ej: "Queen"
 *
 * EJEMPLO CORRECTO:
 *   search_by_name({ name: "Bohemian Rhapsody", artist: "Queen" })
 *
 * EJEMPLO INCORRECTO FRECUENTE:
 *   search_by_name({ name: "Queen Bohemian Rhapsody", artist: "" })  // ❌ artist vacío
 *   search_by_name({ name: "", artist: "Queen" })                    // ❌ name vacío
 *   search_by_name({ name: "Bohemian Rhapsody Queen" })              // ❌ artist faltante
 *
 * QUÉ DEVUELVE:
 *   - Éxito: { tidalId: string, title: string, artist: string }
 *   - No encontrado: null
 *   - Error de red/rate limit: null
 *
 * DISEÑO A PRUEBA DE ERRORES (poka-yoke):
 * - Dos parámetros obligatorios con nombres distintivos (`name`, `artist`) —
 *   el tipado TypeScript obliga a pasar ambos; imposible omitir uno.
 * - Orden fijo en la definición (name primero, artist segundo) — coherente
 *   con cómo se piensa: "busca X de Y".
 * - Limpieza interna de caracteres problemáticos (paréntesis, comillas) —
 *   la IA no tiene que sanear la query.
 * - Devuelve un solo match (el mejor) — para decisión binaria (sí/no),
 *   no lista que la IA tenga que procesar.
 *
 * NIVEL DE RIESGO: BAJO — Solo lectura, idempotente, sin efectos laterales.
 */
export async function searchByNameTool(name: string, artist: string): Promise<TidalMatch | null> {
  if (!name?.trim() || !artist?.trim()) {
    return null;
  }
  return searchTrackByName(name.trim(), artist.trim());
}

/* ============================================================
   3. SEARCH_CANDIDATES — Múltiples candidatos para decisión humana/IA
   ============================================================ */
/**
 * NOMBRE: search_candidates
 *
 * DESCRIPCIÓN: Obtiene hasta N candidatos (típicamente 3–5) de TIDAL para
 * una canción dada por nombre y artista. Se usa cuando `search_by_name`
 * encuentra múltiples resultados plausibles y se necesita que un decisor
 * (IA o humano) elija el mejor. Devuelve título, artista y tidalId de cada
 * candidato para comparar.
 *
 * CUÁNDO USAR:
 *   - `search_by_name` sugiere que hay ambigüedad (múltiples versiones).
 *   - El system prompt del Matching Assistant necesita comparar candidatos.
 *   - La pantalla de revisión manual muestra opciones al usuario.
 *
 * CUÁNDO NO USAR:
 *   - Para decisión binaria sí/no → usa `search_by_name` (más simple).
 *   - Si tienes ISRC → `search_by_isrc` (más exacto).
 *
 * PARÁMETROS:
 *   - name: string (obligatorio) — Título de la canción.
 *   - artist: string (obligatorio) — Nombre del artista principal.
 *   - limit?: number (opcional, default 3, máx 5) — Cuántos candidatos devolver.
 *     Valores válidos: 2, 3, 4, 5. Más de 5 llena contexto sin ganar precisión.
 *
 * EJEMPLO CORRECTO:
 *   search_candidates({ name: "Hallelujah", artist: "Leonard Cohen", limit: 3 })
 *
 * EJEMPLO INCORRECTO FRECUENTE:
 *   search_candidates({ name: "Hallelujah", artist: "Leonard Cohen", limit: 20 })  // ❌ limit > 5
 *   search_candidates({ name: "Hallelujah", limit: 3 })                              // ❌ artist faltante
 *
 * QUÉ DEVUELVE:
 *   - Éxito: { candidates: [{ tidalId, title, artist }, ...] } (array 0–N items)
 *   - Sin resultados: { candidates: [] }
 *   - Error: { candidates: [] }
 *
 * DISEÑO A PRUEBA DE ERRORES (poka-yoke):
 * - `limit` con default 3 y clamp interno (máx 5) — la IA no puede pedir 50.
 * - Mismos parámetros base que `search_by_name` + `limit` opcional —
 *   interfaz consistente, fácil de recordar.
 * - Devuelve array plano de objetos simples — fácil de iterar en el prompt.
 * - Clave de respuesta siempre `candidates` — predecible para parsing.
 *
 * NIVEL DE RIESGO: BAJO — Solo lectura, idempotente, control de tamaño de respuesta.
 */
export async function searchCandidatesTool(
  name: string,
  artist: string,
  limit = 3
): Promise<{ candidates: TidalMatch[] }> {
  if (!name?.trim() || !artist?.trim()) {
    return { candidates: [] };
  }
  const safeLimit = Math.min(Math.max(limit, 2), 5); // clamp 2–5
  const candidates = await searchTrackCandidates(name.trim(), artist.trim(), safeLimit);
  return { candidates };
}

/* ============================================================
   RESUMEN DE HERRAMIENTAS PARA EL AGENTE
   ============================================================ */
export const TIDAL_TOOLS = [
  {
    name: "search_by_isrc",
    description: "Busca canción en TIDAL por ISRC (código exacto). Úsalo SIEMPRE que tengas ISRC — es el método más preciso.",
    parameters: {
      type: "object",
      properties: {
        isrc: { type: "string", description: "Código ISRC de 12 chars (ej: USRC17607839)" },
      },
      required: ["isrc"],
      additionalProperties: false,
    },
    returns: "TidalMatch | null",
    risk: "LOW",
  },
  {
    name: "search_by_name",
    description: "Busca canción en TIDAL por nombre y artista (fallback cuando no hay ISRC o falla ISRC). Devuelve el mejor match único.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Título de la canción" },
        artist: { type: "string", description: "Artista principal" },
      },
      required: ["name", "artist"],
      additionalProperties: false,
    },
    returns: "TidalMatch | null",
    risk: "LOW",
  },
  {
    name: "search_candidates",
    description: "Obtiene hasta 5 candidatos por nombre/artista para decisión (IA o humano). Úsalo cuando hay ambigüedad y necesitas comparar opciones.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Título de la canción" },
        artist: { type: "string", description: "Artista principal" },
        limit: { type: "integer", minimum: 2, maximum: 5, default: 3, description: "Nº de candidatos (2–5)" },
      },
      required: ["name", "artist"],
      additionalProperties: false,
    },
    returns: "{ candidates: TidalMatch[] }",
    risk: "LOW",
  },
] as const;