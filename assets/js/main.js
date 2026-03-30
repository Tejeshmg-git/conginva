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
        // Initial button text state based on current direction
        const initialDir = document.documentElement.dir || 'ltr';
        rtlToggle.textContent = initialDir === 'rtl' ? 'LTR' : 'RTL';
        rtlToggle.style.fontWeight = '700';
        rtlToggle.style.fontSize = '12px';

        rtlToggle.addEventListener('click', () => {
            const currentDir = document.documentElement.dir;
            const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
            document.documentElement.dir = newDir;
            localStorage.setItem('cogniva-dir', newDir);
            
            // Update button label dynamically
            rtlToggle.textContent = newDir === 'rtl' ? 'LTR' : 'RTL';
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
        // Dynamically add a clear "X" close button to the top of the menu if it doesn't exist
        if (!navMenu.querySelector('.mobile-close-btn')) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'mobile-close-btn';
            closeBtn.setAttribute('aria-label', 'Close Menu');
            closeBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            `;
            closeBtn.onclick = () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            };
            navMenu.prepend(closeBtn);
        }

        mobileToggle.addEventListener('click', () => {
            const isActive = navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active', isActive);
            
            // Add state class to header and body for CSS targeting
            const header = document.getElementById('main-header');
            if (header) header.classList.toggle('mobile-nav-active', isActive);
            document.body.classList.toggle('mobile-menu-open', isActive);
            
            document.body.style.overflow = isActive ? 'hidden' : 'auto';
        });

        // Update close functionality to clear states
        const closeActions = () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            const header = document.getElementById('main-header');
            if (header) header.classList.remove('mobile-nav-active');
            document.body.classList.remove('mobile-menu-open');
            document.body.style.overflow = 'auto';
        };

        if (navMenu.querySelector('.mobile-close-btn')) {
            navMenu.querySelector('.mobile-close-btn').onclick = closeActions;
        }
        
        const backBtn = navMenu.querySelector('#mobile-back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', closeActions);
        }

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
