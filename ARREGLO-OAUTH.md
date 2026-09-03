# Encargo: arreglar el login OAuth de Spotify (y dejar el dev server sano)

> Escrito tras una sesión de diagnóstico desde Claude Code. Lee esto entero antes de
> tocar nada. El objetivo es **que el flujo "Conectar con Spotify" complete y llegue a
> `/playlists`**, no seguir parcheando componentes sueltos.

---

## 1. Síntoma

Al pulsar **"Conectar con Spotify"** en `/consentimiento`, el flujo acaba en
`/error?message=State%20inv%C3%A1lido%20(posible%20CSRF)` (o a veces
`"Faltan parámetros en el callback"`).

El callback es `src/app/api/spotify/callback/route.ts`. Falla en una de estas dos guardas:

```ts
if (!code || !state || !verifier) { /* -> "Faltan parámetros" */ }
if (state !== savedState)         { /* -> "State inválido (posible CSRF)" */ }
```

`savedState` y `verifier` salen de las cookies `spotify_oauth_state` y
`spotify_pkce_verifier`, que se ponen en `src/app/api/spotify/auth/route.ts`.
**El problema es que esas cookies no llegan al callback.** No es CSRF real.

---

## 2. Causa raíz (son DOS cosas, hay que arreglar las dos)

### 2a. Inconsistencia de host → la cookie se pone en un origen y se lee en otro

`NEXT_PUBLIC_APP_URL` se usa como base del `redirect_uri` de Spotify **y** como base de
todos los `Response.redirect(...)` del callback. Ahora mismo vale `http://[::1]:3000`.

El flujo es: navegador → `/api/spotify/auth` (pone cookies en el **origen por el que se
abrió la app**) → 302 a `accounts.spotify.com` → el usuario acepta → Spotify redirige a
`redirect_uri` → `/api/spotify/callback` lee las cookies.

Si el **host del navegador**, el de **`NEXT_PUBLIC_APP_URL`** y el **registrado en el
dashboard de Spotify** no son *idénticos carácter a carácter*, el navegador considera
que son orígenes distintos y **no manda** `spotify_oauth_state` / `spotify_pkce_verifier`
al callback → `savedState` sale `undefined` → mismatch.

Combinaciones que rompen (todas presentes como riesgo aquí):
- Abrir la app en `http://localhost:3000` pero `NEXT_PUBLIC_APP_URL=http://[::1]:3000`.
- Abrir en `[::1]` y tener el dashboard con `127.0.0.1` (o al revés).
- Que en algún momento `next dev` cogiera el puerto **3001** (pasa cuando 3000 está
  ocupado; ya ocurrió en los logs) y se hiciera el `auth` en :3001 y el callback en :3000.

Reglas de Spotify para `redirect_uri` sin HTTPS (loopback):
- Permite **`http://127.0.0.1:<port>/...`** y **`http://[::1]:<port>/...`**.
- **NO permite `http://localhost:...`** (da `INVALID_CLIENT: Invalid redirect URI`).

Restricción de este entorno (WSL2 + relay): **desde Windows solo se alcanza
`http://[::1]:3000`**. `http://127.0.0.1:3000` da "conexión rechazada" porque el relay de
WSL solo publica IPv6. Comprobado en la sesión:

```
FROM WINDOWS:  127.0.0.1 -> conexión rechazada   |   [::1] -> HTTP 200   |   localhost -> HTTP 200
```

➡️ **Decisión: usar `[::1]` en los tres sitios.** (Si prefieres `127.0.0.1`, hay que
activar antes `networkingMode=mirrored` en `C:\Users\ganja\.wslconfig` y `wsl --shutdown`.)

### 2b. El botón de conexión usa `next/link` en vez de navegación real del navegador

`src/app/consentimiento/page.tsx`:

```tsx
<Button href="/api/spotify/auth" disabled={!aceptado} className="w-full">
```

