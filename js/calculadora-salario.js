/**
 * FINX — Calculadora de Salario Neto (Panamá)
 * Fórmulas referenciales. Las tasas están centralizadas para facilitar actualizaciones.
 */

/* =========================
   CONSTANTES DE TASAS / LÍMITES
   ========================= */
const TASA_CSS = 0.0975;
const TASA_SEGURO_EDUCATIVO = 0.0125;
const LIMITE_ISR_EXENTO = 11000;
const LIMITE_ISR_15 = 50000;
const TASA_ISR_15 = 0.15;
const TASA_ISR_25 = 0.25;
/** Monto fijo del tramo del 15% cuando el ingreso supera B/. 50,000: (50,000 - 11,000) × 0.15 */
const ISR_FIJO_TRAMO_15 = 5850;
const SALARIO_MAXIMO = 1000000;
const MESES_ANIO = 12;

/* =========================
   DICCIONARIO DE TRADUCCIÓN
   ========================= */
const translations = {
    es: {
        // Sidebar & Navbar
        management: 'Gestión',
        lessons: 'Lecciones',
        achievements: 'Logros',
        goals: 'Metas',
        calculator: 'Calculadora',
        help: 'Ayuda',
        assistant: 'Asistente',
        user: 'Usuario',
        level: 'Nivel 2',
        profile: 'Mi Perfil',
        settings: 'Configuración',
        privacy: 'Privacidad',
        logout: 'Cerrar Sesión',
        langToggleTitle: 'Traducir página',
        themeToggleTitle: 'Cambiar tema',

        // Header Hero
        badgeFinxText: 'Herramienta FINX',
        heroTitle: 'Calculadora de Salario Neto',
        heroLead: 'Calcula cuánto recibirás realmente después de impuestos y deducciones en Panamá.',

        // Form
        formTitle: 'Tus datos salariales',
        formSubtitle: 'Completa el formulario para obtener una estimación de tu salario neto mensual.',
        salarioLabelMensual: 'Salario bruto mensual (B/.)',
        salarioLabelQuincenal: 'Salario bruto quincenal (B/.)',
        salarioPlaceholder: 'Ej: 1500.00',
        salarioHintMensual: 'Ingresa tu salario bruto antes de deducciones.',
        salarioHintQuincenal: 'Ingresa lo que ganas cada quincena. Se convertirá a equivalente mensual (× 2) para los cálculos.',
        frecuenciaLabel: 'Frecuencia de pago',
        optMensual: 'Mensual',
        optQuincenal: 'Quincenal',
        frecuenciaHint: 'Si eliges quincenal, el monto se convertirá a equivalente mensual.',
        decimoLegend: '¿Desea incluir el cálculo del décimo tercer mes?',
        labelDecimoNo: 'No',
        labelDecimoSi: 'Sí',
        decimoHint: 'El décimo tercer mes corresponde a una prestación laboral pagada en tres partidas durante el año. No asumimos que trabajaste todo el período: indica el salario acumulado del período correspondiente.',
        salarioAcumuladoLabel: 'Salario acumulado del período (B/.)',
        acumuladoPlaceholder: 'Ej: 6000.00',
        acumuladoHint: 'Suma de salarios brutos recibidos en el período del décimo (aprox. 4 meses).',
        otrosDescuentosLabel: 'Otros descuentos voluntarios (B/.)',
        otrosPlaceholder: 'Ej: 50.00 (opcional)',
        otrosHint: 'Opcional. Préstamos, seguros privados u otros descuentos mensuales.',
        btnCalcularText: 'Calcular mi salario',
        btnClearText: 'Limpiar',

        // Validation errors
        errValido: 'Ingresa un salario válido.',
        errMayorCero: 'El salario debe ser mayor que cero.',
        errLimite: (max) => `El valor supera el límite permitido (B/. ${max}).`,
        errOtrosNegativo: 'Los descuentos voluntarios no pueden ser negativos.',
        errOtrosAlto: 'El descuento voluntario es demasiado alto.',
        errAcumuladoReq: 'Indica el salario acumulado del período para estimar el décimo.',
        errAcumuladoMayorCero: 'El salario acumulado debe ser mayor que cero.',
        errAcumuladoAlto: 'El acumulado ingresado es demasiado alto.',

        // Results
        resultsTitle: 'Resultados',
        resultsSubtitle: 'Estimación referencial con base en las deducciones obligatorias principales.',
        netLabel: 'Tu salario neto estimado',
        netNote: 'Monto aproximado que podrías recibir al mes',
        conversionNote: (ingresado, mensual) => `Salario quincenal ingresado: ${ingresado} → equivalente mensual: ${mensual}.`,

        // Breakdown list
        lblResultBruto: 'Salario bruto',
        lblResultCSS: 'Seguro Social',
        lblResultSE: 'Seguro Educativo',
        lblResultISR: 'Impuesto Sobre la Renta',
        lblResultOtros: 'Otros descuentos',
        lblResultNeto: 'Salario neto',

        // Summary stats
        lblTotalDeducciones: 'Total de deducciones',
        lblPorcentajeDeducciones: 'Porcentaje de tu salario que se descuenta',

        // Salary Bar
        salaryBarTitle: 'Distribución visual del salario',
        lgNetoText: 'Neto',
        lgCSSText: 'CSS',
        lgSEText: 'Seguro Educativo',
        lgISRText: 'ISR',
        lgOtrosText: 'Otros',
        titleNetoBar: 'Salario neto',
        titleCSSBar: 'CSS',
        titleSEBar: 'Seguro Educativo',
        titleISRBar: 'ISR',
        titleOtrosBar: 'Otros',

        // ISR Explain
        isrTitle: 'Cómo se estimó el ISR',
        isrDesc: 'Se proyecta el ingreso anual y se aplica la tarifa progresiva; luego se divide entre 12 para obtener la retención mensual estimada.',
        lblIsrIngresoAnual: 'Ingreso anual estimado:',
        lblIsrAnual: 'ISR anual estimado:',
        lblIsrMensual: 'ISR mensual estimado:',

        // 13th month results
        decimoResultsTitle: 'Estimación del décimo tercer mes',
        decimoResultsHint: 'El décimo tercer mes corresponde a una prestación laboral pagada en tres partidas durante el año. Estimación: salario acumulado ÷ 12, menos CSS (9.75%) y Seguro Educativo (1.25%).',
        lblDecimoBruto: 'Décimo bruto estimado',
        lblDecimoCSS: 'CSS sobre el décimo',
        lblDecimoSE: 'Seguro Educativo sobre el décimo',
        lblDecimoDeducciones: 'Deducciones aplicables',
        lblDecimoNeto: 'Décimo neto estimado',

        // Disclaimer
        disclaimerText: 'Esta calculadora ofrece una <strong>estimación referencial</strong>. El cálculo real puede depender de tu situación fiscal, deducciones permitidas, tipo de contrato y la normativa vigente en Panamá.',

        // Tips Section
        tipsTitle: '¿Sabías que?',
        tipsIntro: 'Pequeños consejos para usar mejor tu salario neto.',
        tip1: 'Tu salario bruto no es necesariamente el dinero que recibirás en tu cuenta.',
        tip2: 'Las deducciones reducen tu ingreso disponible.',
        tip3: 'Conocer tu salario neto te ayuda a crear un presupuesto realista.',
        tip4: 'Antes de planificar tus gastos mensuales, utiliza tu salario neto como referencia.',
        finxMessage: 'FINX te ayuda a entender mejor cómo se distribuye tu dinero para que puedas tomar decisiones financieras más informadas.'
    },
    en: {
        // Sidebar & Navbar
        management: 'Management',
        lessons: 'Lessons',
        achievements: 'Achievements',
        goals: 'Goals',
        calculator: 'Salary Calculator',
        help: 'Help',
        assistant: 'Assistant',
        user: 'User',
        level: 'Level 2',
        profile: 'My Profile',
        settings: 'Settings',
        privacy: 'Privacy',
        logout: 'Logout',
        langToggleTitle: 'Translate page',
        themeToggleTitle: 'Change theme',

        // Header Hero
        badgeFinxText: 'FINX Tool',
        heroTitle: 'Net Salary Calculator',
        heroLead: 'Calculate how much you will actually receive after taxes and deductions in Panama.',

        // Form
        formTitle: 'Your salary details',
        formSubtitle: 'Fill out the form to get an estimate of your net monthly salary.',
        salarioLabelMensual: 'Monthly gross salary (B/.)',
        salarioLabelQuincenal: 'Biweekly gross salary (B/.)',
        salarioPlaceholder: 'e.g.: 1500.00',
        salarioHintMensual: 'Enter your gross salary before deductions.',
        salarioHintQuincenal: 'Enter what you earn every two weeks. It will be converted to monthly equivalent (× 2) for calculations.',
        frecuenciaLabel: 'Payment frequency',
        optMensual: 'Monthly',
        optQuincenal: 'Biweekly',
        frecuenciaHint: 'If you choose biweekly, the amount will be converted to monthly equivalent.',
        decimoLegend: 'Would you like to include the 13th month calculation?',
        labelDecimoNo: 'No',
        labelDecimoSi: 'Yes',
        decimoHint: 'The 13th month bonus corresponds to a labor benefit paid in three installments during the year. We do not assume you worked the full period: enter the accumulated salary for the period.',
        salarioAcumuladoLabel: 'Accumulated salary for the period (B/.)',
        acumuladoPlaceholder: 'e.g.: 6000.00',
        acumuladoHint: 'Sum of gross salaries received during the 13th month period (approx. 4 months).',
        otrosDescuentosLabel: 'Other voluntary deductions (B/.)',
        otrosPlaceholder: 'e.g.: 50.00 (optional)',
        otrosHint: 'Optional. Loans, private insurance, or other monthly deductions.',
        btnCalcularText: 'Calculate my salary',
        btnClearText: 'Clear',

        // Validation errors
        errValido: 'Please enter a valid salary.',
        errMayorCero: 'Salary must be greater than zero.',
        errLimite: (max) => `Value exceeds allowed limit (B/. ${max}).`,
        errOtrosNegativo: 'Voluntary deductions cannot be negative.',
        errOtrosAlto: 'Voluntary deduction is too high.',
        errAcumuladoReq: 'Enter the accumulated salary for the period to estimate the 13th month.',
        errAcumuladoMayorCero: 'Accumulated salary must be greater than zero.',
        errAcumuladoAlto: 'Entered accumulated salary is too high.',

        // Results
        resultsTitle: 'Results',
        resultsSubtitle: 'Referential estimate based on main mandatory deductions.',
        netLabel: 'Your estimated net salary',
        netNote: 'Approximate amount you could receive per month',
        conversionNote: (ingresado, mensual) => `Biweekly salary entered: ${ingresado} → monthly equivalent: ${mensual}.`,

        // Breakdown list
        lblResultBruto: 'Gross salary',
        lblResultCSS: 'Social Security',
        lblResultSE: 'Educational Insurance',
        lblResultISR: 'Income Tax',
        lblResultOtros: 'Other deductions',
        lblResultNeto: 'Net salary',

        // Summary stats
        lblTotalDeducciones: 'Total deductions',
        lblPorcentajeDeducciones: 'Percentage of salary deducted',

        // Salary Bar
        salaryBarTitle: 'Visual salary distribution',
        lgNetoText: 'Net',
        lgCSSText: 'CSS',
        lgSEText: 'Educational Insurance',
        lgISRText: 'ISR',
        lgOtrosText: 'Others',
        titleNetoBar: 'Net salary',
        titleCSSBar: 'CSS',
        titleSEBar: 'Educational Insurance',
        titleISRBar: 'ISR',
        titleOtrosBar: 'Others',

        // ISR Explain
        isrTitle: 'How ISR was estimated',
        isrDesc: 'Annual income is projected and progressive tax rates are applied; it is then divided by 12 to get estimated monthly withholding.',
        lblIsrIngresoAnual: 'Estimated annual income:',
        lblIsrAnual: 'Estimated annual ISR:',
        lblIsrMensual: 'Estimated monthly ISR:',

        // 13th month results
        decimoResultsTitle: '13th Month Bonus Estimate',
        decimoResultsHint: 'The 13th month bonus corresponds to a labor benefit paid in three installments during the year. Estimate: accumulated salary ÷ 12, minus CSS (9.75%) and Educational Insurance (1.25%).',
        lblDecimoBruto: 'Estimated 13th month gross',
        lblDecimoCSS: 'CSS on 13th month',
        lblDecimoSE: 'Educational Insurance on 13th month',
        lblDecimoDeducciones: 'Applicable deductions',
        lblDecimoNeto: 'Estimated 13th month net',

        // Disclaimer
        disclaimerText: 'This calculator offers a <strong>referential estimate</strong>. The actual calculation may depend on your tax situation, allowed deductions, contract type, and current regulations in Panama.',

        // Tips Section
        tipsTitle: 'Did you know?',
        tipsIntro: 'Short tips to make better use of your net salary.',
        tip1: 'Your gross salary is not necessarily the money you will receive in your account.',
        tip2: 'Deductions reduce your disposable income.',
        tip3: 'Knowing your net salary helps you create a realistic budget.',
        tip4: 'Before planning your monthly expenses, use your net salary as a reference.',
        finxMessage: 'FINX helps you better understand how your money is distributed so you can make more informed financial decisions.'
    }
};

