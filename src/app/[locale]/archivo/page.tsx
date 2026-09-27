"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import { parseExportifyCsv, type CsvTrack } from "@/lib/csv-parser";

interface ParsedFile {
  name: string;
  tracks: CsvTrack[];
  errors: string[];
  totalRows: number;
}

export default function ArchivoPage() {
  const t = useTranslations();
  const router = useRouter();
  const [parsed, setParsed] = useState<ParsedFile | null>(null);
  const [playlistName, setPlaylistName] = useState(
    `Migración TuneHop - ${new Date().toLocaleDateString("es-ES")}`
  );
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setLoading(true);
      setParsed(null);

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = String(event.target?.result ?? "");
        const result = parseExportifyCsv(text);
        setParsed({
          name: file.name.replace(/\.csv$/i, ""),
          tracks: result.tracks,
          errors: result.errors,
          totalRows: result.totalRows,
        });
        setLoading(false);
      };
      reader.onerror = () => {
        setParsed({
          name: "",
          tracks: [],
          errors: [t("upload.invalidFormat")],
          totalRows: 0,
        });
        setLoading(false);
      };
      reader.readAsText(file);
    },
    [t]
  );

  const handleContinue = () => {
    if (!parsed || parsed.tracks.length === 0) return;

    const uploaded = {
      source: "csv" as const,
      name: playlistName.trim() || parsed.name,
      tracks: parsed.tracks.map((tr) => ({
        isrc: tr.isrc,
        name: tr.name,
        artists: tr.artists,
      })),
    };

    localStorage.setItem("tunehop:uploadedPlaylist", JSON.stringify(uploaded));
    router.push("/destino");
  };

  const hasTracks = parsed && parsed.tracks.length > 0;
  const withIsrc = parsed?.tracks.filter((tr) => tr.isrc).length ?? 0;
  const withoutIsrc = parsed?.tracks.filter((tr) => !tr.isrc).length ?? 0;

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12">
      <section className="mx-auto w-full max-w-2xl rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-900">{t("upload.title")}</h1>
        <p className="mt-2 text-zinc-600">{t("upload.description")}</p>

        <label className="mt-6 block">
          <span className="text-sm font-medium text-zinc-700">{t("upload.fileLabel")}</span>
          <span className="mt-2 flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 px-6 py-8 text-zinc-500 transition hover:border-zinc-400 hover:bg-zinc-100">
            <span className="text-center text-sm">
              {parsed
                ? `${parsed.name}.csv`
                : loading
                ? "Leyendo..."
                : "Haz clic para seleccionar un archivo CSV"}
            </span>
          </span>
          <input
            type="file"
            accept={t("upload.fileAccept")}
            onChange={handleFile}
            className="sr-only"
            aria-label={t("upload.fileAria")}
          />
        </label>

        {parsed && parsed.totalRows > 0 && (
          <>
            <div className="mt-4 rounded-md border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
              {t("upload.stats", {
                count: parsed.tracks.length,
                withIsrc,
                withoutIsrc,
              })}
            </div>

            {hasTracks && (
              <div className="mt-4">
                <label htmlFor="playlistName" className="block text-sm font-medium text-zinc-700">
                  {t("upload.nameLabel")}
                </label>
                <input
                  id="playlistName"
                  type="text"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  placeholder={t("upload.namePlaceholder")}
                  className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}

            {parsed.tracks.length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold text-zinc-900">{t("upload.previewTitle")}</h2>
                <div className="mt-2 max-h-48 overflow-auto rounded-md border border-zinc-200">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-zinc-50 text-zinc-700">
                      <tr>
                        <th className="px-3 py-2 font-medium">Canción</th>
                        <th className="px-3 py-2 font-medium">Artistas</th>
                        <th className="px-3 py-2 font-medium">ISRC</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {parsed.tracks.slice(0, 5).map((track, i) => (
                        <tr key={i}>
                          <td className="px-3 py-2 text-zinc-900">{track.name}</td>
                          <td className="px-3 py-2 text-zinc-600">{track.artists.join(", ")}</td>
                          <td className="px-3 py-2 text-zinc-500">{track.isrc ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parsed.tracks.length > 5 && (
                    <p className="px-3 py-2 text-xs text-zinc-500">
                      Y {parsed.tracks.length - 5} más...
                    </p>
                  )}
                </div>
              </div>
            )}

            {parsed.errors.length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold text-red-700">{t("upload.errorsTitle")}</h2>
                <ul className="mt-2 max-h-32 overflow-auto rounded-md border border-red-100 bg-red-50 p-3 text-sm text-red-700">
                  {parsed.errors.slice(0, 10).map((err, i) => (
                    <li key={i} className="mt-1 first:mt-0">
                      {err}
                    </li>
                  ))}
                  {parsed.errors.length > 10 && (
                    <li className="mt-1">...y {parsed.errors.length - 10} más</li>
                  )}
                </ul>
              </div>
            )}
          </>
        )}

        {parsed && parsed.tracks.length === 0 && (
          <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            {parsed.errors.length > 0 ? t("upload.invalidFormat") : t("upload.errorsEmpty")}
          </div>
        )}

        {hasTracks && (
          <>
            <label className="mt-6 flex cursor-pointer items-start gap-3">
              <Checkbox
                checked={consent}
                onChange={setConsent}
                aria-label={t("upload.policy")}
              />
              <span className="text-sm leading-relaxed text-zinc-700">
                {t("upload.policy")}{" "}
                <Link
                  href="/politica-privacidad"
                  className="font-medium text-blue-600 underline-offset-2 hover:underline"
                >
                  {t("home.privacyLink")}
                </Link>
              </span>
            </label>

            <div className="mt-6">
              <Button
                onClick={handleContinue}
                disabled={!consent}
                className="w-full"
                aria-label={t("upload.continueAria")}
              >
                {t("upload.continue")}
              </Button>
            </div>
          </>
        )}

        <p className="mt-6 text-center text-sm text-zinc-500">{t("upload.privacyNote")}</p>
      </section>
    </main>
  );
}
