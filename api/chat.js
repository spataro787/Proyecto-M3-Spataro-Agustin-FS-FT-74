export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      status: 200,
      message: 'API viva'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      status: 405,
      error: 'Método no permitido. Use POST.'
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Falta GEMINI_API_KEY en el entorno');
    return res.status(500).json({
      ok: false,
      status: 500,
      error: 'Missing GEMINI_API_KEY in Vercel'
    });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (parseError) {
      return res.status(400).json({
        ok: false,
        status: 400,
        error: 'JSON inválido en el body.'
      });
    }
  }

  if (!body || typeof body !== 'object') {
    return res.status(400).json({
      ok: false,
      status: 400,
      error: 'Body inválido. Se requiere JSON con messages y systemPrompt.'
    });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const systemPrompt = typeof body.systemPrompt === 'string' && body.systemPrompt.trim()
    ? body.systemPrompt.trim()
    : 'Eres un asistente útil y claro.';

  if (messages.length === 0) {
    return res.status(400).json({
      ok: false,
      status: 400,
      error: 'messages es requerido y debe ser un array con al menos un mensaje.'
    });
  }

  const promptMessages = [
    {
      author: 'system',
      content: [
        {
          type: 'text',
          text: systemPrompt
        }
      ]
    },
    ...messages
      .map((msg) => {
        const text = msg?.parts?.[0]?.text || msg?.text || '';
        const role = msg?.role || msg?.sender || 'user';
        const author = role === 'user'
          ? 'user'
          : role === 'system'
            ? 'system'
            : 'assistant';

        if (!text || typeof text !== 'string') {
          return null;
        }

        return {
          author,
          content: [
            {
              type: 'text',
              text: text.trim()
            }
          ]
        };
      })
      .filter(Boolean)
  ];

  if (promptMessages.length === 1) {
    return res.status(400).json({
      ok: false,
      status: 400,
      error: 'No se encontró texto válido en messages.'
    });
  }

  const geminiRequest = {
    prompt: {
      messages: promptMessages
    },
    temperature: 0.35,
    topP: 0.95,
    candidateCount: 1,
    maxOutputTokens: 500
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(geminiRequest)
      }
    );

    const rawResponse = await response.text();
    let responseData = {};

    try {
      responseData = rawResponse ? JSON.parse(rawResponse) : {};
    } catch (parseError) {
      console.error('ERROR PARSING GEMINI RESPONSE:', parseError, rawResponse);
      return res.status(502).json({
        ok: false,
        status: 502,
        error: 'La API de Gemini devolvió un JSON inválido.',
        details: rawResponse
      });
    }

    if (!response.ok) {
      const errorMessage = responseData?.error?.message || responseData?.error || responseData?.message || `Gemini API devolvió ${response.status}`;
      return res.status(response.status).json({
        ok: false,
        status: response.status,
        error: errorMessage,
        details: responseData
      });
    }

    const reply = extractReply(responseData);
    if (!reply) {
      return res.status(502).json({
        ok: false,
        status: 502,
        error: 'La API de Gemini devolvió una respuesta incompleta.',
        details: responseData
      });
    }

    return res.status(200).json({
      ok: true,
      status: 200,
      reply
    });
  } catch (error) {
    console.error('ERROR API:', error);
    return res.status(500).json({
      ok: false,
      status: 500,
      error: error.message || 'Error interno del servidor'
    });
  }
}

function extractReply(data) {
  if (!data || typeof data !== 'object') {
    return '';
  }

  const candidate = data?.candidates?.[0] || data?.output?.candidates?.[0] || data?.output?.[0];
  if (candidate) {
    const textPart = candidate?.content?.find((item) => item?.type === 'text')?.text
      || candidate?.content?.[0]?.text
      || candidate?.message?.content?.find((item) => item?.type === 'text')?.text
      || candidate?.message?.content?.[0]?.text;
    if (textPart) {
      return String(textPart).trim();
    }
  }

  const outputText = data?.output?.[0]?.content?.find((item) => item?.type === 'text')?.text;
  if (outputText) {
    return String(outputText).trim();
  }

  if (typeof data?.text === 'string') {
    return data.text.trim();
  }

  return '';
}
