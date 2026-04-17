// ═══════════════════════════════════════════════════════════════════════════
// KIT ONLINE DE LIQUIDACIÓN — v2026.04
// Incluye Ley 27.742 (Bases) + Ley 27.802 (Modernización Laboral)
// Basado en el Excel y PDFs de CPN Ruiz Marcia Ornella, marzo 2026
// ═══════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════
//  CONVENIOS Y CATEGORÍAS (escalas marzo 2026)
// ═══════════════════════════════════════════════════════════════════════════
const CONVENIOS = {
  comercio: {
    nombre: 'Comercio (CCT 130/75)',
    promedioCCT: 1179054.35,
    categorias: {
      'Maestranza A':     1155795, 'Maestranza B':     1158852, 'Maestranza C':     1169560,
      'Administrativo A': 1167268, 'Administrativo B': 1171860, 'Administrativo C': 1176448,
      'Administrativo D': 1190218, 'Administrativo E': 1201690, 'Administrativo F': 1218519,
      'Cajero A':         1171091, 'Cajero B':         1176448, 'Cajero C':         1183333,
      'Auxiliar A':       1171091, 'Auxiliar B':       1178740, 'Auxiliar C':       1203985,
      'Vendedor A':       1174148, 'Vendedor B':       1174878
    },
    antiguedad:  { tipo: 'fijo', pct: 1 },
    presentismo: { tipo: 'pct',  pct: 8.33 },
    aporte_os_pct: 3, aporte_sindicato_pct: 2, aporte_faecys_pct: 0.5
  },
  uocra: {
    nombre: 'UOCRA (Construcción)', promedioCCT: 1162000,
    categorias: { 'Ayudante': 1050000, 'Medio oficial': 1120000, 'Oficial': 1200000, 'Oficial especializado': 1280000 },
    antiguedad: { tipo: 'fijo', pct: 1 }, presentismo: { tipo: 'pct', pct: 0 },
    aporte_os_pct: 3, aporte_sindicato_pct: 2, aporte_faecys_pct: 0
  },
  camioneros: {
    nombre: 'Camioneros (CCT 40/89)', promedioCCT: 1315000,
    categorias: { 'Chofer 1a': 1350000, 'Chofer 2a': 1280000, 'Chofer larga distancia': 1450000, 'Ayudante': 1180000 },
    antiguedad: { tipo: 'fijo', pct: 1 }, presentismo: { tipo: 'pct', pct: 8.33 },
    aporte_os_pct: 3, aporte_sindicato_pct: 2, aporte_faecys_pct: 0
  },
  gastronomico: {
    nombre: 'Gastronómico (UTHGRA)', promedioCCT: 1160000,
    categorias: { 'Mozo': 1150000, 'Cocinero': 1220000, 'Bachero': 1080000, 'Recepcionista': 1190000 },
    antiguedad: { tipo: 'fijo', pct: 1 }, presentismo: { tipo: 'pct', pct: 10 },
    aporte_os_pct: 3, aporte_sindicato_pct: 2, aporte_faecys_pct: 0
  },
  uatre: {
    nombre: 'UATRE (Rural)', promedioCCT: 1205000,
    categorias: { 'Peón general': 1100000, 'Peón especializado': 1180000, 'Conductor de tractor': 1220000, 'Encargado': 1320000 },
    antiguedad: { tipo: 'escalonado', escalas: [ { desdeAnio: 0, pct: 1 }, { desdeAnio: 10, pct: 1.5 } ] },
    presentismo: { tipo: 'pct', pct: 0 },
    aporte_os_pct: 3, aporte_sindicato_pct: 2, aporte_faecys_pct: 0
  },
  sutara: {
    nombre: 'SUTARA', promedioCCT: 1170000,
    categorias: { 'Categoría 1': 1100000, 'Categoría 2': 1170000, 'Categoría 3': 1240000 },
    antiguedad: { tipo: 'fijo', pct: 1 }, presentismo: { tipo: 'pct', pct: 0 },
    aporte_os_pct: 3, aporte_sindicato_pct: 2, aporte_faecys_pct: 0
  },
  personalizado: {
    nombre: 'Personalizado (cargar manualmente)', promedioCCT: 0,
    categorias: { '— Manual —': 0 },
    antiguedad: { tipo: 'fijo', pct: 1 }, presentismo: { tipo: 'pct', pct: 0 },
    aporte_os_pct: 3, aporte_sindicato_pct: 2, aporte_faecys_pct: 0
  }
};

// ═══════════════════════════════════════════════════════════════════════════
//  CAUSALES DE DESVINCULACIÓN (TODOS los arts. LCT + Ley 27.742)
// ═══════════════════════════════════════════════════════════════════════════
const CAUSALES = {
  renuncia_240:            { grupo:'no_indem',  nombre:'Renuncia (art. 240 LCT)',                         indem245:0,   preaviso:false, integracion:false },
  mutuo_acuerdo_241:       { grupo:'no_indem',  nombre:'Mutuo acuerdo (art. 241 LCT)',                    indem245:0,   preaviso:false, integracion:false },
  despido_con_causa_242:   { grupo:'no_indem',  nombre:'Despido con justa causa (art. 242 LCT)',          indem245:0,   preaviso:false, integracion:false },
  abandono_244:            { grupo:'no_indem',  nombre:'Abandono de trabajo (art. 244 LCT)',              indem245:0,   preaviso:false, integracion:false },
  plazo_fijo_menor_250:    { grupo:'no_indem',  nombre:'Fin plazo fijo < 1 año (art. 250 LCT)',           indem245:0,   preaviso:false, integracion:false },
  jubilacion_252:          { grupo:'no_indem',  nombre:'Jubilación (art. 252 LCT)',                       indem245:0,   preaviso:false, integracion:false },
  periodo_prueba:          { grupo:'no_indem',  nombre:'Baja en período de prueba (art. 92 bis · Ley 27.742)', indem245:0, preaviso:true, integracion:false },

  despido_sin_causa_245:   { grupo:'indem_245', nombre:'Despido SIN justa causa (art. 245 LCT)',          indem245:1.0, preaviso:true,  integracion:true },
  despido_indirecto_246:   { grupo:'indem_245', nombre:'Despido indirecto (art. 246 LCT)',                indem245:1.0, preaviso:true,  integracion:true },
  quiebra_culposa_251:     { grupo:'indem_245', nombre:'Quiebra culposa/dolosa del empleador (art. 251 LCT)', indem245:1.0, preaviso:true,  integracion:true },
  incapacidad_absoluta:    { grupo:'indem_245', nombre:'Incapacidad absoluta (art. 212 inc. 3 LCT)',      indem245:1.0, preaviso:false, integracion:false },
  incap_parcial_no_asigna: { grupo:'indem_245', nombre:'Incap. parcial — empleador no asigna tareas (art. 212.2)', indem245:1.0, preaviso:false, integracion:false },

  fuerza_mayor_247:        { grupo:'indem_247', nombre:'Fuerza mayor / falta o disminución trabajo (art. 247 LCT)', indem245:0.5, preaviso:false, integracion:false },
  muerte_trabajador_248:   { grupo:'indem_247', nombre:'Muerte del trabajador (art. 248 LCT)',            indem245:0.5, preaviso:false, integracion:false },
  muerte_empleador_249:    { grupo:'indem_247', nombre:'Muerte del empleador (art. 249 LCT)',             indem245:0.5, preaviso:false, integracion:false },
  plazo_fijo_mayor_250:    { grupo:'indem_247', nombre:'Fin plazo fijo > 1 año (art. 250 LCT)',           indem245:0.5, preaviso:false, integracion:false },
  quiebra_no_imputable_251:{ grupo:'indem_247', nombre:'Quiebra NO imputable al empleador (art. 251 LCT)', indem245:0.5, preaviso:false, integracion:false },
  incap_parcial_no_imput:  { grupo:'indem_247', nombre:'Incap. parcial no imputable (art. 212 inc. 1)',   indem245:0.5, preaviso:false, integracion:false }
};

// ═══════════════════════════════════════════════════════════════════════════
//  RÉGIMEN DE CONTRIBUCIONES PATRONALES (Ley 27.541 art. 19)
//  Valores exactos del Excel de Marcia, hoja "Alícuotas"
// ═══════════════════════════════════════════════════════════════════════════
// Inc. a = Régimen General (empresas grandes + otras actividades)
// Inc. b = Régimen Reducido (comercio y servicios PyME, agrop., industria, etc.)
// Horacio pidió expresamente que esto esté en la plataforma para comparar
const REGIMENES = {
  general: {
    nombre: 'Régimen General (art. 19 inc. a · Ley 27.541)',
    descripcion: 'Empresas grandes o actividades excluidas del régimen reducido',
    jubilacion_pct: 12.35,
    pami_pct: 1.58,
    aaff_pct: 5.40,
    fne_pct: 1.07,
    subtotal_ss_pct: 20.40,   // jub + pami + aaff + fne
    obra_social_pct: 6.00,
    total_pct: 26.40,
    os_fsr_pct: 15           // dentro del 6% de OS: 85% OS y 15% FSR
  },
  pyme: {
    nombre: 'Régimen Reducido PyME (art. 19 inc. b · Ley 27.541)',
    descripcion: 'MiPyMEs inscriptas en el Registro PYME',
    jubilacion_pct: 10.77,
    pami_pct: 1.59,
    aaff_pct: 4.70,
    fne_pct: 0.94,
    subtotal_ss_pct: 18.00,
    obra_social_pct: 6.00,
    total_pct: 24.00,
    os_fsr_pct: 15
  }
};

// Categorías MIPyME por cantidad de empleados (Excel hoja "Categorías MIPyME" B17:C21)
const CATEGORIAS_MIPYME = [
  { clave: 'micro',     nombre: 'Micro',              empleadosServicios: 7,   empleadosComercio: 7   },
  { clave: 'pequena',   nombre: 'Pequeña',            empleadosServicios: 30,  empleadosComercio: 35  },
  { clave: 'mediana1',  nombre: 'Mediana tramo 1',    empleadosServicios: 165, empleadosComercio: 125 },
  { clave: 'mediana2',  nombre: 'Mediana tramo 2',    empleadosServicios: 535, empleadosComercio: 345 },
  { clave: 'grande',    nombre: 'Gran empresa',       empleadosServicios: null, empleadosComercio: null }
];

// ═══════════════════════════════════════════════════════════════════════════
//  PARÁMETROS POR DEFECTO
// ═══════════════════════════════════════════════════════════════════════════
// Versión interna de parámetros (se usa para compatibilidad del caché)
const PARAMS_VERSION = '2026.04';

