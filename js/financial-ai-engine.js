/**
 * Finx Financial AI Engine v2.1
 * Motor de Inteligencia Financiera Especializado para Finx
 */

// ==========================================
// 1. CAPA DE ACCESO A DATOS (DATA CONNECTOR)
// ==========================================
class FinxDataConnector {
    static async getCurrentUser() {
        if (window.FinxAuth && typeof window.FinxAuth.getSession === 'function') {
            const session = await window.FinxAuth.getSession();
            if (session && session.user) {
                return session.user;
            }
        }
        // Fallback local
        const rawSession = localStorage.getItem('finx_session');
        if (rawSession) {
            try {
                const parsed = JSON.parse(rawSession);
                if (parsed.user) return parsed.user;
            } catch (e) {}
        }
        return {
            id: 'guest-user',
            email: 'guest@local',
            first_name: 'Guest',
            last_name: 'User',
            full_name: 'Guest User'
        };
    }

    static async getMovements() {
        const user = await this.getCurrentUser();
        const rawMovements = localStorage.getItem('finx_movements');

        // Si es la primera vez absoluta que se abre la app y no existe la clave 'finx_movements',
        // inicializamos la estructura en localStorage como lista vacía o demo si no ha sido inicializada
        if (rawMovements === null) {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const prevMonthNum = today.getMonth() === 0 ? 12 : today.getMonth();
            const prevYear = today.getMonth() === 0 ? year - 1 : year;
            const prevMonth = String(prevMonthNum).padStart(2, '0');

            const defaultDemo = [
                { id: crypto.randomUUID(), user_id: user.id, date: `${year}-${month}-01`, type: 'income', amount: 2400, category: 'Salario', description: 'Nómina principal' },
                { id: crypto.randomUUID(), user_id: user.id, date: `${year}-${month}-03`, type: 'expense', amount: 550, category: 'Vivienda', description: 'Renta del departamento' },
                { id: crypto.randomUUID(), user_id: user.id, date: `${year}-${month}-05`, type: 'expense', amount: 220, category: 'Comida', description: 'Supermercado quincenal' },
                { id: crypto.randomUUID(), user_id: user.id, date: `${year}-${month}-07`, type: 'expense', amount: 85, category: 'Servicios', description: 'Internet y luz' },
                { id: crypto.randomUUID(), user_id: user.id, date: `${year}-${month}-10`, type: 'expense', amount: 140, category: 'Comida', description: 'Cenas y restaurantes' },
                { id: crypto.randomUUID(), user_id: user.id, date: `${year}-${month}-12`, type: 'expense', amount: 95, category: 'Transporte', description: 'Gasolina y peaje' },
                { id: crypto.randomUUID(), user_id: user.id, date: `${year}-${month}-14`, type: 'income', amount: 350, category: 'Freelance', description: 'Proyecto de diseño' },
                { id: crypto.randomUUID(), user_id: user.id, date: `${year}-${month}-15`, type: 'expense', amount: 110, category: 'Entretenimiento', description: 'Suscripciones y juegos' },
                
                { id: crypto.randomUUID(), user_id: user.id, date: `${prevYear}-${prevMonth}-01`, type: 'income', amount: 2400, category: 'Salario', description: 'Nómina principal' },
                { id: crypto.randomUUID(), user_id: user.id, date: `${prevYear}-${prevMonth}-04`, type: 'expense', amount: 550, category: 'Vivienda', description: 'Renta del departamento' },
                { id: crypto.randomUUID(), user_id: user.id, date: `${prevYear}-${prevMonth}-08`, type: 'expense', amount: 310, category: 'Comida', description: 'Supermercado' }
            ];
            localStorage.setItem('finx_movements', JSON.stringify(defaultDemo));
            return defaultDemo.filter(m => m.user_id === user.id);
        }

        const allMovements = JSON.parse(rawMovements || '[]');
        return allMovements.filter(m => m.user_id === user.id);
    }

    static async saveMovements(userMovements) {
        const user = await this.getCurrentUser();
        let allMovements = JSON.parse(localStorage.getItem('finx_movements') || '[]');
        const otherMovements = allMovements.filter(m => m.user_id !== user.id);
        const updatedAll = [...otherMovements, ...userMovements];
        localStorage.setItem('finx_movements', JSON.stringify(updatedAll));
    }

    static async addMovement(movementData) {
        const user = await this.getCurrentUser();
        const newMovement = {
            id: crypto.randomUUID(),
            user_id: user.id,
            type: movementData.type || 'expense',
            amount: parseFloat(movementData.amount),
            category: movementData.category || 'Otros',
            date: movementData.date || new Date().toISOString().split('T')[0],
            description: movementData.description || movementData.category || 'Registro de Chatbot',
            created_at: new Date().toISOString()
        };

        let allMovements = JSON.parse(localStorage.getItem('finx_movements') || '[]');
        allMovements.push(newMovement);
        localStorage.setItem('finx_movements', JSON.stringify(allMovements));
        return newMovement;
    }

    static async getGoals() {
        let goals = JSON.parse(localStorage.getItem('finx_goals') || '[]');
        if (!goals || goals.length === 0) {
            goals = [
                { id: 1, title: 'Fondo de Emergencia', name: 'Fondo de Emergencia', target: 2000, current: 1350, saved: 1350, category: 'Ahorro', deadline: '2026-12-31', icon: 'bi-shield-check' },
                { id: 2, title: 'Viaje de Vacaciones', name: 'Viaje de Vacaciones', target: 800, current: 420, saved: 420, category: 'Viajes', deadline: '2026-11-15', icon: 'bi-airplane' }
            ];
            localStorage.setItem('finx_goals', JSON.stringify(goals));
        }
        return goals;
    }

