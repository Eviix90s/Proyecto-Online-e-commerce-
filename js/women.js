// Urban Cats - Women Section JavaScript
'use strict';

// Configuración
const WOMEN_CONFIG = {
    productsPerPage: 12,
    animationDelay: 100,
    filterTransition: 400,
    notificationDuration: 3000
};

// Datos de productos de mujer
const womenProducts = [
    {
        id: 101,
        name: "Crop Top Minimal",
        price: 599,
        originalPrice: 799,
        image: "images/crop_top_1.jpg",
        category: "tops",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Negro", "Blanco"],
        isNew: true,
        inStock: true,
        description: "Crop top minimalista con diseño japonés"
    },
    {
        id: 102,
        name: "Vestido Urban Chic",
        price: 1099,
        originalPrice: null,
        image: "images/vestido_1.jpg",
        category: "dresses",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Negro", "Gris"],
        isNew: true,
        inStock: true,
        description: "Vestido elegante con inspiración urbana"
    },
    {
        id: 103,
        name: "Sudadera Oversized",
        price: 899,
        originalPrice: 1199,
        image: "images/sudadera_1.jpg",
        category: "tops",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Negro", "Gris", "Beige"],
        isNew: false,
        inStock: true,
        description: "Sudadera oversized perfecta para el día a día"
    },
    {
        id: 104,
        name: "Jeans Mom Fit",
        price: 1299,
        originalPrice: null,
        image: "images/jeans_1.jpg",
        category: "bottoms",
        sizes: ["26", "28", "30", "32"],
        colors: ["Azul", "Negro"],
        isNew: false,
        inStock: true,
        description: "Jeans con corte mom fit y estilo urbano"
    },
    {
        id: 105,
        name: "Blazer Minimal",
        price: 1799,
        originalPrice: 2299,
        image: "images/mujer_1.jpg",
        category: "outerwear",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Negro", "Beige"],
        isNew: true,
        inStock: true,
        description: "Blazer minimalista con líneas limpias"
    },
    {
        id: 106,
        name: "Falda Plisada",
        price: 799,
        originalPrice: null,
        image: "images/look_2.jpg",
        category: "bottoms",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Negro", "Gris"],
        isNew: false,
        inStock: true,
        description: "Falda plisada con inspiración japonesa"
    },
    {
        id: 107,
        name: "Camiseta Básica",
        price: 499,
        originalPrice: null,
        image: "images/look_8.jpg",
        category: "tops",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Blanco", "Negro", "Gris", "Beige"],
        isNew: false,
        inStock: true,
        description: "Camiseta básica esencial de alta calidad"
    },
    {
        id: 108,
        name: "Conjunto Deportivo",
        price: 1599,
        originalPrice: 1999,
        image: "images/look_14.jpg",
        category: "sets",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Negro", "Gris"],
        isNew: true,
        inStock: true,
        description: "Set completo deportivo urbano"
    },
    {
        id: 109,
        name: "Abrigo Largo",
        price: 2299,
        originalPrice: null,
        image: "images/chaqueta_denim_1.jpg",
        category: "outerwear",
        sizes: ["S", "M", "L"],
        colors: ["Negro", "Beige"],
        isNew: true,
        inStock: true,
        description: "Abrigo largo con estilo minimalista"
    },
    {
        id: 110,
        name: "Pantalón Wide Leg",
        price: 1199,
        originalPrice: null,
        image: "images/look_1.jpg",
        category: "bottoms",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Negro", "Beige"],
        isNew: false,
        inStock: true,
        description: "Pantalón ancho con caída perfecta"
    },
    {
        id: 111,
        name: "Top Halter",
        price: 699,
        originalPrice: 899,
        image: "images/look_7.jpg",
        category: "tops",
        sizes: ["XS", "S", "M"],
        colors: ["Negro", "Blanco"],
        isNew: false,
        inStock: true,
        description: "Top halter con diseño moderno"
    },
    {
        id: 112,
        name: "Vestido Midi",
        price: 1299,
        originalPrice: null,
        image: "images/look_10.jpg",
        category: "dresses",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Negro", "Gris"],
        isNew: true,
        inStock: true,
        description: "Vestido midi elegante y versátil"
    }
];

// Estado de la aplicación
class WomenState {
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
        this.filteredProducts = [...womenProducts];
    }

    saveCart() {
        localStorage.setItem('urbanCatsCart', JSON.stringify(this.cart));
    }

    saveWishlist() {
        localStorage.setItem('urbanCatsWishlist', JSON.stringify(this.wishlist));
    }
}

// Clase principal
class WomenApp {
    constructor() {
        this.state = new WomenState();
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

        this.state.currentCategory = category;
        this.state.currentPage = 1;
        this.applyFilters();
    }

