"""Create the combined mapping from the original Word template and project evidence."""
from pathlib import Path
from copy import deepcopy
import collections
import csv
import dataclasses
import importlib.util
import json
import re
import sys
import xml.etree.ElementTree as ET
import zipfile

BASE = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent
evidence = json.loads((OUT / 'project-evidence.json').read_text(encoding='utf-8'))
sources = evidence['IEI_DATA']['fuentes']
comparison = evidence['IEI_COMPARISON']
tags = {'valencia': 'CV', 'canarias': 'CAN', 'catalunya_ongd': 'CAT'}
bytag = {tags[s['id']]: s for s in sources}
canonical = lambda s: s.replace('Entidad.URL', 'Entidad.url').replace('Localidad.código', 'Localidad.codigo').replace('Provincia.código', 'Provincia.codigo')
keyof = lambda r: canonical(r['objeto'] + '.' + r['campo'])
mappings = {tags[s['id']]: {keyof(r): r for r in s['mapeoGlobal']} for s in sources}
inventory = {tags[s['id']]: {r['campo']: r for r in s['inventario']} for s in sources}

spec = importlib.util.spec_from_file_location('mapping_schema', BASE / 'data/global_schema.py')
schema = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = schema
spec.loader.exec_module(schema)
enum = [x.value for x in schema.Ambito]
schema_keys = [c.__name__ + '.' + f.name for c in (schema.Entidad, schema.Localidad, schema.Provincia) for f in dataclasses.fields(c)]
assert schema_keys == [keyof(f) for f in comparison['fields']]
assert enum == evidence['IEI_DATA']['esquemaGlobal']['Ambito']

cv_rows = list(csv.DictReader((BASE / 'data/entidades_CV.csv').open(encoding='utf-8-sig', newline='')))
can_rows = json.loads((BASE / 'data/datos-abiertos-csv-segundo-trimestre26.json').read_text(encoding='utf-8'))
xml_rows = ET.parse(BASE / 'data/Entitats_ONGD_pretty.xml').getroot()
assert [len(cv_rows), len(can_rows), len(xml_rows)] == [s['registros'] for s in sources]
assert [len(cv_rows[0]), len(can_rows[0]), len(xml_rows[0])] == [s['campos'] for s in sources]
cv_counts = collections.Counter(r['sector'] for r in cv_rows)
can_counts = collections.Counter(r['area_nombre'] for r in can_rows)
subnames = {r['subarea_id']: r['subarea_nombre'] for r in can_rows if r['subarea_id'] != '_U'}
subcounts = collections.Counter((r['area_nombre'], r['subarea_id']) for r in can_rows)

def blocks(values):
    return '\n\n'.join(f'{tag}: {values[tag]}' for tag in ('CV', 'CAN', 'CAT'))

def observations(tag, fields):
    return '\n'.join(f"{name}: {inventory[tag][name]['hallazgos']}" for name in fields)

rows = []

def add(key, origins, transforms, comments):
    short = {'Entidad': 'E', 'Localidad': 'L', 'Provincia': 'P'}
    obj, field = key.split('.')
    rows.append({'key': key, 'global': short[obj] + '.' + field,
                 'origen': blocks(origins), 'transformaciones': blocks(transforms),
                 'comentarios': blocks(comments)})

add('Entidad.cod_entidad',
    {'CV': 'ni_centro; id solo para trazabilidad de fila.',
     'CAN': 'nif (candidato si Entidad representa una organización); numero_registro como identificador registral auxiliar.',
     'CAT': 'n_mero_registre (candidato registral); cif_entitat como metadato fiscal auxiliar.'},
    {'CV': 'Convertir cada ni_centro no ausente, matemáticamente entero, de float a texto sin sufijo decimal. Acordar tratamiento de los 32 códigos ausentes; no sustituir automáticamente por id.',
     'CAN': 'Preservar nif y numero_registro como texto. Seleccionar la clave tras acordar si Entidad representa organización, centro, sede o registro; conservar trazabilidad y multiplicidad de inscripciones.',
     'CAT': 'Leer el registro literal como texto, incluidos los puntos. No convertir 1.005 en magnitud numérica ni quitar el punto sin confirmar su significado. Conservar CIF por separado; no usarlo como clave completa ni fusionar por coincidencia.'},
    {'CV': observations('CV', ['ni_centro', 'id']) + '\nLos códigos repetidos pueden aportar distintos sectores o tipos de servicio. Los 32 registros sin ni_centro tampoco tienen max ni pobtotal y presentan clasificacion = SIN RESOLUCIÓN. Campo global str obligatorio: decidir cuarentena, clave sustituta documentada o representación técnica separada.',
     'CAN': observations('CAN', ['nif', 'numero_registro']) + '\nCada NIF tiene una denominación y cada registro un NIF/nombre; 741 NIF tienen una inscripción y cuatro tienen dos. No eliminar filas por NIF o registro: pueden aportar sedes, direcciones, áreas y subáreas distintas.',
     'CAT': observations('CAT', ['n_mero_registre', 'cif_entitat']) + '\nUnicidad local no acredita identidad entre fuentes. Ambos grupos de CIF repetido difieren también en código postal, municipio, móvil y correo; no se determina relación jurídica o error. Conclusión conjunta: CV describe centros; CAN y CAT describen organizaciones/inscripciones. No equiparar automáticamente ni_centro, nif, CIF y registros ni completar huecos entre fuentes sin clave y granularidad acordadas.'})

