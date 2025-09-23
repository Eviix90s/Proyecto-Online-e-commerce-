// Urban Cats - Lookbook JavaScript Completo
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
        description: "Look perfecto para explorar la ciudad con estilo y comodidad",
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
        description: "Minimalismo japonés en su máxima expresión",
        category: "minimal",
        image: "images/look_2.jpg",
        products: [
            { name: "Camiseta Básica", price: 599, id: 9 },
            { name: "Pantalón Recto", price: 899, id: 10 }
        ],
        tags: ["Minimal", "Clean", "Zen"]
    },
    4: {
        id: 4,
        title: "Midnight Runner",
        description: "Para las noches urbanas que nunca terminan",
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
        description: "El arte de las capas en la moda urbana",
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
        description: "Elegancia en la simplicidad absoluta",
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
        description: "Cultura skate meets moda urbana japonesa",
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
        description: "Futurismo urbano para las noches de neón",
        category: "night",
        image: "images/look_11.jpg",
        products: [
            { name: "Bomber Jacket", price: 1799, id: 20 },
            { name: "Camiseta Tech", price: 899, id: 21 },
            { name: "Jeans Futuristas", price: 1599, id: 22 }
        ],
        tags: ["Futurista", "Urbano", "Tech"]
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
            scrollIndicator: document.querySelector('.hero-scroll-indicator')
        };
    }

    async initializeApp() {
        this.showLoadingAnimation();
        await this.sleep(500); // Simular carga inicial
        
        this.setupEventListeners();
        this.setupScrollAnimations();
        this.setupIntersectionObserver();
        this.setupParallaxElements();
        this.animateOnLoad();
        this.initializeFilters();
        
        setTimeout(() => this.hideLoadingAnimation(), 1000);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Animaciones de carga
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

    // Configurar event listeners
    setupEventListeners() {
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

        // Scroll events
        window.addEventListener('scroll', this.throttle(() => this.handleScroll(), 16));
        
        // Resize events
        window.addEventListener('resize', this.debounce(() => this.handleResize(), 250));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardNav(e));

        // Mouse movement para parallax
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    // Manejo de filtros con animaciones
    handleFilterClick(e) {
        e.preventDefault();
        const clickedTab = e.currentTarget;
        const category = clickedTab.dataset.category;
        
        if (category === this.state.currentFilter) return;

        // Animar tab selection
        this.animateTabSelection(clickedTab);
        
        // Filtrar y animar cards
        this.filterLooksWithAnimation(category);
        
        this.state.currentFilter = category;
    }

    animateTabSelection(activeTab) {
        // Remover active de todos los tabs
        this.elements.filterTabs.forEach(tab => {
            tab.classList.remove('active');
            tab.style.transform = 'scale(1)';
        });
        
        // Animar el tab seleccionado
        activeTab.classList.add('active');
        activeTab.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            activeTab.style.transform = 'scale(1)';
        }, 150);
    }

    async filterLooksWithAnimation(category) {
        const lookCards = document.querySelectorAll('.look-card');
        
        // Fade out cards
        lookCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px) scale(0.95)';
            }, index * 50);
        });

        // Esperar que termine la animación de salida
        await this.sleep(500);

        // Filtrar cards
        this.filterCards(category);

        // Fade in cards filtradas
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

    // Animación de revelado de cards
    revealCards() {
        const visibleCards = document.querySelectorAll('.look-card[style*="display: block"], .look-card:not([style*="display: none"])');
        
        visibleCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
                
                // Efecto de pulso sutil
                setTimeout(() => {
                    card.style.transform = 'translateY(0) scale(1.02)';
                    setTimeout(() => {
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 100);
                }, 200);
                
            }, index * LOOKBOOK_CONFIG.cardRevealDelay);
        });
    }

    // Configurar modal
    setupModalEvents() {
        // Cerrar modal
        document.querySelector('.close-modal')?.addEventListener('click', () => this.closeLookModal());
        this.elements.overlay?.addEventListener('click', () => this.closeLookModal());
        
        // Botones del modal
        document.querySelector('.share-look-btn')?.addEventListener('click', () => this.shareLook());
        document.querySelector('.shop-look-btn')?.addEventListener('click', () => this.shopLook());
    }

    // Abrir modal con animaciones
    openLookModal(lookId) {
        const lookData = looksData[lookId];
        if (!lookData) return;

        this.state.currentLook = lookData;
        this.state.isModalOpen = true;
        
        // Poblar contenido del modal
        this.populateModal(lookData);
        
        // Animar apertura
        this.elements.overlay.classList.add('active');
        this.elements.modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Animación de entrada del contenido
        setTimeout(() => {
            const modalContent = this.elements.modal.querySelector('.modal-content');
            modalContent.style.transform = 'scale(1) translateY(0)';
        }, 50);
    }

    populateModal(lookData) {
        // Actualizar imagen
        const modalImage = document.getElementById('modal-image');
        if (modalImage) {
            modalImage.src = lookData.image;
            modalImage.alt = lookData.title;
        }
        
        // Actualizar título y descripción
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        
        if (modalTitle) modalTitle.textContent = lookData.title;
        if (modalDescription) modalDescription.textContent = lookData.description;
        
        // Poblar productos
        this.populateModalProducts(lookData.products);
    }

    populateModalProducts(products) {
        const productsContainer = document.getElementById('modal-products');
        if (!productsContainer) return;
        
        productsContainer.innerHTML = `
            <h4>Productos de este look:</h4>
            <div class="modal-products-list">
                ${products.map(product => `
                    <div class="modal-product-item">
                        <span class="product-name">${product.name}</span>
                        <span class="product-price">$${product.price.toLocaleString()}</span>
                    </div>
                `).join('')}
            </div>
            <div class="modal-total">
                <strong>Total: $${products.reduce((sum, p) => sum + p.price, 0).toLocaleString()}</strong>
            </div>
        `;
    }

    // Cerrar modal
    closeLookModal() {
        const modalContent = this.elements.modal.querySelector('.modal-content');
        modalContent.style.transform = 'scale(0.95) translateY(20px)';
        
        setTimeout(() => {
            this.elements.modal.classList.remove('show');
            this.elements.overlay.classList.remove('active');
            document.body.style.overflow = '';
            this.state.isModalOpen = false;
            this.state.currentLook = null;
        }, LOOKBOOK_CONFIG.modalTransition);
    }

    // Compartir look
    shareLook() {
        if (!this.state.currentLook) return;
        
        const shareData = {
            title: `Look: ${this.state.currentLook.title}`,
            text: this.state.currentLook.description,
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData);
        } else {
            // Fallback
            navigator.clipboard.writeText(window.location.href);
            this.showToast('Enlace copiado al portapapeles', 'success');
        }
    }

    // Comprar look completo
    shopLook() {
        if (!this.state.currentLook) return;
        
        // Aquí puedes integrar con tu sistema de carrito
        this.showToast(`Look "${this.state.currentLook.title}" agregado al carrito`, 'success');
        this.closeLookModal();
        
        // Redirect to main store
        setTimeout(() => {
            window.location.href = 'index.html#productos';
        }, 1000);
    }

    // Configurar animaciones de scroll
    setupScrollAnimations() {
        // Parallax para hero
        this.state.parallaxElements = [
            { element: this.elements.heroContent, factor: 0.5 },
            { element: this.elements.scrollIndicator, factor: 0.3 }
        ];
    }

    // Manejo de scroll con efectos
    handleScroll() {
        const scrollTop = window.pageYOffset;
        this.state.scrollPosition = scrollTop;
        
        // Navbar effects
        this.updateNavbar(scrollTop);
        
        // Parallax effects
        this.updateParallax(scrollTop);
        
        // Reveal animations
        this.checkRevealAnimations();
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
        this.state.parallaxElements.forEach(({ element, factor }) => {
            if (element) {
                const yPos = scrollTop * factor;
                element.style.transform = `translateY(${yPos}px)`;
            }
        });
    }

    // Intersection Observer para animaciones
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);
        
        // Observar elementos que necesitan animación
        document.querySelectorAll(`
            .feature-item,
            .inspiration-text,
            .inspiration-image,
            .filter-tab
        `).forEach(el => {
            observer.observe(el);
        });
    }

    animateElement(element) {
        element.classList.add('animate-in');
        
        // Animaciones específicas por tipo
        if (element.classList.contains('feature-item')) {
            element.style.transform = 'translateX(0)';
            element.style.opacity = '1';
        }
    }

    // Configurar elementos parallax
    setupParallaxElements() {
        // Agregar más elementos para parallax si es necesario
        const additionalParallax = document.querySelectorAll('.inspiration-image img');
        additionalParallax.forEach(img => {
            img.addEventListener('mousemove', (e) => {
                const rect = img.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const deltaX = (e.clientX - centerX) * 0.01;
                const deltaY = (e.clientY - centerY) * 0.01;
                
                img.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)`;
            });
            
            img.addEventListener('mouseleave', () => {
                img.style.transform = 'translate(0, 0) scale(1)';
            });
        });
    }

    // Manejo de mouse movement
    handleMouseMove(e) {
        // Cursor personalizado o efectos de seguimiento
        const cursor = document.querySelector('.custom-cursor');
        if (cursor) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        }
    }

    // Animaciones de carga inicial
    animateOnLoad() {
        // Animar hero content
        const heroElements = document.querySelectorAll('.hero-badge, .hero-title-line, .lookbook-hero p');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 200 + (index * 200));
        });
        
        // Animar scroll indicator
        setTimeout(() => {
            if (this.elements.scrollIndicator) {
                this.elements.scrollIndicator.style.opacity = '1';
            }
        }, 1500);
    }

    // Inicializar filtros
    initializeFilters() {
        // Marcar filtro inicial como activo
        const allFilter = document.querySelector('[data-category="all"]');
        if (allFilter) {
            allFilter.classList.add('active');
        }
    }

    // Cargar más looks con animación
    async loadMoreLooks() {
        if (this.state.isLoading) return;
        
        this.state.isLoading = true;
        const btn = this.elements.loadMoreBtn;
        const originalText = btn.innerHTML;
        
        // Cambiar texto del botón
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
        btn.disabled = true;
        
        // Simular carga
        await this.sleep(1500);
        
        // Agregar más looks (simulado)
        this.state.visibleLooks += 4;
        
        // Restaurar botón
        btn.innerHTML = originalText;
        btn.disabled = false;
        this.state.isLoading = false;
        
        this.showToast('Nuevos looks cargados', 'success');
        
        if (this.state.visibleLooks >= this.state.maxLooks) {
            btn.style.display = 'none';
        }
    }

    // Navegación por teclado
    handleKeyboardNav(e) {
        if (e.key === 'Escape' && this.state.isModalOpen) {
            this.closeLookModal();
        }
        
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            // Navegación entre looks en modal
            if (this.state.isModalOpen) {
                // Implementar navegación entre looks
            }
        }
    }

    // Manejo de resize
    handleResize() {
        // Recalcular parallax elements
        this.setupParallaxElements();
    }

    // Toast notifications
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
    // Inicializar aplicación del Lookbook
    window.lookbookApp = new LookbookApp();
    
    // Detectar si es mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    document.body.classList.toggle('mobile', isMobile);
    
    // Agregar cursor personalizado en desktop
    if (!isMobile) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);
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

.custom-cursor {
    position: fixed;
    width: 20px;
    height: 20px;
    background: var(--accent-red);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: all 0.1s ease;
    opacity: 0.8;
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
    
    .custom-cursor {
        display: none;
    }
}
</style>
`;

// Inyectar estilos
document.head.insertAdjacentHTML('beforeend', lookbookStyles);