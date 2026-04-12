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

// Logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            await signOut(auth);
            ['userId', 'userEmail', 'userName'].forEach(k => localStorage.removeItem(k));
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
        }
    });
}