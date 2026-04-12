'use strict';

// ============================================================
//  Urban Cats – Sistema Universal de Carrito (cart.js)
//  Gestiona carrito + cupones en TODAS las páginas.
//  Clave localStorage: 'urbanCatsCart' / 'urbanCatsCoupon'
// ============================================================

const CART_COUPONS = {
    'UC10':     { discount: 10,  type: 'percentage', label: '10% de descuento' },
    'UC25OFF':  { discount: 25,  type: 'percentage', label: '25% de descuento' },
    'URBAN50':  { discount: 50,  type: 'fixed',      label: '$50 de descuento' },
    'FIRST100': { discount: 100, type: 'fixed',      label: '$100 de descuento' }
};

const cartSystem = {
    CART_KEY:     'urbanCatsCart',
    COUPON_KEY:   'urbanCatsCoupon',
    WISHLIST_KEY: 'urbanCatsWishlist',

    // ── Search ───────────────────────────────────────────────
    _searchProducts: [],
    _searchDebounceTimer: null,
    _searchPages: [
        { name: 'Inicio',      url: 'index.html',       icon: 'fas fa-home',        desc: 'Página principal' },
        { name: 'Mujer',       url: 'women.html',       icon: 'fas fa-female',      desc: 'Moda femenina' },
        { name: 'Hombre',      url: 'men.html',         icon: 'fas fa-male',        desc: 'Moda masculina' },
        { name: 'Accesorios',  url: 'accessories.html', icon: 'fas fa-gem',         desc: 'Bolsos, relojes, joyería' },
        { name: 'Ofertas',     url: 'offers.html',      icon: 'fas fa-tag',         desc: 'Descuentos especiales' },
        { name: 'Lookbook',    url: 'lookbook.html',    icon: 'fas fa-book-open',   desc: 'Inspiración y estilo' },
        { name: 'Nosotros',    url: 'about.html',       icon: 'fas fa-info-circle', desc: 'Sobre Urban Cats' },
    ],
    _searchAccount: [
        { name: 'Mi cuenta',     url: 'login.html',         icon: 'fas fa-user',         desc: 'Iniciar sesión o registrarse' },
        { name: 'Registrarse',   url: 'registrar.html',     icon: 'fas fa-user-plus',    desc: 'Crear cuenta nueva' },
        { name: 'Mis pedidos',   url: 'pedidos.html',       icon: 'fas fa-box',          desc: 'Historial de pedidos' },
        { name: 'Configuración', url: 'configuracion.html', icon: 'fas fa-cog',          desc: 'Ajustes de cuenta' },
        { name: 'Favoritos',     url: '#',                  icon: 'fas fa-heart',        desc: 'Lista de favoritos',      action: 'wishlist' },
        { name: 'Carrito',       url: '#',                  icon: 'fas fa-shopping-bag', desc: 'Ver carrito de compras',  action: 'cart' },
    ],

    // ── Acceso a datos ──────────────────────────────────────
    getCart() {
        return JSON.parse(localStorage.getItem(this.CART_KEY)) || [];
    },
    saveCart(cart) {
        localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
    },
    getCoupon() {
        return JSON.parse(localStorage.getItem(this.COUPON_KEY)) || null;
    },

    // ── Verificar sesión ────────────────────────────────────
    isLoggedIn() {
        return !!localStorage.getItem('userId');
    },

    // ── Operaciones del carrito ─────────────────────────────
    addToCart(product) {
        const cart = this.getCart();
        const existing = cart.find(i => i.id === product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ ...product, quantity: product.quantity || 1 });
        }
        this.saveCart(cart);
        this.refresh();
    },

    removeFromCart(id) {
        this.saveCart(this.getCart().filter(i => i.id !== id));
        this.refresh();
    },

    updateQuantity(id, delta) {
        const cart = this.getCart();
        const item = cart.find(i => i.id === id);
        if (!item) return;
        item.quantity += delta;
        if (item.quantity <= 0) {
            this.saveCart(cart.filter(i => i.id !== id));
        } else {
            this.saveCart(cart);
        }
        this.refresh();
    },

    clearCart() {
        localStorage.removeItem(this.CART_KEY);
        this.refresh();
    },

    // ── Wishlist ─────────────────────────────────────────────
    getWishlist() {
        const raw = JSON.parse(localStorage.getItem(this.WISHLIST_KEY)) || [];
        return raw.filter(item => item && typeof item === 'object' && item.id);
    },

    saveWishlist(list) {
        localStorage.setItem(this.WISHLIST_KEY, JSON.stringify(list));
    },

    removeFromWishlist(id) {
        const raw = JSON.parse(localStorage.getItem(this.WISHLIST_KEY)) || [];
        const updated = raw.filter(item => (item?.id ?? item) !== id);
        localStorage.setItem(this.WISHLIST_KEY, JSON.stringify(updated));
        this._updateWishlistBadge();
        this._renderWishlistSidebar();
        // Update heart button on card if visible
        const btn = document.querySelector(`[data-product-id="${id}"] .product-wishlist-btn`);
        if (btn) btn.classList.remove('active');
    },

    wishlistAddToCart(id) {
        const item = this.getWishlist().find(i => i.id === id);
        if (!item) return;
        const prod = this._getProductData(id);
        const sizes = prod?.sizes || item.sizes || [];
        if (sizes.length > 1) {
            this.openProductPreview(id);
            return;
        }
        this.addToCart({
            id: item.id, name: item.name, price: item.price, image: item.image,
            selectedSize: sizes[0] || 'Único',
            selectedColor: (prod?.colors || item.colors || [])[0] || ''
        });
    },

    refreshWishlist() {
        this._updateWishlistBadge();
        const sidebar = document.getElementById('wishlist-sidebar');
        if (sidebar && sidebar.classList.contains('open')) {
            this._renderWishlistSidebar();
        }
    },

    openWishlist() {
        const sidebar = document.getElementById('wishlist-sidebar');
        const overlay = document.getElementById('overlay');
        if (!sidebar) return;
        this.closeCart();
        sidebar.classList.add('open');
        if (overlay) { overlay.classList.add('active'); overlay.classList.add('show'); }
        document.body.style.overflow = 'hidden';
        this._renderWishlistSidebar();
    },

    closeWishlist() {
        const sidebar = document.getElementById('wishlist-sidebar');
        const overlay = document.getElementById('overlay');
        if (!sidebar || !sidebar.classList.contains('open')) return;
        sidebar.classList.remove('open');
        if (overlay) { overlay.classList.remove('active'); overlay.classList.remove('show'); }
        document.body.style.overflow = '';
    },

    _renderWishlistSidebar() {
        const el = document.getElementById('wishlist-items');
        if (!el) return;
        const list = this.getWishlist();
        if (list.length === 0) {
            el.innerHTML = `
                <div class="wl-empty">
                    <i class="fas fa-heart-broken"></i>
                    <h4>Tu lista está vacía</h4>
                    <p>Dale corazón a los productos que más te gusten</p>
                </div>`;
            return;
        }
        el.innerHTML = list.map(item => `
            <div class="wl-item" data-wl-id="${item.id}">
                <img class="wl-img" src="${item.image}" alt="${item.name}" style="cursor:pointer"
                     onclick="cartSystem.openProductPreview(${item.id})">
                <div class="wl-info">
                    <p class="wl-name" style="cursor:pointer" onclick="cartSystem.openProductPreview(${item.id})">${item.name}</p>
                    <p class="wl-price">$${item.price.toLocaleString('es-MX')}</p>
                    <div class="wl-actions">
                        <button class="wl-add-btn" onclick="cartSystem.wishlistAddToCart(${item.id})">
                            <i class="fas fa-shopping-bag"></i> Agregar al carrito
                        </button>
                        <button class="wl-remove-btn" onclick="cartSystem.removeFromWishlist(${item.id})" title="Quitar de favoritos">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>`).join('');
    },

    _updateWishlistBadge() {
        const count = this.getWishlist().length;
        document.querySelectorAll('.wishlist-count').forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });
    },

    // ── Búsqueda ─────────────────────────────────────────────
    registerSearchProducts(products, pageUrl) {
        this._searchProducts = products.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.image,
            category: p.category,
            description: p.description,
            pageUrl
        }));
        // Registrar catálogo completo para modales (persiste en sessionStorage)
        try {
            const reg = JSON.parse(sessionStorage.getItem('ucProductRegistry') || '{}');
            products.forEach(p => {
                reg[p.id] = {
                    id: p.id, name: p.name, price: p.price, image: p.image,
                    description: p.description || '', category: p.category || '',
                    sizes: p.sizes || [], colors: p.colors || [],
                    originalPrice: p.originalPrice || null,
                    isNew: !!p.isNew, inStock: p.inStock !== false
                };
            });
            sessionStorage.setItem('ucProductRegistry', JSON.stringify(reg));
        } catch {}
    },

    _getProductData(id) {
        // Busca en registro de sesión, luego en wishlist guardado
        try {
            const reg = JSON.parse(sessionStorage.getItem('ucProductRegistry') || '{}');
            if (reg[id]) return reg[id];
        } catch {}
        const wlItem = this.getWishlist().find(i => i.id === id);
        if (wlItem) return wlItem;
        const cartItem = this.getCart().find(i => i.id === id);
        if (cartItem) return cartItem;
        return null;
    },

    openSearch() {
        const srch = document.getElementById('search-overlay');
        if (!srch) return;
        this.closeCart();
        this.closeWishlist();
        srch.classList.add('open');
        document.body.style.overflow = 'hidden';
        const input = document.getElementById('srch-input');
        if (input) { input.value = ''; input.focus(); }
        this._renderSearchResults('');
    },

    closeSearch() {
        const srch = document.getElementById('search-overlay');
        if (!srch || !srch.classList.contains('open')) return;
        srch.classList.remove('open');
        document.body.style.overflow = '';
    },

    _performSearch(query) {
        clearTimeout(this._searchDebounceTimer);
        this._searchDebounceTimer = setTimeout(() => this._renderSearchResults(query), 200);
    },

    _renderSearchResults(q) {
        const el = document.getElementById('srch-results');
        if (!el) return;
        const query = q.trim().toLowerCase();

        if (!query) {
            el.innerHTML = `
                <div class="srch-section-title">Páginas</div>
                <div class="srch-list">${this._searchPages.map(p => this._srchPageItem(p)).join('')}</div>
                <div class="srch-section-title">Mi Cuenta</div>
                <div class="srch-list">${this._searchAccount.map(a => this._srchAccountItem(a)).join('')}</div>`;
            return;
        }

        const products = this._searchProducts.filter(p =>
            p.name.toLowerCase().includes(query) ||
            (p.category || '').toLowerCase().includes(query) ||
            (p.description || '').toLowerCase().includes(query)
        );
        const pages = this._searchPages.filter(p =>
            p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query)
        );
        const account = this._searchAccount.filter(a =>
            a.name.toLowerCase().includes(query) || a.desc.toLowerCase().includes(query)
        );

        if (!products.length && !pages.length && !account.length) {
            el.innerHTML = `<div class="srch-no-results">
                <i class="fas fa-search" style="font-size:32px;opacity:0.25;margin-bottom:14px;display:block"></i>
                <p>Sin resultados para "<strong>${q}</strong>"</p></div>`;
            return;
        }

        let html = '';

        if (products.length) {
            const shown = products.slice(0, 6);
            html += `<div class="srch-section-title">Productos</div>
                <div class="srch-product-grid">
                    ${shown.map(p => `
                        <div class="srch-product-card" onclick="window.location.href='${p.pageUrl}'">
                            <img src="${p.image}" alt="${p.name}" loading="lazy">
                            <div class="srch-product-card-info">
                                <p class="srch-product-cat">${p.category || ''}</p>
                                <p class="srch-product-name">${p.name}</p>
                                <p class="srch-product-price">$${p.price.toLocaleString('es-MX')}</p>
                            </div>
                        </div>`).join('')}
                </div>`;
            if (products.length > 6) {
                const urls = [...new Set(products.map(p => p.pageUrl))];
                html += urls.map(url => {
                    const count = products.filter(p => p.pageUrl === url).length;
                    const pgName = this._searchPages.find(pg => pg.url === url)?.name || url;
                    return `<div class="srch-see-more" onclick="window.location.href='${url}'">Ver los ${count} resultados en ${pgName} →</div>`;
                }).join('');
            }
        }

        if (pages.length) {
            html += `<div class="srch-section-title">Páginas</div>
                <div class="srch-list">${pages.map(p => this._srchPageItem(p)).join('')}</div>`;
        }

        if (account.length) {
            html += `<div class="srch-section-title">Mi Cuenta</div>
                <div class="srch-list">${account.map(a => this._srchAccountItem(a)).join('')}</div>`;
        }

        el.innerHTML = html;
    },

    _srchPageItem(p) {
        return `<div class="srch-list-item" onclick="window.location.href='${p.url}'">
            <i class="${p.icon}"></i>
            <div class="srch-list-item-info">
                <span class="srch-list-item-name">${p.name}</span>
                <span class="srch-list-item-desc">${p.desc}</span>
            </div>
        </div>`;
    },

    _srchAccountItem(a) {
        const onclick = a.action === 'wishlist'
            ? `cartSystem.openWishlist();cartSystem.closeSearch()`
            : a.action === 'cart'
                ? `cartSystem.openCart();cartSystem.closeSearch()`
                : `window.location.href='${a.url}'`;
        return `<div class="srch-list-item" onclick="${onclick}">
            <i class="${a.icon}"></i>
            <div class="srch-list-item-info">
                <span class="srch-list-item-name">${a.name}</span>
                <span class="srch-list-item-desc">${a.desc}</span>
            </div>
        </div>`;
    },

    // ── Navegación con memoria ───────────────────────────────
    _SHOPPING_PAGES: ['index.html','women.html','men.html','accessories.html','offers.html','lookbook.html','about.html'],

    _getPageFilename() {
        return window.location.pathname.split('/').pop() || 'index.html';
    },

    _getPageName(page) {
        const names = {
            'index.html': 'la Tienda', 'women.html': 'Mujer', 'men.html': 'Hombre',
            'accessories.html': 'Accesorios', 'offers.html': 'Ofertas',
            'lookbook.html': 'Lookbook', 'about.html': 'Nosotros'
        };
        return names[page] || 'la Tienda';
    },

    _saveNavHistory() {
        const page = this._getPageFilename();
        sessionStorage.setItem('ucNavHistory', JSON.stringify({
            lastPage: page,
            lastPageName: this._getPageName(page),
            lastScrollY: window.scrollY || 0
        }));
    },

    _getNavHistory() {
        try { return JSON.parse(sessionStorage.getItem('ucNavHistory')); } catch { return null; }
    },

    goBack() {
        const hist = this._getNavHistory();
        const target = hist ? hist.lastPage : 'index.html';
        if (hist && hist.lastScrollY > 0) {
            sessionStorage.setItem('ucRestoreScroll', JSON.stringify({ page: target, y: hist.lastScrollY }));
        }
        window.location.href = target;
    },

    _restoreScrollIfNeeded() {
        try {
            const data = JSON.parse(sessionStorage.getItem('ucRestoreScroll'));
            if (!data || !data.y) return;
            if (data.page === this._getPageFilename()) {
                sessionStorage.removeItem('ucRestoreScroll');
                setTimeout(() => window.scrollTo({ top: data.y, behavior: 'smooth' }), 350);
            }
        } catch {}
    },

    // ── Vista previa de producto ─────────────────────────────
    openProductPreview(id, context = '') {
        const p = this._getProductData(id);
        if (!p) { this._toast('Producto no disponible', 'error'); return; }

        const existing = document.getElementById('uc-product-preview');
        if (existing) existing.remove();

        this._ppContext = context;
        const inWishlist = this.getWishlist().some(i => i.id === id);
        const sizes = p.sizes || [];
        // Si viene del carrito, pre-seleccionar la talla actual del item
        const cartItem = context === 'cart' ? this.getCart().find(i => i.id === id) : null;
        const initialSize = (cartItem?.selectedSize) || sizes[0] || 'Único';
        const discountPct = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
        this._ppSelectedSize = initialSize;

        document.body.insertAdjacentHTML('beforeend', `
            <div id="uc-product-preview" class="ucpp-overlay" onclick="if(event.target===this)cartSystem._closeProductPreview()">
                <div class="ucpp-modal">
                    <button class="ucpp-close" onclick="cartSystem._closeProductPreview()" aria-label="Cerrar">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="ucpp-image">
                        <img src="${p.image}" alt="${p.name}">
                        ${p.isNew ? '<span class="ucpp-badge ucpp-badge--new">Nuevo</span>' : ''}
                        ${p.originalPrice ? `<span class="ucpp-badge ucpp-badge--sale">-${discountPct}%</span>` : ''}
                    </div>
                    <div class="ucpp-details">
                        <h2 class="ucpp-name">${p.name}</h2>
                        ${p.description ? `<p class="ucpp-desc">${p.description}</p>` : ''}
                        <div class="ucpp-price">
                            <span class="ucpp-price-current">$${p.price.toLocaleString('es-MX')}</span>
                            ${p.originalPrice ? `<span class="ucpp-price-original">$${p.originalPrice.toLocaleString('es-MX')}</span>` : ''}
                        </div>
                        ${sizes.length > 0 ? `
                        <div class="ucpp-sizes-section">
                            <p class="ucpp-sizes-label">Talla: <strong id="ucpp-size-label">${initialSize}</strong></p>
                            <div class="ucpp-sizes-grid">
                                ${sizes.map(s => `
                                    <button class="ucpp-size-btn${s === initialSize ? ' active' : ''}"
                                            data-size="${s}" onclick="cartSystem._ppSelectSize('${s}')">${s}</button>
                                `).join('')}
                            </div>
                            ${context === 'cart' ? `
                            <button class="ucpp-change-size-btn" onclick="cartSystem._ppChangeCartSize(${id})">
                                <i class="fas fa-exchange-alt"></i> Cambiar Talla en Carrito
                            </button>` : ''}
                        </div>` : ''}
                        <div class="ucpp-actions">
                            <button class="ucpp-add-btn${p.inStock === false ? ' disabled' : ''}"
                                    ${p.inStock === false ? 'disabled' : ''}
                                    onclick="cartSystem._ppAddToCart(${id})">
                                <i class="fas fa-shopping-bag"></i>
                                ${p.inStock === false ? 'Agotado' : 'Agregar al carrito'}
                            </button>
                            <button class="ucpp-wl-btn${inWishlist ? ' active' : ''}"
                                    id="ucpp-wl-btn"
                                    onclick="cartSystem._ppToggleWishlist(${id})"
                                    aria-label="${inWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `);

        document.head.insertAdjacentHTML('beforeend', `<style id="ucpp-styles">
            .ucpp-overlay {
                position: fixed; inset: 0; z-index: 99990;
                background: rgba(0,0,0,0.5); backdrop-filter: blur(6px);
                display: flex; align-items: center; justify-content: center;
                padding: 16px; animation: ucppFadeIn 0.2s ease;
            }
            @keyframes ucppFadeIn { from { opacity:0 } to { opacity:1 } }
            .ucpp-modal {
                background: #fff; border-radius: 20px; max-width: 680px; width: 100%;
                display: grid; grid-template-columns: 1fr 1fr;
                overflow: hidden; position: relative;
                box-shadow: 0 24px 80px rgba(0,0,0,0.25);
                animation: ucppSlideUp 0.25s ease;
                max-height: 90vh; overflow-y: auto;
            }
            @keyframes ucppSlideUp { from { transform:translateY(20px);opacity:0 } to { transform:translateY(0);opacity:1 } }
            .ucpp-close {
                position: absolute; top: 14px; right: 14px; z-index: 2;
                background: rgba(255,255,255,0.9); border: none; border-radius: 50%;
                width: 34px; height: 34px; cursor: pointer; font-size: 14px;
                display: flex; align-items: center; justify-content: center;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15); transition: background 0.2s;
            }
            .ucpp-close:hover { background: #f0f0f0; }
            .ucpp-image { position: relative; }
            .ucpp-image img { width: 100%; height: 100%; object-fit: cover; display: block; min-height: 300px; }
            .ucpp-badge {
                position: absolute; top: 12px; left: 12px;
                padding: 4px 10px; border-radius: 20px; font-size: 11px;
                font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
            }
            .ucpp-badge--new { background: #1a1a1a; color: #fff; }
            .ucpp-badge--sale { background: #e53935; color: #fff; top: 44px; }
            .ucpp-details { padding: 28px 24px; display: flex; flex-direction: column; gap: 14px; }
            .ucpp-name { font-size: 20px; font-weight: 700; color: #1a1a1a; margin: 0; }
            .ucpp-desc { font-size: 14px; color: #666; margin: 0; line-height: 1.6; }
            .ucpp-price { display: flex; align-items: baseline; gap: 10px; }
            .ucpp-price-current { font-size: 22px; font-weight: 700; color: #1a1a1a; }
            .ucpp-price-original { font-size: 15px; color: #bbb; text-decoration: line-through; }
            .ucpp-sizes-label { font-size: 13px; color: #555; margin: 0 0 8px; }
            .ucpp-sizes-grid { display: flex; flex-wrap: wrap; gap: 8px; }
            .ucpp-size-btn {
                padding: 7px 14px; border: 1.5px solid #e0e0e0; border-radius: 8px;
                background: #fff; cursor: pointer; font-size: 13px; font-weight: 500;
                color: #333; transition: all 0.15s; font-family: inherit;
            }
            .ucpp-size-btn:hover { border-color: #1a1a1a; }
            .ucpp-size-btn.active { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
            .ucpp-actions { display: flex; gap: 10px; margin-top: auto; }
            .ucpp-add-btn {
                flex: 1; padding: 13px; background: #1a1a1a; color: #fff;
                border: none; border-radius: 10px; cursor: pointer; font-size: 14px;
                font-weight: 600; display: flex; align-items: center; justify-content: center;
                gap: 8px; transition: background 0.2s; font-family: inherit;
            }
            .ucpp-add-btn:hover:not(.disabled) { background: #333; }
            .ucpp-add-btn.disabled { background: #ccc; cursor: not-allowed; }
            .ucpp-wl-btn {
                width: 46px; height: 46px; border: 1.5px solid #e0e0e0;
                border-radius: 10px; background: #fff; cursor: pointer;
                font-size: 18px; color: #ccc; display: flex; align-items: center;
                justify-content: center; transition: all 0.2s;
            }
            .ucpp-wl-btn:hover { border-color: #e53935; color: #e53935; }
            .ucpp-wl-btn.active { background: #fff0f0; border-color: #e53935; color: #e53935; }
            .ucpp-change-size-btn {
                width: 100%; margin-top: 10px; padding: 9px 14px;
                background: transparent; border: 1.5px solid #1a1a1a; border-radius: 8px;
                cursor: pointer; font-size: 13px; font-weight: 600; color: #1a1a1a;
                display: flex; align-items: center; justify-content: center;
                gap: 7px; transition: all 0.2s; font-family: inherit;
            }
            .ucpp-change-size-btn:hover { background: #1a1a1a; color: #fff; }
            @media (max-width: 560px) {
                .ucpp-modal { grid-template-columns: 1fr; }
                .ucpp-image img { min-height: 240px; max-height: 260px; }
            }
        </style>`);

        setTimeout(() => document.getElementById('uc-product-preview')?.classList.add('open'), 10);
    },

    _closeProductPreview() {
        const el = document.getElementById('uc-product-preview');
        if (el) el.remove();
        document.getElementById('ucpp-styles')?.remove();
    },

    _ppSelectSize(size) {
        this._ppSelectedSize = size;
        const label = document.getElementById('ucpp-size-label');
        if (label) label.textContent = size;
        document.querySelectorAll('.ucpp-size-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.size === size);
        });
    },

    _ppAddToCart(id) {
        const p = this._getProductData(id);
        if (!p || p.inStock === false) return;
        this.addToCart({
            id: p.id, name: p.name, price: p.price, image: p.image,
            selectedSize: this._ppSelectedSize || (p.sizes?.[0] || 'Único'),
            selectedColor: p.colors?.[0] || ''
        });
        this._toast(`${p.name} agregado al carrito`, 'success');
        this._closeProductPreview();
    },

    _ppToggleWishlist(id) {
        const wl = this.getWishlist();
        const idx = wl.findIndex(i => i.id === id);
        const btn = document.getElementById('ucpp-wl-btn');
        if (idx === -1) {
            const p = this._getProductData(id);
            if (!p) return;
            wl.push({ id: p.id, name: p.name, price: p.price, image: p.image,
                description: p.description || '', sizes: p.sizes || [], colors: p.colors || [],
                originalPrice: p.originalPrice || null, isNew: !!p.isNew, inStock: p.inStock !== false });
            this.saveWishlist(wl);
            if (btn) { btn.classList.add('active'); }
            this._toast(`${p.name} agregado a favoritos`, 'success');
        } else {
            wl.splice(idx, 1);
            this.saveWishlist(wl);
            if (btn) { btn.classList.remove('active'); }
            this._toast('Eliminado de favoritos', 'info');
        }
        this._updateWishlistBadge();
        this._renderWishlistSidebar();
        // Actualizar corazón en la card si está visible
        const cardBtn = document.querySelector(`[data-product-id="${id}"] .product-wishlist-btn`);
        if (cardBtn) cardBtn.classList.toggle('active', idx === -1);
    },

    _ppChangeCartSize(id) {
        const cart = this.getCart();
        const item = cart.find(i => i.id === id);
        if (!item) { this._toast('Producto no encontrado en el carrito', 'error'); return; }
        const newSize = this._ppSelectedSize;
        if (item.selectedSize === newSize) {
            this._toast('Ya tienes esa talla seleccionada', 'info');
            return;
        }
        item.selectedSize = newSize;
        this.saveCart(cart);
        this.refresh();
        this._closeProductPreview();
        this._toast(`Talla cambiada a ${newSize}`, 'success');
    },

    _updateContinueShoppingBtn() {
        const textEl = document.getElementById('cart-continue-text');
        if (!textEl) return;
        const page = this._getPageFilename();
        const hist = this._getNavHistory();
        if (this._SHOPPING_PAGES.includes(page)) {
            textEl.textContent = 'Seguir Comprando';
        } else {
            textEl.textContent = hist && hist.lastPageName ? 'Volver a ' + hist.lastPageName : 'Ir a la Tienda';
        }
    },

    _handleContinueShopping() {
        const page = this._getPageFilename();
        this.closeCart();
        if (!this._SHOPPING_PAGES.includes(page)) setTimeout(() => this.goBack(), 300);
    },

    // ── Cupones ─────────────────────────────────────────────
    applyCoupon(code) {
        if (!code) return;
        const key = code.trim().toUpperCase();
        const data = CART_COUPONS[key];
        if (data) {
            localStorage.setItem(this.COUPON_KEY, JSON.stringify({ code: key, ...data }));
            this.refresh();
            this._toast('¡Cupón ' + key + ' aplicado! ' + data.label, 'success');
        } else {
            this._toast('Cupón no válido. Prueba: UC10, UC25OFF, URBAN50 o FIRST100', 'error');
        }
    },

    removeCoupon() {
        localStorage.removeItem(this.COUPON_KEY);
        this.refresh();
        this._toast('Cupón eliminado', 'info');
    },

    // ── Cálculos ────────────────────────────────────────────
    getSubtotal() {
        return this.getCart().reduce((s, i) => s + i.price * i.quantity, 0);
    },

    getDiscountAmount(subtotal) {
        const c = this.getCoupon();
        if (!c) return 0;
        return c.type === 'percentage'
            ? Math.round(subtotal * c.discount / 100)
            : Math.min(c.discount, subtotal);
    },

    // ── Control del sidebar ─────────────────────────────────
    toggleCart() {
        const sidebar = document.getElementById('cart-sidebar');
        if (!sidebar) return;
        if (sidebar.classList.contains('open')) {
            this.closeCart();
        } else {
            this.openCart();
        }
    },

    openCart() {
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('overlay');
        if (sidebar) sidebar.classList.add('open');
        if (overlay) { overlay.classList.add('active'); overlay.classList.add('show'); }
        document.body.style.overflow = 'hidden';
        this._updateContinueShoppingBtn();
        this.refresh();
    },

    closeCart() {
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('overlay');
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) { overlay.classList.remove('active'); overlay.classList.remove('show'); }
        document.body.style.overflow = '';
    },

    goToCheckout() {
        if (this.getCart().length === 0) {
            this._toast('Tu carrito está vacío', 'error');
            return;
        }
        if (!this.isLoggedIn()) {
            this._showLoginPrompt();
            return;
        }
        this.closeCart();
        setTimeout(() => { window.location.href = 'checkout.html'; }, 300);
    },

    _showLoginPrompt() {
        if (document.getElementById('uc-login-prompt')) return;
        document.body.insertAdjacentHTML('beforeend', `
            <div id="uc-login-prompt" style="
                position:fixed;inset:0;z-index:99999;
                display:flex;align-items:center;justify-content:center;
                background:rgba(0,0,0,0.45);backdrop-filter:blur(4px);
            ">
                <div style="
                    background:#fff;border-radius:16px;padding:36px 32px;
                    max-width:360px;width:90%;text-align:center;
                    box-shadow:0 20px 60px rgba(0,0,0,0.2);
                ">
                    <div style="font-size:44px;margin-bottom:12px;">🛍️</div>
                    <h3 style="margin:0 0 10px;font-size:20px;color:#1a1a1a;">¡Casi listo!</h3>
                    <p style="margin:0 0 24px;color:#666;font-size:15px;line-height:1.5;">
                        Para finalizar tu compra necesitas iniciar sesión o crear una cuenta. Tu carrito se guardará.
                    </p>
                    <a href="login.html" style="
                        display:block;background:#1a1a1a;color:#fff;
                        padding:13px;border-radius:8px;text-decoration:none;
                        font-size:15px;font-weight:600;margin-bottom:10px;
                        transition:background 0.2s;
                    ">Iniciar Sesión</a>
                    <a href="registrar.html" style="
                        display:block;background:#f5f5f5;color:#1a1a1a;
                        padding:13px;border-radius:8px;text-decoration:none;
                        font-size:15px;font-weight:500;margin-bottom:16px;
                    ">Crear Cuenta</a>
                    <button onclick="document.getElementById('uc-login-prompt').remove()" style="
                        background:none;border:none;color:#aaa;cursor:pointer;
                        font-size:14px;text-decoration:underline;
                    ">Seguir explorando</button>
                </div>
            </div>
        `);
        document.getElementById('uc-login-prompt').addEventListener('click', e => {
            if (e.target === document.getElementById('uc-login-prompt'))
                document.getElementById('uc-login-prompt').remove();
        });
    },

    // ── Actualización de UI ─────────────────────────────────
    refresh() {
        this._updateBadge();
        this._renderSidebar();
        this._updateWishlistBadge();
    },

    _updateBadge() {
        const total = this.getCart().reduce((s, i) => s + i.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = total;
            el.style.display = total > 0 ? 'flex' : 'none';
        });
    },

    _renderSidebar() {
        const itemsEl = document.getElementById('cart-items');
        if (!itemsEl) return;

        const cart    = this.getCart();
        const coupon  = this.getCoupon();
        const sub     = this.getSubtotal();
        const disc    = this.getDiscountAmount(sub);
        const total   = sub - disc;

        // ── Items ──
        itemsEl.innerHTML = cart.length === 0
            ? `<div class="empty-cart">
                   <div class="empty-cart-icon"><i class="fas fa-shopping-bag"></i></div>
                   <h4>Tu carrito está vacío</h4>
                   <p>Agrega productos increíbles a tu carrito</p>
               </div>`
            : cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image" style="cursor:pointer"
                         onclick="cartSystem.openProductPreview(${item.id},'cart')">
                    <div class="cart-item-info">
                        <h4 style="cursor:pointer" onclick="cartSystem.openProductPreview(${item.id},'cart')">${item.name}</h4>
                        <div class="cart-item-details">
                            ${(item.selectedSize || item.size) ? '<span>Talla: ' + (item.selectedSize || item.size) + '</span>' : ''}
                            ${(item.selectedColor || item.color) ? '<span>Color: ' + (item.selectedColor || item.color) + '</span>' : ''}
                        </div>
                        <div class="cart-item-price">$${item.price.toLocaleString('es-MX')}</div>
                        <div class="quantity-controls">
                            <button class="qty-btn" onclick="cartSystem.updateQuantity(${item.id},-1)" aria-label="Reducir">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="qty-btn" onclick="cartSystem.updateQuantity(${item.id},1)" aria-label="Aumentar">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <button class="remove-item" onclick="cartSystem.removeFromCart(${item.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>`).join('');

        // ── Totales ──
        const el = id => document.getElementById(id);
        if (el('cart-subtotal'))       el('cart-subtotal').textContent       = sub.toLocaleString('es-MX');
        if (el('cart-total'))          el('cart-total').textContent          = total.toLocaleString('es-MX');
        if (el('cart-discount-row'))   el('cart-discount-row').style.display = disc > 0 ? 'flex' : 'none';
        if (el('cart-discount-amount')) el('cart-discount-amount').textContent = disc.toLocaleString('es-MX');

        // ── Cupón UI ──
        if (el('cart-coupon-form'))    el('cart-coupon-form').style.display    = coupon ? 'none' : 'flex';
        if (el('cart-coupon-applied')) el('cart-coupon-applied').style.display = coupon ? 'flex' : 'none';
        if (el('cart-coupon-badge'))   el('cart-coupon-badge').textContent     = coupon ? coupon.code : '';
    },

    // ── Modal de autenticación ───────────────────────────────
    _showAuthModal() {
        if (document.getElementById('auth-required-modal')) return;
        const modal = document.createElement('div');
        modal.id = 'auth-required-modal';
        modal.className = 'auth-modal-overlay';
        modal.innerHTML = `
            <div class="auth-modal">
                <button class="auth-modal-close" id="auth-modal-close-btn">
                    <i class="fas fa-times"></i>
                </button>
                <div class="auth-modal-icon">
                    <i class="fas fa-lock"></i>
                </div>
                <h3>Inicia sesión para continuar</h3>
                <p>Debes iniciar sesión o registrarte para agregar productos al carrito y disfrutar todos los beneficios.</p>
                <div class="auth-modal-buttons">
                    <a href="login.html" class="auth-modal-btn auth-modal-btn--primary">
                        <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
                    </a>
                    <a href="registrar.html" class="auth-modal-btn auth-modal-btn--secondary">
                        <i class="fas fa-user-plus"></i> Registrarse
                    </a>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);
        const close = () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        };
        document.getElementById('auth-modal-close-btn').addEventListener('click', close);
        modal.addEventListener('click', e => { if (e.target === modal) close(); });
    },

    // ── Toast ────────────────────────────────────────────────
    _toast(message, type) {
        let c = document.getElementById('toast-container');
        if (!c) {
            c = document.createElement('div');
            c.id = 'toast-container';
            c.style.cssText = 'position:fixed;top:80px;right:20px;z-index:10000;display:flex;flex-direction:column;gap:8px;';
            document.body.appendChild(c);
        }
        const icons = { success: 'check-circle', error: 'exclamation-circle', info: 'info-circle' };
        const t = document.createElement('div');
        t.className = 'toast toast-' + (type || 'info');
        t.innerHTML = '<div class="toast-content"><i class="fas fa-' + (icons[type] || 'info-circle') + '"></i><span>' + message + '</span></div>';
        c.appendChild(t);
        setTimeout(() => t.classList.add('show'), 10);
        setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3500);
    },

    // ── Inicialización (se ejecuta UNA sola vez) ─────────────
    init() {
        if (window._cartSystemInit) return;
        window._cartSystemInit = true;

        document.addEventListener('DOMContentLoaded', () => {
            // Abrir carrito
            document.querySelectorAll('.cart-link').forEach(link => {
                link.addEventListener('click', e => { e.preventDefault(); this.toggleCart(); });
            });

            // Cerrar carrito
            const closeBtn = document.querySelector('.close-cart');
            if (closeBtn) closeBtn.addEventListener('click', () => this.closeCart());

            // Overlay cierra el carrito y wishlist
            const overlay = document.getElementById('overlay');
            if (overlay) overlay.addEventListener('click', () => { this.closeCart(); this.closeWishlist(); });

            // Botón finalizar compra
            const checkoutBtn = document.querySelector('.checkout-btn');
            if (checkoutBtn) checkoutBtn.addEventListener('click', () => this.goToCheckout());

            // Aplicar cupón
            const applyBtn = document.getElementById('cart-coupon-apply');
            if (applyBtn) {
                applyBtn.addEventListener('click', () => {
                    const inp = document.getElementById('cart-coupon-input');
                    if (inp) this.applyCoupon(inp.value);
                });
            }

            // Enter en input de cupón
            const couponInput = document.getElementById('cart-coupon-input');
            if (couponInput) {
                couponInput.addEventListener('keypress', e => {
                    if (e.key === 'Enter') { e.preventDefault(); this.applyCoupon(e.target.value); }
                });
            }

            // Quitar cupón
            const removeBtn = document.getElementById('cart-coupon-remove');
            if (removeBtn) removeBtn.addEventListener('click', () => this.removeCoupon());

            // ── Wishlist sidebar ──────────────────────────────
            if (!document.getElementById('wishlist-sidebar')) {
                document.body.insertAdjacentHTML('beforeend', `
                    <div id="wishlist-sidebar" class="wishlist-sidebar">
                        <div class="wishlist-header">
                            <h3><i class="fas fa-heart"></i> Mis Favoritos</h3>
                            <button class="close-wishlist" aria-label="Cerrar favoritos">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="wishlist-items" id="wishlist-items"></div>
                    </div>
                `);
            }
            document.head.insertAdjacentHTML('beforeend', `<style>
                .wishlist-sidebar {
                    position: fixed; top: 0; right: -420px; width: 420px;
                    height: 100vh; background: #fff;
                    box-shadow: -20px 0 60px rgba(0,0,0,0.15);
                    z-index: 2001; display: flex; flex-direction: column;
                    transition: right 0.35s cubic-bezier(0.4,0,0.2,1);
                    overflow: hidden;
                }
                .wishlist-sidebar.open { right: 0; }
                .wishlist-header {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 20px 25px; border-bottom: 1px solid #f0f0f0; flex-shrink: 0;
                }
                .wishlist-header h3 {
                    font-size: 18px; font-weight: 600; display: flex;
                    align-items: center; gap: 10px; color: #1a1a1a; margin: 0;
                }
                .wishlist-header h3 i { color: #e74c3c; }
                .close-wishlist {
                    background: none; border: none; font-size: 20px; cursor: pointer;
                    color: #666; width: 36px; height: 36px; display: flex;
                    align-items: center; justify-content: center;
                    border-radius: 50%; transition: background 0.2s;
                }
                .close-wishlist:hover { background: #f5f5f5; color: #1a1a1a; }
                .wishlist-items {
                    flex: 1; overflow-y: auto; padding: 16px;
                    display: flex; flex-direction: column; gap: 12px;
                }
                .wl-item {
                    display: flex; gap: 14px; align-items: flex-start;
                    padding: 14px; border: 1px solid #f0f0f0; border-radius: 12px;
                    transition: box-shadow 0.2s;
                }
                .wl-item:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
                .wl-img {
                    width: 80px; height: 80px; object-fit: cover;
                    border-radius: 8px; flex-shrink: 0;
                }
                .wl-info { flex: 1; min-width: 0; }
                .wl-name {
                    font-size: 14px; font-weight: 500; color: #1a1a1a;
                    margin: 0 0 5px; white-space: nowrap;
                    overflow: hidden; text-overflow: ellipsis;
                }
                .wl-price {
                    font-size: 15px; font-weight: 600; color: #1a1a1a; margin: 0 0 10px;
                }
                .wl-actions { display: flex; gap: 8px; align-items: center; }
                .wl-add-btn {
                    flex: 1; background: #1a1a1a; color: #fff; border: none;
                    padding: 8px 12px; border-radius: 20px; font-size: 12px;
                    font-weight: 500; cursor: pointer; display: flex;
                    align-items: center; justify-content: center;
                    gap: 6px; transition: background 0.2s;
                }
                .wl-add-btn:hover { background: #333; }
                .wl-remove-btn {
                    background: none; border: 1px solid #f0f0f0; color: #999;
                    width: 32px; height: 32px; border-radius: 50%; cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 13px; transition: all 0.2s; flex-shrink: 0;
                }
                .wl-remove-btn:hover { background: #fff0f0; border-color: #e74c3c; color: #e74c3c; }
                .wl-empty {
                    text-align: center; padding: 60px 20px; color: #999;
                }
                .wl-empty i { font-size: 48px; color: #e0e0e0; margin-bottom: 16px; display: block; }
                .wl-empty h4 { font-size: 16px; color: #666; margin: 0 0 8px; }
                .wl-empty p { font-size: 14px; margin: 0; }
                @media (max-width: 480px) {
                    .wishlist-sidebar { width: 100vw; right: -100vw; }
                    .wishlist-sidebar.open { right: 0; }
                }
            </style>`);

            // Abrir wishlist al click del corazón
            document.querySelectorAll('a[href="#wishlist"]').forEach(link => {
                link.addEventListener('click', e => { e.preventDefault(); this.openWishlist(); });
            });
            const closeWl = document.querySelector('.close-wishlist');
            if (closeWl) closeWl.addEventListener('click', () => this.closeWishlist());

            // ── Search overlay ────────────────────────────────
            if (!document.getElementById('search-overlay')) {
                document.body.insertAdjacentHTML('beforeend', `
                    <div id="search-overlay">
                        <div class="srch-modal">
                            <div class="srch-input-row">
                                <i class="fas fa-search srch-icon"></i>
                                <input id="srch-input" type="text" placeholder="Buscar productos, páginas..." autocomplete="off">
                                <button id="srch-close" aria-label="Cerrar búsqueda"><i class="fas fa-times"></i></button>
                            </div>
                            <div id="srch-results"></div>
                        </div>
                    </div>
                `);
            }
            document.head.insertAdjacentHTML('beforeend', `<style>
                #search-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(200,200,210,0.25);
                    backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px);
                    z-index: 9999;
                    display: flex; align-items: flex-start; justify-content: center;
                    opacity: 0; pointer-events: none;
                    transition: opacity 0.3s ease;
                    padding: 0 16px;
                }
                #search-overlay.open { opacity: 1; pointer-events: all; }
                .srch-modal { width: 100%; max-width: 680px; margin-top: 14vh; }
                .srch-input-row {
                    display: flex; align-items: center;
                    background: rgba(255,255,255,0.75);
                    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255,255,255,0.9);
                    border-radius: 16px; padding: 14px 20px; gap: 14px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8);
                }
                .srch-icon { font-size: 18px; color: #aaa; flex-shrink: 0; }
                #srch-input {
                    flex: 1; border: none; outline: none; font-size: 17px;
                    background: transparent; color: #1a1a1a;
                    font-family: inherit; min-width: 0;
                }
                #srch-input::placeholder { color: #bbb; }
                #srch-close {
                    background: none; border: none; font-size: 18px;
                    cursor: pointer; color: #aaa; padding: 4px; line-height: 1;
                    transition: color 0.2s; flex-shrink: 0;
                }
                #srch-close:hover { color: #333; }
                #srch-results {
                    max-height: 65vh; overflow-y: auto; margin-top: 12px;
                    border-radius: 16px;
                    background: rgba(255,255,255,0.55);
                    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255,255,255,0.7);
                    box-shadow: 0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9);
                    padding-bottom: 8px;
                }
                #srch-results::-webkit-scrollbar { width: 4px; }
                #srch-results::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 2px; }
                .srch-section-title {
                    color: #888; font-size: 11px; text-transform: uppercase;
                    letter-spacing: 1.5px; padding: 16px 20px 8px; font-weight: 600;
                }
                .srch-product-grid {
                    display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                    gap: 10px; padding: 0 16px 8px;
                }
                .srch-product-card {
                    background: rgba(255,255,255,0.6);
                    border: 1px solid rgba(255,255,255,0.8);
                    border-radius: 12px; cursor: pointer; overflow: hidden;
                    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                }
                .srch-product-card:hover {
                    background: rgba(255,255,255,0.85); transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.1);
                }
                .srch-product-card img { width: 100%; aspect-ratio: 1/1; object-fit: cover; display: block; }
                .srch-product-card-info { padding: 10px 12px; }
                .srch-product-cat {
                    font-size: 10px; color: #999; text-transform: uppercase;
                    letter-spacing: 0.5px; margin: 0 0 3px;
                }
                .srch-product-name {
                    font-size: 13px; color: #1a1a1a; font-weight: 500; margin: 0 0 5px;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                }
                .srch-product-price { font-size: 14px; color: #1a1a1a; font-weight: 700; margin: 0; }
                .srch-list { padding: 0 12px 4px; }
                .srch-list-item {
                    display: flex; align-items: center; gap: 14px;
                    padding: 11px 14px; border-radius: 10px; cursor: pointer;
                    transition: background 0.2s;
                }
                .srch-list-item:hover { background: rgba(0,0,0,0.05); }
                .srch-list-item > i { width: 22px; text-align: center; font-size: 15px; color: #999; flex-shrink: 0; }
                .srch-list-item-info { display: flex; flex-direction: column; gap: 1px; }
                .srch-list-item-name { font-size: 14px; font-weight: 500; color: #1a1a1a; }
                .srch-list-item-desc { font-size: 12px; color: #888; }
                .srch-no-results { text-align: center; padding: 48px 20px; color: #888; }
                .srch-no-results p { font-size: 15px; margin: 0; }
                .srch-no-results strong { color: #555; }
                .srch-see-more {
                    text-align: center; padding: 10px; color: #999;
                    font-size: 13px; cursor: pointer; transition: color 0.2s;
                }
                .srch-see-more:hover { color: #1a1a1a; }
                @media (max-width: 600px) {
                    .srch-modal { margin-top: 10vh; }
                    .srch-product-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); }
                }
            </style>`);

            // Bind search buttons
            document.querySelectorAll('.search-btn').forEach(btn => {
                btn.addEventListener('click', () => this.openSearch());
            });

            // Close button
            const srchClose = document.getElementById('srch-close');
            if (srchClose) srchClose.addEventListener('click', () => this.closeSearch());

            // Click outside modal
            const srchOverlay = document.getElementById('search-overlay');
            if (srchOverlay) {
                srchOverlay.addEventListener('click', e => {
                    if (e.target === srchOverlay) this.closeSearch();
                });
            }

            // Live input
            const srchInput = document.getElementById('srch-input');
            if (srchInput) srchInput.addEventListener('input', e => this._performSearch(e.target.value));

            // Escape key
            document.addEventListener('keydown', e => { if (e.key === 'Escape') this.closeSearch(); });

            // ── Botón "Seguir Comprando" en cart footer ───────
            const cartFooter = document.querySelector('.cart-footer');
            if (cartFooter && !document.getElementById('cart-continue-btn')) {
                const contBtn = document.createElement('button');
                contBtn.id = 'cart-continue-btn';
                contBtn.className = 'continue-shopping-btn';
                contBtn.innerHTML = '<i class="fas fa-arrow-left"></i> <span id="cart-continue-text">Seguir Comprando</span>';
                contBtn.addEventListener('click', () => this._handleContinueShopping());
                if (checkoutBtn) cartFooter.insertBefore(contBtn, checkoutBtn);
                else cartFooter.appendChild(contBtn);
                document.head.insertAdjacentHTML('beforeend', `<style>
                    .continue-shopping-btn {
                        width: 100%; padding: 12px; margin-bottom: 10px;
                        background: transparent; border: 1px solid #e0e0e0;
                        border-radius: 8px; cursor: pointer; font-size: 14px; color: #666;
                        display: flex; align-items: center; justify-content: center;
                        gap: 8px; transition: all 0.2s; font-family: inherit;
                    }
                    .continue-shopping-btn:hover { background: #f5f5f5; color: #1a1a1a; border-color: #ccc; }
                </style>`);
            }

            // ── Historial de navegación ───────────────────────
            this._restoreScrollIfNeeded();
            const _navPage = this._getPageFilename();
            if (this._SHOPPING_PAGES.includes(_navPage)) {
                this._saveNavHistory();
                let _scrollTimer = null;
                window.addEventListener('scroll', () => {
                    if (_scrollTimer) return;
                    _scrollTimer = setTimeout(() => { _scrollTimer = null; this._saveNavHistory(); }, 500);
                }, { passive: true });
            }

            // ── Dropdown de usuario ───────────────────────────
            const _acctBtn = document.querySelector('.nav-utilities a[href="#account"]');
            const _userDD  = document.getElementById('userDropdown');
            if (_acctBtn && _userDD) {
                const _userNameEl = document.getElementById('userNameNav');
                if (_userNameEl && this.isLoggedIn()) {
                    _userNameEl.textContent = localStorage.getItem('userName') || 'Usuario';
                }
                _acctBtn.addEventListener('click', e => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (this.isLoggedIn()) {
                        _userDD.classList.toggle('active');
                    } else {
                        window.location.href = 'login.html';
                    }
                });
                document.addEventListener('click', e => {
                    if (!_userDD.contains(e.target) && e.target !== _acctBtn) {
                        _userDD.classList.remove('active');
                    }
                });
                _userDD.addEventListener('click', e => e.stopPropagation());
            }

            // Render inicial
            this.refresh();
        });
    }
};

// Arrancar sistema
cartSystem.init();

// Limpiar entradas antiguas del wishlist (IDs sueltos sin objeto completo)
(function cleanLegacyWishlist() {
    const raw = JSON.parse(localStorage.getItem('urbanCatsWishlist')) || [];
    const clean = raw.filter(item => item && typeof item === 'object' && item.id);
    if (clean.length !== raw.length) {
        localStorage.setItem('urbanCatsWishlist', JSON.stringify(clean));
    }
})();
