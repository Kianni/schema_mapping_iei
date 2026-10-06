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
    },
    {
      "id": "catalunya_ongd",
      "nombre": "Catalunya · ONGD",
      "archivo": "Entitats_ONGD_pretty.xml",
      "registros": 765,
      "campos": 11,
      "resumen": [
        "Análisis documentado en notebooks/entitats_xml.ipynb: 765 registros entitat y 11 campos, sin filas completamente duplicadas, campos anidados ni atributos XML. Solo observaciones; no se limpian, transforman ni fusionan datos.",
        "Registro y nombre están completos y son únicos dentro del archivo. 27 registros incluyen un punto en el XML, como 1.005, e infieren float64 en pandas; su significado y la identidad entre fuentes quedan abiertos.",
        "Hay palabras concatenadas ya en XML en nombre, naturaleza, dirección y municipio. 764 nombres no contienen caracteres de espacio; el restante contiene un salto de línea. Todas las direcciones, etiquetas de naturaleza y municipios carecen de espacios; los valores de una palabra no son errores por este motivo.",
        "CIF: 83 ausentes y dos valores repetidos en cuatro filas. Los grupos tienen nombres, registros, direcciones y contactos distintos; G55258909 también presenta naturalezas distintas. Las comparaciones no determinan relación jurídica ni error de fuente.",
        "Los 765 códigos postales literales tienen cinco dígitos y 618 empiezan por cero, perdido al inferir int64. Seis códigos tienen varios municipios y 21 municipios varios códigos. VilanovailaGeltrú presenta 00800 en una fila y 08800 en dos: discrepancia pendiente de revisión.",
        "Teléfonos: 221 ausencias en tel_fon y 212 en tel_fon_m_bil; 40 y 23 celdas fuera del patrón de un único número de nueve dígitos. Se distinguen multilínea, extensiones, barra y prefijo; el rótulo no acredita servicio fijo o móvil.",
        "Correo: 35 ausentes. De las celdas informadas, 76 cumplen el patrón simple, 627 tienen una @ y dominio sin punto, 25 tienen varias @ y 2 ninguna. No se reconstruyen dominios ni se valida entrega.",
        "Web: 154 ausentes; 56 valores repiten esquemas como http://https://. Los 611 hostnames analizados carecen de puntos, incluidos los casos donde el hostname es un efecto de esa sintaxis. No se establecen dominios previstos ni disponibilidad.",
        "Direcciones y contactos compartidos no demuestran duplicación: 10 direcciones repetidas en 20 filas; 28 teléfonos, 10 móviles, 4 correos y 3 webs repetidos. Los dos registros Yamuna comparten los cuatro contactos, pero difieren en CIF, nombre, naturaleza y dirección.",
        "En 12 filas faltan ambos teléfonos; 11 conservan correo. Una carece también de correo y web (registro 392). De 35 filas sin correo, 34 tienen teléfono. Ausencias de CIF y contactos no coinciden; diferencias por naturaleza son descriptivas, no causales.",
        "Correspondencias candidatas: registro, nombre, dirección, código postal, municipio, contactos y web. Faltan coordenadas, descripción explícita, clasificación para Ambito, código municipal y provincia. Naturaleza jurídica no equivale a Ambito; en_localidad no puede completarse con campos explícitos solamente."
      ],
      "mapeoGlobal": [
        {
          "objeto": "Entidad",
          "campo": "cod_entidad",
          "origen": "n_mero_registre",
          "estado": "Transformación",
          "regla": "Candidato a identificador textual; acordar representación del registro y unicidad entre fuentes. No aplicar interpretación numérica al punto.",
          "nota": "765 valores únicos y completos en XML y pandas; 738 textos de dígitos y 27 con punto seguido de tres dígitos. Ninguna regla de transformación ha sido ejecutada."
        },
        {
          "objeto": "Entidad",
          "campo": "nombre",
          "origen": "nom_de_l_entitat",
          "estado": "Directo",
          "regla": "Correspondencia candidata directa, conservando el nombre literal. No reconstruir espacios sin evidencia.",
          "nota": "765 nombres distintos y completos; longitudes 5–165; 764 sin caracteres de espacio y uno con salto de línea. Unicidad local no implica identidad universal."
        },
        {
          "objeto": "Entidad",
          "campo": "ambito",
          "origen": "—",
          "estado": "Sin correspondencia",
          "regla": "No asignar Ambito por nombre, naturaleza jurídica ni por pertenecer al registro ONGD.",
          "nota": "No hay clasificación de actividad o población destinataria que establezca valores del enum. naturalesa describe forma jurídica; Ambito admite None en Python."
        },
        {
          "objeto": "Entidad",
          "campo": "direccion",
          "origen": "adre_a",
          "estado": "Directo",
          "regla": "Correspondencia candidata con texto original; no separar o recomponer direcciones en este informe.",
          "nota": "765 valores, 755 distintos; longitudes 7–66; ninguno contiene espacios. 10 direcciones repetidas en 20 filas con registros y nombres distintos."
        },
        {
          "objeto": "Entidad",
          "campo": "codigo_postal",
          "origen": "codi_postal",
          "estado": "Transformación",
          "regla": "En la integración futura tomar texto literal del XML, compatible con str | None; representación pendiente. No corregir discrepancias geográficas por conjetura.",
          "nota": "Todos los textos tienen cinco dígitos; 618 empiezan por cero, perdido en int64. 209 códigos distintos; 00800/08800 para VilanovailaGeltrú requiere revisión."
        },
        {
          "objeto": "Entidad",
          "campo": "longitud",
          "origen": "—",
          "estado": "Sin correspondencia",
          "regla": "Sin coordenada de origen; no inferirla a partir del texto de dirección en este análisis.",
          "nota": "No hay coordenadas ni geometrías; el atributo admite None."
        },
        {
          "objeto": "Entidad",
          "campo": "latitud",
          "origen": "—",
          "estado": "Sin correspondencia",
          "regla": "Sin coordenada de origen; no inferirla a partir del texto de dirección en este análisis.",
          "nota": "No hay coordenadas ni geometrías; el atributo admite None."
        },
        {
          "objeto": "Entidad",
          "campo": "descripcion",
          "origen": "—",
          "estado": "Sin correspondencia",
          "regla": "No generar descripción a partir del nombre o de la naturaleza jurídica.",
          "nota": "No hay descripción explícita; el atributo admite None."
        },
        {
          "objeto": "Entidad",
          "campo": "contacto",
          "origen": "tel_fon + tel_fon_m_bil + correu_electr_nic",
          "estado": "Compuesto",
          "regla": "Acordar representación de los tres componentes y de varios valores en una celda dentro de un único str | None. No seleccionar, unir o separar contactos aquí.",
          "nota": "12 filas sin ambos teléfonos; 11 conservan correo. Una sin teléfono, móvil, correo ni web. Hay contactos compartidos entre registros distintos."
        },
        {
          "objeto": "Entidad",
          "campo": "URL",
          "origen": "web",
          "estado": "Transformación",
          "regla": "Correspondencia candidata; revisar sintaxis con la fuente anterior antes de definir cualquier transformación. No insertar puntos ni retirar prefijos por conjetura.",
          "nota": "En global_schema.py el atributo se llama url; la interfaz usa la etiqueta URL. 611 valores, 154 ausentes, 56 esquemas repetidos; ningún hostname analizado contiene puntos."
        },
        {
          "objeto": "Localidad",
          "campo": "código",
          "origen": "—",
          "estado": "Sin correspondencia",
          "regla": "No usar codi_postal como identificador municipal. Falta una fuente explícita para codigo (nombre del atributo en Python).",
          "nota": "No hay código municipal. 21 municipios tienen varios códigos postales y seis códigos postales varios municipios; Localidad.codigo es obligatorio."
        },
        {
          "objeto": "Localidad",
          "campo": "nombre",
          "origen": "municipi",
          "estado": "Directo",
          "regla": "Correspondencia candidata con etiqueta original; no reconstruir espacios ni equivalencias oficiales sin evidencia.",
          "nota": "765 valores completos y 113 etiquetas distintas. El nombre no basta para construir Localidad: también exige codigo y en_provincia."
        },
        {
          "objeto": "Provincia",
          "campo": "código",
          "origen": "—",
          "estado": "Sin correspondencia",
          "regla": "Sin código provincial explícito; no asignar provincias a partir de prefijos postales no verificados.",
          "nota": "Provincia.codigo es obligatorio en Python. Solo se han contado prefijos literales, no validado ni derivado provincias."
        },
        {
          "objeto": "Provincia",
          "campo": "nombre",
          "origen": "—",
          "estado": "Sin correspondencia",
          "regla": "Sin nombre provincial explícito; dejar pendiente la representación y cualquier enriquecimiento.",
          "nota": "Provincia.nombre es obligatorio; no existe columna equivalente en XML."
        },
        {
          "objeto": "Entidad",
          "campo": "en_localidad",
          "origen": "—",
          "estado": "Revisar modelo",
          "regla": "Relación obligatoria pendiente: resolver códigos de localidad y provincia antes de construir Entidad. No fabricar objetos incompletos.",
          "nota": "municipi solo aporta Localidad.nombre. El esquema Python exige un objeto Localidad; la relación se muestra aparte de los atributos escalares del resumen."
        },
        {
          "objeto": "Localidad",
          "campo": "en_provincia",
          "origen": "—",
          "estado": "Sin correspondencia",
          "regla": "Relación obligatoria sin provincia explícita; requiere decisión de modelo o enriquecimiento acordado.",
          "nota": "global_schema.py exige un objeto Provincia con codigo y nombre. Ninguna relación provincial ha sido inferida."
        }
      ],
      "inventario": [
        {
          "campo": "n_mero_registre",
          "significado": "Identificador de registro de la entidad",
          "global": "Entidad.cod_entidad (candidato)",
          "decision": "Revisar",
          "hallazgos": "765 valores no nulos; todos únicos en pandas y en el XML literal. Registro y nombre tienen relación uno a uno en este archivo. pandas infiere float64: 738 textos contienen solo dígitos y 27 un punto seguido de tres dígitos, por ejemplo 1.005. El punto podría separar miles; su significado no está confirmado. No se interpreta como magnitud ni se corrige. Al excluir registro, nombre y CIF, no hay dos filas iguales en todos los demás campos. Candidato a Entidad.cod_entidad (str). Quedan abiertas la unicidad entre fuentes y la representación final.",
          "regla": "Conservar el texto literal del XML. Acordar significado del punto y clave entre fuentes; no convertir por conjetura a entero."
        },
        {
          "campo": "nom_de_l_entitat",
          "significado": "Nombre de la organización",
          "global": "Entidad.nombre",
          "decision": "Mapear",
          "hallazgos": "765 nombres informados y distintos; longitudes de 5 a 165. Sin espacios iniciales/finales. 764 nombres no contienen caracteres de espacio; el restante contiene un salto de línea. Todos coinciden con el XML literal. Hay palabras concatenadas, como AccióSolidàriadelVallès, que pueden dificultar lectura y comparación. Los nombres de una palabra no requieren espacios. Se muestran longitudes extremas y finales para inspección; estas comprobaciones no demuestran truncamiento. Candidato a Entidad.nombre; su unicidad aquí no demuestra identidad universal.",
          "regla": "Correspondencia candidata directa. Conservar la grafía de origen; no insertar espacios ni reconstruir nombres sin evidencia."
        },
        {
          "campo": "naturalesa",
          "significado": "Naturaleza jurídica u organizativa",
          "global": "—",
          "decision": "Sin correspondencia",
          "hallazgos": "Campo categórico completo: 12 valores; Associació aparece en 536 filas y Fundació en 132. Etiquetas compuestas sin espacios, como AssociacióEstatal; no es anomalía en etiquetas de una palabra. Ausencias por naturaleza: CIF en 73/536 asociaciones (13,6%) y 9/132 fundaciones (6,8%); móvil en 127/536 (23,7%) y 58/132 (43,9%), respectivamente. Se muestran tamaños y porcentajes por grupo. Las categorías pequeñas no permiten generalizaciones ni conclusiones causales. Describe naturaleza jurídica/organizativa, no Ambito. No hay atributo específico en el esquema.",
          "regla": "No equiparar naturaleza jurídica con Ambito. Decidir si el modelo necesita un atributo específico; conservar como dato de origen."
        },
        {
          "campo": "cif_entitat",
          "significado": "Identificador fiscal informado por la fuente",
          "global": "—",
          "decision": "Revisar",
          "hallazgos": "682 valores informados, 83 ausentes (10,8%) y 680 CIF distintos. Todos los textos informados tienen nueve caracteres. 681 cumplen el patrón orientativo de organización. 46414697F tiene forma similar a DNI; no se valida control ni identidad jurídica. Dos CIF repetidos afectan a cuatro filas. Ambos grupos difieren en registro, nombre, dirección, código postal, municipio, móvil y correo. G55258909 también difiere en naturaleza (Associació / Federació) y disponibilidad de teléfono. G10932812 tiene Associació en ambas filas y carece de teléfono en las dos. Las cuatro carecen de web. La comparación completa no determina si son organizaciones relacionadas o errores de fuente. Compartir CIF no basta para fusionar. No es clave completa y única; no hay atributo CIF/NIF específico en el esquema.",
          "regla": "Sin atributo CIF/NIF específico. Revisar ausencias y grupos repetidos; no usar como clave única ni fusionar por CIF."
        },
        {
          "campo": "adre_a",
          "significado": "Dirección en texto libre con componentes unidos",
          "global": "Entidad.direccion",
          "decision": "Mapear",
          "hallazgos": "765 direcciones informadas y 755 distintas; longitudes de 7 a 66. Ninguna contiene caracteres de espacio. Palabras y componentes unidos, como PladelVinyet,9BlocDbaixos; puntuación y separación variables, ya en el XML. 10 direcciones aparecen dos veces (20 filas). Cada pareja comparte municipio y código postal, pero tiene registros y nombres distintos. Siete parejas tienen dos CIF conocidos distintos; en tres falta uno de los CIF. Las tablas comparan los demás campos. Compartir dirección no demuestra duplicación. Candidato a Entidad.direccion; no se reconstruyen componentes.",
          "regla": "Correspondencia candidata directa. Preservar texto y detalles; una dirección compartida no justifica fusionar registros."
        },
        {
          "campo": "codi_postal",
          "significado": "Código postal literal de cinco dígitos",
          "global": "Entidad.codigo_postal",
          "decision": "Transformación",
          "hallazgos": "765 valores completos y 209 distintos. Todos los textos XML tienen cinco dígitos; 618 empiezan por cero. pandas infiere int64 y pierde ceros iniciales en la representación cargada. 00800 se observa como 800 en el registro 540; su exactitud geográfica no está comprobada. Seis códigos aparecen con varios municipios: 08197, 08227, 08293, 08330, 08902, 08930. Se muestra contexto de nombre y dirección para revisión. 21 municipios tienen varios códigos. La relación no es uno a uno y por sí sola no demuestra errores. Candidato a Entidad.codigo_postal (str | None), no Localidad.codigo. No se restauran ceros ni se cambian códigos.",
          "regla": "El esquema espera texto. Para una integración futura usar el valor literal del XML, sin inferencia numérica; no corregir códigos geográficos por conjetura."
        },
        {
          "campo": "municipi",
          "significado": "Nombre del municipio",
          "global": "Localidad.nombre",
          "decision": "Mapear",
          "hallazgos": "765 valores informados y 113 etiquetas distintas. Barcelona aparece 428 veces. Sin caracteres de espacio. Nombres compuestos como SantCugatdelVallès concatenan palabras; esto no afecta a nombres de una palabra como Barcelona. Se muestran longitudes extremas y multiplicidad de códigos y prefijos postales; no se asignan provincias mediante prefijos. 112 municipios tienen un prefijo postal literal; VilanovailaGeltrú tiene dos: 00 (una fila, 00800) y 08 (dos filas, 08800). Es una discrepancia interna para revisión; no se establece aquí el código correcto. Candidato a Localidad.nombre mediante Entidad.en_localidad. Faltan código municipal, código/nombre de provincia y relación provincial explícita. No se establece exactitud geográfica ni equivalencia con etiquetas municipales oficiales.",
          "regla": "Correspondencia candidata con nombre. No sustituir código municipal por código postal ni fabricar la relación con Provincia."
        },
        {
          "campo": "tel_fon",
          "significado": "Contacto telefónico; puede incluir varios números o extensiones",
          "global": "Entidad.contacto",
          "decision": "Compuesto",
          "hallazgos": "544 textos informados, 221 ausentes (28,9%) y 510 textos distintos. 504 contienen nueve dígitos. Los otros 40: 34 multilínea, 4 con extensión en una línea, 1 con barra en una línea y 1 con prefijo internacional en una línea. Categorías excluyentes; multilínea tiene prioridad. 26 celdas multilínea tienen dos líneas de nueve dígitos exactos. Otras incluyen espacios, barra, extensión o una segunda línea de ocho dígitos; se muestran literalmente. 22 de los 504 valores de nueve dígitos empiezan por 6. El rótulo no garantiza teléfono fijo; el formato no acredita validez del número. 28 textos se repiten en 62 filas; 27 grupos tienen varias direcciones y 3 varios municipios. Compartir número no demuestra identidad de entidad. Componente candidato para Entidad.contacto; no se separan ni reescriben celdas.",
          "regla": "Componente candidato de contacto. Definir representación sin pérdida de varios números y extensiones; no aplicar selección, separación o limpieza en este informe."
        },
        {
          "campo": "tel_fon_m_bil",
          "significado": "Segundo contacto telefónico, etiquetado como móvil",
          "global": "Entidad.contacto",
          "decision": "Compuesto",
          "hallazgos": "553 textos informados, 212 ausentes (27,7%) y 543 textos distintos. 530 contienen nueve dígitos; 23 son multilínea. De estas, 22 tienen dos líneas de nueve dígitos y una incluye +34 en la segunda línea. Ocho valores de nueve dígitos empiezan por 9; el rótulo no acredita servicio móvil. 10 textos se repiten en 20 filas; todos los grupos tienen direcciones distintas y 4 varios municipios. En 12 filas faltan ambos teléfonos. Una fila tiene el mismo valor informado en ambos campos; tres grupos de dos filas comparten la pareja telefónica, pero tienen CIF distintos. Componente candidato para Entidad.contacto; no se seleccionan ni separan teléfonos.",
          "regla": "Componente candidato de contacto; no garantizar servicio móvil por el rótulo. Acordar tratamiento de multiplicidad y coincidencias entre teléfonos."
        },
        {
          "campo": "correu_electr_nic",
          "significado": "Correo de contacto; algunas celdas incluyen varios textos",
          "global": "Entidad.contacto",
          "decision": "Compuesto",
          "hallazgos": "730 textos informados, 35 ausentes (4,6%) y 726 textos distintos. Categorías excluyentes por celda: 76 cumplen el patrón simple de correo único; 627 tienen una @ y dominio sin punto; 25 tienen varias @; 2 no tienen @. Entre los 627 casos está acciosolidariavalles@gmailcom. Por separado, 650 celdas no contienen ningún punto en todo el texto; son medidas distintas. De las 25 celdas con varias @, 9 contienen saltos de línea y 16 carecen de espacios. Sin @: sakadawaorggmailcom e infoarrobaproinfantsorg. Ya aparecen así en XML. Cuatro textos se repiten en ocho filas; cada pareja tiene nombres y direcciones distintos. Tres parejas tienen dos CIF conocidos distintos; en una falta un CIF. Una pareja abarca dos municipios. El patrón no determina entrega ni dirección prevista. Candidato a Entidad.contacto; no se insertan puntos ni separadores.",
          "regla": "Componente candidato de contacto. No insertar puntos ni separar correos concatenados por conjetura; el patrón no valida entrega ni dominio previsto."
        },
        {
          "campo": "web",
          "significado": "Referencia web de la entidad",
          "global": "Entidad.URL (url en Python)",
          "decision": "Revisar",
          "hallazgos": "611 textos informados, 154 ausentes (20,1%) y 607 textos distintos. 56 celdas repiten el esquema, como http://https://cecodees/. En ellas urlsplit devuelve https o http como hostname: efecto de análisis de la sintaxis de origen. Los 611 hostnames analizados carecen de puntos, incluidos esos 56 casos. Ejemplos ordinarios como http://wwwigmancat también carecen de punto en el host literal. No se establecen dominios previstos. Tres URLs se repiten en siete filas. Quepo y Yamuna tienen CIF conocidos distintos; http://wwwsolidariesorg abarca tres nombres y dos municipios, con un CIF ausente. Dos registros Yamuna comparten los cuatro contactos informados, pero difieren en registro, nombre, CIF, naturaleza y texto de dirección. Sugiere revisar una posible relación, no fusionar automáticamente. Candidato a Entidad.url; no se reparan esquemas/dominios ni se comprueba DNS o disponibilidad.",
          "regla": "Correspondencia candidata con Entidad.url. Conservar texto y señalar dominios sin puntos y esquemas repetidos; no reconstruir URL ni comprobar disponibilidad aquí."
        }
      ],
      "ambitos": [
        {
          "global": "MAYORES",
          "origen": "—",
          "estado": "No representado",
          "nota": "Sin categoría explícita de actividad o población destinataria que establezca esta correspondencia. naturalesa es jurídica y no determina Ambito; no se infiere por nombre ni por registro ONGD."
        },
        {
          "global": "DISCAPACIDAD",
          "origen": "—",
          "estado": "No representado",
          "nota": "Sin categoría explícita de actividad o población destinataria que establezca esta correspondencia. naturalesa es jurídica y no determina Ambito; no se infiere por nombre ni por registro ONGD."
        },
        {
          "global": "SALUD_MENTAL",
          "origen": "—",
          "estado": "No representado",
          "nota": "Sin categoría explícita de actividad o población destinataria que establezca esta correspondencia. naturalesa es jurídica y no determina Ambito; no se infiere por nombre ni por registro ONGD."
        },
        {
          "global": "INFANCIA_Y_JUVENTUD",
          "origen": "—",
          "estado": "No representado",
          "nota": "Sin categoría explícita de actividad o población destinataria que establezca esta correspondencia. naturalesa es jurídica y no determina Ambito; no se infiere por nombre ni por registro ONGD."
        },
        {
          "global": "MUJER",
          "origen": "—",
          "estado": "No representado",
          "nota": "Sin categoría explícita de actividad o población destinataria que establezca esta correspondencia. naturalesa es jurídica y no determina Ambito; no se infiere por nombre ni por registro ONGD."
        },
        {
          "global": "MIGRACION",
          "origen": "—",
          "estado": "No representado",
          "nota": "Sin categoría explícita de actividad o población destinataria que establezca esta correspondencia. naturalesa es jurídica y no determina Ambito; no se infiere por nombre ni por registro ONGD."
        },
        {
          "global": "INCLUSION_SOCIAL",
          "origen": "—",
          "estado": "No representado",
          "nota": "Sin categoría explícita de actividad o población destinataria que establezca esta correspondencia. naturalesa es jurídica y no determina Ambito; no se infiere por nombre ni por registro ONGD."
        },
        {
          "global": "EDUCACION_Y_FORMACION",
          "origen": "—",
          "estado": "No representado",
          "nota": "Sin categoría explícita de actividad o población destinataria que establezca esta correspondencia. naturalesa es jurídica y no determina Ambito; no se infiere por nombre ni por registro ONGD."
        },
        {
          "global": "EMPLEO_E_INSERCION_LABORAL",
          "origen": "—",
          "estado": "No representado",
          "nota": "Sin categoría explícita de actividad o población destinataria que establezca esta correspondencia. naturalesa es jurídica y no determina Ambito; no se infiere por nombre ni por registro ONGD."
        },
        {
          "global": "SALUD_Y_ATENCION_SOCIOSANITARIA",
          "origen": "—",
          "estado": "No representado",
          "nota": "Sin categoría explícita de actividad o población destinataria que establezca esta correspondencia. naturalesa es jurídica y no determina Ambito; no se infiere por nombre ni por registro ONGD."
        },
        {
          "global": "VOLUNTARIADO_Y_PARTICIPACION_COMUNITARIA",
          "origen": "—",
          "estado": "No representado",
          "nota": "Sin categoría explícita de actividad o población destinataria que establezca esta correspondencia. naturalesa es jurídica y no determina Ambito; no se infiere por nombre ni por registro ONGD."
        },
        {
          "global": "CULTURA_Y_DESARROLLO_COMUNITARIO",
          "origen": "—",
          "estado": "No representado",
          "nota": "Sin categoría explícita de actividad o población destinataria que establezca esta correspondencia. naturalesa es jurídica y no determina Ambito; no se infiere por nombre ni por registro ONGD."
        }
      ],
      "decisiones": [
        {
          "tema": "Identidad y registro",
          "prioridad": "Alta",
          "evidencia": "765 registros y nombres únicos dentro del archivo; 27 registros con punto. CIF incompleto y repetido en dos grupos. Valencia describe centros y las otras fuentes pueden usar otra granularidad.",
          "decision": "Acordar qué representa Entidad, significado del registro y clave entre fuentes; no vincular automáticamente registro, CIF y ni_centro."
        },
        {
          "tema": "CIF repetidos",
          "prioridad": "Alta",
          "evidencia": "G10932812 y G55258909 afectan a cuatro filas con direcciones y contactos distintos; G55258909 también difiere en naturaleza. Las cuatro carecen de web.",
          "decision": "Revisar con una fuente autorizada si son organizaciones relacionadas o errores; no fusionar ni corregir el CIF por conjetura."
        },
        {
          "tema": "Localidad y provincia obligatorias",
          "prioridad": "Alta",
          "evidencia": "Solo hay nombre municipal; faltan código municipal y provincia explícita. Python exige Entidad.en_localidad y Localidad.en_provincia.",
          "decision": "Acordar enriquecimiento o representación en el modelo antes de integrar; no sustituir código municipal por postal ni fabricar relaciones provinciales."
        },
        {
          "tema": "Palabras concatenadas en XML",
          "prioridad": "Alta",
          "evidencia": "Ejemplos en nombre, naturaleza, dirección y municipio coinciden con el XML literal. Los valores de una palabra no necesitan espacios; no se ha establecido la causa.",
          "decision": "Revisar el documento o extracción previa para establecer el texto previsto; preservar originales y no reconstruir espacios automáticamente."
        },
        {
          "tema": "Código postal: tipo y discrepancias",
          "prioridad": "Alta",
          "evidencia": "618 códigos con cero inicial perdido por inferencia numérica; seis códigos con varios municipios. Registro 540: 00800 en VilanovailaGeltrú; otras dos filas del municipio: 08800.",
          "decision": "Acordar lectura textual en la integración y revisar asociaciones geográficas; no afirmar el código correcto ni aplicar relleno o sustitución por conjetura."
        },
        {
          "tema": "Dominio email y varios correos",
          "prioridad": "Alta",
          "evidencia": "627 celdas con una @ y dominio sin punto; 25 con varias @ (9 multilínea y 16 sin espacios); dos sin @. Anomalías ya presentes en XML.",
          "decision": "Consultar fuente anterior para determinar dominios y separación de contactos; conservar textos, sin insertar puntos o dividir por conjetura."
        },
        {
          "tema": "URL y esquemas repetidos",
          "prioridad": "Alta",
          "evidencia": "56 textos con varios esquemas http(s)://; los 611 hostnames analizados carecen de puntos. En esquemas repetidos el hostname resulta de la sintaxis mal formada.",
          "decision": "Confirmar URL prevista en la fuente antes de definir cualquier reparación. No equiparar análisis sintáctico con existencia o disponibilidad del sitio."
        },
        {
          "tema": "Teléfonos y único contacto global",
          "prioridad": "Media",
          "evidencia": "40 celdas tel_fon y 23 tel_fon_m_bil fuera del patrón de nueve dígitos: multilínea, extensiones, barra o prefijo. Una fila repite el mismo teléfono en ambos campos.",
          "decision": "Acordar representación sin pérdida de teléfonos, móviles y correo dentro de contacto; el informe no selecciona, separa ni normaliza valores."
        },
        {
          "tema": "Direcciones y contactos compartidos",
          "prioridad": "Media",
          "evidencia": "10 direcciones compartidas en 20 filas; dos registros Yamuna comparten todos los contactos pero tienen CIF y naturalezas distintos. Teléfonos y webs también se comparten entre municipios.",
          "decision": "Investigar posibles relaciones o sedes compartidas con contexto; no deduplicar por coincidencias aisladas ni por todos los contactos."
        },
        {
          "tema": "Ausencias conjuntas",
          "prioridad": "Media",
          "evidencia": "12 filas sin ambos teléfonos, 11 con correo. Registro 392 sin teléfono, móvil, correo ni web; 34/35 filas sin correo conservan teléfono. Ausencia de CIF no coincide con contactos incompletos.",
          "decision": "Definir tratamiento de disponibilidad sin interpretar ausencia como inactividad; porcentajes por naturaleza no establecen causas."
        },
        {
          "tema": "Cobertura de Ambito y campos sin fuente",
          "prioridad": "Media",
          "evidencia": "No hay clasificación para Ambito, coordenadas ni descripción explícita. CIF y naturaleza jurídica no tienen atributos dedicados; los campos opcionales admiten None, sin valores por defecto.",
          "decision": "Acordar conservación de metadatos y valores ausentes; no asignar Ambito desde la forma jurídica ni generar descripción o coordenadas sin otra fuente."
        }
      ]
    }
  ]
};
