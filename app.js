// ─── Overlay ───────────────────────────────────────────────────────────────
const OVERLAY_ID = 'oneLoadingOverlay';
function showOverlay(msg) {
  let el = document.getElementById(OVERLAY_ID);
  if (!el) {
    el = document.createElement('div');
    el.id = OVERLAY_ID;
    el.innerHTML = `<div class="ov-inner"><div class="ov-wrap"><div class="ov-glow"></div><div class="ov-arc-a"></div><div class="ov-arc-b"></div><div class="ov-arc-base"></div><img src="img/one-iconocolor.png" class="ov-logo" onerror="this.src='img/one-icononegro.png'"></div><div class="ov-text"><p class="ov-msg" id="ovMsg">Cargando...</p><p class="ov-sub" id="ovSub"></p></div></div>`;
    document.body.appendChild(el);
    const s = document.createElement('style');
    s.id = 'ovStyle';
    s.textContent = `
      #oneLoadingOverlay{position:fixed;inset:0;z-index:9999;background:rgba(2,15,39,.88);backdrop-filter:blur(14px);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .25s;pointer-events:none;}
      #oneLoadingOverlay.visible{opacity:1;pointer-events:auto;}
      .ov-inner{display:flex;flex-direction:column;align-items:center;gap:14px;}
      .ov-wrap{position:relative;width:88px;height:88px;}
      .ov-glow{position:absolute;inset:-10px;border-radius:50%;background:radial-gradient(circle,rgba(34,217,223,.2) 0%,transparent 70%);animation:ovGlow 2s ease-in-out infinite;}
      .ov-arc-a{position:absolute;inset:-4px;border-radius:50%;border:2.5px solid transparent;border-top-color:#22d9df;border-right-color:rgba(34,217,223,.4);animation:ovSpin .8s linear infinite;}
      .ov-arc-b{position:absolute;inset:-4px;border-radius:50%;border:2.5px solid transparent;border-bottom-color:rgba(193,255,114,.3);animation:ovSpin 1.8s linear infinite reverse;}
      .ov-arc-base{position:absolute;inset:-4px;border-radius:50%;border:2.5px solid rgba(34,217,223,.07);}
      .ov-logo{width:88px;height:88px;border-radius:50%;object-fit:cover;position:relative;z-index:2;filter:drop-shadow(0 0 8px rgba(34,217,223,.2));}
      .ov-text{text-align:center;}
      .ov-msg{margin:0;font-size:.92rem;font-weight:600;color:#fff;font-family:'Exo 2',sans-serif;letter-spacing:.02em;}
      .ov-sub{margin:3px 0 0;font-size:.73rem;color:rgba(34,217,223,.75);font-family:'Exo 2',sans-serif;min-height:16px;}
      @keyframes ovSpin{to{transform:rotate(360deg)}}
      @keyframes ovGlow{0%,100%{opacity:.6;transform:scale(1)}50%{opacity:1;transform:scale(1.1)}}
    `;
    document.head.appendChild(s);
  }
  document.getElementById('ovMsg').textContent = msg || 'Cargando...';
  document.getElementById('ovSub').textContent = '';
  el.getBoundingClientRect();
  requestAnimationFrame(() => el.classList.add('visible'));
}
function updateOverlay(sub) { const e = document.getElementById('ovSub'); if (e) e.textContent = sub || ''; }
function hideOverlay() {
  const el = document.getElementById(OVERLAY_ID);
  if (!el) return;
  el.classList.remove('visible');
  setTimeout(() => el?.parentNode?.removeChild(el), 300);
}

// ─── Parámetros por defecto ────────────────────────────────────────────────
// VERSION: se incrementa cada vez que actualizás los defaults para que el
// usuario vea cuándo hubo un cambio en los valores base.
const PARAMS_VERSION = '2025.04';

