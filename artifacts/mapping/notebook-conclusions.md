
===== notebooks\datos_abiertos.ipynb =====

### `nif` — conclusion

- The field represents the organisation's tax identification number
  and should be stored as a string.
- There are 810 values, of which 745 are distinct.
- No null values, `_U` placeholders, blank strings, or leading/trailing
  whitespace were detected.
- All values have 9 characters; tax identifier validity has not been checked.
- `nif` does not uniquely identify a row. The highest observed frequency
  of a single NIF is 7 records.
- In this dataset, each NIF corresponds to exactly one organisation name,
  and each organisation name corresponds to exactly one NIF.
- Each registration number corresponds to exactly one NIF.
  741 NIFs have one registration number, while 4 NIFs have two distinct
  registration numbers: an observed one-to-many relationship.
- Rows should not be removed solely because they share a NIF, since they
  may contain different registrations, addresses, or activity categories.
- These findings apply to the analysed dataset.

### `nif` — conclusión

- El campo representa el número de identificación fiscal de la organización
  y debe conservarse como texto.
- Hay 810 valores, de los cuales 745 son distintos.
- No se detectaron valores nulos, marcadores `_U`, cadenas vacías
  ni espacios al principio o al final.
- Todos los valores tienen 9 caracteres; no se ha comprobado su validez fiscal.
- `nif` no identifica una fila de forma única. La frecuencia máxima observada
  de un mismo NIF es de 7 registros.
- En este conjunto de datos, cada NIF corresponde a una única denominación
  y cada denominación corresponde a un único NIF.
- Cada número de registro corresponde a un único NIF.
  741 NIF tienen un número de registro, mientras que 4 NIF tienen dos números
  de registro distintos: una relación observada de uno a varios.
- No deben eliminarse filas únicamente por compartir el mismo NIF, ya que
  pueden contener diferentes registros, direcciones o categorías de actividad.
- Estos resultados se refieren al conjunto de datos analizado.

### `denominacion` — profile and data quality conclusions

- The field contains organisation names stored as strings.
- There are 810 non-null values and 745 distinct names.
- No blank strings or leading/trailing whitespace were detected.
- The highest observed frequency of a single name is 7 records.
- Name lengths range from 5 to 124 characters.
- Normalizing letter case and whitespace did not change the number
  of distinct names.
- Names at row indices 157, 319, and 457 have apparently incomplete
  endings and lengths of 99, 100, and 100 characters, respectively.
  These endings were also confirmed in the source JSON.
- This suggests possible truncation in the source. Its cause is unknown;
  a universal 100-character limit cannot be inferred because longer
  names also exist.
- A possible spelling error (`Otrtas`) was observed in row 319.
- In this dataset, `denominacion` and `nif` have a one-to-one relationship.
- The relationship from `denominacion` to `numero_registro` is one-to-many:
  741 names correspond to one registration number and 4 names to two.
  Each registration number corresponds to exactly one name.
- Organisation names do not uniquely identify rows. Repeated names
  should not be removed without examining the other fields.
- Preserve source values; flag suspected truncation and spelling errors
  for review rather than correcting them without supporting evidence.
- These findings apply to the analysed dataset.

### `denominacion` — conclusiones del perfil y de la calidad de los datos

- El campo contiene nombres de organizaciones almacenados como texto.
- Hay 810 valores no nulos y 745 denominaciones distintas.
- No se detectaron cadenas vacías ni espacios al principio o al final.
- La frecuencia máxima observada de una misma denominación es de 7 registros.
- Las longitudes varían entre 5 y 124 caracteres.
- La normalización de mayúsculas/minúsculas y espacios no modificó
  el número de denominaciones distintas.
- Las denominaciones de las filas con índices 157, 319 y 457 presentan
  finales aparentemente incompletos y longitudes de 99, 100 y 100 caracteres,
  respectivamente. Estos finales también se confirmaron en el JSON de origen.
- Esto sugiere un posible truncamiento en el origen. Se desconoce su causa;
  no puede deducirse un límite general de 100 caracteres, ya que también
  existen denominaciones más largas.
- Se observó una posible errata (`Otrtas`) en la fila 319.
- En este conjunto de datos, `denominacion` y `nif` tienen una relación
  de uno a uno.
- La relación de `denominacion` a `numero_registro` es de uno a varios:
  741 denominaciones corresponden a un número de registro y 4 a dos.
  Cada número de registro corresponde a una única denominación.
- Las denominaciones no identifican filas de forma única. No deben eliminarse
  nombres repetidos sin examinar los demás campos.
- Deben conservarse los valores originales y señalarse los posibles
  truncamientos y erratas para su revisión, sin corregirlos sin evidencia.
- Estos resultados se refieren al conjunto de datos analizado.

### `numero_registro` — conclusions

- The field contains registration numbers stored as strings.
- There are 810 non-null values and 749 distinct registration numbers.
- No `_U` placeholders, blank strings, or leading/trailing whitespace
  were detected.
- All values contain 14 characters and match the observed format:
  three uppercase Latin letters, four digits, two uppercase Latin letters,
  and five digits. This confirms format consistency, not registration validity.
- The highest observed frequency of a single registration number is 7 records.
- `numero_registro` does not uniquely identify a row.

#### Relationships with other fields

- Each `numero_registro` corresponds to exactly one `nif`
  and one `denominacion`.
- The relationship from `nif` to `numero_registro` is one-to-many:
  741 NIFs have one registration number and 4 NIFs have two distinct numbers.
- Likewise, 741 distinct organisation names correspond to one registration
  number and 4 names correspond to two.
- Records sharing a registration number may contain different activity
  categories (`area_id`, `area_nombre`, `subarea_id`, `subarea_nombre`),
  as observed in the inspected examples.
- Repeated registration numbers alone are not sufficient grounds
  for removing rows.
- Preserve the field as a string. Its role in the global schema will depend
  on whether the target entity represents an organisation or a registration.
- These findings apply to the analysed dataset.

### `numero_registro` — conclusiones

- El campo contiene números de registro almacenados como texto.
- Hay 810 valores no nulos y 749 números de registro distintos.
- No se detectaron marcadores `_U`, cadenas vacías ni espacios
  al principio o al final.
- Todos los valores tienen 14 caracteres y cumplen el formato observado:
  tres letras latinas mayúsculas, cuatro dígitos, dos letras latinas
  mayúsculas y cinco dígitos. Esto confirma la uniformidad del formato,
  no la validez del registro.
- La frecuencia máxima observada de un mismo número de registro
  es de 7 registros.
- `numero_registro` no identifica una fila de forma única.

#### Relaciones con otros campos

- Cada `numero_registro` corresponde a un único `nif`
  y a una única `denominacion`.
- La relación de `nif` a `numero_registro` es de uno a varios:
  741 NIF tienen un número de registro y 4 NIF tienen dos números distintos.
- Asimismo, 741 denominaciones distintas corresponden a un número
  de registro y 4 denominaciones corresponden a dos.
- Las filas que comparten un número de registro pueden contener diferentes
  categorías de actividad (`area_id`, `area_nombre`, `subarea_id`,
  `subarea_nombre`), como se observó en los ejemplos examinados.
- La repetición del número de registro no basta para justificar
  la eliminación de filas.
- El campo debe conservarse como texto. Su función en el esquema global
  dependerá de si la entidad de destino representa una organización
  o una inscripción registral.
- Estos resultados se refieren al conjunto de datos analizado.

### Street address fields — conclusions

#### `direccion_tipo_via`

- String field with 23 distinct values.
- No null values or `_U` placeholders were detected.
- 49 values are blank after trimming whitespace.
- In inspected records, `direccion_nombre_via` may include or omit the street
  type both when `direccion_tipo_via` is populated and when it is blank.
  The separation of street type and street name is therefore inconsistent.

#### `direccion_nombre_via`

- Contains 810 non-null string values and 685 distinct values.
- No `_U` placeholders, blank strings, or leading/trailing whitespace
  were detected.
- One record contains the literal string `"Null"`, a suspected missing-value
  marker that pandas does not recognize as null.
- Observed lengths range from 1 to 76 characters.
- The field may contain street types, building numbers, building details,
  locality names, and correspondence instructions in addition to street names.
- Internal whitespace inconsistencies and spelling variants were observed.
- The single-character value `"D"` requires contextual review.

#### `direccion_numero`

- Contains 810 non-null string values and 133 distinct values.
- No `_U` placeholders, blank strings, or leading/trailing whitespace
  were detected.
- Values include digits, letters, ranges, multiple numbers, and additional
  address information. The field should therefore remain a string.
- `S/n` occurs 57 times and `S/n.` twice; these conventionally mean
  “without a number”.
- Values that do not consist solely of digits are not necessarily errors.

#### `direccion_complemento`

- Contains 810 non-null string values and 180 distinct values, including `_U`.
- No blank strings were detected.
- `_U` occurs 488 times (approximately 60.2% of records); its precise meaning
  is unconfirmed.
- 70 values contain leading/trailing whitespace.
- Trimming whitespace reduces the number of distinct values from 180 to 166.
- Values include floor and unit details, varied abbreviations, and repeated
  internal spaces.
- `- - - -` is another possible missing-value marker requiring confirmation.

#### Implications for later integration

- Address components are not consistently separated across these fields.
- Preserve the original values and document these issues before mapping
  to `Entidad.direccion`.
- Transformation rules will be defined at the integration stage.

### Campos de dirección — conclusiones

#### `direccion_tipo_via`

- Campo de texto con 23 valores distintos.
- No se detectaron valores nulos ni marcadores `_U`.
- 49 valores quedan vacíos al eliminar los espacios iniciales y finales.
- En los registros examinados, `direccion_nombre_via` puede incluir u omitir
  el tipo de vía tanto cuando `direccion_tipo_via` está informado como cuando
  está vacío. La separación entre tipo y nombre de vía es inconsistente.

#### `direccion_nombre_via`

- Contiene 810 valores de texto no nulos y 685 valores distintos.
- No se detectaron marcadores `_U`, cadenas vacías ni espacios iniciales
  o finales.
- Un registro contiene el texto literal `"Null"`, un posible marcador
  de información ausente que pandas no reconoce como valor nulo.
- Las longitudes observadas varían entre 1 y 76 caracteres.
- Además del nombre de la vía, el campo puede incluir tipos de vía, números,
  detalles de edificios, localidades e instrucciones de correspondencia.
- Se observaron inconsistencias en los espacios internos y variantes
  de escritura.
- El valor de un solo carácter `"D"` requiere revisión en su contexto.

#### `direccion_numero`

- Contiene 810 valores de texto no nulos y 133 valores distintos.
- No se detectaron marcadores `_U`, cadenas vacías ni espacios iniciales
  o finales.
- Los valores incluyen dígitos, letras, intervalos, varios números
  e información adicional de dirección. Debe conservarse como texto.
- `S/n` aparece 57 veces y `S/n.` dos veces; convencionalmente significan
  “sin número”.
- Los valores que no contienen exclusivamente dígitos no son necesariamente
  errores.

#### `direccion_complemento`

- Contiene 810 valores de texto no nulos y 180 valores distintos, incluido `_U`.
- No se detectaron cadenas vacías.
- `_U` aparece 488 veces (aproximadamente el 60,2% de los registros);
  su significado exacto no está confirmado.
