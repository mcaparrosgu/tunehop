import { searchTrackByName } from "@/lib/tidal";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const name = url.searchParams.get("name");
  const artist = url.searchParams.get("artist");

  if (!name || !artist) {
    return Response.json({ error: "name y artist requeridos" }, { status: 400 });
  }

  try {
    const result = await searchTrackByName(name, artist);
    if (result) {
      return Response.json({ tidalId: result.tidalId, title: result.title, artist: result.artist });
    }
    return Response.json({ tidalId: null }, { status: 404 });
  } catch (err) {
    console.error("TIDAL search by name error:", err);
    return Response.json({ error: "Error en la búsqueda" }, { status: 500 });
  }
}
