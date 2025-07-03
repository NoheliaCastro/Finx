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
}); 