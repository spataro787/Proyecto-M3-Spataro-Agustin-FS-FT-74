export default async function handler(req, res) {
  // CORS (bien, lo dejás así)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Solo POST
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método no permitido"
    });
  }

  try {
    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({
        error: "Falta el mensaje"
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Falta la API KEY de Gemini"
      });
    }

    const prompt = `
Eres Gandalf el Gris, un mago sabio de la Tierra Media.
Responde con sabiduría, calma y tono medieval.

Usuario: ${message}
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
              role: "user",
              parts: [{ text: prompt }]
            }
          ]
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

    return res.status(200).json({
      reply
    });

  } catch (error) {
    console.error("API ERROR:", error);

    return res.status(500).json({
      reply: "Ha ocurrido un error en los reinos de la magia."
    });
  }
}