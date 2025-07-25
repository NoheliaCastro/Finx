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
}); 