    static async getBudgets() {
        let budgets = JSON.parse(localStorage.getItem('finx_budgets') || '[]');
        if (!budgets || budgets.length === 0) {
            budgets = [
                { category: 'Comida', limit: 600 },
                { category: 'Vivienda', limit: 600 },
                { category: 'Transporte', limit: 200 },
                { category: 'Entretenimiento', limit: 200 }
            ];
            localStorage.setItem('finx_budgets', JSON.stringify(budgets));
        }
        return budgets;
    }

    static async setBudget(category, limit) {
        let budgets = await this.getBudgets();
        const existingIdx = budgets.findIndex(b => b.category.toLowerCase() === category.toLowerCase());
        if (existingIdx >= 0) {
            budgets[existingIdx].limit = parseFloat(limit);
        } else {
            budgets.push({ category, limit: parseFloat(limit) });
        }
        localStorage.setItem('finx_budgets', JSON.stringify(budgets));
        return budgets;
    }

    static async getUserProfile() {
        const user = await this.getCurrentUser();
        const savedProfile = JSON.parse(localStorage.getItem('finx_user_profile') || '{}');
        return {
            name: user.full_name || user.first_name || savedProfile.name || 'Guest User',
            email: user.email || 'guest@local',
            level: savedProfile.level || 'Nivel 2',
            monthlySalary: savedProfile.monthlySalary || 2400,
            currency: savedProfile.currency || '$'
        };
    }
}

// ==========================================
// 2. ANALIZADOR DE FECHAS EN LENGUAJE NATURAL
// ==========================================
class DateParser {
    static parseNaturalDate(input) {
        const text = input.toLowerCase();
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        // 1. Hoy
        if (text.includes('hoy') || text.includes('today')) {
            const dateStr = now.toISOString().split('T')[0];
            return { startDate: dateStr, endDate: dateStr, label: 'hoy' };
        }

        // 2. Ayer
        if (text.includes('ayer') || text.includes('yesterday')) {
            const y = new Date(now);
            y.setDate(now.getDate() - 1);
            const dateStr = y.toISOString().split('T')[0];
            return { startDate: dateStr, endDate: dateStr, label: 'ayer' };
        }

        // 3. Esta semana
        if (text.includes('esta semana') || text.includes('this week')) {
            const monday = new Date(now);
            const day = now.getDay();
            const diff = now.getDate() - day + (day === 0 ? -6 : 1);
            monday.setDate(diff);
            const sunday = new Date(monday);
            sunday.setDate(monday.getDate() + 6);
            return {
                startDate: monday.toISOString().split('T')[0],
                endDate: sunday.toISOString().split('T')[0],
                label: 'esta semana'
            };
        }

        // 4. La semana pasada
        if (text.includes('semana pasada') || text.includes('last week')) {
            const prevMonday = new Date(now);
            const day = now.getDay();
            const diff = now.getDate() - day + (day === 0 ? -6 : 1) - 7;
            prevMonday.setDate(diff);
            const prevSunday = new Date(prevMonday);
            prevSunday.setDate(prevMonday.getDate() + 6);
            return {
                startDate: prevMonday.toISOString().split('T')[0],
                endDate: prevSunday.toISOString().split('T')[0],
                label: 'la semana pasada'
            };
        }

        // 5. El mes pasado
        if (text.includes('mes pasado') || text.includes('last month') || text.includes('mes anterior')) {
            const firstDay = new Date(currentYear, currentMonth - 1, 1);
            const lastDay = new Date(currentYear, currentMonth, 0);
            return {
                startDate: firstDay.toISOString().split('T')[0],
                endDate: lastDay.toISOString().split('T')[0],
                label: 'el mes pasado'
            };
        }

        // 6. Este mes
        if (text.includes('este mes') || text.includes('this month') || text.includes('mes actual') || text.includes('del mes')) {
            const firstDay = new Date(currentYear, currentMonth, 1);
            const lastDay = new Date(currentYear, currentMonth + 1, 0);
            return {
                startDate: firstDay.toISOString().split('T')[0],
                endDate: lastDay.toISOString().split('T')[0],
                label: 'este mes'
            };
        }

        // 7. Este año
        if (text.includes('este año') || text.includes('this year')) {
            return {
                startDate: `${currentYear}-01-01`,
                endDate: `${currentYear}-12-31`,
                label: 'este año'
            };
        }

        // 8. El año pasado
        if (text.includes('año pasado') || text.includes('last year')) {
            const prevYear = currentYear - 1;
            return {
                startDate: `${prevYear}-01-01`,
                endDate: `${prevYear}-12-31`,
                label: `el año ${prevYear}`
            };
        }

        // 9. ÚLtimos N días
        if (text.includes('últimos 7 días') || text.includes('last 7 days')) {
            const past = new Date(now);
            past.setDate(now.getDate() - 7);
            return {
                startDate: past.toISOString().split('T')[0],
                endDate: now.toISOString().split('T')[0],
                label: 'últimos 7 días'
            };
        }

        // Nombres de meses
        const monthNames = [
            { name: 'enero', monthIdx: 0 },
            { name: 'febrero', monthIdx: 1 },
            { name: 'marzo', monthIdx: 2 },
            { name: 'abril', monthIdx: 3 },
            { name: 'mayo', monthIdx: 4 },
            { name: 'junio', monthIdx: 5 },
            { name: 'julio', monthIdx: 6 },
            { name: 'agosto', monthIdx: 7 },
            { name: 'septiembre', monthIdx: 8 },
            { name: 'octubre', monthIdx: 9 },
            { name: 'noviembre', monthIdx: 10 },
            { name: 'diciembre', monthIdx: 11 }
        ];

        for (const m of monthNames) {
            if (text.includes(m.name)) {
                let targetYear = currentYear;
                if (m.monthIdx > currentMonth) {
                    targetYear = currentYear - 1;
                }
                const firstDay = new Date(targetYear, m.monthIdx, 1);
                const lastDay = new Date(targetYear, m.monthIdx + 1, 0);
                return {
                    startDate: firstDay.toISOString().split('T')[0],
                    endDate: lastDay.toISOString().split('T')[0],
                    label: `${m.name} ${targetYear}`
                };
            }
        }

        // Por defecto: este mes
        const defaultFirst = new Date(currentYear, currentMonth, 1);
        const defaultLast = new Date(currentYear, currentMonth + 1, 0);
        return {
            startDate: defaultFirst.toISOString().split('T')[0],
            endDate: defaultLast.toISOString().split('T')[0],
            label: 'este mes'
        };
    }
}

