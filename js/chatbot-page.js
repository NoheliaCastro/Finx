document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const chatMessages = document.getElementById('chatbotMessages');
    const chatInput = document.getElementById('chatbotInput');
    const sendButton = document.getElementById('chatbotSendBtn');
    const quickOptions = document.querySelectorAll('.quick-option');

    // Base de conocimiento del chatbot
    const knowledgeBase = {
        'hola': '¡Hola! Soy tu asistente financiero de Finx. ¿En qué puedo ayudarte hoy?',
        'cómo estás': '¡Estoy aquí para ayudarte con tus finanzas! ¿En qué puedo asistirte hoy?',
        'gracias': '¡De nada! Si tienes más preguntas, no dudes en preguntar.',
        'adiós': '¡Hasta luego! Recuerda que estoy aquí para ayudarte con tus finanzas.',
        'ayuda': 'Puedo ayudarte con:\n- Consejos de ahorro\n- Inversiones\n- Presupuestos\n- Créditos\n- Educación financiera\n¿Sobre qué tema te gustaría saber más?',
        
        // Ahorro
        'ahorrar': 'Para ahorrar dinero te recomiendo:\n1. Establece un presupuesto mensual\n2. Reduce gastos innecesarios\n3. Automatiza tus ahorros\n4. Establece metas de ahorro específicas\n5. Considera opciones de inversión',
        'tipos de ahorro': 'Existen varios tipos de ahorro:\n\n1. Ahorro de emergencia (3-6 meses de gastos)\n2. Ahorro para metas específicas (viajes, estudios, etc.)\n3. Ahorro para el retiro\n4. Ahorro para inversión\n\n¿Te gustaría más información sobre alguno en particular?',
        'cuánto ahorrar': 'Lo ideal es ahorrar al menos el 20% de tus ingresos. La regla 50/30/20 es un buen punto de partida:\n- 50% para necesidades básicas\n- 30% para deseos personales\n- 20% para ahorros e inversiones',
        
        // Inversiones
        'inversión': 'Antes de invertir considera:\n1. Tu perfil de riesgo (conservador, moderado, arriesgado)\n2. Tu horizonte de tiempo (corto, mediano o largo plazo)\n3. La diversificación de tus inversiones\n4. Asesorarte con un experto financiero',
        'tipos de inversión': 'Algunos tipos comunes de inversión son:\n\n1. Cuentas de ahorro de alto rendimiento\n2. Fondos mutuos\n3. Acciones\n4. Bonos\5. Bienes raíces\n6. Fondos indexados\n7. Criptomonedas (de alto riesgo)\n\n¿Te interesa saber más sobre alguno?',
        'invertir poco dinero': '¡Claro! Puedes empezar a invertir con poco dinero en:\n\n1. Fondos indexados con aportaciones mínimas bajas\n2. Aplicaciones de inversión con fracciones de acciones\n3. Cuentas de ahorro de alto rendimiento\n4. Fondos mutuos con inversión inicial baja\n\nLo importante es comenzar y ser constante.',
        
        // Presupuestos
        'presupuesto': 'Para crear un presupuesto efectivo:\n\n1. Registra todos tus ingresos\n2. Haz una lista de tus gastos fijos\n3. Identifica gastos variables\n4. Establece límites de gasto\n5. Haz un seguimiento mensual\n6. Ajusta según sea necesario\n\n¿Neitas ayuda para crear uno?',
        'controlar gastos': 'Para controlar mejor tus gastos:\n\n1. Registra todos tus gastos diarios\n2. Clasifica tus gastos (necesidades, deseos, ahorros)\n3. Usa aplicaciones de finanzas personales\n4. Establece límites de gasto por categoría\n5. Revisa tus suscripciones recurrentes\n6. Compara precios antes de comprar',
        
        // Créditos
        'crédito': 'Sobre créditos es importante saber que:\n\n1. Existen diferentes tipos (personales, hipotecarios, automotrices, etc.)\n2. La tasa de interés varía según tu historial crediticio\n3. Es importante comparar ofertas\n4. Debes considerar el CAT (Costo Anual Total)\n5. Un buen historial crediticio es valioso\n\n¿Qué tipo de crédito te interesa?',
        'mejorar historial crediticio': 'Para mejorar tu historial crediticio:\n\n1. Paga tus deudas a tiempo\n2. Mantén tus tarjetas de crédito por debajo del 30% de su límite\n3. No solicites muchos créditos en poco tiempo\n4. Revisa tu reporte crediticio regularmente\n5. Mantén cuentas antiguas abiertas (si no tienen costo)',
        
        // Educación financiera
        'educación financiera': 'La educación financiera es clave para tomar decisiones informadas sobre tu dinero. Cubre temas como:\n\n1. Presupuestos\n2. Ahorro\n3. Inversión\n4. Créditos y deudas\n5. Planificación del retiro\n\n¿Sobre cuál de estos temas te gustaría aprender más?',
        'consejos financieros': 'Algunos consejos financieros importantes:\n\n1. Gasta menos de lo que ganas\n2. Crea un fondo de emergencia\n3. Invierte en tu educación financiera\n4. Diversifica tus fuentes de ingreso\n5. Planea a largo plazo\n6. Evita las deudas de consumo\n7. Automatiza tus ahorros e inversiones',
        
        // Respuesta por defecto
        'default': 'Lo siento, no estoy seguro de entender tu pregunta. ¿Podrías reformularla? Estoy aquí para ayudarte con temas de finanzas personales, ahorro, inversiones, créditos y más.'
    };

    // Función para agregar un mensaje al chat
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Función para obtener la respuesta del chatbot
    function getResponse(userInput) {
        const input = userInput.toLowerCase();
        
        // Buscar coincidencias en la base de conocimiento
        for (const [key, value] of Object.entries(knowledgeBase)) {
            if (input.includes(key)) {
                return value;
            }
        }
        
        // Si no encuentra coincidencia, usar la respuesta por defecto
        return knowledgeBase['default'];
    }

    // Función para manejar el envío de mensajes
    function handleSendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Agregar mensaje del usuario
        addMessage(message, true);
        chatInput.value = '';
        
        // Simular tiempo de respuesta
        setTimeout(() => {
            const response = getResponse(message);
            addMessage(response);
        }, 500);
    }

    // Event Listeners
    sendButton.addEventListener('click', handleSendMessage);
    
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });
    
    // Opciones rápidas
    quickOptions.forEach(option => {
        option.addEventListener('click', function() {
            const text = this.textContent;
            chatInput.value = text;
            handleSendMessage();
        });
    });

    // Mensaje de bienvenida inicial
    setTimeout(() => {
        addMessage('¡Hola! Soy tu asistente financiero de Finx. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre ahorros, inversiones, presupuestos o cualquier otro tema financiero.');
    }, 1000);
});
