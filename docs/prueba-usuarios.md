# Prueba de Usuarios — TuneHop

> Preparación: Paso 16 completado (red team + fixes). App desplegada en producción.
> Fecha de preparación: 2026-09-09
> Fecha estimada de ejecución: una vez reclutadas 5 personas (ver §1)

---

## 1. A QUIÉN BUSCO

**Perfil objetivo** (extraído de docs/00-problema.md):
- María, ~30–40 años, no técnica, freelance o asalariada
- Tiene cuenta Spotify con 1+ año de uso y varias playlists propias
- Ha probado o quería probar Tidal/Deezer pero se frustró migrando
- Usa móvil y ordenador por igual

**¿De dónde saco 5 personas así?**
1. Círculo cercano de la desarrolladora (amigas, compañeras de coworking)
2. Comunidades:.reddit r/spotify, foros de Tidal, grupos de Facebook "música y streaming"
3. Encuestas breves en Instagram stories: "¿Quieres dejar Spotify pero da pereza migrar playlists?"

**¡CUIDADO!** Si las 5 fáciles de conseguir son amigas de la desarrolladora, no son representativas del usuario real. En ese caso, decídmelo antes de empezar: probar con personas equivocadas es peor que no probar.

---

## 2. GUION — 3 TAREAS

Cada tarea es un **objetivo que la persona intenta lograr**, no una instrucción.

### Tarea 1 — Conectar Spotify y ver playlists
> "Entra en tunehop.com e intenta conectar tu cuenta de Spotify para ver tus playlists."

Qué miro: ¿encuentra el botón? ¿entra en Spotify? ¿completa el OAuth? ¿ve sus playlists? ¿sabe qué hacer al verlas?

### Tarea 2 — Seleccionar y migrar
> "Selecciona una o dos playlists de las tuyas e intenta migrarlas a Tidal."

Qué miro: ¿selecciona? ¿encuentra "Migrar"? ¿conecta Tidal? ¿ve progreso? ¿entiende el resultado?

### Tarea 3 — Gestionar resultado
> "Cuando termine la migración, mira si puedes ver qué canciones no se encontraron y exportar esa lista."

Qué miro: ¿encuentra el resumen? ¿sabe qué significan los números? ¿hace clic en exportar? ¿entiende el CSV?

---

## 3. LAS REGLAS (antes de empezar, recordar a la persona evaluadora)

1. **NO ayudar**: si se atasca, esperar. Anotar dónde se para.
2. **NO explicar**: no decir "pulsa ahí", "es el botón azul", "eso es normal".
3. **NO justificar**: no decir "es que el diseño es así porque...".
4. **Pensar en voz alta**: pedirle que vaya diciendo lo que piensa mientras hace.
5. **Anotar**:
   - Dónde se para (más de 5 segundos = señal)
   - Qué hace en vez de lo esperado
   - Qué dice con **sus palabras exactas**
   - Si pide ayuda (eso ya es fracaso de UX)

---

## 4. QUÉ DATOS PIDO Y CUÁLES NO

| Pido | NO pido |
|------|---------|
| Nombre o alias (para identificar en la bitácora) | Email real, contraseña, datos bancarios |
| Cuenta de Spotify (solo si la tiene) | Permisos de app, tokens, access keys |
| Que pruebe el flujo con SUS datos reales | Que suba datos personales a ningún servicio |
| Consentimiento verbal (grabar si es remoto) | Grabación de pantalla sin consentimiento |
| Opinión al final: ¿lo recomendarías? ¿qué fue lo peor? | Datos de geolocalización, dispositivo exacto |

**RGPD**: los datos de la prueba se guardan SOLO en `docs/prueba-usuarios.md`. No se comparten. Se borran tras el caso de estudio (Paso 19).

---

## 5. PLANTILLA DE BITÁCORA (una por persona)

```markdown
## [Nombre/Alias] — [Fecha]

**Perfil**: [edad aprox., usa Spotify多久, tiene Tidal/Deezer]
**Dispositivo**: [móvil/ordenador + SO + navegador]

### Tarea 1 — Conectar Spotify
- [x/❌] Completó OAuth
- Tiempo: [X min]
- Dudas: [dónde se paró, qué dijo]
- Lo que hizo inesperado: [si aplica]
- Citas exactas: []

### Tarea 2 — Seleccionar y migrar
- [x/❌] Seleccionó playlists
- [x/❌] Pulsó Migrar
- [x/❌] Conectó Tidal
- Tiempo: [X min]
- Dudas: [dónde se paró, qué dijo]
- Citas exactas: []

### Tarea 3 — Gestionar resultado
- [x/❌] Vio resumen
- [x/❌] Encontró no encontradas
- [x/❌] Exportó lista
- Tiempo: [X min]
- Dudas: [dónde se paró, qué dijo]

### Valoración global
- ¿Lo recomendaría? [1-5]
- ¿Qué fue lo peor?
- ¿Qué fue lo mejor?
- Frases clave: []
```

---

## 6. MÉTRICAS A ANOTAR

| Métrica | Objetivo | Se mide con |
|---------|----------|-------------|
| Tiempo total primera migración | < 5 min | Cronómetro |
| Completar conexión Spotify | 100% | Sí/no |
| Encontrar botón "Migrar" | 100% | Observación |
| Conectar Tidal sin ayuda | 100% | Sí/no |
| Entender resumen al final | ≥ 80% | Observación + pregunta |
| Tasa de éxito de búsqueda | ≥ 80% | Datos de la migración real |
| Pedir ayuda | 0 veces | Observación |

---

## 7. DESPUÉS DE LA PRUEBA

1. Anotar hallazgos en `docs/prueba-usuarios.md`
2. Clasificar problemas: crítico / mejora / observación
3. Arreglar los críticos ANTES del Paso 17 (publicar)
4. Añadir entrada a `docs/bitacora.md`
5. Borrar datos personales de la bitácora (solo alias)