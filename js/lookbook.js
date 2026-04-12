// Urban Cats - Lookbook JavaScript CORREGIDO
'use strict';

// Configuración del Lookbook
const LOOKBOOK_CONFIG = {
    animationDelay: 150,
    scrollThreshold: 100,
    modalTransition: 400,
    autoScrollDelay: 2000,
    cardRevealDelay: 200,
    parallaxFactor: 0.5,
    hoverDelay: 100
};

// Datos de los looks (expandidos)
const looksData = {
    1: {
        id: 1,
        title: "Urban Explorer",
        description: "La ciudad es tu pasarela. Cada esquina es una oportunidad de mostrar quién eres con energía y actitud auténtica.",
        category: "street",
        image: "images/look_1.jpg",
        products: [
            { name: "Hoodie Oversized", price: 1199, id: 8 },
            { name: "Jeans Slim Fit", price: 1299, id: 2 },
            { name: "Sneakers Street", price: 1899, id: 7 }
        ],
        tags: ["Casual", "Urbano", "Cómodo"]
    },
    2: {
        id: 2,
        title: "Zen Mode",
        description: "El silencio del estilo habla más alto que cualquier tendencia. Menos prendas, más carácter, más tú.",
        category: "minimal",
        image: "images/look_2.jpg",
        products: [
            { name: "Camiseta Básica", price: 599, id: 9 },
            { name: "Pantalón Recto", price: 899, id: 10 }
        ],
        tags: ["Minimal", "Clean", "Zen"]
    },
    3: {
        id: 3,
        title: "Tokyo Vibes",
        description: "Tokio habla sin decir nada. El oversized no es una talla, es una filosofía: el nuevo lujo que se lleva desde adentro.",
        category: "street",
        image: "images/look_14.jpg",
        products: [
            { name: "Chaqueta Oversized", price: 1899, id: 11 },
            { name: "Crop Top", price: 599, id: 12 },
            { name: "Joggers", price: 1199, id: 13 }
        ],
        tags: ["Destacado", "Street"]
    },
    4: {
        id: 4,
        title: "Midnight Runner",
        description: "La noche te pertenece. Oscuridad con propósito, movimiento con intención. El mejor look es el que no pide permiso.",
        category: "night",
        image: "images/look_6.jpg",
        products: [
            { name: "Sudadera Urban Cats", price: 899, id: 1 },
            { name: "Jeans Oscuros", price: 1399, id: 12 }
        ],
        tags: ["Night", "Dark", "Urban"]
    },
    5: {
        id: 5,
        title: "Layer Master",
        description: "El juego de las capas revela quién eres bajo la superficie. Cada prenda es un trazo, el conjunto es una obra.",
        category: "mix",
        image: "images/look_7.jpg",
        products: [
            { name: "Camiseta Base", price: 499, id: 13 },
            { name: "Camisa Abierta", price: 799, id: 14 },
            { name: "Chaqueta Ligera", price: 1299, id: 15 }
        ],
        tags: ["Capas", "Versátil", "Creativo"]
    },
    6: {
        id: 6,
        title: "Pure Lines",
        description: "La elegancia nace de lo que decides no añadir. Una línea limpia, una silueta perfecta, una presencia que no necesita explicación.",
        category: "minimal",
        image: "images/look_8.jpg",
        products: [
            { name: "Vestido Urban Chic", price: 1099, id: 5 },
            { name: "Accesorios Mínimos", price: 299, id: 16 }
        ],
        tags: ["Elegante", "Simple", "Femenino"]
    },
    7: {
        id: 7,
        title: "Skate Culture",
        description: "La calle fue tu primera escuela de estilo. El asfalto es tu lienzo y cada look, una declaración de independencia.",
        category: "street",
        image: "images/look_10.jpg",
        products: [
            { name: "Camiseta Gráfica", price: 699, id: 17 },
            { name: "Shorts Urbanos", price: 799, id: 18 },
            { name: "High Top Sneakers", price: 2099, id: 19 }
        ],
        tags: ["Skate", "Juvenil", "Gráfico"]
    },
    8: {
        id: 8,
        title: "Neon Nights",
        description: "Donde la ciudad brilla, tú brillas más. El futurismo urbano no es una tendencia, es una forma de ver el mundo.",
        category: "night",
        image: "images/look_11.jpg",
        products: [
            { name: "Bomber Jacket", price: 1799, id: 20 },
            { name: "Camiseta Tech", price: 899, id: 21 },
            { name: "Jeans Futuristas", price: 1599, id: 22 }
        ],
        tags: ["Futurista", "Urbano", "Tech"]
    },
    9: {
        id: 9,
        title: "Street Soul",
        description: "Tu esencia urbana, sin filtros ni límites. El street style no se aprende, se siente. Y tú ya lo traes puesto.",
        category: "street",
        image: "images/look_9.jpg",
        products: [
            { name: "Conjunto Street", price: 1499, id: 23 }
        ],
        tags: ["Street", "Urbano"]
    }
};

