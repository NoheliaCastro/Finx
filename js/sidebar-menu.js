(function () {
    const SIDEBAR_SELECTOR = '.trivia-sidebar, .leccion-sidebar, .camino-sidebar, .quiz-sidebar, .logros-sidebar';

    function isMobile() {
        return window.matchMedia('(max-width: 991.98px)').matches;
    }

    function getSidebar() {
        return document.querySelector(SIDEBAR_SELECTOR);
    }

    function setMobileOpen(open) {
        const sidebar = getSidebar();
        const menuBtn = document.getElementById('sidebarMenuBtn');
        const backdrop = document.getElementById('sidebarBackdrop');
        if (!sidebar) return;

        sidebar.classList.toggle('show', open);
        document.body.classList.toggle('sidebar-open', open);
        if (backdrop) {
            backdrop.classList.toggle('show', open);
            backdrop.hidden = !open;
        }
        if (menuBtn) {
            menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
            menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
            const icon = menuBtn.querySelector('i');
            if (icon) icon.className = open ? 'bi bi-x-lg' : 'bi bi-list';
        }
        document.body.style.overflow = open ? 'hidden' : '';
    }

    function toggle() {
        const sidebar = getSidebar();
        const toggleBtn = document.getElementById('sidebarToggle');
        const mainContent = document.querySelector('.main-content');
        if (!sidebar) return;

        if (isMobile()) {
            setMobileOpen(!sidebar.classList.contains('show'));
            return;
        }

        sidebar.classList.toggle('hidden');
        if (toggleBtn) toggleBtn.classList.toggle('sidebar-hidden');
        if (mainContent) mainContent.classList.toggle('sidebar-hidden');
        const icon = toggleBtn && toggleBtn.querySelector('i');
        if (icon) {
            icon.className = sidebar.classList.contains('hidden') ? 'bi bi-chevron-right' : 'bi bi-chevron-left';
        }
    }

    function init() {
        if (document.body.dataset.finxSidebarBound === 'true') return;
        document.body.dataset.finxSidebarBound = 'true';

        const toggleBtn = document.getElementById('sidebarToggle');
        const menuBtn = document.getElementById('sidebarMenuBtn');
        const closeBtn = document.getElementById('sidebarCloseBtn');
        const backdrop = document.getElementById('sidebarBackdrop');

        if (toggleBtn) toggleBtn.addEventListener('click', toggle);
        if (menuBtn) menuBtn.addEventListener('click', toggle);
        if (closeBtn) closeBtn.addEventListener('click', function () { setMobileOpen(false); });
        if (backdrop) backdrop.addEventListener('click', function () { setMobileOpen(false); });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') setMobileOpen(false);
        });
        window.addEventListener('resize', function () {
            if (!isMobile()) setMobileOpen(false);
        });
    }

    window.FinxSidebar = {
        init: init,
        toggle: toggle,
        setMobileOpen: setMobileOpen
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
