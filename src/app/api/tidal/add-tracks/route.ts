import { getValidUserAccessToken } from "@/lib/tidal-auth";
import { addTracksToPlaylist } from "@/lib/tidal";

export async function POST(request: Request) {
  const userToken = await getValidUserAccessToken();
  if (!userToken) {
    return Response.json({ error: "No autenticado en TIDAL" }, { status: 401 });
  }

  const { playlistId, trackIds } = await request.json();

  if (!playlistId || !trackIds?.length) {
    return Response.json({ error: "Faltan parámetros" }, { status: 400 });
  }

  try {
    const success = await addTracksToPlaylist(userToken, playlistId, trackIds);
    return Response.json({ success, added: success ? trackIds.length : 0, failed: success ? 0 : trackIds.length });
  } catch (err) {
    console.error("Add tracks error:", err);
    return Response.json({ error: "Error añadiendo tracks" }, { status: 500 });
  }
}
