import { getSpotifyPlaylists, getAllPlaylistTracks } from "@/lib/spotify";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const tracks = await getAllPlaylistTracks(id);
    return Response.json({ tracks });
  } catch (err) {
    console.error("Error fetching playlist tracks:", err);
    return Response.json({ error: "No se pudieron obtener las canciones" }, { status: 500 });
  }
}