`src/components/Button.tsx` renderiza eso como `<Link href="/api/spotify/auth">`
(`next/link`). `next/link` hace **navegación del router (RSC fetch)**, no una navegación
de página completa. Para un Route Handler que responde `302` hacia un **dominio externo**
(`accounts.spotify.com`), eso es frágil: el router intenta tratarlo como ruta interna,
puede prefetchear la ruta (quemando el `state`/`verifier` antes de tiempo) y no sigue
bien el redirect cross-origin. En los logs se ve la petición entrando como navegación
RSC (`vary: rsc, next-router-state-tree, next-router-prefetch`).

➡️ El arranque de OAuth tiene que ser una **navegación nativa**: `<a href>` normal (sin
`next/link`), o `<form method="GET" action="/api/spotify/auth">`, o
`onClick={() => window.location.assign("/api/spotify/auth")}`.

**Lo mismo aplica a `/api/tidal/auth`** en `src/app/destino/page.tsx` (mismo patrón
`<Button href=...>`).

---

## 3. Plan de arreglo (en orden, verificando cada paso)

### Paso 0 — Un solo dueño del dev server

**No hagas `pkill -f "next dev"` a ciegas.** Hubo dos agentes (Claude Code y opencode)
matándose mutuamente el `next dev` y el `next build`, dejando el entorno sin servidor y
con un **lock obsoleto** en `.next/dev/lock`. A partir de ahora el dev server es tuyo
(opencode) y solo tuyo.

Primero **comprueba si ya hay uno sirviendo** y, si lo hay, úsalo tal cual:

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://[::1]:3000/     # 200 => YA hay server, no toques nada
```

Solo si eso NO responde 200, arráncalo:

```bash
# ¿lock obsoleto? (Next dice "Another next dev server is already running" y salta a :3001)
cat /home/dev/proyectos/Spotify/.next/dev/lock 2>/dev/null      # mira el "pid"
#   -> si ese PID no existe (ps -p <pid>), borra el lock:
rm -f /home/dev/proyectos/Spotify/.next/dev/lock

cd /home/dev/proyectos/Spotify
nvm use 24                                          # OBLIGATORIO: el Node 18 del sistema NO arranca Next 16
node -v                                             # -> v24.x  (Next 16 exige >=20.9.0)
npm run dev
```

Confirma en el log que arranca en **:3000** (no :3001). Si arranca en :3001 es que hay
otro `next dev` vivo o un lock obsoleto: resuélvelo, no sigas el flujo OAuth repartido
entre dos puertos.

> Estado al escribir esto: hay un dev server corriendo en `http://[::1]:3000` (Node v24),
> arrancado desde fuera de opencode. Si responde 200, trabaja sobre él; cuando quieras
> tomar el control, mátalo por su PID concreto (`cat .next/dev/lock`), borra el lock y
> arranca el tuyo.

### Paso 1 — Host consistente en `[::1]`
- `.env.local`: dejar exactamente `NEXT_PUBLIC_APP_URL=http://[::1]:3000` (ya está así).
- Dashboard de Spotify (https://developer.spotify.com/dashboard → la app → Settings →
  Redirect URIs): que exista **exactamente** `http://[::1]:3000/api/spotify/callback`
  y ninguna variante con `localhost`. Guardar.
- Abrir SIEMPRE la app en `http://[::1]:3000` (no `localhost`, no `127.0.0.1`).
- Cualquier cambio en `NEXT_PUBLIC_APP_URL` (es `NEXT_PUBLIC_`, se inlinea) **requiere
  reiniciar `npm run dev`**.

### Paso 2 — Navegación nativa para arrancar OAuth
En `src/app/consentimiento/page.tsx`, sustituir el `<Button href="/api/spotify/auth">`
por un enlace `<a>` real con el mismo aspecto. Ejemplo mínimo:

```tsx
<a
  href="/api/spotify/auth"
  aria-disabled={!aceptado}
  onClick={(e) => { if (!aceptado) e.preventDefault(); }}
  className={/* mismas clases que el Button primary; si !aceptado, opacidad + pointer-events-none */}
>
  Conectar con Spotify
</a>
```

o, más limpio, un formulario:

```tsx
<form method="GET" action="/api/spotify/auth">
  <button type="submit" disabled={!aceptado} className={/* clases del Button */}>
    Conectar con Spotify
  </button>
</form>
```