let lastCalculationData = null;

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('salaryForm');
    const btnClear = document.getElementById('btnClear');
    const frecuencia = document.getElementById('frecuencia');
    const incluirDecimoSi = document.getElementById('incluirDecimoSi');
    const incluirDecimoNo = document.getElementById('incluirDecimoNo');

    if (!form) return;

    frecuencia.addEventListener('change', actualizarEtiquetaSalario);
    incluirDecimoSi.addEventListener('change', toggleDecimoOptions);
    incluirDecimoNo.addEventListener('change', toggleDecimoOptions);
    form.addEventListener('submit', onSubmit);
    btnClear.addEventListener('click', limpiarFormulario);

    const initialLang = localStorage.getItem('finx_lang') || 'es';
    setLanguage(initialLang);
});

/* =========================
   FUNCIONES DE CÁLCULO
   ========================= */

function obtenerSalarioMensual(monto, frecuencia) {
    const valor = Number(monto);
    if (frecuencia === 'quincenal') {
        return valor * 2;
    }
    return valor;
}

function calcularCSS(salarioBrutoMensual) {
    return salarioBrutoMensual * TASA_CSS;
}

function calcularSeguroEducativo(salarioBrutoMensual) {
    return salarioBrutoMensual * TASA_SEGURO_EDUCATIVO;
}

