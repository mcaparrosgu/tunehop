# Rutina de Vigilancia — TuneHop

> Paso 18: qué se revisa, cuándo, y qué se hace cuando algo va mal.
> Última actualización: 2026-09-09
> Fecha de veredicto: **2026-11-09** (90 días tras MVP)

---

## 1. QUÉ SE MIDE DESDE EL PRIMER DÍA

Cada línea de log en las rutas API (`src/lib/logger.ts`) genera un JSON estructurado:

```json
{
  "ts": "2026-09-09T12:00:00Z",
  "level": "info",
  "route": "/api/tidal/search",
  "method": "GET",
  "status": 200,
  "ip": "1.2.3.4",
  "durationMs": 342,
  "found": true,
  "message": "request_end"
}
```

### Métricas a extraer (semanalmente, mirando Vercel Functions → Logs)

| Métrica | De dónde sale | Objetivo | Alerta si |
|---|---|---|---|
| **Tasa de éxito global** | `% de respuestas 2xx` | ≥ 95% | < 90% durante 3 días |
| **Tasa de éxito de búsqueda** | `found:true` en `/search` | ≥ 80% | < 70% durante 3 días |
| **Latencia P95** | `durationMs` de `request_end` | < 500ms | > 2s durante 3 días |
| **Hits de rate limit** | `status:429` en logs | < 5% del total | > 10% (ataque o abuso) |
| **Hits de guardrails** | `error:invalid_isrc\|unsafe_query\|unsafe_title\|too_many_tracks` | Monitorizar | Spike > 10× (probing) |
| **Errores 500** | `level:error` + `status:500` | 0 | > 3 en 1h |
| **Fallos de token** | `error:not_authenticated\|TIDAL_TOKEN_EXPIRED` | Monitorizar | > 10% de las peticiones |

### Lo que NO se mide (por diseño RGPD)
- No se almacenan emails, tokens, ni nombres de playlist fuera de la sesión
- No se rastrea al usuario (no hay analytics en el sentido de tracking)
- No hay cookies de terceros

---

## 2. ALERTAS Y UMBRALES

### Configuración actual (sin dependencia externa)

| Alerta | Umbral | Acción | Dónde se ve |
|---|---|---|---|
| **Errores 500** | > 3 en 1 hora | Investigar inmediatamente | Vercel Dashboard → Logs → filtrar `level:error` |
| **Rate limit alto** | > 10% de peticiones | Posible ataque de abuso | Logs → filtrar `status:429` |
| **Tasa de éxito baja** | < 90% en 3 días | Investigar — degradación de TIDAL o Spotify | Logs manuales (ver §4) |
| **Guardrails disparándose** | Spike > 10× | Posible probing de vulnerabilidades | Logs → filtrar `error:unsafe_query` |

### Futuro (si crece)
- Vercel Analytics ya está disponible en el dashboard (se puede activar sin código)
- Si se usa la IA: Sentry para errores de IA, o un sistema de métricas como Inngest/LangSmith

---

## 3. HERRAMIENTA DE OBSERVABILIDAD

**MVP (ahora):** Vercel Functions Logs + `src/lib/logger.ts` (JSON estructurado).

**Por qué no Sentry/Datadog:** el proyecto es pequeño (7 rutas API, sin IA activa, sin usuarios aún). Añadir un servicio externo sería sobre-ingeniería. Los logs de Vercel ya son queryables y gratuitos para este volumen.

**Si crece (>100 usuarios/semana):**
1. Activar Vercel Analytics (1 clic)
2. Si se activa la IA: Sentry (gratuito para errores, capta el JSON del logger)
3. Si se necesita métricas de IA: Inngest o LangSmith (coste ~$0)

---

## 4. RUTINA SEMANAL (15 minutos, lunes)

```markdown
## Rutina semanal TuneHop — [fecha]

### [1] Errores (3 min)
- [ ] Abrir Vercel Dashboard → tunehop → Logs
- [ ] Filtrar por `level:error` → ¿Algún 500 nuevo?
- [ ] Si sí: qué ruta, cuándo, cuántas veces. Si > 3 en 1h → investigar.

### [2] Tasa de éxito (3 min)
- [ ] En los logs, filtrar `/api/tidal/search` → contar `found:true` vs total
- [ ] ¿Sigue por encima del 80%? Si baja, ¿coincide con cambios en TIDAL?

### [3] Latencia (2 min)
- [ ] Filtrar `durationMs` en los logs → ¿Algún endpoint con >2s P95?
- [ ] Si sí: ¿es TIDAL lento o es nuestro código?

### [4] Rate limit / Guardrails (2 min)
- [ ] Filtrar `status:429` → ¿Muchos? ¿Misma IP?
- [ ] Filtrar `error:unsafe_query` → ¿Alguien probando inyecciones?

### [5] Retirada del modelo (2 min) — solo si la IA está activa
- [ ] Mirar la página de changelog del proveedor:
  - Anthropic: https://docs.anthropic.com/en/docs/about-claude/changelog
  - OpenAI: https://platform.openai.com/docs/changelog
- [ ] ¿Han retirado o cambiado la versión que usamos? Si sí, ver §7.

### [6] Calendario (2 min)
- [ ] ¿Estamos cerca del veredicto (2026-11-09)? Si quedan < 2 semanas → preparar análisis.
```

