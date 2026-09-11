import { getSpotifyPlaylists, getAllPlaylistTracks } from "@/lib/spotify";
import { isValidSpotifyPlaylistId } from "@/lib/guardrails";
import { logStart } from "@/lib/logger";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const done = logStart("/api/spotify/playlist/[id]/tracks", request);
  const { id } = await params;

  // Guardrail: validar formato del ID antes de tocar la API (previene inyección en URL)
  if (!isValidSpotifyPlaylistId(id)) {
    done(400, { error: "invalid_playlist_id" });
    return Response.json({ error: "ID de playlist inválido" }, { status: 400 });
  }

  try {
    const tracks = await getAllPlaylistTracks(id);
    done(200, { trackCount: tracks.length });
    return Response.json({ tracks });
  } catch (err) {
    done(500, { error: "fetch_failed" });
    return Response.json({ error: "No se pudieron obtener las canciones" }, { status: 500 });
  }
}