'use strict';

const OFFERS_CONFIG = {
    offerEndDate: new Date('2026-12-31T23:59:59').getTime(),
    couponValidDays: 7
};

// Productos en oferta — solo los que tienen precio original en mujer, hombre y accesorios
const offersProducts = [
    // MUJER
    { id: 101,  name: "Crop Top Minimal",         price: 599,  originalPrice: 799,  image: "images/tops_cami_1.jpg",      category: "mujer",      isNew: true,  inStock: true },
    { id: 103,  name: "Crop Top negro dragon",     price: 899,  originalPrice: 1199, image: "images/tops_cami_3.jpg",      category: "mujer",      isNew: false, inStock: true },
    { id: 105,  name: "Crop Bratz",                price: 1799, originalPrice: 2299, image: "images/tops_cami_5.jpg",      category: "mujer",      isNew: true,  inStock: true },
    { id: 111,  name: "Camisa estilo chica anime", price: 1799, originalPrice: 2299, image: "images/tops_cami_11.jpg",     category: "mujer",      isNew: true,  inStock: true },
    { id: 112,  name: "Camisa kuromi",             price: 1799, originalPrice: 2299, image: "images/tops_cami_12.jpg",     category: "mujer",      isNew: true,  inStock: true },
    { id: 107,  name: "Camiseta Minimal Tokyo",    price: 599,  originalPrice: 799,  image: "images/tops_cami_7.jpg",      category: "mujer",      isNew: true,  inStock: true },
    { id: 109,  name: "Camiseta Street Core",      price: 649,  originalPrice: 899,  image: "images/tops_cami_9.jpg",      category: "mujer",      isNew: false, inStock: true },
    { id: 203,  name: "Pans deportivo",            price: 1599, originalPrice: 1999, image: "images/pantalones_3.jpg",     category: "mujer",      isNew: true,  inStock: true },
    { id: 401,  name: "Vestido negro",             price: 699,  originalPrice: 899,  image: "images/vestidos_1.jpg",       category: "mujer",      isNew: false, inStock: true },
    { id: 403,  name: "Vestido negro Minimal",     price: 1199, originalPrice: 1599, image: "images/vestidos_3.jpg",       category: "mujer",      isNew: true,  inStock: true },
    { id: 405,  name: "Vestido Slip Chic",         price: 899,  originalPrice: 1199, image: "images/vestidos_5.jpg",       category: "mujer",      isNew: false, inStock: true },
    { id: 407,  name: "Vestido Mini Street",       price: 799,  originalPrice: 999,  image: "images/vestido_7.jpg",        category: "mujer",      isNew: false, inStock: true },
    { id: 501,  name: "Abrigo Clásico Urban",      price: 2499, originalPrice: 3199, image: "images/abrigos_1.jpg",        category: "mujer",      isNew: true,  inStock: true },
    { id: 503,  name: "Trench Minimal",            price: 1899, originalPrice: 2499, image: "images/abrigos_3.jpg",        category: "mujer",      isNew: false, inStock: true },
    { id: 505,  name: "Abrigo Premium Noir",       price: 2899, originalPrice: 3599, image: "images/abrigos_5.jpg",        category: "mujer",      isNew: true,  inStock: true },
    { id: 601,  name: "Conjunto ADIDAS",           price: 599,  originalPrice: 799,  image: "images/all_1.jpg",            category: "mujer",      isNew: true,  inStock: true },
    { id: 602,  name: "Conjunto skate rojo",       price: 499,  originalPrice: 799,  image: "images/all_2.jpg",            category: "mujer",      isNew: true,  inStock: true },
    { id: 603,  name: "Conjunto skate gris",       price: 699,  originalPrice: 799,  image: "images/all_3.jpg",            category: "mujer",      isNew: true,  inStock: true },
    { id: 604,  name: "Conjunto blanco skate",     price: 760,  originalPrice: 999,  image: "images/all_4.jpg",            category: "mujer",      isNew: true,  inStock: true },
    // HOMBRE
    { id: 701,  name: "Camisa Urban Crop",         price: 699,  originalPrice: 899,  image: "images/men_camisa_1.jpg",     category: "hombre",     isNew: true,  inStock: true },
    { id: 703,  name: "Camisa Minimal Tokyo",      price: 649,  originalPrice: 899,  image: "images/men_camisa_3.jpg",     category: "hombre",     isNew: false, inStock: true },
    { id: 707,  name: "Camiseta Urban Core",       price: 499,  originalPrice: 699,  image: "images/men_camisa_7.jpg",     category: "hombre",     isNew: true,  inStock: true },
    { id: 802,  name: "Pantalón Deportivo",        price: 1599, originalPrice: 1999, image: "images/pantalon_men_2.jpg",   category: "hombre",     isNew: true,  inStock: true },
    { id: 901,  name: "Hoodie Básico Urban",       price: 899,  originalPrice: 1199, image: "images/hoddie_men1.jpg",      category: "hombre",     isNew: false, inStock: true },
    { id: 903,  name: "Hoodie Minimal",            price: 999,  originalPrice: 1299, image: "images/hoddie_men3.jpg",      category: "hombre",     isNew: false, inStock: true },
    { id: 905,  name: "Hoodie Oversized Tokyo",    price: 1299, originalPrice: 1699, image: "images/hoddie_men5.jpg",      category: "hombre",     isNew: true,  inStock: true },
    { id: 908,  name: "Hoodie Clean Line",         price: 899,  originalPrice: 1199, image: "images/hoddie_men8.jpg",      category: "hombre",     isNew: false, inStock: true },
    { id: 910,  name: "Hoodie Premium Noir",       price: 1799, originalPrice: 2299, image: "images/hoddie_men10.jpg",     category: "hombre",     isNew: true,  inStock: true },
    { id: 1001, name: "Chaqueta Denim Urban",      price: 1799, originalPrice: 2299, image: "images/abrigo_men_1.jpg",     category: "hombre",     isNew: true,  inStock: true },
    { id: 1002, name: "Abrigo Clásico Urban",      price: 2499, originalPrice: 3199, image: "images/abrigo_men_2.jpg",     category: "hombre",     isNew: true,  inStock: true },
    { id: 1004, name: "Trench Minimal",            price: 1899, originalPrice: 2499, image: "images/abrigo_men_4.jpg",     category: "hombre",     isNew: false, inStock: true },
    { id: 1101, name: "Conjunto ADIDAS Urban",     price: 599,  originalPrice: 799,  image: "images/conjunto_men_1.jpg",   category: "hombre",     isNew: true,  inStock: true },
    { id: 1102, name: "Conjunto Skate Rojo",       price: 499,  originalPrice: 799,  image: "images/conjunto_men_2.jpg",   category: "hombre",     isNew: true,  inStock: true },
    { id: 1103, name: "Conjunto Skate Gris",       price: 699,  originalPrice: 799,  image: "images/conjunto_men_3.jpg",   category: "hombre",     isNew: true,  inStock: true },
    { id: 1104, name: "Conjunto Blanco Skate",     price: 760,  originalPrice: 999,  image: "images/conjunto_men_4.jpg",   category: "hombre",     isNew: true,  inStock: true },
    // ACCESORIOS
    { id: 1201, name: "Mochila Urban Black",       price: 899,  originalPrice: 1199, image: "images/backpack_1.jpg",       category: "accesorios", isNew: true,  inStock: true },
    { id: 1302, name: "Gorra Dad Hat Clean",       price: 349,  originalPrice: 449,  image: "images/acceso_pacs_1.jpg",    category: "accesorios", isNew: false, inStock: true },
    { id: 1303, name: "Gorra Bucket Urban",        price: 449,  originalPrice: 599,  image: "images/acceso_pacs_3.jpg",    category: "accesorios", isNew: true,  inStock: true },
    { id: 1401, name: "Reloj Minimal Digital",     price: 1599, originalPrice: 1999, image: "images/acceso_watch_1.jpg",   category: "accesorios", isNew: false, inStock: true },
    { id: 1602, name: "Sneakers High Top Black",   price: 2099, originalPrice: 2599, image: "images/acceso_snecker_1.jpg", category: "accesorios", isNew: true,  inStock: true },
    { id: 1701, name: "Lentes de Sol Classic",     price: 699,  originalPrice: 899,  image: "images/acceso_glass_1.jpg",   category: "accesorios", isNew: false, inStock: true },
].map(p => {
    const discount = Math.round((1 - p.price / p.originalPrice) * 100);
    return { ...p, discount, isFlash: discount >= 27 };
});

