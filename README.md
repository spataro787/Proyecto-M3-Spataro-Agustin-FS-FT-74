# Gandalf el Gris AI Chat - Single Page Application

Una Single Page Application interactiva que permite conversar con una versión de IA de **Gandalf el Gris**. La aplicación utiliza Google Gemini AI para generar respuestas coherentes y en el tono del personaje.

## 🎯 Características

- ✅ **SPA con Routing**: Navegación fluida sin recargas usando History API
- ✅ **Responsive Design**: Optimizado para móvil, tablet y desktop (mobile-first)
- ✅ **Chat Interactivo**: Conversación en tiempo real con Gandalf el Gris
- ✅ **API Segura**: Vercel Serverless Functions protegen la API key
- ✅ **Historial de Sesión**: Mantiene el contexto de la conversación durante la sesión
- ✅ **Sin Vite ni Vitest**: Funciona como sitio estático con un build Node simple
- ✅ **Accesibilidad**: Soporte para navegación por teclado y modo oscuro

## 📋 Requisitos

- Node.js 16+ 
- npm o yarn
- Cuenta de Google Cloud con acceso a Gemini API
- Cuenta de Vercel (para despliegue)

## 🚀 Instalación Local

### Enlace activo en Vercel

El proyecto ya está desplegado en Vercel y se puede ver aquí:

https://ai-chat-a4byzkn5n-agustin-s-projects26.vercel.app

### 1. Clonar o descargar el proyecto

```bash
cd ai-chat-spa
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Obtener API Key de Google Gemini

**Este paso es REQUERIDO para que el chat funcione.**

#### Opción A: Usando Google AI Studio (Recomendado para desarrollo)

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Haz clic en **"Create API Key"** → **"Create new secret key in new project"**
3. Copia la API key generada
4. La clave se ve así: `AIzaSy...` (una cadena larga alfanumérica)

#### Opción B: Usando Google Cloud Console (Para producción)

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto
3. Ve a "APIs & Services" → "Credentials"
4. Crea una nueva API Key
5. Habilita Google Generative AI API para tu proyecto

### 4. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Abre `.env` y agrega tu API key:

```env
GEMINI_API_KEY=tu_api_key_aqui
```

Reemplaza `tu_api_key_aqui` con tu API key real de Google.

#### Para Despliegue en Vercel

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Abre **Settings** → **Environment Variables**
3. Agrega una nueva variable:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Tu API key de Google Gemini
4. Haz deploy nuevamente para que los cambios tomen efecto

**⚠️ IMPORTANTE**: 
- NUNCA hagas commit del `.env` con tu API key real (está en `.gitignore`)
- Mantén tu API key segura, no la compartas en redes sociales o repositorios públicos
- Google Gemini tiene un tier gratuito generoso para desarrollo

## 💻 Uso

### Generar archivos estáticos

```bash
npm run build
```

Esto copia los archivos dentro de `src/` a `dist/` para despliegue.

### Ejecutar el proyecto localmente sin Vite

```bash
npm install
npm run dev
```

Esto genera los archivos estáticos en `dist/` y sirve la aplicación localmente en el puerto `5173`.

### Build para Producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

### Vista Previa de Producción

```bash
npm run preview
```

## 📱 Rutas Disponibles

| Ruta | Descripción |
|------|-------------|
| `/home` | Página de inicio con información de Gandalf |
| `/chat` | Interfaz de chat interactivo |
| `/about` | Información del proyecto y créditos |

## 🤖 Sobre el Personaje: Gandalf el Gris

**Gandalf el Gris** es un mago de la Tierra Media que:

- Es un protector de la Tierra Media y defensor de la esperanza contra la oscuridad
- Dirige con consejo sabio, historias antiguas y firmeza amable
- Conoce la historia de Elfos, Hombres, Enanos y criaturas mágicas
- Su voz inspira valor, perseverancia y compasión

### System Prompt

El `system prompt` define cómo habla Gandalf. Incluye:

- **Personalidad**: Sabio, paciente, serio y esperanzador
- **Temas**: Tierra Media, magia, historia, valor, amistad
- **Tono**: Noble y accesible, preciso pero sencillo
- **Limitaciones**: Respuestas cortas, sin spoilers, comparaciones con sabiduría antigua

Ver [chat.js](src/chat.js) para el prompt completo.

## 🏗️ Estructura del Proyecto

```
ai-chat-spa/
├── api/
│   └── chat.js                # Vercel Serverless Function (proxy para Gemini)
├── src/
│   ├── index.html             # HTML principal
│   ├── styles.css             # Estilos CSS mobile-first
│   ├── app.js                 # Lógica de routing y aplicación
│   ├── chat.js                # Lógica del chat y ChatManager
│   └── utils.js               # Funciones de utilidad
├── tests/
│   ├── utils.test.js          # Tests para funciones de utilidad
│   └── chat.test.js           # Tests para ChatManager
├── package.json               # Dependencias y scripts
├── scripts/                   # Scripts de construcción y utilidades
│   └── build.js               # Copia archivos estáticos a dist
├── vercel.json                # Configuración de Vercel
├── .env.example               # Plantilla de variables de entorno
├── .gitignore                 # Archivos a ignorar
└── README.md                  # Este archivo
```

## 🔒 Seguridad

### Protección de API Key

La API key de Gemini **NUNCA** está expuesta en el frontend. El flujo es:

```
Frontend (cliente) 
  → fetch a /api/chat
  → Vercel Serverless Function
  → Lee GEMINI_API_KEY desde variables de entorno
  → Llama a Gemini API
  → Devuelve respuesta al cliente
