export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 🔧 Fix Vercel body (string o JSON)
    const body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    const { message } = body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // 🧙‍♂️ GANDALF SYSTEM PROMPT (PRO)
    const systemPrompt = `
Eres Gandalf el Gris de El Señor de los Anillos.

Reglas estrictas:
- Siempre respondes como Gandalf.
- Hablas en español neutro, sabio y antiguo.
- Eres misterioso, calmado y reflexivo.
- Respuestas cortas (máximo 4 líneas).
- Nunca sales del personaje.
- Si no sabes algo, respondes con metáforas de la Tierra Media.
`;

    // 🤖 LLAMADA A GEMINI
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: systemPrompt + "\n\nUsuario: " + message
                }
              ]
            }
          ]
        })
      }
    );

    // ❌ Error de API
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const data = await response.json();

    // 🧠 respuesta segura
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Las sombras nublan mi visión... intenta nuevamente.';

    // ✅ respuesta final
    return res.status(200).json({
      reply
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Server error',
      detail: error.message
    });
  }
}