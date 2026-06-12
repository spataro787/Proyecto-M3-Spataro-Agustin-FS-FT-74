export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: "Falta el mensaje" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Falta la API KEY de Gemini" });
    }

    // 🧙‍♂️ SYSTEM PROMPT MÁS FUERTE (CLAVE)
    const systemPrompt = `
Eres Gandalf el Gris de El Señor de los Anillos.

REGLAS OBLIGATORIAS:
- Nunca salgas del personaje
- Habla como un mago antiguo, sabio y misterioso
- Evita respuestas repetidas
- Sé creativo y variado en cada respuesta
- No menciones que eres una IA
`;

    const response = await fetch(
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
                { text: `Usuario: ${message}` }
              ]
            }
          ],
          generationConfig: {
            temperature: 1,          // 🔥 más creatividad
            topP: 0.95,
            maxOutputTokens: 400
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Error Gemini:", data);
      return res.status(500).json({
        reply: "Las fuerzas de la magia fallaron al consultar el oráculo."
      });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "Las nieblas de Mordor impiden mi respuesta...";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("API ERROR:", error);

    return res.status(500).json({
      reply: "Ha ocurrido un error en los reinos de la magia."
    });
  }
}