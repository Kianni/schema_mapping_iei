"""Apply independently checked precision and readability corrections to mapping cells."""
from pathlib import Path
import json

OUT = Path(__file__).resolve().parent
baseline = OUT / 'combined-mapping.pre-audit.json'
if not baseline.exists():
    baseline.write_bytes((OUT / 'combined-mapping.json').read_bytes())
rows = json.loads(baseline.read_text(encoding='utf-8'))
changes = []

def row(key, ambito=None):
    return next(r for r in rows if r['key'] == key and r.get('ambito') == ambito)

def replace(key, column, old, new, ambito=None):
    r = row(key, ambito)
    assert old in r[column], (key, column, old)
    r[column] = r[column].replace(old, new)
    changes.append({'field': r['global'], 'column': column, 'before': old, 'after': new})

def source_block(key, column, tag, text, ambito=None):
    r = row(key, ambito)
    parts = r[column].split('\n\n')
    hits = [i for i, p in enumerate(parts) if p.startswith(tag + ': ')]
    assert len(hits) == 1
    i = hits[0]
    old = parts[i]
    parts[i] = tag + ': ' + text
    r[column] = '\n\n'.join(parts)
    changes.append({'field': r['global'], 'column': column, 'before': old, 'after': parts[i]})

replace('Entidad.cod_entidad', 'comentarios',
        'id: int64; completo; 1697 valores únicos y secuenciales.',
        'id: completo; 1697 valores únicos y crecientes en el intervalo 1–1713, con 16 números ausentes; identifica filas, no centros.')
source_block('Entidad.cod_entidad', 'transformaciones', 'CV',
             'Leer ni_centro como identificador textual, preservando el literal del CSV. Si ya se cargó como float, convertir los valores informados, matemáticamente enteros, a texto sin sufijo decimal. Acordar tratamiento de los 32 códigos ausentes; id identifica filas y no sustituye automáticamente al código de centro.')
replace('Entidad.cod_entidad', 'comentarios',
        'No eliminar filas por NIF o registro: pueden aportar sedes, direcciones, áreas y subáreas distintas.',
        'No eliminar filas por NIF o registro: pueden aportar direcciones literales, áreas y subáreas distintas. Cinco NIF tienen dos tuplas distintas de componentes de dirección; cuatro tienen dos textos de calle. Algunas diferencias son de formato o de reparto de componentes y no demuestran sedes físicas distintas. Cada NIF y cada registro tiene un único código municipal en este archivo.')
replace('Entidad.cod_entidad', 'comentarios',
        'Unicidad local no acredita identidad entre fuentes. Ambos grupos de CIF repetido difieren también en código postal, municipio, móvil y correo; no se determina relación jurídica o error.',
        'Unicidad local no acredita identidad entre fuentes.')

source_block('Localidad.codigo', 'transformaciones', 'CV',
             'Leer cod_ine_mun como texto y preservar los cinco caracteres ya presentes en el CSV. Si se trabaja con una importación numérica anterior, completar la representación a cinco caracteres con cero inicial.')
source_block('Localidad.codigo', 'comentarios', 'CV',
             'El CSV literal contiene 1697 códigos de cinco caracteres, 333 distintos y ninguno ausente. La inferencia int64 de pandas pierde el cero inicial en 489 códigos con prefijo 03: en esa representación numérica quedan 489 valores de cuatro dígitos y 1208 de cinco. Los 333 códigos y municipios tienen relación uno a uno. El código es un identificador, no una magnitud; conservar texto evita la pérdida de ceros.')
source_block('Localidad.codigo', 'transformaciones', 'CAN',
             'Preservar direccion_municipio_id como texto: el JSON ya contiene cadenas de cinco caracteres. Convertir a texto solo si se usa una carga numérica anterior. Validar el sistema antes de equipararlo al INE o de cruzarlo entre fuentes; no aplicar relleno por conjetura.')

replace('Entidad.ambito', 'comentarios',
        'CV tiene 12 centros con varios sectores (10 con dos y dos con tres);',
        'Entre los 1645 códigos ni_centro informados, CV tiene 12 con varios sectores (10 con dos y dos con tres);', 'MAYORES')