// ==========================================
// 3. CAPA DE HERRAMIENTAS FINANCIERAS (TOOLS)
// ==========================================
class FinancialToolsLayer {
    static async getTransactions({ type, category, dateRange, minAmount, maxAmount, search } = {}) {
        const movements = await FinxDataConnector.getMovements();
        return movements.filter(mov => {
            if (type && mov.type !== type) return false;
            if (category && mov.category.toLowerCase() !== category.toLowerCase()) return false;
            if (dateRange && dateRange.startDate && mov.date < dateRange.startDate) return false;
            if (dateRange && dateRange.endDate && mov.date > dateRange.endDate) return false;
            if (minAmount && Number(mov.amount) < minAmount) return false;
            if (maxAmount && Number(mov.amount) > maxAmount) return false;
            if (search) {
                const s = search.toLowerCase();
                const matchDesc = mov.description && mov.description.toLowerCase().includes(s);
                const matchCat = mov.category && mov.category.toLowerCase().includes(s);
                if (!matchDesc && !matchCat) return false;
            }
            return true;
        }).sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    static async getExpenses({ category, dateRange } = {}) {
        const txs = await this.getTransactions({ type: 'expense', category, dateRange });
        const total = txs.reduce((acc, t) => acc + Number(t.amount), 0);
        return { total, transactions: txs, count: txs.length };
    }

    static async getIncome({ category, dateRange } = {}) {
        const txs = await this.getTransactions({ type: 'income', category, dateRange });
        const total = txs.reduce((acc, t) => acc + Number(t.amount), 0);
        return { total, transactions: txs, count: txs.length };
    }

    static async getExpensesByCategory({ dateRange } = {}) {
        const { transactions, total: totalExpenses } = await this.getExpenses({ dateRange });
        const categoriesMap = {};

        transactions.forEach(t => {
            const cat = t.category || 'Otros';
            categoriesMap[cat] = (categoriesMap[cat] || 0) + Number(t.amount);
        });

        const result = Object.entries(categoriesMap).map(([category, amount]) => ({
            category,
            amount,
            percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0
        })).sort((a, b) => b.amount - a.amount);

        return { categories: result, totalExpenses };
    }

    static async getUserBalance({ dateRange } = {}) {
        const incomeRes = await this.getIncome({ dateRange });
        const expenseRes = await this.getExpenses({ dateRange });
        const totalIncome = incomeRes.total;
        const totalExpenses = expenseRes.total;
        const netBalance = totalIncome - totalExpenses;

        return {
            totalIncome,
            totalExpenses,
            netBalance,
            hasIncome: incomeRes.count > 0,
            hasExpenses: expenseRes.count > 0,
            totalMovements: incomeRes.count + expenseRes.count,
            savingsRate: totalIncome > 0 ? Math.round((netBalance / totalIncome) * 100) : 0
        };
    }

    static async getTopExpenses({ limit = 5, dateRange, category } = {}) {
        const txs = await this.getTransactions({ type: 'expense', category, dateRange });
        return txs.sort((a, b) => Number(b.amount) - Number(a.amount)).slice(0, limit);
    }

    static async comparePeriods(period1Range, period2Range) {
        const p1Exp = await this.getExpenses({ dateRange: period1Range });
        const p2Exp = await this.getExpenses({ dateRange: period2Range });

        const p1Cat = await this.getExpensesByCategory({ dateRange: period1Range });
        const p2Cat = await this.getExpensesByCategory({ dateRange: period2Range });

        const diffTotal = p1Exp.total - p2Exp.total;
        const pctChange = p2Exp.total > 0 ? Math.round((diffTotal / p2Exp.total) * 100) : 0;

        const categoryDiffs = [];
        const allCats = new Set([
            ...p1Cat.categories.map(c => c.category),
            ...p2Cat.categories.map(c => c.category)
        ]);

        allCats.forEach(cat => {
            const amt1 = (p1Cat.categories.find(c => c.category === cat) || {}).amount || 0;
            const amt2 = (p2Cat.categories.find(c => c.category === cat) || {}).amount || 0;
            const diff = amt1 - amt2;
            categoryDiffs.push({ category: cat, amt1, amt2, diff });
        });

        categoryDiffs.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));

