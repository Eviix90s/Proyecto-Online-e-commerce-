// Urban Cats - Accessories Section JavaScript
'use strict';

// Configuración
const ACCESSORIES_CONFIG = {
    productsPerPage: 12,
    animationDelay: 100,
    filterTransition: 400,
    notificationDuration: 3000
};

// Datos de productos de accesorios
const accessoriesProducts = [
    {
        id: 1201,
        name: "Mochila Urban Black",
        price: 899,
        originalPrice: 1199,
        image: "images/backpack_1.jpg",
        category: "bags",
        sizes: ["Único"],
        colors: ["Negro", "Gris"],
        materials: ["textil"],
        isNew: true,
        inStock: true,
        description: "Mochila urbana minimalista con compartimentos inteligentes"
    },
    {
        id: 1202,
        name: "Bolso Crossbody Urban",
        price: 799,
        originalPrice: null,
        image: "images/acceso_back_1.jpg",
        category: "bags",
        sizes: ["Único"],
        colors: ["Negro", "Marrón"],
        materials: ["cuero"],
        isNew: false,
        inStock: true,
        description: "Bolso cruzado con estilo urbano versátil"
    },
    {
        id: 1301,
        name: "Gorra Snapback Street",
        price: 399,
        originalPrice: null,
        image: "images/acceso_pacs_2.jpg",
        category: "caps",
        sizes: ["Único"],
        colors: ["Negro", "Blanco"],
        materials: ["textil"],
        isNew: true,
        inStock: true,
        description: "Gorra ajustable con estilo urbano japonés"
    },
    {
        id: 1302,
        name: "Gorra Dad Hat Clean",
        price: 349,
        originalPrice: 449,
        image: "images/acceso_pacs_1.jpg",
        category: "caps",
        sizes: ["Único"],
        colors: ["Blanco", "Negro", "Gris"],
        materials: ["textil"],
        isNew: false,
        inStock: true,
        description: "Gorra dad hat con diseño limpio y minimalista"
    },
    {
        id: 1303,
        name: "Gorra Bucket Urban",
        price: 449,
        originalPrice: 599,
        image: "images/acceso_pacs_3.jpg",
        category: "caps",
        sizes: ["Único"],
        colors: ["Negro", "Gris"],
        materials: ["textil"],
        isNew: true,
        inStock: true,
        description: "Bucket hat urbano con espíritu callejero"
    },
    {
        id: 1401,
        name: "Reloj Minimal Digital",
        price: 1599,
        originalPrice: 1999,
        image: "images/acceso_watch_1.jpg",
        category: "watches",
        sizes: ["Único"],
        colors: ["Negro", "Gris"],
        materials: ["metal"],
        isNew: false,
        inStock: true,
        description: "Reloj digital con diseño minimalista contemporáneo"
    },
    {
        id: 1402,
        name: "Reloj Análogo Leather",
        price: 2199,
        originalPrice: null,
        image: "images/acceso_watch_2.jpg",
        category: "watches",
        sizes: ["Único"],
        colors: ["Marrón", "Negro"],
        materials: ["cuero", "metal"],
        isNew: true,
        inStock: true,
        description: "Reloj análogo con correa de cuero premium"
    },
    {
        id: 1501,
        name: "Collar Chain Minimal",
        price: 499,
        originalPrice: null,
        image: "images/acceso_collar_1.jpg",
        category: "jewelry",
        sizes: ["Único"],
        colors: ["Gris"],
        materials: ["metal"],
        isNew: true,
        inStock: true,
        description: "Collar minimalista con cadena urbana"
    },
    {
        id: 1502,
        name: "Anillo Urban Minimal",
        price: 299,
        originalPrice: null,
        image: "images/acceso_collar_2.jpg",
        category: "jewelry",
        sizes: ["S", "M", "L"],
        colors: ["Gris"],
        materials: ["metal"],
        isNew: false,
        inStock: true,
        description: "Anillo minimalista con acabado mate"
    },
    {
        id: 1601,
        name: "Sneakers Urban White",
        price: 1899,
        originalPrice: null,
        image: "images/snackers_1.jpg",
        category: "shoes",
        sizes: ["36", "37", "38", "39", "40", "41", "42"],
        colors: ["Blanco", "Negro"],
        materials: ["sintetico"],
        isNew: true,
        inStock: true,
        description: "Zapatillas urbanas con diseño contemporáneo"
    },
    {
        id: 1602,
        name: "Sneakers High Top Black",
        price: 2099,
        originalPrice: 2599,
        image: "images/acceso_snecker_1.jpg",
        category: "shoes",
        sizes: ["37", "38", "39", "40", "41", "42"],
        colors: ["Negro"],
        materials: ["textil", "sintetico"],
        isNew: true,
        inStock: true,
        description: "Zapatillas botín urbanas con diseño contemporáneo"
    },
    {
        id: 1701,
        name: "Lentes de Sol Classic",
        price: 699,
        originalPrice: 899,
        image: "images/acceso_glass_1.jpg",
        category: "sunglasses",
        sizes: ["Único"],
        colors: ["Negro"],
        materials: ["metal"],
        isNew: false,
        inStock: true,
        description: "Lentes de sol con protección UV y estilo minimalista"
    },
    {
        id: 1702,
        name: "Lentes Clear Frame",
        price: 599,
        originalPrice: null,
        image: "images/acceso_glass_2.jpg",
        category: "sunglasses",
        sizes: ["Único"],
        colors: ["Negro", "Blanco"],
        materials: ["metal"],
        isNew: true,
        inStock: true,
        description: "Lentes con montura transparente y estilo urbano"
    }
];

