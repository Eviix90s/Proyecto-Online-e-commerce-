// ============================================
// CHATBOT URBAN CATS - JAVASCRIPT INTEGRADO
// Usa la misma estructura que main.js
// ============================================

'use strict';

// Configuración del Chatbot
const CHATBOT_CONFIG = {
    // ⚠️ IMPORTANTE: Cambia esta URL por la de tu Cloud Function
    dialogflowEndpoint: 'https://us-central1-urban-cats.cloudfunctions.net/dialogflowWebhook',
    sessionId: 'urbancat-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
    animationDelay: 100,
    typingDelay: 800,
    errorMessage: 'Lo siento, ocurrió un error. Por favor intenta de nuevo.',
    offlineMessage: 'Parece que estás sin conexión. Verifica tu internet.',
    welcomeDelay: 3000
};

// Estado del Chatbot
const ChatbotState = {
    isOpen: false,
    isTyping: false,
    messageHistory: []
};

// Elementos del DOM
const ChatbotElements = {
    button: null,
    window: null,
    closeButton: null,
    sendButton: null,
    input: null,
    messagesContainer: null,
    typingIndicator: null,
    quickReplies: null,
    badge: null
};

// ============================================
// INICIALIZACIÓN
// ============================================

/**
 * Inicializa el chatbot cuando el DOM está listo
 */
function initChatbot() {
    // Obtener referencias a los elementos
    ChatbotElements.button = document.getElementById('chat-button');
    ChatbotElements.window = document.getElementById('chat-window');
    ChatbotElements.closeButton = document.getElementById('chat-close-button');
    ChatbotElements.sendButton = document.getElementById('chat-send-button');
    ChatbotElements.input = document.getElementById('chat-input');
    ChatbotElements.messagesContainer = document.getElementById('chat-messages');
    ChatbotElements.typingIndicator = document.getElementById('chat-typing-indicator');
    ChatbotElements.badge = document.querySelector('.chat-notification-badge');
    ChatbotElements.quickReplies = document.querySelectorAll('.chat-quick-reply');

    // Verificar que los elementos existan
    if (!ChatbotElements.button || !ChatbotElements.window) {
        console.error('❌ Elementos del chatbot no encontrados');
        return;
    }

    // Configurar event listeners
    setupEventListeners();

    // Mostrar badge después de un tiempo
    setTimeout(() => {
        if (ChatbotElements.badge && !ChatbotState.isOpen) {
            ChatbotElements.badge.style.display = 'flex';
        }
    }, CHATBOT_CONFIG.welcomeDelay);

    console.log('✅ Chatbot Urban Cats inicializado');
    console.log('📝 Session ID:', CHATBOT_CONFIG.sessionId);
}

// ============================================
// EVENT LISTENERS
// ============================================

/**
 * Configura todos los event listeners del chatbot
 */
function setupEventListeners() {
    // Abrir chat
    ChatbotElements.button.addEventListener('click', openChat);

    // Cerrar chat
    ChatbotElements.closeButton.addEventListener('click', closeChat);

    // Enviar mensaje
    ChatbotElements.sendButton.addEventListener('click', sendMessage);

    // Enviar con Enter
    ChatbotElements.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Respuestas rápidas
    ChatbotElements.quickReplies.forEach(button => {
        button.addEventListener('click', () => {
            const message = button.getAttribute('data-message');
            if (message) {
                ChatbotElements.input.value = message;
                sendMessage();
            }
        });
    });

    // Auto-resize del input
    ChatbotElements.input.addEventListener('input', autoResizeInput);

    // Detección de online/offline
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
}

// ============================================
// FUNCIONES DE UI
// ============================================

/**
 * Abre la ventana del chat
 */
function openChat() {
    ChatbotElements.window.classList.add('open');
    ChatbotElements.button.classList.add('hidden');
    ChatbotState.isOpen = true;

    // Ocultar badge
    if (ChatbotElements.badge) {
        ChatbotElements.badge.style.display = 'none';
    }

    // Focus en el input
    setTimeout(() => {
        ChatbotElements.input.focus();
    }, 400);

    // Scroll al final
    scrollToBottom();
}

/**
 * Cierra la ventana del chat
 */
function closeChat() {
    ChatbotElements.window.classList.remove('open');
    ChatbotElements.button.classList.remove('hidden');
    ChatbotState.isOpen = false;
}

/**
 * Hace scroll hasta el final del chat
 */
function scrollToBottom() {
    setTimeout(() => {
        if (ChatbotElements.messagesContainer) {
            ChatbotElements.messagesContainer.scrollTop = 
                ChatbotElements.messagesContainer.scrollHeight;
        }
    }, CHATBOT_CONFIG.animationDelay);
}

/**
 * Obtiene la hora actual formateada
 */
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

/**
 * Muestra el indicador de escritura
 */
function showTyping() {
    if (ChatbotElements.typingIndicator) {
        ChatbotElements.typingIndicator.classList.add('active');
        ChatbotState.isTyping = true;
        scrollToBottom();
    }
}

/**
 * Oculta el indicador de escritura
 */
