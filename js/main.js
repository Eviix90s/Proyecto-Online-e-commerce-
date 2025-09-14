// Datos de productos simulados
const productos = [
    {
        id: 1,
        name: "Sudadera Urban Cats",
        price: 899,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
        category: "mujer",
        sizes: ["XS", "S", "M", "L"],
        isNew: true
    },
    {
        id: 2,
        name: "Jeans Slim Fit",
        price: 1299,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
        category: "hombre",
        sizes: ["28", "30", "32", "34"],
        isNew: false
    },
    {
        id: 3,
        name: "Crop Top Street",
        price: 599,
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
        category: "mujer",
        sizes: ["XS", "S", "M"],
        isNew: true
    },
    {
        id: 4,
        name: "Chaqueta Denim",
        price: 1599,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
        category: "hombre",
        sizes: ["S", "M", "L", "XL"],
        isNew: false
    },
    {
        id: 5,
        name: "Vestido Urban Chic",
        price: 1099,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop",
        category: "mujer",
        sizes: ["XS", "S", "M", "L"],
        isNew: true
    },
    {
        id: 6,
        name: "Backpack Urbana",
        price: 799,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
        category: "accesorios",
        sizes: ["Único"],
        isNew: false
    },
    {
        id: 7,
        name: "Sneakers Street",
        price: 1899,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
        category: "accesorios",
        sizes: ["36", "37", "38", "39", "40"],
        isNew: true
    },
    {
        id: 8,
        name: "Hoodie Oversized",
        price: 1199,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
        category: "hombre",
        sizes: ["S", "M", "L", "XL"],
        isNew: false
    }
];

// Estado global de la aplicación
let carritoItems = JSON.parse(localStorage.getItem('urbanCatsCart')) || [];
let filtroActivo = 'all';
let productosVisibles = productos.slice(0, 4);

// Elementos DOM
const productosGrid = document.getElementById('products-grid');
const cartSidebar = document.getElementById('cart-sidebar');
const overlay = document.getElementById('overlay');
const cartCount = document.querySelector('.cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const visitCount = document.getElementById('visit-count');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
});

function initializeApp() {
    renderProductos();
    setupEventListeners();
    updateCartUI();
    updateVisitCounter();
    setupScrollAnimations();
}

// Event Listeners
function setupEventListeners() {
    // Filtros de productos
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filtroActivo = this.dataset.filter;
            filterProducts();
        });
    });

    // Carrito
    document.querySelector('.cart-link').addEventListener('click', function(e) {
        e.preventDefault();
        toggleCart();
    });

    document.querySelector('.close-cart').addEventListener('click', closeCart);
    overlay.addEventListener('click', closeCart);

    // Botón cargar más
    document.querySelector('.load-more-btn').addEventListener('click', loadMoreProducts);

    // Newsletter
    document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        showNotification('¡Gracias por suscribirte!', 'success');
        this.reset();
    });

    // Navegación suave
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Mobile menu (preparado para implementación)
    document.querySelector('.mobile-menu-toggle').addEventListener('click', function() {
        // Implementar menú móvil
        console.log('Toggle mobile menu');
    });
}

