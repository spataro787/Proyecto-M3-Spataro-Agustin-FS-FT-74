Personaje Elegido: Ada Lovelace
Tema: Pionera de la programación, matemática visionaria
Personalidad: Sofisticada, educada, apasionada, de tono formal pero amigable

SYSTEM PROMPT (completo en src/chat.js):
- Define cómo habla Ada
- Especifica sus conocimientos y limitaciones
- Asegura respuestas cortas apropiadas para chat
- Enfatiza conexión con matemáticas e historia de computación

FEATURES IMPLEMENTADAS:
✅ SPA con History API - 3 rutas (/home, /chat, /about)
✅ Responsive Design Mobile-First - 3 breakpoints (320px, 768px, 1024px)
✅ Chat con historial en memoria
✅ Vercel Serverless Function como proxy seguro para Gemini API
✅ System Prompt bien diseñado para la personalidad de Ada
✅ 35 tests unitarios con Vitest (utils.test.js: 24, chat.test.js: 11)
✅ Documentación completa en README.md
✅ CORS, validaciones y sanitización HTML
✅ Manejo de errores y estados de carga
✅ Modo oscuro automático (prefers-color-scheme)
✅ Accesibilidad (ARIA labels, navegación por teclado)

ESTRUCTURA DE ARCHIVOS:
/api/functions.js - Serverless Function que protege API key
/src/index.html - HTML responsive
/src/styles.css - CSS mobile-first con variables y breakpoints
/src/app.js - Router SPA y lógica principal
/src/chat.js - ChatManager y system prompt de Ada
/src/utils.js - Utilidades reutilizables
/tests/ - Suite de tests
.env.example - Plantilla sin valores reales
README.md - Documentación completa

SEGURIDAD API:
- API key NUNCA en frontend
- Vercel Serverless Function como intermediario
- CORS configurado
- Validaciones de entrada en cliente y servidor
- Sanitización HTML contra XSS

PARA EJECUTAR LOCALMENTE:
npm install
npm run dev
# URL: http://localhost:5173

PARA DESPLEGAR EN VERCEL:
1. Subir a GitHub
2. Conectar repo en Vercel
3. Configurar GOOGLE_GEMINI_API_KEY en environment variables
4. Deploy automático

BUENAS PRÁCTICAS IMPLEMENTADAS:
- Separación de responsabilidades (routing, chat, utils)
- Funciones pequeñas y reutilizables
- CSS con variables para fácil mantenimiento
- Tests unitarios para funciones críticas
- Documentación clara y ejemplos
- Git-friendly (.gitignore correcto)
- Mobile-first approach
- Async/await para API calls
- Error handling completo
