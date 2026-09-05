import { getValidAccessToken } from "@/lib/spotify-auth";
import { getValidUserAccessToken } from "@/lib/tidal-auth";

const SPOTIFY_API = "https://api.spotify.com/v1";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const playlistId = url.searchParams.get("playlistId");

  const info: Record<string, unknown> = {};

  const spotifyToken = await getValidAccessToken();
  info.spotifyTokenValido = spotifyToken !== null;
  if (!spotifyToken) return Response.json({ ...info, error: "NO_SPOTIFY_TOKEN" });

  if (!playlistId) {
    // Listar TODAS las playlists
    const playlists: { id: string; name: string; tracks_total: number; owner: string }[] = [];
    let nextUrl: string | null = `${SPOTIFY_API}/me/playlists?limit=50`;
    while (nextUrl) {
      const plRes = await fetch(nextUrl, { headers: { Authorization: `Bearer ${spotifyToken}` } });
      if (!plRes.ok) break;
      const plData: { items?: Array<{ id: string; name: string; tracks?: { total: number }; items?: { total: number }; owner?: { display_name?: string } }>; next?: string } = await plRes.json();
      for (const p of plData.items ?? []) {
        playlists.push({
          id: p.id,
          name: p.name,
          tracks_total: p.tracks?.total ?? p.items?.total ?? 0,
          owner: String(p.owner?.display_name ?? "?"),
        });
      }
      nextUrl = plData.next ?? null;
    }
    // Buscar "x" específicamente
    const miPlaylist = playlists.find((p) => p.name === "x");
    info.totalPlaylists = playlists.length;
    info.todasLasPlaylists = playlists;
    info.buscarX = miPlaylist ?? "NO_ENCONTRADA (¿el nombre exacto es otro?)";
    return Response.json(info);
  }

  // Con playlistId: diagnóstico completo ISRC → TIDAL
  const tracksRes = await fetch(
    `${SPOTIFY_API}/playlists/${playlistId}/tracks?limit=10&fields=items(track(id,name,external_ids,external_ids(isrc),artists(name))),next`,
    { headers: { Authorization: `Bearer ${spotifyToken}` } }
  );
  info.spotifyTracksStatus = tracksRes.status;
  info.spotifyScopeHeader = tracksRes.headers.get("spotify-scope");

  let tracksData: any;
  try {
    tracksData = await tracksRes.json();
  } catch {
    tracksData = null;
  }

  if (!tracksRes.ok) {
    info.spotifyTracksErrorBody = tracksData;
    return Response.json(info);
  }

  const tracks = (tracksData.items ?? [])
    .filter((item: any) => item.track != null)
    .map((item: any) => ({
      id: item.track.id,
      name: item.track.name,
      external_ids_raw: item.track.external_ids,
      isrc: item.track.external_ids?.isrc ?? null,
      artists: item.track.artists?.map((a: any) => a.name),
    }));
  info.totalTracks = tracks.length;
  info.tracks = tracks;

  // Test TIDAL
  const tidalToken = await getValidUserAccessToken();
  info.tidalTokenValido = tidalToken !== null;
  if (tidalToken) {
    const results = [];
    for (const track of tracks) {
      if (!track.isrc) {
        results.push({ track: track.name, isrc: null, resultado: "SIN_ISRC" });
        continue;
      }
      try {
        const res = await fetch(
          `https://openapi.tidal.com/v2/tracks?filter[isrc]=${track.isrc}&countryCode=US`,
          { headers: { Authorization: `Bearer ${tidalToken}` } }
        );
        const body = await res.json();
        results.push({
          track: track.name,
          isrc: track.isrc,
          tidalStatus: res.status,
          matchCount: body.data?.length ?? 0,
          firstId: body.data?.[0]?.id ?? null,
        });
      } catch (err: any) {
        results.push({ track: track.name, isrc: track.isrc, error: err.message });
      }
      await new Promise((r) => setTimeout(r, 200));
    }
    info.tidalResults = results;
  }

  return Response.json(info);
}