```

### Validaciones

- Validación de entrada en frontend y backend
- Sanitización de HTML para prevenir XSS
- CORS configurado para Vercel
- Rate limiting mediante configuración de Vercel

## 📊 Pruebas de Referencia

La carpeta `tests/` contiene ejemplos de pruebas para las funciones del proyecto, pero la versión actual ya no depende de Vitest para ejecutarse localmente.

## 📱 Responsive Design

### Breakpoints

| Dispositivo | Ancho | CSS |
|-------------|-------|-----|
| Móvil | 320-767px | Estilos base |
| Tablet | 768-1023px | `@media (min-width: 768px)` |
| Desktop | 1024px+ | `@media (min-width: 1024px)` |

### Prueba en DevTools

1. Abre DevTools (F12)
2. Presiona `Ctrl+Shift+M` para modo responsive
3. Prueba en tamaños: 375px (móvil), 768px (tablet), 1024px (desktop)

## 🌙 Modo Oscuro

La aplicación soporta modo oscuro automáticamente:

```css
@media (prefers-color-scheme: dark) {
    /* Estilos para modo oscuro */
}
```

## 🚀 Despliegue en Vercel

### Opción 1: Desde GitHub (Recomendado)

1. Sube el proyecto a GitHub
2. Ve a [Vercel](https://vercel.com) y conecta tu repositorio
3. Configura las variables de entorno en Project Settings:
   - `GEMINI_API_KEY`: Tu API key de Gemini
4. Deploy automático al hacer push a `main`

### Opción 2: CLI de Vercel

```bash
npm i -g vercel
vercel login
vercel
# Seguir las instrucciones
```

### Verificar Despliegue

```bash
# Probar la URL generada por Vercel
# Debería funcionar exactamente como en local

# Para verificar que las serverless functions funcionan:
# 1. Abre el chat
# 2. Envía un mensaje
# 3. Verifica que Gandalf responda
```

## 🐛 Debugging

### Logs en Consola

La aplicación usa `debugLog()` que solo muestra logs en desarrollo:

```javascript
import { debugLog } from './utils.js';

debugLog('Mi mensaje', { datos: 'aquí' });
// Solo se muestra cuando el entorno es development
```

### Ver Logs en Vercel

```bash
vercel logs <URL-del-proyecto>
```

### Desactivar Logs

En `utils.js`:
```javascript
export function debugLog(message, data = null) {
    if (getEnvironment() === 'development') {
        // Comentar estas líneas para desactivar logs
        // if (data) { console.log(...) }
    }
}
```

## ⚙️ Variables de Entorno

### Desarrollo (.env)

```env
GEMINI_API_KEY=tu_api_key_aqui
```

### Producción (Vercel)

Configurar solo en dashboard de Vercel:
```
GEMINI_API_KEY=sk-...
```

⚠️ **NUNCA** subas `.env` al repositorio. Está incluido en `.gitignore`.

## 🤝 Convenciones de Código

### Nombres

- Archivos: `kebab-case.js`
- Clases: `PascalCase`
- Funciones: `camelCase()`
- Constantes: `UPPER_SNAKE_CASE`
- ID elementos HTML: `kebab-case`
- Atributos data: `data-route`

### Comentarios

```javascript
/**
 * Descripción breve de qué hace
 * @param {type} name - Descripción
 * @returns {type} Descripción de retorno
 */
function myFunction(name) {
    // Comentario en línea si es necesario
}
```

### Formato CSS

- Mobile-first
- VariablesCSS para colores y espaciado
- Utilities para clases reutilizables
- BEM-like naming cuando es necesario

## 🚨 Errores Comunes

### "API key no configurada"

**Problema**: Error 500 al enviar mensaje
**Solución**: 
```bash
# Verificar que GEMINI_API_KEY está en Vercel dashboard
vercel env ls
```

### "CORS error"

**Problema**: Cross-origin request blocked
**Solución**: Vercel configura CORS automáticamente. Si persiste, revisar `api/chat.js`

### Tests fallan

**Problema**: Hay pruebas de referencia pero no hay runner configurado.
**Solución**: El proyecto local se ejecuta con `npm run dev` y la aplicación es estática.

### Cambios no aparecen en Vercel

**Problema**: Despliegue completo pero cambios no se ven
**Solución**: 
```bash
# Hacer un nuevo push a main
git add .
git commit -m "fix: descripción"
git push origin main
# Esperar a que Vercel redeploye
```

## 📚 Recursos Útiles

- [Google Gemini API](https://ai.google.dev)
- [Vercel Docs](https://vercel.com/docs)
- [History API MDN](https://developer.mozilla.org/es/docs/Web/API/History_API)
- [Responsive Design MDN](https://developer.mozilla.org/es/docs/Learn/CSS/CSS_layout/Responsive_Design)

## 📝 Licencia

Este proyecto fue desarrollado con fines educativos y de aprendizaje, con apoyo y asistencia en su construcción.

## 👨‍💻 Autor

Agustin spataro 

---

**Última actualización**: Junio 2026

Para preguntas o problemas, abre un issue o contacta al autor.