// Versión PÚBLICA de la app — editar manualmente desde el backend al publicar
// Esta es la que se ve en el footer
const APP_VERSION = '1.2.0';

const DEFAULT_PARAMS = {
  convenio_seleccionado: 'comercio',
  categoria_seleccionada: 'Vendedor B',
  convenio_basico: 1174878,
  adicional_antiguedad_pct: 1,
  presentismo_pct: 8.33,
  aporte_jubilacion_pct: 11,
  aporte_ley_19032_pct: 3,
  aporte_obra_social_pct: 3,
  aporte_sindicato_pct: 2,
  aporte_faecys_pct: 0.5,
  // Régimen patronal (Ley 27.541 art. 19) — configurable por empresa
  regimen_patronal: 'pyme',            // 'general' o 'pyme'
  categoria_mipyme: 'pequena',         // micro / pequena / mediana1 / mediana2 / grande
  contribuciones_patronales_pct: 24,   // se autoactualiza según régimen (default PyME = 24%)
  divisor_sueldo: 30,
  divisor_vacaciones: 25,
  horas_base_mes: 200,
  recargo_hs50_pct: 50,
  recargo_hs100_pct: 100,
  sac_divisor: 12,
  criterio_antiguedad_fraccion_mayor_tres_meses: 1,
  empresa: 'Nombre de la empresa',
  convenio_referencia: 'Comercio (CCT 130/75)',
  tope_245_pct_sobre_promedio_cct: 3,
  tope_245_base_minima_pct: 67,
  prueba_default_meses: 6,
  prueba_pyme_meses: 8,
  prueba_micro_meses: 12,
  fondo_cese_pct: 8.33,
  fal_grandes_pct: 1,
  fal_pymes_pct: 2.5,

  // ── Bases imponibles AFIP (ANSES Res 38/2026 marzo 2026) ──────────────
  base_imponible_minima: 124481.49,
  base_imponible_maxima: 4045590.45,
  base_imponible_minima_os: 248962.98,   // 2× base mínima (Dec 921/2016)
  prestacion_basica_universal: 169075.53,
  haber_minimo_jubilatorio: 369600.88,
  haber_maximo_jubilatorio: 2487063.95,
  bono_extraordinario: 70000,

  // ── SMVM (Res 9/2024, último valor conocido — actualizable) ──────────
  smvm_mensual: 234315.12,
  smvm_hora: 1171.58,

  // ── ART / SCVO (Dec. 590/97, Disposición SRT) ─────────────────────────
  art_valor_fijo_mensual: 874,           // valor mensual a la fecha (Excel B39)
  art_alicuota_variable_pct: 6.24,       // % variable por empleado
  scvo_valor_mensual: 175.89,            // seguro colectivo de vida obligatorio
  scvo_cantidad_cuiles_emision: 25,      // se paga por cada CUIL emitido

  // ── Alícuotas detalladas del régimen patronal (Ley 27.541 art. 19) ───
  // Régimen General (inc. a)
  regimen_gral_jubilacion_pct: 12.35,
  regimen_gral_pami_pct: 1.58,
  regimen_gral_aaff_pct: 5.40,
  regimen_gral_fne_pct: 1.07,
  regimen_gral_os_pct: 6.00,
  // Régimen PyME (inc. b)
  regimen_pyme_jubilacion_pct: 10.77,
  regimen_pyme_pami_pct: 1.59,
  regimen_pyme_aaff_pct: 4.70,
  regimen_pyme_fne_pct: 0.94,
  regimen_pyme_os_pct: 6.00,

  // ── Detracciones y deducciones (Ley 27.541 art. 22) ──────────────────
  detraccion_base: 7003.68,              // detracción general
  detraccion_ampliada: 17509.20,         // textil, construcción, salud, agro (Dec 1067/18, 128/19, 688/19)
  deduccion_25_empleados: 10000,         // Ley 27.541 art. 23

  // ── OSECAC específicos (CCT 130/75) ──────────────────────────────────
  aporte_extraord_osecac: 100,           // Aporte extraordinario fijo mensual
  os_fsr_distribucion_pct: 15,           // 85% OS + 15% FSR

  // ── Promedios CCT para tope art. 245 (editables por convenio) ────────
  promedio_cct_comercio: 1179054.35,
  promedio_cct_uocra: 1162000,
  promedio_cct_camioneros: 1315000,
  promedio_cct_gastronomico: 1160000,
  promedio_cct_uatre: 1205000,
  promedio_cct_sutara: 1170000
};

const PARAM_GROUPS = {
  'Remuneración base':         ['convenio_basico','adicional_antiguedad_pct','presentismo_pct'],
  'Aportes del trabajador':    ['aporte_jubilacion_pct','aporte_ley_19032_pct','aporte_obra_social_pct','aporte_sindicato_pct','aporte_faecys_pct','aporte_extraord_osecac','os_fsr_distribucion_pct'],
  'Régimen patronal GENERAL (Ley 27.541 art. 19 inc. a)': ['regimen_gral_jubilacion_pct','regimen_gral_pami_pct','regimen_gral_aaff_pct','regimen_gral_fne_pct','regimen_gral_os_pct'],
  'Régimen patronal PYME (Ley 27.541 art. 19 inc. b)': ['regimen_pyme_jubilacion_pct','regimen_pyme_pami_pct','regimen_pyme_aaff_pct','regimen_pyme_fne_pct','regimen_pyme_os_pct'],
  'Régimen patronal activo': ['regimen_patronal','categoria_mipyme','contribuciones_patronales_pct'],
  'Detracciones y deducciones': ['detraccion_base','detraccion_ampliada','deduccion_25_empleados'],
  'Bases imponibles AFIP (ANSES Res 38/2026 — marzo 2026)': ['base_imponible_minima','base_imponible_maxima','base_imponible_minima_os','prestacion_basica_universal','haber_minimo_jubilatorio','haber_maximo_jubilatorio','bono_extraordinario'],
  'SMVM (Salario Mínimo Vital y Móvil)': ['smvm_mensual','smvm_hora'],
  'ART + SCVO (Dec. 590/97 y Dispos. SRT)': ['art_valor_fijo_mensual','art_alicuota_variable_pct','scvo_valor_mensual','scvo_cantidad_cuiles_emision'],
  'Divisores y horas':         ['divisor_sueldo','divisor_vacaciones','horas_base_mes','recargo_hs50_pct','recargo_hs100_pct','sac_divisor','criterio_antiguedad_fraccion_mayor_tres_meses'],
  'Promedios CCT (para tope art. 245 Ley 27.802)': ['promedio_cct_comercio','promedio_cct_uocra','promedio_cct_camioneros','promedio_cct_gastronomico','promedio_cct_uatre','promedio_cct_sutara'],
  'Reforma laboral (Ley 27.802 / 27.742)': ['tope_245_pct_sobre_promedio_cct','tope_245_base_minima_pct','prueba_default_meses','prueba_pyme_meses','prueba_micro_meses','fondo_cese_pct','fal_grandes_pct','fal_pymes_pct'],
  'Datos del empleador':       ['empresa','convenio_referencia']
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
  regimen_patronal: 'Régimen patronal (general / pyme)',
  categoria_mipyme: 'Categoría MIPyME (micro/pequena/mediana1/mediana2/grande)',
  contribuciones_patronales_pct: 'Contribuciones patronales % (total)',
  divisor_sueldo: 'Divisor sueldo',
  divisor_vacaciones: 'Divisor vacaciones',
  horas_base_mes: 'Horas base del mes',
  recargo_hs50_pct: 'Recargo hs 50%',
  recargo_hs100_pct: 'Recargo hs 100%',
  sac_divisor: 'Divisor SAC',
  criterio_antiguedad_fraccion_mayor_tres_meses: 'Fracción > 3 meses computa año (1=sí / 0=no)',
  empresa: 'Razón social / curso',
  convenio_referencia: 'Convenio de referencia',
  tope_245_pct_sobre_promedio_cct: 'Tope 245: veces promedio CCT (Ley 27.802)',
  tope_245_base_minima_pct: 'Tope 245: base mínima % (Vizzoti incorporado)',
  prueba_default_meses: 'Período de prueba default (meses)',
  prueba_pyme_meses: 'Período de prueba PyME 6-100 emp. (meses)',
  prueba_micro_meses: 'Período de prueba Micro ≤5 emp. (meses)',
  fondo_cese_pct: 'Aporte mensual Fondo de Cese %',
  fal_grandes_pct: 'FAL empresas grandes %',
  fal_pymes_pct: 'FAL pymes %',

  // Nuevos - bases imponibles y valores ANSES
  base_imponible_minima: 'Base imponible MÍNIMA (ANSES)',
  base_imponible_maxima: 'Base imponible MÁXIMA (ANSES)',
  base_imponible_minima_os: 'Base mínima OS (2× base mín.)',
  prestacion_basica_universal: 'Prestación Básica Universal (PBU)',
  haber_minimo_jubilatorio: 'Haber mínimo jubilatorio',
  haber_maximo_jubilatorio: 'Haber máximo jubilatorio',
  bono_extraordinario: 'Bono extraordinario jubilados',

  // SMVM
  smvm_mensual: 'SMVM mensual',
  smvm_hora: 'SMVM por hora',

  // ART / SCVO
  art_valor_fijo_mensual: 'ART — valor fijo mensual',
  art_alicuota_variable_pct: 'ART — alícuota variable %',
  scvo_valor_mensual: 'SCVO — valor mensual',
  scvo_cantidad_cuiles_emision: 'SCVO — cant. CUIles por emisión',

  // Régimen General
  regimen_gral_jubilacion_pct: 'General — Jubilación SIPA %',
  regimen_gral_pami_pct: 'General — PAMI %',
  regimen_gral_aaff_pct: 'General — Asign. Familiares %',
  regimen_gral_fne_pct: 'General — Fondo Nac. Empleo %',
  regimen_gral_os_pct: 'General — Obra Social %',

  // Régimen PyME
  regimen_pyme_jubilacion_pct: 'PyME — Jubilación SIPA %',
  regimen_pyme_pami_pct: 'PyME — PAMI %',
  regimen_pyme_aaff_pct: 'PyME — Asign. Familiares %',
  regimen_pyme_fne_pct: 'PyME — Fondo Nac. Empleo %',
  regimen_pyme_os_pct: 'PyME — Obra Social %',

  // Detracciones
  detraccion_base: 'Detracción base (Dec. 814/01)',
  detraccion_ampliada: 'Detracción ampliada (textil/constr.)',
  deduccion_25_empleados: 'Deducción empresas ≤25 empl.',

  // OSECAC
  aporte_extraord_osecac: 'OSECAC — Aporte extraord. $',
  os_fsr_distribucion_pct: 'OS/FSR — % al FSR (default 15)',

  // Promedios CCT
  promedio_cct_comercio: 'Promedio CCT Comercio',
  promedio_cct_uocra: 'Promedio CCT UOCRA',
  promedio_cct_camioneros: 'Promedio CCT Camioneros',
  promedio_cct_gastronomico: 'Promedio CCT Gastronómico',
  promedio_cct_uatre: 'Promedio CCT UATRE',
  promedio_cct_sutara: 'Promedio CCT SUTARA'
};

