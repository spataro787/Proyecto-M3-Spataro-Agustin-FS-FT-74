const messages = document.getElementById("messages");
const input = document.getElementById("input");

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.textContent = text;

  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  // loading
  const loading = document.createElement("div");
  loading.className = "message bot";
  loading.textContent = "🧙 Gandalf está consultando el destino...";
  messages.appendChild(loading);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      cache: "no-store", // 🔥 evita respuestas cacheadas
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();

    // quitar loading
    loading.remove();

    if (!res.ok) {
      addMessage(data.error || "Error en la magia", "bot");
      return;
    }

    // respuesta final
    addMessage(data.reply, "bot");

  } catch (err) {
    console.error("ERROR CHAT:", err);

    loading.remove();
    addMessage("Las fuerzas de la magia fallaron: " + err.message, "bot");
  }
}

// global (necesario porque usas onclick en HTML)
window.sendMessage = sendMessage;