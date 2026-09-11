#!/usr/bin/env bash
# Puerta de calidad — TuneHop (Paso 17, punto 4)
# Se ejecuta ANTES de cada deploy (local y en CI).
# Falla si: (1) tests no pasan, (2) build falla, (3) evals IA bajan del umbral.
#
# Los evals (Paso 14) solo corren si hay API key configurada.
# Sin API key → avisa pero no bloquea (son la puerta de la IA, que hoy está inactiva).

set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> [1/3] Tests automáticos (Paso 13)"
npm test -- --silent

echo "==> [2/3] Build + typecheck"
npm run build

echo "==> [3/3] Evals del Matching Assistant (Paso 14)"
if [[ -n "${ANTHROPIC_API_KEY:-}" || -n "${OPENAI_API_KEY:-}" ]]; then
  npx promptfoo eval -c promptfoo.yaml --threshold accuracy:0.92
  echo "    ✓ Evals por encima del umbral (accuracy ≥ 0.92)"
else
  echo "    ⚠️  Sin ANTHROPIC_API_KEY/OPENAI_API_KEY: evals NO ejecutados."
  echo "    ⚠️  La IA está inactiva en el MVP, pero ANTES de activarla debes correr esta puerta con la key."
fi

echo ""
echo "✅ PUERTA DE CALIDAD SUPERADA — listo para desplegar."