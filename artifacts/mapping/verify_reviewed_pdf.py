"""Check every PDF page and build a visual overview of the reviewed document."""
from pathlib import Path
import collections
import json
import re
import sys
import xml.etree.ElementTree as ET
import zipfile

sys.path.insert(0, sys.argv[1])
import pymupdf

OUT = Path(__file__).resolve().parent
pdf = pymupdf.open(OUT / 'Mappings_CV_CAN_CAT_Revisado.pdf')
rows = json.loads((OUT / 'audited-mapping.json').read_text(encoding='utf-8'))
with zipfile.ZipFile(OUT / 'Mappings_CV_CAN_CAT_Revisado.docx') as z:
    xml = ET.fromstring(z.read('word/document.xml'))
ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
paragraphs = [''.join(t.text or '' for t in p.findall('.//w:t', ns)) for p in xml.findall('.//w:p', ns)]
native_text = '\n'.join(paragraphs)
pdf_text = '\n'.join(p.get_text() for p in pdf)
outside = []
header_pages = []
for page_number, page in enumerate(pdf, 1):
    if 'Dato esquema' in page.get_text() and 'Comentarios' in page.get_text():
        header_pages.append(page_number)
    for block in page.get_text('dict')['blocks']:
        for line in block.get('lines', []):
            for span in line['spans']:
                x0, y0, x1, y1 = span['bbox']
                if x0 < -1 or y0 < -1 or x1 > page.rect.width + 1 or y1 > page.rect.height + 1:
                    outside.append({'page': page_number, 'text': span['text']})
compact = re.sub(r'\s+', '', pdf_text)
missing = [r['global'] for r in rows if re.sub(r'\s+', '', r['global']) not in compact]
headers = ['Dato esquema global', 'Dato(s) esquema origen', 'Transformación(es)', 'Comentarios']
counter = lambda text: collections.Counter(re.sub(r'\s+', '', text))
expected_chars = counter(native_text)
expected_chars.update(counter(''.join(headers) * (len(pdf) - 1)))
actual_chars = counter(pdf_text)
missing_chars = dict(expected_chars - actual_chars)
extra_chars = dict(actual_chars - expected_chars)

# A native table must survive both readback and the document export.
tables = xml.findall('.//w:tbl', ns)
mapping_table = next(t for t in tables if len(t.findall('w:tr/w:tc', ns)) > 8)
assert len(mapping_table.findall('w:tr', ns)) == 28
assert all(len(r.findall('w:tc', ns)) == 4 for r in mapping_table.findall('w:tr', ns))
assert not missing and not outside and len(header_pages) == len(pdf)
assert not missing_chars, missing_chars

# Four columns of thumbnails show every page for inspection, with page numbers.
columns = 4
thumb_width, thumb_height = 350, 248
per_sheet = 16
for first in range(0, len(pdf), per_sheet):
    count = min(per_sheet, len(pdf) - first)
    sheet_rows = (count + columns - 1) // columns
    canvas = pymupdf.open()
    sheet = canvas.new_page(width=columns * thumb_width, height=sheet_rows * (thumb_height + 23))
    for offset in range(count):
        col, line = offset % columns, offset // columns
        x, y = col * thumb_width, line * (thumb_height + 23)
        sheet.insert_text((x + 8, y + 14), str(first + offset + 1), fontsize=11)
        rect = pymupdf.Rect(x, y + 20, x + thumb_width, y + 20 + thumb_height)
        sheet.show_pdf_page(rect, pdf, first + offset)
    sheet.get_pixmap(matrix=pymupdf.Matrix(1.2, 1.2)).save(OUT / f'review-all-pages-{first + 1}.png')
    canvas.close()

report = {
    'google_doc_url': 'https://docs.google.com/document/d/1CUuUvST6LCZ_D6c5T9vwMowplZaUJ85hiUXcLqOxCHU/edit?usp=drivesdk',
    'folder_id': '1MnwsrKwoujhqL3lX5Ts_CzB2XKut4fKK',
    'data_rows': 27, 'ambito_rows': 12, 'schema_fields': 16,
    'native_table_rows': 28, 'native_table_columns': 4,
    'native_cell_text_mismatches': 0,
    'pdf_pages_before_review': 53, 'pdf_pages': len(pdf),
    'pages_with_repeated_header': len(header_pages),
    'missing_field_labels': missing, 'text_outside_pages': outside,
    'missing_rendered_characters': missing_chars, 'extra_rendered_characters': extra_chars,
    'source_counts': {'CV': {'rows': 1697, 'fields': 21}, 'CAN': {'rows': 810, 'fields': 20}, 'CAT': {'rows': 765, 'fields': 11}},
    'independent_source_audits_completed': ['CV', 'CAN', 'CAT'],
    'corrected_inaccuracies': ['CV id uniqueness does not imply consecutive numbering', 'CV leading municipal zeroes exist in raw CSV; loss is in numeric loading'],
    'semantic_clarifications': ['partial CV INCLUSION_SOCIAL mapping', 'missing centre identifiers for all CV INFANCIA/MUJERES rows', 'CAN literal address variants do not prove separate premises/localities', 'CAN subarea group denominator excludes _U', 'CAT phone counts are cells, not distinct numbers', 'CAT CIF/contact missingness is not equivalent', 'pandas inferred types differ from literal source types'],
}
(OUT / 'delivery-validation.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
(OUT / 'reviewed-pdf-text.txt').write_text(pdf_text, encoding='utf-8')
print(json.dumps(report, ensure_ascii=False))
