"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";

interface MigrationProgress {
  stage: "idle" | "fetching" | "matching" | "creating" | "adding" | "done" | "error";
  message: string;
  current: number;
  total: number;
  result?: {
    playlistName: string;
    added: number;
    notFound: number;
    tidalUrl: string;
  };
  error?: string;
}

export default function Migrando() {
  const [progress, setProgress] = useState<MigrationProgress>({
    stage: "idle",
    message: "Iniciando...",
    current: 0,
    total: 0,
  });

  useEffect(() => {
    const selectedIds = JSON.parse(sessionStorage.getItem("selectedPlaylists") || "[]");
    if (selectedIds.length === 0) {
      setProgress({ stage: "error", message: "No hay playlists seleccionadas", current: 0, total: 0, error: "No playlists" });
      return;
    }

    runMigration(selectedIds);
  }, []);

  const runMigration = async (playlistIds: string[]) => {
    try {
      // 1. Obtener tracks de Spotify
      setProgress({ stage: "fetching", message: "Obteniendo canciones de Spotify...", current: 0, total: playlistIds.length });

      const allTracks: Array<{ isrc: string; name: string; artists: string[] }> = [];
      
      for (let i = 0; i < playlistIds.length; i++) {
        const res = await fetch(`/api/spotify/playlist/${playlistIds[i]}/tracks`);
        if (res.ok) {
          const data = await res.json();
          if (data.tracks) {
            allTracks.push(...data.tracks.map((t: any) => ({
              isrc: t.isrc,
              name: t.name,
              artists: t.artists,
            })));
          }
        }
        setProgress({ stage: "fetching", message: `Obteniendo canciones... ${i + 1}/${playlistIds.length}`, current: i + 1, total: playlistIds.length });
      }

      const tracksWithISRC = allTracks.filter(t => t.isrc);
      console.log(`Tracks con ISRC: ${tracksWithISRC.length}/${allTracks.length}`);

      // 2. Buscar en TIDAL por ISRC
      setProgress({ stage: "matching", message: "Buscando coincidencias en TIDAL...", current: 0, total: tracksWithISRC.length });

      const tidalMatches: string[] = [];
      const notFound: string[] = [];

      for (let i = 0; i < tracksWithISRC.length; i++) {
        const track = tracksWithISRC[i];
        const res = await fetch(`/api/tidal/search?isrc=${track.isrc}`);
        if (res.ok) {
          const data = await res.json();
          if (data.tidalId) {
            tidalMatches.push(data.tidalId);
          } else {
            notFound.push(`${track.name} - ${track.artists.join(", ")}`);
          }
        } else {
          notFound.push(`${track.name} - ${track.artists.join(", ")}`);
        }
        setProgress({ stage: "matching", message: `Buscando... ${i + 1}/${tracksWithISRC.length}`, current: i + 1, total: tracksWithISRC.length });
      }

      // 3. Crear playlist en TIDAL
      setProgress({ stage: "creating", message: "Creando playlist en TIDAL...", current: 0, total: 1 });

      const createRes = await fetch("/api/tidal/create-playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Migración Spotify - ${new Date().toLocaleDateString("es-ES")}`,
          description: `Migrada desde Spotify con TuneHop. ${tidalMatches.length} tracks encontrados.`,
          trackIds: tidalMatches,
        }),
      });

      if (!createRes.ok) {
        throw new Error("Error creando playlist en TIDAL");
      }

      const createData = await createRes.json();
      const playlistId = createData.id;

      // 4. Añadir tracks (ya se añaden al crear en la API, pero si hiciera falta batch)
      setProgress({ stage: "adding", message: "Finalizando...", current: 1, total: 1 });

      setProgress({
        stage: "done",
        message: "¡Migración completada!",
        current: tidalMatches.length,
        total: tracksWithISRC.length,
        result: {
          playlistName: `Migración Spotify - ${new Date().toLocaleDateString("es-ES")}`,
          added: tidalMatches.length,
          notFound: notFound.length,
          tidalUrl: `https://tidal.com/playlist/${playlistId}`,
        },
      });

    } catch (err) {
      console.error("Migration error:", err);
      setProgress({ stage: "error", message: "Error en la migración", current: 0, total: 0, error: err instanceof Error ? err.message : "Error desconocido" });
    }
  };

  const getStageColor = (stage: MigrationProgress["stage"]) => {
    switch (stage) {
      case "done": return "text-green-600 bg-green-100";
      case "error": return "text-red-600 bg-red-100";
      default: return "text-blue-600 bg-blue-100";
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12">
      <section className="mx-auto w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStageColor(progress.stage)}`}>
            {progress.message}
          </div>
        </div>

        {progress.stage !== "idle" && progress.stage !== "done" && progress.stage !== "error" && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-zinc-500 mb-1">
              <span>{progress.current} / {progress.total}</span>
              <span>{Math.round((progress.current / Math.max(progress.total, 1)) * 100)}%</span>
            </div>
            <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${(progress.current / Math.max(progress.total, 1)) * 100}%` }}
              />
            </div>
          </div>
        )}

        {progress.stage === "done" && progress.result && (
          <div className="space-y-4">
            <div className="rounded-md border border-green-200 bg-green-50 p-4">
              <p className="font-medium text-green-800">{progress.result.playlistName}</p>
              <p className="text-sm text-green-700 mt-1">
                {progress.result.added} canciones migradas · {progress.result.notFound} no encontradas
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href={progress.result.tidalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button className="w-full justify-center">Ver en TIDAL</Button>
              </a>
              <Link href="/">
                <Button variant="outline" className="w-full justify-center">Volver al inicio</Button>
              </Link>
            </div>
          </div>
        )}

        {progress.stage === "error" && (
          <div className="space-y-4">
            <div className="rounded-md border border-red-200 bg-red-50 p-4">
              <p className="font-medium text-red-800">Error en la migración</p>
              <p className="text-sm text-red-700 mt-1">{progress.error}</p>
            </div>
            <Link href="/playlists">
              <Button className="w-full justify-center">Volver a selección</Button>
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}