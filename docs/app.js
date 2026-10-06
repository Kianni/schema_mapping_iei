const { esquemaGlobal, fuentes } = window.IEI_DATA;
const comparison = window.IEI_COMPARISON;
const statusCodes = ["ready", "transform", "derive", "combine", "review", "none", "unassessed"];
const statusFromMapping = { "Directo": "ready", "Transformación": "transform", "Derivar": "derive", "Compuesto": "combine", "Revisar modelo": "review", "Sin correspondencia": "none" };
let language = "es";
try { language = localStorage.getItem("iei-language") === "en" ? "en" : "es"; } catch { /* Storage may be unavailable for local files. */ }
const t = key => window.IEI_I18N[language][key] ?? key;
const label = value => language === "en" ? (window.IEI_I18N.badges[value] ?? value) : value;
const searchable = value => String(value ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const canonicalField = field => field === "URL" ? "url" : field === "código" ? "codigo" : field;
const mappingKey = row => `${row.objeto}.${canonicalField(row.campo)}`;
const globalReference = value => {
  let text = String(value ?? "").replace(/Entidad\.URL/g, "Entidad.url").replace(/(Localidad|Provincia)\.código/g, "$1.codigo");
  if (language === "en") text = text.replace(/\(candidato\)/g, "(candidate)").replace(/\(auxiliar\)/g, "(supporting)").replace(/\(url en Python\)/g, "(url in Python)");
  return text;
};

function localizedSource(source) {
  if (language !== "en") return source;
  const english = window.IEI_EN?.[source.id];
  if (!english) return source;
  return {
    ...source, nombre: english.nombre, resumen: english.resumen,
    mapeoGlobal: source.mapeoGlobal.map(row => ({ ...row, ...(english.mapeoGlobal[mappingKey(row)] || {}) })),
    inventario: source.inventario.map(row => ({ ...row, ...(english.inventario[row.campo] || {}) })),
    ambitos: source.ambitos.map((row, index) => ({ ...row, nota: english.ambitos[index] ?? row.nota })),
    decisiones: source.decisiones.map((row, index) => ({ ...row, ...(english.decisiones[index] || {}) }))
  };
}

function cellMapping(source, field) {
  const key = mappingKey(field);
  const relation = comparison.relationships[source.id]?.[key];
  if (relation) return { origen: relation.origen, statuses: relation.statuses, regla: relation[language], nota: "" };
  const row = source.mapeoGlobal.find(row => mappingKey(row) === key);
  if (!row) return { origen: "—", statuses: ["unassessed"], regla: t("noAnalysis"), nota: "" };
  return { ...row, statuses: comparison.flags[source.id]?.[key] || [statusFromMapping[row.estado] || "unassessed"] };
}

const estados = ["Directo", "Transformación", "Derivar", "Compuesto", "Revisar modelo", "Sin correspondencia"];
let fuenteActiva = fuentes[0]?.id ?? "";
let filtro = "";

const slug = text => String(text ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const esc = value => String(value ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const badge = text => `<span class="badge ${slug(text)}">${esc(label(text))}</span>`;
const matches = row => !filtro || searchable(Object.values(row ?? {}).map(label).join(" ")).includes(filtro);
const fuenteActual = () => localizedSource(fuentes.find(f => f.id === fuenteActiva) || fuentes[0]);

function tabla(headers, rows, className = "") {
  if (!rows?.length) return `<div class="empty-state">${esc(t("empty"))}</div>`;
  return `<div class="table-wrap ${className}"><table><thead><tr>${headers.map(h => `<th scope="col">${esc(h.label)}</th>`).join("")}</tr></thead><tbody>${rows.map(row => `<tr>${headers.map(h => `<td>${h.render ? h.render(row[h.key], row) : esc(row[h.key])}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

function renderSelector(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = fuentes.map(localizedSource).map(f => `<button class="source-tab ${f.id===fuenteActiva?'active':''}" data-source="${esc(f.id)}" aria-pressed="${f.id===fuenteActiva}">${esc(f.nombre)}</button>`).join("");
  el.querySelectorAll(".source-tab").forEach(btn => btn.addEventListener("click", () => {
    fuenteActiva = btn.dataset.source;
    renderAll();
  }));
}

function renderResumen() {
  const fuente = fuenteActual();
  const globales = comparison.fields.length;
  const cubiertos = comparison.fields.filter(field => cellMapping(fuente, field).origen !== "—").length;
  const tarjetas = [
    [fuentes.length, t("sourcesCount")],
    [fuente.registros ?? "—", `${t("records")} · ${fuente.nombre}`],
    [fuente.campos ?? "—", `${t("fields")} · ${fuente.nombre}`],
    [`${cubiertos}/${globales}`, t("coverage")]
  ];
  document.getElementById("summaryCards").innerHTML = tarjetas.map(([v,l]) => `<div class="card"><div class="value">${esc(v)}</div><div class="label">${esc(l)}</div></div>`).join("");
  renderSelector("summarySourceTabs");
  document.getElementById("quickSummary").innerHTML = (fuente.resumen || []).map(t => `<div class="quick-item"><span class="quick-dot"></span><span>${esc(t)}</span></div>`).join("") || `<div class="empty-state">${esc(t("noSummary"))}</div>`;
  document.getElementById("schemaOverview").innerHTML = Object.entries({ ...Object.fromEntries(["Entidad", "Localidad", "Provincia"].map(object => [object, comparison.fields.filter(row => row.objeto === object).map(row => row.campo)])), Ambito: esquemaGlobal.Ambito }).map(([k,vals]) => `<div class="schema-box"><h3>${esc(k)}</h3><ul>${vals.map(x => `<li><code>${esc(x)}</code></li>`).join("")}</ul></div>`).join("");
}

function renderGlobal() {
  renderSelector("globalSourceTabs");
  document.getElementById("globalLegend").innerHTML = estados.map(badge).join("");
  const fuente = fuenteActual();
  const rows = (fuente.mapeoGlobal || []).map(row => ({ ...row, campo: canonicalField(row.campo) })).filter(matches);
  document.getElementById("globalMapping").innerHTML = tabla([
    {key:"objeto",label:t("object")}, {key:"campo",label:t("globalField"),render:v=>`<code>${esc(v)}</code>`},
    {key:"origen",label:`${t("sourceFields")} · ${fuente.nombre}`,render:v=>`<code>${esc(v)}</code>`},
    {key:"estado",label:t("state"),render:v=>badge(v)}, {key:"regla",label:t("rule")}, {key:"nota",label:t("evidence")}
  ], rows);
}

function renderFuentes() {
  renderSelector("sourceTabs");
  const fuente = fuenteActual();
  const rows = (fuente.inventario || []).filter(matches);
  document.getElementById("sourceInventory").innerHTML = tabla([
    {key:"campo",label:t("sourceField"),render:v=>`<code>${esc(v)}</code>`}, {key:"significado",label:t("meaning")},
    {key:"global",label:t("correspondence"),render:v=>`<code>${esc(globalReference(v))}</code>`}, {key:"decision",label:t("decision"),render:v=>badge(v)},
    {key:"hallazgos",label:t("findings")}, {key:"regla",label:t("integrationRule")}
  ], rows);
}

function renderAmbitos() {
  renderSelector("ambitoSourceTabs");
  const fuente = fuenteActual();
  const rows = (fuente.ambitos || []).filter(matches);
  document.getElementById("ambitoMapping").innerHTML = tabla([
    {key:"global",label:t("globalAmbito"),render:v=>`<code>${esc(v)}</code>`},
    {key:"origen",label:`${t("sourceCategory")} · ${fuente.nombre}`,render:v=>`<code>${esc(v)}</code>`},
    {key:"estado",label:t("state"),render:v=>badge(v)}, {key:"nota",label:t("note")}
  ], rows);
}

function renderDecisiones() {
  renderSelector("decisionSourceTabs");
  const fuente = fuenteActual();
  const rows = (fuente.decisiones || []).filter(matches);
  document.getElementById("openDecisions").innerHTML = tabla([
    {key:"tema",label:t("topic")}, {key:"prioridad",label:t("priority"),render:v=>`<span class="priority ${slug(v)}">${esc(label(v))}</span>`},
    {key:"evidencia",label:t("evidence")}, {key:"decision",label:t("requiredDecision")}
  ], rows);
}

function renderAll() {
  applyLanguage();
  if (!fuentes.length) return;
  renderResumen();
  renderGlobal();
  renderFuentes();
  renderAmbitos();
  renderDecisiones();
  renderComparison();
}

function setupTabs() {
  document.querySelectorAll(".tab-button").forEach(btn => btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-button").forEach(x => x.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(x => x.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
  }));
}

function setupSearch() {
  const input = document.getElementById("globalSearch");
  input.addEventListener("input", () => {
    filtro = searchable(input.value.trim());
    renderGlobal();
    renderFuentes();
    renderAmbitos();
    renderDecisiones();
    renderComparison();
  });
}

function comparisonBadge(code) {
  return `<span class="badge comparison-${esc(code)}" title="${esc(t(`${code}Help`))}">${esc(t(code))}</span>`;
}

function renderComparisonCell(cell) {
  return `<div class="comparison-cell"><div class="mapping-statuses">${cell.statuses.map(comparisonBadge).join("")}</div><code class="mapping-origin">${esc(cell.origen)}</code><details><summary>${esc(t("details"))}</summary><p>${esc(cell.regla)}</p>${cell.nota ? `<p>${esc(cell.nota)}</p>` : ""}</details></div>`;
}

function renderComparison() {
  document.getElementById("comparisonLegend").innerHTML = statusCodes.map(code => `<div class="legend-item">${comparisonBadge(code)}<span>${esc(t(`${code}Help`))}</span></div>`).join("");
  const sources = fuentes.map(localizedSource);
  const rows = comparison.fields.map(field => {
    const row = { ...field, key: mappingKey(field) };
    for (const source of sources) row[source.id] = cellMapping(source, field);
    return row;
  }).filter(row => !filtro || searchable([
    row.key, row.tipo, row.required ? t("required") : t("nullable"),
    ...sources.flatMap(source => {
      const cell = row[source.id];
      return [source.nombre, cell.origen, cell.regla, cell.nota, ...cell.statuses.map(t)];
    })
  ].join(" ")).includes(filtro));
  document.getElementById("comparisonMapping").innerHTML = tabla([
    { key: "key", label: t("globalField"), render: (value, row) => `<code>${esc(value)}</code><div class="field-type">${esc(row.tipo)} · ${esc(row.required ? t("required") : t("nullable"))}</div>` },
    ...sources.map(source => ({ key: source.id, label: source.nombre, render: renderComparisonCell }))
  ], rows, "comparison-table");
}

function applyLanguage() {
  document.documentElement.lang = language;
  document.title = t("title");
  document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  document.querySelectorAll("[data-i18n-aria]").forEach(el => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
  document.querySelector('meta[name="description"]').setAttribute("content", t("heading"));
  document.querySelectorAll("[data-language]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.language === language);
    btn.setAttribute("aria-pressed", String(btn.dataset.language === language));
  });
}

document.querySelectorAll("[data-language]").forEach(btn => btn.addEventListener("click", () => {
  language = btn.dataset.language;
  try { localStorage.setItem("iei-language", language); } catch { /* Switching still works without storage. */ }
  renderAll();
}));
setupTabs();
setupSearch();
renderAll();
