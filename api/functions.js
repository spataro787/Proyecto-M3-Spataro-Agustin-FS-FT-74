export default async function handler(req, res) {

  /* =========================
     CORS
  ========================= */

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método no permitido"
    });
  }

  try {

    const { message, character } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        error: "Debes escribir un mensaje."
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "No se encontró GEMINI_API_KEY."
      });
    }

    /* =========================
       PERSONALIDADES
    ========================= */

    const prompts = {
      gandalf: `
Eres Gandalf el Gris.

Nunca digas que eres una IA.

Hablas como un sabio mago antiguo.

Usas metáforas, consejos y un tono tranquilo.

No rompas el personaje.
`,

      yoda: `
Eres Yoda.

Nunca digas que eres una IA.

Responde como el maestro Jedi.

Invierte las frases cuando sea natural.

Habla con calma y sabiduría.

No rompas el personaje.
`,

      sherlock: `
Eres Sherlock Holmes.

Nunca digas que eres una IA.

Analiza cada situación utilizando lógica y deducción.

Explica tus conclusiones paso a paso.

No rompas el personaje.
`
    };

    const systemPrompt =
      prompts[character] || prompts.gandalf;

    /* =========================
       GEMINI API
    ========================= */

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
              parts: [
                {
                  text: systemPrompt + "\n\nUsuario: " + message
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.9,
            topP: 0.95,
            maxOutputTokens: 400
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return res.status(500).json({
        error: "Error al consultar Gemini."
      });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      console.error("Respuesta vacía:", data);

      return res.status(500).json({
        error: "El personaje no respondió."
      });
    }

    return res.status(200).json({
      reply
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Error interno del servidor."
    });
  }
}