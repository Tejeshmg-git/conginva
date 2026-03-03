/* 
COGNIVA GLOBAL SCRIPTS - ALL IN ONE
*/

// Restore theme BEFORE DOMContentLoaded to avoid flash of wrong theme
(function () {
    const savedTheme = localStorage.getItem('cogniva-theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
    }
    const savedDir = localStorage.getItem('cogniva-dir');
    if (savedDir) {
        document.documentElement.dir = savedDir;
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // Apply dark-mode to body (class was on <html> for early paint)
    if (document.documentElement.classList.contains('dark-mode')) {
        document.body.classList.add('dark-mode');
        document.documentElement.classList.remove('dark-mode');
    }

    // Sticky Header Effect
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Theme Toggle — with localStorage persistence
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('cogniva-theme', isDark ? 'dark' : 'light');
        });
    }

    // RTL Toggle — with localStorage persistence
    const rtlToggle = document.getElementById('rtl-toggle');
    if (rtlToggle) {
        rtlToggle.addEventListener('click', () => {
            const currentDir = document.documentElement.dir;
            const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
            document.documentElement.dir = newDir;
            localStorage.setItem('cogniva-dir', newDir);
        });
    }

    // Suble Mouse Parallax (for 404 and Coming Soon)
    const parallaxBg = document.getElementById('parallax-bg');
    if (parallaxBg) {
        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.pageX) / 100;
            const y = (window.innerHeight / 2 - e.pageY) / 100;
            const moveX = Math.max(-10, Math.min(10, x));
            const moveY = Math.max(-10, Math.min(10, y));
            parallaxBg.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
        });
    }

    // Dashboard Initialization
    if (document.querySelector('.section-dashboard')) {
        console.log("Dashboard initialized");
    }

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.querySelector('header nav');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Toggle dropdowns on mobile
        const dropdowns = navMenu.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector('a'); // Get top-level link
            trigger.addEventListener('click', (e) => {
                const isMobile = window.innerWidth <= 1024;
                if (isMobile) {
                    e.preventDefault();
                    e.stopPropagation();

                    // Close other open dropdowns first (Accordion style)
                    dropdowns.forEach(other => {
                        if (other !== dropdown) other.classList.remove('active');
                    });

                    dropdown.classList.toggle('active');
                }
            });
        });
    }

    // Dashboard Sidebar Logic
    const dashboardSidebar = document.getElementById('dashboard-sidebar');
    const sidebarOpen = document.getElementById('mobile-sidebar-open');
    const sidebarClose = document.getElementById('mobile-sidebar-close');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    const toggleSidebar = (isOpen) => {
        if (!dashboardSidebar) return;
        if (isOpen) {
            dashboardSidebar.classList.add('mobile-open');
            sidebarOverlay?.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            dashboardSidebar.classList.remove('mobile-open');
            sidebarOverlay?.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    };

    if (dashboardSidebar) {
        sidebarOpen?.addEventListener('click', () => toggleSidebar(true));
        sidebarClose?.addEventListener('click', () => toggleSidebar(false));
        sidebarOverlay?.addEventListener('click', () => toggleSidebar(false));

        // Close dashboard sidebar when clicking a link (mobile/tablet only)
        const sidebarLinks = dashboardSidebar.querySelectorAll('.sidebar-link');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 992) toggleSidebar(false);
            });
        });
    }

    // Admin Sidebar Toggle (if different)
    const adminToggle = document.getElementById('admin-mobile-toggle');
    const adminSidebar = document.querySelector('.admin-sidebar');
    if (adminToggle && adminSidebar) {
        adminToggle.addEventListener('click', () => {
            adminSidebar.classList.toggle('active');
        });
    }
});

// Password Strength Checker (Global for inline events)
function checkStrength(password) {
    const bar = document.getElementById('strength-bar');
    const text = document.getElementById('strength-text');

    if (!bar || !text) return;

    bar.className = 'strength-bar';

    if (!password) {
        text.textContent = 'Password Strength';
        text.style.color = 'inherit';
        return;
    }

    if (password.length < 6) {
        bar.classList.add('level-1');
        text.textContent = 'Weak';
        text.style.color = '#e57373';
    } else if (password.length < 10) {
        bar.classList.add('level-2');
        text.textContent = 'Medium';
        text.style.color = '#ffb74d';
    } else {
        bar.classList.add('level-3');
        text.textContent = 'Strong';
        text.style.color = '#81c784';
    }
}
