/* =========================
   ELEMENTOS
========================= */

const chatBox = document.getElementById("chat-box");
const input = document.getElementById("input");
const sendBtn = document.getElementById("sendBtn");

/* =========================
   AGREGAR MENSAJE
========================= */

function addMessage(text, role) {

  if (!chatBox) return;

  const message = document.createElement("div");

  message.classList.add("message");

  if (role === "user") {

    message.classList.add("user");

  } else {

    message.classList.add(window.currentCharacter);

  }

  message.textContent = text;

  chatBox.appendChild(message);

  chatBox.scrollTop = chatBox.scrollHeight;

}

/* =========================
   ENVIAR MENSAJE
========================= */

async function sendMessage() {

  if (!input) return;

  const message = input.value.trim();

  if (!message) return;

  addMessage(message, "user");

  input.value = "";

  const loadingTexts = {

    gandalf: "🧙 Gandalf está consultando los antiguos pergaminos...",

    yoda: "🟢 Paciencia debes tener... pensando estoy...",

    sherlock: "🕵️ Sherlock está analizando las pistas..."

  };

  addMessage(

    loadingTexts[window.currentCharacter] ||

    "⌛ Pensando...",

    "bot"

  );

  try {

    const response = await fetch("/api/functions", {

      method: "POST",

      headers: {

        "Content-Type": "application/json"

      },

      body: JSON.stringify({

        message: message,

        character: window.currentCharacter

      })

    });

    const data = await response.json();

    /* eliminar loader */

    if (chatBox.lastChild) {

      chatBox.removeChild(chatBox.lastChild);

    }

    if (!response.ok) {

      addMessage(

        data.error || "Error al consultar el personaje.",

        "bot"

      );

      return;

    }

    addMessage(data.reply, "bot");

  }

  catch (error) {

    console.error(error);

    if (chatBox.lastChild) {

      chatBox.removeChild(chatBox.lastChild);

    }

    addMessage(

      "⚠️ Ha ocurrido un error inesperado.",

      "bot"

    );

  }

}

/* =========================
   EVENTOS
========================= */

document.addEventListener("DOMContentLoaded", () => {

  if (sendBtn) {

    sendBtn.addEventListener("click", sendMessage);

  }

  if (input) {

    input.addEventListener("keydown", function (event) {

      if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();

        sendMessage();

      }

    });

  }

});

/* =========================
   GLOBAL
========================= */

window.sendMessage = sendMessage;
window.addMessage = addMessage;