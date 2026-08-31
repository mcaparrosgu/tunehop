# PlayMigrate

Migra tus playlists de Spotify a otras plataformas musicales con un clic.

## Qué es

PlayMigrate es una aplicación web que permite a cualquier persona con cuenta de Spotify migrar sus playlists a plataformas que pagan mejor a los artistas (Deezer, próximamente TIDAL).

El proceso es simple:
1. Conecta tu cuenta de Spotify
2. Selecciona las playlists que quieres migrar
3. Elige la plataforma destino
4. La app busca las canciones por código universal (ISRC) y las copia

Tus datos se borran al cerrar la sesión. No guardamos nada.

## Requisitos

- Node.js 18 o superior
- npm o yarn
- Cuenta en Spotify Developer Dashboard
- Cuenta en Deezer Developer Portal

## Instalación local

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/playmigrate.git
cd playmigrate

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local

# Rellenar valores reales en .env.local (ver sección siguiente)

# Ejecutar en modo desarrollo
npm run dev
```

Abre http://localhost:3000 en tu navegador.

## Variables de entorno

Rellena `.env.local` con tus claves reales:

| Variable | Dónde obtenerla |
|---|---|
| `SPOTIFY_CLIENT_ID` | [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) |
| `SPOTIFY_CLIENT_SECRET` | Spotify Developer Dashboard → tu app → Settings |
| `DEEZER_APP_ID` | [Deezer Developer Portal](https://developers.deezer.com) |
| `DEEZER_APP_SECRET` | Deezer Developer Portal → tu app |
| `NEXTAUTH_SECRET` | Genera uno: `openssl rand -base64 32` |

**NUNCA subas `.env.local` a git.** Ya está en `.gitignore`.

## Despliegue en producción

1. Sube el código a GitHub
2. Conecta el repositorio a [Vercel](https://vercel.com)
3. Configura las variables de entorno en Vercel Dashboard → Settings → Environment Variables
4. Configura los Redirect URIs en Spotify y Deezer apuntando a tu URL de Vercel

## Tecnologías

- [Next.js](https://nextjs.org/) — Framework de React
- [TypeScript](https://www.typescriptlang.org/) — JavaScript con tipos
- [Tailwind CSS](https://tailwindcss.com/) — Estilos

## Licencia

MIT
