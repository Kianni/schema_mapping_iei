// English report text. Source column names, enum values and quoted source
// categories remain unchanged so they can be traced to the original files.
// Tables use stable schema/column keys; source rows are not modified.
window.IEI_EN = {};

function ieiEnglishSource(name, summary, mappings, inventory, areas, decisions) {
  return {
    nombre: name, resumen: summary,
    mapeoGlobal: Object.fromEntries(mappings.map(([key, regla, nota]) => [key, { regla, nota }])),
    inventario: Object.fromEntries(inventory.map(([key, significado, hallazgos, regla]) => [key, { significado, hallazgos, regla }])),
    ambitos: areas,
    decisiones: decisions.map(([tema, evidencia, decision]) => ({ tema, evidencia, decision }))
  };
}

window.IEI_EN.valencia = ieiEnglishSource(
  "Valencian Community",
  [
    "ni_centro is the best candidate for Entidad.cod_entidad, but it is missing in 32 records.",
    "sector corresponds to Entidad.ambito; 12 centres have more than one sector and require a modelling decision.",
    "cod_ine_mun can provide Localidad.codigo and a derived Provincia.codigo.",
    "x_25830/y_25830 use EPSG:25830 and must be transformed before use as longitude/latitude.",
    "WKT exactly duplicates the x_25830/y_25830 coordinates.",
    "codigo_postal, descripcion and url have no equivalent source fields in Valencia."
  ],
  [
    ["Entidad.cod_entidad", "Use the centre identifier. Convert integer values stored as float to the agreed identifier type.", "1,645 distinct non-null codes. Each code corresponds to one name. 32 records lack a code."],
    ["Entidad.nombre", "Keep the source name; normalise whitespace only if needed.", "Complete field. 1,660 distinct names; not a unique identifier."],
    ["Entidad.ambito", "Map the seven sector categories to the global Ambito enum. Preserve multiple activity areas when a centre has several sectors.", "12 centres have several sectors: 10 have two and two have three."],
    ["Entidad.direccion", "Keep the free-text address; abbreviation normalisation is optional.", "1,689 non-null values and eight missing. Heterogeneous format."],
    ["Entidad.codigo_postal", "No source field identified.", "The source has no postal-code field."],
    ["Entidad.longitud", "Transform the point from EPSG:25830 to the geographic CRS adopted by the global model and use the resulting longitude.", "WKT contains exactly the same X/Y coordinates."],
    ["Entidad.latitud", "Transform the point from EPSG:25830 to the geographic CRS adopted by the global model and use the resulting latitude.", "All 1,697 WKT points match x_25830/y_25830."],
    ["Entidad.descripcion", "There is no direct descriptive field in the source.", "tipo_centro describes a service subtype, not a free-text description."],
    ["Entidad.contacto", "Normalise telephone and email separately and define their representation in the single global contacto attribute.", "Both fields contain missing values or format anomalies."],
    ["Entidad.url", "No source field identified.", "The source has no URL/web field."],
    ["Localidad.codigo", "Convert to a five-character string and restore leading zeros.", "333 distinct codes, with no missing values; one-to-one with municipio."],
    ["Localidad.nombre", "Keep the municipality name.", "333 distinct names, with no missing values."],
    ["Provincia.codigo", "Normalise cod_ine_mun to five characters and take the first two.", "03 = Alicante, 12 = Castellón, 46 = Valencia."],
    ["Provincia.nombre", "Keep the source value and later define a policy for bilingual names.", "Complete field; three provinces; consistent with cod_ine_mun and comarca."]
  ],
  [
    ["WKT", "Point geometry in text: POINT (X Y)", "Complete; matches x_25830/y_25830 in all 1,697 records.", "Do not map separately; use the coordinates for the CRS transformation."],
    ["id", "Sequential source-row identifier", "int64; complete; 1,697 unique, sequential values.", "Keep for traceability if needed; do not use as Entidad.cod_entidad."],
    ["ni_centro", "Centre identifier", "1,665 non-null values, 32 missing; 1,645 distinct codes; one name per code.", "Use as the centre code and define a strategy for the 32 records without a code."],
    ["tipo_centro", "Specific service or resource subtype", "Most centres have one type; nine have several, with up to seven for one centre.", "Keep as source metadata or extend the model if this detail is needed."],
    ["nombre", "Centre name", "Complete; 1,660 distinct names; 27 repeated names affect 64 records.", "Direct mapping; do not use as a unique key."],
    ["max", "Possible maximum capacity or number of places", "1,665 non-null values, 32 missing; range 0–356; median 20; semantic meaning unconfirmed.", "Do not map until the field's meaning is confirmed."],
    ["entidad", "Organisation or institution associated with the centre", "One organisation may be associated with many centres. GENERALITAT VALENCIANA: 141 records and 134 centre names.", "The current global model does not separately represent the responsible/managing organisation."],
    ["domici", "Free-text address", "1,689 non-null values, eight missing; 1,576 distinct addresses; heterogeneous format.", "Keep the original text; abbreviation normalisation is optional."],
    ["leyenda", "Source-specific administrative/legal classification", "Nine categories; 21 organisations have two values; mixes levels of specificity.", "Do not interpret as a strict legal type without additional modelling."],
    ["cod_ine_mun", "INE municipality identifier", "1,697 values, 333 codes; 489 appear as four digits after loss of a leading zero.", "Pad to five characters; use the full code for Localidad and the first two digits for Provincia."],
    ["provincia", "Province name", "Three bilingual values; no missing data; consistent with cod_ine_mun and comarca.", "Direct mapping; decide a policy for bilingual name normalisation."],
    ["comarca", "Comarca territorial classification", "33 values; each municipality belongs to one comarca and each comarca to one province.", "Keep as metadata if needed; no equivalent global field exists."],
    ["municipio", "Municipality name", "1,697 values; 333 distinct names; one-to-one with cod_ine_mun.", "Direct mapping."],
    ["sector", "Target population / activity area", "Seven categories; 12 centres have more than one sector.", "Map to the Ambito enum and preserve multiple activity areas."],
    ["clasificacion", "Classification/status closely related to sector", "1,665 rows match sector; 32 have SIN RESOLUCIÓN while sector remains populated.", "Use sector for Entidad.ambito; keep clasificacion only as metadata/status if needed."],
    ["pobtotal", "Total municipality population", "1,665 non-null values, 32 missing; one value per municipality and cod_ine_mun.", "Locality metadata; the current global model has no population attribute."],
    ["email", "Contact email", "1,531 non-null values, 166 null; 873 distinct values; zero@gva.es occurs 413 times; malformed or multiple addresses occur.", "Trim whitespace, normalise case, validate, handle placeholders and separate multiple emails where appropriate."],
    ["telefono", "Contact telephone", "1,688 non-null values, nine missing; 68 values are '0'; separators and multiple numbers occur within cells.", "Normalise format, review '0', detect multiple numbers and validate length."],
    ["f_resolu", "Resolution date/time", "1,574 non-null values, 123 missing; all parseable; 12 recent records have a time other than 00:00:00.", "Keep as source metadata; confirm business meaning before reducing to DATE."],
    ["x_25830", "Projected X / easting coordinate (EPSG:25830)", "Complete; paired with y_25830; duplicated in WKT.", "Transform the point to the geographic CRS adopted by the global model."],
    ["y_25830", "Projected Y / northing coordinate (EPSG:25830)", "Complete; paired with x_25830; duplicated in WKT.", "Transform the point to the geographic CRS adopted by the global model."]
  ],
  [
    "Direct semantic correspondence.", "Direct semantic correspondence.", "Direct semantic correspondence.",
    "The source category is narrower, but this is the available direct correspondence.", "Direct semantic correspondence.", "Direct semantic correspondence.",
    "Best correspondence within the current global enum.",
    "No equivalent source sector.", "No equivalent source sector.", "No equivalent source sector.", "No equivalent source sector.", "No equivalent source sector."
  ],
  [
    ["Multiple activity areas", "The same ni_centro may have several sector values. 12 centres are affected.", "Confirm whether Entidad.ambito supports multiple values. Otherwise model an Entidad↔Ambito relationship or another lossless representation."],
    ["Missing centre codes", "32 records lack ni_centro. The same 32 also lack max and pobtotal and have clasificacion = SIN RESOLUCIÓN.", "Define whether to reject them, assign a surrogate key or keep a separate technical identifier."],
    ["Coordinate reference system", "The source uses EPSG:25830; the global diagram only specifies longitude/latitude.", "Confirm the target CRS before ETL. If standard geographic coordinates are expected, transform to the agreed CRS (usually EPSG:4326)."],
    ["Single contact field", "The source separates telefono and email, while the global model has one contacto attribute.", "Define whether contacto is structured or combined text, or whether telephone and email should be separate model attributes."],
    ["Information without global representation", "Relevant fields without a target: entidad, leyenda, tipo_centro, f_resolu, max, comarca and pobtotal.", "Confirm that their loss is intentional or extend the global schema before implementation."],
    ["Postal code and URL", "The global model has codigo_postal and url, but this source has neither.", "Use null for this source unless enrichment from another authorised source is agreed."]
  ]
);