        return {
            period1: { label: period1Range.label, total: p1Exp.total },
            period2: { label: period2Range.label, total: p2Exp.total },
            diffTotal,
            pctChange,
            categoryDiffs
        };
    }

    static async getBudgetStatus() {
        const dateRange = DateParser.parseNaturalDate('este mes');
        const { categories, totalExpenses } = await this.getExpensesByCategory({ dateRange });
        const budgets = await FinxDataConnector.getBudgets();

        const statusList = budgets.map(b => {
            const spentItem = categories.find(c => c.category.toLowerCase() === b.category.toLowerCase());
            const spent = spentItem ? spentItem.amount : 0;
            const remaining = b.limit - spent;
            const pct = Math.round((spent / b.limit) * 100);
            return {
                category: b.category,
                limit: b.limit,
                spent,
                remaining,
                pct,
                isExceeded: spent > b.limit
            };
        });

        return { statusList, totalExpenses };
    }

    static async getFinancialSummary({ dateRange } = {}) {
        const range = dateRange || DateParser.parseNaturalDate('este mes');
        const balance = await this.getUserBalance({ dateRange: range });
        const topCatRes = await this.getExpensesByCategory({ dateRange: range });
        const topExpenses = await this.getTopExpenses({ limit: 1, dateRange: range });
        const goals = await FinxDataConnector.getGoals();

        const topCategory = topCatRes.categories[0] || null;

        return {
            periodLabel: range.label,
            totalIncome: balance.totalIncome,
            totalExpenses: balance.totalExpenses,
            netBalance: balance.netBalance,
            hasMovements: balance.totalMovements > 0,
            hasIncome: balance.hasIncome,
            hasExpenses: balance.hasExpenses,
            topCategory,
            categories: topCatRes.categories,
            highestExpense: topExpenses[0] || null,
            goals
        };
    }
}

// ==========================================
// 4. ADMINISTRADOR DE MEMORIA Y CONTEXTO
// ==========================================
class ConversationContextManager {
    constructor() {
        this.history = [];
        this.lastContext = {
            intent: null,
            category: null,
            dateRange: null,
            action: null
        };
    }

    pushUserMessage(content) {
        this.history.push({ role: 'user', content, timestamp: new Date() });
    }

    pushAssistantMessage(content, contextUpdate = {}) {
        this.history.push({ role: 'assistant', content, timestamp: new Date() });
        this.lastContext = { ...this.lastContext, ...contextUpdate };
    }

    resolveFollowUpContext(normalizedInput, newCategory, newDateRange) {
        let activeCategory = newCategory;
        let activeDateRange = newDateRange;
        let activeIntent = null;

        const isFollowUpPhrase = (
            normalizedInput.includes('y el mes pasado') ||
            normalizedInput.includes('y este mes') ||
            normalizedInput.includes('y el año pasado') ||
            normalizedInput.startsWith('y en ') ||
            normalizedInput.startsWith('y para ') ||
            normalizedInput.startsWith('y de ') ||
            normalizedInput.includes('cuanto fue') ||
            normalizedInput.includes('cuánto fue')
        );

        if (isFollowUpPhrase && this.lastContext.intent) {
            activeIntent = this.lastContext.intent;
            if (!activeCategory && this.lastContext.category) {
                activeCategory = this.lastContext.category;
            }
            if (normalizedInput.includes('mes pasado') || normalizedInput.includes('semana pasada') || normalizedInput.includes('año pasado')) {
                activeDateRange = DateParser.parseNaturalDate(normalizedInput);
            } else if (!activeDateRange && this.lastContext.dateRange) {
                activeDateRange = this.lastContext.dateRange;
            }
        }

        return { activeCategory, activeDateRange, activeIntent };
    }
}

// ==========================================
// 5. MOTOR PRINCIPAL DE IA FINANCIERA
// ==========================================
class FinancialAIEngine {
    constructor() {
        this.contextManager = new ConversationContextManager();
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    }

    extractCategory(input) {
        const text = input.toLowerCase();
        const categoryMap = {
            'comida': ['comida', 'restaurante', 'supermercado', 'restaurantes', 'alimentos', 'almuerzo', 'cena'],
            'vivienda': ['vivienda', 'renta', 'alquiler', 'casa', 'departamento'],
            'transporte': ['transporte', 'gasolina', 'uber', 'taxi', 'peaje'],
            'entretenimiento': ['entretenimiento', 'cine', 'juegos', 'suscripciones', 'netflix', 'spotify'],
            'servicios': ['servicios', 'luz', 'agua', 'internet', 'teléfono', 'gas'],
            'salud': ['salud', 'farmacia', 'médico', 'doctor', 'medicinas'],
            'compras': ['compras', 'ropa', 'zapatos', 'tecnología']
        };

        for (const [catName, synonyms] of Object.entries(categoryMap)) {
            if (synonyms.some(s => text.includes(s))) {
                return catName.charAt(0).toUpperCase() + catName.slice(1);
            }
        }
        return null;
    }

    renderEmptyStateCard() {
        return `
            <div class="finx-empty-state-card text-center py-3 px-3">
                <div class="empty-icon mb-2">
                    <i class="bi bi-wallet2 fs-2 text-primary opacity-75"></i>
                </div>
                <h6 class="fw-bold mb-1">Aún no hay movimientos</h6>
                <p class="text-muted small mb-3">Agrega tus primeros ingresos o gastos y podré ayudarte a analizarlos y entender mejor tus finanzas.</p>
                <a href="dashboard.html" class="finx-action-link-btn m-0">
                    <i class="bi bi-plus-circle-fill me-1"></i> Agregar movimiento
                </a>
            </div>
        `;
    }