- 70 valores contienen espacios iniciales o finales.
- Al eliminarlos, el número de valores distintos disminuye de 180 a 166.
- Los valores incluyen detalles de plantas y unidades, abreviaturas variadas
  y espacios internos repetidos.
- `- - - -` es otro posible marcador de información ausente que requiere
  confirmación.

#### Implicaciones para la integración posterior

- Los componentes de la dirección no están separados de forma uniforme.
- Deben conservarse los valores originales y documentarse estas incidencias
  antes de asociarlos con `Entidad.direccion`.
- Las reglas de transformación se definirán en la etapa de integración.

### Province fields — conclusions

- `direccion_provincia_id` and `direccion_provincia_nombre` are string fields.
- Both contain 810 non-null values, with no blank strings or leading/trailing
  whitespace.
- Each field has 13 distinct values: 12 province codes/names and the marker `_U`.
- The pair `_U → _U` occurs in 8 records and represents potentially missing
  province information; its exact meaning remains unconfirmed.
- In this dataset, `direccion_provincia_id` and `direccion_provincia_nombre`
  have a one-to-one relationship: each code corresponds to exactly one name,
  and each name corresponds to exactly one code.
- Province codes should remain strings to preserve leading zeros, such as `"06"`.
- These fields are candidates for mapping to `Provincia.codigo`
  and `Provincia.nombre` in the global schema.
- These findings apply to the analysed dataset.

### Campos de provincia — conclusiones

- `direccion_provincia_id` y `direccion_provincia_nombre` son campos de texto.
- Ambos contienen 810 valores no nulos, sin cadenas vacías ni espacios
  al principio o al final.
- Cada campo tiene 13 valores distintos: 12 códigos/nombres de provincias
  y el marcador `_U`.
- La pareja `_U → _U` aparece en 8 registros y representa información
  provincial posiblemente ausente; su significado exacto no está confirmado.
- En este conjunto de datos, `direccion_provincia_id` y
  `direccion_provincia_nombre` tienen una relación de uno a uno:
  cada código corresponde a un único nombre y cada nombre a un único código.
- Los códigos deben conservarse como texto para mantener los ceros iniciales,
  como en `"06"`.
- Estos campos son candidatos para asociarse con `Provincia.codigo`
  y `Provincia.nombre` en el esquema global.
- Estos resultados se refieren al conjunto de datos analizado.

### Municipality fields — conclusions

- `direccion_municipio_id` is stored as `int64`; it represents an identifier,
  not a quantity.
- It contains 810 non-null values and 90 distinct codes.
- `direccion_municipio_nombre` contains 810 non-null string values and
  84 distinct values, including `_U`.
- No blank names or leading/trailing whitespace were detected.
- `_U` occurs in 8 records covering 7 distinct municipality codes.
- No names other than `_U` were found elsewhere in this dataset for those
  7 codes.

#### Relationships between fields

- Each `direccion_municipio_id` corresponds to exactly one value of
  `direccion_municipio_nombre`.
- Each of the 83 names other than `_U` corresponds to exactly one code.
  Thus, code and name have a one-to-one relationship among named municipalities.
- `_U` corresponds to 7 codes and must not be treated as the name of
  a single municipality.
- Each municipality code corresponds to exactly one value of
  `direccion_provincia_id`. However, the province is also `_U` in the
  8 records with an unknown municipality name.
- Therefore, a known province cannot be assigned to those records using
  this dataset alone.

#### Implications for later integration

- These fields are candidates for `Localidad.codigo` and `Localidad.nombre`.
- Preserve municipality codes, including those whose names are unknown.
- Converting codes to strings may be appropriate for the global schema;
  code validity and any required leading zeros have not yet been verified.
- Records containing `_U` require explicit handling during integration.
- These findings apply to the analysed dataset.

### Campos de municipio — conclusiones

- `direccion_municipio_id` está almacenado como `int64`; representa
  un identificador, no una cantidad.
- Contiene 810 valores no nulos y 90 códigos distintos.
- `direccion_municipio_nombre` contiene 810 valores de texto no nulos
  y 84 valores distintos, incluido `_U`.
- No se detectaron nombres vacíos ni espacios al principio o al final.
- `_U` aparece en 8 registros correspondientes a 7 códigos municipales distintos.
- Para esos 7 códigos no se encontraron nombres diferentes de `_U`
  en ninguna otra fila del conjunto de datos.

#### Relaciones entre los campos

- Cada `direccion_municipio_id` corresponde a un único valor de
  `direccion_municipio_nombre`.
- Cada una de las 83 denominaciones diferentes de `_U` corresponde
  a un único código. Por tanto, existe una relación de uno a uno
  entre código y nombre para los municipios con nombre informado.
- `_U` corresponde a 7 códigos y no debe interpretarse como el nombre
  de un único municipio.
- Cada código municipal corresponde a un único valor de
  `direccion_provincia_id`. Sin embargo, la provincia también es `_U`
  en los 8 registros cuyo nombre municipal es desconocido.
- Por tanto, no puede asignarse una provincia conocida a esos registros
  utilizando únicamente este conjunto de datos.

#### Implicaciones para la integración posterior

- Estos campos son candidatos para `Localidad.codigo` y `Localidad.nombre`.
- Deben conservarse los códigos municipales, incluso cuando falta el nombre.
- Puede ser apropiado convertir los códigos a texto para el esquema global;
  todavía no se han verificado su validez ni los posibles ceros iniciales.
- Los registros con `_U` requieren un tratamiento explícito durante
  la integración.
- Estos resultados se refieren al conjunto de datos analizado.

### Island fields — conclusions

- `direccion_isla_id` and `direccion_isla_nombre` are string fields.
- Both contain 810 non-null values, with no blank strings or leading/trailing
  whitespace.
- Each field contains 8 distinct values: 7 island codes/names and `_U`.
- Code and name have a one-to-one relationship in this dataset,
  including the marker pair `_U → _U`.
- `_U` occurs in 40 records: 32 have a named mainland province,
  while 8 also have `_U` in the province fields.
- This suggests that `_U` may represent either “not applicable” or
  “unknown”, depending on context; its exact meaning remains unconfirmed.
- `_U` must not be treated as an actual island.
- Preserve the island information for later integration. Its role in
  the global schema will be decided during mapping.
- These findings apply to the analysed dataset.

### Campos de isla — conclusiones

- `direccion_isla_id` y `direccion_isla_nombre` son campos de texto.
- Ambos contienen 810 valores no nulos, sin cadenas vacías ni espacios
  al principio o al final.
- Cada campo contiene 8 valores distintos: 7 códigos/nombres de islas y `_U`.
- Existe una relación de uno a uno entre código y nombre en este conjunto
  de datos, incluida la pareja de marcadores `_U → _U`.
- `_U` aparece en 40 registros: 32 tienen una provincia peninsular informada
  y 8 también contienen `_U` en los campos de provincia.
- Esto sugiere que `_U` puede representar “no aplicable” o “desconocido”,
  según el contexto; su significado exacto no está confirmado.
- `_U` no debe interpretarse como una isla real.
- Debe conservarse la información de isla para la integración posterior.
  Su función en el esquema global se decidirá durante el mapeo.
- Estos resultados se refieren al conjunto de datos analizado.

### Telephone fields — conclusions

- `telefono_1` and `telefono_2` are string fields and should remain strings.
- Both contain 810 non-null values, with no blank strings or leading/trailing
  whitespace.

#### `telefono_1`

- Contains 728 distinct values and no `_U` placeholders.
- 803 values match the pattern `(34)` followed by exactly 9 digits.
- 7 values do not match this pattern: observed issues include unexpected
  digit counts and a repeated country-code representation, `(34)+34…`.
- Each of the 745 distinct NIFs has exactly one distinct `telefono_1`
  value across its records.

#### `telefono_2`

- Contains 171 distinct values, including `_U`.
- `_U` occurs in 625 records; 185 records contain another value.
- Of those 185 values, 183 match the same telephone pattern and 2 do not.
- Among the 172 NIFs with a second telephone other than `_U`, each has
  exactly one distinct second telephone across its records.

#### Relationships and integration considerations

- In 20 records, `telefono_1` and `telefono_2` contain the same value;
  the second field therefore does not always provide an additional number.
- Pattern matching confirms formatting only, not telephone validity
  or reachability.
- Telephone numbers have not been established as unique organisation
  identifiers.
- Preserve source values and flag format anomalies for later review.
- Rules for representing both fields in `Entidad.contacto` will be
  defined during integration.
- These findings apply to the analysed dataset.

### Campos de teléfono — conclusiones

- `telefono_1` y `telefono_2` son campos de texto y deben conservarse como tales.
- Ambos contienen 810 valores no nulos, sin cadenas vacías ni espacios
  al principio o al final.

#### `telefono_1`

- Contiene 728 valores distintos y ningún marcador `_U`.
- 803 valores cumplen el patrón `(34)` seguido de exactamente 9 dígitos.
- 7 valores no cumplen el patrón: se observaron cantidades inesperadas
  de dígitos y una representación repetida del prefijo internacional,
  `(34)+34…`.
- Cada uno de los 745 NIF distintos tiene un único valor distinto
  de `telefono_1` en sus registros.

#### `telefono_2`

- Contiene 171 valores distintos, incluido `_U`.
- `_U` aparece en 625 registros; 185 registros contienen otro valor.
- De esos 185 valores, 183 cumplen el mismo patrón telefónico y 2 no.
- Entre los 172 NIF con un segundo teléfono diferente de `_U`, cada uno
  tiene un único segundo teléfono distinto en sus registros.

#### Relaciones y consideraciones para la integración

- En 20 registros, `telefono_1` y `telefono_2` contienen el mismo valor;
  el segundo campo no siempre aporta un número adicional.
- El cumplimiento del patrón confirma únicamente el formato, no la validez
  ni la disponibilidad del teléfono.
- No se ha establecido que los teléfonos identifiquen organizaciones
  de forma única.
- Deben conservarse los valores originales y señalarse las anomalías
  de formato para su revisión posterior.
- Las reglas para representar ambos campos en `Entidad.contacto`
  se definirán durante la integración.
- Estos resultados se refieren al conjunto de datos analizado.

### `pagina_web` — conclusions

- String field with 810 non-null values and 173 distinct values, including `_U`.
- `_U` occurs in 619 records. The remaining 191 records contain 172 distinct
  values other than `_U`.
- No blank strings or leading/trailing whitespace were detected.
- Six records contain internal whitespace: two address-like values and
  four records containing textual descriptions.
- The field mixes addresses with and without HTTP/HTTPS schemes, social media
  links, textual descriptions, and an email address.
- Observed issues include spaces after `www.`, the misspelled scheme `hhtps://`,
  and descriptions such as “en migración a nuevo dominio”.
- Some domain-like values appear suspicious, but corrections have not
  been verified. Accented characters alone do not establish an error.
- Among the 172 NIFs with a value other than `_U`, each corresponds
  to exactly one distinct `pagina_web` value.
- Website syntax and availability have not been comprehensively validated.
- Mapping to `Entidad.url` requires distinguishing addresses from other
  content and defining cleaning rules. Preserve original values for reference.
- These findings apply to the analysed dataset.

### `pagina_web` — conclusiones

