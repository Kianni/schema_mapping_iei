// Datos del informe IEI.
// Para añadir una fuente nueva, copie uno de los objetos de `fuentes` y complete
// sus propiedades siguiendo el esquema documentado en README.md.

window.IEI_DATA = {
  esquemaGlobal: {
  Entidad: ["cod_entidad", "nombre", "ambito", "direccion", "codigo_postal", "longitud", "latitud", "descripcion", "contacto", "URL"],
  Localidad: ["código", "nombre"],
  Provincia: ["código", "nombre"],
  Ambito: [
    "MAYORES", "DISCAPACIDAD", "SALUD_MENTAL", "INFANCIA_Y_JUVENTUD", "MUJER", "MIGRACION",
    "INCLUSION_SOCIAL", "EDUCACION_Y_FORMACION", "EMPLEO_E_INSERCION_LABORAL",
    "SALUD_Y_ATENCION_SOCIOSANITARIA", "VOLUNTARIADO_Y_PARTICIPACION_COMUNITARIA",
    "CULTURA_Y_DESARROLLO_COMUNITARIO"
  ]
},

  fuentes: [
    {
        id: "valencia",
        nombre: "Comunitat Valenciana",
        archivo: "entidades_CV.csv",
        registros: 1697,
        campos: 21,
        mapeoGlobal: [
          { objeto: "Entidad", campo: "cod_entidad", origen: "ni_centro", estado: "Directo", regla: "Usar el identificador del centro. Convertir los valores enteros almacenados como float al tipo de identificador acordado.", nota: "1645 códigos distintos no nulos. Cada código corresponde a un único nombre. Hay 32 registros sin código." },
          { objeto: "Entidad", campo: "nombre", origen: "nombre", estado: "Directo", regla: "Conservar el nombre de origen; normalizar solo espacios si fuera necesario.", nota: "Campo completo. 1660 nombres distintos; no es un identificador único." },
          { objeto: "Entidad", campo: "ambito", origen: "sector", estado: "Revisar modelo", regla: "Mapear las 7 categorías de sector al enum global Ambito. Conservar más de un ámbito cuando un centro tenga varios sectores.", nota: "12 centros tienen varios sectores: 10 con 2 y 2 con 3." },
          { objeto: "Entidad", campo: "direccion", origen: "domici", estado: "Directo", regla: "Conservar el texto libre de la dirección; normalización opcional de abreviaturas.", nota: "1689 valores no nulos y 8 ausentes. Formato heterogéneo." },
          { objeto: "Entidad", campo: "codigo_postal", origen: "—", estado: "Sin correspondencia", regla: "No hay campo de origen identificado.", nota: "La fuente no contiene código postal." },
          { objeto: "Entidad", campo: "longitud", origen: "x_25830 + y_25830", estado: "Transformación", regla: "Transformar el punto desde EPSG:25830 al sistema geográfico adoptado por el modelo global y usar la longitud resultante.", nota: "WKT contiene exactamente las mismas coordenadas X/Y." },
          { objeto: "Entidad", campo: "latitud", origen: "x_25830 + y_25830", estado: "Transformación", regla: "Transformar el punto desde EPSG:25830 al sistema geográfico adoptado por el modelo global y usar la latitud resultante.", nota: "Los 1697 puntos WKT coinciden con x_25830/y_25830." },
          { objeto: "Entidad", campo: "descripcion", origen: "—", estado: "Sin correspondencia", regla: "No hay un campo descriptivo directo en la fuente.", nota: "tipo_centro describe un subtipo de servicio, no una descripción libre." },
          { objeto: "Entidad", campo: "contacto", origen: "telefono + email", estado: "Compuesto", regla: "Normalizar teléfono y correo por separado y definir cómo se representan dentro del único atributo global contacto.", nota: "Ambos campos presentan valores ausentes o anomalías de formato." },
          { objeto: "Entidad", campo: "URL", origen: "—", estado: "Sin correspondencia", regla: "No hay campo de origen identificado.", nota: "La fuente no contiene URL/web." },
          { objeto: "Localidad", campo: "código", origen: "cod_ine_mun", estado: "Transformación", regla: "Convertir a cadena de 5 caracteres y restaurar ceros iniciales.", nota: "333 códigos distintos, sin valores ausentes; relación uno-a-uno con municipio." },
          { objeto: "Localidad", campo: "nombre", origen: "municipio", estado: "Directo", regla: "Conservar el nombre del municipio.", nota: "333 nombres distintos, sin valores ausentes." },
          { objeto: "Provincia", campo: "código", origen: "cod_ine_mun", estado: "Derivar", regla: "Normalizar cod_ine_mun a 5 caracteres y tomar los 2 primeros.", nota: "03 = Alicante, 12 = Castellón, 46 = Valencia." },
          { objeto: "Provincia", campo: "nombre", origen: "provincia", estado: "Directo", regla: "Conservar el valor de origen y definir posteriormente la política para los nombres bilingües.", nota: "Campo completo; 3 provincias; consistente con cod_ine_mun y comarca." }
        ],
        inventario: [
          { campo: "WKT", significado: "Geometría de punto en texto: POINT (X Y)", global: "—", decision: "Auxiliar", hallazgos: "Completo; coincide con x_25830/y_25830 en los 1697 registros.", regla: "No mapear por separado; usar las coordenadas para la transformación del sistema de referencia." },
          { campo: "id", significado: "Identificador secuencial de la fila de origen", global: "—", decision: "No mapear", hallazgos: "int64; completo; 1697 valores únicos y secuenciales.", regla: "Conservar solo para trazabilidad si se necesita; no usar como Entidad.cod_entidad." },
          { campo: "ni_centro", significado: "Identificador del centro", global: "Entidad.cod_entidad", decision: "Mapear", hallazgos: "1665 valores no nulos, 32 ausentes; 1645 códigos distintos; un único nombre por código.", regla: "Usar como código del centro y definir una estrategia para los 32 registros sin código." },
          { campo: "tipo_centro", significado: "Subtipo específico de servicio o recurso", global: "—", decision: "Sin correspondencia", hallazgos: "La mayoría de los centros tienen un tipo; 9 centros tienen varios y uno llega a 7.", regla: "Conservar como metadato de origen o ampliar el modelo si este detalle es necesario." },
          { campo: "nombre", significado: "Nombre del centro", global: "Entidad.nombre", decision: "Mapear", hallazgos: "Completo; 1660 nombres distintos; 27 nombres repetidos afectan a 64 registros.", regla: "Mapeo directo; no usar como clave única." },
          { campo: "max", significado: "Posible capacidad máxima o número de plazas", global: "—", decision: "Revisar", hallazgos: "1665 valores no nulos, 32 ausentes; rango 0–356; mediana 20; significado semántico no confirmado.", regla: "No mapear hasta confirmar el significado del campo." },
          { campo: "entidad", significado: "Organización o institución asociada al centro", global: "—", decision: "Sin correspondencia", hallazgos: "Una organización puede estar asociada a muchos centros. GENERALITAT VALENCIANA: 141 registros y 134 nombres de centro.", regla: "El modelo global actual no contempla por separado la organización responsable/gestora." },
          { campo: "domici", significado: "Dirección en texto libre", global: "Entidad.direccion", decision: "Mapear", hallazgos: "1689 valores no nulos, 8 ausentes; 1576 direcciones distintas; formato heterogéneo.", regla: "Conservar el texto original; normalización opcional de abreviaturas." },
          { campo: "leyenda", significado: "Clasificación administrativa/jurídica específica de la fuente", global: "—", decision: "Sin correspondencia", hallazgos: "9 categorías; 21 organizaciones tienen dos valores; mezcla niveles de especificidad.", regla: "No tratarla como tipo jurídico estricto sin modelado adicional." },
          { campo: "cod_ine_mun", significado: "Identificador municipal INE", global: "Localidad.código / Provincia.código", decision: "Mapear / derivar", hallazgos: "1697 valores, 333 códigos; 489 aparecen con 4 dígitos por pérdida del cero inicial.", regla: "Rellenar a 5 caracteres; usar el código completo para Localidad y los 2 primeros dígitos para Provincia." },
          { campo: "provincia", significado: "Nombre de provincia", global: "Provincia.nombre", decision: "Mapear", hallazgos: "3 valores bilingües; sin ausentes; coherente con cod_ine_mun y comarca.", regla: "Mapeo directo; decidir política de normalización bilingüe." },
          { campo: "comarca", significado: "Clasificación territorial de comarca", global: "—", decision: "Sin correspondencia", hallazgos: "33 valores; cada municipio pertenece a una comarca y cada comarca a una provincia.", regla: "Conservar como metadato si se necesita; no existe campo global equivalente." },
          { campo: "municipio", significado: "Nombre del municipio", global: "Localidad.nombre", decision: "Mapear", hallazgos: "1697 valores; 333 nombres distintos; relación uno-a-uno con cod_ine_mun.", regla: "Mapeo directo." },
          { campo: "sector", significado: "Población destinataria / ámbito de actuación", global: "Entidad.ambito", decision: "Mapear / revisar modelo", hallazgos: "7 categorías; 12 centros tienen más de un sector.", regla: "Mapear al enum Ambito y conservar la multiplicidad de ámbitos." },
          { campo: "clasificacion", significado: "Clasificación/estado estrechamente relacionado con sector", global: "—", decision: "No mapear", hallazgos: "1665 filas coinciden con sector; 32 tienen SIN RESOLUCIÓN mientras sector sigue informado.", regla: "Usar sector para Entidad.ambito; conservar clasificacion solo como metadato/estado si se necesita." },
          { campo: "pobtotal", significado: "Población total del municipio", global: "—", decision: "Sin correspondencia", hallazgos: "1665 valores no nulos, 32 ausentes; un único valor por municipio y cod_ine_mun.", regla: "Es un metadato de localidad; el modelo global actual no tiene atributo de población." },
          { campo: "email", significado: "Correo electrónico de contacto", global: "Entidad.contacto", decision: "Compuesto", hallazgos: "1531 no nulos, 166 nulos; 873 valores distintos; zero@gva.es aparece 413 veces; existen direcciones mal formadas o múltiples.", regla: "Recortar espacios, normalizar mayúsculas/minúsculas, validar, tratar placeholders y separar varios correos cuando proceda." },
          { campo: "telefono", significado: "Teléfono de contacto", global: "Entidad.contacto", decision: "Compuesto", hallazgos: "1688 no nulos, 9 ausentes; 68 valores '0'; existen separadores y varios teléfonos en un campo.", regla: "Normalizar formato, revisar el valor '0', detectar múltiples números y validar longitud." },
          { campo: "f_resolu", significado: "Fecha/hora de resolución", global: "—", decision: "Sin correspondencia", hallazgos: "1574 no nulos, 123 ausentes; todos parseables; 12 registros recientes contienen hora distinta de 00:00:00.", regla: "Conservar como metadato de origen; confirmar el significado de negocio antes de reducir a DATE." },
          { campo: "x_25830", significado: "Coordenada X / Este proyectada (EPSG:25830)", global: "Entidad.longitud", decision: "Transformación", hallazgos: "Completo; emparejado con y_25830; duplicado en WKT.", regla: "Transformar el punto al sistema geográfico adoptado por el modelo global." },
          { campo: "y_25830", significado: "Coordenada Y / Norte proyectada (EPSG:25830)", global: "Entidad.latitud", decision: "Transformación", hallazgos: "Completo; emparejado con x_25830; duplicado en WKT.", regla: "Transformar el punto al sistema geográfico adoptado por el modelo global." }
        ],
        resumen: [
          "ni_centro es el mejor candidato para Entidad.cod_entidad, pero falta en 32 registros.",
          "sector se corresponde con Entidad.ambito; 12 centros tienen más de un sector y requieren una decisión de modelado.",
          "cod_ine_mun permite construir Localidad.código y derivar Provincia.código.",
          "x_25830/y_25830 están en EPSG:25830 y deben transformarse antes de usarse como longitud/latitud.",
          "WKT duplica exactamente las coordenadas x_25830/y_25830.",
          "codigo_postal, descripcion y URL no tienen campo equivalente en la fuente Valencia."
        ],
        ambitos: [
          { global: "MAYORES", origen: "PERSONAS MAYORES", estado: "Mapeado", nota: "Correspondencia semántica directa." },
          { global: "DISCAPACIDAD", origen: "PERSONAS CON DISCAPACIDAD", estado: "Mapeado", nota: "Correspondencia semántica directa." },
          { global: "SALUD_MENTAL", origen: "PERSONAS CON ENFERMEDAD MENTAL", estado: "Mapeado", nota: "Correspondencia semántica directa." },
          { global: "INFANCIA_Y_JUVENTUD", origen: "INFANCIA", estado: "Mapeado", nota: "La categoría de origen es más estrecha, pero es la correspondencia directa disponible." },
          { global: "MUJER", origen: "MUJERES", estado: "Mapeado", nota: "Correspondencia semántica directa." },
          { global: "MIGRACION", origen: "PERSONAS MIGRANTES", estado: "Mapeado", nota: "Correspondencia semántica directa." },
          { global: "INCLUSION_SOCIAL", origen: "POBLACIÓN EN GENERAL Y COLECTIVOS SOCIALMENTE DESFAVORECIDOS", estado: "Mapeado", nota: "Mejor correspondencia dentro del enum global actual." },
          { global: "EDUCACION_Y_FORMACION", origen: "—", estado: "No representado", nota: "No existe un sector de origen equivalente." },
          { global: "EMPLEO_E_INSERCION_LABORAL", origen: "—", estado: "No representado", nota: "No existe un sector de origen equivalente." },
          { global: "SALUD_Y_ATENCION_SOCIOSANITARIA", origen: "—", estado: "No representado", nota: "No existe un sector de origen equivalente." },
          { global: "VOLUNTARIADO_Y_PARTICIPACION_COMUNITARIA", origen: "—", estado: "No representado", nota: "No existe un sector de origen equivalente." },
          { global: "CULTURA_Y_DESARROLLO_COMUNITARIO", origen: "—", estado: "No representado", nota: "No existe un sector de origen equivalente." }
        ],
        decisiones: [
          { tema: "Multiplicidad de ámbito", prioridad: "Alta", evidencia: "Un mismo ni_centro puede tener varios sector. Hay 12 centros afectados.", decision: "Confirmar si Entidad.ambito admite varios valores. Si no, modelar una relación Entidad↔Ambito u otra representación sin pérdida." },
          { tema: "Códigos de centro ausentes", prioridad: "Alta", evidencia: "32 registros no tienen ni_centro. Esos mismos 32 también carecen de max y pobtotal y tienen clasificacion = SIN RESOLUCIÓN.", decision: "Definir si se rechazan, reciben una clave sustituta o se conservan con un identificador técnico separado." },
          { tema: "Sistema de coordenadas", prioridad: "Media", evidencia: "La fuente usa EPSG:25830; el diagrama global solo indica longitud/latitud.", decision: "Confirmar el CRS objetivo antes del ETL. Si se esperan coordenadas geográficas estándar, transformar al CRS acordado (habitualmente EPSG:4326)." },
          { tema: "Único campo contacto", prioridad: "Media", evidencia: "La fuente separa telefono y email, mientras el modelo global contiene un único atributo contacto.", decision: "Definir si contacto será estructurado, texto combinado o si conviene separar teléfono y correo en el modelo global." },
          { tema: "Información sin representación global", prioridad: "Media", evidencia: "Campos relevantes sin destino: entidad, leyenda, tipo_centro, f_resolu, max, comarca y pobtotal.", decision: "Confirmar que su pérdida es intencional o ampliar el esquema global antes de implementar." },
          { tema: "Código postal y URL", prioridad: "Baja", evidencia: "El modelo global contiene codigo_postal y URL, pero esta fuente no dispone de esos campos.", decision: "Dejar nulos para esta fuente salvo que se acuerde enriquecimiento desde otra fuente autorizada." }
        ]
      }
  ]
};