function calcularISR(salarioBrutoMensual) {
    const ingresoAnual = salarioBrutoMensual * MESES_ANIO;
    let isrAnual = 0;

    if (ingresoAnual <= LIMITE_ISR_EXENTO) {
        isrAnual = 0;
    } else if (ingresoAnual <= LIMITE_ISR_15) {
        isrAnual = (ingresoAnual - LIMITE_ISR_EXENTO) * TASA_ISR_15;
    } else {
        isrAnual = ISR_FIJO_TRAMO_15 + (ingresoAnual - LIMITE_ISR_15) * TASA_ISR_25;
    }

    return {
        ingresoAnual,
        isrAnual,
        isrMensual: isrAnual / MESES_ANIO
    };
}

function calcularSalarioNeto(salarioBruto, css, seguroEducativo, isrMensual, otrosDescuentos) {
    return salarioBruto - css - seguroEducativo - isrMensual - otrosDescuentos;
}

function calcularDecimo(salarioAcumuladoPeriodo) {
    const decimoBruto = salarioAcumuladoPeriodo / MESES_ANIO;
    const cssDecimo = calcularCSS(decimoBruto);
    const seDecimo = calcularSeguroEducativo(decimoBruto);
    const totalDeducciones = cssDecimo + seDecimo;
    const decimoNeto = decimoBruto - totalDeducciones;

    return {
        decimoBruto,
        cssDecimo,
        seDecimo,
        totalDeducciones,
        decimoNeto
    };
}

