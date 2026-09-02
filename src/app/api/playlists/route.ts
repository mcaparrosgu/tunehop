import { getSpotifyPlaylists } from "@/lib/spotify";

export async function GET() {
  try {
    const playlists = await getSpotifyPlaylists();
    return Response.json({ playlists });
  } catch (err) {
    console.error("Error fetching playlists:", err);
    return Response.json({ error: "No se pudieron obtener las playlists" }, { status: 500 });
  }
}