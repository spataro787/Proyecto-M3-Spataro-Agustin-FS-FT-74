/* =========================
   SPA NAVIGATION
========================= */

function showView(viewId) {
  document.querySelectorAll(".view").forEach(v => {
    v.classList.remove("active");
  });

  const target = document.getElementById(viewId);

  if (target) {
    target.classList.add("active");
  }
}

window.showView = showView;

/* =========================
   CHAT GANDALF AI
========================= */

async function sendMessage(message) {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    return data.reply;
  } catch (error) {
    console.error("Error chat:", error);
    return "Las fuerzas de la magia fallaron...";
  }
}

/* =========================
   UI CHAT
========================= */

function addMessage(role, text) {
  const chatBox = document.getElementById("chat-box");

  const msg = document.createElement("div");
  msg.classList.add("message", role);
  msg.textContent = text;

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

/* =========================
   EVENTO SEND
========================= */

document.addEventListener("DOMContentLoaded", () => {
  showView("home");

  const input = document.getElementById("input");
  const button = document.getElementById("sendBtn");

  if (!input || !button) return;

  button.addEventListener("click", async () => {
    const message = input.value.trim();
    if (!message) return;

    // mensaje usuario
    addMessage("user", message);

    input.value = "";

    // loader opcional
    addMessage("gandalf", "...");
    
    const reply = await sendMessage(message);

    // borrar "..."
    const chatBox = document.getElementById("chat-box");
    chatBox.lastChild.remove();

    // respuesta Gandalf
    addMessage("gandalf", reply);
  });
});