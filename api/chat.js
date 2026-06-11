async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // HEALTH CHECK
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      status: 200,
      message: 'API viva'
    });
  }

  // SOLO POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      status: 405,
      error: 'Método no permitido. Use POST.'
    });
  }

  // API KEY
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('Falta GEMINI_API_KEY en el entorno');
    return res.status(500).json({
      ok: false,
      status: 500,
      error: 'Missing GEMINI_API_KEY in Vercel'
    });
  }

  // BODY PARSE
  let body = req.body;

  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({
        ok: false,
        status: 400,
        error: 'JSON inválido en el body'
      });
    }
  }

  if (!body || typeof body !== 'object') {
    return res.status(400).json({
      ok: false,
      status: 400,
      error: 'Body inválido'
    });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];

  const systemPrompt =
    typeof body.systemPrompt === 'string' && body.systemPrompt.trim()
      ? body.systemPrompt.trim()
      : 'Eres un asistente útil y claro.';

  if (messages.length === 0) {
    return res.status(400).json({
      ok: false,
      status: 400,
      error: 'messages es requerido'
    });
  }

  // FORMATO GEMINI (CORRECTO)
  const contents = [
    {
      role: 'user',
      parts: [{ text: systemPrompt }]
    },
    ...messages.map((msg) => {
      const text = msg?.parts?.[0]?.text || msg?.text || '';
      const role =
        msg?.role === 'assistant'
          ? 'model'
          : 'user';

      return {
        role,
        parts: [{ text }]
      };
    }).filter(m => m.parts[0].text)
  ];

  if (contents.length <= 1) {
    return res.status(400).json({
      ok: false,
      status: 400,
      error: 'No se encontró texto válido en messages'
    });
  }

  const geminiRequest = {
    contents,
    generationConfig: {
      temperature: 0.35,
      topP: 0.95,
      maxOutputTokens: 500
    }
  };

  // Try to use a model from env or a cached working model. If it fails
  // with 404, attempt a small list of fallback model ids until one works.
  const envModel = process.env.GEMINI_MODEL && process.env.GEMINI_MODEL.trim();
  const candidateModels = [
    envModel,
    global.__GEMINI_CACHED_MODEL,
    'gemini-1.5-flash',
    'gemini-1.5',
    'gemini-1.0',
    'text-bison-001',
    'chat-bison-001'
  ].filter(Boolean);

  async function tryModel(modelId) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiRequest)
    });
    const data = await resp.json().catch(() => null);
    return { resp, data };
  }

  try {
    for (const modelId of candidateModels) {
      if (!modelId) continue;
      const { resp, data } = await tryModel(modelId);

      if (!resp) continue;

      // Authentication errors -> stop and report
      if (resp.status === 401 || resp.status === 403) {
        return res.status(401).json({
          ok: false,
          status: 401,
          error: 'Autenticación con Gemini fallida. Verifica GEMINI_API_KEY en Vercel.'
        });
      }

      // If model not found, try next candidate
      if (resp.status === 404) {
        continue;
      }

      if (!resp.ok) {
        return res.status(resp.status).json({
          ok: false,
          status: resp.status,
          error: data?.error?.message || 'Error en Gemini API',
          details: data
        });
      }

      const reply = extractReply(data);
      if (!reply) {
        return res.status(502).json({ ok: false, status: 502, error: 'Respuesta vacía de Gemini', details: data });
      }

      // Cache the working model for future requests (in-memory only)
      try { global.__GEMINI_CACHED_MODEL = modelId; } catch (e) {}

      return res.status(200).json({ ok: true, status: 200, reply, model: modelId });
    }

    // If we reach here, no candidate model worked
    return res.status(502).json({
      ok: false,
      status: 502,
      error: 'Ningún modelo disponible funcionó con tu clave. Revisa permisos del API key o configura `GEMINI_MODEL` en Vercel.',
    });

  } catch (error) {
    console.error('ERROR API:', error);
    return res.status(500).json({ ok: false, status: 500, error: error.message || 'Error interno del servidor' });
  }
}

export default handler;
// EXTRACTOR CORRECTO
function extractReply(data) {
  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    ''
  ).trim();
}