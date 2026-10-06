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
const urlIndex = process.argv.indexOf('--url');
if (urlIndex !== -1) {
  const url = new URL(process.argv[urlIndex + 1]);
  assert.ok(['http:', 'https:'].includes(url.protocol), 'Expected an HTTP(S) report URL');
  checkPublished(url).catch(error => { console.error(error); process.exitCode = 1; });
} else {
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
}

async function checkPublished(url) {
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const published = await fetch(url, { cache: 'no-store' });
  assert.equal(published.status, 200, 'Published HTML status');
  const html = await published.text();
  const assets = [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css)(?:\?[^"]*)?)"/g)];
  for (const [, reference] of assets) {
    const response = await fetch(new URL(reference, url), { cache: 'no-store' });
    assert.equal(response.status, 200, reference);
    const content = (await response.text()).replace(/\r\n/g, '\n');
    const name = new URL(reference, url).pathname.split('/').pop();
    assert.equal(content, read(`docs/${name}`).replace(/\r\n/g, '\n'), `Published ${name} differs from local file`);
    console.log(`MATCH: published ${reference}`);
  }
  assert.equal(assets.length, 6, 'Published stylesheet and five scripts');
  assert.ok(!fs.existsSync(profile), 'Temporary browser profile must be new');
  const chrome = process.env.IEI_CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = cp.spawn(chrome, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', '--user-data-dir=' + profile, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
  let socket;
  try {
    const portFile = path.join(profile, 'DevToolsActivePort');
    const deadline = Date.now() + 30000;
    while (!fs.existsSync(portFile)) {
      assert.ok(Date.now() < deadline, 'Chrome debugging port did not become available');
      await sleep(100);
    }
    const port = fs.readFileSync(portFile, 'utf8').split(/\r?\n/)[0];
    const pages = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    socket = new WebSocket(pages.find(page => page.type === 'page').webSocketDebuggerUrl);
    await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
    let id = 0;
    const pending = new Map();
    const errors = [];
    socket.addEventListener('message', event => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const request = pending.get(message.id);
        if (request) { clearTimeout(request.timer); pending.delete(message.id); message.error ? request.reject(Error(message.error.message)) : request.resolve(message.result); }
      } else if (message.method === 'Runtime.exceptionThrown') {
        errors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
      } else if (message.method === 'Network.loadingFailed') {
        errors.push(`Network: ${message.params.errorText}`);
      }
    });
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const requestId = ++id;
      const timer = setTimeout(() => { pending.delete(requestId); reject(Error(`Chrome timed out: ${method}`)); }, 15000);
      pending.set(requestId, { resolve, reject, timer });
      socket.send(JSON.stringify({ id: requestId, method, params }));
    });
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Network.enable');
    await send('Page.navigate', { url: url.href });
    let ready = false;
    while (Date.now() < deadline) {
      const result = await send('Runtime.evaluate', { expression: "document.readyState === 'complete' && !!document.getElementById('comparisonMapping')", returnByValue: true });
      if (result.result.value) { ready = true; break; }
      await sleep(200);
    }
    assert.ok(ready, 'Published report did not load');
    assert.deepEqual(errors, [], 'Published browser errors');
    const style = await send('Runtime.evaluate', { expression: "parseFloat(getComputedStyle(document.querySelector('[data-language]')).borderRadius)", returnByValue: true });
    assert.ok(style.result.value > 0, 'Language button CSS did not load');
    await send('Runtime.evaluate', { expression: smokeScript });
    const result = await send('Runtime.evaluate', { expression: "document.getElementById('report-smoke-result')?.textContent", returnByValue: true });
    assert.ok(result.result.value?.startsWith('PASS:'), result.result.value || 'Published browser checks did not complete');
    console.log(`PASS: published CSS and JavaScript load without errors at ${url.href}`);
    console.log(result.result.value);
    await send('Browser.close');
  } finally {
    if (socket) socket.close();
    if (browser.exitCode === null) {
      const closed = new Promise(resolve => browser.once('exit', resolve));
      browser.kill();
      await Promise.race([closed, sleep(3000)]);
    }
    assert.equal(path.dirname(path.resolve(profile)), path.join(root, 'docs'));
    if (fs.existsSync(profile)) fs.rmSync(profile, { recursive: true, force: true });
  }
}