const DEFAULT_PARAMS = {
  convenio_basico: 1067268,
  adicional_antiguedad_pct: 1,
  presentismo_pct: 8.33,
  aporte_jubilacion_pct: 11,
  aporte_ley_19032_pct: 3,
  aporte_obra_social_pct: 3,
  aporte_sindicato_pct: 2,
  aporte_faecys_pct: 0.5,
  contribuciones_patronales_pct: 24,
  divisor_sueldo: 30,
  divisor_vacaciones: 25,
  horas_base_mes: 200,
  recargo_hs50_pct: 50,
  recargo_hs100_pct: 100,
  sac_divisor: 12,
  criterio_antiguedad_fraccion_mayor_tres_meses: 1,
  empresa: 'Nombre de la empresa',
  convenio_referencia: 'Editable según convenio aplicable'
};

// Metadata de grupos para la UI de parámetros
const PARAM_GROUPS = {
  'Remuneración base': ['convenio_basico','adicional_antiguedad_pct','presentismo_pct'],
  'Aportes del trabajador': ['aporte_jubilacion_pct','aporte_ley_19032_pct','aporte_obra_social_pct','aporte_sindicato_pct','aporte_faecys_pct'],
  'Cargas patronales': ['contribuciones_patronales_pct'],
  'Divisores y horas': ['divisor_sueldo','divisor_vacaciones','horas_base_mes','recargo_hs50_pct','recargo_hs100_pct','sac_divisor','criterio_antiguedad_fraccion_mayor_tres_meses'],
  'Datos del empleador': ['empresa','convenio_referencia']
};

const PARAM_LABELS = {
  convenio_basico: 'Básico de referencia',
  adicional_antiguedad_pct: 'Antigüedad % por año',
  presentismo_pct: 'Presentismo %',
  aporte_jubilacion_pct: 'Aporte jubilación %',
  aporte_ley_19032_pct: 'Aporte Ley 19.032 %',
  aporte_obra_social_pct: 'Aporte obra social %',
  aporte_sindicato_pct: 'Aporte sindicato %',
  aporte_faecys_pct: 'Aporte FAECyS / similar %',
  contribuciones_patronales_pct: 'Contribuciones patronales %',
  divisor_sueldo: 'Divisor sueldo',
  divisor_vacaciones: 'Divisor vacaciones',
  horas_base_mes: 'Horas base del mes',
  recargo_hs50_pct: 'Recargo hs 50%',
  recargo_hs100_pct: 'Recargo hs 100%',
  sac_divisor: 'Divisor SAC',
  criterio_antiguedad_fraccion_mayor_tres_meses: 'Fracción > 3 meses computa año (1=sí / 0=no)',
  empresa: 'Razón social / curso',
  convenio_referencia: 'Convenio de referencia'
};

const DEFAULT_CHECKLIST = [
  { titulo: 'Alta y legajo', items: ['Confirmar modalidad de contratación','Verificar fecha de ingreso real y teórica','Controlar obra social, convenio y categoría','Guardar documentación y constancias'] },
  { titulo: 'Liquidación mensual', items: ['Definir básico y adicionales de convenio','Separar conceptos remunerativos y no remunerativos','Controlar incidencias: horas, licencias, vacaciones, variables','Revisar neto antes de emitir recibo'] },
  { titulo: 'Aportes y contribuciones', items: ['Controlar descuentos del trabajador','Revisar contribuciones patronales','Verificar base imponible usada','Dejar trazabilidad del criterio aplicado'] },
  { titulo: 'Cierre operativo', items: ['Emitir recibos','Controlar carga en sistemas','Revisar declaración jurada y/o LSD','Guardar respaldo de papeles de trabajo'] },
  { titulo: 'Liquidación final', items: ['Identificar tipo de egreso','Calcular proporcional de días, SAC y vacaciones','Evaluar antigüedad computable','Revisar rubros indemnizatorios según caso'] },
  { titulo: 'Control profesional', items: ['Chequear convenio aplicable','Confirmar normativa vigente','Corroborar actualizaciones por reforma o reglamentación','Dejar nota del criterio técnico utilizado'] }
];

// ─── Cache / Storage ───────────────────────────────────────────────────────
const STORAGE_KEY    = 'klp_params_v2';
const STORAGE_META   = 'klp_meta_v2';

function loadParams() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PARAMS };
    return { ...DEFAULT_PARAMS, ...JSON.parse(raw) };
  } catch { return { ...DEFAULT_PARAMS }; }
}