---

## 5. CICLO DE MEJORA (conversación fallida → caso nuevo)

Cuando un usuario real tenga un problema de matching (y lo reporte, o lo detectemos en logs):

1. **Capturar**: anotar (nombre, artista, resultado esperado, resultado obtenido)
2. **Validar**: ¿es un caso nuevo o ya existe en `evals/golden.yaml`?
3. **Si es nuevo**: añadir una entrada al golden dataset:
   ```yaml
   - input: "nombre del track — artista"
     expected: 1  # número del candidato correcto (o 0 si no debería encontrar)
   ```
4. **Ejecutar evals**: `npx promptfoo eval -c promptfoo.yaml`
5. **Registrar** en `evals/historial.md`: fecha, qué se cambió, métricas, decisión
6. **Si la IA no está activa**: anotar en `docs/bitacora.md` y aparcar para cuando se active

---

## 6. FALLO PUNTUAL vs DEGRADACIÓN REAL

| Señal | Fallo puntual | Degradación real |
|---|---|---|
| Errores 500 | 1–2 en un día, después vuelve a 0 | > 3 en 1h o patrón ascendente durante días |
| Tasa de éxito baja | Baja un día y vuelve al día siguiente | Baja 3+ días seguidos o de forma progresiva |
| Latencia alta | Pico puntual (TIDAL tuvo un bajón) | P95 sube gradualmente durante una semana |
| Hits de rate limit | Picos de 1 IP (bot suelto) | Múltiples IPs, o picos recurrentes |

**Regla**: si un dato anómalo desaparece en 24h → puntual (anotar y olvidar). Si persiste > 3 días o empeora → investigar y actuar.

---

## 7. CAMBIO O RETIRADA DEL MODELO

### Cuándo ocurre
- El proveedor retira la versión del modelo que usamos (ej. `claude-3-5-haiku-20241022` → reemplazado por una nueva versión)
- El proveedor cambia el comportamiento por debajo (misma versión, pero regresiones)

### Dónde mirar avisos de retirada
- Anthropic: https://docs.anthropic.com/en/docs/about-claude/changelog (revisar en §4, paso 5)
- OpenAI: https://platform.openai.com/docs/changelog
- Ambos publican "deprecation notices" con 30–90 días de antelación

### Procedimiento de cambio (si se activa la IA)

1. **Detectar**: en la revisión semanal, ver que el modelo usado ya no está disponible o tiene un aviso de retirada
2. **Seleccionar candidato**: elegir el reemplazo más cercano (misma familia, precio similar)
3. **Ejecutar evals con el nuevo modelo**:
   ```bash
   # En promptfoo.yaml, cambiar el proveedor/versión, luego:
   npx promptfoo eval -c promptfoo.yaml
   ```
4. **Comparar contra el último registro** de `evals/historial.md`:
   - ¿Accuracy ≥ 92%? → Cambiar y anotar en historial
   - ¿Accuracy 85–92%? → Cambiar con precaución, reajustar umbral, monitorear
   - ¿Accuracy < 85%? → **NO cambiar**. Buscar otro modelo o ajustar el system prompt
5. **Anotar** en `evals/historial.md`:
   ```
   | 2026-XX-XX | Cambio modelo: claude-3-5-haiku → claude-3-5-haiku-v2 | Anthropic Claude Haiku | 93% | 100% | 180ms | OK — cambio |
   ```
6. **Si la IA NO está activa**: simplemente actualizar `promptfoo.yaml` con el modelo nuevo y anotar en bitácora. No hay impacto en producción.

---

## 8. VEREDICTO: SEGUIR / PIVOTAR / PARAR

### Fecha fijada: 2026-11-09 (90 días tras el MVP)

### Criterios (extraídos de docs/02-mvp.md §4)

| Métrica | Predicción | Real (a rellenar en 2026-11-09) | Decisión |
|---|---|---|---|
| ≥70% de los que conectan completan 1ª migración | — | __% | |
| Tiempo medio 1ª migración < 5 min | — | __ min | |
| ≥10 usuarios reales | — | __ | |

### Opciones

- **SEGUIR**: ≥70% completan, <5 min, ≥10 usuarios → ampliar features, considerar activar la IA
- **PIVOTAR**: 30–70% completan → investigar dónde se pierden (¿conexión? ¿selección? ¿resultado?) y cambiar solo lo que falle
- **PARAR**: <30% completan o <10 usuarios en 90 días → el problema no es la migración o el canal es malo; archive documentado

### Cómo obtener las métricas (sin analytics)
1. Mirar logs de Vercel: contar `request_end` en `/api/tidal/create-playlist` (creates completados) vs `request_start` en `/api/spotify/auth` (conexiones)
2. Si se activan Vercel Analytics: mucho más fácil
3. Si hay feedback de usuarios: lo que digan en soporte/boca a boca

---

## 9. ENLACES RÁPIDOS

| Qué | Dónde |
|---|---|
| Logs en producción | Vercel Dashboard → tunehop → Logs |
| Evals | `promptfoo.yaml` + `evals/golden.yaml` |
| Historial de cambios IA | `evals/historial.md` |
| Bitácora de decisiones | `docs/bitacora.md` |
| Plan de emergencia | `docs/08-emergencia.md` |
| Checklist pre-lanzamiento | `docs/08-emergencia.md` §1 |