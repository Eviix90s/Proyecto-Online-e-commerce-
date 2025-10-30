// Urban Cats - Men Section JavaScript
'use strict';

// Configuración
const MEN_CONFIG = {
    productsPerPage: 12,
    animationDelay: 100,
    filterTransition: 400,
    notificationDuration: 3000
};

// Datos de productos de hombre
const menProducts = [
    {
        id: 201,
        name: "Camiseta Oversized",
        price: 599,
        originalPrice: 799,
        image: "images/camiseta_oversized.jpg",
        category: "tops",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Negro", "Blanco"],
        isNew: true,
        inStock: true,
        description: "Camiseta oversized minimalista con diseño japonés"
    },
    {
        id: 202,
        name: "Chaqueta Bomber",
        price: 1899,
        originalPrice: null,
        image: "images/bomber_1.jpg",
        category: "outerwear",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Negro", "Verde Oliva"],
        isNew: true,
        inStock: true,
        description: "Chaqueta bomber con inspiración urbana"
    },
    {
        id: 203,
        name: "Sudadera Oversized",
        price: 899,
        originalPrice: 1199,
        image: "images/sudadera_hombre.jpg",
        category: "tops",
        sizes: ["M", "L", "XL", "XXL"],
        colors: ["Negro", "Gris", "Beige"],
        isNew: false,
        inStock: true,
        description: "Sudadera oversized perfecta para el día a día"
    },
    {
        id: 204,
        name: "Jeans Slim Fit",
        price: 1299,
        originalPrice: null,
        image: "images/jeans_hombre.jpg",
        category: "bottoms",
        sizes: ["30", "32", "34", "36"],
        colors: ["Azul", "Negro"],
        isNew: false,
        inStock: true,
        description: "Jeans con corte slim fit y estilo urbano"
    },
    {
        id: 205,
        name: "Chaqueta Denim",
        price: 1799,
        originalPrice: 2299,
        image: "images/chaqueta_denim.jpg",
        category: "outerwear",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Azul", "Negro"],
        isNew: true,
        inStock: true,
        description: "Chaqueta de mezclilla con líneas limpias"
    },
    {
        id: 206,
        name: "Pantalón Cargo",
        price: 1099,
        originalPrice: null,
        image: "images/cargo_1.jpg",
        category: "bottoms",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Negro", "Verde Militar"],
        isNew: false,
        inStock: true,
        description: "Pantalón cargo con inspiración japonesa"
    },
    {
        id: 207,
        name: "Camiseta Básica",
        price: 499,
        originalPrice: null,
        image: "images/basic_tee.jpg",
        category: "tops",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Blanco", "Negro", "Gris", "Beige"],
        isNew: false,
        inStock: true,
        description: "Camiseta básica esencial de alta calidad"
    },
    {
        id: 208,
        name: "Conjunto Deportivo",
        price: 1599,
        originalPrice: 1999,
        image: "images/conjunto_deportivo.jpg",
        category: "sets",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Negro", "Gris"],
        isNew: true,
        inStock: true,
        description: "Set completo deportivo urbano"
    },
    {
        id: 209,
        name: "Chamarra Larga",
        price: 2299,
        originalPrice: null,
        image: "images/chamarra_larga.jpg",
        category: "outerwear",
        sizes: ["M", "L", "XL"],
        colors: ["Negro", "Beige"],
        isNew: true,
        inStock: true,
        description: "Chamarra larga con estilo minimalista"
    },
    {
        id: 210,
        name: "Pantalón Wide Leg",
        price: 1199,
        originalPrice: null,
        image: "images/wide_leg.jpg",
        category: "bottoms",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Negro", "Beige"],
        isNew: false,
        inStock: true,
        description: "Pantalón ancho con caída perfecta"
    },
    {
        id: 211,
        name: "Polo Slim",
        price: 699,
        originalPrice: 899,
        image: "images/polo_1.jpg",
        category: "tops",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Negro", "Blanco"],
        isNew: false,
        inStock: true,
        description: "Polo con diseño moderno"
    },
    {
        id: 212,
        name: "Chamarra Bomber Premium",
        price: 2499,
        originalPrice: null,
        image: "images/bomber_premium.jpg",
        category: "outerwear",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Negro", "Azul Marino"],
        isNew: true,
        inStock: true,
        description: "Chamarra bomber elegante y versátil"
    }
];

