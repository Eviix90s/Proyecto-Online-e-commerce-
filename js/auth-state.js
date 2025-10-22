import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';


const userDropdown = document.getElementById('userDropdown');
const userNameNav = document.getElementById('userNameNav');
const logoutBtn = document.getElementById('logoutBtn');

let isLoggedIn = false;

// Escuchar cambios en autenticación
onAuthStateChanged(auth, (user) => {
    if (user) {
        isLoggedIn = true;
        const userName = user.displayName || user.email.split('@')[0];
        if (userNameNav) userNameNav.textContent = userName;
        console.log('Usuario logueado:', user.email);
    } else {
        isLoggedIn = false;
    }
});

// Click en ícono de usuario (desktop)
const userIconDesktop = document.querySelector('.nav-utilities a[href="#account"]');
if (userIconDesktop) {
    userIconDesktop.addEventListener('click', (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            window.location.href = 'login.html';
        } else {
            userDropdown.classList.toggle('active');
        }
    });
}

// Click en ícono de usuario (mobile)
const userIconMobile = document.querySelector('.mobile-utilities a[href="#account"]');
if (userIconMobile) {
    userIconMobile.addEventListener('click', (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            window.location.href = 'login.html';
        } else {
            alert('Cuenta: ' + (auth.currentUser?.email || 'Usuario'));
        }
    });
}

// Cerrar dropdown al hacer click fuera
document.addEventListener('click', (e) => {
    if (userDropdown && !userDropdown.contains(e.target) && !userIconDesktop?.contains(e.target)) {
        userDropdown.classList.remove('active');
    }
});

// Logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            await signOut(auth);
            localStorage.clear();
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
        }
    });
}