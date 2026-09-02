import { getValidUserAccessToken } from "@/lib/tidal-auth";
import { createPlaylist, addTracksToPlaylistBatched } from "@/lib/tidal";

export async function POST(request: Request) {
  const userToken = await getValidUserAccessToken();
  if (!userToken) {
    return Response.json({ error: "No autenticado en TIDAL" }, { status: 401 });
  }

  const { title, description, trackIds } = await request.json();

  if (!trackIds || trackIds.length === 0) {
    return Response.json({ error: "No hay tracks para añadir" }, { status: 400 });
  }

  try {
    const playlistId = await createPlaylist(userToken, title, description);
    if (!playlistId) {
      return Response.json({ error: "Error creando playlist en TIDAL" }, { status: 500 });
    }

    const result = await addTracksToPlaylistBatched(userToken, playlistId, trackIds);

    return Response.json({
      id: playlistId,
      added: result.added,
      failed: result.failed,
    });
  } catch (err) {
    console.error("Create playlist error:", err);
    return Response.json({ error: "Error interno" }, { status: 500 });
  }
}
