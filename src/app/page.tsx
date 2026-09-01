import Link from "next/link";
import Button from "@/components/Button";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center bg-gradient-to-b from-white to-blue-50 px-4">
      <section className="mx-auto max-w-xl py-16 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-zinc-900">TuneHop</h1>
        <p className="mt-4 text-xl text-zinc-600">
          Migra tus playlists de Spotify a otras plataformas musicales
        </p>
        <div className="mt-10">
          <Button href="/consentimiento" className="px-10 py-4 text-lg">
            Connect Spotify
          </Button>
        </div>
        <p className="mt-8 text-sm text-zinc-500">
          Tus datos se borran al cerrar la sesión. No guardamos nada.{" "}
          <Link
            href="/politica-privacidad"
            className="font-medium text-blue-600 underline-offset-2 hover:underline"
          >
            Política de Privacidad
          </Link>
        </p>
      </section>
    </main>
  );
}