    // Filter toggle
    toggleFilters() {
        this.elements.filterPanel.classList.toggle('active');
        this.elements.filterToggle.classList.toggle('active');
    }

    // Sort menu
    toggleSortMenu() {
        this.elements.sortMenu.classList.toggle('active');
    }

    handleSortChange(e) {
        const sortType = e.target.dataset.sort;
        
        // Update active state
        this.elements.sortOptions.forEach(opt => opt.classList.remove('active'));
        e.target.classList.add('active');

        this.state.currentSort = sortType;
        this.sortProducts();
        this.elements.sortMenu.classList.remove('active');
    }

    sortProducts() {
        const products = [...this.state.filteredProducts];

        switch(this.state.currentSort) {
            case 'price-low':
                products.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                products.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                products.sort((a, b) => b.isNew - a.isNew);
                break;
            case 'name':
                products.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                // Keep default order
                break;
        }

        this.state.filteredProducts = products;
        this.renderProducts();
    }

    // View change
    handleViewChange(e) {
        const view = e.currentTarget.dataset.view;
        
        this.elements.viewBtns.forEach(btn => btn.classList.remove('active'));
        e.currentTarget.classList.add('active');

        this.state.currentView = view;
        
        if (view === 'list') {
            this.elements.productsGrid.classList.add('list-view');
        } else {
            this.elements.productsGrid.classList.remove('list-view');
        }
    }

    // Price filter
    handlePriceChange(e) {
        const value = e.target.value;
        this.state.filters.priceMax = parseInt(value);
        this.elements.maxPrice.textContent = `$${parseInt(value).toLocaleString()}`;
        this.applyFilters();
    }

    // Size filter
    handleSizeFilter(e) {
        const option = e.currentTarget;
        const size = option.dataset.size.toUpperCase();
        
        option.classList.toggle('active');
        
        if (this.state.filters.sizes.includes(size)) {
            this.state.filters.sizes = this.state.filters.sizes.filter(s => s !== size);
        } else {
            this.state.filters.sizes.push(size);
        }
        
        this.applyFilters();
    }

    // Color filter
    handleColorFilter(e) {
        const filter = e.currentTarget;
        const color = filter.dataset.color;
        
        filter.classList.toggle('active');
        
        if (this.state.filters.colors.includes(color)) {
            this.state.filters.colors = this.state.filters.colors.filter(c => c !== color);
        } else {
            this.state.filters.colors.push(color);
        }
        
        this.applyFilters();
    }

    // Feature filter
    handleFeatureFilter(e) {
        const feature = e.target.dataset.filter;
        
        if (e.target.checked) {
            this.state.filters.features.push(feature);
        } else {
            this.state.filters.features = this.state.filters.features.filter(f => f !== feature);
        }
        
        this.applyFilters();
    }

    // Apply all filters
    applyFilters() {
        let products = [...womenProducts];

        // Category filter
        if (this.state.currentCategory !== 'all') {
            products = products.filter(p => p.category === this.state.currentCategory);
        }

        // Price filter
        products = products.filter(p => p.price <= this.state.filters.priceMax);

        // Size filter
        if (this.state.filters.sizes.length > 0) {
            products = products.filter(p => 
                p.sizes.some(size => this.state.filters.sizes.includes(size))
            );
        }

        // Color filter
        if (this.state.filters.colors.length > 0) {
            products = products.filter(p => 
                p.colors.some(color => this.state.filters.colors.includes(color.toLowerCase()))
            );
        }

        // Feature filters
        if (this.state.filters.features.includes('nuevo')) {
            products = products.filter(p => p.isNew);
        }
        if (this.state.filters.features.includes('oferta')) {
            products = products.filter(p => p.originalPrice);
        }
        if (this.state.filters.features.includes('stock')) {
            products = products.filter(p => p.inStock);
        }

        this.state.filteredProducts = products;
        this.sortProducts();
        this.updateProductsCount();
    }

    // Clear all filters
    clearAllFilters() {
        // Reset state
        this.state.filters = {
            priceMax: 3000,
            sizes: [],
            colors: [],
            features: []
        };

        // Reset UI
        this.elements.priceSlider.value = 3000;
        this.elements.maxPrice.textContent = '$3,000';
        
        this.elements.filterOptions.forEach(opt => opt.classList.remove('active'));
        this.elements.colorFilters.forEach(filter => filter.classList.remove('active'));
        this.elements.checkboxes.forEach(checkbox => checkbox.checked = false);

        this.applyFilters();
        this.showToast('Filtros limpiados', 'info');
    }

    // Update products count
    updateProductsCount() {
        if (this.elements.productsCount) {
            this.elements.productsCount.textContent = this.state.filteredProducts.length;
        }
    }

