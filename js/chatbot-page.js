/**
 * Finx Chatbot Page Controller v2.2
 * Maneja la interfaz del chat, persistencia conversacional por usuario,
 * estado animado de escritura, widgets interactivos y limpieza de chat.
 */

document.addEventListener('DOMContentLoaded', async function () {
    // Elementos del DOM
    const chatMessages = document.getElementById('chatbotMessages');
    const chatInput = document.getElementById('chatbotInput');
    const sendButton = document.getElementById('chatbotSendBtn');
    const quickOptionsContainer = document.getElementById('quickOptions');
    const clearChatBtn = document.getElementById('clearChatBtn');

    // Instancia del Motor de IA
    const aiEngine = window.financialAIEngineInstance || new FinancialAIEngine();

    // Estado del usuario e historial
    const currentUser = await FinxDataConnector.getCurrentUser();
    const storageKey = `finx_chat_history_${currentUser.id || 'guest'}`;
    let chatHistory = [];

    // Obtener idioma actual
    function getCurrentLanguage() {
        return localStorage.getItem('finx_lang') || 'es';
    }

    // Chips de sugerencias de conversación compactas
    const promptChips = {
        es: [
            { text: '💰 Mis gastos', query: '¿Cuánto gasté este mes?' },
            { text: '📊 Resumen', query: 'Muéstrame un resumen financiero' },
            { text: '📈 Comparar meses', query: 'Compárame este mes con el mes pasado' },
            { text: '🎯 Presupuesto', query: '¿Cómo voy con mi presupuesto?' },
            { text: '💳 Mayor gasto', query: '¿Cuál fue mi mayor gasto?' }
        ],
        en: [
            { text: '💰 My expenses', query: 'How much did I spend this month?' },
            { text: '📊 Summary', query: 'Show me a financial summary' },
            { text: '📈 Compare months', query: 'Compare this month with last month' },
            { text: '🎯 Budget', query: 'How am I doing with my budget?' },
            { text: '💳 Top expense', query: 'What was my highest expense?' }
        ]
    };

    /**
     * Convierte texto plano con Markdown simple a HTML seguro
     */
    function parseSimpleMarkdown(text) {
        if (!text) return '';

        let html = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // Negrita **texto**
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Cursiva *texto*
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Saltos de línea dobles para párrafos
        const paragraphs = html.split('\n\n');
        const formattedParagraphs = paragraphs.map(p => {
            if (p.includes('• ') || p.includes('- ')) {
                const lines = p.split('\n');
                let listHtml = '<ul class="mb-2 ps-3">';
                lines.forEach(line => {
                    const cleanLine = line.replace(/^[•\-]\s*/, '');
                    if (cleanLine.trim()) {
                        listHtml += `<li>${cleanLine}</li>`;
                    }
                });
                listHtml += '</ul>';
                return listHtml;
            }
            return `<p class="mb-2">${p.replace(/\n/g, '<br>')}</p>`;
        });

        return formattedParagraphs.join('');
    }

    /**
     * Guarda el historial actual en localStorage
     */
    function saveHistory() {
        try {
            localStorage.setItem(storageKey, JSON.stringify(chatHistory));
        } catch (e) {}
    }

    /**
     * Agrega un mensaje al chat (y opcionalmente persiste en el historial)
     */
    function appendMessage(content, isUser = false, animateTypewriter = false, htmlWidget = null, shouldSave = true) {
        if (!chatMessages) return null;

        const wrapper = document.createElement('div');
        wrapper.className = `message-wrapper ${isUser ? 'user-wrapper' : 'bot-wrapper'}`;

        const avatar = document.createElement('div');
        avatar.className = 'msg-avatar';
        avatar.innerHTML = isUser ? '<i class="bi bi-person-fill"></i>' : '<i class="bi bi-robot"></i>';

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';

        wrapper.appendChild(avatar);
        wrapper.appendChild(bubble);
        chatMessages.appendChild(wrapper);

        if (isUser) {
            bubble.textContent = content;
            if (shouldSave) {
                chatHistory.push({
                    id: crypto.randomUUID(),
                    content,
                    isUser: true,
                    htmlWidget: null,
                    timestamp: new Date().toISOString()
                });
                saveHistory();
            }
            scrollToBottom();
            return wrapper;
        }

        // Si es el bot
        if (animateTypewriter) {
            typewriterEffect(bubble, content, () => {
                if (htmlWidget) {
                    const widgetDiv = document.createElement('div');
                    widgetDiv.className = 'bot-widget-container mt-2';
                    widgetDiv.innerHTML = htmlWidget;
                    bubble.appendChild(widgetDiv);
                    scrollToBottom();
                }
                if (shouldSave) {
                    chatHistory.push({
                        id: crypto.randomUUID(),
                        content,
                        isUser: false,
                        htmlWidget,
                        timestamp: new Date().toISOString()
                    });
                    saveHistory();
                }
            });
        } else {
            bubble.innerHTML = parseSimpleMarkdown(content);
            if (htmlWidget) {
                const widgetDiv = document.createElement('div');
                widgetDiv.className = 'bot-widget-container mt-2';
                widgetDiv.innerHTML = htmlWidget;
                bubble.appendChild(widgetDiv);
            }
            if (shouldSave) {
                chatHistory.push({
                    id: crypto.randomUUID(),
                    content,
                    isUser: false,
                    htmlWidget,
                    timestamp: new Date().toISOString()
                });
                saveHistory();
            }
            scrollToBottom();
        }

        return wrapper;
    }

    /**
     * Efecto de escritura progresiva (Typewriter)
     */
    function typewriterEffect(element, fullText, onComplete) {
        const parsedHTML = parseSimpleMarkdown(fullText);
        element.innerHTML = '';

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = parsedHTML;
        const plainText = tempDiv.textContent || tempDiv.innerText || fullText;

        let index = 0;
        const speed = 10;

        const interval = setInterval(() => {
            index += 2;
            if (index >= plainText.length) {
                element.innerHTML = parsedHTML;
                clearInterval(interval);
                scrollToBottom();
                if (onComplete) onComplete();
            } else {
                element.textContent = plainText.substring(0, index);
                scrollToBottom();
            }
        }, speed);
    }

    /**
     * Muestra el indicador visual "Escribiendo..."
     */
    function showTypingIndicator() {
        const wrapper = document.createElement('div');
        wrapper.className = 'message-wrapper bot-wrapper';
        wrapper.id = 'typingIndicatorWrapper';

        const avatar = document.createElement('div');
        avatar.className = 'msg-avatar';
        avatar.innerHTML = '<i class="bi bi-robot"></i>';

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble typing-indicator-bubble';
        bubble.innerHTML = '<span></span><span></span><span></span>';

        wrapper.appendChild(avatar);
        wrapper.appendChild(bubble);
        chatMessages.appendChild(wrapper);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typingIndicatorWrapper');
        if (indicator) {
            indicator.remove();
        }
    }

    function scrollToBottom() {
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    /**
     * Renderiza las opciones rápidas de consulta
     */
    function renderQuickOptions() {
        if (!quickOptionsContainer) return;

        const lang = getCurrentLanguage();
        const chips = promptChips[lang] || promptChips['es'];

        quickOptionsContainer.innerHTML = '';
        chips.forEach(chip => {
            const btn = document.createElement('button');
            btn.className = 'quick-option';
            btn.innerHTML = chip.text;
            btn.addEventListener('click', () => {
                if (chatInput) {
                    chatInput.value = chip.query;
                    handleSendMessage();
                }
            });
            quickOptionsContainer.appendChild(btn);
        });
    }

    /**
     * Maneja el envío de mensajes por parte del usuario
     */
    async function handleSendMessage() {
        if (!chatInput) return;
        const text = chatInput.value.trim();
        if (!text) return;

        // Limpiar input y reajustar altura
        chatInput.value = '';
        chatInput.style.height = 'auto';

        // Renderizar mensaje del usuario (y guardar)
        appendMessage(text, true, false, null, true);

        // Mostrar indicador "Escribiendo..."
        showTypingIndicator();

        const lang = getCurrentLanguage();
        const delay = Math.floor(Math.random() * 300) + 300;

        setTimeout(async () => {
            removeTypingIndicator();
            const responseObj = await aiEngine.processUserQuery(text, lang);
            appendMessage(responseObj.text, false, true, responseObj.htmlWidget, true);
        }, delay);
    }

    /**
     * Manejador de clics para botones de acciones interactivas
     */
    if (chatMessages) {
        chatMessages.addEventListener('click', async function (e) {
            const targetBtn = e.target.closest('button[data-action]');
            if (!targetBtn) return;

            const action = targetBtn.dataset.action;
            const parentCard = targetBtn.closest('.action-confirm-card');

            if (action === 'cancel_action') {
                if (parentCard) {
                    parentCard.innerHTML = `<div class="text-muted fs-6"><i class="bi bi-x-circle me-1"></i> Acción cancelada.</div>`;
                }
                return;
            }

            if (action === 'confirm_add_expense') {
                const amount = targetBtn.dataset.amount;
                const category = targetBtn.dataset.category;

                targetBtn.disabled = true;
                targetBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status"></span> Guardando...`;

                const result = await aiEngine.executeConfirmedAction(action, { amount, category });

                if (parentCard) {
                    parentCard.className = 'action-confirm-card border-success bg-success-subtle text-dark';
                    parentCard.innerHTML = `
                        <div>${result.message}</div>
                        <div class="mt-2">${result.htmlWidget || ''}</div>
                    `;
                    scrollToBottom();
                }
            }
        });
    }

    // Botón de Nueva conversación / Limpiar chat
    if (clearChatBtn) {
        clearChatBtn.addEventListener('click', function () {
            if (confirm('¿Quieres comenzar una nueva conversación? Se borrará el historial de este chat.')) {
                localStorage.removeItem(storageKey);
                chatHistory = [];
                chatMessages.innerHTML = '';
                initChat(true);
            }
        });
    }

    // Event Listeners de entrada de texto
    if (sendButton) {
        sendButton.addEventListener('click', handleSendMessage);
    }

    if (chatInput) {
        // Enviar con Enter (sin Shift) y permitir saltos de línea con Shift + Enter
        chatInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        });

        // Auto-crecer textarea suavemente
        chatInput.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });
    }

    /**
     * Inicializa o restaura la conversación
     */
    async function initChat(forceReset = false) {
        if (!chatMessages) return;

        const lang = getCurrentLanguage();
        const rawHistory = localStorage.getItem(storageKey);

        renderQuickOptions();

        if (!forceReset && rawHistory) {
            try {
                const parsed = JSON.parse(rawHistory);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    chatHistory = parsed;
                    chatMessages.innerHTML = '';
                    // Restaurar mensajes guardados en orden exacto sin duplicar ni escribir
                    chatHistory.forEach(msg => {
                        appendMessage(msg.content, msg.isUser, false, msg.htmlWidget, false);
                    });
                    scrollToBottom();
                    return;
                }
            } catch (e) {}
        }

        // Si no hay historial previo (o si fue borrado)
        chatHistory = [];
        chatMessages.innerHTML = '';

        const welcomeText = lang === 'en'
            ? `Hi! 👋 How are your finances going today? I am here to help you understand your expenses, organize your money, or check how you are doing this month.`
            : `¡Hola! 👋 ¿Cómo van tus finanzas hoy? Estoy aquí para ayudarte a entender tus gastos, organizar tu dinero o revisar cómo vas este mes.`;

        setTimeout(() => {
            appendMessage(welcomeText, false, true, null, true);
        }, 200);
    }

    // Escuchar cambios de idioma
    window.handleChatbotLanguageChange = function() {
        initChat(true);
    };

    // Inicializar
    initChat();
});