const DEFAULT_CHECKLIST = [
  { titulo: 'Alta y legajo', items: ['Confirmar modalidad de contratación','Verificar fecha de ingreso real y teórica','Controlar obra social, convenio y categoría','Guardar documentación y constancias'] },
  { titulo: 'Liquidación mensual', items: ['Definir básico y adicionales de convenio','Separar conceptos remunerativos y no remunerativos','Controlar incidencias: horas, licencias, vacaciones, variables','Revisar neto antes de emitir recibo'] },
  { titulo: 'Aportes y contribuciones', items: ['Controlar descuentos del trabajador','Revisar contribuciones patronales','Verificar base imponible usada','Dejar trazabilidad del criterio aplicado'] },
  { titulo: 'Cierre operativo', items: ['Emitir recibos','Controlar carga en sistemas','Revisar declaración jurada y/o LSD','Guardar respaldo de papeles de trabajo'] },
  { titulo: 'Liquidación final', items: ['Identificar causal exacta (art. LCT)','Calcular base art. 245 con promedio de variables','Aplicar topes Ley 27.802 (máx 3× y mín 67%)','Verificar preaviso según antigüedad','Revisar SAC sobre cada indemnizatorio','Certificado de servicios (art. 80 LCT)'] },
  { titulo: 'Control profesional', items: ['Chequear convenio aplicable','Confirmar normativa vigente','Corroborar actualizaciones por reforma','Dejar nota del criterio técnico utilizado'] }
];

// ─── Storage ───────────────────────────────────────────────────────────────
const STORAGE_KEY  = 'klp_params_v3';
const STORAGE_META = 'klp_meta_v3';
function loadParams() { try { const raw = localStorage.getItem(STORAGE_KEY); if (!raw) return { ...DEFAULT_PARAMS }; return { ...DEFAULT_PARAMS, ...JSON.parse(raw) }; } catch { return { ...DEFAULT_PARAMS }; } }
function loadMeta()   { try { const raw = localStorage.getItem(STORAGE_META); return raw ? JSON.parse(raw) : null; } catch { return null; } }
function saveMeta(v)  { const m = { version: v, savedAt: new Date().toISOString() }; localStorage.setItem(STORAGE_META, JSON.stringify(m)); return m; }
function saveParams() { localStorage.setItem(STORAGE_KEY, JSON.stringify(params)); return saveMeta(PARAMS_VERSION); }
function formatDate(iso) { if (!iso) return '—'; const d = new Date(iso); return d.toLocaleDateString('es-AR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }); }

let params = loadParams();
let lastMensualData = null;
let lastFinalData   = null;

function money(n)   { return new Intl.NumberFormat('es-AR', { style:'currency', currency:'ARS', maximumFractionDigits:2 }).format(Number(n||0)); }
function percent(n) { return `${Number(n||0).toFixed(2).replace('.',',')}%`; }
function nv(id)     { return Number(document.getElementById(id)?.value||0); }
function sv(id)     { return document.getElementById(id)?.value || ''; }
function chk(id)    { return document.getElementById(id)?.checked || false; }
function round2(n)  { return Math.round((Number(n||0)+Number.EPSILON)*100)/100; }

function switchTab(tab) {
  document.querySelectorAll('.tab-btn,.mtab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
  const panel = document.getElementById('tab-' + tab);
  if (panel) panel.classList.remove('hidden');
}
function tabSetup() {
  document.querySelectorAll('.tab-btn,.mtab').forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));
}

function renderMeta() {
  const meta = loadMeta();
  const verEl = document.getElementById('metaVersion');
  const updEl = document.getElementById('metaUpdated');
  const bannerText = document.getElementById('paramsBannerText');
  const bannerSub  = document.getElementById('paramsBannerSub');
  const bannerVer  = document.getElementById('paramsBannerVersion');
  const badge      = document.getElementById('updateBadge');
  const badgeText  = document.getElementById('updateBadgeText');
  if (verEl) verEl.textContent = 'v' + APP_VERSION;
  if (meta) {
    if (updEl) updEl.textContent = 'Guardado: ' + formatDate(meta.savedAt);
    if (bannerText) bannerText.textContent = 'Parámetros en caché local';
    if (bannerSub) bannerSub.textContent = 'Última actualización: ' + formatDate(meta.savedAt);
    if (bannerVer) bannerVer.textContent = 'versión ' + (meta.version || '—');
    if (badge) badge.style.display = 'flex';
    if (badgeText) badgeText.textContent = 'Parámetros en caché';
  } else {
    if (updEl) updEl.textContent = 'Usando valores base';
    if (bannerText) bannerText.textContent = 'Valores base del sistema';
    if (bannerSub) bannerSub.textContent = 'Aún no guardaste parámetros personalizados';
    if (bannerVer) bannerVer.textContent = 'v' + PARAMS_VERSION;
    if (badge) badge.style.display = 'none';
  }
}

function renderDashboard() {
  document.getElementById('cardBasic').textContent = money(params.convenio_basico);
  const aportes = ['aporte_jubilacion_pct','aporte_ley_19032_pct','aporte_obra_social_pct','aporte_sindicato_pct','aporte_faecys_pct']
    .reduce((s,k) => s + Number(params[k]||0), 0);
  document.getElementById('cardAportes').textContent = percent(aportes);
  document.getElementById('cardContribuciones').textContent = percent(params.contribuciones_patronales_pct);
}

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

// ═══════════════════════════════════════════════════════════════════════════
//  SELECTOR DE CONVENIO
// ═══════════════════════════════════════════════════════════════════════════
function renderSelectorConvenio() {
  const selConv = document.getElementById('mConvenio');
  if (!selConv) return;
  selConv.innerHTML = '';
  Object.entries(CONVENIOS).forEach(([key, c]) => {
    const opt = document.createElement('option');
    opt.value = key; opt.textContent = c.nombre;
    selConv.appendChild(opt);
  });
  selConv.value = params.convenio_seleccionado || 'comercio';
  poblarCategorias(selConv.value);

  // Sincronizar selectores de régimen patronal y categoría MIPyME
  const mReg = document.getElementById('mRegimenPatronal');
  if (mReg) mReg.value = params.regimen_patronal || 'pyme';
  const mCatM = document.getElementById('mCategoriaMipyme');
  if (mCatM) mCatM.value = params.categoria_mipyme || 'pequena';
}
function poblarCategorias(convenioKey) {
  const selCat = document.getElementById('mCategoria');
  const convenio = CONVENIOS[convenioKey];
  if (!selCat || !convenio) return;
  selCat.innerHTML = '';
  Object.keys(convenio.categorias).forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat; opt.textContent = cat;
    selCat.appendChild(opt);
  });
  if (convenio.categorias[params.categoria_seleccionada] !== undefined) selCat.value = params.categoria_seleccionada;
  else { params.categoria_seleccionada = Object.keys(convenio.categorias)[0]; selCat.value = params.categoria_seleccionada; }
}
function onConvenioChange() {
  const convenioKey = sv('mConvenio');
  params.convenio_seleccionado = convenioKey;
  const convenio = CONVENIOS[convenioKey];
  if (!convenio) return;
  poblarCategorias(convenioKey);
  params.convenio_referencia = convenio.nombre;
  params.aporte_obra_social_pct = convenio.aporte_os_pct;
  params.aporte_sindicato_pct = convenio.aporte_sindicato_pct;
  params.aporte_faecys_pct = convenio.aporte_faecys_pct;
  if (convenio.presentismo.tipo === 'pct') params.presentismo_pct = convenio.presentismo.pct;
  if (convenio.antiguedad.tipo === 'fijo') params.adicional_antiguedad_pct = convenio.antiguedad.pct;
  onCategoriaChange();
  calcMensual();
  calcFinal();
}
function onCategoriaChange() {
  const convenioKey = sv('mConvenio');
  const catKey = sv('mCategoria');
  const convenio = CONVENIOS[convenioKey];
  if (!convenio) return;
  const basico = convenio.categorias[catKey] || 0;
  if (basico > 0) { document.getElementById('mBasico').value = basico; params.convenio_basico = basico; }
  params.categoria_seleccionada = catKey;
  calcMensual();
}

// Devuelve los regímenes armados con los valores editables de params
// (permite que la profe actualice alícuotas desde el panel y se apliquen al cálculo)
function getRegimenesActivos() {
  const gral_ss = round2(params.regimen_gral_jubilacion_pct + params.regimen_gral_pami_pct + params.regimen_gral_aaff_pct + params.regimen_gral_fne_pct);
  const pyme_ss = round2(params.regimen_pyme_jubilacion_pct + params.regimen_pyme_pami_pct + params.regimen_pyme_aaff_pct + params.regimen_pyme_fne_pct);
  return {
    general: {
      nombre: 'Régimen General (art. 19 inc. a · Ley 27.541)',
      jubilacion_pct: params.regimen_gral_jubilacion_pct,
      pami_pct:       params.regimen_gral_pami_pct,
      aaff_pct:       params.regimen_gral_aaff_pct,
      fne_pct:        params.regimen_gral_fne_pct,
      subtotal_ss_pct: gral_ss,
      obra_social_pct: params.regimen_gral_os_pct,
      total_pct:       round2(gral_ss + params.regimen_gral_os_pct)
    },
    pyme: {
      nombre: 'Régimen Reducido PyME (art. 19 inc. b · Ley 27.541)',
      jubilacion_pct: params.regimen_pyme_jubilacion_pct,
      pami_pct:       params.regimen_pyme_pami_pct,
      aaff_pct:       params.regimen_pyme_aaff_pct,
      fne_pct:        params.regimen_pyme_fne_pct,
      subtotal_ss_pct: pyme_ss,
      obra_social_pct: params.regimen_pyme_os_pct,
      total_pct:       round2(pyme_ss + params.regimen_pyme_os_pct)
    }
  };
}

function onCategoriaChange_DEPRECATED() { /* eliminada */ }

