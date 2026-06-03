/**
 * Módulo de Chat - Lógica específica para el chat con Ada
 */

import { cleanMessage, createMessage, formatMessagesForApi, debugLog } from './utils.js';

/**
 * Sistema prompt para Ada Lovelace
 */
const ADA_SYSTEM_PROMPT = `Eres Ada Lovelace, matemática visionaria e ideadora del primer algoritmo destinado a ser procesado por máquina, nacida en 1815.

Características de tu personalidad:
- Eres sofisticada, educada y apasionada por la matemática y la computación
- Tienes una perspectiva visionaria sobre el futuro de las máquinas
- Hablas con precisión pero de manera accesible
- Eres curiosa y te interesa aprender sobre el mundo moderno
- Tienes un tono formal pero amigable
- Siempre intentas conectar temas con la matemática y la máquina analítica

Temas sobre los que puedes hablar:
- Tu vida, familia y educación
- Matemáticas y álgebra
- La máquina analítica de Charles Babbage
- Historia de la computación
- Programación y algoritmos
- Ciencia e innovación

Limitaciones:
- Mantén respuestas cortas (2-3 oraciones máximo en formato chat)
- No hagas listas muy largas
- No proporcionas código, solo explicas conceptos
- Enfócate en temas de tu época o conceptos universales
- Si te preguntan sobre tecnología moderna, responde desde tu perspectiva de pionera

Estilo de respuesta:
- Sé conversacional pero elocuente
- Usa "yo" para referirte a ti misma
- Evita emojis, mantén un tono profesional
- Sé concisa y directa
- Si no sabes de algo, admítelo con gracia`;

class ChatManager {
    constructor() {
        this.messages = [];
        this.isLoading = false;
        this.apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
    }

    /**
     * Agrega un mensaje al historial
     * @param {object} message - Objeto mensaje creado con createMessage()
     */
    addMessage(message) {
        this.messages.push(message);
        debugLog('Mensaje agregado:', message);
    }

    /**
     * Obtiene todos los mensajes del chat
     * @returns {array} Array de mensajes
     */
    getMessages() {
        return this.messages;
    }

    /**
     * Limpia el historial de mensajes
     */
    clearMessages() {
        this.messages = [];
        debugLog('Historial de chat limpiado');
    }

    /**
     * Obtiene el último mensaje
     * @returns {object|null} Último mensaje o null si no hay mensajes
     */
    getLastMessage() {
        return this.messages.length > 0 ? this.messages[this.messages.length - 1] : null;
    }

    /**
     * Obtiene el total de mensajes
     * @returns {number} Cantidad de mensajes
     */
    getMessageCount() {
        return this.messages.length;
    }

    /**
     * Envía un mensaje a la API y obtiene respuesta
     * @param {string} userMessage - Mensaje del usuario
     * @returns {Promise<string>} Respuesta de Ada
     */
    async sendMessage(userMessage) {
        if (this.isLoading) {
            throw new Error('Ya hay una solicitud en proceso');
        }

        const cleanedMessage = cleanMessage(userMessage);
        if (!cleanedMessage) {
            throw new Error('El mensaje no puede estar vacío');
        }

        this.isLoading = true;
        debugLog('Enviando mensaje:', cleanedMessage);

        try {
            // Agregar mensaje del usuario al historial
            const userMsg = createMessage(cleanedMessage, 'user');
            this.addMessage(userMsg);

            // Preparar el payload para la API
            const payload = {
                messages: formatMessagesForApi(this.messages),
                systemPrompt: ADA_SYSTEM_PROMPT
            };

            debugLog('Payload enviado:', payload);

            // Llamar a la Serverless Function
            const response = await fetch(`${this.apiBaseUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Error HTTP ${response.status}`);
            }

            const data = await response.json();
            debugLog('Respuesta recibida:', data);

            // Agregar respuesta de Ada al historial
            const adaMsg = createMessage(data.reply, 'system');
            this.addMessage(adaMsg);

            return data.reply;
        } catch (error) {
            debugLog('Error en sendMessage:', error);
            // Remover el último mensaje del usuario si hubo error
            if (this.messages.length > 0 && this.messages[this.messages.length - 1].sender === 'user') {
                this.messages.pop();
            }
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Verifica si el chat está cargando una respuesta
     * @returns {boolean}
     */
    getIsLoading() {
        return this.isLoading;
    }

    /**
     * Obtiene el mensaje inicial de bienvenida
     * @returns {object} Mensaje de bienvenida
     */
    getWelcomeMessage() {
        return createMessage(
            'Hola, soy Ada Lovelace. ¿En qué puedo ayudarte hoy? Puedo hablar sobre programación, matemáticas, computación y mi vida.',
            'system'
        );
    }

    /**
     * Inicializa el chat con mensaje de bienvenida
     */
    initializeChat() {
        this.messages = [this.getWelcomeMessage()];
        debugLog('Chat inicializado');
    }
}

export default ChatManager;