add('Entidad.nombre',
    {'CV': 'nombre', 'CAN': 'denominacion', 'CAT': 'nom_de_l_entitat'},
    {'CV': 'Copiar el nombre original. Normalizar espacios únicamente si fuera necesario y conservar la grafía de origen.',
     'CAN': 'Copiar el original; señalar posibles truncamientos y erratas. Corregir solo con evidencia de la fuente.',
     'CAT': 'Copiar el nombre literal. No reconstruir espacios ni completar palabras por conjetura.'},
    {'CV': observations('CV', ['nombre']) + '\nNo hay filas completamente duplicadas al excluir id. Un mismo nombre puede corresponder a centros diferentes; no usar nombre como clave.',
     'CAN': observations('CAN', ['denominacion']) + '\nFrecuencia máxima: siete filas. Longitudes sospechosas en índices 157/319/457: 99/100/100, también en JSON; hay nombres de hasta 124, por lo que no se establece un límite universal de 100. Nombre–NIF uno a uno en este archivo, nombre–registro uno a varios.',
     'CAT': observations('CAT', ['nom_de_l_entitat']) + '\nNo se demuestra truncamiento mediante longitudes/extremos. Campo global str obligatorio; unicidad en un archivo no garantiza identidad universal.'})

common_ambito = (
    'Criterio común para las 12 filas de Ambito: el esquema Python acepta un único Ambito | None. '
    'CV tiene 12 centros con varios sectores (10 con dos y dos con tres); CAN tiene 729 NIF con un área, '
    '14 con dos, uno con tres y uno con cinco. Sus 33 grupos NIF–área con varias subáreas se distribuyen '
    'en 29 con dos, tres con tres y uno con seis (otros 341 tienen una). Acordar representación sin pérdida '
    'o ampliación del modelo; no seleccionar un ámbito arbitrario ni confundir múltiples filas con duplicados. '
    'CAN: nueve áreas con correspondencia código–nombre uno a uno; 16 subáreas conocidas, 394 marcadores _U. '
    'Los códigos 1–7 pertenecen a Voluntariado y A–I a Varios; _U no es categoría. '
    'Varios/ I = Otros, C = Asociación De Igualdad Lgtbi, F = Asocaciones Relacionadas Con Ciencia Tecnología '
    'Investigación E Innovación Medio Ambiente Ecología Patrimonio HistóricO-Cultural, '
    'G = Asociaciones De Trabajadores Empresarios Sindicatos Colegios Profesionales Universidades: '
    'no tienen equivalencia cerrada documentada; preservar estas subáreas y las restantes mixtas sin forzarlas al enum.'
)
can_specs = {
    'MAYORES': ('Tercera Edad', None),
    'DISCAPACIDAD': ('Discapacidad', None),
    'SALUD_MENTAL': (None, None),
    'INFANCIA_Y_JUVENTUD': ('Menores Y Juventud', None),
    'MUJER': ('Mujer', None),
    'MIGRACION': ('Varios', ['D']),
    'INCLUSION_SOCIAL': ('Exclusión Social', None),
    'EDUCACION_Y_FORMACION': ('Voluntariado', ['4']),
    'EMPLEO_E_INSERCION_LABORAL': ('Varios', ['B']),
    'SALUD_Y_ATENCION_SOCIOSANITARIA': ('Varios', ['H']),
    'VOLUNTARIADO_Y_PARTICIPACION_COMUNITARIA': ('Voluntariado', None),
    'CULTURA_Y_DESARROLLO_COMUNITARIO': ('Varios', ['A', 'E'])
}
for value in enum:
    cv = next(a for a in bytag['CV']['ambitos'] if a['global'] == value)
    can = next(a for a in bytag['CAN']['ambitos'] if a['global'] == value)
    area, subids = can_specs[value]
    cv_origin = f'sector = "{cv["origen"]}"' if cv['origen'] != '—' else '—; ningún sector equivalente identificado.'
    if area is None:
        can_origin = '—; ninguna categoría explícita equivalente.'
    elif subids:
        can_origin = f'area_nombre = "{area}"; ' + '; '.join(f'subarea_id = "{sid}", subarea_nombre = "{subnames[sid]}"' for sid in subids)
    else:
        can_origin = f'area_nombre = "{area}" (area_id auxiliar).'
    if value == 'EMPLEO_E_INSERCION_LABORAL':
        can_origin += ' Candidato adicional: area_nombre = "Centros Ocupacionales".'
    if value == 'SALUD_Y_ATENCION_SOCIOSANITARIA':
        can_origin += f' Candidatos adicionales: area_nombre = "Drogodependencia"; Voluntariado / subarea_id = "3", subarea_nombre = "{subnames["3"]}".'
    if value == 'CULTURA_Y_DESARROLLO_COMUNITARIO':
        can_origin += f' Candidato adicional: Voluntariado / subarea_id = "4", subarea_nombre = "{subnames["4"]}".'
    cv_rule = f'Mapear la categoría explícita a {value}.' if cv['estado'] == 'Mapeado' else 'Sin correspondencia; conservar ausencia de dato para este valor.'
    if can['estado'] == 'Mapeado':
        can_rule = f'Equivalencia semántica propuesta: mapear "{area}" a {value}; conservar otros ámbitos y detalle de subáreas.'
    elif can['estado'] == 'Revisar':
        can_rule = f'Correspondencia candidata, pendiente de revisión semántica para {value}. Usar la pareja área–subárea, sin asignar por el área genérica sola.'
    else:
        can_rule = 'Sin equivalencia explícita; no inferir SALUD_MENTAL de Drogodependencia.'
    if value == 'MIGRACION':
        can_rule = 'Usar solo la subárea explícita Varios / D = Migración; equivalencia propuesta pendiente de revisión. No aplicar MIGRACION a todo Varios.'
    if value == 'EMPLEO_E_INSERCION_LABORAL':
        can_rule += ' No equiparar todo centro ocupacional con inserción laboral ni todo Varios / B con empleo.'
    cv_comment = cv['nota']
    if cv['origen'] != '—':
        cv_comment += f' {cv_counts[cv["origen"]]} filas con esta categoría (no centros únicos).'
    if value == 'MAYORES':
        cv_comment += ' Usar sector, no clasificacion: coinciden en 1665 filas; en las otras 32 clasificacion = SIN RESOLUCIÓN pero sector sigue informado.'
    can_comment = can['nota']
    if area and not subids:
        can_comment += f' {can_counts[area]} filas en el área (no organizaciones únicas).'
    elif area and subids:
        can_comment += ' Filas por subárea: ' + ', '.join(f'{area}/{sid}: {subcounts[(area, sid)]}' for sid in subids) + '.'
    if value == 'EMPLEO_E_INSERCION_LABORAL':
        can_comment += ' Centros Ocupacionales: una fila. B combina comedores, casas hogar, comunidades religiosas, talleres, desarrollo/inserción social y fomento/empleo.'
    if value == 'SALUD_Y_ATENCION_SOCIOSANITARIA':
        can_comment += ' Drogodependencia: dos filas; Voluntariado/3: ocho. Sus alcances son distintos; validar antes de agrupar.'
    if value == 'EDUCACION_Y_FORMACION':
        can_comment += ' La subárea 4 no es exclusivamente educativa: ciencia, cultura, deportes y patrimonio se solapan con otros valores globales.'
    if value == 'CULTURA_Y_DESARROLLO_COMUNITARIO':
        can_comment += ' Voluntariado/4: 20 filas. A incluye jóvenes y E incluye deporte y aspectos socioeducativos; ninguna equivalencia es exclusiva.'
    if value == 'VOLUNTARIADO_Y_PARTICIPACION_COMUNITARIA':
        can_comment += ' Las subáreas 1–7 conservan cooperación/solidaridad internacional, servicios sociales, asuntos sanitarios, educación/ciencia/cultura/deportes/patrimonio, medio ambiente/medio rural, protección civil y otros campos de voluntariado. No perder ese detalle al mapear el área.'
    if value == 'MAYORES':
        can_comment += '\n' + common_ambito
    rows.append({'key': 'Entidad.ambito', 'ambito': value, 'global': f'E.ambito = "{value}"',
                 'origen': blocks({'CV': cv_origin, 'CAN': can_origin, 'CAT': '—; no hay categoría explícita de actividad o población destinataria.'}),
                 'transformaciones': blocks({'CV': cv_rule, 'CAN': can_rule, 'CAT': 'Sin correspondencia: no inferir este valor del nombre, de naturalesa ni de pertenecer al registro ONGD. Ambito puede conservarse como None.'}),
                 'comentarios': blocks({'CV': cv_comment, 'CAN': can_comment, 'CAT': 'naturalesa representa forma jurídica/organizativa, no ámbito de actuación; no existe evidencia para asignar este valor del enum.'})})

