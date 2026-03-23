// Urban Cats - Configuración Page JavaScript
// Estilo Minimalista Japonés Contemporáneo
'use strict';

// ============================================
// STORAGE HELPER - Sistema de almacenamiento local
// ============================================
const Storage = {
    // Keys para localStorage
    keys: {
        user: 'urbanCats_user',
        addresses: 'urbanCats_addresses',
        paymentMethods: 'urbanCats_paymentMethods',
        preferences: 'urbanCats_preferences'
    },

    // Obtener usuario
    getUser() {
        const userData = localStorage.getItem(this.keys.user);
        return userData ? JSON.parse(userData) : {
            nombre: 'Usuario',
            apellido: 'Urban Cats',
            email: 'usuario@urbancats.com',
            telefono: '+52 555 123 4567',
            fecha: '',
            avatar: 'images/default-avatar.png'
        };
    },

    // Guardar usuario
    saveUser(user) {
        localStorage.setItem(this.keys.user, JSON.stringify(user));
    },

    // Obtener direcciones
    getAddresses() {
        const addresses = localStorage.getItem(this.keys.addresses);
        return addresses ? JSON.parse(addresses) : [
            {
                id: 1,
                nombre: 'Usuario Urban Cats',
                direccion: 'Calle Principal 123',
                colonia: 'Col. Centro',
                ciudad: 'CDMX',
                cp: '06000',
                telefono: '+52 555 123 4567',
                isPrincipal: true
            }
        ];
    },

    // Guardar direcciones
    saveAddresses(addresses) {
        localStorage.setItem(this.keys.addresses, JSON.stringify(addresses));
    },

    // Obtener métodos de pago
    getPaymentMethods() {
        const methods = localStorage.getItem(this.keys.paymentMethods);
        return methods ? JSON.parse(methods) : [
            {
                id: 1,
                brand: 'VISA',
                last4: '4242',
                expiry: '12/26',
                isPrimary: true
            }
        ];
    },

    // Guardar métodos de pago
    savePaymentMethods(methods) {
        localStorage.setItem(this.keys.paymentMethods, JSON.stringify(methods));
    },

    // Obtener preferencias
    getPreferences() {
        const prefs = localStorage.getItem(this.keys.preferences);
        return prefs ? JSON.parse(prefs) : {
            ofertas: true,
            pedidos: true,
            colecciones: false,
            newsletter: false
        };
    },

    // Guardar preferencias
    savePreferences(prefs) {
        localStorage.setItem(this.keys.preferences, JSON.stringify(prefs));
    }
};

