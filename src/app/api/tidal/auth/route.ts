import { cookies } from "next/headers";
import { generatePKCE, generateRandomString, getUserAuthUrl } from "@/lib/tidal-auth";

export async function GET() {
  const { verifier, challenge } = await generatePKCE();
  const state = generateRandomString(32);

  const cookieStore = await cookies();
  cookieStore.set("tidal_pkce_verifier", verifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10, // 10 minutos
  });
  cookieStore.set("tidal_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });

  const authUrl = getUserAuthUrl(challenge, state);
  return Response.redirect(authUrl, 302);
}