- Campo de texto con 810 valores no nulos y 173 valores distintos, incluido `_U`.
- `_U` aparece en 619 registros. Los 191 registros restantes contienen
  172 valores distintos diferentes de `_U`.
- No se detectaron cadenas vacías ni espacios al principio o al final.
- Seis registros contienen espacios internos: dos valores con apariencia
  de dirección web y cuatro registros con descripciones textuales.
- El campo mezcla direcciones con y sin protocolo HTTP/HTTPS, enlaces
  a redes sociales, descripciones textuales y una dirección de correo electrónico.
- Se observaron espacios después de `www.`, el protocolo mal escrito `hhtps://`
  y descripciones como “en migración a nuevo dominio”.
- Algunos valores con apariencia de dominio resultan sospechosos, pero
  las correcciones no se han verificado. Los caracteres acentuados
  no demuestran por sí solos un error.
- Entre los 172 NIF con un valor diferente de `_U`, cada uno corresponde
  a un único valor distinto de `pagina_web`.
- No se han validado exhaustivamente la sintaxis ni la disponibilidad
  de los sitios.
- La asociación con `Entidad.url` requiere distinguir las direcciones
  de otros contenidos y definir reglas de limpieza. Deben conservarse
  los valores originales como referencia.
- Estos resultados se refieren al conjunto de datos analizado.

### `area_id` and `area_nombre` — conclusions

- `area_id` is stored as `int64` and represents a category code.
  `area_nombre` is a string field describing the activity category.
- There are 9 distinct codes and 9 distinct names.
- No null values were detected in either field. No `_U` placeholders,
  blank strings, or leading/trailing whitespace were detected in `area_nombre`.
- In this dataset, `area_id` and `area_nombre` have a one-to-one relationship:
  each code corresponds to exactly one name and vice versa.

#### Relationship with organisations

- Of the 745 distinct NIFs:
  - 729 have one activity category;
  - 14 have two;
  - 1 has three;
  - 1 has five.
- Therefore, 16 organisations have multiple activity categories.
- The observed relationship between `nif` and activity category is many-to-many:
  an organisation may have multiple categories, and a category may apply
  to multiple organisations.

#### Implications for later integration

- `area_nombre` is a candidate source for `Entidad.ambito`, but source
  categories require explicit mapping to the global `Ambito` enumeration.
- Categories such as `Varios` do not provide an unambiguous global category.
- If `Entidad.ambito` accepts only one value, an integration rule or schema
  adjustment is needed to preserve multiple activity categories.
- Preserve all observed categories until mapping rules are defined.
- These findings apply to the analysed dataset.

### `area_id` y `area_nombre` — conclusiones

- `area_id` está almacenado como `int64` y representa un código de categoría.
  `area_nombre` es un campo de texto que describe el área de actividad.
- Hay 9 códigos distintos y 9 denominaciones distintas.
- No se detectaron valores nulos en ninguno de los campos. En `area_nombre`
  tampoco se detectaron marcadores `_U`, cadenas vacías ni espacios
  al principio o al final.
- En este conjunto de datos, `area_id` y `area_nombre` tienen una relación
  de uno a uno: cada código corresponde a un único nombre y viceversa.

#### Relación con las organizaciones

- De los 745 NIF distintos:
  - 729 tienen un área de actividad;
  - 14 tienen dos;
  - 1 tiene tres;
  - 1 tiene cinco.
- Por tanto, 16 organizaciones tienen varias áreas de actividad.
- La relación observada entre `nif` y área de actividad es de varios a varios:
  una organización puede tener varias áreas y una misma área puede corresponder
  a varias organizaciones.

#### Implicaciones para la integración posterior

- `area_nombre` es un campo candidato para `Entidad.ambito`, pero las categorías
  de origen requieren una correspondencia explícita con la enumeración
  global `Ambito`.
- Categorías como `Varios` no permiten determinar una categoría global
  de forma inequívoca.
- Si `Entidad.ambito` admite un único valor, será necesaria una regla
  de integración o una adaptación del esquema para conservar varias áreas.
- Deben conservarse todas las categorías observadas hasta definir
  las reglas de correspondencia.
- Estos resultados se refieren al conjunto de datos analizado.

### `subarea_id` and `subarea_nombre` — conclusions

- Both fields contain 810 non-null string values.
- No blank strings or leading/trailing whitespace were detected.
- Each field has 17 distinct values: 16 subarea codes/names and `_U`.
- The marker pair `_U → _U` occurs in 394 records. Its exact meaning
  (unknown, unspecified, or not applicable) remains unconfirmed.
- In this dataset, `subarea_id` and `subarea_nombre` have a one-to-one
  relationship, including the marker pair.

#### Relationship with activity areas

- Subarea codes `1`–`7` occur only within `area_id = 9` (`Voluntariado`).
- Subarea codes `A`–`I` occur only within `area_id = 8` (`Varios`).
- Each known subarea code belongs to exactly one activity area in this dataset.
- `_U` occurs in all nine activity areas and must not be treated as a subarea.

#### Relationship with organisations

After excluding `_U`, grouping by `nif` and `area_id` shows:

- 341 organisation–area groups have one distinct subarea;
- 29 have two;
- 3 have three;
- 1 has six.

Therefore, 33 organisation–area groups have multiple subareas.
These counts describe groups, not necessarily distinct organisations.
Rows sharing a NIF and activity area may contain different subarea information
and should not be removed solely on that basis.

#### Implications for later integration

- Subareas provide additional detail that may help map broad categories
  such as `Varios` to the global `Ambito` enumeration.
- Preserve all known subareas until mapping rules are defined.
- These findings apply to the analysed dataset.

### `subarea_id` y `subarea_nombre` — conclusiones

- Ambos campos contienen 810 valores de texto no nulos.
- No se detectaron cadenas vacías ni espacios al principio o al final.
- Cada campo tiene 17 valores distintos: 16 códigos/nombres de subáreas y `_U`.
- La pareja de marcadores `_U → _U` aparece en 394 registros. Su significado
  exacto (desconocido, no especificado o no aplicable) no está confirmado.
- En este conjunto de datos, `subarea_id` y `subarea_nombre` tienen una relación
  de uno a uno, incluida la pareja de marcadores.

#### Relación con las áreas de actividad

- Los códigos de subárea `1`–`7` aparecen únicamente en `area_id = 9`
  (`Voluntariado`).
- Los códigos `A`–`I` aparecen únicamente en `area_id = 8` (`Varios`).
- Cada código de subárea conocido pertenece a una única área de actividad
  en este conjunto de datos.
- `_U` aparece en las nueve áreas y no debe interpretarse como una subárea.

#### Relación con las organizaciones

Tras excluir `_U`, la agrupación por `nif` y `area_id` muestra:

- 341 grupos organización–área tienen una subárea distinta;
- 29 tienen dos;
- 3 tienen tres;
- 1 tiene seis.

Por tanto, 33 grupos organización–área tienen varias subáreas.
Estas cifras describen grupos, no necesariamente organizaciones distintas.
Las filas que comparten NIF y área pueden aportar diferentes subáreas
y no deben eliminarse únicamente por compartir esos campos.

#### Implicaciones para la integración posterior

- Las subáreas aportan detalles que pueden ayudar a asociar categorías
  generales como `Varios` con la enumeración global `Ambito`.
- Deben conservarse todas las subáreas conocidas hasta definir
  las reglas de correspondencia.
- Estos resultados se refieren al conjunto de datos analizado.




===== notebooks\entidades_CV.ipynb =====

## Initial schema observations

- The dataset contains 1697 rows and 21 columns.
- `id` has 1697 unique, non-null values, so it is a strong candidate key.
- Missing values were found in:
  - `ni_centro`: 32
  - `max`: 32
  - `domici`: 8
  - `pobtotal`: 32
  - `email`: 166
  - `telefono`: 9
  - `f_resolu`: 123
- `ni_centro`, `max`, and `pobtotal` are stored by pandas as `float64`, but all non-null values are integers.
  - Probable logical type: nullable INTEGER.
- `provincia` has no missing values and only 3 distinct values:
  - València/Valencia: 884
  - Alacant/Alicante: 489
  - Castelló/Castellón: 324
- `provincia` therefore behaves like a categorical field.

### Categorical fields

- `sector` contains 7 distinct categories.
- `clasificacion` contains 6 distinct categories.
- `leyenda` contains 9 distinct categories.
- `tipo_centro` contains 64 distinct categories.

The values returned by `value_counts()` are integer frequencies, while the original column values remain strings.

`SIN RESOLUCIÓN` and `SIN INFORMAR` are not null values; they are explicit text values that may represent semantically missing information.

`sector` and `clasificacion` appear to describe related concepts, but they are not identical and should be analyzed separately.

### Campos categóricos

- `sector` contiene 7 categorías distintas.
- `clasificacion` contiene 6 categorías distintas.
- `leyenda` contiene 9 categorías distintas.
- `tipo_centro` contiene 64 categorías distintas.

Los valores devueltos por `value_counts()` son frecuencias enteras, mientras que los valores originales de las columnas siguen siendo cadenas de texto.

`SIN RESOLUCIÓN` y `SIN INFORMAR` no son valores nulos; son valores de texto explícitos que pueden representar información ausente desde el punto de vista semántico.

`sector` y `clasificacion` parecen describir conceptos relacionados, pero no son idénticos y deben analizarse por separado.

### Relationship between `sector` and `clasificacion`

The cross-tabulation shows that `sector` and `clasificacion` are strongly related but are not identical fields.

For most records, the values are the same. The differences occur when `clasificacion` contains `SIN RESOLUCIÓN`, while `sector` still contains a specific target group.

This suggests that `sector` represents the target sector/group, whereas `clasificacion` may represent a classification status that has not yet been resolved for some records.

### Relación entre `sector` y `clasificacion`

La tabla cruzada muestra que `sector` y `clasificacion` están fuertemente relacionados, pero no son campos idénticos.

En la mayoría de los registros los valores coinciden. Las diferencias aparecen cuando `clasificacion` contiene `SIN RESOLUCIÓN`, mientras que `sector` sigue indicando un grupo objetivo específico.

Esto sugiere que `sector` representa el sector o colectivo destinatario, mientras que `clasificacion` puede representar una clasificación que todavía no se ha resuelto en algunos registros.

### `f_resolu` — date/time analysis

- The dataset contains 1697 records.
- `f_resolu` has 1574 non-null values and 123 missing values.
- All 1574 non-null values can be successfully parsed as date/time values.
- No malformed non-null date/time values were detected.
- 1562 values contain the time `00:00:00`.
- 12 values contain a non-zero time component.
- The observed date/time range is from `1977-12-31 00:00:00` to `2026-08-04 13:44:52`.
- All 12 records with a non-zero time are recent records from 2026, with IDs approximately between 1654 and 1666.
- Their times vary, but all observed values have `52` seconds.
- This may indicate that newer records are stored with a real timestamp, while older records were stored only with a date and represented as midnight.
- In the source file the field is stored as `str`, but its logical type is most likely `DATETIME` / `TIMESTAMP`.
- The business meaning of the time component should be verified before converting the field to a pure `DATE`.

### `f_resolu` — análisis de fecha y hora

