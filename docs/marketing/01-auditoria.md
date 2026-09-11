# Marketing — Paso 2 · Auditoría de marca (01-auditoria.md)

> Mirada hacia dentro: qué existe ya de TuneHop como marca, en qué estado
> está, y qué riesgos y oportunidades del contexto deben condicionar la
> estrategia (el Paso 5 propondrá estrategia; aquí solo se diagnostica).
>
> Autora: Corita (directora creativa). Fecha: 2026-09-11.

---

## 1. ACTIVOS DE MARCA EXISTENTES

### Nombre
- **TuneHop** — decidido con rúbrica de branding (semántica, sonoridad,
  distintivo, corto, colisión): 2 sílabas, comunica categoría (tune = música)
  y acción (hop = saltar de plataforma) con emoción ligera. Verificado:
  tunehop.com/.app sin sitio activo y sin colisión en la categoría de
  migradores. Documentado en la bitácora (2026-09-01, commit 2b0dc75).
- Decisión tomada con criterio de marketing, no improvisada: se descartaron
  PlayMigrate (sonaba a herramienta de IT), Shift (genérico y ocupado por
  SongShift) y TunePort/RelayTunes (peor puntuación). **El nombre es el activo
  más sólido de la marca hoy.**

### Web (producto en producción)
- **https://tunehop.vercel.app** — subdominio de Vercel, no dominio propio.
- Home actual: título "TuneHop", subtítulo *"Migra tus playlists de Spotify a
  otras plataformas musicales"*, botón **Connect Spotify** (en inglés),
  nota de privacidad *"Tus datos se borran al cerrar la sesión. No guardamos
  nada."* y enlace a Política de Privacidad.
- Metadata técnica: title `TuneHop`, description genérica (sin destino, sin
  beneficio, sin keyword de búsqueda). SEO pobre.
- **Incoherencia de idioma en producción**: el CTA principal está en inglés
  ("Connect Spotify") dentro de una interfaz en español. Se ve a simple vista.

### Identidad visual
- **No existe.** Favicon de plantilla de Next.js, tipografía Geist (serie),
  SVGs de ejemplo de create-next-app en `public/` (next.svg, vercel.svg,
  globe.svg, window.svg, file.svg). Sin logo, sin paleta de marca, sin
  sistema gráfico. La web parece un proyecto de plantilla, no un producto.

### Tono verbal
- Funcional, claro, honesto, centrado en la privacidad: *"Solamente lectura:
  no modificamos, borramos ni movemos nada en tu Spotify"* (pantalla de
  consentimiento). Posicionamiento neutro confirmado — no ataca a Spotify.
- Es un tono correcto y maduro, pero todavía sin personalidad: da confianza,
  no genera deseo.

### Documentación interna (base para contenido público)
- **research/resumen-ejecutivo.md** — datos reales de pago por stream
  (TIDAL ~$0.012-0.013 vs Spotify ~$0.003-0.005; 3-7x más).
- Método de 20 pasos documentado (docs/, bitácora) — material rico para
  storytelling y case study.
- **README desactualizado**: dice "Deezer, próximamente TIDAL" y referencia
  Deezer en requisitos y Redirect URIs; el destino real es TIDAL desde
  2026-09-03. Si el repo se hace público, contradice al producto.

### Otros
- **Dominio propio**: no. **Redes sociales / newsletter / lista de espera**:
  no. **Prueba de usuarios**: guion listo (docs/prueba-usuarios.md),
  pendiente de ejecutar con 5 personas. **Repositorio**: local; no se ha
  hecho público.

---

## 2. PERCEPCIÓN ACTUAL

**No hay percepción pública que auditar todavía.** TuneHop es un lanzamiento
nuevo: sin reseñas, sin tráfico declarado, sin conversación pública, sin
redes. La única "percepción" existente es la de la fundadora y quien ha visto
el producto — insuficiente para extraer conclusiones. Este apartado se
retomará tras los primeros usuarios reales (prueba de usuarios y Paso 3
aportarán las primeras señales).

---

## 3. FORTALEZAS (internas)

1. **Producto real en producción, no humo**: funciona, con puerta de calidad,
   plan de emergencia y observabilidad operativa (pasos 17-18 cerrados). La
   marca se apoya en algo que ya resuelve el problema.
2. **Promesa clara y mensurable**: migrar en minutos lo que manualmente son
   horas (la usuaria de referencia abandonó dos plataformas por la migración
   manual). El beneficio se puede demostrar, no solo prometer.
3. **Privacidad radical como rasgo de marca**: "no guardamos nada" + RGPD con
   consentimiento previo y borrado real (Art. 17). En una categoría de apps
   que suelen pedir más datos de los necesarios, es un diferenciador creíble.
4. **Ángulo ético con datos detrás**: el argumento "paga mejor a los
   artistas" tiene cifras reales documentadas (research/), no es marketing
   vacío.