// Estado de la aplicación
class MenState {
    constructor() {
        this.currentCategory = 'all';
        this.currentSort = 'default';
        this.currentView = 'grid';
        this.currentPage = 1;
        this.filters = {
            priceMax: 3000,
            sizes: [],
            colors: [],
            features: []
        };
        this.cart = JSON.parse(localStorage.getItem('urbanCatsCart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('urbanCatsWishlist')) || [];
        this.filteredProducts = [...menProducts];
    }

    saveCart() {
        localStorage.setItem('urbanCatsCart', JSON.stringify(this.cart));
    }

    saveWishlist() {
        localStorage.setItem('urbanCatsWishlist', JSON.stringify(this.wishlist));
    }
}

// Clase principal
class MenApp {
    constructor() {
        this.state = new MenState();
        this.elements = this.initializeElements();
        this.initializeApp();
    }

    initializeElements() {
        return {
            productsGrid: document.getElementById('productsGrid'),
            categoryTabs: document.querySelectorAll('.category-tab'),
            filterToggle: document.getElementById('filterToggle'),
            filterPanel: document.getElementById('filterPanel'),
            clearFilters: document.getElementById('clearFilters'),
            sortBtn: document.getElementById('sortBtn'),
            sortMenu: document.getElementById('sortMenu'),
            sortOptions: document.querySelectorAll('.sort-option'),
            viewBtns: document.querySelectorAll('.view-btn'),
            priceSlider: document.getElementById('priceSlider'),
            maxPrice: document.getElementById('maxPrice'),
            filterOptions: document.querySelectorAll('.filter-option'),
            colorFilters: document.querySelectorAll('.color-filter'),
            checkboxes: document.querySelectorAll('.checkbox-label input'),
            pagination: document.getElementById('pagination'),
            productsCount: document.getElementById('products-count'),
            cartSidebar: document.getElementById('cart-sidebar'),
            overlay: document.getElementById('overlay'),
            cartCount: document.querySelector('.cart-count'),
            wishlistCount: document.querySelector('.wishlist-count'),
            cartItems: document.getElementById('cart-items'),
            cartTotal: document.getElementById('cart-total'),
            navbar: document.querySelector('.navbar'),
            mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
            backToTop: document.getElementById('back-to-top')
        };
    }

    async initializeApp() {
        this.setupEventListeners();
        this.renderProducts();
        this.updateCartUI();
        this.updateWishlistUI();
        this.setupScrollAnimations();
        this.animateOnLoad();
    }

    setupEventListeners() {
        // Category tabs
        this.elements.categoryTabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.handleCategoryClick(e));
        });

        // Filter toggle
        this.elements.filterToggle?.addEventListener('click', () => this.toggleFilters());

        // Clear filters
        this.elements.clearFilters?.addEventListener('click', () => this.clearAllFilters());

        // Sort
        this.elements.sortBtn?.addEventListener('click', () => this.toggleSortMenu());
        this.elements.sortOptions.forEach(option => {
            option.addEventListener('click', (e) => this.handleSortChange(e));
        });

