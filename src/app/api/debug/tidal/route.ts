import { getValidAccessToken } from "@/lib/spotify-auth";
import { getValidUserAccessToken } from "@/lib/tidal-auth";

const SPOTIFY_API = "https://api.spotify.com/v1";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const playlistId = url.searchParams.get("playlistId");

  const info: Record<string, unknown> = {};

  // 1. Token Spotify
  const spotifyToken = await getValidAccessToken();
  info.spotifyTokenValido = spotifyToken !== null;

  if (!spotifyToken) {
    return Response.json({ ...info, error: "NO_SPOTIFY_TOKEN" });
  }

  if (!playlistId) {
    // Sin playlistId: listar playlists para que elijamos una
    const res = await fetch(`${SPOTIFY_API}/me/playlists?limit=5`, {
      headers: { Authorization: `Bearer ${spotifyToken}` },
    });
    const data = await res.json();
    info.spotifyPlaylists = data.items?.map((p: any) => ({
      id: p.id,
      name: p.name,
      tracks_total: p.tracks?.total ?? p.items?.total ?? "unknown",
    }));
    return Response.json({
      ...info,
      instruccion: "Abre esta URL de nuevo añadiendo ?playlistId=XXXXX con el ID de una playlist pequeña",
    });
  }

  // 2. Obtener tracks de la playlist con campos detallados
  const tracksRes = await fetch(
    `${SPOTIFY_API}/playlists/${playlistId}/tracks?limit=5&fields=items(track(id,name,external_ids,external_ids(isrc),artists(name))),next`,
    { headers: { Authorization: `Bearer ${spotifyToken}` } }
  );
  const tracksData = await tracksRes.json();
  info.spotifyTracksStatus = tracksRes.status;

  const tracks = (tracksData.items ?? []).map((item: any) => ({
    id: item.track?.id,
    name: item.track?.name,
    external_ids_raw: item.track?.external_ids,
    isrc_from_raw: item.track?.external_ids?.isrc,
    artists: item.track?.artists?.map((a: any) => a.name),
  }));
  info.tracks = tracks;

  // 3. Test ISRC en TIDAL para cada track
  const tidalToken = await getValidUserAccessToken();
  info.tidalTokenValido = tidalToken !== null;

  if (tidalToken) {
    const tidalResults = [];
    for (const track of tracks) {
      if (!track.isrc_from_raw) {
        tidalResults.push({ track: track.name, isrc: null, tidalStatus: "NO_ISRC" });
        continue;
      }
      try {
        const tidalRes = await fetch(
          `https://openapi.tidal.com/v2/tracks?filter[isrc]=${track.isrc_from_raw}&countryCode=US`,
          { headers: { Authorization: `Bearer ${tidalToken}` } }
        );
        const tidalBody = await tidalRes.json();
        tidalResults.push({
          track: track.name,
          isrc: track.isrc_from_raw,
          tidalStatus: tidalRes.status,
          tidalMatchCount: tidalBody.data?.length ?? 0,
          firstMatchId: tidalBody.data?.[0]?.id ?? null,
        });
      } catch (err: any) {
        tidalResults.push({ track: track.name, isrc: track.isrc_from_raw, tidalError: err.message });
      }
      await new Promise((r) => setTimeout(r, 200));
    }
    info.tidalResults = tidalResults;
  }

  return Response.json(info);
}
