/**
 * Utilidades para parseo y transformación de datos
 */

/**
 * Parsea un mensaje de respuesta del API
 * @param {string} response - Respuesta de texto del API
 * @returns {string} Texto parseado
 */
export function parseApiResponse(response) {
    if (!response || typeof response !== 'string') {
        return '';
    }
    // Limpiar espacios en blanco al inicio y final
    return response.trim();
}

/**
 * Valida si un mensaje es válido para enviar
 * @param {string} message - Mensaje a validar
 * @returns {boolean} true si es válido, false si no
 */
export function isValidMessage(message) {
    if (!message || typeof message !== 'string') {
        return false;
    }
    return message.trim().length > 0;
}

/**
 * Limpia un mensaje eliminando espacios en blanco excesivos
 * @param {string} message - Mensaje a limpiar
 * @returns {string} Mensaje limpio
 */
export function cleanMessage(message) {
    if (!message || typeof message !== 'string') {
        return '';
    }
    return message.trim().replace(/\s+/g, ' ');
}

/**
 * Formatea un timestamp a formato legible
 * @param {number} timestamp - Timestamp en milisegundos
 * @returns {string} Hora formateada (HH:MM)
 */
export function formatTime(timestamp) {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

/**
 * Crea un objeto de mensaje
 * @param {string} text - Contenido del mensaje
 * @param {string} sender - 'user' o 'system'
 * @param {number} timestamp - Timestamp del mensaje
 * @returns {object} Objeto de mensaje formateado
 */
export function createMessage(text, sender, timestamp = Date.now()) {
    return {
        id: `msg-${Date.now()}-${Math.random()}`,
        text: cleanMessage(text),
        sender: sender === 'user' ? 'user' : 'system',
        timestamp: timestamp,
        time: formatTime(timestamp)
    };
}

/**
 * Convierte un array de mensajes al formato esperado por Gemini API
 * @param {array} messages - Array de objetos de mensaje
 * @returns {array} Array de objetos con 'role' y 'parts'
 */
export function formatMessagesForApi(messages) {
    return messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));
}

/**
 * Escapa caracteres especiales HTML
 * @param {string} text - Texto a escapar
 * @returns {string} Texto escapado
 */
export function escapeHtml(text) {
    if (!text || typeof text !== 'string') {
        return '';
    }
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Detecta si el texto contiene URLs
 * @param {string} text - Texto a analizar
 * @returns {boolean} true si contiene URLs
 */
export function containsUrls(text) {
    if (!text || typeof text !== 'string') {
        return false;
    }
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return urlRegex.test(text);
}

/**
 * Obtiene el nombre del entorno
 * @returns {string} 'development' o 'production'
 */
export function getEnvironment() {
    return import.meta.env.MODE || 'development';
}

/**
 * Registra un mensaje en consola (solo en desarrollo)
 * @param {string} message - Mensaje a registrar
 * @param {any} data - Datos adicionales (opcional)
 */
export function debugLog(message, data = null) {
    if (getEnvironment() === 'development') {
        if (data) {
            console.log(`[DEBUG] ${message}`, data);
        } else {
            console.log(`[DEBUG] ${message}`);
        }
    }
}
