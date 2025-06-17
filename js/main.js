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
}); 