    // Render products
    renderProducts() {
        if (!this.elements.productsGrid) return;

        const startIndex = (this.state.currentPage - 1) * WOMEN_CONFIG.productsPerPage;
        const endIndex = startIndex + WOMEN_CONFIG.productsPerPage;
        const productsToShow = this.state.filteredProducts.slice(startIndex, endIndex);

        if (productsToShow.length === 0) {
            this.elements.productsGrid.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-search" style="font-size: 64px; color: var(--gray-medium); opacity: 0.3; margin-bottom: 20px;"></i>
                    <h3>No se encontraron productos</h3>
                    <p>Intenta ajustar los filtros para ver más resultados</p>
                </div>
            `;
            return;
        }

        this.elements.productsGrid.innerHTML = productsToShow.map(product => 
            this.createProductCard(product)
        ).join('');

        this.animateProductCards();
    }

    createProductCard(product) {
        const isInWishlist = this.state.wishlist.some(item => item.id === product.id);
        const discount = product.originalPrice ? 
            Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

        return `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                    <div class="product-overlay">
                        <div class="product-actions">
                            <button class="action-btn quick-view-btn" onclick="womenApp.quickView(${product.id})" title="Vista rápida">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn wishlist-btn ${isInWishlist ? 'active' : ''}" 
                                    onclick="womenApp.toggleWishlist(${product.id})" title="Agregar a favoritos">
                                <i class="fas fa-heart"></i>
                            </button>
                            <button class="action-btn share-btn" onclick="womenApp.shareProduct(${product.id})" title="Compartir">
                                <i class="fas fa-share"></i>
                            </button>
                        </div>
                    </div>
                    ${product.isNew ? '<span class="product-badge new">Nuevo</span>' : ''}
                    ${discount > 0 ? `<span class="product-badge discount">-${discount}%</span>` : ''}
                    ${!product.inStock ? '<span class="product-badge out-of-stock">Agotado</span>' : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-pricing">
                        <span class="product-price">$${product.price.toLocaleString()}</span>
                        ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toLocaleString()}</span>` : ''}
                    </div>
                    <div class="product-colors">
                        ${product.colors.map(color => `
                            <span class="color-option" style="background-color: ${this.getColorCode(color)}" 
                                  title="${color}"></span>
                        `).join('')}
                    </div>
                    <div class="product-sizes">
                        ${product.sizes.map(size => `
                            <button class="size-option ${!product.inStock ? 'disabled' : ''}" 
                                    onclick="womenApp.addToCart(${product.id}, '${size}')" 
                                    ${!product.inStock ? 'disabled' : ''}>${size}</button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    getColorCode(colorName) {
        const colorMap = {
            'Negro': '#000000',
            'Blanco': '#FFFFFF',
            'Gris': '#808080',
            'Beige': '#F5F5DC',
            'Azul': '#2563EB'
        };
        return colorMap[colorName] || '#CCCCCC';
    }

    animateProductCards() {
        const cards = document.querySelectorAll('.product-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * WOMEN_CONFIG.animationDelay);
        });
    }

    // Cart functions
    addToCart(productId, size) {
        const product = womenProducts.find(p => p.id === productId);
        if (!product || !product.inStock) {
            this.showToast('Producto no disponible', 'error');
            return;
        }

        const existingItem = this.state.cart.find(item => item.id === productId && item.size === size);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.state.cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                size: size,
                quantity: 1,
                color: product.colors[0]
            });
        }

        this.state.saveCart();
        this.updateCartUI();
        this.showToast('Producto agregado al carrito', 'success');
        this.animateCartIcon();
    }

    removeFromCart(productId, size) {
        this.state.cart = this.state.cart.filter(item => !(item.id === productId && item.size === size));
        this.state.saveCart();
        this.updateCartUI();
    }

    updateCartUI() {
        const totalItems = this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = this.state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        if (this.elements.cartCount) {
            this.elements.cartCount.textContent = totalItems;
            this.elements.cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }

        if (this.elements.cartTotal) {
            this.elements.cartTotal.textContent = totalPrice.toLocaleString();
        }

        this.renderCartItems();
    }

    renderCartItems() {
        if (!this.elements.cartItems) return;

        if (this.state.cart.length === 0) {
            this.elements.cartItems.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">
                        <i class="fas fa-shopping-bag"></i>
                    </div>
                    <h4>Tu carrito está vacío</h4>
                    <p>Agrega algunos productos increíbles</p>
                </div>
            `;
            return;
        }

        this.elements.cartItems.innerHTML = this.state.cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-details">
                        <span>Talla: ${item.size}</span>
                        <span>Color: ${item.color}</span>
                    </div>
                    <div class="cart-item-price">$${item.price.toLocaleString()}</div>
                    <div class="quantity-controls">
                        <button onclick="womenApp.updateQuantity(${item.id}, '${item.size}', ${item.quantity - 1})" 
                                class="qty-btn">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button onclick="womenApp.updateQuantity(${item.id}, '${item.size}', ${item.quantity + 1})" 
                                class="qty-btn">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <button onclick="womenApp.removeFromCart(${item.id}, '${item.size}')" 
                        class="remove-item" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    updateQuantity(productId, size, newQuantity) {
        if (newQuantity <= 0) {
            this.removeFromCart(productId, size);
            return;
        }

        const item = this.state.cart.find(item => item.id === productId && item.size === size);
        if (item) {
            item.quantity = newQuantity;
            this.state.saveCart();
            this.updateCartUI();
        }
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

    animateCartIcon() {
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

    // Wishlist functions
    toggleWishlist(productId) {
        const product = womenProducts.find(p => p.id === productId);
        const existingIndex = this.state.wishlist.findIndex(item => item.id === productId);

        if (existingIndex > -1) {
            this.state.wishlist.splice(existingIndex, 1);
            this.showToast('Removido de favoritos', 'info');
        } else {
            this.state.wishlist.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image
            });
            this.showToast('Agregado a favoritos', 'success');
        }

        this.state.saveWishlist();
        this.updateWishlistUI();
        this.renderProducts();
    }

    updateWishlistUI() {
        if (this.elements.wishlistCount) {
            const count = this.state.wishlist.length;
            this.elements.wishlistCount.textContent = count;
            this.elements.wishlistCount.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    // Quick view (simplificado)
    quickView(productId) {
        const product = womenProducts.find(p => p.id === productId);
        if (!product) return;
        
        this.showToast(`Vista rápida: ${product.name}`, 'info');
    }

    // Share product
    shareProduct(productId) {
        const product = womenProducts.find(p => p.id === productId);
        if (!product) return;

        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: product.description,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            this.showToast('Enlace copiado', 'success');
        }
    }

    // Mobile menu
    toggleMobileMenu() {
        this.elements.mobileMenuToggle.classList.toggle('active');
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.toggle('active');
        }
    }

    // Scroll handling
    handleScroll() {
        const scrollTop = window.pageYOffset;

        // Navbar
        if (this.elements.navbar) {
            if (scrollTop > 100) {
                this.elements.navbar.classList.add('scrolled');
            } else {
                this.elements.navbar.classList.remove('scrolled');
            }
        }

        // Back to top
        if (this.elements.backToTop) {
            this.elements.backToTop.classList.toggle('visible', scrollTop > 300);
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Click outside handling
    handleClickOutside(e) {
        // Close sort menu
        if (!e.target.closest('.sort-dropdown') && this.elements.sortMenu) {
            this.elements.sortMenu.classList.remove('active');
        }
    }

    // Keyboard navigation
    handleKeyboard(e) {
        if (e.key === 'Escape') {
            this.closeCart();
            if (this.elements.sortMenu) {
                this.elements.sortMenu.classList.remove('active');
            }
        }
    }

    // Scroll animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-animation');
                }
            });
        }, observerOptions);

        document.querySelectorAll(`
            .style-card,
            .stat-item,
            .category-tab,
            .banner-content
        `).forEach(el => {
            observer.observe(el);
        });
    }

    // Animate on load
    animateOnLoad() {
        // Animate hero elements
        const heroElements = document.querySelectorAll('.hero-badge, .hero-title-line, .women-hero p, .hero-stats');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100 + (index * 150));
        });
    }

    // Toast notifications
    showToast(message, type = 'info', duration = WOMEN_CONFIG.notificationDuration) {
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

        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        container.appendChild(toast);

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

    // Utilities
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
}

// Inicializar app cuando el DOM esté listo
let womenApp;

document.addEventListener('DOMContentLoaded', function() {
    womenApp = new WomenApp();

    // Detectar mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    document.body.classList.toggle('mobile', isMobile);

    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            womenApp.showToast('¡Gracias por suscribirte!', 'success');
            newsletterForm.reset();
        });
    }
});

// CSS dinámico para componentes
const womenStyles = `
<style>
/* Product Card Styles */
.product-card {
    background: var(--pure-white);
    border-radius: 20px;
    overflow: hidden;
    transition: var(--transition);
    box-shadow: var(--shadow-light);
    opacity: 0;
    transform: translateY(30px);
}

.product-image-container {
    position: relative;
    overflow: hidden;
    aspect-ratio: 3/4;
}

.product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: var(--transition);
}

.product-card:hover .product-image {
    transform: scale(1.1);
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
    width: 45px;
    height: 45px;
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
    padding: 6px 12px;
    border-radius: 15px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    z-index: 1;
}

.product-badge.new {
    background: var(--accent-red);
    color: var(--pure-white);
}

.product-badge.discount {
    background: #10B981;
    color: var(--pure-white);
    top: 50px;
}

.product-badge.out-of-stock {
    background: var(--gray-medium);
    color: var(--pure-white);
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
document.head.insertAdjacentHTML('beforeend', womenStyles);