add('Entidad.direccion',
    {'CV': 'domici', 'CAN': 'direccion_tipo_via + direccion_nombre_via + direccion_numero + direccion_complemento', 'CAT': 'adre_a'},
    {'CV': 'Copiar texto libre. Normalización opcional y documentada de abreviaturas; preservar original.',
     'CAN': 'Componer solo tras revisar componentes ya incluidos en direccion_nombre_via, para evitar repetir tipo/número. Mantener números, letras, rangos, S/n y detalles como texto. Acordar tratamiento de _U, Null y - - - -; normalizar espacios sin perder información. Definir representación de varias sedes/direcciones por NIF.',
     'CAT': 'Copiar texto literal; no reconstruir espacios ni separar componentes sin evidencia de la fuente anterior.'},
    {'CV': observations('CV', ['domici']) + '\nLongitudes 6–84; sin espacios de borde ni vacíos tras strip. Dirección global str obligatoria: los ocho ausentes necesitan una política explícita.',
     'CAN': observations('CAN', ['direccion_tipo_via', 'direccion_nombre_via', 'direccion_numero', 'direccion_complemento']) + '\nSin nulos técnicos en los componentes, pero los marcadores pueden ser ausencias semánticas. _U no tiene significado exacto confirmado. Una organización puede tener varias direcciones; no escoger una arbitrariamente.',
     'CAT': observations('CAT', ['adre_a']) + '\nEl original XML ya contiene las palabras concatenadas; no se ha establecido la causa. Siete parejas de dirección compartida tienen CIF distintos y en tres falta uno; no deduplicar por dirección.'})

