# Paso 6 — Plan Técnico (Stack)

**Fecha**: 31/08/2026
**Estado**: ✅ Aprobado por la alumna
**Stack elegido**: Next.js + TypeScript (todo en uno)

---

## 1. OPCIÓN ELEGIDA: NEXT.JS (TODO EN UNO)

### Por qué Next.js y no Python + JavaScript

| Criterio | Python + JS vanilla | Python + React | **Next.js + TypeScript** |
|---|---|---|---|
| Piezas del proyecto | 2 separados (backend+frontend) | 2 separados | **1 solo proyecto** |
| Lenguajes | 2 (Python + JS) | 2 (Python + JS) | **1 (TypeScript)** |
| Errores de integración | Muchos (comunicación entre proyectos) | Muchos | **Pocos (todo junto)** |
| Velocidad de desarrollo | Normal | Normal | **Rápida** |
| Calidad visual | Básica | Moderna | **Profesional** |
| Deploy | 2 sitios (Vercel+Railway) | 2 sitios | **1 sitio (Vercel)** |
| Coste | 0€ | 0€ | **0€** |
| Valor profesional | Medio | Alto | **Máximo** |
| Cuándo algo se rompe | Mira Python O JS (2 sitios) | Mira Python O JS | **Mira 1 consola** |

### Conceptos que se aprenden construyendo

| Concepto | Qué es | Dónde se ve |
|---|---|---|
| TypeScript | JavaScript con reglas que cogen errores antes | Cada archivo del proyecto |
| React | Construir pantallas con componentes reutilizables | Cada pantalla |
| Componentes | Piezas de UI reutilizables (botones, listas, barras) | Cada pantalla |
| API Routes | Cómo el frontend habla con el backend dentro de Next.js | Cuando conectamos Spotify/Deezer |
| OAuth 2.0 | Cómo la app se conecta a Spotify/Deezer sin contraseñas | Flujo de login |
| Deploy | Cómo una app pasa de "mi ordenador" a "internet" | Cuando publicamos en Vercel |

---

## 2. QUÉ PASA CUANDO ALGO SE ROMPE

| Capa | Dónde mirar | Qué buscar |
|---|---|---|
| **Frontend** (pantallas) | Consola del navegador (F12 → pestaña Console) | Errores en rojo, prompts no renderizados |
| **Backend** (APIs) | Terminal donde corre `npm run dev` | Errores en rojo con stack trace |
| **OAuth** | Consola del navegador + logs del servidor | Códigos de error de Spotify/Deezer (ej: `invalid_grant`, `access_denied`) |
| **Build/despliegue** | Vercel dashboard → pestaña Builds | Errores de compilación TypeScript |

**Regla de oro**: Cualquier error que veas, cópialo tal cual y pégalo aquí. Lo interpretamos juntas.

---

## 3. ESTRUCTURA DEL PROYECTO

```
playmigrate/
├── src/
│   ├── app/                    # Pantallas (Next.js App Router)
│   │   ├── page.tsx            # Landing (Pantalla 1)
│   │   ├── layout.tsx          # Layout general
│   │   ├── globals.css         # Estilos globales
│   │   ├── consentimiento/     # Pantalla 2 (consentimiento)
│   │   │   └── page.tsx
│   │   ├── playlists/          # Pantalla 3 (selección)
│   │   │   └── page.tsx
│   │   ├── destino/            # Pantalla 4 (conectar destino)
│   │   │   └── page.tsx
│   │   ├── migrar/             # Pantalla 5 (progreso)
│   │   │   └── page.tsx
│   │   └── resultado/          # Pantalla 6 (resultado)
│   │       └── page.tsx
│   ├── components/             # Componentes reutilizables
│   │   ├── Button.tsx          # Botón estándar
│   │   ├── Checkbox.tsx        # Checkbox de consentimiento
│   │   ├── PlaylistCard.tsx    # Tarjeta de playlist con checkbox
│   │   ├── ProgressBar.tsx     # Barra de progreso
│   │   └── ErrorMessage.tsx    # Mensaje de error concreto
│   ├── lib/                    # Lógica de negocio
│   │   ├── spotify.ts          # Funciones API de Spotify
│   │   ├── deezer.ts           # Funciones API de Deezer
│   │   ├── isrc.ts             # Búsqueda por ISRC + fallback
│   │   └── migration.ts        # Lógica de migración (tandas, progreso)
│   ├── types/                  # Tipos TypeScript (modelos de datos)
│   │   ├── playlist.ts
│   │   ├── track.ts
│   │   └── migration.ts
│   └── api/                    # API Routes (backend)
│       ├── spotify/
│       │   ├── auth/route.ts
│       │   ├── callback/route.ts
│       │   └── playlists/route.ts
│       ├── deezer/
│       │   ├── auth/route.ts
│       │   ├── callback/route.ts
│       │   └── playlists/route.ts
│       └── migrate/route.ts
├── public/                     # Imágenes, iconos
├── .env.local                  # Secretos (NO se sube a git)
├── .env.example                # Ejemplo de variables de entorno
├── package.json
├── tsconfig.json
├── next.config.ts
└── tailwind.config.ts
```

---

