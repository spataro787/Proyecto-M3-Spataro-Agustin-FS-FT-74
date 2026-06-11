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
  loading.textContent = "Gandalf está escribiendo...";
  messages.appendChild(loading);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();

    // quitar loading
    loading.remove();

    addMessage(data.reply || "Sin respuesta de Gandalf", "bot");

  } catch (err) {
    loading.remove();
    addMessage("Error al conectar con Gandalf", "bot");
  }
}

// global
window.sendMessage = sendMessage;