function calcularAdicionalAntiguedad(baseMensual, anios, convenioKey) {
  const convenio = CONVENIOS[convenioKey];
  let pct = Number(params.adicional_antiguedad_pct || 0);
  if (convenio) {
    const regla = convenio.antiguedad;
    if (regla.tipo === 'fijo') pct = regla.pct;
    else if (regla.tipo === 'escalonado') {
      let pctAplicable = 0;
      regla.escalas.forEach(esc => { if (anios >= esc.desdeAnio) pctAplicable = esc.pct; });
      pct = pctAplicable;
    }
  }
  return round2(baseMensual * (pct / 100) * anios);
}

function setMensualDefaults() { document.getElementById('mBasico').value = params.convenio_basico; }

// ═══════════════════════════════════════════════════════════════════════════
//  LIQUIDACIÓN MENSUAL
// ═══════════════════════════════════════════════════════════════════════════
function calcMensual() {
  const basico   = nv('mBasico');
  const antiguAn = nv('mAntiguedadAnios');
  const dias     = nv('mDiasTrabajados');
  const hs50     = nv('mHoras50');
  const hs100    = nv('mHoras100');
  const usarComisiones = chk('chkComisiones');
  const vars = usarComisiones ? nv('mVariables') : 0;
  const feriadosNT = nv('mFeriadosNT');
  const feriadosT  = nv('mFeriadosT');
  const diasEnfermedad = nv('mDiasEnfermedad');
  const baseEnfermedad = nv('mBaseEnfermedad') || 25;
  const conceptoNR       = nv('mConceptoNR');
  const nrAportaOS       = chk('chkNraportaOS');
  const nrAportaSind     = chk('chkNraportaSind');
  const nrAportaFaecys   = chk('chkNraportaFaecys');
  const otrosDLabel = sv('mOtrosDescuentosLabel') || 'Otros descuentos';
  const otrosD      = nv('mOtrosDescuentos');

  const convenioKey = sv('mConvenio') || params.convenio_seleccionado;
  const basicoProp   = round2((basico / params.divisor_sueldo) * dias);
  const antiguedad   = calcularAdicionalAntiguedad(basicoProp, antiguAn, convenioKey);
  const presentismo  = round2((basicoProp + antiguedad) * (params.presentismo_pct/100));
  const valorHora    = basico / params.horas_base_mes;
  const extra50      = round2(hs50  * valorHora * (1 + params.recargo_hs50_pct/100));
  const extra100     = round2(hs100 * valorHora * (1 + params.recargo_hs100_pct/100));
  const valorDia25 = (basico + antiguedad + presentismo) / 25;
  const valorDia30 = (basico + antiguedad + presentismo) / 30;
  const plusFeriadoNT = round2(feriadosNT * (valorDia25 - valorDia30));
  const plusFeriadoT  = round2(feriadosT * valorDia25);
  const valorDiaEnf = (basico + antiguedad + presentismo) / baseEnfermedad;
  const enfermedad  = round2(diasEnfermedad * valorDiaEnf);

  const remunerativo = round2(basicoProp + antiguedad + presentismo + extra50 + extra100 + vars + plusFeriadoNT + plusFeriadoT + enfermedad);
  const noRemunerativo = round2(conceptoNR);

  const descJub   = round2(remunerativo * (params.aporte_jubilacion_pct/100));
  const desc19    = round2(remunerativo * (params.aporte_ley_19032_pct/100));
  const baseOS    = remunerativo + (nrAportaOS ? conceptoNR : 0);
  const baseSind  = remunerativo + (nrAportaSind ? conceptoNR : 0);
  const baseFaec  = remunerativo + (nrAportaFaecys ? conceptoNR : 0);
  const descOS    = round2(baseOS * (params.aporte_obra_social_pct/100));
  const descSind  = round2(baseSind * (params.aporte_sindicato_pct/100));
  const descFaec  = round2(baseFaec * (params.aporte_faecys_pct/100));
  const descuentos = round2(descJub + desc19 + descOS + descSind + descFaec + otrosD);
  const neto       = round2(remunerativo + noRemunerativo - descuentos);

  // ── Contribuciones patronales: calcular AMBOS regímenes para comparar ──
  // Como pidió Horacio en la reunión: que quede visible lo de PyME y lo general.
  // Ahora toma los % del panel Parámetros (editable), no de constantes hardcoded.
  const regActivos = getRegimenesActivos();
  const regGral = regActivos.general;
  const regPyme = regActivos.pyme;

  const contribGeneral = {
    jubilacion_pct: regGral.jubilacion_pct,
    pami_pct: regGral.pami_pct,
    aaff_pct: regGral.aaff_pct,
    fne_pct: regGral.fne_pct,
    obra_social_pct: regGral.obra_social_pct,
    subtotal_ss_pct: regGral.subtotal_ss_pct,
    total_pct: regGral.total_pct,
    jubilacion:  round2(remunerativo * regGral.jubilacion_pct / 100),
    pami:        round2(remunerativo * regGral.pami_pct / 100),
    aaff:        round2(remunerativo * regGral.aaff_pct / 100),
    fne:         round2(remunerativo * regGral.fne_pct / 100),
    obra_social: round2(remunerativo * regGral.obra_social_pct / 100),
    total: 0
  };
  contribGeneral.subtotal_ss = round2(contribGeneral.jubilacion + contribGeneral.pami + contribGeneral.aaff + contribGeneral.fne);
  contribGeneral.total = round2(contribGeneral.subtotal_ss + contribGeneral.obra_social);

  const contribPyme = {
    jubilacion_pct: regPyme.jubilacion_pct,
    pami_pct: regPyme.pami_pct,
    aaff_pct: regPyme.aaff_pct,
    fne_pct: regPyme.fne_pct,
    obra_social_pct: regPyme.obra_social_pct,
    subtotal_ss_pct: regPyme.subtotal_ss_pct,
    total_pct: regPyme.total_pct,
    jubilacion:  round2(remunerativo * regPyme.jubilacion_pct / 100),
    pami:        round2(remunerativo * regPyme.pami_pct / 100),
    aaff:        round2(remunerativo * regPyme.aaff_pct / 100),
    fne:         round2(remunerativo * regPyme.fne_pct / 100),
    obra_social: round2(remunerativo * regPyme.obra_social_pct / 100),
    total: 0
  };
  contribPyme.subtotal_ss = round2(contribPyme.jubilacion + contribPyme.pami + contribPyme.aaff + contribPyme.fne);
  contribPyme.total = round2(contribPyme.subtotal_ss + contribPyme.obra_social);

  const regimenAct = (params.regimen_patronal === 'pyme') ? contribPyme : contribGeneral;
  const regimenActNombre = (params.regimen_patronal === 'pyme') ? 'PyME' : 'General';
  const contribuciones = regimenAct.total;

  document.getElementById('rRemunerativo').textContent   = money(remunerativo);
  document.getElementById('rNoRemunerativo').textContent = money(noRemunerativo);
  document.getElementById('rDescuentos').textContent     = money(descuentos);
  document.getElementById('rNeto').textContent           = money(neto);
  const rContribEl = document.getElementById('rContribuciones');
  if (rContribEl) rContribEl.textContent = `${money(contribuciones)} (${regimenActNombre})`;

  // Render de la tabla comparativa de regímenes (caja "Contribuciones patronales comparadas")
  const cmpBody = document.getElementById('contribComparativa');
  if (cmpBody) {
    cmpBody.innerHTML = `
      <tr style="background:#f5f5f5;">
        <td style="font-weight:600;">Concepto</td>
        <td style="text-align:right; font-weight:600; color:#0b4a6e;">Régimen General</td>
        <td style="text-align:right; font-weight:600; color:#6b9432;">Régimen PyME</td>
      </tr>
      <tr><td>Jubilación SIPA</td><td style="text-align:right;">${percent(contribGeneral.jubilacion_pct)} · ${money(contribGeneral.jubilacion)}</td><td style="text-align:right;">${percent(contribPyme.jubilacion_pct)} · ${money(contribPyme.jubilacion)}</td></tr>
      <tr><td>PAMI Ley 19.032</td><td style="text-align:right;">${percent(contribGeneral.pami_pct)} · ${money(contribGeneral.pami)}</td><td style="text-align:right;">${percent(contribPyme.pami_pct)} · ${money(contribPyme.pami)}</td></tr>
      <tr><td>Asignaciones Familiares</td><td style="text-align:right;">${percent(contribGeneral.aaff_pct)} · ${money(contribGeneral.aaff)}</td><td style="text-align:right;">${percent(contribPyme.aaff_pct)} · ${money(contribPyme.aaff)}</td></tr>
      <tr><td>Fondo Nacional de Empleo</td><td style="text-align:right;">${percent(contribGeneral.fne_pct)} · ${money(contribGeneral.fne)}</td><td style="text-align:right;">${percent(contribPyme.fne_pct)} · ${money(contribPyme.fne)}</td></tr>
      <tr style="background:#f9f9f9;"><td style="font-weight:600;">Subtotal Seguridad Social</td><td style="text-align:right; font-weight:600;">${percent(contribGeneral.subtotal_ss_pct)} · ${money(contribGeneral.subtotal_ss)}</td><td style="text-align:right; font-weight:600;">${percent(contribPyme.subtotal_ss_pct)} · ${money(contribPyme.subtotal_ss)}</td></tr>
      <tr><td>Obra Social (Ley 23.660)</td><td style="text-align:right;">${percent(contribGeneral.obra_social_pct)} · ${money(contribGeneral.obra_social)}</td><td style="text-align:right;">${percent(contribPyme.obra_social_pct)} · ${money(contribPyme.obra_social)}</td></tr>
      <tr style="background:#020f27; color:#fff;"><td style="font-weight:700;">TOTAL CONTRIBUCIONES</td><td style="text-align:right; font-weight:700; color:${regimenActNombre==='General'?'#22d9df':'#a0c4d8'};">${percent(contribGeneral.total_pct)} · ${money(contribGeneral.total)}</td><td style="text-align:right; font-weight:700; color:${regimenActNombre==='PyME'?'#22d9df':'#a0c4d8'};">${percent(contribPyme.total_pct)} · ${money(contribPyme.total)}</td></tr>
    `;
  }
  // Info de régimen y categoría MIPyME activos
  const regInfoEl = document.getElementById('regimenInfo');
  if (regInfoEl) {
    const regimenObj = regActivos[params.regimen_patronal] || regActivos.pyme;
    const catMipyme = CATEGORIAS_MIPYME.find(c => c.clave === params.categoria_mipyme);
    const catLabel = catMipyme ? catMipyme.nombre : '—';
    regInfoEl.innerHTML = `<strong>${regimenObj.nombre}</strong> · Categoría MIPyME: ${catLabel} · Ahorro PyME vs General: <strong style="color:#6b9432;">${money(contribGeneral.total - contribPyme.total)} por mes</strong>`;
  }

  const rows = [
    { lsd:'110000', codigo:'R1001', label:'Sueldo básico',    cant:`${dias} días`,          valUnit: round2(basico/params.divisor_sueldo), baseCalc: basico, val:basicoProp,   tipo:'rem' },
    { lsd:'160001', codigo:'R1010', label:'Antigüedad',       cant:`${antiguAn} año/s`,     valUnit: null,                                  baseCalc: basicoProp, val:antiguedad, tipo:'rem' },
    { lsd:'170001', codigo:'R1011', label:'Presentismo',      cant:percent(params.presentismo_pct), valUnit: null,                          baseCalc: round2(basicoProp+antiguedad), val:presentismo,  tipo:'rem' },
    { lsd:'170002', codigo:'R1030', label:'Horas extra 50%',  cant:`${hs50} hs`,            valUnit: round2(valorHora*1.5),                baseCalc: valorHora,  val:extra50,     tipo:'rem' },
    { lsd:'170002', codigo:'R1031', label:'Horas extra 100%', cant:`${hs100} hs`,           valUnit: round2(valorHora*2),                  baseCalc: valorHora,  val:extra100,    tipo:'rem' },
  ];
  if (usarComisiones && vars > 0) rows.push({ lsd:'170003', codigo:'R1050', label:'Comisiones / variables', cant:'—', valUnit:null, baseCalc: null, val:vars, tipo:'rem' });
  if (feriadosNT > 0) rows.push({ lsd:'110007', codigo:'R1020', label:'Plus feriado no trabajado', cant:`${feriadosNT}`, valUnit:round2(valorDia25-valorDia30), baseCalc: round2(valorDia25-valorDia30), val:plusFeriadoNT, tipo:'rem' });
  if (feriadosT > 0)  rows.push({ lsd:'110007', codigo:'R1022', label:'Feriado trabajado', cant:`${feriadosT}`, valUnit:round2(valorDia25), baseCalc: valorDia25, val:plusFeriadoT, tipo:'rem' });
  if (diasEnfermedad > 0) rows.push({ lsd:'110005', codigo:'R1040', label:`Licencia enfermedad (base ${baseEnfermedad})`, cant:`${diasEnfermedad} días`, valUnit:round2(valorDiaEnf), baseCalc: valorDiaEnf, val:enfermedad, tipo:'rem' });
  if (conceptoNR > 0) {
    const aportesTxt = [];
    if (nrAportaOS) aportesTxt.push('OS');
    if (nrAportaSind) aportesTxt.push('Sind');
    if (nrAportaFaecys) aportesTxt.push('FAECyS');
    const sufijo = aportesTxt.length ? ` (aporta ${aportesTxt.join(' · ')})` : '';
    rows.push({ lsd:'551000', codigo:'N2000', label:`Concepto no remunerativo${sufijo}`, cant:'—', valUnit:null, baseCalc: null, val:conceptoNR, tipo:'norem' });
  }
  rows.push({ lsd:'810000', codigo:'D3001', label:'Jubilación (SIPA)',  cant:percent(params.aporte_jubilacion_pct), valUnit:null, baseCalc: remunerativo, val:-descJub, tipo:'desc' });
  rows.push({ lsd:'810001', codigo:'D3002', label:'INSSJyP-PAMI Ley 19.032', cant:percent(params.aporte_ley_19032_pct), valUnit:null, baseCalc: remunerativo, val:-desc19,  tipo:'desc' });
  rows.push({ lsd:'810002', codigo:'D3003', label:'Obra social', cant:percent(params.aporte_obra_social_pct), valUnit:null, baseCalc: baseOS, val:-descOS, tipo:'desc' });
  rows.push({ lsd:'810004', codigo:'D3010', label:'Sindicato',   cant:percent(params.aporte_sindicato_pct), valUnit:null, baseCalc: baseSind, val:-descSind, tipo:'desc' });
  if (params.aporte_faecys_pct > 0) rows.push({ lsd:'810004', codigo:'D3011', label:'FAECyS / similar', cant:percent(params.aporte_faecys_pct), valUnit:null, baseCalc: baseFaec, val:-descFaec, tipo:'desc' });
  if (otrosD > 0) rows.push({ lsd:'810099', codigo:'D3099', label:otrosDLabel, cant:'—', valUnit:null, baseCalc: null, val:-otrosD, tipo:'desc' });
  rows.push({ label:'NETO ESTIMADO', cant:'', valUnit:null, val:neto, tipo:'total' });

  document.getElementById('mensualBreakdown').innerHTML = rows.map(r => {
    const isTotal = r.tipo === 'total';
    const cls = isTotal ? 'total-row' : '';
    const col = r.tipo === 'desc' ? 'class="neg-td"' : '';
    const cant = isTotal ? '' : (r.cant || '—');
    const vu = (isTotal || r.valUnit === null || r.valUnit === undefined) ? '' : money(r.valUnit);
    return `<tr class="${cls}"><td>${r.label}</td><td style="text-align:center; color:var(--mute); font-size:.78rem;">${cant}</td><td style="text-align:right; color:var(--mute); font-size:.78rem;">${vu}</td><td ${col}>${money(r.val)}</td></tr>`;
  }).join('');

  lastMensualData = {
    nombre: sv('mNombre') || '—', categoria: sv('mCategoria') || '—',
    empresa: params.empresa, convenio: CONVENIOS[convenioKey]?.nombre || params.convenio_referencia,
    basico, antiguAn, dias, remunerativo, noRemunerativo, descuentos, neto, contribuciones,
    contribGeneral, contribPyme, regimenAct: regimenActNombre,
    rows, tipo: 'mensual'
  };
}

