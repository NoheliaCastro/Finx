document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const chatbot = document.getElementById('finx-chatbot');
    const toggleBtn = document.getElementById('chatbot-toggle');
    const closeBtn = document.getElementById('close-chatbot');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-message');
    const quickOptions = document.querySelectorAll('.quick-option');

    // Mostrar/ocultar el chatbot
    toggleBtn.addEventListener('click', () => {
        chatbot.classList.toggle('active');
        toggleBtn.style.display = 'none';
    });

    closeBtn.addEventListener('click', () => {
        chatbot.classList.remove('active');
        setTimeout(() => {
            toggleBtn.style.display = 'flex';
        }, 300);
    });

    // Función para agregar un mensaje al chat
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = message;
        
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Función para manejar las respuestas del chatbot
    function handleBotResponse(userMessage) {
        // Convertir el mensaje a minúsculas para facilitar la comparación
        const message = userMessage.toLowerCase().trim();
        let response = '';

        // Lógica de respuestas basada en palabras clave
        if (message.includes('hola') || message.includes('buenos días') || message.includes('buenas tardes')) {
            response = '¡Hola! Soy tu asistente financiero de Finx. ¿En qué puedo ayudarte hoy?';
        } 
        else if (message.includes('ahorrar') || message.includes('ahorro')) {
            response = 'Para ahorrar dinero, te recomiendo:\n' +
                      '1. Establece un presupuesto mensual\n' +
                      '2. Reduce gastos innecesarios\n' +
                      '3. Automatiza tus ahorros\n' +
                      '4. Considera opciones de inversión seguras\n' +
                      '¿Te gustaría más detalles sobre alguna de estas estrategias?';
        }
        else if (message.includes('inversión') || message.includes('invertir')) {
            response = 'Para comenzar a invertir, considera estos puntos:\n' +
                      '1. Define tus objetivos financieros\n' +
                      '2. Evalúa tu perfil de riesgo\n' +
                      '3. Diversifica tus inversiones\n' +
                      '4. Considera fondos indexados o ETFs\n' +
                      '¿Te gustaría información más específica sobre algún tipo de inversión?';
        }
        else if (message.includes('presupuesto') || message.includes('gastos')) {
            response = 'Para crear un presupuesto efectivo:\n' +
                      '1. Registra todos tus ingresos\n' +
                      '2. Clasifica tus gastos (fijos y variables)\n' +
                      '3. Establece límites de gasto\n' +
                      '4. Haz un seguimiento mensual\n' +
                      '¿Neitas ayuda para crear un presupuesto personalizado?';
        }
        else if (message.includes('deuda') || message.includes('deudas')) {
            response = 'Para manejar tus deudas de manera efectiva:\n' +
                      '1. Haz una lista de todas tus deudas\n' +
                      '2. Prioriza las deudas con mayor tasa de interés\n' +
                      '3. Considera la consolidación de deudas\n' +
                      '4. Evita adquirir nuevas deudas\n' +
                      '¿Quieres que te ayude a crear un plan de pago?';
        }
        else {
            // Respuesta por defecto si no se reconoce la consulta
            response = 'Entiendo que quieres información sobre: ' + userInput.value + '\n' +
                      'Actualmente estoy aprendiendo para darte respuestas más precisas. ' +
                      'Mientras tanto, ¿puedo ayudarte con algo más? Por ejemplo:\n' +
                      '- Consejos de ahorro\n' +
                      '- Información sobre inversiones\n' +
                      '- Cómo hacer un presupuesto\n' +
                      '- Manejo de deudas';
        }

        // Simular tiempo de respuesta
        setTimeout(() => {
            addMessage(response);
        }, 800);
    }

    // Manejar el envío de mensajes
    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        // Agregar mensaje del usuario
        addMessage(message, true);
        userInput.value = '';

        // Procesar respuesta del bot
        handleBotResponse(message);
    }

    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Manejar opciones rápidas
    quickOptions.forEach(option => {
        option.addEventListener('click', () => {
            const message = option.textContent;
            addMessage(message, true);
            handleBotResponse(message);
        });
    });

    // Mensaje de bienvenida automático
    setTimeout(() => {
        addMessage('¡Hola! Soy tu asistente financiero de Finx. ¿En qué puedo ayudarte hoy?');
    }, 1000);
});
