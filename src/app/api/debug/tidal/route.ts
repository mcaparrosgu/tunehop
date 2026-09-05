import { getValidUserAccessToken, getUserTokensFromCookies } from "@/lib/tidal-auth";

export async function GET() {
  const tokens = await getUserTokensFromCookies();
  const accessToken = await getValidUserAccessToken();

  const info: Record<string, unknown> = {
    hayTokens: tokens !== null,
    expiryISO: tokens ? new Date(tokens.expiry).toISOString() : null,
    expiraEnSeg: tokens ? Math.round((tokens.expiry - Date.now()) / 1000) : null,
    tokenValido: accessToken !== null,
  };

  if (!tokens) {
    return Response.json({ ...info, error: "NO_TIDAL_COOKIES" });
  }

  // Llamada real a TIDAL con un ISRC conocido (Bohemian Rhapsody - Queen)
  const testISRC = "GBUM71029604";
  const tidalUrl = `https://openapi.tidal.com/v2/tracks?filter[isrc]=${testISRC}&countryCode=US`;

  try {
    const res = await fetch(tidalUrl, {
      headers: { Authorization: `Bearer ${accessToken ?? tokens.access_token}` },
    });
    const body = await res.json();
    info.tidalStatus = res.status;
    info.tidalHeaders = Object.fromEntries(res.headers.entries());
    info.tidalBody = body;
    info.tidalUrl = tidalUrl;
  } catch (err) {
    info.tidalError = err instanceof Error ? err.message : String(err);
  }

  return Response.json(info);
}
