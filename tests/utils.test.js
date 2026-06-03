/**
 * Tests para funciones de utilidad
 */

import { describe, it, expect } from 'vitest';
import {
    parseApiResponse,
    isValidMessage,
    cleanMessage,
    createMessage,
    formatMessagesForApi,
    formatTime,
    escapeHtml,
    containsUrls
} from '../src/utils.js';

describe('Funciones de Utilidad', () => {
    describe('parseApiResponse', () => {
        it('debería parsear una respuesta válida', () => {
            const response = '  Hola, ¿cómo estás?  ';
            const result = parseApiResponse(response);
            expect(result).toBe('Hola, ¿cómo estás?');
        });

        it('debería devolver string vacío para entrada nula', () => {
            expect(parseApiResponse(null)).toBe('');
            expect(parseApiResponse(undefined)).toBe('');
        });

        it('debería devolver string vacío para entrada no válida', () => {
            expect(parseApiResponse(123)).toBe('');
            expect(parseApiResponse({})).toBe('');
        });
    });

    describe('isValidMessage', () => {
        it('debería validar un mensaje válido', () => {
            expect(isValidMessage('Hola')).toBe(true);
            expect(isValidMessage('  Mensaje con espacios  ')).toBe(true);
        });

        it('debería rechazar mensajes vacíos', () => {
            expect(isValidMessage('')).toBe(false);
            expect(isValidMessage('   ')).toBe(false);
        });

        it('debería rechazar entrada nula o no válida', () => {
            expect(isValidMessage(null)).toBe(false);
            expect(isValidMessage(undefined)).toBe(false);
            expect(isValidMessage(123)).toBe(false);
        });
    });

    describe('cleanMessage', () => {
        it('debería limpiar espacios en blanco', () => {
            const message = '  Hola   mundo  ';
            expect(cleanMessage(message)).toBe('Hola mundo');
        });

        it('debería remover espacios múltiples entre palabras', () => {
            const message = 'Esto    es    una    prueba';
            expect(cleanMessage(message)).toBe('Esto es una prueba');
        });

        it('debería devolver string vacío para entrada nula', () => {
            expect(cleanMessage(null)).toBe('');
            expect(cleanMessage(undefined)).toBe('');
        });
    });

    describe('createMessage', () => {
        it('debería crear un mensaje de usuario válido', () => {
            const message = createMessage('Hola Ada', 'user');
            expect(message.text).toBe('Hola Ada');
            expect(message.sender).toBe('user');
            expect(message.id).toBeDefined();
            expect(message.timestamp).toBeDefined();
            expect(message.time).toBeDefined();
        });

        it('debería crear un mensaje del sistema válido', () => {
            const message = createMessage('Respuesta de Ada', 'system');
            expect(message.sender).toBe('system');
        });

        it('debería limpiar el mensaje al crear', () => {
            const message = createMessage('  Mensaje  con  espacios  ', 'user');
            expect(message.text).toBe('Mensaje con espacios');
        });

        it('debería generar ID único para cada mensaje', () => {
            const msg1 = createMessage('Mensaje 1', 'user');
            const msg2 = createMessage('Mensaje 2', 'user');
            expect(msg1.id).not.toBe(msg2.id);
        });
    });

    describe('formatMessagesForApi', () => {
        it('debería formatear un array de mensajes correctamente', () => {
            const messages = [
                createMessage('Hola', 'user'),
                createMessage('Hola, ¿cómo estás?', 'system')
            ];

            const formatted = formatMessagesForApi(messages);

            expect(formatted).toHaveLength(2);
            expect(formatted[0].role).toBe('user');
            expect(formatted[0].parts[0].text).toBe('Hola');
            expect(formatted[1].role).toBe('model');
            expect(formatted[1].parts[0].text).toBe('Hola, ¿cómo estás?');
        });

        it('debería devolver array vacío para entrada vacía', () => {
            const formatted = formatMessagesForApi([]);
            expect(formatted).toEqual([]);
        });
    });

    describe('formatTime', () => {
        it('debería formatear un timestamp a HH:MM', () => {
            const date = new Date(2026, 5, 3, 14, 30, 0);
            const timestamp = date.getTime();
            const time = formatTime(timestamp);
            expect(time).toMatch(/^\d{2}:\d{2}$/);
        });

        it('debería rellenar con ceros los números menores a 10', () => {
            const date = new Date(2026, 5, 3, 9, 5, 0);
            const timestamp = date.getTime();
            const time = formatTime(timestamp);
            expect(time).toBe('09:05');
        });
    });

    describe('escapeHtml', () => {
        it('debería escapar caracteres HTML peligrosos', () => {
            const text = '<script>alert("XSS")</script>';
            const escaped = escapeHtml(text);
            expect(escaped).not.toContain('<script>');
            expect(escaped).toContain('&lt;');
        });

        it('debería devolver string vacío para entrada nula', () => {
            expect(escapeHtml(null)).toBe('');
            expect(escapeHtml(undefined)).toBe('');
        });

        it('debería escapar caracteres especiales HTML', () => {
            const text = '<div class="test">Contenido & símbolos</div>';
            const escaped = escapeHtml(text);
            expect(escaped).toContain('&lt;');
            expect(escaped).toContain('&gt;');
            expect(escaped).toContain('&amp;');
        });
    });

    describe('containsUrls', () => {
        it('debería detectar URLs en el texto', () => {
            const text = 'Visita https://example.com para más info';
            expect(containsUrls(text)).toBe(true);
        });

        it('debería detectar múltiples URLs', () => {
            const text = 'Ve http://site1.com o https://site2.com';
            expect(containsUrls(text)).toBe(true);
        });

        it('debería retornar false si no hay URLs', () => {
            const text = 'Este es un texto sin URLs';
            expect(containsUrls(text)).toBe(false);
        });

        it('debería retornar false para entrada nula', () => {
            expect(containsUrls(null)).toBe(false);
            expect(containsUrls(undefined)).toBe(false);
        });
    });
});
