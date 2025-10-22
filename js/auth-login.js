// Importar Firebase - TODOS LOS IMPORTS AL INICIO
import { auth } from './firebase-config.js';
import { 
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Referencias al DOM
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

// Función para mostrar errores
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

// Manejar el submit del formulario (Email/Password)
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Iniciar sesión con Firebase
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        console.log('Usuario logueado:', user);
        
        // Guardar info del usuario en localStorage
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userId', user.uid);
        localStorage.setItem('userName', user.displayName || user.email.split('@')[0]);
        
        // Redirigir al index
        window.location.href = 'index.html';
        
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        
        // Mensajes de error en español
        let errorMsg = 'Error al iniciar sesión';
        
        switch(error.code) {
            case 'auth/invalid-email':
                errorMsg = 'Correo electrónico inválido';
                break;
            case 'auth/user-disabled':
                errorMsg = 'Esta cuenta ha sido deshabilitada';
                break;
            case 'auth/user-not-found':
                errorMsg = 'No existe una cuenta con este correo';
                break;
            case 'auth/wrong-password':
                errorMsg = 'Contraseña incorrecta';
                break;
            case 'auth/invalid-credential':
                errorMsg = 'Credenciales inválidas. Verifica tu correo y contraseña';
                break;
            case 'auth/too-many-requests':
                errorMsg = 'Demasiados intentos fallidos. Intenta más tarde';
                break;
        }
        
        showError(errorMsg);
    }
});

// ==================== SOCIAL LOGIN ====================

// Google Login
const googleLoginBtn = document.getElementById('googleLoginBtn');
if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', async () => {
        const provider = new GoogleAuthProvider();
        
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            console.log('Usuario logueado con Google:', user);
            
            // Guardar info
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userId', user.uid);
            localStorage.setItem('userName', user.displayName);
            
            // Redirigir
            window.location.href = 'index.html';
            
        } catch (error) {
            console.error('Error con Google login:', error);
            
            let errorMsg = 'Error al iniciar sesión con Google';
            
            if (error.code === 'auth/popup-closed-by-user') {
                errorMsg = 'Inicio de sesión cancelado';
            } else if (error.code === 'auth/popup-blocked') {
                errorMsg = 'El navegador bloqueó la ventana emergente';
            }
            
            showError(errorMsg);
        }
    });
}

// Facebook Login
const facebookLoginBtn = document.getElementById('facebookLoginBtn');
if (facebookLoginBtn) {
    facebookLoginBtn.addEventListener('click', async () => {
        const provider = new FacebookAuthProvider();
        
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            console.log('Usuario logueado con Facebook:', user);
            
            // Guardar info
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userId', user.uid);
            localStorage.setItem('userName', user.displayName);
            
            // Redirigir
            window.location.href = 'index.html';
            
        } catch (error) {
            console.error('Error con Facebook login:', error);
            
            let errorMsg = 'Error al iniciar sesión con Facebook';
            
            if (error.code === 'auth/popup-closed-by-user') {
                errorMsg = 'Inicio de sesión cancelado';
            } else if (error.code === 'auth/account-exists-with-different-credential') {
                errorMsg = 'Ya existe una cuenta con este correo usando otro método';
            }
            
            showError(errorMsg);
        }
    });
}