// Estado de la aplicación
class OffersState {
    constructor() {
        this.activeDiscount = 'all';
        this.cart = JSON.parse(localStorage.getItem('urbanCatsCart')) || [];
        this.coupon = JSON.parse(localStorage.getItem('urbanCatsCoupon')) || null;
        this.giftOpened = localStorage.getItem('urbanCatsGiftOpened') === 'true';
        this.wishlist = JSON.parse(localStorage.getItem('urbanCatsWishlist')) || [];
    }

    saveCart() {
        localStorage.setItem('urbanCatsCart', JSON.stringify(this.cart));
    }

    saveWishlist() {
        localStorage.setItem('urbanCatsWishlist', JSON.stringify(this.wishlist));
    }

    saveCoupon(coupon) {
        this.coupon = coupon;
        localStorage.setItem('urbanCatsCoupon', JSON.stringify(coupon));
    }

    markGiftOpened() {
        localStorage.setItem('urbanCatsGiftOpened', 'true');
        this.giftOpened = true;
    }
}

// Clase principal
class OffersApp {
    constructor() {
        this.state = new OffersState();
        this.elements = this.initializeElements();
        this.initializeApp();
    }

    initializeElements() {
        return {
            giftModal: document.getElementById('giftModal'),
            closeGiftModal: document.getElementById('closeGiftModal'),
            giftBox: document.getElementById('giftBox'),
            openGiftBtn: document.getElementById('openGiftBtn'),
            giftBoxContainer: document.getElementById('giftBoxContainer'),
            ticketsContainer: document.getElementById('ticketsContainer'),
            ticketExpiry: document.getElementById('ticketExpiry'),
            claimBtns: document.querySelectorAll('.claim-ticket-btn'),
            couponBanner: document.getElementById('couponBanner'),
            couponCode: document.getElementById('couponCode'),
            couponDiscount: document.getElementById('couponDiscount'),
            copyCouponBtn: document.getElementById('copyCouponBtn'),
            closeCouponBtn: document.getElementById('closeCouponBanner'),
            offersProductsGrid: document.getElementById('offersProductsGrid'),
            discountFilters: document.querySelectorAll('.discount-filter'),
            cartSidebar: document.getElementById('cart-sidebar'),
            overlay: document.getElementById('overlay'),
            cartCount: document.querySelector('.cart-count'),
            cartItems: document.getElementById('cart-items'),
            cartTotal: document.getElementById('cart-total')
        };
    }

