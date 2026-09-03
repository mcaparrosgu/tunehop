import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Política de Privacidad | TuneHop",
};

export default async function PoliticaPrivacidad() {
  const t = await getTranslations();

  return (
    <main className="flex flex-1 justify-center bg-white px-4 py-12">
      <article className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-zinc-900">{t("privacy.title")}</h1>
        <p className="mt-2 text-sm text-zinc-500">{t("privacy.lastUpdated")}: 1 de septiembre de 2026</p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-zinc-900">{t("privacy.responsible")}</h2>
          <p className="mt-2 text-zinc-700">
            TuneHop es un proyecto personal de mcaparrosgu. No existe una empresa detrás: la
            desarrolladora es quien controla y responde por los datos. Si algún día el proyecto
            pasa a una entidad, esta política se actualizará.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-zinc-900">{t("privacy.dataTitle")}</h2>
          <p className="mt-2 text-zinc-700">
            {t("privacy.dataDescription")}
          </p>
          <table className="mt-4 w-full border-collapse text-left text-sm text-zinc-700">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="py-2 pr-4 font-semibold">Dato</th>
                <th className="py-2 pr-4 font-semibold">Finalidad</th>
                <th className="py-2 font-semibold">Plazo</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-100"><td className="py-2 pr-4">Email del usuario</td><td className="py-2 pr-4">Identificar la sesión</td><td className="py-2">Solo durante la sesión</td></tr>
              <tr className="border-b border-zinc-100"><td className="py-2 pr-4">Tokens de acceso de Spotify y TIDAL</td><td className="py-2 pr-4">Hacer peticiones a las APIs en tu nombre</td><td className="py-2">Solo durante la sesión</td></tr>
              <tr className="border-b border-zinc-100"><td className="py-2 pr-4">Nombres de tus playlists</td><td className="py-2 pr-4">Mostrarlas y migrarlas al destino</td><td className="py-2">Solo durante la sesión</td></tr>
              <tr><td className="py-2 pr-4">Canciones (título, artista, álbum, ISRC)</td><td className="py-2 pr-4">Buscar y copiar las canciones al destino</td><td className="py-2">Solo durante la sesión</td></tr>
            </tbody>
          </table>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-zinc-900">{t("privacy.purposeTitle")}</h2>
          <p className="mt-2 text-zinc-700">
            {t("privacy.purposeDescription")}
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-zinc-900">{t("privacy.legalTitle")}</h2>
          <p className="mt-2 text-zinc-700">
            {t("privacy.legalDescription")}
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-zinc-900">{t("privacy.rightsTitle")}</h2>
          <p className="mt-2 text-zinc-700">
            {t("privacy.rightsDescription")}
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-zinc-900">{t("privacy.retentionTitle")}</h2>
          <p className="mt-2 text-zinc-700">
            {t("privacy.retentionDescription")}
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-zinc-900">{t("privacy.contactTitle")}</h2>
          <p className="mt-2 text-zinc-700">
            {t("privacy.contactDescription")}
          </p>
        </section>

        <div className="mt-10">
          <Link href="/" className="font-medium text-blue-600 underline-offset-2 hover:underline">
            {t("privacy.back")}
          </Link>
        </div>
      </article>
    </main>
  );
}