// ═══════════════════════════════════════════════════════════════════════════
//  LIQUIDACIÓN FINAL — Motor completo con reforma
// ═══════════════════════════════════════════════════════════════════════════
function calcularAntiguedades(startDate, endDate) {
  if (!startDate || !endDate) return { paraVacYPreaviso: 0, paraIndem245: 0, mesesExactos: 0 };
  const s = new Date(startDate+'T00:00:00');
  const e = new Date(endDate+'T00:00:00');
  if (isNaN(s)||isNaN(e)||e<s) return { paraVacYPreaviso: 0, paraIndem245: 0, mesesExactos: 0 };
  const months = (e.getFullYear()-s.getFullYear())*12 + (e.getMonth()-s.getMonth()) + (e.getDate()>=s.getDate()?0:-1);
  const years = Math.floor(months/12);
  const rem = months%12;
  return {
    paraVacYPreaviso: Math.max(0, years),
    paraIndem245: rem > 3 ? years + 1 : Math.max(0, years),
    mesesExactos: months
  };
}

function diasVacacionesPorAntiguedad(anios) {
  if (anios < 5)  return 14;
  if (anios < 10) return 21;
  if (anios < 20) return 28;
  return 35;
}

function calcularDiasVacNoGozProporcional(anios, diasServicioEnAnio) {
  const diasAnuales = diasVacacionesPorAntiguedad(anios);
  return round2((diasAnuales * diasServicioEnAnio) / 360);
}

function mesesPreavisoLegal(antiguedadAnios, esPeriodoPrueba, esRenuncia) {
  if (esRenuncia) return 0.5;
  if (esPeriodoPrueba) return 0.5;
  if (antiguedadAnios <= 5) return 1;
  return 2;
}

function aplicarTope245(baseCalculo, promedioCCT) {
  const topeMaximo = promedioCCT * (Number(params.tope_245_pct_sobre_promedio_cct) || 3);
  const baseMinima = baseCalculo * ((Number(params.tope_245_base_minima_pct) || 67) / 100);
  let baseFinal = baseCalculo;
  let topeAplicado = 'Base íntegra (no superó el tope máximo)';
  if (promedioCCT > 0 && baseCalculo > topeMaximo) {
    baseFinal = Math.max(topeMaximo, baseMinima);
    topeAplicado = baseFinal === topeMaximo
      ? `Tope máx. Ley 27.802 aplicado (${params.tope_245_pct_sobre_promedio_cct}× prom. CCT)`
      : `Tope mín. ${params.tope_245_base_minima_pct}% aplicado (Vizzoti por ley)`;
  }
  return { base: baseFinal, topeMaximo, baseMinima, topeAplicado };
}

function renderCausales() {
  const sel = document.getElementById('fTipo');
  if (!sel) return;
  sel.innerHTML = '';
  const grupos = {
    no_indem:   '── No indemnizables ──',
    indem_245:  '── Indemnizables art. 245 (100%) ──',
    indem_247:  '── Indemnizables art. 247 (50%) ──'
  };
  Object.entries(grupos).forEach(([grupoKey, grupoLabel]) => {
    const optGroup = document.createElement('optgroup');
    optGroup.label = grupoLabel;
    Object.entries(CAUSALES).forEach(([key, c]) => {
      if (c.grupo !== grupoKey) return;
      const opt = document.createElement('option');
      opt.value = key; opt.textContent = c.nombre;
      optGroup.appendChild(opt);
    });
    sel.appendChild(optGroup);
  });
  sel.value = 'despido_sin_causa_245';
}