// Estado de la aplicación
class AccessoriesState {
    constructor() {
        this.currentCategory = 'all';
        this.currentSort = 'default';
        this.currentView = 'grid';
        this.currentPage = 1;
        this.filters = {
            priceMax: 5000,
            materials: [],
            colors: [],
            features: []
        };
        this.cart = JSON.parse(localStorage.getItem('urbanCatsCart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('urbanCatsWishlist')) || [];
        this.filteredProducts = [...accessoriesProducts];
    }

    saveCart() {
        localStorage.setItem('urbanCatsCart', JSON.stringify(this.cart));
    }

    saveWishlist() {
        localStorage.setItem('urbanCatsWishlist', JSON.stringify(this.wishlist));
    }
}

// Clase principal
class AccessoriesApp {
    constructor() {
        this.state = new AccessoriesState();
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

        // Material filters
        this.elements.filterOptions.forEach(option => {
            option.addEventListener('click', (e) => this.handleMaterialFilter(e));
        });

        // Color filters
        this.elements.colorFilters.forEach(filter => {
            filter.addEventListener('click', (e) => this.handleColorFilter(e));
        });

        // Feature checkboxes
        this.elements.checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => this.handleFeatureFilter(e));
        });

        // Carrito – manejado por cartSystem (cart.js)

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

        this.elements.categoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        this.state.currentCategory = category;
        this.state.currentPage = 1;

