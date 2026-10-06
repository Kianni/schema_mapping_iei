const { esquemaGlobal, fuentes } = window.IEI_DATA;

const estados = ["Directo", "Transformación", "Derivar", "Compuesto", "Revisar modelo", "Sin correspondencia"];
let fuenteActiva = fuentes[0]?.id ?? "";
let filtro = "";

const slug = text => String(text ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const esc = value => String(value ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const badge = text => `<span class="badge ${slug(text)}">${esc(text)}</span>`;
const matches = row => !filtro || Object.values(row ?? {}).join(" ").toLowerCase().includes(filtro);
const fuenteActual = () => fuentes.find(f => f.id === fuenteActiva) || fuentes[0];

function tabla(headers, rows) {
  if (!rows?.length) return `<div class="empty-state">No hay resultados para la búsqueda actual.</div>`;
  return `<div class="table-wrap"><table><thead><tr>${headers.map(h => `<th>${esc(h.label)}</th>`).join("")}</tr></thead><tbody>${rows.map(row => `<tr>${headers.map(h => `<td>${h.render ? h.render(row[h.key], row) : esc(row[h.key])}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

function renderSelector(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = fuentes.map(f => `<button class="source-tab ${f.id===fuenteActiva?'active':''}" data-source="${esc(f.id)}">${esc(f.nombre)}</button>`).join("");
  el.querySelectorAll(".source-tab").forEach(btn => btn.addEventListener("click", () => {
    fuenteActiva = btn.dataset.source;
    renderAll();
  }));
}

function renderResumen() {
  const fuente = fuenteActual();
  const globales = esquemaGlobal.Entidad.length + esquemaGlobal.Localidad.length + esquemaGlobal.Provincia.length;
  const cubiertos = new Set((fuente.mapeoGlobal || []).filter(x => x.origen !== "—").map(x => `${x.objeto}.${x.campo}`)).size;
  const tarjetas = [
    [fuentes.length, "fuentes analizadas"],
    [fuente.registros ?? "—", `registros · ${fuente.nombre}`],
    [fuente.campos ?? "—", `campos · ${fuente.nombre}`],
    [`${cubiertos}/${globales}`, "campos globales con fuente o derivación"]
  ];
  document.getElementById("summaryCards").innerHTML = tarjetas.map(([v,l]) => `<div class="card"><div class="value">${esc(v)}</div><div class="label">${esc(l)}</div></div>`).join("");
  renderSelector("summarySourceTabs");
  document.getElementById("quickSummary").innerHTML = (fuente.resumen || []).map(t => `<div class="quick-item"><span class="quick-dot"></span><span>${esc(t)}</span></div>`).join("") || `<div class="empty-state">Esta fuente todavía no tiene un resumen.</div>`;
  document.getElementById("schemaOverview").innerHTML = Object.entries(esquemaGlobal).map(([k,vals]) => `<div class="schema-box"><h3>${esc(k)}</h3><ul>${vals.map(x => `<li><code>${esc(x)}</code></li>`).join("")}</ul></div>`).join("");
}

function renderGlobal() {
  renderSelector("globalSourceTabs");
  document.getElementById("globalLegend").innerHTML = estados.map(badge).join("");
  const fuente = fuenteActual();
  const rows = (fuente.mapeoGlobal || []).filter(matches);
  document.getElementById("globalMapping").innerHTML = tabla([
    {key:"objeto",label:"Objeto"}, {key:"campo",label:"Campo global",render:v=>`<code>${esc(v)}</code>`},
    {key:"origen",label:`Campo(s) · ${fuente.nombre}`,render:v=>`<code>${esc(v)}</code>`},
    {key:"estado",label:"Estado",render:v=>badge(v)}, {key:"regla",label:"Transformación / regla"}, {key:"nota",label:"Evidencia / nota"}
  ], rows);
}

function renderFuentes() {
  renderSelector("sourceTabs");
  const fuente = fuenteActual();
  const rows = (fuente.inventario || []).filter(matches);
  document.getElementById("sourceInventory").innerHTML = tabla([
    {key:"campo",label:"Campo de origen",render:v=>`<code>${esc(v)}</code>`}, {key:"significado",label:"Significado / función"},
    {key:"global",label:"Correspondencia global",render:v=>`<code>${esc(v)}</code>`}, {key:"decision",label:"Decisión",render:v=>badge(v)},
    {key:"hallazgos",label:"Hallazgos clave"}, {key:"regla",label:"Regla de integración"}
  ], rows);
}

function renderAmbitos() {
  renderSelector("ambitoSourceTabs");
  const fuente = fuenteActual();
  const rows = (fuente.ambitos || []).filter(matches);
  document.getElementById("ambitoMapping").innerHTML = tabla([
    {key:"global",label:"Ámbito global",render:v=>`<code>${esc(v)}</code>`},
    {key:"origen",label:`Categoría de origen · ${fuente.nombre}`,render:v=>`<code>${esc(v)}</code>`},
    {key:"estado",label:"Estado",render:v=>badge(v)}, {key:"nota",label:"Nota"}
  ], rows);
}

function renderDecisiones() {
  renderSelector("decisionSourceTabs");
  const fuente = fuenteActual();
  const rows = (fuente.decisiones || []).filter(matches);
  document.getElementById("openDecisions").innerHTML = tabla([
    {key:"tema",label:"Tema"}, {key:"prioridad",label:"Prioridad",render:v=>`<span class="priority ${slug(v)}">${esc(v)}</span>`},
    {key:"evidencia",label:"Evidencia"}, {key:"decision",label:"Decisión necesaria"}
  ], rows);
}

function renderAll() {
  if (!fuentes.length) return;
  renderResumen();
  renderGlobal();
  renderFuentes();
  renderAmbitos();
  renderDecisiones();
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
    filtro = input.value.trim().toLowerCase();
    renderGlobal();
    renderFuentes();
    renderAmbitos();
    renderDecisiones();
  });
}

setupTabs();
setupSearch();
renderAll();
