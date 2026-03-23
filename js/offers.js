// Urban Cats - Offers Page JavaScript
'use strict';

// Configuración
const OFFERS_CONFIG = {
    wheelSegments: 8,
    spinDuration: 5000,
    offerEndDate: new Date('2025-12-31T23:59:59').getTime(),
    couponValidDays: 7
};

// Productos en oferta
const offersProducts = [
    {
        id: 301,
        name: "Sudadera Urban Cats",
        price: 899,
        originalPrice: 1199,
        discount: 25,
        image: "images/sudadera_1.jpg",
        category: "mujer",
        isFlash: true,
        stock: 5
    },
    {
        id: 302,
        name: "Jeans Streetwear",
        price: 649,
        originalPrice: 1299,
        discount: 50,
        image: "images/jeans_1.jpg",
        category: "hombre",
        isFlash: true,
        stock: 3
    },
    {
        id: 303,
        name: "Crop Top Street",
        price: 449,
        originalPrice: 599,
        discount: 25,
        image: "images/crop_top_1.jpg",
        category: "mujer",
        isFlash: false,
        stock: 10
    },
    {
        id: 304,
        name: "Chaqueta Denim",
        price: 399,
        originalPrice: 1599,
        discount: 75,
        image: "images/chaqueta_denim_1.jpg",
        category: "hombre",
        isFlash: true,
        stock: 2
    },
    {
        id: 305,
        name: "Vestido Urban Chic",
        price: 824,
        originalPrice: 1099,
        discount: 25,
        image: "images/vestido_1.jpg",
        category: "mujer",
        isFlash: false,
        stock: 8
    },
    {
        id: 306,
        name: "Backpack Urbana",
        price: 399,
        originalPrice: 799,
        discount: 50,
        image: "images/backpack_1.jpg",
        category: "accesorios",
        isFlash: true,
        stock: 4
    },
    {
        id: 307,
        name: "Sneakers Street",
        price: 1424,
        originalPrice: 1899,
        discount: 25,
        image: "images/snackers_1.jpg",
        category: "accesorios",
        isFlash: false,
        stock: 6
    },
    {
        id: 308,
        name: "Hoodie Oversized",
        price: 899,
        originalPrice: 1199,
        discount: 25,
        image: "images/oversize_1.jpg",
        category: "hombre",
        isFlash: false,
        stock: 12
    }
];

// Estado de la aplicación
class OffersState {
    constructor() {
        this.activeDiscount = 'all';
        this.cart = JSON.parse(localStorage.getItem('urbanCatsCart')) || [];
        this.coupon = JSON.parse(localStorage.getItem('urbanCatsCoupon')) || null;
        this.hasSpunToday = localStorage.getItem('urbanCatsSpunToday') === new Date().toDateString();
    }

    saveCart() {
        localStorage.setItem('urbanCatsCart', JSON.stringify(this.cart));
    }

    saveCoupon(coupon) {
        this.coupon = coupon;
        localStorage.setItem('urbanCatsCoupon', JSON.stringify(coupon));
    }

    markSpunToday() {
        localStorage.setItem('urbanCatsSpunToday', new Date().toDateString());
        this.hasSpunToday = true;
    }
}

// Clase principal
class OffersApp {
    constructor() {
        this.state = new OffersState();
        this.isSpinning = false;
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
            flashDealsGrid: document.getElementById('flashDealsGrid'),
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
        
        // Mostrar modal si no ha abierto regalo hoy
        if (!this.state.hasSpunToday) {
            setTimeout(() => {
                this.elements.giftModal?.classList.add('active');
            }, 1000);
        }

        // Mostrar cupón si existe
        if (this.state.coupon && this.isCouponValid()) {
            this.showCouponBanner();
        }
    }