        // View toggle
        this.elements.viewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleViewChange(e));
        });

        // Price slider
        this.elements.priceSlider?.addEventListener('input', (e) => this.handlePriceChange(e));

        // Size filters
        this.elements.filterOptions.forEach(option => {
            option.addEventListener('click', (e) => this.handleSizeFilter(e));
        });

        // Color filters
        this.elements.colorFilters.forEach(filter => {
            filter.addEventListener('click', (e) => this.handleColorFilter(e));
        });

        // Feature checkboxes
        this.elements.checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => this.handleFeatureFilter(e));
        });

        // Cart
        document.querySelector('.cart-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleCart();
        });

        document.querySelector('.close-cart')?.addEventListener('click', () => this.closeCart());
        this.elements.overlay?.addEventListener('click', () => this.closeCart());

        // Mobile menu
        this.elements.mobileMenuToggle?.addEventListener('click', () => this.toggleMobileMenu());

        // Back to top
        this.elements.backToTop?.addEventListener('click', () => this.scrollToTop());

        // Scroll events
        window.addEventListener('scroll', this.throttle(() => this.handleScroll(), 16));

        // Close menus on click outside
        document.addEventListener('click', (e) => this.handleClickOutside(e));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    // Category handling
    handleCategoryClick(e) {
        const tab = e.currentTarget;
        const category = tab.dataset.category;

        // Update active state
        this.elements.categoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update state
        this.state.currentCategory = category;
        this.state.currentPage = 1;

        // Filter and render
        this.applyFilters();
        this.animateProducts();
    }

    // Filter handling
    toggleFilters() {
        this.elements.filterPanel.classList.toggle('open');
        this.elements.filterToggle?.classList.toggle('active');
    }

    clearAllFilters() {
        this.state.filters = {
            priceMax: 3000,
            sizes: [],
            colors: [],
            features: []
        };

        // Reset UI
        if (this.elements.priceSlider) {
            this.elements.priceSlider.value = 3000;
            this.elements.maxPrice.textContent = '$3,000';
        }

        this.elements.filterOptions.forEach(opt => opt.classList.remove('active'));
        this.elements.colorFilters.forEach(filter => filter.classList.remove('active'));
        this.elements.checkboxes.forEach(checkbox => checkbox.checked = false);

        this.applyFilters();
        this.showToast('Filtros limpiados', 'info');
    }

    handlePriceChange(e) {
        const value = e.target.value;
        this.state.filters.priceMax = parseInt(value);
        this.elements.maxPrice.textContent = `$${parseInt(value).toLocaleString()}`;
        this.applyFilters();
    }

    handleSizeFilter(e) {
        const size = e.currentTarget.dataset.size;
        const index = this.state.filters.sizes.indexOf(size);

        if (index === -1) {
            this.state.filters.sizes.push(size);
            e.currentTarget.classList.add('active');
        } else {
            this.state.filters.sizes.splice(index, 1);
            e.currentTarget.classList.remove('active');
        }

        this.applyFilters();
    }

    handleColorFilter(e) {
        const color = e.currentTarget.dataset.color;
        const index = this.state.filters.colors.indexOf(color);

        if (index === -1) {
            this.state.filters.colors.push(color);
            e.currentTarget.classList.add('active');
        } else {
            this.state.filters.colors.splice(index, 1);
            e.currentTarget.classList.remove('active');
        }

        this.applyFilters();
    }

    handleFeatureFilter(e) {
        const feature = e.target.value;
        const index = this.state.filters.features.indexOf(feature);

        if (e.target.checked && index === -1) {
            this.state.filters.features.push(feature);
        } else if (!e.target.checked && index !== -1) {
            this.state.filters.features.splice(index, 1);
        }

        this.applyFilters();
    }

    // Sort handling
    toggleSortMenu() {
        this.elements.sortMenu?.classList.toggle('show');
    }

    handleSortChange(e) {
        const sortType = e.currentTarget.dataset.sort;
        
        this.elements.sortOptions.forEach(opt => opt.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        this.state.currentSort = sortType;
        this.sortProducts();
        this.renderProducts();
        this.toggleSortMenu();
    }

    sortProducts() {
        switch(this.state.currentSort) {
            case 'price-low':
                this.state.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.state.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                this.state.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'new':
                this.state.filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                break;
            default:
                this.state.filteredProducts = [...menProducts];
        }
    }

    // View handling
    handleViewChange(e) {
        const view = e.currentTarget.dataset.view;
        
        this.elements.viewBtns.forEach(btn => btn.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        this.state.currentView = view;
        this.elements.productsGrid.className = `products-grid ${view}-view`;
    }

    // Filter application
    applyFilters() {
        let filtered = [...menProducts];

        // Category filter
        if (this.state.currentCategory !== 'all') {
            filtered = filtered.filter(p => p.category === this.state.currentCategory);
        }

        // Price filter
        filtered = filtered.filter(p => p.price <= this.state.filters.priceMax);

        // Size filter
        if (this.state.filters.sizes.length > 0) {
            filtered = filtered.filter(p => 
                this.state.filters.sizes.some(size => p.sizes.includes(size))
            );
        }

        // Color filter
        if (this.state.filters.colors.length > 0) {
            filtered = filtered.filter(p => 
                this.state.filters.colors.some(color => p.colors.includes(color))
            );
        }

        // Feature filters
        if (this.state.filters.features.includes('new')) {
            filtered = filtered.filter(p => p.isNew);
        }
        if (this.state.filters.features.includes('sale')) {
            filtered = filtered.filter(p => p.originalPrice);
        }
        if (this.state.filters.features.includes('stock')) {
            filtered = filtered.filter(p => p.inStock);
        }

        this.state.filteredProducts = filtered;
        this.sortProducts();
        this.renderProducts();
    }

    // Product rendering
    renderProducts() {
        if (!this.elements.productsGrid) return;

        const start = (this.state.currentPage - 1) * MEN_CONFIG.productsPerPage;
        const end = start + MEN_CONFIG.productsPerPage;
        const pageProducts = this.state.filteredProducts.slice(start, end);

        if (pageProducts.length === 0) {
            this.elements.productsGrid.innerHTML = `
                <div class="no-products">
                    <h3>No hay productos disponibles</h3>
                    <p>Intenta ajustar tus filtros</p>
                </div>
            `;
            return;
        }

        this.elements.productsGrid.innerHTML = pageProducts.map(product => `
            <article class="product-card" data-product-id="${product.id}">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    ${product.isNew ? '<span class="product-badge new">Nuevo</span>' : ''}
                    ${product.originalPrice ? '<span class="product-badge sale">Oferta</span>' : ''}
                    ${!product.inStock ? '<span class="product-badge out-of-stock">Agotado</span>' : ''}
                    
                    <div class="product-actions">
                        <button class="action-btn wishlist-btn" onclick="app.toggleWishlist(${product.id})" 
                                aria-label="Agregar a favoritos">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="action-btn quick-view-btn" onclick="app.quickView(${product.id})"
                                aria-label="Vista rápida">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    
                    <button class="add-to-cart-overlay" onclick="app.addToCart(${product.id})"
                            ${!product.inStock ? 'disabled' : ''}>
                        <i class="fas fa-shopping-bag"></i>
                        ${product.inStock ? 'Agregar al carrito' : 'Agotado'}
                    </button>
                </div>
                
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    
                    <div class="product-pricing">
                        <span class="product-price">$${product.price.toLocaleString()}</span>
                        ${product.originalPrice ? 
                            `<span class="original-price">$${product.originalPrice.toLocaleString()}</span>` : ''}
                    </div>
                    
                    <div class="product-colors">
                        ${product.colors.map(color => `
                            <span class="color-option" 
                                  style="background-color: ${this.getColorValue(color)}"
                                  title="${color}"></span>
                        `).join('')}
                    </div>
                    
                    <div class="product-sizes">
                        ${product.sizes.slice(0, 4).map(size => `
                            <span class="size-option">${size}</span>
                        `).join('')}
                    </div>
                </div>
            </article>
        `).join('');

        this.updateProductsCount();
        this.renderPagination();
    }

    updateProductsCount() {
        if (this.elements.productsCount) {
            this.elements.productsCount.textContent = 
                `${this.state.filteredProducts.length} producto${this.state.filteredProducts.length !== 1 ? 's' : ''}`;
        }
    }

    // Pagination
    renderPagination() {
        if (!this.elements.pagination) return;

        const totalPages = Math.ceil(this.state.filteredProducts.length / MEN_CONFIG.productsPerPage);
        
        if (totalPages <= 1) {
            this.elements.pagination.innerHTML = '';
            return;
        }

        let html = '';
        
        // Previous button
        html += `
            <button class="page-btn" ${this.state.currentPage === 1 ? 'disabled' : ''} 
                    onclick="app.goToPage(${this.state.currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.state.currentPage - 1 && i <= this.state.currentPage + 1)) {
                html += `
                    <button class="page-btn ${i === this.state.currentPage ? 'active' : ''}" 
                            onclick="app.goToPage(${i})">
                        ${i}
                    </button>
                `;
            } else if (i === this.state.currentPage - 2 || i === this.state.currentPage + 2) {
                html += '<span class="page-dots">...</span>';
            }
        }

        // Next button
        html += `
            <button class="page-btn" ${this.state.currentPage === totalPages ? 'disabled' : ''} 
                    onclick="app.goToPage(${this.state.currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        this.elements.pagination.innerHTML = html;
    }

    goToPage(page) {
        this.state.currentPage = page;
        this.renderProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Cart functionality
    addToCart(productId) {
        const product = menProducts.find(p => p.id === productId);
        if (!product || !product.inStock) return;

        const cartItem = this.state.cart.find(item => item.id === productId);
        
        if (cartItem) {
            cartItem.quantity++;
        } else {
            this.state.cart.push({
                ...product,
                quantity: 1,
                selectedSize: product.sizes[0],
                selectedColor: product.colors[0]
            });
        }

        this.state.saveCart();
        this.updateCartUI();
        this.showToast(`${product.name} agregado al carrito`, 'success');
    }

    removeFromCart(productId) {
        const index = this.state.cart.findIndex(item => item.id === productId);
        if (index !== -1) {
            const product = this.state.cart[index];
            this.state.cart.splice(index, 1);
            this.state.saveCart();
            this.updateCartUI();
            this.showToast(`${product.name} eliminado del carrito`, 'info');
        }
    }

    updateQuantity(productId, change) {
        const cartItem = this.state.cart.find(item => item.id === productId);
        if (!cartItem) return;

        cartItem.quantity += change;

        if (cartItem.quantity <= 0) {
            this.removeFromCart(productId);
        } else {
            this.state.saveCart();
            this.updateCartUI();
        }
    }

    toggleCart() {
        this.elements.cartSidebar?.classList.toggle('open');
        this.elements.overlay?.classList.toggle('show');
        document.body.style.overflow = this.elements.cartSidebar?.classList.contains('open') ? 'hidden' : '';
    }

    closeCart() {
        this.elements.cartSidebar?.classList.remove('open');
        this.elements.overlay?.classList.remove('show');
        document.body.style.overflow = '';
    }

    updateCartUI() {
        // Update cart count
        const totalItems = this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
        if (this.elements.cartCount) {
            this.elements.cartCount.textContent = totalItems;
            this.elements.cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }

        // Update cart items
        if (this.elements.cartItems) {
            if (this.state.cart.length === 0) {
                this.elements.cartItems.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-bag"></i>
                        <p>Tu carrito está vacío</p>
                    </div>
                `;
            } else {
                this.elements.cartItems.innerHTML = this.state.cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <div class="cart-item-details">
                                <span>Talla: ${item.selectedSize}</span>
                                <span>Color: ${item.selectedColor}</span>
                            </div>
                            <div class="cart-item-price">$${item.price.toLocaleString()}</div>
                            <div class="quantity-controls">
                                <button class="qty-btn" onclick="app.updateQuantity(${item.id}, -1)">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="qty-btn" onclick="app.updateQuantity(${item.id}, 1)">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                        <button class="remove-item" onclick="app.removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `).join('');
            }
        }

        // Update cart total
        const total = this.state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (this.elements.cartTotal) {
            this.elements.cartTotal.textContent = `$${total.toLocaleString()}`;
        }
    }

    // Wishlist functionality
    toggleWishlist(productId) {
        const index = this.state.wishlist.indexOf(productId);
        const product = menProducts.find(p => p.id === productId);

        if (index === -1) {
            this.state.wishlist.push(productId);
            this.showToast(`${product.name} agregado a favoritos`, 'success');
        } else {
            this.state.wishlist.splice(index, 1);
            this.showToast(`${product.name} eliminado de favoritos`, 'info');
        }

        this.state.saveWishlist();
        this.updateWishlistUI();
    }

    updateWishlistUI() {
        if (this.elements.wishlistCount) {
            this.elements.wishlistCount.textContent = this.state.wishlist.length;
            this.elements.wishlistCount.style.display = this.state.wishlist.length > 0 ? 'flex' : 'none';
        }
    }

    // Quick view
    quickView(productId) {
        const product = menProducts.find(p => p.id === productId);
        if (!product) return;

        // Aquí puedes implementar un modal de vista rápida
        this.showToast('Vista rápida disponible próximamente', 'info');
    }

    // Mobile menu
    toggleMobileMenu() {
        const nav = document.querySelector('.nav-links');
        nav?.classList.toggle('active');
        this.elements.mobileMenuToggle?.classList.toggle('active');
    }

    // Scroll handling
    handleScroll() {
        // Sticky navbar
        if (this.elements.navbar) {
            if (window.scrollY > 100) {
                this.elements.navbar.classList.add('scrolled');
            } else {
                this.elements.navbar.classList.remove('scrolled');
            }
        }

        // Back to top button
        if (this.elements.backToTop) {
            if (window.scrollY > 500) {
                this.elements.backToTop.classList.add('show');
            } else {
                this.elements.backToTop.classList.remove('show');
            }
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Animations
    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1
        });

        document.querySelectorAll('.product-card').forEach(card => {
            observer.observe(card);
        });
    }

    animateOnLoad() {
        const cards = document.querySelectorAll('.product-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * MEN_CONFIG.animationDelay);
        });
    }

    animateProducts() {
        this.elements.productsGrid.style.opacity = '0';
        
        setTimeout(() => {
            this.renderProducts();
            this.elements.productsGrid.style.opacity = '1';
        }, MEN_CONFIG.filterTransition);
    }

    // Toast notifications
    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container') || this.createToastContainer();
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, MEN_CONFIG.notificationDuration);
    }

    createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 10000;
        `;
        document.body.appendChild(container);
        return container;
    }

    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }

    // Utility functions
    getColorValue(colorName) {
        const colors = {
            'Negro': '#000000',
            'Blanco': '#FFFFFF',
            'Gris': '#808080',
            'Beige': '#F5F5DC',
            'Azul': '#4A90E2',
            'Verde Oliva': '#556B2F',
            'Verde Militar': '#4B5320',
            'Azul Marino': '#001F3F'
        };
        return colors[colorName] || '#000000';
    }

    handleClickOutside(e) {
        if (this.elements.sortMenu?.classList.contains('show')) {
            if (!e.target.closest('.sort-wrapper')) {
                this.elements.sortMenu.classList.remove('show');
            }
        }

        if (this.elements.filterPanel?.classList.contains('open')) {
            if (!e.target.closest('.filter-section') && !e.target.closest('.filter-toggle')) {
                this.elements.filterPanel.classList.remove('open');
                this.elements.filterToggle?.classList.remove('active');
            }
        }
    }

    handleKeyboard(e) {
        if (e.key === 'Escape') {
            this.closeCart();
            this.elements.sortMenu?.classList.remove('show');
            this.elements.filterPanel?.classList.remove('open');
        }
    }

    throttle(func, wait) {
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

// Initialize app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new MenApp();
});

// Inyectar estilos específicos para Men
const menStyles = `
<style>
/* Men Section Specific Styles */
:root {
    --primary-black: #0A0A0A;
    --primary-white: #FFFFFF;
    --pure-white: #FFFFFF;
    --gray-light: #E5E5E5;
    --gray-medium: #999999;
    --gray-dark: #333333;
    --accent-gold: #D4AF37;
    --accent-red: #E74C3C;
    --shadow-light: 0 2px 10px rgba(0, 0, 0, 0.05);
    --shadow-medium: 0 4px 20px rgba(0, 0, 0, 0.1);
    --shadow-heavy: 0 8px 30px rgba(0, 0, 0, 0.15);
    --transition: all 0.3s ease;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: var(--primary-black);
    background: var(--primary-white);
    line-height: 1.6;
    overflow-x: hidden;
}