window.IEI_EN.canarias = ieiEnglishSource(
  "Canary Islands",
  [
    "810 rows, 20 fields, 745 NIFs and 749 registration numbers; rows are not unique organisations.",
    "Four NIFs have two registrations; some organisations have multiple addresses. Agree granularity with Valencia, which describes centres.",
    "16 NIFs have multiple areas; 33 NIF–area groups have multiple known subareas.",
    "Seven municipality codes in eight rows lack known names/provinces; municipality coding is unverified.",
    "Contacts, websites and address components need cleaning in a later stage. No postal code, coordinates or free-text description identified."
  ],
  [
    ["Entidad.cod_entidad", "NIF is a candidate if Entidad represents an organisation. Agree global identity and keep registration for traceability; do not automatically equate organisations with centres.", "745 NIFs, 749 registrations; four NIFs have two registrations. Valencia describes centres."],
    ["Entidad.nombre", "Keep the original; review possible truncation without inventing text.", "745 names; one-to-one with NIF in this source; suspicious endings confirmed in JSON."],
    ["Entidad.ambito", "Map explicit categories to the enum; review mixed categories and preserve multiple activity areas.", "729 NIFs have one area, 14 have two, one has three and one has five; 33 NIF–area groups have multiple subareas."],
    ["Entidad.direccion", "Review embedded components before composition; handle markers and agree how multiple addresses per organisation are represented.", "Street type and number may also occur in nombre_via; heterogeneous addresses and multiple addresses per NIF."],
    ["Entidad.codigo_postal", "No source value; enrichment would require a separate stage.", "No equivalent field identified; do not use municipality code as postal code."],
    ["Entidad.longitud", "No source value; enrichment would require a separate stage.", "No equivalent field identified; do not use municipality code as postal code."],
    ["Entidad.latitud", "No source value; enrichment would require a separate stage.", "No equivalent field identified; do not use municipality code as postal code."],
    ["Entidad.descripcion", "No source value; enrichment would require a separate stage.", "No equivalent field identified; do not use municipality code as postal code."],
    ["Entidad.contacto", "Keep text, review format and _U, avoid duplicate numbers; agree a representation for multiple contacts.", "Seven first and two second telephone values fail the pattern; 20 rows have equal values in both telephone fields."],
    ["Entidad.url", "Distinguish URLs, emails and text; review whitespace/protocol without guessing domains. The report's URL label corresponds to url in Python.", "619 _U values; 191 populated; emails, descriptions and hhtps:// occur; availability unverified."],
    ["Localidad.codigo", "Convert to text for Localidad.codigo; validate coding before padding zeros or matching across sources.", "90 int64 codes; not confirmed as INE codes."],
    ["Localidad.nombre", "Keep known values and resolve _U before constructing required relationships.", "83 known names; seven codes have _U in eight rows, with no name recoverable within the source."],
    ["Provincia.codigo", "Preserve text and leading zeros; handle _U. The report's código label corresponds to codigo in Python.", "12 known codes plus _U; eight rows contain _U."],
    ["Provincia.nombre", "Keep known values; agree treatment of incomplete data and construct Localidad.en_provincia when resolved.", "Code–name is one-to-one; the eight rows without municipality names also have province _U."]
  ],
  [
    ["nif", "Tax identifier", "745 unique values in 810 rows; nine characters; no nulls, _U, blanks or edge whitespace; 51 NIFs repeat, with up to seven rows. Tax validity unverified.", "Keep text; agree granularity; do not deduplicate by NIF."],
    ["denominacion", "Organisation name", "745 distinct values; lengths 5–124; no nulls, blanks or edge whitespace; normalisation leaves 745 distinct values. Rows 157, 319 and 457 have possibly truncated endings at 99–100 characters, confirmed in JSON; possible typo Otrtas.", "Preserve originals; correct only with evidence."],
    ["numero_registro", "Registration identifier", "749 distinct values; complete; 14 characters; all match three letters + four digits + two letters + five digits. One NIF/name per registration; four NIFs have two registrations; maximum frequency seven.", "Keep traceability; format does not establish validity."],
    ["direccion_tipo_via", "Street type", "23 values; no nulls/_U; 49 blanks after strip. The type may occur or be omitted in nombre_via whether the separate type field is populated or blank.", "Review duplicated components before composition."],
    ["direccion_nombre_via", "Street name and details", "685 distinct values; lengths 1–76; no nulls, _U, blanks or edge whitespace. One literal Null; ambiguous D. Contains numbers, buildings, localities and instructions; variants and internal spaces.", "Treat Null as a possible marker; keep original details."],
    ["direccion_numero", "Address number", "133 distinct values; no nulls, _U, blanks or edge whitespace. S/n: 57, S/n.: two; letters, ranges and multiple numbers.", "Keep as text; no-number notation and non-numeric values are not automatically errors."],
    ["direccion_complemento", "Additional address detail", "180 distinct values; 488 _U; 70 have edge whitespace; strip reduces distinct values to 166. Abbreviations and internal spaces; - - - - is a possible marker.", "Agree markers and normalisation without losing details."],
    ["direccion_provincia_id", "Province code", "Text; 12 codes plus _U in eight rows; includes 06. No nulls, blanks or edge whitespace detected.", "Validate codes and resolve _U before integration; preserve originals."],
    ["direccion_provincia_nombre", "Province name", "12 names plus _U in eight rows; code–name is one-to-one. No nulls, blanks or edge whitespace detected.", "Validate codes and resolve _U before integration; preserve originals."],
    ["direccion_municipio_id", "Source municipality code", "int64; 90 codes; one name and province value per code, including markers; coding unverified. No nulls, blanks or edge whitespace detected.", "Validate codes and resolve _U before integration; preserve originals."],
    ["direccion_municipio_nombre", "Municipality name", "83 names plus _U; seven codes lack names in eight rows and also lack known provinces; known names are one-to-one with code. No nulls, blanks or edge whitespace detected.", "Validate codes and resolve _U before integration; preserve originals."],
    ["direccion_isla_id", "Island code", "Seven codes plus _U; 40 _U: 32 mainland-province rows and eight with unknown province. No nulls, blanks or edge whitespace detected.", "Preserve codes and names; handle markers; island has no dedicated global attribute."],
    ["direccion_isla_nombre", "Island name", "Seven names plus _U; code–name is one-to-one. _U may mean not applicable or unknown. No nulls, blanks or edge whitespace detected.", "Preserve codes and names; handle markers; island has no dedicated global attribute."],
    ["telefono_1", "First telephone", "728 distinct values; complete, no _U/blanks/edge whitespace; 803 match (34) + nine digits, seven do not. One value for each of 745 NIFs.", "Review anomalies; the pattern does not establish validity."],
    ["telefono_2", "Second telephone", "171 distinct values including _U; 625 _U; 185 populated, 183 match the pattern and two do not. One populated value for each of 172 NIFs; equal to first telephone in 20 rows.", "Handle _U and duplicate contact values without removing records."],
    ["pagina_web", "Website or other reference", "173 distinct values including _U; 619 _U, 191 populated, 172 distinct. No blanks or edge whitespace; six rows with internal spaces. Email, text and hhtps:// occur; one populated value for each of 172 NIFs.", "Classify and clean in a later stage; do not guess domain corrections; availability unverified."],
    ["area_id", "Activity area code", "Nine complete int64 codes; one-to-one with name. 16 NIFs have multiple areas.", "Map by meaning and preserve multiplicity."],
    ["area_nombre", "Activity area", "Nine names; no nulls, _U, blanks or edge whitespace. Varios: 414 rows. Categories differ from the global enum.", "Review residual and mixed categories; use subareas as evidence."],
    ["subarea_id", "Subarea code", "16 codes plus _U in 394 rows; 1–7 under area 9 and A–I under area 8; one-to-one with name.", "Preserve area–subarea links and codes as text; _U is not a category."],
    ["subarea_nombre", "Activity detail", "16 names plus _U; no nulls, blanks or edge whitespace. NIF–area groups excluding _U: 341 have one subarea, 29 have two, three have three and one has six.", "Preserve all subareas; refine mappings without forcing equivalences."]
  ],
  [
    "Proposed semantic correspondence; preserve multiple activity areas.", "Proposed semantic correspondence; preserve multiple activity areas.",
    "Proposed semantic correspondence; preserve multiple activity areas.", "Proposed semantic correspondence; preserve multiple activity areas.",
    "Proposed semantic correspondence; preserve multiple activity areas.", "Proposed semantic correspondence; preserve multiple activity areas.",
    "Explicit subarea; do not apply to all Varios records.", "Broader candidates; review scope.",
    "The subarea mixes education, science, culture and sports; review.",
    "Do not infer employment integration from occupational centre; B mixes services and inclusion.",
    "Compound categories; review.", "No explicit equivalent category; do not infer from Drogodependencia.",
    "Preserve detail; do not force residual categories into the enum."
  ],
  [
    ["Identity and granularity", "Canary Islands describes organisations and registrations; Valencia describes centres. Four NIFs have two registrations; multiple addresses occur.", "Agree the meaning of Entidad, global keys and site representation; do not automatically link NIF and ni_centro."],
    ["Multiple activity areas", "16 NIFs have multiple areas and 33 groups have multiple subareas; Python permits one Ambito.", "Support several activity areas or define a lossless representation; approve ambiguous equivalences."],
    ["Incomplete municipalities and coding", "Seven codes in eight rows lack name/province; municipality coding unvalidated. Python requires Localidad.nombre and en_provincia.", "Validate the system and agree enrichment, quarantine or an optional model; do not assume INE codes or fabricate relationships."],
    ["Addresses and sites", "Components are mixed and duplicated; multiple addresses per NIF.", "Agree support for several sites/localities and composition; do not concatenate blindly or choose an arbitrary address."],
    ["Names and truncation", "Suspicious endings confirmed in JSON; possible typos.", "Preserve originals and correct only with evidence."],
    ["Contacts and websites", "Nine telephone values fail the pattern; 20 repeated contacts; website field mixes URLs, emails and text.", "Define structure, cleaning, review and marker handling."],
    ["Information without a target", "Island and registration have no dedicated attributes; postal code, coordinates and description are absent.", "Keep metadata; leave fields without a source absent and agree the contextual meaning of _U."]
  ]
);

