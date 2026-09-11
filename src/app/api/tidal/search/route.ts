import { searchTrackByISRC } from "@/lib/tidal";
import { isValidISRC, checkRateLimit } from "@/lib/guardrails";
import { logStart } from "@/lib/logger";

export async function GET(request: Request) {
  const done = logStart("/api/tidal/search", request);
  const url = new URL(request.url);
  const isrc = url.searchParams.get("isrc");

  // Rate limit: 60 búsquedas/min por IP (evita abuso de cuota TIDAL)
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = checkRateLimit(`search:${ip}`, 60, 60_000);
  if (!rl.allowed) {
    done(429, { error: "rate_limited" });
    return Response.json({ error: "Demasiadas peticiones. Inténtalo en un minuto." }, { status: 429 });
  }

  if (!isrc) {
    done(400, { error: "missing_isrc" });
    return Response.json({ error: "ISRC requerido" }, { status: 400 });
  }

  // Guardrail: el ISRC debe tener formato válido (12 chars) antes de tocar la API externa
  if (!isValidISRC(isrc)) {
    done(400, { error: "invalid_isrc" });
    return Response.json({ error: "ISRC con formato inválido" }, { status: 400 });
  }

  try {
    const result = await searchTrackByISRC(isrc);
    if (result) {
      done(200, { found: true });
      return Response.json({ tidalId: result.tidalId, title: result.title, artist: result.artist });
    }
    done(404, { found: false });
    return Response.json({ tidalId: null }, { status: 404 });
  } catch (err) {
    done(500, { error: "search_failed" });
    return Response.json({ error: "Error en la búsqueda" }, { status: 500 });
  }
}