- El conjunto de datos contiene 1697 registros.
- `f_resolu` tiene 1574 valores no nulos y 123 valores ausentes.
- Los 1574 valores no nulos pueden convertirse correctamente a valores de fecha y hora.
- No se detectaron valores de fecha/hora incorrectos entre los valores existentes.
- 1562 valores contienen la hora `00:00:00`.
- 12 valores contienen una hora distinta de cero.
- El intervalo observado va desde `1977-12-31 00:00:00` hasta `2026-08-04 13:44:52`.
- Los 12 registros con una hora distinta de cero son registros recientes de 2026, con identificadores aproximadamente entre 1654 y 1666.
- Las horas son diferentes, pero todos los valores observados tienen `52` segundos.
- Esto puede indicar que los registros más recientes se almacenan con una marca temporal completa, mientras que los registros antiguos se almacenaban únicamente con la fecha y se representaban con la hora `00:00:00`.
- En el archivo de origen el campo está almacenado como `str`, pero su tipo lógico más probable es `DATETIME` / `TIMESTAMP`.
- Antes de convertir el campo a un simple `DATE`, debería comprobarse el significado de negocio de la parte horaria.

### `telefono` — format and data quality analysis

- The field is stored as `str`, which is appropriate because telephone numbers are identifiers rather than numeric values used in calculations.
- There are 1688 non-null values and 9 missing values.
- Most values (1604 records) contain exactly 9 characters.
- 68 records contain the explicit value `"0"`. This is not a null value technically, but it most likely represents a missing or unknown telephone number.
- Several records use formatting characters such as spaces, hyphens, and semicolons.
- Three values with spaces become valid 9-digit strings after removing non-digit characters.
- Some records appear to contain two telephone numbers in a single field, for example:
  - `964360002; 964367054`
  - `961366865 676422994`
- Other anomalous values contain 10, 8, or 3 digits after normalization.
- Therefore, the logical type of the field is `STRING`, but the source contains both formatting inconsistencies and semantically missing values.

#### Possible normalization rules for integration

A later transformation step could use regular expressions to:

1. remove spaces and other formatting characters;
2. convert `"0"` to a null value;
3. detect multiple telephone numbers stored in the same field;
4. split multiple telephone numbers when necessary;
5. validate normalized telephone numbers against the expected length;
6. flag values whose normalized length is not 9 digits.

If the global schema supports only one telephone number, a documented rule such as selecting the first number could be applied. If multiple telephone numbers are supported, they should preferably be preserved rather than discarded.

### `telefono` — análisis del formato y de la calidad de los datos

- El campo está almacenado como `str`, lo cual es adecuado porque los números de teléfono son identificadores y no valores numéricos utilizados para cálculos.
- Hay 1688 valores no nulos y 9 valores ausentes.
- La mayoría de los valores (1604 registros) contienen exactamente 9 caracteres.
- 68 registros contienen el valor explícito `"0"`. Técnicamente no es un valor nulo, pero probablemente representa un número de teléfono ausente o desconocido.
- Algunos registros utilizan caracteres de formato como espacios, guiones y punto y coma.
- Tres valores con espacios se convierten en cadenas válidas de 9 dígitos después de eliminar los caracteres no numéricos.
- Algunos registros parecen contener dos números de teléfono en un mismo campo, por ejemplo:
  - `964360002; 964367054`
  - `961366865 676422994`
- Otros valores anómalos contienen 10, 8 o 3 dígitos después de la normalización.
- Por tanto, el tipo lógico del campo es `STRING`, pero el origen contiene tanto inconsistencias de formato como valores semánticamente ausentes.

#### Posibles reglas de normalización para la integración

En una etapa posterior de transformación se podrían utilizar expresiones regulares para:

1. eliminar espacios y otros caracteres de formato;
2. convertir `"0"` en un valor nulo;
3. detectar varios números de teléfono almacenados en un mismo campo;
4. separar varios números cuando sea necesario;
5. validar los teléfonos normalizados según la longitud esperada;
6. marcar como anomalías los valores cuya longitud normalizada no sea de 9 dígitos.

Si el esquema global solo admite un número de teléfono, se podría aplicar una regla documentada, por ejemplo seleccionar el primer número. Si el esquema permite varios teléfonos, sería preferible conservarlos en lugar de descartar información.

### `email` — profile and data quality analysis

- Source dtype: `object` (string data).
- The field contains 1531 non-null values and 166 null values.
- There are 873 distinct non-null values.
- `zero@gva.es` occurs 413 times and is likely a technical placeholder rather than a real contact address.
- Some email addresses use different letter case; case normalization may therefore be useful during integration.
- 3 values contain leading or trailing whitespace.
- 17 non-null values do not match the basic `name@domain.tld` email pattern.
- Observed anomalies include:
  - whitespace inside or around an address;
  - missing `@`;
  - incomplete domains;
  - incorrect punctuation;
  - multiple email addresses stored in one field.
- Logical type: `STRING`.
- Nullable: `YES`.

#### Possible integration transformations

- trim leading/trailing whitespace;
- normalize case;
- convert known placeholder values such as `zero@gva.es` to `NULL` if confirmed semantically;
- validate email syntax;
- detect and split multiple email addresses where appropriate;
- flag malformed addresses for review.

### `email` — perfil y análisis de calidad de datos

- Tipo de origen: `object` (datos de texto).
- El campo contiene 1531 valores no nulos y 166 valores nulos.
- Hay 873 valores distintos no nulos.
- `zero@gva.es` aparece 413 veces y probablemente es un valor técnico de sustitución y no una dirección de contacto real.
- Algunas direcciones utilizan mayúsculas y minúsculas de forma diferente; por tanto, puede ser útil normalizar el uso de mayúsculas/minúsculas durante la integración.
- 3 valores contienen espacios al principio o al final.
- 17 valores no nulos no cumplen el patrón básico `nombre@dominio.tld`.
- Entre las anomalías observadas se encuentran:
  - espacios dentro o alrededor de la dirección;
  - ausencia de `@`;
  - dominios incompletos;
  - signos de puntuación incorrectos;
  - varias direcciones de correo almacenadas en un mismo campo.
- Tipo lógico: `STRING`.
- Admite valores nulos: `SÍ`.

#### Posibles transformaciones para la integración

- eliminar espacios iniciales y finales;
- normalizar mayúsculas/minúsculas;
- convertir valores de sustitución conocidos como `zero@gva.es` a `NULL` si se confirma su significado;
- validar la sintaxis del correo electrónico;
- detectar y separar varias direcciones cuando sea necesario;
- marcar las direcciones incorrectas para su revisión.

### `cod_ine_mun` — municipal identifier analysis

- Source dtype: `int64`.
- The field contains 1697 non-null values and no missing values.
- There are 333 distinct codes.
- Although pandas stores the field as an integer, it represents an identifier rather than a measurable numeric value.
- 489 values contain 4 digits and 1208 values contain 5 digits.
- The 4-digit values are consistent with 5-digit INE municipal codes whose leading zero was lost when the CSV was interpreted as numeric data.
- Padding the values to 5 characters with leading zeros restores the expected representation.
- The first two digits correspond consistently to the province:
  - `03` → Alacant/Alicante
  - `12` → Castelló/Castellón
  - `46` → València/Valencia
- All 333 distinct municipal codes are associated with exactly one distinct `municipio`.
- Probable logical type: `STRING` / `CHAR(5)`, not `INTEGER`.
- Nullable: `NO`.

#### Possible integration transformation

Convert the source value to a 5-character string and restore leading zeros using zero-padding before mapping it to the global schema.

### `cod_ine_mun` — análisis del identificador municipal

- Tipo de origen: `int64`.
- El campo contiene 1697 valores no nulos y no tiene valores ausentes.
- Hay 333 códigos distintos.
- Aunque pandas almacena el campo como entero, representa un identificador y no una magnitud numérica.
- 489 valores contienen 4 dígitos y 1208 valores contienen 5 dígitos.
- Los valores de 4 dígitos son compatibles con códigos municipales INE de 5 dígitos cuyo cero inicial se perdió al interpretar el CSV como datos numéricos.
- Al completar los valores hasta 5 caracteres con ceros a la izquierda se recupera la representación esperada.
- Los dos primeros dígitos corresponden de forma consistente a la provincia:
  - `03` → Alacant/Alicante
  - `12` → Castelló/Castellón
  - `46` → València/Valencia
- Los 333 códigos municipales distintos están asociados exactamente con un único `municipio`.
- Tipo lógico probable: `STRING` / `CHAR(5)`, no `INTEGER`.
- Admite valores nulos: `NO`.

#### Posible transformación para la integración

Convertir el valor de origen en una cadena de 5 caracteres y restaurar los ceros iniciales antes de mapearlo al esquema global.

### `municipio` — municipality name analysis

- Source dtype: `object` (string data).
- The field contains 1697 non-null values and no missing values.
- There are 333 distinct municipality names.
- Municipality names are repeated because multiple entities may belong to the same municipality.
- No leading or trailing whitespace was detected.
- Each of the 333 distinct `municipio` values corresponds to exactly one `cod_ine_mun`.
- Conversely, each `cod_ine_mun` corresponds to exactly one `municipio`.
- Therefore, the observed relationship between `municipio` and `cod_ine_mun` is one-to-one.
- The five shortest distinct municipality names are:
  - `Ibi` — 3 characters
  - `Cox` — 3
  - `Sax` — 3
  - `Barx` — 4
  - `Xert` — 4
- The five longest distinct municipality names are:
  - `Sant Vicent del Raspeig/San Vicente del Raspeig` — 47 characters
  - `les Alqueries/Alquerías del Niño Perdido` — 40
  - `la Torre de les Maçanes/Torremanzanas` — 37
  - `el Camp de Mirra/Campo de Mirra` — 31
  - `Vilafranca/Villafranca del Cid` — 30
- Long bilingual names appear to be legitimate data rather than formatting anomalies.
- Logical type: `STRING`.
- Nullable: `NO`.

### `municipio` — análisis del nombre del municipio

- Tipo de origen: `object` (datos de texto).
- El campo contiene 1697 valores no nulos y no tiene valores ausentes.
- Hay 333 nombres de municipios distintos.
- Los nombres se repiten porque varias entidades pueden pertenecer al mismo municipio.
- No se detectaron espacios iniciales ni finales.
- Cada uno de los 333 valores distintos de `municipio` corresponde exactamente a un `cod_ine_mun`.
- A su vez, cada `cod_ine_mun` corresponde exactamente a un `municipio`.
- Por tanto, en los datos observados existe una relación uno-a-uno entre `municipio` y `cod_ine_mun`.
- Los cinco nombres distintos más cortos son:
  - `Ibi` — 3 caracteres
  - `Cox` — 3
  - `Sax` — 3
  - `Barx` — 4
  - `Xert` — 4
- Los cinco nombres distintos más largos son:
  - `Sant Vicent del Raspeig/San Vicente del Raspeig` — 47 caracteres
  - `les Alqueries/Alquerías del Niño Perdido` — 40
  - `la Torre de les Maçanes/Torremanzanas` — 37
  - `el Camp de Mirra/Campo de Mirra` — 31
  - `Vilafranca/Villafranca del Cid` — 30
- Los nombres bilingües largos parecen ser datos legítimos y no anomalías de formato.
- Tipo lógico: `STRING`.
- Admite valores nulos: `NO`.

### `comarca` — regional classification analysis