add('Entidad.codigo_postal',
    {'CV': '—', 'CAN': '—', 'CAT': 'codi_postal'},
    {'CV': 'Sin campo; conservar None salvo enriquecimiento acordado.', 'CAN': 'Sin campo; conservar None. No usar direccion_municipio_id como código postal.',
     'CAT': 'Tomar el texto literal de cinco dígitos del XML como str, conservando ceros iniciales. Evitar inferencia int64. Revisar discrepancias con evidencia; no reemplazar 00800 por 08800 por conjetura.'},
    {'CV': 'No hay código postal en la fuente.', 'CAN': 'No hay campo equivalente identificado. El código municipal no es postal.',
     'CAT': observations('CAT', ['codi_postal']) + '\nEl registro 540 tiene 00800, frente a 08800 en otras dos filas de VilanovailaGeltrú: revisión pendiente, sin establecer el código correcto. Global str | None.'})

for axis in ('longitud', 'latitud'):
    add('Entidad.' + axis,
        {'CV': 'x_25830 + y_25830; WKT auxiliar con el mismo punto.', 'CAN': '—', 'CAT': '—'},
        {'CV': f'Transformar el punto de EPSG:25830 al CRS geográfico acordado (habitualmente EPSG:4326) y tomar la {axis} resultante como float. Confirmar primero CRS objetivo y orden de ejes; no copiar X/Y proyectadas directamente.',
         'CAN': 'Sin coordenada de origen; conservar None. Cualquier geocodificación requeriría una etapa de enriquecimiento acordada.',
         'CAT': 'Sin coordenada de origen; conservar None. No presentar geocodificación externa desde adre_a/municipi como dato ya obtenido.'},
        {'CV': 'Los 1697 puntos WKT coinciden exactamente con x_25830/y_25830. WKT no añade información ni necesita destino global propio. El esquema define float | None pero no especifica CRS; la conversión es una regla propuesta, no ejecutada.',
         'CAN': 'No hay coordenadas ni geometría equivalentes en los 20 campos. Las direcciones y localidades requieren revisión antes de cualquier enriquecimiento geográfico.',
         'CAT': 'No hay coordenadas ni geometrías en los 11 campos. Dirección y municipio concatenados no acreditan ubicación geográfica precisa.'})

add('Entidad.descripcion',
    {'CV': '—; tipo_centro, entidad, leyenda y max son metadatos distintos.', 'CAN': '—; áreas/subáreas e isla son metadatos distintos.', 'CAT': '—; naturalesa es naturaleza jurídica.'},
    {'CV': 'Sin descripción libre de origen; conservar None. Mantener metadatos sin destino por separado o ampliar el modelo.',
     'CAN': 'Sin descripción libre; conservar None. No convertir automáticamente categorías de actividad o isla en descripción.',
     'CAT': 'Sin descripción explícita; conservar None. No generarla a partir del nombre o de naturalesa.'},
    {'CV': observations('CV', ['tipo_centro', 'entidad', 'leyenda', 'max', 'f_resolu']) + '\ntipo_centro tiene 64 categorías; 1636 centros tienen un tipo y nueve varios (seis con dos, uno con tres, uno con cuatro y uno con siete). entidad representa al responsable, no al centro; dos nombres se asocian a más de una entidad y corresponden a centros distintos. max: 147 valores, 395 ceros; significado de capacidad/plazas no confirmado. f_resolu: 1574 fechas parseables, 123 ausentes, 1562 a medianoche y 12 con hora en 2026; intervalo 1977-12-31–2026-08-04. No reducir a DATE sin confirmar significado. Estos atributos no tienen destinos propios en el esquema actual.',
     'CAN': 'No existe campo descriptivo explícito. Área y subárea determinan candidatos para Ambito; direccion_isla_id/nombre y numero_registro carecen de atributos dedicados y deben conservarse como metadatos, sin sustituir semánticamente descripcion.',
     'CAT': observations('CAT', ['naturalesa']) + '\nNo hay atributo jurídico dedicado. Asociaciones: 536; fundaciones: 132. CIF ausente en 73/536 asociaciones y 9/132 fundaciones; móvil ausente en 127/536 y 58/132. Son observaciones descriptivas: grupos pequeños y porcentajes no justifican causas. Forma jurídica no equivale a descripción libre ni a Ambito. Global str | None.'})

