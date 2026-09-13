import Link from "next/link";
import { getTranslations } from "next-intl/server";
import Button from "@/components/Button";
import Logo from "@/components/Logo";

export default async function Home() {
  const t = await getTranslations();

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:py-20">
      <section className="container-main w-full max-w-2xl py-10 sm:py-16 text-center">
        {/* Logo + Tagline */}
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          <Logo variant="wordmark" color="fg" className="text-[var(--text-display)] font-bold tracking-tight" />
          <p className="text-h2 font-medium text-[var(--color-fg)] max-w-lg">
            {t("home.tagline")}
          </p>
        </div>

        {/* Value props breves */}
        <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="flex items-start gap-3 p-4 card">
            <Logo variant="glyph" size={20} color="accent" className="mt-1 flex-shrink-0" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-fg)]">Solo lectura en Spotify</h3>
              <p className="mt-1 text-sm text-[var(--color-fg)]/70">No modificamos, borramos ni movemos nada.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 card">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[var(--color-accent)] mt-1 flex-shrink-0" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-fg)]">Privacidad radical</h3>
              <p className="mt-1 text-sm text-[var(--color-fg)]/70">Tokens en tu sesión. Borrado real al cerrar.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 card">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[var(--color-accent)] mt-1 flex-shrink-0" aria-hidden="true">
              <path d="M12 22V12M12 12l-4 4M12 12l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-fg)]">Destino con criterio</h3>
              <p className="mt-1 text-sm text-[var(--color-fg)]/70">TIDAL paga ~3x más por stream que Spotify.</p>
            </div>
          </div>
        </div>

        {/* CTA Principal */}
        <div className="mt-10 sm:mt-14">
          <Button
            href="/consentimiento"
            variant="primary"
            className="w-full sm:w-auto min-w-[280px]"
            aria-label={t("home.connectAria")}
          >
            {t("home.connect")}
          </Button>
        </div>

        {/* Privacy note */}
        <p className="mt-8 text-sm text-[var(--color-fg)]/50">
          {t("home.privacyNote")}{" "}
          <Link
            href="/politica-privacidad"
            className="font-medium text-[var(--color-accent)] underline-offset-2 hover:underline"
          >
            {t("home.privacyLink")}
          </Link>
        </p>

        {/* Trust signals */}
        <p className="mt-6 text-xs text-[var(--color-fg)]/40">
          Sin email · Sin tarjeta · Sin suscripción · Sin cuenta · Código abierto
        </p>
      </section>
    </main>
  );
}