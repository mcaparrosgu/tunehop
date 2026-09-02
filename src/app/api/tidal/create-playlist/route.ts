import { getValidUserAccessToken } from "@/lib/tidal-auth";
import { getCurrentUserId, createPlaylist, addTracksToPlaylistBatched } from "@/lib/tidal";

export async function POST(request: Request) {
  const userToken = await getValidUserAccessToken();
  if (!userToken) {
    return Response.json({ error: "No autenticado en TIDAL" }, { status: 401 });
  }

  const userId = await getCurrentUserId(userToken);
  if (!userId) {
    return Response.json({ error: "No se pudo obtener el usuario de TIDAL" }, { status: 500 });
  }

  const { title, description, trackIds } = await request.json();

  if (!trackIds || trackIds.length === 0) {
    return Response.json({ error: "No hay tracks para añadir" }, { status: 400 });
  }

  try {
    // Crear playlist
    const playlistUuid = await createPlaylist(userToken, userId, title, description);
    if (!playlistUuid) {
      return Response.json({ error: "Error creando playlist en TIDAL" }, { status: 500 });
    }

    // Añadir tracks en batches
    const result = await addTracksToPlaylistBatched(userToken, playlistUuid, trackIds);

    return Response.json({
      uuid: playlistUuid,
      added: result.added,
      failed: result.failed,
    });
  } catch (err) {
    console.error("Create playlist error:", err);
    return Response.json({ error: "Error interno" }, { status: 500 });
  }
}