// ============================================
// TOAST NOTIFICATION SYSTEM
// ============================================
const Toast = {
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
// SETTINGS APP - Clase principal
// ============================================
class SettingsApp {
    constructor() {
        this.user = Storage.getUser();
        this.addresses = Storage.getAddresses();
        this.paymentMethods = Storage.getPaymentMethods();
        this.preferences = Storage.getPreferences();
        this.elements = this.initializeElements();
        this.init();
    }

    initializeElements() {
        return {
            // Navigation
            navLinks: document.querySelectorAll('.settings-nav-link'),
            sections: document.querySelectorAll('.settings-section'),
            
            // Forms
            profileForm: document.getElementById('profile-form'),
            securityForm: document.getElementById('security-form'),
            
            // Profile
            profileAvatar: document.getElementById('profile-avatar'),
            profileDisplayName: document.getElementById('profile-display-name'),
            btnChangePhoto: document.getElementById('btn-change-photo'),
            
            // Addresses
            addressesGrid: document.getElementById('addresses-grid'),
            btnAddAddress: document.getElementById('btn-add-address'),
            
            // Cards
            cardsGrid: document.getElementById('cards-grid'),
            btnAddCard: document.getElementById('btn-add-card'),
            
            // Notifications
            notifOfertas: document.getElementById('notif-ofertas'),
            notifPedidos: document.getElementById('notif-pedidos'),
            notifColecciones: document.getElementById('notif-colecciones'),
            notifNewsletter: document.getElementById('notif-newsletter'),
            
            // Security
            currentPassword: document.getElementById('current-password'),
            newPassword: document.getElementById('new-password'),
            confirmPassword: document.getElementById('confirm-password'),
            passwordStrength: document.getElementById('password-strength'),
            btn2FA: document.getElementById('btn-setup-2fa'),
            btnActivity: document.getElementById('btn-view-activity')
        };
    }

    init() {
        this.setupEventListeners();
        this.loadUserProfile();
        this.loadAddresses();
        this.loadPaymentMethods();
        this.loadPreferences();
        this.setupNavigation();
        this.setupPasswordToggles();
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
        // Navigation entre secciones
        this.elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavClick(e.currentTarget);
            });
        });

        // Profile form
        if (this.elements.profileForm) {
            this.elements.profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProfile();
            });
        }

        // Security form
        if (this.elements.securityForm) {
            this.elements.securityForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.changePassword();
            });
        }

        // Change photo button
        if (this.elements.btnChangePhoto) {
            this.elements.btnChangePhoto.addEventListener('click', () => {
                this.changeProfilePhoto();
            });
        }

        // Add address button
        if (this.elements.btnAddAddress) {
            this.elements.btnAddAddress.addEventListener('click', () => {
                this.showAddAddressModal();
            });
        }

        // Add card button
        if (this.elements.btnAddCard) {
            this.elements.btnAddCard.addEventListener('click', () => {
                this.showAddCardModal();
            });
        }

        // Notification toggles
        const notifToggles = [
            this.elements.notifOfertas,
            this.elements.notifPedidos,
            this.elements.notifColecciones,
            this.elements.notifNewsletter
        ];

        notifToggles.forEach(toggle => {
            if (toggle) {
                toggle.addEventListener('change', () => {
                    this.savePreferences();
                });
            }
        });

        // Password strength check
        if (this.elements.newPassword) {
            this.elements.newPassword.addEventListener('input', (e) => {
                this.checkPasswordStrength(e.target.value);
            });
        }

        // 2FA setup
        if (this.elements.btn2FA) {
            this.elements.btn2FA.addEventListener('click', () => {
                this.setup2FA();
            });
        }

        // View activity
        if (this.elements.btnActivity) {
            this.elements.btnActivity.addEventListener('click', () => {
                this.viewActivity();
            });
        }
    }

    setupNavigation() {
        // Check URL hash
        const hash = window.location.hash || '#perfil';
        const targetLink = document.querySelector(`.settings-nav-link[href="${hash}"]`);
        if (targetLink) {
            this.handleNavClick(targetLink);
        }

        // Listen to hash changes
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash || '#perfil';
            const targetLink = document.querySelector(`.settings-nav-link[href="${hash}"]`);
            if (targetLink) {
                this.handleNavClick(targetLink);
            }
        });
    }

    handleNavClick(link) {
        // Update active nav
        this.elements.navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Show corresponding section
        const targetId = link.getAttribute('href').substring(1);
        this.elements.sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === targetId) {
                section.classList.add('active');
            }
        });

        // Update URL
        window.location.hash = link.getAttribute('href');

        // Scroll to top on mobile
        if (window.innerWidth < 768) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // ============================================
    // PROFILE MANAGEMENT
    // ============================================
    loadUserProfile() {
        if (!this.elements.profileForm) return;

        // Cargar datos en el formulario
        document.getElementById('profile-nombre').value = this.user.nombre || '';
        document.getElementById('profile-apellido').value = this.user.apellido || '';
        document.getElementById('profile-email').value = this.user.email || '';
        document.getElementById('profile-telefono').value = this.user.telefono || '';
        document.getElementById('profile-fecha').value = this.user.fecha || '';

        // Update avatar
        if (this.elements.profileAvatar && this.user.avatar) {
            this.elements.profileAvatar.src = this.user.avatar;
        }

        // Update display name
        if (this.elements.profileDisplayName) {
            this.elements.profileDisplayName.textContent = `${this.user.nombre} ${this.user.apellido}`;
        }
    }

    saveProfile() {
        const updatedUser = {
            ...this.user,
            nombre: document.getElementById('profile-nombre').value,
            apellido: document.getElementById('profile-apellido').value,
            email: document.getElementById('profile-email').value,
            telefono: document.getElementById('profile-telefono').value,
            fecha: document.getElementById('profile-fecha').value
        };

        // Validar email
        if (!this.isValidEmail(updatedUser.email)) {
            Toast.show('Por favor ingresa un email válido', 'error');
            return;
        }

        Storage.saveUser(updatedUser);
        this.user = updatedUser;

        // Update display name
        if (this.elements.profileDisplayName) {
            this.elements.profileDisplayName.textContent = `${this.user.nombre} ${this.user.apellido}`;
        }

        Toast.show('Perfil actualizado correctamente', 'success');
    }

    changeProfilePhoto() {
        // Simular cambio de foto
        const photoUrls = [
            'images/default-avatar.png',
            'https://ui-avatars.com/api/?name=Urban+Cats&background=1a1a1a&color=fff&size=200',
            'https://ui-avatars.com/api/?name=UC&background=ff0000&color=fff&size=200'
        ];

        const currentIndex = photoUrls.indexOf(this.user.avatar);
        const nextIndex = (currentIndex + 1) % photoUrls.length;
        
        this.user.avatar = photoUrls[nextIndex];
        Storage.saveUser(this.user);

        if (this.elements.profileAvatar) {
            this.elements.profileAvatar.src = this.user.avatar;
        }

        Toast.show('Foto de perfil actualizada', 'success');
    }

    // ============================================
    // ADDRESSES MANAGEMENT
    // ============================================
    loadAddresses() {
        if (!this.elements.addressesGrid) return;

        if (this.addresses.length === 0) {
            this.elements.addressesGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-map-marker-alt"></i>
                    <p>No tienes direcciones guardadas</p>
                    <button class="btn-secondary" onclick="document.getElementById('btn-add-address').click()">
                        Agregar tu primera dirección
                    </button>
                </div>
            `;
            return;
        }

        this.elements.addressesGrid.innerHTML = this.addresses.map(address => `
            <div class="address-card" data-id="${address.id}">
                <div class="address-header">
                    ${address.isPrincipal ? '<span class="address-label">Principal</span>' : ''}
                    <div>
                        <button class="btn-icon edit-address" data-id="${address.id}" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete-address" data-id="${address.id}" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="address-body">
                    <p><strong>${address.nombre}</strong></p>
                    <p>${address.direccion}</p>
                    <p>${address.colonia}, ${address.ciudad}</p>
                    <p>CP: ${address.cp}</p>
                    <p>Tel: ${address.telefono}</p>
                </div>
            </div>
        `).join('');

        // Attach event listeners
        document.querySelectorAll('.edit-address').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const addressId = parseInt(e.currentTarget.dataset.id);
                this.editAddress(addressId);
            });
        });

        document.querySelectorAll('.delete-address').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const addressId = parseInt(e.currentTarget.dataset.id);
                this.deleteAddress(addressId);
            });
        });
    }

    showAddAddressModal() {
        const nombre = prompt('Nombre completo:');
        if (!nombre) return;

        const direccion = prompt('Dirección (Calle y número):');
        if (!direccion) return;

        const colonia = prompt('Colonia:');
        if (!colonia) return;

        const ciudad = prompt('Ciudad:');
        if (!ciudad) return;

        const cp = prompt('Código Postal:');
        if (!cp) return;

        const telefono = prompt('Teléfono:');
        if (!telefono) return;

        const newAddress = {
            id: Date.now(),
            nombre,
            direccion,
            colonia,
            ciudad,
            cp,
            telefono,
            isPrincipal: this.addresses.length === 0
        };

        this.addresses.push(newAddress);
        Storage.saveAddresses(this.addresses);
        this.loadAddresses();

        Toast.show('Dirección agregada correctamente', 'success');
    }

    editAddress(id) {
        const address = this.addresses.find(a => a.id === id);
        if (!address) return;

        Toast.show('Función de edición próximamente', 'info');
    }

    deleteAddress(id) {
        if (!confirm('¿Estás seguro de eliminar esta dirección?')) return;

        this.addresses = this.addresses.filter(a => a.id !== id);
        Storage.saveAddresses(this.addresses);
        this.loadAddresses();

        Toast.show('Dirección eliminada correctamente', 'success');
    }

    // ============================================
    // PAYMENT METHODS MANAGEMENT
    // ============================================
    loadPaymentMethods() {
        if (!this.elements.cardsGrid) return;

        if (this.paymentMethods.length === 0) {
            this.elements.cardsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-credit-card"></i>
                    <p>No tienes métodos de pago guardados</p>
                    <button class="btn-secondary" onclick="document.getElementById('btn-add-card').click()">
                        Agregar tu primera tarjeta
                    </button>
                </div>
            `;
            return;
        }

        this.elements.cardsGrid.innerHTML = this.paymentMethods.map(method => `
            <div class="card-item" data-id="${method.id}">
                ${method.isPrimary ? '<span class="address-label">Principal</span>' : ''}
                <div class="card-brand">${method.brand}</div>
                <p class="card-number">•••• •••• •••• ${method.last4}</p>
                <p class="card-expiry">Vence: ${method.expiry}</p>
                <div style="margin-top: 20px; display: flex; gap: 10px;">
                    <button class="btn-icon delete-card" data-id="${method.id}" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Attach delete listeners
        document.querySelectorAll('.delete-card').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cardId = parseInt(e.currentTarget.dataset.id);
                this.deleteCard(cardId);
            });
        });
    }

    showAddCardModal() {
        const last4 = prompt('Últimos 4 dígitos de la tarjeta:');
        if (!last4 || last4.length !== 4) {
            Toast.show('Por favor ingresa 4 dígitos', 'error');
            return;
        }

        const expiry = prompt('Fecha de expiración (MM/AA):');
        if (!expiry || !expiry.match(/^\d{2}\/\d{2}$/)) {
            Toast.show('Formato incorrecto. Usa MM/AA', 'error');
            return;
        }

        const brand = prompt('Marca (VISA, Mastercard, AMEX):');
        if (!brand) return;

        const newCard = {
            id: Date.now(),
            brand: brand.toUpperCase(),
            last4,
            expiry,
            isPrimary: this.paymentMethods.length === 0
        };

        this.paymentMethods.push(newCard);
        Storage.savePaymentMethods(this.paymentMethods);
        this.loadPaymentMethods();

        Toast.show('Tarjeta agregada correctamente', 'success');
    }

    deleteCard(id) {
        if (!confirm('¿Estás seguro de eliminar esta tarjeta?')) return;

        this.paymentMethods = this.paymentMethods.filter(m => m.id !== id);
        Storage.savePaymentMethods(this.paymentMethods);
        this.loadPaymentMethods();

        Toast.show('Tarjeta eliminada correctamente', 'success');
    }

    // ============================================
    // NOTIFICATIONS PREFERENCES
    // ============================================
    loadPreferences() {
        if (this.elements.notifOfertas) {
            this.elements.notifOfertas.checked = this.preferences.ofertas;
        }
        if (this.elements.notifPedidos) {
            this.elements.notifPedidos.checked = this.preferences.pedidos;
        }
        if (this.elements.notifColecciones) {
            this.elements.notifColecciones.checked = this.preferences.colecciones;
        }
        if (this.elements.notifNewsletter) {
            this.elements.notifNewsletter.checked = this.preferences.newsletter;
        }
    }

    savePreferences() {
        const updatedPrefs = {
            ofertas: this.elements.notifOfertas?.checked || false,
            pedidos: this.elements.notifPedidos?.checked || false,
            colecciones: this.elements.notifColecciones?.checked || false,
            newsletter: this.elements.notifNewsletter?.checked || false
        };

        Storage.savePreferences(updatedPrefs);
        this.preferences = updatedPrefs;

        Toast.show('Preferencias actualizadas', 'success');
    }

    // ============================================
    // SECURITY
    // ============================================
    changePassword() {
        const current = this.elements.currentPassword.value;
        const newPass = this.elements.newPassword.value;
        const confirm = this.elements.confirmPassword.value;

        // Validaciones
        if (!current || !newPass || !confirm) {
            Toast.show('Por favor completa todos los campos', 'error');
            return;
        }

        if (newPass !== confirm) {
            Toast.show('Las contraseñas no coinciden', 'error');
            return;
        }

        if (newPass.length < 8) {
            Toast.show('La contraseña debe tener al menos 8 caracteres', 'error');
            return;
        }

        // Simular cambio de contraseña
        Toast.show('Contraseña actualizada correctamente', 'success');
        this.elements.securityForm.reset();
        
        // Hide password strength
        if (this.elements.passwordStrength) {
            this.elements.passwordStrength.classList.remove('visible', 'weak', 'medium', 'strong');
        }
    }

    checkPasswordStrength(password) {
        if (!this.elements.passwordStrength) return;

        if (password.length === 0) {
            this.elements.passwordStrength.classList.remove('visible', 'weak', 'medium', 'strong');
            return;
        }

        this.elements.passwordStrength.classList.add('visible');

        let strength = 0;
        
        // Length
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        
        // Has numbers
        if (/\d/.test(password)) strength++;
        
        // Has uppercase
        if (/[A-Z]/.test(password)) strength++;
        
        // Has special chars
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

        // Remove previous classes
        this.elements.passwordStrength.classList.remove('weak', 'medium', 'strong');

        // Add new class based on strength
        if (strength <= 2) {
            this.elements.passwordStrength.classList.add('weak');
        } else if (strength <= 4) {
            this.elements.passwordStrength.classList.add('medium');
        } else {
            this.elements.passwordStrength.classList.add('strong');
        }
    }

    setupPasswordToggles() {
        document.querySelectorAll('.toggle-password').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const input = e.currentTarget.previousElementSibling;
                const icon = e.currentTarget.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    }

    setup2FA() {
        Toast.show('Configuración de 2FA próximamente', 'info');
    }

    viewActivity() {
        Toast.show('Historial de actividad próximamente', 'info');
    }

    // ============================================
    // UTILITIES
    // ============================================
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
}

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar app
    window.settingsApp = new SettingsApp();
    
    console.log('✅ Urban Cats - Settings App cargada correctamente');
});

// Exponer funciones globales si es necesario
window.Toast = Toast;
window.Storage = Storage;