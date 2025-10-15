// Urban Cats - About Page JavaScript
'use strict';

// Configuración
const ABOUT_CONFIG = {
    animationDelay: 200,
    scrollThreshold: 100,
    parallaxFactor: 0.3,
    counterDuration: 2000
};

// Clase principal About
class AboutPage {
    constructor() {
        this.elements = this.initializeElements();
        this.scrollPosition = 0;
        this.initializeApp();
    }

    initializeElements() {
        return {
            navbar: document.getElementById('navbar'),
            mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
            mobileMenu: document.getElementById('mobile-menu'),
            backToTop: document.getElementById('back-to-top'),
            heroContent: document.querySelector('.hero-content'),
            scrollIndicator: document.querySelector('.scroll-indicator'),
            timelineItems: document.querySelectorAll('.timeline-item'),
            philosophyCards: document.querySelectorAll('.philosophy-card'),
            valueCards: document.querySelectorAll('.value-card'),
            teamCards: document.querySelectorAll('.team-card')
        };
    }

    async initializeApp() {
        this.setupEventListeners();
        this.setupScrollAnimations();
        this.setupIntersectionObserver();
        this.animateHeroOnLoad();
        await this.sleep(300);
        this.revealElements();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    setupEventListeners() {
        // Mobile menu
        if (this.elements.mobileMenuToggle) {
            this.elements.mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Back to top
        if (this.elements.backToTop) {
            this.elements.backToTop.addEventListener('click', () => this.scrollToTop());
        }

        // Scroll events
        window.addEventListener('scroll', this.throttle(() => this.handleScroll(), 16));

        // Resize events
        window.addEventListener('resize', this.debounce(() => this.handleResize(), 250));

        // Smooth scroll for anchors
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => this.handleSmoothScroll(e));
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardNav(e));

        // Philosophy cards hover effects
        this.elements.philosophyCards.forEach(card => {
            this.setupCardHoverEffect(card);
        });

        // Value cards animations
        this.elements.valueCards.forEach((card, index) => {
            this.setupValueCardAnimation(card, index);
        });

        // Team cards effects
        this.elements.teamCards.forEach(card => {
            this.setupTeamCardEffect(card);
        });
    }

