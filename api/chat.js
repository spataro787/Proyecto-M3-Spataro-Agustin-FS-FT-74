module.exports = async (req, res) => {
  // Solo permitir POST
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed. Use POST."
    });
  }

  try {
    // Validar API KEY
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({
        ok: false,
        error: "Configuración del servidor incompleta. API key no configurada."
      });
    }

    // Leer body
    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({
        ok: false,
        error: "Falta el campo 'message' en el body."
      });
    }

    // Llamada a Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: message }
              ]
            }
          ]
        })
      }
    );

    // Si Gemini falla
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(500).json({
        ok: false,
        error: "Error en Gemini API",
        details: errorText
      });
    }

    const data = await response.json();

    // Extraer respuesta segura
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sin respuesta del modelo";

    return res.status(200).json({
      ok: true,
      response: text
    });

  } catch (error) {
    console.error("API ERROR:", error);

    return res.status(500).json({
      ok: false,
      error: "Error interno del servidor",
      details: error.message
    });
  }
};