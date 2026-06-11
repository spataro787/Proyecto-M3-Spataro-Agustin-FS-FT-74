# 🧙 Gandalf AI Chat - SPA

Una Single Page Application (SPA) interactiva que permite conversar con una versión de IA de Gandalf el Gris utilizando Google Gemini AI.

El proyecto está construido con HTML, CSS y JavaScript puro, con backend serverless en Vercel.

---
http://192.168.100.142:8080/

## 🎯 Características

- SPA sin recargas de página
- Navegación entre vistas (Inicio / Chat / Acerca)
- Chat con IA (Gandalf el Gris)
- Integración con Google Gemini API
- API Key protegida en backend (Vercel Functions)
- Diseño responsive mobile-first
- Interfaz de chat estilo burbujas
- System prompt con personalidad definida
- Estética inspirada en fantasía (Tierra Media)

---

## 📁 Estructura del proyecto

ai-chat-spa/
├── api/
│   └── chat.js
├── index.html
├── app.js
├── chat.js
├── styles.css
├── package.json
└── README.md

---

## 🚀 Funcionalidad

### SPA (Routing manual)

- /home → Inicio
- /chat → Chat con Gandalf
- /about → Información del proyecto

---

### 💬 Chat con IA

Flujo:

Frontend → /api/chat → Vercel Function → Gemini API → Respuesta

---

## 🧙 Personaje: Gandalf el Gris

Gandalf responde:

- Sabio
- Misterioso
- En español
- Máximo 4 líneas
- Siempre en personaje

---

## 🔐 Seguridad

La API Key se almacena en Vercel como variable de entorno:

GEMINI_API_KEY=tu_api_key

Nunca se expone en el frontend.

---

## 📱 Responsive Design

- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+

---

## 🛠️ Tecnologías

- HTML5
- CSS3
- JavaScript Vanilla
- Vercel Serverless Functions
- Google Gemini API

---

## ⚙️ Instalación local

npm install
npm run dev

Abrir:

http://localhost:5173

---

## 🚀 Deploy en Vercel

1. Subir proyecto a GitHub
2. Importar en Vercel
3. Agregar variable de entorno:

GEMINI_API_KEY

4. Deploy automático

---

## 🧪 API

POST /api/chat

Request:

{
  "message": "Hola Gandalf"
}

Response:

{
  "reply": "Respuesta de Gandalf..."
}

---

## 🐛 Errores comunes

- Error al conectar → falta API key
- 404 → api/chat.js mal ubicado
- 500 → error en Gemini API

---

## 👨‍💻 Autor

Agustin Spataro