/* =========================
   UI / VALIDACIÓN / TRADUCCIÓN
   ========================= */

function getLang() {
    return localStorage.getItem('finx_lang') || 'es';
}

function setLanguage(lang) {
    localStorage.setItem('finx_lang', lang);
    const t = translations[lang] || translations.es;

    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    const setHTML = (id, html) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
    };

    // Sidebar Nav
    const items = document.querySelectorAll('.sidebar-nav li span');
    if (items.length >= 7) {
        items[0].textContent = t.management;
        items[1].textContent = t.lessons;
        items[2].textContent = t.achievements;
        items[3].textContent = t.goals;
        items[4].textContent = t.calculator;
        items[5].textContent = t.help;
        items[6].textContent = t.assistant;
    }
    document.querySelectorAll('.user-name, .dropdown-user-name').forEach((el) => {
        el.textContent = t.user;
    });
    document.querySelectorAll('.user-level, .dropdown-user-level').forEach((el) => {
        el.textContent = t.level;
    });
    const dropdownSpans = document.querySelectorAll('.dropdown-item span');
    if (dropdownSpans.length >= 4) {
        dropdownSpans[0].textContent = t.profile;
        dropdownSpans[1].textContent = t.settings;
        dropdownSpans[2].textContent = t.privacy;
        dropdownSpans[3].textContent = t.logout;
    }

    // Buttons title / Tooltips
    const langToggle = document.getElementById('langToggle');
    if (langToggle) langToggle.title = t.langToggleTitle;

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) themeToggle.title = t.themeToggleTitle;

    // Hero
    setText('badgeFinxText', t.badgeFinxText);
    setText('heroTitle', t.heroTitle);
    setText('heroLead', t.heroLead);

    // Form
    setText('formTitle', t.formTitle);
    setText('formSubtitle', t.formSubtitle);
    setText('frecuenciaLabel', t.frecuenciaLabel);
    setText('optMensual', t.optMensual);
    setText('optQuincenal', t.optQuincenal);
    setText('frecuenciaHint', t.frecuenciaHint);

    const inputSalario = document.getElementById('salarioBruto');
    if (inputSalario) inputSalario.placeholder = t.salarioPlaceholder;

    const inputAcumulado = document.getElementById('salarioAcumulado');
    if (inputAcumulado) inputAcumulado.placeholder = t.acumuladoPlaceholder;

    const inputOtros = document.getElementById('otrosDescuentos');
    if (inputOtros) inputOtros.placeholder = t.otrosPlaceholder;

    setText('decimoLegend', t.decimoLegend);

    const labelDecimoNo = document.getElementById('labelDecimoNo');
    if (labelDecimoNo) {
        const span = labelDecimoNo.querySelector('span');
        if (span) span.textContent = t.labelDecimoNo;
    }
    const labelDecimoSi = document.getElementById('labelDecimoSi');
    if (labelDecimoSi) {
        const span = labelDecimoSi.querySelector('span');
        if (span) span.textContent = t.labelDecimoSi;
    }

    setText('decimoHint', t.decimoHint);
    setText('salarioAcumuladoLabel', t.salarioAcumuladoLabel);
    setText('acumuladoHint', t.acumuladoHint);
    setText('otrosDescuentosLabel', t.otrosDescuentosLabel);
    setText('otrosHint', t.otrosHint);
    setText('btnCalcularText', t.btnCalcularText);
    setText('btnClearText', t.btnClearText);

    // Results
    setText('resultsTitle', t.resultsTitle);
    setText('resultsSubtitle', t.resultsSubtitle);
    setText('netLabel', t.netLabel);
    setText('netNote', t.netNote);

    setText('lblResultBruto', t.lblResultBruto);
    setText('lblResultCSS', t.lblResultCSS);
    setText('lblResultSE', t.lblResultSE);
    setText('lblResultISR', t.lblResultISR);
    setText('lblResultOtros', t.lblResultOtros);
    setText('lblResultNeto', t.lblResultNeto);

    setText('lblTotalDeducciones', t.lblTotalDeducciones);
    setText('lblPorcentajeDeducciones', t.lblPorcentajeDeducciones);

    setText('salaryBarTitle', t.salaryBarTitle);
    setText('lgNetoText', t.lgNetoText);
    setText('lgCSSText', t.lgCSSText);
    setText('lgSEText', t.lgSEText);
    setText('lgISRText', t.lgISRText);
    setText('lgOtrosText', t.lgOtrosText);

    const barNeto = document.getElementById('barNeto');
    if (barNeto) barNeto.title = t.titleNetoBar;
    const barCSS = document.getElementById('barCSS');
    if (barCSS) barCSS.title = t.titleCSSBar;
    const barSE = document.getElementById('barSE');
    if (barSE) barSE.title = t.titleSEBar;
    const barISR = document.getElementById('barISR');
    if (barISR) barISR.title = t.titleISRBar;
    const barOtros = document.getElementById('barOtros');
    if (barOtros) barOtros.title = t.titleOtrosBar;

    setText('isrTitle', t.isrTitle);
    setText('isrDesc', t.isrDesc);
    setText('lblIsrIngresoAnual', t.lblIsrIngresoAnual);
    setText('lblIsrAnual', t.lblIsrAnual);
    setText('lblIsrMensual', t.lblIsrMensual);

    setText('decimoResultsTitle', t.decimoResultsTitle);
    setText('decimoResultsHint', t.decimoResultsHint);
    setText('lblDecimoBruto', t.lblDecimoBruto);
    setText('lblDecimoCSS', t.lblDecimoCSS);
    setText('lblDecimoSE', t.lblDecimoSE);
    setText('lblDecimoDeducciones', t.lblDecimoDeducciones);
    setText('lblDecimoNeto', t.lblDecimoNeto);

    setHTML('disclaimerText', t.disclaimerText);

    // Tips
    setText('tipsTitle', t.tipsTitle);
    setText('tipsIntro', t.tipsIntro);
    setText('tip1', t.tip1);
    setText('tip2', t.tip2);
    setText('tip3', t.tip3);
    setText('tip4', t.tip4);
    setText('finxMessage', t.finxMessage);

    // Dynamic salary label & hints based on frequency
    actualizarEtiquetaSalario();

    // Re-render conversion note if calculations are active
    if (lastCalculationData) {
        if (lastCalculationData.frecuencia === 'quincenal') {
            const noteEl = document.getElementById('conversionNote');
            if (noteEl) {
                noteEl.textContent = t.conversionNote(
                    formatMoney(lastCalculationData.salarioIngresado),
                    formatMoney(lastCalculationData.salarioMensual)
                );
            }
        }
    }
}
window.setLanguage = setLanguage;

