import { getValidAccessToken, getTokensFromCookies } from "@/lib/spotify-auth";

export async function GET() {
  const tokens = await getTokensFromCookies();
  const accessToken = await getValidAccessToken();

  if (!tokens) {
    return Response.json({ error: "NO_COOKIES", msg: "No hay cookie spotify_tokens" });
  }

  const info: Record<string, unknown> = {
    hayTokens: true,
    expiryISO: new Date(tokens.expiry).toISOString(),
    expiraEnSeg: Math.round((tokens.expiry - Date.now()) / 1000),
    tokenExpiraEnMenosDe1Min: Date.now() >= tokens.expiry - 60_000,
    getValidAccessTokenDevuelve: accessToken ? "token" : "null",
    tieneRefreshToken: Boolean(tokens.refresh_token),
    refreshTokenPrimeros6: tokens.refresh_token ? tokens.refresh_token.slice(0, 6) + "..." : null,
  };

  // Llamada real a Spotify con el token (cruda)
  try {
    const res = await fetch("https://api.spotify.com/v1/me/playlists?limit=1", {
      headers: { Authorization: `Bearer ${accessToken ?? tokens.access_token}` },
    });
    const body = await res.json();
    info.spotifyStatus = res.status;
    info.spotifyScopeHeader = res.headers.get("spotify-scope");
    info.spotifyBody = body;
  } catch (err) {
    info.spotifyFetchError = err instanceof Error ? err.message : String(err);
  }

  return Response.json(info);
}