function calcFinal() {
  const causalKey  = sv('fTipo') || 'despido_sin_causa_245';
  const causal     = CAUSALES[causalKey] || CAUSALES.despido_sin_causa_245;
  const convenioKey = sv('mConvenio') || params.convenio_seleccionado;
  const convenio    = CONVENIOS[convenioKey] || CONVENIOS.comercio;

  // ── Base de cálculo (fijos + no rem que entran + promedio variables) ────
  const remFijos   = nv('fRemFijos');
  const noRemInd   = nv('fNoRemIndem');
  const promVars   = nv('fPromVariables');
  const baseCalculoSinTope = round2(remFijos + noRemInd + promVars);

  // ── Fechas y antigüedades ───────────────────────────────────────────────
  const ingreso  = sv('fIngreso');
  const egreso   = sv('fEgreso');
  const antig    = calcularAntiguedades(ingreso, egreso);

  // ── Preaviso ────────────────────────────────────────────────────────────
  const preavisoAutomatico = chk('fPreavisoAuto');
  const esPeriodoPrueba = causalKey === 'periodo_prueba';
  const esRenuncia = causalKey === 'renuncia_240';
  const mesesPreavisoLegalCalc = mesesPreavisoLegal(antig.paraVacYPreaviso, esPeriodoPrueba, esRenuncia);
  const mesesPreaviso = preavisoAutomatico ? mesesPreavisoLegalCalc : nv('fPreaviso');

  const diasIntegracion = nv('fDiasIntegracion');
  const diasMes = nv('fDiasMes');

  // ── Vacaciones ─────────────────────────────────────────────────────────
  const diasServicioAnio = nv('fDiasServicioAnio');
  const vacCalcAuto = chk('fVacAuto');
  const diasVacManual = nv('fVacPend');
  const diasVac = vacCalcAuto
    ? calcularDiasVacNoGozProporcional(antig.paraVacYPreaviso, diasServicioAnio)
    : diasVacManual;

  // ── SAC ────────────────────────────────────────────────────────────────
  const mesesSacAuto = chk('fSacAuto');
  const mesesSacManual = nv('fMesesSac');
  let mesesSac = mesesSacManual;
  if (mesesSacAuto && egreso) {
    const e = new Date(egreso+'T00:00:00');
    const mesEgreso = e.getMonth();
    const diaEgreso = e.getDate();
    const inicioSem = mesEgreso < 6 ? 0 : 6;
    const mesesEnSem = (mesEgreso - inicioSem) + (diaEgreso/30);
    mesesSac = round2(mesesEnSem);
  }

  // ── Agravantes ─────────────────────────────────────────────────────────
  const agEmbarazo    = chk('fAgEmbarazo');
  const agMatrimonio  = chk('fAgMatrimonio');
  const agGremial     = chk('fAgGremial');
  const agDiscrim     = chk('fAgDiscrim');
  const agDiscrimPct  = nv('fAgDiscrimPct') || 50;

  const divisor = params.divisor_sueldo;
  const divisorVac = params.divisor_vacaciones;
  const sacDiv = params.sac_divisor;

  // ── Cálculos ───────────────────────────────────────────────────────────
  const sueldoProp = round2((remFijos / divisor) * diasMes);
  const baseSac = remFijos + promVars;
  const sacProp = round2((baseSac / sacDiv) * (mesesSac / 6));

  const vacNoGoz = round2((baseCalculoSinTope / divisorVac) * diasVac);
  const sacVacNoGoz = round2(vacNoGoz / sacDiv);

  const preaviso = causal.preaviso ? round2(baseCalculoSinTope * mesesPreaviso) : 0;
  const sacPreaviso = round2(preaviso / sacDiv);

  const integracion = causal.integracion ? round2((baseCalculoSinTope / divisor) * diasIntegracion) : 0;
  const sacIntegracion = round2(integracion / sacDiv);

  // Promedio CCT: priorizar el valor del panel editable (params), si no cae al default del convenio
  const promCCTPanel = Number(params['promedio_cct_' + convenioKey] || 0);
  const promCCTAplicable = promCCTPanel > 0 ? promCCTPanel : (convenio.promedioCCT || 0);

  const topeInfo = aplicarTope245(baseCalculoSinTope, promCCTAplicable);
  const baseConTope = topeInfo.base;
  const indemAntig = round2(baseConTope * antig.paraIndem245 * causal.indem245);

  let indemAgravada = 0;
  const agravantesList = [];
  if (causal.indem245 > 0) {
    if (agEmbarazo)   { const v = round2(baseConTope * 13); indemAgravada += v; agravantesList.push({nombre:'Agrav. maternidad (art. 178+182 LCT — 13 sueldos)', val:v}); }
    if (agMatrimonio) { const v = round2(baseConTope * 13); indemAgravada += v; agravantesList.push({nombre:'Agrav. matrimonio (art. 182 LCT — 13 sueldos)', val:v}); }
    if (agGremial)    { const v = round2(baseConTope * 13); indemAgravada += v; agravantesList.push({nombre:'Agrav. representante gremial (Ley 23.551 art. 52)', val:v}); }
    if (agDiscrim)    { const v = round2(indemAntig * (agDiscrimPct/100)); indemAgravada += v; agravantesList.push({nombre:`Agrav. acto discriminatorio ${agDiscrimPct}% (Ley 27.742 art. 245 bis)`, val:v}); }
  }
  const sacAgravada = round2(indemAgravada / sacDiv);

  const total = round2(
    sueldoProp + sacProp + vacNoGoz + sacVacNoGoz +
    preaviso + sacPreaviso + integracion + sacIntegracion +
    indemAntig + indemAgravada + sacAgravada
  );

  // ── Render ─────────────────────────────────────────────────────────────
  document.getElementById('fAntiguedadVac').textContent = antig.paraVacYPreaviso + ' año/s';
  document.getElementById('fAntiguedad245').textContent = antig.paraIndem245 + ' año/s';
  document.getElementById('fTotal').textContent = money(total);
  document.getElementById('fBaseCalculo').textContent = money(baseCalculoSinTope);
  document.getElementById('fBaseConTope').textContent = money(baseConTope);
  document.getElementById('fTopeAplicado').textContent = topeInfo.topeAplicado;
  document.getElementById('fCausalNombre').textContent = causal.nombre;
  document.getElementById('fPromedioCCT').textContent = money(promCCTAplicable);
  document.getElementById('fTopeMax').textContent = money(topeInfo.topeMaximo);
  document.getElementById('fBaseMin').textContent = money(topeInfo.baseMinima);
  document.getElementById('fDiasVacCalc').textContent = `${diasVac} día/s (${diasVacacionesPorAntiguedad(antig.paraVacYPreaviso)}/año)`;
  document.getElementById('fPreavisoCalc').textContent = mesesPreaviso + ' mes/es';

  const rows = [];
  rows.push({ seccion: 'LIQUIDACIÓN COMÚN' });
  rows.push({
    lsd:'110000', codigo:'R1001', label:`Sueldo proporcional mes`, cantidad:`${diasMes} días`,
    baseCalc: round2(remFijos/divisor), val: sueldoProp, tipo:'rem', show: sueldoProp > 0
  });
  rows.push({
    lsd:'120000', codigo:'R1200', label:`SAC proporcional`, cantidad:`${mesesSac.toFixed(2)}/6 m`,
    baseCalc: baseSac, val: sacProp, tipo:'rem', show: sacProp > 0
  });
  rows.push({
    lsd:'520012', codigo:'N3002', label:`Vacaciones no gozadas`, cantidad:`${diasVac} días`,
    baseCalc: baseCalculoSinTope, val: vacNoGoz, tipo:'noRemIndem', show: vacNoGoz > 0
  });
  rows.push({
    lsd:'520018', codigo:'N3003', label:'SAC s/Vacaciones no gozadas', cantidad:'',
    baseCalc: vacNoGoz, val: sacVacNoGoz, tipo:'noRemIndem', show: sacVacNoGoz > 0
  });

  if (causal.preaviso || causal.integracion) {
    rows.push({ seccion: 'PREAVISO E INTEGRACIÓN' });
    if (causal.preaviso) {
      rows.push({
        lsd:'520015', codigo:'N3000', label:`Preaviso${preavisoAutomatico ? ' (auto ley)' : ' (manual)'}`,
        cantidad:`${mesesPreaviso} m`, baseCalc: baseCalculoSinTope, val: preaviso, tipo:'noRemIndem', show: true
      });
      rows.push({
        lsd:'520017', codigo:'N3001', label:'SAC s/Preaviso', cantidad:'',
        baseCalc: preaviso, val: sacPreaviso, tipo:'noRemIndem', show: sacPreaviso > 0
      });
    }
    if (causal.integracion) {
      rows.push({
        lsd:'520016', codigo:'N3004', label:'Integración mes de despido',
        cantidad:`${diasIntegracion} días`, baseCalc: baseCalculoSinTope, val: integracion, tipo:'noRemIndem', show: integracion > 0
      });
      rows.push({
        lsd:'520017', codigo:'N3005', label:'SAC s/Integración', cantidad:'',
        baseCalc: integracion, val: sacIntegracion, tipo:'noRemIndem', show: sacIntegracion > 0
      });
    }
  }

  if (causal.indem245 > 0) {
    const etiquetaArt = causal.indem245 === 0.5 ? 'ART. 247 LCT (50% del 245)' : 'ART. 245 LCT';
    rows.push({ seccion: `INDEMNIZACIÓN POR ANTIGÜEDAD — ${etiquetaArt}` });
    rows.push({
      lsd:'520014', codigo:'N3006',
      label:`Indemnización por antigüedad`,
      cantidad:`${antig.paraIndem245} años × ${causal.indem245 === 1 ? '1' : '½'} base`,
      baseCalc: baseConTope, val: indemAntig, tipo:'noRemIndem', show: true
    });
  }

  if (agravantesList.length > 0) {
    rows.push({ seccion: 'INDEMNIZACIÓN AGRAVADA' });
    agravantesList.forEach(a => rows.push({
      lsd:'520011', codigo:'N3007', label: a.nombre, cantidad:'',
      baseCalc: baseConTope, val: a.val, tipo:'noRemIndem', show: true
    }));
    if (sacAgravada > 0) rows.push({
      lsd:'52011', codigo:'N3008', label: 'SAC s/Indem. agravada', cantidad:'',
      baseCalc: indemAgravada, val: sacAgravada, tipo:'noRemIndem', show: true
    });
  }

  // Totales separados en 3 categorías (como pidió Marcia en el Excel)
  const totalRem = round2(sueldoProp + sacProp);
  const totalNoRem = 0; // no rem puros del mes del egreso: 0 (no hay en este flujo)
  const totalNoRemIndem = round2(
    vacNoGoz + sacVacNoGoz + preaviso + sacPreaviso +
    integracion + sacIntegracion + indemAntig + indemAgravada + sacAgravada
  );

  rows.push({ seccion: 'TOTALES' });
  rows.push({ label:'Total Remunerativos', val: totalRem, tipo:'subtotal', show: true });
  if (totalNoRem > 0) rows.push({ label:'Total No Remunerativos', val: totalNoRem, tipo:'subtotal', show: true });
  rows.push({ label:'Total No Remunerativos Indemnizatorios', val: totalNoRemIndem, tipo:'subtotal', show: true });
  rows.push({ label:'TOTAL ESTIMADO', val: total, isTotal: true });

  // Render pantalla: usa 2 columnas simples (concepto + valor)
  document.getElementById('finalBreakdown').innerHTML = rows.filter(r => r.seccion || r.show !== false).map(r => {
    if (r.seccion) return `<tr class="seccion-row"><td colspan="2">${r.seccion}</td></tr>`;
    const cls = r.isTotal ? 'total-row' : (r.tipo === 'subtotal' ? 'subtotal-row' : '');
    return `<tr class="${cls}"><td>${r.label}</td><td>${money(r.val)}</td></tr>`;
  }).join('');

  let avisoCausal = '';
  if (causal.grupo === 'no_indem') {
    avisoCausal = 'Causal NO indemnizable: sólo se liquidan conceptos comunes (sueldo, SAC, vacaciones no gozadas con su SAC). No corresponde indemnización art. 245 ni preaviso (salvo período de prueba).';
  } else if (causal.grupo === 'indem_245') {
    avisoCausal = 'Causal con indemnización COMPLETA del art. 245 LCT. Corresponde preaviso según antigüedad e integración del mes de despido. Si aplican agravantes (maternidad, matrimonio, gremial, discriminación), tildalos debajo.';
  } else if (causal.grupo === 'indem_247') {
    avisoCausal = 'Causal con indemnización del art. 247 LCT (50% del art. 245). Como regla general NO corresponde preaviso ni integración. La base de cálculo usa también los topes de la Ley 27.802.';
  }
  document.getElementById('fAvisoCausal').textContent = avisoCausal;

  // Deshabilitar agravantes si la causal no admite
  const disableAg = causal.indem245 === 0;
  ['fAgEmbarazo','fAgMatrimonio','fAgGremial','fAgDiscrim','fAgDiscrimPct'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = disableAg;
  });

  lastFinalData = {
    empresa: params.empresa, convenio: convenio.nombre,
    causal: causal.nombre, causalGrupo: causal.grupo,
    ingreso, egreso,
    antigVac: antig.paraVacYPreaviso, antigIndem: antig.paraIndem245,
    baseCalculo: baseCalculoSinTope, baseConTope, topeInfo,
    promedioCCT: promCCTAplicable,
    sueldoProp, sacProp, vacNoGoz, sacVacNoGoz,
    preaviso, sacPreaviso, integracion, sacIntegracion,
    indemAntig, indemAgravada, sacAgravada, agravantesList,
    mesesPreaviso, diasVac, diasIntegracion, diasMes, mesesSac,
    total, rows, tipo: 'final'
  };
}

