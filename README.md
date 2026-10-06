# IEI Integrations

Análisis manual y mapeo de fuentes de datos al esquema global IEI.

## Estructura

- `notebooks/data_research_IEI.ipynb` — análisis manual con pandas.
- `docs/index.html` — informe interactivo.
- `docs/data.js` — resultados del análisis.
- `docs/app.js` — lógica de la interfaz.
- `docs/styles.css` — estilos.

## Uso

Abra `docs/index.html` en el navegador. Para GitHub Pages, publique la carpeta `docs/`.

## Añadir la segunda o tercera fuente

No es necesario modificar `index.html`, `app.js` ni `styles.css`. Edite solo `docs/data.js` y añada otro objeto dentro de `IEI_DATA.fuentes`.

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