replace('Entidad.ambito', 'comentarios',
        'Sus 33 grupos NIF–área con varias subáreas se distribuyen en 29 con dos, tres con tres y uno con seis (otros 341 tienen una).',
        'Tras excluir _U, CAN tiene 374 grupos NIF–área con subáreas conocidas: 341 con una, 29 con dos, tres con tres y uno con seis; 33 grupos tienen varias. Otros 391 grupos contienen solo _U, para un total de 765 grupos NIF–área. Ningún grupo mezcla subáreas conocidas y _U.', 'MAYORES')
for value, n in [('INFANCIA_Y_JUVENTUD', 5), ('MUJER', 2)]:
    r = row('Entidad.ambito', value)
    pieces = r['comentarios'].split('\n\n')
    pieces[0] += f' Las {n} filas de esta categoría carecen de ni_centro; la política de identificadores ausentes debe resolverse antes de integrarlas como Entidad completa.'
    r['comentarios'] = '\n\n'.join(pieces)
    changes.append({'field': r['global'], 'column': 'comentarios', 'added': 'All category rows lack ni_centro.'})
source_block('Entidad.ambito', 'transformaciones', 'CV',
             'Correspondencia parcial propuesta hacia INCLUSION_SOCIAL, pendiente de aceptar el criterio de integración; conservar el sector original para no perder su alcance.', 'INCLUSION_SOCIAL')
replace('Entidad.ambito', 'comentarios',
        'Mejor correspondencia dentro del enum global actual.',
        'Correspondencia parcial propuesta dentro del enum: el sector también incluye población en general, por lo que no es una equivalencia exacta con inclusión social.', 'INCLUSION_SOCIAL')
source_block('Entidad.ambito', 'transformaciones', 'CAN',
             'Evaluar Centros Ocupacionales por su área y Varios / B por la pareja área–subárea. Ambos son candidatos pendientes de revisión para EMPLEO_E_INSERCION_LABORAL. No equiparar todo centro ocupacional con inserción laboral ni toda la categoría B con empleo.', 'EMPLEO_E_INSERCION_LABORAL')
source_block('Entidad.ambito', 'transformaciones', 'CAN',
             'Evaluar Drogodependencia por su área; Varios / H y Voluntariado / 3 por la pareja área–subárea. Son candidatos de alcance distinto, pendientes de revisión para SALUD_Y_ATENCION_SOCIOSANITARIA. No asignar este ámbito a todo Varios o Voluntariado.', 'SALUD_Y_ATENCION_SOCIOSANITARIA')

replace('Entidad.direccion', 'comentarios',
        'Una organización puede tener varias direcciones; no escoger una arbitrariamente.',
        'Cinco NIF tienen dos tuplas literales distintas de componentes de dirección (740 tienen una); cuatro presentan distintos textos de calle. Las diferencias pueden ser de formato o de reparto de componentes: no demuestran sedes físicas distintas. Cada NIF conserva un único código municipal. No escoger una variante arbitrariamente.')
replace('Entidad.direccion', 'transformaciones',
        'Definir representación de varias sedes/direcciones por NIF.',
        'Definir representación de variantes/direcciones literales por NIF y confirmar si corresponden a sedes distintas.')
replace('Entidad.en_localidad', 'transformaciones',
        'Definir representación de varias sedes/localidades por organización;',
        'En este archivo, cada NIF y cada registro tiene un único código municipal. Acordar cómo representar variantes de dirección y posibles sedes futuras sin afirmar multiplicidad municipal observada;')
replace('Entidad.en_localidad', 'comentarios',
        'No tomar _U como localidad ni escoger arbitrariamente una sede.',
        'No tomar _U como localidad. Hay variantes literales de dirección, pero no varios códigos municipales por NIF o registro; las sedes físicas no están identificadas explícitamente.')

replace('Entidad.descripcion', 'comentarios',
        '21 organizaciones tienen dos valores;', '21 grupos de nombres entidad tienen dos valores;')
replace('Entidad.descripcion', 'comentarios', 'max: 147 valores,', 'max: 147 valores distintos,')
replace('Entidad.descripcion', 'comentarios',
        'tipo_centro tiene 64 categorías; 1636 centros tienen un tipo y nueve varios',
        'tipo_centro tiene 64 categorías; entre los 1645 códigos ni_centro informados, 1636 tienen un tipo y nueve varios')

