import { searchTrackByISRC } from "@/lib/tidal";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const isrc = url.searchParams.get("isrc");

  if (!isrc) {
    return Response.json({ error: "ISRC requerido" }, { status: 400 });
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