    async processUserQuery(rawInput, lang = 'es') {
        const input = rawInput.trim();
        const normalizedInput = input.toLowerCase();
        this.contextManager.pushUserMessage(input);

        // A. Off-topic check (sin jerga técnica)
        if (this.isOffTopic(normalizedInput)) {
            const text = lang === 'en'
                ? "I am your Finx financial assistant. 💡 I can help you understand your expenses, income, budgets, and savings goals. How can I assist with your money today?"
                : "Soy tu asistente financiero de **Finx** 💡. Puedo ayudarte a comprender tus gastos, ingresos, presupuestos, metas de ahorro y consejos para organizar tu dinero.\n\n¿En qué te gustaría que te ayude hoy?";
            this.contextManager.pushAssistantMessage(text);
            return { text, type: 'off_topic' };
        }

        // B. Extraer datos y contexto
        const extractedCategory = this.extractCategory(normalizedInput);
        const parsedDateRange = DateParser.parseNaturalDate(normalizedInput);
        const { activeCategory, activeDateRange, activeIntent } = this.contextManager.resolveFollowUpContext(
            normalizedInput, extractedCategory, parsedDateRange
        );

        const category = activeCategory || extractedCategory;
        const dateRange = activeDateRange || parsedDateRange;

        // Verificar si el usuario tiene movimientos registrados en total
        const allUserMovements = await FinxDataConnector.getMovements();
        const hasTotalMovements = allUserMovements.length > 0;

        // C. SALUDOS Y CONVERSACIÓN SOCIAL
        if (this.matchesAny(normalizedInput, ['hola', 'buenas', 'que tal', 'qué tal', 'saludos', 'hi', 'hello']) && normalizedInput.length < 20) {
            const text = lang === 'en'
                ? "Hi! 👋 Great to see you here. Would you like to check how your expenses are going this month?"
                : "¡Hola! 👋 Qué bueno verte por aquí. ¿Quieres que revisemos cómo van tus gastos este mes?";
            this.contextManager.pushAssistantMessage(text);
            return { text, type: 'greeting' };
        }

        if (this.matchesAny(normalizedInput, ['gracias', 'muchas gracias', 'thanks', 'thank you'])) {
            const text = lang === 'en'
                ? "You're welcome! 😊 I'll be here whenever you want to check anything else about your money."
                : "¡Con mucho gusto! 😊 Aquí estaré siempre que quieras revisar algo sobre tus finanzas.";
            this.contextManager.pushAssistantMessage(text);
            return { text, type: 'social' };
        }

        // D. DETECCIÓN DE ACCIONES (Agregar gasto)
        const addExpenseMatch = normalizedInput.match(/(?:agrega|registra|añade|anota|gasté|gaste)\s+(?:un\s+gasto\s+de\s+)?\$?(\d+(?:\.\d+)?)\s+(?:en\s+)?([a-záéíóúñ\s]+)?/i);
        if (addExpenseMatch && (normalizedInput.includes('gasto') || normalizedInput.includes('gasté') || normalizedInput.includes('gaste') || normalizedInput.includes('agrega'))) {
            const amount = parseFloat(addExpenseMatch[1]);
            const inferredCategory = category || 'Comida';
            
            const actionCardHtml = `
                <div class="action-confirm-card">
                    <div class="action-confirm-title">
                        <i class="bi bi-plus-circle-fill text-success fs-5"></i> Confirmar registro de gasto
                    </div>
                    <div class="action-detail-list">
                        • <strong>Monto:</strong> ${this.formatCurrency(amount)}<br>
                        • <strong>Categoría:</strong> ${inferredCategory}<br>
                        • <strong>Fecha:</strong> Hoy (${new Date().toLocaleDateString()})
                    </div>
                    <div class="action-buttons-group">
                        <button class="btn-confirm-action" data-action="confirm_add_expense" data-amount="${amount}" data-category="${inferredCategory}">
                            <i class="bi bi-check-circle-fill"></i> Confirmar y Guardar
                        </button>
                        <button class="btn-cancel-action" data-action="cancel_action">
                            Cancelar
                        </button>
                    </div>
                </div>
            `;

            const text = `Entendido. He preparado el registro de tu gasto por **${this.formatCurrency(amount)}** en **${inferredCategory}**. Por favor confirma para registrarlo.`;
            this.contextManager.pushAssistantMessage(text, { intent: 'add_expense' });
            return { text, htmlWidget: actionCardHtml, type: 'action_prompt' };
        }

        // D. CONSULTAS FINANCIERAS

        // 1. COMPARATIVA DE PERIODOS
        if (activeIntent === 'period_comparison' || this.matchesAny(normalizedInput, ['compara', 'comparar', 'comparativa', 'comparado con', 'diferencia con el mes pasado', 'por que gaste mas', 'por qué gasté más'])) {
            if (!hasTotalMovements) {
                const text = `Aún no tienes movimientos registrados para comparar.`;
                const htmlWidget = this.renderEmptyStateCard();
                this.contextManager.pushAssistantMessage(text);
                return { text, htmlWidget, type: 'data_insight' };
            }

            const p1Range = DateParser.parseNaturalDate('este mes');
            const p2Range = DateParser.parseNaturalDate('el mes pasado');
            const comp = await FinancialToolsLayer.comparePeriods(p1Range, p2Range);

            let diffText = comp.diffTotal >= 0 
                ? `un **aumento de ${this.formatCurrency(comp.diffTotal)}** (${comp.pctChange}% más que en ${comp.period2.label})`
                : `una **disminución de ${this.formatCurrency(Math.abs(comp.diffTotal))}** (${Math.abs(comp.pctChange)}% menos que en ${comp.period2.label})`;

            let text = `📊 **Comparativa (${comp.period1.label} vs ${comp.period2.label})**\n\n`;
            text += `• **Gastos ${comp.period1.label}:** ${this.formatCurrency(comp.period1.total)}\n`;
            text += `• **Gastos ${comp.period2.label}:** ${this.formatCurrency(comp.period2.total)}\n\n`;
            text += `En el periodo actual registras ${diffText}.\n\n`;

            if (comp.categoryDiffs.length > 0) {
                text += `📌 **Variaciones principales:**\n`;
                comp.categoryDiffs.slice(0, 3).forEach(c => {
                    const sign = c.diff >= 0 ? '+' : '-';
                    text += `• **${c.category}:** ${sign}${this.formatCurrency(Math.abs(c.diff))}\n`;
                });
            }

            const actionLinks = `<a href="dashboard.html" class="finx-action-link-btn"><i class="bi bi-speedometer2"></i> Ver en Dashboard</a>`;
            this.contextManager.pushAssistantMessage(text, { intent: 'period_comparison', dateRange: p1Range });
            return { text, htmlWidget: actionLinks, type: 'data_insight' };
        }

        // 2. ¿EN QUÉ GASTÉ MÁS? / CATEGORÍAS
        if (activeIntent === 'expenses_by_category' || this.matchesAny(normalizedInput, ['en que gasto mas', 'en qué gasto más', 'en que gasté mas', 'en qué gasté más', 'categoria donde gasto mas', 'donde se me va la plata', 'donde se va mi dinero'])) {
            if (!hasTotalMovements) {
                const text = `Aún no tienes movimientos registrados para analizar tus categorías.`;
                const htmlWidget = this.renderEmptyStateCard();
                this.contextManager.pushAssistantMessage(text);
                return { text, htmlWidget, type: 'data_insight' };
            }

            const { categories, totalExpenses } = await FinancialToolsLayer.getExpensesByCategory({ dateRange });

            if (totalExpenses === 0 || categories.length === 0) {
                const text = `No registras gastos en **${dateRange.label}**.`;
                this.contextManager.pushAssistantMessage(text);
                return { text, type: 'data_insight' };
            }

            const top = categories[0];
            let text = `En **${dateRange.label}**, la categoría donde más has gastado es **${top.category}** con **${this.formatCurrency(top.amount)}** (${top.percentage}% del total de tus gastos).\n\n`;

            let widgetHtml = `<div class="finx-widget-card"><strong>Desglose de Gastos (${dateRange.label})</strong><div class="mt-2">`;
            categories.slice(0, 5).forEach(cat => {
                const colorClass = cat.percentage > 35 ? 'warning' : '';
                widgetHtml += `
                    <div class="cat-progress-item">
                        <div class="cat-progress-header">
                            <span class="cat-progress-name">${cat.category}</span>
                            <span class="cat-progress-val">${this.formatCurrency(cat.amount)} (${cat.percentage}%)</span>
                        </div>
                        <div class="cat-bar-track">
                            <div class="cat-bar-fill ${colorClass}" style="width: ${cat.percentage}%"></div>
                        </div>
                    </div>
                `;
            });
            widgetHtml += `</div><a href="dashboard.html" class="finx-action-link-btn"><i class="bi bi-bar-chart-line-fill"></i> Ver en Dashboard</a></div>`;

            this.contextManager.pushAssistantMessage(text, { intent: 'expenses_by_category', dateRange });
            return { text, htmlWidget: widgetHtml, type: 'data_insight' };
        }

        // 3. CONSULTA CATEGORÍA ESPECÍFICA
        if (category && (normalizedInput.includes('gasté') || normalizedInput.includes('gaste') || normalizedInput.includes('cuanto') || normalizedInput.includes('cuánto') || activeIntent === 'category_detail')) {
            if (!hasTotalMovements) {
                const text = `Aún no tienes movimientos registrados en la categoría **${category}**.`;
                const htmlWidget = this.renderEmptyStateCard();
                this.contextManager.pushAssistantMessage(text);
                return { text, htmlWidget, type: 'data_insight' };
            }

            const { total, transactions } = await FinancialToolsLayer.getExpenses({ category, dateRange });
            const allExpenses = await FinancialToolsLayer.getExpenses({ dateRange });
            const percentage = allExpenses.total > 0 ? Math.round((total / allExpenses.total) * 100) : 0;

            let text = `En la categoría **${category}** has gastado **${this.formatCurrency(total)}** en **${dateRange.label}**.`;
            if (percentage > 0) {
                text += ` Representa el **${percentage}%** de tus gastos en este periodo.`;
            }

            if (transactions.length > 0) {
                text += `\n\n📋 **Movimientos recientes:**\n`;
                transactions.slice(0, 3).forEach(t => {
                    text += `• ${t.date}: ${this.formatCurrency(t.amount)} (${t.description || t.category})\n`;
                });
            }

            const actionLinks = `<a href="dashboard.html" class="finx-action-link-btn"><i class="bi bi-funnel-fill"></i> Filtrar en Dashboard</a>`;
            this.contextManager.pushAssistantMessage(text, { intent: 'category_detail', category, dateRange });
            return { text, htmlWidget: actionLinks, type: 'data_insight' };
        }

        // 4. ¿CUÁNTO GASTÉ ESTE MES / EN UN PERIODO?
        if (activeIntent === 'monthly_expenses' || this.matchesAny(normalizedInput, ['cuanto he gastado', 'cuánto he gastado', 'cuanto gaste', 'cuánto gasté', 'gastos este mes', 'cuanto llevo gastado', 'mis gastos'])) {
            if (!hasTotalMovements) {
                const text = `¡Aún no tienes movimientos registrados! 💡`;
                const htmlWidget = this.renderEmptyStateCard();
                this.contextManager.pushAssistantMessage(text);
                return { text, htmlWidget, type: 'data_insight' };
            }

            const { total: totalExpenses, count } = await FinancialToolsLayer.getExpenses({ dateRange });
            const topCategoryRes = await FinancialToolsLayer.getExpensesByCategory({ dateRange });
            const topCat = topCategoryRes.categories[0];

            if (totalExpenses === 0) {
                const text = `No tienes gastos registrados en **${dateRange.label}**.`;
                this.contextManager.pushAssistantMessage(text);
                return { text, type: 'data_insight' };
            }

            let text = `En **${dateRange.label}** tus gastos suman **${this.formatCurrency(totalExpenses)}** (${count} transacciones).\n\n`;
            if (topCat && topCat.amount > 0) {
                text += `📊 La categoría con mayor gasto es **${topCat.category}** con **${this.formatCurrency(topCat.amount)}** (${topCat.percentage}%).`;
            }

            const widgetHtml = `<a href="dashboard.html" class="finx-action-link-btn"><i class="bi bi-search"></i> Ver en Dashboard</a>`;
            this.contextManager.pushAssistantMessage(text, { intent: 'monthly_expenses', dateRange });
            return { text, htmlWidget: widgetHtml, type: 'data_insight' };
        }

        // 5. GASTO MÁS GRANDE
        if (this.matchesAny(normalizedInput, ['gasto mas grande', 'gasto más grande', 'mayor gasto', 'gasto mas alto', 'gasto más alto', 'mayor compra'])) {
            if (!hasTotalMovements) {
                const text = `Aún no tienes compras o gastos registrados.`;
                const htmlWidget = this.renderEmptyStateCard();
                this.contextManager.pushAssistantMessage(text);
                return { text, htmlWidget, type: 'data_insight' };
            }

            const topExpenses = await FinancialToolsLayer.getTopExpenses({ limit: 1, dateRange });
            const top = topExpenses[0];

            if (top) {
                const text = `Tu gasto más alto en **${dateRange.label}** fue de **${this.formatCurrency(top.amount)}** en **${top.category}** (${top.description}) el ${top.date}.`;
                this.contextManager.pushAssistantMessage(text, { intent: 'highest_expense', dateRange });
                return { text, type: 'data_insight' };
            } else {
                const text = `No hay gastos registrados en **${dateRange.label}**.`;
                this.contextManager.pushAssistantMessage(text);
                return { text, type: 'data_insight' };
            }
        }

        // 6. BALANCE Y DINERO DISPONIBLE
        if (this.matchesAny(normalizedInput, ['cuanto dinero me queda', 'cuánto dinero me queda', 'cuanto me queda', 'cuánto me queda', 'balance actual', 'mi balance', 'saldo disponible'])) {
            if (!hasTotalMovements) {
                const text = `¡Aún no tienes movimientos registrados para calcular tu balance!`;
                const htmlWidget = this.renderEmptyStateCard();
                this.contextManager.pushAssistantMessage(text);
                return { text, htmlWidget, type: 'data_insight' };
            }

            const balance = await FinancialToolsLayer.getUserBalance({ dateRange });
            let statusIcon = balance.netBalance >= 0 ? '🟢' : '🔴';

            let text = `En **${dateRange.label}**, tu balance disponible es de **${this.formatCurrency(balance.netBalance)}** ${statusIcon}.\n\n`;
            text += `• **Ingresos:** ${this.formatCurrency(balance.totalIncome)}\n`;
            text += `• **Gastos:** ${this.formatCurrency(balance.totalExpenses)}\n`;

            const widgetHtml = `
                <div class="finx-metric-grid">
                    <div class="finx-metric-item">
                        <span class="finx-metric-label">Ingresos</span>
                        <span class="finx-metric-value text-success">${this.formatCurrency(balance.totalIncome)}</span>
                    </div>
                    <div class="finx-metric-item">
                        <span class="finx-metric-label">Gastos</span>
                        <span class="finx-metric-value text-danger">${this.formatCurrency(balance.totalExpenses)}</span>
                    </div>
                    <div class="finx-metric-item">
                        <span class="finx-metric-label">Balance</span>
                        <span class="finx-metric-value">${this.formatCurrency(balance.netBalance)}</span>
                    </div>
                </div>
            `;

            this.contextManager.pushAssistantMessage(text, { intent: 'net_balance', dateRange });
            return { text, htmlWidget: widgetHtml, type: 'data_insight' };
        }

        // 7. PRESUPUESTOS
        if (this.matchesAny(normalizedInput, ['presupuesto', 'estoy dentro de mi presupuesto', 'como voy con mi presupuesto', 'presupuestos'])) {
            const { statusList } = await FinancialToolsLayer.getBudgetStatus();

            let text = `📊 **Estado de tus Presupuestos**\n\n`;
            let exceededCount = 0;

            statusList.forEach(b => {
                const icon = b.isExceeded ? '⚠️' : '✅';
                if (b.isExceeded) exceededCount++;
                text += `${icon} **${b.category}:** Gastado ${this.formatCurrency(b.spent)} de ${this.formatCurrency(b.limit)} (${b.pct}%)\n`;
            });

            if (exceededCount > 0) {
                text += `\nTienes **${exceededCount} categoría(s)** excediendo su límite.`;
            }

            const actionLinks = `<a href="dashboard.html" class="finx-action-link-btn"><i class="bi bi-wallet2"></i> Ver en Dashboard</a>`;
            this.contextManager.pushAssistantMessage(text, { intent: 'budget_status' });
            return { text, htmlWidget: actionLinks, type: 'data_insight' };
        }

        // 8. METAS DE AHORRO
        if (this.matchesAny(normalizedInput, ['meta', 'metas', 'ahorro', 'como van mis metas', 'mis metas de ahorro'])) {
            const goals = await FinxDataConnector.getGoals();

            let text = `🎯 **Metas de Ahorro**\n\n`;
            goals.forEach(g => {
                const saved = g.saved || g.current || 0;
                const pct = Math.min(100, Math.round((saved / g.target) * 100));
                text += `• **${g.title || g.name}:** ${this.formatCurrency(saved)} / ${this.formatCurrency(g.target)} (${pct}%)\n`;
            });

            const actionLinks = `<a href="goals.html" class="finx-action-link-btn"><i class="bi bi-flag-fill"></i> Ver en Metas</a>`;
            this.contextManager.pushAssistantMessage(text, { intent: 'goals_status' });
            return { text, htmlWidget: actionLinks, type: 'data_insight' };
        }

        // 9. RESUMEN FINANCIERO COMPLETO
        if (this.matchesAny(normalizedInput, ['resumen', 'resumen financiero', 'estado financiero', 'analisis financiero', 'cómo voy este mes'])) {
            // REGLA CRÍTICA: SI EL USUARIO NO TIENE MOVIMIENTOS REGISTRADOS, MOSTRAR ÚNICAMENTE EL ESTADO VACÍO PROFESIONAL
            if (!hasTotalMovements) {
                const text = `¡Aún no tienes movimientos registrados! 💡`;
                const htmlWidget = this.renderEmptyStateCard();
                this.contextManager.pushAssistantMessage(text);
                return { text, htmlWidget, type: 'data_insight' };
            }

            const summary = await FinancialToolsLayer.getFinancialSummary({ dateRange });

            let text = `📊 **RESUMEN FINANCIERO PERSONAL (${summary.periodLabel})**\n\n`;

            if (summary.totalIncome > 0) text += `💰 **Ingresos Totales:** ${this.formatCurrency(summary.totalIncome)}\n`;
            if (summary.totalExpenses > 0) text += `💸 **Gastos Totales:** ${this.formatCurrency(summary.totalExpenses)}\n`;
            text += `⚖️ **Balance Neto:** ${this.formatCurrency(summary.netBalance)}\n`;

            if (summary.topCategory && summary.topCategory.amount > 0) {
                text += `🏷️ **Categoría Principal:** ${summary.topCategory.category} (${this.formatCurrency(summary.topCategory.amount)})\n`;
            }

            // RECOMENDACIÓN: SOLO SI EXISTEN GASTOS Y CATEGORÍA REAL CON MONTO > 0
            if (summary.topCategory && summary.topCategory.amount > 0 && summary.totalExpenses > 0) {
                text += `\n💡 **Recomendación Personalizada:**\n`;
                if (summary.topCategory.percentage > 35) {
                    text += `Tus gastos en **${summary.topCategory.category}** representan el ${summary.topCategory.percentage}% del total. Optimizar esta categoría te ayudará a aumentar tu ahorro.`;
                } else {
                    text += `Mantienes una distribución equilibrada en tus categorías de gasto.`;
                }
            }

            const actionLinks = `<a href="dashboard.html" class="finx-action-link-btn"><i class="bi bi-grid-fill"></i> Ver en Dashboard</a>`;
            this.contextManager.pushAssistantMessage(text, { intent: 'financial_summary', dateRange });
            return { text, htmlWidget: actionLinks, type: 'data_insight' };
        }

        // E. EDUCACIÓN FINANCIERA GENERAL
        if (this.matchesAny(normalizedInput, ['interes compuesto', 'interés compuesto'])) {
            const text = `El **Interés Compuesto** es cuando los rendimientos de tu dinero generan más rendimientos con el tiempo ("interés sobre interés").\n\n📈 **Ejemplo:** Si inviertes $1,000 al 10% anual, el primer año ganas $100. El segundo año ganas el 10% sobre $1,100 ($110). Con el tiempo, el crecimiento es exponencial.`;
            this.contextManager.pushAssistantMessage(text);
            return { text, type: 'financial_education' };
        }

        if (this.matchesAny(normalizedInput, ['50/30/20', 'regla 50 30 20', 'como distribuir mi dinero'])) {
            const text = `La **Regla 50/30/20** sugiere dividir tus ingresos así:\n\n• **50% Necesidades:** Vivienda, comida, servicios, transporte.\n• **30% Deseos:** Entretenimiento, salidas, hobbies.\n• **20% Ahorro e Inversión:** Fondo de emergencia y metas a futuro.`;
            this.contextManager.pushAssistantMessage(text);
            return { text, type: 'financial_education' };
        }

        // F. RESPUESTA POR DEFECTO AMIGABLE
        const defaultText = lang === 'en'
            ? `I am your Finx Financial Assistant. You can ask me:\n\n• *How much did I spend this month?*\n• *Show me a financial summary*\n• *Which category do I spend the most in?*\n• *How are my savings goals doing?*`
            : `Soy tu Asistente Financiero de Finx. Puedes preguntarme:\n\n` +
              `💰 *¿Cuánto gasté este mes?*\n` +
              `📊 *Muéstrame un resumen financiero*\n` +
              `📈 *¿En qué categoría gasto más?*\n` +
              `🎯 *¿Cómo van mis metas de ahorro?*`;

        this.contextManager.pushAssistantMessage(defaultText);
        return { text: defaultText, type: 'general' };
    }