- Source dtype: `object` (string data).
- The field contains 1697 non-null values and no missing values.
- There are 33 distinct comarca values.
- The field behaves as a categorical geographic attribute.
- No leading or trailing whitespace was detected.
- Each `municipio` is associated with exactly one `comarca` in the observed dataset.
- Each `comarca` is associated with exactly one `provincia`.
- The observed geographic hierarchy is therefore internally consistent:

  `provincia → comarca → municipio`

- No integrity anomalies were detected in these relationships.
- Logical type: `STRING` / categorical.
- Nullable: `NO`.

### `comarca` — análisis de la clasificación territorial

- Tipo de origen: `object` (datos de texto).
- El campo contiene 1697 valores no nulos y no tiene valores ausentes.
- Hay 33 valores distintos de `comarca`.
- El campo funciona como un atributo geográfico categórico.
- No se detectaron espacios iniciales ni finales.
- Cada `municipio` está asociado exactamente con una `comarca` en el conjunto de datos observado.
- Cada `comarca` está asociada exactamente con una `provincia`.
- Por tanto, la jerarquía geográfica observada es internamente consistente:

  `provincia → comarca → municipio`

- No se detectaron anomalías de integridad en estas relaciones.
- Tipo lógico: `STRING` / categórico.
- Admite valores nulos: `NO`.

### `domici` — address field analysis

- Source dtype: `object` (string data).
- The field contains 1689 non-null values and 8 missing values.
- There are 1576 distinct non-null addresses.
- Repeated addresses are not necessarily anomalies, because several entities may be located at the same address.
- No leading or trailing whitespace was detected among non-null values.
- No non-null values become empty strings after trimming whitespace.
- Address length ranges from 6 to 84 characters.
- The longest values are detailed multi-part addresses and appear structurally plausible.
- The shortest values include highly abbreviated entries such as `PUERTO`, `ALTA, 7`, `PLAZA 9`, `BASCULA`, and `BARRACA`.
- These short values may represent valid abbreviated addresses, but they could also indicate incomplete address information and may require external validation.
- The field contains heterogeneous free-text address formats, including abbreviations such as `C/`, `AVDA.`, `PZA.`, street names, building numbers, and additional location details.
- Logical type: `STRING`.
- Nullable: `YES`.

#### Possible integration considerations

- preserve the original address text;
- trim whitespace during normalization;
- optionally standardize common street-type abbreviations;
- flag unusually short or otherwise suspicious address values for review if stricter address quality is required.

### `domici` — análisis del campo de dirección

- Tipo de origen: `object` (datos de texto).
- El campo contiene 1689 valores no nulos y 8 valores ausentes.
- Hay 1576 direcciones distintas no nulas.
- Las direcciones repetidas no son necesariamente anomalías, ya que varias entidades pueden estar ubicadas en la misma dirección.
- No se detectaron espacios iniciales ni finales entre los valores no nulos.
- Ningún valor no nulo se convierte en una cadena vacía después de eliminar los espacios.
- La longitud de las direcciones varía entre 6 y 84 caracteres.
- Los valores más largos son direcciones detalladas con varias partes y parecen estructuralmente plausibles.
- Entre los valores más cortos aparecen entradas muy abreviadas como `PUERTO`, `ALTA, 7`, `PLAZA 9`, `BASCULA` y `BARRACA`.
- Estos valores cortos pueden representar direcciones abreviadas válidas, aunque también podrían indicar información de dirección incompleta y requerir validación externa.
- El campo contiene formatos heterogéneos de dirección en texto libre, incluyendo abreviaturas como `C/`, `AVDA.`, `PZA.`, nombres de calles, números y otros detalles de localización.
- Tipo lógico: `STRING`.
- Admite valores nulos: `SÍ`.

#### Posibles consideraciones para la integración

- conservar el texto original de la dirección;
- eliminar espacios iniciales y finales durante la normalización;
- opcionalmente normalizar abreviaturas habituales de tipos de vía;
- marcar valores excepcionalmente cortos o sospechosos para su revisión si se requiere una mayor calidad de las direcciones.

### `nombre` — conclusion

- The field is complete: all 1697 records contain a value.
- There are 1660 distinct names.
- 27 names occur more than once, affecting 64 records.
- Repeated names do not necessarily represent duplicate records. In several cases, the same centre appears in different records because other attributes, such as classification, sector or centre type, differ.
- No completely duplicated rows were found when the `id` field was excluded.
- The field is suitable for the global attribute `Entidad.nombre`.
- It should not be used as a unique identifier because the same name may appear in multiple records.

### `nombre` — conclusión

- El campo está completo: los 1697 registros contienen un valor.
- Hay 1660 nombres distintos.
- 27 nombres aparecen más de una vez, afectando a 64 registros.
- Los nombres repetidos no representan necesariamente registros duplicados. En varios casos, el mismo centro aparece en diferentes registros porque cambian otros atributos, como la clasificación, el sector o el tipo de centro.
- No se encontraron filas completamente duplicadas al excluir el campo `id`.
- El campo es adecuado para el atributo global `Entidad.nombre`.
- No debe utilizarse como identificador único, ya que un mismo nombre puede aparecer en varios registros.

### `max` — conclusion

- The field is stored as `float64`.
- It contains 1665 non-null values and 32 missing values.
- All non-null values are mathematically integers, so a nullable integer type would better represent the data.
- The field contains 147 distinct values.
- Values range from 0 to 356, with a median of 20.
- 395 records contain the value `0`.
- The 32 missing values occur in exactly the same records where `ni_centro` and `pobtotal` are also missing.
- All records with a missing `max` value have `clasificacion = "SIN RESOLUCIÓN"`.
- The values suggest that the field may represent a maximum capacity or number of places, but the meaning cannot be confirmed from the column name and data alone.
- Therefore, the field should not yet be mapped to the global schema unless its semantic meaning is confirmed.

### `max` — conclusión

- El campo está almacenado como `float64`.
- Contiene 1665 valores no nulos y 32 valores ausentes.
- Todos los valores no nulos son matemáticamente enteros, por lo que un tipo entero anulable representaría mejor los datos.
- El campo contiene 147 valores distintos.
- Los valores van de 0 a 356, con una mediana de 20.
- 395 registros contienen el valor `0`.
- Los 32 valores ausentes aparecen exactamente en los mismos registros en los que también faltan `ni_centro` y `pobtotal`.
- Todos los registros con `max` ausente tienen `clasificacion = "SIN RESOLUCIÓN"`.
- Los valores sugieren que el campo podría representar una capacidad máxima o un número de plazas, pero su significado no puede confirmarse únicamente a partir del nombre de la columna y de los datos.
- Por tanto, el campo todavía no debe asociarse con la estructura global hasta confirmar su significado semántico.

### `entidad` — conclusion

- The field represents the organisation or institution associated with the centre, rather than the centre itself.
- A single `entidad` can be associated with many different centres (`nombre`).
- For example, `GENERALITAT VALENCIANA` appears in 141 records and is associated with 134 distinct centre names.
- In the opposite direction, almost every centre name is associated with only one `entidad`.
- Only two centre names are associated with more than one entity: `CENTRE INTEGRAL DE MAJORS` and `CLUB DE CONVIVENCIA MUNICIPAL`.
- Inspection of these cases shows that they correspond to different centres with different `ni_centro`, municipalities and addresses. Therefore, the repeated names do not indicate that one centre belongs to multiple entities.
- The field is therefore useful for identifying the organisation responsible for or associated with a centre.
- It should not be confused with `nombre`, which identifies the centre itself.
- Its mapping to the global schema depends on whether the global model includes the organisation responsible for the centre as a separate concept.

### `entidad` — conclusión

- El campo representa la organización o institución asociada al centro, y no el propio centro.
- Una misma `entidad` puede estar asociada a muchos centros diferentes (`nombre`).
- Por ejemplo, `GENERALITAT VALENCIANA` aparece en 141 registros y está asociada a 134 nombres de centro distintos.
- En la dirección inversa, casi todos los nombres de centro están asociados a una sola `entidad`.
- Solo dos nombres aparecen asociados a más de una entidad: `CENTRE INTEGRAL DE MAJORS` y `CLUB DE CONVIVENCIA MUNICIPAL`.
- La inspección de estos casos muestra que corresponden a centros diferentes, con distintos `ni_centro`, municipios y direcciones. Por tanto, los nombres repetidos no indican que un mismo centro pertenezca a varias entidades.
- El campo es útil para identificar la organización responsable o asociada al centro.
- No debe confundirse con `nombre`, que identifica al propio centro.
- Su correspondencia con la estructura global depende de si el modelo global contempla por separado la organización responsable del centro.

### `leyenda` — conclusion

- The field is categorical and contains 9 distinct values.
- Most organisations have a single `leyenda` value: 704 entities have one category.
- 21 entities are associated with two different `leyenda` values.
- The combinations show that the field mixes categories at different levels of specificity, for example:
  - `Entidad Privada` / `EMPRESA Y SOCIEDADES`
  - `Entidad Privada` / `FUNDACION`
  - `Entidad Privada` / `COOPERATIVA`
  - `Entidad Local` / `ENTIDAD PÚBLICA`
  - `Entidad Propia` / `ENTIDAD PÚBLICA`
- Therefore, `leyenda` should not be interpreted as a strict or unique type of organisation.
- It appears to represent a source-specific administrative or legal classification of the entity.
- The field has no direct equivalent in the current global schema, so it should not be mapped unless a specific attribute for ownership, legal nature or entity type is added.

### `leyenda` — conclusión

- El campo es categórico y contiene 9 valores distintos.
- La mayoría de las organizaciones tienen un único valor de `leyenda`: 704 entidades tienen una sola categoría.
- 21 entidades están asociadas a dos valores diferentes de `leyenda`.
- Las combinaciones muestran que el campo mezcla categorías con distintos niveles de especificidad, por ejemplo:
  - `Entidad Privada` / `EMPRESA Y SOCIEDADES`
  - `Entidad Privada` / `FUNDACION`
  - `Entidad Privada` / `COOPERATIVA`
  - `Entidad Local` / `ENTIDAD PÚBLICA`
  - `Entidad Propia` / `ENTIDAD PÚBLICA`
- Por tanto, `leyenda` no debe interpretarse como un tipo de organización único y estricto.
- Parece representar una clasificación administrativa o jurídica específica de la fuente.
- El campo no tiene una correspondencia directa con la estructura global actual, por lo que no debería mapearse salvo que se añada un atributo específico para titularidad, naturaleza jurídica o tipo de entidad.

### `provincia` — conclusion

- The field contains three distinct provinces: `Alacant/Alicante`, `Castelló/Castellón` and `València/Valencia`.
- All 1697 records have a province value.
- The province is fully consistent with the first two digits of `cod_ine_mun`:
  - `03` → `Alacant/Alicante`
  - `12` → `Castelló/Castellón`
  - `46` → `València/Valencia`
- The relationship with `comarca` is also consistent: all 33 comarcas are associated with exactly one province.
- No geographical inconsistencies were detected between `provincia`, `comarca` and `cod_ine_mun`.
- The field can be mapped directly to `Provincia.nombre` in the global schema.
- `Provincia.codigo` can be derived from the first two digits of `cod_ine_mun`.
- Province names are stored in bilingual Valencian/Spanish form, which should be taken into account during normalization.

### `provincia` — conclusión