function loadMeta() {
  try {
    const raw = localStorage.getItem(STORAGE_META);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveMeta(version) {
  const meta = { version, savedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_META, JSON.stringify(meta));
  return meta;
}

function saveParams() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
  return saveMeta(PARAMS_VERSION);
}

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('es-AR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
}

// ─── Estado global ────────────────────────────────────────────────────────
let params = loadParams();
let lastMensualData = null;
let lastFinalData   = null;

// ─── Helpers numéricos ────────────────────────────────────────────────────
function money(n) {
  return new Intl.NumberFormat('es-AR', { style:'currency', currency:'ARS', maximumFractionDigits:2 }).format(Number(n||0));
}
function percent(n) { return `${Number(n||0).toFixed(2).replace('.',',')}%`; }
function nv(id) { return Number(document.getElementById(id).value||0); }
function round2(n) { return Math.round((Number(n||0)+Number.EPSILON)*100)/100; }

// ─── Tabs ─────────────────────────────────────────────────────────────────
function switchTab(tab) {
  document.querySelectorAll('.tab-btn,.mtab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
  const panel = document.getElementById('tab-' + tab);
  if (panel) panel.classList.remove('hidden');
}
function tabSetup() {
  document.querySelectorAll('.tab-btn,.mtab').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });
}

// ─── Meta / Banner ────────────────────────────────────────────────────────
function renderMeta() {
  const meta = loadMeta();
  const verEl  = document.getElementById('metaVersion');
  const updEl  = document.getElementById('metaUpdated');
  const bannerText = document.getElementById('paramsBannerText');
  const bannerSub  = document.getElementById('paramsBannerSub');
  const bannerVer  = document.getElementById('paramsBannerVersion');
  const badge      = document.getElementById('updateBadge');
  const badgeText  = document.getElementById('updateBadgeText');

  if (verEl) verEl.textContent = 'v' + PARAMS_VERSION;

  if (meta) {
    if (updEl) updEl.textContent = 'Guardado: ' + formatDate(meta.savedAt);
    if (bannerText) bannerText.textContent = 'Parámetros en caché local';
    if (bannerSub) bannerSub.textContent = 'Última actualización: ' + formatDate(meta.savedAt);
    if (bannerVer) bannerVer.textContent = 'versión ' + (meta.version || '—');
    if (badge) { badge.style.display = 'flex'; }
    if (badgeText) badgeText.textContent = 'Parámetros en caché';
  } else {
    if (updEl) updEl.textContent = 'Usando valores base';
    if (bannerText) bannerText.textContent = 'Valores base del sistema';
    if (bannerSub) bannerSub.textContent = 'Aún no guardaste parámetros personalizados';
    if (bannerVer) bannerVer.textContent = 'v' + PARAMS_VERSION;
    if (badge) badge.style.display = 'none';
  }
}

// ─── Dashboard ────────────────────────────────────────────────────────────
function renderDashboard() {
  document.getElementById('cardBasic').textContent = money(params.convenio_basico);
  const aportes = ['aporte_jubilacion_pct','aporte_ley_19032_pct','aporte_obra_social_pct','aporte_sindicato_pct','aporte_faecys_pct']
    .reduce((s,k) => s + Number(params[k]||0), 0);
  document.getElementById('cardAportes').textContent = percent(aportes);
  document.getElementById('cardContribuciones').textContent = percent(params.contribuciones_patronales_pct);
}

// ─── Parámetros ───────────────────────────────────────────────────────────
function renderParams() {
  const container = document.getElementById('paramsContainer');
  container.innerHTML = '';
  Object.entries(PARAM_GROUPS).forEach(([groupName, keys]) => {
    const sep = document.createElement('div');
    sep.className = 'p-section';
    sep.textContent = groupName;
    container.appendChild(sep);
    keys.forEach(key => {
      const wrap = document.createElement('label');
      wrap.style.cssText = 'display:flex;flex-direction:column;gap:4px;';
      const lbl = document.createElement('span');
      lbl.className = 'p-lbl';
      lbl.textContent = PARAM_LABELS[key] || key;
      const inp = document.createElement('input');
      inp.type = typeof DEFAULT_PARAMS[key] === 'number' ? 'number' : 'text';
      inp.step = '0.01';
      inp.value = params[key];
      inp.dataset.paramKey = key;
      inp.className = 'inp';
      wrap.appendChild(lbl);
      wrap.appendChild(inp);
      container.appendChild(wrap);
    });
  });
}

