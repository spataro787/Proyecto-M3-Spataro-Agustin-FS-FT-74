/**
 * Aplicación Principal - Routing SPA y Lógica General
 */

import ChatManager from './chat.js';
import { debugLog, escapeHtml } from './utils.js';

// Singleton del ChatManager
const chatManager = new ChatManager();
chatManager.initializeChat();

/**
 * Controlador de Rutas SPA
 */
class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = '/home';
        this.setupRoutes();
        this.setupHistoryListener();
        this.setupNavigation();
    }

    /**
     * Registra una ruta y su controlador
     * @param {string} path - Ruta (ej: '/home')
     * @param {function} handler - Función que maneja la ruta
     */
    register(path, handler) {
        this.routes.set(path, handler);
        debugLog(`Ruta registrada: ${path}`);
    }

    /**
     * Configura las rutas disponibles
     */
    setupRoutes() {
        this.register('/home', this.handleHomeRoute);
        this.register('/chat', this.handleChatRoute);
        this.register('/about', this.handleAboutRoute);
    }

    /**
     * Maneja la vista Home
     */
    handleHomeRoute = () => {
        debugLog('Navegando a /home');
        this.showView('home-view');
    };

    /**
     * Maneja la vista Chat
     */
    handleChatRoute = () => {
        debugLog('Navegando a /chat');
        this.showView('chat-view');
        this.initializeChatUI();
    };

    /**
     * Maneja la vista About
     */
    handleAboutRoute = () => {
        debugLog('Navegando a /about');
        this.showView('about-view');
    };

    /**
     * Muestra una vista específica
     * @param {string} viewId - ID del elemento de vista
     */
    showView(viewId) {
        // Ocultar todas las vistas
        document.querySelectorAll('.view').forEach(view => {
            view.classList.add('hidden');
            view.classList.remove('active');
        });

        // Mostrar la vista solicitada
        const view = document.getElementById(viewId);
        if (view) {
            view.classList.remove('hidden');
            view.classList.add('active');
        }
    }

    /**
     * Navega a una ruta
     * @param {string} path - Ruta a navegar
     */
    navigate(path) {
        // Validar que la ruta exista
        if (!this.routes.has(path)) {
            debugLog(`Ruta no encontrada: ${path}`);
            return;
        }

        // Actualizar URL sin recargar
        window.history.pushState({ path }, '', path);

        // Ejecutar el handler de la ruta
        this.currentRoute = path;
        const handler = this.routes.get(path);
        if (handler) {
            handler();
        }

        // Actualizar navegación activa
        this.updateNavigation();
    }

    /**
     * Actualiza el estado visual de la navegación
     */
    updateNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-route') === this.currentRoute) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Escucha el evento popstate (botones back/forward del navegador)
     */
    setupHistoryListener() {
        window.addEventListener('popstate', (event) => {
            debugLog('Evento popstate:', event.state);
            const path = event.state?.path || '/home';
            this.currentRoute = path;

            if (this.routes.has(path)) {
                const handler = this.routes.get(path);
                if (handler) {
                    handler();
                }
            }

            this.updateNavigation();
        });
    }

    /**
     * Configura los botones de navegación
     */
    setupNavigation() {
        document.querySelectorAll('.nav-link, [data-route]').forEach(element => {
            element.addEventListener('click', (e) => {
                // Si es un botón dentro del formulario, no navegar
                if (element.closest('form')) return;

                const route = element.getAttribute('data-route');
                if (route) {
                    e.preventDefault();
                    this.navigate(route);
                }
            });
        });

        // Navegar a /home inicialmente si estamos en root
        if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
            this.navigate('/home');
        } else {
            // Si hay una ruta en la URL, navegar a ella
            const currentPath = window.location.pathname;
            if (this.routes.has(currentPath)) {
                this.navigate(currentPath);
            } else {
                this.navigate('/home');
            }
        }
    }

    /**
     * Inicializa la interfaz del chat
     */
    initializeChatUI() {
        this.renderMessages();
    }

    /**
     * Renderiza los mensajes en la UI
     */
    renderMessages() {
        const messagesContainer = document.getElementById('messages-container');
        if (!messagesContainer) return;

        messagesContainer.innerHTML = '';

        const messages = chatManager.getMessages();
        messages.forEach((msg) => {
            const messageEl = this.createMessageElement(msg);
            messagesContainer.appendChild(messageEl);
        });

        this.scrollToBottom();
    }

    /**
     * Crea un elemento DOM para un mensaje
     * @param {object} message - Objeto mensaje
     * @returns {HTMLElement}
     */
    createMessageElement(message) {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${message.sender}-message`;
        messageEl.dataset.messageId = message.id;

        const contentEl = document.createElement('div');
        contentEl.className = 'message-content';
        contentEl.textContent = message.text;

        messageEl.appendChild(contentEl);
        return messageEl;
    }

    /**
     * Hace scroll automático al final de los mensajes
     */
    scrollToBottom() {
        const messagesContainer = document.getElementById('messages-container');
        if (messagesContainer) {
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 0);
        }
    }
}

/**
 * Inicializador del Chat UI
 */
class ChatUI {
    constructor(router) {
        this.router = router;
        this.setupChatForm();
    }

    /**
     * Configura el formulario del chat
     */
    setupChatForm() {
        const form = document.getElementById('chat-form');
        const input = document.getElementById('message-input');
        const loadingStatus = document.getElementById('loading-status');

        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const message = input.value.trim();
            if (!message) return;

            // Limpiar input
            input.value = '';
            input.style.height = 'auto';

            // Mostrar estado de carga
            loadingStatus?.classList.remove('hidden');

            try {
                debugLog('Enviando mensaje:', message);
                const response = await chatManager.sendMessage(message);
                debugLog('Respuesta recibida:', response);

                // Renderizar nuevos mensajes
                this.router.renderMessages();
            } catch (error) {
                debugLog('Error al enviar mensaje:', error);
                this.showError(error.message);
            } finally {
                // Ocultar estado de carga
                loadingStatus?.classList.add('hidden');
                input.focus();
            }
        });

        // Auto-expand textarea
        if (input) {
            input.addEventListener('input', () => {
                input.style.height = 'auto';
                input.style.height = Math.min(input.scrollHeight, 120) + 'px';
            });

            // Enviar con Ctrl+Enter
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                    form.dispatchEvent(new Event('submit'));
                }
            });
        }
    }

    /**
     * Muestra un mensaje de error al usuario
     * @param {string} message - Mensaje de error
     */
    showError(message) {
        const messagesContainer = document.getElementById('messages-container');
        if (messagesContainer) {
            const errorEl = document.createElement('div');
            errorEl.className = 'message system-message';
            errorEl.innerHTML = `
                <div class="message-content">
                    <p><strong>Error:</strong> ${escapeHtml(message)}</p>
                    <p>Por favor, intenta de nuevo.</p>
                </div>
            `;
            messagesContainer.appendChild(errorEl);
            this.router.scrollToBottom();
        }
    }
}

/**
 * Inicialización de la aplicación
 */
function initializeApp() {
    debugLog('Inicializando aplicación...');

    // Crear router
    const router = new Router();

    // Crear UI del chat
    const chatUI = new ChatUI(router);

    // Renderizar mensajes iniciales
    router.renderMessages();

    debugLog('Aplicación inicializada correctamente');

    // Exponer globalmente para debugging
    window.APP = {
        router,
        chatManager,
        chatUI,
        debugLog
    };
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
