import { tidalFetch, getAppToken } from "./tidal-auth";

interface TidalTrack {
  id: number;
  title: string;
  duration: number;
  artist: { id: number; name: string };
  album: { id: number; title: string; cover: string };
  isrc: string;
}

interface TidalSearchResponse {
  tracks: {
    data: TidalTrack[];
    total: number;
  };
}

interface TidalUser {
  userId: number;
  username: string;
}

interface TidalPlaylist {
  uuid: string;
  title: string;
  description: string;
  tracks: { data: { id: number }[] };
}

export async function searchTrackByISRC(isrc: string): Promise<{ tidalId: number; title: string; artist: string } | null> {
  const token = await getAppToken();
  if (!token) return null;

  const res = await fetch(`https://api.tidal.com/v1/search/tracks?query=isrc:${isrc}&limit=1`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return null;
  const data = await res.json() as TidalSearchResponse;
  const track = data.tracks?.data?.[0];
  if (!track) return null;

  return {
    tidalId: track.id,
    title: track.title,
    artist: track.artist?.name ?? "",
  };
}

export async function searchTracksByISRC(isrcs: string[]): Promise<Map<string, { tidalId: number; title: string; artist: string }>> {
  const results = new Map<string, { tidalId: number; title: string; artist: string }>();
  
  // Rate limiting: 200ms entre requests para no disparar 429
  for (const isrc of isrcs) {
    const result = await searchTrackByISRC(isrc);
    if (result) results.set(isrc, result);
    await new Promise(r => setTimeout(r, 200));
  }
  return results;
}

export async function getCurrentUserId(userToken: string): Promise<number | null> {
  const res = await fetch("https://api.tidal.com/v1/user", {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  if (!res.ok) return null;
  const data = await res.json() as TidalUser;
  return data.userId ?? null;
}

export async function createPlaylist(userToken: string, userId: number, title: string, description: string): Promise<string | null> {
  const res = await fetch(`https://api.tidal.com/v1/users/${userId}/playlists`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${userToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, description }),
  });

  if (!res.ok) {
    console.error("Create playlist failed:", res.status, await res.text());
    return null;
  }
  const data = await res.json() as TidalPlaylist;
  return data.uuid ?? null;
}

export async function addTracksToPlaylist(userToken: string, playlistUuid: string, trackIds: number[]): Promise<boolean> {
  // TIDAL espera array de track IDs en el body
  const res = await fetch(`https://api.tidal.com/v1/playlists/${playlistUuid}/tracks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${userToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ trackIds }),
  });

  if (!res.ok) {
    console.error("Add tracks failed:", res.status, await res.text());
    return false;
  }
  return true;
}

export async function addTracksToPlaylistBatched(userToken: string, playlistUuid: string, trackIds: number[], batchSize: number = 50): Promise<{ added: number; failed: number }> {
  let added = 0;
  let failed = 0;

  for (let i = 0; i < trackIds.length; i += batchSize) {
    const batch = trackIds.slice(i, i + batchSize);
    const success = await addTracksToPlaylist(userToken, playlistUuid, batch);
    if (success) {
      added += batch.length;
    } else {
      failed += batch.length;
    }
    // Rate limit entre batches
    if (i + batchSize < trackIds.length) {
      await new Promise(r => setTimeout(r, 300));
    }
  }
  return { added, failed };
}