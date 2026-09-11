import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { getMessages } from "next-intl/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TuneHop — Migra playlists de Spotify a TIDAL",
  description:
    "Migra tus playlists de Spotify a TIDAL en minutos. TuneHop solo lee tu Spotify: no modifica, borra ni mueve nada. Tus datos se borran al cerrar la sesión.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#contenido"
          className="sr-only sr-only-focusable"
        >
          Saltar al contenido
        </a>
        <div id="contenido" className="flex flex-1 flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