replace('Entidad.contacto', 'comentarios',
        'Teléfono: 1604 textos de nueve caracteres; anomalías de 10/8/3 dígitos y varios números en una celda (p. ej. 964360002; 964367054).',
        'Teléfono: 1604 textos de nueve caracteres; valores de 10 u ocho dígitos y celdas con varios números (p. ej. 964360002; 964367054) requieren revisión. El formato corto 012 aparece en tres filas y no debe declararse erróneo solo por su longitud.')
replace('Entidad.contacto', 'comentarios',
        'telefono_1 tiene un valor por cada uno de los 745 NIF; telefono_2 informado, por 172 NIF. 803/810 primeros y 183/185 segundos cumplen (34)+nueve dígitos. Un patrón sintáctico no demuestra validez del contacto.',
        'Los nueve valores fuera del patrón presentan longitudes inesperadas o un prefijo de país repetido, como (34)+34650393946. Un patrón sintáctico no demuestra validez, existencia ni disponibilidad del contacto.')
contact = row('Entidad.contacto')['comentarios']
start = contact.index('Detalle telefónico:')
contact = contact[:start] + (
    'Disponibilidad conjunta: de 12 filas sin ambos teléfonos, 11 conservan correo; el registro 392 carece también de correo y web. '
    'De 35 filas sin correo, 34 conservan teléfono. Las ausencias de CIF y contacto no son equivalentes: '
    '37/83 filas sin CIF conservan los tres campos de contacto directo; 395/682 con CIF carecen de al menos uno. '
    'No se establece causalidad. Compartir teléfonos/correos no demuestra identidad. '
    'El atributo global contacto es un único str | None y no prescribe cómo serializar estos componentes.'
)
row('Entidad.contacto')['comentarios'] = contact
changes.append({'field': 'E.contacto', 'column': 'comentarios', 'change': 'Removed duplicate CAT telephone/email facts; added exact CIF/contact overlap counts.'})

replace('Entidad.url', 'comentarios',
        'Un valor informado por cada uno de 172 NIF. hhtps://, correos y texto en el mismo campo impiden considerarlo URL validada.',
        'Un valor informado por cada uno de 172 NIF. Las seis filas con espacios internos son dos referencias web y cuatro descripciones. Hay un email distinto, felicesconnarices@hotmail.com, además de texto y hhtps://; el campo completo no puede considerarse URL validada.')
replace('Entidad.url', 'comentarios',
        'Los dos registros Yamuna comparten teléfono, móvil, correo y web, pero difieren en registro, nombre, CIF, naturaleza y dirección. Quepo/Yamuna tienen CIF conocidos distintos; wwwsolidariesorg abarca tres nombres y dos municipios con un CIF ausente. La coincidencia no justifica fusionar.',
        'La coincidencia de contactos no justifica fusionar registros.')

# Notebook-specific displays are not part of the consolidated document.
editorial = {
    'Se muestran longitudes extremas y finales para inspección; estas comprobaciones no demuestran truncamiento.':
        'La inspección de longitudes y finales de nombres en el notebook no demuestra truncamiento.',
    'Las tablas comparan los demás campos.':
        'La comparación de los demás campos está documentada en notebooks/entitats_xml.ipynb.',
    'Se muestra contexto de nombre y dirección para revisión.':
        'El notebook documenta el contexto de nombre y dirección para revisar esas asociaciones.',
    'Se muestran tamaños y porcentajes por grupo.':
        'Los tamaños y porcentajes por naturaleza son observaciones descriptivas.',
    'Otras incluyen espacios, barra, extensión o una segunda línea de ocho dígitos; se muestran literalmente.':
        'Otras incluyen espacios, barra, extensión o una segunda línea de ocho dígitos.',
    'Se muestran longitudes extremas y multiplicidad de códigos y prefijos postales; no se asignan provincias mediante prefijos.':
        'La multiplicidad de códigos y prefijos postales no acredita provincia ni exactitud geográfica.',
}
for r in rows:
    for field in ('origen', 'transformaciones', 'comentarios'):
        for old, new in editorial.items():
            if old in r[field]:
                r[field] = r[field].replace(old, new)
                changes.append({'field': r['global'], 'column': field, 'before': old, 'after': new})
        r[field] = r[field].replace('no numíricos', 'no numéricos').replace('Nómero', 'Número')
        r[field] = r[field].replace('Python exige en_localidad: Localidad', 'El esquema declara en_localidad: Localidad')