5. **Posicionamiento neutro decidido con criterio** (no atacar a Spotify):
   maduro, coherente con la promesa de libertad y sin riesgo reputacional de
   parecer vengativo o amateur.
6. **Talento creativo interno**: la fundadora es titulada en Comunicación con
   especialidad en Creatividad publicitaria (matrícula de honor). La marca
   tiene productora de ideas gratis.
7. **Estructura de costes casi nula** (Vercel free, sin servidores, sin base
   de datos que mantener): cualquier ingreso es margen real, y la
   sostenibilidad no depende de financiación.
8. **Calidad técnica desde el origen**: i18n, accesibilidad WCAG AA, tests,
   evaluación de herramientas. Es una base que pocas apps de un solo
   fundador tienen; se puede presumir con honestidad.

---

## 4. DEBILIDADES (internas)

1. **Cero identidad visual**: sin logo, sin paleta, sin favicon propio, con
   tipografía y SVG de plantilla. La primera impresión dice "prácticas de
   curso", no "producto al que confiar 5.200 canciones".
2. **Subdominio de Vercel** (tunehop.vercel.app): transmite provisionalidad
   justo donde la confianza es crítica (el usuario entrega acceso de solo
   lectura a toda su biblioteca musical). El dominio tunehop.com está libre.
3. **Incoherencias de pulido visibles**: botón "Connect Spotify" en inglés en
   una web en español; README con Deezer cuando el producto usa TIDAL. Son
   detalles pequeños que en conjunto delatan falta de revisión final — y la
   categoría exige confianza.
4. **Sin audiencia ni comunidad previa**: cero seguidores, cero lista de
   espera, cero tráfico que aprovechar. Se parte de un frío absoluto.
5. **Marca nueva y desconocida** frente a nombres consolidados de la
   categoría (Soundiiz, TuneMyMusic, SongShift...): cuando alguien busca
   "migrar playlists", TuneHop no existe todavía mentalmente.
6. **Un solo idioma** (español) en una categoría global donde la competencia
   opera en inglés. Elección consciente para el MVP, pero limita el mercado
   inmediato.
7. **Dependencia de una sola persona**: producto y marca dependen de la
   fundadora en tiempo parcial. La capacidad de ejecución es el cuello de
   botella de todo.
8. **Sin modelo de ingresos definido**: la web no monetiza ni comunica plan
   alguno. No es bloqueante, pero deja la promesa de "producto" a medias
   frente a competidores que venden suscripciones con claridad.
9. **Home con mensaje vago**: "migra a otras plataformas musicales" no dice
   ni el destino (TIDAL), ni el beneficio ético (paga mejor a artistas), ni
   la maravilla (3 minutos). El titular vende menos de lo que el producto
   entrega.

---

## 5. OPORTUNIDADES (externas, preliminares — el Paso 3 las profundizará)

1. **Ola de salida de Spotify**: subidas de precio y el debate público sobre
   el pago a artistas empujan a muchos oyentes a buscar alternativas; el
   obstáculo que los frena es exactamente el que TuneHop resuelve (migrar sin
   esfuerzo).
2. **TIDAL como destino con narrativa propia**: audio HiFi y mejor pago por
   stream le dan a TIDAL un gancho comunicativo; TuneHop puede montarse en esa
   ola en lugar de crearla (contenido, comunidad audiofila, "fair streaming").
3. **Ningún jugador grande combina simple + privado + ético + neutro** (a
   validar en el Paso 3). Si se confirma, ese es el hueco de territorio de
   marca.
4. **Competidores casi todos de pago**: una alternativa gratuita y simple
   tiene ángulo de ataque publicitario y de posicionamiento.
5. **Intención de búsqueda alta y concreta**: "migrar playlists de spotify a
   tidal" es una búsqueda con intención clarísima; una herramienta gratis +
   contenido puede rankear sin pagar por clics.
6. **Historia pegadiza para contenido**: "cómo dejar Spotify sin perder tus
   5.200 canciones" es un formato ideal para vídeo corto y redes, y la
   fundadora tiene la formación para producirlo con calidad.
7. **El proceso de desarrollo está documentado**: el viaje de 20 pasos
   (con errores reales y arreglos) es contenido honesto que pocos productos
   pueden mostrar; alimenta case study y credibilidad.

---

## 6. AMENAZAS (externas, preliminares)

1. **Competencia consolidada con años de SEO y presupuesto** (Soundiiz,
   TuneMyMusic, FreeYourMusic): la barrera no es funcional sino de
   visibilidad; jugar a pagar por clics está fuera del presupuesto.
2. **Que el destino integre migración nativa**: si TIDAL (u otra plataforma)
   añade importación desde Spotify, el problema desaparece y la categoría se
   encoge. Es el riesgo estructural de depender de un intermediario.
