# Paso 3 — MVP (Mínimo Viable Product)

> Regla de Lean Startup: "Si no te da vergüenza la primera versión, es que lanzaste demasiado tarde."
> Recortamos hasta lo mínimo que tiene valor real para María.

---

## 1. RECORRIDO CRÍTICO

La **única secuencia de acciones** que María debe poder completar de principio a fin:

```
Entrar en la web → Conectar Spotify → Ver sus playlists → Seleccionar una → Elegir destino (Deezer) → Migrar → Ver resultado
```

Si algo de esto falla, el producto no tiene valor. Punto.

---

## 2. HISTORIAS DEL MVP (10 historias)

### Bloque A — Conexión a Spotify
| # | Historia | Prioridad | Por qué entra |
|---|----------|-----------|---------------|
| H1 | Conectar cuenta de Spotify | IMPRESCINDIBLE | Sin esto, nada funciona |
| H2 | Credenciales de Spotify (Client ID) | IMPRESCINDIBLE | Sin esto, OAuth no arranca |

### Bloque B — Selección
| # | Historia | Prioridad | Por qué entra |
|---|----------|-----------|---------------|
| H3 | Ver y seleccionar playlists (con "Seleccionar todo") | IMPRESCINDIBLE | María tiene 347 playlists, necesita elegir cuáles |

### Bloque C — Conexión destino
| # | Historia | Prioridad | Por qué entra |
|---|----------|-----------|---------------|
| H4 | Conectar con Deezer | IMPRESCINDIBLE | Sin destino, no hay migración |

**¿Por qué solo Deezer y no TIDAL?**
- Deezer tiene API pública completa y gratuita desde el registro.
- TIDAL tiene un matiz de "access tiers" que puede bloquearnos en la búsqueda de tracks (requiere verificar si el tier `THIRD_PARTY` cubre los endpoints de búsqueda). Es un riesgo que no queremos en el MVP.
- **Deezer = zero friction.** TIDAL = friction potencial. MVP = zero friction.

### Bloque D — Ejecución
| # | Historia | Prioridad | Por qué entra |
|---|----------|-----------|---------------|
| H5 | Migrar playlists seleccionadas | IMPRESCINDIBLE | El core del producto |
| H6 | Ver progreso en tiempo real | IMPORTANTE | Sin esto, María piensa que la app se colgó |

### Bloque E — Resultados
| # | Historia | Prioridad | Por qué entra |
|---|----------|-----------|---------------|
| H8 | Ver resumen de la migración | IMPRESCINDIBLE | María necesita saber qué pasó |

### Bloque F — Calidad de búsqueda
| # | Historia | Prioridad | Por qué entra |
|---|----------|-----------|---------------|
| H10 | Buscar por ISRC con fallback a nombre/artista | IMPRESCINDIBLE | Sin esto, no encontramos canciones |

### Bloque G — Robustez
| # | Historia | Prioridad | Por qué entra |
|---|----------|-----------|---------------|
| H11 | Gestionar token caducado | IMPRESCINDIBLE | Si el token muere a mitad de migración, María pierde todo |

### Bloque H — Feedback
| # | Historia | Prioridad | Por qué entra |
|---|----------|-----------|---------------|
| H14 | Indicador de carga en cada paso | IMPORTANTE | Sin esto, la app parece rota |

**Total MVP: 10 historias de las 19 originales.**

---

## 3. VERSIÓN 2 (aparcado, no se toca)

| Historia | Por qué no entra en MVP |
|----------|------------------------|
| H7 — Lista de no encontradas | El resumen del H8 ya muestra "X de Y encontradas". La lista detallada es nice-to-have |
| H7b — Alternativas automáticas | Complejidad extra. Con ISRC + fallback cubrimos el 90%. Las alternativas son v2 |
| H9 — Ver playlists en destino | El usuario puede abrir Deezer manualmente. No es esencial para la migración |
| H12 — Reintentar automáticamente | Friction adicional. H11 + un botón "Reintentar" manual basta |
| H13 — Avisar servicio caído | Edge case. Se cubre con un mensaje de error genérico |
| H15 — Cancelar migración | Complexidad de implementación. María puede cerrar la pestaña |
| H16 — Álbumes guardados | Funcionalidad nueva, no core |
| H17 — Artistas seguidos | Funcionalidad nueva, no core |
| H18 — Liked Songs | Funcionalidad nueva, no core |
| H19 — Instrucciones eliminar Spotify | Contenido estático, se puede añadir en 10 minutos después |

---

## 4. HIPÓTESIS

**Hipótesis 1 (valor):**
> Creemos que María migrará al menos 1 playlist de Spotify a Deezer porque la frustración de hacerlo manualmente es real. Sabremos que acertamos si al menos el 70% de los usuarios que conectan Spotify completan la primera migración.

**Hipótesis 2 (usabilidad):**
> Creemos que un usuario no técnico puede completar la migración sin ayuda porque el flujo tiene solo 4 pasos (conectar → seleccionar → destino → migrar). Sabremos que acertamos si el tiempo medio de la primera migración es inferior a 5 minutos.

**Hipótesis 3 (búsqueda):**
> Creemos que el ISRC + fallback a nombre/artista encuentra al menos el 80% de las canciones porque la mayoría de los catálogos de Deezer y Spotify se superponen. Sabremos que acertamos si la tasa de éxito de búsqueda es ≥ 80%.

---

## 5. ESFUERZO

**Para una persona sin experiencia técnica trabajando con Claude Code:**

| Fase | Días estimados | Qué se hace |
|------|---------------|-------------|
| Setup proyecto (frontend + backend) | 1-2 días | Inicializar Next.js + FastAPI, estructura de carpetas |
| OAuth Spotify | 2-3 días | Registrar app, implementar Authorization Code + PKCE, manejar tokens |
| Carga de playlists | 1-2 días | Endpoint para listar playlists del usuario |
| OAuth Deezer | 2-3 días | Registrar app, implementar OAuth, manejar tokens |
| Migración core | 3-4 días | Buscar tracks por ISRC, crear playlists, añadir tracks |
| UI (selección, progreso, resultado) | 2-3 días | Pantallas de selección, barra de progreso, resumen |
| Pruebas y ajustes | 2-3 días | Probar con playlists reales, manejar errores, pulir UX |
| **Total estimado** | **13-20 días** | |

**Nota:** Esto es estimación para alguien que está aprendiendo. Con experiencia, se reduciría a 5-8 días.

---

## 6. VEREDICTO

### ¿El MVP es demasiado grande?

**Honestamente: sí, un poco.** 13-20 días es mucho para un primer proyecto. Hay riesgo de que María se canse o se abrume.

### Propuesta de MVP reducido (MVP-0)

Si quieres algo que puedas construir en **una semana** (7 días):

| Fase | Días | Qué se hace |
|------|------|-------------|
| Setup + OAuth Spotify | 2 días | Estructura + conectar Spotify |
| Carga de playlists + selección | 1 día | Ver listas, marcar con checkboxes |
| Migración a Deezer (core) | 2 días | Buscar por ISRC + crear playlist en Deezer |
| UI básica (progreso + resultado) | 1 día | Barra de progreso simple + resumen |
| Pruebas | 1 día | Probar con 2-3 playlists reales |

**MVP-0 = 7 días.** Una playlist migra de Spotify a Deezer con progreso visible y resultado claro.

Lo que sobra del MVP original (token caducado, "Seleccionar todo", indicador de carga en cada paso) se añade en la semana 2 sin romper nada.

---

*Documento base: docs/01-historias.md (19 historias)*
*Siguiente paso: Paso 4 — Legal (AI Act + RGPD).*
