import { getValidUserAccessToken } from "@/lib/tidal-auth";
import { createPlaylist } from "@/lib/tidal";
import { sanitizePlaylistName, isSafePlaylistName } from "@/lib/guardrails";

export async function POST(request: Request) {
  const userToken = await getValidUserAccessToken();
  if (!userToken) {
    return Response.json({ error: "No autenticado en TIDAL" }, { status: 401 });
  }

  const body = await request.json();
  const rawTitle = typeof body?.title === "string" ? body.title : "";
  const rawDescription = typeof body?.description === "string" ? body.description : "";

  // Guardrail: sanitizar título (chars de control, espacios, longitud máx 100) y bloquear spam/phishing
  const title = sanitizePlaylistName(rawTitle, 100);
  if (!title || !isSafePlaylistName(title)) {
    return Response.json({ error: "Título de playlist no permitido" }, { status: 400 });
  }
  const description = sanitizePlaylistName(rawDescription, 300);

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