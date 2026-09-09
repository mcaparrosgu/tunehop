import { searchTrackCandidates } from "@/lib/tidal";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const name = url.searchParams.get("name");
  const artist = url.searchParams.get("artist");

  if (!name || !artist) {
    return Response.json({ error: "name y artist requeridos" }, { status: 400 });
  }

  try {
    const candidates = await searchTrackCandidates(name, artist);
    return Response.json({ candidates });
  } catch (err) {
    console.error("TIDAL candidates error:", err);
    return Response.json({ error: "Error en la búsqueda" }, { status: 500 });
  }
}