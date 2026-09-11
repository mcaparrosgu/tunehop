import { getValidUserAccessToken } from "@/lib/tidal-auth";
import { createPlaylist } from "@/lib/tidal";
import { sanitizePlaylistName, isSafePlaylistName } from "@/lib/guardrails";
import { logStart } from "@/lib/logger";

export async function POST(request: Request) {
  const done = logStart("/api/tidal/create-playlist", request);
  const userToken = await getValidUserAccessToken();
  if (!userToken) {
    done(401, { error: "not_authenticated" });
    return Response.json({ error: "No autenticado en TIDAL" }, { status: 401 });
  }

  const body = await request.json();
  const rawTitle = typeof body?.title === "string" ? body.title : "";
  const rawDescription = typeof body?.description === "string" ? body.description : "";

  // Guardrail: sanitizar título (chars de control, espacios, longitud máx 100) y bloquear spam/phishing
  const title = sanitizePlaylistName(rawTitle, 100);
  if (!title || !isSafePlaylistName(title)) {
    done(400, { error: "unsafe_title" });
    return Response.json({ error: "Título de playlist no permitido" }, { status: 400 });
  }
  const description = sanitizePlaylistName(rawDescription, 300);

  try {
    const playlistId = await createPlaylist(userToken, title, description);
    if (!playlistId) {
      done(500, { error: "create_failed" });
      return Response.json({ error: "Error creando playlist en TIDAL" }, { status: 500 });
    }
    done(201, { playlistId });
    return Response.json({ id: playlistId });
  } catch (err) {
    done(500, { error: "create_failed" });
    return Response.json({ error: "Error interno" }, { status: 500 });
  }
}