function actualizarEtiquetaSalario() {
    const frecuenciaEl = document.getElementById('frecuencia');
    if (!frecuenciaEl) return;
    const frecuencia = frecuenciaEl.value;
    const label = document.getElementById('salarioLabel');
    const hint = document.getElementById('salarioHint');
    const lang = getLang();
    const t = translations[lang] || translations.es;

    if (frecuencia === 'quincenal') {
        if (label) label.textContent = t.salarioLabelQuincenal;
        if (hint) hint.textContent = t.salarioHintQuincenal;
    } else {
        if (label) label.textContent = t.salarioLabelMensual;
        if (hint) hint.textContent = t.salarioHintMensual;
    }
}

function toggleDecimoOptions() {
    const incluirEl = document.getElementById('incluirDecimoSi');
    if (!incluirEl) return;
    const incluir = incluirEl.checked;
    const panel = document.getElementById('decimoOptions');
    if (panel) {
        panel.hidden = !incluir;
        panel.setAttribute('aria-hidden', incluir ? 'false' : 'true');
    }
}

function limpiarErrores() {
    document.querySelectorAll('.field-error').forEach((el) => {
        el.textContent = '';
    });
    document.querySelectorAll('.is-invalid').forEach((el) => {
        el.classList.remove('is-invalid');
    });
}

