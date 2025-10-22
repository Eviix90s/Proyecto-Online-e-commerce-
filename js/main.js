// Urban Cats - JavaScript Moderno y Optimizado
'use strict';

// Configuración global
const CONFIG = {
    autoSlideInterval: 4000,
    loadingDuration: 2000,
    animationDelay: 100,
    scrollThreshold: 100,
    notificationDuration: 4000
};

// Datos de productos expandidos con mejor estructura
const productos = [
    {
        id: 1,
        name: "Sudadera Urban Cats",
        price: 899,
        originalPrice: 1199,
        image: "images/sudadera_1.jpg",
        category: "mujer / hombre",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Negro", "Blanco", "Gris"],
        isNew: true,
        inStock: true,
        description: "Sudadera urbana con diseño minimalista japonés"
    },
    {
        id: 2,
        name: "Jeans Streetwear",
        price: 1299,
        image: "images/jeans_1.jpg",
        category: "mujer / hombre",
        sizes: ["28", "30", "32", "34"],
        colors: ["Azul", "Negro"],
        isNew: false,
        inStock: true,
        description: "Jeans con corte recto y estilo urbano"
    },
    {
        id: 3,
        name: "Crop Top Street",
        price: 599,
        image: "images/crop_top_1.jpg",
        category: "mujer",
        sizes: ["XS", "S", "M"],
        colors: ["Negro", "Blanco"],
        isNew: true,
        inStock: true,
        description: "Top urbano con estilo japonés contemporáneo"
    },
    {
        id: 4,
        name: "Chaqueta Denim",
        price: 1599,
        image: "images/chaqueta_denim_1.jpg",
        category: "hombre",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Azul", "Negro"],
        isNew: false,
        inStock: true,
        description: "Chaqueta denim con detalles urbanos únicos"
    },
    {
        id: 5,
        name: "Vestido Urban Chic",
        price: 1099,
        image: "images/vestido_1.jpg",
        category: "mujer",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Negro", "Gris"],
        isNew: true,
        inStock: true,
        description: "Vestido elegante con inspiración urbana"
    },
    {
        id: 6,
        name: "Backpack Urbana",
        price: 799,
        image: "images/backpack_1.jpg",
        category: "accesorios",
        sizes: ["Único"],
        colors: ["Negro", "Gris"],
        isNew: false,
        inStock: true,
        description: "Mochila minimalista para el estilo urbano"
    },
    {
        id: 7,
        name: "Sneakers Street",
        price: 1899,
        image: "images/snackers_1.jpg",
        category: "accesorios",
        sizes: ["36", "37", "38", "39", "40"],
        colors: ["Blanco", "Negro"],
        isNew: true,
        inStock: true,
        description: "Zapatillas urbanas con diseño contemporáneo"
    },
    {
        id: 8,
        name: "Hoodie Oversized",
        price: 1199,
        image: "images/oversize_1.jpg",
        category: "hombre",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Negro", "Gris", "Blanco"],
        isNew: false,
        inStock: true,
        description: "Hoodie oversized con estilo japonés urbano"
    }
];

// Estado global de la aplicación
class AppState {
    constructor() {
        this.carritoItems = JSON.parse(localStorage.getItem('urbanCatsCart')) || [];
        this.wishlistItems = JSON.parse(localStorage.getItem('urbanCatsWishlist')) || [];
        this.filtroActivo = 'all';
        this.productosVisibles = productos.slice(0, 4);
        this.currentSlide = 0;
        this.slideInterval = null;
        this.isLoading = true;
    }

    // Métodos para el carrito
    saveCart() {
        localStorage.setItem('urbanCatsCart', JSON.stringify(this.carritoItems));
    }

    saveWishlist() {
        localStorage.setItem('urbanCatsWishlist', JSON.stringify(this.wishlistItems));
    }
}

// Instancia global del estado
const appState = new AppState();

// Clase principal de la aplicación
class UrbanCatsApp {
    constructor() {
        this.elements = this.initializeElements();
        this.initializeApp();
    }