/* Product Grid */
.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
    opacity: 1;
    transition: opacity 0.4s ease;
}

/* Product Card */
.product-card {
    background: var(--pure-white);
    border-radius: 20px;
    overflow: hidden;
    transition: var(--transition);
    cursor: pointer;
    box-shadow: var(--shadow-light);
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.6s ease forwards;
}

@keyframes fadeInUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.product-card:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-heavy);
}

.product-image-container {
    position: relative;
    aspect-ratio: 3/4;
    overflow: hidden;
    background: var(--gray-light);
}

.product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
}

.product-card:hover .product-image {
    transform: scale(1.1);
}

.product-badge {
    position: absolute;
    top: 15px;
    left: 15px;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    z-index: 2;
}

.product-badge.new {
    background: var(--accent-gold);
    color: var(--primary-black);
}

.product-badge.sale {
    background: var(--accent-red);
    color: var(--pure-white);
    top: 50px;
}

.product-badge.out-of-stock {
    background: var(--gray-medium);
    color: var(--pure-white);
}

.product-actions {
    position: absolute;
    top: 15px;
    right: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    opacity: 0;
    transform: translateX(20px);
    transition: all 0.3s ease;
    z-index: 3;
}

.product-card:hover .product-actions {
    opacity: 1;
    transform: translateX(0);
}

