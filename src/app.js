/**
 * App SPA principal
 */

import ChatManager from './chat.js';
import { debugLog, escapeHtml } from './utils.js';

const chatManager = new ChatManager();
chatManager.initializeChat();

class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = '/home';
        this.setupRoutes();
        this.setupHistoryListener();
        this.setupNavigation();
    }

    register(path, handler) {
        this.routes.set(path, handler);
        debugLog(`Ruta registrada: ${path}`);
    }

    setupRoutes() {
        this.register('/home', this.handleHomeRoute);
        this.register('/chat', this.handleChatRoute);
        this.register('/about', this.handleAboutRoute);
    }

    handleHomeRoute = () => {
        debugLog('Navegando a /home');
        this.showView('home-view');
    };

    handleChatRoute = () => {
        debugLog('Navegando a /chat');
        this.showView('chat-view');
        this.initializeChatUI();
    };

    handleAboutRoute = () => {
        debugLog('Navegando a /about');
        this.showView('about-view');
    };

    showView(viewId) {
        document.querySelectorAll('.view').forEach(view => {
            view.classList.add('hidden');
            view.classList.remove('active');
        });

        const view = document.getElementById(viewId);
        if (view) {
            view.classList.remove('hidden');
            view.classList.add('active');
        }
    }

    navigate(path) {
        if (!this.routes.has(path)) {
            debugLog(`Ruta no encontrada: ${path}`);
            return;
        }

        window.history.pushState({ path }, '', path);
        this.currentRoute = path;
        const handler = this.routes.get(path);
        if (handler) {
            handler();
        }
        this.updateNavigation();
    }

    updateNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-route') === this.currentRoute) {
                link.classList.add('active');
            }
        });
    }

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

    setupNavigation() {
        document.querySelectorAll('.nav-link, [data-route]').forEach(element => {
            element.addEventListener('click', (e) => {
                if (element.closest('form')) return;
                const route = element.getAttribute('data-route');
                if (route) {
                    e.preventDefault();
                    this.navigate(route);
                }
            });
        });

        const currentPath = window.location.pathname;
        if (currentPath === '/' || currentPath === '/index.html') {
            this.navigate('/home');
        } else if (this.routes.has(currentPath)) {
            this.navigate(currentPath);
        } else {
            this.navigate('/home');
        }
    }

    initializeChatUI() {
        this.renderMessages();
    }

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

    scrollToBottom() {
        const messagesContainer = document.getElementById('messages-container');
        if (messagesContainer) {
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 0);
        }
    }
}

class ChatUI {
    constructor(router) {
        this.router = router;
        this.setupChatForm();
    }

    setupChatForm() {
        const form = document.getElementById('chat-form');
        const input = document.getElementById('message-input');
        const loadingStatus = document.getElementById('loading-status');

        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const message = input.value.trim();
            if (!message) return;

            input.value = '';
            input.style.height = 'auto';

            loadingStatus?.classList.remove('hidden');

            try {
                debugLog('Enviando mensaje:', message);
                await chatManager.sendMessage(message);
                this.router.renderMessages();
            } catch (error) {
                debugLog('Error al enviar mensaje:', error);
                this.showError(error.message);
            } finally {
                loadingStatus?.classList.add('hidden');
                input.focus();
            }
        });

        if (input) {
            input.addEventListener('input', () => {
                input.style.height = 'auto';
                input.style.height = Math.min(input.scrollHeight, 120) + 'px';
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                    form.dispatchEvent(new Event('submit'));
                }
            });
        }
    }

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

function initializeApp() {
    debugLog('Inicializando aplicación...');
    const router = new Router();
    new ChatUI(router);
    router.renderMessages();
    debugLog('Aplicación inicializada correctamente');
    window.APP = { router, chatManager };
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