    initializeElements() {
        return {
            loadingScreen: document.getElementById('loading-screen'),
            navbar: document.querySelector('.navbar'),
            productosGrid: document.getElementById('products-grid'),
            cartSidebar: document.getElementById('cart-sidebar'),
            overlay: document.getElementById('overlay'),
            cartCount: document.querySelector('.cart-count'),
            wishlistCount: document.querySelector('.wishlist-count'),
            cartItems: document.getElementById('cart-items'),
            cartTotal: document.getElementById('cart-total'),
            cartSubtotal: document.getElementById('cart-subtotal'),
            visitCount: document.getElementById('visit-count'),
            mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
            mobileMenu: document.getElementById('mobile-menu'),
            backToTop: document.getElementById('back-to-top'),
            toastContainer: document.getElementById('toast-container')
        };
    }

    async initializeApp() {
        // Mostrar loading screen
        this.showLoadingScreen();
        
        // Inicializar componentes
        await this.loadComponents();
        
        // Ocultar loading screen
        setTimeout(() => {
            this.hideLoadingScreen();
        }, CONFIG.loadingDuration);
    }

    async loadComponents() {
        this.setupEventListeners();
        this.renderProductos();
        this.updateCartUI();
        this.updateWishlistUI();
        this.updateVisitCounter();
        this.initializeSlider();
        this.setupScrollAnimations();
        this.setupIntersectionObserver();
        this.setupCategoryCards();
    }

    showLoadingScreen() {
        if (this.elements.loadingScreen) {
            this.elements.loadingScreen.style.display = 'flex';
        }
    }

