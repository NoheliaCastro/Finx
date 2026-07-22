/**
 * Finx Financial AI Engine
 * Motor de Inteligencia Financiera Contextual para Finx
 */

class FinxDataConnector {
    /**
     * Obtiene los movimientos registrados (ingresos y gastos)
     */
    static getMovements() {
        let movements = JSON.parse(localStorage.getItem('finx_movements') || '[]');
        
        // Si no existen movimientos, inicializamos con un conjunto de datos realista de demostración
        if (!movements || movements.length === 0) {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            
            movements = [
                { date: `${year}-${month}-02`, type: 'income', amount: 1800, category: 'Salario', description: 'Nómina quincenal' },
                { date: `${year}-${month}-05`, type: 'expense', amount: 450, category: 'Vivienda', description: 'Renta / Alquiler' },
                { date: `${year}-${month}-08`, type: 'expense', amount: 180, category: 'Comida', description: 'Supermercado semanal' },
                { date: `${year}-${month}-10`, type: 'expense', amount: 65, category: 'Servicios', description: 'Internet y Teléfono' },
                { date: `${year}-${month}-12`, type: 'expense', amount: 120, category: 'Comida', description: 'Restaurante con amigos' },
                { date: `${year}-${month}-15`, type: 'income', amount: 1800, category: 'Salario', description: 'Segunda quincena' },
                { date: `${year}-${month}-16`, type: 'expense', amount: 95, category: 'Entretenimiento', description: 'Suscripciones y Cine' },
                { date: `${year}-${month}-18`, type: 'expense', amount: 45, category: 'Transporte', description: 'Gasolina / Transporte' },
                { date: `${year}-${month}-20`, type: 'expense', amount: 210, category: 'Comida', description: 'Supermercado mensual' },
                { date: `${year}-${month}-21`, type: 'expense', amount: 75, category: 'Salud', description: 'Farmacia' }
            ];
            localStorage.setItem('finx_movements', JSON.stringify(movements));
        }
        return movements;
    }

    /**
     * Obtiene las metas de ahorro del usuario
     */
    static getGoals() {
        let goals = JSON.parse(localStorage.getItem('finx_goals') || '[]');
        if (!goals || goals.length === 0) {
            goals = [
                { id: 1, title: 'Fondo de Emergencia', target: 2000, current: 1350, category: 'Ahorro', deadline: '2026-12-31', icon: 'bi-shield-check' },
                { id: 2, title: 'Viaje de Vacaciones', target: 800, current: 420, category: 'Viajes', deadline: '2026-11-15', icon: 'bi-airplane' },
                { id: 3, title: 'Laptop Nueva', target: 1200, current: 300, category: 'Tecnología', deadline: '2027-03-30', icon: 'bi-laptop' }
            ];
            localStorage.setItem('finx_goals', JSON.stringify(goals));
        }
        return goals;
    }

    /**
     * Obtiene el perfil de usuario
     */
    static getUserProfile() {
        const savedProfile = JSON.parse(localStorage.getItem('finx_user_profile') || '{}');
        return {
            name: savedProfile.name || 'Usuario Finx',
            level: savedProfile.level || 'Nivel 2 - Planificador',
            monthlySalary: savedProfile.monthlySalary || 3600,
            currency: savedProfile.currency || '$'
        };
    }

