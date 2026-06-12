export default async function handler(req, res) {
  // CORS (opcional pero correcto)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Solo POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { message } = req.body || {};

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Falta el mensaje" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Falta la API KEY de Gemini" });
    }

    // 🧙‍♂️ SYSTEM PROMPT
    const systemPrompt = `
Eres Gandalf el Gris de El Señor de los Anillos.

REGLAS:
- Nunca salgas del personaje
- Habla como un mago sabio, antiguo y misterioso
- No digas que eres una IA
- No repitas respuestas
- Sé creativo y coherente
`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt },
                { text: message }
              ]
            }
          ],
          generationConfig: {
            temperature: 1,
            topP: 0.95,
            maxOutputTokens: 400
          }
        })
      }
    );

    const data = await geminiResponse.json();

    // 🔴 DEBUG REAL SI FALLA GEMINI
    if (!geminiResponse.ok) {
      console.error("GEMINI ERROR:", JSON.stringify(data, null, 2));

      return res.status(500).json({
        error: "Error al consultar el oráculo"
      });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.status(500).json({
        error: "El oráculo no respondió correctamente"
      });
    }

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("API ERROR:", error);

    return res.status(500).json({
      error: "Error interno del servidor"
    });
  }
}