// ─── Checklist ────────────────────────────────────────────────────────────
function updateCheckProgress() {
  const all = document.querySelectorAll('#checklistGrid input[type="checkbox"]');
  const done = document.querySelectorAll('#checklistGrid input[type="checkbox"]:checked').length;
  const total = all.length;
  const pct = total ? Math.round((done/total)*100) : 0;
  const prog = document.getElementById('checkProgress');
  const bar  = document.getElementById('checkBar');
  if (prog) prog.textContent = done + ' de ' + total + ' completados (' + pct + '%)';
  if (bar) bar.style.width = pct + '%';
}
function renderChecklist() {
  const grid = document.getElementById('checklistGrid');
  grid.innerHTML = '';
  DEFAULT_CHECKLIST.forEach(function(group) {
    const card = document.createElement('div');
    card.className = 'cl-card';
    let html = '<div class="cl-h">' + group.titulo + '</div>';
    group.items.forEach(function(item) {
      html += '<div class="cl-item"><input type="checkbox" /><span>' + item + '</span></div>';
    });
    card.innerHTML = html;
    grid.appendChild(card);
  });
  grid.addEventListener('change', updateCheckProgress);
  updateCheckProgress();
}

// ─── Defaults mensual ────────────────────────────────────────────────────
function setMensualDefaults() {
  document.getElementById('mBasico').value = params.convenio_basico;
}

// ─── Calcular mensual ────────────────────────────────────────────────────
function calcMensual() {
  const basico   = nv('mBasico');
  const antiguAn = nv('mAntiguedadAnios');
  const dias     = nv('mDiasTrabajados');
  const hs50     = nv('mHoras50');
  const hs100    = nv('mHoras100');
  const vars     = nv('mVariables');
  const bonoR    = nv('mBonoRem');
  const bonoNR   = nv('mBonoNoRem');
  const otrosD   = nv('mOtrosDescuentos');

  const basicoProp   = round2((basico / params.divisor_sueldo) * dias);
  const antiguedad   = round2(basicoProp * (params.adicional_antiguedad_pct/100) * antiguAn);
  const presentismo  = round2((basicoProp + antiguedad) * (params.presentismo_pct/100));
  const valorHora    = basico / params.horas_base_mes;
  const extra50      = round2(hs50  * valorHora * (1 + params.recargo_hs50_pct/100));
  const extra100     = round2(hs100 * valorHora * (1 + params.recargo_hs100_pct/100));

  const remunerativo  = round2(basicoProp + antiguedad + presentismo + extra50 + extra100 + vars + bonoR);
  const noRemunerativo = round2(bonoNR);

  const descJub   = round2(remunerativo * (params.aporte_jubilacion_pct/100));
  const desc19    = round2(remunerativo * (params.aporte_ley_19032_pct/100));
  const descOS    = round2(remunerativo * (params.aporte_obra_social_pct/100));
  const descSind  = round2(remunerativo * (params.aporte_sindicato_pct/100));
  const descFaec  = round2(remunerativo * (params.aporte_faecys_pct/100));
  const descuentos = round2(descJub + desc19 + descOS + descSind + descFaec + otrosD);
  const neto      = round2(remunerativo + noRemunerativo - descuentos);

  document.getElementById('rRemunerativo').textContent   = money(remunerativo);
  document.getElementById('rNoRemunerativo').textContent = money(noRemunerativo);
  document.getElementById('rDescuentos').textContent     = money(descuentos);
  document.getElementById('rNeto').textContent           = money(neto);

  const rows = [
    { label:'Básico proporcional',  val:basicoProp,   tipo:'rem' },
    { label:'Antigüedad',           val:antiguedad,   tipo:'rem' },
    { label:'Presentismo',          val:presentismo,  tipo:'rem' },
    { label:'Horas extra 50%',      val:extra50,      tipo:'rem' },
    { label:'Horas extra 100%',     val:extra100,     tipo:'rem' },
    { label:'Comisiones/variables', val:vars,         tipo:'rem' },
    { label:'Bono remunerativo',    val:bonoR,        tipo:'rem' },
    { label:'Bono no remunerativo', val:bonoNR,       tipo:'norem' },
    { label:'— Jubilación',         val:-descJub,     tipo:'desc' },
    { label:'— Ley 19.032',         val:-desc19,      tipo:'desc' },
    { label:'— Obra social',        val:-descOS,      tipo:'desc' },
    { label:'— Sindicato',          val:-descSind,    tipo:'desc' },
    { label:'— FAECyS/similar',     val:-descFaec,    tipo:'desc' },
    { label:'— Otros descuentos',   val:-otrosD,      tipo:'desc' },
    { label:'NETO ESTIMADO',        val:neto,         tipo:'total' }
  ];

  document.getElementById('mensualBreakdown').innerHTML = rows.map(r => {
    const isTotal = r.tipo === 'total';
    const cls = isTotal ? 'total-row' : '';
    const col = r.tipo === 'desc' ? 'class="neg-td"' : '';
    return `<tr class="${cls}"><td>${r.label}</td><td ${col}>${money(r.val)}</td></tr>`;
  }).join('');

  lastMensualData = {
    nombre: document.getElementById('mNombre').value || '—',
    categoria: document.getElementById('mCategoria').value || '—',
    empresa: params.empresa,
    convenio: params.convenio_referencia,
    basico, antiguAn, dias, remunerativo, noRemunerativo, descuentos, neto,
    rows, tipo: 'mensual'
  };
}