3. **Cambios de API y términos de servicio** de Spotify/TIDAL: rate limits,
   tiers de acceso, cambios de scopes (TIDAL ya mostró este riesgo en la
   fase técnica). Un cambio unilateral puede romper o encarecer el servicio.
4. **Riesgo legal de frontera**: si el producto rozara los límites de las
   APIs o de los términos (scraping, uso indebido de datos), la marca ética
   caería y la operación podría bloquearse. Hay que vigilar que nunca se
   cruce esa línea.
5. **El argumento ético es un arma de doble filo**: exige coherencia total
   (privacidad real, transparencia, cero venta de datos). Un solo desliz de
   confianza destruiría la marca más rápido que cualquier campaña pueda
   construirla.
6. **Clones gratuitos**: si el hueco se confirma atractivo, alguien con
   presupuesto puede copiar la propuesta y adelantarla por visibilidad.

---

## 7. PESTEL (solo lo que aplica a esta categoría)

### Político-Legal
- **RGPD ya integrado en el producto**: consentimiento previo con checkbox,
  borrado de datos (Art. 17), tokens en sesión. Es a la vez obligación y
  argumento de marca — ningún competidor español puede presumir más.
- **Términos de servicio de Spotify y TIDAL**: el modelo de negocio depende
  de que el uso de sus APIs respete sus condiciones. Requiere vigilancia
  continua (no es un cumplimiento de una vez).
- Entorno europeo pro-privacidad favorable a la promesa de TuneHop (a
  diferencia de territorios sin normativa de datos).

### Económico
- **Subidas de precio del streaming** y sensibilidad del consumidor: cuando
  Spotify sube precios, migrar deja de ser capricho y se vuelve decisión
  económica. Contexto favorable al ahorro en suscripciones múltiples.
- **Presupuesto de marketing casi nulo** (máx. 50 €/mes esporádicos): la
  estrategia debe ser orgánica y creativa; cualquier inversión pagada se
  decide caso a caso.

### Social
- **Conciencia creciente sobre el pago a artistas** (movimientos de "fair
  streaming", protestas públicas de músicos): el público objetivo de TuneHop
  (María: "quiero apoyar plataformas que paguen mejor a los artistas") es un
  segmento en crecimiento, no un nicho anecdótico.
- Gente dispuesta a cambiar de plataforma por valores si el coste de hacerlo
  es bajo — y ese coste es exactamente lo que TuneHop reduce.

### Tecnológico
- **ISRC como estándar universal**: permite la migración fiable entre
  catálogos; sin este estándar, la promesa no existiría.
- **APIs OAuth maduras** en ambas plataformas: la conexión segura es viable
  con coste cero.
- **IA disponible para el matching de canciones** (el Matching Assistant del
  proyecto puede mejorar el fallback automático por nombre/artista): ventaja
  técnica futura frente a competidores.

### Ecológico
- **No aplica de forma relevante** a esta categoría: la migración de
  playlists no tiene impacto medioambiental diferencial. Se omite por
  honestidad, no por descuido.

---

## 8. RIESGOS A VIGILAR (condicionan la estrategia posterior)

1. **La falta de identidad visual es el riesgo nº 1 de conversión**: hoy la
   web parece una plantilla y la categoría exige confianza (usuario entrega
   acceso a su biblioteca). El Paso 7 (identidad visual) no es cosmética: es
   infraestructura de marca. Prioridad alta.
2. **Quick wins de coherencia antes de abrir el grifo**: botón "Connect
   Spotify" → español; README actualizado a TIDAL; metadata con destino y
   beneficio. Son 30 minutos de trabajo y eliminan las grietas visibles.
3. **Decidir pronto el dominio**: tunehop.com está libre; a ~10-15 €/año es
   una compra de credibilidad compatible con el presupuesto esporádico. Un
   subdominio de Vercel resta en el momento crítico (el login de Spotify
   muestra la URL a la que das acceso).
4. **Vigilar anuncios de TIDAL**: si integran migración nativa, la categoría
   cambia de golpe; la estrategia debe contemplar ese escenario.
5. **No jugar al juego de pago de la competencia** (presupuesto, SEO
   comprado): la salida es el ángulo creativo y diferencial, no la puja.
6. **La promesa ética exige coherencia operativa**: privacidad real, cero
   venta de datos, transparencia en lo que se hace con la sesión. Blindar
   procesos (guardrails ya existentes) y nunca prometer lo que el producto
   no hace.
7. **Ejecutar la prueba de usuarios antes de escalar marketing**: gritar una
   promesa que nadie validó es el error clásico de lanzamiento; el guion ya
   está listo (docs/prueba-usuarios.md).
8. **Monoidioma español como decisión consciente, no como olvido**: el
   mercado hispanohablante es grande y alcanzable sin presupuesto; la
   expansión a otros idiomas debe ser una decisión de la estrategia, no una
   urgencia del lanzamiento.