// Field names and types mirror data/global_schema.py. This is report metadata,
// not an ETL implementation. Legacy report labels are normalized by app.js.
window.IEI_COMPARISON = {
  fields: [
    { objeto: "Entidad", campo: "cod_entidad", tipo: "str", required: true },
    { objeto: "Entidad", campo: "nombre", tipo: "str", required: true },
    { objeto: "Entidad", campo: "ambito", tipo: "Ambito | None", required: false },
    { objeto: "Entidad", campo: "direccion", tipo: "str", required: true },
    { objeto: "Entidad", campo: "codigo_postal", tipo: "str | None", required: false },
    { objeto: "Entidad", campo: "longitud", tipo: "float | None", required: false },
    { objeto: "Entidad", campo: "latitud", tipo: "float | None", required: false },
    { objeto: "Entidad", campo: "descripcion", tipo: "str | None", required: false },
    { objeto: "Entidad", campo: "contacto", tipo: "str | None", required: false },
    { objeto: "Entidad", campo: "url", tipo: "str | None", required: false },
    { objeto: "Entidad", campo: "en_localidad", tipo: "Localidad", required: true },
    { objeto: "Localidad", campo: "codigo", tipo: "str", required: true },
    { objeto: "Localidad", campo: "nombre", tipo: "str", required: true },
    { objeto: "Localidad", campo: "en_provincia", tipo: "Provincia", required: true },
    { objeto: "Provincia", campo: "codigo", tipo: "str", required: true },
    { objeto: "Provincia", campo: "nombre", tipo: "str", required: true }
  ],
  // Extra flags are explicit findings, not guesses based on keyword matching.
  flags: {
    valencia: {
      "Entidad.cod_entidad": ["transform", "review"],
      "Entidad.direccion": ["ready", "review"],
      "Entidad.ambito": ["transform", "review"],
      "Entidad.contacto": ["combine", "review"]
    },
    canarias: {
      "Entidad.nombre": ["ready", "review"],
      "Entidad.ambito": ["transform", "review"],
      "Entidad.direccion": ["combine", "review"],
      "Entidad.contacto": ["combine", "review"],
      "Entidad.url": ["transform", "review"],
      "Localidad.codigo": ["transform", "review"],
      "Localidad.nombre": ["transform", "review"],
      "Provincia.codigo": ["transform", "review"],
      "Provincia.nombre": ["transform", "review"]
    },
    catalunya_ongd: {
      "Entidad.cod_entidad": ["transform", "review"],
      "Entidad.nombre": ["ready", "review"],
      "Entidad.direccion": ["ready", "review"],
      "Entidad.codigo_postal": ["transform", "review"],
      "Entidad.contacto": ["combine", "review"],
      "Entidad.url": ["transform", "review"],
      "Entidad.en_localidad": ["none", "review"],
      "Localidad.nombre": ["ready", "review"]
    }
  },
  // These object constructions follow existing candidate scalar mappings.
  // For XML, only the locality name is available, so no construction is inferred.
  relationships: {
    valencia: {
      "Entidad.en_localidad": {
        origen: "cod_ine_mun + municipio + provincia",
        statuses: ["combine", "transform"],
        es: "Construcción candidata de Localidad con código municipal textual y Provincia. No une registros entre fuentes.",
        en: "Candidate Localidad construction using a textual municipality code and Provincia. This does not join records across sources."
      },
      "Localidad.en_provincia": {
        origen: "cod_ine_mun + provincia",
        statuses: ["combine", "derive"],
        es: "Construcción candidata de Provincia: código derivado de cod_ine_mun y nombre de provincia, según el análisis existente.",
        en: "Candidate Provincia construction: code derived from cod_ine_mun and province name, following the existing analysis."
      }
    },
    canarias: {
      "Entidad.en_localidad": {
        origen: "direccion_municipio_id + direccion_municipio_nombre + direccion_provincia_id + direccion_provincia_nombre",
        statuses: ["combine", "review"],
        es: "Construcción candidata; ocho filas no tienen nombre municipal ni provincia conocidos. La codificación municipal no está validada.",
        en: "Candidate construction; eight rows lack a known municipality name and province. Municipality coding has not been validated."
      },
      "Localidad.en_provincia": {
        origen: "direccion_provincia_id + direccion_provincia_nombre",
        statuses: ["combine", "review"],
        es: "Construcción candidata de Provincia; resolver _U y las relaciones obligatorias antes de integrar.",
        en: "Candidate Provincia construction; resolve _U and the required relationships before integration."
      }
    }
  }
};
