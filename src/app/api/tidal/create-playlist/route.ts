import { getValidUserAccessToken } from "@/lib/tidal-auth";
import { createPlaylist } from "@/lib/tidal";

export async function POST(request: Request) {
  const userToken = await getValidUserAccessToken();
  if (!userToken) {
    return Response.json({ error: "No autenticado en TIDAL" }, { status: 401 });
  }

  const { title, description } = await request.json();

  try {
    const playlistId = await createPlaylist(userToken, title, description);
    if (!playlistId) {
      return Response.json({ error: "Error creando playlist en TIDAL" }, { status: 500 });
    }

    return Response.json({ id: playlistId });
  } catch (err) {
    console.error("Create playlist error:", err);
    return Response.json({ error: "Error interno" }, { status: 500 });
  }
}
