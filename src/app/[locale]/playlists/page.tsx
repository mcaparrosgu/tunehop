"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";

interface Playlist {
  id: string;
  name: string;
  imageUrl: string | null;
  totalTracks: number;
  ownerName: string;
  isOwner: boolean;
  collaborative: boolean;
}

export default function Playlists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations();

  useEffect(() => {
    fetch("/api/playlists")
      .then((res) => {
        if (!res.ok) throw new Error("No autorizado o error del servidor");
        return res.json();
      })
      .then((data) => {
        if (data.playlists) setPlaylists(data.playlists);
        else if (data.error) setError(data.error);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const selectAll = () => {
    if (selected.size === playlists.length) setSelected(new Set());
    else setSelected(new Set(playlists.map((p) => p.id)));
  };

  const allSelected = playlists.length > 0 && selected.size === playlists.length;

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-600 border-t-transparent" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold text-zinc-900">{t("error.title")}</h1>
          <p className="mt-2 text-zinc-600">{error}</p>
          <div className="mt-6">
            <Link
              href="/consentimiento"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              {t("error.retry")}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (playlists.length === 0) {
    return (
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold text-zinc-900">{t("playlists.empty")}</h1>
          <p className="mt-2 text-zinc-600">
            {t("playlists.emptyDescription")}
          </p>
          <div className="mt-6">
            <Link
              href="/consentimiento"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              {t("playlists.back")}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 bg-zinc-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-zinc-900">{t("playlists.title")} ({playlists.length})</h1>
          <p className="mt-1 text-zinc-600">
            {t("playlists.select")}. {selected.size > 0 && <span className="font-medium text-blue-600">({selected.size} {t("playlists.selected")})</span>}
          </p>
        </header>

        <div className="mb-4 flex items-center gap-3">
          <Button onClick={selectAll} variant="outline" className="flex-1" aria-label={allSelected ? t("playlists.deselectAllAria") : t("playlists.selectAllAria")}>
            {allSelected ? t("playlists.deselectAll") : t("playlists.selectAll")}
          </Button>
        </div>

        <ul className="space-y-3" role="listbox" aria-label="Playlists para migrar">
          {playlists.map((pl) => (
            <li key={pl.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <label className="flex items-center gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.has(pl.id)}
                  onChange={() => toggleSelect(pl.id)}
                  className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded accent-blue-600"
                  aria-label={pl.name}
                />
                {pl.imageUrl && (
                  <img src={pl.imageUrl} alt="" className="h-14 w-14 rounded-lg object-cover" loading="lazy" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-zinc-900 truncate">{pl.name}</p>
                  <p className="text-sm text-zinc-500">
                    {pl.totalTracks} canciones · {pl.ownerName}
                    {pl.collaborative && " · Colaborativa"}
                  </p>
                </div>
              </label>
            </li>
          ))}
        </ul>

        {selected.size > 0 && (
          <div className="fixed bottom-0 inset-x-0 border-t border-zinc-200 bg-white p-4 shadow-lg">
            <Button
              className="w-full text-lg py-4"
              disabled={selected.size === 0}
              aria-label={`${t("playlists.continue")} (${selected.size})`}
              onClick={() => {
                sessionStorage.setItem("selectedPlaylists", JSON.stringify(Array.from(selected)));
                window.location.href = "/destino";
              }}
            >
              {t("playlists.continue")} ({selected.size})
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