add('Entidad.contacto',
    {'CV': 'telefono + email', 'CAN': 'telefono_1 + telefono_2; pagina_web solo aporta correo si el contenido se clasifica y se acuerda su reubicación.', 'CAT': 'tel_fon + tel_fon_m_bil + correu_electr_nic'},
    {'CV': 'Normalizar componentes por separado, preservando originales. Revisar 0 y zero@gva.es como posibles marcadores; convertirlos a ausencia solo tras confirmar significado. Detectar múltiples teléfonos/correos y conservarlos con una representación documentada. Validar sintaxis y longitudes; normalización de correo según política acordada.',
     'CAN': 'Mantener teléfonos como texto, tratar _U según semántica confirmada y revisar anomalías. Evitar repetir dentro de contacto los dos números idénticos sin eliminar la fila. Clasificar correos en pagina_web antes de una reubicación aprobada. Definir representación de varios componentes.',
     'CAT': 'Conservar los tres componentes y originales; acordar representación sin pérdida de números, extensiones, prefijos y correos múltiples dentro del único texto contacto. No insertar puntos en dominios ni separar correos concatenados por conjetura. Los rótulos no garantizan teléfono fijo o móvil.'},
    {'CV': observations('CV', ['telefono', 'email']) + '\nTeléfono: 1604 textos de nueve caracteres; anomalías de 10/8/3 dígitos y varios números en una celda (p. ej. 964360002; 964367054). Email: tres valores con espacios de borde y 17 fuera del patrón básico. El formato no acredita entrega ni existencia.',
     'CAN': observations('CAN', ['telefono_1', 'telefono_2']) + '\ntelefono_1 tiene un valor por cada uno de los 745 NIF; telefono_2 informado, por 172 NIF. 803/810 primeros y 183/185 segundos cumplen (34)+nueve dígitos. Un patrón sintáctico no demuestra validez del contacto.',
     'CAT': observations('CAT', ['tel_fon', 'tel_fon_m_bil', 'correu_electr_nic']) + '\nDetalle telefónico: tel_fon tiene 34 casos multilínea, cuatro con extensión, uno con barra y uno internacional (categorías excluyentes); 26 multilínea tienen dos líneas de nueve dígitos. tel_fon_m_bil tiene 22 multilínea con dos números de nueve dígitos y uno con +34 en la segunda línea. 22 números de tel_fon comienzan por 6 y ocho del campo móvil por 9. Una fila repite número en ambos campos; tres parejas de filas comparten pareja telefónica pero tienen CIF distintos. Correo: las 25 celdas con varias @ son nueve multilínea y 16 sin espacios; 650 celdas sin ningún punto es una medida diferente de las 627 con una @ y dominio sin punto. Sin @: sakadawaorggmailcom e infoarrobaproinfantsorg; no reconstruir el destino previsto. De 12 filas sin ambos teléfonos, 11 conservan correo; el registro 392 carece además de correo/web. De 35 sin correo, 34 conservan teléfono. La ausencia de CIF no coincide con contactos incompletos. Compartir teléfonos/correos no demuestra identidad. Global contacto es un único str | None y no prescribe cómo serializar estos componentes.'})

add('Entidad.url',
    {'CV': '—', 'CAN': 'pagina_web', 'CAT': 'web'},
    {'CV': 'Sin campo; conservar None salvo enriquecimiento acordado.',
     'CAN': 'Clasificar URL, email y texto descriptivo; tratar _U y revisar espacios internos/protocolos. No adivinar dominios ni aplicar una corrección general. Mantener contenido original y definir destino del contenido no URL.',
     'CAT': 'Correspondencia candidata: preservar texto y marcar esquemas repetidos/host sin puntos. Reparar solo tras confirmar URL prevista con la fuente; no reconstruir dominios por conjetura.'},
    {'CV': 'La fuente no contiene URL ni web.', 'CAN': observations('CAN', ['pagina_web']) + '\nUn valor informado por cada uno de 172 NIF. hhtps://, correos y texto en el mismo campo impiden considerarlo URL validada.',
     'CAT': observations('CAT', ['web']) + '\nLos dos registros Yamuna comparten teléfono, móvil, correo y web, pero difieren en registro, nombre, CIF, naturaleza y dirección. Quepo/Yamuna tienen CIF conocidos distintos; wwwsolidariesorg abarca tres nombres y dos municipios con un CIF ausente. La coincidencia no justifica fusionar. No se ha comprobado DNS, existencia o disponibilidad en ninguna fuente. El nombre canónico de Python es url (URL en el informe anterior); str | None.'})

add('Entidad.en_localidad',
    {'CV': 'cod_ine_mun + municipio + provincia', 'CAN': 'direccion_municipio_id + direccion_municipio_nombre + direccion_provincia_id + direccion_provincia_nombre', 'CAT': 'municipi; codi_postal solo como contexto de revisión, no como código municipal.'},
    {'CV': 'Construir Localidad con cod_ine_mun textual de cinco caracteres, municipio y el objeto Provincia derivado según L.en_provincia. Asociar cada entidad a ese objeto; no es una unión entre fuentes.',
     'CAN': 'Construcción candidata de Localidad/Provincia tras validar códigos y resolver marcadores. Definir representación de varias sedes/localidades por organización; tratar las ocho filas incompletas mediante enriquecimiento, cuarentena o cambio de modelo acordado.',
     'CAT': 'No se puede construir el objeto obligatorio completo solo con campos explícitos. Usar municipi como candidato de nombre; obtener código municipal y Provincia únicamente mediante enriquecimiento verificado y acordado.'},
    {'CV': '333 códigos y 333 municipios, relación uno a uno, completos; provincias consistentes. La construcción reúne campos de CV y no fusiona registros.',
     'CAN': '90 códigos, 83 nombres conocidos y siete códigos sin nombre en ocho filas; esas ocho tampoco tienen provincia conocida. Codificación municipal no validada. No tomar _U como localidad ni escoger arbitrariamente una sede. Isla aporta contexto: ' + observations('CAN', ['direccion_isla_id', 'direccion_isla_nombre']),
     'CAT': 'Solo hay nombre municipal: faltan Localidad.codigo y Provincia.codigo/nombre, y no existe relación provincial explícita. Python exige en_localidad: Localidad, sin None ni valor por defecto. El postal no sustituye código municipal; no fabricar objetos completos ni relaciones provinciales.'})

