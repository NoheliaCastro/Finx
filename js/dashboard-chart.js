// dashboard-chart.js
// Renderiza una gráfica de líneas con los movimientos de ingresos y gastos

let movementsChartInstance = null;

function renderMovementsChart() {
    const ctxContainer = document.getElementById('movementsChartContainer');
    if (!ctxContainer) return;

    // Si ya existe un canvas, lo eliminamos para evitar superposición
    let oldCanvas = document.getElementById('movementsChart');
    if (oldCanvas) oldCanvas.remove();

    // Crear y agregar el canvas para Chart.js
    let canvas = document.createElement('canvas');
    canvas.id = 'movementsChart';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = ctxContainer.offsetWidth;
    canvas.height = ctxContainer.offsetHeight;
    ctxContainer.innerHTML = '';
    ctxContainer.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // Detectar el tema actual (claro u oscuro)
    const html = document.documentElement;
    const isDark = html.getAttribute('data-bs-theme') === 'dark';
    const chartBgColor = isDark ? '#181C24' : '#f8f9fa';
    const chartAreaBgColor = isDark ? '#11254b' : '#fff';
    const gridColor = isDark ? '#fff' : '#e0e0e0';
    const borderColor = isDark ? '#11254b' : '#fff';
    const fontColor = isDark ? '#fff' : '#222';

    // Obtener movimientos de localStorage
    const movements = JSON.parse(localStorage.getItem('finx_movements') || '[]');

    // Obtener el mes y año actual
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed
    // Calcular el número de días del mes actual
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Generar todas las fechas del mes actual en formato YYYY-MM-DD y solo el día para labels
    const allDates = [];
    const dayLabels = [];
    for (let d = 1; d <= daysInMonth; d++) {
        const day = d.toString().padStart(2, '0');
        const monthStr = (month + 1).toString().padStart(2, '0');
        allDates.push(`${year}-${monthStr}-${day}`);
        dayLabels.push(d.toString());
    }

    // Agrupar por fecha y sumar ingresos/gastos
    const dataByDate = {};
    movements.forEach(mov => {
        if (!dataByDate[mov.date]) {
            dataByDate[mov.date] = { income: 0, expense: 0 };
        }
        if (mov.type === 'income') dataByDate[mov.date].income += Number(mov.amount);
        if (mov.type === 'expense') dataByDate[mov.date].expense += Number(mov.amount);
    });

    // Preparar los datos para todos los días del mes actual
    const labels = allDates;
    const incomeData = labels.map(date => (dataByDate[date] ? dataByDate[date].income : 0));
    // Los gastos también serán positivos para facilitar la comparación visual
    const expenseData = labels.map(date => (dataByDate[date] ? dataByDate[date].expense : 0));

    // Calcular el máximo valor para ajustar el eje Y dinámicamente
    const maxIncome = Math.max(...incomeData);
    const maxExpense = Math.max(...expenseData);
    let yMax = 500;
    if (maxIncome > 500 || maxExpense > 500) {
        yMax = Math.ceil(Math.max(maxIncome, maxExpense) / 100) * 100;
    }

    // Si no hay movimientos en todo el mes, mostrar mensaje
    if (incomeData.every(v => v === 0) && expenseData.every(v => v === 0)) {
        ctxContainer.innerHTML = '<span style="color:#888;">No data to display</span>';
        return;
    }

    // Destruir instancia previa si existe
    if (movementsChartInstance) {
        movementsChartInstance.destroy();
    }

    // Plugin para fondo completo del canvas
    const canvasBgColor = isDark ? '#11254b' : '#fff';
    const fullCanvasBgPlugin = {
        id: 'fullCanvasBgColor',
        beforeDraw: (chart) => {
            const ctx = chart.ctx;
            ctx.save();
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = canvasBgColor;
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        }
    };

    // Gradientes para las líneas
    const incomeGradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
    incomeGradient.addColorStop(0, '#00ba63');
    incomeGradient.addColorStop(1, '#4fd1c5');
    const expenseGradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
    expenseGradient.addColorStop(0, '#ef4444');
    expenseGradient.addColorStop(1, '#f59e42');

    // Crear la gráfica
    movementsChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dayLabels,
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    backgroundColor: incomeGradient,
                    borderColor: incomeGradient,
                    borderWidth: 3,
                    fill: false,
                    pointBackgroundColor: '#00ba63',
                    pointBorderColor: '#fff',
                    pointRadius: 6,
                    pointHoverRadius: 9,
                    pointStyle: 'circle',
                    pointBorderWidth: 2,
                    tension: 0.4,
                    pointShadowOffsetX: 0,
                    pointShadowOffsetY: 2,
                    pointShadowBlur: 6,
                    pointShadowColor: 'rgba(0,0,0,0.18)'
                },
                {
                    label: 'Expense',
                    data: expenseData,
                    backgroundColor: expenseGradient,
                    borderColor: expenseGradient,
                    borderWidth: 3,
                    fill: false,
                    pointBackgroundColor: '#ef4444',
                    pointBorderColor: '#fff',
                    pointRadius: 6,
                    pointHoverRadius: 9,
                    pointStyle: 'circle',
                    pointBorderWidth: 2,
                    tension: 0.4,
                    pointShadowOffsetX: 0,
                    pointShadowOffsetY: 2,
                    pointShadowBlur: 6,
                    pointShadowColor: 'rgba(0,0,0,0.18)'
                }
            ]
        },
        options: {
            responsive: true,
            animation: {
                duration: 1200,
                easing: 'easeOutQuart'
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: fontColor,
                        font: { weight: 'bold', size: 15 },
                        padding: 20
                    }
                },
                title: {
                    display: true,
                    text: `${ctxContainer.dataset.chartTitle || new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}`,
                    font: { size: 22, weight: 'bold', family: 'Montserrat, Rubik, sans-serif' },
                    color: isDark ? '#EEE95B' : '#004AAD',
                    padding: { top: 18, bottom: 10 }
                },
                tooltip: {
                    backgroundColor: isDark ? '#232A36' : '#fff',
                    titleColor: isDark ? '#EEE95B' : '#004AAD',
                    bodyColor: fontColor,
                    borderColor: isDark ? '#EEE95B' : '#004AAD',
                    borderWidth: 1.5,
                    padding: 12,
                    caretSize: 8,
                    cornerRadius: 8,
                    titleFont: { weight: 'bold', size: 15 },
                    bodyFont: { size: 14 },
                    displayColors: false
                },
                background: {
                    color: chartBgColor
                }
            },
            scales: {
                x: {
                    grid: {
                        color: gridColor,
                        borderColor: borderColor
                    },
                    ticks: {
                        color: fontColor,
                        font: { size: 13, weight: 'bold' }
                    }
                },
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: yMax,
                    ticks: {
                        stepSize: 100,
                        callback: function(value) {
                            return '$' + value;
                        },
                        color: fontColor,
                        font: { size: 13, weight: 'bold' }
                    },
                    grid: {
                        color: gridColor,
                        borderColor: borderColor
                    }
                }
            }
        },
        plugins: [fullCanvasBgPlugin, {
            id: 'customCanvasBackgroundColor',
            beforeDraw: (chart) => {
                const ctx = chart.ctx;
                const chartArea = chart.chartArea;
                ctx.save();
                ctx.fillStyle = chartAreaBgColor;
                ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
                ctx.restore();
            }
        }]
    });
}

document.addEventListener('DOMContentLoaded', function() {
    renderMovementsChart();
});

// Exponer la función para que otros scripts puedan llamarla
window.renderMovementsChart = renderMovementsChart;

// Escuchar cambios de tema y actualizar la gráfica
if (window.matchMedia('(prefers-color-scheme: dark)').addEventListener) {
    const observer = new MutationObserver(() => {
        if (window.renderMovementsChart) window.renderMovementsChart();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-bs-theme'] });
} 