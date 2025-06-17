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

// Cargar componentes cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Cargar header y footer si existen los elementos
    const headerElement = document.getElementById('header');
    const footerElement = document.getElementById('footer');

    if (headerElement) {
        loadComponent('header', '/components/header.html');
    }
    if (footerElement) {
        loadComponent('footer', '/components/footer.html');
    }
}); 