// Estado global del Lookbook
class LookbookState {
    constructor() {
        this.currentFilter = 'all';
        this.visibleLooks = 8;
        this.maxLooks = 24;
        this.isModalOpen = false;
        this.currentLook = null;
        this.scrollPosition = 0;
        this.isLoading = false;
        this.parallaxElements = [];
    }
}

// Clase principal del Lookbook
class LookbookApp {
    constructor() {
        this.state = new LookbookState();
        this.elements = this.initializeElements();
        this.initializeApp();
    }

    initializeElements() {
        return {
            filterTabs: document.querySelectorAll('.filter-tab'),
            galleryGrid: document.getElementById('gallery-grid'),
            loadMoreBtn: document.getElementById('loadMoreBtn'),
            modal: document.getElementById('look-modal'),
            overlay: document.getElementById('overlay'),
            navbar: document.querySelector('.navbar'),
            mobileMenuToggle: document.querySelector('.mobile-menu-toggle'),
            mobileMenu: document.querySelector('.mobile-menu'),
            heroContent: document.querySelector('.hero-content'),
            scrollIndicator: document.querySelector('.hero-scroll-indicator'),
            backToTop: document.getElementById('back-to-top')
        };
    }

    async initializeApp() {
        try {
            this.showLoadingAnimation();
            await this.sleep(500);
            
            this.setupEventListeners();
            this.setupScrollAnimations();
            this.setupIntersectionObserver();
            this.animateOnLoad();
            this.initializeFilters();
            
            setTimeout(() => this.hideLoadingAnimation(), 1000);
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showLoadingAnimation() {
        document.body.style.overflow = 'hidden';
        const lookCards = document.querySelectorAll('.look-card');
        lookCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(60px) scale(0.95)';
        });
    }

    hideLoadingAnimation() {
        document.body.style.overflow = '';
        this.revealCards();
    }

    setupEventListeners() {
        try {
            // Filtros de categoría
            this.elements.filterTabs.forEach(tab => {
                tab.addEventListener('click', (e) => this.handleFilterClick(e));
            });

            // Load more button
            if (this.elements.loadMoreBtn) {
                this.elements.loadMoreBtn.addEventListener('click', () => this.loadMoreLooks());
            }

            // Modal events
            this.setupModalEvents();

            // Scroll events con throttle
            window.addEventListener('scroll', this.throttle(() => {
                try {
                    this.handleScroll();
                } catch (error) {
                    console.error('Scroll error:', error);
                }
            }, 16));
            
            // Resize events
            window.addEventListener('resize', this.debounce(() => this.handleResize(), 250));

            // Keyboard navigation
            document.addEventListener('keydown', (e) => this.handleKeyboardNav(e));

        } catch (error) {
            console.error('Error setting up event listeners:', error);
        }
    }

    handleFilterClick(e) {
        e.preventDefault();
        const clickedTab = e.currentTarget;
        const category = clickedTab.dataset.category;
        
        if (category === this.state.currentFilter) return;

        this.animateTabSelection(clickedTab);
        this.filterLooksWithAnimation(category);
        this.state.currentFilter = category;
    }

