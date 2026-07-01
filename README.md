# 🧙 Fantasy AI Chat - SPA

Una **Single Page Application (SPA)** interactiva que permite conversar con personajes icónicos de la fantasía y la ficción mediante inteligencia artificial utilizando **Google Gemini AI**.

El proyecto fue desarrollado con **HTML, CSS y JavaScript puro**, implementando un backend **Serverless** desplegado en **Vercel** para proteger la API Key y gestionar las peticiones a la IA.

---

## 🌐 Demo en vivo

🔗 https://proyecto-m3-spataro-agustin-fs-ft-7.vercel.app/

---

## ✨ Características principales

* ⚡ Single Page Application sin recargas de página.
* 🧭 Navegación dinámica mediante JavaScript y History API.
* 🧙 Selección entre múltiples personajes con personalidades únicas.
* 🤖 Integración con Google Gemini AI.
* 💬 Interfaz de chat moderna con burbujas diferenciadas.
* ⌛ Indicador visual mientras la IA genera respuestas.
* 💾 Persistencia del historial mediante Local Storage.
* 🗑️ Opción para borrar el historial de cada personaje.
* 📱 Diseño responsive adaptado a móviles, tablets y escritorio.
* 🏰 Estética inspirada en la fantasía medieval y épica.

---

# 🧙 Personajes disponibles

## 🧙 Gandalf el Gris

El sabio mago de la Tierra Media.

* Respuestas tranquilas y reflexivas.
* Uso de metáforas y enseñanzas.
* Tono místico y ancestral.

---

## 🟢 Maestro Yoda

Legendario Maestro Jedi y guardián de la Fuerza.

* Habla con la estructura característica de Yoda.
* Respuestas llenas de paciencia y sabiduría.
* Consejos orientados al equilibrio interior.

---

## 🕵️ Sherlock Holmes

El detective más brillante de la ficción.

* Pensamiento lógico y deductivo.
* Explicaciones paso a paso.
* Observación y análisis de cada detalle.

---

Cada personaje posee un **System Prompt independiente**, permitiendo mantener una personalidad consistente durante toda la conversación.

---

# 📁 Estructura del proyecto

```text
Fantasy-AI-Chat/

├── api/
│   └── functions.js

├── assets/
│   ├── app.js
│   ├── chat.js
│   ├── utils.js
│   └── styles.css

├── images/
│   ├── Captura de pantalla
│   ├── Caputa de pantalla
│   ├── Captura de pantalla 
    ├──  Gandalf.png
    ├──  Sherlock.png
    └── Yoda.png
  

├── tests/
│   ├── chat.test.js
│   ├── utils.test.js
│   └── app.test.js

├── index.html
├── package.json
├── vite.config.js
├── vitest.config.js.bak
└── README.md
```


# 🔄 Funcionamiento de la aplicación

```text
Usuario
   ↓
Frontend (SPA)
   ↓
/api/functions
   ↓
Vercel Serverless Function
   ↓
Google Gemini API
   ↓
Respuesta del personaje
   ↓
Frontend
```

---

# 💬 Uso de la aplicación

1. Ingresar al sitio web.
2. Elegir uno de los personajes disponibles.
3. Acceder a la vista de chat.
4. Escribir un mensaje.
5. Recibir una respuesta generada por IA respetando la personalidad seleccionada.

---

# 💾 Persistencia del historial

La aplicación almacena automáticamente las conversaciones utilizando **Local Storage**.

Características:

* Historial independiente para cada personaje.
* Recuperación automática al recargar la página.
* Indicador visual de historial guardado.
* Botón para eliminar conversaciones anteriores.

---

# 🔐 Seguridad

La clave de acceso a Gemini nunca se expone en el frontend.

Se almacena como variable de entorno en Vercel:

```env
GEMINI_API_KEY=tu_api_key
```

Esto garantiza que las solicitudes a la IA sean procesadas únicamente desde el backend.

---

# 📱 Diseño Responsive

La interfaz fue desarrollada siguiendo una estrategia **Mobile First**.

Breakpoints utilizados:

| Dispositivo | Resolución |
| ----------- | ---------- |
| 📱 Mobile   | 320px+     |
| 📲 Tablet   | 768px+     |
| 🖥️ Desktop | 1024px+    |

---

# 🛠️ Tecnologías utilizadas

* HTML5
* CSS3
* JavaScript (Vanilla JS)
* Google Gemini API
* Vercel Serverless Functions
* Local Storage API
* Vite
* Vitest
* Git & GitHub


# ⚙️ Instalación y ejecución local

Clonar el repositorio:

```bash
git clone https://github.com/spataro787/Proyecto-M3-Spataro-Agustin-FS-FT-74.git
```

Instalar dependencias:

```bash
npm install
```

Ejecutar el entorno local:

```bash
npm run dev
```

Abrir en el navegador:

```text
http://localhost:5173
```

---

# 🚀 Deploy en Vercel

1. Subir el proyecto a GitHub.
2. Importar el repositorio en Vercel.
3. Configurar la variable de entorno:

```text
GEMINI_API_KEY
```

4. Realizar el deploy automático.

---

# 🧪 API

## POST `/api/functions`

### Request

```json
{
  "message": "Hola Gandalf",
  "character": "gandalf"
}
```

### Response

```json
{
  "reply": "Un mago nunca llega tarde, ni pronto. Llega exactamente cuando se lo propone."
}
```

---

# 🐛 Problemas comunes

### Error 404

Verificar la ubicación del archivo:

```text
/api/functions.js
```

---

### Error 500

Comprobar:

* La variable `GEMINI_API_KEY`.
* El estado de la API de Gemini.
* Los logs de Vercel.

---

### El chat no responde

Verificar:

* Método `POST`.
* Ruta `/api/functions`.
* Conexión a Internet.
* Configuración de variables de entorno.

---

# 👨‍💻 Autor

**Agustín Spataro**

Proyecto académico desarrollado para practicar:

* Single Page Applications (SPA)
* JavaScript Vanilla
* Integración con APIs externas
* Backend Serverless
* Diseño Responsive
* Desarrollo Full Stack

---

> *"Todo lo que tenemos que decidir es qué hacer con el tiempo que se nos ha dado."* — Gandalf