function mostrarError(inputId, mensaje) {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(`error-${inputId}`);
    if (input) input.classList.add('is-invalid');
    if (errorEl) errorEl.textContent = mensaje;
}

function validarFormulario() {
    limpiarErrores();
    let valido = true;
    const lang = getLang();
    const t = translations[lang] || translations.es;

    const salarioInput = document.getElementById('salarioBruto');
    const salarioRaw = salarioInput.value.trim();
    const salario = Number(salarioRaw);
    const otrosRaw = document.getElementById('otrosDescuentos').value.trim();
    const otros = otrosRaw === '' ? 0 : Number(otrosRaw);

    if (salarioRaw === '' || Number.isNaN(salario)) {
        mostrarError('salarioBruto', t.errValido);
        valido = false;
    } else if (salario <= 0) {
        mostrarError('salarioBruto', t.errMayorCero);
        valido = false;
    } else if (salario > SALARIO_MAXIMO) {
        mostrarError('salarioBruto', t.errLimite(SALARIO_MAXIMO.toLocaleString(lang === 'en' ? 'en-US' : 'es-PA')));
        valido = false;
    }

    if (otrosRaw !== '') {
        if (Number.isNaN(otros) || otros < 0) {
            mostrarError('otrosDescuentos', t.errOtrosNegativo);
            valido = false;
        } else if (otros > SALARIO_MAXIMO) {
            mostrarError('otrosDescuentos', t.errOtrosAlto);
            valido = false;
        }
    }

    if (document.getElementById('incluirDecimoSi').checked) {
        const acumuladoRaw = document.getElementById('salarioAcumulado').value.trim();
        const acumulado = Number(acumuladoRaw);
        if (acumuladoRaw === '' || Number.isNaN(acumulado)) {
            mostrarError('salarioAcumulado', t.errAcumuladoReq);
            valido = false;
        } else if (acumulado <= 0) {
            mostrarError('salarioAcumulado', t.errAcumuladoMayorCero);
            valido = false;
        } else if (acumulado > SALARIO_MAXIMO * MESES_ANIO) {
            mostrarError('salarioAcumulado', t.errAcumuladoAlto);
            valido = false;
        }
    }

    return valido;
}

