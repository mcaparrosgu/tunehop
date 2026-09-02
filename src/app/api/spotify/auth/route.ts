import { cookies } from "next/headers";
import { generatePKCE, generateRandomString, getAuthUrl } from "@/lib/spotify-auth";

export async function GET() {
  const { verifier, challenge } = await generatePKCE();
  const state = generateRandomString(32);

  const cookieStore = await cookies();
  cookieStore.set("spotify_pkce_verifier", verifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10, // 10 minutos (solo para el flujo de auth)
  });
  cookieStore.set("spotify_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });

  const authUrl = getAuthUrl(challenge, state);
  return Response.redirect(authUrl, 302);
}