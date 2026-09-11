import { searchTrackByISRC } from "@/lib/tidal";
import { isValidISRC, checkRateLimit } from "@/lib/guardrails";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const isrc = url.searchParams.get("isrc");

  // Rate limit: 60 búsquedas/min por IP (evita abuso de cuota TIDAL)
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = checkRateLimit(`search:${ip}`, 60, 60_000);
  if (!rl.allowed) {
    return Response.json({ error: "Demasiadas peticiones. Inténtalo en un minuto." }, { status: 429 });
  }

  if (!isrc) {
    return Response.json({ error: "ISRC requerido" }, { status: 400 });
  }

  // Guardrail: el ISRC debe tener formato válido (12 chars) antes de tocar la API externa
  if (!isValidISRC(isrc)) {
    return Response.json({ error: "ISRC con formato inválido" }, { status: 400 });
  }

  try {
    const result = await searchTrackByISRC(isrc);
    if (result) {
      return Response.json({ tidalId: result.tidalId, title: result.title, artist: result.artist });
    }
    return Response.json({ tidalId: null }, { status: 404 });
  } catch (err) {
    console.error("TIDAL search error:", err);
    return Response.json({ error: "Error en la búsqueda" }, { status: 500 });
  }
}