- El campo contiene tres provincias distintas: `Alacant/Alicante`, `Castelló/Castellón` y `València/Valencia`.
- Los 1697 registros contienen un valor de provincia.
- La provincia es totalmente coherente con los dos primeros dígitos de `cod_ine_mun`:
  - `03` → `Alacant/Alicante`
  - `12` → `Castelló/Castellón`
  - `46` → `València/Valencia`
- La relación con `comarca` también es coherente: las 33 comarcas están asociadas a una única provincia.
- No se detectaron inconsistencias geográficas entre `provincia`, `comarca` y `cod_ine_mun`.
- El campo puede asociarse directamente con `Provincia.nombre` en la estructura global.
- `Provincia.codigo` puede obtenerse a partir de los dos primeros dígitos de `cod_ine_mun`.
- Los nombres de provincia están almacenados en formato bilingüe valenciano/castellano, lo que debe tenerse en cuenta durante la normalización.

### `sector` — conclusion

- The field represents the target population or social-service area of the centre.
- It is a strong candidate for mapping to `Entidad.ambito` in the global schema.
- Most centres are associated with a single sector.
- However, 12 centres are associated with more than one sector: 10 centres have two sectors and 2 centres have three.
- Inspection of these cases shows that this is meaningful information rather than duplicated data: the same centre can provide services to different target groups.
- Therefore, the relationship between `ni_centro` and `sector` is not strictly one-to-one.
- This must be taken into account when mapping `sector` to the global `ambito` attribute, since one centre may require several `ambito` values.

### `sector` — conclusión

- El campo representa la población destinataria o el ámbito de actuación social del centro.
- Es un candidato claro para corresponder con `Entidad.ambito` en la estructura global.
- La mayoría de los centros están asociados a un único sector.
- Sin embargo, 12 centros están asociados a más de un sector: 10 centros tienen dos sectores y 2 centros tienen tres.
- La inspección de estos casos muestra que no se trata de datos duplicados, sino de información significativa: un mismo centro puede prestar servicios a diferentes grupos de población.
- Por tanto, la relación entre `ni_centro` y `sector` no es estrictamente uno-a-uno.
- Esto debe tenerse en cuenta al asociar `sector` con el atributo global `ambito`, ya que un mismo centro puede necesitar varios valores de `ambito`.

### `clasificacion` — conclusion

- The field is almost entirely redundant with `sector`.
- In 1665 of the 1697 records, `clasificacion` and `sector` contain exactly the same value.
- The remaining 32 records have `clasificacion = "SIN RESOLUCIÓN"`, while `sector` still contains a valid target-group category.
- Therefore, `clasificacion` does not provide an additional thematic classification for most records.
- Its main additional information is the special value `SIN RESOLUCIÓN`, which appears to indicate that the classification has not been formally resolved.
- For mapping to the global `Entidad.ambito` attribute, `sector` is more appropriate because it remains informative for all records.
- `clasificacion` should not be mapped separately to `ambito`.

### `clasificacion` — conclusión

- El campo es casi completamente redundante con `sector`.
- En 1665 de los 1697 registros, `clasificacion` y `sector` contienen exactamente el mismo valor.
- Los 32 registros restantes tienen `clasificacion = "SIN RESOLUCIÓN"`, mientras que `sector` sigue conteniendo una categoría válida de población destinataria.
- Por tanto, `clasificacion` no aporta una clasificación temática adicional en la mayoría de los registros.
- Su principal información adicional es el valor especial `SIN RESOLUCIÓN`, que parece indicar que la clasificación no ha sido formalmente resuelta.
- Para la correspondencia con el atributo global `Entidad.ambito`, `sector` es más adecuado porque conserva información en todos los registros.
- `clasificacion` no debería asociarse por separado con `ambito`.

### `pobtotal` — conclusion

- The field is stored as `float64`, but all non-null values are mathematically integers.
- It contains 1665 non-null values and 32 missing values.
- There are 331 distinct values.
- For each `municipio`, only one unique `pobtotal` value is present.
- The same is true for each `cod_ine_mun`.
- This strongly indicates that `pobtotal` represents the total population of the municipality rather than a property of the centre.
- The field therefore belongs conceptually to the municipality/locality level.
- It has no direct equivalent in the current global schema, where `Localidad` only contains `código` and `nombre`.

### `pobtotal` — conclusión

- El campo está almacenado como `float64`, aunque todos los valores no nulos son matemáticamente enteros.
- Contiene 1665 valores no nulos y 32 valores ausentes.
- Hay 331 valores distintos.
- Para cada `municipio` existe un único valor de `pobtotal`.
- Lo mismo ocurre para cada `cod_ine_mun`.
- Esto indica con bastante claridad que `pobtotal` representa la población total del municipio y no una característica del centro.
- Por tanto, conceptualmente pertenece al nivel de municipio/localidad.
- No tiene una correspondencia directa en la estructura global actual, donde `Localidad` solo contiene `código` y `nombre`.

### `tipo_centro` — conclusion

- The field describes the specific type of service or resource provided by a centre.
- Most centres (1636) are associated with only one `tipo_centro`.
- However, 9 centres have more than one type:
  - 6 centres have 2 types,
  - 1 centre has 3 types,
  - 1 centre has 4 types,
  - 1 centre has 7 types.
- These cases show that one physical centre (`ni_centro`) can provide several different types of services.
- `tipo_centro` is more specific than `sector`: a centre may have several `tipo_centro` values within the same or different sectors.
- Therefore, `tipo_centro` should be interpreted as a service/resource subtype rather than as an identifier or general category of the centre.
- The current global schema has no direct attribute corresponding to this field.

### `tipo_centro` — conclusión

- El campo describe el tipo específico de servicio o recurso que presta un centro.
- La mayoría de los centros (1636) están asociados a un único `tipo_centro`.
- Sin embargo, 9 centros tienen más de un tipo:
  - 6 centros tienen 2 tipos,
  - 1 centro tiene 3 tipos,
  - 1 centro tiene 4 tipos,
  - 1 centro tiene 7 tipos.
- Estos casos muestran que un mismo centro físico (`ni_centro`) puede prestar varios tipos diferentes de servicios.
- `tipo_centro` es más específico que `sector`: un centro puede tener varios valores de `tipo_centro` dentro del mismo sector o de sectores diferentes.
- Por tanto, `tipo_centro` debe interpretarse como un subtipo de servicio o recurso, y no como identificador o categoría general del centro.
- La estructura global actual no contiene un atributo que corresponda directamente a este campo.

### `ni_centro` — conclusion

- The field contains 1665 non-null values and 32 missing values.
- All non-null values are mathematically integers, although the field is stored as `float64` because it contains missing values.
- There are 1645 distinct non-null `ni_centro` values.
- Each `ni_centro` is associated with exactly one `nombre`.
- A `ni_centro` may appear in several rows when the same centre has multiple sectors or service types (`tipo_centro`).
- Therefore, `ni_centro` identifies the centre rather than an individual row in the dataset.
- The same 32 records that have no `ni_centro` also have missing `max` and `pobtotal` values and `clasificacion = "SIN RESOLUCIÓN"`.
- `ni_centro` is therefore a strong candidate for `Entidad.cod_entidad` in the global schema.
- However, a strategy will be required for the 32 records where the centre code is missing.

### `ni_centro` — conclusión

- El campo contiene 1665 valores no nulos y 32 valores ausentes.
- Todos los valores no nulos son matemáticamente enteros, aunque el campo está almacenado como `float64` debido a la presencia de valores ausentes.
- Hay 1645 valores distintos de `ni_centro` no nulos.
- Cada `ni_centro` está asociado exactamente a un único `nombre`.
- Un mismo `ni_centro` puede aparecer en varias filas cuando el centro tiene varios sectores o tipos de servicio (`tipo_centro`).
- Por tanto, `ni_centro` identifica al centro y no a una fila individual del conjunto de datos.
- Los mismos 32 registros que no tienen `ni_centro` tampoco tienen valores de `max` ni `pobtotal` y presentan `clasificacion = "SIN RESOLUCIÓN"`.
- Por ello, `ni_centro` es un candidato claro para `Entidad.cod_entidad` en la estructura global.
- Sin embargo, será necesario definir una estrategia para los 32 registros que no disponen de código de centro.

### `id` — conclusion

- The field is stored as `int64`.
- It is complete: all 1697 records contain a value.
- All 1697 values are unique.
- The values form a sequential record identifier.
- The field identifies individual rows in the source dataset rather than physical centres.
- It should therefore not be mapped to `Entidad.cod_entidad`; `ni_centro` is more appropriate for that purpose.

### `id` — conclusión

- El campo está almacenado como `int64`.
- Está completo: los 1697 registros contienen un valor.
- Los 1697 valores son únicos.
- Los valores forman un identificador secuencial de los registros.
- El campo identifica filas individuales del conjunto de datos de origen y no centros físicos.
- Por tanto, no debería asociarse con `Entidad.cod_entidad`; `ni_centro` es más adecuado para ese propósito.

### `WKT`, `x_25830`, `y_25830` — conclusion

- `WKT` contains point geometries in the form `POINT (X Y)`.
- The coordinates stored in `WKT` match `x_25830` and `y_25830` exactly in all 1697 records.
- Therefore, `WKT` does not provide additional coordinate information; it is another representation of the same point geometry.
- The column names indicate that `x_25830` and `y_25830` use the EPSG:25830 projected coordinate reference system.
- These values are projected X/Y coordinates and must not be used directly as longitude and latitude.
- To populate `Entidad.longitud` and `Entidad.latitud`, the coordinates should be transformed from EPSG:25830 to the geographic coordinate system adopted by the global schema (typically WGS84 / EPSG:4326).
- `WKT` does not require a separate mapping in the current global schema.

### `WKT`, `x_25830`, `y_25830` — conclusión

- `WKT` contiene geometrías de tipo punto con el formato `POINT (X Y)`.
- Las coordenadas almacenadas en `WKT` coinciden exactamente con `x_25830` y `y_25830` en los 1697 registros.
- Por tanto, `WKT` no aporta información adicional sobre las coordenadas, sino que representa la misma geometría de otra forma.
- Los nombres de las columnas indican que `x_25830` y `y_25830` utilizan el sistema de referencia proyectado EPSG:25830.
- Estos valores son coordenadas X/Y proyectadas y no deben utilizarse directamente como longitud y latitud.
- Para obtener `Entidad.longitud` y `Entidad.latitud`, las coordenadas deben transformarse desde EPSG:25830 al sistema geográfico utilizado por la estructura global (normalmente WGS84 / EPSG:4326).
- `WKT` no necesita una correspondencia independiente en la estructura global actual.


===== notebooks\entitats_xml.ipynb =====

## Exploratory analysis / Análisis exploratorio

Same workflow as `datos_abiertos.ipynb` and `entidades_CV.ipynb`: basic checks, field-specific checks, relationships, and conclusions after each column. Only observations are recorded; the XML and `df` are not cleaned, corrected, or transformed. Masks, lengths and counts are diagnostic results only.

Se sigue el mismo formato: comprobación básica, detalles de la columna, relaciones y conclusiones. No se modifica el XML ni `df`. Las comprobaciones de formato no acreditan validez fiscal, existencia de contactos ni exactitud geográfica. Los resultados se refieren exclusivamente a este archivo.