add('Localidad.codigo',
    {'CV': 'cod_ine_mun', 'CAN': 'direccion_municipio_id', 'CAT': '—; municipi solo sería apoyo para un catálogo externo.'},
    {'CV': 'Convertir a texto de cinco caracteres y completar el cero inicial según la codificación INE identificada.',
     'CAN': 'Convertir identificador de origen a texto para codigo. Validar su sistema de codificación antes de rellenar ceros, equipararlo al INE o cruzarlo con otras fuentes.',
     'CAT': 'Sin código municipal explícito. Enriquecimiento externo pendiente; no usar codi_postal como código de localidad.'},
    {'CV': observations('CV', ['cod_ine_mun']) + '\n1208 valores tienen cinco dígitos y 489 cuatro; los 333 códigos corresponden uno a uno con municipio. Identificador, no magnitud.',
     'CAN': observations('CAN', ['direccion_municipio_id']) + '\nEl JSON literal almacena identificadores como texto; int64 es la inferencia del notebook. No se confirmó equivalencia con códigos INE. Siete códigos no tienen nombre recuperable en esta fuente.',
     'CAT': 'Solo hay municipi y código postal. Se necesita correspondencia municipal oficial verificada; nombres concatenados y asociaciones postales requieren revisión. Global codigo: str obligatorio.'})

add('Localidad.nombre',
    {'CV': 'municipio', 'CAN': 'direccion_municipio_nombre', 'CAT': 'municipi'},
    {'CV': 'Copiar el nombre municipal; conservar nombres bilingües y acordar política de normalización sin pérdida.',
     'CAN': 'Copiar nombres conocidos. Resolver _U como marcador antes de construir la relación obligatoria; no tratarlo como nombre de un único municipio.',
     'CAT': 'Copiar texto original como candidato; no reconstruir espacios ni afirmar equivalencia oficial sin evidencia.'},
    {'CV': observations('CV', ['municipio']) + '\nSin espacios de borde; nombres de 3–47 caracteres. Los nombres bilingües largos son plausibles y no se consideran automáticamente anomalías.',
     'CAN': observations('CAN', ['direccion_municipio_nombre']) + '\n83 nombres conocidos corresponden uno a uno con código; _U agrupa siete códigos y ocho filas. Esos códigos tampoco tienen provincia conocida en el archivo.',
     'CAT': observations('CAT', ['municipi']) + '\n112 municipios tienen un prefijo postal literal; VilanovailaGeltrú tiene 00 (una fila con 00800) y 08 (dos con 08800). Discrepancia interna, sin establecer código correcto ni asignar provincia. Global nombre: str obligatorio.'})

add('Localidad.en_provincia',
    {'CV': 'cod_ine_mun + provincia', 'CAN': 'direccion_provincia_id + direccion_provincia_nombre', 'CAT': '—; no hay provincia explícita.'},
    {'CV': 'Construir Provincia tomando los dos primeros dígitos de cod_ine_mun previamente normalizado a cinco caracteres y copiando provincia. Asociar la localidad al objeto resultante.',
     'CAN': 'Construcción candidata de Provincia con código textual y nombre conocido. Resolver _U e incompletitud antes de asignar la relación obligatoria.',
     'CAT': 'No construir Provincia desde una suposición o prefijo postal no validado. Acordar enriquecimiento verificado o representación alternativa del modelo.'},
    {'CV': 'Coherencia observada: 03 → Alacant/Alicante; 12 → Castelló/Castellón; 46 → València/Valencia. Las 33 comarcas pertenecen a una provincia y cada municipio a una comarca.',
     'CAN': 'Código–nombre provincial uno a uno entre 12 provincias conocidas; ocho filas tienen _U en ambos campos. Ninguna provincia conocida se puede recuperar para los siete códigos municipales afectados usando este archivo solo.',
     'CAT': 'Faltan código/nombre provincial y relación explícita. codi_postal y municipi pueden aportar contexto para revisión, pero no completan la relación. Global en_provincia: Provincia obligatorio, sin None ni valor por defecto.'})

