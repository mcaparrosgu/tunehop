import { cookies } from "next/headers";
import { exchangeCodeForUserTokens, saveUserTokensToCookies, clearTidalUserCookies } from "@/lib/tidal-auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  const cookieStore = await cookies();
  const savedState = cookieStore.get("tidal_oauth_state")?.value;
  const verifier = cookieStore.get("tidal_pkce_verifier")?.value;

  // Limpieza inmediata
  cookieStore.delete("tidal_oauth_state");
  cookieStore.delete("tidal_pkce_verifier");

  if (error) {
    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/error?message=${encodeURIComponent(`TIDAL: ${error}`)}`, 302);
  }

  if (!code || !state || !verifier) {
    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/error?message=${encodeURIComponent("Faltan parámetros en el callback")}`, 302);
  }
  if (state !== savedState) {
    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/error?message=${encodeURIComponent("State inválido (posible CSRF)")}`, 302);
  }

  try {
    const tokens = await exchangeCodeForUserTokens(code, verifier);
    await saveUserTokensToCookies(tokens);
  } catch (err) {
    console.error("TIDAL token exchange error:", err);
    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/error?message=${encodeURIComponent("Error intercambiando código por tokens")}`, 302);
  }

  // Éxito → redirigir a pantalla de migración (la haremos en /migrando)
  return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/migrando`, 302);
}