        this.applyFilters();
        this.animateProducts();
    }

    // Filter handling
    toggleFilters() {
        this.elements.filterPanel.classList.toggle('active');
        this.elements.filterToggle?.classList.toggle('active');
    }

    clearAllFilters() {
        this.state.filters = {
            priceMax: 5000,
            materials: [],
            colors: [],
            features: []
        };

        if (this.elements.priceSlider) {
            this.elements.priceSlider.value = 5000;
            this.elements.maxPrice.textContent = '$5,000';
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

    handleMaterialFilter(e) {
        const material = e.currentTarget.dataset.material;
        const index = this.state.filters.materials.indexOf(material);

        if (index === -1) {
            this.state.filters.materials.push(material);
            e.currentTarget.classList.add('active');
        } else {
            this.state.filters.materials.splice(index, 1);
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
        const feature = e.target.dataset.filter;
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
        this.elements.sortMenu?.classList.toggle('active');
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
        switch (this.state.currentSort) {
            case 'price-low':
                this.state.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.state.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                this.state.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'newest':
                this.state.filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                break;
            default:
                break;
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
        let filtered = [...accessoriesProducts];

        // Category filter — each section has an exclusive ID range
        const categoryIdRanges = {
            'bags': { min: 1201, max: 1299 },
            'caps': { min: 1301, max: 1399 },
            'watches': { min: 1401, max: 1499 },
            'jewelry': { min: 1501, max: 1599 },
            'shoes': { min: 1601, max: 1699 },
            'sunglasses': { min: 1701, max: 1799 }
        };
        const range = categoryIdRanges[this.state.currentCategory];
        if (range) {
            filtered = filtered.filter(p => p.id >= range.min && p.id <= range.max);
        }

        // Price filter
        filtered = filtered.filter(p => p.price <= this.state.filters.priceMax);

        // Material filter
        if (this.state.filters.materials.length > 0) {
            filtered = filtered.filter(p =>
                this.state.filters.materials.some(material => p.materials.includes(material))
            );
        }

        // Color filter
        if (this.state.filters.colors.length > 0) {
            filtered = filtered.filter(p =>
                this.state.filters.colors.some(color => p.colors.includes(color))
            );
        }

        // Feature filters
        if (this.state.filters.features.includes('nuevo')) {
            filtered = filtered.filter(p => p.isNew);
        }
        if (this.state.filters.features.includes('oferta')) {
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

        const start = (this.state.currentPage - 1) * ACCESSORIES_CONFIG.productsPerPage;
        const end = start + ACCESSORIES_CONFIG.productsPerPage;
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

        this.elements.productsGrid.innerHTML = pageProducts.map((product) => `
            <article class="product-card" data-product-id="${product.id}" onclick="accessoriesApp.openProductModal(${product.id})">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    ${product.isNew ? '<span class="product-badge new">Nuevo</span>' : ''}
                    ${product.originalPrice ? '<span class="product-badge sale">Oferta</span>' : ''}
                    ${!product.inStock ? '<span class="product-badge out-of-stock">Agotado</span>' : ''}

                    <button class="product-wishlist-btn ${this.state.wishlist.some(w => (w?.id ?? w) === product.id) ? 'active' : ''}" onclick="event.stopPropagation(); accessoriesApp.toggleWishlist(${product.id})" aria-label="Agregar a favoritos">
                        <i class="fas fa-heart"></i>
                    </button>

                    <div class="product-overlay">
                        <div class="product-overlay-details">
                            <h3>${product.name}</h3>
                            <p>${product.description}</p>
                            <div class="product-overlay-price">
                                <span>$${product.price.toLocaleString()}</span>
                                ${product.originalPrice ? `<span class="product-overlay-original">$${product.originalPrice.toLocaleString()}</span>` : ''}
                            </div>
                        </div>
                        <button class="product-add-btn" onclick="event.stopPropagation(); accessoriesApp.openProductModal(${product.id})">
                            <i class="fas fa-eye"></i>
                            Ver
                        </button>
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

        const totalPages = Math.ceil(this.state.filteredProducts.length / ACCESSORIES_CONFIG.productsPerPage);

        if (totalPages <= 1) {
            this.elements.pagination.innerHTML = '';
            return;
        }

        let html = '';

        html += `
            <button class="pagination-btn pagination-arrow ${this.state.currentPage === 1 ? 'disabled' : ''}"
                    ${this.state.currentPage === 1 ? 'disabled' : `onclick="accessoriesApp.goToPage(${this.state.currentPage - 1})"`}>
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.state.currentPage - 1 && i <= this.state.currentPage + 1)) {
                html += `
                    <button class="pagination-btn ${i === this.state.currentPage ? 'active' : ''}"
                            onclick="accessoriesApp.goToPage(${i})">
                        ${i}
                    </button>
                `;
            } else if (i === this.state.currentPage - 2 || i === this.state.currentPage + 2) {
                html += '<span class="pagination-dots">·····</span>';
            }
        }

        html += `
            <button class="pagination-btn pagination-arrow ${this.state.currentPage === totalPages ? 'disabled' : ''}"
                    ${this.state.currentPage === totalPages ? 'disabled' : `onclick="accessoriesApp.goToPage(${this.state.currentPage + 1})"`}>
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        this.elements.pagination.innerHTML = html;
    }

    goToPage(page) {
        this.state.currentPage = page;
        this.renderProducts();
        const nav = document.querySelector('.category-navigation');
        if (nav) nav.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Cart functionality – delega a cartSystem (cart.js)
    addToCart(productId) {
        const product = accessoriesProducts.find(p => p.id === productId);
        if (!product || !product.inStock) return;
        cartSystem.addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            selectedSize: product.sizes && product.sizes[0] ? product.sizes[0] : 'Único',
            selectedColor: product.colors && product.colors[0] ? product.colors[0] : ''
        });
        this.showToast(`${product.name} agregado al carrito`, 'success');
    }

    removeFromCart(productId) {
        cartSystem.removeFromCart(productId);
    }

    updateQuantity(productId, change) {
        cartSystem.updateQuantity(productId, change);
    }

    toggleCart() {
        cartSystem.toggleCart();
    }

    closeCart() {
        cartSystem.closeCart();
    }

    updateCartUI() {
        cartSystem.refresh();
    }

    // Wishlist functionality
    toggleWishlist(productId) {
        const index = this.state.wishlist.findIndex(item => (item?.id ?? item) === productId);
        const product = accessoriesProducts.find(p => p.id === productId);

        if (index === -1) {
            this.state.wishlist.push({ id: product.id, name: product.name, price: product.price, image: product.image,
                description: product.description || '', sizes: product.sizes || [], colors: product.colors || [],
                originalPrice: product.originalPrice || null, isNew: !!product.isNew, inStock: product.inStock !== false });
            this.showToast(`${product.name} agregado a favoritos`, 'success');
        } else {
            this.state.wishlist.splice(index, 1);
            this.showToast(`${product.name} eliminado de favoritos`, 'info');
        }

        this.state.saveWishlist();
        this.updateWishlistUI();
        cartSystem.refreshWishlist();
        const btn = document.querySelector(`[data-product-id="${productId}"] .product-wishlist-btn`);
        if (btn) btn.classList.toggle('active', index === -1);
    }

    updateWishlistUI() {
        if (this.elements.wishlistCount) {
            const count = this.state.wishlist.filter(i => i && typeof i === 'object' && i.id).length;
            this.elements.wishlistCount.textContent = count;
            this.elements.wishlistCount.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    // ── Product Quick Modal ──────────────────────────────────
    openProductModal(productId) {
        const product = accessoriesProducts.find(p => p.id === productId);
        if (!product) return;

        const existing = document.getElementById('product-quick-modal');
        if (existing) existing.remove();

        this._modalSelectedSize = product.sizes && product.sizes[0] ? product.sizes[0] : 'Único';
        const isInWishlist = this.state.wishlist.some(item => (item?.id ?? item) === productId);
        const discountPct = product.originalPrice
            ? Math.round((1 - product.price / product.originalPrice) * 100)
            : 0;

        const modal = document.createElement('div');
        modal.id = 'product-quick-modal';
        modal.className = 'pqm-overlay';
        modal.innerHTML = `
            <div class="pqm-modal" role="dialog" aria-modal="true">
                <button class="pqm-close" id="pqm-close-btn" aria-label="Cerrar">
                    <i class="fas fa-times"></i>
                </button>
                <div class="pqm-image">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="pqm-badges">
                        ${product.isNew ? '<span class="pqm-badge pqm-badge--new">Nuevo</span>' : ''}
                        ${product.originalPrice ? `<span class="pqm-badge pqm-badge--sale">-${discountPct}%</span>` : ''}
                    </div>
                </div>
                <div class="pqm-details">
                    <h2 class="pqm-name">${product.name}</h2>
                    <p class="pqm-desc">${product.description}</p>
                    <div class="pqm-price">
                        <span class="pqm-price-current">$${product.price.toLocaleString('es-MX')}</span>
                        ${product.originalPrice ? `<span class="pqm-price-original">$${product.originalPrice.toLocaleString('es-MX')}</span>` : ''}
                    </div>
                    <div class="pqm-sizes-section">
                        <p class="pqm-sizes-label">Talla: <strong id="pqm-selected-size">${this._modalSelectedSize}</strong></p>
                        <div class="pqm-sizes-grid">
                            ${product.sizes.map(size => `
                                <button class="pqm-size-btn ${size === this._modalSelectedSize ? 'active' : ''}"
                                        data-size="${size}"
                                        onclick="accessoriesApp._selectModalSize('${size}')">
                                    ${size}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    <div class="pqm-actions">
                        <button class="pqm-add-cart-btn ${!product.inStock ? 'disabled' : ''}"
                                ${!product.inStock ? 'disabled' : ''}
                                onclick="accessoriesApp._modalAddToCart(${product.id})">
                            <i class="fas fa-shopping-bag"></i>
                            ${product.inStock ? 'Agregar al carrito' : 'Agotado'}
                        </button>
                        <button class="pqm-wishlist-btn ${isInWishlist ? 'active' : ''}"
                                onclick="accessoriesApp._modalToggleWishlist(${product.id})"
                                aria-label="${isInWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        setTimeout(() => modal.classList.add('active'), 10);

        document.getElementById('pqm-close-btn').addEventListener('click', () => this.closeProductModal());
        modal.addEventListener('click', e => { if (e.target === modal) this.closeProductModal(); });
    }

    _selectModalSize(size) {
        this._modalSelectedSize = size;
        const label = document.getElementById('pqm-selected-size');
        if (label) label.textContent = size;
        document.querySelectorAll('.pqm-size-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.size === size);
        });
    }

    _modalAddToCart(productId) {
        const product = accessoriesProducts.find(p => p.id === productId);
        if (!product || !product.inStock) return;
        cartSystem.addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            selectedSize: this._modalSelectedSize || (product.sizes[0] || 'Único'),
            selectedColor: product.colors && product.colors[0] ? product.colors[0] : ''
        });
        this.showToast(`${product.name} agregado al carrito`, 'success');
        this.closeProductModal();
    }

    _modalToggleWishlist(productId) {
        this.toggleWishlist(productId);
        const btn = document.querySelector('.pqm-wishlist-btn');
        if (btn) btn.classList.toggle('active', this.state.wishlist.some(item => (item?.id ?? item) === productId));
    }

    closeProductModal() {
        const modal = document.getElementById('product-quick-modal');
        if (!modal) return;
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            if (!document.getElementById('cart-sidebar')?.classList.contains('open')) {
                document.body.style.overflow = '';
            }
        }, 300);
    }

    // Quick view
    quickView(productId) {
        this.openProductModal(productId);
    }

    // Mobile menu
    toggleMobileMenu() {
        const nav = document.querySelector('.nav-menu');
        nav?.classList.toggle('active');
        this.elements.mobileMenuToggle?.classList.toggle('active');
    }

    // Scroll handling
    handleScroll() {
        if (this.elements.navbar) {
            if (window.scrollY > 100) {
                this.elements.navbar.classList.add('scrolled');
            } else {
                this.elements.navbar.classList.remove('scrolled');
            }
        }

        if (this.elements.backToTop) {
            if (window.scrollY > 500) {
                this.elements.backToTop.classList.add('visible');
            } else {
                this.elements.backToTop.classList.remove('visible');
            }
        }
    }

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Animations
    setupScrollAnimations() {
        const check = () => {
            document.querySelectorAll('.product-card:not(.revealed)').forEach((card, index) => {
                const rect = card.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
                    setTimeout(() => card.classList.add('revealed'), index * 80);
                }
            });
        };
        window.addEventListener('scroll', check, { passive: true });
    }

    animateOnLoad() {
        // Handled by revealVisibleCards via .revealed class
    }

    animateProducts() {
        this.elements.productsGrid.style.opacity = '0';

        setTimeout(() => {
            this.renderProducts();
            this.elements.productsGrid.style.opacity = '1';
        }, ACCESSORIES_CONFIG.filterTransition);
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
        }, ACCESSORIES_CONFIG.notificationDuration);
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

    getColorValue(colorName) {
        const colors = {
            'Negro': '#000000',
            'Blanco': '#FFFFFF',
            'Gris': '#808080',
            'Marrón': '#8B4513',
            'Azul': '#2563EB'
        };
        return colors[colorName] || '#000000';
    }

    handleClickOutside(e) {
        if (this.elements.sortMenu?.classList.contains('active')) {
            if (!e.target.closest('.sort-dropdown')) {
                this.elements.sortMenu.classList.remove('active');
            }
        }

        if (this.elements.filterPanel?.classList.contains('active')) {
            if (!e.target.closest('.filters-section') && !e.target.closest('.filter-toggle-btn')) {
                this.elements.filterPanel.classList.remove('active');
                this.elements.filterToggle?.classList.remove('active');
            }
        }
    }

    handleKeyboard(e) {
        if (e.key === 'Escape') {
            this.closeProductModal();
            this.closeCart();
            this.elements.sortMenu?.classList.remove('active');
            this.elements.filterPanel?.classList.remove('active');
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
window.accessoriesApp = null;
document.addEventListener('DOMContentLoaded', () => {
    window.accessoriesApp = new AccessoriesApp();
    if (typeof cartSystem !== 'undefined') cartSystem.registerSearchProducts(accessoriesProducts, 'accessories.html');
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

// Inyectar estilos específicos para Accessories
const accessoriesStyles = `
<style>
/* Accessories Section Specific Styles */
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

* { margin: 0; padding: 0; box-sizing: border-box; }

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

/* Product Card - Lookbook Style */
.product-card {
    background: var(--pure-white);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: var(--shadow-light);
    cursor: pointer;
    opacity: 1;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
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
    transition: transform 0.6s ease, filter 0.6s ease;
}

.product-card:hover .product-image {
    transform: scale(1.05);
    filter: contrast(1.1);
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
    z-index: 3;
}

.product-badge.new { background: var(--accent-gold); color: var(--primary-black); }
.product-badge.sale { background: var(--accent-red); color: var(--pure-white); top: 50px; }
.product-badge.out-of-stock { background: var(--gray-medium); color: var(--pure-white); }

/* Wishlist button top-right */
.product-wishlist-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(8px);
    color: var(--primary-black);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transform: translateX(10px);
    transition: all 0.3s ease;
    z-index: 4;
    box-shadow: 0 2px 10px rgba(0,0,0,0.15);
}

.product-card:hover .product-wishlist-btn {
    opacity: 1;
    transform: translateX(0);
}

.product-wishlist-btn:hover {
    background: var(--primary-black);
    color: var(--pure-white);
}

.product-wishlist-btn.active {
    opacity: 1;
    background: #fff0f0;
    color: #e74c3c;
}

/* Overlay - lookbook style */
.product-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
        45deg,
        rgba(0, 0, 0, 0.82) 0%,
        transparent 50%,
        rgba(0, 0, 0, 0.65) 100%
    );
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 28px;
    opacity: 0;
    transition: opacity 0.35s ease;
    z-index: 2;
}

.product-card:hover .product-overlay { opacity: 1; }

.product-overlay-details { color: var(--pure-white); }

.product-overlay-details h3 {
    font-size: 20px;
    font-weight: 400;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
    transform: translateY(20px);
    transition: transform 0.35s ease;
}

.product-card:hover .product-overlay-details h3 { transform: translateY(0); }

.product-overlay-details p {
    font-size: 13px;
    opacity: 0.88;
    line-height: 1.5;
    margin-bottom: 14px;
    transform: translateY(20px);
    transition: transform 0.35s ease 0.05s;
}

.product-card:hover .product-overlay-details p { transform: translateY(0); }

.product-overlay-price {
    display: flex;
    align-items: center;
    gap: 10px;
    transform: translateY(20px);
    transition: transform 0.35s ease 0.1s;
}

.product-card:hover .product-overlay-price { transform: translateY(0); }

.product-overlay-price span:first-child {
    font-size: 20px;
    font-weight: 600;
    color: #ffffff;
}

.product-overlay-original {
    font-size: 14px;
    color: rgba(255,255,255,0.55);
    text-decoration: line-through;
}

/* Botón Ver */
.product-add-btn {
    background: var(--pure-white);
    color: var(--primary-black);
    border: none;
    padding: 11px 22px;
    border-radius: 25px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    align-self: center;
    width: fit-content;
    transform: translateY(40px);
    transition: transform 0.35s ease 0.12s, background 0.2s ease, color 0.2s ease;
}

.product-card:hover .product-add-btn { transform: translateY(0); }

.product-add-btn:hover {
    background: var(--primary-black);
    color: var(--pure-white);
}

.product-add-btn:disabled {
    background: var(--gray-medium);
    color: var(--pure-white);
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

.cart-item-image { width: 80px; height: 80px; object-fit: cover; border-radius: 10px; }
.cart-item-info { flex: 1; }
.cart-item-info h4 { font-size: 16px; font-weight: 500; margin-bottom: 5px; }

.cart-item-details {
    display: flex;
    gap: 15px;
    font-size: 13px;
    color: var(--gray-medium);
    margin-bottom: 10px;
}

.cart-item-price { font-weight: 600; margin-bottom: 10px; }
.quantity-controls { display: flex; align-items: center; gap: 10px; }

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

.qty-btn:hover { background: var(--primary-black); color: var(--pure-white); }
.quantity { font-weight: 600; min-width: 25px; text-align: center; }

.remove-item {
    background: none;
    border: none;
    color: var(--gray-medium);
    cursor: pointer;
    padding: 10px;
    border-radius: 5px;
    transition: var(--transition);
}

.remove-item:hover { color: var(--accent-red); background: rgba(255, 0, 0, 0.1); }

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

.toast.show { transform: translateX(0); opacity: 1; }
.toast-success { background: #10B981; }
.toast-error { background: var(--accent-red); }
.toast-warning { background: #F59E0B; }
.toast-info { background: #3B82F6; }
.toast-content { display: flex; align-items: center; gap: 10px; }

.toast-close {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    padding: 5px;
    opacity: 0.7;
    transition: var(--transition);
}

.toast-close:hover { opacity: 1; }

/* No Products */
.no-products {
    grid-column: 1 / -1;
    text-align: center;
    padding: 80px 20px;
    color: var(--gray-medium);
}

.no-products h3 { font-size: 24px; color: var(--primary-black); margin-bottom: 10px; font-weight: 500; }
.no-products p { font-size: 16px; }

/* Responsive */
@media (max-width: 768px) {
    .cart-item { padding: 15px; }
    .cart-item-image { width: 60px; height: 60px; }
    .cart-item-details { flex-direction: column; gap: 5px; }
    .toast { right: 20px; left: 20px; max-width: none; }
}

@media (max-width: 480px) {
    .product-card { border-radius: 15px; }
}

/* ── Product Quick Modal (pqm) ── */
.pqm-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    z-index: 9000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.pqm-overlay.active { opacity: 1; }

.pqm-modal {
    background: #fff;
    border-radius: 20px;
    width: 100%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    position: relative;
    transform: translateY(30px);
    transition: transform 0.3s ease;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.pqm-overlay.active .pqm-modal { transform: translateY(0); }

.pqm-close {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: rgba(0,0,0,0.08);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    transition: background 0.2s;
}

.pqm-close:hover { background: rgba(0,0,0,0.15); }

.pqm-image {
    position: relative;
    border-radius: 20px 0 0 20px;
    overflow: hidden;
    aspect-ratio: 3/4;
}

.pqm-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.pqm-badges {
    position: absolute;
    top: 15px;
    left: 15px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.pqm-badge {
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
}

.pqm-badge--new { background: #D4AF37; color: #0a0a0a; }
.pqm-badge--sale { background: #E74C3C; color: #fff; }

.pqm-details {
    padding: 40px 35px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.pqm-name {
    font-size: 22px;
    font-weight: 500;
    color: #0a0a0a;
    line-height: 1.3;
}

.pqm-desc {
    font-size: 14px;
    color: #999;
    line-height: 1.6;
}

.pqm-price {
    display: flex;
    align-items: center;
    gap: 12px;
}

.pqm-price-current {
    font-size: 26px;
    font-weight: 600;
    color: #0a0a0a;
}

.pqm-price-original {
    font-size: 16px;
    color: #bbb;
    text-decoration: line-through;
}

.pqm-sizes-label {
    font-size: 14px;
    color: #555;
    margin-bottom: 10px;
}

.pqm-sizes-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.pqm-size-btn {
    padding: 8px 16px;
    border: 1.5px solid #e5e5e5;
    background: transparent;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #0a0a0a;
}

.pqm-size-btn:hover,
.pqm-size-btn.active {
    background: #0a0a0a;
    color: #fff;
    border-color: #0a0a0a;
}

.pqm-actions {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-top: auto;
}

.pqm-add-cart-btn {
    flex: 1;
    padding: 14px 20px;
    background: #0a0a0a;
    color: #fff;
    border: none;
    border-radius: 30px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.2s ease;
}

.pqm-add-cart-btn:hover { background: #333; }
.pqm-add-cart-btn.disabled { background: #999; cursor: not-allowed; }

.pqm-wishlist-btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1.5px solid #e5e5e5;
    background: transparent;
    color: #0a0a0a;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    flex-shrink: 0;
}

.pqm-wishlist-btn:hover,
.pqm-wishlist-btn.active {
    background: #0a0a0a;
    color: #fff;
    border-color: #0a0a0a;
}

@media (max-width: 640px) {
    .pqm-modal {
        grid-template-columns: 1fr;
        max-height: 95vh;
    }
    .pqm-image {
        border-radius: 20px 20px 0 0;
        aspect-ratio: 4/3;
    }
    .pqm-details { padding: 25px 20px; }
}
</style>
`;

// Inyectar estilos
document.head.insertAdjacentHTML('beforeend', accessoriesStyles);
