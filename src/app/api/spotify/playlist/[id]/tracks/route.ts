import { getSpotifyPlaylists, getAllPlaylistTracks } from "@/lib/spotify";
import { isValidSpotifyPlaylistId } from "@/lib/guardrails";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Guardrail: validar formato del ID antes de tocar la API (previene inyección en URL)
  if (!isValidSpotifyPlaylistId(id)) {
    return Response.json({ error: "ID de playlist inválido" }, { status: 400 });
  }

  try {
    const tracks = await getAllPlaylistTracks(id);
    return Response.json({ tracks });
  } catch (err) {
    console.error("Error fetching playlist tracks:", err);
    return Response.json({ error: "No se pudieron obtener las canciones" }, { status: 500 });
  }
}