add('Provincia.codigo',
    {'CV': 'cod_ine_mun', 'CAN': 'direccion_provincia_id', 'CAT': '—'},
    {'CV': 'Normalizar código municipal a texto de cinco caracteres y extraer los dos primeros.',
     'CAN': 'Preservar código textual y ceros iniciales (p. ej. 06). Validar sistema y tratar _U antes de integrar.',
     'CAT': 'Sin campo provincial explícito; no derivar un código definitivo del prefijo postal sin validación externa.'},
    {'CV': '03, 12 y 46 son coherentes con provincia en los 1697 registros. cod_ine_mun representa municipio; su prefijo proporciona el candidato provincial documentado.',
     'CAN': observations('CAN', ['direccion_provincia_id']) + '\nCódigos y nombres provinciales tienen correspondencia uno a uno; _U no es un código válido conocido.',
     'CAT': 'Los códigos postales tienen discrepancias como 00800/08800 en el mismo municipi; no acreditar provincia mediante esos prefijos. Global codigo: str obligatorio.'})

add('Provincia.nombre',
    {'CV': 'provincia', 'CAN': 'direccion_provincia_nombre', 'CAT': '—'},
    {'CV': 'Copiar nombre bilingüe original; acordar posterior normalización valenciano/castellano.',
     'CAN': 'Copiar nombres conocidos; resolver _U y validar antes de construir Provincia y Localidad.en_provincia.',
     'CAT': 'Sin campo explícito; cualquier correspondencia municipal/provincial requiere enriquecimiento verificado.'},
    {'CV': observations('CV', ['provincia', 'comarca', 'pobtotal']) + '\nAlacant/Alicante: 489 filas; Castelló/Castellón: 324; València/Valencia: 884. Coherencia interna con INE/comarca no sustituye una validación geográfica externa. comarca y pobtotal son metadatos territoriales sin atributo propio; pobtotal pertenece a localidad, no a Entidad.',
     'CAN': observations('CAN', ['direccion_provincia_nombre']) + '\nSin espacios de borde, vacíos ni nulos técnicos; los marcadores representan incompletitud semántica por revisar.',
     'CAT': 'No hay nombre provincial ni relación provincial explícita. No inventar provincia a partir del nombre o de la pertenencia al registro catalán. Global nombre: str obligatorio.'})

audited_path = OUT / 'audited-mapping.json'
audited = audited_path.exists()
if audited:
    rows = json.loads(audited_path.read_text(encoding='utf-8'))
document_output = OUT / ('Mappings_CV_CAN_CAT_Consolidado_Auditado.docx' if audited else 'Mappings_CV_CAN_CAT_Consolidado.docx')

