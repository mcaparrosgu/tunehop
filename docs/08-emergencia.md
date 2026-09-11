# Plan de Emergencia — TuneHop

> Dónde ir cuando algo va mal EN PRODUCCIÓN. Léelo ANTES de necesitarlo (Paso 17, puntos 6, 7 y 8).
> Última actualización: 2026-09-09

---

## 1. CHECKLIST PREVIO AL LANZAMIENTO

Antes de publicar una versión, verifica TODO esto. Si algo no está, **no se publica**.

### Puerta de calidad (automática)
- [ ] `npm test` pasa (80 tests, Paso 13)
- [ ] `npm run build` pasa (typecheck incluido)
- [ ] Evals del Paso 14 por encima del umbral (solo si la IA está activa; hoy inactiva)
- [ ] `scripts/gate-quality.sh` termina con "PUERTA SUPERADA" — es la forma de correr 1+2+3 a la vez

### Legal (RGPD — docs/03-legal.md) — COMPROBADO EN PANTALLA, no en código
- [ ] **Política de privacidad publicada y enlazada**: abre `https://tunehop.vercel.app/es/` → el enlace "Política de privacidad" debe estar visible y responder 200
- [ ] **Plazo de conservación configurado**: la política declara "sesión de 3 horas, tokens eliminados al expirar/cerrar" → verificado en pantalla 2026-09-09 ✅
- [ ] **Consentimiento previo**: `/es/consentimiento` muestra checkbox "He leído la política de privacidad y acepto..." ANTES de conectar Spotify → verificado 2026-09-09 ✅
- [ ] **Botón "Eliminar mis datos"**: visible en `/es/playlists` (derecho de supresión Art. 17) → verificado 2026-09-09 ✅
- [ ] **HTTPS**: toda la app accesible por HTTPS (Vercel lo garantiza)
- [ ] **Aviso de transparencia IA**: hoy NO aplica (la IA del Matching Assistant está inactiva; el flujo es 100% humano). **Si se activa la IA**, añadir aviso "esto lo decide una IA" en la pantalla de revisión ANTES de publicar esa versión.

### Funcional
- [ ] OAuth Spotify + TIDAL completan el círculo (conectar → playlists → migrar → resultado)
- [ ] Búsqueda ISRC + fallback nombre/artista
- [ ] Cancelar migración (botón en progreso)
- [ ] Exportar CSV/JSON de no migradas

---

## 2. CÓMO SE DESHACE UNA PUBLICACIÓN MALA (rollback)

**En Vercel (web)** — camino más rápido:
1. Ir a **Vercel Dashboard → tunehop → Deployments**
2. Localizar el último desplegable que funcionaba (marca "Ready", verde)
3. Clic en el menú `⋯` de esa fila → **"Promote to Production"**
4. En 10–30 segundos la producción vuelve a esa versión

**En terminal (CLI)**:
```
vercel rollback
```
(deshace al deployment inmediatamente anterior, solo si el anterior estaba "Ready")

**En git (si el código malo ya está en master)**:
```
git log --oneline -5                     # ver el último buen commit
git revert <SHA-del-commit-malo>         # commit inverso (NO usar reset en master compartido)
git push origin master                   # Vercel lo despliega solo
```

**Regla**: nunca `git reset --hard` en master si ya está pusheado. Usar `revert`.

---

## 3. PROTOCOLO DE INCIDENTES

### 3.1 Registro de incidentes (RGPD Art. 33)
Si hay una **brecha de seguridad** (datos personales expuestos, tokens filtrados, acceso no autorizado):
1. **Contener**: revocar credenciales afectadas (Vercel → Settings → Environment Variables), deshabilitar la app si es grave (`vercel project rm` NO — mejor: `vercel alias` a una página de mantenimiento o pausar).
2. **Documentar en `docs/incidentes.md`**: qué pasó, cuándo, qué datos afectados, cómo se detectó.
3. **Notificar a la autoridad de control** en ≤72h si hay riesgo para los datos de usuarios (art. 33).
4. **Notificar a los usuarios afectados** sin demora indebida (art. 34) si el riesgo es alto.

### 3.2 Incidente técnico (app caída, errores masivos)
| Síntoma | Qué hacer | En <15 min |
|---|---|---|
| 500 en toda la app tras un deploy | Rollback inmediato (sección 2) | `vercel rollback` |
| 500 solo en una ruta (`/migrando`) | Revisar logs → fix → push | `vercel logs` (dashboard) |
| Errores esporádicos (rate limit 429) | Normal — los red team conectó rate limits; avisar si persisten | Revisar dashboard |
| CSS/UI rota | Revisar Tailwind/cambios de versión | Rollback si es grande |

### 3.3 Regla de oro de la bitácora
Cada incidente real → entrada en `docs/bitacora.md`: qué pasó, cómo se detectó, cómo se arregló, qué se cambia para que no vuelva a pasar.

---

## 4. MONITOREO (para cuando haya usuarios reales)

- **Vercel Analytics** (activar en dashboard): errores de página, Core Web Vitals
- **Vercel Functions logs**: mirar `console.error` (los errores ya están logueados en las rutas API)
- **Semanal (documento rutina)**: revisar si aparece algún `sentry`/log inesperado, y añadir fila a `evals/historial.md`

---

## 5. DECISIÓN SEGUIR / PIVOTAR / PARAR (veredicto del Paso 18)

Fecha de veredicto: **2026-11-09** (90 días tras el MVP publicado).
Criterios (hipótesis del Paso 3):
- **Seguir** si: ≥70% de los que conectan completan una migración, y tiempo medio <5 min
- **Pivotar** si: <30% completan (problema no es la migración, es otra cosa)
- **Parar** si: no hay ni 10 usuarios reales en 90 días y no hay señal de boca a boca