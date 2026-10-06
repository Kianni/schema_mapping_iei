# IEI Integrations

Análisis manual y mapeo de fuentes de datos al esquema global IEI.

## Estructura

- `notebooks/data_research_IEI.ipynb` — análisis manual con pandas.
- `docs/index.html` — informe interactivo.
- `docs/data.js` — resultados del análisis.
- `docs/data.en.js` — traducción inglesa del contenido del informe.
- `docs/i18n.js` — textos de interfaz en español e inglés.
- `docs/comparison.js` — campos del esquema Python y etiquetas de comparación.
- `docs/app.js` — lógica de la interfaz.
- `docs/styles.css` — estilos.

## Uso

Abra `docs/index.html` en el navegador. Para GitHub Pages, publique la carpeta `docs/`.

Antes de publicar cambios en CSS, JavaScript o datos, ejecute
`node scripts/version-assets.cjs` y publique también el `docs/index.html` actualizado.
Los seis archivos enlazados usan versiones calculadas a partir de su contenido
(`?v=...`), para evitar que el navegador mezcle HTML nuevo con JavaScript antiguo.
No cambian las rutas relativas ni el funcionamiento local.

Si la página publicada no refleja un despliegue reciente, espere a que termine
el despliegue de Pages y haga una recarga completa (`Ctrl+F5` o `Ctrl+Shift+R`).
Compruebe que todos los archivos de `docs/` se publican, incluidos `comparison.js`,
`i18n.js` y `data.en.js`; no basta con actualizar solo `index.html`.

La pestaña **Comparación** muestra las tres fuentes a la vez: un campo global por
fila, tipo, obligatoriedad, columnas de origen y evidencia desplegable. Incluye
las relaciones `Entidad.en_localidad` y `Localidad.en_provincia`. Los nombres
se ajustan a `data/global_schema.py` (`url`, `codigo`), aunque las fuentes antiguas
usen etiquetas `URL` o `código`.

Etiquetas: **Directo**, **Transformar**, **Derivar**, **Combinar campos**,
**Revisar**, **Sin campo** y **Sin evaluar**. Pueden coexistir. «Directo» indica
una correspondencia candidata sin conversión necesaria identificada; no valida
todos los registros. «Combinar» reúne campos de una fuente y no fusiona registros
entre fuentes. Las construcciones candidatas de objetos y las revisiones de calidad
se documentan explícitamente en `comparison.js`; no ejecutan transformaciones.

Los botones **Español / English** traducen interfaz, resúmenes, reglas, hallazgos
y decisiones. Conservan los identificadores técnicos y los valores citados de las
fuentes. El idioma se recuerda si el navegador permite almacenamiento local;
la selección de fuente, sección y búsqueda se conserva al cambiar idioma.

Comprobación sin dependencias npm: `node scripts/check-report.cjs --content-only`
valida cobertura de traducciones y coincidencia con el esquema Python. La ejecución
sin esa opción también verifica navegación, comparación, búsqueda y cambio de idioma
en Chrome headless. Requiere Python en PATH y Chrome; se pueden indicar ejecutables
con `IEI_PYTHON` y `IEI_CHROME`. Usa un perfil temporal aislado dentro de `docs/` y
lo elimina al terminar.

Para verificar la publicación real, ejecute
`node scripts/check-report.cjs --url https://kianni.github.io/schema_mapping_iei/`.
Compara los seis archivos publicados con los locales y comprueba estilos,
errores JavaScript, traducción y tablas en Chrome con un perfil limpio.
Esta comprobación necesita acceso a la red.

## Añadir la segunda o tercera fuente

No es necesario modificar `index.html`, `app.js` ni `styles.css`. Edite solo `docs/data.js` y añada otro objeto dentro de `IEI_DATA.fuentes`.

Para que una fuente nueva también aparezca en inglés, añada su entrada en
`docs/data.en.js`: mapeos por clave `Objeto.campo` (nombres Python canónicos),
inventario por columna de origen y listas de resumen, notas de ámbito y decisiones.
Mantenga las listas de ámbito y decisiones en el mismo orden que `data.js`.
Sin traducción, se conserva el contenido español. Al editar una fuente existente,
actualice su traducción. La matriz compara las fuentes automáticamente; una
correspondencia no documentada se muestra como **Sin evaluar**, no como ausencia.
Si cambia el esquema Python, actualice `comparison.js`; sus campos, tipos y
obligatoriedad deben coincidir con las dataclasses.

Esquema mínimo de una fuente:

```js
{
  id: "canarias",                 // identificador único, sin espacios
  nombre: "Canarias",             // nombre visible
  archivo: "fuente.json",         // archivo analizado
  registros: 0,                    // número de registros
  campos: 0,                       // número de campos

  resumen: [
    "Conclusión breve 1.",
    "Conclusión breve 2."
  ],

  mapeoGlobal: [
    {
      objeto: "Entidad",           // Entidad | Localidad | Provincia
      campo: "nombre",             // campo del esquema global
      origen: "denominacion",      // campo(s) de la fuente
      estado: "Directo",           // Directo | Transformación | Derivar | Compuesto | Revisar modelo | Sin correspondencia
      regla: "Regla de integración.",
      nota: "Evidencia obtenida en el notebook."
    }
  ],

  inventario: [
    {
      campo: "denominacion",
      significado: "Nombre de la entidad",
      global: "Entidad.nombre",
      decision: "Mapear",
      hallazgos: "Conclusiones del análisis.",
      regla: "Regla de integración."
    }
  ],

  ambitos: [
    {
      global: "MAYORES",
      origen: "Tercera Edad",
      estado: "Mapeado",
      nota: "Correspondencia semántica."
    }
  ],

  decisiones: [
    {
      tema: "Cuestión pendiente",
      prioridad: "Media",          // Alta | Media | Baja
      evidencia: "Qué se observó en la fuente.",
      decision: "Qué debe decidirse antes de integrar."
    }
  ]
}
```

Para una tercera fuente, repita exactamente el mismo bloque con otro `id`. Las pestañas y tablas se generan automáticamente.
