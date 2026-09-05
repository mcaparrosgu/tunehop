import { TIDAL_API, getValidUserAccessToken } from "./tidal-auth";

const COUNTRY_CODE = process.env.TIDAL_COUNTRY_CODE ?? "US";

/** Países a buscar en orden de prioridad — maximiza matches automáticamente */
const SEARCH_COUNTRIES = [COUNTRY_CODE, "ES", "GB", "MX", "DE", "FR", "NL", "JP"];

interface TidalTrackNode {
  id: string;
  type: "tracks";
  attributes: {
    title?: string;
    isrc?: string;
    duration?: string;
  };
  relationships?: {
    artists?: {
      data?: Array<{
        id: string;
        type: string;
        attributes?: { name?: string };
      }>;
    };
  };
}

interface TidalMatch {
  tidalId: string;
  title: string;
  artist: string;
}

const JSON_API_HEADERS = { "Content-Type": "application/vnd.api+json" };

async function getUserToken(): Promise<string | null> {
  return getValidUserAccessToken();
}

function extractArtist(node: TidalTrackNode): string {
  return node.relationships?.artists?.data?.[0]?.attributes?.name ?? "";
}

/** Buscar un track en TIDAL por nombre y artista (fallback cuando ISRC no funciona) */
export async function searchTrackByName(name: string, artist: string): Promise<TidalMatch | null> {
  const token = await getUserToken();
  if (!token) return null;

  const query = `${name} ${artist}`.trim();
  const url = `${TIDAL_API}/search?query=${encodeURIComponent(query)}&type=tracks&limit=5`;

  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) return null;

    const data = await res.json() as { data: TidalTrackNode[] };
    const track = data.data?.[0];
    if (!track) return null;

    return {
      tidalId: track.id,
      title: track.attributes?.title ?? "",
      artist: extractArtist(track),
    };
  } catch {
    return null;
  }
}

export async function searchTrackByISRC(isrc: string): Promise<TidalMatch | null> {
  const token = await getUserToken();
  if (!token) return null;

  for (const country of SEARCH_COUNTRIES) {
    const url = `${TIDAL_API}/tracks?${new URLSearchParams({ "filter[isrc]": isrc, countryCode: country })}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) continue;

    const data = await res.json() as { data: TidalTrackNode[] };
    const track = data.data?.[0];
    if (track) {
      return {
        tidalId: track.id,
        title: track.attributes?.title ?? "",
        artist: extractArtist(track),
      };
    }
  }
  return null;
}

export async function searchTracksByISRC(isrcs: string[], batchSize: number = 20): Promise<Map<string, TidalMatch>> {
  const results = new Map<string, TidalMatch>();
  const token = await getUserToken();
  if (!token) return results;

  // Buscar en todos los países automáticamente
  for (const country of SEARCH_COUNTRIES) {
    // Solo buscar los ISRCs que aún no tenemos resultado
    const pending = isrcs.filter((isrc) => !results.has(isrc.toUpperCase()));
    if (pending.length === 0) break;

    for (let i = 0; i < pending.length; i += batchSize) {
      const batch = pending.slice(i, i + batchSize);
      const params = new URLSearchParams();
      for (const isrc of batch) {
        params.append("filter[isrc]", isrc);
      }
      params.set("countryCode", country);

      try {
        const res = await fetch(`${TIDAL_API}/tracks?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json() as { data: TidalTrackNode[] };
          for (const track of data.data ?? []) {
            const isrcKey = track.attributes?.isrc?.toUpperCase();
            if (isrcKey && !results.has(isrcKey)) {
              results.set(isrcKey, {
                tidalId: track.id,
                title: track.attributes?.title ?? "",
                artist: extractArtist(track),
              });
            }
          }
        }
      } catch (err) {
        console.error("TIDAL search batch failed:", err);
      }

      if (i + batchSize < pending.length) {
        await new Promise((r) => setTimeout(r, 300));
      }
    }
  }
  return results;
}

export async function getCurrentUserId(userToken: string): Promise<string | null> {
  const res = await fetch(`${TIDAL_API}/users/me`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  if (!res.ok) return null;
  const data = await res.json() as { data: { id: string } };
  return data.data?.id ?? null;
}

export async function createPlaylist(userToken: string, title: string, description: string): Promise<string | null> {
  const res = await fetch(`${TIDAL_API}/playlists?countryCode=${COUNTRY_CODE}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${userToken}`,
      ...JSON_API_HEADERS,
    },
    body: JSON.stringify({
      data: {
        type: "playlists",
        attributes: { name: title, description },
      },
    }),
  });

  if (!res.ok) {
    console.error("TIDAL create playlist failed:", res.status, await res.text());
    return null;
  }
  const data = await res.json() as { data: { id: string } };
  return data.data?.id ?? null;
}

export async function addTracksToPlaylist(userToken: string, playlistId: string, trackIds: string[]): Promise<boolean> {
  const res = await fetch(`${TIDAL_API}/playlists/${playlistId}/relationships/items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${userToken}`,
      ...JSON_API_HEADERS,
    },
    body: JSON.stringify({
      data: trackIds.map((id) => ({ id, type: "tracks" })),
    }),
  });

  if (res.status === 409) return true; // ya estaban ⇒ trátalo como éxito
  if (!res.ok) {
    console.error("TIDAL add tracks failed:", res.status, await res.text());
    return false;
  }
  return true;
}

export async function addTracksToPlaylistBatched(userToken: string, playlistId: string, trackIds: string[], batchSize: number = 20): Promise<{ added: number; failed: number }> {
  let added = 0;
  let failed = 0;

  for (let i = 0; i < trackIds.length; i += batchSize) {
    const batch = trackIds.slice(i, i + batchSize);
    const success = await addTracksToPlaylist(userToken, playlistId, batch);
    if (success) {
      added += batch.length;
    } else {
      failed += batch.length;
    }
    if (i + batchSize < trackIds.length) {
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  return { added, failed };
}
