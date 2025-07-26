// dashboard-chart.js
// Renderiza una gráfica de líneas con los movimientos de ingresos y gastos

let movementsChartInstance = null;
let chartUpdateInterval = null;

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

    // Obtener la semana actual (7 días desde el lunes)
    const now = new Date();
    const currentDay = now.getDay(); // 0 = domingo, 1 = lunes, etc.
    
    // Calcular el lunes de la semana actual
    const monday = new Date(now);
    const daysToMonday = currentDay === 0 ? 6 : currentDay - 1; // Si es domingo, retroceder 6 días
    monday.setDate(now.getDate() - daysToMonday);
    
    // Generar los 7 días de la semana actual
    const weekDays = [];
    const dayLabels = [];
    
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(monday);
        currentDate.setDate(monday.getDate() + i);
        
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        
        weekDays.push(`${year}-${month}-${day}`);
        dayLabels.push(currentDate.getDate().toString()); // Solo el número del día
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

    // Preparar los datos para los días de la semana
    const labels = weekDays;
    const incomeData = labels.map(date => (dataByDate[date] ? dataByDate[date].income : 0));
    const expenseData = labels.map(date => (dataByDate[date] ? dataByDate[date].expense : 0));

    // Calcular el máximo valor para ajustar el eje Y dinámicamente
    const maxIncome = Math.max(...incomeData);
    const maxExpense = Math.max(...expenseData);
    let yMax = 500;
    if (maxIncome > 500 || maxExpense > 500) {
        yMax = Math.ceil(Math.max(maxIncome, maxExpense) / 100) * 100;
    }

    // Si no hay movimientos en toda la semana, mostrar mensaje
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
                    borderWidth: window.innerWidth <= 768 ? 2 : 3,
                    fill: false,
                    pointBackgroundColor: '#00ba63',
                    pointBorderColor: '#fff',
                    pointRadius: window.innerWidth <= 576 ? 4 : window.innerWidth <= 768 ? 5 : 6,
                    pointHoverRadius: window.innerWidth <= 576 ? 6 : window.innerWidth <= 768 ? 7 : 9,
                    pointStyle: 'circle',
                    pointBorderWidth: window.innerWidth <= 576 ? 1 : 2,
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
                    borderWidth: window.innerWidth <= 768 ? 2 : 3,
                    fill: false,
                    pointBackgroundColor: '#ef4444',
                    pointBorderColor: '#fff',
                    pointRadius: window.innerWidth <= 576 ? 4 : window.innerWidth <= 768 ? 5 : 6,
                    pointHoverRadius: window.innerWidth <= 576 ? 6 : window.innerWidth <= 768 ? 7 : 9,
                    pointStyle: 'circle',
                    pointBorderWidth: window.innerWidth <= 576 ? 1 : 2,
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
            maintainAspectRatio: false,
            animation: {
                duration: window.innerWidth <= 768 ? 800 : 1200,
                easing: 'easeOutQuart'
            },
            plugins: {
                legend: {
                    display: true,
                    position: window.innerWidth <= 576 ? 'bottom' : 'top',
                    labels: {
                        color: fontColor,
                        font: { 
                            weight: 'bold', 
                            size: window.innerWidth <= 576 ? 12 : window.innerWidth <= 768 ? 13 : 15 
                        },
                        padding: window.innerWidth <= 576 ? 10 : 20,
                        usePointStyle: window.innerWidth <= 576 ? true : false,
                        pointStyle: 'circle'
                    }
                },
                title: {
                    display: true,
                    text: `${ctxContainer.dataset.chartTitle || 'This Week'}`,
                    font: { 
                        size: window.innerWidth <= 576 ? 16 : window.innerWidth <= 768 ? 18 : 22, 
                        weight: 'bold', 
                        family: 'Montserrat, Rubik, sans-serif' 
                    },
                    color: isDark ? '#EEE95B' : '#004AAD',
                    padding: { 
                        top: window.innerWidth <= 576 ? 10 : 18, 
                        bottom: window.innerWidth <= 576 ? 5 : 10 
                    }
                },
                tooltip: {
                    backgroundColor: isDark ? '#232A36' : '#fff',
                    titleColor: isDark ? '#EEE95B' : '#004AAD',
                    bodyColor: fontColor,
                    borderColor: isDark ? '#EEE95B' : '#004AAD',
                    borderWidth: 1.5,
                    padding: window.innerWidth <= 576 ? 8 : 12,
                    caretSize: window.innerWidth <= 576 ? 6 : 8,
                    cornerRadius: 8,
                    titleFont: { 
                        weight: 'bold', 
                        size: window.innerWidth <= 576 ? 12 : 15 
                    },
                    bodyFont: { 
                        size: window.innerWidth <= 576 ? 12 : 14 
                    },
                    displayColors: false
                },
                background: {
                    color: chartBgColor
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'transparent',
                        borderColor: borderColor,
                        display: false
                    },
                    ticks: {
                        color: fontColor,
                        font: { 
                            size: window.innerWidth <= 576 ? 10 : window.innerWidth <= 768 ? 11 : 13, 
                            weight: 'bold' 
                        },
                        maxRotation: window.innerWidth <= 576 ? 0 : 0,
                        minRotation: window.innerWidth <= 576 ? 0 : 0
                    }
                },
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: yMax,
                    ticks: {
                        stepSize: window.innerWidth <= 576 ? 200 : 100,
                        callback: function(value) {
                            return '$' + value;
                        },
                        color: fontColor,
                        font: { 
                            size: window.innerWidth <= 576 ? 10 : window.innerWidth <= 768 ? 11 : 13, 
                            weight: 'bold' 
                        }
                    },
                    grid: {
                        color: gridColor,
                        borderColor: borderColor,
                        display: true
                    }
                }
            },
            layout: {
                padding: {
                    top: window.innerWidth <= 576 ? 10 : 20,
                    right: window.innerWidth <= 576 ? 10 : 20,
                    bottom: window.innerWidth <= 576 ? 10 : 20,
                    left: window.innerWidth <= 576 ? 10 : 20
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

// Función para verificar si ha cambiado la semana y actualizar la gráfica
function checkWeekChange() {
    const now = new Date();
    const currentDay = now.getDay();
    const monday = new Date(now);
    const daysToMonday = currentDay === 0 ? 6 : currentDay - 1;
    monday.setDate(now.getDate() - daysToMonday);
    
    // Obtener la semana actual como string para comparar
    const currentWeekStart = monday.toISOString().split('T')[0];
    
    // Si no tenemos la semana guardada o ha cambiado, actualizar la gráfica
    if (!window.lastWeekStart || window.lastWeekStart !== currentWeekStart) {
        window.lastWeekStart = currentWeekStart;
        if (window.renderMovementsChart) {
            window.renderMovementsChart();
        }
    }
}

// Función para iniciar la actualización automática
function startAutoUpdate() {
    // Limpiar intervalo anterior si existe
    if (chartUpdateInterval) {
        clearInterval(chartUpdateInterval);
    }
    
    // Verificar cambios cada minuto
    chartUpdateInterval = setInterval(checkWeekChange, 60000); // 60000ms = 1 minuto
    
    // También verificar cuando la página se vuelve visible
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            checkWeekChange();
        }
    });
}

