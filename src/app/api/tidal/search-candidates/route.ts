import { searchTrackCandidates } from "@/lib/tidal";
import { isSafeSearchQuery, validateCandidates } from "@/lib/guardrails";
import { logStart } from "@/lib/logger";

export async function GET(request: Request) {
  const done = logStart("/api/tidal/search-candidates", request);
  const url = new URL(request.url);
  const name = url.searchParams.get("name");
  const artist = url.searchParams.get("artist");
  const rawLimit = url.searchParams.get("limit");

  if (!name || !artist) {
    done(400, { error: "missing_params" });
    return Response.json({ error: "name y artist requeridos" }, { status: 400 });
  }

  // Guardrail: nombres con inyección de prompt no entran a la búsqueda
  if (!isSafeSearchQuery(name) || !isSafeSearchQuery(artist)) {
    done(400, { error: "unsafe_query" });
    return Response.json({ error: "Contenido no permitido" }, { status: 400 });
  }

  // Guardrail: limit clampado a 2-5 (evita saturación de contexto)
  const parsed = parseInt(rawLimit ?? "3", 10);
  const limit = Number.isNaN(parsed) ? 3 : Math.min(5, Math.max(2, parsed));

  try {
    const candidates = await searchTrackCandidates(name.trim(), artist.trim(), limit);
    // Guardrail: validar estructura de salida antes de devolver
    if (!validateCandidates(candidates)) {
      done(502, { error: "malformed_response" });
      return Response.json({ error: "Respuesta de TIDAL malformada" }, { status: 502 });
    }
    done(200, { candidates: candidates.length });
    return Response.json({ candidates });
  } catch (err) {
    done(500, { error: "search_failed" });
    return Response.json({ error: "Error en la búsqueda" }, { status: 500 });
  }
}