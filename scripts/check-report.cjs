const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const cp = require('node:child_process');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const sandbox = { window: {} };
for (const name of ['data.js', 'comparison.js', 'i18n.js', 'data.en.js']) vm.runInNewContext(read(`docs/${name}`), sandbox);
const data = sandbox.window.IEI_DATA;
const canonical = field => field === 'URL' ? 'url' : field === 'código' ? 'codigo' : field;
assert.equal(data.fuentes.length, 3);
for (const source of data.fuentes) {
  const english = sandbox.window.IEI_EN[source.id];
  assert.ok(english, source.id);
  assert.equal(english.resumen.length, source.resumen.length);
  for (const row of source.mapeoGlobal) {
    const translation = english.mapeoGlobal[`${row.objeto}.${canonical(row.campo)}`];
    assert.ok(translation?.regla && translation?.nota, `Missing mapping translation: ${source.id} ${row.campo}`);
  }
  for (const row of source.inventario) {
    const translation = english.inventario[row.campo];
    assert.ok(translation?.significado && translation?.hallazgos && translation?.regla, `Missing field translation: ${source.id} ${row.campo}`);
    assert.ok(sandbox.window.IEI_I18N.badges[row.decision], `Missing badge: ${row.decision}`);
  }
  assert.equal(english.ambitos.length, source.ambitos.length);
  assert.equal(english.decisiones.length, source.decisiones.length);
  for (const row of english.decisiones) assert.ok(row.tema && row.evidencia && row.decision);
}
assert.deepEqual(Object.keys(sandbox.window.IEI_I18N.es).sort(), Object.keys(sandbox.window.IEI_I18N.en).sort());
assert.equal(sandbox.window.IEI_COMPARISON.fields.length, 16);
assert.equal(new Set(sandbox.window.IEI_COMPARISON.fields.map(row => `${row.objeto}.${row.campo}`)).size, 16);
const pythonSchema = `
import json, importlib.util
from dataclasses import fields
spec = importlib.util.spec_from_file_location("schema", "data/global_schema.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
print(json.dumps([
    dict(objeto=name, campo=field.name,
         tipo=str(field.type).replace("<class '", "").replace("'>", ""),
         required="None" not in str(field.type))
    for name in ["Entidad", "Localidad", "Provincia"]
    for field in fields(getattr(module, name))
]))
`;
const fieldMetadata = JSON.parse(cp.execFileSync(process.env.IEI_PYTHON || 'python', ['-c', pythonSchema], { cwd: root, encoding: 'utf8' }));
// Python object reprs include the module name on relational fields.
for (const row of fieldMetadata) {
  row.tipo = row.tipo.replace(/schema\./g, '');
  if (row.campo === 'en_localidad') row.tipo = 'Localidad';
  else if (row.campo === 'en_provincia') row.tipo = 'Provincia';
}
assert.deepEqual(JSON.parse(JSON.stringify(sandbox.window.IEI_COMPARISON.fields)), fieldMetadata);
console.log('PASS: every report text entry has English content; 16 fields/types match Python.');
if (process.argv.includes('--content-only')) process.exit(0);

