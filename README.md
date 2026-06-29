# 🧙 Fantasy AI Chat - SPA

Una Single Page Application (SPA) interactiva que permite conversar con distintos personajes de fantasía mediante inteligencia artificial utilizando Google Gemini AI.

El proyecto está construido con HTML, CSS y JavaScript puro, con backend serverless desplegado en Vercel.

---

## 🔗 Demo en vivo

https://proyecto-m3-spataro-agustin-fs-ft-7.vercel.app/

---

## 🎯 Características

- SPA sin recargas de página
- Navegación entre vistas (Inicio / Chat / Acerca)
- Selección de personajes de fantasía
- Chat con inteligencia artificial
- Integración con Google Gemini API
- Backend serverless en Vercel (API protegida)
- Interfaz tipo chat con burbujas de mensaje
- Diseño responsive (mobile-first)
- Estética inspirada en fantasía medieval

---

## 🧙 Personajes

El sistema permite interactuar con distintos personajes:

- 🧙 Gandalf: sabio, misterioso y calmado
- 🟢 Yoda: maestro Jedi, habla de forma particular y reflexiva
- 🕵️ Sherlock Holmes: lógico, analítico y deductivo

Cada personaje tiene una personalidad definida mediante system prompt.

---

## 📁 Estructura del proyecto
ai-chat-spa/
├── api/
│ └──functions.js
├── images/
│ ├── gandalf.png
│ ├── yoda.png
│ └── sherlock.png
├── assets/
│ ├── app.js
│ ├── chat.js
│ └── styles.css
├── index.html
├── package.json
└── README.md


---

## 🚀 Funcionamiento

### Flujo del chat

Frontend → API /api/chat → Vercel Function → Google Gemini API → Respuesta → Frontend

---

## 💬 Uso de la aplicación

1. Ingresar a la página
2. Seleccionar un personaje
3. Ir al chat
4. Escribir un mensaje
5. Recibir respuesta del personaje con su personalidad

---

## 🔐 Seguridad

La API Key se almacena como variable de entorno en Vercel:

GEMINI_API_KEY=tu_api_key

Nunca se expone en el frontend.

---

## 📱 Diseño responsive

- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+

---

## 🛠️ Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)
- Vercel Serverless Functions
- Google Gemini API

---

## ⚙️ Instalación y ejecución local

npm install
npm run dev

Luego abrir:

http://localhost:5173

---

## 🚀 Deploy en Vercel

1. Subir el proyecto a GitHub
2. Importar en Vercel
3. Agregar variable de entorno:

GEMINI_API_KEY

4. Deploy automático

---

## 🧪 API

### POST /api/chat

Request:

{
  "message": "Hola Gandalf"
}

Response:

{
  "reply": "Respuesta del personaje..."
}

---

## 🐛 Problemas comunes

- Error 404: archivo api/chat.js mal ubicado
- Error 500: problema con Gemini API o API key
- Chat no responde: revisar método POST en frontend

---

## 👨‍💻 Autor

Agustín Spataro