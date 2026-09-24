# TuneHop

**Producción: https://tunehop.vercel.app**

Migra tus playlists de Spotify a TIDAL con un clic.

## Qué es

TuneHop es una aplicación web que permite a cualquier persona con cuenta de Spotify migrar sus playlists a TIDAL, la plataforma que paga mejor a los artistas.

El proceso es simple:
1. Conecta tu cuenta de Spotify
2. Selecciona las playlists que quieres migrar
3. Conecta tu cuenta de TIDAL
4. La app busca las canciones por código universal (ISRC) y las copia

Tus datos se borran al cerrar la sesión. No guardamos nada.

## Modelo de acceso (importante)

La API de Spotify limita las apps en **modo desarrollo a 5 usuarios** y la cuota extendida solo se concede a organizaciones (≥250.000 MAU). Por eso TuneHop **no** es una app pública única que lea Spotify en nombre de todo el mundo: es **un motor con varias puertas de entrada**.

| Puerta | Entrada | ¿Usa la API de Spotify? | Estado |
|---|---|---|---|
| 1. Beta cerrada | Login de Spotify (máx. 5 personas) | Sí | Funciona |
| 2. Autoalojado (tu propia app) | Login con tu Client ID | Sí (la tuya) | Pendiente |
| 4. Archivo | Subes un CSV/JSON exportado | **No** | Pendiente (prioridad) |
| 5. Playlist pública | Enlace público, sin login | Sí (datos públicos) | Pendiente |
| 6. Open source autoalojado | = puerta 2 + guía | Sí | Pendiente |

Detalle y plan en [`docs/tech-decision-puertas.md`](docs/tech-decision-puertas.md).

## Requisitos

- Node.js 18 o superior
- npm o yarn
- Cuenta en Spotify Developer Dashboard
- Cuenta en TIDAL Developer Portal (developer.tidal.com)

## Instalación local

```bash
# Clonar el repositorio
git clone https://github.com/mcaparrosgu/tunehop.git
cd tunehop

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
| `TIDAL_CLIENT_ID` | [TIDAL Developer Portal](https://developer.tidal.com) |
| `TIDAL_CLIENT_SECRET` | TIDAL Developer Portal → tu app |

**NUNCA subas `.env.local` a git.** Ya está en `.gitignore`.

## Despliegue en producción

1. Sube el código a GitHub
2. Conecta el repositorio a [Vercel](https://vercel.com)
3. Configura las variables de entorno en Vercel Dashboard → Settings → Environment Variables
4. Configura los Redirect URIs en Spotify y TIDAL apuntando a tu URL de Vercel

## Tecnologías

- [Next.js](https://nextjs.org/) — Framework de React
- [TypeScript](https://www.typescriptlang.org/) — JavaScript con tipos
- [Tailwind CSS](https://tailwindcss.com/) — Estilos

## Licencia

MIT