function onSubmit(event) {
    event.preventDefault();
    if (!validarFormulario()) {
        const firstInvalid = document.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
    }

    const frecuencia = document.getElementById('frecuencia').value;
    const salarioIngresado = Number(document.getElementById('salarioBruto').value);
    const otrosDescuentos = document.getElementById('otrosDescuentos').value.trim() === ''
        ? 0
        : Number(document.getElementById('otrosDescuentos').value);
    const salarioMensual = obtenerSalarioMensual(salarioIngresado, frecuencia);

    const css = calcularCSS(salarioMensual);
    const seguroEducativo = calcularSeguroEducativo(salarioMensual);
    const isr = calcularISR(salarioMensual);
    const salarioNeto = calcularSalarioNeto(
        salarioMensual,
        css,
        seguroEducativo,
        isr.isrMensual,
        otrosDescuentos
    );

    const totalDeducciones = css + seguroEducativo + isr.isrMensual + otrosDescuentos;
    const porcentajeDeducciones = salarioMensual > 0
        ? (totalDeducciones / salarioMensual) * 100
        : 0;

    let decimo = null;
    if (document.getElementById('incluirDecimoSi').checked) {
        const acumulado = Number(document.getElementById('salarioAcumulado').value);
        decimo = calcularDecimo(acumulado);
    }

    lastCalculationData = {
        salarioIngresado,
        frecuencia,
        salarioMensual,
        css,
        seguroEducativo,
        isr,
        otrosDescuentos,
        salarioNeto,
        totalDeducciones,
        porcentajeDeducciones,
        decimo
    };

    mostrarResultados(lastCalculationData);
}

function limpiarFormulario() {
    const form = document.getElementById('salaryForm');
    form.reset();
    limpiarErrores();
    lastCalculationData = null;
    actualizarEtiquetaSalario();
    toggleDecimoOptions();

    const layout = document.querySelector('.salary-layout');
    if (layout) layout.classList.remove('has-results');

    const results = document.getElementById('resultsSection');
    results.hidden = true;
    results.classList.remove('is-visible');
    document.getElementById('decimoResults').hidden = true;

    document.getElementById('salarioBruto').focus();
}