    async executeConfirmedAction(actionName, params) {
        if (actionName === 'confirm_add_expense') {
            const newMov = await FinxDataConnector.addMovement({
                type: 'expense',
                amount: parseFloat(params.amount),
                category: params.category,
                date: new Date().toISOString().split('T')[0],
                description: `Gasto en ${params.category}`
            });

            return {
                success: true,
                message: `✅ Gasto de **${this.formatCurrency(newMov.amount)}** en **${newMov.category}** registrado exitosamente.`,
                htmlWidget: `<a href="dashboard.html" class="finx-action-link-btn"><i class="bi bi-speedometer2"></i> Ver en Dashboard</a>`
            };
        }

        return { success: false, message: 'Acción cancelada.' };
    }

    isOffTopic(input) {
        const nonFinancialKeywords = [
            'receta de cocina', 'clima de hoy', 'partido de fútbol', 'película',
            'videojuego', 'horóscopo', 'chiste', 'canción', 'política',
            'programar en python', 'capital de francia'
        ];
        return nonFinancialKeywords.some(keyword => input.includes(keyword));
    }

    matchesAny(input, phrases) {
        return phrases.some(p => input.includes(p));
    }
}

// Exponer globalmente
window.FinxDataConnector = FinxDataConnector;
window.FinancialToolsLayer = FinancialToolsLayer;
window.FinancialAIEngine = FinancialAIEngine;
window.financialAIEngineInstance = new FinancialAIEngine();
