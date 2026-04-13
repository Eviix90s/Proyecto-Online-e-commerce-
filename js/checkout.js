
// Urban Cats - Checkout JavaScript - Minimalista Japonés
'use strict';

// Storage Helper
const CheckoutStorage = {
    keys: {
        cart: 'urbanCatsCart',
        orders: 'urbanCatsOrders',
        user: 'urbanCatsUser',
        addresses: 'urbanCatsAddresses',
        coupon: 'urbanCatsCoupon'
    },

    getCart() {
        const cart = localStorage.getItem(this.keys.cart);
        return cart ? JSON.parse(cart) : [];
    },

    clearCart() {
        localStorage.removeItem(this.keys.cart);
    },

    getOrders() {
        const orders = localStorage.getItem(this.keys.orders);
        return orders ? JSON.parse(orders) : [];
    },

    addOrder(order) {
        const orders = this.getOrders();
        orders.unshift(order);
        localStorage.setItem(this.keys.orders, JSON.stringify(orders));
    },

    getUser() {
        const user = localStorage.getItem(this.keys.user);
        return user ? JSON.parse(user) : { nombre: '', email: '' };
    },

    getAddresses() {
        const addresses = localStorage.getItem(this.keys.addresses);
        return addresses ? JSON.parse(addresses) : [];
    },

    getActiveCoupon() {
        const coupon = localStorage.getItem(this.keys.coupon);
        return coupon ? JSON.parse(coupon) : null;
    },

    setActiveCoupon(coupon) {
        localStorage.setItem(this.keys.coupon, JSON.stringify(coupon));
    },

    clearCoupon() {
        localStorage.removeItem(this.keys.coupon);
    }
};

// Toast System
const CheckoutToast = {
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
                <i class="fas fa-${icons[type]}"></i>
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

// Utils
const CheckoutUtils = {
    formatPrice(price) {
        return `$${price.toLocaleString('es-MX')}`;
    },

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    validatePhone(phone) {
        return /^\+?\d{10,}$/.test(phone.replace(/\s/g, ''));
    },

    formatCardNumber(number) {
        return number.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    },

    formatExpiry(value) {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length >= 2) {
            return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
        }
        return cleaned;
    },

    generateOrderNumber() {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `#UC-${timestamp}${random}`;
    }
};

// Cupones válidos
const VALID_COUPONS = {
    'UC10': { discount: 10, type: 'percentage' },
    'UC25OFF': { discount: 25, type: 'percentage' },
    'URBAN50': { discount: 50, type: 'fixed' },
    'FIRST100': { discount: 100, type: 'fixed' }
};

// Checkout App
class CheckoutApp {
    constructor() {
        this.cart = CheckoutStorage.getCart();
        this.activeCoupon = CheckoutStorage.getActiveCoupon();
        this.user = CheckoutStorage.getUser();
        this.addresses = CheckoutStorage.getAddresses();
        this.shippingCost = 0; // Envío gratis
        this.selectedPayment = 'card';
        this.elements = this.initializeElements();
        this.init();
    }

    initializeElements() {
        return {
            summaryItems: document.getElementById('summary-items'),
            summaryItemsCount: document.getElementById('summary-items-count'),
            subtotal: document.getElementById('subtotal'),
            shippingCost: document.getElementById('shipping-cost'),
            discountRow: document.getElementById('discount-row'),
            discountAmount: document.getElementById('discount-amount'),
            couponCode: document.getElementById('coupon-code'),
            total: document.getElementById('total'),
            checkoutBtn: document.getElementById('checkout-btn'),
            shippingForm: document.getElementById('shipping-form'),
            savedAddresses: document.getElementById('saved-addresses'),
            paymentMethods: document.querySelectorAll('input[name="payment"]'),
            cardDetails: document.getElementById('card-details'),
            cardNumber: document.getElementById('card-number'),
            cardExpiry: document.getElementById('card-expiry'),
            cardCVV: document.getElementById('card-cvv'),
            couponInput: document.getElementById('coupon-input'),
            couponApplyBtn: document.getElementById('coupon-apply-btn'),
            couponMessage: document.getElementById('coupon-message')
        };
    }