// ─── Calcular final ───────────────────────────────────────────────────────
function yearsForIndem(startDate, endDate, applyFrac) {
  if (!startDate || !endDate) return 0;
  const s = new Date(startDate+'T00:00:00');
  const e = new Date(endDate+'T00:00:00');
  if (isNaN(s)||isNaN(e)||e<s) return 0;
  const months = (e.getFullYear()-s.getFullYear())*12 + (e.getMonth()-s.getMonth()) + (e.getDate()>=s.getDate()?0:-1);
  const years  = Math.floor(months/12);
  const rem    = months%12;
  if (applyFrac && rem>3) return years+1;
  return Math.max(0,years);
}

function calcFinal() {
  const tipo        = document.getElementById('fTipo').value;
  const mejorRem    = nv('fMejorRem');
  const ingreso     = document.getElementById('fIngreso').value;
  const egreso      = document.getElementById('fEgreso').value;
  const diasMes     = nv('fDiasMes');
  const vacPend     = nv('fVacPend');
  const mesesSac    = nv('fMesesSac');
  const preavisoM   = nv('fPreaviso');

  const antiguedad   = yearsForIndem(ingreso, egreso, Number(params.criterio_antiguedad_fraccion_mayor_tres_meses)===1);
  const diasTrab     = round2((mejorRem/params.divisor_sueldo)*diasMes);
  const sacProp      = round2((mejorRem/params.sac_divisor)*(mesesSac/6));
  const vacNoGoz     = round2((mejorRem/params.divisor_vacaciones)*vacPend);
  let indemAntig = 0, preaviso = 0, integracion = 0;
  if (tipo === 'despido_sin_causa') {
    indemAntig = round2(mejorRem * antiguedad);
    preaviso   = round2(mejorRem * preavisoM);
  }
  const total = round2(diasTrab + sacProp + vacNoGoz + indemAntig + preaviso + integracion);

  document.getElementById('fAntiguedadCalc').textContent = antiguedad + ' año/s';
  document.getElementById('fTotal').textContent = money(total);

  const rows = [
    { label:'Días trabajados del mes',      val: diasTrab   },
    { label:'SAC proporcional',             val: sacProp    },
    { label:'Vacaciones no gozadas',        val: vacNoGoz   },
    { label:'Indemnización por antigüedad', val: indemAntig },
    { label:'Preaviso',                     val: preaviso   },
    { label:'Integración mes de despido',   val: integracion },
    { label:'TOTAL ESTIMADO',               val: total      }
  ];

  document.getElementById('finalBreakdown').innerHTML = rows.map((r,i) => {
    const isTotal = i === rows.length-1;
    return `<tr class="${isTotal?'total-row':''}"><td>${r.label}</td><td>${money(r.val)}</td></tr>`;
  }).join('');

  lastFinalData = {
    empresa: params.empresa,
    convenio: params.convenio_referencia,
    tipo: tipo.replaceAll('_',' '),
    ingreso, egreso, mejorRem, antiguedad,
    diasTrab, sacProp, vacNoGoz, indemAntig, preaviso, integracion, total,
    rows, tipoCalc: 'final'
  };
}

