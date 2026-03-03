document.addEventListener('DOMContentLoaded', () => {
    // 🔹 MOBILE SIDEBAR TOGGLE
    const mobileToggle = document.getElementById('admin-mobile-toggle');
    const sidebar = document.getElementById('admin-sidebar');
    const closeSidebarBtn = document.getElementById('admin-mobile-close');
    const sidebarOverlay = document.getElementById('admin-sidebar-overlay');

    const toggleAdminSidebar = (isOpen) => {
        if (!sidebar) return;
        if (isOpen) {
            sidebar.classList.add('mobile-open');
            sidebarOverlay?.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            sidebar.classList.remove('mobile-open');
            sidebarOverlay?.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    };

    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => toggleAdminSidebar(true));
        closeSidebarBtn?.addEventListener('click', () => toggleAdminSidebar(false));
        sidebarOverlay?.addEventListener('click', () => toggleAdminSidebar(false));
    }

    // 🔹 THEME TOGGLE (DARK/LIGHT)
    const themeToggle = document.getElementById('admin-theme-toggle');
    if (themeToggle) {
        // Load preference
        if (localStorage.getItem('admin-theme') === 'dark') {
            document.body.classList.add('dark-mode');
        }

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('admin-theme', isDark ? 'dark' : 'light');

            // Update Icon (Switch between moon and sun)
            themeToggle.innerHTML = isDark
                ? `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="4.22" x2="19.78" y2="5.64"></line></svg>`
                : `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
        });
    }

    // 🔹 ANIMATED COUNTERS
    const counters = document.querySelectorAll('.animate-counter');
    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            if (isNaN(target)) return;
            const duration = 1200; // ms
            const increment = target / (duration / 16);

            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target.toLocaleString();
                }
            };
            updateCounter();
        });
    };
    setTimeout(animateCounters, 300);

    // 🔹 TAB NAVIGATION
    const navLinks = document.querySelectorAll('.admin-nav-link');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const breadcrumbCurrent = document.getElementById('admin-breadcrumb-current');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || href === '#' || !href.startsWith('#')) return;

            const targetId = href.substring(1);
            const targetPane = document.getElementById('tab-' + targetId);

            if (targetPane) {
                e.preventDefault();

                // Update Active Link UI
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Update Tab Visibility
                tabPanes.forEach(pane => pane.classList.remove('active'));
                targetPane.classList.add('active');

                // Trigger counters if moving to overview
                if (targetId === 'overview') setTimeout(animateCounters, 100);

                // Update Breadcrumb
                if (breadcrumbCurrent) {
                    const labelText = link.querySelector('span') ? link.querySelector('span').innerText : 'Overview';
                    breadcrumbCurrent.innerText = labelText;
                }

                // Close mobile sidebar on click (below tablet breakpoint)
                if (window.innerWidth <= 768) {
                    toggleAdminSidebar(false);
                }

                window.scrollTo(0, 0);
            }
        });
    });
});