### Initial observations / Observaciones iniciales

- 765 `<entitat>` records, 11 columns; no exact duplicate rows, nested fields or XML attributes. The fields occur in the same order in every record.
- Empty XML elements occur in CIF, telephone, mobile, email and web fields; pandas represents these as missing values.
- Numeric inference affects registration numbers and postal codes. Literal XML text is inspected separately in `xml_text` without replacing the loaded data.

- Hay 765 registros y 11 columnas; no hay filas completamente duplicadas, campos anidados ni atributos XML.
- Los elementos XML vacíos se observan como valores ausentes en pandas. Se distingue el texto literal del XML del tipo inferido por pandas.

## `n_mero_registre`

### `n_mero_registre` — conclusion

- 765 non-null values; all are unique in pandas and as literal XML text. Registration and name are one-to-one in this file.
- pandas inferred `float64`: 738 literal values contain digits only; 27 contain a dot followed by three digits, e.g. `1.005`.
- The dot may be a thousands separator; its meaning is unconfirmed. No arithmetic interpretation or correction is applied.
- No two rows have identical values across all non-identifier fields after excluding registration, name and CIF.
- Candidate for `Entidad.cod_entidad` (`str`). Uniqueness across sources and the final identifier representation remain unresolved.

### `n_mero_registre` — conclusión

- 765 valores no nulos; todos únicos en pandas y en el XML literal. Registro y nombre tienen relación uno a uno en este archivo.
- pandas infiere `float64`: 738 textos contienen solo dígitos y 27 un punto seguido de tres dígitos, por ejemplo `1.005`.
- El punto podría separar miles; su significado no está confirmado. No se interpreta como magnitud ni se corrige.
- Al excluir registro, nombre y CIF, no hay dos filas iguales en todos los demás campos.
- Candidato a `Entidad.cod_entidad` (`str`). Quedan abiertas la unicidad entre fuentes y la representación final.

## `nom_de_l_entitat`

### `nom_de_l_entitat` — conclusion

- 765 populated, distinct names; lengths 5–165. No leading/trailing whitespace.
- 764 names contain no whitespace; the remaining name contains a newline. All names match literal XML text.
- Compound names join words, e.g. `AccióSolidàriadelVallès`; this can hinder reading and matching. Single-word names need no spaces.
- Length extremes and endings are displayed for inspection; these checks alone do not establish truncation.
- Candidate for `Entidad.nombre`. Observed name uniqueness does not establish a universal entity identifier.

### `nom_de_l_entitat` — conclusión

- 765 nombres informados y distintos; longitudes de 5 a 165. Sin espacios iniciales/finales.
- 764 nombres no contienen caracteres de espacio; el restante contiene un salto de línea. Todos coinciden con el XML literal.
- Hay palabras concatenadas, como `AccióSolidàriadelVallès`, que pueden dificultar lectura y comparación. Los nombres de una palabra no requieren espacios.
- Se muestran longitudes extremas y finales para inspección; estas comprobaciones no demuestran truncamiento.
- Candidato a `Entidad.nombre`; su unicidad aquí no demuestra identidad universal.

## `naturalesa`

### `naturalesa` — conclusion

- Complete categorical field: 12 values; `Associació` 536 rows, `Fundació` 132.
- Compound labels lack separating spaces, e.g. `AssociacióEstatal`. Single-word labels are not anomalous for lacking spaces.
- Missingness differs descriptively by legal form: CIF is missing in 73/536 associations (13.6%) and 9/132 foundations (6.8%). Mobile is missing in 127/536 (23.7%) and 58/132 (43.9%), respectively.
- Group sizes and rates are displayed; small categories do not support general conclusions or causal claims.
- This is legal/organisational nature, not an `Ambito`. The schema has no dedicated legal-form attribute.

### `naturalesa` — conclusión

- Campo categórico completo: 12 valores; `Associació` aparece en 536 filas y `Fundació` en 132.
- Etiquetas compuestas sin espacios, como `AssociacióEstatal`; no es anomalía en etiquetas de una palabra.
- Ausencias por naturaleza: CIF en 73/536 asociaciones (13,6%) y 9/132 fundaciones (6,8%); móvil en 127/536 (23,7%) y 58/132 (43,9%), respectivamente.
- Se muestran tamaños y porcentajes por grupo. Las categorías pequeñas no permiten generalizaciones ni conclusiones causales.
- Describe naturaleza jurídica/organizativa, no `Ambito`. No hay atributo específico en el esquema.

## `cif_entitat`

### `cif_entitat` — conclusion

- 682 populated values, 83 missing (10.8%); 680 distinct populated CIFs. All populated strings have nine characters.
- 681 match the illustrative organisation-ID pattern. `46414697F` has a DNI-like shape; neither checksums nor legal identity are validated.
- Two CIFs repeat, covering four rows. Both groups differ in registration, name, address, postal code, municipality, mobile and email.
- `G55258909` also differs in legal form (`Associació` / `Federació`) and telephone availability; `G10932812` has `Associació` in both rows and no telephone in either. Web is missing in all four rows.
- The full-field comparison does not establish whether these are related organisations or source errors. Shared CIF alone does not justify merging.
- Incomplete and non-unique as a row key; no dedicated CIF/NIF attribute exists in the schema.

### `cif_entitat` — conclusión

- 682 valores informados, 83 ausentes (10,8%) y 680 CIF distintos. Todos los textos informados tienen nueve caracteres.
- 681 cumplen el patrón orientativo de organización. `46414697F` tiene forma similar a DNI; no se valida control ni identidad jurídica.
- Dos CIF repetidos afectan a cuatro filas. Ambos grupos difieren en registro, nombre, dirección, código postal, municipio, móvil y correo.
- `G55258909` también difiere en naturaleza (`Associació` / `Federació`) y disponibilidad de teléfono. `G10932812` tiene `Associació` en ambas filas y carece de teléfono en las dos. Las cuatro carecen de web.
- La comparación completa no determina si son organizaciones relacionadas o errores de fuente. Compartir CIF no basta para fusionar.
- No es clave completa y única; no hay atributo CIF/NIF específico en el esquema.

## `adre_a`

### `adre_a` — conclusion

- 765 populated addresses, 755 distinct; lengths 7–66. None contains whitespace.
- Words and components appear joined, e.g. `PladelVinyet,9BlocDbaixos`; punctuation and component separation vary. This is literal XML text.
- 10 addresses repeat twice (20 rows). Each pair shares its municipality and postal code but has different registrations and names.
- Seven pairs contain two distinct known CIFs; in three pairs one CIF is missing. All remaining fields are compared in the displayed tables.
- Shared address does not establish duplicate entities. Candidate for `Entidad.direccion`; no components are parsed into a corrected address.

### `adre_a` — conclusión

- 765 direcciones informadas y 755 distintas; longitudes de 7 a 66. Ninguna contiene caracteres de espacio.
- Palabras y componentes unidos, como `PladelVinyet,9BlocDbaixos`; puntuación y separación variables, ya en el XML.
- 10 direcciones aparecen dos veces (20 filas). Cada pareja comparte municipio y código postal, pero tiene registros y nombres distintos.
- Siete parejas tienen dos CIF conocidos distintos; en tres falta uno de los CIF. Las tablas comparan los demás campos.
- Compartir dirección no demuestra duplicación. Candidato a `Entidad.direccion`; no se reconstruyen componentes.

## `codi_postal`

### `codi_postal` — conclusion

- 765 complete values; 209 distinct. Every literal XML value has five digits; 618 start with zero.
- pandas inferred `int64`, losing leading zeros in the loaded representation. Literal `00800` appears as `800` in registration 540; its geographic correctness is unverified.
- Six postal codes occur with multiple municipality labels: `08197`, `08227`, `08293`, `08330`, `08902`, `08930`. Full address/name context is displayed for review.
- 21 municipality labels have multiple postal codes. These relationships are not one-to-one and alone do not prove errors.
- Candidate for `Entidad.codigo_postal` (`str | None`), not `Localidad.codigo`. No zeros are restored and no codes are changed.

### `codi_postal` — conclusión

- 765 valores completos y 209 distintos. Todos los textos XML tienen cinco dígitos; 618 empiezan por cero.
- pandas infiere `int64` y pierde ceros iniciales en la representación cargada. `00800` se observa como `800` en el registro 540; su exactitud geográfica no está comprobada.
- Seis códigos aparecen con varios municipios: `08197`, `08227`, `08293`, `08330`, `08902`, `08930`. Se muestra contexto de nombre y dirección para revisión.
- 21 municipios tienen varios códigos. La relación no es uno a uno y por sí sola no demuestra errores.
- Candidato a `Entidad.codigo_postal` (`str | None`), no `Localidad.codigo`. No se restauran ceros ni se cambian códigos.

## `municipi`

### `municipi` — conclusion

- 765 populated values; 113 distinct labels. `Barcelona` occurs 428 times.
- No values contain whitespace. Compound labels such as `SantCugatdelVallès` join words; single-word labels such as `Barcelona` are not problematic for that reason.
- Length extremes, postal-code multiplicity and literal postal-prefix multiplicity are displayed; prefixes are not assigned to provinces.
- 112 municipality labels occur with one literal postal prefix; `VilanovailaGeltrú` occurs with two: `00` (one row, `00800`) and `08` (two rows, `08800`). This is an internal discrepancy for review; the correct postal code is not established here.
- Candidate for `Localidad.nombre` via `Entidad.en_localidad`. Locality code, province code/name and explicit province relationship are absent.
- Geographic correctness and equivalence to official municipality labels are not established.

### `municipi` — conclusión

- 765 valores informados y 113 etiquetas distintas. `Barcelona` aparece 428 veces.
- Sin caracteres de espacio. Nombres compuestos como `SantCugatdelVallès` concatenan palabras; esto no afecta a nombres de una palabra como `Barcelona`.
- Se muestran longitudes extremas y multiplicidad de códigos y prefijos postales; no se asignan provincias mediante prefijos.
- 112 municipios tienen un prefijo postal literal; `VilanovailaGeltrú` tiene dos: `00` (una fila, `00800`) y `08` (dos filas, `08800`). Es una discrepancia interna para revisión; no se establece aquí el código correcto.
- Candidato a `Localidad.nombre` mediante `Entidad.en_localidad`. Faltan código municipal, código/nombre de provincia y relación provincial explícita.
- No se establece exactitud geográfica ni equivalencia con etiquetas municipales oficiales.

## `tel_fon`

### `tel_fon` — conclusion

- 544 populated strings, 221 missing (28.9%); 510 distinct populated strings.
- 504 contain exactly nine digits. The other 40 are: 34 multiline, 4 single-line extensions, 1 single-line slash notation and 1 single-line country prefix. Categories are exclusive, with multiline taking priority.
- 26 multiline cells contain exactly two bare nine-digit lines. Other lines include spaces, slash notation, an extension or an eight-digit second line; verbatim examples are displayed.
- Of the 504 single nine-digit strings, 22 start with 6. The column name does not guarantee landline service; format checks do not establish number validity.
- 28 exact strings repeat across 62 rows; 27 groups have multiple address strings and 3 span multiple municipality labels. Sharing a number is not evidence of entity identity.
- Candidate contact component for `Entidad.contacto`; source cells are not split or rewritten.

### `tel_fon` — conclusión