function hideTyping() {
    if (ChatbotElements.typingIndicator) {
        ChatbotElements.typingIndicator.classList.remove('active');
        ChatbotState.isTyping = false;
    }
}

/**
 * Auto-resize del input mientras escribes
 */
function autoResizeInput() {
    ChatbotElements.input.style.height = 'auto';
    ChatbotElements.input.style.height = ChatbotElements.input.scrollHeight + 'px';
}

// ============================================
// MANEJO DE MENSAJES
// ============================================

/**
 * Agrega un mensaje al chat
 * @param {string} text - Texto del mensaje
 * @param {string} type - 'user' o 'bot'
 */
function addMessage(text, type = 'bot') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}-message chat-fade-in`;
    
    const time = getCurrentTime();
    
    if (type === 'bot') {
        messageDiv.innerHTML = `
            <div class="chat-message-avatar">🐱</div>
            <div class="chat-message-content">
                <div class="chat-message-bubble">${escapeHtml(text)}</div>
                <div class="chat-message-time">${time}</div>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="chat-message-content">
                <div class="chat-message-bubble">${escapeHtml(text)}</div>
                <div class="chat-message-time">${time}</div>
            </div>
        `;
    }
    
    ChatbotElements.messagesContainer.appendChild(messageDiv);
    
    // Guardar en historial
    ChatbotState.messageHistory.push({
        text: text,
        type: type,
        timestamp: new Date()
    });
    
    scrollToBottom();
}

/**
 * Escape HTML para prevenir XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    let html = div.innerHTML;
    
    // Convertir URLs en enlaces clickeables
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    html = html.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="chat-link">$1</a>');
    
    // Convertir saltos de línea en <br>
    html = html.replace(/\n/g, '<br>');
    
    return html;
}
// ============================================
// INTEGRACIÓN CON DIALOGFLOW
// ============================================

/**
 * Envía un mensaje a Dialogflow y obtiene la respuesta
 * @param {string} message - Mensaje del usuario
 */
async function sendToDialogflow(message) {
    try {
        showTyping();
        
        // Simular delay de escritura para que se vea natural
        await sleep(CHATBOT_CONFIG.typingDelay);
        
        const response = await fetch(CHATBOT_CONFIG.dialogflowEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                sessionId: CHATBOT_CONFIG.sessionId
            })
        });
        
        hideTyping();
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Mostrar respuesta del bot
        if (data.respuesta) {
            addMessage(data.respuesta, 'bot');
        } else {
            addMessage(CHATBOT_CONFIG.errorMessage, 'bot');
        }
        
    } catch (error) {
        console.error('❌ Error al comunicarse con Dialogflow:', error);
        hideTyping();
        
        // Verificar si es un error de conexión
        if (!navigator.onLine) {
            addMessage(CHATBOT_CONFIG.offlineMessage, 'bot');
        } else {
            addMessage(CHATBOT_CONFIG.errorMessage, 'bot');
        }
    }
}

/**
 * Procesa y envía el mensaje del usuario
 */
async function sendMessage() {
    const message = ChatbotElements.input.value.trim();
    
    if (!message || ChatbotState.isTyping) return;
    
    // Mostrar mensaje del usuario
    addMessage(message, 'user');
    
    // Limpiar input
    ChatbotElements.input.value = '';
    ChatbotElements.input.style.height = 'auto';
    
    // Enviar a Dialogflow
    await sendToDialogflow(message);
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Función sleep para delays
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Manejo cuando se pierde conexión
 */
function handleOffline() {
    console.log('⚠️ Usuario sin conexión');
    if (ChatbotState.isOpen) {
        addMessage('Parece que perdiste la conexión a internet.', 'bot');
    }
}

/**
 * Manejo cuando se recupera conexión
 */
function handleOnline() {
    console.log('✅ Usuario conectado');
    if (ChatbotState.isOpen) {
        addMessage('¡Conexión restablecida! Ya puedes seguir chateando.', 'bot');
    }
}

/**
 * Obtiene estadísticas del chat
 */
function getChatStats() {
    return {
        totalMessages: ChatbotState.messageHistory.length,
        userMessages: ChatbotState.messageHistory.filter(m => m.type === 'user').length,
        botMessages: ChatbotState.messageHistory.filter(m => m.type === 'bot').length,
        isOpen: ChatbotState.isOpen,
        sessionId: CHATBOT_CONFIG.sessionId
    };
}

// ============================================
// INTEGRACIÓN CON EL SISTEMA EXISTENTE
// ============================================

/**
 * Agrega el chatbot al sistema de toast notifications
 */
function showChatNotification(message) {
    // Si existe el sistema de toasts de Urban Cats, úsalo
    if (typeof showToast === 'function') {
        showToast(message, 'info');
    }
}

// ============================================
// INICIALIZACIÓN AUTOMÁTICA
// ============================================

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
} else {
    initChatbot();
}

// Exponer funciones globales si se necesitan
window.ChatbotUC = {
    open: openChat,
    close: closeChat,
    sendMessage: sendMessage,
    getStats: getChatStats
};

console.log('🐱 Urban Cats Chatbot Script Loaded');