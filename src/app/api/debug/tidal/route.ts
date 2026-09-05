import { getValidAccessToken } from "@/lib/spotify-auth";
import { getValidUserAccessToken } from "@/lib/tidal-auth";

const SPOTIFY_API = "https://api.spotify.com/v1";

function extractTrack(entry: any): { id: string; name: string; isrc: string | null; artists: string[]; external_ids_raw: unknown } | null {
  const track = entry?.item ?? entry?.track;
  if (!track || !track.id) return null;
  return {
    id: track.id,
    name: track.name,
    isrc: track.external_ids?.isrc ?? null,
    artists: track.artists?.map((a: any) => a.name) ?? [],
    external_ids_raw: track.external_ids ?? null,
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const playlistId = url.searchParams.get("playlistId");
  const fields = url.searchParams.get("fields") ?? "items(item(id,name,artists(name),album(name,images),external_ids(isrc),duration_ms)),next";

  const info: Record<string, unknown> = {};

  const spotifyToken = await getValidAccessToken();
  info.spotifyTokenValido = spotifyToken !== null;
  if (!spotifyToken) return Response.json({ ...info, error: "NO_SPOTIFY_TOKEN" });

  // Sin playlistId: listar playlists
  if (!playlistId) {
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

  // Con playlistId: diagnosticar tracks
  // Test 1: SIN fields
  const noFieldsRes = await fetch(`${SPOTIFY_API}/playlists/${playlistId}/items?limit=3`, { headers: { Authorization: `Bearer ${spotifyToken}` } });
  info.noFieldsStatus = noFieldsRes.status;
  if (noFieldsRes.ok) {
    const noFieldsData = await noFieldsRes.json();
    const noFieldsTracks = (noFieldsData.items ?? []).map(extractTrack);
    info.noFieldsSample = noFieldsTracks;
  }

  // Test 2: CON fields (formato nuevo)
  const fieldsRes = await fetch(`${SPOTIFY_API}/playlists/${playlistId}/items?limit=3&fields=${encodeURIComponent(fields)}`, { headers: { Authorization: `Bearer ${spotifyToken}` } });
  info.fieldsStatus = fieldsRes.status;
  if (fieldsRes.ok) {
    const fieldsData = await fieldsRes.json();
    const fieldsTracks = (fieldsData.items ?? []).map(extractTrack);
    info.fieldsSample = fieldsTracks;
  }

  // Test 3: Playlist info
  const plRes = await fetch(`${SPOTIFY_API}/playlists/${playlistId}?fields=name,tracks`, { headers: { Authorization: `Bearer ${spotifyToken}` } });
  if (plRes.ok) {
    const plInfo = await plRes.json();
    info.playlistName = plInfo.name;
    info.playlistTracks = plInfo.tracks;
  }

  // Test TIDAL con el mejor sample - probar SIN countryCode y con countryCode del usuario
  const bestSample = (Array.isArray(info.fieldsSample) ? info.fieldsSample : Array.isArray(info.noFieldsSample) ? info.noFieldsSample : []) as Array<{ name: string; isrc: string | null; external_ids_raw: unknown }>;
  const tidalToken = await getValidUserAccessToken();
  info.tidalTokenValido = tidalToken !== null;
  if (tidalToken && bestSample.length > 0) {
    const results = [];
    for (const track of bestSample.slice(0, 2)) {
      if (!track.isrc) { results.push({ track: track.name, isrc: null, resultado: "SIN_ISRC" }); continue; }
      // Probar SIN countryCode
      try {
        const resNoCC = await fetch(`https://openapi.tidal.com/v2/tracks?filter[isrc]=${track.isrc}`, { headers: { Authorization: `Bearer ${tidalToken}` } });
        const bodyNoCC = await resNoCC.json();
        results.push({ track: track.name, isrc: track.isrc, method: "sin_countryCode", tidalStatus: resNoCC.status, matchCount: bodyNoCC.data?.length ?? 0, firstId: bodyNoCC.data?.[0]?.id ?? null, firstTitle: bodyNoCC.data?.[0]?.attributes?.title ?? null, error: bodyNoCC.errors ?? null });
      } catch (err: any) { results.push({ track: track.name, isrc: track.isrc, error: err.message }); }
      await new Promise((r) => setTimeout(r, 300));
    }
    info.tidalResults = results;
  }

  return Response.json(info);
}
