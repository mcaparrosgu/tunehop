# BUGS y roturas — TuneHop

> Documento vivo de roturas, causas raíz y decisiones técnicas. Cuando se rompe algo,
> se añade una entrada aquí con el diagnóstico y la solución, para no repetir errores
> y para que otro agente (p. ej. Opus5) pueda dar instrucciones precisas.
> Ultima actualización: 2026-09-02.

---

## 1. Estado general del flujo

```
Landing → Consentimiento (checkbox) → /api/spotify/auth (nativo <a>)
 → Spotify OAuth → callback → /playlists (LEE, funcional ✅)
 → /destino → Connect TIDAL → /api/tidal/auth (nativo <a>) → TIDAL OAuth
 → /migrando → busca ISRC → crea playlist → resultado
```

- **Spotify (leer): FUNCIONAL end-to-end** ✅ (confirmado por la usuaria).
- **TIDAL (escribir): SIN probar de punta a punta** ⚠️ (riesgo, no bug confirmado).

---

## 2. Roturas abiertas

### R1 — TIDAL como destino sin probar (riesgo alto, no bug confirmado)
- **Estado**: El flujo completo TIDAL no está validado.
- **Incógnitas de contrato de API (sin verificar contra docs reales)**:
  - Añadir tracks: `src/lib/tidal.ts` envía `{ trackIds: [...] }` a `POST /playlists/{uuid}/tracks`. Dudoso si el body debe ser `{ trackIds: number[] }` o `{ trackIds: [{ id }] }`.
  - Búsqueda ISRC: `GET /search/tracks?query=isrc:${isrc}` — sintaxis no confirmada.
  - `getCurrentUserId`: se asume `user.userId`; TIDAL puede exponerlo distinto.
  - Scopes pedidos `playlist.create playlist.modify user.read` sin validar.
- **Precauciones conocidas**: Deezer cerró registro de apps (2024); TIDAL rate-limiteó a la usuaria antes → ya hay `200ms` entre búsquedas y `300ms` entre batches.
- **Acción necesaria**: probar el flujo y ajustar el contrato real.

### R2 — Inconsistencia de host Windows/WSL (causa raíz recurrente)
- **Síntoma original**: `ERR_CONNECTION_REFUSED` en `127.0.0.1:3000`; `localhost` de Windows resuelve a `::1` y el relay de WSL **solo reenvía IPv6**, no IPv4 `127.0.0.1`.
- **Workaround (no definitivo)**: usar `http://[::1]:3000` como host único.
- **Riesgo latente**: cualquier cosa que asuma `127.0.0.1`/`localhost` vuelve a fallar. Siempre navegar por `http://[::1]:3000`.
- **Solución definitiva (pendiente)**: `networkingMode=mirrored` en `.wslconfig` (Windows 11 22H2+). No aplicado por falta de confirmación de versión/aplicación.
- **Ojo**: Spotify prohíbe `localhost` como redirect URI; acepta `127.0.0.1` y `[::1]`. TIDAL sin verificar.

### R3 — Inconsistencia de origen para cookies PKCE (mitad del bug resuelto)
- **Causa raíz (daba `State inválido (posible CSRF)`)**: `localhost` y `[::1]` son orígenes distintos para el navegador; la cookie de `state`/`verifier` puesta en un origen no se envía al callback en otro.
- **Estado tras arreglo**: con todo en `[::1]` y navegación nativa, funciona. **Riesgo**: navegar por otra URL (p. ej. `localhost:3000`) lo reaparece.

### R4 — Checkbox que no habilitaba el botón (resuelto, documentar ya no)
- **Causa**: `Checkbox.tsx` emitía el `change` como evento nativo; el consumidor usaba `setAceptado(event.target.checked)` y el estado no se propagaba. Además `Button` con `next/link` no navega bien a OAuth externo.
- **Arreglo**: `Checkbox` emite `onChange(checked: boolean)` + `onChange={setAceptado}`; `Button` tiene `external?: boolean` que renderiza `<a>` nativo.

---

## 3. Roturas cerradas/resueltas (no repetir)

- **C1** El proceso `npm run dev` moría al terminar la shell MCP.
  - Solución: `exec setsid nohup npm run dev ... &` en subshell; el proceso persiste.
  - Nota: `pkill -f "next dev"` cuelga la shell (el patrón coincide con el propio comando) → usar `lsof -ti tcp:3000 | xargs kill`.
- **C2** `npm run dev` arrancaba en 3001 cuando el 3000 estaba ocupado.
  - Solución: limpiar puertos antes de arrancar.
- **C3** Node del sistema (v18) no arranca Next 16 (exige >=20.9).
  - Solución: `nvm use 24` antes de `npm run dev`.
- **C4** Next bloqueaba HMR y `/_next/*` en `[::1]` ("Blocked cross-origin request").
  - Solución: `allowedDevOrigins: ["[::1]", "::1", "localhost", "127.0.0.1"]` en `next.config.ts`.
- **C5** Eliminados `console.log("CALLBACK cookies/state/verifier")` de `src/app/api/spotify/callback/route.ts` (filtraban state y verifier PKCE a logs).

---

## 4. Preguntas de contrato de API pendientes de validar (lista de verificación para TIDAL)

- [ ] Body de `POST /playlists/{uuid}/tracks`: ¿`{ trackIds: number[] }`?
- [ ] Sintaxis de búsqueda ISRC: `query=isrc:X`?
- [ ] Campo para user id: `user.userId`?
- [ ] Scopes correctos para crear/modificar playlists.
- [ ] Redirect URI TIDAL acepta `[::1]` (no `localhost`)?
- [ ] Manejo de token caducado/refresh.

---

## 5. Decisión de destino: Deezer → TIDAL

- **Deezer**: cerró el registro de nuevas apps desde mediados de 2024 ("We're not accepting new application creation at this time"). Inviable como destino para app nueva.
- **Decisión**: TuneHop escribe en **TIDAL** (registro abierto, credenciales en `.env.local`).
- **Pendiente**: actualizar `docs/07-tareas.md` (T21-T25 aún en Deezer).

---

## 6. Datos de entorno para reproducir

```
- WSL/Ubuntu, proyecto en /home/dev/proyectos/Spotify
- Node v24.19.0 (nvm) / npm 11.17.0 (obligatorio para Next 16)
- Next 16.3.4, Turbopack
- Puerto 3000. Host de acceso desde Windows: http://[::1]:3000
- Dev server en background (persiste entre sesiones MCP)
- .env.local: SPOTIFY_CLIENT_ID/SECRET, TIDAL_CLIENT_ID/SECRET,
  NEXT_PUBLIC_APP_URL=http://[::1]:3000
```

---

## 7. Pendientes de decisión

- Probar el tramo TIDAL completo y validar contrato (sección 4).
- Actualizar `docs/07-tareas.md` (Deezer → TIDAL).
- Aplicar `networkingMode=mirrored` en `.wslconfig` (requiere Windows 11 22H2+ y aprobación) para depender de `127.0.0.1` y no `[::1]`.
- Frontend/diseño/logo: decidir cuándo abordarlo.
- Registrar dominio `tunehop.com` (decisión de branding, no bloqueante).
- Commitear reestructuración CLAUDE.md → AGENTS.md y decidir sobre `ARREGLO-OAUTH.md`.
