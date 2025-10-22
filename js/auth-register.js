// Importar Firebase
import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, updateProfile } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Referencias al DOM
const registerForm = document.getElementById('registerForm');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

// Función para mostrar errores
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

// Función para mostrar éxito
function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
}

// Manejar el submit del formulario
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validaciones
    if (password !== confirmPassword) {
        showError('Las contraseñas no coinciden');
        return;
    }

    if (password.length < 6) {
        showError('La contraseña debe tener al menos 6 caracteres');
        return;
    }

    try {
        // Crear usuario en Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Actualizar perfil con nombre
        await updateProfile(user, {
            displayName: name
        });

        // Guardar datos adicionales en Firestore
        await setDoc(doc(db, 'users', user.uid), {
            name: name,
            email: email,
            createdAt: new Date().toISOString(),
            role: 'customer'
        });

        console.log('Usuario registrado:', user);

        // Mostrar mensaje de éxito
        showSuccess('¡Cuenta creada exitosamente! Redirigiendo...');

        // Guardar info en localStorage
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userId', user.uid);
        localStorage.setItem('userName', name);

        // Redirigir al index después de 2 segundos
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);

    } catch (error) {
        console.error('Error al registrar usuario:', error);

        // Mensajes de error en español
        let errorMsg = 'Error al crear la cuenta';

        switch(error.code) {
            case 'auth/email-already-in-use':
                errorMsg = 'Este correo ya está registrado';
                break;
            case 'auth/invalid-email':
                errorMsg = 'Correo electrónico inválido';
                break;
            case 'auth/operation-not-allowed':
                errorMsg = 'Operación no permitida';
                break;
            case 'auth/weak-password':
                errorMsg = 'La contraseña es muy débil';
                break;
        }

        showError(errorMsg);
    }
});