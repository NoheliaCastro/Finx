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

/**
 * NOTA SOBRE ISR:
 * Se aplica la estructura progresiva 0% / 15% / 25% indicada en la especificación FINX.
 * El sitio de referencia también muestra una tabla con un tramo del 30% sobre B/. 100,000.
 * Esa diferencia no se aplica aquí de forma silenciosa: si la normativa oficial cambia,
 * actualiza estas constantes. Esta herramienta es una estimación educativa.
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('salaryForm');
    const btnClear = document.getElementById('btnClear');
    const frecuencia = document.getElementById('frecuencia');
    const incluirDecimoSi = document.getElementById('incluirDecimoSi');
    const incluirDecimoNo = document.getElementById('incluirDecimoNo');
    const decimoOptions = document.getElementById('decimoOptions');
    const salarioLabel = document.getElementById('salarioLabel');

    if (!form) return;

    frecuencia.addEventListener('change', actualizarEtiquetaSalario);
    incluirDecimoSi.addEventListener('change', toggleDecimoOptions);
    incluirDecimoNo.addEventListener('change', toggleDecimoOptions);
    form.addEventListener('submit', onSubmit);
    btnClear.addEventListener('click', limpiarFormulario);

    actualizarEtiquetaSalario();
    toggleDecimoOptions();
});

/* =========================
   FUNCIONES DE CÁLCULO
   ========================= */

/**
 * Convierte el salario ingresado a equivalente mensual.
 * Quincenal → se multiplica × 2.
 */
function obtenerSalarioMensual(monto, frecuencia) {
    const valor = Number(monto);
    if (frecuencia === 'quincenal') {
        return valor * 2;
    }
    return valor;
}

/** Seguro Social (CSS): 9.75% del salario bruto mensual */
function calcularCSS(salarioBrutoMensual) {
    return salarioBrutoMensual * TASA_CSS;
}

/** Seguro Educativo: 1.25% del salario bruto mensual */
function calcularSeguroEducativo(salarioBrutoMensual) {
    return salarioBrutoMensual * TASA_SEGURO_EDUCATIVO;
}

/**
 * ISR anual estimado con estructura progresiva, luego se divide entre 12.
 * - Hasta 11,000: 0%
 * - De 11,000.01 a 50,000: 15% sobre el excedente de 11,000
 * - Más de 50,000: 5,850 + 25% sobre el excedente de 50,000
 */
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

/**
 * Salario neto = bruto − CSS − Seguro Educativo − ISR mensual − otros descuentos
 */
function calcularSalarioNeto(salarioBruto, css, seguroEducativo, isrMensual, otrosDescuentos) {
    return salarioBruto - css - seguroEducativo - isrMensual - otrosDescuentos;
}

/**
 * Décimo tercer mes estimado.
 * Bruto = salario acumulado del período / 12.
 * Deducciones típicas sobre el décimo: CSS + Seguro Educativo (no se asume ISR).
 */
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
   UI / VALIDACIÓN
   ========================= */

function actualizarEtiquetaSalario() {
    const frecuencia = document.getElementById('frecuencia').value;
    const label = document.getElementById('salarioLabel');
    const hint = document.getElementById('salarioHint');

    if (frecuencia === 'quincenal') {
        label.textContent = 'Salario bruto quincenal (B/.)';
        hint.textContent = 'Ingresa lo que ganas cada quincena. Se convertirá a equivalente mensual (× 2) para los cálculos.';
    } else {
        label.textContent = 'Salario bruto mensual (B/.)';
        hint.textContent = 'Ingresa tu salario bruto antes de deducciones.';
    }
}

function toggleDecimoOptions() {
    const incluir = document.getElementById('incluirDecimoSi').checked;
    const panel = document.getElementById('decimoOptions');
    panel.hidden = !incluir;
    panel.setAttribute('aria-hidden', incluir ? 'false' : 'true');
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

    const salarioInput = document.getElementById('salarioBruto');
    const salarioRaw = salarioInput.value.trim();
    const salario = Number(salarioRaw);
    const otrosRaw = document.getElementById('otrosDescuentos').value.trim();
    const otros = otrosRaw === '' ? 0 : Number(otrosRaw);

    if (salarioRaw === '' || Number.isNaN(salario)) {
        mostrarError('salarioBruto', 'Ingresa un salario válido.');
        valido = false;
    } else if (salario <= 0) {
        mostrarError('salarioBruto', 'El salario debe ser mayor que cero.');
        valido = false;
    } else if (salario > SALARIO_MAXIMO) {
        mostrarError('salarioBruto', `El valor supera el límite permitido (B/. ${SALARIO_MAXIMO.toLocaleString('es-PA')}).`);
        valido = false;
    }

    if (otrosRaw !== '') {
        if (Number.isNaN(otros) || otros < 0) {
            mostrarError('otrosDescuentos', 'Los descuentos voluntarios no pueden ser negativos.');
            valido = false;
        } else if (otros > SALARIO_MAXIMO) {
            mostrarError('otrosDescuentos', 'El descuento voluntario es demasiado alto.');
            valido = false;
        }
    }

    if (document.getElementById('incluirDecimoSi').checked) {
        const acumuladoRaw = document.getElementById('salarioAcumulado').value.trim();
        const acumulado = Number(acumuladoRaw);
        if (acumuladoRaw === '' || Number.isNaN(acumulado)) {
            mostrarError('salarioAcumulado', 'Indica el salario acumulado del período para estimar el décimo.');
            valido = false;
        } else if (acumulado <= 0) {
            mostrarError('salarioAcumulado', 'El salario acumulado debe ser mayor que cero.');
            valido = false;
        } else if (acumulado > SALARIO_MAXIMO * MESES_ANIO) {
            mostrarError('salarioAcumulado', 'El acumulado ingresado es demasiado alto.');
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

    mostrarResultados({
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
    });
}

function limpiarFormulario() {
    const form = document.getElementById('salaryForm');
    form.reset();
    limpiarErrores();
    actualizarEtiquetaSalario();
    toggleDecimoOptions();

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
    const formatted = num.toLocaleString('es-PA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return `B/. ${formatted}`;
}

function formatPercent(valor) {
    return `${Number(valor).toLocaleString('es-PA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}%`;
}

function mostrarResultados(data) {
    const results = document.getElementById('resultsSection');
    results.hidden = false;

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
        document.getElementById('conversionNote').hidden = false;
        document.getElementById('conversionNote').textContent =
            `Salario quincenal ingresado: ${formatMoney(data.salarioIngresado)} → equivalente mensual: ${formatMoney(data.salarioMensual)}.`;
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
        const pct = total > 0 ? (value / total) * 100 : 0;
        el.style.width = `${Math.max(pct, 0)}%`;
        el.setAttribute('aria-valuenow', pct.toFixed(2));
        el.title = `${pct.toFixed(2)}%`;
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
