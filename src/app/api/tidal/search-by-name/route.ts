import { searchTrackByName } from "@/lib/tidal";
import { isSafeSearchQuery } from "@/lib/guardrails";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const name = url.searchParams.get("name");
  const artist = url.searchParams.get("artist");

  if (!name || !artist) {
    return Response.json({ error: "name y artist requeridos" }, { status: 400 });
  }

  // Guardrail: nombres con inyección de prompt no entran a la búsqueda
  if (!isSafeSearchQuery(name) || !isSafeSearchQuery(artist)) {
    return Response.json({ error: "Contenido no permitido" }, { status: 400 });
  }

  try {
    const result = await searchTrackByName(name.trim(), artist.trim());
    if (result) {
      return Response.json({ tidalId: result.tidalId, title: result.title, artist: result.artist });
    }
    return Response.json({ tidalId: null }, { status: 404 });
  } catch (err) {
    console.error("TIDAL search by name error:", err);
    return Response.json({ error: "Error en la búsqueda" }, { status: 500 });
  }
}