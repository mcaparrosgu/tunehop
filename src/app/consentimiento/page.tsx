"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";

export default function Consentimiento() {
  const [aceptado, setAceptado] = useState(false);

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12">
      <section className="mx-auto w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-900">Antes de conectar</h1>
        <p className="mt-2 text-zinc-600">
          Para migrar tus playlists, TuneHop necesita leerlas de tu cuenta de Spotify. Solamente
          lectura: no modificamos, borramos ni movemos nada en tu Spotify.
        </p>

        <label className="mt-6 flex cursor-pointer items-start gap-3">
          <Checkbox
            checked={aceptado}
            onChange={setAceptado}
            aria-label="Acepto la Política de Privacidad"
          />
          <span className="text-sm leading-relaxed text-zinc-700">
            He leído la{" "}
            <Link
              href="/politica-privacidad"
              className="font-medium text-blue-600 underline-offset-2 hover:underline"
            >
              Política de Privacidad
            </Link>{" "}
            y acepto que TuneHop procese mis datos de Spotify para migrar mis playlists.
          </span>
        </label>

        <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Las playlists pueden contener datos personales. TuneHop no analiza ni almacena estos
          títulos más allá de la migración.
        </p>

        <div className="mt-6">
          <Button href="/api/spotify/auth" external disabled={!aceptado} className="w-full">
            Conectar con Spotify
          </Button>
        </div>
      </section>
    </main>
  );
}