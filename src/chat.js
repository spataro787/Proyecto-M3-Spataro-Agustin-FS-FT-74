export default class ChatManager {
  constructor() {
    this.messages = [];
    this.apiUrl = "/api/chat";
  }

  initializeChat() {
    this.loadFromStorage();
  }

  // 🧠 Obtener mensajes
  getMessages() {
    return this.messages;
  }

  // 💬 Agregar mensaje local
  addMessage(text, sender = "user") {
    const message = {
      id: Date.now(),
      text,
      sender
    };

    this.messages.push(message);
    return message;
  }

  // 💾 Guardar en memoria (opcional simple)
  saveToStorage() {
    // no obligatorio, pero útil
    // sessionStorage.setItem("chat", JSON.stringify(this.messages));
  }

  loadFromStorage() {
    // const data = sessionStorage.getItem("chat");
    // if (data) this.messages = JSON.parse(data);
  }

  // 🤖 ENVIAR MENSAJE A LA API
  async sendMessage(text) {
    // 1. agregar mensaje del usuario
    this.addMessage(text, "user");

    // 2. mostrar loading temporal (mensaje IA fake)
    const loadingMessage = this.addMessage("Gandalf está pensando...", "ai");

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: text
        })
      });

      const data = await response.json();

      // 3. reemplazar loading por respuesta real
      this.replaceMessage(
        loadingMessage.id,
        data.reply || "Las sombras no me permiten responder..."
      );

    } catch (error) {
      this.replaceMessage(
        loadingMessage.id,
        "Los vientos de la magia fallaron... intenta nuevamente."
      );
    }
  }

  // 🔁 Reemplazar mensaje (clave para loading)
  replaceMessage(id, newText) {
    const msg = this.messages.find(m => m.id === id);
    if (msg) {
      msg.text = newText;
      msg.sender = "ai";
    }
  }

  // 🧹 Limpiar chat (opcional)
  clearChat() {
    this.messages = [];
  }
}