Opción B (menos invasiva): añadir a `src/components/Button.tsx` un modo que renderice
`<a href>` nativo (prop tipo `external` o `nativeHref`) y usarlo aquí. **No** dejes que
este caso pase por `next/link`.

Aplicar el mismo cambio a `src/app/destino/page.tsx` para `/api/tidal/auth`.

### Paso 3 — Probar el flujo entero
1. Abre `http://[::1]:3000/consentimiento`, marca el check, pulsa "Conectar con Spotify".
2. Debe ir a `accounts.spotify.com`, aceptas, y **volver a `http://[::1]:3000/playlists`**
   sin pasar por `/error`.
3. Mira el log del dev server. Con los `console.log` de debug que ya hay en el callback,
   en el caso bueno verás algo como:
   ```
   CALLBACK cookies received: [ 'spotify_oauth_state', 'spotify_pkce_verifier' ]
   CALLBACK savedState: <hex>
   CALLBACK received state: <el mismo hex>
   ```
   Si `cookies received` sale **vacío** o sin esas dos → sigue siendo problema de host
   (Paso 1) o de `next/link` (Paso 2), no toques la lógica del callback.

### Paso 4 — Limpieza (solo cuando el flujo funcione)
- Quitar de `src/app/api/spotify/callback/route.ts` los `console.log` de debug
  (`CALLBACK cookies received`, `CALLBACK savedState`, `CALLBACK verifier`,
  `CALLBACK received state`, `CALLBACK validation failed`, `CALLBACK state mismatch`).
  Vuelcan el `state` y el `verifier` PKCE a los logs del servidor.
- `tsconfig.tsbuildinfo` está sin trackear → añádelo a `.gitignore`.
- `docs/07-tareas.md` habla de **Deezer** pero el código implementado es **TIDAL**
  (commit `bbb8ea1`). Actualiza la tabla o déjalo anotado; no es un bug de runtime.

---

## 4. Qué NO es el bug (no pierdas tiempo aquí)

- **`Response.redirect(url, 302)` en los Route Handlers**: en Next 16 SÍ propaga las
  cabeceras `Set-Cookie` puestas con `cookies().set()`. Verificado en la sesión: la
  respuesta de `/api/spotify/auth` incluye los dos `set-cookie` correctos
  (`HttpOnly; SameSite=lax; Path=/`). No hace falta migrar a `NextResponse`.
- **`sameSite: "lax"`**: correcto para este flujo (el retorno de Spotify es una
  navegación GET top-level). No lo cambies a `none`/`strict`.
- **`secure: process.env.NODE_ENV === "production"`**: correcto; en dev va por HTTP.
- **`next.config.ts` → `allowedDevOrigins`**: ya lo añadió la sesión anterior para
  desbloquear el HMR desde `[::1]`. Es correcto, no lo quites.
- **`next-env.d.ts`** (`.next/types` → `.next/dev/types`): lo regenera Next 16 solo.
- **`getAuthUrl(challenge, state)`** en `src/lib/spotify-auth.ts` nombra el primer
  parámetro `verifier` pero recibe el `challenge` y lo usa como `code_challenge`. El
  valor es correcto; solo es un nombre confuso. Cosmético.

---

## 5. Resumen de archivos

| Archivo | Acción |
|---|---|
| `.env.local` | `NEXT_PUBLIC_APP_URL=http://[::1]:3000` (verificar, no cambiar) |
| Dashboard Spotify | Redirect URI `http://[::1]:3000/api/spotify/callback` exacto |
| `src/app/consentimiento/page.tsx` | Arrancar OAuth con `<a href>`/`<form>`, no `next/link` |
| `src/app/destino/page.tsx` | Igual para `/api/tidal/auth` |
| `src/components/Button.tsx` | (opcional) modo `<a>` nativo |
| `src/app/api/spotify/callback/route.ts` | Quitar `console.log` de debug al final |
| `.gitignore` | Añadir `tsconfig.tsbuildinfo` |
| Dev server | Reiniciar con `nvm use 24 && npm run dev`, puerto 3000 |
