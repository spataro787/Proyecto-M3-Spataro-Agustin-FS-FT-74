/**
 * Vercel Serverless Function - API Proxy para Gemini
 * 
 * Esta función actúa como proxy entre el frontend y Google Gemini AI.
 * Protege la API key que nunca está expuesta en el cliente.
 * 
 * Endpoint: /api/chat
 * Método: POST
 */

export default async function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Manejar preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Solo aceptar POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido. Solo POST.' });
    }

    try {
        // Validar que la API key está configurada
      onst apiKey = process.env.GEMINI_API_KEY;

console.log("API Key encontrada:", !!apiKey);

if (apiKey) {
    console.log("Primeros caracteres:", apiKey.substring(0, 10));
}

if (!apiKey) {
    console.error('Error: GEMINI_API_KEY no está configurada');
    return res.status(500).json({
        error: 'Configuración del servidor incompleta. API key no configurada.'
    });
        }

        // Obtener datos del request
        const { messages, systemPrompt } = req.body;

        // Validaciones
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({
                error: 'Parámetro "messages" requerido y debe ser un array'
            });
        }

        if (messages.length === 0) {
            return res.status(400).json({
                error: 'Al menos un mensaje es requerido'
            });
        }

        if (!systemPrompt || typeof systemPrompt !== 'string') {
            return res.status(400).json({
                error: 'Parámetro "systemPrompt" requerido'
            });
        }

        // Construir el contenido para enviar a Gemini
        const contents = messages.map(msg => ({
            role: msg.role,
            parts: msg.parts
        }));

        // Realizar llamada a Google Gemini API
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    system_instruction: {
                        parts: {
                            text: systemPrompt
                        }
                    },
                    contents: contents,
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 256,
                    },
                    safetySettings: [
                        {
                            category: 'HARM_CATEGORY_HARASSMENT',
                            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
                        },
                        {
                            category: 'HARM_CATEGORY_HATE_SPEECH',
                            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
                        },
                        {
                            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
                        },
                        {
                            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        // Manejar errores de la API de Gemini
        if (!response.ok) {
            console.error('Error de Gemini API:', data);
            return res.status(response.status).json({
                error: data.error?.message || 'Error al comunicarse con Gemini API'
            });
        }

        // Extraer el texto de la respuesta
        const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textContent) {
            console.error('Respuesta inesperada de Gemini:', data);
            return res.status(500).json({
                error: 'Respuesta vacía de Gemini API'
            });
        }

        // Retornar respuesta al cliente
        return res.status(200).json({
            success: true,
            reply: textContent,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error en serverless function:', error);
        return res.status(500).json({
            error: `Error del servidor: ${error.message}`
        });
    }
}
