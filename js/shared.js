// Urban Cats - Shared JavaScript
// Funciones compartidas entre todas las páginas
'use strict';

// Clase para manejar localStorage y estado global
class UrbanCatsStorage {
    static getCart() {
        return JSON.parse(localStorage.getItem('urbanCatsCart')) || [];
    }

    static saveCart(cart) {
        localStorage.setItem('urbanCatsCart', JSON.stringify(cart));
    }

    static clearCart() {
        localStorage.removeItem('urbanCatsCart');
    }

    static getCoupon() {
        return JSON.parse(localStorage.getItem('urbanCatsCoupon')) || null;
    }

    static saveCoupon(coupon) {
        localStorage.setItem('urbanCatsCoupon', JSON.stringify(coupon));
    }

    static getUser() {
        return JSON.parse(localStorage.getItem('urbanCatsUser')) || {
            nombre: 'Ale',
            apellido: 'IT',
            email: 'ale@urbancats.com',
            telefono: '+52 555 123 4567',
            avatar: 'images/default-avatar.png'
        };
    }

    static saveUser(user) {
        localStorage.setItem('urbanCatsUser', JSON.stringify(user));
    }

    static getOrders() {
        return JSON.parse(localStorage.getItem('urbanCatsOrders')) || [];
    }

    static saveOrders(orders) {
        localStorage.setItem('urbanCatsOrders', JSON.stringify(orders));
    }

    static addOrder(order) {
        const orders = this.getOrders();
        orders.unshift(order); // Agregar al inicio
        this.saveOrders(orders);
    }

    static getAddresses() {
        return JSON.parse(localStorage.getItem('urbanCatsAddresses')) || [
            {
                id: 1,
                label: 'Principal',
                nombre: 'Ale IT',
                direccion: 'Calle Principal 123',
                colonia: 'Col. Centro',
                ciudad: 'CDMX',
                cp: '06000',
                telefono: '+52 555 123 4567',
                isPrincipal: true
            }
        ];
    }

    static saveAddresses(addresses) {
        localStorage.setItem('urbanCatsAddresses', JSON.stringify(addresses));
    }

    static getPaymentMethods() {
        return JSON.parse(localStorage.getItem('urbanCatsPaymentMethods')) || [
            {
                id: 1,
                brand: 'VISA',
                last4: '4242',
                expiry: '12/26',
                isPrincipal: true
            }
        ];
    }

    static savePaymentMethods(methods) {
        localStorage.setItem('urbanCatsPaymentMethods', JSON.stringify(methods));
    }
}

// Utilidades generales
class Utils {
    static formatPrice(price) {
        return `$${price.toLocaleString('es-MX')}`;
    }

    static formatDate(date) {
        const d = new Date(date);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return d.toLocaleDateString('es-MX', options);
    }

    static generateOrderNumber() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `UC-${timestamp.toString().slice(-6)}${random}`;
    }

    static showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
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

    static calculateDiscount(subtotal, coupon) {
        if (!coupon) return 0;
        return Math.round((subtotal * coupon.discount) / 100);
    }

    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static validatePhone(phone) {
        const re = /^[\d\s\+\-\(\)]+$/;
        return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
    }
}

// Exportar para usar en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UrbanCatsStorage, Utils };
}