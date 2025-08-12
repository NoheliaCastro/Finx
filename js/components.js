// Función para cargar componentes HTML
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Error al cargar el componente: ${response.status}`);
        }
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;

        // Si es el header, inicializar el toggle del tema
        if (elementId === 'header') {
            initThemeToggle();
            initLanguageToggle();
            // Aplicar traducciones tras breve delay para asegurar que el resto del DOM esté montado
            setTimeout(() => applyTranslations(), 50);
            // Si es el header_dashboard, asignar logout
            if (componentPath.includes('header_dashboard')) {
                assignDashboardLogout();
            }
        }
    } catch (error) {
        console.error('Error al cargar el componente:', error);
    }
}

// Función para inicializar el toggle del tema
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const icon = themeToggle.querySelector('i');
    const logoLight = document.getElementById('logoLight');
    const logoDark = document.getElementById('logoDark');

    // Recuperar el tema guardado
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-bs-theme', savedTheme);
    updateThemeIcon(icon, savedTheme);
    updateLogoVisibility(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(icon, newTheme);
        updateLogoVisibility(newTheme);
    });
}

// Función para actualizar el icono del tema
function updateThemeIcon(icon, theme) {
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Función para actualizar la visibilidad de los logos
function updateLogoVisibility(theme) {
    const logoLight = document.getElementById('logoLight');
    const logoDark = document.getElementById('logoDark');
    
    if (theme === 'dark') {
        logoLight.style.display = 'none';
        logoDark.style.display = 'inline-block';
    } else {
        logoLight.style.display = 'inline-block';
        logoDark.style.display = 'none';
    }
}

// Si es el header del dashboard, asignar el evento de logout después de cargar el componente
function assignDashboardLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('¿Estás seguro que deseas cerrar sesión y salir del sitio?')) {
                // Aquí puedes limpiar localStorage/sessionStorage si usas autenticación
                // localStorage.clear();
                // sessionStorage.clear();
                window.location.href = 'index.html';
            }
        });
    }
}

// Función para agregar el botón del chatbot a las barras laterales como un elemento de menú
function addChatbotButtonToSidebars() {
    // Buscar todas las barras laterales por sus clases comunes
    const sidebars = [
        ...document.querySelectorAll('.trivia-sidebar, .leccion-sidebar, .camino-sidebar')
    ];

    // Crear el HTML del elemento de menú del chatbot
    const chatbotMenuItemHTML = `
        <li>
            <a href="chatbot.html">
                <i class="bi bi-robot"></i>
                <span>Financial Assistant</span>
            </a>
        </li>
    `;

    // Agregar el elemento de menú a cada barra lateral
    sidebars.forEach(sidebar => {
        // Buscar el menú de navegación
        const navMenu = sidebar.querySelector('.sidebar-nav');
        
        // Solo agregar el elemento si el menú existe y el elemento del chatbot no existe ya
        if (navMenu && !sidebar.querySelector('a[href="chatbot.html"]')) {
            // Insertar el elemento antes del contenedor de cierre de sesión si existe
            const logoutContainer = sidebar.querySelector('.sidebar-logout-container');
            if (logoutContainer) {
                logoutContainer.insertAdjacentHTML('beforebegin', chatbotMenuItemHTML);
            } else {
                // Si no hay contenedor de cierre de sesión, agregar al final del menú
                navMenu.insertAdjacentHTML('beforeend', chatbotMenuItemHTML);
            }
        }
    });
}

// Cargar componentes cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Cargar header y footer si existen los elementos
    const headerElement = document.getElementById('header');
    
    // Añadir botón del chatbot a las barras laterales
    addChatbotButtonToSidebars();
    const footerElement = document.getElementById('footer');
    const headerDashboardElement = document.getElementById('header_dashboard');
    const chatbotContainer = document.getElementById('chatbot-container');
    
    if (headerElement) {
        loadComponent('header', 'components/header.html');
    }
    
    if (footerElement) {
        loadComponent('footer', 'components/footer.html');
    }
    
    if (headerDashboardElement) {
        loadComponent('header_dashboard', 'components/header_dashboard.html');
    }
    
    if (chatbotContainer) {
        loadComponent('chatbot-container', 'components/chatbot.html');
    }
    // Aplicar traducciones iniciales en contenido base (header se traduce al cargarse)
    // Retrasar traducción inicial global para evitar interferir con animaciones/hero antes de estar visible
    setTimeout(() => applyTranslations(), 120);
}); 

// =============================
// SISTEMA DE TRADUCCIÓN SIMPLE
// =============================

const translations = {
    en: {
        // Navbar
        'home': 'Home',
        'about-us': 'About us',
        'help-center': 'Help center',
        'register': 'Register',
        'login': 'Login',
        // Index (hero)
        'hero-title': 'Take Control of Your Finances Today',
        'hero-subtitle': 'Track, Manage, and Save with Ease!',
        'hero-get-started': 'Get Started',
        'hero-learn-more': 'Learn More',
    'get-started': 'Get Started',
    'watch-demo': 'Watch demo',
    'security': 'Security',
    'security-desc': 'Your data and money protected',
    'financial-education': 'Financial Education',
    'financial-education-desc': 'Learn while managing your money',
    'ease-of-use': 'Ease of Use',
    'ease-of-use-desc': 'Intuitive, fast and made for you',
    'why-choose-us': 'Why Choose Us',
    'features-text': "At Finx, we believe that managing your finances shouldn't be a daunting task. Our mission is to empower individuals to take control of their money and achieve financial stability.",
    'view-more': 'View more',
    'your-money-future': 'Your money, your future.',
    'take-control': 'Take control with',
    'benefits-desc': 'Empower yourself to save, manage, and achieve your dreams. Finx makes your financial journey simple, smart, and secure.',
    'log-in': 'Log In',
    'learn-more': 'Learn More',
    'subscriptions': 'Subscriptions',
    'subscriptions-desc': 'Choose the FINX plan that best fits your financial journey. Upgrade anytime to unlock more powerful features!',
    'perfect-beginners': 'Perfect for beginners',
    'basic-plan': 'Basic Plan',
    'choose-plan': 'Choose Plan',
    'most-popular': 'Most Popular',
    'best-value': 'Best value',
    'standard-plan': 'Standard Plan',
    'advanced-features': 'For power users',
    'premium-plan': 'Premium Plan',
    'newsletter': 'Newsletter',
    'enter-email': 'Enter your email address',
    'subscribe': 'Subscribe',
    'thank-subscribe': "Thank you for subscribing! We'll keep you updated with the latest Finx news.",
    'valid-email': 'Please enter a valid email address.',
        // Help Center
        'welcome-help-title': 'Welcome to the Finx Help Center',
        'welcome-help-subtitle': 'Find answers to your questions, explore resources, and get the support you need.',
        'categories-title': 'How Can We Help You?',
        'categories-subtitle': 'Choose a category to find the information you need',
        'card-account-title': 'Account Management',
        'card-account-desc': 'Learn how to create, manage, and secure your Finx account effectively.',
        'card-payments-title': 'Payments & Transactions',
        'card-payments-desc': 'Everything about making payments, viewing transactions, and managing your finances.',
        'card-security-title': 'Security & Privacy',
        'card-security-desc': 'Keep your account safe with our security features and privacy settings.',
        'card-premium-title': 'Premium Features',
        'card-premium-desc': 'Discover the benefits and features available with Finx Premium membership.',
        'faq-title': 'Frequently Asked Questions',
        'faq-subtitle': 'Get quick answers to the most common questions about Finx.',
        'question-create-account': 'How do I create an account?',
        'answer-create-account': 'Creating an account is simple! Click on the "Register" button in the top right corner, fill in your personal information, verify your email address, and you\'re ready to start using Finx.',
        'question-reset-password': 'How can I reset my password?',
        'answer-reset-password': 'If you\'ve forgotten your password, click on "Forgot Password" on the login page. Enter your email address and we\'ll send you a secure link to reset it.',
        'question-change-email': 'Can I change my email address?',
        'answer-change-email': 'Yes, from Profile Settings > Personal Information. You\'ll need to verify the new email.',
        'question-make-payment': 'How do I make a payment?',
        'answer-make-payment': 'Use a credit/debit card or our secure gateway. All transactions are encrypted.',
        'question-payment-methods': 'What payment methods are accepted?',
        'answer-payment-methods': 'We accept Visa, MasterCard, American Express, PayPal, and bank transfer for premium.',
        'question-transactions-history': 'How can I view my transaction history?',
        'answer-transactions-history': 'Go to your dashboard and open the "Transactions" tab to filter and view details.',
        'question-security': 'How secure is my information?',
        'answer-security': 'We use industry-standard encryption (SSL/TLS). Your data is stored securely and never shared without consent.',
        'question-privacy-policy': 'What is your privacy policy?',
        'answer-privacy-policy': 'You can view the full privacy policy in the footer. We only use your data to provide services.',
        'question-2fa': 'Can I enable two-factor authentication?',
        'answer-2fa': 'Yes, enable 2FA via SMS or an authenticator app in security settings.',
        'question-premium-benefits': 'What are the benefits of Premium membership?',
        'answer-premium-benefits': 'Advanced features, priority support, and exclusive content.',
        'question-upgrade-premium': 'How can I upgrade to Premium?',
        'answer-upgrade-premium': 'From your account settings, choose a plan and complete payment.',
        'question-cancel-premium': 'Can I cancel my Premium subscription?',
        'answer-cancel-premium': 'Yes, anytime. Features remain until the billing period ends.',
        'contact-title': 'Still Need Help?',
        'contact-subtitle': "Can't find what you're looking for? Send us a message and we'll get back to you soon.",
        'contact-full-name': 'Full Name',
        'contact-email': 'Email Address',
        'contact-subject': 'Subject',
        'contact-message': 'Message',
        'contact-send': 'Send Message',
        // About Us (sample keys)
        'about-hero-title': 'About Us',
    'about-hero-subtitle': 'We empower smarter financial decisions for everyone.',
    'who-we-are-title': 'Who We Are?'
    },
    es: {
        // Navbar
        'home': 'Inicio',
        'about-us': 'Sobre nosotros',
        'help-center': 'Centro de ayuda',
        'register': 'Registrar',
        'login': 'Iniciar sesión',
        // Index (hero)
        'hero-title': 'Toma el Control de tus Finanzas Hoy',
        'hero-subtitle': '¡Controla, administra y ahorra con facilidad!',
        'hero-get-started': 'Comenzar',
        'hero-learn-more': 'Saber más',
    'get-started': 'Comenzar',
    'watch-demo': 'Ver demo',
    'security': 'Seguridad',
    'security-desc': 'Tus datos y dinero protegidos',
    'financial-education': 'Educación Financiera',
    'financial-education-desc': 'Aprende mientras administras tu dinero',
    'ease-of-use': 'Facilidad de Uso',
    'ease-of-use-desc': 'Intuitivo, rápido y hecho para ti',
    'why-choose-us': '¿Por Qué Elegirnos?',
    'features-text': 'En Finx creemos que administrar tus finanzas no debe ser difícil. Nuestra misión es empoderarte para controlar tu dinero y lograr estabilidad financiera.',
    'view-more': 'Ver más',
    'your-money-future': 'Tu dinero, tu futuro.',
    'take-control': 'Toma el control con',
    'benefits-desc': 'Empodérate para ahorrar, administrar y lograr tus metas. Finx hace tu camino financiero simple, inteligente y seguro.',
    'log-in': 'Ingresar',
    'learn-more': 'Aprender más',
    'subscriptions': 'Suscripciones',
    'subscriptions-desc': '¡Elige el plan de FINX que mejor se adapte a tu viaje financiero. Actualiza en cualquier momento para desbloquear características más poderosas!',
    'perfect-beginners': 'Perfecto para principiantes',
    'basic-plan': 'Plan Básico',
    'choose-plan': 'Elegir Plan',
    'most-popular': 'Más Popular',
    'best-value': 'Mejor valor',
    'standard-plan': 'Plan Estándar',
    'advanced-features': 'Para usuarios avanzados',
    'premium-plan': 'Plan Premium',
    'newsletter': 'Boletín',
    'enter-email': 'Ingresa tu dirección de correo electrónico',
    'subscribe': 'Suscribirse',
    'thank-subscribe': '¡Gracias por suscribirte! Te mantendremos actualizado con las últimas noticias de Finx.',
    'valid-email': 'Por favor ingresa una dirección de correo electrónico válida.',
        // Help Center
        'welcome-help-title': 'Bienvenido al Centro de Ayuda de Finx',
        'welcome-help-subtitle': 'Encuentra respuestas, explora recursos y obtén el soporte que necesitas.',
        'categories-title': '¿Cómo Podemos Ayudarte?',
        'categories-subtitle': 'Elige una categoría para encontrar la información que necesitas',
        'card-account-title': 'Gestión de Cuenta',
        'card-account-desc': 'Aprende a crear, administrar y proteger tu cuenta de Finx efectivamente.',
        'card-payments-title': 'Pagos y Transacciones',
        'card-payments-desc': 'Todo sobre realizar pagos, ver transacciones y manejar tus finanzas.',
        'card-security-title': 'Seguridad y Privacidad',
        'card-security-desc': 'Mantén tu cuenta segura con nuestras funciones y ajustes de privacidad.',
        'card-premium-title': 'Funciones Premium',
        'card-premium-desc': 'Descubre los beneficios y características de la membresía Premium.',
        'faq-title': 'Preguntas Frecuentes',
        'faq-subtitle': 'Respuestas rápidas a las preguntas más comunes sobre Finx.',
        'question-create-account': '¿Cómo creo una cuenta?',
        'answer-create-account': '¡Es sencillo! Haz clic en "Registrar", completa tu información, verifica tu correo y listo.',
        'question-reset-password': '¿Cómo restablezco mi contraseña?',
        'answer-reset-password': 'Haz clic en "Olvidé mi contraseña" en el inicio de sesión y recibirás un enlace seguro.',
        'question-change-email': '¿Puedo cambiar mi correo electrónico?',
        'answer-change-email': 'Sí, en Configuración de Perfil > Información Personal. Debes verificar el nuevo correo.',
        'question-make-payment': '¿Cómo realizo un pago?',
        'answer-make-payment': 'Usa tarjeta de crédito/débito o nuestra pasarela segura. Todo cifrado.',
        'question-payment-methods': '¿Qué métodos de pago se aceptan?',
        'answer-payment-methods': 'Aceptamos Visa, MasterCard, American Express, PayPal y transferencia bancaria para Premium.',
        'question-transactions-history': '¿Dónde veo mi historial de transacciones?',
        'answer-transactions-history': 'En tu panel, pestaña "Transacciones", con filtros por fecha y tipo.',
        'question-security': '¿Qué tan segura está mi información?',
        'answer-security': 'Usamos cifrado estándar (SSL/TLS). Tus datos están protegidos y no se comparten sin consentimiento.',
        'question-privacy-policy': '¿Cuál es su política de privacidad?',
        'answer-privacy-policy': 'Disponible en el pie de página. Solo usamos tus datos para brindar el servicio.',
        'question-2fa': '¿Puedo activar la autenticación de dos factores?',
        'answer-2fa': 'Sí, actívala vía SMS o app autenticadora en ajustes de seguridad.',
        'question-premium-benefits': '¿Qué beneficios tiene Premium?',
        'answer-premium-benefits': 'Funciones avanzadas, soporte prioritario y contenido exclusivo.',
        'question-upgrade-premium': '¿Cómo mejoro a Premium?',
        'answer-upgrade-premium': 'Desde configuración de cuenta, elige un plan y paga.',
        'question-cancel-premium': '¿Puedo cancelar mi suscripción Premium?',
        'answer-cancel-premium': 'Sí, cuando quieras. Mantienes los beneficios hasta el final del período.',
        'contact-title': '¿Aún Necesitas Ayuda?',
        'contact-subtitle': '¿No encuentras lo que buscas? Envíanos un mensaje y te responderemos pronto.',
        'contact-full-name': 'Nombre Completo',
        'contact-email': 'Correo Electrónico',
        'contact-subject': 'Asunto',
        'contact-message': 'Mensaje',
        'contact-send': 'Enviar Mensaje',
        // About Us
        'about-hero-title': 'Sobre Nosotros',
    'about-hero-subtitle': 'Impulsamos decisiones financieras más inteligentes para todos.',
    'who-we-are-title': '¿Quiénes Somos?'
    }
};

function getCurrentLanguage() {
    return localStorage.getItem('lang') || 'en';
}

function initLanguageToggle() {
    const btn = document.getElementById('langToggle');
    if (!btn) return;
    const label = document.getElementById('langToggleLabel');
    const apply = () => {
        applyTranslations();
        if (label) {
            const current = getCurrentLanguage();
            // Show next language code in button (e.g., if current en, show ES)
            label.textContent = current === 'en' ? 'ES' : 'EN';
        }
    };
    btn.addEventListener('click', () => {
        const current = getCurrentLanguage();
        const next = current === 'en' ? 'es' : 'en';
        localStorage.setItem('lang', next);
        document.documentElement.setAttribute('lang', next);
        apply();
    });
    // Inicial
    document.documentElement.setAttribute('lang', getCurrentLanguage());
    apply();
}

function applyTranslations() {
    const lang = getCurrentLanguage();
    const dict = translations[lang] || {};
    // Elementos con atributo data-translate
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (!el.hasAttribute('data-original-text')) {
            // Guardar texto original (solo primera vez) para fallback
            const original = el.textContent.trim();
            if (original) el.setAttribute('data-original-text', original);
        }
        if (dict[key]) { // Solo aplicar si existe traducción no vacía
            if (el.placeholder !== undefined && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
                if (!el.hasAttribute('data-translate-text-only')) el.placeholder = dict[key];
                return;
            }
            // Preserve child elements (icons/spans) -> replace only pure text nodes
            const hasChildren = Array.from(el.childNodes).some(n => n.nodeType === 1);
            if (!hasChildren) {
                if (dict[key].trim().length > 0) el.textContent = dict[key];
            } else {
                // Replace text nodes only
                el.childNodes.forEach(node => {
                    if (node.nodeType === 3 && node.textContent.trim().length > 0) {
                        if (dict[key].trim().length > 0) node.textContent = dict[key];
                    }
                });
            }
        } else if (el.hasAttribute('data-original-text')) {
            // Fallback: restaurar original si se perdió contenido
            if (el.textContent.trim().length === 0) {
                el.textContent = el.getAttribute('data-original-text');
            }
        }
    });
    // Título del documento si hay claves correspondientes
    if (dict['hero-subtitle'] && document.title.includes('Finx')) {
        // No sobrescribir títulos específicos de otras páginas sin clave dedicada
    }
}
