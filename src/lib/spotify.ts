import { getValidAccessToken, refreshAccessToken } from "./spotify-auth";

const SPOTIFY_API = "https://api.spotify.com/v1";

interface SpotifyPlaylist {
  id: string;
  name: string;
  images: { url: string }[];
  tracks?: { total: number };
  items?: { total: number };
  owner: { id: string; display_name: string };
  collaborative: boolean;
  public: boolean;
}

interface SpotifyTrackNode {
  id: string;
  name: string;
  artists: { name: string }[];
  album?: { name: string; images: { url: string }[] };
  external_ids?: { isrc?: string };
  duration_ms: number;
}

interface SpotifyTrack {
  /** Esquema nuevo (endpoint /items): el track vive en `item`. */
  item?: SpotifyTrackNode;
  /** Esquema antiguo (endpoint /tracks): el track vive en `track`. */
  track?: SpotifyTrackNode;
}

interface PlaylistSummary {
  id: string;
  name: string;
  imageUrl: string | null;
  totalTracks: number;
  ownerName: string;
  isOwner: boolean;
  collaborative: boolean;
}

interface PlaylistTracksResult {
  tracks: Array<{
    id: string;
    name: string;
    artists: string[];
    album: string;
    albumImageUrl: string | null;
    isrc: string | null;
    durationMs: number;
  }>;
  nextCursor: string | null;
}

async function fetchWithAuth(url: string, accessToken: string): Promise<Response> {
  return fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

async function getValidToken(): Promise<string | null> {
  let token = await getValidAccessToken();
  if (token) return token;

  const refreshToken = await getRefreshTokenFromCookies();
  if (!refreshToken) return null;

  try {
    const refreshed = await refreshAccessToken(refreshToken);
    await (await import("./spotify-auth")).saveTokensToCookies({
      access_token: refreshed.access_token,
      refresh_token: refreshToken,
      expires_in: refreshed.expires_in,
    });
    return refreshed.access_token;
  } catch {
    return null;
  }
}

export async function getSpotifyPlaylists(): Promise<PlaylistSummary[]> {
  const token = await getValidToken();
  if (!token) return [];

  const playlists: PlaylistSummary[] = [];
  let url: string | null = `${SPOTIFY_API}/me/playlists?limit=50`;

  while (url) {
    const res = await fetchWithAuth(url, token);
    if (!res.ok) {
      if (res.status === 401) return [];
      throw new Error(`Spotify playlists error: ${res.status}`);
    }
    const data = await res.json();
    for (const pl of data.items as SpotifyPlaylist[]) {
      if (!pl.id || !pl.name) continue;
      playlists.push({
        id: pl.id,
        name: pl.name,
        imageUrl: pl.images?.[0]?.url ?? null,
        totalTracks: pl.tracks?.total ?? pl.items?.total ?? 0,
        ownerName: pl.owner?.display_name ?? "Desconocido",
        isOwner: pl.owner?.id === (await getCurrentUserId(token)),
        collaborative: pl.collaborative ?? false,
      });
    }
    url = data.next;
  }
  return playlists;
}

async function getCurrentUserId(token: string): Promise<string | null> {
  const res = await fetchWithAuth(`${SPOTIFY_API}/me`, token);
  if (!res.ok) return null;
  const data = await res.json();
  return data.id ?? null;
}

async function getRefreshTokenFromCookies(): Promise<string | null> {
  const cookieStore = await (await import("next/headers")).cookies();
  const c = cookieStore.get("spotify_tokens");
  if (!c) return null;
  try {
    const parsed = JSON.parse(c.value);
    return parsed.refresh_token ?? null;
  } catch {
    return null;
  }
}

export async function getPlaylistTracks(playlistId: string): Promise<PlaylistTracksResult> {
  const token = await getValidToken();
  if (!token) return { tracks: [], nextCursor: null };

  const url = `${SPOTIFY_API}/playlists/${playlistId}/items?limit=100`;
  const res = await fetchWithAuth(url, token);
  if (!res.ok) {
    if (res.status === 401) return { tracks: [], nextCursor: null };
    if (res.status === 403) return { tracks: [], nextCursor: null };
    throw new Error(`Spotify playlist tracks error: ${res.status}`);
  }
  const data = await res.json();

  const tracks = (data.items as SpotifyTrack[])
    .map((entry) => {
      const track = entry.item ?? entry.track;
      if (!track || !track.id) return null;
      return {
        id: track.id,
        name: track.name,
        artists: track.artists.map((a) => a.name),
        album: track.album?.name ?? "",
        albumImageUrl: track.album?.images?.[0]?.url ?? null,
        isrc: track.external_ids?.isrc ?? null,
        durationMs: track.duration_ms,
      };
    })
    .filter((t): t is PlaylistTracksResult["tracks"][number] => t !== null);

  return { tracks, nextCursor: data.next ?? null };
}

export async function getAllPlaylistTracks(playlistId: string) {
  const allTracks: PlaylistTracksResult["tracks"] = [];
  let cursor: string | null = null;
  let url = `${SPOTIFY_API}/playlists/${playlistId}/items?limit=100`;

  const token = await getValidToken();
  if (!token) return allTracks;

  while (url) {
    const res = await fetchWithAuth(url, token);
    if (!res.ok) break;
    const data = await res.json();
    const tracks = (data.items as SpotifyTrack[])
      .map((entry) => {
        const track = entry.item ?? entry.track;
        if (!track || !track.id) return null;
        return {
          id: track.id,
          name: track.name,
          artists: track.artists.map((a) => a.name),
          album: track.album?.name ?? "",
          albumImageUrl: track.album?.images?.[0]?.url ?? null,
          isrc: track.external_ids?.isrc ?? null,
          durationMs: track.duration_ms,
        };
      })
      .filter((t): t is PlaylistTracksResult["tracks"][number] => t !== null);
    allTracks.push(...tracks);
    url = data.next ?? null;
  }
  return allTracks;
}