    /**
     * Calcula métricas agregadas del mes actual
     */
    static getMonthlyMetrics() {
        const movements = this.getMovements();
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        let totalIncome = 0;
        let totalExpenses = 0;
        const expensesByCategory = {};
        let highestExpense = { amount: 0, category: '', description: '', date: '' };
        const recentMovements = [];

        movements.forEach(mov => {
            const movDate = new Date(mov.date);
            const isCurrentMonth = movDate.getFullYear() === currentYear && movDate.getMonth() === currentMonth;

            if (mov.type === 'income') {
                if (isCurrentMonth) totalIncome += Number(mov.amount);
            } else if (mov.type === 'expense') {
                if (isCurrentMonth) {
                    const amt = Number(mov.amount);
                    totalExpenses += amt;

                    expensesByCategory[mov.category] = (expensesByCategory[mov.category] || 0) + amt;

                    if (amt > highestExpense.amount) {
                        highestExpense = {
                            amount: amt,
                            category: mov.category,
                            description: mov.description || mov.category,
                            date: mov.date
                        };
                    }
                }
            }

            recentMovements.push(mov);
        });

        // Ordenar movimientos por fecha descendente
        recentMovements.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Encontrar categoría con mayor gasto
        let topCategory = { name: 'Ninguna', amount: 0, percentage: 0 };
        for (const [cat, amt] of Object.entries(expensesByCategory)) {
            if (amt > topCategory.amount) {
                topCategory.name = cat;
                topCategory.amount = amt;
            }
        }
        if (totalExpenses > 0 && topCategory.amount > 0) {
            topCategory.percentage = Math.round((topCategory.amount / totalExpenses) * 100);
        }

        const netBalance = totalIncome - totalExpenses;
        const goals = this.getGoals();
        const totalTargetSavings = goals.reduce((acc, g) => acc + Number(g.target), 0);
        const totalCurrentSavings = goals.reduce((acc, g) => acc + Number(g.current), 0);
        const savingsProgressPct = totalTargetSavings > 0 ? Math.round((totalCurrentSavings / totalTargetSavings) * 100) : 0;

        return {
            totalIncome,
            totalExpenses,
            netBalance,
            expensesByCategory,
            highestExpense,
            topCategory,
            recentMovements: recentMovements.slice(0, 5),
            goals,
            totalTargetSavings,
            totalCurrentSavings,
            savingsProgressPct
        };
    }
}

class AIApiBridge {
    /**
     * Estructura extensible para llamadas a modelos reales como OpenAI, Gemini o Claude API.
     */
    static async callExternalAI(prompt, systemContext, apiKey = null) {
        // En un entorno de producción, aquí se realizaría la llamada a la API externa de LLM
        return null;
    }
}

class FinancialAIEngine {
    constructor() {
        this.conversationHistory = [];
        this.lastTopicContext = null; // Mantiene el contexto conversacional
    }