replace('Entidad.nombre', 'comentarios',
        'No se demuestra truncamiento mediante longitudes/extremos. Campo global str obligatorio; unicidad en un archivo no garantiza identidad universal.',
        'Campo global str obligatorio; unicidad en un archivo no garantiza identidad universal.')
replace('Entidad.nombre', 'comentarios',
        'Filas 157, 319, 457 con finales posiblemente truncados, 99–100 caracteres, confirmados en JSON; errata posible Otrtas.\nFrecuencia máxima: siete filas. Longitudes sospechosas en índices 157/319/457: 99/100/100, también en JSON;',
        'Frecuencia máxima: siete filas. Posibles truncamientos en índices 157/319/457: 99/100/100 caracteres, confirmados en JSON; posible errata Otrtas;')

replace('Entidad.direccion', 'comentarios',
        'Siete parejas de dirección compartida tienen CIF distintos y en tres falta uno; no deduplicar por dirección.',
        'No deduplicar por dirección compartida.')
replace('Entidad.codigo_postal', 'comentarios',
        'No se restauran ceros ni se cambian códigos.', '')
replace('Entidad.descripcion', 'comentarios',
        'Asociaciones: 536; fundaciones: 132. CIF ausente en 73/536 asociaciones y 9/132 fundaciones; móvil ausente en 127/536 y 58/132. Son observaciones descriptivas: grupos pequeños y porcentajes no justifican causas.',
        'Los porcentajes observados no justifican conclusiones causales.')
replace('Entidad.contacto', 'comentarios',
        '504 contienen nueve dígitos.',
        '504 celdas contienen exactamente un número de nueve dígitos; no son 504 números únicos.')
replace('Entidad.contacto', 'comentarios',
        '530 contienen nueve dígitos;',
        '530 celdas contienen exactamente un número de nueve dígitos;')
replace('Entidad.contacto', 'comentarios',
        'Otras incluyen espacios, barra, extensión o una segunda línea de ocho dígitos.',
        'Las otras ocho celdas multilínea incluyen espacios, barra, extensión o una segunda línea de ocho dígitos.')
replace('Entidad.contacto', 'comentarios',
        '22 de los 504 valores de nueve dígitos empiezan por 6.',
        '22 de esas 504 celdas empiezan por 6.')
replace('Entidad.contacto', 'comentarios',
        'Ocho valores de nueve dígitos empiezan por 9;',
        'Ocho de las 530 celdas de nueve dígitos empiezan por 9;')
replace('Entidad.url', 'comentarios',
        'En ellas urlsplit devuelve https o http como hostname: efecto de análisis de la sintaxis de origen.',
        'En esos 56 casos, urlsplit devuelve https como hostname en 55 y http en uno: efecto de la sintaxis, no identificación de dominios reales.')
replace('Localidad.nombre', 'comentarios',
        '112 municipios tienen un prefijo postal literal; VilanovailaGeltrú tiene 00 (una fila con 00800) y 08 (dos con 08800). Discrepancia interna, sin establecer código correcto ni asignar provincia. Global nombre: str obligatorio.',
        'La discrepancia postal no establece el código correcto ni permite asignar provincia. Global nombre: str obligatorio.')

assert len(rows) == 27 and sum('ambito' in r for r in rows) == 12
(OUT / 'audited-mapping.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding='utf-8')
(OUT / 'audit-changes.json').write_text(json.dumps(changes, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'data_rows': len(rows), 'ambito_rows': 12, 'edits': len(changes),
                  'characters_before': sum(len(r[k]) for r in json.loads(baseline.read_text(encoding='utf-8')) for k in ('global','origen','transformaciones','comentarios')),
                  'characters_after': sum(len(r[k]) for r in rows for k in ('global','origen','transformaciones','comentarios'))}, ensure_ascii=False))
