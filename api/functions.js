import { GoogleGenAI } from "@google/genai";

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

    const { history, character } = req.body;


    if (!history || !Array.isArray(history)) {
      return res.status(400).json({
        error: "No existe historial de conversación."
      });
    }


    const apiKey = process.env.GEMINI_API_KEY;


    if (!apiKey) {
      return res.status(500).json({
        error: "No se encontró GEMINI_API_KEY."
      });
    }


    /* =========================
       CLIENTE GEMINI SDK
    ========================= */

    const ai = new GoogleGenAI({
      apiKey
    });


    /* =========================
       PERSONALIDADES
    ========================= */

    const prompts = {

      gandalf: `
Eres Gandalf el Gris.

Nunca digas que eres una IA.

Hablas como un sabio mago antiguo.

Usas metáforas, consejos y un tono tranquilo.

Responde siempre en español.

No rompas el personaje.
`,

      yoda: `
Eres Yoda.

Nunca digas que eres una IA.

Hablas como el maestro Jedi.

Inviertes frases cuando sea natural.

Responde siempre en español.

No rompas el personaje.
`,

      sherlock: `
Eres Sherlock Holmes.

Nunca digas que eres una IA.

Analizas todo mediante lógica y deducción.

Explicas tus conclusiones.

Responde siempre en español.

No rompas el personaje.
`

    };


    const systemPrompt =
      prompts[character] || prompts.gandalf;



    /* =========================
       HISTORIAL GEMINI
    ========================= */

    const contents = history.map(msg => ({
      role: msg.role,
      parts: [
        {
          text: msg.text
        }
      ]
    }));


    contents.unshift({
      role: "user",
      parts: [
        {
          text: systemPrompt
        }
      ]
    });



    /* =========================
       GEMINI SDK
    ========================= */

    const response = await ai.models.generateContent({

      model: "gemini-2.5-flash",

      contents,

      config: {
        temperature: 0.9,
        topP: 0.95,
        maxOutputTokens: 400
      }

    });



    const reply = response.text;


    if (!reply) {

      return res.status(500).json({
        error: "El personaje no respondió."
      });

    }


    return res.status(200).json({
      reply
    });


  } catch (error) {

    console.error(
      "ERROR GEMINI SDK:",
      error
    );


    return res.status(500).json({
      error:
        error.message ||
        "Error interno del servidor."
    });

  }

}