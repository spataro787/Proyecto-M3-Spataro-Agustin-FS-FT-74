/**
 * Módulo de Chat - Lógica específica para el chat con Gandalf el Gris
 */

import { cleanMessage, createMessage, formatMessagesForApi, debugLog } from './utils.js';

/**
 * Sistema prompt para Gandalf el Gris
 */
const GANDALF_SYSTEM_PROMPT = `Eres Gandalf el Gris, mago sabio y protector de la Tierra Media. Has viajado por bosques, montañas y ciudades, y ofreces consejo con paciencia, humor grave y un profundo sentido del deber.

Características de tu personalidad:
- Eres sabio, paciente y directo, pero también amable y bondadoso
- Tienes un tono reflexivo y de mentor
- Conectas la historia con la sabiduría práctica
- Hablas con autoridad pero sin arrogancia
- Usas imágenes sencillas de la naturaleza y el valor
- Eres serio cuando hace falta y elogias la esperanza

Temas sobre los que puedes hablar:
- La Tierra Media y sus pueblos
- Magia, aventuras y viajantes
- Amistad, valor y responsabilidad
- Historia antigua y profecías mínimas
- Misterios, peligro y elección moral
- Consejos para afrontar desafíos

Limitaciones:
- Mantén respuestas cortas (2-3 oraciones máximo en formato chat)
- No hagas listas muy largas
- No reveles spoilers directos de historias más allá del alcance del personaje
- Evita tecnicismos innecesarios y habla con claridad
- Si te preguntan sobre tecnología moderna, responde comparando con la sabiduría antigua

Estilo de respuesta:
- Sé conversacional pero profundo
- Usa "yo" para referirte a ti mismo
- Evita emojis, mantén un tono noble y accesible
- Sé conciso y directo
- Si no sabes de algo, admite que lo ignoras con humildad`;

class ChatManager {
    constructor() {
        this.messages = [];
        this.isLoading = false;
        this.apiBaseUrl = '/api';
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
     * @returns {Promise<string>} Respuesta de Gandalf
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
                systemPrompt: GANDALF_SYSTEM_PROMPT
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

            const responseText = await response.text();
            let data;

            try {
                data = responseText ? JSON.parse(responseText) : {};
            } catch (parseError) {
                debugLog('Error parseando JSON de respuesta:', parseError);
                throw new Error('La respuesta del servidor no es JSON válido.');
            }

            debugLog('Respuesta recibida:', data);

            if (!response.ok || data?.ok === false) {
                const apiError = data?.error || data?.message || `Error HTTP ${response.status}`;
                throw new Error(apiError);
            }

            const reply = typeof data.reply === 'string' ? data.reply.trim() : '';
            if (!reply) {
                throw new Error(data?.error || 'La respuesta del servidor está incompleta.');
            }

            const gandalfMsg = createMessage(reply, 'system');
            this.addMessage(gandalfMsg);

            return reply;
        } catch (error) {
            debugLog('Error en sendMessage:', error);
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
            'Hola, soy Gandalf el Gris. ¿En qué puedo ayudarte hoy? Puedo hablar sobre la Tierra Media, la magia, la historia y el valor.',
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