// ═══════════════════════════════════════════════════════════════════════════
//  PDF
// ═══════════════════════════════════════════════════════════════════════════
function buildPDF(data) {
  const now = new Date();
  const fechaEmision = now.toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'numeric'});
  const horaEmision  = now.toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'});
  const referencia   = 'KLP-' + now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + Math.floor(Math.random()*900+100);
  const esM = data.tipo === 'mensual';

  // ── Render de filas con columnas estilo Excel de Marcia ──────────────
  const filas = (data.rows || []).map(r => {
    // Fila de sección
    if (r.seccion) return `<tr><td colspan="${esM?7:6}" style="background:#eef2f7;font-weight:700;color:#0b4a6e;padding:6px 10px;font-size:10px;text-transform:uppercase;letter-spacing:.06em;border-top:2px solid #0b4a6e;">${r.seccion}</td></tr>`;

    const val = r.val !== undefined ? r.val : 0;
    const isTotal = esM ? (r.tipo === 'total') : r.isTotal;
    const isSubtotal = r.tipo === 'subtotal';
    const isDesc = r.tipo === 'desc';

    // Fila de total o subtotal
    if (isTotal || isSubtotal) {
      const rowStyle = isTotal
        ? 'background:#0b4a6e;color:#fff;font-weight:700;'
        : 'background:#f5f7fa;font-weight:600;color:#0b4a6e;';
      const valColor = isTotal ? '#22d9df' : '#0b4a6e';
      return `<tr style="${rowStyle}">
        <td colspan="${esM?6:5}" style="padding:7px 10px; font-size:${isTotal?12:11}px;">${r.label}</td>
        <td style="padding:7px 10px; text-align:right; font-size:${isTotal?13:11}px; font-weight:700; color:${valColor};">${money(val)}</td>
      </tr>`;
    }

    // Fila normal (con columnas LSD / Código / Concepto / Cant / Base / Rem-NoRem / Desc)
    const lsd = r.lsd || '';
    const cod = r.codigo || '';
    const concept = r.label || '';
    const cant = r.cant || r.cantidad || '';
    const base = (r.baseCalc !== null && r.baseCalc !== undefined) ? money(r.baseCalc) : '';
    const valAbs = Math.abs(val);

    // El valor va en Descuentos si es negativo, si no en Rem/NoRem
    const remCell = isDesc ? '' : money(valAbs);
    const descCell = isDesc ? money(valAbs) : '';

    return `<tr style="border-bottom:1px solid #eef2f5;">
      <td style="padding:5px 8px; font-size:9.5px; color:#6b7f8e; font-family:monospace;">${lsd}</td>
      <td style="padding:5px 8px; font-size:9.5px; color:#0b4a6e; font-family:monospace; font-weight:600;">${cod}</td>
      <td style="padding:5px 8px; font-size:10.5px; color:#17252e;">${concept}</td>
      <td style="padding:5px 8px; text-align:center; font-size:10px; color:#6b7f8e;">${cant}</td>
      <td style="padding:5px 8px; text-align:right; font-size:10px; color:#6b7f8e;">${base}</td>
      <td style="padding:5px 8px; text-align:right; font-size:11px; color:#17252e; font-weight:500;">${remCell}</td>
      <td style="padding:5px 8px; text-align:right; font-size:11px; color:#c0392b; font-weight:500;">${descCell}</td>
    </tr>`;
  }).join('');

  // ── Header de tabla: 7 columnas como Excel de Marcia ────────────────
  const headerCols = `<thead>
    <tr style="background:#0b4a6e;color:#fff;">
      <td style="padding:8px; font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.04em;">LSD AFIP</td>
      <td style="padding:8px; font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.04em;">Código</td>
      <td style="padding:8px; font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.04em;">Concepto / Detalle</td>
      <td style="padding:8px; font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.04em; text-align:center;">Cantidad</td>
      <td style="padding:8px; font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.04em; text-align:right;">Base cálculo</td>
      <td style="padding:8px; font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.04em; text-align:right;">Rem / No Rem</td>
      <td style="padding:8px; font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.04em; text-align:right;">Descuentos</td>
    </tr>
  </thead>`;

  const contribBlock = (esM && data.contribuciones) ? `
    <div class="section-bar">Contribuciones patronales · Comparativa de regímenes (Ley 27.541 art. 19)</div>
    <div class="resumen-mini">
      <table style="width:100%;">
        <tr style="background:#eef2f7;"><td style="font-weight:700; color:#0b4a6e;">Concepto</td><td style="text-align:right; font-weight:700; color:#0b4a6e;">Régimen General (inc. a)</td><td style="text-align:right; font-weight:700; color:#4a9030;">Régimen PyME (inc. b)</td></tr>
        <tr><td>Jubilación SIPA</td><td style="text-align:right;">${percent(data.contribGeneral.jubilacion_pct)} · ${money(data.contribGeneral.jubilacion)}</td><td style="text-align:right;">${percent(data.contribPyme.jubilacion_pct)} · ${money(data.contribPyme.jubilacion)}</td></tr>
        <tr><td>PAMI Ley 19.032</td><td style="text-align:right;">${percent(data.contribGeneral.pami_pct)} · ${money(data.contribGeneral.pami)}</td><td style="text-align:right;">${percent(data.contribPyme.pami_pct)} · ${money(data.contribPyme.pami)}</td></tr>
        <tr><td>Asignaciones Familiares</td><td style="text-align:right;">${percent(data.contribGeneral.aaff_pct)} · ${money(data.contribGeneral.aaff)}</td><td style="text-align:right;">${percent(data.contribPyme.aaff_pct)} · ${money(data.contribPyme.aaff)}</td></tr>
        <tr><td>Fondo Nacional de Empleo</td><td style="text-align:right;">${percent(data.contribGeneral.fne_pct)} · ${money(data.contribGeneral.fne)}</td><td style="text-align:right;">${percent(data.contribPyme.fne_pct)} · ${money(data.contribPyme.fne)}</td></tr>
        <tr style="background:#f9fafb;"><td style="font-weight:600;">Subtotal Seg. Social</td><td style="text-align:right; font-weight:600;">${percent(data.contribGeneral.subtotal_ss_pct)} · ${money(data.contribGeneral.subtotal_ss)}</td><td style="text-align:right; font-weight:600;">${percent(data.contribPyme.subtotal_ss_pct)} · ${money(data.contribPyme.subtotal_ss)}</td></tr>
        <tr><td>Obra Social (Ley 23.660)</td><td style="text-align:right;">${percent(data.contribGeneral.obra_social_pct)} · ${money(data.contribGeneral.obra_social)}</td><td style="text-align:right;">${percent(data.contribPyme.obra_social_pct)} · ${money(data.contribPyme.obra_social)}</td></tr>
        <tr style="background:#0b4a6e; color:#fff;"><td style="font-weight:700;">TOTAL CONTRIBUCIONES</td><td style="text-align:right; font-weight:700; color:${data.regimenAct==='General'?'#22d9df':'#a0c4d8'};">${percent(data.contribGeneral.total_pct)} · ${money(data.contribGeneral.total)}</td><td style="text-align:right; font-weight:700; color:${data.regimenAct==='PyME'?'#22d9df':'#a0c4d8'};">${percent(data.contribPyme.total_pct)} · ${money(data.contribPyme.total)}</td></tr>
      </table>
      <div style="font-size:10px;color:#6b7f8e;padding-top:6px;">Régimen aplicado: <strong style="color:#0b4a6e;">${data.regimenAct}</strong>. Importe a cargo del empleador. Ahorro PyME vs General: <strong style="color:#4a9030;">${money(data.contribGeneral.total - data.contribPyme.total)}</strong> por mes.</div>
    </div>` : '';

  const finalInfoBlock = (!esM) ? `
    <div class="section-bar">Base de cálculo art. 245 LCT (Ley 27.802)</div>
    <div class="resumen-mini">
      <table>
        <tr><td>Causal invocada</td><td>${data.causal}</td></tr>
        <tr><td>Antigüedad para vacaciones/preaviso</td><td>${data.antigVac} año/s</td></tr>
        <tr><td>Antigüedad para indem. art. 245 (fracción &gt;3m)</td><td>${data.antigIndem} año/s</td></tr>
        <tr><td>Base de cálculo (fijos + promedio variables)</td><td>${money(data.baseCalculo)}</td></tr>
        <tr><td>Promedio CCT aplicable</td><td>${money(data.promedioCCT)}</td></tr>
        <tr><td>Tope máximo (${params.tope_245_pct_sobre_promedio_cct}× promedio CCT)</td><td>${money(data.topeInfo.topeMaximo)}</td></tr>
        <tr><td>Base mínima (${params.tope_245_base_minima_pct}% de la remuneración — Vizzoti)</td><td>${money(data.topeInfo.baseMinima)}</td></tr>
        <tr style="background:#fffbeb;"><td><strong>Base finalmente aplicada</strong></td><td><strong>${money(data.baseConTope)}</strong></td></tr>
        <tr><td colspan="2" style="font-size:10px;color:#666;padding-top:4px;">${data.topeInfo.topeAplicado}</td></tr>
      </table>
    </div>` : '';

  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:Arial,Helvetica,sans-serif;background:#fff;color:#111;font-size:13px;}
    .page{width:210mm;min-height:297mm;margin:0 auto;padding:18mm 16mm;}
    .header-bar{background:#020f27;color:#fff;padding:10px 16px;display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}
    .section-bar{background:#0b4a6e;color:#fff;padding:5px 10px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin:12px 0 6px;}
    .info-table{width:100%;border-collapse:collapse;font-size:11px;}
    .info-table td{padding:5px 8px;border:1px solid #ddd;}
    .info-table td:first-child{font-weight:600;background:#f5f5f5;width:38%;}
    .breakdown-table{width:100%;border-collapse:collapse;margin-top:2px;}
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
    <div class="header-bar">
      <div>
        <div style="font-size:14px;font-weight:700;letter-spacing:.02em;">Recibo de Liquidación — ${esM ? 'Liquidación Mensual' : 'Liquidación Final'}</div>
        <div style="font-size:11px;color:#a0c4d8;margin-top:2px;">Kit Online de Liquidación · Uso educativo/profesional</div>
      </div>
      <div style="text-align:right;font-size:10px;color:#a0c4d8;">
        <div style="font-size:12px;font-weight:700;color:#22d9df;">${referencia}</div>
        <div>Fecha: ${fechaEmision} · ${horaEmision}</div>
      </div>
    </div>

    <div class="section-bar">Datos identificativos</div>
    <table class="info-table">
      <tr><td>Razón Social / Organización</td><td>${data.empresa || '—'}</td><td>Convenio de referencia</td><td>${data.convenio || '—'}</td></tr>
      <tr><td>Tipo de liquidación</td><td>${esM ? 'Liquidación mensual' : 'Liquidación final'}</td><td>Referencia del documento</td><td>${referencia}</td></tr>
      ${esM ? `<tr><td>Nombre del caso</td><td>${data.nombre||'—'}</td><td>Categoría</td><td>${data.categoria||'—'}</td></tr>
              <tr><td>Básico de referencia</td><td>${money(data.basico)}</td><td>Días trabajados</td><td>${data.dias||'—'}</td></tr>
              <tr><td>Antigüedad (años)</td><td>${data.antiguAn||0}</td><td>Versión de parámetros</td><td>${PARAMS_VERSION}</td></tr>`
            : `<tr><td>Fecha de ingreso</td><td>${data.ingreso||'—'}</td><td>Fecha de egreso</td><td>${data.egreso||'—'}</td></tr>
              <tr><td>Versión de parámetros</td><td>${PARAMS_VERSION}</td><td>&nbsp;</td><td>&nbsp;</td></tr>`}
    </table>

    ${finalInfoBlock}

    <div class="section-bar">Detalle de conceptos</div>
    <table class="breakdown-table">${headerCols}<tbody>${filas}</tbody></table>

    ${esM ? `
    <div class="section-bar">Resumen</div>
    <div class="resumen-mini">
      <table>
        <tr><td>Total remunerativo</td><td>${money(data.remunerativo)}</td><td style="width:50%;">Total no remunerativo</td><td>${money(data.noRemunerativo)}</td></tr>
        <tr><td>Total descuentos</td><td style="color:#c0392b;">${money(data.descuentos)}</td><td><strong>NETO A COBRAR</strong></td><td style="font-size:14px;color:#020f27;font-weight:700;">${money(data.neto)}</td></tr>
      </table>
    </div>${contribBlock}
    ` : `
    <div class="section-bar">Total a liquidar</div>
    <div class="resumen-mini"><table><tr><td><strong>TOTAL ESTIMADO</strong></td><td style="font-size:14px;color:#020f27;font-weight:700;">${money(data.total)}</td></tr></table></div>`}

    <div class="aviso-box">
      <strong>Nota:</strong> Este recibo es de carácter educativo/estimativo. Los importes se calculan con los parámetros configurados y pueden no reflejar la normativa vigente al momento de la liquidación real. Marco normativo aplicado: Ley 20.744 (LCT), Ley 27.742 (Bases) y Ley 27.802 (Modernización Laboral).
    </div>

    <hr class="cut-line"><span class="cut-icon" style="left:0;top:-8px;">✂</span>

    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;font-size:11px;">
      <div><strong>${referencia}</strong> · ${fechaEmision}<br/><span style="color:#666;">${data.empresa||'—'} · ${data.convenio||'—'}</span></div>
      <div style="text-align:right;">${esM ? `Neto estimado: <strong style="font-size:13px;">${money(data.neto)}</strong>` : `Total: <strong style="font-size:13px;">${money(data.total)}</strong>`}</div>
    </div>

    <div class="footer-strip">
      <span>Generado con Kit Online de Liquidación · Parámetros v${PARAMS_VERSION}</span>
      <span>${fechaEmision} ${horaEmision}</span>
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

function exportMensualPDF() { if (!lastMensualData) { alert('Primero calculá la liquidación mensual.'); return; } buildPDF(lastMensualData); }
function exportFinalPDF()   { if (!lastFinalData)   { alert('Primero calculá la liquidación final.'); return; }   buildPDF(lastFinalData); }

function copyText(data) {
  if (!data) { alert('Primero calculá.'); return; }
  let text;
  if (data.tipo === 'mensual') {
    text = `LIQUIDACIÓN MENSUAL\nCaso: ${data.nombre} | Cat: ${data.categoria}\nRemunerativo: ${money(data.remunerativo)}\nNo remunerativo: ${money(data.noRemunerativo)}\nDescuentos: ${money(data.descuentos)}\nNeto estimado: ${money(data.neto)}\nContribuciones patronales: ${money(data.contribuciones)}`;
  } else {
    text = `LIQUIDACIÓN FINAL\nCausal: ${data.causal}\nAntigüedad 245: ${data.antigIndem} año/s\nBase con tope: ${money(data.baseConTope)}\nTotal estimado: ${money(data.total)}`;
  }
  navigator.clipboard.writeText(text).then(() => alert('Resumen copiado al portapapeles.'));
}

function exportJson() {
  const blob = new Blob([JSON.stringify(params,null,2)],{type:'application/json'});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'kit-laboral-params-' + PARAMS_VERSION + '.json';
  a.click(); URL.revokeObjectURL(url);
}
function importJson(file) {
  const r = new FileReader();
  r.onload = e => {
    try { params = { ...DEFAULT_PARAMS, ...JSON.parse(e.target.result) }; saveParams(); renderAll(); alert('Parámetros importados correctamente.'); }
    catch { alert('El archivo no contiene un JSON válido.'); }
  };
  r.readAsText(file);
}

function attachEvents() {
  document.getElementById('btnCalcularMensual').addEventListener('click', calcMensual);
  document.getElementById('btnCopiarMensual').addEventListener('click', () => copyText(lastMensualData));
  document.getElementById('btnExportarMensualPDF').addEventListener('click', exportMensualPDF);
  const mConv = document.getElementById('mConvenio');
  const mCat  = document.getElementById('mCategoria');
  if (mConv) mConv.addEventListener('change', onConvenioChange);
  if (mCat)  mCat.addEventListener('change', onCategoriaChange);
  const chkCom = document.getElementById('chkComisiones');
  if (chkCom) chkCom.addEventListener('change', () => {
    const inp = document.getElementById('mVariables');
    if (inp) inp.disabled = !chkCom.checked;
    calcMensual();
  });
  ['chkNraportaOS','chkNraportaSind','chkNraportaFaecys'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', calcMensual);
  });

  // Selectores de régimen patronal y categoría MIPyME (pedido expreso de Horacio)
  const mRegimen = document.getElementById('mRegimenPatronal');
  if (mRegimen) {
    mRegimen.value = params.regimen_patronal || 'pyme';
    mRegimen.addEventListener('change', () => {
      params.regimen_patronal = mRegimen.value;
      const regs = getRegimenesActivos();
      const reg = regs[mRegimen.value] || regs.pyme;
      params.contribuciones_patronales_pct = reg.total_pct;
      renderDashboard();
      calcMensual();
    });
  }
  const mCatMipyme = document.getElementById('mCategoriaMipyme');
  if (mCatMipyme) {
    mCatMipyme.value = params.categoria_mipyme || 'pequena';
    mCatMipyme.addEventListener('change', () => {
      params.categoria_mipyme = mCatMipyme.value;
      calcMensual();
    });
  }

  document.getElementById('btnCalcularFinal').addEventListener('click', calcFinal);
  document.getElementById('btnCopiarFinal').addEventListener('click', () => copyText(lastFinalData));
  document.getElementById('btnExportarFinalPDF').addEventListener('click', exportFinalPDF);
  document.getElementById('fTipo').addEventListener('change', calcFinal);

  ['fPreavisoAuto','fVacAuto','fSacAuto'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', () => {
      if (id === 'fPreavisoAuto') document.getElementById('fPreaviso').disabled = el.checked;
      if (id === 'fVacAuto') document.getElementById('fVacPend').disabled = el.checked;
      if (id === 'fSacAuto') document.getElementById('fMesesSac').disabled = el.checked;
      calcFinal();
    });
  });

  ['fAgEmbarazo','fAgMatrimonio','fAgGremial','fAgDiscrim'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', calcFinal);
  });
  const fAgDiscrimPct = document.getElementById('fAgDiscrimPct');
  if (fAgDiscrimPct) fAgDiscrimPct.addEventListener('input', calcFinal);

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

function renderAll() {
  renderDashboard();
  renderParams();
  renderChecklist();
  renderMeta();
  renderSelectorConvenio();
  renderCausales();
  setMensualDefaults();
  calcMensual();
  calcFinal();
}

showOverlay('Iniciando Kit Online de Liquidación…');
updateOverlay('ONE · Human-Tech · v' + PARAMS_VERSION);
tabSetup();
attachEvents();
renderAll();
setTimeout(hideOverlay, 1000);