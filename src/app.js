/**
 * App SPA principal
 */

import ChatManager from './chat.js';
import { debugLog, escapeHtml } from './utils.js';

const chatManager = new ChatManager();

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
        this.showView('home-view');
    };

    handleChatRoute = () => {
        this.showView('chat-view');
        chatUI.renderMessages();
    };

    handleAboutRoute = () => {
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
        if (!this.routes.has(path)) return;

        window.history.pushState({ path }, '', path);
        this.currentRoute = path;

        const handler = this.routes.get(path);
        handler?.();

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
            const path = event.state?.path || '/home';
            this.currentRoute = path;

            const handler = this.routes.get(path);
            handler?.();

            this.updateNavigation();
        });
    }

    setupNavigation() {
        document.querySelectorAll('[data-route]').forEach(element => {
            element.addEventListener('click', (e) => {
                const route = element.getAttribute('data-route');
                if (!route) return;

                e.preventDefault();
                this.navigate(route);
            });
        });

        const path = window.location.pathname;

        if (this.routes.has(path)) {
            this.navigate(path);
        } else {
            this.navigate('/home');
        }
    }
}

class ChatUI {
    constructor() {
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
                await chatManager.sendMessage(message);
                this.renderMessages();
            } catch (error) {
                this.showError(error.message);
            } finally {
                loadingStatus?.classList.add('hidden');
                input.focus();
            }
        });

        input?.addEventListener('input', () => {
            input.style.height = 'auto';
            input.style.height = Math.min(input.scrollHeight, 120) + 'px';
        });

        input?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                form.dispatchEvent(new Event('submit'));
            }
        });
    }

    renderMessages() {
        const container = document.getElementById('messages-container');
        if (!container) return;

        container.innerHTML = '';

        const messages = chatManager.getMessages();

        messages.forEach(msg => {
            const el = document.createElement('div');
            el.className = `message ${msg.sender}-message`;

            const content = document.createElement('div');
            content.className = 'message-content';
            content.textContent = msg.text;

            el.appendChild(content);
            container.appendChild(el);
        });

        this.scrollToBottom();
    }

    scrollToBottom() {
        const container = document.getElementById('messages-container');
        if (!container) return;

        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 0);
    }

    showError(message) {
        const container = document.getElementById('messages-container');
        if (!container) return;

        const errorEl = document.createElement('div');
        errorEl.className = 'message system-message';

        errorEl.innerHTML = `
            <div class="message-content">
                <strong>Error:</strong> ${escapeHtml(message)}
            </div>
        `;

        container.appendChild(errorEl);
        this.scrollToBottom();
    }
}

function initializeApp() {
    debugLog('Inicializando aplicación...');

    const router = new Router();
    window.chatUI = new ChatUI(); // importante para acceso desde router

    router.navigate('/home');

    window.APP = {
        router,
        chatManager
    };

    debugLog('Aplicación inicializada correctamente');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}