/* =========================
   RENDER DE RESULTADOS
   ========================= */

function formatMoney(valor) {
    const num = Number(valor);
    const lang = getLang();
    const formatted = num.toLocaleString(lang === 'en' ? 'en-US' : 'es-PA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return `B/. ${formatted}`;
}

function formatPercent(valor) {
    const lang = getLang();
    return `${Number(valor).toLocaleString(lang === 'en' ? 'en-US' : 'es-PA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}%`;
}

function mostrarResultados(data) {
    const layout = document.querySelector('.salary-layout');
    if (layout) layout.classList.add('has-results');

    const results = document.getElementById('resultsSection');
    results.hidden = false;
    const lang = getLang();
    const t = translations[lang] || translations.es;

    // Forzar reflow para animación
    void results.offsetWidth;
    results.classList.add('is-visible');

    document.getElementById('netSalaryValue').textContent = formatMoney(data.salarioNeto);
    document.getElementById('resultBruto').textContent = formatMoney(data.salarioMensual);
    document.getElementById('resultCSS').textContent = `− ${formatMoney(data.css)}`;
    document.getElementById('resultSE').textContent = `− ${formatMoney(data.seguroEducativo)}`;
    document.getElementById('resultISR').textContent = `− ${formatMoney(data.isr.isrMensual)}`;
    document.getElementById('resultOtros').textContent = `− ${formatMoney(data.otrosDescuentos)}`;
    document.getElementById('resultNeto').textContent = formatMoney(data.salarioNeto);
    document.getElementById('totalDeducciones').textContent = formatMoney(data.totalDeducciones);
    document.getElementById('porcentajeDeducciones').textContent = formatPercent(data.porcentajeDeducciones);

    // Detalle ISR
    document.getElementById('isrIngresoAnual').textContent = formatMoney(data.isr.ingresoAnual);
    document.getElementById('isrAnual').textContent = formatMoney(data.isr.isrAnual);
    document.getElementById('isrMensualDetalle').textContent = formatMoney(data.isr.isrMensual);

    if (data.frecuencia === 'quincenal') {
        const noteEl = document.getElementById('conversionNote');
        noteEl.hidden = false;
        noteEl.textContent = t.conversionNote(
            formatMoney(data.salarioIngresado),
            formatMoney(data.salarioMensual)
        );
    } else {
        document.getElementById('conversionNote').hidden = true;
    }

    actualizarBarra(data);
    actualizarDecimoUI(data.decimo);

    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function actualizarBarra(data) {
    const total = data.salarioMensual;
    const segments = [
        { id: 'barNeto', value: Math.max(data.salarioNeto, 0) },
        { id: 'barCSS', value: data.css },
        { id: 'barSE', value: data.seguroEducativo },
        { id: 'barISR', value: data.isr.isrMensual },
        { id: 'barOtros', value: data.otrosDescuentos }
    ];

    segments.forEach(({ id, value }) => {
        const el = document.getElementById(id);
        if (!el) return;
        const pct = total > 0 ? (value / total) * 100 : 0;
        el.style.width = `${Math.max(pct, 0)}%`;
        el.setAttribute('aria-valuenow', pct.toFixed(2));
    });
}

function actualizarDecimoUI(decimo) {
    const section = document.getElementById('decimoResults');
    if (!decimo) {
        section.hidden = true;
        return;
    }

    section.hidden = false;
    document.getElementById('decimoBruto').textContent = formatMoney(decimo.decimoBruto);
    document.getElementById('decimoCSS').textContent = `− ${formatMoney(decimo.cssDecimo)}`;
    document.getElementById('decimoSE').textContent = `− ${formatMoney(decimo.seDecimo)}`;
    document.getElementById('decimoDeducciones').textContent = formatMoney(decimo.totalDeducciones);
    document.getElementById('decimoNeto').textContent = formatMoney(decimo.decimoNeto);
}
