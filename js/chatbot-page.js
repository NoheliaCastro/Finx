/**
 * Finx Chatbot Page Controller
 * Conecta el Motor de IA Financiera con la Interfaz de Usuario
 */

document.addEventListener('DOMContentLoaded', function () {
    // Elementos del DOM
    const chatMessages = document.getElementById('chatbotMessages');
    const chatInput = document.getElementById('chatbotInput');
    const sendButton = document.getElementById('chatbotSendBtn');
    const quickOptionsContainer = document.getElementById('quickOptions');

    // Instancia del Motor de IA
    const aiEngine = window.financialAIEngineInstance || new FinancialAIEngine();

    // Obtener idioma actual
    function getCurrentLanguage() {
        return localStorage.getItem('finx_lang') || 'es';
    }

    // Traducción simple para sugerencias iniciales
    const promptChips = {
        es: [
            { text: '💰 ¿Cuánto gasté este mes?', query: '¿Cuánto gasté este mes?' },
            { text: '📊 Resumen financiero', query: 'Muéstrame un resumen financiero' },
            { text: '🎯 Mis metas de ahorro', query: '¿Cómo van mis metas de ahorro?' },
            { text: '📉 ¿En qué gasto más?', query: '¿En qué categoría gasto más?' },
            { text: '💡 Consejos para ahorrar', query: '¿Cómo ahorro más?' }
        ],
        en: [
            { text: '💰 How much did I spend?', query: 'How much did I spend this month?' },
            { text: '📊 Financial Summary', query: 'Show me a financial summary' },
            { text: '🎯 Savings goals', query: 'How are my savings goals doing?' },
            { text: '📉 Top spending category', query: 'Which category do I spend the most in?' },
            { text: '💡 Savings tips', query: 'How to save more money?' }
        ]
    };

    /**
     * Convierte texto plano con Markdown simple a HTML seguro
     */
    function parseSimpleMarkdown(text) {
        if (!text) return '';

        let html = text
            // Escapar HTML no deseado
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
            // Viñetas • o -
            if (p.includes('• ') || p.includes('- ')) {
                const lines = p.split('\n');
                let listHtml = '<ul>';
                lines.forEach(line => {
                    const cleanLine = line.replace(/^[•\-]\s*/, '');
                    if (cleanLine.trim()) {
                        listHtml += `<li>${cleanLine}</li>`;
                    }
                });
                listHtml += '</ul>';
                return listHtml;
            }
            return `<p>${p.replace(/\n/g, '<br>')}</p>`;
        });

        return formattedParagraphs.join('');
    }

    /**
     * Agrega un mensaje al chat
     */
    function appendMessage(content, isUser = false, animateTypewriter = false) {
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
            scrollToBottom();
            return wrapper;
        }

        // Si es el bot y se solicita animación de escritura
        if (animateTypewriter) {
            typewriterEffect(bubble, content);
        } else {
            bubble.innerHTML = parseSimpleMarkdown(content);
            scrollToBottom();
        }

        return wrapper;
    }

    /**
     * Efecto de escritura progresiva (Typewriter) estilo ChatGPT
     */
    function typewriterEffect(element, fullText) {
        const parsedHTML = parseSimpleMarkdown(fullText);
        element.innerHTML = '';
        
        // Creamos un contenedor temporal
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = parsedHTML;
        const plainText = tempDiv.textContent || tempDiv.innerText || fullText;

        let index = 0;
        const speed = 14; // ms por carácter

        const interval = setInterval(() => {
            index += 2;
            if (index >= plainText.length) {
                element.innerHTML = parsedHTML;
                clearInterval(interval);
                scrollToBottom();
            } else {
                element.textContent = plainText.substring(0, index);
                scrollToBottom();
            }
        }, speed);
    }

    /**
     * Muestra el indicador visual "IA pensando..."
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

    /**
     * Remueve el indicador visual de escritura
     */
    function removeTypingIndicator() {
        const indicator = document.getElementById('typingIndicatorWrapper');
        if (indicator) {
            indicator.remove();
        }
    }

    /**
     * Desplaza el scroll suavemente al último mensaje
     */
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
     * Maneja la transmisión de mensajes
     */
    async function handleSendMessage() {
        if (!chatInput) return;
        const text = chatInput.value.trim();
        if (!text) return;

        // Limpiar input
        chatInput.value = '';

        // Renderizar mensaje del usuario
        appendMessage(text, true);

        // Mostrar "La IA está procesando..."
        showTypingIndicator();

        const lang = getCurrentLanguage();

        // Simular tiempo de análisis dinámico (entre 500ms y 1100ms)
        const delay = Math.floor(Math.random() * 600) + 500;

        setTimeout(async () => {
            removeTypingIndicator();
            const responseObj = await aiEngine.processUserQuery(text, lang);
            appendMessage(responseObj.text, false, true);
        }, delay);
    }

    // Event Listeners
    if (sendButton) {
        sendButton.addEventListener('click', handleSendMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
            }
        });
    }

    // Inicializar chat con saludo inteligente
    function initChat() {
        if (!chatMessages) return;
        chatMessages.innerHTML = '';

        const lang = getCurrentLanguage();
        const userProfile = FinxDataConnector.getUserProfile();
        
        const welcomeText = lang === 'en'
            ? `Hello **${userProfile.name}**! 👋 I am your Finx Financial Assistant.\n\nI am connected live with your expenses, income, savings goals, and profile. How can I help you manage your money today?`
            : `¡Hola **${userProfile.name}**! 👋 Soy tu Asistente Financiero Inteligente de **Finx**.\n\nEstoy conectado en tiempo real con tus gastos, ingresos, metas de ahorro e historial financiero. ¿Qué te gustaría consultar u optimizar hoy en tus finanzas?`;

        renderQuickOptions();
        
        setTimeout(() => {
            appendMessage(welcomeText, false, true);
        }, 400);
    }

    // Manejar cambio de idioma si existe la función global
    window.handleChatbotLanguageChange = function() {
        initChat();
    };

    // Ejecutar inicialización
    initChat();
});