## 4. MODELO DE DATOS (TYPESCRIPT)

### Playlist

```typescript
interface Playlist {
  id: string;
  name: string;
  description: string;
  trackCount: number;
  tracks: Track[];
  status: 'pendiente' | 'en_progreso' | 'completada' | 'parcial' | 'fallida';
}
```

### Canción (Track)

```typescript
interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  isrc: string | null;
  durationMs: number;
  status: 'pendiente' | 'encontrado' | 'no_encontrado';
  reason?: string;
}
```

### Migración

```typescript
interface Migration {
  id: string;
  startedAt: Date;
  finishedAt: Date | null;
  totalPlaylists: number;
  totalTracksFound: number;
  totalTracksNotFound: number;
  status: 'en_progreso' | 'completada' | 'cancelada' | 'fallida';
  error?: string;
}
```

---

## 5. GESTIÓN DE SECRETOS

**Regla absoluta**: Las claves NUNCA van en el código. Siempre en variables de entorno.

| Secretos | Dónde van (desarrollo) | Dónde van (producción) | NUNCA van en |
|---|---|---|---|
| `SPOTIFY_CLIENT_ID` | `.env.local` | Vercel Environment Variables | Código fuente, git, wiki |
| `SPOTIFY_CLIENT_SECRET` | `.env.local` | Vercel Environment Variables | Código fuente, git, wiki |
| `DEEZER_APP_ID` | `.env.local` | Vercel Environment Variables | Código fuente, git, wiki |
| `DEEZER_APP_SECRET` | `.env.local` | Vercel Environment Variables | Código fuente, git, wiki |
| `NEXTAUTH_SECRET` | `.env.local` | Vercel Environment Variables | Código fuente, git, wiki |

`.env.local` está en `.gitignore` — nunca se sube a git.

**Cómo se usan en el código:**

```typescript
// En cualquier archivo TypeScript:
const clientId = process.env.SPOTIFY_CLIENT_ID;
```

**Producción (Vercel):**
1. Ir a Vercel Dashboard → tu proyecto → Settings → Environment Variables
2. Añadir cada variable con su valor
3. Vercel las inyecta automáticamente al desplegar

---

## 6. COSTES ESTIMADOS AL MES

| Servicio | Tier gratuito | Coste |
|---|---|---|
| Vercel (hosting + deploy) | Hobby: 100GB bandwidth | 0€ |
| GitHub (código fuente) | Free: repos ilimitados | 0€ |
| Spotify API | Gratuito (Developer Dashboard) | 0€ |
| Deezer API | Gratuito (Developer Portal) | 0€ |
| **Total** | | **0€/mes** |

**Cuándo empezar a pagar:** Si la app supera 100GB de tráfico al mes (aprox. 100.000 visitas), Vercel cobra $20/mes. Para el MVP, 0€ es suficiente.

---

## 7. LO QUE VA A DOLER

| Dolor | Por qué duele | Cómo mitigarlo |
|---|---|---|
| **OAuth con Spotify + Deezer** | Cada plataforma tiene su flujo, scopes y errores propios. Configurar los dos y probar que funcionan juntos es el paso más lento | Seguir la documentación oficial paso a paso. Probar cada OAuth por separado antes de integrarlos |
| **Búsqueda por ISRC** | Spotify y Deezer devuelven resultados diferentes. A veces el ISRC no existe. A veces hay 3 canciones con el mismo nombre | Implementar el fallback (nombre+artista) desde el inicio. No dejarlo para después |
| **Tandas de migración** | Gestionar progreso de 50 playlists con errores parciales, reintentos, y actualizar la barra de progreso en tiempo real | Empezar con 1 playlist → luego 5 → luego 50. Construir incrementalmente |

---

## 8. FLUJO TÉCNICO COMPLETO (PASO A PASO)

```
1. María entra en playmigrate.com
2. Ve la Landing → pulsa "Connect Spotify"
3. Marca checkbox de consentimiento → pulsa "Conectar con Spotify"
4. Spotify muestra pantalla de autorización → María acepta
5. Spotify redirige a /api/spotify/callback con el código de autorización
6. Backend intercambia el código por access_token + refresh_token
7. Backend usa el token para llamar a Spotify API: obtener playlists
8. Se muestra la lista de playlists (Pantalla 3)
9. María selecciona playlists → pulsa "Continuar"
10. Pantalla 4: "Connect Deezer" → mismo flujo OAuth con Deezer
11. Backend tiene tokens de Spotify Y Deezer
12. Para cada playlist seleccionada:
    a. Obtener tracks de Spotify (con ISRC)
    b. Para cada track: buscar en Deezer por ISRC
    c. Si no se encuentra: fallback a nombre + artista
    d. Recopilar IDs de tracks encontrados en Deezer
    e. Crear playlist en Deezer con esos tracks
    f. Actualizar barra de progreso
13. Si hay más de 50 playlists: siguiente tanda con pausa de 1s
14. Mostrar resumen (Pantalla 6)
15. María puede: migrar más / borrar datos / abrir Deezer
```

---

*Documento generado en el Paso 6 del método de 20 pasos.*
*Siguiente paso: Paso 7 — Rol de la IA.*