    hideLoadingScreen() {
        if (this.elements.loadingScreen) {
            this.elements.loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                this.elements.loadingScreen.style.display = 'none';
                appState.isLoading = false;
            }, 500);
        }
    }

    setupEventListeners() {
        // Filtros de productos
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterClick(e));
        });

        // Carrito
        if (this.elements.cartSidebar) {
            document.querySelector('.cart-link')?.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleCart();
            });

            document.querySelector('.close-cart')?.addEventListener('click', () => this.closeCart());
            this.elements.overlay?.addEventListener('click', () => this.closeCart());
        }

        // Mobile menu
        if (this.elements.mobileMenuToggle) {
            this.elements.mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Back to top
        if (this.elements.backToTop) {
            this.elements.backToTop.addEventListener('click', () => this.scrollToTop());
        }

        // Load more products
        document.querySelector('.load-more-btn')?.addEventListener('click', () => this.loadMoreProducts());

        // Newsletter
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
        }

        // Smooth scroll navigation
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => this.handleSmoothScroll(e));
        });

        // Scroll events
        window.addEventListener('scroll', throttle(() => this.handleScroll(), 16));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardNav(e));

        // Slider controls
        document.querySelector('.slider-prev')?.addEventListener('click', () => this.previousSlide());
        document.querySelector('.slider-next')?.addEventListener('click', () => this.nextSlide());
    }

    setupCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        const category = card.dataset.category;
        
        
        // Determinar la página destino
        let targetPage = '';
        if (category === 'mujer') {
            targetPage = 'women.html';
        } else if (category === 'hombre') {
            targetPage = 'men.html';
        }
        
        if (targetPage) {
            // Hacer toda la card clickeable
            card.style.cursor = 'pointer';
            card.style.position = 'relative';
            card.style.zIndex = '10';
            card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // Click en toda la card
            card.addEventListener('click', () => {
                window.location.href = targetPage;
            });
            
            // Efecto hover mejorado
            card.addEventListener('mouseenter', () => {
      // Sombra elegante con glow sutil
                card.style.boxShadow = `
                    0 35px 70px rgba(0, 0, 0, 0.5),
                    0 0 50px rgba(0, 255, 255, 0.2),
                    inset 0 0 60px rgba(0, 255, 255, 0.1)
                `;
                card.style.transform = 'translateY(-25px) scale(1.04)';
                
                // Brillo sutil en la imagen
                const img = card.querySelector('img');
                if (img) {
                    img.style.filter = 'brightness(1.15) contrast(1.1)';
                }
                
                // Resaltar el texto
                const overlay = card.querySelector('.category-overlay');
                if (overlay) {
                    overlay.style.background = 'linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.88) 70%, transparent 100%)';
                }
                
                const title = card.querySelector('h3');
                if (title) {
                    title.style.textShadow = '0 0 20px rgba(0, 255, 255, 0.8)';
                    title.style.transform = 'scale(1.05)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.boxShadow = '';
                card.style.transform = '';
                
                const img = card.querySelector('img');
                if (img) {
                    img.style.filter = '';
                }
                
                const overlay = card.querySelector('.category-overlay');
                if (overlay) {
                    overlay.style.background = '';
                }
                
                const title = card.querySelector('h3');
                if (title) {
                    title.style.textShadow = '';
                    title.style.transform = '';
                }
            });
        }
    });
    
    console.log('Category cards initialized!'); // Para debug
}

    handleFilterClick(e) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        appState.filtroActivo = e.target.dataset.filter;
        this.filterProducts();
    }

    filterProducts() {
        let productosFiltrados = productos;
        
        if (appState.filtroActivo !== 'all') {
            if (appState.filtroActivo === 'nuevo') {
                productosFiltrados = productos.filter(p => p.isNew);
            } else {
                productosFiltrados = productos.filter(p => p.category === appState.filtroActivo);
            }
        }
        
        appState.productosVisibles = productosFiltrados.slice(0, 4);
        this.renderProductos();
    }

    loadMoreProducts() {
        const currentLength = appState.productosVisibles.length;
        let productosFiltrados = productos;
        
        if (appState.filtroActivo !== 'all') {
            if (appState.filtroActivo === 'nuevo') {
                productosFiltrados = productos.filter(p => p.isNew);
            } else {
                productosFiltrados = productos.filter(p => p.category === appState.filtroActivo);
            }
        }
        
        const nextProducts = productosFiltrados.slice(currentLength, currentLength + 4);
        appState.productosVisibles = [...appState.productosVisibles, ...nextProducts];
        
        if (appState.productosVisibles.length >= productosFiltrados.length) {
            const loadMoreBtn = document.querySelector('.load-more-btn');
            if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        }
        
        this.renderProductos();
    }

    renderProductos(productos = appState.productosVisibles) {
        if (!this.elements.productosGrid) return;
        
        // Mostrar loading de productos
        this.elements.productosGrid.innerHTML = `
            <div class="products-loading">
                <div class="loading-spinner"></div>
                <p>Cargando productos...</p>
            </div>
        `;

        // Simular carga con timeout
        setTimeout(() => {
            this.elements.productosGrid.innerHTML = productos.map(producto => this.createProductCard(producto)).join('');
            this.animateProductCards();
            // ✨ NUEVO: Hacer cards clickeables
            this.makeProductCardsClickable();
        }, 300);
    }

    createProductCard(producto) {
        const isInWishlist = appState.wishlistItems.some(item => item.id === producto.id);
        const discountPercentage = producto.originalPrice ? 
            Math.round(((producto.originalPrice - producto.price) / producto.originalPrice) * 100) : 0;

        // ✨ NUEVO: Determinar página destino según categoría
        let targetPage = 'women.html';
        if (producto.category.includes('hombre') && !producto.category.includes('mujer')) {
            targetPage = 'men.html';
        } else if (producto.category === 'accesorios') {
            targetPage = `women.html?product=${producto.id}`;
        } else if (producto.category.includes('mujer')) {
            targetPage = 'women.html';
        }

        return `
            <div class="product-card" data-id="${producto.id}" data-category="${producto.category}" data-target="${targetPage}">
                <div class="product-image-container">
                    <img src="${producto.image}" alt="${producto.name}" class="product-image" loading="lazy">
                    <div class="product-overlay">
                        <div class="product-actions">
                            <button class="action-btn quick-view-btn" onclick="app.quickView(${producto.id})" title="Vista rápida">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn wishlist-btn ${isInWishlist ? 'active' : ''}" 
                                    onclick="app.toggleWishlist(${producto.id})" title="Agregar a favoritos">
                                <i class="fas fa-heart"></i>
                            </button>
                            <button class="action-btn share-btn" onclick="app.shareProduct(${producto.id})" title="Compartir">
                                <i class="fas fa-share"></i>
                            </button>
                        </div>
                    </div>
                    ${producto.isNew ? '<span class="product-badge new">Nuevo</span>' : ''}
                    ${discountPercentage > 0 ? `<span class="product-badge discount">-${discountPercentage}%</span>` : ''}
                    ${!producto.inStock ? '<span class="product-badge out-of-stock">Agotado</span>' : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-name">${producto.name}</h3>
                    <p class="product-description">${producto.description}</p>
                    <div class="product-pricing">
                        <span class="product-price">$${producto.price.toLocaleString()}</span>
                        ${producto.originalPrice ? `<span class="original-price">$${producto.originalPrice.toLocaleString()}</span>` : ''}
                    </div>
                    <div class="product-colors">
                        ${producto.colors.map(color => `
                            <span class="color-option" style="background-color: ${this.getColorCode(color)}" 
                                  title="${color}"></span>
                        `).join('')}
                    </div>
                    <div class="product-sizes">
                        ${producto.sizes.map(size => `
                            <button class="size-option ${!producto.inStock ? 'disabled' : ''}" 
                                    onclick="event.stopPropagation(); app.addToCart(${producto.id}, '${size}')" 
                                    ${!producto.inStock ? 'disabled' : ''}>${size}</button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // ✨ NUEVA FUNCIÓN: Hacer que las cards sean clickeables
    makeProductCardsClickable() {
        document.querySelectorAll('.product-card').forEach(card => {
            card.style.cursor = 'pointer';
            
            card.addEventListener('click', (e) => {
                // No redirigir si se hace click en botones de acción o tallas
                if (e.target.closest('.action-btn') || e.target.closest('.size-option')) {
                    return;
                }
                
                const productId = card.dataset.id;
                const targetPage = card.dataset.target;
                
                // Determinar la página correcta
                let url = targetPage;
                if (!targetPage.includes('?')) {
                    url = `${targetPage}?product=${productId}`;
                }
                
                window.location.href = url;
            });
        });
    }

    getColorCode(colorName) {
        const colorMap = {
            'Negro': '#000000',
            'Blanco': '#FFFFFF',
            'Gris': '#808080',
            'Azul': '#2563EB',
            'Rojo': '#DC2626'
        };
        return colorMap[colorName] || '#CCCCCC';
    }

    animateProductCards() {
        const cards = document.querySelectorAll('.product-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * CONFIG.animationDelay);
        });
    }

    // Funciones del carrito mejoradas
    addToCart(productId, size) {
        const producto = productos.find(p => p.id === productId);
        if (!producto || !producto.inStock) {
            this.showToast('Producto no disponible', 'error');
            return;
        }
        
        const existingItem = appState.carritoItems.find(item => item.id === productId && item.size === size);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            appState.carritoItems.push({
                id: productId,
                name: producto.name,
                price: producto.price,
                image: producto.image,
                size: size,
                quantity: 1,
                color: producto.colors[0] // Default al primer color
            });
        }
        
        appState.saveCart();
        this.updateCartUI();
        this.showToast('Producto agregado al carrito', 'success');
        
        // Efecto visual en el botón
        this.animateAddToCart();
    }

    removeFromCart(productId, size) {
        appState.carritoItems = appState.carritoItems.filter(item => !(item.id === productId && item.size === size));
        appState.saveCart();
        this.updateCartUI();
        this.renderCartItems();
    }

    updateQuantity(productId, size, newQuantity) {
        if (newQuantity <= 0) {
            this.removeFromCart(productId, size);
            return;
        }
        
        const item = appState.carritoItems.find(item => item.id === productId && item.size === size);
        if (item) {
            item.quantity = newQuantity;
            appState.saveCart();
            this.updateCartUI();
            this.renderCartItems();
        }
    }

    updateCartUI() {
        const totalItems = appState.carritoItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = appState.carritoItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        if (this.elements.cartCount) {
            this.elements.cartCount.textContent = totalItems;
            this.elements.cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
        
        if (this.elements.cartTotal) {
            this.elements.cartTotal.textContent = totalPrice.toLocaleString();
        }
        
        if (this.elements.cartSubtotal) {
            this.elements.cartSubtotal.textContent = totalPrice.toLocaleString();
        }
        
        this.renderCartItems();
    }

    renderCartItems() {
        if (!this.elements.cartItems) return;
        
        if (appState.carritoItems.length === 0) {
            this.elements.cartItems.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">
                        <i class="fas fa-shopping-bag"></i>
                    </div>
                    <h4>Tu carrito está vacío</h4>
                    <p>Agrega algunos productos increíbles a tu carrito</p>
                    <button class="continue-shopping" onclick="app.closeCart()">
                        <span>Seguir Comprando</span>
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            `;
            return;
        }
        
        this.elements.cartItems.innerHTML = appState.carritoItems.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-details">
                        <span>Talla: ${item.size}</span>
                        ${item.color ? `<span>Color: ${item.color}</span>` : ''}
                    </div>
                    <div class="cart-item-price">$${item.price.toLocaleString()}</div>
                    <div class="quantity-controls">
                        <button onclick="app.updateQuantity(${item.id}, '${item.size}', ${item.quantity - 1})" 
                                class="qty-btn" ${item.quantity <= 1 ? 'disabled' : ''}>
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button onclick="app.updateQuantity(${item.id}, '${item.size}', ${item.quantity + 1})" 
                                class="qty-btn">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <button onclick="app.removeFromCart(${item.id}, '${item.size}')" 
                        class="remove-item" title="Eliminar producto">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    toggleCart() {
        this.elements.cartSidebar.classList.toggle('open');
        this.elements.overlay.classList.toggle('active');
        document.body.style.overflow = this.elements.cartSidebar.classList.contains('open') ? 'hidden' : '';
    }

    closeCart() {
        this.elements.cartSidebar.classList.remove('open');
        this.elements.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Funciones de wishlist
    toggleWishlist(productId) {
        const producto = productos.find(p => p.id === productId);
        const existingIndex = appState.wishlistItems.findIndex(item => item.id === productId);
        
        if (existingIndex > -1) {
            appState.wishlistItems.splice(existingIndex, 1);
            this.showToast('Producto removido de favoritos', 'info');
        } else {
            appState.wishlistItems.push({
                id: productId,
                name: producto.name,
                price: producto.price,
                image: producto.image
            });
            this.showToast('Producto agregado a favoritos', 'success');
        }
        
        appState.saveWishlist();
        this.updateWishlistUI();
        this.renderProductos(); // Re-render para actualizar iconos
    }

    updateWishlistUI() {
        if (this.elements.wishlistCount) {
            const count = appState.wishlistItems.length;
            this.elements.wishlistCount.textContent = count;
            this.elements.wishlistCount.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    // Mobile menu
    toggleMobileMenu() {
        this.elements.mobileMenuToggle.classList.toggle('active');
        this.elements.mobileMenu.classList.toggle('active');
    }

    // Slider functionality mejorado
    initializeSlider() {
        const dots = document.querySelectorAll('.dot');
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });
        
        this.startAutoSlide();
        
        // Pause on hover
        const sliderContainer = document.querySelector('.product-slider');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => this.pauseAutoSlide());
            sliderContainer.addEventListener('mouseleave', () => this.startAutoSlide());
        }
    }

    goToSlide(slideIndex) {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        
        if (!slides.length) return;
        
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[slideIndex].classList.add('active');
        if (dots[slideIndex]) dots[slideIndex].classList.add('active');
        
        appState.currentSlide = slideIndex;
    }

    nextSlide() {
        const slides = document.querySelectorAll('.slide');
        if (!slides.length) return;
        
        const nextIndex = (appState.currentSlide + 1) % slides.length;
        this.goToSlide(nextIndex);
    }

    previousSlide() {
        const slides = document.querySelectorAll('.slide');
        if (!slides.length) return;
        
        const prevIndex = appState.currentSlide === 0 ? slides.length - 1 : appState.currentSlide - 1;
        this.goToSlide(prevIndex);
    }

    startAutoSlide() {
        this.pauseAutoSlide();
        appState.slideInterval = setInterval(() => this.nextSlide(), CONFIG.autoSlideInterval);
    }

    pauseAutoSlide() {
        if (appState.slideInterval) {
            clearInterval(appState.slideInterval);
            appState.slideInterval = null;
        }
    }

    // Funciones adicionales mejoradas
    quickView(productId) {
        const producto = productos.find(p => p.id === productId);
        if (!producto) return;
        
        // Crear modal de vista rápida
        const modal = this.createQuickViewModal(producto);
        document.body.appendChild(modal);
        
        setTimeout(() => modal.classList.add('show'), 10);
        this.showToast(`Vista rápida: ${producto.name}`, 'info');
    }

    createQuickViewModal(producto) {
        const modal = document.createElement('div');
        modal.className = 'quick-view-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal" onclick="this.closest('.quick-view-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
                <div class="modal-image">
                    <img src="${producto.image}" alt="${producto.name}">
                </div>
                <div class="modal-info">
                    <h2>${producto.name}</h2>
                    <p class="modal-description">${producto.description}</p>
                    <div class="modal-price">$${producto.price.toLocaleString()}</div>
                    <div class="modal-sizes">
                        ${producto.sizes.map(size => `
                            <button class="size-option" onclick="app.addToCart(${producto.id}, '${size}'); this.closest('.quick-view-modal').remove();">
                                ${size}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        return modal;
    }

    shareProduct(productId) {
        const producto = productos.find(p => p.id === productId);
        if (!producto) return;
        
        if (navigator.share) {
            navigator.share({
                title: producto.name,
                text: producto.description,
                url: window.location.href
            });
        } else {
            // Fallback: copiar al clipboard
            navigator.clipboard.writeText(window.location.href);
            this.showToast('Enlace copiado al portapapeles', 'success');
        }
    }

    // Sistema de notificaciones mejorado
    showToast(message, type = 'info', duration = CONFIG.notificationDuration) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        if (!this.elements.toastContainer) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
            this.elements.toastContainer = container;
        }
        
        this.elements.toastContainer.appendChild(toast);
        
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

    // Newsletter mejorado
    handleNewsletterSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        
        if (!this.isValidEmail(email)) {
            this.showToast('Por favor ingresa un email válido', 'error');
            return;
        }
        
        // Simular envío
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            this.showToast('¡Gracias por suscribirte! Pronto recibirás nuestras novedades.', 'success');
            e.target.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Navegación y scroll mejorados
    handleSmoothScroll(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Ajuste por navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    handleScroll() {
        const scrollTop = window.pageYOffset;
        
        // Navbar hide/show
        if (this.elements.navbar) {
            if (scrollTop > this.lastScrollTop && scrollTop > CONFIG.scrollThreshold) {
                this.elements.navbar.style.transform = 'translateY(-100%)';
            } else {
                this.elements.navbar.style.transform = 'translateY(0)';
                this.elements.navbar.classList.toggle('scrolled', scrollTop > 50);
            }
        }
        
        // Back to top button
        if (this.elements.backToTop) {
            this.elements.backToTop.classList.toggle('visible', scrollTop > 300);
        }
        
        this.lastScrollTop = scrollTop;
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Keyboard navigation
    handleKeyboardNav(e) {
        // ESC para cerrar modales
        if (e.key === 'Escape') {
            this.closeCart();
            this.elements.mobileMenu?.classList.remove('active');
            this.elements.mobileMenuToggle?.classList.remove('active');
            document.querySelector('.quick-view-modal')?.remove();
        }
        
        // Arrow keys para slider
        if (e.key === 'ArrowLeft') {
            this.previousSlide();
        } else if (e.key === 'ArrowRight') {
            this.nextSlide();
        }
    }

    // Animaciones de scroll
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-animation');
                    
                    // Números animados
                    if (entry.target.classList.contains('stat-number')) {
                        this.animateNumber(entry.target);
                    }
                }
            });
        }, observerOptions);
        
        // Observar elementos que necesitan animación
        document.querySelectorAll(`
            .product-card, 
            .collection-card, 
            .category-card, 
            .stat-item,
            .section-header,
            .hero-text
        `).forEach(el => {
            observer.observe(el);
        });
    }

    setupIntersectionObserver() {
        // Observer para lazy loading adicional
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        lazyObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            lazyObserver.observe(img);
        });
    }

    animateNumber(element) {
        const target = parseInt(element.textContent.replace(/,/g, ''));
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }

    animateAddToCart() {
        const cartIcon = document.querySelector('.cart-link i');
        if (cartIcon) {
            cartIcon.style.transform = 'scale(1.3)';
            cartIcon.style.color = 'var(--accent-red)';
            
            setTimeout(() => {
                cartIcon.style.transform = 'scale(1)';
                cartIcon.style.color = '';
            }, 300);
        }
    }

    // Contador de visitas mejorado
    updateVisitCounter() {
        let visits = localStorage.getItem('urbanCatsVisits') || 0;
        visits = parseInt(visits) + 1;
        localStorage.setItem('urbanCatsVisits', visits);
        
        if (this.elements.visitCount) {
            // Animar el contador
            this.animateCounter(this.elements.visitCount, 0, visits, 2000);
        }
    }

    animateCounter(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }

    // Gestión de performance
    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.loading = 'lazy';
            img.decoding = 'async';
        });
    }

    // Funciones de utilidad
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

    // Search functionality (preparado para implementación futura)
    initializeSearch() {
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.showToast('Funcionalidad de búsqueda próximamente', 'info');
            });
        }
    }
}

