/**
 * Vercel Serverless Function - API Proxy para Gemini
 */

module.exports = async function handler(req, res) {
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
        return res.status(405).json({
            error: 'Método no permitido. Solo POST.'
        });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;

        console.log(
            'API KEY:',
            apiKey?.substring(0, 6),
            '...',
            apiKey?.slice(-4)
        );

        if (!apiKey) {
            console.error('Error: GEMINI_API_KEY no está configurada');
            return res.status(500).json({
                error: 'Configuración del servidor incompleta. API key no configurada.'
            });
        }

        const { messages, systemPrompt } = req.body;

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

        const contents = messages.map(msg => ({
            role: msg.role,
            parts: msg.parts
        }));

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    system_instruction: {
                        parts: [{
                            text: systemPrompt
                        }]
                    },
                    contents,
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 256
                    }
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error('Error de Gemini API:', data);

            return res.status(response.status).json({
                error: data.error?.message || 'Error al comunicarse con Gemini API'
            });
        }

        const textContent =
            data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textContent) {
            console.error('Respuesta inesperada de Gemini:', data);

            return res.status(500).json({
                error: 'Respuesta vacía de Gemini API'
            });
        }

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
};