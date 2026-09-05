import { getValidAccessToken } from "@/lib/spotify-auth";
import { getValidUserAccessToken } from "@/lib/tidal-auth";

const SPOTIFY_API = "https://api.spotify.com/v1";

function extractTrack(entry: any): { id: string; name: string; isrc: string | null; artists: string[] } | null {
  const track = entry?.item ?? entry?.track;
  if (!track || !track.id) return null;
  return {
    id: track.id,
    name: track.name,
    isrc: track.external_ids?.isrc ?? null,
    artists: track.artists?.map((a: any) => a.name) ?? [],
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const playlistId = url.searchParams.get("playlistId");
  if (!playlistId) return Response.json({ error: "missing playlistId" });

  const info: Record<string, unknown> = {};

  const spotifyToken = await getValidAccessToken();
  info.spotifyTokenValido = spotifyToken !== null;
  if (!spotifyToken) return Response.json({ ...info, error: "NO_SPOTIFY_TOKEN" });

  // Fetch tracks using production code path
  const tracksRes = await fetch(`${SPOTIFY_API}/playlists/${playlistId}/items?limit=10`, { headers: { Authorization: `Bearer ${spotifyToken}` } });
  info.spotifyTracksStatus = tracksRes.status;
  if (!tracksRes.ok) {
    let err: any = null; try { err = await tracksRes.json(); } catch {}
    info.error = err;
    return Response.json(info);
  }

  const tracksData = await tracksRes.json();
  const tracks = (tracksData.items ?? []).map(extractTrack).filter((t: any) => t !== null);
  info.totalTracks = tracks.length;
  info.spotifyTotal = tracksData.total;
  info.tracks = tracks;

  // Test TIDAL
  const tidalToken = await getValidUserAccessToken();
  info.tidalTokenValido = tidalToken !== null;
  if (!tidalToken) return Response.json(info);

  const results = [];
  for (const track of tracks.slice(0, 3)) {
    if (!track.isrc) { results.push({ track: track.name, isrc: null, resultado: "SIN_ISRC" }); continue; }
    try {
      const res = await fetch(`https://openapi.tidal.com/v2/tracks?filter[isrc]=${track.isrc}&countryCode=US`, { headers: { Authorization: `Bearer ${tidalToken}` } });
      const body = await res.json();
      results.push({ track: track.name, isrc: track.isrc, tidalStatus: res.status, matchCount: body.data?.length ?? 0, firstId: body.data?.[0]?.id ?? null, bodyKeys: Object.keys(body), error: body.errors ?? null });
    } catch (err: any) { results.push({ track: track.name, isrc: track.isrc, error: err.message }); }
    await new Promise((r) => setTimeout(r, 300));
  }
  info.tidalResults = results;

  return Response.json(info);
}