    // Mobile menu
    toggleMobileMenu() {
        this.elements.mobileMenuToggle.classList.toggle('active');
        this.elements.mobileMenu.classList.toggle('active');
        document.body.style.overflow = this.elements.mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    // Scroll handling
    handleScroll() {
        const scrollTop = window.pageYOffset;
        this.scrollPosition = scrollTop;

        // Navbar effects
        this.updateNavbar(scrollTop);

        // Parallax effects
        this.updateParallax(scrollTop);

        // Back to top button
        if (this.elements.backToTop) {
            this.elements.backToTop.classList.toggle('visible', scrollTop > 300);
        }

        // Progress bar (optional)
        this.updateProgressBar();
    }

    updateNavbar(scrollTop) {
        if (!this.elements.navbar) return;

        if (scrollTop > 100) {
            this.elements.navbar.classList.add('scrolled');
        } else {
            this.elements.navbar.classList.remove('scrolled');
        }
    }

    updateParallax(scrollTop) {
        // Hero parallax
        if (this.elements.heroContent) {
            const yPos = scrollTop * ABOUT_CONFIG.parallaxFactor;
            this.elements.heroContent.style.transform = `translateY(${yPos}px)`;
        }

        // Scroll indicator parallax
        if (this.elements.scrollIndicator) {
            const yPos = scrollTop * 0.5;
            this.elements.scrollIndicator.style.transform = `translateX(-50%) translateY(${yPos}px)`;
            this.elements.scrollIndicator.style.opacity = Math.max(0, 1 - scrollTop / 300);
        }
    }

    updateProgressBar() {
        // Opcional: barra de progreso de lectura
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        let progressBar = document.getElementById('reading-progress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.id = 'reading-progress';
            progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: ${scrolled}%;
                height: 3px;
                background: var(--accent-red);
                z-index: 9999;
                transition: width 0.1s ease;
            `;
            document.body.appendChild(progressBar);
        }
        progressBar.style.width = scrolled + '%';
    }

    // Scroll to top
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Smooth scroll
    handleSmoothScroll(e) {
        const targetId = e.currentTarget.getAttribute('href');
        if (!targetId || !targetId.startsWith('#')) return;

        e.preventDefault();
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    // Keyboard navigation
    handleKeyboardNav(e) {
        if (e.key === 'Escape') {
            if (this.elements.mobileMenu.classList.contains('active')) {
                this.toggleMobileMenu();
            }
        }
    }

    // Handle resize
    handleResize() {
        // Recalcular animaciones si es necesario
    }

    // Animaciones iniciales del hero
    animateHeroOnLoad() {
        const heroElements = document.querySelectorAll('.hero-badge, .hero-title-line, .about-hero p');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 200 + (index * 200));
        });
    }

    // Revelar elementos al cargar
    async revealElements() {
        // Timeline items
        if (this.elements.timelineItems.length > 0) {
            this.elements.timelineItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, index * ABOUT_CONFIG.animationDelay);
            });
        }
    }

    // Intersection Observer para animaciones
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    
                    // Animar números si es un valor
                    if (entry.target.classList.contains('value-card')) {
                        this.animateValueNumber(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observar elementos
        document.querySelectorAll(`
            .story-image-card,
            .philosophy-card,
            .mv-card,
            .value-card,
            .team-card,
            .timeline-item
        `).forEach(el => {
            observer.observe(el);
        });
    }

    animateElement(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0) scale(1)';
        element.classList.add('animated');
    }

    // Card hover effects
    setupCardHoverEffect(card) {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    }

    // Value card animations
    setupValueCardAnimation(card, index) {
        card.style.transitionDelay = `${index * 50}ms`;
    }

    animateValueNumber(card) {
        const number = card.querySelector('.value-number');
        if (!number || number.dataset.animated) return;

        const targetNumber = parseInt(number.textContent);
        let currentNumber = 0;
        const increment = Math.ceil(targetNumber / 50);
        const duration = 30;

        const counter = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= targetNumber) {
                currentNumber = targetNumber;
                clearInterval(counter);
            }
            number.textContent = String(currentNumber).padStart(2, '0');
        }, duration);

        number.dataset.animated = 'true';
    }

    // Team card effects
    setupTeamCardEffect(card) {
        const image = card.querySelector('.team-image img');
        
        card.addEventListener('mouseenter', () => {
            if (image) {
                image.style.transform = 'scale(1.1)';
            }
        });

        card.addEventListener('mouseleave', () => {
            if (image) {
                image.style.transform = 'scale(1)';
            }
        });
    }

    // Timeline parallax
    setupScrollAnimations() {
        // Parallax para imágenes de la historia
        const storyImages = document.querySelectorAll('.story-image-card');
        
        window.addEventListener('scroll', () => {
            storyImages.forEach((img, index) => {
                const rect = img.getBoundingClientRect();
                const scrollPercent = (window.innerHeight - rect.top) / window.innerHeight;
                
                if (scrollPercent > 0 && scrollPercent < 1) {
                    const offset = (scrollPercent - 0.5) * 50 * (index % 2 === 0 ? 1 : -1);
                    img.style.transform = `translateY(${offset}px)`;
                }
            });
        });
    }

    // Utilidades
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Easter egg: Konami Code
class EasterEgg {
    constructor() {
        this.konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        this.konamiCodePosition = 0;
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            const requiredKey = this.konamiCode[this.konamiCodePosition];
            
            if (e.key === requiredKey) {
                this.konamiCodePosition++;
                
                if (this.konamiCodePosition === this.konamiCode.length) {
                    this.activateEasterEgg();
                    this.konamiCodePosition = 0;
                }
            } else {
                this.konamiCodePosition = 0;
            }
        });
    }

    activateEasterEgg() {
        // Modo "Neko" (gato en japonés)
        document.body.style.cursor = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'%3E%3Ctext y=\'28\' font-size=\'28\'%3E🐱%3C/text%3E%3C/svg%3E"), auto';
        
        // Confetti
        this.createConfetti();
        
        // Mensaje
        this.showEasterEggMessage();
    }

    createConfetti() {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.textContent = '🐱';
                confetti.style.cssText = `
                    position: fixed;
                    top: -50px;
                    left: ${Math.random() * 100}%;
                    font-size: ${20 + Math.random() * 20}px;
                    animation: fall ${3 + Math.random() * 2}s linear forwards;
                    pointer-events: none;
                    z-index: 9999;
                `;
                document.body.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 5000);
            }, i * 100);
        }
    }

    showEasterEggMessage() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            cursor: pointer;
        `;
        
        modal.innerHTML = `
            <div style="text-align: center; color: white; padding: 40px;">
                <h2 style="font-size: 3rem; margin-bottom: 20px;">🐱 ¡Modo Urban Cats Activado! 🐱</h2>
                <p style="font-size: 1.5rem;">Has descubierto el secreto felino</p>
                <p style="margin-top: 20px; opacity: 0.7;">Haz clic para cerrar</p>
            </div>
        `;
        
        modal.addEventListener('click', () => modal.remove());
        document.body.appendChild(modal);
        
        setTimeout(() => {
            if (modal.parentNode) modal.remove();
        }, 5000);
    }
}

// CSS para confetti animation
const dynamicStyles = `
<style>
@keyframes fall {
    to {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
    }
}

.animated {
    animation: slideInUp 0.8s ease forwards;
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Efecto de brillo en hover */
.philosophy-card,
.mv-card,
.value-card,
.team-card {
    position: relative;
    overflow: hidden;
}

.philosophy-card::after,
.mv-card::after,
.value-card::after,
.team-card::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.5s;
}

.philosophy-card:hover::after,
.mv-card:hover::after,
.value-card:hover::after,
.team-card:hover::after {
    left: 100%;
}

/* Smooth transitions para todos los elementos animados */
.story-image-card,
.philosophy-card,
.mv-card,
.value-card,
.team-card {
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
`;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar página About
    window.aboutPage = new AboutPage();
    
    // Inicializar Easter Egg
    new EasterEgg();
    
    // Detectar dispositivo móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    document.body.classList.toggle('mobile', isMobile);
    
    // Preload critical images
    const criticalImages = [
        'images/logo_para_video-removebg-preview.png',
        'images/mujer_1.jpg',
        'images/hombre_1.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// Inyectar estilos dinámicos
document.head.insertAdjacentHTML('beforeend', dynamicStyles);