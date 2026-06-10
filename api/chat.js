module.exports = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        ok: false,
        error: "Falta GEMINI_API_KEY"
      });
    }

    if (req.method === "GET") {
      return res.status(200).json({
        ok: true,
        message: "API viva"
      });
    }

    if (req.method !== "POST") {
      return res.status(405).json({
        ok: false,
        error: "Solo POST permitido"
      });
    }

    let body = req.body;

    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    const messages = Array.isArray(body?.messages) ? body.messages : [];

    if (messages.length === 0) {
      return res.status(400).json({
        ok: false,
        error: "messages requerido"
      });
    }

    const systemPrompt =
      body?.systemPrompt ||
      "Eres Gandalf el mago gris, un asistente sabio y claro.";

    const contents = [
      {
        role: "user",
        parts: [{ text: systemPrompt }]
      },
      ...messages.map((m) => ({
        role: m.role === "model" ? "model" : "user",
        parts: [{ text: m.text || "" }]
      }))
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents })
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return res.status(200).json({
      ok: true,
      reply
    });

  } catch (error) {
    console.error("CRASH:", error);

    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};