// Renderización de productos
function renderProductos(productos = productosVisibles) {
    if (!productosGrid) return;
    
    productosGrid.innerHTML = productos.map(producto => `
        <div class="product-card" data-id="${producto.id}" data-category="${producto.category}">
            <div class="product-image-container">
                <img src="${producto.image}" alt="${producto.name}" class="product-image" loading="lazy">
                <div class="product-actions">
                    <button class="quick-view-btn" onclick="quickView(${producto.id})" title="Vista rápida">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="add-to-wishlist" onclick="addToWishlist(${producto.id})" title="Agregar a favoritos">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                ${producto.isNew ? '<span class="product-badge">Nuevo</span>' : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${producto.name}</h3>
                <p class="product-price">$${producto.price.toLocaleString()}</p>
                <div class="product-sizes">
                    ${producto.sizes.map(size => `<span class="size-option" onclick="addToCart(${producto.id}, '${size}')">${size}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
    
    // Aplicar animaciones de entrada
    animateProductCards();
}

// Filtrado de productos
function filterProducts() {
    let productosFiltrados = productos;
    
    if (filtroActivo !== 'all') {
        if (filtroActivo === 'nuevo') {
            productosFiltrados = productos.filter(p => p.isNew);
        } else {
            productosFiltrados = productos.filter(p => p.category === filtroActivo);
        }
    }
    
    productosVisibles = productosFiltrados.slice(0, 4);
    renderProductos();
}

// Cargar más productos
function loadMoreProducts() {
    const currentLength = productosVisibles.length;
    let productosFiltrados = productos;
    
    if (filtroActivo !== 'all') {
        if (filtroActivo === 'nuevo') {
            productosFiltrados = productos.filter(p => p.isNew);
        } else {
            productosFiltrados = productos.filter(p => p.category === filtroActivo);
        }
    }
    
    const nextProducts = productosFiltrados.slice(currentLength, currentLength + 4);
    productosVisibles = [...productosVisibles, ...nextProducts];
    
    if (productosVisibles.length >= productosFiltrados.length) {
        document.querySelector('.load-more-btn').style.display = 'none';
    }
    
    renderProductos();
}

// Funciones del carrito
function addToCart(productId, size) {
    const producto = productos.find(p => p.id === productId);
    if (!producto) return;
    
    const existingItem = carritoItems.find(item => item.id === productId && item.size === size);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        carritoItems.push({
            id: productId,
            name: producto.name,
            price: producto.price,
            image: producto.image,
            size: size,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    showNotification('Producto agregado al carrito', 'success');
}

function removeFromCart(productId, size) {
    carritoItems = carritoItems.filter(item => !(item.id === productId && item.size === size));
    saveCart();
    updateCartUI();
    renderCartItems();
}

function updateQuantity(productId, size, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId, size);
        return;
    }
    
    const item = carritoItems.find(item => item.id === productId && item.size === size);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        updateCartUI();
        renderCartItems();
    }
}

function saveCart() {
    localStorage.setItem('urbanCatsCart', JSON.stringify(carritoItems));
}

function updateCartUI() {
    const totalItems = carritoItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = carritoItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    cartTotal.textContent = totalPrice.toLocaleString();
    
    renderCartItems();
}

function renderCartItems() {
    if (!cartItems) return;
    
    if (carritoItems.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag"></i>
                <p>Tu carrito está vacío</p>
                <button class="continue-shopping" onclick="closeCart()">Seguir Comprando</button>
            </div>
        `;
        return;
    }
    
    cartItems.innerHTML = carritoItems.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>Talla: ${item.size}</p>
                <p class="cart-item-price">$${item.price.toLocaleString()}</p>
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${item.id}, '${item.size}', ${item.quantity - 1})" class="qty-btn">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, '${item.size}', ${item.quantity + 1})" class="qty-btn">+</button>
                </div>
            </div>
            <button onclick="removeFromCart(${item.id}, '${item.size}')" class="remove-item">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function toggleCart() {
    cartSidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
}

function closeCart() {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Funciones adicionales
function quickView(productId) {
    const producto = productos.find(p => p.id === productId);
    showNotification(`Vista rápida: ${producto.name}`, 'info');
    // Aquí se implementaría un modal con detalles del producto
}

function addToWishlist(productId) {
    const producto = productos.find(p => p.id === productId);
    showNotification(`${producto.name} agregado a favoritos`, 'success');
    // Implementar funcionalidad de wishlist
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => notification.remove(), 4000);
}

// Contador de visitas
function updateVisitCounter() {
    let visits = localStorage.getItem('urbanCatsVisits') || 0;
    visits = parseInt(visits) + 1;
    localStorage.setItem('urbanCatsVisits', visits);
    
    if (visitCount) {
        visitCount.textContent = visits.toLocaleString();
    }
}

// Animaciones de scroll
function setupScrollAnimations() {
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
    
    // Observar elementos que necesitan animación
    document.querySelectorAll('.product-card, .collection-card, .category-card').forEach(el => {
        observer.observe(el);
    });
}

function animateProductCards() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('reveal-animation');
        }, index * 100);
    });
}

// Funciones de navegación
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Navbar scroll effect
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// Funciones globales para onclick
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.quickView = quickView;
window.addToWishlist = addToWishlist;
window.closeCart = closeCart;
window.scrollToSection = scrollToSection;
// Slider functionality
let currentSlide = 0;
let slideInterval;

function initializeSlider() {
    const dots = document.querySelectorAll('.dot');
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    startAutoSlide();
}

function goToSlide(slideIndex) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[slideIndex].classList.add('active');
    dots[slideIndex].classList.add('active');
    
    currentSlide = slideIndex;
}

function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    const nextIndex = (currentSlide + 1) % slides.length;
    goToSlide(nextIndex);
}

function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 4000);
}

// Inicializar slider
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    initializeSlider();
});