- 544 textos informados, 221 ausentes (28,9%) y 510 textos distintos.
- 504 contienen nueve dígitos. Los otros 40: 34 multilínea, 4 con extensión en una línea, 1 con barra en una línea y 1 con prefijo internacional en una línea. Categorías excluyentes; multilínea tiene prioridad.
- 26 celdas multilínea tienen dos líneas de nueve dígitos exactos. Otras incluyen espacios, barra, extensión o una segunda línea de ocho dígitos; se muestran literalmente.
- 22 de los 504 valores de nueve dígitos empiezan por 6. El rótulo no garantiza teléfono fijo; el formato no acredita validez del número.
- 28 textos se repiten en 62 filas; 27 grupos tienen varias direcciones y 3 varios municipios. Compartir número no demuestra identidad de entidad.
- Componente candidato para `Entidad.contacto`; no se separan ni reescriben celdas.

## `tel_fon_m_bil`

### `tel_fon_m_bil` — conclusion

- 553 populated strings, 212 missing (27.7%); 543 distinct populated strings.
- 530 contain exactly nine digits; 23 are multiline. Of those 23, 22 contain two bare nine-digit lines and one includes a `+34` prefix on its second line.
- Eight single nine-digit strings start with 9; mobile service is not established by the column label.
- 10 exact strings repeat across 20 rows; all groups have different addresses and 4 span multiple municipality labels.
- Both phone fields are missing in 12 rows. One row has equal populated values in both fields; three two-row groups share the same populated phone pair but have different CIFs.
- Candidate component for `Entidad.contacto`; no telephone selection or splitting rule is applied.

### `tel_fon_m_bil` — conclusión

- 553 textos informados, 212 ausentes (27,7%) y 543 textos distintos.
- 530 contienen nueve dígitos; 23 son multilínea. De estas, 22 tienen dos líneas de nueve dígitos y una incluye `+34` en la segunda línea.
- Ocho valores de nueve dígitos empiezan por 9; el rótulo no acredita servicio móvil.
- 10 textos se repiten en 20 filas; todos los grupos tienen direcciones distintas y 4 varios municipios.
- En 12 filas faltan ambos teléfonos. Una fila tiene el mismo valor informado en ambos campos; tres grupos de dos filas comparten la pareja telefónica, pero tienen CIF distintos.
- Componente candidato para `Entidad.contacto`; no se seleccionan ni separan teléfonos.

## `correu_electr_nic`

### `correu_electr_nic` — conclusion

- 730 populated strings, 35 missing (4.6%); 726 distinct populated strings.
- Exclusive whole-cell categories: 76 match the simple single-address pattern, 627 have one `@` and no dot in the domain, 25 have multiple `@`, and 2 have no `@`.
- The 627 domain cases include `acciosolidariavalles@gmailcom`. Separately, 650 whole cells contain no dot anywhere; the two counts measure different properties.
- Of the 25 multiple-@ cells, 9 contain newlines and 16 lack whitespace. Zero-@ values are `sakadawaorggmailcom` and `infoarrobaproinfantsorg`. These forms are already in XML.
- Four exact strings repeat across eight rows; each pair has different names and address strings. Three pairs have two different known CIFs; one pair has a missing CIF. One pair spans two municipalities.
- Pattern failure does not establish deliverability or the intended address. Candidate for `Entidad.contacto`; no dots or separators are inserted.

### `correu_electr_nic` — conclusión

- 730 textos informados, 35 ausentes (4,6%) y 726 textos distintos.
- Categorías excluyentes por celda: 76 cumplen el patrón simple de correo único; 627 tienen una `@` y dominio sin punto; 25 tienen varias `@`; 2 no tienen `@`.
- Entre los 627 casos está `acciosolidariavalles@gmailcom`. Por separado, 650 celdas no contienen ningún punto en todo el texto; son medidas distintas.
- De las 25 celdas con varias `@`, 9 contienen saltos de línea y 16 carecen de espacios. Sin `@`: `sakadawaorggmailcom` e `infoarrobaproinfantsorg`. Ya aparecen así en XML.
- Cuatro textos se repiten en ocho filas; cada pareja tiene nombres y direcciones distintos. Tres parejas tienen dos CIF conocidos distintos; en una falta un CIF. Una pareja abarca dos municipios.
- El patrón no determina entrega ni dirección prevista. Candidato a `Entidad.contacto`; no se insertan puntos ni separadores.

## `web`

### `web` — conclusion

- 611 populated strings, 154 missing (20.1%); 607 distinct populated strings.
- 56 cells contain repeated scheme text, such as `http://https://cecodees/`. For these, `urlsplit` reports `https` or `http` as hostname; that result is a parsing artifact of the source syntax.
- All 611 parsed hostnames lack dots; this includes the repeated-scheme cases. Ordinary examples such as `http://wwwigmancat` also lack a dot in the literal host text. These observations do not establish the intended domains.
- Three exact URL strings repeat across seven rows. Quepo and Yamuna pairs have different known CIFs; `http://wwwsolidariesorg` spans three names and two municipalities, with one CIF missing.
- Two Yamuna records share all four populated contact fields but have different registrations, names, CIFs, legal forms and address strings. This supports review for a possible relationship, not automatic merging.
- Candidate for `Entidad.url`; no scheme/domain repair, DNS lookup or availability check is performed.

### `web` — conclusión

- 611 textos informados, 154 ausentes (20,1%) y 607 textos distintos.
- 56 celdas repiten el esquema, como `http://https://cecodees/`. En ellas `urlsplit` devuelve `https` o `http` como hostname: efecto de análisis de la sintaxis de origen.
- Los 611 hostnames analizados carecen de puntos, incluidos esos 56 casos. Ejemplos ordinarios como `http://wwwigmancat` también carecen de punto en el host literal. No se establecen dominios previstos.
- Tres URLs se repiten en siete filas. Quepo y Yamuna tienen CIF conocidos distintos; `http://wwwsolidariesorg` abarca tres nombres y dos municipios, con un CIF ausente.
- Dos registros Yamuna comparten los cuatro contactos informados, pero difieren en registro, nombre, CIF, naturaleza y texto de dirección. Sugiere revisar una posible relación, no fusionar automáticamente.
- Candidato a `Entidad.url`; no se reparan esquemas/dominios ni se comprueba DNS o disponibilidad.

## Joint missingness / Ausencias conjuntas

### Joint missingness — conclusions

- 12 rows lack both phones: 11 still contain email; one lacks email and web as well (registration 392).
- Of the 35 rows without email, 34 contain at least one phone.
- CIF absence does not coincide with incomplete direct-contact fields: 37/83 rows without CIF have all three direct-contact fields, while 395/682 rows with CIF lack at least one.
- Legal-form counts and rates above show descriptive differences. Neither these tables nor overlapping gaps establish why data is absent.

### Ausencias conjuntas — conclusiones

- En 12 filas faltan ambos teléfonos: 11 conservan correo; una carece también de correo y web (registro 392).
- De las 35 filas sin correo, 34 tienen al menos un teléfono.
- La ausencia de CIF no coincide con contactos incompletos: 37/83 filas sin CIF tienen los tres campos de contacto directo; 395/682 con CIF carecen de alguno.
- Los recuentos y porcentajes por naturaleza muestran diferencias descriptivas; no explican la causa de las ausencias.


## Cross-column text issues / Problemas de texto entre columnas

| Field | Cells without whitespace | Literal XML example |
| --- | --- | --- |
| `nom_de_l_entitat` | 764/765; the other contains a newline | `AccióSolidàriadelVallès` |
| `naturalesa` | 765/765 | `AssociacióEstatal` |
| `adre_a` | 765/765 | `PladelVinyet,9BlocDbaixos` |
| `municipi` | 765/765 | `SantCugatdelVallès` |

- These columns contain joined-word examples already in XML. Counts measure whitespace absence, not defective values; single-word labels need no spaces.
- Email domain dots and repeated web schemes are separate observed issues. Absence of spaces alone is not an email/URL defect.
- The earlier source is needed to establish cause or intended text. No common cause is established; no text is repaired.

- Hay palabras unidas en estas columnas, ya en XML. Los recuentos no equivalen a errores: los valores de una palabra no requieren espacios.
- Puntos ausentes en dominios email y esquemas web repetidos son observaciones distintas. No tener espacios no es, por sí solo, un defecto de email/URL.
- La causa y el texto previsto requieren una fuente anterior. No se establece causa común ni se repara texto.


## Comparison with the global schema / Comparación con el esquema global

Candidate correspondences only. No `Entidad`, `Localidad` or `Provincia` instances are created, and no integration rules are applied.

Correspondencias conceptuales candidatas; no se generan entidades ni se ejecutan reglas de integración. `str | None` admite valores nulos, pero los campos no tienen valores por defecto en las dataclasses.

| Source column | Candidate schema attribute | Observation / Observación |
| --- | --- | --- |
| `n_mero_registre` | `Entidad.cod_entidad` | Complete and unique here; literal identifiers include dots; pandas type differs from schema `str`. |
| `nom_de_l_entitat` | `Entidad.nombre` | Complete; joined words already in XML. |
| `naturalesa` | No dedicated attribute | Legal form does not determine `Ambito`. |
| `cif_entitat` | No dedicated attribute | Missing/repeated; does not provide a complete unique key. |
| `adre_a` | `Entidad.direccion` | Complete composite strings; shared addresses are not unique keys. |
| `codi_postal` | `Entidad.codigo_postal` | Five-digit XML text; numeric inference loses leading zeros. |
| `municipi` | `Localidad.nombre` | Name only; municipality code and province relationship absent. |
| `tel_fon` | `Entidad.contacto` | Contact component; some cells contain several numbers or extensions. |
| `tel_fon_m_bil` | `Entidad.contacto` | Complementary contact component; not necessarily mobile-only. |
| `correu_electr_nic` | `Entidad.contacto` | Domain punctuation and multiple-contact anomalies. |
| `web` | `Entidad.url` | Dotless host strings and repeated schemes require source review. |

### Global schema — conclusions

- All 11 source fields are considered. Coordinates, explicit description and an activity classification establishing `Ambito` are absent.
- The required `Entidad.en_localidad` object cannot be fully populated from explicit fields alone: locality code and province code/name are missing.
- The schema has one optional `contacto` string, with no representation rule for the three contact components or multiple values. No selection, joining or splitting policy is defined here.
- Registration is a candidate key within this file. Repeated CIFs, addresses or contacts do not establish entity identity; cross-source identity remains unresolved.
- Source syntax issues and geographic associations are documented. No reconstruction, correction, record removal or merge is performed.

### Esquema global — conclusiones

- Se consideran los 11 campos. Faltan coordenadas, descripción explícita y clasificación de actividad que determine `Ambito`.
- `Entidad.en_localidad` es obligatorio; no se puede completar solo con campos explícitos: faltan código municipal y código/nombre de provincia.
- `contacto` es un único texto opcional; no define cómo representar tres componentes ni varios contactos por celda. No se fija política de selección, unión o separación.
- Registro es candidato a clave dentro de este archivo. CIF, dirección o contactos compartidos no demuestran identidad; queda abierta la identidad entre fuentes.
- Se documentan anomalías de sintaxis y relaciones geográficas. No se reconstruyen valores, corrigen datos, eliminan filas ni fusionan registros.

