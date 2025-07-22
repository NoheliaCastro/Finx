document.addEventListener('DOMContentLoaded', function() {
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSendBtn = document.getElementById('chatbotSendBtn');

    // Respuestas del chatbot
    const responses = {
        'hola': '¡Hola! Soy tu asistente financiero. ¿En qué puedo ayudarte hoy?',
        'cómo estás': '¡Estoy aquí para ayudarte con tus finanzas! ¿En qué puedo asistirte hoy?',
        'gracias': '¡De nada! Si tienes más preguntas, no dudes en preguntar.',
        'ayuda': 'Puedo ayudarte con: \n- Consejos de ahorro \n- Presupuestos \n- Inversiones \n- Metas financieras \n¿Sobre qué te gustaría saber más?',
        'ahorro': 'Para ahorrar dinero, te recomiendo: \n1. Establecer un presupuesto mensual \n2. Reducir gastos innecesarios \n3. Automatizar tus ahorros \n4. Establecer metas de ahorro específicas',
        'inversión': 'Antes de invertir, considera: \n1. Tu perfil de riesgo \n2. Tu horizonte de tiempo \n3. Diversificar tus inversiones \n4. Asesorarte con un experto',
        'presupuesto': 'Para crear un presupuesto efectivo: \n1. Registra todos tus ingresos \n2. Identifica tus gastos fijos y variables \n3. Establece límites de gasto \n4. Haz un seguimiento mensual \n5. Ajusta según sea necesario',
        'meta': 'Para alcanzar tus metas financieras: \n1. Sé específico con lo que quieres lograr \n2. Establece un monto y fecha objetivo \n3. Crea un plan de ahorro \n4. Haz seguimiento regular de tu progreso',
        'default': 'Lo siento, no estoy seguro de entender. ¿Podrías reformular tu pregunta? Estoy aquí para ayudarte con consejos financieros, ahorro, inversiones y más.'
    };

    // Función para agregar un mensaje al chat
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${isUser ? 'user-message' : ''}`;
        messageDiv.textContent = message;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Función para obtener la respuesta del chatbot
    function getResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Buscar una respuesta específica
        for (const [key, value] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return value;
            }
        }
        
        // Si no se encuentra una respuesta específica, usar la respuesta por defecto
        return responses['default'];
    }

    // Manejar el envío de mensajes
    function handleSendMessage() {
        const message = chatbotInput.value.trim();
        if (message === '') return;
        
        // Agregar mensaje del usuario
        addMessage(message, true);
        chatbotInput.value = '';
        
        // Simular tiempo de respuesta
        setTimeout(() => {
            const response = getResponse(message);
            addMessage(response);
        }, 800);
    }

    // Event listeners
    chatbotSendBtn.addEventListener('click', handleSendMessage);
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });

    // Mensaje de bienvenida inicial
    setTimeout(() => {
        addMessage('¡Hola! Soy tu asistente financiero. Puedo ayudarte con consejos sobre ahorro, presupuestos, inversiones y más. ¿En qué puedo ayudarte hoy?');
    }, 1000);
});