const smokeScript = `
(function () {
  const check = (value, message) => { if (!value) throw Error(message); };
  const count = id => document.querySelectorAll('#' + id + ' tbody tr').length;
  try {
    check(count('comparisonMapping') === 16, 'comparison rows');
    check(document.querySelectorAll('#comparisonMapping th').length === 4, 'all three sources');
    const rowFor = name => Array.from(document.querySelectorAll('#comparisonMapping tbody tr')).find(row => row.cells[0].textContent.includes(name));
    const postal = rowFor('Entidad.codigo_postal');
    check(postal.cells[1].textContent.includes('Sin campo') && postal.cells[2].textContent.includes('Sin campo'), 'missing postal in two sources');
    check(postal.cells[3].textContent.includes('Transformar') && postal.cells[3].textContent.includes('Revisar'), 'XML postal needs transform and review');
    const code = rowFor('Entidad.cod_entidad');
    check(code.cells[1].textContent.includes('Transformar') && code.cells[1].textContent.includes('Revisar'), 'Valencia centre codes');
    check(rowFor('Entidad.en_localidad').cells[3].textContent.includes('Sin campo'), 'XML incomplete required relation');
    document.getElementById('nav-comparison').click();
    document.querySelector('[data-language="en"]').click();
    check(document.documentElement.lang === 'en', 'document language');
    check(document.getElementById('tab-comparison').classList.contains('active'), 'active tab retained');
    check(document.querySelector('h1').textContent === 'Mapping data to the global schema', 'translated heading');
    check(document.getElementById('comparisonMapping').textContent.includes('Combine fields'), 'translated matrix');
    check(document.querySelector('#comparisonMapping details').textContent.includes('Use the centre identifier.'), 'English evidence');
    document.querySelector('#sourceTabs [data-source="catalunya_ongd"]').click();
    check(count('sourceInventory') === 11, 'XML inventory');
    check(document.getElementById('sourceInventory').textContent.includes('627'), 'English findings');
    check(document.getElementById('quickSummary').textContent.includes('Analysis in notebooks/entitats_xml.ipynb'), 'English summary');
    const search = document.getElementById('globalSearch');
    search.value = 'correu_electr_nic'; search.dispatchEvent(new Event('input'));
    check(count('sourceInventory') === 1, 'field search');
    check(count('comparisonMapping') === 1, 'matrix field search');
    document.querySelector('[data-language="es"]').click();
    check(count('sourceInventory') === 1 && search.value === 'correu_electr_nic', 'query retained');
    check(document.getElementById('sourceInventory').textContent.includes('Correo de contacto'), 'Spanish field text');
    check(document.querySelector('#sourceTabs .active').dataset.source === 'catalunya_ongd', 'selected source retained');
    search.value = ''; search.dispatchEvent(new Event('input'));
    check(count('comparisonMapping') === 16, 'search reset');
    search.value = 'no_match_987654'; search.dispatchEvent(new Event('input'));
    check(document.getElementById('comparisonMapping').textContent.includes('No hay resultados'), 'empty state');
    search.value = ''; search.dispatchEvent(new Event('input'));
    for (const source of fuentes) {
      document.querySelector('#sourceTabs [data-source="' + source.id + '"]').click();
      for (const lang of ['en', 'es']) {
        document.querySelector('[data-language="' + lang + '"]').click();
        check(count('sourceInventory') === source.inventario.length, 'inventory ' + source.id + ' ' + lang);
        check(count('globalMapping') === source.mapeoGlobal.length, 'mappings ' + source.id + ' ' + lang);
        check(count('ambitoMapping') === source.ambitos.length, 'areas ' + source.id + ' ' + lang);
        check(count('openDecisions') === source.decisiones.length, 'decisions ' + source.id + ' ' + lang);
      }
    }
    document.querySelector('[data-language="en"]').click();
    check(localStorage.getItem('iei-language') === 'en', 'language persisted');
    // Demonstrate a compact matrix in the final browser output.
    document.getElementById('nav-comparison').click();
    const result = document.createElement('pre'); result.id = 'report-smoke-result';
    result.textContent = 'PASS: real browser, all sources/tabs, bilingual report, matrix, search and state retention.';
    document.body.append(result);
  } catch (error) {
    const result = document.createElement('pre'); result.id = 'report-smoke-result';
    result.textContent = 'FAIL: ' + error.stack; document.body.append(result);
  }
})();`;
const smokePath = path.join(root, 'docs/._report_smoke.html');
const profile = path.join(root, 'docs/._report_chrome_profile');
assert.ok(!fs.existsSync(smokePath) && !fs.existsSync(profile), 'Temporary paths must be new');
try {
  fs.writeFileSync(smokePath, read('docs/index.html').replace('</body>', `<script>${smokeScript}</script></body>`), 'utf8');
  const chrome = process.env.IEI_CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const result = cp.spawnSync(chrome, ['--headless=new', '--disable-gpu', '--disable-background-networking', '--no-first-run', '--no-default-browser-check', '--allow-file-access-from-files', '--user-data-dir=' + profile, '--dump-dom', 'file:///' + smokePath.replace(/\\/g, '/')], { encoding: 'utf8', timeout: 30000, maxBuffer: 5 * 1024 * 1024, windowsHide: true });
  if (result.error) throw result.error;
  const match = result.stdout.match(/<pre id="report-smoke-result">([\s\S]*?)<\/pre>/);
  assert.ok(match, 'Browser verification did not complete: ' + result.stderr.slice(-1500));
  assert.ok(match[1].startsWith('PASS:'), match[1]);
  console.log(match[1]);
} finally {
  fs.rmSync(smokePath, { force: true });
  // Delete only the exact, newly-created profile within docs.
  assert.equal(path.dirname(path.resolve(profile)), path.join(root, 'docs'));
  if (fs.existsSync(profile)) fs.rmSync(profile, { recursive: true, force: true });
}