window.IEI_EN.catalunya_ongd = ieiEnglishSource(
  "Catalonia · ONGD",
  [
    "Analysis in notebooks/entitats_xml.ipynb: 765 entitat records and 11 fields, with no exact duplicate rows, nested fields or XML attributes. Observations only; no cleaning, transformation or merging.",
    "Registration and name are complete and unique within the file. 27 XML registration values include a dot, such as 1.005, inferred as float64 by pandas; the meaning and cross-source identity remain unresolved.",
    "Joined words already occur in XML names, legal forms, addresses and municipalities. 764 names lack whitespace; the other contains a newline. All addresses, legal-form labels and municipalities lack whitespace; single-word values are not errors for this reason.",
    "CIF: 83 missing and two repeated values in four rows. Groups have different names, registrations, addresses and contacts; G55258909 also has different legal forms. The comparisons do not establish a legal relationship or a source error.",
    "All 765 literal postal codes have five digits; 618 start with zero, lost on int64 inference. Six codes have multiple municipalities and 21 municipalities have multiple codes. VilanovailaGeltrú has 00800 in one row and 08800 in two: a discrepancy for review.",
    "Phones: 221 missing tel_fon and 212 missing tel_fon_m_bil; 40 and 23 cells fail the single nine-digit pattern. Multiline values, extensions, slash notation and prefixes are distinguished; labels do not certify landline/mobile service.",
    "Email: 35 missing. Among populated cells, 76 match the simple pattern, 627 have one @ and no dot in the domain, 25 have multiple @ and two none. Domains are not reconstructed and delivery is not checked.",
    "Web: 154 missing; 56 values repeat schemes such as http://https://. All 611 parsed hostnames lack dots, including cases where the hostname is a parsing artifact of that syntax. Intended domains and availability are not established.",
    "Shared addresses/contacts do not establish duplicates: 10 repeated addresses in 20 rows; 28 repeated phone strings, 10 mobile strings, four email strings and three URLs. The two Yamuna records share all four contacts but differ in CIF, name, legal form and address.",
    "12 rows lack both phones; 11 retain email. One also lacks email and web (registration 392). Of 35 rows without email, 34 have a phone. CIF absence and contact gaps do not coincide; legal-form differences are descriptive, not causal.",
    "Candidate correspondences: registration, name, address, postal code, municipality, contacts and web. Coordinates, explicit description, an Ambito classification, municipality code and province are absent. Legal form does not establish Ambito; en_localidad cannot be completed from explicit XML fields alone."
  ],
  [
    ["Entidad.cod_entidad", "Candidate textual identifier; agree registration representation and cross-source uniqueness. Do not interpret the dot numerically.", "765 unique, complete XML/pandas values; 738 digit-only texts and 27 with a dot followed by three digits. No transformation rule has been applied."],
    ["Entidad.nombre", "Candidate direct correspondence retaining the literal name. Do not reconstruct spaces without evidence.", "765 distinct, complete names; lengths 5–165; 764 without whitespace and one with a newline. Local uniqueness does not establish universal identity."],
    ["Entidad.ambito", "Do not assign Ambito from the name, legal form or membership in the ONGD register.", "No activity/target-population classification establishes enum values. naturalesa describes legal form; Python allows Ambito to be None."],
    ["Entidad.direccion", "Candidate correspondence using original text; addresses are not split or reconstructed here.", "765 values, 755 distinct; lengths 7–66; no whitespace. 10 repeated addresses in 20 rows with different registrations and names."],
    ["Entidad.codigo_postal", "For future integration, use literal XML text compatible with str | None; representation remains pending. Do not guess geographic corrections.", "Every text has five digits; 618 start with zero, lost in int64. 209 distinct codes; 00800/08800 for VilanovailaGeltrú requires review."],
    ["Entidad.longitud", "No source coordinate; do not infer one from address text in this analysis.", "No coordinates or geometries; the attribute allows None."],
    ["Entidad.latitud", "No source coordinate; do not infer one from address text in this analysis.", "No coordinates or geometries; the attribute allows None."],
    ["Entidad.descripcion", "Do not generate a description from the name or legal form.", "No explicit description; the attribute allows None."],
    ["Entidad.contacto", "Agree how the three components and multiple cell values fit into one str | None. No contact selection, joining or splitting is performed here.", "12 rows lack both phones; 11 retain email. One lacks telephone, mobile, email and web. Contacts are shared by distinct records."],
    ["Entidad.url", "Candidate correspondence; review syntax against the earlier source before defining a transformation. Do not guess dots or remove prefixes.", "The legacy report label URL corresponds to url in global_schema.py. 611 values, 154 missing, 56 repeated schemes; no parsed hostname contains dots."],
    ["Localidad.codigo", "Do not use codi_postal as a municipality identifier. There is no explicit source for codigo, the Python attribute name.", "No municipality code. 21 municipalities have several postal codes and six postal codes have multiple municipalities; Localidad.codigo is required."],
    ["Localidad.nombre", "Candidate correspondence with the original label; do not reconstruct spaces or official equivalences without evidence.", "765 complete values and 113 distinct labels. A name alone cannot construct Localidad: codigo and en_provincia are also required."],
    ["Provincia.codigo", "No explicit province code; do not assign provinces using unverified postal prefixes.", "Python requires Provincia.codigo. Literal prefixes were only counted; provinces were neither validated nor derived."],
    ["Provincia.nombre", "No explicit province name; representation and any enrichment remain pending.", "Provincia.nombre is required; no equivalent XML column exists."],
    ["Entidad.en_localidad", "Required relationship remains pending: resolve locality/province codes before constructing Entidad. Do not fabricate incomplete objects.", "municipi only supplies Localidad.nombre. Python requires a Localidad object; the relationship is shown separately from scalar attributes."],
    ["Localidad.en_provincia", "Required relationship without an explicit province; requires an agreed model decision or enrichment.", "global_schema.py requires a Provincia object with codigo and nombre. No province relationship has been inferred."]
  ],
  [
    ["n_mero_registre", "Entity registration identifier", "", "Keep literal XML text. Agree the dot's meaning and cross-source key; do not guess an integer conversion."],
    ["nom_de_l_entitat", "Organisation name", "", "Candidate direct mapping. Keep source spelling; do not insert spaces or reconstruct names without evidence."],
    ["naturalesa", "Legal or organisational nature", "", "Do not equate legal form with Ambito. Decide whether a dedicated model attribute is needed; keep as source data."],
    ["cif_entitat", "Tax identifier reported by the source", "", "No dedicated CIF/NIF attribute. Review missing/repeated groups; do not use as a unique key or merge by CIF."],
    ["adre_a", "Free-text address with joined components", "", "Candidate direct mapping. Preserve text/details; a shared address does not justify merging records."],
    ["codi_postal", "Literal five-digit postal code", "", "The schema expects text. Future integration should use literal XML without numeric inference; do not guess geographic corrections."],
    ["municipi", "Municipality name", "", "Candidate name correspondence. Do not substitute postal code for municipality code or fabricate Provincia relationships."],
    ["tel_fon", "Telephone contact; may include several numbers/extensions", "", "Candidate contact component. Define lossless representation of multiple numbers/extensions; no selection, splitting or cleaning is applied here."],
    ["tel_fon_m_bil", "Second telephone contact, labelled mobile", "", "Candidate contact component; the label does not certify mobile service. Agree handling of multiple values and telephone coincidences."],
    ["correu_electr_nic", "Contact email; some cells include several strings", "", "Candidate contact component. Do not guess dots or split concatenated emails; the pattern does not establish delivery or the intended domain."],
    ["web", "Entity web reference", "", "Candidate Entidad.url correspondence. Keep text and flag dotless domains/repeated schemes; do not reconstruct URLs or check availability here."]
  ],
  Array(12).fill("No explicit activity/target-population category establishes this correspondence. naturalesa is legal form and does not determine Ambito; no inference from name or ONGD registration."),
  [
    ["Identity and registration", "765 unique registrations and names within this file; 27 dotted registrations. CIF is incomplete and repeated in two groups. Valencia describes centres and sources may differ in granularity.", "Agree what Entidad represents, registration meaning and cross-source key; do not automatically link registration, CIF and ni_centro."],
    ["Repeated CIFs", "G10932812 and G55258909 affect four rows with different addresses/contacts; G55258909 also differs in legal form. All four lack web.", "Review against an authorised source whether organisations are related or the source is wrong; do not merge or guess CIF corrections."],
    ["Required locality and province", "Only municipality name is available; municipality code and explicit province are absent. Python requires Entidad.en_localidad and Localidad.en_provincia.", "Agree enrichment or model representation before integration; do not substitute postal code for municipality code or fabricate province relationships."],
    ["Joined words in XML", "Name, legal-form, address and municipality examples match literal XML. Single-word values need no spaces; the cause is unknown.", "Review the earlier document/extraction to establish intended text; preserve originals and do not reconstruct spaces automatically."],
    ["Postal code: type and discrepancies", "618 codes lose a leading zero on numeric inference; six codes have several municipalities. Registration 540 has 00800 in VilanovailaGeltrú; two other municipality rows have 08800.", "Agree textual reading for integration and review geographic associations; do not claim the correct code or guess padding/substitution."],
    ["Email domains and multiple addresses", "627 cells have one @ and a dotless domain; 25 have several @ (nine multiline, 16 without spaces); two have no @. Already present in XML.", "Consult the earlier source for intended domains/contact separation; keep text without guessing inserted dots or splitting."],
    ["URLs and repeated schemes", "56 strings contain several http(s):// schemes; all 611 parsed hostnames lack dots. With repeated schemes, the hostname is an artifact of malformed syntax.", "Confirm the intended URL in the source before defining repairs. Do not equate syntax parsing with site existence or availability."],
    ["Phones and one global contact field", "40 tel_fon and 23 tel_fon_m_bil cells fail the nine-digit pattern: multiline, extension, slash or prefix. One row repeats its phone in both fields.", "Agree lossless representation of telephone, mobile and email in contacto; no values are selected, split or normalised here."],
    ["Shared addresses and contacts", "10 shared addresses in 20 rows; two Yamuna records share all contacts but have different CIFs/legal forms. Phones and websites are also shared across municipalities.", "Investigate possible relationships/shared sites in context; do not deduplicate by isolated matches or even all contacts."],
    ["Joint missingness", "12 rows lack both phones, 11 retain email. Registration 392 lacks telephone, mobile, email and web; 34/35 rows without email retain a phone. CIF absence does not coincide with contact gaps.", "Define availability handling without interpreting absence as inactivity; legal-form percentages do not establish causes."],
    ["Ambito coverage and fields without a source", "No Ambito classification, coordinates or explicit description. CIF/legal form have no dedicated attributes; optional types permit None but have no defaults.", "Agree metadata retention and missing values; do not assign Ambito from legal form or generate description/coordinates without another source."]
  ]
);

