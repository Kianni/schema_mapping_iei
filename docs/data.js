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
      },
    {
      "id": "canarias",
      "nombre": "Canarias",
      "archivo": "datos-abiertos-csv-segundo-trimestre26.json",
      "registros": 810,
      "campos": 20,
      "resumen": [
        "810 filas, 20 campos, 745 NIF y 749 números de registro; las filas no son organizaciones únicas.",
        "4 NIF tienen dos registros; algunas organizaciones tienen varias direcciones. Acordar granularidad con Valencia, que describe centros.",
        "16 NIF tienen varias áreas; 33 grupos NIF–área tienen varias subáreas conocidas.",
        "7 códigos municipales en 8 filas no tienen nombre ni provincia conocidos; codificación municipal no verificada.",
        "Contactos, webs y componentes de dirección requieren limpieza. No hay código postal, coordenadas ni descripción libre identificados."
      ],
      "mapeoGlobal": [
        {
          "objeto": "Entidad",
          "campo": "cod_entidad",
          "origen": "nif / numero_registro",
          "estado": "Revisar modelo",
          "regla": "NIF es candidato si Entidad representa una organización. Acordar identidad global y conservar registro para trazabilidad; no equiparar organizaciones y centros automáticamente.",
          "nota": "745 NIF, 749 registros; 4 NIF con dos registros. Valencia describe centros."
        },
        {
          "objeto": "Entidad",
          "campo": "nombre",
          "origen": "denominacion",
          "estado": "Directo",
          "regla": "Conservar original; revisar posibles truncamientos sin inventar texto.",
          "nota": "745 nombres; uno-a-uno con NIF en esta fuente; finales sospechosos confirmados en JSON."
        },
        {
          "objeto": "Entidad",
          "campo": "ambito",
          "origen": "area_nombre + subarea_nombre",
          "estado": "Revisar modelo",
          "regla": "Mapear categorías explícitas al enum; revisar categorías mixtas y conservar varios ámbitos.",
          "nota": "729 NIF con un área, 14 con dos, uno con tres y uno con cinco; 33 grupos NIF–área con varias subáreas."
        },
        {
          "objeto": "Entidad",
          "campo": "direccion",
          "origen": "direccion_tipo_via + direccion_nombre_via + direccion_numero + direccion_complemento",
          "estado": "Compuesto",
          "regla": "Revisar componentes incorporados antes de componer; tratar marcadores y acordar varias direcciones por organización.",
          "nota": "Tipo y número pueden repetirse en nombre_via; direcciones heterogéneas y varias direcciones por NIF."
        },
        {
          "objeto": "Entidad",
          "campo": "codigo_postal",
          "origen": "—",
          "estado": "Sin correspondencia",
          "regla": "Dejar sin dato de origen; cualquier enriquecimiento requiere otra etapa.",
          "nota": "No hay campo equivalente identificado; no usar código municipal como código postal."
        },
        {
          "objeto": "Entidad",
          "campo": "longitud",
          "origen": "—",
          "estado": "Sin correspondencia",
          "regla": "Dejar sin dato de origen; cualquier enriquecimiento requiere otra etapa.",
          "nota": "No hay campo equivalente identificado; no usar código municipal como código postal."
        },
        {
          "objeto": "Entidad",
          "campo": "latitud",
          "origen": "—",
          "estado": "Sin correspondencia",
          "regla": "Dejar sin dato de origen; cualquier enriquecimiento requiere otra etapa.",
          "nota": "No hay campo equivalente identificado; no usar código municipal como código postal."
        },
        {
          "objeto": "Entidad",
          "campo": "descripcion",
          "origen": "—",
          "estado": "Sin correspondencia",
          "regla": "Dejar sin dato de origen; cualquier enriquecimiento requiere otra etapa.",
          "nota": "No hay campo equivalente identificado; no usar código municipal como código postal."
        },
        {
          "objeto": "Entidad",
          "campo": "contacto",
          "origen": "telefono_1 + telefono_2",
          "estado": "Compuesto",
          "regla": "Conservar texto, revisar formato y _U, evitar números duplicados; acordar representación de varios contactos.",
          "nota": "7 primeros y 2 segundos teléfonos no cumplen patrón; 20 filas con ambos teléfonos iguales."
        },
        {
          "objeto": "Entidad",
          "campo": "URL",
          "origen": "pagina_web",
          "estado": "Transformación",
          "regla": "Separar URL, email y texto; revisar espacios/protocolo sin adivinar dominios. URL del informe equivale a url en Python.",
          "nota": "619 _U; 191 informados; email, descripciones y hhtps://; disponibilidad no comprobada."
        },
        {
          "objeto": "Localidad",
          "campo": "código",
          "origen": "direccion_municipio_id",
          "estado": "Transformación",
          "regla": "Convertir a texto para Localidad.codigo; validar codificación antes de rellenar ceros o cruzar fuentes.",
          "nota": "90 códigos int64; no se confirmó que sean códigos INE."
        },
        {
          "objeto": "Localidad",
          "campo": "nombre",
          "origen": "direccion_municipio_nombre",
          "estado": "Transformación",
          "regla": "Conservar conocidos y resolver _U antes de crear relaciones obligatorias.",
          "nota": "83 nombres conocidos; 7 códigos con _U en 8 filas, sin nombre recuperable en la fuente."
        },
        {
          "objeto": "Provincia",
          "campo": "código",
          "origen": "direccion_provincia_id",
          "estado": "Transformación",
          "regla": "Preservar texto y ceros iniciales; tratar _U. código del informe equivale a codigo en Python.",
          "nota": "12 códigos conocidos más _U; 8 filas _U."
        },
        {
          "objeto": "Provincia",
          "campo": "nombre",
          "origen": "direccion_provincia_nombre",
          "estado": "Transformación",
          "regla": "Conservar conocidos; acordar datos incompletos y construir Localidad.en_provincia cuando están resueltos.",
          "nota": "Código–nombre uno-a-uno; las ocho filas municipales sin nombre tienen provincia _U."
        }
      ],
      "inventario": [
        {
          "campo": "nif",
          "significado": "Identificador fiscal",
          "global": "Entidad.cod_entidad (candidato)",
          "decision": "Mapear / revisar",
          "hallazgos": "745 únicos de 810; 9 caracteres; sin nulos, _U, vacíos o espacios de borde; 51 NIF repetidos, máximo 7 filas. Validez fiscal no comprobada.",
          "regla": "Conservar texto; acordar granularidad; no deduplicar por NIF."
        },
        {
          "campo": "denominacion",
          "significado": "Nombre de organización",
          "global": "Entidad.nombre",
          "decision": "Mapear / revisar",
          "hallazgos": "745 únicos; longitudes 5–124; sin nulos/vacíos/espacios de borde; normalización mantiene 745 únicos. Filas 157, 319, 457 con finales posiblemente truncados, 99–100 caracteres, confirmados en JSON; errata posible Otrtas.",
          "regla": "Preservar original; corregir solo con evidencia."
        },
        {
          "campo": "numero_registro",
          "significado": "Identificador registral",
          "global": "—",
          "decision": "Auxiliar",
          "hallazgos": "749 únicos; completo; 14 caracteres; todos cumplen 3 letras + 4 dígitos + 2 letras + 5 dígitos. Un NIF y nombre por registro; 4 NIF tienen dos registros; frecuencia máxima 7.",
          "regla": "Conservar trazabilidad; formato no implica validez."
        },
        {
          "campo": "direccion_tipo_via",
          "significado": "Tipo de vía",
          "global": "Entidad.direccion",
          "decision": "Mapear / revisar",
          "hallazgos": "23 valores; sin nulos/_U; 49 vacíos tras strip. Tipo puede aparecer u omitirse en nombre_via tanto con tipo informado como vacío.",
          "regla": "Revisar componentes duplicados antes de componer."
        },
        {
          "campo": "direccion_nombre_via",
          "significado": "Nombre y detalles de vía",
          "global": "Entidad.direccion",
          "decision": "Mapear / revisar",
          "hallazgos": "685 únicos; longitudes 1–76; sin nulos/_U/vacíos/espacios de borde. Un texto Null; valor D ambiguo. Incluye números, edificios, localidades e instrucciones; variantes y espacios internos.",
          "regla": "Tratar Null como posible marcador; conservar detalles originales."
        },
        {
          "campo": "direccion_numero",
          "significado": "Nómero de dirección",
          "global": "Entidad.direccion",
          "decision": "Mapear / revisar",
          "hallazgos": "133 únicos; sin nulos/_U/vacíos/espacios de borde. S/n: 57, S/n.: 2; letras, rangos y varios números.",
          "regla": "Mantener texto; sin número y valores no numíricos no son automáticamente errores."
        },
        {
          "campo": "direccion_complemento",
          "significado": "Detalle adicional de dirección",
          "global": "Entidad.direccion",
          "decision": "Mapear / revisar",
          "hallazgos": "180 únicos; 488 _U; 70 valores con espacios de borde; strip reduce únicos a 166. Abreviaturas y espacios internos; - - - - como marcador posible.",
          "regla": "Acordar marcadores y normalización sin perder detalles."
        },
        {
          "campo": "direccion_provincia_id",
          "significado": "Código de provincia",
          "global": "Provincia.código",
          "decision": "Mapear / revisar",
          "hallazgos": "Texto; 12 códigos más _U en 8 filas; incluye 06. Sin nulos, vacíos ni espacios de borde detectados.",
          "regla": "Validar códigos y resolver _U antes de integración; conservar originales."
        },
        {
          "campo": "direccion_provincia_nombre",
          "significado": "Nombre de provincia",
          "global": "Provincia.nombre",
          "decision": "Mapear / revisar",
          "hallazgos": "12 nombres más _U en 8 filas; código–nombre uno-a-uno. Sin nulos, vacíos ni espacios de borde detectados.",
          "regla": "Validar códigos y resolver _U antes de integración; conservar originales."
        },
        {
          "campo": "direccion_municipio_id",
          "significado": "Código municipal de origen",
          "global": "Localidad.código",
          "decision": "Mapear / revisar",
          "hallazgos": "int64; 90 códigos; un nombre y un valor provincial por código, incluidos marcadores; codificación no verificada. Sin nulos, vacíos ni espacios de borde detectados.",
          "regla": "Validar códigos y resolver _U antes de integración; conservar originales."
        },
        {
          "campo": "direccion_municipio_nombre",
          "significado": "Nombre municipal",
          "global": "Localidad.nombre",
          "decision": "Mapear / revisar",
          "hallazgos": "83 nombres y _U; 7 códigos sin nombre en 8 filas; tampoco tienen provincia conocida; nombres conocidos uno-a-uno con código. Sin nulos, vacíos ni espacios de borde detectados.",
          "regla": "Validar códigos y resolver _U antes de integración; conservar originales."
        },
        {
          "campo": "direccion_isla_id",
          "significado": "Código de isla",
          "global": "—",
          "decision": "Auxiliar",
          "hallazgos": "7 códigos y _U; 40 _U: 32 filas de provincia peninsular y 8 de provincia desconocida. Sin nulos, vacíos ni espacios de borde detectados.",
          "regla": "Preservar códigos y nombres; tratar marcadores; isla no tiene atributo propio en la global."
        },
        {
          "campo": "direccion_isla_nombre",
          "significado": "Nombre de isla",
          "global": "—",
          "decision": "Auxiliar",
          "hallazgos": "7 nombres y _U; código–nombre uno-a-uno. _U puede ser no aplicable o desconocido. Sin nulos, vacíos ni espacios de borde detectados.",
          "regla": "Preservar códigos y nombres; tratar marcadores; isla no tiene atributo propio en la global."
        },
        {
          "campo": "telefono_1",
          "significado": "Primer teléfono",
          "global": "Entidad.contacto",
          "decision": "Mapear / revisar",
          "hallazgos": "728 únicos; completo, sin _U/vacíos/espacios de borde; 803 cumplen (34)+9 dígitos, 7 no. Un valor por cada uno de los 745 NIF.",
          "regla": "Revisar anomalías; patrón no demuestra validez."
        },
        {
          "campo": "telefono_2",
          "significado": "Segundo teléfono",
          "global": "Entidad.contacto",
          "decision": "Mapear / revisar",
          "hallazgos": "171 únicos incluido _U; 625 _U; 185 informados, 183 cumplen patrón y 2 no. Un valor informado por cada uno de 172 NIF; igual al primero en 20 filas.",
          "regla": "Tratar _U y eliminar duplicación de contacto sin eliminar registros."
        },
        {
          "campo": "pagina_web",
          "significado": "Web u otra referencia",
          "global": "Entidad.URL",
          "decision": "Mapear / revisar",
          "hallazgos": "173 únicos incluido _U; 619 _U, 191 informados, 172 distintos. Sin vacíos ni espacios de borde; 6 filas con espacios internos. Email, texto y hhtps://; un valor informado por cada uno de 172 NIF.",
          "regla": "Clasificar y limpiar; no corregir dominios por conjetura; disponibilidad no verificada."
        },
        {
          "campo": "area_id",
          "significado": "Código de área",
          "global": "Entidad.ambito",
          "decision": "Mapear / revisar",
          "hallazgos": "9 códigos int64 completos; uno-a-uno con nombre. 16 NIF con varias áreas.",
          "regla": "Mapear por significado y conservar multiplicidad."
        },
        {
          "campo": "area_nombre",
          "significado": "área de actividad",
          "global": "Entidad.ambito",
          "decision": "Mapear / revisar",
          "hallazgos": "9 nombres; sin nulos/_U/vacíos/espacios de borde. Varios: 414 filas. Categorías distintas del enum global.",
          "regla": "Revisar categorías residuales y mixtas; usar subáreas como evidencia."
        },
        {
          "campo": "subarea_id",
          "significado": "Código de subárea",
          "global": "Entidad.ambito (auxiliar)",
          "decision": "Mapear / revisar",
          "hallazgos": "16 códigos más _U en 394 filas; 1–7 en área 9 y A–I en área 8; uno-a-uno con nombre.",
          "regla": "Preservar área–subárea y códigos como texto; _U no es categoría."
        },
        {
          "campo": "subarea_nombre",
          "significado": "Detalle de actividad",
          "global": "Entidad.ambito (auxiliar)",
          "decision": "Mapear / revisar",
          "hallazgos": "16 nombres más _U; sin nulos/vacíos/espacios de borde. Grupos NIF–área excluyendo _U: 341 con 1 subárea, 29 con 2, 3 con 3 y 1 con 6.",
          "regla": "Conservar todas las subáreas; precisar mapeo sin forzar equivalencias."
        }
      ],
      "ambitos": [
        {
          "global": "MAYORES",
          "origen": "Tercera Edad",
          "estado": "Mapeado",
          "nota": "Correspondencia semántica propuesta; conservar múltiples ámbitos."
        },
        {
          "global": "DISCAPACIDAD",
          "origen": "Discapacidad",
          "estado": "Mapeado",
          "nota": "Correspondencia semántica propuesta; conservar múltiples ámbitos."
        },
        {
          "global": "INFANCIA_Y_JUVENTUD",
          "origen": "Menores Y Juventud",
          "estado": "Mapeado",
          "nota": "Correspondencia semántica propuesta; conservar múltiples ámbitos."
        },
        {
          "global": "MUJER",
          "origen": "Mujer",
          "estado": "Mapeado",
          "nota": "Correspondencia semántica propuesta; conservar múltiples ámbitos."
        },
        {
          "global": "INCLUSION_SOCIAL",
          "origen": "Exclusión Social",
          "estado": "Mapeado",
          "nota": "Correspondencia semántica propuesta; conservar múltiples ámbitos."
        },
        {
          "global": "VOLUNTARIADO_Y_PARTICIPACION_COMUNITARIA",
          "origen": "Voluntariado",
          "estado": "Mapeado",
          "nota": "Correspondencia semántica propuesta; conservar múltiples ámbitos."
        },
        {
          "global": "MIGRACION",
          "origen": "Varios / Migración",
          "estado": "Revisar",
          "nota": "Subárea explícita; no aplicar a todo Varios."
        },
        {
          "global": "SALUD_Y_ATENCION_SOCIOSANITARIA",
          "origen": "Drogodependencia; Varios / H; Voluntariado / Asuntos Sanitarios",
          "estado": "Revisar",
          "nota": "Candidatos más amplios; revisar alcance."
        },
        {
          "global": "EDUCACION_Y_FORMACION",
          "origen": "Voluntariado / 4",
          "estado": "Revisar",
          "nota": "Subárea mezcla educación, ciencia, cultura y deportes; revisar."
        },
        {
          "global": "EMPLEO_E_INSERCION_LABORAL",
          "origen": "Centros Ocupacionales; Varios / B",
          "estado": "Revisar",
          "nota": "No asumir inserción laboral por centro ocupacional; B mezcla servicios e inclusión."
        },
        {
          "global": "CULTURA_Y_DESARROLLO_COMUNITARIO",
          "origen": "Varios / A, E; Voluntariado / 4",
          "estado": "Revisar",
          "nota": "Categorías compuestas; revisar."
        },
        {
          "global": "SALUD_MENTAL",
          "origen": "—",
          "estado": "No representado",
          "nota": "Sin categoría explícita equivalente; no inferir de Drogodependencia."
        },
        {
          "global": "—",
          "origen": "Varios / Otros; restantes subáreas mixtas",
          "estado": "Revisar",
          "nota": "Preservar detalle; no forzar categorías residuales al enum."
        }
      ],
      "decisiones": [
        {
          "tema": "Identidad y granularidad",
          "prioridad": "Alta",
          "evidencia": "Organizaciones y registros en Canarias frente a centros en Valencia; 4 NIF con dos registros, direcciones múltiples.",
          "decision": "Acordar significado de Entidad, claves globales y representación de sedes; no vincular NIF y ni_centro automáticamente."
        },
        {
          "tema": "Multiplicidad de ámbitos",
          "prioridad": "Alta",
          "evidencia": "16 NIF con varias áreas y 33 grupos con varias subáreas; Python admite un único Ambito.",
          "decision": "Permitir varios ámbitos o definir representación sin pérdida; aprobar equivalencias ambiguas."
        },
        {
          "tema": "Municipios incompletos y codificación",
          "prioridad": "Alta",
          "evidencia": "7 códigos en 8 filas sin nombre/provincia; código municipal no validado. Python exige Localidad.nombre y en_provincia.",
          "decision": "Validar sistema, acordar enriquecimiento, cuarentena o modelo opcional; no asumir códigos INE ni fabricar relaciones."
        },
        {
          "tema": "Direcciones y sedes",
          "prioridad": "Alta",
          "evidencia": "Componentes mezclados y duplicados; varias direcciones por NIF.",
          "decision": "Acordar varias sedes/localidades y composición; no concatenar ciegamente ni escoger dirección arbitraria."
        },
        {
          "tema": "Nombres y truncamientos",
          "prioridad": "Media",
          "evidencia": "Finales sospechosos confirmados en JSON, posibles erratas.",
          "decision": "Preservar originales y corregir solo con evidencia."
        },
        {
          "tema": "Contactos y webs",
          "prioridad": "Media",
          "evidencia": "9 teléfonos fuera de patrón; 20 contactos repetidos; web mezcla URL/email/texto.",
          "decision": "Definir estructura, limpieza, revisión y tratamiento de marcadores."
        },
        {
          "tema": "Información sin destino",
          "prioridad": "Media",
          "evidencia": "Isla y registro sin atributo dedicado; faltan postal, coordenadas y descripción.",
          "decision": "Conservar metadatos; dejar campos sin fuente ausentes y acordar significado contextual de _U."
        }
      ]
    }
  ]
};