// Función para detener la actualización automática
function stopAutoUpdate() {
    if (chartUpdateInterval) {
        clearInterval(chartUpdateInterval);
        chartUpdateInterval = null;
    }
}

// Función para manejar el redimensionamiento de la ventana
function handleResize() {
    // Debounce para evitar demasiadas actualizaciones
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        if (window.renderMovementsChart) {
            window.renderMovementsChart();
        }
    }, 250); // Esperar 250ms después del último resize
}

document.addEventListener('DOMContentLoaded', function() {
    renderMovementsChart();
    startAutoUpdate();
    
    // Agregar listener para redimensionamiento
    window.addEventListener('resize', handleResize);
    
    // Agregar listener para cambio de orientación en móviles
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            if (window.renderMovementsChart) {
                window.renderMovementsChart();
            }
        }, 500);
    });
});

// Exponer las funciones para que otros scripts puedan llamarlas
window.renderMovementsChart = renderMovementsChart;
window.startAutoUpdate = startAutoUpdate;
window.stopAutoUpdate = stopAutoUpdate;

// Escuchar cambios de tema y actualizar la gráfica
if (window.matchMedia('(prefers-color-scheme: dark)').addEventListener) {
    const observer = new MutationObserver(() => {
        if (window.renderMovementsChart) window.renderMovementsChart();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-bs-theme'] });
}

// Limpiar el intervalo cuando se cierre la página
window.addEventListener('beforeunload', function() {
    stopAutoUpdate();
}); 