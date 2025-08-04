document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const chatMessages = document.getElementById('chatbotMessages');
    const chatInput = document.getElementById('chatbotInput');
    const sendButton = document.getElementById('chatbotSendBtn');
    const quickOptions = document.querySelectorAll('.quick-option');    // Base de conocimiento del chatbot en español e inglés
    const knowledgeBase = {
        es: {
            'hola': '¡Hola! Soy tu asistente financiero de Finx. ¿En qué puedo ayudarte hoy?',
            'hola!': '¡Hola! Soy tu asistente financiero de Finx. ¿En qué puedo ayudarte hoy?',
            'buenos días': '¡Buenos días! Soy tu asistente financiero de Finx. ¿En qué puedo ayudarte hoy?',
            'buenas tardes': '¡Buenas tardes! Soy tu asistente financiero de Finx. ¿En qué puedo ayudarte hoy?',
            'buenas noches': '¡Buenas noches! Soy tu asistente financiero de Finx. ¿En qué puedo ayudarte hoy?',
            'cómo estás': '¡Estoy aquí para ayudarte con tus finanzas! ¿En qué puedo asistirte hoy?',
            'gracias': '¡De nada! Si tienes más preguntas, no dudes en preguntar.',
            'muchas gracias': '¡De nada! Si tienes más preguntas, no dudes en preguntar.',
            'adiós': '¡Hasta luego! Recuerda que estoy aquí para ayudarte con tus finanzas.',
            'chao': '¡Hasta luego! Recuerda que estoy aquí para ayudarte con tus finanzas.',
            'nos vemos': '¡Hasta luego! Recuerda que estoy aquí para ayudarte con tus finanzas.',
            'ayuda': 'Puedo ayudarte con:\n- Consejos de ahorro\n- Inversiones\n- Presupuestos\n- Créditos\n- Educación financiera\n¿Sobre qué tema te gustaría saber más?',
            'help': 'Puedo ayudarte con:\n- Consejos de ahorro\n- Inversiones\n- Presupuestos\n- Créditos\n- Educación financiera\n¿Sobre qué tema te gustaría saber más?',
            
            // Ahorro
            'ahorrar': 'Para ahorrar dinero te recomiendo:\n1. Establece un presupuesto mensual\n2. Reduce gastos innecesarios\n3. Automatiza tus ahorros\n4. Establece metas de ahorro específicas\n5. Considera opciones de inversión',
            'ahorro': 'Para ahorrar dinero te recomiendo:\n1. Establece un presupuesto mensual\n2. Reduce gastos innecesarios\n3. Automatiza tus ahorros\n4. Establece metas de ahorro específicas\n5. Considera opciones de inversión',
            'cómo ahorrar': 'Para ahorrar dinero te recomiendo:\n1. Establece un presupuesto mensual\n2. Reduce gastos innecesarios\n3. Automatiza tus ahorros\n4. Establece metas de ahorro específicas\n5. Considera opciones de inversión',
            'cómo ahorrar dinero': 'Para ahorrar dinero te recomiendo:\n1. Establece un presupuesto mensual\n2. Reduce gastos innecesarios\n3. Automatiza tus ahorros\n4. Establece metas de ahorro específicas\n5. Considera opciones de inversión',
            'tipos de ahorro': 'Existen varios tipos de ahorro:\n\n1. Ahorro de emergencia (3-6 meses de gastos)\n2. Ahorro para metas específicas (viajes, estudios, etc.)\n3. Ahorro para el retiro\n4. Ahorro para inversión\n\n¿Te gustaría más información sobre alguno en particular?',
            'cuánto ahorrar': 'Lo ideal es ahorrar al menos el 20% de tus ingresos. La regla 50/30/20 es un buen punto de partida:\n- 50% para necesidades básicas\n- 30% para deseos personales\n- 20% para ahorros e inversiones',
            
            // Inversiones
            'inversión': 'Antes de invertir considera:\n1. Tu perfil de riesgo (conservador, moderado, arriesgado)\n2. Tu horizonte de tiempo (corto, mediano o largo plazo)\n3. La diversificación de tus inversiones\n4. Asesorarte con un experto financiero',
            'invertir': 'Antes de invertir considera:\n1. Tu perfil de riesgo (conservador, moderado, arriesgado)\n2. Tu horizonte de tiempo (corto, mediano o largo plazo)\n3. La diversificación de tus inversiones\n4. Asesorarte con un experto financiero',
            'inversiones': 'Antes de invertir considera:\n1. Tu perfil de riesgo (conservador, moderado, arriesgado)\n2. Tu horizonte de tiempo (corto, mediano o largo plazo)\n3. La diversificación de tus inversiones\n4. Asesorarte con un experto financiero',
            'consejos de inversión': 'Antes de invertir considera:\n1. Tu perfil de riesgo (conservador, moderado, arriesgado)\n2. Tu horizonte de tiempo (corto, mediano o largo plazo)\n3. La diversificación de tus inversiones\n4. Asesorarte con un experto financiero',
            'tipos de inversión': 'Algunos tipos comunes de inversión son:\n\n1. Cuentas de ahorro de alto rendimiento\n2. Fondos mutuos\n3. Acciones\n4. Bonos\n5. Bienes raíces\n6. Fondos indexados\n7. Criptomonedas (de alto riesgo)\n\n¿Te interesa saber más sobre alguno?',
            'invertir poco dinero': '¡Claro! Puedes empezar a invertir con poco dinero en:\n\n1. Fondos indexados con aportaciones mínimas bajas\n2. Aplicaciones de inversión con fracciones de acciones\n3. Cuentas de ahorro de alto rendimiento\n4. Fondos mutuos con inversión inicial baja\n\nLo importante es comenzar y ser constante.',
            
            // Presupuestos
            'presupuesto': 'Para crear un presupuesto efectivo:\n\n1. Registra todos tus ingresos\n2. Haz una lista de tus gastos fijos\n3. Identifica gastos variables\n4. Establece límites de gasto\n5. Haz un seguimiento mensual\n6. Ajusta según sea necesario\n\n¿Necesitas ayuda para crear uno?',
            'qué es un presupuesto': 'Un presupuesto es un plan detallado que te ayuda a:\n\n- Controlar tus ingresos y gastos\n- Alcanzar tus metas financieras\n- Evitar gastos innecesarios\n- Planificar para el futuro\n\n¿Te ayudo a crear uno?',
            'controlar gastos': 'Para controlar mejor tus gastos:\n\n1. Registra todos tus gastos diarios\n2. Clasifica tus gastos (necesidades, deseos, ahorros)\n3. Usa aplicaciones de finanzas personales\n4. Establece límites de gasto por categoría\n5. Revisa tus suscripciones recurrentes\n6. Compara precios antes de comprar',
            
            // Créditos
            'crédito': 'Sobre créditos es importante saber que:\n\n1. Existen diferentes tipos (personales, hipotecarios, automotrices, etc.)\n2. La tasa de interés varía según tu historial crediticio\n3. Es importante comparar ofertas\n4. Debes considerar el CAT (Costo Anual Total)\n5. Un buen historial crediticio es valioso\n\n¿Qué tipo de crédito te interesa?',
            'créditos': 'Sobre créditos es importante saber que:\n\n1. Existen diferentes tipos (personales, hipotecarios, automotrices, etc.)\n2. La tasa de interés varía según tu historial crediticio\n3. Es importante comparar ofertas\n4. Debes considerar el CAT (Costo Anual Total)\n5. Un buen historial crediticio es valioso\n\n¿Qué tipo de crédito te interesa?',
            'mejorar historial crediticio': 'Para mejorar tu historial crediticio:\n\n1. Paga tus deudas a tiempo\n2. Mantén tus tarjetas de crédito por debajo del 30% de su límite\n3. No solicites muchos créditos en poco tiempo\n4. Revisa tu reporte crediticio regularmente\n5. Mantén cuentas antiguas abiertas (si no tienen costo)',
            
            // Educación financiera
            'educación financiera': 'La educación financiera es clave para tomar decisiones informadas sobre tu dinero. Cubre temas como:\n\n1. Presupuestos\n2. Ahorro\n3. Inversión\n4. Créditos y deudas\n5. Planificación del retiro\n\n¿Sobre cuál de estos temas te gustaría aprender más?',
            'consejos financieros': 'Algunos consejos financieros importantes:\n\n1. Gasta menos de lo que ganas\n2. Crea un fondo de emergencia\n3. Invierte en tu educación financiera\n4. Diversifica tus fuentes de ingreso\n5. Planea a largo plazo\n6. Evita las deudas de consumo\n7. Automatiza tus ahorros e inversiones',
            
            // Respuesta por defecto
            'default': 'Lo siento, no estoy seguro de entender tu pregunta. ¿Podrías reformularla? Estoy aquí para ayudarte con temas de finanzas personales, ahorro, inversiones, créditos y más.',
            'welcome': '¡Hola! Soy tu asistente financiero de Finx. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre ahorros, inversiones, presupuestos o cualquier otro tema financiero.'
        },        en: {
            'hello': 'Hello! I\'m your Finx financial assistant. How can I help you today?',
            'hi': 'Hi! I\'m your Finx financial assistant. How can I help you today?',
            'good morning': 'Good morning! I\'m your Finx financial assistant. How can I help you today?',
            'good afternoon': 'Good afternoon! I\'m your Finx financial assistant. How can I help you today?',
            'good evening': 'Good evening! I\'m your Finx financial assistant. How can I help you today?',
            'how are you': 'I\'m here to help you with your finances! How can I assist you today?',
            'thanks': 'You\'re welcome! If you have more questions, don\'t hesitate to ask.',
            'thank you': 'You\'re welcome! If you have more questions, don\'t hesitate to ask.',
            'goodbye': 'See you later! Remember I\'m here to help you with your finances.',
            'bye': 'See you later! Remember I\'m here to help you with your finances.',
            'see you': 'See you later! Remember I\'m here to help you with your finances.',
            'help': 'I can help you with:\n- Savings advice\n- Investments\n- Budgets\n- Credits\n- Financial education\nWhat topic would you like to know more about?',
            'ayuda': 'I can help you with:\n- Savings advice\n- Investments\n- Budgets\n- Credits\n- Financial education\nWhat topic would you like to know more about?',
            
            // Savings
            'save': 'To save money I recommend:\n1. Set a monthly budget\n2. Reduce unnecessary expenses\n3. Automate your savings\n4. Set specific savings goals\n5. Consider investment options',
            'saving': 'To save money I recommend:\n1. Set a monthly budget\n2. Reduce unnecessary expenses\n3. Automate your savings\n4. Set specific savings goals\n5. Consider investment options',
            'how to save': 'To save money I recommend:\n1. Set a monthly budget\n2. Reduce unnecessary expenses\n3. Automate your savings\n4. Set specific savings goals\n5. Consider investment options',
            'how to save money': 'To save money I recommend:\n1. Set a monthly budget\n2. Reduce unnecessary expenses\n3. Automate your savings\n4. Set specific savings goals\n5. Consider investment options',
            'savings types': 'There are several types of savings:\n\n1. Emergency fund (3-6 months of expenses)\n2. Savings for specific goals (trips, studies, etc.)\n3. Retirement savings\n4. Investment savings\n\nWould you like more information about any particular one?',
            'types of savings': 'There are several types of savings:\n\n1. Emergency fund (3-6 months of expenses)\n2. Savings for specific goals (trips, studies, etc.)\n3. Retirement savings\n4. Investment savings\n\nWould you like more information about any particular one?',
            'how much to save': 'Ideally you should save at least 20% of your income. The 50/30/20 rule is a good starting point:\n- 50% for basic needs\n- 30% for personal wants\n- 20% for savings and investments',
            
            // Investments
            'investment': 'Before investing consider:\n1. Your risk profile (conservative, moderate, aggressive)\n2. Your time horizon (short, medium or long term)\n3. Diversification of your investments\n4. Getting advice from a financial expert',
            'invest': 'Before investing consider:\n1. Your risk profile (conservative, moderate, aggressive)\n2. Your time horizon (short, medium or long term)\n3. Diversification of your investments\n4. Getting advice from a financial expert',
            'investments': 'Before investing consider:\n1. Your risk profile (conservative, moderate, aggressive)\n2. Your time horizon (short, medium or long term)\n3. Diversification of your investments\n4. Getting advice from a financial expert',
            'investment tips': 'Before investing consider:\n1. Your risk profile (conservative, moderate, aggressive)\n2. Your time horizon (short, medium or long term)\n3. Diversification of your investments\n4. Getting advice from a financial expert',
            'investment types': 'Some common types of investment are:\n\n1. High-yield savings accounts\n2. Mutual funds\n3. Stocks\n4. Bonds\n5. Real estate\n6. Index funds\n7. Cryptocurrencies (high risk)\n\nAre you interested in learning more about any of these?',
            'types of investment': 'Some common types of investment are:\n\n1. High-yield savings accounts\n2. Mutual funds\n3. Stocks\n4. Bonds\n5. Real estate\n6. Index funds\n7. Cryptocurrencies (high risk)\n\nAre you interested in learning more about any of these?',
            'invest little money': 'Sure! You can start investing with little money in:\n\n1. Index funds with low minimum contributions\n2. Investment apps with fractional shares\n3. High-yield savings accounts\n4. Mutual funds with low initial investment\n\nThe important thing is to start and be consistent.',
            
            // Budgets
            'budget': 'To create an effective budget:\n\n1. Record all your income\n2. Make a list of your fixed expenses\n3. Identify variable expenses\n4. Set spending limits\n5. Track monthly\n6. Adjust as needed\n\nDo you need help creating one?',
            'what is a budget': 'A budget is a detailed plan that helps you:\n\n- Control your income and expenses\n- Reach your financial goals\n- Avoid unnecessary expenses\n- Plan for the future\n\nShould I help you create one?',
            'control expenses': 'To better control your expenses:\n\n1. Record all your daily expenses\n2. Classify your expenses (needs, wants, savings)\n3. Use personal finance apps\n4. Set spending limits by category\n5. Review your recurring subscriptions\n6. Compare prices before buying',
            
            // Credits
            'credit': 'About credits it\'s important to know that:\n\n1. There are different types (personal, mortgage, automotive, etc.)\n2. Interest rate varies according to your credit history\n3. It\'s important to compare offers\n4. You should consider the APR (Annual Percentage Rate)\n5. A good credit history is valuable\n\nWhat type of credit interests you?',
            'credits': 'About credits it\'s important to know that:\n\n1. There are different types (personal, mortgage, automotive, etc.)\n2. Interest rate varies according to your credit history\n3. It\'s important to compare offers\n4. You should consider the APR (Annual Percentage Rate)\n5. A good credit history is valuable\n\nWhat type of credit interests you?',
            'improve credit history': 'To improve your credit history:\n\n1. Pay your debts on time\n2. Keep your credit cards below 30% of their limit\n3. Don\'t apply for many credits in a short time\n4. Check your credit report regularly\n5. Keep old accounts open (if they have no cost)',
            
            // Financial education
            'financial education': 'Financial education is key to making informed decisions about your money. It covers topics like:\n\n1. Budgets\n2. Savings\n3. Investment\n4. Credits and debts\n5. Retirement planning\n\nWhich of these topics would you like to learn more about?',
            'financial advice': 'Some important financial tips:\n\n1. Spend less than you earn\n2. Create an emergency fund\n3. Invest in your financial education\n4. Diversify your income sources\n5. Plan long term\n6. Avoid consumer debt\n7. Automate your savings and investments',
            
            // Default response
            'default': 'Sorry, I\'m not sure I understand your question. Could you rephrase it? I\'m here to help you with personal finance topics, savings, investments, credits and more.',
            'welcome': 'Hello! I\'m your Finx financial assistant. How can I help you today? You can ask me about savings, investments, budgets or any other financial topic.'
        }
    };    // Traducciones para elementos de la UI
    const uiTranslations = {
        es: {
            'financial-assistant': 'Asistente Financiero',
            'assistant-description': 'Pregúntame sobre finanzas personales, ahorros, inversiones y más',
            'input-placeholder': 'Escribe tu pregunta financiera...',
            'how-to-save': '¿Cómo ahorrar dinero?',
            'investment-tips': 'Consejos de inversión',
            'what-is-budget': '¿Qué es un presupuesto?',
            'savings-types': 'Tipos de ahorro'
        },
        en: {
            'financial-assistant': 'Financial Assistant',
            'assistant-description': 'Ask me about personal finance, savings, investments and more',
            'input-placeholder': 'Type your financial question...',
            'how-to-save': 'How to save money?',
            'investment-tips': 'Investment tips',
            'what-is-budget': 'What is a budget?',
            'savings-types': 'Types of savings'
        }
    };

    // Función para obtener el idioma actual
    function getCurrentLanguage() {
        return localStorage.getItem('finx_lang') || 'es';
    }    // Función para traducir la interfaz del chatbot
    function translateChatbotUI(lang) {
        const translations = uiTranslations[lang];
        
        // Traducir título principal
        const titleElement = document.querySelector('h2');
        if (titleElement) {
            titleElement.innerHTML = `<i class="bi bi-robot me-2"></i>${translations['financial-assistant']}`;
        }
        
        // Traducir descripción
        const descriptionElement = document.querySelector('.text-muted');
        if (descriptionElement) {
            descriptionElement.textContent = translations['assistant-description'];
        }
        
        // Traducir placeholder del input
        if (chatInput) {
            chatInput.placeholder = translations['input-placeholder'];
        }
          // Traducir botón de enviar (solo ícono, sin texto)
        const sendButtonText = document.querySelector('#chatbotSendBtn');
        if (sendButtonText) {
            sendButtonText.innerHTML = `<i class="bi bi-send-fill"></i>`;
        }
        
        // Traducir opciones rápidas
        const quickOptionButtons = document.querySelectorAll('.quick-option');
        const quickOptionTexts = [
            translations['how-to-save'],
            translations['investment-tips'],
            translations['what-is-budget'],
            translations['savings-types']
        ];
        
        quickOptionButtons.forEach((button, index) => {
            if (quickOptionTexts[index]) {
                button.textContent = quickOptionTexts[index];
            }
        });
    }

    // Función para limpiar el chat y mostrar mensaje de bienvenida
    function resetChatWithLanguage(lang) {
        chatMessages.innerHTML = '';
        const knowledge = knowledgeBase[lang];
        setTimeout(() => {
            addMessage(knowledge['welcome']);
        }, 500);
    }    // Función para agregar un mensaje al chat
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        // Agregar animación de aparición
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        messageDiv.textContent = text;
        
        chatMessages.appendChild(messageDiv);
        
        // Animar la aparición del mensaje
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 50);
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }// Función para obtener la respuesta del chatbot
    function getResponse(userInput) {
        const input = userInput.toLowerCase().trim();
        const currentLang = getCurrentLanguage();
        const knowledge = knowledgeBase[currentLang];
        
        // Buscar coincidencias exactas primero
        if (knowledge[input]) {
            return knowledge[input];
        }
        
        // Buscar coincidencias parciales - ordenadas por relevancia
        const matches = [];
        for (const [key, value] of Object.entries(knowledge)) {
            if (key !== 'default' && key !== 'welcome') {
                if (input.includes(key)) {
                    matches.push({ key, value, length: key.length });
                }
            }
        }
        
        // Si hay coincidencias, devolver la más específica (más larga)
        if (matches.length > 0) {
            matches.sort((a, b) => b.length - a.length);
            return matches[0].value;
        }
        
        // Si no encuentra coincidencia, usar la respuesta por defecto
        return knowledge['default'];
    }    // Función para mostrar indicador de "escribiendo"
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = '<span>●</span><span>●</span><span>●</span>';
        
        // Agregar estilos CSS para la animación
        const style = document.createElement('style');
        style.textContent = `
            .typing-indicator span {
                animation: typing 1.4s infinite;
                opacity: 0.4;
            }
            .typing-indicator span:nth-child(2) {
                animation-delay: 0.2s;
            }
            .typing-indicator span:nth-child(3) {
                animation-delay: 0.4s;
            }
            @keyframes typing {
                0%, 60%, 100% { opacity: 0.4; }
                30% { opacity: 1; }
            }
        `;
        if (!document.getElementById('typing-styles')) {
            style.id = 'typing-styles';
            document.head.appendChild(style);
        }
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Función para remover indicador de "escribiendo"
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Función para manejar el envío de mensajes
    function handleSendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Agregar mensaje del usuario
        addMessage(message, true);
        chatInput.value = '';
        
        // Mostrar indicador de escritura
        showTypingIndicator();
        
        // Simular tiempo de respuesta
        setTimeout(() => {
            removeTypingIndicator();
            const response = getResponse(message);
            addMessage(response);
        }, 800 + Math.random() * 1000); // Tiempo variable entre 0.8-1.8 segundos
    }

    // Event Listeners
    if (sendButton) {
        sendButton.addEventListener('click', handleSendMessage);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSendMessage();
            }
        });
    }
    
    // Opciones rápidas
    quickOptions.forEach(option => {
        option.addEventListener('click', function() {
            const text = this.textContent;
            chatInput.value = text;
            handleSendMessage();
        });
    });

    // Función para manejar cambio de idioma
    function handleLanguageChange() {
        const currentLang = getCurrentLanguage();
        translateChatbotUI(currentLang);
        resetChatWithLanguage(currentLang);
    }

    // Inicializar con el idioma actual
    const initialLang = getCurrentLanguage();
    translateChatbotUI(initialLang);

    // Mensaje de bienvenida inicial
    setTimeout(() => {
        const knowledge = knowledgeBase[initialLang];
        addMessage(knowledge['welcome']);
    }, 1000);

    // Exponer la función para uso global
    window.handleChatbotLanguageChange = handleLanguageChange;
});
