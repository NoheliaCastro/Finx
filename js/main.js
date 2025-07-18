// Navbar Scroll Effect
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class based on scroll position
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar based on scroll direction
        if (currentScroll > lastScroll && currentScroll > navbar.offsetHeight) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });

    // Inicializar el carrusel
    const heroCarousel = new bootstrap.Carousel(document.getElementById('heroCarousel'), {
        interval: 3000, // Cambia cada 3 segundos
        wrap: true, // Vuelve al principio después de la última imagen
        keyboard: true, // Permite navegación con teclado
        pause: 'hover' // Pausa al pasar el mouse por encima
    });

    // Miniaturas circulares: navegación y animación de clase activa
    const thumbs = document.querySelectorAll('.carousel-thumb');
    thumbs.forEach(thumb => {
        thumb.addEventListener('click', function() {
            const slideTo = parseInt(this.getAttribute('data-slide-to'));
            heroCarousel.to(slideTo);
        });
    });
    // Sincronizar la clase 'active' en las miniaturas
    document.getElementById('heroCarousel').addEventListener('slid.bs.carousel', function(e) {
        thumbs.forEach((thumb, idx) => {
            thumb.classList.toggle('active', idx === e.to);
        });
    });

    // Animación aleatoria de los círculos
    function randomizeThumbs() {
        const container = document.querySelector('.hero-image-container');
        const w = container.offsetWidth;
        const h = container.offsetHeight;
        const thumbSizes = [60, 80, 45];
        thumbs.forEach((thumb, i) => {
            // Permitir que salgan parcialmente fuera del carrusel
            const size = thumbSizes[i];
            const maxLeft = w - size/2;
            const minLeft = -size/2;
            const maxTop = h - size/2;
            const minTop = -size/2;
            thumb.style.position = 'absolute';
            thumb.style.width = size + 'px';
            thumb.style.height = size + 'px';
            const left = Math.random() * (maxLeft - minLeft) + minLeft;
            const top = Math.random() * (maxTop - minTop) + minTop;
            thumb.style.left = left + 'px';
            thumb.style.top = top + 'px';
        });
    }
    setInterval(randomizeThumbs, 2500);
    randomizeThumbs();

    // --- Chatbot Widget Logic ---
    const toggleBtn = document.getElementById('chatbot-toggle');
    const chatWindow = document.getElementById('chatbot-window');
    const closeBtn = document.getElementById('chatbot-close');
    const form = document.getElementById('chatbot-form');
    const input = document.getElementById('chatbot-input');
    const messages = document.getElementById('chatbot-messages');

    function appendMessage(text, sender = 'bot') {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chatbot-message ' + sender;
        const bubble = document.createElement('div');
        bubble.className = 'chatbot-bubble';
        bubble.textContent = text;
        msgDiv.appendChild(bubble);
        messages.appendChild(msgDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    // FAQ respuestas automáticas mejoradas
    function getBotResponse(userMsg) {
        const msg = userMsg.toLowerCase();
        // Variantes y errores comunes para "Finx"
        const finxVariants = ["finx", "fix", "finks", "fink", "fincs", "fincs", "finnx"];
        // Variantes para "qué es" y "para qué sirve"
        if ((finxVariants.some(v => msg.includes(v)) && (msg.includes("que es") || msg.includes("qué es") || msg.includes("para que sirve") || msg.includes("para qué sirve") || msg.includes("funciona") || msg.includes("sirve"))) || msg.match(/que es fix|qué es fix|para que sirve fix|para qué sirve fix/)) {
            return 'FINX es tu guía financiera personal. Te ayuda a rastrear, gestionar y ahorrar tu dinero de manera sencilla, visual y práctica. Nuestra misión es empoderar a las personas, especialmente jóvenes, para que tomen el control de sus finanzas.';
        }
        // Misión y visión (incluye errores comunes)
        if (msg.includes('mision') || msg.includes('misión') || msg.includes('vision') || msg.includes('visión') || msg.includes('kisoon') || msg.includes('micion')) {
            return 'Nuestra misión es ayudar a las personas, especialmente jóvenes, a entender y gestionar su dinero con herramientas fáciles, visuales y prácticas. Nuestra visión es ser el sitio financiero líder para jóvenes en Latinoamérica.';
        }
        // Registro y uso
        if (msg.includes('registr') || msg.includes('crear cuenta') || msg.includes('sign up') || msg.includes('como me registro') || msg.includes('cómo me registro')) {
            return 'Para registrarte en FINX, haz clic en el botón "Login" arriba a la derecha y luego en "Sign Up". Ingresa tu nombre, correo y contraseña para crear tu cuenta.';
        }
        // Seguridad
        if (msg.includes('seguro') || msg.includes('protege') || msg.includes('privacidad') || msg.includes('es confiable') || msg.includes('es seguro')) {
            return '¡Sí! Tu información y tu dinero están protegidos en FINX. Nos tomamos la seguridad muy en serio para que puedas usar la plataforma con confianza.';
        }
        // Diferencias y ventajas
        if (msg.includes('diferente') || msg.includes('qué lo hace único') || msg.includes('por qué finx') || msg.includes('ventaja') || msg.includes('por que elegir')) {
            return 'FINX no solo muestra tus gastos, sino que te enseña a gestionar tu dinero, te guía hacia tus metas y te apoya incluso si nunca has aprendido sobre finanzas personales. Además, incluye aprendizaje interactivo y un chatbot inteligente.';
        }
        // Herramientas y funcionalidades
        if (msg.includes('herramienta') || msg.includes('qué puedo hacer') || msg.includes('qué ofrece') || msg.includes('funcionalidad') || msg.includes('para que sirve finx')) {
            return 'Con FINX puedes registrar ingresos, gastos, establecer metas y hacer seguimiento de tu progreso financiero. Todo desde una interfaz intuitiva y amigable para móviles.';
        }
        // Educación financiera
        if (msg.includes('educación') || msg.includes('aprender') || msg.includes('enseña') || msg.includes('aprender finanzas')) {
            return 'FINX utiliza quizzes, retos y cursos cortos para que aprender sobre finanzas sea divertido y práctico. Queremos que realmente comprendas los conceptos financieros.';
        }
        // Chatbot y ayuda
        if (msg.includes('chatbot') || msg.includes('asistente') || msg.includes('ayuda') || msg.includes('soporte')) {
            return '¡Sí! FINX incluye un chatbot inteligente que responde tus preguntas, te guía y personaliza tu aprendizaje financiero. Siempre disponible para ayudarte.';
        }
        // Comparación con otras apps
        if (msg.includes('app') || msg.includes('aplicación') || msg.includes('comparar') || msg.includes('diferencia con otras')) {
            return 'A diferencia de otras apps, FINX te enseña a gestionar tu dinero, te guía hacia tus metas y te apoya incluso si nunca has aprendido sobre finanzas personales.';
        }
        // Cómo empezar
        if (msg.includes('empezar') || msg.includes('cómo inicio') || msg.includes('como inicio') || msg.includes('cómo usar') || msg.includes('como usar')) {
            return 'Para empezar, regístrate en FINX, ingresa tus ingresos y gastos, y comienza a explorar nuestras herramientas y recursos educativos.';
        }
        // Ejemplo de uso
        if (msg.includes('ejemplo') || msg.includes('como lo uso') || msg.includes('cómo lo uso')) {
            return 'Por ejemplo, si quieres ahorrar para un celular, puedes registrar tus ingresos, gastos y metas en FINX. Así verás tu progreso y recibirás sugerencias para mejorar tu planificación.';
        }
        // Agradecimientos
        if (msg.includes('gracias') || msg.includes('ok') || msg.includes('listo') || msg.includes('perfecto') || msg.includes('super')) {
            return '¡De nada! Si tienes más preguntas sobre FINX, aquí estoy para ayudarte.';
        }
        // Saludo
        if (msg.includes('hola') || msg.includes('buenas') || msg.includes('saludos')) {
            return '¡Hola! Soy el asistente de Finx. ¿En qué puedo ayudarte hoy?';
        }
        return '¡Gracias por tu interés en FINX! Pregúntame cualquier cosa sobre la plataforma, su misión, herramientas o cómo empezar.';
    }

    // Mensaje de bienvenida
    appendMessage('¡Hola! Soy el asistente de Finx. ¿En qué puedo ayudarte hoy?', 'bot');

    toggleBtn.addEventListener('click', () => {
        if (chatWindow.classList.contains('open')) {
            chatWindow.classList.remove('open');
            setTimeout(() => { chatWindow.style.display = 'none'; }, 350);
        } else {
            chatWindow.style.display = 'flex';
            setTimeout(() => { chatWindow.classList.add('open'); }, 10);
        }
    });
    closeBtn.addEventListener('click', () => {
        chatWindow.classList.remove('open');
        setTimeout(() => { chatWindow.style.display = 'none'; }, 350);
    });
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const userMsg = input.value.trim();
        if (!userMsg) return;
        appendMessage(userMsg, 'user');
        input.value = '';
        setTimeout(() => {
            appendMessage(getBotResponse(userMsg), 'bot');
        }, 700);
    });
    // --- Fin Chatbot Widget Logic ---
}); 