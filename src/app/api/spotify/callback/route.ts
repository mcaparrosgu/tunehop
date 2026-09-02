import { cookies } from "next/headers";
import { exchangeCodeForTokens, saveTokensToCookies } from "@/lib/spotify-auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  const cookieStore = await cookies();
  const savedState = cookieStore.get("spotify_oauth_state")?.value;
  const verifier = cookieStore.get("spotify_pkce_verifier")?.value;

  cookieStore.delete("spotify_oauth_state");
  cookieStore.delete("spotify_pkce_verifier");

  if (error) {
    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/error?message=${encodeURIComponent(`Spotify: ${error}`)}`, 302);
  }

  if (!code || !state || !verifier) {
    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/error?message=${encodeURIComponent("Faltan parámetros en el callback")}`, 302);
  }
  if (state !== savedState) {
    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/error?message=${encodeURIComponent("State inválido (posible CSRF)")}`, 302);
  }

  try {
    const tokens = await exchangeCodeForTokens(code, verifier);
    await saveTokensToCookies(tokens);
  } catch (err) {
    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/error?message=${encodeURIComponent("Error intercambiando código por tokens")}`, 302);
  }

  return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/playlists`, 302);
}