    init() {
        if (this.cart.length === 0) {
            this.showEmptyCart();
            return;
        }

        this.renderSummary();
        this.renderSavedAddresses();
        this.setupEventListeners();
        this.prefillUserData();
        this.prefillCoupon();
        this.hideLoadingScreen();
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => loadingScreen.style.display = 'none', 500);
            }, 1000);
        }
    }

    setupEventListeners() {
        // Payment methods
        this.elements.paymentMethods.forEach(method => {
            method.addEventListener('change', (e) => {
                this.selectedPayment = e.target.value;
                this.updatePaymentMethodUI();
                this.toggleCardDetails();
            });
        });

        // Card formatting
        if (this.elements.cardNumber) {
            this.elements.cardNumber.addEventListener('input', (e) => {
                e.target.value = CheckoutUtils.formatCardNumber(e.target.value);
            });
        }

        if (this.elements.cardExpiry) {
            this.elements.cardExpiry.addEventListener('input', (e) => {
                e.target.value = CheckoutUtils.formatExpiry(e.target.value);
            });
        }

        // Coupon
        if (this.elements.couponApplyBtn) {
            this.elements.couponApplyBtn.addEventListener('click', () => this.applyCoupon());
        }

        if (this.elements.couponInput) {
            this.elements.couponInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.applyCoupon();
                }
            });
        }

        // Checkout button
        if (this.elements.checkoutBtn) {
            this.elements.checkoutBtn.addEventListener('click', () => this.processCheckout());
        }

        // Form validation on blur
        const inputs = this.elements.shippingForm?.querySelectorAll('input');
        inputs?.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
        });
    }

    updatePaymentMethodUI() {
        document.querySelectorAll('.payment-method').forEach(method => {
            method.classList.remove('active');
        });
        const activeMethod = document.querySelector(`input[name="payment"][value="${this.selectedPayment}"]`);
        if (activeMethod) {
            activeMethod.closest('.payment-method').classList.add('active');
        }
    }

    toggleCardDetails() {
        if (this.elements.cardDetails) {
            if (this.selectedPayment === 'card') {
                this.elements.cardDetails.classList.remove('hidden');
            } else {
                this.elements.cardDetails.classList.add('hidden');
            }
        }
    }

    renderSavedAddresses() {
        if (!this.elements.savedAddresses) return;
        if (this.addresses.length === 0) return;

        this.elements.savedAddresses.innerHTML = this.addresses.map(addr => `
            <div class="saved-address" data-id="${addr.id}">
                <div class="saved-address-content">
                    <h4>${addr.nombre}</h4>
                    <p>${addr.direccion}, ${addr.ciudad}, CP: ${addr.cp}</p>
                </div>
                ${addr.isPrincipal ? '<span class="address-label">Principal</span>' : ''}
            </div>
        `).join('');

        document.querySelectorAll('.saved-address').forEach(el => {
            el.addEventListener('click', () => {
                const id = parseInt(el.dataset.id);
                this.selectAddress(id);
            });
        });
    }

    selectAddress(id) {
        const address = this.addresses.find(a => a.id === id);
        if (!address) return;

        document.querySelectorAll('.saved-address').forEach(el => el.classList.remove('selected'));
        document.querySelector(`.saved-address[data-id="${id}"]`)?.classList.add('selected');

        const form = this.elements.shippingForm;
        if (form) {
            form.querySelector('#shipping-name').value = address.nombre;
            form.querySelector('#shipping-phone').value = address.telefono;
            form.querySelector('#shipping-address').value = address.direccion;
            form.querySelector('#shipping-city').value = address.ciudad;
            form.querySelector('#shipping-postal').value = address.cp;
        }
    }

    prefillUserData() {
        if (this.user.nombre) {
            const form = this.elements.shippingForm;
            if (form) {
                form.querySelector('#shipping-email').value = this.user.email || '';
            }
        }

        const principalAddress = this.addresses.find(a => a.isPrincipal);
        if (principalAddress) {
            this.selectAddress(principalAddress.id);
        }
    }

    renderSummary() {
        if (!this.elements.summaryItems) return;

        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        if (this.elements.summaryItemsCount) {
            this.elements.summaryItemsCount.textContent = `${totalItems} producto${totalItems !== 1 ? 's' : ''}`;
        }

        this.elements.summaryItems.innerHTML = this.cart.map((item, idx) => {
            const sizeLabel = item.selectedSize || item.size;
            return `
            <div class="summary-item" data-idx="${idx}">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
                <div class="summary-item-details">
                    <h4>${item.name}</h4>
                    ${sizeLabel ? `<p class="summary-item-size">Talla: ${sizeLabel}</p>` : ''}
                    <div class="summary-qty-controls">
                        <button class="summary-qty-btn" onclick="checkoutApp.changeItemQty(${idx},-1)">−</button>
                        <span class="summary-qty-val">${item.quantity}</span>
                        <button class="summary-qty-btn" onclick="checkoutApp.changeItemQty(${idx},1)">+</button>
                    </div>
                </div>
                <div class="summary-item-right">
                    <span class="summary-item-price">${CheckoutUtils.formatPrice(item.price * item.quantity)}</span>
                    <button class="summary-item-remove" onclick="checkoutApp.removeItem(${idx})" title="Eliminar">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>`;
        }).join('');

        this.updateTotals();
    }

    changeItemQty(idx, delta) {
        if (!this.cart[idx]) return;
        const newQty = this.cart[idx].quantity + delta;
        if (newQty < 1) { this.removeItem(idx); return; }
        this.cart[idx].quantity = newQty;
        localStorage.setItem('urbanCatsCart', JSON.stringify(this.cart));
        this.renderSummary();
        if (typeof cartSystem !== 'undefined') cartSystem.refresh();
    }

    removeItem(idx) {
        if (!this.cart[idx]) return;
        const name = this.cart[idx].name;
        this.cart.splice(idx, 1);
        localStorage.setItem('urbanCatsCart', JSON.stringify(this.cart));
        if (this.cart.length === 0) { this.showEmptyCart(); return; }
        this.renderSummary();
        if (typeof cartSystem !== 'undefined') cartSystem.refresh();
        CheckoutToast.show(`"${name}" eliminado del carrito`, 'info');
    }

    updateTotals() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let discountAmount = 0;

        if (this.activeCoupon) {
            if (this.activeCoupon.type === 'percentage') {
                discountAmount = (subtotal * this.activeCoupon.discount) / 100;
            } else {
                discountAmount = this.activeCoupon.discount;
            }
        }

        const total = subtotal + this.shippingCost - discountAmount;

        if (this.elements.subtotal) {
            this.elements.subtotal.textContent = CheckoutUtils.formatPrice(subtotal);
        }

        if (this.activeCoupon && this.elements.discountRow) {
            this.elements.discountRow.style.display = 'flex';
            this.elements.discountAmount.textContent = `-${CheckoutUtils.formatPrice(discountAmount)}`;
            if (this.elements.couponCode) {
                this.elements.couponCode.textContent = `(${this.activeCoupon.code})`;
            }
        } else if (this.elements.discountRow) {
            this.elements.discountRow.style.display = 'none';
        }

        if (this.elements.total) {
            this.elements.total.textContent = CheckoutUtils.formatPrice(total);
        }
    }

    applyCoupon() {
        const code = this.elements.couponInput?.value.trim().toUpperCase();
        if (!code) return;

        const couponData = VALID_COUPONS[code];
        
        if (couponData) {
            this.activeCoupon = { code, ...couponData };
            CheckoutStorage.setActiveCoupon(this.activeCoupon);
            this.updateTotals();
            
            this.showCouponMessage('¡Cupón aplicado correctamente!', 'success');
            CheckoutToast.show('Cupón aplicado exitosamente', 'success');
            
            if (this.elements.couponInput) {
                this.elements.couponInput.value = '';
                this.elements.couponInput.disabled = true;
            }
            if (this.elements.couponApplyBtn) {
                this.elements.couponApplyBtn.disabled = true;
            }
        } else {
            this.showCouponMessage('Cupón inválido o expirado', 'error');
        }
    }

    prefillCoupon() {
        if (!this.activeCoupon) return;
        const input = this.elements.couponInput;
        const btn = this.elements.couponApplyBtn;
        if (input) { input.value = this.activeCoupon.code; input.disabled = true; }
        if (btn) btn.disabled = true;
        this.showCouponMessage(`¡Cupón "${this.activeCoupon.code}" aplicado desde tu carrito!`, 'success');
    }

    showCouponMessage(message, type) {
        if (!this.elements.couponMessage) return;
        
        this.elements.couponMessage.textContent = message;
        this.elements.couponMessage.className = `coupon-message ${type}`;
    }

    validateField(input) {
        const value = input.value.trim();
        let isValid = true;

        if (input.type === 'email') {
            isValid = CheckoutUtils.validateEmail(value);
        } else if (input.type === 'tel') {
            isValid = CheckoutUtils.validatePhone(value);
        } else if (input.required) {
            isValid = value.length > 0;
        }

        if (!isValid) {
            input.style.borderColor = 'var(--accent-red)';
        } else {
            input.style.borderColor = 'var(--gray-border)';
        }

        return isValid;
    }

    validateForm() {
        const form = this.elements.shippingForm;
        if (!form) return false;

        const inputs = form.querySelectorAll('input[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (this.selectedPayment === 'card') {
            if (this.elements.cardNumber && !this.validateField(this.elements.cardNumber)) isValid = false;
            if (this.elements.cardExpiry && !this.validateField(this.elements.cardExpiry)) isValid = false;
            if (this.elements.cardCVV && !this.validateField(this.elements.cardCVV)) isValid = false;
        }

        return isValid;
    }

    processCheckout() {
        if (!this.validateForm()) {
            CheckoutToast.show('Por favor completa todos los campos correctamente', 'error');
            return;
        }
        this._openPaymentModal();
    }

    _openPaymentModal() {
        const modal = document.getElementById('payment-modal');
        if (!modal) return;

        // Resetear estados
        document.getElementById('pm-processing').style.display = 'block';
        document.getElementById('pm-success').style.display = 'none';
        document.getElementById('pm-error').style.display = 'none';
        document.getElementById('pm-progress-fill').style.width = '0%';
        document.getElementById('pm-step-text').textContent = 'Verificando información...';
        document.querySelectorAll('.pm-payment-icons i').forEach(i => i.classList.remove('active-icon'));

        modal.classList.add('active');

        // Secuencia de pasos animados
        const steps = [
            { text: 'Verificando información...', progress: '28%', iconIdx: 0 },
            { text: 'Procesando pago...',          progress: '62%', iconIdx: 1 },
            { text: 'Confirmando pedido...',        progress: '88%', iconIdx: 2 }
        ];
        const stepTextEl    = document.getElementById('pm-step-text');
        const progressFill  = document.getElementById('pm-progress-fill');
        const icons         = document.querySelectorAll('.pm-payment-icons i');

        let stepIdx = 0;
        const applyStep = () => {
            if (stepIdx >= steps.length) return;
            const s = steps[stepIdx++];
            stepTextEl.style.opacity = '0';
            setTimeout(() => { stepTextEl.textContent = s.text; stepTextEl.style.opacity = '1'; }, 180);
            progressFill.style.width = s.progress;
            icons.forEach((ic, i) => ic.classList.toggle('active-icon', i === s.iconIdx));
        };

        applyStep();
        const interval = setInterval(() => { applyStep(); if (stepIdx >= steps.length) clearInterval(interval); }, 950);

        // Después de ~3s → procesar y mostrar resultado
        setTimeout(() => {
            clearInterval(interval);
            progressFill.style.width = '100%';
            setTimeout(() => {
                try {
                    const order = this.createOrder();
                    CheckoutStorage.addOrder(order);
                    CheckoutStorage.clearCart();
                    CheckoutStorage.clearCoupon();

                    // Llamar API ticket (fire & forget)
                    const form = this.elements.shippingForm;
                    fetch('/api/ticket', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            orden_id:    order.orderNumber,
                            nombre:      form.querySelector('#shipping-name').value,
                            email:       form.querySelector('#shipping-email').value,
                            telefono:    form.querySelector('#shipping-phone').value,
                            direccion:   form.querySelector('#shipping-address').value,
                            ciudad:      form.querySelector('#shipping-city').value,
                            codigo_postal: form.querySelector('#shipping-postal').value,
                            notas:       form.querySelector('#shipping-notes')?.value || '',
                            metodo_pago: order.payment?.method || 'card',
                            total:       order.total,
                            items:       order.items
                        })
                    }).catch(() => {});

                    this._showPaymentSuccess(order.orderNumber);
                } catch (e) {
                    this._showPaymentError('No pudimos procesar tu pedido. Por favor intenta de nuevo.');
                }
            }, 350);
        }, 2950);
    }

    _showPaymentSuccess(orderNumber) {
        document.getElementById('pm-processing').style.display = 'none';
        document.getElementById('pm-success').style.display = 'block';
        document.getElementById('pm-order-num').textContent = orderNumber;

        let count = 4;
        const countEl = document.getElementById('pm-countdown');
        if (countEl) countEl.textContent = count;
        const timer = setInterval(() => {
            count--;
            if (countEl) countEl.textContent = count;
            if (count <= 0) { clearInterval(timer); window.location.href = 'pedidos.html'; }
        }, 1000);
    }

    _showPaymentError(message) {
        document.getElementById('pm-processing').style.display = 'none';
        document.getElementById('pm-error').style.display = 'block';
        document.getElementById('pm-error-msg').textContent = message;

        const modal = document.getElementById('payment-modal');
        document.getElementById('pm-retry-btn').onclick = () => {
            modal.classList.remove('active');
        };
        document.getElementById('pm-close-btn').onclick = () => {
            modal.classList.remove('active');
        };
    }

    createOrder() {
        const form = this.elements.shippingForm;
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let discountAmount = 0;

        if (this.activeCoupon) {
            if (this.activeCoupon.type === 'percentage') {
                discountAmount = (subtotal * this.activeCoupon.discount) / 100;
            } else {
                discountAmount = this.activeCoupon.discount;
            }
        }

        const total = subtotal + this.shippingCost - discountAmount;

        return {
            orderNumber: CheckoutUtils.generateOrderNumber(),
            date: new Date().toISOString(),
            status: 'pending',
            items: this.cart.map(item => ({
                ...item,
                subtotal: item.price * item.quantity
            })),
            shipping: {
                name: form.querySelector('#shipping-name').value,
                email: form.querySelector('#shipping-email').value,
                phone: form.querySelector('#shipping-phone').value,
                address: form.querySelector('#shipping-address').value,
                city: form.querySelector('#shipping-city').value,
                postalCode: form.querySelector('#shipping-postal').value,
                notes: form.querySelector('#shipping-notes')?.value || '',
                cost: this.shippingCost
            },
            payment: {
                method: this.selectedPayment
            },
            coupon: this.activeCoupon,
            subtotal: subtotal,
            discount: discountAmount,
            total: total
        };
    }

    showEmptyCart() {
        const main = document.querySelector('.checkout-page');
        if (!main) return;

        main.innerHTML = `
            <div class="container" style="text-align: center; padding: 100px 20px;">
                <div style="font-size: 80px; color: var(--gray-medium); opacity: 0.3; margin-bottom: 30px;">
                    <i class="fas fa-shopping-bag"></i>
                </div>
                <h2 style="font-size: 2.5rem; font-weight: 300; margin-bottom: 20px; color: var(--primary-black);">Tu carrito está vacío</h2>
                <p style="color: var(--gray-medium); margin-bottom: 40px; font-size: 18px;">Agrega productos para continuar con tu compra</p>
                <a href="index.html" style="display: inline-block; padding: 18px 40px; background: var(--primary-black); color: var(--pure-white); text-decoration: none; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; transition: var(--transition);">
                    <i class="fas fa-shopping-bag"></i> Ir a la Tienda
                </a>
            </div>
        `;
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    window.checkoutApp = new CheckoutApp();
    console.log('✅ Urban Cats - Checkout App cargada');
});

window.CheckoutToast = CheckoutToast;
window.CheckoutStorage = CheckoutStorage;