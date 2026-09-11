import { getValidUserAccessToken } from "@/lib/tidal-auth";
import { addTracksToPlaylist } from "@/lib/tidal";
import { validateTrackCount, isValidSpotifyPlaylistId } from "@/lib/guardrails";
import { logStart } from "@/lib/logger";

export async function POST(request: Request) {
  const done = logStart("/api/tidal/add-tracks", request);
  const userToken = await getValidUserAccessToken();
  if (!userToken) {
    done(401, { error: "not_authenticated" });
    return Response.json({ error: "No autenticado en TIDAL" }, { status: 401 });
  }

  const { playlistId, trackIds } = await request.json();

  if (!playlistId || !Array.isArray(trackIds) || trackIds.length === 0) {
    done(400, { error: "missing_params" });
    return Response.json({ error: "Faltan parámetros" }, { status: 400 });
  }

  // Guardrail: límite de tracks por migración (máx 10.000)
  const countCheck = validateTrackCount(trackIds.length);
  if (!countCheck.valid) {
    done(400, { error: "too_many_tracks", count: trackIds.length });
    return Response.json({ error: `Demasiados tracks (máx ${countCheck.limit})` }, { status: 400 });
  }

  try {
    const success = await addTracksToPlaylist(userToken, playlistId, trackIds);
    done(200, { success, added: trackIds.length });
    return Response.json({ success, added: success ? trackIds.length : 0, failed: success ? 0 : trackIds.length });
  } catch (err) {
    done(500, { error: "add_failed" });
    return Response.json({ error: "Error añadiendo tracks" }, { status: 500 });
  }
}