    animateTabSelection(activeTab) {
        this.elements.filterTabs.forEach(tab => {
            tab.classList.remove('active');
            tab.style.transform = 'scale(1)';
        });
        
        activeTab.classList.add('active');
        activeTab.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            activeTab.style.transform = 'scale(1)';
        }, 150);
    }

    async filterLooksWithAnimation(category) {
        const lookCards = document.querySelectorAll('.look-card');
        
        lookCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px) scale(0.95)';
            }, index * 50);
        });

        await this.sleep(500);
        this.filterCards(category);
        await this.sleep(100);
        this.revealCards();
    }

    filterCards(category) {
        const lookCards = document.querySelectorAll('.look-card');
        
        lookCards.forEach(card => {
            const cardCategory = card.dataset.category;
            const shouldShow = category === 'all' || cardCategory === category;
            
            if (shouldShow) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    revealCards() {
        const visibleCards = document.querySelectorAll('.look-card[style*="display: block"], .look-card:not([style*="display: none"])');

        visibleCards.forEach((card, index) => {
            card.classList.remove('revealed');
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';

            setTimeout(() => {
                card.style.opacity = '';
                card.style.transform = '';
                card.classList.add('revealed');
            }, index * LOOKBOOK_CONFIG.cardRevealDelay);
        });
    }

    setupModalEvents() {
        const closeBtn = document.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeLookModal());
        }
        
        if (this.elements.overlay) {
            this.elements.overlay.addEventListener('click', () => this.closeLookModal());
        }
        
        const shareBtn = document.querySelector('.share-look-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareLook());
        }
        
        const shopBtn = document.querySelector('.shop-look-btn');
        if (shopBtn) {
            shopBtn.addEventListener('click', () => this.shopLook());
        }
    }

    openLookModal(lookId) {
        const lookData = looksData[lookId];
        if (!lookData) return;

        this.state.currentLook = lookData;
        this.state.isModalOpen = true;
        
        this.populateModal(lookData);
        
        if (this.elements.overlay) {
            this.elements.overlay.classList.add('active');
        }
        
        if (this.elements.modal) {
            this.elements.modal.classList.add('show');
        }
        
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            const modalContent = this.elements.modal?.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.transform = 'scale(1) translateY(0)';
            }
        }, 50);
    }

    populateModal(lookData) {
        const modalImage = document.getElementById('modal-image');
        if (modalImage) {
            modalImage.src = lookData.image;
            modalImage.alt = lookData.title;
        }
        
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        
        if (modalTitle) modalTitle.textContent = lookData.title;
        if (modalDescription) modalDescription.textContent = lookData.description;
        
    }

    closeLookModal() {
        const modalContent = this.elements.modal?.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.transform = 'scale(0.95) translateY(20px)';
        }
        
        setTimeout(() => {
            if (this.elements.modal) {
                this.elements.modal.classList.remove('show');
            }
            if (this.elements.overlay) {
                this.elements.overlay.classList.remove('active');
            }
            document.body.style.overflow = '';
            this.state.isModalOpen = false;
            this.state.currentLook = null;
        }, LOOKBOOK_CONFIG.modalTransition);
    }

    shareLook() {
        if (!this.state.currentLook) return;
        
        const shareData = {
            title: `Look: ${this.state.currentLook.title}`,
            text: this.state.currentLook.description,
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData).catch(err => console.log('Error sharing:', err));
        } else {
            navigator.clipboard.writeText(window.location.href);
            this.showToast('Enlace copiado al portapapeles', 'success');
        }
    }

    shopLook() {
        if (!this.state.currentLook) return;
        
        this.showToast(`Look "${this.state.currentLook.title}" agregado al carrito`, 'success');
        this.closeLookModal();
        
        setTimeout(() => {
            window.location.href = 'index.html#productos';
        }, 1000);
    }

    setupScrollAnimations() {
        // Parallax desactivado - causaba problemas visuales
        this.state.parallaxElements = [];
    }

    handleScroll() {
        try {
            const scrollTop = window.pageYOffset;
            this.state.scrollPosition = scrollTop;
            
            // Navbar effects
            if (this.elements.navbar) {
                if (scrollTop > 100) {
                    this.elements.navbar.classList.add('scrolled');
                } else {
                    this.elements.navbar.classList.remove('scrolled');
                }
            }
            
            // Back to top button
            if (this.elements.backToTop) {
                if (scrollTop > 300) {
                    this.elements.backToTop.classList.add('visible');
                } else {
                    this.elements.backToTop.classList.remove('visible');
                }
            }
            
            // Parallax desactivado para evitar que el título se mueva
            
        } catch (error) {
            console.error('Scroll handling error:', error);
        }
    }

    updateParallax(scrollTop) {
        // Función desactivada - parallax removido
        return;
    }

    setupIntersectionObserver() {
        const lookCards = Array.from(document.querySelectorAll('.look-card'));
        const featureItems = Array.from(document.querySelectorAll('.feature-item'));
        const inspirationText = Array.from(document.querySelectorAll('.inspiration-text'));
        const inspirationImage = Array.from(document.querySelectorAll('.inspiration-image'));

        const animated = new Set();

        const isVisible = (el) => {
            const rect = el.getBoundingClientRect();
            return rect.top < window.innerHeight * 0.88 && rect.bottom > 0;
        };

        const checkAndAnimate = () => {
            // Look cards con delay escalonado
            lookCards.forEach((card, index) => {
                if (animated.has(card)) return;
                if (isVisible(card)) {
                    setTimeout(() => card.classList.add('revealed'), index * 80);
                    animated.add(card);
                }
            });

            // Feature items con delay escalonado (deslizando desde izquierda)
            featureItems.forEach((item, index) => {
                if (animated.has(item)) return;
                if (isVisible(item)) {
                    setTimeout(() => item.classList.add('revealed'), index * 120);
                    animated.add(item);
                }
            });

            // Inspiration text y image
            [...inspirationText, ...inspirationImage].forEach(el => {
                if (animated.has(el)) return;
                if (isVisible(el)) {
                    el.classList.add('revealed');
                    animated.add(el);
                }
            });
        };

        window.addEventListener('scroll', this.throttle(checkAndAnimate, 50), { passive: true });
        setTimeout(checkAndAnimate, 300);
    }

    animateElement(element) {
        element.classList.add('revealed');
    }

    animateOnLoad() {
        const heroElements = document.querySelectorAll('.hero-badge, .hero-title-line, .lookbook-hero p');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                if (el && el.style) {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }
            }, 200 + (index * 200));
        });
        
        setTimeout(() => {
            if (this.elements.scrollIndicator && this.elements.scrollIndicator.style) {
                this.elements.scrollIndicator.style.opacity = '1';
            }
        }, 1500);
    }

    initializeFilters() {
        const allFilter = document.querySelector('[data-category="all"]');
        if (allFilter) {
            allFilter.classList.add('active');
        }
    }

    async loadMoreLooks() {
        if (this.state.isLoading) return;
        
        this.state.isLoading = true;
        const btn = this.elements.loadMoreBtn;
        if (!btn) return;
        
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
        btn.disabled = true;
        
        await this.sleep(1500);
        
        this.state.visibleLooks += 4;
        
        btn.innerHTML = originalText;
        btn.disabled = false;
        this.state.isLoading = false;
        
        this.showToast('Nuevos looks cargados', 'success');
        
        if (this.state.visibleLooks >= this.state.maxLooks) {
            btn.style.display = 'none';
        }
    }

    handleKeyboardNav(e) {
        if (e.key === 'Escape' && this.state.isModalOpen) {
            this.closeLookModal();
        }
    }

    handleResize() {
        // Recalcular elementos si es necesario
    }

    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

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

