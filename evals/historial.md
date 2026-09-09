# Historial de Evaluaciones — TuneHop Matching Assistant

> Tabla de trazabilidad: cada fila = una ejecución de los evals. Qué cambió, qué midió, qué se decidió.
> **Regla**: añadir fila SIEMPRE que cambie prompt, modelo, datos o umbrales.

---

| Fecha | Cambio | Modelo | Accuracy | Format Compliance | Latencia P95 | Decisión |
|---|---|---|---|---|---|---|
| 2026-09-09 | Ejecución inicial (golden.yaml 25 casos, system.md v1, promptfoo v0.122) | pendiente API key | — | — | — | Configurado golden.yaml (25 casos), promptfoo.yaml, golden.yaml. Pendiente: configurar ANTHROPIC_API_KEY / OPENAI_API_KEY y ejecutar primera pasada. |

---

## Próximos pasos

1. Configurar variable de entorno `ANTHROPIC_API_KEY` o `OPENAI_API_KEY`.
2. Ejecutar: `npx promptfoo eval -c promptfoo.yaml`
3. Analizar resultados, ajustar umbrales si hace falta.
4. Añadir fila a esta tabla con resultados reales.