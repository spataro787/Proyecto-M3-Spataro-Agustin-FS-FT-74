# 📋 Guía de Configuración - API Keys de Google Gemini

Este documento te ayuda a configurar tu aplicación Gandalf AI Chat con Google Gemini API.

## ¿Por qué necesito una API Key?

Tu aplicación necesita comunicarse con Google Gemini AI para generar respuestas. La API key actúa como tu "contraseña" para acceder al servicio.

## Paso a Paso

### 1. Crear tu API Key (5 minutos)

#### Forma Más Rápida - Google AI Studio

1. Abre en tu navegador: **https://makersuite.google.com/app/apikey**
2. Verás un botón azul que dice **"Create API Key"**
3. Si es la primera vez, te pedirá crear un proyecto (es automático)
4. Se abrirá un modal con tu nueva API key
5. Copia el texto completo (se verá algo como: `AIzaSyD...xyz123...`)

#### Alternativa - Google Cloud Console

1. Ve a: **https://console.cloud.google.com/**
2. En la esquina superior izquierda, selecciona o crea un proyecto nuevo
3. En el menú lateral, busca **"APIs & Services"** → **"Credentials"**
4. Haz clic en **"Create Credentials"** → **"API Key"**
5. Se generará tu API key
6. Cópiala

### 2. Configurar en tu Proyecto Local

#### Archivo .env

1. En la carpeta raíz de tu proyecto, busca el archivo `.env`
   - Si no existe, crea uno

2. Abre `.env` con tu editor de código

3. Si está vacío o solo tiene otras configuraciones, agrega esta línea:
   ```env
   GOOGLE_GEMINI_API_KEY=tu_api_key_aqui
   ```

4. Reemplaza `tu_api_key_aqui` con tu API key real
   - Ejemplo real:
   ```env
   GOOGLE_GEMINI_API_KEY=AIzaSyDL-8UvNV1xQIuB4J5pVX...
   ```

5. **Guarda el archivo** (Ctrl+S o Cmd+S)

### 3. Probar que Funciona

1. En la terminal, navega a tu carpeta del proyecto:
   ```bash
   cd ai-chat-spa
   ```

2. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Abre tu navegador en: **http://localhost:5173**

4. Ve a la sección "Chat" e intenta escribir un mensaje

5. Si Gandalf responde, ¡funciona! ✅

### 4. Desplegar a Vercel (Opcional)

Si quieres que tu aplicación esté en internet en lugar de solo en tu computadora:

1. Ve a **https://vercel.com**
2. Conéctate con tu cuenta de GitHub, GitLab o Bitbucket
3. Importa tu proyecto
4. Vercel te pedirá que configures variables de entorno
5. Agrega:
   - **Nombre**: `GOOGLE_GEMINI_API_KEY`
   - **Valor**: Tu API key
6. Haz clic en Deploy
7. ¡Tu app estará en internet!

## Solución de Problemas

### "Error: GOOGLE_GEMINI_API_KEY no está configurada"

**Causa**: El archivo `.env` no existe o no tiene la API key

**Solución**:
1. Verifica que creaste el archivo `.env` en la carpeta raíz
2. Verifica que escribiste la línea correcta:
   ```env
   GOOGLE_GEMINI_API_KEY=tu_api_key_aqui
   ```
3. Guarda el archivo
4. Reinicia el servidor (`npm run dev`)

### "Error 403 - Acceso Denegado"

**Causa**: La API key es inválida o expiró

**Solución**:
1. Ve a https://makersuite.google.com/app/apikey
2. Elimina tu API key antigua
3. Crea una nueva
4. Reemplaza la antigua en `.env` con la nueva
5. Reinicia el servidor

### "Error: API key no es válida"

**Causa**: La API key tiene espacios extras o caracteres incorrectos

**Solución**:
1. Copia tu API key nuevamente desde Google AI Studio
2. Asegúrate de que en `.env` no haya espacios:
   ```env
   GOOGLE_GEMINI_API_KEY=AIzaSyD...  ❌ MAL - Hay espacios
   GOOGLE_GEMINI_API_KEY=AIzaSyD...  ✅ BIEN - Sin espacios
   ```
3. Guarda y reinicia

## Seguridad - ¡Importante! 🔒

### NO hagas esto:

- ❌ No compartas tu API key en chats, redes sociales o email
- ❌ No la publiques en GitHub (a menos que sea privado)
- ❌ No hagas commit del `.env` con tu API key real
- ❌ No le des acceso a personas que no confíes

### Qué está protegido:

- ✅ El `.env` está en `.gitignore` (no se sube a GitHub)
- ✅ Tu API key nunca se ve en el navegador
- ✅ Se usa solo en el servidor (servidor Vercel)
- ✅ Google limita automáticamente el uso

## Límites y Costos

Google Gemini tiene:
- **Tier Gratuito**: 60 solicitudes por minuto (más que suficiente para aprender)
- **Costos**: Después del tier gratuito, pagas por uso real
- Puedes ver tu uso en: https://aistudio.google.com/app/usagequota

## Preguntas Frecuentes

**P: ¿Puedo usar la misma API key en múltiples proyectos?**
R: Sí, pero es más seguro tener una clave por proyecto.

**P: ¿Qué pasa si alguien obtiene mi API key?**
R: Pueden hacer solicitudes a la API y gastarte dinero. Elimina la clave inmediatamente desde Google AI Studio y crea una nueva.

**P: ¿Puedo usar mi API key en el frontend (navegador)?**
R: No, es inseguro. Por eso este proyecto usa un servidor proxy (Vercel Functions). La clave solo se usa en el servidor.

**P: ¿Cuánto cuesta usar Gemini?**
R: El tier gratuito es generoso. Los costos comienzan desde $0.075 por millón de tokens de entrada.

---

**¿Necesitas ayuda?** Contacta a tu instructor o revisa los documentos del proyecto.