    /**
     * Formatea montos en moneda local
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    }

    /**
     * Procesa la entrada del usuario y responde dinámicamente
     */
    async processUserQuery(rawInput, lang = 'es') {
        const input = rawInput.trim();
        const normalizedInput = input.toLowerCase();

        // Registrar mensaje en historial conversacional
        this.conversationHistory.push({ role: 'user', content: input });

        // 1. Verificar si la pregunta cae fuera del ámbito financiero
        if (this.isOffTopic(normalizedInput)) {
            const offTopicResp = lang === 'en'
                ? "I am Finx's personal financial assistant. 💡 I can help you analyze your expenses, income, savings goals, budgeting, investments, and money management. How can I assist with your finances today?"
                : "Soy el asistente financiero inteligente de **Finx**. 💡 Estoy especializado en ayudarte con tus finanzas personales: análisis de gastos, ingresos, metas de ahorro, presupuestos, créditos y educación financiera.\n\n¿En qué puedo ayudarte hoy sobre tu dinero?";
            
            this.conversationHistory.push({ role: 'assistant', content: offTopicResp });
            return { text: offTopicResp, type: 'off_topic' };
        }

        // Obtener datos frescos del sistema Finx
        const metrics = FinxDataConnector.getMonthlyMetrics();
        const profile = FinxDataConnector.getUserProfile();

        // 2. Evaluar continuidad de contexto conversacional (Multi-turn conversation)
        const isFollowUpCategoryQuery = (
            (normalizedInput.includes('comida') || normalizedInput.includes('vivienda') || normalizedInput.includes('transporte') || normalizedInput.includes('entretenimiento') || normalizedInput.includes('servicios') || normalizedInput.includes('salud') || normalizedInput.includes('compras')) &&
            (normalizedInput.includes('cuánto') || normalizedInput.includes('cuanto') || normalizedInput.includes('fue en') || normalizedInput.includes('gasté en') || normalizedInput.includes('gaste en') || this.lastTopicContext === 'monthly_expenses')
        );

        if (isFollowUpCategoryQuery) {
            let matchedCat = null;
            const categories = ['Comida', 'Vivienda', 'Transporte', 'Entretenimiento', 'Servicios', 'Salud', 'Compras'];
            for (const cat of categories) {
                if (normalizedInput.includes(cat.toLowerCase())) {
                    matchedCat = cat;
                    break;
                }
            }

            if (matchedCat) {
                const amountSpent = metrics.expensesByCategory[matchedCat] || 0;
                const percentage = metrics.totalExpenses > 0 ? Math.round((amountSpent / metrics.totalExpenses) * 100) : 0;
                
                let resp = `En la categoría de **${matchedCat}** llevas gastados **${this.formatCurrency(amountSpent)}** este mes.`;
                if (percentage > 0) {
                    resp += ` Esto representa el **${percentage}%** de tus gastos totales del mes.`;
                }

                if (percentage >= 30) {
                    resp += `\n\n💡 *Tip Finx:* Esta categoría absorbe una parte considerable de tu presupuesto. Considera revisar tus consumos recurrentes en ${matchedCat} para optimizar tu capacidad de ahorro.`;
                }

                this.lastTopicContext = 'category_detail';
                this.conversationHistory.push({ role: 'assistant', content: resp });
                return { text: resp, type: 'data_insight' };
            }
        }

        // 3. Consultas sobre datos del usuario (System Data Queries)

        // A. ¿Cuánto gasté este mes?
        if (this.matchesAny(normalizedInput, ['cuanto gaste', 'cuánto gasté', 'cuanto he gastado', 'mis gastos este mes', 'mis gastos del mes', 'gastos mensuales'])) {
            this.lastTopicContext = 'monthly_expenses';
            const { totalExpenses, totalIncome, topCategory } = metrics;
            
            let resp = `Este mes llevas un total de **${this.formatCurrency(totalExpenses)}** en gastos registrados.\n\n`;
            if (topCategory.amount > 0) {
                resp += `📊 Tu categoría de mayor consumo es **${topCategory.name}** con **${this.formatCurrency(topCategory.amount)}** (${topCategory.percentage}% del gasto total).\n\n`;
            }
            if (totalIncome > 0) {
                const spentPct = Math.round((totalExpenses / totalIncome) * 100);
                resp += `Has ejecutado el **${spentPct}%** de tus ingresos mensuales (${this.formatCurrency(totalIncome)}).`;
            }

            this.conversationHistory.push({ role: 'assistant', content: resp });
            return { text: resp, type: 'data_insight' };
        }

        // B. ¿Cuál fue mi gasto más grande?
        if (this.matchesAny(normalizedInput, ['gasto mas grande', 'gasto más grande', 'mayor gasto', 'gasto mas alto', 'gasto más alto', 'gasto fuerte'])) {
            this.lastTopicContext = 'highest_expense';
            const { highestExpense } = metrics;

            if (highestExpense.amount > 0) {
                const resp = `Tu gasto más grande registrado este mes fue de **${this.formatCurrency(highestExpense.amount)}** en la categoría **${highestExpense.category}** (${highestExpense.description}) el día ${highestExpense.date}.\n\n💡 *Recomendación Finx:* Revisa si este gasto es recurrente o puntual para planificarlo mejor en tu próximo presupuesto.`;
                this.conversationHistory.push({ role: 'assistant', content: resp });
                return { text: resp, type: 'data_insight' };
            } else {
                const resp = `Aún no tienes gastos registrados para este mes. ¡Buen momento para mantener tus finanzas al día!`;
                this.conversationHistory.push({ role: 'assistant', content: resp });
                return { text: resp, type: 'data_insight' };
            }
        }

        // C. ¿Cuánto dinero me queda este mes? / Balance
        if (this.matchesAny(normalizedInput, ['cuanto me queda', 'cuánto me queda', 'dinero me queda', 'balance actual', 'mi balance', 'saldo disponible', 'cuanto dinero me queda'])) {
            this.lastTopicContext = 'net_balance';
            const { totalIncome, totalExpenses, netBalance } = metrics;

            let statusEmoji = netBalance >= 0 ? '🟢' : '🔴';
            let statusText = netBalance >= 0 ? 'Saludable' : 'Alerta de sobregiro';

            let resp = `Actualmente tu balance neto disponible es de **${this.formatCurrency(netBalance)}** ${statusEmoji} (${statusText}).\n\n`;
            resp += `• **Ingresos Totales:** ${this.formatCurrency(totalIncome)}\n`;
            resp += `• **Gastos Totales:** ${this.formatCurrency(totalExpenses)}\n\n`;

            if (netBalance > 0) {
                const suggestedSavings = Math.round(netBalance * 0.4);
                resp += `✨ *Sugerencia inteligente:* Te quedan ${this.formatCurrency(netBalance)}. Podrías destinar **${this.formatCurrency(suggestedSavings)}** (40% de lo restante) directamente a tus metas de ahorro.`;
            } else {
                resp += `⚠️ *Atención:* Tus gastos han superado tus ingresos en este periodo. Te sugiero recortar gastos no esenciales como entretenimiento o compras.`;
            }

            this.conversationHistory.push({ role: 'assistant', content: resp });
            return { text: resp, type: 'data_insight' };
        }

        // D. ¿En qué categoría gasto más?
        if (this.matchesAny(normalizedInput, ['en que categoria gasto mas', 'en qué categoría gasto más', 'categoria mas alta', 'donde gasto mas', 'dónde gasto más'])) {
            this.lastTopicContext = 'top_category';
            const { topCategory, totalExpenses, expensesByCategory } = metrics;

            if (topCategory.amount > 0) {
                let resp = `La categoría donde más dinero gastas es **${topCategory.name}**, acumulando **${this.formatCurrency(topCategory.amount)}** (${topCategory.percentage}% del total de tus gastos).\n\n`;
                resp += `📌 **Desglose de gastos por categoría:**\n`;
                for (const [cat, amt] of Object.entries(expensesByCategory)) {
                    const pct = Math.round((amt / totalExpenses) * 100);
                    resp += `• **${cat}:** ${this.formatCurrency(amt)} (${pct}%)\n`;
                }

                this.conversationHistory.push({ role: 'assistant', content: resp });
                return { text: resp, type: 'data_insight' };
            } else {
                const resp = `Aún no hay suficientes categorías de gastos registradas este mes.`;
                this.conversationHistory.push({ role: 'assistant', content: resp });
                return { text: resp, type: 'data_insight' };
            }
        }

        // E. Metas de Ahorro
        if (this.matchesAny(normalizedInput, ['meta de ahorro', 'mis metas', 'como van mis metas', 'cómo van mis metas', 'voy bien con mi meta', 'avance de ahorro'])) {
            this.lastTopicContext = 'goals';
            const { goals, totalCurrentSavings, totalTargetSavings, savingsProgressPct } = metrics;

            let resp = `🎯 **Progreso General de Metas:** Llevas ahorrado **${this.formatCurrency(totalCurrentSavings)}** de **${this.formatCurrency(totalTargetSavings)}** (**${savingsProgressPct}%** alcanzado).\n\n`;
            resp += `📋 **Tus metas activas:**\n`;

            goals.forEach(goal => {
                const pct = Math.round((goal.current / goal.target) * 100);
                const remaining = goal.target - goal.current;
                resp += `• **${goal.title}:** ${this.formatCurrency(goal.current)} / ${this.formatCurrency(goal.target)} (${pct}%) — *Faltan ${this.formatCurrency(remaining)}*\n`;
            });

            if (savingsProgressPct >= 50) {
                resp += `\n🚀 ¡Excelente disciplina! Vas en camino seguro hacia tus metas.`;
            } else {
                resp += `\n💡 *Tip de aceleración:* Si aumentas tu ahorro mensual un 10%, alcanzarás tu meta de **${goals[0]?.title || 'Ahorro'}** mucho antes.`;
            }

            this.conversationHistory.push({ role: 'assistant', content: resp });
            return { text: resp, type: 'data_insight' };
        }

        // F. Resumen Financiero Completo
        if (this.matchesAny(normalizedInput, ['resumen financiero', 'muestra un resumen', 'muestrame un resumen', 'mi resumen', 'analisis financiero', 'estado financiero'])) {
            this.lastTopicContext = 'full_summary';
            const { totalIncome, totalExpenses, netBalance, topCategory, goals, savingsProgressPct } = metrics;

            let resp = `📊 **RESUMEN FINANCIERO PERSONAL DE FINX**\n\n`;
            resp += `💰 **Ingresos del Mes:** ${this.formatCurrency(totalIncome)}\n`;
            resp += `💸 **Gastos del Mes:** ${this.formatCurrency(totalExpenses)}\n`;
            resp += `⚖️ **Balance Disponible:** ${this.formatCurrency(netBalance)}\n`;
            resp += `🎯 **Progreso de Ahorro:** ${savingsProgressPct}% acumulado en metas\n`;
            resp += `🏷️ **Categoría Principal de Gasto:** ${topCategory.name} (${this.formatCurrency(topCategory.amount)})\n\n`;

            resp += `💡 **Recomendaciones Inteligentes:**\n`;
            if (topCategory.percentage > 35) {
                resp += `1. Tu gasto en **${topCategory.name}** es muy elevado (${topCategory.percentage}%). Intenta reducirlo un 10% para liberar ${this.formatCurrency(topCategory.amount * 0.1)} para ahorro.\n`;
            } else {
                resp += `1. Mantienes un control equilibrado entre tus categorías de gasto.\n`;
            }
            if (netBalance > 0) {
                resp += `2. Tienes un balance positivo de ${this.formatCurrency(netBalance)}. Asigna este excedente inmediatamente a tu meta de *${goals[0]?.title || 'Emergencia'}*.\n`;
            } else {
                resp += `2. Ajusta tus gastos no esenciales para mantener un margen de seguridad antes de fin de mes.\n`;
            }
            resp += `3. Mantén tus registros al día en el Dashboard para afinar la precisión de tus métricas.`;

            this.conversationHistory.push({ role: 'assistant', content: resp });
            return { text: resp, type: 'data_insight' };
        }

        // 4. Consultas de Educación Financiera General

        // Presupuesto
        if (this.matchesAny(normalizedInput, ['como hago un presupuesto', 'como hacer presupuesto', 'que es un presupuesto', 'crear presupuesto', 'regla 50/30/20', 'presupuesto'])) {
            const resp = `Un **presupuesto** es tu mapa de navegación financiera. Te sugiero aplicar la **Regla 50/30/20**:\n\n` +
                `1. **50% Necesidades Bajas (Esenciales):** Renta, comida, servicios y transporte.\n` +
                `2. **30% Deseos y Estilo de Vida:** Salidas, pasatiempos, entretenimiento y compras.\n` +
                `3. **20% Ahorro e Inversión:** Fondo de emergencia, pago de deudas y metas a futuro.\n\n` +
                `💡 En Finx puedes registrar tus ingresos y gastos diarios en el **Dashboard** para ver automáticamente cómo te distribuyes respecto a esta regla.`;
            
            this.conversationHistory.push({ role: 'assistant', content: resp });
            return { text: resp, type: 'financial_education' };
        }

        // Interés Compuesto
        if (this.matchesAny(normalizedInput, ['interes compuesto', 'interés compuesto', 'como funciona el interes compuesto'])) {
            const resp = `El **Interés Compuesto** es cuando los intereses que ganas generan a su vez más intereses con el tiempo ("dinero produciendo dinero").\n\n` +
                `📈 **Fórmula visual:**\n` +
                `• Año 1: Inviertes $1,000 al 10% ➔ Tienes $1,100\n` +
                `• Año 2: Ganas el 10% sobre $1,100 ➔ Tienes $1,210\n` +
                `• Año 10: ¡Tus $1,000 se habrán transformado en **$2,593** sin añadir más capital!\n\n` +
                `🔑 **Clave para jóvenes:** Empezar temprano es la mayor ventaja financiera que existe.`;

            this.conversationHistory.push({ role: 'assistant', content: resp });
            return { text: resp, type: 'financial_education' };
        }

        // Tarjetas de Crédito
        if (this.matchesAny(normalizedInput, ['tarjeta de credito', 'tarjetas de crédito', 'usar tarjeta de credito', 'bueno usar tarjeta'])) {
            const resp = `La **tarjeta de crédito** es una herramienta excelente si sigues 3 reglas de oro:\n\n` +
                `1. **Trátala como tarjeta de débito:** No gastes dinero que no tienes en tu cuenta bancaria.\n` +
                `2. **Sé Totalero:** Paga siempre el "pago para no generar intereses" antes de la fecha límite.\n` +
                `3. **No uses más del 30% de tu límite:** Esto mantiene tu puntaje e historial crediticio impecable.\n\n` +
                `⚠️ *Evita pagar solo el pago mínimo*, ya que los intereses harán que la deuda crezca exponencialmente.`;

            this.conversationHistory.push({ role: 'assistant', content: resp });
            return { text: resp, type: 'financial_education' };
        }

        // Salir de deudas
        if (this.matchesAny(normalizedInput, ['salir de deudas', 'como pagar deudas', 'pagar deudas', 'deuda'])) {
            const resp = `Para salir de deudas eficientemente existen dos métodos comprobados:\n\n` +
                `🧊 **1. Método Bola de Nieve (Motivación rápida):**\n` +
                `Ordena tus deudas de la más pequeña a la más grande. Paga el mínimo en todas y enfoca todo tu dinero extra en liquidar la más pequeña primero.\n\n` +
                `🔥 **2. Método Avalancha (Ahorro en intereses):**\n` +
                `Ordena tus deudas por la tasa de interés de mayor a menor. Liquida primero la que cobre más intereses.\n\n` +
                `💡 *Primer paso:* Congela nuevas deudas y destina un porcentaje fijo de tus ingresos para liquidarlas.`;

            this.conversationHistory.push({ role: 'assistant', content: resp });
            return { text: resp, type: 'financial_education' };
        }

        // Inversiones
        if (this.matchesAny(normalizedInput, ['invertir', 'inversiones', 'donde invertir', 'como empiezo a invertir', 'inversion'])) {
            const resp = `Antes de empezar a invertir, asegúrate de tener listo tu **Fondo de Emergencia** (de 3 a 6 meses de gastos).\n\n` +
                `Pasos básicos para principiantes:\n` +
                `1. **Cuentas de Alto Rendimiento / CETES / Renta Fija:** Ideales para bajo riesgo y dinero a corto plazo.\n` +
                `2. **Fondos Indexados (ETF como S&P 500):** Para construir patrimonio a largo plazo diversificando en cientos de empresas.\n` +
                `3. **Diversificación:** Nunca pongas todos tus huevos en la misma canasta.\n\n` +
                `¿Te gustaría saber sobre alguna opción de inversión en particular?`;

            this.conversationHistory.push({ role: 'assistant', content: resp });
            return { text: resp, type: 'financial_education' };
        }

        // Ahorrar más
        if (this.matchesAny(normalizedInput, ['como ahorro mas', 'cómo ahorro más', 'consejos para ahorrar', 'tips de ahorro', 'trucos para ahorrar'])) {
            const resp = `💡 **5 Hábitos probados para aumentar tu ahorro rápidamente:**\n\n` +
                `1. **Págate a ti mismo primero:** Tan pronto como recibas tus ingresos, traslada el 10%-20% a tu cuenta de ahorro antes de gastar.\n` +
                `2. **Revisa suscripciones ocultas:** Cancela servicios de streaming o apps que no uses.\n` +
                `3. **Aplica la regla de las 48 horas:** Para compras impulsivas, espera 2 días. Muchas veces se pasa el impulso.\n` +
                `4. **Cocina más en casa:** La categoría de Comida fuera suele representar entre el 25% y 40% del gasto juvenil.\n` +
                `5. **Revisa tus metas en Finx:** Mantener la visión clara de tu meta aumenta en un 80% tu disciplina.`;

            this.conversationHistory.push({ role: 'assistant', content: resp });
            return { text: resp, type: 'financial_education' };
        }

        // 5. Respuesta inteligente por defecto (Personal Finance & Assistant Guidance)
        const defaultResp = lang === 'en'
            ? `I can analyze your Finx account data or answer any financial questions. You can ask me:\n\n` +
              `• *How much did I spend this month?*\n` +
              `• *What was my highest expense?*\n` +
              `• *Show me a financial summary*\n` +
              `• *How are my savings goals doing?*\n` +
              `• *How do I create a budget?*`
            : `Estoy analizando tu consulta. Como tu asistente financiero de **Finx**, puedo guiarte con los datos reales de tu cuenta o educación financiera.\n\n` +
              `Puedes preguntarme cosas como:\n` +
              `💰 *¿Cuánto gasté este mes?*\n` +
              `📊 *Muéstrame un resumen financiero*\n` +
              `📉 *¿En qué categoría gasto más?*\n` +
              `🎯 *¿Cómo van mis metas de ahorro?*\n` +
              `💡 *¿Cómo hago un presupuesto eficientemente?*`;

        this.conversationHistory.push({ role: 'assistant', content: defaultResp });
        return { text: defaultResp, type: 'general' };
    }

    /**
     * Verifica si una consulta es ajena a finanzas
     */
    isOffTopic(input) {
        const nonFinancialKeywords = [
            'receta de cocina', 'clima', 'fútbol', 'futbol', 'película', 'pelicula',
            'videojuego', 'horóscopo', 'horoscopo', 'chiste', 'canción', 'cancion',
            'política', 'politica', 'programar en python', 'código java', 'capital de francia'
        ];
        return nonFinancialKeywords.some(keyword => input.includes(keyword));
    }

    /**
     * Verifica coincidencias en lista de frases
     */
    matchesAny(input, phrases) {
        return phrases.some(p => input.includes(p));
    }
}

// Exponer la instancia globalmente
window.FinxDataConnector = FinxDataConnector;
window.FinancialAIEngine = FinancialAIEngine;
window.financialAIEngineInstance = new FinancialAIEngine();
