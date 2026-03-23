// Urban Cats - Pedidos Page JavaScript
// Estilo Minimalista Japonés Contemporáneo
'use strict';

// ============================================
// STORAGE HELPER - Sistema de almacenamiento local
// ============================================
const OrderStorage = {
    keys: {
        orders: 'urbanCats_orders',
        cart: 'urbanCats_cart'
    },

    getOrders() {
        const orders = localStorage.getItem(this.keys.orders);
        return orders ? JSON.parse(orders) : [];
    },

    saveOrders(orders) {
        localStorage.setItem(this.keys.orders, JSON.stringify(orders));
    },

    getCart() {
        const cart = localStorage.getItem(this.keys.cart);
        return cart ? JSON.parse(cart) : [];
    },

    saveCart(cart) {
        localStorage.setItem(this.keys.cart, JSON.stringify(cart));
    }
};

// ============================================
// TOAST NOTIFICATION SYSTEM
// ============================================
const OrderToast = {
    container: null,

    init() {
        if (!this.container) {
            this.container = document.getElementById('toast-container');
            if (!this.container) {
                this.container = document.createElement('div');
                this.container.id = 'toast-container';
                this.container.className = 'toast-container';
                document.body.appendChild(this.container);
            }
        }
    },

    show(message, type = 'success', duration = 4000) {
        this.init();

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };

        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${icons[type] || 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        this.container.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
const OrderUtils = {
    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    },

    formatPrice(price) {
        return `$${price.toLocaleString('es-MX')}`;
    },

    getStatusLabel(status) {
        const labels = {
            pending: 'Pendiente',
            processing: 'Procesando',
            shipped: 'Enviado',
            delivered: 'Entregado',
            cancelled: 'Cancelado'
        };
        return labels[status] || status;
    },

    getStatusIcon(status) {
        const icons = {
            pending: 'clock',
            processing: 'cog',
            shipped: 'truck',
            delivered: 'check-circle',
            cancelled: 'times-circle'
        };
        return icons[status] || 'info-circle';
    },

    calculateTimelineProgress(status) {
        const progress = {
            pending: '0%',
            processing: '33%',
            shipped: '66%',
            delivered: '100%',
            cancelled: '0%'
        };
        return progress[status] || '0%';
    }
};

// ============================================
// ORDERS APP - Clase principal
// ============================================
class OrdersApp {
    constructor() {
        this.orders = OrderStorage.getOrders();
        this.activeFilter = 'all';
        this.elements = this.initializeElements();
        this.init();
    }

    initializeElements() {
        return {
            ordersList: document.getElementById('orders-list'),
            filterBtns: document.querySelectorAll('.filter-btn'),
            orderModal: document.getElementById('order-modal'),
            modalBody: document.getElementById('modal-body'),
            modalClose: document.getElementById('modal-close'),
            totalOrders: document.getElementById('total-orders'),
            pendingOrders: document.getElementById('pending-orders'),
            deliveredOrders: document.getElementById('delivered-orders')
        };
    }

    async init() {
        // Si no hay pedidos, crear algunos de ejemplo
        if (this.orders.length === 0) {
            this.createSampleOrders();
        }

        this.setupEventListeners();
        this.updateStats();
        this.renderOrders();
        this.hideLoadingScreen();
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 1000);
        }
    }

    setupEventListeners() {
        // Filtros
        this.elements.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilterClick(e.currentTarget);
            });
        });

        // Modal
        if (this.elements.modalClose) {
            this.elements.modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }

        if (this.elements.orderModal) {
            this.elements.orderModal.querySelector('.modal-overlay')?.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.elements.orderModal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    handleFilterClick(btn) {
        // Update active filter UI
        this.elements.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update active filter
        this.activeFilter = btn.dataset.status;

        // Re-render orders
        this.renderOrders();
    }

    updateStats() {
        const total = this.orders.length;
        const pending = this.orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
        const delivered = this.orders.filter(o => o.status === 'delivered').length;

        if (this.elements.totalOrders) {
            this.animateNumber(this.elements.totalOrders, 0, total);
        }
        if (this.elements.pendingOrders) {
            this.animateNumber(this.elements.pendingOrders, 0, pending);
        }
        if (this.elements.deliveredOrders) {
            this.animateNumber(this.elements.deliveredOrders, 0, delivered);
        }
    }

    animateNumber(element, start, end, duration = 1000) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    renderOrders() {
        if (!this.elements.ordersList) return;

        // Filter orders
        let filteredOrders = this.orders;
        if (this.activeFilter !== 'all') {
            filteredOrders = this.orders.filter(order => order.status === this.activeFilter);
        }

        // Sort by date (newest first)
        filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Show empty state if no orders
        if (filteredOrders.length === 0) {
            this.showEmptyOrders();
            return;
        }

        // Render orders
        this.elements.ordersList.innerHTML = filteredOrders.map(order => this.createOrderCard(order)).join('');

        // Attach event listeners
        this.attachOrderListeners();
    }

    createOrderCard(order) {
        return `
            <article class="order-card" data-order="${order.orderNumber}">
                <div class="order-header">
                    <div class="order-info">
                        <span class="order-number">${order.orderNumber}</span>
                        <span class="order-date">
                            <i class="far fa-calendar"></i>
                            ${OrderUtils.formatDate(order.date)}
                        </span>
                    </div>
                    <span class="order-status status-${order.status}">
                        <i class="fas fa-${OrderUtils.getStatusIcon(order.status)}"></i>
                        ${OrderUtils.getStatusLabel(order.status)}
                    </span>
                </div>
                
                ${this.createTimeline(order.status)}
                
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <img src="${item.image}" alt="${item.name}" loading="lazy">
                            <div class="item-details">
                                <h3>${item.name}</h3>
                                <p>
                                    <i class="fas fa-box"></i> Cantidad: ${item.quantity}
                                    ${item.size ? ` • Talla: ${item.size}` : ''}
                                </p>
                            </div>
                            <span class="item-price">${OrderUtils.formatPrice(item.subtotal)}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="order-footer">
                    <span class="order-total">Total: ${OrderUtils.formatPrice(order.total)}</span>
                    <div class="order-actions">
                        <button class="btn-secondary view-details">
                            <i class="fas fa-eye"></i>
                            Ver Detalles
                        </button>
                        <button class="btn-primary buy-again">
                            <i class="fas fa-shopping-bag"></i>
                            Comprar de Nuevo
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    createTimeline(status) {
        const steps = [
            { id: 'pending', label: 'Pedido', icon: 'receipt' },
            { id: 'processing', label: 'Procesando', icon: 'cog' },
            { id: 'shipped', label: 'Enviado', icon: 'truck' },
            { id: 'delivered', label: 'Entregado', icon: 'check' }
        ];

        const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
        const currentIndex = statusOrder.indexOf(status);

        return `
            <div class="order-timeline">
                <div class="timeline-title">Estado del Pedido</div>
                <div class="timeline-steps">
                    <div class="timeline-progress" style="width: ${OrderUtils.calculateTimelineProgress(status)}"></div>
                    ${steps.map((step, index) => `
                        <div class="timeline-step ${index <= currentIndex ? 'completed' : ''} ${index === currentIndex ? 'active' : ''}">
                            <div class="timeline-step-icon">
                                <i class="fas fa-${step.icon}"></i>
                            </div>
                            <span class="timeline-step-label">${step.label}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    attachOrderListeners() {
        // View details buttons
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const orderCard = e.target.closest('.order-card');
                const orderNumber = orderCard.dataset.order;
                this.showOrderDetails(orderNumber);
            });
        });

        // Buy again buttons
        document.querySelectorAll('.buy-again').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const orderCard = e.target.closest('.order-card');
                const orderNumber = orderCard.dataset.order;
                this.buyAgain(orderNumber);
            });
        });
    }

    showOrderDetails(orderNumber) {
        const order = this.orders.find(o => o.orderNumber === orderNumber);
        if (!order) return;

        this.elements.modalBody.innerHTML = `
            <div class="detail-section">
                <h3><i class="fas fa-info-circle"></i> Información del Pedido</h3>
                <div class="detail-row">
                    <span class="detail-label">Número de Pedido</span>
                    <span class="detail-value">${order.orderNumber}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Fecha de Pedido</span>
                    <span class="detail-value">${OrderUtils.formatDate(order.date)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Estado</span>
                    <span class="detail-value">
                        <span class="order-status status-${order.status}">
                            <i class="fas fa-${OrderUtils.getStatusIcon(order.status)}"></i>
                            ${OrderUtils.getStatusLabel(order.status)}
                        </span>
                    </span>
                </div>
            </div>

            <div class="detail-section">
                <h3><i class="fas fa-box-open"></i> Productos</h3>
                ${order.items.map(item => `
                    <div class="detail-row">
                        <span class="detail-label">${item.name} x ${item.quantity}</span>
                        <span class="detail-value">${OrderUtils.formatPrice(item.subtotal)}</span>
                    </div>
                `).join('')}
            </div>

            <div class="detail-section">
                <h3><i class="fas fa-truck"></i> Dirección de Envío</h3>
                <div class="detail-row">
                    <span class="detail-label">Destinatario</span>
                    <span class="detail-value">${order.shipping.name}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Dirección</span>
                    <span class="detail-value">${order.shipping.address}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Ciudad</span>
                    <span class="detail-value">${order.shipping.city}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Código Postal</span>
                    <span class="detail-value">${order.shipping.postalCode}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Costo de Envío</span>
                    <span class="detail-value">${OrderUtils.formatPrice(order.shipping.cost)}</span>
                </div>
            </div>

            <div class="detail-section">
                <h3><i class="fas fa-receipt"></i> Resumen de Pago</h3>
                <div class="detail-row">
                    <span class="detail-label">Subtotal</span>
                    <span class="detail-value">${OrderUtils.formatPrice(order.subtotal)}</span>
                </div>
                ${order.discount > 0 ? `
                    <div class="detail-row">
                        <span class="detail-label">Descuento ${order.coupon ? `(${order.coupon.code})` : ''}</span>
                        <span class="detail-value" style="color: var(--success-green);">-${OrderUtils.formatPrice(order.discount)}</span>
                    </div>
                ` : ''}
                <div class="detail-row">
                    <span class="detail-label">Envío</span>
                    <span class="detail-value">${OrderUtils.formatPrice(order.shipping.cost)}</span>
                </div>
                <div class="detail-row" style="border-top: 2px solid var(--gray-border); padding-top: 15px; margin-top: 15px;">
                    <span class="detail-label" style="font-size: 18px; font-weight: 700;">Total</span>
                    <span class="detail-value" style="font-size: 24px; font-weight: 700;">${OrderUtils.formatPrice(order.total)}</span>
                </div>
            </div>

            <div class="detail-section">
                <h3><i class="fas fa-credit-card"></i> Método de Pago</h3>
                <div class="detail-row">
                    <span class="detail-label">Tipo</span>
                    <span class="detail-value">${order.payment.method === 'card' ? 'Tarjeta de Crédito' : order.payment.method === 'paypal' ? 'PayPal' : 'Otro'}</span>
                </div>
            </div>
        `;

        this.openModal();
    }

    openModal() {
        if (this.elements.orderModal) {
            this.elements.orderModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        if (this.elements.orderModal) {
            this.elements.orderModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    buyAgain(orderNumber) {
        const order = this.orders.find(o => o.orderNumber === orderNumber);
        if (!order) return;

        // Get current cart
        const currentCart = OrderStorage.getCart();
        
        // Add items to cart
        order.items.forEach(item => {
            const existingItem = currentCart.find(i => i.id === item.id && i.size === item.size);
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                currentCart.push({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    quantity: item.quantity,
                    size: item.size || 'M'
                });
            }
        });

        OrderStorage.saveCart(currentCart);
        OrderToast.show(`${order.items.length} producto(s) agregados al carrito`, 'success');

        // Update cart count if element exists
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = currentCart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }

        // Redirect after a delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }

    showEmptyOrders() {
        const filterName = this.activeFilter === 'all' ? 'ningún pedido' : 
                          this.activeFilter === 'pending' ? 'pedidos pendientes' :
                          this.activeFilter === 'processing' ? 'pedidos en procesamiento' :
                          this.activeFilter === 'shipped' ? 'pedidos enviados' :
                          this.activeFilter === 'delivered' ? 'pedidos entregados' :
                          'pedidos cancelados';

        this.elements.ordersList.innerHTML = `
            <div class="empty-orders">
                <div class="empty-orders-icon">
                    <i class="fas fa-box-open"></i>
                </div>
                <h2>No hay ${filterName}</h2>
                <p>Aún no has realizado ningún pedido con este estado.<br>¡Explora nuestra colección y encuentra algo increíble!</p>
                <a href="index.html" class="btn-primary">
                    <i class="fas fa-shopping-bag"></i>
                    Explorar Productos
                </a>
            </div>
        `;
    }

    createSampleOrders() {
        const sampleOrders = [
            {
                orderNumber: '#UC-000123',
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'delivered',
                items: [
                    {
                        id: 1,
                        name: 'Sudadera Urban Cats',
                        price: 899,
                        image: 'images/sudadera_1.jpg',
                        quantity: 1,
                        size: 'M',
                        subtotal: 899
                    }
                ],
                shipping: {
                    name: 'Ale IT',
                    address: 'Calle Principal 123, Col. Centro',
                    city: 'Ciudad de México',
                    postalCode: '06000',
                    cost: 150
                },
                payment: { method: 'card' },
                coupon: null,
                subtotal: 899,
                discount: 0,
                total: 1049
            },
            {
                orderNumber: '#UC-000124',
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'shipped',
                items: [
                    {
                        id: 2,
                        name: 'Jeans Streetwear',
                        price: 1299,
                        image: 'images/jeans_1.jpg',
                        quantity: 1,
                        size: '32',
                        subtotal: 1299
                    },
                    {
                        id: 3,
                        name: 'Crop Top Street',
                        price: 599,
                        image: 'images/crop_top_1.jpg',
                        quantity: 2,
                        size: 'S',
                        subtotal: 1198
                    }
                ],
                shipping: {
                    name: 'Ale IT',
                    address: 'Calle Principal 123, Col. Centro',
                    city: 'Ciudad de México',
                    postalCode: '06000',
                    cost: 150
                },
                payment: { method: 'paypal' },
                coupon: { code: 'UC25OFF', discount: 25 },
                subtotal: 2497,
                discount: 624,
                total: 2023
            },
            {
                orderNumber: '#UC-000125',
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'processing',
                items: [
                    {
                        id: 4,
                        name: 'Chaqueta Denim',
                        price: 1599,
                        image: 'images/chaqueta_denim_1.jpg',
                        quantity: 1,
                        size: 'L',
                        subtotal: 1599
                    }
                ],
                shipping: {
                    name: 'Ale IT',
                    address: 'Calle Principal 123, Col. Centro',
                    city: 'Ciudad de México',
                    postalCode: '06000',
                    cost: 150
                },
                payment: { method: 'card' },
                coupon: null,
                subtotal: 1599,
                discount: 0,
                total: 1749
            },
            {
                orderNumber: '#UC-000126',
                date: new Date().toISOString(),
                status: 'pending',
                items: [
                    {
                        id: 7,
                        name: 'Sneakers Street',
                        price: 1899,
                        image: 'images/snackers_1.jpg',
                        quantity: 1,
                        size: '39',
                        subtotal: 1899
                    }
                ],
                shipping: {
                    name: 'Ale IT',
                    address: 'Calle Principal 123, Col. Centro',
                    city: 'Ciudad de México',
                    postalCode: '06000',
                    cost: 150
                },
                payment: { method: 'card' },
                coupon: null,
                subtotal: 1899,
                discount: 0,
                total: 2049
            }
        ];

        OrderStorage.saveOrders(sampleOrders);
        this.orders = sampleOrders;
    }
}

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar app
    window.ordersApp = new OrdersApp();
    
    console.log('✅ Urban Cats - Orders App cargada correctamente');
});

// Exponer funciones globales si es necesario
window.OrderToast = OrderToast;
window.OrderStorage = OrderStorage;
window.OrderUtils = OrderUtils;