.action-btn {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    border: none;
    background: var(--pure-white);
    color: var(--primary-black);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
    box-shadow: var(--shadow-medium);
}

.action-btn:hover {
    background: var(--primary-black);
    color: var(--pure-white);
    transform: scale(1.1);
}

.add-to-cart-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--primary-black);
    color: var(--pure-white);
    border: none;
    padding: 18px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.5px;
    cursor: pointer;
    transform: translateY(100%);
    transition: transform 0.4s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    z-index: 2;
}

.product-card:hover .add-to-cart-overlay {
    transform: translateY(0);
}

.add-to-cart-overlay:hover:not(:disabled) {
    background: var(--gray-dark);
}

.add-to-cart-overlay:disabled {
    background: var(--gray-medium);
    cursor: not-allowed;
}

.product-info {
    padding: 20px;
}

.product-name {
    font-size: 18px;
    font-weight: 500;
    color: var(--primary-black);
    margin-bottom: 8px;
}

.product-description {
    font-size: 13px;
    color: var(--gray-medium);
    margin-bottom: 12px;
    line-height: 1.4;
}

.product-pricing {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
}

.product-price {
    font-size: 20px;
    font-weight: 600;
    color: var(--primary-black);
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

.product-sizes {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.size-option {
    padding: 8px 16px;
    border: 1px solid var(--gray-light);
    background: transparent;
    color: var(--primary-black);
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
}

.size-option:hover:not(.disabled) {
    background: var(--primary-black);
    color: var(--pure-white);
    border-color: var(--primary-black);
}

.size-option.disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

/* Cart Item Styles */
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
}

.cart-item-details {
    display: flex;
    gap: 15px;
    font-size: 13px;
    color: var(--gray-medium);
    margin-bottom: 10px;
}

.cart-item-price {
    font-weight: 600;
    margin-bottom: 10px;
}

.quantity-controls {
    display: flex;
    align-items: center;
    gap: 10px;
}

.qty-btn {
    width: 28px;
    height: 28px;
    border: 1px solid var(--gray-light);
    background: var(--pure-white);
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
}

.qty-btn:hover {
    background: var(--primary-black);
    color: var(--pure-white);
}

.quantity {
    font-weight: 600;
    min-width: 25px;
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

/* Toast Styles */
.toast {
    background: var(--primary-black);
    color: var(--pure-white);
    padding: 15px 20px;
    border-radius: 10px;
    box-shadow: var(--shadow-heavy);
    transform: translateX(400px);
    opacity: 0;
    transition: all 0.4s ease;
    max-width: 320px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.toast.show {
    transform: translateX(0);
    opacity: 1;
}

.toast-success {
    background: #10B981;
}

.toast-error {
    background: var(--accent-red);
}

.toast-warning {
    background: #F59E0B;
}

.toast-info {
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

/* No Products Message */
.no-products {
    grid-column: 1 / -1;
    text-align: center;
    padding: 80px 20px;
    color: var(--gray-medium);
}

.no-products h3 {
    font-size: 24px;
    color: var(--primary-black);
    margin-bottom: 10px;
    font-weight: 500;
}

.no-products p {
    font-size: 16px;
}

/* List View Styles */
.products-grid.list-view .product-card {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 30px;
}

.products-grid.list-view .product-image-container {
    aspect-ratio: 1;
}

.products-grid.list-view .product-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

/* Responsive */
@media (max-width: 768px) {
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

    .products-grid.list-view .product-card {
        grid-template-columns: 1fr;
    }

    .toast {
        right: 20px;
        left: 20px;
        max-width: none;
    }
}

@media (max-width: 480px) {
    .product-card {
        border-radius: 15px;
    }

    .product-info {
        padding: 15px;
    }

    .product-name {
        font-size: 16px;
    }

    .product-price {
        font-size: 18px;
    }

    .action-btn {
        width: 40px;
        height: 40px;
    }
}
</style>
`;

// Inyectar estilos
document.head.insertAdjacentHTML('beforeend', menStyles);