// ─── Export PDF — Recibo ──────────────────────────────────────────────────
function buildPDF(data) {
  const now = new Date();
  const fechaEmision = now.toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'numeric'});
  const horaEmision  = now.toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'});
  const referencia   = 'KLP-' + now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + Math.floor(Math.random()*900+100);
  const esM = data.tipo === 'mensual';

  const filas = (data.rows || []).map(r => {
    const neg = r.val !== undefined && r.val < 0;
    const val = r.val !== undefined ? r.val : r[1];
    return `<tr style="border-bottom:1px solid #e8e8e8;">
      <td style="padding:6px 10px; font-size:12px; color:#333;">${r.label || r[0]}</td>
      <td style="padding:6px 10px; text-align:right; font-size:12px; font-weight:500; color:${neg?'#c0392b':'#111'};">${money(val)}</td>
    </tr>`;
  }).join('');

  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:Arial,Helvetica,sans-serif;background:#fff;color:#111;font-size:13px;}
    .page{width:210mm;min-height:297mm;margin:0 auto;padding:18mm 16mm;}
    .header-bar{background:#020f27;color:#fff;padding:10px 16px;display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}
    .header-bar .doc-title{font-size:14px;font-weight:700;letter-spacing:.02em;}
    .header-bar .doc-sub{font-size:11px;color:#a0c4d8;margin-top:2px;}
    .header-bar .ref-box{text-align:right;font-size:10px;color:#a0c4d8;}
    .section-bar{background:#0b4a6e;color:#fff;padding:5px 10px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin:12px 0 6px;}
    .info-table{width:100%;border-collapse:collapse;font-size:11px;}
    .info-table td{padding:5px 8px;border:1px solid #ddd;}
    .info-table td:first-child{font-weight:600;background:#f5f5f5;width:38%;}
    .breakdown-table{width:100%;border-collapse:collapse;margin-top:2px;}
    .breakdown-table thead tr{background:#020f27;color:#fff;}
    .breakdown-table thead td{padding:7px 10px;font-size:11px;font-weight:700;}
    .breakdown-table tbody tr:nth-child(even){background:#f9f9f9;}
    .total-row-pdf td{background:#020f27!important;color:#fff!important;font-weight:700;font-size:13px;}
    .total-row-pdf td:last-child{color:#22d9df!important;}
    .aviso-box{border:1px solid #f6d860;background:#fffbeb;padding:10px 12px;margin-top:14px;font-size:10px;color:#78350f;line-height:1.5;}
    .footer-strip{background:#020f27;color:#a0c4d8;font-size:9px;padding:8px 16px;margin-top:18px;display:flex;justify-content:space-between;}
    .cut-line{border:none;border-top:1px dashed #bbb;margin:22px 0;position:relative;}
    .cut-icon{position:absolute;left:-8px;top:-7px;font-size:14px;}
    .resumen-mini{background:#f5f5f5;border:1px solid #ddd;padding:10px 14px;font-size:11px;margin-top:12px;}
    .resumen-mini table{width:100%;border-collapse:collapse;}
    .resumen-mini td{padding:4px 8px;}
    .resumen-mini td:last-child{text-align:right;font-weight:600;}
    @media print{.page{padding:12mm 10mm;}}
  </style></head><body>
  <div class="page">

    <!-- ENCABEZADO -->
    <div class="header-bar">
      <div>
        <div class="doc-title">Recibo de Liquidación — ${esM ? 'Liquidación Mensual' : 'Liquidación Final'}</div>
        <div class="doc-sub">Documento generado a partir de Kit Online de Liquidación · Uso educativo/profesional</div>
      </div>
      <div class="ref-box">
        <div style="font-size:12px;font-weight:700;color:#22d9df;">${referencia}</div>
        <div>Fecha: ${fechaEmision} · ${horaEmision}</div>
        <div>Página 1 de 1</div>
      </div>
    </div>

    <!-- DATOS DEL EMPLEADOR -->
    <div class="section-bar">Datos identificativos</div>
    <table class="info-table">
      <tr><td>Razón Social / Organización</td><td>${data.empresa || '—'}</td><td>Convenio de referencia</td><td>${data.convenio || '—'}</td></tr>
      <tr><td>Tipo de liquidación</td><td>${esM ? 'Liquidación mensual' : 'Liquidación final — ' + (data.tipo||'')}</td><td>Referencia del documento</td><td>${referencia}</td></tr>
      ${esM ? `<tr><td>Nombre del caso</td><td>${data.nombre||'—'}</td><td>Categoría</td><td>${data.categoria||'—'}</td></tr>
              <tr><td>Básico de referencia</td><td>${money(data.basico)}</td><td>Días trabajados</td><td>${data.dias||'—'}</td></tr>
              <tr><td>Antigüedad (años)</td><td>${data.antiguAn||0}</td><td>Versión de parámetros</td><td>${PARAMS_VERSION}</td></tr>`
            : `<tr><td>Fecha de ingreso</td><td>${data.ingreso||'—'}</td><td>Fecha de egreso</td><td>${data.egreso||'—'}</td></tr>
              <tr><td>Mejor remuneración mensual</td><td>${money(data.mejorRem)}</td><td>Antigüedad computable</td><td>${data.antiguedad||0} año/s</td></tr>
              <tr><td>Versión de parámetros</td><td>${PARAMS_VERSION}</td><td>&nbsp;</td><td>&nbsp;</td></tr>`}
    </table>

    <!-- DETALLE DE CONCEPTOS -->
    <div class="section-bar">Detalle de conceptos</div>
    <table class="breakdown-table">
      <thead><tr><td>Descripción</td><td style="text-align:right;">Importe (ARS)</td></tr></thead>
      <tbody>${filas}</tbody>
    </table>

    ${esM ? `
    <!-- RESUMEN DE TOTALES -->
    <div class="section-bar">Resumen</div>
    <div class="resumen-mini">
      <table>
        <tr><td>Total remunerativo</td><td>${money(data.remunerativo)}</td><td style="width:50%;">Total no remunerativo</td><td>${money(data.noRemunerativo)}</td></tr>
        <tr><td>Total descuentos</td><td style="color:#c0392b;">${money(data.descuentos)}</td><td><strong>NETO A COBRAR</strong></td><td style="font-size:14px;color:#020f27;font-weight:700;">${money(data.neto)}</td></tr>
      </table>
    </div>` : `
    <div class="section-bar">Total a liquidar</div>
    <div class="resumen-mini">
      <table><tr><td><strong>TOTAL ESTIMADO</strong></td><td style="font-size:14px;color:#020f27;font-weight:700;">${money(data.total)}</td></tr></table>
    </div>`}

    <!-- AVISO LEGAL -->
    <div class="aviso-box">
      <strong>Nota:</strong> Este recibo es de carácter educativo/estimativo. Los importes son calculados con los parámetros configurados en la herramienta y pueden no reflejar la normativa vigente al momento de la liquidación real. Ante cualquier duda, verificar con el profesional habilitado y la normativa convencional y legal aplicable.
    </div>

    <!-- LÍNEA DE CORTE -->
    <hr class="cut-line"><span class="cut-icon" style="left:0;top:-8px;">✂</span>

    <!-- TALÓN -->
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;font-size:11px;">
      <div>
        <strong>${referencia}</strong> · ${fechaEmision}<br/>
        <span style="color:#666;">${data.empresa||'—'} · ${data.convenio||'—'}</span>
      </div>
      <div style="text-align:right;">
        ${esM ? `Neto estimado: <strong style="font-size:13px;">${money(data.neto)}</strong>` : `Total: <strong style="font-size:13px;">${money(data.total)}</strong>`}
      </div>
    </div>

    <!-- FOOTER -->
    <div class="footer-strip">
      <span>Generado con Kit Online de Liquidación · Parámetros v${PARAMS_VERSION}</span>
      <span>${fechaEmision} ${horaEmision} · Documento de uso educativo y profesional</span>
    </div>

  </div>
  </body></html>`;

  const win = window.open('','_blank');
  if (!win) { alert('Habilitá las ventanas emergentes para exportar el PDF.'); return; }
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 600);
}

function exportMensualPDF() {
  if (!lastMensualData) { alert('Primero calculá la liquidación mensual.'); return; }
  buildPDF(lastMensualData);
}
function exportFinalPDF() {
  if (!lastFinalData) { alert('Primero calculá la liquidación final.'); return; }
  buildPDF(lastFinalData);
}

// ─── Copy ─────────────────────────────────────────────────────────────────
function copyText(data) {
  if (!data) { alert('Primero calculá.'); return; }
  let text;
  if (data.tipo === 'mensual') {
    text = `LIQUIDACIÓN MENSUAL\nCaso: ${data.nombre} | Cat: ${data.categoria}\nRemunerativo: ${money(data.remunerativo)}\nNo remunerativo: ${money(data.noRemunerativo)}\nDescuentos: ${money(data.descuentos)}\nNeto estimado: ${money(data.neto)}`;
  } else {
    text = `LIQUIDACIÓN FINAL\nTipo: ${data.tipo}\nAntigüedad: ${data.antiguedad} año/s\nTotal estimado: ${money(data.total)}`;
  }
  navigator.clipboard.writeText(text).then(() => alert('Resumen copiado al portapapeles.'));
}

// ─── Export/Import JSON ──────────────────────────────────────────────────
function exportJson() {
  const blob = new Blob([JSON.stringify(params,null,2)],{type:'application/json'});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = 'kit-laboral-params-' + PARAMS_VERSION + '.json';
  a.click();
  URL.revokeObjectURL(url);
}
function importJson(file) {
  const r = new FileReader();
  r.onload = e => {
    try {
      params = { ...DEFAULT_PARAMS, ...JSON.parse(e.target.result) };
      saveParams();
      renderAll();
      alert('Parámetros importados correctamente.');
    } catch { alert('El archivo no contiene un JSON válido.'); }
  };
  r.readAsText(file);
}

// ─── Eventos ──────────────────────────────────────────────────────────────
function attachEvents() {
  document.getElementById('btnCalcularMensual').addEventListener('click', calcMensual);
  document.getElementById('btnCopiarMensual').addEventListener('click', () => copyText(lastMensualData));
  document.getElementById('btnExportarMensualPDF').addEventListener('click', exportMensualPDF);
  document.getElementById('btnCalcularFinal').addEventListener('click', calcFinal);
  document.getElementById('btnCopiarFinal').addEventListener('click', () => copyText(lastFinalData));
  document.getElementById('btnExportarFinalPDF').addEventListener('click', exportFinalPDF);

  document.getElementById('btnGuardarParams').addEventListener('click', () => {
    document.querySelectorAll('[data-param-key]').forEach(inp => {
      const k = inp.dataset.paramKey;
      params[k] = typeof DEFAULT_PARAMS[k] === 'number' ? Number(inp.value||0) : inp.value;
    });
    saveParams();
    renderAll();
    alert('Parámetros guardados en caché local.');
  });

  document.getElementById('btnRestaurar').addEventListener('click', () => {
    if (!confirm('¿Restaurar los parámetros base? Se perderán los cambios guardados.')) return;
    params = { ...DEFAULT_PARAMS };
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_META);
    renderAll();
    alert('Parámetros restaurados a valores base.');
  });

  document.getElementById('btnExportar').addEventListener('click', exportJson);
  document.getElementById('importFile').addEventListener('change', e => {
    const file = e.target.files?.[0];
    if (file) importJson(file);
  });
}

// ─── Render all ───────────────────────────────────────────────────────────
function renderAll() {
  renderDashboard();
  renderParams();
  renderChecklist();
  renderMeta();
  setMensualDefaults();
  calcMensual();
  calcFinal();
}

// ─── Init ─────────────────────────────────────────────────────────────────
showOverlay('Iniciando Kit Online de Liquidación…');
updateOverlay('ONE · Human-Tech');
tabSetup();
attachEvents();
renderAll();
setTimeout(hideOverlay, 1000);