    async initializeApp() {
        this.setupEventListeners();
        this.initializeGiftBox();
        this.startCountdown();
        this.renderProducts();
        this.updateCartUI();

        if (!this.state.giftOpened) {
            setTimeout(() => {
                this.elements.giftModal?.classList.add('active');
                document.body.style.overflow = 'hidden';
            }, 1000);
        }

        if (this.state.coupon && this.isCouponValid()) {
            this.showCouponBanner();
        }
    }

    setupEventListeners() {
        this.elements.closeGiftModal?.addEventListener('click', () => this.closeGiftModal());
        this.elements.copyCouponBtn?.addEventListener('click', () => this.copyCoupon());
        this.elements.closeCouponBtn?.addEventListener('click', () => this.closeCouponBanner());

        this.elements.discountFilters.forEach(filter => {
            filter.addEventListener('click', (e) => this.handleFilterClick(e));
        });

        // Carrito – manejado por cartSystem (cart.js)

        this.elements.giftModal?.addEventListener('click', (e) => {
            if (e.target === this.elements.giftModal) {
                this.closeGiftModal();
            }
        });

        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.closeProductModal(); });
    }

    // Gift Box
    initializeGiftBox() {
        this.elements.openGiftBtn?.addEventListener('click', () => this.openGiftBox());
        this.elements.claimBtns?.forEach(btn => {
            btn.addEventListener('click', (e) => this.claimTicket(e));
        });
        this.startTicketExpiry();
    }

    openGiftBox() {
        const giftBox = this.elements.giftBox;
        const giftBoxContainer = this.elements.giftBoxContainer;
        const ticketsContainer = this.elements.ticketsContainer;
        if (!giftBox || !giftBoxContainer || !ticketsContainer) return;

        giftBox.classList.add('opening');
        setTimeout(() => { giftBox.classList.add('open'); }, 500);
        setTimeout(() => {
            giftBoxContainer.style.display = 'none';
            ticketsContainer.style.display = 'block';
            this.state.markGiftOpened();
        }, 1500);
    }

    claimTicket(e) {
        const ticketCard = e.target.closest('.ticket-card');
        if (!ticketCard) return;
        const discount = parseInt(ticketCard.dataset.discount);
        const coupon = {
            code: this.generateCouponCode(),
            discount: discount,
            expiresAt: Date.now() + (OFFERS_CONFIG.couponValidDays * 24 * 60 * 60 * 1000)
        };
        this.state.saveCoupon(coupon);
        this.showCouponBanner();
        this.closeGiftModal();
        this.showToast(`¡Cupón obtenido! ${discount}% de descuento`, 'success');
    }

    startTicketExpiry() {
        const expiryEl = this.elements.ticketExpiry;
        if (!expiryEl) return;
        const updateCountdown = () => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            const diff = tomorrow - now;
            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);
            expiryEl.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        };
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    generateCouponCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'UC-';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    isCouponValid() {
        return this.state.coupon && Date.now() < this.state.coupon.expiresAt;
    }

    showCouponBanner() {
        if (!this.isCouponValid()) return;
        this.elements.couponCode.textContent = this.state.coupon.code;
        this.elements.couponDiscount.textContent = this.state.coupon.discount;
        this.elements.couponBanner.classList.add('active');
        document.body.classList.add('has-coupon-banner');
    }

    closeCouponBanner() {
        this.elements.couponBanner.classList.remove('active');
        document.body.classList.remove('has-coupon-banner');
        document.getElementById('navbar').style.top = '';
    }

    copyCoupon() {
        navigator.clipboard.writeText(this.state.coupon.code);
        this.showToast('¡Cupón copiado! 📋', 'success');
    }

    closeGiftModal() {
        this.elements.giftModal?.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Countdown — siempre 4 horas, se reinicia solo al llegar a 0
    startCountdown() {
        const KEY = 'ucOffersEnd';
        const DURATION = 4 * 60 * 60 * 1000;

        let endTime = parseInt(sessionStorage.getItem(KEY) || '0');
        if (!endTime || endTime <= Date.now()) {
            endTime = Date.now() + DURATION;
            sessionStorage.setItem(KEY, endTime);
        }

        const updateTimer = () => {
            let distance = endTime - Date.now();
            if (distance <= 0) {
                endTime = Date.now() + DURATION;
                sessionStorage.setItem(KEY, endTime);
                distance = DURATION;
            }
            const h = Math.floor(distance / (1000 * 60 * 60));
            const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((distance % (1000 * 60)) / 1000);
            const dEl = document.getElementById('days');
            const hEl = document.getElementById('hours');
            const mEl = document.getElementById('minutes');
            const sEl = document.getElementById('seconds');
            if (dEl) dEl.textContent = '00';
            if (hEl) hEl.textContent = String(h).padStart(2, '0');
            if (mEl) mEl.textContent = String(m).padStart(2, '0');
            if (sEl) sEl.textContent = String(s).padStart(2, '0');
        };
        updateTimer();
        setInterval(updateTimer, 1000);
    }

    // Rendering
    renderProducts() {
        this.renderAllProducts();
    }

    renderAllProducts() {
        let products = offersProducts;
        if (this.state.activeDiscount !== 'all') {
            const min = parseInt(this.state.activeDiscount);
            products = products.filter(p => p.discount >= min);
        }
        if (this.elements.offersProductsGrid) {
            this.elements.offersProductsGrid.innerHTML = products.map(p => this.createProductCard(p)).join('');
            this.revealVisibleCards();
        }
    }

    revealVisibleCards() {
        const cards = document.querySelectorAll('.product-card:not(.revealed)');
        cards.forEach((card, index) => {
            setTimeout(() => card.classList.add('revealed'), index * 80);
        });
    }

    createProductCard(product) {
        const savings = product.originalPrice - product.price;
        return `
            <article class="product-card" data-product-id="${product.id}" onclick="offersApp.openProductModal(${product.id})">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                    ${product.isNew ? '<span class="discount-badge" style="left:15px;">Nuevo</span>' : ''}
                    <span class="discount-badge" style="right:15px;left:auto;">-${product.discount}% OFF</span>
                    ${product.isFlash ? '<span class="flash-badge">⚡ FLASH</span>' : ''}

                    <div class="product-overlay">
                        <div class="product-overlay-details">
                            <h3>${product.name}</h3>
                            <p class="offer-savings-text">Ahorras $${savings.toLocaleString()}</p>
                            <div class="product-overlay-price">
                                <span>$${product.price.toLocaleString()}</span>
                                <span class="product-overlay-original">$${product.originalPrice.toLocaleString()}</span>
                            </div>
                        </div>
                        <button class="product-add-btn" onclick="event.stopPropagation(); offersApp.openProductModal(${product.id})">
                            <i class="fas fa-eye"></i>
                            Ver
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    handleFilterClick(e) {
        const filter = e.currentTarget;
        this.elements.discountFilters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');
        this.state.activeDiscount = filter.dataset.discount;
        this.renderAllProducts();
    }

    // Cart – delega a cartSystem (cart.js)
    addToCart(productId) {
        const product = offersProducts.find(p => p.id === productId);
        if (!product) return;
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

    toggleCart() {
        cartSystem.toggleCart();
    }

    closeCart() {
        cartSystem.closeCart();
    }

    updateCartUI() {
        cartSystem.refresh();
    }

    renderCartItems() {
        cartSystem.refresh();
    }

    // Wishlist
    toggleWishlist(productId) {
        const index = this.state.wishlist.findIndex(item => (item?.id ?? item) === productId);
        const product = offersProducts.find(p => p.id === productId);
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
        cartSystem.refreshWishlist();
    }

    // ── Product Quick Modal ──────────────────────────────────
    openProductModal(productId) {
        const product = offersProducts.find(p => p.id === productId);
        if (!product) return;

        const existing = document.getElementById('product-quick-modal');
        if (existing) existing.remove();

        const sizes = product.sizes || [];
        this._modalSelectedSize = sizes.length > 0 ? sizes[0] : 'Único';
        const isInWishlist = this.state.wishlist.some(item => (item?.id ?? item) === productId);
        const desc = product.description || `Ahorras $${(product.originalPrice - product.price).toLocaleString('es-MX')} en esta oferta`;

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
                        <span class="pqm-badge pqm-badge--sale">-${product.discount}%</span>
                    </div>
                </div>
                <div class="pqm-details">
                    <h2 class="pqm-name">${product.name}</h2>
                    <p class="pqm-desc">${desc}</p>
                    <div class="pqm-price">
                        <span class="pqm-price-current">$${product.price.toLocaleString('es-MX')}</span>
                        <span class="pqm-price-original">$${product.originalPrice.toLocaleString('es-MX')}</span>
                    </div>
                    ${sizes.length > 0 ? `
                    <div class="pqm-sizes-section">
                        <p class="pqm-sizes-label">Talla: <strong id="pqm-selected-size">${this._modalSelectedSize}</strong></p>
                        <div class="pqm-sizes-grid">
                            ${sizes.map(size => `
                                <button class="pqm-size-btn ${size === this._modalSelectedSize ? 'active' : ''}"
                                        data-size="${size}"
                                        onclick="offersApp._selectModalSize('${size}')">
                                    ${size}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}
                    <div class="pqm-actions">
                        <button class="pqm-add-cart-btn ${!product.inStock ? 'disabled' : ''}"
                                ${!product.inStock ? 'disabled' : ''}
                                onclick="offersApp._modalAddToCart(${product.id})">
                            <i class="fas fa-shopping-bag"></i>
                            ${product.inStock ? 'Agregar al carrito' : 'Agotado'}
                        </button>
                        <button class="pqm-wishlist-btn ${isInWishlist ? 'active' : ''}"
                                onclick="offersApp._modalToggleWishlist(${product.id})"
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
        const product = offersProducts.find(p => p.id === productId);
        if (!product || !product.inStock) return;
        cartSystem.addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            selectedSize: this._modalSelectedSize || 'Único',
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

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = 'position:fixed;top:80px;right:20px;z-index:10000;';
            document.body.appendChild(container);
        }
        container.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3000);
    }
}

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

// Estilos overlay + toast
const offersStyles = `
<style>
.product-card {
    opacity: 1;
    transform: none;
}
.product-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 60%, transparent 100%);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 20px;
    opacity: 0;
    transition: opacity 0.35s ease;
    z-index: 2;
}
.product-card:hover .product-overlay {
    opacity: 1;
}
.product-overlay-details {
    margin-bottom: 14px;
}
.product-overlay-details h3 {
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    margin: 0 0 6px;
    line-height: 1.3;
}
.offer-savings-text {
    color: #ff6b35;
    font-size: 12px;
    font-weight: 600;
    margin: 0 0 6px;
}
.product-overlay-price {
    display: flex;
    align-items: center;
    gap: 10px;
}
.product-overlay-price span:first-child {
    color: #fff;
    font-size: 18px;
    font-weight: 600;
}
.product-overlay-original {
    color: rgba(255,255,255,0.5);
    font-size: 13px;
    text-decoration: line-through;
}
.product-add-btn {
    background: #fff;
    color: #1a1a1a;
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
    transform: translateY(10px);
    transition: transform 0.3s ease, background 0.25s ease, color 0.25s ease;
}
.product-card:hover .product-add-btn {
    transform: translateY(0);
}
.product-add-btn:hover {
    background: #1a1a1a;
    color: #fff;
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
.toast {
    background: #1a1a1a;
    color: #fff;
    padding: 14px 20px;
    border-radius: 10px;
    margin-bottom: 10px;
    transform: translateX(400px);
    opacity: 0;
    transition: all 0.4s ease;
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    min-width: 240px;
}
.toast.show {
    transform: translateX(0);
    opacity: 1;
}
.toast-success { background: #10B981; }
.toast-info    { background: #3B82F6; }
.toast-content {
    display: flex;
    align-items: center;
    gap: 10px;
}
</style>
`;
document.head.insertAdjacentHTML('beforeend', offersStyles);

// Inicializar app
window.offersApp = null;
document.addEventListener('DOMContentLoaded', () => {
    window.offersApp = new OffersApp();
    if (typeof cartSystem !== 'undefined') cartSystem.registerSearchProducts(offersProducts, 'offers.html');
});