    setupEventListeners() {
        // Gift modal
        this.elements.closeGiftModal?.addEventListener('click', () => this.closeGiftModal());
        
        // Coupon
        this.elements.copyCouponBtn?.addEventListener('click', () => this.copyCoupon());

        // Filters
        this.elements.discountFilters.forEach(filter => {
            filter.addEventListener('click', (e) => this.handleFilterClick(e));
        });

        // Cart
        document.querySelector('.cart-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleCart();
        });

        document.querySelector('.close-cart')?.addEventListener('click', () => this.closeCart());
        this.elements.overlay?.addEventListener('click', () => this.closeCart());

        // Close modal on overlay click
        this.elements.giftModal?.addEventListener('click', (e) => {
            if (e.target === this.elements.giftModal) {
                this.closeGiftModal();
            }
        });
    }

    // Gift Box functionality
    initializeGiftBox() {
        // Open gift box button
        this.elements.openGiftBtn?.addEventListener('click', () => this.openGiftBox());

        // Claim ticket buttons
        this.elements.claimBtns?.forEach(btn => {
            btn.addEventListener('click', (e) => this.claimTicket(e));
        });

        // Start expiry countdown
        this.startTicketExpiry();
    }

    openGiftBox() {
        const giftBox = this.elements.giftBox;
        const giftBoxContainer = this.elements.giftBoxContainer;
        const ticketsContainer = this.elements.ticketsContainer;

        if (!giftBox || !giftBoxContainer || !ticketsContainer) return;

        // Add opening animation
        giftBox.classList.add('opening');
        
        setTimeout(() => {
            giftBox.classList.add('open');
        }, 500);

        setTimeout(() => {
            // Hide gift box, show tickets
            giftBoxContainer.style.display = 'none';
            ticketsContainer.style.display = 'block';

            // Mark as opened today
            this.state.markSpunToday();
        }, 1500);
    }

    claimTicket(e) {
        const ticketCard = e.target.closest('.ticket-card');
        if (!ticketCard) return;
        
        const discount = parseInt(ticketCard.dataset.discount);
        
        // Generate coupon
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
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            expiryEl.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
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
    }

    copyCoupon() {
        navigator.clipboard.writeText(this.state.coupon.code);
        this.showToast('¡Cupón copiado! 📋', 'success');
    }

    closeGiftModal() {
        this.elements.giftModal?.classList.remove('active');
    }

    // Countdown timer
    startCountdown() {
        const updateTimer = () => {
            const now = Date.now();
            const distance = OFFERS_CONFIG.offerEndDate - now;

            if (distance < 0) {
                document.getElementById('days').textContent = '00';
                document.getElementById('hours').textContent = '00';
                document.getElementById('minutes').textContent = '00';
                document.getElementById('seconds').textContent = '00';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('days').textContent = String(days).padStart(2, '0');
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        };

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    // Products rendering
    renderProducts() {
        this.renderFlashDeals();
        this.renderAllProducts();
    }

    renderFlashDeals() {
        const flashProducts = offersProducts.filter(p => p.isFlash);
        
        this.elements.flashDealsGrid.innerHTML = flashProducts.map(product => this.createProductCard(product, true)).join('');
    }

    renderAllProducts() {
        let products = offersProducts;

        if (this.state.activeDiscount !== 'all') {
            const discount = parseInt(this.state.activeDiscount);
            products = products.filter(p => p.discount >= discount);
        }

        this.elements.offersProductsGrid.innerHTML = products.map(product => this.createProductCard(product)).join('');
    }

    createProductCard(product, isFlash = false) {
        return `
            <article class="product-card">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <span class="discount-badge">-${product.discount}% OFF</span>
                    ${isFlash ? '<span class="flash-badge">⚡ FLASH</span>' : ''}
                    ${product.stock < 5 ? `<span class="stock-badge">¡Solo ${product.stock} disponibles!</span>` : ''}
                    
                    <div class="product-actions">
                        <button class="action-btn" onclick="app.addToCart(${product.id})">
                            <i class="fas fa-shopping-bag"></i>
                        </button>
                    </div>
                </div>
                
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-pricing">
                        <span class="product-price">$${product.price.toLocaleString()}</span>
                        <span class="original-price">$${product.originalPrice.toLocaleString()}</span>
                    </div>
                    <div class="savings">
                        Ahorras: $${(product.originalPrice - product.price).toLocaleString()}
                    </div>
                </div>
            </article>
        `;
    }

    handleFilterClick(e) {
        const filter = e.currentTarget;
        const discount = filter.dataset.discount;

        this.elements.discountFilters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');

        this.state.activeDiscount = discount;
        this.renderAllProducts();
    }

    // Cart functionality
    addToCart(productId) {
        const product = offersProducts.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.state.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.state.cart.push({
                ...product,
                quantity: 1
            });
        }

        this.state.saveCart();
        this.updateCartUI();
        this.showToast(`${product.name} agregado al carrito`, 'success');
    }

    removeFromCart(productId) {
        this.state.cart = this.state.cart.filter(item => item.id !== productId);
        this.state.saveCart();
        this.updateCartUI();
    }

    toggleCart() {
        this.elements.cartSidebar.classList.toggle('open');
        this.elements.overlay.classList.toggle('active');
    }

    closeCart() {
        this.elements.cartSidebar.classList.remove('open');
        this.elements.overlay.classList.remove('active');
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
                    <p>Aprovecha nuestras ofertas especiales</p>
                </div>
            `;
            return;
        }

        this.elements.cartItems.innerHTML = this.state.cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">$${item.price.toLocaleString()}</div>
                    <div class="quantity">Cantidad: ${item.quantity}</div>
                </div>
                <button onclick="app.removeFromCart(${item.id})" class="remove-item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    // Toast notifications
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
            container.style.cssText = 'position: fixed; top: 80px; right: 20px; z-index: 10000;';
            document.body.appendChild(container);
        }

        container.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }
}


// ============================================
// USER DROPDOWN - Toggle flotante
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const userBtn = document.querySelector('a[href="#account"]');
    const dropdown = document.getElementById('userDropdown');
    
    if (userBtn && dropdown) {
        // Convertir el enlace en botón clickeable
        userBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });
        
        // Cerrar dropdown al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && e.target !== userBtn) {
                dropdown.classList.remove('active');
            }
        });
        
        // No cerrar al hacer click dentro del dropdown
        dropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('¿Cerrar sesión?')) {
                localStorage.clear();
                window.location.href = 'index.html';
            }
        });
    }
});

// Estilos adicionales para toast y elementos dinámicos
const offersStyles = `
<style>
.toast {
    background: var(--primary-black);
    color: var(--pure-white);
    padding: 15px 20px;
    border-radius: 10px;
    margin-bottom: 10px;
    transform: translateX(400px);
    opacity: 0;
    transition: all 0.4s ease;
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
}

.toast.show {
    transform: translateX(0);
    opacity: 1;
}

.toast-success {
    background: #10B981;
}

.toast-info {
    background: #3B82F6;
}

.toast-content {
    display: flex;
    align-items: center;
    gap: 10px;
}

.stock-badge {
    position: absolute;
    bottom: 15px;
    left: 15px;
    background: rgba(255, 107, 0, 0.95);
    color: white;
    padding: 6px 12px;
    border-radius: 15px;
    font-size: 11px;
    font-weight: 600;
    z-index: 2;
}

.savings {
    color: var(--accent-red);
    font-size: 14px;
    font-weight: 500;
    margin-top: 8px;
}

.product-actions {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: var(--transition);
}

.product-card:hover .product-actions {
    opacity: 1;
}

.action-btn {
    background: var(--pure-white);
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
    box-shadow: var(--shadow-light);
}

.action-btn:hover {
    background: var(--primary-black);
    color: var(--pure-white);
    transform: scale(1.1);
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', offersStyles);

// Inicializar app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new OffersApp();
});