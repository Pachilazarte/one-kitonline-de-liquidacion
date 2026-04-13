// ─── Overlay de carga ─────────────────────────────────────────────────────
const OVERLAY_ID = 'oneLoadingOverlay';

function showOverlay(mensaje) {
  let el = document.getElementById(OVERLAY_ID);
  if (!el) {
    el = document.createElement('div');
    el.id = OVERLAY_ID;
    el.innerHTML = `
      <div class="overlay-inner">
        <div class="overlay-logo-wrap">
          <div class="overlay-glow"></div>
          <div class="overlay-arc-outer"></div>
          <div class="overlay-arc-inner"></div>
          <div class="overlay-arc-base"></div>
          <img src="img/one-iconocolor.png" alt="ONE" class="overlay-logo"
               onerror="this.src='img/one-icononegro.png'">
        </div>
        <div class="overlay-text">
          <p class="overlay-msg" id="overlayMsg">Cargando...</p>
          <p class="overlay-sub" id="overlaySub"></p>
        </div>
      </div>`;
    document.body.appendChild(el);

    if (!document.getElementById('oneOverlayStyles')) {
      const style = document.createElement('style');
      style.id = 'oneOverlayStyles';
      style.textContent = `
        #oneLoadingOverlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(0, 0, 0, 0.78);
          backdrop-filter: blur(14px) saturate(1.3);
          -webkit-backdrop-filter: blur(14px) saturate(1.3);
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity .25s ease;
          pointer-events: none;
        }
        #oneLoadingOverlay.visible {
          opacity: 1; pointer-events: auto;
        }
        .overlay-inner {
          display: flex; flex-direction: column;
          align-items: center; gap: 14px;
        }
        .overlay-logo-wrap {
          position: relative;
          width: 90px; height: 90px;
        }
        .overlay-glow {
          position: absolute; inset: -10px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(225,123,215,0.2) 0%, transparent 70%);
          animation: ovGlow 2s ease-in-out infinite;
          pointer-events: none;
        }
        .overlay-arc-outer {
          position: absolute; inset: -4px;
          border-radius: 50%;
          border: 2.5px solid transparent;
          border-top-color: #e17bd7;
          border-right-color: rgba(225, 123, 215, 0.5);
          animation: ovSpin .8s linear infinite;
        }
        .overlay-arc-inner {
          position: absolute; inset: -4px;
          border-radius: 50%;
          border: 2.5px solid transparent;
          border-bottom-color: rgba(200, 100, 240, 0.3);
          animation: ovSpin 1.8s linear infinite reverse;
        }
        .overlay-arc-base {
          position: absolute; inset: -4px;
          border-radius: 50%;
          border: 2.5px solid rgba(225, 123, 215, 0.08);
        }
        .overlay-logo {
          width: 90px; height: 90px;
          border-radius: 50%;
          object-fit: cover;
          position: relative; z-index: 2;
          display: block;
          filter: drop-shadow(0 0 8px rgba(225, 123, 215, 0.25));
        }
        .overlay-text { text-align: center; line-height: 1.4; }
        .overlay-msg {
          margin: 0; font-size: .93rem; font-weight: 600;
          color: rgba(255, 255, 255, .9);
          font-family: 'Exo 2', system-ui, sans-serif;
          letter-spacing: .02em;
        }
        .overlay-sub {
          margin: 3px 0 0; font-size: .75rem;
          color: rgba(225, 123, 215, .72);
          font-family: 'Exo 2', system-ui, sans-serif;
          letter-spacing: .03em;
          min-height: 16px;
        }
        @keyframes ovSpin  { to { transform: rotate(360deg); } }
        @keyframes ovGlow  {
          0%, 100% { opacity: .6; transform: scale(1); }
          50%      { opacity: 1;  transform: scale(1.1); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  document.getElementById('overlayMsg').textContent = mensaje || 'Cargando...';
  document.getElementById('overlaySub').textContent = '';
  el.getBoundingClientRect();
  requestAnimationFrame(() => el.classList.add('visible'));
}

function updateOverlay(sub) {
  const el = document.getElementById('overlaySub');
  if (el) el.textContent = sub || '';
}

function hideOverlay() {
  const el = document.getElementById(OVERLAY_ID);
  if (!el) return;
  el.classList.remove('visible');
  setTimeout(() => el?.parentNode?.removeChild(el), 300);
}

// ─── Datos por defecto ─────────────────────────────────────────────────────
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
  empresa: 'Tu organización / curso',
  convenio_referencia: 'Editable según convenio aplicable'
};

const DEFAULT_CHECKLIST = [
  {
    titulo: 'Alta y legajo',
    items: [
      'Confirmar modalidad de contratación',
      'Verificar fecha de ingreso real y teórica',
      'Controlar obra social, convenio y categoría',
      'Guardar documentación y constancias'
    ]
  },
  {
    titulo: 'Liquidación mensual',
    items: [
      'Definir básico y adicionales de convenio',
      'Separar conceptos remunerativos y no remunerativos',
      'Controlar incidencias: horas, licencias, vacaciones, variables',
      'Revisar neto antes de emitir recibo'
    ]
  },
  {
    titulo: 'Aportes y contribuciones',
    items: [
      'Controlar descuentos del trabajador',
      'Revisar contribuciones patronales',
      'Verificar base imponible usada',
      'Dejar trazabilidad del criterio aplicado'
    ]
  },
  {
    titulo: 'Cierre operativo',
    items: [
      'Emitir recibos',
      'Controlar carga en sistemas',
      'Revisar declaración jurada y/o LSD',
      'Guardar respaldo de papeles de trabajo'
    ]
  },
  {
    titulo: 'Liquidación final',
    items: [
      'Identificar tipo de egreso',
      'Calcular proporcional de días, SAC y vacaciones',
      'Evaluar antigüedad computable',
      'Revisar rubros indemnizatorios según caso'
    ]
  },
  {
    titulo: 'Control profesional',
    items: [
      'Chequear convenio aplicable',
      'Confirmar normativa vigente',
      'Corroborar actualizaciones por reforma o reglamentación',
      'Dejar nota del criterio técnico utilizado'
    ]
  }
];

const storageKeys = { params: 'kit_laboral_params_v1' };
let params = loadParams();
let lastMensualText = '';
let lastFinalText = '';

// ─── Helpers ───────────────────────────────────────────────────────────────
function loadParams() {
  const saved = localStorage.getItem(storageKeys.params);
  if (!saved) return { ...DEFAULT_PARAMS };
  try { return { ...DEFAULT_PARAMS, ...JSON.parse(saved) }; }
  catch { return { ...DEFAULT_PARAMS }; }
}

function saveParams() {
  localStorage.setItem(storageKeys.params, JSON.stringify(params));
}

function money(n) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency', currency: 'ARS', maximumFractionDigits: 2
  }).format(Number(n || 0));
}

function percent(n) {
  return `${Number(n || 0).toFixed(2).replace('.', ',')}%`;
}

function numberValue(id) {
  return Number(document.getElementById(id).value || 0);
}

function round2(n) {
  return Math.round((Number(n || 0) + Number.EPSILON) * 100) / 100;
}

// ─── Tabs ──────────────────────────────────────────────────────────────────
function switchTab(tab) {
  // Sidebar buttons
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tab);
  });
  // Mobile tabs
  document.querySelectorAll('.mtab').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tab);
  });
  // Panels
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
  document.getElementById(`tab-${tab}`)?.classList.remove('hidden');
}

function tabSetup() {
  document.querySelectorAll('.tab-btn, .mtab').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });
}

// ─── Dashboard ─────────────────────────────────────────────────────────────
function renderDashboard() {
  document.getElementById('cardBasic').textContent = money(params.convenio_basico);
  const aportes =
    Number(params.aporte_jubilacion_pct) +
    Number(params.aporte_ley_19032_pct) +
    Number(params.aporte_obra_social_pct) +
    Number(params.aporte_sindicato_pct) +
    Number(params.aporte_faecys_pct);
  document.getElementById('cardAportes').textContent = percent(aportes);
  document.getElementById('cardContribuciones').textContent = percent(params.contribuciones_patronales_pct);
}

// ─── Parámetros ────────────────────────────────────────────────────────────
function renderParams() {
  const container = document.getElementById('paramsContainer');
  container.innerHTML = '';
  const labels = {
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
    criterio_antiguedad_fraccion_mayor_tres_meses: 'Fracción > 3 meses (1 sí / 0 no)',
    empresa: 'Nombre de empresa / curso',
    convenio_referencia: 'Convenio de referencia'
  };

  Object.keys(DEFAULT_PARAMS).forEach(key => {
    const wrapper = document.createElement('label');
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.gap = '6px';

    const span = document.createElement('span');
    span.className = 'p-lbl';
    span.textContent = labels[key] || key;

    let input;
    if (typeof DEFAULT_PARAMS[key] === 'number') {
      input = document.createElement('input');
      input.type = 'number';
      input.step = '0.01';
    } else {
      input = document.createElement('input');
      input.type = 'text';
    }
    input.value = params[key];
    input.dataset.paramKey = key;
    input.className = 'inp';

    wrapper.appendChild(span);
    wrapper.appendChild(input);
    container.appendChild(wrapper);
  });
}

// ─── Checklist ─────────────────────────────────────────────────────────────
function updateCheckProgress() {
  const all = document.querySelectorAll('#checklistGrid input[type="checkbox"]');
  const checked = document.querySelectorAll('#checklistGrid input[type="checkbox"]:checked');
  const total = all.length;
  const done = checked.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const prog = document.getElementById('checkProgress');
  const bar = document.getElementById('checkBar');
  if (prog) prog.textContent = done + ' de ' + total + ' completados';
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

// ─── Mensual ───────────────────────────────────────────────────────────────
function setMensualDefaults() {
  document.getElementById('mBasico').value = params.convenio_basico;
}

function calcMensual() {
  const basico = numberValue('mBasico');
  const antiguedadAnios = numberValue('mAntiguedadAnios');
  const diasTrabajados = numberValue('mDiasTrabajados');
  const hs50 = numberValue('mHoras50');
  const hs100 = numberValue('mHoras100');
  const variables = numberValue('mVariables');
  const bonoRem = numberValue('mBonoRem');
  const bonoNoRem = numberValue('mBonoNoRem');
  const otrosDescuentos = numberValue('mOtrosDescuentos');

  const basicoProporcional = round2((basico / params.divisor_sueldo) * diasTrabajados);
  const antiguedad = round2(basicoProporcional * (params.adicional_antiguedad_pct / 100) * antiguedadAnios);
  const presentismoBase = basicoProporcional + antiguedad;
  const presentismo = round2(presentismoBase * (params.presentismo_pct / 100));
  const valorHora = basico / params.horas_base_mes;
  const extra50 = round2(hs50 * valorHora * (1 + params.recargo_hs50_pct / 100));
  const extra100 = round2(hs100 * valorHora * (1 + params.recargo_hs100_pct / 100));

  const remunerativo = round2(basicoProporcional + antiguedad + presentismo + extra50 + extra100 + variables + bonoRem);
  const noRemunerativo = round2(bonoNoRem);

  const descJub = round2(remunerativo * (params.aporte_jubilacion_pct / 100));
  const desc19032 = round2(remunerativo * (params.aporte_ley_19032_pct / 100));
  const descOS = round2(remunerativo * (params.aporte_obra_social_pct / 100));
  const descSind = round2(remunerativo * (params.aporte_sindicato_pct / 100));
  const descFaecys = round2(remunerativo * (params.aporte_faecys_pct / 100));
  const descuentos = round2(descJub + desc19032 + descOS + descSind + descFaecys + otrosDescuentos);
  const neto = round2(remunerativo + noRemunerativo - descuentos);

  document.getElementById('rRemunerativo').textContent = money(remunerativo);
  document.getElementById('rNoRemunerativo').textContent = money(noRemunerativo);
  document.getElementById('rDescuentos').textContent = money(descuentos);
  document.getElementById('rNeto').textContent = money(neto);

  const breakdown = [
    ['Básico proporcional', basicoProporcional],
    ['Antigüedad', antiguedad],
    ['Presentismo', presentismo],
    ['Horas extra 50%', extra50],
    ['Horas extra 100%', extra100],
    ['Variables', variables],
    ['Bono remunerativo', bonoRem],
    ['Bono no remunerativo', bonoNoRem],
    ['Jubilación', -descJub],
    ['Ley 19.032', -desc19032],
    ['Obra social', -descOS],
    ['Sindicato', -descSind],
    ['FAECyS / similar', -descFaecys],
    ['Otros descuentos', -otrosDescuentos],
    ['Neto estimado', neto]
  ];

  document.getElementById('mensualBreakdown').innerHTML = breakdown.map((row, i) => {
    const isLast = i === breakdown.length - 1;
    const className = isLast ? 'breakdown-last' : 'breakdown-row';
    const valueColor = isLast ? '#e17bd7' : (Number(row[1]) < 0 ? '#f87171' : '#e2e2f0');
    return `
      <tr class="${className}">
        <td style="color: ${isLast ? '#e17bd7' : '#9a9ab8'};">${row[0]}</td>
        <td style="text-align:right; color:${valueColor};">${money(row[1])}</td>
      </tr>
    `;
  }).join('');

  lastMensualText = [
    'Resumen de liquidación mensual',
    `Caso: ${document.getElementById('mNombre').value || '-'} | Categoría: ${document.getElementById('mCategoria').value || '-'}`,
    `Remunerativo: ${money(remunerativo)}`,
    `No remunerativo: ${money(noRemunerativo)}`,
    `Descuentos: ${money(descuentos)}`,
    `Neto estimado: ${money(neto)}`
  ].join('\n');
}

// ─── Final ─────────────────────────────────────────────────────────────────
function yearsForIndemnizacion(startDate, endDate, applyFraction) {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T00:00:00');
  if (isNaN(start) || isNaN(end) || end < start) return 0;
  const totalMonths =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth()) +
    (end.getDate() >= start.getDate() ? 0 : -1);
  const years = Math.floor(totalMonths / 12);
  const remMonths = totalMonths % 12;
  if (applyFraction && remMonths > 3) return years + 1;
  return Math.max(0, years);
}

function calcFinal() {
  const tipo = document.getElementById('fTipo').value;
  const mejorRem = numberValue('fMejorRem');
  const ingreso = document.getElementById('fIngreso').value;
  const egreso = document.getElementById('fEgreso').value;
  const diasMes = numberValue('fDiasMes');
  const vacPend = numberValue('fVacPend');
  const mesesSac = numberValue('fMesesSac');
  const preavisoMeses = numberValue('fPreaviso');

  const antiguedad = yearsForIndemnizacion(
    ingreso, egreso,
    Number(params.criterio_antiguedad_fraccion_mayor_tres_meses) === 1
  );
  const diasTrabajados = round2((mejorRem / params.divisor_sueldo) * diasMes);
  const sacProporcional = round2((mejorRem / params.sac_divisor) * (mesesSac / 6));
  const vacNoGozadas = round2((mejorRem / params.divisor_vacaciones) * vacPend);

  let indemnizacionAntiguedad = 0;
  let preaviso = 0;
  let integracionMesDespido = 0;

  if (tipo === 'despido_sin_causa') {
    indemnizacionAntiguedad = round2(mejorRem * antiguedad);
    preaviso = round2(mejorRem * preavisoMeses);
  }

  const total = round2(diasTrabajados + sacProporcional + vacNoGozadas + indemnizacionAntiguedad + preaviso + integracionMesDespido);

  document.getElementById('fAntiguedadCalc').textContent = antiguedad;
  document.getElementById('fTotal').textContent = money(total);

  const breakdown = [
    ['Días trabajados del mes', diasTrabajados],
    ['SAC proporcional', sacProporcional],
    ['Vacaciones no gozadas', vacNoGozadas],
    ['Indemnización por antigüedad', indemnizacionAntiguedad],
    ['Preaviso', preaviso],
    ['Integración mes despido', integracionMesDespido],
    ['Total estimado', total]
  ];

  document.getElementById('finalBreakdown').innerHTML = breakdown.map((row, i) => {
    const isLast = i === breakdown.length - 1;
    const className = isLast ? 'breakdown-last' : 'breakdown-row';
    const valueColor = isLast ? '#e17bd7' : '#e2e2f0';
    return `
      <tr class="${className}">
        <td style="color: ${isLast ? '#e17bd7' : '#9a9ab8'};">${row[0]}</td>
        <td style="text-align:right; color:${valueColor};">${money(row[1])}</td>
      </tr>
    `;
  }).join('');

  lastFinalText = [
    'Resumen de liquidación final',
    `Tipo: ${tipo.replaceAll('_', ' ')}`,
    `Antigüedad computable: ${antiguedad}`,
    `Total estimado: ${money(total)}`
  ].join('\n');
}

// ─── Utilidades ────────────────────────────────────────────────────────────
function copyText(text) {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => alert('Resumen copiado.'));
}

function exportJson() {
  const blob = new Blob([JSON.stringify(params, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'kit-laboral-parametros.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importJson(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      params = { ...DEFAULT_PARAMS, ...imported };
      saveParams();
      renderAll();
      alert('Parámetros importados correctamente.');
    } catch {
      alert('El archivo no tiene un JSON válido.');
    }
  };
  reader.readAsText(file);
}

// ─── Eventos ───────────────────────────────────────────────────────────────
function attachEvents() {
  document.getElementById('btnCalcularMensual').addEventListener('click', calcMensual);
  document.getElementById('btnCopiarMensual').addEventListener('click', () => copyText(lastMensualText));
  document.getElementById('btnCalcularFinal').addEventListener('click', calcFinal);
  document.getElementById('btnCopiarFinal').addEventListener('click', () => copyText(lastFinalText));

  document.getElementById('btnGuardarParams').addEventListener('click', () => {
    document.querySelectorAll('[data-param-key]').forEach(input => {
      const key = input.dataset.paramKey;
      params[key] = typeof DEFAULT_PARAMS[key] === 'number'
        ? Number(input.value || 0)
        : input.value;
    });
    saveParams();
    renderAll();
    alert('Parámetros guardados.');
  });

  document.getElementById('btnRestaurar').addEventListener('click', () => {
    if (!confirm('¿Querés restaurar los parámetros base?')) return;
    params = { ...DEFAULT_PARAMS };
    saveParams();
    renderAll();
  });

  document.getElementById('btnExportar').addEventListener('click', exportJson);

  document.getElementById('importFile').addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) importJson(file);
  });
}

// ─── Render general ────────────────────────────────────────────────────────
function renderAll() {
  renderDashboard();
  renderParams();
  renderChecklist();
  setMensualDefaults();
  calcMensual();
  calcFinal();
}

// ─── Init ──────────────────────────────────────────────────────────────────
showOverlay('Iniciando Kit Online de Liquidación…');
updateOverlay('ONE - Escencial');

tabSetup();
attachEvents();
renderAll();

setTimeout(hideOverlay, 1200);