// Función throttle para optimizar scroll
function throttle(func, limit) {
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

// Funciones globales para mantener compatibilidad
window.addToCart = (productId, size) => app.addToCart(productId, size);
window.removeFromCart = (productId, size) => app.removeFromCart(productId, size);
window.updateQuantity = (productId, size, quantity) => app.updateQuantity(productId, size, quantity);
window.quickView = (productId) => app.quickView(productId);
window.toggleWishlist = (productId) => app.toggleWishlist(productId);
window.shareProduct = (productId) => app.shareProduct(productId);
window.closeCart = () => app.closeCart();
window.scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
};

// Inicialización cuando el DOM esté listo
let app;

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar aplicación
    app = new UrbanCatsApp();
    
    // Configurar PWA (Service Worker preparado)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    }
    
    // Detectar si es mobile
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

// Event listeners adicionales para mejorar UX
window.addEventListener('load', function() {
    // Ocultar loading si aún está visible
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen && !loadingScreen.classList.contains('fade-out')) {
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => loadingScreen.style.display = 'none', 500);
        }, 500);
    }
    
    // Optimizar imágenes
    if (app) {
        app.optimizeImages();
    }
});

window.addEventListener('beforeunload', function() {
    // Limpiar intervalos antes de salir
    if (appState.slideInterval) {
        clearInterval(appState.slideInterval);
    }
});

