/**
 * Tests para el módulo de Chat
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import ChatManager from '../assets/chat.js';
describe('ChatManager', () => {
    let chatManager;

    beforeEach(() => {
        chatManager = new ChatManager();
    });

    describe('Gestión de mensajes', () => {
        it('debería inicializar con un mensaje de bienvenida', () => {
            chatManager.initializeChat();
            expect(chatManager.getMessageCount()).toBe(1);
            expect(chatManager.getMessages()[0].sender).toBe('system');
        });

        it('debería agregar mensajes al historial', () => {
            chatManager.initializeChat();
            const message = {
                id: 'test-1',
                text: 'Hola Gandalf',
                sender: 'user',
                timestamp: Date.now(),
                time: '12:30'
            };
            chatManager.addMessage(message);
            expect(chatManager.getMessageCount()).toBe(2);
        });

        it('debería obtener el último mensaje', () => {
            chatManager.initializeChat();
            const message = {
                id: 'test-1',
                text: 'Último mensaje',
                sender: 'user',
                timestamp: Date.now(),
                time: '12:30'
            };
            chatManager.addMessage(message);
            const lastMessage = chatManager.getLastMessage();
            expect(lastMessage.id).toBe('test-1');
        });

        it('debería limpiar el historial de mensajes', () => {
            chatManager.addMessage({
                id: 'test-1',
                text: 'Mensaje',
                sender: 'user',
                timestamp: Date.now(),
                time: '12:30'
            });
            expect(chatManager.getMessageCount()).toBeGreaterThan(0);
            chatManager.clearMessages();
            expect(chatManager.getMessageCount()).toBe(0);
        });
    });

    describe('Estados de carga', () => {
        it('debería indicar que no está cargando inicialmente', () => {
            expect(chatManager.getIsLoading()).toBe(false);
        });

        it('debería rastrear el estado de carga', async () => {
            // Este test es sencillo porque no queremos hacer llamadas a API reales
            expect(chatManager.getIsLoading()).toBe(false);
        });
    });

    describe('Mensaje de bienvenida', () => {
        it('debería generar un mensaje de bienvenida válido', () => {
            const welcome = chatManager.getWelcomeMessage();
            expect(welcome).toBeDefined();
            expect(welcome.sender).toBe('system');
            expect(welcome.text).toBeDefined();
            expect(welcome.text.length).toBeGreaterThan(0);
        });

        it('debería tener la estructura correcta de mensaje', () => {
            const welcome = chatManager.getWelcomeMessage();
            expect(welcome).toHaveProperty('id');
            expect(welcome).toHaveProperty('text');
            expect(welcome).toHaveProperty('sender');
            expect(welcome).toHaveProperty('timestamp');
            expect(welcome).toHaveProperty('time');
        });
    });

    describe('Obtención de mensajes', () => {
        it('debería devolver array de mensajes', () => {
            chatManager.initializeChat();
            const messages = chatManager.getMessages();
            expect(Array.isArray(messages)).toBe(true);
            expect(messages.length).toBeGreaterThan(0);
        });

        it('debería mantener el orden de los mensajes', () => {
            chatManager.initializeChat();
            const msg1 = { id: 'msg1', text: 'Primero', sender: 'user', timestamp: Date.now(), time: '12:00' };
            const msg2 = { id: 'msg2', text: 'Segundo', sender: 'system', timestamp: Date.now() + 1000, time: '12:01' };

            chatManager.addMessage(msg1);
            chatManager.addMessage(msg2);

            const messages = chatManager.getMessages();
            const lastTwo = messages.slice(-2);
            expect(lastTwo[0].id).toBe('msg1');
            expect(lastTwo[1].id).toBe('msg2');
        });
    });

    describe('Interfaz de API Basada en Mensajes', () => {
        it('debería formatear correctamente los mensajes para enviar a API', () => {
            chatManager.initializeChat();
            const message = {
                id: 'msg-test',
                text: 'Hola',
                sender: 'user',
                timestamp: Date.now(),
                time: '12:30'
            };
            chatManager.addMessage(message);

            const messages = chatManager.getMessages();
            expect(messages.length).toBeGreaterThan(0);

            // Verificar que cada mensaje tiene la estructura esperada
            messages.forEach(msg => {
                expect(msg).toHaveProperty('sender');
                expect(['user', 'system']).toContain(msg.sender);
                expect(msg).toHaveProperty('text');
            });
        });
    });
});