assert len(rows) == 27
assert [r['ambito'] for r in rows if 'ambito' in r] == enum
assert set(r['key'] for r in rows) == set(schema_keys)
assert all(all(r[c].strip() for c in ('global', 'origen', 'transformaciones', 'comentarios')) for r in rows)
(OUT / 'combined-mapping.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding='utf-8')

W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
NS = {'w': W}
def q(name):
    return '{' + W + '}' + name

with zipfile.ZipFile(OUT / 'template.docx') as src:
    original_xml = src.read('word/document.xml')
    for prefix, uri in re.findall(r'xmlns:([^=\s]+)="([^"]+)"', original_xml.decode('utf-8')):
        ET.register_namespace(prefix, uri)
    doc = ET.fromstring(original_xml)
    body = doc.find('w:body', NS)
    table = body.findall('w:tbl', NS)[1]
    if audited:
        grid = table.find('w:tblGrid', NS)
        for col, width in zip(grid.findall('w:gridCol', NS), (2160, 3000, 3700, 5116)):
            col.set(q('w'), str(width))
        for historical in grid.findall('w:tblGridChange', NS):
            grid.remove(historical)
    header = deepcopy(table.findall('w:tr', NS)[0])
    model = deepcopy(table.findall('w:tr', NS)[1])
    # Preserve the template's page setup, table grid, borders, cell margins and Arial 11.
    # Repeat the four headings across pages; allow long merged findings to span pages.
    header.find('w:trPr/w:tblHeader', NS).set(q('val'), '1')
    if audited:
        for cell in header.findall('w:tc', NS):
            ET.SubElement(cell.find('w:tcPr', NS), q('shd'), {q('val'): 'clear', q('fill'): 'F2F5F7'})
    for old in table.findall('w:tr', NS):
        table.remove(old)
    table.append(header)

    def set_cell(cell, text, global_field=False):
        pmodel = deepcopy(cell.find('w:p', NS))
        ppr = pmodel.find('w:pPr', NS)
        rpr = pmodel.find('w:r/w:rPr', NS)
        ppr = deepcopy(ppr) if ppr is not None else ET.Element(q('pPr'))
        rpr = deepcopy(rpr) if rpr is not None else ET.Element(q('rPr'))
        # The old document used red/bold for unconfirmed guesses; these are not
        # fixed column styles and should not accidentally style all new findings.
        for props in (rpr, ppr.find('w:rPr', NS)):
            if props is not None:
                for child in list(props):
                    if child.tag in (q('b'), q('bCs'), q('color')):
                        props.remove(child)
        if audited and global_field:
            for props in (rpr, ppr.find('w:rPr', NS)):
                if props is not None:
                    for size in props.findall('w:sz', NS) + props.findall('w:szCs', NS):
                        size.set(q('val'), '21')
                    ET.SubElement(props, q('b'), {q('val'): '1'})
        for child in list(cell):
            if child.tag != q('tcPr'):
                cell.remove(child)
        for paragraph in text.split('\n'):
            p = ET.SubElement(cell, q('p'))
            p.append(deepcopy(ppr))
            if paragraph:
                label = re.match(r'^(CV|CAN|CAT|[a-z][a-z_0-9]*|Disponibilidad conjunta):', paragraph) if audited else None
                parts = [(paragraph[:label.end()], True), (paragraph[label.end():], False)] if label else [(paragraph, False)]
                for value, bold in parts:
                    if not value:
                        continue
                    run = ET.SubElement(p, q('r'))
                    props = deepcopy(rpr)
                    if bold:
                        ET.SubElement(props, q('b'), {q('val'): '1'})
                        if label.group(1) in ('CV', 'CAN', 'CAT'):
                            ET.SubElement(props, q('color'), {q('val'): '305270'})
                    run.append(props)
                    t = ET.SubElement(run, q('t'))
                    t.set('{http://www.w3.org/XML/1998/namespace}space', 'preserve')
                    t.text = value

    for row in rows:
        tr = deepcopy(model)
        for c, name in zip(tr.findall('w:tc', NS), ('global', 'origen', 'transformaciones', 'comentarios')):
            set_cell(c, row[name], global_field=(name == 'global'))
        table.append(tr)

    for p in body.findall('w:p', NS):
        text = ''.join(p.itertext())
        if text.startswith('Esquema origen:'):
            first = p.find('.//w:t', NS)
            first.text = 'Esquema origen: CV / CAN / CAT'
            for extra in p.findall('.//w:t', NS)[1:]:
                extra.text = ''
        if text.startswith('E = Entidad'):
            first = p.find('.//w:t', NS)
            first.text = 'E = Entidad  L = Localidad  P = Provincia | CV = Comunitat Valenciana; CAN = Canarias; CAT = Catalunya (ONGD)'
            for extra in p.findall('.//w:t', NS)[1:]:
                extra.text = ''

    # Add two short context paragraphs immediately before the mapping table.
    table_index = list(body).index(table)
    contexts = [
        'Fuentes: CV: entidades_CV.csv (1697 filas, 21 campos); CAN: datos-abiertos-csv-segundo-trimestre26.json (810 filas, 20 campos); CAT: Entitats_ONGD_pretty.xml (765 filas, 11 campos).',
        'Base: Comparación, inventario, ámbitos y decisiones de docs/data.js + docs/comparison.js; conclusiones de los tres notebooks; comprobación de los archivos literales; data/global_schema.py. Nombres canónicos de Python (direccion, codigo_postal, descripcion, codigo, url). Correspondencias candidatas y reglas propuestas: no se ha ejecutado ETL, limpieza, geocodificación ni fusión de registros. — indica ausencia de campo/equivalencia; los opcionales aceptan None, sin que ello sea un valor por defecto.'
    ]
    if audited:
        contexts[1] += ' Los tipos int64/float64 citados son inferencias de pandas, no tipos del CSV/JSON/XML literal. Obligatorio describe la anotación sin None; las dataclasses no validan esos tipos automáticamente.'
    for i, text in enumerate(contexts):
        holder = deepcopy(model.findall('w:tc', NS)[0])
        set_cell(holder, text)
        body.insert(table_index + i, holder.find('w:p', NS))
    # Remove duplicate imported paragraph identifiers from cloned content.
    for element in doc.iter():
        for attr in list(element.attrib):
            if attr.endswith('}paraId') or attr.endswith('}textId'):
                del element.attrib[attr]
    rendered_xml = ET.tostring(doc, encoding='utf-8', xml_declaration=True)
    with zipfile.ZipFile(document_output, 'w', zipfile.ZIP_DEFLATED) as dest:
        for info in src.infolist():
            dest.writestr(info, rendered_xml if info.filename == 'word/document.xml' else src.read(info.filename))

with zipfile.ZipFile(document_output) as z:
    assert z.testzip() is None
    final = ET.fromstring(z.read('word/document.xml'))
    tables = final.findall('.//w:tbl', NS)
    assert len(tables) == 2
    assert len(tables[1].findall('w:tr', NS)) == 28
    assert all(len(tr.findall('w:tc', NS)) == 4 for tr in tables[1].findall('w:tr', NS))
    actual = [['\n'.join(''.join(p.itertext()) for p in c.findall('w:p', NS)) for c in tr.findall('w:tc', NS)] for tr in tables[1].findall('w:tr', NS)[1:]]
    assert actual == [[r[c] for c in ('global', 'origen', 'transformaciones', 'comentarios')] for r in rows]

report = {'rows': len(rows), 'ambito_rows': len(enum), 'schema_fields': len(schema_keys),
          'source_rows': [len(cv_rows), len(can_rows), len(xml_rows)],
          'characters': sum(len(r[c]) for r in rows for c in ('global', 'origen', 'transformaciones', 'comentarios')),
          'template_grid_preserved': not audited, 'template_landscape_preserved': True,
          'audit_applied': audited, 'column_widths_pt': [108, 150, 185, 255.8] if audited else [172.3, 246.6, 154.95, 124.95],
          'headers': ['Dato esquema global', 'Dato(s) esquema origen', 'Transformación(es)', 'Comentarios']}
(OUT / 'validation.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(report, ensure_ascii=False))
