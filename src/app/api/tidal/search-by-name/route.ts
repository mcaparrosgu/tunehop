import { searchTrackByName } from "@/lib/tidal";
import { isSafeSearchQuery } from "@/lib/guardrails";
import { logStart } from "@/lib/logger";

export async function GET(request: Request) {
  const done = logStart("/api/tidal/search-by-name", request);
  const url = new URL(request.url);
  const name = url.searchParams.get("name");
  const artist = url.searchParams.get("artist");

  if (!name || !artist) {
    done(400, { error: "missing_params" });
    return Response.json({ error: "name y artist requeridos" }, { status: 400 });
  }

  // Guardrail: nombres con inyección de prompt no entran a la búsqueda
  if (!isSafeSearchQuery(name) || !isSafeSearchQuery(artist)) {
    done(400, { error: "unsafe_query" });
    return Response.json({ error: "Contenido no permitido" }, { status: 400 });
  }

  try {
    const result = await searchTrackByName(name.trim(), artist.trim());
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