// Funciones globales para compatibilidad con HTML
window.openLookModal = (lookId) => {
    if (window.lookbookApp) {
        window.lookbookApp.openLookModal(lookId);
    }
};

window.closeLookModal = () => {
    if (window.lookbookApp) {
        window.lookbookApp.closeLookModal();
    }
};

window.shareLook = () => {
    if (window.lookbookApp) {
        window.lookbookApp.shareLook();
    }
};

window.shopLook = () => {
    if (window.lookbookApp) {
        window.lookbookApp.shopLook();
    }
};

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Inicializar aplicación del Lookbook
        window.lookbookApp = new LookbookApp();
        
        // Detectar si es mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        document.body.classList.toggle('mobile', isMobile);
        
    } catch (error) {
        console.error('Error initializing lookbook:', error);
    }
});

// Logout (dropdown manejado por cart.js)
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('¿Cerrar sesión?')) {
                ['userId', 'userEmail', 'userName'].forEach(k => localStorage.removeItem(k));
                window.location.href = 'index.html';
            }
        });
    }
});

// CSS adicional para componentes dinámicos
const lookbookStyles = `
<style>
.toast {
    position: fixed;
    top: 100px;
    right: 30px;
    background: var(--primary-black);
    color: var(--pure-white);
    padding: 15px 20px;
    border-radius: 10px;
    box-shadow: var(--shadow-heavy);
    transform: translateX(400px);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 4000;
}

.toast.show {
    transform: translateX(0);
    opacity: 1;
}

.toast-success { background: #10B981; }
.toast-error { background: var(--accent-red); }
.toast-warning { background: #F59E0B; }
.toast-info { background: #3B82F6; }

.toast-content {
    display: flex;
    align-items: center;
    gap: 10px;
}

.modal-products-list {
    margin: 20px 0;
}

.modal-product-item {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid var(--gray-light);
}

.modal-total {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 2px solid var(--primary-black);
    text-align: right;
    font-size: 18px;
}

.animate-in {
    animation: slideInUp 0.8s ease forwards;
}

@media (max-width: 768px) {
    .toast {
        right: 20px;
        left: 20px;
        max-width: none;
    }
}
</style>
`;

// Inyectar estilos
document.head.insertAdjacentHTML('beforeend', lookbookStyles);