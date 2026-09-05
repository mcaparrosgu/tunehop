import { getValidAccessToken } from "@/lib/spotify-auth";
import { getValidUserAccessToken } from "@/lib/tidal-auth";

const SPOTIFY_API = "https://api.spotify.com/v1";

/** Extrae el track de un item de playlist, soportando esquema nuevo (item) y viejo (track). */
function extractTrack(entry: any): { id: string; name: string; isrc: string | null; artists: string[]; external_ids_raw: unknown } | null {
  const track = entry?.item ?? entry?.track;
  if (!track || !track.id) return null;
  return {
    id: track.id,
    name: track.name,
    external_ids_raw: track.external_ids,
    isrc: track.external_ids?.isrc ?? null,
    artists: track.artists?.map((a: any) => a.name) ?? [],
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const playlistId = url.searchParams.get("playlistId");

  const info: Record<string, unknown> = {};

  const spotifyToken = await getValidAccessToken();
  info.spotifyTokenValido = spotifyToken !== null;
  if (!spotifyToken) return Response.json({ ...info, error: "NO_SPOTIFY_TOKEN" });

  if (!playlistId) {
    // Listar TODAS las playlists
    const playlists: { id: string; name: string; totalTracks: number; owner: string }[] = [];
    let nextUrl: string | null = `${SPOTIFY_API}/me/playlists?limit=50`;
    while (nextUrl) {
      const plRes: Response = await fetch(nextUrl, { headers: { Authorization: `Bearer ${spotifyToken}` } });
      if (!plRes.ok) break;
      const plData: { items?: Array<{ id: string; name: string; tracks?: { total: number }; items?: { total: number }; owner?: { display_name?: string } }>; next?: string } = await plRes.json();
      for (const p of plData.items ?? []) {
        playlists.push({
          id: p.id,
          name: p.name,
          totalTracks: p.tracks?.total ?? p.items?.total ?? 0,
          owner: String(p.owner?.display_name ?? "?"),
        });
      }
      nextUrl = plData.next ?? null;
    }
    info.totalPlaylists = playlists.length;
    info.todasLasPlaylists = playlists;
    return Response.json(info);
  }

  // Con playlistId: diagnosticar tracks + TIDAL ISRC
  const tracksRes = await fetch(
    `${SPOTIFY_API}/playlists/${playlistId}/items?limit=10`,
    { headers: { Authorization: `Bearer ${spotifyToken}` } }
  );
  info.spotifyTracksStatus = tracksRes.status;

  if (!tracksRes.ok) {
    let errorBody: any = null;
    try { errorBody = await tracksRes.json(); } catch { /* ignore */ }
    info.spotifyTracksErrorBody = errorBody;
    return Response.json(info);
  }

  const tracksData = await tracksRes.json();
  const tracks = (tracksData.items ?? [])
    .map(extractTrack)
    .filter((t: any) => t !== null);
  info.totalTracks = tracks.length;
  info.spotifyTotal = tracksData.total;
  info.tracks = tracks;

  // Test TIDAL con ISRC
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