// English findings copied from the matching notebook conclusions.
const ieiXmlEnglishFindings = {
  "n_mero_registre": "765 non-null values; all are unique in pandas and as literal XML text. Registration and name are one-to-one in this file. pandas inferred float64: 738 literal values contain digits only; 27 contain a dot followed by three digits, e.g. 1.005. The dot may be a thousands separator; its meaning is unconfirmed. No arithmetic interpretation or correction is applied. No two rows have identical values across all non-identifier fields after excluding registration, name and CIF. Candidate for Entidad.cod_entidad (str). Uniqueness across sources and the final identifier representation remain unresolved.",
  "nom_de_l_entitat": "765 populated, distinct names; lengths 5–165. No leading/trailing whitespace. 764 names contain no whitespace; the remaining name contains a newline. All names match literal XML text. Compound names join words, e.g. AccióSolidàriadelVallès; this can hinder reading and matching. Single-word names need no spaces. Length extremes and endings are displayed for inspection; these checks alone do not establish truncation. Candidate for Entidad.nombre. Observed name uniqueness does not establish a universal entity identifier.",
  "naturalesa": "Complete categorical field: 12 values; Associació 536 rows, Fundació 132. Compound labels lack separating spaces, e.g. AssociacióEstatal. Single-word labels are not anomalous for lacking spaces. Missingness differs descriptively by legal form: CIF is missing in 73/536 associations (13.6%) and 9/132 foundations (6.8%). Mobile is missing in 127/536 (23.7%) and 58/132 (43.9%), respectively. Group sizes and rates are displayed; small categories do not support general conclusions or causal claims. This is legal/organisational nature, not an Ambito. The schema has no dedicated legal-form attribute.",
  "cif_entitat": "682 populated values, 83 missing (10.8%); 680 distinct populated CIFs. All populated strings have nine characters. 681 match the illustrative organisation-ID pattern. 46414697F has a DNI-like shape; neither checksums nor legal identity are validated. Two CIFs repeat, covering four rows. Both groups differ in registration, name, address, postal code, municipality, mobile and email. G55258909 also differs in legal form (Associació / Federació) and telephone availability; G10932812 has Associació in both rows and no telephone in either. Web is missing in all four rows. The full-field comparison does not establish whether these are related organisations or source errors. Shared CIF alone does not justify merging. Incomplete and non-unique as a row key; no dedicated CIF/NIF attribute exists in the schema.",
  "adre_a": "765 populated addresses, 755 distinct; lengths 7–66. None contains whitespace. Words and components appear joined, e.g. PladelVinyet,9BlocDbaixos; punctuation and component separation vary. This is literal XML text. 10 addresses repeat twice (20 rows). Each pair shares its municipality and postal code but has different registrations and names. Seven pairs contain two distinct known CIFs; in three pairs one CIF is missing. All remaining fields are compared in the displayed tables. Shared address does not establish duplicate entities. Candidate for Entidad.direccion; no components are parsed into a corrected address.",
  "codi_postal": "765 complete values; 209 distinct. Every literal XML value has five digits; 618 start with zero. pandas inferred int64, losing leading zeros in the loaded representation. Literal 00800 appears as 800 in registration 540; its geographic correctness is unverified. Six postal codes occur with multiple municipality labels: 08197, 08227, 08293, 08330, 08902, 08930. Full address/name context is displayed for review. 21 municipality labels have multiple postal codes. These relationships are not one-to-one and alone do not prove errors. Candidate for Entidad.codigo_postal (str | None), not Localidad.codigo. No zeros are restored and no codes are changed.",
  "municipi": "765 populated values; 113 distinct labels. Barcelona occurs 428 times. No values contain whitespace. Compound labels such as SantCugatdelVallès join words; single-word labels such as Barcelona are not problematic for that reason. Length extremes, postal-code multiplicity and literal postal-prefix multiplicity are displayed; prefixes are not assigned to provinces. 112 municipality labels occur with one literal postal prefix; VilanovailaGeltrú occurs with two: 00 (one row, 00800) and 08 (two rows, 08800). This is an internal discrepancy for review; the correct postal code is not established here. Candidate for Localidad.nombre via Entidad.en_localidad. Locality code, province code/name and explicit province relationship are absent. Geographic correctness and equivalence to official municipality labels are not established.",
  "tel_fon": "544 populated strings, 221 missing (28.9%); 510 distinct populated strings. 504 contain exactly nine digits. The other 40 are: 34 multiline, 4 single-line extensions, 1 single-line slash notation and 1 single-line country prefix. Categories are exclusive, with multiline taking priority. 26 multiline cells contain exactly two bare nine-digit lines. Other lines include spaces, slash notation, an extension or an eight-digit second line; verbatim examples are displayed. Of the 504 single nine-digit strings, 22 start with 6. The column name does not guarantee landline service; format checks do not establish number validity. 28 exact strings repeat across 62 rows; 27 groups have multiple address strings and 3 span multiple municipality labels. Sharing a number is not evidence of entity identity. Candidate contact component for Entidad.contacto; source cells are not split or rewritten.",
  "tel_fon_m_bil": "553 populated strings, 212 missing (27.7%); 543 distinct populated strings. 530 contain exactly nine digits; 23 are multiline. Of those 23, 22 contain two bare nine-digit lines and one includes a +34 prefix on its second line. Eight single nine-digit strings start with 9; mobile service is not established by the column label. 10 exact strings repeat across 20 rows; all groups have different addresses and 4 span multiple municipality labels. Both phone fields are missing in 12 rows. One row has equal populated values in both fields; three two-row groups share the same populated phone pair but have different CIFs. Candidate component for Entidad.contacto; no telephone selection or splitting rule is applied.",
  "correu_electr_nic": "730 populated strings, 35 missing (4.6%); 726 distinct populated strings. Exclusive whole-cell categories: 76 match the simple single-address pattern, 627 have one @ and no dot in the domain, 25 have multiple @, and 2 have no @. The 627 domain cases include acciosolidariavalles@gmailcom. Separately, 650 whole cells contain no dot anywhere; the two counts measure different properties. Of the 25 multiple-@ cells, 9 contain newlines and 16 lack whitespace. Zero-@ values are sakadawaorggmailcom and infoarrobaproinfantsorg. These forms are already in XML. Four exact strings repeat across eight rows; each pair has different names and address strings. Three pairs have two different known CIFs; one pair has a missing CIF. One pair spans two municipalities. Pattern failure does not establish deliverability or the intended address. Candidate for Entidad.contacto; no dots or separators are inserted.",
  "web": "611 populated strings, 154 missing (20.1%); 607 distinct populated strings. 56 cells contain repeated scheme text, such as http://https://cecodees/. For these, urlsplit reports https or http as hostname; that result is a parsing artifact of the source syntax. All 611 parsed hostnames lack dots; this includes the repeated-scheme cases. Ordinary examples such as http://wwwigmancat also lack a dot in the literal host text. These observations do not establish the intended domains. Three exact URL strings repeat across seven rows. Quepo and Yamuna pairs have different known CIFs; http://wwwsolidariesorg spans three names and two municipalities, with one CIF missing. Two Yamuna records share all four populated contact fields but have different registrations, names, CIFs, legal forms and address strings. This supports review for a possible relationship, not automatic merging. Candidate for Entidad.url; no scheme/domain repair, DNS lookup or availability check is performed."
};
for (const [field, findings] of Object.entries(ieiXmlEnglishFindings)) {
  window.IEI_EN.catalunya_ongd.inventario[field].hallazgos = findings;
}
