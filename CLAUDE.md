# CLAUDE.md

@AGENTS.md

---

## ⚠️ Recordatorio: Evals del Matching Assistant (Paso 14)

**Siempre que cambies**:
- `prompts/system.md` (system prompt)
- `evals/golden.yaml` (dataset dorado)
- El modelo (proveedor/versión en `promptfoo.yaml`)
- Los umbrales en `promptfoo.yaml`

**Debes**:
1. Relanzar los evals: `npx promptfoo eval -c promptfoo.yaml`
2. Añadir una fila a `evals/historial.md` con: fecha, qué cambió, modelo, accuracy, format compliance, latencia P95, decisión.

> Sin esta tabla, cuando la calidad baje no habrá forma de saber desde cuándo ni por culpa de qué. El historial de git no explica los cambios de calidad de IA.