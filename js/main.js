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
    const quickQuestions = document.getElementById('chatbot-quick-questions');
    const backdrop = document.getElementById('chatbot-backdrop');

    let userIsAtBottom = true;

    // Scroll helper
    function scrollToBottom(force = false) {
        if (force || userIsAtBottom) {
            messages.scrollTop = messages.scrollHeight;
        }
    }
    // Detect if user is at bottom
    messages.addEventListener('scroll', function() {
        const threshold = 30; // px
        userIsAtBottom = messages.scrollHeight - messages.scrollTop - messages.clientHeight < threshold;
    });

    // Mensajes y preguntas rápidas en inglés
    const quickFlows = {
        start: [
            {q: 'What is Finx?', next: 'finx'},
            {q: 'What is it for?', next: 'service'},
            {q: 'Is it safe?', next: 'security'}
        ],
        finx: [
            {q: 'How do I sign up?', next: 'register'},
            {q: 'What features does it have?', next: 'features'},
            {q: 'What is the mission?', next: 'mission'}
        ],
        service: [
            {q: 'How do I sign up?', next: 'register'},
            {q: 'What features does it have?', next: 'features'},
            {q: 'Is Finx free?', next: 'free'}
        ],
        security: [
            {q: 'How is my data protected?', next: 'protection'},
            {q: 'Can I trust Finx?', next: 'trust'},
            {q: 'How do I sign up?', next: 'register'}
        ],
        register: [
            {q: 'Go to sign up', next: 'link', link: 'register.html'},
            {q: 'What info do I need?', next: 'info'},
            {q: 'Is sign up free?', next: 'free'}
        ],
        features: [
            {q: 'Can I set savings goals?', next: 'goals'},
            {q: 'Does it have financial education?', next: 'education'},
            {q: 'How does tracking work?', next: 'tracking'}
        ],
        mission: [
            {q: 'What is the vision?', next: 'vision'},
            {q: 'How do you help young people?', next: 'help_youth'},
            {q: 'Who created Finx?', next: 'creator'}
        ],
        link: [],
        fallback: []
    };
    let currentFlow = 'start';

    function renderQuickQuestions(flow = 'start') {
        quickQuestions.innerHTML = '';
        (quickFlows[flow] || quickFlows['fallback']).forEach(btn => {
            const b = document.createElement('button');
            b.className = 'chatbot-quick-btn';
            b.textContent = btn.q;
            if (btn.link) {
                b.onclick = () => window.location.href = btn.link;
            } else {
                b.onclick = () => {
                    input.value = btn.q;
                    form.dispatchEvent(new Event('submit'));
                    currentFlow = btn.next;
                };
            }
            quickQuestions.appendChild(b);
        });
    }

    function appendMessage(text, sender = 'bot') {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chatbot-message ' + sender;
        // Crear avatar
        const avatar = document.createElement('div');
        avatar.className = 'chatbot-avatar';
        if (sender === 'user') {
            avatar.innerHTML = '<i class="fas fa-user"></i>';
        } else {
            avatar.innerHTML = '<i class="fas fa-robot"></i>';
        }
        // Crear burbuja
        const bubble = document.createElement('div');
        bubble.className = 'chatbot-bubble';
        bubble.textContent = text;
        // Crear hora
        const time = document.createElement('span');
        time.className = 'chatbot-time';
        const now = new Date();
        time.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        // Estructura: avatar + burbuja + hora
        if (sender === 'user') {
            msgDiv.appendChild(time);
            msgDiv.appendChild(bubble);
            msgDiv.appendChild(avatar);
        } else {
            msgDiv.appendChild(avatar);
            msgDiv.appendChild(bubble);
            msgDiv.appendChild(time);
        }
        messages.appendChild(msgDiv);
        scrollToBottom(sender === 'user');
    }

    // Animación de escribiendo...
    function showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-message bot chatbot-typing-msg';
        const bubble = document.createElement('div');
        bubble.className = 'chatbot-bubble chatbot-typing';
        bubble.textContent = 'Finx is typing...';
        typingDiv.appendChild(bubble);
        messages.appendChild(typingDiv);
        scrollToBottom();
    }
    function removeTyping() {
        const typing = messages.querySelector('.chatbot-typing-msg');
        if (typing) typing.remove();
    }

    function getBotResponse(userMsg) {
        const msg = userMsg.toLowerCase();
        if (msg.includes('is finx good') || msg.includes('do you recommend finx') || msg.includes('worth') || (msg.includes('finx') && msg.includes('good'))) {
            return 'Absolutely! Finx is designed to help you improve your finances easily and securely. Many users find it very useful to organize their money and learn.';
        }
        if (msg.includes('bad') || msg.includes('problem') || msg.includes('not working') || msg.includes('don\'t trust')) {
            return 'Sorry to hear that! If you have any problem with Finx, let me know and I will help you.';
        }
        if (msg.includes('what is finx')) return 'Finx is an app to help you control and understand your money.';
        if (msg.includes('what is it for')) return 'It helps you track expenses, save, and learn about finances.';
        if (msg.includes('is it safe')) return 'Yes, your information is protected and private.';
        if (msg.includes('how do i sign up')) return 'Easy! You can sign up with your email and a secure password.';
        if (msg.includes('go to sign up')) return 'Click the button to go to the sign up form.';
        if (msg.includes('what features')) return 'You can track expenses, income, savings goals, and access financial education.';
        if (msg.includes('what is the mission')) return 'Our mission is to help young people achieve financial success in a simple way.';
        if (msg.includes('what is the vision')) return 'To be the leading platform for financial education and management for young people.';
        if (msg.includes('how is my data protected')) return 'We use encryption and best practices to protect your data.';
        if (msg.includes('can i trust finx')) return 'Absolutely! Finx prioritizes your security and privacy.';
        if (msg.includes('what info do i need')) return 'You only need your name, email, and a secure password.';
        if (msg.includes('is sign up free')) return 'Yes, you can start for free and then choose a premium plan if you want.';
        if (msg.includes('savings goals')) return 'Yes, you can create and track your savings goals easily.';
        if (msg.includes('financial education')) return 'Finx includes resources and quizzes to help you learn about finances.';
        if (msg.includes('how does tracking work')) return 'You can see your progress in real time and get suggestions.';
        if (msg.includes('how do you help young people')) return 'We offer tools and education designed for young people.';
        if (msg.includes('who created finx')) return 'Finx was created by a team passionate about financial education.';
        if (msg.includes('is finx free')) return 'You can use Finx for free and then choose a premium plan if you want.';
        if (msg.includes('finx')) return 'Finx is a platform designed to help you improve your financial life. Want to know how it works or how to start?';
        return 'I am here to help you with anything related to Finx! Ask me about sign up, security, features, or how to start.';
    }

    // Welcome message in English with typing animation
    setTimeout(() => {
        showTyping();
        setTimeout(() => {
            removeTyping();
            appendMessage('Hi! I am the Finx assistant. How can I help you today? If you are not sure what to ask, you can choose one of the quick questions below.', 'bot');
        }, 900);
    }, 200);
    renderQuickQuestions('start');

    toggleBtn.addEventListener('click', () => {
        if (chatWindow.classList.contains('open')) {
            chatWindow.classList.remove('open');
            backdrop.classList.remove('open');
            setTimeout(() => { chatWindow.style.display = 'none'; backdrop.style.display = 'none'; }, 350);
        } else {
            chatWindow.style.display = 'flex';
            backdrop.style.display = 'block';
            setTimeout(() => { chatWindow.classList.add('open'); backdrop.classList.add('open'); }, 10);
        }
    });
    closeBtn.addEventListener('click', () => {
        chatWindow.classList.remove('open');
        backdrop.classList.remove('open');
        setTimeout(() => { chatWindow.style.display = 'none'; backdrop.style.display = 'none'; }, 350);
    });
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const userMsg = input.value.trim();
        if (!userMsg) return;
        appendMessage(userMsg, 'user');
        input.value = '';
        removeTyping();
        showTyping();
        setTimeout(() => {
            removeTyping();
            appendMessage(getBotResponse(userMsg), 'bot');
            // Cambiar preguntas rápidas según flujo
            if (quickFlows[currentFlow] && quickFlows[currentFlow].length > 0) {
                renderQuickQuestions(currentFlow);
            } else {
                renderQuickQuestions('start');
                currentFlow = 'start';
            }
        }, 900);
    });
    // --- Fin Chatbot Widget Logic ---
}); 