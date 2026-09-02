"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";

export default function Destino() {
  const [conectado, setConectado] = useState(false);

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12">
      <section className="mx-auto w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-900">Elige plataforma destino</h1>
        <p className="mt-2 text-zinc-600">
          Tus playlists se copiarán a TIDAL como playlists nuevas. No se borra ni modifica nada en tu
          Spotify.
        </p>

        {!conectado ? (
          <>
            <div className="mt-6">
              <Button href="/api/tidal/auth" className="w-full py-4 text-lg">
                Connect TIDAL
              </Button>
            </div>
            <p className="mt-4 text-sm text-zinc-500 text-center">
              Serás redirigido a TIDAL para autorizar el acceso.
            </p>
          </>
        ) : (
          <>
            <div className="mt-6 rounded-md border border-green-200 bg-green-50 p-4 text-center">
              <p className="font-medium text-green-800">¡TIDAL conectado correctamente!</p>
            </div>
            <div className="mt-6">
              <Button href="/migrando" className="w-full py-4 text-lg">
                Iniciar migración
              </Button>
            </div>
          </>
        )}

        <p className="mt-6 text-sm text-zinc-500 text-center">
          Deezer: próximamente.{" "}
          <Link href="/politica-privacidad" className="font-medium text-blue-600 underline">
            Política de Privacidad
          </Link>
        </p>
      </section>
    </main>
  );
}