// Error handling global
window.addEventListener('error', function(e) {
    console.error('Error capturado:', e.error);
    if (app) {
        app.showToast('Ha ocurrido un error. Por favor recarga la página.', 'error');
    }
});

// Handle online/offline status
window.addEventListener('online', function() {
    if (app) {
        app.showToast('Conexión restaurada', 'success');
    }
});

window.addEventListener('offline', function() {
    if (app) {
        app.showToast('Sin conexión a internet', 'warning');
    }
});

// CSS dinámico para componentes creados por JS
const dynamicStyles = `
<style>
.quick-view-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 3000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    backdrop-filter: blur(5px);
}

.quick-view-modal.show {
    opacity: 1;
}

.modal-content {
    background: var(--pure-white);
    border-radius: 20px;
    max-width: 800px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    position: relative;
    box-shadow: var(--shadow-heavy);
}

.close-modal {
    position: absolute;
    top: 20px;
    right: 20px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    z-index: 1;
    color: var(--primary-black);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
}

.close-modal:hover {
    background: var(--gray-light);
}

.modal-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 20px 0 0 20px;
}

.modal-info {
    padding: 40px;
}

.modal-info h2 {
    font-size: 28px;
    font-weight: 300;
    margin-bottom: 15px;
    color: var(--primary-black);
}

.modal-description {
    color: var(--gray-medium);
    margin-bottom: 20px;
    line-height: 1.6;
}

.modal-price {
    font-size: 24px;
    font-weight: 600;
    color: var(--primary-black);
    margin-bottom: 30px;
}

.modal-sizes {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.modal-sizes .size-option {
    padding: 12px 20px;
    border: 1px solid var(--primary-black);
    background: transparent;
    color: var(--primary-black);
    border-radius: 25px;
    cursor: pointer;
    transition: var(--transition);
    font-weight: 500;
}

.modal-sizes .size-option:hover {
    background: var(--primary-black);
    color: var(--pure-white);
}

.product-card {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
}

.product-card.fade-in {
    opacity: 1;
    transform: translateY(0);
}

.product-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: var(--transition);
}

.product-card:hover .product-overlay {
    opacity: 1;
}

.product-actions {
    display: flex;
    gap: 10px;
}

.action-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: var(--pure-white);
    color: var(--primary-black);
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-btn:hover {
    transform: scale(1.1);
    background: var(--accent-red);
    color: var(--pure-white);
}

.action-btn.active {
    background: var(--accent-red);
    color: var(--pure-white);
}

.product-badge {
    position: absolute;
    top: 15px;
    left: 15px;
    padding: 5px 12px;
    border-radius: 15px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.product-badge.new {
    background: var(--accent-red);
    color: var(--pure-white);
}

.product-badge.discount {
    background: #10B981;
    color: var(--pure-white);
}

.product-badge.out-of-stock {
    background: var(--gray-medium);
    color: var(--pure-white);
}

.product-description {
    font-size: 14px;
    color: var(--gray-medium);
    margin-bottom: 10px;
    line-height: 1.4;
}

.product-pricing {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
}

.original-price {
    text-decoration: line-through;
    color: var(--gray-medium);
    font-size: 14px;
}

.product-colors {
    display: flex;
    gap: 8px;
    margin-bottom: 15px;
}

.color-option {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid var(--gray-light);
    cursor: pointer;
    transition: var(--transition);
}

.color-option:hover {
    transform: scale(1.2);
    border-color: var(--primary-black);
}

.cart-item {
    display: flex;
    gap: 15px;
    padding: 20px;
    border-bottom: 1px solid var(--gray-light);
    align-items: center;
}

.cart-item-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 10px;
}

.cart-item-info {
    flex: 1;
}

.cart-item-info h4 {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 5px;
    color: var(--primary-black);
}

.cart-item-details {
    display: flex;
    gap: 15px;
    font-size: 14px;
    color: var(--gray-medium);
    margin-bottom: 10px;
}

.cart-item-price {
    font-weight: 600;
    color: var(--primary-black);
    margin-bottom: 10px;
}

.quantity-controls {
    display: flex;
    align-items: center;
    gap: 10px;
}

.qty-btn {
    width: 30px;
    height: 30px;
    border: 1px solid var(--gray-light);
    background: var(--pure-white);
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
}

.qty-btn:hover:not(:disabled) {
    background: var(--primary-black);
    color: var(--pure-white);
}

.qty-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.quantity {
    font-weight: 600;
    min-width: 30px;
    text-align: center;
}

.remove-item {
    background: none;
    border: none;
    color: var(--gray-medium);
    cursor: pointer;
    padding: 10px;
    border-radius: 5px;
    transition: var(--transition);
}

.remove-item:hover {
    color: var(--accent-red);
    background: rgba(255, 0, 0, 0.1);
}

.toast {
    background: var(--primary-black);
    color: var(--pure-white);
    padding: 15px 20px;
    border-radius: 10px;
    box-shadow: var(--shadow-light);
    transform: translateX(400px);
    opacity: 0;
    transition: var(--transition);
    max-width: 300px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.toast.show {
    transform: translateX(0);
    opacity: 1;
}

.toast.success {
    background: #10B981;
}

.toast.error {
    background: var(--accent-red);
}

.toast.warning {
    background: #F59E0B;
}

.toast.info {
    background: #3B82F6;
}

.toast-content {
    display: flex;
    align-items: center;
    gap: 10px;
}

.toast-close {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    padding: 5px;
    opacity: 0.7;
    transition: var(--transition);
}

.toast-close:hover {
    opacity: 1;
}

@media (max-width: 768px) {
    .modal-content {
        grid-template-columns: 1fr;
        max-width: 95%;
    }
    
    .modal-image img {
        height: 250px;
        border-radius: 20px 20px 0 0;
    }
    
    .modal-info {
        padding: 30px 20px;
    }
    
    .cart-item {
        padding: 15px;
    }
    
    .cart-item-image {
        width: 60px;
        height: 60px;
    }
    
    .cart-item-details {
        flex-direction: column;
        gap: 5px;
    }
}
</style>
`;

// Inyectar estilos dinámicos
document.head.insertAdjacentHTML('beforeend', dynamicStyles);