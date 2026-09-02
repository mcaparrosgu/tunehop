import { cookies } from "next/headers";

const TIDAL_AUTH_URL = "https://login.tidal.com/authorize";
const TIDAL_TOKEN_URL = "https://auth.tidal.com/v1/oauth2/token";
export const TIDAL_API = "https://openapi.tidal.com/v2";

const USER_SCOPES = "user.read playlists.read playlists.write collection.read collection.write";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30, // 30 días
};

const USER_TOKEN_COOKIE = "tidal_user_tokens";
const STATE_COOKIE = "tidal_oauth_state";
const VERIFIER_COOKIE = "tidal_pkce_verifier";
const APP_TOKEN_COOKIE = "tidal_app_token";

export function generateRandomString(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

export async function generatePKCE(): Promise<{ verifier: string; challenge: string }> {
  const verifier = generateRandomString(128);
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const challenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return { verifier, challenge };
}

export function getUserAuthUrl(verifier: string, state: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.TIDAL_CLIENT_ID!,
    scope: USER_SCOPES,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/tidal/callback`,
    state,
    code_challenge_method: "S256",
    code_challenge: verifier,
  });
  return `${TIDAL_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForUserTokens(code: string, verifier: string) {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/tidal/callback`,
    client_id: process.env.TIDAL_CLIENT_ID!,
    client_secret: process.env.TIDAL_CLIENT_SECRET!,
    code_verifier: verifier,
  });

  const response = await fetch(TIDAL_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`TIDAL user token exchange failed: ${response.status} ${JSON.stringify(error)}`);
  }

  return response.json() as Promise<{
    access_token: string;
    token_type: "Bearer";
    expires_in: number;
    refresh_token: string;
    scope: string;
  }>;
}

export async function getAppToken(): Promise<string | null> {
  // Primero intenta leer de cookie cacheada
  const cookieStore = await cookies();
  const cached = cookieStore.get(APP_TOKEN_COOKIE);
  if (cached) {
    try {
      const { token, expiry } = JSON.parse(cached.value);
      if (Date.now() < expiry - 60_000) return token;
    } catch { /* ignora y renueva */ }
  }

  // Solicita nuevo token con client_credentials
  const params = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: process.env.TIDAL_CLIENT_ID!,
    client_secret: process.env.TIDAL_CLIENT_SECRET!,
  });

  const response = await fetch(TIDAL_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!response.ok) {
    console.error("TIDAL app token failed:", response.status);
    return null;
  }

  const data = await response.json() as { access_token: string; expires_in: number; token_type: string };
  const expiry = Date.now() + data.expires_in * 1000;
  cookieStore.set(APP_TOKEN_COOKIE, JSON.stringify({ token: data.access_token, expiry }), COOKIE_OPTIONS);
  return data.access_token;
}

export async function saveUserTokensToCookies(tokens: {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}) {
  const cookieStore = await cookies();
  const expiry = Date.now() + tokens.expires_in * 1000;
  cookieStore.set(USER_TOKEN_COOKIE, JSON.stringify({ ...tokens, expiry }), COOKIE_OPTIONS);
}

export async function clearTidalUserCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(USER_TOKEN_COOKIE);
  cookieStore.delete(STATE_COOKIE);
  cookieStore.delete(VERIFIER_COOKIE);
}

export async function getUserTokensFromCookies(): Promise<{ access_token: string; refresh_token: string; expiry: number } | null> {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(USER_TOKEN_COOKIE);
  if (!tokenCookie) return null;
  try {
    return JSON.parse(tokenCookie.value);
  } catch {
    return null;
  }
}

export async function getValidUserAccessToken(): Promise<string | null> {
  const tokens = await getUserTokensFromCookies();
  if (!tokens) return null;
  if (Date.now() >= tokens.expiry - 60_000) return null; // expira en <1 min
  return tokens.access_token;
}

export async function tidalFetch<T>(endpoint: string, userToken: boolean = true): Promise<T | null> {
  const token = userToken
    ? await getValidUserAccessToken()
    : await getAppToken();

  if (!token) return null;

  const res = await fetch(`${TIDAL_API}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    if (res.status === 401) return null;
    console.error(`TIDAL API error ${res.status}:`, endpoint);
    return null;
  }
  return res.json() as Promise<T>;
}