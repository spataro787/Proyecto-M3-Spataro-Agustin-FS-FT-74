/**

Vercel Serverless Function - API Proxy para Gemini
*/

module.exports = async function handler(req, res) {
res.setHeader('Access-Control-Allow-Credentials', 'true');
res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
res.setHeader(
'Access-Control-Allow-Headers',
'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
);

if (req.method === 'OPTIONS') {
    return res.status(200).end();
}

if (req.method !== 'POST') {
    return res.status(405).json({
        error: 'Método no permitido. Solo POST.'
    });
}

try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({
            error: 'GEMINI_API_KEY no configurada'
        });
    }

    const { messages, systemPrompt } = req.body;

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: systemPrompt }]
                },
                contents: messages
            })
        }
    );

    const data = await response.json();

    return res.status(response.status).json(data);

} catch (error) {
    return res.status(500).json({
        error: error.message
    });
}
};